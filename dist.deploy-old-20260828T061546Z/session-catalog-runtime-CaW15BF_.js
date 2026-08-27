import { i as allowsProcessHomeSessionScan } from "./paths-BBSTUjD5.js";
import { g as getActivePluginSessionExtensionRegistry } from "./runtime-B2KAtS3O.js";
//#region src/plugins/session-catalog-active.ts
/**
* Read-only list/read facade over the active registered session catalogs.
* Deliberately excludes continue/archive/terminal so consumers cannot gain
* session control through this seam; mutation stays on the gateway RPCs.
*/
function listActiveSessionCatalogs() {
	const registrations = getActivePluginSessionExtensionRegistry()?.sessionCatalogs ?? [];
	const allowProcessHomeFallback = allowsProcessHomeSessionScan();
	return registrations.map(({ pluginId, provider }) => ({
		pluginId,
		id: provider.id,
		label: provider.label,
		processHomeFallbackAllowed: allowProcessHomeFallback,
		list: (params) => provider.list({
			...params,
			allowProcessHomeFallback
		}),
		read: (params) => provider.read({
			...params,
			allowProcessHomeFallback
		})
	})).toSorted((left, right) => left.id.localeCompare(right.id));
}
//#endregion
export { listActiveSessionCatalogs as t };
