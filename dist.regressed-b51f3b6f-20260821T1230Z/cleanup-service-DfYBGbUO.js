import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { a as getLogger } from "./logger-BWBYvpHz.js";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-D8ws5hED.js";
import "./openclaw-agent-db-lxLIE6rA.js";
import { A as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { At as purgeDeletedAgentSessionEntries, Dt as applySessionEntryLifecycleMutation, Pt as listSessionEntriesCore } from "./session-accessor-Bi6bzKQE.js";
import { c as resolveSessionStoreTargets } from "./targets-DxP0vsft.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DH7-Rfwr.js";
import { o as enforceSqliteSessionHistoryDiskBudget, s as inspectSqliteSessionHistoryDiskBudget } from "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { x as loadTranscriptEventsSync } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { A as shouldRunModelRunPrune, E as pruneStaleModelRunEntries, S as capEntryCount, T as pruneStaleEntries, b as resolveSessionArtifactCanonicalPathsForEntry, k as shouldPreserveMaintenanceEntry, x as resolveMaintenanceConfig, y as pruneUnreferencedSessionArtifacts } from "./agent-harness-session-key-BMj1lPtX.js";
import { C as collectSessionMaintenancePreserveKeysForStore } from "./restart-recovery-state-BoowPFT5.js";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/cleanup-service.ts
function resolveCleanupSqlitePath(target) {
	return resolveSqliteTargetFromSessionStorePath(target.storePath, { agentId: target.agentId }).path ?? resolveOpenClawAgentSqlitePath({ agentId: target.agentId });
}
function loadCleanupSessionStore(target, options = {}) {
	if (options.createIfMissing !== true && !fs.existsSync(resolveCleanupSqlitePath(target))) return {};
	return Object.fromEntries(listSessionEntriesCore({
		agentId: target.agentId,
		storePath: target.storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
}
function isTranscriptMessageRole(role) {
	return role === "user" || role === "assistant" || role === "tool" || role === "toolResult" || role === "system";
}
function isTranscriptMessageRecord(entry) {
	if (!entry || typeof entry !== "object") return false;
	const record = entry;
	if (record.type === "message") return true;
	if (record.type === void 0 && record.message && typeof record.message === "object" && isTranscriptMessageRole(record.message.role)) return true;
	return record.type === void 0 && isTranscriptMessageRole(record.role);
}
function sqliteTranscriptHasMessageRecords(params) {
	try {
		return loadTranscriptEventsSync(params).some(isTranscriptMessageRecord);
	} catch {
		return false;
	}
}
/** Resolves the action label for one session key from cleanup key sets. */
function resolveSessionCleanupAction(params) {
	if (params.dmScopeRetiredKeys.has(params.key)) return "retire-dm-scope";
	if (params.missingKeys.has(params.key)) return "prune-missing";
	if (params.modelRunPrunedKeys.has(params.key)) return "prune-model-run";
	if (params.staleKeys.has(params.key)) return "prune-stale";
	if (params.cappedKeys.has(params.key)) return "cap-overflow";
	if (params.budgetEvictedKeys.has(params.key)) return "evict-budget";
	return "keep";
}
function isMainScopeStaleDirectSessionKey(params) {
	if ((params.cfg.session?.dmScope ?? "main") !== "main") return false;
	if (params.activeKey && params.key === params.activeKey) return false;
	const parsed = parseAgentSessionKey(params.key);
	if (!parsed || normalizeAgentId(parsed.agentId) !== normalizeAgentId(params.targetAgentId)) return false;
	const parts = parsed.rest.split(":");
	if (parts[0] === "agent") return false;
	return parts.length === 2 && parts[0] === "direct" && Boolean(parts[1]) || parts.length === 3 && Boolean(parts[0]) && parts[1] === "direct" && Boolean(parts[2]) || parts.length === 4 && Boolean(parts[0]) && Boolean(parts[1]) && parts[2] === "direct" && Boolean(parts[3]);
}
function retireMainScopeDirectSessionEntries(params) {
	let retired = 0;
	for (const [key, entry] of Object.entries(params.store)) {
		if (entry.archivedAt !== void 0) continue;
		if (isMainScopeStaleDirectSessionKey({
			cfg: params.cfg,
			targetAgentId: params.targetAgentId,
			key,
			activeKey: params.activeKey
		})) {
			params.onRetired?.(key, entry);
			delete params.store[key];
			retired += 1;
		}
	}
	return retired;
}
function serializeSessionCleanupResult(params) {
	if (params.summaries.length === 1) return params.summaries[0] ?? {};
	return {
		allAgents: true,
		mode: params.mode,
		dryRun: params.dryRun,
		stores: params.summaries
	};
}
function pruneMissingTranscriptEntries(params) {
	let removed = 0;
	for (const [key, entry] of Object.entries(params.store)) {
		if ((entry?.modelSelectionLocked === true || entry?.archivedAt !== void 0) && shouldPreserveMaintenanceEntry({
			key,
			entry
		})) continue;
		const legacySessionFile = entry.sessionFile;
		if (parseAgentSessionKey(key) && (entry.initializationPending === true || entry.sessionId === key && (typeof legacySessionFile !== "string" || !legacySessionFile.trim()))) continue;
		if (!entry?.sessionId) {
			if (parseAgentSessionKey(key)) continue;
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry);
			continue;
		}
		if (!sqliteTranscriptHasMessageRecords({
			sessionId: entry.sessionId,
			sessionKey: key,
			storePath: params.storePath
		})) {
			delete params.store[key];
			removed += 1;
			params.onPruned?.(key, entry);
		}
	}
	return removed;
}
function addEntryArtifactPathsToSet(params) {
	const sessionsDir = path.dirname(params.storePath);
	for (const key of params.keys) {
		const entry = params.store[key];
		if (!entry) continue;
		for (const artifactPath of resolveSessionArtifactCanonicalPathsForEntry({
			sessionsDir,
			entry
		})) params.paths.add(artifactPath);
	}
}
async function previewStoreCleanup(params) {
	const beforeStore = loadCleanupSessionStore(params.target, { createIfMissing: !params.dryRun });
	const previewStore = structuredClone(beforeStore);
	const staleKeys = /* @__PURE__ */ new Set();
	const cappedKeys = /* @__PURE__ */ new Set();
	const missingKeys = /* @__PURE__ */ new Set();
	const modelRunPrunedKeys = /* @__PURE__ */ new Set();
	const dmScopeRetiredKeys = /* @__PURE__ */ new Set();
	const missing = params.fixMissing === true ? pruneMissingTranscriptEntries({
		store: previewStore,
		storePath: params.target.storePath,
		onPruned: (key) => {
			missingKeys.add(key);
		}
	}) : 0;
	const dmScopeRetired = params.fixDmScope === true ? retireMainScopeDirectSessionEntries({
		cfg: params.cfg,
		store: previewStore,
		targetAgentId: params.target.agentId,
		activeKey: params.activeKey,
		onRetired: (key) => {
			dmScopeRetiredKeys.add(key);
		}
	}) : 0;
	const preserveSessionKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.target.storePath,
		store: previewStore,
		baseKeys: [params.activeKey]
	});
	const modelRunPruned = shouldRunModelRunPrune({
		maintenance: params.maintenance,
		entryCount: Object.keys(previewStore).length,
		force: true
	}) ? pruneStaleModelRunEntries(previewStore, params.maintenance.modelRunPruneAfterMs, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onPruned: ({ key }) => {
			modelRunPrunedKeys.add(key);
		}
	}) : 0;
	const pruned = pruneStaleEntries(previewStore, params.maintenance.pruneAfterMs, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onPruned: ({ key }) => {
			staleKeys.add(key);
		}
	});
	const capped = capEntryCount(previewStore, params.maintenance.maxEntries, {
		log: false,
		preserveKeys: preserveSessionKeys,
		onCapped: ({ key }) => {
			cappedKeys.add(key);
		}
	});
	const entryCleanupArtifactPaths = /* @__PURE__ */ new Set();
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: modelRunPrunedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: staleKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: cappedKeys
	});
	addEntryArtifactPathsToSet({
		paths: entryCleanupArtifactPaths,
		store: beforeStore,
		storePath: params.target.storePath,
		keys: dmScopeRetiredKeys
	});
	const diskBudgetPreview = fs.existsSync(resolveCleanupSqlitePath(params.target)) ? await inspectSqliteSessionHistoryDiskBudget({
		agentId: params.target.agentId,
		storePath: params.target.storePath,
		mode: params.mode,
		maintenance: params.maintenance
	}) : {
		diskBudget: null,
		wouldMutate: false
	};
	const diskBudget = diskBudgetPreview.diskBudget;
	const unreferencedArtifacts = await pruneUnreferencedSessionArtifacts({
		store: previewStore,
		storePath: params.target.storePath,
		olderThanMs: params.maintenance.pruneAfterMs,
		dryRun: true,
		excludeCanonicalPaths: entryCleanupArtifactPaths
	});
	const budgetEvictedKeys = /* @__PURE__ */ new Set();
	const beforeCount = Object.keys(beforeStore).length;
	const afterPreviewCount = Object.keys(previewStore).length;
	const wouldMutate = missing > 0 || dmScopeRetired > 0 || modelRunPruned > 0 || pruned > 0 || capped > 0 || unreferencedArtifacts.removedFiles > 0 || (diskBudget?.removedEntries ?? 0) > 0 || (diskBudget?.removedFiles ?? 0) > 0 || diskBudgetPreview.wouldMutate;
	return {
		summary: {
			agentId: params.target.agentId,
			storePath: params.target.storePath,
			mode: params.mode,
			dryRun: params.dryRun,
			beforeCount,
			afterCount: afterPreviewCount,
			missing,
			dmScopeRetired,
			modelRunPruned,
			pruned,
			capped,
			unreferencedArtifacts,
			diskBudget,
			wouldMutate
		},
		beforeStore,
		missingKeys,
		modelRunPrunedKeys,
		staleKeys,
		cappedKeys,
		budgetEvictedKeys,
		dmScopeRetiredKeys
	};
}
/** Runs session cleanup preview/apply for the selected store targets. */
async function runSessionsCleanup(params) {
	const { cfg, opts } = params;
	const maintenance = resolveMaintenanceConfig();
	const mode = opts.enforce ? "enforce" : maintenance.mode;
	const targets = params.targets ?? resolveSessionStoreTargets(cfg, {
		store: opts.store,
		agent: opts.agent,
		allAgents: opts.allAgents
	});
	const previewResults = [];
	for (const target of targets) {
		const result = await previewStoreCleanup({
			cfg,
			target,
			maintenance,
			mode,
			dryRun: Boolean(opts.dryRun),
			activeKey: opts.activeKey,
			fixMissing: Boolean(opts.fixMissing),
			fixDmScope: Boolean(opts.fixDmScope)
		});
		previewResults.push(result);
	}
	const appliedSummaries = [];
	if (!opts.dryRun) for (const target of targets) {
		const applyStore = loadCleanupSessionStore(target, { createIfMissing: true });
		const missingRemovals = [];
		const dmScopeRetiredRemovals = [];
		if (opts.fixMissing) pruneMissingTranscriptEntries({
			store: applyStore,
			storePath: target.storePath,
			onPruned: (sessionKey, entry) => {
				missingRemovals.push({
					sessionKey,
					expectedEntry: structuredClone(entry)
				});
			}
		});
		if (opts.fixDmScope) retireMainScopeDirectSessionEntries({
			cfg,
			store: applyStore,
			targetAgentId: target.agentId,
			activeKey: opts.activeKey,
			onRetired: (sessionKey, entry) => {
				dmScopeRetiredRemovals.push({
					sessionKey,
					expectedEntry: structuredClone(entry),
					archiveRemovedTranscript: true
				});
			}
		});
		const removals = [...missingRemovals, ...dmScopeRetiredRemovals];
		const lifecycleResult = await applySessionEntryLifecycleMutation({
			storePath: target.storePath,
			removals,
			activeSessionKey: opts.activeKey,
			maintenanceOverride: {
				...maintenance,
				mode
			}
		});
		const postApplyStore = loadCleanupSessionStore(target, { createIfMissing: true });
		const appliedUnreferencedArtifacts = mode === "warn" ? null : await pruneUnreferencedSessionArtifacts({
			store: postApplyStore,
			storePath: target.storePath,
			olderThanMs: maintenance.pruneAfterMs,
			dryRun: false
		});
		const removedSessionKeys = new Set(lifecycleResult.removedSessionKeys);
		const missingApplied = missingRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
		const dmScopeRetiredApplied = dmScopeRetiredRemovals.filter(({ sessionKey }) => removedSessionKeys.has(sessionKey)).length;
		const unreferencedArtifacts = mode === "warn" ? {
			scannedFiles: 0,
			removedFiles: 0,
			freedBytes: 0,
			olderThanMs: maintenance.pruneAfterMs
		} : lifecycleResult.unreferencedArtifacts ?? appliedUnreferencedArtifacts ?? {
			scannedFiles: 0,
			removedFiles: 0,
			freedBytes: 0,
			olderThanMs: maintenance.pruneAfterMs
		};
		const appliedDiskBudget = await enforceSqliteSessionHistoryDiskBudget({
			agentId: target.agentId,
			storePath: target.storePath,
			mode,
			maintenance
		});
		const preview = previewResults.find((result) => result.summary.storePath === target.storePath);
		const appliedReport = lifecycleResult.maintenanceReport;
		const summary = appliedReport === null ? {
			...preview?.summary ?? {
				agentId: target.agentId,
				storePath: target.storePath,
				mode,
				dryRun: false,
				beforeCount: 0,
				afterCount: 0,
				missing: 0,
				dmScopeRetired: 0,
				modelRunPruned: 0,
				pruned: 0,
				capped: 0,
				unreferencedArtifacts,
				diskBudget: null,
				wouldMutate: false
			},
			dryRun: false,
			unreferencedArtifacts,
			diskBudget: appliedDiskBudget,
			wouldMutate: removedSessionKeys.size > 0 || unreferencedArtifacts.removedFiles > 0 || (appliedDiskBudget?.removedEntries ?? 0) > 0 || (appliedDiskBudget?.removedFiles ?? 0) > 0 || appliedDiskBudget != null && appliedDiskBudget.totalBytesAfter < appliedDiskBudget.totalBytesBefore,
			applied: true,
			appliedCount: lifecycleResult.afterCount
		} : {
			agentId: target.agentId,
			storePath: target.storePath,
			mode: appliedReport.mode,
			dryRun: false,
			beforeCount: appliedReport.beforeCount,
			afterCount: appliedReport.afterCount,
			missing: missingApplied,
			dmScopeRetired: dmScopeRetiredApplied,
			modelRunPruned: appliedReport.modelRunPruned,
			pruned: appliedReport.pruned,
			capped: appliedReport.capped,
			unreferencedArtifacts,
			diskBudget: appliedDiskBudget,
			wouldMutate: missingApplied > 0 || dmScopeRetiredApplied > 0 || appliedReport.modelRunPruned > 0 || appliedReport.pruned > 0 || appliedReport.capped > 0 || unreferencedArtifacts.removedFiles > 0 || (appliedDiskBudget?.removedEntries ?? 0) > 0 || (appliedDiskBudget?.removedFiles ?? 0) > 0 || appliedDiskBudget != null && appliedDiskBudget.totalBytesAfter < appliedDiskBudget.totalBytesBefore,
			applied: true,
			appliedCount: lifecycleResult.afterCount
		};
		appliedSummaries.push(summary);
	}
	return {
		mode,
		previewResults,
		appliedSummaries
	};
}
/** Purge session store entries for a deleted agent (#65524). Best-effort. */
async function purgeAgentSessionStoreEntries(cfg, agentId) {
	try {
		const normalizedAgentId = normalizeAgentId(agentId);
		const storeConfig = cfg.session?.store;
		await purgeDeletedAgentSessionEntries({
			cfg,
			agentId: normalizedAgentId,
			storeAgentId: typeof storeConfig === "string" && !storeConfig.includes("{agentId}") ? resolveSessionStoreCompatibilityAgentId(cfg) : normalizedAgentId,
			storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId: normalizedAgentId })
		});
	} catch (err) {
		getLogger().debug("session store purge skipped during agent delete", err);
	}
}
//#endregion
export { serializeSessionCleanupResult as i, resolveSessionCleanupAction as n, runSessionsCleanup as r, purgeAgentSessionStoreEntries as t };
