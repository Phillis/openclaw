import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { f as stripInternalRuntimeContext, l as hasInternalRuntimeContext } from "./internal-runtime-context-E3ku7Huk.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { o as isLegacyCodexProviderId } from "./codex-route-model-ref-Bw2nFxxx.js";
import { g as openOpenClawAgentDatabase, i as closeOpenClawAgentDatabaseByPath, p as isOpenClawAgentDatabaseOpen, v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CyHApqW_.js";
import { _ as parseSqliteSessionEntryRecord } from "./openclaw-agent-db-maintenance-1xIPEKIN.js";
import { n as deliveryContextFromSession, u as sessionDeliveryChannel } from "./delivery-context.shared-D-qPZITK.js";
import { r as resolveAgentMainSessionKey } from "./main-session-er-Gn_t_.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-CoZdm5gl.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DTj1P3q4.js";
import { Dt as applySessionEntryLifecycleMutation } from "./session-accessor-CVnxp3UM.js";
import { K as setCanonicalSqliteSessionMainKey, Q as deleteSessionMembersForRepair, X as collectSessionStateIdsForEntry, Z as copySessionNodeArtifactsForRepair, a as resolveAllAgentSessionStoreCandidateTargetsSync, it as trackSessionEntryCacheWrite, nt as publishSessionEntryCacheInvalidation, o as resolveAllAgentSessionStoreTargetsSync, u as resolveAgentSessionDirs } from "./targets-BzJLDErS.js";
import { o as resolveDeliveryProvenCanonicalSessionKey } from "./store-entry-BgSA4iwU.js";
import { l as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-CyEaWvgy.js";
import { g as isSessionTranscriptLeafControl, v as mergeSessionTranscriptTreePaths, w as selectSessionTranscriptTreePathNodes, x as scanSessionTranscriptTree, y as mergeSessionTranscriptVisiblePathWithOpaqueAppendPath } from "./session-transcript-index-U6HbS8-N.js";
import { i as writeTranscriptArchive } from "./session-accessor.sqlite-delete-snapshot-DMKpYR0y.js";
import { y as loadTranscriptEvents } from "./session-accessor.sqlite-transcript-store-DmssQj1u.js";
import { a as rehomeSqliteSessionDeliveryReferencesForCanonicalRepair, o as rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch, r as listSqliteSessionGenerationIdsForCanonicalRepair, s as listSqliteSessionEntriesWithCanonicalOwnerEvidence, t as copySqliteSessionOwnedStateForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair--Uu8TNYz.js";
import { t as serializeJsonlLines } from "./transcript-jsonl-QKucbXZu.js";
import { t as note } from "./note-D7f3pYFE.js";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-Cb9sBdkB.js";
import { i as withDoctorSqliteMaintenanceLock, t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-mAgCgc2I.js";
import { f as resolveTargetSqlitePath } from "./doctor-session-sqlite-readers-Bry6hlTR.js";
import { t as runDoctorAgentDatabaseOperation } from "./doctor-agent-database-operation-BE_6WCci.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { sql } from "kysely";
//#region src/commands/doctor-session-canonical-owner-evidence.ts
/** Projects transcript-owner evidence through aliases and indexes every proven source key. */
function applyCanonicalOwnerEvidence(inventory) {
	const bySessionKey = new Map(inventory.map((item) => [`${item.target.sqlitePath}\0${item.sessionKey}`, item]));
	const resolveCanonicalKey = (item, seen = /* @__PURE__ */ new Set()) => {
		if (!item.canonicalOwnerSessionKey) return item.canonicalKey;
		const identity = `${item.target.sqlitePath}\0${item.sessionKey}`;
		const owner = bySessionKey.get(`${item.target.sqlitePath}\0${item.canonicalOwnerSessionKey}`);
		if (!owner || seen.has(identity)) return item.canonicalKey;
		seen.add(identity);
		return owner.canonicalOwnerSessionKey ? resolveCanonicalKey(owner, seen) : owner.canonicalKey;
	};
	const canonicalKeysByStoredKey = /* @__PURE__ */ new Map();
	for (const item of inventory) {
		item.canonicalKey = resolveCanonicalKey(item);
		const ownerAgentId = parseAgentSessionKey(item.storedKey)?.agentId ?? item.target.agentId;
		for (const key of [item.sessionKey, item.storedKey]) for (const sqlitePath of [item.target.sqlitePath, "*"]) {
			const mappingKey = `${sqlitePath}\0${ownerAgentId}\0${key}`;
			const mapped = canonicalKeysByStoredKey.get(mappingKey) ?? /* @__PURE__ */ new Set();
			mapped.add(item.canonicalKey);
			canonicalKeysByStoredKey.set(mappingKey, mapped);
		}
	}
	return canonicalKeysByStoredKey;
}
//#endregion
//#region src/commands/doctor-session-canonical-keys.ts
function createCanonicalRepairRemoval(candidate, params) {
	const removal = {
		archiveRemovedTranscript: params.archiveRemovedTranscript,
		deleteOwnedWindows: params.deleteOwnedWindows,
		...params.deliveryCleanupKeys ? { deliveryCleanupKeys: params.deliveryCleanupKeys } : {},
		exactStoredKey: true,
		expectedEntry: candidate.expectedEntry,
		sessionKey: candidate.sessionKey
	};
	return candidate.rawEntryJson === void 0 ? removal : Object.assign(removal, { expectedRawEntryJson: candidate.rawEntryJson });
}
const CANONICAL_SESSION_REPAIR_BATCH_GROUP_LIMIT = 64;
function listCanonicalSessionStores(params) {
	const stores = [];
	const seenDatabases = /* @__PURE__ */ new Set();
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env })) {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (seenDatabases.has(sqlitePath) || !fs.existsSync(sqlitePath)) continue;
		seenDatabases.add(sqlitePath);
		stores.push({
			agentId: target.agentId,
			sqlitePath,
			storePath: target.storePath
		});
	}
	return stores;
}
function collectCanonicalSessionCandidates(params, stores) {
	const inventory = stores.flatMap((target) => listSqliteSessionEntriesWithCanonicalOwnerEvidence({
		agentId: target.agentId,
		clone: false,
		storePath: target.storePath
	}).map(({ canonicalOwnerSessionKey, entry, rawEntryJson, sessionKey }) => {
		const storedKey = resolveStoredSessionKeyForAgentStore({
			cfg: params.cfg,
			agentId: target.agentId,
			sessionKey
		});
		return {
			canonicalKey: storedKey ? resolveDeliveryProvenCanonicalSessionKey(storedKey, entry) : resolveAgentMainSessionKey({
				cfg: params.cfg,
				agentId: target.agentId
			}),
			entry,
			canonicalOwnerSessionKey,
			rawEntryJson,
			sessionKey,
			storedKey,
			target
		};
	}));
	const canonicalKeysByStoredKey = applyCanonicalOwnerEvidence(inventory);
	return inventory.map(({ canonicalKey, canonicalOwnerSessionKey, entry, rawEntryJson, sessionKey, target }) => {
		const canonicalAgentId = canonicalKey === "global" || canonicalKey === "unknown" ? target.agentId : resolveSessionStoreAgentId(params.cfg, canonicalKey);
		const canonicalizeLineageKey = (value) => {
			if (!value) return;
			const storedKey = resolveStoredSessionKeyForAgentStore({
				cfg: params.cfg,
				agentId: canonicalAgentId,
				sessionKey: value
			});
			const ownerAgentId = parseAgentSessionKey(storedKey)?.agentId ?? canonicalAgentId;
			for (const key of [value, storedKey]) {
				const sameStore = canonicalKeysByStoredKey.get(`${target.sqlitePath}\0${ownerAgentId}\0${key}`);
				if (sameStore?.size === 1) return [...sameStore][0];
			}
			for (const key of [value, storedKey]) {
				const crossStore = canonicalKeysByStoredKey.get(`*\0${ownerAgentId}\0${key}`);
				if (crossStore?.size === 1) return [...crossStore][0];
			}
			return storedKey;
		};
		const parentSessionKey = canonicalizeLineageKey(entry.parentSessionKey);
		const spawnedBy = canonicalizeLineageKey(entry.spawnedBy);
		const forkSourceSessionKey = canonicalizeLineageKey(entry.forkSource?.sessionKey);
		const normalizedEntry = { ...entry };
		if (parentSessionKey) normalizedEntry.parentSessionKey = parentSessionKey;
		else delete normalizedEntry.parentSessionKey;
		if (spawnedBy) normalizedEntry.spawnedBy = spawnedBy;
		else delete normalizedEntry.spawnedBy;
		if (entry.forkSource && forkSourceSessionKey) normalizedEntry.forkSource = {
			...entry.forkSource,
			sessionKey: forkSourceSessionKey
		};
		else if (entry.forkSource && entry.forkSource.sessionKey !== void 0) {
			const { sessionKey: _invalidSessionKey, ...forkProvenance } = entry.forkSource;
			normalizedEntry.forkSource = forkProvenance;
		}
		const lineageRepairRequired = parentSessionKey !== (entry.parentSessionKey ?? void 0) || spawnedBy !== (entry.spawnedBy ?? void 0) || forkSourceSessionKey !== (entry.forkSource?.sessionKey ?? void 0);
		const candidate = {
			agentId: target.agentId,
			canonicalKey,
			entry: normalizedEntry,
			expectedEntry: entry,
			lineageRepairRequired,
			ownerEvidenceOnly: canonicalOwnerSessionKey !== void 0,
			sessionKey,
			sqlitePath: target.sqlitePath,
			storePath: target.storePath
		};
		if (rawEntryJson !== void 0) candidate.rawEntryJson = rawEntryJson;
		return candidate;
	});
}
function resolveCanonicalDestination(params) {
	const agentId = params.canonicalKey === "global" || params.canonicalKey === "unknown" ? normalizeAgentId(params.sourceAgentId ?? resolveSessionStoreAgentId(params.cfg, params.canonicalKey)) : resolveSessionStoreAgentId(params.cfg, params.canonicalKey);
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, {
		agentId,
		env: params.env
	});
	return {
		agentId,
		storePath,
		sqlitePath: resolveTargetSqlitePath({
			agentId,
			storePath
		})
	};
}
function mergeCanonicalSessionEntryCandidates(candidates) {
	let selected;
	for (const candidate of candidates) {
		const incomingUpdatedAt = typeof candidate.entry.updatedAt === "number" && Number.isFinite(candidate.entry.updatedAt) ? candidate.entry.updatedAt : 0;
		const selectedUpdatedAt = typeof selected?.entry.updatedAt === "number" && Number.isFinite(selected.entry.updatedAt) ? selected.entry.updatedAt : 0;
		if (!selected || incomingUpdatedAt > selectedUpdatedAt || incomingUpdatedAt === selectedUpdatedAt && (candidate.preferred === true ? !selected.preferred : !selected.preferred && Buffer.compare(Buffer.from(JSON.stringify(candidate.entry), "utf8"), Buffer.from(JSON.stringify(selected.entry), "utf8")) > 0)) selected = {
			entry: structuredClone(candidate.entry),
			preferred: candidate.preferred === true,
			winner: candidate.value
		};
	}
	return selected;
}
function selectCanonicalSessionCandidate(candidates, params) {
	const first = candidates[0];
	if (!first) return;
	const destination = resolveCanonicalDestination({
		canonicalKey: first.canonicalKey,
		cfg: params.cfg,
		env: params.env,
		sourceAgentId: first.agentId
	});
	const metadataCandidates = candidates.filter((candidate) => !candidate.ownerEvidenceOnly);
	const selected = mergeCanonicalSessionEntryCandidates((metadataCandidates.length > 0 ? metadataCandidates : candidates).toSorted((left, right) => Buffer.compare(Buffer.from(`${left.sqlitePath}\0${left.sessionKey}`, "utf8"), Buffer.from(`${right.sqlitePath}\0${right.sessionKey}`, "utf8"))).map((candidate) => ({
		entry: candidate.entry,
		preferred: candidate.sqlitePath === destination.sqlitePath && candidate.sessionKey === candidate.canonicalKey,
		value: candidate
	})));
	return selected ? {
		...selected,
		destination
	} : void 0;
}
function groupRepairCandidates(candidates, params) {
	const byCanonicalKey = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const sentinelOwner = candidate.canonicalKey === "global" || candidate.canonicalKey === "unknown" ? candidate.agentId : "";
		const groupKey = `${candidate.canonicalKey}\0${sentinelOwner}`;
		const group = byCanonicalKey.get(groupKey) ?? [];
		group.push(candidate);
		byCanonicalKey.set(groupKey, group);
	}
	return [...byCanonicalKey.values()].flatMap((group) => {
		const first = group[0];
		if (!first) return [];
		const destination = resolveCanonicalDestination({
			canonicalKey: first.canonicalKey,
			cfg: params.cfg,
			env: params.env,
			sourceAgentId: first.agentId
		});
		if (!(group.length > 1 || group.some((candidate) => candidate.rawEntryJson !== void 0 || candidate.lineageRepairRequired || candidate.sessionKey !== candidate.canonicalKey || candidate.sqlitePath !== destination.sqlitePath))) return [];
		const canonicalRowSurvives = group.some((candidate) => candidate.sqlitePath === destination.sqlitePath && candidate.sessionKey === candidate.canonicalKey);
		return [{
			candidates: group,
			removedRows: group.length - (canonicalRowSurvives ? 1 : 0)
		}];
	});
}
function resolveSingleDatabaseCanonicalRepairGroup(candidates, params) {
	const selected = selectCanonicalSessionCandidate(candidates, params);
	if (!selected || selected.winner.sqlitePath !== selected.destination.sqlitePath || candidates.some((candidate) => candidate.sqlitePath !== selected.destination.sqlitePath)) return;
	return {
		candidates,
		selected
	};
}
function createCanonicalDestinationRemovals(candidates, selected) {
	const relatedSessionIds = new Set([selected.entry.sessionId, selected.entry.previousSessionId].filter((value) => typeof value === "string" && value.length > 0));
	return candidates.filter((candidate) => candidate.sessionKey !== selected.winner.canonicalKey || candidate.rawEntryJson !== void 0).map((candidate) => createCanonicalRepairRemoval(candidate, {
		archiveRemovedTranscript: !relatedSessionIds.has(candidate.entry.sessionId),
		deleteOwnedWindows: false
	}));
}
function listCanonicalDestinationAliasKeys(destinationStore, winner) {
	return destinationStore.map((candidate) => candidate.sessionKey).filter((sessionKey) => sessionKey !== winner.canonicalKey);
}
function applyCanonicalDestinationArtifacts(params) {
	const destinationAliasKeys = listCanonicalDestinationAliasKeys(params.destinationStore, params.winner);
	if (destinationAliasKeys.length > 0) {
		if (params.rehomeDeliveries) rehomeSqliteSessionDeliveryReferencesForCanonicalRepair(params.database, params.winner.canonicalKey, destinationAliasKeys);
		copySessionNodeArtifactsForRepair(params.database, params.database, destinationAliasKeys, params.winner.canonicalKey, { includeMembers: false });
	}
	if (!params.copyWinnerAlias || params.winner.sessionKey === params.winner.canonicalKey) return;
	deleteSessionMembersForRepair(params.database, params.winner.canonicalKey);
	copySessionNodeArtifactsForRepair(params.database, params.database, [params.winner.sessionKey], params.winner.canonicalKey);
}
async function repairCanonicalSessionGroupsInSingleDatabase(groups) {
	const first = groups[0];
	if (!first) return [];
	const destination = first.selected.destination;
	return (await applySessionEntryLifecycleMutation({
		agentId: destination.agentId,
		allowCanonicalRepair: true,
		afterUpsertsInTransaction: (database) => {
			rehomeSqliteSessionDeliveryReferencesForCanonicalRepairBatch(database, groups.map((group) => ({
				canonicalKey: group.selected.winner.canonicalKey,
				previousKeys: listCanonicalDestinationAliasKeys(group.candidates, group.selected.winner)
			})));
			for (const group of groups) applyCanonicalDestinationArtifacts({
				copyWinnerAlias: true,
				database,
				destinationStore: group.candidates,
				rehomeDeliveries: false,
				winner: group.selected.winner
			});
		},
		removals: groups.flatMap((group) => createCanonicalDestinationRemovals(group.candidates, group.selected)),
		skipMaintenance: true,
		storePath: destination.storePath,
		upserts: groups.map((group) => ({
			entry: group.selected.entry,
			sessionKey: group.selected.winner.canonicalKey
		}))
	})).archivedTranscriptDirectories;
}
async function repairCanonicalSessionGroup(candidates, params) {
	const selected = selectCanonicalSessionCandidate(candidates, params);
	if (!selected) return [];
	const winner = selected.winner;
	const destination = selected.destination;
	const byDatabase = /* @__PURE__ */ new Map();
	for (const candidate of candidates) {
		const group = byDatabase.get(candidate.sqlitePath) ?? [];
		group.push(candidate);
		byDatabase.set(candidate.sqlitePath, group);
	}
	const destinationStore = byDatabase.get(destination.sqlitePath) ?? [];
	const preArchivedDirectories = [];
	if (winner.sqlitePath !== destination.sqlitePath) {
		const generationIds = /* @__PURE__ */ new Set([...listSqliteSessionGenerationIdsForCanonicalRepair({
			agentId: winner.agentId,
			canonicalKey: winner.canonicalKey,
			sourceKeys: [winner.sessionKey],
			storePath: winner.storePath
		}), ...collectSessionStateIdsForEntry(winner.entry)]);
		for (const sessionId of generationIds) {
			if (!sessionId) continue;
			const destinationCollision = destinationStore.find((candidate) => candidate.entry.sessionId === sessionId);
			const [destinationEvents, sourceEvents] = await Promise.all([loadTranscriptEvents({
				agentId: destinationCollision?.agentId ?? destination.agentId,
				sessionId,
				sessionKey: destinationCollision?.sessionKey ?? winner.canonicalKey,
				storePath: destinationCollision?.storePath ?? destination.storePath
			}), loadTranscriptEvents({
				agentId: winner.agentId,
				sessionId,
				sessionKey: winner.sessionKey,
				storePath: winner.storePath
			})]);
			const destinationContent = serializeJsonlLines(destinationEvents.map((event) => JSON.stringify(event)));
			const sourceContent = serializeJsonlLines(sourceEvents.map((event) => JSON.stringify(event)));
			if (!destinationContent || destinationContent === sourceContent) continue;
			const archiveDirectory = resolveSqliteTranscriptArchiveDirectory({
				agentId: destination.agentId,
				env: params.env,
				path: destination.sqlitePath
			});
			writeTranscriptArchive({
				archiveDirectory,
				content: destinationContent,
				reason: "deleted",
				sessionId
			});
			if (!preArchivedDirectories.includes(archiveDirectory)) preArchivedDirectories.push(archiveDirectory);
		}
	}
	setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase({
		agentId: destination.agentId,
		path: destination.sqlitePath
	}), params.cfg.session?.mainKey);
	const winnerResult = await applySessionEntryLifecycleMutation({
		agentId: destination.agentId,
		allowCanonicalRepair: true,
		afterUpsertsInTransaction: (destinationDatabase) => {
			applyCanonicalDestinationArtifacts({
				copyWinnerAlias: winner.sqlitePath === destination.sqlitePath,
				database: destinationDatabase,
				destinationStore,
				rehomeDeliveries: true,
				winner
			});
			if (winner.sqlitePath !== destination.sqlitePath) copySqliteSessionOwnedStateForCanonicalRepair({
				canonicalKey: winner.canonicalKey,
				destinationDatabase,
				preferredEntry: selected.entry,
				preferredSessionKey: winner.sessionKey,
				source: winner,
				sourceEntries: [winner.entry],
				sourceKeys: [winner.sessionKey]
			});
		},
		removals: createCanonicalDestinationRemovals(destinationStore, selected),
		skipMaintenance: true,
		storePath: destination.storePath,
		upserts: [{
			entry: selected.entry,
			sessionKey: winner.canonicalKey
		}]
	});
	const archivedDirectories = /* @__PURE__ */ new Set([...preArchivedDirectories, ...winnerResult.archivedTranscriptDirectories]);
	for (const [sqlitePath, storeCandidates] of byDatabase) {
		if (sqlitePath === destination.sqlitePath) continue;
		const [storeCandidate] = storeCandidates;
		if (!storeCandidate) continue;
		const result = await applySessionEntryLifecycleMutation({
			agentId: storeCandidate.agentId,
			allowCanonicalRepair: true,
			removals: storeCandidates.map((candidate) => createCanonicalRepairRemoval(candidate, {
				archiveRemovedTranscript: true,
				deleteOwnedWindows: true,
				deliveryCleanupKeys: [winner.canonicalKey]
			})),
			skipMaintenance: true,
			storePath: storeCandidate.storePath
		});
		for (const directory of result.archivedTranscriptDirectories) archivedDirectories.add(directory);
	}
	return [...archivedDirectories];
}
/** Doctor-owned durable repair; process-held incognito databases are intentionally excluded. */
async function repairCanonicalSessionKeys(params) {
	const env = params.env ?? process.env;
	const stores = listCanonicalSessionStores({
		cfg: params.cfg,
		env
	});
	const archivedTranscriptDirectories = /* @__PURE__ */ new Set();
	let repairBatches = 0;
	let repairedGroups = 0;
	if (params.apply) for (const store of stores) setCanonicalSqliteSessionMainKey(openOpenClawAgentDatabase({
		agentId: store.agentId,
		path: store.sqlitePath
	}), params.cfg.session?.mainKey);
	const repairGroups = groupRepairCandidates(collectCanonicalSessionCandidates({
		cfg: params.cfg,
		env
	}, stores), {
		cfg: params.cfg,
		env
	});
	if (params.apply) {
		let index = 0;
		while (index < repairGroups.length) {
			const group = repairGroups[index];
			if (!group) break;
			const singleDatabaseGroup = resolveSingleDatabaseCanonicalRepairGroup(group.candidates, {
				cfg: params.cfg,
				env
			});
			if (!singleDatabaseGroup) {
				for (const directory of await repairCanonicalSessionGroup(group.candidates, {
					cfg: params.cfg,
					env
				})) archivedTranscriptDirectories.add(directory);
				index += 1;
				repairBatches += 1;
				repairedGroups += 1;
				continue;
			}
			const batch = [singleDatabaseGroup];
			index += 1;
			while (index < repairGroups.length && batch.length < CANONICAL_SESSION_REPAIR_BATCH_GROUP_LIMIT) {
				const nextGroup = repairGroups[index];
				if (!nextGroup) break;
				const nextSingleDatabaseGroup = resolveSingleDatabaseCanonicalRepairGroup(nextGroup.candidates, {
					cfg: params.cfg,
					env
				});
				if (!nextSingleDatabaseGroup || nextSingleDatabaseGroup.selected.destination.sqlitePath !== singleDatabaseGroup.selected.destination.sqlitePath) break;
				batch.push(nextSingleDatabaseGroup);
				index += 1;
			}
			for (const directory of await repairCanonicalSessionGroupsInSingleDatabase(batch)) archivedTranscriptDirectories.add(directory);
			repairBatches += 1;
			repairedGroups += batch.length;
		}
	}
	return {
		archivedTranscriptDirectories: [...archivedTranscriptDirectories].toSorted(),
		foundGroups: repairGroups.length,
		repairBatches,
		removedRows: repairGroups.reduce((total, group) => total + group.removedRows, 0),
		repairedGroups,
		scannedStores: stores.length
	};
}
//#endregion
//#region src/commands/doctor-session-entry-rewrite.ts
/** Persist a doctor-proven entry rewrite and settle the schema-owned validity projection. */
function writeValidatedDoctorSessionEntryJson(database, row, entryJson) {
	if (!parseSqliteSessionEntryRecord({
		...row,
		entry_json: entryJson
	})) throw new Error(`Refusing invalid SQLite session entry rewrite for ${row.session_key}`);
	const db = getNodeSqliteKysely(database.db);
	const writeGeneration = trackSessionEntryCacheWrite(database, () => {
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_json: entryJson }).where("session_key", "=", row.session_key));
		executeSqliteQuerySync(database.db, db.updateTable("session_nodes").set({ entry_valid: 1 }).where("session_key", "=", row.session_key));
	});
	publishSessionEntryCacheInvalidation(database, {
		...row,
		entry_json: entryJson
	}, writeGeneration);
}
//#endregion
//#region src/commands/doctor-session-delivery-state.ts
/** Scan or rewrite legacy delivery fields inside existing session row JSON. */
function repairCanonicalSessionDeliveryStates(params) {
	const targets = listExistingAgentDatabaseTargets$1(params.cfg, params.env);
	let found = 0;
	let repaired = 0;
	for (const target of targets) {
		const operation = runDoctorAgentDatabaseOperation({
			agentId: target.agentId,
			path: target.sqlitePath,
			run: () => withOpenClawAgentDatabaseReadOnly((database) => collectDeliveryRewrites(database.db), {
				agentId: target.agentId,
				env: params.env,
				path: target.sqlitePath
			})
		});
		if (!operation.ok || !operation.value.found) continue;
		found += operation.value.value.length;
		if (!params.apply || operation.value.value.length === 0) continue;
		const wasOpen = isOpenClawAgentDatabaseOpen(target.sqlitePath);
		try {
			repaired += runOpenClawAgentWriteTransaction((database) => applyDeliveryRewrites(database), {
				agentId: target.agentId,
				env: params.env,
				path: target.sqlitePath
			}, { operationLabel: "doctor.canonicalize-session-delivery-state" });
		} finally {
			if (!wasOpen) closeOpenClawAgentDatabaseByPath(target.sqlitePath);
		}
	}
	return {
		found,
		repaired,
		scannedStores: targets.length
	};
}
function listExistingAgentDatabaseTargets$1(cfg, env) {
	const seenPaths = /* @__PURE__ */ new Set();
	return resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env }).flatMap((target) => {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (seenPaths.has(sqlitePath) || !fs.existsSync(sqlitePath)) return [];
		seenPaths.add(sqlitePath);
		return [{
			agentId: target.agentId,
			sqlitePath
		}];
	});
}
function collectDeliveryRewrites(database) {
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"entry_json",
		"updated_at"
	])).rows.flatMap((row) => {
		const parsed = parseSqliteSessionEntryRecord(row);
		if (!parsed) return [];
		const normalizedEntry = normalizeLegacySessionEntryDelivery(parsed);
		const entryJson = JSON.stringify(normalizedEntry);
		return entryJson === row.entry_json || !parseSqliteSessionEntryRecord({
			...row,
			entry_json: entryJson
		}) ? [] : [{
			accountId: deliveryContextFromSession(normalizedEntry)?.accountId ?? null,
			channel: sessionDeliveryChannel(normalizedEntry) ?? null,
			currentSessionId: row.current_session_id,
			entryJson,
			row
		}];
	});
}
function applyDeliveryRewrites(database) {
	const db = getNodeSqliteKysely(database.db);
	const rewrites = collectDeliveryRewrites(database.db);
	for (const rewrite of rewrites) {
		writeValidatedDoctorSessionEntryJson(database, rewrite.row, rewrite.entryJson);
		executeSqliteQuerySync(database.db, db.updateTable("session_windows").set({
			account_id: rewrite.accountId,
			channel: rewrite.channel
		}).where("session_id", "=", rewrite.currentSessionId));
	}
	return rewrites.length;
}
//#endregion
//#region src/commands/doctor-session-incognito-key-repair-state.ts
const REPAIR_JOURNAL_SCOPE = "doctor-session-key-migration";
const REPAIR_JOURNAL_KEY = "reserved-incognito-v1";
function sqliteSchemaIdentifier(value) {
	return sql.id(value);
}
function listSharedStateSessionKeyColumns(database) {
	const db = getNodeSqliteKysely(database);
	return executeSqliteQuerySync(database, db.selectFrom("sqlite_schema").select("name").where("type", "=", "table").where("name", "not like", "sqlite_%")).rows.flatMap(({ name: table }) => {
		return executeSqliteQuerySync(database, db.selectFrom(sql`pragma_table_info(${table})`.as("pragma_columns")).select(sql`name`.as("name"))).rows.flatMap(({ name: column }) => {
			if (column === "session_key" || column.endsWith("_session_key")) return [{
				table,
				column,
				json: false
			}];
			return column.endsWith("_session_keys_json") ? [{
				table,
				column,
				json: true
			}] : [];
		});
	});
}
function collectSharedStateSessionKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	for (const { table, column, json } of listSharedStateSessionKeyColumns(database)) {
		const columnId = sqliteSchemaIdentifier(column);
		const rows = executeSqliteQuerySync(database, db.selectFrom(sql`${sqliteSchemaIdentifier(table)}`.as("session_key_table")).select(columnId.as("value")).where(columnId, "is not", null)).rows;
		for (const { value } of rows) if (!json && typeof value === "string") keys.add(value);
		else if (json && typeof value === "string") try {
			collectJsonStringValues(JSON.parse(value), keys);
		} catch {}
	}
	return keys;
}
function rewriteSharedStateSessionKeys(database, renames) {
	const db = getNodeSqliteKysely(database);
	const rowId = sql`rowid`;
	for (const { table, column, json } of listSharedStateSessionKeyColumns(database)) {
		const tableId = sqliteSchemaIdentifier(table);
		const columnId = sqliteSchemaIdentifier(column);
		if (!json) {
			for (const [from, to] of renames) executeSqliteQuerySync(database, db.updateTable(sql`${tableId}`.as("session_key_table")).set(columnId, to).where(columnId, "=", from));
			continue;
		}
		const rows = executeSqliteQuerySync(database, db.selectFrom(sql`${tableId}`.as("session_key_table")).select([rowId.as("rowid"), columnId.as("value")])).rows;
		for (const row of rows) {
			if (typeof row.value !== "string") continue;
			let parsed;
			try {
				parsed = JSON.parse(row.value);
			} catch {
				continue;
			}
			const rewritten = JSON.stringify(replaceSessionKeyReferences(parsed, renames));
			if (rewritten !== row.value) executeSqliteQuerySync(database, db.updateTable(sql`${tableId}`.as("session_key_table")).set(columnId, rewritten).where(rowId, "=", row.rowid));
		}
	}
}
function collectJsonStringValues(value, values) {
	if (typeof value === "string") {
		values.add(value);
		return;
	}
	if (Array.isArray(value)) {
		for (const item of value) collectJsonStringValues(item, values);
		return;
	}
	if (!value || typeof value !== "object") return;
	for (const item of Object.values(value)) collectJsonStringValues(item, values);
}
function readRepairJournal(database) {
	const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("state_leases").select("payload_json").where("scope", "=", REPAIR_JOURNAL_SCOPE).where("lease_key", "=", REPAIR_JOURNAL_KEY));
	if (!row?.payload_json) return [];
	const parsed = JSON.parse(row.payload_json);
	if (parsed.version !== 1 || !Array.isArray(parsed.renames)) throw new Error("Invalid reserved incognito session key repair journal");
	return parsed.renames.map((item) => {
		if (!item || typeof item !== "object" || Array.isArray(item) || typeof item.from !== "string" || typeof item.to !== "string") throw new Error("Invalid reserved incognito session key repair journal entry");
		return {
			from: item.from,
			to: item.to
		};
	});
}
function readRepairJournalReadOnly(env) {
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!fs.existsSync(statePath)) return [];
	return withOpenClawStateDatabaseReadOnly((database) => readRepairJournal(database.db), {
		env,
		path: statePath
	});
}
function writeRepairJournal(database, renames) {
	const now = Date.now();
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("state_leases").values({
		scope: REPAIR_JOURNAL_SCOPE,
		lease_key: REPAIR_JOURNAL_KEY,
		owner: "openclaw-doctor",
		expires_at: null,
		heartbeat_at: null,
		payload_json: JSON.stringify({
			version: 1,
			renames
		}),
		created_at: now,
		updated_at: now
	}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doUpdateSet({
		owner: "openclaw-doctor",
		payload_json: JSON.stringify({
			version: 1,
			renames
		}),
		updated_at: now
	})));
}
function deleteRepairJournal(database) {
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("state_leases").where("scope", "=", REPAIR_JOURNAL_SCOPE).where("lease_key", "=", REPAIR_JOURNAL_KEY));
}
function replaceSessionKeyReferences(value, renames) {
	if (typeof value === "string") return renames.get(value) ?? value;
	if (Array.isArray(value)) return value.map((item) => replaceSessionKeyReferences(item, renames));
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceSessionKeyReferences(item, renames)]));
}
//#endregion
//#region src/commands/doctor-session-incognito-key-repair.ts
function repairReservedIncognitoSessionKeys(params) {
	const targets = listExistingAgentDatabaseTargets(params.cfg, params.env);
	const reservedKeys = /* @__PURE__ */ new Set();
	const sharedDatabase = params.apply ? openOpenClawStateDatabase({ env: params.env }) : void 0;
	const journalRenames = sharedDatabase ? readRepairJournal(sharedDatabase.db) : readRepairJournalReadOnly(params.env);
	const occupiedKeys = sharedDatabase ? collectSharedStateSessionKeys(sharedDatabase.db) : /* @__PURE__ */ new Set();
	for (const target of targets) {
		const operation = runDoctorAgentDatabaseOperation({
			agentId: target.agentId,
			path: target.sqlitePath,
			run: () => withOpenClawAgentDatabaseReadOnly((database) => ({
				occupied: params.apply ? collectOccupiedSessionKeys(database.db) : /* @__PURE__ */ new Set(),
				reserved: listReservedIncognitoKeys(database.db)
			}), {
				agentId: target.agentId,
				env: params.env,
				path: target.sqlitePath
			})
		});
		if (!operation.ok || !operation.value.found) continue;
		for (const key of operation.value.value.reserved) reservedKeys.add(key);
		for (const key of operation.value.value.occupied) occupiedKeys.add(key);
	}
	const pendingKeys = new Set(reservedKeys);
	for (const rename of journalRenames) pendingKeys.add(rename.from);
	if (!params.apply) return {
		found: pendingKeys.size,
		repaired: 0
	};
	if (reservedKeys.size === 0 && journalRenames.length === 0) return {
		found: 0,
		repaired: 0
	};
	for (const rename of journalRenames) occupiedKeys.add(rename.to);
	const journalSources = new Set(journalRenames.map((rename) => rename.from));
	const newRenames = planReservedIncognitoKeyRenames([...reservedKeys].filter((key) => !journalSources.has(key)).toSorted(), occupiedKeys);
	const renames = [...journalRenames, ...newRenames];
	const renameMap = new Map(renames.map((item) => [item.from, item.to]));
	runOpenClawStateWriteTransaction((database) => writeRepairJournal(database.db, renames), { env: params.env }, { operationLabel: "doctor.journal-reserved-incognito-session-keys" });
	runOpenClawStateWriteTransaction((database) => rewriteSharedStateSessionKeys(database.db, renameMap), { env: params.env }, { operationLabel: "doctor.rename-reserved-incognito-shared-state-keys" });
	for (const target of targets) {
		const wasOpen = isOpenClawAgentDatabaseOpen(target.sqlitePath);
		const options = {
			agentId: target.agentId,
			env: params.env,
			path: target.sqlitePath
		};
		try {
			runOpenClawAgentWriteTransaction((database) => applyReservedIncognitoKeyRenames(database, renames), options, { operationLabel: "doctor.rename-reserved-incognito-session-keys" });
		} finally {
			if (!wasOpen) closeOpenClawAgentDatabaseByPath(target.sqlitePath);
		}
	}
	runOpenClawStateWriteTransaction((database) => deleteRepairJournal(database.db), { env: params.env }, { operationLabel: "doctor.complete-reserved-incognito-session-keys" });
	return {
		found: pendingKeys.size,
		repaired: renames.length
	};
}
function listExistingAgentDatabaseTargets(cfg, env) {
	const seenPaths = /* @__PURE__ */ new Set();
	return resolveAllAgentSessionStoreCandidateTargetsSync(cfg, { env }).flatMap((target) => {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (seenPaths.has(sqlitePath) || !fs.existsSync(sqlitePath)) return [];
		seenPaths.add(sqlitePath);
		return [{
			agentId: target.agentId,
			sqlitePath
		}];
	});
}
function planReservedIncognitoKeyRenames(keys, occupied) {
	return keys.map((key) => {
		const base = legacyIncognitoSessionKey(key);
		if (parseAgentSessionKey(key)?.rest.startsWith("internal-session-effects:") && occupied.has(base)) throw new Error(`Cannot repair internal session key because ${base} already exists`);
		let candidate = base;
		let suffix = 1;
		while (occupied.has(candidate)) {
			candidate = `${base}-${suffix}`;
			suffix += 1;
		}
		occupied.add(candidate);
		return {
			from: key,
			to: candidate
		};
	});
}
function applyReservedIncognitoKeyRenames(database, renames) {
	if (renames.length === 0) return;
	database.db.exec("PRAGMA defer_foreign_keys = ON;");
	for (const rename of renames) updateSessionKeyColumns(database.db, rename);
	rewriteSessionEntryJsonReferences(database, new Map(renames.map((item) => [item.from, item.to])));
	publishSessionEntryCacheInvalidation(database);
}
function legacyIncognitoSessionKey(sessionKey) {
	const parsed = parseAgentSessionKey(sessionKey);
	if (!parsed || !isIncognitoSessionKey(sessionKey)) throw new Error(`Cannot rename non-incognito session key: ${sessionKey}`);
	return `agent:${parsed.agentId}:${parsed.rest.replace(":incognito-", ":legacy-incognito-")}`;
}
function listReservedIncognitoKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	for (const row of executeSqliteQuerySync(database, db.selectFrom("session_nodes").select("session_key")).rows) keys.add(row.session_key);
	for (const row of executeSqliteQuerySync(database, db.selectFrom("session_windows").select("session_key")).rows) keys.add(row.session_key);
	return [...keys].filter(isIncognitoSessionKey).toSorted();
}
function collectOccupiedSessionKeys(database) {
	const db = getNodeSqliteKysely(database);
	const keys = /* @__PURE__ */ new Set();
	const collect = (values) => {
		for (const value of values) if (value) keys.add(value);
	};
	collect(executeSqliteQuerySync(database, db.selectFrom("session_windows").select([
		"session_key",
		"parent_session_key",
		"spawned_by"
	])).rows.flatMap((row) => [
		row.session_key,
		row.parent_session_key,
		row.spawned_by
	]));
	collect(executeSqliteQuerySync(database, db.selectFrom("session_nodes").select([
		"session_key",
		"parent_session_key",
		"spawned_by",
		"fork_source_session_key"
	])).rows.flatMap((row) => [
		row.session_key,
		row.parent_session_key,
		row.spawned_by,
		row.fork_source_session_key
	]));
	collect(executeSqliteQuerySync(database, db.selectFrom("conversation_deliveries").select("source_session_key")).rows.map((row) => row.source_session_key));
	for (const row of executeSqliteQuerySync(database, db.selectFrom("session_nodes").select("entry_json")).rows) try {
		collectSessionEntryKeyFields(JSON.parse(row.entry_json), keys);
	} catch {}
	collect(executeSqliteQuerySync(database, db.selectFrom("board_tabs").select("session_key")).rows.map((row) => row.session_key));
	collect(executeSqliteQuerySync(database, db.selectFrom("board_widgets").select("session_key")).rows.map((row) => row.session_key));
	collect(executeSqliteQuerySync(database, db.selectFrom("heartbeat_outcomes").select(["session_key", "run_session_key"])).rows.flatMap((row) => [row.session_key, row.run_session_key]));
	return keys;
}
function updateSessionKeyColumns(database, rename) {
	const db = getNodeSqliteKysely(database);
	const update = (query) => executeSqliteQuerySync(database, query);
	update(db.updateTable("session_windows").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("session_windows").set({ parent_session_key: rename.to }).where("parent_session_key", "=", rename.from));
	update(db.updateTable("session_windows").set({ spawned_by: rename.to }).where("spawned_by", "=", rename.from));
	update(db.updateTable("session_nodes").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("session_nodes").set({ parent_session_key: rename.to }).where("parent_session_key", "=", rename.from));
	update(db.updateTable("session_nodes").set({ spawned_by: rename.to }).where("spawned_by", "=", rename.from));
	update(db.updateTable("session_nodes").set({ fork_source_session_key: rename.to }).where("fork_source_session_key", "=", rename.from));
	update(db.updateTable("conversation_deliveries").set({ source_session_key: rename.to }).where("source_session_key", "=", rename.from));
	update(db.updateTable("session_members").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("board_tabs").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("board_widgets").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("heartbeat_outcomes").set({ session_key: rename.to }).where("session_key", "=", rename.from));
	update(db.updateTable("heartbeat_outcomes").set({ run_session_key: rename.to }).where("run_session_key", "=", rename.from));
}
function rewriteSessionEntryJsonReferences(database, renames) {
	const db = getNodeSqliteKysely(database.db);
	const rows = executeSqliteQuerySync(database.db, db.selectFrom("session_nodes").select([
		"session_key",
		"current_session_id",
		"entry_json",
		"updated_at"
	])).rows;
	for (const row of rows) {
		let parsed;
		try {
			parsed = JSON.parse(row.entry_json);
		} catch {
			continue;
		}
		const rewritten = rewriteSessionEntryKeyFields(parsed, renames);
		const entryJson = JSON.stringify(rewritten);
		if (entryJson === row.entry_json) continue;
		writeValidatedDoctorSessionEntryJson(database, row, entryJson);
	}
}
function rewriteSessionEntryKeyFields(value, renames) {
	visitSessionEntryKeyFields(value, (record, key) => {
		const current = record[key];
		if (typeof current === "string") record[key] = renames.get(current) ?? current;
	});
	return value;
}
function collectSessionEntryKeyFields(value, keys) {
	visitSessionEntryKeyFields(value, (record, key) => {
		const current = record[key];
		if (typeof current === "string") keys.add(current);
	});
}
function visitSessionEntryKeyFields(value, visit) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const entry = value;
	for (const key of [
		"heartbeatIsolatedBaseSessionKey",
		"spawnedBy",
		"completionOwnerSessionKey",
		"parentSessionKey"
	]) visit(entry, key);
	if (entry.forkSource && typeof entry.forkSource === "object" && !Array.isArray(entry.forkSource)) {
		const forkSource = entry.forkSource;
		visit(forkSource, "sessionKey");
	}
	if (Array.isArray(entry.compactionCheckpoints)) for (const checkpoint of entry.compactionCheckpoints) {
		if (!checkpoint || typeof checkpoint !== "object" || Array.isArray(checkpoint)) continue;
		visit(checkpoint, "sessionKey");
	}
	if (entry.systemPromptReport && typeof entry.systemPromptReport === "object" && !Array.isArray(entry.systemPromptReport)) {
		const report = entry.systemPromptReport;
		visit(report, "sessionKey");
	}
}
//#endregion
//#region src/commands/doctor-session-transcripts.ts
const SESSION_TRANSCRIPTS_CHECK_ID = "core/doctor/session-transcripts";
const OPENAI_PROVIDER_ID = "openai";
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
function parseTranscriptEntries(raw) {
	const entries = [];
	for (const line of raw.split(/\r?\n/)) {
		if (!line.trim()) continue;
		try {
			const parsed = JSON.parse(line);
			if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) entries.push(parsed);
		} catch {
			return [];
		}
	}
	return entries;
}
function getEntryId(entry) {
	return typeof entry.id === "string" && entry.id.trim() ? entry.id : null;
}
function getParentId(entry) {
	return typeof entry.parentId === "string" && entry.parentId.trim() ? entry.parentId : null;
}
function getMessage(entry) {
	return entry.message && typeof entry.message === "object" && !Array.isArray(entry.message) ? entry.message : null;
}
function withSelectedParent(entry, parentId) {
	return entry.parentId === parentId ? entry : {
		...entry,
		parentId
	};
}
function normalizeLegacyOpenAICodexTranscriptMetadata(entries) {
	let changed = 0;
	for (const entry of entries) {
		const message = getMessage(entry);
		if (!message) continue;
		let touched = false;
		if (isLegacyCodexProviderId(message.provider)) {
			message.provider = OPENAI_PROVIDER_ID;
			touched = true;
		}
		if (message.api === LEGACY_OPENAI_CODEX_RESPONSES_API) {
			message.api = OPENAI_CHATGPT_RESPONSES_API;
			touched = true;
		}
		if (touched) changed += 1;
	}
	return changed;
}
function textFromContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return null;
	return content.map((part) => part && typeof part === "object" && typeof part.text === "string" ? part.text : "").join("") || null;
}
function selectActivePath(entries) {
	const sessionEntries = entries.filter((entry) => entry.type !== "session");
	const tree = scanSessionTranscriptTree(sessionEntries);
	if (!tree.hasExplicitLeafUpdate) {
		const byId = /* @__PURE__ */ new Map();
		for (const entry of sessionEntries) {
			const id = getEntryId(entry);
			if (id) byId.set(id, entry);
		}
		const active = [];
		const seen = /* @__PURE__ */ new Set();
		let current = sessionEntries.at(-1);
		while (current) {
			const id = getEntryId(current);
			if (!id || seen.has(id)) return null;
			seen.add(id);
			active.unshift(current);
			const parentId = getParentId(current);
			current = parentId ? byId.get(parentId) : void 0;
		}
		return active.length > 0 ? {
			entries: active,
			entriesToPersist: active,
			terminalLeafControl: null,
			appendParentId: getEntryId(active.at(-1) ?? {})
		} : null;
	}
	if (!tree.hasLeafUpdate) return null;
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const appendPath = selectSessionTranscriptTreePathNodes(tree, tree.appendParentId);
	const visibleEntries = mergeSessionTranscriptTreePaths([visiblePath]).map((node) => withSelectedParent(node.entry, node.selectedParentId));
	const persistedPath = mergeSessionTranscriptVisiblePathWithOpaqueAppendPath({
		visiblePath,
		appendPath,
		appendParentId: tree.appendParentId
	});
	const entriesToPersist = persistedPath.nodes.map((node) => withSelectedParent(node.entry, node.selectedParentId));
	const lastLeafUpdateEntry = tree.nodes.findLast((node) => node.leafId !== void 0)?.entry;
	return {
		entries: visibleEntries,
		entriesToPersist,
		terminalLeafControl: isSessionTranscriptLeafControl(lastLeafUpdateEntry) ? lastLeafUpdateEntry : null,
		appendParentId: persistedPath.appendParentId
	};
}
function hasBrokenPromptRewriteBranch(entries, activePath) {
	const activeIds = new Set(activePath.map(getEntryId).filter((id) => Boolean(id)));
	const activeUserByParentAndText = /* @__PURE__ */ new Set();
	for (const entry of activePath) {
		const id = getEntryId(entry);
		const message = getMessage(entry);
		if (!id || message?.role !== "user") continue;
		const text = textFromContent(message.content);
		if (text !== null) activeUserByParentAndText.add(`${getParentId(entry) ?? ""}\0${text.trim()}`);
	}
	for (const entry of entries) {
		const id = getEntryId(entry);
		if (!id || activeIds.has(id)) continue;
		const message = getMessage(entry);
		if (message?.role !== "user") continue;
		const text = textFromContent(message.content);
		if (!text || !hasInternalRuntimeContext(text)) continue;
		const visibleText = stripInternalRuntimeContext(text).trim();
		if (visibleText && activeUserByParentAndText.has(`${getParentId(entry) ?? ""}\0${visibleText}`)) return true;
	}
	return false;
}
async function writeActiveTranscript(params) {
	const header = params.entries.find((entry) => entry.type === "session");
	if (!header) throw new Error("missing session header");
	const backupPath = `${params.filePath}.pre-doctor-branch-repair-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.bak`;
	await fs$1.copyFile(params.filePath, backupPath);
	const lastPersistedId = getEntryId(params.activePath.entriesToPersist.at(-1) ?? {});
	const terminalLeafControl = params.activePath.terminalLeafControl ? {
		...params.activePath.terminalLeafControl,
		parentId: lastPersistedId,
		appendParentId: params.activePath.appendParentId
	} : null;
	const next = [
		header,
		...params.activePath.entriesToPersist,
		...terminalLeafControl ? [terminalLeafControl] : []
	].map((entry) => JSON.stringify(entry)).join("\n");
	await fs$1.writeFile(params.filePath, `${next}\n`, "utf-8");
	return backupPath;
}
async function writeTranscriptEntries(params) {
	const backupPath = `${params.filePath}.pre-doctor-openai-codex-repair-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.bak`;
	await fs$1.copyFile(params.filePath, backupPath);
	const next = params.entries.map((entry) => JSON.stringify(entry)).join("\n");
	await fs$1.writeFile(params.filePath, `${next}\n`, "utf-8");
	return backupPath;
}
/** Repairs one transcript file by keeping the active branch and backing up the original file. */
async function repairBrokenSessionTranscriptFile(params) {
	try {
		const entries = parseTranscriptEntries(await fs$1.readFile(params.filePath, "utf-8"));
		const legacyOpenAICodexEntries = normalizeLegacyOpenAICodexTranscriptMetadata(entries);
		const activePath = selectActivePath(entries);
		if (!activePath) {
			if (legacyOpenAICodexEntries > 0 && params.shouldRepair) {
				const backupPath = await writeTranscriptEntries({
					filePath: params.filePath,
					entries
				});
				return {
					filePath: params.filePath,
					broken: true,
					repaired: true,
					originalEntries: entries.length,
					activeEntries: 0,
					legacyOpenAICodexEntries,
					backupPath,
					reason: "no active branch"
				};
			}
			return {
				filePath: params.filePath,
				broken: legacyOpenAICodexEntries > 0,
				repaired: false,
				originalEntries: entries.length,
				activeEntries: 0,
				legacyOpenAICodexEntries,
				reason: "no active branch"
			};
		}
		const broken = hasBrokenPromptRewriteBranch(entries, activePath.entries);
		if (!broken && legacyOpenAICodexEntries === 0) return {
			filePath: params.filePath,
			broken: false,
			repaired: false,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries
		};
		if (!params.shouldRepair) return {
			filePath: params.filePath,
			broken: true,
			repaired: false,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries
		};
		const backupPath = broken ? await writeActiveTranscript({
			filePath: params.filePath,
			entries,
			activePath
		}) : await writeTranscriptEntries({
			filePath: params.filePath,
			entries
		});
		return {
			filePath: params.filePath,
			broken: true,
			repaired: true,
			originalEntries: entries.length,
			activeEntries: activePath.entries.length,
			legacyOpenAICodexEntries,
			backupPath
		};
	} catch (err) {
		return {
			filePath: params.filePath,
			broken: false,
			repaired: false,
			originalEntries: 0,
			activeEntries: 0,
			legacyOpenAICodexEntries: 0,
			reason: String(err)
		};
	}
}
async function listSessionTranscriptFiles(sessionDirs) {
	const files = [];
	for (const sessionsDir of sessionDirs) {
		let entries;
		try {
			entries = await fs$1.readdir(sessionsDir, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const entry of entries) if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(path.join(sessionsDir, entry.name));
	}
	return files.toSorted((a, b) => a.localeCompare(b));
}
async function detectSessionTranscriptHealthIssues(params) {
	let sessionDirs = params?.sessionDirs;
	try {
		sessionDirs ??= await resolveAgentSessionDirs(resolveStateDir(process.env));
	} catch {
		return [];
	}
	const files = await listSessionTranscriptFiles(sessionDirs);
	const issues = [];
	for (const filePath of files) {
		const result = await repairBrokenSessionTranscriptFile({
			filePath,
			shouldRepair: false
		});
		if (result.broken) issues.push(result);
	}
	return issues;
}
function sessionTranscriptIssueToHealthFinding(issue) {
	const metadata = issue.legacyOpenAICodexEntries > 0 ? ` ${issue.legacyOpenAICodexEntries} legacy OpenAI Codex metadata entr${issue.legacyOpenAICodexEntries === 1 ? "y" : "ies"}` : "";
	return {
		checkId: SESSION_TRANSCRIPTS_CHECK_ID,
		severity: "info",
		message: `Session transcript has legacy branch or provider metadata that can be cleaned up.${metadata}`,
		path: issue.filePath,
		fixHint: "To clean up the advisory artifact, run `openclaw doctor --fix` to rewrite affected transcripts to their active branch."
	};
}
function sessionTranscriptIssueToRepairEffect(issue) {
	return {
		kind: "file",
		action: "would-rewrite-session-transcript",
		target: issue.filePath,
		dryRunSafe: false
	};
}
/** Scans session transcript files and reports or repairs legacy/broken transcript state. */
async function noteSessionTranscriptHealth(params) {
	const shouldRepair = params?.shouldRepair === true;
	let sessionDirs = params?.sessionDirs;
	try {
		sessionDirs ??= await resolveAgentSessionDirs(resolveStateDir(process.env));
	} catch (err) {
		note(`- Failed to inspect session transcripts: ${String(err)}`, "Session transcripts");
		return;
	}
	const results = [];
	const files = await listSessionTranscriptFiles(sessionDirs);
	if (files.length > 0 && shouldRepair) for (const filePath of files) results.push(await repairBrokenSessionTranscriptFile({
		filePath,
		shouldRepair
	}));
	else if (files.length > 0) results.push(...await detectSessionTranscriptHealthIssues({ sessionDirs }));
	const broken = results.filter((result) => result.broken);
	if (broken.length > 0) {
		const repairedCount = broken.filter((result) => result.repaired).length;
		const lines = [`- Found ${broken.length} transcript file${broken.length === 1 ? "" : "s"} with legacy state.`, ...broken.slice(0, 20).map((result) => {
			const backup = result.backupPath ? ` backup=${shortenHomePath(result.backupPath)}` : "";
			const status = result.repaired ? "repaired" : "needs repair";
			const metadata = result.legacyOpenAICodexEntries > 0 ? ` openai-codex=${result.legacyOpenAICodexEntries}` : "";
			return `- ${shortenHomePath(result.filePath)} ${status} entries=${result.originalEntries}->${result.activeEntries + 1}${metadata}${backup}`;
		})];
		if (broken.length > 20) lines.push(`- ...and ${broken.length - 20} more.`);
		if (!shouldRepair) lines.push("- Run \"openclaw doctor --fix\" to rewrite affected files to their active branch.");
		else if (repairedCount > 0) lines.push(`- Repaired ${repairedCount} transcript file${repairedCount === 1 ? "" : "s"}.`);
		note(lines.join("\n"), "Session transcripts");
	}
	if (params?.sessionDirs === void 0 || params.sessionSqlite === true) await noteSessionSqliteMigrationHealth({
		cfg: params?.cfg,
		env: params?.env ?? process.env,
		shouldRepair
	});
}
async function noteSessionSqliteMigrationHealth(params) {
	const { runDoctorSessionSqlite } = await import("./doctor-session-sqlite-DnKKN_I8.js");
	let reservedKeyReport = {
		found: 0,
		repaired: 0
	};
	let deliveryReport = {
		found: 0,
		repaired: 0,
		scannedStores: 0
	};
	let canonicalKeyReport = {
		archivedTranscriptDirectories: [],
		foundGroups: 0,
		repairBatches: 0,
		removedRows: 0,
		repairedGroups: 0,
		scannedStores: 0
	};
	let legacyMainSessionResult;
	const runSessionSqlite = async () => {
		const report = await runDoctorSessionSqlite({
			allAgents: true,
			...params.cfg ? { cfg: params.cfg } : {},
			env: params.env,
			mode: params.shouldRepair ? "import" : "dry-run"
		});
		const { migrateLegacyMainSessionKeys } = await import("./legacy-main-session-migration-LI9b3OVc.js");
		legacyMainSessionResult = await migrateLegacyMainSessionKeys({
			cfg: params.cfg ?? {},
			env: params.env,
			mode: params.shouldRepair ? "doctor-fix" : "detect"
		});
		canonicalKeyReport = await repairCanonicalSessionKeys({
			apply: params.shouldRepair,
			cfg: params.cfg ?? {},
			env: params.env
		});
		reservedKeyReport = repairReservedIncognitoSessionKeys({
			apply: params.shouldRepair,
			cfg: params.cfg ?? {},
			env: params.env
		});
		deliveryReport = repairCanonicalSessionDeliveryStates({
			apply: params.shouldRepair,
			cfg: params.cfg ?? {},
			env: params.env
		});
		return report;
	};
	let report;
	try {
		report = params.shouldRepair ? await withDoctorSqliteMaintenanceLock({
			env: params.env,
			operation: "session SQLite import",
			run: runSessionSqlite
		}) : await runSessionSqlite();
	} catch (error) {
		if (!(error instanceof DoctorSqliteMaintenanceLockUnavailableError)) throw error;
		note(`- Skipped: Gateway or another SQLite maintenance command owns the state directory. Stop the Gateway, then run "${formatCliCommand("openclaw doctor --fix", params.env)}" for session-store maintenance.`, "Session SQLite");
		return;
	}
	if (reservedKeyReport.found > 0) note(params.shouldRepair ? `- Renamed ${reservedKeyReport.repaired} durable session key(s) that collided with the reserved incognito namespace.` : `- Found ${reservedKeyReport.found} durable session key(s) that collide with the reserved incognito namespace. Run "openclaw doctor --fix" to rename them.`, "Session SQLite");
	if (canonicalKeyReport.foundGroups > 0) note(params.shouldRepair ? `- Canonicalized ${canonicalKeyReport.repairedGroups} session-key group(s) in ${canonicalKeyReport.repairBatches} transaction batch(es), removed ${canonicalKeyReport.removedRows} duplicate or alias row(s), and preserved cross-store history in ${canonicalKeyReport.archivedTranscriptDirectories.length} archive director${canonicalKeyReport.archivedTranscriptDirectories.length === 1 ? "y" : "ies"}.` : `- Found ${canonicalKeyReport.foundGroups} non-canonical or duplicate session-key group(s). Run "openclaw doctor --fix" to preserve their history and canonicalize the rows.`, "Session SQLite");
	if (deliveryReport.found > 0) note(params.shouldRepair ? `- Canonicalized delivery state for ${deliveryReport.repaired} durable session row(s).` : `- Found ${deliveryReport.found} durable session row(s) with legacy delivery fields. Run "openclaw doctor --fix" to canonicalize them.`, "Session SQLite");
	if (legacyMainSessionResult && (legacyMainSessionResult.changes.length > 0 || legacyMainSessionResult.warnings.length > 0)) note([...legacyMainSessionResult.changes.map((change) => `- ${change}`), ...legacyMainSessionResult.warnings.map((warning) => `- ${warning}`)].join("\n"), "Legacy main sessions");
	if (report.totals.legacyEntries === 0 && report.totals.unreferencedJsonlFiles === 0 && report.totals.issues === 0) return;
	const lines = [`- Legacy entries: ${report.totals.legacyEntries}; SQLite entries: ${report.totals.sqliteEntries}.`, `- Transcript events: imported=${report.totals.importedTranscriptEvents}; validated=${report.totals.validatedTranscriptEvents}.`];
	if (report.totals.archivedTranscriptFiles > 0) lines.push(`- Archived ${report.totals.archivedTranscriptFiles} legacy transcript artifact(s).`);
	if (report.totals.archivedUnreferencedJsonlFiles > 0) lines.push(`- Archived ${report.totals.archivedUnreferencedJsonlFiles} unreferenced JSONL artifact(s).`);
	if (report.totals.issues > 0) lines.push(`- Found ${report.totals.issues} session SQLite issue(s).`);
	if (!params.shouldRepair) lines.push("- Run \"openclaw doctor --fix\" to migrate legacy session metadata/transcripts to SQLite.");
	note(lines.join("\n"), "Session SQLite");
}
//#endregion
export { detectSessionTranscriptHealthIssues, noteSessionTranscriptHealth, sessionTranscriptIssueToHealthFinding, sessionTranscriptIssueToRepairEffect };
