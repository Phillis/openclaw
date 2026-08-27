import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { s as setNodeRunnerInventoryChangedListener, t as createNodeRegistryRuntime } from "./node-registry-private-Dh9eqO6p.js";
import { n as serializeEventPayload, t as NodeRegistry } from "./node-registry-ID87BamQ.js";
import { t as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED } from "./events-TB-ePJT1.js";
import { a as isPairedDeviceNodeBindingCurrent, o as resolveCurrentPairedDeviceNodeBinding } from "./device-pairing-node-state-BDYAK1fe.js";
//#region src/gateway/server-node-subscriptions.ts
/** Manages node subscriptions to gateway session events. */
function createNodeSubscriptionManager() {
	const nodeSubscriptions = /* @__PURE__ */ new Map();
	const sessionSubscribers = /* @__PURE__ */ new Map();
	const toPayloadJSON = (payload) => {
		try {
			return serializeEventPayload(payload);
		} catch {
			return;
		}
	};
	const settleFanout = async (sends) => {
		await Promise.allSettled(sends.map((send) => Promise.resolve().then(send)));
	};
	const subscribe = (nodeId, pairingGeneration, sessionKey) => {
		const normalizedNodeId = nodeId.trim();
		const normalizedPairingGeneration = pairingGeneration.trim();
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedNodeId || !normalizedPairingGeneration || !normalizedSessionKey) return;
		let nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (nodeEntry?.pairingGeneration !== normalizedPairingGeneration) {
			unsubscribeAll(normalizedNodeId);
			nodeEntry = void 0;
		}
		if (!nodeEntry) {
			nodeEntry = {
				pairingGeneration: normalizedPairingGeneration,
				sessionKeys: /* @__PURE__ */ new Set()
			};
			nodeSubscriptions.set(normalizedNodeId, nodeEntry);
		}
		if (nodeEntry.sessionKeys.has(normalizedSessionKey)) return;
		nodeEntry.sessionKeys.add(normalizedSessionKey);
		let sessionMap = sessionSubscribers.get(normalizedSessionKey);
		if (!sessionMap) {
			sessionMap = /* @__PURE__ */ new Map();
			sessionSubscribers.set(normalizedSessionKey, sessionMap);
		}
		sessionMap.set(normalizedNodeId, normalizedPairingGeneration);
	};
	const unsubscribe = (nodeId, pairingGeneration, sessionKey) => {
		const normalizedNodeId = nodeId.trim();
		const normalizedPairingGeneration = pairingGeneration.trim();
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedNodeId || !normalizedPairingGeneration || !normalizedSessionKey) return;
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (nodeEntry?.pairingGeneration !== normalizedPairingGeneration) return;
		nodeEntry.sessionKeys.delete(normalizedSessionKey);
		if (nodeEntry.sessionKeys.size === 0) nodeSubscriptions.delete(normalizedNodeId);
		const sessionMap = sessionSubscribers.get(normalizedSessionKey);
		if (sessionMap?.get(normalizedNodeId) === normalizedPairingGeneration) sessionMap.delete(normalizedNodeId);
		if (sessionMap?.size === 0) sessionSubscribers.delete(normalizedSessionKey);
	};
	function unsubscribeAll(nodeId, pairingGeneration) {
		const normalizedNodeId = nodeId.trim();
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (!nodeEntry || pairingGeneration !== void 0 && nodeEntry.pairingGeneration !== pairingGeneration.trim()) return;
		for (const sessionKey of nodeEntry.sessionKeys) {
			const sessionMap = sessionSubscribers.get(sessionKey);
			if (sessionMap?.get(normalizedNodeId) === nodeEntry.pairingGeneration) sessionMap.delete(normalizedNodeId);
			if (sessionMap?.size === 0) sessionSubscribers.delete(sessionKey);
		}
		nodeSubscriptions.delete(normalizedNodeId);
	}
	const updatePairingGeneration = (params) => {
		const normalizedNodeId = params.nodeId.trim();
		const previousPairingGeneration = params.previousPairingGeneration.trim();
		const nextPairingGeneration = params.nextPairingGeneration.trim();
		const nodeEntry = nodeSubscriptions.get(normalizedNodeId);
		if (!nodeEntry || !previousPairingGeneration || nodeEntry.pairingGeneration !== previousPairingGeneration) return;
		if (!params.preserveSubscriptions || !nextPairingGeneration) {
			unsubscribeAll(normalizedNodeId, previousPairingGeneration);
			return;
		}
		nodeEntry.pairingGeneration = nextPairingGeneration;
		for (const sessionKey of nodeEntry.sessionKeys) sessionSubscribers.get(sessionKey)?.set(normalizedNodeId, nextPairingGeneration);
	};
	const sendToSession = async (sessionKey, event, payload, sendEvent) => {
		const normalizedSessionKey = sessionKey.trim();
		if (!normalizedSessionKey || !sendEvent) return;
		const subscribers = sessionSubscribers.get(normalizedSessionKey);
		if (!subscribers || subscribers.size === 0) return;
		const payloadJSON = toPayloadJSON(payload);
		if (payloadJSON === void 0) return;
		await settleFanout([...subscribers].map(([nodeId, pairingGeneration]) => () => sendEvent({
			nodeId,
			pairingGeneration,
			event,
			payloadJSON
		})));
	};
	const sendToAllSubscribed = async (event, payload, sendEvent) => {
		if (!sendEvent) return;
		const payloadJSON = toPayloadJSON(payload);
		if (payloadJSON === void 0) return;
		await settleFanout([...nodeSubscriptions].map(([nodeId, subscription]) => () => sendEvent({
			nodeId,
			pairingGeneration: subscription.pairingGeneration,
			event,
			payloadJSON
		})));
	};
	const sendToAllConnected = async (event, payload, listConnected, sendEvent) => {
		if (!sendEvent || !listConnected) return;
		const payloadJSON = toPayloadJSON(payload);
		if (payloadJSON === void 0) return;
		await settleFanout(listConnected().map((node) => () => node.pairingGeneration ? sendEvent({
			nodeId: node.nodeId,
			pairingGeneration: node.pairingGeneration,
			event,
			payloadJSON
		}) : void 0));
	};
	const clear = () => {
		nodeSubscriptions.clear();
		sessionSubscribers.clear();
	};
	return {
		subscribe,
		unsubscribe,
		unsubscribeAll,
		updatePairingGeneration,
		sendToSession,
		sendToAllSubscribed,
		sendToAllConnected,
		clear
	};
}
//#endregion
//#region src/gateway/server-talk-nodes.ts
const TALK_CAPABILITY = "talk";
const TALK_COMMAND_PREFIX = "talk.";
/** Returns true when any connected node can handle talk routing. */
async function hasConnectedTalkNode(registry) {
	return (await registry.listCurrentConnected()).some(isTalkCapableNode);
}
function isTalkCapableNode(node) {
	return node.caps.some((capability) => normalizeOptionalLowercaseString(capability) === TALK_CAPABILITY) || node.commands.some((command) => normalizeOptionalLowercaseString(command)?.startsWith(TALK_COMMAND_PREFIX));
}
//#endregion
//#region src/gateway/server-node-session-runtime.ts
/** Creates node registry/subscription runtime state for a gateway server. */
function createGatewayNodeSessionRuntime(params) {
	const nodeSubscriptions = createNodeSubscriptionManager();
	const { nodeRegistry, nodeWorkerSupervisorTransport } = createNodeRegistryRuntime(() => new NodeRegistry({
		listRegisteredNodePluginToolCommands: params.listRegisteredNodePluginToolCommands,
		nodePluginToolsEnabled: params.nodePluginToolsEnabled,
		nodeSkillsEnabled: params.nodeSkillsEnabled,
		resolveCurrentPairingState: params.resolveCurrentPairingState ?? resolveCurrentPairedDeviceNodeBinding,
		isPairingStateCurrent: params.isPairingStateCurrent ?? isPairedDeviceNodeBindingCurrent,
		onPairingInvalidated: params.onPairingInvalidated,
		onPairingGenerationChanged: (change) => {
			nodeSubscriptions.updatePairingGeneration({
				...change,
				preserveSubscriptions: change.preserveSessionState
			});
			params.onPairingGenerationChanged?.(change);
		}
	}));
	setNodeRunnerInventoryChangedListener(nodeRegistry, (nodeId) => {
		params.broadcast(GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED, { nodeId }, { dropIfSlow: true });
		params.onRunnerInventoryChanged?.(nodeId);
	});
	const nodePresenceTimers = /* @__PURE__ */ new Map();
	const sessionEventSubscribers = params.sessionEventSubscribers;
	const sessionMessageSubscribers = params.sessionMessageSubscribers;
	const nodeSendEvent = (opts) => {
		return nodeRegistry.sendEventRawForPairingGeneration(opts.nodeId, opts.pairingGeneration, opts.event, opts.payloadJSON ?? null);
	};
	const nodeSendToSession = (sessionKey, event, payload) => {
		nodeSubscriptions.sendToSession(sessionKey, event, payload, nodeSendEvent);
	};
	const nodeSendToAllSubscribed = (event, payload) => {
		nodeSubscriptions.sendToAllSubscribed(event, payload, nodeSendEvent);
	};
	const resolveSubscriptionGeneration = (nodeId, connId) => {
		const node = nodeRegistry.get(nodeId);
		return connId && node?.connId === connId ? node.pairingGeneration : void 0;
	};
	const nodeSubscribe = (nodeId, sessionKey, connId) => {
		const pairingGeneration = resolveSubscriptionGeneration(nodeId, connId);
		if (pairingGeneration) nodeSubscriptions.subscribe(nodeId, pairingGeneration, sessionKey);
	};
	const nodeUnsubscribe = (nodeId, sessionKey, connId) => {
		const pairingGeneration = resolveSubscriptionGeneration(nodeId, connId);
		if (pairingGeneration) nodeSubscriptions.unsubscribe(nodeId, pairingGeneration, sessionKey);
	};
	const sendVoiceWakeEventToCurrentNodes = (event, payload) => {
		const payloadJSON = serializeEventPayload(payload);
		for (const node of nodeRegistry.listConnected()) {
			const pairingGeneration = node.pairingGeneration;
			if (!pairingGeneration) {
				if (node.pairingIdentity) nodeRegistry.sendEventForPairingIdentity({
					nodeId: node.nodeId,
					connId: node.connId,
					pairingIdentity: node.pairingIdentity,
					event,
					payload
				}).catch(() => void 0);
				continue;
			}
			nodeRegistry.sendEventRawForPairingGeneration(node.nodeId, pairingGeneration, event, payloadJSON).catch(() => void 0);
		}
	};
	const broadcastVoiceWakeChanged = (triggers) => {
		params.broadcast("voicewake.changed", { triggers }, { dropIfSlow: true });
		sendVoiceWakeEventToCurrentNodes("voicewake.changed", { triggers });
	};
	const broadcastVoiceWakeRoutingChanged = (config) => {
		params.broadcast("voicewake.routing.changed", { config }, { dropIfSlow: true });
		sendVoiceWakeEventToCurrentNodes("voicewake.routing.changed", { config });
	};
	const hasTalkNodeConnected = () => hasConnectedTalkNode(nodeRegistry);
	return {
		nodeRegistry,
		nodeWorkerSupervisorTransport,
		nodePresenceTimers,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		nodeSendToSession,
		nodeSendToAllSubscribed,
		nodeSubscribe,
		nodeUnsubscribe,
		nodeUnsubscribeAll: nodeSubscriptions.unsubscribeAll,
		broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged,
		hasTalkNodeConnected
	};
}
//#endregion
export { createGatewayNodeSessionRuntime };
