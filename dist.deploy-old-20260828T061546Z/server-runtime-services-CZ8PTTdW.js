import { i as allowsProcessHomeSessionScan } from "./paths-BBSTUjD5.js";
import { n as getRuntimeConfig } from "./io-ClLVsBMp.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as getPluginRegistryState } from "./runtime-state-B4nZOuAi.js";
import "./config-B_0xOnKq.js";
import { p as loadSessionEntryReadOnly, w as resolveSessionStorePathForScope } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { _ as runWithGatewayIndependentRootWorkAdmission, u as isGatewayWorkAdmissionClosed } from "./gateway-work-admission-CTDt7IQ1.js";
import "./session-accessor-fcDZuc2H.js";
import { f as recordSessionHumanDirectMessage, p as recordSessionStateEvent } from "./session-state-events-DvygRPJJ.js";
import { i as updateSessionUpstreamLinkMarker, n as listWatchedSessionUpstreamLinks, r as readSessionUpstreamLink, t as deleteSessionUpstreamLink } from "./session-upstream-links-BwxSZt9W.js";
import { i as readRecentUserAssistantTextForSession } from "./transcript-DXU5onHR.js";
import { u as isEmbeddedAgentRunActive } from "./runs-eqaxGmoQ.js";
import { t as computeBackoffMs } from "./delivery-recovery.shared-B2XgPiah.js";
import { t as resolveSkillWorkshopConfig } from "./config-Cjp42tXL.js";
import { i as resolveHeartbeatIntervalMs, n as resolveHeartbeatAgents } from "./heartbeat-config-Cdcr8ZQq.js";
import "./heartbeat-summary-BFZGQ_i0.js";
import { n as runWithScheduledGatewayContext, t as fenceScheduledGatewayContextResolver } from "./scheduled-run-gateway-context-Bc8uToso.js";
import { c as startSessionDeliveryRuntime, o as schedulePendingSessionDeliveries } from "./subagent-completion-delivery-esPjci0g.js";
import "./embedded-agent-uA4hl59E.js";
import { n as runHeartbeatOnce, t as startHeartbeatRunner } from "./heartbeat-runner-DVka_UzJ.js";
import { t as resolveGatewayPluginConfig } from "./runtime-plugin-config-CGEtHeTJ.js";
import { r as assertQueuedConversationDeliveryAttemptAuthorized } from "./conversation-route-ownership-SLv59dqA.js";
import { t as createNoopHeartbeatRunner } from "./server-runtime-service-shared-iwns63ly.js";
import "./server-idle-task-BWX53Hmv.js";
import "./server-runtime-startup-services-CgpcZU0v.js";
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
	maintenance.skillUsageCleanup();
}
/** Schedules post-ready maintenance and cancels/cleans handles if shutdown wins the race. */
function scheduleGatewayPostReadyMaintenance(params) {
	const timer = setTimeout(() => {
		params.onStarted?.();
		if (params.isClosing()) return;
		runWithGatewayIndependentRootWorkAdmission(async () => {
			try {
				if (!params.isClosing()) {
					const maintenance = await params.startMaintenance();
					if (params.isClosing()) await clearGatewayMaintenanceHandles(maintenance);
					else if (maintenance) await params.applyMaintenance(maintenance);
				}
			} catch (err) {
				params.log.warn(`gateway post-ready maintenance startup failed: ${String(err)}`);
			}
			if (!params.isClosing() && params.shouldStartCron()) {
				params.markCronStartHandled();
				startGatewayCronWithLogging({
					cronState: params.cronState,
					cronReconciliation: params.cronReconciliation,
					reason: "startup",
					config: params.cronConfig,
					logCron: params.logCron
				});
			}
			if (!params.isClosing()) params.recordPostReadyMemory();
		}).catch((err) => params.log.warn(`gateway post-ready maintenance deferred task failed: ${String(err)}`));
	}, params.delayMs);
	timer.unref?.();
	return timer;
}
const RECOVERY_SHUTDOWN_STILL_PENDING_WARN_MS = 5e3;
function startPendingOutboundDeliveryRecovery(params) {
	let stopped = false;
	let migrationPending = true;
	let initialPass = true;
	let inFlight = null;
	let stopPromise = null;
	let logRecovery;
	const recover = () => {
		if (stopped || inFlight || isGatewayWorkAdmissionClosed()) return;
		const settled = runWithGatewayIndependentRootWorkAdmission(async () => {
			if (stopped) return;
			const { drainPendingDeliveriesCore, recoverPendingDeliveries } = await import("./delivery-queue-recovery-D9JwXDOF.js");
			const { deliverOutboundPayloadsInternal } = await import("./deliver-B87xne1U.js");
			if (stopped) return;
			const deliverWithCurrentConversationAuthority = async (deliveryParams) => {
				const completion = deliveryParams.deliveryCompletion;
				const attemptAuthority = completion?.kind === "conversation" ? completion : deliveryParams.conversationDeliveryAttemptAuthority;
				if (!attemptAuthority) return await deliverOutboundPayloadsInternal(deliveryParams);
				return await deliverOutboundPayloadsInternal({
					...deliveryParams,
					onDeliveryAttempt: async () => {
						await deliveryParams.onDeliveryAttempt?.();
						if (!attemptAuthority.routeFingerprint) return;
						assertQueuedConversationDeliveryAttemptAuthorized({
							config: resolveGatewayPluginConfig({ config: getRuntimeConfig() }),
							agentId: attemptAuthority.agentId,
							operationId: attemptAuthority.operationId,
							...attemptAuthority.storePath ? { storePath: attemptAuthority.storePath } : {},
							routeFingerprint: attemptAuthority.routeFingerprint
						});
					}
				});
			};
			logRecovery ??= params.log.child("delivery-recovery");
			if (migrationPending) {
				const cfg = initialPass ? params.cfg : getRuntimeConfig();
				initialPass = false;
				const { migrateLegacyPendingOutboundDeliveries } = await import("./delivery-queue-migration-CQF-JL-Y.js");
				const migration = await migrateLegacyPendingOutboundDeliveries({
					cfg,
					log: logRecovery
				});
				migrationPending = migration.skipped > 0 || migration.remaining > 0;
				await recoverPendingDeliveries({
					deliver: deliverWithCurrentConversationAuthority,
					log: logRecovery,
					cfg
				});
				return;
			}
			await drainPendingDeliveriesCore({
				drainKey: "gateway:outbound",
				logLabel: "Outbound delivery retry",
				cfg: getRuntimeConfig(),
				log: logRecovery,
				deliver: deliverWithCurrentConversationAuthority,
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
	const retryTimer = setInterval(recover, computeBackoffMs(1));
	retryTimer.unref?.();
	recover();
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
			const { deliverQueuedSessionDelivery, recoverPendingRestartContinuationDeliveries, settleQueuedSessionDelivery } = await import("./server-restart-sentinel-BmzVmQ-y.js");
			if (stopped) return;
			const logRecovery = params.log.child("session-delivery-recovery");
			stopRuntime = startSessionDeliveryRuntime({
				deliver: (entry, context = {}) => deliverQueuedSessionDelivery({
					deps: params.deps,
					entry,
					...context.stateDir !== void 0 ? { stateDir: context.stateDir } : {},
					...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
				}),
				log: logRecovery,
				onSettled: settleQueuedSessionDelivery
			});
			try {
				await recoverPendingRestartContinuationDeliveries({
					deps: params.deps,
					log: logRecovery,
					maxEnqueuedAt: params.maxEnqueuedAt,
					...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
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
	if (!params.cronState.cronEnabled && resolveSkillWorkshopConfig(params.cfgAtStart).autonomous.mode === "auto") params.log.child("skill-workshop").warn("scheduled skill collection reviews are disabled because the cron scheduler is disabled; enable cron and restart the gateway");
	const heartbeatGatewayContextResolver = fenceScheduledGatewayContextResolver(params.resolveGatewayContext);
	const heartbeatRunner = startHeartbeatRunner({
		cfg: params.cfgAtStart,
		readCurrentConfig: getRuntimeConfig,
		...heartbeatGatewayContextResolver ? { runOnce: async (opts) => await runWithScheduledGatewayContext({
			resolveGatewayContext: heartbeatGatewayContextResolver,
			run: async () => await runHeartbeatOnce(opts)
		}) } : {}
	});
	const sessionUpstreamMonitor = startSessionUpstreamMonitor();
	const stopSessionDeliveryRuntime = startPendingSessionDeliveryRuntime({
		deps: params.deps,
		log: params.log,
		maxEnqueuedAt: params.sessionDeliveryRecoveryMaxEnqueuedAt,
		...params.resolveGatewayContext ? { resolveGatewayContext: params.resolveGatewayContext } : {}
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
export { startGatewayCronWithLogging as i, clearGatewayMaintenanceHandles as n, scheduleGatewayPostReadyMaintenance as r, activateGatewayScheduledServices as t };
