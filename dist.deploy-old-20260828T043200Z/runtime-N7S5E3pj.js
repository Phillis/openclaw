import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { o as resolveAgentModelTimeoutMsValue } from "./model-input-ILUprkGk.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import "./provider-env-vars-BuKwzcEZ.js";
import { a as describeFailoverError, c as isFailoverError } from "./failover-error-DVBvcQuA.js";
import { a as resolveCapabilityModelCandidates, d as throwCapabilityGenerationFailure, i as recordCapabilityCandidateFailure, l as resolveMediaProviderRequestTimeoutMs, n as buildNoCapabilityModelConfiguredMessage, t as buildMediaGenerationNormalizationMetadata, u as resolveReferenceImageCapabilityError } from "./runtime-shared-BBVmLKcE.js";
import { i as listImageGenerationProviders, s as parseGenerationModelRef, t as getImageGenerationProvider } from "./registry-CcMLsGwl.js";
import { n as hasMediaNormalizationEntry, t as resolveMediaGeometryOverrides } from "./geometry-normalization-HeviYyBt.js";
//#region src/image-generation/capabilities.ts
function resolveImageGenerationMaxInputImages(params) {
	const model = params.model?.trim();
	let prefixLimit;
	let prefixLength = -1;
	if (model) {
		for (const [prefix, limit] of Object.entries(params.provider.capabilities.edit.maxInputImagesByModelPrefix ?? {})) if (prefix.length > prefixLength && model.startsWith(prefix)) {
			prefixLimit = limit;
			prefixLength = prefix.length;
		}
	}
	return (model ? params.provider.capabilities.edit.maxInputImagesByModel?.[model] : void 0) ?? prefixLimit ?? params.provider.capabilities.edit.maxInputImages;
}
//#endregion
//#region src/image-generation/normalization.ts
/** Normalizes image generation request overrides against provider/model capabilities. */
/** Returns supported image overrides plus ignored/normalized override metadata for replies. */
function resolveImageGenerationOverrides(params) {
	const modeCaps = params.inputImages?.length ? params.provider.capabilities.edit : params.provider.capabilities.generate;
	const geometry = params.provider.capabilities.geometry;
	const sanitized = resolveMediaGeometryOverrides({
		size: params.size,
		aspectRatio: params.aspectRatio,
		resolution: params.resolution,
		capabilities: {
			...modeCaps,
			sizes: params.model ? geometry?.sizesByModel?.[params.model] ?? geometry?.sizes : geometry?.sizes,
			aspectRatios: params.model ? geometry?.aspectRatiosByModel?.[params.model] ?? geometry?.aspectRatios : geometry?.aspectRatios,
			resolutions: params.model ? geometry?.resolutionsByModel?.[params.model] ?? geometry?.resolutions : geometry?.resolutions
		},
		fallbackSizes: geometry?.sizes
	});
	const ignoredOverrides = sanitized.ignoredOverrides;
	let { quality, outputFormat, background } = params;
	if (quality && !(params.provider.capabilities.output?.qualities ?? []).includes(quality)) {
		ignoredOverrides.push({
			key: "quality",
			value: quality
		});
		quality = void 0;
	}
	if (outputFormat && !(params.provider.capabilities.output?.formats ?? []).includes(outputFormat)) {
		ignoredOverrides.push({
			key: "outputFormat",
			value: outputFormat
		});
		outputFormat = void 0;
	}
	if (background && !(params.provider.capabilities.output?.backgrounds ?? []).includes(background)) {
		ignoredOverrides.push({
			key: "background",
			value: background
		});
		background = void 0;
	}
	const { normalization } = sanitized;
	return {
		size: sanitized.size,
		aspectRatio: sanitized.aspectRatio,
		resolution: sanitized.resolution,
		quality,
		outputFormat,
		background,
		ignoredOverrides,
		normalization: hasMediaNormalizationEntry(normalization.size) || hasMediaNormalizationEntry(normalization.aspectRatio) || hasMediaNormalizationEntry(normalization.resolution) ? normalization : void 0
	};
}
//#endregion
//#region src/image-generation/runtime.ts
/** Runtime entrypoint for image generation with provider fallback and override normalization. */
const log = createSubsystemLogger("image-generation");
function buildNoImageGenerationModelConfiguredMessage(cfg, deps) {
	return buildNoCapabilityModelConfiguredMessage({
		capabilityLabel: "image-generation",
		modelConfigKey: "mediaModels.image",
		providers: (deps.listProviders ?? listImageGenerationProviders)(cfg),
		getProviderEnvVars: deps.getProviderEnvVars
	});
}
/** Lists image-generation providers visible for the current config. */
function listRuntimeImageGenerationProviders(params, deps = {}) {
	return (deps.listProviders ?? listImageGenerationProviders)(params?.config);
}
async function generateImage(params, deps = {}) {
	const getProvider = deps.getProvider ?? getImageGenerationProvider;
	const listProviders = deps.listProviders ?? listImageGenerationProviders;
	const logger = deps.log ?? log;
	const requestedTimeoutMs = params.timeoutMs ?? resolveAgentModelTimeoutMsValue(params.cfg.agents?.defaults?.mediaModels?.image);
	const candidates = resolveCapabilityModelCandidates({
		cfg: params.cfg,
		modelConfig: params.cfg.agents?.defaults?.mediaModels?.image,
		modelOverride: params.modelOverride,
		parseModelRef: parseGenerationModelRef,
		agentDir: params.agentDir,
		listProviders,
		autoProviderFallback: params.autoProviderFallback
	});
	if (candidates.length === 0) throw new Error(buildNoImageGenerationModelConfiguredMessage(params.cfg, deps));
	const attempts = [];
	let lastError;
	for (const candidate of candidates) {
		const provider = getProvider(candidate.provider, params.cfg);
		if (!provider) {
			const error = `No image-generation provider registered for ${candidate.provider}`;
			attempts.push({
				provider: candidate.provider,
				model: candidate.model,
				error
			});
			lastError = new Error(error);
			logger.warn(`image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${error}`);
			continue;
		}
		const inputImageCount = params.inputImages?.length ?? 0;
		const maxInputImages = resolveImageGenerationMaxInputImages({
			provider,
			model: candidate.model
		});
		const referenceImageError = resolveReferenceImageCapabilityError({
			candidateRef: `${candidate.provider}/${candidate.model}`,
			inputImageCount,
			edit: {
				enabled: provider.capabilities.edit.enabled,
				...maxInputImages !== void 0 ? { maxInputImages } : {}
			}
		});
		if (referenceImageError) {
			recordCapabilityCandidateFailure({
				attempts,
				provider: candidate.provider,
				model: candidate.model,
				error: referenceImageError
			});
			lastError = new Error(referenceImageError);
			logger.warn(`image-generation candidate skipped: ${referenceImageError}`);
			continue;
		}
		try {
			const timeoutMs = resolveMediaProviderRequestTimeoutMs({
				timeoutMs: requestedTimeoutMs,
				providerDefaultTimeoutMs: provider.defaultTimeoutMs
			});
			const modelResolutions = provider.capabilities.geometry?.resolutionsByModel?.[candidate.model];
			const inferredResolution = (params.inputImages?.length ? provider.capabilities.edit : provider.capabilities.generate).supportsResolution === false || modelResolutions?.length === 0 ? void 0 : params.inferredResolution;
			const sanitized = resolveImageGenerationOverrides({
				provider,
				model: candidate.model,
				size: params.size,
				aspectRatio: params.aspectRatio,
				resolution: params.resolution ?? inferredResolution,
				quality: params.quality,
				outputFormat: params.outputFormat,
				background: params.background,
				inputImages: params.inputImages
			});
			const result = await provider.generateImage({
				provider: candidate.provider,
				model: candidate.model,
				prompt: params.prompt,
				cfg: params.cfg,
				agentDir: params.agentDir,
				authStore: params.authStore,
				count: params.count,
				size: sanitized.size,
				aspectRatio: sanitized.aspectRatio,
				resolution: sanitized.resolution,
				quality: sanitized.quality,
				outputFormat: sanitized.outputFormat,
				background: sanitized.background,
				inputImages: params.inputImages,
				...timeoutMs !== void 0 ? { timeoutMs } : {},
				providerOptions: params.providerOptions,
				ssrfPolicy: params.ssrfPolicy
			});
			if (!Array.isArray(result.images) || result.images.length === 0) throw new Error("Image generation provider returned no images.");
			const emptyImageIndex = result.images.findIndex((image) => image.buffer.byteLength === 0);
			if (emptyImageIndex >= 0) throw new Error(`Image generation provider returned an empty image buffer at index ${emptyImageIndex}.`);
			return {
				images: result.images,
				provider: candidate.provider,
				model: result.model ?? candidate.model,
				attempts,
				...sanitized.resolution ? { appliedResolution: sanitized.resolution } : {},
				normalization: sanitized.normalization,
				metadata: {
					...result.metadata,
					...buildMediaGenerationNormalizationMetadata({
						normalization: sanitized.normalization,
						requestedSizeForDerivedAspectRatio: params.size
					})
				},
				ignoredOverrides: sanitized.ignoredOverrides
			};
		} catch (err) {
			lastError = err;
			const described = isFailoverError(err) ? describeFailoverError(err) : void 0;
			attempts.push({
				provider: candidate.provider,
				model: candidate.model,
				error: described?.message ?? formatErrorMessage(err),
				reason: described?.reason,
				status: described?.status,
				code: described?.code
			});
			logger.warn(`image-generation candidate failed: ${candidate.provider}/${candidate.model}: ${described?.message ?? formatErrorMessage(err)}`);
		}
	}
	return throwCapabilityGenerationFailure({
		capabilityLabel: "image generation",
		attempts,
		lastError
	});
}
//#endregion
export { listRuntimeImageGenerationProviders as n, resolveImageGenerationMaxInputImages as r, generateImage as t };
