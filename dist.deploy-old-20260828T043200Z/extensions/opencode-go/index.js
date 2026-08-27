import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-QR1VEK28.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BGDGVaDG.js";
import { t as opencodeGoMediaUnderstandingProvider } from "../../media-understanding-provider-BPuUkPBJ.js";
import { t as OPENCODE_GO_DEFAULT_MODEL_REF } from "../../onboard-Bp8A_rOc.js";
import { a as normalizeOpencodeGoBaseUrl, c as resolveOpencodeGoStarterModel, i as listOpencodeGoModelCatalogEntries, l as openclaw_plugin_default, n as buildStaticOpencodeGoProviderConfig, o as normalizeOpencodeGoResolvedModel, s as resolveOpencodeGoModel, t as buildOpencodeGoLiveProviderConfig } from "../../provider-catalog-mfgs4Hki.js";
import { r as resolveThinkingProfile } from "../../provider-policy-api-DgyFUSEt.js";
import { t as createOpencodeGoWrapper } from "../../stream-BSdr46bY.js";
//#region extensions/opencode-go/index.ts
const PROVIDER_ID = "opencode-go";
function resolveOpencodeGoCatalogAuth(resolveProviderApiKey) {
	const own = resolveProviderApiKey(PROVIDER_ID);
	if (own.apiKey || own.discoveryApiKey) return own;
	const shared = resolveProviderApiKey("opencode");
	return shared.apiKey || shared.discoveryApiKey ? shared : void 0;
}
var opencode_go_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Go Provider",
	description: "Official OpenCode Go provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "OpenCode Go",
		docsPath: "/providers/models",
		envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
		manifestAuth: {
			hint: "Shared API key infrastructure for Zen + Go",
			promptMessage: "Enter OpenCode API key",
			profileIds: ["opencode:default", "opencode-go:default"],
			defaultModel: OPENCODE_GO_DEFAULT_MODEL_REF,
			resolveDefaultModel: async ({ apiKey, signal }) => await resolveOpencodeGoStarterModel({
				apiKey,
				preferredModelRef: OPENCODE_GO_DEFAULT_MODEL_REF,
				...signal ? { signal } : {}
			}),
			expectedProviders: ["opencode", "opencode-go"],
			noteMessage: [
				"OpenCode Go is a separate paid subscription that uses the shared OpenCode API key.",
				"Go focuses on Kimi, GLM, and MiniMax coding models.",
				"Get your API key at: https://opencode.ai/auth"
			].join("\n"),
			noteTitle: "OpenCode"
		},
		normalizeConfig: ({ providerConfig }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: providerConfig.api,
				baseUrl: providerConfig.baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
				...providerConfig,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		normalizeResolvedModel: ({ model }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: model.api,
				baseUrl: model.baseUrl
			});
			const baseUrlNormalized = normalizedBaseUrl && normalizedBaseUrl !== model.baseUrl ? {
				...model,
				baseUrl: normalizedBaseUrl
			} : model;
			const modelNormalized = normalizeOpencodeGoResolvedModel(baseUrlNormalized);
			if (modelNormalized) return modelNormalized;
			return baseUrlNormalized !== model ? baseUrlNormalized : void 0;
		},
		normalizeTransport: ({ api: apiLocal, baseUrl }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: apiLocal,
				baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
				api: apiLocal,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		resolveDynamicModel: ({ modelId }) => resolveOpencodeGoModel(modelId),
		catalog: {
			order: "simple",
			run: async (ctx) => {
				if (ctx.providerIds !== void 0 && !ctx.providerIds.includes(PROVIDER_ID)) return null;
				const auth = resolveOpencodeGoCatalogAuth(ctx.resolveProviderApiKey);
				if (!auth) return null;
				if (!auth.discoveryApiKey) return { provider: buildStaticOpencodeGoProviderConfig(auth.apiKey) };
				return { provider: await buildOpencodeGoLiveProviderConfig({
					apiKey: auth.apiKey ?? auth.discoveryApiKey,
					discoveryApiKey: auth.discoveryApiKey
				}) };
			}
		},
		augmentModelCatalog: () => listOpencodeGoModelCatalogEntries(),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		resolveThinkingProfile,
		wrapStreamFn: (ctx) => createOpencodeGoWrapper(ctx.streamFn, ctx.thinkingLevel),
		isModernModelRef: () => true
	},
	register(api) {
		api.registerMediaUnderstandingProvider(opencodeGoMediaUnderstandingProvider);
	}
});
//#endregion
export { opencode_go_default as default };
