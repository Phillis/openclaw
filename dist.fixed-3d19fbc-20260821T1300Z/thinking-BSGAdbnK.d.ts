import { h as ProviderWrapStreamFnContext$1 } from "./types-BC3VLVBd.js";
import { ln as StreamFn } from "./setup-wizard-types-u0truel5.js";
//#region src/llm/providers/stream-wrappers/google-thinking-payload.d.ts
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingLevel = "MINIMAL" | "LOW" | "MEDIUM" | "HIGH";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
type GoogleThinkingInputLevel = "off" | "minimal" | "low" | "medium" | "adaptive" | "high" | "max" | "xhigh";
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleThinkingRequiredModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini25ThinkingBudgetModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3ProModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3FlashModel(modelId: string): boolean;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function isGoogleGemini3ThinkingLevelModel(modelId: string): boolean;
/**
 * Maps legacy numeric/semantic thinking input onto Gemini 3's provider enum.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function resolveGoogleGemini3ThinkingLevel(params: {
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
  thinkingBudget?: number;
}): GoogleThinkingLevel | undefined;
/**
 * Removes `thinkingBudget=0` only for Gemini models that reject disabled thinking.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function stripInvalidGoogleThinkingBudget(params: {
  thinkingConfig: Record<string, unknown>;
  modelId?: string;
}): boolean;
/**
 * Normalizes Google thinking config across SDK payload shapes before provider transport.
 * @deprecated Google provider-owned stream helper; do not use from third-party plugins.
 */
declare function sanitizeGoogleThinkingPayload(params: {
  payload: unknown;
  modelId?: string;
  thinkingLevel?: GoogleThinkingInputLevel;
}): void;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.d.ts
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
/** Optional provider stream decorator factory used by shared provider wrappers. */
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
//#endregion
export { isGoogleGemini25ThinkingBudgetModel as a, isGoogleGemini3ThinkingLevelModel as c, sanitizeGoogleThinkingPayload as d, stripInvalidGoogleThinkingBudget as f, GoogleThinkingLevel as i, isGoogleThinkingRequiredModel as l, createGoogleThinkingStreamWrapper as n, isGoogleGemini3FlashModel as o, GoogleThinkingInputLevel as r, isGoogleGemini3ProModel as s, createGoogleThinkingPayloadWrapper as t, resolveGoogleGemini3ThinkingLevel as u };