import { c as isFailoverError, d as isTimeoutError } from "./failover-error-DVBvcQuA.js";
//#region src/agents/run-termination.ts
/**
* Shared agent run termination constants.
*
* Runtime and stream consumers use these stable literals to recognize user or
* controller aborts without matching free-form error text.
*/
/** Stop reason emitted when an agent run is aborted. */
const AGENT_RUN_ABORTED_STOP_REASON = "aborted";
/** Error text used for aborted agent runs. */
const AGENT_RUN_ABORTED_ERROR = "agent run aborted";
const AGENT_RUN_RESTART_ABORT_STOP_REASON = "restart";
const AGENT_RUN_SUPERSEDED_STOP_REASON = "superseded";
/** Error text used for agent runs aborted by a gateway restart. */
const AGENT_RUN_RESTART_ABORT_ERROR = "agent run aborted for restart";
const AGENT_RUN_SUPERSEDED_ERROR = "agent run superseded by a newer session writer";
/**
* Transports copy this code onto the persisted assistant message via
* `errorCode`, so restart recovery can recognize its own abort without matching
* free-form provider error text.
*/
const AGENT_RUN_RESTART_ABORT_ERROR_CODE = "OPENCLAW_RESTART_ABORT";
const AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE = "AGENT_RUN_SUPERSEDED_ABORT";
const AGENT_RUN_DIRECT_ABORT_ERROR_CODE = "OPENCLAW_DIRECT_ABORT";
function createAgentRunDirectAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_ABORTED_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_DIRECT_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunDirectAbortReason(value) {
	return value instanceof Error && "code" in value && value.code === AGENT_RUN_DIRECT_ABORT_ERROR_CODE;
}
function createAgentRunRestartAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_RESTART_ABORT_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_RESTART_ABORT_ERROR_CODE;
	return error;
}
function createAgentRunSupersededAbortError() {
	const error = /* @__PURE__ */ new Error(AGENT_RUN_SUPERSEDED_ERROR);
	error.name = "AbortError";
	error.code = AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE;
	return error;
}
function isAgentRunRestartAbortReason(value) {
	try {
		return value instanceof Error && "code" in value && value.code === "OPENCLAW_RESTART_ABORT";
	} catch {
		return false;
	}
}
function isAgentRunSupersededAbortReason(value) {
	try {
		return value instanceof Error && "code" in value && value.code === AGENT_RUN_SUPERSEDED_ABORT_ERROR_CODE;
	} catch {
		return false;
	}
}
function throwAgentRunRestartAbortReason(value) {
	if (isAgentRunRestartAbortReason(value)) throw value;
}
function isAgentRunTimeoutAbortReason(value) {
	if (!value || typeof value !== "object") return false;
	try {
		return "name" in value && value.name === "TimeoutError";
	} catch {
		return false;
	}
}
function resolveAgentRunAbortLifecycleFields(signal) {
	if (!signal?.aborted) return {};
	return {
		aborted: true,
		stopReason: isAgentRunRestartAbortReason(signal.reason) ? AGENT_RUN_RESTART_ABORT_STOP_REASON : isAgentRunTimeoutAbortReason(signal.reason) ? "timeout" : AGENT_RUN_ABORTED_STOP_REASON
	};
}
function isProviderTimeoutError(error) {
	try {
		const candidate = isFailoverError(error) ? error : error instanceof Error ? error.cause : void 0;
		return isFailoverError(candidate) && candidate.reason === "timeout";
	} catch {
		return false;
	}
}
/** Preserve structured provider watchdog timeouts when no abort signal was raised. */
function resolveAgentRunErrorLifecycleFields(error, signal) {
	const abortFields = resolveAgentRunAbortLifecycleFields(signal);
	if (abortFields.aborted) return abortFields;
	if (!isProviderTimeoutError(error)) return {};
	return {
		stopReason: "timeout",
		timeoutPhase: "provider"
	};
}
/** Returns whether a stop reason is the stable aborted-run reason. */
function isAbortedAgentStopReason(value) {
	return value === AGENT_RUN_ABORTED_STOP_REASON || value === "restart";
}
/**
* CLI tool terminal reason for one-shot and live runners.
* Abort-signal lifecycle is authoritative so a timeout abort stays timed_out
* even when the delivered error is a generic AbortError.
*/
function resolveCliToolTerminalReason(params) {
	const abortFields = resolveAgentRunAbortLifecycleFields(params.abortSignal);
	if (abortFields.aborted) return abortFields.stopReason === "timeout" ? "timed_out" : "cancelled";
	const { error } = params;
	try {
		if (isTimeoutError(error) || isFailoverError(error) && error.reason === "timeout") return "timed_out";
		if (error instanceof Error && error.name === "AbortError") return "cancelled";
	} catch {}
	return "failed";
}
//#endregion
export { throwAgentRunRestartAbortReason as _, AGENT_RUN_SUPERSEDED_ERROR as a, createAgentRunRestartAbortError as c, isAgentRunDirectAbortReason as d, isAgentRunRestartAbortReason as f, resolveCliToolTerminalReason as g, resolveAgentRunErrorLifecycleFields as h, AGENT_RUN_RESTART_ABORT_STOP_REASON as i, createAgentRunSupersededAbortError as l, resolveAgentRunAbortLifecycleFields as m, AGENT_RUN_RESTART_ABORT_ERROR as n, AGENT_RUN_SUPERSEDED_STOP_REASON as o, isAgentRunSupersededAbortReason as p, AGENT_RUN_RESTART_ABORT_ERROR_CODE as r, createAgentRunDirectAbortError as s, AGENT_RUN_ABORTED_ERROR as t, isAbortedAgentStopReason as u };
