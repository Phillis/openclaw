import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as resolveHeartbeatPromptCore } from "./heartbeat-yX5WzsUn.js";
import { a as tryResolveAmbientHeartbeatAgentId, i as resolveHeartbeatIntervalMs, n as resolveHeartbeatAgents, r as resolveHeartbeatConfig } from "./heartbeat-config-Cdcr8ZQq.js";
//#region src/infra/heartbeat-summary.ts
const DEFAULT_HEARTBEAT_TARGET = "owner";
/** Return whether heartbeat scheduling applies to an agent. */
function isHeartbeatEnabledForAgent(cfg, agentId) {
	const resolvedAgentId = agentId ?? tryResolveAmbientHeartbeatAgentId(cfg);
	return resolvedAgentId !== void 0 && resolveHeartbeatAgents(cfg).some((agent) => agent.agentId === normalizeAgentId(resolvedAgentId));
}
/** Resolve display-ready heartbeat settings for an agent. */
function resolveHeartbeatSummaryForAgent(cfg, agentId) {
	const merged = resolveHeartbeatConfig(cfg, agentId);
	const everyMs = resolveHeartbeatIntervalMs(cfg, void 0, merged);
	const enabled = isHeartbeatEnabledForAgent(cfg, agentId) && everyMs !== null;
	return {
		enabled,
		every: enabled ? merged?.every ?? "30m" : "disabled",
		everyMs: enabled ? everyMs : null,
		prompt: resolveHeartbeatPromptCore(merged?.prompt),
		target: merged?.target ?? DEFAULT_HEARTBEAT_TARGET,
		model: merged?.model,
		session: merged?.session,
		ackMaxChars: 300
	};
}
//#endregion
export { resolveHeartbeatSummaryForAgent as n, isHeartbeatEnabledForAgent as t };
