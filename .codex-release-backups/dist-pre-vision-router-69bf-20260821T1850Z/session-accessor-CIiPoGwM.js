import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { I as resolveTimestampMsToIsoString, s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { C as resolveSessionAuthProfileOverrideSource } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { a as listAgentIds, b as tryResolveLegacyCompatibilityAgentId, t as AgentSelectionRequiredError } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { c as classifySessionKeyShape, f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { r as resolvePersistedSessionStoreOwnerForTarget } from "./session-store-owner-CLtsGq3M.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { i as getChildLogger } from "./logger-CufStxi-.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BC0q3X-J.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { g as openOpenClawAgentDatabase, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import { A as resolveOpenClawAgentSqlitePath, O as isIncognitoOpenClawAgentSqlitePath, k as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import { r as resolveAgentMainSessionKey } from "./main-session-Dth0X5B9.js";
import { a as resolveStoredSessionOwnerAgentId, n as resolveSessionStoreAgentId, r as resolveSessionStoreKey } from "./session-store-key-Cc0gbvo8.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DX1p0rnU.js";
import { A as rehomeSessionWindows, C as readLifecycleTargetSnapshot, D as readSessionEntrySelectionSnapshot, E as readSessionEntryRow, G as canonicalSessionKeyMigrationRequiredError, J as coerceSqliteNumber, M as sqliteSessionEntriesEqual, N as writeSessionEntry, O as readSessionEntryStore, S as readExactSessionEntryRowValidated, U as assertCanonicalSessionKeyWrite, W as assertCanonicalSqliteSessionKeysCurrent, X as collectSessionStateIdsForEntry, Y as createFallbackSessionEntry, at as parseSessionEntryJson, b as readExactSessionEntryJsonForCanonicalRepair, ct as deriveSessionMetaPatch, f as assertLifecycleTargetSnapshotUnchanged, g as deleteLegacySessionEntryRows, h as createSessionIdentitySnapshot, j as resolveLifecyclePrimaryEntry, k as readSessionIdentitySnapshot, m as assertSessionEntrySelectionUnchanged, o as resolveAllAgentSessionStoreTargetsSync, ot as readSessionEntriesByStatus, rt as readSessionEntryCache, st as deriveLastRoutePatch, v as deleteSessionEntryRows, w as readSessionEntryCount, x as readExactSessionEntryRow, y as normalizeLifecycleTarget, z as readTranscriptGenerationInTransaction } from "./targets-CdQ3kEkv.js";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey, s as resolveSessionStoreEntryCore, t as collectSessionEntryLookupKeys } from "./store-entry-BB6W2GxL.js";
import { a as normalizeSqliteSessionKey, c as resolveSqliteStoreScope, d as resolveSqliteTranscriptScope, f as runExclusiveSqliteSessionWrite, i as getSessionKysely, l as resolveSqliteTranscriptArchiveDirectory, n as formatLegacySqliteSessionMarkerForScope, p as toDatabaseOptions, r as formatSqliteSessionReferenceForScope, s as resolveSqliteScope, t as cloneSessionEntry, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
import { a as reconcileSessionTranscriptIndexInTransaction, g as isSessionTranscriptLeafControl, w as selectSessionTranscriptTreePathNodes, x as scanSessionTranscriptTree, y as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath } from "./session-transcript-index-B7GQuTh4.js";
import { c as kickSessionHistoryDiskBudgetMaintenance, d as emitCommittedLifecycleIdentityMutations, f as emitCommittedSessionEntryRemovals, l as emitArchivedTranscriptUpdates, p as emitCommittedSessionIdentityDiff } from "./session-accessor.sqlite-lifecycle-BFaW8ajj.js";
import { i as writeTranscriptArchive, n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-delete-snapshot-15FV4pBR.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { D as readTranscriptEventRows, E as readTranscriptEventMessage, M as resolveSqliteSessionTranscriptReadFence, O as readTranscriptSnapshot, a as readMessageIdempotencyKey, b as loadTranscriptEventsFromDatabase, c as readTranscriptMessageByScopedIdempotencyKey, d as rewriteSqliteTranscriptEventRowsInTransaction, i as readActiveTranscriptAppendParentId, j as SessionTranscriptReadFenceError, l as redactTranscriptMessageForStorage, n as appendTranscriptEventsInTransaction, o as readTranscriptIdentityByEventId, p as createSessionTranscriptHeader, r as ensureTranscriptHeader, s as readTranscriptMessageByEventId, t as appendTranscriptEventInTransaction, u as replaceSqliteTranscriptEventsInTransaction, y as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-Cgnm_AHf.js";
import { c as assertPlannedLifecycleArtifactEntriesUnchanged, d as deletePlannedLifecycleArtifactEntries, h as projectSessionEntryLifecycleMutation, i as readExactSessionEntryRowForCanonicalRepair, l as collectProjectedReferencedSessionIds, m as planSessionStateDeleteIfUnreferenced, p as planSessionStateAfterEntryRemoval, u as deleteMaterializedSessionStatePlans, v as readSessionGenerationIdsForKeys, y as shouldRemoveSessionEntry } from "./session-accessor.sqlite-canonical-repair-BLguUqtM.js";
import { A as shouldRunModelRunPrune, E as pruneStaleModelRunEntries, S as capEntryCount, T as pruneStaleEntries, f as resolveAgentHarnessSessionStoreError, j as shouldRunSessionEntryMaintenance, k as shouldPreserveMaintenanceEntry, p as resolveAgentHarnessSessionStoreTransitionError, rt as projectSessionStoreForPersistence, x as resolveMaintenanceConfig } from "./agent-harness-session-key-BpWapmwX.js";
import { C as collectSessionMaintenancePreserveKeysForStore, S as collectSessionMaintenancePreserveKeys, g as resolveFreshSessionTotalTokens, l as sameRestartRecoveryTerminalRunIds, m as mergeSessionEntryPreserveActivity, o as mergeRestartRecoveryTerminalRunIds, p as mergeSessionEntry, u as normalizeSessionEntrySlotKey } from "./restart-recovery-state-YPGO30LK.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
import { r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-BZJL8ACd.js";
import { t as serializeJsonlLines } from "./transcript-jsonl-QKucbXZu.js";
import crypto, { randomUUID } from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { sql } from "kysely";
import { Buffer as Buffer$1 } from "node:buffer";
//#region src/config/sessions/internal-session-key.ts
const INTERNAL_SESSION_EFFECTS_SEGMENT = "internal-session-effects";
function normalizeInternalRunId(runId) {
	return `${runId.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 48) || "run"}-${crypto.createHash("sha256").update(runId).digest("hex").slice(0, 16)}`;
}
/** Resolves the hidden SQLite session identity owned by one internal-effects run. */
function resolveInternalSessionEffectsIdentity(params) {
	const suffix = normalizeInternalRunId(params.runId);
	const keySuffix = params.incognito ? `incognito-${suffix}` : suffix.startsWith("incognito-") ? `legacy-${suffix}` : suffix;
	return {
		sessionId: `${INTERNAL_SESSION_EFFECTS_SEGMENT}-${suffix}`,
		sessionKey: `agent:${normalizeAgentId(params.agentId)}:${INTERNAL_SESSION_EFFECTS_SEGMENT}:${keySuffix}`
	};
}
/** Returns true for SQLite entries that exist only to contain suppressed run effects. */
function isInternalSessionEffectsKey(sessionKey) {
	const parts = sessionKey.split(":");
	return parts.length >= 4 && parts[0] === "agent" && parts[2] === INTERNAL_SESSION_EFFECTS_SEGMENT;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history.ts
function listTranscriptInstancesFromDatabase(params) {
	const db = getNodeSqliteKysely(params.database.db);
	return executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select([
		"session_id",
		"session_key",
		"transcript_updated_at",
		"session_entry_provenance",
		"acp_owned",
		"plugin_owner_id",
		"hook_external_content_source",
		"parent_session_key",
		"spawned_by",
		"chat_type"
	]).where("transcript_updated_at", "is not", null).orderBy("transcript_updated_at", "desc").orderBy("session_id", "asc")).rows.map((row) => {
		if (isInternalSessionEffectsKey(row.session_key) || row.transcript_updated_at === null) return;
		const updatedAtMs = row.transcript_updated_at;
		const current = params.currentEntries.get(row.session_key);
		const currentIsExact = current?.sessionId === row.session_id;
		const provenanceKnown = row.session_entry_provenance === 1;
		const hookExternalContentSource = row.hook_external_content_source === "gmail" || row.hook_external_content_source === "webhook" ? row.hook_external_content_source : void 0;
		const chatType = row.chat_type === "direct" || row.chat_type === "group" || row.chat_type === "channel" ? row.chat_type : void 0;
		const entry = {
			...currentIsExact && current ? structuredClone(current) : {},
			sessionId: row.session_id,
			updatedAt: updatedAtMs,
			...row.parent_session_key ? { parentSessionKey: row.parent_session_key } : {},
			...row.spawned_by ? {
				spawnedBy: row.spawned_by,
				spawnDepth: 1
			} : {},
			...chatType ? { chatType } : {},
			...provenanceKnown && row.plugin_owner_id ? { pluginOwnerId: row.plugin_owner_id } : {},
			...provenanceKnown && hookExternalContentSource ? { hookExternalContentSource } : {}
		};
		return {
			acpOwned: row.acp_owned === 1 || Boolean(currentIsExact && current?.acp),
			entry,
			provenanceKnown,
			sessionId: row.session_id,
			sessionKey: row.session_key,
			updatedAtMs
		};
	}).filter((entry) => entry !== void 0);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance.ts
function collectSqliteSessionMaintenanceBaseKeys(store, activeSessionKey) {
	const keys = [];
	const seen = /* @__PURE__ */ new Set();
	let currentKey = normalizeStoreSessionKey(activeSessionKey);
	while (currentKey && !seen.has(currentKey)) {
		seen.add(currentKey);
		keys.push(currentKey);
		currentKey = normalizeStoreSessionKey(store[currentKey]?.parentSessionKey ?? "");
	}
	return keys;
}
function hasStaleSqliteSessionEntryCandidate(database, pruneAfterMs, preserveKeys) {
	const cutoffMs = Date.now() - pruneAfterMs;
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["entry_json", "session_key"]).where("updated_at", "<", cutoffMs).where("archived_at", "is", null).orderBy("updated_at", "asc")).rows.some((row) => {
		const entry = parseSessionEntryJson(row);
		if (!entry) return false;
		return !shouldPreserveMaintenanceEntry({
			key: normalizeStoreSessionKey(row.session_key),
			entry,
			preserveKeys
		});
	});
}
function loadSqliteSessionMaintenanceStore(database) {
	const db = getSessionKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["session_key", "entry_json"]).orderBy("session_key")).rows;
	const store = {};
	for (const row of rows) {
		const entry = parseSessionEntryJson(row);
		if (entry) store[row.session_key] = entry;
	}
	return store;
}
function applySessionEntryMaintenance(database, params) {
	if (params.skipMaintenance) return {
		entryRemovals: [],
		stateDeletePlans: []
	};
	const maintenance = params.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return {
		entryRemovals: [],
		stateDeletePlans: []
	};
	const entryCount = readSessionEntryCount(database);
	const preserveCandidateKeys = collectSessionMaintenancePreserveKeys([params.activeSessionKey]);
	const hasStaleCandidate = hasStaleSqliteSessionEntryCandidate(database, maintenance.pruneAfterMs, preserveCandidateKeys);
	if (!(params.forceMaintenance === true || entryCount > maintenance.maxEntries || hasStaleCandidate || shouldRunModelRunPrune({
		maintenance,
		entryCount,
		force: params.forceMaintenance
	}) || shouldRunSessionEntryMaintenance({
		entryCount,
		maxEntries: maintenance.maxEntries,
		force: params.forceMaintenance
	}))) return {
		entryRemovals: [],
		stateDeletePlans: []
	};
	const store = loadSqliteSessionMaintenanceStore(database);
	const preserveKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.storePath,
		store,
		baseKeys: collectSqliteSessionMaintenanceBaseKeys(store, params.activeSessionKey)
	}) ?? /* @__PURE__ */ new Set();
	const removedKeys = /* @__PURE__ */ new Set();
	const removedEntriesByKey = /* @__PURE__ */ new Map();
	const removedSessionIds = /* @__PURE__ */ new Set();
	const rememberRemovedEntry = (removed) => {
		removedKeys.add(removed.key);
		removedEntriesByKey.set(removed.key, cloneSessionEntry(removed.entry));
		for (const sessionId of collectSessionStateIdsForEntry(removed.entry)) removedSessionIds.add(sessionId);
	};
	let remainingEntryCount = entryCount;
	if (shouldRunModelRunPrune({
		maintenance,
		entryCount: remainingEntryCount,
		force: params.forceMaintenance
	})) remainingEntryCount -= pruneStaleModelRunEntries(store, maintenance.modelRunPruneAfterMs, {
		log: false,
		onPruned: rememberRemovedEntry,
		preserveKeys
	});
	if (params.forceMaintenance === true || hasStaleCandidate || remainingEntryCount > maintenance.maxEntries) remainingEntryCount -= pruneStaleEntries(store, maintenance.pruneAfterMs, {
		log: false,
		onPruned: rememberRemovedEntry,
		preserveKeys
	});
	if (shouldRunSessionEntryMaintenance({
		entryCount: remainingEntryCount,
		maxEntries: maintenance.maxEntries,
		force: params.forceMaintenance
	})) capEntryCount(store, maintenance.maxEntries, {
		log: false,
		onCapped: rememberRemovedEntry,
		preserveKeys
	});
	for (const sessionId of readSessionGenerationIdsForKeys(database, removedKeys)) removedSessionIds.add(sessionId);
	const referencedSessionIds = collectProjectedReferencedSessionIds({
		database,
		excludedSessionKeys: removedKeys,
		projectedStore: store
	});
	const deletePlans = [];
	for (const sessionId of removedSessionIds) {
		const plan = planSessionStateDeleteIfUnreferenced({
			archiveTranscript: true,
			archiveDirectory: params.archiveDirectory,
			database,
			referencedSessionIds,
			sessionId
		});
		if (plan) deletePlans.push(plan);
	}
	return {
		entryRemovals: [...removedKeys].map((sessionKey) => ({
			expectedEntry: removedEntriesByKey.get(sessionKey),
			sessionKey
		})),
		stateDeletePlans: deletePlans
	};
}
async function finalizeSessionEntryMaintenancePlansBestEffort(scope, plans) {
	return await finalizeSqliteSessionEntryMaintenancePlansWithCommit(scope, plans, async (commit) => commit());
}
/** Finalizes maintenance after its caller releases the per-store writer lane. */
async function finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(scope, plans) {
	return await finalizeSqliteSessionEntryMaintenancePlansWithCommit(scope, plans, async (commit) => await runExclusiveSqliteSessionWrite(scope, async () => commit()));
}
async function finalizeSqliteSessionEntryMaintenancePlansWithCommit(scope, plans, commit) {
	const entryRemovals = plans.flatMap((plan) => plan.entryRemovals);
	const stateDeletePlans = plans.flatMap((plan) => plan.stateDeletePlans);
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) return [];
	try {
		const materializedPlans = await materializeSessionStateDeletePlans(stateDeletePlans);
		const archivedTranscripts = await commit(() => {
			let committed = [];
			runOpenClawAgentWriteTransaction((database) => {
				assertPlannedLifecycleArtifactEntriesUnchanged(database, entryRemovals);
				committed = deleteMaterializedSessionStatePlans(database, materializedPlans, void 0, new Set(entryRemovals.map((removal) => removal.sessionKey)));
				deletePlannedLifecycleArtifactEntries(database, entryRemovals);
			}, toDatabaseOptions(scope));
			return committed;
		});
		emitCommittedSessionEntryRemovals(entryRemovals);
		return archivedTranscripts;
	} catch (error) {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session maintenance cleanup failed", {
			agentId: scope.agentId,
			error,
			path: scope.path,
			sessionIds: uniqueStrings(stateDeletePlans.map((plan) => plan.sessionId))
		});
		return [];
	}
}
//#endregion
//#region src/config/sessions/session-entry-lineage.ts
/** True when this entry's transcript began as a copy of a parent (actual forkSource ancestry or the legacy/thread-settled marker). */
function sessionEntryForkedFromParent(entry) {
	return entry?.forkSource !== void 0 || entry?.forkedFromParent === true;
}
function preserveSqliteSameKeySessionRolloverLineage(params) {
	const previousSessionId = params.previous.sessionId.trim();
	const nextSessionId = params.next.sessionId.trim();
	if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) return params.next;
	return {
		...params.next,
		previousSessionId,
		usageFamilyKey: params.next.usageFamilyKey ?? params.previous.usageFamilyKey ?? params.sessionKey,
		usageFamilySessionIds: uniqueStrings([
			...params.previous.usageFamilySessionIds ?? [],
			previousSessionId,
			...params.next.usageFamilySessionIds ?? [],
			nextSessionId
		])
	};
}
//#endregion
//#region src/config/sessions/session-entry-provenance.ts
function buildSessionCreationStamp(params) {
	return {
		createdVia: params.via,
		...params.actor ? { createdActor: params.actor } : {},
		createdAt: params.now ?? Date.now()
	};
}
//#endregion
//#region src/config/sessions/session-store-path.ts
function resolveSessionStorePathForScope(scope) {
	if (isIncognitoSessionKey(scope.sessionKey)) return resolveIncognitoOpenClawAgentSqlitePath({
		agentId: resolveAgentIdFromSessionKey(scope.sessionKey),
		env: scope.env
	});
	if (scope.storePath) return scope.storePath;
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	return resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
}
//#endregion
//#region src/config/sessions/transcript-write-context.ts
const ownedTranscriptWriteContext = new AsyncLocalStorage();
function normalizeConcretePathForCompare(value) {
	const trimmed = value?.trim();
	if (!trimmed || !path.isAbsolute(trimmed) || !trimmed.endsWith(".jsonl")) return;
	return path.resolve(trimmed);
}
function contextMatches(params) {
	const normalizeTarget = (target) => {
		const agentId = target?.agentId?.trim();
		const sessionId = target?.sessionId?.trim();
		const sessionKey = target?.sessionKey?.trim();
		const storePath = target?.storePath?.trim();
		return sessionKey && storePath ? {
			agentId,
			sessionId,
			sessionKey,
			storePath: path.resolve(storePath)
		} : void 0;
	};
	const contextTarget = normalizeTarget(params.context.sessionTarget);
	const requestedTarget = normalizeTarget(params.sessionTarget);
	if (params.context.sessionTarget || params.sessionTarget) return Boolean(contextTarget && requestedTarget && contextTarget.sessionKey === requestedTarget.sessionKey && contextTarget.storePath === requestedTarget.storePath && (!contextTarget.agentId || !requestedTarget.agentId || contextTarget.agentId === requestedTarget.agentId) && (!contextTarget.sessionId || !requestedTarget.sessionId || contextTarget.sessionId === requestedTarget.sessionId));
	const contextSessionFile = normalizeConcretePathForCompare(params.context.sessionFile);
	const sessionFile = normalizeConcretePathForCompare(params.sessionFile);
	if (contextSessionFile && sessionFile) return contextSessionFile === sessionFile;
	const contextSessionKey = params.context.sessionKey?.trim();
	const sessionKey = params.sessionKey?.trim();
	return Boolean(contextSessionKey && sessionKey && contextSessionKey === sessionKey);
}
/** Runs transcript writes with the admitted run's teardown and writer-fence context. */
async function withOwnedSessionTranscriptWrites(context, run) {
	return await ownedTranscriptWriteContext.run(context, run);
}
/** Runs detached work without retaining an attempt-owned transcript context. */
function runWithoutOwnedSessionTranscriptWrites(run) {
	return ownedTranscriptWriteContext.exit(run);
}
function bindOwnedSessionTranscriptWrites(context, run) {
	return (...args) => ownedTranscriptWriteContext.run(context, () => run(...args));
}
/** Returns the matching admitted-run fence for a durable write boundary. */
function getOwnedSessionTranscriptWriterFence(params = {}) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || Object.keys(params).length > 0 && !contextMatches({
		context,
		...params
	})) return;
	const target = context.sessionTarget;
	const expectedWriterRunId = target?.expectedWriterRunId?.trim();
	if (!expectedWriterRunId) return;
	const expectedLifecycleRevision = target?.expectedLifecycleRevision;
	return {
		...expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision } : {},
		expectedWriterRunId
	};
}
/** Applies the admitted-run fence inherited by a matching synchronous writer. */
function withOwnedSessionTranscriptWriterFence(scope) {
	const fence = getOwnedSessionTranscriptWriterFence({
		sessionKey: scope.sessionKey,
		sessionTarget: scope
	});
	return fence ? {
		...scope,
		...fence
	} : scope;
}
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(sessionKey) {
		super(`session writer claim changed before transcript persistence: ${sessionKey ?? "unknown"}`);
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
async function runWithOwnedSessionTranscriptWrite(params, run) {
	const context = ownedTranscriptWriteContext.getStore();
	if (!context || !contextMatches({
		context,
		...params
	})) return await run();
	return await context.withTranscriptWrite(run);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry.ts
const childSessionKeysByEntrySnapshot = /* @__PURE__ */ new WeakMap();
function assertCanonicalSessionWriteScope(scope) {
	assertCanonicalSessionKeyWrite(scope.sessionKey, scope.agentId);
}
function getChildSessionKeysByParent(entries) {
	const cached = childSessionKeysByEntrySnapshot.get(entries);
	if (cached) return cached;
	const childKeysByParent = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of entries) for (const rawParentKey of [entry.spawnedBy, entry.parentSessionKey]) {
		const parentKey = rawParentKey?.trim();
		if (!parentKey || parentKey === sessionKey) continue;
		const childKeys = childKeysByParent.get(parentKey) ?? /* @__PURE__ */ new Set();
		childKeys.add(sessionKey);
		childKeysByParent.set(parentKey, childKeys);
	}
	const indexedChildKeys = new Map([...childKeysByParent].map(([parentKey, childKeys]) => [parentKey, [...childKeys]]));
	childSessionKeysByEntrySnapshot.set(entries, indexedChildKeys);
	return indexedChildKeys;
}
/** Resolves one canonical entry and its proven aliases without materializing the store. */
function resolveSessionEntry(scope, options = {}) {
	const resolved = resolveSqliteScope(scope);
	const read = (database) => {
		const selected = readSessionEntryRow(database, resolved.sessionKey);
		const existing = selected?.entry;
		return {
			existing: existing ? scope.clone === false ? existing : cloneSessionEntry(existing) : void 0,
			legacyKeys: selected?.legacyKeys ?? [],
			normalizedKey: resolved.sessionKey
		};
	};
	if (options.readOnly) {
		const result = withOpenClawAgentDatabaseReadOnly(read, toDatabaseOptions(resolved));
		return result.found ? result.value : {
			existing: void 0,
			legacyKeys: [],
			normalizedKey: resolved.sessionKey
		};
	}
	return read(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
}
/** Loads one session entry from the additive SQLite session store. */
function loadSessionEntry(scope) {
	return resolveSessionEntry(scope).existing;
}
/** Loads one session entry without opening its agent database writable. */
function loadSessionEntryReadOnly(scope) {
	return resolveSessionEntry(scope, { readOnly: true }).existing;
}
/** Loads one exact persisted-key entry from the additive SQLite session store. */
function loadExactSessionEntry(scope) {
	const sessionKey = scope.sessionKey.trim();
	if (!sessionKey) return;
	const entry = readExactSessionEntryRowValidated(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteScope(scope))), sessionKey)?.entry;
	return entry ? {
		sessionKey,
		entry: scope.clone === false ? entry : cloneSessionEntry(entry)
	} : void 0;
}
/** Lists persisted session keys from the data-version-validated entry snapshot. */
function listSessionEntryKeysReadOnly(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		return [...readSessionEntrySnapshot(database, resolved, scope.readConsistency).keys];
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Exact persisted-key probe on the read-only handle, for per-row hot paths. */
function loadExactSessionEntryReadOnly(scope) {
	const sessionKey = scope.sessionKey.trim();
	if (!sessionKey) return;
	const result = withOpenClawAgentDatabaseReadOnly((database) => readExactSessionEntryRowValidated(database, sessionKey)?.entry, toDatabaseOptions(resolveSqliteScope(scope)));
	return result.found && result.value ? {
		sessionKey,
		entry: scope.clone === false ? result.value : cloneSessionEntry(result.value)
	} : void 0;
}
/** Lists direct child rows without cloning or rebuilding the complete session store. */
function listSessionChildEntriesReadOnly(scope) {
	const resolved = resolveSqliteScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const snapshot = readSessionEntrySnapshot(database, resolved, scope.readConsistency);
		return (getChildSessionKeysByParent(snapshot.entries).get(resolved.sessionKey) ?? []).flatMap((sessionKey) => {
			if (isInternalSessionEffectsKey(sessionKey)) return [];
			const entry = snapshot.entries.get(sessionKey);
			return entry ? [{
				sessionKey,
				entry: scope.clone === false ? entry : cloneSessionEntry(entry)
			}] : [];
		});
	}, toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Resolves the persisted session key for a SQLite transcript session id. */
function resolveSessionKeyBySessionId(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", resolved.sessionId).limit(1));
	}, toDatabaseOptions(resolved));
	return result.found ? result.value?.session_key : void 0;
}
/** Lists session entries from the additive SQLite session store. */
function listSessionEntryRows(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	return listSqliteSessionEntriesFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved, scope);
}
/**
* Lists session entries without opening the agent database writable.
* Transient lock errors propagate: only the caller knows whether "empty" is an
* acceptable degradation (health snapshots) or hides real state (migration detection).
*/
function listSessionEntriesReadOnly(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const result = withOpenClawAgentDatabaseReadOnly((database) => listSqliteSessionEntriesFromDatabase(database, resolved, scope), toDatabaseOptions(resolved));
	return result.found ? result.value : [];
}
/** Counts durable session rows without materializing entry JSON or warming the entry cache. */
function countSessionEntryRowsReadOnly(scope = {}) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select((expression) => expression.fn.countAll().as("count")));
		return row ? coerceSqliteNumber(row.count) : 0;
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : 0;
}
/**
* Proves whether a durable store has a row in one of the requested lifecycle states.
* Unknown existing schemas stay eligible so the writable owner can surface or repair them.
*/
function hasSessionEntriesByStatusReadOnly(scope, statuses) {
	const selectedStatuses = [...new Set(statuses)];
	if (selectedStatuses.length === 0) return false;
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return Boolean(executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select("session_key").where("status", "in", selectedStatuses).limit(1)));
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
	return result.found ? result.value : result.reason !== "database-missing";
}
function listSqliteSessionEntriesFromDatabase(database, resolved, scope) {
	assertCanonicalSqliteSessionKeysCurrent(database);
	const snapshot = readSessionEntrySnapshot(database, resolved, scope.readConsistency);
	const entries = scope.projection === "list" ? snapshot.listEntries : snapshot.entries;
	return snapshot.keys.flatMap((sessionKey) => {
		if (isInternalSessionEffectsKey(sessionKey)) return [];
		const entry = entries.get(sessionKey);
		if (!entry) return [];
		const deliveryCanonicalKey = resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry);
		if (deliveryCanonicalKey !== sessionKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${deliveryCanonicalKey}`);
		return [{
			sessionKey,
			entry: scope.clone === false ? entry : cloneSessionEntry(entry)
		}];
	});
}
function readSessionEntrySnapshot(database, resolved, readConsistency) {
	return readSessionEntryCache(database, {
		cache: !isIncognitoOpenClawAgentSqlitePath(database.path, {
			agentId: database.agentId,
			env: resolved.env
		}),
		latest: readConsistency === "latest"
	});
}
/** Lists only entries whose normalized session row has one of the requested statuses. */
function listSessionEntriesByStatus(scope, statuses) {
	return readSessionEntriesByStatus(openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	}))), statuses).filter(({ sessionKey }) => !isInternalSessionEffectsKey(sessionKey));
}
/** Lists transcript-bearing SQLite sessions, including retained rows from session-id rotation. */
function listSessionTranscriptInstances(scope = {}) {
	const resolved = resolveSqliteScope({
		...scope,
		sessionKey: ""
	});
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const currentEntries = new Map(listSessionEntryRows(scope).map((summary) => [summary.sessionKey, summary.entry]));
	return listTranscriptInstancesFromDatabase({
		agentId: resolved.agentId,
		currentEntries,
		database,
		databasePath: resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolved))
	});
}
/** Reads a session activity timestamp from the additive SQLite session store. */
function readSessionUpdatedAtCore(scope) {
	const resolved = resolveSqliteScope(scope);
	const row = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionKey)?.row;
	return row ? coerceSqliteNumber(row.updated_at) : void 0;
}
/** Applies a partial entry update to the additive SQLite session store. */
async function upsertSessionEntryCore(scope, patch) {
	return await patchSessionEntryCore(scope, () => patch, { fallbackEntry: createFallbackSessionEntry(patch) });
}
/** Replaces one entry in the additive SQLite session store. */
async function replaceSessionEntry(scope, entry) {
	return await patchSessionEntryCore(scope, () => entry, {
		fallbackEntry: entry,
		replaceEntry: true
	});
}
/** Replaces one entry synchronously for sync session runtimes. */
function replaceSessionEntrySync(scope, entry) {
	const resolved = resolveSqliteScope(scope);
	assertCanonicalSessionWriteScope(resolved);
	let previous = /* @__PURE__ */ new Map();
	let current = /* @__PURE__ */ new Map();
	runOpenClawAgentWriteTransaction((database) => {
		const identityKeys = collectSessionEntryLookupKeys(database, resolved.sessionKey);
		previous = readSessionIdentitySnapshot(database, identityKeys);
		writeSessionEntry(database, resolved.sessionKey, entry);
		current = readSessionIdentitySnapshot(database, identityKeys);
	}, toDatabaseOptions(resolved));
	emitCommittedSessionIdentityDiff(previous, current);
}
/** Creates a missing session identity without replacing a concurrently owned row. */
function ensureSessionEntrySync(scope, entry) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteScope(fencedScope);
	assertCanonicalSessionWriteScope(resolved);
	let owned = false;
	let previous = /* @__PURE__ */ new Map();
	let current = /* @__PURE__ */ new Map();
	runOpenClawAgentWriteTransaction((database) => {
		const identityKeys = collectSessionEntryLookupKeys(database, resolved.sessionKey);
		previous = readSessionIdentitySnapshot(database, identityKeys);
		const existing = readSessionEntryRow(database, resolved.sessionKey)?.entry;
		if (existing) {
			owned = existing.sessionId === entry.sessionId;
			current = previous;
			return;
		}
		if (fencedScope.expectedWriterRunId !== void 0) {
			current = previous;
			return;
		}
		writeSessionEntry(database, resolved.sessionKey, entry);
		current = readSessionIdentitySnapshot(database, identityKeys);
		owned = current.get(resolved.sessionKey)?.sessionId === entry.sessionId;
	}, toDatabaseOptions(resolved));
	if (current.size !== previous.size || owned) emitCommittedSessionIdentityDiff(previous, current);
	if (fencedScope.expectedWriterRunId !== void 0 && !owned) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return owned;
}
/** Patches one entry in the additive SQLite session store. */
async function patchSessionEntryCore(scope, update, options = {}) {
	const resolved = resolveSqliteScope(scope);
	assertCanonicalSessionWriteScope(resolved);
	return await patchSqliteSessionEntrySnapshot({
		assertSnapshotUnchanged: (prepared, fresh) => assertSessionEntrySelectionUnchanged(prepared, fresh, "session-entry.patch"),
		existingEntry: (snapshot) => snapshot.selected?.entry,
		legacyKeys: (snapshot) => snapshot.selected?.legacyKeys ?? [],
		options,
		readSnapshot: (database) => readSessionEntrySelectionSnapshot(database, resolved.sessionKey, options.replaceEntry === true),
		resolved,
		sessionKey: resolved.sessionKey,
		snapshotRows: (snapshot) => snapshot.selectedRows,
		storePath: resolveSessionStorePathForScope(scope),
		update
	});
}
/** Patches one logical entry selected from a canonical key and alias set. */
async function patchSessionEntryTarget(scope, update, options = {}) {
	return await patchSqliteSessionEntrySnapshot({
		assertSnapshotUnchanged: (prepared, fresh) => assertLifecycleTargetSnapshotUnchanged(prepared, fresh, "session-entry-target.patch"),
		existingEntry: (snapshot) => snapshot.primary?.entry,
		legacyKeys: () => scope.target.storeKeys,
		options,
		readSnapshot: (database) => readLifecycleTargetSnapshot(database, scope.target),
		rehomeWindows: true,
		resolved: resolveSqliteStoreScope(scope.storePath, { agentId: scope.agentId }),
		sessionKey: scope.target.canonicalKey,
		snapshotRows: (snapshot) => snapshot.rows,
		storePath: resolveSessionStorePathForScope({
			agentId: scope.agentId,
			sessionKey: scope.target.canonicalKey,
			storePath: scope.storePath
		}),
		update
	});
}
/** All entry patches prepare asynchronously, then revalidate and publish on one commit edge. */
async function patchSqliteSessionEntrySnapshot(params) {
	const { options, resolved, sessionKey } = params;
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const prepared = params.readSnapshot(database);
		const existing = params.existingEntry(prepared);
		const writeBase = existing ?? options.fallbackEntry;
		if (!writeBase) return {
			maintenancePlans: [],
			result: null
		};
		const patch = await params.update(cloneSessionEntry(writeBase), { existingEntry: existing ? cloneSessionEntry(existing) : void 0 });
		const maintenancePlans = [];
		let result = null;
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runOpenClawAgentWriteTransaction((writeDatabase) => {
			const fresh = params.readSnapshot(writeDatabase);
			params.assertSnapshotUnchanged(prepared, fresh);
			options.assertCommitAllowed?.();
			if (!patch) {
				result = cloneSessionEntry(writeBase);
				return;
			}
			const snapshotRows = params.snapshotRows(fresh);
			const legacyKeys = params.legacyKeys(fresh);
			const identityKeys = [
				sessionKey,
				...legacyKeys,
				...snapshotRows.map((row) => row.sessionKey)
			];
			previousIdentity = createSessionIdentitySnapshot(snapshotRows);
			const merged = options.replaceEntry ? cloneSessionEntry(patch) : options.preserveActivity ? mergeSessionEntryPreserveActivity(writeBase, patch) : mergeSessionEntry(writeBase, patch);
			const next = options.replaceEntry ? merged : preserveSqliteSameKeySessionRolloverLineage({
				next: merged,
				previous: writeBase,
				sessionKey
			});
			const selectedPreviousEntry = params.existingEntry(fresh) ?? writeBase;
			writeSessionEntry(writeDatabase, sessionKey, next, { previousEntry: selectedPreviousEntry });
			if (params.rehomeWindows) rehomeSessionWindows(writeDatabase, sessionKey, legacyKeys);
			deleteLegacySessionEntryRows(writeDatabase, legacyKeys, sessionKey, { rehomeMembers: selectedPreviousEntry.sessionId === next.sessionId });
			maintenancePlans.push(applySessionEntryMaintenance(writeDatabase, {
				activeSessionKey: sessionKey,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				maintenanceConfig: options.maintenanceConfig,
				skipMaintenance: options.skipMaintenance,
				storePath: params.storePath
			}));
			currentIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
			result = cloneSessionEntry(next);
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return {
			maintenancePlans,
			result
		};
	});
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	kickSessionHistoryDiskBudgetMaintenance({
		...resolved.agentId ? { agentId: resolved.agentId } : {},
		storePath: params.storePath,
		...options.maintenanceConfig ? { maintenanceConfig: options.maintenanceConfig } : {}
	});
	return committed.result;
}
/** Forks one parent SQLite transcript into a new child transcript. */
async function recordInboundSessionMeta(params) {
	const createIfMissing = params.createIfMissing ?? true;
	return await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => {
		const metadataPatch = deriveSessionMetaPatch({
			ctx: params.ctx,
			sessionKey: params.sessionKey,
			existing: context.existingEntry,
			groupResolution: params.groupResolution
		});
		if (context.existingEntry) return metadataPatch;
		const senderId = params.ctx.SenderId?.trim();
		return {
			...buildSessionCreationStamp(params.ctx.SessionCreation ?? {
				via: "channel",
				...senderId ? { actor: {
					type: "human",
					id: senderId
				} } : {}
			}),
			...metadataPatch
		};
	}, {
		preserveActivity: true,
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	});
}
/** Updates last-route/delivery metadata without refreshing activity timestamps. */
async function updateSessionLastRoute(params) {
	const createIfMissing = params.createIfMissing ?? true;
	return await patchSessionEntryCore({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, (_entry, context) => {
		const routePatch = deriveLastRoutePatch({
			channel: params.channel,
			to: params.to,
			accountId: params.accountId,
			threadId: params.threadId,
			route: params.route,
			deliveryContext: params.deliveryContext,
			ctx: params.ctx,
			groupResolution: params.groupResolution,
			existing: context.existingEntry,
			sessionKey: params.sessionKey
		});
		if (context.existingEntry) return routePatch;
		const senderId = params.ctx?.SenderId?.trim();
		return {
			...buildSessionCreationStamp(params.ctx?.SessionCreation ?? {
				via: "channel",
				...senderId ? { actor: {
					type: "human",
					id: senderId
				} } : {}
			}),
			...routePatch
		};
	}, {
		preserveActivity: true,
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	});
}
/** Writes the forked child's transcript rows (copied branch or header-only). */
//#endregion
//#region src/config/sessions/plugin-host-cleanup.ts
/** Shared predicates and mutations for plugin host-owned session-state cleanup. */
function collectStoredSessionEntrySlotKeys(entry, pluginId) {
	const slotKeys = /* @__PURE__ */ new Set();
	const storedSlotKeys = entry.pluginExtensionSlotKeys;
	if (!storedSlotKeys) return slotKeys;
	const records = pluginId === void 0 ? Object.values(storedSlotKeys) : storedSlotKeys[pluginId] ? [storedSlotKeys[pluginId]] : [];
	for (const record of records) for (const slotKey of Object.values(record)) {
		const normalized = normalizeSessionEntrySlotKey(slotKey);
		if (normalized.ok) slotKeys.add(normalized.key);
	}
	return slotKeys;
}
function collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectStoredSessionEntrySlotKeys(entry, pluginId);
	for (const slotKey of sessionEntrySlotKeys ?? []) slotKeys.add(slotKey);
	return slotKeys;
}
function clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys, options = {}) {
	const slotKeys = options.includeStoredSlotKeys === false && sessionEntrySlotKeys ? new Set(sessionEntrySlotKeys) : collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	const entryRecord = entry;
	for (const slotKey of slotKeys) delete entryRecord[slotKey];
	if (!options.pruneSlotOwnership || !entry.pluginExtensionSlotKeys) return;
	const pruneRecord = (record) => {
		for (const [namespace, slotKey] of Object.entries(record)) {
			const normalized = normalizeSessionEntrySlotKey(slotKey);
			if (normalized.ok && slotKeys.has(normalized.key)) delete record[namespace];
		}
	};
	if (pluginId) {
		const record = entry.pluginExtensionSlotKeys[pluginId];
		if (record) {
			pruneRecord(record);
			if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[pluginId];
		}
	} else {
		for (const record of Object.values(entry.pluginExtensionSlotKeys)) pruneRecord(record);
		for (const [ownerPluginId, record] of Object.entries(entry.pluginExtensionSlotKeys)) if (Object.keys(record).length === 0) delete entry.pluginExtensionSlotKeys[ownerPluginId];
	}
	if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
}
/** Clears plugin-owned extension state from one session entry. */
function clearPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	clearPromotedSessionEntrySlots(entry, pluginId, sessionEntrySlotKeys);
	if (!pluginId) {
		delete entry.pluginExtensions;
		delete entry.pluginExtensionSlotKeys;
		delete entry.pluginNextTurnInjections;
		return;
	}
	if (entry.pluginExtensions) {
		delete entry.pluginExtensions[pluginId];
		if (Object.keys(entry.pluginExtensions).length === 0) delete entry.pluginExtensions;
	}
	if (entry.pluginExtensionSlotKeys) {
		delete entry.pluginExtensionSlotKeys[pluginId];
		if (Object.keys(entry.pluginExtensionSlotKeys).length === 0) delete entry.pluginExtensionSlotKeys;
	}
	if (entry.pluginNextTurnInjections) {
		delete entry.pluginNextTurnInjections[pluginId];
		if (Object.keys(entry.pluginNextTurnInjections).length === 0) delete entry.pluginNextTurnInjections;
	}
}
function hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys) {
	const slotKeys = collectPromotedSessionEntrySlotKeys(entry, pluginId, sessionEntrySlotKeys);
	if (slotKeys.size === 0) return false;
	const entryRecord = entry;
	for (const slotKey of slotKeys) if (Object.hasOwn(entryRecord, slotKey)) return true;
	return false;
}
function hasPluginOwnedSessionState(entry, pluginId, sessionEntrySlotKeys) {
	if (hasPromotedSessionEntrySlot(entry, pluginId, sessionEntrySlotKeys)) return true;
	if (!pluginId) return Boolean(entry.pluginExtensions || entry.pluginExtensionSlotKeys || entry.pluginNextTurnInjections);
	return Boolean(entry.pluginExtensions?.[pluginId] || entry.pluginExtensionSlotKeys?.[pluginId] || entry.pluginNextTurnInjections?.[pluginId]);
}
function matchesPluginHostCleanupSession(entryKey, entry, sessionKey) {
	const normalizedSessionKey = normalizeLowercaseStringOrEmpty(sessionKey);
	if (!normalizedSessionKey) return true;
	return normalizeLowercaseStringOrEmpty(entryKey) === normalizedSessionKey || normalizeLowercaseStringOrEmpty(entry.sessionId) === normalizedSessionKey;
}
function shouldSkipPluginHostCleanupStore(params) {
	if (!params.pluginId && !params.sessionKey) return true;
	return params.mode === "promoted-slots" && (params.sessionEntrySlotKeys?.size ?? 0) === 0;
}
function hasPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") return hasPromotedSessionEntrySlot(entry, params.pluginId, params.sessionEntrySlotKeys);
	return hasPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
function isLockedHarnessSessionOwnedByPlugin(entry, preserveLockedHarnessIds) {
	if (entry.modelSelectionLocked !== true || !preserveLockedHarnessIds?.size) return false;
	const harnessId = normalizeOptionalAgentRuntimeId(entry.agentHarnessId);
	return harnessId !== void 0 && preserveLockedHarnessIds.has(harnessId);
}
function clearPluginHostCleanupTarget(entry, params) {
	if (params.mode === "promoted-slots") {
		clearPromotedSessionEntrySlots(entry, params.pluginId, params.sessionEntrySlotKeys, {
			includeStoredSlotKeys: false,
			pruneSlotOwnership: true
		});
		return;
	}
	clearPluginOwnedSessionState(entry, params.pluginId, params.sessionEntrySlotKeys);
}
//#endregion
//#region src/config/sessions/session-accessor.entry.ts
/** Resolves a session directly through canonical SQLite row and alias ownership. */
function resolveSessionEntrySelection(scope, options = {}) {
	return resolveSessionEntry(scope, options);
}
function resolveAccessStorePath(scope) {
	return resolveSessionStorePathForScope(scope);
}
function isStorePathTemplate(store) {
	return typeof store === "string" && store.includes("{agentId}");
}
function resolveLogicalSessionStoreCandidates(params) {
	const storeConfig = params.cfg.session?.store;
	const defaultTarget = {
		agentId: params.agentId,
		storePath: resolveSessionStorePathCore(storeConfig, {
			agentId: params.agentId,
			env: params.env
		})
	};
	if (!isStorePathTemplate(storeConfig)) return [defaultTarget];
	const targets = /* @__PURE__ */ new Map();
	targets.set(defaultTarget.storePath, defaultTarget);
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) if (target.agentId === params.agentId) targets.set(target.storePath, target);
	return [...targets.values()];
}
function buildLogicalSessionEntryCandidateKeys(params) {
	const targets = /* @__PURE__ */ new Set();
	if (params.canonicalKey) targets.add(params.canonicalKey);
	if (params.requestedKey && params.requestedKey !== params.canonicalKey) targets.add(params.requestedKey);
	if (params.canonicalKey === "global" || params.canonicalKey === "unknown") return [...targets];
	const agentMainKey = resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (params.canonicalKey === agentMainKey) targets.add(`agent:${params.agentId}:main`);
	return [...targets];
}
function findCanonicalSessionEntryMatch(scope, canonicalKey, candidateKeys, options = {}) {
	let selected;
	for (const candidate of candidateKeys) {
		const trimmed = candidate.trim();
		if (!trimmed) continue;
		const match = (options.readOnly === false ? loadExactSessionEntry : loadExactSessionEntryReadOnly)({
			...scope,
			sessionKey: trimmed
		});
		if (!match) continue;
		if (selected) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match.sessionKey !== canonicalKey) throw canonicalSessionKeyMigrationRequiredError(`non-canonical persisted row resolves to session key ${canonicalKey}`);
		selected = match;
	}
	return selected;
}
/** Resolves one canonical row across the prepared configured and discovered store targets. */
function resolveSessionEntryAccessTarget(scope) {
	const target = resolveSessionEntryStoreTarget(scope);
	return {
		agentId: target.agentId,
		canonicalKey: target.canonicalKey,
		entry: target.entry,
		requestedKey: target.requestedKey,
		storeKey: target.storeKey
	};
}
/** Resolves ordered candidate keys inside one agent-owned session store. */
function resolveSessionEntryCandidateTarget(scope) {
	const candidateKeys = uniqueStrings(scope.candidateKeys.map((key) => key.trim()));
	const incognitoKey = candidateKeys.find(isIncognitoSessionKey);
	const incognitoAgentId = incognitoKey ? resolveAgentIdFromSessionKey(incognitoKey) : void 0;
	const storePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : resolveSessionStorePathCore(scope.cfg.session?.store, {
		agentId: scope.agentId,
		env: scope.env
	});
	const resolvedAgentId = incognitoAgentId ?? scope.agentId;
	for (const candidateKey of candidateKeys) {
		if (!candidateKey) continue;
		const resolved = resolveSessionEntrySelection({
			agentId: resolvedAgentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: candidateKey,
			storePath
		}, { readOnly: !incognitoAgentId });
		if (!resolved.existing) continue;
		return {
			agentId: resolvedAgentId,
			candidateKey,
			entry: structuredClone(resolved.existing),
			persisted: true,
			sessionKey: resolved.normalizedKey
		};
	}
	const fallbackKey = scope.fallback?.sessionKey.trim();
	if (!fallbackKey || !scope.fallback) return null;
	return {
		agentId: resolvedAgentId,
		candidateKey: fallbackKey,
		entry: structuredClone(scope.fallback.entry),
		persisted: false,
		sessionKey: fallbackKey
	};
}
function resolveSessionEntryStoreTarget(scope) {
	const requestedKey = scope.sessionKey.trim();
	const canonicalKey = resolveSessionStoreKey({
		cfg: scope.cfg,
		sessionKey: requestedKey
	});
	const agentId = resolveSessionStoreAgentId(scope.cfg, canonicalKey);
	const scanTargets = buildLogicalSessionEntryCandidateKeys({
		agentId,
		canonicalKey,
		cfg: scope.cfg,
		requestedKey
	});
	if (isIncognitoSessionKey(canonicalKey)) {
		const incognitoAgentId = resolveAgentIdFromSessionKey(canonicalKey);
		const storePath = resolveIncognitoOpenClawAgentSqlitePath({
			agentId: incognitoAgentId,
			env: scope.env
		});
		const selectedMatch = findCanonicalSessionEntryMatch({
			agentId: incognitoAgentId,
			...scope.env ? { env: scope.env } : {},
			storePath
		}, canonicalKey, scanTargets, { readOnly: false });
		return {
			agentId: incognitoAgentId,
			canonicalKey,
			entry: selectedMatch?.entry,
			requestedKey,
			storeKey: selectedMatch?.sessionKey ?? canonicalKey,
			storePath
		};
	}
	const candidates = resolveLogicalSessionStoreCandidates({
		agentId,
		cfg: scope.cfg,
		env: scope.env
	});
	const fallback = candidates[0] ?? {
		agentId,
		storePath: resolveSessionStorePathCore(scope.cfg.session?.store, {
			agentId,
			env: scope.env
		})
	};
	let selectedStorePath = fallback.storePath;
	let selectedMatch = findCanonicalSessionEntryMatch({
		agentId,
		...scope.env ? { env: scope.env } : {},
		storePath: fallback.storePath
	}, canonicalKey, scanTargets);
	for (let index = 1; index < candidates.length; index += 1) {
		const candidate = candidates[index];
		if (!candidate) continue;
		const match = findCanonicalSessionEntryMatch({
			agentId,
			...scope.env ? { env: scope.env } : {},
			storePath: candidate.storePath
		}, canonicalKey, scanTargets);
		if (match && selectedMatch) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${canonicalKey}`);
		if (match) {
			selectedStorePath = candidate.storePath;
			selectedMatch = match;
		}
	}
	return {
		agentId,
		canonicalKey,
		entry: selectedMatch?.entry,
		requestedKey,
		storeKey: selectedMatch?.sessionKey ?? canonicalKey,
		storePath: selectedStorePath
	};
}
/**
* Mutates the canonical logical session entry without exposing the
* backing store map to callers.
*/
async function updateResolvedSessionEntry(scope, update) {
	const target = resolveSessionEntryStoreTarget(scope);
	if (!target.entry) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	let updateResult;
	const updated = await patchSessionEntryCore({
		sessionKey: target.storeKey,
		storePath: target.storePath
	}, async (entry) => {
		updateResult = await update(entry, {
			agentId: target.agentId,
			canonicalKey: target.canonicalKey,
			entry,
			requestedKey: target.requestedKey,
			storeKey: target.storeKey
		});
		return entry;
	}, {
		replaceEntry: true,
		skipMaintenance: true
	});
	if (!updated) return {
		canonicalKey: target.canonicalKey,
		found: false
	};
	return {
		canonicalKey: target.canonicalKey,
		entry: structuredClone(updated),
		found: true,
		result: updateResult,
		storeKey: target.storeKey
	};
}
/** Lists entries from the resolved store, preserving the persisted key for each row. */
function listSessionEntriesCore(scope = {}) {
	if (scope.clone === false) return openSessionEntryReadView(scope).entries();
	return listSessionEntryRows(scope);
}
/**
* Borrowed keyed view over one resolved store for synchronous read-only hot paths.
* Unlike loadSessionEntry, `get` is a raw exact persisted-key probe with no alias
* or canonical-key resolution. The first probe materializes one validated store
* snapshot; later probes and `entries` reuse its parsed rows. Rows are borrowed,
* not cloned: callers must not mutate them and must drop the view before any await.
*/
function openSessionEntryReadView(scope = {}) {
	return {
		get: (sessionKey) => (isIncognitoSessionKey(sessionKey) ? loadExactSessionEntry : loadExactSessionEntryReadOnly)({
			...scope,
			clone: false,
			sessionKey
		})?.entry,
		entries: () => listSessionEntryRows({
			...scope,
			clone: false
		})
	};
}
/**
* Applies an atomic patch and returns the persisted key selected by the backing
* store. Use when a caller must keep sidecar state keyed to the final row.
*/
async function patchSessionEntryWithKey(scope, update, options = {}) {
	const entry = await patchSessionEntryCore(scope, update, options);
	return entry ? {
		sessionKey: normalizeStoreSessionKey(scope.sessionKey),
		entry
	} : null;
}
/**
* Copies one parent transcript into a new child transcript target.
* This is for guarded callers that already own the eventual entry commit.
*/
//#endregion
//#region src/config/sessions/session-accessor.sqlite-entry-availability.ts
/** Exact persisted-key probe that preserves database and row availability. */
function loadExactSessionEntryReadOnlyResult(scope) {
	const sessionKey = scope.sessionKey.trim();
	if (!sessionKey) return {
		found: true,
		value: void 0
	};
	const resolved = resolveSqliteScope(scope);
	let result;
	try {
		result = withOpenClawAgentDatabaseReadOnly((database) => {
			const entry = readExactSessionEntryRowValidated(database, sessionKey)?.entry;
			return {
				entry,
				rowExists: entry ? true : Boolean(executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select("session_key").where("session_key", "=", sessionKey)))
			};
		}, toDatabaseOptions(resolved));
	} catch (error) {
		if (error instanceof Error && error.code === "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED") return {
			found: false,
			reason: "row-invalid"
		};
		throw error;
	}
	if (!result.found) return result;
	if (!result.value.entry) return result.value.rowExists ? {
		found: false,
		reason: "row-invalid"
	} : {
		found: true,
		value: void 0
	};
	return {
		found: true,
		value: {
			sessionKey,
			entry: scope.clone === false ? result.value.entry : cloneSessionEntry(result.value.entry)
		}
	};
}
/** Indexed exact-key/session-id probe that preserves unreadable state as unknown. */
function readSessionIdentityEvidence(params) {
	const resolved = resolveSqliteScope({
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	let result;
	try {
		result = withOpenClawAgentDatabaseReadOnly((database) => {
			if ((readExactSessionEntryRowValidated(database, resolved.sessionKey)?.entry)?.sessionId === params.sessionId) return {
				status: "current",
				sessionKey: resolved.sessionKey
			};
			const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("session_nodes").select(["session_key", "entry_valid"]).where("current_session_id", "=", params.sessionId).limit(2)).rows;
			if (rows.length === 0) return { status: "absent" };
			if (rows.length !== 1) return {
				status: "unknown",
				reason: "ambiguous"
			};
			const row = rows[0];
			if (row?.entry_valid === -1) return { status: "absent" };
			const sessionKey = row?.session_key;
			if (!sessionKey || row.entry_valid !== 1) return {
				status: "unknown",
				reason: "row-invalid"
			};
			return (readExactSessionEntryRowValidated(database, sessionKey)?.entry)?.sessionId === params.sessionId ? {
				status: "current",
				sessionKey
			} : {
				status: "unknown",
				reason: "row-invalid"
			};
		}, toDatabaseOptions(resolved));
	} catch {
		return {
			status: "unknown",
			reason: "read-failed"
		};
	}
	if (result.found) return result.value;
	return result.reason === "database-missing" ? { status: "absent" } : {
		status: "unknown",
		reason: result.reason
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-replacement-projection.ts
async function applySqliteSessionEntryReplacementProjection(params, normalize) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? params.sessionKeys?.[0] ?? "",
		storePath: params.storePath
	});
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const selectedKeys = params.sessionKeys ? new Set(params.sessionKeys) : void 0;
		const selectedStatuses = params.statuses ? new Set(params.statuses) : void 0;
		const entries = selectedStatuses ? readSessionEntriesByStatus(database, [...selectedStatuses], params.sessionKeys) : selectedKeys ? [...selectedKeys].flatMap((sessionKey) => {
			const entry = readExactSessionEntryRow(database, sessionKey)?.entry;
			return entry ? [{
				entry: cloneSessionEntry(entry),
				sessionKey
			}] : [];
		}) : Object.entries(readSessionEntryStore(database)).map(([sessionKey, entry]) => ({
			entry: cloneSessionEntry(entry),
			sessionKey
		}));
		const replacementAuthorityKeys = selectedStatuses ? new Set(entries.map(({ sessionKey }) => sessionKey)) : selectedKeys;
		const expectedEntryJson = new Map(entries.map(({ sessionKey, entry }) => [sessionKey, JSON.stringify(entry)]));
		const operation = await params.update(entries);
		const replacements = normalize(operation.replacements);
		const claimedCanonicalKeys = /* @__PURE__ */ new Set();
		for (const replacement of replacements) {
			const previousSessionKeys = replacement.previousSessionKeys;
			const canonical = previousSessionKeys !== void 0;
			if (canonical && !replacement.sessionKey) throw new Error("Session entry replacement requires a key");
			if (canonical && [replacement.sessionKey, ...previousSessionKeys ?? []].some(isInternalSessionEffectsKey)) throw new Error("Session entry canonical replacement cannot target internal effects rows");
			for (const sessionKey of [replacement.sessionKey, ...previousSessionKeys ?? []]) {
				if (replacementAuthorityKeys && !replacementAuthorityKeys.has(sessionKey)) throw new Error(`Session entry replacement is outside the selected ${selectedStatuses ? "row" : "key"} set: ${sessionKey}`);
				if (canonical) {
					if (claimedCanonicalKeys.has(sessionKey)) throw new Error(`Session entry replacements overlap at ${sessionKey}`);
					claimedCanonicalKeys.add(sessionKey);
				}
			}
			if (canonical) {
				for (const previousSessionKey of previousSessionKeys) if (!expectedEntryJson.has(previousSessionKey)) throw new Error(`Session entry canonical projection cannot replace missing alias ${previousSessionKey}`);
			}
		}
		const applicable = replacements.filter((replacement) => replacement.previousSessionKeys || expectedEntryJson.has(replacement.sessionKey));
		if (params.requireWriteSuccess && replacements.length > 0 && applicable.length === 0) throw new Error("session entry replacements did not persist any rows");
		if (applicable.length === 0) return {
			maintenancePlans: [],
			result: operation.result
		};
		const validationKeys = new Set(applicable.flatMap((replacement) => [replacement.sessionKey, ...replacement.previousSessionKeys ?? []]));
		const maintenancePlans = [];
		const previous = /* @__PURE__ */ new Map();
		const current = /* @__PURE__ */ new Map();
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const transactionEntries = /* @__PURE__ */ new Map();
			for (const sessionKey of validationKeys) {
				const transactionEntry = readExactSessionEntryRow(transactionDb, sessionKey)?.entry;
				if (JSON.stringify(transactionEntry) !== expectedEntryJson.get(sessionKey)) throw new Error(`SQLite session entry changed before replacement for ${sessionKey}`);
				if (transactionEntry) transactionEntries.set(sessionKey, transactionEntry);
			}
			for (const replacement of applicable) {
				const sourceEntries = [replacement.sessionKey, ...replacement.previousSessionKeys ?? []].flatMap((sessionKey) => {
					const entry = transactionEntries.get(sessionKey);
					return entry ? [{
						entry,
						sessionKey
					}] : [];
				});
				const selectedBefore = sourceEntries.toSorted((left, right) => (right.entry.updatedAt ?? 0) - (left.entry.updatedAt ?? 0))[0]?.entry;
				for (const { entry, sessionKey } of sourceEntries) previous.set(sessionKey, entry);
				writeSessionEntry(transactionDb, replacement.sessionKey, cloneSessionEntry(replacement.entry), { previousEntry: selectedBefore ?? null });
				deleteLegacySessionEntryRows(transactionDb, [...replacement.previousSessionKeys ?? []], replacement.sessionKey, { rehomeMembers: selectedBefore?.sessionId === replacement.entry.sessionId });
				current.set(replacement.sessionKey, replacement.entry);
			}
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: params.activeSessionKey ?? "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				skipMaintenance: params.skipMaintenance ?? true,
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved), { operationLabel: "session.entry-replacements" });
		emitCommittedSessionIdentityDiff(previous, current);
		return {
			maintenancePlans,
			result: operation.result
		};
	});
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	return committed.result;
}
async function applySessionEntryExactReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection(params, (replacements) => [...replacements ?? []].map(({ entry, sessionKey }) => ({
		entry,
		sessionKey
	})));
}
/** Internal alias-aware owner; public SDK replacements remain exact-key only. */
async function applySessionEntryCanonicalReplacements(params) {
	return await applySqliteSessionEntryReplacementProjection({
		...params,
		...params.sessionKeys ? { sessionKeys: uniqueStrings(params.sessionKeys.map((key) => key.trim()).filter(Boolean)) } : {}
	}, (replacements) => [...replacements ?? []].map((replacement) => ({
		entry: replacement.entry,
		previousSessionKeys: uniqueStrings(replacement.previousSessionKeys.map((key) => key.trim()).filter(Boolean)),
		sessionKey: replacement.sessionKey.trim()
	})));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-batch-projection.ts
/** Compatibility adapter for the shipped detached-store projection. */
async function applySessionEntryBatchProjection(params) {
	return await applySessionEntryCanonicalReplacements({
		...params,
		update: async (entries) => {
			const store = Object.fromEntries(entries.flatMap(({ entry, sessionKey }) => isInternalSessionEffectsKey(sessionKey) ? [] : [[sessionKey, entry]]));
			const operation = await params.update(store);
			return {
				result: operation.result,
				replacements: [...operation.mutations ?? []].map((mutation) => ({
					entry: mutation.entry,
					previousSessionKeys: mutation.previousSessionKeys ?? [],
					sessionKey: mutation.sessionKey
				}))
			};
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-projection.ts
let sessionArchiveRuntimePromise;
function loadSessionArchiveRuntime$1() {
	sessionArchiveRuntimePromise ??= import("./session-archive.runtime.js");
	return sessionArchiveRuntimePromise;
}
async function applySessionEntryReplacements(params) {
	return await applySessionEntryExactReplacements(params);
}
/**
* Applies a detached whole-store projection under the SQLite writer lane.
* This exists only for bounded compatibility adapters that must preserve a
* legacy serialized callback without exposing mutable storage internals.
*/
async function applySessionStoreProjection(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.activeSessionKey ?? "",
		storePath: params.storePath
	});
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const before = readSessionEntryStore(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
		const projected = structuredClone(before);
		const operation = await params.update(projected);
		if (!operation.persist) return {
			maintenancePlans: [],
			result: operation.result
		};
		const transitionError = resolveAgentHarnessSessionStoreTransitionError({
			before: new Map(Object.entries(before).filter(([, entry]) => entry.modelSelectionLocked === true)),
			store: projected
		});
		const storeError = resolveAgentHarnessSessionStoreError(projected);
		if (transitionError || storeError) throw new Error(transitionError ?? storeError);
		const changedKeys = uniqueStrings([...Object.keys(before), ...Object.keys(projected)]).filter((sessionKey) => !sqliteSessionEntriesEqual(before[sessionKey], projected[sessionKey]));
		if (changedKeys.length === 0) return {
			maintenancePlans: [],
			result: operation.result
		};
		const maintenancePlans = [];
		runOpenClawAgentWriteTransaction((transactionDb) => {
			for (const sessionKey of changedKeys) {
				const current = readExactSessionEntryRow(transactionDb, sessionKey)?.entry;
				if (!sqliteSessionEntriesEqual(current, before[sessionKey])) throw new Error(`SQLite session entry changed before store projection for ${sessionKey}`);
			}
			for (const sessionKey of changedKeys) {
				const entry = projected[sessionKey];
				if (entry) writeSessionEntry(transactionDb, sessionKey, cloneSessionEntry(entry), { previousEntry: before[sessionKey] ?? null });
				else deleteSessionEntryRows(transactionDb, sessionKey);
			}
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: params.activeSessionKey ?? "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				skipMaintenance: params.skipMaintenance,
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved), { operationLabel: "session.store-projection" });
		return {
			maintenancePlans,
			result: operation.result
		};
	});
	await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	return committed.result;
}
function readProjectedRemovalEntry(database, projected, allowCanonicalRepair = false) {
	const expectedRawEntryJson = projected.removal.expectedRawEntryJson;
	if (expectedRawEntryJson === void 0) return (allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(database, projected.sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(database, projected.sessionKey))?.entry;
	if (readExactSessionEntryJsonForCanonicalRepair(database, projected.sessionKey) !== expectedRawEntryJson) throw new Error(`SQLite session entry changed before raw lifecycle removal for ${projected.sessionKey}`);
	return projected.expectedEntry;
}
/** Applies exact lifecycle removals/upserts using SQLite session rows. */
async function applySessionEntryLifecycleMutation(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: "",
		storePath: params.storePath
	});
	const removals = [...params.removals ?? []];
	const upserts = [...params.upserts ?? []];
	let artifactCleanupError;
	const captureArtifactCleanupError = (error) => {
		if (params.captureArtifactCleanupError === true) {
			artifactCleanupError ??= error;
			return;
		}
		throw error;
	};
	const projected = await runExclusiveSqliteSessionWrite(resolved, async () => {
		return await projectSessionEntryLifecycleMutation(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), {
			...params.allowCanonicalRepair ? { allowCanonicalRepair: true } : {},
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
			removals,
			upserts
		});
	});
	let materializedRemovalPlans = [];
	try {
		materializedRemovalPlans = await materializeSessionStateDeletePlans(projected.deletePlans);
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const removedSessionKeys = [];
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runOpenClawAgentWriteTransaction((transactionDb) => {
			params.beforeCommitInTransaction?.();
			const validatedRemovals = projected.removals.filter((removal) => {
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) {
					const replacedInSameMutation = projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey);
					throw new Error(replacedInSameMutation ? `SQLite session entry has stale lifecycle state for ${removal.sessionKey}` : `SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				}
				const shouldRemove = shouldRemoveSessionEntry(entry, removal.removal);
				if (!shouldRemove && projected.upsertedEntries.some((upsert) => upsert.sessionKey === removal.sessionKey)) throw new Error(`SQLite session entry has stale lifecycle state for ${removal.sessionKey}`);
				return shouldRemove;
			});
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedRemovalPlans, void 0, new Set(validatedRemovals.map((removal) => removal.sessionKey)));
			const legacyReplacementTargets = /* @__PURE__ */ new Map();
			for (const { sessionKey, entry, expectedEntry, resetBoundaryPlan } of projected.upsertedEntries) {
				const sameKeyRemoval = validatedRemovals.find((removal) => removal.sessionKey === sessionKey);
				const currentEntry = sameKeyRemoval ? readProjectedRemovalEntry(transactionDb, sameKeyRemoval, params.allowCanonicalRepair) : (params.allowCanonicalRepair ? readExactSessionEntryRowForCanonicalRepair(transactionDb, sessionKey, { allowMalformedRowRepair: true }) : readExactSessionEntryRow(transactionDb, sessionKey))?.entry;
				const expectedCurrentEntry = expectedEntry ?? sameKeyRemoval?.expectedEntry;
				if (!sqliteSessionEntriesEqual(currentEntry, expectedCurrentEntry)) {
					if (sameKeyRemoval) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
					throw new Error(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
				}
				if (sameKeyRemoval && !shouldRemoveSessionEntry(currentEntry, sameKeyRemoval.removal)) throw new Error(`SQLite session entry has stale lifecycle state for ${sessionKey}`);
				if (resetBoundaryPlan && expectedEntry?.sessionId) {
					const events = [...resetBoundaryPlan.seedEvents, resetBoundaryPlan.event];
					if (appendTranscriptEventsInTransaction(transactionDb, {
						...resolved,
						sessionId: expectedEntry.sessionId,
						sessionKey
					}, events) !== events.length) throw new Error(`Failed to append reset boundary for ${sessionKey}`);
				}
				writeSessionEntry(transactionDb, sessionKey, entry, {
					allowStoredAliases: params.allowCanonicalRepair === true,
					preserveNodeSuggestions: params.allowCanonicalRepair === true,
					previousEntry: expectedCurrentEntry ?? null
				});
				const relatedRemovalKeys = validatedRemovals.flatMap((removal) => {
					const removedSessionId = removal.expectedEntry.sessionId;
					return removal.sessionKey !== sessionKey && (removedSessionId === entry.sessionId || removedSessionId === entry.previousSessionId) ? [removal.sessionKey] : [];
				});
				rehomeSessionWindows(transactionDb, sessionKey, relatedRemovalKeys);
				for (const legacyKey of relatedRemovalKeys) {
					const removedEntry = validatedRemovals.find((removal) => removal.sessionKey === legacyKey)?.expectedEntry;
					legacyReplacementTargets.set(legacyKey, {
						canonicalKey: sessionKey,
						rehomeMembers: removedEntry?.sessionId === entry.sessionId
					});
				}
			}
			params.afterUpsertsInTransaction?.(transactionDb);
			const upsertedKeys = new Set(projected.upsertedEntries.map((upsert) => upsert.sessionKey));
			for (const removal of validatedRemovals) {
				if (upsertedKeys.has(removal.sessionKey)) continue;
				const entry = readProjectedRemovalEntry(transactionDb, removal, params.allowCanonicalRepair);
				if (!sqliteSessionEntriesEqual(entry, removal.expectedEntry)) throw new Error(`SQLite session entry changed before lifecycle removal for ${removal.sessionKey}`);
				if (!shouldRemoveSessionEntry(entry, removal.removal)) continue;
				const replacement = legacyReplacementTargets.get(removal.sessionKey);
				if (replacement) deleteLegacySessionEntryRows(transactionDb, [removal.sessionKey], replacement.canonicalKey, { rehomeMembers: replacement.rehomeMembers });
				else deleteSessionEntryRows(transactionDb, removal.sessionKey, {
					deleteOwnedWindows: removal.removal.deleteOwnedWindows === true,
					deliveryCleanupKeys: removal.removal.deliveryCleanupKeys
				});
				removedSessionKeys.push(removal.sessionKey);
			}
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: params.activeSessionKey ?? "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				forceMaintenance: params.maintenanceOverride !== void 0,
				maintenanceConfig: params.maintenanceOverride ? {
					...resolveMaintenanceConfig(),
					...params.maintenanceOverride
				} : void 0,
				skipMaintenance: params.skipMaintenance,
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved));
		emitCommittedLifecycleIdentityMutations({
			projected,
			removedSessionKeys
		});
		return {
			archivedTranscripts,
			maintenancePlans,
			removedSessionKeys
		};
	});
	const maintenanceArchivedTranscripts = await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans);
	const archivedTranscripts = [...committed.archivedTranscripts, ...maintenanceArchivedTranscripts];
	const afterCount = readSessionEntryCount(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
	emitArchivedTranscriptUpdates(archivedTranscripts);
	const archivedTranscriptDirectories = uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted();
	if (archivedTranscriptDirectories.length > 0 && params.cleanupArchivedTranscripts) try {
		const { cleanupArchivedSessionTranscripts } = await loadSessionArchiveRuntime$1();
		await cleanupArchivedSessionTranscripts({
			directories: archivedTranscriptDirectories,
			rules: params.cleanupArchivedTranscripts.rules,
			nowMs: params.cleanupArchivedTranscripts.nowMs
		});
	} catch (error) {
		captureArtifactCleanupError(error);
	}
	return {
		removedEntries: committed.removedSessionKeys.length,
		removedSessionKeys: committed.removedSessionKeys,
		archivedTranscriptDirectories,
		unreferencedArtifacts: null,
		maintenanceReport: null,
		afterCount,
		artifactCleanupError
	};
}
/** Purges entries owned by a deleted agent from SQLite session rows. */
async function purgeDeletedAgentSessionEntries(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.storeAgentId });
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const store = readSessionEntryStore(database);
		const remainingStore = { ...store };
		const entryRemovals = [];
		const removedEntriesToArchive = [];
		for (const sessionKey of Object.keys(store)) {
			if (resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) !== params.agentId) continue;
			const entry = store[sessionKey];
			if (!entry) continue;
			entryRemovals.push({
				expectedEntry: cloneSessionEntry(entry),
				sessionKey
			});
			removedEntriesToArchive.push(entry);
			delete remainingStore[sessionKey];
		}
		const referencedSessionIds = collectProjectedReferencedSessionIds({
			database,
			excludedSessionKeys: entryRemovals.map((removal) => removal.sessionKey),
			projectedStore: remainingStore
		});
		return {
			deletePlans: removedEntriesToArchive.flatMap((entry) => planSessionStateAfterEntryRemoval({
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				database,
				entry,
				reason: "deleted",
				referencedSessionIds
			})),
			entryRemovals
		};
	});
	const materializedPlans = await materializeSessionStateDeletePlans(prepared.deletePlans);
	const committed = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const removedSessionKeys = prepared.entryRemovals.map((removal) => removal.sessionKey);
		let archivedTranscripts = [];
		const maintenancePlans = [];
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const currentOwnedSessionKeys = Object.keys(readSessionEntryStore(transactionDb)).filter((sessionKey) => resolveStoredSessionOwnerAgentId({
				cfg: params.cfg,
				agentId: params.storeAgentId,
				sessionKey
			}) === params.agentId).toSorted();
			const plannedSessionKeys = prepared.entryRemovals.map((removal) => removal.sessionKey).toSorted();
			if (JSON.stringify(currentOwnedSessionKeys) !== JSON.stringify(plannedSessionKeys)) throw new Error("SQLite deleted-agent session entries changed before purge");
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, prepared.entryRemovals);
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, new Set(prepared.entryRemovals.map((removal) => removal.sessionKey)));
			deletePlannedLifecycleArtifactEntries(transactionDb, prepared.entryRemovals);
			maintenancePlans.push(applySessionEntryMaintenance(transactionDb, {
				activeSessionKey: "",
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				storePath: params.storePath
			}));
		}, toDatabaseOptions(resolved));
		emitCommittedSessionEntryRemovals(prepared.entryRemovals);
		return {
			archivedTranscripts,
			maintenancePlans,
			removedSessionKeys
		};
	});
	const archivedTranscripts = [...committed.archivedTranscripts, ...await finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(resolved, committed.maintenancePlans)];
	const afterCount = readSessionEntryCount(openOpenClawAgentDatabase(toDatabaseOptions(resolved)));
	emitArchivedTranscriptUpdates(archivedTranscripts);
	return {
		removedEntries: committed.removedSessionKeys.length,
		removedSessionKeys: committed.removedSessionKeys,
		archivedTranscriptDirectories: uniqueStrings(archivedTranscripts.map((transcript) => path.dirname(transcript.archivedPath))).toSorted(),
		unreferencedArtifacts: null,
		maintenanceReport: null,
		afterCount
	};
}
/** Fully replaces rows for one transcript in the additive SQLite transcript store. */
//#endregion
//#region src/config/sessions/session-entry-selection.ts
var SessionLabelOwnerIndex = class {
	#owners = /* @__PURE__ */ new Map();
	constructor(store) {
		this.store = store;
		for (const [sessionKey, entry] of Object.entries(this.store)) this.#update(sessionKey, entry.label, true);
	}
	isLabelInUse(label, excludedKeys) {
		for (const sessionKey of this.#owners.get(label) ?? []) if (!excludedKeys.includes(sessionKey)) return true;
		return false;
	}
	replaceEntry(candidateKeys, primaryKey, entry) {
		for (const sessionKey of /* @__PURE__ */ new Set([...candidateKeys, primaryKey])) {
			this.#update(sessionKey, this.store[sessionKey]?.label, false);
			delete this.store[sessionKey];
		}
		const cloned = structuredClone(entry);
		this.store[primaryKey] = cloned;
		this.#update(primaryKey, cloned.label, true);
		return cloned;
	}
	#update(sessionKey, label, add) {
		if (label === void 0) return;
		const owners = this.#owners.get(label) ?? /* @__PURE__ */ new Set();
		if (add) {
			owners.add(sessionKey);
			this.#owners.set(label, owners);
			return;
		}
		owners.delete(sessionKey);
	}
};
/** Carries only user/runtime selection into a new dashboard fork. */
function inheritSessionSelection(parentEntry) {
	if (!parentEntry) return {};
	const authProfileOverrideSource = resolveSessionAuthProfileOverrideSource(parentEntry);
	return {
		...parentEntry.providerOverride ? { providerOverride: parentEntry.providerOverride } : {},
		...parentEntry.modelOverride ? { modelOverride: parentEntry.modelOverride } : {},
		...parentEntry.modelOverrideSource ? { modelOverrideSource: parentEntry.modelOverrideSource } : {},
		...parentEntry.modelOverrideRouteResolution ? { modelOverrideRouteResolution: parentEntry.modelOverrideRouteResolution } : {},
		...parentEntry.agentRuntimeOverride ? { agentRuntimeOverride: parentEntry.agentRuntimeOverride } : {},
		...parentEntry.thinkingLevel ? { thinkingLevel: parentEntry.thinkingLevel } : {},
		...parentEntry.fastMode !== void 0 ? { fastMode: parentEntry.fastMode } : {},
		...parentEntry.toolOverrides ? { toolOverrides: parentEntry.toolOverrides } : {},
		...parentEntry.verboseLevel ? { verboseLevel: parentEntry.verboseLevel } : {},
		...parentEntry.traceLevel ? { traceLevel: parentEntry.traceLevel } : {},
		...parentEntry.reasoningLevel ? { reasoningLevel: parentEntry.reasoningLevel } : {},
		...parentEntry.elevatedLevel ? { elevatedLevel: parentEntry.elevatedLevel } : {},
		...authProfileOverrideSource && parentEntry.authProfileOverride ? { authProfileOverride: parentEntry.authProfileOverride } : {},
		...authProfileOverrideSource ? { authProfileOverrideSource } : {}
	};
}
function cloneOptionalSessionEntry(entry) {
	return entry ? structuredClone(entry) : void 0;
}
function resolveProjectionExistingEntry(snapshot, target) {
	const candidateKeys = target.candidateKeys ?? [target.primaryKey];
	let freshest;
	for (const candidateKey of candidateKeys) {
		const entry = snapshot.store[candidateKey];
		if (entry && (!freshest || (entry.updatedAt ?? 0) > (freshest.updatedAt ?? 0))) freshest = entry;
	}
	return cloneOptionalSessionEntry(freshest);
}
//#endregion
//#region src/config/sessions/session-accessor.lifecycle.ts
function findSessionCompactionCheckpoint(params) {
	const checkpointId = params.checkpointId.trim();
	if (!checkpointId || !Array.isArray(params.entry.compactionCheckpoints)) return;
	let newest;
	for (const checkpoint of params.entry.compactionCheckpoints) {
		if (checkpoint.checkpointId !== checkpointId) continue;
		if (!newest || checkpoint.createdAt > newest.createdAt) newest = checkpoint;
	}
	return newest;
}
async function applySessionCompactionCheckpointMutation(params) {
	const currentEntry = loadSessionEntry({
		sessionKey: params.readKey,
		storePath: params.storePath
	});
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (currentEntry.modelSelectionLocked === true) return { status: "model-selection-locked" };
	const checkpoint = findSessionCompactionCheckpoint({
		entry: currentEntry,
		checkpointId: params.checkpointId
	});
	if (!checkpoint) return { status: "missing-checkpoint" };
	const forkedSession = await params.forkTranscriptFromCheckpoint(checkpoint);
	if (forkedSession.status !== "created") return forkedSession;
	const nextEntry = await params.buildEntry({
		checkpoint,
		currentEntry,
		forkedTranscript: forkedSession.transcript
	});
	await replaceSessionEntry({
		sessionKey: params.writeKey,
		storePath: params.storePath
	}, nextEntry);
	return {
		status: "created",
		key: params.writeKey,
		checkpoint,
		entry: nextEntry
	};
}
/**
* Forks checkpoint transcript content and persists a new branch entry in one
* storage-sized mutation. SQLite adapters implement the transcript row copy
* and `session_nodes.entry_json` insert inside the same write transaction.
*/
async function branchSessionFromCompactionCheckpoint(params) {
	return await applySessionCompactionCheckpointMutation({
		buildEntry: params.buildEntry,
		checkpointId: params.checkpointId,
		forkTranscriptFromCheckpoint: params.forkTranscriptFromCheckpoint,
		readKey: params.sourceStoreKey ?? params.sourceKey,
		storePath: params.storePath,
		writeKey: params.nextKey
	});
}
/**
* Forks checkpoint transcript content and replaces the current entry in one
* storage-sized mutation. SQLite adapters implement the transcript row copy
* and `session_nodes.entry_json` update inside the same write transaction.
*/
async function restoreSessionFromCompactionCheckpoint(params) {
	return await applySessionCompactionCheckpointMutation({
		buildEntry: params.buildEntry,
		checkpointId: params.checkpointId,
		forkTranscriptFromCheckpoint: params.forkTranscriptFromCheckpoint,
		readKey: params.sessionStoreKey ?? params.sessionKey,
		storePath: params.storePath,
		writeKey: params.sessionKey
	});
}
/** Projects ordered session patches against one store snapshot and commits once. */
async function applySessionPatchProjections(params) {
	return await applySessionEntryBatchProjection({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		skipMaintenance: true,
		update: async (workingStore) => {
			const snapshot = { store: workingStore };
			const labelOwners = new SessionLabelOwnerIndex(workingStore);
			const mutations = [];
			const results = [];
			for (const operation of params.operations) try {
				const target = operation.resolveTarget(snapshot);
				const existingEntry = resolveProjectionExistingEntry(snapshot, target);
				const candidateKeys = uniqueStrings((target.candidateKeys ?? [target.primaryKey]).map((key) => key.trim()).filter(Boolean));
				const projected = await operation.project({
					...target,
					...snapshot,
					...existingEntry ? { existingEntry } : {},
					isLabelInUse: (label) => labelOwners.isLabelInUse(label, candidateKeys)
				});
				if (!projected.ok) {
					results.push(projected);
					continue;
				}
				const authorizationFailure = operation.authorize?.();
				if (authorizationFailure) {
					results.push(authorizationFailure);
					continue;
				}
				const previousSessionKeys = candidateKeys.filter((sessionKey) => sessionKey !== target.primaryKey && workingStore[sessionKey]);
				mutations.push({
					entry: projected.entry,
					...previousSessionKeys.length > 0 ? { previousSessionKeys } : {},
					sessionKey: target.primaryKey
				});
				const cloned = labelOwners.replaceEntry(candidateKeys, target.primaryKey, projected.entry);
				results.push({
					ok: true,
					entry: structuredClone(cloned)
				});
			} catch (error) {
				if (!operation.onError) throw error;
				results.push(operation.onError(error));
			}
			return {
				mutations,
				result: results
			};
		}
	});
}
/** Applies one patch through the canonical ordered batch projection owner. */
async function applySessionPatchProjection(params) {
	const [result] = await applySessionPatchProjections({
		agentId: params.agentId,
		sessionKeys: params.sessionKeys,
		storePath: params.storePath,
		operations: [{
			resolveTarget: params.resolveTarget,
			project: params.project,
			...params.assertCurrent ? { authorize: () => {
				params.assertCurrent?.();
			} } : {}
		}]
	});
	if (!result) throw new Error("Session patch projection produced no result");
	return result;
}
/**
* Runs an operation while preserving one temporary session mapping.
* The storage backend snapshots exactly the named key before the operation and
* restores that entry, or deletes it when it did not previously exist, after
* the operation finishes. SQLite backends can implement the same named
* preservation lifecycle without exposing mutable store access to callers.
*/
async function preserveTemporarySessionMapping(scope, operation) {
	const snapshot = snapshotTemporarySessionMapping(scope);
	let operationResult;
	try {
		operationResult = {
			ok: true,
			result: await operation()
		};
	} catch (err) {
		operationResult = {
			error: err,
			ok: false
		};
	}
	const restoreFailure = await restoreTemporarySessionMapping(snapshot);
	if (!operationResult.ok) throw operationResult.error;
	return {
		result: operationResult.result,
		...snapshot.canRestore ? {} : { snapshotFailure: snapshot.snapshotFailure },
		...restoreFailure ? { restoreFailure } : {}
	};
}
/**
* Clears plugin host-owned state inside one resolved session store.
* This is an internal transaction-sized boundary for the storage backend, not
* a Plugin SDK API.
*/
async function cleanupPluginHostSessionStore(params) {
	if (shouldSkipPluginHostCleanupStore(params) || params.shouldCleanup && !params.shouldCleanup()) return 0;
	const now = Date.now();
	let cleared = 0;
	for (const { entry, sessionKey } of listSessionEntriesCore({
		agentId: params.agentId,
		storePath: params.storePath
	})) {
		if (isLockedHarnessSessionOwnedByPlugin(entry, params.preserveLockedHarnessIds)) continue;
		if (!matchesPluginHostCleanupSession(sessionKey, entry, params.sessionKey) || !hasPluginHostCleanupTarget(entry, params)) continue;
		if (await patchSessionEntryCore({
			agentId: params.agentId,
			sessionKey,
			storePath: params.storePath
		}, (currentEntry) => {
			if (isLockedHarnessSessionOwnedByPlugin(currentEntry, params.preserveLockedHarnessIds)) return null;
			if (!hasPluginHostCleanupTarget(currentEntry, params)) return null;
			clearPluginHostCleanupTarget(currentEntry, params);
			currentEntry.updatedAt = now;
			return currentEntry;
		}, {
			replaceEntry: true,
			skipMaintenance: true
		})) cleared += 1;
	}
	return cleared;
}
function snapshotTemporarySessionMapping(scope) {
	const storePath = resolveAccessStorePath(scope);
	try {
		const exact = loadExactSessionEntry({
			...scope,
			storePath
		});
		return {
			canRestore: true,
			...exact ? {
				entry: structuredClone(exact.entry),
				hadEntry: true
			} : { hadEntry: false },
			sessionKey: scope.sessionKey,
			storePath
		};
	} catch (err) {
		return {
			canRestore: false,
			sessionKey: scope.sessionKey,
			snapshotFailure: formatErrorMessage(err),
			storePath
		};
	}
}
async function restoreTemporarySessionMapping(snapshot) {
	if (!snapshot.canRestore) return;
	try {
		if (snapshot.hadEntry) await replaceSessionEntry({
			sessionKey: snapshot.sessionKey,
			storePath: snapshot.storePath
		}, structuredClone(snapshot.entry));
		else await applySessionEntryLifecycleMutation({
			storePath: snapshot.storePath,
			removals: [{ sessionKey: snapshot.sessionKey }],
			activeSessionKey: snapshot.sessionKey,
			skipMaintenance: true
		});
		return;
	} catch (err) {
		return formatErrorMessage(err);
	}
}
//#endregion
//#region src/agents/usage.ts
/**
* Token usage normalization helpers.
* Converts provider-specific usage shapes into OpenClaw's normalized input,
* output, cache, reasoning, and total token accounting fields.
*/
/** Build a zeroed assistant usage snapshot. */
function makeZeroUsageSnapshot() {
	return {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		totalTokens: 0,
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			total: 0
		}
	};
}
/** Return true when any normalized usage bucket is positive. */
function hasNonzeroUsage(usage) {
	if (!usage) return false;
	return [
		usage.input,
		usage.output,
		usage.cacheRead,
		usage.cacheWrite,
		usage.contextUsage?.state === "available" ? usage.contextUsage.promptTokens : void 0,
		usage.contextUsage?.state === "available" ? usage.contextUsage.totalTokens : void 0,
		usage.reasoningTokens,
		usage.total
	].some((v) => typeof v === "number" && Number.isFinite(v) && v > 0) || usage.contextUsage?.state === "unavailable";
}
const normalizeTokenCount = (value) => {
	const numeric = asFiniteNumber(value);
	if (numeric === void 0) return;
	if (numeric <= 0) return 0;
	return Math.min(Math.trunc(numeric), Number.MAX_SAFE_INTEGER);
};
/** Normalize provider-specific token usage fields into OpenClaw usage buckets. */
function normalizeUsage(raw) {
	if (!raw) return;
	const cli = raw;
	const cacheRead = normalizeTokenCount(raw.cacheRead ?? raw.cache_read ?? raw.cache_read_input_tokens ?? cli.cached_input_tokens ?? cli.cached ?? raw.cached_tokens ?? raw.input_tokens_details?.cached_tokens ?? raw.prompt_tokens_details?.cached_tokens);
	const cacheWrite = normalizeTokenCount(raw.cacheWrite ?? raw.cache_write ?? raw.cache_creation_input_tokens ?? cli.cache_write_input_tokens ?? cli.input_tokens_details?.cache_write_tokens ?? cli.prompt_tokens_details?.cache_write_tokens);
	const directInput = asFiniteNumber(raw.input);
	const rawInputValue = raw.input ?? raw.inputTokens ?? raw.input_tokens ?? raw.promptTokens ?? raw.prompt_tokens ?? raw.prompt_n ?? raw.timings?.prompt_n;
	const cliCacheReadIncludedInInput = cli.cached_input_tokens !== void 0 || cli.cached !== void 0;
	const openAiCacheReadIncludedInInput = raw.cached_tokens !== void 0 || raw.input_tokens_details?.cached_tokens !== void 0 || raw.prompt_tokens_details?.cached_tokens !== void 0;
	const cacheWriteIncludedInInput = cli.cache_write_input_tokens !== void 0 || cli.input_tokens_details?.cache_write_tokens !== void 0 || cli.prompt_tokens_details?.cache_write_tokens !== void 0;
	const rawInput = asFiniteNumber(rawInputValue);
	const normalizedInput = rawInput !== void 0 ? rawInput - (openAiCacheReadIncludedInInput || directInput === void 0 && cliCacheReadIncludedInInput ? cacheRead ?? 0 : 0) - (directInput === void 0 && cacheWriteIncludedInInput ? cacheWrite ?? 0 : 0) : rawInput;
	const input = normalizeTokenCount(normalizedInput);
	const output = normalizeTokenCount(raw.output ?? raw.outputTokens ?? raw.output_tokens ?? raw.completionTokens ?? raw.completion_tokens ?? raw.predicted_n ?? raw.timings?.predicted_n);
	const contextPromptTokens = raw.contextUsage?.state === "available" ? normalizeTokenCount(raw.contextUsage.promptTokens) : void 0;
	const contextTotalTokens = raw.contextUsage?.state === "available" ? normalizeTokenCount(raw.contextUsage.totalTokens) : void 0;
	const contextUsage = raw.contextUsage?.state === "unavailable" ? { state: "unavailable" } : contextPromptTokens !== void 0 && contextTotalTokens !== void 0 && contextTotalTokens >= contextPromptTokens ? {
		state: "available",
		promptTokens: contextPromptTokens,
		totalTokens: contextTotalTokens
	} : void 0;
	const reasoningTokens = normalizeTokenCount(raw.reasoningTokens ?? raw.reasoning_tokens ?? raw.completion_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.reasoning_tokens ?? raw.output_tokens_details?.thinking_tokens);
	const total = normalizeTokenCount(raw.total ?? raw.totalTokens ?? raw.total_tokens);
	if (input === void 0 && output === void 0 && cacheRead === void 0 && cacheWrite === void 0 && contextUsage === void 0 && reasoningTokens === void 0 && total === void 0) return;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		...contextUsage ? { contextUsage } : {},
		...reasoningTokens !== void 0 ? { reasoningTokens } : {},
		total
	};
}
/**
* Maps normalized usage to OpenAI Chat Completions `usage` fields.
*
* `prompt_tokens` is input + cacheRead (cache write is excluded to match the
* OpenAI-style breakdown used by the compat endpoint).
*
* `total_tokens` is the greater of the component sum and aggregate `total` when
* present, so a partial breakdown cannot discard a valid upstream total.
*
* `prompt_tokens_details.cached_tokens` is emitted when `cacheRead > 0` so
* downstream chat-completions clients can compute the cache-aware blended
* cost. Field name and shape match OpenAI's documented usage breakdown:
* https://platform.openai.com/docs/guides/prompt-caching
*/
function toOpenAiChatCompletionsUsage(usage) {
	const input = usage?.input ?? 0;
	const output = usage?.output ?? 0;
	const cacheRead = usage?.cacheRead ?? 0;
	const promptTokens = Math.max(0, input + cacheRead);
	const completionTokens = Math.max(0, output);
	const componentTotal = promptTokens + completionTokens;
	const aggregateRaw = usage?.total;
	const aggregateTotal = typeof aggregateRaw === "number" && Number.isFinite(aggregateRaw) ? Math.max(0, aggregateRaw) : void 0;
	const totalTokens = aggregateTotal !== void 0 ? Math.max(componentTotal, aggregateTotal) : componentTotal;
	const reasoningTokens = normalizeTokenCount(usage?.reasoningTokens);
	return {
		prompt_tokens: promptTokens,
		completion_tokens: completionTokens,
		total_tokens: totalTokens,
		...cacheRead > 0 ? { prompt_tokens_details: { cached_tokens: cacheRead } } : {},
		...reasoningTokens !== void 0 ? { completion_tokens_details: { reasoning_tokens: reasoningTokens } } : {}
	};
}
/**
* Maps normalized usage to OpenAI Responses `usage` fields.
*
* Responses reports cache reads and writes as subsets of `input_tokens`, so
* recombine OpenClaw's separately priced buckets and retain their details.
* Reasoning tokens remain a detail of `output_tokens`, not an extra bucket.
*/
function toOpenAiResponsesUsage(usage) {
	const input = Math.max(0, usage?.input ?? 0);
	const output = Math.max(0, usage?.output ?? 0);
	const cacheRead = Math.max(0, usage?.cacheRead ?? 0);
	const cacheWrite = Math.max(0, usage?.cacheWrite ?? 0);
	const reasoningTokens = Math.max(0, usage?.reasoningTokens ?? 0);
	const inputTokens = input + cacheRead + cacheWrite;
	const componentTotal = inputTokens + output;
	const aggregateTotal = Math.max(0, usage?.total ?? 0);
	return {
		input_tokens: inputTokens,
		input_tokens_details: {
			cached_tokens: cacheRead,
			cache_write_tokens: cacheWrite
		},
		output_tokens: output,
		output_tokens_details: { reasoning_tokens: reasoningTokens },
		total_tokens: Math.max(componentTotal, aggregateTotal)
	};
}
/** Derive prompt/context tokens from normalized input and cache buckets. */
function derivePromptTokens(usage) {
	if (!usage) return;
	const input = usage.input ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const sum = input + cacheRead + cacheWrite;
	return sum > 0 ? sum : void 0;
}
function derivePromptTokensFromTotal(usage) {
	const total = usage?.total;
	const output = usage?.output;
	if (typeof total !== "number" || !Number.isFinite(total) || total <= 0 || typeof output !== "number" || !Number.isFinite(output) || output < 0) return;
	const promptTokens = total - output;
	return promptTokens > 0 ? promptTokens : void 0;
}
/** Resolve context prompt tokens from explicit override, last call, or aggregate usage. */
function deriveContextPromptTokens(params) {
	const promptOverride = params.promptTokens;
	if (typeof promptOverride === "number" && Number.isFinite(promptOverride) && promptOverride > 0) return promptOverride;
	if (params.lastCallUsage?.contextUsage?.state === "unavailable") return;
	if (params.lastCallUsage?.contextUsage?.state === "available") return params.lastCallUsage.contextUsage.promptTokens;
	const lastCallPromptTokens = derivePromptTokens(params.lastCallUsage) ?? derivePromptTokensFromTotal(params.lastCallUsage);
	if (lastCallPromptTokens !== void 0) return lastCallPromptTokens;
	if (params.usage?.contextUsage?.state === "unavailable") return;
	if (params.usage?.contextUsage?.state === "available") return params.usage.contextUsage.promptTokens;
	return derivePromptTokens(params.usage);
}
/** Derive the session prompt-token snapshot stored for context display. */
function deriveSessionTotalTokens(params) {
	const promptOverride = params.promptTokens;
	const hasPromptOverride = typeof promptOverride === "number" && Number.isFinite(promptOverride) && promptOverride > 0;
	const usage = params.usage;
	if (!params.lastCallUsage && !usage && !hasPromptOverride) return;
	const promptTokens = deriveContextPromptTokens({
		lastCallUsage: params.lastCallUsage,
		promptTokens: hasPromptOverride ? promptOverride : void 0,
		usage
	});
	if (!(typeof promptTokens === "number") || !Number.isFinite(promptTokens) || promptTokens <= 0) return;
	return promptTokens;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-fork.ts
const DEFAULT_PARENT_FORK_MAX_TOKENS = 1e5;
function formatParentForkTooLargeMessage(params) {
	return `Parent context is too large to fork (${params.parentTokens}/${params.maxTokens} tokens); starting with isolated context instead.`;
}
function planParentForkDecision(parentEntry, transcriptEstimate, options = {}) {
	const maxTokens = DEFAULT_PARENT_FORK_MAX_TOKENS;
	const parentTokens = options.preferTranscriptEstimate ? transcriptEstimate?.tokens : resolveFreshSessionTotalTokens(parentEntry) ?? transcriptEstimate?.tokens;
	if (typeof parentTokens === "number" && parentTokens > maxTokens) return {
		status: "skip",
		reason: "parent-too-large",
		maxTokens,
		parentTokens,
		message: formatParentForkTooLargeMessage({
			parentTokens,
			maxTokens
		})
	};
	return {
		status: "fork",
		maxTokens,
		...typeof parentTokens === "number" ? { parentTokens } : {}
	};
}
function estimateTranscriptPromptTokens(events) {
	let byteEstimate = 0;
	let latestUsageEstimate;
	let latestUsageEstimateIsExactContext = false;
	let trailingBytes = 0;
	for (const event of selectParentForkTokenEstimateEvents(events)) {
		const serializedBytes = Buffer.byteLength(JSON.stringify(event)) + 1;
		byteEstimate += serializedBytes;
		if (!isRecord(event)) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const message = isRecord(event.message) ? event.message : void 0;
		const usageRaw = isRecord(message?.usage) ? message.usage : isRecord(event.usage) ? event.usage : void 0;
		if (!usageRaw) {
			if (latestUsageEstimate !== void 0) trailingBytes += serializedBytes;
			continue;
		}
		const contextUsage = readTranscriptContextUsage(usageRaw);
		if (message?.api === "cli" && contextUsage === void 0) {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "unavailable") {
			latestUsageEstimate = void 0;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
			continue;
		}
		if (contextUsage?.state === "available") {
			latestUsageEstimate = normalizePositiveTokenCount(contextUsage.totalTokens);
			latestUsageEstimateIsExactContext = true;
			trailingBytes = 0;
			continue;
		}
		const usage = normalizeUsage(usageRaw);
		const promptTokens = normalizePositiveTokenCount(derivePromptTokens({
			input: usage?.input,
			cacheRead: usage?.cacheRead,
			cacheWrite: usage?.cacheWrite
		}));
		const outputTokens = normalizePositiveTokenCount(usage?.output) ?? 0;
		const totalTokens = promptTokens === void 0 ? void 0 : normalizePositiveTokenCount(promptTokens + outputTokens);
		if (typeof totalTokens === "number") {
			latestUsageEstimate = totalTokens;
			latestUsageEstimateIsExactContext = false;
			trailingBytes = 0;
		}
	}
	if (latestUsageEstimate !== void 0) {
		const tokens = normalizePositiveTokenCount(latestUsageEstimate + Math.ceil(trailingBytes / 4));
		return tokens === void 0 ? void 0 : {
			kind: latestUsageEstimateIsExactContext ? "exact-context" : "legacy-or-bytes",
			tokens
		};
	}
	const tokens = normalizePositiveTokenCount(Math.ceil(byteEstimate / 4));
	return tokens === void 0 ? void 0 : {
		kind: "legacy-or-bytes",
		tokens
	};
}
function selectParentForkTokenEstimateEvents(events) {
	const tree = scanSessionTranscriptTree(events.filter((entry) => !(isRecord(entry) && entry.type === "session")));
	return mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath: selectSessionTranscriptTreePathNodes(tree, tree.leafId),
		appendPath: selectSessionTranscriptTreePathNodes(tree, tree.appendParentId),
		appendParentId: tree.appendParentId
	}).nodes.flatMap((node) => node.entry);
}
function normalizePositiveTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function readTranscriptContextUsage(usageRaw) {
	const contextUsage = usageRaw.contextUsage;
	if (!isRecord(contextUsage)) return;
	if (contextUsage.state === "unavailable") return { state: "unavailable" };
	if (contextUsage.state !== "available") return;
	const totalTokens = normalizePositiveTokenCount(contextUsage.totalTokens);
	return totalTokens === void 0 ? void 0 : {
		state: "available",
		totalTokens
	};
}
function resolveParentForkSourceTranscript(fileEntries, forkFrom) {
	if (fileEntries.length === 0) return null;
	const header = fileEntries.find((entry) => isRecord(entry) && entry.type === "session");
	const entries = fileEntries.filter((entry) => !(isRecord(entry) && entry.type === "session"));
	const tree = scanSessionTranscriptTree(entries);
	const mergedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath: selectSessionTranscriptTreePathNodes(tree, tree.leafId),
		appendPath: selectSessionTranscriptTreePathNodes(tree, tree.appendParentId),
		appendParentId: tree.appendParentId
	});
	const visibleBranchEntries = mergedPath.nodes.flatMap((node) => {
		if (!isRecord(node.entry)) return [];
		const parentId = node.selectedParentId;
		return [node.entry.parentId === parentId ? node.entry : {
			...node.entry,
			parentId
		}];
	});
	const branchEntries = forkFrom === "last-completed" ? visibleBranchEntries.slice(0, findLastCompletedAssistantIndex(visibleBranchEntries) + 1) : visibleBranchEntries;
	const pathEntryIds = new Set(branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastLeafUpdateNode = tree.nodes.findLast((node) => node.leafId !== void 0);
	const lastBranchEntry = branchEntries.at(-1);
	const lastBranchEntryId = isRecord(lastBranchEntry) && typeof lastBranchEntry.id === "string" ? lastBranchEntry.id : null;
	return {
		appendParentId: forkFrom === "last-completed" ? lastBranchEntryId : mergedPath.appendParentId,
		...forkFrom !== "last-completed" && lastLeafUpdateNode?.appendMode ? { appendMode: lastLeafUpdateNode.appendMode } : {},
		branchEntries,
		cwd: typeof header?.cwd === "string" ? header.cwd : void 0,
		labelsToWrite: collectBranchLabels({
			allEntries: entries,
			pathEntryIds
		}),
		leafId: forkFrom === "last-completed" ? lastBranchEntryId : tree.leafId,
		preserveLeafControl: forkFrom !== "last-completed" && isSessionTranscriptLeafControl(lastLeafUpdateNode?.entry)
	};
}
function findLastCompletedAssistantIndex(entries) {
	return entries.findLastIndex((entry) => {
		const message = isRecord(entry) && isRecord(entry.message) ? entry.message : void 0;
		return message?.role === "assistant" && message.stopReason !== "toolUse";
	});
}
function collectBranchLabels(params) {
	return params.allEntries.flatMap((entry) => isRecord(entry) && entry.type === "label" && typeof entry.label === "string" && typeof entry.targetId === "string" && typeof entry.id === "string" && !params.pathEntryIds.has(entry.id) && params.pathEntryIds.has(entry.targetId) && typeof entry.timestamp === "string" ? [{
		targetId: entry.targetId,
		label: entry.label,
		timestamp: entry.timestamp
	}] : []);
}
function generateEntryId(existingIds) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existingIds.has(id)) {
			existingIds.add(id);
			return id;
		}
	}
	const id = randomUUID();
	existingIds.add(id);
	return id;
}
function buildLabelEntries(params) {
	let parentId = params.lastEntryId;
	return params.labelsToWrite.map(({ targetId, label, timestamp }) => {
		const entry = {
			type: "label",
			id: generateEntryId(params.pathEntryIds),
			parentId,
			timestamp,
			targetId,
			label
		};
		parentId = entry.id;
		return entry;
	});
}
function hasAssistantEntry(entries) {
	return entries.some((entry) => isRecord(entry) && entry.type === "message" && isRecord(entry.message) && entry.message.role === "assistant");
}
function buildForkedChildTranscriptEvents(params) {
	const header = {
		...createSessionTranscriptHeader({
			cwd: params.source.cwd,
			sessionId: params.targetSessionId
		}),
		parentSession: params.parentSessionFile
	};
	if (!params.source.preserveLeafControl && !hasAssistantEntry(params.source.branchEntries)) return [header];
	const pathEntryIds = new Set(params.source.branchEntries.flatMap((entry) => isRecord(entry) && typeof entry.id === "string" ? [entry.id] : []));
	const lastPathEntry = params.source.branchEntries.at(-1);
	const lastPathEntryId = isRecord(lastPathEntry) && typeof lastPathEntry.id === "string" ? lastPathEntry.id : null;
	const labelEntries = buildLabelEntries({
		labelsToWrite: params.source.labelsToWrite,
		pathEntryIds,
		lastEntryId: lastPathEntryId
	});
	const leafEntry = params.source.preserveLeafControl ? {
		type: "leaf",
		id: generateEntryId(pathEntryIds),
		parentId: labelEntries.at(-1)?.id ?? lastPathEntryId,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		targetId: params.source.leafId,
		appendParentId: params.source.appendParentId,
		...params.source.appendMode ? { appendMode: params.source.appendMode } : {}
	} : null;
	return [
		header,
		...params.source.branchEntries,
		...labelEntries,
		...leafEntry ? [leafEntry] : []
	];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-parent-session.ts
async function forkSessionTranscriptFromParent(params) {
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const target = params.targetStorePath ? resolveSqliteScope({
		sessionKey: params.sessionKey,
		storePath: params.targetStorePath
	}) : resolved;
	if (!(target.agentId !== resolved.agentId || (target.path ?? "") !== (resolved.path ?? ""))) return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = { status: "failed" };
		runOpenClawAgentWriteTransaction((database) => {
			result = forkSqliteParentTranscriptInTransaction(database, resolved, {
				enforceTokenLimit: params.enforceTokenLimit,
				parentEntry: params.parentEntry,
				parentSessionKey: params.parentSessionKey,
				forkFrom: params.forkFrom,
				targetSessionId: params.targetSessionId,
				targetSessionKey: params.sessionKey
			});
		}, toDatabaseOptions(resolved));
		return result;
	});
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	return await runExclusiveSqliteSessionWrite(target, async () => {
		const sessionId = params.targetSessionId ?? randomUUID();
		const targetScope = {
			...target,
			sessionId,
			sessionKey: normalizeSqliteSessionKey(params.sessionKey)
		};
		const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
		runOpenClawAgentWriteTransaction((database) => {
			writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
				parentSessionFile,
				source
			});
		}, toDatabaseOptions(target));
		return {
			status: "created",
			transcript: {
				sessionFile,
				sessionId
			}
		};
	});
}
/** Forks parent context into a child session entry using SQLite rows only. */
async function forkSessionEntryFromParentTarget(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const parentTarget = normalizeLifecycleTarget(params.parentTarget);
	const sessionTarget = normalizeLifecycleTarget(params.sessionTarget);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const parent = resolveLifecyclePrimaryEntry(database, parentTarget);
		if (!parent?.entry.sessionId) return { status: "missing-parent" };
		const base = resolveLifecyclePrimaryEntry(database, sessionTarget)?.entry ?? params.fallbackEntry;
		if (!base) return { status: "missing-entry" };
		if (params.skipForkWhen?.(cloneSessionEntry(base))) {
			const sessionEntry = await persistSqliteParentForkSkipPatch({
				entry: base,
				params,
				sessionTarget,
				patch: params.skipPatch?.(cloneSessionEntry(base)),
				resolved
			});
			return {
				status: "skipped",
				reason: "existing-entry",
				parentEntry: cloneSessionEntry(parent.entry),
				sessionEntry
			};
		}
		const transcriptParentTokens = typeof resolveFreshSessionTotalTokens(parent.entry) !== "number" && typeof parent.entry.sessionId === "string" && parent.entry.sessionId.length > 0 ? estimateTranscriptPromptTokens(loadTranscriptEventsFromDatabase(database, parent.entry.sessionId)) : void 0;
		const decision = planParentForkDecision(parent.entry, transcriptParentTokens);
		if (decision.status === "skip") {
			const patch = params.decisionSkipPatch?.({
				decision,
				entry: cloneSessionEntry(base),
				parentEntry: cloneSessionEntry(parent.entry)
			});
			const sessionEntry = await persistSqliteParentForkSkipPatch({
				entry: base,
				params,
				sessionTarget,
				patch,
				resolved
			});
			return {
				status: "skipped",
				reason: "decision-skip",
				parentEntry: cloneSessionEntry(parent.entry),
				sessionEntry,
				decision
			};
		}
		let result = { status: "failed" };
		const maintenancePlans = [];
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runOpenClawAgentWriteTransaction((writeDatabase) => {
			const freshParent = resolveLifecyclePrimaryEntry(writeDatabase, parentTarget)?.entry;
			if (!freshParent?.sessionId) {
				result = { status: "missing-parent" };
				return;
			}
			const freshBase = resolveLifecyclePrimaryEntry(writeDatabase, sessionTarget)?.entry ?? params.fallbackEntry;
			if (!freshBase) {
				result = { status: "missing-entry" };
				return;
			}
			const fork = forkSqliteParentTranscriptInTransaction(writeDatabase, resolved, {
				parentEntry: freshParent,
				parentSessionKey: parentTarget.canonicalKey,
				targetSessionKey: sessionTarget.canonicalKey
			});
			if (fork.status !== "created") {
				result = fork.status === "missing-parent" ? { status: "missing-parent" } : { status: "failed" };
				return;
			}
			const next = mergeSessionEntry(freshBase, {
				...params.patch?.({
					decision,
					entry: cloneSessionEntry(freshBase),
					fork: fork.transcript,
					parentEntry: cloneSessionEntry(freshParent)
				}),
				forkSource: {
					sessionKey: parentTarget.canonicalKey,
					sessionId: freshParent.sessionId
				},
				forkedFromParent: true,
				lifecycleRunId: void 0,
				sessionId: fork.transcript.sessionId,
				totalTokens: void 0,
				totalTokensFresh: false,
				totalTokensVersion: void 0
			});
			previousIdentity = readSessionIdentitySnapshot(writeDatabase, sessionTarget.storeKeys);
			writeSessionEntry(writeDatabase, sessionTarget.canonicalKey, next, { previousEntry: freshBase });
			rehomeSessionWindows(writeDatabase, sessionTarget.canonicalKey, sessionTarget.storeKeys);
			deleteLegacySessionEntryRows(writeDatabase, sessionTarget.storeKeys, sessionTarget.canonicalKey, { rehomeMembers: freshBase.sessionId === next.sessionId });
			maintenancePlans.push(applySessionEntryMaintenance(writeDatabase, {
				activeSessionKey: sessionTarget.canonicalKey,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				skipMaintenance: true,
				storePath: params.storePath
			}));
			currentIdentity = readSessionIdentitySnapshot(writeDatabase, sessionTarget.storeKeys);
			result = {
				status: "forked",
				decision,
				fork: fork.transcript,
				parentEntry: cloneSessionEntry(freshParent),
				sessionEntry: cloneSessionEntry(next)
			};
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		await finalizeSessionEntryMaintenancePlansBestEffort(resolved, maintenancePlans);
		return result;
	});
}
async function persistSqliteParentForkSkipPatch(params) {
	if (!params.patch) return cloneSessionEntry(params.entry);
	const next = preserveSqliteSameKeySessionRolloverLineage({
		next: mergeSessionEntry(params.entry, params.patch),
		previous: params.entry,
		sessionKey: params.sessionTarget.canonicalKey
	});
	const maintenancePlans = [];
	let previousIdentity = /* @__PURE__ */ new Map();
	let currentIdentity = /* @__PURE__ */ new Map();
	runOpenClawAgentWriteTransaction((database) => {
		previousIdentity = readSessionIdentitySnapshot(database, params.sessionTarget.storeKeys);
		writeSessionEntry(database, params.sessionTarget.canonicalKey, next, { previousEntry: params.entry });
		rehomeSessionWindows(database, params.sessionTarget.canonicalKey, params.sessionTarget.storeKeys);
		deleteLegacySessionEntryRows(database, params.sessionTarget.storeKeys, params.sessionTarget.canonicalKey, { rehomeMembers: params.entry.sessionId === next.sessionId });
		maintenancePlans.push(applySessionEntryMaintenance(database, {
			activeSessionKey: params.sessionTarget.canonicalKey,
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(params.resolved),
			skipMaintenance: true,
			storePath: params.params.storePath
		}));
		currentIdentity = readSessionIdentitySnapshot(database, params.sessionTarget.storeKeys);
	}, toDatabaseOptions(params.resolved));
	emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
	await finalizeSessionEntryMaintenancePlansBestEffort(params.resolved, maintenancePlans);
	return cloneSessionEntry(next);
}
/** Cleans scoped session lifecycle rows and associated SQLite transcript state. */
async function resolveSessionParentForkDecision(params) {
	const parentSessionId = typeof params.parentEntry.sessionId === "string" ? params.parentEntry.sessionId : "";
	if (!(typeof resolveFreshSessionTotalTokens(params.parentEntry) !== "number" && parentSessionId.length > 0)) return planParentForkDecision(params.parentEntry);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteStoreScope(params.storePath)));
	return planParentForkDecision(params.parentEntry, estimateTranscriptPromptTokens(loadTranscriptEventsFromDatabase(database, parentSessionId)));
}
function forkSqliteParentTranscriptInTransaction(database, resolved, params) {
	if (!params.parentEntry.sessionId) return { status: "missing-parent" };
	const source = resolveParentForkSourceTranscript(loadTranscriptEventsFromDatabase(database, params.parentEntry.sessionId), params.forkFrom);
	if (!source) return { status: "failed" };
	const limitDecision = resolveParentForkLimitDecision(params, source);
	if (limitDecision) return {
		status: "too-large",
		decision: limitDecision
	};
	const sessionId = params.targetSessionId ?? randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: normalizeSqliteSessionKey(params.targetSessionKey)
	};
	const parentSessionFile = formatLegacySqliteSessionMarkerForScope({
		...resolved,
		sessionId: params.parentEntry.sessionId,
		sessionKey: normalizeSqliteSessionKey(params.parentSessionKey)
	});
	const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
	writeSqliteForkedChildTranscriptInTransaction(database, targetScope, {
		parentSessionFile,
		source
	});
	return {
		status: "created",
		transcript: {
			sessionFile,
			sessionId
		}
	};
}
function resolveParentForkLimitDecision(params, source) {
	if (!params.enforceTokenLimit) return;
	const decision = planParentForkDecision(params.parentEntry, estimateTranscriptPromptTokens(source.branchEntries), { preferTranscriptEstimate: params.forkFrom === "last-completed" });
	return decision.status === "skip" ? decision : void 0;
}
function writeSqliteForkedChildTranscriptInTransaction(database, targetScope, params) {
	appendTranscriptEventsInTransaction(database, targetScope, buildForkedChildTranscriptEvents({
		parentSessionFile: params.parentSessionFile,
		source: params.source,
		targetSessionId: targetScope.sessionId
	}));
}
//#endregion
//#region src/config/sessions/cli-session-binding.ts
const CLAUDE_CLI_BACKEND_ID = "claude-cli";
const SHA256_HEX_PATTERN = /^[a-f0-9]{64}$/;
function normalizeCliSessionReseedReceipt(value) {
	const promptHash = normalizeOptionalString(value?.promptHash);
	const localSessionId = normalizeOptionalString(value?.localSessionId);
	const userTurnDisposition = value?.userTurnDisposition;
	if (value?.version !== 1 || !promptHash || !SHA256_HEX_PATTERN.test(promptHash) || !localSessionId || userTurnDisposition !== "persisted" && userTurnDisposition !== "omitted") return;
	return {
		version: 1,
		promptHash,
		localSessionId,
		userTurnDisposition
	};
}
/**
* Re-own omitted reseed receipts when a reset intentionally preserves the
* native CLI conversation. Persisted turns keep their old owner and fail open
* because their canonical user row belongs to the archived local transcript.
*/
function rebindCliSessionReseedReceiptsForReset(bindings, localSessionId) {
	const normalizedLocalSessionId = normalizeOptionalString(localSessionId);
	if (!bindings || !normalizedLocalSessionId) return bindings;
	let rebound;
	for (const [provider, binding] of Object.entries(bindings)) {
		const receipt = normalizeCliSessionReseedReceipt(binding.reseedReceipt);
		if (!receipt || receipt.userTurnDisposition !== "omitted") continue;
		rebound ??= { ...bindings };
		rebound[provider] = {
			...binding,
			reseedReceipt: {
				...receipt,
				localSessionId: normalizedLocalSessionId
			}
		};
	}
	return rebound ?? bindings;
}
/** Read the stored CLI session binding for a provider, including legacy Claude state. */
function getCliSessionBinding(entry, provider) {
	if (!entry) return;
	const normalized = normalizeProviderId(provider);
	const fromBindings = entry.cliSessionBindings?.[normalized];
	const bindingSessionId = normalizeOptionalString(fromBindings?.sessionId);
	if (bindingSessionId) return {
		sessionId: bindingSessionId,
		resumeCheckpointId: normalizeOptionalString(fromBindings?.resumeCheckpointId),
		...fromBindings?.forceReuse === true ? { forceReuse: true } : {},
		...fromBindings?.forkNextResume === true ? { forkNextResume: true } : {},
		authProfileId: normalizeOptionalString(fromBindings?.authProfileId),
		authEpoch: normalizeOptionalString(fromBindings?.authEpoch),
		authEpochVersion: fromBindings?.authEpochVersion,
		extraSystemPromptHash: normalizeOptionalString(fromBindings?.extraSystemPromptHash),
		messageToolPolicyHash: normalizeOptionalString(fromBindings?.messageToolPolicyHash),
		promptToolNamesHash: normalizeOptionalString(fromBindings?.promptToolNamesHash),
		cwdHash: normalizeOptionalString(fromBindings?.cwdHash),
		mcpConfigHash: normalizeOptionalString(fromBindings?.mcpConfigHash),
		mcpResumeHash: normalizeOptionalString(fromBindings?.mcpResumeHash),
		reseedReceipt: normalizeCliSessionReseedReceipt(fromBindings?.reseedReceipt)
	};
	const fromMap = entry.cliSessionIds?.[normalized];
	const normalizedFromMap = normalizeOptionalString(fromMap);
	if (normalizedFromMap) return { sessionId: normalizedFromMap };
	if (normalized === CLAUDE_CLI_BACKEND_ID) {
		const legacy = normalizeOptionalString(entry.claudeCliSessionId);
		if (legacy) return { sessionId: legacy };
	}
}
/** Read just the reusable CLI session ID for a provider. */
function getCliSessionId(entry, provider) {
	return getCliSessionBinding(entry, provider)?.sessionId;
}
function clearAllCliSessions(entry) {
	entry.cliSessionBindings = void 0;
	entry.cliSessionIds = void 0;
	entry.claudeCliSessionId = void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-anchor.ts
/** Reads one active message identity from the caller's current SQLite transaction. */
function readActiveTranscriptEntryAnchorInTransaction(params) {
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQueryTakeFirstSync(params.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).select([
		"identity.seq",
		"identity.parent_id",
		"identity.message_idempotency_key",
		"active.message_position",
		"rewrite.generation"
	]).where("identity.session_id", "=", params.resolved.sessionId).where("identity.event_id", "=", params.entryId).limit(1));
	if (row?.message_position === null || row?.message_position === void 0) return;
	const idempotencyKey = row.message_idempotency_key ?? readMessageIdempotencyKey(params.message);
	return Object.freeze({
		agentId: params.resolved.agentId,
		sessionId: params.resolved.sessionId,
		sessionKey: params.resolved.sessionKey,
		storePath: params.database.path,
		generation: row.generation,
		entryId: params.entryId,
		rawSeq: row.seq,
		effectiveParentId: row.parent_id,
		activeMessagePosition: row.message_position,
		...idempotencyKey ? { idempotencyKey } : {}
	});
}
/** Reads one active message identity from the authoritative SQLite projection. */
function readActiveTranscriptEntryAnchor(params) {
	const resolved = resolveSqliteTranscriptScope(params);
	return readActiveTranscriptEntryAnchorInTransaction({
		database: openOpenClawAgentDatabase(toDatabaseOptions(resolved)),
		resolved,
		entryId: params.entryId
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-parent.ts
/** Resolves the effective parent for a transcript message append inside the write transaction. */
function resolveTranscriptMessageAppendParent(database, sessionId, options) {
	const tailId = readActiveTranscriptAppendParentId(database, sessionId);
	if (options.parentId === void 0) return tailId;
	if (options.appendIntent !== "active-branch" || tailId === options.parentId) return options.parentId;
	const db = getSessionKysely(database.db);
	const countRow = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select((expression) => expression.fn.countAll().as("count")).where("session_id", "=", sessionId));
	const maxAncestors = Number(countRow?.count ?? 0);
	let ancestorId = tailId;
	for (let depth = 0; depth <= maxAncestors; depth += 1) {
		if (ancestorId === options.parentId) return tailId;
		if (ancestorId === null) break;
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities").select("parent_id").where("session_id", "=", sessionId).where("event_id", "=", ancestorId));
		if (!row) break;
		ancestorId = row.parent_id;
	}
	return options.parentId;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-message-append.ts
var TranscriptTurnAdmissionConflictError = class extends Error {
	constructor(idempotencyKey) {
		super(`Transcript idempotency key "${idempotencyKey}" conflicts with the admitted message.`);
		this.name = "TranscriptTurnAdmissionConflictError";
	}
};
function messagesMatchForIdempotentReplay(stored, candidate) {
	const serializedShape = (message) => {
		if (!isRecord(message)) return message;
		const { timestamp: _timestamp, ...stable } = message;
		const serialized = JSON.stringify(stable);
		return serialized === void 0 ? void 0 : JSON.parse(serialized);
	};
	return isDeepStrictEqual(serializedShape(stored), serializedShape(candidate));
}
function appendTranscriptMessageInTransaction(database, resolved, options) {
	const serializeForStorage = (message) => options.messageAlreadyRedacted ? message : redactTranscriptMessageForStorage(message, options);
	const readAnchor = (params) => readActiveTranscriptEntryAnchorInTransaction({
		database,
		resolved,
		entryId: params.messageId,
		message: params.message
	});
	const existingAppendResult = (found) => {
		const anchor = readAnchor(found);
		return {
			appended: false,
			...anchor ? { anchor } : {},
			effectiveParentId: readTranscriptIdentityByEventId(database, resolved.sessionId, found.messageId)?.parentId ?? null,
			message: found.message,
			messageId: found.messageId
		};
	};
	const idempotencyKey = readMessageIdempotencyKey(options.message);
	if (idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, serializeForStorage(options.message))) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	const prepared = options.prepareMessageAfterIdempotencyCheck ? options.prepareMessageAfterIdempotencyCheck(options.message) : options.message;
	if (prepared === void 0) return;
	const messageId = options.eventId ?? randomUUID();
	const now = options.now ?? Date.now();
	const finalMessage = serializeForStorage(prepared);
	ensureTranscriptHeader(database, resolved, options.cwd, now);
	const parentId = resolveTranscriptMessageAppendParent(database, resolved.sessionId, options);
	const appended = appendTranscriptEventInTransaction(database, resolved, {
		type: "message",
		id: messageId,
		parentId: parentId ?? null,
		timestamp: resolveTimestampMsToIsoString(now),
		message: finalMessage
	}, { dedupeByMessageIdempotency: options.idempotencyLookup !== "caller-checked" && options.idempotencyLookup !== "scan-assistant" });
	if (!appended && idempotencyKey && options.idempotencyLookup !== "caller-checked") {
		const existing = readTranscriptMessageByScopedIdempotencyKey(database, resolved, idempotencyKey, options.idempotencyLookup);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey);
			return existingAppendResult(existing);
		}
	}
	if (!appended) {
		const existing = readTranscriptMessageByEventId(database, resolved, messageId);
		if (existing) {
			if (!options.prepareMessageAfterIdempotencyCheck && !messagesMatchForIdempotentReplay(existing.message, finalMessage)) throw new TranscriptTurnAdmissionConflictError(idempotencyKey ?? `event:${messageId}`);
			return existingAppendResult(existing);
		}
	}
	if (!appended) throw new Error(`SQLite transcript append did not insert message ${messageId}.`);
	const anchor = readAnchor({
		message: finalMessage,
		messageId
	});
	return {
		appended: true,
		...anchor ? { anchor } : {},
		effectiveParentId: parentId ?? null,
		message: finalMessage,
		messageId
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-mirror.ts
const TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE = 900;
/** Returns raw events only when the transcript identity projection is not current. */
function loadTranscriptEventsForMirrorFallback(database, sessionId) {
	const db = getSessionKysely(database.db);
	const latest = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	if (!latest) return [];
	const state = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", sessionId));
	if (state && state.needs_rebuild === 0 && state.indexed_seq === latest.seq) return;
	return loadTranscriptEventsFromDatabase(database, sessionId);
}
/** Reads the bounded identity facts needed by transcript mirrors. */
function readTranscriptMirrorFacts(database, resolved, params) {
	return runSqliteDeferredTransactionSync(database.db, () => readTranscriptMirrorFactsInSnapshot(database, resolved, params), {
		databaseLabel: database.path,
		operationLabel: "session.transcript.mirror-facts"
	});
}
/** Reads mirror facts after the caller has established one SQLite snapshot. */
function readTranscriptMirrorFactsInSnapshot(database, resolved, params) {
	const idempotencyKeys = [...new Set(params.idempotencyKeys)];
	const fallbackEvents = loadTranscriptEventsForMirrorFallback(database, resolved.sessionId);
	if (fallbackEvents !== void 0) return readMirrorFactsFromEvents(fallbackEvents, new Set(idempotencyKeys));
	const db = getSessionKysely(database.db);
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	for (let offset = 0; offset < idempotencyKeys.length; offset += TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE) {
		const batch = idempotencyKeys.slice(offset, offset + TRANSCRIPT_MIRROR_KEY_QUERY_BATCH_SIZE);
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.event_id",
			"identity.message_idempotency_key",
			"event.event_json"
		]).where("identity.session_id", "=", resolved.sessionId).where("identity.message_idempotency_key", "in", batch).orderBy("identity.seq", "asc")).rows;
		for (const row of rows) {
			const idempotencyKey = row.message_idempotency_key;
			if (!idempotencyKey) continue;
			facts.existingIdempotencyKeys.add(idempotencyKey);
			const anchor = readActiveTranscriptEntryAnchorInTransaction({
				database,
				resolved,
				entryId: row.event_id
			});
			if (anchor) facts.anchorsByIdempotencyKey.set(idempotencyKey, anchor);
			const message = readTranscriptEventMessage(JSON.parse(row.event_json));
			if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
		}
	}
	return facts;
}
/** Extracts supplied mirror identities from authoritative transcript events. */
function readMirrorFactsFromEvents(events, candidateKeys) {
	const facts = {
		anchorsByIdempotencyKey: /* @__PURE__ */ new Map(),
		existingIdempotencyKeys: /* @__PURE__ */ new Set(),
		messagesByIdempotencyKey: /* @__PURE__ */ new Map()
	};
	for (const event of events) {
		const message = readTranscriptEventMessage(event);
		const idempotencyKey = readMessageIdempotencyKey(message);
		if (!idempotencyKey || !candidateKeys.has(idempotencyKey)) continue;
		facts.existingIdempotencyKeys.add(idempotencyKey);
		if (message !== void 0) facts.messagesByIdempotencyKey.set(idempotencyKey, message);
	}
	return facts;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-sequences.ts
const committedTranscriptMessageSequences = /* @__PURE__ */ new WeakMap();
/** Reads the visible-message sequence captured from the final active branch. */
function readCommittedTranscriptMessageSequence(message) {
	return committedTranscriptMessageSequences.get(message);
}
/** Captures atomic turn cursors from the final projection before SQLite commits. */
function rememberCommittedTranscriptMessageSequencesInTransaction(database, sessionId, messages) {
	const appendedMessages = messages.filter((message) => message.appended);
	for (const message of appendedMessages) committedTranscriptMessageSequences.delete(message);
	if (appendedMessages.length === 0) return;
	const db = getNodeSqliteKysely(database.db);
	if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select("needs_rebuild").where("session_id", "=", sessionId))?.needs_rebuild !== 0) return;
	for (const message of appendedMessages) {
		const identity = readTranscriptIdentityByEventId(database, sessionId, message.messageId);
		if (!identity) continue;
		const active = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", sessionId).where("event_seq", "=", identity.seq));
		if (active?.message_position !== null && active?.message_position !== void 0) committedTranscriptMessageSequences.set(message, active.message_position + 1);
	}
}
/** Resolves final cursors while an ordinary turn still owns its writer transaction. */
function rememberCommittedTranscriptMessageSequences(scope, messages) {
	if (messages.length === 0 || !scope.agentId || !scope.sessionId || !scope.sessionKey) return;
	const resolved = resolveSqliteTranscriptScope({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		sessionKey: scope.sessionKey,
		...scope.storePath ? { storePath: scope.storePath } : {}
	});
	rememberCommittedTranscriptMessageSequencesInTransaction(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionId, messages);
}
//#endregion
//#region src/config/sessions/session-transcript-turn-state.ts
function sessionMatchesExpectedTranscriptTurn(selected, expected) {
	const expectedState = expected.expectedSessionState;
	return Boolean(selected && selected.entry.sessionId === expected.expectedSessionId && (expected.expectedLifecycleRevision === void 0 || selected.entry.lifecycleRevision === expected.expectedLifecycleRevision) && (expected.expectedWriterRunId === void 0 || selected.entry.activeWriterRunId === expected.expectedWriterRunId) && (expectedState === void 0 || selected.entry.abortedLastRun === expectedState.abortedLastRun && selected.entry.mainRestartRecovery?.cycleId === expectedState.mainRestartRecoveryCycleId && selected.entry.mainRestartRecovery?.revision === expectedState.mainRestartRecoveryRevision && selected.entry.restartRecoveryBeforeAgentReplyState === expectedState.restartRecoveryBeforeAgentReplyState && selected.entry.restartRecoveryDeliveryReceiptState === expectedState.restartRecoveryDeliveryReceiptState && selected.entry.restartRecoveryDeliveryToolCallId === expectedState.restartRecoveryDeliveryToolCallId && selected.entry.restartRecoveryDeliveryRequestFingerprint === expectedState.restartRecoveryDeliveryRequestFingerprint && selected.entry.restartRecoveryDeliveryRunId === expectedState.restartRecoveryDeliveryRunId && selected.entry.restartRecoveryDeliverySourceRunId === expectedState.restartRecoveryDeliverySourceRunId && selected.entry.restartRecoveryRequesterAccountId === expectedState.restartRecoveryRequesterAccountId && selected.entry.restartRecoveryRequesterSenderId === expectedState.restartRecoveryRequesterSenderId && selected.entry.restartRecoverySameChannelThreadRequired === expectedState.restartRecoverySameChannelThreadRequired && selected.entry.restartRecoverySourceIngress === expectedState.restartRecoverySourceIngress && selected.entry.restartRecoverySourceReplyDeliveryMode === expectedState.restartRecoverySourceReplyDeliveryMode && sameRestartRecoveryTerminalRunIds(selected.entry.restartRecoveryTerminalRunIds, expectedState.restartRecoveryTerminalRunIds) && selected.entry.status === expectedState.status));
}
function buildExpectedTranscriptTurnSessionPatch(params) {
	const appendedCount = params.appendedMessages.filter((message) => message.appended).length;
	const acceptedMessage = appendedCount > 0 || params.expectedSessionState !== void 0 && params.appendedMessages.some((message) => !message.appended);
	const touchUpdatedAt = params.touchSessionEntry === true && appendedCount > 0 ? Date.now() : 0;
	const restartRecoveryTerminalRunIds = params.sessionLifecyclePatch?.restartRecoveryTerminalRunIds ? mergeRestartRecoveryTerminalRunIds(params.currentEntry.restartRecoveryTerminalRunIds, params.sessionLifecyclePatch.restartRecoveryTerminalRunIds) : void 0;
	return {
		...acceptedMessage ? params.sessionLifecyclePatch : void 0,
		...acceptedMessage && restartRecoveryTerminalRunIds ? { restartRecoveryTerminalRunIds } : {},
		...touchUpdatedAt > 0 ? { updatedAt: Math.max(params.currentEntry.updatedAt ?? 0, params.sessionLifecyclePatch?.updatedAt ?? 0, touchUpdatedAt) } : {}
	};
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-write.ts
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
async function replaceTranscriptEvents(scope, events) {
	const resolved = resolveSqliteTranscriptScope(scope);
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		}, toDatabaseOptions(resolved));
	});
}
/** Rewrites exact transcript rows after atomically validating their generation and bytes. */
async function rewriteTranscriptEventRowsExact(scope, params) {
	if (params.rows.length === 0) return null;
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result = null;
		runOpenClawAgentWriteTransaction((database) => {
			const currentGeneration = readTranscriptGenerationInTransaction(database, resolved.sessionId) ?? null;
			const initialGenerationMaterialized = params.allowInitialGenerationMaterialization === true && params.expectedGeneration === null;
			if (currentGeneration !== params.expectedGeneration && !initialGenerationMaterialized) return;
			rewriteSqliteTranscriptEventRowsInTransaction(database, resolved, params.rows);
			const generation = readTranscriptGenerationInTransaction(database, resolved.sessionId);
			if (generation) result = { generation };
		}, toDatabaseOptions(resolved));
		return result;
	});
}
/** Fully replaces rows for one transcript synchronously for sync session runtimes. */
function replaceTranscriptEventsSync(scope, events) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let replaced = false;
	runOpenClawAgentWriteTransaction((database) => {
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh || fresh.entry.sessionId !== resolved.sessionId || fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) return;
		replaceSqliteTranscriptEventsInTransaction(database, resolved, events);
		replaced = true;
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && !replaced) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return replaced;
}
async function trimTranscriptForManualCompact(scope, selectRetainedLines, options = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const snapshotRows = readTranscriptEventRows(database, resolved.sessionId);
		const sessionSnapshot = readSessionEntrySelectionSnapshot(database, resolved.sessionKey, true);
		const lines = snapshotRows.map((row) => row.eventJson);
		const retainedLines = selectRetainedLines(lines);
		if (!retainedLines) return { trimmed: false };
		if (sessionSnapshot.selected?.entry.sessionId !== resolved.sessionId) throw new Error(`Cannot compact SQLite transcript ${resolved.sessionId} without its current session entry`);
		const retainedEvents = retainedLines.map((line) => JSON.parse(line));
		const archivedPath = writeTranscriptArchive({
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
			content: serializeJsonlLines(lines),
			reason: "bak",
			sessionId: resolved.sessionId
		});
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runOpenClawAgentWriteTransaction((writeDatabase) => {
			assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotRows);
			const freshSessionSnapshot = readSessionEntrySelectionSnapshot(writeDatabase, resolved.sessionKey, true);
			assertSessionEntrySelectionUnchanged(sessionSnapshot, freshSessionSnapshot, "session.transcript.manual-compact");
			const freshEntry = freshSessionSnapshot.selected?.entry;
			if (!freshEntry || freshEntry.sessionId !== resolved.sessionId) throw new Error(`SQLite session changed before compacting ${resolved.sessionId}`);
			const identityKeys = collectSessionEntryLookupKeys(writeDatabase, resolved.sessionKey);
			previousIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
			replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, retainedEvents);
			const nextEntry = cloneSessionEntry(freshEntry);
			delete nextEntry.contextBudgetStatus;
			delete nextEntry.inputTokens;
			delete nextEntry.outputTokens;
			delete nextEntry.totalTokens;
			delete nextEntry.totalTokensFresh;
			delete nextEntry.totalTokensVersion;
			clearAllCliSessions(nextEntry);
			nextEntry.updatedAt = options.nowMs ?? Date.now();
			writeSessionEntry(writeDatabase, resolved.sessionKey, nextEntry, { previousEntry: freshEntry });
			currentIdentity = readSessionIdentitySnapshot(writeDatabase, identityKeys);
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return {
			archivedPath,
			kept: retainedLines.length,
			trimmed: true
		};
	});
}
/** Appends one raw transcript event to the additive SQLite transcript store. */
async function appendTranscriptEvent(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const resolved = resolveSqliteTranscriptScope(scope);
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options));
		}, toDatabaseOptions(resolved));
	});
}
/** Appends one raw non-message transcript event synchronously for sync session runtimes. */
function appendTranscriptEventSync(scope, event, options = {}) {
	assertNonMessageTranscriptEvent(event);
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let result = ok(false);
	runOpenClawAgentWriteTransaction((database) => {
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh) {
			result = err({
				code: "session-entry-missing",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		if (fresh.entry.sessionId !== resolved.sessionId) {
			result = err({
				actualSessionId: fresh.entry.sessionId,
				code: "session-rebound",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		if (fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) {
			result = err({
				actualSessionId: fresh.entry.sessionId,
				code: "session-rebound",
				expectedSessionId: resolved.sessionId,
				sessionKey: resolved.sessionKey
			});
			return;
		}
		result = ok(appendTranscriptEventInTransaction(database, resolved, resolveTranscriptEventAppendParent(database, resolved.sessionId, event, options)));
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && !result.ok) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return result;
}
function resolveTranscriptEventAppendParent(database, sessionId, event, options) {
	if (options.appendIntent !== "active-branch" || !event || typeof event !== "object" || Array.isArray(event) || !("parentId" in event)) return event;
	const parentId = event.parentId;
	if (parentId !== null && typeof parentId !== "string") return event;
	const effectiveParentId = resolveTranscriptMessageAppendParent(database, sessionId, {
		appendIntent: "active-branch",
		parentId
	});
	return effectiveParentId === parentId ? event : {
		...event,
		parentId: effectiveParentId
	};
}
/** Appends a guarded transcript turn and touches its session row in one queued write. */
async function appendExpectedSessionTranscriptTurn(scope, options) {
	const resolved = resolveSqliteTranscriptScope({
		...scope,
		sessionId: options.expectedSessionId
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), resolved.sessionKey);
		if (!sessionMatchesExpectedTranscriptTurn(preparedEntry, options)) return sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		const messages = await selectAppendableSqliteTranscriptTurnMessages({
			agentId: resolved.agentId,
			sessionId: options.expectedSessionId,
			sessionKey: resolved.sessionKey,
			...scope.storePath ? { storePath: scope.storePath } : {}
		}, options.messages);
		let result = sqliteSessionTranscriptTurnRebound(preparedEntry, options.sessionFile);
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const fresh = readSessionEntryRow(transactionDb, resolved.sessionKey);
			if (!sessionMatchesExpectedTranscriptTurn(fresh, options)) {
				result = sqliteSessionTranscriptTurnRebound(fresh, options.sessionFile);
				return;
			}
			const appendedMessages = [];
			for (const append of messages) {
				const { shouldAppend: _shouldAppend, ...appendOptions } = append;
				const appended = appendTranscriptMessageInTransaction(transactionDb, resolved, {
					...appendOptions,
					messageAlreadyRedacted: options.atomicGroup === true,
					...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
					...append.config ?? options.config ? { config: append.config ?? options.config } : {}
				});
				if (appended) appendedMessages.push(appended);
			}
			if (options.atomicGroup && (appendedMessages.length !== messages.length || appendedMessages.some((message) => message.appended) !== appendedMessages.every((message) => message.appended))) throw new Error("SQLite transcript batch was not wholly inserted or replayed");
			rememberCommittedTranscriptMessageSequencesInTransaction(transactionDb, resolved.sessionId, appendedMessages);
			const sessionPatch = buildExpectedTranscriptTurnSessionPatch({
				appendedMessages,
				currentEntry: fresh.entry,
				expectedSessionState: options.expectedSessionState,
				sessionFile: options.sessionFile,
				sessionLifecyclePatch: options.sessionLifecyclePatch,
				touchSessionEntry: options.touchSessionEntry
			});
			const next = Object.keys(sessionPatch).length > 0 ? mergeSessionEntry(fresh.entry, sessionPatch) : fresh.entry;
			if (next !== fresh.entry) {
				const identityKeys = collectSessionEntryLookupKeys(transactionDb, resolved.sessionKey);
				previousIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys);
				writeSessionEntry(transactionDb, resolved.sessionKey, next);
				deleteLegacySessionEntryRows(transactionDb, fresh.legacyKeys, resolved.sessionKey);
				currentIdentity = readSessionIdentitySnapshot(transactionDb, identityKeys);
			}
			result = {
				appendedMessages,
				sessionEntry: cloneSessionEntry(next),
				sessionFile: options.sessionFile
			};
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return result;
	});
}
function sqliteSessionTranscriptTurnRebound(selected, sessionFile) {
	return {
		appendedMessages: [],
		rejectedReason: "session-rebound",
		sessionEntry: selected?.entry,
		sessionFile
	};
}
async function selectAppendableSqliteTranscriptTurnMessages(context, messages) {
	const selected = [];
	for (const append of messages) if (append.shouldAppend ? await append.shouldAppend(context) : true) selected.push(append);
	return selected;
}
async function appendTranscriptMessage(scope, options) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let result;
		runOpenClawAgentWriteTransaction((database) => {
			result = appendTranscriptMessageInTransaction(database, resolved, options);
		}, toDatabaseOptions(resolved));
		return result;
	});
}
/** Appends one transcript message synchronously for sync session runtimes. */
function appendTranscriptMessageSync(scope, options) {
	const fencedScope = withOwnedSessionTranscriptWriterFence(scope);
	const resolved = resolveSqliteTranscriptScope(fencedScope);
	let result;
	runOpenClawAgentWriteTransaction((database) => {
		const fresh = readSessionEntryRow(database, resolved.sessionKey);
		if (!fresh || fresh.entry.sessionId !== resolved.sessionId || fencedScope.expectedLifecycleRevision !== void 0 && fresh.entry.lifecycleRevision !== fencedScope.expectedLifecycleRevision || fencedScope.expectedWriterRunId !== void 0 && fresh.entry.activeWriterRunId !== fencedScope.expectedWriterRunId) return;
		result = appendTranscriptMessageInTransaction(database, resolved, options);
	}, toDatabaseOptions(resolved));
	if (fencedScope.expectedWriterRunId !== void 0 && result === void 0) throw new SessionTranscriptWriterClaimReboundError(scope.sessionKey);
	return result;
}
/** Runs read/append transcript work under one SQLite writer-queue critical section. */
async function withTranscriptWriteLock(scope, run) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		let transcriptSnapshot;
		return await run({
			readEvents: async () => {
				const snapshot = readTranscriptSnapshot(database, resolved.sessionId);
				transcriptSnapshot = {
					kind: "current",
					rows: snapshot.rows
				};
				return snapshot.events;
			},
			readMessageFacts: async (params) => readTranscriptMirrorFacts(database, resolved, params),
			replaceEvents: async (events) => {
				if (transcriptSnapshot?.kind === "stale") throw new SqliteTranscriptMutationConflictError(resolved.sessionId);
				const expectedSnapshot = transcriptSnapshot?.rows;
				transcriptSnapshot = {
					kind: "current",
					rows: runOpenClawAgentWriteTransaction((writeDatabase) => {
						if (expectedSnapshot !== void 0) assertSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, expectedSnapshot);
						replaceSqliteTranscriptEventsInTransaction(writeDatabase, resolved, events);
						return readTranscriptEventRows(writeDatabase, resolved.sessionId);
					}, toDatabaseOptions(resolved))
				};
			},
			appendMessage: async (options) => {
				let result;
				const snapshotState = transcriptSnapshot;
				let nextSnapshotState = snapshotState;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					const snapshotStillCurrent = snapshotState?.kind === "current" ? isSqliteTranscriptSnapshotUnchanged(writeDatabase, resolved.sessionId, snapshotState.rows) : false;
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (snapshotState?.kind === "current") nextSnapshotState = snapshotStillCurrent ? {
						kind: "current",
						rows: readTranscriptEventRows(writeDatabase, resolved.sessionId)
					} : { kind: "stale" };
				}, toDatabaseOptions(resolved));
				transcriptSnapshot = nextSnapshotState;
				return result;
			},
			appendMessageWithMessageSequence: async (options) => {
				let result;
				let messageSeq;
				runOpenClawAgentWriteTransaction((writeDatabase) => {
					result = appendTranscriptMessageInTransaction(writeDatabase, resolved, options);
					if (result) {
						rememberCommittedTranscriptMessageSequencesInTransaction(writeDatabase, resolved.sessionId, [result]);
						messageSeq = readCommittedTranscriptMessageSequence(result);
					}
				}, toDatabaseOptions(resolved));
				return {
					...messageSeq !== void 0 ? { messageSeq } : {},
					result
				};
			}
		});
	});
}
/** Runs synchronous transcript work under one writer queue and SQLite transaction. */
async function withTranscriptWriteTransaction(scope, run) {
	const resolved = resolveSqliteTranscriptScope(scope);
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction(() => run({
		agentId: resolved.agentId,
		sessionId: resolved.sessionId,
		sessionKey: resolved.sessionKey,
		storePath: resolved.path ?? scope.storePath ?? resolveOpenClawAgentSqlitePath({
			agentId: resolved.agentId,
			env: resolved.env
		})
	}), toDatabaseOptions(resolved), { operationLabel: "session.transcript.batch" }));
}
function isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	const current = readTranscriptEventRows(database, sessionId);
	return current.length === expected.length && current.every((row, index) => row.seq === expected[index]?.seq && row.eventJson === expected[index]?.eventJson);
}
function assertSqliteTranscriptSnapshotUnchanged(database, sessionId, expected) {
	if (!isSqliteTranscriptSnapshotUnchanged(database, sessionId, expected)) throw new SqliteTranscriptMutationConflictError(sessionId);
}
function assertNonMessageTranscriptEvent(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	if (event.type === "message") throw new Error("appendTranscriptEvent cannot write message transcript records; use appendTranscriptMessage instead.");
}
//#endregion
//#region src/config/sessions/session-accessor.entry-mutation.ts
function projectSessionEntryForPersistenceRevision(params) {
	const snapshot = params.entry.skillsSnapshot;
	const stripped = snapshot?.resolvedSkills === void 0 ? params.entry : {
		...params.entry,
		skillsSnapshot: (({ resolvedSkills: _drop, ...rest }) => rest)(snapshot)
	};
	return projectSessionStoreForPersistence({
		storePath: params.storePath,
		store: { entry: stripped }
	}).store.entry ?? stripped;
}
async function forkSessionFromParentTranscript(params) {
	return await forkSessionTranscriptFromParent(params);
}
/**
* Creates or updates one session entry and initializes its transcript header as
* one SQLite-backed lifecycle operation. Callers do not compose row creation,
* transcript initialization, rollback, and normalized session identity.
*/
async function createSessionEntryWithTranscript(scope, createEntry, options = {}) {
	const storePath = resolveAccessStorePath(scope);
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	const store = Object.fromEntries(listSessionEntriesCore({
		agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: scope.sessionKey
	});
	const created = await createEntry({
		existingEntry: resolved.existing ? { ...resolved.existing } : void 0,
		sessionEntries: cloneSessionEntries(store)
	});
	if (!created.ok) return {
		ok: false,
		error: created.error,
		phase: "entry"
	};
	try {
		options.commitGuard?.();
		await appendTranscriptEvent({
			agentId,
			sessionId: created.entry.sessionId,
			sessionKey: resolved.normalizedKey,
			storePath
		}, createSessionTranscriptHeader({
			cwd: options.cwd,
			sessionId: created.entry.sessionId
		}));
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err),
			phase: "transcript"
		};
	}
	const entry = created.entry;
	await applySessionEntryLifecycleMutation({
		agentId,
		storePath,
		removals: resolved.legacyKeys.map((sessionKey) => ({ sessionKey })),
		upserts: [{
			sessionKey: resolved.normalizedKey,
			entry
		}],
		skipMaintenance: true,
		...options.commitGuard ? { beforeCommitInTransaction: options.commitGuard } : {}
	});
	return {
		ok: true,
		entry,
		sessionFile: resolved.normalizedKey
	};
}
function cloneSessionEntries(store) {
	return Object.fromEntries(Object.entries(store).map(([sessionKey, entry]) => [sessionKey, { ...entry }]));
}
function collectSessionEntryKeys(...entries) {
	const keys = /* @__PURE__ */ new Set();
	for (const entry of entries) for (const key of Object.keys(entry)) keys.add(key);
	return [...keys];
}
function sessionEntryFieldEqual(left, right) {
	return Object.is(left, right) || isDeepStrictEqual(left, right);
}
function sessionEntryFieldUnset(hasValue, value) {
	return !hasValue || value === void 0;
}
function sessionEntryFieldUnchanged(params) {
	const { leftHasValue, leftValue, rightHasValue, rightValue } = params;
	if (sessionEntryFieldUnset(leftHasValue, leftValue) && sessionEntryFieldUnset(rightHasValue, rightValue)) return true;
	return leftHasValue === rightHasValue && sessionEntryFieldEqual(leftValue, rightValue);
}
function mergeConcurrentReplySessionMetadata(params) {
	const { currentEntry, preparedEntry, snapshotEntry } = params;
	if (!snapshotEntry || preparedEntry.sessionId !== snapshotEntry.sessionId) return preparedEntry;
	const merged = { ...preparedEntry };
	const mergedFields = merged;
	for (const key of collectSessionEntryKeys(currentEntry, preparedEntry, snapshotEntry)) {
		const currentHasValue = Object.hasOwn(currentEntry, key);
		const snapshotHasValue = Object.hasOwn(snapshotEntry, key);
		const preparedHasValue = Object.hasOwn(preparedEntry, key);
		const currentValue = currentEntry[key];
		const snapshotValue = snapshotEntry[key];
		const preparedValue = preparedEntry[key];
		const currentChanged = !sessionEntryFieldUnchanged({
			leftHasValue: currentHasValue,
			leftValue: currentValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		const preparedKeptSnapshot = sessionEntryFieldUnchanged({
			leftHasValue: preparedHasValue,
			leftValue: preparedValue,
			rightHasValue: snapshotHasValue,
			rightValue: snapshotValue
		});
		if (currentChanged && preparedKeptSnapshot) if (currentHasValue) mergedFields[key] = currentValue;
		else delete mergedFields[key];
	}
	return merged;
}
function createReplySessionInitializationRevision(params) {
	const { entry, storePath } = params;
	if (!entry) return JSON.stringify(null);
	const projected = projectSessionEntryForPersistenceRevision({
		storePath,
		entry
	});
	return JSON.stringify({ sessionId: projected.sessionId });
}
function resolveInitializedReplySessionEntry(params) {
	return params.sessionEntry;
}
/** Updates an existing entry only; returns null when the session is absent. */
async function updateSessionEntry(scope, update, options = {}) {
	return await patchSessionEntryCore(scope, update, options);
}
/** Resolves one abort target identity without exposing the mutable store. */
function resolveSessionAbortTarget(scope) {
	const entry = loadSessionEntry(scope);
	if (!entry) return null;
	return {
		entry: { ...entry },
		sessionId: entry.sessionId,
		sessionKey: normalizeStoreSessionKey(scope.sessionKey)
	};
}
/**
* Resolves, marks, touches, and canonicalizes one abort target entry as a
* storage-sized operation. Runtime abort side effects remain with callers.
*/
async function markSessionAbortTarget(params) {
	let resolvedTarget = null;
	try {
		const sessionKey = normalizeStoreSessionKey(params.scope.sessionKey);
		const updated = await patchSessionEntryCore(params.scope, (currentEntry) => {
			resolvedTarget = {
				entry: { ...currentEntry },
				persisted: false,
				sessionId: currentEntry.sessionId,
				sessionKey
			};
			const entry = {
				...currentEntry,
				abortedLastRun: true,
				updatedAt: params.now?.() ?? Date.now()
			};
			applySessionAbortCutoff(entry, params.resolveAbortCutoff?.({
				entry: { ...currentEntry },
				sessionKey
			}));
			return entry;
		}, {
			replaceEntry: true,
			skipMaintenance: true
		});
		return updated ? {
			entry: { ...updated },
			persisted: true,
			sessionId: updated.sessionId,
			sessionKey
		} : null;
	} catch (error) {
		const fallbackTarget = resolvedTarget;
		if (fallbackTarget) return {
			entry: fallbackTarget.entry,
			persisted: fallbackTarget.persisted,
			sessionId: fallbackTarget.sessionId,
			sessionKey: fallbackTarget.sessionKey,
			persistenceError: formatErrorMessage(error)
		};
		throw error;
	}
}
function applySessionAbortCutoff(entry, cutoff) {
	entry.abortCutoffMessageSid = cutoff?.messageSid;
	entry.abortCutoffTimestamp = cutoff?.timestamp;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-recovery.ts
/**
* Atomically clones a tombstoned transcript, creates its successor, and records
* the revisioned source archive/link transition in the same agent database.
*/
async function recoverSessionEntryFromRestartTombstone(params) {
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId: params.agentId });
	const sourceTarget = normalizeLifecycleTarget({
		...params.sourceTarget,
		storeKeys: [...params.sourceTarget.storeKeys]
	});
	const successorTarget = normalizeLifecycleTarget({
		...params.successorTarget,
		storeKeys: [...params.successorTarget.storeKeys]
	});
	const maintenancePlans = [];
	let previousIdentity = /* @__PURE__ */ new Map();
	let currentIdentity = /* @__PURE__ */ new Map();
	let result = {
		status: "conflict",
		reason: "source-changed"
	};
	await runExclusiveSqliteSessionWrite(resolved, async () => {
		runOpenClawAgentWriteTransaction((database) => {
			const source = resolveLifecyclePrimaryEntry(database, sourceTarget)?.entry;
			const recovery = source?.mainRestartRecovery;
			const tombstone = recovery?.tombstone;
			if (!source?.sessionId || !recovery || !tombstone) {
				result = {
					status: "conflict",
					reason: "not-tombstoned"
				};
				return;
			}
			const recoveredSessionKey = tombstone.recoveredSessionKey;
			const recoveredSessionId = tombstone.recoveredSessionId;
			if (recoveredSessionKey || recoveredSessionId) {
				if (!recoveredSessionKey || !recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				const linked = resolveLifecyclePrimaryEntry(database, normalizeLifecycleTarget({
					canonicalKey: recoveredSessionKey,
					storeKeys: [recoveredSessionKey]
				}))?.entry;
				if (!linked || linked.sessionId !== recoveredSessionId) {
					result = {
						status: "conflict",
						reason: "successor-missing"
					};
					return;
				}
				result = {
					status: "existing",
					sourceEntry: cloneSessionEntry(source),
					successorEntry: cloneSessionEntry(linked),
					successorKey: recoveredSessionKey
				};
				return;
			}
			if (source.sessionId !== params.expected.sessionId || recovery.cycleId !== params.expected.cycleId || recovery.revision !== params.expected.revision || source.pluginOwnerId !== params.expected.pluginOwnerId) {
				result = {
					status: "conflict",
					reason: "source-changed"
				};
				return;
			}
			if (resolveLifecyclePrimaryEntry(database, successorTarget)?.entry) {
				result = {
					status: "conflict",
					reason: "target-exists"
				};
				return;
			}
			const sourceEvents = loadTranscriptEventsFromDatabase(database, source.sessionId);
			const header = sourceEvents.find((event) => isRecord(event) && event.type === "session");
			if (!header) {
				result = {
					status: "conflict",
					reason: "transcript-missing"
				};
				return;
			}
			const successorSessionId = params.successorEntry.sessionId;
			const parentSession = formatLegacySqliteSessionMarkerForScope({
				...resolved,
				sessionId: source.sessionId,
				sessionKey: normalizeSqliteSessionKey(sourceTarget.canonicalKey)
			});
			appendTranscriptEventsInTransaction(database, {
				...resolved,
				sessionId: successorSessionId,
				sessionKey: normalizeSqliteSessionKey(successorTarget.canonicalKey)
			}, [{
				...createSessionTranscriptHeader({
					cwd: typeof header.cwd === "string" ? header.cwd : void 0,
					sessionId: successorSessionId
				}),
				parentSession
			}, ...sourceEvents.filter((event) => !(isRecord(event) && event.type === "session"))]);
			const now = Date.now();
			const nextSource = {
				...source,
				mainRestartRecovery: {
					...recovery,
					revision: recovery.revision + 1,
					tombstone: {
						...tombstone,
						recoveredSessionId: successorSessionId,
						recoveredSessionKey: successorTarget.canonicalKey
					}
				},
				archivedAt: source.archivedAt ?? now,
				...source.archivedBy === void 0 && params.archivedBy ? { archivedBy: params.archivedBy } : {},
				updatedAt: Math.max(now, (source.updatedAt ?? 0) + 1)
			};
			delete nextSource.pinnedAt;
			params.commitGuard?.();
			const identityKeys = [
				...sourceTarget.storeKeys,
				...successorTarget.storeKeys,
				sourceTarget.canonicalKey,
				successorTarget.canonicalKey
			];
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			writeSessionEntry(database, successorTarget.canonicalKey, params.successorEntry);
			writeSessionEntry(database, sourceTarget.canonicalKey, nextSource, { previousEntry: source });
			rehomeSessionWindows(database, sourceTarget.canonicalKey, sourceTarget.storeKeys);
			rehomeSessionWindows(database, successorTarget.canonicalKey, successorTarget.storeKeys);
			deleteLegacySessionEntryRows(database, sourceTarget.storeKeys, sourceTarget.canonicalKey, { rehomeMembers: true });
			deleteLegacySessionEntryRows(database, successorTarget.storeKeys, successorTarget.canonicalKey, { rehomeMembers: false });
			maintenancePlans.push(applySessionEntryMaintenance(database, {
				activeSessionKey: successorTarget.canonicalKey,
				archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
				skipMaintenance: true,
				storePath: params.storePath
			}));
			currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			result = {
				status: "created",
				sourceEntry: cloneSessionEntry(nextSource),
				successorEntry: cloneSessionEntry(params.successorEntry),
				successorKey: successorTarget.canonicalKey
			};
		}, toDatabaseOptions(resolved));
	});
	emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
	await finalizeSessionEntryMaintenancePlansBestEffort(resolved, maintenancePlans);
	return result;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-message-cut.ts
const BRANCH_HEADLINE_MAX_CHARS = 120;
const SESSION_BRANCH_CACHE_MAX_ENTRIES = 32;
const sessionBranchCache = /* @__PURE__ */ new Map();
function sessionBranchCacheKey(databasePath, sessionId) {
	return `${databasePath}\0${sessionId}`;
}
function cloneSessionBranchSummaries(branches) {
	return branches.map((branch) => ({ ...branch }));
}
function readSessionBranchWatermark(database, sessionId) {
	const db = getSessionKysely(database.db);
	const maxSeq = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", sessionId))?.max_seq;
	return {
		generation: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId))?.generation ?? null,
		maxSeq: maxSeq ?? null
	};
}
function loadSessionBranchSummaries(database, sessionId) {
	const cacheKey = sessionBranchCacheKey(database.path, sessionId);
	const watermark = readSessionBranchWatermark(database, sessionId);
	const cached = sessionBranchCache.get(cacheKey);
	if (cached?.generation === watermark.generation && cached.maxSeq === watermark.maxSeq) {
		sessionBranchCache.delete(cacheKey);
		sessionBranchCache.set(cacheKey, cached);
		return cloneSessionBranchSummaries(cached.branches);
	}
	const branches = summarizeSessionBranches(loadTranscriptEventsFromDatabase(database, sessionId));
	sessionBranchCache.delete(cacheKey);
	sessionBranchCache.set(cacheKey, {
		...watermark,
		branches
	});
	pruneMapToMaxSize(sessionBranchCache, SESSION_BRANCH_CACHE_MAX_ENTRIES);
	return cloneSessionBranchSummaries(branches);
}
function invalidateSessionBranchCache(databasePath, sessionIds) {
	for (const sessionId of uniqueStrings(sessionIds)) sessionBranchCache.delete(sessionBranchCacheKey(databasePath, sessionId));
}
async function listSessionBranches(params) {
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	try {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const currentEntry = readSessionEntryRow(database, sourceKey)?.entry;
		if (!currentEntry?.sessionId) return { status: "missing-session" };
		return {
			status: "ok",
			branches: loadSessionBranchSummaries(database, currentEntry.sessionId)
		};
	} catch {
		return { status: "failed" };
	}
}
/** Resolves the active branch leaf from the same transcript tree used by branch listing. */
function resolveSessionTranscriptActiveLeafEntryId(events) {
	return scanSessionTranscriptTree(events).leafId ?? void 0;
}
async function rewindSessionToMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "rewind", expectedState);
}
async function forkSessionAtMessage(params, expectedState) {
	return await mutateSqliteSessionAtMessage(params, "fork", expectedState);
}
async function switchSessionBranch(params, expectedState) {
	return await mutateSqliteSessionAtMessage({
		...params,
		entryId: params.leafEntryId
	}, "switch", expectedState);
}
async function mutateSqliteSessionAtMessage(params, mode, expectedState) {
	const canonicalSourceKey = normalizeSqliteSessionKey(params.sessionKey);
	const sourceKey = normalizeSqliteSessionKey(params.sessionStoreKey ?? params.sessionKey);
	const targetKey = mode === "fork" ? normalizeSqliteSessionKey(params.targetKey ?? params.sessionKey) : sourceKey;
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: sourceKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	const preparedEntry = readSessionEntryRow(openOpenClawAgentDatabase(toDatabaseOptions(resolved)), sourceKey)?.entry;
	const preparedExpectedState = expectedState ?? (preparedEntry?.sessionId ? {
		sessionId: preparedEntry.sessionId,
		lifecycleRevision: preparedEntry.lifecycleRevision
	} : void 0);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let previousIdentity = /* @__PURE__ */ new Map();
		let currentIdentity = /* @__PURE__ */ new Map();
		let databasePath;
		const result = runOpenClawAgentWriteTransaction((database) => {
			databasePath = database.path;
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(database, sourceKey), ...collectSessionEntryLookupKeys(database, targetKey)]);
			previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const mutationResult = mutateSqliteSessionAtMessageInTransaction(database, resolved, {
				entryId: params.entryId,
				canonicalSourceKey,
				creation: params.creation,
				mode,
				expectedState: preparedExpectedState,
				sourceKey,
				targetKey
			});
			currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
			return mutationResult;
		}, toDatabaseOptions(resolved));
		if (result.status === "created" && databasePath) invalidateSessionBranchCache(databasePath, [...[...previousIdentity.values()].flatMap((entry) => entry.sessionId ? [entry.sessionId] : []), ...result.entry.sessionId ? [result.entry.sessionId] : []]);
		emitCommittedSessionIdentityDiff(previousIdentity, currentIdentity);
		return result;
	});
}
function mutateSqliteSessionAtMessageInTransaction(database, resolved, params) {
	const currentEntry = readSessionEntryRow(database, params.sourceKey)?.entry;
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (!params.expectedState || currentEntry.sessionId !== params.expectedState.sessionId || currentEntry.lifecycleRevision !== params.expectedState.lifecycleRevision) return { status: "conflict" };
	const events = loadTranscriptEventsFromDatabase(database, currentEntry.sessionId);
	const cut = params.mode === "switch" ? void 0 : resolveMessageCut(events, params.entryId);
	if (cut && "status" in cut) return cut;
	if (params.mode === "switch") {
		const tipStatus = validateBranchTip(events, params.entryId);
		if (tipStatus) return { status: tipStatus };
	}
	const nextSessionId = randomUUID();
	const targetScope = {
		...resolved,
		sessionId: nextSessionId,
		sessionKey: params.targetKey
	};
	const header = createSessionTranscriptHeader({
		cwd: readTranscriptHeaderCwd(events),
		sessionId: nextSessionId
	});
	appendTranscriptEventsInTransaction(database, targetScope, params.mode === "fork" && cut && !("status" in cut) ? [header, ...cut.prefix] : [
		header,
		...events.filter((event) => !isSessionHeader(event)),
		{
			type: "leaf",
			id: uniqueEntryId(events),
			parentId: readLastEventId(events),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			targetId: params.mode === "switch" ? params.entryId : cut?.parentId ?? null
		}
	]);
	if (params.mode !== "fork") reconcileSessionTranscriptIndexInTransaction(database.db, nextSessionId);
	const nextEntry = {
		...cloneMessageCutSessionEntry({
			currentEntry,
			forked: params.mode === "fork",
			forkSource: params.mode === "fork" ? {
				sessionKey: params.canonicalSourceKey,
				sessionId: currentEntry.sessionId,
				entryId: params.entryId
			} : void 0,
			nextSessionId
		}),
		...params.mode === "fork" && params.creation ? buildSessionCreationStamp(params.creation) : {}
	};
	writeSessionEntry(database, params.targetKey, nextEntry);
	return {
		status: "created",
		key: params.targetKey,
		entry: nextEntry,
		...cut && !("status" in cut) && cut.editorText ? { editorText: cut.editorText } : {},
		...cut && !("status" in cut) && cut.editorAttachments ? { editorAttachments: cut.editorAttachments } : {},
		...cut && !("status" in cut) && cut.editorMediaRefs ? { editorMediaRefs: cut.editorMediaRefs } : {}
	};
}
function validateBranchTip(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return "missing-entry";
	if (isSessionTranscriptLeafControl(target.entry)) return "not-branch-tip";
	if (!sessionBranchTipNodes(tree).some((node) => node.id === entryId)) return "not-branch-tip";
	return tree.leafId === entryId ? "already-active" : void 0;
}
function summarizeSessionBranches(events) {
	const tree = scanSessionTranscriptTree(events);
	return sessionBranchTipNodes(tree).toSorted((left, right) => Number(right.id === tree.leafId) - Number(left.id === tree.leafId) || right.index - left.index).map((node) => summarizeSessionBranch(tree, node.id));
}
function sessionBranchTipNodes(tree) {
	const referencedParents = new Set(tree.nodes.flatMap((node) => isSessionTranscriptLeafControl(node.entry) || node.parentId === null ? [] : [node.parentId]));
	return tree.nodes.filter((node) => !isSessionTranscriptLeafControl(node.entry) && (node.id === tree.leafId || !referencedParents.has(node.id)));
}
function summarizeSessionBranch(tree, leafEntryId) {
	const messages = selectSessionTranscriptTreePathNodes(tree, leafEntryId).flatMap((node) => {
		const record = asOptionalRecord(node.entry);
		return record?.type === "message" ? [record] : [];
	});
	const headline = messages.toReversed().map((record) => extractHeadlineText(record.message)).find((value) => value !== void 0);
	const timestamp = asOptionalRecord(tree.byId.get(leafEntryId)?.entry)?.timestamp;
	return {
		leafEntryId,
		headline: truncateBranchHeadline(headline ?? ""),
		messageCount: messages.length,
		...typeof timestamp === "string" && timestamp.trim() ? { updatedAt: timestamp } : {},
		active: tree.leafId === leafEntryId
	};
}
function extractHeadlineText(messageValue) {
	const message = asOptionalRecord(messageValue);
	if (message?.role !== "user" && message?.role !== "assistant") return;
	return (message.role === "assistant" ? extractAssistantPhaseText(message) : extractEditorText(message.content ?? message.text))?.replace(/\s+/g, " ").trim() || void 0;
}
function truncateBranchHeadline(value) {
	const characters = Array.from(value);
	return characters.length <= BRANCH_HEADLINE_MAX_CHARS ? value : `${characters.slice(0, BRANCH_HEADLINE_MAX_CHARS - 1).join("")}…`;
}
function resolveMessageCut(events, entryId) {
	const tree = scanSessionTranscriptTree(events);
	const target = tree.byId.get(entryId);
	if (!target) return { status: "missing-entry" };
	const record = asOptionalRecord(target.entry);
	const message = asOptionalRecord(record?.message);
	if (record?.type !== "message" || message?.role !== "user") return { status: "not-user-message" };
	const activePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const targetIndex = activePath.findIndex((node) => node.id === entryId);
	if (targetIndex < 0) return { status: "off-active-path" };
	const prefix = [];
	for (const node of activePath.slice(0, targetIndex)) {
		const entry = asOptionalRecord(node.entry);
		prefix.push(entry && entry.parentId !== node.parentId ? {
			...entry,
			parentId: node.parentId
		} : node.entry);
	}
	const editorAttachments = extractEditorAttachments(message.content);
	const editorMediaRefs = extractEditorMediaRefs(message);
	return {
		editorText: extractEditorText(message.content),
		...editorAttachments ? { editorAttachments } : {},
		...editorMediaRefs ? { editorMediaRefs } : {},
		parentId: target.parentId,
		prefix
	};
}
function cloneMessageCutSessionEntry(params) {
	return {
		...params.forked ? inheritSessionSelection(params.currentEntry) : params.currentEntry,
		sessionId: params.nextSessionId,
		lifecycleRevision: params.forked ? randomUUID() : params.currentEntry.lifecycleRevision,
		updatedAt: Date.now(),
		systemSent: false,
		abortedLastRun: false,
		lifecycleRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		status: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: void 0,
		totalTokensFresh: void 0,
		totalTokensVersion: void 0,
		contextTokens: void 0,
		contextBudgetStatus: void 0,
		compactionCount: void 0,
		compactionCheckpoints: void 0,
		memoryFlush: void 0,
		cliSessionBindings: void 0,
		cliSessionIds: void 0,
		claudeCliSessionId: void 0,
		agentHarnessId: void 0,
		modelSelectionLocked: void 0,
		skillsSnapshot: void 0,
		systemPromptReport: void 0,
		restartRecoveryRuns: void 0,
		restartRecoveryForceSafeTools: void 0,
		abortCutoffMessageSid: void 0,
		abortCutoffTimestamp: void 0,
		usageFamilyKey: params.forked ? void 0 : params.currentEntry.usageFamilyKey,
		usageFamilySessionIds: params.forked ? void 0 : params.currentEntry.usageFamilySessionIds,
		previousSessionId: params.forked ? void 0 : params.currentEntry.sessionId,
		...params.forkSource ? {
			forkSource: params.forkSource,
			parentSessionKey: params.forkSource.sessionKey
		} : {}
	};
}
function extractEditorText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "text" && typeof record.text === "string" ? [record.text] : [];
	}).join("") || void 0;
}
const EDITOR_ATTACHMENT_LIMIT = 10;
const EDITOR_ATTACHMENT_MAX_BASE64_CHARS = Math.ceil(5 * 1024 * 1024 / 3) * 4;
function extractEditorAttachments(content) {
	if (!Array.isArray(content)) return;
	const attachments = content.flatMap((block) => {
		const record = asOptionalRecord(block);
		return record?.type === "image" && typeof record.data === "string" && record.data.trim() && record.data.length <= EDITOR_ATTACHMENT_MAX_BASE64_CHARS && typeof record.mimeType === "string" && record.mimeType.startsWith("image/") ? [{
			mimeType: record.mimeType,
			data: record.data
		}] : [];
	});
	return attachments.length > 0 ? attachments.slice(0, EDITOR_ATTACHMENT_LIMIT) : void 0;
}
function extractEditorMediaRefs(message) {
	const media = asOptionalRecord(message["__openclaw"])?.media;
	if (!Array.isArray(media)) return;
	const refs = media.flatMap((entry) => {
		const record = asOptionalRecord(entry);
		const mediaPath = typeof record?.path === "string" ? record.path.trim() : "";
		const contentType = record?.contentType;
		return mediaPath && typeof contentType === "string" && contentType.startsWith("image/") ? [{
			path: mediaPath,
			contentType
		}] : [];
	});
	return refs.length > 0 ? refs : void 0;
}
function isSessionHeader(event) {
	return asOptionalRecord(event)?.type === "session";
}
function readTranscriptHeaderCwd(events) {
	const cwd = asOptionalRecord(events.find(isSessionHeader))?.cwd;
	return typeof cwd === "string" && cwd.trim() ? cwd : void 0;
}
function readLastEventId(events) {
	const id = asOptionalRecord(events.findLast((event) => !isSessionHeader(event)))?.id;
	return typeof id === "string" && id.trim() ? id : null;
}
function uniqueEntryId(events) {
	const ids = new Set(events.flatMap((event) => {
		const id = asOptionalRecord(event)?.id;
		return typeof id === "string" ? [id] : [];
	}));
	for (;;) {
		const id = randomUUID().slice(0, 8);
		if (!ids.has(id)) return id;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.reset.ts
var SessionInitializationAgentScopeMismatchError = class extends Error {
	constructor(agentId, sessionKeyAgentId) {
		super(`Session initialization agent scope mismatch: explicit agent "${agentId}" does not match session key agent "${sessionKeyAgentId}".`);
		this.agentId = agentId;
		this.sessionKeyAgentId = sessionKeyAgentId;
		this.code = "SESSION_INITIALIZATION_AGENT_SCOPE_MISMATCH";
		this.name = "SessionInitializationAgentScopeMismatchError";
	}
};
function assertSessionInitializationAgentScope(agentId, sessionKey) {
	const normalizedAgentId = normalizeAgentId(agentId);
	const sessionKeyAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	if (sessionKeyAgentId && normalizeAgentId(sessionKeyAgentId) !== normalizedAgentId) throw new SessionInitializationAgentScopeMismatchError(normalizedAgentId, sessionKeyAgentId);
}
const loadSessionArchiveRuntime = createLazyRuntimeModule(() => import("./session-archive.runtime.js"));
/**
* Persists runner reset metadata after the caller appends the in-log boundary.
*/
async function persistSessionResetLifecycle(params) {
	await applySessionEntryLifecycleMutation({
		agentId: params.agentId,
		activeSessionKey: params.sessionKey,
		storePath: params.storePath,
		upserts: [{
			sessionKey: params.sessionKey,
			entry: params.nextEntry,
			resetBoundaryReason: "reset"
		}],
		skipMaintenance: true
	});
	return { replayedMessages: 0 };
}
/** Loads the reply-session initialization rows without exposing a mutable store. */
function loadReplySessionInitializationSnapshot(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope(params);
	const store = Object.fromEntries(listSessionEntriesReadOnly({
		agentId: params.agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	const entries = cloneSessionEntries(store);
	return {
		...currentEntry ? { currentEntry } : {},
		readEntry: (sessionKey) => {
			const entry = resolveSessionStoreEntryCore({
				store: entries,
				sessionKey
			}).existing;
			return entry ? { ...entry } : void 0;
		},
		revision: createReplySessionInitializationRevision({
			entry: currentEntry,
			storePath
		})
	};
}
/**
* Persists one reply-session initialization result and archives the previous
* transcript after metadata commits. SQLite adapters map the guarded write to a
* transaction and keep archive failure warning-only, matching file storage.
*/
async function commitReplySessionInitialization(params) {
	assertSessionInitializationAgentScope(params.agentId, params.sessionKey);
	const storePath = resolveSessionStorePathForScope({
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const store = Object.fromEntries(listSessionEntriesCore({
		agentId: params.agentId,
		storePath
	}).map(({ sessionKey, entry }) => [sessionKey, entry]));
	const resolved = resolveSessionStoreEntryCore({
		store,
		sessionKey: params.sessionKey
	});
	const currentEntry = resolved.existing ? { ...resolved.existing } : void 0;
	const revision = createReplySessionInitializationRevision({
		entry: currentEntry,
		storePath
	});
	if (revision !== params.expectedRevision) return {
		ok: false,
		...currentEntry ? { currentEntry } : {},
		reason: "stale-snapshot",
		revision
	};
	const readEntry = (sessionKey) => {
		const entry = resolveSessionStoreEntryCore({
			store,
			sessionKey
		}).existing;
		return entry ? { ...entry } : void 0;
	};
	const preparedSessionEntry = params.prepareSessionEntry ? await params.prepareSessionEntry({
		...currentEntry ? { currentEntry } : {},
		readEntry,
		sessionEntry: params.sessionEntry
	}) : params.sessionEntry;
	const sessionEntry = resolveInitializedReplySessionEntry({
		agentId: params.agentId,
		...currentEntry ? { currentEntry } : {},
		sessionEntry: preparedSessionEntry,
		storePath
	});
	let staleCommit;
	let committedSessionEntry = sessionEntry;
	let beforeEntryMutationDone = false;
	const upserts = [{
		sessionKey: resolved.normalizedKey,
		...params.resetBoundaryReason ? { resetBoundaryReason: params.resetBoundaryReason } : {},
		buildEntry: async ({ store: currentStore }) => {
			const commitEntry = resolveSessionStoreEntryCore({
				store: currentStore,
				sessionKey: params.sessionKey
			}).existing;
			const commitRevision = createReplySessionInitializationRevision({
				entry: commitEntry,
				storePath
			});
			if (commitRevision !== params.expectedRevision) {
				staleCommit = {
					...commitEntry ? { currentEntry: { ...commitEntry } } : {},
					revision: commitRevision
				};
				return null;
			}
			committedSessionEntry = commitEntry ? mergeConcurrentReplySessionMetadata({
				currentEntry: commitEntry,
				preparedEntry: sessionEntry,
				snapshotEntry: params.snapshotEntry ?? params.previousEntry
			}) : sessionEntry;
			if (!beforeEntryMutationDone) {
				await params.beforeEntryMutation?.({
					...commitEntry ? { currentEntry: { ...commitEntry } } : {},
					sessionEntry: committedSessionEntry
				});
				beforeEntryMutationDone = true;
			}
			return committedSessionEntry;
		}
	}];
	if (params.retiredEntry) {
		const retiredEntry = params.retiredEntry;
		upserts.push({
			sessionKey: retiredEntry.key,
			buildEntry: () => staleCommit ? null : retiredEntry.entry
		});
	}
	await applySessionEntryLifecycleMutation({
		activeSessionKey: params.activeSessionKey,
		agentId: params.agentId,
		maintenanceOverride: params.maintenanceConfig,
		storePath,
		upserts
	});
	if (staleCommit) return {
		ok: false,
		...staleCommit.currentEntry ? { currentEntry: staleCommit.currentEntry } : {},
		reason: "stale-snapshot",
		revision: staleCommit.revision
	};
	store[resolved.normalizedKey] = committedSessionEntry;
	if (params.retiredEntry) store[params.retiredEntry.key] = params.retiredEntry.entry;
	const committed = {
		ok: true,
		previousSessionTranscript: {},
		sessionEntry: { ...committedSessionEntry },
		sessionStoreView: cloneSessionEntries(store)
	};
	const previousSessionTranscript = isIncognitoSessionKey(params.sessionKey) || params.previousEntry?.incognito === true ? {} : params.archivePreviousTranscript === false ? {} : await archivePreviousSessionTranscript({
		agentId: params.agentId,
		onArchiveError: params.onArchiveError,
		previousEntry: params.previousEntry,
		storePath: params.storePath
	});
	return {
		...committed,
		previousSessionTranscript
	};
}
async function archivePreviousSessionTranscript(params) {
	if (!params.previousEntry?.sessionId) return {};
	const { archiveSessionTranscriptsDetailed, resolveStableSessionEndTranscript } = await loadSessionArchiveRuntime();
	const archivedTranscripts = archiveSessionTranscriptsDetailed({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		reason: "reset",
		onArchiveError: params.onArchiveError
	});
	return resolveStableSessionEndTranscript({
		sessionId: params.previousEntry.sessionId,
		storePath: params.storePath,
		agentId: params.agentId,
		archivedTranscripts
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-delta.ts
const RAW_TRANSCRIPT_CURSOR_VERSION = 1;
const DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS = 1e3;
const DEFAULT_RAW_TRANSCRIPT_MAX_BYTES = 1e6;
const MAX_RAW_TRANSCRIPT_EVENTS = 1e4;
const MAX_RAW_TRANSCRIPT_BYTES = 64 * 1024 * 1024;
function normalizeRawDeltaLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeRawTranscriptCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function parseRawTranscriptCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== RAW_TRANSCRIPT_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastSeq) || (parsed.lastSeq ?? -2) < -1) return;
		return parsed;
	} catch {
		return;
	}
}
function bootstrapCursor(scope, generation) {
	return {
		agentId: scope.agentId,
		generation,
		lastSeq: -1,
		sessionId: scope.sessionId,
		version: RAW_TRANSCRIPT_CURSOR_VERSION
	};
}
/** Read one generation-consistent raw transcript page without parsing excluded payload rows. */
function readTranscriptRawDelta(scope, limits = {}) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const maxEvents = normalizeRawDeltaLimit(limits.maxEvents, DEFAULT_RAW_TRANSCRIPT_MAX_EVENTS, MAX_RAW_TRANSCRIPT_EVENTS, "maxEvents");
	const maxBytes = normalizeRawDeltaLimit(limits.maxBytes, DEFAULT_RAW_TRANSCRIPT_MAX_BYTES, MAX_RAW_TRANSCRIPT_BYTES, "maxBytes");
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const beforeEventSeq = resolveSqliteSessionTranscriptReadFence({
			database,
			...resolved
		})?.beforeRawSeq;
		return readRawDeltaInTransaction(database.db, resolved, limits.cursor, maxEvents, maxBytes, beforeEventSeq);
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript raw delta"
	});
}
function readRawDeltaInTransaction(database, scope, encodedCursor, maxEvents, maxBytes, beforeEventSeq) {
	const db = getSessionKysely(database);
	const state = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", scope.sessionId));
	if (!state) return { kind: "missing" };
	const initialCursor = bootstrapCursor(scope, state.generation);
	const reset = (reason) => ({
		kind: "reset",
		cursor: encodeRawTranscriptCursor(initialCursor),
		reason
	});
	const cursor = encodedCursor !== void 0 ? parseRawTranscriptCursor(encodedCursor) : initialCursor;
	if (!cursor) return reset("invalid_cursor");
	if (cursor.agentId !== scope.agentId || cursor.sessionId !== scope.sessionId) return reset("scope_mismatch");
	if (cursor.generation !== state.generation) return reset("generation_mismatch");
	const frontier = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_events").select("seq").where("session_id", "=", scope.sessionId).orderBy("seq", "desc").limit(1));
	const maxSeq = Math.min(frontier ? coerceSqliteNumber(frontier.seq) : -1, beforeEventSeq === void 0 ? Number.POSITIVE_INFINITY : beforeEventSeq - 1);
	if (cursor.lastSeq > maxSeq) {
		if (beforeEventSeq !== void 0) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		return reset("invalid_cursor");
	}
	const metadata = executeSqliteQuerySync(database, db.selectFrom("transcript_events").select(["seq", sql`LENGTH(CAST(event_json AS BLOB)) + 1`.as("serialized_bytes")]).where("session_id", "=", scope.sessionId).where("seq", ">", cursor.lastSeq).$if(beforeEventSeq !== void 0, (query) => query.where("seq", "<", beforeEventSeq)).orderBy("seq", "asc").limit(maxEvents + 1)).rows.map((row) => ({
		seq: coerceSqliteNumber(row.seq),
		serializedBytes: coerceSqliteNumber(row.serialized_bytes)
	}));
	let serializedBytes = 0;
	let selectedCount = 0;
	for (const row of metadata) {
		if (selectedCount >= maxEvents || serializedBytes + row.serializedBytes > maxBytes) break;
		serializedBytes += row.serializedBytes;
		selectedCount += 1;
	}
	const lastSeq = metadata.slice(0, selectedCount).at(-1)?.seq ?? cursor.lastSeq;
	const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(database, db.selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", scope.sessionId).where("seq", ">", cursor.lastSeq).where("seq", "<=", lastSeq).orderBy("seq", "asc")).rows.map((row) => ({
		event: JSON.parse(row.event_json),
		seq: coerceSqliteNumber(row.seq)
	}));
	const nextCursor = encodeRawTranscriptCursor({
		...cursor,
		lastSeq
	});
	const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serializedBytes : void 0;
	return {
		kind: "page",
		cursor: nextCursor,
		events: rows,
		hasMore: selectedCount < metadata.length,
		...requiredBytes !== void 0 ? { requiredBytes } : {},
		serializedBytes
	};
}
//#endregion
//#region src/config/sessions/session-accessor.transcript.ts
/**
* Trims a transcript for manual sessions.compact and clears stale token metadata.
* This is one storage-sized mutation: future stores can trim transcript rows and
* update entry metadata inside the same backend transaction.
*/
async function preflightSessionTranscriptForManualCompact(scope, params) {
	const events = await loadTranscriptEvents(scope).catch(() => []);
	if (events.length === 0) return {
		compacted: false,
		reason: "no transcript"
	};
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	return events.length > maxLines ? { compacted: true } : {
		compacted: false,
		kept: events.length
	};
}
async function trimSessionTranscriptForManualCompact(scope, params) {
	const maxLines = Math.max(1, Math.floor(params.maxLines));
	const maxTailLines = Math.max(0, maxLines - 1);
	let declined = {
		compacted: false,
		reason: "no transcript"
	};
	const trimmed = await trimTranscriptForManualCompact(scope, (lines) => {
		if (lines.length === 0) {
			declined = {
				compacted: false,
				reason: "no transcript"
			};
			return null;
		}
		if (lines.length <= maxLines) {
			declined = {
				compacted: false,
				kept: lines.length
			};
			return null;
		}
		const tailLines = lines.slice(1);
		const retainedLines = normalizeManualCompactTranscriptLines(lines[0], maxTailLines > 0 ? tailLines.slice(-maxTailLines) : []);
		if (!retainedLines) {
			declined = {
				compacted: false,
				kept: 0
			};
			return null;
		}
		return retainedLines;
	}, params.nowMs === void 0 ? {} : { nowMs: params.nowMs });
	if (!trimmed.trimmed) return declined;
	return {
		archived: trimmed.archivedPath,
		compacted: true,
		kept: trimmed.kept
	};
}
function parseManualCompactTranscriptRecord(line) {
	return safeParseJsonRecord(line) ?? null;
}
function normalizeManualCompactTranscriptLines(headerLine, tailLines) {
	if (!headerLine) return null;
	const header = parseManualCompactTranscriptRecord(headerLine);
	if (header?.type !== "session" || typeof header.id !== "string") return null;
	const records = tailLines.map(parseManualCompactTranscriptRecord).filter((record) => record !== null);
	const retainedIds = /* @__PURE__ */ new Set();
	const transparentParents = /* @__PURE__ */ new Map();
	const normalizedRecords = [];
	for (const record of records) {
		let parentId = record.parentId;
		const seenTransparentParents = /* @__PURE__ */ new Set();
		while (typeof parentId === "string" && transparentParents.has(parentId) && !seenTransparentParents.has(parentId)) {
			seenTransparentParents.add(parentId);
			parentId = transparentParents.get(parentId) ?? null;
		}
		let next = typeof parentId === "string" && !retainedIds.has(parentId) ? {
			...record,
			parentId: null
		} : parentId !== record.parentId ? {
			...record,
			parentId
		} : record;
		if (next.type === "leaf") {
			const targetId = next.targetId;
			const validTargetId = targetId === null || typeof targetId === "string" && targetId.trim().length > 0;
			if (!validTargetId && typeof next.id === "string") transparentParents.set(next.id, next.parentId === null || typeof next.parentId === "string" ? next.parentId : null);
			if (typeof targetId === "string" && targetId.trim() && !retainedIds.has(targetId)) next = {
				...next,
				targetId: null,
				appendParentId: null
			};
			else if (validTargetId && typeof next.appendParentId === "string" && !retainedIds.has(next.appendParentId)) next = {
				...next,
				appendParentId: targetId
			};
		}
		if ((next.type === "compaction" || next.type === "reset") && typeof next.id === "string") {
			const firstKeptEntryId = next.firstKeptEntryId;
			if (typeof firstKeptEntryId === "string" && firstKeptEntryId !== next.id) {
				const branchPath = selectSessionTranscriptTreePathNodes(scanSessionTranscriptTree([...normalizedRecords, next]), next.id);
				if (!branchPath.some((node) => node.id === firstKeptEntryId)) next = {
					...next,
					firstKeptEntryId: branchPath[0]?.id ?? next.id
				};
			}
		}
		normalizedRecords.push(next);
		if (typeof next.id === "string" && next.id.trim()) retainedIds.add(next.id);
	}
	return [JSON.stringify(header), ...normalizedRecords.map((record) => JSON.stringify(record))];
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-target.ts
function resolveRuntimeContext(scope) {
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${scope.sessionKey}`);
	const configuredStorePath = resolveConcreteSessionStorePath(scope.storePath) ?? resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: scope.env,
		sessionKey: scope.sessionKey,
		storePath: configuredStorePath
	});
	return {
		agentId,
		sessionKey: resolveSessionKeyBySessionId({
			agentId,
			...scope.env ? { env: scope.env } : {},
			sessionId: scope.sessionId,
			storePath
		}) ?? resolveSessionEntrySelection({
			agentId,
			...scope.env ? { env: scope.env } : {},
			sessionKey: scope.sessionKey,
			storePath
		}, { readOnly: true })?.normalizedKey ?? scope.sessionKey,
		storePath
	};
}
/** Resolves the canonical SQLite identity for runtime transcript access. */
async function resolveSessionTranscriptRuntimeTarget(scope) {
	return {
		...resolveRuntimeContext(scope),
		sessionId: scope.sessionId
	};
}
/** Resolves the physical agent database that owns one runtime transcript. */
function resolveSessionTranscriptDatabasePath(target) {
	return resolveOpenClawAgentSqlitePath(toDatabaseOptions(resolveSqliteTranscriptScope(target)));
}
function resolveSessionTranscriptReadTarget(scope) {
	const sessionKey = scope.sessionKey?.trim();
	const agentId = scope.agentId ?? resolveAgentIdFromSessionKey(sessionKey);
	if (!agentId) throw new Error(`Cannot resolve transcript scope without an agent id: ${sessionKey}`);
	const configuredStorePath = resolveConcreteSessionStorePath(scope.storePath) ?? resolveSessionStorePathCore(getRuntimeConfig().session?.store, {
		agentId,
		env: scope.env
	});
	const storePath = resolveSessionStorePathForScope({
		agentId,
		env: scope.env,
		sessionKey,
		storePath: configuredStorePath
	});
	const hasMatchingSessionEntry = scope.sessionEntry?.sessionId === scope.sessionId;
	const resolved = sessionKey && !hasMatchingSessionEntry ? resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey,
		storePath
	}, { readOnly: true }) : void 0;
	const resolvedSessionKey = hasMatchingSessionEntry ? sessionKey : resolved?.normalizedKey;
	return {
		agentId,
		sessionId: scope.sessionId,
		storePath,
		...resolvedSessionKey ? { sessionKey: resolvedSessionKey } : {}
	};
}
function resolveConcreteSessionStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-turn.ts
function resolveTranscriptTurnAgentId(params) {
	if (classifySessionKeyShape(params.sessionKey) === "malformed_agent") throw new Error("Malformed agent session key; refusing transcript turn persistence.");
	const scopedAgentId = params.scopeAgentId?.trim() ? normalizeAgentId(params.scopeAgentId.trim()) : void 0;
	const parsedAgentId = parseAgentSessionKey(params.sessionKey)?.agentId;
	const keyAgentId = parsedAgentId ? normalizeAgentId(parsedAgentId) : void 0;
	if (scopedAgentId && keyAgentId && scopedAgentId !== keyAgentId) throw new Error(`Session key owner "${keyAgentId}" does not match requested agent "${scopedAgentId}".`);
	const persistedStoreOwner = params.sessionStore && !params.storePath ? { kind: "none" } : resolvePersistedSessionStoreOwnerForTarget({
		config: params.config,
		sessionKey: params.sessionKey,
		storePath: params.storePath,
		env: params.env
	});
	if (scopedAgentId && persistedStoreOwner.kind === "configured" && scopedAgentId !== persistedStoreOwner.agentId) throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to agent "${persistedStoreOwner.agentId}", not agent "${scopedAgentId}".`
	});
	if (persistedStoreOwner.kind === "retired") throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: `The shared fixed-store row belongs to retired agent "${persistedStoreOwner.agentId}".`
	});
	const agentId = keyAgentId ?? (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? scopedAgentId ?? tryResolveLegacyCompatibilityAgentId(params.config);
	if (agentId) return normalizeAgentId(agentId);
	throw new AgentSelectionRequiredError(listAgentIds(params.config), {
		surface: "transcript turn persistence",
		hint: "Pass an agentId or use an agent-qualified session key."
	});
}
/** Appends one prepared ordered group in the existing transcript turn transaction. */
async function appendTranscriptMessages(scope, options) {
	if (options.messages.length === 0) return [];
	const expectedSessionId = scope.sessionId?.trim();
	if (!expectedSessionId) throw new Error("Cannot append a transcript batch without an exact session id");
	const turn = await persistExpectedSessionTranscriptTurn(scope, {
		atomicGroup: true,
		config: options.config,
		cwd: options.cwd,
		expectedSessionId,
		messages: options.messages.map((append) => ({
			...append,
			eventId: append.eventId ?? randomUUID(),
			message: redactTranscriptMessageForStorage(append.message, options),
			now: append.now ?? Date.now()
		})),
		updateMode: "none"
	});
	if (turn.rejectedReason) throw new Error("Transcript session changed before batch append");
	return turn.messages;
}
/**
* Persists one logical transcript turn through the SQLite-backed session target.
* Transcript row append(s) and the requested
* updatedAt touch happen before transcript update delivery is published.
*/
async function persistSessionTranscriptTurn(scope, options) {
	const expectedSessionId = options.expectedSessionId;
	if (expectedSessionId) return await persistExpectedSessionTranscriptTurn(scope, {
		...options,
		expectedSessionId
	});
	if (options.sessionLifecyclePatch) throw new Error("Cannot patch session lifecycle without an expected session id");
	const target = await resolveTranscriptTurnTarget(scope, options.config);
	if (target.entryFromPersistedStore && target.storePath && target.sessionKey && target.sessionEntry && target.sessionId) return await persistExpectedSessionTranscriptTurn({
		...scope,
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	}, {
		...options,
		expectedSessionId: target.sessionId
	});
	const appendedMessages = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendTranscriptTurnMessages(target, options));
	const appendedCount = countAppendedTranscriptMessages(appendedMessages);
	const sessionEntry = await touchTranscriptTurnSessionEntry({
		scope,
		target,
		shouldTouch: options.touchSessionEntry === true && appendedCount > 0
	});
	await publishTranscriptTurnUpdate({
		target,
		sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages
	});
	return {
		appendedCount,
		messages: appendedMessages,
		sessionEntry
	};
}
async function appendTranscriptTurnMessages(target, options) {
	const selectedMessages = await selectAppendableTranscriptTurnMessages(target, options);
	const appendedMessages = [];
	for (const append of selectedMessages) {
		const { shouldAppend: _shouldAppend, ...appendOptions } = append;
		const result = await appendTranscriptMessage({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}, {
			...appendOptions,
			...append.cwd ?? options.cwd ? { cwd: append.cwd ?? options.cwd } : {},
			...append.config ?? options.config ? { config: append.config ?? options.config } : {}
		});
		if (result) appendedMessages.push(result);
	}
	rememberCommittedTranscriptMessageSequences(target, appendedMessages);
	return appendedMessages;
}
async function selectAppendableTranscriptTurnMessages(target, options) {
	const selectedMessages = [];
	for (const append of options.messages) {
		if (!(append.shouldAppend ? await append.shouldAppend({
			...target.agentId ? { agentId: target.agentId } : {},
			...target.sessionId ? { sessionId: target.sessionId } : {},
			...target.sessionKey ? { sessionKey: target.sessionKey } : {},
			...target.storePath ? { storePath: target.storePath } : {}
		}) : true)) continue;
		selectedMessages.push(append);
	}
	return selectedMessages;
}
function countAppendedTranscriptMessages(messages) {
	return messages.filter((message) => message.appended).length;
}
async function persistExpectedSessionTranscriptTurn(scope, options) {
	const requestedSessionKey = scope.sessionKey?.trim();
	if (!scope.storePath || !requestedSessionKey) throw new Error("Cannot guard a transcript turn without a session store and key");
	const storePath = scope.storePath;
	const expectedSessionId = options.expectedSessionId;
	const agentId = resolveTranscriptTurnAgentId({
		config: options.config ?? getRuntimeConfig(),
		scopeAgentId: scope.agentId,
		sessionKey: requestedSessionKey,
		storePath,
		sessionStore: scope.sessionStore,
		env: scope.env
	});
	const sessionKey = (await resolveSessionTranscriptRuntimeTarget({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: expectedSessionId,
		sessionKey: requestedSessionKey,
		storePath
	})).sessionKey;
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey
	}) : resolveSessionEntrySelection({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionKey,
		storePath
	});
	const target = {
		agentId,
		sessionId: expectedSessionId,
		sessionKey: resolved.normalizedKey,
		storePath
	};
	const inheritedWriterFence = getOwnedSessionTranscriptWriterFence({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	});
	const turn = await runWithOwnedSessionTranscriptWrite({
		sessionFile: target.sessionKey,
		sessionKey: target.sessionKey,
		sessionTarget: target
	}, () => appendExpectedSessionTranscriptTurn({
		agentId,
		sessionKey: resolved.normalizedKey,
		sessionId: expectedSessionId,
		storePath
	}, {
		config: options.config,
		cwd: options.cwd,
		expectedLifecycleRevision: options.expectedLifecycleRevision ?? inheritedWriterFence?.expectedLifecycleRevision,
		expectedWriterRunId: options.expectedWriterRunId ?? inheritedWriterFence?.expectedWriterRunId,
		expectedSessionState: options.expectedSessionState,
		expectedSessionId,
		atomicGroup: options.atomicGroup,
		messages: options.messages,
		sessionLifecyclePatch: options.sessionLifecyclePatch,
		sessionFile: target.sessionKey,
		touchSessionEntry: options.touchSessionEntry
	}));
	if (turn.rejectedReason === "session-rebound") return {
		appendedCount: 0,
		messages: [],
		rejectedReason: "session-rebound",
		sessionEntry: turn.sessionEntry
	};
	await publishTranscriptTurnUpdate({
		target: requestedSessionKey === target.sessionKey ? target : {
			...target,
			sessionKey: requestedSessionKey
		},
		sessionEntry: turn.sessionEntry,
		updateMode: options.updateMode ?? "inline",
		publishWhen: options.publishWhen ?? "when-appended",
		appendedMessages: turn.appendedMessages
	});
	if (turn.sessionEntry && scope.sessionStore) scope.sessionStore[resolved.normalizedKey] = turn.sessionEntry;
	return {
		appendedCount: countAppendedTranscriptMessages(turn.appendedMessages),
		messages: turn.appendedMessages,
		sessionEntry: turn.sessionEntry ?? scope.sessionEntry
	};
}
async function resolveTranscriptTurnTarget(scope, config) {
	const sessionKey = scope.sessionKey?.trim();
	if (!sessionKey || !scope.sessionId) throw new Error("Cannot persist a transcript turn without a session key and session id");
	const effectiveConfig = config ?? getRuntimeConfig();
	const agentId = resolveTranscriptTurnAgentId({
		config: effectiveConfig,
		scopeAgentId: scope.agentId,
		sessionKey,
		storePath: scope.storePath,
		sessionStore: scope.sessionStore,
		env: scope.env
	});
	const storePath = scope.storePath ?? resolveSessionStorePathCore(effectiveConfig.session?.store, {
		agentId,
		env: scope.env
	});
	const runtimeTarget = await resolveSessionTranscriptRuntimeTarget({
		agentId,
		...scope.env ? { env: scope.env } : {},
		sessionId: scope.sessionId,
		sessionKey,
		storePath
	});
	const resolvedSessionKey = runtimeTarget.sessionKey;
	const resolved = scope.sessionStore ? resolveSessionStoreEntryCore({
		store: scope.sessionStore,
		sessionKey: resolvedSessionKey
	}) : void 0;
	const persistedEntry = loadSessionEntryReadOnly({
		...scope,
		agentId,
		sessionKey: resolvedSessionKey,
		storePath
	});
	const sessionEntry = persistedEntry ?? resolved?.existing ?? scope.sessionEntry;
	return {
		agentId,
		sessionId: scope.sessionId,
		sessionKey: runtimeTarget.sessionKey,
		storePath,
		sessionEntry,
		entryFromPersistedStore: persistedEntry != null
	};
}
async function touchTranscriptTurnSessionEntry(params) {
	if (!params.shouldTouch || !params.target.storePath || !params.target.sessionKey || !params.target.sessionId) return params.target.sessionEntry;
	const updatedAt = Date.now();
	const updated = await updateSessionEntry({
		sessionKey: params.target.sessionKey,
		storePath: params.target.storePath,
		...params.target.agentId ? { agentId: params.target.agentId } : {}
	}, (current) => current.sessionId === params.target.sessionId ? { updatedAt: Math.max(current.updatedAt ?? 0, updatedAt) } : null, { skipMaintenance: true });
	if (updated && params.scope.sessionStore) params.scope.sessionStore[params.target.sessionKey] = updated;
	return updated ?? params.target.sessionEntry;
}
async function publishTranscriptTurnUpdate(params) {
	if (params.updateMode === "none") return;
	const appendedMessages = params.appendedMessages.filter((message) => message.appended);
	if (params.publishWhen === "when-appended" && appendedMessages.length === 0) return;
	const target = params.target.agentId && params.target.sessionId && params.target.sessionKey ? {
		agentId: params.target.agentId,
		sessionId: params.target.sessionId,
		sessionKey: params.target.sessionKey,
		...params.target.storePath ? { storePath: params.target.storePath } : {}
	} : void 0;
	const update = {
		...params.target.sessionKey ? { sessionKey: params.target.sessionKey } : {},
		...params.target.agentId ? { agentId: params.target.agentId } : {},
		...target ? { target } : {},
		...params.sessionEntry?.lifecycleRevision ? { lifecycleRevision: params.sessionEntry.lifecycleRevision } : {}
	};
	if (params.updateMode !== "inline" || appendedMessages.length === 0) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	const sequencedMessages = appendedMessages.map((message) => ({
		message,
		messageSeq: readCommittedTranscriptMessageSequence(message)
	}));
	if (sequencedMessages.length > 1 && sequencedMessages.some(({ messageSeq }) => messageSeq === void 0)) {
		emitSessionTranscriptUpdate(update);
		return;
	}
	for (const { message, messageSeq } of sequencedMessages) emitSessionTranscriptUpdate({
		...update,
		message: message.message,
		messageId: message.messageId,
		...messageSeq !== void 0 ? { messageSeq } : {}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.transcript-range.ts
function anchorsShareTarget(boundary) {
	const { admission, terminal } = boundary;
	return admission.agentId === terminal.agentId && admission.sessionId === terminal.sessionId && admission.sessionKey === terminal.sessionKey && admission.storePath === terminal.storePath && admission.generation === terminal.generation;
}
function validateAnchorRow(anchor, row) {
	return Boolean(row && row.generation === anchor.generation && row.seq === anchor.rawSeq && row.parent_id === anchor.effectiveParentId && row.message_position === anchor.activeMessagePosition);
}
function validateTerminalAncestry(params) {
	if (params.terminalEntryId === params.admissionEntryId) return "descendant";
	const db = getSessionKysely(params.database);
	const seen = /* @__PURE__ */ new Set([params.terminalEntryId]);
	let parentId = params.terminalParentId;
	for (let depth = 0; depth < params.maxDepth; depth += 1) {
		if (parentId === params.admissionEntryId) return "descendant";
		if (parentId === null || seen.has(parentId)) return "non-descendant";
		seen.add(parentId);
		const row = executeSqliteQueryTakeFirstSync(params.database, db.selectFrom("transcript_event_identities").select("parent_id").where("session_id", "=", params.sessionId).where("event_id", "=", parentId).limit(1));
		if (!row) return "non-descendant";
		parentId = row.parent_id;
	}
	return "too-large";
}
/** Reads one bounded accepted transcript range from a single SQLite snapshot. */
function readClosedTranscriptTurn(params) {
	if (!anchorsShareTarget(params.boundary)) return { kind: "session-rebound" };
	const target = params.boundary.admission;
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteTranscriptScope({
		agentId: target.agentId,
		sessionId: target.sessionId,
		sessionKey: target.sessionKey,
		storePath: target.storePath
	})));
	return runSqliteDeferredTransactionSync(database.db, () => {
		const db = getSessionKysely(database.db);
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select(["session_id"]).where("session_id", "=", target.sessionId).where("session_key", "=", target.sessionKey).limit(1))) return { kind: "session-rebound" };
		const frontier = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", target.sessionId).orderBy("seq", "desc").limit(1))?.seq;
		const projection = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", target.sessionId));
		if (frontier === void 0 || !projection || projection.needs_rebuild !== 0 || projection.indexed_seq !== frontier) return { kind: "projection-unavailable" };
		const readAnchor = (anchor) => executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_rewrite_watermarks as rewrite", (join) => join.onRef("rewrite.session_id", "=", "identity.session_id")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "identity.session_id").onRef("event.seq", "=", "identity.seq")).select([
			"identity.seq",
			"identity.parent_id",
			"active.message_position",
			"rewrite.generation",
			"event.event_json"
		]).where("identity.session_id", "=", target.sessionId).where("identity.event_id", "=", anchor.entryId).limit(1));
		const admissionRow = readAnchor(params.boundary.admission);
		const terminalRow = readAnchor(params.boundary.terminal);
		if (!validateAnchorRow(params.boundary.admission, admissionRow) || !validateAnchorRow(params.boundary.terminal, terminalRow)) return { kind: "stale" };
		const admissionEvent = JSON.parse(admissionRow.event_json);
		if (admissionEvent.type !== "message" || admissionEvent.message?.role !== "user") return { kind: "stale" };
		const ancestry = validateTerminalAncestry({
			database: database.db,
			sessionId: target.sessionId,
			admissionEntryId: params.boundary.admission.entryId,
			terminalEntryId: params.boundary.terminal.entryId,
			terminalParentId: terminalRow.parent_id,
			maxDepth: params.maxEvents
		});
		if (ancestry !== "descendant") return { kind: ancestry };
		const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select("event.event_json").where("active.session_id", "=", target.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", params.boundary.admission.activeMessagePosition).where("active.message_position", "<=", params.boundary.terminal.activeMessagePosition).orderBy("active.message_position", "asc").limit(params.maxEvents + 1)).rows;
		if (rows.length > params.maxEvents || rows.reduce((total, row) => total + Buffer$1.byteLength(row.event_json, "utf8"), 0) > params.maxBytes) return { kind: "too-large" };
		return {
			kind: "ok",
			messages: rows.flatMap((row) => {
				const event = JSON.parse(row.event_json);
				return event.type === "message" && event.message ? [event.message] : [];
			})
		};
	}, {
		databaseLabel: database.path,
		operationLabel: "session transcript accepted turn read"
	});
}
//#endregion
//#region src/config/sessions/session-transcript-projection-error.ts
var SessionTranscriptProjectionUnavailableError = class extends Error {
	constructor(sessionId) {
		super(`Session transcript projection is rebuilding: ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SessionTranscriptProjectionUnavailableError";
	}
};
function isSessionTranscriptProjectionUnavailableError(error) {
	return error instanceof SessionTranscriptProjectionUnavailableError;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-projection.ts
const EMPTY_PROJECTION_STATE = {
	activeEventCount: 0,
	activeMessageCount: 0,
	indexedSeq: -1,
	leafEventId: null,
	needsRebuild: false
};
function getActiveTranscriptKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function readProjectionSnapshot(database, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(database.db, getActiveTranscriptKysely(database).selectFrom("transcript_events as latest").leftJoin("session_transcript_index_state as state", "state.session_id", "latest.session_id").select([
		"latest.seq as latest_seq",
		"state.active_event_count",
		"state.active_message_count",
		"state.indexed_seq",
		"state.leaf_event_id",
		"state.needs_rebuild"
	]).where("latest.session_id", "=", sessionId).orderBy("latest.seq", "desc").limit(1));
	if (!row) return;
	return {
		latestSeq: row.latest_seq,
		...typeof row.indexed_seq === "number" ? { state: {
			activeEventCount: row.active_event_count ?? 0,
			activeMessageCount: row.active_message_count ?? 0,
			indexedSeq: row.indexed_seq,
			leafEventId: row.leaf_event_id,
			needsRebuild: row.needs_rebuild !== 0
		} } : {}
	};
}
function withCurrentProjectionSnapshot(scope, read) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = toDatabaseOptions(resolved);
	const database = openOpenClawAgentDatabase(databaseOptions);
	const result = runSqliteDeferredTransactionSync(database.db, () => {
		const snapshot = readProjectionSnapshot(database, resolved.sessionId);
		if (!snapshot) return {
			kind: "value",
			value: read({
				database,
				resolved,
				state: EMPTY_PROJECTION_STATE
			})
		};
		if (snapshot.state && !snapshot.state.needsRebuild && snapshot.state.indexedSeq === snapshot.latestSeq) return {
			kind: "value",
			value: read({
				database,
				resolved,
				state: snapshot.state
			})
		};
		return { kind: "unavailable" };
	}, {
		databaseLabel: database.path,
		operationLabel: "sessions.history.read"
	});
	if (result.kind === "value") return result.value;
	startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: resolved.sessionId
	});
	throw new SessionTranscriptProjectionUnavailableError(resolved.sessionId);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reset-window.ts
const resetMessageWindowCache = /* @__PURE__ */ new Map();
const MAX_RESET_MESSAGE_WINDOW_CACHE = 64;
function getResetWindowKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function parseMessageEventRow$1(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		seq: row.message_position + 1
	};
}
function readMessageRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const db = getResetWindowKysely(projection.database);
	return executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", start).where("active.message_position", "<", endExclusive).orderBy("active.message_position", "asc")).rows.map(parseMessageEventRow$1);
}
function resetMessageWindowCacheKey(projection) {
	return `${projection.database.path}\0${projection.resolved.sessionId}`;
}
function readTranscriptProjectionGeneration(projection) {
	return executeSqliteQueryTakeFirstSync(projection.database.db, getResetWindowKysely(projection.database).selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", projection.resolved.sessionId))?.generation;
}
function cacheResetMessageWindow(key, entry) {
	resetMessageWindowCache.delete(key);
	resetMessageWindowCache.set(key, entry);
	pruneMapToMaxSize(resetMessageWindowCache, MAX_RESET_MESSAGE_WINDOW_CACHE);
}
function readLatestActiveBoundaryMetadataByType(projection, eventType) {
	const db = getResetWindowKysely(projection.database);
	return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).select([
		"active.active_position",
		"identity.event_type",
		"identity.seq"
	]).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "=", eventType).orderBy("identity.seq", "desc").limit(1));
}
function readLatestActiveBoundaryMetadata(projection) {
	const reset = readLatestActiveBoundaryMetadataByType(projection, "reset");
	const compaction = readLatestActiveBoundaryMetadataByType(projection, "compaction");
	if (!reset) return compaction;
	if (!compaction) return reset;
	return reset.seq > compaction.seq ? reset : compaction;
}
function readResetBoundary(projection, seq) {
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, getResetWindowKysely(projection.database).selectFrom("transcript_events").select("event_json").where("session_id", "=", projection.resolved.sessionId).where("seq", "=", seq).limit(1));
	if (!row) throw new Error("Active transcript reset boundary is missing");
	const parsed = JSON.parse(row.event_json);
	if (parsed.type !== "reset") throw new Error("Active transcript reset boundary has invalid payload");
	return parsed;
}
function findLatestResetMessageWindow(projection, generation) {
	const db = getResetWindowKysely(projection.database);
	const latestBoundary = readLatestActiveBoundaryMetadata(projection);
	if (!latestBoundary || latestBoundary.event_type !== "reset") return null;
	const reset = readResetBoundary(projection, latestBoundary.seq);
	const postBoundaryMessagePosition = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("active_position", ">", latestBoundary.active_position).where("message_position", "is not", null).orderBy("active_position", "asc").limit(1))?.message_position ?? projection.state.activeMessageCount;
	let keptMessagePositions = [];
	if (typeof reset.firstKeptEntryId === "string") {
		const firstKept = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.active_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", reset.firstKeptEntryId));
		if (firstKept && firstKept.active_position < latestBoundary.active_position) keptMessagePositions = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.active_position", ">=", firstKept.active_position).where("active.active_position", "<", latestBoundary.active_position).where("active.message_position", "is not", null).orderBy("active.active_position", "asc")).rows.flatMap((row) => {
			if (row.message_position === null) return [];
			try {
				const role = JSON.parse(row.event_json).message?.role;
				return role === "user" || role === "assistant" ? [row.message_position] : [];
			} catch {
				return [];
			}
		});
	}
	return {
		generation,
		indexedSeq: projection.state.indexedSeq,
		keptMessagePositions,
		postBoundaryMessagePosition
	};
}
function resolveResetMessageWindow(projection) {
	const key = resetMessageWindowCacheKey(projection);
	const cached = resetMessageWindowCache.get(key);
	const generation = readTranscriptProjectionGeneration(projection);
	if (cached) {
		if (cached.generation === generation && cached.indexedSeq === projection.state.indexedSeq) return cached.window;
	}
	const window = findLatestResetMessageWindow(projection, generation);
	cacheResetMessageWindow(key, {
		generation,
		indexedSeq: projection.state.indexedSeq,
		window
	});
	return window;
}
function resolveVisibleMessagePositions(projection) {
	const window = resolveResetMessageWindow(projection);
	if (!window) return {
		kept: [],
		postStart: 0,
		total: projection.state.activeMessageCount
	};
	return {
		kept: window.keptMessagePositions,
		postStart: window.postBoundaryMessagePosition,
		total: window.keptMessagePositions.length + Math.max(0, projection.state.activeMessageCount - window.postBoundaryMessagePosition)
	};
}
function readVisibleMessageRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	if (boundedEnd <= boundedStart) return [];
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	const keptEvents = visible.kept.slice(boundedStart, keptEnd).flatMap((position) => readMessageRange(projection, position, position + 1));
	const postVisibleStart = Math.max(boundedStart, visible.kept.length);
	const postVisibleEnd = Math.max(postVisibleStart, boundedEnd);
	const postEvents = readMessageRange(projection, visible.postStart + postVisibleStart - visible.kept.length, visible.postStart + postVisibleEnd - visible.kept.length);
	return [...keptEvents, ...postEvents];
}
/** Maps a logical visible-message range to its materialized message positions. */
function resolveVisibleMessagePositionRange(projection, start, endExclusive) {
	if (endExclusive <= start) return [];
	const visible = resolveVisibleMessagePositions(projection);
	const boundedStart = Math.min(Math.max(0, start), visible.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), visible.total);
	const keptEnd = Math.min(boundedEnd, visible.kept.length);
	const positions = visible.kept.slice(boundedStart, keptEnd);
	const postVisibleStart = Math.max(boundedStart, visible.kept.length);
	const postVisibleEnd = Math.max(postVisibleStart, boundedEnd);
	for (let logical = postVisibleStart; logical < postVisibleEnd; logical += 1) positions.push(visible.postStart + logical - visible.kept.length);
	return positions;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-visible-cursor.ts
const VISIBLE_MESSAGE_CURSOR_VERSION = 1;
const DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES = 1e3;
const DEFAULT_VISIBLE_MESSAGE_MAX_BYTES = 1e6;
const MAX_VISIBLE_MESSAGE_MAX_MESSAGES = 1e4;
const MAX_VISIBLE_MESSAGE_MAX_BYTES = 64 * 1024 * 1024;
function normalizeVisibleMessageLimit(value, fallback, maximum, name) {
	const resolved = value ?? fallback;
	if (!Number.isInteger(resolved) || resolved < 1 || resolved > maximum) throw new RangeError(`${name} must be an integer between 1 and ${String(maximum)}`);
	return resolved;
}
function encodeVisibleMessageCursor(cursor) {
	return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}
function createVisibleMessageCursor(params) {
	return {
		...params,
		lastEventSeq: -1,
		lastMessagePosition: -1,
		version: VISIBLE_MESSAGE_CURSOR_VERSION
	};
}
function parseVisibleMessageCursor(value) {
	if (value.length > 4096) return;
	try {
		const parsed = JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
		if (parsed.version !== VISIBLE_MESSAGE_CURSOR_VERSION || typeof parsed.agentId !== "string" || typeof parsed.sessionId !== "string" || typeof parsed.generation !== "string" || !Number.isSafeInteger(parsed.lastEventSeq) || (parsed.lastEventSeq ?? -2) < -1 || !Number.isSafeInteger(parsed.lastMessagePosition) || (parsed.lastMessagePosition ?? -2) < -1 || parsed.lastEventSeq === -1 !== (parsed.lastMessagePosition === -1)) return;
		return parsed;
	} catch {
		return;
	}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-active-events.ts
function parseMessageEventRow(row) {
	if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
	return {
		event: JSON.parse(row.event_json),
		seq: row.message_position + 1
	};
}
/** Reads every message event on the active path. Full callers remain intentionally O(output). */
function readSessionTranscriptMessageEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		return readVisibleMessageRange(projection, 0, resolveVisibleMessagePositions(projection).total);
	});
}
/** Classifies one entry against the authoritative active path and leaf. */
function readSessionTranscriptActivePathEntryRelation(scope, entryId) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		if (projection.state.leafEventId === entryId || entryId === null) return projection.state.leafEventId === entryId ? "exact" : "off-path";
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("identity.seq").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", entryId).limit(1)) ? "ancestor" : "off-path";
	});
}
/** Reads a bounded tail from the materialized active path, including control events. */
function readRecentSessionTranscriptActiveEvents(scope, maxEvents) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const limit = Math.max(0, Math.floor(Number.isFinite(maxEvents) ? maxEvents : 0));
		if (limit === 0) return [];
		const db = getActiveTranscriptKysely(projection.database);
		return executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select("event.event_json").where("active.session_id", "=", projection.resolved.sessionId).orderBy("active.active_position", "desc").limit(limit)).rows.toReversed().map((row) => JSON.parse(row.event_json));
	});
}
/** Reads active-path event count and JSONL byte size without materializing payloads. */
function readSessionTranscriptActiveStats(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [eb.fn.count("active.event_seq").as("event_count"), sql`COALESCE(SUM(LENGTH(CAST(event.event_json AS BLOB))), 0)
            + COUNT(*)`.as("size_bytes")]).where("active.session_id", "=", projection.resolved.sessionId));
		return {
			eventCount: row?.event_count ?? 0,
			sizeBytes: row?.size_bytes ?? 0
		};
	});
}
/** Reads one append-stable forward page from the materialized active-message projection. */
function readSessionTranscriptVisibleMessageDeltaCore(scope, limits = {}) {
	const maxMessages = normalizeVisibleMessageLimit(limits.maxMessages, DEFAULT_VISIBLE_MESSAGE_MAX_MESSAGES, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxMessages");
	const maxBytes = normalizeVisibleMessageLimit(limits.maxBytes, DEFAULT_VISIBLE_MESSAGE_MAX_BYTES, MAX_VISIBLE_MESSAGE_MAX_BYTES, "maxBytes");
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const transcriptFence = resolveSqliteSessionTranscriptReadFence({
			database: projection.database,
			...projection.resolved
		});
		const generation = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", projection.resolved.sessionId))?.generation;
		if (!generation) return { kind: "missing" };
		const initialCursor = createVisibleMessageCursor({
			agentId: projection.resolved.agentId,
			generation,
			sessionId: projection.resolved.sessionId
		});
		const reset = (reason) => ({
			kind: "reset",
			cursor: encodeVisibleMessageCursor(initialCursor),
			reason
		});
		const cursor = limits.cursor !== void 0 ? parseVisibleMessageCursor(limits.cursor) : initialCursor;
		if (!cursor) return reset("invalid_cursor");
		if (cursor.agentId !== projection.resolved.agentId || cursor.sessionId !== projection.resolved.sessionId) return reset("scope_mismatch");
		if (cursor.generation !== generation) return reset("generation_mismatch");
		if (transcriptFence !== void 0 && cursor.lastMessagePosition >= transcriptFence.beforeActiveMessagePosition) throw new SessionTranscriptReadFenceError("Transcript read cursor has crossed the current-turn admission fence");
		let startPosition = 0;
		if (cursor.lastEventSeq >= 0) {
			const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("session_transcript_active_events").select("message_position").where("session_id", "=", projection.resolved.sessionId).where("event_seq", "=", cursor.lastEventSeq).where("message_position", "is not", null));
			if (anchor?.message_position === null || anchor?.message_position === void 0) return reset("anchor_missing");
			if (anchor.message_position !== cursor.lastMessagePosition) return reset("anchor_moved");
			startPosition = anchor.message_position + 1;
		}
		const metadata = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select([
			"active.event_seq",
			"active.message_position",
			sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")
		]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "is not", null).where("active.message_position", ">=", startPosition).$if(transcriptFence !== void 0, (query) => query.where("active.message_position", "<", transcriptFence.beforeActiveMessagePosition)).orderBy("active.message_position", "asc").limit(maxMessages + 1)).rows;
		let serializedBytes = 0;
		let selectedCount = 0;
		for (const row of metadata) {
			if (selectedCount >= maxMessages || serializedBytes + row.serialized_bytes > maxBytes) break;
			serializedBytes += row.serialized_bytes;
			selectedCount += 1;
		}
		const selected = metadata.slice(0, selectedCount);
		const lastEventSeq = selected.at(-1)?.event_seq ?? cursor.lastEventSeq;
		const lastMessagePosition = selected.at(-1)?.message_position ?? cursor.lastMessagePosition;
		const rows = selectedCount === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).leftJoin("session_transcript_active_events as parent_active", (join) => join.onRef("parent_active.session_id", "=", "active.session_id").on((eb) => eb("parent_active.active_position", "=", eb("active.active_position", "-", 1)))).leftJoin("transcript_event_identities as parent_identity", (join) => join.onRef("parent_identity.session_id", "=", "parent_active.session_id").onRef("parent_identity.seq", "=", "parent_active.event_seq")).select([
			"active.event_seq",
			"active.message_position",
			"event.event_json",
			"parent_identity.event_id as parent_id"
		]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", ">=", startPosition).where("active.message_position", "<=", lastMessagePosition).orderBy("active.message_position", "asc")).rows.map((row) => {
			if (row.message_position === null) throw new Error("Active transcript message row is missing its message position");
			return {
				event: JSON.parse(row.event_json),
				eventSeq: row.event_seq,
				parentId: row.parent_id,
				seq: row.message_position + 1
			};
		});
		const requiredBytes = selectedCount === 0 && metadata[0] ? metadata[0].serialized_bytes : void 0;
		return {
			kind: "page",
			cursor: encodeVisibleMessageCursor({
				...cursor,
				lastEventSeq,
				lastMessagePosition
			}),
			events: rows,
			hasMore: selectedCount < metadata.length,
			...requiredBytes !== void 0 ? { requiredBytes } : {},
			serializedBytes
		};
	});
}
/** Reads a bounded active-path tail while preserving transcript line and byte caps. */
function readRecentSessionTranscriptMessageEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			totalMessages: visible.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8 * 1024 * 1024));
		const candidates = readVisibleMessageRange(projection, Math.max(0, visible.total - maxLines), visible.total);
		const selected = [];
		let bytes = 0;
		for (const event of candidates.toReversed()) {
			const eventBytes = Buffer.byteLength(JSON.stringify(event.event)) + 1;
			if (selected.length >= maxMessages || selected.length > 0 && bytes + eventBytes > maxBytes) break;
			selected.push(event);
			bytes += eventBytes;
		}
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: selected.toReversed(),
			totalMessages: visible.total
		};
	});
}
/** Reads one tail-relative message page with index range predicates, never OFFSET scanning. */
function readSessionTranscriptMessageEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const totalMessages = resolveVisibleMessagePositions(projection).total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleMessageRange(projection, start, endExclusive),
			totalMessages
		};
	});
}
/** Reads a tail page whose materialized event payloads fit a hard byte budget. */
function readSessionTranscriptBoundedMessageTailPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const visible = resolveVisibleMessagePositions(projection);
		const snapshot = {
			generation: readTranscriptProjectionGeneration(projection),
			indexedSeq: projection.state.indexedSeq
		};
		const totalMessages = visible.total;
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), totalMessages);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxBytes = Math.max(0, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 0));
		const endExclusive = Math.max(0, totalMessages - offset);
		const positions = resolveVisibleMessagePositionRange(projection, Math.max(0, endExclusive - maxMessages), endExclusive);
		if (positions.length === 0 || maxBytes === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			scannedMessages: positions.length,
			serializedBytes: 0,
			snapshot,
			totalMessages
		};
		const db = getActiveTranscriptKysely(projection.database);
		const metadata = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", sql`LENGTH(CAST(event.event_json AS BLOB)) + 1`.as("serialized_bytes")]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "in", positions).orderBy("active.message_position", "desc")).rows;
		const selectedPositions = [];
		let serializedBytes = 0;
		for (const row of metadata) {
			if (row.message_position === null || serializedBytes + row.serialized_bytes > maxBytes) continue;
			selectedPositions.push(row.message_position);
			serializedBytes += row.serialized_bytes;
		}
		const events = selectedPositions.length === 0 ? [] : executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("active.session_id", "=", projection.resolved.sessionId).where("active.message_position", "in", selectedPositions).orderBy("active.message_position", "asc")).rows.map(parseMessageEventRow);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events,
			scannedMessages: positions.length,
			serializedBytes,
			snapshot,
			totalMessages
		};
	});
}
function readSessionTranscriptMessageEventCount(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => resolveVisibleMessagePositions(projection).total);
}
/** Reads one active message by event id without materializing sibling rows. */
function readSessionTranscriptMessageEventById(scope, messageId) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", messageId).where("active.message_position", "is not", null));
		if (!row || row.message_position === null) return;
		const visible = resolveVisibleMessagePositions(projection);
		return row.message_position >= visible.postStart || visible.kept.includes(row.message_position) ? parseMessageEventRow(row) : void 0;
	});
}
/** Reads a centered active-message page plus one older context row for split rendering. */
function readSessionTranscriptMessageAnchorPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const db = getActiveTranscriptKysely(projection.database);
		const anchor = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).select("active.message_position").where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", options.messageId).where("active.message_position", "is not", null));
		const visible = resolveVisibleMessagePositions(projection);
		const totalMessages = visible.total;
		if (anchor?.message_position === null || anchor?.message_position === void 0) return {
			events: [],
			found: false,
			hasOverreadContext: false,
			offset: 0,
			totalMessages
		};
		const anchorVisiblePosition = anchor.message_position >= visible.postStart ? visible.kept.length + anchor.message_position - visible.postStart : visible.kept.indexOf(anchor.message_position);
		if (anchorVisiblePosition < 0) return {
			events: [],
			found: false,
			hasOverreadContext: false,
			offset: 0,
			totalMessages
		};
		const pageSize = Math.max(1, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 1));
		const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
		const latestStart = Math.max(0, totalMessages - pageSize);
		const start = Math.min(Math.max(0, anchorVisiblePosition - olderMessages), latestStart);
		const endExclusive = Math.min(totalMessages, start + pageSize);
		const readStart = Math.max(0, start - 1);
		return {
			events: readVisibleMessageRange(projection, readStart, endExclusive),
			found: true,
			hasOverreadContext: readStart < start,
			offset: totalMessages - endExclusive,
			totalMessages
		};
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-title-probes.ts
const SESSION_TITLE_PROBE_MESSAGES = 20;
const SESSION_TITLE_PROBE_QUERY_CHUNK_SIZE = 400;
function getTitleProbeKysely(database) {
	return getNodeSqliteKysely(database.db);
}
function parseEventType(eventJson) {
	if (!eventJson) return;
	try {
		const event = JSON.parse(eventJson);
		return typeof event.type === "string" ? event.type : void 0;
	} catch {
		return;
	}
}
function sqliteTranscriptBoundaryEventType() {
	return sql`json_extract(boundary_event.event_json, '$.type')`;
}
function readTitleProbeChunk(database, sessionIds) {
	const db = getTitleProbeKysely(database);
	const rows = runSqliteDeferredTransactionSync(database.db, () => executeSqliteQuerySync(database.db, db.selectFrom("session_windows as window").leftJoin("session_transcript_index_state as state", "state.session_id", "window.session_id").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").leftJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "window.session_id").on("active.message_position", "is not", null).on((eb) => eb.or([eb("active.message_position", "<", SESSION_TITLE_PROBE_MESSAGES), eb("active.message_position", ">=", eb("state.active_message_count", "-", SESSION_TITLE_PROBE_MESSAGES))]))).leftJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select((eb) => [
		"window.session_id",
		"state.active_message_count",
		"state.indexed_seq",
		"state.needs_rebuild",
		"rewrite.generation",
		"active.message_position",
		"event.event_json",
		eb.selectFrom("transcript_events as latest").select("latest.seq").whereRef("latest.session_id", "=", "window.session_id").orderBy("latest.seq", "desc").limit(1).as("latest_seq"),
		eb.selectFrom("session_transcript_active_events as boundary").innerJoin("transcript_events as boundary_event", (join) => join.onRef("boundary_event.session_id", "=", "boundary.session_id").onRef("boundary_event.seq", "=", "boundary.event_seq")).select("boundary_event.event_json").whereRef("boundary.session_id", "=", "window.session_id").where("boundary.message_position", "is", null).where(sqliteTranscriptBoundaryEventType(), "in", ["reset", "compaction"]).orderBy("boundary.active_position", "desc").limit(1).as("latest_boundary_json")
	]).where("window.session_id", "in", sessionIds).orderBy("window.session_id", "asc").orderBy("active.message_position", "asc")).rows, {
		databaseLabel: database.path,
		operationLabel: "sessions.list.title-probes"
	});
	const probes = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const emptyTranscript = row.latest_seq === null;
		const projectionCurrent = row.needs_rebuild === 0 && row.indexed_seq === row.latest_seq;
		if (!emptyTranscript && !projectionCurrent || parseEventType(row.latest_boundary_json) === "reset") continue;
		const totalMessages = row.active_message_count ?? 0;
		const probe = probes.get(row.session_id) ?? {
			generation: row.generation ?? null,
			head: [],
			maxSeq: row.latest_seq ?? null,
			tail: [],
			totalMessages
		};
		if (row.event_json !== null && row.message_position !== null) {
			const event = {
				event: JSON.parse(row.event_json),
				seq: row.message_position + 1
			};
			if (row.message_position < SESSION_TITLE_PROBE_MESSAGES) probe.head.push(event);
			if (row.message_position >= totalMessages - SESSION_TITLE_PROBE_MESSAGES) probe.tail.push(event);
		}
		probes.set(row.session_id, probe);
	}
	return probes;
}
/** Reads bounded title probes in one statement per opened store (chunked for SQLite limits). */
function readSessionTranscriptTitleProbeBatch(scopes) {
	const results = Array.from({ length: scopes.length });
	const groups = /* @__PURE__ */ new Map();
	const targetCache = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const resolved = resolveSqliteTranscriptReadScope(scope, targetCache);
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const group = groups.get(database.path) ?? {
			database,
			items: []
		};
		group.items.push({
			index,
			sessionId: resolved.sessionId
		});
		groups.set(database.path, group);
	}
	for (const group of groups.values()) {
		const sessionIds = [...new Set(group.items.map((item) => item.sessionId))];
		const probes = /* @__PURE__ */ new Map();
		for (let offset = 0; offset < sessionIds.length; offset += SESSION_TITLE_PROBE_QUERY_CHUNK_SIZE) {
			const chunk = sessionIds.slice(offset, offset + SESSION_TITLE_PROBE_QUERY_CHUNK_SIZE);
			for (const [sessionId, probe] of readTitleProbeChunk(group.database, chunk)) probes.set(sessionId, probe);
		}
		for (const item of group.items) results[item.index] = probes.get(item.sessionId);
	}
	return results;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-transcript-watermark.ts
const SESSION_TRANSCRIPT_WATERMARK_QUERY_CHUNK_SIZE = 400;
/** Reads the append and rewrite tokens that validate transcript-derived caches. */
function readSessionTranscriptWatermark(scope) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const db = getNodeSqliteKysely(database.db);
	const maxSeq = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select((eb) => eb.fn.max("seq").as("max_seq")).where("session_id", "=", resolved.sessionId))?.max_seq;
	return {
		generation: executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", resolved.sessionId))?.generation ?? null,
		maxSeq: maxSeq ?? null
	};
}
function readSessionTranscriptWatermarkChunk(database, sessionIds) {
	const db = getNodeSqliteKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_windows as window").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").select((eb) => [
		"window.session_id",
		"rewrite.generation",
		eb.selectFrom("transcript_events as event").select((inner) => inner.fn.max("event.seq").as("max_seq")).whereRef("event.session_id", "=", "window.session_id").as("max_seq")
	]).where("window.session_id", "in", sessionIds)).rows;
	return new Map(rows.map((row) => [row.session_id, {
		generation: row.generation ?? null,
		maxSeq: row.max_seq ?? null
	}]));
}
/** Reads cache-validation tokens in one statement per opened store and SQLite-sized chunk. */
function readSessionTranscriptWatermarkBatch(scopes) {
	const results = Array.from({ length: scopes.length });
	const groups = /* @__PURE__ */ new Map();
	const targetCache = /* @__PURE__ */ new Map();
	for (const [index, scope] of scopes.entries()) {
		const resolved = resolveSqliteTranscriptReadScope(scope, targetCache);
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const group = groups.get(database.path) ?? {
			database,
			items: []
		};
		group.items.push({
			index,
			sessionId: resolved.sessionId
		});
		groups.set(database.path, group);
	}
	for (const group of groups.values()) {
		const sessionIds = [...new Set(group.items.map((item) => item.sessionId))];
		const watermarks = /* @__PURE__ */ new Map();
		for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_WATERMARK_QUERY_CHUNK_SIZE) {
			const chunk = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_WATERMARK_QUERY_CHUNK_SIZE);
			for (const [sessionId, watermark] of readSessionTranscriptWatermarkChunk(group.database, chunk)) watermarks.set(sessionId, watermark);
		}
		for (const item of group.items) results[item.index] = watermarks.get(item.sessionId) ?? {
			generation: null,
			maxSeq: null
		};
	}
	return results.map((result) => result ?? {
		generation: null,
		maxSeq: null
	});
}
//#endregion
export { rewriteTranscriptEventRowsExact as $, loadSessionEntryReadOnly as $t, trimSessionTranscriptForManualCompact as A, purgeDeletedAgentSessionEntries as At, switchSessionBranch as B, updateResolvedSessionEntry as Bt, appendTranscriptMessages as C, preserveTemporarySessionMapping as Ct, resolveSessionTranscriptReadTarget as D, applySessionEntryLifecycleMutation as Dt, resolveSessionTranscriptDatabasePath as E, inheritSessionSelection as Et, persistSessionResetLifecycle as F, openSessionEntryReadView as Ft, resolveSessionAbortTarget as G, listSessionChildEntriesReadOnly as Gt, createSessionEntryWithTranscript as H, countSessionEntryRowsReadOnly as Ht, forkSessionAtMessage as I, patchSessionEntryWithKey as It, appendTranscriptEventSync as J, listSessionEntryKeysReadOnly as Jt, updateSessionEntry as K, listSessionEntriesByStatus as Kt, listSessionBranches as L, resolveSessionEntryAccessTarget as Lt, SessionInitializationAgentScopeMismatchError as M, loadExactSessionEntryReadOnlyResult as Mt, commitReplySessionInitialization as N, readSessionIdentityEvidence as Nt, resolveSessionTranscriptRuntimeTarget as O, applySessionEntryReplacements as Ot, loadReplySessionInitializationSnapshot as P, listSessionEntriesCore as Pt, replaceTranscriptEventsSync as Q, loadSessionEntry as Qt, resolveSessionTranscriptActiveLeafEntryId as R, resolveSessionEntryCandidateTarget as Rt, readClosedTranscriptTurn as S, cleanupPluginHostSessionStore as St, resolveConcreteSessionStorePath as T, SessionLabelOwnerIndex as Tt, forkSessionFromParentTranscript as U, ensureSessionEntrySync as Ut, recoverSessionEntryFromRestartTombstone as V, clearPluginOwnedSessionState as Vt, markSessionAbortTarget as W, hasSessionEntriesByStatusReadOnly as Wt, appendTranscriptMessageSync as X, loadExactSessionEntry as Xt, appendTranscriptMessage as Y, listSessionTranscriptInstances as Yt, replaceTranscriptEvents as Z, loadExactSessionEntryReadOnly as Zt, resolveVisibleMessagePositions as _, sessionEntryForkedFromParent as _n, toOpenAiChatCompletionsUsage as _t, readRecentSessionTranscriptMessageEvents as a, replaceSessionEntrySync as an, getCliSessionBinding as at, SessionTranscriptProjectionUnavailableError as b, applySessionPatchProjections as bt, readSessionTranscriptBoundedMessageTailPage as c, updateSessionLastRoute as cn, rebindCliSessionReseedReceiptsForReset as ct, readSessionTranscriptMessageEventCount as d, bindOwnedSessionTranscriptWrites as dn, deriveContextPromptTokens as dt, patchSessionEntryCore as en, withTranscriptWriteLock as et, readSessionTranscriptMessageEventPage as f, getOwnedSessionTranscriptWriterFence as fn, derivePromptTokens as ft, readVisibleMessageRange as g, buildSessionCreationStamp as gn, normalizeUsage as gt, MAX_VISIBLE_MESSAGE_MAX_MESSAGES as h, resolveSessionStorePathForScope as hn, makeZeroUsageSnapshot as ht, readRecentSessionTranscriptActiveEvents as i, replaceSessionEntry as in, clearAllCliSessions as it, readTranscriptRawDelta as j, applySessionEntryCanonicalReplacements as jt, preflightSessionTranscriptForManualCompact as k, applySessionStoreProjection as kt, readSessionTranscriptMessageAnchorPage as l, upsertSessionEntryCore as ln, forkSessionEntryFromParentTarget as lt, readSessionTranscriptVisibleMessageDeltaCore as m, withOwnedSessionTranscriptWrites as mn, hasNonzeroUsage as mt, readSessionTranscriptWatermarkBatch as n, readSessionUpdatedAtCore as nn, sessionMatchesExpectedTranscriptTurn as nt, readSessionTranscriptActivePathEntryRelation as o, resolveSessionEntry as on, getCliSessionId as ot, readSessionTranscriptMessageEvents as p, runWithoutOwnedSessionTranscriptWrites as pn, deriveSessionTotalTokens as pt, appendTranscriptEvent as q, listSessionEntriesReadOnly as qt, readSessionTranscriptTitleProbeBatch as r, recordInboundSessionMeta as rn, readActiveTranscriptEntryAnchor as rt, readSessionTranscriptActiveStats as s, resolveSessionKeyBySessionId as sn, normalizeCliSessionReseedReceipt as st, readSessionTranscriptWatermark as t, patchSessionEntryTarget as tn, withTranscriptWriteTransaction as tt, readSessionTranscriptMessageEventById as u, SessionTranscriptWriterClaimReboundError as un, resolveSessionParentForkDecision as ut, getActiveTranscriptKysely as v, isInternalSessionEffectsKey as vn, toOpenAiResponsesUsage as vt, persistSessionTranscriptTurn as w, restoreSessionFromCompactionCheckpoint as wt, isSessionTranscriptProjectionUnavailableError as x, branchSessionFromCompactionCheckpoint as xt, withCurrentProjectionSnapshot as y, resolveInternalSessionEffectsIdentity as yn, applySessionPatchProjection as yt, rewindSessionToMessage as z, resolveSessionEntrySelection as zt };
