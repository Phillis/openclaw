import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../provider-model-shared-BQajq5ha.js";
import { n as OpenAICompatibleModelDiscoveryOptions } from "../../provider-catalog-live-runtime-9299pdDF.js";
//#region extensions/minimax/provider-catalog.d.ts
declare function buildMinimaxModelDiscovery(authMode?: "api_key" | "oauth"): OpenAICompatibleModelDiscoveryOptions;
declare function resolveMinimaxCatalogBaseUrl(env?: NodeJS.ProcessEnv): string;
declare function buildMinimaxProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
declare function buildMinimaxPortalProvider(env?: NodeJS.ProcessEnv): ModelProviderDeclarationConfig;
//#endregion
export { buildMinimaxModelDiscovery, buildMinimaxPortalProvider, buildMinimaxProvider, resolveMinimaxCatalogBaseUrl };