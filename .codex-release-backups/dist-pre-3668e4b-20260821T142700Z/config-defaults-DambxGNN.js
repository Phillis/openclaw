import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, n as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-BoJ2vZl0.js";
import { n as resolveKnownAnthropicModelRef, t as resolveClaudeCliAnthropicModelRefs } from "./claude-model-refs-CWy94aZu.js";
//#region extensions/anthropic/config-defaults.ts
const ANTHROPIC_PROVIDER_API = "anthropic-messages";
const ANTHROPIC_API_KEY_DEFAULT_ALLOWLIST_REFS = ["anthropic/claude-sonnet-5", "anthropic/claude-sonnet-4-6"];
function normalizeProviderId(provider) {
	const normalized = normalizeLowercaseStringOrEmpty(provider);
	if (normalized === "bedrock" || normalized === "aws-bedrock") return "amazon-bedrock";
	return normalized;
}
function resolveAnthropicDefaultAuthMode(config, env) {
	const profiles = config.auth?.profiles ?? {};
	const anthropicProfiles = Object.entries(profiles).filter(([, profile]) => profile?.provider === "anthropic" || profile?.provider === "claude-cli");
	const order = [...config.auth?.order?.anthropic ?? [], ...(config.auth?.order)?.["claude-cli"] ?? []];
	for (const profileId of order) {
		const entry = profiles[profileId];
		if (!entry || entry.provider !== "anthropic" && entry.provider !== "claude-cli") continue;
		if (entry.provider === "claude-cli") return "oauth";
		if (entry.mode === "api_key") return "api_key";
		if (entry.mode === "oauth" || entry.mode === "token") return "oauth";
	}
	const hasApiKey = anthropicProfiles.some(([, profile]) => profile?.provider === "anthropic" && profile?.mode === "api_key");
	const hasOauth = anthropicProfiles.some(([, profile]) => profile?.provider === "claude-cli" || profile?.mode === "oauth" || profile?.mode === "token");
	if (hasApiKey && !hasOauth) return "api_key";
	if (hasOauth && !hasApiKey) return "oauth";
	if (env.ANTHROPIC_OAUTH_TOKEN?.trim()) return "oauth";
	if (env.ANTHROPIC_API_KEY?.trim()) return "api_key";
	return null;
}
function resolveModelPrimaryValue(value) {
	if (typeof value === "string") return value.trim() || void 0;
	const primary = value?.primary;
	if (typeof primary !== "string") return;
	return primary.trim() || void 0;
}
function parseProviderModelRef(raw, defaultProvider) {
	const trimmed = raw.trim();
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return {
		provider: defaultProvider,
		model: trimmed
	};
	const provider = trimmed.slice(0, slashIndex).trim();
	const model = trimmed.slice(slashIndex + 1).trim();
	if (!provider || !model) return null;
	return {
		provider: normalizeProviderId(provider),
		model
	};
}
function isAnthropicCacheRetentionTarget(parsed) {
	return Boolean(parsed && (parsed.provider === "anthropic" || parsed.provider === "amazon-bedrock" && normalizeLowercaseStringOrEmpty(parsed.model).includes("anthropic.claude")));
}
function usesClaudeCliModelSelection(config) {
	const primary = resolveModelPrimaryValue(config.agents?.defaults?.model);
	if ((primary ? parseProviderModelRef(primary, "anthropic") : null)?.provider === "claude-cli") return true;
	return Object.entries(config.agents?.defaults?.models ?? {}).some(([key, entry]) => {
		const parsed = parseProviderModelRef(key, "anthropic");
		if (parsed?.provider === "claude-cli") return true;
		const runtimeId = isRecord(entry?.agentRuntime) ? entry.agentRuntime.id : void 0;
		return parsed?.provider === "anthropic" && normalizeLowercaseStringOrEmpty(runtimeId) === "claude-cli";
	});
}
function usesSelectedClaudeCliAuthProfile(config) {
	const profiles = config.auth?.profiles ?? {};
	const orderedProfileIds = [...config.auth?.order?.anthropic ?? [], ...(config.auth?.order)?.["claude-cli"] ?? []];
	for (const profileId of orderedProfileIds) {
		const provider = profiles[profileId]?.provider;
		if (provider === "claude-cli") return true;
		if (provider === "anthropic") return false;
	}
	let hasClaudeCliProfile = false;
	let hasAnthropicProfile = false;
	for (const profile of Object.values(profiles)) {
		if (profile?.provider === "claude-cli") hasClaudeCliProfile = true;
		if (profile?.provider === "anthropic") hasAnthropicProfile = true;
	}
	return hasClaudeCliProfile && !hasAnthropicProfile;
}
function toCanonicalAnthropicModelRef(ref) {
	return ref.startsWith(`claude-cli/`) ? `anthropic/${ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : ref;
}
function modelEntryWithClaudeCliRuntime(entry) {
	const base = isRecord(entry) ? { ...entry } : {};
	const currentRuntime = normalizeLowercaseStringOrEmpty(isRecord(base.agentRuntime) ? base.agentRuntime.id : void 0);
	if (currentRuntime && currentRuntime !== "auto") return base;
	base.agentRuntime = {
		...isRecord(base.agentRuntime) ? base.agentRuntime : {},
		id: CLAUDE_CLI_BACKEND_ID
	};
	return base;
}
function collectClaudeCliRuntimeRefsFromConfig(config) {
	const selections = [{
		model: config.agents?.defaults?.model,
		models: config.agents?.defaults?.models
	}, ...(config.agents?.list ?? []).map((agent) => ({
		model: agent.model,
		models: agent.models
	}))];
	const refs = /* @__PURE__ */ new Set();
	for (const { model, models } of selections) {
		const selected = typeof model === "string" ? [model] : [model?.primary, ...model?.fallbacks ?? []];
		for (const rawRef of [...selected, ...Object.keys(models ?? {})]) {
			if (typeof rawRef !== "string") continue;
			for (const ref of resolveClaudeCliAnthropicModelRefs(rawRef)?.runtimeRefs ?? []) refs.add(ref);
		}
	}
	return [...refs];
}
function normalizeAnthropicProviderConfig(providerConfig) {
	if (providerConfig.api || !Array.isArray(providerConfig.models) || providerConfig.models.length === 0) return providerConfig;
	return {
		...providerConfig,
		api: ANTHROPIC_PROVIDER_API
	};
}
/** Normalize Anthropic provider config defaults for one provider entry. */
function normalizeAnthropicProviderConfigForProvider(params) {
	const provider = normalizeProviderId(params.provider);
	if (provider !== "anthropic" && provider !== "claude-cli") return params.providerConfig;
	return normalizeAnthropicProviderConfig(params.providerConfig);
}
/** Apply Anthropic and Claude CLI defaults to an OpenClaw config object. */
function applyAnthropicConfigDefaults(params) {
	const defaults = params.config.agents?.defaults;
	if (!defaults) return params.config;
	const authMode = resolveAnthropicDefaultAuthMode(params.config, params.env);
	if (!authMode) return params.config;
	let mutated = false;
	const nextDefaults = { ...defaults };
	const contextPruning = defaults.contextPruning ?? {};
	const heartbeat = defaults.heartbeat ?? {};
	if (defaults.contextPruning?.mode === void 0) {
		nextDefaults.contextPruning = {
			...contextPruning,
			mode: "cache-ttl",
			ttl: defaults.contextPruning?.ttl ?? "1h"
		};
		mutated = true;
	}
	if (defaults.heartbeat?.every === void 0) {
		nextDefaults.heartbeat = {
			...heartbeat,
			every: authMode === "oauth" ? "1h" : "30m"
		};
		mutated = true;
	}
	if (authMode === "api_key") {
		const nextModels = defaults.models ? { ...defaults.models } : {};
		let modelsMutated = false;
		for (const [key, entry] of Object.entries(nextModels)) {
			if (!isAnthropicCacheRetentionTarget(parseProviderModelRef(key, "anthropic"))) continue;
			const current = entry ?? {};
			const paramsValue = current.params ?? {};
			if (typeof paramsValue.cacheRetention === "string") continue;
			nextModels[key] = {
				...current,
				params: {
					...paramsValue,
					cacheRetention: "short"
				}
			};
			modelsMutated = true;
		}
		const primary = resolveKnownAnthropicModelRef(resolveModelPrimaryValue(defaults.model));
		if (primary) {
			const parsedPrimary = parseProviderModelRef(primary, "anthropic");
			if (parsedPrimary && isAnthropicCacheRetentionTarget(parsedPrimary)) {
				const key = `${parsedPrimary.provider}/${parsedPrimary.model}`;
				const current = nextModels[key] ?? {};
				const paramsValue = current.params ?? {};
				if (typeof paramsValue.cacheRetention !== "string") {
					nextModels[key] = {
						...current,
						params: {
							...paramsValue,
							cacheRetention: "short"
						}
					};
					modelsMutated = true;
				}
			}
		}
		if (Object.keys(nextModels).some((key) => isAnthropicCacheRetentionTarget(parseProviderModelRef(key, "anthropic")))) for (const ref of ANTHROPIC_API_KEY_DEFAULT_ALLOWLIST_REFS) {
			if (ref in nextModels) continue;
			nextModels[ref] = { params: { cacheRetention: "short" } };
			modelsMutated = true;
		}
		if (modelsMutated) {
			nextDefaults.models = nextModels;
			mutated = true;
		}
	}
	if (authMode === "oauth" && (usesClaudeCliModelSelection(params.config) || usesSelectedClaudeCliAuthProfile(params.config))) {
		const nextModels = defaults.models ? { ...defaults.models } : {};
		let modelsMutated = false;
		const runtimeRefs = new Set(collectClaudeCliRuntimeRefsFromConfig(params.config));
		for (const rawRef of CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS) runtimeRefs.add(toCanonicalAnthropicModelRef(rawRef));
		for (const ref of runtimeRefs) {
			const current = nextModels[ref];
			const updated = modelEntryWithClaudeCliRuntime(current);
			if (JSON.stringify(updated) === JSON.stringify(current ?? {})) continue;
			nextModels[ref] = updated;
			modelsMutated = true;
		}
		if (modelsMutated) {
			nextDefaults.models = nextModels;
			mutated = true;
		}
	}
	if (!mutated) return params.config;
	return {
		...params.config,
		agents: {
			...params.config.agents,
			defaults: nextDefaults
		}
	};
}
//#endregion
export { normalizeAnthropicProviderConfigForProvider as n, applyAnthropicConfigDefaults as t };
