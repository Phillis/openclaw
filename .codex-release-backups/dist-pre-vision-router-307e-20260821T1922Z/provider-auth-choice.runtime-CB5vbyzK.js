import { r as resolvePluginSetupProviderCore } from "./setup-registry-DxR0jJ50.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-CS5Zb_4t.js";
import { n as resolveProviderPluginChoiceCore, r as runProviderModelSelectedHookCore } from "./provider-wizard-DCA5KJ94.js";
//#region src/plugins/provider-auth-choice.runtime.ts
/** Runtime wrapper for provider plugin wizard choice resolution. */
function resolveProviderPluginChoice(...args) {
	return resolveProviderPluginChoiceCore(...args);
}
/** Runtime wrapper for provider model-selected hook dispatch. */
function runProviderModelSelectedHook(...args) {
	return runProviderModelSelectedHookCore(...args);
}
/** Runtime wrapper for registered model provider discovery. */
function resolvePluginProviders(...args) {
	return resolvePluginProvidersCore(...args);
}
/** Runtime wrapper for plugin setup-provider discovery. */
function resolvePluginSetupProvider(...args) {
	return resolvePluginSetupProviderCore(...args);
}
//#endregion
export { runProviderModelSelectedHook as i, resolvePluginSetupProvider as n, resolveProviderPluginChoice as r, resolvePluginProviders as t };
