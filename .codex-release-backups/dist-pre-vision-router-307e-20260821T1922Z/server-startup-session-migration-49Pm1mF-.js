import "./agent-scope-BizOtGGz.js";
import { a as listAgentIds } from "./agent-scope-config-BdXMWufB.js";
import { A as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { r as isSessionSqliteMigrationWarning } from "./doctor-session-sqlite-types-DDjJUvI3.js";
import { t as runSessionStartupMigration } from "./startup-migration-dSczFgqC.js";
import fs from "node:fs";
//#region src/gateway/server-startup-session-migration.ts
/**
* Run session migrations at gateway startup before runtime session access.
*
* Orphan-key cleanup remains best-effort. Full SQLite import is blocking
* for hot legacy session issues because runtime no longer falls back to JSONL.
*/
async function runStartupSessionMigration(params) {
	if (await runSessionStartupMigration(params)) await runStartupSessionSqliteImport(params);
	await reconcileStartupSessionTranscriptIndexes(params);
}
async function reconcileStartupSessionTranscriptIndexes(params) {
	const databaseExists = params.deps?.sessionSqliteDatabaseExists ?? ((input) => fs.existsSync(resolveOpenClawAgentSqlitePath(input)));
	const agentIds = listAgentIds(params.cfg).filter((agentId) => databaseExists({
		agentId,
		...params.env ? { env: params.env } : {}
	}));
	if (agentIds.length === 0) return;
	const reconcile = params.deps?.reconcileSessionTranscriptIndexes ?? (await import("./session-transcript-reconcile-DtRExGqT.js")).reconcileSessionTranscriptIndexes;
	let reconciledSessions = 0;
	for (const agentId of agentIds) {
		const result = await reconcile({
			agentId,
			...params.env ? { env: params.env } : {}
		});
		reconciledSessions += result.reconciledSessions;
	}
	if (reconciledSessions > 0) params.log.info(`session: rebuilt ${reconciledSessions} transcript projection(s) before serving history`);
}
async function runStartupSessionSqliteImport(params) {
	const env = params.env ?? process.env;
	const runDoctorSessionSqlite = params.deps?.runDoctorSessionSqlite ?? (await import("./doctor-session-sqlite-Ckz_uvmM.js")).runDoctorSessionSqlite;
	let report;
	try {
		report = await runDoctorSessionSqlite({
			allAgents: true,
			cfg: params.cfg,
			env,
			mode: "import"
		});
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw new Error([`session SQLite migration failed during startup because an agent SQLite database could not be opened: ${String(error)}`, "Run \"openclaw doctor --session-sqlite recover --session-sqlite-all-agents\" to move the corrupt database aside and preserve it for support."].join("\n"), { cause: error });
		throw error;
	}
	const warningIssues = collectStartupWarningIssues(report);
	const blockingIssues = collectStartupBlockingIssues(report);
	if (blockingIssues.length > 0) {
		const recovery = await restoreFailedStartupSessionSqliteRun(params, report, blockingIssues);
		throw new Error([
			`session SQLite migration failed during startup with ${blockingIssues.length} blocking issue(s).`,
			...formatStartupIssueLines(blockingIssues).map((line) => `- ${line}`),
			"Run \"openclaw doctor --session-sqlite inspect --session-sqlite-all-agents\" for details.",
			...recovery.length > 0 ? recovery : []
		].join("\n"));
	}
	if (sessionSqliteReportHasChanges(report)) params.log.info(formatSessionSqliteStartupImportSummary(report));
	if (warningIssues.length > 0) params.log.warn([`session: session SQLite migration warnings:\n${formatStartupIssueLines(warningIssues).map((line) => `- ${line}`).join("\n")}`].join("\n"));
}
async function restoreFailedStartupSessionSqliteRun(params, report, blockingIssues) {
	const manifestPath = report.migrationRun?.manifestPath;
	if (!manifestPath) return report.migrationRun?.failureReportMarkdownPath ? [`Failure report: ${report.migrationRun.failureReportMarkdownPath}`] : [];
	let restoreSessionSqliteMigrationRun = params.deps?.restoreSessionSqliteMigrationRun;
	let writeSessionSqliteMigrationFailureReports = params.deps?.writeSessionSqliteMigrationFailureReports;
	if (!restoreSessionSqliteMigrationRun || !writeSessionSqliteMigrationFailureReports) {
		const doctorModule = await import("./doctor-session-sqlite-Ckz_uvmM.js");
		restoreSessionSqliteMigrationRun ??= doctorModule.restoreSessionSqliteMigrationRun;
		writeSessionSqliteMigrationFailureReports ??= doctorModule.writeSessionSqliteMigrationFailureReports;
	}
	const restore = restoreSessionSqliteMigrationRun({
		manifestPath,
		trustedTargets: report.targets.map(({ agentId, sqlitePath, storePath }) => ({
			agentId,
			sqlitePath,
			storePath
		}))
	});
	const failureReports = writeSessionSqliteMigrationFailureReports(manifestPath, { reason: `startup blocked on ${blockingIssues.length} session SQLite issue(s)` });
	params.log.warn([
		"session: restored archived legacy transcript artifacts after startup SQLite migration failure:",
		`- restored=${restore.restoredFiles.length} skipped=${restore.skippedFiles.length} conflicts=${restore.conflicts.length}`,
		`- failureReport=${failureReports.markdownPath}`
	].join("\n"));
	return [`Restore attempted for current migration run: restored=${restore.restoredFiles.length}, skipped=${restore.skippedFiles.length}, conflicts=${restore.conflicts.length}.`, `Failure report: ${failureReports.markdownPath}`];
}
function collectStartupBlockingIssues(report) {
	return report.targets.flatMap((target) => target.issues.filter((issue) => !isSessionSqliteMigrationWarning(issue)));
}
function collectStartupWarningIssues(report) {
	return report.targets.flatMap((target) => target.issues.filter(isSessionSqliteMigrationWarning));
}
function formatStartupIssueLines(issues) {
	return issues.slice(0, 10).map((issue) => {
		const key = issue.sessionKey ? `${issue.sessionKey}: ` : "";
		return `[${issue.code}] ${key}${issue.message}`;
	});
}
function sessionSqliteReportHasChanges(report) {
	return report.totals.importedEntries > 0 || report.totals.importedTranscriptEvents > 0 || report.totals.archivedTranscriptFiles > 0 || report.totals.archivedUnreferencedJsonlFiles > 0;
}
function formatSessionSqliteStartupImportSummary(report) {
	return [
		"session: imported legacy session metadata/transcripts into SQLite:",
		`- targets=${report.totals.targets} legacyEntries=${report.totals.legacyEntries} sqliteEntries=${report.totals.sqliteEntries}`,
		`- importedEntries=${report.totals.importedEntries} importedTranscriptEvents=${report.totals.importedTranscriptEvents}`,
		`- archivedTranscriptArtifacts=${report.totals.archivedTranscriptFiles} archivedUnreferencedJsonl=${report.totals.archivedUnreferencedJsonlFiles}`
	].join("\n");
}
function isSqliteCorruptionError(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	if (code === "SQLITE_CORRUPT" || code === "SQLITE_NOTADB") return true;
	const message = String(error).toLowerCase();
	return message.includes("database disk image is malformed") || message.includes("not a database");
}
//#endregion
export { runStartupSessionMigration };
