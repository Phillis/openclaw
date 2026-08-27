import { f as GatewayAuthConfig, h as GatewayTrustedProxyConfig, m as GatewayTailscaleMode, p as GatewayTailscaleConfig, r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { r as ChannelAccountSnapshot } from "../types.core-D43joVXt.js";
import { Bt as buildPluginNodeCapabilityScopedHostUrl, Ht as normalizePluginNodeCapabilityScopedUrl, It as NodeSession, Lt as DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, Rt as NormalizedPluginNodeCapabilityUrl, Vt as mintPluginNodeCapabilityToken, i as GatewayRequestHandlers, o as RespondFn, r as GatewayRequestHandlerOptions, zt as PLUGIN_NODE_CAPABILITY_PATH_PREFIX } from "../types-4_wTt5Pv.js";
import { Q as ErrorCodes, R as errorShape } from "../index-Cf_fvo6T.js";
import { t as isLoopbackHost } from "../net-F7HGAsK5.js";
import { i as GatewayClientStartable, n as GatewayClientOptions, r as GatewayClientStartReadinessOptions, t as GatewayClient } from "../client-4Iumulij.js";
import { n as callGatewayFromCli, r as GatewayRpcOpts, t as addGatewayClientOptions } from "../gateway-rpc-BpCrgOo6.js";
import { IncomingMessage } from "node:http";

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
//#endregion
//#region src/plugin-sdk/gateway-runtime.d.ts
declare function resolveAdvertisedLanHost(): Promise<string | null>;
//#endregion
export { DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS, ErrorCodes, GatewayClient, type GatewayRequestHandlerOptions, type GatewayRequestHandlers, type GatewayRpcOpts, type HostedPluginSurfaceUrlParams, type NodeMatchCandidate, type NodeSession, type NormalizedPluginNodeCapabilityUrl, PLUGIN_NODE_CAPABILITY_PATH_PREFIX, addGatewayClientOptions, buildPluginNodeCapabilityScopedHostUrl, callGatewayFromCli, channelBlockedPatch, channelReadyPatch, channelStoppedPatch, createConnectedChannelStatusPatch, createOperatorApprovalsGatewayClient, createTransportActivityStatusPatch, ensureGatewayStartupAuth, errorShape, isLoopbackHost, isNodeCommandAllowed, mintPluginNodeCapabilityToken, normalizePluginNodeCapabilityScopedUrl, resolveAdvertisedLanHost, resolveGatewayAuth, resolveHostedPluginSurfaceUrl, resolveNodeCommandAllowlist, resolveNodeFromNodeList, respondUnavailableOnNodeInvokeError, parseGatewayPayload as safeParseJson, startGatewayClientWhenEventLoopReady };