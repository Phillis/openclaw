import "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir, r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { l as resolveSessionTranscriptsDirForAgent } from "./paths-CfFmgJmW.js";
import { n as mutateConfigFileWithRetry } from "./mutate-B2SI65Vd.js";
import "./config-CfeGo4K4.js";
import "./sessions-Bh837xaa.js";
import { a as pruneAgentConfig, r as findAgentEntryIndex, t as applyAgentConfig } from "./agents.config-BgVfIBCV.js";
//#region src/gateway/server-methods/agents-config-mutations.ts
/** Typed precondition failure surfaced by agent mutation handlers as gateway errors. */
var AgentConfigPreconditionError = class extends Error {};
/** Checks the current config snapshot for a concrete agent entry. */
function isConfiguredAgent(cfg, agentId) {
	return findAgentEntryIndex(listAgentEntries(cfg), agentId) >= 0;
}
/** Updates an existing agent entry while preserving omitted fields. */
async function updateAgentConfigEntry(params) {
	await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (!isConfiguredAgent(draft, params.agentId)) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			const latestNextConfig = applyAgentConfig(draft, {
				agentId: params.agentId,
				...params.name ? { name: params.name } : {},
				...params.workspace ? { workspace: params.workspace } : {},
				...params.model !== void 0 ? { model: params.model } : {},
				...params.identity ? { identity: params.identity } : {}
			});
			Object.assign(draft, latestNextConfig);
		}
	});
}
/** Removes an agent entry and returns filesystem roots the caller should clean up. */
async function deleteAgentConfigEntry(params) {
	const committed = await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		writeOptions: {
			allowedAgentRosterRemovals: [params.agentId],
			...params.allowConfigSizeDrop ? { allowConfigSizeDrop: true } : {}
		},
		mutate: (draft) => {
			params.validateConfig?.(draft);
			if (!isConfiguredAgent(draft, params.agentId) && !params.allowMissing) throw new AgentConfigPreconditionError(`agent "${params.agentId}" not found`);
			const agent = listAgentEntries(draft).find((candidate) => candidate.id === params.agentId);
			if (agent) params.validate?.(agent);
			const workspaceDir = agent ? resolveAgentWorkspaceDir(draft, params.agentId) : params.fallbackWorkspace ?? "";
			const agentDir = resolveAgentDir(draft, params.agentId);
			const sessionsDir = resolveSessionTranscriptsDirForAgent(params.agentId);
			const result = pruneAgentConfig(draft, params.agentId);
			Object.assign(draft, result.config);
			if (!agent) return;
			return {
				workspaceDir,
				agentDir,
				sessionsDir,
				removedBindings: result.removedBindings
			};
		}
	});
	return {
		nextConfig: committed.nextConfig,
		result: committed.result
	};
}
//#endregion
export { updateAgentConfigEntry as i, deleteAgentConfigEntry as n, isConfiguredAgent as r, AgentConfigPreconditionError as t };
