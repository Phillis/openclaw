import { t as FailoverReason } from "./signal-DTFr3i_8.js";
//#region src/agents/model-fallback.types.d.ts
type FallbackAttempt = {
  provider: string;
  model: string;
  error: string;
  reason?: FailoverReason;
  authMode?: string;
  status?: number;
  code?: string;
};
/** Original route plus the outer fallback stage that admitted one real attempt. */
type ModelFallbackAttemptProvenance = {
  requestedProvider: string;
  requestedModel: string;
  stage: "initial" | "fallback";
  fallbackReason?: FailoverReason;
};
//#endregion
export { ModelFallbackAttemptProvenance as n, FallbackAttempt as t };