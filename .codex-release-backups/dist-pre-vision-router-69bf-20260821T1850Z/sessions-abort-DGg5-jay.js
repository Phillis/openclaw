import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { a as resolveStoredSessionOwnerAgentId, i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-Cc0gbvo8.js";
import { s as resolveExistingAgentSessionStoreTargetsSync, t as isConfiguredSessionStoreAgentId } from "./targets-CdQ3kEkv.js";
import { pr as validateSessionsAbortParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { n as abortEmbeddedAgentRun } from "./runs-CQbSP9aq.js";
import "./sessions-Bh837xaa.js";
import { T as loadGatewaySessionEntry } from "./session-utils-row-xwseApeF.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId, t as resolveRequestedSessionAgentId } from "./session-request-agent-D8DcCzQX.js";
import "./session-utils-DvNvk7rk.js";
import { t as clearSessionQueues } from "./cleanup-C31pth_Y.js";
import { r as resolveChatRunOwnerAgentId } from "./chat-run-owner-CmA2Q2CD.js";
import { n as emitSessionsChanged } from "./session-change-event-XKNRoRWi.js";
import { I as setGatewayDedupeEntry } from "./chat-abort-runtime-DsIj0TD9.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as handleChatAbortRequestWithLifecycle } from "./chat-abort-handler-RfIUw4zZ.js";
import { n as resolveSessionKeyForRun } from "./server-session-key-CHq7Q-qx.js";
import { l as requireSessionKey } from "./sessions-shared-APEiBUgk.js";
import { t as resolveWorkerSessionTarget } from "./session-target-DGamQpQ5.js";
//#region src/gateway/server-methods/sessions-abort.ts
function resolveAbortSessionKey(params) {
	if (params.activeRunSessionKey) return params.activeRunSessionKey;
	const candidates = [
		params.canonicalKey,
		params.requestedKey,
		...params.aliasKeys ?? []
	];
	for (const active of params.context.chatAbortControllers.values()) {
		if (active.controlUiVisible === false) continue;
		for (const candidate of candidates) if (active.sessionKey === candidate) {
			const owner = resolveChatRunOwnerAgentId({
				agentId: active.agentId,
				sessionKey: active.sessionKey,
				defaultAgentId: params.defaultAgentId
			});
			if (!params.agentId || owner === normalizeAgentId(params.agentId)) return candidate;
		}
	}
	return params.requestedKey;
}
function resolveSessionKeyAgentId(sessionKey, cfg) {
	const key = normalizeOptionalString(sessionKey);
	if (!key) return;
	if (!parseAgentSessionKey(key) && key.toLowerCase().startsWith("agent:")) return;
	return parseAgentSessionKey(key)?.agentId ?? tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
}
function sessionKeyBelongsToAgent(sessionKey, agentId, cfg) {
	return resolveSessionKeyAgentId(sessionKey, cfg) === normalizeAgentId(agentId);
}
function resolveScopedAbortKey(params) {
	const key = normalizeOptionalString(params.key);
	if (!key) return;
	const requestedAgentId = normalizeOptionalString(params.agentId);
	if (!requestedAgentId) return key;
	const scopedAgentId = normalizeAgentId(requestedAgentId);
	const ownerAgentId = resolveStoredSessionOwnerAgentId({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
	if (ownerAgentId && ownerAgentId !== scopedAgentId) return;
	return resolveStoredSessionKeyForAgentStore({
		cfg: params.cfg,
		agentId: scopedAgentId,
		sessionKey: key
	});
}
const sessionAbortHandlers = { "sessions.abort": async ({ req, params, respond, context, client, isWebchatConnect }) => {
	if (!assertValidParams(params, validateSessionsAbortParams, "sessions.abort", respond)) return;
	const p = params;
	const cfg = context.getRuntimeConfig();
	const requestedRunId = readStringValue(p.runId);
	const requestedKey = normalizeOptionalString(p.key);
	const requestedParamAgentId = normalizeOptionalString(p.agentId);
	const clearQueued = p.clearQueued === true;
	const workerRunSessionId = requestedRunId ? asWorkerInferenceControl(context.workerEnvironmentService)?.resolveInferenceSessionForRunId(requestedRunId) : void 0;
	const workerRunTarget = workerRunSessionId ? resolveWorkerSessionTarget(cfg, workerRunSessionId) : void 0;
	const scopedRequestedKey = resolveScopedAbortKey({
		cfg,
		key: requestedKey,
		agentId: requestedParamAgentId
	});
	if (requestedKey && requestedParamAgentId && !scopedRequestedKey) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "session key agent does not match agentId"));
		return;
	}
	const requestedKeyAgentId = scopedRequestedKey ? resolveSessionKeyAgentId(scopedRequestedKey, cfg) : void 0;
	const activeRun = requestedRunId ? context.chatAbortControllers.get(requestedRunId) : void 0;
	const activeRunSessionKey = activeRun?.sessionKey;
	const activeRunAgentId = normalizeOptionalString(activeRun?.agentId);
	let inferredRunAgentId = requestedParamAgentId ?? activeRunAgentId ?? requestedKeyAgentId ?? workerRunTarget?.agentId ?? resolveSessionKeyAgentId(activeRunSessionKey, cfg);
	if (requestedRunId && !inferredRunAgentId) {
		const runOwner = resolveRequestedSessionAgentId(cfg, scopedRequestedKey ?? activeRunSessionKey ?? workerRunTarget?.sessionKey ?? "main");
		if (!runOwner.ok) {
			respond(false, void 0, runOwner.error);
			return;
		}
		inferredRunAgentId = runOwner.agentId;
	}
	const requestedRunAgentId = requestedRunId ? inferredRunAgentId ? normalizeAgentId(inferredRunAgentId) : void 0 : void 0;
	const scopedActiveRunSessionKey = activeRunSessionKey ? requestedRunAgentId ? sessionKeyBelongsToAgent(activeRunSessionKey, requestedRunAgentId, cfg) ? activeRunSessionKey : void 0 : activeRunSessionKey : void 0;
	const keyCandidate = scopedRequestedKey ?? scopedActiveRunSessionKey ?? (requestedRunId ? resolveSessionKeyForRun(requestedRunId, requestedRunAgentId ? { agentId: requestedRunAgentId } : void 0) : void 0) ?? workerRunTarget?.sessionKey;
	if (!keyCandidate && requestedRunId) {
		respond(true, {
			ok: true,
			abortedRunId: null,
			status: "no-active-run"
		});
		return;
	}
	const key = requireSessionKey(keyCandidate, respond);
	if (!key) return;
	const requestedGlobalAgent = resolveRequestedSessionAgentId(cfg, key, requestedParamAgentId ?? requestedRunAgentId);
	if (!requestedGlobalAgent.ok) {
		respond(false, void 0, requestedGlobalAgent.error);
		return;
	}
	const requestedGlobalAgentId = requestedGlobalAgent.agentId;
	const targetAgentId = requestedGlobalAgentId ?? resolveSessionStoreAgentId(cfg, resolveSessionStoreKey({
		cfg,
		sessionKey: key
	}));
	const configuredTarget = isConfiguredSessionStoreAgentId(cfg, targetAgentId);
	const existingTargets = configuredTarget ? [] : resolveExistingAgentSessionStoreTargetsSync(cfg, targetAgentId);
	const stableTargetOwner = tryResolveSessionCompatibilityOwnerAgentId(cfg, key);
	const hasExactActiveRun = requestedRunId ? scopedActiveRunSessionKey === key && resolveChatRunOwnerAgentId({
		agentId: activeRunAgentId,
		sessionKey: activeRunSessionKey,
		defaultAgentId: stableTargetOwner
	}) === normalizeAgentId(targetAgentId) : [...context.chatAbortControllers.values()].some((entry) => entry.controlUiVisible !== false && entry.sessionKey === key && resolveChatRunOwnerAgentId({
		agentId: entry.agentId,
		sessionKey: entry.sessionKey,
		defaultAgentId: stableTargetOwner
	}) === normalizeAgentId(targetAgentId));
	if (!configuredTarget && existingTargets.length === 0 && !hasExactActiveRun) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `agent "${targetAgentId}" not found`));
		return;
	}
	const loadedSession = configuredTarget || existingTargets.length > 0 ? loadGatewaySessionEntry(key, { agentId: requestedGlobalAgentId }) : void 0;
	const canonicalKey = loadedSession?.canonicalKey ?? resolveSessionStoreKey({
		cfg,
		sessionKey: key,
		...requestedGlobalAgentId ? { storeAgentId: requestedGlobalAgentId } : {}
	});
	const sessionEntry = loadedSession?.entry;
	const requestedKeyAliases = requestedKey && requestedKey !== key && (!requestedParamAgentId || sessionKeyBelongsToAgent(requestedKey, requestedParamAgentId, cfg)) ? [requestedKey] : void 0;
	const resolvedAbortSessionKey = resolveAbortSessionKey({
		context,
		requestedKey: key,
		canonicalKey,
		activeRunSessionKey: scopedActiveRunSessionKey,
		aliasKeys: requestedKeyAliases,
		agentId: requestedGlobalAgentId,
		defaultAgentId: stableTargetOwner
	});
	const abortSessionKey = canonicalKey === "global" && requestedGlobalAgentId ? "global" : resolvedAbortSessionKey;
	const abortAgentId = requestedGlobalAgentId ?? activeRunAgentId;
	const preAbortRunKinds = /* @__PURE__ */ new Map();
	if (requestedRunId) preAbortRunKinds.set(requestedRunId, activeRun?.kind);
	else for (const [rid, entry] of context.chatAbortControllers) preAbortRunKinds.set(rid, entry.kind);
	let abortedRunId = null;
	let aborted = false;
	let chatAbortSucceeded = false;
	let responseMeta;
	const persistedSessionId = sessionEntry?.sessionId;
	const onAuthorizedAfterQueuedAbort = !requestedRunId && canonicalKey !== "global" && (clearQueued || persistedSessionId) ? () => {
		let queueCleared = false;
		if (clearQueued) {
			const cleared = clearSessionQueues([
				key,
				...requestedKeyAliases ?? [],
				canonicalKey,
				...persistedSessionId ? [persistedSessionId] : []
			]);
			queueCleared = cleared.followupCleared > 0 || cleared.laneCleared > 0;
		}
		return (persistedSessionId ? abortEmbeddedAgentRun(persistedSessionId) : false) || queueCleared;
	} : void 0;
	await handleChatAbortRequestWithLifecycle({
		req,
		params: {
			sessionKey: abortSessionKey,
			runId: requestedRunId,
			...abortAgentId ? { agentId: abortAgentId } : {}
		},
		respond: (ok, payload, error, meta) => {
			if (!ok) {
				respond(ok, payload, error, meta);
				return;
			}
			chatAbortSucceeded = true;
			responseMeta = meta;
			const firstAbortedRunId = (payload && typeof payload === "object" && Array.isArray(payload.runIds) ? payload.runIds.filter((value) => Boolean(normalizeOptionalString(value))) : [])[0] ?? null;
			abortedRunId = firstAbortedRunId;
			aborted = firstAbortedRunId !== null || payload !== null && typeof payload === "object" && payload.aborted === true;
			if (firstAbortedRunId && !Boolean(workerRunSessionId && !activeRun)) {
				const endedAt = Date.now();
				const dedupePrefix = preAbortRunKinds.get(firstAbortedRunId) === "agent" ? "agent" : "chat";
				setGatewayDedupeEntry({
					dedupe: context.dedupe,
					key: `${dedupePrefix}:${firstAbortedRunId}`,
					entry: {
						ts: endedAt,
						ok: true,
						payload: {
							status: "timeout",
							runId: firstAbortedRunId,
							...abortAgentId ? { agentId: abortAgentId } : {},
							stopReason: "rpc",
							endedAt
						}
					}
				});
			}
		},
		context,
		client,
		isWebchatConnect
	}, {
		...onAuthorizedAfterQueuedAbort ? { onAuthorizedAfterQueuedAbort } : {},
		...!requestedRunId ? { cascadeDescendants: true } : {}
	});
	if (!chatAbortSucceeded) return;
	respond(true, {
		ok: true,
		abortedRunId,
		status: aborted ? "aborted" : "no-active-run"
	}, void 0, responseMeta);
	if (aborted) emitSessionsChanged(context, {
		sessionKey: canonicalKey,
		...abortAgentId ? { agentId: abortAgentId } : {},
		reason: "abort"
	});
} };
//#endregion
export { sessionAbortHandlers as n, resolveAbortSessionKey as t };
