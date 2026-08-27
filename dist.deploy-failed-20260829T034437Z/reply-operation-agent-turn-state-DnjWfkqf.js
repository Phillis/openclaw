import { t as GatewayDrainingError } from "./gateway-work-admission-CTDt7IQ1.js";
import { f as isAgentRunRestartAbortReason, h as resolveAgentRunErrorLifecycleFields, i as AGENT_RUN_RESTART_ABORT_STOP_REASON, p as isAgentRunSupersededAbortReason } from "./run-termination-hzmbXtwI.js";
import { t as CommandLaneClearedError } from "./command-queue-CBS1Vl32.js";
import { r as isFallbackSummaryError } from "./model-fallback-attempt-B0KZ9S-s.js";
//#region src/auto-reply/reply/reply-operation-abort.ts
function buildRestartLifecycleReplyText() {
	return "⚠️ Gateway is restarting. Please wait a few seconds and try again.";
}
function isReplyOperationUserAbort(replyOperation) {
	if (replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_by_user") return true;
	const abortSignal = replyOperation?.abortSignal;
	return abortSignal?.aborted === true && !isAgentRunRestartAbortReason(abortSignal.reason) && !isAgentRunSupersededAbortReason(abortSignal.reason);
}
function isReplyOperationRestartAbort(replyOperation) {
	if (replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_restart") return true;
	const abortSignal = replyOperation?.abortSignal;
	return abortSignal?.aborted === true && isAgentRunRestartAbortReason(abortSignal.reason);
}
function resolveReplyOperationTerminationFields(error, signal, replyOperation) {
	return {
		...resolveAgentRunErrorLifecycleFields(error, signal),
		...isReplyOperationRestartAbort(replyOperation) ? {
			aborted: true,
			stopReason: AGENT_RUN_RESTART_ABORT_STOP_REASON
		} : {}
	};
}
function isReplyOperationSuperseded(replyOperation) {
	if (replyOperation?.result?.kind === "aborted" && replyOperation.result.code === "aborted_for_supersession") return true;
	const abortSignal = replyOperation?.abortSignal;
	return abortSignal?.aborted === true && isAgentRunSupersededAbortReason(abortSignal.reason);
}
function resolveRestartLifecycleError(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of pending) {
		if (!candidate || seen.has(candidate)) continue;
		seen.add(candidate);
		if (candidate instanceof GatewayDrainingError || candidate instanceof CommandLaneClearedError) return candidate;
		if (isFallbackSummaryError(candidate)) pending.push(...candidate.attempts.map((attempt) => attempt.error));
		if (candidate instanceof Error && "cause" in candidate) pending.push(candidate.cause);
	}
}
//#endregion
//#region src/auto-reply/reply/reply-operation-agent-turn-state.ts
const agentTurns = /* @__PURE__ */ new WeakMap();
function recordReplyOperationAgentTurn(state, status, owner) {
	if (state) agentTurns.set(state, {
		status,
		owner
	});
}
function resolveReplyOperationAgentTurn(state) {
	if (!state) return;
	const turn = agentTurns.get(state);
	return isReplyOperationSuperseded(turn?.owner) ? "superseded" : turn?.status;
}
//#endregion
export { isReplyOperationSuperseded as a, resolveRestartLifecycleError as c, isReplyOperationRestartAbort as i, resolveReplyOperationAgentTurn as n, isReplyOperationUserAbort as o, buildRestartLifecycleReplyText as r, resolveReplyOperationTerminationFields as s, recordReplyOperationAgentTurn as t };
