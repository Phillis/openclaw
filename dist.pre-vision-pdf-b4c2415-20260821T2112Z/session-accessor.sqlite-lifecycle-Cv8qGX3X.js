import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as resolveGlobalSingleton, r as resolveGlobalSet } from "./global-singleton-Dc_stLtU.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { g as openOpenClawAgentDatabase, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-lxLIE6rA.js";
import { O as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-BqrsoBzK.js";
import { A as rehomeSessionWindows, C as readLifecycleTargetSnapshot, M as sqliteSessionEntriesEqual, N as writeSessionEntry, X as collectSessionStateIdsForEntry, _ as deleteLifecycleTargetRows, at as parseSessionEntryJson, f as assertLifecycleTargetSnapshotUnchanged, g as deleteLegacySessionEntryRows, p as assertLifecycleTargetUnchanged } from "./targets-DxP0vsft.js";
import { a as normalizeStoreSessionKey, l as runQueuedStoreWrite } from "./store-entry-iif-1PcC.js";
import { c as resolveSqliteStoreScope, d as resolveSqliteTranscriptScope, f as runExclusiveSqliteSessionWrite, i as getSessionKysely, l as resolveSqliteTranscriptArchiveDirectory, o as resolveSqliteReadScope, p as toDatabaseOptions, s as resolveSqliteScope, t as cloneSessionEntry } from "./session-accessor.sqlite-scope-kI2NyJDH.js";
import { n as materializeSessionStateDeletePlans } from "./session-accessor.sqlite-delete-snapshot-xtZPG_Ot.js";
import { b as loadTranscriptEventsFromDatabase, n as appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { _ as readReferencedSessionIdsAfterTargetMutation, b as buildSessionResetBoundaryPlan, c as assertPlannedLifecycleArtifactEntriesUnchanged, d as deletePlannedLifecycleArtifactEntries, f as planSessionLifecycleArtifactCleanup, g as readReferencedSessionIds, m as planSessionStateDeleteIfUnreferenced, p as planSessionStateAfterEntryRemoval, u as deleteMaterializedSessionStatePlans, v as readSessionGenerationIdsForKeys } from "./session-accessor.sqlite-canonical-repair-DPsLdhK1.js";
import { B as collectActiveSessionWorkAdmissionIdentities, X as runExclusiveSessionLifecycleMutation, _ as measureSessionPhysicalDiskUsage, a as isAgentHarnessSessionKey, c as isValidAgentHarnessSessionStoreEntry, d as resolveAgentHarnessSessionStoreEntryError, g as hasRetainedSessionTranscriptArchives, i as MODEL_SELECTION_LOCK_REMOVAL_MESSAGE, v as pruneSessionTranscriptArchivesToHighWater, x as resolveMaintenanceConfig } from "./agent-harness-session-key-BMj1lPtX.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
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
//#region src/config/sessions/session-accessor.sqlite-events.ts
function emitArchivedTranscriptUpdates(archivedTranscripts) {
	for (const archived of archivedTranscripts) emitSessionTranscriptUpdate({ sessionFile: archived.archivedPath });
}
async function publishTranscriptUpdate(scope, update = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	emitSessionTranscriptUpdate({
		...update,
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		sessionId: resolved.sessionId,
		target: {
			agentId: resolved.agentId,
			sessionId: resolved.sessionId,
			sessionKey: resolved.sessionKey,
			storePath: resolved.path
		}
	});
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
	if (await hasRetainedSessionTranscriptArchives(params.storePath)) return {
		diskBudget,
		wouldMutate: true
	};
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		sessionKey: "",
		storePath: params.storePath
	})));
	return {
		diskBudget,
		wouldMutate: readHistoricalSessionIds({
			database,
			protectedSessionIds: collectProtectedHistoricalSessionIds({
				database,
				storePath: params.storePath
			})
		}).length > 0
	};
}
function collectProtectedHistoricalSessionIds(params) {
	const protectedSessionIds = readReferencedSessionIds(params.database);
	for (const sessionId of collectAdmissionProtectedSessionIds(params)) protectedSessionIds.add(sessionId);
	return protectedSessionIds;
}
/** Session ids owned by in-flight work admissions, without live-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	const protectedSessionIds = /* @__PURE__ */ new Set();
	const admissionIdentities = collectActiveSessionWorkAdmissionIdentities(params.storePath);
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
	const db = getSessionKysely(params.database.db);
	return executeSqliteQuerySync(params.database.db, db.selectFrom("session_windows").select("session_id").orderBy("updated_at", "asc").orderBy("session_id", "asc")).rows.flatMap((row) => params.protectedSessionIds.has(row.session_id) ? [] : [row.session_id]);
}
function reclaimSqliteFreePages(database) {
	database.walMaintenance.checkpoint();
	const row = database.db.prepare("PRAGMA freelist_count").get();
	const freePages = Number(row?.freelist_count ?? 0);
	if (Number.isSafeInteger(freePages) && freePages > 0) database.db.exec(`PRAGMA incremental_vacuum(${freePages});`);
	database.walMaintenance.checkpoint();
}
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
	}).catch(() => {}).finally(() => {
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
	const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
	let usage = await runExclusiveSqliteSessionWrite(resolved, async () => {
		reclaimSqliteFreePages(database);
		return await measureSessionPhysicalDiskUsage(params.storePath);
	});
	let removedEntries = 0;
	let removedFiles = 0;
	if (usage.totalBytes > highWaterBytes) {
		const archiveSweep = await runExclusiveSqliteSessionWrite(resolved, async () => pruneSessionTranscriptArchivesToHighWater({
			highWaterBytes,
			storePath: params.storePath
		}));
		removedFiles = archiveSweep.removedFiles;
		usage = archiveSweep.usage;
	}
	const candidates = readHistoricalSessionIds({
		database,
		protectedSessionIds: collectProtectedHistoricalSessionIds({
			database,
			storePath: params.storePath
		})
	});
	for (const sessionId of candidates) {
		if (usage.totalBytes <= highWaterBytes) break;
		const eviction = await runExclusiveSessionLifecycleMutation({
			scope: params.storePath,
			identities: [sessionId],
			run: async () => {
				const plan = await runExclusiveSqliteSessionWrite(resolved, async () => {
					const protectedBeforeArchive = collectProtectedHistoricalSessionIds({
						database,
						storePath: params.storePath
					});
					const candidate = planSessionStateDeleteIfUnreferenced({
						archiveDirectory,
						archiveTranscript: true,
						database,
						reason: "deleted",
						referencedSessionIds: protectedBeforeArchive,
						sessionId
					});
					if (!candidate) return null;
					return candidate;
				});
				if (!plan) return null;
				const materialized = await materializeSessionStateDeletePlans([plan]);
				const committedArchives = await runExclusiveSqliteSessionWrite(resolved, async () => {
					let deleted = false;
					let archivedTranscripts = [];
					runOpenClawAgentWriteTransaction((transactionDb) => {
						const protectedAtDelete = collectProtectedHistoricalSessionIds({
							database: transactionDb,
							storePath: params.storePath
						});
						archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materialized, protectedAtDelete);
						const db = getSessionKysely(transactionDb.db);
						deleted = executeSqliteQuerySync(transactionDb.db, db.selectFrom("session_windows").select("session_id").where("session_id", "=", sessionId)).rows.length === 0;
					}, toDatabaseOptions(resolved));
					if (!deleted) return null;
					try {
						reclaimSqliteFreePages(database);
					} catch {}
					return archivedTranscripts;
				});
				if (!committedArchives) return null;
				return {
					archivedTranscripts: committedArchives,
					usage: await measureSessionPhysicalDiskUsage(params.storePath)
				};
			}
		});
		if (!eviction) continue;
		removedEntries += 1;
		emitArchivedTranscriptUpdates(eviction.archivedTranscripts);
		usage = eviction.usage;
		if (usage.totalBytes > highWaterBytes) {
			const repruned = await runExclusiveSqliteSessionWrite(resolved, async () => pruneSessionTranscriptArchivesToHighWater({
				highWaterBytes,
				storePath: params.storePath
			}));
			removedFiles += repruned.removedFiles;
			usage = repruned.usage;
		}
	}
	if (usage.totalBytes > highWaterBytes) {
		const finalPrune = await runExclusiveSqliteSessionWrite(resolved, async () => pruneSessionTranscriptArchivesToHighWater({
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
//#region src/config/sessions/session-accessor.sqlite-lifecycle.ts
function deleteSessionBoardRows(database, sessionKeys) {
	const keys = [...new Set(sessionKeys)];
	if (keys.length === 0) return;
	const db = getNodeSqliteKysely(database.db);
	const tableRows = executeSqliteQuerySync(database.db, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "in", ["board_tabs", "board_widgets"])).rows;
	const tables = new Set(tableRows.map((row) => row.name));
	if (!tables.has("board_tabs") || !tables.has("board_widgets")) return;
	executeSqliteQuerySync(database.db, db.deleteFrom("board_widgets").where("session_key", "in", keys));
	executeSqliteQuerySync(database.db, db.deleteFrom("board_tabs").where("session_key", "in", keys));
}
async function cleanupSessionLifecycleArtifactsCore(params) {
	const sessionKeySegmentPrefix = params.sessionKeySegmentPrefix.trim();
	const transcriptContentMarker = params.transcriptContentMarker;
	const pluginOwnerId = params.pluginOwnerId?.trim();
	if (!sessionKeySegmentPrefix || !transcriptContentMarker) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const resolved = resolveSqliteReadScope({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (!withOpenClawAgentDatabaseReadOnly(() => true, databaseOptions).found) return {
		removedEntries: 0,
		archivedTranscriptArtifacts: 0
	};
	const cleanupPlan = await runExclusiveSqliteSessionWrite(resolved, async () => {
		return planSessionLifecycleArtifactCleanup(openOpenClawAgentDatabase(databaseOptions), {
			...params.agentId !== void 0 ? { agentId: resolved.agentId } : {},
			archiveRemovedEntryTranscripts: params.archiveRemovedEntryTranscripts !== false,
			archiveDirectory: resolveSqliteTranscriptArchiveDirectory(resolved),
			...pluginOwnerId ? { pluginOwnerId } : {},
			sessionKeySegmentPrefix,
			transcriptContentMarker,
			orphanTranscriptMinAgeMs: params.orphanTranscriptMinAgeMs,
			nowMs: params.nowMs ?? Date.now()
		});
	});
	const materializedPlans = await materializeSessionStateDeletePlans(cleanupPlan.deletePlans);
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let removedEntries = 0;
		let archivedTranscripts = [];
		runOpenClawAgentWriteTransaction((transactionDb) => {
			assertPlannedLifecycleArtifactEntriesUnchanged(transactionDb, cleanupPlan.entries);
			archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, new Set(cleanupPlan.entries.map((entry) => entry.sessionKey)));
			removedEntries = deletePlannedLifecycleArtifactEntries(transactionDb, cleanupPlan.entries);
		}, databaseOptions);
		emitCommittedSessionEntryRemovals(cleanupPlan.entries);
		return {
			removedEntries,
			archivedTranscriptArtifacts: archivedTranscripts.length
		};
	});
}
/** Resets one persisted session entry using SQLite session rows. */
async function resetSessionEntryLifecycle(params) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId });
	try {
		return await runExclusiveSqliteSessionWrite(resolved, async () => {
			const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
			const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
			const current = targetSnapshot.primary;
			const nextEntry = await params.buildNextEntry({
				currentEntry: current ? cloneSessionEntry(current.entry) : void 0,
				primaryKey: params.target.canonicalKey
			});
			const resetBoundaryPlan = params.resetBoundaryReason && current?.entry.sessionId && !sqliteSessionEntriesEqual(current.entry, nextEntry) ? await buildSessionResetBoundaryPlan({
				events: loadTranscriptEventsFromDatabase(database, current.entry.sessionId),
				reason: params.resetBoundaryReason
			}) : void 0;
			const mutation = {
				nextEntry: cloneSessionEntry(nextEntry),
				...current ? { previousEntry: cloneSessionEntry(current.entry) } : {},
				...current?.entry.sessionId ? { previousSessionId: current.entry.sessionId } : {}
			};
			runOpenClawAgentWriteTransaction((transactionDb) => {
				assertLifecycleTargetUnchanged(transactionDb, params.target, current?.entry, "reset");
				if (resetBoundaryPlan && current?.entry.sessionId) {
					const events = [...resetBoundaryPlan.seedEvents, resetBoundaryPlan.event];
					if (appendTranscriptEventsInTransaction(transactionDb, {
						...resolved,
						sessionId: current.entry.sessionId,
						sessionKey: current.key
					}, events) !== events.length) throw new Error(`Failed to append reset boundary for ${current.key}`);
				}
				writeSessionEntry(transactionDb, params.target.canonicalKey, nextEntry, { previousEntry: current?.entry ?? null });
				rehomeSessionWindows(transactionDb, params.target.canonicalKey, params.target.storeKeys);
				deleteLegacySessionEntryRows(transactionDb, params.target.storeKeys, params.target.canonicalKey, { rehomeMembers: current?.entry.sessionId === nextEntry.sessionId });
			}, toDatabaseOptions(resolved));
			if (current) emitSessionIdentityMutation({
				kind: "reset",
				previous: {
					...current.entry.sessionId ? { sessionId: current.entry.sessionId } : {},
					sessionKeys: targetSnapshot.rows.map((row) => row.sessionKey)
				},
				current: {
					...nextEntry.sessionId ? { sessionId: nextEntry.sessionId } : {},
					sessionKeys: [params.target.canonicalKey]
				}
			});
			else emitSessionIdentityMutation({
				kind: "create",
				previous: { sessionKeys: [] },
				current: {
					...nextEntry.sessionId ? { sessionId: nextEntry.sessionId } : {},
					sessionKeys: [params.target.canonicalKey]
				}
			});
			await params.afterEntryMutation?.(mutation);
			return {
				...mutation,
				archivedTranscripts: []
			};
		});
	} finally {
		kickSessionHistoryDiskBudgetMaintenance({
			...resolved.agentId ? { agentId: resolved.agentId } : {},
			storePath: params.storePath,
			force: true
		});
	}
}
async function deleteSqliteSessionEntryLifecycleInternal(params, allowLockedEntryRemoval, expectedPluginOwnerId) {
	const agentId = params.agentId ?? parseAgentSessionKey(params.target.canonicalKey)?.agentId;
	const resolved = resolveSqliteStoreScope(params.storePath, { agentId });
	try {
		return await deleteSqliteSessionEntryLifecycleLocked(resolved, params, allowLockedEntryRemoval, expectedPluginOwnerId);
	} finally {
		kickSessionHistoryDiskBudgetMaintenance({
			...params.agentId ? { agentId: params.agentId } : {},
			storePath: params.storePath,
			force: true
		});
	}
}
async function deleteSqliteSessionEntryLifecycleLocked(resolved, params, allowLockedEntryRemoval, expectedPluginOwnerId) {
	const prepared = await runExclusiveSqliteSessionWrite(resolved, async () => {
		const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
		const targetSnapshot = readLifecycleTargetSnapshot(database, params.target);
		const current = targetSnapshot.primary;
		if (!current) return null;
		if (!shouldDeleteSqliteSessionEntryLifecycle(database, current.entry, params)) return null;
		if (current.entry.modelSelectionLocked === true && !allowLockedEntryRemoval) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
		if (expectedPluginOwnerId && targetSnapshot.rows.some(({ entry, sessionKey }) => isAgentHarnessSessionKey(sessionKey) || entry.agentHarnessId !== void 0 || entry.modelSelectionLocked !== true || normalizeOptionalString(entry.pluginOwnerId) !== expectedPluginOwnerId)) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
		const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, params.target);
		const deleteTranscriptState = params.archiveTranscript || params.deleteTranscriptWithoutArchive === true;
		const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
		const entryPlans = deleteTranscriptState ? targetSnapshot.rows.flatMap(({ entry }) => planSessionStateAfterEntryRemoval({
			archiveDirectory,
			archiveTranscript: params.archiveTranscript,
			database,
			entry,
			reason: "deleted",
			referencedSessionIds: referencedAfterDelete
		})) : [];
		const entryPlanIds = new Set(entryPlans.map((plan) => plan.sessionId));
		const historicalGenerationIds = deleteTranscriptState ? readSessionGenerationIdsForKeys(database, [
			params.target.canonicalKey,
			...params.target.storeKeys,
			...targetSnapshot.rows.map((row) => row.sessionKey)
		]).filter((sessionId) => !entryPlanIds.has(sessionId)) : [];
		const preflightFence = collectAdmissionProtectedSessionIds({
			database,
			storePath: params.storePath
		});
		for (const sessionId of historicalGenerationIds) if (preflightFence.has(sessionId) && !referencedAfterDelete.has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
		return {
			archiveDirectory,
			current,
			entryPlans,
			historicalGenerationIds,
			targetSnapshot
		};
	});
	if (!prepared) return {
		archivedTranscripts: [],
		deleted: false
	};
	const historicalArchivedTranscripts = [];
	for (const sessionId of prepared.historicalGenerationIds) {
		const plan = await runExclusiveSqliteSessionWrite(resolved, async () => {
			const database = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
			assertLifecycleTargetSnapshotUnchanged(prepared.targetSnapshot, readLifecycleTargetSnapshot(database, params.target), "delete session entry");
			if (!shouldDeleteSqliteSessionEntryLifecycle(database, prepared.current.entry, params)) return null;
			const referencedAfterDelete = readReferencedSessionIdsAfterTargetMutation(database, params.target);
			if (referencedAfterDelete.has(sessionId)) return null;
			if (collectAdmissionProtectedSessionIds({
				database,
				storePath: params.storePath
			}).has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
			return planSessionStateDeleteIfUnreferenced({
				archiveDirectory: prepared.archiveDirectory,
				archiveTranscript: params.archiveTranscript,
				database,
				reason: "deleted",
				referencedSessionIds: referencedAfterDelete,
				sessionId
			});
		});
		if (!plan) continue;
		const materializedGeneration = await materializeSessionStateDeletePlans([plan]);
		const archivedGeneration = await runExclusiveSqliteSessionWrite(resolved, async () => {
			let committed = [];
			runOpenClawAgentWriteTransaction((transactionDb) => {
				assertLifecycleTargetSnapshotUnchanged(prepared.targetSnapshot, readLifecycleTargetSnapshot(transactionDb, params.target), "delete session entry");
				if (!shouldDeleteSqliteSessionEntryLifecycle(transactionDb, prepared.current.entry, params)) return;
				if (collectAdmissionProtectedSessionIds({
					database: transactionDb,
					storePath: params.storePath
				}).has(sessionId)) throw new Error(`cannot delete session history while work is in flight for ${sessionId}; retry after the run completes`);
				committed = deleteMaterializedSessionStatePlans(transactionDb, materializedGeneration);
			}, toDatabaseOptions(resolved));
			return committed;
		});
		emitArchivedTranscriptUpdates(archivedGeneration);
		historicalArchivedTranscripts.push(...archivedGeneration);
	}
	const materializedPlans = await materializeSessionStateDeletePlans(prepared.entryPlans);
	const result = await runExclusiveSqliteSessionWrite(resolved, async () => {
		let committed = {
			archivedTranscripts: [],
			deleted: false
		};
		runOpenClawAgentWriteTransaction((transactionDb) => {
			const transactionSnapshot = readLifecycleTargetSnapshot(transactionDb, params.target);
			assertLifecycleTargetSnapshotUnchanged(prepared.targetSnapshot, transactionSnapshot, "delete session entry");
			const transactionEntry = transactionSnapshot.primary?.entry;
			if (!shouldDeleteSqliteSessionEntryLifecycle(transactionDb, transactionEntry, params)) return;
			const archivedTranscripts = deleteMaterializedSessionStatePlans(transactionDb, materializedPlans, void 0, /* @__PURE__ */ new Set([
				params.target.canonicalKey,
				...params.target.storeKeys,
				...transactionSnapshot.rows.map((row) => row.sessionKey)
			]));
			deleteLifecycleTargetRows(transactionDb, params.target);
			deleteSessionBoardRows(transactionDb, [
				params.target.canonicalKey,
				...params.target.storeKeys,
				...transactionSnapshot.rows.map((row) => row.sessionKey)
			]);
			committed = {
				archivedTranscripts,
				deleted: true,
				deletedEntry: cloneSessionEntry(prepared.current.entry),
				...prepared.current.entry.sessionId ? { deletedSessionId: prepared.current.entry.sessionId } : {}
			};
		}, toDatabaseOptions(resolved));
		return committed;
	});
	if (result.deleted) emitSessionIdentityMutation({
		kind: "delete",
		previous: {
			...prepared.current.entry.sessionId ? { sessionId: prepared.current.entry.sessionId } : {},
			sessionKeys: prepared.targetSnapshot.rows.map((row) => row.sessionKey)
		}
	});
	emitArchivedTranscriptUpdates(result.archivedTranscripts);
	result.archivedTranscripts.push(...historicalArchivedTranscripts);
	return result;
}
/** Deletes one persisted session entry using SQLite session rows. */
async function deleteSessionEntryLifecycle(params) {
	return await deleteSqliteSessionEntryLifecycleInternal(params, false);
}
/** Rolls back one exact locked row created by failed trusted harness initialization. */
async function rollbackAgentHarnessSessionEntryLifecycle(params) {
	const hasExactTarget = params.target.storeKeys.length === 1 && params.target.storeKeys[0] === params.target.canonicalKey;
	const expectedEntryError = resolveAgentHarnessSessionStoreEntryError(params.target.canonicalKey, params.expectedEntry);
	if (!hasExactTarget || expectedEntryError || !isValidAgentHarnessSessionStoreEntry(params.target.canonicalKey, params.expectedEntry)) throw new Error(expectedEntryError ?? "Model-selection-locked sessions cannot be removed, unlocked, or reassigned.");
	return await deleteSqliteSessionEntryLifecycleInternal(params, true);
}
/** Rolls back one exact locked CLI row created by a failed plugin initializer. */
async function rollbackPluginOwnedSessionEntryLifecycle(params) {
	const expectedEntry = params.expectedEntry;
	const validPluginOwner = normalizeOptionalString(expectedEntry.pluginOwnerId);
	const expectedPluginOwner = normalizeOptionalString(params.expectedPluginOwnerId);
	if (isAgentHarnessSessionKey(params.target.canonicalKey) || expectedEntry.agentHarnessId !== void 0 || expectedEntry.modelSelectionLocked !== true || !validPluginOwner || validPluginOwner !== expectedPluginOwner) throw new Error(MODEL_SELECTION_LOCK_REMOVAL_MESSAGE);
	return await deleteSqliteSessionEntryLifecycleInternal(params, true, expectedPluginOwner);
}
/** Applies prepared full-row replacements in one validated SQLite transaction. */
function shouldDeleteSqliteSessionEntryLifecycle(database, entry, params) {
	if (!entry) return false;
	if (params.expectedEntry !== void 0 && !sqliteSessionEntriesEqual(entry, params.expectedEntry)) return false;
	if (params.expectedSessionId !== void 0 && (params.expectedSessionId === null ? entry.sessionId !== void 0 : entry.sessionId !== params.expectedSessionId)) return false;
	if (params.expectedLifecycleRevision !== void 0 && entry.lifecycleRevision !== params.expectedLifecycleRevision) return false;
	if (params.expectedUpdatedAt !== void 0 && entry.updatedAt !== params.expectedUpdatedAt) return false;
	if (params.expectedTranscript) {
		const expectedTranscript = params.expectedTranscript;
		const rows = executeSqliteQuerySync(database.db, getSessionKysely(database.db).selectFrom("transcript_events").select("event_json").where("session_id", "=", expectedTranscript.sessionId).orderBy("seq", "asc")).rows;
		if (entry.sessionId !== expectedTranscript.sessionId || rows.length !== expectedTranscript.eventJson.length || rows.some((row, index) => row.event_json !== expectedTranscript.eventJson[index])) return false;
	}
	return true;
}
//#endregion
export { readSessionIdentityMutationVersion as _, rollbackPluginOwnedSessionEntryLifecycle as a, kickSessionHistoryDiskBudgetMaintenance as c, emitCommittedLifecycleIdentityMutations as d, emitCommittedSessionEntryRemovals as f, onSessionLifecycleEvent as g, onSessionIdentityMutation as h, rollbackAgentHarnessSessionEntryLifecycle as i, emitArchivedTranscriptUpdates as l, emitSessionLifecycleEvent as m, deleteSessionEntryLifecycle as n, enforceSqliteSessionHistoryDiskBudget as o, emitCommittedSessionIdentityDiff as p, resetSessionEntryLifecycle as r, inspectSqliteSessionHistoryDiskBudget as s, cleanupSessionLifecycleArtifactsCore as t, publishTranscriptUpdate as u };
