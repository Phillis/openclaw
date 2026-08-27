//#region src/agents/prepared-model-runtime-auth.ts
/** Private auth facts owned by an immutable prepared model generation. */
const authStoreBySnapshot = /* @__PURE__ */ new WeakMap();
const materializationsBySnapshot = /* @__PURE__ */ new WeakMap();
const authLoaderBySnapshot = /* @__PURE__ */ new WeakMap();
const authByFullCatalog = /* @__PURE__ */ new WeakMap();
function setPreparedModelRuntimeAuthStore(snapshot, authStore) {
	authStoreBySnapshot.set(snapshot, authStore);
}
function getPreparedModelRuntimeAuthStore(snapshot) {
	return authStoreBySnapshot.get(snapshot);
}
function setPreparedModelFullCatalogAuth(snapshot, auth) {
	authByFullCatalog.set(snapshot, auth);
}
function getPreparedModelFullCatalogAuth(snapshot) {
	return authByFullCatalog.get(snapshot);
}
function setPreparedModelRuntimeAuthLoader(snapshot, loader) {
	authLoaderBySnapshot.set(snapshot, loader);
}
async function loadPreparedModelRuntimeAuth(snapshot, scope) {
	const loader = authLoaderBySnapshot.get(snapshot);
	if (loader) return await loader(scope);
	const authStore = authStoreBySnapshot.get(snapshot);
	return authStore ? {
		authStore,
		authModes: snapshot.authModes ?? {}
	} : void 0;
}
function setPreparedModelRuntimeAuthMaterializations(snapshot, materializations) {
	materializationsBySnapshot.set(snapshot, materializations);
}
function getPreparedModelRuntimeAuthMaterializations(snapshot) {
	return materializationsBySnapshot.get(snapshot) ?? [];
}
function copyPreparedModelRuntimeAuthBindings(source, target) {
	const authStore = authStoreBySnapshot.get(source);
	const authLoader = authLoaderBySnapshot.get(source);
	const materializations = materializationsBySnapshot.get(source);
	if (authStore) authStoreBySnapshot.set(target, authStore);
	if (authLoader) authLoaderBySnapshot.set(target, authLoader);
	if (materializations) materializationsBySnapshot.set(target, materializations);
}
//#endregion
export { loadPreparedModelRuntimeAuth as a, setPreparedModelRuntimeAuthMaterializations as c, getPreparedModelRuntimeAuthStore as i, setPreparedModelRuntimeAuthStore as l, getPreparedModelFullCatalogAuth as n, setPreparedModelFullCatalogAuth as o, getPreparedModelRuntimeAuthMaterializations as r, setPreparedModelRuntimeAuthLoader as s, copyPreparedModelRuntimeAuthBindings as t };
