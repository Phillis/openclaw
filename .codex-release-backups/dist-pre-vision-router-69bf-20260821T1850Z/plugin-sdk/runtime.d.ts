import { r as OpenClawConfig } from "../types.openclaw-D3TBp_34.js";
import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime, t as OutputRuntimeEnv } from "../runtime-DRcp7-j9.js";
import { n as resolveRuntimeEnv, t as createLoggerBackedRuntime } from "../runtime-logger.internal-pBc-2lip.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-G0ZFuLBr.js";

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
//#region src/cli/command-secret-targets.d.ts
/** All registered channel secret targets, regardless of current config. */
declare function getChannelsCommandSecretTargetIds(): Set<string>;
//#endregion
export { type OutputRuntimeEnv, type RuntimeEnv, createLoggerBackedRuntime, createNonExitingRuntime, defaultRuntime, getChannelsCommandSecretTargetIds, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resolveCommandSecretRefsViaGateway, resolveRuntimeEnv, waitForAbortSignal };