import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { o as resolvePluginMetadataEnvFingerprint } from "./plugin-metadata-snapshot-BI5GxVU3.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-DGIHVL5k.js";
import { i as isCurrentPluginMetadataSnapshotRuntimeGeneration, n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-AW4B7-Km.js";
import { n as planManifestModelCatalogSuppressions } from "./manifest-planner-DMsJlv-_.js";
import { c as loadManifestMetadataSnapshot, n as isManifestPluginAvailableForControlPlane } from "./manifest-contract-eligibility-DI1_0gqL.js";
import "./model-catalog-DpJeh3RG.js";
//#region src/plugins/manifest-model-suppression.ts
function listManifestModelCatalogSuppressions(params) {
	const snapshot = loadManifestMetadataSnapshot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	return planManifestModelCatalogSuppressions({ registry: {
		diagnostics: snapshot.diagnostics,
		plugins: snapshot.plugins.filter((plugin) => isManifestPluginAvailableForControlPlane({
			snapshot,
			plugin,
			config: params.config
		}))
	} }).suppressions;
}
function buildManifestSuppressionError(params) {
	const ref = `${params.provider}/${params.modelId}`;
	return params.reason ? `Unknown model: ${ref}. ${params.reason}` : `Unknown model: ${ref}.`;
}
function normalizeBaseUrlHost(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return "";
	try {
		return normalizeSuppressionHost(new URL(trimmed).hostname);
	} catch {
		return "";
	}
}
function normalizeSuppressionHost(host) {
	return normalizeLowercaseStringOrEmpty(host).replace(/\.+$/, "");
}
function resolveConfiguredProviderValue(params) {
	const providers = params.config?.models?.providers;
	if (!providers) return;
	for (const [providerId, entry] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== params.provider) continue;
		return {
			api: normalizeLowercaseStringOrEmpty(entry?.api),
			baseUrl: typeof entry?.baseUrl === "string" ? entry.baseUrl : void 0
		};
	}
}
function manifestSuppressionMatchesConditions(params) {
	const when = params.suppression.when;
	if (!when) return true;
	const configuredProvider = resolveConfiguredProviderValue({
		provider: params.provider,
		config: params.config
	});
	if (when.providerConfigApiIn?.length) {
		const allowedApis = new Set(when.providerConfigApiIn.map(normalizeLowercaseStringOrEmpty));
		const effectiveApi = configuredProvider ? normalizeLowercaseStringOrEmpty(configuredProvider.api) : params.provider;
		if (!effectiveApi || !allowedApis.has(effectiveApi)) return false;
	}
	if (when.baseUrlHosts?.length) {
		const baseUrlHost = normalizeBaseUrlHost(params.baseUrl ?? configuredProvider?.baseUrl);
		if (!baseUrlHost && !params.baseUrl && !configuredProvider?.baseUrl) return true;
		if (!baseUrlHost) return false;
		if (!new Set(when.baseUrlHosts.map(normalizeSuppressionHost)).has(baseUrlHost)) return false;
	}
	return true;
}
function buildManifestBuiltInModelSuppressionResolver(params) {
	const suppressions = listManifestModelCatalogSuppressions({
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env
	});
	return (input) => {
		const provider = normalizeLowercaseStringOrEmpty(input.provider);
		const modelId = normalizeLowercaseStringOrEmpty(input.id);
		if (!provider || !modelId) return;
		const mergeKey = buildModelCatalogMergeKey(provider, modelId);
		const suppression = suppressions.find((entry) => entry.mergeKey === mergeKey && (!input.unconditionalOnly || !entry.when) && manifestSuppressionMatchesConditions({
			suppression: entry,
			provider,
			baseUrl: input.baseUrl,
			config: params.config
		}));
		if (!suppression) return;
		return {
			suppress: true,
			errorMessage: buildManifestSuppressionError({
				provider,
				modelId,
				reason: suppression.reason
			})
		};
	};
}
//#endregion
//#region src/agents/model-suppression.ts
/**
* Built-in model suppression helpers.
* Resolves plugin manifest suppression rules with process-local caching so
* built-in catalog entries can be hidden or blocked consistently.
*/
const configlessRuntimeGeneration = {};
let runtimeGenerationResolvers = /* @__PURE__ */ new WeakMap();
let cachedStandaloneManifestSuppressionResolver;
/** Clear cached manifest suppression resolver state for tests and metadata lifecycle resets. */
function clearModelSuppressionResolverCache() {
	runtimeGenerationResolvers = /* @__PURE__ */ new WeakMap();
	cachedStandaloneManifestSuppressionResolver = void 0;
}
registerPluginMetadataProcessMemoLifecycleClear(clearModelSuppressionResolverCache);
function resolveCachedManifestSuppressionResolver(params) {
	const metadataSnapshot = getCurrentPluginMetadataSnapshot(params);
	if (metadataSnapshot && isCurrentPluginMetadataSnapshotRuntimeGeneration(metadataSnapshot)) {
		let byConfig = runtimeGenerationResolvers.get(metadataSnapshot);
		if (!byConfig) {
			byConfig = /* @__PURE__ */ new WeakMap();
			runtimeGenerationResolvers.set(metadataSnapshot, byConfig);
		}
		const configKey = params.config ?? configlessRuntimeGeneration;
		let byWorkspace = byConfig.get(configKey);
		if (!byWorkspace) {
			byWorkspace = /* @__PURE__ */ new Map();
			byConfig.set(configKey, byWorkspace);
		}
		const cached = byWorkspace.get(params.workspaceDir);
		if (cached) return cached;
		const resolver = buildManifestBuiltInModelSuppressionResolver({
			env: params.env,
			...params.config ? { config: params.config } : {},
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		});
		byWorkspace.set(params.workspaceDir, resolver);
		return resolver;
	}
	const cached = cachedStandaloneManifestSuppressionResolver;
	const controlPlaneFingerprint = resolvePluginControlPlaneFingerprint({
		...params.config ? { config: params.config } : {},
		env: params.env,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	const cwd = process.cwd();
	const envFingerprint = resolvePluginMetadataEnvFingerprint(params.env);
	if (cached !== void 0 && cached.config === params.config && cached.controlPlaneFingerprint === controlPlaneFingerprint && cached.cwd === cwd && cached.envFingerprint === envFingerprint && cached.metadataSnapshot === metadataSnapshot && cached.workspaceDir === params.workspaceDir) return cached.resolver;
	const resolver = buildManifestBuiltInModelSuppressionResolver({
		env: params.env,
		...params.config ? { config: params.config } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	cachedStandaloneManifestSuppressionResolver = {
		config: params.config,
		controlPlaneFingerprint,
		cwd,
		envFingerprint,
		metadataSnapshot,
		resolver,
		workspaceDir: params.workspaceDir
	};
	return resolver;
}
function resolveBuiltInModelSuppressionFromManifest(params) {
	const provider = normalizeProviderId(params.provider ?? "");
	const modelId = normalizeLowercaseStringOrEmpty(params.id);
	if (!provider || !modelId) return;
	return resolveCachedManifestSuppressionResolver({
		env: process.env,
		...params.config ? { config: params.config } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	})({
		provider,
		id: modelId,
		...params.baseUrl ? { baseUrl: params.baseUrl } : {},
		...params.unconditionalOnly !== void 0 ? { unconditionalOnly: params.unconditionalOnly } : {}
	});
}
/** Return true when plugin manifest metadata suppresses a built-in model entry. */
function shouldSuppressBuiltInModelCore(params) {
	return resolveBuiltInModelSuppressionFromManifest(params)?.suppress ?? false;
}
/**
* Return true only for unconditional manifest suppressions.
* Inline model entries may override conditional suppressions, but not absolute
* provider capability blocks.
*/
function shouldUnconditionallySuppress(params) {
	return resolveBuiltInModelSuppressionFromManifest({
		...params,
		unconditionalOnly: true
	})?.suppress ?? false;
}
/** Resolve the user-facing suppression error message for a built-in model. */
function buildSuppressedBuiltInModelError(params) {
	return resolveBuiltInModelSuppressionFromManifest(params)?.errorMessage;
}
/** Build a reusable suppression predicate for repeated catalog filtering. */
function buildShouldSuppressBuiltInModelCore(params) {
	const resolver = buildManifestBuiltInModelSuppressionResolver({
		env: process.env,
		...params.config ? { config: params.config } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
	return (input) => {
		const provider = normalizeProviderId(input.provider ?? "");
		const id = normalizeLowercaseStringOrEmpty(input.id);
		if (!provider || !id) return false;
		return resolver({
			provider,
			id,
			...input.baseUrl ? { baseUrl: input.baseUrl } : {}
		})?.suppress ?? false;
	};
}
//#endregion
export { shouldUnconditionallySuppress as i, buildSuppressedBuiltInModelError as n, shouldSuppressBuiltInModelCore as r, buildShouldSuppressBuiltInModelCore as t };
