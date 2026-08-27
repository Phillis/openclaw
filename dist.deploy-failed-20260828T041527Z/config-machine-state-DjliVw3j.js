import { Bt as tableExists, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
//#region src/state/config-machine-state.ts
function normalizeStateKey(key) {
	const normalized = key.trim();
	if (!normalized) throw new Error("config machine state key must not be empty");
	return normalized;
}
function serializeStateValue(value) {
	const serialized = JSON.stringify(value);
	if (serialized === void 0) throw new Error("config machine state value must be JSON-serializable");
	return serialized;
}
function readConfigMachineStateWithMetadata(key, options = {}) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db: database }) => {
		if (!tableExists(database, "config_machine_state")) return;
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("config_machine_state").select(["value_json", "updated_at_ms"]).where("state_key", "=", normalizeStateKey(key)));
		return row ? {
			value: JSON.parse(row.value_json),
			updatedAtMs: row.updated_at_ms
		} : void 0;
	}, options);
}
function readConfigMachineState(key, options = {}) {
	return readConfigMachineStateWithMetadata(key, options)?.value;
}
function writeConfigMachineState(key, value, options = {}) {
	const stateKey = normalizeStateKey(key);
	const valueJson = serializeStateValue(value);
	const now = Date.now();
	runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		executeSqliteQuerySync(database.db, db.insertInto("config_machine_state").values({
			state_key: stateKey,
			value_json: valueJson,
			updated_at_ms: now
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: now
		})));
	}, options, { operationLabel: "config-machine-state.write" });
}
function updateConfigMachineState(key, update, options = {}) {
	const stateKey = normalizeStateKey(key);
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey));
		const value = update(row ? JSON.parse(row.value_json) : void 0);
		if (value === void 0) {
			if (row) executeSqliteQuerySync(database.db, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey));
			return;
		}
		const valueJson = serializeStateValue(value);
		executeSqliteQuerySync(database.db, db.insertInto("config_machine_state").values({
			state_key: stateKey,
			value_json: valueJson,
			updated_at_ms: now
		}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
			value_json: valueJson,
			updated_at_ms: now
		})));
		return value;
	}, options, { operationLabel: "config-machine-state.update" });
}
/** Delete one machine-state value, reporting whether a stored value existed. */
function deleteConfigMachineState(key, options = {}) {
	const stateKey = normalizeStateKey(key);
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		return (executeSqliteQuerySync(database.db, db.deleteFrom("config_machine_state").where("state_key", "=", stateKey)).numAffectedRows ?? 0n) > 0n;
	}, options, { operationLabel: "config-machine-state.delete" });
}
/** Import retired config values without replacing newer canonical database state. */
function importConfigMachineState(entries, options = {}) {
	if (entries.length === 0) return {
		imported: [],
		kept: []
	};
	const normalized = entries.map(([key, value]) => ({
		key: normalizeStateKey(key),
		valueJson: serializeStateValue(value)
	}));
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const imported = [];
		const kept = [];
		for (const entry of normalized) {
			if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("config_machine_state").select("state_key").where("state_key", "=", entry.key))) {
				kept.push(entry.key);
				continue;
			}
			executeSqliteQuerySync(database.db, db.insertInto("config_machine_state").values({
				state_key: entry.key,
				value_json: entry.valueJson,
				updated_at_ms: now
			}));
			imported.push(entry.key);
		}
		return {
			imported,
			kept
		};
	}, options, { operationLabel: "config-machine-state.import" });
}
//#endregion
export { updateConfigMachineState as a, readConfigMachineStateWithMetadata as i, importConfigMachineState as n, writeConfigMachineState as o, readConfigMachineState as r, deleteConfigMachineState as t };
