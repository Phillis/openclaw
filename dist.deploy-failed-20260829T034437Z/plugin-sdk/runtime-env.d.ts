import { i as defaultRuntime, n as RuntimeEnv, r as createNonExitingRuntime } from "../runtime-DlqUc5_p.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { a as computeBackoff, s as sleepWithAbort, t as BackoffPolicy } from "../index-CVK1du31.js";
import { a as success, i as shouldLogVerbose, n as info, o as warn, r as logVerbose, t as danger } from "../globals-BSGGiwb5.js";
import { T as retryAsync, _ as formatDurationPrecise, b as isTruthyEnvValue, c as ensureGlobalUndiciEnvProxyDispatcher, n as isWSL2Sync, v as formatDurationSeconds } from "../wsl-LvaavS_E.js";
import { a as toPinoLikeLogger, i as setLoggerOverride, n as getChildLogger, r as resetLogger } from "../logger-C2rc9l0N.js";
import { n as registerUnhandledRejectionHandler, r as waitForAbortSignal, t as registerUncaughtExceptionHandler } from "../unhandled-rejections-G0ZFuLBr.js";
//#region src/utils/sleep.d.ts
/** Promise-based sleep that clamps timer inputs through the shared timeout resolver. */
declare function sleep(ms: number, signal?: AbortSignal): Promise<void>;
//#endregion
//#region src/global-state.d.ts
declare function isVerbose(): boolean;
//#endregion
export { type BackoffPolicy, type RuntimeEnv, computeBackoff, createNonExitingRuntime, createSubsystemLogger, danger, defaultRuntime, ensureGlobalUndiciEnvProxyDispatcher, formatDurationPrecise, formatDurationSeconds, getChildLogger, info, isTruthyEnvValue, isVerbose, isWSL2Sync, logVerbose, registerUncaughtExceptionHandler, registerUnhandledRejectionHandler, resetLogger, retryAsync, setLoggerOverride, shouldLogVerbose, sleep, sleepWithAbort, success, toPinoLikeLogger, waitForAbortSignal, warn };