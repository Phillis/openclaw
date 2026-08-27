import { A as CliBackendLiveSessionCloseReason, B as CliBackendResolveExecutionArgs, C as CliBackendAuthEpochMode, D as CliBackendExecutionMode, E as CliBackendExecuteContext, F as CliBackendParseJsonlEventContext, G as CliBackendToolAvailability, H as CliBackendRuntimeArtifactPolicy, I as CliBackendParsedJsonlEvent, J as CliBackendToolPermissionResult, K as CliBackendToolAvailabilityEnforcement, L as CliBackendPlugin, M as CliBackendNativeToolMode, N as CliBackendNormalizeConfigContext, O as CliBackendJsonlUsage, P as CliBackendParseJsonlEvent, Q as CliBackendUserInputResult, R as CliBackendPrepareExecutionContext, T as CliBackendExecute, U as CliBackendSideQuestionToolMode, V as CliBackendResolveExecutionArgsContext, W as CliBackendThinkingLevel, X as CliBackendUserInputQuestion, Y as CliBackendUserInputOption, Z as CliBackendUserInputRequest, j as CliBackendLiveSessionHandle, k as CliBackendLiveSessionCapability, q as CliBackendToolPermissionRequest, w as CliBackendConfig, z as CliBackendPreparedExecution } from "../types-DP7cDwEi.js";
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
export { CLI_FRESH_WATCHDOG_DEFAULTS, CLI_RESUME_WATCHDOG_DEFAULTS, type CliBackendAuthEpochMode, CliBackendAuthProfilePreparationError, type CliBackendConfig, type CliBackendExecute, type CliBackendExecuteContext, type CliBackendExecutionMode, type CliBackendJsonlUsage, type CliBackendLiveSessionCapability, type CliBackendLiveSessionCloseReason, type CliBackendLiveSessionHandle, type CliBackendNativeToolMode, type CliBackendNormalizeConfigContext, type CliBackendParseJsonlEvent, type CliBackendParseJsonlEventContext, type CliBackendParsedJsonlEvent, type CliBackendPlugin, type CliBackendPrepareExecutionContext, type CliBackendPreparedExecution, type CliBackendResolveExecutionArgs, type CliBackendResolveExecutionArgsContext, type CliBackendRuntimeArtifactPolicy, type CliBackendSideQuestionToolMode, type CliBackendThinkingLevel, type CliBackendToolAvailability, type CliBackendToolAvailabilityEnforcement, type CliBackendToolPermissionRequest, type CliBackendToolPermissionResult, type CliBackendUserInputOption, type CliBackendUserInputQuestion, type CliBackendUserInputRequest, type CliBackendUserInputResult };