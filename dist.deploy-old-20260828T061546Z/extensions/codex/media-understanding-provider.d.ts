import { Ct as AgentHarnessRuntimeArtifactBinding, wt as resolveAuthProfileOrder } from "../../plugin-entry-C1So83n6.js";
import { n as MediaUnderstandingProvider } from "../../types-DmXWHQl2.js";
import { r as AuthProfileStore } from "../../types-zNfpXEzJ.js";
import "../../config-contracts-CbBCWgEm.js";
import "../../agent-runtime-DyrGTaeu.js";
import { a as CodexAppServerRequestResult, g as JsonValue, h as RpcRequest, i as CodexAppServerRequestParams, n as CodexAppServerStartOptions, o as CodexLoginAccountParams, r as CodexAppServerRequestMethod, s as CodexServerNotification } from "../../config-Cm1coNKJ.js";
import "../../media-understanding-B7I7tT70.js";
//#region extensions/codex/src/app-server/transport.d.ts
/** Child-process-like transport shape consumed by the Codex app-server client. */
type CodexAppServerTransport = {
  stdin: {
    write: (data: string | Uint8Array, callback?: (error?: Error | null) => void) => unknown;
    end?: () => unknown;
    destroy?: () => unknown;
    unref?: () => unknown;
    on?: (event: "error", listener: (error: Error) => void) => unknown;
  };
  stdout: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  stderr: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  pid?: number;
  exitCode?: number | null;
  signalCode?: string | null;
  killed?: boolean;
  kill?: (signal?: NodeJS.Signals) => unknown;
  unref?: () => unknown;
  once: (event: string, listener: (...args: unknown[]) => void) => unknown;
  off?: (event: string, listener: (...args: unknown[]) => void) => unknown;
};
//#endregion
//#region extensions/codex/src/app-server/client.d.ts
type RequestOptions = {
  timeoutMs?: number;
  signal?: AbortSignal;
  assertCurrent?: () => void;
};
type CodexServerRequestHandler = (request: Required<Pick<RpcRequest, "id" | "method">> & {
  params?: JsonValue;
}, signal?: AbortSignal) => Promise<JsonValue | undefined> | JsonValue | undefined;
/** Notification handler registered on a Codex app-server client. */
type CodexServerNotificationHandler = (notification: CodexServerNotification) => Promise<void> | void;
/** Runtime identity returned by the Codex app-server initialize handshake. */
type CodexAppServerRuntimeIdentity = {
  serverVersion: string;
  userAgent?: string;
  codexHome?: string;
  platformFamily?: string;
  platformOs?: string;
};
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
declare class CodexAppServerClient {
  private readonly instanceId;
  private readonly child;
  private readonly lines;
  private readonly pending;
  private readonly requestHandlers;
  private readonly notificationHandlers;
  private readonly pendingStartupWarnings;
  private readonly closeHandlers;
  private nextId;
  private initialized;
  private closed;
  private transportExited;
  private closeError;
  private serverVersion;
  private runtimeIdentity;
  private threadSessionRequestGuard;
  private stderrTail;
  private pendingParse;
  private constructor();
  /** Starts a new app-server client using resolved runtime start options. */
  static start(options?: Partial<CodexAppServerStartOptions>): CodexAppServerClient;
  /** Builds a client around a fake transport for tests. */
  static fromTransportForTests(child: CodexAppServerTransport): CodexAppServerClient;
  /** Performs the app-server initialize handshake and validates protocol version. */
  initialize(): Promise<void>;
  /** Returns the version detected during initialize. */
  getServerVersion(): string | undefined;
  /** Returns runtime metadata detected during initialize. */
  getRuntimeIdentity(): CodexAppServerRuntimeIdentity | undefined;
  /** Returns a bounded, redacted stderr diagnostic from the app-server process. */
  getStderrDiagnostic(): string | undefined;
  /** Returns the terminal transport error that closed this physical client. */
  getCloseError(): Error | undefined;
  /** Stable generation id for this exact physical client instance. */
  getInstanceId(): string;
  /** Installs the spawn-owner check run before config-loading thread requests. */
  setThreadSessionRequestGuard(guard: ((options: {
    signal?: AbortSignal;
    timeoutMs?: number;
    timeoutMessage: string;
    abortMessage: string;
  }) => Promise<() => void>) | undefined): void;
  /** Returns the local transport PID for scoped child-process cleanup, when available. */
  getTransportPid(): number | undefined;
  request<M extends CodexAppServerRequestMethod>(method: M, params: CodexAppServerRequestParams<M>, options?: RequestOptions): Promise<CodexAppServerRequestResult<M>>;
  request<T = JsonValue | undefined>(method: string, params?: unknown, options?: RequestOptions): Promise<T>;
  private requestWithOverloadRetry;
  private waitForOverloadRetry;
  private requestOnce;
  /** Sends a fire-and-forget JSON-RPC notification to the app-server. */
  notify(method: string, params?: JsonValue): void;
  /** Registers a handler for app-server requests sent back to OpenClaw. */
  addRequestHandler(handler: CodexServerRequestHandler): () => void;
  /** Registers a notification handler and returns its disposer. */
  addNotificationHandler(handler: CodexServerNotificationHandler): () => void;
  /** Registers a close handler and returns its disposer. */
  addCloseHandler(handler: (client: CodexAppServerClient) => void): () => void;
  /** Registers a handler for physical transport exit and returns its disposer. */
  addTransportExitHandler(handler: (client: CodexAppServerClient) => void): () => void;
  /** Closes the transport without waiting for process/socket shutdown. */
  close(): void;
  /** Closes the transport and waits for shutdown according to transport policy. */
  closeAndWait(options?: {
    exitTimeoutMs?: number;
    forceKillDelayMs?: number;
  }): Promise<boolean>;
  /** Closes this transport and runs cleanup only after physical process exit. */
  closeAndRunAfterExit(onExit: () => void, operation: string): Promise<void>;
  private writeMessage;
  private handleLine;
  private handlePendingParseLine;
  private handleParsedMessage;
  private handleResponse;
  private handleServerRequest;
  private runServerRequestHandlers;
  private runServerRequestHandlersWithoutTimeout;
  private handleNotification;
  private closeWithError;
  private markClosed;
  private rejectPendingRequests;
}
//#endregion
//#region extensions/codex/src/app-server/auth-bridge.d.ts
type AuthProfileOrderConfig = Parameters<typeof resolveAuthProfileOrder>[0]["cfg"];
type CodexAppServerAuthRequirement = "api-key" | "subscription";
declare function resolveCodexAppServerAuthProfileIdForAgent(params: {
  authProfileId?: string;
  authProfileStore?: AuthProfileStore;
  agentDir?: string;
  config?: AuthProfileOrderConfig;
}): string | undefined;
type CodexAppServerPreparedAuthProfileSnapshot = {
  loginParams: CodexLoginAccountParams;
  secretFreeCacheKey: string;
  /** Genuine ChatGPT principal id; email/profile fallbacks are not authorization identity. */
  chatgptAccountId?: string;
};
type CodexAppServerPreparedAuth = {
  kind: "api-key";
  apiKey: string;
} | {
  kind: "profile";
  profileId: string;
  store: AuthProfileStore;
  snapshot?: CodexAppServerPreparedAuthProfileSnapshot;
};
//#endregion
//#region extensions/codex/src/app-server/shared-client.d.ts
type CodexAppServerClientOptions = {
  startOptions?: CodexAppServerStartOptions;
  pluginConfig?: unknown;
  timeoutMs?: number;
  authProfileId?: string | null;
  authProfileStore?: AuthProfileStore;
  authBindingFingerprint?: string;
  /** Setup-only generation whose exact local runtime bytes are captured. */
  runtimeArtifactMode?: "capture";
  /** Previously minted exact runtime required before the process may start. */
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  preparedAuth?: CodexAppServerPreparedAuth;
  authRequirement?: CodexAppServerAuthRequirement;
  agentId?: string;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  onStartedClient?: (client: CodexAppServerClient) => void;
  abandonSignal?: AbortSignal;
};
/** Factory used by attempt startup and side turns to acquire a leased client. */
type CodexAppServerClientFactory = (options?: CodexAppServerClientOptions) => Promise<CodexAppServerClient>;
//#endregion
//#region extensions/codex/src/app-server/bounded-turn.d.ts
type CodexBoundedTurnOptions = {
  pluginConfig?: unknown;
  clientFactory?: CodexAppServerClientFactory;
};
//#endregion
//#region extensions/codex/media-understanding-provider.d.ts
type CodexMediaUnderstandingProviderOptions = CodexBoundedTurnOptions;
/**
 * Builds the media-understanding provider that delegates image tasks to an
 * isolated Codex app-server session.
 */
declare function buildCodexMediaUnderstandingProvider(options?: CodexMediaUnderstandingProviderOptions): MediaUnderstandingProvider;
//#endregion
export { buildCodexMediaUnderstandingProvider };