import "./src-BntaCZM-.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { An as executeSqliteQuerySync, B as parseDeliveryQueueCompletionRetention, G as inflateDeliveryQueueRow, H as bindDeliveryQueueEntry, J as pruneDeliveryQueueTombstones, K as loadDeliveryQueueEntryInDatabase, Mn as getNodeSqliteKysely, V as projectDeliveryQueueTerminalEntry, W as deliveryQueueRowColumns, X as upsertBoundDeliveryQueueEntryInDatabase, Y as terminalizeBoundDeliveryQueueEntry, d as openOpenClawStateDatabase, q as pruneDeliveryQueueTombstoneAges, z as inferDeliveryQueueFailureRetention } from "./openclaw-state-db-CeAO_dqo.js";
import { u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
//#region src/infra/delivery-queue-sqlite.ts
function openStateDatabase(stateDir) {
	return openOpenClawStateDatabase({ env: stateDir ? {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} : process.env });
}
function enoent(queueName, id) {
	const err = /* @__PURE__ */ new Error(`No pending ${queueName} delivery queue entry ${id}`);
	err.code = "ENOENT";
	return err;
}
function upsertDeliveryQueueEntryInDatabase(params, database) {
	return upsertBoundDeliveryQueueEntryInDatabase(bindDeliveryQueueEntry(params), database);
}
/** Insert or replace a delivery queue entry under a queue namespace. */
function upsertDeliveryQueueEntry(params) {
	return upsertDeliveryQueueEntryInDatabase(params, openStateDatabase(params.stateDir));
}
/**
* Expire abandoned staging rows and capture destination/staging ownership in
* one write snapshot. A concurrent commit either lands before this snapshot or
* loses its staging row and must fail closed.
*/
function expireStagingAndLoadDeliveryQueueEntries(params) {
	const database = openStateDatabase(params.stateDir);
	const snapshot = runSqliteImmediateTransactionSync(database.db, () => {
		database.db.prepare(`DELETE FROM delivery_queue_entries
            WHERE queue_name = ? AND status = 'pending' AND enqueued_at <= ?`).run(params.stagingQueueName, params.expireBeforeMs);
		const selectPending = database.db.prepare(`SELECT ${deliveryQueueRowColumns.join(", ")} FROM delivery_queue_entries
          WHERE status = 'pending' AND queue_name IN (SELECT value FROM json_each(?))
          ORDER BY enqueued_at, id`);
		const read = (queueNames) => selectPending.all(JSON.stringify(queueNames));
		return {
			entryRows: read(params.queueNames),
			stagingRows: read([params.stagingQueueName])
		};
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "expire delivery queue staging entries"
	});
	return {
		entries: snapshot.entryRows.map(inflateDeliveryQueueRow).filter((entry) => entry != null),
		stagingEntries: snapshot.stagingRows.map(inflateDeliveryQueueRow).filter((entry) => entry != null)
	};
}
/** Load a single pending delivery queue entry. */
function loadDeliveryQueueEntry(queueName, id, stateDir) {
	return loadDeliveryQueueEntryInDatabase(openStateDatabase(stateDir), queueName, id, true);
}
/** Read row status without hiding dead-lettered entries. */
function getDeliveryQueueEntryStatus(queueName, id, stateDir) {
	return getDeliveryQueueEntryStatuses([queueName], id, stateDir).get(queueName);
}
/** Read one exact ID across physical namespaces from a single ownership snapshot. */
function getDeliveryQueueEntryStatuses(queueNames, id, stateDir) {
	if (queueNames.length === 0) return /* @__PURE__ */ new Map();
	const database = openStateDatabase(stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const readExact = () => executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select([
			"queue_name",
			"status",
			"entry_json",
			"recovery_state"
		]).where("queue_name", "in", queueNames).where("id", "=", id)).rows;
		let rows = readExact();
		let pruned = false;
		for (const row of rows) {
			if (row.recovery_state !== "completed_bounded") continue;
			const retention = parseDeliveryQueueCompletionRetention(safeParseJsonRecord(row.entry_json)?.completionRetention, id);
			if (typeof retention === "object") {
				pruneDeliveryQueueTombstones(database.db, Date.now(), {
					queueName: row.queue_name,
					idPrefix: retention.idPrefix
				});
				pruned = true;
			}
		}
		if (pruned) rows = readExact();
		return new Map(rows.flatMap((row) => row.status ? [[row.queue_name, row.status]] : []));
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: "read delivery queue status"
	});
}
/** Load all pending entries for a queue namespace in database order. */
function loadDeliveryQueueEntries(queueName, stateDir) {
	const database = openStateDatabase(stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select(deliveryQueueRowColumns).where("queue_name", "=", queueName).where("status", "=", "pending").orderBy("enqueued_at", "asc").orderBy("id", "asc")).rows.map(inflateDeliveryQueueRow).filter((entry) => entry != null);
}
/** Delete a pending delivery queue entry after successful delivery. */
function deleteDeliveryQueueEntry(queueName, id, stateDir) {
	const database = openStateDatabase(stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	executeSqliteQuerySync(database.db, queueDb.deleteFrom("delivery_queue_entries").where("queue_name", "=", queueName).where("id", "=", id).where("status", "=", "pending"));
}
/** Retain a delivered row as a durable idempotency tombstone. */
function completeDeliveryQueueEntry(queueName, id, stateDir) {
	const now = Date.now();
	const requestedRetention = loadDeliveryQueueEntry(queueName, id, stateDir)?.completionRetention;
	const retention = parseDeliveryQueueCompletionRetention(requestedRetention, id);
	if (requestedRetention && !retention) throw new Error(`Invalid bounded delivery completion retention: ${queueName}/${id}`);
	if (!upsertDeliveryQueueEntry({
		queueName,
		entry: projectDeliveryQueueTerminalEntry({
			id,
			retryCount: 0
		}, now, "completed", retention),
		metadata: {},
		status: "completed",
		stateDir,
		completeExisting: true
	})) {
		if (getDeliveryQueueEntryStatus(queueName, id, stateDir) === "completed") return;
		throw enoent(queueName, id);
	}
	if (typeof retention === "object") getDeliveryQueueEntryStatus(queueName, id, stateDir);
}
/** Load, transform, and persist a pending delivery queue entry. */
function updateDeliveryQueueEntry(queueName, id, stateDir, update) {
	const current = loadDeliveryQueueEntry(queueName, id, stateDir);
	if (!current) throw enoent(queueName, id);
	upsertDeliveryQueueEntry({
		queueName,
		entry: update(current),
		stateDir
	});
}
/** Atomically reserve one provider-delivery call before executing it. */
function reserveDeliveryQueueEntryAttempt(params) {
	if (!Number.isInteger(params.maxAttempts) || params.maxAttempts <= 0) throw new Error(`Invalid delivery attempt budget: ${params.maxAttempts}`);
	const database = openStateDatabase(params.stateDir);
	return runSqliteImmediateTransactionSync(database.db, () => {
		const current = loadDeliveryQueueEntry(params.queueName, params.id, params.stateDir);
		if (!current) throw enoent(params.queueName, params.id);
		if (params.expectedPlatformSendAttemptId && current.platformSendAttemptId !== params.expectedPlatformSendAttemptId && current.producerClaimId !== params.expectedPlatformSendAttemptId) throw new Error(`Delivery platform claim was lost: ${params.id}`);
		const persistedAttemptCount = typeof current.attemptCount === "number" && Number.isInteger(current.attemptCount) && current.attemptCount >= 0 ? current.attemptCount : 0;
		const attemptCount = Math.max(persistedAttemptCount, current.retryCount);
		if (attemptCount >= params.maxAttempts) return {
			status: "exhausted",
			attemptCount
		};
		const reservedAttemptCount = attemptCount + 1;
		if (!upsertDeliveryQueueEntryInDatabase({
			queueName: params.queueName,
			entry: {
				...current,
				attemptCount: reservedAttemptCount
			},
			updatePendingOnly: true
		}, database)) throw enoent(params.queueName, params.id);
		return {
			status: "reserved",
			attemptCount: reservedAttemptCount
		};
	}, {
		databaseLabel: "openclaw-state",
		operationLabel: `reserve ${params.queueName} delivery attempt`
	});
}
/** Count dead-lettered entries per queue namespace for coarse health reporting. */
function countFailedDeliveryQueueEntries(stateDir) {
	const database = openStateDatabase(stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	return executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select((eb) => [
		"queue_name as queueName",
		eb.fn.countAll().as("count"),
		eb.fn.min("failed_at").as("oldestFailedAt")
	]).where("status", "=", "failed").groupBy("queue_name").orderBy("queue_name", "asc")).rows.map(({ oldestFailedAt, ...row }) => oldestFailedAt == null ? row : Object.assign(row, { oldestFailedAt }));
}
/** Count pending entries across an exact set of queue namespaces. */
function countPendingDeliveryQueueEntries(queueNames, stateDir) {
	if (queueNames.length === 0) return 0;
	const database = openStateDatabase(stateDir);
	const queueDb = getNodeSqliteKysely(database.db);
	const [row] = executeSqliteQuerySync(database.db, queueDb.selectFrom("delivery_queue_entries").select((eb) => eb.fn.countAll().as("count")).where("queue_name", "in", queueNames).where("status", "=", "pending")).rows;
	return row?.count ?? 0;
}
/** Physically expire age-bounded delivery queue tombstones. */
function pruneExpiredDeliveryQueueTombstones(stateDir) {
	const database = openStateDatabase(stateDir);
	runSqliteImmediateTransactionSync(database.db, () => pruneDeliveryQueueTombstoneAges(database.db, Date.now()), {
		databaseLabel: "openclaw-state",
		operationLabel: "expire delivery queue tombstones"
	});
}
/** Terminalize one pending row using its failure-retention ownership fact. */
function moveDeliveryQueueEntryToFailed(queueName, id, stateDir) {
	const current = loadDeliveryQueueEntry(queueName, id, stateDir);
	if (!current) throw enoent(queueName, id);
	if (terminalizePendingDeliveryQueueEntry({
		queueName,
		id,
		entry: current,
		stateDir
	}).status !== "terminalized") throw enoent(queueName, id);
}
/** Atomically delete or tombstone a pending row only while its value is unchanged. */
function terminalizePendingDeliveryQueueEntry(params) {
	if (params.entry.id !== params.id) throw new Error(`Delivery queue entry id mismatch: ${params.entry.id} != ${params.id}`);
	const now = Date.now();
	const database = openStateDatabase(params.stateDir);
	const expectedJson = JSON.stringify(params.entry);
	const retention = inferDeliveryQueueFailureRetention(params.entry, params.id, params.queueName);
	if (!retention) return terminalizeBoundDeliveryQueueEntry(database.db, params.queueName, params.id, expectedJson, void 0, now) ? {
		status: "terminalized",
		retained: false
	} : { status: "not_pending" };
	const failedEntry = projectDeliveryQueueTerminalEntry(params.entry, now, "failed", retention);
	if (!terminalizeBoundDeliveryQueueEntry(database.db, params.queueName, params.id, expectedJson, failedEntry, now)) return { status: "not_pending" };
	if (typeof retention === "object") getDeliveryQueueEntryStatus(params.queueName, params.id, params.stateDir);
	return {
		status: "terminalized",
		retained: true
	};
}
//#endregion
export { expireStagingAndLoadDeliveryQueueEntries as a, loadDeliveryQueueEntries as c, pruneExpiredDeliveryQueueTombstones as d, reserveDeliveryQueueEntryAttempt as f, upsertDeliveryQueueEntry as h, deleteDeliveryQueueEntry as i, loadDeliveryQueueEntry as l, updateDeliveryQueueEntry as m, countFailedDeliveryQueueEntries as n, getDeliveryQueueEntryStatus as o, terminalizePendingDeliveryQueueEntry as p, countPendingDeliveryQueueEntries as r, getDeliveryQueueEntryStatuses as s, completeDeliveryQueueEntry as t, moveDeliveryQueueEntryToFailed as u };
