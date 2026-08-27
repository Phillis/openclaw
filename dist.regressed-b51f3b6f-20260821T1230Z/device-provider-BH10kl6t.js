import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { _ as NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND, g as NODE_WORKER_SUPERVISOR_CANCEL_COMMAND, v as NODE_WORKER_SUPERVISOR_STATUS_COMMAND } from "./node-commands-DemsbVYQ.js";
import "./types-DQ1qMLz0.js";
import { t as WorkerProviderError } from "./capability-provider.types-BtnrpVPK.js";
import "./backoff-BkMI1WEL.js";
import { t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.js";
import { l as hasEffectivePairedDeviceRole } from "./device-pairing-CkbDK__R.js";
import { a as parseNodeWorkerLaunchInput, n as nodeWorkerPlanHash, s as parseNodeWorkerSupervisorReceipt } from "./node-supervisor-protocol-BMYRTeBJ.js";
import { t as WorkerRunnerUnavailableError } from "./tunnel-contract-DuVR-4hZ.js";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/node-launch-adapter.ts
const DEFAULT_RPC_TIMEOUT_MS = 3e4;
const DEFAULT_POLL_INTERVAL_MS = 250;
const MAX_RETRY_DELAY_MS = 2e3;
const DEFAULT_CANCELLATION_TIMEOUT_MS = 3e4;
const DEFAULT_AVAILABILITY_TIMEOUT_MS = 1e4;
const RETRYABLE_TRANSPORT_CODES = /* @__PURE__ */ new Set([
	"DISCONNECTED",
	"NOT_CONNECTED",
	"PAIRING_CHANGED",
	"PRIVATE_DIALECT_UNAVAILABLE",
	"ROUTE_CHANGED",
	"TIMEOUT",
	"UNAVAILABLE"
]);
var NodeWorkerLaunchTransportError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
function isTerminalReceipt(receipt) {
	return receipt.state === "completed" || receipt.state === "failed" || receipt.state === "interrupted" || receipt.state === "cancelled";
}
function snapshotLaunchInput(input) {
	let encoded;
	try {
		encoded = JSON.stringify(input);
	} catch {
		throw new Error("node worker launch input is not serializable");
	}
	return parseNodeWorkerLaunchInput(encoded);
}
function expectedIdentity(input) {
	if (input.launchId !== input.descriptor.assignment.turnId) throw new Error("node worker launch ID must match the durable turn ID");
	return {
		launchId: input.launchId,
		planHash: nodeWorkerPlanHash(input),
		environmentId: input.descriptor.admission.environmentId,
		sessionId: input.descriptor.admission.sessionId,
		ownerEpoch: input.descriptor.admission.ownerEpoch,
		placementGeneration: input.placementGeneration,
		runId: input.descriptor.assignment.runId
	};
}
function receiptMatchesIdentity(receipt, expected) {
	return receipt.launchId === expected.launchId && receipt.planHash === expected.planHash && receipt.environmentId === expected.environmentId && receipt.sessionId === expected.sessionId && receipt.ownerEpoch === expected.ownerEpoch && receipt.placementGeneration === expected.placementGeneration && receipt.runId === expected.runId;
}
function parseInvokeReceipt(payloadJSON) {
	if (!payloadJSON) throw new Error("node worker supervisor response omitted payload JSON");
	let value;
	try {
		value = JSON.parse(payloadJSON);
	} catch {
		throw new Error("node worker supervisor response contained malformed JSON");
	}
	if (value === null) return null;
	const receipt = parseNodeWorkerSupervisorReceipt(value);
	if (!receipt) throw new Error("node worker supervisor response violated the private receipt contract");
	return receipt;
}
function signalError(signal, fallback) {
	return signal.reason instanceof Error ? signal.reason : new Error(fallback);
}
function raceWithSignal(operation, signal) {
	if (signal.aborted) return Promise.reject(signalError(signal, "node worker operation aborted"));
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(signalError(signal, "node worker operation aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		operation.then((value) => {
			signal.removeEventListener("abort", onAbort);
			resolve(value);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(error instanceof Error ? error : /* @__PURE__ */ new Error("node worker operation failed"));
		});
	});
}
function createDeadline(params) {
	if (!Number.isFinite(params.timeoutMs) || params.timeoutMs <= 0) throw new Error(`${params.label} timeout must be a positive finite number`);
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error(`${params.label} timed out`)), params.timeoutMs);
	timer.unref?.();
	const signal = params.signal ? AbortSignal.any([params.signal, controller.signal]) : controller.signal;
	const expiresAtMs = params.now() + params.timeoutMs;
	return {
		expiresAtMs,
		signal,
		remainingMs: () => Math.max(0, expiresAtMs - params.now()),
		dispose: () => clearTimeout(timer)
	};
}
function createNodeWorkerLaunchAdapter(options) {
	const now = options.now ?? Date.now;
	const sleep = options.sleep ?? sleepWithAbort;
	const rpcTimeoutMs = options.rpcTimeoutMs ?? DEFAULT_RPC_TIMEOUT_MS;
	const pollIntervalMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
	const cancellationTimeoutMs = options.cancellationTimeoutMs ?? DEFAULT_CANCELLATION_TIMEOUT_MS;
	const findNode = async (params) => {
		let nodes;
		try {
			nodes = await raceWithSignal(params.transport.listCurrentNodes(), params.signal);
		} catch (error) {
			if (params.signal.aborted) throw error;
			throw new NodeWorkerLaunchTransportError("UNAVAILABLE", "device worker node discovery is unavailable");
		}
		const node = nodes.find((candidate) => candidate.nodeId === params.deviceId && (!params.expectedWorkerRuns || candidate.workerRuns && sameWorkerBuild(candidate.workerRuns, params.expectedWorkerRuns)));
		if (!node) throw new NodeWorkerLaunchTransportError("NOT_CONNECTED", "device worker node is not currently connected");
		return node;
	};
	const invoke = async (params) => {
		if (!params.isAuthorized()) throw new NodeWorkerLaunchTransportError("APPROVAL_AUTHORITY_CLOSED", "node worker authority closed");
		const remainingMs = params.deadline.remainingMs();
		if (remainingMs <= 0 || params.deadline.signal.aborted) throw params.deadline.signal.reason ?? /* @__PURE__ */ new Error("node worker operation timed out");
		const transport = options.getTransport();
		if (!transport) throw new NodeWorkerLaunchTransportError("UNAVAILABLE", "device worker node transport is unavailable");
		const rpcBudgetMs = Math.min(rpcTimeoutMs, remainingMs);
		const rpcController = rpcBudgetMs < remainingMs ? new AbortController() : void 0;
		const rpcTimer = rpcController ? setTimeout(() => rpcController.abort(/* @__PURE__ */ new Error("node worker RPC timed out")), rpcBudgetMs) : void 0;
		rpcTimer?.unref?.();
		const signal = rpcController ? AbortSignal.any([params.deadline.signal, rpcController.signal]) : params.deadline.signal;
		try {
			const node = await findNode({
				transport,
				deviceId: params.deviceId,
				expectedWorkerRuns: params.expectedWorkerRuns,
				signal
			});
			const result = await raceWithSignal(transport.invoke({
				node,
				command: params.command,
				params: params.payload,
				timeoutMs: rpcBudgetMs,
				signal,
				idempotencyKey: params.command === "worker.launch.v1" && typeof params.payload === "object" && params.payload !== null && "launchId" in params.payload && typeof params.payload.launchId === "string" ? params.payload.launchId : void 0,
				isDispatchAuthorized: params.isAuthorized,
				...params.onDispatchReady ? { onDispatchReady: params.onDispatchReady } : {}
			}), signal);
			if (!result.ok) {
				const code = result.error?.code ?? "UNAVAILABLE";
				throw new NodeWorkerLaunchTransportError(code, code === "WORKER_CAPACITY_EXHAUSTED" ? "device worker capacity remained full" : `node worker supervisor invocation failed (${code})`);
			}
			return parseInvokeReceipt(result.payloadJSON);
		} catch (error) {
			if (rpcController?.signal.aborted && !params.deadline.signal.aborted) throw new NodeWorkerLaunchTransportError("TIMEOUT", "node worker RPC timed out");
			throw error;
		} finally {
			clearTimeout(rpcTimer);
		}
	};
	const validateReceipt = (receipt, expected) => {
		if (!receiptMatchesIdentity(receipt, expected)) throw new Error("node worker supervisor receipt identity mismatch");
		return receipt;
	};
	const waitBeforeRetry = async (params) => {
		const remainingMs = params.deadline.remainingMs();
		if (remainingMs <= 0 || params.deadline.signal.aborted) throw params.deadline.signal.reason ?? /* @__PURE__ */ new Error("node worker operation timed out");
		await raceWithSignal(sleep(Math.min(params.delayMs, remainingMs), params.deadline.signal), params.deadline.signal);
		return Math.min(params.delayMs * 2, MAX_RETRY_DELAY_MS);
	};
	const cancelUntilTerminal = async (params) => {
		const deadline = createDeadline({
			now,
			timeoutMs: cancellationTimeoutMs,
			label: "node worker cancellation"
		});
		let delayMs = pollIntervalMs;
		try {
			while (!deadline.signal.aborted && deadline.remainingMs() > 0) {
				if (!params.request.isCancellationAuthorized()) throw new Error("node worker cancellation authority closed before terminal settlement");
				try {
					const receipt = await invoke({
						deviceId: params.request.deviceId,
						command: NODE_WORKER_SUPERVISOR_CANCEL_COMMAND,
						payload: params.expected,
						isAuthorized: params.request.isCancellationAuthorized,
						deadline
					});
					if (receipt) {
						const validated = validateReceipt(receipt, params.expected);
						if (isTerminalReceipt(validated)) return validated;
						delayMs = pollIntervalMs;
					}
				} catch (error) {
					if (deadline.signal.aborted) break;
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_TRANSPORT_CODES.has(error.code)) throw error;
				}
				delayMs = await waitBeforeRetry({
					delayMs,
					deadline
				});
			}
		} finally {
			deadline.dispose();
		}
		throw new Error("node worker cancellation outcome is unknown after transport loss");
	};
	const launch = async (request) => {
		const input = snapshotLaunchInput(request.input);
		const stableRequest = {
			...request,
			input
		};
		const expected = expectedIdentity(input);
		const deadline = createDeadline({
			now,
			timeoutMs: request.timeoutMs,
			...request.signal ? { signal: request.signal } : {},
			label: "node worker launch"
		});
		const availabilityDeadline = createDeadline({
			now,
			timeoutMs: DEFAULT_AVAILABILITY_TIMEOUT_MS,
			signal: deadline.signal,
			label: "node worker availability"
		});
		let mayHaveLaunched = false;
		let dispatchReady = false;
		let pollStatus = false;
		let delayMs = pollIntervalMs;
		const markDispatchReady = () => {
			mayHaveLaunched = true;
			if (!dispatchReady) {
				dispatchReady = true;
				stableRequest.onDispatchReady?.();
			}
		};
		try {
			while (true) {
				if (deadline.signal.aborted) throw signalError(deadline.signal, "node worker launch aborted");
				if (!dispatchReady && availabilityDeadline.signal.aborted) throw new WorkerRunnerUnavailableError();
				if (!stableRequest.isDispatchAuthorized()) throw new Error("node worker launch authority closed");
				try {
					const attemptDeadline = dispatchReady ? deadline : availabilityDeadline;
					const receipt = await invoke({
						deviceId: stableRequest.deviceId,
						command: pollStatus ? NODE_WORKER_SUPERVISOR_STATUS_COMMAND : NODE_WORKER_SUPERVISOR_LAUNCH_COMMAND,
						payload: pollStatus ? { launchId: input.launchId } : input,
						...!pollStatus ? { expectedWorkerRuns: input.descriptor.admission.handshake } : {},
						isAuthorized: stableRequest.isDispatchAuthorized,
						deadline: attemptDeadline,
						...!pollStatus ? { onDispatchReady: markDispatchReady } : {}
					});
					if (!receipt) pollStatus = false;
					else {
						if (!pollStatus) markDispatchReady();
						const validated = validateReceipt(receipt, expected);
						mayHaveLaunched = true;
						if (isTerminalReceipt(validated)) return validated;
						pollStatus = true;
						delayMs = pollIntervalMs;
					}
				} catch (error) {
					if (deadline.signal.aborted || !stableRequest.isDispatchAuthorized()) throw error;
					if (!dispatchReady && availabilityDeadline.signal.aborted) throw new WorkerRunnerUnavailableError();
					if (!(error instanceof NodeWorkerLaunchTransportError) || !RETRYABLE_TRANSPORT_CODES.has(error.code)) throw error;
					pollStatus = false;
				}
				delayMs = await waitBeforeRetry({
					delayMs,
					deadline: dispatchReady ? deadline : availabilityDeadline
				});
			}
		} catch (error) {
			if (!dispatchReady && availabilityDeadline.signal.aborted && !deadline.signal.aborted) throw new WorkerRunnerUnavailableError();
			if (error instanceof NodeWorkerLaunchTransportError && error.code === "WORKER_CAPACITY_EXHAUSTED") throw error;
			if (!mayHaveLaunched) throw error;
			let terminal;
			try {
				terminal = await cancelUntilTerminal({
					request: stableRequest,
					expected
				});
			} catch (cancelError) {
				throw Object.assign(new Error("node worker launch failed and cancellation could not be confirmed", { cause: error instanceof Error ? error : /* @__PURE__ */ new Error("node worker launch failed") }), { cancellationError: cancelError });
			}
			if (deadline.signal.aborted || !stableRequest.isDispatchAuthorized()) return terminal;
			throw error;
		} finally {
			availabilityDeadline.dispose();
			deadline.dispose();
		}
	};
	return { launch };
}
//#endregion
//#region src/gateway/worker-environments/device-provider.ts
const DEVICE_WORKER_PROVIDER_ID = "device";
const DEVICE_WORKER_DORMANCY_MS = 336 * 60 * 60 * 1e3;
const DEVICE_WORKER_AVAILABILITY = /* @__PURE__ */ new WeakMap();
const DEVICE_WORKER_RECONCILIATION = /* @__PURE__ */ new WeakMap();
function bindDeviceWorkerAvailability(service, isAvailable) {
	DEVICE_WORKER_AVAILABILITY.set(service, isAvailable);
}
async function isDeviceWorkerAvailable(service, deviceId) {
	const isAvailable = service ? DEVICE_WORKER_AVAILABILITY.get(service) : void 0;
	return isAvailable ? await isAvailable(deviceId) : false;
}
function bindDeviceWorkerReconciliation(service, reconcile) {
	DEVICE_WORKER_RECONCILIATION.set(service, reconcile);
}
async function reconcileDeviceWorker(service, deviceId) {
	const reconcile = service ? DEVICE_WORKER_RECONCILIATION.get(service) : void 0;
	return reconcile ? await reconcile(deviceId) : [];
}
function requireDeviceId(profile) {
	const deviceId = profile.device;
	if (typeof deviceId !== "string" || !deviceId.trim()) throw new WorkerProviderError("device worker profile requires a device setting");
	return deviceId.trim();
}
function isSessionCapableNode(node) {
	return node.workerRuns !== void 0;
}
function hasPairedNodeRole(device) {
	return Boolean(device && hasEffectivePairedDeviceRole(device, "node"));
}
function isWithinDeviceDormancy(device, nowMs) {
	const disconnectedAtMs = device.nodeSurface?.lastDisconnectedAtMs;
	return disconnectedAtMs === void 0 || nowMs - disconnectedAtMs < DEVICE_WORKER_DORMANCY_MS;
}
function deviceLeaseId(deviceId, operationId) {
	return `device:${createHash("sha256").update(deviceId).digest("hex")}:${createHash("sha256").update(operationId).digest("hex").slice(0, 32)}`;
}
/** Core runtime for already-paired node hosts; pairing remains the durable trust owner. */
function createDeviceWorkerRuntime(options) {
	const now = options.now ?? Date.now;
	let nodeTransport;
	const launchAdapter = createNodeWorkerLaunchAdapter({ getTransport: () => nodeTransport });
	const findConnectedNode = async (deviceId) => (await nodeTransport?.listCurrentNodes())?.find((node) => node.nodeId === deviceId);
	const findAvailableNode = async (deviceId) => {
		const node = await findConnectedNode(deviceId);
		return node && isSessionCapableNode(node) ? node : void 0;
	};
	const isAvailable = async (deviceId) => {
		const [paired, connected] = await Promise.all([options.getPairedDevice(deviceId), findAvailableNode(deviceId)]);
		return hasPairedNodeRole(paired) && Boolean(connected);
	};
	return {
		provider: {
			id: DEVICE_WORKER_PROVIDER_ID,
			provisionBeforeInstallation: true,
			provision: async (profile, operationId) => {
				const deviceId = requireDeviceId(profile);
				if (!await isAvailable(deviceId)) throw new WorkerProviderError(`device worker is not a connected session-capable paired node: ${deviceId}`);
				return {
					leaseId: deviceLeaseId(deviceId, operationId),
					node: { deviceId },
					sharedHost: true
				};
			},
			inspect: async ({ profile }) => {
				const deviceId = requireDeviceId(profile);
				const paired = await options.getPairedDevice(deviceId);
				if (!hasPairedNodeRole(paired)) return { status: "unknown" };
				if (await findConnectedNode(deviceId)) return {
					status: "active",
					sharedHost: true
				};
				return isWithinDeviceDormancy(paired, now()) ? { status: "dormant" } : { status: "unknown" };
			},
			destroy: async () => {}
		},
		isAvailable,
		launchNodeWorker: launchAdapter.launch,
		getNodeTransport: () => nodeTransport,
		resolveWorkerBuild: async (deviceId) => (await findAvailableNode(deviceId))?.workerRuns,
		bindNodeTransport: (transport) => {
			nodeTransport = transport;
		}
	};
}
//#endregion
export { isDeviceWorkerAvailable as a, createDeviceWorkerRuntime as i, bindDeviceWorkerAvailability as n, reconcileDeviceWorker as o, bindDeviceWorkerReconciliation as r, DEVICE_WORKER_PROVIDER_ID as t };
