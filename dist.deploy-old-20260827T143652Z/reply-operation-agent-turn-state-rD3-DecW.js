import { t as GatewayDrainingError } from "./gateway-work-admission-QDz202p9.js";
import { f as isAgentRunRestartAbortReason, p as isAgentRunSupersededAbortReason } from "./run-termination-B0y7ra5H.js";
import { t as CommandLaneClearedError } from "./command-queue-CqN2qr5o.js";
import { i as isFallbackSummaryError } from "./model-fallback-attempt-g8386O_W.js";
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
export { isReplyOperationSuperseded as a, isReplyOperationRestartAbort as i, resolveReplyOperationAgentTurn as n, isReplyOperationUserAbort as o, buildRestartLifecycleReplyText as r, resolveRestartLifecycleError as s, recordReplyOperationAgentTurn as t };
