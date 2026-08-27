import { g as readStringValue } from "./string-coerce-CIXf7egm.js";
import { i as redactSecrets, u as redactToolPayloadText } from "./redact-Cl7lwBnl.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { l as swapSecretSentinelsInText } from "./sentinel-DFKnr2-n.js";
import { r as resolveProviderRequestCapabilities } from "./provider-attribution-iFUXefU9.js";
import { d as normalizeMimeType, n as detectMime } from "./mime-Hm4eS2i0.js";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-KcXAb-1x.js";
import { n as resolveModelRequestTimeoutMs, t as buildGuardedModelFetch } from "./provider-transport-fetch-Ckuk8E02.js";
import { a as convertImageToJpeg, o as convertImageToPng } from "./image-ops-CuoBGLvn.js";
import { configureAiTransportHost } from "@openclaw/ai";
import { configureProviderErrorRedactor } from "@openclaw/ai/diagnostics";
//#region src/agents/openai-strict-tool-setting.ts
/**
* Strict tool-schema default resolution for native OpenAI-compatible routes.
*
* Compatible providers can support strict schemas without inheriting OpenAI's required default.
*/
function resolvesToNativeOpenAIStrictTools(model, transport) {
	const capabilities = resolveProviderRequestCapabilities({
		provider: readStringValue(model.provider),
		api: readStringValue(model.api),
		baseUrl: readStringValue(model.baseUrl),
		capability: "llm",
		transport,
		modelId: readStringValue(model.id),
		compat: model.compat
	});
	if (!capabilities.usesKnownNativeOpenAIRoute) return false;
	return capabilities.provider === "openai" || capabilities.provider === "azure-openai" || capabilities.provider === "azure-openai-responses";
}
/** Resolve the strict-tool setting for one OpenAI-compatible model/transport. */
function resolveOpenAIStrictToolSetting(model, options) {
	if (resolvesToNativeOpenAIStrictTools(model, options?.transport ?? "stream")) return true;
	if (options?.supportsStrictMode) return false;
}
//#endregion
//#region src/media/anthropic-inline-images.ts
const ANTHROPIC_SUPPORTED_IMAGE_MIMES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp"
];
const ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES = 10 * 1024 * 1024;
const ANTHROPIC_SUPPORTED_IMAGE_MIME_SET = new Set(ANTHROPIC_SUPPORTED_IMAGE_MIMES);
function isAnthropicSupportedImageMime(value) {
	return typeof value === "string" && ANTHROPIC_SUPPORTED_IMAGE_MIME_SET.has(value);
}
async function normalizeAnthropicInlineImage(block) {
	const canonicalData = canonicalizeBase64(block.data) ?? block.data.trim();
	const buffer = Buffer.from(canonicalData, "base64");
	const declaredMime = normalizeMimeType(block.mimeType);
	const detectedMime = normalizeMimeType(await detectMime({ buffer }));
	if (isAnthropicSupportedImageMime(detectedMime)) return {
		data: canonicalData,
		mimeType: detectedMime
	};
	if (!detectedMime && isAnthropicSupportedImageMime(declaredMime)) return {
		data: canonicalData,
		mimeType: declaredMime
	};
	const convertToPng = detectedMime === "image/bmp";
	const normalizedBuffer = convertToPng ? await convertImageToPng(buffer) : await convertImageToJpeg(buffer);
	if (normalizedBuffer.byteLength > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Normalized Anthropic inline image exceeds the 10 MB decoded safety limit.");
	return {
		data: normalizedBuffer.toString("base64"),
		mimeType: convertToPng ? "image/png" : "image/jpeg"
	};
}
async function normalizeAnthropicInlineContentBlocks(content) {
	for (const block of content) {
		if (block.type !== "image") continue;
		if (estimateBase64DecodedBytes(block.data) > ANTHROPIC_INLINE_IMAGE_DECODE_SAFETY_BYTES) throw new Error("Anthropic inline image exceeds the 10 MB decoded safety limit.");
	}
	const normalized = [];
	for (const block of content) {
		if (block.type !== "image") {
			normalized.push(block);
			continue;
		}
		normalized.push({
			...block,
			...await normalizeAnthropicInlineImage(block)
		});
	}
	return normalized;
}
//#endregion
//#region src/llm/ai-transport-host.ts
const transportLogBySubsystem = /* @__PURE__ */ new Map();
configureProviderErrorRedactor(redactSecrets);
function transportLog(subsystem) {
	let log = transportLogBySubsystem.get(subsystem);
	if (!log) {
		log = createSubsystemLogger(subsystem);
		transportLogBySubsystem.set(subsystem, log);
	}
	return log;
}
configureAiTransportHost({
	buildModelFetch: buildGuardedModelFetch,
	resolveSecretSentinel: (value) => {
		const swapped = swapSecretSentinelsInText(value);
		const unknown = swapped.unknown[0];
		if (unknown) throw new Error(`Secret sentinel ${unknown} is not registered in this process; refusing to construct provider client`);
		return swapped.text;
	},
	redactSecrets,
	redactToolPayloadText,
	normalizeAnthropicInlineContentBlocks,
	resolveOpenAIStrictToolSetting,
	resolveModelRequestTimeoutMs: (model) => resolveModelRequestTimeoutMs(model, void 0),
	logDebug: (subsystem, build) => {
		const log = transportLog(subsystem);
		if (!log.isEnabled("debug", "any")) return;
		const entry = build();
		if (entry) log.debug(entry.message, entry.data);
	},
	logInfo: (subsystem, message, data) => transportLog(subsystem).info(message, data),
	logWarn: (subsystem, message, data) => transportLog(subsystem).warn(message, data)
});
//#endregion
export {};
