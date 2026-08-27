import { n as RuntimeEnv } from "../runtime-DlqUc5_p.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { n as redactSensitiveText, r as redactToolPayloadText, t as redactSensitiveFieldValue } from "../redact-CL0ys0IX.js";
import { a as stopDiagnosticHeartbeat, i as startDiagnosticHeartbeat, n as logWebhookProcessed, r as logWebhookReceived, t as logWebhookError } from "../diagnostic-Dmxv-7Vh.js";
import { n as getChildLogger, o as LoggerSettings, t as LoggerResolvedSettings } from "../logger-HKLtViD2.js";
//#region src/logger.d.ts
declare function logInfo(message: string, runtime?: RuntimeEnv): void;
declare function logError(message: string, runtime?: RuntimeEnv): void;
declare function logDebug(message: string): void;
//#endregion
//#region src/logging/redact-identifier.d.ts
/** Redacts an identifier to a stable hash label, or "-" for missing values. */
declare function redactIdentifier(value: string | undefined, opts?: {
  len?: number;
}): string;
//#endregion
export { type LoggerResolvedSettings, type LoggerSettings, createSubsystemLogger, getChildLogger, logDebug, logError, logInfo, logWebhookError, logWebhookProcessed, logWebhookReceived, redactIdentifier, redactSensitiveFieldValue, redactSensitiveText, redactToolPayloadText, startDiagnosticHeartbeat, stopDiagnosticHeartbeat };