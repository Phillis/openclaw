import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { V as validateChatAbortParams } from "./src-4dv5TpeQ.js";
import { r as resolveSessionStoreKey } from "./session-store-key-DRF7yKG5.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId, n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as abortChatRunById } from "./chat-abort-BpfXA9KF.js";
import { t as chatRunBelongsToAgent } from "./chat-run-owner-Bu4zznGp.js";
import { t as abortQueuedChatTurnById } from "./chat-queued-turns-CEBu4Zkd.js";
import { A as resolveChatAbortRequester, D as canRequesterAbortPreRegisteredRun, E as canRequesterAbortChatRun, M as writePreRegisteredChatAbort, N as normalizeOptionalChatText, O as readPreRegisteredAgentDedupePayloadForSession, P as normalizeUnknownChatText, a as persistAbortedPartials, j as writePreRegisteredAgentAbort, n as cancelWorkerInferenceForSession, o as prepareControlledSubagentAbort, r as createChatAbortOps, t as abortChatRunsForSessionKeyWithPartials } from "./chat-abort-runtime-Du-GXdMW.js";
import { n as pendingChatSendDedupeKey } from "./server-shared-C-7Ahu3n.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
//#region src/gateway/server-methods/chat-abort-handler.ts
function descendantAbortError(result, subject) {
	return result && result.status !== "ok" ? errorShape(ErrorCodes.UNAVAILABLE, `${subject} stopped, but descendant cancellation was incomplete: ${result.error}`) : void 0;
}
async function handleChatAbortRequestWithLifecycle({ params, respond, context, client }, lifecycle = {}) {
	if (!assertValidParams(params, validateChatAbortParams, "chat.abort", respond)) return;
	const { sessionKey: rawSessionKey, runId, preserveSideRuns } = params;
	const agentIdOverride = normalizeOptionalChatText(params.agentId);
	const abortCfg = context.getRuntimeConfig();
	const parsedAbortSessionKey = parseAgentSessionKey(rawSessionKey);
	const compatibilityDefaultAgentId = tryResolveSessionCompatibilityOwnerAgentId(abortCfg, rawSessionKey);
	const inferredSessionAgentId = !agentIdOverride && parsedAbortSessionKey ? normalizeAgentId(parsedAbortSessionKey.agentId) : void 0;
	const bareSessionAgentResolution = !parsedAbortSessionKey ? resolveRequestedSessionAgentId(abortCfg, rawSessionKey, agentIdOverride) : void 0;
	if (bareSessionAgentResolution && !bareSessionAgentResolution.ok) {
		respond(false, void 0, bareSessionAgentResolution.error);
		return;
	}
	const abortAgentId = parsedAbortSessionKey ? agentIdOverride ?? inferredSessionAgentId : bareSessionAgentResolution?.agentId;
	if (!abortAgentId) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, rawSessionKey.trim().toLowerCase() === "global" ? "agentId is required for global chat.abort when no compatibility owner exists" : "agentId is required for unscoped chat.abort when no compatibility owner exists"));
		return;
	}
	if (agentIdOverride && parsedAbortSessionKey && normalizeAgentId(parsedAbortSessionKey.agentId) !== normalizeAgentId(agentIdOverride)) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agentId "${agentIdOverride}" does not match session key "${rawSessionKey}"`));
		return;
	}
	const canonicalAbortSessionKey = resolveSessionStoreKey({
		cfg: abortCfg,
		sessionKey: rawSessionKey,
		storeAgentId: abortAgentId
	});
	const ops = createChatAbortOps(context);
	const requester = resolveChatAbortRequester(client);
	const { entry: abortSessionEntry } = loadGatewaySessionEntry(canonicalAbortSessionKey, { agentId: abortAgentId });
	const cancelWorkerRun = (sessionId = abortSessionEntry?.sessionId) => requester.isAdmin ? cancelWorkerInferenceForSession({
		context,
		sessionId,
		...runId ? { runId } : {}
	}) : [];
	const respondWithWorkerRuns = (localRunIds, sessionId) => {
		const runIds = [.../* @__PURE__ */ new Set([...localRunIds, ...cancelWorkerRun(sessionId)])];
		respond(true, {
			ok: true,
			aborted: runIds.length > 0,
			runIds
		});
	};
	if (!runId) {
		const res = await abortChatRunsForSessionKeyWithPartials({
			context,
			ops,
			sessionKey: canonicalAbortSessionKey,
			sessionKeyAliases: canonicalAbortSessionKey === rawSessionKey ? void 0 : [rawSessionKey],
			agentId: abortAgentId,
			sessionId: abortSessionEntry?.sessionId,
			defaultAgentId: compatibilityDefaultAgentId,
			abortOrigin: "rpc",
			stopReason: "rpc",
			requester,
			preserveSideRuns,
			excludeRunIds: lifecycle.excludeRunIds,
			onAuthorizedAfterQueuedAbort: lifecycle.onAuthorizedAfterQueuedAbort
		});
		if (res.unauthorized) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		if (lifecycle.cascadeDescendants) {
			const descendants = await prepareControlledSubagentAbort({
				cfg: abortCfg,
				sessionKey: canonicalAbortSessionKey,
				agentId: abortAgentId
			})();
			const error = descendantAbortError(descendants, "Session");
			if (error) {
				respond(false, void 0, error);
				return;
			}
			res.aborted ||= Boolean(descendants?.killed);
		}
		respond(true, {
			ok: true,
			aborted: res.aborted,
			runIds: res.runIds
		});
		return;
	}
	const normalizedAgentIdOverride = normalizeAgentId(abortAgentId);
	const authorizeRunTarget = (target) => {
		if (target.sessionKey !== rawSessionKey && target.sessionKey !== canonicalAbortSessionKey && !canRequesterAbortChatRun(target, requester, { requireOwnerMatch: true })) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match sessionKey"));
			return false;
		}
		if (!chatRunBelongsToAgent({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			defaultAgentId: compatibilityDefaultAgentId
		}, normalizedAgentIdOverride)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "runId does not match agentId"));
			return false;
		}
		if (!canRequesterAbortChatRun(target, requester)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return false;
		}
		return true;
	};
	const active = context.chatAbortControllers.get(runId);
	if (!active) {
		const readPendingRunForAbort = (entry) => {
			for (const sessionKey of /* @__PURE__ */ new Set([canonicalAbortSessionKey, rawSessionKey])) {
				const payload = readPreRegisteredAgentDedupePayloadForSession({
					entry,
					runId,
					sessionKey,
					agentId: abortAgentId,
					defaultAgentId: compatibilityDefaultAgentId,
					includeHidden: true
				});
				if (payload) return {
					sessionKey: normalizeUnknownChatText(payload.sessionKey) ? sessionKey : void 0,
					payload
				};
			}
		};
		const pendingChatMatch = readPendingRunForAbort(context.dedupe.get(pendingChatSendDedupeKey(runId)));
		if (pendingChatMatch) {
			if (!canRequesterAbortPreRegisteredRun(pendingChatMatch.payload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			writePreRegisteredChatAbort({
				context,
				runId,
				stopReason: "rpc",
				attemptId: normalizeUnknownChatText(pendingChatMatch.payload.attemptId)
			});
			respondWithWorkerRuns([runId]);
			return;
		}
		const pendingAgentMatch = readPendingRunForAbort(context.dedupe.get(`agent:${runId}`));
		if (pendingAgentMatch) {
			const pendingAgentPayload = pendingAgentMatch.payload;
			if (!canRequesterAbortPreRegisteredRun(pendingAgentPayload, requester)) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
				return;
			}
			writePreRegisteredAgentAbort({
				context,
				runId,
				sessionKey: pendingAgentMatch.sessionKey,
				payload: pendingAgentPayload,
				stopReason: "rpc"
			});
			respondWithWorkerRuns([runId]);
			return;
		}
		const chatQueuedTurns = context.chatQueuedTurns;
		const queued = chatQueuedTurns.get(runId);
		if (queued) {
			if (!authorizeRunTarget(queued)) return;
			respondWithWorkerRuns(abortQueuedChatTurnById(chatQueuedTurns, {
				runId,
				sessionKey: queued.sessionKey,
				stopReason: "rpc",
				allowSessionMismatch: true
			}).aborted ? [runId] : []);
			return;
		}
		const workerSessionId = abortSessionEntry?.sessionId;
		if (!workerSessionId || !asWorkerInferenceControl(context.workerEnvironmentService)?.hasInferenceForSession(workerSessionId, runId)) {
			respond(true, {
				ok: true,
				aborted: false,
				runIds: []
			});
			return;
		}
		if (!requester.isAdmin) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "unauthorized"));
			return;
		}
		respondWithWorkerRuns([]);
		return;
	}
	if (!authorizeRunTarget(active)) return;
	const abortControlledSubagents = prepareControlledSubagentAbort({
		cfg: abortCfg,
		sessionKey: active.sessionKey,
		agentId: active.agentId,
		requesterTurnRunId: runId
	});
	const partialText = context.chatRunState.resolveBuffer(runId).text;
	const res = abortChatRunById(ops, {
		runId,
		sessionKey: active.sessionKey,
		stopReason: "rpc"
	});
	if (res.aborted && active.controlUiVisible !== false && partialText && partialText.trim()) await persistAbortedPartials({
		context,
		sessionKey: active.sessionKey,
		snapshots: [{
			runId,
			sessionId: active.sessionId,
			agentId: active.agentId,
			text: partialText,
			abortOrigin: "rpc"
		}]
	});
	const descendantError = descendantAbortError(await abortControlledSubagents(), "Parent run");
	if (descendantError) {
		respond(false, void 0, descendantError);
		return;
	}
	respondWithWorkerRuns(res.aborted ? [runId] : [], active.sessionId);
}
async function handleChatAbortRequest(options) {
	await handleChatAbortRequestWithLifecycle(options);
}
//#endregion
export { handleChatAbortRequestWithLifecycle as n, handleChatAbortRequest as t };
