// Qa Lab plugin module implements the Crabline-backed local mock QA transport.
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createQaBusState, type QaBusState } from "./bus-state.js";
import type { QaCrablineChannelDriverSelection } from "./crabline-channel-driver.js";
import { QaStateBackedTransportAdapter } from "./qa-transport.js";
import type {
  QaTransportActionName,
  QaTransportGatewayClient,
  QaTransportReportParams,
  QaTransportState,
} from "./qa-transport.js";
import type { QaBusInboundMessageInput, QaBusMessage } from "./runtime-api.js";

const CRABLINE_TRANSPORT_ID = "crabline";
const CRABLINE_USER_NAME = "openclaw-qa";
const CRABLINE_OBSERVE_TIMEOUT_MS = 5_000;
const CRABLINE_OBSERVE_IDLE_MS = 100;

const CRABLINE_WEBHOOK_DEFAULTS: Record<string, { path: string; port: number }> = {
  discord: { path: "/discord/interactions", port: 8788 },
  feishu: { path: "/feishu/webhook", port: 8795 },
  googlechat: { path: "/googlechat/webhook", port: 8792 },
  imessage: { path: "/imessage/webhook", port: 8796 },
  matrix: { path: "/matrix/webhook", port: 8797 },
  mattermost: { path: "/mattermost/webhook", port: 8793 },
  msteams: { path: "/msteams/webhook", port: 8791 },
  slack: { path: "/slack/events", port: 8787 },
  telegram: { path: "/telegram/webhook", port: 8790 },
  whatsapp: { path: "/whatsapp/webhook", port: 8789 },
  zalo: { path: "/zalo/webhook", port: 8794 },
};

type CrablineInboundEnvelope = {
  id: string;
  provider?: string;
  raw?: unknown;
  sentAt: string;
  text: string;
  threadId?: string;
};

type CrablineFixtureDefinition = {
  env?: string[];
  id: string;
  inboundMatch?: Record<string, unknown>;
  mode?: string;
  provider: string;
  retries?: number;
  tags?: string[];
  target: {
    behavior?: string;
    channelId?: string;
    id: string;
    metadata?: Record<string, unknown>;
    threadId?: string;
  };
  timeoutMs?: number;
};

type CrablineManifestDefinition = {
  configVersion: number;
  fixtures: CrablineFixtureDefinition[];
  providers: Record<string, Record<string, unknown>>;
  userName: string;
};

type CrablineProviderContext = {
  config: Record<string, unknown>;
  fixture: CrablineFixtureDefinition;
  manifestPath: string;
  providerId: string;
  userName: string;
};

type CrablineSendResult = {
  accepted?: boolean;
  messageId: string;
  threadId?: string;
};

export type QaCrablineProviderAdapter = {
  [key: string]: unknown;
  cleanup?: () => Promise<void> | void;
  send: (
    params: CrablineProviderContext & {
      mode: "agent";
      nonce: string;
      text: string;
    },
  ) => Promise<CrablineSendResult>;
  waitForInbound: (
    params: CrablineProviderContext & {
      nonce: string;
      since: string;
      threadId?: string;
      timeoutMs: number;
    },
  ) => Promise<CrablineInboundEnvelope | null>;
};

type CrablineRuntimeModule = {
  createRegistry: (
    manifest: CrablineManifestDefinition,
    manifestPath: string,
  ) => {
    resolve: (providerId: string, fixtureId: string) => QaCrablineProviderAdapter;
  };
};

type CrablineRuntime = {
  provider?: QaCrablineProviderAdapter;
};

type CrablineStateParams = {
  fixtureContext: CrablineProviderContext;
  observeIdleMs?: number;
  observeTimeoutMs?: number;
  provider: QaCrablineProviderAdapter;
  selection: QaCrablineChannelDriverSelection;
  state: QaBusState;
};

async function loadCrablineRuntime(env: NodeJS.ProcessEnv): Promise<CrablineRuntimeModule> {
  const explicitRuntime = env.OPENCLAW_QA_CRABLINE_RUNTIME?.trim();
  if (explicitRuntime) {
    return (await import(
      pathToFileURL(path.resolve(explicitRuntime)).href
    )) as CrablineRuntimeModule;
  }

  const packageName = ["crab", "line"].join("");
  try {
    return (await import(packageName)) as CrablineRuntimeModule;
  } catch (error) {
    throw new Error(
      `Unable to load Crabline runtime package. Install crabline, add it as a dependency, or set OPENCLAW_QA_CRABLINE_RUNTIME to Crabline's dist/src/index.js. ${formatErrorMessage(error)}`,
      { cause: error },
    );
  }
}

function providerConfigForChannel(channel: string, outputDir: string) {
  const webhook = CRABLINE_WEBHOOK_DEFAULTS[channel] ?? {
    path: `/${channel}/webhook`,
    port: 0,
  };
  return {
    adapter: channel,
    capabilities: ["probe", "send", "roundtrip", "agent"],
    env: [],
    platform: channel,
    status: "active",
    [channel]: {
      recorder: {
        path: path.join(outputDir, "artifacts", "crabline", `${channel}-recorder.jsonl`),
      },
      webhook: {
        host: "127.0.0.1",
        path: webhook.path,
        port: 0,
      },
    },
  };
}

function createCrablineManifest(params: {
  outputDir: string;
  selection: QaCrablineChannelDriverSelection;
}) {
  const channel = params.selection.channel;
  const fixtureId = `qa-crabline-${channel}`;
  return {
    fixtureId,
    manifest: {
      configVersion: 1,
      fixtures: [
        {
          env: [],
          id: fixtureId,
          inboundMatch: {
            author: "assistant",
            nonce: "ignore",
            strategy: "contains",
          },
          mode: "agent",
          provider: channel,
          retries: 0,
          tags: [],
          target: {
            id: `${channel}-default`,
            metadata: {},
          },
          timeoutMs: CRABLINE_OBSERVE_TIMEOUT_MS,
        },
      ],
      providers: {
        [channel]: providerConfigForChannel(channel, params.outputDir),
      },
      userName: CRABLINE_USER_NAME,
    } satisfies CrablineManifestDefinition,
    manifestPath: path.join(params.outputDir, "crabline-runtime.json"),
  };
}

function createFixtureContext(params: {
  fixtureId: string;
  manifest: CrablineManifestDefinition;
  manifestPath: string;
  providerId: string;
}): CrablineProviderContext {
  const fixture = params.manifest.fixtures.find((entry) => entry.id === params.fixtureId);
  const config = params.manifest.providers[params.providerId];
  if (!fixture || !config) {
    throw new Error("Crabline manifest is missing its runtime fixture/provider.");
  }
  return {
    config,
    fixture,
    manifestPath: params.manifestPath,
    providerId: params.providerId,
    userName: params.manifest.userName,
  };
}

function targetForConversation(message: QaBusMessage) {
  return `${message.conversation.kind === "direct" ? "dm" : "channel"}:${message.conversation.id}`;
}

function withTarget(context: CrablineProviderContext, targetId: string): CrablineProviderContext {
  return {
    ...context,
    fixture: {
      ...context.fixture,
      target: {
        id: targetId,
        metadata: {},
      },
    },
  };
}

function addObservedOutbound(params: {
  baseState: QaBusState;
  event: CrablineInboundEnvelope;
  inbound: QaBusMessage;
}) {
  params.baseState.addOutboundMessage({
    accountId: params.inbound.accountId,
    to: targetForConversation(params.inbound),
    text: params.event.text,
    senderId: "openclaw",
    senderName: "OpenClaw QA",
    timestamp: Number.isFinite(Date.parse(params.event.sentAt))
      ? Date.parse(params.event.sentAt)
      : Date.now(),
    replyToId: params.inbound.id,
  });
}

function createCrablineState(params: CrablineStateParams): QaTransportState & {
  cleanup: () => Promise<void>;
} {
  const baseState = params.state;
  const seenObservedIds = new Set<string>();
  const pendingObservations = new Set<Promise<void>>();
  let closed = false;

  const observeReply = async (input: {
    accepted: CrablineSendResult;
    context: CrablineProviderContext;
    inbound: QaBusMessage;
    since: string;
  }) => {
    const timeoutMs = params.observeTimeoutMs ?? CRABLINE_OBSERVE_TIMEOUT_MS;
    const idleMs = params.observeIdleMs ?? CRABLINE_OBSERVE_IDLE_MS;
    const deadline = Date.now() + timeoutMs;
    let sawReply = false;
    let lastReplyAt = 0;
    let since = input.since;

    while (Date.now() < deadline) {
      if (closed) {
        return;
      }
      if (sawReply && Date.now() - lastReplyAt >= idleMs) {
        return;
      }
      const remainingMs = Math.max(1, deadline - Date.now());
      const event = await params.provider.waitForInbound({
        ...input.context,
        nonce: input.inbound.id,
        since,
        threadId: input.accepted.threadId,
        timeoutMs: Math.min(500, remainingMs),
      });
      if (!event) {
        continue;
      }
      const sentAtMs = Date.parse(event.sentAt);
      if (Number.isFinite(sentAtMs)) {
        since = new Date(sentAtMs + 1).toISOString();
      }
      if (seenObservedIds.has(event.id) || event.id === input.accepted.messageId) {
        continue;
      }
      seenObservedIds.add(event.id);
      addObservedOutbound({
        baseState,
        event,
        inbound: input.inbound,
      });
      sawReply = true;
      lastReplyAt = Date.now();
    }
  };

  const trackObservation = (observation: Promise<void>) => {
    pendingObservations.add(observation);
    observation
      .catch(() => {})
      .finally(() => {
        pendingObservations.delete(observation);
      });
  };

  return {
    reset() {
      seenObservedIds.clear();
      return baseState.reset();
    },
    getSnapshot: baseState.getSnapshot.bind(baseState),
    async addInboundMessage(input: QaBusInboundMessageInput) {
      const inbound = baseState.addInboundMessage(input);
      const targetId = targetForConversation(inbound);
      const context = withTarget(params.fixtureContext, targetId);
      const since = new Date(Date.now() - 1).toISOString();
      const accepted = await params.provider.send({
        ...context,
        mode: "agent",
        nonce: inbound.id,
        text: input.text,
      });
      trackObservation(
        observeReply({
          accepted,
          context,
          inbound,
          since,
        }),
      );
      return inbound;
    },
    addOutboundMessage: baseState.addOutboundMessage.bind(baseState),
    readMessage: baseState.readMessage.bind(baseState),
    searchMessages: baseState.searchMessages.bind(baseState),
    waitFor: baseState.waitFor.bind(baseState),
    async cleanup() {
      closed = true;
      await Promise.allSettled(pendingObservations);
      await params.provider.cleanup?.();
    },
  };
}

class QaCrablineLocalMockTransport extends QaStateBackedTransportAdapter {
  readonly #selection: QaCrablineChannelDriverSelection;
  readonly #state: QaTransportState & { cleanup: () => Promise<void> };

  constructor(params: {
    selection: QaCrablineChannelDriverSelection;
    state: QaTransportState & { cleanup: () => Promise<void> };
  }) {
    super({
      id: CRABLINE_TRANSPORT_ID,
      label: `crabline + ${params.selection.channel}`,
      accountId: `qa-crabline-${params.selection.channel}`,
      requiredPluginIds: [],
      state: params.state,
    });
    this.#selection = params.selection;
    this.#state = params.state;
  }

  createGatewayConfig = (_params: { baseUrl: string }) => ({});

  createChannelDriverSmokeEnv = (env: NodeJS.ProcessEnv) => ({ ...env });

  waitReady = async (_params: {
    gateway: QaTransportGatewayClient;
    timeoutMs?: number;
    pollIntervalMs?: number;
  }) => {};

  buildAgentDelivery = ({ target }: { target: string }) => ({
    channel: this.#selection.channel,
    replyChannel: this.#selection.channel,
    replyTo: `${this.#selection.channel}:${target}`,
  });

  handleAction = async (_params: {
    action: QaTransportActionName;
    args: Record<string, unknown>;
    cfg: unknown;
    accountId?: string | null;
  }) => {
    throw new Error("Crabline local mock transport does not expose generic message actions.");
  };

  createReportNotes = (_params: QaTransportReportParams) => [
    `Runs ${this.#selection.channel}-shaped QA messages through openclaw/crabline local mocks.`,
    "No live channel service, provider SDK, or external credential lease is required.",
  ];

  async cleanup() {
    await this.#state.cleanup();
  }
}

export async function createQaCrablineTransportAdapter(params: {
  env?: NodeJS.ProcessEnv;
  observeIdleMs?: number;
  observeTimeoutMs?: number;
  outputDir: string;
  runtime?: CrablineRuntime;
  selection: QaCrablineChannelDriverSelection;
  state?: QaBusState;
}) {
  const env = params.env ?? process.env;
  await fs.mkdir(path.join(params.outputDir, "artifacts", "crabline"), {
    recursive: true,
  });
  const { fixtureId, manifest, manifestPath } = createCrablineManifest({
    outputDir: params.outputDir,
    selection: params.selection,
  });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

  const provider =
    params.runtime?.provider ??
    (await loadCrablineRuntime(env))
      .createRegistry(manifest, manifestPath)
      .resolve(params.selection.channel, fixtureId);
  const fixtureContext = createFixtureContext({
    fixtureId,
    manifest,
    manifestPath,
    providerId: params.selection.channel,
  });

  return new QaCrablineLocalMockTransport({
    selection: params.selection,
    state: createCrablineState({
      fixtureContext,
      observeIdleMs: params.observeIdleMs,
      observeTimeoutMs: params.observeTimeoutMs,
      provider,
      selection: params.selection,
      state: params.state ?? createQaBusState(),
    }),
  });
}
