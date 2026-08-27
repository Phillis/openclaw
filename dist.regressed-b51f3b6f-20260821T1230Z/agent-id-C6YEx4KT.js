import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { S as tryResolveSystemAgentTargetAgentId, b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-BdXMWufB.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
//#region src/cron/agent-id.ts
const CRON_AGENT_SELECTION_REQUIRED_MESSAGE = "Agent-less cron job has no resolvable owner. Pass --agent <id> when creating or editing the job, or set agents.defaults.systemAgent.agentId.";
/** Keeps shipped legacy defaults while routing modern ambient jobs through the system owner. */
function tryResolveCronDefaultAgentId(cfg) {
	return tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveSystemAgentTargetAgentId(cfg);
}
/** Resolves cron ownership: explicit non-blank id, scoped session key, then configured default. */
function resolveCronJobEffectiveAgentId(job, configuredDefaultAgentId) {
	const agentId = job.agentId?.trim() || parseAgentSessionKey(job.sessionKey)?.agentId || configuredDefaultAgentId?.trim();
	if (!agentId) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return normalizeAgentId(agentId);
}
//#endregion
export { resolveCronJobEffectiveAgentId as n, tryResolveCronDefaultAgentId as r, CRON_AGENT_SELECTION_REQUIRED_MESSAGE as t };
