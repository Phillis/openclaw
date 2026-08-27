import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { n as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CKAJM6x9.js";
import { o as normalizeModelRef, s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import "./model-selection-DHDS-v4K.js";
import { t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-BlpSOu8N.js";
//#region src/auto-reply/reply/model-runtime-normalization.ts
/** Carries the Gateway-owned metadata snapshot through one model-selection run. */
function resolveRuntimeNormalization(cfg) {
	return {
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: getCurrentPluginMetadataSnapshot({
			config: cfg,
			allowWorkspaceScopedSnapshot: true
		})?.plugins
	};
}
function normalizeRuntimeRef(provider, model, normalization = RUNTIME_MODEL_VISIBILITY_NORMALIZATION) {
	return normalizeModelRef(provider, model, normalization);
}
function findSelectedCatalogEntry(params) {
	const selectedKey = modelKey(normalizeProviderId(params.provider), params.model);
	return params.catalog?.find((entry) => modelKey(entry.provider, entry.id) === selectedKey);
}
function mergePreparedConfiguredCatalog(params) {
	if (!params.prepared?.length) return params.configured;
	const preparedByKey = new Map(params.prepared.map((entry) => [modelKey(entry.provider, entry.id), entry]));
	return params.configured.map((entry) => {
		const prepared = preparedByKey.get(modelKey(entry.provider, entry.id));
		return prepared ? {
			...entry,
			...prepared
		} : entry;
	});
}
//#endregion
export { resolveRuntimeNormalization as i, mergePreparedConfiguredCatalog as n, normalizeRuntimeRef as r, findSelectedCatalogEntry as t };
