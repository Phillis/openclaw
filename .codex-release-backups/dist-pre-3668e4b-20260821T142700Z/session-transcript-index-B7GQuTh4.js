import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { l as runSqliteDeferredTransactionSync } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
//#region src/config/sessions/transcript-tree.ts
function isCanonicalSessionEntryType(value) {
	switch (value) {
		case "message":
		case "thinking_level_change":
		case "model_change":
		case "compaction":
		case "reset":
		case "branch_summary":
		case "custom":
		case "custom_message":
		case "label":
		case "session_info": return true;
		default: return false;
	}
}
function isCanonicalSessionTranscriptEntry(record) {
	return isRecord(record) && isCanonicalSessionEntryType(record.type);
}
function isSessionTranscriptSideAppendEntry(record) {
	return isCanonicalSessionTranscriptEntry(record) && record.appendMode === "side";
}
function isSessionTranscriptLeafControl(record) {
	return isRecord(record) && record.type === "leaf" && parseSessionTranscriptTreeEntry(record) !== void 0;
}
/**
* Parse one parent-linked transcript row.
*
* Leaf rows are navigation controls: they select targetId as the active leaf,
* and descendants that reference the marker continue through that same target.
*/
function parseSessionTranscriptTreeEntry(record) {
	if (!isRecord(record) || record.type === "session" || !Object.hasOwn(record, "parentId")) return;
	const id = readNonBlankString(record.id);
	const parentId = record.parentId === null ? null : readNonBlankString(record.parentId) ?? void 0;
	if (!id || parentId === void 0) return;
	if (record.type === "leaf") {
		const targetId = record.targetId === null ? null : readNonBlankString(record.targetId) ?? void 0;
		const appendParentId = record.appendParentId === void 0 ? targetId : record.appendParentId === null ? null : readNonBlankString(record.appendParentId) ?? void 0;
		const appendMode = record.appendMode === void 0 ? void 0 : record.appendMode === "side" ? "side" : null;
		return targetId === void 0 || appendParentId === void 0 || appendMode === null ? void 0 : {
			id,
			parentId: targetId,
			leafId: targetId,
			appendParentId,
			...appendMode ? { appendMode } : {}
		};
	}
	return {
		id,
		parentId,
		leafId: isCanonicalSessionTranscriptEntry(record) && record.appendMode !== "side" ? id : void 0,
		appendParentId: id,
		...record.appendMode === "side" ? { appendMode: record.appendMode } : {}
	};
}
function parseParentlessCanonicalEntry(record, parentId) {
	if (!isCanonicalSessionTranscriptEntry(record) || Object.hasOwn(record, "parentId")) return;
	const id = readNonBlankString(record.id);
	return id ? {
		id,
		parentId,
		leafId: record.appendMode === "side" ? void 0 : id,
		appendParentId: id,
		...record.appendMode === "side" ? { appendMode: record.appendMode } : {}
	} : void 0;
}
function resolveCanonicalParentId(parentId, byId) {
	const seen = /* @__PURE__ */ new Set();
	let currentId = parentId;
	while (currentId !== null) {
		if (seen.has(currentId)) return currentId;
		seen.add(currentId);
		const parent = byId.get(currentId);
		if (!parent || !isSessionTranscriptLeafControl(parent.entry)) return currentId;
		currentId = parent.parentId;
	}
	return null;
}
/**
* Resolve transcript navigation state in file order.
*
* Current-version transcripts can contain parentless canonical rows written by
* older appenders. Treat those rows as a linear continuation of the current
* append cursor so a later leaf control can still address their full history.
*/
function scanSessionTranscriptTree(entries) {
	const nodes = [];
	const byId = /* @__PURE__ */ new Map();
	let leafId = null;
	let appendParentId = null;
	let hasLeafControl = false;
	let hasLeafUpdate = false;
	let hasExplicitLeafUpdate = false;
	let hasInvalidLeafControl = false;
	let latestResetId;
	const resetDescendantIds = /* @__PURE__ */ new Set();
	const invalidLeafControlIds = /* @__PURE__ */ new Set();
	for (const [index, entry] of entries.entries()) {
		let explicitTreeEntry = parseSessionTranscriptTreeEntry(entry);
		if (latestResetId && leafId !== null && explicitTreeEntry?.leafId !== void 0 && isSessionTranscriptLeafControl(entry) && (explicitTreeEntry.leafId === null || !resetDescendantIds.has(explicitTreeEntry.leafId))) explicitTreeEntry = {
			...explicitTreeEntry,
			parentId: leafId,
			leafId,
			appendParentId: leafId
		};
		const isKnownLeafReference = (id) => id === null || byId.has(id) && !invalidLeafControlIds.has(id);
		if (explicitTreeEntry?.leafId !== void 0 && isSessionTranscriptLeafControl(entry) && (!isKnownLeafReference(explicitTreeEntry.leafId) || !isKnownLeafReference(explicitTreeEntry.appendParentId)) && explicitTreeEntry) {
			hasInvalidLeafControl = true;
			invalidLeafControlIds.add(explicitTreeEntry.id);
			const rawParentId = entry.parentId;
			const node = {
				...explicitTreeEntry,
				parentId: rawParentId,
				leafId: void 0,
				appendParentId,
				entry,
				index
			};
			nodes.push(node);
			byId.set(node.id, node);
			continue;
		}
		let treeEntry = explicitTreeEntry ?? parseParentlessCanonicalEntry(entry, leafId);
		if (treeEntry && isCanonicalSessionTranscriptEntry(entry)) {
			const canonicalParentIsStale = explicitTreeEntry && treeEntry.parentId !== null && !byId.has(treeEntry.parentId) && leafId !== null;
			const normalizedParentId = resolveCanonicalParentId(latestResetId !== void 0 && treeEntry.appendMode !== "side" && (treeEntry.parentId === null || !resetDescendantIds.has(treeEntry.parentId)) ? leafId : treeEntry.appendMode !== "side" && canonicalParentIsStale ? leafId : explicitTreeEntry && treeEntry.appendMode !== "side" && treeEntry.parentId === appendParentId && leafId !== appendParentId ? leafId : treeEntry.parentId, byId);
			if (normalizedParentId !== treeEntry.parentId) treeEntry = {
				...treeEntry,
				parentId: normalizedParentId
			};
		}
		if (!treeEntry) continue;
		const node = {
			...treeEntry,
			entry,
			index
		};
		nodes.push(node);
		byId.set(node.id, node);
		if (isRecord(entry) && entry.type === "reset") {
			latestResetId = node.id;
			resetDescendantIds.clear();
			resetDescendantIds.add(node.id);
		} else if (latestResetId !== void 0 && node.parentId !== null && resetDescendantIds.has(node.parentId)) resetDescendantIds.add(node.id);
		appendParentId = node.appendParentId;
		if (node.leafId !== void 0) {
			leafId = node.leafId;
			hasLeafUpdate = true;
			if (explicitTreeEntry) hasExplicitLeafUpdate = true;
		}
		if (isSessionTranscriptLeafControl(entry)) hasLeafControl = true;
	}
	return {
		nodes,
		byId,
		leafId,
		appendParentId,
		hasLeafControl,
		hasLeafUpdate,
		hasExplicitLeafUpdate,
		hasInvalidLeafControl
	};
}
function selectSessionTranscriptActiveEntries(params) {
	const records = params.entries.map(params.recordOf);
	const tree = params.tree ?? scanSessionTranscriptTree(records);
	if (params.failClosedOnInvalidLeafControl === true && tree.hasInvalidLeafControl) return [];
	if (!tree.hasExplicitLeafUpdate) return [...params.entries];
	const activePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	const activeEntries = activePath.flatMap((node) => {
		const entry = params.entries[node.index];
		return entry === void 0 ? [] : [entry];
	});
	const firstActiveNode = activePath[0];
	for (let index = (firstActiveNode?.index ?? 0) - 1; index >= 0; index -= 1) {
		const record = records[index];
		if (!isRecord(record) || record.type !== "compaction" && record.type !== "reset") continue;
		const entry = params.entries[index];
		if (entry === void 0) return activeEntries;
		if (record.type === "reset") {
			const resetId = readNonBlankString(record.id);
			const firstKeptEntryId = readNonBlankString(record.firstKeptEntryId);
			if (resetId && firstKeptEntryId) {
				const resetPath = selectSessionTranscriptTreePathNodes(tree, resetId);
				const keptStart = resetPath.findIndex((node) => node.id === firstKeptEntryId);
				if (keptStart >= 0) return [...resetPath.slice(keptStart).flatMap((node) => {
					const retained = params.entries[node.index];
					return retained === void 0 ? [] : [retained];
				}), ...activeEntries];
			}
		}
		return [entry, ...activeEntries];
	}
	return activeEntries;
}
/** Select one normalized path, retaining a reachable suffix after missing ancestors. */
function selectSessionTranscriptTreePathNodes(tree, leafId) {
	if (leafId === null) return [];
	const path = [];
	const seen = /* @__PURE__ */ new Set();
	let currentId = leafId;
	while (currentId) {
		if (seen.has(currentId)) return [];
		seen.add(currentId);
		const current = tree.byId.get(currentId);
		if (!current) break;
		if (!isSessionTranscriptLeafControl(current.entry)) path.unshift(current);
		currentId = current.parentId;
	}
	return path;
}
/** Merge normalized paths in original file order and expose their retained parent links. */
function mergeSessionTranscriptTreePaths(paths) {
	const selectedById = /* @__PURE__ */ new Map();
	for (const path of paths) {
		let selectedParentId = null;
		for (const node of path) {
			selectedById.set(node.id, {
				...node,
				selectedParentId
			});
			selectedParentId = node.id;
		}
	}
	return [...selectedById.values()].toSorted((left, right) => left.index - right.index);
}
/**
* Build a copy-safe branch from the visible path and the opaque append suffix.
*
* Hidden canonical append ancestors must not leak into forks or repairs. Keep
* only opaque cursor records after the last canonical ancestor and reparent
* that suffix onto the selected visible path.
*/
function mergeSessionTranscriptVisiblePathWithOpaqueAppendPath(params) {
	const nodes = mergeSessionTranscriptTreePaths([params.visiblePath]);
	const selectedIds = new Set(nodes.map((node) => node.id));
	const opaqueSuffix = [];
	for (let index = params.appendPath.length - 1; index >= 0; index -= 1) {
		const node = params.appendPath[index];
		if (!node || selectedIds.has(node.id) || isCanonicalSessionTranscriptEntry(node.entry)) break;
		opaqueSuffix.unshift(node);
	}
	let selectedParentId = nodes.at(-1)?.id ?? null;
	for (const node of opaqueSuffix) {
		nodes.push({
			...node,
			selectedParentId
		});
		selectedIds.add(node.id);
		selectedParentId = node.id;
	}
	return {
		nodes,
		appendParentId: params.appendParentId === null ? null : selectedIds.has(params.appendParentId) ? params.appendParentId : nodes.at(-1)?.id ?? null
	};
}
/**
* Select the effective branch only when the transcript contains leaf controls.
*
* Legacy flat readers can keep their existing behavior when this returns
* undefined. Once navigation controls exist, returning the selected path keeps
* side branches out of prompts and hooks even after later active-branch appends.
*/
function selectSessionTranscriptLeafControlledPath(entries) {
	const tree = scanSessionTranscriptTree(entries);
	if (!tree.hasLeafControl) return;
	return selectSessionTranscriptActiveEntries({
		entries,
		recordOf: (entry) => entry,
		tree
	}).map((entry) => {
		const node = isRecord(entry) ? tree.byId.get(readNonBlankString(entry.id) ?? "") : void 0;
		if (!node || !isRecord(entry) || entry.parentId === node.parentId) return entry;
		return Object.assign({}, entry, { parentId: node.parentId });
	});
}
//#endregion
//#region src/config/sessions/transcript-visible-events.ts
/** Selects the active visible branch while preserving original transcript sequence numbers. */
function selectVisibleTranscriptEventEntries(events) {
	const tree = scanSessionTranscriptTree(events);
	const visiblePath = selectSessionTranscriptTreePathNodes(tree, tree.leafId);
	if (visiblePath.length > 0) return visiblePath.map((node) => ({
		event: node.entry,
		parentId: node.parentId,
		seq: node.index + 1
	}));
	return tree.hasLeafControl ? [] : events.map((event, index) => ({
		event,
		parentId: null,
		seq: index + 1
	}));
}
/** Selects only events on the active visible transcript branch. */
function selectVisibleTranscriptEvents(events) {
	return selectVisibleTranscriptEventEntries(events).map((entry) => entry.event);
}
/** Resolves the parent id that the next active transcript append should use. */
function resolveVisibleTranscriptAppendParentId(events) {
	return scanSessionTranscriptTree(events).appendParentId;
}
//#endregion
//#region src/config/sessions/session-transcript-projection-rebuild.ts
function getProjectionKysely(db) {
	return getNodeSqliteKysely(db);
}
function readMessageText(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const record = message;
	if (record.role !== "user" && record.role !== "assistant") return;
	if (typeof record.content === "string") return record.content.trim() || void 0;
	if (typeof record.text === "string") return record.text.trim() || void 0;
	if (!Array.isArray(record.content)) return;
	const parts = record.content.flatMap((block) => {
		if (!block || typeof block !== "object" || Array.isArray(block)) return [];
		const part = block;
		if (part.type !== "text" && part.type !== "input_text" && part.type !== "output_text") return [];
		return typeof part.text === "string" && part.text.trim() ? [part.text] : [];
	});
	return parts.length > 0 ? parts.join("\n") : void 0;
}
/** Extracts the searchable user/assistant text from one transcript event. */
function extractTranscriptIndexEntry(event, fallbackTimestamp) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const record = event;
	if (record.type !== "message" || typeof record.id !== "string" || !record.id.trim()) return;
	const message = record.message;
	const role = message?.role;
	if (role !== "user" && role !== "assistant") return;
	const text = readMessageText(message);
	if (!text) return;
	const timestamp = typeof record.timestamp === "number" ? record.timestamp : typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
	return {
		messageId: record.id.trim(),
		role,
		text,
		timestamp: Number.isFinite(timestamp) ? timestamp : fallbackTimestamp
	};
}
function hasTranscriptMessage(event) {
	return typeof event === "object" && event !== null && !Array.isArray(event) && Object.hasOwn(event, "message") && event.message !== void 0;
}
function shouldProjectActiveEvent(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return false;
	if (event.type === "session") return false;
	return isCanonicalSessionTranscriptEntry(event) || parseSessionTranscriptTreeEntry(event) !== void 0 || hasTranscriptMessage(event);
}
/** Builds the same active-branch and search projection for worker and in-transaction owners. */
function buildSessionTranscriptProjection(params) {
	const now = Date.now();
	const events = params.rows.map((row) => row.event);
	const activeRows = [];
	const ftsRows = [];
	let activeMessageCount = 0;
	for (const entry of selectVisibleTranscriptEventEntries(events)) {
		const source = params.rows[entry.seq - 1];
		const indexed = extractTranscriptIndexEntry(entry.event, source?.createdAt ?? now);
		if (indexed) ftsRows.push(indexed);
		if (!source || !shouldProjectActiveEvent(entry.event)) continue;
		const projectsMessage = hasTranscriptMessage(entry.event);
		activeRows.push({
			activePosition: activeRows.length,
			eventSeq: source.seq,
			messagePosition: projectsMessage ? activeMessageCount : null
		});
		if (projectsMessage) activeMessageCount += 1;
	}
	return {
		activeEventCount: activeRows.length,
		activeMessageCount,
		activeRows,
		ftsRows,
		leafEventId: resolveVisibleTranscriptAppendParentId(events),
		sessionId: params.sessionId,
		sourceIndexedSeq: params.rows.at(-1)?.seq ?? -1,
		sourceTranscriptUpdatedAt: params.sourceTranscriptUpdatedAt
	};
}
/** Reads and resolves one projection on a worker-owned SQLite snapshot. */
function prepareSessionTranscriptProjection(db, sessionId) {
	return runSqliteDeferredTransactionSync(db, () => {
		const kysely = getProjectionKysely(db);
		const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows").select("transcript_updated_at").where("session_id", "=", sessionId));
		const rows = executeSqliteQuerySync(db, kysely.selectFrom("transcript_events").select([
			"event_json",
			"seq",
			"created_at"
		]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows;
		if (!session || rows.length === 0) return;
		return buildSessionTranscriptProjection({
			rows: rows.map((row) => ({
				createdAt: row.created_at,
				event: JSON.parse(row.event_json),
				seq: row.seq
			})),
			sessionId,
			sourceTranscriptUpdatedAt: session.transcript_updated_at
		});
	}, {
		databaseLabel: "agent transcript projection",
		operationLabel: "sessions.transcript-index.prepare"
	});
}
function sourceSnapshotMatches(db, plan) {
	const kysely = getProjectionKysely(db);
	const session = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_windows").select("transcript_updated_at").where("session_id", "=", plan.sessionId));
	const latest = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("transcript_events").select("seq").where("session_id", "=", plan.sessionId).orderBy("seq", "desc").limit(1));
	return session?.transcript_updated_at === plan.sourceTranscriptUpdatedAt && latest?.seq === plan.sourceIndexedSeq;
}
function projectionClaimIsOwned(db, sessionId, claimId) {
	const row = executeSqliteQueryTakeFirstSync(db, getProjectionKysely(db).selectFrom("session_transcript_index_state").select(["needs_rebuild", "updated_at"]).where("session_id", "=", sessionId));
	return row?.needs_rebuild !== 0 && row?.updated_at === claimId;
}
/** Claims a prepared snapshot. Later chunks publish only while this claim remains current. */
function claimPreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	if (!sourceSnapshotMatches(db, plan)) return false;
	const kysely = getProjectionKysely(db);
	const current = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("session_transcript_index_state").select(["indexed_seq", "needs_rebuild"]).where("session_id", "=", plan.sessionId));
	if (current?.needs_rebuild === 0 && current.indexed_seq === plan.sourceIndexedSeq) return false;
	executeSqliteQuerySync(db, kysely.insertInto("session_transcript_index_state").values({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		session_id: plan.sessionId,
		updated_at: claimId
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		active_event_count: 0,
		active_message_count: 0,
		indexed_seq: -1,
		leaf_event_id: null,
		needs_rebuild: 1,
		updated_at: claimId
	})));
	return true;
}
/** Deletes old rows in bounded rowid batches while the prepared claim is current. */
function deletePreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return {
		hasMore: false,
		owned: false
	};
	const kysely = getProjectionKysely(db);
	const active = Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("rowid", "in", kysely.selectFrom("session_transcript_active_events").select("rowid").where("session_id", "=", params.sessionId).limit(params.maxRowsPerTable))).numAffectedRows ?? 0n);
	const fts = Number(executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_fts").where("rowid", "in", kysely.selectFrom("session_transcript_fts").select("rowid").where("session_id", "=", params.sessionId).limit(params.maxRowsPerTable))).numAffectedRows ?? 0n);
	return {
		hasMore: active === params.maxRowsPerTable || fts === params.maxRowsPerTable,
		owned: true
	};
}
/** Appends one bounded projection chunk while its claim remains current. */
function appendPreparedSessionTranscriptProjectionChunkInTransaction(db, params) {
	if (!projectionClaimIsOwned(db, params.sessionId, params.claimId)) return false;
	const kysely = getProjectionKysely(db);
	if (params.activeRows && params.activeRows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("session_transcript_active_events").values(params.activeRows.map((row) => ({
		active_position: row.activePosition,
		event_seq: row.eventSeq,
		message_position: row.messagePosition,
		session_id: params.sessionId
	}))));
	if (params.ftsRows && params.ftsRows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("session_transcript_fts").values(params.ftsRows.map((row) => ({
		message_id: row.messageId,
		role: row.role,
		session_id: params.sessionId,
		text: row.text,
		timestamp: row.timestamp
	}))));
	return true;
}
/** Publishes counts and the append cursor only if the transcript snapshot stayed current. */
function finalizePreparedSessionTranscriptProjectionInTransaction(db, plan, claimId) {
	if (!projectionClaimIsOwned(db, plan.sessionId, claimId) || !sourceSnapshotMatches(db, plan)) return false;
	executeSqliteQuerySync(db, getProjectionKysely(db).updateTable("session_transcript_index_state").set({
		active_event_count: plan.activeEventCount,
		active_message_count: plan.activeMessageCount,
		indexed_seq: plan.sourceIndexedSeq,
		leaf_event_id: plan.leafEventId,
		needs_rebuild: 0,
		updated_at: Date.now()
	}).where("session_id", "=", plan.sessionId).where("needs_rebuild", "!=", 0).where("updated_at", "=", claimId));
	return true;
}
//#endregion
//#region src/config/sessions/session-transcript-index.ts
function getIndexKysely(db) {
	return getNodeSqliteKysely(db);
}
function readSessionTranscriptProjectionState(db, sessionId) {
	const row = executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("session_transcript_index_state").select([
		"active_event_count",
		"active_message_count",
		"indexed_seq",
		"leaf_event_id",
		"needs_rebuild"
	]).where("session_id", "=", sessionId));
	if (!row) return;
	return {
		activeEventCount: row.active_event_count,
		activeMessageCount: row.active_message_count,
		indexedSeq: row.indexed_seq,
		leafEventId: row.leaf_event_id,
		needsRebuild: row.needs_rebuild !== 0
	};
}
function sessionTranscriptIndexNeedsReconcile(db, sessionId) {
	const latest = executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	if (!latest) return false;
	const state = readSessionTranscriptProjectionState(db, sessionId);
	return !state || state.needsRebuild || state.indexedSeq !== latest.seq;
}
function writeWatermark(db, sessionId, watermark, now) {
	executeSqliteQuerySync(db, getIndexKysely(db).insertInto("session_transcript_index_state").values({
		session_id: sessionId,
		active_event_count: watermark.activeEventCount,
		active_message_count: watermark.activeMessageCount,
		indexed_seq: watermark.indexedSeq,
		leaf_event_id: watermark.leafEventId,
		needs_rebuild: watermark.needsRebuild ? 1 : 0,
		updated_at: now
	}).onConflict((conflict) => conflict.column("session_id").doUpdateSet({
		active_event_count: watermark.activeEventCount,
		active_message_count: watermark.activeMessageCount,
		indexed_seq: watermark.indexedSeq,
		leaf_event_id: watermark.leafEventId,
		needs_rebuild: watermark.needsRebuild ? 1 : 0,
		updated_at: now
	})));
}
function insertActiveEventRow(db, params) {
	executeSqliteQuerySync(db, getIndexKysely(db).insertInto("session_transcript_active_events").values({
		session_id: params.sessionId,
		active_position: params.activePosition,
		event_seq: params.eventSeq,
		message_position: params.messagePosition
	}));
}
function deleteActiveEventRows(db, sessionId) {
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_active_events").where("session_id", "=", sessionId));
}
function insertFtsRow(db, sessionId, entry) {
	executeSqliteQuerySync(db, getIndexKysely(db).insertInto("session_transcript_fts").values({
		text: entry.text,
		session_id: sessionId,
		message_id: entry.messageId,
		role: entry.role,
		timestamp: entry.timestamp
	}));
}
function deleteFtsRows(db, sessionId) {
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_fts").where("session_id", "=", sessionId));
}
/**
* In-transaction append hook. Forward-indexes the event when it
* unambiguously extends the active branch and marks the session for rebuild
* otherwise. Runs inside the same write transaction as the event insert, so
* the index can never lag or tear relative to committed transcript rows.
*/
function indexAppendedTranscriptEventInTransaction(db, params) {
	const watermark = readSessionTranscriptProjectionState(db, params.sessionId);
	if (!watermark) {
		if (params.seq !== 0) return true;
		applyForwardIndex(db, params, {
			activeEventCount: 0,
			activeMessageCount: 0,
			indexedSeq: -1,
			leafEventId: null,
			needsRebuild: false
		});
		return false;
	}
	if (watermark.needsRebuild) return true;
	if (params.seq !== watermark.indexedSeq + 1) {
		markSessionTranscriptIndexDirtyInTransaction(db, params.sessionId);
		return true;
	}
	if (isSessionTranscriptLeafControl(params.event) || isSessionTranscriptSideAppendEntry(params.event)) {
		markSessionTranscriptIndexDirtyInTransaction(db, params.sessionId);
		return true;
	}
	const isCanonicalEvent = isCanonicalSessionTranscriptEntry(params.event);
	if (isCanonicalEvent && watermark.leafEventId === null && watermark.activeEventCount > 0) {
		markSessionTranscriptIndexDirtyInTransaction(db, params.sessionId);
		return true;
	}
	const treeEntry = parseSessionTranscriptTreeEntry(params.event);
	if (!isCanonicalEvent && watermark.leafEventId !== null && shouldProjectActiveEvent(params.event)) {
		markSessionTranscriptIndexDirtyInTransaction(db, params.sessionId);
		return true;
	}
	if (treeEntry && treeEntry.parentId !== watermark.leafEventId) {
		markSessionTranscriptIndexDirtyInTransaction(db, params.sessionId);
		return true;
	}
	applyForwardIndex(db, params, watermark);
	return false;
}
function applyForwardIndex(db, params, watermark) {
	const entry = extractTranscriptIndexEntry(params.event, params.createdAt);
	if (entry) insertFtsRow(db, params.sessionId, entry);
	const projectsActiveEvent = shouldProjectActiveEvent(params.event);
	const projectsMessage = projectsActiveEvent && hasTranscriptMessage(params.event);
	if (projectsActiveEvent) insertActiveEventRow(db, {
		activePosition: watermark.activeEventCount,
		eventSeq: params.seq,
		messagePosition: projectsMessage ? watermark.activeMessageCount : null,
		sessionId: params.sessionId
	});
	const advancesLeaf = params.eventId !== null && isCanonicalSessionTranscriptEntry(params.event);
	writeWatermark(db, params.sessionId, {
		activeEventCount: watermark.activeEventCount + (projectsActiveEvent ? 1 : 0),
		activeMessageCount: watermark.activeMessageCount + (projectsMessage ? 1 : 0),
		indexedSeq: params.seq,
		leafEventId: advancesLeaf ? params.eventId : watermark.leafEventId,
		needsRebuild: false
	}, params.createdAt);
}
/** Marks one session for lazy rebuild without touching its FTS rows. */
function markSessionTranscriptIndexDirtyInTransaction(db, sessionId) {
	const now = Date.now();
	const watermark = readSessionTranscriptProjectionState(db, sessionId);
	writeWatermark(db, sessionId, {
		activeEventCount: watermark?.activeEventCount ?? 0,
		activeMessageCount: watermark?.activeMessageCount ?? 0,
		indexedSeq: watermark?.indexedSeq ?? -1,
		leafEventId: watermark?.leafEventId ?? null,
		needsRebuild: true
	}, now);
}
/** In-transaction delete hook: drops index rows alongside transcript rows. */
function deleteSessionTranscriptIndexInTransaction(db, sessionId) {
	deleteFtsRows(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	executeSqliteQuerySync(db, getIndexKysely(db).deleteFrom("session_transcript_index_state").where("session_id", "=", sessionId));
}
/**
* Rebuilds one session's index from its full event set: drops existing FTS
* rows, indexes the resolved active branch, and resets the watermark to the
* same append parent the accessor's next append will resolve.
*/
function rebuildSessionTranscriptIndexInTransaction(db, sessionId, rows) {
	const projection = buildSessionTranscriptProjection({
		rows,
		sessionId,
		sourceTranscriptUpdatedAt: null
	});
	deleteFtsRows(db, sessionId);
	deleteActiveEventRows(db, sessionId);
	for (const entry of projection.ftsRows) insertFtsRow(db, sessionId, entry);
	for (const row of projection.activeRows) insertActiveEventRow(db, {
		...row,
		sessionId
	});
	writeWatermark(db, sessionId, {
		activeEventCount: projection.activeEventCount,
		activeMessageCount: projection.activeMessageCount,
		indexedSeq: projection.sourceIndexedSeq,
		leafEventId: projection.leafEventId,
		needsRebuild: false
	}, Date.now());
}
/** Rebuilds one lagging projection under its current write transaction. */
function reconcileSessionTranscriptIndexInTransaction(db, sessionId) {
	if (!executeSqliteQueryTakeFirstSync(db, getIndexKysely(db).selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1))) {
		deleteSessionTranscriptIndexInTransaction(db, sessionId);
		return false;
	}
	if (!sessionTranscriptIndexNeedsReconcile(db, sessionId)) return false;
	const rows = executeSqliteQuerySync(db, getIndexKysely(db).selectFrom("transcript_events").select([
		"event_json",
		"seq",
		"created_at"
	]).where("session_id", "=", sessionId).orderBy("seq", "asc")).rows;
	rebuildSessionTranscriptIndexInTransaction(db, sessionId, rows.map((row) => ({
		event: JSON.parse(row.event_json),
		seq: row.seq,
		createdAt: row.created_at
	})));
	return true;
}
/**
* Sessions whose index needs reconcile work: flagged rebuilds, transcripts
* that gained rows without index state (doctor imports), and watermarks
* behind the newest row. Ordered for deterministic reconcile passes.
*/
function listSessionsNeedingTranscriptIndexReconcile(db) {
	return executeSqliteQuerySync(db, getIndexKysely(db).selectFrom("session_windows").innerJoin("transcript_events as latest", (join) => join.onRef("latest.session_id", "=", "session_windows.session_id").on((eb) => eb("latest.seq", "=", eb.selectFrom("transcript_events as candidate").select("candidate.seq").whereRef("candidate.session_id", "=", "session_windows.session_id").orderBy("candidate.seq", "desc").limit(1)))).leftJoin("session_transcript_index_state as st", "st.session_id", "session_windows.session_id").select("session_windows.session_id").where((eb) => eb.or([eb(eb.fn.coalesce("st.needs_rebuild", eb.val(1)), "!=", 0), eb("latest.seq", ">", eb.fn.coalesce("st.indexed_seq", eb.val(-1)))])).orderBy("session_windows.session_id")).rows.flatMap((row) => typeof row.session_id === "string" ? [row.session_id] : []);
}
/** Drops index rows for sessions whose transcript rows are gone. */
function deleteOrphanedTranscriptIndexRowsInTransaction(db) {
	const kysely = getIndexKysely(db);
	executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_active_events").where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()));
	executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_fts").where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()));
	executeSqliteQuerySync(db, kysely.deleteFrom("session_transcript_index_state").where("session_id", "not in", kysely.selectFrom("transcript_events").select("session_id").distinct()));
}
//#endregion
export { selectSessionTranscriptLeafControlledPath as C, selectSessionTranscriptActiveEntries as S, isSessionTranscriptSideAppendEntry as _, reconcileSessionTranscriptIndexInTransaction as a, parseSessionTranscriptTreeEntry as b, claimPreparedSessionTranscriptProjectionInTransaction as c, prepareSessionTranscriptProjection as d, resolveVisibleTranscriptAppendParentId as f, isSessionTranscriptLeafControl as g, isCanonicalSessionTranscriptEntry as h, listSessionsNeedingTranscriptIndexReconcile as i, deletePreparedSessionTranscriptProjectionChunkInTransaction as l, selectVisibleTranscriptEvents as m, deleteSessionTranscriptIndexInTransaction as n, sessionTranscriptIndexNeedsReconcile as o, selectVisibleTranscriptEventEntries as p, indexAppendedTranscriptEventInTransaction as r, appendPreparedSessionTranscriptProjectionChunkInTransaction as s, deleteOrphanedTranscriptIndexRowsInTransaction as t, finalizePreparedSessionTranscriptProjectionInTransaction as u, mergeSessionTranscriptTreePaths as v, selectSessionTranscriptTreePathNodes as w, scanSessionTranscriptTree as x, mergeSessionTranscriptVisiblePathWithOpaqueAppendPath as y };
