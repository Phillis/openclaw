import { n as computeBackoff, s as sleepWithAbort } from "./src-BQ327IOM.js";
import { n as DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS } from "./timeouts-D2XMKe-X.js";
import { t as notifyListeners } from "./listeners-BogSNJ-R.js";
import "./version-CwNT1gaY.js";
import { t as rawDataToString } from "./websocket-data-2vBvd4uX.js";
import "./backoff-BkMI1WEL.js";
import { C as WorkerHeartbeatResponseFrameSchema, I as WorkerSessionsSpawnResponseFrameSchema, O as WorkerLiveEventResponseFrameSchema, P as WorkerSessionsSendResponseFrameSchema, V as WorkerTranscriptCommitResponseFrameSchema, Y as WORKER_PROTOCOL_MAX_PAYLOAD_BYTES, tt as WorkerProtocolCloseReasonSchema, y as WorkerAdmissionResponseFrameSchema } from "./worker-admission-R0mXKdG7.js";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, d as WorkerInferenceStartResponseFrameSchema, h as validateWorkerInferenceTerminalFrame, p as validateWorkerInferenceEventFrame, s as WorkerInferenceCancelResponseFrameSchema } from "./worker-inference-DaOiVsCq.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { t as createPendingRequestRegistry } from "./pending-request-registry-B-sdjY_C.js";
import { a as WorkerConnectionEndpointError, r as parseWorkerLaunchDescriptor, s as resolveWorkerConnectionTarget, t as buildWorkerConnectParams } from "./launch-descriptor-D6h907h0.js";
import { i as isWorkerTranscriptMessageFrameSafe } from "./transcript-message-CAkPZKyT.js";
import { a as WorkerFencedError, c as resolvePositiveTimeout, i as WorkerConnectionStoppedError, l as toWorkerConnectionError, n as WorkerAdmissionError, r as WorkerConnectionInterruptedError, s as isFencedCloseReason, t as WorkerAdmissionDeadlineExceededError } from "./worker-connection-contract-Cyi21lKp.js";
import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import path from "node:path";
import { chmod, mkdtemp, realpath, rm, stat } from "node:fs/promises";
import { Value } from "typebox/value";
import { WebSocket } from "ws";
//#region src/worker/worker-connection-frames.ts
const WORKER_REQUEST_SPECS = {
	heartbeat: {
		method: "worker.heartbeat",
		responseSchema: WorkerHeartbeatResponseFrameSchema
	},
	transcript: {
		method: "worker.transcript.commit",
		responseSchema: WorkerTranscriptCommitResponseFrameSchema
	},
	"live-event": {
		method: "worker.live-event",
		responseSchema: WorkerLiveEventResponseFrameSchema
	},
	"sessions-spawn": {
		method: "worker.sessions.spawn",
		responseSchema: WorkerSessionsSpawnResponseFrameSchema
	},
	"sessions-send": {
		method: "worker.sessions.send",
		responseSchema: WorkerSessionsSendResponseFrameSchema
	},
	"inference-start": {
		method: "worker.inference.start",
		responseSchema: WorkerInferenceStartResponseFrameSchema
	},
	"inference-cancel": {
		method: "worker.inference.cancel",
		responseSchema: WorkerInferenceCancelResponseFrameSchema
	}
};
function responseId(frame) {
	if (!frame || typeof frame !== "object") return;
	const candidate = frame;
	return candidate.type === "res" && typeof candidate.id === "string" ? candidate.id : void 0;
}
function closeInvalidWorkerFrame(socket) {
	if (socket.readyState === WebSocket.OPEN) socket.close(1008, "invalid-frame");
}
var WorkerConnectionFrameDispatcher = class {
	constructor(options) {
		this.options = options;
		this.pending = createPendingRequestRegistry();
		this.inferenceEventListeners = /* @__PURE__ */ new Set();
		this.inferenceTerminalListeners = /* @__PURE__ */ new Set();
	}
	onInferenceEvent(listener) {
		this.inferenceEventListeners.add(listener);
		return () => this.inferenceEventListeners.delete(listener);
	}
	onInferenceTerminal(listener) {
		this.inferenceTerminalListeners.add(listener);
		return () => this.inferenceTerminalListeners.delete(listener);
	}
	dispatchReadyFrame(frame, socket) {
		if (validateWorkerInferenceEventFrame(frame)) {
			if (!this.matchesInferenceIdentity(frame.payload)) {
				closeInvalidWorkerFrame(socket);
				return;
			}
			notifyListeners(this.inferenceEventListeners, frame);
			return;
		}
		if (validateWorkerInferenceTerminalFrame(frame)) {
			if (!this.matchesInferenceIdentity(frame.payload)) {
				closeInvalidWorkerFrame(socket);
				return;
			}
			notifyListeners(this.inferenceTerminalListeners, frame);
			return;
		}
		const id = responseId(frame);
		const pending = id ? this.pending.get(id) : void 0;
		if (!id || !pending) {
			closeInvalidWorkerFrame(socket);
			return;
		}
		if (!this.resolvePendingFrame(id, pending, frame)) closeInvalidWorkerFrame(socket);
	}
	rejectPending(error) {
		this.pending.rejectAll(error);
	}
	matchesInferenceIdentity(payload) {
		const admission = this.options.connectParams().admission;
		return payload.runEpoch === admission.ownerEpoch && payload.sessionId === admission.sessionId;
	}
	request(kind, params, beforeResolve, timeoutMs) {
		const id = randomUUID();
		const frame = {
			type: "req",
			id,
			method: WORKER_REQUEST_SPECS[kind].method,
			params
		};
		const wrappedBeforeResolve = beforeResolve ? (response) => beforeResolve(response) : void 0;
		return this.sendRequest(id, frame, {
			kind,
			...wrappedBeforeResolve ? { beforeResolve: wrappedBeforeResolve } : {},
			...timeoutMs === void 0 ? {} : { timeoutMs }
		});
	}
	resolvePendingFrame(id, pending, frame) {
		const spec = WORKER_REQUEST_SPECS[pending.value.kind];
		if (!Value.Check(spec.responseSchema, frame)) return false;
		const completed = this.pending.take(id, pending);
		if (!completed) return false;
		const response = frame;
		try {
			completed.value.beforeResolve?.(response);
		} catch (error) {
			completed.reject(toWorkerConnectionError(error));
			return true;
		}
		completed.resolve(response);
		return true;
	}
	sendRequest(id, frame, value) {
		const ready = this.options.isReady();
		const readySocket = ready ? this.options.socket() : void 0;
		if (!ready || !readySocket || readySocket.readyState !== WebSocket.OPEN) return Promise.reject(this.options.isTerminal() ? this.options.terminalError() : new WorkerConnectionInterruptedError("worker connection is not ready"));
		let encoded;
		try {
			encoded = JSON.stringify(frame);
		} catch (error) {
			return Promise.reject(toWorkerConnectionError(error));
		}
		const payloadLimit = value.kind === "inference-start" ? WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES : WORKER_PROTOCOL_MAX_PAYLOAD_BYTES;
		if (Buffer.byteLength(encoded, "utf8") > payloadLimit) return Promise.reject(/* @__PURE__ */ new Error("worker request exceeds the protocol payload limit"));
		const pending = this.pending.add(id, {
			value,
			timeoutMs: value.timeoutMs ?? this.options.requestTimeoutMs,
			timeoutError: () => new WorkerConnectionInterruptedError(`worker ${value.kind} response timed out`),
			onTimeout: () => this.options.interruptReadySocket(readySocket)
		});
		if (!pending) return Promise.reject(/* @__PURE__ */ new Error("worker request id collision"));
		try {
			readySocket.send(encoded, (error) => {
				if (!error) return;
				const failed = this.pending.take(id, pending);
				if (!failed) return;
				failed.reject(new WorkerConnectionInterruptedError(error.message));
				this.options.interruptReadySocket(readySocket);
			});
		} catch (error) {
			this.pending.take(id, pending)?.reject(new WorkerConnectionInterruptedError(toWorkerConnectionError(error).message));
			this.options.interruptReadySocket(readySocket);
		}
		return pending.promise;
	}
};
//#endregion
//#region src/worker/worker-connection-admission.ts
const RETRYABLE_CLOSE_REASONS = /* @__PURE__ */ new Set(["gateway-shutdown", "gateway-unavailable"]);
function parseFrame(data) {
	try {
		return {
			ok: true,
			frame: JSON.parse(rawDataToString(data))
		};
	} catch {
		return { ok: false };
	}
}
function parseCloseReason(data) {
	const reason = rawDataToString(data);
	return Value.Check(WorkerProtocolCloseReasonSchema, reason) ? reason : void 0;
}
function matchesAdmission(connectParams, hello) {
	const expected = connectParams.admission;
	return hello.environmentId === expected.environmentId && hello.sessionId === expected.sessionId && hello.ownerEpoch === expected.ownerEpoch && hello.rpcSetVersion === expected.rpcSetVersion && hello.protocolFeatures.length === expected.handshake.protocolFeatures.length && hello.protocolFeatures.every((feature) => expected.handshake.protocolFeatures.includes(feature));
}
function isRetryableWorkerCloseReason(reason) {
	return RETRYABLE_CLOSE_REASONS.has(reason);
}
function connectWorkerConnectionAttempt(options) {
	const connectionOptions = options.connectionOptions;
	const target = resolveWorkerConnectionTarget(connectionOptions.endpoint);
	const socketOptions = {
		...target.options,
		maxPayload: WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES
	};
	const socket = connectionOptions.createSocket ? connectionOptions.createSocket(target.url, socketOptions) : new WebSocket(target.url, socketOptions);
	options.onSocket(socket);
	const admissionId = randomUUID();
	let admitted = false;
	let attemptSettled = false;
	return new Promise((resolve, reject) => {
		let attemptTimeout;
		const rejectAttempt = (error) => {
			if (attemptSettled) return;
			attemptSettled = true;
			if (attemptTimeout) {
				clearTimeout(attemptTimeout);
				attemptTimeout = void 0;
			}
			reject(error);
		};
		attemptTimeout = setTimeout(() => {
			rejectAttempt(new WorkerConnectionInterruptedError("worker admission timed out"));
			socket.terminate();
		}, options.attemptTimeoutMs);
		attemptTimeout.unref?.();
		socket.on("error", (error) => {
			if (!admitted) rejectAttempt(new WorkerConnectionInterruptedError(toWorkerConnectionError(error).message));
		});
		socket.on("open", () => {
			if (!options.isCurrentGeneration() || options.isTerminal()) {
				socket.close();
				return;
			}
			const tlsError = target.validateSocket(socket);
			if (tlsError) {
				rejectAttempt(new WorkerConnectionEndpointError(tlsError.message));
				socket.close(1008, tlsError.message);
				return;
			}
			options.onAdmitting();
			const frame = {
				type: "req",
				id: admissionId,
				method: "connect",
				params: {
					...connectionOptions.connectParams,
					minProtocol: 4,
					maxProtocol: 4
				}
			};
			socket.send(JSON.stringify(frame), (error) => {
				if (error) {
					rejectAttempt(new WorkerConnectionInterruptedError(error.message));
					socket.terminate();
				}
			});
		});
		socket.on("message", (data) => {
			if (!options.isCurrentGeneration()) return;
			const parsed = parseFrame(data);
			if (!parsed.ok) {
				closeInvalidWorkerFrame(socket);
				return;
			}
			const frame = parsed.frame;
			if (!admitted) {
				if (!Value.Check(WorkerAdmissionResponseFrameSchema, frame) || frame.id !== admissionId) {
					closeInvalidWorkerFrame(socket);
					rejectAttempt(new WorkerAdmissionError("invalid-handshake", false));
					return;
				}
				const response = frame;
				if (!response.ok) {
					const reason = response.error.details.reason;
					rejectAttempt(new WorkerAdmissionError(reason, response.error.retryable === true && isRetryableWorkerCloseReason(reason)));
					socket.terminate();
					return;
				}
				if (!matchesAdmission(connectionOptions.connectParams, response.payload)) {
					closeInvalidWorkerFrame(socket);
					rejectAttempt(new WorkerAdmissionError("invalid-handshake", false));
					return;
				}
				admitted = true;
				attemptSettled = true;
				if (attemptTimeout) {
					clearTimeout(attemptTimeout);
					attemptTimeout = void 0;
				}
				options.onReady(response.payload);
				resolve(response.payload);
				return;
			}
			options.onReadyFrame(frame, socket);
		});
		socket.on("close", (_code, reason) => {
			if (!options.isCurrentGeneration()) return;
			const interrupted = options.onSocketClosed();
			const closeReason = parseCloseReason(reason);
			if (!admitted) {
				rejectAttempt(closeReason ? new WorkerAdmissionError(closeReason, isRetryableWorkerCloseReason(closeReason)) : interrupted);
				return;
			}
			options.onReadyClose(closeReason);
		});
	});
}
//#endregion
//#region src/worker/worker-connection.ts
const DEFAULT_RECONNECT_BACKOFF = {
	initialMs: 250,
	maxMs: 3e4,
	factor: 2,
	jitter: 0
};
const DEFAULT_ADMISSION_TIMEOUT_MS = DEFAULT_PREAUTH_HANDSHAKE_TIMEOUT_MS;
const DEFAULT_ADMISSION_DEADLINE_MS = 12e4;
const DEFAULT_REQUEST_TIMEOUT_MS = 3e4;
const WORKER_SESSION_SPAWN_TIMEOUT_MS = 15 * 6e4;
const WORKER_SESSION_SEND_TIMEOUT_SLACK_MS = 6e4;
var WorkerConnection = class {
	constructor(options) {
		this.options = options;
		this.stateValue = { kind: "idle" };
		this.readyWaiters = /* @__PURE__ */ new Set();
		this.readyListeners = /* @__PURE__ */ new Set();
		this.stateListeners = /* @__PURE__ */ new Set();
		this.reconnectAbort = new AbortController();
		this.exitSettled = false;
		this.generation = 0;
		this.admissionTimeoutMs = resolvePositiveTimeout(options.admissionTimeoutMs, DEFAULT_ADMISSION_TIMEOUT_MS);
		this.admissionDeadlineMs = resolvePositiveTimeout(options.admissionDeadlineMs, DEFAULT_ADMISSION_DEADLINE_MS);
		this.requestTimeoutMs = resolvePositiveTimeout(options.requestTimeoutMs, DEFAULT_REQUEST_TIMEOUT_MS);
		this.exitPromise = new Promise((resolve) => {
			this.resolveExit = resolve;
		});
		this.frames = new WorkerConnectionFrameDispatcher({
			connectParams: () => this.options.connectParams,
			requestTimeoutMs: this.requestTimeoutMs,
			isReady: () => this.stateValue.kind === "ready",
			socket: () => this.socket,
			isTerminal: () => this.isTerminal(),
			terminalError: () => this.terminalError(),
			interruptReadySocket: (socket) => this.interruptReadySocket(socket)
		});
	}
	get state() {
		return this.stateValue;
	}
	start() {
		if (this.stateValue.kind === "ready") return Promise.resolve(this.stateValue.hello);
		if (this.startPromise) return this.startPromise;
		if (this.isTerminal()) return Promise.reject(this.terminalError());
		this.startPromise = this.connectUntilReady();
		return this.startPromise;
	}
	waitForExit() {
		return this.exitPromise;
	}
	waitForReady() {
		if (this.stateValue.kind === "ready") return Promise.resolve(this.stateValue.hello);
		if (this.isTerminal()) return Promise.reject(this.terminalError());
		return new Promise((resolve, reject) => {
			this.readyWaiters.add({
				resolve,
				reject
			});
		});
	}
	onReady(listener) {
		this.readyListeners.add(listener);
		return () => this.readyListeners.delete(listener);
	}
	onStateChange(listener) {
		this.stateListeners.add(listener);
		return () => this.stateListeners.delete(listener);
	}
	onInferenceEvent(listener) {
		return this.frames.onInferenceEvent(listener);
	}
	onInferenceTerminal(listener) {
		return this.frames.onInferenceTerminal(listener);
	}
	async stop() {
		if (this.stateValue.kind === "stopped") return;
		this.reconnectAbort.abort(/* @__PURE__ */ new Error("worker connection stopped"));
		this.stopHeartbeat();
		const stopped = new WorkerConnectionStoppedError();
		this.frames.rejectPending(stopped);
		this.rejectReadyWaiters(stopped);
		this.socket?.close(1e3, "worker stopped");
		this.socket = void 0;
		this.transition({ kind: "stopped" });
		this.settleExit({ kind: "stopped" });
	}
	fence(reason) {
		if (!this.isTerminal()) this.finishFenced(reason);
	}
	requestHeartbeat(params) {
		return this.frames.request("heartbeat", params);
	}
	requestTranscriptCommit(params) {
		return this.frames.request("transcript", params);
	}
	requestLiveEvent(params) {
		return this.frames.request("live-event", params);
	}
	requestSessionsSpawn(params) {
		const timeoutMs = Math.max(this.requestTimeoutMs, WORKER_SESSION_SPAWN_TIMEOUT_MS);
		return this.requestDurableSessionOperation(() => this.frames.request("sessions-spawn", params, void 0, timeoutMs));
	}
	requestSessionsSend(params) {
		const requestedTimeoutMs = (params.timeoutSeconds ?? 30) * 1e3 + WORKER_SESSION_SEND_TIMEOUT_SLACK_MS;
		const timeoutMs = Math.max(this.requestTimeoutMs, requestedTimeoutMs);
		return this.requestDurableSessionOperation(() => this.frames.request("sessions-send", params, void 0, timeoutMs));
	}
	async requestDurableSessionOperation(request) {
		for (;;) try {
			return await request();
		} catch (error) {
			if (!(error instanceof WorkerConnectionInterruptedError) || this.isTerminal()) throw error;
			await this.waitForReady();
		}
	}
	requestInferenceStart(params, beforeResolve) {
		return this.frames.request("inference-start", params, beforeResolve);
	}
	requestInferenceCancel(params) {
		return this.frames.request("inference-cancel", params);
	}
	async connectUntilReady() {
		const startedAt = Date.now();
		let attempt = 0;
		while (!this.isTerminal()) {
			let remainingMs = this.admissionDeadlineMs - (Date.now() - startedAt);
			if (remainingMs <= 0) throw this.failAdmissionDeadline();
			if (attempt > 0) {
				this.transition({
					kind: "reconnecting",
					attempt
				});
				try {
					await sleepWithAbort(Math.min(computeBackoff(this.options.reconnectBackoff ?? DEFAULT_RECONNECT_BACKOFF, attempt), remainingMs), this.reconnectAbort.signal);
				} catch (error) {
					throw this.isTerminal() ? this.terminalError() : toWorkerConnectionError(error);
				}
				remainingMs = this.admissionDeadlineMs - (Date.now() - startedAt);
				if (remainingMs <= 0) throw this.failAdmissionDeadline();
			}
			try {
				const hello = await this.connectOnce(attempt, Math.min(this.admissionTimeoutMs, remainingMs));
				this.reportConnectionFailure(void 0);
				return hello;
			} catch (error) {
				if (this.isTerminal()) throw this.terminalError();
				this.reportConnectionFailure(toWorkerConnectionError(error));
				if (error instanceof WorkerAdmissionError) {
					if (error.retryable) {
						attempt += 1;
						continue;
					}
					this.handleAdmissionFailure(error);
					throw error;
				}
				if (error instanceof WorkerConnectionEndpointError) {
					this.finishFailed(error);
					throw error;
				}
				attempt += 1;
			}
		}
		throw this.terminalError();
	}
	connectOnce(attempt, attemptTimeoutMs) {
		const generation = ++this.generation;
		this.transition({
			kind: "connecting",
			attempt
		});
		return connectWorkerConnectionAttempt({
			attemptTimeoutMs,
			connectionOptions: this.options,
			isCurrentGeneration: () => generation === this.generation,
			isTerminal: () => this.isTerminal(),
			onSocket: (socket) => {
				this.socket = socket;
			},
			onAdmitting: () => {
				this.transition({
					kind: "admitting",
					attempt
				});
			},
			onReady: (hello) => {
				this.transition({
					kind: "ready",
					hello
				});
				this.notifyReady(hello);
				this.startHeartbeat(hello.policy.heartbeatIntervalMs);
			},
			onReadyFrame: (frame, socket) => {
				this.frames.dispatchReadyFrame(frame, socket);
			},
			onSocketClosed: () => {
				this.stopHeartbeat();
				this.socket = void 0;
				const interrupted = new WorkerConnectionInterruptedError();
				this.frames.rejectPending(interrupted);
				return interrupted;
			},
			onReadyClose: (reason) => this.handleReadyClose(reason)
		});
	}
	handleReadyClose(reason) {
		if (this.isTerminal()) return;
		if (reason && isFencedCloseReason(reason)) {
			this.finishFenced(reason);
			return;
		}
		if (reason && !isRetryableWorkerCloseReason(reason)) {
			this.finishFailed(new WorkerAdmissionError(reason, false));
			return;
		}
		if (!this.reconnectPromise) this.reconnectPromise = this.reconnectAfterClose();
	}
	async reconnectAfterClose() {
		try {
			await this.connectUntilReady();
		} catch (error) {
			if (!this.isTerminal()) this.finishFailed(toWorkerConnectionError(error));
		} finally {
			this.reconnectPromise = void 0;
		}
	}
	handleAdmissionFailure(error) {
		if (isFencedCloseReason(error.reason)) {
			this.finishFenced(error.reason);
			return;
		}
		this.finishFailed(error);
	}
	startHeartbeat(intervalMs) {
		this.stopHeartbeat();
		this.heartbeatTimer = setTimeout(() => {
			this.heartbeatTimer = void 0;
			this.sendHeartbeat();
		}, intervalMs);
		this.heartbeatTimer.unref?.();
	}
	async sendHeartbeat() {
		if (this.stateValue.kind !== "ready") return;
		const intervalMs = this.stateValue.hello.policy.heartbeatIntervalMs;
		try {
			const response = await this.requestHeartbeat({
				sentAtMs: Date.now(),
				status: this.options.heartbeatStatus?.() ?? "ready"
			});
			if (response.ok) {
				if (response.payload.ownerEpoch !== this.options.connectParams.admission.ownerEpoch) this.finishFenced("owner-epoch-mismatch");
			} else if (isFencedCloseReason(response.error.details.reason)) {
				this.finishFenced(response.error.details.reason);
				return;
			} else {
				this.finishFailed(/* @__PURE__ */ new Error(`worker heartbeat rejected: ${response.error.details.reason}`));
				return;
			}
		} catch (error) {
			if (!(error instanceof WorkerConnectionInterruptedError) && !this.isTerminal()) {
				this.finishFailed(toWorkerConnectionError(error));
				return;
			}
		}
		if (this.stateValue.kind === "ready") this.startHeartbeat(intervalMs);
	}
	stopHeartbeat() {
		if (this.heartbeatTimer) {
			clearTimeout(this.heartbeatTimer);
			this.heartbeatTimer = void 0;
		}
	}
	interruptReadySocket(socket) {
		if (this.socket === socket && this.stateValue.kind === "ready") this.transition({
			kind: "reconnecting",
			attempt: 0
		});
		socket.terminate();
	}
	notifyReady(hello) {
		const waiters = [...this.readyWaiters];
		this.readyWaiters.clear();
		for (const waiter of waiters) waiter.resolve(hello);
		notifyListeners(this.readyListeners, hello);
	}
	transition(state) {
		this.stateValue = state;
		notifyListeners(this.stateListeners, state);
	}
	reportConnectionFailure(error) {
		try {
			this.options.onConnectionFailure?.(error);
		} catch {}
	}
	finishFenced(reason) {
		this.stopHeartbeat();
		const error = new WorkerFencedError(reason);
		this.frames.rejectPending(error);
		this.rejectReadyWaiters(error);
		this.socket?.close(1008, reason);
		this.transition({
			kind: "fenced",
			reason
		});
		this.settleExit({
			kind: "fenced",
			reason
		});
	}
	finishFailed(error) {
		this.stopHeartbeat();
		this.frames.rejectPending(error);
		this.rejectReadyWaiters(error);
		this.socket?.close(1008, "invalid-frame");
		this.transition({
			kind: "failed",
			error
		});
		this.settleExit({
			kind: "failed",
			error
		});
	}
	rejectReadyWaiters(error) {
		const waiters = [...this.readyWaiters];
		this.readyWaiters.clear();
		for (const waiter of waiters) waiter.reject(error);
	}
	settleExit(exit) {
		if (this.exitSettled) return;
		this.exitSettled = true;
		this.resolveExit(exit);
	}
	failAdmissionDeadline() {
		if (this.isTerminal()) return this.terminalError();
		const error = new WorkerAdmissionDeadlineExceededError();
		this.finishFailed(error);
		return error;
	}
	isTerminal() {
		return this.stateValue.kind === "failed" || this.stateValue.kind === "fenced" || this.stateValue.kind === "stopped";
	}
	terminalError() {
		if (this.stateValue.kind === "failed") return this.stateValue.error;
		if (this.stateValue.kind === "fenced") return new WorkerFencedError(this.stateValue.reason);
		if (this.stateValue.kind === "stopped") return new WorkerConnectionStoppedError();
		return new WorkerConnectionInterruptedError("worker connection terminated");
	}
};
function createWorkerConnection(options) {
	return new WorkerConnection(options);
}
//#endregion
//#region src/worker/worker-rpc-client-shared.ts
function fenceForOwnershipError(connection, response) {
	const reason = response.details.reason;
	if (reason === "epoch-mismatch" || reason === "owner-epoch-mismatch") connection.fence("owner-epoch-mismatch");
	else if (reason === "credential-replaced") connection.fence("credential-replaced");
}
function isTerminalConnection(connection) {
	return connection.state.kind === "fenced" || connection.state.kind === "failed" || connection.state.kind === "stopped";
}
//#endregion
//#region src/worker/worker-rpc-inference-client.ts
var WorkerInferenceProxyError = class extends Error {
	constructor(response) {
		super(response.message);
		this.response = response;
		this.name = "WorkerInferenceProxyError";
	}
	get reason() {
		return this.response.details.reason;
	}
};
function inferenceKey(params) {
	return `${params.sessionId}\u0000${params.runId}\u0000${params.turnId}`;
}
function matchesInferenceIdentity(operation, payload) {
	return payload.runEpoch === operation.params.runEpoch && payload.sessionId === operation.params.sessionId && payload.runId === operation.params.runId && payload.turnId === operation.params.turnId;
}
var WorkerInferenceProxyClient = class {
	constructor(connection) {
		this.connection = connection;
		this.operations = /* @__PURE__ */ new Map();
		this.disposed = false;
		this.unsubscribers = [
			connection.onReady(() => this.resume()),
			connection.onStateChange((state) => {
				if (state.kind === "fenced") this.rejectAllOperations(new WorkerFencedError(state.reason));
				else if (state.kind === "failed") this.rejectAllOperations(state.error);
				else if (state.kind === "stopped") this.rejectAllOperations(new WorkerConnectionStoppedError());
			}),
			connection.onInferenceEvent((frame) => this.handleEvent(frame.payload)),
			connection.onInferenceTerminal((frame) => this.handleTerminal(frame.payload))
		];
	}
	start(params, handlers = {}) {
		if (this.disposed) return Promise.reject(/* @__PURE__ */ new Error("worker inference client disposed"));
		const snapshot = structuredClone(params);
		const key = inferenceKey(snapshot);
		if (this.operations.has(key)) return Promise.reject(/* @__PURE__ */ new Error("worker inference turn already active"));
		return new Promise((resolve, reject) => {
			const operation = {
				params: snapshot,
				handlers,
				lastSeq: 0,
				resumeRequested: false,
				startInFlight: false,
				settled: false,
				resolve,
				reject
			};
			this.operations.set(key, operation);
			this.scheduleStart(operation);
		});
	}
	async cancel(params) {
		const response = await this.connection.requestInferenceCancel(params);
		if (response.ok) return response.payload;
		fenceForOwnershipError(this.connection, response.error);
		throw new WorkerInferenceProxyError(response.error);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		for (const operation of this.operations.values()) {
			operation.settled = true;
			operation.reject(/* @__PURE__ */ new Error("worker inference client disposed"));
		}
		this.operations.clear();
	}
	resume() {
		for (const operation of this.operations.values()) {
			if (operation.startInFlight) {
				operation.resumeRequested = true;
				continue;
			}
			this.scheduleStart(operation);
		}
	}
	scheduleStart(operation) {
		if (operation.startInFlight || operation.settled || this.disposed) return;
		operation.startInFlight = true;
		this.issueStart(operation);
	}
	async issueStart(operation) {
		let interrupted = false;
		try {
			await this.connection.waitForReady();
			const response = await this.connection.requestInferenceStart(operation.params, (frame) => {
				if (frame.ok && frame.payload.status === "replayed") operation.lastSeq = 0;
			});
			if (!response.ok) {
				fenceForOwnershipError(this.connection, response.error);
				this.rejectOperation(operation, new WorkerInferenceProxyError(response.error));
				return;
			}
			operation.resumeRequested = false;
		} catch (error) {
			if (error instanceof WorkerConnectionInterruptedError) interrupted = true;
			else this.rejectOperation(operation, error instanceof Error ? error : new Error(String(error)));
		} finally {
			operation.startInFlight = false;
			if (interrupted && operation.resumeRequested && !operation.settled) {
				operation.resumeRequested = false;
				this.scheduleStart(operation);
			}
		}
	}
	handleEvent(payload) {
		const operation = this.operations.get(inferenceKey(payload));
		if (!operation || operation.settled || !matchesInferenceIdentity(operation, payload)) return;
		this.applyEvent(operation, payload);
	}
	applyEvent(operation, payload) {
		if (payload.seq <= operation.lastSeq) return;
		if (payload.seq !== operation.lastSeq + 1) try {
			operation.handlers.onStreamGap?.({
				expectedSeq: operation.lastSeq + 1,
				receivedSeq: payload.seq
			});
		} catch (error) {
			this.rejectOperation(operation, error instanceof Error ? error : new Error(String(error)));
			return;
		}
		operation.lastSeq = payload.seq;
		try {
			operation.handlers.onEvent?.(payload);
		} catch (error) {
			this.rejectOperation(operation, error instanceof Error ? error : new Error(String(error)));
		}
	}
	handleTerminal(payload) {
		const operation = this.operations.get(inferenceKey(payload));
		if (!operation || operation.settled || !matchesInferenceIdentity(operation, payload)) return;
		this.applyTerminal(operation, payload);
	}
	applyTerminal(operation, payload) {
		if (payload.seq <= operation.lastSeq) return;
		if (payload.seq !== operation.lastSeq + 1) try {
			operation.handlers.onStreamGap?.({
				expectedSeq: operation.lastSeq + 1,
				receivedSeq: payload.seq
			});
		} catch (error) {
			this.rejectOperation(operation, error instanceof Error ? error : new Error(String(error)));
			return;
		}
		operation.lastSeq = payload.seq;
		operation.settled = true;
		this.operations.delete(inferenceKey(operation.params));
		operation.resolve(payload.outcome);
	}
	rejectOperation(operation, error) {
		if (operation.settled) return;
		operation.settled = true;
		this.operations.delete(inferenceKey(operation.params));
		operation.reject(error);
	}
	rejectAllOperations(error) {
		for (const operation of this.operations.values()) this.rejectOperation(operation, error);
	}
};
//#endregion
//#region src/worker/worker-rpc-live-event-client.ts
const MAX_IN_FLIGHT = 8;
var WorkerLiveEventClient = class {
	constructor(connection, options) {
		this.connection = connection;
		this.options = options;
		this.buffered = [];
		this.inFlight = /* @__PURE__ */ new Set();
		this.replayGeneration = 0;
		this.previewDegraded = false;
		this.disposed = false;
		this.ackedSeqValue = options.initialAckedSeq ?? 0;
		this.nextSeqValue = this.ackedSeqValue + 1;
		this.maxSentSeqValue = this.ackedSeqValue;
		this.unsubscribers = [connection.onReady(() => this.pump()), connection.onStateChange((state) => {
			if (state.kind === "fenced") this.rejectAll(new WorkerFencedError(state.reason));
			else if (state.kind === "failed") this.rejectAll(state.error);
			else if (state.kind === "stopped") this.rejectAll(new WorkerConnectionStoppedError());
		})];
	}
	enqueuePreview(runId, event) {
		if (this.disposed || this.previewDegraded || isTerminalConnection(this.connection)) return false;
		if (this.buffered.length >= (this.options.maxBufferedEvents ?? 1024)) {
			this.degradePreviews();
			return false;
		}
		try {
			this.buffered.push({
				seq: this.nextSeqValue,
				runId,
				event: structuredClone(event)
			});
		} catch {
			this.degradePreviews();
			return false;
		}
		this.nextSeqValue += 1;
		this.pump();
		return true;
	}
	emitTerminal(runId, event) {
		if (this.disposed) return Promise.reject(/* @__PURE__ */ new Error("worker live-event client disposed"));
		const completion = createDeferredCore();
		const terminalResyncFromSeq = this.terminalResyncFromSeq;
		if (terminalResyncFromSeq !== void 0) this.terminalResyncFromSeq = void 0;
		this.buffered.push({
			seq: this.nextSeqValue,
			runId,
			event: structuredClone(event),
			...terminalResyncFromSeq === void 0 ? {} : { resyncFromSeq: terminalResyncFromSeq },
			completion
		});
		this.nextSeqValue += 1;
		this.pump();
		return completion.promise;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		for (const unsubscribe of this.unsubscribers) unsubscribe();
		this.rejectAll(/* @__PURE__ */ new Error("worker live-event client disposed"));
	}
	pump() {
		if (this.disposed || this.buffered.length === 0) return;
		for (const entry of this.buffered) {
			if (this.inFlight.size >= MAX_IN_FLIGHT) break;
			if (this.inFlight.has(entry)) continue;
			if (entry.blockedAck === this.ackedSeqValue) continue;
			this.inFlight.add(entry);
			this.send(entry);
		}
		if (this.inFlight.size === 0 && this.buffered[0]?.blockedAck === this.ackedSeqValue) {
			const head = this.buffered[0];
			this.handleFailure(head, /* @__PURE__ */ new Error(`worker live-event acknowledgement did not advance (seq=${head.seq} runId=${head.runId} ackedSeq=${this.ackedSeqValue} buffered=${this.buffered.length} runEpoch=${this.options.runEpoch})`));
			this.pump();
		}
	}
	async send(entry) {
		const generation = this.replayGeneration;
		const sentSeq = entry.seq;
		this.maxSentSeqValue = Math.max(this.maxSentSeqValue, sentSeq);
		try {
			await this.connection.waitForReady();
			const response = await this.connection.requestLiveEvent({
				runEpoch: this.options.runEpoch,
				lastAckedSeq: entry.resyncFromSeq ?? this.ackedSeqValue,
				seq: sentSeq,
				runId: entry.runId,
				event: entry.event
			});
			if (generation !== this.replayGeneration || !this.buffered.includes(entry)) return;
			if (response.ok) {
				if (response.payload.ackedSeq > this.maxSentSeqValue) throw new Error("worker live-event acknowledgement is outside sent range");
				if (response.payload.ackedSeq > this.ackedSeqValue) {
					this.lastResync = void 0;
					this.ackThrough(response.payload.ackedSeq);
				} else entry.blockedAck = response.payload.ackedSeq;
				return;
			}
			if (response.error.details.reason === "resync-required") {
				if (response.error.details.ackedSeq > this.maxSentSeqValue) throw new Error("worker live-event resync acknowledged an unsent event");
				const cursor = {
					ackedSeq: response.error.details.ackedSeq,
					expectedSeq: response.error.details.expectedSeq
				};
				if (this.lastResync?.ackedSeq === cursor.ackedSeq && this.lastResync.expectedSeq === cursor.expectedSeq) throw new Error("worker live-event resync did not advance");
				this.lastResync = cursor;
				this.resync(cursor.ackedSeq, cursor.expectedSeq);
				return;
			}
			fenceForOwnershipError(this.connection, response.error);
			throw new Error(response.error.message);
		} catch (error) {
			if (error instanceof WorkerConnectionInterruptedError && !isTerminalConnection(this.connection)) return;
			const failure = error instanceof Error ? error : new Error(String(error));
			this.handleFailure(entry, failure);
		} finally {
			this.inFlight.delete(entry);
			this.pump();
		}
	}
	ackThrough(ackedSeq) {
		this.ackedSeqValue = Math.max(this.ackedSeqValue, ackedSeq);
		const pendingIndex = this.buffered.findIndex((entry) => entry.seq > this.ackedSeqValue);
		const acknowledged = this.buffered.splice(0, pendingIndex < 0 ? this.buffered.length : pendingIndex);
		for (const entry of acknowledged) entry.completion?.resolve();
	}
	resync(ackedSeq, expectedSeq) {
		if (expectedSeq !== ackedSeq + 1) {
			this.rejectAll(/* @__PURE__ */ new Error("worker live-event resync cursor is inconsistent"));
			return;
		}
		this.replayGeneration += 1;
		if (ackedSeq >= this.ackedSeqValue) this.ackThrough(ackedSeq);
		else this.ackedSeqValue = ackedSeq;
		let seq = expectedSeq;
		for (const entry of this.buffered) {
			entry.seq = seq;
			delete entry.blockedAck;
			delete entry.resyncFromSeq;
			seq += 1;
		}
		this.nextSeqValue = seq;
		this.maxSentSeqValue = ackedSeq;
	}
	handleFailure(entry, error) {
		if (!entry.completion && !isTerminalConnection(this.connection)) this.degradePreviews();
		else this.rejectAll(error);
	}
	degradePreviews() {
		this.previewDegraded = true;
		this.replayGeneration += 1;
		this.lastResync = void 0;
		const resyncFromSeq = Math.max(this.terminalResyncFromSeq ?? 0, this.maxSentSeqValue);
		const terminal = this.buffered.find((entry) => entry.completion);
		this.buffered.length = 0;
		if (terminal) {
			delete terminal.blockedAck;
			terminal.resyncFromSeq = resyncFromSeq;
			this.buffered.push(terminal);
		}
		this.terminalResyncFromSeq = terminal ? void 0 : resyncFromSeq;
	}
	rejectAll(error) {
		const buffered = this.buffered.splice(0);
		for (const entry of buffered) entry.completion?.reject(error);
	}
};
//#endregion
//#region src/worker/worker-rpc-transcript-client.ts
const TRANSCRIPT_SIZE_FRAME_ID = "00000000-0000-4000-8000-000000000000";
var WorkerTranscriptCommitError = class extends Error {
	constructor(response, message = response.message) {
		super(message);
		this.response = response;
		this.name = "WorkerTranscriptCommitError";
	}
	get reason() {
		return this.response.details.reason;
	}
};
var WorkerTranscriptCommitClient = class {
	constructor(connection, options) {
		this.connection = connection;
		this.options = options;
		this.queue = Promise.resolve();
		this.baseLeafIdValue = options.baseLeafId;
		this.nextSeqValue = options.initialSeq ?? 1;
	}
	get baseLeafId() {
		return this.baseLeafIdValue;
	}
	get nextSeq() {
		return this.nextSeqValue;
	}
	commit(messages) {
		const snapshot = structuredClone(messages);
		const operation = this.queue.then(() => this.commitBatches(snapshot));
		this.queue = operation.then(() => void 0, () => void 0);
		return operation;
	}
	async commitBatches(messages) {
		if (messages.length === 0) throw new Error("worker transcript commit requires at least one message");
		const entryIds = [];
		let offset = 0;
		while (offset < messages.length) {
			const batch = this.takeFittingBatch(messages.slice(offset));
			const result = await this.commitBatch(batch);
			entryIds.push(...result.entryIds);
			offset += batch.length;
		}
		const newLeafId = this.baseLeafIdValue;
		if (newLeafId === null) throw new Error("worker transcript commit did not advance the base leaf");
		return {
			entryIds,
			newLeafId
		};
	}
	takeFittingBatch(messages) {
		let batch = [];
		for (const message of messages) {
			if (!isWorkerTranscriptMessageFrameSafe(message)) throw new Error("worker transcript message exceeds the protocol payload limit");
			const candidate = [...batch, message];
			const frame = {
				type: "req",
				id: TRANSCRIPT_SIZE_FRAME_ID,
				method: "worker.transcript.commit",
				params: {
					runEpoch: this.options.runEpoch,
					seq: this.nextSeqValue,
					baseLeafId: this.baseLeafIdValue,
					messages: candidate
				}
			};
			if (Buffer.byteLength(JSON.stringify(frame), "utf8") > 65536) {
				if (batch.length === 0) throw new Error("worker transcript message exceeds the protocol payload limit");
				break;
			}
			batch = candidate;
		}
		return batch;
	}
	async commitBatch(messages) {
		if (this.terminalFailure) throw this.terminalFailure;
		const request = {
			runEpoch: this.options.runEpoch,
			seq: this.nextSeqValue,
			baseLeafId: this.baseLeafIdValue,
			messages: [...messages]
		};
		while (true) {
			await this.connection.waitForReady();
			try {
				const response = await this.connection.requestTranscriptCommit(request);
				if (response.ok) {
					this.baseLeafIdValue = response.payload.newLeafId;
					this.nextSeqValue = request.seq + 1;
					return response.payload;
				}
				if (response.error.details.reason === "stale-base-leaf") {
					this.nextSeqValue = request.seq + 1;
					this.terminalFailure = new WorkerTranscriptCommitError(response.error, "Worker transcript base changed; uncommitted messages were not committed; relaunch required.");
					throw this.terminalFailure;
				}
				fenceForOwnershipError(this.connection, response.error);
				throw new WorkerTranscriptCommitError(response.error);
			} catch (error) {
				if (error instanceof WorkerConnectionInterruptedError && !isTerminalConnection(this.connection)) continue;
				throw error;
			}
		}
	}
};
//#endregion
//#region src/worker/worker.runtime.ts
const WORKER_REMOTE_CANCEL_GRACE_MS = 1e3;
function toWorkerRuntimeError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
function fencedResult(state) {
	if (state.kind === "fenced" && (state.reason === "credential-replaced" || state.reason === "owner-epoch-mismatch")) return {
		status: "fenced",
		reason: state.reason
	};
}
async function assertWorkspaceDirectory(workspaceDir) {
	const resolved = await realpath(workspaceDir);
	if (!(await stat(resolved)).isDirectory()) throw new Error("worker workspace path must be a directory");
	return resolved;
}
async function runWorkerDescriptor(descriptor, options = {}) {
	const workspaceDir = await assertWorkspaceDirectory(descriptor.assignment.workspaceDir);
	const stateDir = await mkdtemp(path.join(tmpdir(), "openclaw-worker-"));
	await chmod(stateDir, 448);
	const previousStateDir = process.env.OPENCLAW_STATE_DIR;
	const previousConfigPath = process.env.OPENCLAW_CONFIG_PATH;
	process.env.OPENCLAW_STATE_DIR = stateDir;
	process.env.OPENCLAW_CONFIG_PATH = path.join(stateDir, "openclaw.json");
	const abortController = new AbortController();
	let turnStarted = false;
	let resultFenceAcked = false;
	let forcedStopTimer;
	const connection = createWorkerConnection({
		endpoint: descriptor.connectionEndpoint,
		connectParams: buildWorkerConnectParams(descriptor),
		onConnectionFailure: (error) => options.onConnectionFailure?.(error?.message)
	});
	const abortFromCaller = () => {
		abortController.abort(options.signal?.reason);
		if (!turnStarted) {
			connection.stop();
			return;
		}
		forcedStopTimer = setTimeout(() => {
			connection.stop();
		}, WORKER_REMOTE_CANCEL_GRACE_MS);
		forcedStopTimer.unref();
	};
	options.signal?.addEventListener("abort", abortFromCaller, { once: true });
	if (options.signal?.aborted) abortFromCaller();
	const transcript = new WorkerTranscriptCommitClient(connection, {
		runEpoch: descriptor.admission.ownerEpoch,
		baseLeafId: descriptor.assignment.transcript.baseLeafId,
		initialSeq: descriptor.assignment.transcript.nextSeq
	});
	const live = new WorkerLiveEventClient(connection, {
		runEpoch: descriptor.admission.ownerEpoch,
		initialAckedSeq: descriptor.assignment.liveEvents.ackedSeq
	});
	const inference = new WorkerInferenceProxyClient(connection);
	const unsubscribeState = connection.onStateChange((state) => {
		if (state.kind === "fenced") abortController.abort(/* @__PURE__ */ new Error(`worker fenced: ${state.reason}`));
		else if (state.kind === "failed") abortController.abort(state.error);
	});
	try {
		try {
			await connection.start();
		} catch (error) {
			const fenced = fencedResult(connection.state);
			if (fenced) return fenced;
			throw error;
		}
		const [{ runWorkerEmbeddedTurn }, { createWorkerInferenceStreamAdapter }] = await Promise.all([import("./embedded-agent.runtime-CX5aA3wx.js"), import("./inference-stream.runtime.js")]);
		const stream = createWorkerInferenceStreamAdapter({
			client: inference,
			sessionId: descriptor.admission.sessionId,
			runEpoch: descriptor.admission.ownerEpoch,
			runId: descriptor.assignment.runId,
			turnId: descriptor.assignment.turnId,
			modelRef: descriptor.assignment.modelRef
		});
		try {
			turnStarted = true;
			await runWorkerEmbeddedTurn({
				agentId: descriptor.assignment.agentId,
				operationalRunInstance: descriptor.assignment.operationalRunInstance,
				agentRuntimeIdentityToken: descriptor.assignment.agentRuntimeIdentityToken,
				cwd: workspaceDir,
				stateDir,
				sessionId: descriptor.admission.sessionId,
				sessionKey: `worker:${descriptor.admission.sessionId}`,
				runId: descriptor.assignment.runId,
				prompt: descriptor.assignment.prompt,
				suppressPromptTranscript: descriptor.assignment.suppressPromptTranscript,
				modelRef: descriptor.assignment.modelRef,
				initialMessages: descriptor.assignment.initialMessages,
				...descriptor.assignment.systemPrompt === void 0 ? {} : { systemPrompt: descriptor.assignment.systemPrompt },
				inferenceOptions: descriptor.assignment.inferenceOptions,
				allowedToolNames: descriptor.assignment.toolAuthority.allowedToolNames,
				...descriptor.assignment.browser ? { browser: descriptor.assignment.browser } : {},
				inference: { stream },
				transcript: { commit: async (messages) => {
					await transcript.commit(messages);
				} },
				live: {
					enqueuePreview: (event) => live.enqueuePreview(descriptor.assignment.runId, event),
					emitTerminal: async (event) => {
						await live.emitTerminal(descriptor.assignment.runId, event);
						resultFenceAcked = true;
					}
				},
				sessions: connection,
				signal: abortController.signal
			});
			if (options.signal?.aborted) throw toWorkerRuntimeError(options.signal.reason, "worker interrupted");
		} catch (error) {
			const fenced = fencedResult(connection.state);
			if (fenced) return fenced;
			if (options.signal?.aborted) throw toWorkerRuntimeError(options.signal.reason, "worker interrupted");
			if (resultFenceAcked && connection.state.kind === "ready") return {
				status: "failed",
				reason: "turn-failed",
				transcriptLeafId: transcript.baseLeafId,
				transcriptNextSeq: transcript.nextSeq
			};
			throw toWorkerRuntimeError(error, "worker session failed");
		}
		const fenced = fencedResult(connection.state);
		if (fenced) return fenced;
		if (connection.state.kind === "failed") throw connection.state.error;
		return {
			status: "completed",
			transcriptLeafId: transcript.baseLeafId,
			transcriptNextSeq: transcript.nextSeq
		};
	} finally {
		if (forcedStopTimer) clearTimeout(forcedStopTimer);
		unsubscribeState();
		options.signal?.removeEventListener("abort", abortFromCaller);
		inference.dispose();
		live.dispose();
		await connection.stop();
		if (previousStateDir === void 0) delete process.env.OPENCLAW_STATE_DIR;
		else process.env.OPENCLAW_STATE_DIR = previousStateDir;
		if (previousConfigPath === void 0) delete process.env.OPENCLAW_CONFIG_PATH;
		else process.env.OPENCLAW_CONFIG_PATH = previousConfigPath;
		await rm(stateDir, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
//#region src/worker/worker-command.runtime.ts
async function readLaunchDescriptor(input) {
	const chunks = [];
	let byteLength = 0;
	for await (const rawChunk of input) {
		const chunk = typeof rawChunk === "string" ? Buffer.from(rawChunk) : rawChunk instanceof Uint8Array ? Buffer.from(rawChunk) : void 0;
		if (!chunk) throw new Error("worker launch descriptor input must be bytes");
		byteLength += chunk.byteLength;
		if (byteLength > 26214400) throw new Error("worker launch descriptor exceeds the protocol payload limit");
		chunks.push(chunk);
	}
	if (byteLength === 0) throw new Error("worker launch descriptor is required on stdin");
	let decoded;
	try {
		decoded = JSON.parse(Buffer.concat(chunks).toString("utf8"));
	} catch (error) {
		throw new Error("worker launch descriptor is not valid JSON", { cause: error });
	}
	return parseWorkerLaunchDescriptor(decoded);
}
/** Process shell for `openclaw worker`: stdin descriptor in, JSON result out, signals abort the run. */
async function runWorkerCommand(options) {
	const abortController = new AbortController();
	const stop = () => abortController.abort(/* @__PURE__ */ new Error("worker interrupted"));
	let lifetimeEnded = false;
	const stopForLifetime = () => {
		if (lifetimeEnded || !options.lifetime) return;
		lifetimeEnded = true;
		abortController.abort(options.lifetime.signal.reason ?? /* @__PURE__ */ new Error("worker supervisor lifetime ended"));
		options.lifetime.terminateOwnedTree();
	};
	try {
		const [descriptor, started] = await Promise.all([readLaunchDescriptor(options.input), options.lifetime?.started ?? Promise.resolve(true)]);
		if (!started) return;
		options.lifetime?.signal.addEventListener("abort", stopForLifetime, { once: true });
		if (options.lifetime?.signal.aborted) stopForLifetime();
		process.once("SIGINT", stop);
		process.once("SIGTERM", stop);
		const result = await runWorkerDescriptor(descriptor, {
			signal: abortController.signal,
			...options.lifetime ? { onConnectionFailure: options.lifetime.reportConnectionFailure } : {}
		});
		const encoded = `${JSON.stringify(result)}\n`;
		options.output.write(encoded);
	} finally {
		options.lifetime?.signal.removeEventListener("abort", stopForLifetime);
		options.lifetime?.dispose();
		process.off("SIGINT", stop);
		process.off("SIGTERM", stop);
	}
}
//#endregion
export { runWorkerCommand };
