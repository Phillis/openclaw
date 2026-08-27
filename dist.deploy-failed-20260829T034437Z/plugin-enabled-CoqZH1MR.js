import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import "./paths-BTm4vYfz.js";
//#region extensions/browser/src/plugin-enabled.ts
/** Returns whether the bundled Browser plugin is effectively enabled by config. */
function isDefaultBrowserPluginEnabled(cfg) {
	return resolveEffectiveEnableState({
		id: "browser",
		origin: "bundled",
		config: normalizePluginsConfig(cfg.plugins),
		rootConfig: cfg,
		enabledByDefault: true
	}).enabled;
}
//#endregion
export { isDefaultBrowserPluginEnabled as t };
