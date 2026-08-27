import { a as toStringifiedError } from "./error-coercion-DisD0JTb.js";
import { m as syncDirectoryBestEffortSync } from "./pinned-write-BZU6lFjb.js";
import { _ as readSessionArchiveContentSync, h as encodeSessionArchiveContent, n as formatSessionArchiveTimestamp, p as SESSION_ARCHIVE_ZSTD_SUFFIX } from "./artifacts-Cg2BoGvO.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import "./directory-durability-C8NmNClX.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Worker } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-archive.ts
function sqliteSessionStateDeleteSnapshotsEqual(left, right) {
	return left.acpParentStreamEventCount === right.acpParentStreamEventCount && left.generation === right.generation && left.lastSeq === right.lastSeq && left.sessionUpdatedAt === right.sessionUpdatedAt && left.trajectoryLastSeq === right.trajectoryLastSeq && left.transcriptUpdatedAt === right.transcriptUpdatedAt;
}
function resolveSqliteTranscriptArchivePath(params) {
	const archiveDirectory = path.resolve(params.archiveDirectory);
	const archivePath = path.resolve(archiveDirectory, `${params.sessionId}.jsonl.${params.reason}.${formatSessionArchiveTimestamp(params.nowMs)}`);
	if (path.dirname(archivePath) !== archiveDirectory) throw new Error(`Cannot archive SQLite transcript outside ${archiveDirectory}`);
	return archivePath;
}
function findMatchingSqliteTranscriptArchive(params) {
	let entries;
	try {
		entries = fs.readdirSync(params.archiveDirectory);
	} catch {
		return null;
	}
	const prefix = `${params.sessionId}.jsonl.${params.reason}.`;
	for (const entry of entries) {
		if (!entry.startsWith(prefix) || entry.endsWith(".tmp")) continue;
		const archivePath = path.join(params.archiveDirectory, entry);
		const compressed = entry.endsWith(SESSION_ARCHIVE_ZSTD_SUFFIX);
		try {
			const stat = fs.statSync(archivePath);
			if (!stat.isFile()) continue;
			if (!compressed && stat.size !== Buffer.byteLength(params.content, "utf8")) continue;
			if (readSessionArchiveContentSync(archivePath) === params.content) return archivePath;
		} catch {
			continue;
		}
	}
	return null;
}
/** Writes or reuses a transcript archive and returns its durable path. */
function writeTranscriptArchive(params) {
	fs.mkdirSync(params.archiveDirectory, { recursive: true });
	const existing = findMatchingSqliteTranscriptArchive(params);
	if (existing) return existing;
	const encoded = encodeSessionArchiveContent(params.content);
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const archivePath = `${resolveSqliteTranscriptArchivePath({
			archiveDirectory: params.archiveDirectory,
			reason: params.reason,
			sessionId: params.sessionId,
			nowMs: Date.now() + attempt
		})}${encoded.suffix}`;
		if (fs.existsSync(archivePath)) continue;
		const tempPath = `${archivePath}.${randomUUID()}.tmp`;
		try {
			writeDurableFileExclusive(tempPath, encoded.bytes);
			fs.renameSync(tempPath, archivePath);
			syncDirectoryBestEffortSync(params.archiveDirectory);
			if (readSessionArchiveContentSync(archivePath) !== params.content) {
				fs.rmSync(archivePath, { force: true });
				throw new Error(`SQLite transcript archive verification failed for ${params.sessionId}`);
			}
			return archivePath;
		} catch (error) {
			fs.rmSync(tempPath, { force: true });
			if (error?.code === "EEXIST") continue;
			throw error;
		}
	}
	throw new Error(`Could not create SQLite transcript archive for ${params.sessionId}`);
}
function writeDurableFileExclusive(filePath, content) {
	const fd = fs.openSync(filePath, "wx", 384);
	try {
		fs.writeFileSync(fd, content);
		fs.fsyncSync(fd);
	} finally {
		fs.closeSync(fd);
	}
}
function resolveSqliteTranscriptArchiveWorkerUrl(currentModuleUrl = import.meta.url) {
	const currentPath = fileURLToPath(currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		return pathToFileURL(path.join(distRoot, "config", "sessions", "session-accessor.sqlite-archive.worker.js"));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./session-accessor.sqlite-archive.worker${extension}`, currentModuleUrl);
}
function resolveSourceWorkerExecArgv() {
	const tsxApiUrl = import.meta.resolve("tsx/esm/api");
	const registerTsx = `import { register } from ${JSON.stringify(tsxApiUrl)}; register();`;
	return ["--import", `data:text/javascript,${encodeURIComponent(registerTsx)}`];
}
function spawnSqliteTranscriptArchiveWorker(plans) {
	const workerUrl = resolveSqliteTranscriptArchiveWorkerUrl();
	let worker;
	try {
		const sourceWorkerExecArgv = workerUrl.pathname.endsWith(".ts") ? resolveSourceWorkerExecArgv() : void 0;
		worker = new Worker(workerUrl, {
			workerData: {
				type: "sqlite-transcript-archive-v1",
				plans
			},
			execArgv: sourceWorkerExecArgv
		});
	} catch (error) {
		return Promise.reject(toStringifiedError(error));
	}
	return new Promise((resolve, reject) => {
		let results;
		let workerError;
		worker.once("message", (message) => {
			results = message.results;
		});
		worker.once("error", (error) => {
			workerError = toStringifiedError(error);
		});
		worker.once("exit", (code) => {
			worker.removeAllListeners();
			if (workerError) {
				reject(workerError);
				return;
			}
			if (code !== 0) {
				reject(/* @__PURE__ */ new Error(`SQLite transcript archive worker exited with code ${code}`));
				return;
			}
			if (!results) {
				reject(/* @__PURE__ */ new Error("SQLite transcript archive worker exited without results"));
				return;
			}
			resolve(results);
		});
	});
}
const sqliteTranscriptArchiveWorkerQueue = new KeyedAsyncQueue();
const SQLITE_TRANSCRIPT_ARCHIVE_WORKER_QUEUE_KEY = "lifecycle-archive";
function runSqliteTranscriptArchiveWorker(plans) {
	return sqliteTranscriptArchiveWorkerQueue.enqueue(SQLITE_TRANSCRIPT_ARCHIVE_WORKER_QUEUE_KEY, () => spawnSqliteTranscriptArchiveWorker(plans));
}
async function materializeSessionStateDeletePlans(plans) {
	const deduped = dedupeSqliteSessionStateDeletePlans(plans);
	const archivePlans = deduped.filter((plan) => plan.archiveTranscript);
	const workerResults = archivePlans.length > 0 ? await runSqliteTranscriptArchiveWorker(archivePlans) : [];
	const resultBySessionId = new Map(workerResults.map((result) => [result.sessionId, result]));
	return deduped.map((plan) => {
		if (!plan.archiveTranscript) return Object.assign({}, plan, { archivedTranscript: null });
		const result = resultBySessionId.get(plan.sessionId);
		if (!result) throw new Error(`SQLite transcript archive worker omitted ${plan.sessionId}`);
		const archivedTranscript = result.archivedPath ? {
			archivedPath: result.archivedPath,
			sourcePath: path.join(plan.archiveDirectory, `${plan.sessionId}.jsonl`)
		} : null;
		return Object.assign({}, plan, { archivedTranscript });
	});
}
function dedupeSqliteSessionStateDeletePlans(plans) {
	const deduped = /* @__PURE__ */ new Map();
	for (const plan of plans) {
		const existing = deduped.get(plan.sessionId);
		if (!existing) {
			deduped.set(plan.sessionId, plan);
			continue;
		}
		if (existing.agentId !== plan.agentId || existing.archiveDirectory !== plan.archiveDirectory || existing.databasePath !== plan.databasePath || existing.reason !== plan.reason || !sqliteSessionStateDeleteSnapshotsEqual(existing.snapshot, plan.snapshot)) throw new Error(`Conflicting SQLite transcript archive plans for ${plan.sessionId}`);
		if (!existing.archiveTranscript && plan.archiveTranscript) deduped.set(plan.sessionId, {
			...existing,
			archiveTranscript: true
		});
	}
	return [...deduped.values()];
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-delete-snapshot.ts
function normalizeOptionalSqliteNumber(value) {
	return value === null || value === void 0 ? null : Number(value);
}
/** Captures the owner window and canonical child state writable outside the lifecycle queue. */
function readSessionStateDeleteSnapshot(database, sessionId) {
	const db = getNodeSqliteKysely(database);
	const window = executeSqliteQueryTakeFirstSync(database, db.selectFrom("session_windows").select(["transcript_updated_at", "updated_at"]).where("session_id", "=", sessionId));
	const rewriteWatermark = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_rewrite_watermarks").select("generation").where("session_id", "=", sessionId));
	const lastEvent = executeSqliteQueryTakeFirstSync(database, db.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	const lastTrajectory = executeSqliteQueryTakeFirstSync(database, db.selectFrom("trajectory_runtime_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1));
	return {
		acpParentStreamEventCount: normalizeOptionalSqliteNumber(executeSqliteQueryTakeFirstSync(database, db.selectFrom("acp_parent_stream_events").select((eb) => eb.fn.countAll().as("event_count")).where("session_id", "=", sessionId))?.event_count) ?? 0,
		generation: rewriteWatermark?.generation ?? null,
		lastSeq: lastEvent?.seq ?? null,
		sessionUpdatedAt: window?.updated_at ?? null,
		trajectoryLastSeq: lastTrajectory?.seq ?? null,
		transcriptUpdatedAt: window?.transcript_updated_at ?? null
	};
}
//#endregion
export { writeTranscriptArchive as i, materializeSessionStateDeletePlans as n, sqliteSessionStateDeleteSnapshotsEqual as r, readSessionStateDeleteSnapshot as t };
