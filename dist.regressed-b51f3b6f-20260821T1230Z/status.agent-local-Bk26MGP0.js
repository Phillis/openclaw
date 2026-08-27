import { s as pathExists } from "./absolute-path-BseY-yOe.js";
import "./fs-safe-C9N8pCh1.js";
import "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-BdXMWufB.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { qt as listSessionEntriesReadOnly } from "./session-accessor-Bi6bzKQE.js";
import { t as listGatewayAgentsBasic } from "./agent-list-2rr0qU-c.js";
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
		const sessionsPath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
		const sessions = listSessionEntriesReadOnly({
			agentId,
			storePath: sessionsPath
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
