import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as defaultSlotIdForKey } from "./slots-BTFPUFBt.js";
import { a as toPluginActivationState, c as normalizePluginsConfigWithResolverCore, i as resolvePluginActivationDecisionShared, n as createPluginEnableStateResolver, r as resolveMemorySlotDecisionShared, s as isBundledChannelEnabledByChannelConfig, t as createEffectiveEnableStateResolver } from "./config-activation-shared-CdWoIbbr.js";
//#region src/plugins/config-state.ts
/** Normalizes plugin config and resolves effective enablement, slots, and activation sources. */
const BUILT_IN_PLUGIN_ALIAS_FALLBACKS = [
	["google-gemini-cli", "google"],
	["minimax-portal", "minimax"],
	["minimax-portal-auth", "minimax"]
];
const BUILT_IN_PLUGIN_ALIAS_LOOKUP = new Map([...BUILT_IN_PLUGIN_ALIAS_FALLBACKS, ...BUILT_IN_PLUGIN_ALIAS_FALLBACKS.map(([, pluginId]) => [pluginId, pluginId])]);
function getBundledPluginAliasLookup() {
	const lookup = /* @__PURE__ */ new Map();
	for (const [alias, pluginId] of BUILT_IN_PLUGIN_ALIAS_FALLBACKS) lookup.set(alias, pluginId);
	return lookup;
}
function normalizePluginIdWithLookup(id, getAliasLookup) {
	const normalized = normalizeOptionalLowercaseString(normalizeOptionalString(id) ?? "") ?? "";
	const builtInAlias = BUILT_IN_PLUGIN_ALIAS_LOOKUP.get(normalized);
	if (builtInAlias) return builtInAlias;
	return getAliasLookup().get(normalized) ?? normalized;
}
function createScopedPluginIdNormalizer() {
	let lookup;
	return (id) => normalizePluginIdWithLookup(id, () => {
		lookup ??= getBundledPluginAliasLookup();
		return lookup;
	});
}
/** Normalizes user/config plugin ids into the canonical lowercase key form. */
function normalizePluginId(id) {
	return normalizePluginIdWithLookup(id, getBundledPluginAliasLookup);
}
const normalizePluginsConfig = (config) => {
	return normalizePluginsConfigWithResolverCore(config, createScopedPluginIdNormalizer());
};
/** Resolves the enabled plugin selected to own the context-engine slot. */
function resolveSelectedContextEnginePluginId(config) {
	const plugins = normalizePluginsConfig(config?.plugins);
	return resolveSelectedContextEnginePluginIdFromConfig(plugins, plugins.slots.contextEngine);
}
function resolveSelectedContextEnginePluginIdFromConfig(plugins, pluginId) {
	if (!plugins.enabled || !pluginId || pluginId === defaultSlotIdForKey("contextEngine") || plugins.deny.includes(pluginId) || plugins.entries[pluginId]?.enabled === false) return;
	return pluginId;
}
/** Canonicalizes one plugin entry and its policy-list ids before a targeted mutation. */
function normalizePluginTargetConfig(config, pluginId) {
	const normalizedId = normalizePluginId(pluginId);
	const normalized = normalizePluginsConfig(config.plugins);
	const rawEntries = config.plugins?.entries ?? {};
	const hasTargetEntry = Object.keys(rawEntries).some((entryId) => normalizePluginId(entryId) === normalizedId);
	const entries = Object.fromEntries(Object.entries(rawEntries).filter(([entryId]) => normalizePluginId(entryId) !== normalizedId));
	if (hasTargetEntry) {
		const { config: pluginConfig, ...entry } = normalized.entries[normalizedId] ?? {};
		entries[normalizedId] = {
			...entry,
			...isRecord(pluginConfig) ? { config: pluginConfig } : {}
		};
	}
	return {
		...config,
		plugins: {
			...config.plugins,
			...Array.isArray(config.plugins?.allow) ? { allow: normalized.allow } : {},
			...Array.isArray(config.plugins?.deny) ? { deny: normalized.deny } : {},
			entries
		}
	};
}
function createPluginActivationSource(params) {
	return {
		plugins: params.plugins ?? normalizePluginsConfig(params.config?.plugins),
		rootConfig: params.config
	};
}
const hasExplicitMemorySlot = (plugins) => Boolean(plugins?.slots && Object.hasOwn(plugins.slots, "memory"));
const hasExplicitMemoryEntry = (plugins) => Boolean(plugins?.entries && Object.hasOwn(plugins.entries, defaultSlotIdForKey("memory")));
function hasExplicitPluginConfig(plugins) {
	if (!plugins) return false;
	if (typeof plugins.enabled === "boolean") return true;
	if (Array.isArray(plugins.allow) && plugins.allow.length > 0) return true;
	if (Array.isArray(plugins.deny) && plugins.deny.length > 0) return true;
	if (plugins.load?.paths && Array.isArray(plugins.load.paths) && plugins.load.paths.length > 0) return true;
	if (plugins.slots && Object.keys(plugins.slots).length > 0) return true;
	if (plugins.entries && Object.keys(plugins.entries).length > 0) return true;
	return false;
}
function applyTestPluginDefaults(cfg, env = process.env) {
	if (!env.VITEST) return cfg;
	const plugins = cfg.plugins;
	if (hasExplicitPluginConfig(plugins)) {
		if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return cfg;
		return {
			...cfg,
			plugins: {
				...plugins,
				slots: {
					...plugins?.slots,
					memory: "none"
				}
			}
		};
	}
	return {
		...cfg,
		plugins: {
			...plugins,
			enabled: false,
			slots: {
				...plugins?.slots,
				memory: "none"
			}
		}
	};
}
function isTestDefaultMemorySlotDisabled(cfg, env = process.env) {
	if (!env.VITEST) return false;
	const plugins = cfg.plugins;
	if (hasExplicitMemorySlot(plugins) || hasExplicitMemoryEntry(plugins)) return false;
	return true;
}
function resolvePluginActivationState(params) {
	return toPluginActivationState(resolvePluginActivationDecisionShared({
		...params,
		activationSource: params.activationSource ?? createPluginActivationSource({
			config: params.rootConfig,
			plugins: params.config
		}),
		allowBundledChannelExplicitBypassesAllowlist: true,
		isBundledChannelEnabledByChannelConfig
	}));
}
const resolveEnableState = createPluginEnableStateResolver(resolvePluginActivationState);
const resolveEffectiveEnableState = createEffectiveEnableStateResolver(resolveEffectivePluginActivationState);
function resolveEffectivePluginActivationState(params) {
	return resolvePluginActivationState(params);
}
function resolveMemorySlotDecision(params) {
	return resolveMemorySlotDecisionShared(params);
}
//#endregion
export { normalizePluginId as a, resolveEffectiveEnableState as c, resolveMemorySlotDecision as d, resolvePluginActivationState as f, isTestDefaultMemorySlotDisabled as i, resolveEffectivePluginActivationState as l, resolveSelectedContextEnginePluginIdFromConfig as m, createPluginActivationSource as n, normalizePluginTargetConfig as o, resolveSelectedContextEnginePluginId as p, hasExplicitPluginConfig as r, normalizePluginsConfig as s, applyTestPluginDefaults as t, resolveEnableState as u };
