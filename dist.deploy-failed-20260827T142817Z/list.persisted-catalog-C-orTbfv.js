import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { u as asPositiveFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as MODEL_APIS } from "./types.models-Z6EPRVI_.js";
import { i as isGeneratedPluginModelCatalog, r as filterGeneratedPluginModelCatalogProviders, s as loadPersistedPluginModelCatalogsReadOnly } from "./plugin-model-catalog-D6SwPimH.js";
//#region src/commands/models/list.persisted-catalog.ts
/** Reads persisted generated catalogs without constructing a model registry. */
const modelApis = new Set(MODEL_APIS);
const modelInputs = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document"
]);
function readModelApi(value) {
	const api = normalizeOptionalString(value);
	return api && modelApis.has(api) ? api : void 0;
}
function readModelInput(value) {
	if (!Array.isArray(value)) return;
	const input = value.filter((item) => typeof item === "string" && modelInputs.has(item));
	return input.length > 0 ? input : void 0;
}
function parseProviderModels(params) {
	if (!isRecord(params.provider) || !Array.isArray(params.provider.models)) return [];
	const providerApi = readModelApi(params.provider.api);
	const providerBaseUrl = normalizeOptionalString(params.provider.baseUrl);
	return params.provider.models.flatMap((model) => {
		if (!isRecord(model)) return [];
		const id = normalizeOptionalString(model.id);
		const api = readModelApi(model.api) ?? providerApi;
		if (!id || !api) return [];
		const baseUrl = normalizeOptionalString(model.baseUrl) ?? providerBaseUrl;
		const input = readModelInput(model.input);
		const contextWindow = asPositiveFiniteNumber(model.contextWindow);
		const contextTokens = asPositiveFiniteNumber(model.contextTokens);
		return [{
			id,
			name: normalizeOptionalString(model.name) ?? id,
			provider: normalizeProviderId(params.providerId),
			api,
			...baseUrl ? { baseUrl } : {},
			...contextWindow !== void 0 ? { contextWindow } : {},
			...contextTokens !== void 0 ? { contextTokens } : {},
			...typeof model.reasoning === "boolean" ? { reasoning: model.reasoning } : {},
			...input ? { input } : {}
		}];
	});
}
/** Loads valid provider-owned rows from the agent's generated catalog cache. */
function loadPersistedListCatalogEntries(params) {
	const entries = [];
	for (const catalog of loadPersistedPluginModelCatalogsReadOnly(params.agentDir)) {
		let parsed;
		try {
			parsed = JSON.parse(catalog.contents);
		} catch {
			continue;
		}
		if (!isRecord(parsed) || !isGeneratedPluginModelCatalog(parsed) || !isRecord(parsed.providers)) continue;
		const providers = filterGeneratedPluginModelCatalogProviders({
			catalogPluginId: catalog.pluginId,
			parsedCatalog: parsed,
			pluginMetadataSnapshot: params.metadataSnapshot,
			providers: parsed.providers
		});
		for (const [providerId, provider] of Object.entries(providers)) {
			if (!params.providerIds.has(normalizeProviderId(providerId))) continue;
			entries.push(...parseProviderModels({
				providerId,
				provider
			}));
		}
	}
	return entries;
}
//#endregion
export { loadPersistedListCatalogEntries };
