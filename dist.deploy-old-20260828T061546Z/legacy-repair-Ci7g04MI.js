import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, u as normalizeOptionalStringifiedId } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { D as parseJsonWithJson5Fallback } from "./redact-CWP17HFN.js";
import { m as shortenHomePath } from "./utils-Bw16L5tB.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as formatCliCommand } from "./command-format-HwSAdvXB.js";
import { b as tryResolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { Ln as isSqliteSchemaVersionError, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, Xt as resolveOpenClawStateSqlitePath, Zt as migrateLegacyCronRunLogsToTaskRuns, cn as parseCronRunLogEntryObject, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { t as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { n as TASK_SUGGESTION_TOOL_NAME_MIGRATION, t as IMAGE_INSPECTION_TOOL_NAME_MIGRATION } from "./legacy-tool-name-migration-DciaZaSW.js";
import { v as MEMORY_DREAMING_SYSTEM_EVENT_TEXT } from "./dreaming-14k0XOwK.js";
import { a as loadCronJobsStoreWithConfigJobsReadOnly, f as saveCronJobsStore, i as loadCronJobsStoreWithConfigJobs, l as resolveCronJobsStorePath, p as saveCronJobsStoreWithMetadata, v as saveCronQuarantinedJobs } from "./store-jPtUD1Vb.js";
import { t as cronStoreKey } from "./key-BBZ40bDq.js";
import { t as normalizeHttpWebhookUrl } from "./webhook-url-AutetAqs.js";
import { a as archiveLegacyCronStoreForMigration, c as loadLegacyCronStoreForMigration, i as archiveLegacyCronFile, l as resolveLegacyCronMigrationId, n as cronCodexRuntimePolicyTargetKey, o as assertLegacyCronMigrationSourceCurrent, r as normalizeStoredCronJobs, s as legacyCronStoreFilesExist, t as collectStoredCronCodexRuntimePolicyTargets } from "./store-migration-DnYVcWzo.js";
import { t as planCronCodexRefRewriteAgainstPersistedConfig } from "./runtime-policy-migration-Cyyd2Roz.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/commands/doctor/cron/dreaming-payload-migration.ts
function isManagedDreamingJob(raw) {
	if (normalizeOptionalString(raw.description)?.includes("[managed-by=memory-core.short-term-promotion]")) return true;
	if (normalizeOptionalString(raw.name) !== "Memory Dreaming Promotion") return false;
	const payload = raw.payload ?? void 0;
	const payloadKind = normalizeOptionalLowercaseString(payload?.kind);
	if (payloadKind === "systemevent") return normalizeOptionalString(payload?.text) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
	if (payloadKind === "agentturn") return normalizeOptionalString(payload?.message) === MEMORY_DREAMING_SYSTEM_EVENT_TEXT;
	return false;
}
function isStaleDreamingJob(raw) {
	if (normalizeOptionalLowercaseString(raw.sessionTarget) !== "isolated") return true;
	const payload = raw.payload ?? void 0;
	if (normalizeOptionalLowercaseString(payload?.kind) !== "agentturn") return true;
	if (payload?.lightContext !== true) return true;
	if (normalizeOptionalLowercaseString((raw.delivery ?? void 0)?.mode) !== "none") return true;
	return false;
}
function rewriteDreamingJobShape(raw) {
	raw.sessionTarget = "isolated";
	raw.payload = {
		kind: "agentTurn",
		message: MEMORY_DREAMING_SYSTEM_EVENT_TEXT,
		lightContext: true
	};
	raw.delivery = { mode: "none" };
}
/** Rewrite managed dreaming jobs to the isolated light-context agent-turn shape. */
function migrateLegacyDreamingPayloadShape(jobs) {
	let rewrittenCount = 0;
	for (const raw of jobs) {
		if (!isManagedDreamingJob(raw)) continue;
		if (!isStaleDreamingJob(raw)) continue;
		rewriteDreamingJobShape(raw);
		rewrittenCount += 1;
	}
	return {
		changed: rewrittenCount > 0,
		rewrittenCount
	};
}
/** Count managed dreaming jobs that still need payload/session/delivery migration. */
function countStaleDreamingJobs(jobs) {
	let count = 0;
	for (const raw of jobs) if (isManagedDreamingJob(raw) && isStaleDreamingJob(raw)) count += 1;
	return count;
}
//#endregion
//#region src/commands/doctor/cron/legacy-notify.ts
/** Migrate legacy notify fallback flags into explicit delivery destinations when possible. */
function migrateLegacyNotifyFallback(params) {
	let changed = false;
	const warnings = [];
	const configuredLegacyWebhook = normalizeOptionalString(params.legacyWebhook);
	const legacyWebhook = configuredLegacyWebhook ? normalizeHttpWebhookUrl(configuredLegacyWebhook) : void 0;
	for (const raw of params.jobs) {
		if (!("notify" in raw)) continue;
		const jobName = normalizeOptionalString(raw.name) ?? normalizeOptionalString(raw.id) ?? "<unnamed>";
		if (!(raw.notify === true)) {
			delete raw.notify;
			changed = true;
			continue;
		}
		const delivery = raw.delivery && typeof raw.delivery === "object" && !Array.isArray(raw.delivery) ? raw.delivery : null;
		const mode = normalizeOptionalLowercaseString(delivery?.mode);
		const to = normalizeOptionalString(delivery?.to);
		const hasLegacyChatDelivery = mode === void 0 && delivery !== null && (normalizeOptionalString(delivery.channel) !== void 0 || normalizeOptionalString(delivery.accountId) !== void 0 || "threadId" in delivery || to !== void 0 && !normalizeHttpWebhookUrl(to));
		const completionDestination = delivery?.completionDestination && typeof delivery.completionDestination === "object" && !Array.isArray(delivery.completionDestination) ? delivery.completionDestination : null;
		const completionMode = normalizeOptionalLowercaseString(completionDestination?.mode);
		const completionTo = normalizeOptionalString(completionDestination?.to);
		const validWebhookTo = to ? normalizeHttpWebhookUrl(to) : void 0;
		const validCompletionTo = completionTo ? normalizeHttpWebhookUrl(completionTo) : void 0;
		if (mode === "webhook" && validWebhookTo || completionMode === "webhook" && validCompletionTo) {
			delete raw.notify;
			changed = true;
			continue;
		}
		if (configuredLegacyWebhook && !legacyWebhook) {
			warnings.push(`Automation "${jobName}" still uses legacy notify fallback, but cron.webhook is not a valid HTTP(S) URL so doctor cannot migrate it automatically.`);
			continue;
		}
		if (!legacyWebhook) {
			delete raw.notify;
			changed = true;
			continue;
		}
		if (mode === void 0 && !hasLegacyChatDelivery || mode === "none" || mode === "webhook") {
			raw.delivery = {
				...delivery,
				mode: "webhook",
				to: mode === "none" ? legacyWebhook : validWebhookTo ?? legacyWebhook
			};
			delete raw.notify;
			changed = true;
			continue;
		}
		raw.delivery = {
			...delivery,
			...hasLegacyChatDelivery ? { mode: "announce" } : {},
			completionDestination: {
				...completionDestination,
				mode: "webhook",
				to: legacyWebhook
			}
		};
		delete raw.notify;
		changed = true;
	}
	return {
		changed,
		warnings
	};
}
//#endregion
//#region src/commands/doctor/cron/legacy-quarantine-migration.ts
/** Imports shipped cron quarantine sidecars only through the doctor migration boundary. */
/** Resolves the historical sidecar without making it part of the runtime store API. */
function resolveLegacyCronQuarantinePath(storePath) {
	return storePath.endsWith(".json") ? storePath.replace(/\.json$/, "-quarantine.json") : `${storePath}-quarantine.json`;
}
/** Reads and validates a historical quarantine file without modifying its source. */
async function loadLegacyCronQuarantineForMigration(storePath) {
	const quarantinePath = resolveLegacyCronQuarantinePath(storePath);
	let raw;
	try {
		raw = await fs$1.readFile(quarantinePath, "utf-8");
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	const parsed = parseJsonWithJson5Fallback(raw);
	if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs)) throw new Error(`Unsupported cron quarantine file shape at ${quarantinePath}`);
	const jobs = parsed.jobs.map((entry, index) => {
		if (!isRecord(entry) || typeof entry.reason !== "string" || !isRecord(entry.job) && !("raw" in entry)) throw new Error(`Unsupported cron quarantine entry at ${quarantinePath} index ${index}`);
		const quarantined = {
			quarantinedAtMs: typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs) ? entry.quarantinedAtMs : Date.now(),
			sourceIndex: typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1,
			reason: entry.reason
		};
		if (isRecord(entry.job)) quarantined.job = entry.job;
		if ("raw" in entry) quarantined.raw = entry.raw;
		if (isRecord(entry.state)) quarantined.state = entry.state;
		if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) quarantined.updatedAtMs = entry.updatedAtMs;
		if (typeof entry.scheduleIdentity === "string") quarantined.scheduleIdentity = entry.scheduleIdentity;
		return quarantined;
	});
	return {
		path: quarantinePath,
		sourceSha256: createHash("sha256").update(raw).digest("hex"),
		jobs
	};
}
/** Archives the exact quarantine source already committed to SQLite. */
async function archiveLegacyCronQuarantineForMigration(quarantine) {
	return await archiveLegacyCronFile(quarantine.path, quarantine.sourceSha256);
}
//#endregion
//#region src/commands/doctor/cron/legacy-run-log-migration.ts
const LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX = ".migrated";
function parseCronRunLogEntriesFromJsonl(raw, opts) {
	const entries = [];
	for (const line of raw.split("\n")) {
		const trimmed = line.trim();
		if (!trimmed) continue;
		try {
			const entry = parseCronRunLogEntryObject(JSON.parse(trimmed), opts);
			if (entry) entries.push(entry);
		} catch {}
	}
	return entries;
}
function archiveLegacyCronRunLogSync(filePath) {
	const archivePath = `${filePath}${LEGACY_CRON_RUN_LOG_ARCHIVE_SUFFIX}`;
	if (!fs.existsSync(filePath) || fs.existsSync(archivePath)) return;
	try {
		fs.renameSync(filePath, archivePath);
	} catch {}
}
/** Import legacy per-job JSONL run logs into task_runs and archive migrated files. */
async function migrateLegacyCronRunLogsToSqlite(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
	const jsonlFiles = (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"));
	if (jsonlFiles.length === 0) return { importedFiles: 0 };
	for (const file of jsonlFiles) {
		const filePath = path.join(runsDir, file.name);
		const jobId = path.basename(file.name, ".jsonl");
		const entries = parseCronRunLogEntriesFromJsonl(fs.readFileSync(filePath, "utf-8"), { jobId });
		runOpenClawStateWriteTransaction(({ db }) => {
			db.exec(`
        CREATE TABLE cron_run_logs (
          store_key TEXT NOT NULL,
          job_id TEXT NOT NULL,
          seq INTEGER NOT NULL,
          ts INTEGER NOT NULL,
          entry_json TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          PRIMARY KEY (store_key, job_id, seq)
        ) STRICT;
      `);
			const insert = db.prepare(`INSERT INTO cron_run_logs
          (store_key, job_id, seq, ts, entry_json, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`);
			const storeKey = cronStoreKey(resolvedStorePath);
			for (const [index, entry] of entries.entries()) insert.run(storeKey, jobId, index + 1, entry.ts, JSON.stringify(entry), Date.now());
			migrateLegacyCronRunLogsToTaskRuns(db);
		});
		archiveLegacyCronRunLogSync(filePath);
	}
	return { importedFiles: jsonlFiles.length };
}
/** Return true when legacy cron JSONL run log files exist next to a store path. */
async function legacyCronRunLogFilesExist(storePath) {
	const resolvedStorePath = path.resolve(storePath);
	const runsDir = path.resolve(path.dirname(resolvedStorePath), "runs");
	return (await fs$1.readdir(runsDir, { withFileTypes: true }).catch(() => [])).some((entry) => entry.isFile() && entry.name.endsWith(".jsonl"));
}
//#endregion
//#region src/commands/doctor/cron/migration-ledger.ts
function migrationRunId(source) {
	return `cron-legacy:${source.sourceKey}`;
}
function hasLegacyCronMigrationReceiptInDatabase(db, source) {
	return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("migration_sources").select("status").where("source_key", "=", source.sourceKey))?.status === "completed";
}
function hasLegacyCronMigrationReceipt(source) {
	return hasLegacyCronMigrationReceiptInDatabase(openOpenClawStateDatabase().db, source);
}
function tableExists(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) !== void 0;
}
function hasLegacyCronMigrationReceiptReadOnly(source) {
	const statePath = resolveOpenClawStateSqlitePath(process.env);
	if (!fs.existsSync(statePath)) return false;
	const db = openNodeSqliteDatabase(statePath, { readOnly: true });
	try {
		if (!tableExists(db, "migration_sources")) return false;
		return hasLegacyCronMigrationReceiptInDatabase(db, source);
	} finally {
		db.close();
	}
}
function acquireLegacyCronMigrationReceipt(db, source) {
	if (hasLegacyCronMigrationReceiptInDatabase(db, source)) return false;
	const now = Date.now();
	const runId = migrationRunId(source);
	const reportJson = JSON.stringify({
		source: "legacy-cron-json",
		target: "cron_jobs",
		statePath: source.stateSha256 ? source.statePath : void 0,
		stateSha256: source.stateSha256
	});
	const kysely = getNodeSqliteKysely(db);
	executeSqliteQuerySync(db, kysely.insertInto("migration_runs").values({
		id: runId,
		started_at: now,
		finished_at: now,
		status: "completed",
		report_json: reportJson
	}).onConflict((conflict) => conflict.column("id").doUpdateSet({
		finished_at: now,
		status: "completed",
		report_json: reportJson
	})));
	executeSqliteQuerySync(db, kysely.insertInto("migration_sources").values({
		source_key: source.sourceKey,
		migration_kind: "legacy-cron-json",
		source_path: source.sourcePath,
		target_table: "cron_jobs",
		source_sha256: source.sourceSha256,
		source_size_bytes: source.sourceSizeBytes,
		source_record_count: source.sourceRecordCount,
		last_run_id: runId,
		status: "completed",
		imported_at: now,
		removed_source: 0,
		report_json: reportJson
	}).onConflict((conflict) => conflict.column("source_key").doUpdateSet({
		last_run_id: runId,
		status: "completed",
		imported_at: now,
		removed_source: 0,
		report_json: reportJson
	})));
	return true;
}
function markLegacyCronMigrationSourceRemoved(source) {
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("migration_sources").set({ removed_source: 1 }).where("source_key", "=", source.sourceKey));
	});
}
//#endregion
//#region src/commands/doctor/cron/repair-plan.ts
function pluralize$1(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatJobNameList(names) {
	const preview = names.slice(0, 5).map((name) => `\`${name}\``);
	const remaining = names.length - preview.length;
	return remaining > 0 ? `: ${preview.join(", ")} (+${remaining} more)` : `: ${preview.join(", ")}`;
}
/**
* Advisory for isolated agentTurn cron jobs that describe a command but cannot access shell tools.
* These need operator attention, but `doctor --fix` cannot safely infer whether to grant tool
* access or recreate them as command cron jobs.
*/
function formatUnresolvedCommandPromptAdvisory(names) {
	if (names.length === 0) return null;
	const describeVerb = names.length === 1 ? "describes" : "describe";
	const accessVerb = names.length === 1 ? "lacks" : "lack";
	return [
		`${pluralize$1(names.length, "isolated automation")} ${describeVerb} a shell command in the agent prompt but ${accessVerb} shell/process tool access${formatJobNameList(names)}.`,
		"- This is not the supported shell-tool prompt shape, so doctor cannot prove the job will execute the requested command.",
		"- Recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`) or grant explicit shell/process tool access before relying on it."
	].join("\n");
}
/**
* Advisory for isolated agentTurn cron jobs that drive shell/process tools from the prompt.
* These keep running and are not a legacy store row, so `doctor --fix` cannot rewrite them;
* routing this through the auto-repair preview made the finding persist after every --fix.
*/
function formatUnresolvedShellPromptAdvisory(names) {
	if (names.length === 0) return null;
	const verb = names.length === 1 ? "drives" : "drive";
	const keepVerb = names.length === 1 ? "keeps" : "keep";
	return [
		`${pluralize$1(names.length, "isolated automation")} ${verb} shell/process tools from the agent prompt and ${keepVerb} running as-is${formatJobNameList(names)}.`,
		"- This is a supported shape, not a legacy store row, so the doctor fix path cannot convert it and the finding is informational only.",
		"- For a deterministic run, recreate it as a command automation (`openclaw automations add ... --command \"<shell>\"`)."
	].join("\n");
}
/** Advisory for jobs whose scheduled authority cannot be recovered without a caller decision. */
function formatScheduledToolPolicyAdvisory(params) {
	const lines = [];
	if (params.legacyJobs.length > 0) lines.push(`${pluralize$1(params.legacyJobs.length, "tool-bearing cron job")} ${params.legacyJobs.length === 1 ? "keeps" : "keep"} legacy sender-policy resolution because stored account authority is not provable${formatJobNameList(params.legacyJobs)}.`);
	if (params.invalidJobs.length > 0) lines.push(`${pluralize$1(params.invalidJobs.length, "tool-bearing cron job")} ${params.invalidJobs.length === 1 ? "has" : "have"} invalid or inconsistent scheduled authority provenance${formatJobNameList(params.invalidJobs)}.`);
	if (lines.length === 0) return null;
	lines.push("- These jobs continue through restrictive sender-policy resolution; doctor will not infer authority from delivery or current configuration.", "- Reauthorize with an exact explicit cap: `openclaw cron edit <id> --tools <tool,...>`.");
	return lines.join("\n");
}
/** Advisory for legacy default caps that were captured before configured MCP was final. */
function formatIncompleteInheritedAuthorityAdvisory(names) {
	if (names.length === 0) return null;
	return [
		`${pluralize$1(names.length, "automation")} ${names.length === 1 ? "has" : "have"} an inherited default tool cap captured before final configured-MCP provenance was recorded${formatJobNameList(names)}.`,
		"- The stored finite cap remains unchanged; doctor will not silently widen or rewrite it.",
		"- If the job uses Codex configured MCP, reauthorize in place with an exact explicit list: `openclaw automations edit <id> --tools <tool,...>`."
	].join("\n");
}
/** Convert legacy cron issue counts into doctor preview lines. */
function formatLegacyIssuePreview(issues) {
	const lines = [];
	if (issues.jobId) lines.push(`- ${pluralize$1(issues.jobId, "job")} still uses legacy \`jobId\``);
	if (issues.missingId) lines.push(`- ${pluralize$1(issues.missingId, "job")} is missing a canonical string \`id\``);
	if (issues.nonStringId) lines.push(`- ${pluralize$1(issues.nonStringId, "job")} stores \`id\` as a non-string value`);
	if (issues.legacyScheduleString) lines.push(`- ${pluralize$1(issues.legacyScheduleString, "job")} stores schedule as a bare string`);
	if (issues.legacyScheduleCron) lines.push(`- ${pluralize$1(issues.legacyScheduleCron, "job")} still uses \`schedule.cron\``);
	if (issues.legacyPayloadKind) lines.push(`- ${pluralize$1(issues.legacyPayloadKind, "job")} needs payload kind normalization`);
	if (issues.legacyPayloadCodexModel) lines.push(`- ${pluralize$1(issues.legacyPayloadCodexModel, "job")} still uses legacy \`openai-codex/*\` cron model refs`);
	if (issues.legacyTaskSuggestionToolName) lines.push(`- ${pluralize$1(issues.legacyTaskSuggestionToolName, "job")} still grants legacy tool \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.legacyName}\`; doctor will rename it to \`${TASK_SUGGESTION_TOOL_NAME_MIGRATION.canonicalName}\``);
	if (issues.legacyImageInspectionToolName) lines.push(`- ${pluralize$1(issues.legacyImageInspectionToolName, "job")} still relies on legacy \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.legacyName}\` coverage; doctor will preserve equivalent \`${IMAGE_INSPECTION_TOOL_NAME_MIGRATION.canonicalName}\` access`);
	if (issues.legacyAgentTurnCommandPayload) lines.push(`- ${pluralize$1(issues.legacyAgentTurnCommandPayload, "job")} uses an agent prompt to run a shell command`);
	if (issues.legacyPayloadProvider) lines.push(`- ${pluralize$1(issues.legacyPayloadProvider, "job")} still uses payload \`provider\` as a delivery alias`);
	if (issues.legacyTopLevelPayloadFields) lines.push(`- ${pluralize$1(issues.legacyTopLevelPayloadFields, "job")} still uses top-level payload fields`);
	if (issues.legacyTopLevelDeliveryFields) lines.push(`- ${pluralize$1(issues.legacyTopLevelDeliveryFields, "job")} still uses top-level delivery fields`);
	if (issues.legacyDeliveryMode) lines.push(`- ${pluralize$1(issues.legacyDeliveryMode, "job")} still uses delivery mode \`deliver\``);
	if (issues.migratedScheduledToolPolicy) lines.push(`- ${pluralize$1(issues.migratedScheduledToolPolicy, "job")} can recover scheduled account authority from persisted owner identity`);
	if (issues.invalidSchedule) lines.push(`- ${pluralize$1(issues.invalidSchedule, "job")} has an invalid persisted schedule and will be removed`);
	if (issues.invalidPayload) lines.push(`- ${pluralize$1(issues.invalidPayload, "job")} has an invalid persisted payload and will be removed`);
	return lines;
}
function cronJobMigrationKey(job) {
	return normalizeOptionalStringifiedId(job.id) ?? normalizeOptionalStringifiedId(job.jobId) ?? resolveLegacyCronMigrationId(job);
}
/** Merge legacy JSON jobs into current jobs without duplicating matching ids/jobIds. */
function mergeLegacyCronJobs(params) {
	const merged = [...params.currentJobs];
	const currentKeys = new Set(params.currentJobs.map((job) => cronJobMigrationKey(job)).filter((key) => key !== void 0));
	let importedCount = 0;
	for (const legacyJob of params.legacyJobs) {
		const key = cronJobMigrationKey(legacyJob);
		if (key && currentKeys.has(key)) continue;
		if (key) currentKeys.add(key);
		merged.push(legacyJob);
		importedCount += 1;
	}
	return {
		jobs: merged,
		importedCount
	};
}
/** Attach runtime SQLite state columns back onto a config-defined cron job row. */
function mergeRuntimeEntryIntoConfigJob(params) {
	return {
		...params.job,
		...params.runtimeEntry?.updatedAtMs !== void 0 ? { updatedAtMs: params.runtimeEntry.updatedAtMs } : {},
		...params.runtimeEntry?.state ? { state: structuredClone(params.runtimeEntry.state) } : {}
	};
}
//#endregion
//#region src/commands/doctor/cron/schema-safety.ts
function assertCronStateSchemaSupported(env) {
	withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(() => void 0, { env });
}
function rethrowSqliteSchemaVersionError(error) {
	if (isSqliteSchemaVersionError(error)) throw error;
}
//#endregion
//#region src/commands/doctor/cron/legacy-repair.ts
function pluralize(count, noun) {
	return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
function formatRunLogMigrationNote(importedFiles) {
	return importedFiles > 0 ? ` Imported ${pluralize(importedFiles, "legacy cron run log")} into SQLite.` : "";
}
function readLegacyCronStorePath(cfg) {
	return cfg.cron?.store;
}
function projectCronOwner(job, runtimeDefaultAgentId) {
	const explicitAgentId = normalizeOptionalString(job.agentId) ?? parseAgentSessionKey(normalizeOptionalString(job.sessionKey))?.agentId;
	if (explicitAgentId) return {
		kind: "explicit",
		agentId: explicitAgentId
	};
	return runtimeDefaultAgentId ? {
		kind: "runtime-default",
		agentId: runtimeDefaultAgentId
	} : { kind: "unresolved" };
}
async function loadLegacyCronRepairState(params) {
	const storePath = params.storePath ?? resolveCronJobsStorePath(readLegacyCronStorePath(params.cfg), params.env);
	const legacyStoreDetected = await legacyCronStoreFilesExist(storePath);
	const legacyRunLogDetected = await legacyCronRunLogFilesExist(storePath);
	const legacyQuarantine = await loadLegacyCronQuarantineForMigration(storePath);
	assertCronStateSchemaSupported(params.env);
	if (params.onlyIfLegacyDetected && !legacyStoreDetected && !legacyRunLogDetected && !legacyQuarantine) return null;
	const loaded = params.readOnly ? await loadCronJobsStoreWithConfigJobsReadOnly(storePath, params.env) : await loadCronJobsStoreWithConfigJobs(storePath);
	const runtimeDefaultAgentId = tryResolveAmbientOwnerAgentId(params.cfg);
	const projectedOwnersByJobId = new Map(loaded.store.jobs.map((job) => [job.id, projectCronOwner(job, runtimeDefaultAgentId)]));
	const invalidConfigRows = [...loaded.invalidConfigRows];
	let rawJobs = loaded.configJobs.length > 0 ? loaded.configJobs.map((job, index) => mergeRuntimeEntryIntoConfigJob({
		job,
		runtimeEntry: loaded.configJobRuntimeEntries[index]
	})) : loaded.store.jobs;
	let legacyImportCount = 0;
	let legacyMigrationSource;
	let legacyMigrationAlreadyImported = false;
	if (legacyStoreDetected) {
		const loadedLegacy = await loadLegacyCronStoreForMigration(storePath);
		legacyMigrationSource = loadedLegacy.migrationSource;
		legacyMigrationAlreadyImported = legacyMigrationSource ? params.readOnly ? hasLegacyCronMigrationReceiptReadOnly(legacyMigrationSource) : hasLegacyCronMigrationReceipt(legacyMigrationSource) : false;
		if (!legacyMigrationAlreadyImported) {
			invalidConfigRows.push(...loadedLegacy.invalidConfigRows);
			const merged = mergeLegacyCronJobs({
				currentJobs: rawJobs,
				legacyJobs: loadedLegacy.store.jobs
			});
			rawJobs = merged.jobs;
			legacyImportCount = merged.importedCount;
		}
	}
	return {
		storePath,
		legacyStoreDetected,
		legacyRunLogDetected,
		legacyQuarantine,
		legacyMigrationSource,
		legacyMigrationAlreadyImported,
		legacyImportCount,
		invalidConfigRows,
		projectedOwnersByJobId,
		rawJobs
	};
}
async function applyLegacyCronStoreRepair(params) {
	assertCronStateSchemaSupported();
	const { state } = params;
	const changes = [];
	const warnings = [];
	const runtimePolicyPlan = params.migrateCodexModelRefs === true ? planCronCodexRefRewriteAgainstPersistedConfig({
		cfg: params.cfg,
		targets: collectStoredCronCodexRuntimePolicyTargets(state.rawJobs),
		blockedModelIdentities: params.blockedModelIdentities
	}) : void 0;
	warnings.push(...runtimePolicyPlan?.warnings ?? []);
	const blockedRuntimePolicyTargets = new Set((runtimePolicyPlan?.blockedTargets ?? []).map(cronCodexRuntimePolicyTargetKey));
	const normalized = params.normalized ?? normalizeStoredCronJobs(state.rawJobs, {
		migrateCodexModelRefs: params.migrateCodexModelRefs,
		shouldMigrateCodexRuntimePolicyTarget: (target) => !blockedRuntimePolicyTargets.has(cronCodexRuntimePolicyTargetKey(target))
	});
	warnings.push(...normalized.unsupportedLegacyTriggerScriptJobs.map((job) => `Cron trigger script for ${job} uses legacy Code Mode APIs that cannot be safely converted; inspect the automation and update its trigger script manually to use direct tool calls.`));
	const legacyWebhook = normalizeOptionalString(params.cfg.cron?.webhook);
	const notifyMigration = migrateLegacyNotifyFallback({
		jobs: state.rawJobs,
		legacyWebhook
	});
	const dreamingMigration = migrateLegacyDreamingPayloadShape(state.rawJobs);
	warnings.push(...notifyMigration.warnings);
	const storeChanged = state.legacyStoreDetected && !state.legacyMigrationAlreadyImported || state.invalidConfigRows.length > 0 || normalized.mutated || notifyMigration.changed || dreamingMigration.changed;
	if (!(state.legacyStoreDetected || state.legacyRunLogDetected || state.legacyQuarantine !== void 0 || storeChanged) && warnings.length === 0) return {
		changes,
		warnings
	};
	const quarantineEntries = [
		...state.legacyQuarantine?.jobs ?? [],
		...state.invalidConfigRows,
		...normalized.removedJobs.map((entry) => ({
			sourceIndex: entry.sourceIndex,
			reason: entry.reason,
			job: entry.job
		}))
	];
	const quarantine = quarantineEntries.length > 0 ? {
		entries: quarantineEntries,
		nowMs: Date.now()
	} : void 0;
	if (storeChanged || quarantine) try {
		if (storeChanged) {
			const store = {
				version: 1,
				jobs: state.rawJobs
			};
			const migrationSource = state.legacyMigrationSource;
			if (migrationSource && !state.legacyMigrationAlreadyImported) {
				await assertLegacyCronMigrationSourceCurrent(migrationSource);
				await saveCronJobsStoreWithMetadata(state.storePath, store, (db) => acquireLegacyCronMigrationReceipt(db, migrationSource), quarantine);
			} else await saveCronJobsStore(state.storePath, store, quarantine ? { quarantine } : void 0);
		} else if (quarantine) saveCronQuarantinedJobs({
			storePath: state.storePath,
			...quarantine
		});
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			changes,
			warnings: [...warnings, `Failed writing migrated cron store at ${shortenHomePath(state.storePath)}: ${formatErrorMessage(err)}`]
		};
	}
	if (state.legacyQuarantine) {
		const archiveResult = await archiveLegacyCronQuarantineForMigration(state.legacyQuarantine);
		if (archiveResult.ok) changes.push(`Cron quarantine migrated to SQLite from ${shortenHomePath(state.legacyQuarantine.path)}.`);
		else warnings.push(`Migrated quarantined automations to SQLite but could not archive the legacy cron file at ${shortenHomePath(state.legacyQuarantine.path)}: ${archiveResult.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`);
	}
	let importedRunLogs = 0;
	if (state.legacyRunLogDetected) try {
		importedRunLogs = (await migrateLegacyCronRunLogsToSqlite(state.storePath)).importedFiles;
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		warnings.push(`Failed importing legacy cron run logs at ${shortenHomePath(state.storePath)}: ${formatErrorMessage(err)}`);
	}
	if (state.legacyStoreDetected) {
		const archiveResult = await archiveLegacyCronStoreForMigration(state.storePath, state.legacyMigrationSource);
		if (archiveResult.ok) {
			if (state.legacyMigrationSource) try {
				markLegacyCronMigrationSourceRemoved(state.legacyMigrationSource);
			} catch (err) {
				rethrowSqliteSchemaVersionError(err);
				warnings.push(`Cron store was archived, but its migration receipt could not be finalized: ${formatErrorMessage(err)}`);
			}
			changes.push(`Cron store migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`);
		} else for (const failure of archiveResult.failures) warnings.push(`Migrated automations to SQLite but could not archive the legacy cron file at ${shortenHomePath(failure.path)}: ${failure.reason}. Remove it manually or rerun ${formatCliCommand("openclaw doctor --fix")} to retry.`);
	} else if (state.legacyRunLogDetected && importedRunLogs > 0) changes.push(`Cron run logs migrated to SQLite at ${shortenHomePath(state.storePath)}.${formatRunLogMigrationNote(importedRunLogs)}`);
	else if (storeChanged) changes.push(`Cron store normalized at ${shortenHomePath(state.storePath)}.`);
	if (dreamingMigration.rewrittenCount > 0) changes.push(`Rewrote ${pluralize(dreamingMigration.rewrittenCount, "managed dreaming job")} to run as an isolated agent turn so dreaming no longer requires heartbeat.`);
	if (normalized.legacyTriggerScriptJobs.length > 0) changes.push(`Rewrote ${pluralize(normalized.legacyTriggerScriptJobs.length, "legacy cron trigger script")} to canonical direct tool calls: ${normalized.legacyTriggerScriptJobs.join(", ")}.`);
	return {
		changes,
		warnings,
		codexRuntimePolicyTargets: normalized.codexRuntimePolicyTargets
	};
}
async function repairLegacyCronStoreWithoutPrompt(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	let state;
	try {
		state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			onlyIfLegacyDetected: true
		});
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading legacy cron storage at ${shortenHomePath(storePath)}: ${formatErrorMessage(err)}`]
		};
	}
	if (!state) return {
		changes: [],
		warnings: []
	};
	return await applyLegacyCronStoreRepair({
		...params,
		state
	});
}
/** Read legacy Codex cron targets without changing either cron storage or config. */
async function collectCronCodexRuntimePolicyTargetsReadOnly(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		const state = await loadLegacyCronRepairState({
			cfg: params.cfg,
			readOnly: true
		});
		return {
			targets: state ? collectStoredCronCodexRuntimePolicyTargets(state.rawJobs) : [],
			warnings: []
		};
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			targets: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while planning Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
/** Commit Codex cron refs only after their model-scoped config policy is durable. */
async function repairCronCodexModelRefsAfterConfigWrite(params) {
	const storePath = resolveCronJobsStorePath(normalizeOptionalString(readLegacyCronStorePath(params.cfg)));
	try {
		const state = await loadLegacyCronRepairState({ cfg: params.cfg });
		return state ? await applyLegacyCronStoreRepair({
			cfg: params.cfg,
			state,
			migrateCodexModelRefs: true,
			blockedModelIdentities: params.blockedModelIdentities
		}) : {
			changes: [],
			warnings: []
		};
	} catch (err) {
		rethrowSqliteSchemaVersionError(err);
		return {
			changes: [],
			warnings: [`Failed reading cron storage at ${shortenHomePath(storePath)} while committing Codex model migration: ${formatErrorMessage(err)}`]
		};
	}
}
//#endregion
export { repairLegacyCronStoreWithoutPrompt as a, formatLegacyIssuePreview as c, formatUnresolvedShellPromptAdvisory as d, countStaleDreamingJobs as f, repairCronCodexModelRefsAfterConfigWrite as i, formatScheduledToolPolicyAdvisory as l, collectCronCodexRuntimePolicyTargetsReadOnly as n, rethrowSqliteSchemaVersionError as o, loadLegacyCronRepairState as r, formatIncompleteInheritedAuthorityAdvisory as s, applyLegacyCronStoreRepair as t, formatUnresolvedCommandPromptAdvisory as u };
