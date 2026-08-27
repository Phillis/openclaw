import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { i as MINIMAX_OAUTH_MARKER } from "./model-auth-markers-B67UeNMn.js";
import { i as normalizeModelCompat } from "./provider-model-compat-B9WoxRFp.js";
import "./provider-auth-CZW5iaiY.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-syVQpOuL.js";
import { t as buildOauthProviderAuthResult } from "./provider-auth-result-uRjcnIw2.js";
import "./error-runtime-CmlvK1A3.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { h as fetchMinimaxUsage } from "./provider-usage-D-u9SIWQ.js";
import { a as buildProviderReplayFamilyHooks } from "./provider-model-shared-CNe85HhA.js";
import "./provider-auth-api-key-NHCzwYph.js";
import { r as buildOpenAICompatibleLiveModelProviderConfig } from "./provider-catalog-live-runtime-mNrTsbWq.js";
import { c as buildProviderStreamFamilyHooks } from "./provider-stream-CH5VOu0S.js";
import "./provider-stream-family-CCyp5EaR.js";
import { i as MINIMAX_TEXT_MODEL_ORDER, o as isMiniMaxModernModelId, r as MINIMAX_TEXT_MODEL_CATALOG, t as MINIMAX_DEFAULT_MODEL_ID } from "./provider-models-1nf0ElpY.js";
import { f as resolveMinimaxApiCost, n as DEFAULT_MINIMAX_MAX_TOKENS } from "./model-definitions-DtefnZ2q.js";
import { i as resolveMinimaxCatalogBaseUrl, n as buildMinimaxPortalProvider, r as buildMinimaxProvider, t as buildMinimaxModelDiscovery } from "./provider-catalog-DkxWG_0k.js";
import { n as applyMinimaxApiConfigCn, t as applyMinimaxApiConfig } from "./onboard-BM7IonjQ.js";
import "./api-qO9c5XdK.js";
import { t as resolveMinimaxThinkingProfile } from "./thinking-CImIZXQq.js";
//#region extensions/minimax/provider-registration.ts
const API_PROVIDER_ID = "minimax";
const PORTAL_PROVIDER_ID = "minimax-portal";
const PROVIDER_LABEL = "MiniMax";
const DEFAULT_MODEL = MINIMAX_DEFAULT_MODEL_ID;
const DEFAULT_BASE_URL_CN = "https://api.minimaxi.com/anthropic";
const DEFAULT_BASE_URL_GLOBAL = "https://api.minimax.io/anthropic";
const MINIMAX_USAGE_ENV_VAR_KEYS = [
	"MINIMAX_OAUTH_TOKEN",
	"MINIMAX_CODE_PLAN_KEY",
	"MINIMAX_CODING_API_KEY",
	"MINIMAX_API_KEY"
];
const MINIMAX_WIZARD_GROUP = {
	groupId: "minimax",
	groupLabel: "MiniMax",
	groupHint: "M3 (recommended)"
};
const MINIMAX_PROVIDER_HOOKS = {
	...buildProviderReplayFamilyHooks({
		family: "hybrid-anthropic-openai",
		anthropicModelDropThinkingBlocks: true
	}),
	...buildProviderStreamFamilyHooks("minimax-fast-mode"),
	resolveReasoningOutputMode: () => "native",
	resolveThinkingProfile: ({ modelId }) => resolveMinimaxThinkingProfile(modelId)
};
function getDefaultBaseUrl(region) {
	return region === "cn" ? DEFAULT_BASE_URL_CN : DEFAULT_BASE_URL_GLOBAL;
}
function resolveMinimaxRegionLabel(region) {
	return region === "cn" ? "CN" : "Global";
}
function resolveMinimaxEndpointHint(region) {
	return region === "cn" ? "CN endpoint - api.minimaxi.com" : "Global endpoint - api.minimax.io";
}
function apiModelRef(modelId) {
	return `${API_PROVIDER_ID}/${modelId}`;
}
function portalModelRef(modelId) {
	return `${PORTAL_PROVIDER_ID}/${modelId}`;
}
function getProviderBaseUrl(cfg, providerId) {
	return normalizeOptionalString(cfg.models?.providers?.[providerId]?.baseUrl);
}
function resolveMinimaxUsageBaseUrl(cfg) {
	return getProviderBaseUrl(cfg, PORTAL_PROVIDER_ID) ?? getProviderBaseUrl(cfg, API_PROVIDER_ID);
}
function buildPortalProviderCatalog(params) {
	return {
		...buildMinimaxPortalProvider(),
		baseUrl: params.baseUrl,
		apiKey: params.apiKey
	};
}
function findMinimaxCatalogModel(modelId) {
	const normalizedModelId = modelId.trim().toLowerCase();
	const catalogId = MINIMAX_TEXT_MODEL_ORDER.find((id) => id.toLowerCase() === normalizedModelId);
	return catalogId ? {
		id: catalogId,
		model: MINIMAX_TEXT_MODEL_CATALOG[catalogId]
	} : void 0;
}
function resolveMinimaxDynamicModel(params) {
	const catalogModel = findMinimaxCatalogModel(params.ctx.modelId);
	if (!catalogModel) return;
	return normalizeModelCompat({
		id: catalogModel.id,
		name: catalogModel.model.name,
		provider: params.providerId,
		api: "anthropic-messages",
		baseUrl: normalizeOptionalString(params.ctx.providerConfig?.baseUrl) ?? resolveMinimaxCatalogBaseUrl(),
		reasoning: catalogModel.model.reasoning,
		input: [...catalogModel.model.input],
		cost: resolveMinimaxApiCost(catalogModel.id),
		contextWindow: catalogModel.model.contextWindow,
		maxTokens: DEFAULT_MINIMAX_MAX_TOKENS
	});
}
async function resolveApiCatalog(ctx) {
	const auth = ctx.resolveProviderApiKey(API_PROVIDER_ID);
	if (!auth.apiKey) return null;
	return { provider: await buildOpenAICompatibleLiveModelProviderConfig({
		providerId: API_PROVIDER_ID,
		providerConfig: buildMinimaxProvider(ctx.env),
		apiKey: auth.apiKey,
		discoveryApiKey: auth.discoveryApiKey,
		modelDiscovery: buildMinimaxModelDiscovery()
	}) };
}
async function resolvePortalCatalog(ctx) {
	const explicitProvider = ctx.config.models?.providers?.[PORTAL_PROVIDER_ID];
	const apiKeyAuth = ctx.resolveProviderApiKey(PORTAL_PROVIDER_ID);
	const profileAuth = ctx.resolveProviderAuth(PORTAL_PROVIDER_ID, { oauthMarker: MINIMAX_OAUTH_MARKER });
	const explicitApiKey = normalizeOptionalString(explicitProvider?.apiKey);
	const apiKey = apiKeyAuth.apiKey ?? explicitApiKey ?? profileAuth.apiKey;
	if (!apiKey) return null;
	const usesPortalBearerAuth = apiKeyAuth.apiKey === "MINIMAX_OAUTH_TOKEN" || profileAuth.mode === "token" && profileAuth.apiKey === apiKey || !apiKeyAuth.apiKey && !explicitApiKey && profileAuth.mode === "oauth";
	const providerConfig = buildPortalProviderCatalog({
		baseUrl: normalizeOptionalString(explicitProvider?.baseUrl) || buildMinimaxPortalProvider(ctx.env).baseUrl,
		apiKey
	});
	return { provider: await buildOpenAICompatibleLiveModelProviderConfig({
		providerId: PORTAL_PROVIDER_ID,
		providerConfig,
		apiKey,
		discoveryApiKey: apiKeyAuth.discoveryApiKey ?? (usesPortalBearerAuth ? profileAuth.discoveryApiKey : void 0),
		modelDiscovery: buildMinimaxModelDiscovery(usesPortalBearerAuth ? "oauth" : "api_key")
	}) };
}
function createOAuthHandler(region) {
	const defaultBaseUrl = getDefaultBaseUrl(region);
	const regionLabel = resolveMinimaxRegionLabel(region);
	return async (ctx) => {
		const progress = ctx.prompter.progress(`Starting MiniMax OAuth (${regionLabel})…`);
		try {
			const { loginMiniMaxPortalOAuth } = await import("./extensions/minimax/oauth.runtime.js");
			const result = await loginMiniMaxPortalOAuth({
				openUrl: ctx.openUrl,
				note: (message, title) => ctx.prompter.note(message, title),
				progress,
				region,
				...ctx.signal ? { signal: ctx.signal } : {}
			});
			progress.stop("MiniMax OAuth complete");
			if (result.notification_message) await ctx.prompter.note(result.notification_message, "MiniMax OAuth");
			const baseUrl = result.resourceUrl || defaultBaseUrl;
			return buildOauthProviderAuthResult({
				providerId: PORTAL_PROVIDER_ID,
				defaultModel: portalModelRef(DEFAULT_MODEL),
				access: result.access,
				refresh: result.refresh,
				expires: result.expires,
				configPatch: {
					models: { providers: { [PORTAL_PROVIDER_ID]: {
						baseUrl,
						api: "anthropic-messages",
						authHeader: true,
						models: []
					} } },
					agents: { defaults: { models: {
						[portalModelRef("MiniMax-M3")]: { alias: "minimax-m3" },
						[portalModelRef("MiniMax-M2.7")]: { alias: "minimax-m2.7" },
						[portalModelRef("MiniMax-M2.7-highspeed")]: { alias: "minimax-m2.7-highspeed" }
					} } }
				},
				notes: [
					"MiniMax OAuth tokens auto-refresh. Re-run login if refresh fails or access is revoked.",
					`Base URL defaults to ${defaultBaseUrl}. Override models.providers.${PORTAL_PROVIDER_ID}.baseUrl if needed.`,
					...result.notification_message ? [result.notification_message] : []
				]
			});
		} catch (err) {
			const errorMsg = formatErrorMessage(err);
			progress.stop(`MiniMax OAuth failed: ${errorMsg}`);
			await ctx.prompter.note("If OAuth fails, verify your MiniMax account has portal access and try again.", "MiniMax OAuth");
			throw err;
		}
	};
}
function createMinimaxApiKeyMethod(region) {
	const regionLabel = resolveMinimaxRegionLabel(region);
	const endpointHint = resolveMinimaxEndpointHint(region);
	const isCn = region === "cn";
	return createProviderApiKeyAuthMethod({
		providerId: API_PROVIDER_ID,
		methodId: isCn ? "api-cn" : "api-global",
		label: `MiniMax API key (${regionLabel})`,
		hint: endpointHint,
		optionKey: "minimaxApiKey",
		flagName: "--minimax-api-key",
		envVar: "MINIMAX_API_KEY",
		promptMessage: isCn ? "Enter MiniMax CN API key (sk-api- or sk-cp-)\nhttps://platform.minimaxi.com/user-center/basic-information/interface-key" : "Enter MiniMax API key (sk-api- or sk-cp-)\nhttps://platform.minimax.io/user-center/basic-information/interface-key",
		profileId: isCn ? "minimax:cn" : "minimax:global",
		allowProfile: false,
		defaultModel: apiModelRef(DEFAULT_MODEL),
		expectedProviders: isCn ? ["minimax", "minimax-cn"] : ["minimax"],
		applyConfig: (cfg) => isCn ? applyMinimaxApiConfigCn(cfg) : applyMinimaxApiConfig(cfg),
		wizard: {
			choiceId: isCn ? "minimax-cn-api" : "minimax-global-api",
			choiceLabel: `MiniMax API key (${regionLabel})`,
			choiceHint: endpointHint,
			...MINIMAX_WIZARD_GROUP
		}
	});
}
function createMinimaxOAuthMethod(region) {
	const regionLabel = resolveMinimaxRegionLabel(region);
	const endpointHint = resolveMinimaxEndpointHint(region);
	const isCn = region === "cn";
	return {
		id: isCn ? "oauth-cn" : "oauth",
		label: `MiniMax OAuth (${regionLabel})`,
		hint: endpointHint,
		kind: "device_code",
		wizard: {
			choiceId: isCn ? "minimax-cn-oauth" : "minimax-global-oauth",
			choiceLabel: `MiniMax OAuth (${regionLabel})`,
			choiceHint: endpointHint,
			...MINIMAX_WIZARD_GROUP
		},
		run: createOAuthHandler(region)
	};
}
function buildMinimaxApiProviderPlugin() {
	return {
		id: API_PROVIDER_ID,
		label: PROVIDER_LABEL,
		hookAliases: ["minimax-cn"],
		docsPath: "/providers/minimax",
		envVars: ["MINIMAX_API_KEY"],
		auth: [createMinimaxApiKeyMethod("global"), createMinimaxApiKeyMethod("cn")],
		catalog: {
			order: "simple",
			run: async (ctx) => resolveApiCatalog(ctx)
		},
		staticCatalog: {
			order: "simple",
			run: async (ctx) => ({ providers: { [API_PROVIDER_ID]: buildMinimaxProvider(ctx.env) } })
		},
		resolveUsageAuth: async (ctx) => {
			const portalOauth = await ctx.resolveOAuthToken({ provider: PORTAL_PROVIDER_ID });
			if (portalOauth) return portalOauth;
			const apiKey = ctx.resolveApiKeyFromConfigAndStore({
				providerIds: [API_PROVIDER_ID, PORTAL_PROVIDER_ID],
				envDirect: MINIMAX_USAGE_ENV_VAR_KEYS.map((name) => ctx.env[name])
			});
			return apiKey ? { token: apiKey } : null;
		},
		...MINIMAX_PROVIDER_HOOKS,
		resolveDynamicModel: (ctx) => resolveMinimaxDynamicModel({
			providerId: API_PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isMiniMaxModernModelId(modelId),
		fetchUsageSnapshot: async (ctx) => await fetchMinimaxUsage(ctx.token, ctx.timeoutMs, ctx.fetchFn, { baseUrl: resolveMinimaxUsageBaseUrl(ctx.config) })
	};
}
function buildMinimaxPortalProviderPlugin() {
	return {
		id: PORTAL_PROVIDER_ID,
		label: PROVIDER_LABEL,
		hookAliases: ["minimax-portal-cn"],
		docsPath: "/providers/minimax",
		envVars: ["MINIMAX_OAUTH_TOKEN", "MINIMAX_API_KEY"],
		catalog: { run: async (ctx) => resolvePortalCatalog(ctx) },
		staticCatalog: { run: async (ctx) => ({ providers: { [PORTAL_PROVIDER_ID]: buildMinimaxPortalProvider(ctx.env) } }) },
		auth: [createMinimaxOAuthMethod("global"), createMinimaxOAuthMethod("cn")],
		...MINIMAX_PROVIDER_HOOKS,
		resolveDynamicModel: (ctx) => resolveMinimaxDynamicModel({
			providerId: PORTAL_PROVIDER_ID,
			ctx
		}),
		isModernModelRef: ({ modelId }) => isMiniMaxModernModelId(modelId)
	};
}
function registerMinimaxProviders(api) {
	api.registerProvider(buildMinimaxApiProviderPlugin());
	api.registerProvider(buildMinimaxPortalProviderPlugin());
}
//#endregion
export { registerMinimaxProviders as t };
