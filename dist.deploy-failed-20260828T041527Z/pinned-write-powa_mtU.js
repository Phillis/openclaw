import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { n as normalizeOptionalString } from "./string-coerce-6TL5VVOL.js";
import { r as sha256Hex, t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { i as isNotFoundPathError, s as isPathRelativeEscape } from "./path-D138yf8v.js";
import { d as createAsyncDirectoryGuard, f as createNearestExistingDirectoryGuard, h as directoryComponentNotDirectoryError, l as assertAsyncDirectoryGuard, m as createSyncDirectoryGuard, p as createNearestExistingSyncDirectoryGuard, r as ensureAbsoluteDirectory, u as assertSyncDirectoryGuard } from "./absolute-path-CYFPfAjt.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import { d as removeNativeCreatedFileIfStillPinned, f as syncNativeFileBestEffort, n as withSidecarLock, p as writeNativeFd, u as getFsSafeTestHooks } from "./sidecar-lock-ChVk6eKw.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/home-dir.js
function normalize(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	if (trimmed === "undefined" || trimmed === "null") return;
	return trimmed;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveRawHomeDir(env, homedir) {
	const explicitHome = normalize(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveRawOsHomeDir(env, homedir);
	if (path.normalize(explicitHome).split(path.sep)[0] !== "~") return explicitHome;
	const fallbackHome = resolveRawOsHomeDir(env, homedir);
	if (!fallbackHome) return;
	return expandHomePrefix(explicitHome, { home: fallbackHome });
}
function resolveRawOsHomeDir(env, homedir) {
	const envHome = normalize(env.HOME);
	if (envHome) return envHome;
	const userProfile = normalize(env.USERPROFILE);
	if (userProfile) return userProfile;
	return normalizeSafe(homedir);
}
function normalizeSafe(homedir) {
	try {
		return normalize(homedir());
	} catch {
		return;
	}
}
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	return resolveEffectiveHomeDir(env, homedir) ?? path.resolve(process.cwd());
}
function expandHomePrefix(input, opts) {
	const segments = path.normalize(input).split(path.sep);
	if (segments[0] !== "~") return input;
	const home = normalize(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return path.join(home, ...segments.slice(1));
}
function resolveHomeRelativePath(input, opts) {
	if (!input) return input;
	if (path.normalize(input).split(path.sep)[0] !== "~") return path.resolve(input);
	const expanded = expandHomePrefix(input, {
		home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
		env: opts?.env,
		homedir: opts?.homedir
	});
	return path.resolve(expanded);
}
function resolveUserPath(input, optsOrEnv, homedir) {
	return resolveHomeRelativePath(input, optsOrEnv && ("env" in optsOrEnv || "homedir" in optsOrEnv) ? optsOrEnv : {
		env: optsOrEnv,
		homedir
	});
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/directory-durability.js
function directoryOpenFlags() {
	if (process.platform === "win32") return "r";
	return fs.constants.O_RDONLY | fs.constants.O_DIRECTORY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK;
}
function isWindowsDirectorySyncUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EACCES" || code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP" || code === "EPERM";
}
function isWindowsDirectoryOpenUnsupported(error) {
	if (process.platform !== "win32") return false;
	const code = error.code;
	return code === "EINVAL" || code === "EISDIR" || code === "ENOSYS" || code === "ENOTSUP";
}
function unsupportedOutcome(error) {
	const code = error.code;
	return code ? {
		status: "unsupported",
		code
	} : { status: "unsupported" };
}
function assertDirectory(identity, pathname, label) {
	if (identity.isSymbolicLink() || !identity.isDirectory()) throw new FsSafeError("not-file", `${label} must be a real directory: ${pathname}`);
}
async function createDirectoryReceipt(directoryPath, label) {
	const resolvedPath = path.resolve(directoryPath);
	const identity = await fs$1.lstat(resolvedPath);
	assertDirectory(identity, resolvedPath, label);
	return {
		path: resolvedPath,
		realPath: await fs$1.realpath(resolvedPath),
		identity
	};
}
function createDirectoryReceiptSync(directoryPath, label) {
	const resolvedPath = path.resolve(directoryPath);
	const identity = fs.lstatSync(resolvedPath);
	assertDirectory(identity, resolvedPath, label);
	return {
		path: resolvedPath,
		realPath: fs.realpathSync(resolvedPath),
		identity
	};
}
async function assertDirectoryReceiptCurrent(receipt, label) {
	const currentIdentity = await fs$1.lstat(receipt.path);
	assertDirectory(currentIdentity, receipt.path, label);
	if (!sameFileIdentity(receipt.identity, currentIdentity) || await fs$1.realpath(receipt.path) !== receipt.realPath) throw new FsSafeError("path-mismatch", `${label} changed during durable directory operation: ${receipt.path}`);
}
function assertDirectoryReceiptCurrentSync(receipt, label) {
	const currentIdentity = fs.lstatSync(receipt.path);
	assertDirectory(currentIdentity, receipt.path, label);
	if (!sameFileIdentity(receipt.identity, currentIdentity) || fs.realpathSync(receipt.path) !== receipt.realPath) throw new FsSafeError("path-mismatch", `${label} changed during durable directory operation: ${receipt.path}`);
}
async function assertOpenDirectoryCurrent(handle, receipt, label) {
	const openedIdentity = await handle.stat();
	assertDirectory(openedIdentity, receipt.path, label);
	if (!sameFileIdentity(receipt.identity, openedIdentity)) throw new FsSafeError("path-mismatch", `${label} handle changed during directory sync: ${receipt.path}`);
	await assertDirectoryReceiptCurrent(receipt, label);
}
var PinnedDirectoryImpl = class {
	receipt;
	#handle;
	#label;
	#closed = false;
	constructor(handle, receipt, label) {
		this.#handle = handle;
		this.receipt = receipt;
		this.#label = label;
	}
	async assertCurrent() {
		if (this.#closed) throw new FsSafeError("helper-failed", `${this.#label} pin is already closed`);
		await assertOpenDirectoryCurrent(this.#handle, this.receipt, this.#label);
	}
	async sync() {
		await this.assertCurrent();
		try {
			await this.#handle.sync();
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			await this.assertCurrent();
			return unsupportedOutcome(error);
		}
		await this.assertCurrent();
		return { status: "synced" };
	}
	async close() {
		if (this.#closed) return;
		this.#closed = true;
		await this.#handle.close();
	}
};
async function pinDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : directory;
	await assertDirectoryReceiptCurrent(receipt, label);
	const handle = await fs$1.open(receipt.path, directoryOpenFlags());
	try {
		await assertOpenDirectoryCurrent(handle, receipt, label);
		return new PinnedDirectoryImpl(handle, receipt, label);
	} catch (error) {
		await handle.close().catch(() => void 0);
		throw error;
	}
}
async function syncDirectory(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? await createDirectoryReceipt(directory, label) : directory;
	let pinned;
	try {
		pinned = await pinDirectory(receipt, { label });
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		await assertDirectoryReceiptCurrent(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		return await pinned.sync();
	} finally {
		await pinned.close();
	}
}
function syncDirectorySync(directory, options = {}) {
	const label = options.label ?? "directory";
	const receipt = typeof directory === "string" ? createDirectoryReceiptSync(directory, label) : directory;
	assertDirectoryReceiptCurrentSync(receipt, label);
	let descriptor;
	try {
		descriptor = fs.openSync(receipt.path, directoryOpenFlags());
	} catch (error) {
		if (!isWindowsDirectoryOpenUnsupported(error)) throw error;
		assertDirectoryReceiptCurrentSync(receipt, label);
		return unsupportedOutcome(error);
	}
	try {
		const openedIdentity = fs.fstatSync(descriptor);
		assertDirectory(openedIdentity, receipt.path, label);
		if (!sameFileIdentity(receipt.identity, openedIdentity)) throw new FsSafeError("path-mismatch", `${label} handle changed during directory sync: ${receipt.path}`);
		assertDirectoryReceiptCurrentSync(receipt, label);
		try {
			fs.fsyncSync(descriptor);
		} catch (error) {
			if (!isWindowsDirectorySyncUnsupported(error)) throw error;
			assertDirectoryReceiptCurrentSync(receipt, label);
			return unsupportedOutcome(error);
		}
		assertDirectoryReceiptCurrentSync(receipt, label);
		return { status: "synced" };
	} finally {
		fs.closeSync(descriptor);
	}
}
async function syncDirectoryBestEffort(directoryPath) {
	await syncDirectory(directoryPath).catch(() => void 0);
}
function syncDirectoryBestEffortSync(directoryPath) {
	try {
		syncDirectorySync(directoryPath);
	} catch {}
}
async function findExistingAncestorReceipt(targetPath, label) {
	let currentPath = path.resolve(targetPath);
	while (true) {
		try {
			return await createDirectoryReceipt(currentPath, label);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) throw new FsSafeError("not-found", `${label} has no existing directory ancestor`);
		currentPath = parentPath;
	}
}
async function ensureDurableDirectory(options) {
	const directoryPath = path.resolve(options.directoryPath);
	const label = options.label ?? "directory";
	const ancestorReceipt = await findExistingAncestorReceipt(directoryPath, label);
	const targetExists = ancestorReceipt.path === directoryPath;
	if (options.expectedExistingIdentity && (!targetExists || !sameFileIdentity(options.expectedExistingIdentity, ancestorReceipt.identity))) throw new FsSafeError("path-mismatch", `${label} changed before durable directory pinning: ${directoryPath}`);
	const ancestor = await pinDirectory(ancestorReceipt, { label });
	const pinnedDirectories = [ancestor];
	try {
		await ancestor.assertCurrent();
		if (!targetExists) if (options.create) await options.create(directoryPath);
		else {
			const created = await ensureAbsoluteDirectory(directoryPath, {
				mode: options.mode,
				scopeLabel: label
			});
			if (!created.ok) throw created.error;
		}
		await ancestor.assertCurrent();
		let currentPath = ancestor.receipt.path;
		for (const segment of path.relative(ancestor.receipt.path, directoryPath).split(path.sep).filter(Boolean)) {
			currentPath = path.join(currentPath, segment);
			pinnedDirectories.push(await pinDirectory(currentPath, { label }));
		}
		let parentSync = { status: "not-needed" };
		for (let index = pinnedDirectories.length - 1; index > 0; index -= 1) {
			const parent = pinnedDirectories[index - 1];
			const child = pinnedDirectories[index];
			if (!parent || !child) throw new FsSafeError("helper-failed", `${label} directory pin chain is incomplete`);
			await child.assertCurrent();
			try {
				const outcome = await parent.sync();
				if (outcome.status === "unsupported") parentSync = outcome;
				else if (parentSync.status === "not-needed") parentSync = outcome;
			} catch (error) {
				throw new FsSafeError("helper-failed", `${label} could not sync created directory edge ${child.receipt.path} through ${parent.receipt.path}`, { cause: error });
			}
			await child.assertCurrent();
		}
		const finalReceipt = pinnedDirectories.at(-1)?.receipt;
		if (!finalReceipt) throw new FsSafeError("helper-failed", `${label} directory receipt is missing`);
		await ancestor.assertCurrent();
		await assertDirectoryReceiptCurrent(finalReceipt, label);
		return {
			...finalReceipt,
			parentSync
		};
	} finally {
		await Promise.all(pinnedDirectories.toReversed().map(async (directory) => directory.close()));
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/guarded-mkdir.js
function isSameOrChildPath(candidate, parent) {
	const parentPrefix = parent.endsWith(path.sep) ? parent : `${parent}${path.sep}`;
	return candidate === parent || candidate.startsWith(parentPrefix);
}
async function realpathOrThrowNotFile(target) {
	try {
		return path.resolve(await fs$1.realpath(target));
	} catch (error) {
		if (isNotFoundPathError(error)) throw directoryComponentNotDirectoryError(error instanceof Error ? error : void 0);
		throw error;
	}
}
/**
* Creates each missing path component from `rootReal` down to `targetPath`,
* guarding every step. Returns the real (symlink-resolved) path of the final
* component so callers can guard/use that path directly instead of
* re-deriving it from the original, possibly-symlinked, lexical path.
*/
async function mkdirPathComponentsWithGuards(params) {
	const root = path.resolve(params.rootReal);
	const rootCanonical = path.resolve(await fs$1.realpath(root));
	const target = path.resolve(params.targetPath);
	const relative = path.relative(root, target);
	if (isPathRelativeEscape(relative)) throw new FsSafeError("outside-workspace", "directory is outside workspace root");
	let current = root;
	for (const part of relative.split(path.sep).filter(Boolean)) {
		const next = path.join(current, part);
		const parentGuard = await createAsyncDirectoryGuard(current);
		await assertAsyncDirectoryGuard(parentGuard);
		await params.beforeComponent?.(next);
		try {
			await fs$1.mkdir(next);
		} catch (error) {
			if (!error || typeof error !== "object" || !("code" in error) || error.code !== "EEXIST") throw error;
		}
		const stat = await fs$1.lstat(next);
		if (!stat.isSymbolicLink() && !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		const nextReal = await realpathOrThrowNotFile(next);
		if (!isSameOrChildPath(nextReal, rootCanonical)) throw new FsSafeError("outside-workspace", "directory escaped workspace root");
		if (stat.isSymbolicLink()) {
			if (!(await fs$1.stat(nextReal)).isDirectory()) throw directoryComponentNotDirectoryError();
			await createAsyncDirectoryGuard(nextReal);
			await assertAsyncDirectoryGuard(parentGuard);
			current = nextReal;
			continue;
		}
		await createAsyncDirectoryGuard(next);
		await assertAsyncDirectoryGuard(parentGuard);
		current = next;
	}
	return current;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/guarded-mutation.js
async function withAsyncDirectoryGuards(guards, mutate, options = {}) {
	for (const guard of guards) await assertAsyncDirectoryGuard(guard);
	const result = await mutate();
	if (options.verifyAfter !== false) try {
		for (const guard of guards) await assertAsyncDirectoryGuard(guard);
	} catch (error) {
		if (options.onPostGuardFailure) try {
			await options.onPostGuardFailure(result, error);
		} catch {}
		throw error;
	}
	return result;
}
function withSyncDirectoryGuards(guards, mutate, options = {}) {
	for (const guard of guards) assertSyncDirectoryGuard(guard);
	const result = mutate();
	if (options.verifyAfter !== false) for (const guard of guards) assertSyncDirectoryGuard(guard);
	return result;
}
async function guardedRename(params) {
	await withAsyncDirectoryGuards([await createAsyncDirectoryGuard(path.dirname(params.from)), params.targetRoot ? await createNearestExistingDirectoryGuard(params.targetRoot, path.dirname(params.to)) : await createAsyncDirectoryGuard(path.dirname(params.to))], async () => {
		await fs$1.rename(params.from, params.to);
	}, { verifyAfter: params.verifyAfter });
}
function guardedRenameSync(params) {
	withSyncDirectoryGuards([createSyncDirectoryGuard(path.dirname(params.from)), params.targetRoot ? createNearestExistingSyncDirectoryGuard(params.targetRoot, path.dirname(params.to)) : createSyncDirectoryGuard(path.dirname(params.to))], () => fs.renameSync(params.from, params.to), { verifyAfter: params.verifyAfter });
}
async function guardedRm(params) {
	await withAsyncDirectoryGuards([await createAsyncDirectoryGuard(path.dirname(params.target))], async () => {
		await fs$1.rm(params.target, {
			...params.recursive !== void 0 ? { recursive: params.recursive } : {},
			...params.force !== void 0 ? { force: params.force } : {}
		});
	}, { verifyAfter: params.verifyAfter });
}
function guardedRmSync(params) {
	withSyncDirectoryGuards([createSyncDirectoryGuard(path.dirname(params.target))], () => fs.rmSync(params.target, {
		...params.recursive !== void 0 ? { recursive: params.recursive } : {},
		...params.force !== void 0 ? { force: params.force } : {}
	}), { verifyAfter: params.verifyAfter });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/native-pinned-write.js
function assertWithinMaxBytes$1(bytes, maxBytes) {
	if (maxBytes !== void 0 && bytes > maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${bytes})`);
}
async function writeNativeInput(fd, input, maxBytes) {
	if (input.kind === "buffer") {
		const data = typeof input.data === "string" ? Buffer.from(input.data, input.encoding ?? "utf8") : Buffer.from(input.data);
		assertWithinMaxBytes$1(data.byteLength, maxBytes);
		writeNativeFd(fd, data);
		return;
	}
	let bytes = 0;
	for await (const chunk of input.stream) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.byteLength;
		assertWithinMaxBytes$1(bytes, maxBytes);
		writeNativeFd(fd, buffer);
	}
}
function nativeOpenFlags(flags) {
	return flags | (fs.constants.O_CLOEXEC ?? 0) | (typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0);
}
function sameNativeIdentity(left, right) {
	return left.dev === right.dev && left.ino === right.ino;
}
async function runPinnedWriteNative(binding, params) {
	const root = await fs$1.open(params.rootPath, fs.constants.O_RDONLY | (typeof fs.constants.O_DIRECTORY === "number" ? fs.constants.O_DIRECTORY : 0));
	let parentFd;
	let tempFd;
	let targetFd;
	let tempIdentity;
	let parentPath = params.rootPath;
	const tempName = `.${params.basename}.${randomUUID()}.native.tmp`;
	let renamed = false;
	try {
		const rootIdentity = binding.fstatIdentity(root.fd);
		if (params.rootIdentity && !sameNativeIdentity(params.rootIdentity, rootIdentity)) throw new FsSafeError("path-mismatch", "root path changed during native write");
		if (params.mkdir) binding.mkdirBeneath(root.fd, params.relativeParentPath, 511);
		const parentFlags = fs.constants.O_RDONLY | (typeof fs.constants.O_DIRECTORY === "number" ? fs.constants.O_DIRECTORY : 0);
		parentFd = binding.openBeneath(root.fd, params.relativeParentPath, parentFlags).fd;
		parentPath = await fs$1.realpath(params.relativeParentPath ? path.join(params.rootPath, ...params.relativeParentPath.split("/")) : params.rootPath);
		const parentPathStat = await fs$1.lstat(parentPath);
		const parentIdentity = binding.fstatIdentity(parentFd);
		if (parentPathStat.isSymbolicLink() || !sameNativeIdentity(parentPathStat, parentIdentity)) throw new FsSafeError("path-mismatch", "native write parent changed during resolution");
		if (params.overwrite === false) try {
			await fs$1.lstat(path.join(parentPath, params.basename));
			throw Object.assign(/* @__PURE__ */ new Error("destination already exists"), { code: "EEXIST" });
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
		tempFd = binding.openBeneath(parentFd, tempName, nativeOpenFlags(fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL)).fd;
		tempIdentity = fs.fstatSync(tempFd);
		fs.fchmodSync(tempFd, 384);
		await writeNativeInput(tempFd, params.input, params.maxBytes);
		syncNativeFileBestEffort(tempFd);
		if (params.overwrite === false) binding.renameNoReplace(parentFd, tempName, parentFd, params.basename);
		else binding.renameReplace(parentFd, tempName, parentFd, params.basename);
		renamed = true;
		targetFd = binding.openBeneath(parentFd, params.basename, nativeOpenFlags(fs.constants.O_RDONLY)).fd;
		const targetIdentity = binding.fstatIdentity(targetFd);
		if (!targetIdentity.isFile || !sameNativeIdentity(tempIdentity, targetIdentity)) throw new FsSafeError("path-mismatch", "native write target changed after rename");
		try {
			fs.fchmodSync(targetFd, params.mode);
			syncNativeFileBestEffort(targetFd);
		} catch (error) {
			fs.closeSync(targetFd);
			targetFd = void 0;
			removeNativeCreatedFileIfStillPinned({
				binding,
				parentPath,
				parentFd,
				basename: params.basename,
				created: tempIdentity
			});
			throw error;
		}
		syncNativeFileBestEffort(parentFd);
		return {
			dev: targetIdentity.dev,
			ino: targetIdentity.ino
		};
	} finally {
		if (targetFd !== void 0) fs.closeSync(targetFd);
		if (tempFd !== void 0) fs.closeSync(tempFd);
		if (!renamed && parentFd !== void 0) removeNativeCreatedFileIfStillPinned({
			binding,
			parentPath,
			parentFd,
			basename: tempName,
			created: tempIdentity
		});
		if (parentFd !== void 0) fs.closeSync(parentFd);
		await root.close().catch(() => void 0);
	}
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/pinned-operation.js
function validatePinnedOperationPayload(payload) {
	if (typeof payload.relativePath === "string") validatePinnedRelativePath(payload.relativePath);
	if (typeof payload.relativeParentPath === "string") validatePinnedRelativePath(payload.relativeParentPath);
	if (typeof payload.from === "string") validatePinnedRelativePath(payload.from);
	if (typeof payload.to === "string") validatePinnedRelativePath(payload.to);
}
function validatePinnedRelativePath(relativePath) {
	if (relativePath.length === 0 || relativePath === ".") return;
	if (relativePath.includes("\0")) throw new FsSafeError("invalid-path", "relative path contains a NUL byte");
	if (relativePath.startsWith("/") || relativePath.startsWith("//") || relativePath === ".." || relativePath.startsWith("../") || relativePath.startsWith("..\\")) throw new FsSafeError("invalid-path", "relative path must not escape root");
	for (const segment of relativePath.split("/")) if (segment === "..") throw new FsSafeError("invalid-path", "relative path must not contain '..'");
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/pinned-write.js
function byteLength(input, encoding) {
	return typeof input === "string" ? Buffer.byteLength(input, encoding ?? "utf8") : input.byteLength;
}
function assertSafeBasename(basename) {
	if (!basename || basename === "." || basename === ".." || basename.includes("/") || basename.includes("\0")) throw new FsSafeError("invalid-path", "invalid target path");
}
function assertWithinMaxBytes(bytes, maxBytes) {
	if (maxBytes !== void 0 && bytes > maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${bytes})`);
}
async function syncFileBestEffort(handle) {
	try {
		await handle.sync();
	} catch (error) {
		if (error?.code !== "EPERM") throw error;
	}
}
async function writeStreamToHandle(stream, handle, maxBytes) {
	let bytes = 0;
	for await (const chunk of stream) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.byteLength;
		assertWithinMaxBytes(bytes, maxBytes);
		let offset = 0;
		while (offset < buffer.byteLength) {
			const { bytesWritten } = await handle.write(buffer, offset, buffer.byteLength - offset);
			if (bytesWritten <= 0) throw new FsSafeError("helper-failed", "fallback stream write made no progress");
			offset += bytesWritten;
		}
	}
}
async function runPinnedWriteHelper(params) {
	assertSafeBasename(params.basename);
	validatePinnedOperationPayload({ relativeParentPath: params.relativeParentPath });
	if (params.onRenameIdentityMismatch === "verify-content") return await runPinnedWriteFallback(params);
	const native = getNativeBinding();
	if (native) return await runPinnedWriteNative(native, params);
	return await runPinnedWriteFallback(params);
}
async function runPinnedWriteWithRenamePolicy(params) {
	const { targetPath, renameIdentity, ...writeParams } = params;
	if (renameIdentity !== "verify-content-with-lock") return await runPinnedWriteHelper(writeParams);
	const relativeTargetPath = writeParams.relativeParentPath ? `${writeParams.relativeParentPath}/${writeParams.basename}` : writeParams.basename;
	const lockPath = path.join(writeParams.rootPath, `.fs-safe-write-${sha256Hex(relativeTargetPath)}.lock`);
	return await withSidecarLock(writeParams.rootPath, {
		managerKey: `fs-safe.write:${targetPath}`,
		lockPath,
		staleMs: 3e4,
		timeoutMs: 5e3,
		payload: () => ({
			pid: process.pid,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}),
		retry: {
			retries: 5,
			minTimeout: 100,
			maxTimeout: 2e3,
			factor: 2
		}
	}, async () => await runPinnedWriteHelper({
		...writeParams,
		onRenameIdentityMismatch: "verify-content"
	}));
}
async function runPinnedWriteFallback(params) {
	let parentPath = params.relativeParentPath ? path.join(params.rootPath, ...params.relativeParentPath.split("/")) : params.rootPath;
	if (params.mkdir) parentPath = await mkdirPathComponentsWithGuards({
		rootReal: params.rootPath,
		targetPath: parentPath,
		beforeComponent: async (componentPath) => await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", componentPath)
	});
	const parentGuard = params.mkdir ? await createAsyncDirectoryGuard(parentPath) : await createNearestExistingDirectoryGuard(params.rootPath, parentPath);
	const targetPath = path.join(parentPath, params.basename);
	if (params.overwrite === false) {
		let handle = await withAsyncDirectoryGuards([parentGuard], async () => await fs$1.open(targetPath, fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL, params.mode), { onPostGuardFailure: async (openedHandle) => {
			await openedHandle.close().catch(() => void 0);
		} });
		let created = true;
		try {
			await handle.chmod(params.mode);
			if (params.input.kind === "buffer") {
				assertWithinMaxBytes(byteLength(params.input.data, params.input.encoding), params.maxBytes);
				if (typeof params.input.data === "string") await handle.writeFile(params.input.data, params.input.encoding ?? "utf8");
				else await handle.writeFile(params.input.data);
			} else await writeStreamToHandle(params.input.stream, handle, params.maxBytes);
			await syncFileBestEffort(handle);
			const stat = await handle.stat();
			await handle.close().catch(() => void 0);
			await syncDirectoryBestEffort(parentPath);
			created = false;
			return {
				dev: stat.dev,
				ino: stat.ino
			};
		} finally {
			await handle.close().catch(() => void 0);
			if (created) await fs$1.rm(targetPath, { force: true }).catch(() => void 0);
		}
	}
	const tempPath = path.join(parentPath, `.${params.basename}.${randomUUID()}.fallback.tmp`);
	const tempFlags = fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | (process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0);
	let handle;
	let tempStat;
	let targetStat;
	let renamed = false;
	try {
		handle = await fs$1.open(tempPath, tempFlags, params.mode);
		await handle.chmod(params.mode);
		if (params.input.kind === "buffer") {
			assertWithinMaxBytes(byteLength(params.input.data, params.input.encoding), params.maxBytes);
			if (typeof params.input.data === "string") await handle.writeFile(params.input.data, params.input.encoding ?? "utf8");
			else await handle.writeFile(params.input.data);
		} else await writeStreamToHandle(params.input.stream, handle, params.maxBytes);
		tempStat = await handle.stat();
		const tempPathStat = await fs$1.lstat(tempPath);
		if (tempPathStat.isSymbolicLink() || !sameFileIdentity(tempPathStat, tempStat)) throw new FsSafeError("path-mismatch", "fallback temp path changed during write");
		const expectedTempStat = tempStat;
		await syncFileBestEffort(handle);
		await handle.close().catch(() => void 0);
		handle = void 0;
		await withAsyncDirectoryGuards([parentGuard], async () => {
			await fs$1.rename(tempPath, targetPath);
			renamed = true;
			await getFsSafeTestHooks()?.afterPinnedWriteFallbackRename?.(targetPath);
			await syncDirectoryBestEffort(parentPath);
			targetStat = await fs$1.lstat(targetPath);
			if (targetStat.isSymbolicLink()) throw new FsSafeError("path-mismatch", "fallback target changed during write");
			if (!sameFileIdentity(targetStat, expectedTempStat)) {
				if (params.onRenameIdentityMismatch !== "verify-content") throw new FsSafeError("path-mismatch", "fallback target changed during write");
				if (params.input.kind !== "buffer") throw new FsSafeError("path-mismatch", "fallback target changed during write");
				const expectedHash = sha256Hex(params.input.data, params.input.encoding);
				const readFlags = fs.constants.O_RDONLY | (process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0);
				const readHandle = await fs$1.open(targetPath, readFlags);
				let actualHash;
				let readHandleStat;
				try {
					readHandleStat = await readHandle.stat();
					actualHash = sha256Hex(await readHandle.readFile());
				} finally {
					await readHandle.close().catch(() => void 0);
				}
				if (actualHash !== expectedHash) throw new FsSafeError("path-mismatch", "fallback target changed during write");
				targetStat = readHandleStat;
			}
		});
	} catch (error) {
		await handle?.close().catch(() => void 0);
		if (!renamed) await fs$1.rm(tempPath, { force: true }).catch(() => void 0);
		throw error;
	}
	if (!targetStat) throw new FsSafeError("path-mismatch", "fallback target was not verified");
	return {
		dev: targetStat.dev,
		ino: targetStat.ino
	};
}
//#endregion
export { resolveUserPath as _, guardedRenameSync as a, withAsyncDirectoryGuards as c, pinDirectory as d, syncDirectory as f, resolveHomeRelativePath as g, expandHomePrefix as h, guardedRename as i, mkdirPathComponentsWithGuards as l, syncDirectoryBestEffortSync as m, runPinnedWriteWithRenamePolicy as n, guardedRm as o, syncDirectoryBestEffort as p, validatePinnedOperationPayload as r, guardedRmSync as s, runPinnedWriteHelper as t, ensureDurableDirectory as u };
