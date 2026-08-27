import { i as normalizeChatChannelId } from "./ids-BDKYF0d6.js";
import { a as normalizePluginId, s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.js";
import { t as setPluginEnabledInConfig } from "./toggle-config-BrKhgG0o.js";
//#region src/plugins/enable.ts
/** Enables a plugin in config unless global, denylist, or allowlist policy blocks it. */
function enablePluginInConfig(cfg, pluginId, options = {}) {
	const resolvedId = normalizePluginId(normalizeChatChannelId(pluginId) ?? pluginId);
	const plugins = normalizePluginsConfig(cfg.plugins);
	if (!plugins.enabled) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "plugins disabled"
	};
	if (plugins.deny.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "blocked by denylist"
	};
	if (plugins.allow.length > 0 && !plugins.allow.includes(resolvedId)) return {
		config: cfg,
		enabled: false,
		pluginId: resolvedId,
		reason: "blocked by allowlist"
	};
	return {
		config: setPluginEnabledInConfig(cfg, resolvedId, true, options),
		enabled: true,
		pluginId: resolvedId
	};
}
/**
* Enables a plugin selected through an explicit user action.
*
* ClickClack is bundled without a separate install trust record, so selecting
* it is the trust gesture that materializes its id in a restrictive allowlist.
*/
function enableExplicitlySelectedPluginInConfig(cfg, pluginId, options = {}) {
	const result = enablePluginInConfig(cfg, pluginId, options);
	if (result.reason !== "blocked by allowlist" || result.pluginId !== "clickclack") return result;
	return enablePluginInConfig(ensurePluginAllowlisted(cfg, result.pluginId), result.pluginId, options);
}
//#endregion
export { enablePluginInConfig as n, enableExplicitlySelectedPluginInConfig as t };
