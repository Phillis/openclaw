import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { a as isPathInside, i as isNotFoundPathError } from "./path-D138yf8v.js";
import { d as createAsyncDirectoryGuard, l as assertAsyncDirectoryGuard } from "./absolute-path-CYFPfAjt.js";
import { c as resolveOpenedFileRealPathForHandle, i as root } from "./root-impl-BbMR4leC.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import { u as getFsSafeTestHooks } from "./sidecar-lock-ChVk6eKw.js";
import { a as formatErrorDetail } from "./root-path-CsUfUJ7P.js";
import { n as resolveSecureTempRoot, t as tempFile } from "./temp-target-BKidZAiK.js";
import { t as writeSiblingTempFile } from "./sibling-temp-Bgggv-7B.js";
import { n as ArchiveSecurityError, r as isArchiveFormatErrorMessage, t as ArchiveFormatError } from "./archive-errors-yA0gvFwU.js";
import { a as stripArchivePath, i as resolveArchiveOutputPath, o as validateArchiveEntryPath, r as normalizeArchiveEntryPath, t as createArchiveOutputPathTracker } from "./archive-entry-DulHWXJZ.js";
import { d as createByteBudgetTracker, f as createExtractBudgetTransform, l as assertArchiveEntryCountWithinLimit, n as ARCHIVE_LIMIT_ERROR_CODE, p as resolveExtractLimits, r as ArchiveLimitError, t as loadZipArchiveWithPreflight, u as assertArchiveEntryPathComponentsWithinLimit } from "./archive-zip-preflight-DEDuOjaB.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createGunzip } from "node:zlib";
import { Readable, Transform, Writable } from "node:stream";
import { pipeline as pipeline$1 } from "node:stream/promises";
//#region node_modules/@openclaw/fs-safe/dist/archive-deadline.js
function signalReason(signal, fallback) {
	const reason = signal.reason;
	return reason instanceof Error ? reason : fallback ?? new Error(String(reason));
}
function deadlineReason(deadline) {
	return signalReason(deadline.signal);
}
function createPipelineTimeoutError(err, deadline) {
	if (deadline.signal.aborted && err instanceof Error && (err.name === "AbortError" || err.message === "The operation was aborted")) return deadlineReason(deadline);
	return err;
}
async function waitForDeadline(promise, deadline) {
	deadline.check();
	if (deadline.signal.aborted) throw deadlineReason(deadline);
	return await Promise.race([promise, new Promise((_, reject) => {
		const abort = () => reject(deadlineReason(deadline));
		deadline.signal.addEventListener("abort", abort, { once: true });
		const cleanup = () => {
			deadline.signal.removeEventListener("abort", abort);
		};
		promise.then(cleanup, cleanup);
	})]);
}
function createExtractionDeadline(timeoutMs, label) {
	const controller = new AbortController();
	if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return {
		signal: controller.signal,
		check: () => void 0,
		dispose: () => void 0
	};
	const timeoutError = /* @__PURE__ */ new Error(`${label} timed out after ${timeoutMs}ms`);
	const timeoutId = setTimeout(() => {
		controller.abort(timeoutError);
	}, timeoutMs);
	return {
		signal: controller.signal,
		check: () => {
			if (controller.signal.aborted) throw signalReason(controller.signal, timeoutError);
		},
		dispose: () => {
			clearTimeout(timeoutId);
		}
	};
}
async function withExtractionDeadline(timeoutMs, label, run) {
	const deadline = createExtractionDeadline(timeoutMs, label);
	try {
		deadline.check();
		return await waitForDeadline(run(deadline), deadline);
	} finally {
		deadline.dispose();
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-staging.js
const ERROR_ARCHIVE_ENTRY_TRAVERSES_SYMLINK = "archive entry traverses symlink in destination";
const ARCHIVE_STAGING_MODE = 448;
function symlinkTraversalError(originalPath) {
	return new ArchiveSecurityError("destination-symlink-traversal", `${ERROR_ARCHIVE_ENTRY_TRAVERSES_SYMLINK}: ${formatErrorDetail(originalPath)}`);
}
async function createDirectoryIdentityGuard(dir) {
	try {
		return await createAsyncDirectoryGuard(dir);
	} catch (err) {
		if (err instanceof FsSafeError && err.code === "not-file") throw new ArchiveSecurityError("destination-symlink", "archive destination is a symlink");
		throw err;
	}
}
async function assertDirectoryIdentityGuard(guard) {
	try {
		await assertAsyncDirectoryGuard(guard);
	} catch (err) {
		if (err instanceof FsSafeError) throw new ArchiveSecurityError("destination-symlink-traversal", "archive destination changed during extraction");
		throw err;
	}
}
async function prepareArchiveDestinationDir(destDir) {
	const stat = await fs$1.lstat(destDir);
	if (stat.isSymbolicLink()) throw new ArchiveSecurityError("destination-symlink", "archive destination is a symlink");
	if (!stat.isDirectory()) throw new ArchiveSecurityError("destination-not-directory", "archive destination is not a directory");
	const realPath = await fs$1.realpath(destDir);
	const realStat = await fs$1.stat(realPath);
	const postStat = await fs$1.lstat(destDir);
	if (realStat.dev !== stat.dev || realStat.ino !== stat.ino || postStat.isSymbolicLink() || !postStat.isDirectory() || postStat.dev !== stat.dev || postStat.ino !== stat.ino) throw new ArchiveSecurityError("destination-symlink-traversal", "archive destination changed during extraction");
	return realPath;
}
async function assertNoSymlinkTraversal(params) {
	const parts = params.relPath.split(/[\\/]+/).filter(Boolean);
	let current = path.resolve(params.rootDir);
	for (const part of parts) {
		current = path.join(current, part);
		let stat;
		try {
			stat = await fs$1.lstat(current);
		} catch (err) {
			if (isNotFoundPathError(err)) continue;
			throw err;
		}
		if (stat.isSymbolicLink()) throw symlinkTraversalError(params.originalPath);
	}
}
async function assertResolvedInsideDestination(params) {
	let resolved;
	try {
		resolved = await fs$1.realpath(params.targetPath);
	} catch (err) {
		if (isNotFoundPathError(err)) return;
		throw err;
	}
	if (!isPathInside(params.destinationRealDir, resolved)) throw symlinkTraversalError(params.originalPath);
}
async function mkdirArchiveOutput(params) {
	try {
		await params.targetRoot.mkdir(params.relativePath);
	} catch (error) {
		if (error instanceof FsSafeError) throw symlinkTraversalError(params.originalPath);
		throw error;
	}
}
async function prepareArchiveOutputPath(params) {
	const targetRoot = await root(params.destinationRealDir);
	const destinationGuard = await createDirectoryIdentityGuard(params.destinationRealDir);
	const relPath = params.relPath.split(path.sep).join(path.posix.sep);
	await assertNoSymlinkTraversal({
		rootDir: params.destinationDir,
		relPath,
		originalPath: params.originalPath
	});
	if (params.isDirectory) {
		await getFsSafeTestHooks()?.beforeArchiveOutputMutation?.("mkdir", params.outPath);
		await assertDirectoryIdentityGuard(destinationGuard);
		await mkdirArchiveOutput({
			targetRoot,
			relativePath: relPath,
			originalPath: params.originalPath
		});
		await assertDirectoryIdentityGuard(destinationGuard);
		await assertResolvedInsideDestination({
			destinationRealDir: params.destinationRealDir,
			targetPath: params.outPath,
			originalPath: params.originalPath
		});
		return;
	}
	const parentRel = path.posix.dirname(relPath);
	if (parentRel !== ".") {
		await getFsSafeTestHooks()?.beforeArchiveOutputMutation?.("mkdir", path.dirname(params.outPath));
		await assertDirectoryIdentityGuard(destinationGuard);
		await mkdirArchiveOutput({
			targetRoot,
			relativePath: parentRel,
			originalPath: params.originalPath
		});
		await assertDirectoryIdentityGuard(destinationGuard);
	}
	await assertResolvedInsideDestination({
		destinationRealDir: params.destinationRealDir,
		targetPath: path.dirname(params.outPath),
		originalPath: params.originalPath
	});
}
async function chmodInsideDestinationBestEffort(params) {
	await getFsSafeTestHooks()?.beforeArchiveOutputMutation?.("chmod", params.destinationPath);
	const destinationGuard = await createDirectoryIdentityGuard(params.destinationRealDir);
	await assertDirectoryIdentityGuard(destinationGuard);
	const noFollowFlag = process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0;
	const handle = await fs$1.open(params.destinationPath, fs.constants.O_RDONLY | noFollowFlag).catch(() => null);
	if (!handle) {
		if ((await fs$1.lstat(params.destinationPath).catch(() => null))?.isSymbolicLink()) throw symlinkTraversalError(params.originalPath);
		return;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isDirectory() && !stat.isFile()) return;
		const realPath = await resolveOpenedFileRealPathForHandle(handle, params.destinationPath);
		if (!isPathInside(params.destinationRealDir, realPath)) throw symlinkTraversalError(params.originalPath);
		await handle.chmod(params.mode).catch(() => void 0);
		await assertDirectoryIdentityGuard(destinationGuard);
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function applyStagedEntryMode(params) {
	const destinationPath = path.join(params.destinationRealDir, params.relPath);
	await assertResolvedInsideDestination({
		destinationRealDir: params.destinationRealDir,
		targetPath: destinationPath,
		originalPath: params.originalPath
	});
	if (params.mode !== 0) await chmodInsideDestinationBestEffort({
		destinationRealDir: params.destinationRealDir,
		destinationPath,
		mode: params.mode,
		originalPath: params.originalPath
	});
}
async function assertExtractedFileHasNoHardlinkAlias(params) {
	const destinationPath = path.join(params.destinationRealDir, params.relPath);
	await assertResolvedInsideDestination({
		destinationRealDir: params.destinationRealDir,
		targetPath: destinationPath,
		originalPath: params.originalPath
	});
	const stat = await fs$1.lstat(destinationPath);
	if (stat.isFile() && stat.nlink > 1) throw symlinkTraversalError(params.originalPath);
}
async function removeExtractedDestinationFile(params) {
	const destinationPath = path.join(params.destinationRealDir, params.relPath);
	let stat;
	try {
		stat = await fs$1.lstat(destinationPath);
	} catch {
		return;
	}
	if (!stat.isFile()) return;
	let resolved;
	try {
		resolved = await fs$1.realpath(destinationPath);
	} catch {
		return;
	}
	if (!isPathInside(params.destinationRealDir, resolved)) return;
	await (await root(params.destinationRealDir)).remove(params.relPath).catch(() => void 0);
}
function assertSafeArchiveStagingPrefix(prefix) {
	if (!prefix || prefix === "." || prefix === ".." || prefix.includes("/") || prefix.includes("\\") || path.basename(prefix) !== prefix) throw new Error("archive staging prefix must be a single path segment");
	return prefix;
}
async function withStagedArchiveDestination(params) {
	const stagingRoot = resolveSecureTempRoot({
		fallbackPrefix: "fs-safe-archive",
		unsafeFallbackLabel: "archive staging temp dir",
		warn: () => void 0
	});
	if (isPathInside(params.destinationRealDir, stagingRoot)) throw new Error(`archive staging root must be outside destination: ${stagingRoot}`);
	const stagingPrefix = assertSafeArchiveStagingPrefix(params.stagingDirPrefix ?? "fs-safe-archive-");
	const stagingDir = await fs$1.mkdtemp(path.join(stagingRoot, stagingPrefix));
	const stagingGuard = await createDirectoryIdentityGuard(stagingDir);
	try {
		await fs$1.chmod(stagingDir, ARCHIVE_STAGING_MODE).catch(() => void 0);
		await assertDirectoryIdentityGuard(stagingGuard);
		return await params.run(stagingDir);
	} finally {
		try {
			await assertDirectoryIdentityGuard(stagingGuard);
			await fs$1.rm(stagingDir, {
				recursive: true,
				force: true
			}).catch(() => void 0);
		} catch {}
	}
}
async function mergeExtractedTreeIntoDestination(params) {
	const targetRoot = await root(params.destinationRealDir);
	const sourceRootGuard = await createDirectoryIdentityGuard(params.sourceDir);
	const sourceRootReal = sourceRootGuard.realPath;
	const walk = async (currentSourceDir) => {
		await assertDirectoryIdentityGuard(sourceRootGuard);
		const entries = await fs$1.readdir(currentSourceDir, { withFileTypes: true });
		for (const entry of entries) {
			await assertDirectoryIdentityGuard(sourceRootGuard);
			const sourcePath = path.join(currentSourceDir, entry.name);
			const relPath = path.relative(params.sourceDir, sourcePath);
			const originalPath = relPath.split(path.sep).join("/");
			const destinationPath = path.join(params.destinationDir, relPath);
			const sourceStat = await fs$1.lstat(sourcePath);
			if (sourceStat.isSymbolicLink()) throw symlinkTraversalError(originalPath);
			const sourceReal = await fs$1.realpath(sourcePath);
			if (!isPathInside(sourceRootReal, sourceReal)) throw symlinkTraversalError(originalPath);
			if (sourceStat.isDirectory()) {
				await prepareArchiveOutputPath({
					destinationDir: params.destinationDir,
					destinationRealDir: params.destinationRealDir,
					relPath,
					outPath: destinationPath,
					originalPath,
					isDirectory: true
				});
				await walk(sourcePath);
				await applyStagedEntryMode({
					destinationRealDir: params.destinationRealDir,
					relPath,
					mode: sourceStat.mode & 511,
					originalPath
				});
				continue;
			}
			if (!sourceStat.isFile()) throw new Error(`archive staging contains unsupported entry: ${formatErrorDetail(originalPath)}`);
			await prepareArchiveOutputPath({
				destinationDir: params.destinationDir,
				destinationRealDir: params.destinationRealDir,
				relPath,
				outPath: destinationPath,
				originalPath,
				isDirectory: false
			});
			try {
				await targetRoot.copyIn(relPath, sourcePath, { mkdir: true });
				await assertExtractedFileHasNoHardlinkAlias({
					destinationRealDir: params.destinationRealDir,
					relPath,
					originalPath
				});
				await applyStagedEntryMode({
					destinationRealDir: params.destinationRealDir,
					relPath,
					mode: sourceStat.mode & 511,
					originalPath
				});
			} catch (err) {
				await removeExtractedDestinationFile({
					destinationRealDir: params.destinationRealDir,
					relPath
				});
				if (err instanceof FsSafeError && (err.code === "hardlink" || err.code === "path-alias")) throw symlinkTraversalError(originalPath);
				throw err;
			}
		}
	};
	await walk(params.sourceDir);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-policy.js
function archiveEntryKindFromTarType(type) {
	if (type === "Directory" || type === "GNUDumpDir") return "directory";
	if (type === "File" || type === "OldFile" || type === "ContiguousFile") return "file";
	if (type === "SymbolicLink" || type === "Link") return "symlink";
	return "other";
}
function resolveArchiveEntryMode(params) {
	const archivedMode = (params.archivedMode ?? 0) & 511;
	if (params.policy === "preserve") return archivedMode || (params.kind === "directory" ? 493 : 420);
	if (params.kind === "directory") return 493;
	return archivedMode & 64 ? 493 : 420;
}
function shouldExtractArchiveEntry(params) {
	if (!params.filter || params.filter(params.entry) === "extract") return true;
	if ((params.onFiltered ?? "reject-archive") === "reject-archive") throw new ArchiveSecurityError("entry-filtered", `archive entry rejected by filter: ${formatErrorDetail(params.entry.path)}`);
	return false;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-tar.js
const BLOCKED_TAR_ENTRY_TYPES = /* @__PURE__ */ new Set([
	"SymbolicLink",
	"Link",
	"BlockDevice",
	"CharacterDevice",
	"FIFO",
	"Socket"
]);
function readTarEntryInfo(entry) {
	return {
		path: typeof entry === "object" && entry !== null && "path" in entry ? String(entry.path) : "",
		type: typeof entry === "object" && entry !== null && "type" in entry ? String(entry.type) : "",
		size: typeof entry === "object" && entry !== null && "size" in entry && typeof entry.size === "number" && Number.isFinite(entry.size) ? Math.max(0, Math.floor(entry.size)) : 0,
		mode: typeof entry === "object" && entry !== null && "mode" in entry && typeof entry.mode === "number" ? entry.mode : void 0
	};
}
function createTarEntryPreflightChecker(params) {
	const strip = Math.max(0, Math.floor(params.stripComponents ?? 0));
	const limits = resolveExtractLimits(params.limits);
	let entryCount = 0;
	const budget = createByteBudgetTracker(limits);
	const trackOutputPath = createArchiveOutputPathTracker();
	return (entry) => {
		entryCount += 1;
		assertArchiveEntryCountWithinLimit(entryCount, limits);
		validateArchiveEntryPath(entry.path, { escapeLabel: params.escapeLabel });
		const relPath = stripArchivePath(entry.path, strip);
		if (!relPath) return false;
		validateArchiveEntryPath(relPath, { escapeLabel: params.escapeLabel });
		assertArchiveEntryPathComponentsWithinLimit(relPath, limits);
		trackOutputPath(relPath, entry.path);
		resolveArchiveOutputPath({
			rootDir: params.rootDir,
			relPath,
			originalPath: entry.path,
			escapeLabel: params.escapeLabel
		});
		const kind = archiveEntryKindFromTarType(entry.type);
		if (!shouldExtractArchiveEntry({
			filter: params.entryFilter,
			onFiltered: params.onFiltered,
			entry: {
				path: entry.path,
				kind,
				size: entry.size
			}
		})) return false;
		if (BLOCKED_TAR_ENTRY_TYPES.has(entry.type)) throw new ArchiveSecurityError("entry-link", `tar entry is a link: ${formatErrorDetail(entry.path)}`);
		budget.startEntry();
		budget.addEntrySize(entry.size);
		return true;
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-zip-entry.js
function zipEntryIntegrityMetadata(entry) {
	const data = entry._data;
	if (!data || "then" in data) return void 0;
	return data;
}
function hasDeferredEmptyZipData(entry) {
	const data = entry._data;
	return Boolean(data && "then" in data);
}
const ZIP_UNIX_FILE_TYPE_MASK = 61440;
const ZIP_UNIX_SYMLINK_TYPE = 40960;
function isZipSymlinkEntry(entry) {
	return typeof entry.unixPermissions === "number" && (entry.unixPermissions & ZIP_UNIX_FILE_TYPE_MASK) === ZIP_UNIX_SYMLINK_TYPE;
}
function zipEntryMode(entry, policy) {
	return resolveArchiveEntryMode({
		kind: entry.dir ? "directory" : "file",
		archivedMode: entry.unixPermissions,
		policy
	});
}
function zipEntryDeclaredSize(entry) {
	return Math.max(0, Math.floor(zipEntryIntegrityMetadata(entry)?.uncompressedSize ?? 0));
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-zip-integrity.js
const CRC32_TABLE = Array.from({ length: 256 }, (_, index) => {
	let value = index;
	for (let bit = 0; bit < 8; bit += 1) value = (value & 1) !== 0 ? 3988292384 ^ value >>> 1 : value >>> 1;
	return value >>> 0;
});
function updateCrc32(previous, buffer) {
	let crc = previous ^ -1;
	for (const byte of buffer) crc = crc >>> 8 ^ (CRC32_TABLE[(crc ^ byte) & 255] ?? 0);
	return (crc ^ -1) >>> 0;
}
function normalizeZipIntegrityError(error) {
	if (error instanceof Error && error.message.includes("uncompressed data size mismatch")) return new ArchiveFormatError(`invalid ZIP entry data: ${error.message}`, { cause: error });
	return error instanceof Error ? error : new Error(String(error));
}
function createZipIntegrityTransform(entry) {
	const metadata = zipEntryIntegrityMetadata(entry);
	const deferredEmpty = hasDeferredEmptyZipData(entry);
	const expectedCrc32 = deferredEmpty ? 0 : metadata?.crc32;
	const expectedSize = deferredEmpty ? 0 : metadata?.uncompressedSize;
	if (typeof expectedCrc32 !== "number" || !Number.isInteger(expectedCrc32) || typeof expectedSize !== "number" || !Number.isSafeInteger(expectedSize) || expectedSize < 0) throw new ArchiveFormatError(`zip entry has invalid integrity metadata: ${entry.name}`);
	let actualCrc32 = 0;
	let actualSize = 0;
	return new Transform({
		transform(chunk, _encoding, callback) {
			const buffer = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
			actualCrc32 = updateCrc32(actualCrc32, buffer);
			actualSize += buffer.byteLength;
			callback(null, buffer);
		},
		flush(callback) {
			if (actualSize !== expectedSize || actualCrc32 !== expectedCrc32 >>> 0) {
				callback(new ArchiveFormatError(`zip entry integrity check failed: ${entry.name}`));
				return;
			}
			callback();
		}
	});
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-input.js
async function closeFileHandle(handle) {
	if (handle) await handle.close().catch(() => void 0);
}
async function writeFileHandleFully(params) {
	let offset = 0;
	while (offset < params.bytes) {
		params.deadline.check();
		const { bytesWritten } = await params.handle.write(params.buffer, offset, params.bytes - offset);
		if (bytesWritten <= 0) throw new Error("archive staging write made no progress");
		offset += bytesWritten;
	}
}
async function stageArchiveFileForExtraction(params) {
	params.deadline.check();
	const sourcePath = path.resolve(params.archivePath);
	const initialStat = await fs$1.lstat(sourcePath);
	if (initialStat.isSymbolicLink() || !initialStat.isFile()) throw new Error(`archive is not a regular file: ${params.archivePath}`);
	if (initialStat.size > params.limits.maxArchiveBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT);
	const noFollow = process.platform !== "win32" && "O_NOFOLLOW" in constants ? constants.O_NOFOLLOW : 0;
	const handle = await fs$1.open(sourcePath, constants.O_RDONLY | noFollow);
	let staged;
	let output;
	try {
		staged = await tempFile({
			prefix: "fs-safe-archive-input",
			fileName: path.basename(sourcePath)
		});
		const openedStat = await handle.stat();
		const pathStat = await fs$1.lstat(sourcePath);
		if (!openedStat.isFile() || pathStat.isSymbolicLink() || !pathStat.isFile() || !sameFileIdentity(initialStat, openedStat) || !sameFileIdentity(pathStat, openedStat)) throw new Error("archive changed during validation");
		const flags = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (process.platform !== "win32" && "O_NOFOLLOW" in constants ? constants.O_NOFOLLOW : 0);
		output = await fs$1.open(staged.path, flags, 384);
		const buffer = Buffer.allocUnsafe(64 * 1024);
		let written = 0;
		while (true) {
			params.deadline.check();
			const { bytesRead } = await handle.read(buffer, 0, buffer.length, null);
			if (bytesRead === 0) break;
			written += bytesRead;
			if (written > params.limits.maxArchiveBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT);
			await writeFileHandleFully({
				handle: output,
				buffer,
				bytes: bytesRead,
				deadline: params.deadline
			});
		}
		await output.close();
		output = void 0;
		return staged;
	} catch (error) {
		await closeFileHandle(output);
		await staged?.cleanup().catch(() => void 0);
		throw error;
	} finally {
		await closeFileHandle(handle);
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-native.js
function policyKind(kind) {
	if (kind === "file" || kind === "directory") return kind;
	if (kind === "symlink" || kind === "hardlink") return "symlink";
	return "other";
}
function throwMappedNativeError(error) {
	if (error instanceof Error) {
		for (const code of Object.values(ARCHIVE_LIMIT_ERROR_CODE)) if (error.message.includes(code)) throw new ArchiveLimitError(code);
		if (isArchiveFormatErrorMessage(error.message)) throw new ArchiveFormatError(error.message, { cause: error });
		if (error.code === "InvalidArg") throw new ArchiveFormatError(`invalid archive: ${error.message}`, { cause: error });
	}
	throw error;
}
async function extractNativeArchive(params) {
	const limits = resolveExtractLimits(params.limits);
	const stagedArchive = await stageArchiveFileForExtraction({
		archivePath: params.archivePath,
		limits,
		deadline: params.deadline
	});
	try {
		const destinationRealDir = await prepareArchiveDestinationDir(params.destDir);
		await withStagedArchiveDestination({
			destinationRealDir,
			run: async (stagingDir) => {
				params.deadline.check();
				const manifest = await params.binding.inspectArchiveNative(stagedArchive.path, params.kind, limits.maxEntries, limits.maxMetaEntryBytes, limits.maxArchiveBytes, params.deadline.signal).catch(throwMappedNativeError);
				params.deadline.check();
				assertArchiveEntryCountWithinLimit(manifest.length, limits);
				const strip = Math.max(0, Math.floor(params.stripComponents ?? 0));
				const budget = createByteBudgetTracker(limits);
				const trackOutputPath = createArchiveOutputPathTracker();
				const plan = [];
				for (const entry of manifest) {
					params.deadline.check();
					validateArchiveEntryPath(entry.path);
					const relPath = stripArchivePath(entry.path, strip);
					if (!relPath) continue;
					validateArchiveEntryPath(relPath);
					assertArchiveEntryPathComponentsWithinLimit(relPath, limits);
					trackOutputPath(relPath, entry.path);
					resolveArchiveOutputPath({
						rootDir: stagingDir,
						relPath,
						originalPath: entry.path
					});
					const kind = policyKind(entry.kind);
					if (!shouldExtractArchiveEntry({
						filter: params.entryFilter,
						onFiltered: params.onFiltered,
						entry: {
							path: entry.path,
							kind,
							size: entry.size
						}
					})) continue;
					if (entry.kind === "sparse") throw new ArchiveFormatError(`GNU sparse archive entry is not supported: ${formatErrorDetail(entry.path)}`);
					if (kind === "symlink") throw new ArchiveSecurityError("entry-link", `${params.kind === "zip" ? "zip" : "tar"} entry is a link: ${formatErrorDetail(entry.path)}`);
					if (!Number.isSafeInteger(entry.size) || entry.size < 0) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
					if (kind === "file") {
						budget.startEntry();
						budget.addEntrySize(entry.size);
					}
					if (kind === "file" || kind === "directory") plan.push({
						index: entry.index,
						path: relPath,
						kind,
						size: entry.size,
						mode: resolveArchiveEntryMode({
							kind,
							archivedMode: entry.mode,
							policy: params.entryModes
						})
					});
				}
				const directory = await fs$1.open(stagingDir, constants.O_RDONLY | (typeof constants.O_DIRECTORY === "number" ? constants.O_DIRECTORY : 0));
				try {
					params.deadline.check();
					await params.binding.extractArchiveNative(stagedArchive.path, params.kind, directory.fd, plan, limits.maxMetaEntryBytes, params.deadline.signal).catch(throwMappedNativeError);
				} finally {
					await directory.close().catch(() => void 0);
				}
				params.deadline.check();
				await mergeExtractedTreeIntoDestination({
					sourceDir: stagingDir,
					destinationDir: params.destDir,
					destinationRealDir
				});
			}
		});
	} finally {
		await stagedArchive.cleanup();
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-tar-runtime.js
async function importOptionalTar() {
	try {
		return await import("tar");
	} catch (cause) {
		throw new Error("Optional archive dependency \"tar\" is not installed. Install it to use TAR archive helpers from @openclaw/fs-safe/archive.", { cause });
	}
}
function normalizeTarParserError(error) {
	const code = error?.code;
	if (typeof code !== "string" || !code.startsWith("TAR_")) return error;
	return new ArchiveFormatError(`invalid TAR archive: ${error instanceof Error ? error.message : String(error)}`, { cause: error instanceof Error ? error : void 0 });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-tar-meta.js
var TarMetadataMeter = class extends Transform {
	maxMetaEntryBytes;
	block = Buffer.alloc(512);
	blockLength = 0;
	state = { kind: "header" };
	constructor(maxMetaEntryBytes) {
		super();
		this.maxMetaEntryBytes = maxMetaEntryBytes;
	}
	invalid(message) {
		return new ArchiveFormatError(`invalid TAR header: ${message}`);
	}
	parseSize() {
		const field = this.block.subarray(124, 136);
		if ((field[0] ?? 0) & 128) {
			if (field[0] !== 128) throw this.invalid("base-256 size is negative or malformed");
			let value = 0n;
			for (const byte of field.subarray(1)) value = value << 8n | BigInt(byte);
			if (value > BigInt(Number.MAX_SAFE_INTEGER)) throw this.invalid("base-256 size exceeds the safe integer range");
			return Number(value);
		}
		const zero = field.indexOf(0);
		const text = field.subarray(0, zero < 0 ? field.length : zero).toString("ascii").trim();
		if (!text || !/^[0-7]+$/.test(text)) throw this.invalid("size is not valid octal");
		const value = Number.parseInt(text, 8);
		if (!Number.isSafeInteger(value)) throw this.invalid("octal size exceeds the safe integer range");
		return value;
	}
	finishHeader() {
		if (this.block.every((byte) => byte === 0)) {
			this.blockLength = 0;
			this.state = { kind: "header" };
			return;
		}
		const nameEnd = this.block.subarray(0, 100).indexOf(0);
		const name = this.block.subarray(0, nameEnd < 0 ? 100 : nameEnd);
		if (name.length === 0) throw this.invalid("entry path is empty");
		if (this.block[156] !== 53 && name.at(-1) === 47) throw this.invalid("non-directory entry path ends with a separator");
		const size = this.parseSize();
		const type = this.block[156];
		if ([
			120,
			103,
			76,
			75,
			88
		].includes(type ?? -1) && size > this.maxMetaEntryBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.META_ENTRY_SIZE_EXCEEDS_LIMIT);
		if (type === 120 || type === 103 || type === 88) throw this.invalid("PAX metadata is unmeterable without interpreting content");
		const padded = Math.ceil(size / 512) * 512;
		if (!Number.isSafeInteger(padded)) throw this.invalid("entry padding exceeds the safe integer range");
		if (type === 83) {
			if (this.block[482] !== 0 && this.block[482] !== 1) throw this.invalid("GNU sparse extension flag is not 0 or 1");
			if (this.block[482] === 0) throw this.invalid("GNU sparse entries are not supported");
			this.state = {
				kind: "sparse",
				dataRemaining: padded,
				metaBytes: 0
			};
		} else this.state = padded === 0 ? { kind: "header" } : {
			kind: "data",
			remaining: padded
		};
		this.blockLength = 0;
	}
	finishSparseHeader(state) {
		const metaBytes = state.metaBytes + 512;
		if (metaBytes > this.maxMetaEntryBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.META_ENTRY_SIZE_EXCEEDS_LIMIT);
		if (this.block[504] !== 0 && this.block[504] !== 1) throw this.invalid("GNU sparse extension flag is not 0 or 1");
		if (this.block[504] === 1) this.state = {
			...state,
			metaBytes
		};
		else throw this.invalid("GNU sparse entries are not supported");
		this.blockLength = 0;
	}
	meter(chunk) {
		let offset = 0;
		while (offset < chunk.length) {
			if (this.state.kind === "data") {
				const take = Math.min(this.state.remaining, chunk.length - offset);
				offset += take;
				const remaining = this.state.remaining - take;
				this.state = remaining === 0 ? { kind: "header" } : {
					kind: "data",
					remaining
				};
				continue;
			}
			const take = Math.min(512 - this.blockLength, chunk.length - offset);
			chunk.copy(this.block, this.blockLength, offset, offset + take);
			this.blockLength += take;
			offset += take;
			if (this.blockLength === 512) if (this.state.kind === "sparse") this.finishSparseHeader(this.state);
			else this.finishHeader();
		}
	}
	_transform(chunk, _encoding, callback) {
		try {
			this.meter(chunk);
			callback(null, chunk);
		} catch (error) {
			callback(error instanceof Error ? error : new Error(String(error)));
		}
	}
	_flush(callback) {
		if (this.state.kind === "header" && this.blockLength === 0) callback();
		else callback(this.invalid(this.state.kind === "header" ? "truncated TAR header" : "truncated TAR entry"));
	}
};
async function isGzip(filePath) {
	const handle = await fs.promises.open(filePath, "r");
	try {
		const magic = Buffer.alloc(2);
		const { bytesRead } = await handle.read(magic, 0, 2, 0);
		return bytesRead === 2 && magic[0] === 31 && magic[1] === 139;
	} finally {
		await handle.close();
	}
}
async function preflightTarMetadata(params) {
	const input = fs.createReadStream(params.archivePath);
	const meter = new TarMetadataMeter(params.maxMetaEntryBytes);
	const sink = new Writable({ write(_chunk, _encoding, callback) {
		callback();
	} });
	if (await isGzip(params.archivePath)) await pipeline$1(input, createGunzip(), meter, sink, { signal: params.signal });
	else await pipeline$1(input, meter, sink, { signal: params.signal });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive.js
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in constants;
const OPEN_WRITE_CREATE_FLAGS = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
async function readZipEntryStream(entry) {
	if (typeof entry.nodeStream === "function") return entry.nodeStream();
	const buf = await entry.async("nodebuffer");
	return Readable.from(buf);
}
function resolveZipOutputPath(params) {
	validateArchiveEntryPath(params.entryPath);
	const relPath = stripArchivePath(params.entryPath, params.strip);
	if (!relPath) return null;
	validateArchiveEntryPath(relPath);
	return {
		relPath,
		outPath: resolveArchiveOutputPath({
			rootDir: params.destinationDir,
			relPath,
			originalPath: params.entryPath
		})
	};
}
async function prepareZipOutputPath(params) {
	await prepareArchiveOutputPath(params);
}
async function writeZipFileEntry(params) {
	params.deadline.check();
	params.budget.startEntry();
	const readable = await readZipEntryStream(params.entry);
	const destinationPath = params.outPath;
	let tempHandle = null;
	let handleClosedByStream = false;
	try {
		await writeSiblingTempFile({
			dir: path.dirname(destinationPath),
			tempPrefix: `.${path.basename(destinationPath)}.fs-safe-archive`,
			chmodDir: false,
			mode: params.mode,
			writeTemp: async (tempPath) => {
				tempHandle = await fs$1.open(tempPath, OPEN_WRITE_CREATE_FLAGS, 438);
				const writable = tempHandle.createWriteStream();
				writable.once("close", () => {
					handleClosedByStream = true;
				});
				try {
					await pipeline$1(readable, createExtractBudgetTransform({ onChunkBytes: params.budget.addBytes }), createZipIntegrityTransform(params.entry), writable, { signal: params.deadline.signal });
				} catch (err) {
					throw normalizeZipIntegrityError(createPipelineTimeoutError(err, params.deadline));
				}
				params.deadline.check();
				if (!handleClosedByStream) {
					await tempHandle.close().catch(() => void 0);
					handleClosedByStream = true;
				}
				tempHandle = null;
				return destinationPath;
			},
			resolveFinalPath: (filePath) => filePath
		});
	} catch (err) {
		throw err;
	} finally {
		const openTempHandle = tempHandle;
		if (openTempHandle && !handleClosedByStream) await openTempHandle.close().catch(() => void 0);
	}
}
async function extractZip(params) {
	const limits = resolveExtractLimits(params.limits);
	const stagedArchive = await stageArchiveFileForExtraction({
		archivePath: params.archivePath,
		limits,
		deadline: params.deadline
	});
	try {
		const destinationRealDir = await prepareArchiveDestinationDir(params.destDir);
		params.deadline.check();
		const buffer = await fs$1.readFile(stagedArchive.path, { signal: params.deadline.signal });
		params.deadline.check();
		const zip = await waitForDeadline(loadZipArchiveWithPreflight(buffer, limits), params.deadline);
		params.deadline.check();
		const entries = Object.values(zip.files);
		const strip = Math.max(0, Math.floor(params.stripComponents ?? 0));
		assertArchiveEntryCountWithinLimit(entries.length, limits);
		const budget = createByteBudgetTracker(limits);
		const trackOutputPath = createArchiveOutputPathTracker();
		await withStagedArchiveDestination({
			destinationRealDir,
			run: async (stagingDir) => {
				const stagingRealDir = await fs$1.realpath(stagingDir);
				for (const entry of entries) {
					params.deadline.check();
					const output = resolveZipOutputPath({
						entryPath: entry.name,
						strip,
						destinationDir: stagingRealDir
					});
					if (!output) continue;
					assertArchiveEntryPathComponentsWithinLimit(output.relPath, limits);
					trackOutputPath(output.relPath, entry.name);
					const isSymlink = isZipSymlinkEntry(entry);
					const entryKind = isSymlink ? "symlink" : entry.dir ? "directory" : "file";
					const entrySize = zipEntryDeclaredSize(entry);
					if (!shouldExtractArchiveEntry({
						filter: params.entryFilter,
						onFiltered: params.onFiltered,
						entry: {
							path: entry.name,
							kind: entryKind,
							size: entrySize
						}
					})) continue;
					const mode = zipEntryMode(entry, params.entryModes);
					await prepareZipOutputPath({
						destinationDir: stagingRealDir,
						destinationRealDir: stagingRealDir,
						relPath: output.relPath,
						outPath: output.outPath,
						originalPath: entry.name,
						isDirectory: entry.dir
					});
					if (entry.dir) {
						await fs$1.chmod(output.outPath, mode);
						continue;
					}
					if (isSymlink) throw new ArchiveSecurityError("entry-link", `zip entry is a link: ${entry.name}`);
					await writeZipFileEntry({
						entry,
						outPath: output.outPath,
						budget,
						deadline: params.deadline,
						mode
					});
				}
				params.deadline.check();
				await mergeExtractedTreeIntoDestination({
					sourceDir: stagingRealDir,
					destinationDir: params.destDir,
					destinationRealDir
				});
				params.deadline.check();
			}
		});
	} finally {
		await stagedArchive.cleanup();
	}
}
async function extractArchive(params) {
	const kind = params.kind ?? resolveArchiveKind(params.archivePath);
	if (!kind) throw new Error(`unsupported archive: ${params.archivePath}`);
	const label = kind === "zip" ? "extract zip" : "extract tar";
	const native = getNativeBinding();
	if (native) {
		await withExtractionDeadline(params.timeoutMs, label, async (deadline) => extractNativeArchive({
			binding: native,
			archivePath: params.archivePath,
			destDir: params.destDir,
			kind,
			stripComponents: params.stripComponents,
			limits: params.limits,
			deadline,
			entryModes: params.entryModes,
			entryFilter: params.entryFilter,
			onFiltered: params.onFiltered
		}));
		return;
	}
	if (kind === "tar-zstd" || kind === "tar-bzip2") throw new FsSafeError("helper-unavailable", `${kind} archives require a supported bundled native binding`);
	if (kind === "tar") {
		await withExtractionDeadline(params.timeoutMs, label, async (deadline) => {
			const tar = await importOptionalTar();
			const limits = resolveExtractLimits(params.limits);
			const stagedArchive = await stageArchiveFileForExtraction({
				archivePath: params.archivePath,
				limits,
				deadline
			});
			try {
				await preflightTarMetadata({
					archivePath: stagedArchive.path,
					maxMetaEntryBytes: limits.maxMetaEntryBytes,
					signal: deadline.signal
				});
				deadline.check();
				const destinationRealDir = await prepareArchiveDestinationDir(params.destDir);
				await withStagedArchiveDestination({
					destinationRealDir,
					run: async (stagingDir) => {
						deadline.check();
						const checkTarEntrySafety = createTarEntryPreflightChecker({
							rootDir: destinationRealDir,
							stripComponents: params.stripComponents,
							limits,
							entryFilter: params.entryFilter,
							onFiltered: params.onFiltered
						});
						const acceptedEntries = [];
						const extractor = tar.x({
							cwd: stagingDir,
							strip: Math.max(0, Math.floor(params.stripComponents ?? 0)),
							gzip: params.tarGzip,
							signal: deadline.signal,
							preservePaths: false,
							noChmod: true,
							preserveOwner: false,
							strict: true,
							maxMetaEntrySize: limits.maxMetaEntryBytes,
							filter(_entryPath, entry) {
								try {
									const info = readTarEntryInfo(entry);
									const accepted = checkTarEntrySafety(info);
									if (accepted) {
										entry.path = normalizeArchiveEntryPath(info.path);
										const relPath = stripArchivePath(info.path, Math.max(0, Math.floor(params.stripComponents ?? 0)));
										if (relPath) acceptedEntries.push({
											path: relPath,
											mode: resolveArchiveEntryMode({
												kind: info.type === "Directory" || info.type === "GNUDumpDir" ? "directory" : "file",
												archivedMode: info.mode,
												policy: params.entryModes
											})
										});
									}
									return accepted;
								} catch (error) {
									this.abort(error instanceof Error ? error : new Error(String(error)));
									return false;
								}
							},
							onReadEntry(entry) {
								try {
									deadline.check();
								} catch (err) {
									const error = err instanceof Error ? err : new Error(String(err));
									this.abort?.(error);
								}
							}
						});
						try {
							await pipeline$1(fs.createReadStream(stagedArchive.path), extractor, { signal: deadline.signal });
						} catch (error) {
							throw normalizeTarParserError(createPipelineTimeoutError(error, deadline));
						}
						for (const accepted of acceptedEntries) {
							const outputPath = resolveArchiveOutputPath({
								rootDir: stagingDir,
								relPath: accepted.path,
								originalPath: accepted.path
							});
							await fs$1.chmod(outputPath, accepted.mode);
						}
						deadline.check();
						await mergeExtractedTreeIntoDestination({
							sourceDir: stagingDir,
							destinationDir: params.destDir,
							destinationRealDir
						});
						deadline.check();
					}
				});
			} finally {
				await stagedArchive.cleanup();
			}
		});
		return;
	}
	await withExtractionDeadline(params.timeoutMs, label, async (deadline) => extractZip({
		archivePath: params.archivePath,
		destDir: params.destDir,
		stripComponents: params.stripComponents,
		limits: params.limits,
		deadline,
		entryModes: params.entryModes,
		entryFilter: params.entryFilter,
		onFiltered: params.onFiltered
	}));
}
//#endregion
export { createZipIntegrityTransform as a, readTarEntryInfo as c, withStagedArchiveDestination as d, normalizeTarParserError as i, mergeExtractedTreeIntoDestination as l, preflightTarMetadata as n, normalizeZipIntegrityError as o, importOptionalTar as r, createTarEntryPreflightChecker as s, extractArchive as t, prepareArchiveDestinationDir as u };
