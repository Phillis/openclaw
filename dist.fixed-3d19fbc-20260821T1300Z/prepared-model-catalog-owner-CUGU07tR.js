import "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
//#region src/agents/prepared-model-runtime-auth.ts
/** Private auth facts owned by an immutable prepared model generation. */
const authStoreBySnapshot = /* @__PURE__ */ new WeakMap();
const materializationsBySnapshot = /* @__PURE__ */ new WeakMap();
const authLoaderBySnapshot = /* @__PURE__ */ new WeakMap();
function setPreparedModelRuntimeAuthStore(snapshot, authStore) {
	authStoreBySnapshot.set(snapshot, authStore);
}
function getPreparedModelRuntimeAuthStore(snapshot) {
	return authStoreBySnapshot.get(snapshot);
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
//#endregion
//#region src/agents/prepared-model-catalog-owner.ts
var PublishedModelCatalogOwnerResolutionError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "PublishedModelCatalogOwnerResolutionError";
	}
};
function resolvePublishedModelCatalogOwner(snapshot) {
	const configuredAgentIds = listAgentIds(snapshot.config);
	const directoryAgentIds = configuredAgentIds.filter((candidate) => resolveAgentDir(snapshot.config, candidate) === snapshot.agentDir);
	const agentId = snapshot.agentId ? configuredAgentIds.find((candidate) => normalizeAgentId(candidate) === normalizeAgentId(snapshot.agentId)) : directoryAgentIds.length === 1 ? directoryAgentIds[0] : void 0;
	if (!agentId || resolveAgentDir(snapshot.config, agentId) !== snapshot.agentDir) throw new PublishedModelCatalogOwnerResolutionError(`published model catalog owner did not identify one configured agent (${snapshot.agentDir})`);
	const workspaceDir = snapshot.workspaceDir ?? resolveAgentWorkspaceDir(snapshot.config, agentId);
	if (!workspaceDir) throw new PublishedModelCatalogOwnerResolutionError(`published model catalog owner did not identify a workspace (${agentId})`);
	const authStore = snapshot.authStore ?? getPreparedModelRuntimeAuthStore(snapshot);
	if (!authStore) throw new PublishedModelCatalogOwnerResolutionError(`published model catalog owner is missing prepared auth state (${agentId})`);
	return Object.freeze({
		agentId,
		agentDir: snapshot.agentDir,
		workspaceDir,
		config: snapshot.config,
		authModes: snapshot.authModes,
		authStore,
		metadataSnapshot: snapshot.metadataSnapshot,
		modelCatalog: snapshot.modelCatalog
	});
}
function publishedModelCatalogOwnerMatchesAgent(owner, agentId) {
	return owner.agentId === normalizeAgentId(agentId);
}
//#endregion
export { setPreparedModelRuntimeAuthLoader as a, loadPreparedModelRuntimeAuth as i, resolvePublishedModelCatalogOwner as n, setPreparedModelRuntimeAuthMaterializations as o, getPreparedModelRuntimeAuthMaterializations as r, setPreparedModelRuntimeAuthStore as s, publishedModelCatalogOwnerMatchesAgent as t };
