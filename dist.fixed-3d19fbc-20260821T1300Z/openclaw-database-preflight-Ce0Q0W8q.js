import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { f as clearNodeSqliteKyselyCacheForDatabase, r as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-B9zMic_z.js";
import { _ as getNodeSqliteKysely, a as describeRunningOpenClawBuild, d as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, h as executeSqliteQuerySync, o as readSqliteUserVersion, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { C as inspectOpenClawStateOwnershipFromDatabase, Dt as getOpenClawStateRuntimeSchema, Et as STATE_PERSISTENT_SCHEMA_COMPATIBILITY, Ot as isOpenClawStateStartupRepairableSchemaIssue, St as assertOpenClawStateDatabaseOwner, Tt as OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, gn as collectSqliteSchemaIssues, kt as OPENCLAW_STATE_SCHEMA_SQL, xt as assertOpenClawStateDatabaseForMaintenance } from "./openclaw-state-db-BciZ4rHE.js";
import { r as assertSqliteIntegrity } from "./sqlite-strict-BCq9LdDO.js";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import "./openclaw-agent-db-migration-required-RkIFq1cn.js";
import { existsSync, realpathSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-database-preflight.ts
function formatDoctorIncompatibleDatabase(database) {
	const agent = database.agentId ? ` for agent ${database.agentId}` : "";
	const writer = database.writerAppVersion ? `; writer build ${database.writerAppVersion}` : "";
	return `${database.kind} database${agent} ${database.path} uses schema ${database.foundVersion}; this build supports ${database.supportedVersion}${writer}.`;
}
/** Fatal refusal when persisted schemas were written by a newer build. */
var OpenClawDatabaseSchemaPreflightError = class extends Error {
	constructor(incompatibleDatabases, options = {}) {
		const operation = options.operation ?? "gateway-startup";
		const prefix = operation === "doctor" ? "Doctor refused to continue" : operation === "gateway-restart" ? "Gateway refused restart" : "Gateway refused startup";
		const doctorGuidance = operation === "doctor" ? ` ${incompatibleDatabases.map(formatDoctorIncompatibleDatabase).join(" ")} Run Doctor with the OpenClaw install that wrote this state (typically the active Gateway install), or another build that supports these schemas.` : "";
		super(`${prefix} because ${incompatibleDatabases.length} OpenClaw database schema(s) are newer than this build. Refused by ${describeRunningOpenClawBuild()}.${doctorGuidance} See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
		this.incompatibleDatabases = incompatibleDatabases;
		this.name = "OpenClawDatabaseSchemaPreflightError";
	}
};
/** Refuse a restart that would reopen the current persisted databases unsuccessfully. */
function assertOpenClawDatabasesReadyForRestart(options) {
	const schemas = preflightOpenClawDatabaseSchemas({
		env: options.env,
		supportedVersions: {
			state: 8,
			agent: 17
		},
		verifyCurrentSchemaShape: true
	});
	if (schemas.incompatible.length > 0) throw new OpenClawDatabaseSchemaPreflightError(schemas.incompatible, { operation: "gateway-restart" });
	if (schemas.indeterminate.length === 0) return;
	const shown = schemas.indeterminate.slice(0, 3).map((database) => `${database.kind} ${database.path}: ${database.reason}`);
	const omitted = schemas.indeterminate.length - shown.length;
	throw new Error(`Gateway refused restart because persisted database readiness could not be verified: ${shown.join("; ")}${omitted > 0 ? `; +${omitted} more` : ""}. Run openclaw doctor --fix, then retry the restart.`);
}
function readWriterAppVersion(database) {
	try {
		const row = database.prepare("SELECT app_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
		return typeof row?.app_version === "string" && row.app_version.length > 0 ? row.app_version : void 0;
	} catch {
		return;
	}
}
function readRegisteredAgentDatabases(database) {
	if (!database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = 'agent_databases'").get()) return [];
	return executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("agent_databases").select(["agent_id", "path"])).rows.flatMap((row) => typeof row.agent_id === "string" && typeof row.path === "string" ? [{
		agentId: row.agent_id,
		path: row.path
	}] : []);
}
function deduplicateSchemaIssues(issues) {
	return [...new Map(issues.map((issue) => [`${issue.code}\0${issue.objectName}`, issue])).values()];
}
/** Compare one explicit SQLite file with this release's canonical shared-state schema. */
async function preflightOpenClawStateDatabasePath(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "openclaw.state-schema-preflight.v1",
		databasePath: resolvedPath,
		targetVersion: 8
	};
	let database;
	let foundVersion = null;
	let ownership = null;
	const result = (status, details = {}) => ({
		...base,
		foundVersion,
		ownership,
		issues: details.issues ?? [],
		status,
		requiresWrite: details.requiresWrite ?? false,
		...details.reason ? { reason: details.reason } : {}
	});
	try {
		const inspectionPath = realpathSync.native(resolvedPath);
		const sidecars = [
			"-wal",
			"-shm",
			"-journal"
		].filter((suffix) => existsSync(`${inspectionPath}${suffix}`));
		if (sidecars.length > 0) throw new Error(`SQLite preflight requires a consolidated snapshot with no sidecars; found ${sidecars.join(", ")}. Create a WAL-aware online backup and preflight the resulting standalone file.`);
		database = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(inspectionPath), { readOnly: true });
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS}; PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;`);
		assertSqliteIntegrity(database, resolvedPath);
		foundVersion = readSqliteUserVersion(database);
		if (!Number.isSafeInteger(foundVersion) || foundVersion < 0) throw new Error(`OpenClaw state database ${resolvedPath} has invalid schema version metadata.`);
		if (foundVersion > 8) {
			try {
				ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
			} catch {}
			return result("incompatible");
		}
		ownership = inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
		if (foundVersion < 8) return result("migration-required", { requiresWrite: true });
		assertOpenClawStateDatabaseOwner(database, { pathname: resolvedPath });
		const metadata = database.prepare("SELECT schema_version FROM schema_meta WHERE meta_key = 'primary' LIMIT 1").get();
		if (metadata?.schema_version !== foundVersion) throw new Error(`OpenClaw state database ${resolvedPath} metadata schema version ${typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid"} does not match ${foundVersion}.`);
		const maintenanceIssues = collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY);
		const blockingIssues = maintenanceIssues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue));
		if (blockingIssues.length > 0) return result("incompatible", { issues: deduplicateSchemaIssues(blockingIssues) });
		const projectedRuntimeIssues = collectSqliteSchemaIssues(database, getOpenClawStateRuntimeSchema({ includeVersionLazyAdditiveTables: false }), STATE_PERSISTENT_SCHEMA_COMPATIBILITY);
		const projectedRuntimeBlockingIssues = projectedRuntimeIssues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue));
		if (projectedRuntimeBlockingIssues.length > 0) return result("incompatible", { issues: deduplicateSchemaIssues(projectedRuntimeBlockingIssues) });
		const startupRepairableIssues = deduplicateSchemaIssues([...maintenanceIssues, ...projectedRuntimeIssues]);
		return result(startupRepairableIssues.length > 0 ? "startup-repairable" : "exact", {
			issues: startupRepairableIssues,
			requiresWrite: startupRepairableIssues.length > 0
		});
	} catch (error) {
		return result("indeterminate", { reason: formatErrorMessage(error) });
	} finally {
		database?.close();
	}
}
/** Read schema headers and optionally verify current schema shape without repairing it. */
function preflightOpenClawDatabaseSchemas(options) {
	const result = {
		incompatible: [],
		indeterminate: []
	};
	const statePath = path.resolve(resolveOpenClawStateSqlitePath(options.env));
	if (!existsSync(statePath)) return result;
	let stateDatabase;
	try {
		stateDatabase = openNodeSqliteDatabase(statePath, { readOnly: true });
		stateDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		const stateVersion = readSqliteUserVersion(stateDatabase);
		if (stateVersion > options.supportedVersions.state) {
			const writerAppVersion = readWriterAppVersion(stateDatabase);
			result.incompatible.push({
				kind: "state",
				path: statePath,
				foundVersion: stateVersion,
				supportedVersion: options.supportedVersions.state,
				...writerAppVersion ? { writerAppVersion } : {}
			});
		}
		if (options.verifyCurrentSchemaShape === true && stateVersion === 8) try {
			assertOpenClawStateDatabaseForMaintenance(stateDatabase, { pathname: statePath });
		} catch (error) {
			result.indeterminate.push({
				kind: "state",
				path: statePath,
				reason: formatErrorMessage(error)
			});
		}
		let registeredDatabases;
		try {
			registeredDatabases = readRegisteredAgentDatabases(stateDatabase);
		} catch (error) {
			result.indeterminate.push({
				kind: "state",
				path: statePath,
				reason: `agent database registry query failed: ${formatErrorMessage(error)}`
			});
			return result;
		}
		for (const row of registeredDatabases) {
			const agentPath = path.resolve(row.path);
			if (!existsSync(agentPath)) continue;
			let agentDatabase;
			try {
				agentDatabase = openNodeSqliteDatabase(agentPath, { readOnly: true });
				agentDatabase.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
				const agentVersion = readSqliteUserVersion(agentDatabase);
				if (agentVersion <= options.supportedVersions.agent) {
					if (options.verifyCurrentSchemaShape === true) assertOpenClawAgentDatabaseForMaintenance(agentDatabase, {
						agentId: row.agentId,
						pathname: agentPath
					});
					continue;
				}
				const writerAppVersion = readWriterAppVersion(agentDatabase);
				result.incompatible.push({
					kind: "agent",
					path: agentPath,
					agentId: row.agentId,
					foundVersion: agentVersion,
					supportedVersion: options.supportedVersions.agent,
					...writerAppVersion ? { writerAppVersion } : {}
				});
			} catch (error) {
				result.indeterminate.push({
					kind: "agent",
					path: agentPath,
					reason: formatErrorMessage(error)
				});
			} finally {
				agentDatabase?.close();
			}
		}
		return result;
	} catch (error) {
		result.indeterminate.push({
			kind: "state",
			path: statePath,
			reason: formatErrorMessage(error)
		});
		return result;
	} finally {
		if (stateDatabase) {
			clearNodeSqliteKyselyCacheForDatabase(stateDatabase);
			stateDatabase.close();
		}
	}
}
//#endregion
export { preflightOpenClawStateDatabasePath as i, assertOpenClawDatabasesReadyForRestart as n, preflightOpenClawDatabaseSchemas as r, OpenClawDatabaseSchemaPreflightError as t };
