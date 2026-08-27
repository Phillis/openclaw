//#region src/commands/doctor-session-sqlite-types.ts
const SESSION_SQLITE_WARNING_ISSUE_CODES = /* @__PURE__ */ new Set([
	"entry_invalid",
	"transcript_archive_failed",
	"transcript_malformed",
	"transcript_missing",
	"unreferenced_jsonl_archive_failed"
]);
function isSessionSqliteMigrationWarning(issue) {
	return SESSION_SQLITE_WARNING_ISSUE_CODES.has(issue.code);
}
function createDoctorSessionSqliteTargetReport(values) {
	return {
		archivedTranscriptFiles: [],
		archivedUnreferencedJsonlFiles: [],
		importedEntries: 0,
		importedTranscriptEvents: 0,
		issues: [],
		legacyEntries: 0,
		referencedTranscriptFiles: 0,
		sqliteEntries: 0,
		unreferencedJsonlFiles: [],
		validatedEntries: 0,
		validatedTranscriptEvents: 0,
		...values
	};
}
function sumDoctorSessionSqliteTargets(targets, value) {
	return targets.reduce((total, target) => total + value(target), 0);
}
function createDoctorSessionSqliteTotals(targets, values = {}) {
	const { archivedLegacyStoreFiles, reclaimedBytes } = values;
	return {
		...archivedLegacyStoreFiles === void 0 ? {} : { archivedLegacyStoreFiles },
		archivedTranscriptFiles: values.archivedTranscriptFiles ?? 0,
		archivedUnreferencedJsonlFiles: values.archivedUnreferencedJsonlFiles ?? 0,
		importedEntries: values.importedEntries ?? 0,
		importedTranscriptEvents: values.importedTranscriptEvents ?? 0,
		issues: sumDoctorSessionSqliteTargets(targets, (target) => target.issues.length),
		legacyEntries: values.legacyEntries ?? 0,
		...reclaimedBytes === void 0 ? {} : { reclaimedBytes },
		sqliteEntries: sumDoctorSessionSqliteTargets(targets, (target) => target.sqliteEntries),
		targets: targets.length,
		unreferencedJsonlFiles: values.unreferencedJsonlFiles ?? 0,
		validatedEntries: values.validatedEntries ?? 0,
		validatedTranscriptEvents: values.validatedTranscriptEvents ?? 0
	};
}
//#endregion
export { sumDoctorSessionSqliteTargets as i, createDoctorSessionSqliteTotals as n, isSessionSqliteMigrationWarning as r, createDoctorSessionSqliteTargetReport as t };
