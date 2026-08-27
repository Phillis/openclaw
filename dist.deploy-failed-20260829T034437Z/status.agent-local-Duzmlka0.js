import { s as pathExists } from "./absolute-path-CYFPfAjt.js";
import "./fs-safe-CmrQUApq.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "./agent-scope-config-CUBiGmG3.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { o as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-CVc2mOCy.js";
import "./session-accessor-B-FKZX9M.js";
import { t as listGatewayAgentsBasic } from "./agent-list-HVk8EUft.js";
import path from "node:path";
//#region src/commands/status.agent-local.ts
/** Returns per-agent local workspace, bootstrap, session count, and last activity status. */
async function getAgentLocalStatuses(cfg) {
	const agentList = listGatewayAgentsBasic(cfg);
	const now = Date.now();
	const statuses = [];
	for (const agent of agentList.agents) {
		const agentId = agent.id;
		const workspaceDir = (() => {
			try {
				return resolveAgentWorkspaceDir(cfg, agentId);
			} catch {
				return null;
			}
		})();
		const bootstrapPath = workspaceDir != null ? path.join(workspaceDir, "BOOTSTRAP.md") : null;
		const bootstrapPending = bootstrapPath != null ? await pathExists(bootstrapPath) : null;
		const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const sessionsPath = resolveSqliteTargetFromSessionStorePath(storePath, { agentId }).path;
		const sessions = listSessionEntriesReadOnly({
			agentId,
			storePath
		}).filter(({ sessionKey }) => sessionKey !== "global" && sessionKey !== "unknown").map(({ entry }) => entry);
		const sessionsCount = sessions.length;
		const lastUpdatedAt = sessions.reduce((max, e) => Math.max(max, e?.updatedAt ?? 0), 0);
		const resolvedLastUpdatedAt = lastUpdatedAt > 0 ? lastUpdatedAt : null;
		const lastActiveAgeMs = resolvedLastUpdatedAt ? now - resolvedLastUpdatedAt : null;
		statuses.push({
			id: agentId,
			name: agent.name,
			workspaceDir,
			bootstrapPending,
			sessionsPath,
			sessionsCount,
			lastUpdatedAt: resolvedLastUpdatedAt,
			lastActiveAgeMs
		});
	}
	const totalSessions = statuses.reduce((sum, s) => sum + s.sessionsCount, 0);
	const bootstrapPendingCount = statuses.reduce((sum, s) => sum + (s.bootstrapPending ? 1 : 0), 0);
	return {
		defaultId: agentList.selectionRequired ? null : agentList.defaultId,
		ownership: agentList.ownership ?? (agentList.selectionRequired === true ? "explicit" : "sole"),
		selectionRequired: agentList.selectionRequired === true,
		agents: statuses,
		totalSessions,
		bootstrapPendingCount
	};
}
//#endregion
export { getAgentLocalStatuses };
