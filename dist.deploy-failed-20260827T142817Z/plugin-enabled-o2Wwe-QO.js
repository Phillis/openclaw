import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import "./config-CJe40hw8.js";
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
