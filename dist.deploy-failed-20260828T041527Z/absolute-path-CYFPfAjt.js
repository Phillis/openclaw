import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { i as isNotFoundPathError, n as hasNodeErrorCode, r as isNodeError } from "./path-D138yf8v.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region node_modules/@openclaw/fs-safe/dist/root-errors.js
const REMOVE_NOT_EMPTY_CODES = /* @__PURE__ */ new Set(["ENOTEMPTY", "EEXIST"]);
function fileNotFoundError(cause) {
	return cause === void 0 ? new FsSafeError("not-found", "file not found") : new FsSafeError("not-found", "file not found", { cause });
}
function outsideWorkspaceError() {
	return new FsSafeError("outside-workspace", "file is outside workspace root");
}
function directoryComponentNotDirectoryError(cause) {
	return cause === void 0 ? new FsSafeError("not-file", "directory component must be a directory") : new FsSafeError("not-file", "directory component must be a directory", { cause });
}
function hardlinkedPathNotAllowedError() {
	return new FsSafeError("hardlink", "hardlinked path not allowed");
}
function isAlreadyExistsError(error) {
	return hasNodeErrorCode(error, "EEXIST") || /File exists|EEXIST/i.test(String(error));
}
function normalizePinnedWriteError(error) {
	if (error instanceof FsSafeError) return error;
	if (isNotFoundPathError(error)) return fileNotFoundError(error instanceof Error ? error : void 0);
	return new FsSafeError("invalid-path", "path is not a regular file under root", { cause: error instanceof Error ? error : void 0 });
}
function normalizePinnedPathError(error) {
	if (error instanceof FsSafeError) return error;
	return new FsSafeError("path-alias", "path is not under root", { cause: error instanceof Error ? error : void 0 });
}
function normalizeRemoveGuardError(error) {
	if (error instanceof FsSafeError) return error;
	if (isNotFoundPathError(error)) return fileNotFoundError(error instanceof Error ? error : void 0);
	return normalizePinnedPathError(error);
}
function normalizeRemovePathError(error) {
	if (error instanceof FsSafeError) return error;
	if (!isNodeError(error) || typeof error.code !== "string") return normalizePinnedPathError(error);
	const cause = error instanceof Error ? error : void 0;
	if (isNotFoundPathError(error)) return fileNotFoundError(cause);
	if (REMOVE_NOT_EMPTY_CODES.has(error.code)) return new FsSafeError("not-empty", "directory is not empty", { cause });
	return new FsSafeError("not-removable", "path could not be removed", { cause });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/directory-guard.js
async function createAsyncDirectoryGuard(dir) {
	const stat = await fs$1.lstat(dir);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	return {
		dir,
		realPath: await fs$1.realpath(dir),
		stat
	};
}
async function assertAsyncDirectoryGuard(guard) {
	const stat = await fs$1.lstat(guard.dir);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	if (!sameFileIdentity(stat, guard.stat) || await fs$1.realpath(guard.dir) !== guard.realPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
}
function createSyncDirectoryGuard(dir) {
	const stat = fs.lstatSync(dir);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	return {
		dir,
		realPath: fs.realpathSync(dir),
		stat
	};
}
function assertSyncDirectoryGuard(guard) {
	const stat = fs.lstatSync(guard.dir);
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
	if (!sameFileIdentity(stat, guard.stat) || fs.realpathSync(guard.dir) !== guard.realPath) throw new FsSafeError("path-mismatch", "directory changed during operation");
}
async function createNearestExistingDirectoryGuard(rootReal, targetPath) {
	let current = path.resolve(targetPath);
	const root = path.resolve(rootReal);
	while (current !== root) try {
		return await createAsyncDirectoryGuard(current);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		current = path.dirname(current);
	}
	return await createAsyncDirectoryGuard(root);
}
function createNearestExistingSyncDirectoryGuard(rootReal, targetPath) {
	let current = path.resolve(targetPath);
	const root = path.resolve(rootReal);
	while (current !== root) try {
		return createSyncDirectoryGuard(current);
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		current = path.dirname(current);
	}
	return createSyncDirectoryGuard(root);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/fs.js
/**
* Returns true when `fs.stat()` can stat the path.
*
* This follows stat semantics: broken symlinks return false, while symlinks to
* existing targets return true.
*/
async function pathExists(filePath) {
	try {
		await fs$1.stat(filePath);
		return true;
	} catch {
		return false;
	}
}
/**
* Synchronous counterpart to `pathExists()`, with the same `fs.statSync()`
* semantics.
*/
function pathExistsSync(filePath) {
	try {
		fs.statSync(filePath);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/absolute-path.js
function resolveSymlinkPolicy(policy) {
	if (policy === void 0) return "reject";
	if (policy !== "reject" && policy !== "follow") throw new TypeError(`invalid absolute path symlink policy: ${String(policy)}`);
	return policy;
}
function ensureDirectoryFailure(code, message, cause) {
	return {
		ok: false,
		code,
		error: new FsSafeError(code, message, { cause })
	};
}
async function assertGuardResult(guard, scopeLabel) {
	try {
		await assertAsyncDirectoryGuard(guard);
		return { ok: true };
	} catch (err) {
		if (err instanceof FsSafeError) return await directoryGuardFailure(err, guard.dir, scopeLabel);
		throw err;
	}
}
async function createDirectoryGuardResult(dir, scopeLabel) {
	try {
		return {
			ok: true,
			guard: await createAsyncDirectoryGuard(dir)
		};
	} catch (err) {
		if (err instanceof FsSafeError) return await directoryGuardFailure(err, dir, scopeLabel);
		throw err;
	}
}
function classifyDirectoryLookupError(err, scopeLabel) {
	const code = err.code;
	if (code === "ENOENT") return ensureDirectoryFailure("not-found", `directory path must have a real existing ancestor within ${scopeLabel}`, err);
	if (code === "ENOTDIR") return ensureDirectoryFailure("not-file", `path must be a real directory within ${scopeLabel}`, err);
	return null;
}
function classifyExistingDirectorySegment(stat, scopeLabel) {
	if (stat.isSymbolicLink()) return ensureDirectoryFailure("symlink", `directory path traverses a symlink within ${scopeLabel}`);
	if (!stat.isDirectory()) return ensureDirectoryFailure("not-file", `path must be a real directory within ${scopeLabel}`);
	return null;
}
async function directoryGuardFailure(err, dir, scopeLabel) {
	if (err.code !== "not-file") return {
		ok: false,
		code: err.code,
		error: err
	};
	try {
		const failure = classifyExistingDirectorySegment(await fs$1.lstat(dir), scopeLabel);
		if (failure) return failure;
	} catch (lookupErr) {
		const failure = classifyDirectoryLookupError(lookupErr, scopeLabel);
		if (failure) return failure;
		throw lookupErr;
	}
	return {
		ok: false,
		code: err.code,
		error: err
	};
}
async function resolveTrustedDirectoryPrefix(targetPath, scopeLabel) {
	const root = path.parse(targetPath).root;
	let current = root;
	let currentStat;
	try {
		currentStat = await fs$1.lstat(current);
	} catch (err) {
		const failure = classifyDirectoryLookupError(err, scopeLabel);
		if (failure) return failure;
		throw err;
	}
	const rootFailure = classifyExistingDirectorySegment(currentStat, scopeLabel);
	if (rootFailure) return rootFailure;
	const segments = path.relative(root, targetPath).split(path.sep).filter(Boolean);
	for (let index = 0; index < segments.length; index += 1) {
		const segment = segments[index];
		if (!segment) continue;
		const next = path.join(current, segment);
		try {
			const nextStat = await fs$1.lstat(next);
			const segmentFailure = classifyExistingDirectorySegment(nextStat, scopeLabel);
			if (segmentFailure) return segmentFailure;
			current = next;
			currentStat = nextStat;
		} catch (err) {
			if (err.code === "ENOENT") return {
				ok: true,
				ancestorPath: current,
				missingSegments: segments.slice(index)
			};
			const failure = classifyDirectoryLookupError(err, scopeLabel);
			if (failure) return failure;
			throw err;
		}
	}
	return {
		ok: true,
		ancestorPath: current,
		missingSegments: []
	};
}
function assertAbsolutePathInput(filePath) {
	if (!filePath) throw new FsSafeError("invalid-path", "path is required");
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", "path must not contain NUL bytes");
	if (!path.isAbsolute(filePath)) throw new FsSafeError("invalid-path", "path must be absolute");
	return path.normalize(filePath);
}
async function findExistingAncestor(filePath) {
	return (await findExistingAncestorWithStat(filePath))?.path ?? null;
}
async function findExistingAncestorWithStat(filePath) {
	let current = path.resolve(filePath);
	while (true) {
		try {
			return {
				path: current,
				stat: await fs$1.lstat(current)
			};
		} catch (err) {
			if (err.code !== "ENOENT") throw err;
		}
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
async function ensureAbsoluteDirectory(dirPath, options = {}) {
	const scopeLabel = options.scopeLabel ?? "directory";
	let targetPath;
	try {
		targetPath = assertAbsolutePathInput(dirPath);
	} catch (err) {
		if (err instanceof FsSafeError) return {
			ok: false,
			code: err.code,
			error: err
		};
		throw err;
	}
	const prefix = await resolveTrustedDirectoryPrefix(targetPath, scopeLabel);
	if (!prefix.ok) return prefix;
	let current = prefix.ancestorPath;
	const initialGuard = await createDirectoryGuardResult(prefix.ancestorPath, scopeLabel);
	if (!initialGuard.ok) return initialGuard;
	let currentGuard = initialGuard.guard;
	for (const segment of prefix.missingSegments) {
		current = path.join(current, segment);
		while (true) {
			const guardResult = await assertGuardResult(currentGuard, scopeLabel);
			if (!guardResult.ok) return guardResult;
			try {
				const stat = await fs$1.lstat(current);
				if (stat.isSymbolicLink()) return ensureDirectoryFailure("symlink", `directory path traverses a symlink within ${scopeLabel}`);
				if (!stat.isDirectory()) return ensureDirectoryFailure("not-file", `path must be a real directory within ${scopeLabel}`);
				break;
			} catch (err) {
				if (err.code !== "ENOENT") throw err;
				const parentStillValid = await assertGuardResult(currentGuard, scopeLabel);
				if (!parentStillValid.ok) return parentStillValid;
				try {
					await fs$1.mkdir(current, { mode: options.mode });
				} catch (mkdirErr) {
					if (mkdirErr.code === "EEXIST") continue;
					throw mkdirErr;
				}
			}
		}
		const nextGuard = await createDirectoryGuardResult(current, scopeLabel);
		if (!nextGuard.ok) return nextGuard;
		const previousGuardStillValid = await assertGuardResult(currentGuard, scopeLabel);
		if (!previousGuardStillValid.ok) return previousGuardStillValid;
		currentGuard = nextGuard.guard;
	}
	const finalGuardResult = await assertGuardResult(currentGuard, scopeLabel);
	if (!finalGuardResult.ok) return finalGuardResult;
	return {
		ok: true,
		path: targetPath
	};
}
async function canonicalPathFromExistingAncestor(filePath) {
	const ancestor = await findExistingAncestor(filePath);
	if (!ancestor) return path.resolve(filePath);
	let canonicalAncestor = ancestor;
	try {
		canonicalAncestor = await fs$1.realpath(ancestor);
	} catch {}
	const relative = path.relative(ancestor, filePath);
	return relative ? path.join(canonicalAncestor, relative) : canonicalAncestor;
}
async function resolveAbsolutePathForRead(filePath, options = {}) {
	const symlinks = resolveSymlinkPolicy(options.symlinks);
	const normalized = assertAbsolutePathInput(filePath);
	let canonicalPath;
	try {
		canonicalPath = await fs$1.realpath(normalized);
	} catch (err) {
		if (err.code === "ENOENT") throw new FsSafeError("not-found", "path not found", { cause: err });
		throw err;
	}
	if (symlinks === "reject" && canonicalPath !== normalized) throw new FsSafeError("symlink", "path traverses a symlink", { cause: { canonicalPath } });
	return {
		path: normalized,
		canonicalPath
	};
}
async function resolveAbsolutePathForWrite(filePath, options = {}) {
	const symlinks = resolveSymlinkPolicy(options.symlinks);
	const normalized = assertAbsolutePathInput(filePath);
	const parentDir = path.dirname(normalized);
	const parentExists = await pathExists(parentDir);
	if (symlinks === "reject") {
		const ancestor = await findExistingAncestor(parentDir);
		if (ancestor) {
			const canonicalAncestor = await fs$1.realpath(ancestor).catch(() => ancestor);
			if (canonicalAncestor !== ancestor) throw new FsSafeError("symlink", "path traverses a symlink", { cause: { canonicalPath: path.join(canonicalAncestor, path.relative(ancestor, normalized)) } });
		}
	}
	const canonicalPath = await canonicalPathFromExistingAncestor(normalized);
	if (symlinks === "reject" && canonicalPath !== normalized) throw new FsSafeError("symlink", "path traverses a symlink", { cause: { canonicalPath } });
	return {
		path: normalized,
		canonicalPath,
		parentDir,
		parentExists
	};
}
//#endregion
export { outsideWorkspaceError as C, normalizeRemovePathError as S, hardlinkedPathNotAllowedError as _, resolveAbsolutePathForRead as a, normalizePinnedWriteError as b, pathExistsSync as c, createAsyncDirectoryGuard as d, createNearestExistingDirectoryGuard as f, fileNotFoundError as g, directoryComponentNotDirectoryError as h, findExistingAncestor as i, assertAsyncDirectoryGuard as l, createSyncDirectoryGuard as m, canonicalPathFromExistingAncestor as n, resolveAbsolutePathForWrite as o, createNearestExistingSyncDirectoryGuard as p, ensureAbsoluteDirectory as r, pathExists as s, assertAbsolutePathInput as t, assertSyncDirectoryGuard as u, isAlreadyExistsError as v, normalizeRemoveGuardError as x, normalizePinnedPathError as y };
