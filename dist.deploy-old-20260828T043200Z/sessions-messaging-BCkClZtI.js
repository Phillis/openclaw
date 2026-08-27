import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { gi as validateSessionsSendParams } from "./src-4dv5TpeQ.js";
import { P as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-B-FKZX9M.js";
import "./sessions-CdrF1uzY.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-DzPMUp4j.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { a as readSessionMessageCountAsync } from "./session-transcript-readers-CgCxlOAj.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly, l as resolveDeletedAgentIdFromSessionKey, r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { n as reactivateCompletedSubagentSession } from "./agent-turn-service-Wx3yeHr7.js";
import { n as emitSessionsChanged } from "./session-change-event-BVVK9xuQ.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { n as handleDirectExternalChatSend, t as chatHandlers } from "./chat-C9Dr0d5-.js";
import { c as requireSessionKey, n as isAgentMainSessionKey } from "./sessions-shared-BYADMHw6.js";
import { n as shouldAttachPendingMessageSeq, t as sessionCreateHandlers } from "./sessions-create-BZ5uQoKd.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server-methods/sessions-messaging.ts
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
	const respond = params.respond;
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
				idempotencyKey,
				...params.queueMode ? { queueMode: params.queueMode } : {}
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
	if (!entry?.sessionId && params.queueMode !== "interrupt" && isAgentMainSessionKey(cfg, canonicalKey)) {
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
	const onAdmissionOwned = params.queueMode === "interrupt" ? async () => {
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
	let interruptedActiveRun = false;
	await dispatchChatSend((ok, payload, error, meta) => {
		sendAcked = ok;
		sendPayload = payload;
		sendCached = meta?.cached === true;
		startedRunId = payload && typeof payload === "object" && typeof payload.runId === "string" ? payload.runId : void 0;
		interruptedActiveRun = ok && payload !== null && typeof payload === "object" && "interruptedActiveRun" in payload && payload.interruptedActiveRun === true;
		if (ok && shouldAttachPendingMessageSeq({
			payload,
			cached: meta?.cached === true
		})) {
			respond(true, {
				...payload && typeof payload === "object" ? payload : {},
				...messageSeq !== void 0 ? { messageSeq } : {}
			}, void 0, meta);
			return;
		}
		respond(ok, ok && payload && typeof payload === "object" ? { ...payload } : payload, error, meta);
	}, onAdmissionOwned);
	if (sendAcked) {
		if (shouldAttachPendingMessageSeq({
			payload: sendPayload,
			cached: sendCached
		})) await reactivateCompletedSubagentSession({
			sessionKey: canonicalKey,
			runId: startedRunId,
			task: p.message,
			gatewayContextResolver: params.context.resolveGatewayContext
		});
		emitSessionsChanged(params.context, {
			sessionKey: canonicalKey,
			...requestedAgentId ? { agentId: requestedAgentId } : {},
			reason: interruptedActiveRun ? "steer" : "send"
		});
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
			isWebchatConnect
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
			queueMode: "interrupt"
		});
	}
};
//#endregion
export { sessionMessagingHandlers };
