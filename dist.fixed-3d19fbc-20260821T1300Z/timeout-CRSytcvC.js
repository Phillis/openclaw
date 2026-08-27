import { N as resolveOptionalIntegerOption, m as clampTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-oCkfUEEq.js";
//#region src/agents/timeout.ts
/**
* Agent run timeout resolver.
*
* Converts config and per-run overrides into timer-safe millisecond deadlines.
*/
const DEFAULT_AGENT_TIMEOUT_SECONDS = 2880 * 60;
const DEFAULT_AGENT_TIMEOUT_MS = DEFAULT_AGENT_TIMEOUT_SECONDS * 1e3;
const NO_TIMEOUT_MS = MAX_TIMER_TIMEOUT_MS;
const NO_TIMEOUT_SECONDS = Math.floor(NO_TIMEOUT_MS / 1e3);
function resolveAgentTimeoutSeconds(cfg) {
	const raw = resolveOptionalIntegerOption(cfg?.agents?.defaults?.timeoutSeconds);
	if (raw === 0) return NO_TIMEOUT_SECONDS;
	return Math.max(raw ?? DEFAULT_AGENT_TIMEOUT_SECONDS, 1);
}
function resolveAgentTimeoutMs(opts) {
	const minMs = Math.max(resolveOptionalIntegerOption(opts.minMs) ?? 1, 1);
	const clampTimeoutMs = (valueMs) => clampTimerTimeoutMs(valueMs, minMs) ?? minMs;
	const defaultMs = clampTimeoutMs(resolveAgentTimeoutSeconds(opts.cfg) * 1e3);
	const overrideMs = resolveOptionalIntegerOption(opts.overrideMs);
	if (overrideMs !== void 0) {
		if (overrideMs === 0) return NO_TIMEOUT_MS;
		if (overrideMs < 0) return defaultMs;
		return clampTimeoutMs(overrideMs);
	}
	const overrideSeconds = resolveOptionalIntegerOption(opts.overrideSeconds);
	if (overrideSeconds !== void 0) {
		if (overrideSeconds === 0) return NO_TIMEOUT_MS;
		if (overrideSeconds < 0) return defaultMs;
		return clampTimeoutMs(overrideSeconds * 1e3);
	}
	return defaultMs;
}
//#endregion
export { resolveAgentTimeoutMs as n, DEFAULT_AGENT_TIMEOUT_MS as t };
