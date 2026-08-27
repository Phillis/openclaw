import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "./paths-DVAvlIOc.js";
import { n as getRuntimeConfig } from "./io-DlN5njvP.js";
import { a as getChildLogger } from "./logger-ij8OHrrv.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { g as openOpenClawAgentDatabase } from "./openclaw-agent-db-CM8nAOgX.js";
import { B as resolveOpenClawAgentSqlitePath, R as isIncognitoOpenClawAgentSqlitePath, z as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-CRlF3oxo.js";
import { A as assertCanonicalSessionKeyWrite, L as coerceSqliteNumber, M as canonicalSessionKeyMigrationRequiredError, R as createFallbackSessionEntry, X as assertSessionEntrySelectionUnchanged, Y as assertLifecycleTargetSnapshotUnchanged, _ as readSessionIdentitySnapshot, b as writeSessionEntry, d as readLifecycleTargetSnapshot, et as readSessionEntryCache, f as readSessionEntryCount, ft as runPreparedSqliteSessionWrite, g as readSessionEntryStore, gt as deriveSessionMetaPatch, h as readSessionEntrySelectionSnapshot, ht as deriveLastRoutePatch, j as assertCanonicalSqliteSessionKeysCurrent, m as readSessionEntryRow, mt as withSqliteSessionDeletions, n as createSessionIdentitySnapshot, nt as parseSessionEntryJson, pt as runSqliteSessionDeletionTransaction, r as deleteLegacySessionEntryRows, rt as readSessionEntriesByStatus, s as parseReadableSqliteSessionEntryRow, st as buildSessionCreationStamp, u as readExactSessionEntryRowValidated, v as rehomeSessionWindows, z as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { a as normalizeStoreSessionKey, o as resolveDeliveryProvenCanonicalSessionKey, t as collectSessionEntryLookupKeys } from "./store-entry-CwpzgKGD.js";
import { c as resolveSqliteScope, d as resolveSqliteTranscriptReadScope, i as getSessionKysely, l as resolveSqliteStoreScope, m as toDatabaseOptions, p as runExclusiveSqliteSessionWrite, t as cloneSessionEntry, u as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { i as kickSessionHistoryDiskBudgetMaintenance, o as emitCommittedSessionEntryRemovals, s as emitCommittedSessionIdentityDiff } from "./session-history-eviction-6hHpt56d.js";
import { i as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-CVw8YIdK.js";
import { d as readSessionGenerationIdsForKeys, i as deletePlannedLifecycleArtifactEntries, m as publishSessionStateArchives, n as collectProjectedReferencedSessionIds, r as deleteMaterializedSessionStatePlans, s as planSessionStateDeleteIfUnreferenced, t as assertPlannedLifecycleArtifactEntriesUnchanged } from "./session-accessor.sqlite-lifecycle-state-DAt_gV_K.js";
import { f as collectSessionMaintenancePreserveKeys, i as mergeSessionEntryPreserveActivity, p as collectSessionMaintenancePreserveKeysForStore, r as mergeSessionEntry } from "./types-BEJRKmOU.js";
import { _ as shouldPreserveMaintenanceEntry, c as archiveStaleDashboardEntries, f as normalizeResolvedMaintenanceConfigInput, l as capEntryCount, m as pruneStaleModelRunEntries, p as pruneStaleEntries, s as resolveMaintenanceConfig, v as shouldRunModelRunPrune, y as shouldRunSessionEntryMaintenance } from "./disk-budget-DJbD0obL.js";
import { o as withOwnedSessionTranscriptWriterFence, t as SessionTranscriptWriterClaimReboundError } from "./transcript-write-context-LK0MNWC3.js";
import crypto from "node:crypto";
import { sql } from "kysely";
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
const MAX_SESSION_MAINTENANCE_BATCH_ENTRIES = 64;
const MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES = 64 * 1024 * 1024;
const SESSION_TRANSCRIPT_BYTE_QUERY_BATCH = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
function buildSessionMaintenanceBatches(params) {
	const parent = params.entryRemovals.map((_, index) => index);
	const find = (index) => {
		let root = index;
		while (parent[root] !== root) root = parent[root] ?? root;
		let current = index;
		while (parent[current] !== current) {
			const next = parent[current] ?? root;
			parent[current] = root;
			current = next;
		}
		return root;
	};
	const union = (left, right) => {
		const leftRoot = find(left);
		const rightRoot = find(right);
		if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
	};
	const removalIndexesBySessionId = /* @__PURE__ */ new Map();
	const removalIndexBySessionKey = /* @__PURE__ */ new Map();
	const addRemovalIndex = (sessionId, index) => {
		const indexes = removalIndexesBySessionId.get(sessionId) ?? [];
		if (indexes.includes(index)) return;
		if (indexes.length > 0) union(indexes[0] ?? index, index);
		indexes.push(index);
		removalIndexesBySessionId.set(sessionId, indexes);
	};
	for (const [index, removal] of params.entryRemovals.entries()) {
		if (!removal.expectedEntry) continue;
		removalIndexBySessionKey.set(removal.sessionKey, index);
		for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) addRemovalIndex(sessionId, index);
	}
	for (const plan of params.stateDeletePlans) {
		const ownerIndex = plan.snapshot.sessionKey ? removalIndexBySessionKey.get(plan.snapshot.sessionKey) : void 0;
		if (ownerIndex !== void 0) addRemovalIndex(plan.sessionId, ownerIndex);
	}
	const groupsByRoot = /* @__PURE__ */ new Map();
	for (const [index, removal] of params.entryRemovals.entries()) {
		const root = find(index);
		const group = groupsByRoot.get(root) ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: index,
			stateDeletePlans: [],
			workItems: 0
		};
		group.entryRemovals.push(removal);
		group.order = Math.min(group.order, index);
		groupsByRoot.set(root, group);
	}
	const plansBySessionId = /* @__PURE__ */ new Map();
	for (const plan of params.stateDeletePlans) {
		const plans = plansBySessionId.get(plan.sessionId) ?? [];
		plans.push(plan);
		plansBySessionId.set(plan.sessionId, plans);
	}
	const standaloneGroups = [];
	let standaloneOrder = params.entryRemovals.length;
	for (const [sessionId, plans] of plansBySessionId) {
		const removalIndex = removalIndexesBySessionId.get(sessionId)?.[0];
		const removalGroup = removalIndex === void 0 ? void 0 : groupsByRoot.get(find(removalIndex));
		const group = removalGroup ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: standaloneOrder++,
			stateDeletePlans: [],
			workItems: 0
		};
		group.stateDeletePlans.push(...plans);
		if (plans.some((plan) => plan.archiveTranscript)) group.archiveBytes += params.archiveBytesBySessionId.get(sessionId) ?? 0;
		if (!removalGroup) standaloneGroups.push(group);
	}
	const groups = [...groupsByRoot.values(), ...standaloneGroups].map((group) => {
		group.workItems = Math.max(group.entryRemovals.length, new Set(group.stateDeletePlans.map((plan) => plan.sessionId)).size);
		return group;
	}).toSorted((left, right) => left.order - right.order);
	const batches = [];
	let batch = {
		archiveBytes: 0,
		entryRemovals: [],
		stateDeletePlans: [],
		workItems: 0
	};
	const flush = () => {
		if (batch.workItems === 0) return;
		batches.push(batch);
		batch = {
			archiveBytes: 0,
			entryRemovals: [],
			stateDeletePlans: [],
			workItems: 0
		};
	};
	for (const group of groups) {
		const exceedsEntryLimit = batch.workItems > 0 && batch.workItems + group.workItems > MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
		const exceedsByteLimit = batch.workItems > 0 && batch.archiveBytes + group.archiveBytes > MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES;
		if (exceedsEntryLimit || exceedsByteLimit) flush();
		batch.archiveBytes += group.archiveBytes;
		batch.entryRemovals.push(...group.entryRemovals);
		batch.stateDeletePlans.push(...group.stateDeletePlans);
		batch.workItems += group.workItems;
	}
	flush();
	return batches;
}
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
function hasStaleSqliteSessionEntryCandidate(database, maxAgeMs, isCandidate) {
	if (maxAgeMs <= 0) return false;
	const cutoffMs = Date.now() - maxAgeMs;
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select(["entry_json", "session_key"]).where("updated_at", "<", cutoffMs).where("archived_at", "is", null).orderBy("updated_at", "asc")).rows.some((row) => {
		const entry = parseSessionEntryJson(row);
		if (!entry) return false;
		return isCandidate(normalizeStoreSessionKey(row.session_key), entry);
	});
}
async function readSessionTranscriptJsonlBytes(scope, sessionIds) {
	const bytesBySessionId = /* @__PURE__ */ new Map();
	for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_BYTE_QUERY_BATCH) {
		const batch = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_BYTE_QUERY_BATCH);
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		const opened = withOpenClawAgentDatabaseReadOnly((database) => {
			const db = getSessionKysely(database.db);
			return executeSqliteQuerySync(database.db, db.selectFrom("transcript_events").select(["session_id", sql`SUM(LENGTH(CAST(event_json AS BLOB)) + 1)`.as("jsonl_bytes")]).where("session_id", "in", batch).groupBy("session_id")).rows;
		}, toDatabaseOptions(scope));
		if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
		for (const row of opened.value) bytesBySessionId.set(row.session_id, Number(row.jsonl_bytes));
	}
	return bytesBySessionId;
}
function applySessionEntryMaintenance(database, params) {
	if (params.skipMaintenance) return {
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return {
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const entryCount = readSessionEntryCount(database);
	const preserveCandidateKeys = collectSessionMaintenancePreserveKeys([params.activeSessionKey]);
	const hasStaleCandidate = hasStaleSqliteSessionEntryCandidate(database, maintenance.pruneAfterMs, (key, entry) => !shouldPreserveMaintenanceEntry({
		key,
		entry,
		preserveKeys: preserveCandidateKeys,
		preserveRecentMs: maintenance.preserveRecentMs ?? null
	}));
	const hasStaleDashboardCandidate = maintenance.archiveDashboardAfterMs != null && hasStaleSqliteSessionEntryCandidate(database, maintenance.archiveDashboardAfterMs, (key, entry) => archiveStaleDashboardEntries({ [key]: entry }, maintenance.archiveDashboardAfterMs, {
		log: false,
		preserveKeys: preserveCandidateKeys
	}) > 0);
	if (!(params.forceMaintenance === true || entryCount > maintenance.maxEntries || hasStaleDashboardCandidate || hasStaleCandidate || shouldRunModelRunPrune({
		maintenance,
		entryCount,
		force: params.forceMaintenance
	}) || shouldRunSessionEntryMaintenance({
		entryCount,
		maxEntries: maintenance.maxEntries,
		force: params.forceMaintenance
	}))) return {
		entryRemovals: [],
		stateDeletePlans: [],
		archived: 0,
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	const store = readSessionEntryStore(database);
	const preserveKeys = collectSessionMaintenancePreserveKeysForStore({
		storePath: params.storePath,
		store,
		baseKeys: collectSqliteSessionMaintenanceBaseKeys(store, params.activeSessionKey)
	}) ?? /* @__PURE__ */ new Set();
	const removedKeys = /* @__PURE__ */ new Set();
	const removedEntriesByKey = /* @__PURE__ */ new Map();
	const removalReasonsByKey = /* @__PURE__ */ new Map();
	const removedSessionIds = /* @__PURE__ */ new Set();
	const rememberRemovedEntry = (maintenanceReason) => (removed) => {
		removedKeys.add(removed.key);
		removedEntriesByKey.set(removed.key, cloneSessionEntry(removed.entry));
		removalReasonsByKey.set(removed.key, maintenanceReason);
		for (const sessionId of collectSessionStateIdsForEntry(removed.entry)) removedSessionIds.add(sessionId);
	};
	let remainingEntryCount = entryCount;
	let modelRunPruned = 0;
	if (shouldRunModelRunPrune({
		maintenance,
		entryCount: remainingEntryCount,
		force: params.forceMaintenance
	})) {
		modelRunPruned = pruneStaleModelRunEntries(store, maintenance.modelRunPruneAfterMs, {
			log: false,
			onPruned: rememberRemovedEntry("model-run-pruned"),
			preserveKeys,
			preserveRecentMs: maintenance.preserveRecentMs
		});
		remainingEntryCount -= modelRunPruned;
	}
	const archived = archiveStaleDashboardEntries(store, maintenance.archiveDashboardAfterMs, {
		log: false,
		onArchived: ({ key, entry }) => {
			writeSessionEntry(database, key, entry);
		},
		preserveKeys
	});
	let pruned = 0;
	if (params.forceMaintenance === true || hasStaleCandidate || remainingEntryCount > maintenance.maxEntries) {
		pruned = pruneStaleEntries(store, maintenance.pruneAfterMs, {
			log: false,
			onPruned: rememberRemovedEntry("pruned"),
			preserveKeys,
			preserveRecentMs: maintenance.preserveRecentMs
		});
		remainingEntryCount -= pruned;
	}
	let capped = 0;
	if (shouldRunSessionEntryMaintenance({
		entryCount: remainingEntryCount,
		maxEntries: maintenance.maxEntries,
		force: params.forceMaintenance
	})) capped = capEntryCount(store, maintenance.maxEntries, {
		log: false,
		onCapped: rememberRemovedEntry("capped"),
		preserveKeys,
		preserveRecentMs: maintenance.preserveRecentMs
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
		entryRemovals: [...removedEntriesByKey].map(([sessionKey, entry]) => ({
			expectedEntry: entry,
			maintenanceReason: removalReasonsByKey.get(sessionKey),
			sessionKey
		})),
		stateDeletePlans: deletePlans,
		archived,
		modelRunPruned,
		pruned,
		capped
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
	const warn = (message, error, warnedStateDeletePlans) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn(message, {
			agentId: scope.agentId,
			error,
			path: scope.path,
			sessionIds: uniqueStrings(warnedStateDeletePlans.map((plan) => plan.sessionId))
		});
	};
	const committedCounts = {
		archived: plans.reduce((count, plan) => count + plan.archived, 0),
		modelRunPruned: 0,
		pruned: 0,
		capped: 0
	};
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) return {
		archivedTranscripts: [],
		...committedCounts
	};
	let archiveBytesBySessionId;
	try {
		archiveBytesBySessionId = await readSessionTranscriptJsonlBytes(scope, stateDeletePlans.filter((plan) => plan.archiveTranscript).map((plan) => plan.sessionId));
	} catch (error) {
		warn("SQLite session maintenance archive sizing failed", error, stateDeletePlans);
		return {
			archivedTranscripts: [],
			...committedCounts
		};
	}
	const publishedTranscripts = [];
	for (const batch of buildSessionMaintenanceBatches({
		archiveBytesBySessionId,
		entryRemovals,
		stateDeletePlans
	})) {
		let archivedTranscripts;
		try {
			const materializedPlans = await materializeSessionStateDeletePlans(batch.stateDeletePlans);
			archivedTranscripts = await withSqliteSessionDeletions(scope, batch.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
				entry,
				sessionKey
			}] : []), async () => await commit(() => {
				let committed = [];
				runSqliteSessionDeletionTransaction((database) => {
					assertPlannedLifecycleArtifactEntriesUnchanged(database, batch.entryRemovals);
					committed = deleteMaterializedSessionStatePlans(database, materializedPlans, void 0, new Set(batch.entryRemovals.map((removal) => removal.sessionKey)));
					deletePlannedLifecycleArtifactEntries(database, batch.entryRemovals);
				}, toDatabaseOptions(scope));
				return committed;
			}));
		} catch (error) {
			warn("SQLite session maintenance cleanup failed", error, batch.stateDeletePlans);
			break;
		}
		emitCommittedSessionEntryRemovals(batch.entryRemovals);
		for (const removal of batch.entryRemovals) if (removal.maintenanceReason === "model-run-pruned") committedCounts.modelRunPruned += 1;
		else if (removal.maintenanceReason === "pruned") committedCounts.pruned += 1;
		else if (removal.maintenanceReason === "capped") committedCounts.capped += 1;
		try {
			publishedTranscripts.push(...await publishSessionStateArchives(scope, archivedTranscripts));
		} catch (error) {
			warn("SQLite session maintenance archive publication failed", error, batch.stateDeletePlans);
		}
	}
	return {
		archivedTranscripts: publishedTranscripts,
		...committedCounts
	};
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
//#region src/config/sessions/session-accessor.sqlite-entry.ts
function assertCanonicalSessionWriteScope(scope) {
	assertCanonicalSessionKeyWrite(scope.sessionKey, scope.agentId);
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
/** Lists persisted session keys without materializing their entry JSON. */
function listSessionEntryKeysReadOnly(scope = {}) {
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select("session_key").orderBy("session_key")).rows.map((row) => row.session_key);
	}, toDatabaseOptions(resolveSqliteScope({
		...scope,
		sessionKey: ""
	})));
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
		assertCanonicalSqliteSessionKeysCurrent(database);
		const db = getSessionKysely(database.db);
		return executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").selectAll().where((expression) => expression.or([expression("parent_session_key", "=", resolved.sessionKey), expression("spawned_by", "=", resolved.sessionKey)])).where("session_key", "!=", resolved.sessionKey).orderBy("session_key", "asc")).rows.flatMap((row) => {
			if (isInternalSessionEffectsKey(row.session_key)) return [];
			const entry = parseReadableSqliteSessionEntryRow(database, row);
			return entry ? [{
				sessionKey: row.session_key,
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
	runSqliteSessionDeletionTransaction((database) => {
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
	runSqliteSessionDeletionTransaction((database) => {
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
	const committed = await runPreparedSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const prepared = params.readSnapshot(database);
		const existing = params.existingEntry(prepared);
		const writeBase = existing ?? options.fallbackEntry;
		if (!writeBase) return {
			deletedEntries: [],
			commit: () => ({
				maintenancePlans: [],
				result: null
			})
		};
		const patch = await params.update(cloneSessionEntry(writeBase), { existingEntry: existing ? cloneSessionEntry(existing) : void 0 });
		const merged = !patch ? void 0 : options.replaceEntry ? cloneSessionEntry(patch) : options.preserveActivity ? mergeSessionEntryPreserveActivity(writeBase, patch) : mergeSessionEntry(writeBase, patch);
		const next = !merged ? void 0 : options.replaceEntry ? merged : preserveSqliteSameKeySessionRolloverLineage({
			next: merged,
			previous: writeBase,
			sessionKey
		});
		return {
			deletedEntries: next ? params.snapshotRows(prepared).filter((row) => row.sessionKey !== sessionKey) : [],
			commit: () => {
				const maintenancePlans = [];
				let result = null;
				let previousIdentity = /* @__PURE__ */ new Map();
				let currentIdentity = /* @__PURE__ */ new Map();
				runSqliteSessionDeletionTransaction((writeDatabase) => {
					const fresh = params.readSnapshot(writeDatabase);
					params.assertSnapshotUnchanged(prepared, fresh);
					options.assertCommitAllowed?.();
					if (!next) {
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
			}
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
		...params.assertCommitAllowed ? { assertCommitAllowed: params.assertCommitAllowed } : {},
		...createIfMissing ? { fallbackEntry: mergeSessionEntry(void 0, {}) } : {}
	});
}
/** Writes the forked child's transcript rows (copied branch or header-only). */
//#endregion
export { isInternalSessionEffectsKey as A, upsertSessionEntryCore as C, applySessionEntryMaintenance as D, sessionEntryForkedFromParent as E, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as O, updateSessionLastRoute as S, preserveSqliteSameKeySessionRolloverLineage as T, recordInboundSessionMeta as _, listSessionEntriesByStatus as a, resolveSessionEntry as b, listSessionEntryRows as c, loadExactSessionEntryReadOnly as d, loadSessionEntry as f, readSessionUpdatedAtCore as g, patchSessionEntryTarget as h, listSessionChildEntriesReadOnly as i, resolveInternalSessionEffectsIdentity as j, finalizeSessionEntryMaintenancePlansBestEffort as k, listSessionTranscriptInstances as l, patchSessionEntryCore as m, ensureSessionEntrySync as n, listSessionEntriesReadOnly as o, loadSessionEntryReadOnly as p, hasSessionEntriesByStatusReadOnly as r, listSessionEntryKeysReadOnly as s, countSessionEntryRowsReadOnly as t, loadExactSessionEntry as u, replaceSessionEntry as v, resolveSessionStorePathForScope as w, resolveSessionKeyBySessionId as x, replaceSessionEntrySync as y };
