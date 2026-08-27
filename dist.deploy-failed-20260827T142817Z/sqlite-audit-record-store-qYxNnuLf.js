import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
//#region src/infra/sqlite-audit-record-store.ts
const LEGACY_AUDIT_SEQUENCE_BASE = Number.MIN_SAFE_INTEGER;
function getAuditRecordKysely(database) {
	return getNodeSqliteKysely(database);
}
function parseAuditRecord(row) {
	return {
		key: row.event_key,
		value: JSON.parse(row.payload_json),
		createdAt: row.created_at,
		sequence: row.sequence
	};
}
function countAuditRecords(database, scope) {
	const row = executeSqliteQueryTakeFirstSync(database, getAuditRecordKysely(database).selectFrom("diagnostic_events").select((eb) => eb.fn.countAll().as("count")).where("scope", "=", scope));
	return typeof row?.count === "bigint" ? Number(row.count) : row?.count ?? 0;
}
function nextAuditSequence(params) {
	const next = (executeSqliteQueryTakeFirstSync(params.database, getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select((eb) => eb.fn.max("sequence").as("sequence")).where("scope", "=", params.scope).where("sequence", params.legacy ? "<" : ">=", 0))?.sequence ?? (params.legacy ? LEGACY_AUDIT_SEQUENCE_BASE : 0)) + 1;
	if (!Number.isSafeInteger(next) || params.legacy && next >= 0) throw new Error(`Audit sequence exhausted for scope ${params.scope}`);
	return next;
}
function pruneAuditRecords(params) {
	const overflow = countAuditRecords(params.database, params.scope) - params.maxEntries;
	if (overflow <= 0) return;
	const protectedKey = params.protectedKey;
	const baseCandidates = getAuditRecordKysely(params.database).selectFrom("diagnostic_events").select("event_key").where("scope", "=", params.scope);
	const candidates = (protectedKey === void 0 ? baseCandidates : baseCandidates.where("event_key", "!=", protectedKey)).orderBy("sequence", "asc").limit(overflow);
	const rows = executeSqliteQuerySync(params.database, candidates).rows;
	for (const row of rows) executeSqliteQuerySync(params.database, getAuditRecordKysely(params.database).deleteFrom("diagnostic_events").where("scope", "=", params.scope).where("event_key", "=", row.event_key));
}
/** Opens one bounded audit-record scope in the shared state database. */
function createSqliteAuditRecordStore(options) {
	const scope = options.scope;
	const maxEntries = Math.max(1, Math.floor(options.maxEntries));
	function prepareRecord(record) {
		const payloadJson = JSON.stringify(record.value);
		if (payloadJson === void 0) throw new Error(`Audit record ${scope}/${record.key} is not JSON-serializable`);
		return {
			event_key: record.key,
			payload_json: payloadJson,
			created_at: record.createdAt
		};
	}
	function insertRecord(database, record) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: record.sequence
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doNothing()));
	}
	function upsertPreparedRecord(database, record) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).insertInto("diagnostic_events").values({
			scope,
			event_key: record.event_key,
			payload_json: record.payload_json,
			created_at: record.created_at,
			sequence: nextAuditSequence({
				database,
				scope,
				legacy: false
			})
		}).onConflict((conflict) => conflict.columns(["scope", "event_key"]).doUpdateSet({
			payload_json: record.payload_json,
			created_at: record.created_at
		})));
		pruneAuditRecords({
			database,
			scope,
			maxEntries,
			protectedKey: record.event_key
		});
	}
	function deleteRecord(database, key) {
		executeSqliteQuerySync(database, getAuditRecordKysely(database).deleteFrom("diagnostic_events").where("scope", "=", scope).where("event_key", "=", key));
	}
	return {
		register(key, value, createdAt = Date.now()) {
			const record = prepareRecord({
				key,
				value,
				createdAt
			});
			runOpenClawStateWriteTransaction((database) => {
				insertRecord(database.db, {
					...record,
					sequence: nextAuditSequence({
						database: database.db,
						scope,
						legacy: false
					})
				});
				pruneAuditRecords({
					database: database.db,
					scope,
					maxEntries,
					protectedKey: key
				});
			}, options);
		},
		upsert(key, value, createdAt = Date.now()) {
			const record = prepareRecord({
				key,
				value,
				createdAt
			});
			runOpenClawStateWriteTransaction((database) => {
				upsertPreparedRecord(database.db, record);
			}, options);
		},
		delete(key) {
			runOpenClawStateWriteTransaction((database) => {
				deleteRecord(database.db, key);
			}, options);
		},
		compareAndSet(key, expectedValue, value, createdAt = Date.now()) {
			const expectedPayloadJson = expectedValue === null ? null : JSON.stringify(expectedValue);
			const record = value === null ? null : prepareRecord({
				key,
				value,
				createdAt
			});
			let updated = false;
			runOpenClawStateWriteTransaction((database) => {
				if ((executeSqliteQueryTakeFirstSync(database.db, getAuditRecordKysely(database.db).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).where("event_key", "=", key))?.payload_json ?? null) !== expectedPayloadJson) return;
				if (record) upsertPreparedRecord(database.db, record);
				else deleteRecord(database.db, key);
				updated = true;
			}, options);
			return updated;
		},
		registerLegacyMany(records) {
			const prepared = records.map(prepareRecord);
			if (prepared.length === 0) return;
			runOpenClawStateWriteTransaction((database) => {
				let sequence = nextAuditSequence({
					database: database.db,
					scope,
					legacy: true
				});
				for (const record of prepared) {
					insertRecord(database.db, {
						...record,
						sequence
					});
					sequence += 1;
				}
				pruneAuditRecords({
					database: database.db,
					scope,
					maxEntries
				});
			}, options);
		},
		size() {
			return countAuditRecords(openOpenClawStateDatabase(options).db, scope);
		},
		entries() {
			const database = openOpenClawStateDatabase(options);
			return executeSqliteQuerySync(database.db, getAuditRecordKysely(database.db).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => {
				const { sequence: _sequence, ...entry } = parseAuditRecord(row);
				return entry;
			});
		},
		latest(params) {
			const limit = Math.max(0, Math.floor(params.limit));
			if (limit === 0) return [];
			const database = openOpenClawStateDatabase(options);
			const baseQuery = getAuditRecordKysely(database.db).selectFrom("diagnostic_events").select([
				"event_key",
				"payload_json",
				"created_at",
				"sequence"
			]).where("scope", "=", scope);
			const query = params.beforeSequence === void 0 ? baseQuery : baseQuery.where("sequence", "<", params.beforeSequence);
			return executeSqliteQuerySync(database.db, query.orderBy("sequence", "desc").limit(limit)).rows.map((row) => parseAuditRecord(row));
		}
	};
}
//#endregion
export { createSqliteAuditRecordStore as t };
