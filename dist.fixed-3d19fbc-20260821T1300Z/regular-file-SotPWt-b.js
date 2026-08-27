import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { n as readFileDescriptorBoundedSync, r as readFileHandleBounded } from "./bounded-read-W_MSGG4q.js";
import { r as assertNoUnsafeDeviceReadPath, t as resolveReadOpenFlags } from "./read-open-flags-YbtjZqyj.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import { i as isNotFoundPathError, n as hasNodeErrorCode, s as isPathRelativeEscape } from "./path-CYL8StfC.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/symlink-parents.js
function resolvePathWalk(params) {
	const root = path.resolve(params.rootDir);
	const target = path.resolve(params.targetPath);
	const relative = path.relative(root, target);
	if (isPathRelativeEscape(relative)) {
		if (params.allowOutsideRoot) return null;
		throw new Error(`${params.messagePrefix ?? "Path"} must stay under ${root}.`);
	}
	return {
		root,
		segments: relative && relative !== "." ? relative.split(path.sep).filter(Boolean) : []
	};
}
function formatUnsafePath(params, current) {
	return `${params.messagePrefix ?? "Path"} must not traverse symlinked directory: ${current}`;
}
async function assertNoSymlinkParents(params) {
	const walk = resolvePathWalk(params);
	if (!walk) return;
	let current = walk.root;
	for (const [index, segment] of walk.segments.entries()) {
		current = path.join(current, segment);
		try {
			const stat = await fs$1.lstat(current);
			if (stat.isSymbolicLink()) {
				if (params.allowRootChildSymlink && path.dirname(current) === walk.root) continue;
				throw new Error(formatUnsafePath(params, current));
			}
			if ((params.requireDirectories || index < walk.segments.length - 1) && !stat.isDirectory()) throw new FsSafeError("not-file", `${params.messagePrefix ?? "Path"} must traverse directories: ${current}`);
		} catch (err) {
			if (hasNodeErrorCode(err, "ENOENT") && params.allowMissing !== false) return;
			throw err;
		}
	}
}
function assertNoSymlinkParentsSync(params) {
	const walk = resolvePathWalk(params);
	if (!walk) return;
	let current = walk.root;
	for (const [index, segment] of walk.segments.entries()) {
		current = path.join(current, segment);
		try {
			const stat = fs.lstatSync(current);
			if (stat.isSymbolicLink()) {
				if (params.allowRootChildSymlink && path.dirname(current) === walk.root) continue;
				throw new Error(formatUnsafePath(params, current));
			}
			if ((params.requireDirectories || index < walk.segments.length - 1) && !stat.isDirectory()) throw new FsSafeError("not-file", `${params.messagePrefix ?? "Path"} must traverse directories: ${current}`);
		} catch (err) {
			if (err.code === "ENOENT" && params.allowMissing !== false) return;
			throw err;
		}
	}
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/regular-file.js
function resolveRegularFileAppendFlags(constants = fs.constants) {
	const noFollow = constants.O_NOFOLLOW;
	return constants.O_CREAT | constants.O_APPEND | constants.O_WRONLY | (typeof noFollow === "number" ? noFollow : 0);
}
function regularFileTooLargeError(filePath, maxBytes, cause) {
	return new FsSafeError("too-large", `File exceeds ${maxBytes} bytes: ${filePath}`, { cause });
}
function translateBoundedReadOverflow(error, filePath, maxBytes) {
	if (error instanceof FsSafeError && error.code === "too-large") throw regularFileTooLargeError(filePath, maxBytes, error);
	throw error;
}
async function statRegularFile(filePath) {
	let stat;
	try {
		stat = await fs$1.lstat(filePath);
	} catch (err) {
		if (isNotFoundPathError(err)) return { missing: true };
		throw err;
	}
	if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("path must be a regular file");
	return {
		missing: false,
		stat
	};
}
function statRegularFileSync(filePath) {
	let stat;
	try {
		stat = fs.lstatSync(filePath);
	} catch (err) {
		if (isNotFoundPathError(err)) return { missing: true };
		throw err;
	}
	if (stat.isSymbolicLink() || !stat.isFile()) throw new Error("path must be a regular file");
	return {
		missing: false,
		stat
	};
}
async function readRegularFile(params) {
	assertNoUnsafeDeviceReadPath(params.filePath);
	const result = await statRegularFile(params.filePath);
	if (result.missing) throw Object.assign(/* @__PURE__ */ new Error(`File not found: ${params.filePath}`), { code: "ENOENT" });
	if (params.maxBytes !== void 0 && result.stat.size > params.maxBytes) throw regularFileTooLargeError(params.filePath, params.maxBytes);
	let handle;
	try {
		handle = await fs$1.open(params.filePath, resolveReadOpenFlags());
	} catch (err) {
		if (isNotFoundPathError(err)) throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
		throw err;
	}
	try {
		const stat = await handle.stat();
		let pathStat;
		try {
			pathStat = await fs$1.lstat(params.filePath);
		} catch (err) {
			if (isNotFoundPathError(err)) throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
			throw err;
		}
		verifyStableReadTarget({
			filePath: params.filePath,
			pathStat,
			postOpenStat: stat,
			preOpenStat: result.stat
		});
		if (params.maxBytes !== void 0 && stat.size > params.maxBytes) throw regularFileTooLargeError(params.filePath, params.maxBytes);
		let buffer;
		try {
			buffer = params.maxBytes === void 0 ? await handle.readFile() : await readFileHandleBounded(handle, params.maxBytes);
		} catch (error) {
			if (params.maxBytes !== void 0) translateBoundedReadOverflow(error, params.filePath, params.maxBytes);
			throw error;
		}
		return {
			buffer,
			stat
		};
	} finally {
		await handle.close();
	}
}
function verifyStableReadTarget(params) {
	if (!params.postOpenStat.isFile() || params.pathStat.isSymbolicLink() || !params.pathStat.isFile()) throw new Error(`File is not a regular file: ${params.filePath}`);
	if (!sameFileIdentity(params.preOpenStat, params.postOpenStat) || !sameFileIdentity(params.pathStat, params.postOpenStat)) throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
}
function readOpenedRegularFileSync(params) {
	const stat = fs.fstatSync(params.fd);
	let pathStat;
	try {
		pathStat = fs.lstatSync(params.filePath);
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
		throw error;
	}
	verifyStableReadTarget({
		filePath: params.filePath,
		pathStat,
		postOpenStat: stat,
		preOpenStat: params.preOpenStat
	});
	if (params.maxBytes !== void 0 && stat.size > params.maxBytes) throw regularFileTooLargeError(params.filePath, params.maxBytes);
	let buffer;
	try {
		buffer = params.maxBytes === void 0 ? fs.readFileSync(params.fd) : readFileDescriptorBoundedSync(params.fd, params.maxBytes);
	} catch (error) {
		if (params.maxBytes !== void 0) translateBoundedReadOverflow(error, params.filePath, params.maxBytes);
		throw error;
	}
	return {
		buffer,
		stat
	};
}
function readRegularFileSync(params) {
	assertNoUnsafeDeviceReadPath(params.filePath);
	const result = statRegularFileSync(params.filePath);
	if (result.missing) throw Object.assign(/* @__PURE__ */ new Error(`File not found: ${params.filePath}`), { code: "ENOENT" });
	if (params.maxBytes !== void 0 && result.stat.size > params.maxBytes) throw regularFileTooLargeError(params.filePath, params.maxBytes);
	let fd;
	try {
		fd = fs.openSync(params.filePath, resolveReadOpenFlags());
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("path-mismatch", `File changed during read: ${params.filePath}`);
		throw error;
	}
	try {
		return readOpenedRegularFileSync({
			fd,
			filePath: params.filePath,
			preOpenStat: result.stat,
			maxBytes: params.maxBytes
		});
	} finally {
		fs.closeSync(fd);
	}
}
function verifyStableAppendTarget(params) {
	if (!params.postOpenStat.isFile()) throw new Error(`Refusing to append to non-file: ${params.filePath}`);
	if (params.postOpenStat.nlink > 1) throw new Error(`Refusing to append to hardlinked file: ${params.filePath}`);
	const pre = params.preOpenStat;
	if (pre && (pre.dev !== params.postOpenStat.dev || pre.ino !== params.postOpenStat.ino)) throw new Error(`Refusing to append after file changed: ${params.filePath}`);
}
async function appendRegularFile(options) {
	if (options.rejectSymlinkParents === true) {
		const resolvedDir = path.resolve(path.dirname(options.filePath));
		await assertNoSymlinkParents({
			rootDir: path.parse(resolvedDir).root,
			targetPath: resolvedDir,
			allowMissing: false,
			allowRootChildSymlink: true,
			requireDirectories: true,
			messagePrefix: "Refusing to append under"
		});
	}
	let preOpenStat;
	try {
		const stat = await fs$1.lstat(options.filePath);
		if (stat.isSymbolicLink()) throw new Error(`Refusing to append through symlink: ${options.filePath}`);
		if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${options.filePath}`);
		preOpenStat = stat;
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
	}
	const contentBytes = Buffer.isBuffer(options.content) ? options.content.byteLength : Buffer.byteLength(options.content, options.encoding ?? "utf8");
	if (options.maxFileBytes !== void 0 && (preOpenStat?.size ?? 0) + contentBytes > options.maxFileBytes) return;
	const handle = await fs$1.open(options.filePath, resolveRegularFileAppendFlags(), options.mode ?? 384);
	try {
		const stat = await handle.stat();
		verifyStableAppendTarget({
			preOpenStat,
			postOpenStat: stat,
			filePath: options.filePath
		});
		if (options.maxFileBytes !== void 0 && stat.size + contentBytes > options.maxFileBytes) return;
		await handle.chmod(options.mode ?? 384);
		await handle.appendFile(options.content, options.encoding ?? "utf8");
	} finally {
		await handle.close();
	}
}
function appendRegularFileSync(options) {
	if (options.rejectSymlinkParents === true) {
		const resolvedDir = path.resolve(path.dirname(options.filePath));
		assertNoSymlinkParentsSync({
			rootDir: path.parse(resolvedDir).root,
			targetPath: resolvedDir,
			allowMissing: false,
			allowRootChildSymlink: true,
			requireDirectories: true,
			messagePrefix: "Refusing to append under"
		});
	}
	let preOpenStat;
	try {
		const stat = fs.lstatSync(options.filePath);
		if (stat.isSymbolicLink()) throw new Error(`Refusing to append through symlink: ${options.filePath}`);
		if (!stat.isFile()) throw new Error(`Refusing to append to non-file: ${options.filePath}`);
		preOpenStat = stat;
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
	}
	const contentBuffer = typeof options.content === "string" ? Buffer.from(options.content, options.encoding ?? "utf8") : Buffer.from(options.content);
	if (options.maxFileBytes !== void 0 && (preOpenStat?.size ?? 0) + contentBuffer.byteLength > options.maxFileBytes) return;
	const fd = fs.openSync(options.filePath, resolveRegularFileAppendFlags(), options.mode ?? 384);
	try {
		const stat = fs.fstatSync(fd);
		verifyStableAppendTarget({
			preOpenStat,
			postOpenStat: stat,
			filePath: options.filePath
		});
		if (options.maxFileBytes !== void 0 && stat.size + contentBuffer.byteLength > options.maxFileBytes) return;
		fs.fchmodSync(fd, options.mode ?? 384);
		fs.writeSync(fd, contentBuffer, 0, contentBuffer.byteLength);
	} finally {
		fs.closeSync(fd);
	}
}
//#endregion
export { resolveRegularFileAppendFlags as a, assertNoSymlinkParents as c, readRegularFileSync as i, assertNoSymlinkParentsSync as l, appendRegularFileSync as n, statRegularFile as o, readRegularFile as r, statRegularFileSync as s, appendRegularFile as t };
