import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { r as loadPluginManifest } from "./manifest-BmA-DH7w.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-Q7fHcAUz.js";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/models/provider-aliases.ts
/** Provider alias canonicalization for model catalog rows. */
const sourcePeerModelCatalogCache = /* @__PURE__ */ new Map();
function listManifestPlugins(params) {
	return params.metadataSnapshot?.manifestRegistry.plugins ?? loadPluginManifestRegistryCore({ config: params.cfg }).plugins;
}
function resolveSourcePeerPluginRoot(plugin) {
	if (plugin.origin !== "bundled") return;
	const parts = path.resolve(plugin.rootDir).split(path.sep);
	const pluginDirName = parts.at(-1);
	const extensionsDirName = parts.at(-2);
	const buildDirName = parts.at(-3);
	if (pluginDirName !== plugin.id || extensionsDirName !== "extensions" || buildDirName !== "dist" && buildDirName !== "dist-runtime") return;
	const packageRoot = parts.slice(0, -3).join(path.sep) || path.sep;
	const sourceRoot = path.join(packageRoot, "extensions", plugin.id);
	return fs.existsSync(path.join(sourceRoot, "openclaw.plugin.json")) ? sourceRoot : void 0;
}
function loadSourcePeerModelCatalog(plugin) {
	const cacheKey = path.resolve(plugin.rootDir);
	const cached = sourcePeerModelCatalogCache.get(cacheKey);
	if (cached !== void 0) return cached ?? void 0;
	const sourceRoot = resolveSourcePeerPluginRoot(plugin);
	if (!sourceRoot) {
		sourcePeerModelCatalogCache.set(cacheKey, null);
		return;
	}
	const loaded = loadPluginManifest(sourceRoot, false);
	if (!loaded.ok || loaded.manifest.id !== plugin.id) {
		sourcePeerModelCatalogCache.set(cacheKey, null);
		return;
	}
	const modelCatalog = loaded.manifest.modelCatalog ?? null;
	sourcePeerModelCatalogCache.set(cacheKey, modelCatalog);
	return modelCatalog ?? void 0;
}
function hasModelCatalogAliases(modelCatalog) {
	return Object.keys(modelCatalog?.aliases ?? {}).length > 0;
}
function collectModelCatalogAliases(aliases, modelCatalog) {
	for (const [aliasProvider, target] of Object.entries(modelCatalog?.aliases ?? {})) {
		const alias = normalizeProviderId(aliasProvider);
		const provider = normalizeProviderId(target.provider);
		if (alias && provider) aliases.set(alias, provider);
	}
}
function buildProviderAliasMap(params) {
	const aliases = /* @__PURE__ */ new Map();
	for (const plugin of listManifestPlugins(params)) {
		collectModelCatalogAliases(aliases, plugin.modelCatalog);
		if (!hasModelCatalogAliases(plugin.modelCatalog) && plugin.origin === "bundled") collectModelCatalogAliases(aliases, loadSourcePeerModelCatalog(plugin));
	}
	return aliases;
}
/** Builds provider/ref canonicalizers from manifest model-catalog aliases. */
function createModelCatalogProviderAliasCanonicalizer(params) {
	const aliases = buildProviderAliasMap(params);
	const provider = (providerId) => {
		const normalizedProvider = normalizeProviderId(providerId);
		return aliases.get(normalizedProvider) ?? normalizedProvider;
	};
	return {
		provider,
		ref: (ref) => {
			const canonicalProvider = provider(ref.provider);
			return canonicalProvider === ref.provider ? ref : {
				...ref,
				provider: canonicalProvider
			};
		}
	};
}
/** Canonicalizes a provider id through manifest model-catalog aliases. */
function canonicalizeModelCatalogProviderAlias(provider, params) {
	return createModelCatalogProviderAliasCanonicalizer(params).provider(provider);
}
/** Canonicalizes the provider field on a model reference. */
function canonicalizeModelCatalogProviderRef(ref, params) {
	return createModelCatalogProviderAliasCanonicalizer(params).ref(ref);
}
//#endregion
export { canonicalizeModelCatalogProviderRef as n, createModelCatalogProviderAliasCanonicalizer as r, canonicalizeModelCatalogProviderAlias as t };
