import { a as parseProviderModelRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as createMediaProviderRegistry } from "./provider-registry-1nbQs61R.js";
//#region packages/media-generation-core/src/model-ref.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
function parseGenerationModelRef(raw) {
	return raw === void 0 ? null : parseProviderModelRef(raw);
}
//#endregion
//#region src/media-generation/registry.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
const { listProviders: listImageGenerationProviders, getProvider: getImageGenerationProvider } = createMediaProviderRegistry("imageGenerationProviders");
/** Registry for music-generation providers contributed by plugin capabilities. */
const { listProviders: listMusicGenerationProviders, getProvider: getMusicGenerationProvider } = createMediaProviderRegistry("musicGenerationProviders");
/** Registry for video-generation providers contributed by plugin capabilities. */
const { listProviders: listVideoGenerationProviders, getProvider: getVideoGenerationProvider } = createMediaProviderRegistry("videoGenerationProviders");
//#endregion
export { listMusicGenerationProviders as a, listImageGenerationProviders as i, getMusicGenerationProvider as n, listVideoGenerationProviders as o, getVideoGenerationProvider as r, parseGenerationModelRef as s, getImageGenerationProvider as t };
