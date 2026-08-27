import "./acpx-BA25QFjp.js";
import { G as AcpRuntime } from "./types.openclaw-Ca71eRYk.js";
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
//#region src/plugin-sdk/windows-spawn.d.ts
/** Final execution strategy chosen for a Windows spawn command. */
type WindowsSpawnResolution = "direct" | "node-entrypoint" | "exe-entrypoint" | "shell-fallback";
/** Direct-spawn resolution before shell fallback is considered. */
type WindowsSpawnCandidateResolution = Exclude<WindowsSpawnResolution, "shell-fallback">;
/** Direct-spawn candidate before shell fallback policy is applied. */
type WindowsSpawnProgramCandidate = {
  /** Executable passed to child_process after wrapper resolution. */
  command: string;
  /** Arguments prepended before call-site argv, usually a resolved JS entrypoint. */
  leadingArgv: string[];
  /** Candidate resolution path, or unresolved-wrapper when shell policy must decide. */
  resolution: WindowsSpawnCandidateResolution | "unresolved-wrapper";
  /** Hide the transient Windows console for Node/exe entrypoint launches. */
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
  packageName?: string;
  /** Trusted compatibility escape hatch for callers that intentionally accept shell-mediated wrapper execution. */
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
export { materializeWindowsSpawnProgram as a, registerAcpRuntimeBackend as c, applyWindowsSpawnProgramPolicy as i, unregisterAcpRuntimeBackend as l, WindowsSpawnProgramCandidate as n, resolveWindowsSpawnProgramCandidate as o, WindowsSpawnResolution as r, getAcpRuntimeBackend as s, WindowsSpawnProgram as t };