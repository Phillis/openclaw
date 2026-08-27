import { r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.js";
import { g as isFutureDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as generateSecureInt } from "./secure-random-Ds4AFLgz.js";
import { C as sweepStaleRunContexts } from "./agent-run-registry-t4kvUyNQ.js";
import { u as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-CTDt7IQ1.js";
import { c as pruneOutboundMedia, l as prunePlaybackTranscodeCache, r as cleanOldMedia } from "./store-B6ILpvye.js";
import "./agent-run-terminal-outcome-DafVNgmX.js";
import { i as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-C9E8iDY4.js";
import { d as pruneExpiredDeliveryQueueTombstones } from "./delivery-queue-sqlite-YQvmsrNF.js";
import { n as pruneOrphanedDeliveryQueueMedia } from "./delivery-queue-media-spool-DRm7uku0.js";
import { a as registerSkillUsageTracking } from "./curator-CCqMkag9.js";
import { c as removeChatAbortControllerEntry, t as abortChatRunById } from "./chat-abort-BpfXA9KF.js";
import { t as chatAbortMarkerTimestampMs } from "./server-chat-state-BuGrMjm1.js";
import { l as pruneExpiredDevicePairSetupCompletions } from "./device-bootstrap-DpkEF5MF.js";
import { r as HEALTH_REFRESH_INTERVAL_MS, s as TICK_INTERVAL_MS, t as DEDUPE_MAX } from "./server-constants-DKuFNbQH.js";
import { i as WORKTREE_GC_INTERVAL_MS, l as managedWorktrees, u as resolveWorktreeCleanupLimits } from "./service-P2Ot4H_g.js";
import { n as hasRegisteredChatRunForSessionKey } from "./session-active-runs-C7YJ2XPa.js";
import "./server-shared-C-7Ahu3n.js";
import { r as checkTelemetryUpdate } from "./telemetry-DbNDCK7t.js";
import { t as createManagedWorktreeOwnerProtection } from "./owner-protection-CLwFv5gk.js";
import { r as pruneStaleControlPlaneBuckets } from "./control-plane-rate-limit-BtKY9m7Q.js";
import { i as waitForMediaCleanupDrainsToSettle, n as registerMediaCleanupDrain, r as waitForMediaCleanupDrains, t as MEDIA_CLEANUP_STOP_TIMEOUT_MS } from "./server-media-cleanup-lifecycle-dOPPbnLL.js";
import "./server-utils-BNa02-IQ.js";
import { s as setBroadcastHealthUpdate } from "./health-state-DU1bpQDq.js";
function createHostThawRecovery(deps) {
	let lastTickAtMs = deps.nowMs();
	let pendingFrozenMs;
	let activeRecovery;
	const runStep = async (label, step) => {
		try {
			await step();
		} catch (error) {
			deps.logger.error(`host thaw ${label} failed: ${String(error)}`);
		}
	};
	const recover = async (frozenMs) => {
		deps.logger.info(`host thaw detected: process was frozen ~${Math.round(frozenMs)}ms; restarting channels and refreshing health`);
		const recoverySteps = [
			["event-loop reset", deps.resetEventLoopHealth],
			["channel restart", deps.restartChannels],
			["health refresh", deps.refreshHealth],
			["presence refresh", deps.refreshPresence]
		];
		for (const [label, step] of recoverySteps) {
			if (deps.isAdmissionClosed()) {
				pendingFrozenMs = Math.max(pendingFrozenMs ?? 0, frozenMs);
				deps.logger.info("host thaw recovery deferred: gateway suspension began mid-recovery");
				return;
			}
			await runStep(label, step);
		}
	};
	return { tick: async () => {
		const nowMs = deps.nowMs();
		const gapMs = nowMs - lastTickAtMs;
		lastTickAtMs = nowMs;
		if (gapMs >= 75e3) pendingFrozenMs = Math.max(pendingFrozenMs ?? 0, gapMs - TICK_INTERVAL_MS);
		if (pendingFrozenMs === void 0 || deps.isAdmissionClosed() || activeRecovery) return;
		const frozenMs = pendingFrozenMs;
		pendingFrozenMs = void 0;
		activeRecovery = recover(frozenMs);
		try {
			await activeRecovery;
		} finally {
			activeRecovery = void 0;
		}
	} };
}
//#endregion
//#region src/gateway/server-maintenance.ts
const DELIVERY_QUEUE_MEDIA_GC_INTERVAL_MS = 60 * 6e4;
const TELEMETRY_MAINTENANCE_INTERVAL_MS = 5 * 6e4;
function startGatewayMaintenanceTimers(params) {
	setBroadcastHealthUpdate((snap) => {
		params.broadcast("health", snap, { stateVersion: {
			presence: params.getPresenceVersion(),
			health: params.getHealthVersion()
		} });
		params.nodeSendToAllSubscribed("health", snap);
	});
	const hostThawRecovery = createHostThawRecovery({
		nowMs: Date.now,
		restartChannels: params.restartRunningChannels,
		refreshHealth: async () => {
			await params.refreshGatewayHealthSnapshot({ probe: true });
		},
		refreshPresence: params.refreshPresence,
		resetEventLoopHealth: params.resetEventLoopHealth,
		isAdmissionClosed: isGatewayWorkAdmissionClosed,
		logger: params.logHealth
	});
	let nextTelemetryCheckAtMs = Date.now() + generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS);
	const tickInterval = setInterval(() => {
		hostThawRecovery.tick();
		const now = Date.now();
		if (!params.isNixMode && now >= nextTelemetryCheckAtMs) {
			nextTelemetryCheckAtMs = now + TELEMETRY_MAINTENANCE_INTERVAL_MS + generateSecureInt(TELEMETRY_MAINTENANCE_INTERVAL_MS);
			checkTelemetryUpdate(params.getRuntimeConfig(), { surface: "gateway" }).catch(() => {});
		}
		const payload = { ts: now };
		params.broadcast("tick", payload);
		params.nodeSendToAllSubscribed("tick", payload);
	}, TICK_INTERVAL_MS);
	const healthInterval = setInterval(() => {
		params.refreshGatewayHealthSnapshot({ probe: false }).catch((err) => params.logHealth.error(`refresh failed: ${formatErrorMessage(err)}`));
	}, HEALTH_REFRESH_INTERVAL_MS);
	params.refreshGatewayHealthSnapshot({ probe: false }).catch((err) => params.logHealth.error(`initial refresh failed: ${formatErrorMessage(err)}`));
	const runWorktreeGc = params.runWorktreeGc ?? (() => {
		const cfg = params.getRuntimeConfig();
		return managedWorktrees.gc({
			shouldProtectOwner: createManagedWorktreeOwnerProtection(cfg),
			limits: resolveWorktreeCleanupLimits()
		});
	});
	const performWorktreeGc = () => runWorktreeGc().catch((err) => {
		params.logHealth.error(`managed worktree cleanup failed: ${formatErrorMessage(err)}`);
	});
	const worktreeCleanup = setInterval(() => void performWorktreeGc(), WORKTREE_GC_INTERVAL_MS);
	performWorktreeGc();
	const runDeliveryQueueMediaGc = params.runDeliveryQueueMediaGc ?? (async () => {
		try {
			pruneExpiredDeliveryQueueTombstones();
		} finally {
			await pruneOrphanedDeliveryQueueMedia();
		}
	});
	let deliveryQueueMediaGcStartedAtMs = 0;
	const deliveryQueueMediaGcLoader = createLazyPromiseLoader(async () => {
		try {
			await runDeliveryQueueMediaGc();
		} catch (error) {
			params.logHealth.error(`delivery queue maintenance failed: ${formatErrorMessage(error)}`);
		} finally {
			deliveryQueueMediaGcLoader.clear();
		}
	});
	const performDeliveryQueueMediaGc = () => {
		if (!deliveryQueueMediaGcLoader.peek()) deliveryQueueMediaGcStartedAtMs = Date.now();
		return deliveryQueueMediaGcLoader.load();
	};
	performDeliveryQueueMediaGc();
	let devicePairSetupCompletionGcInFlight = null;
	const performDevicePairSetupCompletionGc = (nowMs) => {
		if (devicePairSetupCompletionGcInFlight) return devicePairSetupCompletionGcInFlight;
		devicePairSetupCompletionGcInFlight = pruneExpiredDevicePairSetupCompletions({ nowMs }).then(() => void 0).catch((error) => {
			params.logHealth.error(`device pair setup cleanup failed: ${formatErrorMessage(error)}`);
		}).finally(() => {
			devicePairSetupCompletionGcInFlight = null;
		});
		return devicePairSetupCompletionGcInFlight;
	};
	performDevicePairSetupCompletionGc(Date.now());
	const skillUsageCleanup = registerSkillUsageTracking();
	const dedupeCleanup = setInterval(() => {
		const AGENT_RUN_SEQ_MAX = 1e4;
		const now = Date.now();
		performDevicePairSetupCompletionGc(now);
		if (now - deliveryQueueMediaGcStartedAtMs >= DELIVERY_QUEUE_MEDIA_GC_INTERVAL_MS) performDeliveryQueueMediaGc();
		const resolveDedupeRunId = (key, entry) => {
			if (!key.startsWith("agent:") && !key.startsWith("chat:")) return;
			const keyRunId = key.slice(key.indexOf(":") + 1);
			if (keyRunId) {
				if (params.chatAbortControllers.has(keyRunId) || params.chatQueuedTurns.has(keyRunId)) return keyRunId;
			}
			const payload = entry.payload;
			return payload && typeof payload === "object" && !Array.isArray(payload) ? typeof payload.runId === "string" ? payload.runId.trim() || void 0 : void 0 : void 0;
		};
		const isPendingAcceptedRunDedupeKey = (key, dedupeEntry) => {
			if (!key.startsWith("agent:") && !key.startsWith("pending-chat:")) return false;
			const payload = dedupeEntry.payload;
			if (!payload || typeof payload !== "object" || Array.isArray(payload)) return false;
			if (payload.status !== "accepted") return false;
			const expiresAtMs = payload.expiresAtMs;
			return isFutureDateTimestampMs(expiresAtMs, { nowMs: now });
		};
		const isActiveRunDedupeKey = (key, dedupeEntry) => {
			const isAgentKey = key.startsWith("agent:");
			const isChatKey = key.startsWith("chat:");
			if (!isAgentKey && !isChatKey) return false;
			const runId = resolveDedupeRunId(key, dedupeEntry);
			const entry = runId ? params.chatAbortControllers.get(runId) : void 0;
			if (entry) return isAgentKey ? entry.kind === "agent" : entry.kind !== "agent";
			return Boolean(isChatKey && runId && params.chatQueuedTurns.has(runId));
		};
		for (const [k, v] of params.dedupe) {
			if (isActiveRunDedupeKey(k, v) || isPendingAcceptedRunDedupeKey(k, v)) continue;
			if (now - v.ts > 3e5) params.dedupe.delete(k);
		}
		if (params.dedupe.size > 1e3) {
			const excess = params.dedupe.size - DEDUPE_MAX;
			const oldestKeys = [...params.dedupe.entries()].filter(([key, entry]) => !isActiveRunDedupeKey(key, entry) && !isPendingAcceptedRunDedupeKey(key, entry)).toSorted(([, left], [, right]) => left.ts - right.ts).slice(0, excess).map(([key]) => key);
			for (const key of oldestKeys) params.dedupe.delete(key);
		}
		pruneMapToMaxSize(params.agentRunSeq, AGENT_RUN_SEQ_MAX);
		for (const [runId, entry] of params.chatAbortControllers) {
			const terminalClearOverdue = typeof entry.projectSessionTerminalObservedAt === "number" && now - entry.projectSessionTerminalObservedAt > 15e3;
			if (entry.projectSessionTerminalPending === true && !terminalClearOverdue) continue;
			if (isFutureDateTimestampMs(entry.expiresAtMs, { nowMs: now })) continue;
			if (entry.projectSessionTerminalPersistence) {
				const lifecycleGeneration = entry.lifecycleGeneration?.trim();
				const sessionKey = entry.sessionKey.trim();
				const sessionId = entry.sessionId.trim();
				if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId) params.restartRecoveryCandidates.set(runId, {
					runId,
					lifecycleGeneration,
					sessionKey,
					sessionId,
					observedAt: entry.projectSessionTerminalObservedAt
				});
				removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
				continue;
			}
			if (entry.projectSessionActive === false) {
				removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
				continue;
			}
			if (!abortChatRunById(params, {
				runId,
				sessionKey: entry.sessionKey,
				stopReason: "timeout"
			}).aborted) removeChatAbortControllerEntry(params.chatAbortControllers, runId, entry);
		}
		const ABORTED_RUN_TTL_MS = 60 * 6e4;
		pruneStaleControlPlaneBuckets(now);
		for (const [runId, record] of params.chatRunState.runs) {
			if (record.abortMarker !== void 0) {
				if (now - chatAbortMarkerTimestampMs(record.abortMarker) > ABORTED_RUN_TTL_MS) {
					params.chatRunState.deleteAbortMarker(runId);
					params.chatRunState.clearRun(runId);
				}
				continue;
			}
			if (params.chatAbortControllers.has(runId)) continue;
			if ([
				record.deltaSentAt,
				record.bufferUpdatedAt,
				record.agentText?.assistant?.lastSentAt,
				record.agentText?.thinking?.lastSentAt
			].some((timestamp) => timestamp !== void 0 && now - timestamp > ABORTED_RUN_TTL_MS)) params.chatRunState.clearRun(runId);
		}
		sweepStaleRunContexts();
	}, 6e4);
	const playbackTranscodeCacheCleanupLoader = createLazyPromiseLoader(async () => {
		try {
			await prunePlaybackTranscodeCache();
		} catch (err) {
			params.logHealth.error(`playback transcode cache cleanup failed: ${formatErrorMessage(err)}`);
		} finally {
			playbackTranscodeCacheCleanupLoader.clear();
		}
	});
	const runManagedOutgoingMediaGc = params.runManagedOutgoingMediaGc ?? (async () => {
		const { cleanupManagedOutgoingMediaRecords } = await import("./managed-image-attachments-DAGyYr8W.js");
		return await cleanupManagedOutgoingMediaRecords({ hasActiveSessionRun: (sessionKey, agentId) => {
			const cfg = params.getRuntimeConfig();
			return hasRegisteredChatRunForSessionKey({
				context: { chatAbortControllers: params.chatAbortControllers },
				sessionKey,
				agentId,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(cfg, sessionKey)
			});
		} });
	});
	const managedOutgoingCleanupLoader = createLazyPromiseLoader(async () => {
		try {
			await runManagedOutgoingMediaGc();
		} catch (err) {
			params.logHealth.error(`managed outgoing media cleanup failed: ${formatErrorMessage(err)}`);
		} finally {
			managedOutgoingCleanupLoader.clear();
		}
	});
	let mediaCleanupInFlight = null;
	const runMediaCleanup = () => {
		const ttlMs = params.mediaCleanupTtlMs;
		if (mediaCleanupInFlight) return mediaCleanupInFlight;
		mediaCleanupInFlight = (typeof ttlMs === "number" ? cleanOldMedia(ttlMs, {
			recursive: true,
			pruneEmptyDirs: true
		}) : pruneOutboundMedia()).catch((err) => {
			params.logHealth.error(`media cleanup failed: ${formatErrorMessage(err)}`);
		}).finally(() => {
			mediaCleanupInFlight = null;
		});
		return mediaCleanupInFlight;
	};
	let mediaCleanupInterval;
	let mediaCleanupStopped = false;
	const runMediaMaintenance = () => {
		if (mediaCleanupStopped) return;
		playbackTranscodeCacheCleanupLoader.load();
		managedOutgoingCleanupLoader.load();
		runMediaCleanup();
	};
	let mediaCleanupStartPromise;
	const startMediaCleanup = () => {
		if (mediaCleanupStopped || mediaCleanupInterval || mediaCleanupStartPromise) return;
		mediaCleanupStartPromise = waitForMediaCleanupDrainsToSettle().then(() => {
			mediaCleanupStartPromise = void 0;
			if (mediaCleanupStopped || mediaCleanupInterval) return;
			mediaCleanupInterval = setInterval(runMediaMaintenance, 60 * 6e4);
			runMediaMaintenance();
		});
	};
	let stopMediaCleanupPromise;
	const stopMediaCleanup = () => {
		stopMediaCleanupPromise ??= (async () => {
			mediaCleanupStopped = true;
			if (mediaCleanupInterval) {
				clearInterval(mediaCleanupInterval);
				mediaCleanupInterval = void 0;
			}
			const pending = [
				playbackTranscodeCacheCleanupLoader.peek(),
				managedOutgoingCleanupLoader.peek(),
				mediaCleanupInFlight
			].filter((promise) => promise !== void 0 && promise !== null);
			if (pending.length > 0) registerMediaCleanupDrain(Promise.allSettled(pending).then(() => void 0));
			return await waitForMediaCleanupDrains({
				timeoutMs: MEDIA_CLEANUP_STOP_TIMEOUT_MS,
				onTimeout: () => {
					params.logHealth.error(`media cleanup drain exceeded ${MEDIA_CLEANUP_STOP_TIMEOUT_MS}ms; retaining shared state until cleanup settles`);
				}
			});
		})();
		return stopMediaCleanupPromise;
	};
	return {
		tickInterval,
		healthInterval,
		dedupeCleanup,
		startMediaCleanup,
		stopMediaCleanup,
		worktreeCleanup,
		skillUsageCleanup
	};
}
//#endregion
export { startGatewayMaintenanceTimers };
