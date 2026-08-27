import { g as getActivePluginSessionExtensionRegistry } from "./runtime-g0R28Sy0.js";
//#region src/plugins/session-catalog-active.ts
/**
* Read-only list/read facade over the active registered session catalogs.
* Deliberately excludes continue/archive/terminal so consumers cannot gain
* session control through this seam; mutation stays on the gateway RPCs.
*/
function listActiveSessionCatalogs() {
	return (getActivePluginSessionExtensionRegistry()?.sessionCatalogs ?? []).map(({ pluginId, provider }) => ({
		pluginId,
		id: provider.id,
		label: provider.label,
		list: provider.list.bind(provider),
		read: provider.read.bind(provider)
	})).toSorted((left, right) => left.id.localeCompare(right.id));
}
//#endregion
export { listActiveSessionCatalogs as t };
