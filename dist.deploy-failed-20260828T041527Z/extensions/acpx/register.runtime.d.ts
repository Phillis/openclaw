import { Sr as __exportAll, dn as PluginLogger, sn as OpenClawPluginService } from "../../acpx-hsLTUlEK.js";
import { G as AcpRuntime, Q as AcpRuntimeTurn, et as AcpRuntimeTurnInput } from "../../types.openclaw-n6JIVcIK.js";
import { r as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "../../channel-contract-DsIFrPEf.js";
import "../../runtime-api-CF93-MBS.js";
import "../../plugin-state-runtime-Dkg9tCIM.js";
import { z } from "zod";
//#region extensions/acpx/src/config-schema.d.ts
declare const ACPX_PERMISSION_MODES: readonly ["approve-all", "approve-reads", "deny-all"];
/** Permission policy applied to interactive ACPX tool requests. */
type AcpxPermissionMode = (typeof ACPX_PERMISSION_MODES)[number];
declare const ACPX_NON_INTERACTIVE_POLICIES: readonly ["deny", "fail"];
/** Permission policy applied when ACPX cannot ask a human for approval. */
type AcpxNonInteractivePermissionPolicy = (typeof ACPX_NON_INTERACTIVE_POLICIES)[number];
/** Raw MCP server command config accepted from plugin configuration. */
type McpServerConfig = {
  command: string;
  args?: string[];
  env?: Record<string, string>;
};
/** Fully resolved ACPX config consumed by the runtime service. */
type ResolvedAcpxPluginConfig = {
  cwd: string;
  stateDir: string;
  probeAgent?: string;
  permissionMode: AcpxPermissionMode;
  nonInteractivePermissions: AcpxNonInteractivePermissionPolicy;
  pluginToolsMcpBridge: boolean;
  openClawToolsMcpBridge: boolean;
  timeoutSeconds?: number;
  mcpServers: Record<string, McpServerConfig>;
  agents: Record<string, string>;
};
//#endregion
//#region extensions/acpx/src/process-lease.d.ts
/** Lifecycle state for a tracked ACPX wrapper process. */
type AcpxProcessLeaseState = "open" | "closing" | "closed" | "lost";
/** Persisted identity and command metadata for one ACPX wrapper process. */
type AcpxProcessLease = {
  leaseId: string;
  gatewayInstanceId: string;
  sessionKey: string;
  wrapperRoot: string;
  wrapperPath: string;
  rootPid: number;
  processGroupId?: number;
  commandHash: string;
  startedAt: number;
  state: AcpxProcessLeaseState;
};
/** Async lease store used by runtime sessions and cleanup routines. */
type AcpxProcessLeaseStore = {
  load(leaseId: string): Promise<AcpxProcessLease | undefined>;
  listOpen(gatewayInstanceId?: string): Promise<AcpxProcessLease[]>;
  save(lease: AcpxProcessLease): Promise<void>;
  markState(leaseId: string, state: AcpxProcessLeaseState): Promise<void>;
};
//#endregion
//#region extensions/acpx/src/process-reaper.d.ts
/** Minimal process-table row used by ACPX cleanup. */
type AcpxProcessInfo = {
  pid: number;
  ppid: number;
  command: string;
};
/** Injectable process-listing and termination hooks for tests. */
type AcpxProcessCleanupDeps = {
  listProcesses?: () => Promise<AcpxProcessInfo[]>;
  killProcess?: (pid: number, signal: NodeJS.Signals) => void;
  platform?: NodeJS.Platform;
  sleep?: (ms: number) => Promise<void>;
};
//#endregion
//#region extensions/acpx/src/runtime-proxy.d.ts
type CompleteAcpRuntimeTurn = AcpRuntimeTurn & Required<Pick<AcpRuntimeTurn, "promptStarted">>;
/**
 * Contract for runtimes this extension resolves behind the lazy proxy. The
 * SDK keeps these hooks optional for third-party backends, but every ACPX
 * runtime (the extension's AcpxRuntime and the upstream acpx runtime)
 * implements the full surface. Requiring them here turns an absent hook into
 * a compile error instead of a silently fabricated success at runtime.
 */
type CompleteAcpRuntime = Omit<AcpRuntime, "startTurn"> & Required<Pick<AcpRuntime, "getCapabilities" | "getStatus" | "setMode" | "setConfigOption" | "doctor" | "prepareFreshSession">> & {
  startTurn(input: AcpRuntimeTurnInput): CompleteAcpRuntimeTurn;
};
declare namespace service_d_exports {
  export { createAcpxRuntimeService$1 as createAcpxRuntimeService, resolveAcpxTimerTimeoutMs };
}
type AcpxRuntimeLike = CompleteAcpRuntime & {
  probeAvailability(): Promise<void>;
  isHealthy(): boolean;
};
type AcpxRuntimeFactoryParams = {
  pluginConfig: ResolvedAcpxPluginConfig;
  gatewayInstanceId: string;
  processLeaseStore: AcpxProcessLeaseStore;
  wrapperRoot: string;
  logger?: PluginLogger;
};
type AcpxBackendLifecycle = {
  publish: (backend: {
    runtime: CompleteAcpRuntime;
    healthy?: () => boolean;
  }) => void;
  retract: (runtime: CompleteAcpRuntime) => void;
};
type CreateAcpxRuntimeServiceParams$1 = {
  backendLifecycle: AcpxBackendLifecycle;
  pluginConfig?: unknown;
  openKeyedStore?: <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
  runtimeFactory?: (params: AcpxRuntimeFactoryParams) => AcpxRuntimeLike | Promise<AcpxRuntimeLike>;
  processCleanupDeps?: AcpxProcessCleanupDeps;
};
/** Convert ACPX timeout seconds into timer-safe milliseconds. */
declare function resolveAcpxTimerTimeoutMs(timeoutSeconds: number | undefined): number | undefined;
/** Create the ACPX plugin service that owns runtime registration and cleanup. */
declare function createAcpxRuntimeService$1(params: CreateAcpxRuntimeServiceParams$1): OpenClawPluginService;
//#endregion
//#region extensions/acpx/register.runtime.d.ts
type RealAcpxServiceModule = typeof service_d_exports;
type InnerAcpxRuntimeServiceParams = NonNullable<Parameters<RealAcpxServiceModule["createAcpxRuntimeService"]>[0]>;
type CreateAcpxRuntimeServiceParams = Omit<InnerAcpxRuntimeServiceParams, "backendLifecycle">;
/** Creates the plugin service that registers ACPX as an ACP runtime backend. */
declare function createAcpxRuntimeService(params?: CreateAcpxRuntimeServiceParams): OpenClawPluginService;
//#endregion
export { createAcpxRuntimeService };