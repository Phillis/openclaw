import { At as CliBackendExecutionMode, Bt as CliBackendPreparedExecution, Ft as CliBackendParseJsonlEvent, Gt as CliBackendThinkingLevel, Ht as CliBackendResolveExecutionArgsContext, It as CliBackendParseJsonlEventContext, Kt as CliBackendToolAvailability, Lt as CliBackendParsedJsonlEvent, Mt as CliBackendLiveSessionRequirement, Nt as CliBackendNativeToolMode, Ot as CliBackendAuthEpochMode, Pt as CliBackendNormalizeConfigContext, Rt as CliBackendPlugin, Ut as CliBackendRuntimeArtifactPolicy, Vt as CliBackendResolveExecutionArgs, Wt as CliBackendSideQuestionToolMode, jt as CliBackendJsonlUsage, kt as CliBackendConfig, qt as CliBackendToolAvailabilityEnforcement, zt as CliBackendPrepareExecutionContext } from "../types-BJ8oTDFw.js";

//#region src/plugins/cli-backend-errors.d.ts
/**
 * A selected auth profile could not be staged by its CLI backend.
 * Backends must not use this for local preparation or transport failures:
 * core treats it as evidence that the exact profile should be quarantined.
 */
declare class CliBackendAuthProfilePreparationError extends Error {
  constructor(message: string, options?: {
    cause?: unknown;
  });
}
//#endregion
//#region src/agents/cli-watchdog-defaults.d.ts
declare const CLI_FRESH_WATCHDOG_DEFAULTS: {
  readonly noOutputTimeoutRatio: 0.8;
  readonly minMs: 180000;
  readonly maxMs: 600000;
};
declare const CLI_RESUME_WATCHDOG_DEFAULTS: {
  readonly noOutputTimeoutRatio: 0.3;
  readonly minMs: 60000;
  readonly maxMs: 180000;
};
//#endregion
export { CLI_FRESH_WATCHDOG_DEFAULTS, CLI_RESUME_WATCHDOG_DEFAULTS, type CliBackendAuthEpochMode, CliBackendAuthProfilePreparationError, type CliBackendConfig, type CliBackendExecutionMode, type CliBackendJsonlUsage, type CliBackendLiveSessionRequirement, type CliBackendNativeToolMode, type CliBackendNormalizeConfigContext, type CliBackendParseJsonlEvent, type CliBackendParseJsonlEventContext, type CliBackendParsedJsonlEvent, type CliBackendPlugin, type CliBackendPrepareExecutionContext, type CliBackendPreparedExecution, type CliBackendResolveExecutionArgs, type CliBackendResolveExecutionArgsContext, type CliBackendRuntimeArtifactPolicy, type CliBackendSideQuestionToolMode, type CliBackendThinkingLevel, type CliBackendToolAvailability, type CliBackendToolAvailabilityEnforcement };