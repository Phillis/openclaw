import { D as resolveExpiresAtMsFromDurationMs, a as addTimerTimeoutGraceMs, g as isFutureDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as GATEWAY_CLIENT_IDS } from "./client-info-yubNQC1L.js";
import "./node-commands-DemsbVYQ.js";
import { h as parseComputerUseCapabilityDescriptor } from "./computer-use-contract-Din_sL74.js";
import { a as removeConnectedNodePluginTools, i as normalizeNodePluginToolDescriptors, o as replaceConnectedNodePluginTools, t as createRegisteredNodePluginToolDescriptorMap } from "./node-plugin-tool-snapshot-CtaKhxdi.js";
import { r as setActiveNodeContext } from "./active-node-context-_qYwwG99.js";
import { n as logRejectedLargePayload } from "./diagnostic-payload-BRcHXXpb.js";
import { c as settleNodeRegistryPairingGenerationChange, i as isNodeRegistryPendingInvokeConnectionActive, n as forgetNodeRunnerInventory, o as registerNodeRegistryPrivateRuntime, r as invokePublicNodeRegistry, u as NODE_INVOKE_PAIRING_CHANGED_ABORT } from "./node-registry-private-BEIBFAdy.js";
import { i as NODE_SKILL_NAME_RE } from "./node-skill-constraints-DLpuutsb.js";
import { i as MAX_BUFFERED_BYTES } from "./server-constants-DKuFNbQH.js";
//#region src/gateway/node-registry.invoke-stream.ts
const MAX_PENDING_PROGRESS_CHUNKS = 128;
const MAX_INVOKE_INPUT_BYTES = 16 * 1024;
var NodeInvokeStreamController = class {
	constructor(options) {
		this.options = options;
	}
	sendInput(invokeId, payload) {
		const pending = this.options.pendingInvokes.get(invokeId);
		if (!pending) throw new Error("node invoke is not pending");
		const payloadJSON = JSON.stringify(payload);
		if (payloadJSON === void 0) throw new Error("node invoke input is not serializable");
		if (Buffer.byteLength(payloadJSON, "utf8") > MAX_INVOKE_INPUT_BYTES) throw new Error("node invoke input exceeds 16 KiB");
		if (!this.options.isConnectionActive(pending)) throw new Error("node invoke connection or pairing generation is unavailable");
		if (!this.options.sendInput(invokeId, pending, pending.nextInputSeq, payloadJSON)) throw new Error("failed to send node invoke input");
		pending.nextInputSeq += 1;
	}
	handleDisconnect(connId) {
		for (const [id, pending] of this.options.pendingInvokes) {
			if (pending.connId !== connId) continue;
			if (pending.deadlineAtMs !== void 0 && Date.now() >= pending.deadlineAtMs) {
				this.settleTimeout(id, pending);
				continue;
			}
			if (!this.takePending(id, pending)) continue;
			this.options.disconnectPending(pending);
		}
	}
	handleResult(params) {
		const pending = this.options.pendingInvokes.get(params.id);
		if (!pending || pending.nodeId !== params.nodeId || pending.connId !== params.connId || !this.options.isConnectionActive(pending)) return false;
		if (pending.deadlineAtMs !== void 0 && Date.now() >= pending.deadlineAtMs) {
			this.settleTimeout(params.id, pending);
			return false;
		}
		if (!this.takePending(params.id, pending)) return false;
		if (!params.ok) this.options.onFailedResult(pending);
		pending.resolve({
			ok: params.ok,
			payload: params.payload,
			payloadJSON: params.payloadJSON ?? null,
			error: params.error ?? null
		});
		return true;
	}
	armPending(params) {
		if (params.timeoutMs > 0) params.pending.deadlineAtMs = Date.now() + params.timeoutMs;
		this.options.pendingInvokes.set(params.requestId, params.pending);
		if (params.timeoutMs > 0) params.pending.hardTimer = setTimeout(() => {
			this.settleTimeout(params.requestId, params.pending);
		}, params.timeoutMs);
		if (params.pending.onProgress && params.idleTimeoutMs > 0) params.pending.idleTimeoutMs = params.idleTimeoutMs;
		if (params.signal) {
			const onAbort = () => {
				if (params.pending.deadlineAtMs !== void 0 && Date.now() >= params.pending.deadlineAtMs) {
					this.settleTimeout(params.requestId, params.pending);
					return;
				}
				if (!this.takePending(params.requestId, params.pending)) return;
				this.sendInvokeCancel(params.requestId, params.pending);
				this.options.onFailedResult(params.pending);
				const pairingChanged = params.signal?.reason === NODE_INVOKE_PAIRING_CHANGED_ABORT;
				params.pending.resolve({
					ok: false,
					error: pairingChanged ? {
						code: "PAIRING_CHANGED",
						message: "node pairing changed after dispatch"
					} : {
						code: "ABORTED",
						message: "node invoke cancelled"
					}
				});
			};
			params.signal.addEventListener("abort", onAbort, { once: true });
			params.pending.removeAbortListener = () => params.signal?.removeEventListener("abort", onAbort);
			if (params.signal.aborted) onAbort();
		}
	}
	handleProgress(params) {
		const pending = this.options.pendingInvokes.get(params.invokeId);
		if (!pending || pending.nodeId !== params.nodeId || pending.connId !== params.connId || !this.options.isConnectionActive(pending) || !pending.onProgress || params.seq < pending.nextProgressSeq) return false;
		if (params.seq > pending.nextProgressSeq) {
			if (pending.progressChunks.has(params.seq)) return false;
			if (pending.progressChunks.size >= MAX_PENDING_PROGRESS_CHUNKS) return false;
		}
		pending.progressChunks.set(params.seq, params.chunk);
		this.resetIdleTimer(params.invokeId, pending);
		while (true) {
			const chunk = pending.progressChunks.get(pending.nextProgressSeq);
			if (chunk === void 0) break;
			pending.progressChunks.delete(pending.nextProgressSeq);
			pending.nextProgressSeq += 1;
			try {
				pending.onProgress(chunk);
			} catch (error) {
				this.sendInvokeCancel(params.invokeId, pending);
				this.clearTimers(pending);
				this.options.pendingInvokes.delete(params.invokeId);
				pending.reject(error instanceof Error ? error : new Error(String(error)));
				break;
			}
			if (this.options.pendingInvokes.get(params.invokeId) !== pending) {
				pending.progressChunks.clear();
				break;
			}
		}
		return true;
	}
	clearTimers(pending) {
		if (pending.hardTimer) clearTimeout(pending.hardTimer);
		if (pending.idleTimer) clearTimeout(pending.idleTimer);
		pending.removeAbortListener?.();
		pending.removeAbortListener = void 0;
	}
	createIdleTimer(requestId, pending) {
		return setTimeout(() => {
			if (!this.takePending(requestId, pending)) return;
			this.sendInvokeCancel(requestId, pending);
			pending.resolve({
				ok: false,
				error: {
					code: "IDLE_TIMEOUT",
					message: "node invoke produced no progress"
				}
			});
		}, pending.idleTimeoutMs);
	}
	resetIdleTimer(requestId, pending) {
		if (!pending.idleTimeoutMs) return;
		if (pending.idleTimer) clearTimeout(pending.idleTimer);
		pending.idleTimer = this.createIdleTimer(requestId, pending);
	}
	sendInvokeCancel(requestId, pending) {
		this.options.sendCancel(requestId, pending);
	}
	settleTimeout(requestId, pending) {
		if (!this.takePending(requestId, pending)) return;
		this.sendInvokeCancel(requestId, pending);
		pending.resolve({
			ok: false,
			error: {
				code: "TIMEOUT",
				message: "node invoke timed out"
			}
		});
	}
	takePending(requestId, pending) {
		if (this.options.pendingInvokes.get(requestId) !== pending) return false;
		this.options.pendingInvokes.delete(requestId);
		this.clearTimers(pending);
		return true;
	}
};
//#endregion
//#region src/gateway/node-skill-descriptors.ts
const log = createSubsystemLogger("gateway/node-skills");
function normalizeNodeSkillDescriptors(params) {
	if (params.enabled === false) return [];
	const normalized = [];
	const seen = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	let droppedCount = 0;
	for (const skill of params.skills ?? []) {
		const name = skill.name.trim();
		const description = skill.description.trim();
		const contentBytes = Buffer.byteLength(skill.content, "utf8");
		if (!NODE_SKILL_NAME_RE.test(name) || !description || description.length > 1024 || !skill.content || contentBytes > 65536 || seen.has(name) || normalized.length >= 64 || totalBytes + contentBytes > 524288) {
			droppedCount += 1;
			continue;
		}
		seen.add(name);
		totalBytes += contentBytes;
		normalized.push({
			name,
			description,
			content: skill.content
		});
	}
	if (droppedCount > 0) log.warn(`node ${params.nodeId} published ${params.skills?.length ?? 0} skill descriptors; dropped ${droppedCount} invalid or over-limit descriptors`);
	return normalized.toSorted((left, right) => left.name.localeCompare(right.name, "en"));
}
//#endregion
//#region src/gateway/node-registry.ts
const SERIALIZED_EVENT_PAYLOAD = Symbol("openclaw.serializedEventPayload");
const AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS = 300 * 1e3;
const WEBSOCKET_OPEN_READY_STATE = 1;
const SLOW_CONSUMER_CLOSE_CODE = 1008;
function pairingBindingForSession(node) {
	return {
		identity: node.pairingIdentity,
		...node.pairingGeneration ? { generation: node.pairingGeneration } : {}
	};
}
function pairingStateMatchesBinding(binding, current) {
	if (!current) return false;
	if (binding.identity !== current.identity) return false;
	return !binding.generation || binding.generation === current.generation;
}
/** Serialize an event payload once so fanout can reuse the same JSON string. */
function serializeEventPayload(payload) {
	if (payload === void 0) return null;
	const json = JSON.stringify(payload);
	return typeof json === "string" ? {
		json,
		[SERIALIZED_EVENT_PAYLOAD]: true
	} : null;
}
/** Narrow values created by serializeEventPayload. */
function isSerializedEventPayload(value) {
	return typeof value === "object" && value !== null && value[SERIALIZED_EVENT_PAYLOAD] === true && typeof value.json === "string";
}
/** Registry of currently connected Gateway nodes. */
var NodeRegistry = class {
	constructor(options = {}) {
		this.options = options;
		this.nodesById = /* @__PURE__ */ new Map();
		this.nodesByConn = /* @__PURE__ */ new Map();
		this.eventTransportsByConn = /* @__PURE__ */ new Map();
		this.pendingInvokes = /* @__PURE__ */ new Map();
		this.invokeStreams = new NodeInvokeStreamController({
			pendingInvokes: this.pendingInvokes,
			sendCancel: (requestId, pending) => {
				const node = this.nodesById.get(pending.nodeId);
				if (!node || node.connId !== pending.connId || !pending.onProgress && node.clientId !== GATEWAY_CLIENT_IDS.NODE_HOST) return;
				this.sendEventToSession(node, "node.invoke.cancel", {
					invokeId: requestId,
					nodeId: pending.nodeId
				});
			},
			isConnectionActive: (pending) => {
				const node = this.nodesById.get(pending.nodeId);
				return isNodeRegistryPendingInvokeConnectionActive({
					registry: this,
					pending,
					currentNode: node
				});
			},
			sendInput: (invokeId, pending, seq, payloadJSON) => {
				const node = this.nodesById.get(pending.nodeId);
				return node ? this.sendEventToSession(node, "node.invoke.input", {
					id: invokeId,
					nodeId: pending.nodeId,
					seq,
					payloadJSON
				}) : false;
			},
			onFailedResult: (pending) => {
				if (pending.systemRunEvent) this.forgetAuthorizedSystemRunEvent({
					nodeId: pending.nodeId,
					connId: pending.connId,
					...pending.systemRunEvent
				});
			},
			disconnectPending: (pending) => {
				if (pending.command === "mcp.tools.call.v1") pending.resolve({
					ok: false,
					error: {
						code: "MCP_SERVER_UNAVAILABLE",
						message: "node host disconnected during MCP tool call"
					}
				});
				else pending.resolve({
					ok: false,
					error: {
						code: "DISCONNECTED",
						message: `node disconnected (${pending.command})`
					}
				});
			}
		});
		this.authorizedSystemRunEvents = /* @__PURE__ */ new Map();
		this.pairingGenerationEventChains = /* @__PURE__ */ new Map();
		registerNodeRegistryPrivateRuntime(this, {
			getNode: (nodeId) => this.nodesById.get(nodeId),
			listCurrentConnected: () => this.listCurrentConnected(),
			hasCurrentPairingStateResolver: Boolean(this.options.resolveCurrentPairingState),
			resolvePairingLease: async (node) => {
				const current = this.nodesById.get(node.nodeId);
				if (!current || current.connId !== node.connId || current.pairingIdentity !== node.pairingIdentity || current.pairingGeneration !== node.pairingGeneration) return {
					status: "stale",
					presenceInvalidated: false
				};
				return await this.resolvePairingLease(this.capturePairingLease(current), { invalidateStale: false });
			},
			pendingInvokes: this.pendingInvokes,
			invokeStreams: this.invokeStreams,
			sendEventToSession: (node, event, payload) => {
				const current = this.nodesById.get(node.nodeId);
				return current?.connId === node.connId ? this.sendEventToSession(current, event, payload) : false;
			},
			rememberAuthorizedSystemRunEvent: (event) => this.rememberAuthorizedSystemRunEvent(event),
			publishActiveNodeContext: () => this.publishActiveNodeContext()
		});
	}
	listConnectedSessions() {
		return [...this.nodesById.values()].filter((node) => node.client.invalidated !== true);
	}
	capturePairingLease(node) {
		return {
			session: node,
			nodeId: node.nodeId,
			connId: node.connId,
			binding: pairingBindingForSession(node)
		};
	}
	currentSessionForLease(lease) {
		const current = this.nodesById.get(lease.nodeId);
		return current === lease.session && current.connId === lease.connId && current.pairingIdentity === lease.binding.identity && current.pairingGeneration === lease.binding.generation && current.client.invalidated !== true ? current : void 0;
	}
	settlePairingLease(params) {
		const current = this.currentSessionForLease(params.lease);
		if (!current) return {
			status: "stale",
			presenceInvalidated: false
		};
		if (params.isCurrent) return {
			status: "current",
			session: current
		};
		return {
			status: "stale",
			presenceInvalidated: params.invalidateStale ? this.invalidateSessionForPairingChange(current) : false
		};
	}
	async resolvePairingLease(lease, options) {
		const resolveCurrentPairingState = this.options.resolveCurrentPairingState;
		if (!resolveCurrentPairingState) {
			const current = this.currentSessionForLease(lease);
			return current ? {
				status: "current",
				session: current
			} : {
				status: "stale",
				presenceInvalidated: false
			};
		}
		let currentPairingState;
		try {
			currentPairingState = await resolveCurrentPairingState(lease.nodeId);
		} catch {
			return { status: "unavailable" };
		}
		return this.settlePairingLease({
			lease,
			isCurrent: pairingStateMatchesBinding(lease.binding, currentPairingState),
			invalidateStale: options.invalidateStale
		});
	}
	normalizePluginToolDescriptors(params) {
		return normalizeNodePluginToolDescriptors({
			...params,
			enabled: this.options.nodePluginToolsEnabled,
			registeredDescriptors: createRegisteredNodePluginToolDescriptorMap(this.options.listRegisteredNodePluginToolCommands?.())
		});
	}
	replaceEffectiveNodePluginTools(node) {
		const normalized = this.normalizePluginToolDescriptors({
			nodeId: node.nodeId,
			tools: node.declaredNodePluginTools,
			allowedCommands: node.commands
		});
		node.nodePluginTools = normalized.map((entry) => entry.descriptor);
		replaceConnectedNodePluginTools({
			nodeId: node.nodeId,
			displayName: node.displayName,
			platform: node.platform,
			remoteIp: node.remoteIp,
			tools: normalized
		});
	}
	refreshNodePluginTools() {
		for (const node of this.nodesById.values()) this.replaceEffectiveNodePluginTools(node);
	}
	/** Register a websocket client as the current connection for its node id. */
	register(client, opts) {
		return this.registerSession(client, opts);
	}
	/** Register a node whose events are delivered by an HTTP polling transport. */
	registerTransport(client, opts, transport) {
		return this.registerSession(client, opts, transport);
	}
	registerSession(client, opts, transport) {
		if (!opts.pairingIdentity) throw new Error("node session registration requires pairing identity");
		const connect = client.connect;
		const nodeId = connect.device?.id ?? connect.client.id;
		const previousSession = this.nodesById.get(nodeId);
		const previousPairingGeneration = previousSession?.pairingGeneration;
		const caps = Array.isArray(connect.caps) ? connect.caps : [];
		const declaredCaps = Array.isArray(connect.declaredCaps) ? connect.declaredCaps ?? [] : caps;
		const commands = Array.isArray(connect.commands) ? connect.commands ?? [] : [];
		const declaredCommands = Array.isArray(connect.declaredCommands) ? connect.declaredCommands ?? [] : commands;
		const computerUse = connect.computerUse === void 0 ? void 0 : parseComputerUseCapabilityDescriptor(connect.computerUse);
		const sessionCapsCeiling = Array.isArray(connect.sessionCapsCeiling) ? connect.sessionCapsCeiling ?? [] : declaredCaps;
		const sessionCommandsCeiling = Array.isArray(connect.sessionCommandsCeiling) ? connect.sessionCommandsCeiling ?? [] : declaredCommands;
		const permissions = typeof connect.permissions === "object" ? connect.permissions ?? void 0 : void 0;
		const declaredPermissions = typeof connect.declaredPermissions === "object" ? connect.declaredPermissions ?? void 0 : permissions;
		const pathEnv = typeof connect.pathEnv === "string" ? connect.pathEnv : void 0;
		const workerRuns = connect.workerRuns ? structuredClone(connect.workerRuns) : void 0;
		const declaredNodePluginTools = [];
		const nodePluginTools = [];
		const nodeSkills = [];
		const session = {
			nodeId,
			connId: client.connId,
			pairingIdentity: opts.pairingIdentity,
			...opts.pairingGeneration ? { pairingGeneration: opts.pairingGeneration } : {},
			client,
			clientId: connect.client.id,
			clientMode: connect.client.mode,
			displayName: connect.client.displayName,
			platform: connect.client.platform,
			version: connect.client.version,
			coreVersion: connect.coreVersion,
			uiVersion: connect.uiVersion,
			deviceFamily: connect.client.deviceFamily,
			modelIdentifier: connect.client.modelIdentifier,
			remoteIp: opts.remoteIp,
			declaredCaps,
			sessionCapsCeiling,
			caps,
			declaredCommands,
			sessionCommandsCeiling,
			commands,
			...computerUse ? { computerUse } : {},
			...workerRuns ? { workerRuns } : {},
			declaredNodePluginTools,
			nodePluginTools,
			nodeSkills,
			declaredPermissions,
			permissions,
			pathEnv,
			connectedAtMs: Date.now()
		};
		const replacesPresence = previousSession?.lastActiveAtMs !== void 0;
		forgetNodeRunnerInventory(this, client.connId);
		this.nodesById.set(nodeId, session);
		this.nodesByConn.set(client.connId, nodeId);
		if (previousSession && previousSession.connId !== client.connId) this.unregister(previousSession.connId);
		if (previousPairingGeneration && session.pairingGeneration && previousPairingGeneration !== session.pairingGeneration) this.options.onPairingGenerationChanged?.({
			nodeId,
			previousPairingGeneration,
			nextPairingGeneration: session.pairingGeneration,
			preserveSessionState: false
		});
		if (transport) this.eventTransportsByConn.set(client.connId, transport);
		else this.eventTransportsByConn.delete(client.connId);
		replaceConnectedNodePluginTools({
			nodeId,
			displayName: session.displayName,
			platform: session.platform,
			remoteIp: session.remoteIp,
			tools: []
		});
		if (replacesPresence) this.publishActiveNodeContext();
		return session;
	}
	/** Unregister one connection and reject invokes tied to that connection. */
	unregister(connId) {
		const nodeId = this.nodesByConn.get(connId);
		if (!nodeId) return null;
		this.nodesByConn.delete(connId);
		this.eventTransportsByConn.delete(connId);
		forgetNodeRunnerInventory(this, connId);
		const unregistersCurrentNode = this.nodesById.get(nodeId)?.connId === connId;
		if (unregistersCurrentNode) {
			const hadPresence = this.nodesById.get(nodeId)?.lastActiveAtMs !== void 0;
			this.nodesById.delete(nodeId);
			removeConnectedNodePluginTools(nodeId);
			if (hadPresence) this.publishActiveNodeContext();
		}
		this.invokeStreams.handleDisconnect(connId);
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.connId === connId) this.authorizedSystemRunEvents.delete(key);
		return unregistersCurrentNode ? nodeId : null;
	}
	/** List connected node sessions. */
	listConnected() {
		return this.listConnectedSessions();
	}
	/** Filter connected sessions against an already-loaded pairing-state snapshot. */
	listConnectedForPairingStates(currentPairingStates) {
		return this.listConnectedSessions().filter((node) => {
			const current = currentPairingStates.get(node.nodeId);
			return pairingStateMatchesBinding(pairingBindingForSession(node), current);
		});
	}
	/** Reconcile connected sessions through the synchronous persistent-pairing owner. */
	listCurrentConnectedSync() {
		const isPairingStateCurrent = this.options.isPairingStateCurrent;
		if (!isPairingStateCurrent) return this.listConnected();
		const connected = [];
		let invalidatedPresence = false;
		for (const candidate of this.listConnectedSessions()) {
			const lease = this.capturePairingLease(candidate);
			let isCurrent;
			try {
				isCurrent = isPairingStateCurrent(candidate.nodeId, lease.binding);
			} catch {
				continue;
			}
			const resolution = this.settlePairingLease({
				lease,
				isCurrent,
				invalidateStale: true
			});
			if (resolution.status === "current") connected.push(resolution.session);
			else if (resolution.status === "stale") invalidatedPresence ||= resolution.presenceInvalidated;
		}
		if (invalidatedPresence) this.publishActiveNodeContext();
		return connected;
	}
	/** Resolve persistent pairing state before projecting connected sessions. */
	async listCurrentConnected() {
		const resolved = await Promise.all(this.listConnectedSessions().map((node) => this.resolvePairingLease(this.capturePairingLease(node), { invalidateStale: true })));
		const connected = [];
		let invalidatedPresence = false;
		for (const result of resolved) if (result.status === "current") connected.push(result.session);
		else if (result.status === "stale") invalidatedPresence ||= result.presenceInvalidated;
		if (invalidatedPresence) this.publishActiveNodeContext();
		return connected;
	}
	invalidateSessionForPairingChange(node, reason = "device-pairing-changed") {
		if (this.nodesById.get(node.nodeId) !== node || node.client.invalidated === true) return false;
		node.client.invalidated = true;
		node.client.invalidatedReason ??= reason;
		forgetNodeRunnerInventory(this, node.connId);
		removeConnectedNodePluginTools(node.nodeId);
		this.invokeStreams.handleDisconnect(node.connId);
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.connId === node.connId) this.authorizedSystemRunEvents.delete(key);
		this.options.onPairingInvalidated?.({
			nodeId: node.nodeId,
			connId: node.connId
		});
		return node.lastActiveAtMs !== void 0;
	}
	/** Immediately retires one exact transport after its persisted pairing authority changes. */
	invalidateConnectionForPairingChange(connId, reason = "device-pairing-changed") {
		const nodeId = this.nodesByConn.get(connId);
		const node = nodeId ? this.nodesById.get(nodeId) : void 0;
		if (!node || node.connId !== connId) return false;
		if (this.invalidateSessionForPairingChange(node, reason)) this.publishActiveNodeContext();
		return node.client.invalidated === true;
	}
	/** Return a connected node session by node id. */
	get(nodeId) {
		return this.getRegisteredSession(nodeId);
	}
	getRegisteredSession(nodeId) {
		const node = this.nodesById.get(nodeId);
		return node?.client.invalidated === true ? void 0 : node;
	}
	/** Return only the session authenticated for the requested persistent pairing generation. */
	getForPairingGeneration(nodeId, pairingGeneration) {
		return this.getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration);
	}
	getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration) {
		const node = this.getRegisteredSession(nodeId);
		return node?.pairingGeneration === pairingGeneration ? node : void 0;
	}
	/** Revalidates that one inbound node connection still owns its persisted pairing state. */
	async isConnectionCurrentPairingState(connId) {
		const nodeId = this.nodesByConn.get(connId);
		const initial = nodeId ? this.nodesById.get(nodeId) : void 0;
		if (!nodeId || !initial || initial.connId !== connId || initial.client.invalidated === true || !this.options.resolveCurrentPairingState) return false;
		const resolution = await this.resolvePairingLease(this.capturePairingLease(initial), { invalidateStale: true });
		if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
		return resolution.status === "current";
	}
	/** Updates recent input activity for the exact authenticated node connection. */
	updatePresenceActivity(params) {
		const node = this.nodesById.get(params.nodeId);
		if (!node || !params.connId || node.connId !== params.connId || node.permissions?.accessibility !== true) return null;
		const observedAtMs = params.observedAtMs ?? Date.now();
		const lastActiveAtMs = Math.max(0, observedAtMs - params.idleSeconds * 1e3);
		if (params.saturated !== true || node.lastActiveAtMs === void 0) node.lastActiveAtMs = Math.max(node.lastActiveAtMs ?? 0, lastActiveAtMs);
		node.presenceUpdatedAtMs = observedAtMs;
		this.publishActiveNodeContext();
		return node;
	}
	/** Clears recent input activity for the exact authenticated node connection. */
	clearPresenceActivity(params) {
		const node = this.nodesById.get(params.nodeId);
		if (!node || !params.connId || node.connId !== params.connId) return null;
		if (node.lastActiveAtMs === void 0 && node.presenceUpdatedAtMs === void 0) return false;
		node.lastActiveAtMs = void 0;
		node.presenceUpdatedAtMs = void 0;
		this.publishActiveNodeContext();
		return true;
	}
	/** Returns the connected node with the freshest reported local input. */
	getActiveNode(connectedNodes = this.listConnected()) {
		let active;
		for (const node of connectedNodes) {
			if (node.lastActiveAtMs === void 0) continue;
			if (!active || node.lastActiveAtMs > (active.lastActiveAtMs ?? 0) || node.lastActiveAtMs === active.lastActiveAtMs && (node.presenceUpdatedAtMs ?? 0) > (active.presenceUpdatedAtMs ?? 0)) active = node;
		}
		return active;
	}
	publishActiveNodeContext() {
		const active = this.getActiveNode(this.listConnectedSessions());
		const lease = active ? this.capturePairingLease(active) : void 0;
		setActiveNodeContext(active ? {
			nodeId: active.nodeId,
			...active.pairingGeneration ? { pairingGeneration: active.pairingGeneration } : {}
		} : null, lease ? { isCurrent: () => {
			if (!this.currentSessionForLease(lease)) return false;
			return this.options.isPairingStateCurrent ? this.options.isPairingStateCurrent(lease.nodeId, lease.binding) : true;
		} } : void 0);
	}
	/** Probe websocket liveness with ping/pong when the socket supports it. */
	async checkConnectivity(nodeId, timeoutMs = 2e3) {
		const node = this.getRegisteredSession(nodeId);
		if (!node) return {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node not connected"
			}
		};
		const currentConnectionResult = (result) => this.nodesById.get(nodeId) === node && node.client.invalidated !== true ? result : {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node connection changed during connectivity probe"
			}
		};
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return currentConnectionResult(eventTransport.checkConnectivity ? await eventTransport.checkConnectivity(timeoutMs) : { ok: true });
		const socket = node.client.socket;
		if (!this.isNodeWebSocketOpen(node)) return {
			ok: false,
			error: {
				code: "NOT_CONNECTED",
				message: "node socket not open"
			}
		};
		if (typeof socket.ping !== "function" || typeof socket.once !== "function") return { ok: true };
		const timeout = Math.max(1, Math.trunc(timeoutMs));
		return await new Promise((resolve) => {
			let settled = false;
			const cleanup = () => {
				socket.off?.("pong", onPong);
				socket.off?.("close", onClose);
				socket.off?.("error", onError);
				socket.removeListener?.("pong", onPong);
				socket.removeListener?.("close", onClose);
				socket.removeListener?.("error", onError);
			};
			const finish = (result) => {
				if (settled) return;
				settled = true;
				clearTimeout(timer);
				cleanup();
				resolve(currentConnectionResult(result));
			};
			const onPong = () => finish({ ok: true });
			const onClose = () => finish({
				ok: false,
				error: {
					code: "NOT_CONNECTED",
					message: "node socket closed during connectivity probe"
				}
			});
			const onError = (err) => finish({
				ok: false,
				error: {
					code: "UNAVAILABLE",
					message: err instanceof Error ? err.message : "node socket error during connectivity probe"
				}
			});
			const timer = setTimeout(() => finish({
				ok: false,
				error: {
					code: "TIMEOUT",
					message: "node connectivity probe timed out"
				}
			}), timeout);
			socket.once?.("pong", onPong);
			socket.once?.("close", onClose);
			socket.once?.("error", onError);
			try {
				socket.ping?.(void 0, false, (err) => {
					if (err) finish({
						ok: false,
						error: {
							code: "UNAVAILABLE",
							message: err.message
						}
					});
				});
			} catch (err) {
				finish({
					ok: false,
					error: {
						code: "UNAVAILABLE",
						message: err instanceof Error ? err.message : "node ping failed"
					}
				});
			}
		});
	}
	updateNodePluginTools(nodeId, connId, tools) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.connId !== connId) return null;
		node.declaredNodePluginTools = this.options.nodePluginToolsEnabled === false ? [] : [...tools];
		this.replaceEffectiveNodePluginTools(node);
		return node;
	}
	updateNodeSkills(nodeId, connId, skills) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.connId !== connId) return null;
		node.nodeSkills = normalizeNodeSkillDescriptors({
			nodeId,
			skills,
			enabled: this.options.nodeSkillsEnabled
		});
		return node;
	}
	updateSurface(nodeId, surface, generationTransition) {
		const node = this.nodesById.get(nodeId);
		if (!node || node.client.invalidated === true || generationTransition !== void 0 && (node.connId !== generationTransition.expectedConnId || node.pairingIdentity !== generationTransition.expectedPairingIdentity || node.pairingGeneration !== generationTransition.expectedPairingGeneration)) return null;
		const sessionCommandsCeiling = new Set(node.sessionCommandsCeiling ?? node.declaredCommands);
		const nextCommands = surface.commands.filter((command) => sessionCommandsCeiling.has(command));
		node.commands = nextCommands;
		node.client.connect.commands = nextCommands;
		this.replaceEffectiveNodePluginTools(node);
		if ("caps" in surface) {
			const sessionCapsCeiling = new Set(node.sessionCapsCeiling ?? node.declaredCaps);
			const nextCaps = (surface.caps ?? []).filter((capability) => sessionCapsCeiling.has(capability));
			node.caps = nextCaps;
			node.client.connect.caps = nextCaps;
		}
		if ("permissions" in surface) if (surface.permissions === void 0) {
			node.permissions = void 0;
			node.client.connect.permissions = void 0;
			this.clearPresenceIfAccessibilityUnavailable(node);
		} else {
			const declared = node.declaredPermissions ?? {};
			const nextEntries = [];
			for (const [key, declaredValue] of Object.entries(declared)) {
				if (!declaredValue) {
					nextEntries.push([key, false]);
					continue;
				}
				const approvedValue = surface.permissions?.[key];
				if (approvedValue) {
					nextEntries.push([key, true]);
					continue;
				}
				if (approvedValue !== void 0) nextEntries.push([key, false]);
			}
			const nextPermissions = nextEntries.length > 0 ? Object.fromEntries(nextEntries) : void 0;
			node.permissions = nextPermissions;
			node.client.connect.permissions = nextPermissions;
			this.clearPresenceIfAccessibilityUnavailable(node);
		}
		if (generationTransition) {
			const previousPairingGeneration = node.pairingGeneration;
			node.pairingGeneration = generationTransition.nextPairingGeneration;
			settleNodeRegistryPairingGenerationChange({
				registry: this,
				nodeId,
				connId: node.connId,
				nextPairingGeneration: generationTransition.nextPairingGeneration
			});
			if (previousPairingGeneration) this.options.onPairingGenerationChanged?.({
				nodeId,
				previousPairingGeneration,
				nextPairingGeneration: generationTransition.nextPairingGeneration,
				preserveSessionState: true
			});
			this.publishActiveNodeContext();
		}
		return node;
	}
	clearPresenceIfAccessibilityUnavailable(node) {
		if (node.permissions?.accessibility === true || node.lastActiveAtMs === void 0) return;
		node.lastActiveAtMs = void 0;
		node.presenceUpdatedAtMs = void 0;
		this.publishActiveNodeContext();
	}
	async invoke(params) {
		return await invokePublicNodeRegistry(this, params);
	}
	/** Send one ordered input frame to a pending streaming invoke. */
	sendInvokeInput(invokeId, payload) {
		this.invokeStreams.sendInput(invokeId, payload);
	}
	handleInvokeProgress(params) {
		return this.invokeStreams.handleProgress(params);
	}
	/** Authorize an inbound system.run event against a recently issued node invoke. */
	authorizeSystemRunEvent(params) {
		if (!params.connId || !params.sessionKey) return false;
		const connId = params.connId;
		this.pruneAuthorizedSystemRunEvents();
		let match;
		if (params.runId) {
			match = this.matchAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				runId: params.runId,
				sessionKey: params.sessionKey
			});
			if (!match && this.allowsLegacyMacRunIdFallback({
				nodeId: params.nodeId,
				connId
			})) match = this.matchSingleAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				sessionKey: params.sessionKey
			});
		} else {
			if (!this.allowsLegacyMacRunIdFallback({
				nodeId: params.nodeId,
				connId
			})) return false;
			match = this.matchSingleAuthorizedSystemRunEvent({
				nodeId: params.nodeId,
				connId,
				sessionKey: params.sessionKey
			});
		}
		if (!match) return false;
		if (params.terminal) this.authorizedSystemRunEvents.delete(match.key);
		return true;
	}
	rememberAuthorizedSystemRunEvent(event) {
		this.pruneAuthorizedSystemRunEvents();
		const authorized = {
			...event,
			expiresAtMs: this.authorizedSystemRunEventExpiresAt(event.timeoutMs)
		};
		this.authorizedSystemRunEvents.set(this.authorizedSystemRunEventKey(authorized), authorized);
	}
	forgetAuthorizedSystemRunEvent(event) {
		this.authorizedSystemRunEvents.delete(this.authorizedSystemRunEventKey(event));
	}
	authorizedSystemRunEventExpiresAt(timeoutMs) {
		if (typeof timeoutMs !== "number") return null;
		return resolveExpiresAtMsFromDurationMs(addTimerTimeoutGraceMs(timeoutMs, AUTHORIZED_SYSTEM_RUN_EVENT_GRACE_MS)) ?? 0;
	}
	matchAuthorizedSystemRunEvent(params) {
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.nodeId === params.nodeId && event.connId === params.connId && event.runId === params.runId && this.authorizedSystemRunSessionMatches(event, params.sessionKey)) return {
			key,
			event
		};
		return null;
	}
	matchSingleAuthorizedSystemRunEvent(params) {
		let match = null;
		for (const [key, event] of this.authorizedSystemRunEvents) {
			if (event.nodeId !== params.nodeId || event.connId !== params.connId || !this.authorizedSystemRunSessionMatches(event, params.sessionKey)) continue;
			if (match) return null;
			match = {
				key,
				event
			};
		}
		return match;
	}
	authorizedSystemRunSessionMatches(event, sessionKey) {
		return !event.sessionKey || event.sessionKey === sessionKey;
	}
	allowsLegacyMacRunIdFallback(params) {
		const node = this.nodesById.get(params.nodeId);
		return node?.connId === params.connId && node.clientId === "openclaw-macos" && node.platform === "darwin";
	}
	pruneAuthorizedSystemRunEvents(now = Date.now()) {
		for (const [key, event] of this.authorizedSystemRunEvents) if (event.expiresAtMs !== null && !isFutureDateTimestampMs(event.expiresAtMs, { nowMs: now })) this.authorizedSystemRunEvents.delete(key);
	}
	authorizedSystemRunEventKey(params) {
		return `${params.nodeId}\0${params.connId}\0${params.sessionKey ?? ""}\0${params.runId}`;
	}
	handleInvokeResult(params) {
		return this.invokeStreams.handleResult(params);
	}
	sendEvent(nodeId, event, payload) {
		const node = this.nodesById.get(nodeId);
		if (!node) return false;
		return this.sendEventToSession(node, event, payload);
	}
	sendEventRaw(nodeId, event, payloadJSON) {
		const node = this.nodesById.get(nodeId);
		if (!node) return false;
		return this.sendEventRawInternal(node, event, payloadJSON);
	}
	/** Sends command-free events only to the exact authenticated pairing connection. */
	async sendEventForPairingIdentity(params) {
		const initial = this.nodesById.get(params.nodeId);
		if (!initial || initial.connId !== params.connId || initial.pairingIdentity !== params.pairingIdentity || initial.client.invalidated === true || !this.options.resolveCurrentPairingState) return false;
		const resolution = await this.resolvePairingLease(this.capturePairingLease(initial), { invalidateStale: true });
		if (resolution.status !== "current") {
			if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
			return false;
		}
		return this.sendEventToSession(resolution.session, params.event, params.payload);
	}
	/** Sends only to a session that still owns the requested persistent pairing generation. */
	async sendEventRawForPairingGeneration(nodeId, pairingGeneration, event, payloadJSON) {
		const send = (this.pairingGenerationEventChains.get(nodeId) ?? Promise.resolve()).then(() => this.sendEventRawForPairingGenerationNow(nodeId, pairingGeneration, event, payloadJSON));
		const tail = send.then(() => void 0, () => void 0);
		this.pairingGenerationEventChains.set(nodeId, tail);
		try {
			return await send;
		} finally {
			if (this.pairingGenerationEventChains.get(nodeId) === tail) this.pairingGenerationEventChains.delete(nodeId);
		}
	}
	async sendEventRawForPairingGenerationNow(nodeId, pairingGeneration, event, payloadJSON) {
		let node = this.getRegisteredSessionForPairingGeneration(nodeId, pairingGeneration);
		if (!node) return false;
		if (this.options.resolveCurrentPairingState) {
			const resolution = await this.resolvePairingLease(this.capturePairingLease(node), { invalidateStale: true });
			if (resolution.status !== "current") {
				if (resolution.status === "stale" && resolution.presenceInvalidated) this.publishActiveNodeContext();
				return false;
			}
			node = resolution.session;
		}
		return this.sendEventRawInternal(node, event, payloadJSON);
	}
	sendEventInternal(node, event, payload) {
		if (node.client.invalidated === true) return false;
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return eventTransport.send(event, payload);
		if (!this.isNodeWebSocketOpen(node)) return false;
		if (this.rejectSlowNodeSocket(node)) return false;
		try {
			node.client.socket.send(JSON.stringify({
				type: "event",
				event,
				payload
			}));
			return true;
		} catch {
			return false;
		}
	}
	sendEventRawInternal(node, event, payloadJSON) {
		if (node.client.invalidated === true) return false;
		if (payloadJSON !== null && payloadJSON !== void 0 && !isSerializedEventPayload(payloadJSON)) return false;
		const eventTransport = this.eventTransportsByConn.get(node.connId);
		if (eventTransport) return eventTransport.sendRaw(event, payloadJSON);
		if (!this.isNodeWebSocketOpen(node)) return false;
		if (this.rejectSlowNodeSocket(node)) return false;
		try {
			const payloadFragment = payloadJSON ? `,"payload":${payloadJSON.json}` : "";
			node.client.socket.send(`{"type":"event","event":${JSON.stringify(event)}${payloadFragment}}`);
			return true;
		} catch {
			return false;
		}
	}
	sendEventToSession(node, event, payload) {
		return this.sendEventInternal(node, event, payload);
	}
	isNodeWebSocketOpen(node) {
		return node.client.socket.readyState === WEBSOCKET_OPEN_READY_STATE;
	}
	rejectSlowNodeSocket(node) {
		if (!(node.client.socket.bufferedAmount > 52428800)) return false;
		logRejectedLargePayload({
			surface: "gateway.ws.outbound_buffer",
			bytes: node.client.socket.bufferedAmount,
			limitBytes: MAX_BUFFERED_BYTES,
			reason: "ws_send_buffer_close"
		});
		try {
			node.client.socket.close(SLOW_CONSUMER_CLOSE_CODE, "slow consumer");
		} catch {}
		return true;
	}
};
//#endregion
export { serializeEventPayload as n, NodeRegistry as t };
