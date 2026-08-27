import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { s as resolvePreauthHandshakeTimeoutMs } from "./timeouts-D2XMKe-X.js";
import { a as isLoopbackAddress } from "./net-BRYQcUG8.js";
import { u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-Bw_B6Pm2.js";
import { t as withSerializedRateLimitAttempt } from "./rate-limit-attempt-serialization-DPdAzsUS.js";
import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import "./version-CwNT1gaY.js";
import { r as GATEWAY_STARTUP_PENDING_CLOSE_CAUSE } from "./startup-unavailable-CRTM-3cy.js";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.js";
import { _ as tryBeginGatewayRootWorkAdmission, h as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-QDz202p9.js";
import { l as isWebchatClient } from "./message-channel-T4W5YOto.js";
import { $a as validateWorkerHeartbeatParams, Ja as validateWorkerConnectRequestFrame, Wn as validateRequestFrame, eo as validateWorkerLiveEventParams, no as validateWorkerSessionsSpawnParams, ro as validateWorkerTranscriptCommitParams, to as validateWorkerSessionsSendParams } from "./src-BlUKtAtD.js";
import { Y as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES, l as WORKER_PROTOCOL_METHODS, n as WORKER_HEARTBEAT_INTERVAL_MS } from "./worker-admission-R0mXKdG7.js";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, f as validateWorkerInferenceCancelParams, m as validateWorkerInferenceStartParams, r as WORKER_INFERENCE_METHODS } from "./worker-inference-DaOiVsCq.js";
import { i as upsertPresence, n as touchPresence } from "./system-presence-5NV70380.js";
import { n as logRejectedLargePayload } from "./diagnostic-payload-BRcHXXpb.js";
import { a as MAX_PAYLOAD_BYTES, i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES } from "./server-constants-DKuFNbQH.js";
import { t as rawDataByteLength } from "./ws-C3ckvj65.js";
import { c as recordPairedNodeDisconnection } from "./device-pairing-node-koBZUtkr.js";
import { s as removeRemoteNodeInfo } from "./remote-RL6whgVY.js";
import { t as resolveHostedPluginSurfaceUrl } from "./hosted-plugin-surface-url-D1_hpwo8.js";
import { n as logWs, t as formatForLog } from "./ws-log-DAJ6wT2O.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BWx0sDdz.js";
import "./server-utils-C4mKOz6b.js";
import { a as incrementPresenceVersion, r as getHealthVersion } from "./health-state-BTwuEAza.js";
import { i as clearNodeWakeState } from "./node-wake-state-CLsta4Jn.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-DJLMOloJ.js";
import { t as cleanupTalkConnection } from "./talk-session-registry-x9YkVNCk.js";
import { i as WS_HANDSHAKE_PHASES, o as takePublicWorkerIngress } from "./ws-types-DrkOhGsT.js";
import "./placement-session-tool-operations-Ba4gGaev.js";
import { n as buildHandshakeAuthLogKey, r as shouldLimitMissingCredentialAuthLog, t as HandshakeAuthLogLimiter } from "./handshake-auth-log-limiter-Ic4hLe46.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/server/ws-connection-diagnostics.ts
const LOG_HEADER_MAX_LEN = 300;
const LOG_HEADER_FORMAT_REGEX = /\p{Cf}/gu;
function replaceControlChars(value) {
	let cleaned = "";
	for (const char of value) {
		const codePoint = char.codePointAt(0);
		if (codePoint !== void 0 && (codePoint <= 31 || codePoint >= 127 && codePoint <= 159)) {
			cleaned += " ";
			continue;
		}
		cleaned += char;
	}
	return cleaned;
}
function stringMetaValue(meta, key) {
	const value = meta[key];
	return typeof value === "string" && value.trim().length > 0 ? value : void 0;
}
function sanitizeWsLogValue(value) {
	if (!value) return;
	const cleaned = replaceControlChars(value).replace(LOG_HEADER_FORMAT_REGEX, " ").replace(/\s+/g, " ").trim();
	if (!cleaned) return;
	if (cleaned.length <= LOG_HEADER_MAX_LEN) return cleaned;
	return truncateUtf16Safe(cleaned, LOG_HEADER_MAX_LEN);
}
function formatSocketEndpoint(address, port) {
	if (!address) return;
	if (port === void 0) return address;
	return address.includes(":") ? `[${address}]:${port}` : `${address}:${port}`;
}
function resolveSocketAddress(socket) {
	const rawSocket = socket["_socket"];
	const remoteAddr = rawSocket?.remoteAddress;
	const remotePort = rawSocket?.remotePort;
	const localAddr = rawSocket?.localAddress;
	const localPort = rawSocket?.localPort;
	const remoteEndpoint = formatSocketEndpoint(remoteAddr, remotePort);
	const localEndpoint = formatSocketEndpoint(localAddr, localPort);
	return {
		remoteAddr,
		remotePort,
		localAddr,
		localPort,
		endpoint: remoteEndpoint && localEndpoint ? `${remoteEndpoint}->${localEndpoint}` : remoteEndpoint ?? localEndpoint
	};
}
function isWsPayloadLimitError(err) {
	if (!err || typeof err !== "object") return false;
	if (err.code === "WS_ERR_UNSUPPORTED_MESSAGE_LENGTH") return true;
	const message = err.message;
	return typeof message === "string" && /max payload size exceeded/i.test(message);
}
//#endregion
//#region src/gateway/server/ws-connection/node-lifecycle-dispatch.ts
const NODE_LIFECYCLE_METHODS = /* @__PURE__ */ new Set(["node.invoke.progress", "node.invoke.result"]);
const NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS = 1e3;
/**
* Tracks admitted node progress/result requests so physical disconnect cleanup
* drains their existing work before retiring invokes. It does not add a queue.
*/
var GatewayNodeLifecycleDispatchTracker = class {
	constructor() {
		this.active = /* @__PURE__ */ new Set();
	}
	hasActive() {
		return this.active.size > 0;
	}
	dispatch(method, run) {
		const execution = run();
		if (!NODE_LIFECYCLE_METHODS.has(method)) return execution;
		const settled = execution.then(() => void 0, () => void 0);
		this.active.add(settled);
		settled.finally(() => {
			this.active.delete(settled);
		});
		return execution;
	}
	async drain(timeoutMs = NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS) {
		const deadlineAt = Date.now() + Math.max(0, timeoutMs);
		while (this.active.size > 0) {
			const remainingMs = deadlineAt - Date.now();
			if (remainingMs <= 0) return false;
			let timeout;
			const timedOut = Symbol("node-lifecycle-dispatch-timeout");
			const result = await Promise.race([Promise.allSettled(this.active), new Promise((resolve) => {
				timeout = setTimeout(() => resolve(timedOut), remainingMs);
			})]);
			if (timeout) clearTimeout(timeout);
			if (result === timedOut) return false;
		}
		return true;
	}
};
//#endregion
//#region src/gateway/server/ws-connection/worker-admission-boundary.ts
/** Serialize public credential checks and charge only failed admission attempts. */
async function runWorkerAdmissionBoundary(params) {
	const run = async () => {
		const publicAdmission = params.publicAdmission;
		const rateCheck = publicAdmission?.rateLimiter?.check(publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
		if (rateCheck && !rateCheck.allowed) return {
			ok: false,
			reason: "rate-limited"
		};
		const admission = await params.service?.admitWorker(params.admission) ?? {
			ok: false,
			reason: "environment-unavailable"
		};
		if (!admission.ok) {
			publicAdmission?.rateLimiter?.recordFailure(publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
			return admission;
		}
		const ownershipFailure = params.service?.validateWorkerConnection(admission.identity);
		if (ownershipFailure) {
			publicAdmission?.rateLimiter?.recordFailure(publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
			return {
				ok: false,
				reason: ownershipFailure
			};
		}
		if (!params.claim(admission.identity)) return {
			ok: false,
			reason: "claim-rejected"
		};
		publicAdmission?.rateLimiter?.reset(publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
		return admission;
	};
	if (!params.publicAdmission?.rateLimiter) return await run();
	return await withSerializedRateLimitAttempt({
		ip: params.publicAdmission.clientIp,
		scope: AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION,
		run
	});
}
//#endregion
//#region src/gateway/server/ws-connection/worker-connection-frames.ts
function workerProtocolError(reason, options = {}) {
	return {
		code: options.code ?? ErrorCodes.INVALID_REQUEST,
		message: options.message ?? "worker protocol request rejected",
		details: { reason },
		...options.retryable === void 0 ? {} : { retryable: options.retryable },
		...options.retryAfterMs === void 0 ? {} : { retryAfterMs: options.retryAfterMs }
	};
}
function workerMaxPayload(identity) {
	return identity.protocolFeatures.includes("worker-inference-v1") ? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES : WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
}
function buildWorkerHello(identity) {
	return {
		type: "worker-hello-ok",
		environmentId: identity.environmentId,
		sessionId: identity.sessionId,
		ownerEpoch: identity.ownerEpoch,
		rpcSetVersion: identity.rpcSetVersion,
		protocolFeatures: [...identity.protocolFeatures],
		credentialExpiresAtMs: identity.credentialExpiresAtMs,
		policy: {
			heartbeatIntervalMs: WORKER_HEARTBEAT_INTERVAL_MS,
			maxPayload: workerMaxPayload(identity)
		}
	};
}
function workerTranscriptCommitError(reason) {
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "worker transcript commit rejected",
		details: { reason }
	};
}
function workerLiveEventError(details) {
	return {
		code: ErrorCodes.INVALID_REQUEST,
		message: "worker live event rejected",
		details
	};
}
function workerInferenceError(reason) {
	return {
		code: reason === "provider-error" ? ErrorCodes.UNAVAILABLE : ErrorCodes.INVALID_REQUEST,
		message: "worker inference request rejected",
		details: { reason }
	};
}
//#endregion
//#region src/gateway/server/ws-connection/worker-connection.ts
const MAX_QUEUED_WORKER_FRAMES = 16;
const MAX_QUEUED_WORKER_BYTES = 32 * 1024 * 1024;
function rejectWorkerRequest(params) {
	params.warn(`worker protocol request rejected reason=${params.reason}`);
	params.respond(false, void 0, workerProtocolError(params.reason));
	queueMicrotask(() => params.close(1008, params.reason));
}
function setSocketMaxPayload(socket, maxPayload) {
	const receiver = socket["_receiver"];
	if (receiver) receiver["_maxPayload"] = maxPayload;
}
/** Closed worker dispatcher. It never calls the generic gateway method registry. */
async function dispatchWorkerRequest(params) {
	const service = params.service;
	if (!service) {
		rejectWorkerRequest({
			...params,
			reason: "environment-unavailable"
		});
		return;
	}
	const ownershipFailure = service.validateWorkerConnection(params.identity);
	if (ownershipFailure) {
		rejectWorkerRequest({
			...params,
			reason: ownershipFailure
		});
		return;
	}
	if (params.request.method === WORKER_INFERENCE_METHODS[0]) {
		if (!params.identity.protocolFeatures.includes("worker-inference-v1")) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		if (!validateWorkerInferenceStartParams(params.request.params)) {
			params.respond(false, void 0, workerInferenceError("invalid-context"));
			return;
		}
		if (!service.startInference) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		const outcome = service.startInference(params.identity, params.request.params, {
			connectionId: params.connectionId,
			send: (frame) => params.send(frame)
		});
		if (outcome.ok) {
			params.respond(true, outcome.result);
			outcome.launch();
			return;
		}
		if ("closeReason" in outcome) {
			rejectWorkerRequest({
				...params,
				reason: outcome.closeReason
			});
			return;
		}
		params.respond(false, void 0, workerInferenceError(outcome.reason));
		return;
	}
	if (params.request.method === WORKER_INFERENCE_METHODS[1]) {
		if (!params.identity.protocolFeatures.includes("worker-inference-v1")) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		if (!validateWorkerInferenceCancelParams(params.request.params)) {
			params.respond(false, void 0, workerInferenceError("invalid-context"));
			return;
		}
		if (!service.cancelInference) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		const outcome = service.cancelInference(params.identity, params.request.params);
		if (outcome.ok) {
			params.respond(true, outcome.result);
			return;
		}
		if ("closeReason" in outcome) {
			rejectWorkerRequest({
				...params,
				reason: outcome.closeReason
			});
			return;
		}
		params.respond(false, void 0, workerInferenceError(outcome.reason));
		return;
	}
	if (params.request.method === WORKER_PROTOCOL_METHODS[1]) {
		if (!params.identity.protocolFeatures.includes("worker-transcript-commit-v1")) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		if (!validateWorkerTranscriptCommitParams(params.request.params)) {
			params.respond(false, void 0, workerTranscriptCommitError("invalid-batch"));
			return;
		}
		const outcome = await service.commitTranscript(params.identity, params.request.params);
		if (outcome.ok) {
			params.respond(true, outcome.result);
			return;
		}
		if ("closeReason" in outcome) {
			rejectWorkerRequest({
				...params,
				reason: outcome.closeReason
			});
			return;
		}
		params.respond(false, void 0, workerTranscriptCommitError(outcome.reason));
		return;
	}
	if (params.request.method === WORKER_PROTOCOL_METHODS[2]) {
		if (!params.identity.protocolFeatures.includes("worker-live-event-v1")) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		if (!validateWorkerLiveEventParams(params.request.params)) {
			params.respond(false, void 0, workerLiveEventError({ reason: "invalid-event" }));
			return;
		}
		const outcome = await service.pushLiveEvent(params.identity, params.request.params);
		if (outcome.ok) {
			params.respond(true, outcome.result);
			return;
		}
		if ("closeReason" in outcome) {
			rejectWorkerRequest({
				...params,
				reason: outcome.closeReason
			});
			return;
		}
		params.respond(false, void 0, workerLiveEventError(outcome.details));
		return;
	}
	if (params.request.method === WORKER_PROTOCOL_METHODS[3] || params.request.method === WORKER_PROTOCOL_METHODS[4]) {
		if (!params.identity.protocolFeatures.includes("worker-session-tools-v1")) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		if (!service.executeSessionTool) {
			rejectWorkerRequest({
				...params,
				reason: "method-not-allowed"
			});
			return;
		}
		const isSpawn = params.request.method === WORKER_PROTOCOL_METHODS[3];
		if (!(isSpawn ? validateWorkerSessionsSpawnParams(params.request.params) : validateWorkerSessionsSendParams(params.request.params))) {
			params.respond(false, void 0, workerProtocolError("invalid-frame"));
			return;
		}
		const outcome = await service.executeSessionTool(params.identity, isSpawn ? "sessions_spawn" : "sessions_send", params.request.params, params.signal);
		if (outcome.ok) {
			params.respond(true, outcome.result);
			return;
		}
		if ("closeReason" in outcome) {
			rejectWorkerRequest({
				...params,
				reason: outcome.closeReason
			});
			return;
		}
		params.respond(false, void 0, workerProtocolError(outcome.reason));
		return;
	}
	if (params.request.method !== WORKER_PROTOCOL_METHODS[0]) {
		rejectWorkerRequest({
			...params,
			reason: "method-not-allowed"
		});
		return;
	}
	if (!validateWorkerHeartbeatParams(params.request.params)) {
		rejectWorkerRequest({
			...params,
			reason: "invalid-heartbeat"
		});
		return;
	}
	const result = {
		receivedAtMs: Date.now(),
		status: "ok",
		ownerEpoch: params.identity.ownerEpoch
	};
	params.respond(true, result);
}
/** Dedicated ingress handler: worker frames never enter the generic message handler. */
function attachWorkerWsMessageHandler(params) {
	let expiryTimer;
	let disposed = false;
	const sessionOperations = /* @__PURE__ */ new Set();
	const cleanup = () => {
		if (disposed) return;
		disposed = true;
		clearTimeout(expiryTimer);
		sessionOperations.clear();
		params.socket.off("message", onMessage);
	};
	const closeWorker = (code, reason) => {
		cleanup();
		params.close(code, reason);
	};
	const failHandshake = (code, reason) => {
		params.publicAdmission?.rateLimiter?.recordFailure(params.publicAdmission.clientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
		params.setHandshakeState("failed");
		params.setCloseCause(reason);
		params.logWsControl.warn(`worker admission rejected reason=${reason}`);
		closeWorker(code, reason);
	};
	const failFrame = (code, reason) => {
		params.setCloseCause(reason);
		params.logGateway.warn(`worker protocol request rejected reason=${reason}`);
		closeWorker(code, reason);
	};
	const sendError = (id, reason, error = workerProtocolError(reason), code = 1008) => {
		params.send({
			type: "res",
			id,
			ok: false,
			error
		});
		queueMicrotask(() => closeWorker(code, reason));
	};
	const rejectAdmission = (rejection) => {
		const internalReason = rejection.internalReason ?? rejection.reason;
		const wireReason = rejection.opaqueOnPublicIngress && params.publicAdmission || rejection.reason === "rate-limited" ? "invalid-handshake" : rejection.reason;
		const wireError = rejection.error ?? workerProtocolError(wireReason, { message: "worker admission rejected" });
		params.setHandshakeState("failed");
		params.setCloseCause(internalReason);
		params.logWsControl.warn(`worker admission rejected reason=${internalReason}`);
		sendError(rejection.id, wireReason, wireError, rejection.code ?? 1008);
	};
	const handleConnect = async (connect, id, admissionOpen) => {
		if (!admissionOpen || params.isStartupPending?.()) {
			rejectAdmission({
				id,
				reason: "gateway-unavailable",
				error: workerProtocolError("gateway-unavailable", {
					code: ErrorCodes.UNAVAILABLE,
					message: "worker gateway unavailable",
					retryable: true,
					retryAfterMs: 500
				}),
				code: 1013
			});
			return;
		}
		if (params.ingress === "public" && !params.publicAdmission) {
			rejectAdmission({
				id,
				reason: "invalid-handshake",
				internalReason: "public-ingress-context-missing"
			});
			return;
		}
		if (connect.minProtocol > 4 || connect.maxProtocol < 4) {
			rejectAdmission({
				id,
				reason: "protocol-mismatch"
			});
			return;
		}
		const admission = await runWorkerAdmissionBoundary({
			service: params.service,
			admission: connect.admission,
			publicAdmission: params.publicAdmission,
			claim: (identity) => {
				const client = {
					socket: params.socket,
					connect: {
						minProtocol: connect.minProtocol,
						maxProtocol: connect.maxProtocol,
						client: connect.client,
						role: "worker",
						scopes: []
					},
					connId: params.connId,
					connectionKind: "worker",
					worker: identity,
					usesSharedGatewayAuth: false
				};
				params.clearHandshakeTimer();
				params.advanceHandshakePhase("auth_validated");
				if (!params.setClient(client)) {
					params.setHandshakeState("failed");
					return false;
				}
				return true;
			}
		});
		if (!admission.ok) {
			if (admission.reason === "claim-rejected") return;
			rejectAdmission({
				id,
				reason: admission.reason,
				opaqueOnPublicIngress: true
			});
			return;
		}
		params.setHandshakeState("connected");
		params.advanceHandshakePhase("session_attached");
		setSocketMaxPayload(params.socket, workerMaxPayload(admission.identity));
		params.advanceHandshakePhase("hello_payload_prepared");
		params.send({
			type: "res",
			id,
			ok: true,
			payload: buildWorkerHello(admission.identity)
		});
		params.advanceHandshakePhase("ready");
		expiryTimer = setTimeout(() => {
			const failure = params.service?.validateWorkerConnection(admission.identity);
			if (failure) closeWorker(1008, failure);
			else if (!params.service) closeWorker(1008, "credential-expired");
		}, Math.max(0, admission.identity.credentialExpiresAtMs - Date.now()));
		expiryTimer.unref?.();
	};
	const handleMessage = async (data, admissionOpen) => {
		const client = params.getClient();
		if (client?.invalidated) {
			failFrame(1008, "credential-replaced");
			return;
		}
		if (client && !admissionOpen) {
			failFrame(1013, "gateway-unavailable");
			return;
		}
		const frameBytes = rawDataByteLength(data);
		if (frameBytes > (client?.worker ? workerMaxPayload(client.worker) : 65536)) {
			if (client) failFrame(1009, "invalid-frame");
			else failHandshake(1009, "invalid-handshake");
			return;
		}
		let parsed;
		try {
			parsed = JSON.parse(rawDataToString(data));
		} catch {
			if (client) failFrame(1008, "invalid-frame");
			else failHandshake(1008, "invalid-handshake");
			return;
		}
		if (!client) {
			if (!validateWorkerConnectRequestFrame(parsed)) {
				failHandshake(1008, "invalid-handshake");
				return;
			}
			params.setLastFrameMeta({
				type: "req",
				method: "connect"
			});
			await handleConnect(parsed.params, parsed.id, admissionOpen);
			return;
		}
		if (!validateRequestFrame(parsed) || parsed.id.length > 128 || parsed.method.length > 64) {
			params.logGateway.warn("worker protocol request rejected reason=invalid-frame");
			closeWorker(1008, "invalid-frame");
			return;
		}
		if (frameBytes > 65536 && parsed.method !== WORKER_INFERENCE_METHODS[0]) {
			failFrame(1009, "invalid-frame");
			return;
		}
		if (parsed.method === WORKER_PROTOCOL_METHODS[0] || parsed.method === WORKER_PROTOCOL_METHODS[1] || parsed.method === WORKER_PROTOCOL_METHODS[2] || parsed.method === WORKER_PROTOCOL_METHODS[3] || parsed.method === WORKER_PROTOCOL_METHODS[4] || parsed.method === WORKER_INFERENCE_METHODS[0] || parsed.method === WORKER_INFERENCE_METHODS[1]) params.setLastFrameMeta({
			type: "req",
			method: parsed.method
		});
		if (!client.worker) {
			closeWorker(1008, "environment-unavailable");
			return;
		}
		const respond = (ok, payload, error) => {
			if (disposed || params.isClosed() || params.getClient() !== client || client.invalidated) return;
			params.send(ok ? {
				type: "res",
				id: parsed.id,
				ok,
				payload
			} : {
				type: "res",
				id: parsed.id,
				ok,
				error
			});
		};
		const dispatch = (signal) => dispatchWorkerRequest({
			request: parsed,
			identity: client.worker,
			connectionId: params.connId,
			service: params.service,
			send: (frame) => params.send(frame),
			respond,
			close: closeWorker,
			warn: (message) => params.logGateway.warn(message),
			...signal ? { signal } : {}
		});
		if (parsed.method === WORKER_PROTOCOL_METHODS[3] || parsed.method === WORKER_PROTOCOL_METHODS[4]) {
			if (sessionOperations.has(parsed.id)) {
				failFrame(1008, "invalid-frame");
				return;
			}
			if (sessionOperations.size >= 4) {
				respond(false, void 0, workerProtocolError("gateway-unavailable"));
				return;
			}
			sessionOperations.add(parsed.id);
			runWithGatewayIndependentRootWorkContinuation(() => dispatch()).catch(() => {
				respond(false, void 0, workerProtocolError("gateway-unavailable"));
			}).finally(() => {
				sessionOperations.delete(parsed.id);
			});
			return;
		}
		await dispatch();
	};
	let queue = Promise.resolve();
	let pendingFrames = 0;
	let pendingBytes = 0;
	function onMessage(data) {
		if (disposed) return;
		const frameBytes = rawDataByteLength(data);
		if (pendingFrames >= MAX_QUEUED_WORKER_FRAMES || pendingBytes + frameBytes > MAX_QUEUED_WORKER_BYTES) {
			if (params.getClient()) failFrame(1008, "invalid-frame");
			else failHandshake(1008, "invalid-handshake");
			return;
		}
		pendingFrames += 1;
		pendingBytes += frameBytes;
		queue = queue.then(async () => {
			if (disposed || params.isClosed()) return;
			const admission = tryBeginGatewayRootWorkAdmission();
			if (!admission) {
				await handleMessage(data, false);
				return;
			}
			try {
				await admission.run(() => handleMessage(data, true));
			} finally {
				admission.release();
			}
		}).catch(() => {
			if (disposed) return;
			if (params.getClient()) failFrame(1011, "gateway-unavailable");
			else failHandshake(1011, "gateway-unavailable");
		}).finally(() => {
			pendingFrames -= 1;
			pendingBytes -= frameBytes;
		});
	}
	params.socket.on("message", onMessage);
	return cleanup;
}
//#endregion
//#region src/gateway/server/ws-connection.ts
const MAX_QUEUED_MESSAGE_HANDLER_FRAMES = 16;
const unauthorizedCloseBeforeConnectLogLimiter = new HandshakeAuthLogLimiter();
function attachGatewayWsMessageHandlerOnDemand(params) {
	const queued = [];
	const queueMessage = (data) => {
		if (queued.length >= MAX_QUEUED_MESSAGE_HANDLER_FRAMES) {
			params.setCloseCause("message-handler-loading-overflow", { queuedFrames: queued.length });
			params.close(1008, "gateway message handler loading");
			return;
		}
		queued.push(data);
	};
	params.socket.on("message", queueMessage);
	import("./message-handler-D92A9IVO.js").then(({ attachGatewayWsMessageHandler }) => {
		params.socket.off("message", queueMessage);
		if (params.isClosed()) return;
		attachGatewayWsMessageHandler(params);
		for (const data of queued) params.socket.emit("message", data);
	}).catch((error) => {
		params.socket.off("message", queueMessage);
		params.setCloseCause("message-handler-load-failed", { error: formatErrorMessage(error) });
		params.logWsControl.warn(`failed to load ws message handler conn=${params.connId}: ${formatErrorMessage(error)}`);
		params.close(1011, "gateway message handler unavailable");
	});
}
function attachGatewayWsConnectionHandler(params) {
	const { wss, clients, preauthConnectionBudget, port, pluginSurfaceScheme, getPluginNodeCapabilities, getResolvedAuth, getRequiredSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), getRuntimeConfig().gateway?.trustedProxies), rateLimiter, browserRateLimiter, nodeReapprovalCoordinator, isStartupPending, isControlUiDeviceAuthMigrationPending, gatewayMethods, events, refreshHealthSnapshot, logGateway, logHealth, logWsControl, extraHandlers, getMethodRegistry, broadcast, buildRequestContext, workerConnectionService } = params;
	const originCheckMetrics = { hostHeaderFallbackAccepted: 0 };
	wss.on("connection", (socket, upgradeReq) => {
		let client = null;
		let closed = false;
		const openedAt = Date.now();
		const connId = randomUUID();
		const ingressSocket = socket;
		const connectionKind = ingressSocket["__openclawConnectionKind"] ?? "gateway";
		const workerIngress = ingressSocket["__openclawWorkerIngress"] ?? "loopback";
		const publicWorkerIngress = workerIngress === "public" ? takePublicWorkerIngress(socket) : void 0;
		const connectionPreauthBudget = ingressSocket["__openclawPreauthBudget"] ?? preauthConnectionBudget;
		const { remoteAddr, remotePort, localAddr, localPort, endpoint } = resolveSocketAddress(socket);
		const preauthBudgetKey = socket["__openclawPreauthBudgetKey"];
		socket["__openclawPreauthBudgetClaimed"] = true;
		const headerValue = (value) => Array.isArray(value) ? value[0] : value;
		const requestHost = headerValue(upgradeReq.headers.host);
		const requestOrigin = headerValue(upgradeReq.headers.origin);
		const requestUserAgent = headerValue(upgradeReq.headers["user-agent"]);
		const forwardedFor = headerValue(upgradeReq.headers["x-forwarded-for"]);
		const realIp = headerValue(upgradeReq.headers["x-real-ip"]);
		const openedDuringStartup = isStartupPending?.() === true;
		const pluginNodeCapabilities = connectionKind === "gateway" ? getPluginNodeCapabilities?.() ?? [] : [];
		const pluginSurfaceBaseUrl = pluginNodeCapabilities.length > 0 ? resolveHostedPluginSurfaceUrl({
			port,
			forwardedHost: upgradeReq.headers["x-forwarded-host"],
			requestHost: upgradeReq.headers.host,
			forwardedProto: upgradeReq.headers["x-forwarded-proto"],
			localAddress: upgradeReq.socket?.localAddress,
			scheme: pluginSurfaceScheme
		}) : void 0;
		logWs("in", "open", {
			connId,
			remoteAddr,
			remotePort,
			localAddr,
			localPort,
			endpoint
		});
		let handshakeState = "pending";
		let lastHandshakePhase = "tcp_accepted";
		let holdsPreauthBudget = true;
		let closeCause;
		let closeMeta = {};
		let lastFrameType;
		let lastFrameMethod;
		let lastFrameId;
		let hasReceivedPreauthFrame = false;
		const nodeLifecycleDispatch = new GatewayNodeLifecycleDispatchTracker();
		socket.once("message", () => {
			hasReceivedPreauthFrame = true;
		});
		const advanceHandshakePhase = (next) => {
			if (WS_HANDSHAKE_PHASES.indexOf(next) > WS_HANDSHAKE_PHASES.indexOf(lastHandshakePhase)) lastHandshakePhase = next;
		};
		const setCloseCause = (cause, meta) => {
			if (!closeCause) closeCause = cause;
			if (meta && Object.keys(meta).length > 0) closeMeta = {
				...closeMeta,
				...meta
			};
		};
		const releasePreauthBudget = () => {
			if (!holdsPreauthBudget) return;
			holdsPreauthBudget = false;
			connectionPreauthBudget.release(preauthBudgetKey);
		};
		const setLastFrameMeta = (meta) => {
			if (meta.type || meta.method || meta.id) {
				lastFrameType = meta.type ?? lastFrameType;
				lastFrameMethod = meta.method ?? lastFrameMethod;
				lastFrameId = meta.id ?? lastFrameId;
			}
		};
		let pingTimer;
		let cleanupWorkerConnection;
		let awaitingPong = false;
		let retainClientUntilNodeDrain = false;
		const handshakeTimeoutMs = resolvePreauthHandshakeTimeoutMs({ configuredTimeoutMs: params.preauthHandshakeTimeoutMs });
		const handshakeTimer = setTimeout(() => {
			if (!client) {
				handshakeState = "failed";
				setCloseCause("handshake-timeout", {
					handshakeMs: Date.now() - openedAt,
					endpoint,
					phase: lastHandshakePhase
				});
				logWsControl.warn(`handshake timeout conn=${connId} peer=${endpoint ?? "n/a"} remote=${remoteAddr ?? "?"} phase=${lastHandshakePhase}`);
				if (connectionKind === "worker") close(1008, "invalid-handshake");
				else close();
			}
		}, handshakeTimeoutMs);
		const retireTransport = (code = 1e3, reason) => {
			if (closed) return;
			closed = true;
			clearTimeout(handshakeTimer);
			clearInterval(pingTimer);
			cleanupWorkerConnection?.();
			releasePreauthBudget();
			try {
				socket.close(code, reason);
			} catch {}
		};
		const close = (code = 1e3, reason) => {
			retireTransport(code, reason);
			if (client && !retainClientUntilNodeDrain) clients.delete(client);
		};
		const send = (obj) => {
			if (closed) return;
			if (socket.bufferedAmount > 52428800) {
				logRejectedLargePayload({
					surface: "gateway.ws.outbound_buffer",
					bytes: socket.bufferedAmount,
					limitBytes: MAX_BUFFERED_BYTES,
					reason: "ws_send_buffer_close"
				});
				setCloseCause("outbound-buffer-exceeded", {
					bytes: socket.bufferedAmount,
					limitBytes: MAX_BUFFERED_BYTES
				});
				close(1008, connectionKind === "worker" ? "slow-consumer" : "slow consumer");
				return;
			}
			try {
				socket.send(JSON.stringify(obj));
			} catch {}
		};
		const connectNonce = randomUUID();
		if (connectionKind === "gateway") send({
			type: "event",
			event: "connect.challenge",
			payload: {
				nonce: connectNonce,
				ts: Date.now()
			}
		});
		advanceHandshakePhase("ws_upgrade_started");
		socket.once("error", (err) => {
			if (isWsPayloadLimitError(err)) logRejectedLargePayload({
				surface: client ? "gateway.ws.frame" : "gateway.ws.preauth",
				limitBytes: connectionKind === "worker" ? WORKER_PROTOCOL_MAX_PAYLOAD_BYTES : client ? MAX_PAYLOAD_BYTES : MAX_PREAUTH_PAYLOAD_BYTES,
				reason: client ? "ws_frame_limit" : "preauth_frame_limit"
			});
			logWsControl.warn(`error conn=${connId} remote=${remoteAddr ?? "?"}: ${formatErrorMessage(err)}`);
			if (connectionKind === "worker") close(1008, client ? "invalid-frame" : "invalid-handshake");
			else close();
		});
		socket.on("pong", () => {
			awaitingPong = false;
			if (client?.presenceKey) touchPresence(client.presenceKey);
		});
		const isNoisySwiftPmHelperClose = (userAgent, remote) => normalizeLowercaseStringOrEmpty(userAgent).includes("swiftpm-testing-helper") && isLoopbackAddress(remote);
		const isExpectedLocalAppStartupAbort = (code) => openedDuringStartup && (code === 1001 || code === 1006) && lastHandshakePhase === "ws_upgrade_started" && !hasReceivedPreauthFrame && lastFrameType === void 0 && normalizeLowercaseStringOrEmpty(requestUserAgent).startsWith("openclaw/") && isLoopbackAddress(remoteAddr);
		const handleSocketClose = async (code, reason) => {
			const durationMs = Date.now() - openedAt;
			const logForwardedFor = sanitizeWsLogValue(forwardedFor);
			const logOrigin = sanitizeWsLogValue(requestOrigin);
			const logHost = sanitizeWsLogValue(requestHost);
			const logUserAgent = sanitizeWsLogValue(requestUserAgent);
			const logReason = sanitizeWsLogValue(reason?.toString());
			const handshakeIncomplete = lastHandshakePhase !== "ready";
			const closeContext = {
				cause: closeCause,
				handshake: handshakeState,
				...handshakeIncomplete ? { phase: lastHandshakePhase } : {},
				durationMs,
				lastFrameType,
				lastFrameMethod,
				lastFrameId,
				host: logHost,
				origin: logOrigin,
				userAgent: logUserAgent,
				forwardedFor: logForwardedFor,
				remoteAddr,
				remotePort,
				localAddr,
				localPort,
				endpoint,
				...closeMeta
			};
			if (!client) {
				const isExpectedStartupRetryClose = closeCause === GATEWAY_STARTUP_PENDING_CLOSE_CAUSE;
				const logFn = isNoisySwiftPmHelperClose(requestUserAgent, remoteAddr) || isExpectedStartupRetryClose || isExpectedLocalAppStartupAbort(code) ? logWsControl.debug : logWsControl.warn;
				const authReason = stringMetaValue(closeMeta, "authReason");
				const closeLogDecision = closeCause === "unauthorized" && shouldLimitMissingCredentialAuthLog({
					reason: authReason,
					authProvided: "none"
				}) ? unauthorizedCloseBeforeConnectLogLimiter.register(buildHandshakeAuthLogKey({
					reason: authReason,
					remoteAddr,
					client: stringMetaValue(closeMeta, "clientDisplayName") ?? stringMetaValue(closeMeta, "client"),
					mode: stringMetaValue(closeMeta, "mode"),
					authProvided: "none"
				})) : {
					shouldLog: true,
					suppressedSinceLastLog: 0
				};
				if (closeLogDecision.shouldLog) {
					const suppressedText = closeLogDecision.suppressedSinceLastLog > 0 ? ` suppressed=${closeLogDecision.suppressedSinceLastLog}` : "";
					logFn(`closed before connect conn=${connId} peer=${endpoint ?? "n/a"} remote=${remoteAddr ?? "?"} fwd=${logForwardedFor || "n/a"} origin=${logOrigin || "n/a"} host=${logHost || "n/a"} ua=${logUserAgent || "n/a"} code=${code ?? "n/a"} reason=${logReason || "n/a"} phase=${lastHandshakePhase}${suppressedText}`, closeContext);
				}
			}
			if (client && isWebchatClient(client.connect.client)) logWsControl.info(`webchat disconnected code=${code} reason=${logReason || "n/a"} conn=${connId}`);
			if (client?.authenticatedUserId) logWsControl.info(`authenticated user disconnected code=${code} reason=${logReason || "n/a"} conn=${connId} user=${formatForLog(client.authenticatedUserId)}`);
			if (connectionKind === "gateway") {
				const context = buildRequestContext();
				cleanupTalkConnection(connId, logGateway);
				context.unsubscribeAllSessionEvents(connId);
				context.terminalSessions?.handleDisconnect(connId);
				let currentDisconnectedNodeId = null;
				let disconnectedNodeHistory;
				if (client?.connect?.role === "node") {
					const nodeId = client.connect.device?.id ?? client.connect.client.id;
					const nodeSession = context.nodeRegistry.get(nodeId);
					if (nodeSession?.connId === connId && nodeSession.pairingGeneration) disconnectedNodeHistory = {
						nodeId: nodeSession.nodeId,
						connectedAtMs: nodeSession.connectedAtMs,
						disconnectedAtMs: Date.now(),
						pairingGeneration: nodeSession.pairingGeneration
					};
					retainClientUntilNodeDrain = true;
					retireTransport();
					try {
						if (nodeLifecycleDispatch.hasActive()) {
							if (!await nodeLifecycleDispatch.drain()) logGateway.warn(`node lifecycle dispatch drain timed out after ${NODE_LIFECYCLE_DISPATCH_DRAIN_TIMEOUT_MS}ms conn=${connId}`);
						}
						currentDisconnectedNodeId = context.nodeRegistry.unregister(connId);
						if (disconnectedNodeHistory && currentDisconnectedNodeId === disconnectedNodeHistory.nodeId) try {
							await recordPairedNodeDisconnection({
								nodeId: disconnectedNodeHistory.nodeId,
								connectedAtMs: disconnectedNodeHistory.connectedAtMs,
								disconnectedAtMs: disconnectedNodeHistory.disconnectedAtMs,
								expectedPairingGeneration: {
									nodeId: disconnectedNodeHistory.nodeId,
									key: disconnectedNodeHistory.pairingGeneration
								}
							});
						} catch (error) {
							logGateway.warn(`failed to record node disconnect for ${disconnectedNodeHistory.nodeId}: ${formatForLog(error)}`);
						}
					} finally {
						retainClientUntilNodeDrain = false;
					}
				}
				if (client?.presenceKey && (client.connect.role !== "node" || currentDisconnectedNodeId !== null)) {
					upsertPresence(client.presenceKey, {
						reason: "disconnect",
						watchedSessions: void 0
					});
					broadcastPresenceSnapshot({
						broadcast,
						incrementPresenceVersion,
						getHealthVersion
					});
				}
				if (currentDisconnectedNodeId) {
					removeRemoteNodeInfo(currentDisconnectedNodeId);
					context.nodeUnsubscribeAll(currentDisconnectedNodeId);
					clearNodeWakeState(currentDisconnectedNodeId);
				}
			}
			logWs("out", "close", {
				connId,
				code,
				reason: logReason,
				durationMs,
				cause: closeCause,
				handshake: handshakeState,
				...handshakeIncomplete ? { phase: lastHandshakePhase } : {},
				lastFrameType,
				lastFrameMethod,
				lastFrameId,
				endpoint
			});
			close();
		};
		socket.once("close", (code, reason) => {
			handleSocketClose(code, reason).catch((error) => {
				logGateway.error(`websocket close cleanup failed conn=${connId}: ${formatErrorMessage(error)}`);
				close();
			});
		});
		const setClient = (next) => {
			if (closed || client) return false;
			if (next.worker) {
				for (const existing of clients) if (existing.worker?.environmentId === next.worker.environmentId) {
					existing.invalidated = true;
					clients.delete(existing);
					try {
						existing.socket.terminate();
					} catch {
						existing.socket.close(1008, "credential-replaced");
					}
				}
			}
			releasePreauthBudget();
			client = next;
			clients.add(next);
			pingTimer = setInterval(() => {
				if (awaitingPong) {
					setCloseCause("heartbeat-timeout");
					try {
						socket.terminate();
					} catch {
						close();
					}
					return;
				}
				awaitingPong = true;
				try {
					socket.ping();
				} catch {}
			}, 25e3);
			return true;
		};
		if (connectionKind === "worker") {
			cleanupWorkerConnection = attachWorkerWsMessageHandler({
				socket,
				connId,
				service: workerConnectionService,
				isStartupPending,
				ingress: workerIngress,
				send,
				close,
				isClosed: () => closed,
				clearHandshakeTimer: () => clearTimeout(handshakeTimer),
				getClient: () => client,
				setClient,
				setHandshakeState: (next) => {
					handshakeState = next;
				},
				advanceHandshakePhase,
				setCloseCause,
				setLastFrameMeta,
				logGateway,
				logWsControl,
				publicAdmission: publicWorkerIngress
			});
			return;
		}
		attachGatewayWsMessageHandlerOnDemand({
			socket,
			upgradeReq,
			connId,
			remoteAddr,
			remotePort,
			localAddr,
			localPort,
			endpoint,
			forwardedFor,
			realIp,
			requestHost,
			requestOrigin,
			requestUserAgent,
			pluginSurfaceBaseUrl,
			pluginNodeCapabilities,
			connectNonce,
			getResolvedAuth,
			getRequiredSharedGatewaySessionGeneration,
			rateLimiter,
			browserRateLimiter,
			nodeReapprovalCoordinator,
			isStartupPending,
			isControlUiDeviceAuthMigrationPending,
			gatewayMethods,
			events,
			extraHandlers,
			getMethodRegistry,
			buildRequestContext,
			nodeLifecycleDispatch,
			refreshHealthSnapshot,
			send,
			close,
			isClosed: () => closed,
			clearHandshakeTimer: () => clearTimeout(handshakeTimer),
			getClient: () => client,
			setClient,
			setHandshakeState: (next) => {
				handshakeState = next;
			},
			advanceHandshakePhase,
			setCloseCause,
			setLastFrameMeta,
			originCheckMetrics,
			logGateway,
			logHealth,
			logWsControl
		});
	});
}
//#endregion
//#region src/gateway/server-ws-runtime.ts
/** Attaches websocket handlers for an already-created gateway request context. */
function attachGatewayWsHandlers(params) {
	attachGatewayWsConnectionHandler({
		wss: params.wss,
		clients: params.clients,
		preauthConnectionBudget: params.preauthConnectionBudget,
		port: params.port,
		gatewayHost: params.gatewayHost,
		pluginSurfaceScheme: params.pluginSurfaceScheme,
		getPluginNodeCapabilities: params.getPluginNodeCapabilities,
		getResolvedAuth: params.getResolvedAuth,
		getRequiredSharedGatewaySessionGeneration: params.getRequiredSharedGatewaySessionGeneration,
		rateLimiter: params.rateLimiter,
		browserRateLimiter: params.browserRateLimiter,
		nodeReapprovalCoordinator: params.nodeReapprovalCoordinator,
		preauthHandshakeTimeoutMs: params.preauthHandshakeTimeoutMs,
		isStartupPending: params.isStartupPending,
		isControlUiDeviceAuthMigrationPending: params.isControlUiDeviceAuthMigrationPending,
		gatewayMethods: params.gatewayMethods,
		events: params.events,
		refreshHealthSnapshot: params.context.refreshHealthSnapshot,
		logGateway: params.logGateway,
		logHealth: params.logHealth,
		logWsControl: params.logWsControl,
		extraHandlers: params.extraHandlers,
		getMethodRegistry: params.getMethodRegistry,
		...params.workerConnectionService ? { workerConnectionService: params.workerConnectionService } : {},
		broadcast: params.broadcast,
		buildRequestContext: () => params.context
	});
}
//#endregion
export { attachGatewayWsHandlers };
