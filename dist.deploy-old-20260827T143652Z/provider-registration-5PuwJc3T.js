import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-syVQpOuL.js";
import "./provider-auth-api-key-NHCzwYph.js";
import { n as normalizeGoogleModelId } from "./model-id-CAmKILzd.js";
import { d as isOfficialGoogleAiStudioBaseUrl, l as isGoogleVertexBaseUrl, r as resolveGoogleGenerativeAiTransport, t as normalizeGoogleProviderConfig } from "./provider-policy-DyHcvvDy.js";
import { t as GOOGLE_GEMINI_PROVIDER_HOOKS } from "./provider-hooks-mfaGEgwT.js";
import { i as resolveGoogleGeminiForwardCompatModel, r as isModernGoogleModel, t as isGoogleNativeVideoModelId } from "./provider-models-VQv-uFkm.js";
import { n as applyGoogleGeminiModelDefault, t as GOOGLE_GEMINI_DEFAULT_MODEL } from "./onboard-DxgrxVK9.js";
import { n as buildGoogleStaticCatalogProvider, r as buildGoogleVertexStaticCatalogProvider, t as buildGoogleLiveCatalogProvider } from "./provider-catalog-eUcCgP5c.js";
import { r as resolveGoogleVertexConfigApiKey } from "./vertex-adc-C5VeKcJA.js";
import { n as createGoogleGenerativeAiTransportStreamFn, r as createGoogleVertexTransportStreamFn } from "./transport-stream-Bz1UF-e2.js";
//#region extensions/google/provider-registration.ts
function normalizeGoogleVideoInput(ctx) {
	const input = ctx.model.input.filter((type) => type !== "video");
	const supportsVideo = ctx.provider === "google" && ctx.model.api === "google-generative-ai" && isOfficialGoogleAiStudioBaseUrl(ctx.model.baseUrl) && isGoogleNativeVideoModelId(ctx.modelId);
	return {
		...ctx.model,
		input: supportsVideo ? [...input, "video"] : input
	};
}
function resolveGoogleReasoningOutputMode(ctx) {
	if (ctx.provider === "google" || ctx.provider === "google-vertex") {
		const api = ctx.model?.api ?? ctx.modelApi;
		if (!api || api === "google-generative-ai" || api === "google-vertex") return "native";
	}
	return "tagged";
}
function buildGoogleProvider() {
	return {
		id: "google",
		label: "Google AI Studio",
		docsPath: "/providers/models",
		hookAliases: ["google-antigravity", "google-vertex"],
		envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
		auth: [createProviderApiKeyAuthMethod({
			providerId: "google",
			methodId: "api-key",
			label: "Google AI Studio API key",
			hint: "Supported API-key access from aistudio.google.com/apikey",
			optionKey: "geminiApiKey",
			flagName: "--gemini-api-key",
			envVar: "GEMINI_API_KEY",
			promptMessage: "Enter Google AI Studio API key",
			defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
			expectedProviders: ["google"],
			applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
			wizard: {
				choiceId: "gemini-api-key",
				choiceLabel: "Google AI Studio API key",
				groupId: "google",
				groupLabel: "Google",
				groupHint: "Supported API-key setup"
			}
		})],
		normalizeTransport: ({ provider, api, baseUrl }) => resolveGoogleGenerativeAiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeConfig: ({ provider, providerConfig }) => normalizeGoogleProviderConfig(provider, providerConfig),
		resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
		staticCatalog: {
			order: "simple",
			run: async () => ({ providers: {
				google: buildGoogleStaticCatalogProvider(),
				"google-vertex": buildGoogleVertexStaticCatalogProvider()
			} })
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const auth = ctx.resolveProviderApiKey("google");
				if (!auth.apiKey) return null;
				return { providers: {
					google: await buildGoogleLiveCatalogProvider({
						apiKey: auth.apiKey,
						discoveryApiKey: auth.discoveryApiKey
					}),
					"google-vertex": buildGoogleVertexStaticCatalogProvider()
				} };
			}
		},
		normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
		normalizeResolvedModel: normalizeGoogleVideoInput,
		resolveDynamicModel: (ctx) => resolveGoogleGeminiForwardCompatModel({
			providerId: ctx.provider,
			ctx
		}),
		createStreamFn: ({ model }) => {
			if (model.api === "google-vertex" || model.api === "google-generative-ai" && (model.provider === "google-vertex" || isGoogleVertexBaseUrl(model.baseUrl))) return createGoogleVertexTransportStreamFn();
			if (model.api === "google-generative-ai") return createGoogleGenerativeAiTransportStreamFn();
		},
		...GOOGLE_GEMINI_PROVIDER_HOOKS,
		resolveReasoningOutputMode: resolveGoogleReasoningOutputMode,
		isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId)
	};
}
function registerGoogleProvider(api) {
	api.registerProvider(buildGoogleProvider());
}
//#endregion
export { registerGoogleProvider as n, buildGoogleProvider as t };
