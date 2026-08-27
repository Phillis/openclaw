import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { n as defaultRuntime } from "../runtime-CxgPx-f8.js";
import { f as shortenHomeInString, p as shortenHomePath } from "../utils-BkRxOgsB.js";
import { i as withManager, n as formatHelpExamples, t as theme } from "../theme-DEeEiwE7.js";

//#region src/global-state.d.ts
declare function setVerbose(v: boolean): void;
declare function isVerbose(): boolean;
//#endregion
//#region src/infra/errors.d.ts
declare function formatErrorMessage(err: unknown): string;
//#endregion
//#region src/cli/command-secret-gateway.d.ts
type ResolveCommandSecretsResult = {
  resolvedConfig: OpenClawConfig;
  diagnostics: string[];
  targetStatesByPath: Record<string, CommandSecretTargetState>;
  hadUnresolvedTargets: boolean;
};
type CommandSecretResolutionMode = "enforce_resolved" | "read_only_status" | "read_only_operational";
type LegacyCommandSecretResolutionMode = "strict" | "summary" | "operational_readonly";
type CommandSecretResolutionModeInput = CommandSecretResolutionMode | LegacyCommandSecretResolutionMode;
type CommandSecretTargetState = "resolved_gateway" | "resolved_local" | "inactive_surface" | "unresolved";
declare function resolveCommandSecretRefsViaGateway(params: {
  config: OpenClawConfig;
  commandName: string;
  targetIds: Set<string>;
  mode?: CommandSecretResolutionModeInput;
  allowedPaths?: ReadonlySet<string>;
  forcedActivePaths?: ReadonlySet<string>;
  optionalActivePaths?: ReadonlySet<string>;
  allowLocalExecSecretRefs?: boolean;
  scrubUnresolvedSecretRefs?: boolean;
}): Promise<ResolveCommandSecretsResult>;
//#endregion
//#region src/cli/progress.d.ts
type ProgressOptions = {
  label: string;
  indeterminate?: boolean;
  total?: number;
  enabled?: boolean;
  delayMs?: number;
  stream?: NodeJS.WriteStream;
  fallback?: "spinner" | "line" | "log" | "none";
};
/** Minimal progress API exposed to CLI work callbacks. */
type ProgressReporter = {
  setLabel: (label: string) => void;
  setPercent: (percent: number) => void;
  tick: (delta?: number) => void;
  done: () => void;
};
/** Completed/total progress update shape used by totals-based commands. */
type ProgressTotalsUpdate = {
  completed: number;
  total: number;
  label?: string;
};
/** Run async work with a progress reporter that is always stopped in finally. */
declare function withProgress<T>(options: ProgressOptions, work: (progress: ProgressReporter) => Promise<T>): Promise<T>;
/** Run async work with a progress reporter plus a completed/total update adapter. */
declare function withProgressTotals<T>(options: ProgressOptions, work: (update: (update: ProgressTotalsUpdate) => void, progress: ProgressReporter) => Promise<T>): Promise<T>;
//#endregion
//#region packages/terminal-core/src/links.d.ts
declare function formatDocsLink(path: string | undefined | null, label?: string, opts?: {
  fallback?: string;
  force?: boolean;
}): string;
//#endregion
export { defaultRuntime, formatDocsLink, formatErrorMessage, formatHelpExamples, isVerbose, resolveCommandSecretRefsViaGateway, setVerbose, shortenHomeInString, shortenHomePath, theme, withManager, withProgress, withProgressTotals };