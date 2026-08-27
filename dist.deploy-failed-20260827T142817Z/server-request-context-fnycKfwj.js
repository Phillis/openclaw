import { a as hasGatewayClientCap, n as GATEWAY_CLIENT_IDS, t as GATEWAY_CLIENT_CAPS } from "./client-info-yubNQC1L.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { p as resolveUserProfileId } from "./user-profiles-eJiEIUE1.js";
import { i as upsertPresence } from "./system-presence-5NV70380.js";
import { c as getPendingDevicePairing, s as getPairedDevice } from "./device-pairing-CFVs8foo.js";
import { r as disconnectAllSharedGatewayAuthClients } from "./server-shared-auth-generation-BKVola-Y.js";
import { t as NODE_DESKTOP_SERVICE_CONTEXT } from "./node-source-context-Csxf7qYw.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-DJLMOloJ.js";
import { t as buildAuthenticatedPresenceUser } from "./authenticated-presence-user-D0vJF2AD.js";
//#region src/gateway/device-scope-upgrade.ts
const TERMINAL_GRACE_MS = 15e3;
const DURABLE_RECONCILE_INTERVAL_MS = 250;
function createUpgradeWake() {
	let resolve;
	return {
		promise: new Promise((resolvePromise) => {
			resolve = resolvePromise;
		}),
		resolve
	};
}
function sameOwner(left, right) {
	return left.deviceId === right.deviceId && left.publicKey === right.publicKey;
}
function scheduleUnref(callback, delayMs) {
	const timer = setTimeout(callback, delayMs);
	timer.unref?.();
	return timer;
}
/** Coordinates live device scope-upgrade waiters with the durable pairing store. */
var ScopeUpgradeCoordinator = class {
	constructor() {
		this.entries = /* @__PURE__ */ new Map();
	}
	register(params) {
		const existing = this.entries.get(params.requestId);
		if (existing && !sameOwner(existing.owner, params.owner)) return false;
		const entry = existing ?? {
			requestId: params.requestId,
			owner: params.owner,
			requestedScopes: [...params.requestedScopes],
			initialToken: params.initialToken,
			initialApprovedAtMs: params.initialApprovedAtMs,
			expiresAtMs: 0,
			wake: createUpgradeWake()
		};
		entry.requestedScopes = [...params.requestedScopes];
		entry.expiresAtMs = params.expiresAtMs;
		if (entry.cleanupTimer) clearTimeout(entry.cleanupTimer);
		entry.cleanupTimer = scheduleUnref(() => this.entries.delete(entry.requestId), Math.max(0, entry.expiresAtMs + TERMINAL_GRACE_MS - Date.now()));
		this.entries.set(entry.requestId, entry);
		return true;
	}
	notify(requestId, resolution) {
		const entry = this.entries.get(requestId);
		if (!entry) return;
		entry.resolutionHint = resolution;
		const wake = entry.wake;
		entry.wake = createUpgradeWake();
		wake.resolve();
	}
	async wait(requestId, owner) {
		const entry = this.entries.get(requestId);
		if (!entry || !sameOwner(entry.owner, owner)) return null;
		if (!entry.resultPromise) {
			const pending = this.waitForResult(entry);
			entry.resultPromise = pending;
			pending.catch(() => {
				if (entry.resultPromise === pending) entry.resultPromise = void 0;
			});
		}
		return await entry.resultPromise;
	}
	async waitForResult(entry) {
		while (true) {
			const now = Date.now();
			if (now >= entry.expiresAtMs) {
				this.retainTerminal(entry);
				return {
					status: "expired",
					requestId: entry.requestId
				};
			}
			const wake = entry.wake.promise;
			const result = await this.readDurableResult(entry);
			if (result) {
				this.retainTerminal(entry);
				return result;
			}
			await Promise.race([wake, new Promise((resolve) => {
				scheduleUnref(resolve, Math.min(DURABLE_RECONCILE_INTERVAL_MS, entry.expiresAtMs - now));
			})]);
		}
	}
	async readDurableResult(entry) {
		if (await getPendingDevicePairing(entry.requestId)) return null;
		if (entry.resolutionHint === "rejected") return {
			status: "rejected",
			requestId: entry.requestId
		};
		const paired = await getPairedDevice(entry.owner.deviceId);
		const token = paired?.tokens?.operator;
		const approvedEvidence = entry.resolutionHint === "approved" || token?.token !== entry.initialToken && paired?.approvedAtMs !== entry.initialApprovedAtMs;
		return paired?.publicKey === entry.owner.publicKey && token !== void 0 && token.revokedAtMs === void 0 && approvedEvidence && roleScopesAllow({
			role: "operator",
			requestedScopes: entry.requestedScopes,
			allowedScopes: token.scopes
		}) ? {
			status: "approved",
			requestId: entry.requestId,
			deviceToken: token.token,
			scopes: token.scopes
		} : {
			status: "rejected",
			requestId: entry.requestId
		};
	}
	retainTerminal(entry) {
		if (entry.cleanupTimer) clearTimeout(entry.cleanupTimer);
		entry.cleanupTimer = scheduleUnref(() => this.entries.delete(entry.requestId), TERMINAL_GRACE_MS);
	}
};
//#endregion
//#region src/gateway/server-request-context.ts
const ALL_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([GATEWAY_CLIENT_IDS.CONTROL_UI]);
const EXEC_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([
	GATEWAY_CLIENT_IDS.MACOS_APP,
	GATEWAY_CLIENT_IDS.IOS_APP,
	GATEWAY_CLIENT_IDS.ANDROID_APP
]);
const PLUGIN_APPROVAL_CLIENT_IDS = /* @__PURE__ */ new Set([GATEWAY_CLIENT_IDS.TUI]);
function canDeliverApprovals(gatewayClient, approvalKind) {
	if (gatewayClient.invalidated) return false;
	const scopes = Array.isArray(gatewayClient.connect.scopes) ? gatewayClient.connect.scopes : [];
	if (!(scopes.includes("operator.admin") || scopes.includes("operator.approvals"))) return false;
	return gatewayClient.internal?.approvalRuntime === true || ALL_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.APPROVALS) || approvalKind === "exec" && (EXEC_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.EXEC_APPROVALS)) || approvalKind === "plugin" && (PLUGIN_APPROVAL_CLIENT_IDS.has(gatewayClient.connect.client.id) || hasGatewayClientCap(gatewayClient.connect.caps, GATEWAY_CLIENT_CAPS.PLUGIN_APPROVALS));
}
function createGatewayRequestContext(params) {
	const scopeUpgradeCoordinator = new ScopeUpgradeCoordinator();
	const context = {
		deps: params.deps,
		get cron() {
			return params.runtimeState.cronState.cron;
		},
		get cronStorePath() {
			return params.runtimeState.cronState.storePath;
		},
		getRuntimeConfig: params.getRuntimeConfig,
		gatewayTlsFingerprint: params.gatewayTlsFingerprint,
		controlUiSessionPullRequests: params.runtimeState.controlUiSessionPullRequests,
		sessionViewerPresence: params.runtimeState.sessionViewerPresence,
		sessionCompanion: params.sessionCompanion,
		sessionObserver: params.sessionObserver,
		notifyPluginMetadataChanged: params.notifyPluginMetadataChanged,
		getMcpAppSandboxPort: params.getMcpAppSandboxPort,
		ensureSandboxHostPort: params.ensureSandboxHostPort,
		get portalService() {
			return params.getPortalService?.();
		},
		resolveTerminalLaunchPolicy: params.resolveTerminalLaunchPolicy,
		isTerminalEnabled: params.isTerminalEnabled,
		execApprovalManager: params.execApprovalManager,
		scopeUpgradeCoordinator,
		cancelRunBoundApprovals: params.cancelRunBoundApprovals ? (runId) => params.cancelRunBoundApprovals(runId, context) : void 0,
		forwardPluginApprovalRequest: params.forwardPluginApprovalRequest,
		pluginApprovalIosPushDelivery: params.pluginApprovalIosPushDelivery,
		pluginApprovalManager: params.pluginApprovalManager,
		systemAgentApprovalManager: params.systemAgentApprovalManager,
		listSessionPendingApprovals: params.listSessionPendingApprovals,
		loadGatewayModelCatalog: params.loadGatewayModelCatalog,
		loadGatewayModelCatalogSnapshot: params.loadGatewayModelCatalogSnapshot,
		...params.readPreparedGatewayModelCatalog ? { readPreparedGatewayModelCatalog: params.readPreparedGatewayModelCatalog } : {},
		readChatMetadata: params.readChatMetadata,
		...params.readChatStartupProjection ? { readChatStartupProjection: params.readChatStartupProjection } : {},
		getHealthCache: params.getHealthCache,
		refreshHealthSnapshot: params.refreshHealthSnapshot,
		logHealth: params.logHealth,
		logGateway: params.logGateway,
		incrementPresenceVersion: params.incrementPresenceVersion,
		getHealthVersion: params.getHealthVersion,
		broadcast: params.broadcast,
		broadcastToConnIds: params.broadcastToConnIds,
		nodeSendToSession: params.nodeSendToSession,
		nodeSendToAllSubscribed: params.nodeSendToAllSubscribed,
		nodeSubscribe: params.nodeSubscribe,
		nodeUnsubscribe: params.nodeUnsubscribe,
		nodeUnsubscribeAll: params.nodeUnsubscribeAll,
		hasConnectedTalkNode: params.hasConnectedTalkNode,
		isConnectionActive: (connId) => [...params.clients].some((client) => client.connId === connId && !client.invalidated),
		hasExecApprovalClients: (excludeConnId) => {
			for (const gatewayClient of params.clients) {
				if (excludeConnId && gatewayClient.connId === excludeConnId) continue;
				if (canDeliverApprovals(gatewayClient, "exec")) return true;
			}
			return false;
		},
		getApprovalClientConnIds: (opts = {}) => {
			const connIds = /* @__PURE__ */ new Set();
			for (const gatewayClient of params.clients) {
				if (!gatewayClient.connId) continue;
				if (opts.excludeConnId && gatewayClient.connId === opts.excludeConnId) continue;
				if (!canDeliverApprovals(gatewayClient, opts.approvalKind ?? "exec")) continue;
				if (opts.filter && !opts.filter(gatewayClient, opts.record)) continue;
				connIds.add(gatewayClient.connId);
			}
			return connIds;
		},
		getClientConnIds: (filter) => {
			const connIds = /* @__PURE__ */ new Set();
			for (const gatewayClient of params.clients) {
				if (!gatewayClient.connId || gatewayClient.invalidated) continue;
				if (filter && !filter(gatewayClient)) continue;
				connIds.add(gatewayClient.connId);
			}
			return connIds;
		},
		hasConnectedClientsForDevice: (deviceId) => {
			for (const gatewayClient of params.clients) if (gatewayClient.connect.device?.id === deviceId && !gatewayClient.invalidated) return true;
			return false;
		},
		refreshConnectedUserProfile: (profile) => {
			let presenceChanged = false;
			for (const gatewayClient of params.clients) {
				const authenticatedUserProfile = gatewayClient.authenticatedUserProfile;
				if (!authenticatedUserProfile) continue;
				const canonicalProfileId = authenticatedUserProfile.profileId === profile.id ? profile.id : resolveUserProfileId(authenticatedUserProfile.profileId);
				if (canonicalProfileId !== profile.id) continue;
				Object.assign(authenticatedUserProfile, {
					profileId: canonicalProfileId,
					displayName: profile.displayName,
					avatarRevision: profile.avatarRevision,
					hasAvatar: profile.hasAvatar,
					updatedAt: profile.updatedAt
				});
				if (!gatewayClient.presenceKey || !gatewayClient.authenticatedUserId) continue;
				upsertPresence(gatewayClient.presenceKey, { user: buildAuthenticatedPresenceUser({
					authenticatedUserId: gatewayClient.authenticatedUserId,
					authenticatedUserIsTailscaleProvider: gatewayClient.authenticatedUserIsTailscaleProvider,
					authenticatedUserProfile: {
						profileId: profile.id,
						displayName: profile.displayName,
						avatarRevision: profile.avatarRevision
					}
				}) });
				presenceChanged = true;
			}
			if (presenceChanged) broadcastPresenceSnapshot({
				broadcast: params.broadcast,
				incrementPresenceVersion: params.incrementPresenceVersion,
				getHealthVersion: params.getHealthVersion
			});
		},
		invalidateClientsForDevice: (deviceId, opts) => {
			const reason = opts?.reason ?? "device-invalidated";
			for (const gatewayClient of params.clients) {
				if (gatewayClient.connect.device?.id !== deviceId) continue;
				if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
				if (gatewayClient.connId) params.nodeRegistry.invalidateConnectionForPairingChange(gatewayClient.connId, reason);
				gatewayClient.invalidated = true;
				gatewayClient.invalidatedReason = reason;
			}
			params.invalidateDeviceTransports?.(deviceId, opts);
		},
		disconnectClientsForDevice: (deviceId, opts) => {
			for (const gatewayClient of params.clients) {
				if (gatewayClient.connect.device?.id !== deviceId) continue;
				if (opts?.role && gatewayClient.connect.role !== opts.role) continue;
				gatewayClient.invalidated = true;
				gatewayClient.invalidatedReason ??= "device-removed";
				try {
					gatewayClient.socket.close(4001, "device removed");
				} catch {}
			}
			params.disconnectDeviceTransports?.(deviceId, opts);
		},
		disconnectClientsUsingSharedGatewayAuth: () => {
			disconnectAllSharedGatewayAuthClients(params.clients);
		},
		enforceSharedGatewayAuthGenerationForConfigWrite: params.enforceSharedGatewayAuthGenerationForConfigWrite,
		claimControlUiDeviceAuthMigration: params.claimControlUiDeviceAuthMigration,
		releaseControlUiDeviceAuthMigrationClaim: params.releaseControlUiDeviceAuthMigrationClaim,
		completeControlUiDeviceAuthMigration: params.completeControlUiDeviceAuthMigration,
		nodeRegistry: params.nodeRegistry,
		...params.nodeDesktopService ? { [NODE_DESKTOP_SERVICE_CONTEXT]: params.nodeDesktopService } : {},
		...params.workerEnvironmentService ? { workerEnvironmentService: params.workerEnvironmentService } : {},
		...params.hostDesktopService ? { hostDesktopService: params.hostDesktopService } : {},
		...params.workerSessionPlacementService ? { workerSessionPlacementService: params.workerSessionPlacementService } : {},
		...params.workerPlacementDiskSpaceReader ? { workerPlacementDiskSpaceReader: params.workerPlacementDiskSpaceReader } : {},
		validateAgentRuntimeApprovalAuthority: params.validateAgentRuntimeApprovalAuthority,
		...params.workerPlacementDispatchService ? { workerPlacementDispatchService: params.workerPlacementDispatchService } : {},
		terminalSessions: params.terminalSessions,
		agentRunSeq: params.agentRunSeq,
		chatAbortControllers: params.chatAbortControllers,
		chatQueuedTurns: params.chatQueuedTurns,
		chatRunState: params.chatRunState,
		addChatRun: params.addChatRun,
		removeChatRun: params.removeChatRun,
		subscribeSessionEvents: params.subscribeSessionEvents,
		unsubscribeSessionEvents: params.unsubscribeSessionEvents,
		subscribeSessionMessageEvents: params.subscribeSessionMessageEvents,
		unsubscribeSessionMessageEvents: params.unsubscribeSessionMessageEvents,
		unsubscribeAllSessionEvents: (connId) => {
			params.unsubscribeAllSessionEvents(connId);
			params.runtimeState.controlUiSessionPullRequests?.unsubscribe(connId);
			params.runtimeState.sessionViewerPresence?.unsubscribe(connId);
		},
		getSessionEventSubscriberConnIds: params.getSessionEventSubscriberConnIds,
		registerToolEventRecipient: params.registerToolEventRecipient,
		dedupe: params.dedupe,
		wizardSessions: params.wizardSessions,
		systemAgentSessions: params.systemAgentSessions,
		findRunningWizard: params.findRunningWizard,
		purgeWizardSession: params.purgeWizardSession,
		getRuntimeSnapshot: params.getRuntimeSnapshot,
		getEventLoopHealth: params.getEventLoopHealth,
		getConfigReloaderHotReloadStatus: params.getConfigReloaderHotReloadStatus,
		startChannel: params.startChannel,
		stopChannel: params.stopChannel,
		markChannelLoggedOut: params.markChannelLoggedOut,
		wizardRunner: params.wizardRunner,
		channelWizardRunner: params.channelWizardRunner,
		broadcastVoiceWakeChanged: params.broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged: params.broadcastVoiceWakeRoutingChanged,
		unavailableGatewayMethods: params.unavailableGatewayMethods
	};
	return context;
}
//#endregion
export { createGatewayRequestContext };
