import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as clampNumber } from "./utils-D9gvQMP6.js";
import { s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
//#region src/agents/subagents/swarm/swarm-config.ts
const DEFAULT_SWARM_CONFIG = {
	enabled: false,
	maxConcurrent: 8,
	maxChildrenPerGroup: 50,
	maxTotalPerGroup: 200,
	waitTimeoutSecondsMax: 600,
	defaultAgentId: ""
};
function normalizeRawConfig(value) {
	if (value === true) return { enabled: true };
	if (value === false) return { enabled: false };
	return isRecord(value) ? value : void 0;
}
function readPositiveInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
/** Resolve global and per-agent Swarm configuration into bounded runtime values. */
function resolveSwarmConfig(config, agentId) {
	const globalRaw = normalizeRawConfig(config?.tools?.swarm) ?? {};
	const agentRaw = config && agentId ? normalizeRawConfig(resolveAgentConfig(config, agentId)?.tools?.swarm) : void 0;
	const raw = agentRaw ? {
		...globalRaw,
		...agentRaw
	} : globalRaw;
	const maxChildrenPerGroup = clampNumber(readPositiveInteger(raw.maxChildrenPerGroup, DEFAULT_SWARM_CONFIG.maxChildrenPerGroup), 1, 1e4);
	const maxTotalPerGroup = clampNumber(readPositiveInteger(raw.maxTotalPerGroup, DEFAULT_SWARM_CONFIG.maxTotalPerGroup), 1, 1e5);
	return {
		enabled: typeof raw.enabled === "boolean" ? raw.enabled : DEFAULT_SWARM_CONFIG.enabled,
		maxConcurrent: clampNumber(readPositiveInteger(raw.maxConcurrent, DEFAULT_SWARM_CONFIG.maxConcurrent), 1, 1e3),
		maxChildrenPerGroup,
		maxTotalPerGroup,
		waitTimeoutSecondsMax: clampNumber(readPositiveInteger(raw.waitTimeoutSecondsMax, DEFAULT_SWARM_CONFIG.waitTimeoutSecondsMax), 1, 1440 * 60),
		defaultAgentId: typeof raw.defaultAgentId === "string" ? raw.defaultAgentId.trim() : ""
	};
}
//#endregion
export { resolveSwarmConfig as t };
