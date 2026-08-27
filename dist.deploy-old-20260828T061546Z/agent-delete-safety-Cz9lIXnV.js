import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-CQoZeoCG.js";
import "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { f as resolveAgentWorkspaceDir, r as listAgentEntries } from "./agent-scope-config-CUBiGmG3.js";
import { n as resolveCanonicalWorkspacePath } from "./workspace-state-identity-CMp50RGy.js";
import { i as resolveSharedAuthStoreOwnership } from "./path-resolve-Bjd7UUgA.js";
import { i as resolveLegacyInheritedAuthAgentId } from "./legacy-inherited-auth-dir-DCEipwnb.js";
import { j as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
//#region src/agents/agent-delete-safety.ts
/** True when deleting this agent database would remove the legacy shared auth store. */
function isSharedAuthStoreOwner(params) {
	return params.ownership.location === "legacy-main" && isSameOpenClawAgentDatabasePath(params.agentAuthDbPath, params.sharedAuthDbPath);
}
function formatSharedAuthStoreOwnerDeleteError(agentId) {
	return `Agent "${agentId}" owns the legacy shared auth store and cannot be deleted. Run openclaw doctor --fix to migrate shared auth, then retry.`;
}
function isInheritedAuthStoreOwner(cfg, agentId) {
	if (!cfg.agents?.defaults?.authInheritance?.agentId?.trim() && resolveSharedAuthStoreOwnership().location !== "legacy-main") return false;
	return agentId === normalizeAgentId(resolveLegacyInheritedAuthAgentId(cfg));
}
function workspacePathsOverlap(left, right) {
	const normalizedLeft = resolveCanonicalWorkspacePath(left.replaceAll("\0", ""));
	const normalizedRight = resolveCanonicalWorkspacePath(right.replaceAll("\0", ""));
	return isPathInside(normalizedRight, normalizedLeft) || isPathInside(normalizedLeft, normalizedRight);
}
/** Lists other agents whose workspaces overlap a candidate delete target. */
function findOverlappingWorkspaceAgentIds(cfg, agentId, workspaceDir) {
	const entries = listAgentEntries(cfg);
	const normalizedAgentId = normalizeAgentId(agentId);
	const overlappingAgentIds = [];
	for (const entry of entries) {
		const otherAgentId = normalizeAgentId(entry.id);
		if (otherAgentId === normalizedAgentId) continue;
		if (workspacePathsOverlap(workspaceDir, resolveAgentWorkspaceDir(cfg, otherAgentId))) overlappingAgentIds.push(otherAgentId);
	}
	return overlappingAgentIds;
}
//#endregion
export { isSharedAuthStoreOwner as i, formatSharedAuthStoreOwnerDeleteError as n, isInheritedAuthStoreOwner as r, findOverlappingWorkspaceAgentIds as t };
