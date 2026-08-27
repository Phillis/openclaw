import { t as openNodeSqliteDatabase } from "../node-sqlite-sCL6pEgr.js";
import { f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "../openclaw-state-db.paths-DmtKty-F.js";
import { an as prepareSqliteReadOnlyLocation } from "../openclaw-state-db-DlCMR4eQ.js";
import { r as assertSqliteIntegrity, s as isTerminalSqliteIntegrityError } from "../sqlite-strict-BaSF4bDz.js";
//#region src/state/openclaw-database-verify.worker.ts
const DATABASE_VERIFY_CHILD_ARG = "--openclaw-database-verify-child";
function isVerifyTarget(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const target = value;
	return typeof target.path === "string" && (target.kind === "agent" || target.kind === "state") && typeof target.label === "string";
}
function formatVerifyError(error) {
	return error instanceof Error ? `${error.name}: ${error.message}` : String(error);
}
async function verifyOpenClawDatabase(target) {
	let cleanup;
	let database;
	let result = await (async () => {
		try {
			const prepared = await prepareSqliteReadOnlyLocation(target.path);
			cleanup = prepared.cleanup;
			database = openNodeSqliteDatabase(prepared.location, { readOnly: true });
			database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
			assertSqliteIntegrity(database, target.label);
			return {
				path: target.path,
				ok: true
			};
		} catch (error) {
			const terminal = error instanceof Error && isTerminalSqliteIntegrityError(error);
			return {
				path: target.path,
				ok: false,
				error: formatVerifyError(error),
				terminal
			};
		}
	})();
	try {
		database?.close();
	} catch (error) {
		if (result.ok) result = {
			path: target.path,
			ok: false,
			error: formatVerifyError(error),
			terminal: false
		};
	} finally {
		cleanup?.();
	}
	return result;
}
/** Verify database files serially so large agent scans never compete for I/O. */
async function verifyOpenClawDatabases(targets) {
	const results = [];
	for (const target of targets) results.push(await verifyOpenClawDatabase(target));
	return results;
}
const sendToParent = process.argv[2] === DATABASE_VERIFY_CHILD_ARG ? process.send?.bind(process) : void 0;
if (sendToParent) process.once("message", (message) => {
	(async () => {
		try {
			const results = await verifyOpenClawDatabases(Array.isArray(message) ? message.filter(isVerifyTarget) : []);
			await new Promise((resolve, reject) => {
				sendToParent(results, (error) => {
					if (error) reject(error);
					else resolve();
				});
			});
		} catch {
			process.exitCode = 1;
		} finally {
			process.disconnect?.();
		}
	})();
});
//#endregion
export { verifyOpenClawDatabases };
