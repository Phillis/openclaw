import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, p as resolveDefaultAgentId, r as listAgentEntries, s as resolveAgentConfig, y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import "./legacy.default-agent-owner-D8ws5hED.js";
import { c as resolveHeartbeatPromptCore } from "./heartbeat-BB6nm0Fy.js";
//#region src/infra/heartbeat-agent-resolution.ts
function resolveAmbientHeartbeatAgentId(cfg) {
	return normalizeAgentId(normalizeOptionalString(cfg.agents?.defaults?.heartbeat?.agentId) ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? resolveDefaultAgentId(cfg, {
		surface: "ambient heartbeat scheduling",
		hint: "Set agents.defaults.heartbeat.agentId to the agent that owns ambient heartbeats."
	}));
}
//#endregion
//#region src/infra/heartbeat-summary.ts
const DEFAULT_HEARTBEAT_TARGET = "owner";
function hasExplicitHeartbeatAgents(cfg) {
	return listAgentEntries(cfg).some((entry) => Boolean(entry?.heartbeat));
}
/** Return whether heartbeat scheduling applies to an agent. */
function isHeartbeatEnabledForAgent(cfg, agentId) {
	const ambientAgentId = agentId === void 0 ? resolveAmbientHeartbeatAgentId(cfg) : tryResolveLegacyCompatibilityAgentId(cfg) ?? tryResolveDefaultAgentId(cfg);
	const resolvedAgentId = normalizeAgentId(agentId ?? ambientAgentId);
	const list = listAgentEntries(cfg);
	if (hasExplicitHeartbeatAgents(cfg)) return list.some((entry) => Boolean(entry?.heartbeat) && normalizeAgentId(entry?.id) === resolvedAgentId);
	if (cfg.agents?.defaults?.heartbeat) {
		const configuredAgentId = normalizeOptionalString(cfg.agents.defaults.heartbeat.agentId);
		if (configuredAgentId) return resolvedAgentId === normalizeAgentId(configuredAgentId);
		return true;
	}
	return ambientAgentId !== void 0 && resolvedAgentId === ambientAgentId;
}
/** Resolve a heartbeat interval string to milliseconds. */
function resolveHeartbeatIntervalMs(cfg, overrideEvery, heartbeat) {
	const raw = overrideEvery ?? heartbeat?.every ?? cfg.agents?.defaults?.heartbeat?.every ?? "30m";
	if (!raw) return null;
	const trimmed = normalizeOptionalString(raw) ?? "";
	if (!trimmed) return null;
	let ms;
	try {
		ms = parseDurationMs(trimmed, { defaultUnit: "m" });
	} catch {
		return null;
	}
	if (ms <= 0) return null;
	return ms;
}
/** Resolve display-ready heartbeat settings for an agent. */
function resolveHeartbeatSummaryForAgent(cfg, agentId) {
	const defaults = cfg.agents?.defaults?.heartbeat;
	const overrides = agentId ? resolveAgentConfig(cfg, agentId)?.heartbeat : void 0;
	const merged = defaults || overrides ? {
		...defaults,
		...overrides
	} : void 0;
	if (!isHeartbeatEnabledForAgent(cfg, agentId)) return {
		enabled: false,
		every: "disabled",
		everyMs: null,
		prompt: resolveHeartbeatPromptCore(merged?.prompt),
		target: merged?.target ?? DEFAULT_HEARTBEAT_TARGET,
		model: merged?.model,
		session: merged?.session,
		ackMaxChars: 300
	};
	return {
		enabled: true,
		every: merged?.every ?? "30m",
		everyMs: resolveHeartbeatIntervalMs(cfg, void 0, merged),
		prompt: resolveHeartbeatPromptCore(merged?.prompt),
		target: merged?.target ?? DEFAULT_HEARTBEAT_TARGET,
		model: merged?.model,
		session: merged?.session,
		ackMaxChars: 300
	};
}
//#endregion
export { resolveAmbientHeartbeatAgentId as i, resolveHeartbeatIntervalMs as n, resolveHeartbeatSummaryForAgent as r, isHeartbeatEnabledForAgent as t };
