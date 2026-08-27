import { i as allowsProcessHomeSessionScan } from "./paths-CqeDjSA4.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as getPluginRegistryState } from "./runtime-state-B4nZOuAi.js";
import "./config-Dl8DJbzM.js";
import { c as isGatewayWorkAdmissionClosed, m as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-QDz202p9.js";
import { $t as loadSessionEntryReadOnly, hn as resolveSessionStorePathForScope } from "./session-accessor-Bi6bzKQE.js";
import { f as recordSessionHumanDirectMessage, p as recordSessionStateEvent } from "./session-state-events-C74I5OQg.js";
import { i as updateSessionUpstreamLinkMarker, n as listWatchedSessionUpstreamLinks, r as readSessionUpstreamLink, t as deleteSessionUpstreamLink } from "./session-upstream-links-s8R05hU4.js";
import { l as isEmbeddedAgentRunActive } from "./runs-CS8YarJf.js";
import { i as readRecentUserAssistantTextForSession } from "./transcript-DcKMk0pM.js";
import { t as computeBackoffMs } from "./delivery-recovery.shared-BBO0H6XC.js";
import { n as resolveHeartbeatIntervalMs } from "./heartbeat-summary-D3cbsUP0.js";
import { c as startSessionDeliveryRuntime, o as schedulePendingSessionDeliveries } from "./subagent-completion-delivery-DKT2BOW0.js";
import "./embedded-agent-Bcpo9BJw.js";
import { f as resolveHeartbeatAgents } from "./heartbeat-runner-session-DZQhMHVq.js";
import { t as startHeartbeatRunner } from "./heartbeat-runner-BHIR6BRD.js";
import { r as createNoopHeartbeatRunner } from "./server-runtime-startup-services-3kvPgEyy.js";
import "./server-idle-task-Cr84w9sq.js";
import { createHash } from "node:crypto";
//#region src/sessions/session-upstream-monitor.ts
/** Polls watched adopted sessions for direct upstream human activity. */
const SESSION_UPSTREAM_MONITOR_INTERVAL_MS = 6e4;
const SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS = 15e3;
const SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT = 10;
const SESSION_UPSTREAM_MISSING_THRESHOLD = 3;
const log = createSubsystemLogger("sessions/upstream-monitor");
function currentProviders() {
	return (getPluginRegistryState()?.activeRegistry?.sessionCatalogs ?? []).map((registration) => registration.provider);
}
function databaseOptions(options) {
	return {
		...options.env ? { env: options.env } : {},
		...options.path ? { path: options.path } : {}
	};
}
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function upstreamSourceKey(probe) {
	return createHash("sha256").update(`${probe.hostId}\u0000${probe.threadId}\u0000${JSON.stringify(probe.upstreamRef)}`).digest("hex").slice(0, 16);
}
function upstreamMonitorLinkKey(probe) {
	return `${probe.sessionKey}\n${probe.agentId}\n${upstreamSourceKey(probe)}`;
}
function loadProbeSession(probe, options) {
	if (options.signal?.aborted) return;
	const entry = (options.loadEntry ?? loadSessionEntryReadOnly)({
		sessionKey: probe.sessionKey,
		agentId: probe.agentId,
		clone: false,
		...options.env ? { env: options.env } : {}
	});
	return entry?.sessionId ? entry : void 0;
}
function loadIdleProbeSession(probe, options, expectedSessionId) {
	const entry = loadProbeSession(probe, options);
	if (!entry || expectedSessionId !== void 0 && entry.sessionId !== expectedSessionId || (options.isRunActive ?? isEmbeddedAgentRunActive)(entry.sessionId)) return;
	return entry;
}
function readMatchingProbeLink(probe, expectedUpdatedAt, options) {
	const currentLink = readSessionUpstreamLink(probe.sessionKey, probe.agentId, options);
	return currentLink && currentLink.updatedAt === expectedUpdatedAt && upstreamSourceKey(currentLink) === upstreamSourceKey(probe) ? currentLink : void 0;
}
async function loadOwnRecentUserTexts(probe, entry, options) {
	if (options.loadOwnRecentUserTexts) return await options.loadOwnRecentUserTexts({
		entry,
		probe
	});
	const storePath = resolveSessionStorePathForScope({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		...options.env ? { env: options.env } : {}
	});
	return (await readRecentUserAssistantTextForSession({
		agentId: probe.agentId,
		sessionKey: probe.sessionKey,
		storePath,
		limit: SESSION_UPSTREAM_OWN_USER_TEXT_LIMIT,
		preferUpstreamUserText: true,
		role: "user"
	})).map((item) => normalizeUserText(item.text)).filter(Boolean);
}
async function probeProvenanceUnchanged(probe, expectedSessionId, options) {
	const entry = loadIdleProbeSession(probe, options, expectedSessionId);
	if (!entry) return false;
	const current = await loadOwnRecentUserTexts(probe, entry, options);
	if (!loadIdleProbeSession(probe, options, expectedSessionId)) return false;
	return options.signal?.aborted !== true && current.length === probe.ownRecentUserTexts.length && current.every((text, index) => text === probe.ownRecentUserTexts[index]);
}
async function runSessionUpstreamMonitorTick(options = {}, missingCounts = /* @__PURE__ */ new Map()) {
	if (options.signal?.aborted) return;
	const dbOptions = databaseOptions(options);
	const linksByCatalog = listWatchedSessionUpstreamLinks(dbOptions);
	const watchedLinkKeys = new Set([...linksByCatalog.values()].flatMap((links) => links.map(upstreamMonitorLinkKey)));
	for (const key of missingCounts.keys()) if (!watchedLinkKeys.has(key)) missingCounts.delete(key);
	const providers = options.providers ?? currentProviders();
	const providerById = new Map(providers.map((provider) => [provider.id, provider]));
	for (const [catalogId, links] of linksByCatalog) {
		const provider = providerById.get(catalogId);
		if (!provider?.checkUpstreamActivity) continue;
		const probes = [];
		const sessionIdBySessionKey = /* @__PURE__ */ new Map();
		for (const link of links) {
			const probe = {
				sessionKey: link.sessionKey,
				agentId: link.agentId,
				threadId: link.threadId,
				hostId: link.hostId,
				upstreamKind: link.upstreamKind,
				upstreamRef: link.upstreamRef,
				marker: link.marker
			};
			try {
				const entry = loadIdleProbeSession(probe, options);
				if (!entry) continue;
				const ownRecentUserTexts = await loadOwnRecentUserTexts(probe, entry, options);
				if (options.signal?.aborted) return;
				probes.push({
					...probe,
					ownRecentUserTexts
				});
				sessionIdBySessionKey.set(probe.sessionKey, entry.sessionId);
			} catch (error) {
				log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
			}
		}
		if (probes.length === 0) continue;
		const probeBySessionKey = new Map(probes.map((probe) => [probe.sessionKey, probe]));
		const linkUpdatedAtBySessionKey = new Map(links.map((link) => [link.sessionKey, link.updatedAt]));
		try {
			const outcomes = await provider.checkUpstreamActivity(probes, { allowProcessHomeFallback: allowsProcessHomeSessionScan(options.env ?? process.env) });
			if (options.signal?.aborted) return;
			const missingSessionKeys = new Set(outcomes.filter((outcome) => outcome.kind === "missing").map((outcome) => outcome.sessionKey));
			for (const probe of probes) if (!missingSessionKeys.has(probe.sessionKey)) missingCounts.delete(upstreamMonitorLinkKey(probe));
			for (const outcome of outcomes) {
				const probe = probeBySessionKey.get(outcome.sessionKey);
				if (!probe) continue;
				const missingCountKey = upstreamMonitorLinkKey(probe);
				if (outcome.kind === "missing") {
					const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(outcome.sessionKey);
					const expectedSessionId = sessionIdBySessionKey.get(outcome.sessionKey);
					if (expectedUpdatedAt === void 0 || expectedSessionId === void 0) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					if (options.signal?.aborted) return;
					const currentLink = readMatchingProbeLink(probe, expectedUpdatedAt, dbOptions);
					if (!currentLink) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					const currentSession = loadProbeSession(probe, options);
					if (!currentSession || currentSession.sessionId !== expectedSessionId) {
						missingCounts.delete(missingCountKey);
						continue;
					}
					if ((options.isRunActive ?? isEmbeddedAgentRunActive)(currentSession.sessionId)) continue;
					const previous = missingCounts.get(missingCountKey);
					const missingCount = Math.min(SESSION_UPSTREAM_MISSING_THRESHOLD, (previous?.linkUpdatedAt === expectedUpdatedAt ? previous.count : 0) + 1);
					missingCounts.set(missingCountKey, {
						count: missingCount,
						linkUpdatedAt: expectedUpdatedAt
					});
					if (missingCount < SESSION_UPSTREAM_MISSING_THRESHOLD) continue;
					const sourceKey = upstreamSourceKey(probe);
					if (!recordSessionStateEvent({
						sessionKey: probe.sessionKey,
						agentId: probe.agentId,
						kind: "upstream_missing",
						actorType: "system",
						dedupeKey: `upstream-missing:${probe.sessionKey}:${sourceKey}:${currentLink.updatedAt}`,
						summary: `upstream missing via ${catalogId}`,
						payload: { channel: catalogId }
					}, {
						...dbOptions,
						now: (options.now ?? Date.now)()
					})) {
						missingCounts.set(missingCountKey, {
							count: SESSION_UPSTREAM_MISSING_THRESHOLD - 1,
							linkUpdatedAt: expectedUpdatedAt
						});
						continue;
					}
					deleteSessionUpstreamLink(probe.sessionKey, probe.agentId, dbOptions);
					missingCounts.delete(missingCountKey);
					continue;
				}
				missingCounts.delete(missingCountKey);
				const activity = outcome;
				if (!Number.isSafeInteger(activity.humanTurns) || activity.humanTurns < 0) continue;
				try {
					if (!await probeProvenanceUnchanged(probe, sessionIdBySessionKey.get(probe.sessionKey), options)) continue;
				} catch (error) {
					log.warn(`upstream transcript provenance failed for ${probe.sessionKey}: ${String(error)}`);
					continue;
				}
				const expectedUpdatedAt = linkUpdatedAtBySessionKey.get(activity.sessionKey);
				if (!readMatchingProbeLink(probe, expectedUpdatedAt, dbOptions)) continue;
				if (activity.humanTurns === 0) {
					updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
						...dbOptions,
						now: (options.now ?? Date.now)(),
						...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
					});
					continue;
				}
				if (!Number.isFinite(activity.occurredAt) || !activity.dedupeId) continue;
				if (!recordSessionHumanDirectMessage({
					sessionKey: probe.sessionKey,
					agentId: probe.agentId,
					actor: { actorType: "human" },
					channel: catalogId,
					dedupeKey: `upstream:${probe.sessionKey}:${upstreamSourceKey(probe)}:${activity.dedupeId}`,
					...activity.humanTurns > 1 ? { payload: { turns: activity.humanTurns } } : {},
					occurredAt: activity.occurredAt
				}, {
					...dbOptions,
					now: (options.now ?? Date.now)()
				})) continue;
				updateSessionUpstreamLinkMarker(probe.sessionKey, probe.agentId, activity.nextMarker, {
					...dbOptions,
					now: (options.now ?? Date.now)(),
					...expectedUpdatedAt === void 0 ? {} : { expectedUpdatedAt }
				});
			}
		} catch (error) {
			log.warn(`upstream activity probe failed for ${catalogId}: ${String(error)}`);
		}
	}
}
function startSessionUpstreamMonitor(options = {}) {
	let stopped = false;
	let running = false;
	const lifecycle = new AbortController();
	const tickOptions = {
		...options,
		signal: lifecycle.signal
	};
	const missingCounts = /* @__PURE__ */ new Map();
	const run = () => {
		if (stopped || running) return;
		running = true;
		runSessionUpstreamMonitorTick(tickOptions, missingCounts).catch((error) => {
			log.warn(`upstream monitor tick failed: ${String(error)}`);
		}).finally(() => {
			running = false;
		});
	};
	const initialTimer = setTimeout(run, SESSION_UPSTREAM_MONITOR_INITIAL_DELAY_MS);
	initialTimer.unref?.();
	const interval = setInterval(run, SESSION_UPSTREAM_MONITOR_INTERVAL_MS);
	interval.unref?.();
	return { stop: () => {
		if (stopped) return;
		stopped = true;
		lifecycle.abort();
		clearTimeout(initialTimer);
		clearInterval(interval);
	} };
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionUpstreamMonitorTestApi")] = { runSessionUpstreamMonitorTick };
//#endregion
//#region src/gateway/server-runtime-services.ts
/** Starts cron without making the surrounding startup or reload transaction wait. */
function startGatewayCronWithLogging(params) {
	const reconciliation = params.cronReconciliation.arm({
		reason: params.reason,
		config: params.config,
		cronState: params.cronState
	});
	runWithGatewayIndependentRootWorkAdmission(async () => {
		try {
			await params.cronState.cron.start();
			await params.afterStart?.();
			await reconciliation.complete();
		} catch (err) {
			params.logCron.error(`failed to start: ${String(err)}`);
			params.onStartError?.(err);
		}
	}).catch((err) => params.logCron.error(`failed to enter start root: ${String(err)}`));
}
async function clearGatewayMaintenanceHandles(maintenance) {
	if (!maintenance) return;
	clearInterval(maintenance.tickInterval);
	clearInterval(maintenance.healthInterval);
	clearInterval(maintenance.dedupeCleanup);
	await maintenance.stopMediaCleanup();
	clearInterval(maintenance.worktreeCleanup);
	maintenance.skillCuratorCleanup();
}
/** Runs maintenance that is intentionally delayed until after the gateway is ready. */
async function runGatewayPostReadyMaintenance(params) {
	try {
		const maintenance = await params.startMaintenance();
		if (maintenance) await params.applyMaintenance(maintenance);
	} catch (err) {
		params.log.warn(`gateway post-ready maintenance startup failed: ${String(err)}`);
	}
	if (params.shouldStartCron()) {
		params.markCronStartHandled();
		startGatewayCronWithLogging({
			cronState: params.cronState,
			cronReconciliation: params.cronReconciliation,
			reason: "startup",
			config: params.cronConfig,
			logCron: params.logCron
		});
	}
	params.recordPostReadyMemory();
}
/** Schedules post-ready maintenance and cancels/cleans handles if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const timer = setTimeout(() => {
		params.onStarted?.();
		if (params.isClosing()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => runGatewayPostReadyMaintenance({
			startMaintenance: async () => {
				if (params.isClosing()) return null;
				const maintenance = await params.startMaintenance();
				if (params.isClosing()) {
					await clearGatewayMaintenanceHandles(maintenance);
					return null;
				}
				return maintenance;
			},
			applyMaintenance: async (maintenance) => {
				if (params.isClosing()) {
					await clearGatewayMaintenanceHandles(maintenance);
					return;
				}
				await params.applyMaintenance(maintenance);
			},
			shouldStartCron: () => !params.isClosing() && params.shouldStartCron(),
			markCronStartHandled: params.markCronStartHandled,
			cronState: params.cronState,
			cronReconciliation: params.cronReconciliation,
			cronConfig: params.cronConfig,
			logCron: params.logCron,
			log: params.log,
			recordPostReadyMemory: () => {
				if (!params.isClosing()) params.recordPostReadyMemory();
			}
		})).catch((err) => params.log.warn(`gateway post-ready maintenance deferred task failed: ${String(err)}`));
	}, params.delayMs);
	timer.unref?.();
	return timer;
}
const RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS = 5e3;
function startPendingOutboundDeliveryRecovery(params) {
	let stopped = false;
	let inFlight = null;
	let stopPromise = null;
	let logRecovery;
	const recover = (startup) => {
		if (stopped || inFlight || isGatewayWorkAdmissionClosed()) return;
		const settled = runWithGatewayIndependentRootWorkAdmission(async () => {
			if (stopped) return;
			const { drainPendingDeliveriesCore, recoverPendingDeliveries } = await import("./delivery-queue-recovery-BH0mkJtY.js");
			const { deliverOutboundPayloadsInternal } = await import("./deliver-jeLMAw3Y.js");
			if (stopped) return;
			logRecovery ??= params.log.child("delivery-recovery");
			if (startup) {
				await recoverPendingDeliveries({
					deliver: deliverOutboundPayloadsInternal,
					log: logRecovery,
					cfg: params.cfg
				});
				return;
			}
			await drainPendingDeliveriesCore({
				drainKey: "gateway:outbound",
				logLabel: "Outbound delivery retry",
				cfg: getRuntimeConfig(),
				log: logRecovery,
				deliver: deliverOutboundPayloadsInternal,
				selectEntry: () => ({
					match: true,
					bypassBackoff: false
				})
			});
		}).catch((err) => params.log.error(`Delivery recovery failed: ${String(err)}`)).finally(() => {
			if (inFlight === settled) inFlight = null;
		});
		inFlight = settled;
	};
	const retryTimer = setInterval(() => recover(false), computeBackoffMs(1));
	retryTimer.unref?.();
	recover(true);
	return () => {
		stopped = true;
		clearInterval(retryTimer);
		if (stopPromise) return stopPromise;
		const recovery = inFlight;
		if (!recovery) {
			stopPromise = Promise.resolve();
			return stopPromise;
		}
		const stillPendingTimer = setTimeout(() => {
			(logRecovery ??= params.log.child("delivery-recovery")).warn(`delivery recovery is still pending after ${RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS}ms; waiting before runtime teardown`);
		}, RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS);
		stillPendingTimer.unref?.();
		stopPromise = recovery.finally(() => {
			clearTimeout(stillPendingTimer);
		});
		return stopPromise;
	};
}
function startPendingSessionDeliveryRuntime(params) {
	let stopped = false;
	let stopRuntime;
	const timer = setTimeout(() => {
		runWithGatewayIndependentRootWorkAdmission(async () => {
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, settleQueuedSessionDelivery } = await import("./server-restart-sentinel-D7erG4eT.js");
			if (stopped) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				deliver: (entry, context = {}) => deliverQueuedSessionDelivery({
					deps: params.deps,
					entry,
					...context.stateDir !== void 0 ? { stateDir: context.stateDir } : {}
				}),
				log: logRecovery,
				onSettled: settleQueuedSessionDelivery
			});
			try {
				await recoverPendingRestartContinuationDeliveries({
					deps: params.deps,
					log: logRecovery,
					maxEnqueuedAt: params.maxEnqueuedAt
				});
			} finally {
				await schedulePendingSessionDeliveries();
			}
		}).catch((err) => params.log.error(`Session delivery recovery failed: ${String(err)}`));
	}, 1250);
	timer.unref?.();
	return () => {
		stopped = true;
		clearTimeout(timer);
		stopRuntime?.();
		stopRuntime = void 0;
	};
}
/** Activates background gateway services after core runtime startup is ready. */
function activateGatewayScheduledServices(params) {
	if (params.minimalTestGateway) return {
		heartbeatRunner: createNoopHeartbeatRunner(),
		stopOutboundDeliveryRecovery: async () => {}
	};
	if (!params.cronState.cronEnabled && resolveHeartbeatAgents(params.cfgAtStart).some((agent) => Boolean(resolveHeartbeatIntervalMs(params.cfgAtStart, void 0, agent.heartbeat)))) params.log.child("heartbeat").warn("scheduled heartbeats are disabled because the cron scheduler is disabled; enable cron and restart the gateway");
	const heartbeatRunner = startHeartbeatRunner({
		cfg: params.cfgAtStart,
		readCurrentConfig: getRuntimeConfig
	});
	const sessionUpstreamMonitor = startSessionUpstreamMonitor();
	const stopSessionDeliveryRuntime = startPendingSessionDeliveryRuntime({
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt
	});
	if (params.startCron !== false) startGatewayCronWithLogging({
		cronState: params.cronState,
		cronReconciliation: params.cronReconciliation,
		reason: "startup",
		config: params.cfgAtStart,
		logCron: params.logCron
	});
	const stopOutboundDeliveryRecovery = startPendingOutboundDeliveryRecovery({
		cfg: params.cfgAtStart,
		log: params.log
	});
	return {
		heartbeatRunner: {
			updateConfig: heartbeatRunner.updateConfig,
			stop: () => {
				stopOutboundDeliveryRecovery();
				stopSessionDeliveryRuntime();
				sessionUpstreamMonitor.stop();
				heartbeatRunner.stop();
			}
		},
		stopOutboundDeliveryRecovery
	};
}
//#endregion
export { startGatewayCronWithLogging as i, runGatewayPostReadyMaintenance as n, scheduleGatewayPostReadyMaintenance as r, activateGatewayScheduledServices as t };
