// Slack provider module implements model/runtime integration.
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { channelBlockedPatch, channelReadyPatch } from "openclaw/plugin-sdk/gateway-runtime";
import {
  asOptionalRecord as asRecord,
  normalizeOptionalString,
} from "openclaw/plugin-sdk/string-coerce-runtime";
import type { SlackChannelResolution } from "../resolve-channels.js";
import type { SlackUserResolution } from "../resolve-users.js";
import type { SlackIdentityHealth } from "./enterprise-install.js";
import { formatUnknownError, waitForSlackSocketDisconnect } from "./reconnect-policy.js";

type SlackAppConstructor = typeof import("@slack/bolt").App;
type SlackHttpReceiverConstructor = typeof import("@slack/bolt").HTTPReceiver;
type SlackReceiver = import("@slack/bolt").Receiver;
type SlackSocketModeReceiverConstructor = typeof import("@slack/bolt").SocketModeReceiver;
type SlackSocketModeReceiverOptions = ConstructorParameters<SlackSocketModeReceiverConstructor>[0];
type SlackSdkLogger = NonNullable<SlackSocketModeReceiverOptions["logger"]>;
type SlackSdkLogLevel = ReturnType<SlackSdkLogger["getLevel"]>;
type SlackSocketModeLogger = SlackSdkLogger & {
  getLastMessage: () => string | undefined;
};
type SlackSocketDisconnect = Awaited<ReturnType<typeof waitForSlackSocketDisconnect>>;

const OPENCLAW_SLACK_CLIENT_PING_TIMEOUT_MS = 15_000;
const SLACK_SOCKET_PONG_TIMEOUT_WARNING_PREFIX = "A pong wasn't received from the server";
const SLACK_SOCKET_PING_TIMEOUT_WARNING_PREFIX = "A ping wasn't received from the server";
const SLACK_SOCKET_LOG_LEVEL_IGNORED_WARNING_RE =
  /^The logLevel given to .+ was ignored as you also gave logger$/;

export type SlackBoltResolvedExports = {
  App: SlackAppConstructor;
  HTTPReceiver: SlackHttpReceiverConstructor;
  SocketModeReceiver: SlackSocketModeReceiverConstructor;
};

type SlackSocketShutdownClient = {
  shuttingDown?: boolean;
  websocket?: unknown;
  disconnect?: () => unknown;
};
type Constructor = abstract new (...args: never[]) => unknown;
type SlackSelfFilterArgs = {
  body?: unknown;
  context?: {
    botId?: string;
    botUserId?: string;
    teamId?: string;
    enterpriseId?: string;
    isEnterpriseInstall?: boolean;
  };
  event?: unknown;
  message?: unknown;
};
type SlackContextIdentity = NonNullable<SlackSelfFilterArgs["context"]> & { apiAppId?: string };

function isConstructorFunction<
  // oxlint-disable-next-line typescript/no-unnecessary-type-parameters -- Constructor guard preserves the requested concrete Slack constructor type.
  T extends Constructor,
>(value: unknown): value is T {
  return typeof value === "function";
}

// undici WebSocket ready states that still hold a live socket: CONNECTING(0) and OPEN(1).
const OPENCLAW_SLACK_WS_LIVE_READY_STATE_MAX = 1;

function isLiveSlackWebSocket(websocket: unknown): boolean {
  if (!websocket || typeof websocket !== "object") {
    return false;
  }
  const readyState = (websocket as { readyState?: unknown }).readyState;
  return (
    typeof readyState === "number" &&
    Number.isSafeInteger(readyState) &&
    readyState >= 0 &&
    readyState <= OPENCLAW_SLACK_WS_LIVE_READY_STATE_MAX
  );
}

function closeSlackWebSocket(websocket: unknown) {
  const disconnect = (websocket as { disconnect?: () => unknown }).disconnect;
  if (typeof disconnect !== "function") {
    return;
  }
  try {
    disconnect.call(websocket);
  } catch {
    // A socket that refuses to close here is no worse than before the guard;
    // the regular disconnect path still owns it.
  }
}

/**
 * SocketModeClient.start() replaces `client.websocket` without closing the
 * previous SlackWebSocket, so any second concurrent start path permanently
 * leaks an ESTABLISHED websocket (Slack then kill-cycles at its
 * 10-connections-per-app cap; openclaw/openclaw#56508 class). Internal
 * auto-reconnect is disabled (autoReconnectEnabled: false) so the monitor loop
 * is the single reconnect authority; this guard enforces the invariant
 * directly: at most one live websocket per client, and none once `shuttingDown`
 * is set (an in-flight start() can still assign a websocket after disconnect()).
 */
function installSlackSocketLeakGuard(receiver: unknown) {
  if (!receiver || typeof receiver !== "object") {
    return;
  }
  const client = Reflect.get(receiver, "client");
  if (!client || typeof client !== "object") {
    return;
  }
  let activeWebsocket: unknown;
  try {
    Object.defineProperty(client, "websocket", {
      configurable: true,
      get: () => activeWebsocket,
      set: (next: unknown) => {
        if (next !== activeWebsocket && isLiveSlackWebSocket(activeWebsocket)) {
          closeSlackWebSocket(activeWebsocket);
        }
        activeWebsocket = next;
        if ((client as SlackSocketShutdownClient).shuttingDown && isLiveSlackWebSocket(next)) {
          closeSlackWebSocket(next);
        }
      },
    });
  } catch {
    // A non-configurable websocket field means the guard cannot bind; stop
    // hygiene is still owned by gracefulStopSlackApp's disconnect backstop.
  }
}

function createSlackRelayReceiver(): SlackReceiver {
  return {
    init() {},
    start: () => Promise.resolve(undefined),
    stop: () => Promise.resolve(undefined),
  };
}

function resolveSlackBoltModule(value: unknown): SlackBoltResolvedExports | null {
  if (!value || typeof value !== "object") {
    return null;
  }
  const app = Reflect.get(value, "App");
  const httpReceiver = Reflect.get(value, "HTTPReceiver");
  const socketModeReceiver = Reflect.get(value, "SocketModeReceiver");
  if (
    !isConstructorFunction<SlackAppConstructor>(app) ||
    !isConstructorFunction<SlackHttpReceiverConstructor>(httpReceiver) ||
    !isConstructorFunction<SlackSocketModeReceiverConstructor>(socketModeReceiver)
  ) {
    return null;
  }
  return {
    App: app,
    HTTPReceiver: httpReceiver,
    SocketModeReceiver: socketModeReceiver,
  };
}

export function resolveSlackBoltInterop(params: {
  defaultImport: unknown;
  namespaceImport: unknown;
}): SlackBoltResolvedExports {
  const { defaultImport, namespaceImport } = params;
  const nestedDefault =
    defaultImport && typeof defaultImport === "object"
      ? Reflect.get(defaultImport, "default")
      : undefined;
  const namespaceDefault =
    namespaceImport && typeof namespaceImport === "object"
      ? Reflect.get(namespaceImport, "default")
      : undefined;
  const namespaceReceiver =
    namespaceImport && typeof namespaceImport === "object"
      ? Reflect.get(namespaceImport, "HTTPReceiver")
      : undefined;
  const namespaceSocketModeReceiver =
    namespaceImport && typeof namespaceImport === "object"
      ? Reflect.get(namespaceImport, "SocketModeReceiver")
      : undefined;
  const directModule =
    resolveSlackBoltModule(defaultImport) ??
    resolveSlackBoltModule(nestedDefault) ??
    resolveSlackBoltModule(namespaceDefault) ??
    resolveSlackBoltModule(namespaceImport);
  if (directModule) {
    return directModule;
  }
  if (
    isConstructorFunction<SlackAppConstructor>(defaultImport) &&
    isConstructorFunction<SlackHttpReceiverConstructor>(namespaceReceiver) &&
    isConstructorFunction<SlackSocketModeReceiverConstructor>(namespaceSocketModeReceiver)
  ) {
    return {
      App: defaultImport,
      HTTPReceiver: namespaceReceiver,
      SocketModeReceiver: namespaceSocketModeReceiver,
    };
  }
  throw new TypeError("Unable to resolve @slack/bolt App/HTTPReceiver exports");
}

export function publishSlackConnectedStatus(
  setStatus?: (next: Record<string, unknown>) => void,
  identityHealth: SlackIdentityHealth = { lifecycle: "ready", lastError: null },
) {
  if (!setStatus) {
    return;
  }
  const lastConnectedAt = Date.now();
  setStatus(
    identityHealth.lifecycle === "blocked"
      ? channelBlockedPatch(identityHealth.lastError, { connected: true, lastConnectedAt })
      : channelReadyPatch({ lastConnectedAt }),
  );
}

export function publishSlackBlockedStatus(
  setStatus: ((next: Record<string, unknown>) => void) | undefined,
  error: unknown,
) {
  if (!setStatus) {
    return;
  }
  setStatus(
    channelBlockedPatch(formatUnknownError(error), {
      connected: false,
    }),
  );
}

export function publishSlackDisconnectedStatus(
  setStatus?: (next: Record<string, unknown>) => void,
  error?: unknown,
) {
  if (!setStatus) {
    return;
  }
  const at = Date.now();
  const message = error ? formatUnknownError(error) : undefined;
  setStatus({
    connected: false,
    lifecycle: "recovering",
    lastDisconnect: message ? { at, error: message } : { at },
    lastError: message ?? null,
  });
}

function isSlackSocketHeartbeatTimeoutWarning(args: readonly unknown[]) {
  return (
    typeof args[0] === "string" &&
    (args[0].startsWith(SLACK_SOCKET_PONG_TIMEOUT_WARNING_PREFIX) ||
      args[0].startsWith(SLACK_SOCKET_PING_TIMEOUT_WARNING_PREFIX))
  );
}

function isSlackSocketSelfInflictedLoggerWarning(args: readonly unknown[]) {
  return typeof args[0] === "string" && SLACK_SOCKET_LOG_LEVEL_IGNORED_WARNING_RE.test(args[0]);
}

function formatSlackSdkLogArgs(args: readonly unknown[]) {
  return args
    .map((arg) => formatUnknownError(arg, ""))
    .filter(Boolean)
    .join(" ");
}

function createSlackSocketModeLogger(
  sink: Pick<typeof console, "debug" | "info" | "warn" | "error"> = console,
): SlackSocketModeLogger {
  let level = "info" as SlackSdkLogLevel;
  let name = "socket-mode";
  const prefix = () => `socket-mode:${name}`;
  let lastMessage: string | undefined;
  const remember = (args: readonly unknown[]) => {
    const message = formatSlackSdkLogArgs([prefix(), ...args]);
    if (message) {
      lastMessage = message;
    }
  };
  return {
    debug: () => {},
    info: () => {},
    warn: (...args: unknown[]) => {
      if (
        isSlackSocketHeartbeatTimeoutWarning(args) ||
        isSlackSocketSelfInflictedLoggerWarning(args)
      ) {
        return;
      }
      remember(args);
      sink.warn(prefix(), ...args);
    },
    error: (...args: unknown[]) => {
      remember(args);
      sink.error(prefix(), ...args);
    },
    setLevel: (nextLevel) => {
      level = nextLevel;
    },
    getLevel: () => level,
    setName: (nextName) => {
      name = nextName;
    },
    getLastMessage: () => lastMessage,
  };
}

function shouldSkipOpenClawSlackSelfEvent(args: SlackSelfFilterArgs): boolean {
  const botId = args.context?.botId;
  const botUserId = args.context?.botUserId;
  const message = asRecord(args.message);
  if (message?.subtype === "bot_message" && botId && message.bot_id === botId) {
    return true;
  }

  const event = asRecord(args.event);
  if (
    event?.type === "message" &&
    event.subtype === "message_changed" &&
    event.user === botUserId
  ) {
    return false;
  }

  const eventsWhichShouldBeKept = new Set(["member_joined_channel", "member_left_channel"]);
  return Boolean(
    botUserId &&
    event &&
    event.user === botUserId &&
    typeof event.type === "string" &&
    !eventsWhichShouldBeKept.has(event.type),
  );
}

export function createSlackBoltApp(params: {
  interop: SlackBoltResolvedExports;
  slackMode: "socket" | "http" | "relay";
  token: string;
  appToken?: string;
  signingSecret?: string;
  slackWebhookPath: string;
  clientOptions: Record<string, unknown>;
  dispatcher?: SlackSocketModeReceiverOptions["dispatcher"];
  wrapReceiver?: (receiver: SlackReceiver) => SlackReceiver;
  onContextIdentity?: (identity: SlackContextIdentity) => void | Promise<void>;
}) {
  const socketModeLogger = createSlackSocketModeLogger();
  const socketModeReceiverOptions: SlackSocketModeReceiverOptions = {
    appToken: params.appToken ?? "",
    // OpenClaw's monitor loop is the single reconnect authority. The SDK's
    // internal reconnect races our stop/start cycle, and its start() replaces
    // client.websocket without closing the old socket — every error cycle
    // leaked an ESTABLISHED websocket until Slack kill-cycled connections at
    // its 10-connections-per-app cap (openclaw/openclaw#56508 class). With
    // autoReconnect off, every close emits "disconnected", which is exactly
    // what waitForSlackSocketDisconnect observes.
    autoReconnectEnabled: false,
    clientPingTimeout: OPENCLAW_SLACK_CLIENT_PING_TIMEOUT_MS,
    logger: socketModeLogger,
    ...(params.dispatcher ? { dispatcher: params.dispatcher } : {}),
    installerOptions: {
      clientOptions: params.clientOptions,
    },
    ...(params.wrapReceiver ? { processEventErrorHandler: async () => false } : {}),
  };

  let receiver:
    | InstanceType<SlackSocketModeReceiverConstructor>
    | InstanceType<SlackHttpReceiverConstructor>
    | SlackReceiver
    | undefined;
  if (params.slackMode === "socket") {
    receiver = new params.interop.SocketModeReceiver(socketModeReceiverOptions);
    installSlackSocketLeakGuard(receiver);
  } else if (params.slackMode === "http") {
    receiver = new params.interop.HTTPReceiver({
      signingSecret: params.signingSecret ?? "",
      endpoints: params.slackWebhookPath,
      ...(params.wrapReceiver ? { processEventErrorHandler: async () => false } : {}),
    });
  } else {
    receiver = createSlackRelayReceiver();
  }
  const appReceiver = receiver && params.wrapReceiver ? params.wrapReceiver(receiver) : receiver;
  const app = new params.interop.App({
    token: params.token,
    clientOptions: params.clientOptions,
    ignoreSelf: false,
    // Bolt eagerly starts an auth.test promise in the constructor when token
    // verification is enabled. Invalid tokens can reject before any listener
    // consumes that promise, tripping OpenClaw's fatal unhandled-rejection path.
    tokenVerificationEnabled: false,
    ...(appReceiver ? { receiver: appReceiver } : {}),
  });
  app.use(async (args) => {
    await params.onContextIdentity?.({
      ...args.context,
      apiAppId: normalizeOptionalString(asRecord(args.body)?.api_app_id),
    });
    if (shouldSkipOpenClawSlackSelfEvent(args)) {
      return;
    }
    await args.next();
  });
  return { app, receiver, socketModeLogger };
}

function createSlackSocketDisconnectWaiter(app: unknown, abortSignal?: AbortSignal) {
  const waiterAbortController = new AbortController();
  const relayAbort = () => waiterAbortController.abort();
  let latest: SlackSocketDisconnect | undefined;
  abortSignal?.addEventListener("abort", relayAbort, { once: true });
  const promise = waitForSlackSocketDisconnect(app, waiterAbortController.signal).then((value) => {
    latest = value;
    return value;
  });
  return {
    promise,
    getLatest: () => latest,
    cancel: () => {
      waiterAbortController.abort();
      abortSignal?.removeEventListener("abort", relayAbort);
    },
    complete: () => {
      abortSignal?.removeEventListener("abort", relayAbort);
    },
  };
}

export async function startSlackSocketAndWaitForDisconnect(params: {
  app: { start: () => unknown };
  abortSignal?: AbortSignal;
  onStarted?: () => void | Promise<void>;
}) {
  const disconnectWaiter = createSlackSocketDisconnectWaiter(params.app, params.abortSignal);
  try {
    await Promise.resolve(params.app.start());
    if (params.abortSignal?.aborted) {
      disconnectWaiter.cancel();
      return null;
    }
    await params.onStarted?.();
    const disconnect = await disconnectWaiter.promise;
    disconnectWaiter.complete();
    return disconnect;
  } catch (err) {
    await Promise.resolve();
    const disconnect = disconnectWaiter.getLatest();
    disconnectWaiter.cancel();
    if (isMissingSocketStartErrorDetail(err) && disconnect?.error !== undefined) {
      throw toErrorObject(disconnect.error, "Non-Error thrown");
    }
    if (isMissingSocketStartErrorDetail(err)) {
      const suffix = disconnect ? ` after ${disconnect.event}` : "";
      throw new Error(`Slack Socket Mode start failed${suffix} without error detail`, {
        cause: err,
      });
    }
    throw err;
  }
}

function isMissingSocketStartErrorDetail(err: unknown): boolean {
  return (
    err === undefined || err === null || err === "" || (err instanceof Error && err.message === "")
  );
}

function resolveSlackSocketShutdownClient(app: unknown): SlackSocketShutdownClient | undefined {
  if (!app || typeof app !== "object") {
    return undefined;
  }
  const receiver = Reflect.get(app, "receiver");
  if (!receiver || typeof receiver !== "object") {
    return undefined;
  }
  const client = Reflect.get(receiver, "client");
  if (!client || typeof client !== "object") {
    return undefined;
  }
  return client as SlackSocketShutdownClient;
}

export async function gracefulStopSlackApp(app: { stop: () => unknown }) {
  const socketClient = resolveSlackSocketShutdownClient(app);
  if (socketClient) {
    // Pre-set before app.stop(): fences any in-flight start() through the
    // socket leak guard and beats a ping timeout racing the stop handshake
    // (openclaw/openclaw#56508).
    socketClient.shuttingDown = true;
  }
  await Promise.resolve(app.stop()).catch(() => undefined);
  // Bolt's SocketModeReceiver.stop() does not await the client's disconnect,
  // and a failing app.stop() may never reach it; disconnect directly so stop
  // always closes the active websocket. Initiating twice is idempotent for the
  // SocketModeClient; the close handshake itself completes asynchronously.
  const disconnect = socketClient?.disconnect;
  if (typeof disconnect === "function") {
    try {
      Promise.resolve(disconnect.call(socketClient)).catch(() => undefined);
    } catch {
      // Stop must never reject; the websocket close is best-effort here.
    }
  }
}

function formatSlackResolvedLabel(params: {
  input: string;
  id: string;
  name?: string;
  extra?: string[];
}): string | null {
  const extras = params.extra?.filter(Boolean) ?? [];
  const display = params.name ?? params.id;
  if (params.input === params.id && !params.name && extras.length === 0) {
    // An id that resolved to itself with no display name says nothing; omit it
    // so startup summaries only list lookups that translated something. Bare
    // names that resolved to an id stay logged even when name === input.
    return null;
  }
  // Show the raw id only when neither the input nor the display already is it.
  const details = [
    ...(params.input === params.id || display === params.id ? [] : [`id:${params.id}`]),
    ...extras,
  ];
  const suffix = details.length > 0 ? ` (${details.join(", ")})` : "";
  return `${params.input}→${display}${suffix}`;
}

export function formatSlackChannelResolved(entry: SlackChannelResolution): string | null {
  const id = entry.id ?? entry.input;
  return formatSlackResolvedLabel({
    input: entry.input,
    id,
    name: entry.name,
    extra: entry.archived ? ["archived"] : [],
  });
}

export function formatSlackUserResolved(entry: SlackUserResolution): string | null {
  const id = entry.id ?? entry.input;
  return formatSlackResolvedLabel({
    input: entry.input,
    id,
    name: entry.name,
    extra: entry.note ? [entry.note] : [],
  });
}
