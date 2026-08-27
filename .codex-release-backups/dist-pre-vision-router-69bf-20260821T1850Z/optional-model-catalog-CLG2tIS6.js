//#region src/gateway/server-methods/optional-model-catalog.ts
/**
* Optional model-catalog loader for methods where metadata improves the result
* but should never block the primary session response path.
*/
const DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS = 750;
const loggedSlowCatalogKeys = /* @__PURE__ */ new Set();
/** Reads already-published startup facts without starting provider discovery on an RPC hot path. */
async function readPreparedServerMethodModelCatalog(context, options) {
	try {
		return context.readPreparedGatewayModelCatalog ? await context.readPreparedGatewayModelCatalog(options) : void 0;
	} catch {
		return;
	}
}
function normalizeOptionalModelCatalogSnapshot(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const snapshot = value;
	return typeof snapshot.agentDir === "string" && snapshot.config && Array.isArray(snapshot.entries) && Array.isArray(snapshot.routeVariants) ? snapshot : void 0;
}
function startOptionalServerMethodModelCatalogValueLoad(params) {
	let catalogPromise;
	try {
		catalogPromise = params.load();
	} catch {
		catalogPromise = Promise.resolve(void 0);
	}
	return { promise: catalogPromise.then(params.normalize, () => void 0) };
}
function startOptionalServerMethodModelCatalogSnapshotLoad(context, loadParams) {
	return startOptionalServerMethodModelCatalogValueLoad({
		load: () => context.loadGatewayModelCatalogSnapshot(loadParams),
		normalize: normalizeOptionalModelCatalogSnapshot
	});
}
async function loadOptionalServerMethodModelCatalogValue(context, surface, options, startLoad) {
	let timeout;
	const timedOut = Symbol("server-method-model-catalog-timeout");
	const timeoutMs = options?.timeoutMs ?? DEFAULT_OPTIONAL_MODEL_CATALOG_TIMEOUT_MS;
	const catalogLoad = options?.startedLoad ?? startLoad();
	const timeoutPromise = new Promise((resolve) => {
		timeout = setTimeout(() => resolve(timedOut), timeoutMs);
		timeout.unref?.();
	});
	try {
		const result = await Promise.race([catalogLoad.promise, timeoutPromise]);
		if (result === timedOut) {
			const logOnceKey = options?.logOnceKey ?? "session-metadata";
			if (!loggedSlowCatalogKeys.has(logOnceKey)) {
				loggedSlowCatalogKeys.add(logOnceKey);
				context.logGateway.debug(`${surface} continuing without model catalog after ${timeoutMs}ms`);
			}
			return;
		}
		return result;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
/** Loads the full gateway model catalog snapshot without blocking the primary response path. */
async function loadOptionalServerMethodModelCatalogSnapshot(context, surface, options) {
	return await loadOptionalServerMethodModelCatalogValue(context, surface, options, () => startOptionalServerMethodModelCatalogSnapshotLoad(context, options?.loadParams));
}
//#endregion
export { readPreparedServerMethodModelCatalog as n, startOptionalServerMethodModelCatalogSnapshotLoad as r, loadOptionalServerMethodModelCatalogSnapshot as t };
