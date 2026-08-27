import { t as filterStringEntries } from "./string-normalization-e_fvmxMf.js";
import "./llm-BPdzR52r.js";
import { i as streamSimple } from "./stream-CKjrnhcO.js";
import { S as createToolStreamWrapper, d as createPlainTextToolCallCompatWrapper, r as composeProviderStreamWrappers, u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-q8qvF0X7.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./provider-catalog-BOJ83rJO.js";
import { t as isXaiProviderId } from "./provider-id-1XZshuOe.js";
//#region extensions/xai/stream.ts
const XAI_FAST_MODEL_IDS = /* @__PURE__ */ new Map([
	["grok-3", "grok-3-fast"],
	["grok-3-mini", "grok-3-mini-fast"],
	["grok-4", "grok-4-fast"],
	["grok-4-0709", "grok-4-fast"]
]);
function isXaiGrokOAuthProxyModel(model) {
	return isXaiProviderId(model.provider) && model.baseUrl?.trim().replace(/\/+$/u, "") === "https://cli-chat-proxy.grok.com/v1";
}
function createXaiGrokOAuthHeadersWrapper(baseStreamFn, clientVersion) {
	const underlying = baseStreamFn ?? streamSimple;
	const normalizedClientVersion = clientVersion?.trim();
	return (model, context, options) => {
		if (!normalizedClientVersion || !isXaiGrokOAuthProxyModel(model)) return underlying(model, context, options);
		const headers = new Headers(options?.headers);
		headers.set("X-XAI-Token-Auth", "xai-grok-cli");
		headers.set("x-grok-client-version", normalizedClientVersion);
		headers.set("x-grok-model-override", model.id);
		return underlying(model, context, {
			...options,
			headers: Object.fromEntries(headers.entries())
		});
	};
}
function resolveXaiFastModelId(modelId) {
	if (typeof modelId !== "string") return;
	return XAI_FAST_MODEL_IDS.get(modelId.trim());
}
function supportsExplicitImageInput(model) {
	return Array.isArray(model.input) && model.input.includes("image");
}
function supportsReasoningControls(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return model.reasoning === true && compat?.supportsReasoningEffort !== false;
}
const XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE = "reasoning.encrypted_content";
/** xAI-only: request encrypted reasoning for every reasoning-capable model, even when effort is unsupported. */
function ensureXaiResponsesEncryptedReasoningInclude(payloadObj, model) {
	if (!isXaiProviderId(model.provider) || model.api !== "openai-responses" || model.reasoning !== true) return;
	const existing = payloadObj.include;
	const include = filterStringEntries(existing);
	if (!include.includes(XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE)) include.push(XAI_REASONING_ENCRYPTED_CONTENT_INCLUDE);
	payloadObj.include = include;
}
const TOOL_RESULT_IMAGE_REPLAY_TEXT = "Attached image(s) from tool result:";
function isReplayableInputImagePart(part) {
	if (part.type !== "input_image") return false;
	if (typeof part.image_url === "string") return true;
	if (!part.source || typeof part.source !== "object") return false;
	const source = part.source;
	if (source.type === "url") return typeof source.url === "string";
	return source.type === "base64" && typeof source.media_type === "string" && typeof source.data === "string";
}
function describeXaiFunctionOutputMediaPlaceholder(parts) {
	let hasImage = false;
	let hasAudio = false;
	let hasOtherMedia = false;
	for (const part of parts) {
		const type = typeof part.type === "string" ? part.type : "";
		const normalizedMime = (typeof part.mimeType === "string" ? part.mimeType : typeof part.mime_type === "string" ? part.mime_type : typeof part.mediaType === "string" ? part.mediaType : typeof part.contentType === "string" ? part.contentType : "").toLowerCase();
		if (type.includes("image") || normalizedMime.startsWith("image/")) hasImage = true;
		else if (type.includes("audio") || normalizedMime.startsWith("audio/")) hasAudio = true;
		else if (type !== "input_text") hasOtherMedia = true;
	}
	if (hasImage && hasAudio || hasOtherMedia) return "(see attached media)";
	if (hasAudio) return "(see attached audio)";
	if (hasImage) return "(see attached image)";
}
function normalizeXaiResponsesFunctionCallOutput(item, includeImages) {
	if (!item || typeof item !== "object") return {
		normalizedItem: item,
		imageParts: []
	};
	const itemObj = item;
	if (itemObj.type !== "function_call_output" || !Array.isArray(itemObj.output)) return {
		normalizedItem: itemObj,
		imageParts: []
	};
	const outputParts = itemObj.output;
	const textOutput = outputParts.filter((part) => part.type === "input_text" && typeof part.text === "string").map((part) => part.text).join("");
	const imageParts = includeImages ? outputParts.filter((part) => isReplayableInputImagePart(part)) : [];
	const hadNonTextParts = outputParts.some((part) => part.type !== "input_text");
	const mediaPlaceholder = describeXaiFunctionOutputMediaPlaceholder(outputParts);
	return {
		normalizedItem: {
			...itemObj,
			output: textOutput || mediaPlaceholder || (hadNonTextParts ? "(see attached media)" : "")
		},
		imageParts
	};
}
function normalizeXaiResponsesToolResultPayload(payloadObj, model) {
	if (model.api !== "openai-responses" || !Array.isArray(payloadObj.input)) return;
	const includeImages = supportsExplicitImageInput(model);
	const normalizedInput = [];
	const collectedImageParts = [];
	for (const item of payloadObj.input) {
		const normalized = normalizeXaiResponsesFunctionCallOutput(item, includeImages);
		normalizedInput.push(normalized.normalizedItem);
		collectedImageParts.push(...normalized.imageParts);
	}
	if (collectedImageParts.length > 0) normalizedInput.push({
		type: "message",
		role: "user",
		content: [{
			type: "input_text",
			text: TOOL_RESULT_IMAGE_REPLAY_TEXT
		}, ...collectedImageParts]
	});
	payloadObj.input = normalizedInput;
}
function createXaiToolPayloadCompatibilityWrapper(baseStreamFn) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload, model }) => {
		normalizeXaiResponsesToolResultPayload(payload, model);
		if (!supportsReasoningControls(model)) {
			delete payload.reasoning;
			delete payload.reasoningEffort;
			delete payload.reasoning_effort;
		}
		ensureXaiResponsesEncryptedReasoningInclude(payload, model);
	});
}
function createXaiFastModeWrapper(baseStreamFn, fastMode) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		const supportsFastAliasTransport = model.api === "openai-completions" || model.api === "openai-responses";
		if ((typeof fastMode === "function" ? fastMode() : fastMode) !== true || !supportsFastAliasTransport || !isXaiProviderId(model.provider)) return underlying(model, context, options);
		const fastModelId = resolveXaiFastModelId(model.id);
		if (!fastModelId) return underlying(model, context, options);
		return underlying({
			...model,
			id: fastModelId
		}, context, options);
	};
}
function resolveXaiFastMode(extraParams) {
	const raw = extraParams?.fastMode ?? extraParams?.fast_mode;
	if (typeof raw === "function") {
		const resolved = raw();
		return typeof resolved === "boolean" ? resolved : void 0;
	}
	return typeof raw === "boolean" ? raw : void 0;
}
function hasXaiFastModeParam(extraParams) {
	return Boolean(extraParams && (Object.hasOwn(extraParams, "fastMode") || Object.hasOwn(extraParams, "fast_mode")));
}
function wrapXaiProviderStream(ctx, runtime) {
	const extraParams = ctx.extraParams;
	const toolStreamEnabled = extraParams?.tool_stream !== false;
	return composeProviderStreamWrappers(ctx.streamFn, (streamFn) => createXaiGrokOAuthHeadersWrapper(streamFn, runtime?.clientVersion), createXaiToolPayloadCompatibilityWrapper, hasXaiFastModeParam(extraParams) && ((streamFn) => createXaiFastModeWrapper(streamFn, () => resolveXaiFastMode(extraParams))), createPlainTextToolCallCompatWrapper, (streamFn) => createToolStreamWrapper(streamFn, toolStreamEnabled));
}
//#endregion
export { wrapXaiProviderStream as t };
