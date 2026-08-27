import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-yubNQC1L.js";
import { h as NODE_WORKER_PRIVATE_COMMANDS, w as isPrivateNodeInvokeCommand } from "./node-commands-DemsbVYQ.js";
import { n as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE } from "./node-runner-inventory-BtWvfvLj.js";
import { n as sameWorkerProtocolFeatures, t as sameWorkerBuild } from "./worker-build-identity-D_c48Wx_.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-registry-private-token.ts
/** Unforgeable reason shared only by node-registry private pairing lifecycle owners. */
const NODE_INVOKE_PAIRING_CHANGED_ABORT = Symbol("nodeInvokePairingChanged");
//#endregion
//#region src/gateway/node-registry.system-run.ts
/** Normalize system.run timeout values, preserving null for no expiry. */
function normalizeSystemRunTimeoutMs(value) {
	if (value === void 0) return;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const timeoutMs = Math.trunc(value);
	return timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : null;
}
//#endregion
//#region src/gateway/node-registry-private.ts
const NODE_REGISTRY_PRIVATE_STATES = /* @__PURE__ */ new WeakMap();
function resolvePendingSystemRunEvent(params) {
	if (params.command !== "system.run" || !params.params || typeof params.params !== "object") return;
	const obj = params.params;
	const runId = normalizeOptionalString(obj.runId) ?? "";
	if (!runId) return;
	const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
	const sessionKey = normalizeOptionalString(obj.sessionKey) ?? "";
	return {
		runId,
		...sessionKey ? { sessionKey } : {},
		...timeoutMs !== void 0 ? { timeoutMs } : {}
	};
}
function normalizeSystemRunInvokeParams(params) {
	if (params.command !== "system.run" || !params.params || typeof params.params !== "object" || Array.isArray(params.params)) return params.params;
	const obj = params.params;
	const normalized = {
		...obj,
		runId: normalizeOptionalString(obj.runId) || randomUUID()
	};
	const timeoutMs = normalizeSystemRunTimeoutMs(obj.timeoutMs);
	if (timeoutMs === void 0) delete normalized.timeoutMs;
	else normalized.timeoutMs = timeoutMs;
	return normalized;
}
function sameOptionalWorkerBuild(left, right) {
	return left === void 0 || right === void 0 ? left === right : sameWorkerBuild(left, right);
}
function resolveWorkerSupervisorProof(node, runnerInventoryByConn) {
	const declaration = runnerInventoryByConn.get(node.connId);
	if (!declaration || !node.pairingIdentity || !node.pairingGeneration || node.clientId !== GATEWAY_CLIENT_IDS.NODE_HOST || node.clientMode !== "node" || declaration.nodeId !== node.nodeId || declaration.pairingIdentity !== node.pairingIdentity || declaration.clientId !== node.clientId || declaration.clientMode !== node.clientMode || declaration.protocolFeature !== "node-worker-supervisor-v1" || !declaration.protocolFeatures.includes("node-worker-supervisor-v1") || declaration.workerRuns !== void 0 && !sameOptionalWorkerBuild(declaration.workerRuns, node.workerRuns)) return;
	return {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		pairingGeneration: node.pairingGeneration,
		clientId: GATEWAY_CLIENT_IDS.NODE_HOST,
		clientMode: "node",
		protocolFeature: NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE,
		...node.workerRuns ? { workerBuild: structuredClone(node.workerRuns) } : {},
		...declaration.workerRuns ? { workerRuns: structuredClone(declaration.workerRuns) } : {},
		commands: [...node.commands]
	};
}
function isWorkerSupervisorProofCurrent(state, proof, requireLaunchEligibility) {
	const node = state.context.getNode(proof.nodeId);
	if (!node || node.client.invalidated === true || node.connId !== proof.connId) return false;
	const current = resolveWorkerSupervisorProof(node, state.runnerInventoryByConn);
	return current?.pairingIdentity === proof.pairingIdentity && current.pairingGeneration === proof.pairingGeneration && current.clientId === proof.clientId && current.clientMode === proof.clientMode && current.protocolFeature === proof.protocolFeature && sameOptionalWorkerBuild(current.workerBuild, proof.workerBuild) && (!requireLaunchEligibility || sameOptionalWorkerBuild(current.workerRuns, proof.workerRuns));
}
function updateWorkerRunnerInventory(state, params) {
	const node = state.context.getNode(params.nodeId);
	const publishesSupervisorDialect = params.declaration.protocolFeatures.some((feature) => feature === NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE);
	if (!node || node.client.invalidated === true || node.connId !== params.connId || node.clientId !== GATEWAY_CLIENT_IDS.NODE_HOST || node.clientMode !== "node") return null;
	const previous = state.runnerInventoryByConn.get(node.connId);
	if (!publishesSupervisorDialect) {
		const changed = state.runnerInventoryByConn.delete(node.connId);
		if (changed) {
			state.context.publishActiveNodeContext();
			state.publishRunnerInventoryChanged(node.nodeId);
		}
		return { changed };
	}
	const next = {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		clientId: GATEWAY_CLIENT_IDS.NODE_HOST,
		clientMode: "node",
		protocolFeature: NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE,
		protocolFeatures: [...params.declaration.protocolFeatures],
		...params.declaration.workerRuns ? { workerRuns: structuredClone(params.declaration.workerRuns) } : {}
	};
	const changed = !previous || !sameWorkerProtocolFeatures(previous.protocolFeatures, next.protocolFeatures) || !sameOptionalWorkerBuild(previous.workerRuns, next.workerRuns);
	if (changed) {
		state.runnerInventoryByConn.set(node.connId, next);
		state.context.publishActiveNodeContext();
		state.publishRunnerInventoryChanged(node.nodeId);
	}
	return { changed };
}
async function invokeNodeRegistryCore(state, params, allowPrivateCommand) {
	if (isPrivateNodeInvokeCommand(params.command) && !allowPrivateCommand) return {
		ok: false,
		error: {
			code: "INVALID_REQUEST",
			message: "private node command is not invocable"
		}
	};
	if (params.signal?.aborted) return {
		ok: false,
		error: {
			code: "ABORTED",
			message: "node invoke cancelled"
		}
	};
	let node = state.context.getNode(params.nodeId);
	if (!node) return {
		ok: false,
		error: {
			code: "NOT_CONNECTED",
			message: "node not connected"
		}
	};
	if (node.client.invalidated === true) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		}
	};
	const expectedPairingGeneration = params.expectedPairingGeneration ?? node.pairingGeneration;
	if (state.context.hasCurrentPairingStateResolver && !expectedPairingGeneration) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing generation unavailable"
		}
	};
	if (expectedPairingGeneration && node.pairingGeneration !== expectedPairingGeneration) return {
		ok: false,
		error: {
			code: "PAIRING_CHANGED",
			message: "node pairing changed before dispatch"
		}
	};
	if (params.expectedConnId && node.connId !== params.expectedConnId) return {
		ok: false,
		error: {
			code: "ROUTE_CHANGED",
			message: "node connection changed before dispatch"
		}
	};
	if (expectedPairingGeneration && state.context.hasCurrentPairingStateResolver) {
		const resolution = await state.context.resolvePairingLease(node);
		if (resolution.status === "unavailable") return {
			ok: false,
			error: {
				code: "UNAVAILABLE",
				message: "node pairing state unavailable before dispatch"
			}
		};
		if (resolution.status !== "current") return {
			ok: false,
			error: {
				code: "PAIRING_CHANGED",
				message: "node pairing changed before dispatch"
			}
		};
		node = resolution.session;
		if (params.expectedConnId && node.connId !== params.expectedConnId) return {
			ok: false,
			error: {
				code: "ROUTE_CHANGED",
				message: "node connection changed before dispatch"
			}
		};
	}
	if (params.isDispatchAuthorized?.() === false) return {
		ok: false,
		error: {
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "runtime authority closed before node dispatch"
		}
	};
	const requestId = randomUUID();
	const invokeParams = normalizeSystemRunInvokeParams({
		command: params.command,
		params: params.params
	});
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4, 0);
	const payload = {
		id: requestId,
		nodeId: params.nodeId,
		command: params.command,
		paramsJSON: "params" in params && invokeParams !== void 0 ? JSON.stringify(invokeParams) : null,
		timeoutMs,
		idempotencyKey: params.idempotencyKey,
		sessionKey: normalizeOptionalString(params.sessionKey)
	};
	const systemRunEvent = resolvePendingSystemRunEvent({
		command: params.command,
		params: invokeParams
	});
	const result = new Promise((resolve, reject) => {
		const pending = {
			nodeId: params.nodeId,
			connId: node.connId,
			command: params.command,
			systemRunEvent,
			resolve,
			reject,
			nextProgressSeq: 0,
			progressChunks: /* @__PURE__ */ new Map(),
			nextInputSeq: 0,
			...params.onProgress ? { onProgress: params.onProgress } : {}
		};
		const generationController = params.expectedPairingGeneration ? new AbortController() : void 0;
		if (params.expectedPairingGeneration && generationController) state.generationBoundInvokes.set(pending, {
			expectedGeneration: params.expectedPairingGeneration,
			controller: generationController
		});
		const signal = generationController ? params.signal ? AbortSignal.any([params.signal, generationController.signal]) : generationController.signal : params.signal;
		const idleTimeoutMs = resolveTimerTimeoutMs(params.idleTimeoutMs, 0, 0);
		state.context.invokeStreams.armPending({
			requestId,
			pending,
			timeoutMs,
			idleTimeoutMs,
			...signal ? { signal } : {}
		});
	});
	if (!state.context.pendingInvokes.has(requestId)) return await result;
	if (!state.context.sendEventToSession(node, "node.invoke.request", payload)) {
		const pending = state.context.pendingInvokes.get(requestId);
		if (pending) {
			state.context.invokeStreams.clearTimers(pending);
			state.context.pendingInvokes.delete(requestId);
			pending.resolve({
				ok: false,
				error: {
					code: "UNAVAILABLE",
					message: "failed to send invoke to node"
				}
			});
		}
		return await result;
	}
	if (systemRunEvent) state.context.rememberAuthorizedSystemRunEvent({
		nodeId: params.nodeId,
		connId: node.connId,
		...systemRunEvent
	});
	params.onDispatchReady?.(requestId);
	return await result;
}
function registerNodeRegistryPrivateRuntime(nodeRegistry, context) {
	const state = {};
	state.context = context;
	state.runnerInventoryByConn = /* @__PURE__ */ new Map();
	state.generationBoundInvokes = /* @__PURE__ */ new WeakMap();
	state.publishRunnerInventoryChanged = () => {};
	state.invokeCore = async (params, allowPrivateCommand) => await invokeNodeRegistryCore(state, params, allowPrivateCommand);
	state.updateRunnerInventory = (params) => updateWorkerRunnerInventory(state, params);
	state.workerSupervisorTransport = {
		listCurrentNodes: async () => {
			return (await context.listCurrentConnected()).flatMap((node) => {
				const proof = resolveWorkerSupervisorProof(node, state.runnerInventoryByConn);
				return proof ? [proof] : [];
			});
		},
		invoke: async (params) => {
			if (!NODE_WORKER_PRIVATE_COMMANDS.includes(params.command)) return {
				ok: false,
				error: {
					code: "INVALID_REQUEST",
					message: "private node command is not allowed"
				}
			};
			const isProofCurrent = () => params.isDispatchAuthorized() && isWorkerSupervisorProofCurrent(state, params.node, params.command === "worker.launch.v1");
			if (!isProofCurrent()) return {
				ok: false,
				error: {
					code: "PRIVATE_DIALECT_UNAVAILABLE",
					message: "node worker supervisor dialect is unavailable"
				}
			};
			return await state.invokeCore({
				nodeId: params.node.nodeId,
				expectedConnId: params.node.connId,
				expectedPairingGeneration: params.node.pairingGeneration,
				command: params.command,
				...params.params !== void 0 ? { params: params.params } : {},
				...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
				...params.signal ? { signal: params.signal } : {},
				...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
				isDispatchAuthorized: isProofCurrent,
				...params.onDispatchReady ? { onDispatchReady: params.onDispatchReady } : {}
			}, true);
		}
	};
	NODE_REGISTRY_PRIVATE_STATES.set(nodeRegistry, state);
}
function createNodeRegistryRuntime(create) {
	const nodeRegistry = create();
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized during creation");
	return {
		nodeRegistry,
		nodeWorkerSupervisorTransport: state.workerSupervisorTransport
	};
}
function setNodeRunnerInventoryChangedListener(nodeRegistry, listener) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	state.publishRunnerInventoryChanged = listener;
}
function invokePublicNodeRegistry(nodeRegistry, params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	return state.invokeCore(params, false);
}
function updateNodeRunnerInventory(params) {
	return NODE_REGISTRY_PRIVATE_STATES.get(params.registry)?.updateRunnerInventory({
		nodeId: params.nodeId,
		connId: params.connId,
		declaration: params.declaration
	}) ?? null;
}
function forgetNodeRunnerInventory(nodeRegistry, connId) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	const declaration = state?.runnerInventoryByConn.get(connId);
	if (!state || !declaration || !state.runnerInventoryByConn.delete(connId)) return;
	state.publishRunnerInventoryChanged(declaration.nodeId);
}
function isNodeRunnerSessionHost(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	const node = state?.context.getNode(params.nodeId);
	if (!state || !node || node.connId !== params.connId) return false;
	const proof = resolveWorkerSupervisorProof(node, state.runnerInventoryByConn);
	return Boolean(proof && proof.pairingGeneration === params.pairingGeneration && proof.workerRuns !== void 0);
}
function isNodeRegistryPendingInvokeConnectionActive(params) {
	const binding = NODE_REGISTRY_PRIVATE_STATES.get(params.registry)?.generationBoundInvokes.get(params.pending);
	return params.currentNode?.connId === params.pending.connId && (!binding || params.currentNode.pairingGeneration === binding.expectedGeneration);
}
function settleNodeRegistryPairingGenerationChange(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	if (!state) return;
	for (const pending of state.context.pendingInvokes.values()) {
		const binding = state.generationBoundInvokes.get(pending);
		if (pending.nodeId !== params.nodeId || pending.connId !== params.connId || !binding || binding.expectedGeneration === params.nextPairingGeneration) continue;
		binding.controller.abort(NODE_INVOKE_PAIRING_CHANGED_ABORT);
	}
}
//#endregion
export { isNodeRunnerSessionHost as a, settleNodeRegistryPairingGenerationChange as c, isNodeRegistryPendingInvokeConnectionActive as i, updateNodeRunnerInventory as l, forgetNodeRunnerInventory as n, registerNodeRegistryPrivateRuntime as o, invokePublicNodeRegistry as r, setNodeRunnerInventoryChangedListener as s, createNodeRegistryRuntime as t, NODE_INVOKE_PAIRING_CHANGED_ABORT as u };
