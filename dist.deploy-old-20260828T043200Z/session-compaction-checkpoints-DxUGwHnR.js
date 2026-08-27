import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as isCompactionCheckpointTranscriptFileName } from "./artifacts-FzMa6c2e.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { An as executeSqliteQuerySync } from "./openclaw-state-db-CeAO_dqo.js";
import { y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-CM8nAOgX.js";
import { f as loadSessionEntry } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { _ as readSessionIdentitySnapshot, b as writeSessionEntry, m as readSessionEntryRow } from "./session-accessor.sqlite-entry-store-DmHR081P.js";
import { t as collectSessionEntryLookupKeys } from "./store-entry-CwpzgKGD.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { a as normalizeSqliteSessionKey, c as resolveSqliteScope, i as getSessionKysely, m as toDatabaseOptions, p as runExclusiveSqliteSessionWrite, r as formatSqliteSessionReferenceForScope } from "./session-accessor.sqlite-scope-DPR8rGGl.js";
import { s as emitCommittedSessionIdentityDiff } from "./session-history-eviction-6hHpt56d.js";
import { T as scanSessionTranscriptTree } from "./session-transcript-index-DtVCy6vi.js";
import "./types-BEJRKmOU.js";
import { nt as updateSessionEntry } from "./session-accessor-B-FKZX9M.js";
import { S as loadTranscriptEventsSync, n as appendTranscriptEventsInTransaction, o as readTranscriptIdentityByEventId, p as createSessionTranscriptHeader } from "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import "./sessions-CdrF1uzY.js";
import { r as readFileRangeAsync, t as streamSessionTranscriptLines } from "./transcript-stream-Dmc7cIIB.js";
import { a as migrateSessionEntries } from "./session-manager-codec-BQhwecUx.js";
import "./session-manager-NHyzKWb5.js";
import { d as resolveGatewaySessionStoreTarget } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/config/sessions/session-accessor.sqlite-checkpoint.ts
async function branchCompactionCheckpointSession(params) {
	return await applySqliteCompactionCheckpointSessionOperation({
		...params,
		kind: "branch"
	});
}
async function restoreCompactionCheckpointSession(params) {
	return await applySqliteCompactionCheckpointSessionOperation({
		...params,
		kind: "restore"
	});
}
async function applySqliteCompactionCheckpointSessionOperation(operation) {
	const sourceKey = normalizeSqliteSessionKey(operation.kind === "branch" ? operation.sourceStoreKey ?? operation.sourceKey : operation.sessionStoreKey ?? operation.sessionKey);
	const targetKey = normalizeSqliteSessionKey(operation.kind === "branch" ? operation.nextKey : operation.sessionKey);
	const resolved = resolveSqliteScope({
		...operation.agentId ? { agentId: operation.agentId } : {},
		...operation.env ? { env: operation.env } : {},
		sessionKey: sourceKey,
		...operation.storePath ? { storePath: operation.storePath } : {}
	});
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		const committed = runOpenClawAgentWriteTransaction((database) => {
			const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(database, sourceKey), ...collectSessionEntryLookupKeys(database, targetKey)]);
			const previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
			const result = applySqliteCompactionCheckpointSessionOperationInTransaction(database, resolved, operation, sourceKey, targetKey);
			return {
				previousIdentity,
				currentIdentity: readSessionIdentitySnapshot(database, identityKeys),
				result
			};
		}, toDatabaseOptions(resolved));
		emitCommittedSessionIdentityDiff(committed.previousIdentity, committed.currentIdentity);
		return committed.result;
	});
}
function applySqliteCompactionCheckpointSessionOperationInTransaction(database, resolved, operation, sourceKey, targetKey) {
	const currentEntry = readSessionEntryRow(database, sourceKey)?.entry;
	if (!currentEntry?.sessionId) return { status: "missing-session" };
	if (currentEntry.sessionId !== operation.expectedState.sessionId || currentEntry.lifecycleRevision !== operation.expectedState.lifecycleRevision) return { status: "conflict" };
	if (currentEntry.modelSelectionLocked === true) return { status: "model-selection-locked" };
	const checkpoint = readSessionCompactionCheckpoint(currentEntry, operation.checkpointId);
	if (!checkpoint) return { status: "missing-checkpoint" };
	const forked = forkSqliteCheckpointTranscriptInTransaction(database, resolved, {
		checkpoint,
		legacySource: operation.legacySource,
		targetSessionKey: targetKey
	});
	if (forked.status !== "created") return forked;
	const nextEntry = operation.kind === "branch" ? cloneSqliteCheckpointSessionEntry({
		currentEntry,
		label: currentEntry.label?.trim() ? `${currentEntry.label.trim()} (checkpoint)` : "Checkpoint branch",
		nextSessionId: forked.sessionId,
		parentSessionKey: normalizeSqliteSessionKey(operation.sourceKey),
		totalTokens: forked.totalTokens
	}) : cloneSqliteCheckpointSessionEntry({
		currentEntry,
		nextSessionId: forked.sessionId,
		preserveCompactionCheckpoints: true,
		totalTokens: forked.totalTokens
	});
	writeSessionEntry(database, targetKey, nextEntry);
	return {
		status: "created",
		key: targetKey,
		checkpoint,
		entry: nextEntry
	};
}
function forkSqliteCheckpointTranscriptInTransaction(database, resolved, params) {
	const sources = resolveSqliteCheckpointTranscriptForkSources(params.checkpoint);
	if (sources.length === 0) return { status: "missing-boundary" };
	let lastFailure = { status: "missing-boundary" };
	let selected;
	for (const source of sources) {
		const rows = readSqliteTranscriptRowsForFork(database, source);
		if (rows.status === "created") {
			selected = {
				source,
				rows: rows.events
			};
			break;
		}
		lastFailure = rows;
	}
	const legacySource = selected ? void 0 : resolvePreparedLegacyCheckpointSource(params.checkpoint, params.legacySource);
	if (!selected && !legacySource) return lastFailure;
	const sessionId = randomUUID();
	const targetScope = {
		...resolved,
		sessionId,
		sessionKey: params.targetSessionKey
	};
	const sessionFile = formatSqliteSessionReferenceForScope(targetScope);
	const selectedEvents = selected?.rows ?? legacySource?.events ?? [];
	const totalTokens = selected?.source.totalTokens ?? legacySource?.totalTokens;
	appendTranscriptEventsInTransaction(database, targetScope, [createSessionTranscriptHeader({
		cwd: readTranscriptHeaderCwd(selectedEvents),
		sessionId
	}), ...selectedEvents.filter((event) => !isSessionTranscriptHeader(event))]);
	return {
		status: "created",
		sessionId,
		sessionFile,
		...typeof totalTokens === "number" ? { totalTokens } : {}
	};
}
function resolvePreparedLegacyCheckpointSource(checkpoint, source) {
	if (!source || source.checkpointId !== checkpoint.checkpointId || source.events.length === 0) return;
	return [checkpoint.preCompaction, checkpoint.postCompaction].some((position) => {
		const sessionFile = position.sessionFile?.trim();
		const sourceLeafId = position.entryId?.trim() || position.leafId?.trim() || void 0;
		return sessionFile === source.sessionFile && sourceLeafId === source.sourceLeafId;
	}) ? source : void 0;
}
function resolveSqliteCheckpointTranscriptForkSources(checkpoint) {
	const sources = [];
	const checkpointTokensTrusted = checkpoint.tokensVersion === 1;
	if (checkpoint.preCompaction.sessionId) {
		const preLeafId = checkpoint.preCompaction.entryId ?? checkpoint.preCompaction.leafId;
		sources.push({
			sessionId: checkpoint.preCompaction.sessionId,
			...preLeafId ? { leafId: preLeafId } : {},
			...checkpointTokensTrusted && typeof checkpoint.tokensBefore === "number" ? { totalTokens: checkpoint.tokensBefore } : {}
		});
	}
	const postLeafId = checkpoint.postCompaction.entryId ?? checkpoint.postCompaction.leafId;
	if (checkpoint.postCompaction.sessionId && postLeafId) sources.push({
		sessionId: checkpoint.postCompaction.sessionId,
		leafId: postLeafId,
		...checkpointTokensTrusted && typeof checkpoint.tokensAfter === "number" ? { totalTokens: checkpoint.tokensAfter } : {}
	});
	return sources;
}
function readSqliteTranscriptRowsForFork(database, source) {
	const boundarySeq = source.leafId ? readTranscriptIdentityByEventId(database, source.sessionId, source.leafId)?.seq : void 0;
	if (source.leafId && boundarySeq === void 0) return { status: "missing-boundary" };
	const query = getSessionKysely(database.db).selectFrom("transcript_events").select(["event_json", "seq"]).where("session_id", "=", source.sessionId).orderBy("seq", "asc");
	const rows = executeSqliteQuerySync(database.db, boundarySeq === void 0 ? query : query.where("seq", "<=", boundarySeq)).rows;
	if (rows.length === 0) return { status: "failed" };
	try {
		return {
			status: "created",
			events: rows.map((row) => JSON.parse(row.event_json))
		};
	} catch {
		return { status: "failed" };
	}
}
function readSessionCompactionCheckpoint(entry, checkpointId) {
	const normalizedCheckpointId = checkpointId.trim();
	if (!normalizedCheckpointId || !Array.isArray(entry.compactionCheckpoints)) return;
	return entry.compactionCheckpoints.find((checkpoint) => checkpoint.checkpointId === normalizedCheckpointId);
}
function cloneSqliteCheckpointSessionEntry(params) {
	const hasTotalTokens = typeof params.totalTokens === "number" && Number.isFinite(params.totalTokens);
	return {
		...params.currentEntry,
		sessionId: params.nextSessionId,
		updatedAt: Date.now(),
		systemSent: false,
		abortedLastRun: false,
		lifecycleRunId: void 0,
		lastRunId: void 0,
		startedAt: void 0,
		endedAt: void 0,
		runtimeMs: void 0,
		status: void 0,
		inputTokens: void 0,
		outputTokens: void 0,
		cacheRead: void 0,
		cacheWrite: void 0,
		estimatedCostUsd: void 0,
		totalTokens: hasTotalTokens ? params.totalTokens : void 0,
		totalTokensFresh: hasTotalTokens ? true : void 0,
		totalTokensVersion: hasTotalTokens ? 1 : void 0,
		label: params.label ?? params.currentEntry.label,
		parentSessionKey: params.parentSessionKey ?? params.currentEntry.parentSessionKey,
		compactionCheckpoints: params.preserveCompactionCheckpoints ? params.currentEntry.compactionCheckpoints : void 0
	};
}
function readTranscriptHeaderCwd(events) {
	const header = events.find(isSessionTranscriptHeader);
	return typeof header?.cwd === "string" && header.cwd.trim() ? header.cwd : void 0;
}
function isSessionTranscriptHeader(event) {
	return Boolean(event && typeof event === "object" && !Array.isArray(event) && event.type === "session");
}
//#endregion
//#region src/gateway/session-compaction-checkpoints.ts
const log = createSubsystemLogger("gateway/session-compaction-checkpoints");
const MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES = 64 * 1024 * 1024;
const MAX_COMPACTION_CHECKPOINT_RETAINED_BYTES_PER_SESSION = 128 * 1024 * 1024;
function resolveCompactionCheckpointTranscriptPosition(params) {
	const leafId = params.preferredLeafId ?? params.transcriptState?.leafId ?? void 0;
	const entryId = params.transcriptState?.entryId ?? leafId;
	return {
		...leafId ? { leafId } : {},
		...entryId ? { entryId } : {}
	};
}
function checkpointSnapshotPath(checkpoint) {
	return checkpoint.preCompaction.sessionFile?.trim() || void 0;
}
function checkpointSnapshotBytes(checkpoint, snapshotBytesByPath) {
	const sessionFile = checkpointSnapshotPath(checkpoint);
	if (!sessionFile) return 0;
	const bytes = snapshotBytesByPath.get(sessionFile);
	return typeof bytes === "number" && Number.isFinite(bytes) && bytes > 0 ? bytes : 0;
}
function trimSessionCheckpoints(checkpoints, snapshotBytesByPath = /* @__PURE__ */ new Map()) {
	if (!Array.isArray(checkpoints) || checkpoints.length === 0) return {
		kept: void 0,
		removed: []
	};
	const countTrimmed = checkpoints.slice(-25);
	const countRemoved = checkpoints.slice(0, Math.max(0, checkpoints.length - countTrimmed.length));
	const keptNewestFirst = [];
	const byteRemovedNewestFirst = [];
	let retainedBytes = 0;
	for (let index = countTrimmed.length - 1; index >= 0; index -= 1) {
		const checkpoint = countTrimmed[index];
		if (!checkpoint) continue;
		const checkpointBytes = checkpointSnapshotBytes(checkpoint, snapshotBytesByPath);
		if (keptNewestFirst.length === 0 || retainedBytes + checkpointBytes <= MAX_COMPACTION_CHECKPOINT_RETAINED_BYTES_PER_SESSION) {
			keptNewestFirst.push(checkpoint);
			retainedBytes += checkpointBytes;
		} else byteRemovedNewestFirst.push(checkpoint);
	}
	const kept = keptNewestFirst.toReversed();
	return {
		kept: kept.length > 0 ? kept : void 0,
		removed: [...countRemoved, ...byteRemovedNewestFirst.toReversed()]
	};
}
function sessionStoreCheckpoints(entry) {
	return Array.isArray(entry?.compactionCheckpoints) ? [...entry.compactionCheckpoints] : [];
}
async function statCheckpointSnapshotBytes(checkpoints) {
	const bytesByPath = /* @__PURE__ */ new Map();
	await Promise.all(checkpoints.map(async (checkpoint) => {
		const sessionFile = checkpointSnapshotPath(checkpoint);
		if (!sessionFile || bytesByPath.has(sessionFile)) return;
		try {
			const stat = await fs.stat(sessionFile);
			bytesByPath.set(sessionFile, stat.isFile() ? stat.size : 0);
		} catch {
			bytesByPath.set(sessionFile, 0);
		}
	}));
	return bytesByPath;
}
/** Resolve the stored checkpoint reason from compaction trigger state. */
function resolveSessionCompactionCheckpointReason(params) {
	if (params.trigger === "manual") return "manual";
	if (params.timedOut) return "timeout-retry";
	if (params.trigger === "overflow") return "overflow-retry";
	return "auto-threshold";
}
const SESSION_HEADER_READ_MAX_BYTES = 64 * 1024;
const SESSION_TAIL_READ_INITIAL_BYTES = 64 * 1024;
async function readSessionHeaderFromTranscriptAsync(sessionFile) {
	let fileHandle;
	try {
		fileHandle = await fs.open(sessionFile, "r");
		const buffer = await readFileRangeAsync(fileHandle, 0, SESSION_HEADER_READ_MAX_BYTES);
		if (buffer.length <= 0) return null;
		const firstLine = buffer.toString("utf-8").split(/\r?\n/).map((line) => line.trim()).find((line) => line.length > 0);
		if (!firstLine) return null;
		const parsed = JSON.parse(firstLine);
		if (parsed.type !== "session" || typeof parsed.id !== "string" || !parsed.id.trim()) return null;
		return {
			id: parsed.id.trim(),
			...typeof parsed.cwd === "string" && parsed.cwd.trim() ? { cwd: parsed.cwd } : {}
		};
	} catch {
		return null;
	} finally {
		if (fileHandle) await fileHandle.close().catch(() => void 0);
	}
}
async function readSessionIdFromTranscriptHeaderAsync(sessionFile) {
	return (await readSessionHeaderFromTranscriptAsync(sessionFile))?.id ?? null;
}
function parseTranscriptLine(line) {
	try {
		const parsed = JSON.parse(line);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		return parsed;
	} catch {
		return null;
	}
}
async function readTranscriptEntriesForForkAsync(params) {
	const entries = [];
	const stopAfterEntryId = params.stopAfterEntryId?.trim();
	let foundStopEntry = false;
	try {
		for await (const line of streamSessionTranscriptLines(params.sessionFile)) try {
			const parsed = JSON.parse(line);
			if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) continue;
			entries.push(parsed);
			if (stopAfterEntryId && parsed.type !== "session" && parsed.id === stopAfterEntryId) {
				foundStopEntry = true;
				break;
			}
		} catch {}
	} catch {
		return null;
	}
	const firstEntry = entries[0];
	if (firstEntry?.type !== "session" || typeof firstEntry.id !== "string") return null;
	if (stopAfterEntryId && !foundStopEntry) return null;
	return entries;
}
function trimTranscriptEntriesThroughLeaf(entries, leafId) {
	const normalizedLeafId = leafId?.trim();
	if (!normalizedLeafId) return entries;
	const leafIndex = entries.findIndex((entry, index) => index > 0 && entry.id === normalizedLeafId);
	if (leafIndex < 1) return null;
	return entries.slice(0, leafIndex + 1);
}
async function readSessionLeafStateFromTranscriptAsync(sessionFile, maxBytes = MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES) {
	if (typeof sessionFile !== "string") return readSessionLeafStateFromRecords(loadTranscriptEventsSync(sessionFile).filter((event) => Boolean(event) && typeof event === "object" && !Array.isArray(event)));
	const sqliteMarker = parseSqliteSessionFileMarker(sessionFile);
	if (sqliteMarker) return readSessionLeafStateFromRecords(loadTranscriptEventsSync(sqliteMarker).filter((event) => Boolean(event) && typeof event === "object" && !Array.isArray(event)));
	let fileHandle;
	try {
		fileHandle = await fs.open(sessionFile, "r");
		const stat = await fileHandle.stat();
		if (!stat.isFile() || stat.size <= 0) return null;
		const requestedMaxBytes = Number.isFinite(maxBytes) ? Math.max(1024, Math.floor(maxBytes)) : MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES;
		const maxReadableBytes = Math.min(stat.size, requestedMaxBytes);
		let readLength = Math.min(maxReadableBytes, SESSION_TAIL_READ_INITIAL_BYTES);
		while (readLength > 0) {
			const readStart = Math.max(0, stat.size - readLength);
			const lines = (await readFileRangeAsync(fileHandle, readStart, readLength)).toString("utf-8").split(/\r?\n/);
			const candidateLines = readStart > 0 ? lines.slice(1) : lines;
			const records = [];
			let latestEntryId;
			for (const candidateLine of candidateLines) {
				const line = candidateLine.trim();
				if (!line) continue;
				const parsed = parseTranscriptLine(line);
				if (!parsed) continue;
				records.push(parsed);
				if (parsed.type === "session") continue;
				const entryId = typeof parsed.id === "string" ? parsed.id.trim() : "";
				if (entryId) latestEntryId = entryId;
			}
			const tree = scanSessionTranscriptTree(records);
			if (latestEntryId && tree.hasLeafUpdate && (!tree.hasInvalidLeafControl || readStart === 0)) return {
				entryId: latestEntryId,
				leafId: tree.leafId
			};
			if (readStart === 0) return null;
			const nextReadLength = Math.min(maxReadableBytes, readLength * 2);
			if (nextReadLength === readLength) return latestEntryId ? {
				entryId: latestEntryId,
				leafId: latestEntryId
			} : null;
			readLength = nextReadLength;
		}
	} catch {
		return null;
	} finally {
		if (fileHandle) await fileHandle.close().catch(() => void 0);
	}
	return null;
}
function readSessionLeafStateFromRecords(records) {
	let latestEntryId;
	for (const record of records) {
		if (record.type === "session") continue;
		const entryId = typeof record.id === "string" ? record.id.trim() : "";
		if (entryId) latestEntryId = entryId;
	}
	if (!latestEntryId) return null;
	const tree = scanSessionTranscriptTree(records);
	return {
		entryId: latestEntryId,
		leafId: tree.leafId
	};
}
function resolveCheckpointTranscriptForkSource(checkpoint) {
	const checkpointTokensTrusted = checkpoint.tokensVersion === 1;
	const preCompactionFile = checkpoint.preCompaction.sessionFile?.trim();
	if (preCompactionFile) return {
		sourceFile: preCompactionFile,
		sourceLeafId: checkpoint.preCompaction.entryId ?? checkpoint.preCompaction.leafId,
		totalTokens: checkpointTokensTrusted ? checkpoint.tokensBefore : void 0
	};
	const postCompactionFile = checkpoint.postCompaction.sessionFile?.trim();
	if (!postCompactionFile) return null;
	const postCompactionLeafId = checkpoint.postCompaction.entryId ?? checkpoint.postCompaction.leafId;
	if (!postCompactionLeafId) return null;
	return {
		sourceFile: postCompactionFile,
		sourceLeafId: postCompactionLeafId,
		totalTokens: checkpointTokensTrusted ? checkpoint.tokensAfter : void 0
	};
}
async function prepareLegacyCheckpointSource(checkpoint) {
	if (!checkpoint) return;
	const forkSource = resolveCheckpointTranscriptForkSource(checkpoint);
	if (!forkSource) return;
	const entries = await readTranscriptEntriesForForkAsync({
		sessionFile: forkSource.sourceFile,
		stopAfterEntryId: forkSource.sourceLeafId
	});
	if (!entries) return;
	migrateSessionEntries(entries);
	const events = trimTranscriptEntriesThroughLeaf(entries, forkSource.sourceLeafId);
	if (!events) return;
	return {
		checkpointId: checkpoint.checkpointId,
		events,
		sessionFile: forkSource.sourceFile,
		...forkSource.sourceLeafId ? { sourceLeafId: forkSource.sourceLeafId } : {},
		...typeof forkSource.totalTokens === "number" ? { totalTokens: forkSource.totalTokens } : {}
	};
}
function findCheckpoint(entry, checkpointId) {
	return entry?.compactionCheckpoints?.find((checkpoint) => checkpoint.checkpointId === checkpointId);
}
async function branchCheckpointSessionFromStoredBoundary(params) {
	const legacySource = await prepareLegacyCheckpointSource(findCheckpoint(loadSessionEntry({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		sessionKey: params.sourceStoreKey ?? params.sourceKey
	}), params.checkpointId));
	return await branchCompactionCheckpointSession({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		sourceKey: params.sourceKey,
		nextKey: params.nextKey,
		checkpointId: params.checkpointId,
		expectedState: params.expectedState,
		...params.sourceStoreKey ? { sourceStoreKey: params.sourceStoreKey } : {},
		...legacySource ? { legacySource } : {}
	});
}
async function restoreCheckpointSessionFromStoredBoundary(params) {
	const legacySource = await prepareLegacyCheckpointSource(findCheckpoint(loadSessionEntry({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		sessionKey: params.sessionStoreKey ?? params.sessionKey
	}), params.checkpointId));
	return await restoreCompactionCheckpointSession({
		...params.agentId ? { agentId: params.agentId } : {},
		storePath: params.storePath,
		sessionKey: params.sessionKey,
		checkpointId: params.checkpointId,
		expectedState: params.expectedState,
		...params.sessionStoreKey ? { sessionStoreKey: params.sessionStoreKey } : {},
		...legacySource ? { legacySource } : {}
	});
}
/**
* Creates the current file-backed compaction checkpoint domain store.
*
* The branch/restore operations own the transcript fork plus session entry
* update so a SQLite implementation can copy transcript rows and update
* `session_nodes.entry_json` inside one write transaction.
*/
function createFileBackedCompactionCheckpointStore() {
	return {
		captureSnapshot: captureCompactionCheckpointSnapshotAsync,
		persistCheckpoint: persistSessionCompactionCheckpoint,
		cleanupSnapshot: cleanupCompactionCheckpointSnapshot,
		branchCheckpointSession: branchCheckpointSessionFromStoredBoundary,
		restoreCheckpointSession: restoreCheckpointSessionFromStoredBoundary
	};
}
/**
* Capture the stable pre-compaction identity without duplicating the transcript.
* Branch/restore uses the compacted successor transcript, while legacy
* checkpoints that already have a snapshot file keep working.
*/
async function captureCompactionCheckpointSnapshotAsync(params) {
	const getLeafId = params.sessionManager && typeof params.sessionManager.getLeafId === "function" ? params.sessionManager.getLeafId.bind(params.sessionManager) : null;
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile || params.sessionManager && !getLeafId) return null;
	const liveLeafId = getLeafId ? getLeafId() : void 0;
	if (getLeafId && !liveLeafId) return null;
	const maxBytes = params.maxBytes ?? MAX_COMPACTION_CHECKPOINT_LEAF_SCAN_BYTES;
	const sqliteTarget = params.sessionTarget ?? parseSqliteSessionFileMarker(sessionFile);
	if (sqliteTarget) {
		if (typeof params.sessionManager?.getEntries !== "function") return null;
		const position = resolveCompactionCheckpointTranscriptPosition({
			preferredLeafId: liveLeafId,
			transcriptState: readSessionLeafStateFromRecords(params.sessionManager.getEntries())
		});
		const leafId = position.leafId;
		if (!leafId) return null;
		return {
			sessionId: typeof params.sessionManager.getSessionId === "function" ? params.sessionManager.getSessionId() : sqliteTarget.sessionId,
			leafId,
			...position.entryId ? { entryId: position.entryId } : {}
		};
	}
	const sessionId = await readSessionIdFromTranscriptHeaderAsync(sessionFile);
	const position = resolveCompactionCheckpointTranscriptPosition({
		preferredLeafId: liveLeafId,
		transcriptState: await readSessionLeafStateFromTranscriptAsync(sessionFile, maxBytes)
	});
	const leafId = position.leafId;
	if (!sessionId || !leafId) return null;
	return {
		sessionId,
		leafId,
		...position.entryId ? { entryId: position.entryId } : {}
	};
}
async function cleanupCompactionCheckpointSnapshot(snapshot) {
	if (!snapshot?.sessionFile) return;
	try {
		await fs.unlink(snapshot.sessionFile);
	} catch {}
}
async function cleanupTrimmedCompactionCheckpointFiles(params) {
	if (params.removed.length === 0 || !params.artifactDir) return;
	const artifactDir = path.resolve(params.artifactDir);
	const retainedPaths = new Set((params.retained ?? []).map((checkpoint) => checkpoint.preCompaction.sessionFile?.trim()).filter((filePath) => Boolean(filePath)));
	for (const checkpoint of params.removed) {
		const sessionFile = checkpoint.preCompaction.sessionFile?.trim();
		if (!sessionFile || retainedPaths.has(sessionFile)) continue;
		const resolvedSessionFile = path.resolve(sessionFile);
		if (path.dirname(resolvedSessionFile) !== artifactDir || !isCompactionCheckpointTranscriptFileName(path.basename(resolvedSessionFile))) continue;
		try {
			await fs.unlink(resolvedSessionFile);
		} catch {}
	}
}
async function persistSessionCompactionCheckpoint(params) {
	const snapshotSessionFile = params.snapshot.sessionFile?.trim();
	const postSessionFile = params.postSessionFile?.trim();
	const snapshotSqliteMarker = parseSqliteSessionFileMarker(snapshotSessionFile);
	const postSqliteMarker = parseSqliteSessionFileMarker(postSessionFile);
	const snapshotArtifactFile = snapshotSqliteMarker ? void 0 : snapshotSessionFile;
	const postArtifactFile = postSqliteMarker ? void 0 : postSessionFile;
	const postSourceLeafId = params.postEntryId?.trim() || params.postLeafId?.trim();
	if (!snapshotArtifactFile && !postSourceLeafId) {
		log.warn("skipping compaction checkpoint persist: missing stable fork source", { sessionKey: params.sessionKey });
		return null;
	}
	const target = resolveGatewaySessionStoreTarget({
		cfg: params.cfg,
		key: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {}
	});
	const createdAt = params.createdAt ?? Date.now();
	const checkpoint = {
		checkpointId: randomUUID(),
		sessionKey: target.canonicalKey,
		sessionId: params.sessionId,
		createdAt,
		reason: params.reason,
		tokensVersion: 1,
		...typeof params.tokensBefore === "number" ? { tokensBefore: params.tokensBefore } : {},
		...typeof params.tokensAfter === "number" ? { tokensAfter: params.tokensAfter } : {},
		...params.summary?.trim() ? { summary: params.summary.trim() } : {},
		...params.firstKeptEntryId?.trim() ? { firstKeptEntryId: params.firstKeptEntryId.trim() } : {},
		preCompaction: {
			sessionId: params.snapshot.sessionId,
			...snapshotArtifactFile ? { sessionFile: snapshotArtifactFile } : {},
			leafId: params.snapshot.leafId,
			...params.snapshot.entryId?.trim() ? { entryId: params.snapshot.entryId.trim() } : {}
		},
		postCompaction: {
			sessionId: params.sessionId,
			...postArtifactFile ? { sessionFile: postArtifactFile } : {},
			...params.postLeafId?.trim() ? { leafId: params.postLeafId.trim() } : {},
			...params.postEntryId?.trim() ? { entryId: params.postEntryId.trim() } : {}
		}
	};
	let trimmedCheckpoints;
	let stored = false;
	if (!await updateSessionEntry({
		storePath: target.storePath,
		sessionKey: target.canonicalKey
	}, async (existing) => {
		if (!existing.sessionId) return null;
		const checkpoints = sessionStoreCheckpoints(existing);
		checkpoints.push(checkpoint);
		trimmedCheckpoints = trimSessionCheckpoints(checkpoints, await statCheckpointSnapshotBytes(checkpoints));
		stored = true;
		return {
			updatedAt: Math.max(existing.updatedAt ?? 0, createdAt),
			compactionCheckpoints: trimmedCheckpoints.kept
		};
	}) || !stored) {
		log.warn("skipping compaction checkpoint persist: session not found", { sessionKey: params.sessionKey });
		return null;
	}
	const checkpointArtifactFile = snapshotArtifactFile || postArtifactFile || "";
	await cleanupTrimmedCompactionCheckpointFiles({
		removed: trimmedCheckpoints?.removed ?? [],
		retained: trimmedCheckpoints?.kept,
		...checkpointArtifactFile ? { artifactDir: path.dirname(checkpointArtifactFile) } : {}
	});
	return checkpoint;
}
function listSessionCompactionCheckpoints(entry) {
	return sessionStoreCheckpoints(entry).toSorted((a, b) => b.createdAt - a.createdAt);
}
function getSessionCompactionCheckpoint(params) {
	const checkpointId = params.checkpointId.trim();
	if (!checkpointId) return;
	return listSessionCompactionCheckpoints(params.entry).find((checkpoint) => checkpoint.checkpointId === checkpointId);
}
//#endregion
export { resolveCompactionCheckpointTranscriptPosition as a, readSessionLeafStateFromTranscriptAsync as i, getSessionCompactionCheckpoint as n, resolveSessionCompactionCheckpointReason as o, listSessionCompactionCheckpoints as r, createFileBackedCompactionCheckpointStore as t };
