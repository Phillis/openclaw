import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { x as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-Bi6bzKQE.js";
import { ai as validateSessionsSendParams } from "./src-BlUKtAtD.js";
import { s as errorShape } from "./error-codes-CMSvT5-d.js";
import { D as waitForEmbeddedAgentRunEnd, l as isEmbeddedAgentRunActive, n as abortEmbeddedAgentRun } from "./runs-CS8YarJf.js";
import "./sessions-D-jhKYGW.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-BOW0O5mU.js";
import { s as readSessionMessageCountAsync } from "./session-transcript-readers-CJcK7eRo.js";
import { E as loadGatewaySessionEntryReadOnly, T as loadGatewaySessionEntry, j as resolveDeletedAgentIdFromSessionKey } from "./session-utils-row-pCr636Wc.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId, t as resolveRequestedSessionAgentId } from "./session-request-agent-BeVvXvOY.js";
import "./session-utils-CCDcSRdK.js";
import { t as clearSessionQueues } from "./cleanup-BDBv-SVy.js";
import { t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { n as reactivateCompletedSubagentSession } from "./agent-turn-service-CGax6bVz.js";
import { r as hasTrackedActiveSessionRun } from "./session-active-runs-DKnYoEyq.js";
import { n as emitSessionsChanged } from "./session-change-event-DpwrobLa.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { t as assertValidParams } from "./validation-CsGeElrb.js";
import { n as handleChatAbortRequestWithLifecycle } from "./chat-abort-handler-D7Uf3ktA.js";
import { n as handleDirectExternalChatSend, t as chatHandlers } from "./chat-gobMPTly.js";
import { l as requireSessionKey, r as isAgentMainSessionKey } from "./sessions-shared-DsqJJjAE.js";
import { n as resolveGatewayInflightRequest } from "./inflight-C7tVF6RA.js";
import { t as resolveAbortSessionKey } from "./sessions-abort-0VOhjvUp.js";
import { n as shouldAttachPendingMessageSeq, t as sessionCreateHandlers } from "./sessions-create-0vlh59CD.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-messaging.ts
function beginSessionSteerInflight(params) {
	const originalRespond = params.request.respond;
	const dedupeKey = `sessions.steer:${params.idempotencyKey}`;
	const inflight = resolveGatewayInflightRequest({
		context: params.context,
		dedupeKey,
		idempotencyKey: params.idempotencyKey,
		respond: originalRespond
	});
	if (inflight.kind === "handled") return inflight;
	let resolveResult = () => {};
	const work = new Promise((resolve) => {
		resolveResult = resolve;
	});
	let settled = false;
	const settle = (result) => {
		if (settled) return false;
		settled = true;
		resolveResult(result);
		return true;
	};
	inflight.inflightMap.set(dedupeKey, work);
	const respond = (ok, payload, error, meta) => {
		settle({
			ok,
			...payload !== void 0 ? { payload } : {},
			...error ? { error } : {},
			...meta ? { meta } : {}
		});
		if (meta === void 0) {
			originalRespond(ok, payload, error);
			return;
		}
		originalRespond(ok, payload, error, meta);
	};
	return {
		kind: "owner",
		owner: {
			respond,
			fail: (error) => {
				const responseError = errorShape(ErrorCodes.UNAVAILABLE, formatForLog(error), { retryable: true });
				if (settle({
					ok: false,
					error: responseError
				})) originalRespond(false, void 0, responseError);
			},
			finish: () => {
				if (!settled) {
					const error = errorShape(ErrorCodes.UNAVAILABLE, "sessions.steer ended before producing a response", { retryable: true });
					settle({
						ok: false,
						error
					});
					originalRespond(false, void 0, error);
				}
				if (inflight.inflightMap.get(dedupeKey) === work) inflight.inflightMap.delete(dedupeKey);
			}
		}
	};
}
async function createAgentMainSessionForSend(params) {
	const agentId = parseAgentSessionKey(params.canonicalKey)?.agentId;
	if (!agentId) return {
		ok: false,
		error: errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${params.canonicalKey}`)
	};
	let createResult;
	await expectDefined(sessionCreateHandlers["sessions.create"], "sessions.create handler")({
		req: params.req,
		params: {
			key: params.canonicalKey,
			agentId
		},
		respond: (ok, payload, error) => {
			createResult = {
				ok,
				payload: payload && typeof payload === "object" ? payload : void 0,
				error
			};
		},
		context: params.context,
		client: params.client,
		isWebchatConnect: params.isWebchatConnect
	});
	if (!createResult) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, "sessions.create did not respond")
	};
	if (!createResult.ok) return {
		ok: false,
		error: createResult.error ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to create session")
	};
	const createdKey = normalizeOptionalString(createResult.payload?.key) ?? params.canonicalKey;
	const loaded = loadGatewaySessionEntryReadOnly(createdKey, { agentId });
	if (!loaded.entry?.sessionId) return {
		ok: false,
		error: errorShape(ErrorCodes.UNAVAILABLE, `session not created: ${createdKey}`)
	};
	return {
		ok: true,
		entry: loaded.entry,
		canonicalKey: loaded.canonicalKey,
		storePath: loaded.storePath
	};
}
async function interruptSessionRunIfActive(params) {
	const cfg = params.context.getRuntimeConfig();
	const hasTrackedRun = hasTrackedActiveSessionRun({
		context: params.context,
		requestedKey: params.requestedKey,
		canonicalKey: params.canonicalKey,
		agentId: params.agentId,
		defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, params.canonicalKey),
		excludeRunIds: params.excludeRunIds
	});
	const hasEmbeddedRun = typeof params.sessionId === "string" && params.sessionId ? isEmbeddedAgentRunActive(params.sessionId) : false;
	const hasWorkerRun = typeof params.sessionId === "string" && params.sessionId ? asWorkerInferenceControl(params.context.workerEnvironmentService)?.hasInferenceForSession(params.sessionId) ?? false : false;
	if (!hasTrackedRun && !hasEmbeddedRun && !hasWorkerRun) return { interrupted: false };
	if (hasTrackedRun || hasWorkerRun) {
		let abortOk = true;
		let abortError;
		const abortSessionKey = resolveAbortSessionKey({
			context: params.context,
			requestedKey: params.requestedKey,
			canonicalKey: params.canonicalKey,
			agentId: params.agentId,
			defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, params.canonicalKey)
		});
		await handleChatAbortRequestWithLifecycle({
			req: params.req,
			params: {
				sessionKey: abortSessionKey,
				...params.agentId ? { agentId: params.agentId } : {}
			},
			respond: (ok, _payload, error) => {
				abortOk = ok;
				abortError = error;
			},
			context: params.context,
			client: params.client,
			isWebchatConnect: params.isWebchatConnect
		}, params.excludeRunIds ? { excludeRunIds: params.excludeRunIds } : {});
		if (!abortOk) return {
			interrupted: true,
			error: abortError ?? errorShape(ErrorCodes.UNAVAILABLE, "failed to interrupt active session")
		};
	}
	if (hasEmbeddedRun && params.sessionId) abortEmbeddedAgentRun(params.sessionId);
	clearSessionQueues([
		params.requestedKey,
		params.canonicalKey,
		params.sessionId
	]);
	if (hasEmbeddedRun && params.sessionId) {
		if (!await waitForEmbeddedAgentRunEnd(params.sessionId, 15e3)) return {
			interrupted: true,
			error: errorShape(ErrorCodes.UNAVAILABLE, `Session ${params.requestedKey} is still active; try again in a moment.`)
		};
	}
	return { interrupted: true };
}
async function handleSessionSend(params) {
	if (!assertValidParams(params.params, validateSessionsSendParams, params.method, params.respond)) return;
	const p = params.params;
	const key = requireSessionKey(p.key, params.respond);
	if (!key) return;
	const cfg = params.context.getRuntimeConfig();
	const requestedAgent = resolveRequestedSessionAgentId(cfg, key, p.agentId);
	if (!requestedAgent.ok) {
		params.respond(false, void 0, requestedAgent.error);
		return;
	}
	const requestedAgentId = requestedAgent.agentId;
	const loaded = loadGatewaySessionEntry(key, { agentId: requestedAgentId });
	const { legacyKey } = loaded;
	let { entry, canonicalKey, storePath } = loaded;
	const deletedAgentId = resolveDeletedAgentIdFromSessionKey(cfg, canonicalKey, entry, { acpMetadataSessionKey: legacyKey ?? canonicalKey });
	if (deletedAgentId !== null) {
		params.respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Agent "${deletedAgentId}" no longer exists in configuration`));
		return;
	}
	const rawIdempotencyKey = p.idempotencyKey;
	const explicitIdempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : void 0;
	const idempotencyKey = explicitIdempotencyKey ?? randomUUID();
	const steerInflight = params.interruptIfActive && explicitIdempotencyKey ? beginSessionSteerInflight({
		context: params.context,
		idempotencyKey,
		request: params
	}) : void 0;
	if (steerInflight?.kind === "handled") {
		await steerInflight.done;
		return;
	}
	const steerInflightOwner = steerInflight?.owner;
	const respond = steerInflightOwner?.respond ?? params.respond;
	try {
		const dispatchChatSend = async (dispatchRespond, onAdmissionOwned) => {
			const options = {
				req: params.req,
				params: {
					sessionKey: canonicalKey,
					...requestedAgentId ? { agentId: requestedAgentId } : {},
					message: p.message,
					thinking: p.thinking,
					attachments: p.attachments,
					timeoutMs: p.timeoutMs,
					idempotencyKey
				},
				respond: dispatchRespond,
				context: params.context,
				client: params.client,
				isWebchatConnect: params.isWebchatConnect
			};
			if (onAdmissionOwned) {
				await handleDirectExternalChatSend(options, onAdmissionOwned);
				return;
			}
			await expectDefined(chatHandlers["chat.send"], "chat.send handler")(options);
		};
		const archivedSessionError = resolveSessionWorkStartError(canonicalKey, entry);
		if (archivedSessionError) {
			if (explicitIdempotencyKey) {
				await dispatchChatSend(respond);
				return;
			}
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, archivedSessionError));
			return;
		}
		if (!entry?.sessionId && !params.interruptIfActive && isAgentMainSessionKey(cfg, canonicalKey)) {
			const created = await createAgentMainSessionForSend({
				req: params.req,
				canonicalKey,
				context: params.context,
				client: params.client,
				isWebchatConnect: params.isWebchatConnect
			});
			if (!created.ok) {
				respond(false, void 0, created.error);
				return;
			}
			entry = created.entry;
			canonicalKey = created.canonicalKey;
			storePath = created.storePath;
		}
		if (!entry?.sessionId) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `session not found: ${key}`));
			return;
		}
		const admittedEntry = entry;
		const admittedSessionId = entry.sessionId;
		const readNextMessageSeq = async () => await readSessionMessageCountAsync({
			agentId: requestedAgentId,
			sessionEntry: admittedEntry,
			sessionId: admittedSessionId,
			sessionKey: canonicalKey,
			storePath
		}) + 1;
		let messageSeq;
		try {
			messageSeq = await readNextMessageSeq();
		} catch (error) {
			if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "session transcript is rebuilding; retry shortly", {
				details: { method: params.method },
				retryable: true,
				retryAfterMs: 250
			}));
			return;
		}
		let interruptedActiveRun = false;
		const onAdmissionOwned = params.interruptIfActive ? async () => {
			const interruptResult = await interruptSessionRunIfActive({
				req: params.req,
				context: params.context,
				client: params.client,
				isWebchatConnect: params.isWebchatConnect,
				requestedKey: key,
				canonicalKey,
				agentId: requestedAgentId,
				sessionId: admittedSessionId,
				excludeRunIds: /* @__PURE__ */ new Set([idempotencyKey])
			});
			if (interruptResult.error) {
				respond(false, void 0, interruptResult.error);
				return false;
			}
			interruptedActiveRun = interruptResult.interrupted;
			try {
				messageSeq = await readNextMessageSeq();
			} catch (error) {
				if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
				messageSeq = void 0;
			}
			return true;
		} : void 0;
		let sendAcked = false;
		let sendPayload;
		let sendCached = false;
		let startedRunId;
		await dispatchChatSend((ok, payload, error, meta) => {
			sendAcked = ok;
			sendPayload = payload;
			sendCached = meta?.cached === true;
			startedRunId = payload && typeof payload === "object" && typeof payload.runId === "string" ? payload.runId : void 0;
			if (ok && shouldAttachPendingMessageSeq({
				payload,
				cached: meta?.cached === true
			})) {
				respond(true, {
					...payload && typeof payload === "object" ? payload : {},
					...messageSeq !== void 0 ? { messageSeq } : {},
					...interruptedActiveRun ? { interruptedActiveRun: true } : {}
				}, void 0, meta);
				return;
			}
			respond(ok, ok && payload && typeof payload === "object" ? {
				...payload,
				...interruptedActiveRun ? { interruptedActiveRun: true } : {}
			} : payload, error, meta);
		}, onAdmissionOwned);
		if (sendAcked) {
			if (shouldAttachPendingMessageSeq({
				payload: sendPayload,
				cached: sendCached
			})) await reactivateCompletedSubagentSession({
				sessionKey: canonicalKey,
				runId: startedRunId,
				task: p.message
			});
			emitSessionsChanged(params.context, {
				sessionKey: canonicalKey,
				...requestedAgentId ? { agentId: requestedAgentId } : {},
				reason: interruptedActiveRun ? "steer" : "send"
			});
		}
	} catch (error) {
		if (steerInflightOwner) {
			steerInflightOwner.fail(error);
			return;
		}
		throw error;
	} finally {
		steerInflightOwner?.finish();
	}
}
const sessionMessagingHandlers = {
	"sessions.send": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		await handleSessionSend({
			method: "sessions.send",
			req,
			params,
			respond,
			context,
			client,
			isWebchatConnect,
			interruptIfActive: false
		});
	},
	"sessions.steer": async ({ req, params, respond, context, client, isWebchatConnect }) => {
		await handleSessionSend({
			method: "sessions.steer",
			req,
			params,
			respond,
			context,
			client,
			isWebchatConnect,
			interruptIfActive: true
		});
	}
};
//#endregion
export { sessionMessagingHandlers as n, interruptSessionRunIfActive as t };
