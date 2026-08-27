import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
import { p as resolveThinkingDefaultForModelCore, r as THINKING_LEVEL_RANKS, s as normalizeThinkLevel, t as BASE_THINKING_LEVELS } from "./thinking.shared-bHYuuc1L.js";
import { n as matchesProviderPluginRef } from "./provider-registry-shared-CYfJZ_PT.js";
import { n as resolveProviderPolicySurface } from "./provider-public-artifacts-CUyXoT9F.js";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-rLTe2GOS.js";
//#region src/plugins/provider-thinking-active.ts
function resolveActiveThinkingProvider(providerId) {
	return globalThis[PLUGIN_REGISTRY_STATE]?.activeRegistry?.providers?.find((entry) => matchesProviderPluginRef(entry.provider, providerId))?.provider;
}
function resolveActiveProviderThinkingProfile(params) {
	return resolveActiveThinkingProvider(params.provider)?.resolveThinkingProfile?.(params.context);
}
//#endregion
//#region src/plugins/provider-thinking.ts
function resolveProviderPublicPolicySurface(providerId) {
	return resolveProviderPolicySurface(providerId, { manifestRegistry: getCurrentPluginMetadataSnapshot({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	})?.manifestRegistry });
}
/** Resolves a provider thinking profile from active plugins or bundled policy surface. */
function resolveEffectiveThinkingProfile(params, options) {
	const activeProfile = resolveActiveProviderThinkingProfile(params);
	if (activeProfile !== void 0) return activeProfile;
	if (options?.allowPublicArtifactFallback === false) return;
	return resolveProviderPublicPolicySurface(params.provider)?.resolveThinkingProfile?.(params.context);
}
//#endregion
//#region src/auto-reply/thinking.ts
function buildCatalogModelKey(provider, model) {
	const providerId = provider.trim();
	const modelId = model.trim();
	if (!providerId) return modelId;
	if (!modelId) return providerId;
	return normalizeOptionalLowercaseString(modelId)?.startsWith(`${normalizeOptionalLowercaseString(providerId)}/`) ? modelId : `${providerId}/${modelId}`;
}
function resolveThinkingPolicyContext(params) {
	const providerRaw = normalizeOptionalString(params.provider);
	const normalizedProvider = providerRaw ? normalizeProviderId(providerRaw) : "";
	const modelId = normalizeOptionalString(params.model) ?? "";
	const modelKey = normalizeOptionalLowercaseString(params.model) ?? "";
	const selectedCatalogKey = normalizedProvider && modelId ? buildCatalogModelKey(normalizedProvider, modelId) : void 0;
	const candidate = params.catalog?.find((entry) => selectedCatalogKey !== void 0 && buildCatalogModelKey(normalizeProviderId(entry.provider), entry.id) === selectedCatalogKey);
	return {
		normalizedProvider,
		modelId,
		modelKey,
		api: candidate?.api,
		reasoning: candidate?.reasoning,
		...candidate?.params ? { params: candidate.params } : {},
		compat: candidate?.compat
	};
}
function normalizeProfileLevel(level) {
	const normalized = normalizeThinkLevel(level.id);
	if (!normalized) return;
	return {
		id: normalized,
		label: normalizeOptionalString(level.label) ?? normalized,
		rank: Number.isFinite(level.rank) ? level.rank : THINKING_LEVEL_RANKS[normalized]
	};
}
function normalizeThinkingProfile(profile) {
	const byId = /* @__PURE__ */ new Map();
	for (const raw of profile.levels) {
		const level = normalizeProfileLevel(raw);
		if (level) byId.set(level.id, level);
	}
	const levels = [...byId.values()].toSorted((a, b) => a.rank - b.rank);
	const rawDefaultLevel = profile.defaultLevel ? normalizeThinkLevel(profile.defaultLevel) : void 0;
	return {
		levels,
		defaultLevel: rawDefaultLevel && byId.has(rawDefaultLevel) ? rawDefaultLevel : void 0
	};
}
function buildBaseThinkingProfile(defaultLevel) {
	return {
		levels: BASE_THINKING_LEVELS.map((id) => ({
			id,
			label: id,
			rank: THINKING_LEVEL_RANKS[id]
		})),
		defaultLevel
	};
}
function buildOffOnlyThinkingProfile() {
	return {
		levels: [{
			id: "off",
			label: "off",
			rank: THINKING_LEVEL_RANKS.off
		}],
		defaultLevel: "off"
	};
}
function appendProfileLevel(profile, id) {
	if (profile.levels.some((level) => level.id === id)) return;
	profile.levels.push({
		id,
		label: id,
		rank: THINKING_LEVEL_RANKS[id]
	});
	profile.levels = profile.levels.toSorted((a, b) => a.rank - b.rank);
}
const CATALOG_ADVANCED_THINKING_LEVELS = /* @__PURE__ */ new Set([
	"adaptive",
	"xhigh",
	"max"
]);
function appendCatalogAdvancedThinkingLevels(profile, compat, agentRuntime) {
	const efforts = compat?.supportedReasoningEfforts;
	if (!Array.isArray(efforts)) return;
	let supportsMax = false;
	for (const effort of efforts) {
		const level = normalizeThinkLevel(effort);
		if (level && CATALOG_ADVANCED_THINKING_LEVELS.has(level)) {
			appendProfileLevel(profile, level);
			supportsMax ||= level === "max";
		}
	}
	const runtime = normalizeOptionalLowercaseString(agentRuntime);
	if (supportsMax && (runtime === "openclaw" || runtime === "auto")) appendProfileLevel(profile, "ultra");
}
/** Resolve supported thinking levels and default for a provider/model pair. */
function resolveThinkingProfile(params) {
	const context = resolveThinkingPolicyContext(params);
	if (!context.normalizedProvider) return buildBaseThinkingProfile();
	const providerContext = {
		provider: context.normalizedProvider,
		modelId: context.modelId,
		agentRuntime: params.agentRuntime,
		api: context.api,
		reasoning: context.reasoning,
		...context.params ? { params: context.params } : {},
		compat: context.compat
	};
	const providerProfileParams = {
		provider: context.normalizedProvider,
		context: providerContext
	};
	const providerProfile = params.providerPolicySource === "active" ? resolveEffectiveThinkingProfile(providerProfileParams, { allowPublicArtifactFallback: false }) : resolveEffectiveThinkingProfile(providerProfileParams);
	const anthropicMessagesProfile = context.api === "anthropic-messages" ? resolveClaudeThinkingProfile(context.modelId, context.params, { includeNativeMax: true }) : void 0;
	const pluginProfile = providerProfile ?? anthropicMessagesProfile;
	if (pluginProfile) {
		const normalized = normalizeThinkingProfile(pluginProfile);
		if (normalized.levels.length > 0 && (context.reasoning !== false || pluginProfile.preserveWhenCatalogReasoningFalse === true)) return normalized;
	}
	if (context.reasoning === false) return buildOffOnlyThinkingProfile();
	const profile = buildBaseThinkingProfile();
	appendCatalogAdvancedThinkingLevels(profile, context.compat, params.agentRuntime);
	return profile;
}
function supportsThinkingLevel(provider, model, level, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.some((entry) => entry.id === level);
}
/** List thinking level ids supported by provider/model. */
function listThinkingLevels(provider, model, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map((level) => level.id);
}
/** List labeled thinking level options supported by provider/model. */
function listThinkingLevelOptions(provider, model, catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map(({ id, label }) => ({
		id,
		label
	}));
}
/** List display labels for thinking levels supported by provider/model. */
function listThinkingLevelLabels(provider, model, catalog, agentRuntime) {
	return listThinkingLevelOptions(provider, model, catalog, agentRuntime).map((level) => level.label);
}
/** Format supported thinking level labels for command/status output. */
function formatThinkingLevels(provider, model, separator = ", ", catalog, agentRuntime) {
	return resolveThinkingProfile({
		provider,
		model,
		catalog,
		agentRuntime
	}).levels.map(({ label }) => label).join(separator);
}
/** Resolve the default thinking level for a provider/model pair. */
function resolveThinkingDefaultForModel(params) {
	const profile = resolveThinkingProfile({
		provider: params.provider,
		model: params.model,
		catalog: params.catalog,
		agentRuntime: params.agentRuntime
	});
	if (profile.defaultLevel) return profile.defaultLevel;
	if (resolveThinkingDefaultForModelCore(params) === "off") return "off";
	return resolveSupportedThinkingLevelFromProfile(profile, "medium");
}
/** Return whether a specific thinking level is supported by provider/model. */
function isThinkingLevelSupported(params) {
	return supportsThinkingLevel(params.provider, params.model, params.level, params.catalog, params.agentRuntime);
}
function resolveSupportedThinkingLevelFromProfile(profile, level) {
	if (profile.levels.some((entry) => entry.id === level)) return level;
	const requestedRank = THINKING_LEVEL_RANKS[level];
	const ranked = profile.levels.toSorted((a, b) => b.rank - a.rank);
	return ranked.find((entry) => entry.id !== "off" && entry.rank <= requestedRank)?.id ?? ranked.findLast((entry) => entry.id !== "off")?.id ?? "off";
}
/** Clamp a requested thinking level to the closest supported provider/model level. */
function resolveSupportedThinkingLevel(params) {
	return resolveSupportedThinkingLevelFromProfile(resolveThinkingProfile({
		provider: params.provider,
		model: params.model,
		catalog: params.catalog,
		agentRuntime: params.agentRuntime,
		providerPolicySource: params.providerPolicySource
	}), params.level);
}
//#endregion
export { listThinkingLevels as a, resolveThinkingProfile as c, listThinkingLevelOptions as i, resolveActiveProviderThinkingProfile as l, isThinkingLevelSupported as n, resolveSupportedThinkingLevel as o, listThinkingLevelLabels as r, resolveThinkingDefaultForModel as s, formatThinkingLevels as t };
