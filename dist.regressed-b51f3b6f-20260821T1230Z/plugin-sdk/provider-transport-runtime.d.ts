import { c as Context, d as Model, n as Api } from "../types-Cm3n7XMD.js";
import { describeToolResultMediaPlaceholder, extractToolResultText, sortPromptCacheToolsByName, stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { OpenAICompletionsOptions, OpenAIModeModel, WritableTransportStream, coerceTransportToolCallArguments, createEmptyTransportUsage, createWritableTransportEventStream, failTransportStream, finalizeTransportStream, mergeTransportHeaders, sanitizeTransportPayloadText } from "@openclaw/ai/transports";

//#region src/agents/provider-transport-fetch.d.ts
declare function buildGuardedModelFetch(model: Model, timeoutMs?: number, options?: {
  sanitizeSse?: boolean;
}): typeof fetch;
//#endregion
//#region src/agents/openai-transport-stream.d.ts
declare function buildOpenAICompletionsParams(model: OpenAIModeModel, context: Context, options: OpenAICompletionsOptions | undefined): Record<string, unknown>;
//#endregion
//#region src/agents/transport-message-transform.d.ts
/** Transforms transcript messages into a provider-safe replay context. */
declare function transformTransportMessages(messages: Context["messages"], model: Model, normalizeToolCallId?: (id: string, targetModel: Model, source: {
  provider: string;
  api: Api;
  model: string;
}) => string, options?: {
  normalizeSameModelToolCallIds?: boolean;
  preserveCrossModelToolCallThoughtSignature?: boolean;
  preserveUnframedToolResults?: boolean;
}): Context["messages"];
//#endregion
export { type WritableTransportStream, buildGuardedModelFetch, buildOpenAICompletionsParams, coerceTransportToolCallArguments, createEmptyTransportUsage, createWritableTransportEventStream, describeToolResultMediaPlaceholder, extractToolResultText, failTransportStream, finalizeTransportStream, mergeTransportHeaders, sanitizeTransportPayloadText, sortPromptCacheToolsByName, stripSystemPromptCacheBoundary, transformTransportMessages };