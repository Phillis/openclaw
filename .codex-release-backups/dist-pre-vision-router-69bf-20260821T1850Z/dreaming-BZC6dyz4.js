import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { C as resolveMemoryDreamingPluginConfig, T as resolveMemoryDreamingWorkspaces, _ as MANAGED_MEMORY_DREAMING_CRON_TAG, g as MANAGED_MEMORY_DREAMING_CRON_NAME, v as MEMORY_DREAMING_SYSTEM_EVENT_TEXT, x as resolveMemoryDeepDreamingConfig } from "./dreaming-N16HL0CK.js";
import { u as peekSystemEventEntries } from "./system-events-DecgSLEt.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./system-event-runtime-OWc-9LlT.js";
import "./memory-core-host-status-JUcmCcqh.js";
import "./memory-core-host-runtime-core-C719OzQ6.js";
import { n as includesSystemEventToken } from "./dreaming-shared-CVi145mY.js";
import { t as appendFailedDreamingEvent } from "./dreaming-events-DLr1Dh3P.js";
//#region extensions/memory-core/src/dreaming.ts
const RUNTIME_CRON_RECONCILE_INTERVAL_MS = 6e4;
const STARTUP_CRON_RETRY_DELAY_MS = 5e3;
const STARTUP_CRON_RETRY_MAX_ATTEMPTS = 12;
const HEARTBEAT_ISOLATED_SESSION_SUFFIX = ":heartbeat";
const MANAGED_DREAMING_DECLARATION_KEY = "memory-core:memory-dreaming-promotion";
function formatRepairSummary(repair) {
	const actions = [];
	if (repair.rewroteStore) {
		const removedOverflowEntries = repair.removedOverflowEntries ?? 0;
		const details = [
			repair.removedInvalidEntries > 0 ? `-${repair.removedInvalidEntries} invalid` : null,
			(repair.removedDanglingEntries ?? 0) > 0 ? `-${repair.removedDanglingEntries} dangling` : null,
			removedOverflowEntries > 0 ? `-${removedOverflowEntries} overflow` : null
		].filter(Boolean).join(", ");
		actions.push(`rewrote recall store${details ? ` (${details})` : ""}`);
	}
	if (repair.removedStaleLock) actions.push("removed stale promotion lock");
	return actions.join(", ");
}
function resolveManagedCronDescription(config) {
	const recencyHalfLifeDays = config.recencyHalfLifeDays ?? 14;
	return `${MANAGED_MEMORY_DREAMING_CRON_TAG} Promote weighted short-term recalls into MEMORY.md (limit=${config.limit}, minScore=${config.minScore.toFixed(3)}, minRecallCount=${config.minRecallCount}, minUniqueQueries=${config.minUniqueQueries}, recencyHalfLifeDays=${recencyHalfLifeDays}, maxAgeDays=${config.maxAgeDays ?? "none"}).`;
}
function buildManagedDreamingCronJob(config) {
	return {
		declarationKey: MANAGED_DREAMING_DECLARATION_KEY,
		name: MANAGED_MEMORY_DREAMING_CRON_NAME,
		description: resolveManagedCronDescription(config),
		enabled: true,
		schedule: {
			kind: "cron",
			expr: config.cron,
			...config.timezone ? { tz: config.timezone } : {}
		},
		sessionTarget: "isolated",
		wakeMode: "now",
		payload: {
			kind: "agentTurn",
			message: MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
			lightContext: true
		},
		delivery: { mode: "none" }
	};
}
function resolveManagedDreamingPayloadToken(payload) {
	const payloadKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(payload?.kind));
	if (payloadKind === "systemevent") return normalizeOptionalString(payload?.text);
	if (payloadKind === "agentturn") return normalizeOptionalString(payload?.message);
}
function isManagedDreamingJob(job) {
	if (normalizeOptionalString(job.declarationKey) === MANAGED_DREAMING_DECLARATION_KEY) return true;
	if (normalizeOptionalString(job.name) !== "Memory Dreaming Promotion") return false;
	if (normalizeOptionalString(job.description)?.includes("[managed-by=memory-core.short-term-promotion]")) return true;
	return resolveManagedDreamingPayloadToken(job.payload) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
}
function isLegacyPhaseDreamingJob(job) {
	const description = normalizeOptionalString(job.description);
	if (description?.includes("[managed-by=memory-core.dreaming.light]") || description?.includes("[managed-by=memory-core.dreaming.rem]")) return true;
	const name = normalizeOptionalString(job.name);
	const payloadText = normalizeOptionalString(job.payload?.text);
	if (name === "Memory Light Dreaming" && payloadText === "__openclaw_memory_core_light_sleep__") return true;
	return name === "Memory REM Dreaming" && payloadText === "__openclaw_memory_core_rem_sleep__";
}
async function removeStaleManagedDreamingRows(cron) {
	return await cron.removeStaleJobFamily({
		declarationKey: MANAGED_DREAMING_DECLARATION_KEY,
		name: "Memory Dreaming Promotion",
		ownerPluginTag: "[managed-by=memory-core.short-term-promotion]"
	}) ?? 0;
}
function compareOptionalStrings(a, b) {
	return a === b;
}
async function migrateLegacyPhaseDreamingCronJobs(params) {
	let migrated = 0;
	for (const job of params.legacyJobs) try {
		if ((await params.cron.remove(job.id)).removed === true) migrated += 1;
	} catch (err) {
		params.logger.warn(`memory-core: failed to migrate legacy phase dreaming cron job ${job.id}: ${formatErrorMessage(err)}`);
	}
	if (migrated > 0) if (params.mode === "enabled") params.logger.info(`memory-core: migrated ${migrated} legacy phase dreaming cron job(s) to the unified dreaming controller.`);
	else params.logger.info(`memory-core: completed legacy phase dreaming cron migration while unified dreaming is disabled (${migrated} job(s) removed).`);
	return migrated;
}
function buildManagedDreamingPatch(job, desired) {
	const patch = {};
	if (!compareOptionalStrings(normalizeOptionalString(job.name), desired.name)) patch.name = desired.name;
	if (!compareOptionalStrings(normalizeOptionalString(job.description), desired.description)) patch.description = desired.description;
	if (job.enabled !== true) patch.enabled = true;
	const scheduleKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.schedule?.kind));
	const scheduleExpr = normalizeOptionalString(job.schedule?.expr);
	const scheduleTz = normalizeOptionalString(job.schedule?.tz);
	if (scheduleKind !== "cron" || !compareOptionalStrings(scheduleExpr, desired.schedule.expr) || !compareOptionalStrings(scheduleTz, desired.schedule.tz)) patch.schedule = desired.schedule;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.sessionTarget)) !== desired.sessionTarget) patch.sessionTarget = desired.sessionTarget;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.wakeMode)) !== "now") patch.wakeMode = "now";
	const payloadKind = normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.payload?.kind));
	const payloadToken = resolveManagedDreamingPayloadToken(job.payload);
	const desiredPayloadToken = desired.payload.kind === "systemEvent" ? desired.payload.text : desired.payload.message;
	if (payloadKind !== normalizeLowercaseStringOrEmpty(desired.payload.kind) || !compareOptionalStrings(payloadToken, desiredPayloadToken) || desired.payload.kind === "agentTurn" && job.payload?.lightContext !== desired.payload.lightContext) patch.payload = desired.payload;
	if (normalizeLowercaseStringOrEmpty(normalizeOptionalString(job.delivery?.mode)) !== "none") patch.delivery = desired.delivery;
	return Object.keys(patch).length > 0 ? patch : null;
}
function sortManagedJobs(managed) {
	return managed.toSorted((a, b) => {
		const aCreated = typeof a.createdAtMs === "number" && Number.isFinite(a.createdAtMs) ? a.createdAtMs : Number.MAX_SAFE_INTEGER;
		const bCreated = typeof b.createdAtMs === "number" && Number.isFinite(b.createdAtMs) ? b.createdAtMs : Number.MAX_SAFE_INTEGER;
		if (aCreated !== bCreated) return aCreated - bCreated;
		return a.id.localeCompare(b.id);
	});
}
function isCronServiceLike(candidate) {
	return isRecord(candidate) && typeof candidate.list === "function" && typeof candidate.add === "function" && typeof candidate.update === "function" && typeof candidate.remove === "function" && typeof candidate.removeStaleJobFamily === "function";
}
function resolveCronServiceFromCandidate(candidate) {
	return isCronServiceLike(candidate) ? candidate : null;
}
function resolveCronServiceFromGatewayContext(context) {
	return resolveCronServiceFromCandidate(context?.getCron?.());
}
function resolveDreamingTriggerSessionKeys(sessionKey) {
	const normalized = normalizeOptionalString(sessionKey);
	if (!normalized) return [];
	const keys = [normalized];
	if (normalized.endsWith(HEARTBEAT_ISOLATED_SESSION_SUFFIX)) {
		const baseSessionKey = normalized.slice(0, -10).trim();
		if (baseSessionKey) keys.push(baseSessionKey);
	}
	return uniqueStrings(keys);
}
function hasPendingManagedDreamingCronEvent(sessionKey) {
	return resolveDreamingTriggerSessionKeys(sessionKey).some((candidateSessionKey) => peekSystemEventEntries(candidateSessionKey).some((event) => event.contextKey?.startsWith("cron:") === true && normalizeOptionalString(event.text) === "__openclaw_memory_core_short_term_promotion_dream__"));
}
function resolveShortTermPromotionDreamingConfig(params) {
	const resolved = resolveMemoryDeepDreamingConfig(params);
	return {
		enabled: resolved.enabled,
		cron: resolved.cron,
		...resolved.timezone ? { timezone: resolved.timezone } : {},
		limit: resolved.limit,
		minScore: resolved.minScore,
		minRecallCount: resolved.minRecallCount,
		minUniqueQueries: resolved.minUniqueQueries,
		recencyHalfLifeDays: resolved.recencyHalfLifeDays,
		...typeof resolved.maxAgeDays === "number" ? { maxAgeDays: resolved.maxAgeDays } : {},
		maxPromotedSnippetTokens: resolved.maxPromotedSnippetTokens ?? 160,
		maxPriorEntryLossFraction: resolved.maxPriorEntryLossFraction,
		verboseLogging: resolved.verboseLogging,
		storage: resolved.storage,
		...resolved.execution.model ? { execution: { model: resolved.execution.model } } : {}
	};
}
async function reconcileShortTermDreamingCronJob(params) {
	const cron = params.cron;
	if (!cron) return {
		status: "unavailable",
		removed: 0
	};
	const allJobs = await cron.list({ includeDisabled: true });
	const managed = allJobs.filter(isManagedDreamingJob);
	const legacyPhaseJobs = allJobs.filter(isLegacyPhaseDreamingJob);
	if (!params.config.enabled) {
		let removed = await migrateLegacyPhaseDreamingCronJobs({
			cron,
			legacyJobs: legacyPhaseJobs,
			logger: params.logger,
			mode: "disabled"
		});
		for (const job of managed) try {
			if ((await cron.remove(job.id)).removed === true) removed += 1;
		} catch (err) {
			params.logger.warn(`memory-core: failed to remove managed dreaming cron job ${job.id}: ${formatErrorMessage(err)}`);
		}
		removed += await removeStaleManagedDreamingRows(cron);
		if (removed > 0) params.logger.info(`memory-core: removed ${removed} managed dreaming cron job(s).`);
		return {
			status: "disabled",
			removed
		};
	}
	const desired = buildManagedDreamingCronJob(params.config);
	if (managed.length === 0) {
		await cron.add(desired);
		const migratedLegacy = await migrateLegacyPhaseDreamingCronJobs({
			cron,
			legacyJobs: legacyPhaseJobs,
			logger: params.logger,
			mode: "enabled"
		});
		const removedStale = await removeStaleManagedDreamingRows(cron);
		params.logger.info("memory-core: created managed dreaming cron job.");
		return {
			status: "added",
			removed: migratedLegacy + removedStale
		};
	}
	if (!managed.some((job) => job.declarationKey === MANAGED_DREAMING_DECLARATION_KEY)) {
		await cron.add(desired);
		let removed = await migrateLegacyPhaseDreamingCronJobs({
			cron,
			legacyJobs: legacyPhaseJobs,
			logger: params.logger,
			mode: "enabled"
		});
		for (const job of managed) {
			if ((await cron.remove(job.id)).removed !== true) throw new Error(`failed to replace legacy managed dreaming cron job ${job.id}`);
			removed += 1;
		}
		removed += await removeStaleManagedDreamingRows(cron);
		params.logger.info("memory-core: replaced legacy managed dreaming cron job identity.");
		return {
			status: "added",
			removed
		};
	}
	const primary = expectDefined(managed.find((job) => job.declarationKey === MANAGED_DREAMING_DECLARATION_KEY), "declaration-keyed managed dreaming job");
	const duplicates = sortManagedJobs(managed.filter((job) => job.id !== primary.id));
	let removed = await migrateLegacyPhaseDreamingCronJobs({
		cron,
		legacyJobs: legacyPhaseJobs,
		logger: params.logger,
		mode: "enabled"
	});
	for (const duplicate of duplicates) try {
		if ((await cron.remove(duplicate.id)).removed === true) removed += 1;
	} catch (err) {
		params.logger.warn(`memory-core: failed to prune duplicate managed dreaming cron job ${duplicate.id}: ${formatErrorMessage(err)}`);
	}
	removed += await removeStaleManagedDreamingRows(cron);
	const patch = buildManagedDreamingPatch(primary, desired);
	if (!patch) {
		if (removed > 0) params.logger.info("memory-core: pruned duplicate managed dreaming cron jobs.");
		return {
			status: "noop",
			removed
		};
	}
	await cron.update(primary.id, patch);
	params.logger.info("memory-core: updated managed dreaming cron job.");
	return {
		status: "updated",
		removed
	};
}
async function runShortTermDreamingPromotionIfTriggered(params) {
	if (params.trigger !== "heartbeat" && params.trigger !== "cron") return;
	if (!includesSystemEventToken(params.cleanedBody, "__openclaw_memory_core_short_term_promotion_dream__")) return;
	if (!params.config.enabled) return {
		handled: true,
		reason: "memory-core: short-term dreaming disabled"
	};
	const recencyHalfLifeDays = params.config.recencyHalfLifeDays ?? 14;
	const fallbackWorkspaceDir = normalizeOptionalString(params.workspaceDir);
	const triggerAgentId = normalizeLowercaseStringOrEmpty(params.agentId);
	const seenWorkspaces = /* @__PURE__ */ new Set();
	const workspaces = [];
	const addWorkspace = (workspaceDir, agentId) => {
		if (!workspaceDir || seenWorkspaces.has(workspaceDir)) return;
		seenWorkspaces.add(workspaceDir);
		workspaces.push({
			...agentId ? { agentId } : {},
			workspaceDir
		});
	};
	const resolveWorkspaceOwnerAgentId = (agentIds) => {
		if (triggerAgentId && agentIds.includes(triggerAgentId)) return triggerAgentId;
		return agentIds.toSorted()[0] ?? triggerAgentId;
	};
	if (params.cfg) for (const entry of resolveMemoryDreamingWorkspaces(params.cfg, {
		primaryWorkspaceDir: fallbackWorkspaceDir,
		...triggerAgentId ? { primaryAgentId: triggerAgentId } : {}
	})) addWorkspace(entry.workspaceDir, resolveWorkspaceOwnerAgentId(entry.agentIds));
	if (workspaces.length === 0 && fallbackWorkspaceDir) addWorkspace(fallbackWorkspaceDir, triggerAgentId);
	if (workspaces.length === 0) {
		params.logger.warn("memory-core: dreaming promotion skipped because no memory workspace is available.");
		return {
			handled: true,
			reason: "memory-core: short-term dreaming missing workspace"
		};
	}
	if (params.config.limit === 0) {
		params.logger.info("memory-core: dreaming promotion skipped because limit=0.");
		return {
			handled: true,
			reason: "memory-core: short-term dreaming disabled by limit"
		};
	}
	if (params.config.verboseLogging) params.logger.info(`memory-core: dreaming verbose enabled (cron=${params.config.cron}, limit=${params.config.limit}, minScore=${params.config.minScore.toFixed(3)}, minRecallCount=${params.config.minRecallCount}, minUniqueQueries=${params.config.minUniqueQueries}, recencyHalfLifeDays=${recencyHalfLifeDays}, maxAgeDays=${params.config.maxAgeDays ?? "none"}, workspaces=${workspaces.length}).`);
	let totalCandidates = 0;
	let totalApplied = 0;
	let failedWorkspaces = 0;
	let degradedNarratives = 0;
	let pendingNarratives = 0;
	const pluginConfig = params.cfg ? resolveMemoryDreamingPluginConfig(params.cfg) : void 0;
	const detachNarratives = params.trigger === "cron";
	const [{ writeDeepDreamingReport }, { appendFallbackNarrativeEntry, runDreamNarrative }, { runDreamingSweepPhases }, { applyShortTermPromotions, repairShortTermPromotionArtifacts, rankShortTermPromotionCandidates }] = await Promise.all([
		import("./dreaming-markdown-B695UYwh.js"),
		import("./dreaming-narrative-BcmV23YU.js"),
		import("./dreaming-phases-qBnGQDft.js"),
		import("./short-term-promotion-DZeGs7po.js")
	]);
	for (const { agentId, workspaceDir } of workspaces) {
		const sweepNowMs = Date.now();
		try {
			const phaseResult = await runDreamingSweepPhases({
				agentId,
				workspaceDir,
				pluginConfig,
				cfg: params.cfg,
				logger: params.logger,
				subagent: params.subagent,
				detachNarratives,
				nowMs: sweepNowMs
			});
			degradedNarratives += phaseResult?.degradedPhases ?? 0;
			pendingNarratives += phaseResult?.pendingNarratives ?? 0;
		} catch (err) {
			failedWorkspaces += 1;
			params.logger.error(`memory-core: dreaming sweep failed for workspace ${workspaceDir}: ${formatErrorMessage(err)}`);
			continue;
		}
		try {
			const reportLines = [];
			const repair = await repairShortTermPromotionArtifacts({ workspaceDir });
			if (repair.changed) {
				params.logger.info(`memory-core: normalized recall artifacts before dreaming (${formatRepairSummary(repair)}) [workspace=${workspaceDir}].`);
				reportLines.push(`- Repaired recall artifacts: ${formatRepairSummary(repair)}.`);
			}
			const candidates = await rankShortTermPromotionCandidates({
				workspaceDir,
				limit: params.config.limit,
				minScore: params.config.minScore,
				minRecallCount: params.config.minRecallCount,
				minUniqueQueries: params.config.minUniqueQueries,
				recencyHalfLifeDays,
				maxAgeDays: params.config.maxAgeDays,
				nowMs: sweepNowMs
			});
			totalCandidates += candidates.length;
			reportLines.push(`- Ranked ${candidates.length} candidate(s) for durable promotion.`);
			if (params.config.verboseLogging) {
				const candidateSummary = candidates.length > 0 ? candidates.map((candidate) => `${candidate.path}:${candidate.startLine}-${candidate.endLine} score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount} queries=${candidate.uniqueQueries} components={freq=${candidate.components.frequency.toFixed(3)},rel=${candidate.components.relevance.toFixed(3)},div=${candidate.components.diversity.toFixed(3)},rec=${candidate.components.recency.toFixed(3)},cons=${candidate.components.consolidation.toFixed(3)},concept=${candidate.components.conceptual.toFixed(3)}}`).join(" | ") : "none";
				params.logger.info(`memory-core: dreaming candidate details [workspace=${workspaceDir}] ${candidateSummary}`);
			}
			const applied = await applyShortTermPromotions({
				workspaceDir,
				candidates,
				limit: params.config.limit,
				minScore: params.config.minScore,
				minRecallCount: params.config.minRecallCount,
				minUniqueQueries: params.config.minUniqueQueries,
				maxAgeDays: params.config.maxAgeDays,
				maxPromotedSnippetTokens: params.config.maxPromotedSnippetTokens,
				maxPriorEntryLossFraction: params.config.maxPriorEntryLossFraction,
				consolidation: {
					...params.subagent ? { subagent: params.subagent } : {},
					...params.config.execution?.model ? { model: params.config.execution.model } : {},
					logger: params.logger
				},
				timezone: params.config.timezone,
				nowMs: sweepNowMs
			});
			totalApplied += applied.applied;
			reportLines.push(`- Promoted ${applied.applied} candidate(s) into MEMORY.md.`);
			if (params.config.verboseLogging) {
				const appliedSummary = applied.appliedCandidates.length > 0 ? applied.appliedCandidates.map((candidate) => `${candidate.path}:${candidate.startLine}-${candidate.endLine} score=${candidate.score.toFixed(3)} signals=${candidate.signalCount} recalls=${candidate.recallCount}`).join(" | ") : "none";
				params.logger.info(`memory-core: dreaming applied details [workspace=${workspaceDir}] ${appliedSummary}`);
			}
			await writeDeepDreamingReport({
				workspaceDir,
				bodyLines: reportLines,
				nowMs: sweepNowMs,
				timezone: params.config.timezone,
				storage: params.config.storage ?? {
					mode: "separate",
					separateReports: false
				}
			});
			if (candidates.length > 0 || applied.applied > 0) {
				const data = {
					phase: "deep",
					snippets: candidates.map((c) => c.snippet).filter(Boolean),
					promotions: applied.appliedCandidates.map((c) => c.snippet).filter(Boolean)
				};
				if (!params.subagent) await appendFallbackNarrativeEntry({
					workspaceDir,
					data,
					nowMs: sweepNowMs,
					timezone: params.config.timezone,
					logger: params.logger,
					reason: "subagent runtime is unavailable"
				});
				else {
					const narrativeOutcome = await runDreamNarrative({
						agentId,
						subagent: params.subagent,
						workspaceDir,
						data,
						nowMs: sweepNowMs,
						timezone: params.config.timezone,
						model: params.config.execution?.model,
						logger: params.logger,
						detached: detachNarratives
					});
					if (narrativeOutcome.status === "degraded") degradedNarratives += 1;
					else if (narrativeOutcome.status === "pending") pendingNarratives += 1;
				}
			}
		} catch (err) {
			failedWorkspaces += 1;
			const error = formatErrorMessage(err);
			params.logger.error(`memory-core: dreaming promotion failed for workspace ${workspaceDir}: ${error}`);
			await appendFailedDreamingEvent({
				workspaceDir,
				phase: "deep",
				error,
				storageMode: params.config.storage?.mode ?? "separate",
				nowMs: sweepNowMs,
				logger: params.logger
			});
		}
	}
	const summary = `memory-core: dreaming promotion complete (workspaces=${workspaces.length}, candidates=${totalCandidates}, applied=${totalApplied}, failed=${failedWorkspaces}, degraded=${degradedNarratives}, narrativesPending=${pendingNarratives}).`;
	if (failedWorkspaces === workspaces.length || degradedNarratives > 0) params.logger.warn(summary);
	else params.logger.info(summary);
	return {
		handled: true,
		reason: degradedNarratives > 0 ? "memory-core: short-term dreaming degraded" : "memory-core: short-term dreaming processed"
	};
}
function registerShortTermPromotionDreaming(api) {
	let resolveStartupCron = null;
	let gatewayContext = null;
	let unavailableCronWarningEmitted = false;
	let lastRuntimeReconcileAtMs = 0;
	let lastRuntimeConfigKey = null;
	let lastRuntimeCronRef = null;
	let startupCronRetryTimer = null;
	let startupDreamingCleanupTimer = null;
	let runtimeCronReconcileTimer = null;
	let startupCronRetryAttempts = 0;
	let gatewayLifecycleGeneration = 0;
	let disposed = false;
	const resolveCurrentConfig = () => api.runtime.config?.current?.() ?? api.config;
	const clearStartupCronRetry = () => {
		if (startupCronRetryTimer) {
			clearTimeout(startupCronRetryTimer);
			startupCronRetryTimer = null;
		}
		startupCronRetryAttempts = 0;
	};
	const hasStartupCron = () => {
		try {
			return Boolean(resolveStartupCron?.());
		} catch {
			return false;
		}
	};
	const hasCronManagementContext = () => Boolean(resolveStartupCron || gatewayContext?.getCron);
	const disposeStartupCronRetry = () => {
		disposed = true;
		gatewayLifecycleGeneration += 1;
		clearStartupCronRetry();
		if (startupDreamingCleanupTimer) {
			clearTimeout(startupDreamingCleanupTimer);
			startupDreamingCleanupTimer = null;
		}
		if (runtimeCronReconcileTimer) {
			clearInterval(runtimeCronReconcileTimer);
			runtimeCronReconcileTimer = null;
		}
		gatewayContext = null;
		resolveStartupCron = null;
	};
	const runtimeConfigKey = (config) => [
		config.enabled ? "enabled" : "disabled",
		config.cron,
		config.timezone ?? "",
		String(config.limit),
		String(config.minScore),
		String(config.minRecallCount),
		String(config.minUniqueQueries),
		String(config.recencyHalfLifeDays ?? ""),
		String(config.maxAgeDays ?? ""),
		config.verboseLogging ? "verbose" : "quiet",
		config.storage?.mode ?? "",
		config.storage?.separateReports ? "separate" : "inline"
	].join("|");
	const reconcileManagedDreamingCron = async (params) => {
		const startupCfg = params.reason === "startup" ? params.startupConfig ?? api.config : resolveCurrentConfig();
		const config = resolveShortTermPromotionDreamingConfig({
			pluginConfig: params.reason === "startup" ? resolveMemoryDreamingPluginConfig(startupCfg) ?? resolveMemoryDreamingPluginConfig(api.config) ?? api.pluginConfig : resolveMemoryDreamingPluginConfig(startupCfg),
			cfg: startupCfg
		});
		if (params.reason === "startup") resolveStartupCron = params.startupCron ?? null;
		let cron = resolveStartupCron?.() ?? null;
		if (!cron && params.reason !== "startup" && gatewayContext) try {
			cron = resolveCronServiceFromGatewayContext(gatewayContext);
			if (cron) resolveStartupCron = () => cron;
		} catch {}
		const configKey = runtimeConfigKey(config);
		if (!cron && config.enabled && !unavailableCronWarningEmitted) if (params.reason === "startup" || params.reason === "startup_retry") api.logger.debug?.("memory-core: cron service not yet available at gateway_start; deferring to runtime reconciliation.");
		else {
			api.logger.warn("memory-core: managed dreaming cron could not be reconciled (cron service unavailable).");
			unavailableCronWarningEmitted = true;
		}
		if (cron) {
			unavailableCronWarningEmitted = false;
			clearStartupCronRetry();
		}
		if (!cron && params.reason === "startup_retry") return config;
		if (params.reason === "runtime") {
			const now = Date.now();
			if (now - lastRuntimeReconcileAtMs < RUNTIME_CRON_RECONCILE_INTERVAL_MS && lastRuntimeConfigKey === configKey && lastRuntimeCronRef === cron) return config;
			lastRuntimeReconcileAtMs = now;
			lastRuntimeConfigKey = configKey;
			lastRuntimeCronRef = cron;
		}
		await reconcileShortTermDreamingCronJob({
			cron,
			config,
			logger: api.logger
		});
		return config;
	};
	const scheduleStartupCronRetry = () => {
		if (disposed || hasStartupCron()) {
			clearStartupCronRetry();
			return;
		}
		if (startupCronRetryTimer || startupCronRetryAttempts >= STARTUP_CRON_RETRY_MAX_ATTEMPTS) return;
		startupCronRetryTimer = setTimeout(() => {
			startupCronRetryTimer = null;
			if (disposed) return;
			startupCronRetryAttempts += 1;
			reconcileManagedDreamingCron({ reason: "startup_retry" }).then(async () => {
				if (disposed || hasStartupCron()) {
					clearStartupCronRetry();
					return;
				}
				if (startupCronRetryAttempts >= STARTUP_CRON_RETRY_MAX_ATTEMPTS) {
					await reconcileManagedDreamingCron({ reason: "runtime" });
					return;
				}
				scheduleStartupCronRetry();
			}).catch((err) => {
				if (disposed) return;
				api.logger.error(`memory-core: deferred dreaming cron retry failed: ${formatErrorMessage(err)}`);
				scheduleStartupCronRetry();
			});
		}, STARTUP_CRON_RETRY_DELAY_MS);
	};
	const startRuntimeCronReconcileTimer = () => {
		if (disposed || runtimeCronReconcileTimer) return;
		runtimeCronReconcileTimer = setInterval(() => {
			reconcileManagedDreamingCron({ reason: "runtime" }).catch((err) => {
				api.logger.error(`memory-core: dreaming cron reconcile failed: ${formatErrorMessage(err)}`);
			});
		}, RUNTIME_CRON_RECONCILE_INTERVAL_MS);
		runtimeCronReconcileTimer.unref?.();
	};
	const startDreamingSessionCleanup = async (config, generation, startupStartedAtMs) => {
		const { DREAMING_ORPHAN_MIN_AGE_MS, scrubDreamingNarrativeArtifacts } = await import("./dreaming-session-cleanup-vmb0SyGO.js");
		if (disposed || generation !== gatewayLifecycleGeneration) return;
		const scrubConfiguredAgents = async (currentConfig, nowMs) => {
			const agentIds = uniqueStrings(resolveMemoryDreamingWorkspaces(currentConfig).flatMap(({ agentIds: workspaceAgentIds }) => workspaceAgentIds));
			for (const agentId of agentIds) {
				if (disposed || generation !== gatewayLifecycleGeneration) return;
				try {
					await scrubDreamingNarrativeArtifacts({
						agentId,
						config: currentConfig,
						logger: api.logger,
						...nowMs === void 0 ? {} : { nowMs }
					});
				} catch (error) {
					api.logger.warn(`memory-core: dreaming startup cleanup failed for agent ${agentId}: ${formatErrorMessage(error)}`);
				}
			}
		};
		await scrubConfiguredAgents(config, startupStartedAtMs);
		if (disposed || generation !== gatewayLifecycleGeneration) return;
		const cleanupTimer = setTimeout(() => {
			if (disposed || generation !== gatewayLifecycleGeneration || startupDreamingCleanupTimer !== cleanupTimer) return;
			startupDreamingCleanupTimer = null;
			scrubConfiguredAgents(resolveCurrentConfig(), startupStartedAtMs + DREAMING_ORPHAN_MIN_AGE_MS - 1).catch((error) => {
				api.logger.warn(`memory-core: deferred dreaming startup cleanup failed: ${formatErrorMessage(error)}`);
			});
		}, DREAMING_ORPHAN_MIN_AGE_MS);
		startupDreamingCleanupTimer = cleanupTimer;
		startupDreamingCleanupTimer.unref?.();
	};
	api.on("gateway_start", async (_event, ctx) => {
		const startupStartedAtMs = Date.now();
		disposed = false;
		if (startupDreamingCleanupTimer) {
			clearTimeout(startupDreamingCleanupTimer);
			startupDreamingCleanupTimer = null;
		}
		const generation = ++gatewayLifecycleGeneration;
		gatewayContext = ctx;
		try {
			await reconcileManagedDreamingCron({
				reason: "startup",
				startupConfig: ctx.config,
				startupCron: () => resolveCronServiceFromGatewayContext(ctx)
			});
		} catch (err) {
			api.logger.error(`memory-core: dreaming startup reconciliation failed: ${formatErrorMessage(err)}`);
		} finally {
			startRuntimeCronReconcileTimer();
			scheduleStartupCronRetry();
			await startDreamingSessionCleanup(ctx.config ?? api.config, generation, startupStartedAtMs).catch((error) => {
				api.logger.warn(`memory-core: dreaming startup cleanup failed: ${formatErrorMessage(error)}`);
			});
		}
	});
	api.on("gateway_stop", () => {
		disposeStartupCronRetry();
	});
	api.on("before_agent_reply", async (event, ctx) => {
		try {
			if (ctx.trigger !== "heartbeat" && ctx.trigger !== "cron") return;
			const currentConfig = resolveCurrentConfig();
			const hasManagedDreamingToken = includesSystemEventToken(event.cleanedBody, MEMORY_DREAMING_SYSTEM_EVENT_TEXT);
			const isManagedHeartbeatTrigger = ctx.trigger === "heartbeat" && hasPendingManagedDreamingCronEvent(ctx.sessionKey);
			const isManagedCronTrigger = ctx.trigger === "cron";
			const shouldHandleManagedDreaming = hasManagedDreamingToken && (isManagedHeartbeatTrigger || isManagedCronTrigger);
			if (!shouldHandleManagedDreaming && !hasCronManagementContext()) return;
			const config = await reconcileManagedDreamingCron({ reason: "runtime" });
			if (!shouldHandleManagedDreaming) return;
			return await runShortTermDreamingPromotionIfTriggered({
				cleanedBody: event.cleanedBody,
				trigger: ctx.trigger,
				agentId: ctx.agentId,
				workspaceDir: ctx.workspaceDir,
				cfg: currentConfig,
				config,
				logger: api.logger,
				subagent: config.enabled ? api.runtime?.subagent : void 0
			});
		} catch (err) {
			api.logger.error(`memory-core: dreaming trigger failed: ${formatErrorMessage(err)}`);
			return;
		}
	}, { eligibleTriggers: ["heartbeat", "cron"] });
}
//#endregion
export { resolveShortTermPromotionDreamingConfig as n, registerShortTermPromotionDreaming as t };
