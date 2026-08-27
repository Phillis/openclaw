import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as readFileDescriptorBoundedSync } from "./boundary-file-read-BoOq_oud.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./agent-scope-BizOtGGz.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { y as tryResolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import "./session-key-D8GLfPr_.js";
import { i as resolveSessionFilePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { n as replaceFileAtomicSync } from "./replace-file-BafkybJJ.js";
import "./replace-file-sXUFaaUi.js";
import { Et as array, Rn as string, Tn as object, Xn as union, dn as literal, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as VERSION } from "./version-o4XN9fka.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { f as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db.paths-DmtKty-F.js";
import { _n as getCanonicalSqliteNamedIndexContracts, yt as resolveSqliteDatabaseFilePaths } from "./openclaw-state-db-DlCMR4eQ.js";
import { r as assertSqliteIntegrity } from "./sqlite-strict-BaSF4bDz.js";
import "./config-Dl8DJbzM.js";
import { i as closeOpenClawAgentDatabaseByPath, p as isOpenClawAgentDatabaseOpen, r as clearOpenClawAgentDatabaseOpenFailure } from "./openclaw-agent-db-lxLIE6rA.js";
import { D as ensureOpenClawAgentDatabasePermissions, b as OPENCLAW_AGENT_SCHEMA_SQL, r as migrateOpenClawAgentDatabaseForMaintenance, t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-B1somIwL.js";
import { a as resolveStoredSessionOwnerAgentId } from "./session-store-key-CoZdm5gl.js";
import { a as resolveAllAgentSessionStoreCandidateTargetsSync, c as resolveSessionStoreTargets, i as resolveAgentSessionStoreTargetsSync, o as resolveAllAgentSessionStoreTargetsSync } from "./targets-DxP0vsft.js";
import { a as normalizeStoreSessionKey } from "./store-entry-iif-1PcC.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { i as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DH7-Rfwr.js";
import { n as normalizeLegacySessionEntryDelivery } from "./state-migrations.legacy-session-store-CDBAEZp2.js";
import { t as importSqliteSessionRows } from "./session-accessor.sqlite-import-tIYTnNgx.js";
import { n as assertDoctorSqliteMaintenancePathsNotAliased, r as isDestructiveDoctorSessionSqliteMode } from "./doctor-sqlite-maintenance-lock-mAgCgc2I.js";
import { a as readOnlySqliteExactSessionEntry, d as readSqliteEntryCount, f as resolveTargetSqlitePath, i as readOnlySqliteDbStats, n as createTranscriptEventPrefixReader, o as readOnlySqliteSessionEntries, r as createTranscriptEventReader, s as readOnlySqliteTranscriptEventCount, t as countTranscriptEventsForPath } from "./doctor-session-sqlite-readers-BXGg_eg3.js";
import { t as compactDoctorSqliteFile } from "./doctor-sqlite-compact-DjST4kXL.js";
import { i as sumDoctorSessionSqliteTargets, n as createDoctorSessionSqliteTotals, r as isSessionSqliteMigrationWarning, t as createDoctorSessionSqliteTargetReport } from "./doctor-session-sqlite-types-DDjJUvI3.js";
import { createHash, randomUUID } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
//#region src/commands/doctor-session-sqlite-compact.ts
/** Runs doctor-owned SQLite file compaction for migrated session stores. */
/** Reclaim free pages from one agent session SQLite database. */
function compactDoctorSessionSqliteTarget(target, options = {}) {
	const sqlitePath = resolveTargetSqlitePath(target);
	const beforeFileSizes = readSqliteFileSizes(sqlitePath);
	const stat = readSessionDatabaseStat(sqlitePath);
	if (!stat) return {
		dbSizeAfterBytes: 0,
		dbSizeBeforeBytes: 0,
		freelistAfterPages: 0,
		freelistBeforePages: 0,
		pageSizeBytes: 0,
		reclaimedBytes: 0,
		skipped: true,
		walSizeAfterBytes: beforeFileSizes.walSizeBytes,
		walSizeBeforeBytes: beforeFileSizes.walSizeBytes
	};
	if (!stat.isFile()) throw new Error(`OpenClaw agent database is not a regular file: ${sqlitePath}`);
	if (isOpenClawAgentDatabaseOpen(sqlitePath)) throw new Error(`OpenClaw agent database ${sqlitePath} is already open in this process. Stop OpenClaw and retry.`);
	const requireQuarantineCleared = () => {
		if (!clearOpenClawAgentDatabaseOpenFailure(sqlitePath, { env: options.env })) throw new Error(`OpenClaw agent database ${sqlitePath} was repaired, but its persisted quarantine record could not be cleared. Rerun openclaw doctor --fix so the database is not refused again.`);
	};
	if (options.migrateOlderSchema) {
		migrateOpenClawAgentDatabaseForMaintenance({
			agentId: target.agentId,
			pathname: sqlitePath
		});
		requireQuarantineCleared();
	}
	const compact = compactDoctorSqliteFile({
		afterSuccess: () => {
			requireQuarantineCleared();
			ensureOpenClawAgentDatabasePermissions(sqlitePath, {
				agentId: target.agentId,
				path: sqlitePath
			});
		},
		sqlitePath,
		validateBeforeMutation: (database) => assertOpenClawAgentDatabaseForMaintenance(database, {
			agentId: target.agentId,
			pathname: sqlitePath
		})
	});
	return {
		dbSizeAfterBytes: compact.after.dbSizeBytes,
		dbSizeBeforeBytes: compact.before.dbSizeBytes,
		freelistAfterPages: compact.after.freelistPages,
		freelistBeforePages: compact.before.freelistPages,
		pageSizeBytes: compact.before.pageSizeBytes || compact.after.pageSizeBytes,
		reclaimedBytes: compact.reclaimedBytes,
		skipped: false,
		walSizeAfterBytes: compact.after.walSizeBytes,
		walSizeBeforeBytes: compact.before.walSizeBytes
	};
}
function readSessionDatabaseStat(sqlitePath) {
	try {
		return fs.lstatSync(sqlitePath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSqliteFileSizes(sqlitePath) {
	return {
		dbSizeBytes: fileSize(sqlitePath),
		walSizeBytes: fileSize(`${sqlitePath}-wal`)
	};
}
function fileSize(filePath) {
	try {
		return fs.statSync(filePath).size;
	} catch {
		return 0;
	}
}
//#endregion
//#region src/commands/doctor-session-sqlite-migration-run.ts
/** Manifest and restore helpers for doctor-owned session SQLite migrations. */
const SESSION_SQLITE_MIGRATION_RUNS_DIR = "session-sqlite-migration-runs";
const COMPLETED_MIGRATION_RUN_RETENTION = 50;
const RESTORE_ARCHIVE_HASH_CHUNK_BYTES = 64 * 1024;
const AbsolutePathSchema = string().min(1).refine((value) => !value.includes("\0") && path.isAbsolute(value)).transform((value) => path.resolve(value));
const MigrationMoveSchema = object({
	archivePath: AbsolutePathSchema,
	kind: _enum([
		"legacy-store",
		"transcript",
		"trajectory",
		"unreferenced-jsonl"
	]),
	sessionKey: string().optional(),
	sourcePath: AbsolutePathSchema
});
const MigrationIssueSchema = object({
	code: string().min(1),
	message: string(),
	sessionKey: string().optional()
});
const RestoreConflictSchema = object({
	archivePath: AbsolutePathSchema,
	reason: string(),
	sourcePath: AbsolutePathSchema
});
const MigrationTargetSchema = object({
	agentId: string().min(1),
	completedMoves: array(MigrationMoveSchema),
	issues: array(MigrationIssueSchema),
	plannedMoves: array(MigrationMoveSchema),
	sqlitePath: AbsolutePathSchema,
	storePath: AbsolutePathSchema,
	validationBeforeArchive: _enum([
		"not_run",
		"passed",
		"failed"
	])
}).superRefine((target, context) => {
	const plannedMoveKeys = /* @__PURE__ */ new Set();
	for (const move of target.plannedMoves) {
		if (!isRestoreMoveWithinTarget(move, target)) context.addIssue({
			code: "custom",
			message: "restore move is outside target paths"
		});
		const moveKey = migrationMoveKey(move);
		if (plannedMoveKeys.has(moveKey)) context.addIssue({
			code: "custom",
			message: "duplicate planned restore move"
		});
		plannedMoveKeys.add(moveKey);
	}
	const completedMoveKeys = /* @__PURE__ */ new Set();
	for (const move of target.completedMoves) {
		const moveKey = migrationMoveKey(move);
		if (!isRestoreMoveWithinTarget(move, target) || !plannedMoveKeys.has(moveKey) || completedMoveKeys.has(moveKey)) context.addIssue({
			code: "custom",
			message: "invalid completed restore move"
		});
		completedMoveKeys.add(moveKey);
	}
});
const MigrationManifestSchema = object({
	completedAt: string().optional(),
	failedAt: string().optional(),
	failureReports: object({
		jsonPath: AbsolutePathSchema,
		markdownPath: AbsolutePathSchema
	}).optional(),
	manifestVersion: union([literal(1), literal(2)]),
	openClawVersion: string().min(1),
	restore: object({
		attemptedAt: string().min(1),
		consumedArchives: array(AbsolutePathSchema).optional(),
		conflicts: array(RestoreConflictSchema),
		restoredFiles: array(AbsolutePathSchema),
		skippedFiles: array(AbsolutePathSchema),
		status: _enum([
			"restored",
			"partial",
			"conflicts",
			"failed",
			"noop"
		])
	}).optional(),
	runId: string().min(1),
	startedAt: string().min(1),
	targets: array(MigrationTargetSchema)
}).superRefine((manifest, context) => {
	const targetKeys = /* @__PURE__ */ new Set();
	for (const target of manifest.targets) {
		const targetKey = sessionSqliteMigrationTargetKey(target);
		if (targetKeys.has(targetKey)) context.addIssue({
			code: "custom",
			message: "duplicate migration target"
		});
		targetKeys.add(targetKey);
	}
});
function createSessionSqliteMigrationRun(env, targets) {
	for (const target of targets) assertSafeMigrationTargetTopology(target);
	const runId = `session-sqlite-${Date.now()}-${randomUUID().slice(0, 8)}`;
	const manifestPath = path.join(resolveSessionSqliteMigrationRunsDir(env), `${runId}.json`);
	const activeRun = {
		manifest: {
			manifestVersion: 2,
			openClawVersion: VERSION,
			runId,
			startedAt: (/* @__PURE__ */ new Date()).toISOString(),
			targets: targets.map((target) => ({
				...normalizeMigrationTarget(target),
				completedMoves: [],
				issues: [],
				plannedMoves: [],
				validationBeforeArchive: "not_run"
			}))
		},
		manifestPath
	};
	writeSessionSqliteMigrationManifest(activeRun);
	pruneCompletedSessionSqliteMigrationRuns(env);
	return activeRun;
}
function resolveSessionSqliteMigrationRunsDir(env) {
	return path.join(resolveStateDir(env), SESSION_SQLITE_MIGRATION_RUNS_DIR);
}
function writeSessionSqliteMigrationManifest(activeRun) {
	fs.mkdirSync(path.dirname(activeRun.manifestPath), {
		recursive: true,
		mode: 448
	});
	replaceFileAtomicSync({
		filePath: activeRun.manifestPath,
		content: `${JSON.stringify(activeRun.manifest, null, 2)}\n`,
		dirMode: 448,
		mode: 384,
		tempPrefix: path.basename(activeRun.manifestPath)
	});
}
function updateMigrationManifestTarget(activeRun, target, issues, updates = {}) {
	const manifestTarget = findMigrationManifestTarget(activeRun, target);
	if (!activeRun || !manifestTarget) return;
	manifestTarget.issues = issues.map((issue) => ({ ...issue }));
	if (updates.validationBeforeArchive) manifestTarget.validationBeforeArchive = updates.validationBeforeArchive;
	writeSessionSqliteMigrationManifest(activeRun);
}
function recordPlannedMigrationMove(activeRun, target, move) {
	recordPlannedMigrationMoves(activeRun, target, [move]);
}
function recordPlannedMigrationMoves(activeRun, target, moves) {
	recordMigrationMoves(activeRun, target, "plannedMoves", moves);
}
function recordCompletedMigrationMove(activeRun, target, move) {
	recordCompletedMigrationMoves(activeRun, target, [move]);
}
function recordCompletedMigrationMoves(activeRun, target, moves) {
	recordMigrationMoves(activeRun, target, "completedMoves", moves);
}
function recordMigrationMoves(activeRun, target, listKey, moves) {
	const manifestTarget = findMigrationManifestTarget(activeRun, target);
	if (!activeRun || !manifestTarget || moves.length === 0) return;
	const targetMoves = manifestTarget[listKey];
	const knownMoves = new Set(targetMoves.map(migrationMoveKey));
	let changed = false;
	for (const move of moves) {
		const normalizedMove = normalizeMigrationMove(move);
		const key = migrationMoveKey(normalizedMove);
		if (knownMoves.has(key)) continue;
		knownMoves.add(key);
		targetMoves.push(normalizedMove);
		changed = true;
	}
	if (changed) writeSessionSqliteMigrationManifest(activeRun);
}
function migrationMoveKey(move) {
	return `${move.sourcePath}\u0000${move.archivePath}`;
}
function restoreSessionSqliteMigrationRuns(params) {
	const restoreReport = emptyRestoreReport();
	const contexts = loadRestoreManifestContexts(listSessionSqliteMigrationManifestPaths(params.env).toReversed(), params.trustedTargets);
	const restorePlan = createRestorePlan(contexts);
	for (const { manifest, manifestPath, targets } of contexts) {
		const manifestRestoreReport = {
			...emptyRestoreReport(),
			manifestPaths: [manifestPath]
		};
		restoreReport.manifestPaths.push(manifestPath);
		restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, manifestRestoreReport, restorePlan);
		restoreReport.conflicts.push(...manifestRestoreReport.conflicts);
		restoreReport.restoredFiles.push(...manifestRestoreReport.restoredFiles);
		restoreReport.skippedFiles.push(...manifestRestoreReport.skippedFiles);
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
	return restoreReport;
}
function loadRestoreManifestContexts(manifestPaths, trustedTargets) {
	const contexts = [];
	for (const manifestPath of manifestPaths) {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		if (!manifest) continue;
		const targets = filterRestoreManifestTargets(manifest, trustedTargets);
		if (targets.length > 0) contexts.push({
			manifest,
			manifestPath,
			targets
		});
	}
	return contexts;
}
/**
* Resolve every duplicate destination before moving an archive. A missing archive only disappears
* from the conflict set when its own manifest proves that an earlier restore consumed it.
*/
function createRestorePlan(contexts) {
	const plan = /* @__PURE__ */ new Map();
	const candidatesBySource = /* @__PURE__ */ new Map();
	for (const context of contexts) {
		const consumedArchives = collectRecordedConsumedArchives(context.manifest);
		for (const target of context.targets) for (const move of uniqueRestoreMoves(target)) {
			const candidates = candidatesBySource.get(move.sourcePath) ?? [];
			candidates.push({
				consumed: consumedArchives.has(move.archivePath),
				context,
				move
			});
			candidatesBySource.set(move.sourcePath, candidates);
		}
	}
	for (const [sourcePath, candidates] of candidatesBySource) {
		if (fs.existsSync(sourcePath) || candidates.length === 1) {
			for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), { action: "standard" });
			continue;
		}
		const available = [];
		let blocked = false;
		for (const candidate of candidates) {
			const key = restoreMovePlanKey(candidate.context.manifestPath, candidate.move);
			const inspection = inspectRestoreArchive(candidate.move);
			if (inspection.state === "available") {
				available.push({
					...candidate,
					snapshot: inspection.snapshot
				});
				continue;
			}
			if (inspection.state === "missing" && candidate.consumed) {
				plan.set(key, { action: "skip-consumed" });
				continue;
			}
			blocked = true;
			plan.set(key, {
				action: "conflict",
				reason: inspection.state === "missing" ? "archive is missing without a recorded prior restore; refusing another candidate" : inspection.reason
			});
		}
		if (blocked) {
			for (const candidate of available) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
				action: "conflict",
				reason: "another archive for this source is unavailable without prior restore evidence; refusing automatic selection"
			});
			continue;
		}
		if (available.length === 0) continue;
		if (new Set(available.map((candidate) => candidate.move.kind)).size !== 1) {
			setRestoreCandidateConflicts(plan, available, "recorded archives disagree on artifact kind; refusing automatic selection");
			continue;
		}
		const winner = selectRestoreCandidate(available);
		if (!winner) {
			setRestoreCandidateConflicts(plan, available, available[0]?.move.kind === "legacy-store" ? "multiple distinct nonempty session indexes require explicit archive selection" : "multiple distinct archives require explicit archive selection");
			continue;
		}
		for (const candidate of available) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), candidate === winner ? {
			action: "restore",
			snapshot: candidate.snapshot
		} : { action: "skip-superseded" });
	}
	return plan;
}
function selectRestoreCandidate(candidates) {
	if (new Set(candidates.map((candidate) => candidate.snapshot.digest)).size === 1) return candidates[0];
	if (candidates[0]?.move.kind !== "legacy-store") return;
	const nonemptyDigests = new Set(candidates.filter((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0).map((candidate) => candidate.snapshot.digest));
	if (nonemptyDigests.size === 0) return candidates[0];
	return nonemptyDigests.size === 1 ? candidates.find((candidate) => (candidate.snapshot.legacyEntryCount ?? 0) > 0) : void 0;
}
function setRestoreCandidateConflicts(plan, candidates, reason) {
	for (const candidate of candidates) plan.set(restoreMovePlanKey(candidate.context.manifestPath, candidate.move), {
		action: "conflict",
		reason
	});
}
function restoreMovePlanKey(manifestPath, move) {
	return `${manifestPath}\u0000${migrationMoveKey(move)}`;
}
function collectRecordedConsumedArchives(manifest) {
	const consumed = new Set(manifest.restore?.consumedArchives ?? []);
	const restoredSources = new Set(manifest.restore?.restoredFiles ?? []);
	if (restoredSources.size === 0) return consumed;
	const movesBySource = /* @__PURE__ */ new Map();
	for (const target of manifest.targets) for (const move of uniqueRestoreMoves(target)) {
		const moves = movesBySource.get(move.sourcePath) ?? [];
		moves.push(move);
		movesBySource.set(move.sourcePath, moves);
	}
	for (const sourcePath of restoredSources) {
		const moves = movesBySource.get(sourcePath);
		const move = moves?.length === 1 ? moves[0] : void 0;
		if (move) consumed.add(move.archivePath);
	}
	return consumed;
}
function hashRestoreArchive(fd, size) {
	const hash = createHash("sha256");
	const buffer = Buffer.allocUnsafe(RESTORE_ARCHIVE_HASH_CHUNK_BYTES);
	let offset = 0;
	while (offset < size) {
		const read = fs.readSync(fd, buffer, 0, Math.min(buffer.length, size - offset), offset);
		if (read === 0) throw new Error("archive changed while it was inspected");
		hash.update(buffer.subarray(0, read));
		offset += read;
	}
	return hash.digest("hex");
}
function inspectRestoreArchive(move) {
	if (hasSymbolicLinkInDirectoryPath(path.dirname(move.archivePath))) return {
		state: "invalid",
		reason: "archive parent is a symbolic link; refusing restore"
	};
	let pathStat;
	try {
		pathStat = fs.lstatSync(move.archivePath);
	} catch (error) {
		const code = error.code;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be inspected; refusing restore"
		};
	}
	if (!pathStat.isFile()) return {
		state: "invalid",
		reason: "archive is not a regular file; refusing restore"
	};
	let fd;
	try {
		const flags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0) | (fs.constants.O_NONBLOCK ?? 0);
		fd = fs.openSync(move.archivePath, flags);
		const descriptorStat = fs.fstatSync(fd);
		if (!descriptorStat.isFile() || descriptorStat.dev !== pathStat.dev || descriptorStat.ino !== pathStat.ino) return {
			state: "invalid",
			reason: "archive changed while it was inspected; refusing restore"
		};
		let digest;
		let legacyEntryCount;
		if (move.kind === "legacy-store") {
			const content = readFileDescriptorBoundedSync(fd, descriptorStat.size);
			digest = createHash("sha256").update(content).digest("hex");
			let parsed;
			try {
				parsed = JSON.parse(content.toString("utf-8"));
			} catch {
				return {
					state: "invalid",
					reason: "session index archive is not valid JSON; refusing automatic selection"
				};
			}
			if (!isRecord(parsed)) return {
				state: "invalid",
				reason: "session index archive is not a JSON object; refusing automatic selection"
			};
			legacyEntryCount = Object.keys(parsed).length;
		} else digest = hashRestoreArchive(fd, descriptorStat.size);
		const finalPathStat = fs.lstatSync(move.archivePath);
		if (finalPathStat.dev !== descriptorStat.dev || finalPathStat.ino !== descriptorStat.ino || finalPathStat.size !== descriptorStat.size) return {
			state: "invalid",
			reason: "archive changed while it was inspected; refusing restore"
		};
		return {
			state: "available",
			snapshot: {
				digest,
				...legacyEntryCount === void 0 ? {} : { legacyEntryCount },
				size: descriptorStat.size
			}
		};
	} catch (error) {
		const code = error.code;
		return code === "ENOENT" || code === "ENOTDIR" ? { state: "missing" } : {
			state: "invalid",
			reason: "archive could not be read safely; refusing restore"
		};
	} finally {
		if (fd !== void 0) fs.closeSync(fd);
	}
}
function restoreSessionSqliteMigrationRun(params) {
	const restoreReport = {
		...emptyRestoreReport(),
		manifestPaths: [params.manifestPath]
	};
	const manifest = readSessionSqliteMigrationManifest(params.manifestPath);
	if (!manifest) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest is missing or unreadable",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	const targetManifests = filterRestoreManifestTargets(manifest, params.trustedTargets);
	if (targetManifests.length === 0) {
		restoreReport.conflicts.push({
			archivePath: params.manifestPath,
			reason: "manifest does not match a trusted session target",
			sourcePath: params.manifestPath
		});
		return restoreReport;
	}
	restoreSessionSqliteMigrationManifest(manifest, params.manifestPath, targetManifests, restoreReport, createRestorePlan([{
		manifest,
		manifestPath: params.manifestPath,
		targets: targetManifests
	}]));
	writeSessionSqliteMigrationManifest({
		manifest,
		manifestPath: params.manifestPath
	});
	return restoreReport;
}
function findLatestFailedSessionSqliteMigrationManifest(env, trustedTargets) {
	return listSessionSqliteMigrationManifestPaths(env).map((manifestPath) => {
		const manifest = readSessionSqliteMigrationManifest(manifestPath);
		return {
			manifest,
			manifestPath,
			targets: manifest ? filterRestoreManifestTargets(manifest, trustedTargets) : []
		};
	}).filter((item) => item.manifest !== void 0 && isFailedSessionSqliteMigrationManifest(item.manifest) && item.targets.length > 0).toSorted((left, right) => manifestSortTime(right.manifest) - manifestSortTime(left.manifest))[0];
}
function writeSessionSqliteMigrationFailureReports(manifestPath, params) {
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	const jsonPath = manifestPath.replace(/\.json$/, ".failure.json");
	const markdownPath = manifestPath.replace(/\.json$/, ".failure.md");
	const payload = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		manifestPath: sanitizeFailureReportText(shortenFailureReportPath(manifestPath)),
		reason: params.reason,
		recoveryCommand: "openclaw doctor --session-sqlite recover --github-issue",
		restoreStatus: manifest?.restore?.status ?? "not_attempted",
		runId: manifest?.runId ?? path.basename(manifestPath, ".json"),
		targets: manifest?.targets.map((target) => ({
			agentId: sanitizeFailureReportText(target.agentId),
			completedMoves: target.completedMoves.length,
			issues: target.issues.map((issue) => ({
				code: issue.code,
				message: sanitizeFailureIssueMessage(issue, target),
				...issue.sessionKey ? { sessionKey: redactSessionKey(issue.sessionKey) } : {}
			})),
			plannedMoves: target.plannedMoves.length,
			sqlitePath: sanitizeFailureReportText(shortenFailureReportPath(target.sqlitePath)),
			storePath: sanitizeFailureReportText(shortenFailureReportPath(target.storePath)),
			validationBeforeArchive: target.validationBeforeArchive
		})) ?? [],
		version: VERSION
	};
	fs.writeFileSync(jsonPath, `${JSON.stringify(payload, null, 2)}\n`, { mode: 384 });
	fs.writeFileSync(markdownPath, renderFailureMarkdown(payload), { mode: 384 });
	if (manifest) {
		manifest.failureReports = {
			jsonPath,
			markdownPath
		};
		writeSessionSqliteMigrationManifest({
			manifest,
			manifestPath
		});
	}
	return {
		jsonPath,
		markdownPath
	};
}
function createSessionSqliteMigrationFailureIssue(manifestPath, trustedTargets) {
	const manifest = readSessionSqliteMigrationManifest(manifestPath);
	if (!manifest) return;
	const title = `Session SQLite migration recovery report (${manifest.runId})`;
	const bodyPath = manifest.failureReports?.markdownPath;
	const targets = trustedTargets ? filterRestoreManifestTargets(manifest, trustedTargets) : manifest.targets;
	const boundedBody = truncateUtf16Safe([
		"OpenClaw doctor generated this sanitized report from a local session SQLite migration recovery.",
		"",
		renderFailureMarkdown({
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			manifestPath: sanitizeFailureReportText(shortenFailureReportPath(manifestPath)),
			reason: "session SQLite migration failed",
			recoveryCommand: "openclaw doctor --session-sqlite recover --github-issue",
			restoreStatus: manifest.restore?.status ?? "not_attempted",
			runId: manifest.runId,
			targets: targets.map((target) => ({
				agentId: sanitizeFailureReportText(target.agentId),
				completedMoves: target.completedMoves.length,
				issues: target.issues.map((issue) => ({
					code: issue.code,
					message: sanitizeFailureIssueMessage(issue, target)
				})),
				plannedMoves: target.plannedMoves.length,
				sqlitePath: sanitizeFailureReportText(shortenFailureReportPath(target.sqlitePath)),
				storePath: sanitizeFailureReportText(shortenFailureReportPath(target.storePath)),
				validationBeforeArchive: target.validationBeforeArchive
			})),
			version: VERSION
		})
	].join("\n"), 2e4);
	return {
		body: boundedBody,
		...bodyPath ? { bodyPath } : {},
		title,
		url: createPrefilledGithubIssueUrl(title, boundedBody)
	};
}
function sessionSqliteMigrationTargetKey(target) {
	return `${target.agentId}\u0000${canonicalMigrationFilePath(target.storePath)}`;
}
function findMigrationManifestTarget(activeRun, target) {
	if (!activeRun) return;
	return activeRun.manifest.targets.find((item) => sessionSqliteMigrationTargetKey(item) === sessionSqliteMigrationTargetKey(target));
}
function emptyRestoreReport() {
	return {
		conflicts: [],
		manifestPaths: [],
		restoredFiles: [],
		skippedFiles: []
	};
}
function restoreSessionSqliteMigrationManifest(manifest, manifestPath, targets, restoreReport, restorePlan) {
	const consumedArchives = collectRecordedConsumedArchives(manifest);
	for (const target of targets) for (const move of uniqueRestoreMoves(target)) restoreMigrationMove({
		consumedArchives,
		manifestPath,
		move,
		restorePlan,
		restoreReport
	});
	manifest.restore = {
		attemptedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...consumedArchives.size > 0 ? { consumedArchives: [...consumedArchives].toSorted() } : {},
		conflicts: restoreReport.conflicts,
		restoredFiles: restoreReport.restoredFiles,
		skippedFiles: restoreReport.skippedFiles,
		status: resolveRestoreStatus(restoreReport)
	};
}
function uniqueRestoreMoves(target) {
	const moves = /* @__PURE__ */ new Map();
	for (const move of [...target.completedMoves, ...target.plannedMoves]) moves.set(`${move.sourcePath}\u0000${move.archivePath}`, move);
	return [...moves.values()];
}
function restoreMigrationMove(params) {
	const { consumedArchives, manifestPath, move, restorePlan, restoreReport } = params;
	const planned = restorePlan.get(restoreMovePlanKey(manifestPath, move)) ?? { action: "standard" };
	if (planned.action === "conflict") {
		restoreReport.conflicts.push({
			archivePath: move.archivePath,
			reason: planned.reason,
			sourcePath: move.sourcePath
		});
		return;
	}
	if (planned.action === "skip-consumed" || planned.action === "skip-superseded") {
		restoreReport.skippedFiles.push(move.sourcePath);
		return;
	}
	const sourceExists = fs.existsSync(move.sourcePath);
	const archiveExists = fs.existsSync(move.archivePath);
	if (!sourceExists && archiveExists) {
		if (planned.action === "restore") {
			const inspection = inspectRestoreArchive(move);
			if (inspection.state !== "available" || inspection.snapshot.digest !== planned.snapshot.digest || inspection.snapshot.size !== planned.snapshot.size || inspection.snapshot.legacyEntryCount !== planned.snapshot.legacyEntryCount) {
				restoreReport.conflicts.push({
					archivePath: move.archivePath,
					reason: "archive changed after restore planning; refusing restore",
					sourcePath: move.sourcePath
				});
				return;
			}
		}
		if (!isRegularFileWithoutFollowingSymlinks(move.archivePath)) {
			restoreReport.conflicts.push({
				archivePath: move.archivePath,
				reason: "archive is not a regular file; refusing restore",
				sourcePath: move.sourcePath
			});
			return;
		}
		const sourceDir = path.dirname(move.sourcePath);
		const archiveDir = path.dirname(move.archivePath);
		if (hasSymbolicLinkInDirectoryPath(sourceDir) || hasSymbolicLinkInDirectoryPath(archiveDir)) {
			restoreReport.conflicts.push({
				archivePath: move.archivePath,
				reason: "source or archive parent is a symbolic link; refusing restore",
				sourcePath: move.sourcePath
			});
			return;
		}
		fs.mkdirSync(sourceDir, {
			recursive: true,
			mode: 448
		});
		if (hasSymbolicLinkInDirectoryPath(sourceDir) || hasSymbolicLinkInDirectoryPath(archiveDir)) {
			restoreReport.conflicts.push({
				archivePath: move.archivePath,
				reason: "source or archive parent is a symbolic link; refusing restore",
				sourcePath: move.sourcePath
			});
			return;
		}
		fs.renameSync(move.archivePath, move.sourcePath);
		consumedArchives.add(move.archivePath);
		restoreReport.restoredFiles.push(move.sourcePath);
		return;
	}
	if (sourceExists && !archiveExists) {
		restoreReport.skippedFiles.push(move.sourcePath);
		return;
	}
	if (sourceExists && archiveExists) {
		restoreReport.conflicts.push({
			archivePath: move.archivePath,
			reason: "source and archive both exist; refusing to overwrite source",
			sourcePath: move.sourcePath
		});
		return;
	}
	restoreReport.conflicts.push({
		archivePath: move.archivePath,
		reason: "source and archive are both missing",
		sourcePath: move.sourcePath
	});
}
function assertSafeSessionSqliteMigrationMove(move, target) {
	if (!isRestoreMoveWithinTarget(move, target)) throw new Error(`Migration source is outside the target sessions directory: ${move.sourcePath}`);
	if (!isRegularFileWithoutFollowingSymlinks(move.sourcePath)) throw new Error(`Migration source is not a regular file: ${move.sourcePath}`);
	assertSafeSessionSqliteMigrationDirectory(path.dirname(move.sourcePath));
	assertSafeSessionSqliteMigrationDirectory(path.dirname(move.archivePath));
}
function assertSafeSessionSqliteMigrationDirectory(directoryPath) {
	if (hasSymbolicLinkInDirectoryPath(directoryPath)) throw new Error(`Refusing session SQLite migration through symbolic link: ${directoryPath}`);
}
function isRegularFileWithoutFollowingSymlinks(filePath) {
	try {
		return fs.lstatSync(filePath).isFile();
	} catch {
		return false;
	}
}
function hasSymbolicLinkInDirectoryPath(directoryPath) {
	const resolvedPath = path.resolve(directoryPath);
	const root = path.parse(resolvedPath).root;
	let currentPath = root;
	for (const segment of path.relative(root, resolvedPath).split(path.sep).filter(Boolean)) {
		currentPath = path.join(currentPath, segment);
		try {
			if (fs.lstatSync(currentPath).isSymbolicLink()) return true;
		} catch (error) {
			if (error.code === "ENOENT") continue;
			return true;
		}
	}
	return false;
}
function resolveRestoreStatus(report) {
	if (report.conflicts.length > 0 && report.restoredFiles.length > 0) return "partial";
	if (report.conflicts.length > 0) return "conflicts";
	if (report.restoredFiles.length > 0) return "restored";
	if (report.skippedFiles.length > 0) return "noop";
	return "noop";
}
function filterRestoreManifestTargets(manifest, trustedTargets) {
	if (trustedTargets.length === 0) return [];
	const trustedSqlitePaths = new Map(trustedTargets.map((target) => [sessionSqliteMigrationTargetKey(target), canonicalMigrationFilePath(target.sqlitePath)]));
	return manifest.targets.filter((target) => trustedSqlitePaths.get(sessionSqliteMigrationTargetKey(target)) === canonicalMigrationFilePath(target.sqlitePath));
}
function listSessionSqliteMigrationManifestPaths(env) {
	const runsDir = resolveSessionSqliteMigrationRunsDir(env);
	let entries;
	try {
		entries = fs.readdirSync(runsDir);
	} catch {
		return [];
	}
	return entries.filter((entry) => entry.endsWith(".json")).filter((entry) => !entry.endsWith(".failure.json")).map((entry) => path.join(runsDir, entry)).toSorted((left, right) => right.localeCompare(left));
}
function readSessionSqliteMigrationManifest(manifestPath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		const result = MigrationManifestSchema.safeParse(parsed);
		if (!result.success) return;
		if (result.data.manifestVersion === 1) {
			if (hasUnsupportedV1DirectorySymlink(result.data)) return;
			const normalized = {
				...result.data,
				targets: result.data.targets.map(normalizeMigrationTargetManifest)
			};
			const normalizedResult = MigrationManifestSchema.safeParse(normalized);
			return normalizedResult.success ? normalizedResult.data : void 0;
		}
		return result.data;
	} catch {
		return;
	}
}
function isRestoreMoveWithinTarget(move, target) {
	const sourcePath = path.resolve(move.sourcePath);
	const archivePath = path.resolve(move.archivePath);
	if (sourcePath === archivePath) return false;
	const storePath = path.resolve(target.storePath);
	const sessionsDir = path.dirname(storePath);
	const archiveDir = path.join(path.dirname(sessionsDir), "session-sqlite-import-archive");
	if (path.dirname(archivePath) !== archiveDir) return false;
	return move.kind === "legacy-store" ? sourcePath === storePath : path.dirname(sourcePath) === sessionsDir;
}
function normalizeMigrationTarget(target) {
	return {
		agentId: target.agentId,
		sqlitePath: canonicalMigrationFilePath(target.sqlitePath),
		storePath: canonicalMigrationFilePath(target.storePath)
	};
}
function normalizeMigrationTargetManifest(target) {
	return {
		...target,
		...normalizeMigrationTarget(target),
		completedMoves: target.completedMoves.map(normalizeMigrationMove),
		plannedMoves: target.plannedMoves.map(normalizeMigrationMove)
	};
}
function normalizeMigrationMove(move) {
	return {
		archivePath: canonicalMigrationFilePath(move.archivePath),
		kind: move.kind,
		...move.sessionKey ? { sessionKey: move.sessionKey } : {},
		sourcePath: canonicalMigrationFilePath(move.sourcePath)
	};
}
function hasUnsupportedV1DirectorySymlink(manifest) {
	return manifest.targets.flatMap((target) => [
		path.dirname(target.sqlitePath),
		path.dirname(target.storePath),
		...target.plannedMoves.flatMap((move) => [path.dirname(move.archivePath), path.dirname(move.sourcePath)]),
		...target.completedMoves.flatMap((move) => [path.dirname(move.archivePath), path.dirname(move.sourcePath)])
	]).some((directoryPath) => {
		const resolvedPath = path.resolve(directoryPath);
		const root = path.parse(resolvedPath).root;
		let currentPath = root;
		for (const segment of path.relative(root, resolvedPath).split(path.sep).filter(Boolean)) {
			currentPath = path.join(currentPath, segment);
			try {
				if (fs.lstatSync(currentPath).isSymbolicLink() && path.dirname(currentPath) !== root) return true;
			} catch (error) {
				if (error.code !== "ENOENT") return true;
			}
		}
		return false;
	});
}
function canonicalMigrationFilePath(filePath) {
	const resolvedPath = path.resolve(filePath);
	const fileName = path.basename(resolvedPath);
	const directoryPath = path.dirname(resolvedPath);
	const suffix = [];
	let currentPath = directoryPath;
	while (true) try {
		return path.join(fs.realpathSync.native(currentPath), ...suffix, fileName);
	} catch (error) {
		const code = error.code;
		const parentPath = path.dirname(currentPath);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parentPath === currentPath) return resolvedPath;
		suffix.unshift(path.basename(currentPath));
		currentPath = parentPath;
	}
}
function assertSafeMigrationTargetTopology(target) {
	for (const filePath of [target.storePath, target.sqlitePath]) if (isSymbolicLinkPath(filePath) || isSymbolicLinkPath(path.dirname(filePath))) throw new Error(`Refusing session SQLite migration through symbolic link: ${filePath}`);
	const sessionsDir = path.dirname(canonicalMigrationFilePath(target.storePath));
	assertSafeSessionSqliteMigrationDirectory(path.join(path.dirname(sessionsDir), "session-sqlite-import-archive"));
}
function isSymbolicLinkPath(filePath) {
	try {
		return fs.lstatSync(filePath).isSymbolicLink();
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function isFailedSessionSqliteMigrationManifest(manifest) {
	return manifest.completedAt === void 0 || manifest.failedAt !== void 0 || manifest.failureReports !== void 0 || manifest.targets.some((target) => target.issues.length > 0);
}
function manifestSortTime(manifest) {
	const timestamp = manifest.failedAt ?? manifest.completedAt ?? manifest.startedAt;
	const parsed = Date.parse(timestamp);
	return Number.isFinite(parsed) ? parsed : 0;
}
function createPrefilledGithubIssueUrl(title, body) {
	const urlBody = body.length > 6e3 ? `${truncateUtf16Safe(body, 6e3)}\n\n...(truncated for URL; see local failure report for the full sanitized body)` : body;
	return `https://github.com/openclaw/openclaw/issues/new?${new URLSearchParams({
		body: urlBody,
		title
	}).toString()}`;
}
function pruneCompletedSessionSqliteMigrationRuns(env) {
	const completed = listSessionSqliteMigrationManifestPaths(env).map((manifestPath) => ({
		manifest: readSessionSqliteMigrationManifest(manifestPath),
		manifestPath
	})).filter((item) => item.manifest !== void 0 && item.manifest.completedAt !== void 0 && !isFailedSessionSqliteMigrationManifest(item.manifest)).toSorted((left, right) => manifestSortTime(right.manifest) - manifestSortTime(left.manifest));
	for (const item of completed.slice(COMPLETED_MIGRATION_RUN_RETENTION)) try {
		fs.rmSync(item.manifestPath, { force: true });
	} catch {}
}
function renderFailureMarkdown(payload) {
	const lines = [
		"# Session SQLite Migration Failure",
		"",
		`- Run: ${payload.runId}`,
		`- Generated: ${payload.generatedAt}`,
		`- OpenClaw version: ${payload.version}`,
		`- Reason: ${sanitizeFailureReportText(payload.reason)}`,
		`- Restore status: ${payload.restoreStatus}`,
		`- Recovery command: \`${payload.recoveryCommand}\``,
		"",
		"## Targets"
	];
	for (const target of payload.targets) {
		lines.push("", `### ${target.agentId}`, "", `- Store: ${target.storePath}`, `- SQLite: ${target.sqlitePath}`, `- Planned moves: ${target.plannedMoves}`, `- Completed moves: ${target.completedMoves}`, `- Validation before archive: ${target.validationBeforeArchive}`, `- Issues: ${target.issues.length}`);
		for (const issue of target.issues.slice(0, 10)) lines.push(`  - [${issue.code}] ${issue.sessionKey ? `${issue.sessionKey}: ` : ""}${issue.message}`);
	}
	lines.push("");
	return `${lines.join("\n")}\n`;
}
function sanitizeFailureReportText(value) {
	return truncateUtf16Safe(value.replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, "[redacted-email]").replace(/(api[_-]?key|token|secret|password)[=-][A-Za-z0-9._-]+/gi, "$1-[redacted]").replace(/(api[_-]?key|token|secret|password)=\S+/gi, "$1=[redacted]"), 500);
}
function shortenFailureReportPath(filePath) {
	const home = process.env.HOME;
	if (home && filePath.startsWith(`${home}${path.sep}`)) return `~${path.sep}${path.relative(home, filePath)}`;
	return filePath;
}
function sanitizeFailureIssueMessage(issue, target) {
	let message = issue.message;
	for (const filePath of [
		target.storePath,
		target.sqlitePath,
		...target.plannedMoves.flatMap((move) => [move.sourcePath, move.archivePath]),
		...target.completedMoves.flatMap((move) => [move.sourcePath, move.archivePath])
	]) message = message.split(filePath).join(shortenFailureReportPath(filePath));
	if (issue.sessionKey) message = message.split(issue.sessionKey).join(redactSessionKey(issue.sessionKey));
	message = redactAbsoluteHomePaths(message);
	return sanitizeFailureReportText(message);
}
function redactSessionKey(sessionKey) {
	if (!sessionKey.trim()) return "[redacted-session-key]";
	return `[redacted-session-key:${randomUUID().slice(0, 8)}]`;
}
function redactAbsoluteHomePaths(value) {
	const home = process.env.HOME;
	if (!home) return value;
	return value.split(home).join("~");
}
//#endregion
//#region src/commands/doctor-session-sqlite-recover-report.ts
/** Builds doctor reports for session SQLite migration recovery mode. */
const CANONICAL_AGENT_INDEX_NAMES = getCanonicalSqliteNamedIndexContracts(OPENCLAW_AGENT_SCHEMA_SQL).map((index) => index.name);
/** Restores the latest failed migration run and validates only selected manifest targets. */
async function recoverDoctorSessionSqliteTargets(params) {
	const trustedTargets = resolveRecoverTargets(params.targets);
	const failedRun = findLatestFailedSessionSqliteMigrationManifest(params.env, trustedTargets);
	if (!failedRun) {
		const recoveredCorruptTargets = recoverCorruptSqliteTargets(params.targets, params.env);
		if (recoveredCorruptTargets.length > 0) return summarizeRecoverReport(recoveredCorruptTargets);
		return summarizeRecoverReport([createSyntheticRecoverTargetReport(params.env, "No failed session SQLite migration manifest found.")]);
	}
	const restore = restoreSessionSqliteMigrationRun({
		manifestPath: failedRun.manifestPath,
		trustedTargets
	});
	const targetReports = [];
	for (const manifestTarget of failedRun.targets) targetReports.push(await params.validateTarget({
		agentId: manifestTarget.agentId,
		storePath: manifestTarget.storePath
	}));
	const reportTarget = targetReports[0] ?? createSyntheticRecoverTargetReport(params.env, failedRun.manifestPath);
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	const failureReports = writeSessionSqliteMigrationFailureReports(failedRun.manifestPath, { reason: "doctor recover restored and validated a failed session SQLite migration run" });
	const report = summarizeRecoverReport(targetReports.length > 0 ? targetReports : [reportTarget]);
	report.migrationRun = {
		failureReportJsonPath: failureReports.jsonPath,
		failureReportMarkdownPath: failureReports.markdownPath,
		manifestPath: failedRun.manifestPath,
		runId: failedRun.manifest.runId
	};
	report.supportIssue = createSessionSqliteMigrationFailureIssue(failedRun.manifestPath, trustedTargets);
	return report;
}
function recoverCorruptSqliteTargets(targets, env) {
	return targets.flatMap((target) => {
		const sqlitePath = resolveTargetSqlitePath(target);
		let recoveryFiles;
		try {
			recoveryFiles = inspectSqliteRecoveryFiles(sqlitePath);
		} catch (error) {
			return [createRecoverInspectionFailureTargetReport(target, sqlitePath, error)];
		}
		if (recoveryFiles.existing.length === 0) return [];
		if (!recoveryFiles.existing.includes(sqlitePath)) return [recoverCorruptSqliteTarget(target, sqlitePath, /* @__PURE__ */ new Error(`SQLite sidecars exist without their main database: ${sqlitePath}`))];
		const inspection = inspectSqliteForRecovery(sqlitePath, recoveryFiles.existing);
		if (inspection.ok) return [];
		if (!isSqliteCorruptionError(inspection.error)) return [createRecoverInspectionFailureTargetReport(target, sqlitePath, inspection.error)];
		if (!isCanonicalAgentIndexCorruptionError(inspection.error)) return [recoverCorruptSqliteTarget(target, sqlitePath, inspection.error)];
		const repair = repairCanonicalIndexesForRecovery(target, sqlitePath, env);
		if (repair.ok) return [createEmptyRecoverTargetReport(target, sqlitePath)];
		if (repair.preserveOriginal) return [createRecoverInspectionFailureTargetReport(target, sqlitePath, repair.error)];
		return [recoverCorruptSqliteTarget(target, sqlitePath, inspection.error)];
	});
}
function repairCanonicalIndexesForRecovery(target, sqlitePath, env) {
	try {
		migrateOpenClawAgentDatabaseForMaintenance({
			agentId: target.agentId,
			pathname: sqlitePath
		});
	} catch (error) {
		return {
			error,
			ok: false,
			preserveOriginal: false
		};
	}
	const sourcePaths = inspectSqliteRecoveryFiles(sqlitePath).existing;
	const inspection = inspectSqliteForRecovery(sqlitePath, sourcePaths);
	if (!inspection.ok) return {
		error: inspection.error,
		ok: false,
		preserveOriginal: false
	};
	if (!clearOpenClawAgentDatabaseOpenFailure(sqlitePath, { env })) return {
		error: /* @__PURE__ */ new Error(`Repaired canonical SQLite indexes, but could not clear the quarantine for ${sqlitePath}.`),
		ok: false,
		preserveOriginal: true
	};
	return { ok: true };
}
function inspectSqliteForRecovery(sqlitePath, sourcePaths) {
	let inspectionDir;
	let database;
	let inspectionError;
	try {
		inspectionDir = fs.mkdtempSync(path.join(os.tmpdir(), "openclaw-sqlite-recovery-"));
		const inspectionPath = path.join(inspectionDir, path.basename(sqlitePath));
		for (const sourcePath of sourcePaths) {
			const inspectionFilePath = `${inspectionPath}${sourcePath.slice(sqlitePath.length)}`;
			fs.copyFileSync(sourcePath, inspectionFilePath, fs.constants.COPYFILE_EXCL);
			fs.chmodSync(inspectionFilePath, 384);
		}
		database = openNodeSqliteDatabase(inspectionPath);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		database.exec("PRAGMA trusted_schema = OFF;");
		assertSqliteIntegrity(database, inspectionPath);
	} catch (error) {
		inspectionError = error;
	}
	try {
		database?.close();
	} catch (error) {
		inspectionError ??= error;
	}
	try {
		if (inspectionDir) fs.rmSync(inspectionDir, {
			force: true,
			recursive: true
		});
	} catch (error) {
		inspectionError ??= error;
	}
	return inspectionError === void 0 ? { ok: true } : {
		error: inspectionError,
		ok: false
	};
}
function recoverCorruptSqliteTarget(target, sqlitePath, error) {
	const report = createEmptyRecoverTargetReport(target, sqlitePath);
	try {
		report.corruptRecovery = moveCorruptSqliteFilesAside(sqlitePath);
	} catch (moveError) {
		report.issues.push({
			code: "sqlite_corrupt_recovery_failed",
			message: `${sqlitePath}: ${String(moveError)}; original error: ${String(error)}`
		});
	}
	return report;
}
function createRecoverInspectionFailureTargetReport(target, sqlitePath, error) {
	const report = createEmptyRecoverTargetReport(target, sqlitePath);
	report.issues.push({
		code: "sqlite_recovery_inspect_failed",
		message: `${sqlitePath}: ${String(error)}`
	});
	return report;
}
function moveCorruptSqliteFilesAside(sqlitePath) {
	const recoveryFiles = inspectSqliteRecoveryFiles(sqlitePath);
	const moves = planCorruptSqliteMoves(recoveryFiles.existing);
	const completed = [];
	try {
		for (const move of moves.toSorted((left, right) => {
			if (left.sourcePath === sqlitePath) return 1;
			if (right.sourcePath === sqlitePath) return -1;
			return left.sourcePath.localeCompare(right.sourcePath);
		})) {
			fs.renameSync(move.sourcePath, move.destinationPath);
			completed.push(move);
		}
	} catch (error) {
		const rollbackErrors = [];
		for (const move of completed.toReversed()) try {
			if (pathExists(move.sourcePath)) throw new Error(`rollback source was recreated: ${move.sourcePath}`, { cause: error });
			fs.renameSync(move.destinationPath, move.sourcePath);
		} catch (rollbackError) {
			rollbackErrors.push(rollbackError);
		}
		if (rollbackErrors.length > 0) {
			const rollbackDetails = rollbackErrors.map((rollbackError) => String(rollbackError)).join("; ");
			throw new Error(`Could not move corrupt SQLite file set aside or restore it: ${sqlitePath}; rollback failures: ${rollbackDetails}`, { cause: error });
		}
		throw error;
	}
	return {
		movedFiles: moves.map((move) => move.destinationPath),
		skippedFiles: recoveryFiles.missing
	};
}
function inspectSqliteRecoveryFiles(sqlitePath) {
	const existing = [];
	const missing = [];
	for (const candidate of resolveSqliteDatabaseFilePaths(sqlitePath)) try {
		if (!fs.lstatSync(candidate).isFile()) throw new Error(`SQLite recovery path is not a regular file: ${candidate}`);
		existing.push(candidate);
	} catch (error) {
		if (error.code === "ENOENT") {
			missing.push(candidate);
			continue;
		}
		throw error;
	}
	return {
		existing,
		missing
	};
}
function planCorruptSqliteMoves(sourcePaths) {
	const timestampSuffix = `.corrupt-${Date.now()}`;
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const suffix = attempt === 0 ? timestampSuffix : `${timestampSuffix}.${attempt}`;
		const moves = sourcePaths.map((sourcePath) => ({
			destinationPath: `${sourcePath}${suffix}`,
			sourcePath
		}));
		if (moves.every((move) => !pathExists(move.destinationPath))) return moves;
	}
	throw new Error(`Could not choose recovery paths for ${sourcePaths[0] ?? "SQLite files"}`);
}
function pathExists(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw error;
	}
}
function isSqliteCorruptionError(error) {
	const code = error && typeof error === "object" ? error.code : void 0;
	if (code === "SQLITE_CORRUPT" || code === "SQLITE_NOTADB") return true;
	const message = String(error).toLowerCase();
	return message.includes("database disk image is malformed") || message.includes("not a database") || message.includes("sqlite quick_check failed") || message.includes("sqlite integrity_check failed") || message.includes("sqlite foreign_key_check failed");
}
function isCanonicalAgentIndexCorruptionError(error) {
	if (!(error instanceof Error) || error.name !== "SqliteIntegrityError") return false;
	return CANONICAL_AGENT_INDEX_NAMES.some((indexName) => error.message.includes(indexName));
}
function resolveRecoverTargets(targets) {
	return targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target)
	}));
}
function createSyntheticRecoverTargetReport(env, message) {
	return createDoctorSessionSqliteTargetReport({
		agentId: "recover",
		issues: [{
			code: "recover_manifest_missing",
			message
		}],
		sqlitePath: "",
		storePath: resolveSessionSqliteMigrationRunsDir(env)
	});
}
function createEmptyRecoverTargetReport(target, sqlitePath) {
	return createDoctorSessionSqliteTargetReport({
		agentId: target.agentId,
		sqlitePath,
		storePath: target.storePath
	});
}
function summarizeRecoverReport(targets) {
	const sum = (value) => sumDoctorSessionSqliteTargets(targets, value);
	return {
		mode: "recover",
		targets,
		totals: createDoctorSessionSqliteTotals(targets, {
			legacyEntries: sum((target) => target.legacyEntries),
			unreferencedJsonlFiles: sum((target) => target.unreferencedJsonlFiles.length),
			validatedEntries: sum((target) => target.validatedEntries),
			validatedTranscriptEvents: sum((target) => target.validatedTranscriptEvents)
		})
	};
}
//#endregion
//#region src/commands/doctor-session-sqlite-restore-report.ts
async function restoreDoctorSessionSqliteTargets(params) {
	const targetReports = params.targets.map((target) => createEmptyTargetReport(target));
	const trustedTargets = params.targets.map((target) => ({
		...target,
		sqlitePath: resolveTargetSqlitePath(target)
	}));
	const restore = restoreSessionSqliteMigrationRuns({
		env: params.env,
		trustedTargets
	});
	const reportTarget = targetReports[0] ?? createSyntheticRestoreTargetReport(params.env, restore.manifestPaths[0] ?? resolveSessionSqliteMigrationRunsDir(params.env));
	reportTarget.restore = restore;
	reportTarget.issues.push(...restore.conflicts.map((conflict) => ({
		code: "restore_conflict",
		message: `${conflict.sourcePath}: ${conflict.reason}`
	})));
	return summarizeRestoreReport(targetReports.length > 0 ? targetReports : [reportTarget]);
}
function createEmptyTargetReport(target) {
	return createDoctorSessionSqliteTargetReport({
		agentId: target.agentId,
		sqliteEntries: readSqliteEntryCount(target),
		sqlitePath: resolveTargetSqlitePath(target),
		storePath: target.storePath
	});
}
function createSyntheticRestoreTargetReport(env, manifestPath) {
	return createDoctorSessionSqliteTargetReport({
		agentId: "restore",
		sqlitePath: "",
		storePath: manifestPath || resolveSessionSqliteMigrationRunsDir(env)
	});
}
function summarizeRestoreReport(targets) {
	return {
		mode: "restore",
		targets,
		totals: createDoctorSessionSqliteTotals(targets)
	};
}
//#endregion
//#region src/commands/doctor-session-sqlite.ts
/**
* Runs the targeted doctor SQLite session migration/inspection submode.
* Destructive production callers hold the Gateway/SQLite-maintenance state lock for the full call.
*/
async function runDoctorSessionSqlite(options) {
	const env = options.env ?? process.env;
	const cfg = resolveDoctorSessionSqliteConfig(options);
	const targets = resolveDoctorSessionSqliteTargets({
		allAgents: options.allAgents,
		agent: options.agent,
		cfg,
		env,
		mode: options.mode,
		store: options.store
	});
	if (isDestructiveDoctorSessionSqliteMode(options.mode)) {
		const maintenancePaths = resolveDoctorSessionSqliteMaintenancePaths(targets);
		assertDoctorSqliteMaintenancePathsNotAliased(`session SQLite ${options.mode}`, maintenancePaths, resolveDoctorSessionSqliteMaintenanceRoots(targets, env));
	}
	if (options.mode === "restore") return restoreDoctorSessionSqliteTargets({
		env,
		targets
	});
	if (options.mode === "recover") return recoverDoctorSessionSqliteTargets({
		env,
		options,
		targets,
		validateTarget: (target) => inspectOrMigrateTarget({
			cfg,
			env,
			mode: "validate",
			target
		})
	});
	const activeRun = options.mode === "import" && targets.length > 0 ? createSessionSqliteMigrationRun(env, targets.map(createMigrationTargetInput)) : void 0;
	const fullyCoveredStorePaths = options.mode === "import" ? resolveFullyCoveredLegacyStorePaths(cfg, targets) : /* @__PURE__ */ new Set();
	const reports = [];
	for (const target of targets) reports.push(await inspectOrMigrateTarget({
		activeRun,
		archiveImportedArtifacts: fullyCoveredStorePaths.has(path.resolve(target.storePath)),
		cfg,
		env,
		mode: options.mode,
		target
	}));
	if (activeRun) {
		archiveImportedLegacySessionStores(targets, reports, activeRun, fullyCoveredStorePaths);
		const hasBlockingIssues = reports.some((report) => blockingIssueCount(report) > 0);
		activeRun.manifest.completedAt = (/* @__PURE__ */ new Date()).toISOString();
		if (hasBlockingIssues) {
			activeRun.manifest.failedAt = activeRun.manifest.completedAt;
			const failureReports = writeSessionSqliteMigrationFailureReports(activeRun.manifestPath, { reason: "doctor import reported session SQLite migration issues" });
			activeRun.manifest.failureReports = failureReports;
		}
		writeSessionSqliteMigrationManifest(activeRun);
	}
	return summarizeDoctorSessionSqliteReport(options.mode, reports, activeRun);
}
function resolveDoctorSessionSqliteMaintenancePaths(targets) {
	const protectedPaths = /* @__PURE__ */ new Set();
	for (const target of targets) for (const databasePath of resolveSqliteDatabaseFilePaths(resolveTargetSqlitePath(target))) protectedPaths.add(databasePath);
	return [...protectedPaths];
}
function resolveDoctorSessionSqliteMaintenanceRoots(targets, env) {
	const stateDir = path.resolve(resolveStateDir(env));
	const roots = /* @__PURE__ */ new Set([stateDir]);
	for (const target of targets) {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (isPathWithin(stateDir, target.storePath) && isPathWithin(stateDir, sqlitePath)) continue;
		const commonRoot = commonPathAncestor(path.dirname(target.storePath), path.dirname(sqlitePath));
		const parentRoot = path.dirname(commonRoot);
		roots.add(parentRoot === path.parse(commonRoot).root ? commonRoot : parentRoot);
	}
	return [...roots];
}
function isPathWithin(rootPath, candidatePath) {
	const relativePath = path.relative(rootPath, path.resolve(candidatePath));
	return relativePath === "" || !relativePath.startsWith(`..${path.sep}`) && relativePath !== "..";
}
function commonPathAncestor(leftPath, rightPath) {
	let currentPath = path.resolve(leftPath);
	const resolvedRightPath = path.resolve(rightPath);
	while (!isPathWithin(currentPath, resolvedRightPath)) {
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) return currentPath;
		currentPath = parentPath;
	}
	return currentPath;
}
function resolveDoctorSessionSqliteConfig(options) {
	if (options.cfg) return options.cfg;
	const requestedAgentId = normalizeAgentId(options.agent ?? "main");
	return options.store ? { agents: { entries: { [requestedAgentId]: { default: true } } } } : getRuntimeConfig();
}
function resolveDoctorSessionSqliteTargets(params) {
	if (params.store) return filterLegacySessionStoreTargets(resolveSessionStoreTargets(params.cfg, { store: params.store }, { env: params.env }), params.mode);
	if (params.mode === "restore" || params.mode === "recover") {
		const candidates = resolveAllAgentSessionStoreCandidateTargetsSync(params.cfg, { env: params.env });
		if (!params.agent) return candidates;
		const requestedAgentId = normalizeAgentId(params.agent);
		return candidates.filter((target) => normalizeAgentId(target.agentId) === requestedAgentId);
	}
	if (params.agent) return filterLegacySessionStoreTargets(resolveAgentSessionStoreTargetsSync(params.cfg, params.agent, { env: params.env }), params.mode);
	if (params.allAgents) return filterLegacySessionStoreTargets(resolveAllAgentSessionStoreTargetsSync(params.cfg, { env: params.env }), params.mode);
	return resolveSessionStoreTargets(params.cfg, {}, { env: params.env }).filter((target) => fs.existsSync(target.storePath));
}
function filterLegacySessionStoreTargets(targets, mode) {
	if (mode === "inspect" || mode === "compact" || mode === "restore" || mode === "recover") return targets;
	return targets.filter((target) => fs.existsSync(target.storePath));
}
async function inspectOrMigrateTarget(params) {
	const issues = [];
	const allRecords = readLegacySessionRecords(params.target, issues, { allowMissingStore: params.mode === "inspect" || params.mode === "compact" });
	const records = shouldFilterLegacySessionRecordsByTarget(params.target) ? allRecords.filter((record) => isLegacySessionRecordOwnedByTarget(params.cfg, params.target, record.sessionKey)) : allRecords;
	const referencedTranscriptFiles = new Set(allRecords.flatMap((record) => record.transcriptPath ? [record.transcriptPath] : []));
	const report = createDoctorSessionSqliteTargetReport({
		agentId: params.target.agentId,
		archivedLegacyStoreFiles: [],
		issues,
		legacyEntries: records.length,
		referencedTranscriptFiles: referencedTranscriptFiles.size,
		sqliteEntries: readSqliteEntryCount(params.target),
		sqlitePath: resolveTargetSqlitePath(params.target),
		storePath: params.target.storePath,
		unreferencedJsonlFiles: listUnreferencedJsonlFiles(params.target.storePath, [...referencedTranscriptFiles])
	});
	if (params.mode === "inspect") {
		report.sqliteEntries = readSqliteEntryCount(params.target);
		appendSqliteDbStats(params.target, report);
		appendActiveSqliteTranscriptFileIssues(params.target, report);
		return report;
	}
	if (params.mode === "compact") {
		compactSqliteDatabase(params.target, report, { env: params.env });
		report.sqliteEntries = readSqliteEntryCount(params.target);
		appendSqliteDbStats(params.target, report);
		return report;
	}
	const importedTranscriptSources = /* @__PURE__ */ new Set();
	for (const record of records) {
		if (params.mode === "dry-run") {
			countLegacyTranscript(record, report);
			continue;
		}
		if (params.mode === "import") {
			await importLegacySessionRecord(params.target, record, report, importedTranscriptSources);
			continue;
		}
		validateLegacySessionRecord(params.target, record, report);
	}
	if (params.mode === "import" && blockingIssueCount(report) === 0) {
		const validationPassed = validateImportedTargetBeforeArchive(params.target, records, report);
		updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues, { validationBeforeArchive: validationPassed ? "passed" : "failed" });
		if (validationPassed && params.archiveImportedArtifacts !== false) {
			archiveImportedTranscripts(params.target, records, report, params.activeRun);
			archiveUnreferencedJsonlFiles(params.target, report, [...referencedTranscriptFiles], params.activeRun);
		}
		if (validationPassed) compactSqliteDatabase(params.target, report, {
			closeImportedHandle: true,
			env: params.env,
			migrateOlderSchema: true
		});
	}
	report.unreferencedJsonlFiles = listUnreferencedJsonlFiles(params.target.storePath, [...referencedTranscriptFiles]);
	report.sqliteEntries = readSqliteEntryCount(params.target);
	appendActiveSqliteTranscriptFileIssues(params.target, report);
	updateMigrationManifestTarget(params.activeRun, createMigrationTargetInput(params.target), report.issues);
	return report;
}
function resolveFullyCoveredLegacyStorePaths(cfg, targets) {
	const covered = /* @__PURE__ */ new Set();
	const targetsByStore = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const storePath = path.resolve(target.storePath);
		targetsByStore.set(storePath, [...targetsByStore.get(storePath) ?? [], target]);
	}
	for (const [storePath, storeTargets] of targetsByStore) {
		const [firstStoreTarget] = storeTargets;
		if (!firstStoreTarget) continue;
		const issues = [];
		const coversEveryRecord = readLegacySessionRecords(firstStoreTarget, issues).every((record) => storeTargets.some((target) => !shouldFilterLegacySessionRecordsByTarget(target) || isLegacySessionRecordOwnedByTarget(cfg, target, record.sessionKey)));
		if (issues.every(isSessionSqliteMigrationWarning) && coversEveryRecord) covered.add(storePath);
	}
	return covered;
}
function readLegacySessionRecords(target, issues, options = {}) {
	const openFlags = process.platform === "win32" ? "r" : fs.constants.O_RDONLY | fs.constants.O_NONBLOCK;
	let fd;
	try {
		fd = fs.openSync(target.storePath, openFlags);
	} catch (err) {
		const nodeErr = err;
		if (options.allowMissingStore === true && nodeErr.code === "ENOENT") {
			try {
				if (!fs.statSync(path.dirname(target.storePath)).isDirectory()) issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: parent path is not a directory`
				});
			} catch (parentErr) {
				if (parentErr.code !== "ENOENT") issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: ${String(parentErr)}`
				});
			}
			return [];
		}
		issues.push({
			code: "store_unreadable",
			message: `${target.storePath}: ${String(err)}`
		});
		return [];
	}
	try {
		let parsed;
		try {
			const storeStat = fs.fstatSync(fd);
			if (!storeStat.isFile()) {
				issues.push({
					code: "store_unreadable",
					message: `${target.storePath}: not a regular file`
				});
				return [];
			}
			const raw = readFileDescriptorBoundedSync(fd, storeStat.size).toString("utf-8");
			parsed = JSON.parse(raw);
		} catch (err) {
			issues.push({
				code: "store_unreadable",
				message: `${target.storePath}: ${String(err)}`
			});
			return [];
		}
		if (!isRecord(parsed)) {
			issues.push({
				code: "store_not_object",
				message: `${target.storePath} does not contain an object session store.`
			});
			return [];
		}
		const records = [];
		for (const [sessionKey, value] of Object.entries(parsed)) {
			if (!isSessionEntry(value)) {
				issues.push({
					code: "entry_invalid",
					message: "Session entry is missing a valid sessionId.",
					sessionKey
				});
				continue;
			}
			records.push({
				entry: normalizeLegacySessionEntryDelivery(value),
				sessionKey,
				transcriptPath: resolveLegacyTranscriptPath(target, value)
			});
		}
		return records;
	} finally {
		fs.closeSync(fd);
	}
}
function isLegacySessionRecordOwnedByTarget(cfg, target, sessionKey) {
	const ownerAgentId = resolveStoredSessionOwnerAgentId({
		cfg,
		agentId: target.agentId,
		sessionKey
	});
	return ownerAgentId ? ownerAgentId === target.agentId : target.agentId === tryResolveDefaultAgentId(cfg);
}
function shouldFilterLegacySessionRecordsByTarget(target) {
	return !resolveUnsuffixedSqliteTargetFromSessionStorePath(target.storePath).agentId;
}
function resolveLegacyTranscriptPath(target, entry) {
	const legacySessionFile = entry.sessionFile;
	if (parseSqliteSessionFileMarker(legacySessionFile)) return;
	const defaultPath = resolveSessionFilePathCore(entry.sessionId, entry, {
		agentId: target.agentId,
		sessionsDir: path.dirname(target.storePath)
	});
	if (fs.existsSync(defaultPath)) return defaultPath;
	return legacySessionFile?.trim() ? defaultPath : void 0;
}
function countLegacyTranscript(record, report) {
	const result = countTranscriptEvents(record);
	if (result.status === "missing") {
		report.issues.push({
			code: "transcript_missing",
			message: `Transcript file is missing: ${record.transcriptPath}`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (result.status === "malformed") {
		report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	report.validatedEntries += 1;
	report.validatedTranscriptEvents += result.events;
}
function blockingIssueCount(report) {
	return report.issues.filter((issue) => !isSessionSqliteMigrationWarning(issue)).length;
}
async function importLegacySessionRecord(target, record, report, importedTranscriptSources) {
	const result = countTranscriptEvents(record);
	const transcriptMtimeMs = readLegacyTranscriptMtimeMs(record);
	const transcriptSourceKey = record.transcriptPath ? `${record.entry.sessionId}\0${record.transcriptPath}` : void 0;
	const shouldImportTranscript = transcriptSourceKey !== void 0 && !importedTranscriptSources.has(transcriptSourceKey);
	if (result.status === "missing") {
		if (markAlreadyMigratedTranscript(target, record, report)) return;
		const imported = await importSqliteSessionRows({
			allowMalformedRowRepair: true,
			agentId: target.agentId,
			entry: record.entry,
			preserveExactStoredKey: true,
			sessionKey: record.sessionKey,
			storePath: target.storePath
		});
		report.importedEntries += 1;
		report.importedTranscriptEvents += imported.transcriptEvents;
		report.issues.push({
			code: "transcript_missing",
			message: `Transcript file is missing: ${record.transcriptPath}`,
			sessionKey: record.sessionKey
		});
		return;
	} else if (result.status === "malformed") {
		const imported = await importSqliteSessionRows({
			allowMalformedRowRepair: true,
			agentId: target.agentId,
			entry: record.entry,
			preserveExactStoredKey: true,
			sessionKey: record.sessionKey,
			storePath: target.storePath,
			...record.transcriptPath && shouldImportTranscript ? { readTranscriptEvents: createTranscriptEventPrefixReader(record.transcriptPath, record.entry.sessionId) } : {},
			...transcriptMtimeMs !== void 0 ? { transcriptMtimeMs } : {}
		});
		if (transcriptSourceKey) importedTranscriptSources.add(transcriptSourceKey);
		report.importedEntries += 1;
		report.importedTranscriptEvents += imported.transcriptEvents;
		report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	const imported = await importSqliteSessionRows({
		allowMalformedRowRepair: true,
		agentId: target.agentId,
		entry: record.entry,
		preserveExactStoredKey: true,
		sessionKey: record.sessionKey,
		storePath: target.storePath,
		...record.transcriptPath && result.status === "ok" && shouldImportTranscript ? { readTranscriptEvents: createTranscriptEventReader(record.transcriptPath, record.entry.sessionId) } : {},
		...transcriptMtimeMs !== void 0 ? { transcriptMtimeMs } : {}
	});
	if (transcriptSourceKey) importedTranscriptSources.add(transcriptSourceKey);
	report.importedEntries += 1;
	report.importedTranscriptEvents += imported.transcriptEvents;
}
function markAlreadyMigratedTranscript(target, record, report) {
	const migratedEvents = countAlreadyMigratedTranscriptEventsForImport(target, record);
	if (migratedEvents === void 0) return false;
	report.validatedEntries += 1;
	report.validatedTranscriptEvents += migratedEvents;
	return true;
}
function validateImportedTargetBeforeArchive(target, records, report) {
	const issueCountBeforeValidation = report.issues.length;
	for (const record of records) validateImportedRecordBeforeArchive(target, record, report);
	return report.issues.length === issueCountBeforeValidation;
}
function validateImportedRecordBeforeArchive(target, record, report) {
	const normalizedKey = record.sessionKey;
	const sqliteEntry = readOnlySqliteExactSessionEntry(target, normalizedKey);
	if (!sqliteEntry.ok || !sqliteEntry.entry) {
		report.issues.push({
			code: "sqlite_entry_missing",
			message: `SQLite entry is missing for ${normalizedKey}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteEntry.entry.entry.sessionId !== record.entry.sessionId) {
		report.issues.push({
			code: "sqlite_entry_mismatch",
			message: `SQLite sessionId ${sqliteEntry.entry.entry.sessionId} does not match ${record.entry.sessionId}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	const result = countTranscriptEvents(record);
	if (result.status === "missing") return;
	if (result.status !== "ok") {
		if (!hasSessionIssue(report, "transcript_malformed", record.sessionKey)) report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	const sqliteEvents = readOnlySqliteTranscriptEventCount(target, record.entry.sessionId);
	if (!sqliteEvents.ok) {
		report.issues.push({
			code: "sqlite_read_failed",
			message: `SQLite transcript count read failed: ${String(sqliteEvents.error)}`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteEvents.events < result.events) report.issues.push({
		code: "sqlite_transcript_count_mismatch",
		message: `SQLite transcript has ${sqliteEvents.events} events; source has ${result.events}.`,
		sessionKey: record.sessionKey
	});
}
function archiveImportedTranscript(target, record, report, activeRun) {
	if (!record.transcriptPath || !fs.existsSync(record.transcriptPath)) return;
	try {
		report.archivedTranscriptFiles.push(...moveImportedTranscriptArtifactsToArchive(target, record.sessionKey, record.transcriptPath, activeRun));
	} catch (err) {
		report.issues.push({
			code: "transcript_archive_failed",
			message: `${record.transcriptPath}: ${String(err)}`,
			sessionKey: record.sessionKey
		});
	}
}
function archiveImportedTranscripts(target, records, report, activeRun) {
	const archivedTranscriptPaths = /* @__PURE__ */ new Set();
	for (const record of records) {
		if (!record.transcriptPath || archivedTranscriptPaths.has(record.transcriptPath)) continue;
		archiveImportedTranscript(target, record, report, activeRun);
		archivedTranscriptPaths.add(record.transcriptPath);
	}
}
function archiveUnreferencedJsonlFiles(target, report, referencedPaths, activeRun) {
	const reservedArchivePaths = /* @__PURE__ */ new Set();
	const plannedMoves = listUnreferencedJsonlFiles(target.storePath, referencedPaths).flatMap((sourcePath) => {
		try {
			const move = planSessionJsonlArchiveMove({
				archiveKey: "archive-tier",
				baseNameRaw: path.basename(sourcePath),
				kind: "unreferenced-jsonl",
				reservedArchivePaths,
				sourcePathRaw: sourcePath,
				target
			});
			reservedArchivePaths.add(move.archivePath);
			return [move];
		} catch (err) {
			report.issues.push({
				code: "unreferenced_jsonl_archive_failed",
				message: `${sourcePath}: ${String(err)}`
			});
			return [];
		}
	});
	recordPlannedMigrationMoves(activeRun, createMigrationTargetInput(target), plannedMoves);
	const completedMoves = [];
	const migrationTarget = createMigrationTargetInput(target);
	for (const move of plannedMoves) try {
		assertSafeSessionSqliteMigrationMove(move, migrationTarget);
		fs.renameSync(move.sourcePath, move.archivePath);
		report.archivedUnreferencedJsonlFiles.push(move.archivePath);
		completedMoves.push(move);
	} catch (err) {
		report.issues.push({
			code: "unreferenced_jsonl_archive_failed",
			message: `${move.sourcePath}: ${String(err)}`
		});
	}
	recordCompletedMigrationMoves(activeRun, createMigrationTargetInput(target), completedMoves);
}
function archiveImportedLegacySessionStores(targets, reports, activeRun, fullyCoveredStorePaths) {
	const byStore = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const report = reports.find((candidate) => candidate.agentId === target.agentId && path.resolve(candidate.storePath) === path.resolve(target.storePath));
		if (!report) continue;
		const key = path.resolve(target.storePath);
		byStore.set(key, [...byStore.get(key) ?? [], {
			report,
			target
		}]);
	}
	for (const [storePath, entries] of byStore) {
		if (!fullyCoveredStorePaths.has(storePath)) continue;
		if (entries.some((entry) => blockingIssueCount(entry.report) > 0)) continue;
		const [firstEntry] = entries;
		if (!firstEntry) continue;
		const archivePath = archiveLegacySessionStore(firstEntry.target, firstEntry.report, activeRun);
		if (!archivePath) continue;
		for (const entry of entries.slice(1)) recordLegacyStoreMoveForTarget(entry.target, archivePath, activeRun);
	}
}
function archiveLegacySessionStore(target, report, activeRun) {
	if (!fs.existsSync(target.storePath)) return;
	try {
		const archivePath = moveSessionJsonlToArchive({
			activeRun,
			archiveKey: "legacy-store",
			baseNameRaw: path.basename(target.storePath),
			kind: "legacy-store",
			sourcePathRaw: target.storePath,
			target
		});
		(report.archivedLegacyStoreFiles ??= []).push(archivePath);
		return archivePath;
	} catch (err) {
		report.issues.push({
			code: "legacy_store_archive_failed",
			message: `${target.storePath}: ${String(err)}`
		});
		return;
	}
}
function recordLegacyStoreMoveForTarget(target, archivePath, activeRun) {
	const move = {
		archivePath,
		kind: "legacy-store",
		sourcePath: path.resolve(target.storePath)
	};
	recordPlannedMigrationMove(activeRun, createMigrationTargetInput(target), move);
	recordCompletedMigrationMove(activeRun, createMigrationTargetInput(target), move);
}
function validateLegacySessionRecord(target, record, report) {
	const normalizedKey = normalizeStoreSessionKey(record.sessionKey);
	const sqliteEntry = readOnlySqliteExactSessionEntry(target, normalizedKey);
	if (!sqliteEntry.ok) {
		report.issues.push({
			code: "sqlite_read_failed",
			message: `SQLite session entry read failed: ${String(sqliteEntry.error)}`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (!sqliteEntry.entry) {
		report.issues.push({
			code: "sqlite_entry_missing",
			message: `SQLite entry is missing for ${normalizedKey}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteEntry.entry.entry.sessionId !== record.entry.sessionId) {
		report.issues.push({
			code: "sqlite_entry_mismatch",
			message: `SQLite sessionId ${sqliteEntry.entry.entry.sessionId} does not match ${record.entry.sessionId}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	report.validatedEntries += 1;
	validateTranscriptEventCount(target, record, report);
}
function validateTranscriptEventCount(target, record, report) {
	const result = countTranscriptEvents(record);
	if (result.status === "missing") {
		const migratedEvents = countAlreadyMigratedTranscriptEventsForValidate(target, record);
		if (migratedEvents !== void 0) report.validatedTranscriptEvents += migratedEvents;
		return;
	}
	if (result.status !== "ok") {
		if (!hasSessionIssue(report, "transcript_malformed", record.sessionKey)) report.issues.push({
			code: "transcript_malformed",
			message: result.message,
			sessionKey: record.sessionKey
		});
		return;
	}
	const sqliteEvents = readOnlySqliteTranscriptEventCount(target, record.entry.sessionId);
	if (!sqliteEvents.ok) {
		report.issues.push({
			code: "sqlite_read_failed",
			message: `SQLite transcript count read failed: ${String(sqliteEvents.error)}`,
			sessionKey: record.sessionKey
		});
		return;
	}
	if (sqliteEvents.events !== result.events) {
		report.issues.push({
			code: "sqlite_transcript_count_mismatch",
			message: `SQLite transcript has ${sqliteEvents.events} events; source has ${result.events}.`,
			sessionKey: record.sessionKey
		});
		return;
	}
	report.validatedTranscriptEvents += sqliteEvents.events;
}
function hasSessionIssue(report, code, sessionKey) {
	return report.issues.some((issue) => issue.code === code && issue.sessionKey === sessionKey);
}
function countAlreadyMigratedTranscriptEventsForImport(target, record) {
	const normalizedKey = record.sessionKey;
	const sqliteEntry = readOnlySqliteExactSessionEntry(target, normalizedKey);
	if (!sqliteEntry.ok || sqliteEntry.entry?.entry.sessionId !== record.entry.sessionId) return;
	const eventCount = readOnlySqliteTranscriptEventCount(target, record.entry.sessionId);
	return eventCount.ok ? eventCount.events : void 0;
}
function countAlreadyMigratedTranscriptEventsForValidate(target, record) {
	const sqliteEntry = readOnlySqliteExactSessionEntry(target, normalizeStoreSessionKey(record.sessionKey));
	if (!sqliteEntry.ok || sqliteEntry.entry?.entry.sessionId !== record.entry.sessionId) return;
	const eventCount = readOnlySqliteTranscriptEventCount(target, record.entry.sessionId);
	return eventCount.ok ? eventCount.events : void 0;
}
function countTranscriptEvents(record) {
	return countTranscriptEventsForPath(record.transcriptPath);
}
function readLegacyTranscriptMtimeMs(record) {
	if (!record.transcriptPath) return;
	try {
		const mtimeMs = Math.floor(fs.statSync(record.transcriptPath).mtimeMs);
		return Number.isFinite(mtimeMs) && mtimeMs >= 0 ? mtimeMs : void 0;
	} catch {
		return;
	}
}
function listUnreferencedJsonlFiles(storePath, referencedPaths) {
	const sessionsDir = path.dirname(storePath);
	let entries;
	try {
		entries = fs.readdirSync(sessionsDir);
	} catch {
		return [];
	}
	const referenced = new Set(referencedPaths.map((filePath) => canonicalFilePath(filePath)));
	return entries.filter((entry) => entry.endsWith(".jsonl")).map((entry) => path.join(sessionsDir, entry)).filter((filePath) => !referenced.has(canonicalFilePath(filePath))).toSorted((a, b) => a.localeCompare(b));
}
function appendActiveSqliteTranscriptFileIssues(target, report) {
	const result = readOnlySqliteSessionEntries(target);
	if (!result.ok) {
		report.issues.push({
			code: "sqlite_active_transcript_scan_failed",
			message: `Could not scan SQLite-backed sessions for active JSONL transcript files: ${String(result.error)}`
		});
		return;
	}
	for (const summary of result.summaries) {
		const transcriptPath = resolveActiveSqliteTranscriptFile(target, summary.entry);
		if (!transcriptPath) continue;
		report.issues.push({
			code: "active_sqlite_transcript_jsonl",
			message: `SQLite-backed session still has an active JSONL transcript file: ${transcriptPath}`,
			sessionKey: summary.sessionKey
		});
	}
}
function appendSqliteDbStats(target, report) {
	const result = readOnlySqliteDbStats(target);
	if (!result.ok) {
		report.issues.push({
			code: "sqlite_corrupt",
			message: `SQLite database could not be inspected: ${String(result.error)}`
		});
		return;
	}
	report.dbStats = result.stats;
	if (result.stats.integrityCheck && result.stats.integrityCheck !== "ok") report.issues.push({
		code: "sqlite_integrity_check_failed",
		message: `SQLite quick_check reported: ${result.stats.integrityCheck}`
	});
}
function compactSqliteDatabase(target, report, options = {}) {
	try {
		if (options.closeImportedHandle) closeOpenClawAgentDatabaseByPath(resolveTargetSqlitePath(target));
		report.compact = options.migrateOlderSchema ? compactDoctorSessionSqliteTarget(target, {
			env: options.env,
			migrateOlderSchema: true
		}) : compactDoctorSessionSqliteTarget(target, { env: options.env });
	} catch (err) {
		report.issues.push({
			code: "sqlite_compact_failed",
			message: `SQLite database compact failed: ${String(err)}`
		});
	}
}
function resolveActiveSqliteTranscriptFile(target, entry) {
	let transcriptPath;
	try {
		transcriptPath = resolveSessionFilePathCore(entry.sessionId, entry, {
			agentId: target.agentId,
			sessionsDir: path.dirname(target.storePath)
		});
	} catch {
		return;
	}
	if (!transcriptPath.endsWith(".jsonl")) return;
	let stat;
	try {
		stat = fs.statSync(transcriptPath);
	} catch {
		return;
	}
	if (!stat.isFile()) return;
	const sessionsDir = canonicalFilePath(path.dirname(target.storePath));
	const activePath = canonicalFilePath(transcriptPath);
	if (path.dirname(activePath) !== sessionsDir) return;
	return activePath;
}
function moveImportedTranscriptArtifactsToArchive(target, sessionKey, transcriptPath, activeRun) {
	const archived = [moveImportedTranscriptToArchive(target, sessionKey, transcriptPath, "transcript", activeRun)];
	const trajectoryPath = resolveTrajectoryPath(transcriptPath);
	if (trajectoryPath && fs.existsSync(trajectoryPath)) archived.push(moveImportedTranscriptToArchive(target, sessionKey, trajectoryPath, "trajectory", activeRun));
	const trajectoryPointerPath = resolveTrajectoryPointerPath(transcriptPath);
	if (trajectoryPointerPath && fs.existsSync(trajectoryPointerPath)) archived.push(moveImportedTranscriptToArchive(target, sessionKey, trajectoryPointerPath, "trajectory", activeRun));
	return archived;
}
function resolveTrajectoryPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory.jsonl` : void 0;
}
function resolveTrajectoryPointerPath(transcriptPath) {
	return transcriptPath.endsWith(".jsonl") ? `${transcriptPath.slice(0, -6)}.trajectory-path.json` : void 0;
}
function moveImportedTranscriptToArchive(target, sessionKey, sourcePathRaw, kind, activeRun) {
	return moveSessionJsonlToArchive({
		activeRun,
		archiveKey: sessionKey,
		baseNameRaw: path.basename(sourcePathRaw),
		kind,
		sessionKey,
		sourcePathRaw,
		target
	});
}
function moveSessionJsonlToArchive(params) {
	const move = planSessionJsonlArchiveMove(params);
	const migrationTarget = createMigrationTargetInput(params.target);
	recordPlannedMigrationMove(params.activeRun, migrationTarget, move);
	assertSafeSessionSqliteMigrationMove(move, migrationTarget);
	fs.renameSync(move.sourcePath, move.archivePath);
	recordCompletedMigrationMove(params.activeRun, migrationTarget, move);
	return move.archivePath;
}
function planSessionJsonlArchiveMove(params) {
	const sourcePathRaw = path.resolve(params.sourcePathRaw);
	if (!fs.lstatSync(sourcePathRaw).isFile()) throw new Error("source is not a regular file");
	const sourcePath = path.join(canonicalFilePath(path.dirname(sourcePathRaw)), path.basename(sourcePathRaw));
	const sessionsDir = canonicalFilePath(path.dirname(path.resolve(params.target.storePath)));
	if (path.dirname(sourcePath) !== sessionsDir) throw new Error(`Migration source is outside the target sessions directory: ${sourcePath}`);
	const archiveDir = resolveImportedTranscriptArchiveDir(params.target.storePath);
	assertSafeSessionSqliteMigrationDirectory(archiveDir);
	fs.mkdirSync(archiveDir, { recursive: true });
	assertSafeSessionSqliteMigrationDirectory(archiveDir);
	const baseName = params.baseNameRaw.replace(/[^A-Za-z0-9_.-]+/g, "_").slice(0, 160) || "artifact";
	const keySlug = params.archiveKey.replace(/[^A-Za-z0-9_.-]+/g, "_").slice(0, 120) || "session";
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const suffix = attempt === 0 ? "" : `.${attempt}`;
		const archivePath = path.join(archiveDir, `${keySlug}.${baseName}.imported-${Date.now()}${suffix}`);
		if (fs.existsSync(archivePath) || params.reservedArchivePaths?.has(archivePath)) continue;
		return {
			archivePath,
			kind: params.kind,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			sourcePath
		};
	}
	throw new Error(`Could not archive ${baseName} for ${params.archiveKey}`);
}
function resolveImportedTranscriptArchiveDir(storePath) {
	const storeDir = canonicalFilePath(path.dirname(path.resolve(storePath)));
	return path.join(path.dirname(storeDir), "session-sqlite-import-archive");
}
function canonicalFilePath(filePath) {
	try {
		return fs.realpathSync.native(filePath);
	} catch {
		return path.resolve(filePath);
	}
}
function createMigrationTargetInput(target) {
	return {
		agentId: target.agentId,
		sqlitePath: canonicalMigrationFilePath(resolveTargetSqlitePath(target)),
		storePath: canonicalMigrationFilePath(target.storePath)
	};
}
function isSessionEntry(value) {
	return isRecord(value) && typeof value.sessionId === "string" && value.sessionId.trim() !== "";
}
function summarizeDoctorSessionSqliteReport(mode, targets, activeRun) {
	const sum = (value) => sumDoctorSessionSqliteTargets(targets, value);
	return {
		...activeRun ? { migrationRun: {
			...activeRun.manifest.failureReports ? {
				failureReportJsonPath: activeRun.manifest.failureReports.jsonPath,
				failureReportMarkdownPath: activeRun.manifest.failureReports.markdownPath
			} : {},
			manifestPath: activeRun.manifestPath,
			runId: activeRun.manifest.runId
		} } : {},
		mode,
		targets,
		totals: createDoctorSessionSqliteTotals(targets, {
			archivedLegacyStoreFiles: sum((target) => target.archivedLegacyStoreFiles?.length ?? 0),
			archivedTranscriptFiles: sum((target) => target.archivedTranscriptFiles.length),
			archivedUnreferencedJsonlFiles: sum((target) => target.archivedUnreferencedJsonlFiles.length),
			importedEntries: sum((target) => target.importedEntries),
			importedTranscriptEvents: sum((target) => target.importedTranscriptEvents),
			legacyEntries: sum((target) => target.legacyEntries),
			reclaimedBytes: sum((target) => target.compact?.reclaimedBytes ?? 0),
			unreferencedJsonlFiles: sum((target) => target.unreferencedJsonlFiles.length),
			validatedEntries: sum((target) => target.validatedEntries),
			validatedTranscriptEvents: sum((target) => target.validatedTranscriptEvents)
		})
	};
}
//#endregion
export { restoreSessionSqliteMigrationRun, runDoctorSessionSqlite, writeSessionSqliteMigrationFailureReports };
