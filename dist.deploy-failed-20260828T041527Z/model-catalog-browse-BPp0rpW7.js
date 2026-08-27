import { F as resolveTimerTimeoutMs, m as clampTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { p as parseConfiguredModelVisibilityEntries, r as buildConfiguredModelCatalog } from "./model-selection-shared-DbjoXfPH.js";
//#region src/agents/model-catalog-browse.ts
/**
* Loads model catalog views for browse/search UI surfaces.
*/
/**
* Loads the model catalog shape used by browse/list commands without letting optional
* provider discovery stall the CLI path.
*/
const DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS = 750;
/** Source-authored provider rows for inventory UIs, independent of picker allowlists. */
function buildProviderConfigModelCatalogForBrowse(params) {
	return buildConfiguredModelCatalog(params).toSorted((a, b) => a.provider.localeCompare(b.provider) || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
}
/** True when a browse view requires the full published catalog generation. */
function modelCatalogBrowseRequiresFullDiscovery(params) {
	const view = params.view ?? "default";
	if (view === "all") return true;
	const visibility = parseConfiguredModelVisibilityEntries({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (visibility.providerWildcards.size === 0) return false;
	if (visibility.configPath === "agents.defaults.models") return view === "configured";
	return true;
}
function resolveModelCatalogBrowseTimeoutMs(value) {
	return clampTimerTimeoutMs(value, 1) ?? resolveTimerTimeoutMs(DEFAULT_MODEL_CATALOG_BROWSE_TIMEOUT_MS, 1);
}
/** Loads an explicit logical/physical catalog snapshot for route-aware browse surfaces. */
async function loadPreparedModelCatalogSnapshotForBrowse(params) {
	const view = params.view ?? "default";
	const requiresFullDiscovery = params.preparedOnly !== true && modelCatalogBrowseRequiresFullDiscovery({
		cfg: params.cfg,
		agentId: params.agentId,
		view
	});
	const shouldTimeoutFullDiscovery = params.timeoutFullDiscovery === true || params.refresh !== true && requiresFullDiscovery && (view === "default" || view === "provider-config");
	const catalogPromise = params.loadCatalog({
		readOnly: !requiresFullDiscovery,
		...requiresFullDiscovery && params.refresh ? { refresh: true } : {}
	});
	if ((requiresFullDiscovery || params.refresh === true) && !shouldTimeoutFullDiscovery) return await catalogPromise;
	let timeout;
	const timeoutMs = resolveModelCatalogBrowseTimeoutMs(params.timeoutMs);
	const catalogResult = catalogPromise.then((value) => ({
		kind: "catalog",
		value
	}));
	const timeoutPromise = new Promise((resolve) => {
		timeout = globalThis.setTimeout(() => resolve({ kind: "timeout" }), timeoutMs);
		timeout.unref?.();
	});
	try {
		const result = await Promise.race([catalogResult, timeoutPromise]);
		if (result.kind === "timeout") {
			catalogPromise.catch(() => void 0);
			params.onTimeout?.(timeoutMs);
			return {
				entries: [],
				routeVariants: []
			};
		}
		return result.value;
	} finally {
		if (timeout) globalThis.clearTimeout(timeout);
	}
}
//#endregion
export { loadPreparedModelCatalogSnapshotForBrowse as n, modelCatalogBrowseRequiresFullDiscovery as r, buildProviderConfigModelCatalogForBrowse as t };
