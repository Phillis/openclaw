import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { a as listAgentIds, b as tryResolveAmbientOwnerAgentId, r as listAgentEntries, s as resolveAgentConfig } from "./agent-scope-config-CUBiGmG3.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import "./heartbeat-yX5WzsUn.js";
//#region src/infra/heartbeat-agent-resolution.ts
function tryResolveAmbientHeartbeatAgentId(cfg) {
	return tryResolveAmbientOwnerAgentId(cfg, cfg.agents?.defaults?.heartbeat?.agentId);
}
//#endregion
//#region src/infra/heartbeat-config.ts
/** Pure heartbeat enrollment and configuration shared by scheduling, health, and Doctor. */
function resolveHeartbeatConfig(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.heartbeat;
	if (!agentId) return defaults;
	const overrides = resolveAgentConfig(cfg, agentId)?.heartbeat;
	return defaults || overrides ? {
		...defaults,
		...overrides
	} : void 0;
}
/** Resolve the cadence owned by the effective heartbeat configuration. */
function resolveHeartbeatIntervalMs(cfg, overrideEvery, heartbeat) {
	const trimmed = normalizeOptionalString(overrideEvery ?? heartbeat?.every ?? cfg.agents?.defaults?.heartbeat?.every ?? "30m");
	if (!trimmed) return null;
	try {
		const intervalMs = parseDurationMs(trimmed, { defaultUnit: "m" });
		return intervalMs > 0 ? intervalMs : null;
	} catch {
		return null;
	}
}
function resolveHeartbeatAgents(cfg) {
	const explicitAgents = listAgentEntries(cfg).filter((entry) => entry.heartbeat);
	if (explicitAgents.length > 0) return explicitAgents.map((entry) => {
		const agentId = normalizeAgentId(entry.id);
		return {
			agentId,
			heartbeat: resolveHeartbeatConfig(cfg, agentId)
		};
	}).filter((agent) => agent.agentId);
	const configuredAgentId = normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId);
	if (configuredAgentId) {
		const agentId = normalizeAgentId(configuredAgentId);
		return [{
			agentId,
			heartbeat: resolveHeartbeatConfig(cfg, agentId)
		}];
	}
	if (cfg.agents?.defaults?.heartbeat) return listAgentIds(cfg).map((agentId) => ({
		agentId,
		heartbeat: resolveHeartbeatConfig(cfg, agentId)
	}));
	const agentId = tryResolveAmbientHeartbeatAgentId(cfg);
	return agentId ? [{
		agentId,
		heartbeat: resolveHeartbeatConfig(cfg, agentId)
	}] : [];
}
function isHeartbeatOwnerUnresolved(cfg) {
	return listAgentIds(cfg).length > 1 && resolveHeartbeatAgents(cfg).length === 0;
}
//#endregion
export { tryResolveAmbientHeartbeatAgentId as a, resolveHeartbeatIntervalMs as i, resolveHeartbeatAgents as n, resolveHeartbeatConfig as r, isHeartbeatOwnerUnresolved as t };
