import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { existsSync } from "node:fs";
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
function readConfigMachineState(key, options = {}) {
	if (!existsSync(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env))) return;
	return withOpenClawStateDatabaseReadOnly(({ db: database }) => {
		if (!tableExists(database, "config_machine_state")) return;
		const row = executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("config_machine_state").select("value_json").where("state_key", "=", normalizeStateKey(key)));
		return row ? JSON.parse(row.value_json) : void 0;
	}, options);
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
/** Atomically update one machine-state value from its current database value. */
function updateConfigMachineState(key, update, options = {}) {
	const stateKey = normalizeStateKey(key);
	const now = Date.now();
	return runOpenClawStateWriteTransaction((database) => {
		const db = getNodeSqliteKysely(database.db);
		const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey));
		const value = update(row ? JSON.parse(row.value_json) : void 0);
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
export { writeConfigMachineState as i, readConfigMachineState as n, updateConfigMachineState as r, importConfigMachineState as t };
