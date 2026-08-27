import { k as UnifiedModelCatalogProviderContext } from "../../runtime-api-IAhSVA75.js";
import { T as UnifiedModelCatalogEntry } from "../../manifest-registry-BxnLUIEl.js";
import { o as VideoGenerationProviderCapabilities, r as VideoGenerationModelCapabilitiesContext } from "../../types-ByYsr5MU.js";
import "../../video-generation-s9wBFnyO.js";
//#region extensions/openrouter/video-model-catalog.d.ts
type OpenRouterVideoModelCatalogCapabilities = VideoGenerationProviderCapabilities & {
  allowedPassthroughParameters?: readonly string[];
  canonicalSlug?: string;
  created?: number;
  description?: string;
  pricingSkus?: Readonly<Record<string, string>>;
};
declare function listOpenRouterVideoModelCatalog(ctx: UnifiedModelCatalogProviderContext): Promise<Array<UnifiedModelCatalogEntry<OpenRouterVideoModelCatalogCapabilities>> | null>;
declare function resolveOpenRouterVideoModelCapabilities(ctx: VideoGenerationModelCapabilitiesContext): Promise<VideoGenerationProviderCapabilities | undefined>;
//#endregion
export { listOpenRouterVideoModelCatalog, resolveOpenRouterVideoModelCapabilities };