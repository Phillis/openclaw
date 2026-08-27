import { r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { E as runWithOpenClawStateWriteAccess, Nt as clearOpenClawDatabaseQuarantine, _t as ensureOpenClawStatePermissions, b as assertOpenClawStateWriteAllowed, l as isOpenClawStateDatabaseOpen, n as clearOpenClawStateDatabaseOpenFailure, xt as assertOpenClawStateDatabaseForMaintenance, yt as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-DlCMR4eQ.js";
import { i as withDoctorSqliteMaintenanceLock } from "./doctor-sqlite-maintenance-lock-mAgCgc2I.js";
import { t as compactDoctorSqliteFile } from "./doctor-sqlite-compact-DjST4kXL.js";
import fs from "node:fs";
//#region src/commands/doctor-state-sqlite-compact.ts
/** Explicit doctor maintenance for the canonical shared state SQLite database. */
/** Compact only the canonical shared state database resolved for this invocation. */
async function runDoctorStateSqliteCompact(options = {}, deps = {}) {
	const env = options.env ?? process.env;
	const sqlitePath = resolveOpenClawStateSqlitePath(env);
	const stat = readCanonicalStateDatabaseStat(sqlitePath);
	if (!stat) return {
		mode: "compact",
		path: sqlitePath,
		reason: "missing",
		skipped: true
	};
	if (!stat.isFile()) throw new Error(`Canonical OpenClaw state database is not a regular file: ${sqlitePath}`);
	return await (deps.withMaintenanceLock ?? withDoctorSqliteMaintenanceLock)({
		env,
		operation: "state SQLite compaction",
		protectedPaths: resolveSqliteDatabaseFilePaths(sqlitePath),
		run: () => runWithOpenClawStateWriteAccess({
			databasePath: sqlitePath,
			env
		}, "state SQLite compaction", () => {
			if (isOpenClawStateDatabaseOpen()) throw new Error("The shared OpenClaw state database is already open in this process. Stop OpenClaw and retry.");
			return {
				...compactDoctorSqliteFile({
					afterSuccess: () => {
						if (!clearOpenClawDatabaseQuarantine(sqlitePath, { env })) throw new Error(`OpenClaw state database ${sqlitePath} was compacted, but its persisted quarantine record could not be cleared. Rerun openclaw doctor --fix so the database is not refused again.`);
						clearOpenClawStateDatabaseOpenFailure(sqlitePath);
						ensureOpenClawStatePermissions(sqlitePath, env);
					},
					...deps.busyTimeoutMs !== void 0 ? { busyTimeoutMs: deps.busyTimeoutMs } : {},
					sqlitePath,
					validateBeforeMutation: (database) => {
						assertOpenClawStateWriteAllowed({
							database,
							databasePath: sqlitePath,
							env
						});
						assertOpenClawStateDatabaseForMaintenance(database, { pathname: sqlitePath });
					}
				}),
				mode: "compact",
				path: sqlitePath,
				skipped: false
			};
		})
	});
}
function readCanonicalStateDatabaseStat(sqlitePath) {
	try {
		return fs.lstatSync(sqlitePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
//#endregion
export { runDoctorStateSqliteCompact };
