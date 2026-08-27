import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.js";
import { a as isPathInside } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { d as resolveAgentWorkspaceDir, r as listAgentEntries } from "./agent-scope-config-BdXMWufB.js";
import { C as isSameOpenClawAgentDatabasePath } from "./openclaw-agent-db-maintenance-1xIPEKIN.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/agent-delete-safety.ts
/** Safety checks for deleting agents whose workspaces may overlap other agents. */
/** True when deleting this agent database would remove the legacy shared auth store. */
function isSharedAuthStoreOwner(params) {
	return params.ownership.location === "legacy-main" && isSameOpenClawAgentDatabasePath(params.agentAuthDbPath, params.sharedAuthDbPath);
}
function formatSharedAuthStoreOwnerDeleteError(agentId) {
	return `Agent "${agentId}" owns the legacy shared auth store and cannot be deleted. Run openclaw doctor --fix to migrate shared auth, then retry.`;
}
function normalizeWorkspacePathForComparison(input) {
	const resolved = path.resolve(input.replaceAll("\0", ""));
	let normalized = resolved;
	try {
		normalized = fs.realpathSync.native(resolved);
	} catch {}
	if (process.platform === "win32") return lowercasePreservingWhitespace(normalized);
	return normalized;
}
function workspacePathsOverlap(left, right) {
	const normalizedLeft = normalizeWorkspacePathForComparison(left);
	const normalizedRight = normalizeWorkspacePathForComparison(right);
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
export { formatSharedAuthStoreOwnerDeleteError as n, isSharedAuthStoreOwner as r, findOverlappingWorkspaceAgentIds as t };
