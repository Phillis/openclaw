import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, f as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { i as getPreparedModelRuntimeAuthStore } from "./prepared-model-runtime-auth-CnrySjUa.js";
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
export { resolvePublishedModelCatalogOwner as n, publishedModelCatalogOwnerMatchesAgent as t };
