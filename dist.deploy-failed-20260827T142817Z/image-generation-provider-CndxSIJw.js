import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { d as toImageDataUrl, t as createOpenAiCompatibleImageGenerationProvider } from "./image-generation-CoGrz0nE.js";
import { t as XAI_BASE_URL } from "./model-definitions-LKzPOBHs.js";
import { c as createXaiImageGenerationProviderMetadata, i as XAI_SUPPORTED_IMAGE_ASPECT_RATIOS, r as XAI_IMAGE_DEFAULT_TIMEOUT_MS } from "./capability-provider-metadata-DikE8kIL.js";
//#region extensions/xai/image-generation-provider.ts
function resolveImageForEdit(input) {
	if (!input) throw new Error("xAI image edit requires an input image.");
	const url = normalizeOptionalString(input.url);
	if (url) return url;
	if (!input.buffer) throw new Error("xAI image edit input is missing both URL and buffer data.");
	return toImageDataUrl({
		buffer: input.buffer,
		mimeType: input.mimeType
	});
}
function resolveXaiImageBaseUrl(req) {
	return normalizeOptionalString(req.cfg?.models?.providers?.xai?.baseUrl) ?? "https://api.x.ai/v1";
}
function buildBody(params) {
	const body = {
		model: params.model,
		prompt: params.req.prompt,
		n: Math.min(params.count, 4),
		response_format: "b64_json"
	};
	const aspect = normalizeOptionalString(params.req.aspectRatio);
	if (aspect && XAI_SUPPORTED_IMAGE_ASPECT_RATIOS.includes(aspect)) body.aspect_ratio = aspect;
	const resolution = normalizeOptionalLowercaseString(params.req.resolution);
	if (resolution) body.resolution = resolution;
	if (params.inputImages.length > 0) if (params.inputImages.length > 1) body.images = params.inputImages.map((input) => ({
		url: resolveImageForEdit(input),
		type: "image_url"
	}));
	else body.image = {
		url: resolveImageForEdit(params.inputImages[0]),
		type: "image_url"
	};
	return body;
}
function buildXaiImageGenerationProvider() {
	return createOpenAiCompatibleImageGenerationProvider({
		...createXaiImageGenerationProviderMetadata(),
		defaultBaseUrl: XAI_BASE_URL,
		resolveBaseUrl: ({ req }) => resolveXaiImageBaseUrl(req),
		resolveAllowPrivateNetwork: () => false,
		defaultTimeoutMs: XAI_IMAGE_DEFAULT_TIMEOUT_MS,
		buildGenerateRequest: ({ req, inputImages, model, count }) => ({
			kind: "json",
			body: buildBody({
				req,
				inputImages,
				model,
				count
			})
		}),
		buildEditRequest: ({ req, inputImages, model, count }) => ({
			kind: "json",
			body: buildBody({
				req,
				inputImages,
				model,
				count
			})
		}),
		missingApiKeyError: "xAI API key missing",
		failureLabels: {
			generate: "xAI image generation failed",
			edit: "xAI image edit failed"
		}
	});
}
//#endregion
export { buildXaiImageGenerationProvider as t };
