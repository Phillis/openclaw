import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as estimateStringChars } from "./cjk-chars-B-gnWt4x.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Dj5fUySl.js";
import { h as readResponseTextLimited } from "./provider-http-errors-BH2HGv8j.js";
import { _ as createAssistantMessageEventStream } from "./llm-C6LpWjvd.js";
import { c as isNonSecretApiKeyMarker } from "./model-auth-markers-B67UeNMn.js";
import { d as createPlainTextToolCallCompatWrapper } from "./provider-stream-shared-DK1q32kU.js";
import "./provider-auth-DKsH0m9K.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./text-utility-runtime-LRU688AB.js";
import "./provider-http-RuCpoOP3.js";
import { n as parseJsonPreservingUnsafeIntegers, t as parseJsonObjectPreservingUnsafeIntegers } from "./json-unsafe-integers-BeeNmB5X.js";
import { n as OLLAMA_CLOUD_BASE_URL, o as OLLAMA_DEFAULT_BASE_URL } from "./defaults-BNbpVpwQ.js";
import { d as isOllamaCloudModel, n as buildOllamaBaseUrlSsrFPolicy } from "./provider-models-BDGCABOW.js";
import { a as resolveOllamaConfiguredNumCtx, c as shouldInjectOllamaCompatNumCtx, d as createKimiInlineReasoningSanitizer, f as isOllamaCloudKimiModelRef, i as resolveOllamaCompatNumCtxEnabled, l as supportsNativeOllamaMax, n as isOllamaCompatProvider, o as resolveOllamaThinkParamValue, s as shouldForwardNativeOllamaThink, t as createConfiguredOllamaCompatStreamWrapper, u as wrapOllamaCompatNumCtx } from "./stream-compat-2UgG7IXK.js";
import { t as OLLAMA_INCOMPLETE_STREAM_ERROR } from "./stream-contract-CaPxW4Jp.js";
import { t as normalizeOllamaWireModelId } from "./model-id-Bcqlpg6y.js";
import { t as checkNdjsonRecordCap } from "./stream-ndjson-cap-D0o3ZPYU.js";
import { randomUUID } from "node:crypto";
//#region extensions/ollama/src/sanitizers/visible-content.ts
const noopVisibleContentSanitizer = {
	resolveStreamText(params) {
		return {
			kind: "visible",
			text: params.text
		};
	},
	sanitizeFinalText(text) {
		return text;
	}
};
function createOllamaVisibleContentSanitizer(modelId) {
	if (isOllamaCloudKimiModelRef(modelId)) return createKimiInlineReasoningSanitizer();
	return noopVisibleContentSanitizer;
}
function sanitizeOllamaFinalVisibleContent(params) {
	return createOllamaVisibleContentSanitizer(params.modelId).sanitizeFinalText(params.text);
}
//#endregion
//#region extensions/ollama/src/stream.runtime.ts
const log = createSubsystemLogger("ollama-stream");
const OLLAMA_NATIVE_BASE_URL = OLLAMA_DEFAULT_BASE_URL;
const OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS = 12;
const OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS = 64;
const OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES = 8 * 1024;
const GARBLED_VISIBLE_TEXT_MODEL_RE = /\b(?:glm|kimi)\b/i;
const GARBLED_VISIBLE_TEXT_MIN_CHARS = 80;
const GARBLED_VISIBLE_TEXT_SYMBOL_RE = /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]/gu;
const LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/gu;
function throwIfOllamaStreamAborted(signal) {
	if (signal?.aborted) throw new Error("Request was aborted");
}
function createOllamaStreamCooperativeScheduler(signal) {
	let lastYieldedAt = Date.now();
	let eventsSinceYield = 0;
	return { async afterEvent() {
		throwIfOllamaStreamAborted(signal);
		eventsSinceYield += 1;
		const now = Date.now();
		if (eventsSinceYield < OLLAMA_STREAM_COOPERATIVE_YIELD_MAX_EVENTS && now - lastYieldedAt < OLLAMA_STREAM_COOPERATIVE_YIELD_INTERVAL_MS) return;
		eventsSinceYield = 0;
		lastYieldedAt = now;
		await new Promise((resolve) => {
			setTimeout(resolve, 0);
		});
		throwIfOllamaStreamAborted(signal);
	} };
}
function countMatches(text, re) {
	re.lastIndex = 0;
	return Array.from(text.matchAll(re)).length;
}
function maxCharacterFrequency(text) {
	const counts = /* @__PURE__ */ new Map();
	let max = 0;
	for (const char of text) {
		const count = (counts.get(char) ?? 0) + 1;
		counts.set(char, count);
		max = Math.max(max, count);
	}
	return max;
}
function isKnownOllamaGarbledVisibleTextModel(modelId) {
	return GARBLED_VISIBLE_TEXT_MODEL_RE.test(modelId);
}
function isLikelyGarbledVisibleText(params) {
	if (!isKnownOllamaGarbledVisibleTextModel(params.modelId)) return false;
	const compact = params.text.replace(/\s+/g, "");
	if (compact.length < GARBLED_VISIBLE_TEXT_MIN_CHARS) return false;
	const letterOrDigitCount = countMatches(compact, LETTER_OR_DIGIT_RE);
	const symbolCount = countMatches(compact, GARBLED_VISIBLE_TEXT_SYMBOL_RE);
	const maxFrequency = maxCharacterFrequency(compact);
	const letterOrDigitRatio = letterOrDigitCount / compact.length;
	const symbolRatio = symbolCount / compact.length;
	const dominantCharacterRatio = maxFrequency / compact.length;
	return letterOrDigitRatio < .08 && symbolRatio > .6 && (dominantCharacterRatio > .22 || /[$#%&="'_~`^|\\/*+\-[\]{}()<>:;,.!?]{12,}/u.test(compact));
}
function resolveOllamaBaseUrlForRun(params) {
	const providerBaseUrl = params.providerBaseUrl?.trim();
	if (providerBaseUrl) return providerBaseUrl;
	const modelBaseUrl = params.modelBaseUrl?.trim();
	if (modelBaseUrl) return modelBaseUrl;
	return OLLAMA_NATIVE_BASE_URL;
}
const OLLAMA_OPTION_PARAM_KEYS = /* @__PURE__ */ new Set([
	"num_keep",
	"seed",
	"num_predict",
	"top_k",
	"top_p",
	"min_p",
	"typical_p",
	"repeat_last_n",
	"temperature",
	"repeat_penalty",
	"presence_penalty",
	"frequency_penalty",
	"stop",
	"num_ctx",
	"num_batch",
	"num_gpu",
	"main_gpu",
	"use_mmap",
	"num_thread"
]);
const OLLAMA_TOP_LEVEL_PARAM_KEYS = /* @__PURE__ */ new Set([
	"format",
	"keep_alive",
	"truncate",
	"shift"
]);
/**
* Resolves num_ctx for native /api/chat requests:
*  1. explicit `params.num_ctx` set on the model wins,
*  2. the effective `contextTokens` runtime cap is forwarded when present,
*  3. otherwise Ollama's model, OLLAMA_CONTEXT_LENGTH, VRAM, or Modelfile policy decides.
*
* This intentionally differs from the OpenAI-compat resolver by not falling back
* to a default context size: that fallback is a sane wrapper-side guess for
* the OpenAI-compat path, but native `/api/chat` should not force the full
* advertised `contextWindow`; only an explicit runtime cap or operator override is forwarded.
*/
function resolveOllamaNativeNumCtx(model) {
	const configured = resolveOllamaConfiguredNumCtx(model);
	if (configured !== void 0) return configured;
	const effective = model.contextTokens;
	if (typeof effective !== "number" || !Number.isFinite(effective) || effective <= 0) return;
	return Math.floor(effective);
}
function resolveOllamaModelOptions(model) {
	const options = {};
	const params = model.params;
	if (params && typeof params === "object" && !Array.isArray(params)) for (const [key, value] of Object.entries(params)) {
		if (key === "num_ctx") continue;
		if (value !== void 0 && OLLAMA_OPTION_PARAM_KEYS.has(key)) options[key] = value;
	}
	const numCtx = resolveOllamaNativeNumCtx(model);
	if (numCtx !== void 0) options.num_ctx = numCtx;
	return options;
}
function normalizeOllamaGreedySamplingOptions(options) {
	if (options.temperature !== 0) return;
	if (options.top_p === void 0 || typeof options.top_p === "number" && Number.isFinite(options.top_p) && options.top_p !== 1) options.top_p = 1;
}
function resolveOllamaTopLevelParams(model) {
	const requestParams = {};
	const params = model.params;
	if (params && typeof params === "object" && !Array.isArray(params)) {
		for (const [key, value] of Object.entries(params)) if (value !== void 0 && OLLAMA_TOP_LEVEL_PARAM_KEYS.has(key)) requestParams[key] = value;
	}
	const think = resolveOllamaThinkParamValue(params, supportsNativeOllamaMax(model));
	if (think !== void 0 && shouldForwardNativeOllamaThink(model, think)) requestParams.think = think;
	return Object.keys(requestParams).length > 0 ? requestParams : void 0;
}
function resolveStreamingTextDelta(previousText, nextText) {
	if (!nextText) return "";
	if (!previousText) return nextText;
	if (nextText.startsWith(previousText)) return nextText.slice(previousText.length);
	return nextText;
}
function buildOllamaChatRequest(params) {
	return {
		model: normalizeOllamaWireModelId(params.modelId, params.providerId),
		messages: params.messages,
		stream: params.stream ?? true,
		...params.tools && params.tools.length > 0 ? { tools: params.tools } : {},
		...params.options ? { options: params.options } : {},
		...params.requestParams
	};
}
function resolveOllamaResponseFormat(responseFormat, params) {
	if (!responseFormat || isOllamaCloudModel(params.modelId) || isOllamaCloudBaseUrl(params.baseUrl)) return;
	if (responseFormat.type === "json_object") return "json";
	if (responseFormat.type === "text") return;
	if (responseFormat.type === "json_schema" && isRecord(responseFormat.json_schema)) {
		const schema = responseFormat.json_schema.schema;
		return isRecord(schema) ? schema : void 0;
	}
	return responseFormat;
}
function isOllamaCloudBaseUrl(baseUrl) {
	try {
		return new URL(baseUrl).origin === OLLAMA_CLOUD_BASE_URL;
	} catch {
		return false;
	}
}
const CHARS_PER_TOKEN_ESTIMATE = 4;
function buildUsageWithNoCost(params) {
	const input = params.input ?? 0;
	const output = params.output ?? 0;
	return {
		input,
		output,
		cacheRead: params.cacheRead ?? 0,
		cacheWrite: params.cacheWrite ?? 0,
		cacheTelemetry: params.cacheTelemetry ?? (params.cacheRead !== void 0 && params.cacheWrite !== void 0 ? { state: "available" } : { state: "unavailable" }),
		totalTokens: params.totalTokens ?? input + output,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
function buildStreamAssistantMessage(params) {
	return {
		role: "assistant",
		content: params.content,
		stopReason: params.stopReason,
		api: params.model.api,
		provider: params.model.provider,
		model: params.model.id,
		usage: params.usage,
		timestamp: params.timestamp ?? Date.now()
	};
}
function buildStreamErrorAssistantMessage(params) {
	return {
		...buildStreamAssistantMessage({
			model: params.model,
			content: [],
			stopReason: params.stopReason,
			usage: buildUsageWithNoCost({}),
			timestamp: params.timestamp
		}),
		stopReason: params.stopReason,
		errorMessage: params.errorMessage
	};
}
function safeJsonLength(value) {
	try {
		const serialized = JSON.stringify(value);
		return typeof serialized === "string" ? estimateStringChars(serialized) : 0;
	} catch {
		return 0;
	}
}
function estimateTokensFromChars(chars) {
	if (!Number.isFinite(chars) || chars <= 0) return 0;
	return Math.max(1, Math.round(chars / CHARS_PER_TOKEN_ESTIMATE));
}
function resolveOllamaStopReason(response) {
	if (response.done_reason === "length") return "length";
	if (response.message.tool_calls?.length) return "toolUse";
	return "stop";
}
function estimateOllamaPromptTokens(params) {
	let chars = 0;
	for (const message of params.messages) {
		chars += estimateStringChars(message.content);
		chars += safeJsonLength(message.images);
		chars += safeJsonLength(message.tool_calls);
		chars += message.tool_name ? estimateStringChars(message.tool_name) : 0;
	}
	chars += safeJsonLength(params.tools);
	return estimateTokensFromChars(chars);
}
function estimateOllamaCompletionTokens(response, extraOutputChars = 0) {
	return estimateTokensFromChars(extraOutputChars + estimateStringChars(response.message.content) + (response.message.thinking ? estimateStringChars(response.message.thinking) : 0) + (response.message.reasoning ? estimateStringChars(response.message.reasoning) : 0) + safeJsonLength(response.message.tool_calls));
}
function resolveUsageCount(value, fallback) {
	if (typeof value === "number" && Number.isFinite(value) && value >= 0) return value;
	if (typeof fallback === "number" && Number.isFinite(fallback) && fallback > 0) return fallback;
	return 0;
}
function extractTextContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => part.type === "text").map((part) => part.text).join("");
}
function extractOllamaImages(content) {
	if (!Array.isArray(content)) return [];
	return content.filter((part) => part.type === "image").map((part) => part.data);
}
function ensureArgsObject(value) {
	return parseJsonObjectPreservingUnsafeIntegers(value) ?? {};
}
function normalizeOllamaToolCallArguments(value) {
	return ensureArgsObject(value);
}
function inferOllamaSchemaType(schema) {
	if (schema.properties && isRecord(schema.properties)) return "object";
	if (schema.items) return "array";
	if (Array.isArray(schema.enum) && schema.enum.length > 0) {
		const values = schema.enum.filter((value) => value !== null);
		if (values.length > 0 && values.every((value) => typeof value === "string")) return "string";
		if (values.length > 0 && values.every((value) => typeof value === "number")) return "number";
		if (values.length > 0 && values.every((value) => typeof value === "boolean")) return "boolean";
	}
	for (const unionKey of ["anyOf", "oneOf"]) {
		const variants = schema[unionKey];
		if (!Array.isArray(variants)) continue;
		for (const variant of variants) {
			if (!isRecord(variant)) continue;
			const variantType = variant.type;
			if (typeof variantType === "string" && variantType !== "null") return variantType;
			if (Array.isArray(variantType)) {
				const firstType = variantType.find((entry) => typeof entry === "string" && entry !== "null");
				if (firstType) return firstType;
			}
			const inferred = inferOllamaSchemaType(variant);
			if (inferred) return inferred;
		}
	}
}
function normalizeOllamaToolSchema(schema, isRoot = false) {
	if (!isRecord(schema)) return {
		type: "object",
		properties: {}
	};
	const normalized = {};
	for (const [key, value] of Object.entries(schema)) {
		if (key === "properties" && isRecord(value)) {
			normalized.properties = Object.fromEntries(Object.entries(value).map(([propertyName, propertySchema]) => [propertyName, normalizeOllamaToolSchema(propertySchema)]));
			continue;
		}
		if (key === "items") {
			normalized.items = Array.isArray(value) ? value.map((entry) => normalizeOllamaToolSchema(entry)) : normalizeOllamaToolSchema(value);
			continue;
		}
		if ((key === "anyOf" || key === "oneOf" || key === "allOf") && Array.isArray(value)) {
			normalized[key] = value.map((entry) => normalizeOllamaToolSchema(entry));
			continue;
		}
		normalized[key] = value;
	}
	const schemaType = normalized.type;
	if (typeof schemaType !== "string" && (!Array.isArray(schemaType) || !schemaType.some((entry) => typeof entry === "string" && entry !== "null"))) normalized.type = inferOllamaSchemaType(normalized) ?? (isRoot ? "object" : "string");
	if (normalized.type === "object" && !isRecord(normalized.properties)) normalized.properties = {};
	return normalized;
}
function readOllamaToolCallId(value) {
	return normalizeOptionalString(value);
}
function extractToolCalls(content, options = {}) {
	if (!Array.isArray(content)) return [];
	const parts = content;
	const result = [];
	for (const part of parts) if (part.type === "toolCall") {
		const id = readOllamaToolCallId(part.id);
		result.push({
			...id ? { id } : {},
			function: {
				name: normalizeOllamaToolCallName(part.name, options),
				arguments: ensureArgsObject(part.arguments)
			}
		});
	} else if (part.type === "tool_use") {
		const id = readOllamaToolCallId(part.id);
		result.push({
			...id ? { id } : {},
			function: {
				name: normalizeOllamaToolCallName(part.name, options),
				arguments: ensureArgsObject(part.input)
			}
		});
	}
	return result;
}
function buildOllamaToolNameSet(tools) {
	if (!tools || !Array.isArray(tools)) return;
	const names = /* @__PURE__ */ new Set();
	for (const tool of tools) if (typeof tool.name === "string" && tool.name.trim()) names.add(tool.name.trim());
	return names.size > 0 ? names : void 0;
}
function normalizeOllamaToolCallName(rawName, options = {}) {
	const trimmed = rawName.trim();
	if (!trimmed) return trimmed;
	const availableToolNames = options.availableToolNames;
	if (availableToolNames?.has(trimmed)) return trimmed;
	const strippedAnySeparator = trimmed.replace(/^(?:functions?|tools?)[./_-]+/iu, "").trim();
	if (availableToolNames && strippedAnySeparator !== trimmed && availableToolNames.has(strippedAnySeparator)) return strippedAnySeparator;
	if (availableToolNames) return trimmed;
	return trimmed.replace(/^(?:functions?|tools?)[./]+/iu, "").trim();
}
function convertToOllamaMessages(messages, system, options = {}) {
	const result = [];
	if (system) result.push({
		role: "system",
		content: system
	});
	for (const msg of messages) {
		if (msg.role === "user") {
			const text = extractTextContent(msg.content);
			const images = extractOllamaImages(msg.content);
			result.push({
				role: "user",
				content: text,
				...images.length > 0 ? { images } : {}
			});
			continue;
		}
		if (msg.role === "assistant") {
			const text = extractTextContent(msg.content);
			const toolCalls = extractToolCalls(msg.content, options);
			result.push({
				role: "assistant",
				content: text,
				...toolCalls.length > 0 ? { tool_calls: toolCalls } : {}
			});
			continue;
		}
		if (msg.role === "tool" || msg.role === "toolResult") {
			const text = extractTextContent(msg.content);
			const toolName = typeof msg.toolName === "string" ? msg.toolName : void 0;
			result.push({
				role: "tool",
				content: text,
				...toolName ? { tool_name: toolName } : {}
			});
		}
	}
	return result;
}
function extractOllamaTools(tools) {
	if (!tools || !Array.isArray(tools)) return [];
	const result = [];
	for (const tool of tools) {
		if (typeof tool.name !== "string" || !tool.name) continue;
		result.push({
			type: "function",
			function: {
				name: tool.name,
				description: typeof tool.description === "string" ? tool.description : "",
				parameters: normalizeOllamaToolSchema(tool.parameters, true)
			}
		});
	}
	return result;
}
function buildAssistantMessage(response, modelInfo, usageFallback, options = {}) {
	const content = [];
	const thinking = modelInfo.reasoning === false ? "" : response.message.thinking ?? response.message.reasoning ?? "";
	if (thinking) content.push({
		type: "thinking",
		thinking
	});
	const rawText = response.message.content || "";
	const text = options.sanitizeVisibleContent === false ? rawText : sanitizeOllamaFinalVisibleContent({
		modelId: modelInfo.id,
		text: rawText
	});
	if (text) content.push({
		type: "text",
		text
	});
	const toolCalls = response.message.tool_calls;
	if (toolCalls && toolCalls.length > 0) for (const toolCall of toolCalls) content.push({
		type: "toolCall",
		id: readOllamaToolCallId(toolCall.id) ?? `ollama_call_${randomUUID()}`,
		name: normalizeOllamaToolCallName(toolCall.function.name, options),
		arguments: normalizeOllamaToolCallArguments(toolCall.function.arguments)
	});
	return buildStreamAssistantMessage({
		model: modelInfo,
		content,
		stopReason: resolveOllamaStopReason(response),
		usage: buildUsageWithNoCost({
			input: resolveUsageCount(response.prompt_eval_count, usageFallback?.input),
			output: resolveUsageCount(response.eval_count, usageFallback?.output)
		})
	});
}
async function* parseNdjsonStream(reader) {
	const decoder = new TextDecoder();
	let buffer = "";
	let pendingRecordBytes = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			pendingRecordBytes = checkNdjsonRecordCap(value, pendingRecordBytes);
			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split("\n");
			buffer = lines.pop() ?? "";
			for (const line of lines) {
				const trimmed = line.trim();
				if (!trimmed) continue;
				try {
					yield parseJsonPreservingUnsafeIntegers(trimmed);
				} catch {
					log.warn(`Skipping malformed NDJSON line: ${truncateUtf16Safe(trimmed, 120)}`);
				}
			}
		}
		if (buffer.trim()) try {
			yield parseJsonPreservingUnsafeIntegers(buffer.trim());
		} catch {
			log.warn(`Skipping malformed trailing data: ${truncateUtf16Safe(buffer.trim(), 120)}`);
		}
	} finally {
		reader.cancel().catch(() => void 0);
		reader.releaseLock();
	}
}
function resolveOllamaChatUrl(baseUrl) {
	return `${baseUrl.trim().replace(/\/+$/, "").replace(/\/v1$/i, "") || OLLAMA_NATIVE_BASE_URL}/api/chat`;
}
function resolveOllamaModelHeaders(model) {
	if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
	return model.headers;
}
function resolveOllamaRequestTimeoutMs(model, options) {
	const raw = options?.requestTimeoutMs ?? options?.timeoutMs ?? model.requestTimeoutMs;
	return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : void 0;
}
function createRawOllamaStreamFn(baseUrl, defaultHeaders) {
	const chatUrl = resolveOllamaChatUrl(baseUrl);
	const ssrfPolicy = buildOllamaBaseUrlSsrFPolicy(chatUrl);
	return (model, context, options) => {
		const stream = createAssistantMessageEventStream();
		const run = async () => {
			try {
				const availableToolNames = buildOllamaToolNameSet(context.tools);
				const toolCallNameOptions = availableToolNames ? { availableToolNames } : {};
				const ollamaMessages = convertToOllamaMessages(context.messages ?? [], context.systemPrompt, toolCallNameOptions);
				const ollamaTools = extractOllamaTools(context.tools);
				const ollamaOptions = resolveOllamaModelOptions(model);
				if (typeof options?.temperature === "number") ollamaOptions.temperature = options.temperature;
				if (typeof options?.maxTokens === "number") ollamaOptions.num_predict = options.maxTokens;
				if (options?.stop && options.stop.length > 0) ollamaOptions.stop = options.stop;
				normalizeOllamaGreedySamplingOptions(ollamaOptions);
				const responseFormat = ollamaTools.length > 0 ? void 0 : resolveOllamaResponseFormat(options?.responseFormat, {
					baseUrl,
					modelId: model.id
				});
				const requestParams = {
					...resolveOllamaTopLevelParams(model),
					...responseFormat !== void 0 ? { format: responseFormat } : {}
				};
				const body = buildOllamaChatRequest({
					modelId: model.id,
					providerId: model.provider,
					messages: ollamaMessages,
					stream: true,
					tools: ollamaTools,
					options: ollamaOptions,
					requestParams
				});
				const replacement = await options?.onPayload?.(body, model);
				const requestBody = replacement === void 0 ? body : replacement;
				const headers = {
					"Content-Type": "application/json",
					...defaultHeaders,
					...options?.headers
				};
				if (options?.apiKey && (!headers.Authorization || !isNonSecretApiKeyMarker(options.apiKey))) headers.Authorization = `Bearer ${options.apiKey}`;
				const { response, release, refreshTimeout } = await fetchWithSsrFGuard({
					url: chatUrl,
					init: {
						method: "POST",
						headers,
						body: JSON.stringify(requestBody)
					},
					policy: ssrfPolicy,
					...options?.signal ? { signal: options.signal } : {},
					timeoutMs: resolveOllamaRequestTimeoutMs(model, options),
					auditContext: "ollama-stream.chat"
				});
				try {
					if (!response.ok) {
						const errorText = await readResponseTextLimited(response, OLLAMA_STREAM_ERROR_BODY_LIMIT_BYTES).catch(() => "unknown error");
						throw new Error(`${response.status} ${errorText}`);
					}
					if (!response.body) throw new Error("Ollama API returned empty response body");
					const reader = response.body.getReader();
					let accumulatedRawContent = "";
					let accumulatedVisibleContent = "";
					let accumulatedThinking = "";
					let suppressedThinking = "";
					const accumulatedToolCalls = [];
					const streamedToolCalls = [];
					let finalResponse;
					let pendingFinalVisibleContent;
					const modelInfo = {
						api: model.api,
						provider: model.provider,
						id: model.id,
						reasoning: model.reasoning
					};
					const shouldEmitThinking = model.reasoning ?? true;
					const visibleContentSanitizer = createOllamaVisibleContentSanitizer(model.id);
					const cooperativeScheduler = createOllamaStreamCooperativeScheduler(options?.signal);
					let streamStarted = false;
					let thinkingStarted = false;
					let thinkingEnded = false;
					let textBlockStarted = false;
					let textBlockClosed = false;
					const textContentIndex = () => thinkingStarted ? 1 : 0;
					const buildCurrentContent = () => {
						const parts = [];
						if (accumulatedThinking) parts.push({
							type: "thinking",
							thinking: accumulatedThinking
						});
						if (accumulatedVisibleContent) parts.push({
							type: "text",
							text: accumulatedVisibleContent
						});
						parts.push(...streamedToolCalls);
						return parts;
					};
					const ensureStreamStarted = () => {
						if (streamStarted) return;
						streamStarted = true;
						const emptyPartial = buildStreamAssistantMessage({
							model: modelInfo,
							content: [],
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "start",
							partial: emptyPartial
						});
					};
					const closeThinkingBlock = () => {
						if (!thinkingStarted || thinkingEnded) return;
						thinkingEnded = true;
						const partial = buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "thinking_end",
							contentIndex: 0,
							content: accumulatedThinking,
							partial
						});
					};
					const closeTextBlock = () => {
						if (!textBlockStarted || textBlockClosed) return;
						textBlockClosed = true;
						const partial = buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "text_end",
							contentIndex: textContentIndex(),
							content: accumulatedVisibleContent,
							partial
						});
					};
					const flushVisibleText = (nextVisibleContent) => {
						if (nextVisibleContent === void 0) return;
						const delta = resolveStreamingTextDelta(accumulatedVisibleContent, nextVisibleContent);
						if (!delta) return;
						if (thinkingStarted && !thinkingEnded) closeThinkingBlock();
						ensureStreamStarted();
						if (!textBlockStarted) {
							textBlockStarted = true;
							const partial = buildStreamAssistantMessage({
								model: modelInfo,
								content: buildCurrentContent(),
								stopReason: "stop",
								usage: buildUsageWithNoCost({})
							});
							stream.push({
								type: "text_start",
								contentIndex: textContentIndex(),
								partial
							});
						}
						accumulatedVisibleContent = nextVisibleContent;
						stream.push({
							type: "text_delta",
							contentIndex: textContentIndex(),
							delta
						});
					};
					const resolveVisibleContent = (final) => {
						const resolution = visibleContentSanitizer.resolveStreamText({
							text: accumulatedRawContent,
							final
						});
						if (resolution.kind === "pending") return;
						return resolution.text;
					};
					for await (const chunk of parseNdjsonStream(reader)) {
						throwIfOllamaStreamAborted(options?.signal);
						refreshTimeout?.();
						const thinkingDelta = chunk.message?.thinking ?? chunk.message?.reasoning;
						if (thinkingDelta && shouldEmitThinking) {
							ensureStreamStarted();
							if (!thinkingStarted) {
								thinkingStarted = true;
								const partial = buildStreamAssistantMessage({
									model: modelInfo,
									content: buildCurrentContent(),
									stopReason: "stop",
									usage: buildUsageWithNoCost({})
								});
								stream.push({
									type: "thinking_start",
									contentIndex: 0,
									partial
								});
							}
							accumulatedThinking += thinkingDelta;
							const partial = buildStreamAssistantMessage({
								model: modelInfo,
								content: buildCurrentContent(),
								stopReason: "stop",
								usage: buildUsageWithNoCost({})
							});
							stream.push({
								type: "thinking_delta",
								contentIndex: 0,
								delta: thinkingDelta,
								partial
							});
						}
						if (thinkingDelta && !shouldEmitThinking) suppressedThinking += thinkingDelta;
						if (chunk.message?.content) {
							const rawDelta = chunk.message.content;
							accumulatedRawContent += rawDelta;
							flushVisibleText(resolveVisibleContent(false));
						}
						if (chunk.message?.tool_calls?.length) {
							flushVisibleText(resolveVisibleContent(true));
							closeThinkingBlock();
							closeTextBlock();
							for (const rawToolCall of chunk.message.tool_calls) {
								const id = readOllamaToolCallId(rawToolCall.id) ?? `ollama_call_${randomUUID()}`;
								accumulatedToolCalls.push({
									...rawToolCall,
									id
								});
							}
						}
						if (chunk.done) {
							pendingFinalVisibleContent = resolveVisibleContent(true);
							finalResponse = chunk;
							break;
						}
						await cooperativeScheduler.afterEvent();
					}
					if (!finalResponse) throw new Error(OLLAMA_INCOMPLETE_STREAM_ERROR);
					if (pendingFinalVisibleContent !== void 0 && isLikelyGarbledVisibleText({
						text: pendingFinalVisibleContent,
						modelId: model.id
					})) throw new Error(`Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`);
					flushVisibleText(pendingFinalVisibleContent);
					if (isLikelyGarbledVisibleText({
						text: accumulatedVisibleContent,
						modelId: model.id
					})) throw new Error(`Ollama returned non-linguistic garbled visible text for ${model.id}; retry or switch models`);
					finalResponse.message.content = accumulatedVisibleContent;
					if (accumulatedThinking) finalResponse.message.thinking = accumulatedThinking;
					if (finalResponse.done_reason === "length") delete finalResponse.message.tool_calls;
					else if (accumulatedToolCalls.length > 0) finalResponse.message.tool_calls = accumulatedToolCalls;
					const usageFallback = {
						input: estimateOllamaPromptTokens({
							messages: ollamaMessages,
							tools: ollamaTools
						}),
						output: estimateOllamaCompletionTokens(finalResponse, estimateStringChars(suppressedThinking))
					};
					const assistantMessage = buildAssistantMessage(finalResponse, modelInfo, usageFallback, {
						...toolCallNameOptions,
						sanitizeVisibleContent: false
					});
					closeThinkingBlock();
					closeTextBlock();
					const reason = resolveOllamaStopReason(finalResponse);
					if (reason === "toolUse") for (const completedToolCall of assistantMessage.content) {
						if (completedToolCall.type !== "toolCall") continue;
						ensureStreamStarted();
						const placeholder = {
							...completedToolCall,
							arguments: {}
						};
						streamedToolCalls.push(placeholder);
						const contentIndex = buildCurrentContent().length - 1;
						const partial = () => buildStreamAssistantMessage({
							model: modelInfo,
							content: buildCurrentContent(),
							stopReason: "stop",
							usage: buildUsageWithNoCost({})
						});
						stream.push({
							type: "toolcall_start",
							contentIndex,
							partial: partial()
						});
						streamedToolCalls[streamedToolCalls.length - 1] = completedToolCall;
						stream.push({
							type: "toolcall_delta",
							contentIndex,
							delta: JSON.stringify(completedToolCall.arguments),
							partial: partial()
						});
						stream.push({
							type: "toolcall_end",
							contentIndex,
							toolCall: completedToolCall,
							partial: partial()
						});
					}
					stream.push({
						type: "done",
						reason,
						message: assistantMessage
					});
				} finally {
					await release();
				}
			} catch (err) {
				const stopReason = options?.signal?.aborted ? "aborted" : "error";
				stream.push({
					type: "error",
					reason: stopReason,
					error: buildStreamErrorAssistantMessage({
						model,
						stopReason,
						errorMessage: formatErrorMessage(err)
					})
				});
			} finally {
				stream.end();
			}
		};
		queueMicrotask(() => void run());
		return stream;
	};
}
function createOllamaStreamFn(baseUrl, defaultHeaders) {
	return createPlainTextToolCallCompatWrapper(createRawOllamaStreamFn(baseUrl, defaultHeaders));
}
function createConfiguredOllamaStreamFn(params) {
	return createOllamaStreamFn(resolveOllamaBaseUrlForRun({
		modelBaseUrl: readStringValue(params.model.baseUrl),
		providerBaseUrl: params.providerBaseUrl
	}), resolveOllamaModelHeaders(params.model));
}
//#endregion
export { OLLAMA_NATIVE_BASE_URL, buildAssistantMessage, buildOllamaChatRequest, convertToOllamaMessages, createConfiguredOllamaCompatStreamWrapper, createConfiguredOllamaStreamFn, createOllamaStreamFn, isOllamaCompatProvider, parseNdjsonStream, resolveOllamaBaseUrlForRun, resolveOllamaCompatNumCtxEnabled, shouldInjectOllamaCompatNumCtx, wrapOllamaCompatNumCtx };
