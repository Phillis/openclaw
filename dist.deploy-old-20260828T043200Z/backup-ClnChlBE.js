import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import { E as resolveDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import { t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import { d as pinDirectory, f as syncDirectory } from "./pinned-write-powa_mtU.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { f as resolveHomeDir } from "./utils-Bw16L5tB.js";
import { t as sleep } from "./sleep-D7nua6TP.js";
import { n as isErrno, t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { g as resolveGatewayLockDir } from "./paths-BBSTUjD5.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { u as writeJson } from "./json-Dx6zyhjY.js";
import "./json-files-E5e5TtK3.js";
import { l as resolveRuntimeServiceVersion } from "./version-CkBmshxX.js";
import { An as executeSqliteQuerySync, Ln as readSqliteUserVersion, Mn as getNodeSqliteKysely, Ot as assertOpenClawStateDatabaseOwner, Yt as resolveOpenClawStateSqlitePath, bt as resolveSqliteDatabaseFilePaths, vt as SQLITE_SIDECAR_SUFFIXES } from "./openclaw-state-db-CeAO_dqo.js";
import { a as resolveSqliteFilesystemPath, n as requireNodeSqlite, t as openNodeSqliteDatabase } from "./node-sqlite-_e3IvfT7.js";
import { c as createPrivateSqliteTempDirectory, o as withSqliteSnapshotSource } from "./sqlite-readonly-location-BUsr5nKz.js";
import { t as assertSqliteIntegrity } from "./sqlite-integrity-D3VwDKmB.js";
import { a as isHardlinkFallbackError, i as syncDirectoryIfSupported, n as publishFileNoClobber, o as publishFileExclusive, r as requireDirectorySync, t as getPublishFileExclusiveFailureDetails } from "./directory-durability-y-xIUhxC.js";
import { n as assertOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-maintenance-DDqVWNe-.js";
import { d as tryParsePersistedExecApprovals } from "./exec-approvals-config-_UJgdeLU.js";
import { a as projectionValues } from "./exec-approvals-sqlite-DwEMj6ui.js";
import { t as loadSqliteVecExtension } from "./sqlite-vec-yun6599L.js";
import "./engine-storage-DHIZuZ7Z.js";
import { n as isPathWithin } from "./cleanup-utils-BFaP5a7r.js";
import { n as isVolatileBackupPath, t as isTransientSqliteBackupPath } from "./backup-volatile-filter-DWFmNw39.js";
import { n as createBackupVolatileStatCache, t as createBackupLinkCache } from "./backup-volatile-stat-cache-C2KEj1to.js";
import { c as buildBackupArchiveRoot, l as canonicalizePathForContainment, o as buildBackupArchiveBasename, p as resolveBackupPlanFromDisk, s as buildBackupArchivePath, t as assertArchiveSymbolicLinkTarget, u as recordBackupOutcomeBestEffort } from "./backup-archive-path-policy-BahRwjJ_.js";
import { a as readLegacyAuditSourcePrefixSnapshotForBackup, d as prepareLegacyAuditRecords, f as serializePreparedAuditRecords, g as legacyAuditSourceGenerationKey, h as legacyAuditRawCheckpointKey, i as readLegacyAuditRecoverySourceForBackup, p as detectLegacyAuditLogs, r as findPreviousLegacyAuditRawCheckpoint, t as withLegacyAuditMigrationLease } from "./state-migrations.audit-coordination-BfNAim-7.js";
import fs, { createWriteStream } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import { Transform } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region src/infra/sqlite-snapshot.ts
async function assertRegularSourceFile(sourcePath, requireNonEmptySource) {
	const stat = await fs$1.lstat(sourcePath);
	if (!stat.isFile()) throw new Error(`SQLite snapshot source must be a regular file: ${sourcePath}`);
	if (requireNonEmptySource && stat.size === 0) throw new Error(`SQLite snapshot source must not be empty: ${sourcePath}`);
}
async function assertTargetAbsent$1(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`SQLite snapshot target already exists: ${targetPath}`);
}
async function copyFileExclusive(source, targetPath) {
	const sourceFingerprint = await readMutationFingerprint(source);
	let target;
	let targetIdentity;
	try {
		target = await fs$1.open(targetPath, "wx+", 384);
		targetIdentity = await target.stat();
		const buffer = Buffer.allocUnsafe(1024 * 1024);
		const hash = createHash("sha256");
		let offset = 0;
		while (true) {
			const { bytesRead } = await source.read(buffer, 0, buffer.length, offset);
			if (bytesRead === 0) break;
			hash.update(buffer.subarray(0, bytesRead));
			let bytesWritten = 0;
			while (bytesWritten < bytesRead) {
				const result = await target.write(buffer, bytesWritten, bytesRead - bytesWritten, offset + bytesWritten);
				if (result.bytesWritten === 0) throw new Error(`SQLite snapshot copy made no progress: ${targetPath}`);
				bytesWritten += result.bytesWritten;
			}
			offset += bytesRead;
		}
		await assertMutationFingerprintUnchanged(source, sourceFingerprint, targetPath);
		await target.sync();
		const currentIdentity = await fs$1.lstat(targetPath);
		if (!sameFileIdentity(targetIdentity, currentIdentity)) throw new Error(`SQLite snapshot target changed during publication: ${targetPath}`);
		return {
			content: {
				sha256: hash.digest("hex"),
				sizeBytes: offset
			},
			identity: currentIdentity
		};
	} catch (error) {
		if (targetIdentity) {
			await target?.close().catch(() => void 0);
			target = void 0;
			removePublishedTargetIfOwned(targetPath, targetIdentity);
		}
		throw error;
	} finally {
		await target?.close().catch(() => void 0);
	}
}
async function readMutationFingerprint(handle) {
	const stat = await handle.stat({ bigint: true });
	return {
		birthtimeNs: stat.birthtimeNs,
		ctimeNs: stat.ctimeNs,
		dev: stat.dev,
		ino: stat.ino,
		mtimeNs: stat.mtimeNs,
		size: stat.size
	};
}
async function assertMutationFingerprintUnchanged(handle, expected, filePath) {
	const current = await readMutationFingerprint(handle);
	if (current.birthtimeNs !== expected.birthtimeNs || current.ctimeNs !== expected.ctimeNs || current.dev !== expected.dev || current.ino !== expected.ino || current.mtimeNs !== expected.mtimeNs || current.size !== expected.size) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
}
function sameMutationFingerprint(left, right) {
	return left.birthtimeNs === right.birthtimeNs && left.ctimeNs === right.ctimeNs && left.dev === right.dev && left.ino === right.ino && left.mtimeNs === right.mtimeNs && left.size === right.size;
}
async function syncFile(filePath) {
	const handle = await fs$1.open(filePath, "r+");
	try {
		await handle.sync();
	} finally {
		await handle.close();
	}
}
async function assertOpenFileIdentity(handle, filePath, expectedIdentity) {
	const openedIdentity = await handle.stat();
	const currentIdentity = await fs$1.lstat(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
async function hashPublishedFile(filePath, expectedIdentity) {
	const handle = await fs$1.open(filePath, "r");
	try {
		return await hashOpenPublishedFile(handle, filePath, expectedIdentity);
	} finally {
		await handle.close();
	}
}
async function hashOpenPublishedFile(handle, filePath, expectedIdentity) {
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	const fingerprint = await readMutationFingerprint(handle);
	const buffer = Buffer.allocUnsafe(1024 * 1024);
	const hash = createHash("sha256");
	let offset = 0;
	while (true) {
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, offset);
		if (bytesRead === 0) break;
		hash.update(buffer.subarray(0, bytesRead));
		offset += bytesRead;
	}
	await assertMutationFingerprintUnchanged(handle, fingerprint, filePath);
	await assertOpenFileIdentity(handle, filePath, expectedIdentity);
	return {
		sha256: hash.digest("hex"),
		sizeBytes: offset
	};
}
function assertPublishedFileIdentitySync(filePath, expectedIdentity) {
	const currentIdentity = fs.lstatSync(filePath);
	if (!currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, currentIdentity) || expectedIdentity.size !== currentIdentity.size || expectedIdentity.mtimeMs !== currentIdentity.mtimeMs || expectedIdentity.ctimeMs !== currentIdentity.ctimeMs || expectedIdentity.birthtimeMs !== currentIdentity.birthtimeMs) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity) {
	const openedIdentity = fs.fstatSync(fileDescriptor);
	const currentIdentity = fs.lstatSync(filePath);
	if (!openedIdentity.isFile() || !currentIdentity.isFile() || !sameFileIdentity(expectedIdentity, openedIdentity) || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite snapshot file changed: ${filePath}`);
}
function hashPublishedFileSync(filePath, expectedIdentity) {
	const fileDescriptor = fs.openSync(filePath, "r");
	try {
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		const initialStat = fs.fstatSync(fileDescriptor, { bigint: true });
		const initialFingerprint = {
			birthtimeNs: initialStat.birthtimeNs,
			ctimeNs: initialStat.ctimeNs,
			dev: initialStat.dev,
			ino: initialStat.ino,
			mtimeNs: initialStat.mtimeNs,
			size: initialStat.size
		};
		const hash = createHash("sha256");
		const buffer = Buffer.allocUnsafe(1024 * 1024);
		let offset = 0;
		while (true) {
			const bytesRead = fs.readSync(fileDescriptor, buffer, 0, buffer.length, offset);
			if (bytesRead === 0) break;
			hash.update(buffer.subarray(0, bytesRead));
			offset += bytesRead;
		}
		const finalStat = fs.fstatSync(fileDescriptor, { bigint: true });
		if (!sameMutationFingerprint(initialFingerprint, {
			birthtimeNs: finalStat.birthtimeNs,
			ctimeNs: finalStat.ctimeNs,
			dev: finalStat.dev,
			ino: finalStat.ino,
			mtimeNs: finalStat.mtimeNs,
			size: finalStat.size
		})) throw new Error(`SQLite snapshot file changed while reading: ${filePath}`);
		assertOpenFileIdentitySync(fileDescriptor, filePath, expectedIdentity);
		return {
			sha256: hash.digest("hex"),
			sizeBytes: offset
		};
	} finally {
		fs.closeSync(fileDescriptor);
	}
}
function assertExpectedContent(actual, expected, filePath) {
	if (actual.sizeBytes !== expected.sizeBytes) throw new Error(`SQLite snapshot size mismatch for ${filePath}: expected ${expected.sizeBytes}, got ${actual.sizeBytes}`);
	if (actual.sha256 !== expected.sha256) throw new Error(`SQLite snapshot hash mismatch for ${filePath}: expected ${expected.sha256}, got ${actual.sha256}`);
}
function removePublishedTargetIfOwned(filePath, expectedIdentity, requireFingerprint = false) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(filePath);
	} catch {
		return false;
	}
	const fingerprintMatches = !requireFingerprint || typeof expectedIdentity.size === "number" && typeof expectedIdentity.mtimeMs === "number" && typeof expectedIdentity.ctimeMs === "number" && typeof expectedIdentity.birthtimeMs === "number" && expectedIdentity.size === currentIdentity.size && expectedIdentity.mtimeMs === currentIdentity.mtimeMs && expectedIdentity.ctimeMs === currentIdentity.ctimeMs && expectedIdentity.birthtimeMs === currentIdentity.birthtimeMs;
	if (!sameFileIdentity(expectedIdentity, currentIdentity) || !fingerprintMatches) return false;
	try {
		fs.unlinkSync(filePath);
		return true;
	} catch {
		return false;
	}
}
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size && left.mtimeMs === right.mtimeMs && left.birthtimeMs === right.birthtimeMs;
}
function assertSynchronousCallbackResult(result, label) {
	if (result && (typeof result === "object" || typeof result === "function") && typeof result.then === "function") {
		Promise.resolve(result).catch(() => void 0);
		throw new Error(`${label} must be synchronous.`);
	}
}
/**
* Publish the exact bytes of one already-verified SQLite file without reopening
* its pathname during the copy. The target is always created exclusively.
*/
async function publishVerifiedSqliteFile(options) {
	await assertTargetAbsent$1(options.targetPath);
	const targetDirectory = path.resolve(path.dirname(options.targetPath));
	const targetDirectoryPin = await pinDirectory(targetDirectory, { label: "SQLite publication directory" });
	const targetDirectoryReceipt = targetDirectoryPin.receipt;
	let stagingDir;
	try {
		stagingDir = await createPrivateSqliteTempDirectory(targetDirectory, `.sqlite-publish-${randomUUID()}-`);
	} catch (error) {
		await targetDirectoryPin.close().catch(() => void 0);
		throw error;
	}
	const stagedPath = path.join(stagingDir, "database.sqlite");
	let stagingIdentity;
	let source;
	let target;
	let targetPinFileDescriptor;
	let failedPublicationIdentity;
	let publishedIdentity;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir);
		await fs$1.chmod(stagingDir, 448);
		source = await fs$1.open(options.sourcePath, "r");
		await assertOpenFileIdentity(source, options.sourcePath, options.sourceIdentity);
		const staged = await copyFileExclusive(source, stagedPath);
		const expectedContent = options.expectedContent;
		assertExpectedContent(staged.content, expectedContent, options.targetPath);
		await source.close();
		source = void 0;
		await options.validatePublished?.(stagedPath);
		assertExpectedContent(await hashPublishedFile(stagedPath, staged.identity), expectedContent, options.targetPath);
		await options.beforePublish?.();
		await assertTargetAbsent$1(options.targetPath);
		const currentStagedIdentity = await fs$1.lstat(stagedPath);
		if (!sameFileStatFingerprint(staged.identity, currentStagedIdentity)) throw new Error(`SQLite snapshot staging file changed during publication: ${stagedPath}`);
		try {
			publishedIdentity = (await publishFileNoClobber(stagedPath, options.targetPath, {
				strategy: options.requireAtomicPublication ? "link-required" : "link-or-copy",
				durability: "fail-closed"
			})).identity;
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			const stagedAfterFailure = details?.targetCreated ? await fs$1.lstat(stagedPath).catch(() => void 0) : void 0;
			const targetAfterFailure = details?.targetCreated ? await fs$1.lstat(options.targetPath).catch(() => void 0) : void 0;
			const stagedPathChanged = !stagedAfterFailure || !sameFileStatFingerprint(staged.identity, stagedAfterFailure);
			if (details?.targetCreated && details.cleanup !== "removed" && stagedAfterFailure && targetAfterFailure && sameFileIdentity(stagedAfterFailure, targetAfterFailure)) failedPublicationIdentity = targetAfterFailure;
			else if (details?.targetCreated && details.cleanup !== "removed" && details.targetIdentity && targetAfterFailure && sameFileIdentity(details.targetIdentity, targetAfterFailure)) failedPublicationIdentity = targetAfterFailure;
			if (options.requireAtomicPublication && isHardlinkFallbackError(error)) throw new Error(`Atomic SQLite publication requires hard-link support in ${targetDirectory}.`, { cause: error });
			if (details?.targetCreated) {
				if (stagedPathChanged) throw new Error(`SQLite snapshot staging file changed during publication: ${options.targetPath}`, { cause: error });
				throw new Error(`SQLite snapshot target changed during publication: ${options.targetPath}`, { cause: error });
			}
			throw error;
		}
		if (!publishedIdentity) throw new Error(`SQLite snapshot target was not published: ${options.targetPath}`);
		const initialPublishedIdentity = publishedIdentity;
		target = await fs$1.open(options.targetPath, "r");
		await assertOpenFileIdentity(target, options.targetPath, initialPublishedIdentity);
		await fs$1.unlink(stagedPath);
		const expectedIdentity = await target.stat();
		publishedIdentity = expectedIdentity;
		assertExpectedContent(await hashOpenPublishedFile(target, options.targetPath, expectedIdentity), expectedContent, options.targetPath);
		await fs$1.rmdir(stagingDir);
		requireDirectorySync(await syncDirectory(targetDirectoryReceipt), "SQLite publication directory");
		await target.close();
		target = void 0;
		targetPinFileDescriptor = fs.openSync(options.targetPath, "r");
		assertOpenFileIdentitySync(targetPinFileDescriptor, options.targetPath, expectedIdentity);
		const guard = {
			assertTargetMatchesExpectedContent: (finalCheck) => {
				assertExpectedContent(hashPublishedFileSync(options.targetPath, expectedIdentity), expectedContent, options.targetPath);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			},
			assertTargetUnchanged: (finalCheck) => {
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
				assertSynchronousCallbackResult(finalCheck?.(), "SQLite publication final check");
				assertPublishedFileIdentitySync(options.targetPath, expectedIdentity);
			}
		};
		if (options.afterPublish) assertSynchronousCallbackResult(options.afterPublish(guard), "SQLite after-publication guard");
		else guard.assertTargetUnchanged();
		fs.closeSync(targetPinFileDescriptor);
		targetPinFileDescriptor = void 0;
	} catch (error) {
		if (target && publishedIdentity) {
			const openedIdentity = await target.stat().catch(() => void 0);
			if (openedIdentity && sameFileIdentity(openedIdentity, publishedIdentity)) publishedIdentity = openedIdentity;
		}
		const cleanupIdentity = publishedIdentity ?? failedPublicationIdentity;
		if (cleanupIdentity) {
			if (removePublishedTargetIfOwned(options.targetPath, cleanupIdentity, true)) await syncDirectory(targetDirectoryReceipt).catch(() => void 0);
		}
		if (stagingIdentity) await removePublicationStagingDirectory(stagingDir, stagingIdentity).catch(() => void 0);
		else await fs$1.rmdir(stagingDir).catch(() => void 0);
		throw error;
	} finally {
		if (targetPinFileDescriptor !== void 0) fs.closeSync(targetPinFileDescriptor);
		if (target) await target.close().catch(() => void 0);
		if (source) await source.close().catch(() => void 0);
		await targetDirectoryPin.close().catch(() => void 0);
	}
}
async function removePublicationStagingDirectory(stagingDir, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(stagingDir).catch(() => void 0);
	if (!currentIdentity) return;
	if (!currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) throw new Error(`SQLite publication staging directory changed: ${stagingDir}`);
	const entries = await fs$1.readdir(stagingDir, { withFileTypes: true });
	if (entries.length > 1 || entries.some((entry) => entry.name !== "database.sqlite" || !entry.isFile())) throw new Error(`SQLite publication staging directory has unexpected contents: ${stagingDir}`);
	const stagedEntry = entries[0];
	if (stagedEntry) await fs$1.unlink(path.join(stagingDir, stagedEntry.name));
	await fs$1.rmdir(stagingDir);
}
/**
* Compact one SQLite database into a fresh private file and verify the result.
*
* The source and output both receive full structural, index, and foreign-key
* checks. Only a fully verified, synced snapshot is published to the target.
*/
async function createVerifiedSqliteSnapshot(options) {
	await assertRegularSourceFile(options.sourcePath, options.requireNonEmptySource === true);
	await assertTargetAbsent$1(options.targetPath);
	const stagingDir = await createPrivateSqliteTempDirectory(path.dirname(options.targetPath), ".sqlite-snapshot-");
	await fs$1.chmod(stagingDir, 448);
	const stagedPath = path.join(stagingDir, "database.sqlite");
	const sqlite = requireNodeSqlite();
	let stagedIdentity;
	try {
		await withSqliteSnapshotSource(options.sourcePath, async (snapshotSourcePath) => {
			await fs$1.rm(stagedPath, { force: true });
			const source = openNodeSqliteDatabase(snapshotSourcePath, {
				allowExtension: true,
				readOnly: true
			});
			try {
				source.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF; BEGIN;");
				try {
					source.prepare("PRAGMA schema_version;").get();
					await loadSqliteVecExtension({ db: source });
					assertSqliteIntegrity(source, options.sourcePath);
					options.validate?.(source, options.sourcePath);
					await sqlite.backup(source, resolveSqliteFilesystemPath(stagedPath));
				} finally {
					source.exec("ROLLBACK;");
				}
			} finally {
				if (source.isOpen) source.close();
			}
		});
		await fs$1.chmod(stagedPath, 384);
		const snapshot = openNodeSqliteDatabase(stagedPath, { allowExtension: true });
		try {
			snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
			await loadSqliteVecExtension({ db: snapshot });
			snapshot.exec("PRAGMA journal_mode = DELETE;");
			if (options.transform) await options.transform(snapshot);
			snapshot.exec("VACUUM;");
			assertSqliteIntegrity(snapshot, options.targetPath);
			options.validate?.(snapshot, options.targetPath);
			const userVersion = readSqliteUserVersion(snapshot);
			snapshot.close();
			await syncFile(stagedPath);
			stagedIdentity = await fs$1.lstat(stagedPath);
			const expectedContent = await hashPublishedFile(stagedPath, stagedIdentity);
			await publishVerifiedSqliteFile({
				sourceIdentity: stagedIdentity,
				sourcePath: stagedPath,
				targetPath: options.targetPath,
				expectedContent,
				beforePublish: options.beforePublish,
				afterPublish: options.afterPublish,
				validatePublished: async (publishedPath) => {
					const published = openNodeSqliteDatabase(publishedPath, {
						allowExtension: true,
						readOnly: true
					});
					try {
						published.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
						await loadSqliteVecExtension({ db: published });
						assertSqliteIntegrity(published, options.targetPath);
						options.validate?.(published, options.targetPath);
						const publishedUserVersion = readSqliteUserVersion(published);
						if (publishedUserVersion !== userVersion) throw new Error(`SQLite snapshot user_version changed during publication: expected ${userVersion}, got ${publishedUserVersion}`);
					} finally {
						published.close();
					}
				}
			});
			return {
				path: options.targetPath,
				userVersion
			};
		} finally {
			if (snapshot.isOpen) snapshot.close();
		}
	} catch (error) {
		throw new Error(`SQLite database cannot be snapshotted safely: ${options.sourcePath}. ${formatErrorMessage(error)}`, { cause: error });
	} finally {
		await fs$1.rm(stagingDir, {
			force: true,
			recursive: true
		}).catch(() => void 0);
	}
}
//#endregion
//#region src/state/openclaw-state-snapshot-sanitizer.ts
const FAIL_CLOSED_EXEC_APPROVALS = {
	version: 1,
	defaults: {
		security: "deny",
		ask: "off",
		askFallback: "deny",
		autoAllowSkills: false
	},
	agents: {}
};
function tableExists(database, tableName) {
	return database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName)?.ok === 1;
}
/** Remove coordination rows that must never survive restore. */
function sanitizeOpenClawStateLeaseRows(database) {
	if (tableExists(database, "state_leases")) database.prepare("DELETE FROM state_leases").run();
}
/** Remove transient rows whose restoration would replay work or extend private-data retention. */
function sanitizeOpenClawGlobalStateSnapshot(database) {
	sanitizeOpenClawStateLeaseRows(database);
	if (tableExists(database, "delivery_queue_entries")) database.prepare("DELETE FROM delivery_queue_entries").run();
	if (tableExists(database, "plugin_blob_entries")) database.prepare("DELETE FROM plugin_blob_entries WHERE expires_at IS NOT NULL").run();
	if (tableExists(database, "exec_approvals_config")) {
		const stateDb = getNodeSqliteKysely(database);
		const rows = executeSqliteQuerySync(database, stateDb.selectFrom("exec_approvals_config").select(["config_key", "raw_json"])).rows;
		for (const row of rows) {
			let sanitized = FAIL_CLOSED_EXEC_APPROVALS;
			const parsed = tryParsePersistedExecApprovals(row.raw_json);
			if (parsed) {
				sanitized = structuredClone(parsed);
				if (sanitized.socket) delete sanitized.socket.token;
			}
			executeSqliteQuerySync(database, stateDb.updateTable("exec_approvals_config").set({
				raw_json: `${JSON.stringify(sanitized, null, 2)}\n`,
				...projectionValues(sanitized)
			}).where("config_key", "=", row.config_key));
		}
	}
}
//#endregion
//#region src/infra/backup-create-stream.ts
const BACKUP_ARCHIVE_IDLE_TIMEOUT_MS = 5 * 6e4;
function observeBackupTarEntryProgress(entry, reportProgress) {
	const wasFlowing = entry.flowing;
	entry.on("data", (chunk) => {
		reportProgress(typeof chunk === "string" ? Buffer.byteLength(chunk) : chunk.length);
	});
	if (!wasFlowing) entry.pause();
}
function removePreparedBackupArchive(prepared) {
	let currentIdentity;
	try {
		currentIdentity = fs.lstatSync(prepared.archivePath);
	} catch {
		return false;
	}
	if (!currentIdentity.isFile() || !sameFileIdentity(prepared.identity, currentIdentity)) return false;
	try {
		fs.unlinkSync(prepared.archivePath);
		return true;
	} catch {
		return false;
	}
}
async function writeArchiveStreamToFile(params) {
	const idleTimeoutMs = params.idleTimeoutMs ?? BACKUP_ARCHIVE_IDLE_TIMEOUT_MS;
	const controller = new AbortController();
	let archiveStream;
	let openedIdentity;
	let idleTimer;
	let idleTimeoutError;
	let lastEntryPath;
	let lastProgress;
	let outputBytes = 0;
	let producerBytes = 0;
	let settled = false;
	const reportProgress = (progress) => {
		if (settled) return;
		if (progress) {
			lastProgress = progress;
			if (progress.entryPath) lastEntryPath = progress.entryPath;
			if (progress.bytes) {
				if (progress.phase === "output") outputBytes += progress.bytes;
				else if (progress.phase === "raw") producerBytes += progress.bytes;
			}
		}
		if (idleTimer) clearTimeout(idleTimer);
		idleTimer = setTimeout(() => {
			const entrySuffix = lastEntryPath ? `, entry=${JSON.stringify(lastEntryPath.slice(-512))}` : "";
			idleTimeoutError = /* @__PURE__ */ new Error(`Backup archive write stalled: no progress observed for ${idleTimeoutMs}ms (phase=${lastProgress?.phase ?? "starting"}${entrySuffix}, rawBytes=${producerBytes}, outputBytes=${outputBytes})`);
			archiveStream?.destroy(idleTimeoutError);
			controller.abort(idleTimeoutError);
		}, idleTimeoutMs);
	};
	const progress = new Transform({ transform(chunk, _encoding, callback) {
		reportProgress({
			phase: "output",
			bytes: chunk.length
		});
		callback(null, chunk);
	} });
	const archiveWriteStream = createWriteStream(params.archivePath, {
		flags: "wx",
		flush: true,
		mode: 384
	});
	archiveWriteStream.once("open", (fileDescriptor) => {
		try {
			openedIdentity = fs.fstatSync(fileDescriptor);
		} catch (error) {
			archiveWriteStream.destroy(error);
		}
	});
	try {
		archiveStream = params.createArchiveStream(reportProgress);
		const pipelinePromise = pipeline$1(archiveStream, progress, archiveWriteStream, { signal: controller.signal });
		reportProgress();
		await pipelinePromise;
		const currentIdentity = await fs$1.lstat(params.archivePath);
		if (!openedIdentity?.isFile() || !currentIdentity.isFile() || !sameFileIdentity(openedIdentity, currentIdentity)) throw new Error(`Backup archive path changed while writing: ${params.archivePath}`);
		return {
			archivePath: params.archivePath,
			identity: currentIdentity
		};
	} catch (err) {
		archiveWriteStream.destroy();
		let cleanupReceipt = openedIdentity ? {
			archivePath: params.archivePath,
			identity: openedIdentity
		} : void 0;
		if (!cleanupReceipt) try {
			const currentIdentity = fs.lstatSync(params.archivePath);
			cleanupReceipt = currentIdentity.isFile() ? {
				archivePath: params.archivePath,
				identity: currentIdentity
			} : { archivePath: params.archivePath };
		} catch (cleanupError) {
			if (cleanupError.code !== "ENOENT") cleanupReceipt = { archivePath: params.archivePath };
		}
		if (cleanupReceipt && (!cleanupReceipt.identity || !removePreparedBackupArchive(cleanupReceipt))) params.onPartialArchive?.(cleanupReceipt);
		if (cleanupReceipt && !cleanupReceipt.identity) {
			if (!params.onPartialArchive) try {
				const currentIdentity = fs.lstatSync(cleanupReceipt.archivePath);
				if (currentIdentity.isFile()) removePreparedBackupArchive({
					archivePath: cleanupReceipt.archivePath,
					identity: currentIdentity
				});
			} catch {}
		}
		throw idleTimeoutError ?? err;
	} finally {
		settled = true;
		if (idleTimer) clearTimeout(idleTimer);
	}
}
//#endregion
//#region src/infra/backup-archive-publication.ts
function pathsEqual(left, right) {
	const resolvedLeft = path.resolve(left);
	const resolvedRight = path.resolve(right);
	return process.platform === "win32" ? resolvedLeft.toLowerCase() === resolvedRight.toLowerCase() : resolvedLeft === resolvedRight;
}
async function assertTargetAbsent(targetPath) {
	try {
		await fs$1.lstat(targetPath);
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
	throw new Error(`Refusing to overwrite existing backup archive: ${targetPath}`);
}
async function removeDirectoryIfOwned(directoryPath, expectedIdentity) {
	const currentIdentity = await fs$1.lstat(directoryPath).catch(() => void 0);
	if (!currentIdentity || !currentIdentity.isDirectory() || !sameFileIdentity(expectedIdentity, currentIdentity)) return false;
	try {
		await fs$1.rmdir(directoryPath);
		return true;
	} catch {
		return false;
	}
}
async function removeStagingDirectoryIfOwned(plan) {
	return await removeDirectoryIfOwned(plan.stagingDir, plan.stagingIdentity);
}
async function createBackupArchivePublication(outputPath) {
	const requestedOutputPath = path.resolve(outputPath);
	const requestedParentPath = path.dirname(requestedOutputPath);
	const canonicalParentPath = await fs$1.realpath(requestedParentPath);
	const parentIdentity = await fs$1.lstat(canonicalParentPath);
	if (!parentIdentity.isDirectory()) throw new Error(`Backup output parent is not a directory: ${requestedParentPath}`);
	const canonicalOutputPath = path.join(canonicalParentPath, path.basename(requestedOutputPath));
	await assertTargetAbsent(canonicalOutputPath);
	const stagingDir = await fs$1.mkdtemp(path.join(canonicalParentPath, `.openclaw-backup-publish-${randomUUID()}-`));
	let stagingIdentity;
	try {
		stagingIdentity = await fs$1.lstat(stagingDir);
		await fs$1.chmod(stagingDir, 448);
		return {
			canonicalOutputPath,
			canonicalParentPath,
			parentReceipt: {
				path: canonicalParentPath,
				realPath: canonicalParentPath,
				identity: parentIdentity
			},
			pendingCleanupArchives: [],
			requestedOutputPath,
			requestedParentPath,
			stagingDir,
			stagingIdentity,
			tempArchivePath: path.join(stagingDir, "archive.tar.gz.tmp")
		};
	} catch (error) {
		if (stagingIdentity) await removeDirectoryIfOwned(stagingDir, stagingIdentity);
		throw error;
	}
}
function retainArchiveForCleanup(plan, receipt) {
	for (const [index, candidate] of plan.pendingCleanupArchives.entries()) {
		if (!pathsEqual(candidate.archivePath, receipt.archivePath)) continue;
		if (!candidate.identity || !receipt.identity) {
			if (!candidate.identity && receipt.identity) plan.pendingCleanupArchives[index] = receipt;
			return;
		}
		if (sameFileIdentity(candidate.identity, receipt.identity)) return;
	}
	plan.pendingCleanupArchives.push(receipt);
}
async function removePendingBackupArchive(plan, receipt) {
	if (!pathsEqual(path.dirname(receipt.archivePath), plan.stagingDir)) return false;
	if (receipt.identity) return removePreparedBackupArchive(receipt);
	let currentIdentity;
	try {
		currentIdentity = await fs$1.lstat(receipt.archivePath);
	} catch (error) {
		return error.code === "ENOENT";
	}
	if (!currentIdentity.isFile()) return false;
	return removePreparedBackupArchive({
		archivePath: receipt.archivePath,
		identity: currentIdentity
	});
}
async function cleanupBackupArchivePublication(plan, log) {
	const retainedArchives = plan.pendingCleanupArchives.splice(0);
	for (const receipt of retainedArchives) if (!await removePendingBackupArchive(plan, receipt)) retainArchiveForCleanup(plan, receipt);
	if (await removeStagingDirectoryIfOwned(plan)) {
		await syncDirectoryIfSupported(plan.canonicalParentPath).catch(() => void 0);
		return;
	}
	if (await fs$1.lstat(plan.stagingDir).catch(() => void 0)) log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
}
async function publishPreparedBackupArchive(params) {
	const { plan, prepared } = params;
	let publicationPreserved = false;
	let committed = false;
	try {
		try {
			const publication = await publishFileExclusive({
				sourcePath: prepared.archivePath,
				targetPath: plan.canonicalOutputPath,
				expectedSourceIdentity: prepared.identity,
				parentReceipt: plan.parentReceipt,
				strategy: "link-required",
				onSyncFailure: "preserve"
			});
			publicationPreserved = true;
			requireDirectorySync(publication.directorySync, "Backup publication directory");
			committed = true;
		} catch (error) {
			const details = getPublishFileExclusiveFailureDetails(error);
			publicationPreserved ||= details?.cleanup === "preserved";
			if (error.code === "EEXIST") throw new Error(`Refusing to overwrite existing backup archive: ${plan.requestedOutputPath}`, { cause: error });
			if (isHardlinkFallbackError(error)) throw new Error(`Atomic backup publication requires hard-link support in ${plan.requestedParentPath}.`, { cause: error });
			if (error.code === "path-mismatch") throw new Error(`Backup archive changed during publication: ${plan.requestedOutputPath}`, { cause: error });
			throw error;
		}
		if (!removePreparedBackupArchive(prepared)) {
			retainArchiveForCleanup(plan, prepared);
			params.log?.(`Backup archiver preserved changed staging file ${prepared.archivePath}.`);
		}
		if (!await removeStagingDirectoryIfOwned(plan)) params.log?.(`Backup archiver preserved changed or non-empty staging directory ${plan.stagingDir}.`);
		await syncDirectoryIfSupported(plan.canonicalParentPath).catch((error) => {
			params.log?.(`Backup archiver could not sync cleanup in ${plan.canonicalParentPath}: ${error.code ?? String(error)}.`);
		});
	} catch (error) {
		if (!committed) {
			if (publicationPreserved) params.log?.(`Backup archiver preserved the final archive after publication failed: ${plan.requestedOutputPath}.`);
			if (!removePreparedBackupArchive(prepared)) retainArchiveForCleanup(plan, prepared);
			await removeStagingDirectoryIfOwned(plan);
		}
		throw error;
	}
}
//#endregion
//#region src/infra/state-migrations.audit-backup.ts
const LEGACY_AUDIT_LOGICAL_PATHS = [
	{
		directory: "logs",
		basename: "config-audit.jsonl"
	},
	{
		directory: "audit",
		basename: "system-agent.jsonl"
	},
	{
		directory: "audit",
		basename: "crestodian.jsonl"
	}
];
async function hasLegacyAuditBackupSources(stateDir) {
	for (const logical of LEGACY_AUDIT_LOGICAL_PATHS) {
		let entries;
		try {
			entries = await fs$1.readdir(path.join(stateDir, logical.directory));
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
		const escaped = logical.basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		const sourcePattern = new RegExp(`^(?:${escaped}|\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?|${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?)$`, "u");
		if (entries.some((entry) => sourcePattern.test(entry))) return true;
	}
	return false;
}
function isLegacyAuditMigrationBackupPath(sourcePath, stateDir) {
	const relativePath = path.relative(path.resolve(stateDir), path.resolve(sourcePath));
	if (!relativePath || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return false;
	const directory = path.dirname(relativePath);
	const basename = path.basename(relativePath);
	for (const logical of LEGACY_AUDIT_LOGICAL_PATHS) {
		if (directory !== logical.directory) continue;
		if (basename === logical.basename) return true;
		const escaped = logical.basename.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
		const claimPattern = new RegExp(`^\\.${escaped}\\.doctor-importing(?:\\.(?:[2-9]|[1-9][0-9]+))?$`, "u");
		const rawPattern = new RegExp(`^${escaped}\\.migrated(?:\\.(?:[2-9]|[1-9][0-9]+))?\\.raw(?:\\.doctor-scrub-(?:progress|restore|staging))?$`, "u");
		if (claimPattern.test(basename) || rawPattern.test(basename)) return true;
	}
	return false;
}
/** Replaces live raw checkpoints with metadata for the transformed backup files. */
function rewriteLegacyAuditBackupCheckpoints(database, snapshots) {
	if (database.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get("diagnostic_events")?.ok !== 1) return;
	const scope = "migration.legacy-audit-raw";
	database.prepare("DELETE FROM diagnostic_events WHERE scope = ?").run(scope);
	const insert = database.prepare(`INSERT INTO diagnostic_events (
        scope, event_key, payload_json, created_at, sequence
      ) VALUES (?, ?, ?, ?, ?)`);
	let sequence = 1;
	for (const snapshot of snapshots) {
		if (!snapshot.checkpoint) continue;
		insert.run(scope, snapshot.checkpoint.key, JSON.stringify(snapshot.checkpoint.value), 0, sequence);
		sequence += 1;
	}
}
async function createLegacyAuditBackupSnapshotsOnce(params) {
	const detected = detectLegacyAuditLogs({
		stateDir: params.stateDir,
		doctorOnlyStateMigrations: true
	});
	if (detected.sources.length === 0) return [];
	const root$1 = await root(params.stateDir, {
		hardlinks: "reject",
		maxBytes: Number.MAX_SAFE_INTEGER,
		mkdir: false,
		mode: 384,
		symlinks: "reject"
	});
	const snapshots = [];
	for (const [index, source] of detected.sources.entries()) {
		const sourceRelativePath = path.relative(path.resolve(params.stateDir), source.sourcePath);
		const snapshot = source.storage === "raw-archive" ? await readLegacyAuditRecoverySourceForBackup(root$1, sourceRelativePath) : await readLegacyAuditSourcePrefixSnapshotForBackup(root$1, sourceRelativePath);
		const sourceGeneration = legacyAuditSourceGenerationKey(sourceRelativePath);
		const previousCheckpoint = source.storage === "raw-archive" ? findPreviousLegacyAuditRawCheckpoint(params.stateDir, sourceRelativePath) : void 0;
		const prepared = prepareLegacyAuditRecords(source, snapshot.raw, sourceGeneration, previousCheckpoint?.recordOrdinalBase ?? 0);
		if (!prepared.ok) throw new Error(`Legacy ${source.label} append archive cannot be sanitized for backup: ${prepared.warnings.join("; ")}`);
		const sourcePath = path.join(params.tempDir, `legacy-audit-raw-${index}.jsonl`);
		await fs$1.writeFile(sourcePath, prepared.sanitizedJsonl, { mode: 384 });
		let checkpoint;
		if (previousCheckpoint) {
			if (previousCheckpoint.recordCount > prepared.records.length) throw new Error(`Legacy ${source.label} append archive is shorter than its durable checkpoint`);
			const transformedPrefix = Buffer.from(serializePreparedAuditRecords(prepared.records.slice(0, previousCheckpoint.recordCount)), "utf8");
			const value = {
				...previousCheckpoint,
				dev: 0,
				ino: 0,
				mtimeMs: 0,
				size: transformedPrefix.length,
				contentHash: createHash("sha256").update(transformedPrefix).digest("hex")
			};
			checkpoint = {
				key: legacyAuditRawCheckpointKey(value),
				value
			};
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath: source.sourcePath,
			...checkpoint ? { checkpoint } : {},
			skippedSourcePaths: /* @__PURE__ */ new Set([
				path.resolve(source.sourcePath),
				path.resolve(`${source.sourcePath}.doctor-scrub-progress`),
				path.resolve(`${source.sourcePath}.doctor-scrub-restore`),
				path.resolve(`${source.sourcePath}.doctor-scrub-staging`)
			])
		});
	}
	return snapshots;
}
async function createLegacyAuditBackupSnapshots(params) {
	let lastError;
	for (let attempt = 0; attempt < 3; attempt += 1) try {
		return await createLegacyAuditBackupSnapshotsOnce(params);
	} catch (error) {
		lastError = error;
		if (attempt < 2) await new Promise((resolve) => {
			setTimeout(resolve, 25);
		});
	}
	throw lastError;
}
//#endregion
//#region src/infra/backup-sqlite-snapshot.ts
function resolveBackupAgentDatabaseOwner(sourcePath, inventory) {
	const resolvedSourcePath = path.resolve(sourcePath);
	if (path.basename(resolvedSourcePath) !== "openclaw-agent.sqlite") return;
	const stateSegments = path.relative(inventory.stateDir, resolvedSourcePath).split(path.sep);
	const defaultLayoutAgentId = stateSegments.length === 4 && stateSegments[0] === "agents" && stateSegments[2] === "agent" ? stateSegments[1] : void 0;
	if (defaultLayoutAgentId && normalizeAgentId(defaultLayoutAgentId) !== defaultLayoutAgentId) throw new Error(`Canonical agent SQLite path has a noncanonical agent owner ${defaultLayoutAgentId}: ${resolvedSourcePath}`);
	const declaredOwners = inventory.agentRoots.filter(({ databasePath }) => path.resolve(databasePath) === resolvedSourcePath);
	if (declaredOwners.length > 1) {
		const distinctAgentIds = new Set(declaredOwners.map(({ agentId }) => agentId));
		if (distinctAgentIds.size > 1) throw new Error(`Canonical agent SQLite path has multiple configured owners (${[...distinctAgentIds].join(", ")}): ${resolvedSourcePath}`);
	}
	const configuredAgentId = declaredOwners[0]?.agentId;
	if (configuredAgentId) return configuredAgentId;
	return defaultLayoutAgentId;
}
function resolveSqliteBackupDatabasePath(sourcePath) {
	for (const suffix of SQLITE_SIDECAR_SUFFIXES) if (sourcePath.endsWith(suffix)) {
		const databasePath = sourcePath.slice(0, -suffix.length);
		return databasePath.endsWith(".sqlite") ? databasePath : void 0;
	}
	return sourcePath.endsWith(".sqlite") ? sourcePath : void 0;
}
function classifyBackupSqliteSource(sourcePath, inventory) {
	const resolvedSourcePath = path.resolve(sourcePath);
	const transient = isTransientSqliteBackupPath(resolvedSourcePath);
	const databasePath = resolveSqliteBackupDatabasePath(resolvedSourcePath);
	if (!transient && !databasePath) return;
	if (!(isPathWithin(resolvedSourcePath, inventory.stateDir) || inventory.agentRoots.some(({ sourcePath: agentRoot }) => isPathWithin(resolvedSourcePath, agentRoot))) || inventory.isPackageContent(resolvedSourcePath)) return;
	if (transient) return "excluded";
	return inventory.isIncluded(resolvedSourcePath) ? "sqlite" : "excluded";
}
async function discoverBackupSqliteSources(params) {
	const snapshotPaths = /* @__PURE__ */ new Set();
	const discoveredSourcePaths = /* @__PURE__ */ new Set();
	const visitedDirectories = /* @__PURE__ */ new Set();
	const gatewayLockDir = resolveGatewayLockDir(params.inventory.stateDir);
	const volatilePlan = { stateDirs: [params.inventory.stateDir] };
	async function visit(directoryPath) {
		const resolvedDirectoryPath = path.resolve(directoryPath);
		if (visitedDirectories.has(resolvedDirectoryPath)) return;
		visitedDirectories.add(resolvedDirectoryPath);
		let entries;
		try {
			entries = await fs$1.readdir(resolvedDirectoryPath, { withFileTypes: true });
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return;
			throw error;
		}
		for (const entry of entries) {
			const entryPath = path.join(resolvedDirectoryPath, entry.name);
			if (isPathWithin(entryPath, gatewayLockDir) || isVolatileBackupPath(entryPath, volatilePlan)) continue;
			if (entry.isDirectory()) {
				if (params.inventory.isTraversable(entryPath) && !params.inventory.isPackageContent(entryPath)) await visit(entryPath);
				continue;
			}
			if (!params.inventory.isIncluded(entryPath)) continue;
			if (entry.isSymbolicLink()) {
				if (resolveBackupAgentDatabaseOwner(entryPath, params.inventory)) {
					let targetEntry;
					try {
						targetEntry = await fs$1.stat(entryPath);
					} catch (error) {
						throw new Error(`Canonical agent SQLite symlink cannot be snapshotted: ${entryPath}`, { cause: error });
					}
					if (!targetEntry.isFile()) throw new Error(`Canonical agent SQLite symlink must resolve to a regular file: ${entryPath}`);
					snapshotPaths.add(entryPath);
					discoveredSourcePaths.add(entryPath);
				}
				continue;
			}
			if (!entry.isFile() || classifyBackupSqliteSource(entryPath, params.inventory) !== "sqlite") continue;
			discoveredSourcePaths.add(entryPath);
			if (entry.name.endsWith(".sqlite")) snapshotPaths.add(entryPath);
		}
	}
	await visit(params.inventory.stateDir);
	for (const { sourcePath } of params.inventory.agentRoots) await visit(sourcePath);
	const globalStateSqlitePath = path.resolve(params.globalStateSqlitePath);
	let globalStateEntry;
	try {
		globalStateEntry = await fs$1.lstat(globalStateSqlitePath);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (globalStateEntry?.isFile()) {
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry?.isSymbolicLink()) {
		let targetEntry;
		try {
			targetEntry = await fs$1.stat(globalStateSqlitePath);
		} catch (error) {
			throw new Error(`Canonical global SQLite symlink cannot be snapshotted: ${globalStateSqlitePath}`, { cause: error });
		}
		if (!targetEntry.isFile()) throw new Error(`Canonical global SQLite symlink must resolve to a regular file: ${globalStateSqlitePath}`);
		snapshotPaths.add(globalStateSqlitePath);
		discoveredSourcePaths.add(globalStateSqlitePath);
	} else if (globalStateEntry) throw new Error(`Canonical global SQLite path must be a regular file or symlink to one: ${globalStateSqlitePath}`);
	return {
		snapshotPaths: [...snapshotPaths].toSorted((left, right) => left.localeCompare(right)),
		discoveredSourcePaths
	};
}
async function createBackupSqliteSnapshotPlan(params) {
	const globalStateSqlitePath = path.resolve(resolveOpenClawStateSqlitePath({
		...process.env,
		OPENCLAW_STATE_DIR: params.inventory.stateDir
	}));
	const discovery = await discoverBackupSqliteSources({
		inventory: params.inventory,
		globalStateSqlitePath
	});
	const globalStateIdentity = await fs$1.stat(globalStateSqlitePath).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	const canonicalSources = [];
	if (globalStateIdentity) canonicalSources.push({
		role: "global",
		archiveSourcePath: globalStateSqlitePath,
		identity: globalStateIdentity,
		sourcePath: await fs$1.realpath(globalStateSqlitePath)
	});
	for (const archiveSourcePath of discovery.snapshotPaths) {
		const agentId = resolveBackupAgentDatabaseOwner(archiveSourcePath, params.inventory);
		if (!agentId) continue;
		if (normalizeAgentId(agentId) !== agentId) throw new Error(`Canonical agent SQLite path has a noncanonical agent owner ${agentId}: ${archiveSourcePath}`);
		canonicalSources.push({
			role: "agent",
			agentId,
			archiveSourcePath,
			identity: await fs$1.stat(archiveSourcePath),
			sourcePath: await fs$1.realpath(archiveSourcePath)
		});
	}
	const snapshots = [];
	for (const archiveSourcePath of discovery.snapshotPaths) {
		const archiveSourceIdentity = await fs$1.stat(archiveSourcePath);
		const exactCanonicalSource = canonicalSources.find((source) => path.resolve(source.archiveSourcePath) === path.resolve(archiveSourcePath));
		if (exactCanonicalSource && !sameFileIdentity(exactCanonicalSource.identity, archiveSourceIdentity)) throw new Error(`Canonical SQLite path changed after discovery: ${archiveSourcePath}`);
		const matchingCanonicalSources = exactCanonicalSource ? [exactCanonicalSource] : canonicalSources.filter((source) => sameFileIdentity(source.identity, archiveSourceIdentity));
		if (matchingCanonicalSources.length > 1) {
			const owners = matchingCanonicalSources.map((source) => source.role === "global" ? "global" : `agent:${source.agentId}`).join(", ");
			throw new Error(`SQLite path aliases multiple canonical database owners (${owners}): ${archiveSourcePath}`);
		}
		const canonicalSource = matchingCanonicalSources[0];
		const sourceDatabasePath = canonicalSource?.sourcePath ?? archiveSourcePath;
		const sourcePath = path.join(params.tempDir, `openclaw-state-db-${snapshots.length}.sqlite`);
		try {
			await createVerifiedSqliteSnapshot({
				sourcePath: sourceDatabasePath,
				targetPath: sourcePath,
				requireNonEmptySource: Boolean(canonicalSource),
				validate: canonicalSource?.role === "global" ? (database, pathname) => assertOpenClawStateDatabaseOwner(database, { pathname }) : canonicalSource?.role === "agent" ? (database, pathname) => assertOpenClawAgentDatabaseOwner(database, {
					agentId: canonicalSource.agentId,
					pathname
				}) : void 0,
				transform: canonicalSource?.role === "global" ? (database) => {
					sanitizeOpenClawGlobalStateSnapshot(database);
					rewriteLegacyAuditBackupCheckpoints(database, params.legacyAuditSnapshots);
				} : canonicalSource?.role === "agent" ? sanitizeOpenClawStateLeaseRows : void 0
			});
		} catch (error) {
			throw new Error(`SQLite database cannot be compacted safely for backup: ${archiveSourcePath}. ${formatErrorMessage(error)}. The source must pass full integrity checks, online SQLite backup, and offline compaction with its required SQLite capabilities; a direct file copy was refused because it can retain deleted data.`, { cause: error });
		}
		snapshots.push({
			sourcePath,
			archiveSourcePath,
			skippedSourcePaths: new Set([archiveSourcePath, sourceDatabasePath].flatMap((databasePath) => resolveSqliteDatabaseFilePaths(databasePath).map((pathname) => path.resolve(pathname))))
		});
	}
	return {
		snapshots,
		discoveredSourcePaths: discovery.discoveredSourcePaths
	};
}
//#endregion
//#region src/infra/backup-tar-retry.ts
const BACKUP_TAR_MAX_ATTEMPTS = 3;
const BACKUP_TAR_BACKOFF_MS = [1e4, 2e4];
function isTarEofRaceError(err) {
	if (!err || typeof err !== "object") return false;
	if (err.code === "EOF") return true;
	const message = err.message ?? "";
	return /(did not encounter expected|encountered unexpected) EOF|TAR_BAD_ARCHIVE/i.test(message);
}
function resolveBackupTarAttemptTempPath(tempArchivePath, attempt) {
	return attempt === 1 ? tempArchivePath : `${tempArchivePath}.retry-${attempt}`;
}
async function writeTarArchiveWithRetry(params) {
	const sleepFn = params.sleepMs ?? sleep;
	let lastErr;
	let attempts = 0;
	for (let attempt = 1; attempt <= BACKUP_TAR_MAX_ATTEMPTS; attempt += 1) {
		attempts = attempt;
		const attemptTempArchivePath = resolveBackupTarAttemptTempPath(params.tempArchivePath, attempt);
		try {
			return await params.runTar(attemptTempArchivePath);
		} catch (err) {
			lastErr = err;
			if (!isTarEofRaceError(err) || attempt === BACKUP_TAR_MAX_ATTEMPTS) break;
			const backoff = BACKUP_TAR_BACKOFF_MS[attempt - 1] ?? 0;
			const offendingPath = err.path;
			params.log?.(`Backup archiver hit a live-write race${offendingPath ? ` on ${offendingPath}` : ""} (attempt ${attempt}/${BACKUP_TAR_MAX_ATTEMPTS}); retrying in ${Math.round(backoff / 1e3)}s.`);
			await sleepFn(backoff);
		}
	}
	const final = lastErr instanceof Error ? lastErr : new Error(String(lastErr));
	const offendingPath = lastErr?.path;
	const attemptSuffix = `after ${attempts} attempt${attempts === 1 ? "" : "s"}`;
	const suffix = offendingPath ? ` (last offending path: ${offendingPath}, ${attemptSuffix})` : ` (${attemptSuffix})`;
	throw new Error(`Backup archive write failed: ${final.message}${suffix}`, { cause: final });
}
//#endregion
//#region src/infra/backup-create.ts
const loadTarRuntime = createLazyRuntimeModule(() => import("tar"));
async function resolveOutputPath(params) {
	const basename = buildBackupArchiveBasename(params.nowMs);
	const rawOutput = params.output?.trim();
	if (!rawOutput) {
		const cwd = path.resolve(process.cwd());
		const canonicalCwd = await fs$1.realpath(cwd).catch(() => cwd);
		const defaultDir = params.includedAssets.some((asset) => isPathWithin(canonicalCwd, asset.sourcePath)) ? resolveHomeDir() ?? path.dirname(params.stateDir) : cwd;
		return path.resolve(defaultDir, basename);
	}
	const resolved = resolveUserPath(rawOutput);
	if (rawOutput.endsWith("/") || rawOutput.endsWith("\\")) return path.join(resolved, basename);
	try {
		if ((await fs$1.stat(resolved)).isDirectory()) return path.join(resolved, basename);
	} catch {}
	return resolved;
}
function formatBackupOutputFailure(error, outputPath, phase, ownedRoot) {
	const cause = phase === "write" && error instanceof Error ? error.cause : void 0;
	const filesystemError = isErrno(error) ? error : isErrno(cause) ? cause : null;
	if (!filesystemError) return error;
	if (ownedRoot) {
		const failedPath = filesystemError.path;
		if (typeof failedPath !== "string" || !isPathWithin(path.resolve(failedPath), ownedRoot)) return error;
	}
	const outputParent = path.dirname(outputPath);
	const retry = "run `openclaw backup create --output <archive>` again.";
	let detail;
	switch (filesystemError.code) {
		case "ENOENT":
			detail = `Backup output directory could not be created: ${outputParent}. Check the path and ${retry}`;
			break;
		case "EACCES":
		case "EPERM":
		case "EROFS":
			detail = `Backup output directory is not writable: ${outputParent}. Check the path and directory permissions, then ${retry}`;
			break;
		case "EEXIST":
		case "ENOTDIR":
			if (phase !== "parent") return error;
			detail = `Backup output parent is not a directory: ${outputParent}. Choose a directory path and ${retry}`;
			break;
		case "ENOSPC":
			detail = `The destination does not have enough free space: ${outputParent}. Free up disk space and ${retry}`;
			break;
		case "EDQUOT":
			detail = `The destination storage quota is exhausted: ${outputParent}. Free up space or choose another path, then ${retry}`;
			break;
		default: detail = `The output path could not be prepared: ${outputParent}. Check the path and filesystem, then ${retry}`;
	}
	return new Error(`Backup archive creation failed: ${outputPath}. ${detail}`, { cause: error });
}
async function assertOutputPathReady(outputPath) {
	try {
		await fs$1.access(outputPath);
		throw new Error(`Refusing to overwrite existing backup archive: ${outputPath}`);
	} catch (error) {
		const code = error?.code;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function prepareBackupOutputParent(outputPath) {
	try {
		await fs$1.mkdir(path.dirname(outputPath), { recursive: true });
	} catch (error) {
		throw formatBackupOutputFailure(error, outputPath, "parent");
	}
}
async function chooseBackupTempRoot(params) {
	const systemTmp = os.tmpdir();
	const canonicalSystemTmp = await canonicalizePathForContainment(systemTmp);
	if (!params.assets.some((asset) => isPathWithin(canonicalSystemTmp, asset.sourcePath))) return systemTmp;
	const fallback = path.dirname(params.outputPath);
	const canonicalFallback = await canonicalizePathForContainment(fallback);
	const fallbackInsideAsset = params.assets.find((asset) => isPathWithin(canonicalFallback, asset.sourcePath));
	if (fallbackInsideAsset) throw new Error(`Backup temp root cannot be placed outside every source path: ${systemTmp} and ${fallback} both overlap ${fallbackInsideAsset.sourcePath}.`);
	return fallback;
}
function buildManifest(params) {
	return {
		schemaVersion: 1,
		createdAt: params.createdAt,
		archiveRoot: params.archiveRoot,
		runtimeVersion: resolveRuntimeServiceVersion(),
		platform: process.platform,
		nodeVersion: process.version,
		options: {
			includeWorkspace: params.includeWorkspace,
			onlyConfig: params.onlyConfig
		},
		paths: {
			stateDir: params.stateDir,
			configPath: params.configPath,
			oauthDir: params.oauthDir,
			workspaceDirs: params.workspaceDirs,
			...params.onlyConfig ? {} : { agentRoots: params.agentRoots.map(({ agentId, sourcePath }) => ({
				agentId,
				sourcePath
			})) }
		},
		assets: params.assets.map((asset) => ({
			kind: asset.kind,
			sourcePath: asset.sourcePath,
			archivePath: asset.archivePath
		})),
		skipped: params.skipped.map((entry) => ({
			kind: entry.kind,
			sourcePath: entry.sourcePath,
			reason: entry.reason,
			coveredBy: entry.coveredBy
		}))
	};
}
function formatBackupCreateSummary(result) {
	const lines = [`Backup archive: ${result.archivePath}`];
	lines.push(`Included ${result.assets.length} path${result.assets.length === 1 ? "" : "s"}:`);
	for (const asset of result.assets) lines.push(`- ${asset.kind}: ${asset.displayPath}`);
	if (result.skipped.length > 0) {
		lines.push(`Skipped ${result.skipped.length} path${result.skipped.length === 1 ? "" : "s"}:`);
		for (const entry of result.skipped) if (entry.reason === "covered" && entry.coveredBy) lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason} by ${entry.coveredBy})`);
		else lines.push(`- ${entry.kind}: ${entry.displayPath} (${entry.reason})`);
	}
	if (result.dryRun) lines.push("Dry run only; archive was not written.");
	else {
		lines.push(`Created ${result.archivePath}`);
		if (result.skippedVolatileCount > 0) lines.push(`Skipped ${result.skippedVolatileCount} volatile file${result.skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, managed runtime paths, sockets, pid/tmp).`);
		if (result.verified) lines.push("Archive verification: passed");
	}
	return lines;
}
function remapArchiveEntryPath(params) {
	const normalizedEntry = path.resolve(params.entryPath);
	if (normalizedEntry === params.manifestPath) return path.posix.join(params.archiveRoot, "manifest.json");
	const remappedSourcePath = params.sourcePathRemaps?.get(normalizedEntry);
	if (remappedSourcePath) return buildBackupArchivePath(params.archiveRoot, remappedSourcePath);
	return buildBackupArchivePath(params.archiveRoot, normalizedEntry);
}
function isBackupTarFilterFile(entry) {
	return "isFile" in entry ? entry.isFile() : entry.type === "File";
}
async function createBackupArchive(opts = {}) {
	const nowMs = resolveDateTimestampMs(opts.nowMs);
	const archiveRoot = buildBackupArchiveRoot(nowMs);
	const onlyConfig = Boolean(opts.onlyConfig);
	const includeWorkspace = onlyConfig ? false : opts.includeWorkspace ?? true;
	const plan = await resolveBackupPlanFromDisk({
		includeWorkspace,
		onlyConfig,
		nowMs
	});
	const outputPath = await resolveOutputPath({
		output: opts.output,
		nowMs,
		includedAssets: plan.included,
		stateDir: plan.stateDir
	});
	if (plan.included.length === 0) throw new Error(onlyConfig ? "No OpenClaw config file was found to back up." : "No local OpenClaw state was found to back up.");
	const canonicalOutputPath = await canonicalizePathForContainment(outputPath);
	const overlappingAsset = plan.included.find((asset) => isPathWithin(canonicalOutputPath, asset.sourcePath));
	if (overlappingAsset) throw new Error(`Backup output must not be written inside a source path: ${outputPath} is inside ${overlappingAsset.sourcePath}`);
	if (!opts.dryRun) await assertOutputPathReady(outputPath);
	const createdAt = new Date(nowMs).toISOString();
	const stateAsset = plan.included.find((asset) => asset.kind === "state");
	const result = {
		createdAt,
		archiveRoot,
		archivePath: outputPath,
		dryRun: Boolean(opts.dryRun),
		includeWorkspace,
		onlyConfig,
		verified: false,
		assets: plan.included,
		...onlyConfig ? {} : { agentRoots: plan.inventory.agentRoots.map(({ agentId, sourcePath }) => ({
			agentId,
			sourcePath
		})) },
		skipped: plan.skipped,
		skippedVolatileCount: 0
	};
	if (opts.dryRun) return result;
	await prepareBackupOutputParent(outputPath);
	const tempRoot = await chooseBackupTempRoot({
		assets: result.assets,
		outputPath
	});
	await fs$1.mkdir(tempRoot, { recursive: true });
	const tempDir = await fs$1.mkdtemp(path.join(tempRoot, "openclaw-backup-"));
	const manifestPath = path.join(tempDir, "manifest.json");
	let publication;
	try {
		publication = await createBackupArchivePublication(outputPath);
	} catch (error) {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		throw formatBackupOutputFailure(error, outputPath, "publication");
	}
	const tempArchivePath = publication.tempArchivePath;
	try {
		const hasLegacyAuditSources = stateAsset ? await hasLegacyAuditBackupSources(stateAsset.sourcePath) : false;
		const createSnapshotPlans = async () => {
			const legacyAuditSnapshots = stateAsset && hasLegacyAuditSources ? await createLegacyAuditBackupSnapshots({
				stateDir: stateAsset.sourcePath,
				tempDir
			}) : [];
			return {
				legacyAuditSnapshots,
				stateSqliteBackup: !onlyConfig ? await createBackupSqliteSnapshotPlan({
					inventory: plan.inventory,
					tempDir,
					legacyAuditSnapshots
				}) : {
					snapshots: [],
					discoveredSourcePaths: /* @__PURE__ */ new Set()
				}
			};
		};
		const { legacyAuditSnapshots, stateSqliteBackup } = stateAsset && hasLegacyAuditSources ? await withLegacyAuditMigrationLease(stateAsset.sourcePath, createSnapshotPlans) : await createSnapshotPlans();
		const sourcePathRemaps = /* @__PURE__ */ new Map();
		const skippedStateSourcePaths = /* @__PURE__ */ new Set();
		for (const snapshot of stateSqliteBackup.snapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		for (const snapshot of legacyAuditSnapshots) {
			sourcePathRemaps.set(path.resolve(snapshot.sourcePath), snapshot.archiveSourcePath);
			for (const skippedSourcePath of snapshot.skippedSourcePaths) skippedStateSourcePaths.add(skippedSourcePath);
		}
		const manifest = buildManifest({
			createdAt,
			archiveRoot,
			includeWorkspace,
			onlyConfig,
			assets: result.assets,
			skipped: result.skipped,
			stateDir: plan.stateDir,
			configPath: plan.configPath,
			oauthDir: plan.oauthDir,
			workspaceDirs: plan.workspaceDirs,
			agentRoots: plan.inventory.agentRoots
		});
		await writeJson(manifestPath, manifest, { trailingNewline: true });
		const tar = await loadTarRuntime();
		const gatewayLockDir = resolveGatewayLockDir(plan.stateDir);
		const volatilePlan = { stateDirs: [stateAsset?.sourcePath ?? plan.stateDir] };
		let skippedVolatileCount = 0;
		const unexpectedSqliteSourcePaths = [];
		let archiveSymlinkViolation;
		const tarFilter = (entryPath, entryStat) => {
			const resolvedEntryPath = path.resolve(entryPath);
			if (resolvedEntryPath === manifestPath) return true;
			const isDirectory = "isDirectory" in entryStat ? entryStat.isDirectory() : entryStat.type === "Directory";
			if (!onlyConfig && !(isDirectory ? plan.inventory.isTraversable(resolvedEntryPath) : plan.inventory.isIncluded(resolvedEntryPath))) return false;
			if (isPathWithin(resolvedEntryPath, gatewayLockDir)) return false;
			if (stateAsset && isLegacyAuditMigrationBackupPath(resolvedEntryPath, stateAsset.sourcePath)) return false;
			const sqliteSourceKind = onlyConfig ? void 0 : classifyBackupSqliteSource(resolvedEntryPath, plan.inventory);
			if (sqliteSourceKind === "excluded") return false;
			if (skippedStateSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && stateSqliteBackup.discoveredSourcePaths.has(resolvedEntryPath)) return false;
			if (sqliteSourceKind === "sqlite" && isBackupTarFilterFile(entryStat)) {
				unexpectedSqliteSourcePaths.push(entryPath);
				return false;
			}
			if (isVolatileBackupPath(entryPath, volatilePlan)) {
				skippedVolatileCount += 1;
				return false;
			}
			return true;
		};
		const completedArchive = await writeTarArchiveWithRetry({
			tempArchivePath,
			log: opts.log,
			runTar: async (attemptTempArchivePath) => {
				skippedVolatileCount = 0;
				unexpectedSqliteSourcePaths.length = 0;
				archiveSymlinkViolation = void 0;
				const prepared = await writeArchiveStreamToFile({
					archivePath: attemptTempArchivePath,
					createArchiveStream: (reportProgress) => tar.c({
						gzip: true,
						portable: true,
						preservePaths: true,
						linkCache: createBackupLinkCache(),
						statCache: createBackupVolatileStatCache(volatilePlan),
						filter: (entryPath, entryStat) => {
							reportProgress({
								phase: "traversal",
								entryPath
							});
							return tarFilter(entryPath, entryStat);
						},
						onWriteEntry: (entry) => {
							const sourceEntryPath = entry.path;
							reportProgress({
								phase: "entry",
								entryPath: sourceEntryPath
							});
							if (entry.type === "File" && (entry.stat?.size ?? 0) > 0) observeBackupTarEntryProgress(entry, (bytes) => {
								reportProgress({
									phase: "raw",
									entryPath: sourceEntryPath,
									bytes
								});
							});
							const archiveEntryPath = remapArchiveEntryPath({
								entryPath: entry.path,
								manifestPath,
								archiveRoot,
								sourcePathRemaps
							});
							if (entry.type === "SymbolicLink" && !archiveSymlinkViolation) try {
								assertArchiveSymbolicLinkTarget({
									archiveRoot,
									entryPath: archiveEntryPath,
									linkpath: entry.linkpath,
									assetArchivePaths: manifest.assets.map((asset) => asset.archivePath)
								});
							} catch (error) {
								archiveSymlinkViolation = error instanceof Error ? error : new Error(String(error));
							}
							entry.path = archiveEntryPath;
						}
					}, [
						manifestPath,
						...stateSqliteBackup.snapshots.map((snapshot) => snapshot.sourcePath),
						...legacyAuditSnapshots.map((snapshot) => snapshot.sourcePath),
						...result.assets.map((asset) => asset.sourcePath)
					]),
					onPartialArchive: (partialArchive) => {
						publication.pendingCleanupArchives.push(partialArchive);
					}
				});
				const unexpectedSqliteSourcePath = unexpectedSqliteSourcePaths[0];
				const archiveValidationError = unexpectedSqliteSourcePath ? /* @__PURE__ */ new Error(`SQLite state appeared after snapshot discovery: ${unexpectedSqliteSourcePath}. Retry backup so it can be snapshotted.`) : archiveSymlinkViolation;
				if (archiveValidationError) {
					if (!removePreparedBackupArchive(prepared)) publication.pendingCleanupArchives.push(prepared);
					throw archiveValidationError;
				}
				return prepared;
			}
		}).catch((error) => {
			throw formatBackupOutputFailure(error, outputPath, "write", publication.stagingDir);
		});
		result.skippedVolatileCount = skippedVolatileCount;
		if (skippedVolatileCount > 0) opts.log?.(`Backup skipped ${skippedVolatileCount} volatile file${skippedVolatileCount === 1 ? "" : "s"} (live sessions, cron logs, queues, managed runtime paths, sockets, pid/tmp).`);
		try {
			await publishPreparedBackupArchive({
				plan: publication,
				prepared: completedArchive,
				log: opts.log
			});
		} catch (error) {
			throw formatBackupOutputFailure(error, outputPath, "publication");
		}
	} finally {
		await cleanupBackupArchivePublication(publication, opts.log);
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	return result;
}
//#endregion
//#region src/commands/backup.ts
const backupVerifyRuntimeLoader = createLazyImportLoader(() => import("./backup-verify-BU-n-JNO.js"));
function loadBackupVerifyRuntime() {
	return backupVerifyRuntimeLoader.load();
}
/** Create a backup archive, optionally verify it, and emit text or JSON output. */
async function backupCreateCommand(runtime, opts = {}) {
	let archivePath = opts.output ?? process.cwd();
	try {
		const result = await createBackupArchive({
			...opts,
			log: opts.log ?? (opts.json ? void 0 : (message) => runtime.log(message))
		});
		archivePath = result.archivePath;
		if (opts.verify && !opts.dryRun) {
			const { backupVerifyCommand } = await loadBackupVerifyRuntime();
			await backupVerifyCommand({
				...runtime,
				log: () => {}
			}, {
				archive: result.archivePath,
				json: false
			});
			result.verified = true;
		}
		if (!opts.dryRun) recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "ok"
		});
		if (opts.json) writeRuntimeJson(runtime, result);
		else runtime.log(formatBackupCreateSummary(result).join("\n"));
		return result;
	} catch (error) {
		if (!opts.dryRun) recordBackupOutcomeBestEffort(runtime, {
			kind: "archive",
			archivePath,
			status: "failed",
			error: formatErrorMessage(error)
		});
		throw error;
	}
}
//#endregion
export { publishVerifiedSqliteFile as a, createVerifiedSqliteSnapshot as i, sanitizeOpenClawGlobalStateSnapshot as n, sanitizeOpenClawStateLeaseRows as r, backupCreateCommand as t };
