import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as writeRuntimeJson, o as writeRuntimeStdout, r as defaultRuntime } from "./runtime-LRpY2Icg.js";
import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL, o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-DsoDzKB9.js";
import { C as inspectOpenClawStateOwnershipAtPath, D as runWithOpenClawStateOwnershipCoordinator, E as normalizeOpenClawStateManagerId, Nn as getNodeSqliteKysely, Ot as assertOpenClawStateDatabaseForMaintenance, b as STATE_SUPERVISION_KEY, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync, jt as resolveDatabasePath, w as inspectOpenClawStateOwnershipFromDatabase, y as OpenClawStateOwnershipMetadataError } from "./openclaw-state-db-kmBThqu6.js";
import { h as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase, u as runSqliteImmediateTransactionSync } from "./node-sqlite-_e3IvfT7.js";
import { t as assertSqliteIntegrity } from "./sqlite-integrity-D3VwDKmB.js";
import { r as configureSqliteWalMaintenance } from "./sqlite-wal-BHpwckP_.js";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-C0L8fX98.js";
import { t as applyParentDefaultHelpAction } from "./parent-default-help-DQUF3qKA.js";
import { i as preflightOpenClawStateDatabasePath } from "./openclaw-database-preflight-UEy2BqRj.js";
//#region src/state/openclaw-state-ownership-operations.ts
function requireOwnershipCheckpoint(walMaintenance, databasePath) {
	if (!walMaintenance.checkpoint()) throw new Error(`External ownership was committed for ${databasePath}, but its WAL checkpoint failed. Retry the same ownership claim before activating the supervisor.`);
}
function claimOwnershipRow(database, databasePath, managerId, repairMalformed) {
	let current = null;
	try {
		current = inspectOpenClawStateOwnershipFromDatabase(database, databasePath);
	} catch (error) {
		if (!repairMalformed || !(error instanceof OpenClawStateOwnershipMetadataError)) throw error;
	}
	if (current) {
		if (current.managerId !== managerId) throw new Error(`OpenClaw shared state is already claimed by external manager ${current.managerId}; manager ${managerId} cannot replace that durable ownership.`);
		return current;
	}
	const ownership = {
		version: 1,
		mode: "external",
		managerId,
		claimedAt: Date.now()
	};
	const valueJson = JSON.stringify(ownership);
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("config_machine_state").values({
		state_key: STATE_SUPERVISION_KEY,
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: valueJson,
		updated_at_ms: ownership.claimedAt
	})));
	return ownership;
}
function repairMalformedOwnershipClaim(databasePath, managerId) {
	return runWithOpenClawStateOwnershipCoordinator(databasePath, "malformed state ownership repair/checkpoint", () => {
		const database = openNodeSqliteDatabase(databasePath);
		let walMaintenance;
		try {
			database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSqliteIntegrity(database, databasePath);
			assertOpenClawStateDatabaseForMaintenance(database, { pathname: databasePath });
			walMaintenance = configureSqliteWalMaintenance(database, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				checkpointIntervalMs: 0,
				checkpointMode: "TRUNCATE",
				databaseLabel: "OpenClaw shared state ownership",
				databasePath
			});
			const ownership = runSqliteImmediateTransactionSync(database, () => {
				assertOpenClawStateDatabaseForMaintenance(database, { pathname: databasePath });
				return claimOwnershipRow(database, databasePath, managerId, true);
			}, {
				busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
				databaseLabel: databasePath,
				operationLabel: "state.ownership.repair"
			});
			requireOwnershipCheckpoint(walMaintenance, databasePath);
			return ownership;
		} finally {
			walMaintenance?.close({ checkpointMode: "PASSIVE" });
			clearNodeSqliteKyselyCacheForDatabase(database);
			database.close();
		}
	});
}
/** Claim durable shared-state write ownership for the active external supervisor. */
function claimOpenClawStateOwnership(managerId, options = {}) {
	if (!isGatewayExternallySupervised(options.env ?? process.env)) throw new Error("Claiming external shared-state ownership requires OPENCLAW_SUPERVISOR_MODE=external.");
	const normalizedManagerId = normalizeOpenClawStateManagerId(managerId);
	try {
		const database = openOpenClawStateDatabase(options);
		return runWithOpenClawStateOwnershipCoordinator(database.path, "state ownership claim/checkpoint", () => {
			const ownership = runOpenClawStateWriteTransaction(({ db, path: databasePath }) => claimOwnershipRow(db, databasePath, normalizedManagerId, false), {
				...options,
				database
			}, { operationLabel: "state.ownership.claim" });
			requireOwnershipCheckpoint(database.walMaintenance, database.path);
			return ownership;
		});
	} catch (error) {
		if (!(error instanceof OpenClawStateOwnershipMetadataError)) throw error;
		const ownership = repairMalformedOwnershipClaim(resolveDatabasePath(options), normalizedManagerId);
		openOpenClawStateDatabase(options);
		return ownership;
	}
}
//#endregion
//#region src/cli/program/register.database.ts
function writeDatabaseError(error, json) {
	const message = formatErrorMessage(error);
	if (json) writeRuntimeJson(defaultRuntime, { error: message });
	else defaultRuntime.error(message);
	defaultRuntime.exit(1);
}
async function runDatabasePreflight(databasePath, options) {
	const result = await preflightOpenClawStateDatabasePath(databasePath);
	if (options.json) writeRuntimeJson(defaultRuntime, result);
	else {
		const detail = result.reason ?? result.issues[0]?.message;
		writeRuntimeStdout(defaultRuntime, `Database preflight: ${result.status} (found ${result.foundVersion ?? "unknown"}, target ${result.targetVersion}).${detail ? `\n${detail}` : ""}\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	}
	if (result.status === "incompatible" || result.status === "indeterminate") defaultRuntime.exit(1);
}
function runDatabaseOwnership(options) {
	try {
		const databasePath = resolveDatabasePath({ env: process.env });
		const ownership = options.manager !== void 0 ? claimOpenClawStateOwnership(options.manager, {
			path: databasePath,
			env: process.env
		}) : inspectOpenClawStateOwnershipAtPath(databasePath);
		const status = ownership ? {
			status: "external",
			ownership
		} : { status: "unowned" };
		if (options.json) {
			writeRuntimeJson(defaultRuntime, {
				databasePath,
				...status
			});
			return;
		}
		writeRuntimeStdout(defaultRuntime, `${status.status === "external" ? `Shared state is externally owned by ${status.ownership.managerId}.` : "Shared state is not externally owned."}\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.\n`);
	} catch (error) {
		writeDatabaseError(error, options.json === true);
	}
}
function registerDatabaseCommand(program) {
	const database = program.command("database").description("Inspect shared-state schema compatibility and write ownership").addHelpText("after", `\nDocs: ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}\n`);
	database.command("preflight").description("Compare one copied SQLite file with this release's state schema").argument("<path>", "explicit copied SQLite database path").option("--json", "emit machine-readable JSON", false).action(async (databasePath, options) => {
		await runDatabasePreflight(databasePath, options);
	});
	const ownership = database.command("ownership").description("Inspect or claim write ownership");
	ownership.command("status").description("Show durable shared-state write ownership").option("--json", "emit machine-readable JSON", false).action((options) => runDatabaseOwnership(options));
	ownership.command("claim").description("Claim shared-state writes for the active external supervisor").requiredOption("--manager <id>", "stable external manager identifier").option("--json", "emit machine-readable JSON", false).action((options) => runDatabaseOwnership(options));
	applyParentDefaultHelpAction(ownership);
	applyParentDefaultHelpAction(database);
}
//#endregion
export { registerDatabaseCommand };
