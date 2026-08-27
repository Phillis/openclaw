import { G as PluginHookReplyDispatchContext, K as PluginHookReplyDispatchEvent, q as PluginHookReplyDispatchResult } from "./types-7E39v2Gx.js";
import { D as AcpRuntime } from "./types.openclaw-3CDavCPO.js";
//#region packages/acp-core/src/runtime/errors.d.ts
declare const ACP_ERROR_CODES: readonly ["ACP_BACKEND_MISSING", "ACP_BACKEND_UNAVAILABLE", "ACP_BACKEND_UNSUPPORTED_CONTROL", "ACP_DISPATCH_DISABLED", "ACP_INVALID_RUNTIME_OPTION", "ACP_SESSION_INIT_FAILED", "ACP_TURN_FAILED"];
type AcpRuntimeErrorCode = (typeof ACP_ERROR_CODES)[number];
/** Error type used at ACP runtime boundaries so callers can preserve structured failure codes. */
declare class AcpRuntimeError extends Error {
  readonly code: AcpRuntimeErrorCode;
  /**
   * Backend-specific structured failure code (e.g. acpx "SESSION_RESUME_REQUIRED"),
   * preserved so recovery decisions key on the failure kind rather than parsing
   * the human-readable message.
   */
  readonly detailCode?: string;
  readonly cause?: unknown;
  constructor(code: AcpRuntimeErrorCode, message: string, options?: {
    cause?: unknown;
    detailCode?: string;
  });
}
//#endregion
//#region src/acp/runtime/registry.d.ts
/** Registered ACP backend with optional health probe used for auto-selection. */
type AcpRuntimeBackend = {
  id: string;
  runtime: AcpRuntime;
  healthy?: () => boolean;
};
/** Registers or replaces an ACP runtime backend by normalized id. */
declare function registerAcpRuntimeBackend(backend: AcpRuntimeBackend): void;
/** Removes a registered ACP runtime backend by id. */
declare function unregisterAcpRuntimeBackend(id: string): void;
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
//#endregion
//#region src/plugin-sdk/acpx.d.ts
/**
 * Dispatch a plugin reply hook through ACP when the event targets an ACP-bound session.
 * Returns a handled result only when ACP consumes the reply; otherwise callers continue normal delivery.
 */
declare function tryDispatchAcpReplyHook(event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext): Promise<PluginHookReplyDispatchResult | void>;
//#endregion
//#region src/plugin-sdk/windows-spawn.d.ts
/** Final execution strategy chosen for a Windows spawn command. */
type WindowsSpawnResolution = "direct" | "node-entrypoint" | "exe-entrypoint" | "shell-fallback";
/** Direct-spawn resolution before shell fallback is considered. */
type WindowsSpawnCandidateResolution = Exclude<WindowsSpawnResolution, "shell-fallback">;
/** Direct-spawn candidate before shell fallback policy is applied. */
type WindowsSpawnProgramCandidate = {
  /** Executable passed to child_process after wrapper resolution. */command: string; /** Arguments prepended before call-site argv, usually a resolved JS entrypoint. */
  leadingArgv: string[]; /** Candidate resolution path, or unresolved-wrapper when shell policy must decide. */
  resolution: WindowsSpawnCandidateResolution | "unresolved-wrapper"; /** Hide the transient Windows console for Node/exe entrypoint launches. */
  windowsHide?: boolean;
};
/** Spawn program after Windows wrapper resolution and fallback policy. */
type WindowsSpawnProgram = {
  command: string;
  leadingArgv: string[];
  resolution: WindowsSpawnResolution;
  shell?: boolean;
  windowsHide?: boolean;
};
/** Fully materialized child_process invocation for a resolved Windows spawn program. */
type WindowsSpawnInvocation = {
  command: string;
  argv: string[];
  resolution: WindowsSpawnResolution;
  shell?: boolean;
  windowsHide?: boolean;
};
/** Inputs used to resolve a command into a Windows-safe direct spawn program. */
type ResolveWindowsSpawnProgramParams = {
  command: string;
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  execPath?: string;
  packageName?: string; /** Trusted compatibility escape hatch for callers that intentionally accept shell-mediated wrapper execution. */
  allowShellFallback?: boolean;
};
/** Inputs for candidate resolution that intentionally excludes shell fallback policy. */
type ResolveWindowsSpawnProgramCandidateParams = Omit<ResolveWindowsSpawnProgramParams, "allowShellFallback">;
/** Resolve the safest direct spawn candidate for Windows wrappers, scripts, and binaries. */
declare function resolveWindowsSpawnProgramCandidate(params: ResolveWindowsSpawnProgramCandidateParams): WindowsSpawnProgramCandidate;
/** Apply shell-fallback policy when Windows wrapper resolution could not find a direct entrypoint. */
declare function applyWindowsSpawnProgramPolicy(params: {
  candidate: WindowsSpawnProgramCandidate;
  allowShellFallback?: boolean;
}): WindowsSpawnProgram;
/** Combine a resolved Windows spawn program with call-site argv for actual process launch. */
declare function materializeWindowsSpawnProgram(program: WindowsSpawnProgram, argv: string[]): WindowsSpawnInvocation;
//#endregion
export { materializeWindowsSpawnProgram as a, getAcpRuntimeBackend as c, AcpRuntimeError as d, AcpRuntimeErrorCode as f, applyWindowsSpawnProgramPolicy as i, registerAcpRuntimeBackend as l, WindowsSpawnProgramCandidate as n, resolveWindowsSpawnProgramCandidate as o, WindowsSpawnResolution as r, tryDispatchAcpReplyHook as s, WindowsSpawnProgram as t, unregisterAcpRuntimeBackend as u };