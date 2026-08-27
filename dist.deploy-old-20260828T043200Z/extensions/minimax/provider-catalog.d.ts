import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../provider-model-shared-JC5NvvvC.js";
import { n as OpenAICompatibleModelDiscoveryOptions } from "../../provider-catalog-live-runtime-DdgayoIT.js";
//#region extensions/minimax/provider-catalog.d.ts
declare function buildMinimaxModelDiscovery(authMode?: "api_key" | "oauth"): OpenAICompatibleModelDiscoveryOptions;
declare function resolveMinimaxCatalogBaseUrl(env?: NodeJS.ProcessEnv): string;
declare function buildMinimaxProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
declare function buildMinimaxPortalProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
//#endregion
export { buildMinimaxModelDiscovery, buildMinimaxPortalProvider, buildMinimaxProvider, resolveMinimaxCatalogBaseUrl };