import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { i as normalizeProviderIdForAuth$1, r as normalizeProviderId$1, t as findNormalizedProviderKey$1 } from "./provider-id-DMd-TDFp.js";
import { a as normalizeProviderModelIdWithPolicies, c as stripSelfProviderModelPrefix, i as normalizeConfiguredProviderCatalogModelRef, n as normalizeBuiltInProviderModelId, o as normalizeStaticProviderModelIdWithPolicies, r as normalizeConfiguredProviderCatalogModelId$1, t as collectManifestModelIdNormalizationPolicies } from "./provider-model-id-normalization-DvssXFxG.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as resolvePluginMetadataSnapshotRuntime, n as getCurrentPluginMetadataSnapshotRuntime } from "./plugin-metadata-snapshot.runtime.js";
import { t as getActivePluginRegistryWorkspaceDirFromStateCore } from "./runtime-workspace-state-kLYmgwOl.js";
import { createRequire } from "node:module";
//#region src/plugins/manifest-model-id-normalization.ts
/** Applies manifest-declared model-id normalization policies to provider model refs. */
let cachedPolicies;
function resolveMetadataSnapshotForPolicies(params = {}) {
	const env = params.env ?? process.env;
	const workspaceDir = params.workspaceDir ?? getActivePluginRegistryWorkspaceDirFromStateCore();
	if (params.config === void 0) {
		const currentSnapshot = getCurrentPluginMetadataSnapshotRuntime({
			env,
			workspaceDir,
			allowWorkspaceScopedSnapshot: true,
			requireDefaultDiscoveryContext: true
		});
		if (currentSnapshot) return {
			plugins: currentSnapshot.plugins,
			configFingerprint: currentSnapshot.configFingerprint,
			cacheable: true
		};
	}
	const snapshot = resolvePluginMetadataSnapshotRuntime({
		config: params.config ?? {},
		env,
		workspaceDir,
		allowWorkspaceScopedCurrent: true
	});
	if (!snapshot) return {
		plugins: [],
		cacheable: false
	};
	return {
		plugins: snapshot.plugins,
		configFingerprint: snapshot.configFingerprint,
		cacheable: false
	};
}
function loadManifestModelIdNormalizationPolicies(params = {}) {
	if (params.plugins) return collectManifestModelIdNormalizationPolicies(params.plugins);
	const { plugins, configFingerprint, cacheable } = resolveMetadataSnapshotForPolicies(params);
	if (cacheable && configFingerprint && cachedPolicies?.configFingerprint === configFingerprint) return cachedPolicies.policies;
	const policies = collectManifestModelIdNormalizationPolicies(plugins);
	if (cacheable && configFingerprint) cachedPolicies = {
		configFingerprint,
		policies
	};
	return policies;
}
/** Normalizes a provider model id using plugin manifest-declared model-id policies. */
function normalizeProviderModelIdWithManifest(params) {
	return normalizeProviderModelIdWithPolicies({
		provider: params.provider,
		policies: loadManifestModelIdNormalizationPolicies(params),
		context: { modelId: params.context.modelId }
	});
}
//#endregion
//#region src/agents/provider-model-normalization.runtime.ts
/**
* Runtime bridge for provider-owned model id normalization hooks. Source and
* built artifacts can resolve different extensions, so this module probes both
* once and caches the result.
*/
const require = createRequire(import.meta.url);
const PROVIDER_RUNTIME_CANDIDATES = ["../plugins/provider-runtime.js", "../plugins/provider-runtime.ts"];
let providerRuntimeModule;
let providerRuntimeLoadAttempted = false;
function loadProviderRuntime() {
	if (providerRuntimeModule) return providerRuntimeModule;
	if (providerRuntimeLoadAttempted) return null;
	providerRuntimeLoadAttempted = true;
	for (const candidate of PROVIDER_RUNTIME_CANDIDATES) try {
		providerRuntimeModule = require(candidate);
		return providerRuntimeModule;
	} catch {}
	return null;
}
/** Normalizes provider model ids through plugin runtime hooks when available. */
function normalizeProviderModelIdWithRuntime(params) {
	return loadProviderRuntime()?.normalizeProviderModelIdWithPlugin(params);
}
//#endregion
//#region src/agents/model-ref-shared.ts
/**
* Shared provider/model reference normalization for static catalogs,
* allowlists, and display paths. Manifest policies are optional so tests can
* isolate built-in normalization behavior.
*/
/** Normalize a provider ID using the shared catalog rules. */
function normalizeProviderId(provider) {
	return normalizeProviderId$1(provider);
}
/** Normalize a provider ID for auth lookup. */
function normalizeProviderIdForAuth(provider) {
	return normalizeProviderIdForAuth$1(provider);
}
/** Find the original provider key matching a normalized provider ID. */
function findNormalizedProviderKey(entries, provider) {
	return findNormalizedProviderKey$1(entries, provider);
}
/** Normalize a static provider model ID with built-in and optional manifest policy. */
function normalizeStaticProviderModelId(provider, model, options = {}) {
	const normalizedProvider = normalizeProviderId(provider);
	if (options.allowManifestNormalization === false) return normalizeBuiltInProviderModelId(normalizedProvider, model);
	if (options.manifestPlugins) return normalizeStaticProviderModelIdWithPolicies(normalizedProvider, model, collectManifestModelIdNormalizationPolicies(options.manifestPlugins));
	return normalizeBuiltInProviderModelId(normalizedProvider, normalizeProviderModelIdWithManifest({
		provider: normalizedProvider,
		context: {
			provider: normalizedProvider,
			modelId: model
		}
	}) ?? model);
}
/**
* Captures manifest policies once for repeated static model-id comparisons.
* Lifecycle-prepared callers must not rediscover plugin metadata inside model loops.
*/
function createStaticProviderModelIdNormalizer(options = {}) {
	if (options.allowManifestNormalization === false) return (provider, model) => normalizeBuiltInProviderModelId(normalizeProviderId(provider), model);
	if (options.manifestPlugins) {
		const policies = collectManifestModelIdNormalizationPolicies(options.manifestPlugins);
		return (provider, model) => normalizeStaticProviderModelIdWithPolicies(normalizeProviderId(provider), model, policies);
	}
	return (provider, model) => normalizeStaticProviderModelId(provider, model, options);
}
/** Normalize a configured catalog model ID for comparisons against provider catalogs. */
function normalizeConfiguredProviderCatalogModelId(provider, model, options = {}) {
	if (options.allowManifestNormalization === false) return normalizeConfiguredProviderCatalogModelId$1(provider, model, /* @__PURE__ */ new Map());
	if (options.manifestPlugins) return normalizeConfiguredProviderCatalogModelId$1(provider, model, collectManifestModelIdNormalizationPolicies(options.manifestPlugins));
	return normalizeConfiguredProviderCatalogModelRef(normalizeStaticProviderModelId(provider, model, options));
}
function normalizeProviderModelId(provider, model, options) {
	const staticModelId = normalizeStaticProviderModelId(provider, stripSelfProviderModelPrefix(provider, model), options);
	if (options?.allowPluginNormalization === false) return staticModelId;
	return normalizeProviderModelIdWithRuntime({
		provider,
		...options?.manifestPlugins ? { plugins: options.manifestPlugins } : {},
		context: {
			provider,
			modelId: staticModelId
		}
	}) ?? staticModelId;
}
/** Normalize a provider/model pair into a canonical model reference. */
function normalizeModelRef(provider, model, options) {
	const normalizedProvider = normalizeProviderId(provider);
	return {
		provider: normalizedProvider,
		model: normalizeProviderModelId(normalizedProvider, model.trim(), options)
	};
}
/** Return the legacy raw key when it differs from the canonical key. */
function legacyModelKey(provider, model) {
	const providerId = provider.trim();
	const modelId = model.trim();
	if (!providerId || !modelId) return null;
	const rawKey = `${providerId}/${modelId}`;
	return rawKey === modelKey(providerId, modelId) ? null : rawKey;
}
function parseStaticModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slash = trimmed.indexOf("/");
	const providerRaw = slash === -1 ? defaultProvider : trimmed.slice(0, slash).trim();
	const modelRaw = slash === -1 ? trimmed : trimmed.slice(slash + 1).trim();
	if (!providerRaw || !modelRaw) return null;
	const provider = normalizeProviderId(providerRaw);
	return {
		provider,
		model: normalizeStaticProviderModelId(provider, modelRaw)
	};
}
/** Resolve an allowlist entry to a canonical provider/model key. */
function resolveStaticAllowlistModelKey(raw, defaultProvider) {
	const parsed = parseStaticModelRef(raw, defaultProvider);
	if (!parsed) return null;
	return modelKey(parsed.provider, parsed.model);
}
/** Preserve literal provider/model refs that already include a provider prefix twice. */
function formatLiteralProviderPrefixedModelRef(provider, modelRef) {
	const providerId = normalizeProviderId(provider);
	const trimmedRef = modelRef.trim();
	if (!providerId || !trimmedRef) return trimmedRef;
	const normalizedRef = normalizeLowercaseStringOrEmpty(trimmedRef);
	const literalPrefix = `${providerId}/${providerId}/`;
	if (normalizedRef.startsWith(literalPrefix)) return trimmedRef;
	return normalizedRef.startsWith(`${providerId}/`) ? `${providerId}/${trimmedRef}` : trimmedRef;
}
//#endregion
export { normalizeConfiguredProviderCatalogModelId as a, normalizeProviderIdForAuth as c, normalizeProviderModelIdWithManifest as d, legacyModelKey as i, normalizeStaticProviderModelId as l, findNormalizedProviderKey as n, normalizeModelRef as o, formatLiteralProviderPrefixedModelRef as r, normalizeProviderId as s, createStaticProviderModelIdNormalizer as t, resolveStaticAllowlistModelKey as u };
