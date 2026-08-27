import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { o as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-C1w8kMxr.js";
import "./openclaw-state-db-CeAO_dqo.js";
import { h as clearNodeSqliteKyselyCacheForDatabase, t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { u as getOpenClawAgentDatabaseIfOpen } from "./openclaw-agent-db-CM8nAOgX.js";
import { B as resolveOpenClawAgentSqlitePath, R as isIncognitoOpenClawAgentSqlitePath, c as assertCanonicalAgentMediaPersistenceVersion, d as assertSupportedAgentSchemaVersion, f as readExistingAgentSchemaMeta, l as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import fs from "node:fs";
//#region src/state/openclaw-agent-db-readonly.ts
function isMissingTableError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && /\bno such table:/iu.test(error.message);
}
/**
* Look up a process-held handle without adopting writer-side failures.
*
* Read-only reads are meant to survive a latched open failure or an ownership
* mismatch that only the writable lifecycle cares about; those callers fall
* back to a fresh connection, which reports the precise reason.
*/
function findOpenAgentDatabase(options) {
	try {
		return getOpenClawAgentDatabaseIfOpen(options);
	} catch {
		return;
	}
}
/** Read agent state without creating, registering, migrating, or joining its writable lifecycle. */
function withOpenClawAgentDatabaseReadOnly(operation, options, behavior = {}) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = resolveOpenClawAgentSqlitePath({
		...options,
		agentId
	});
	if (isIncognitoOpenClawAgentSqlitePath(pathname, {
		agentId,
		env: options.env
	})) {
		const database = getOpenClawAgentDatabaseIfOpen({
			...options,
			agentId
		});
		if (database && behavior.allowExtension) throw new Error("Extension-capable read-only access is unavailable for incognito databases.");
		return database ? {
			found: true,
			value: operation(database)
		} : {
			found: false,
			reason: "database-missing"
		};
	}
	const opened = behavior.allowExtension ? void 0 : findOpenAgentDatabase({
		...options,
		agentId
	});
	if (opened && !opened.db.isTransaction) {
		assertSupportedAgentSchemaVersion(opened.db, pathname);
		try {
			return {
				found: true,
				value: operation(opened)
			};
		} catch (error) {
			if (isMissingTableError(error) && !behavior.throwOnMissingTable) return {
				found: false,
				reason: "table-missing"
			};
			throw error;
		}
	}
	if (!fs.existsSync(pathname)) return {
		found: false,
		reason: "database-missing"
	};
	const db = openNodeSqliteDatabase(pathname, {
		readOnly: true,
		...behavior.allowExtension ? { allowExtension: true } : {}
	});
	try {
		db.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		assertSupportedAgentSchemaVersion(db, pathname);
		assertCanonicalAgentMediaPersistenceVersion(db, pathname);
		const schemaMeta = readExistingAgentSchemaMeta(db);
		if (!schemaMeta) return {
			found: false,
			reason: "schema-missing"
		};
		assertExistingAgentSchemaOwner(schemaMeta, agentId, pathname);
		try {
			return {
				found: true,
				value: operation({
					agentId,
					db,
					path: pathname
				})
			};
		} catch (error) {
			if (isMissingTableError(error) && !behavior.throwOnMissingTable) return {
				found: false,
				reason: "table-missing"
			};
			throw error;
		}
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(db);
		db.close();
	}
}
//#endregion
export { withOpenClawAgentDatabaseReadOnly as t };
