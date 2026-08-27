import "./loader-CwiP0Igf.js";
import { f as mapRegistryProviders, l as resolveBundledWebFetchResolutionConfig, p as resolveManifestDeclaredWebProviderCandidatePluginIds, u as sortWebFetchProviders } from "./web-search-providers.shared-Dzmx0YZs.js";
import { n as resolveBundledWebFetchProvidersFromPublicArtifacts, t as resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts } from "./web-provider-public-artifacts-B879ULAB.js";
import { n as resolveRuntimeWebProviders, t as resolvePluginWebProviders } from "./web-provider-runtime-shared-Q6-ZOnad.js";
//#region src/plugins/web-fetch-providers.runtime.ts
function resolveWebFetchCandidatePluginIds(params) {
	return resolveManifestDeclaredWebProviderCandidatePluginIds({
		contract: "webFetchProviders",
		configKey: "webFetch",
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		onlyPluginIds: params.onlyPluginIds,
		origin: params.origin,
		sandboxed: params.sandboxed
	});
}
function mapRegistryWebFetchProviders(params) {
	return mapRegistryProviders({
		entries: params.registry.webFetchProviders,
		onlyPluginIds: params.onlyPluginIds,
		sortProviders: sortWebFetchProviders
	});
}
/** Resolves web fetch providers, activating plugin runtimes when requested. */
function resolvePluginWebFetchProviders(params) {
	return resolvePluginWebProviders(params, {
		resolveBundledResolutionConfig: resolveBundledWebFetchResolutionConfig,
		resolveCandidatePluginIds: resolveWebFetchCandidatePluginIds,
		mapRegistryProviders: mapRegistryWebFetchProviders,
		resolveBundledPublicArtifactProviders: resolveBundledWebFetchProvidersFromPublicArtifacts,
		resolveBundledRuntimeArtifactProviders: resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts
	});
}
/** Resolves already-eligible runtime web fetch providers without setup-mode activation. */
function resolveRuntimeWebFetchProviders(params) {
	return resolveRuntimeWebProviders(params, {
		resolveBundledResolutionConfig: resolveBundledWebFetchResolutionConfig,
		resolveCandidatePluginIds: resolveWebFetchCandidatePluginIds,
		mapRegistryProviders: mapRegistryWebFetchProviders,
		resolveBundledRuntimeArtifactProviders: resolveBundledRuntimeWebFetchProvidersFromPublicArtifacts
	});
}
//#endregion
export { resolveRuntimeWebFetchProviders as n, resolvePluginWebFetchProviders as t };
