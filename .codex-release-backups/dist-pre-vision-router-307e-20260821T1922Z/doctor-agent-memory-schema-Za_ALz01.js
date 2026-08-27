import { m as shortenHomePath } from "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { i as closeOpenClawAgentDatabaseByPath } from "./openclaw-agent-db-lxLIE6rA.js";
import { E as listOpenClawRegisteredAgentDatabases, r as migrateOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { t as note } from "./note-D7f3pYFE.js";
import { i as withDoctorSqliteMaintenanceLock, t as DoctorSqliteMaintenanceLockUnavailableError } from "./doctor-sqlite-maintenance-lock-mAgCgc2I.js";
import fs from "node:fs";
//#region src/commands/doctor-agent-memory-schema.ts
const LEGACY_MEMORY_RECALL_METADATA_COLUMNS = [
	"importance",
	"triggers",
	"project_key"
];
const LEGACY_MEMORY_PROVENANCE_TRIGGER = "memory_index_chunk_provenance_after_insert";
const MEMORY_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
function readMemoryRecallMetadataMigrationState(database) {
	const rows = database.prepare("PRAGMA table_info(memory_index_chunks)").all();
	if (rows.length === 0) return null;
	const columns = new Set(rows.flatMap((row) => typeof row.name === "string" ? [row.name] : []));
	return {
		columns: LEGACY_MEMORY_RECALL_METADATA_COLUMNS.filter((column) => columns.has(column)),
		hasMetadataTable: Boolean(database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'table' AND name = ?").get(MEMORY_RECALL_METADATA_TABLE)),
		hasProvenanceTrigger: Boolean(database.prepare("SELECT 1 FROM sqlite_schema WHERE type = 'trigger' AND name = ?").get(LEGACY_MEMORY_PROVENANCE_TRIGGER))
	};
}
function inspectAgentMemoryRecallMetadataMigration(pathname) {
	if (!fs.lstatSync(pathname).isFile()) throw new Error(`OpenClaw agent database is not a regular file: ${pathname}`);
	const database = openNodeSqliteDatabase(pathname, { readOnly: true });
	try {
		return readMemoryRecallMetadataMigrationState(database);
	} finally {
		database.close();
	}
}
/** Move the unreleased inline metadata shape into rollback-safe additive tables. */
function repairDoctorAgentMemorySchemas(options = {}) {
	const env = options.env ?? process.env;
	const repaired = [];
	const warnings = [];
	let registered;
	try {
		registered = listOpenClawRegisteredAgentDatabases({
			env,
			includeIncompatibleSchemaVersions: true
		});
	} catch (error) {
		return {
			repaired,
			warnings: [`Could not inspect registered agent databases: ${formatErrorMessage(error)}`]
		};
	}
	for (const entry of registered) try {
		const before = inspectAgentMemoryRecallMetadataMigration(entry.path);
		if (!before || before.columns.length === 0 && !before.hasProvenanceTrigger) continue;
		closeOpenClawAgentDatabaseByPath(entry.path);
		migrateOpenClawAgentDatabaseForMaintenance({
			agentId: entry.agentId,
			pathname: entry.path
		});
		const after = inspectAgentMemoryRecallMetadataMigration(entry.path);
		if (after === null || after.columns.length > 0 || after.hasProvenanceTrigger || !after.hasMetadataTable) throw new Error("memory recall metadata did not converge on rollback-safe additive storage");
		repaired.push({
			agentId: entry.agentId,
			columns: before.columns,
			path: entry.path,
			removedTrigger: before.hasProvenanceTrigger
		});
	} catch (error) {
		warnings.push(`Agent ${entry.agentId} database ${shortenHomePath(entry.path)}: ${formatErrorMessage(error)}`);
	}
	return {
		repaired,
		warnings
	};
}
async function noteDoctorAgentMemorySchemaHealth(params, deps = {}) {
	const writeNote = deps.note ?? note;
	if (!params.shouldRepair) return {
		repaired: [],
		warnings: []
	};
	let report;
	try {
		report = await withDoctorSqliteMaintenanceLock({
			env: params.env,
			operation: "agent memory schema repair",
			run: () => repairDoctorAgentMemorySchemas({ env: params.env })
		});
	} catch (error) {
		if (!(error instanceof DoctorSqliteMaintenanceLockUnavailableError)) throw error;
		report = {
			repaired: [],
			warnings: [error.message]
		};
	}
	if (report.repaired.length > 0) writeNote(report.repaired.map((repair) => {
		const changes = [repair.columns.length > 0 ? `moved ${repair.columns.map((column) => `memory_index_chunks.${column}`).join(", ")} to additive storage` : null, repair.removedTrigger ? `removed ${LEGACY_MEMORY_PROVENANCE_TRIGGER}` : null].filter((change) => change !== null);
		return `- Agent ${repair.agentId}: ${changes.join("; ")} (${shortenHomePath(repair.path)}).`;
	}).join("\n"), "Doctor changes");
	if (report.warnings.length > 0) writeNote(report.warnings.map((warning) => `- ${warning}`).join("\n"), "Doctor warnings");
	return report;
}
//#endregion
export { noteDoctorAgentMemorySchemaHealth };
