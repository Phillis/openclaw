import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { n as readFileDescriptorBoundedSync } from "./bounded-read-W_MSGG4q.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import { d as createAsyncDirectoryGuard, l as assertAsyncDirectoryGuard, n as canonicalPathFromExistingAncestor } from "./absolute-path-DBVN5h2m.js";
import { g as resolveHomeRelativePath, t as runPinnedWriteHelper } from "./pinned-write-CKWgTqHs.js";
import { t as serializePathWrite } from "./write-queue-Cw9r0L36.js";
import { t as openPinnedFileSync } from "./pinned-open-1bJyI2r0.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/secret-file.js
const DEFAULT_SECRET_FILE_MAX_BYTES = 16 * 1024;
const PRIVATE_SECRET_DIR_MODE = 448;
const PRIVATE_SECRET_FILE_MODE = 384;
function normalizeSecretReadError(error) {
	return error instanceof Error ? error : new Error(String(error));
}
function secretPathErrorCode(error) {
	const code = error.code;
	return code === "ENOENT" || code === "ENOTDIR" ? "not-found" : "invalid-path";
}
function resolveUserPath(input) {
	return resolveHomeRelativePath(input);
}
function readSecretFileOutcomeSync(filePath, label, options = {}) {
	const resolvedPath = resolveUserPath(filePath.trim());
	if (!resolvedPath) return {
		ok: false,
		code: "invalid-path",
		message: `${label} file path is empty.`
	};
	const maxBytes = options.maxBytes ?? 16384;
	let previewStat;
	try {
		previewStat = fs.lstatSync(resolvedPath);
	} catch (error) {
		const normalized = normalizeSecretReadError(error);
		return {
			ok: false,
			code: secretPathErrorCode(error),
			error: normalized,
			message: `Failed to inspect ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	}
	if (previewStat.isSymbolicLink()) if (!options.rejectSymlink) try {
		previewStat = fs.statSync(resolvedPath);
	} catch (error) {
		const normalized = normalizeSecretReadError(error);
		return {
			ok: false,
			code: secretPathErrorCode(error),
			error: normalized,
			message: `Failed to inspect ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	}
	else return {
		ok: false,
		code: "symlink",
		message: `${label} file at ${resolvedPath} must not be a symlink.`
	};
	if (!previewStat.isFile()) return {
		ok: false,
		code: "not-file",
		message: `${label} file at ${resolvedPath} must be a regular file.`
	};
	if (options.rejectHardlinks !== false && previewStat.nlink > 1) return {
		ok: false,
		code: "hardlink",
		message: `${label} file at ${resolvedPath} must not be hardlinked.`
	};
	if (previewStat.size > maxBytes) return {
		ok: false,
		code: "too-large",
		message: `${label} file at ${resolvedPath} exceeds ${maxBytes} bytes.`
	};
	const opened = openPinnedFileSync({
		filePath: resolvedPath,
		rejectPathSymlink: options.rejectSymlink,
		rejectHardlinks: options.rejectHardlinks !== false
	});
	if (!opened.ok) {
		const error = normalizeSecretReadError(opened.reason === "validation" ? /* @__PURE__ */ new Error("security validation failed") : opened.error);
		return {
			ok: false,
			code: opened.reason === "path" ? "not-found" : "path-mismatch",
			error,
			message: `Failed to read ${label} file at ${resolvedPath}: ${String(error)}`
		};
	}
	try {
		if (!sameFileIdentity(previewStat, opened.stat)) {
			const error = new FsSafeError("path-mismatch", "security validation failed");
			return {
				ok: false,
				code: "path-mismatch",
				error,
				message: `Failed to read ${label} file at ${resolvedPath}: ${String(error)}`
			};
		}
		const secret = readFileDescriptorBoundedSync(opened.fd, maxBytes).toString("utf8").trim();
		if (!secret) return {
			ok: false,
			code: "invalid-path",
			message: `${label} file at ${resolvedPath} is empty.`
		};
		return {
			ok: true,
			secret
		};
	} catch (error) {
		const normalized = normalizeSecretReadError(error);
		return {
			ok: false,
			code: error instanceof FsSafeError ? error.code : "read-failed",
			error: normalized,
			message: `Failed to read ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
function readSecretFileSync(filePath, label, options = {}) {
	const result = readSecretFileOutcomeSync(filePath, label, options);
	if (result.ok) return result.secret;
	throw new FsSafeError(result.code, result.message, { cause: result.error });
}
function tryReadSecretFileSync(filePath, label, options = {}) {
	if (!filePath?.trim()) return;
	const result = readSecretFileOutcomeSync(filePath, label, options);
	if (result.ok) return result.secret;
	if (result.code === "not-found") return;
	throw new FsSafeError(result.code, result.message, { cause: result.error });
}
function isRelativeEscape(relativePath) {
	return relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath);
}
function assertPathWithinRoot(rootDir, targetPath) {
	const relative = path.relative(rootDir, targetPath);
	if (!relative || isRelativeEscape(relative)) throw new Error(`Private secret path must stay under ${rootDir}.`);
}
function assertRealPathWithinRoot(rootDir, targetPath) {
	if (isRelativeEscape(path.relative(rootDir, targetPath))) throw new Error(`Private secret path must stay under ${rootDir}.`);
}
async function enforcePrivatePathMode(resolvedPath, expectedMode, kind) {
	if (process.platform === "win32") return;
	await fs$1.chmod(resolvedPath, expectedMode);
	const actualMode = (await fs$1.stat(resolvedPath)).mode & 511;
	if (actualMode !== expectedMode) throw new Error(`Private secret ${kind} ${resolvedPath} has insecure permissions ${actualMode.toString(8)}.`);
}
async function enforcePrivateFileIdentityAndMode(resolvedPath, expectedIdentity, expectedMode) {
	const noFollowFlag = process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0;
	const handle = await fs$1.open(resolvedPath, fs.constants.O_RDONLY | noFollowFlag);
	try {
		const openedStat = await handle.stat();
		if (!openedStat.isFile() || !sameFileIdentity(openedStat, expectedIdentity)) throw new FsSafeError("path-mismatch", "private secret file changed during write");
		const pathStat = await fs$1.lstat(resolvedPath);
		if (pathStat.isSymbolicLink() || !sameFileIdentity(pathStat, openedStat)) throw new FsSafeError("path-mismatch", "private secret path changed during write");
		if (process.platform !== "win32") {
			await handle.chmod(expectedMode);
			const chmodStat = await handle.stat();
			const actualMode = chmodStat.mode & 511;
			if (actualMode !== expectedMode) throw new Error(`Private secret file ${resolvedPath} has insecure permissions ${actualMode.toString(8)}.`);
			const refreshedPathStat = await fs$1.lstat(resolvedPath);
			if (refreshedPathStat.isSymbolicLink() || !sameFileIdentity(refreshedPathStat, chmodStat)) throw new FsSafeError("path-mismatch", "private secret path changed during mode check");
		}
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function ensurePrivateDirectory(rootDir, targetDir, mode) {
	const resolvedRoot = path.resolve(rootDir);
	const resolvedTarget = path.resolve(targetDir);
	await fs$1.mkdir(resolvedRoot, {
		recursive: true,
		mode
	});
	const rootStat = await fs$1.lstat(resolvedRoot);
	if (rootStat.isSymbolicLink()) throw new Error(`Private secret root ${resolvedRoot} must not be a symlink.`);
	if (!rootStat.isDirectory()) throw new Error(`Private secret root ${resolvedRoot} must be a directory.`);
	const rootGuard = await createAsyncDirectoryGuard(resolvedRoot);
	await enforcePrivatePathMode(rootGuard.realPath, mode, "directory");
	await assertAsyncDirectoryGuard(rootGuard);
	if (resolvedTarget === resolvedRoot) return {
		rootGuard,
		targetReal: rootGuard.realPath
	};
	assertPathWithinRoot(resolvedRoot, resolvedTarget);
	const resolvedRootReal = rootGuard.realPath;
	let current = resolvedRoot;
	for (const segment of path.relative(resolvedRoot, resolvedTarget).split(path.sep).filter(Boolean)) {
		current = path.join(current, segment);
		const parentGuard = await createAsyncDirectoryGuard(path.dirname(current));
		await assertAsyncDirectoryGuard(rootGuard);
		try {
			const stat = await fs$1.lstat(current);
			if (stat.isSymbolicLink()) throw new Error(`Private secret directory component ${current} must not be a symlink.`);
			if (!stat.isDirectory()) throw new Error(`Private secret directory component ${current} must be a directory.`);
		} catch (error) {
			if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ENOENT") throw error;
			await assertAsyncDirectoryGuard(parentGuard);
			await fs$1.mkdir(current, { mode });
		}
		const currentReal = await fs$1.realpath(current);
		assertRealPathWithinRoot(resolvedRootReal, currentReal);
		await enforcePrivatePathMode(currentReal, mode, "directory");
		await assertAsyncDirectoryGuard(parentGuard);
		await assertAsyncDirectoryGuard(rootGuard);
	}
	return {
		rootGuard,
		targetReal: await fs$1.realpath(resolvedTarget)
	};
}
async function secretFileWriteQueueKey(filePath) {
	try {
		return await canonicalPathFromExistingAncestor(filePath);
	} catch {
		return path.resolve(filePath);
	}
}
async function materializeSecretFileAtomic(params, createOnly) {
	const mode = params.mode ?? 384;
	const dirMode = params.dirMode ?? 448;
	const resolvedRoot = path.resolve(params.rootDir);
	const resolvedFile = path.resolve(params.filePath);
	assertPathWithinRoot(resolvedRoot, resolvedFile);
	const { rootGuard, targetReal } = await ensurePrivateDirectory(resolvedRoot, path.dirname(resolvedFile), dirMode);
	await assertAsyncDirectoryGuard(rootGuard);
	assertRealPathWithinRoot(rootGuard.realPath, targetReal);
	const parentGuard = await createAsyncDirectoryGuard(targetReal);
	const fileName = path.basename(resolvedFile);
	const finalFilePath = path.join(targetReal, fileName);
	try {
		const stat = await fs$1.lstat(finalFilePath);
		if (createOnly) throw new FsSafeError("secret-exists", `Private secret file ${finalFilePath} already exists.`);
		if (stat.isSymbolicLink()) throw new Error(`Private secret file ${finalFilePath} must not be a symlink.`);
		if (!stat.isFile()) throw new Error(`Private secret file ${finalFilePath} must be a regular file.`);
	} catch (error) {
		if (!error || typeof error !== "object" || !("code" in error) || error.code !== "ENOENT") throw error;
	}
	await assertAsyncDirectoryGuard(rootGuard);
	await assertAsyncDirectoryGuard(parentGuard);
	const identity = await runPinnedWriteHelper({
		rootPath: parentGuard.realPath,
		relativeParentPath: "",
		basename: fileName,
		mkdir: false,
		mode,
		overwrite: !createOnly,
		input: {
			kind: "buffer",
			data: typeof params.content === "string" ? params.content : Buffer.from(params.content)
		},
		rootIdentity: {
			dev: parentGuard.stat.dev,
			ino: parentGuard.stat.ino
		}
	});
	await assertAsyncDirectoryGuard(rootGuard);
	await assertAsyncDirectoryGuard(parentGuard);
	await enforcePrivateFileIdentityAndMode(finalFilePath, identity, mode);
}
async function writeSecretFileAtomic(params) {
	await serializePathWrite(await secretFileWriteQueueKey(params.filePath), async () => {
		await materializeSecretFileAtomic(params, false);
	});
}
async function createSecretFileAtomic(params) {
	try {
		await serializePathWrite(await secretFileWriteQueueKey(params.filePath), async () => {
			await materializeSecretFileAtomic(params, true);
		});
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "already-exists" || error.code === "EEXIST") throw new FsSafeError("secret-exists", "Private secret file already exists.", { cause: error });
		throw error;
	}
}
//#endregion
export { readSecretFileSync as a, createSecretFileAtomic as i, PRIVATE_SECRET_DIR_MODE as n, tryReadSecretFileSync as o, PRIVATE_SECRET_FILE_MODE as r, writeSecretFileAtomic as s, DEFAULT_SECRET_FILE_MAX_BYTES as t };
