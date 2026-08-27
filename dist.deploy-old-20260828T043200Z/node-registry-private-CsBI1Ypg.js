import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.js";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-UYcIi_5g.js";
import { i as NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE, n as NODE_RUNNER_UPDATE_REQUIRED_ISSUE } from "./node-runner-inventory-C6KxqRM_.js";
import { S as NODE_WORKER_PRIVATE_COMMANDS, j as isPrivateNodeInvokeCommand } from "./node-commands-DRxP7loh.js";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-D0jNXqHr.js";
import { n as sameWorkerProtocolFeatures } from "./worker-build-identity-D_c48Wx_.js";
import { randomUUID } from "node:crypto";
//#region src/gateway/node-registry-private-token.ts
/** Unforgeable reason shared only by node-registry private pairing lifecycle owners. */
const NODE_INVOKE_PAIRING_CHANGED_ABORT = Symbol("nodeInvokePairingChanged");
//#endregion
//#region src/gateway/node-registry.system-run.ts
function resolvePendingSystemRunEvent(params) {
	const obj = asOptionalObjectRecord(params.params);
	if (params.command !== "system.run" || !obj) return;
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
	if (params.command !== "system.run" || !isRecord(params.params)) return params.params;
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
/** Normalize system.run timeout values, preserving null for no expiry. */
function normalizeSystemRunTimeoutMs(value) {
	if (value === void 0) return;
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const timeoutMs = Math.trunc(value);
	return timeoutMs > 0 ? resolveTimerTimeoutMs(timeoutMs, 1) : null;
}
//#endregion
//#region src/gateway/node-runner-inventory-runtime.ts
function sameBundleStatusObservation(left, right) {
	return left?.bundleHash === right?.bundleHash && left?.status.status === right?.status.status && (left?.status.status !== "installed" || right?.status.status === "installed" && left.status.version === right.status.version);
}
function createNodeRunnerStatePublisher(getNode, runnerInventoryByConn) {
	const availableNodeIds = /* @__PURE__ */ new Set();
	let listener = (_nodeId, _change) => {};
	const hasCurrent = (nodeId) => {
		const node = getNode(nodeId);
		return Boolean(node && node.client.invalidated !== true && resolveNodeWorkerSupervisorProof(node, runnerInventoryByConn));
	};
	return {
		hasCurrent,
		reconcile: (nodeId, inventoryChanged) => {
			const available = hasCurrent(nodeId);
			const availabilityChanged = availableNodeIds.has(nodeId) !== available;
			if (available) availableNodeIds.add(nodeId);
			else availableNodeIds.delete(nodeId);
			if (inventoryChanged || availabilityChanged) listener(nodeId, {
				inventoryChanged,
				availabilityChanged
			});
		},
		setListener: (next) => {
			listener = next;
		}
	};
}
function sameNodeWorkerHostDeclaration(left, right) {
	return left?.enabled === right?.enabled && (left?.enabled !== true || right?.enabled === true && left.capacity.total === right.capacity.total && left.capacity.available === right.capacity.available && left.bundlePrewarm === right.bundlePrewarm && left.bundleRetention === right.bundleRetention && left.bundleStatus === right.bundleStatus && left.portalStream === right.portalStream && left.environmentSession === right.environmentSession);
}
function resolveNodeWorkerSupervisorProof(node, runnerInventoryByConn) {
	const declaration = runnerInventoryByConn.get(node.connId);
	if (!declaration || !node.pairingIdentity || !node.pairingGeneration || node.clientId !== GATEWAY_CLIENT_IDS.NODE_HOST || node.clientMode !== "node" || declaration.nodeId !== node.nodeId || declaration.pairingIdentity !== node.pairingIdentity || declaration.pairingGeneration !== node.pairingGeneration || declaration.clientId !== node.clientId || declaration.clientMode !== node.clientMode || !declaration.protocolFeatures.includes("node-worker-supervisor-v6") || declaration.workerHost?.enabled !== true) return;
	return {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		pairingGeneration: node.pairingGeneration,
		clientId: GATEWAY_CLIENT_IDS.NODE_HOST,
		clientMode: "node",
		protocolFeature: NODE_WORKER_SUPERVISOR_PROTOCOL_FEATURE,
		workerHost: {
			...declaration.workerHost,
			capacity: { ...declaration.workerHost.capacity }
		},
		commands: [...node.commands]
	};
}
function resolveNodeRunnerInventoryIssue(node, runnerInventoryByConn) {
	const declaration = runnerInventoryByConn.get(node.connId);
	return declaration && node.client.invalidated !== true && declaration.nodeId === node.nodeId && declaration.pairingIdentity === node.pairingIdentity && declaration.pairingGeneration !== void 0 && declaration.pairingGeneration === node.pairingGeneration && declaration.clientId === GATEWAY_CLIENT_IDS.NODE_HOST && declaration.clientMode === "node" && declaration.protocolFeatures.length === 1 && declaration.protocolFeatures[0] !== "node-worker-supervisor-v6" ? NODE_RUNNER_UPDATE_REQUIRED_ISSUE : void 0;
}
//#endregion
//#region src/gateway/node-registry-private.ts
const NODE_REGISTRY_PRIVATE_STATES = /* @__PURE__ */ new WeakMap();
function isWorkerSupervisorProofCurrent(state, proof, requireLaunchEligibility, requiredCommands = [], requireEnvironmentSession = false) {
	const node = state.context.getNode(proof.nodeId);
	if (!node || node.client.invalidated === true || node.connId !== proof.connId) return false;
	const current = resolveNodeWorkerSupervisorProof(node, state.runnerInventoryByConn);
	return current?.pairingIdentity === proof.pairingIdentity && current.pairingGeneration === proof.pairingGeneration && current.clientId === proof.clientId && current.clientMode === proof.clientMode && current.protocolFeature === proof.protocolFeature && (!requireLaunchEligibility || current.workerHost.capacity.available > 0) && (!requireEnvironmentSession || current.workerHost.environmentSession === 1) && requiredCommands.every((command) => current.commands.includes(command));
}
function updateWorkerRunnerInventory(state, params) {
	const node = state.context.getNode(params.nodeId);
	const publishesRunnerDialect = params.declaration.protocolFeatures.length === 1;
	if (!node || node.client.invalidated === true || node.connId !== params.connId || node.clientId !== GATEWAY_CLIENT_IDS.NODE_HOST || node.clientMode !== "node") return null;
	const previous = state.runnerInventoryByConn.get(node.connId);
	if (!publishesRunnerDialect) {
		const inventoryChanged = state.runnerInventoryByConn.delete(node.connId);
		const statusChanged = state.bundleStatusByConn.delete(node.connId);
		const changed = inventoryChanged || statusChanged;
		if (changed) {
			state.context.publishActiveNodeContext();
			state.runnerState.reconcile(node.nodeId, true);
		}
		return { changed };
	}
	const workerHost = "workerHost" in params.declaration ? params.declaration.workerHost : void 0;
	const next = {
		nodeId: node.nodeId,
		connId: node.connId,
		pairingIdentity: node.pairingIdentity,
		...node.pairingGeneration ? { pairingGeneration: node.pairingGeneration } : {},
		clientId: GATEWAY_CLIENT_IDS.NODE_HOST,
		clientMode: "node",
		protocolFeatures: [...params.declaration.protocolFeatures],
		...workerHost ? { workerHost: workerHost.enabled ? {
			...workerHost,
			capacity: { ...workerHost.capacity }
		} : { enabled: false } } : {}
	};
	const statusCleared = next.workerHost?.enabled !== true || next.workerHost.bundleRetention === void 0 || next.workerHost.bundleStatus === void 0 ? state.bundleStatusByConn.delete(node.connId) : false;
	const changed = !previous || previous.pairingGeneration !== next.pairingGeneration || !sameWorkerProtocolFeatures(previous.protocolFeatures, next.protocolFeatures) || !sameNodeWorkerHostDeclaration(previous.workerHost, next.workerHost) || statusCleared;
	if (changed) {
		state.runnerInventoryByConn.set(node.connId, next);
		state.context.publishActiveNodeContext();
		state.runnerState.reconcile(node.nodeId, true);
	}
	return { changed };
}
async function invokeNodeRegistryCore(state, params, allowPrivateCommand) {
	let timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 3e4, 0);
	const deadlineAtMs = Number.isFinite(params.timeoutMs) && timeoutMs > 0 ? Date.now() + timeoutMs : void 0;
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
		const pairingNode = node;
		const resolution = await awaitWithinDeadline(() => state.context.resolvePairingLease(pairingNode), deadlineAtMs);
		if (resolution === ABSOLUTE_DEADLINE_EXPIRED) return {
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		};
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
	const requestId = randomUUID();
	const invokeParams = normalizeSystemRunInvokeParams({
		command: params.command,
		params: params.params
	});
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
	if (params.isDispatchAuthorized?.() === false) return {
		ok: false,
		error: {
			code: "APPROVAL_AUTHORITY_CLOSED",
			message: "runtime authority closed before node dispatch"
		}
	};
	if (deadlineAtMs !== void 0) {
		timeoutMs = Math.max(0, deadlineAtMs - Date.now());
		if (timeoutMs === 0) return {
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		};
		payload.timeoutMs = timeoutMs;
	}
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
	state.bundleStatusByConn = /* @__PURE__ */ new Map();
	state.runnerState = createNodeRunnerStatePublisher(context.getNode, state.runnerInventoryByConn);
	state.generationBoundInvokes = /* @__PURE__ */ new WeakMap();
	state.invokeCore = async (params, allowPrivateCommand) => await invokeNodeRegistryCore(state, params, allowPrivateCommand);
	state.updateRunnerInventory = (params) => updateWorkerRunnerInventory(state, params);
	state.workerSupervisorTransport = {
		listCurrentNodes: async () => {
			return (await context.listCurrentConnected()).flatMap((node) => {
				const proof = resolveNodeWorkerSupervisorProof(node, state.runnerInventoryByConn);
				return proof ? [proof] : [];
			});
		},
		hasCurrentRunner: state.runnerState.hasCurrent,
		getIssue: (nodeId) => {
			const node = context.getNode(nodeId);
			return node ? resolveNodeRunnerInventoryIssue(node, state.runnerInventoryByConn) : void 0;
		},
		getBundleStatus: (nodeId) => {
			const node = context.getNode(nodeId);
			const observation = node ? state.bundleStatusByConn.get(node.connId) : void 0;
			return observation ? structuredClone(observation) : void 0;
		},
		acceptBundleStatus: (node, observation) => {
			if (!isWorkerSupervisorProofCurrent(state, node, false)) return false;
			const currentNode = state.context.getNode(node.nodeId);
			const currentProof = currentNode ? resolveNodeWorkerSupervisorProof(currentNode, state.runnerInventoryByConn) : void 0;
			if (currentProof?.workerHost.bundleRetention !== 1 || currentProof.workerHost.bundleStatus !== 1) return false;
			const previous = state.bundleStatusByConn.get(node.connId);
			if (observation) state.bundleStatusByConn.set(node.connId, structuredClone(observation));
			else state.bundleStatusByConn.delete(node.connId);
			if (!sameBundleStatusObservation(previous, observation)) state.runnerState.reconcile(node.nodeId, true);
			return true;
		},
		isCurrent: (node, requireLaunchEligibility = false, requiredCommands = []) => isWorkerSupervisorProofCurrent(state, node, requireLaunchEligibility, requiredCommands),
		invoke: async (params) => {
			if (!NODE_WORKER_PRIVATE_COMMANDS.includes(params.command)) return {
				ok: false,
				error: {
					code: "INVALID_REQUEST",
					message: "private node command is not allowed"
				}
			};
			const isProofCurrent = () => params.isDispatchAuthorized() && isWorkerSupervisorProofCurrent(state, params.node, false, [], params.command === "worker.launch.v1" || params.command === "worker.environment.stop.v1");
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
function setNodeRunnerStateChangedListener(nodeRegistry, listener) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	state.runnerState.setListener(listener);
}
function reconcileNodeRunnerAvailability(nodeRegistry, nodeId) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(nodeRegistry);
	if (!state) throw new Error("node registry private runtime was not initialized");
	state.runnerState.reconcile(nodeId, false);
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
	state.bundleStatusByConn.delete(connId);
	state.runnerState.reconcile(declaration.nodeId, true);
}
function isNodeRunnerSessionHost(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	const node = state?.context.getNode(params.nodeId);
	if (!state || !node || node.connId !== params.connId) return false;
	const proof = resolveNodeWorkerSupervisorProof(node, state.runnerInventoryByConn);
	return Boolean(proof && proof.pairingGeneration === params.pairingGeneration);
}
function getNodeRunnerInventoryIssue(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	const node = state?.context.getNode(params.nodeId);
	return state && node?.connId === params.connId ? resolveNodeRunnerInventoryIssue(node, state.runnerInventoryByConn) : void 0;
}
function collectNodeWorkerCapacityByNodeId(registry, connectedNodes) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(registry);
	return new Map(connectedNodes.flatMap((node) => {
		const current = state?.context.getNode(node.nodeId);
		if (!state || !current || current.connId !== node.connId) return [];
		const proof = resolveNodeWorkerSupervisorProof(current, state.runnerInventoryByConn);
		return proof ? [[node.nodeId, { ...proof.workerHost.capacity }]] : [];
	}));
}
function collectNodeWorkerBundleStatusByNodeId(registry, connectedNodes) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(registry);
	return new Map(connectedNodes.flatMap((node) => {
		const observation = (state?.context.getNode(node.nodeId))?.connId === node.connId ? state?.bundleStatusByConn.get(node.connId) : void 0;
		return observation ? [[node.nodeId, structuredClone(observation.status)]] : [];
	}));
}
/** Shared node/environments read-projection shape: nodeId -> runner issues. */
function collectNodeRunnerIssuesByNodeId(registry, connectedNodes) {
	return new Map(connectedNodes.flatMap((node) => {
		const issue = getNodeRunnerInventoryIssue({
			registry,
			nodeId: node.nodeId,
			connId: node.connId
		});
		return issue ? [[node.nodeId, [issue]]] : [];
	}));
}
function isNodeRegistryPendingInvokeConnectionActive(params) {
	const binding = NODE_REGISTRY_PRIVATE_STATES.get(params.registry)?.generationBoundInvokes.get(params.pending);
	return params.currentNode?.connId === params.pending.connId && (!binding || params.currentNode.pairingGeneration === binding.expectedGeneration);
}
function settleNodeRegistryPairingGenerationChange(params) {
	const state = NODE_REGISTRY_PRIVATE_STATES.get(params.registry);
	if (!state) return;
	const inventoryChanged = state.runnerInventoryByConn.delete(params.connId);
	const statusChanged = state.bundleStatusByConn.delete(params.connId);
	if (inventoryChanged || statusChanged) state.runnerState.reconcile(params.nodeId, true);
	for (const pending of state.context.pendingInvokes.values()) {
		const binding = state.generationBoundInvokes.get(pending);
		if (pending.nodeId !== params.nodeId || pending.connId !== params.connId || !binding || binding.expectedGeneration === params.nextPairingGeneration) continue;
		binding.controller.abort(NODE_INVOKE_PAIRING_CHANGED_ABORT);
	}
}
//#endregion
export { forgetNodeRunnerInventory as a, isNodeRunnerSessionHost as c, setNodeRunnerStateChangedListener as d, settleNodeRegistryPairingGenerationChange as f, createNodeRegistryRuntime as i, reconcileNodeRunnerAvailability as l, NODE_INVOKE_PAIRING_CHANGED_ABORT as m, collectNodeWorkerBundleStatusByNodeId as n, invokePublicNodeRegistry as o, updateNodeRunnerInventory as p, collectNodeWorkerCapacityByNodeId as r, isNodeRegistryPendingInvokeConnectionActive as s, collectNodeRunnerIssuesByNodeId as t, registerNodeRegistryPrivateRuntime as u };
