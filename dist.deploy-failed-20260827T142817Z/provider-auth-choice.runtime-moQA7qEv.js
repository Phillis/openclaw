import { r as resolvePluginSetupProviderCore } from "./setup-registry-CN-wV6fv.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-CAakL3j-.js";
import { n as resolveProviderPluginChoiceCore, r as runProviderModelSelectedHookCore } from "./provider-wizard-D4HexxKj.js";
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
