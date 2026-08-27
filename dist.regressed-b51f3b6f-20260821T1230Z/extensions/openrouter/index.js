import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.js";
import { a as asOptionalRecord } from "../../record-coerce-DItp3I4t.js";
import "../../defaults-CdX9UGcX.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import "../../text-utility-runtime-LRU688AB.js";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-BLo15JHd.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-DcdDPgFR.js";
import { l as getOpenRouterModelCapabilities, u as loadOpenRouterModelCapabilities } from "../../provider-stream-DzD2a_90.js";
import "../../provider-stream-family-CrSlDQtw.js";
import { a as normalizeOpenRouterBaseUrl, i as isOpenRouterProxyReasoningUnsupportedModel, n as buildOpenrouterLiveProvider, o as resolveOpenRouterApiBaseUrl, r as buildOpenrouterProvider } from "../../provider-catalog-B39U_in7.js";
import { t as buildOpenRouterImageGenerationProvider } from "../../image-generation-provider-M6Y3PTsX.js";
import { t as openrouterMediaUnderstandingProvider } from "../../media-understanding-provider-CxdopUg8.js";
import { i as normalizeOpenRouterModelFamilyId, n as isOpenRouterMistralModelId, r as normalizeOpenRouterApiModelId } from "../../models-Ke2xsbXO.js";
import { t as buildOpenRouterMusicGenerationProvider } from "../../music-generation-provider-DHd6P86v.js";
import { n as applyOpenrouterConfig, t as OPENROUTER_DEFAULT_MODEL_REF } from "../../onboard-B7dUq4Er.js";
import { t as createOpenRouterOAuthAuthMethod } from "../../oauth-Dh-3sB2c.js";
import { t as resolveOpenRouterExtraParamsForTransport } from "../../provider-routing-BKidv0ix.js";
import { t as buildOpenRouterSpeechProvider } from "../../speech-provider-BmchorcE.js";
import { t as wrapOpenRouterProviderStream } from "../../stream-wi7BJkZm.js";
import { t as resolveOpenRouterThinkingProfile } from "../../thinking-policy-NaXtzZIe.js";
import { t as fetchOpenRouterUsage } from "../../usage-CbcjeB8R.js";
import { t as listOpenRouterVideoModelCatalog } from "../../video-model-catalog-B5XfA9Ch.js";
import { t as buildOpenRouterVideoGenerationProvider } from "../../video-generation-provider-0tqqvv6i.js";
//#region extensions/openrouter/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "openrouter",
	icon: "https://cdn.simpleicons.org/openrouter",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["openrouter"],
	modelCatalog: { "discovery": { "openrouter": "runtime" } },
	modelIdNormalization: { "providers": { "openrouter": { "prefixWhenBare": "openrouter" } } },
	modelPricing: { "providers": { "openrouter": {
		"openRouter": { "passthroughProviderModel": true },
		"liteLLM": false
	} } },
	providerEndpoints: [{
		"endpointClass": "openrouter",
		"hostSuffixes": ["openrouter.ai"]
	}],
	providerRequest: { "providers": { "openrouter": { "family": "openrouter" } } },
	setup: { "providers": [{
		"id": "openrouter",
		"envVars": ["OPENROUTER_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "openrouter",
		"method": "api-key",
		"choiceId": "openrouter-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "OpenRouter API key",
		"groupId": "openrouter",
		"groupLabel": "OpenRouter",
		"groupHint": "OAuth or API key",
		"onboardingScopes": ["text-inference", "music-generation"],
		"optionKey": "openrouterApiKey",
		"cliFlag": "--openrouter-api-key",
		"cliOption": "--openrouter-api-key <key>",
		"cliDescription": "OpenRouter API key"
	}, {
		"provider": "openrouter",
		"method": "oauth",
		"choiceId": "openrouter-oauth",
		"appGuidedAuth": "oauth",
		"choiceLabel": "OpenRouter OAuth",
		"choiceHint": "Browser sign-in",
		"groupId": "openrouter",
		"groupLabel": "OpenRouter",
		"groupHint": "OAuth or API key",
		"onboardingScopes": ["text-inference", "music-generation"],
		"onboardingFeatured": true
	}],
	contracts: {
		"mediaUnderstandingProviders": ["openrouter"],
		"imageGenerationProviders": ["openrouter"],
		"musicGenerationProviders": ["openrouter"],
		"videoGenerationProviders": ["openrouter"],
		"speechProviders": ["openrouter"],
		"usageProviders": ["openrouter"]
	},
	mediaUnderstandingProviderMetadata: { "openrouter": {
		"capabilities": ["image", "audio"],
		"defaultModels": {
			"image": "auto",
			"audio": "openai/whisper-large-v3-turbo"
		},
		"autoPriority": { "audio": 35 }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/openrouter/index.ts
const PROVIDER_ID = "openrouter";
const OPENROUTER_DEFAULT_MAX_TOKENS = 8192;
const OPENROUTER_FUSION_MODEL_ID = "openrouter/fusion";
const OPENROUTER_CACHE_TTL_MODEL_FAMILY = /^(?:anthropic|deepseek|moonshot(?:ai)?|z-?ai)\//;
const MAX_PROMPT_MODEL_ID_DISPLAY_CHARS = 256;
function normalizeOpenRouterResolvedModel(model) {
	const normalizedBaseUrl = normalizeOpenRouterBaseUrl(model.baseUrl);
	const normalizedId = normalizeOpenRouterApiModelId(model.id);
	const reasoning = isOpenRouterProxyReasoningUnsupportedModel(model.id) ? false : model.reasoning;
	if ((!normalizedBaseUrl || normalizedBaseUrl === model.baseUrl) && (!normalizedId || normalizedId === model.id) && reasoning === model.reasoning) return;
	return {
		...model,
		...normalizedId ? { id: normalizedId } : {},
		...normalizedBaseUrl ? { baseUrl: normalizedBaseUrl } : {},
		reasoning
	};
}
function sanitizePromptModelId(value) {
	if (typeof value !== "string") return;
	return truncateUtf16Safe(Array.from(value).filter((char) => {
		const codePoint = char.codePointAt(0) ?? 0;
		return codePoint > 31 && (codePoint < 127 || codePoint > 159) && codePoint !== 8232 && codePoint !== 8233;
	}).join("").trim(), MAX_PROMPT_MODEL_ID_DISPLAY_CHARS) || void 0;
}
function openRouterModelConfigKey(modelId) {
	const providerPrefix = `${PROVIDER_ID}/`;
	return modelId.trim().toLowerCase().startsWith(providerPrefix) ? modelId : `${PROVIDER_ID}/${modelId}`;
}
function findConfiguredOpenRouterModelParams(ctx) {
	const configuredModels = ctx.config?.agents?.defaults?.models;
	if (!configuredModels) return;
	const normalizedModelId = normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId;
	const directKeys = [
		openRouterModelConfigKey(ctx.modelId),
		openRouterModelConfigKey(normalizedModelId),
		`${PROVIDER_ID}/${ctx.modelId}`,
		`${PROVIDER_ID}/${normalizedModelId}`
	];
	for (const key of directKeys) {
		const params = asOptionalRecord(configuredModels[key]?.params);
		if (params) return params;
	}
	for (const [rawKey, entry] of Object.entries(configuredModels)) {
		const slashIndex = rawKey.indexOf("/");
		if (slashIndex <= 0) continue;
		const provider = rawKey.slice(0, slashIndex).trim().toLowerCase();
		const modelId = rawKey.slice(slashIndex + 1);
		const candidateModelId = normalizeOpenRouterApiModelId(modelId) ?? modelId;
		if (provider === PROVIDER_ID && candidateModelId.trim().toLowerCase() === normalizedModelId.trim().toLowerCase()) return asOptionalRecord(entry.params);
	}
}
function findConfiguredOpenRouterAgentParams(ctx) {
	if (!ctx.agentId) return;
	return asOptionalRecord(ctx.config?.agents?.list?.find((agent) => agent.id === ctx.agentId)?.params);
}
function resolveMergedOpenRouterPromptParams(ctx) {
	const merged = {
		...asOptionalRecord(ctx.config?.agents?.defaults?.params),
		...findConfiguredOpenRouterModelParams(ctx),
		...findConfiguredOpenRouterAgentParams(ctx)
	};
	return Object.keys(merged).length > 0 ? merged : void 0;
}
function resolveFusionExtraBody(ctx) {
	const params = resolveMergedOpenRouterPromptParams(ctx);
	return asOptionalRecord(params && Object.hasOwn(params, "extra_body") ? params.extra_body : params?.extraBody);
}
function resolveOpenRouterFusionPromptContribution(ctx) {
	if ((normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId) !== OPENROUTER_FUSION_MODEL_ID) return;
	const extraBody = resolveFusionExtraBody(ctx);
	const fusionPlugin = Array.isArray(extraBody?.plugins) ? extraBody.plugins.map(asOptionalRecord).find((plugin) => plugin?.id === "fusion") : void 0;
	if (!fusionPlugin) return;
	if (fusionPlugin.enabled === false) return;
	const analysisModels = Array.isArray(fusionPlugin.analysis_models) ? fusionPlugin.analysis_models.map(sanitizePromptModelId).filter((model) => Boolean(model)) : [];
	const finalModel = sanitizePromptModelId(fusionPlugin.model);
	const lines = [
		"## OpenRouter Fusion Configuration",
		"The active OpenRouter Fusion request is configured with these non-secret Fusion plugin fields.",
		analysisModels.length > 0 ? `Analysis models: ${analysisModels.join(", ")}.` : void 0,
		finalModel ? `Final Fusion model: ${finalModel}.` : void 0
	].filter((line) => Boolean(line));
	return lines.length > 2 ? { dynamicSuffix: lines.join("\n") } : void 0;
}
var openrouter_default = defineSingleProviderPluginEntry({
	id: "openrouter",
	name: "OpenRouter Provider",
	description: "Bundled OpenRouter provider plugin",
	manifest: openclaw_plugin_default,
	provider() {
		function buildDynamicOpenRouterModel(ctx) {
			const capabilities = getOpenRouterModelCapabilities(normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId);
			return {
				id: ctx.modelId,
				name: capabilities?.name ?? ctx.modelId,
				api: "openai-completions",
				provider: PROVIDER_ID,
				baseUrl: resolveOpenRouterApiBaseUrl(ctx.providerConfig?.baseUrl ?? ctx.config?.models?.providers?.openrouter?.baseUrl),
				reasoning: (capabilities?.reasoning ?? false) && !isOpenRouterProxyReasoningUnsupportedModel(ctx.modelId),
				input: capabilities?.input ?? ["text"],
				...capabilities?.supportsTools !== void 0 ? { compat: { supportsTools: capabilities.supportsTools } } : {},
				cost: capabilities?.cost ?? {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0
				},
				contextWindow: capabilities?.contextWindow ?? 2e5,
				maxTokens: capabilities?.maxTokens ?? OPENROUTER_DEFAULT_MAX_TOKENS
			};
		}
		const passthroughGeminiReplayHooks = buildProviderReplayFamilyHooks({ family: "passthrough-gemini" });
		const passthroughReplayHook = passthroughGeminiReplayHooks.buildReplayPolicy;
		function buildOpenRouterReplayPolicy(ctx) {
			const base = passthroughReplayHook?.(ctx) ?? {};
			if (isOpenRouterMistralModelId(ctx.modelId)) return {
				...base,
				sanitizeToolCallIds: true,
				toolCallIdMode: "strict9"
			};
			return base;
		}
		return {
			label: "OpenRouter",
			docsPath: "/providers/models",
			manifestAuth: {
				hint: "API key",
				defaultModel: OPENROUTER_DEFAULT_MODEL_REF,
				applyConfig: applyOpenrouterConfig
			},
			extraAuth: [createOpenRouterOAuthAuthMethod()],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const auth = ctx.resolveProviderApiKey(PROVIDER_ID);
					const apiKey = auth.apiKey;
					if (!apiKey) return null;
					const providerConfig = ctx.config.models?.providers?.openrouter;
					return { provider: await buildOpenrouterLiveProvider({
						apiKey,
						discoveryApiKey: auth.discoveryApiKey,
						baseUrl: providerConfig?.baseUrl,
						request: providerConfig?.request
					}) };
				},
				staticRun: async () => ({ provider: buildOpenrouterProvider() })
			},
			resolveDynamicModel: (ctx) => buildDynamicOpenRouterModel(ctx),
			prepareDynamicModel: async (ctx) => {
				await loadOpenRouterModelCapabilities(normalizeOpenRouterApiModelId(ctx.modelId) ?? ctx.modelId);
			},
			normalizeConfig: ({ providerConfig }) => {
				const normalizedBaseUrl = normalizeOpenRouterBaseUrl(providerConfig.baseUrl);
				return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
					...providerConfig,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			normalizeResolvedModel: ({ model }) => normalizeOpenRouterResolvedModel(model),
			normalizeTransport: ({ api: apiLocal, baseUrl }) => {
				const normalizedBaseUrl = normalizeOpenRouterBaseUrl(baseUrl);
				return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
					api: apiLocal,
					baseUrl: normalizedBaseUrl
				} : void 0;
			},
			classifyFailoverReason: ({ provider, errorMessage }) => {
				if (provider?.trim().toLowerCase() !== PROVIDER_ID) return;
				if (/\b(?:api\s+key\s+budget|key)\s+limit\s*(?:exceeded|reached|hit)\b/i.test(errorMessage)) return "billing";
				return /provider returned error/i.test(errorMessage) ? "timeout" : void 0;
			},
			...passthroughGeminiReplayHooks,
			buildReplayPolicy: buildOpenRouterReplayPolicy,
			resolveReasoningOutputMode: () => "native",
			resolveThinkingProfile: ({ modelId }) => resolveOpenRouterThinkingProfile(modelId),
			isModernModelRef: () => true,
			resolveSystemPromptContribution: resolveOpenRouterFusionPromptContribution,
			extraParamsForTransport: resolveOpenRouterExtraParamsForTransport,
			wrapStreamFn: wrapOpenRouterProviderStream,
			isCacheTtlEligible: ({ modelId }) => OPENROUTER_CACHE_TTL_MODEL_FAMILY.test(normalizeOpenRouterModelFamilyId(modelId) ?? ""),
			resolveUsageAuth: async (ctx) => {
				const apiKey = ctx.resolveApiKeyFromConfigAndStore({ envDirect: [ctx.env.OPENROUTER_API_KEY] });
				return apiKey ? { token: apiKey } : null;
			},
			fetchUsageSnapshot: async (ctx) => await fetchOpenRouterUsage({
				token: ctx.token,
				baseUrl: ctx.config.models?.providers?.openrouter?.baseUrl,
				request: ctx.config.models?.providers?.openrouter?.request,
				timeoutMs: ctx.timeoutMs,
				fetchFn: ctx.fetchFn
			})
		};
	},
	register(api) {
		api.registerMediaUnderstandingProvider(openrouterMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildOpenRouterImageGenerationProvider());
		api.registerMusicGenerationProvider(buildOpenRouterMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildOpenRouterVideoGenerationProvider());
		api.registerModelCatalogProvider({
			provider: PROVIDER_ID,
			kinds: ["video_generation"],
			liveCatalog: listOpenRouterVideoModelCatalog
		});
		api.registerSpeechProvider(buildOpenRouterSpeechProvider());
	}
});
//#endregion
export { openrouter_default as default };
