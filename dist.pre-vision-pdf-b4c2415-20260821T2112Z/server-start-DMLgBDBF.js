import { n as createLazyPromise, r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { n as isVitestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import { n as isTruthyEnvValue, r as logAcceptedEnvOption } from "./env-y-_yRnBE.js";
import { j as resolveIntegerOption, w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./utils-DEqefz4f.js";
import { t as sleep } from "./sleep-Bd74jGcV.js";
import { c as isNixMode, l as normalizeStateDirEnv } from "./paths-CqeDjSA4.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { B as captureConfigOverrideApplier, l as readConfigFileSnapshot, o as promoteConfigSnapshotToLastKnownGood, r as getRuntimeConfig, u as readConfigFileSnapshotForRuntimeTransaction, v as registerConfigWriteListener } from "./io-CeQckj5v.js";
import { N as runWithDiagnosticTraceContext, f as isDiagnosticsEnabled, w as createDiagnosticTraceContext, y as setDiagnosticsEnabledForProcess } from "./diagnostic-events-Djn4AVRp.js";
import { r as runtimeForLogger, t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { d as isSecretRef } from "./types.secrets-BrIfhxSG.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { l as resolveRuntimeServiceVersion } from "./version-o4XN9fka.js";
import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { x as assertOpenClawStateWriteAllowedAtPath } from "./openclaw-state-db-DlCMR4eQ.js";
import { r as setCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-DwABKB-T.js";
import { n as ensureControlUiAllowedOriginsForNonLoopbackBind } from "./gateway-control-ui-origins-DqufLoUx.js";
import { t as completePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BV6-k_Y4.js";
import { g as createPluginGatewayMethodDescriptors, h as createGatewayMethodRegistry, m as createGatewayMethodDescriptorsFromHandlers } from "./loader-B4G6K_LK.js";
import { i as listLoadedChannelPlugins, n as getLoadedChannelPluginEntryById } from "./registry-loaded-BwPPBT4p.js";
import { d as prepareConfigRuntimeEnv, l as initializePublishedConfigRuntimeEnv, r as collectConfigRuntimeEnvOwnership } from "./config-env-vars-BITg3hPR.js";
import { n as assertGatewayConfigEnvSelectionUnchanged } from "./gateway-env-selection-CRtCNGiW.js";
import { C as setAppliedRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Dp7mvsA3.js";
import { a as READ_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as TALK_SCOPE, r as PAIRING_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { u as resolveCronJobsStorePathFromConfig } from "./store-wIlCggOZ.js";
import { t as GatewayLockError } from "./gateway-lock-EiOnxvh_.js";
import { t as isContainerEnvironment } from "./container-environment-CNsJSTpY.js";
import { b as resolveRequestClientIp, g as resolveGatewayListenHosts, o as isLoopbackHost, r as isLocalDirectRequest } from "./net-BRYQcUG8.js";
import { f as buildRateLimitIdentityKey, p as createAuthRateLimiter, s as AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL, u as AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION } from "./auth-rate-limit-Bw_B6Pm2.js";
import { n as resolveGatewayAuth } from "./auth-resolve-U982W6CT.js";
import { n as authorizeHttpGatewayConnect } from "./auth-CCT61CRz.js";
import { n as isRestartEnabled } from "./commands.flags-CZN5Wwe1.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-yubNQC1L.js";
import { a as normalizeDevicePublicKeyBase64Url } from "./device-identity-D1g4SzdB.js";
import { t as loadGatewayTlsRuntime } from "./gateway-BGXKG1MZ.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { c as listCoreGatewayMethodNames, n as createCoreGatewayMethodDescriptors, r as isCoreGatewayMethodClassified, t as STARTUP_UNAVAILABLE_GATEWAY_METHODS } from "./core-descriptors-x7tVv8yG.js";
import "./method-scopes-DRTuNy7j.js";
import { a as getGatewaySuspendAdmissionPhase, c as isGatewayWorkAdmissionClosed, i as getActiveGatewayRootWorkCount, o as isGatewayRestartDraining } from "./gateway-work-admission-QDz202p9.js";
import { f as setGatewaySigusr1RestartPolicy, p as setPreRestartDeferralCheck } from "./restart-DMO9lEo3.js";
import { r as readGatewayRestartHandoffSync } from "./restart-handoff-9lx7m4gY.js";
import { c as resolveSystemMainSessionTarget } from "./main-session-er-Gn_t_.js";
import { t as isBrowserCopilotClient } from "./message-channel-T4W5YOto.js";
import { i as tryLoadActivatedBundledPluginPublicSurfaceModule } from "./facade-runtime-CUuLg79-.js";
import { o as withSystemEventOwner } from "./system-event-ownership-BACexIXt.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { t as createDeferredCore } from "./deferred-D0La5CRk.js";
import { m as stopDiagnosticHeartbeat, p as startDiagnosticHeartbeat } from "./diagnostic-CV4vi0UN.js";
import { d as getActiveEmbeddedRunCount, m as resolveActiveEmbeddedRunSessionId } from "./run-state-BxqT1sw2.js";
import "./sessions-D-jhKYGW.js";
import { t as canonicalizeUserProfileAvatarPath } from "./user-profiles-http-path-BFesDPdu.js";
import { c as getActiveBackgroundExecSessionCount } from "./bash-process-registry-rM437CTr.js";
import { t as getTotalPendingReplies } from "./dispatcher-registry-B2AzyUtN.js";
import { r as getActiveCronJobCount } from "./active-jobs-D5QwO55Q.js";
import { c as getTotalQueueSize, d as isGatewayDraining } from "./command-queue-CqN2qr5o.js";
import { t as createAgentRuntimeApprovalAuthorityValidator } from "./agent-runtime-identity-token-DH59bpPs.js";
import { a as decodeSandboxHostCsp, i as buildSandboxHostProxyHtml, n as buildSandboxHostContentSecurityPolicy, s as resolveSandboxHostPort } from "./sandbox-host-B8_dlG6f.js";
import "./server-plugins-COsnjcH5.js";
import { i as setFallbackGatewayContextResolver } from "./server-plugin-fallback-context-CA_ZMhwm.js";
import "./node-desktop-stream-B3QCoQfh.js";
import { i as withCoreCanvasNodeCapability, n as isCanvasDocumentHttpPath, r as resolveCanvasNodeCapability } from "./constants-Cm4bJJ1Q.js";
import { r as prepareGatewayAgentCliShim, t as clearGatewayAgentCliShim } from "./openclaw-cli-shim-Bxxlmk9C.js";
import { t as isCoreCanvasHostEnabled } from "./config-CiLYPNJ4.js";
import { a as getActiveSecretsRuntimeConfigSnapshot, r as clearSecretsRuntimeSnapshotState } from "./runtime-state-BVazrsUD.js";
import { n as fenceSessionSuspensionWritesForGatewayShutdown } from "./session-suspension-BtiFbEPP.js";
import { t as isTerminalConfigEnabled } from "./enabled-BSjeiWpO.js";
import { a as createSessionEventSubscriberRegistry, i as createChatRunState, o as createSessionMessageSubscriberRegistry } from "./server-chat-state-DD3o03aT.js";
import { d as resumeGatewayRestartTraceFromHandoff, i as finishGatewayRestartTrace, n as collectGatewayProcessMemoryUsageMb, u as resumeGatewayRestartTraceFromEnv } from "./restart-trace-DHrQ5Qk2.js";
import { i as upsertPresence } from "./system-presence-5NV70380.js";
import { n as logRejectedLargePayload } from "./diagnostic-payload-BRcHXXpb.js";
import { i as MAX_BUFFERED_BYTES, o as MAX_PREAUTH_PAYLOAD_BYTES } from "./server-constants-DKuFNbQH.js";
import { r as registerGatewayModelCatalogPrivateAccess } from "./server-model-catalog-auth-DCNJBYb7.js";
import { t as ensureOpenClawCliOnPath } from "./path-env-L5fXdI0M.js";
import { c as resolveControlUiRootSync, i as isPackageProvenControlUiRootSync, n as ensureControlUiAssetsBuilt, r as isControlUiStartupAssetsReady, s as resolveControlUiRootOverrideSync } from "./control-ui-assets-5CrbKapG.js";
import { d as listDevicePairing, p as onEffectiveOperatorDevicePaired, y as resolveEffectiveOperatorDeviceIdentity } from "./device-pairing-CkbDK__R.js";
import { f as requestNodePairing, p as reusePendingNodePairingForReconnect, r as finalizeNodePairingCleanupClaim } from "./device-pairing-node-koBZUtkr.js";
import { c as removeRemoteNodeInfoForConnection, i as recordRemoteNodeInfo, s as removeRemoteNodeInfo } from "./remote-RL6whgVY.js";
import { c as normalizePluginNodeCapabilityScopedUrl } from "./plugin-node-capability-SDRFZFm7.js";
import { i as summarizeAgentEventForWsLog, n as logWs, r as shouldLogWs } from "./ws-log-DAJ6wT2O.js";
import { n as mergeGatewayAuthConfig, r as mergeGatewayTailscaleConfig } from "./startup-auth-C9s8wZrr.js";
import { t as createDefaultDeps } from "./deps-DbFiGwEJ.js";
import { u as revokeAttachGrantsForSession } from "./mcp-grant-store-Bu9z2SVy.js";
import "./control-ui-contract-eurzifU_.js";
import { a as resolvePluginRoutePathContext, i as isProtectedPluginRoutePathFromContext, t as findMatchingPluginHttpRoutes } from "./route-match-Vz3WZJuX.js";
import { a as sendGatewayAuthFailure, f as setDefaultSecurityHeaders, r as finishFailedGatewayHttpResponse } from "./http-common-BIedCt0N.js";
import { t as resolveSharedGatewaySessionGeneration } from "./ws-shared-generation-BWx0sDdz.js";
import { n as queuePluginSessionsChanged } from "./gateway-events-BmHN8GQT.js";
import { c as canReceiveSessionEvent } from "./session-sharing-DOLHhSnW.js";
import { i as respondPlainText, r as respondNotFound } from "./control-ui-http-utils-Bg-q1q5E.js";
import { n as resolveAssistantIdentity } from "./assistant-identity-CRph4W92.js";
import { a as classifyNodeWorkspaceTransferPath, i as classifyMcpAppStandalonePath, o as classifyWorkerGatewayPath, r as classifyGatewayProbePath } from "./gateway-http-route-contracts-Gi3L8lxE.js";
import { n as parseDevicePairingJoinRequestPath } from "./join-code-B_OfdZ-j.js";
import { n as DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS, r as evaluateChannelHealth, t as DEFAULT_CHANNEL_CONNECT_GRACE_MS } from "./channel-health-policy-gOWYUpIm.js";
import { n as isControlUiApprovalDocumentPath, r as isControlUiPluginManagerRequest } from "./control-ui-routing-p8rCHdZ_.js";
import { n as resolveGatewayReloadPluginActivationCandidate, r as resolveGatewayStartupPluginActivationConfig, t as mergeActivationSectionsIntoRuntimeConfig } from "./plugin-activation-runtime-config-CiFJvQoH.js";
import { a as enforceSharedGatewaySessionGenerationForConfigWrite, s as getRequiredSharedGatewaySessionGeneration } from "./server-shared-auth-generation-BKVola-Y.js";
import { r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-dOPPbnLL.js";
import { t as GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED } from "./events-TB-ePJT1.js";
import { a as incrementPresenceVersion, i as getPresenceVersion, n as getHealthCache, o as refreshGatewayHealthSnapshot, r as getHealthVersion } from "./health-state-Bkwq9Fq3.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-CjkrzfO_.js";
import { t as createControlUiSessionPullRequestSubscriptions } from "./control-ui-session-pr-subscriptions-VuVjnWSy.js";
import { i as clearNodeWakeState } from "./node-wake-state-CLsta4Jn.js";
import { t as broadcastPresenceSnapshot } from "./presence-events-DJLMOloJ.js";
import { n as applyGatewayLaneConcurrency, r as resolveGatewayLaneConcurrency, t as resolveHookClientIpConfig } from "./hook-client-ip-config-DwZwIsL5.js";
import { t as disposeNodeConnectionNotifications } from "./node-connection-notifications-D1x1ASrH.js";
import { r as createDesktopSessionRegistry } from "./session-registry-CXjtG6_S.js";
import { t as createGatewayStartupTrace } from "./server-startup-trace-DA1KytiF.js";
import { a as writeGatewayUpgradeServiceUnavailable, n as shouldEnforceGatewayAuthForPluginPath, r as runWithGatewayHttpWorkAdmission } from "./route-auth-BUckYQ3G.js";
import { n as handleNodeWorkspaceTransferHttpRequest } from "./node-workspace-transfer-http-Cgh9LYDF.js";
import { a as markPublicWorkerIngress, n as GATEWAY_WS_PREAUTH_BUDGET_PROPERTY, r as GATEWAY_WS_WORKER_INGRESS_PROPERTY, t as GATEWAY_WS_CONNECTION_KIND_PROPERTY } from "./ws-types-DrkOhGsT.js";
import { t as findMatchingPluginNodeCapabilityRoute } from "./route-capability-CFFRlizr.js";
import { t as GATEWAY_EVENTS } from "./server-methods-list-BTR8XDib.js";
import { randomBytes, timingSafeEqual } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import net from "node:net";
import { monitorEventLoopDelay, performance } from "node:perf_hooks";
import { WebSocketServer } from "ws";
import { createServer as createServer$1, request } from "node:http";
import { createServer as createServer$2 } from "node:https";
//#region src/gateway/channel-thaw-restart.ts
/**
* Restarts every running, non-manually-stopped channel account after a host
* thaw. Dead sockets from a freeze otherwise wait for the slow health sweep.
*/
async function restartRunningChannelAccounts(manager, opts) {
	const snapshot = manager.getRuntimeSnapshot();
	for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) for (const [accountId, status] of Object.entries(accounts ?? {})) {
		const channel = channelId;
		if (status?.running !== true || manager.isManuallyStopped(channel, accountId)) continue;
		if (!opts.shouldContinue()) return;
		try {
			await manager.stopChannel(channel, accountId, { manual: false });
			if (!opts.shouldContinue()) return;
			await manager.startChannel(channel, accountId, { preserveManualStop: true });
			if ((manager.getRuntimeSnapshot().channelAccounts[channel]?.[accountId])?.restartPending === true) await manager.startChannel(channel, accountId, { preserveManualStop: true });
		} catch (error) {
			opts.onError(`[${channel}:${accountId}] host-thaw restart failed: ${String(error)}`);
		}
	}
}
//#endregion
//#region src/gateway/server-core-runtime.ts
function listGatewayStartupChannelPlugins$1() {
	return listLoadedChannelPlugins();
}
const MAX_MEDIA_TTL_HOURS = 168;
function resolveMediaCleanupTtlMs(ttlHoursRaw) {
	const ttlMs = Math.min(Math.max(ttlHoursRaw, 1), MAX_MEDIA_TTL_HOURS) * 60 * 6e4;
	if (!Number.isFinite(ttlMs) || !Number.isSafeInteger(ttlMs)) throw new Error(`Invalid media.ttlHours: ${String(ttlHoursRaw)}`);
	return ttlMs;
}
function approvalRequestTargetsSession(request, sessionKeys, sessionId) {
	if (typeof request !== "object" || request === null) return false;
	const record = request;
	return typeof record.sessionId === "string" && record.sessionId === sessionId || typeof record.sessionKey === "string" && sessionKeys.has(record.sessionKey);
}
async function startGatewayCoreRuntime(input) {
	const { lifecycleRuntime: runtime, port, log, logDiscovery, logHealth, logChannels, loadGatewayStartupEarlyModule, loadGatewayPluginBootstrapModule, loadGatewayModelCatalog, loadGatewayModelCatalogSnapshot, readPreparedGatewayModelCatalog } = input;
	const { minimalTestGateway, cfgAtStart, gatewayTls, bindHost, tailscaleMode, nodeRegistry, pluginRuntime, broadcast, nodeSendToAllSubscribed, refreshGatewayHealthSnapshotWithRuntime, dedupe, chatAbortControllers, chatQueuedTurns, restartRecoveryCandidates, chatRunState, removeChatRun, agentRunSeq, nodeSendToSession, runtimeState, kernel, startupTrace, channelManager, readinessEventLoopHealth, workerDispatchAuthority, clients, startChannel, stopChannel, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForConfig, sessionMessageSubscribers, sessionEventSubscribers, toolEventRecipients, broadcastToConnIds, terminalSessions, controlUiBasePath, workerEnvironmentService, workerPlacementDispatchAvailable, workerPlacementControlAvailable, workerDesktopObserveAvailable, desktopObserveAvailable, desktopSessionRegistry, listStartupChannelGatewayMethods, coreGatewayMethodNames, pluginHostServices, baseMethods, pluginWorkspaceDir, ambientEnvTriggers, workerEnvironmentStartup, broadcastPluginEvent, activateRuntimeSecrets, residentRegistry } = runtime;
	if (desktopSessionRegistry) kernel.addGatewayLifetimeSidecar({ stop: () => desktopSessionRegistry.stopAll() });
	const secretEgressProxy = cfgAtStart.secrets?.egressProxy?.enabled === true ? await import("./runtime-BisJmIXJ.js").then((egressRuntime) => egressRuntime.startGatewaySecretEgressProxy(cfgAtStart.secrets?.egressProxy?.bypassHosts ? { bypassHosts: cfgAtStart.secrets.egressProxy.bypassHosts } : {})) : void 0;
	if (secretEgressProxy) kernel.addGatewayLifetimeSidecar(secretEgressProxy);
	let earlyRuntimePromise = null;
	const startEarlyRuntime = () => {
		earlyRuntimePromise ??= loadGatewayStartupEarlyModule().then(({ startGatewayEarlyRuntime }) => startGatewayEarlyRuntime({
			minimalTestGateway,
			cfgAtStart,
			port,
			gatewayTls,
			gatewayDirectReachable: !isLoopbackHost(bindHost),
			tailscaleMode,
			log,
			logDiscovery,
			nodeRegistry,
			pluginRegistry: pluginRuntime.registry,
			broadcast,
			nodeSendToAllSubscribed,
			getPresenceVersion,
			getHealthVersion,
			refreshGatewayHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
			restartRunningChannels: async () => await restartRunningChannelAccounts(channelManager, {
				shouldContinue: () => !isGatewayWorkAdmissionClosed(),
				onError: (message) => logHealth.error(message)
			}),
			refreshPresence: () => broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			}),
			resetEventLoopHealth: readinessEventLoopHealth.reset,
			logHealth,
			dedupe,
			chatAbortControllers,
			chatQueuedTurns,
			restartRecoveryCandidates,
			chatRunState,
			removeChatRun,
			agentRunSeq,
			nodeSendToSession,
			...typeof cfgAtStart.attachments?.ttlHours === "number" ? { mediaCleanupTtlMs: resolveMediaCleanupTtlMs(cfgAtStart.attachments.ttlHours) } : {},
			skillsRefreshDelayMs: runtimeState.skillsRefreshDelayMs,
			getSkillsRefreshTimer: () => runtimeState.skillsRefreshTimer,
			setSkillsRefreshTimer: (timer) => {
				runtimeState.skillsRefreshTimer = timer;
			},
			getRuntimeConfig,
			startupTrace
		}));
		return earlyRuntimePromise;
	};
	const discoveryResident = residentRegistry.register({
		name: "bonjour-discovery",
		start: startEarlyRuntime,
		stop: async () => {
			await (await startEarlyRuntime()).bonjourStop?.();
		}
	});
	const taskAndSkillsResident = residentRegistry.register({
		name: "task-and-skills-runtime",
		start: async () => await discoveryResident.start(),
		stop: async () => {
			(await startEarlyRuntime()).skillsChangeUnsub();
			const { stopTaskRegistryMaintenance } = await import("./task-registry.maintenance-By5SrIHx.js");
			stopTaskRegistryMaintenance();
		}
	});
	const earlyRuntime = await startupTrace.measure("runtime.early", () => taskAndSkillsResident.start());
	kernel.setEarlyRuntimeHandles(earlyRuntime);
	const [{ startGatewayEventSubscriptions }, { startGatewayRuntimeServices }] = await startupTrace.measure("runtime.post-early-imports", () => Promise.all([import("./server-runtime-subscriptions-rVCR_1yd.js"), import("./server-runtime-startup-services-C7rNX3Su.js")]));
	const eventSubscriptionsResident = residentRegistry.register({
		name: "event-subscriptions",
		start: () => startGatewayEventSubscriptions({
			log,
			broadcast,
			broadcastToConnIds,
			nodeSendToSession,
			agentRunSeq,
			chatRunState,
			toolEventRecipients,
			sessionEventSubscribers,
			sessionMessageSubscribers,
			chatAbortControllers,
			restartRecoveryCandidates,
			terminalSessions
		}),
		stop: async () => {
			await runtimeState.agentUnsub?.();
			runtimeState.heartbeatUnsub?.();
			runtimeState.transcriptUnsub?.();
			runtimeState.lifecycleUnsub?.();
			runtimeState.taskUnsub?.();
		}
	});
	const { sessionCompanion, sessionObserver, ...runtimeSubscriptionUnsubs } = await startupTrace.measure("runtime.subscriptions", () => eventSubscriptionsResident.start());
	Object.assign(runtimeState, runtimeSubscriptionUnsubs);
	const runtimeServices = await startupTrace.measure("runtime.services", () => startGatewayRuntimeServices({
		minimalTestGateway,
		cfgAtStart,
		channelManager,
		log
	}));
	Object.assign(runtimeState, runtimeServices);
	const { createOperatorApprovalSessionEventRuntime } = await import("./operator-approval-session-events-Bz2iwSzQ.js");
	const approvalManagersForReplay = /* @__PURE__ */ new Map();
	const approvalSessionEvents = createOperatorApprovalSessionEventRuntime({
		clients,
		sessionMessageSubscribers,
		broadcastToConnIds,
		controlUiBasePath,
		reconcileTerminal: (record) => {
			return approvalManagersForReplay.get(record.kind)?.reconcileDurableTerminal(record) ?? false;
		}
	});
	const validateAgentRuntimeApprovalAuthority = createAgentRuntimeApprovalAuthorityValidator(workerEnvironmentStartup?.placementStore);
	const { execApprovalManager, cancelRunBoundApprovals, forwardPluginApprovalRequest, pluginApprovalIosPushDelivery, pluginApprovalManager, systemAgentApprovalManager, bindApprovalPublicationContext, unregisterApprovalAuthorityObserver, extraHandlers, coreGatewayHandlers } = await startupTrace.measure("gateway.handlers", async () => {
		const [{ createGatewayAuxHandlers }, { coreGatewayHandlers: coreGatewayHandlersLocal }] = await Promise.all([import("./server-aux-handlers-Di8eKRV0.js"), import("./server-methods-MQrjXgVF.js")]);
		return {
			...createGatewayAuxHandlers({
				log,
				chatAbortControllers,
				activateRuntimeSecrets,
				sharedGatewaySessionGenerationState,
				resolveSharedGatewaySessionGenerationForConfig,
				clients,
				startChannel,
				stopChannel,
				getChannelAutostartSuppression: channelManager.getAutostartSuppression,
				logChannels,
				registerWorkerTurnClaimClosedHandler: workerEnvironmentStartup?.placementStore ? (handler) => workerEnvironmentStartup.placementStore.registerTurnClaimClosedHandler(handler) : void 0,
				validateAgentRuntimeDelegatedAuthority: (authority) => validateAgentRuntimeApprovalAuthority({
					kind: "agentRuntime",
					agentId: "approval-manager",
					sessionKey: "approval-manager",
					operationalRunInstance: authority.operationalRunInstance,
					delegatedAuthority: authority
				}),
				onApprovalLifecycle: approvalSessionEvents.publish,
				onAgentRunAuthorityClosed: (authority) => {
					secretEgressProxy?.revokeRun(authority.operationalRunInstance);
				}
			}),
			coreGatewayHandlers: coreGatewayHandlersLocal
		};
	});
	kernel.addGatewayLifetimeSidecar({ stop: async () => {
		unregisterApprovalAuthorityObserver();
	} });
	approvalManagersForReplay.set("exec", execApprovalManager);
	approvalManagersForReplay.set("plugin", pluginApprovalManager);
	approvalManagersForReplay.set("system-agent", systemAgentApprovalManager);
	workerDispatchAuthority.revoke = ({ sessionId, sessionKeys }) => {
		const keys = new Set(sessionKeys);
		for (const sessionKey of keys) revokeAttachGrantsForSession(sessionKey);
		for (const record of execApprovalManager.listPendingRecords()) if (approvalRequestTargetsSession(record.request, keys, sessionId)) execApprovalManager.expire(record.id, "worker-dispatch");
		for (const record of pluginApprovalManager.listPendingRecords()) if (approvalRequestTargetsSession(record.request, keys, sessionId)) pluginApprovalManager.expire(record.id, "worker-dispatch");
	};
	const attachedGatewayExtraHandlers = {
		...pluginRuntime.registry.gatewayHandlers,
		...extraHandlers
	};
	let attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRuntime.registry.gatewayHandlers));
	const buildAttachedGatewayMethodRegistry = (nextPluginRegistry) => {
		const coreDescriptorHandlers = { ...coreGatewayHandlers };
		const auxHandlers = {};
		for (const [method, handler] of Object.entries(extraHandlers)) if (isCoreGatewayMethodClassified(method)) coreDescriptorHandlers[method] = handler;
		else auxHandlers[method] = handler;
		return createGatewayMethodRegistry([
			...createCoreGatewayMethodDescriptors(coreDescriptorHandlers).filter((descriptor) => (workerEnvironmentService || descriptor.name !== "environments.create" && descriptor.name !== "environments.destroy") && (workerPlacementDispatchAvailable || descriptor.name !== "sessions.dispatch") && (workerPlacementControlAvailable || descriptor.name !== "sessions.reclaim") && (desktopObserveAvailable || descriptor.name !== "desktop.observe") && (workerDesktopObserveAvailable || descriptor.name !== "desktop.launch" && descriptor.name !== "worker.desktop.observe" && descriptor.name !== "worker.desktop.launch")),
			...createPluginGatewayMethodDescriptors(nextPluginRegistry),
			...createGatewayMethodDescriptorsFromHandlers({
				handlers: auxHandlers,
				owner: {
					kind: "aux",
					area: "gateway-extra"
				},
				defaultScope: ADMIN_SCOPE
			})
		], nextPluginRegistry);
	};
	let attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRuntime.registry);
	const listAttachedGatewayMethods = () => {
		const methods = attachedGatewayMethodRegistry.listAdvertisedMethods();
		methods.push(...listStartupChannelGatewayMethods());
		return uniqueStrings(methods);
	};
	kernel.publishMethodSurface(listAttachedGatewayMethods());
	const replaceAttachedPluginRuntime = (loaded) => {
		pluginRuntime.registry = loaded.pluginRegistry;
		pluginRuntime.baseGatewayMethods = loaded.gatewayMethods;
		for (const key of attachedPluginGatewayHandlerKeys) delete attachedGatewayExtraHandlers[key];
		Object.assign(attachedGatewayExtraHandlers, pluginRuntime.registry.gatewayHandlers);
		attachedPluginGatewayHandlerKeys = new Set(Object.keys(pluginRuntime.registry.gatewayHandlers));
		attachedGatewayMethodRegistry = buildAttachedGatewayMethodRegistry(pluginRuntime.registry);
		kernel.publishMethodSurface(listAttachedGatewayMethods());
		nodeRegistry.refreshNodePluginTools();
	};
	const refreshAttachedGatewayDiscovery = async (nextPluginRegistry) => {
		if (minimalTestGateway) return;
		try {
			const stopPreviousDiscovery = kernel.swapBonjourStop(null);
			if (stopPreviousDiscovery) try {
				await stopPreviousDiscovery();
			} catch (err) {
				logDiscovery.warn(`gateway discovery stop failed before plugin refresh: ${String(err)}`);
			}
			const { startGatewayPluginDiscovery } = await loadGatewayStartupEarlyModule();
			kernel.swapBonjourStop(await startGatewayPluginDiscovery({
				minimalTestGateway,
				cfgAtStart,
				port,
				gatewayTls,
				gatewayDirectReachable: !isLoopbackHost(bindHost),
				tailscaleMode,
				logDiscovery,
				pluginRegistry: nextPluginRegistry
			}));
		} catch (err) {
			logDiscovery.warn(`gateway discovery refresh failed after plugin load: ${String(err)}`);
		}
	};
	const reloadAttachedGatewayPlugins = async (params) => {
		const [{ loadPluginLookUpTable }, { listAmbientOnlyConfiguredChannelIds }, { prepareGatewayPluginLoad }, { startPluginServices }, { listChannelPluginConfigTargetIds, pluginConfigTargetsChanged }] = await Promise.all([
			import("./plugin-lookup-table-Ditvud2p.js"),
			import("./channel-presence-policy-C5Lm9hxq.js"),
			loadGatewayPluginBootstrapModule(),
			import("./services-ELgLocJn.js"),
			import("./gateway/plugin-channel-reload-targets.js")
		]);
		const listAttachedChannelConfigTargets = () => new Map(listGatewayStartupChannelPlugins$1().map((plugin) => [plugin.id, listChannelPluginConfigTargetIds({
			channelId: plugin.id,
			pluginId: getLoadedChannelPluginEntryById(plugin.id)?.pluginId,
			aliases: plugin.meta.aliases
		})]));
		const beforeChannelTargets = listAttachedChannelConfigTargets();
		const beforeChannelIds = new Set(beforeChannelTargets.keys());
		const nextPluginLookUpTable = loadPluginLookUpTable({
			config: resolveGatewayStartupPluginActivationConfig({
				runtimeConfig: params.nextConfig,
				activationSourceConfig: params.nextConfig,
				env: params.env,
				ambientEnvTriggers
			}),
			workspaceDir: pluginWorkspaceDir,
			env: params.env,
			activationSourceConfig: params.nextConfig,
			workerProviderIds: workerEnvironmentStartup?.listDurableProviderIds() ?? [],
			ambientEnvTriggers
		});
		const nextAmbientAutostartSuppressedChannelIds = ambientEnvTriggers === "suppress" ? new Set(listAmbientOnlyConfiguredChannelIds({
			config: params.nextConfig,
			activationSourceConfig: params.nextConfig,
			env: params.env,
			includePersistedAuthState: false,
			manifestRecords: nextPluginLookUpTable.manifestRegistry.plugins
		})) : /* @__PURE__ */ new Set();
		const nextStartupPluginIds = new Set(nextPluginLookUpTable.startup.pluginIds);
		const nextStartupChannelIds = /* @__PURE__ */ new Set();
		for (const plugin of nextPluginLookUpTable.manifestRegistry.plugins) {
			if (!nextStartupPluginIds.has(plugin.id)) continue;
			if (plugin.channels.length === 0) {
				nextStartupChannelIds.add(plugin.id);
				continue;
			}
			for (const channelId of plugin.channels) nextStartupChannelIds.add(channelId);
		}
		const channelsToStopBeforeReplace = /* @__PURE__ */ new Set();
		for (const channelId of beforeChannelIds) {
			const targetIds = beforeChannelTargets.get(channelId) ?? /* @__PURE__ */ new Set([channelId]);
			if (!nextStartupChannelIds.has(channelId) || pluginConfigTargetsChanged(targetIds, params.changedPaths)) channelsToStopBeforeReplace.add(channelId);
		}
		await params.beforeReplace(channelsToStopBeforeReplace, channelManager.getPluginCommandCatalogAccounts());
		if (params.isAborted?.()) return {
			restartChannels: /* @__PURE__ */ new Set(),
			activeChannels: new Set(beforeChannelIds),
			cancelled: true
		};
		const previousPluginServices = runtimeState.pluginServices;
		await params.commitRuntime();
		channelManager.setAmbientAutostartSuppressedChannelIds(nextAmbientAutostartSuppressedChannelIds);
		const loaded = prepareGatewayPluginLoad({
			cfg: params.nextConfig,
			workspaceDir: pluginWorkspaceDir,
			log,
			coreGatewayMethodNames,
			hostServices: pluginHostServices,
			baseMethods,
			pluginLookUpTable: nextPluginLookUpTable,
			ambientEnvTriggers
		});
		setCurrentPluginMetadataSnapshot(completePluginMetadataSnapshot({
			snapshot: nextPluginLookUpTable,
			config: params.nextConfig,
			env: params.env,
			workspaceDir: pluginWorkspaceDir
		}), {
			config: params.nextConfig,
			env: params.env,
			workspaceDir: pluginWorkspaceDir
		});
		replaceAttachedPluginRuntime(loaded);
		kernel.setPluginServices(null);
		if (previousPluginServices) await previousPluginServices.stop();
		await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
		kernel.setPluginServices(await startPluginServices({
			registry: loaded.pluginRegistry,
			config: params.nextConfig,
			workspaceDir: pluginWorkspaceDir,
			broadcastPluginEvent
		}));
		const afterChannelTargets = listAttachedChannelConfigTargets();
		const afterChannelIds = new Set(afterChannelTargets.keys());
		const restartChannels = /* @__PURE__ */ new Set();
		for (const channelId of /* @__PURE__ */ new Set([...beforeChannelIds, ...afterChannelIds])) {
			const targetIds = afterChannelTargets.get(channelId) ?? beforeChannelTargets.get(channelId) ?? /* @__PURE__ */ new Set([channelId]);
			if (afterChannelIds.has(channelId) && (beforeChannelIds.has(channelId) !== afterChannelIds.has(channelId) || pluginConfigTargetsChanged(targetIds, params.changedPaths))) restartChannels.add(channelId);
		}
		return {
			restartChannels,
			activeChannels: afterChannelIds
		};
	};
	return {
		...runtime,
		kernel: {
			...kernel,
			reloadPlugins: reloadAttachedGatewayPlugins
		},
		earlyRuntime,
		sessionCompanion,
		sessionObserver,
		approvalSessionEvents,
		execApprovalManager,
		cancelRunBoundApprovals,
		forwardPluginApprovalRequest,
		pluginApprovalIosPushDelivery,
		pluginApprovalManager,
		systemAgentApprovalManager,
		bindApprovalPublicationContext,
		validateAgentRuntimeApprovalAuthority,
		attachedGatewayExtraHandlers,
		getAttachedGatewayMethodRegistry: () => attachedGatewayMethodRegistry,
		replaceAttachedPluginRuntime,
		refreshAttachedGatewayDiscovery,
		loadGatewayModelCatalog,
		loadGatewayModelCatalogSnapshot,
		readPreparedGatewayModelCatalog
	};
}
//#endregion
//#region src/gateway/server-chat-metadata-lifecycle.ts
async function createGatewayChatMetadataLifecycle(params) {
	let context;
	let preparedModelRuntimeAvailable = false;
	let preparedModelRuntimeEventVersion = 0;
	const { ChatMetadataSnapshotUnavailableError, createGatewayChatMetadataRuntime } = await import("./chat-metadata-runtime-BfTLTxjy.js");
	const runtime = createGatewayChatMetadataRuntime({
		getConfig: params.getConfig,
		getContext: () => {
			if (!context) throw new Error("gateway request context is unavailable during chat metadata preparation");
			return context;
		},
		...params.minimalTestGateway ? {
			beforeRefresh: async () => {
				const { refreshPreparedModelRuntimeSnapshots } = await import("./prepared-model-runtime-BmAY52y7.js");
				await refreshPreparedModelRuntimeSnapshots(params.getConfig(), {
					gatewayLifecycle: true,
					catalogMode: "static",
					allowGatewaySubagentBinding: true
				});
			},
			refreshOnRead: true
		} : {},
		log: params.log
	});
	const refreshLogged = () => {
		runtime.refresh().catch((error) => {
			params.log.warn(`chat metadata refresh failed: ${String(error)}`);
		});
	};
	const invalidateForSubordinateChange = () => {
		runtime.invalidate();
		if (preparedModelRuntimeAvailable) refreshLogged();
	};
	const registerRefreshListeners = async () => {
		if (params.minimalTestGateway) return;
		const [{ registerRuntimeAuthProfileStoreMutationListener }, { registerPreparedModelRuntimePublicationListener }, { registerSkillsChangeListener }] = await Promise.all([
			import("./runtime-snapshots-BAj8w3c6.js"),
			import("./prepared-model-runtime-BmAY52y7.js"),
			import("./refresh-o2q_UoSK.js")
		]);
		const unregisterPreparedModelRuntimePublication = registerPreparedModelRuntimePublicationListener((event) => {
			preparedModelRuntimeEventVersion += 1;
			if (event.phase === "invalidated") {
				preparedModelRuntimeAvailable = false;
				runtime.invalidate();
				return;
			}
			if (event.phase === "failed") {
				preparedModelRuntimeAvailable = false;
				runtime.fail(event.error);
				return;
			}
			preparedModelRuntimeAvailable = true;
			refreshLogged();
		});
		const unregisterSkillsChange = registerSkillsChangeListener(() => {
			invalidateForSubordinateChange();
		});
		const unregisterRuntimeAuthProfileStoreMutation = registerRuntimeAuthProfileStoreMutationListener(() => {
			invalidateForSubordinateChange();
		});
		return { stop: async () => {
			unregisterRuntimeAuthProfileStoreMutation();
			unregisterPreparedModelRuntimePublication();
			unregisterSkillsChange();
		} };
	};
	return {
		attachContext: async (next, sidecars) => {
			context = next;
			const sidecar = await registerRefreshListeners();
			if (sidecar) {
				sidecars.push(sidecar);
				const eventVersion = preparedModelRuntimeEventVersion;
				await runtime.refresh().then(() => {
					if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeAvailable = true;
				}, (error) => {
					if (!(error instanceof ChatMetadataSnapshotUnavailableError)) {
						if (preparedModelRuntimeEventVersion === eventVersion) preparedModelRuntimeAvailable = true;
						params.log.warn(`chat metadata catch-up refresh failed: ${String(error)}`);
					}
				});
			}
		},
		read: runtime.read,
		readStartup: runtime.readStartup,
		refresh: runtime.refresh
	};
}
//#endregion
//#region src/gateway/server-lifetime-sidecars.ts
async function attachInitialGatewayLifetimeSidecars(params) {
	await params.chatMetadataLifecycle.attachContext(params.gatewayRequestContext, params.sidecars);
	params.sidecars.push({ stop: async () => {
		const { flushPendingSessionsChangedEvents } = await import("./session-change-event-CfAsEi6K.js");
		flushPendingSessionsChangedEvents(params.gatewayRequestContext);
	} });
}
function publishGatewayLifetimeSidecars(params) {
	const sidecars = [.../* @__PURE__ */ new Set([...params.registered, ...params.published])];
	params.stopAfterCloseStarted({
		postReadySidecars: sidecars,
		closeStarted: params.closeStarted
	});
	return params.closeStarted ? [] : sidecars;
}
//#endregion
//#region src/gateway/server-kernel-request-runtime.ts
/** Completes the socket-free request and internal-dispatch half of Gateway startup. */
async function prepareGatewayKernelRequestRuntime(params) {
	const { coreRuntime: runtime, log, logHealth } = params;
	const { minimalTestGateway, deps, runtimeState, unavailableGatewayMethods, sessionCompanion, sessionObserver, getMcpAppSandboxPort, ensureSandboxHostPort, getPortalService, terminalLaunchPolicy, execApprovalManager, cancelRunBoundApprovals, forwardPluginApprovalRequest, pluginApprovalIosPushDelivery, pluginApprovalManager, systemAgentApprovalManager, bindApprovalPublicationContext, validateAgentRuntimeApprovalAuthority, approvalSessionEvents, startupTrace, loadGatewayModelCatalog, loadGatewayModelCatalogSnapshot, readPreparedGatewayModelCatalog, refreshGatewayHealthSnapshotWithRuntime, getRuntimeSnapshot, broadcast, broadcastToConnIds, nodeSendToSession, nodeSendToAllSubscribed, nodeSubscribe, nodeUnsubscribe, nodeUnsubscribeAll, hasTalkNodeConnected, clients, watchNodeHttpRuntime, sharedGatewaySessionGenerationState, resolveSharedGatewaySessionGenerationForRuntimeSnapshot, completeControlUiDeviceAuthMigrationForEffectiveOperator, claimControlUiDeviceAuthMigration, releaseControlUiDeviceAuthMigrationClaim, nodeRegistry, nodeDesktopService, workerEnvironmentService, hostDesktopService, workerEnvironmentStartup, workerPlacementRuntime, workerPlacementControlAvailable, terminalSessions, agentRunSeq, chatAbortControllers, chatQueuedTurns, chatRunState, addChatRun, removeChatRun, subscribeSessionMessageEvents, unsubscribeSessionMessageEvents, sessionEventSubscribers, sessionMessageSubscribers, toolEventRecipients, dedupe, wizardSessions, systemAgentSessions, findRunningWizard, purgeWizardSession, readinessEventLoopHealth, startChannel, stopChannel, markChannelLoggedOut, wizardRunner, channelWizardRunner, broadcastVoiceWakeChanged, broadcastVoiceWakeRoutingChanged, pluginGatewayContext, getAttachedGatewayMethodRegistry, gatewayInstanceRuntimeRef, gatewayTls, lifecycle, startupState, clearFallbackGatewayContextForServer, kernel } = runtime;
	const chatMetadataLifecycle = await createGatewayChatMetadataLifecycle({
		getConfig: getRuntimeConfig,
		minimalTestGateway,
		log
	});
	const gatewayRequestContext = await startupTrace.measure("gateway.request-context", async () => {
		const { createGatewayRequestContext } = await import("./server-request-context-Cz8xbGpn.js");
		return createGatewayRequestContext({
			deps,
			runtimeState,
			sessionCompanion,
			getRuntimeConfig,
			gatewayTlsFingerprint: gatewayTls.enabled ? gatewayTls.fingerprintSha256 : void 0,
			sessionObserver,
			getMcpAppSandboxPort,
			ensureSandboxHostPort,
			getPortalService,
			resolveTerminalLaunchPolicy: terminalLaunchPolicy.resolve,
			isTerminalEnabled: terminalLaunchPolicy.isEnabled,
			execApprovalManager,
			cancelRunBoundApprovals,
			forwardPluginApprovalRequest,
			pluginApprovalIosPushDelivery,
			pluginApprovalManager,
			systemAgentApprovalManager,
			listSessionPendingApprovals: approvalSessionEvents.replay,
			loadGatewayModelCatalog,
			loadGatewayModelCatalogSnapshot,
			readPreparedGatewayModelCatalog,
			readChatMetadata: chatMetadataLifecycle.read,
			readChatStartupProjection: chatMetadataLifecycle.readStartup,
			getHealthCache,
			refreshHealthSnapshot: refreshGatewayHealthSnapshotWithRuntime,
			logHealth,
			logGateway: log,
			incrementPresenceVersion,
			getHealthVersion,
			broadcast,
			broadcastToConnIds,
			nodeSendToSession,
			nodeSendToAllSubscribed,
			nodeSubscribe,
			nodeUnsubscribe,
			nodeUnsubscribeAll,
			hasConnectedTalkNode: hasTalkNodeConnected,
			clients,
			invalidateDeviceTransports: watchNodeHttpRuntime.invalidateSessionsForDevice,
			disconnectDeviceTransports: watchNodeHttpRuntime.disconnectSessionsForDevice,
			enforceSharedGatewayAuthGenerationForConfigWrite: (nextConfig) => {
				enforceSharedGatewaySessionGenerationForConfigWrite({
					state: sharedGatewaySessionGenerationState,
					nextConfig,
					resolveRuntimeSnapshotGeneration: resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
					clients
				});
			},
			completeControlUiDeviceAuthMigration: completeControlUiDeviceAuthMigrationForEffectiveOperator,
			claimControlUiDeviceAuthMigration: (deviceId) => claimControlUiDeviceAuthMigration(deviceId, { env: process.env }),
			releaseControlUiDeviceAuthMigrationClaim: (deviceId) => releaseControlUiDeviceAuthMigrationClaim(deviceId, { env: process.env }),
			nodeRegistry,
			...nodeDesktopService ? { nodeDesktopService } : {},
			...workerEnvironmentService ? { workerEnvironmentService } : {},
			...hostDesktopService ? { hostDesktopService } : {},
			...workerEnvironmentStartup ? { workerSessionPlacementService: workerEnvironmentStartup.placementStore } : {},
			...workerPlacementRuntime ? { workerPlacementDiskSpaceReader: workerPlacementRuntime.diskSpace } : {},
			...workerPlacementControlAvailable ? { workerPlacementDispatchService: workerPlacementControlAvailable } : {},
			validateAgentRuntimeApprovalAuthority,
			terminalSessions,
			agentRunSeq,
			chatAbortControllers,
			chatQueuedTurns,
			chatRunState,
			addChatRun,
			removeChatRun,
			subscribeSessionEvents: sessionEventSubscribers.subscribe,
			unsubscribeSessionEvents: sessionEventSubscribers.unsubscribe,
			subscribeSessionMessageEvents,
			unsubscribeSessionMessageEvents,
			unsubscribeAllSessionEvents: (connId) => {
				sessionEventSubscribers.unsubscribe(connId);
				sessionMessageSubscribers.unsubscribeAll(connId);
				sessionObserver.removeConnection(connId);
			},
			getSessionEventSubscriberConnIds: sessionEventSubscribers.getAll,
			registerToolEventRecipient: toolEventRecipients.add,
			dedupe,
			wizardSessions,
			systemAgentSessions,
			findRunningWizard,
			purgeWizardSession,
			getRuntimeSnapshot,
			getEventLoopHealth: readinessEventLoopHealth.snapshot,
			startChannel,
			stopChannel,
			markChannelLoggedOut,
			wizardRunner,
			channelWizardRunner,
			broadcastVoiceWakeChanged,
			unavailableGatewayMethods,
			broadcastVoiceWakeRoutingChanged,
			notifyPluginMetadataChanged: kernel.notifyPluginMetadataChanged,
			getConfigReloaderHotReloadStatus: kernel.getConfigReloaderHotReloadStatus
		});
	});
	bindApprovalPublicationContext(gatewayRequestContext);
	await attachInitialGatewayLifetimeSidecars({
		chatMetadataLifecycle,
		gatewayRequestContext,
		sidecars: runtimeState.gatewayLifetimeSidecars
	});
	pluginGatewayContext.current = gatewayRequestContext;
	const { createGatewayInstanceRuntime } = await import("./server-instance-runtime-CfaRbOOC.js");
	const gatewayInstanceRuntime = createGatewayInstanceRuntime({
		getContext: () => gatewayRequestContext,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		isDispatchAvailable: () => startupState.dispatchReady && !lifecycle.closePreludeStarted,
		logError: (message) => log.error(message)
	});
	gatewayInstanceRuntimeRef.current = gatewayInstanceRuntime;
	gatewayRequestContext.approvalEvents = gatewayInstanceRuntime.approvalEvents;
	gatewayRequestContext.recoveryRuntime = gatewayInstanceRuntime.recovery;
	const clearFallbackContext = setFallbackGatewayContextResolver(() => gatewayRequestContext);
	clearFallbackGatewayContextForServer.set(typeof clearFallbackContext === "function" ? () => clearFallbackContext() : () => {});
	return {
		...runtime,
		chatMetadataLifecycle,
		gatewayRequestContext,
		gatewayInstanceRuntime
	};
}
//#endregion
//#region src/gateway/server-cron-lazy.ts
/** Creates a cron state proxy that imports the real cron service on first use. */
function createLazyGatewayCronState(params) {
	const env = params.env ?? process.env;
	const storePath = resolveCronJobsStorePathFromConfig(params.cfg, env);
	const cronEnabled = env.OPENCLAW_SKIP_CRON !== "1" && params.cfg.cron?.enabled !== false;
	let loaded = null;
	let stopped = false;
	let lifecycleGeneration = 0;
	let schedulingPaused = false;
	const schedulingResumeWaiters = /* @__PURE__ */ new Set();
	const releaseSchedulingResumeWaiters = () => {
		const waiters = Array.from(schedulingResumeWaiters);
		schedulingResumeWaiters.clear();
		for (const resolve of waiters) resolve();
	};
	const waitForSchedulingResume = async () => {
		if (!schedulingPaused) return;
		await new Promise((resolve) => {
			schedulingResumeWaiters.add(resolve);
		});
	};
	const cronStateLoader = createLazyPromiseLoader(() => import("./server-cron-o1kZdjDF.js").then(({ buildGatewayCronService }) => {
		loaded = {
			state: buildGatewayCronService(params),
			phase: "idle",
			startPromise: null,
			startGeneration: null,
			schedulingPaused: false,
			underlyingStartInFlight: false,
			underlyingStarted: false
		};
		if (schedulingPaused) {
			loaded.state.cron.pauseScheduling();
			loaded.schedulingPaused = true;
		}
		return loaded;
	}), { cacheRejections: true });
	const load = async () => {
		if (loaded) return loaded;
		return await cronStateLoader.load();
	};
	const cron = {
		async start() {
			stopped = false;
			const generation = lifecycleGeneration;
			const startCancelled = () => stopped || generation !== lifecycleGeneration;
			const resolved = await load();
			const hasStarted = () => resolved.phase === "started";
			if (startCancelled()) return;
			if (hasStarted()) return;
			if (resolved.startPromise) {
				const pendingGeneration = resolved.startGeneration;
				try {
					await resolved.startPromise;
				} catch (err) {
					if (pendingGeneration === generation) throw err;
				}
				if (startCancelled() || hasStarted()) return;
				if (pendingGeneration !== generation) {
					await cron.start();
					return;
				}
			}
			resolved.phase = "starting";
			resolved.startGeneration = generation;
			const startPromise = (async () => {
				await waitForSchedulingResume();
				if (startCancelled()) {
					resolved.phase = "stopped";
					return;
				}
				if (resolved.schedulingPaused) {
					resolved.state.cron.resumeScheduling();
					resolved.schedulingPaused = false;
				}
				resolved.underlyingStartInFlight = true;
				try {
					await resolved.state.cron.start();
					resolved.underlyingStarted = true;
				} catch (err) {
					resolved.underlyingStarted = false;
					resolved.phase = startCancelled() ? "stopped" : "idle";
					throw err;
				} finally {
					resolved.underlyingStartInFlight = false;
				}
				if (startCancelled()) {
					resolved.phase = "stopped";
					resolved.underlyingStarted = false;
					resolved.state.cron.stop();
					await resolved.state.stopStreamWatchers?.();
					return;
				}
				if (schedulingPaused) {
					resolved.state.cron.pauseScheduling();
					resolved.schedulingPaused = true;
				}
				try {
					if (resolved.state.cronEnabled) await Promise.all([resolved.state.reconcileExitWatchers?.(), resolved.state.reconcileStreamWatchers?.()]);
				} catch (err) {
					resolved.phase = startCancelled() ? "stopped" : "started";
					throw err;
				}
				if (startCancelled()) {
					resolved.phase = "stopped";
					resolved.underlyingStarted = false;
					resolved.state.cron.stop();
					await resolved.state.stopStreamWatchers?.();
					return;
				}
				resolved.phase = "started";
			})();
			resolved.startPromise = startPromise;
			try {
				await startPromise;
			} finally {
				if (resolved.startPromise === startPromise) {
					resolved.startPromise = null;
					resolved.startGeneration = null;
				}
			}
		},
		stop() {
			stopped = true;
			lifecycleGeneration += 1;
			releaseSchedulingResumeWaiters();
			if (loaded) {
				loaded.phase = "stopped";
				loaded.underlyingStarted = false;
				loaded.state.cron.stop();
				return;
			}
			const loading = cronStateLoader.peek();
			if (loading) loading.then((resolved) => {
				if (!stopped) return;
				resolved.phase = "stopped";
				resolved.underlyingStarted = false;
				resolved.state.cron.stop();
			}).catch(() => {});
		},
		async stopAndDrain() {
			stopped = true;
			lifecycleGeneration += 1;
			releaseSchedulingResumeWaiters();
			const resolved = loaded ?? (cronStateLoader.peek() ? await cronStateLoader.peek() : null);
			if (!resolved) return;
			resolved.phase = "stopped";
			resolved.underlyingStarted = false;
			if (resolved.state.cron.stopAndDrain) await resolved.state.cron.stopAndDrain();
			else {
				resolved.state.cron.stop();
				await resolved.state.stopStreamWatchers?.();
			}
		},
		pauseScheduling() {
			schedulingPaused = true;
			if (loaded) {
				loaded.state.cron.pauseScheduling();
				loaded.schedulingPaused = true;
			}
		},
		resumeScheduling() {
			schedulingPaused = false;
			releaseSchedulingResumeWaiters();
			if (loaded && loaded.schedulingPaused && (loaded.underlyingStarted || loaded.underlyingStartInFlight)) {
				loaded.state.cron.resumeScheduling();
				loaded.schedulingPaused = false;
			}
		},
		getSuspensionBlockerCount() {
			const loadedBlockers = loaded?.state.cron.getSuspensionBlockerCount?.() ?? 0;
			return loaded?.phase === "starting" ? Math.max(1, loadedBlockers) : loadedBlockers;
		},
		async status() {
			return await (await load()).state.cron.status();
		},
		async list(opts) {
			return await (await load()).state.cron.list(opts);
		},
		async listPage(opts) {
			return await (await load()).state.cron.listPage(opts);
		},
		async add(input, opts) {
			return await (await load()).state.cron.add(input, opts);
		},
		async update(id, patch, opts) {
			return await (await load()).state.cron.update(id, patch, opts);
		},
		async updateWithPrecondition(id, patch, precondition, opts) {
			return await (await load()).state.cron.updateWithPrecondition(id, patch, precondition, opts);
		},
		async remove(id, opts) {
			return await (await load()).state.cron.remove(id, opts);
		},
		async removeStaleJobFamily(family) {
			return await (await load()).state.cron.removeStaleJobFamily(family);
		},
		async removeAgentJobsTransactional(agentId, commit) {
			return await (await load()).state.cron.removeAgentJobsTransactional(agentId, commit);
		},
		async run(id, mode, opts) {
			return await (await load()).state.cron.run(id, mode, opts);
		},
		async enqueueRun(id, mode, opts) {
			return await (await load()).state.cron.enqueueRun(id, mode, opts);
		},
		getJob(id) {
			if (!loaded) return;
			return loaded.state.cron.getJob(id);
		},
		async readJob(id) {
			return await (await load()).state.cron.readJob(id);
		},
		async readScratch(id) {
			return await (await load()).state.cron.readScratch(id);
		},
		async writeScratch(id, write) {
			return await (await load()).state.cron.writeScratch(id, write);
		},
		getDefaultAgentId() {
			if (!loaded) return;
			return loaded.state.cron.getDefaultAgentId();
		},
		async prepareWake() {
			await load();
		},
		wake(opts) {
			if (!loaded) {
				load();
				return { ok: false };
			}
			return loaded.state.cron.wake(opts);
		}
	};
	return {
		cron,
		storePath,
		cronEnabled
	};
}
//#endregion
//#region src/gateway/server-cron-reconciled.ts
function createGatewayCronReconciliation(params) {
	let lifecycleGeneration = 0;
	let activeAbortController;
	const supersedeActive = () => {
		lifecycleGeneration += 1;
		activeAbortController?.abort();
		activeAbortController = void 0;
	};
	return {
		arm: ({ reason, config, cronState }) => {
			supersedeActive();
			const generation = lifecycleGeneration;
			const abortController = new AbortController();
			activeAbortController = abortController;
			const cron = cronState.cron;
			const event = {
				reason,
				enabled: cronState.cronEnabled
			};
			let completed = false;
			return { complete: async () => {
				if (completed) return;
				completed = true;
				if (params.isClosing() || generation !== lifecycleGeneration || abortController.signal.aborted) return;
				await params.runHook(event, {
					port: params.port,
					config,
					workspaceDir: params.workspaceDir,
					getCron: () => cron,
					abortSignal: abortController.signal
				});
			} };
		},
		invalidate: supersedeActive
	};
}
//#endregion
//#region src/gateway/server-runtime-handles.ts
/** Creates gateway mutable state with inert handles that are safe to stop before startup finishes. */
function createGatewayServerMutableState() {
	const noopInterval = () => {
		const timer = setInterval(() => {}, 1 << 30);
		timer.unref?.();
		return timer;
	};
	return {
		bonjourStop: null,
		tickInterval: noopInterval(),
		healthInterval: noopInterval(),
		dedupeCleanup: noopInterval(),
		stopMediaCleanup: () => waitForMediaCleanupDrains({ timeoutMs: MEDIA_CLEANUP_STOP_TIMEOUT_MS }),
		worktreeCleanup: null,
		skillCuratorCleanup: () => {},
		heartbeatRunner: {
			stop: () => {},
			updateConfig: (_cfg) => {}
		},
		stopOutboundDeliveryRecovery: async () => {},
		stopGatewayUpdateCheck: () => {},
		tailscaleCleanup: null,
		postReadySidecars: [],
		gatewayLifetimeSidecars: [],
		skillsRefreshTimer: null,
		skillsRefreshDelayMs: 3e4,
		skillsChangeUnsub: () => {},
		channelHealthMonitor: null,
		mcpServer: void 0,
		configReloader: {
			stop: async () => {},
			notifyPluginMetadataChanged: () => {}
		},
		agentUnsub: null,
		heartbeatUnsub: null,
		transcriptUnsub: null,
		lifecycleUnsub: null,
		taskUnsub: null
	};
}
//#endregion
//#region src/gateway/server-live-state.ts
/** Creates gateway live state with fresh mutable runtime handles. */
function createGatewayServerLiveState(params) {
	return {
		...createGatewayServerMutableState(),
		hooksConfig: params.hooksConfig,
		hookClientIpConfig: params.hookClientIpConfig,
		cronState: params.cronState,
		controlUiSessionPullRequests: void 0,
		sessionViewerPresence: void 0,
		pluginServices: null,
		gatewayMethods: params.gatewayMethods
	};
}
//#endregion
//#region src/gateway/server-public.ts
function shouldRetainControlUiDeviceAuthMigrationSession(params) {
	const approvedDeviceId = params.approvedDevice.deviceId.trim();
	const approvedPublicKey = normalizeDevicePublicKeyBase64Url(params.approvedDevice.publicKey);
	return Boolean(params.sessionDevice?.id.trim() === approvedDeviceId && approvedPublicKey && normalizeDevicePublicKeyBase64Url(params.sessionDevice.publicKey) === approvedPublicKey);
}
//#endregion
//#region src/gateway/session-viewer-presence.ts
function normalizedSessionKeys(sessionKeys) {
	return [...new Set(sessionKeys.map((key) => key.trim()).filter(Boolean))].toSorted();
}
function sameKeys(left, right) {
	return left !== void 0 && left.length === right.length && left.every((key, index) => key === right[index]);
}
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
function createSessionViewerPresenceDeclarations(deps) {
	const declarations = /* @__PURE__ */ new Map();
	let stopped = false;
	const replace = (connId, sessionKeys) => {
		if (stopped) return [];
		const normalizedConnId = connId.trim();
		if (!normalizedConnId) return [];
		const next = normalizedSessionKeys(sessionKeys);
		const previous = declarations.get(normalizedConnId);
		if (sameKeys(previous, next) || previous === void 0 && next.length === 0) return next;
		if (next.length === 0) declarations.delete(normalizedConnId);
		else declarations.set(normalizedConnId, next);
		deps.onReplace(normalizedConnId, next);
		return next;
	};
	const unsubscribe = (connId) => {
		const normalizedConnId = connId.trim();
		if (normalizedConnId) declarations.delete(normalizedConnId);
	};
	const stop = () => {
		stopped = true;
		declarations.clear();
	};
	return {
		replace,
		unsubscribe,
		stop
	};
}
//#endregion
//#region src/gateway/server-lifecycle.ts
async function prepareGatewayLifecycle(params) {
	const { runtime, port, log, logCron, diagnosticsEnabled, loadGatewayCloseModule, closeMcpLoopbackServerOnDemand, stopTaskRegistryMaintenanceOnDemand } = params;
	const { minimalTestGateway, controlUiDeviceAuthMigration, completeControlUiDeviceAuthMigration, workerGatewayEndpoint, transportBridge, sessionMessageSubscribers, clients, broadcast, cfgAtStart, pluginRuntime, authRateLimiter, nodeReapprovalCoordinator, channelManager, deps, initialHooksConfig, initialHookClientIpConfig, runtimeStateRef, gatewayInstanceRuntimeRef, startupState, readinessEventLoopHealth, browserAuthRateLimiter, chatRunState, chatAbortControllers, chatQueuedTurns, removeChatRun, agentRunSeq, listActiveGatewayMethods, broadcastToConnIds, getBufferedAmount, sessionEventSubscribers, watchNodeRequestHandler, defaultWorkspaceDir, activeTaskCount, residentRegistry, desktopSessionRegistry, nodeDesktopStreamBroker, bindDeviceNodeControl, workerPlacementRuntime } = runtime;
	const completeControlUiDeviceAuthMigrationForEffectiveOperator = (device) => {
		if (!controlUiDeviceAuthMigration.pending || !roleScopesAllow({
			role: "operator",
			requestedScopes: ["operator.pairing"],
			allowedScopes: device.scopes
		})) return;
		const normalizedDeviceId = device.deviceId.trim();
		controlUiDeviceAuthMigration.pending = false;
		for (const client of clients) {
			if (!client.isControlUiDeviceAuthMigrationSession) continue;
			if (client.isControlUiDeviceAuthMigration && shouldRetainControlUiDeviceAuthMigrationSession({
				sessionDevice: client.connect.device,
				approvedDevice: device
			})) continue;
			client.invalidated = true;
			client.invalidatedReason = "device-auth-migration-completed";
			client.socket.close(4001, "device auth migration completed");
		}
		try {
			completeControlUiDeviceAuthMigration(normalizedDeviceId, { env: process.env });
		} catch (error) {
			log.warn(`failed to persist Control UI device-auth migration completion: ${String(error)}`);
		}
	};
	const unsubscribeEffectiveOperatorPairing = onEffectiveOperatorDevicePaired(completeControlUiDeviceAuthMigrationForEffectiveOperator);
	workerGatewayEndpoint.resolve = transportBridge.getWorkerIngressEndpoint;
	const subscribeSessionMessageEvents = (connId, sessionKey, options) => sessionMessageSubscribers.subscribe(connId, sessionKey, options);
	const unsubscribeSessionMessageEvents = (connId, sessionKey) => sessionMessageSubscribers.unsubscribe(connId, sessionKey);
	const restartRecoveryCandidates = /* @__PURE__ */ new Map();
	const nodeDesktopServiceRef = {};
	const { createGatewayNodeSessionRuntime } = await import("./server-node-session-runtime-karDEZ8N.js");
	const { nodeRegistry, nodeWorkerSupervisorTransport, nodePresenceTimers, nodeSendToSession, nodeSendToAllSubscribed, nodeSubscribe, nodeUnsubscribe, nodeUnsubscribeAll, broadcastVoiceWakeChanged, broadcastVoiceWakeRoutingChanged, hasTalkNodeConnected } = createGatewayNodeSessionRuntime({
		broadcast,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		listRegisteredNodePluginToolCommands: () => pluginRuntime.registry.nodeHostCommands,
		nodePluginToolsEnabled: cfgAtStart.gateway?.nodes?.pluginTools?.enabled !== false,
		nodeSkillsEnabled: cfgAtStart.gateway?.nodes?.allowSkills !== false,
		onRunnerInventoryChanged: (nodeId) => {
			workerPlacementRuntime?.scheduleNodeWorkspaceRetention(nodeId);
		},
		onPairingInvalidated: ({ nodeId, connId }) => {
			nodeDesktopServiceRef.current?.stopNode(nodeId);
			upsertPresence(nodeId, { reason: "disconnect" });
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			removeRemoteNodeInfoForConnection(nodeId, connId);
		},
		onPairingGenerationChanged: ({ nodeId }) => {
			nodeDesktopServiceRef.current?.stopNode(nodeId);
		}
	});
	const nodeDesktopService = desktopSessionRegistry && nodeDesktopStreamBroker ? (await import("./node-source-DVuTynL4.js")).createNodeDesktopService({
		getConfig: getRuntimeConfig,
		nodeRegistry,
		desktopRegistry: desktopSessionRegistry,
		streamBroker: nodeDesktopStreamBroker
	}) : void 0;
	nodeDesktopServiceRef.current = nodeDesktopService;
	bindDeviceNodeControl?.(nodeWorkerSupervisorTransport);
	const { createWatchNodeHttpRuntime } = await import("./watch-node-http-pcPGqneQ.js");
	const watchNodeHttpRuntime = createWatchNodeHttpRuntime({
		nodeRegistry,
		getConfig: getRuntimeConfig,
		broadcast,
		rateLimiter: authRateLimiter,
		nodeReapprovalCoordinator,
		onNodeConnected: (session) => {
			upsertPresence(session.nodeId, {
				host: session.displayName ?? session.clientId ?? session.nodeId,
				ip: session.remoteIp,
				version: session.version,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				modelIdentifier: session.modelIdentifier,
				mode: session.clientMode,
				deviceId: session.nodeId,
				roles: ["node"],
				scopes: [],
				instanceId: session.nodeId,
				reason: "connect"
			});
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			recordRemoteNodeInfo({
				nodeId: session.nodeId,
				connId: session.connId,
				displayName: session.displayName,
				platform: session.platform,
				deviceFamily: session.deviceFamily,
				commands: session.commands,
				remoteIp: session.remoteIp,
				pairingGeneration: session.pairingGeneration
			});
		},
		onNodeDisconnected: (nodeId) => {
			upsertPresence(nodeId, { reason: "disconnect" });
			broadcastPresenceSnapshot({
				broadcast,
				incrementPresenceVersion,
				getHealthVersion
			});
			removeRemoteNodeInfo(nodeId);
			nodeUnsubscribeAll(nodeId);
			clearNodeWakeState(nodeId);
		},
		onError: (message, error) => log.warn(`${message}: ${String(error)}`)
	});
	watchNodeRequestHandler.current = watchNodeHttpRuntime.handleRequest;
	const { TerminalSessionManager, DEFAULT_TERMINAL_DETACH_SECONDS } = await import("./session-manager-DbY41t-S.js");
	const { createTerminalSessionTransport } = await import("./gateway-transport-CCDhR7aF.js");
	const terminalSessions = new TerminalSessionManager({
		...createTerminalSessionTransport(broadcastToConnIds, getBufferedAmount),
		detachGraceMs: (cfgAtStart.gateway?.terminal?.detachedSessionTimeoutSeconds ?? DEFAULT_TERMINAL_DETACH_SECONDS) * 1e3
	});
	applyGatewayLaneConcurrency(resolveGatewayLaneConcurrency(cfgAtStart), { gatewayStart: true });
	runtimeStateRef.current = createGatewayServerLiveState({
		hooksConfig: initialHooksConfig,
		hookClientIpConfig: initialHookClientIpConfig,
		cronState: createLazyGatewayCronState({
			cfg: cfgAtStart,
			deps,
			broadcast
		}),
		gatewayMethods: listActiveGatewayMethods(pluginRuntime.baseGatewayMethods)
	});
	const runtimeState = runtimeStateRef.current;
	const unavailableGatewayMethods = new Set(minimalTestGateway ? [] : STARTUP_UNAVAILABLE_GATEWAY_METHODS);
	const kernel = {
		setDispatchReady: (ready) => {
			startupState.dispatchReady = ready;
		},
		markSidecarsReady: () => {
			startupState.sidecarsReady = true;
		},
		unlockStartupMethods: () => {
			for (const method of STARTUP_UNAVAILABLE_GATEWAY_METHODS) unavailableGatewayMethods.delete(method);
		},
		publishMethodSurface: (methods) => {
			runtimeState.gatewayMethods.splice(0, runtimeState.gatewayMethods.length, ...methods);
		},
		setEarlyRuntimeHandles: (handles) => {
			runtimeState.bonjourStop = handles.bonjourStop;
			activeTaskCount.get = handles.getActiveTaskCount;
			runtimeState.skillsChangeUnsub = handles.skillsChangeUnsub;
		},
		swapBonjourStop: (next) => {
			const previous = runtimeState.bonjourStop;
			runtimeState.bonjourStop = next;
			return previous;
		},
		setScheduledServiceHandles: (handles) => {
			runtimeState.heartbeatRunner = handles.heartbeatRunner;
			runtimeState.stopOutboundDeliveryRecovery = handles.stopOutboundDeliveryRecovery;
		},
		setPostAttachHandles: (handles) => {
			runtimeState.stopGatewayUpdateCheck = handles.stopGatewayUpdateCheck;
			runtimeState.tailscaleCleanup = handles.tailscaleCleanup;
			runtimeState.pluginServices = handles.pluginServices;
		},
		setPluginServices: (pluginServices) => {
			runtimeState.pluginServices = pluginServices;
		},
		setConfigReloaderHandle: (configReloader) => {
			runtimeState.configReloader = configReloader;
		},
		getReloadState: () => ({
			hooksConfig: runtimeState.hooksConfig,
			hookClientIpConfig: runtimeState.hookClientIpConfig,
			heartbeatRunner: runtimeState.heartbeatRunner,
			cronState: runtimeState.cronState,
			channelHealthMonitor: runtimeState.channelHealthMonitor
		}),
		setReloadHookState: (next) => {
			runtimeState.hooksConfig = next.hooksConfig;
			runtimeState.hookClientIpConfig = next.hookClientIpConfig;
		},
		swapHeartbeatRunner: (next) => {
			const previous = runtimeState.heartbeatRunner;
			runtimeState.heartbeatRunner = next;
			return previous;
		},
		swapCronState: (next) => {
			const previous = runtimeState.cronState;
			runtimeState.cronState = next;
			deps.cron = next.cron;
			return previous;
		},
		setChannelHealthMonitor: (next) => {
			runtimeState.channelHealthMonitor = next;
		},
		notifyPluginMetadataChanged: () => {
			runtimeState.configReloader.notifyPluginMetadataChanged();
		},
		getConfigReloaderHotReloadStatus: () => runtimeState.configReloader.hotReloadStatus?.(),
		setPostReadySidecars: (sidecars) => {
			runtimeState.postReadySidecars = sidecars;
		},
		setGatewayLifetimeSidecars: (sidecars) => {
			runtimeState.gatewayLifetimeSidecars = sidecars;
		},
		addGatewayLifetimeSidecar: (sidecar) => {
			runtimeState.gatewayLifetimeSidecars.push(sidecar);
		},
		setMaintenanceHandles: (handles) => {
			runtimeState.tickInterval = handles.tickInterval;
			runtimeState.healthInterval = handles.healthInterval;
			runtimeState.dedupeCleanup = handles.dedupeCleanup;
			runtimeState.stopMediaCleanup = handles.stopMediaCleanup;
			runtimeState.worktreeCleanup = handles.worktreeCleanup;
			runtimeState.skillCuratorCleanup = handles.skillCuratorCleanup;
		}
	};
	runtimeState.controlUiSessionPullRequests = createControlUiSessionPullRequestSubscriptions({ broadcastToConnIds });
	runtimeState.sessionViewerPresence = createSessionViewerPresenceDeclarations({ onReplace: (connId, sessionKeys) => {
		const client = [...clients].find((candidate) => candidate.connId === connId);
		if (!client?.presenceKey) return;
		upsertPresence(client.presenceKey, { watchedSessions: sessionKeys.length > 0 ? [...sessionKeys] : void 0 });
		broadcastPresenceSnapshot({
			broadcast,
			incrementPresenceVersion,
			getHealthVersion
		});
	} });
	deps.cron = runtimeState.cronState.cron;
	const pluginHostServices = { get cron() {
		return runtimeState.cronState.cron;
	} };
	const lifecycle = { closePreludeStarted: false };
	const cronReconciliation = createGatewayCronReconciliation({
		port,
		workspaceDir: defaultWorkspaceDir,
		isClosing: () => lifecycle.closePreludeStarted,
		runHook: async (event, ctx) => {
			try {
				const hookRunner = (await import("./plugins/hook-runner-global.js")).getGlobalHookRunner();
				if (hookRunner?.hasHooks("cron_reconciled")) await hookRunner.runCronReconciled(event, ctx);
			} catch (err) {
				logCron.error(`cron_reconciled hook failed: ${String(err)}`);
			}
		}
	});
	const postReadyState = {
		maintenanceTimer: null,
		retainedPluginCleanupHandle: null
	};
	const clearPostReadyMaintenanceTimer = () => {
		if (!postReadyState.maintenanceTimer) return;
		clearTimeout(postReadyState.maintenanceTimer);
		postReadyState.maintenanceTimer = null;
	};
	let outboundDeliveryRecoveryStopPromise = null;
	const stopOutboundDeliveryRecoveryForClose = () => {
		outboundDeliveryRecoveryStopPromise ??= runtimeState.stopOutboundDeliveryRecovery();
		return outboundDeliveryRecoveryStopPromise;
	};
	let mediaCleanupStopPromise = null;
	const stopMediaCleanupForClose = () => {
		mediaCleanupStopPromise ??= runtimeState.stopMediaCleanup();
		return mediaCleanupStopPromise;
	};
	const markClosePreludeStarted = () => {
		lifecycle.closePreludeStarted = true;
		stopOutboundDeliveryRecoveryForClose();
		stopMediaCleanupForClose();
		runtimeState.stopGatewayUpdateCheck();
		runtimeState.controlUiSessionPullRequests?.stop();
		runtimeState.sessionViewerPresence?.stop();
		unsubscribeEffectiveOperatorPairing();
		kernel.setDispatchReady(false);
		gatewayInstanceRuntimeRef.current?.close();
		cronReconciliation.invalidate();
		clearPostReadyMaintenanceTimer();
		postReadyState.retainedPluginCleanupHandle?.stop();
		postReadyState.retainedPluginCleanupHandle = null;
	};
	let configReloaderStopPromise = null;
	const stopConfigReloaderForClose = () => {
		configReloaderStopPromise ??= runtimeState.configReloader.stop();
		return configReloaderStopPromise;
	};
	const beginClosePrelude = async () => {
		fenceSessionSuspensionWritesForGatewayShutdown();
		markClosePreludeStarted();
		await Promise.all([
			stopOutboundDeliveryRecoveryForClose(),
			stopMediaCleanupForClose(),
			stopConfigReloaderForClose().catch(() => {})
		]);
	};
	const runClosePrelude = async () => {
		await beginClosePrelude();
		disposeNodeConnectionNotifications(nodeRegistry);
		watchNodeHttpRuntime.close();
		clearPluginMetadataLifecycleCaches();
		const { runGatewayClosePrelude } = await loadGatewayCloseModule();
		await runGatewayClosePrelude({
			...diagnosticsEnabled ? { stopDiagnostics: stopDiagnosticHeartbeat } : {},
			clearSkillsRefreshTimer: () => {
				if (!runtimeState?.skillsRefreshTimer) return;
				clearTimeout(runtimeState.skillsRefreshTimer);
				runtimeState.skillsRefreshTimer = null;
			},
			skillsChangeUnsub: runtimeState.skillsChangeUnsub,
			disposeAuthRateLimiter: () => {
				authRateLimiter.dispose();
				nodeReapprovalCoordinator.dispose();
			},
			disposeBrowserAuthRateLimiter: () => browserAuthRateLimiter.dispose(),
			stopChannelHealthMonitor: async () => {
				const monitor = runtimeState?.channelHealthMonitor;
				monitor?.shutdown();
				await monitor?.waitForIdle();
			},
			stopReadinessEventLoopHealth: readinessEventLoopHealth.stop,
			closeMcpServer: closeMcpLoopbackServerOnDemand
		});
	};
	const { getRuntimeSnapshot, startChannels, startChannel, stopChannel, markChannelLoggedOut } = channelManager;
	const refreshGatewayHealthSnapshotWithRuntime = (optsResult) => refreshGatewayHealthSnapshot({
		...optsResult,
		getRuntimeSnapshot,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		getConfigReloaderHotReloadStatus: kernel.getConfigReloaderHotReloadStatus
	});
	const stopRegisteredPostReadySidecars = async () => {
		const postReadySidecars = runtimeState.postReadySidecars;
		runtimeState.postReadySidecars = [];
		for (const postReadySidecar of postReadySidecars) await postReadySidecar.stop();
	};
	const stopRegisteredGatewayLifetimeSidecars = async () => {
		const gatewayLifetimeSidecars = runtimeState.gatewayLifetimeSidecars;
		runtimeState.gatewayLifetimeSidecars = [];
		for (const gatewayLifetimeSidecar of gatewayLifetimeSidecars) await gatewayLifetimeSidecar.stop();
	};
	const createCloseHandler = () => async (optsValue) => {
		const channelIds = listLoadedChannelPlugins().map((plugin) => plugin.id);
		const { createGatewayCloseHandler, drainActiveSessionsForShutdown } = await loadGatewayCloseModule();
		const transport = transportBridge.current();
		await transport?.portalService.closeAll();
		await createGatewayCloseHandler({
			bonjourStop: runtimeState.bonjourStop,
			tailscaleCleanup: runtimeState.tailscaleCleanup,
			clearSecretsRuntimeSnapshot: clearSecretsRuntimeSnapshotState,
			channelIds,
			stopChannel,
			pluginServices: runtimeState.pluginServices,
			postReadySidecars: runtimeState.postReadySidecars,
			cron: runtimeState.cronState.cron,
			heartbeatRunner: runtimeState.heartbeatRunner,
			updateCheckStop: runtimeState.stopGatewayUpdateCheck,
			stopTaskRegistryMaintenance: stopTaskRegistryMaintenanceOnDemand,
			nodePresenceTimers,
			broadcast,
			tickInterval: runtimeState.tickInterval,
			healthInterval: runtimeState.healthInterval,
			dedupeCleanup: runtimeState.dedupeCleanup,
			stopMediaCleanup: stopMediaCleanupForClose,
			worktreeCleanup: runtimeState.worktreeCleanup,
			skillCuratorCleanup: runtimeState.skillCuratorCleanup,
			agentUnsub: runtimeState.agentUnsub,
			heartbeatUnsub: runtimeState.heartbeatUnsub,
			transcriptUnsub: runtimeState.transcriptUnsub,
			lifecycleUnsub: runtimeState.lifecycleUnsub,
			taskUnsub: runtimeState.taskUnsub,
			chatRunState,
			chatAbortControllers,
			chatQueuedTurns,
			restartRecoveryCandidates,
			removeChatRun,
			agentRunSeq,
			nodeSendToSession,
			resolveActiveSessionIdForKey: resolveActiveEmbeddedRunSessionId,
			markMainSessionsAbortedForRestart: async ({ sessionKeys, sessionIds, activeRuns, reason, isActiveRun }) => {
				if (sessionKeys.size === 0 && sessionIds.size === 0) return;
				const { markRestartAbortedMainSessions } = await import("./main-session-restart-recovery-CY1fQWF5.js");
				await markRestartAbortedMainSessions({
					cfg: getRuntimeConfig(),
					sessionKeys,
					sessionIds,
					activeRuns,
					isActiveRun,
					reason
				});
			},
			getPendingReplyCount: getTotalPendingReplies,
			clients,
			configReloader: { stop: stopConfigReloaderForClose },
			...transport ? {
				wss: transport.wss,
				httpServer: transport.httpServer,
				httpServers: transport.httpServers
			} : {},
			drainActiveSessionsForShutdown
		})(optsValue);
	};
	let clearFallbackGatewayContextForServer = () => {};
	const closeOnStartupFailure = async () => {
		try {
			await beginClosePrelude();
			await stopRegisteredGatewayLifetimeSidecars();
			await stopRegisteredPostReadySidecars();
			await runClosePrelude();
			await createCloseHandler()({ reason: "gateway startup failed" });
		} finally {
			clearFallbackGatewayContextForServer();
		}
	};
	const diagnosticHeartbeatResident = residentRegistry.register({
		name: "diagnostic-heartbeat",
		start: () => {
			startDiagnosticHeartbeat(void 0, {
				getConfig: getRuntimeConfig,
				startupGraceMs: 6e4,
				sampleLiveness: () => {
					const sample = readinessEventLoopHealth.persistentDegradationSnapshot();
					if (!sample || sample.degradedSinceMs == null) return null;
					return {
						reasons: sample.reasons,
						intervalMs: sample.intervalMs,
						degradedSinceMs: sample.degradedSinceMs,
						eventLoopDelayP99Ms: sample.delayP99Ms,
						eventLoopDelayMaxMs: sample.delayMaxMs,
						eventLoopUtilization: sample.utilization,
						cpuCoreRatio: sample.cpuCoreRatio
					};
				}
			});
		},
		stop: () => stopDiagnosticHeartbeat()
	});
	if (diagnosticsEnabled) diagnosticHeartbeatResident.start();
	return {
		...runtime,
		completeControlUiDeviceAuthMigrationForEffectiveOperator,
		unsubscribeEffectiveOperatorPairing,
		subscribeSessionMessageEvents,
		unsubscribeSessionMessageEvents,
		restartRecoveryCandidates,
		nodeRegistry,
		nodeDesktopService,
		nodePresenceTimers,
		nodeSendToSession,
		nodeSendToAllSubscribed,
		nodeSubscribe,
		nodeUnsubscribe,
		nodeUnsubscribeAll,
		broadcastVoiceWakeChanged,
		broadcastVoiceWakeRoutingChanged,
		hasTalkNodeConnected,
		watchNodeHttpRuntime,
		terminalSessions,
		runtimeState,
		unavailableGatewayMethods,
		kernel,
		pluginHostServices,
		lifecycle,
		postReadyState,
		cronReconciliation,
		beginClosePrelude,
		runClosePrelude,
		getRuntimeSnapshot,
		startChannels,
		startChannel,
		stopChannel,
		markChannelLoggedOut,
		refreshGatewayHealthSnapshotWithRuntime,
		stopRegisteredPostReadySidecars,
		stopRegisteredGatewayLifetimeSidecars,
		createCloseHandler,
		clearFallbackGatewayContextForServer: {
			get: () => clearFallbackGatewayContextForServer,
			set: (cleanup) => {
				clearFallbackGatewayContextForServer = cleanup;
			}
		},
		closeOnStartupFailure
	};
}
//#endregion
//#region src/gateway/node-reapproval-coordinator.ts
const pendingNodeReapprovalAttempts = new KeyedAsyncQueue();
function normalizeFingerprintList(value) {
	return value ? [...new Set(value.map((entry) => entry.trim()).filter((entry) => entry.length > 0))].toSorted() : void 0;
}
function buildRequestFingerprint(input) {
	const permissions = input.permissions ? Object.fromEntries(Object.entries(input.permissions).toSorted(([left], [right]) => left.localeCompare(right))) : void 0;
	return JSON.stringify({
		nodeId: input.nodeId.trim(),
		clientId: input.clientId,
		clientMode: input.clientMode,
		displayName: input.displayName,
		platform: input.platform,
		version: input.version,
		coreVersion: input.coreVersion,
		uiVersion: input.uiVersion,
		deviceFamily: input.deviceFamily,
		modelIdentifier: input.modelIdentifier,
		caps: normalizeFingerprintList(input.caps),
		commands: normalizeFingerprintList(input.commands),
		permissions,
		remoteIp: input.remoteIp,
		silent: Boolean(input.silent)
	});
}
/** Creates the gateway-lifetime owner for paired-node reapproval write limits. */
function createNodeReapprovalCoordinator(config) {
	const limiter = createAuthRateLimiter({
		...config,
		exemptLoopback: false
	});
	const requestStates = /* @__PURE__ */ new Map();
	let disposed = false;
	const executeRequest = async ({ input, cleanupClaim, baseDir }) => {
		if (disposed) return null;
		const reused = await reusePendingNodePairingForReconnect(input, cleanupClaim, baseDir);
		if (reused) return reused;
		const identityKey = buildRateLimitIdentityKey("node", input.nodeId.trim());
		if (!limiter.check(identityKey, "node-reapproval").allowed) return null;
		const result = await requestNodePairing(input, baseDir);
		limiter.recordFailure(identityKey, AUTH_RATE_LIMIT_SCOPE_NODE_REAPPROVAL);
		return result;
	};
	const finishActiveRequest = (nodeId, state, fingerprint) => {
		if (requestStates.get(nodeId) !== state || state.activeFingerprint !== fingerprint) return;
		if (!state.queued) requestStates.delete(nodeId);
	};
	const startFirstRequest = (nodeId, state, request) => {
		pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${nodeId}`, async () => {
			try {
				request.deferred.resolve(await executeRequest(request.params));
			} catch (error) {
				request.deferred.reject(error);
			} finally {
				finishActiveRequest(nodeId, state, request.fingerprint);
			}
		});
	};
	const startQueuedRequest = (nodeId, state) => {
		pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${nodeId}`, async () => {
			const queued = state.queued;
			if (!queued) return;
			state.queued = void 0;
			state.activeFingerprint = queued.fingerprint;
			try {
				queued.deferred.resolve(await executeRequest(queued.params));
				for (const follower of queued.followers) follower.resolve(null);
			} catch (error) {
				queued.deferred.reject(error);
				for (const follower of queued.followers) follower.reject(error);
			} finally {
				finishActiveRequest(nodeId, state, queued.fingerprint);
			}
		});
	};
	return {
		request(params) {
			if (disposed) return Promise.resolve(null);
			const nodeId = params.input.nodeId.trim();
			const fingerprint = buildRequestFingerprint(params.input);
			const state = requestStates.get(nodeId);
			if (!state) {
				const deferred = createDeferredCore();
				const nextState = { activeFingerprint: fingerprint };
				requestStates.set(nodeId, nextState);
				startFirstRequest(nodeId, nextState, {
					fingerprint,
					params,
					deferred,
					followers: []
				});
				return deferred.promise;
			}
			if (state.queued?.fingerprint === fingerprint) {
				const follower = createDeferredCore();
				state.queued.params = params;
				state.queued.followers.push(follower);
				return follower.promise;
			}
			const deferred = createDeferredCore();
			if (state.queued) {
				state.queued.deferred.resolve(null);
				for (const follower of state.queued.followers) follower.resolve(null);
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
			} else {
				state.queued = {
					fingerprint,
					params,
					deferred,
					followers: []
				};
				startQueuedRequest(nodeId, state);
			}
			return deferred.promise;
		},
		async finalizeCleanup(claim) {
			return await pendingNodeReapprovalAttempts.enqueue(`node-reapproval:${claim.nodeId}`, async () => await finalizeNodePairingCleanupClaim(claim));
		},
		dispose() {
			disposed = true;
			for (const state of requestStates.values()) {
				state.queued?.deferred.resolve(null);
				for (const follower of state.queued?.followers ?? []) follower.resolve(null);
			}
			requestStates.clear();
			limiter.dispose();
		}
	};
}
//#endregion
//#region src/gateway/server-broadcast.ts
const EVENT_SCOPE_GUARDS = {
	agent: [READ_SCOPE],
	chat: [READ_SCOPE],
	"board.changed": [READ_SCOPE],
	"board.command": [READ_SCOPE],
	"ui.command": [READ_SCOPE],
	"chat.send_timing": [READ_SCOPE],
	"chat.side_result": [READ_SCOPE],
	cron: [READ_SCOPE],
	health: [],
	"exec.approval.requested": [APPROVALS_SCOPE],
	"exec.approval.resolved": [APPROVALS_SCOPE],
	"question.requested": [QUESTIONS_SCOPE],
	"question.resolved": [QUESTIONS_SCOPE],
	heartbeat: [],
	"plugin.approval.requested": [APPROVALS_SCOPE],
	"plugin.approval.resolved": [APPROVALS_SCOPE],
	"openclaw.approval.requested": [APPROVALS_SCOPE],
	"openclaw.approval.resolved": [APPROVALS_SCOPE],
	presence: [],
	shutdown: [],
	tick: [],
	"talk.event": [READ_SCOPE],
	"talk.mode": [TALK_SCOPE],
	task: [READ_SCOPE],
	"task.suggestion": [READ_SCOPE],
	"update.available": [],
	"config.changed": [READ_SCOPE],
	"skills.changed": [READ_SCOPE],
	"voicewake.changed": [READ_SCOPE],
	"voicewake.routing.changed": [READ_SCOPE],
	"device.pair.requested": [PAIRING_SCOPE],
	"device.pair.resolved": [PAIRING_SCOPE],
	"device.pair.setup.completed": [PAIRING_SCOPE],
	"device.pair.setup.deliveryUncertain": [PAIRING_SCOPE],
	"node.pair.requested": [PAIRING_SCOPE],
	"node.pair.resolved": [PAIRING_SCOPE],
	"node.presence": [READ_SCOPE],
	[GATEWAY_EVENT_NODE_RUNNER_INVENTORY_CHANGED]: [READ_SCOPE],
	"sessions.catalog.host": [READ_SCOPE],
	"sessions.changed": [READ_SCOPE],
	"controlUi.sessionPullRequests.changed": [READ_SCOPE],
	"session.approval": [APPROVALS_SCOPE],
	"session.message": [READ_SCOPE],
	"session.observer": [READ_SCOPE],
	"session.operation": [READ_SCOPE],
	"session.sharing": [READ_SCOPE],
	"session.suggestion": [READ_SCOPE],
	"session.typing": [READ_SCOPE],
	"session.tool": [READ_SCOPE],
	"terminal.data": [ADMIN_SCOPE],
	"terminal.exit": [ADMIN_SCOPE],
	"portal.changed": [READ_SCOPE]
};
const SESSION_SUBSCRIPTION_EVENTS = /* @__PURE__ */ new Set([
	"agent",
	"chat",
	"chat.side_result",
	"session.observer"
]);
function serializeFrameField(name, value) {
	const fieldJSON = JSON.stringify({ [name]: value });
	const keyJSON = JSON.stringify(name);
	const prefix = `{${keyJSON}:`;
	return fieldJSON.startsWith(prefix) ? `,${keyJSON}:${fieldJSON.slice(prefix.length, -1)}` : "";
}
function resolveBroadcastSessionScope(payload, explicit, explicitAgentId) {
	if (!payload || typeof payload !== "object" || Array.isArray(payload)) return {
		sessionKeys: explicit ?? [],
		...explicitAgentId ? { agentId: explicitAgentId } : {}
	};
	const record = payload;
	const source = [
		record,
		record.suggestion,
		record.request
	].find((candidate) => typeof candidate?.sessionKey === "string" && candidate.sessionKey.trim());
	const sessionKey = typeof source?.sessionKey === "string" ? source.sessionKey.trim() : "";
	const agentId = explicitAgentId ?? (typeof source?.agentId === "string" ? source.agentId.trim() || void 0 : void 0);
	return {
		sessionKeys: explicit?.length ? explicit : sessionKey ? [sessionKey] : [],
		...agentId ? { agentId } : {}
	};
}
function hasEventScope(client, event, explicitPluginScope) {
	if (client.connectionKind === "worker") return false;
	const role = client.connect.role ?? "operator";
	const scopes = Array.isArray(client.connect.scopes) ? client.connect.scopes : [];
	if (explicitPluginScope) {
		if (role !== "operator") return false;
		if (scopes.includes("operator.admin")) return true;
		return explicitPluginScope === "operator.read" ? scopes.includes("operator.read") || scopes.includes("operator.write") : explicitPluginScope === "operator.write" && scopes.includes("operator.write");
	}
	const required = EVENT_SCOPE_GUARDS[event];
	if (!required && event.startsWith("plugin.")) {
		if (role !== "operator") return false;
		return scopes.includes("operator.write") || scopes.includes("operator.admin");
	}
	if (!required) return false;
	if (required.length === 0) return true;
	if (role !== "operator") return false;
	if (scopes.includes("operator.admin")) return true;
	if (required.includes("operator.read")) return scopes.includes("operator.read") || scopes.includes("operator.write");
	if (required.includes("operator.talk")) return scopes.includes("operator.talk") || scopes.includes("operator.write");
	return required.some((scope) => scopes.includes(scope));
}
function createGatewayBroadcaster(params) {
	const clientSeq = /* @__PURE__ */ new WeakMap();
	const reportedSlowPayloadClients = /* @__PURE__ */ new WeakSet();
	const broadcastInternal = (event, payload, opts, targetConnIds, explicitPluginScope) => {
		if (event === "sessions.changed") queuePluginSessionsChanged(payload);
		if (params.clients.size === 0) return;
		const { sessionKeys, agentId } = resolveBroadcastSessionScope(payload, opts?.sessionKeys, opts?.agentId);
		const isTargeted = Boolean(targetConnIds);
		if (shouldLogWs()) {
			const logMeta = {
				event,
				seq: isTargeted ? "targeted" : "per-client",
				clients: params.clients.size,
				targets: targetConnIds ? targetConnIds.size : void 0,
				dropIfSlow: opts?.dropIfSlow,
				presenceVersion: opts?.stateVersion?.presence,
				healthVersion: opts?.stateVersion?.health
			};
			if (event === "agent") Object.assign(logMeta, summarizeAgentEventForWsLog(payload));
			logWs("out", "event", logMeta);
		}
		let frameBase;
		const getFrameBase = () => {
			if (!frameBase) frameBase = {
				eventJSON: JSON.stringify(event),
				payloadFragment: serializeFrameField("payload", payload),
				stateVersionFragment: opts?.stateVersion === void 0 ? "" : serializeFrameField("stateVersion", opts.stateVersion)
			};
			return frameBase;
		};
		const sessionSubscriptionVerified = opts?.sessionSubscriptionVerified === true;
		for (const c of params.clients) {
			if (c.invalidated === true) continue;
			if (targetConnIds && !targetConnIds.has(c.connId)) continue;
			if (!hasEventScope(c, event, explicitPluginScope)) continue;
			if (sessionKeys.length > 0 && params.canReceiveSessionEvent && !params.canReceiveSessionEvent(c, sessionKeys, agentId, event, payload)) continue;
			if ((event === "session.typing" || (isBrowserCopilotClient(c.connect.client) || hasGatewayClientCap(c.connect.caps, GATEWAY_CLIENT_CAPS.SESSION_SCOPED_EVENTS)) && SESSION_SUBSCRIPTION_EVENTS.has(event)) && !(isTargeted && sessionSubscriptionVerified) && (!sessionKeys.length || !sessionKeys.some((sessionKey) => params.sessionMessageSubscribers?.get(sessionKey).has(c.connId)))) continue;
			const nextSeq = (clientSeq.get(c) ?? 0) + 1;
			const slow = c.socket.bufferedAmount > MAX_BUFFERED_BYTES;
			if (!slow) reportedSlowPayloadClients.delete(c);
			else if (!reportedSlowPayloadClients.has(c)) {
				reportedSlowPayloadClients.add(c);
				logRejectedLargePayload({
					surface: "gateway.ws.outbound_buffer",
					bytes: c.socket.bufferedAmount,
					limitBytes: MAX_BUFFERED_BYTES,
					reason: opts?.dropIfSlow ? "ws_send_buffer_drop" : "ws_send_buffer_close"
				});
			}
			if (slow && opts?.dropIfSlow) {
				if (!isTargeted) clientSeq.set(c, nextSeq);
				continue;
			}
			if (slow) {
				try {
					c.socket.close(1008, "slow consumer");
				} catch {}
				continue;
			}
			try {
				const eventSeq = isTargeted ? void 0 : nextSeq;
				if (!isTargeted) clientSeq.set(c, nextSeq);
				const base = getFrameBase();
				const seqFragment = eventSeq === void 0 ? "" : `,"seq":${eventSeq}`;
				const frame = `{"type":"event","event":${base.eventJSON}${base.payloadFragment}${seqFragment}${base.stateVersionFragment}}`;
				c.socket.send(frame);
			} catch {}
		}
	};
	const broadcast = (event, payload, opts) => broadcastInternal(event, payload, opts);
	const broadcastToConnIds = (event, payload, connIds, opts) => {
		broadcastInternal(event, payload, opts, connIds);
	};
	const getBufferedAmount = (connId) => {
		for (const client of params.clients) if (client.connId === connId) return client.socket.bufferedAmount;
	};
	const broadcastPluginEvent = (event, payload, scope) => {
		if (!event.startsWith("plugin.") || event.startsWith("plugin.approval.")) throw new Error(`invalid plugin gateway event: ${event}`);
		if (scope !== "operator.read" && scope !== "operator.write" && scope !== "operator.admin") throw new Error("invalid plugin gateway event scope");
		broadcastInternal(event, payload, void 0, void 0, scope);
	};
	return {
		broadcast,
		broadcastToConnIds,
		broadcastPluginEvent,
		getBufferedAmount
	};
}
//#endregion
//#region src/gateway/server-connection-state.ts
/** Creates transport-independent connection, subscription, and run state. */
function createGatewayConnectionState(params) {
	const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
	const clients = /* @__PURE__ */ new Set();
	const sessionEventSubscribers = createSessionEventSubscriberRegistry();
	const sessionMessageSubscribers = createSessionMessageSubscriberRegistry();
	const gatewayBroadcaster = createGatewayBroadcaster({
		clients,
		sessionMessageSubscribers,
		canReceiveSessionEvent: (client, sessionKeys, agentId, event, payload) => canReceiveSessionEvent({
			cfg: loadRuntimeConfig(),
			client,
			sessionKeys,
			agentId,
			event,
			payload
		})
	});
	const agentRunSeq = /* @__PURE__ */ new Map();
	const dedupe = /* @__PURE__ */ new Map();
	const chatRunState = createChatRunState();
	const chatRunRegistry = chatRunState.registry;
	const addChatRun = chatRunRegistry.add;
	const removeChatRun = chatRunRegistry.remove;
	const chatAbortControllers = /* @__PURE__ */ new Map();
	const chatQueuedTurns = /* @__PURE__ */ new Map();
	const toolEventRecipients = chatRunState.toolEventRecipients;
	return {
		clients,
		...gatewayBroadcaster,
		agentRunSeq,
		dedupe,
		chatRunState,
		addChatRun,
		removeChatRun,
		chatAbortControllers,
		chatQueuedTurns,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers
	};
}
//#endregion
//#region src/gateway/server-control-ui-root.ts
function resolveAutoRoot() {
	return resolveControlUiRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
}
function createResolvedRootState(root, configured = false) {
	return {
		kind: !configured && isPackageProvenControlUiRootSync(root, {
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			cwd: process.cwd()
		}) ? "bundled" : "resolved",
		path: root,
		realPath: fs.realpathSync(root)
	};
}
function prepareResolvedRootState(params) {
	try {
		return createResolvedRootState(params.root, params.configured);
	} catch (error) {
		const detail = error instanceof Error ? error.message : String(error);
		const message = `Control UI assets are unavailable at ${params.root}: ${detail}`;
		params.log.warn(`gateway: ${message}`);
		return params.configured ? {
			kind: "invalid",
			path: path.resolve(params.root)
		} : { kind: "failed" };
	}
}
/** Prepare the stable root reference shared by every HTTP listener. */
function createGatewayControlUiRootLifecycle(params) {
	let state;
	if (params.controlUiRootOverride) {
		const resolvedOverride = resolveControlUiRootOverrideSync(params.controlUiRootOverride);
		const resolvedOverridePath = path.resolve(params.controlUiRootOverride);
		if (!resolvedOverride) {
			params.log.warn(`gateway: controlUi.root not found at ${resolvedOverridePath}`);
			state = {
				kind: "invalid",
				path: resolvedOverridePath
			};
		} else state = prepareResolvedRootState({
			root: resolvedOverride,
			configured: true,
			log: params.log
		});
	} else if (params.controlUiEnabled) {
		const resolvedRoot = resolveAutoRoot();
		state = resolvedRoot && isControlUiStartupAssetsReady(resolvedRoot) ? prepareResolvedRootState({
			root: resolvedRoot,
			log: params.log
		}) : { kind: "preparing" };
	}
	let buildPromise;
	const start = (isStopped, signal) => {
		if (state?.kind !== "preparing" || isStopped() || signal.aborted) return Promise.resolve();
		const preparingState = state;
		buildPromise ??= (async () => {
			try {
				const result = await ensureControlUiAssetsBuilt(params.gatewayRuntime, { signal });
				if (isStopped() || signal.aborted) return;
				if (!result.ok) {
					const message = result.message ?? "Control UI assets could not be built.";
					Object.assign(preparingState, { kind: "failed" });
					params.log.warn(`gateway: ${message}`);
					return;
				}
				const resolvedRoot = resolveAutoRoot();
				if (!resolvedRoot || !isControlUiStartupAssetsReady(resolvedRoot)) {
					const message = resolvedRoot ? `Control UI assets at ${resolvedRoot} remain incomplete. Run \`openclaw doctor --fix\` or reinstall OpenClaw.` : "Control UI build completed, but its assets are still unavailable. Run `pnpm ui:build`.";
					Object.assign(preparingState, { kind: "failed" });
					params.log.warn(`gateway: ${message}`);
					return;
				}
				Object.assign(preparingState, createResolvedRootState(resolvedRoot));
			} catch (error) {
				if (isStopped() || signal.aborted) return;
				const message = `Control UI assets build failed: ${error instanceof Error ? error.message : String(error)}`;
				Object.assign(preparingState, { kind: "failed" });
				params.log.warn(`gateway: ${message}`);
			}
		})();
		return buildPromise;
	};
	return {
		state,
		start,
		stop: async () => {
			await buildPromise;
		}
	};
}
//#endregion
//#region src/gateway/server-resident-registry.ts
/** Records resident lifecycle owners without changing when callers start or stop them. */
function createGatewayResidentRegistry() {
	const residents = [];
	const names = /* @__PURE__ */ new Set();
	return {
		register: (resident) => {
			if (names.has(resident.name)) throw new Error(`Gateway resident already registered: ${resident.name}`);
			names.add(resident.name);
			residents.push(resident);
			return resident;
		},
		list: () => residents
	};
}
//#endregion
//#region src/gateway/server-transport-bridge.ts
/** Late-bound transport facts consumed by the socket-free Gateway kernel. */
function createGatewayTransportBridge() {
	let current;
	return {
		attach: (transport) => {
			current = transport;
		},
		current: () => current,
		getPortalService: () => current?.portalService,
		getWorkerIngressEndpoint: () => current?.getWorkerIngressEndpoint(),
		getMcpAppSandboxPort: () => current?.getMcpAppSandboxPort(),
		ensureSandboxHostPort: async () => {
			if (!current) throw new Error("Gateway listener must start before the sandbox host");
			return await current.ensureSandboxHostPort();
		}
	};
}
//#endregion
//#region src/gateway/server-wizard-sessions.ts
const UNCOLLECTED_TERMINAL_RETENTION_MS = 300 * 1e3;
/** Creates the in-memory tracker used for active Gateway wizard sessions. */
function createWizardSessionTracker(options) {
	const wizardSessions = /* @__PURE__ */ new Map();
	const terminalSince = /* @__PURE__ */ new Map();
	const now = options?.now ?? Date.now;
	const findRunningWizard = () => {
		for (const [id, session] of wizardSessions) {
			if (!session.isSettled()) {
				terminalSince.delete(id);
				return id;
			}
			const observedAt = terminalSince.get(id);
			if (observedAt === void 0) terminalSince.set(id, now());
			else if (now() - observedAt >= UNCOLLECTED_TERMINAL_RETENTION_MS) {
				wizardSessions.delete(id);
				terminalSince.delete(id);
			}
		}
		return null;
	};
	const purgeWizardSession = (id) => {
		const session = wizardSessions.get(id);
		if (!session) return;
		if (!session.isSettled()) return;
		wizardSessions.delete(id);
		terminalSince.delete(id);
	};
	return {
		wizardSessions,
		findRunningWizard,
		purgeWizardSession
	};
}
//#endregion
//#region src/gateway/server/event-loop-health.ts
const EVENT_LOOP_MONITOR_RESOLUTION_MS = 20;
const EVENT_LOOP_DELAY_WARN_MS = 1e3;
const EVENT_LOOP_UTILIZATION_WARN = .95;
const CPU_CORE_RATIO_WARN = .9;
const PERSISTENT_DEGRADATION_WARN_AFTER_MS = 6e4;
const LOAD_DEGRADATION_DELAY_COEVIDENCE_MS = 25;
const SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS = 1e3;
function roundMetric(value, digits = 3) {
	if (!Number.isFinite(value)) return 0;
	const factor = 10 ** digits;
	return Math.round(value * factor) / factor;
}
function nanosecondsToMilliseconds(value) {
	return roundMetric(value / 1e6, 1);
}
function classifyGatewayEventLoopHealthReasons(metrics) {
	const reasons = [];
	if (metrics.delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || metrics.delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) reasons.push("event_loop_delay");
	if (metrics.intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return reasons;
	if (!(metrics.delayP99Ms >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS || metrics.delayMaxMs >= LOAD_DEGRADATION_DELAY_COEVIDENCE_MS)) return reasons;
	if (metrics.utilization >= EVENT_LOOP_UTILIZATION_WARN) reasons.push("event_loop_utilization");
	if (metrics.cpuCoreRatio >= CPU_CORE_RATIO_WARN) reasons.push("cpu");
	return reasons;
}
function createGatewayEventLoopHealthMonitor(deps = {}) {
	const nowMs = deps.now ?? performance.now.bind(performance);
	const readCpuUsage = deps.cpuUsage ?? process.cpuUsage.bind(process);
	const readEventLoopUtilization = deps.eventLoopUtilization ?? performance.eventLoopUtilization.bind(performance);
	const createDelayMonitor = deps.createDelayMonitor ?? ((resolutionMs) => monitorEventLoopDelay({ resolution: resolutionMs }));
	let monitor = null;
	let lastWallAt = nowMs();
	let lastCpuUsage = readCpuUsage();
	let lastEventLoopUtilization = readEventLoopUtilization();
	let lastSnapshot;
	let firstDegradedAtMs = null;
	try {
		monitor = createDelayMonitor(EVENT_LOOP_MONITOR_RESOLUTION_MS);
		monitor.enable();
		monitor.reset();
	} catch {
		monitor = null;
	}
	const snapshot = () => {
		if (!monitor || !lastCpuUsage || !lastEventLoopUtilization || lastWallAt === null) return;
		const now = nowMs();
		const intervalMs = Math.max(1, now - lastWallAt);
		const delayP99Ms = nanosecondsToMilliseconds(monitor.percentile(99));
		const delayMaxMs = nanosecondsToMilliseconds(monitor.max);
		if (!(delayP99Ms >= EVENT_LOOP_DELAY_WARN_MS || delayMaxMs >= EVENT_LOOP_DELAY_WARN_MS) && intervalMs < SUSTAINED_LOAD_SAMPLE_MIN_INTERVAL_MS) return lastSnapshot;
		const cpuUsage = readCpuUsage(lastCpuUsage);
		const currentEventLoopUtilization = readEventLoopUtilization();
		const utilization = roundMetric(readEventLoopUtilization(currentEventLoopUtilization, lastEventLoopUtilization).utilization);
		const cpuCoreRatio = roundMetric(roundMetric((cpuUsage.user + cpuUsage.system) / 1e3, 1) / intervalMs);
		const reasons = classifyGatewayEventLoopHealthReasons({
			intervalMs,
			delayP99Ms,
			delayMaxMs,
			utilization,
			cpuCoreRatio
		});
		const degraded = reasons.length > 0;
		if (degraded) firstDegradedAtMs ??= now;
		else firstDegradedAtMs = null;
		const health = {
			degraded,
			degradedSinceMs: firstDegradedAtMs === null ? null : Math.max(0, Math.round(now - firstDegradedAtMs)),
			reasons,
			intervalMs,
			delayP99Ms,
			delayMaxMs,
			utilization,
			cpuCoreRatio
		};
		monitor.reset();
		lastWallAt = now;
		lastCpuUsage = readCpuUsage();
		lastEventLoopUtilization = currentEventLoopUtilization;
		lastSnapshot = health;
		return health;
	};
	const reset = () => {
		monitor?.reset();
		lastWallAt = nowMs();
		lastCpuUsage = readCpuUsage();
		lastEventLoopUtilization = readEventLoopUtilization();
		lastSnapshot = void 0;
		firstDegradedAtMs = null;
	};
	return {
		snapshot,
		persistentDegradationSnapshot: () => {
			const current = snapshot();
			return current?.degradedSinceMs != null && current.degradedSinceMs >= PERSISTENT_DEGRADATION_WARN_AFTER_MS ? current : void 0;
		},
		reset,
		stop: () => {
			monitor?.disable();
			monitor = null;
			lastWallAt = null;
			lastCpuUsage = null;
			lastEventLoopUtilization = null;
			lastSnapshot = void 0;
			firstDegradedAtMs = null;
		}
	};
}
//#endregion
//#region src/gateway/server/readiness.ts
const DEFAULT_READINESS_CACHE_TTL_MS = 1e3;
/** Create a startup checker that excludes downstream channel health. */
function createStartupChecker(deps) {
	return () => {
		const uptimeMs = Date.now() - deps.startedAt;
		if (deps.getGatewayDraining?.()) return {
			ok: false,
			status: "draining",
			uptimeMs
		};
		if (deps.getStartupPending?.()) return {
			ok: false,
			status: "starting",
			uptimeMs,
			pendingReason: deps.getStartupPendingReason?.() ?? "startup-sidecars"
		};
		return {
			ok: true,
			status: "started",
			uptimeMs
		};
	};
}
function shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed) {
	if (health.reason === "unmanaged" || health.reason === "stale-socket") return true;
	if (autostartSuppressed && health.reason === "not-running") return true;
	const restartableReason = health.reason === "not-running" || health.reason === "ingress-unavailable";
	const inRestartHandoff = accountSnapshot.restartPending === true && accountSnapshot.running !== true;
	return restartableReason && inRestartHandoff;
}
/** Create a cached readiness checker over channel runtime health. */
function createReadinessChecker(deps) {
	const { channelManager, startedAt } = deps;
	const getStartup = createStartupChecker(deps);
	const cacheTtlMs = Math.max(0, deps.cacheTtlMs ?? DEFAULT_READINESS_CACHE_TTL_MS);
	let cachedAt = 0;
	let cachedState = null;
	return () => {
		const startup = getStartup();
		const uptimeMs = startup.uptimeMs;
		const now = startedAt + uptimeMs;
		if (startup.status === "starting") return withEventLoopHealth({
			ready: false,
			failing: [startup.pendingReason],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (startup.status === "draining") return withEventLoopHealth({
			ready: false,
			failing: ["gateway-draining"],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (deps.shouldSkipChannelReadiness?.()) return withEventLoopHealth({
			ready: true,
			failing: [],
			uptimeMs
		}, deps.getEventLoopHealth);
		if (cachedState && now - cachedAt < cacheTtlMs) return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
		const snapshot = channelManager.getRuntimeSnapshot();
		const globallyAutostartSuppressed = channelManager.getAutostartSuppression() !== null;
		const failing = [];
		const suppressed = [];
		for (const [channelId, accounts] of Object.entries(snapshot.channelAccounts)) {
			if (!accounts) continue;
			const autostartSuppressed = globallyAutostartSuppressed || channelManager.isAmbientAutostartSuppressed(channelId);
			for (const accountSnapshot of Object.values(accounts)) {
				if (!accountSnapshot) continue;
				const health = evaluateChannelHealth(accountSnapshot, {
					now,
					staleEventThresholdMs: DEFAULT_CHANNEL_STALE_EVENT_THRESHOLD_MS,
					channelConnectGraceMs: DEFAULT_CHANNEL_CONNECT_GRACE_MS,
					channelId
				});
				if (!health.healthy && autostartSuppressed && health.reason === "not-running") {
					if (!suppressed.includes(channelId)) suppressed.push(channelId);
					continue;
				}
				if (!health.healthy && !shouldIgnoreReadinessFailure(accountSnapshot, health, autostartSuppressed)) {
					failing.push(channelId);
					break;
				}
			}
		}
		cachedAt = now;
		cachedState = {
			ready: failing.length === 0,
			failing,
			...suppressed.length > 0 ? { suppressed } : {}
		};
		return withEventLoopHealth({
			...cachedState,
			uptimeMs
		}, deps.getEventLoopHealth);
	};
}
function withEventLoopHealth(result, getEventLoopHealth) {
	const eventLoop = getEventLoopHealth?.();
	return eventLoop ? {
		...result,
		eventLoop
	} : result;
}
//#endregion
//#region src/gateway/server-runtime-state-prepare.ts
function createGatewayAuthRateLimiters(rateLimitConfig) {
	return {
		rateLimiter: createAuthRateLimiter(rateLimitConfig ?? {}),
		browserRateLimiter: createAuthRateLimiter({
			...rateLimitConfig,
			exemptLoopback: false
		})
	};
}
function listGatewayStartupChannelPlugins() {
	return listLoadedChannelPlugins();
}
async function prepareGatewayKernelState(params) {
	const { bootstrap, port, opts, log, logChannels, logHooks, logPlugins, gatewayRuntime, resolveChannelRuntime: getChannelRuntime, loadWorkerEnvironmentStartupModule, loadWorkerPlacementStartupModule } = params;
	const { pluginBootstrap, gatewayPluginConfigAtStart, workerEnvironmentStartup, startupTrace, cfgAtStart, resolvedStartupAuthOverride, startupTailscaleOverride, ambientAutostartSuppressedChannelIds, minimalTestGateway } = bootstrap;
	const pluginRuntime = {
		registry: pluginBootstrap.pluginRegistry,
		baseGatewayMethods: pluginBootstrap.baseGatewayMethods
	};
	const shouldStartWorkerEnvironmentService = Boolean(workerEnvironmentStartup);
	const hostDesktopConfig = gatewayPluginConfigAtStart.desktop?.host;
	const hostDesktopEnabled = hostDesktopConfig?.enabled === true;
	const nodeCommandConfig = gatewayPluginConfigAtStart.gateway?.nodes?.commands;
	const nodeDesktopObserveAvailable = (nodeCommandConfig?.allow ?? []).some((command) => command.trim() === "desktop.stream") && !(nodeCommandConfig?.deny ?? []).some((command) => command.trim() === "desktop.stream");
	const workerGatewayEndpoint = { resolve: (() => void 0) };
	const desktopSessionRegistry = shouldStartWorkerEnvironmentService || hostDesktopEnabled || nodeDesktopObserveAvailable ? createDesktopSessionRegistry() : void 0;
	const nodeDesktopStreamBroker = nodeDesktopObserveAvailable ? (await startupTrace.measure("node-desktop.runtime-import", () => import("./node-stream-broker-C7z207Le.js"))).createNodeDesktopStreamBroker() : void 0;
	const hostDesktopService = hostDesktopConfig && hostDesktopEnabled && desktopSessionRegistry ? (await startupTrace.measure("host-desktop.runtime-import", () => import("./host-source-CLFKhKtI.js"))).createHostDesktopService({
		config: hostDesktopConfig,
		registry: desktopSessionRegistry
	}) : void 0;
	const workerEnvironmentRuntime = workerEnvironmentStartup && desktopSessionRegistry ? await startupTrace.measure("worker-environments.runtime-imports", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).createGatewayWorkerEnvironmentRuntime({
			getPluginRegistry: () => pluginRuntime.registry,
			resolveWorkerGateway: () => workerGatewayEndpoint.resolve(),
			desktopSessionRegistry,
			startup: workerEnvironmentStartup,
			log
		});
	}) : {};
	const { workerEnvironmentService, workerLiveEvents, nodeWorkerGatewayNamespace, bindDeviceNodeControl, bindNodeWorkspaceBindingResolver, handleNodeWorkspaceTransferRequest } = workerEnvironmentRuntime;
	const workerDispatchAuthority = { revoke: (_params) => {
		throw new Error("Worker dispatch authority revocation is not ready");
	} };
	const workerPlacementRuntime = workerEnvironmentService && workerEnvironmentStartup && nodeWorkerGatewayNamespace ? await startupTrace.measure("worker-environments.placement-runtime", async () => {
		return (await loadWorkerPlacementStartupModule()).createGatewayWorkerPlacementRuntime({
			placements: workerEnvironmentStartup.placementStore,
			environments: workerEnvironmentService,
			gatewayNamespace: nodeWorkerGatewayNamespace,
			admitNewPlacements: true,
			revokeSessionAuthority: (request) => workerDispatchAuthority.revoke(request),
			warn: (message) => log.warn(message)
		});
	}) : void 0;
	if (workerPlacementRuntime) {
		bindNodeWorkspaceBindingResolver?.(workerPlacementRuntime.resolveNodeWorkspaceBinding);
		workerEnvironmentRuntime.bindWorkerSessionDispatch?.(workerPlacementRuntime.dispatchService.dispatch);
	}
	const bindDeviceNodeRuntime = bindDeviceNodeControl ? (transport) => {
		bindDeviceNodeControl(transport);
		workerPlacementRuntime?.bindNodeWorkerSupervisorTransport(transport);
	} : void 0;
	const workerPlacementControlAvailable = workerPlacementRuntime?.dispatchService;
	const workerPlacementDispatchAvailable = workerPlacementControlAvailable;
	const workerDesktopObserveAvailable = Boolean(workerEnvironmentService) && gatewayPluginConfigAtStart.cloudWorkers?.desktop === true;
	const desktopObserveAvailable = workerDesktopObserveAvailable || nodeDesktopObserveAvailable || Boolean(hostDesktopService);
	const channelLogs = Object.fromEntries(listGatewayStartupChannelPlugins().map((plugin) => [plugin.id, logChannels.child(plugin.id)]));
	const channelRuntimeEnvs = Object.fromEntries(Object.entries(channelLogs).map(([id, logger]) => [id, runtimeForLogger(logger)]));
	const listStartupChannelGatewayMethods = () => {
		const methods = [];
		for (const plugin of listGatewayStartupChannelPlugins()) {
			methods.push(...plugin.gatewayMethods ?? []);
			for (const descriptor of plugin.gatewayMethodDescriptors ?? []) methods.push(descriptor.name);
		}
		return methods;
	};
	const listActiveGatewayMethods = (nextBaseGatewayMethods) => uniqueStrings([...nextBaseGatewayMethods, ...listStartupChannelGatewayMethods()]).filter((method) => (workerPlacementDispatchAvailable || method !== "sessions.dispatch") && (workerPlacementControlAvailable || method !== "sessions.reclaim") && (desktopObserveAvailable || method !== "desktop.observe") && (workerDesktopObserveAvailable || method !== "desktop.launch" && method !== "worker.desktop.observe" && method !== "worker.desktop.launch"));
	const runtimeConfig = await startupTrace.measure("runtime.config", async () => {
		const { resolveGatewayRuntimeConfig } = await import("./server-runtime-config-DdLg_fz6.js");
		return resolveGatewayRuntimeConfig({
			cfg: cfgAtStart,
			port,
			bind: opts.bind,
			host: opts.host,
			controlUiEnabled: opts.controlUiEnabled,
			openAiChatCompletionsEnabled: opts.openAiChatCompletionsEnabled,
			openResponsesEnabled: opts.openResponsesEnabled,
			auth: resolvedStartupAuthOverride,
			tailscale: startupTailscaleOverride
		});
	});
	const { bindHost, controlUiEnabled, openAiChatCompletionsEnabled, openAiChatCompletionsConfig, openResponsesEnabled, openResponsesConfig, strictTransportSecurityHeader, controlUiBasePath, controlUiRoot: controlUiRootOverride, resolvedAuth, tailscaleConfig, tailscaleMode } = runtimeConfig;
	if (bootstrap.generatedStartupAuthToken && isLoopbackHost(bindHost)) {
		const { ensureStartupLocalCliPairing } = await import("./startup-local-cli-pairing-BUjBMHrv.js");
		const pairingResult = await startupTrace.measure("runtime.local-cli-pairing", () => ensureStartupLocalCliPairing());
		if (pairingResult === "created") log.info("runtime-only gateway auth paired the local CLI device before readiness");
		else if (pairingResult === "unavailable") log.warn("runtime-only gateway auth could not prepare local CLI device credentials; configure gateway.auth.token or gateway.auth.password for CLI access");
	}
	const getResolvedAuth = () => resolveGatewayAuth({
		authConfig: getActiveSecretsRuntimeConfigSnapshot()?.config.gateway?.auth ?? getRuntimeConfig().gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	});
	const resolveSharedGatewaySessionGenerationForConfig = (config) => resolveSharedGatewaySessionGeneration(resolveGatewayAuth({
		authConfig: config.gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	}), config.gateway?.trustedProxies);
	const resolveCurrentSharedGatewaySessionGeneration = () => resolveSharedGatewaySessionGeneration(getResolvedAuth(), getRuntimeConfig().gateway?.trustedProxies);
	const resolveSharedGatewaySessionGenerationForRuntimeSnapshot = () => resolveSharedGatewaySessionGeneration(resolveGatewayAuth({
		authConfig: getRuntimeConfig().gateway?.auth,
		authOverride: resolvedStartupAuthOverride,
		env: process.env,
		tailscaleMode
	}), getRuntimeConfig().gateway?.trustedProxies);
	const sharedGatewaySessionGenerationState = {
		current: resolveCurrentSharedGatewaySessionGeneration(),
		required: null
	};
	const preauthHandshakeTimeoutMs = void 0;
	const initialHooksConfig = runtimeConfig.hooksConfig;
	const initialHookClientIpConfig = resolveHookClientIpConfig(cfgAtStart);
	const rateLimitConfig = cfgAtStart.gateway?.auth?.rateLimit;
	const { rateLimiter: authRateLimiter, browserRateLimiter: browserAuthRateLimiter } = createGatewayAuthRateLimiters(rateLimitConfig);
	const nodeReapprovalCoordinator = createNodeReapprovalCoordinator(rateLimitConfig);
	const controlUiRootLifecycle = await startupTrace.measure("control-ui.root", () => createGatewayControlUiRootLifecycle({
		controlUiRootOverride,
		controlUiEnabled,
		gatewayRuntime,
		log
	}));
	const { createTerminalLaunchPolicy } = await import("./launch-Bq8wjCNn.js");
	const terminalLaunchPolicy = createTerminalLaunchPolicy(cfgAtStart);
	const { runDefaultChannelSetupWizard, runDefaultSetupWizard } = await import("./wizard-BkaWhd4l.js");
	const wizardRunner = opts.wizardRunner ?? runDefaultSetupWizard;
	const channelWizardRunner = opts.channelWizardRunner ?? runDefaultChannelSetupWizard;
	const { wizardSessions, findRunningWizard, purgeWizardSession } = createWizardSessionTracker();
	const systemAgentSessions = /* @__PURE__ */ new Map();
	const deps = createDefaultDeps();
	const residentRegistry = createGatewayResidentRegistry();
	const runtimeStateRef = { current: null };
	const cronStartState = { handled: false };
	const gatewayTls = await startupTrace.measure("tls.runtime", () => loadGatewayTlsRuntime(cfgAtStart.gateway?.tls, log.child("tls")));
	const serverStartedAt = Date.now();
	const eventLoopHealthState = {};
	const readinessEventLoopHealth = residentRegistry.register({
		name: "event-loop-health",
		start: () => {
			eventLoopHealthState.current ??= createGatewayEventLoopHealthMonitor();
			return eventLoopHealthState.current;
		},
		stop: () => eventLoopHealthState.current?.stop()
	}).start();
	const startupState = {
		sidecarsReady: minimalTestGateway,
		pendingReason: "startup-sidecars",
		dispatchReady: false
	};
	let releaseStartupAccountStarts = () => {};
	const startupAccountStartsReady = new Promise((resolve) => {
		releaseStartupAccountStarts = resolve;
	});
	const gatewayInstanceRuntimeRef = { current: void 0 };
	const { createChannelManager } = await import("./server-channels-CpaTv8jF.js");
	const channelManager = createChannelManager({
		getRuntimeConfig: () => {
			return resolveGatewayPluginConfig({ config: getRuntimeConfig() });
		},
		channelLogs,
		channelRuntimeEnvs,
		resolveChannelRuntime: getChannelRuntime,
		getPluginHttpRouteRegistry: () => pluginRuntime.registry,
		startupTrace,
		deferStartupAccountStartsUntil: startupAccountStartsReady,
		getNativeApprovalRuntime: () => gatewayInstanceRuntimeRef.current?.nativeApprovals,
		ambientAutostartSuppressedChannelIds,
		...opts.tryRecoverChannelAutostartSuppression ? { tryRecoverAutostartSuppression: opts.tryRecoverChannelAutostartSuppression } : {}
	});
	channelManager.setAutostartSuppression(opts.channelAutostartSuppression ?? null);
	const sidecarStartup = opts.sidecarStartup ?? "start";
	const isGatewayStartupPending = () => !startupState.sidecarsReady && sidecarStartup === "start";
	const startupCheckerDeps = {
		startedAt: serverStartedAt,
		getStartupPending: isGatewayStartupPending,
		getStartupPendingReason: () => startupState.pendingReason,
		getGatewayDraining: isGatewayDraining
	};
	const getStartup = createStartupChecker(startupCheckerDeps);
	const getReadiness = createReadinessChecker({
		channelManager,
		...startupCheckerDeps,
		getEventLoopHealth: readinessEventLoopHealth.snapshot,
		shouldSkipChannelReadiness: () => isTruthyEnvValue(process.env.OPENCLAW_SKIP_CHANNELS) || isTruthyEnvValue(process.env.OPENCLAW_SKIP_PROVIDERS)
	});
	const pluginGatewayContext = { current: void 0 };
	const watchNodeRequestHandler = {};
	log.info("starting HTTP server...");
	const connectionState = await startupTrace.measure("runtime.state", () => createGatewayConnectionState({
		cfg: cfgAtStart,
		getRuntimeConfig
	}));
	const transportBridge = createGatewayTransportBridge();
	const createHttpTransportOptions = () => ({
		cfg: cfgAtStart,
		getRuntimeConfig,
		bindHost,
		port,
		controlUiEnabled,
		controlUiBasePath,
		controlUiRoot: controlUiRootLifecycle.state,
		openAiChatCompletionsEnabled,
		openAiChatCompletionsConfig,
		openResponsesEnabled,
		openResponsesConfig,
		strictTransportSecurityHeader,
		resolvedAuth,
		rateLimiter: authRateLimiter,
		joinRateLimiter: browserAuthRateLimiter,
		isTerminalEnabled: terminalLaunchPolicy.isEnabled,
		gatewayTls,
		getResolvedAuth,
		hooksConfig: () => runtimeStateRef.current?.hooksConfig ?? initialHooksConfig,
		getHookClientIpConfig: () => runtimeStateRef.current?.hookClientIpConfig ?? initialHookClientIpConfig,
		pluginRegistry: pluginRuntime.registry,
		getPluginRouteRegistry: () => pluginRuntime.registry,
		isStartupPluginRuntimeReady: () => startupState.sidecarsReady,
		getGatewayRequestContext: () => pluginGatewayContext.current,
		deps,
		log,
		logHooks,
		logPlugins,
		getReadiness,
		getStartup,
		handleWatchNodeRequest: async (req, res) => await watchNodeRequestHandler.current?.(req, res) ?? false,
		handleNodeWorkspaceTransferRequest,
		workerIngressEnabled: Boolean(workerEnvironmentService),
		desktopSessionRegistry,
		nodeDesktopStreamBroker,
		clients: connectionState.clients
	});
	const { clients, broadcast, broadcastToConnIds, broadcastPluginEvent, getBufferedAmount, agentRunSeq, dedupe, chatRunState, addChatRun, removeChatRun, chatAbortControllers, chatQueuedTurns, toolEventRecipients, sessionEventSubscribers, sessionMessageSubscribers } = connectionState;
	return {
		...bootstrap,
		pluginRuntime,
		workerEnvironmentService,
		workerLiveEvents,
		bindDeviceNodeControl: bindDeviceNodeRuntime,
		workerDispatchAuthority,
		workerPlacementRuntime,
		workerPlacementControlAvailable,
		workerPlacementDispatchAvailable,
		workerDesktopObserveAvailable,
		desktopObserveAvailable,
		desktopSessionRegistry,
		nodeDesktopObserveAvailable,
		nodeDesktopStreamBroker,
		hostDesktopService,
		channelLogs,
		channelRuntimeEnvs,
		listStartupChannelGatewayMethods,
		listActiveGatewayMethods,
		bindHost,
		controlUiEnabled,
		controlUiRootLifecycle,
		openAiChatCompletionsEnabled,
		openAiChatCompletionsConfig,
		openResponsesEnabled,
		openResponsesConfig,
		strictTransportSecurityHeader,
		controlUiBasePath,
		resolvedAuth,
		tailscaleConfig,
		tailscaleMode,
		getResolvedAuth,
		resolveSharedGatewaySessionGenerationForConfig,
		resolveSharedGatewaySessionGenerationForRuntimeSnapshot,
		sharedGatewaySessionGenerationState,
		preauthHandshakeTimeoutMs,
		initialHooksConfig,
		initialHookClientIpConfig,
		authRateLimiter,
		browserAuthRateLimiter,
		nodeReapprovalCoordinator,
		terminalLaunchPolicy,
		wizardRunner,
		channelWizardRunner,
		wizardSessions,
		findRunningWizard,
		purgeWizardSession,
		systemAgentSessions,
		deps,
		residentRegistry,
		runtimeStateRef,
		cronStartState,
		gatewayTls,
		readinessEventLoopHealth,
		startupState,
		releaseStartupAccountStarts,
		gatewayInstanceRuntimeRef,
		channelManager,
		sidecarStartup,
		isGatewayStartupPending,
		pluginGatewayContext,
		watchNodeRequestHandler,
		createHttpTransportOptions,
		transportBridge,
		clients,
		broadcast,
		broadcastToConnIds,
		broadcastPluginEvent,
		getBufferedAmount,
		agentRunSeq,
		dedupe,
		chatRunState,
		addChatRun,
		removeChatRun,
		chatAbortControllers,
		chatQueuedTurns,
		toolEventRecipients,
		sessionEventSubscribers,
		sessionMessageSubscribers,
		getWorkerIngressEndpoint: transportBridge.getWorkerIngressEndpoint,
		getMcpAppSandboxPort: transportBridge.getMcpAppSandboxPort,
		ensureSandboxHostPort: transportBridge.ensureSandboxHostPort,
		getPortalService: transportBridge.getPortalService,
		workerGatewayEndpoint
	};
}
//#endregion
//#region src/gateway/startup-control-ui-origins.ts
/**
* Seeds runtime-only Control UI origins when a non-loopback gateway bind would
* otherwise reject the browser that just opened the local UI.
*/
async function maybeSeedControlUiAllowedOriginsAtStartup(params) {
	const seeded = ensureControlUiAllowedOriginsForNonLoopbackBind(params.config, {
		isContainerEnvironment,
		runtimeBind: params.runtimeBind,
		runtimePort: params.runtimePort
	});
	if (!seeded.seededOrigins || !seeded.bind) return {
		config: params.config,
		seededAllowedOrigins: false
	};
	params.log.info(buildSeededOriginsInfoLog(seeded.seededOrigins, seeded.bind));
	return {
		config: seeded.config,
		seededAllowedOrigins: true
	};
}
function buildSeededOriginsInfoLog(origins, bind) {
	return `gateway: seeded gateway.controlUi.allowedOrigins ${JSON.stringify(origins)} for bind=${bind} (required since v2026.2.26; see issue #29385). Applied for this runtime without writing config; add other origins to gateway.controlUi.allowedOrigins if needed.`;
}
//#endregion
//#region src/gateway/server-startup-bootstrap.ts
function publishGatewayPluginRuntimeConfigAtStartup(params) {
	setAppliedRuntimeConfigSnapshot(params.runtimeConfig, params.sourceConfig);
}
async function prepareGatewayServerBootstrap(input) {
	const { port, opts, log, logSecrets, loadWorkerEnvironmentStartupModule } = input;
	const formatRuntimeGatewayAuthTokenWarning = input.formatRuntimeGatewayAuthTokenWarning;
	normalizeStateDirEnv(process.env);
	await assertOpenClawStateWriteAllowedAtPath({
		databasePath: resolveOpenClawStateSqlitePath(process.env),
		env: process.env
	});
	const [{ OPENCLAW_DATABASE_SCHEMA_DOCS_URL, OpenClawDatabaseSchemaPreflightError, preflightOpenClawDatabaseSchemas }, agentDatabase, stateDatabase] = await Promise.all([
		import("./openclaw-database-preflight-BqzkECDS.js"),
		import("./openclaw-agent-db-Bqmq8yfr.js"),
		import("./openclaw-state-db-B-8ha5bz.js")
	]);
	const databaseSchemas = preflightOpenClawDatabaseSchemas({
		env: process.env,
		supportedVersions: {
			state: stateDatabase.OPENCLAW_STATE_SCHEMA_VERSION,
			agent: agentDatabase.OPENCLAW_AGENT_SCHEMA_VERSION
		}
	});
	if (databaseSchemas.incompatible.length > 0) {
		for (const database of databaseSchemas.incompatible) log.error("database schema preflight rejected newer schema", {
			kind: database.kind,
			path: database.path,
			...database.agentId ? { agentId: database.agentId } : {},
			foundVersion: database.foundVersion,
			supportedVersion: database.supportedVersion,
			writerAppVersion: database.writerAppVersion ?? "unknown",
			docsUrl: OPENCLAW_DATABASE_SCHEMA_DOCS_URL
		});
		throw new OpenClawDatabaseSchemaPreflightError(databaseSchemas.incompatible);
	}
	for (const database of databaseSchemas.indeterminate) log.warn("database schema preflight could not inspect database; continuing to real open", {
		kind: database.kind,
		path: database.path,
		reason: database.reason,
		docsUrl: OPENCLAW_DATABASE_SCHEMA_DOCS_URL
	});
	const { bootstrapGatewayNetworkRuntime } = await import("./server-network-runtime-DFIBqyVZ.js");
	bootstrapGatewayNetworkRuntime();
	const minimalTestGateway = isVitestRuntimeEnv() && process.env.OPENCLAW_TEST_MINIMAL_GATEWAY === "1";
	const ambientEnvTriggers = opts.ambientEnvTriggers ?? "suppress";
	process.env.OPENCLAW_GATEWAY_PORT = String(port);
	logAcceptedEnvOption({
		key: "OPENCLAW_RAW_STREAM",
		description: "raw stream logging enabled"
	});
	logAcceptedEnvOption({
		key: "OPENCLAW_RAW_STREAM_PATH",
		description: "raw stream log path override"
	});
	if (!resumeGatewayRestartTraceFromEnv(process.env, [["source", "env"]])) {
		const restartHandoff = readGatewayRestartHandoffSync();
		resumeGatewayRestartTraceFromHandoff(restartHandoff?.restartTrace, [
			["source", restartHandoff?.source],
			["restartKind", restartHandoff?.restartKind],
			["supervisorMode", restartHandoff?.supervisorMode]
		]);
	}
	const startupTrace = createGatewayStartupTrace(log);
	if (!minimalTestGateway) await startupTrace.measure("runtime.agent-cli", () => prepareGatewayAgentCliShim());
	const startupConfigModulePromise = import("./server-startup-config-DYjXuanI.js");
	const loadStartupPluginsModule = createLazyPromise(() => import("./server-startup-plugins-7q2e3R7a.js"), { cacheRejections: true });
	const { loadGatewayStartupConfigSnapshot } = await startupConfigModulePromise;
	const envBeforeStartupConfigLoad = { ...process.env };
	const startupConfigLoad = await startupTrace.measure("config.snapshot", () => loadGatewayStartupConfigSnapshot({
		minimalTestGateway,
		log,
		measure: (name, run) => startupTrace.measure(name, run),
		...opts.startupConfigSnapshotRead ? { initialSnapshotRead: opts.startupConfigSnapshotRead } : {}
	}));
	const configSnapshot = startupConfigLoad.snapshot;
	const startupAuthOverride = opts.auth ? structuredClone(opts.auth) : void 0;
	const startupTailscaleOverride = opts.tailscale ? structuredClone(opts.tailscale) : void 0;
	const controlUiSeed = minimalTestGateway ? {
		config: configSnapshot.config,
		seededAllowedOrigins: false
	} : await startupTrace.measure("control-ui.seed", () => maybeSeedControlUiAllowedOriginsAtStartup({
		config: configSnapshot.config,
		log,
		runtimeBind: opts.bind,
		runtimePort: port
	}));
	const startupConfigSnapshot = controlUiSeed.seededAllowedOrigins ? {
		...configSnapshot,
		runtimeConfig: controlUiSeed.config,
		config: controlUiSeed.config
	} : configSnapshot;
	const emitSecretsStateEvent = (code, message, cfg) => {
		const text = `[${code}] ${message}`;
		try {
			const target = resolveSystemMainSessionTarget(cfg);
			enqueueSystemEvent(text, withSystemEventOwner({
				sessionKey: target.sessionKey,
				contextKey: code
			}, target.agentId));
		} catch (error) {
			logSecrets.warn(`${text} not delivered: ${formatErrorMessage(error)}`);
		}
	};
	const { createRuntimeSecretsActivator } = await startupConfigModulePromise;
	const activateRuntimeSecrets = createRuntimeSecretsActivator({
		logSecrets,
		emitStateEvent: emitSecretsStateEvent,
		channelAutostartSuppression: opts.channelAutostartSuppression,
		...startupConfigLoad.pluginMetadataSnapshot ? { pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot } : {}
	});
	let startupInternalWriteHash = null;
	let startupLastGoodSnapshot = configSnapshot;
	const startupActivationSourceConfig = configSnapshot.sourceConfig;
	const startupRuntimeConfig = captureConfigOverrideApplier()(startupConfigSnapshot.config);
	startupTrace.setConfig(startupRuntimeConfig);
	const { prepareGatewayStartupConfig } = await startupConfigModulePromise;
	const authBootstrap = await startupTrace.measure("config.auth", () => prepareGatewayStartupConfig({
		configSnapshot: startupConfigSnapshot,
		authOverride: startupAuthOverride,
		tailscaleOverride: startupTailscaleOverride,
		activateRuntimeSecrets,
		log,
		measure: (name, run, measureOptions) => startupTrace.measure(name, run, measureOptions)
	}), { omitErrorMessage: true });
	const cfgAtStart = authBootstrap.cfg;
	startupTrace.setConfig(cfgAtStart);
	const { claimControlUiDeviceAuthMigration, completeControlUiDeviceAuthMigration, importPendingControlUiDeviceAuthMigration, isLegacyControlUiDeviceAuthMigrationInput, readControlUiDeviceAuthMigrationState, recoverControlUiDeviceAuthMigrationClaim, releaseControlUiDeviceAuthMigrationClaim } = await import("./control-ui-device-auth-migration-D4kz6t8w.js");
	let controlUiDeviceAuthMigrationState = isLegacyControlUiDeviceAuthMigrationInput({
		disabledDeviceAuth: cfgAtStart.gateway?.controlUi?.dangerouslyDisableDeviceAuth === true,
		lastTouchedVersion: cfgAtStart.meta?.lastTouchedVersion
	}) ? importPendingControlUiDeviceAuthMigration({ env: process.env }) : readControlUiDeviceAuthMigrationState({ env: process.env });
	if (controlUiDeviceAuthMigrationState?.status === "pending" && controlUiDeviceAuthMigrationState.claimedDeviceId) controlUiDeviceAuthMigrationState = recoverControlUiDeviceAuthMigrationClaim({ env: process.env });
	if (controlUiDeviceAuthMigrationState?.status === "pending") {
		const existingOperator = (await listDevicePairing()).paired.map(resolveEffectiveOperatorDeviceIdentity).find((device) => device !== null && roleScopesAllow({
			role: "operator",
			requestedScopes: ["operator.pairing"],
			allowedScopes: device.scopes
		}));
		if (existingOperator) try {
			controlUiDeviceAuthMigrationState = completeControlUiDeviceAuthMigration(existingOperator.deviceId, { env: process.env });
		} catch (error) {
			log.warn(`failed to reconcile Control UI device-auth migration with existing operator: ${String(error)}`);
		}
	}
	const controlUiDeviceAuthMigration = { pending: controlUiDeviceAuthMigrationState?.status === "pending" };
	if (controlUiDeviceAuthMigration.pending) log.warn("Retired gateway.controlUi.dangerouslyDisableDeviceAuth config detected. Authenticated Control UI access remains available for pairing-only remediation; reopen the Control UI over HTTPS or localhost, then click Secure this browser.");
	if (authBootstrap.generatedToken) log.warn(formatRuntimeGatewayAuthTokenWarning());
	const trustedProxyDeviceAutoApprove = cfgAtStart.gateway?.auth?.trustedProxy?.deviceAutoApprove;
	if (cfgAtStart.gateway?.auth?.mode === "trusted-proxy" && trustedProxyDeviceAutoApprove?.enabled === true && trustedProxyDeviceAutoApprove.scopes?.some((scope) => scope.trim() === "operator.admin")) log.warn("SECURITY WARNING: gateway.auth.trustedProxy.deviceAutoApprove.scopes includes operator.admin; every proxy-authenticated user can auto-approve a new browser device with full admin, and requests without scopes receive full admin automatically. Remove operator.admin to require manual approval until per-identity roles are available.");
	const resolvedStartupAuthOverride = startupAuthOverride ? Object.fromEntries([
		"mode",
		"token",
		"password",
		"allowTailscale",
		"rateLimit",
		"trustedProxy"
	].flatMap((key) => {
		if (startupAuthOverride[key] === void 0) return [];
		if ((key === "token" || key === "password") && isSecretRef(startupAuthOverride[key])) return [];
		const resolvedValue = cfgAtStart.gateway?.auth?.[key];
		return resolvedValue === void 0 ? [] : [[key, structuredClone(resolvedValue)]];
	})) : void 0;
	const startupAuthSecretRefOverride = startupAuthOverride ? {
		...isSecretRef(startupAuthOverride.token) ? { token: structuredClone(startupAuthOverride.token) } : {},
		...isSecretRef(startupAuthOverride.password) ? { password: structuredClone(startupAuthOverride.password) } : {}
	} : void 0;
	const reloadAuthOverride = authBootstrap.generatedToken ? mergeGatewayAuthConfig(resolvedStartupAuthOverride, { token: authBootstrap.generatedToken }) : resolvedStartupAuthOverride;
	const diagnosticsEnabled = isDiagnosticsEnabled(cfgAtStart);
	setDiagnosticsEnabledForProcess(diagnosticsEnabled);
	setGatewaySigusr1RestartPolicy({ allowExternal: isRestartEnabled(cfgAtStart) });
	const activeTaskCount = { get: () => 0 };
	setPreRestartDeferralCheck(() => getTotalQueueSize() + getTotalPendingReplies() + getActiveEmbeddedRunCount() + getActiveCronJobCount() + getActiveBackgroundExecSessionCount() + getActiveGatewayRootWorkCount({ excludeCurrent: true }) + activeTaskCount.get());
	const seededControlUiAllowedOrigins = controlUiSeed.seededAllowedOrigins ? cfgAtStart.gateway?.controlUi?.allowedOrigins : void 0;
	const applyFixedGatewayOverlays = (config) => {
		let runtimeConfig = config;
		if (reloadAuthOverride || startupTailscaleOverride) runtimeConfig = {
			...runtimeConfig,
			gateway: {
				...runtimeConfig.gateway,
				...reloadAuthOverride ? { auth: mergeGatewayAuthConfig(runtimeConfig.gateway?.auth, reloadAuthOverride) } : {},
				...startupTailscaleOverride ? { tailscale: mergeGatewayTailscaleConfig(runtimeConfig.gateway?.tailscale, startupTailscaleOverride) } : {}
			}
		};
		if (seededControlUiAllowedOrigins && runtimeConfig.gateway?.controlUi?.allowedOrigins === void 0) runtimeConfig = {
			...runtimeConfig,
			gateway: {
				...runtimeConfig.gateway,
				controlUi: {
					...runtimeConfig.gateway?.controlUi,
					allowedOrigins: seededControlUiAllowedOrigins
				}
			}
		};
		return runtimeConfig;
	};
	const applyReloadableGatewayAuthRefs = (config) => {
		if (!startupAuthSecretRefOverride?.token && !startupAuthSecretRefOverride?.password) return config;
		return {
			...config,
			gateway: {
				...config.gateway,
				auth: mergeGatewayAuthConfig(config.gateway?.auth, startupAuthSecretRefOverride)
			}
		};
	};
	const prepareReloadCandidate = (params) => {
		const previousSourceConfig = params.previousSourceConfig ?? getRuntimeConfigSourceSnapshot() ?? startupLastGoodSnapshot.sourceConfig;
		assertGatewayConfigEnvSelectionUnchanged(previousSourceConfig, params.sourceConfig);
		const runtimeEnv = prepareConfigRuntimeEnv({
			previousConfig: previousSourceConfig,
			nextConfig: params.sourceConfig
		});
		const metadata = startupConfigLoad.pluginMetadataSnapshot;
		const pluginCandidate = minimalTestGateway ? {
			runtimeConfig: params.runtimeConfig,
			compareConfig: params.sourceConfig
		} : resolveGatewayReloadPluginActivationCandidate({
			...params,
			env: runtimeEnv.env,
			...metadata?.manifestRegistry ? { manifestRegistry: metadata.manifestRegistry } : {},
			discovery: metadata?.discovery,
			ambientEnvTriggers
		});
		const applyCandidateOverrides = captureConfigOverrideApplier();
		const reapplyCompareOverlays = (config) => applyCandidateOverrides(mergeActivationSectionsIntoRuntimeConfig({
			runtimeConfig: config,
			activationConfig: pluginCandidate.compareConfig
		}));
		const reapplyRuntimeOverlays = (config) => applyFixedGatewayOverlays(applyReloadableGatewayAuthRefs(reapplyCompareOverlays(config)));
		return {
			runtimeConfig: reapplyRuntimeOverlays(params.runtimeConfig),
			compareConfig: reapplyCompareOverlays(params.sourceConfig),
			runtimeEnv,
			reapplyRuntimeOverlays,
			reapplyCompareOverlays
		};
	};
	if (startupConfigLoad.wroteConfig || authBootstrap.persistedGeneratedToken) {
		const startupSnapshot = await startupTrace.measure("config.final-snapshot", () => readConfigFileSnapshot());
		startupInternalWriteHash = startupSnapshot.hash ?? null;
		startupLastGoodSnapshot = startupSnapshot;
	}
	setAppliedRuntimeConfigSnapshot(cfgAtStart, startupLastGoodSnapshot.sourceConfig);
	initializePublishedConfigRuntimeEnv(startupLastGoodSnapshot.sourceConfig, {
		ownedEnv: collectConfigRuntimeEnvOwnership(startupLastGoodSnapshot.sourceConfig, envBeforeStartupConfigLoad, process.env),
		preserveExistingOwnership: true
	});
	const workerEnvironmentStartup = minimalTestGateway ? void 0 : await startupTrace.measure("worker-environments.store-import", async () => {
		return await (await loadWorkerEnvironmentStartupModule()).loadGatewayWorkerEnvironmentStartupState();
	});
	const { prepareGatewayPluginBootstrap, runGatewayStartupMaintenance } = await loadStartupPluginsModule();
	await startupTrace.measure("startup.maintenance", () => runGatewayStartupMaintenance({
		cfgAtStart,
		startupRuntimeConfig,
		minimalTestGateway,
		log
	}));
	const pluginBootstrap = await startupTrace.measure("plugins.bootstrap", () => prepareGatewayPluginBootstrap({
		cfgAtStart,
		activationSourceConfig: startupActivationSourceConfig,
		pluginMetadataSnapshot: startupConfigLoad.pluginMetadataSnapshot,
		workerProviderIds: workerEnvironmentStartup?.durableProviderIds ?? [],
		minimalTestGateway,
		ambientEnvTriggers,
		log
	}));
	const { gatewayPluginConfigAtStart, defaultWorkspaceDir, pluginWorkspaceDir, startupPluginIds, pluginManifestRecords, pluginMetadataSnapshot, pluginLookUpTable, baseMethods, ambientAutostartSuppressedChannelIds } = pluginBootstrap;
	publishGatewayPluginRuntimeConfigAtStartup({
		runtimeConfig: gatewayPluginConfigAtStart,
		sourceConfig: startupLastGoodSnapshot.sourceConfig
	});
	const coreGatewayMethodNames = listCoreGatewayMethodNames();
	setCurrentPluginMetadataSnapshot(completePluginMetadataSnapshot({
		snapshot: pluginMetadataSnapshot,
		config: startupActivationSourceConfig,
		env: process.env,
		workspaceDir: defaultWorkspaceDir
	}), {
		config: startupActivationSourceConfig,
		compatibleConfigs: [
			startupRuntimeConfig,
			cfgAtStart,
			gatewayPluginConfigAtStart
		],
		env: process.env,
		workspaceDir: pluginWorkspaceDir
	});
	if (pluginLookUpTable) {
		const metrics = pluginLookUpTable.metrics;
		startupTrace.detail("plugins.lookup-table", [
			["registrySnapshotMs", metrics.registrySnapshotMs],
			["manifestRegistryMs", metrics.manifestRegistryMs],
			["startupPlanMs", metrics.startupPlanMs],
			["ownerMapsMs", metrics.ownerMapsMs],
			["totalMs", metrics.totalMs],
			["indexPlugins", String(metrics.indexPluginCount)],
			["indexPluginCount", metrics.indexPluginCount],
			["manifestPlugins", String(metrics.manifestPluginCount)],
			["manifestPluginCount", metrics.manifestPluginCount],
			["startupPlugins", String(metrics.startupPluginCount)],
			["startupPluginCount", metrics.startupPluginCount]
		]);
	}
	return {
		opts,
		minimalTestGateway,
		ambientEnvTriggers,
		startupTrace,
		loadStartupPluginsModule,
		configSnapshot,
		startupConfigLoad,
		startupActivationSourceConfig,
		startupRuntimeConfig,
		cfgAtStart,
		generatedStartupAuthToken: authBootstrap.generatedToken !== void 0,
		claimControlUiDeviceAuthMigration,
		completeControlUiDeviceAuthMigration,
		releaseControlUiDeviceAuthMigrationClaim,
		controlUiDeviceAuthMigration,
		resolvedStartupAuthOverride,
		startupTailscaleOverride,
		diagnosticsEnabled,
		activeTaskCount,
		applyFixedGatewayOverlays,
		prepareReloadCandidate,
		startupInternalWriteHash,
		startupLastGoodSnapshot,
		workerEnvironmentStartup,
		pluginBootstrap,
		gatewayPluginConfigAtStart,
		defaultWorkspaceDir,
		pluginWorkspaceDir,
		startupPluginIds,
		pluginManifestRecords,
		pluginMetadataSnapshot,
		pluginLookUpTable,
		baseMethods,
		ambientAutostartSuppressedChannelIds,
		coreGatewayMethodNames,
		activateRuntimeSecrets
	};
}
//#endregion
//#region src/gateway/server-kernel.ts
const loadGatewayModelCatalogModule = createLazyRuntimeModule(() => import("./server-model-catalog-DGsBSqG9.js"));
const loadWorkerEnvironmentStartupModule = createLazyRuntimeModule(() => import("./server-worker-environment-startup-Cg7i4PGm.js"));
const loadWorkerPlacementStartupModule = createLazyRuntimeModule(() => import("./server-worker-placement-startup-Q0kEFzjp.js"));
const loadGatewayStartupEarlyModule = createLazyRuntimeModule(() => import("./server-startup-early-BpzZOeWM.js"));
const loadGatewayPluginBootstrapModule = createLazyRuntimeModule(() => import("./server-plugin-bootstrap-By2QuXNA.js"));
const loadGatewayCloseModule = createLazyRuntimeModule(() => import("./server-close.runtime.js"));
const log$1 = createSubsystemLogger("gateway");
const logDiscovery = log$1.child("discovery");
const logTailscale$1 = log$1.child("tailscale");
const logChannels$1 = log$1.child("channels");
const logHealth$1 = log$1.child("health");
const logCron$1 = log$1.child("cron");
const logReload$1 = log$1.child("reload");
const logHooks$1 = log$1.child("hooks");
const logPlugins = log$1.child("plugins");
const logWsControl$1 = log$1.child("ws");
const logSecrets = log$1.child("secrets");
const gatewayKernelLogs = {
	log: log$1,
	logTailscale: logTailscale$1,
	logChannels: logChannels$1,
	logHealth: logHealth$1,
	logCron: logCron$1,
	logReload: logReload$1,
	logHooks: logHooks$1,
	logWsControl: logWsControl$1
};
const gatewayRuntime = runtimeForLogger(log$1);
const getChannelRuntime = createLazyRuntimeModule(() => import("./runtime-channel-COAJJtCu.js").then(({ createRuntimeChannel }) => createRuntimeChannel()));
const loadGatewayModelCatalog = async (...args) => {
	return (await loadGatewayModelCatalogModule()).loadGatewayModelCatalog(...args);
};
const loadGatewayModelCatalogSnapshot = async (...args) => {
	return (await loadGatewayModelCatalogModule()).loadGatewayModelCatalogSnapshot(...args);
};
const readPreparedGatewayModelCatalog = async (...args) => {
	return (await loadGatewayModelCatalogModule()).readPreparedGatewayModelCatalog(...args);
};
const loadPreparedGatewayModelCatalogSnapshot = async (...args) => {
	return (await loadGatewayModelCatalogModule()).loadPreparedGatewayModelCatalogSnapshot(...args);
};
const readPreparedGatewayModelCatalogOwnerSnapshot = async (...args) => {
	return (await loadGatewayModelCatalogModule()).readPreparedGatewayModelCatalogOwnerSnapshot(...args);
};
registerGatewayModelCatalogPrivateAccess(loadGatewayModelCatalogSnapshot, {
	loadDeferred: (params) => loadPreparedGatewayModelCatalogSnapshot(params),
	readPrepared: readPreparedGatewayModelCatalogOwnerSnapshot
});
function formatRuntimeGatewayAuthTokenWarning() {
	const base = "Gateway auth token was missing. Generated a runtime token for this startup without changing config; restart will generate a different token.";
	if (!isNixMode) return `${base} Persist one with \`openclaw config set gateway.auth.mode token\` and \`openclaw config set gateway.auth.token <token>\`.`;
	return [
		base,
		"In Nix mode, set gateway.auth.token in your Nix-managed OpenClaw config and rebuild.",
		"For the first-party Nix flow, see https://github.com/openclaw/nix-openclaw#quick-start and https://docs.openclaw.ai/install/nix."
	].join(" ");
}
async function closeMcpLoopbackServerOnDemand() {
	const { closeMcpLoopbackServer } = await import("./mcp-http-BVn0feuo.js");
	await closeMcpLoopbackServer();
}
async function stopTaskRegistryMaintenanceOnDemand() {
	const { stopTaskRegistryMaintenance } = await import("./task-registry.maintenance-By5SrIHx.js");
	stopTaskRegistryMaintenance();
}
async function resetPreparedModelCatalogForTestCore() {
	const { resetPreparedModelCatalogStateForTest } = await loadGatewayModelCatalogModule();
	await resetPreparedModelCatalogStateForTest();
}
/** Builds the Gateway kernel and internal dispatch surface without creating HTTP servers. */
async function createGatewayKernel(port = 18789, opts = {}) {
	ensureOpenClawCliOnPath();
	let lifecycleRuntime;
	try {
		const bootstrap = await prepareGatewayServerBootstrap({
			port,
			opts,
			log: log$1,
			logSecrets,
			loadWorkerEnvironmentStartupModule,
			formatRuntimeGatewayAuthTokenWarning
		});
		const runtime = await prepareGatewayKernelState({
			bootstrap,
			port,
			opts,
			log: log$1,
			logChannels: logChannels$1,
			logHooks: logHooks$1,
			logPlugins,
			gatewayRuntime,
			resolveChannelRuntime: getChannelRuntime,
			loadWorkerEnvironmentStartupModule,
			loadWorkerPlacementStartupModule
		});
		lifecycleRuntime = await prepareGatewayLifecycle({
			runtime,
			port,
			log: log$1,
			logCron: logCron$1,
			diagnosticsEnabled: bootstrap.diagnosticsEnabled,
			loadGatewayCloseModule,
			closeMcpLoopbackServerOnDemand,
			stopTaskRegistryMaintenanceOnDemand
		});
		if (bootstrap.cfgAtStart.gateway?.tls?.enabled && !runtime.gatewayTls.enabled) throw new Error(runtime.gatewayTls.error ?? "gateway tls: failed to enable");
		return await prepareGatewayKernelRequestRuntime({
			coreRuntime: await startGatewayCoreRuntime({
				lifecycleRuntime,
				port,
				log: log$1,
				logDiscovery,
				logHealth: logHealth$1,
				logChannels: logChannels$1,
				loadGatewayStartupEarlyModule,
				loadGatewayPluginBootstrapModule,
				loadGatewayModelCatalog,
				loadGatewayModelCatalogSnapshot,
				readPreparedGatewayModelCatalog
			}),
			log: log$1,
			logHealth: logHealth$1
		});
	} catch (error) {
		if (lifecycleRuntime) await lifecycleRuntime.closeOnStartupFailure();
		else {
			clearGatewayAgentCliShim();
			clearSecretsRuntimeSnapshotState();
			clearPluginMetadataLifecycleCaches();
		}
		throw error;
	}
}
//#endregion
//#region src/gateway/mcp-app-sandbox-http.ts
const MCP_APP_PERMISSIONS_POLICY = "camera=(), microphone=(), geolocation=(), clipboard-write=()";
function handleMcpAppSandboxHttpRequest(req, res) {
	let url;
	try {
		url = new URL(req.url ?? "/", "http://localhost");
	} catch {
		respondPlainText(res, 400, "Bad Request");
		return;
	}
	if (url.pathname !== "/mcp-app-sandbox" || req.method !== "GET" && req.method !== "HEAD") {
		respondPlainText(res, 404, "Not Found");
		return;
	}
	let csp;
	try {
		csp = decodeSandboxHostCsp(url.searchParams.get("csp"));
	} catch {
		respondPlainText(res, 400, "invalid MCP App sandbox policy");
		return;
	}
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Content-Security-Policy", buildSandboxHostContentSecurityPolicy(csp));
	res.setHeader("Permissions-Policy", MCP_APP_PERMISSIONS_POLICY);
	res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	res.setHeader("Origin-Agent-Cluster", "?1");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("X-Content-Type-Options", "nosniff");
	const html = buildSandboxHostProxyHtml(csp);
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(req.method === "HEAD" ? void 0 : html);
}
/** Dedicated listener: this origin must never serve Control UI or authenticated Gateway data. */
function createSandboxHostHttpServer(tlsOptions) {
	const handler = (req, res) => {
		handleMcpAppSandboxHttpRequest(req, res);
	};
	return tlsOptions ? createServer$2(tlsOptions, handler) : createServer$1(handler);
}
//#endregion
//#region src/gateway/server/http-listen.ts
const EADDRINUSE_MAX_RETRIES = 20;
const EADDRINUSE_RETRY_INTERVAL_MS = 500;
async function closeServerQuietly(httpServer) {
	await new Promise((resolve) => {
		try {
			httpServer.close(() => resolve());
		} catch {
			resolve();
		}
	});
}
/** Listen on the configured gateway host/port, retrying transient EADDRINUSE windows. */
async function listenGatewayHttpServer(params) {
	const { httpServer, bindHost, port, retryEaddrinuse = true, serviceName = "gateway", endpointScheme = "ws" } = params;
	const maxRetries = retryEaddrinuse ? EADDRINUSE_MAX_RETRIES : 0;
	for (const attempt of Array.from({ length: maxRetries + 1 }, (_, index) => index)) try {
		await new Promise((resolve, reject) => {
			const onError = (err) => {
				httpServer.off("listening", onListening);
				reject(err);
			};
			const onListening = () => {
				httpServer.off("error", onError);
				resolve();
			};
			httpServer.once("error", onError);
			httpServer.once("listening", onListening);
			httpServer.listen(port, bindHost);
		});
		return;
	} catch (err) {
		const code = err.code;
		if (code === "EADDRINUSE" && attempt < maxRetries) {
			await closeServerQuietly(httpServer);
			await sleep(EADDRINUSE_RETRY_INTERVAL_MS);
			continue;
		}
		if (code === "EADDRINUSE") throw new GatewayLockError(`another ${serviceName} instance is already listening on ${endpointScheme}://${bindHost}:${port}`, err);
		throw new GatewayLockError(`failed to bind ${serviceName} socket on ${endpointScheme}://${bindHost}:${port}: ${String(err)}`, err);
	}
}
//#endregion
//#region src/gateway/portals/portal-http-proxy.ts
const PORTAL_AUTH_NAME = "openclaw_portal";
function portalAuthCookieName(listenPort) {
	return `${PORTAL_AUTH_NAME}_${listenPort}`;
}
const PORTAL_COOKIE_PREFIX = "oc_portal_";
const PORTAL_REFERRER_POLICY = "no-referrer";
const MAX_WEBSOCKET_RESPONSE_HEADER_BYTES = 64 * 1024;
const HOP_BY_HOP_HEADERS = /* @__PURE__ */ new Set([
	"connection",
	"keep-alive",
	"proxy-authenticate",
	"proxy-authorization",
	"proxy-connection",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade"
]);
function tokensEqual(candidate, expected) {
	if (!candidate) return false;
	const candidateBytes = Buffer.from(candidate);
	const expectedBytes = Buffer.from(expected);
	return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
}
function readPortalCookie(cookieHeader, listenPort) {
	const authCookieName = portalAuthCookieName(listenPort);
	for (const segment of cookieHeader?.split(";") ?? []) {
		const separator = segment.indexOf("=");
		if (separator < 0 || segment.slice(0, separator).trim() !== authCookieName) continue;
		return segment.slice(separator + 1).trim();
	}
}
function portalCookiePrefix(targetPort) {
	return `${PORTAL_COOKIE_PREFIX}${targetPort}_`;
}
function readTargetCookies(cookieHeader, targetPort) {
	const prefix = portalCookiePrefix(targetPort);
	return (cookieHeader?.split(";") ?? []).flatMap((segment) => {
		const separator = segment.indexOf("=");
		if (separator <= 0) return [];
		const name = segment.slice(0, separator).trim();
		if (!name.startsWith(prefix) || name.length === prefix.length) return [];
		return [`${name.slice(prefix.length)}=${segment.slice(separator + 1).trim()}`];
	}).join("; ") || void 0;
}
function rewriteTargetCookie(cookie, targetPort) {
	const [cookiePair, ...attributes] = cookie.split(";");
	const separator = cookiePair?.indexOf("=") ?? -1;
	if (!cookiePair || separator <= 0) return;
	const name = cookiePair.slice(0, separator).trim();
	if (!name) return;
	const retainedAttributes = attributes.filter((attribute) => !/^\s*domain\s*=/iu.test(attribute));
	const suffix = retainedAttributes.length > 0 ? `;${retainedAttributes.join(";")}` : "";
	return `${portalCookiePrefix(targetPort)}${name}=${cookiePair.slice(separator + 1)}${suffix}`;
}
function parsePortalUrl(req) {
	try {
		return new URL(req.url ?? "/", "http://openclaw.invalid");
	} catch {
		return;
	}
}
function authorizePortalRequest(req, target) {
	const url = parsePortalUrl(req);
	if (tokensEqual(url?.searchParams.get(PORTAL_AUTH_NAME) ?? void 0, target.token)) {
		url?.searchParams.delete(PORTAL_AUTH_NAME);
		return {
			kind: "authorized",
			requestPath: `${url?.pathname ?? "/"}${url?.search ?? ""}`,
			setCookie: true
		};
	}
	if (tokensEqual(readPortalCookie(req.headers.cookie, target.listenPort), target.token)) {
		url?.searchParams.delete(PORTAL_AUTH_NAME);
		return {
			kind: "authorized",
			requestPath: `${url?.pathname ?? "/"}${url?.search ?? ""}`,
			setCookie: false
		};
	}
	return { kind: "unauthorized" };
}
function portalCookie(target, tls) {
	return `${portalAuthCookieName(target.listenPort)}=${target.token}; HttpOnly; SameSite=Lax; Path=/${tls ? "; Secure" : ""}`;
}
function setProxyResponseHeader(res, name, value, targetPort) {
	if (name !== "set-cookie") {
		res.setHeader(name, value);
		return;
	}
	const existing = res.getHeader("Set-Cookie");
	const existingCookies = existing === void 0 ? [] : Array.isArray(existing) ? existing : [existing];
	const rewrittenCookies = (Array.isArray(value) ? value : [String(value)]).flatMap((cookie) => {
		const rewritten = rewriteTargetCookie(cookie, targetPort);
		return rewritten ? [rewritten] : [];
	});
	const cookies = [...existingCookies.map(String), ...rewrittenCookies];
	if (cookies.length > 0) res.setHeader("Set-Cookie", cookies);
}
function htmlResponse(res, statusCode, html, headOnly) {
	res.statusCode = statusCode;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
	res.setHeader("Content-Length", String(Buffer.byteLength(html)));
	res.end(headOnly ? void 0 : html);
}
function respondPortalUnauthorized(req, res) {
	htmlResponse(res, 401, "<!doctype html><meta charset=utf-8><title>Private portal</title><p>This portal is private. Open it from the OpenClaw Control UI.</p>", req.method === "HEAD");
}
function respondPortalWaiting(req, res, targetPort) {
	htmlResponse(res, 502, `<!doctype html><meta charset=utf-8><meta http-equiv="refresh" content="2"><title>Waiting for app</title><p>Waiting for the app on port ${targetPort}…</p>`, req.method === "HEAD");
}
function connectionHeaderTokens(headers) {
	const value = headers.connection;
	const joined = Array.isArray(value) ? value.join(",") : value;
	return new Set((joined ?? "").split(",").map((token) => token.trim().toLowerCase()).filter(Boolean));
}
function proxyHeaders(headers, targetPort) {
	const result = {};
	const connectionTokens = connectionHeaderTokens(headers);
	for (const [name, value] of Object.entries(headers)) {
		const normalized = name.toLowerCase();
		if (value === void 0 || HOP_BY_HOP_HEADERS.has(normalized) || connectionTokens.has(normalized)) continue;
		if (normalized === "cookie" && targetPort !== void 0) {
			const cookie = readTargetCookies(Array.isArray(value) ? value.join("; ") : value, targetPort);
			if (cookie) result.cookie = cookie;
			continue;
		}
		if (normalized === "referer" && String(value).includes(`${PORTAL_AUTH_NAME}=`)) continue;
		result[normalized] = value;
	}
	return result;
}
/** Proxies one authorized portal request only to the loopback target. */
function handlePortalProxyRequest(params) {
	const { req, res, target, tls } = params;
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind === "unauthorized") {
		respondPortalUnauthorized(req, res);
		return;
	}
	if (authorization.setCookie) res.setHeader("Set-Cookie", portalCookie(target, tls));
	const headers = proxyHeaders(req.headers, target.targetPort);
	const originalHost = req.headers.host;
	headers.host = `localhost:${target.targetPort}`;
	headers["x-forwarded-for"] = req.socket.remoteAddress ?? "";
	headers["x-forwarded-proto"] = tls ? "https" : "http";
	if (originalHost) headers["x-forwarded-host"] = originalHost;
	const proxyReq = request({
		hostname: "localhost",
		createConnection: () => net.connect({
			host: "localhost",
			autoSelectFamily: true,
			port: target.targetPort
		}),
		port: target.targetPort,
		method: req.method,
		path: authorization.requestPath,
		headers
	});
	proxyReq.once("response", (proxyRes) => {
		for (const [name, value] of Object.entries(proxyHeaders(proxyRes.headers))) if (value !== void 0) setProxyResponseHeader(res, name, value, target.targetPort);
		res.setHeader("Referrer-Policy", PORTAL_REFERRER_POLICY);
		res.statusCode = proxyRes.statusCode ?? 502;
		proxyRes.pipe(res);
	});
	proxyReq.once("error", () => {
		if (!res.headersSent) respondPortalWaiting(req, res, target.targetPort);
		else res.destroy();
	});
	req.once("aborted", () => proxyReq.destroy());
	req.pipe(proxyReq);
}
function websocketHeaders(req, targetPort, requestPath) {
	const lines = [`${req.method ?? "GET"} ${requestPath} HTTP/1.1`];
	for (const [name, value] of Object.entries(req.headers)) {
		const normalized = name.toLowerCase();
		if (value === void 0 || normalized === "host" || HOP_BY_HOP_HEADERS.has(normalized) && normalized !== "connection" && normalized !== "upgrade") continue;
		if (normalized === "cookie") {
			const cookie = readTargetCookies(Array.isArray(value) ? value.join("; ") : value, targetPort);
			if (cookie) lines.push(`cookie: ${cookie}`);
			continue;
		}
		if (normalized === "referer" && String(value).includes(`${PORTAL_AUTH_NAME}=`)) continue;
		for (const item of Array.isArray(value) ? value : [value]) lines.push(`${normalized}: ${item}`);
	}
	lines.push(`host: localhost:${targetPort}`, "", "");
	return lines.join("\r\n");
}
function rejectPortalUpgrade(socket) {
	socket.end("HTTP/1.1 401 Unauthorized\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 12\r\nConnection: close\r\n\r\nUnauthorized");
}
function forwardWebSocketResponse(targetSocket, browserSocket, targetPort) {
	let pending = Buffer.alloc(0);
	const onData = (chunk) => {
		pending = Buffer.concat([pending, chunk]);
		const headerEnd = pending.indexOf("\r\n\r\n");
		if (headerEnd < 0) {
			if (pending.length > MAX_WEBSOCKET_RESPONSE_HEADER_BYTES) {
				targetSocket.destroy();
				browserSocket.destroy();
			}
			return;
		}
		targetSocket.off("data", onData);
		const rewrittenLines = pending.subarray(0, headerEnd).toString("latin1").split("\r\n").flatMap((line) => {
			const separator = line.indexOf(":");
			if (separator <= 0 || line.slice(0, separator).trim().toLowerCase() !== "set-cookie") return [line];
			const rewritten = rewriteTargetCookie(line.slice(separator + 1).trimStart(), targetPort);
			return rewritten ? [`${line.slice(0, separator)}: ${rewritten}`] : [];
		});
		browserSocket.write(`${rewrittenLines.join("\r\n")}\r\n\r\n`);
		const remainder = pending.subarray(headerEnd + 4);
		if (remainder.length > 0) browserSocket.write(remainder);
		targetSocket.pipe(browserSocket);
	};
	targetSocket.on("data", onData);
}
/** Splices an authorized portal WebSocket upgrade into the loopback target. */
function handlePortalProxyUpgrade(params) {
	const { req, socket, head, target, upgradedSockets } = params;
	const authorization = authorizePortalRequest(req, target);
	if (authorization.kind !== "authorized") {
		rejectPortalUpgrade(socket);
		return;
	}
	const targetSocket = net.connect({
		host: "localhost",
		autoSelectFamily: true,
		port: target.targetPort
	});
	upgradedSockets.add(socket);
	upgradedSockets.add(targetSocket);
	const release = (stream) => upgradedSockets.delete(stream);
	socket.once("close", () => {
		release(socket);
		targetSocket.destroy();
	});
	targetSocket.once("close", () => {
		release(targetSocket);
		socket.destroy();
	});
	socket.once("error", () => targetSocket.destroy());
	targetSocket.once("error", () => socket.destroy());
	targetSocket.once("connect", () => {
		forwardWebSocketResponse(targetSocket, socket, target.targetPort);
		targetSocket.write(websocketHeaders(req, target.targetPort, authorization.requestPath));
		if (head.length > 0) targetSocket.write(head);
		socket.pipe(targetSocket);
	});
}
//#endregion
//#region src/gateway/portals/portal-service.ts
function removeServers(shared, owned) {
	for (const server of owned) {
		const index = shared.indexOf(server);
		if (index >= 0) shared.splice(index, 1);
	}
}
async function closeServers(servers) {
	await Promise.all(servers.map((server) => new Promise((resolve) => {
		if (!server.listening) {
			resolve();
			return;
		}
		server.close(() => resolve());
		server.closeAllConnections();
	})));
}
function formatPortalHost(host) {
	const openableHost = host === "0.0.0.0" ? "127.0.0.1" : host === "::" ? "::1" : host;
	return openableHost.includes(":") ? `[${openableHost}]` : openableHost;
}
/** Creates the gateway-lifetime registry and per-portal transport listeners. */
function createGatewayPortalService(params) {
	const entries = /* @__PURE__ */ new Map();
	const operations = /* @__PURE__ */ new Map();
	let closed = false;
	const summarize = (portal) => {
		const host = params.httpBindHosts[0];
		if (!host) throw new Error("Gateway listener must start before opening a portal");
		const scheme = params.tlsOptions ? "https" : "http";
		const tokenQuery = `openclaw_portal=${portal.token}`;
		const publicUrl = `${scheme}://${formatPortalHost(host)}:${portal.listenPort}${portal.path ?? "/"}`;
		const openableUrl = new URL(publicUrl);
		openableUrl.searchParams.set("openclaw_portal", portal.token);
		return {
			id: portal.id,
			title: portal.title,
			port: portal.targetPort,
			listenPort: portal.listenPort,
			tokenQuery,
			url: openableUrl.toString(),
			publicUrl,
			...portal.path ? { path: portal.path } : {},
			...portal.description ? { description: portal.description } : {},
			createdAtMs: portal.createdAtMs
		};
	};
	const serialize = async (id, operation) => {
		const result = (operations.get(id) ?? Promise.resolve()).then(operation, operation);
		const completion = result.then(() => void 0, () => void 0);
		operations.set(id, completion);
		try {
			return await result;
		} finally {
			if (operations.get(id) === completion) operations.delete(id);
		}
	};
	const closeEntry = async (id) => {
		const runtime = entries.get(id);
		if (!runtime) return;
		entries.delete(id);
		removeServers(params.httpServers, runtime.servers);
		for (const socket of runtime.upgradedSockets) socket.destroy();
		runtime.upgradedSockets.clear();
		await closeServers(runtime.servers);
	};
	return {
		open: async (input) => {
			const id = `p${input.targetPort}`;
			return await serialize(id, async () => {
				if (closed) throw new Error("portals unavailable");
				const existing = entries.get(id);
				if (existing) {
					existing.portal.title = input.title?.trim() || existing.portal.title;
					if (input.description !== void 0) existing.portal.description = input.description;
					if (input.path !== void 0) existing.portal.path = input.path;
					return summarize(existing.portal);
				}
				if (params.httpBindHosts.length === 0) throw new Error("Gateway listener must start before opening a portal");
				const portal = {
					id,
					title: input.title?.trim() || `Port ${input.targetPort}`,
					...input.description ? { description: input.description } : {},
					...input.path ? { path: input.path } : {},
					targetPort: input.targetPort,
					token: randomBytes(32).toString("hex"),
					listenPort: 0,
					createdAtMs: Date.now()
				};
				const upgradedSockets = /* @__PURE__ */ new Set();
				const handler = (req, res) => handlePortalProxyRequest({
					req,
					res,
					target: portal,
					tls: Boolean(params.tlsOptions)
				});
				const servers = params.httpBindHosts.map(() => params.tlsOptions ? createServer$2(params.tlsOptions, handler) : createServer$1(handler));
				for (const server of servers) server.on("upgrade", (req, socket, head) => handlePortalProxyUpgrade({
					req,
					socket,
					head,
					target: portal,
					upgradedSockets
				}));
				params.httpServers.push(...servers);
				try {
					for (const [index, host] of params.httpBindHosts.entries()) {
						const server = servers[index];
						if (!server) throw new Error(`Missing portal HTTP server for bind host ${host}`);
						await listenGatewayHttpServer({
							httpServer: server,
							bindHost: host,
							port: index === 0 ? 0 : portal.listenPort,
							retryEaddrinuse: false,
							serviceName: "portal",
							endpointScheme: params.tlsOptions ? "https" : "http"
						});
						if (index === 0) {
							const address = server.address();
							if (!address || typeof address === "string") throw new Error("Portal listener failed to resolve its port");
							portal.listenPort = address.port;
						}
					}
				} catch (error) {
					removeServers(params.httpServers, servers);
					await closeServers(servers);
					throw error;
				}
				entries.set(id, {
					portal,
					servers,
					upgradedSockets
				});
				return summarize(portal);
			});
		},
		list: () => [...entries.values()].map(({ portal }) => summarize(portal)).toSorted((left, right) => left.createdAtMs - right.createdAtMs || left.id.localeCompare(right.id)),
		close: async (id) => {
			await serialize(id, () => closeEntry(id));
		},
		closeAll: async () => {
			closed = true;
			const ids = /* @__PURE__ */ new Set([...entries.keys(), ...operations.keys()]);
			await Promise.all([...ids].map((id) => serialize(id, () => closeEntry(id))));
		}
	};
}
//#endregion
//#region src/channels/plugins/gateway-auth-bypass.ts
const GATEWAY_AUTH_API_ARTIFACT_BASENAME = "gateway-auth-api.js";
const MISSING_PUBLIC_SURFACE_PREFIX = "Unable to resolve bundled plugin public surface ";
/** Resolves to null when the plugin is not activated or ships no gateway auth artifact. */
async function loadChannelGatewayAuthApi(channelId) {
	try {
		return await tryLoadActivatedBundledPluginPublicSurfaceModule({
			dirName: channelId,
			artifactBasename: GATEWAY_AUTH_API_ARTIFACT_BASENAME
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith(MISSING_PUBLIC_SURFACE_PREFIX)) return null;
		throw error;
	}
}
/**
* Resolves configured gateway auth bypass paths from a channel plugin artifact.
*/
async function resolveBundledChannelGatewayAuthBypassPaths(params) {
	return ((await loadChannelGatewayAuthApi(params.channelId))?.resolveGatewayAuthBypassPaths?.({ cfg: params.cfg }) ?? []).flatMap((path) => typeof path === "string" && path.trim() ? [path.trim()] : []);
}
//#endregion
//#region src/gateway/server-http-plugin-auth.ts
const pluginGatewayAuthBypassPathsCache = /* @__PURE__ */ new WeakMap();
async function resolvePluginGatewayAuthBypassPaths(configSnapshot) {
	const paths = /* @__PURE__ */ new Set();
	const configuredChannels = configSnapshot.channels;
	if (!configuredChannels || Object.keys(configuredChannels).length === 0) return paths;
	for (const channelId of Object.keys(configuredChannels)) for (const path of await resolveBundledChannelGatewayAuthBypassPaths({
		channelId,
		cfg: configSnapshot
	})) paths.add(path);
	return paths;
}
function getCachedPluginGatewayAuthBypassPaths(configSnapshot) {
	const cached = pluginGatewayAuthBypassPathsCache.get(configSnapshot);
	if (cached) return cached;
	const resolved = resolvePluginGatewayAuthBypassPaths(configSnapshot).catch((error) => {
		pluginGatewayAuthBypassPathsCache.delete(configSnapshot);
		throw error;
	});
	pluginGatewayAuthBypassPathsCache.set(configSnapshot, resolved);
	return resolved;
}
function shouldEnforceDefaultPluginGatewayAuth(pathContext) {
	return pathContext.malformedEncoding || pathContext.decodePassLimitReached || isProtectedPluginRoutePathFromContext(pathContext);
}
//#endregion
//#region src/gateway/server-http-probes.ts
const getHttpAuthUtilsModule$2 = createLazyRuntimeModule(() => import("./http-auth-utils-Ch-bU14B.js"));
async function shouldIncludeGatewayProbeDetails(params) {
	if (isLocalDirectRequest(params.req, params.trustedProxies, params.allowRealIpFallback)) return true;
	if (params.resolvedAuth.mode === "none") return false;
	const { getBearerToken, resolveHttpBrowserOriginPolicy } = await getHttpAuthUtilsModule$2();
	const bearerToken = getBearerToken(params.req);
	return (await authorizeHttpGatewayConnect({
		auth: params.resolvedAuth,
		connectAuth: bearerToken ? {
			token: bearerToken,
			password: bearerToken
		} : null,
		req: params.req,
		trustedProxies: params.trustedProxies,
		allowRealIpFallback: params.allowRealIpFallback,
		browserOriginPolicy: resolveHttpBrowserOriginPolicy(params.req)
	})).ok;
}
function startupProbeBody(result, includeDetails) {
	if (!includeDetails) return JSON.stringify({
		ok: result.ok,
		status: result.status
	});
	return JSON.stringify({
		ok: result.ok,
		status: result.status,
		version: resolveRuntimeServiceVersion(process.env),
		uptimeMs: result.uptimeMs,
		...result.status === "starting" ? { pendingReason: result.pendingReason } : {}
	});
}
/** Handles live/ready/startup probe endpoints before normal gateway routing. */
async function handleGatewayProbeRequest(req, res, requestPath, resolvedAuth, trustedProxies, allowRealIpFallback, getReadiness, getStartup) {
	const status = classifyGatewayProbePath(requestPath);
	if (status === "namespace" || status === "outside") return false;
	const method = (req.method ?? "GET").toUpperCase();
	if (method !== "GET" && method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Allow", "GET, HEAD");
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	res.setHeader("Cache-Control", "no-store");
	let statusCode;
	let body;
	if (status === "ready" && getReadiness) {
		const includeDetails = await shouldIncludeGatewayProbeDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback
		});
		try {
			const result = getReadiness();
			statusCode = result.ready ? 200 : 503;
			body = JSON.stringify(includeDetails ? result : { ready: result.ready });
		} catch {
			statusCode = 503;
			body = JSON.stringify(includeDetails ? {
				ready: false,
				failing: ["internal"],
				uptimeMs: 0
			} : { ready: false });
		}
	} else if (status === "startup") {
		const includeDetails = await shouldIncludeGatewayProbeDetails({
			req,
			resolvedAuth,
			trustedProxies,
			allowRealIpFallback
		});
		try {
			const result = getStartup?.() ?? {
				ok: true,
				status: "started",
				uptimeMs: 0
			};
			statusCode = result.ok ? 200 : 503;
			body = startupProbeBody(result, includeDetails);
		} catch {
			const result = {
				ok: false,
				status: "starting",
				uptimeMs: 0,
				pendingReason: "internal"
			};
			statusCode = 503;
			body = startupProbeBody(result, includeDetails);
		}
	} else {
		statusCode = 200;
		body = JSON.stringify({
			ok: true,
			status
		});
	}
	res.statusCode = statusCode;
	res.setHeader("Content-Length", String(Buffer.byteLength(body)));
	res.end(method === "HEAD" ? void 0 : body);
	return true;
}
//#endregion
//#region src/gateway/server-http-upgrades.ts
const getPluginNodeCapabilityAuthModule$1 = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-CS-u7A9N.js"));
const getHttpAuthUtilsModule$1 = createLazyRuntimeModule(() => import("./http-auth-utils-Ch-bU14B.js"));
const getPluginRouteRuntimeScopesModule$1 = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-BSseXytL.js"));
function writeUpgradeAuthFailure(socket, auth) {
	if (auth.rateLimited) {
		const retryAfterSeconds = auth.retryAfterMs && auth.retryAfterMs > 0 ? Math.ceil(auth.retryAfterMs / 1e3) : void 0;
		const body = JSON.stringify({ error: {
			message: "Too many failed authentication attempts. Please try again later.",
			type: "rate_limited"
		} });
		socket.write([
			"HTTP/1.1 429 Too Many Requests",
			...retryAfterSeconds ? [`Retry-After: ${retryAfterSeconds}`] : [],
			"Content-Type: application/json; charset=utf-8",
			`Content-Length: ${Buffer.byteLength(body, "utf8")}`,
			"Connection: close",
			"",
			body
		].join("\r\n"));
		return;
	}
	socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
}
function handleBudgetedGatewayWebSocketUpgrade(params) {
	const { req, socket, head, wss, preauthConnectionBudget, preauthBudgetKey, ingressName } = params;
	if (isGatewayWorkAdmissionClosed() && (ingressName === "Worker" || isGatewayRestartDraining() || getGatewaySuspendAdmissionPhase() !== "prepared")) {
		writeGatewayUpgradeServiceUnavailable(socket, `${ingressName} websocket admission closed`);
		socket.destroy();
		return;
	}
	if (wss.listenerCount("connection") === 0) {
		writeGatewayUpgradeServiceUnavailable(socket, `${ingressName} websocket handlers unavailable`);
		socket.destroy();
		return;
	}
	if (!preauthConnectionBudget.acquire(preauthBudgetKey)) {
		writeGatewayUpgradeServiceUnavailable(socket, "Too many unauthenticated sockets");
		socket.destroy();
		return;
	}
	let budgetTransferred = false;
	const releaseUpgradeBudget = () => {
		if (!budgetTransferred) {
			budgetTransferred = true;
			preauthConnectionBudget.release(preauthBudgetKey);
		}
	};
	socket.once("close", releaseUpgradeBudget);
	try {
		wss.handleUpgrade(req, socket, head, (ws) => {
			const ingressSocket = ws;
			ingressSocket["__openclawPreauthBudgetKey"] = preauthBudgetKey;
			params.prepareSocket?.(ingressSocket);
			wss.emit("connection", ws, req);
			if (ingressSocket["__openclawPreauthBudgetClaimed"]) {
				budgetTransferred = true;
				socket.off("close", releaseUpgradeBudget);
			}
		});
	} catch (error) {
		socket.off("close", releaseUpgradeBudget);
		releaseUpgradeBudget();
		throw error;
	}
}
/** Attaches WebSocket and plugin-upgrade routing to an already-created HTTP server. */
function attachGatewayUpgradeHandler(opts) {
	const { httpServer, wss, handlePluginUpgrade, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, clients, preauthConnectionBudget, resolvedAuth, rateLimiter, publicRateLimiter, workerIngressEnabled, log } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	httpServer.on("upgrade", (req, socket, head) => {
		runWithDiagnosticTraceContext(createDiagnosticTraceContext(), async () => {
			const configSnapshot = getRuntimeConfig();
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const requestClientIp = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback);
			const originalRequestPath = URL.parse(req.url ?? "/", "http://localhost")?.pathname;
			const originalWorkerGatewayRoute = originalRequestPath ? classifyWorkerGatewayPath(originalRequestPath) : "outside";
			if (originalWorkerGatewayRoute === "worker" && !workerIngressEnabled) {
				writeGatewayUpgradeServiceUnavailable(socket, "Worker websocket ingress unavailable");
				socket.destroy();
				return;
			}
			if (originalWorkerGatewayRoute === "worker") {
				const rateCheck = publicRateLimiter?.check(requestClientIp, AUTH_RATE_LIMIT_SCOPE_WORKER_ADMISSION);
				if (rateCheck && !rateCheck.allowed) {
					writeUpgradeAuthFailure(socket, {
						ok: false,
						reason: "rate_limited",
						rateLimited: true,
						retryAfterMs: rateCheck.retryAfterMs
					});
					socket.destroy();
					return;
				}
				try {
					handleBudgetedGatewayWebSocketUpgrade({
						req,
						socket,
						head,
						wss,
						preauthConnectionBudget,
						preauthBudgetKey: requestClientIp,
						ingressName: "Worker",
						prepareSocket: (workerSocket) => {
							workerSocket[GATEWAY_WS_CONNECTION_KIND_PROPERTY] = "worker";
							workerSocket[GATEWAY_WS_WORKER_INGRESS_PROPERTY] = "public";
							markPublicWorkerIngress(workerSocket, {
								clientIp: requestClientIp,
								rateLimiter: publicRateLimiter
							});
						}
					});
				} catch {
					throw new Error("public worker websocket upgrade failed");
				}
				return;
			}
			if (originalWorkerGatewayRoute !== "outside") {
				socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
				socket.destroy();
				return;
			}
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				writeUpgradeAuthFailure(socket, {
					ok: false,
					reason: "unauthorized"
				});
				socket.destroy();
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const resolvedAuthLocal = getResolvedAuth();
			const requestPath = scopedNodeCapability.pathname;
			const pathContext = resolvePluginRoutePathContext(requestPath);
			if (classifyWorkerGatewayPath(requestPath) !== "outside") {
				socket.write("HTTP/1.1 404 Not Found\r\nConnection: close\r\n\r\n");
				socket.destroy();
				return;
			}
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pathContext);
			if (nodeCapability) {
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule$1();
				const ok = await authorizePluginNodeCapabilityRequest({
					req,
					auth: resolvedAuthLocal,
					trustedProxies,
					allowRealIpFallback,
					clients,
					nodeCapability,
					capability: scopedNodeCapability.capability,
					malformedScopedPath: scopedNodeCapability.malformedScopedPath,
					rateLimiter
				});
				if (!ok.ok) {
					writeUpgradeAuthFailure(socket, ok);
					socket.destroy();
					return;
				}
			}
			if (handlePluginUpgrade) {
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginGatewayRequestOperatorScopes;
				if ((shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pathContext) && !(await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(requestPath)) {
					const { checkGatewayHttpRequestAuth } = await getHttpAuthUtilsModule$1();
					const authCheck = await checkGatewayHttpRequestAuth({
						req,
						auth: resolvedAuthLocal,
						trustedProxies,
						allowRealIpFallback,
						rateLimiter,
						cfg: configSnapshot
					});
					if (!authCheck.ok) {
						writeUpgradeAuthFailure(socket, authCheck.authResult);
						socket.destroy();
						return;
					}
					pluginGatewayAuthSatisfied = true;
					pluginGatewayRequestAuth = authCheck.requestAuth;
					const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule$1();
					pluginGatewayRequestOperatorScopes = resolvePluginRouteRuntimeOperatorScopes(req, authCheck.requestAuth);
				}
				if (await handlePluginUpgrade(req, socket, head, pathContext, {
					gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
					gatewayRequestAuth: pluginGatewayRequestAuth,
					gatewayRequestOperatorScopes: pluginGatewayRequestOperatorScopes,
					gatewayRequestClientIp: requestClientIp
				})) return;
			}
			if (requestPath === "/desktop/observe") {
				if (!opts.desktopSessionRegistry) {
					writeGatewayUpgradeServiceUnavailable(socket, "desktop observe unavailable");
					socket.destroy();
					return;
				}
				if (isGatewayWorkAdmissionClosed()) {
					writeGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
					socket.destroy();
					return;
				}
				const { handleDesktopObserveUpgrade } = await import("./observe-bridge-0xkj9jpR.js");
				handleDesktopObserveUpgrade(req, socket, head, { registry: opts.desktopSessionRegistry });
				return;
			}
			if (requestPath === "/node-desktop/attach") {
				const context = opts.getGatewayRequestContext?.();
				if (!opts.nodeDesktopStreamBroker || !context) {
					writeGatewayUpgradeServiceUnavailable(socket, "node desktop attach unavailable");
					socket.destroy();
					return;
				}
				if (isGatewayWorkAdmissionClosed()) {
					writeGatewayUpgradeServiceUnavailable(socket, "Gateway websocket admission closed");
					socket.destroy();
					return;
				}
				await opts.nodeDesktopStreamBroker.handleUpgrade(req, socket, head, context.nodeRegistry);
				return;
			}
			try {
				handleBudgetedGatewayWebSocketUpgrade({
					req,
					socket,
					head,
					wss,
					preauthConnectionBudget,
					preauthBudgetKey: requestClientIp,
					ingressName: "Gateway"
				});
			} catch {
				throw new Error("gateway websocket upgrade failed");
			}
		}).catch((err) => {
			const remoteAddress = socket.remoteAddress ?? "unknown";
			const errorMessage = err instanceof Error ? err.message : String(err);
			log?.warn(`ws upgrade error from ${remoteAddress}: ${errorMessage}`);
			socket.destroy();
		});
	});
}
/** Attach the loopback-only worker ingress and force every accepted socket into worker mode. */
function attachWorkerGatewayUpgradeHandler(params) {
	params.httpServer.on("upgrade", (req, socket, head) => {
		try {
			handleBudgetedGatewayWebSocketUpgrade({
				req,
				socket,
				head,
				wss: params.wss,
				preauthConnectionBudget: params.preauthConnectionBudget,
				preauthBudgetKey: req.socket.remoteAddress,
				ingressName: "Worker",
				prepareSocket: (workerSocket) => {
					workerSocket[GATEWAY_WS_CONNECTION_KIND_PROPERTY] = "worker";
					workerSocket[GATEWAY_WS_PREAUTH_BUDGET_PROPERTY] = params.preauthConnectionBudget;
					workerSocket[GATEWAY_WS_WORKER_INGRESS_PROPERTY] = "loopback";
				}
			});
		} catch (error) {
			params.log?.warn(`worker websocket upgrade failed: ${error instanceof Error ? error.message : String(error)}`);
			socket.destroy();
		}
	});
}
//#endregion
//#region src/gateway/server-http.ts
const getControlUiModule = createLazyRuntimeModule(() => import("./control-ui-KQIq6RJl.js"));
const getCanvasServeModule = createLazyRuntimeModule(() => import("./serve.runtime.js"));
const getBoardHttpModule = createLazyRuntimeModule(() => import("./board-http-OslblxxJ.js"));
const getEmbeddingsHttpModule = createLazyRuntimeModule(() => import("./embeddings-http-B-_f6Vfd.js"));
const getManagedMediaAttachmentsModule = createLazyRuntimeModule(() => import("./managed-image-attachments-CNEncErH.js"));
const getMcpAppStandaloneModule = createLazyRuntimeModule(() => import("./mcp-app-standalone-B5-NKand.js"));
const getPluginIconHttpModule = createLazyRuntimeModule(() => import("./plugin-icon-http-DNgNIssZ.js"));
const getWorkspaceIconHttpModule = createLazyRuntimeModule(() => import("./workspace-icon-http-2qhpGoHQ.js"));
const getModelsHttpModule = createLazyRuntimeModule(() => import("./models-http-CAam9Jva.js"));
const getOpenAiHttpModule = createLazyRuntimeModule(() => import("./openai-http-BEBWVPB0.js"));
const getOpenResponsesHttpModule = createLazyRuntimeModule(() => import("./openresponses-http-CJMBV98S.js"));
const getSessionHistoryHttpModule = createLazyRuntimeModule(() => import("./sessions-history-http-DllXxxV7.js"));
const getSessionKillHttpModule = createLazyRuntimeModule(() => import("./session-kill-http-B2sPHd-P.js"));
const getToolsInvokeHttpModule = createLazyRuntimeModule(() => import("./tools-invoke-http-CyU6cDYL.js"));
const getUserProfilesHttpModule = createLazyRuntimeModule(() => import("./user-profiles-http-D43m36rI.js"));
const getDevicePairingJoinHttpModule = createLazyRuntimeModule(() => import("./device-pairing-join-http-DaIuVVvo.js"));
const getPluginNodeCapabilityAuthModule = createLazyRuntimeModule(() => import("./plugin-node-capability-auth-CS-u7A9N.js"));
const getHttpAuthUtilsModule = createLazyRuntimeModule(() => import("./http-auth-utils-Ch-bU14B.js"));
const getPluginRouteRuntimeScopesModule = createLazyRuntimeModule(() => import("./plugin-route-runtime-scopes-BSseXytL.js"));
function isWebSocketUpgradeRequest(req) {
	const headerContains = (value, token) => (typeof value === "string" ? [value] : value ?? []).some((entry) => entry.toLowerCase().split(",").some((part) => part.trim() === token));
	return headerContains(req.headers.upgrade, "websocket") && headerContains(req.headers.connection, "upgrade");
}
async function runGatewayHttpRequestStages(stages) {
	for (const stage of stages) try {
		if (await stage.run()) return true;
	} catch (err) {
		if (!stage.continueOnError) throw err;
		console.error(`[gateway-http] stage "${stage.name}" threw — skipping:`, err);
	}
	return false;
}
/** Creates the gateway HTTP/HTTPS server and ordered request-stage router. */
function createGatewayHttpServer(opts) {
	const { clients, controlUiEnabled, controlUiBasePath, controlUiRoot, openAiChatCompletionsEnabled, openAiChatCompletionsConfig, openResponsesEnabled, openResponsesConfig, strictTransportSecurityHeader, handleHooksRequest, handlePluginRequest, shouldEnforcePluginGatewayAuth, resolvePluginNodeCapabilityRoute, resolvedAuth, rateLimiter, joinRateLimiter, getReadiness, getStartup } = opts;
	const getResolvedAuth = opts.getResolvedAuth ?? (() => resolvedAuth);
	const loadGatewayConfig = opts.getRuntimeConfig ?? getRuntimeConfig;
	const openAiCompatEnabled = openAiChatCompletionsEnabled || openResponsesEnabled;
	const controlUiRouteBasePath = controlUiBasePath && controlUiBasePath !== "/" ? controlUiBasePath.replace(/\/$/, "") : "";
	const handleServerRequest = (req, res) => {
		runWithDiagnosticTraceContext(createDiagnosticTraceContext(), () => handleRequest(req, res)).catch((error) => {
			console.error("[gateway-http] failed to finalize request:", error);
			if (!res.destroyed) res.destroy(error instanceof Error ? error : void 0);
		});
	};
	const httpServer = opts.tlsOptions ? createServer$2(opts.tlsOptions, handleServerRequest) : createServer$1(handleServerRequest);
	async function handleRequest(req, res) {
		setDefaultSecurityHeaders(res, { strictTransportSecurity: strictTransportSecurityHeader });
		if (isWebSocketUpgradeRequest(req)) return;
		if (req.headers.upgrade !== void 0) {
			res.statusCode = 400;
			res.setHeader("Connection", "close");
			res.setHeader("Content-Type", "text/plain; charset=utf-8");
			res.end("Bad Request");
			return;
		}
		try {
			const requestPath = URL.parse(req.url ?? "/", "http://localhost")?.pathname;
			if (requestPath === void 0) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (classifyGatewayProbePath(requestPath) === "live") {
				await handleGatewayProbeRequest(req, res, requestPath, getResolvedAuth(), [], false, getReadiness, getStartup);
				return;
			}
			const configSnapshot = loadGatewayConfig();
			const trustedProxies = configSnapshot.gateway?.trustedProxies ?? [];
			const allowRealIpFallback = configSnapshot.gateway?.allowRealIpFallback === true;
			const scopedNodeCapability = normalizePluginNodeCapabilityScopedUrl(req.url ?? "/");
			if (scopedNodeCapability.malformedScopedPath) {
				sendGatewayAuthFailure(res, {
					ok: false,
					reason: "unauthorized"
				});
				return;
			}
			if (scopedNodeCapability.rewrittenUrl) req.url = scopedNodeCapability.rewrittenUrl;
			const scopedRequestPath = scopedNodeCapability.pathname;
			const pluginPathContext = resolvePluginRoutePathContext(scopedRequestPath);
			const nodeCapability = resolvePluginNodeCapabilityRoute?.(pluginPathContext);
			const resolvedAuthValue = getResolvedAuth();
			const routeAuth = {
				auth: resolvedAuthValue,
				trustedProxies,
				allowRealIpFallback,
				rateLimiter
			};
			const controlUiRouteOptions = {
				basePath: controlUiBasePath,
				config: configSnapshot,
				...routeAuth
			};
			const handleControlUiRequest = async () => (await getControlUiModule()).handleControlUiHttpRequest(req, res, {
				...controlUiRouteOptions,
				terminalEnabled: opts.isTerminalEnabled?.() ?? isTerminalConfigEnabled(configSnapshot),
				agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId,
				root: controlUiRoot
			});
			const requestStages = [{
				name: "gateway-probes",
				run: () => handleGatewayProbeRequest(req, res, scopedRequestPath, resolvedAuthValue, trustedProxies, allowRealIpFallback, getReadiness, getStartup)
			}];
			const addRequestStage = (name, enabled, run, admitted = false) => {
				if (enabled) requestStages.push({
					name,
					run: admitted ? () => runWithGatewayHttpWorkAdmission(res, run) : run
				});
			};
			const addAdmittedStage = (name, enabled, run) => addRequestStage(name, enabled, run, true);
			addRequestStage("worker-gateway", classifyWorkerGatewayPath(scopedRequestPath) !== "outside", () => {
				respondNotFound(res);
				return true;
			});
			addAdmittedStage("worker-transfer", classifyNodeWorkspaceTransferPath(scopedRequestPath) !== "outside", () => handleNodeWorkspaceTransferHttpRequest({
				req,
				res,
				clientIp: resolveRequestClientIp(req, trustedProxies, allowRealIpFallback),
				rateLimiter: joinRateLimiter,
				callback: opts.handleNodeWorkspaceTransferRequest
			}));
			const devicePairingJoinShortcode = parseDevicePairingJoinRequestPath(scopedRequestPath);
			if (devicePairingJoinShortcode !== null) addAdmittedStage("device-pairing-join", true, async () => (await getDevicePairingJoinHttpModule()).handleDevicePairingJoinHttpRequest({
				req,
				res,
				shortcode: devicePairingJoinShortcode,
				clientIp: resolveRequestClientIp(req, trustedProxies, allowRealIpFallback),
				rateLimiter: joinRateLimiter
			}));
			addAdmittedStage("mcp-oauth-callback", req.method === "GET" && scopedRequestPath === "/oauth/mcp/callback" && Boolean(opts.handleMcpOAuthCallbackRequest), () => opts.handleMcpOAuthCallbackRequest?.(req, res) ?? false);
			addRequestStage("hooks", true, () => handleHooksRequest(req, res));
			addAdmittedStage("watch-node", Boolean(opts.handleWatchNodeRequest) && scopedRequestPath.startsWith("/api/nodes/watch/"), () => opts.handleWatchNodeRequest?.(req, res) ?? false);
			addAdmittedStage("models", openAiCompatEnabled && (scopedRequestPath === "/v1/models" || scopedRequestPath.startsWith("/v1/models/")), async () => (await getModelsHttpModule()).handleOpenAiModelsHttpRequest(req, res, routeAuth));
			addAdmittedStage("embeddings", openAiCompatEnabled && scopedRequestPath === "/v1/embeddings", async () => (await getEmbeddingsHttpModule()).handleOpenAiEmbeddingsHttpRequest(req, res, routeAuth));
			addAdmittedStage("tools-invoke", scopedRequestPath === "/tools/invoke", async () => (await getToolsInvokeHttpModule()).handleToolsInvokeHttpRequest(req, res, routeAuth));
			addAdmittedStage("sessions-kill", /^\/sessions\/[^/]+\/kill$/.test(scopedRequestPath), async () => (await getSessionKillHttpModule()).handleSessionKillHttpRequest(req, res, routeAuth));
			addAdmittedStage("sessions-history", /^\/sessions\/[^/]+\/history$/.test(scopedRequestPath), async () => (await getSessionHistoryHttpModule()).handleSessionHistoryHttpRequest(req, res, {
				...routeAuth,
				getResolvedAuth
			}));
			addAdmittedStage("board-widget", scopedRequestPath.startsWith("/__openclaw__/board/"), async () => (await getBoardHttpModule()).handleBoardHttpRequest(req, res));
			const userProfileAvatarPath = canonicalizeUserProfileAvatarPath(scopedRequestPath, controlUiRouteBasePath);
			addAdmittedStage("user-profile-avatar", userProfileAvatarPath !== void 0, async () => (await getUserProfilesHttpModule()).handleUserProfileAvatarHttpRequest(req, res, userProfileAvatarPath ?? scopedRequestPath, routeAuth));
			addAdmittedStage("openresponses", openResponsesEnabled && scopedRequestPath === "/v1/responses", async () => (await getOpenResponsesHttpModule()).handleOpenResponsesHttpRequest(req, res, {
				...routeAuth,
				config: openResponsesConfig
			}));
			addAdmittedStage("openai", openAiChatCompletionsEnabled && scopedRequestPath === "/v1/chat/completions", async () => (await getOpenAiHttpModule()).handleOpenAiHttpRequest(req, res, {
				...routeAuth,
				config: openAiChatCompletionsConfig
			}));
			addRequestStage("control-ui-approval-document", isControlUiApprovalDocumentPath({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath
			}), async () => {
				if (!controlUiEnabled) {
					respondNotFound(res);
					return true;
				}
				if (await handleControlUiRequest()) return true;
				respondNotFound(res);
				return true;
			});
			addRequestStage("node-capability-auth", Boolean(nodeCapability), async () => {
				const { authorizePluginNodeCapabilityRequest } = await getPluginNodeCapabilityAuthModule();
				const ok = await authorizePluginNodeCapabilityRequest({
					req,
					auth: resolvedAuthValue,
					trustedProxies,
					allowRealIpFallback,
					clients,
					nodeCapability,
					capability: scopedNodeCapability.capability,
					malformedScopedPath: scopedNodeCapability.malformedScopedPath,
					rateLimiter
				});
				if (!ok.ok) {
					sendGatewayAuthFailure(res, ok);
					return true;
				}
				return false;
			});
			addRequestStage("canvas-documents", Boolean(nodeCapability) && isCoreCanvasHostEnabled(configSnapshot) && isCanvasDocumentHttpPath(scopedRequestPath), async () => (await getCanvasServeModule()).handleCanvasDocumentHttpRequest(req, res));
			addRequestStage("control-ui-plugin-manager", controlUiEnabled && isControlUiPluginManagerRequest({
				basePath: controlUiBasePath,
				pathname: scopedRequestPath,
				method: req.method
			}), handleControlUiRequest);
			const mcpAppRoute = classifyMcpAppStandalonePath(scopedRequestPath);
			if (configSnapshot.mcp?.apps?.enabled === true && (mcpAppRoute === "shell" || mcpAppRoute === "view")) requestStages.push({
				name: "mcp-app-standalone",
				run: async () => await runWithGatewayHttpWorkAdmission(res, async () => {
					return await (await getMcpAppStandaloneModule()).handleMcpAppStandaloneHttpRequest(req, res, {
						sandboxPort: configSnapshot.mcp?.apps?.sandboxPort,
						sandboxOrigin: configSnapshot.mcp?.apps?.sandboxOrigin
					});
				})
			});
			if (handlePluginRequest) {
				const requestClientIp = resolveRequestClientIp(req, trustedProxies, allowRealIpFallback);
				let pluginGatewayAuthSatisfied = false;
				let pluginGatewayRequestAuth;
				let pluginRequestOperatorScopes;
				requestStages.push({
					name: "plugin-auth",
					run: async () => {
						if (!(shouldEnforcePluginGatewayAuth ?? shouldEnforceDefaultPluginGatewayAuth)(pluginPathContext) || (await getCachedPluginGatewayAuthBypassPaths(configSnapshot)).has(scopedRequestPath)) return false;
						const { authorizePluginGatewayHttpRequestOrReply } = await getHttpAuthUtilsModule();
						const { resolvePluginRouteRuntimeOperatorScopes } = await getPluginRouteRuntimeScopesModule();
						const authResult = await authorizePluginGatewayHttpRequestOrReply({
							req,
							res,
							...routeAuth,
							requestPath: scopedRequestPath,
							resolveOperatorScopes: resolvePluginRouteRuntimeOperatorScopes
						});
						if (!authResult) return true;
						pluginGatewayAuthSatisfied = true;
						pluginGatewayRequestAuth = authResult.requestAuth;
						pluginRequestOperatorScopes = authResult.operatorScopes;
						return false;
					}
				}, {
					name: "plugin-http",
					continueOnError: true,
					run: () => handlePluginRequest(req, res, pluginPathContext, {
						gatewayAuthSatisfied: pluginGatewayAuthSatisfied,
						gatewayRequestAuth: pluginGatewayRequestAuth,
						gatewayRequestOperatorScopes: pluginRequestOperatorScopes,
						gatewayRequestClientIp: requestClientIp
					})
				});
			}
			addRequestStage("chat-managed-media", scopedRequestPath.startsWith("/api/chat/media/outgoing/") || controlUiRouteBasePath.length > 0 && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/api/chat/media/outgoing/`), async () => (await getManagedMediaAttachmentsModule()).handleManagedOutgoingMediaHttpRequest(req, res, {
				...routeAuth,
				basePath: controlUiRouteBasePath
			}));
			addRequestStage("control-ui-catalog-icon", controlUiEnabled && ["/__openclaw__/plugin-icon", "/__openclaw__/catalog-icon"].some((prefix) => scopedRequestPath.startsWith(`${controlUiRouteBasePath}${prefix}/`)), async () => (await getPluginIconHttpModule()).handlePluginIconHttpRequest(req, res, controlUiRouteOptions));
			addRequestStage("control-ui-workspace-icon", controlUiEnabled && scopedRequestPath.startsWith(`${controlUiRouteBasePath}/__openclaw__/workspace-icon/`), async () => (await getWorkspaceIconHttpModule()).handleWorkspaceIconHttpRequest(req, res, controlUiRouteOptions));
			addRequestStage("control-ui-assistant-media", controlUiEnabled, async () => (await getControlUiModule()).handleControlUiAssistantMediaRequest(req, res, {
				...controlUiRouteOptions,
				agentId: resolveAssistantIdentity({ cfg: configSnapshot }).agentId
			}));
			addRequestStage("control-ui-avatar", controlUiEnabled, async () => (await getControlUiModule()).handleControlUiAvatarRequest(req, res, controlUiRouteOptions));
			addRequestStage("control-ui-http", controlUiEnabled, handleControlUiRequest);
			if (await runGatewayHttpRequestStages(requestStages)) return;
			if (opts.isStartupPluginRuntimeReady?.() === false) {
				res.setHeader("Cache-Control", "no-store");
				res.setHeader("Retry-After", "1");
				respondPlainText(res, 503, "Plugin runtime is starting");
				return;
			}
			respondNotFound(res);
		} catch (err) {
			console.error("[gateway-http] unhandled error in request handler:", err);
			finishFailedGatewayHttpResponse(res);
		}
	}
	return httpServer;
}
//#endregion
//#region src/gateway/server/preauth-connection-budget.ts
const DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP = 32;
const UNKNOWN_CLIENT_IP_BUDGET_KEY = "__openclaw_unknown_client_ip__";
function getMaxPreauthConnectionsPerIpFromEnv(env = process.env) {
	const configured = env.OPENCLAW_MAX_PREAUTH_CONNECTIONS_PER_IP || (isVitestRuntimeEnv(env) ? env.OPENCLAW_TEST_MAX_PREAUTH_CONNECTIONS_PER_IP : void 0);
	if (!configured) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	const parsed = parseStrictPositiveInteger(configured);
	if (parsed === void 0) return DEFAULT_MAX_PREAUTH_CONNECTIONS_PER_IP;
	return parsed;
}
function createPreauthConnectionBudget(limit = getMaxPreauthConnectionsPerIpFromEnv()) {
	const maxConnectionsPerIp = resolveIntegerOption(limit, getMaxPreauthConnectionsPerIpFromEnv(), { min: 1 });
	const counts = /* @__PURE__ */ new Map();
	const normalizeBudgetKey = (clientIp) => {
		return clientIp?.trim() || UNKNOWN_CLIENT_IP_BUDGET_KEY;
	};
	return {
		acquire(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const next = (counts.get(ip) ?? 0) + 1;
			if (next > maxConnectionsPerIp) return false;
			counts.set(ip, next);
			return true;
		},
		release(clientIp) {
			const ip = normalizeBudgetKey(clientIp);
			const current = counts.get(ip);
			if (current === void 0) return;
			if (current <= 1) {
				counts.delete(ip);
				return;
			}
			counts.set(ip, current - 1);
		}
	};
}
//#endregion
//#region src/gateway/server-runtime-state.ts
const loadGatewayPluginsHttpModule = async () => await import("./plugins-http-C6OrmAL-.js");
function hasMatchingGatewayPluginRoute(registry, pathContext, requiresUpgrade) {
	if (!pathContext) return (registry.httpRoutes ?? []).length > 0;
	const matchingRoutes = findMatchingPluginHttpRoutes(registry, pathContext);
	return requiresUpgrade ? matchingRoutes.some((route) => typeof route.handleUpgrade === "function") : matchingRoutes.length > 0;
}
/** Creates the HTTP/WebSocket transport for one gateway start. */
async function createGatewayHttpTransport(params) {
	const loadRuntimeConfig = params.getRuntimeConfig ?? (() => params.cfg);
	const resolvePluginRouteRegistry = () => params.getPluginRouteRegistry?.() ?? params.pluginRegistry;
	let loadedHooksRequestHandler = null;
	const handleHooksRequest = async (req, res) => {
		const hooksConfig = params.hooksConfig();
		if (!hooksConfig) return false;
		const url = new URL(req.url ?? "/", "http://localhost");
		const basePath = hooksConfig.basePath;
		if (url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) return false;
		return await runWithGatewayHttpWorkAdmission(res, async () => {
			if (!loadedHooksRequestHandler) {
				const { createGatewayHooksRequestHandler } = await import("./hooks-C2H99l4H.js");
				loadedHooksRequestHandler = createGatewayHooksRequestHandler({
					deps: params.deps,
					getHooksConfig: params.hooksConfig,
					getClientIpConfig: params.getHookClientIpConfig,
					bindHost: params.bindHost,
					port: params.port,
					logHooks: params.logHooks
				});
			}
			return await loadedHooksRequestHandler(req, res);
		});
	};
	const handleMcpOAuthCallbackRequest = async (req, res) => {
		const { handleMcpOAuthCallback } = await import("./mcp-oauth-callback-Clkt0SGk.js");
		return await handleMcpOAuthCallback(req, res, {
			config: loadRuntimeConfig(),
			log: params.log
		});
	};
	let loadedPluginRequestHandler = null;
	let loadedPluginUpgradeHandler = null;
	const handlePluginRequest = async (req, res, pathContext, dispatchContext) => {
		if (loadedPluginRequestHandler) return await loadedPluginRequestHandler(req, res, pathContext, dispatchContext);
		if (!hasMatchingGatewayPluginRoute(resolvePluginRouteRegistry(), pathContext, false)) return false;
		const { createGatewayPluginRequestHandler } = await loadGatewayPluginsHttpModule();
		loadedPluginRequestHandler = createGatewayPluginRequestHandler({
			registry: params.pluginRegistry,
			getRouteRegistry: resolvePluginRouteRegistry,
			log: params.logPlugins,
			getGatewayRequestContext: params.getGatewayRequestContext
		});
		return await loadedPluginRequestHandler(req, res, pathContext, dispatchContext);
	};
	const handlePluginUpgrade = async (req, socket, head, pathContext, dispatchContext) => {
		if (loadedPluginUpgradeHandler) return await loadedPluginUpgradeHandler(req, socket, head, pathContext, dispatchContext);
		if (!hasMatchingGatewayPluginRoute(resolvePluginRouteRegistry(), pathContext, true)) return false;
		const { createGatewayPluginUpgradeHandler } = await loadGatewayPluginsHttpModule();
		loadedPluginUpgradeHandler = createGatewayPluginUpgradeHandler({
			registry: params.pluginRegistry,
			getRouteRegistry: resolvePluginRouteRegistry,
			log: params.logPlugins,
			getGatewayRequestContext: params.getGatewayRequestContext
		});
		return await loadedPluginUpgradeHandler(req, socket, head, pathContext, dispatchContext);
	};
	const shouldEnforcePluginGatewayAuth = (pathContext) => {
		return shouldEnforceGatewayAuthForPluginPath(resolvePluginRouteRegistry(), pathContext);
	};
	const resolvePluginNodeCapabilityRoute = (pathContext) => {
		const coreCanvasCapability = isCoreCanvasHostEnabled(loadRuntimeConfig()) ? resolveCanvasNodeCapability(pathContext.candidates) : void 0;
		if (coreCanvasCapability) return coreCanvasCapability;
		return findMatchingPluginNodeCapabilityRoute(resolvePluginRouteRegistry(), pathContext)?.nodeCapability;
	};
	const bindHosts = await resolveGatewayListenHosts(params.bindHost);
	if (!isLoopbackHost(params.bindHost)) params.log.warn("⚠️  Gateway is binding to a non-loopback address. Ensure authentication is configured before exposing to public networks.");
	if (params.cfg.gateway?.controlUi?.dangerouslyAllowHostHeaderOriginFallback === true) params.log.warn("⚠️  gateway.controlUi.dangerouslyAllowHostHeaderOriginFallback=true is enabled. Host-header origin fallback weakens origin checks and should only be used as break-glass.");
	const wss = new WebSocketServer({
		noServer: true,
		maxPayload: MAX_PREAUTH_PAYLOAD_BYTES
	});
	const preauthConnectionBudget = createPreauthConnectionBudget();
	const workerPreauthConnectionBudget = createPreauthConnectionBudget();
	const httpServers = [];
	const gatewayHttpServers = [];
	const httpBindHosts = [];
	const portalService = createGatewayPortalService({
		httpBindHosts,
		httpServers,
		...params.gatewayTls?.enabled ? { tlsOptions: params.gatewayTls.tlsOptions } : {}
	});
	for (const _ of bindHosts) {
		const httpServer = createGatewayHttpServer({
			clients: params.clients,
			controlUiEnabled: params.controlUiEnabled,
			controlUiBasePath: params.controlUiBasePath,
			controlUiRoot: params.controlUiRoot,
			openAiChatCompletionsEnabled: params.openAiChatCompletionsEnabled,
			openAiChatCompletionsConfig: params.openAiChatCompletionsConfig,
			openResponsesEnabled: params.openResponsesEnabled,
			openResponsesConfig: params.openResponsesConfig,
			strictTransportSecurityHeader: params.strictTransportSecurityHeader,
			handleWatchNodeRequest: params.handleWatchNodeRequest,
			handleHooksRequest,
			handleMcpOAuthCallbackRequest,
			handlePluginRequest,
			shouldEnforcePluginGatewayAuth,
			resolvePluginNodeCapabilityRoute,
			resolvedAuth: params.resolvedAuth,
			getResolvedAuth: params.getResolvedAuth,
			rateLimiter: params.rateLimiter,
			joinRateLimiter: params.joinRateLimiter,
			handleNodeWorkspaceTransferRequest: params.handleNodeWorkspaceTransferRequest,
			getReadiness: params.getReadiness,
			getStartup: params.getStartup,
			getRuntimeConfig: loadRuntimeConfig,
			isStartupPluginRuntimeReady: params.isStartupPluginRuntimeReady,
			isTerminalEnabled: params.isTerminalEnabled,
			tlsOptions: params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0
		});
		attachGatewayUpgradeHandler({
			httpServer,
			wss,
			handlePluginUpgrade,
			shouldEnforcePluginGatewayAuth,
			resolvePluginNodeCapabilityRoute,
			clients: params.clients,
			preauthConnectionBudget,
			resolvedAuth: params.resolvedAuth,
			getResolvedAuth: params.getResolvedAuth,
			rateLimiter: params.rateLimiter,
			publicRateLimiter: params.joinRateLimiter,
			workerIngressEnabled: params.workerIngressEnabled,
			log: params.log,
			desktopSessionRegistry: params.desktopSessionRegistry,
			nodeDesktopStreamBroker: params.nodeDesktopStreamBroker,
			getGatewayRequestContext: params.getGatewayRequestContext
		});
		gatewayHttpServers.push(httpServer);
		httpServers.push(httpServer);
	}
	let workerIngressPort;
	const workerHttpServer = params.workerIngressEnabled ? createServer$1((_req, res) => {
		res.statusCode = 404;
		res.end("Not Found");
	}) : void 0;
	if (workerHttpServer) attachWorkerGatewayUpgradeHandler({
		httpServer: workerHttpServer,
		wss,
		preauthConnectionBudget: workerPreauthConnectionBudget,
		log: params.log
	});
	const httpServer = gatewayHttpServers[0];
	if (!httpServer) throw new Error("Gateway HTTP server failed to start");
	let mcpAppSandboxPort;
	let sandboxHostStartPromise = null;
	let startListeningPromise = null;
	let startListeningComplete = false;
	const startSandboxHost = async () => {
		if (sandboxHostStartPromise) return await sandboxHostStartPromise;
		sandboxHostStartPromise = (async () => {
			if (httpBindHosts.length === 0) throw new Error("Gateway listener must start before the sandbox host");
			const sandboxPort = resolveSandboxHostPort(params.port, params.cfg.mcp?.apps?.sandboxPort);
			const sandboxServers = bindHosts.map(() => createSandboxHostHttpServer(params.gatewayTls?.enabled ? params.gatewayTls.tlsOptions : void 0));
			httpServers.push(...sandboxServers);
			try {
				for (const host of httpBindHosts) {
					const server = sandboxServers[bindHosts.indexOf(host)];
					if (!server) throw new Error(`Missing sandbox host HTTP server for bind host ${host}`);
					await listenGatewayHttpServer({
						httpServer: server,
						bindHost: host,
						port: sandboxPort,
						retryEaddrinuse: false,
						serviceName: "MCP App sandbox",
						endpointScheme: params.gatewayTls?.enabled ? "https" : "http"
					});
				}
			} catch (error) {
				await Promise.all(sandboxServers.map((server) => new Promise((resolve) => {
					if (!server.listening) {
						resolve();
						return;
					}
					server.close(() => resolve());
				})));
				for (const server of sandboxServers) {
					const index = httpServers.indexOf(server);
					if (index >= 0) httpServers.splice(index, 1);
				}
				throw error;
			}
			mcpAppSandboxPort = sandboxPort;
			return sandboxPort;
		})();
		const startAttempt = sandboxHostStartPromise;
		startAttempt.catch(() => {
			if (sandboxHostStartPromise === startAttempt) sandboxHostStartPromise = null;
		});
		return await startAttempt;
	};
	const ensureSandboxHostPort = async () => {
		if (!startListeningComplete) {
			if (!startListeningPromise) throw new Error("Gateway listener must start before the sandbox host");
			await startListeningPromise;
		}
		return await startSandboxHost();
	};
	const startListening = async () => {
		if (startListeningPromise) {
			await startListeningPromise;
			return;
		}
		startListeningPromise = (async () => {
			const requiredAlias = params.bindHost !== "127.0.0.1" && bindHosts.includes("127.0.0.1") ? "127.0.0.1" : void 0;
			const listenOrder = requiredAlias ? [requiredAlias, ...bindHosts.filter((host) => host !== requiredAlias)] : bindHosts;
			const boundHosts = /* @__PURE__ */ new Set();
			for (const host of listenOrder) {
				const index = bindHosts.indexOf(host);
				const server = gatewayHttpServers[index];
				if (!server) throw new Error(`Missing gateway HTTP server for bind host ${host}`);
				const requiredLoopbackAlias = host === requiredAlias;
				try {
					await listenGatewayHttpServer({
						httpServer: server,
						bindHost: host,
						port: params.port,
						retryEaddrinuse: !requiredLoopbackAlias
					});
					boundHosts.add(host);
				} catch (err) {
					if (host === bindHosts[0] || requiredLoopbackAlias) throw err;
					params.log.warn(`gateway: failed to bind loopback alias ${host}:${params.port} (${String(err)})`);
				}
			}
			httpBindHosts.push(...bindHosts.filter((host) => boundHosts.has(host)));
			if (httpBindHosts.length === 0) throw new Error("Gateway HTTP server failed to start");
			if (params.cfg.mcp?.apps?.enabled === true) await startSandboxHost();
			if (workerHttpServer) {
				await listenGatewayHttpServer({
					httpServer: workerHttpServer,
					bindHost: "127.0.0.1",
					port: 0,
					retryEaddrinuse: false
				});
				const address = workerHttpServer.address();
				if (!address || typeof address === "string") throw new Error("Worker gateway ingress failed to resolve its loopback port");
				workerIngressPort = address.port;
				httpServers.push(workerHttpServer);
			}
			startListeningComplete = true;
		})();
		await startListeningPromise;
	};
	return {
		httpServer,
		httpServers,
		httpBindHosts,
		startListening,
		wss,
		preauthConnectionBudget,
		portalService,
		getWorkerIngressEndpoint: () => workerIngressPort === void 0 ? void 0 : {
			host: "127.0.0.1",
			port: workerIngressPort
		},
		getMcpAppSandboxPort: () => mcpAppSandboxPort,
		ensureSandboxHostPort
	};
}
//#endregion
//#region src/gateway/server-startup-finish.ts
const [POST_READY_MAINTENANCE_DELAY_MS, RETAINED_PLUGIN_CLEANUP_DELAY_MS] = [250, 3e4];
async function finishGatewayStartup(params) {
	const { kernelRuntime: runtime, port, opts, log, logHealth, logWsControl, logHooks, logChannels, logCron, logReload, logTailscale, loadGatewayStartupPostAttachModule } = params;
	const { minimalTestGateway, deps, runtimeState, kernel, startupTrace, broadcast, broadcastToConnIds, clients, sharedGatewaySessionGenerationState, controlUiDeviceAuthMigration, workerEnvironmentService, workerPlacementRuntime, terminalLaunchPolicy, terminalSessions, startChannel, stopChannel, getAttachedGatewayMethodRegistry, lifecycle, startupState, pluginRuntime, gatewayTls, bindHost, getResolvedAuth, authRateLimiter, browserAuthRateLimiter, nodeReapprovalCoordinator, preauthHandshakeTimeoutMs, isGatewayStartupPending, attachedGatewayExtraHandlers, startListening, loadStartupPluginsModule, gatewayPluginConfigAtStart, startupActivationSourceConfig, defaultWorkspaceDir, coreGatewayMethodNames, pluginHostServices, baseMethods, startupPluginIds, pluginManifestRecords, pluginLookUpTable, ambientEnvTriggers, replaceAttachedPluginRuntime, refreshAttachedGatewayDiscovery, wss, httpBindHosts, startChannels, broadcastPluginEvent, tailscaleMode, tailscaleConfig, controlUiBasePath, controlUiRootLifecycle, sidecarStartup, workerLiveEvents, earlyRuntime, cfgAtStart, preauthConnectionBudget, releaseStartupAccountStarts, cronReconciliation, postReadyState, cronStartState, prepareReloadCandidate, startupLastGoodSnapshot, startupInternalWriteHash, configSnapshot, channelManager, activateRuntimeSecrets, applyFixedGatewayOverlays, resolveSharedGatewaySessionGenerationForConfig, stopRegisteredPostReadySidecars, chatMetadataLifecycle, gatewayRequestContext, gatewayInstanceRuntime, residentRegistry } = runtime;
	const [{ attachGatewayWsHandlers }, { listPluginNodeCapabilities }] = await startupTrace.measure("gateway.ws-imports", () => Promise.all([import("./server-ws-runtime-Cjs8rMrr.js"), import("./route-capability-CCISCYmy.js")]));
	await startupTrace.measure("gateway.ws-attach", () => attachGatewayWsHandlers({
		wss,
		clients,
		preauthConnectionBudget,
		port,
		gatewayHost: bindHost ?? void 0,
		pluginSurfaceScheme: gatewayTls.enabled ? "https" : "http",
		getPluginNodeCapabilities: () => withCoreCanvasNodeCapability(listPluginNodeCapabilities(pluginRuntime.registry), isCoreCanvasHostEnabled(getRuntimeConfig())),
		getResolvedAuth,
		getRequiredSharedGatewaySessionGeneration: () => getRequiredSharedGatewaySessionGeneration(sharedGatewaySessionGenerationState),
		rateLimiter: authRateLimiter,
		browserRateLimiter: browserAuthRateLimiter,
		nodeReapprovalCoordinator,
		preauthHandshakeTimeoutMs,
		isStartupPending: isGatewayStartupPending,
		isControlUiDeviceAuthMigrationPending: () => controlUiDeviceAuthMigration.pending,
		gatewayMethods: runtimeState.gatewayMethods,
		events: GATEWAY_EVENTS,
		logGateway: log,
		logHealth,
		logWsControl,
		extraHandlers: attachedGatewayExtraHandlers,
		getMethodRegistry: () => getAttachedGatewayMethodRegistry(),
		...workerEnvironmentService ? { workerConnectionService: workerEnvironmentService } : {},
		broadcast,
		context: gatewayRequestContext
	}));
	await startupTrace.measure("http.listen", () => startListening());
	kernel.setDispatchReady(true);
	startupTrace.mark("http.bound");
	let databaseVerifierHandle = null;
	const databaseIntegrityResident = residentRegistry.register({
		name: "database-integrity-verifier",
		start: async () => {
			if (minimalTestGateway) return;
			const { startOpenClawDatabaseIntegrityVerifier } = await import("./openclaw-database-verify-CT9LQYJj.js");
			databaseVerifierHandle = startOpenClawDatabaseIntegrityVerifier({ env: process.env });
			kernel.addGatewayLifetimeSidecar(databaseVerifierHandle);
		},
		stop: async () => await databaseVerifierHandle?.stop()
	});
	const sessionDeliveryRecoveryMaxEnqueuedAt = Date.now();
	let postAttachRuntimeReturned = false;
	let scheduledServicesActivated = false;
	const loadScheduledServicesModule = createLazyPromise(() => import("./server-runtime-services-Cy66ZLGp.js"), { cacheRejections: true });
	const activateScheduledServicesWhenReady = residentRegistry.register({
		name: "scheduled-services",
		start: () => {
			if (lifecycle.closePreludeStarted || !postAttachRuntimeReturned || !startupState.sidecarsReady || scheduledServicesActivated) return;
			scheduledServicesActivated = true;
			loadScheduledServicesModule().then((gatewayRuntimeServices) => {
				if (lifecycle.closePreludeStarted) return;
				const activated = gatewayRuntimeServices.activateGatewayScheduledServices({
					minimalTestGateway,
					cfgAtStart,
					deps,
					sessionDeliveryRecoveryMaxEnqueuedAt,
					cronState: runtimeState.cronState,
					cronReconciliation,
					startCron: false,
					logCron,
					log
				});
				kernel.setScheduledServiceHandles(activated);
			});
		},
		stop: async () => {
			await runtimeState.stopOutboundDeliveryRecovery();
			runtimeState.heartbeatRunner.stop();
		}
	}).start;
	const { createGatewayServerActiveWorkInspectors } = await import("./server-active-work-BN2wnI0d.js");
	const postAttachHandles = await startupTrace.measure("runtime.post-attach", () => loadGatewayStartupPostAttachModule().then(({ startGatewayPostAttachRuntime, stopPostReadySidecarsAfterCloseStarted }) => startGatewayPostAttachRuntime({
		minimalTestGateway,
		cfgAtStart,
		getConfig: getRuntimeConfig,
		bindHost,
		bindHosts: httpBindHosts,
		port,
		tlsEnabled: gatewayTls.enabled,
		log,
		isNixMode,
		startupStartedAt: opts.startupStartedAt,
		broadcastToConnIds,
		getClientConnIds: gatewayRequestContext.getClientConnIds,
		broadcastPluginEvent,
		tailscaleMode,
		resetOnExit: tailscaleConfig.resetOnExit ?? false,
		serviceName: tailscaleConfig.serviceName,
		preserveFunnel: tailscaleConfig.preserveFunnel ?? false,
		controlUiBasePath,
		controlUiRootLifecycle,
		logTailscale,
		gatewayPluginConfigAtStart,
		activationSourceConfig: startupActivationSourceConfig,
		pluginManifestRecords,
		ambientEnvTriggers,
		pluginRegistry: pluginRuntime.registry,
		defaultWorkspaceDir,
		deps,
		startChannels,
		recoveryRuntime: gatewayInstanceRuntime.recovery,
		logHooks,
		logChannels,
		unlockStartupMethods: kernel.unlockStartupMethods,
		refreshChatMetadata: chatMetadataLifecycle.refresh,
		loadStartupPlugins: async () => {
			const { loadGatewayStartupPluginRuntime } = await loadStartupPluginsModule();
			return loadGatewayStartupPluginRuntime({
				cfg: gatewayPluginConfigAtStart,
				activationSourceConfig: startupActivationSourceConfig,
				workspaceDir: runtime.pluginWorkspaceDir,
				log,
				baseMethods,
				coreGatewayMethodNames,
				hostServices: pluginHostServices,
				startupPluginIds,
				pluginLookUpTable,
				startupTrace,
				ambientEnvTriggers
			});
		},
		onStartupPluginsLoading: () => {
			startupState.pendingReason = "startup-sidecars";
		},
		onStartupPluginsLoaded: async (loaded) => {
			replaceAttachedPluginRuntime(loaded);
			startupState.pendingReason = "startup-sidecars";
			await refreshAttachedGatewayDiscovery(loaded.pluginRegistry);
		},
		getCronService: () => runtimeState?.cronState.cron,
		onChannelsStarted: () => {
			releaseStartupAccountStarts();
		},
		onPluginServices: (pluginServices) => {
			kernel.setPluginServices(pluginServices);
		},
		onPostReadySidecars: (postReadySidecars) => {
			kernel.setPostReadySidecars(postReadySidecars);
			stopPostReadySidecarsAfterCloseStarted({
				postReadySidecars,
				closeStarted: lifecycle.closePreludeStarted
			});
			if (lifecycle.closePreludeStarted) kernel.setPostReadySidecars([]);
		},
		onGatewayLifetimeSidecars: (gatewayLifetimeSidecars) => {
			kernel.setGatewayLifetimeSidecars(publishGatewayLifetimeSidecars({
				registered: runtimeState.gatewayLifetimeSidecars,
				published: gatewayLifetimeSidecars,
				closeStarted: lifecycle.closePreludeStarted,
				stopAfterCloseStarted: stopPostReadySidecarsAfterCloseStarted
			}));
		},
		...workerPlacementRuntime ? { startWorkerEnvironmentRuntime: async () => {
			if (lifecycle.closePreludeStarted) return null;
			return await workerPlacementRuntime.startRuntime({
				isClosePreludeStarted: () => lifecycle.closePreludeStarted,
				registerSidecar: (sidecar) => {
					kernel.addGatewayLifetimeSidecar(sidecar);
				}
			});
		} } : {},
		onSidecarsReady: () => {
			kernel.markSidecarsReady();
			activateScheduledServicesWhenReady();
		},
		isClosing: () => lifecycle.closePreludeStarted,
		startupTrace,
		sidecarStartup,
		waitForPostReadyWork: params.waitForPostReadyWork,
		activeWorkInspectors: createGatewayServerActiveWorkInspectors(gatewayRequestContext),
		residentRegistry,
		providerAuthPrewarm: { getConfig: getRuntimeConfig }
	})));
	kernel.setPostAttachHandles(postAttachHandles);
	startupTrace.detail("memory.ready", collectGatewayProcessMemoryUsageMb());
	startupTrace.mark("ready");
	if (sidecarStartup === "defer") log.info("gateway ready");
	finishGatewayRestartTrace("restart.ready", collectGatewayProcessMemoryUsageMb());
	if (!minimalTestGateway) await databaseIntegrityResident.start();
	postAttachRuntimeReturned = true;
	activateScheduledServicesWhenReady();
	const { startManagedGatewayConfigReloader } = await import("./server-reload-handlers-BWkjFe0C.js");
	const configReloaderParams = {
		minimalTestGateway,
		initialConfig: cfgAtStart,
		initialCompareConfig: startupLastGoodSnapshot.sourceConfig,
		initialSnapshotRawHash: startupLastGoodSnapshot.exists ? startupLastGoodSnapshot.hash ?? null : null,
		initialAuthoredConfig: startupLastGoodSnapshot.parsed,
		initialIncludedPaths: startupLastGoodSnapshot.includedPaths ?? [],
		initialSnapshotValid: startupLastGoodSnapshot.valid,
		initialSnapshotIssues: startupLastGoodSnapshot.issues,
		initialInternalWriteHash: startupInternalWriteHash,
		watchPath: configSnapshot.path,
		readSnapshot: readConfigFileSnapshotForRuntimeTransaction,
		promoteSnapshot: promoteConfigSnapshotToLastKnownGood,
		subscribeToWrites: (listener) => registerConfigWriteListener(listener, {
			ownsRuntimeActivationFor: configSnapshot.path,
			preCommitRuntimePreflight: async (sourceConfig, runtimeRefresh) => {
				const candidate = prepareReloadCandidate({
					runtimeConfig: sourceConfig,
					sourceConfig
				});
				await activateRuntimeSecrets(candidate.runtimeConfig, {
					reason: "reload",
					activate: false,
					env: candidate.runtimeEnv.env,
					includeAuthStoreRefs: runtimeRefresh?.includeAuthStoreRefs
				});
				return candidate;
			}
		}),
		deps,
		broadcast,
		getState: kernel.getReloadState,
		setState: (nextState) => {
			kernel.setReloadHookState(nextState);
			kernel.swapHeartbeatRunner(nextState.heartbeatRunner);
			const previousCronState = kernel.swapCronState(nextState.cronState);
			kernel.setChannelHealthMonitor(nextState.channelHealthMonitor);
			if (previousCronState !== nextState.cronState) cronStartState.handled = true;
		},
		startChannel,
		stopChannel,
		getChannelAutostartSuppression: channelManager.getAutostartSuppression,
		stopPostReadySidecars: stopRegisteredPostReadySidecars,
		reloadPlugins: kernel.reloadPlugins,
		logHooks,
		logChannels,
		logCron,
		logReload,
		cronReconciliation,
		onCronRestart: () => {
			cronStartState.handled = true;
		},
		prepareTerminalConfig: (plan, nextConfig) => {
			terminalLaunchPolicy.prepareConfig(nextConfig, { restartPending: plan.restartGateway });
		},
		reconcileTerminalSessions: () => {
			terminalSessions.closeDisallowedAgents((agentId) => terminalLaunchPolicy.resolve(agentId).ok);
		},
		commitTerminalConfig: (nextConfig) => {
			terminalLaunchPolicy.commitConfig();
			workerLiveEvents?.rebindAll(nextConfig);
		},
		acceptTerminalConfig: terminalLaunchPolicy.acceptConfig,
		channelManager,
		activateRuntimeSecrets,
		prepareConfigCandidate: prepareReloadCandidate,
		applyRuntimeConfigOverrides: applyFixedGatewayOverlays,
		resolveSharedGatewaySessionGenerationForConfig,
		sharedGatewaySessionGenerationState,
		clients,
		...opts.hotReloadRecovery ? { requestRecoveryRestart: opts.hotReloadRecovery } : {},
		restartRecoveryAvailable: opts.hotReloadRecovery !== void 0
	};
	const configReloaderResident = residentRegistry.register({
		name: "config-reloader",
		start: () => startManagedGatewayConfigReloader(configReloaderParams),
		stop: async () => await runtimeState.configReloader.stop()
	});
	kernel.setConfigReloaderHandle(configReloaderResident.start());
	await promoteConfigSnapshotToLastKnownGood(startupLastGoodSnapshot).catch((err) => {
		log.warn(`gateway: failed to promote config last-known-good backup: ${String(err)}`);
	});
	if (!minimalTestGateway) {
		const gatewayRuntimeServices = await loadScheduledServicesModule();
		residentRegistry.register({
			name: "post-ready-maintenance",
			start: () => {
				postReadyState.maintenanceTimer = gatewayRuntimeServices.scheduleGatewayPostReadyMaintenance({
					delayMs: POST_READY_MAINTENANCE_DELAY_MS,
					isClosing: () => lifecycle.closePreludeStarted,
					onStarted: () => {
						postReadyState.maintenanceTimer = null;
					},
					startMaintenance: async () => {
						if (lifecycle.closePreludeStarted) return null;
						return earlyRuntime.startMaintenance();
					},
					applyMaintenance: async (maintenance) => {
						if (lifecycle.closePreludeStarted) {
							clearInterval(maintenance.tickInterval);
							clearInterval(maintenance.healthInterval);
							clearInterval(maintenance.dedupeCleanup);
							await maintenance.stopMediaCleanup();
							clearInterval(maintenance.worktreeCleanup);
							maintenance.skillCuratorCleanup();
							return;
						}
						kernel.setMaintenanceHandles(maintenance);
						maintenance.startMediaCleanup();
					},
					shouldStartCron: () => !lifecycle.closePreludeStarted && !cronStartState.handled,
					markCronStartHandled: () => {
						cronStartState.handled = true;
					},
					cronState: runtimeState.cronState,
					cronReconciliation,
					cronConfig: cfgAtStart,
					logCron,
					log,
					recordPostReadyMemory: () => {
						startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
					}
				});
			},
			stop: () => {
				if (postReadyState.maintenanceTimer) {
					clearTimeout(postReadyState.maintenanceTimer);
					postReadyState.maintenanceTimer = null;
				}
			}
		}).start();
		residentRegistry.register({
			name: "retained-plugin-cleanup",
			start: () => {
				postReadyState.retainedPluginCleanupHandle = gatewayRuntimeServices.scheduleGatewayIdleTask({
					delayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
					retryDelayMs: RETAINED_PLUGIN_CLEANUP_DELAY_MS,
					isClosing: () => lifecycle.closePreludeStarted,
					isBusy: () => getActiveGatewayRootWorkCount({ excludeCurrent: true }) > 0,
					run: async () => {
						const { cleanupRetainedPluginInstallGenerations } = await import("./server-retained-plugin-cleanup-DL3911ed.js");
						await cleanupRetainedPluginInstallGenerations({ log });
					},
					log,
					errorMessage: "retained npm generation cleanup failed"
				});
			},
			stop: () => {
				postReadyState.retainedPluginCleanupHandle?.stop();
				postReadyState.retainedPluginCleanupHandle = null;
			}
		}).start();
	} else startupTrace.detail("memory.post-ready", collectGatewayProcessMemoryUsageMb());
}
//#endregion
//#region src/gateway/server-start.ts
const loadGatewayStartupPostAttachModule = createLazyRuntimeModule(() => import("./server-startup-post-attach-D0zv2iGC.js"));
const { log, logTailscale, logChannels, logHealth, logCron, logReload, logHooks, logWsControl } = gatewayKernelLogs;
const POST_READY_WORK_START_DELAY_MS = 500;
async function startGatewayServerCore(port = 18789, opts = {}) {
	let releasePostReadyWork = () => {};
	const postReadyWorkBarrier = new Promise((resolve) => {
		releasePostReadyWork = resolve;
	});
	const gatewayKernel = await createGatewayKernel(port, opts);
	const { beginClosePrelude, clearFallbackGatewayContextForServer, closeOnStartupFailure, createCloseHandler, runClosePrelude, stopRegisteredGatewayLifetimeSidecars, stopRegisteredPostReadySidecars, terminalSessions } = gatewayKernel;
	try {
		const transport = await createGatewayHttpTransport(gatewayKernel.createHttpTransportOptions());
		gatewayKernel.transportBridge.attach(transport);
		await finishGatewayStartup({
			kernelRuntime: {
				...gatewayKernel,
				...transport
			},
			port,
			opts,
			log,
			logHealth,
			logWsControl,
			logHooks,
			logChannels,
			logCron,
			logReload,
			logTailscale,
			loadGatewayStartupPostAttachModule,
			waitForPostReadyWork: () => postReadyWorkBarrier
		});
	} catch (err) {
		await closeOnStartupFailure();
		throw err;
	}
	setTimeout(releasePostReadyWork, POST_READY_WORK_START_DELAY_MS).unref?.();
	const close = createCloseHandler();
	return { close: async (optsLocal) => {
		try {
			await beginClosePrelude();
			terminalSessions.disposeAll();
			await stopRegisteredGatewayLifetimeSidecars();
			await stopRegisteredPostReadySidecars();
			const { runGlobalGatewayStopSafely } = await import("./plugins/hook-runner-global.js");
			await runGlobalGatewayStopSafely({
				event: { reason: optsLocal?.reason ?? "gateway stopping" },
				ctx: { port },
				onError: (err) => log.warn(`gateway_stop hook failed: ${String(err)}`)
			});
			await runClosePrelude();
			await close(optsLocal);
		} finally {
			clearFallbackGatewayContextForServer.get()();
		}
	} };
}
//#endregion
export { resetPreparedModelCatalogForTestCore, startGatewayServerCore };
