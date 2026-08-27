import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton, r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { An as executeSqliteQuerySync } from "./openclaw-state-db-CeAO_dqo.js";
import { g as openOpenClawAgentDatabase, y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CM8nAOgX.js";
import { R as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { p as runExclusiveSessionLifecycleMutation, r as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-1qqb7Ac0.js";
import { nt as parseSessionEntryJson, z as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { _ as runQueuedStoreWrite, a as normalizeStoreSessionKey } from "./store-entry-CwpzgKGD.js";
import { c as resolveSqliteScope, i as getSessionKysely, m as toDatabaseOptions, p as runExclusiveSqliteSessionWrite, u as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { i as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-archive-CVw8YIdK.js";
import { h as emitArchivedTranscriptUpdates, l as readReferencedSessionIds, m as publishSessionStateArchives, r as deleteMaterializedSessionStatePlans, s as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-lifecycle-state-DAt_gV_K.js";
import { d as isRecentSessionMaintenanceEntry, i as pruneSessionTranscriptArchivesToHighWater, n as hasRetainedSessionTranscriptArchives, r as measureSessionPhysicalDiskUsage, s as resolveMaintenanceConfig } from "./disk-budget-DJbD0obL.js";
import fs from "node:fs";
import path from "node:path";
//#region src/sessions/session-lifecycle-events.ts
/** Session lifecycle event broadcast to observers when a session is created or linked. */
const SESSION_LIFECYCLE_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionLifecycleEventListeners"), "close-and-restart");
const SESSION_IDENTITY_MUTATION_LISTENERS = resolveGlobalSet(Symbol.for("openclaw.sessionIdentityMutationListeners"), "close-and-restart");
const SESSION_IDENTITY_MUTATION_STATE = resolveGlobalSingleton(Symbol.for("openclaw.sessionIdentityMutationState"), () => ({ version: 0 }));
/** Registers a session lifecycle listener. */
function onSessionLifecycleEvent(listener) {
	SESSION_LIFECYCLE_LISTENERS.add(listener);
	return () => {
		SESSION_LIFECYCLE_LISTENERS.delete(listener);
	};
}
/** Emits a best-effort session lifecycle event to all listeners. */
function emitSessionLifecycleEvent(event) {
	for (const listener of SESSION_LIFECYCLE_LISTENERS) try {
		listener(event);
	} catch {}
}
function onSessionIdentityMutation(listener) {
	SESSION_IDENTITY_MUTATION_LISTENERS.add(listener);
	return () => {
		SESSION_IDENTITY_MUTATION_LISTENERS.delete(listener);
	};
}
/** Monotonic fence for projections that consume session identities across owner boundaries. */
function readSessionIdentityMutationVersion() {
	return SESSION_IDENTITY_MUTATION_STATE.version;
}
function emitSessionIdentityMutation(mutation) {
	SESSION_IDENTITY_MUTATION_STATE.version += 1;
	for (const listener of SESSION_IDENTITY_MUTATION_LISTENERS) try {
		listener(mutation);
	} catch {}
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-identity.ts
function toSessionIdentityTarget(entry, sessionKeys) {
	const sessionId = normalizeOptionalString(entry?.sessionId);
	return {
		...sessionId ? { sessionId } : {},
		sessionKeys
	};
}
function emitCommittedSessionEntryRemoval(sessionKey, entry) {
	emitSessionIdentityMutation({
		kind: "delete",
		previous: toSessionIdentityTarget(entry, [sessionKey])
	});
}
function emitCommittedSessionEntryRemovals(removals) {
	const emittedKeys = /* @__PURE__ */ new Set();
	for (const removal of removals) {
		if (emittedKeys.has(removal.sessionKey)) continue;
		emittedKeys.add(removal.sessionKey);
		emitCommittedSessionEntryRemoval(removal.sessionKey, removal.expectedEntry);
	}
}
function emitCommittedSessionEntryChange(params) {
	const previous = toSessionIdentityTarget(params.previousEntry, [params.previousKey]);
	const current = toSessionIdentityTarget(params.currentEntry, [params.currentKey]);
	const moved = params.previousKey !== params.currentKey;
	if (!moved && previous.sessionId === current.sessionId) return;
	emitSessionIdentityMutation({
		kind: moved ? "move" : "replace",
		previous,
		current
	});
}
function emitCommittedSessionIdentityDiff(previous, current) {
	const currentKeysBySessionId = /* @__PURE__ */ new Map();
	for (const [sessionKey, entry] of current) {
		const sessionId = normalizeOptionalString(entry.sessionId);
		if (sessionId) currentKeysBySessionId.set(sessionId, [...currentKeysBySessionId.get(sessionId) ?? [], sessionKey]);
	}
	const movedKeysByCurrentKey = /* @__PURE__ */ new Map();
	const handledPreviousKeys = /* @__PURE__ */ new Set();
	const handledCurrentKeys = /* @__PURE__ */ new Set();
	for (const [sessionKey, entry] of previous) {
		if (current.has(sessionKey)) continue;
		const sessionId = normalizeOptionalString(entry.sessionId);
		const currentKeys = sessionId ? currentKeysBySessionId.get(sessionId) : void 0;
		if (currentKeys?.length !== 1) continue;
		const [currentKey] = currentKeys;
		if (!currentKey) continue;
		movedKeysByCurrentKey.set(currentKey, [...movedKeysByCurrentKey.get(currentKey) ?? [], sessionKey]);
		handledPreviousKeys.add(sessionKey);
		handledCurrentKeys.add(currentKey);
	}
	for (const [currentKey, previousKeys] of movedKeysByCurrentKey) {
		const currentEntry = current.get(currentKey);
		if (currentEntry) emitSessionIdentityMutation({
			kind: "move",
			previous: toSessionIdentityTarget(currentEntry, previousKeys),
			current: toSessionIdentityTarget(currentEntry, [currentKey])
		});
	}
	for (const [sessionKey, previousEntry] of previous) {
		const currentEntry = current.get(sessionKey);
		if (currentEntry) {
			handledCurrentKeys.add(sessionKey);
			emitCommittedSessionEntryChange({
				currentEntry,
				currentKey: sessionKey,
				previousEntry,
				previousKey: sessionKey
			});
		} else if (!handledPreviousKeys.has(sessionKey)) emitCommittedSessionEntryRemoval(sessionKey, previousEntry);
	}
	for (const [sessionKey, currentEntry] of current) {
		if (handledCurrentKeys.has(sessionKey)) continue;
		emitSessionIdentityMutation({
			kind: "create",
			previous: { sessionKeys: [] },
			current: toSessionIdentityTarget(currentEntry, [sessionKey])
		});
	}
}
function emitCommittedLifecycleIdentityMutations(params) {
	const removedKeys = new Set(params.removedSessionKeys);
	const previous = new Map(params.projected.removals.filter((removal) => removedKeys.has(removal.sessionKey)).map((removal) => [removal.sessionKey, removal.expectedEntry]));
	const current = /* @__PURE__ */ new Map();
	for (const upsert of params.projected.upsertedEntries) {
		if (!current.has(upsert.sessionKey) && upsert.expectedEntry) previous.set(upsert.sessionKey, upsert.expectedEntry);
		current.set(upsert.sessionKey, upsert.entry);
	}
	emitCommittedSessionIdentityDiff(previous, current);
}
//#endregion
//#region src/config/sessions/session-history-eviction.ts
function createPhysicalBudgetResult(params) {
	const totalBytesAfter = params.totalBytesAfter ?? params.totalBytesBefore;
	return {
		totalBytesBefore: params.totalBytesBefore,
		totalBytesAfter,
		removedFiles: params.removedFiles ?? 0,
		removedEntries: params.removedEntries ?? 0,
		freedBytes: Math.max(0, params.totalBytesBefore - totalBytesAfter),
		maxBytes: params.maxBytes,
		highWaterBytes: params.highWaterBytes,
		overBudget: params.totalBytesBefore > params.maxBytes
	};
}
/** Reports the same physical total enforce mode compares, without projecting logical row bytes. */
async function inspectSqliteSessionHistoryDiskBudget(params) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return {
		diskBudget: null,
		wouldMutate: false
	};
	const diskBudget = createPhysicalBudgetResult({
		totalBytesBefore: (await measureSessionPhysicalDiskUsage(params.storePath)).totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	if (!diskBudget.overBudget || params.mode !== "enforce") return {
		diskBudget,
		wouldMutate: false
	};
	const databaseOptions = toDatabaseOptions(resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: "",
		storePath: params.storePath
	}));
	if (hasCanonicalSessionTranscriptArchives(databaseOptions) || await hasRetainedSessionTranscriptArchives(params.storePath)) return {
		diskBudget,
		wouldMutate: true
	};
	return {
		diskBudget,
		wouldMutate: readHistoricalSessionIds({
			databaseOptions,
			preserveRecentMs: params.maintenance.preserveRecentMs,
			storePath: params.storePath
		}).length > 0
	};
}
function collectProtectedHistoricalSessionIds(params) {
	const protectedSessionIds = readReferencedSessionIds(params.database);
	for (const sessionId of collectAdmissionProtectedSessionIds(params)) protectedSessionIds.add(sessionId);
	return protectedSessionIds;
}
function collectRecentSessionHistoryIds(params) {
	if (params.preserveRecentMs == null) return /* @__PURE__ */ new Set();
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_nodes.current_session_id",
		"session_nodes.entry_json",
		"session_nodes.session_key",
		"session_nodes.updated_at",
		"session_windows.session_id"
	])).rows;
	return new Set(rows.flatMap((row) => {
		const entry = parseSessionEntryJson(row);
		return entry && isRecentSessionMaintenanceEntry({
			key: row.session_key,
			entry,
			preserveRecentMs: params.preserveRecentMs
		}) ? [row.session_id] : [];
	}));
}
function isRecentHistoricalSessionId(params) {
	if (params.preserveRecentMs == null) return false;
	const db = getSessionKysely(params.database.db);
	const row = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").innerJoin("session_nodes", "session_nodes.session_key", "session_windows.session_key").select([
		"session_nodes.current_session_id",
		"session_nodes.entry_json",
		"session_nodes.session_key",
		"session_nodes.updated_at"
	]).where("session_windows.session_id", "=", params.sessionId)).rows[0];
	if (!row) return false;
	const entry = parseSessionEntryJson(row);
	return Boolean(entry && isRecentSessionMaintenanceEntry({
		key: row.session_key,
		entry,
		preserveRecentMs: params.preserveRecentMs
	}));
}
function collectCandidateProtectedHistoricalSessionIds(params) {
	const protectedSessionIds = collectProtectedHistoricalSessionIds(params);
	if (isRecentHistoricalSessionId(params)) protectedSessionIds.add(params.sessionId);
	return protectedSessionIds;
}
/** Session ids owned by in-flight work admissions, without live-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	const protectedSessionIds = /* @__PURE__ */ new Set();
	const admissionIdentities = collectActiveSessionWorkAdmissions().get(params.storePath) ?? /* @__PURE__ */ new Set();
	if (admissionIdentities.size === 0) return protectedSessionIds;
	for (const identity of admissionIdentities) protectedSessionIds.add(identity);
	const normalizedAdmissionKeys = new Set([...admissionIdentities].map((identity) => normalizeStoreSessionKey(identity)));
	const db = getSessionKysely(params.database.db);
	const rows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_nodes").select([
		"entry_json",
		"current_session_id",
		"session_key"
	])).rows;
	for (const row of rows) {
		if (!normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) continue;
		protectedSessionIds.add(row.current_session_id);
		const entry = parseSessionEntryJson(row);
		if (entry) for (const sessionId of collectSessionStateIdsForEntry(entry)) protectedSessionIds.add(sessionId);
	}
	const generationRows = executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select(["session_id", "session_key"])).rows;
	for (const row of generationRows) if (normalizedAdmissionKeys.has(normalizeStoreSessionKey(row.session_key))) protectedSessionIds.add(row.session_id);
	return protectedSessionIds;
}
function readHistoricalSessionIds(params) {
	const database = openOpenClawAgentDatabase(params.databaseOptions);
	const scope = {
		...params,
		database
	};
	const protectedSessionIds = collectProtectedHistoricalSessionIds(scope);
	for (const sessionId of collectRecentSessionHistoryIds(scope)) protectedSessionIds.add(sessionId);
	const db = getSessionKysely(database.db);
	return executeSqliteQuerySync(database.db, db.selectFrom("session_windows").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc")).rows.flatMap((row) => protectedSessionIds.has(row.session_id) ? [] : [row.session_id]);
}
function reclaimSqliteFreePages(databaseOptions) {
	const database = openOpenClawAgentDatabase(databaseOptions);
	database.walMaintenance.checkpoint();
	const row = database.db.prepare("PRAGMA freelist_count").get();
	const freePages = Number(row?.freelist_count ?? 0);
	if (Number.isSafeInteger(freePages) && freePages > 0) database.db.exec(`PRAGMA incremental_vacuum(${freePages});`);
	database.walMaintenance.checkpoint();
}
function hasCanonicalSessionTranscriptArchives(databaseOptions) {
	const database = openOpenClawAgentDatabase(databaseOptions);
	const db = getSessionKysely(database.db);
	if (!executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_transcript_archives")).rows[0]) return false;
	return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select("session_id").where("published_at", "is not", null).limit(1)).rows.length > 0;
}
function readUnpublishedSessionTranscriptArchiveNames(databaseOptions) {
	const database = openOpenClawAgentDatabase(databaseOptions);
	const db = getSessionKysely(database.db);
	if (!executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "=", "session_transcript_archives")).rows[0]) return /* @__PURE__ */ new Set();
	return new Set(executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select("archive_name").where("published_at", "is", null)).rows.map((row) => row.archive_name));
}
async function pruneCanonicalSessionTranscriptArchivesToHighWater(params) {
	let usage = await measureSessionPhysicalDiskUsage(params.storePath);
	let removedFiles = 0;
	while (usage.totalBytes > params.highWaterBytes) {
		const database = openOpenClawAgentDatabase(params.databaseOptions);
		const db = getSessionKysely(database.db);
		const row = executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
			"archive_name",
			"generation",
			"session_id"
		]).where("published_at", "is not", null).orderBy("created_at", "asc").orderBy("session_id", "asc").orderBy("generation", "asc").limit(1)).rows[0];
		if (!row) break;
		const archivePath = path.resolve(params.archiveDirectory, row.archive_name);
		if (path.dirname(archivePath) !== path.resolve(params.archiveDirectory) || path.basename(archivePath) !== row.archive_name) throw new Error(`Invalid canonical session archive name for ${row.session_id}`);
		try {
			await fs.promises.rm(archivePath);
			removedFiles += 1;
		} catch (error) {
			if (error.code !== "ENOENT") break;
		}
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const transactionKysely = getSessionKysely(transactionDb.db);
			executeSqliteQuerySync(transactionDb.db, transactionKysely.deleteFrom("session_transcript_archives").where("session_id", "=", row.session_id).where("generation", "=", row.generation));
		}, params.databaseOptions);
		reclaimSqliteFreePages(params.databaseOptions);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return {
		removedFiles,
		usage
	};
}
async function pruneAllSessionTranscriptArchivesToHighWater(params) {
	let canonical = {
		removedFiles: 0,
		usage: await measureSessionPhysicalDiskUsage(params.storePath)
	};
	if (hasCanonicalSessionTranscriptArchives(params.databaseOptions)) canonical = await pruneCanonicalSessionTranscriptArchivesToHighWater(params);
	if (canonical.usage.totalBytes <= params.highWaterBytes) return canonical;
	const legacy = await pruneSessionTranscriptArchivesToHighWater({
		excludeNames: readUnpublishedSessionTranscriptArchiveNames(params.databaseOptions),
		highWaterBytes: params.highWaterBytes,
		storePath: params.storePath
	});
	return {
		removedFiles: canonical.removedFiles + legacy.removedFiles,
		usage: legacy.usage
	};
}
const log = createSubsystemLogger("sessions/history-eviction");
const PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 1800 * 1e3;
const budgetKickStateByStore = /* @__PURE__ */ new Map();
/** Fire-and-forget budget pass from the ordinary entry-write maintenance seam. */
function kickSessionHistoryDiskBudgetMaintenance(params) {
	if (params.agentId && isIncognitoOpenClawAgentSqlitePath(params.storePath, { agentId: params.agentId })) return;
	const maintenance = params.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode !== "enforce" || maintenance.maxDiskBytes == null || maintenance.highWaterBytes == null) return;
	const now = params.now ?? Date.now();
	const state = budgetKickStateByStore.get(params.storePath) ?? {
		lastCheckAt: 0,
		running: false,
		pendingForce: false
	};
	if (state.running) {
		state.pendingForce = state.pendingForce || params.force === true;
		budgetKickStateByStore.set(params.storePath, state);
		return;
	}
	if (!params.force && now - state.lastCheckAt < PHYSICAL_BUDGET_CHECK_INTERVAL_MS) return;
	state.lastCheckAt = now;
	state.running = true;
	budgetKickStateByStore.set(params.storePath, state);
	enforceSqliteSessionHistoryDiskBudget({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		mode: maintenance.mode,
		maintenance
	}).catch((error) => {
		log.warn("session history disk-budget sweep failed; retrying on next kick", {
			error,
			storePath: params.storePath
		});
	}).finally(() => {
		state.running = false;
		if (state.pendingForce) {
			state.pendingForce = false;
			kickSessionHistoryDiskBudgetMaintenance({
				...params,
				force: true
			});
		}
	});
}
const SESSION_HISTORY_MAINTENANCE_QUEUES = /* @__PURE__ */ new Map();
/** Extracts historical sessions durably before reclaiming their SQLite rows. */
async function enforceSqliteSessionHistoryDiskBudget(params) {
	return await runQueuedStoreWrite({
		queues: SESSION_HISTORY_MAINTENANCE_QUEUES,
		storePath: params.storePath,
		label: "enforceSqliteSessionHistoryDiskBudget",
		fn: async () => await enforceSessionHistoryMaintenanceSerialized(params)
	});
}
async function enforceSessionHistoryMaintenanceSerialized(params) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return null;
	const initialUsage = await measureSessionPhysicalDiskUsage(params.storePath);
	if (initialUsage.totalBytes <= maxDiskBytes || params.mode === "warn") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: "",
		storePath: params.storePath
	});
	const databaseOptions = toDatabaseOptions(resolved);
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
	let usage = await runExclusiveSqliteSessionWrite(resolved, async () => {
		reclaimSqliteFreePages(databaseOptions);
		return await measureSessionPhysicalDiskUsage(params.storePath);
	});
	let removedEntries = 0;
	let removedFiles = 0;
	if (usage.totalBytes > highWaterBytes) {
		const archiveSweep = await runExclusiveSqliteSessionWrite(resolved, async () => pruneAllSessionTranscriptArchivesToHighWater({
			archiveDirectory,
			databaseOptions,
			highWaterBytes,
			storePath: params.storePath
		}));
		removedFiles = archiveSweep.removedFiles;
		usage = archiveSweep.usage;
	}
	const candidates = readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		storePath: params.storePath
	});
	for (const sessionId of candidates) {
		if (usage.totalBytes <= highWaterBytes) break;
		const eviction = await runExclusiveSessionLifecycleMutation({
			scope: params.storePath,
			identities: [sessionId],
			run: async () => {
				const plan = await runExclusiveSqliteSessionWrite(resolved, async () => {
					const database = openOpenClawAgentDatabase(databaseOptions);
					const protectedBeforeArchive = collectCandidateProtectedHistoricalSessionIds({
						database,
						preserveRecentMs: params.maintenance.preserveRecentMs,
						sessionId,
						storePath: params.storePath
					});
					return planSessionStateDeleteIfUnreferenced({
						archiveDirectory,
						archiveTranscript: true,
						database,
						reason: "deleted",
						referencedSessionIds: protectedBeforeArchive,
						sessionId
					});
				});
				if (!plan) return null;
				const materialized = await materializeSessionStateDeletePlans([plan]);
				const committedArchives = await runExclusiveSqliteSessionWrite(resolved, async () => {
					let deleted = false;
					let archivedTranscripts = [];
					runOpenClawAgentWriteTransaction((transactionDb) => {
						const protectedAtDelete = collectCandidateProtectedHistoricalSessionIds({
							database: transactionDb,
							preserveRecentMs: params.maintenance.preserveRecentMs,
							sessionId,
							storePath: params.storePath
						});
						archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materialized, protectedAtDelete);
						const db = getSessionKysely(transactionDb.db);
						deleted = executeSqliteQuerySync(transactionDb.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", sessionId)).rows.length === 0;
					}, databaseOptions);
					if (!deleted) return null;
					try {
						reclaimSqliteFreePages(databaseOptions);
					} catch {}
					return archivedTranscripts;
				});
				if (!committedArchives) return null;
				return { archivedTranscripts: committedArchives };
			}
		});
		if (!eviction) continue;
		const publishedArchives = await publishSessionStateArchives(resolved, eviction.archivedTranscripts);
		removedEntries += 1;
		emitArchivedTranscriptUpdates(publishedArchives);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
		if (usage.totalBytes > highWaterBytes) {
			const repruned = await runExclusiveSqliteSessionWrite(resolved, async () => pruneAllSessionTranscriptArchivesToHighWater({
				archiveDirectory,
				databaseOptions,
				highWaterBytes,
				storePath: params.storePath
			}));
			removedFiles += repruned.removedFiles;
			usage = repruned.usage;
		}
	}
	if (usage.totalBytes > highWaterBytes) {
		const finalPrune = await runExclusiveSqliteSessionWrite(resolved, async () => pruneAllSessionTranscriptArchivesToHighWater({
			archiveDirectory,
			databaseOptions,
			highWaterBytes,
			storePath: params.storePath
		}));
		removedFiles += finalPrune.removedFiles;
		usage = finalPrune.usage;
	}
	return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		totalBytesAfter: usage.totalBytes,
		removedEntries,
		removedFiles,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
}
//#endregion
export { emitCommittedLifecycleIdentityMutations as a, emitSessionIdentityMutation as c, onSessionLifecycleEvent as d, readSessionIdentityMutationVersion as f, kickSessionHistoryDiskBudgetMaintenance as i, emitSessionLifecycleEvent as l, enforceSqliteSessionHistoryDiskBudget as n, emitCommittedSessionEntryRemovals as o, inspectSqliteSessionHistoryDiskBudget as r, emitCommittedSessionIdentityDiff as s, collectAdmissionProtectedSessionIds as t, onSessionIdentityMutation as u };
