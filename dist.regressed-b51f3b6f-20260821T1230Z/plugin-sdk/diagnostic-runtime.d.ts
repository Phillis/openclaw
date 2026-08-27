import { Bt as isDiagnosticsEnabled, Ht as onDiagnosticEvent, Jt as waitForDiagnosticEventsDrained, Kt as resetDiagnosticEventsForTest, Nt as emitTrustedDiagnosticEvent, P as DiagnosticModelCallContent, Pt as emitTrustedDiagnosticEventWithPrivateData, Ut as onInternalDiagnosticEvent, Vt as isInternalDiagnosticEventMetadata, a as DiagnosticEventPayload, i as DiagnosticEventMetadata, kt as emitDiagnosticEvent, o as DiagnosticEventPrivateData, zt as hasPendingInternalDiagnosticEvent } from "../diagnostic-events-XF2IPtMP.js";
import { a as formatDiagnosticTraceparent, c as isValidDiagnosticTraceFlags, i as createDiagnosticTraceContextFromActiveScope, l as isValidDiagnosticTraceId, n as createChildDiagnosticTraceContext, o as freezeDiagnosticTraceContext, r as createDiagnosticTraceContext, s as isValidDiagnosticSpanId, t as DiagnosticTraceContext, u as parseDiagnosticTraceparent } from "../diagnostic-trace-context-c5mRZYEt.js";
import { t as isDiagnosticFlagEnabled } from "../diagnostic-flags-CI4TfQUw.js";

//#region src/infra/diagnostic-llm-content.d.ts
/** Per-field policy for diagnostic traces that may include model-visible content. */
type DiagnosticModelContentCapturePolicy = {
  /** Capture chat/message payloads sent to a model. */inputMessages: boolean; /** Capture model response messages. */
  outputMessages: boolean; /** Capture tool invocation arguments. */
  toolInputs: boolean; /** Capture tool result payloads. */
  toolOutputs: boolean; /** Capture the system prompt or instruction block. */
  systemPrompt: boolean; /** Capture tool schemas/definitions presented to a model. */
  toolDefinitions: boolean; /** Whether any model-visible prompt/response/schema content is enabled. */
  anyModelContent: boolean;
};
/** Resolves model-content diagnostic capture from config, defaulting to no content capture. */
declare function resolveDiagnosticModelContentCapturePolicy(config: unknown): DiagnosticModelContentCapturePolicy;
//#endregion
//#region src/plugin-sdk/diagnostic-runtime.d.ts
declare function normalizeDiagnosticValue(value: string | undefined, fallback?: string): string;
declare function normalizeDiagnosticLane(value: string | undefined, fallback?: string): string;
//#endregion
export { type DiagnosticEventMetadata, type DiagnosticEventPayload, type DiagnosticEventPrivateData, type DiagnosticModelCallContent, type DiagnosticModelContentCapturePolicy, type DiagnosticTraceContext, createChildDiagnosticTraceContext, createDiagnosticTraceContext, createDiagnosticTraceContextFromActiveScope, emitDiagnosticEvent, emitTrustedDiagnosticEvent, emitTrustedDiagnosticEventWithPrivateData, formatDiagnosticTraceparent, freezeDiagnosticTraceContext, hasPendingInternalDiagnosticEvent, isDiagnosticFlagEnabled, isDiagnosticsEnabled, isInternalDiagnosticEventMetadata, isValidDiagnosticSpanId, isValidDiagnosticTraceFlags, isValidDiagnosticTraceId, normalizeDiagnosticLane, normalizeDiagnosticValue, onDiagnosticEvent, onInternalDiagnosticEvent, parseDiagnosticTraceparent, resetDiagnosticEventsForTest, resolveDiagnosticModelContentCapturePolicy, waitForDiagnosticEventsDrained };