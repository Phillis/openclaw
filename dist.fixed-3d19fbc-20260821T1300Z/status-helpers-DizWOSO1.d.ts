import { V as ChannelAccountSnapshot } from "./setup-wizard-types-D4fC5oCf.js";
//#region src/plugin-sdk/status-helpers.d.ts
type RuntimeLifecycleSnapshot = {
  linked?: boolean | null;
  running?: boolean | null;
  connected?: boolean | null;
  restartPending?: boolean | null;
  reconnectAttempts?: number | null;
  socketModeConnectionCount?: number | null;
  socketModeConnectionCountObservedAt?: number | null;
  socketModeSharedConnection?: boolean | null;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  healthState?: string | null;
  lifecycle?: ChannelAccountSnapshot["lifecycle"] | null;
  ingressUnavailable?: true | null;
  terminalDisconnect?: boolean | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  busy?: boolean | null;
  activeRuns?: number | null;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
};
type StatusSnapshotExtra = Record<string, unknown>;
/** Convenience wrapper when the caller already has flattened account fields instead of an account object. */
declare function buildComputedAccountStatusSnapshot<TExtra extends StatusSnapshotExtra>(params: {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
  runtime?: RuntimeLifecycleSnapshot | null;
  probe?: unknown;
}, extra?: TExtra): {
  lastInboundAt: number | null;
  lastOutboundAt: number | null;
  activeRunStartedAt?: number | undefined;
  lastRunActivityAt?: number | undefined;
  activeRuns?: number | undefined;
  busy?: boolean | undefined;
  terminalDisconnect?: true | undefined;
  ingressUnavailable?: true | undefined;
  lifecycle?: "starting" | "ready" | "recovering" | "blocked" | "stopped" | undefined;
  healthState?: string | undefined;
  lastTransportActivityAt?: number | undefined;
  lastEventAt?: number | undefined;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | undefined;
  lastConnectedAt?: number | undefined;
  socketModeSharedConnection?: boolean | undefined;
  socketModeConnectionCountObservedAt?: number | undefined;
  socketModeConnectionCount?: number | undefined;
  reconnectAttempts?: number | undefined;
  restartPending?: boolean | undefined;
  connected?: boolean | undefined;
  linked?: boolean | undefined;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
  probe: unknown;
  accountId: string;
  name: string | undefined;
  enabled: boolean | undefined;
  configured: boolean | undefined;
} & TExtra;
/** Build token-based channel status summaries with optional mode reporting. */
declare function buildTokenChannelStatusSummary(snapshot: {
  configured?: boolean | null;
  tokenSource?: string | null;
  running?: boolean | null;
  mode?: string | null;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastError?: string | null;
  probe?: unknown;
  lastProbeAt?: number | null;
}, opts?: {
  includeMode?: boolean;
}): {
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
} | {
  mode: string | null;
  tokenSource: string;
  probe: unknown;
  lastProbeAt: number | null;
  configured: boolean;
  running: boolean;
  lastStartAt: number | null;
  lastStopAt: number | null;
  lastError: string | null;
};
//#endregion
export { buildTokenChannelStatusSummary as n, buildComputedAccountStatusSnapshot as t };