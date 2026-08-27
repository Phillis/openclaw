import { y as StreamFn } from "./types-Cm3n7XMD.js";
import { b as StreamFn$1 } from "./types-DKu1Bc4Q.js";
import { et as ProviderWrapStreamFnContext$1 } from "./types-BJ8oTDFw.js";
import { G as ThinkLevel } from "./hook-types-CQwktOys.js";
import { createDeferredEventBuffer, notifyLlmRequestActivity, onLlmRequestActivity } from "@openclaw/ai/internal/runtime";
import { applyAnthropicEphemeralCacheControlMarkers, applyAnthropicPayloadPolicyToParams, resolveAnthropicPayloadPolicy } from "@openclaw/ai/transports";
import { applyAnthropicRefusal } from "@openclaw/ai/internal/anthropic";

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
//#region src/llm/providers/stream-wrappers/stream-payload-utils.d.ts
/** Wraps a stream function and lets callers mutate outgoing provider payload objects. */
declare function streamWithPayloadPatch(underlying: StreamFn, model: Parameters<StreamFn>[0], context: Parameters<StreamFn>[1], options: Parameters<StreamFn>[2], patchPayload: (payload: Record<string, unknown>) => void): ReturnType<StreamFn>;
//#endregion
//#region src/llm/providers/stream-wrappers/zai.d.ts
/**
 * Inject `tool_stream=true` so tool-call deltas stream in real time.
 * Providers can disable this by setting `params.tool_stream=false`.
 *
 * @deprecated Provider-owned stream helper; do not use from third-party plugins.
 */
declare function createToolStreamWrapper(baseStreamFn: StreamFn$1 | undefined, enabled: boolean): StreamFn$1;
//#endregion
//#region src/plugin-sdk/provider-stream-shared.d.ts
type ProviderWrapStreamFnContext = ProviderWrapStreamFnContext$1;
/** Optional provider stream decorator factory used by shared provider wrappers. */
type ProviderStreamWrapperFactory = /** Wrapper factory that can decorate, replace, or omit a provider stream function. */((streamFn: StreamFn$1 | undefined) => StreamFn$1 | undefined) | null | undefined | false;
/** Compose stream wrapper factories from left to right around a base stream function. */
declare function composeProviderStreamWrappers(/** Base provider stream function to pass through the wrapper chain. */

baseStreamFn: StreamFn$1 | undefined, /** Ordered wrapper factories; falsey entries are skipped. */...wrappers: ProviderStreamWrapperFactory[]): StreamFn$1 | undefined;
/**
 * Provider stream wrapper for local/proxy providers that sometimes emit a
 * standalone textual tool-call block even when native tool calling is enabled.
 */
declare function createPlainTextToolCallCompatWrapper(/** Provider stream function to wrap; defaults to the simple stream implementation. */

baseStreamFn: StreamFn$1 | undefined): StreamFn$1;
/** @deprecated Bundled provider stream helper; do not use from third-party plugins. */
declare function defaultToolStreamExtraParams(/** Existing provider extra params; explicit tool_stream values are preserved. */

extraParams?: Record<string, unknown>): Record<string, unknown>;
/** Wrap a provider stream so callers can patch the outbound provider payload once. */
declare function createPayloadPatchStreamWrapper(/** Provider stream function whose outbound payload should be patched. */

baseStreamFn: StreamFn$1 | undefined, patchPayload: (params: {
  /** Mutable provider payload immediately before the underlying stream dispatches it. */payload: Record<string, unknown>; /** Model selected for the stream call. */
  model: Parameters<StreamFn$1>[0]; /** Stream context passed by the runtime. */
  context: Parameters<StreamFn$1>[1]; /** Stream options passed by the runtime. */
  options: Parameters<StreamFn$1>[2];
}) => void, wrapperOptions?: {
  shouldPatch?: (params: {
    /** Model selected for the stream call. */model: Parameters<StreamFn$1>[0]; /** Stream context passed by the runtime. */
    context: Parameters<StreamFn$1>[1]; /** Stream options passed by the runtime. */
    options: Parameters<StreamFn$1>[2];
  }) => boolean;
}): StreamFn$1;
/**
 * Applies explicit disabled-thinking intent to OpenAI-compatible Chat
 * Completions payloads without changing enabled reasoning levels.
 */
declare function createOpenAICompatibleCompletionsThinkingOffWrapper(baseStreamFn: StreamFn$1 | undefined, thinkingLevel?: ThinkLevel): StreamFn$1;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
declare function stripTrailingAnthropicAssistantPrefillWhenThinking(payload: Record<string, unknown>): number;
/** @deprecated Anthropic-family provider stream helper; do not use from third-party plugins. */
declare function createAnthropicThinkingPrefillPayloadWrapper(baseStreamFn: StreamFn$1 | undefined, onStripped?: (stripped: number) => void, wrapperOptions?: Parameters<typeof createPayloadPatchStreamWrapper>[2]): StreamFn$1;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
type OpenAICompatibleThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
declare function isOpenAICompatibleThinkingEnabled(params: {
  thinkingLevel: OpenAICompatibleThinkingLevel;
  options: Parameters<StreamFn$1>[2];
}): boolean;
/** Applies the shared reasoning payload policy used by OpenAI-compatible proxy providers. */
declare function normalizeOpenAICompatibleReasoningPayload(payload: Record<string, unknown>, thinkingLevel?: ThinkLevel): void;
/** Applies Qwen chat-template thinking flags without discarding provider-specific kwargs. */
declare function setQwenChatTemplateThinking(payload: Record<string, unknown>, enabled: boolean): void;
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
type DeepSeekV4ThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
type DeepSeekV4ReasoningEffort = "minimal" | "low" | "medium" | "high" | "xhigh" | "max";
/** Normalizes assistant reasoning replay shared by OpenAI-compatible provider families. */
declare function normalizeOpenAICompatibleReasoningReplay(payload: Record<string, unknown>, params: {
  /** Disabled reasoning strips replay fields instead of backfilling assistant turns. */thinkingEnabled: boolean; /** Restricts disabled-reasoning cleanup to assistant messages when required. */
  stripAssistantMessagesOnly?: boolean; /** Replaces explicit null values for transports that require string reasoning. */
  replaceNullReasoningContent?: boolean; /** Preserves provider-specific tool-call selection for assistant replay. */
  shouldBackfillAssistantMessage?: (message: Record<string, unknown>) => boolean;
}): void;
/** @deprecated DeepSeek provider stream helper; do not use from third-party plugins. */
declare function createDeepSeekV4OpenAICompatibleThinkingWrapper(params: {
  baseStreamFn: StreamFn$1 | undefined;
  thinkingLevel: DeepSeekV4ThinkingLevel;
  shouldPatchModel: (model: Parameters<StreamFn$1>[0]) => boolean;
  resolveReasoningEffort?: (thinkingLevel: DeepSeekV4ThinkingLevel) => DeepSeekV4ReasoningEffort;
  shouldBackfillAssistantReasoningContent?: (message: Record<string, unknown>) => boolean;
}): StreamFn$1 | undefined;
/** @deprecated OpenAI-compatible provider stream helper; do not use from third-party plugins. */
declare function createThinkingOnlyFinalTextWrapper(params: {
  baseStreamFn: StreamFn$1 | undefined;
  shouldPatchModel: (model: Parameters<StreamFn$1>[0]) => boolean;
}): StreamFn$1 | undefined;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingPayloadWrapper(baseStreamFn: StreamFn$1 | undefined, thinkingLevel?: GoogleThinkingInputLevel): StreamFn$1;
/** @deprecated Google provider-owned stream helper; do not use from third-party plugins. */
declare function createGoogleThinkingStreamWrapper(ctx: ProviderWrapStreamFnContext): NonNullable<ProviderWrapStreamFnContext["streamFn"]>;
//#endregion
export { GoogleThinkingLevel as A, resolveAnthropicPayloadPolicy as C, applyAnthropicEphemeralCacheControlMarkers as D, createToolStreamWrapper as E, isGoogleThinkingRequiredModel as F, resolveGoogleGemini3ThinkingLevel as I, sanitizeGoogleThinkingPayload as L, isGoogleGemini3FlashModel as M, isGoogleGemini3ProModel as N, streamWithPayloadPatch as O, isGoogleGemini3ThinkingLevelModel as P, stripInvalidGoogleThinkingBudget as R, onLlmRequestActivity as S, stripTrailingAnthropicAssistantPrefillWhenThinking as T, defaultToolStreamExtraParams as _, applyAnthropicPayloadPolicyToParams as a, normalizeOpenAICompatibleReasoningReplay as b, createAnthropicThinkingPrefillPayloadWrapper as c, createGoogleThinkingPayloadWrapper as d, createGoogleThinkingStreamWrapper as f, createThinkingOnlyFinalTextWrapper as g, createPlainTextToolCallCompatWrapper as h, ProviderStreamWrapperFactory as i, isGoogleGemini25ThinkingBudgetModel as j, GoogleThinkingInputLevel as k, createDeepSeekV4OpenAICompatibleThinkingWrapper as l, createPayloadPatchStreamWrapper as m, DeepSeekV4ThinkingLevel as n, applyAnthropicRefusal as o, createOpenAICompatibleCompletionsThinkingOffWrapper as p, OpenAICompatibleThinkingLevel as r, composeProviderStreamWrappers as s, DeepSeekV4ReasoningEffort as t, createDeferredEventBuffer as u, isOpenAICompatibleThinkingEnabled as v, setQwenChatTemplateThinking as w, notifyLlmRequestActivity as x, normalizeOpenAICompatibleReasoningPayload as y };