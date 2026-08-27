import "./src-BntaCZM-.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/infra/sqlite-runtime-version.ts
const SQLITE_WAL_RESET_FIXED_VERSION = {
	major: 3,
	minor: 51,
	patch: 3
};
const SQLITE_WAL_RESET_BACKPORTS = [{
	major: 3,
	minor: 44,
	patch: 6
}, {
	major: 3,
	minor: 50,
	patch: 7
}];
const SQLITE_VERSION_PATTERN = /^(\d+)\.(\d+)\.(\d+)$/u;
/** Query the SQLite library loaded by the current runtime without opening persisted state. */
function detectCurrentRuntimeSqliteVersion() {
	const sqlite = process.getBuiltinModule?.("node:sqlite");
	if (!sqlite?.DatabaseSync) return null;
	const database = new sqlite.DatabaseSync(":memory:");
	try {
		const row = database.prepare("SELECT sqlite_version() AS version").get();
		return isRecord(row) && typeof row.version === "string" ? row.version : null;
	} finally {
		database.close();
	}
}
function parseSqliteVersion(value) {
	const match = SQLITE_VERSION_PATTERN.exec(value.trim());
	if (!match) return null;
	const major = Number.parseInt(match[1] ?? "", 10);
	const minor = Number.parseInt(match[2] ?? "", 10);
	const patch = Number.parseInt(match[3] ?? "", 10);
	if (![
		major,
		minor,
		patch
	].every(Number.isSafeInteger)) return null;
	return {
		major,
		minor,
		patch
	};
}
function compareSqliteVersions(left, right) {
	if (left.major !== right.major) return left.major - right.major;
	if (left.minor !== right.minor) return left.minor - right.minor;
	return left.patch - right.patch;
}
function isSqliteWalResetSafeVersion(value) {
	const version = parseSqliteVersion(value);
	if (!version) return false;
	if (compareSqliteVersions(version, SQLITE_WAL_RESET_FIXED_VERSION) >= 0) return true;
	return SQLITE_WAL_RESET_BACKPORTS.some((backport) => version.major === backport.major && version.minor === backport.minor && version.patch >= backport.patch);
}
//#endregion
export { isSqliteWalResetSafeVersion as n, detectCurrentRuntimeSqliteVersion as t };
