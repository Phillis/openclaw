import { c as resolveClosestSize, o as resolveClosestAspectRatio, s as resolveClosestResolution } from "./runtime-shared-BBVmLKcE.js";
//#region packages/media-generation-core/src/normalization.ts
/** True when a normalization entry contains any user-visible normalization metadata. */
function hasMediaNormalizationEntry(entry) {
	return Boolean(entry && (entry.requested !== void 0 || entry.applied !== void 0 || entry.derivedFrom !== void 0 || (entry.supportedValues?.length ?? 0) > 0));
}
//#endregion
//#region src/media-generation/geometry-normalization.ts
/** Normalizes shared image/video geometry while retaining their capability-specific contracts. */
function resolveMediaGeometryOverrides(params) {
	const caps = params.capabilities;
	const ignoredOverrides = [];
	const normalization = {};
	let { size, aspectRatio, resolution } = params;
	if (!caps) return {
		size,
		aspectRatio,
		resolution,
		ignoredOverrides,
		normalization
	};
	if (size && (caps.sizes?.length ?? 0) > 0 && caps.supportsSize) {
		const normalizedSize = resolveClosestSize({
			requestedSize: size,
			requestedAspectRatio: params.useAspectRatioForRequestedSize ? aspectRatio : void 0,
			supportedSizes: caps.sizes
		});
		if (normalizedSize && normalizedSize !== size) normalization.size = {
			requested: size,
			applied: normalizedSize
		};
		size = normalizedSize;
	}
	if (size && !caps.supportsSize) {
		const translated = caps.supportsAspectRatio ? resolveClosestAspectRatio({
			requestedAspectRatio: aspectRatio,
			requestedSize: size,
			supportedAspectRatios: caps.aspectRatios
		}) : void 0;
		if (translated) {
			aspectRatio = translated;
			normalization.aspectRatio = {
				applied: translated,
				derivedFrom: "size"
			};
		} else ignoredOverrides.push({
			key: "size",
			value: size
		});
		size = void 0;
	}
	if (aspectRatio && (caps.aspectRatios?.length ?? 0) > 0 && caps.supportsAspectRatio) {
		const normalizedAspectRatio = resolveClosestAspectRatio({
			requestedAspectRatio: aspectRatio,
			requestedSize: size,
			supportedAspectRatios: caps.aspectRatios
		});
		if (normalizedAspectRatio && normalizedAspectRatio !== aspectRatio) normalization.aspectRatio = {
			requested: aspectRatio,
			applied: normalizedAspectRatio
		};
		else if (!normalizedAspectRatio && params.reportUnrecognizedOverrides) ignoredOverrides.push({
			key: "aspectRatio",
			value: aspectRatio
		});
		aspectRatio = normalizedAspectRatio;
	} else if (aspectRatio && !caps.supportsAspectRatio) {
		const translated = caps.supportsSize && !size ? resolveClosestSize({
			requestedSize: params.size,
			requestedAspectRatio: aspectRatio,
			supportedSizes: caps.sizes?.length === 0 ? params.fallbackSizes : caps.sizes
		}) : void 0;
		if (translated) {
			size = translated;
			normalization.size = {
				applied: translated,
				derivedFrom: "aspectRatio"
			};
		} else ignoredOverrides.push({
			key: "aspectRatio",
			value: aspectRatio
		});
		aspectRatio = void 0;
	}
	if (resolution && (caps.resolutions?.length ?? 0) > 0 && caps.supportsResolution) {
		const normalizedResolution = resolveClosestResolution({
			requestedResolution: resolution,
			supportedResolutions: caps.resolutions,
			order: params.resolutionOrder
		});
		if (normalizedResolution && normalizedResolution !== resolution) normalization.resolution = {
			requested: resolution,
			applied: normalizedResolution
		};
		else if (!normalizedResolution && params.reportUnrecognizedOverrides) ignoredOverrides.push({
			key: "resolution",
			value: resolution
		});
		resolution = normalizedResolution;
	} else if (resolution && !caps.supportsResolution) {
		ignoredOverrides.push({
			key: "resolution",
			value: resolution
		});
		resolution = void 0;
	}
	if (!normalization.size && size && params.size && params.size !== size) normalization.size = {
		requested: params.size,
		applied: size
	};
	if (!normalization.aspectRatio && aspectRatio && (!params.aspectRatio && params.size || params.aspectRatio !== aspectRatio)) normalization.aspectRatio = {
		applied: aspectRatio,
		...params.aspectRatio ? { requested: params.aspectRatio } : {},
		...!params.aspectRatio && params.size ? { derivedFrom: "size" } : {}
	};
	if (!normalization.resolution && resolution && params.resolution && params.resolution !== resolution) normalization.resolution = {
		requested: params.resolution,
		applied: resolution
	};
	return {
		size,
		aspectRatio,
		resolution,
		ignoredOverrides,
		normalization
	};
}
//#endregion
export { hasMediaNormalizationEntry as n, resolveMediaGeometryOverrides as t };
