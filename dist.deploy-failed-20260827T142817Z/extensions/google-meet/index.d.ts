import { Dt as HelloOk, Et as EventFrame, It as __exportAll, J as GatewayRequestHandlerOptions, Ot as ErrorCodes, Tt as ConnectParams, X as RespondFn, Y as GatewayRequestHandlers, _t as NormalizedPluginNodeCapabilityUrl, bt as mintPluginNodeCapabilityToken, gt as DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, ht as NodeSession, n as OpenClawPluginConfigSchema, t as OpenClawPluginDefinition, vt as PLUGIN_NODE_CAPABILITY_PATH_PREFIX, wt as errorShape, xt as normalizePluginNodeCapabilityScopedUrl, yt as buildPluginNodeCapabilityScopedHostUrl } from "../../types-R6eI-mj_.js";
import { _ as OperatorScope, f as GatewayAuthConfig, h as GatewayTrustedProxyConfig, m as GatewayTailscaleMode, n as OpenClawConfig, p as GatewayTailscaleConfig } from "../../types.openclaw-BrHw7tim.js";
import { F as ChannelAccountSnapshot, Q as GatewayClientName, Z as GatewayClientMode } from "../../setup-wizard-types-CzVLMkGu.js";
import { t as RealtimeVoiceAgentConsultToolPolicy } from "../../realtime-voice-DLpY4wqm.js";
import { t as isLoopbackHost } from "../../net-BJuoHQJr.js";
import { IncomingMessage } from "node:http";
import { Command } from "commander";

//#region src/infra/device-identity-store.d.ts
type DeviceIdentity$1 = {
  deviceId: string;
  publicKeyPem: string;
  privateKeyPem: string;
};
//#endregion
//#region packages/gateway-client/src/protocol-request.d.ts
type GatewayProtocolRequestOptions = {
  timeoutMs?: number | null;
  expectFinal?: boolean;
  onSent?: () => void;
  onAccepted?: (payload: unknown) => void;
  signal?: AbortSignal;
};
//#endregion
//#region packages/gateway-client/src/client.d.ts
type DeviceIdentity = {
  deviceId: string;
  privateKeyPem: string;
  publicKeyPem: string;
};
type DeviceAuthTokenRecord = {
  token?: string;
  scopes?: string[];
};
type GatewayClientHostDeps = {
  loadOrCreateDeviceIdentity?: () => DeviceIdentity | undefined;
  signDevicePayload?: (privateKeyPem: string, payload: string) => string;
  publicKeyRawBase64UrlFromPem?: (publicKeyPem: string) => string;
  loadDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => DeviceAuthTokenRecord | null;
  storeDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    token: string;
    scopes: string[];
    env?: NodeJS.ProcessEnv;
  }) => void;
  clearDeviceAuthToken?: (params: {
    deviceId: string;
    role: string;
    env?: NodeJS.ProcessEnv;
  }) => void;
  beforeConnect?: () => void;
  registerGatewayLoopbackBypass?: (url: string) => (() => void) | undefined;
  logDebug?: (message: string) => void;
  logError?: (message: string) => void;
  redactForLog?: (message: string) => string;
  normalizeTlsFingerprint?: (fingerprint: string | undefined) => string;
};
type GatewayClientRequestOptions = GatewayProtocolRequestOptions;
type GatewayReconnectPausedInfo = {
  code: number;
  reason: string;
  detailCode: string | null;
};
type GatewayClientCloseInfo = {
  phase: "pre-hello" | "post-hello";
  socketOpened: boolean;
  transportValidated: boolean;
  connectRequestSent?: boolean;
  transientPreHelloCleanClose: boolean;
  connectError?: Error;
};
type GatewayClientOptions$1 = {
  url?: string;
  origin?: string;
  connectChallengeTimeoutMs?: number;
  /**
   * Server-side pre-auth handshake budget. Config-derived local clients use
   * this to keep the connect-challenge watchdog aligned with the gateway.
   */
  preauthHandshakeTimeoutMs?: number;
  tickWatchMinIntervalMs?: number;
  tickWatchTimeoutMs?: number;
  requestTimeoutMs?: number;
  token?: string;
  bootstrapToken?: string; /** Prefer one setup credential for the first successful device-auth exchange. */
  preferBootstrapToken?: boolean;
  deviceToken?: string;
  password?: string;
  approvalRuntimeToken?: string;
  agentRuntimeIdentityToken?: string;
  instanceId?: string;
  clientName?: GatewayClientName;
  clientDisplayName?: string;
  clientVersion?: string;
  clientBuildId?: string;
  platform?: string;
  deviceFamily?: string;
  mode?: GatewayClientMode;
  role?: string;
  scopes?: string[];
  caps?: string[];
  commands?: string[];
  computerUse?: ConnectParams["computerUse"];
  workerRuns?: ConnectParams["workerRuns"];
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  env?: NodeJS.ProcessEnv;
  deviceIdentity?: DeviceIdentity | null;
  hostDeps?: GatewayClientHostDeps;
  minProtocol?: number;
  maxProtocol?: number;
  tlsFingerprint?: string;
  onEvent?: (evt: EventFrame) => void;
  onHelloOk?: (hello: HelloOk) => void;
  onConnectError?: (err: Error) => void;
  onReconnectPaused?: (info: GatewayReconnectPausedInfo) => void;
  onClose?: (code: number, reason: string, info?: GatewayClientCloseInfo) => void;
  onGap?: (info: {
    expected: number;
    received: number;
  }) => void;
};
type GatewayClientConnectionMetadata = {
  clientName?: GatewayClientName;
  hasDeviceIdentity: boolean;
  mode?: GatewayClientMode;
  preauthHandshakeTimeoutMs?: number;
};
//#endregion
//#region packages/gateway-client/src/event-loop-ready.d.ts
/** Readiness probe outcome with timing data for diagnosing event-loop stalls. */
type EventLoopReadyResult = {
  ready: boolean;
  elapsedMs: number;
  maxDriftMs: number;
  checks: number;
  aborted: boolean;
};
//#endregion
//#region packages/gateway-client/src/readiness.d.ts
type GatewayClientStartable = {
  start(): void;
};
/** Timeout and abort controls for delaying client start until the loop can process IO. */
type GatewayClientStartReadinessOptions = {
  timeoutMs?: number;
  clientOptions?: Pick<GatewayClientOptions$1, "connectChallengeTimeoutMs" | "env" | "preauthHandshakeTimeoutMs">;
  signal?: AbortSignal;
};
//#endregion
//#region src/gateway/client.d.ts
type GatewayClientOptions = GatewayClientOptions$1 & {
  /** Exact normalized remote gateway scope for origin-bound device credentials. */deviceAuthScope?: string;
};
declare class GatewayClient {
  #private;
  constructor(opts: GatewayClientOptions);
  start(): void;
  stop(): void;
  stopAndWait(opts?: {
    timeoutMs?: number;
  }): Promise<void>;
  request<T = Record<string, unknown>>(method: string, params?: unknown, opts?: GatewayClientRequestOptions): Promise<T>;
  getConnectionMetadata(): GatewayClientConnectionMetadata;
  updateNodeManifest(manifest: {
    caps: string[];
    commands: string[];
    computerUse?: GatewayClientOptions$1["computerUse"];
  }): void;
}
//#endregion
//#region src/cli/gateway-rpc.types.d.ts
/** Common gateway RPC flags accepted by direct gateway command helpers. */
type GatewayRpcOpts = {
  url?: string;
  token?: string;
  password?: string;
  timeout?: string;
  expectFinal?: boolean;
  json?: boolean;
};
//#endregion
//#region src/cli/gateway-rpc.d.ts
declare function addGatewayClientOptions(cmd: Command, defaults?: {
  timeoutMs?: number;
}): Command;
declare function callGatewayFromCli(method: string, opts: GatewayRpcOpts, params?: unknown, extra?: {
  clientName?: GatewayClientName;
  mode?: GatewayClientMode;
  deviceIdentity?: DeviceIdentity$1 | null;
  signal?: AbortSignal;
  expectFinal?: boolean;
  progress?: boolean;
  scopes?: OperatorScope[];
}): Promise<Record<string, unknown>>;
//#endregion
//#region extensions/google-meet/src/config.d.ts
type GoogleMeetTransport = "chrome" | "chrome-node" | "twilio";
type GoogleMeetMode = "agent" | "bidi" | "transcribe";
type GoogleMeetRealtimeStrategy = "agent" | "bidi";
type GoogleMeetChromeAudioFormat = "pcm16-24khz" | "g711-ulaw-8khz";
type GoogleMeetToolPolicy = RealtimeVoiceAgentConsultToolPolicy;
type MeetingAudioBackendSelection = "auto" | "blackhole-2ch" | "pipewire-pulse";
type GoogleMeetConfig = {
  enabled: boolean;
  defaults: {
    meeting?: string;
  };
  preview: {
    enrollmentAcknowledged: boolean;
  };
  defaultTransport: GoogleMeetTransport;
  defaultMode: GoogleMeetMode;
  chrome: {
    audioBackend: MeetingAudioBackendSelection;
    audioFormat: GoogleMeetChromeAudioFormat;
    audioBufferBytes: number;
    launch: boolean;
    browserProfile?: string;
    guestName: string;
    reuseExistingTab: boolean;
    autoJoin: boolean;
    joinTimeoutMs: number;
    waitForInCallMs: number;
    audioInputCommand?: string[];
    audioOutputCommand?: string[];
    audioInputCommandOverride?: string[];
    audioOutputCommandOverride?: string[];
    bargeInInputCommand?: string[];
    bargeInRmsThreshold: number;
    bargeInPeakThreshold: number;
    bargeInCooldownMs: number;
    audioBridgeCommand?: string[];
    audioBridgeHealthCommand?: string[];
  };
  chromeNode: {
    node?: string;
  };
  twilio: {
    defaultDialInNumber?: string;
    defaultPin?: string;
    defaultDtmfSequence?: string;
  };
  voiceCall: {
    enabled: boolean;
    gatewayUrl?: string;
    token?: string;
    requestTimeoutMs: number;
    dtmfDelayMs: number;
    postDtmfSpeechDelayMs: number;
    introMessage?: string;
  };
  realtime: {
    strategy: GoogleMeetRealtimeStrategy;
    provider?: string;
    transcriptionProvider?: string;
    voiceProvider?: string;
    model?: string;
    instructions?: string;
    introMessage?: string;
    agentId?: string;
    toolPolicy: GoogleMeetToolPolicy;
    providers: Record<string, Record<string, unknown>>;
  };
  oauth: {
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    accessToken?: string;
    expiresAt?: number;
  };
  auth: {
    provider: "google-oauth";
    clientId?: string;
    clientSecret?: string;
    tokenPath?: string;
  };
};
declare function resolveGoogleMeetGatewayOperationTimeoutMs(config: GoogleMeetConfig): number;
//#endregion
//#region src/gateway/hosted-plugin-surface-url.d.ts
type HostSource = string | null | undefined;
/** Inputs used to infer the externally reachable plugin surface URL. */
type HostedPluginSurfaceUrlParams = {
  port?: number;
  hostOverride?: HostSource;
  forwardedHost?: HostSource | HostSource[];
  requestHost?: HostSource;
  forwardedProto?: HostSource | HostSource[];
  localAddress?: HostSource;
  scheme?: "http" | "https";
};
/** Resolve the URL that plugins should advertise for hosted node surfaces. */
declare function resolveHostedPluginSurfaceUrl(params: HostedPluginSurfaceUrlParams): string | undefined;
//#endregion
//#region src/gateway/node-command-policy.d.ts
type NodeCommandPolicyNode = Pick<NodeSession, "platform" | "deviceFamily"> & Partial<Pick<NodeSession, "caps" | "commands" | "connId" | "nodeId">> & {
  approvedCommands?: readonly string[];
};
declare function resolveNodeCommandAllowlist(cfg: OpenClawConfig, node?: NodeCommandPolicyNode): Set<string>;
declare function isNodeCommandAllowed(params: {
  command: string;
  declaredCommands?: string[];
  allowlist: Set<string>;
}): {
  ok: true;
} | {
  ok: false;
  reason: string;
};
//#endregion
//#region src/shared/node-match.d.ts
/**
 * Shared node-selection policy for CLI, gateway-facing SDK helpers, and plugins.
 *
 * Exact ids, remote IPs, normalized display names, and long id prefixes are the
 * only accepted query shapes; fuzzy ordering lives here so callers agree.
 */
/** Node fields accepted by shared CLI/API node selection helpers. */
type NodeMatchCandidate = {
  /** Stable node id used for RPC/session routing. */nodeId: string; /** Human-facing node name used for fuzzy operator input. */
  displayName?: string; /** Tailscale or network address accepted as an exact match. */
  remoteIp?: string; /** Connected nodes win only after the strongest match type is chosen. */
  connected?: boolean; /** Client id used to prefer current OpenClaw nodes over legacy migration ties. */
  clientId?: string;
};
//#endregion
//#region src/shared/node-resolve.d.ts
type ResolveNodeFromListOptions<TNode extends NodeMatchCandidate> = {
  allowDefault?: boolean;
  allowCompactDisplayName?: boolean;
  pickDefaultNode?: (nodes: TNode[]) => TNode | null;
};
/** Resolves a user query to a node id, optionally using a caller-defined blank-query default. */
/** Resolves a full node entry, preserving synthetic defaults returned by the picker. */
declare function resolveNodeFromNodeList<TNode extends NodeMatchCandidate>(nodes: TNode[], query?: string, options?: ResolveNodeFromListOptions<TNode>): TNode;
//#endregion
//#region src/gateway/server-json.d.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
declare function parseGatewayPayload(value: string | null | undefined): unknown;
//#endregion
//#region src/gateway/server-methods/nodes.helpers.d.ts
/** Narrows successful node invoke results or responds with the node error details. */
declare function respondUnavailableOnNodeInvokeError<T extends {
  ok: boolean;
  error?: unknown;
}>(respond: RespondFn, res: T): res is T & {
  ok: true;
};
//#endregion
//#region src/gateway/auth-resolve.d.ts
/** Authentication modes after config, override, and credential inputs are combined. */
type ResolvedGatewayAuthMode = "none" | "token" | "password" | "trusted-proxy";
/** Records which input selected the effective Gateway auth mode. */
type ResolvedGatewayAuthModeSource = "override" | "config" | "password" | "token" | "default";
/** Fully resolved Gateway auth policy before startup validates required secrets. */
type ResolvedGatewayAuth = {
  mode: ResolvedGatewayAuthMode;
  modeSource?: ResolvedGatewayAuthModeSource;
  token?: string;
  password?: string;
  allowTailscale: boolean;
  trustedProxy?: GatewayTrustedProxyConfig;
};
/** Resolve Gateway auth mode, credentials, trusted-proxy policy, and Tailscale allowance. */
declare function resolveGatewayAuth(params: {
  authConfig?: GatewayAuthConfig | null;
  authOverride?: GatewayAuthConfig | null;
  env?: NodeJS.ProcessEnv;
  tailscaleMode?: GatewayTailscaleMode;
}): ResolvedGatewayAuth;
//#endregion
//#region src/gateway/startup-auth.d.ts
/** Ensure startup has effective Gateway auth, generating only an ephemeral token if needed. */
declare function ensureGatewayStartupAuth(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  authOverride?: GatewayAuthConfig;
  tailscaleOverride?: GatewayTailscaleConfig;
  warn?: (message: string) => void;
  /**
   * Legacy startup option retained for external callers. Startup-generated auth
   * is runtime-only; durable auth changes must go through explicit config tools.
   */
  persist?: boolean;
  baseHash?: string;
}): Promise<{
  cfg: OpenClawConfig;
  auth: ReturnType<typeof resolveGatewayAuth>;
  generatedToken?: string;
  persistedGeneratedToken: boolean;
}>;
//#endregion
//#region src/gateway/client-start-readiness.d.ts
/** Starts a gateway client once the shared event-loop readiness check passes. */
declare function startGatewayClientWhenEventLoopReady(client: GatewayClientStartable, options?: GatewayClientStartReadinessOptions): Promise<EventLoopReadyResult>;
//#endregion
//#region src/gateway/operator-approvals-client.d.ts
/** Create a Gateway client authorized for operator approval event handling. */
declare function createOperatorApprovalsGatewayClient(params: Pick<GatewayClientOptions, "clientDisplayName" | "onClose" | "onConnectError" | "onEvent" | "onHelloOk" | "onReconnectPaused"> & {
  config: OpenClawConfig;
  gatewayUrl?: string;
}): Promise<GatewayClient>;
//#endregion
//#region src/gateway/channel-status-patches.d.ts
/** Patch emitted when a channel connection is established. */
type ConnectedChannelStatusPatch = {
  connected: true;
  lastConnectedAt: number;
  lastEventAt: number;
};
/** Patch emitted when a channel transport reports activity without reconnecting. */
type TransportActivityChannelStatusPatch = {
  lastTransportActivityAt: number;
};
type ReadyChannelStatusPatch = {
  running: true;
  connected: true;
  lifecycle: "ready";
  lastConnectedAt: number;
  lastError: null;
  terminalDisconnect: undefined;
};
type BlockedChannelStatusPatch = {
  lifecycle: "blocked";
  terminalDisconnect: true;
  lastError: string;
};
type StoppedChannelStatusPatch = {
  running: false;
  connected: false;
  lifecycle: "stopped";
};
type ReadyChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof ReadyChannelStatusPatch>> & {
  lastConnectedAt?: number;
};
type BlockedChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof BlockedChannelStatusPatch>>;
type StoppedChannelStatusExtras = Partial<Omit<ChannelAccountSnapshot, keyof StoppedChannelStatusPatch>>;
/** Creates a connected-channel status patch with matching connection/event timestamps. */
declare function createConnectedChannelStatusPatch(at?: number): ConnectedChannelStatusPatch;
/** Creates a transport-activity patch for health/activity monitors. */
declare function createTransportActivityStatusPatch(at?: number): TransportActivityChannelStatusPatch;
/** Creates a ready patch that clears any retained terminal-auth verdict. */
declare function channelReadyPatch(): ReadyChannelStatusPatch;
declare function channelReadyPatch<TExtras extends ReadyChannelStatusExtras>(extras: TExtras): ReadyChannelStatusPatch & TExtras;
/** Creates a terminal blocked patch with a required operator-facing error. */
declare function channelBlockedPatch(lastError: string): BlockedChannelStatusPatch;
declare function channelBlockedPatch<TExtras extends BlockedChannelStatusExtras>(lastError: string, extras: TExtras): BlockedChannelStatusPatch & TExtras;
/** Creates the shared patch emitted after a channel account has stopped. */
declare function channelStoppedPatch(): StoppedChannelStatusPatch;
declare function channelStoppedPatch<TExtras extends StoppedChannelStatusExtras>(extras: TExtras): StoppedChannelStatusPatch & TExtras;
declare namespace gateway_runtime_d_exports {
  export { DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, ErrorCodes, GatewayClient, GatewayRequestHandlerOptions, GatewayRequestHandlers, GatewayRpcOpts, HostedPluginSurfaceUrlParams, NodeMatchCandidate, NodeSession, NormalizedPluginNodeCapabilityUrl, PLUGIN_NODE_CAPABILITY_PATH_PREFIX, addGatewayClientOptions, buildPluginNodeCapabilityScopedHostUrl, callGatewayFromCli, channelBlockedPatch, channelReadyPatch, channelStoppedPatch, createConnectedChannelStatusPatch, createOperatorApprovalsGatewayClient, createTransportActivityStatusPatch, ensureGatewayStartupAuth, errorShape, isLoopbackHost, isNodeCommandAllowed, mintPluginNodeCapabilityToken, normalizePluginNodeCapabilityScopedUrl, resolveAdvertisedLanHost, resolveGatewayAuth, resolveHostedPluginSurfaceUrl, resolveNodeCommandAllowlist, resolveNodeFromNodeList, respondUnavailableOnNodeInvokeError, parseGatewayPayload as safeParseJson, startGatewayClientWhenEventLoopReady };
}
declare function resolveAdvertisedLanHost(): Promise<string | null>;
//#endregion
//#region extensions/google-meet/src/plugin-registration.d.ts
declare const loadGoogleMeetGatewayRuntimeModule: (() => Promise<typeof gateway_runtime_d_exports>) & {
  peek: () => Promise<typeof gateway_runtime_d_exports> | undefined;
  clear: () => void;
};
type GoogleMeetGatewayRuntimeModule = Awaited<ReturnType<typeof loadGoogleMeetGatewayRuntimeModule>>;
type CallGatewayFromCli = GoogleMeetGatewayRuntimeModule["callGatewayFromCli"];
declare function isGoogleMeetAgentToolActionUnsupportedOnHost(params: {
  config: GoogleMeetConfig;
  raw: Record<string, unknown>;
  platform?: NodeJS.Platform;
}): boolean;
declare const testing: {
  setCallGatewayFromCliForTests(next?: CallGatewayFromCli): void;
  setPlatformForTests(next?: () => NodeJS.Platform): void;
  isGoogleMeetAgentToolActionUnsupportedOnHost: typeof isGoogleMeetAgentToolActionUnsupportedOnHost;
  resolveGoogleMeetGatewayOperationTimeoutMs: typeof resolveGoogleMeetGatewayOperationTimeoutMs;
};
//#endregion
//#region extensions/google-meet/index.d.ts
declare const _default: Omit<{
  id: string;
  name: string;
  description: string;
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
//#endregion
export { _default as default, testing };