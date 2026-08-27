import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, r as listAgentEntries, x as tryResolveSoleAgentId } from "./agent-scope-config-BdXMWufB.js";
//#region src/agents/workspace-dirs.ts
/** Lists unique workspace directories for configured agents and the default agent. */
function listAgentWorkspaceDirs(cfg, env = process.env) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, entry.id, env));
	const soleAgentId = tryResolveSoleAgentId(cfg);
	if (soleAgentId) dirs.add(resolveAgentWorkspaceDir(cfg, soleAgentId, env));
	return [...dirs];
}
/** Lists only entry-authored workspace paths without requiring a valid default marker. */
function listExplicitAgentWorkspaceDirs(cfg) {
	const dirs = /* @__PURE__ */ new Set();
	for (const entry of listAgentEntries(cfg)) {
		const workspace = typeof entry.workspace === "string" ? entry.workspace.trim() : "";
		if (workspace) dirs.add(resolveUserPath(workspace));
	}
	return [...dirs];
}
//#endregion
export { listExplicitAgentWorkspaceDirs as n, listAgentWorkspaceDirs as t };
