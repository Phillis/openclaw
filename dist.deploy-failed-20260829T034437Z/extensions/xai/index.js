import { r as createLazyRuntimeModule } from "../../lazy-runtime-CgCh8H_K.js";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.js";
import { p as defaultToolStreamExtraParams } from "../../provider-stream-shared-DEARVxDz.js";
import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-QR1VEK28.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-BGDGVaDG.js";
import "../../provider-web-search-CBhiF-_j.js";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.js";
import { i as normalizeXaiModelId } from "../../model-id-BJsQwvwb.js";
import { a as createLazyXaiSpeechProvider, i as createLazyXaiRealtimeVoiceProvider, n as createLazyXaiMediaUnderstandingProvider, o as createLazyXaiVideoGenerationProvider, r as createLazyXaiRealtimeTranscriptionProvider, t as createLazyXaiImageGenerationProvider } from "../../lazy-capability-providers-B5Rt1C1-.js";
import "../../model-compat-CsK61pcr.js";
import { r as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-Cx2WaKaM.js";
import { i as buildXaiProvider, n as buildLiveXaiOAuthProvider, r as buildLiveXaiProvider } from "../../provider-catalog-C-VJu49Y.js";
import { t as isXaiProviderId } from "../../provider-id-BGRwGixY.js";
import { n as normalizeXaiResolvedModel, r as resolveXaiForwardCompatModel, t as isModernXaiModel } from "../../provider-models-DKEjTujT.js";
import { t as resolveThinkingProfile } from "../../provider-policy-api-CdE0gbK3.js";
import { t as resolveXaiTransport } from "../../provider-routing-DDblrolK.js";
import { n as resolveFallbackXaiAuth, t as isXaiToolEnabled } from "../../tool-auth-shared-jlcDSq7P.js";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled } from "../../code-execution-config-B9r5Oaes.js";
import { t as resolveEffectiveXSearchConfig } from "../../x-search-config-CUtMAaQd.js";
import { t as wrapXaiProviderStream } from "../../stream-DD20NXbv.js";
import { t as createXaiWebSearchProvider } from "../../web-search-lYobDWB3.js";
import { n as buildMissingXSearchApiKeyPayload, r as createXSearchToolDefinition } from "../../x-search-tool-shared-nlZ40kdg.js";
import { n as createXaiOAuthAuthMethod, r as refreshXaiOAuthCredential, t as createXaiDeviceCodeAuthMethod } from "../../xai-oauth-entry-C77mqHiR.js";
//#region extensions/xai/index.ts
const PROVIDER_ID = "xai";
const XAI_CREDIT_OR_SPENDING_LIMIT_RE = /\b(?:used all available credits|run out of credits|monthly spending limit|purchase more credits|raise your spending limit|need a Grok subscription)\b/i;
const XAI_RATE_LIMIT_RE = /\b(?:rate limit exceeded|too many requests)\b/i;
const loadCodeExecutionModule = createLazyRuntimeModule(() => import("./code-execution.js"));
const loadXSearchModule = createLazyRuntimeModule(() => import("./x-search.js"));
function classifyXaiFailoverReason(errorMessage) {
	if (XAI_CREDIT_OR_SPENDING_LIMIT_RE.test(errorMessage)) return "billing";
	if (XAI_RATE_LIMIT_RE.test(errorMessage)) return "rate_limit";
}
function hasResolvableXaiApiKey(config, auth) {
	return isXaiToolEnabled({
		sourceConfig: config,
		auth
	});
}
function isCodeExecutionEnabled(config, auth) {
	return resolveCodeExecutionEnabled({
		sourceConfig: config,
		runtimeConfig: config,
		config: readPluginCodeExecutionConfig(config),
		auth
	});
}
function isXSearchEnabled(config, auth) {
	if ((config && typeof config === "object" ? resolveEffectiveXSearchConfig(config) : void 0)?.enabled === false) return false;
	return hasResolvableXaiApiKey(config, auth);
}
function shouldExposeXaiBilledTool(params) {
	const activeProvider = params.activeProvider?.trim();
	if (!activeProvider || params.enabled === false) return false;
	return isXaiProviderId(activeProvider) || params.enabled === true;
}
function createLazyCodeExecutionTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const codeExecutionConfig = readPluginCodeExecutionConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: codeExecutionConfig?.enabled
	})) return null;
	if (!isCodeExecutionEnabled(effectiveConfig, ctx)) return null;
	return createCodeExecutionToolDefinition(async (toolCallId, args) => {
		const { createCodeExecutionTool } = await loadCodeExecutionModule();
		const tool = createCodeExecutionTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
		return await tool.execute(toolCallId, args);
	});
}
function createLazyXSearchTool(ctx) {
	const effectiveConfig = ctx.runtimeConfig ?? ctx.config;
	const xSearchConfig = resolveEffectiveXSearchConfig(effectiveConfig);
	if (!shouldExposeXaiBilledTool({
		activeProvider: ctx.activeModel?.provider,
		enabled: xSearchConfig?.enabled
	})) return null;
	if (!isXSearchEnabled(effectiveConfig, ctx)) return null;
	return createXSearchToolDefinition(async (toolCallId, args, signal) => {
		signal?.throwIfAborted();
		const { createXSearchTool } = await loadXSearchModule();
		signal?.throwIfAborted();
		const tool = createXSearchTool({
			config: ctx.config,
			runtimeConfig: ctx.runtimeConfig ?? null,
			auth: ctx
		});
		if (!tool) return jsonResult(buildMissingXSearchApiKeyPayload());
		return await tool.execute(toolCallId, args, signal);
	});
}
var xai_default = defineSingleProviderPluginEntry({
	id: "xai",
	name: "xAI Plugin",
	description: "Bundled xAI plugin",
	provider: (pluginApi) => ({
		label: "xAI",
		aliases: ["x-ai"],
		docsPath: "/providers/xai",
		auth: [{
			methodId: "api-key",
			label: "xAI API key",
			hint: "API key",
			optionKey: "xaiApiKey",
			flagName: "--xai-api-key",
			envVar: "XAI_API_KEY",
			promptMessage: "Enter xAI API key",
			defaultModel: XAI_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyXaiConfig(cfg),
			wizard: { groupLabel: "xAI (Grok)" }
		}],
		extraAuth: [createXaiOAuthAuthMethod(), createXaiDeviceCodeAuthMethod()],
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const auth = ctx.resolveProviderAuth(PROVIDER_ID);
				try {
					const { resolveApiKeyForProvider } = await import("../../plugin-sdk/provider-auth-runtime.js");
					const runtimeAuth = await resolveApiKeyForProvider({
						provider: PROVIDER_ID,
						cfg: ctx.config,
						...ctx.agentDir ? { agentDir: ctx.agentDir } : {},
						...ctx.workspaceDir ? { workspaceDir: ctx.workspaceDir } : {},
						...auth.profileId ? {
							profileId: auth.profileId,
							lockedProfile: true
						} : {}
					});
					if (runtimeAuth?.mode === "oauth" && runtimeAuth.apiKey) return { provider: await buildLiveXaiOAuthProvider({ discoveryApiKey: runtimeAuth.apiKey }) };
				} catch {
					if (auth.mode === "oauth") {}
				}
				if (auth.apiKey) return { provider: await buildLiveXaiProvider({
					apiKey: auth.apiKey,
					discoveryApiKey: auth.discoveryApiKey
				}) };
				const apiKey = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!apiKey.apiKey) return null;
				return { provider: await buildLiveXaiProvider({
					apiKey: apiKey.apiKey,
					discoveryApiKey: apiKey.discoveryApiKey
				}) };
			},
			staticRun: async () => ({ provider: buildXaiProvider() })
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		prepareExtraParams: (ctx) => defaultToolStreamExtraParams(ctx.extraParams),
		wrapStreamFn: (ctx) => wrapXaiProviderStream(ctx, { clientVersion: pluginApi.runtime.version }),
		resolveSyntheticAuth: ({ config }) => {
			const fallbackAuth = resolveFallbackXaiAuth(config);
			if (!fallbackAuth) return;
			return {
				apiKey: fallbackAuth.apiKey,
				source: fallbackAuth.source,
				mode: "api-key"
			};
		},
		normalizeResolvedModel: ({ model }) => normalizeXaiResolvedModel(model),
		normalizeTransport: ({ provider, api, baseUrl }) => resolveXaiTransport({
			provider,
			api,
			baseUrl
		}),
		normalizeModelId: ({ modelId }) => normalizeXaiModelId(modelId),
		resolveDynamicModel: (ctx) => resolveXaiForwardCompatModel({
			providerId: PROVIDER_ID,
			ctx
		}),
		refreshOAuth: refreshXaiOAuthCredential,
		resolveThinkingProfile,
		isModernModelRef: ({ modelId }) => isModernXaiModel(modelId),
		classifyFailoverReason: ({ errorMessage }) => classifyXaiFailoverReason(errorMessage)
	}),
	register(api) {
		api.registerWebSearchProvider(createXaiWebSearchProvider());
		api.registerMediaUnderstandingProvider(createLazyXaiMediaUnderstandingProvider());
		api.registerVideoGenerationProvider(createLazyXaiVideoGenerationProvider());
		api.registerImageGenerationProvider(createLazyXaiImageGenerationProvider());
		api.registerSpeechProvider(createLazyXaiSpeechProvider());
		api.registerRealtimeTranscriptionProvider(createLazyXaiRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(createLazyXaiRealtimeVoiceProvider());
		api.registerTool((ctx) => createLazyCodeExecutionTool(ctx), { name: "code_execution" });
		api.registerTool((ctx) => createLazyXSearchTool(ctx), { name: "x_search" });
	}
});
//#endregion
export { xai_default as default };
