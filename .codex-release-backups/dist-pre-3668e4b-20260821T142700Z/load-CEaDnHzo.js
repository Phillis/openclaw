import { d as getActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
//#region src/channels/plugins/registry-loader.ts
/**
* Creates a lazy loader that resolves one value from the active channel registry.
*/
function createChannelRegistryLoader(resolveValue) {
	return async (id) => {
		const resolveFromRegistry = (registry) => {
			const pluginEntry = registry?.channels.find((entry) => entry.plugin.id === id);
			return pluginEntry ? resolveValue(pluginEntry) : void 0;
		};
		return resolveFromRegistry(getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? getActivePluginRegistry());
	};
}
//#endregion
//#region src/channels/plugins/outbound/load.ts
const loadOutboundAdapterFromRegistry = createChannelRegistryLoader((entry) => entry.plugin.outbound);
async function loadChannelOutboundAdapter(id) {
	return loadOutboundAdapterFromRegistry(id);
}
//#endregion
export { loadChannelOutboundAdapter as t };
