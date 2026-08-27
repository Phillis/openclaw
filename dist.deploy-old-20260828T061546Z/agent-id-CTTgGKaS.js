import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
//#region src/cron/agent-id.ts
const CRON_AGENT_SELECTION_REQUIRED_MESSAGE = "Agent-less cron job has no resolvable owner. Pass --agent <id> when creating or editing the job, or set agents.defaults.systemAgent.agentId.";
/** Resolves cron ownership: explicit non-blank id, scoped session key, then configured default. */
function resolveCronJobEffectiveAgentId(job, configuredDefaultAgentId) {
	const agentId = job.agentId?.trim() || parseAgentSessionKey(job.sessionKey)?.agentId || configuredDefaultAgentId?.trim();
	if (!agentId) throw new Error(CRON_AGENT_SELECTION_REQUIRED_MESSAGE);
	return normalizeAgentId(agentId);
}
//#endregion
export { resolveCronJobEffectiveAgentId as n, CRON_AGENT_SELECTION_REQUIRED_MESSAGE as t };
