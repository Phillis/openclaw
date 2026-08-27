import { a as prepareSqliteReadOnlyLocationSyncInProcess, r as prepareSqliteReadOnlyLocationInProcess } from "../sqlite-readonly-location-BUsr5nKz.js";
//#region src/infra/sqlite-readonly-location.worker.ts
function formatWorkerError(error) {
	return error instanceof Error ? error.message : String(error);
}
async function runWorker() {
	const mode = process.argv[3];
	const pathname = process.argv[4];
	if (mode !== "sync" && mode !== "async" || !pathname) {
		process.exitCode = 1;
		process.stdout.write(JSON.stringify({
			ok: false,
			message: "SQLite read-only worker requires a mode and a database path"
		}));
		return;
	}
	try {
		const prepared = mode === "sync" ? prepareSqliteReadOnlyLocationSyncInProcess(pathname) : await prepareSqliteReadOnlyLocationInProcess(pathname);
		process.stdout.write(JSON.stringify({
			ok: true,
			location: prepared.location
		}));
	} catch (error) {
		process.exitCode = 1;
		process.stdout.write(JSON.stringify({
			ok: false,
			message: formatWorkerError(error)
		}));
	}
}
if (process.argv[2] === "--openclaw-sqlite-readonly-child") runWorker();
//#endregion
export {};
