import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { g as resolveSessionAgentIds } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
//#region src/agents/model-runtime-policy.ts
/**
* Model runtime policy resolution.
*
* Agent execution uses this to choose a model/provider-specific runtime policy
* from agent entries, model catalog config, provider config, or QA overrides.
*/
function hasRuntimePolicy(value) {
	return Boolean(value?.id?.trim());
}
function resolveProviderConfig(config, provider) {
	if (!config?.models?.providers || !provider?.trim()) return;
	const providers = config.models.providers;
	const direct = providers[provider];
	if (direct) return direct;
	const normalizedProvider = normalizeProviderId(provider);
	for (const [candidateProvider, providerConfig] of Object.entries(providers)) if (normalizeProviderId(candidateProvider) === normalizedProvider) return providerConfig;
}
function normalizeModelIdForProvider(provider, modelId) {
	const trimmed = modelId?.trim();
	if (!trimmed) return;
	const slash = trimmed.indexOf("/");
	if (slash <= 0) return trimmed;
	const modelProvider = normalizeProviderId(trimmed.slice(0, slash));
	const expectedProvider = normalizeProviderId(provider ?? "");
	if (expectedProvider && modelProvider !== expectedProvider) return trimmed;
	return trimmed.slice(slash + 1).trim() || void 0;
}
function resolveEffectiveProvider(provider, modelId) {
	const normalizedProvider = normalizeProviderId(provider ?? "");
	if (normalizedProvider) return normalizedProvider;
	return parseModelCatalogRef(modelId?.trim() ?? "")?.provider;
}
function resolvePolicyMatch(matches, callerProvider) {
	const providerMatches = callerProvider ? matches.filter((match) => match.provider === callerProvider) : [];
	const candidates = providerMatches.length > 0 ? providerMatches : matches;
	const [first] = candidates;
	if (!first) return {};
	if (!callerProvider && candidates.some((match) => match.provider !== first.provider)) return { ambiguous: true };
	return {
		policy: first.policy,
		source: "model",
		matchedProvider: first.provider || callerProvider
	};
}
function modelEntryMatchKind(params) {
	const entryId = params.entry.id.trim();
	if (entryId === params.modelId) return "exact";
	const parsed = parseModelCatalogRef(entryId);
	if (!parsed) return "none";
	const callerProvider = normalizeProviderId(params.provider ?? "");
	if (callerProvider && parsed.provider !== callerProvider) return "none";
	if (parsed.modelId === params.modelId) return "exact";
	if (parsed.modelId === "*") return "provider-wildcard";
	return "none";
}
function resolveAgentModelEntryRuntimePolicy(params) {
	const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
	if (!params.config || !modelId && params.matchKind !== "provider-wildcard") return {};
	const sessionAgentId = Boolean(params.agentId?.trim() || params.sessionKey?.trim()) ? resolveSessionAgentIds({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	}).sessionAgentId : tryResolveLegacyCompatibilityAgentId(params.config);
	const modelMaps = [(sessionAgentId ? listAgentEntries(params.config).find((entry) => normalizeAgentId(entry.id) === sessionAgentId) : void 0)?.models, params.config.agents?.defaults?.models];
	const callerProvider = normalizeProviderId(params.provider ?? "");
	for (const models of modelMaps) {
		const scopeMatches = [];
		for (const [key, entry] of Object.entries(models ?? {})) {
			const matches = modelEntryMatchKind({
				entry: { id: key },
				provider: params.provider,
				modelId: modelId ?? ""
			}) === params.matchKind;
			const policy = entry?.agentRuntime;
			if (!matches || !policy || !hasRuntimePolicy(policy)) continue;
			scopeMatches.push({
				provider: parseModelCatalogRef(key)?.provider ?? "",
				policy
			});
		}
		const resolved = resolvePolicyMatch(scopeMatches, callerProvider);
		if (resolved.policy || resolved.ambiguous) return resolved;
	}
	return {};
}
function resolveModelConfig(params) {
	const modelId = normalizeModelIdForProvider(params.provider, params.modelId);
	if (!modelId || !Array.isArray(params.providerConfig?.models)) return;
	return params.providerConfig.models.find((entry) => modelEntryMatchKind({
		entry,
		provider: params.provider,
		modelId
	}) === "exact");
}
/** Resolves the effective runtime policy for an agent/model/provider selection. */
function resolveModelRuntimePolicy(params) {
	const callerProvider = normalizeProviderId(params.provider ?? "");
	const effectiveProvider = resolveEffectiveProvider(params.provider, params.modelId);
	const inferredMatchedProvider = callerProvider ? void 0 : effectiveProvider;
	if (process.env.OPENCLAW_BUILD_PRIVATE_QA === "1") {
		const forcedRuntime = process.env.OPENCLAW_QA_FORCE_RUNTIME?.trim().toLowerCase();
		if (forcedRuntime === "openclaw" || forcedRuntime === "codex") return {
			policy: { id: forcedRuntime },
			source: "model"
		};
	}
	const agentModelPolicy = resolveAgentModelEntryRuntimePolicy({
		...params,
		provider: effectiveProvider,
		matchKind: "exact"
	});
	if (agentModelPolicy.ambiguous) return {};
	if (agentModelPolicy.policy) return agentModelPolicy;
	const providerConfig = resolveProviderConfig(params.config, effectiveProvider);
	const modelConfig = resolveModelConfig({
		providerConfig,
		provider: effectiveProvider,
		modelId: params.modelId
	});
	if (hasRuntimePolicy(modelConfig?.agentRuntime)) return {
		policy: modelConfig?.agentRuntime,
		source: "model",
		...inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}
	};
	const agentWildcardModelPolicy = resolveAgentModelEntryRuntimePolicy({
		...params,
		provider: effectiveProvider,
		matchKind: "provider-wildcard"
	});
	if (agentWildcardModelPolicy.policy) return agentWildcardModelPolicy;
	if (hasRuntimePolicy(providerConfig?.agentRuntime)) return {
		policy: providerConfig?.agentRuntime,
		source: "provider",
		...inferredMatchedProvider ? { matchedProvider: inferredMatchedProvider } : {}
	};
	return {};
}
//#endregion
export { resolveModelRuntimePolicy as t };
