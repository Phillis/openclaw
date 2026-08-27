import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { t as note } from "./note-C_xoKlB9.js";
import { n as readLatestSuccessfulBackupRun, t as readLatestBackupRun } from "./backup-run-records-Bl08gsPZ.js";
//#region src/commands/backup-health.ts
const BACKUP_STALE_AFTER_MS = 336 * 60 * 60 * 1e3;
/** Read backup freshness without creating or repairing an absent state database. */
function readBackupFreshness(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => ({
		latest: readLatestBackupRun(db),
		latestOk: readLatestSuccessfulBackupRun(db)
	}), { env }) ?? {};
}
/** Format the compact status overview value for the latest backup attempt. */
function buildBackupStatusValue(params) {
	const latest = params.freshness.latest;
	if (!latest) return "none recorded";
	const age = params.formatTimeAgo(Math.max(0, (params.now ?? Date.now()) - latest.createdAt));
	return latest.status === "ok" ? `last ok ${age} (${latest.kind}${latest.pushFailed ? ", push failing" : ""})` : `last attempt failed ${age} (${latest.kind})`;
}
/** Build the informational Doctor hint for missing or stale successful backups. */
function buildBackupDoctorHint(params) {
	const latestOk = params.freshness.latestOk;
	if (latestOk?.pushFailed) return ["The newest local Git backup succeeded, but its requested push failed.", `Check the configured Git remote for ${latestOk.archivePath}, then retry the backup.`].join("\n");
	if (!(!latestOk || (params.now ?? Date.now()) - latestOk.createdAt > BACKUP_STALE_AFTER_MS)) return null;
	return [
		latestOk ? "The newest successful backup is more than 14 days old." : "No successful backup is recorded.",
		`Create one now with ${formatCliCommand("openclaw backup create")}.`,
		`Schedule versioned backups with ${formatCliCommand("openclaw backup enable --repository <dir>")}.`
	].join("\n");
}
/** Emit the non-repairing backup freshness hint when it applies. */
function noteBackupDoctorHint(env) {
	const hint = buildBackupDoctorHint({ freshness: readBackupFreshness(env) });
	if (hint) note(hint, "Backups");
}
//#endregion
export { noteBackupDoctorHint as n, readBackupFreshness as r, buildBackupStatusValue as t };
