import { a as isPathInside } from "./path-D138yf8v.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import "./path-guards-CQoZeoCG.js";
import "./utils-Bw16L5tB.js";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-DDLrDh1C.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
//#region src/agents/agent-dir-registry.ts
/** Process-local reverse registry from prepared agent directories to agent ids. */
const agentIdsByDir = /* @__PURE__ */ new Map();
function normalizeAgentDirRegistryPath(agentDir, env = process.env) {
	return resolveIdentityPathViaExistingAncestorSync(resolveUserPath(agentDir, env));
}
/** Register a resolved agent directory for later reverse lookup. */
function registerResolvedAgentDir(params) {
	const key = normalizeAgentDirRegistryPath(params.agentDir, params.env);
	const agentIds = agentIdsByDir.get(key) ?? /* @__PURE__ */ new Set();
	agentIds.add(normalizeAgentId(params.agentId));
	agentIdsByDir.set(key, agentIds);
}
/** Remove a reverse lookup only while it still belongs to the expected agent. */
function unregisterResolvedAgentDir(params) {
	const key = normalizeAgentDirRegistryPath(params.agentDir, params.env);
	const agentIds = agentIdsByDir.get(key);
	if (!agentIds?.delete(normalizeAgentId(params.agentId))) return false;
	if (agentIds.size === 0) agentIdsByDir.delete(key);
	return true;
}
/** Resolve the agent id previously registered for an agent directory. */
function resolveRegisteredAgentIdForDir(agentDir, env) {
	const agentIds = agentIdsByDir.get(normalizeAgentDirRegistryPath(agentDir, env));
	return agentIds?.size === 1 ? agentIds.values().next().value : void 0;
}
/** Whether a path overlaps a directory currently owned by another agent. */
function isPathOwnedByAnotherRegisteredAgent(params) {
	const pathname = normalizeAgentDirRegistryPath(params.pathname, params.env);
	const agentId = normalizeAgentId(params.agentId);
	for (const [registeredDir, ownerIds] of agentIdsByDir) if ([...ownerIds].some((ownerId) => ownerId !== agentId) && (registeredDir === pathname || isPathInside(registeredDir, pathname) || isPathInside(pathname, registeredDir))) return true;
	return false;
}
//#endregion
export { unregisterResolvedAgentDir as a, resolveRegisteredAgentIdForDir as i, normalizeAgentDirRegistryPath as n, registerResolvedAgentDir as r, isPathOwnedByAnotherRegisteredAgent as t };
