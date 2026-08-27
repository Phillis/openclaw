import { d as resolveOwningPluginIdsForProviderRef } from "./providers-CEVEnHVm.js";
import { n as resolvePluginProvidersCore } from "./providers.runtime-C8b4yFIJ.js";
import { n as resolveProviderPluginChoiceCore } from "./provider-wizard-DkMSWHUJ.js";
//#region src/commands/onboard-non-interactive/local/auth-choice.plugin-providers.runtime.ts
/**
* Runtime-only provider plugin helpers for non-interactive onboarding.
*
* Kept behind a lazy boundary so ordinary local setup can infer core auth
* choices without loading plugin provider discovery.
*/
/** Provider discovery surface used by non-interactive auth-choice handling. */
const authChoicePluginProvidersRuntime = {
	resolveOwningPluginIdsForProviderRef,
	resolveProviderPluginChoice: resolveProviderPluginChoiceCore,
	resolvePluginProviders: resolvePluginProvidersCore
};
//#endregion
export { authChoicePluginProvidersRuntime };
