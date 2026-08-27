import { a as normalizeFastMode } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { g as resolveSessionAgentIds } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as resolveModelRuntimePolicy } from "./model-runtime-policy-CbU9a7ui.js";
import { t as canonicalizeProviderModelId } from "./provider-model-route-D-FYx-DP.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { a as resolveOpenAIModelRoutes } from "./openai-model-routes-Bxpy3ufg.js";
//#region src/agents/agent-runtime-id.ts
const OPENCLAW_AGENT_RUNTIME_ID = "openclaw";
const AUTO_AGENT_RUNTIME_ID = "auto";
/** Normalizes configured runtime aliases to the current embedded-agent runtime id vocabulary. */
function normalizeEmbeddedAgentRuntime(raw) {
	const value = raw?.trim();
	if (!value) return OPENCLAW_AGENT_RUNTIME_ID;
	if (value === "openclaw" || value === "pi") return OPENCLAW_AGENT_RUNTIME_ID;
	if (value === "auto") return AUTO_AGENT_RUNTIME_ID;
	if (value === "codex-app-server") return "codex";
	return value;
}
/** Normalizes an optional unknown runtime id value, returning undefined when absent/invalid. */
function normalizeOptionalAgentRuntimeId(raw) {
	if (typeof raw !== "string") return;
	const value = raw.trim().toLowerCase();
	return value ? normalizeEmbeddedAgentRuntime(value) : void 0;
}
/** Resolves the deprecated explicit whole-agent runtime override, when present. */
function resolveAgentScopedRuntimeOverride(params) {
	const agentId = params.agentId ? normalizeAgentId(params.agentId) : void 0;
	return normalizeOptionalAgentRuntimeId((agentId && params.config ? resolveAgentConfig(params.config, agentId)?.agentRuntime?.id : void 0) ?? params.config?.agents?.defaults?.agentRuntime?.id);
}
/** Returns whether a runtime id should be treated as the default runtime selection. */
function isDefaultAgentRuntimeId(runtime) {
	return runtime === void 0 || runtime === "auto" || runtime === "default";
}
//#endregion
//#region src/agents/model-extra-params.ts
const FAST_MODE_CUTOFF_MODEL_PARAM_KEYS = /* @__PURE__ */ new Set([
	"fastAutoOnSeconds",
	"fastSeconds",
	"fast_auto_on_seconds",
	"fast_seconds"
]);
function isAgentRuntimeModelParam(key, value) {
	if (key === "thinking") return value === false || value === "disabled" || value === "none" || typeof value === "string" && normalizeThinkLevel(value) !== void 0;
	if (key === "fastMode" || key === "fast_mode") return normalizeFastMode(value) !== void 0;
	return FAST_MODE_CUTOFF_MODEL_PARAM_KEYS.has(key) && typeof value === "number" && Number.isInteger(value) && value > 0;
}
function legacyModelKey(provider, modelId) {
	const rawKey = `${provider.trim()}/${modelId.trim()}`;
	return rawKey === modelKey(provider, modelId) ? void 0 : rawKey;
}
/** Resolves the config records merged into one model request. */
function resolveModelExtraParamSources(params) {
	const defaultParams = params.config?.agents?.defaults?.params;
	const configuredModels = params.config?.agents?.defaults?.models;
	const canonicalKey = params.modelId ? modelKey(params.provider, params.modelId) : void 0;
	const legacyKey = params.modelId ? legacyModelKey(params.provider, params.modelId) : void 0;
	return {
		defaultParams,
		modelParams: canonicalKey ? configuredModels?.[canonicalKey]?.params ?? (legacyKey ? configuredModels?.[legacyKey]?.params : void 0) : void 0,
		agentParams: params.agentId && params.config ? resolveAgentConfig(params.config, params.agentId)?.params : void 0
	};
}
/** Returns whether embedded OpenClaw would apply authored provider request parameters. */
function hasAuthoredProviderRequestParams(params) {
	const sources = resolveModelExtraParamSources(params);
	if ([sources.defaultParams, sources.agentParams].some((source) => source !== void 0 && Object.keys(source).length > 0)) return true;
	return Object.entries(sources.modelParams ?? {}).some(([key, value]) => !isAgentRuntimeModelParam(key, value));
}
//#endregion
//#region src/agents/openai-routing.ts
/**
* OpenAI provider routing decisions shared by model selection, auth profiles, and runtime setup.
*
* Custom OpenAI-compatible base URLs intentionally bypass Codex-runtime defaults.
*/
/** Canonical provider id for OpenAI-hosted model routes. */
const OPENAI_PROVIDER_ID = "openai";
const OPENAI_CODEX_PROVIDER_ID = OPENAI_PROVIDER_ID;
/** Returns true for provider ids that normalize to OpenAI. */
function isOpenAIProvider(provider) {
	return normalizeProviderId(provider ?? "") === OPENAI_PROVIDER_ID;
}
/** Canonicalizes shipped OpenAI model aliases at runtime boundaries. */
function canonicalizeOpenAIModelId(provider, modelId) {
	return isOpenAIProvider(provider) ? canonicalizeProviderModelId(OPENAI_PROVIDER_ID, modelId) : modelId;
}
/** Resolves the provider-owned implicit runtime for one concrete OpenAI route. */
function resolveOpenAIImplicitAgentRuntime(params) {
	if (!isOpenAIProvider(params.provider)) return null;
	const modelId = params.modelId;
	const agentId = params.config && (params.agentId?.trim() || params.sessionKey?.trim()) ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : params.agentId;
	const hasConfiguredProviderRequestParams = hasAuthoredProviderRequestParams({
		config: params.config,
		provider: params.provider ?? "openai",
		modelId,
		agentId
	});
	const requestTransportOverrides = params.requestTransportOverrides === "present" || hasConfiguredProviderRequestParams ? "present" : "none";
	const resolution = resolveOpenAIModelRoutes({
		provider: params.provider,
		modelId,
		api: params.api,
		baseUrl: params.baseUrl,
		config: params.config,
		env: params.env,
		requestTransportOverrides
	});
	if (!resolution) return "openclaw";
	return resolution.kind !== "incompatible" && resolution.defaultRuntimeId === "codex" ? "codex" : "openclaw";
}
/** Parses the provider portion from a provider/model ref. */
function parseModelRefProvider(value) {
	if (typeof value !== "string") return;
	const slashIndex = value.trim().indexOf("/");
	if (slashIndex <= 0) return;
	return normalizeProviderId(value.trim().slice(0, slashIndex));
}
/** Returns true when selected model config should ensure the Codex plugin exists. */
function modelSelectionShouldEnsureCodexPlugin(params) {
	const provider = parseModelRefProvider(params.model);
	if (provider !== "openai") return false;
	const modelRef = params.model?.trim();
	const slashIndex = modelRef?.indexOf("/") ?? -1;
	const modelId = slashIndex >= 0 ? modelRef?.slice(slashIndex + 1) : void 0;
	const configuredPolicy = resolveModelRuntimePolicy({
		config: params.config,
		provider,
		modelId,
		agentId: params.agentId
	}).policy;
	const configuredRuntime = normalizeOptionalAgentRuntimeId(configuredPolicy?.id);
	if (configuredRuntime && !isDefaultAgentRuntimeId(configuredRuntime)) return configuredRuntime === "codex";
	if (!configuredPolicy) {
		const agentRuntime = resolveAgentScopedRuntimeOverride({
			config: params.config,
			agentId: params.agentId
		});
		if (agentRuntime && !isDefaultAgentRuntimeId(agentRuntime)) return agentRuntime === "codex";
	}
	return resolveOpenAIImplicitAgentRuntime({
		provider,
		modelId,
		config: params.config,
		agentId: params.agentId
	}) === "codex";
}
/** Lists auth-profile providers for an OpenAI runtime route. */
function listOpenAIAuthProfileProvidersForAgentRuntime(params) {
	if (!isOpenAIProvider(params.provider)) return [params.provider];
	return [OPENAI_PROVIDER_ID];
}
/** Resolves the provider id passed to OpenAI runtime auth/execution paths. */
function resolveOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the selected provider id displayed for OpenAI runtime routes. */
function resolveSelectedOpenAIRuntimeProvider(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
/** Resolves the config provider used for context-window lookup. */
function resolveContextConfigProviderForRuntime(params) {
	return isOpenAIProvider(params.provider) ? OPENAI_PROVIDER_ID : params.provider;
}
//#endregion
export { isDefaultAgentRuntimeId as _, listOpenAIAuthProfileProvidersForAgentRuntime as a, resolveContextConfigProviderForRuntime as c, resolveSelectedOpenAIRuntimeProvider as d, hasAuthoredProviderRequestParams as f, OPENCLAW_AGENT_RUNTIME_ID as g, AUTO_AGENT_RUNTIME_ID as h, isOpenAIProvider as i, resolveOpenAIImplicitAgentRuntime as l, resolveModelExtraParamSources as m, OPENAI_PROVIDER_ID as n, modelSelectionShouldEnsureCodexPlugin as o, isAgentRuntimeModelParam as p, canonicalizeOpenAIModelId as r, parseModelRefProvider as s, OPENAI_CODEX_PROVIDER_ID as t, resolveOpenAIRuntimeProvider as u, normalizeEmbeddedAgentRuntime as v, normalizeOptionalAgentRuntimeId as y };
