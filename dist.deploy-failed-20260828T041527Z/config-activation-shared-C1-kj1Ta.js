import { n as normalizeArrayBackedTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { t as normalizePluginPolicyId } from "./plugin-policy-id-4QxPdFqy.js";
import { i as normalizeChatChannelId } from "./ids-Cgp0iV_A.js";
import { a as normalizeSlotValue, s as resolveSlotSelection } from "./slots-CQdAEuat.js";
//#region src/plugins/config-normalization-shared.ts
/** Default plugin id normalizer for already-canonical ids. */
const identityNormalizePluginId = (id) => id.trim();
function normalizeList(value, normalizePluginId) {
	if (!Array.isArray(value)) return [];
	return value.map((entry) => typeof entry === "string" ? normalizePluginId(entry) : "").filter(Boolean);
}
function normalizeHookTimeoutMs(value) {
	if (typeof value !== "number" || !Number.isInteger(value) || !Number.isFinite(value) || value <= 0 || value > 6e5) return;
	return value;
}
function normalizeHookTimeouts(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const normalized = {};
	for (const [hookName, timeoutMs] of Object.entries(value)) {
		const normalizedTimeoutMs = normalizeHookTimeoutMs(timeoutMs);
		if (normalizedTimeoutMs !== void 0) normalized[hookName] = normalizedTimeoutMs;
	}
	return Object.keys(normalized).length > 0 ? normalized : void 0;
}
function normalizePluginEntries(entries, normalizePluginId) {
	if (!entries || typeof entries !== "object" || Array.isArray(entries)) return {};
	const normalized = {};
	for (const [key, value] of Object.entries(entries)) {
		const normalizedKey = normalizePluginId(key);
		if (!normalizedKey) continue;
		if (!value || typeof value !== "object" || Array.isArray(value)) {
			normalized[normalizedKey] = {};
			continue;
		}
		const entry = value;
		const hooksRaw = entry.hooks;
		const hooks = hooksRaw && typeof hooksRaw === "object" && !Array.isArray(hooksRaw) ? {
			allowPromptInjection: hooksRaw.allowPromptInjection,
			allowConversationAccess: hooksRaw.allowConversationAccess,
			timeoutMs: normalizeHookTimeoutMs(hooksRaw.timeoutMs),
			timeouts: normalizeHookTimeouts(hooksRaw.timeouts)
		} : void 0;
		const normalizedHooks = hooks && (typeof hooks.allowPromptInjection === "boolean" || typeof hooks.allowConversationAccess === "boolean" || hooks.timeoutMs !== void 0 || hooks.timeouts !== void 0) ? {
			...typeof hooks.allowPromptInjection === "boolean" ? { allowPromptInjection: hooks.allowPromptInjection } : {},
			...typeof hooks.allowConversationAccess === "boolean" ? { allowConversationAccess: hooks.allowConversationAccess } : {},
			...hooks.timeoutMs !== void 0 ? { timeoutMs: hooks.timeoutMs } : {},
			...hooks.timeouts !== void 0 ? { timeouts: hooks.timeouts } : {}
		} : void 0;
		const subagentRaw = entry.subagent;
		const subagent = subagentRaw && typeof subagentRaw === "object" && !Array.isArray(subagentRaw) ? {
			allowModelOverride: subagentRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(subagentRaw.allowedModels),
			allowedModels: Array.isArray(subagentRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(subagentRaw.allowedModels) : void 0
		} : void 0;
		const normalizedSubagent = subagent && (typeof subagent.allowModelOverride === "boolean" || subagent.hasAllowedModelsConfig || Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0) ? {
			...typeof subagent.allowModelOverride === "boolean" ? { allowModelOverride: subagent.allowModelOverride } : {},
			...subagent.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(subagent.allowedModels) && subagent.allowedModels.length > 0 ? { allowedModels: subagent.allowedModels } : {}
		} : void 0;
		const llmRaw = entry.llm;
		const llm = llmRaw && typeof llmRaw === "object" && !Array.isArray(llmRaw) ? {
			allowModelOverride: llmRaw.allowModelOverride,
			hasAllowedModelsConfig: Array.isArray(llmRaw.allowedModels),
			allowedModels: Array.isArray(llmRaw.allowedModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedModels) : void 0,
			hasAllowedCompletionModelsConfig: Array.isArray(llmRaw.allowedCompletionModels),
			allowedCompletionModels: Array.isArray(llmRaw.allowedCompletionModels) ? normalizeArrayBackedTrimmedStringList(llmRaw.allowedCompletionModels) : void 0,
			allowAuthProfileOverride: llmRaw.allowAuthProfileOverride,
			allowAgentIdOverride: llmRaw.allowAgentIdOverride
		} : void 0;
		const normalizedLlm = llm && (typeof llm.allowModelOverride === "boolean" || llm.hasAllowedModelsConfig || Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 || llm.hasAllowedCompletionModelsConfig || Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 || typeof llm.allowAuthProfileOverride === "boolean" || typeof llm.allowAgentIdOverride === "boolean") ? {
			...typeof llm.allowModelOverride === "boolean" ? { allowModelOverride: llm.allowModelOverride } : {},
			...llm.hasAllowedModelsConfig ? { hasAllowedModelsConfig: true } : {},
			...Array.isArray(llm.allowedModels) && llm.allowedModels.length > 0 ? { allowedModels: llm.allowedModels } : {},
			...llm.hasAllowedCompletionModelsConfig ? { hasAllowedCompletionModelsConfig: true } : {},
			...Array.isArray(llm.allowedCompletionModels) && llm.allowedCompletionModels.length > 0 ? { allowedCompletionModels: llm.allowedCompletionModels } : {},
			...typeof llm.allowAuthProfileOverride === "boolean" ? { allowAuthProfileOverride: llm.allowAuthProfileOverride } : {},
			...typeof llm.allowAgentIdOverride === "boolean" ? { allowAgentIdOverride: llm.allowAgentIdOverride } : {}
		} : void 0;
		normalized[normalizedKey] = {
			...normalized[normalizedKey],
			enabled: typeof entry.enabled === "boolean" ? entry.enabled : normalized[normalizedKey]?.enabled,
			hooks: normalizedHooks ?? normalized[normalizedKey]?.hooks,
			subagent: normalizedSubagent ?? normalized[normalizedKey]?.subagent,
			llm: normalizedLlm ?? normalized[normalizedKey]?.llm,
			config: "config" in entry ? entry.config : normalized[normalizedKey]?.config
		};
	}
	return normalized;
}
/** Normalizes plugin config while allowing callers to resolve aliases first. */
function normalizePluginsConfigWithResolverCore(config, normalizePluginId = identityNormalizePluginId) {
	const memorySlot = resolveSlotSelection("memory", config?.slots?.memory);
	return {
		enabled: config?.enabled !== false,
		allow: normalizeList(config?.allow, normalizePluginId),
		deny: normalizeList(config?.deny, normalizePluginId),
		loadPaths: normalizeList(config?.load?.paths, identityNormalizePluginId),
		slots: {
			memory: memorySlot.kind === "off" ? null : memorySlot.pluginId,
			contextEngine: normalizeSlotValue(config?.slots?.contextEngine)
		},
		entries: normalizePluginEntries(config?.entries, normalizePluginId)
	};
}
function isBundledChannelEnabledByChannelConfig(cfg, pluginId) {
	if (!cfg) return false;
	const channelId = normalizeChatChannelId(pluginId);
	if (!channelId) return false;
	const entry = cfg.channels?.[channelId];
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	return entry.enabled === true;
}
//#endregion
//#region src/plugins/config-activation-shared.ts
const PLUGIN_ACTIVATION_REASON_BY_CAUSE = {
	"enabled-in-config": "enabled in config",
	"bundled-channel-enabled-in-config": "channel enabled in config",
	"selected-memory-slot": "selected memory slot",
	"selected-context-engine-slot": "selected context engine slot",
	"selected-in-allowlist": "selected in allowlist",
	"plugins-disabled": "plugins disabled",
	"blocked-by-denylist": "blocked by denylist",
	"disabled-in-config": "disabled in config",
	"workspace-disabled-by-default": "workspace plugin (disabled by default)",
	"not-in-allowlist": "not in allowlist",
	"enabled-by-effective-config": "enabled by effective config",
	"bundled-channel-configured": "channel configured",
	"bundled-default-enablement": "bundled default enablement",
	"bundled-disabled-by-default": "bundled (disabled by default)"
};
function resolvePluginActivationReason(cause, reason) {
	if (reason) return reason;
	return cause ? PLUGIN_ACTIVATION_REASON_BY_CAUSE[cause] : void 0;
}
function toPluginActivationState(decision) {
	return {
		enabled: decision.enabled,
		activated: decision.activated,
		explicitlyEnabled: decision.explicitlyEnabled,
		source: decision.source,
		reason: resolvePluginActivationReason(decision.cause, decision.reason)
	};
}
function resolveExplicitPluginSelectionShared(params) {
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.entries[policyId]?.enabled === true) return {
		explicitlyEnabled: true,
		cause: "enabled-in-config"
	};
	if (params.origin === "bundled" && params.isBundledChannelEnabledByChannelConfig(params.rootConfig, params.id)) return {
		explicitlyEnabled: true,
		cause: "bundled-channel-enabled-in-config"
	};
	if (params.config.slots.memory === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-memory-slot"
	};
	if (params.config.slots.contextEngine === params.id) return {
		explicitlyEnabled: true,
		cause: "selected-context-engine-slot"
	};
	if (params.origin !== "bundled" && params.config.allow.includes(policyId)) return {
		explicitlyEnabled: true,
		cause: "selected-in-allowlist"
	};
	return { explicitlyEnabled: false };
}
function resolvePluginActivationDecisionShared(params) {
	const activationSource = params.activationSource ?? {
		plugins: params.config,
		rootConfig: params.rootConfig
	};
	const explicitSelection = resolveExplicitPluginSelectionShared({
		id: params.id,
		origin: params.origin,
		config: activationSource.plugins,
		rootConfig: activationSource.rootConfig,
		isBundledChannelEnabledByChannelConfig: params.isBundledChannelEnabledByChannelConfig
	});
	if (!params.config.enabled) return {
		enabled: false,
		activated: false,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "disabled",
		cause: "plugins-disabled"
	};
	const policyId = normalizePluginPolicyId(params.id);
	if (params.config.deny.includes(policyId)) return {
		enabled: false,
		activated: false,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "disabled",
		cause: "blocked-by-denylist"
	};
	const entry = params.config.entries[policyId];
	if (entry?.enabled === false) return {
		enabled: false,
		activated: false,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "disabled",
		cause: "disabled-in-config"
	};
	const explicitlyAllowed = params.config.allow.includes(policyId);
	if (params.origin === "workspace" && !explicitlyAllowed && entry?.enabled !== true && explicitSelection.cause !== "selected-context-engine-slot") return {
		enabled: false,
		activated: false,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "disabled",
		cause: "workspace-disabled-by-default"
	};
	if (params.config.slots.memory === params.id) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: true,
		source: "explicit",
		cause: "selected-memory-slot"
	};
	if (params.config.slots.contextEngine === params.id) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: true,
		source: "explicit",
		cause: "selected-context-engine-slot"
	};
	if (params.allowBundledChannelExplicitBypassesAllowlist === true && explicitSelection.cause === "bundled-channel-enabled-in-config") return {
		enabled: true,
		activated: true,
		explicitlyEnabled: true,
		source: "explicit",
		cause: explicitSelection.cause
	};
	if (params.config.allow.length > 0 && !explicitlyAllowed) return {
		enabled: false,
		activated: false,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "disabled",
		cause: "not-in-allowlist"
	};
	if (explicitSelection.explicitlyEnabled) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: true,
		source: "explicit",
		cause: explicitSelection.cause
	};
	if (params.autoEnabledReason) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		reason: params.autoEnabledReason
	};
	if (entry?.enabled === true) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		cause: "enabled-by-effective-config"
	};
	if (params.origin === "bundled" && params.isBundledChannelEnabledByChannelConfig(params.rootConfig, params.id)) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "auto",
		cause: "bundled-channel-configured"
	};
	if (params.origin === "bundled" && params.enabledByDefault === true) return {
		enabled: true,
		activated: true,
		explicitlyEnabled: false,
		source: "default",
		cause: "bundled-default-enablement"
	};
	if (params.origin === "bundled") return {
		enabled: false,
		activated: false,
		explicitlyEnabled: false,
		source: "disabled",
		cause: "bundled-disabled-by-default"
	};
	return {
		enabled: true,
		activated: true,
		explicitlyEnabled: explicitSelection.explicitlyEnabled,
		source: "default"
	};
}
function toEnableStateResult(state) {
	return state.enabled ? { enabled: true } : {
		enabled: false,
		reason: state.reason
	};
}
function resolveEnableStateResult(params, resolveState) {
	return toEnableStateResult(resolveState(params));
}
function createPluginEnableStateResolver(resolveState) {
	return (id, origin, config, enabledByDefault) => resolveEnableStateResult({
		id,
		origin,
		config,
		enabledByDefault
	}, resolveState);
}
function createEffectiveEnableStateResolver(resolveState) {
	return (params) => resolveEnableStateResult(params, resolveState);
}
function hasKind(kind, target) {
	if (!kind) return false;
	return Array.isArray(kind) ? kind.includes(target) : kind === target;
}
function resolveMemorySlotDecisionShared(params) {
	if (!hasKind(params.kind, "memory")) return { enabled: true };
	const isMultiKind = Array.isArray(params.kind) && params.kind.length > 1;
	if (params.slot === null) return isMultiKind ? { enabled: true } : {
		enabled: false,
		reason: "memory slot disabled"
	};
	if (typeof params.slot === "string") {
		if (params.slot === params.id) return {
			enabled: true,
			selected: true
		};
		return isMultiKind ? { enabled: true } : {
			enabled: false,
			reason: `memory slot set to "${params.slot}"`
		};
	}
	if (params.selectedId && params.selectedId !== params.id) return isMultiKind ? { enabled: true } : {
		enabled: false,
		reason: `memory slot already filled by "${params.selectedId}"`
	};
	return {
		enabled: true,
		selected: true
	};
}
//#endregion
export { toPluginActivationState as a, normalizePluginsConfigWithResolverCore as c, resolvePluginActivationDecisionShared as i, createPluginEnableStateResolver as n, identityNormalizePluginId as o, resolveMemorySlotDecisionShared as r, isBundledChannelEnabledByChannelConfig as s, createEffectiveEnableStateResolver as t };
