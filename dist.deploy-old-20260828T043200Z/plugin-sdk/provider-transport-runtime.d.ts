import { c as Context, d as Model, n as Api } from "../types-DTWCh4Mv.js";
import "../types-Cc0P-Eyx.js";
import "../ssrf-CFXqHr3d.js";
import { describeToolResultMediaPlaceholder, describeUnsupportedToolResultMedia, extractToolResultText, formatToolResultText, isImageWithMediaPayload, sortPromptCacheToolsByName, stripSystemPromptCacheBoundary } from "@openclaw/ai/internal/shared";
import { MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, OpenAICompletionsOptions, OpenAIModeModel, ProviderAcceptance, WritableTransportStream, coerceTransportToolCallArguments, copyProviderAcceptanceObserver, createEmptyTransportUsage, createWritableTransportEventStream, failTransportStream, finalizeTerminalToolCallArguments, finalizeTransportStream, mergeTransportHeaders, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseTerminalToolCallArguments, sanitizeTransportPayloadText, withProviderAcceptanceObserver } from "@openclaw/ai/transports";
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
export { MALFORMED_STREAMING_FRAGMENT_ERROR_MESSAGE, type ProviderAcceptance, type WritableTransportStream, buildGuardedModelFetch, buildOpenAICompletionsParams, coerceTransportToolCallArguments, copyProviderAcceptanceObserver, createEmptyTransportUsage, createWritableTransportEventStream, describeToolResultMediaPlaceholder, describeUnsupportedToolResultMedia, extractToolResultText, failTransportStream, finalizeTerminalToolCallArguments, finalizeTransportStream, formatToolResultText, isImageWithMediaPayload, mergeTransportHeaders, notifyProviderHttpMetadata, notifyProviderHttpResponse, notifyProviderStreamOpened, parseTerminalToolCallArguments, sanitizeTransportPayloadText, sortPromptCacheToolsByName, stripSystemPromptCacheBoundary, transformTransportMessages, withProviderAcceptanceObserver };