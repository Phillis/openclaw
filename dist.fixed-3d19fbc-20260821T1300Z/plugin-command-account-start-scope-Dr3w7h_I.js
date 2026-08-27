import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/plugins/plugin-command-account-start-scope.ts
const pluginCommandAccountStartScope = resolveGlobalSingleton(Symbol.for("openclaw.pluginCommandAccountStartScope"), () => new AsyncLocalStorage());
/** Runs one channel account startup lifetime with its catalog-retention owner. */
function withPluginCommandAccountStartScope(scope, run) {
	return pluginCommandAccountStartScope.run(scope, run);
}
/** Marks the current account only when its startup channel matches the catalog provider. */
function retainPluginCommandCatalogForCurrentAccount(channelId) {
	const scope = pluginCommandAccountStartScope.getStore();
	if (scope?.channelId === channelId) scope.retainCatalog();
}
//#endregion
export { withPluginCommandAccountStartScope as n, retainPluginCommandCatalogForCurrentAccount as t };
