import { n as OpenClawConfig } from "./types.openclaw-DckSqIPo.js";
import { l as ImageGenerationProvider } from "./types-CBj3dJsd.js";
import "./types-BLU0iP9x.js";
import { l as VideoGenerationProvider } from "./types-BGSj9yXQ.js";
//#region src/media-generation/registry.d.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
declare const listImageGenerationProviders: (cfg?: OpenClawConfig) => ImageGenerationProvider[], getImageGenerationProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => ImageGenerationProvider | undefined;
/** Registry for video-generation providers contributed by plugin capabilities. */
declare const listVideoGenerationProviders: (cfg?: OpenClawConfig) => VideoGenerationProvider[], getVideoGenerationProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => VideoGenerationProvider | undefined;
//#endregion
export { listVideoGenerationProviders as i, getVideoGenerationProvider as n, listImageGenerationProviders as r, getImageGenerationProvider as t };