import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as readFileHandleBounded } from "./bounded-read-pTKvsUkY.js";
import { r as assertNoUnsafeDeviceReadPath, t as resolveReadOpenFlags } from "./read-open-flags-DGgM-BoE.js";
import { n as sameFileIdentityForCleanup, t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import { i as isDriveRelativePath } from "./safe-path-segment-UYsB1OSq.js";
import { a as isPathInside, c as isSymlinkOpenError, i as isNotFoundPathError, n as hasNodeErrorCode, t as assertNoNulPathInput } from "./path-D138yf8v.js";
import { C as outsideWorkspaceError, S as normalizeRemovePathError, _ as hardlinkedPathNotAllowedError, b as normalizePinnedWriteError, d as createAsyncDirectoryGuard, f as createNearestExistingDirectoryGuard, g as fileNotFoundError, l as assertAsyncDirectoryGuard, v as isAlreadyExistsError, x as normalizeRemoveGuardError, y as normalizePinnedPathError } from "./absolute-path-CYFPfAjt.js";
import { c as withAsyncDirectoryGuards, h as expandHomePrefix, l as mkdirPathComponentsWithGuards, n as runPinnedWriteWithRenamePolicy, p as syncDirectoryBestEffort, r as validatePinnedOperationPayload, t as runPinnedWriteHelper } from "./pinned-write-powa_mtU.js";
import { t as resolvePathViaExistingAncestor } from "./root-path-existing-CLr-7fqF.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import { u as getFsSafeTestHooks } from "./sidecar-lock-ChVk6eKw.js";
import { i as shortPath, n as resolveRootPath, t as ROOT_PATH_ALIAS_POLICIES } from "./root-path-CsUfUJ7P.js";
import { t as registerTempPathForExit } from "./temp-cleanup-AnQDWpEQ.js";
import { t as serializePathWrite } from "./write-queue-D0YrgvFe.js";
import { constants } from "node:fs";
import os from "node:os";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/deny-mutations.js
async function resolveMutationComparablePaths(rawPath) {
	assertNoNulPathInput(rawPath, "path contains a NUL byte");
	const resolved = path.resolve(rawPath);
	return /* @__PURE__ */ new Set([resolved, await resolvePathViaExistingAncestor(resolved)]);
}
function isSamePath(left, right) {
	return isPathInside(left, right) && isPathInside(right, left);
}
function hasPolicyEntries(policy) {
	return Boolean(policy?.paths?.length || policy?.prefixes?.length);
}
function policyPathEntries(entries) {
	const paths = [];
	for (const entry of entries ?? []) {
		if (entry.length === 0) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty");
		assertNoNulPathInput(entry, "deny mutation path contains a NUL byte");
		if (!path.isAbsolute(entry)) throw new FsSafeError("invalid-path", "deny mutation paths must be absolute");
		paths.push(entry);
	}
	return paths;
}
async function assertMutationNotDenied(filePath, policy, options = {}) {
	if (!hasPolicyEntries(policy)) return;
	const targetPaths = await resolveMutationComparablePaths(filePath);
	for (const deniedPath of policyPathEntries(policy.paths)) {
		const deniedPaths = await resolveMutationComparablePaths(deniedPath);
		for (const target of targetPaths) for (const denied of deniedPaths) if (isSamePath(denied, target) || options.protectAncestors === true && isPathInside(target, denied)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
	for (const deniedPrefix of policyPathEntries(policy.prefixes)) {
		const deniedPaths = await resolveMutationComparablePaths(deniedPrefix);
		for (const target of targetPaths) for (const denied of deniedPaths) if (isPathInside(denied, target) || options.protectAncestors === true && isPathInside(target, denied)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
}
function mergeDenyMutationPolicies(defaultPolicy, callPolicy) {
	if (!defaultPolicy) return callPolicy;
	if (!callPolicy) return defaultPolicy;
	return {
		paths: [...defaultPolicy.paths ?? [], ...callPolicy.paths ?? []],
		prefixes: [...defaultPolicy.prefixes ?? [], ...callPolicy.prefixes ?? []]
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/opened-realpath.js
async function resolveOpenedFileRealPathForHandle(handle, ioPath) {
	const handleStat = await handle.stat();
	const fdCandidates = process.platform === "linux" ? [`/proc/self/fd/${handle.fd}`, `/dev/fd/${handle.fd}`] : process.platform === "win32" ? [] : [`/dev/fd/${handle.fd}`];
	for (const fdPath of fdCandidates) try {
		const fdRealPath = await fs$1.realpath(fdPath);
		if (sameFileIdentity(handleStat, await fs$1.stat(fdRealPath))) return fdRealPath;
	} catch {}
	try {
		const ioRealPath = await fs$1.realpath(ioPath);
		if (sameFileIdentity(handleStat, await fs$1.stat(ioRealPath))) return ioRealPath;
	} catch (err) {
		if (!isNotFoundPathError(err)) throw err;
	}
	const parentResolved = await resolveOpenedFileRealPathFromParent(handleStat, ioPath);
	if (parentResolved) return parentResolved;
	throw new FsSafeError("path-mismatch", "unable to resolve opened file path");
}
async function resolveOpenedFileRealPathFromParent(handleStat, ioPath) {
	let parentReal;
	try {
		parentReal = await fs$1.realpath(path.dirname(ioPath));
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	let entries;
	try {
		entries = await fs$1.readdir(parentReal);
	} catch (err) {
		if (isNotFoundPathError(err)) return null;
		throw err;
	}
	for (const entry of entries.toSorted()) {
		const candidatePath = path.join(parentReal, entry);
		try {
			const candidateStat = await fs$1.lstat(candidatePath);
			if (candidateStat.isFile() && sameFileIdentity(handleStat, candidateStat)) return await fs$1.realpath(candidatePath);
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
	}
	return null;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path-policy.js
const PATH_ALIAS_POLICIES = ROOT_PATH_ALIAS_POLICIES;
async function assertNoPathAliasEscape(params) {
	const resolved = await resolveRootPath({
		absolutePath: params.absolutePath,
		rootPath: params.rootPath,
		boundaryLabel: params.boundaryLabel,
		policy: params.policy
	});
	if (params.policy?.allowFinalSymlinkForUnlink === true && resolved.kind === "symlink") return;
	await assertNoHardlinkedFinalPath({
		filePath: resolved.canonicalPath,
		root: resolved.rootPath,
		boundaryLabel: params.boundaryLabel,
		allowFinalHardlinkForUnlink: params.policy?.allowFinalHardlinkForUnlink
	});
}
async function assertNoHardlinkedFinalPath(params) {
	if (params.allowFinalHardlinkForUnlink) return;
	let stat;
	try {
		stat = await fs$1.stat(params.filePath);
	} catch (err) {
		if (isNotFoundPathError(err)) return;
		throw err;
	}
	if (!stat.isFile()) return;
	if (stat.nlink > 1) throw new Error(`Hardlinked path is not allowed under ${params.boundaryLabel} (${shortPath(params.root)}): ${shortPath(params.filePath)}`);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/read-opened-file.js
async function readOpenedFileSafely(params) {
	if (params.maxBytes !== void 0 && params.opened.stat.size > params.maxBytes) throw new FsSafeError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${params.opened.stat.size})`);
	return {
		buffer: params.maxBytes === void 0 ? await params.opened.handle.readFile() : await readFileHandleBounded(params.opened.handle, params.maxBytes),
		containment: params.opened.containment,
		realPath: params.opened.realPath,
		stat: params.opened.stat
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-context.js
const ensureTrailingSep = (value) => value.endsWith(path.sep) ? value : value + path.sep;
function assertValidRootRelativePath(relativePath) {
	assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
}
function assertValidRootDestinationPath(relativePath) {
	assertValidRootRelativePath(relativePath);
	if (isDriveRelativePath(relativePath)) throw new FsSafeError("invalid-path", "relative path must not start with a drive letter");
}
let cachedHomePath;
async function expandRelativePathWithHome(relativePath) {
	const rawHome = process.env.HOME || process.env.USERPROFILE || os.homedir();
	if (cachedHomePath?.raw !== rawHome) {
		let realHome = rawHome;
		try {
			realHome = await fs$1.realpath(rawHome);
		} catch {}
		cachedHomePath = {
			raw: rawHome,
			real: realHome
		};
	}
	return expandHomePrefix(relativePath, { home: cachedHomePath.real });
}
async function resolveRootContext(rootDir) {
	assertNoNulPathInput(rootDir, "root dir contains a NUL byte");
	let rootReal;
	let rootIdentity;
	try {
		rootReal = await fs$1.realpath(rootDir);
		const rootStat = await fs$1.stat(rootReal);
		if (!rootStat.isDirectory()) throw new FsSafeError("invalid-path", "root dir is not a directory");
		rootIdentity = {
			dev: rootStat.dev,
			ino: rootStat.ino
		};
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "root dir not found");
		throw err;
	}
	return {
		rootDir: path.resolve(rootDir),
		rootIdentity,
		rootReal,
		rootWithSep: ensureTrailingSep(rootReal)
	};
}
async function assertRootIdentityCurrent(root) {
	let current;
	try {
		current = await fs$1.lstat(root.rootReal);
	} catch (error) {
		throw new FsSafeError("path-mismatch", "root path changed during operation", { cause: error instanceof Error ? error : void 0 });
	}
	if (current.isSymbolicLink() || !current.isDirectory() || !sameFileIdentity(current, root.rootIdentity)) throw new FsSafeError("path-mismatch", "root path changed during operation");
}
async function resolvePathInRoot(root, relativePath, options) {
	assertValidRootRelativePath(relativePath);
	await assertRootIdentityCurrent(root);
	const expanded = await expandRelativePathWithHome(relativePath);
	const resolved = path.resolve(root.rootWithSep, expanded);
	if (!isPathInside(root.rootWithSep, resolved)) throw outsideWorkspaceError();
	if (options?.rejectUnsafeDeviceReads === true) assertNoUnsafeDeviceReadPath(resolved);
	const rawAbsolutePath = path.isAbsolute(expanded) ? expanded : `${root.rootWithSep}${expanded}`;
	try {
		await resolveRootPath({
			absolutePath: rawAbsolutePath,
			rootPath: root.rootReal,
			rootCanonicalPath: root.rootReal,
			boundaryLabel: "root",
			policy: options?.allowFinalSymlink ? ROOT_PATH_ALIAS_POLICIES.unlinkTarget : void 0,
			rejectSymlinks: options?.rejectSymlinks
		});
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") throw error;
		if (hasNodeErrorCode(error, "ENAMETOOLONG")) throw new FsSafeError("invalid-path", "relative path is too long", { cause: error instanceof Error ? error : void 0 });
		const code = options?.aliasErrorCode ?? "outside-workspace";
		throw new FsSafeError(code, code === "path-alias" ? "path alias escape blocked" : "file is outside workspace root", { cause: error instanceof Error ? error : void 0 });
	}
	return {
		rootReal: root.rootReal,
		rootWithSep: root.rootWithSep,
		resolved
	};
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/json-stringify.js
function stringifyJsonDocument(value, replacer, space) {
	const text = JSON.stringify(value, replacer, space);
	if (typeof text !== "string") throw new TypeError("value is not representable as a JSON document");
	return text;
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-walk.js
function validateBudget(name, value) {
	if (value === void 0) return Number.POSITIVE_INFINITY;
	if (!Number.isSafeInteger(value) || value < 0) throw new RangeError(`${name} must be a non-negative safe integer`);
	return value;
}
function entryKind(entry) {
	if (entry.isSymbolicLink) return "symlink";
	if (entry.isDirectory) return "directory";
	if (entry.isFile) return "file";
	return "other";
}
function limitEntry(relativePath) {
	return {
		relativePath,
		kind: "truncated",
		size: 0
	};
}
async function* walkRoot(root, relativePath, options) {
	if (!["skip", "follow-within-root"].includes(options.symlinkPolicy)) throw new TypeError(`invalid root walk symlink policy: ${String(options.symlinkPolicy)}`);
	if (options.limitBehavior !== void 0 && !["truncate", "throw"].includes(options.limitBehavior)) throw new TypeError(`invalid root walk limit behavior: ${String(options.limitBehavior)}`);
	if (options.onDirectoryError !== void 0 && !["throw", "skip-and-report"].includes(options.onDirectoryError)) throw new TypeError(`invalid root walk directory error behavior: ${String(options.onDirectoryError)}`);
	const maxDepth = validateBudget("maxDepth", options.maxDepth);
	const maxEntries = validateBudget("maxEntries", options.maxEntries);
	const visitedDirectories = /* @__PURE__ */ new Set();
	let examined = 0;
	const onLimit = (atPath) => {
		if ((options.limitBehavior ?? "truncate") === "throw") throw new FsSafeError("too-large", `root walk budget exceeded at ${atPath || "."}`);
		return limitEntry(atPath);
	};
	async function* visit(directory, depth) {
		options.signal?.throwIfAborted();
		let entries;
		try {
			const resolvedDirectory = await resolveRootPath({
				absolutePath: path.resolve(root.rootReal, directory),
				rootPath: root.rootReal,
				rootCanonicalPath: root.rootReal,
				boundaryLabel: "root walk"
			});
			if (!resolvedDirectory.exists || resolvedDirectory.kind !== "directory") throw new FsSafeError("not-file", `root walk path is not a directory: ${directory || "."}`);
			if (visitedDirectories.has(resolvedDirectory.canonicalPath)) return;
			visitedDirectories.add(resolvedDirectory.canonicalPath);
			options.signal?.throwIfAborted();
			const listingDirectory = path.relative(root.rootReal, resolvedDirectory.canonicalPath).split(path.sep).join(path.posix.sep);
			entries = await root.list(listingDirectory, { withFileTypes: true });
		} catch (error) {
			options.signal?.throwIfAborted();
			if ((options.onDirectoryError ?? "throw") === "throw") throw error;
			yield {
				relativePath: directory,
				kind: "directory-error",
				size: 0,
				error
			};
			return;
		}
		options.signal?.throwIfAborted();
		for (const entry of entries) {
			options.signal?.throwIfAborted();
			const child = directory ? path.posix.join(directory.split(path.sep).join(path.posix.sep), entry.name) : entry.name;
			if (examined >= maxEntries) {
				yield onLimit(child);
				return;
			}
			examined += 1;
			let kind = entryKind(entry);
			let size = entry.size;
			if (kind === "symlink") {
				if (options.symlinkPolicy === "skip") continue;
				const resolved = await resolveRootPath({
					absolutePath: path.resolve(root.rootReal, child),
					rootPath: root.rootReal,
					rootCanonicalPath: root.rootReal,
					boundaryLabel: "root walk"
				});
				if (!resolved.exists) continue;
				kind = resolved.kind === "directory" ? "directory" : resolved.kind === "file" ? "file" : "other";
				size = entry.size;
			}
			const walkEntry = {
				relativePath: child,
				kind,
				size
			};
			const filterResult = options.entryFilter?.(walkEntry) ?? "include";
			if (![
				"include",
				"skip",
				"skip-subtree"
			].includes(filterResult)) throw new TypeError(`invalid root walk entryFilter result: ${String(filterResult)}`);
			if (filterResult === "include") yield walkEntry;
			if (kind !== "directory") continue;
			if (filterResult === "skip-subtree") continue;
			if (depth >= maxDepth) {
				yield onLimit(child);
				return;
			}
			yield* visit(child, depth + 1);
		}
	}
	yield* visit(relativePath, 0);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-impl.js
function logWarn(message) {
	if (process.env.FS_SAFE_DEBUG_WARNINGS === "1") console.warn(message);
}
const SUPPORTS_NOFOLLOW = process.platform !== "win32" && "O_NOFOLLOW" in constants;
const OPEN_READ_FLAGS = resolveReadOpenFlags();
const OPEN_READ_FOLLOW_FLAGS = resolveReadOpenFlags({ followSymlinks: true });
const OPEN_WRITE_EXISTING_FLAGS = constants.O_WRONLY | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_WRITE_CREATE_FLAGS = constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_EXISTING_FLAGS = constants.O_RDWR | constants.O_APPEND | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const OPEN_APPEND_CREATE_FLAGS = constants.O_RDWR | constants.O_APPEND | constants.O_CREAT | constants.O_EXCL | (SUPPORTS_NOFOLLOW ? constants.O_NOFOLLOW : 0);
const DEFAULT_ROOT_MAX_BYTES = 16 * 1024 * 1024;
function pathStatFromStats(stat) {
	return {
		dev: Number(stat.dev),
		gid: Number(stat.gid),
		ino: Number(stat.ino),
		isDirectory: stat.isDirectory(),
		isFile: stat.isFile(),
		isSymbolicLink: stat.isSymbolicLink(),
		mode: stat.mode,
		mtimeMs: stat.mtimeMs,
		nlink: stat.nlink,
		size: stat.size,
		uid: stat.uid
	};
}
function openResult(params) {
	return {
		handle: params.handle,
		containment: "best-effort",
		realPath: params.realPath,
		stat: params.stat,
		[Symbol.asyncDispose]: () => params.handle.close().catch(() => void 0)
	};
}
async function openVerifiedLocalFile(filePath, options) {
	assertNoUnsafeDeviceReadPath(filePath);
	const fsSafeTestHooks = getFsSafeTestHooks();
	let preOpenStat;
	try {
		preOpenStat = await fs$1.lstat(filePath);
		if (preOpenStat.isSymbolicLink() && options?.symlinks !== "follow-within-root") throw new FsSafeError("symlink", "symlink not allowed");
		if (!preOpenStat.isFile() && !preOpenStat.isSymbolicLink()) throw new FsSafeError("not-file", "not a file");
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
	}
	if (preOpenStat) await fsSafeTestHooks?.afterPreOpenLstat?.(filePath);
	let handle;
	try {
		const openFlags = options?.symlinks === "follow-within-root" ? OPEN_READ_FOLLOW_FLAGS : OPEN_READ_FLAGS;
		await fsSafeTestHooks?.beforeOpen?.(filePath, openFlags);
		handle = await fs$1.open(filePath, openFlags);
		try {
			await fsSafeTestHooks?.afterOpen?.(filePath, handle);
		} catch (err) {
			await handle.close().catch(() => {});
			throw err;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw fileNotFoundError();
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file");
		throw err;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) throw new FsSafeError("not-file", "not a file");
		if (preOpenStat && !preOpenStat.isSymbolicLink() && !sameFileIdentity(stat, preOpenStat)) throw new FsSafeError("path-mismatch", "path changed before open");
		if (options?.hardlinks === "reject" && stat.nlink > 1) throw hardlinkedPathNotAllowedError();
		if (options?.symlinks === "follow-within-root") {
			if (!sameFileIdentity(stat, await fs$1.stat(filePath))) throw new FsSafeError("path-mismatch", "path changed during read");
		} else {
			const pathStat = await fs$1.lstat(filePath);
			if (pathStat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
			if (!sameFileIdentity(stat, pathStat)) throw new FsSafeError("path-mismatch", "path changed during read");
		}
		const realPath = await resolveOpenedFileRealPathForHandle(handle, filePath);
		const realStat = await fs$1.stat(realPath);
		if (options?.hardlinks === "reject" && realStat.nlink > 1) throw hardlinkedPathNotAllowedError();
		if (!sameFileIdentity(stat, realStat)) throw new FsSafeError("path-mismatch", "path mismatch");
		return openResult({
			handle,
			realPath,
			stat
		});
	} catch (err) {
		await handle.close().catch(() => {});
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw fileNotFoundError();
		throw err;
	}
}
var RootHandle = class {
	rootIdentity;
	rootDir;
	rootReal;
	rootWithSep;
	defaults;
	constructor(context, defaults = {}) {
		this.rootIdentity = context.rootIdentity;
		this.rootDir = context.rootDir;
		this.rootReal = context.rootReal;
		this.rootWithSep = context.rootWithSep;
		this.defaults = defaults;
	}
	get context() {
		return {
			rootDir: this.rootDir,
			rootIdentity: this.rootIdentity,
			rootReal: this.rootReal,
			rootWithSep: this.rootWithSep
		};
	}
	mutationOptions(options) {
		return {
			...options,
			denyMutations: mergeDenyMutationPolicies(this.defaults.denyMutations, options.denyMutations)
		};
	}
	async resolve(relativePath) {
		assertValidRootDestinationPath(relativePath);
		return (await resolvePathInRoot(this.context, relativePath, { allowFinalSymlink: true })).resolved;
	}
	async open(relativePath, options = {}) {
		return await openFileInRoot(this.context, {
			relativePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	async read(relativePath, options = {}) {
		return await readFileInRoot(this.context, {
			relativePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	async readBytes(relativePath, options = {}) {
		return (await this.read(relativePath, options)).buffer;
	}
	async readText(relativePath, options = {}) {
		const { encoding = "utf8", ...readOptions } = options;
		return (await this.read(relativePath, readOptions)).buffer.toString(encoding);
	}
	async readJson(relativePath, options = {}) {
		return JSON.parse(await this.readText(relativePath, options));
	}
	async readAbsolute(filePath, options = {}) {
		return await readPathInRoot(this.context, {
			filePath,
			...readDefaults(this.defaults),
			...options
		});
	}
	reader(options = {}) {
		return async (filePath) => {
			return (await this.readAbsolute(filePath, options)).buffer;
		};
	}
	async openWritable(relativePath, options = {}) {
		assertValidRootDestinationPath(relativePath);
		const writeMode = options.writeMode ?? "replace";
		return await openWritableFileInRoot(this.context, {
			relativePath,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options),
			append: writeMode === "append",
			truncateExisting: writeMode === "replace"
		});
	}
	async append(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await appendFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options)
		});
	}
	async remove(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		await removePathInRoot(this.context, {
			relativePath,
			...this.mutationOptions(options)
		});
	}
	async mkdir(relativePath, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await mkdirPathInRoot(this.context, {
			relativePath,
			...this.mutationOptions(options)
		});
	}
	async ensureRoot(options = {}) {
		await mkdirPathInRoot(this.context, {
			relativePath: "",
			allowRoot: true,
			...this.mutationOptions(options)
		});
	}
	async write(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await writeFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			renameIdentity: this.defaults.renameIdentity,
			...this.mutationOptions(options)
		});
	}
	async create(relativePath, data, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await writeFileInRoot(this.context, {
			relativePath,
			data,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options),
			overwrite: false
		});
	}
	async writeJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.write(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async createJson(relativePath, data, options = {}) {
		const { replacer, space, trailingNewline = true, ...writeOptions } = options;
		const json = stringifyJsonDocument(data, replacer, space);
		await this.create(relativePath, trailingNewline ? `${json}\n` : json, writeOptions);
	}
	async copyIn(relativePath, sourcePath, options = {}) {
		assertValidRootDestinationPath(relativePath);
		await copyFileInRoot(this.context, {
			sourcePath,
			relativePath,
			maxBytes: this.defaults.maxBytes,
			mkdir: this.defaults.mkdir,
			mode: this.defaults.mode,
			...this.mutationOptions(options)
		});
	}
	async exists(relativePath) {
		try {
			await this.stat(relativePath);
			return true;
		} catch (err) {
			if (err instanceof FsSafeError && err.code === "not-found") return false;
			throw err;
		}
	}
	async stat(relativePath) {
		assertValidRootRelativePath(relativePath);
		validatePinnedOperationPayload({ relativePath });
		return await statPathFallback(this.context, relativePath);
	}
	async list(relativePath, options = {}) {
		assertValidRootRelativePath(relativePath);
		validatePinnedOperationPayload({ relativePath });
		return await listPathFallback(this.context, relativePath, options.withFileTypes === true);
	}
	async move(fromRelative, toRelative, options = {}) {
		assertValidRootRelativePath(fromRelative);
		assertValidRootDestinationPath(toRelative);
		validatePinnedOperationPayload({
			from: fromRelative,
			to: toRelative
		});
		const { denyMutations } = this.mutationOptions(options);
		await assertMoveMutationAllowed(this.context, {
			fromRelative,
			toRelative,
			denyMutations
		});
		await movePathFallback(this.context, {
			fromRelative,
			denyMutations,
			overwrite: options.overwrite ?? false,
			toRelative
		});
	}
	walk(relativePath, options) {
		assertValidRootRelativePath(relativePath);
		return walkRoot(this, relativePath, options);
	}
};
function readDefaults(defaults) {
	return {
		hardlinks: defaults.hardlinks,
		maxBytes: defaults.maxBytes ?? 16777216,
		nonBlockingRead: defaults.nonBlockingRead,
		symlinks: defaults.symlinks
	};
}
async function root(rootDir, defaults = {}) {
	return new RootHandle(await resolveRootContext(rootDir), defaults);
}
async function openFileInRoot(root, params) {
	const { rootWithSep, resolved } = await resolvePathInRoot(root, params.relativePath, {
		allowFinalSymlink: true,
		rejectUnsafeDeviceReads: true,
		rejectSymlinks: params.symlinks !== "follow-within-root"
	});
	let opened;
	try {
		opened = await openVerifiedLocalFile(resolved, {
			nonBlockingRead: params.nonBlockingRead,
			symlinks: params.symlinks
		});
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		throw err;
	}
	if (params.hardlinks !== "allow" && opened.stat.nlink > 1) {
		await opened.handle.close().catch(() => {});
		throw hardlinkedPathNotAllowedError();
	}
	if (!isPathInside(rootWithSep, opened.realPath)) {
		await opened.handle.close().catch(() => {});
		throw outsideWorkspaceError();
	}
	return opened;
}
async function readFileInRoot(root, params) {
	const opened = await openFileInRoot(root, params);
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function readPathInRoot(root, params) {
	const rootDir = root.rootDir;
	const candidatePath = path.isAbsolute(params.filePath) ? path.resolve(params.filePath) : path.resolve(rootDir, params.filePath);
	return await readFileInRoot(root, {
		relativePath: path.relative(rootDir, candidatePath),
		hardlinks: params.hardlinks,
		maxBytes: params.maxBytes,
		nonBlockingRead: params.nonBlockingRead,
		symlinks: params.symlinks
	});
}
async function readLocalFileSafely(params) {
	const opened = await openLocalFileSafely({ filePath: params.filePath });
	try {
		return await readOpenedFileSafely({
			opened,
			maxBytes: params.maxBytes
		});
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function openLocalFileSafely(params) {
	assertNoNulPathInput(params.filePath, "file path contains a NUL byte");
	return await openVerifiedLocalFile(params.filePath);
}
function emitWriteBoundaryWarning(reason) {
	logWarn(`security: fs-safe write boundary warning (${reason})`);
}
function buildAtomicWriteTempPath(targetPath) {
	const dir = path.dirname(targetPath);
	const base = path.basename(targetPath);
	return path.join(dir, `.${base}.${process.pid}.${randomUUID()}.tmp`);
}
function rootWriteQueueKey(root, relativePath) {
	return `${root.rootReal}\0${relativePath}`;
}
async function prepareRootWriteTarget(rootReal, targetPath) {
	const parentPath = await mkdirPathComponentsWithGuards({
		rootReal,
		targetPath: path.dirname(targetPath)
	});
	return path.join(parentPath, path.basename(targetPath));
}
async function writeTempFileForAtomicReplace(params) {
	const tempHandle = await fs$1.open(params.tempPath, OPEN_WRITE_CREATE_FLAGS, params.mode);
	try {
		if (typeof params.data === "string") await tempHandle.writeFile(params.data, params.encoding ?? "utf8");
		else await tempHandle.writeFile(params.data);
		return {
			identity: await tempHandle.stat(),
			cleanupIdentity: await tempHandle.stat({ bigint: true })
		};
	} finally {
		await tempHandle.close().catch(() => {});
	}
}
async function verifyAtomicWriteResult(params) {
	const opened = await openVerifiedLocalFile(params.targetPath, { hardlinks: "reject" });
	try {
		if (!sameFileIdentity(opened.stat, params.expectedIdentity)) throw new FsSafeError("path-mismatch", "path changed during write");
		if (!isPathInside(params.root.rootWithSep, opened.realPath)) throw outsideWorkspaceError();
	} finally {
		await opened.handle.close().catch(() => {});
	}
}
async function resolveGuardedWritePathInRoot(root, params) {
	const resolvedPath = await resolvePathInRoot(root, params.relativePath, {
		aliasErrorCode: "path-alias",
		allowFinalSymlink: params.allowFinalSymlink
	});
	await assertMutationNotDenied(resolvedPath.resolved, params.denyMutations, params.protectDeniedAncestors ? { protectAncestors: true } : void 0);
	if (await (params.shouldAssertNoPathAlias?.(resolvedPath) ?? true)) try {
		await assertNoPathAliasEscape({
			absolutePath: resolvedPath.resolved,
			rootPath: resolvedPath.rootReal,
			boundaryLabel: "root"
		});
	} catch (error) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: error instanceof Error ? error : void 0 });
	}
	return resolvedPath;
}
async function openWritableFileInRoot(root, params) {
	const { rootReal, rootWithSep, resolved } = await resolveGuardedWritePathInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations
	});
	let ioPath = params.mkdir === false ? resolved : await prepareRootWriteTarget(rootReal, resolved);
	try {
		const resolvedRealPath = await fs$1.realpath(ioPath);
		if (!isPathInside(rootWithSep, resolvedRealPath)) throw outsideWorkspaceError();
		ioPath = resolvedRealPath;
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (!isNotFoundPathError(err)) throw err;
	}
	const mode = params.mode ?? 384;
	let handle;
	let createdForWrite = false;
	const existingFlags = params.append ? OPEN_APPEND_EXISTING_FLAGS : OPEN_WRITE_EXISTING_FLAGS;
	const createFlags = params.append ? OPEN_APPEND_CREATE_FLAGS : OPEN_WRITE_CREATE_FLAGS;
	try {
		try {
			handle = await fs$1.open(ioPath, existingFlags, mode);
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
			handle = await fs$1.open(ioPath, createFlags, mode);
			createdForWrite = true;
		}
	} catch (err) {
		if (isNotFoundPathError(err)) throw fileNotFoundError();
		if (isSymlinkOpenError(err)) throw new FsSafeError("symlink", "symlink open blocked", { cause: err });
		if (hasNodeErrorCode(err, "EISDIR")) throw new FsSafeError("not-file", "not a file", { cause: err });
		throw err;
	}
	let realPathForCleanup = null;
	let createdIdentity = null;
	try {
		const stat = await handle.stat();
		if (createdForWrite) createdIdentity = stat;
		if (!stat.isFile()) throw new FsSafeError("not-file", "path is not a regular file under root");
		if (stat.nlink > 1) throw hardlinkedPathNotAllowedError();
		try {
			const lstat = await fs$1.lstat(ioPath);
			if (lstat.isSymbolicLink() || !lstat.isFile()) throw new FsSafeError(lstat.isSymbolicLink() ? "symlink" : "not-file", "path is not a regular file under root");
			if (!sameFileIdentity(stat, lstat)) throw new FsSafeError("path-mismatch", "path changed during write");
		} catch (err) {
			if (!isNotFoundPathError(err)) throw err;
		}
		const realPath = await resolveOpenedFileRealPathForHandle(handle, ioPath);
		realPathForCleanup = realPath;
		const realStat = await fs$1.stat(realPath);
		if (!sameFileIdentity(stat, realStat)) throw new FsSafeError("path-mismatch", "path mismatch");
		if (realStat.nlink > 1) throw hardlinkedPathNotAllowedError();
		if (!isPathInside(rootWithSep, realPath)) throw outsideWorkspaceError();
		if (params.append !== true && params.truncateExisting !== false && !createdForWrite) await handle.truncate(0);
		return {
			handle,
			containment: "best-effort",
			createdForWrite,
			realPath,
			stat,
			[Symbol.asyncDispose]: () => handle.close().catch(() => void 0)
		};
	} catch (err) {
		const cleanupCreatedPath = createdForWrite && err instanceof FsSafeError;
		const cleanupPath = realPathForCleanup ?? ioPath;
		await handle.close().catch(() => {});
		if (cleanupCreatedPath && createdIdentity) await removePathIfIdentityUnchanged(cleanupPath, createdIdentity).catch(() => {});
		throw err;
	}
}
async function appendFileInRoot(root, params) {
	const target = await openWritableFileInRoot(root, {
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		mode: params.mode,
		denyMutations: params.denyMutations,
		truncateExisting: false,
		append: true
	});
	try {
		let prefix = "";
		if (params.prependNewlineIfNeeded === true && !target.createdForWrite && target.stat.size > 0 && (typeof params.data === "string" && !params.data.startsWith("\n") || Buffer.isBuffer(params.data) && params.data.length > 0 && params.data[0] !== 10)) {
			const lastByte = Buffer.alloc(1);
			const { bytesRead } = await target.handle.read(lastByte, 0, 1, target.stat.size - 1);
			if (bytesRead === 1 && lastByte[0] !== 10) prefix = "\n";
		}
		if (typeof params.data === "string") await target.handle.appendFile(`${prefix}${params.data}`, params.encoding ?? "utf8");
		else {
			const payload = prefix.length > 0 ? Buffer.concat([Buffer.from(prefix, "utf8"), params.data]) : params.data;
			await target.handle.appendFile(payload);
		}
		await target.handle.sync();
		if (target.createdForWrite) await syncDirectoryBestEffort(path.dirname(target.realPath));
	} finally {
		await target.handle.close().catch(() => {});
	}
}
async function removePathInRoot(root, params) {
	validatePinnedOperationPayload({ relativePath: params.relativePath });
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations,
		remove: true
	});
	try {
		await removePathFallback(resolved);
	} catch (error) {
		throw normalizePinnedPathError(error);
	}
}
async function mkdirPathInRoot(root, params) {
	validatePinnedOperationPayload({ relativePath: params.relativePath });
	const resolved = await resolvePinnedPathInRoot(root, params);
	try {
		await mkdirPathFallback(resolved);
	} catch (error) {
		throw normalizePinnedPathError(error);
	}
}
async function writeFileInRoot(root, params) {
	await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
		if (process.platform === "win32" && (params.renameIdentity === "verify-content-with-lock" || !getNativeBinding())) {
			await writeFileFallback(root, params);
			return;
		}
		const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, params.mode, params.denyMutations);
		await serializePathWrite(pinned.targetPath, async () => {
			await commitPinnedWriteInRoot(root, pinned, params);
		});
	});
}
async function commitPinnedWriteInRoot(root, pinned, params) {
	let identity;
	try {
		identity = await runPinnedWriteWithRenamePolicy({
			rootPath: pinned.rootReal,
			relativeParentPath: pinned.relativeParentPath,
			basename: pinned.basename,
			targetPath: pinned.targetPath,
			renameIdentity: params.renameIdentity,
			mkdir: params.mkdir !== false,
			mode: params.mode ?? pinned.mode,
			overwrite: params.overwrite,
			input: {
				kind: "buffer",
				data: params.data,
				encoding: params.encoding
			},
			rootIdentity: root.rootIdentity
		});
	} catch (error) {
		const errorCode = error?.code;
		if (errorCode === "file_lock_stale" || errorCode === "file_lock_timeout") throw error;
		if (params.overwrite === false && isAlreadyExistsError(error)) throw new FsSafeError("already-exists", "file already exists", { cause: error instanceof Error ? error : void 0 });
		throw normalizePinnedWriteError(error);
	}
	try {
		await verifyAtomicWriteResult({
			root,
			targetPath: pinned.targetPath,
			expectedIdentity: identity
		});
	} catch (err) {
		emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
		throw err;
	}
}
async function copyFileInRoot(root, params) {
	assertValidRootRelativePath(params.relativePath);
	assertNoNulPathInput(params.sourcePath, "source path contains a NUL byte");
	const source = await openVerifiedLocalFile(params.sourcePath, { hardlinks: params.sourceHardlinks });
	if (params.maxBytes !== void 0 && source.stat.size > params.maxBytes) {
		await source.handle.close().catch(() => {});
		throw new FsSafeError("too-large", `file exceeds limit of ${params.maxBytes} bytes (got ${source.stat.size})`);
	}
	try {
		await serializePathWrite(rootWriteQueueKey(root, params.relativePath), async () => {
			const pinned = await resolvePinnedWriteTargetInRoot(root, params.relativePath, params.mode, params.denyMutations);
			await serializePathWrite(pinned.targetPath, async () => {
				await assertCopySourceCurrent(source);
				let identity;
				try {
					identity = await runPinnedWriteHelper({
						rootPath: pinned.rootReal,
						relativeParentPath: pinned.relativeParentPath,
						basename: pinned.basename,
						mkdir: params.mkdir !== false,
						mode: pinned.mode,
						overwrite: true,
						maxBytes: params.maxBytes,
						input: {
							kind: "stream",
							stream: source.handle.createReadStream()
						},
						rootIdentity: root.rootIdentity
					});
				} catch (error) {
					throw normalizePinnedWriteError(error);
				}
				try {
					await assertCopySourcePathCurrent(source);
				} catch (error) {
					await removePathIfIdentityUnchanged(pinned.targetPath, identity).catch(() => void 0);
					throw error;
				}
			});
		});
	} finally {
		await source.handle.close().catch(() => {});
	}
}
async function assertCopySourceCurrent(source) {
	if (!sameFileIdentity(await source.handle.stat(), source.stat)) throw new FsSafeError("path-mismatch", "copy source descriptor changed");
	await assertCopySourcePathCurrent(source);
}
async function assertCopySourcePathCurrent(source) {
	const current = await fs$1.lstat(source.realPath);
	if (current.isSymbolicLink() || !current.isFile() || !sameFileIdentity(current, source.stat)) throw new FsSafeError("path-mismatch", "copy source path changed");
}
async function removePathIfIdentityUnchanged(targetPath, identity) {
	const parentGuard = await createAsyncDirectoryGuard(path.dirname(targetPath));
	const current = await fs$1.lstat(targetPath);
	if (current.isSymbolicLink() || !sameFileIdentityForCleanup(current, identity)) return;
	await withAsyncDirectoryGuards([parentGuard], async () => {
		await fs$1.rm(targetPath);
	});
}
async function resolvePinnedWriteTargetInRoot(root, relativePath, requestedMode, denyMutations) {
	const { rootReal, rootWithSep, resolved } = await resolveGuardedWritePathInRoot(root, {
		relativePath,
		denyMutations
	});
	const relativeResolved = path.relative(rootReal, resolved);
	if (path.isAbsolute(relativeResolved)) throw outsideWorkspaceError();
	const relativePosix = relativeResolved ? relativeResolved.split(path.sep).join(path.posix.sep) : "";
	const basename = path.posix.basename(relativePosix);
	if (!basename || basename === "." || basename === "/") throw new FsSafeError("invalid-path", "invalid target path");
	let mode = requestedMode ?? 384;
	try {
		const opened = await openFileInRoot(root, {
			relativePath,
			hardlinks: "reject",
			nonBlockingRead: true,
			symlinks: "follow-within-root"
		});
		try {
			mode = requestedMode ?? opened.stat.mode & 511;
			if (!isPathInside(rootWithSep, opened.realPath)) throw outsideWorkspaceError();
		} finally {
			await opened.handle.close().catch(() => {});
		}
	} catch (err) {
		if (!(err instanceof FsSafeError) || err.code !== "not-found") throw err;
	}
	return {
		rootReal,
		targetPath: resolved,
		relativeParentPath: path.posix.dirname(relativePosix) === "." ? "" : path.posix.dirname(relativePosix),
		basename,
		mode: mode || 384
	};
}
async function resolvePinnedPathInRoot(root, params) {
	return await resolvePinnedOperationPathInRoot(root, {
		allowRoot: params.allowRoot,
		denyMutations: params.denyMutations,
		protectDenyMutationAncestors: params.remove === true,
		relativePath: params.relativePath,
		policy: params.remove ? PATH_ALIAS_POLICIES.unlinkTarget : PATH_ALIAS_POLICIES.strict
	});
}
async function resolvePinnedOperationPathInRoot(root, params) {
	const resolved = await resolvePinnedRootPathInRoot(root, {
		relativePath: params.relativePath,
		policy: params.policy
	});
	const relativeResolved = path.relative(resolved.rootReal, resolved.canonicalPath);
	if ((relativeResolved === "" || relativeResolved === ".") && params.allowRoot === true) {
		await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations);
		return {
			rootReal: resolved.rootReal,
			resolved: resolved.canonicalPath,
			relativePosix: ""
		};
	}
	const firstSegment = relativeResolved.split(path.sep)[0];
	if (relativeResolved === "" || relativeResolved === "." || firstSegment === ".." || path.isAbsolute(relativeResolved)) throw outsideWorkspaceError();
	const relativePosix = relativeResolved.split(path.sep).join(path.posix.sep);
	if (!isPathInside(resolved.rootWithSep, resolved.canonicalPath)) throw outsideWorkspaceError();
	await assertMutationNotDenied(resolved.canonicalPath, params.denyMutations, { protectAncestors: params.protectDenyMutationAncestors });
	return {
		rootReal: resolved.rootReal,
		resolved: resolved.canonicalPath,
		relativePosix
	};
}
async function resolvePinnedRootPathInRoot(root, params) {
	await assertRootIdentityCurrent(root);
	const rootReal = root.rootReal;
	let resolved;
	try {
		const expandedPath = await expandRelativePathWithHome(params.relativePath);
		resolved = await resolveRootPath({
			absolutePath: path.isAbsolute(expandedPath) ? expandedPath : `${ensureTrailingSep(rootReal)}${expandedPath}`,
			rootPath: rootReal,
			rootCanonicalPath: rootReal,
			boundaryLabel: "root",
			policy: params.policy
		});
	} catch (err) {
		throw new FsSafeError("path-alias", "path alias escape blocked", { cause: err });
	}
	const rootWithSep = ensureTrailingSep(resolved.rootCanonicalPath);
	return {
		rootReal: resolved.rootCanonicalPath,
		rootWithSep,
		canonicalPath: resolved.canonicalPath
	};
}
async function prepareRemoveGuard(targetPath) {
	try {
		const guard = await createAsyncDirectoryGuard(path.dirname(targetPath));
		await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("remove", targetPath);
		await assertAsyncDirectoryGuard(guard);
		return guard;
	} catch (error) {
		throw normalizeRemoveGuardError(error);
	}
}
async function removePathFallback(resolved) {
	const guard = await prepareRemoveGuard(resolved.resolved);
	try {
		await ((await fs$1.lstat(resolved.resolved)).isDirectory() ? fs$1.rmdir(resolved.resolved) : fs$1.rm(resolved.resolved));
	} catch (error) {
		throw normalizeRemovePathError(error);
	}
	await assertAsyncDirectoryGuard(guard).catch(() => void 0);
}
async function mkdirPathFallback(resolved) {
	await mkdirPathComponentsWithGuards({
		rootReal: resolved.rootReal,
		targetPath: resolved.resolved,
		beforeComponent: async (componentPath) => await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("mkdir", componentPath)
	});
}
async function statPathFallback(root, relativePath) {
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath,
		allowRoot: true
	});
	try {
		const stat = pathStatFromStats(await fs$1.lstat(resolved.resolved));
		await assertRootIdentityCurrent(root);
		return stat;
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
		throw error;
	}
}
async function listPathFallback(root, relativePath, withFileTypes) {
	const resolved = await resolvePinnedPathInRoot(root, {
		relativePath,
		allowRoot: true
	});
	try {
		const sortedNames = (await fs$1.readdir(resolved.resolved)).toSorted();
		if (!withFileTypes) {
			await assertRootIdentityCurrent(root);
			return sortedNames;
		}
		const entries = [];
		for (const name of sortedNames) entries.push({
			name,
			...pathStatFromStats(await fs$1.lstat(path.join(resolved.resolved, name)))
		});
		await assertRootIdentityCurrent(root);
		return entries;
	} catch (error) {
		if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "directory not found", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
}
async function assertMoveMutationAllowed(root, params) {
	await assertMutationNotDenied((await resolvePathInRoot(root, params.fromRelative, {
		aliasErrorCode: "path-alias",
		allowFinalSymlink: true
	})).resolved, params.denyMutations, { protectAncestors: true });
	await assertMutationNotDenied((await resolvePathInRoot(root, params.toRelative, {
		aliasErrorCode: "path-alias",
		allowFinalSymlink: true
	})).resolved, params.denyMutations, { protectAncestors: true });
}
async function movePathFallback(root, params) {
	const source = await resolvePathInRoot(root, params.fromRelative, {
		aliasErrorCode: "path-alias",
		allowFinalSymlink: true
	});
	await assertMutationNotDenied(source.resolved, params.denyMutations, { protectAncestors: true });
	await resolvePinnedRootPathInRoot(root, {
		relativePath: params.fromRelative,
		policy: PATH_ALIAS_POLICIES.strict
	});
	const target = await resolveGuardedWritePathInRoot(root, {
		relativePath: params.toRelative,
		denyMutations: params.denyMutations,
		allowFinalSymlink: true,
		protectDeniedAncestors: true,
		shouldAssertNoPathAlias: async (resolvedTarget) => {
			await resolvePinnedRootPathInRoot(root, {
				relativePath: params.toRelative,
				policy: PATH_ALIAS_POLICIES.unlinkTarget
			});
			const targetStat = await fs$1.lstat(resolvedTarget.resolved).catch(() => void 0);
			return !(process.platform !== "win32" && params.overwrite && targetStat?.isSymbolicLink() === true);
		}
	});
	let sourceStat;
	try {
		sourceStat = await fs$1.lstat(source.resolved);
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
		throw error;
	}
	if (sourceStat.isSymbolicLink()) throw new FsSafeError("symlink", "symlink not allowed");
	if (sourceStat.isFile() && sourceStat.nlink > 1) throw hardlinkedPathNotAllowedError();
	if (!params.overwrite && sourceStat.isDirectory()) throw new FsSafeError("invalid-path", "directory moves require overwrite: true");
	if (!params.overwrite) try {
		await fs$1.lstat(target.resolved);
		throw new FsSafeError("already-exists", "destination exists");
	} catch (error) {
		if (error instanceof FsSafeError) throw error;
		if (!isNotFoundPathError(error)) throw error;
	}
	const sourceParentGuard = await createAsyncDirectoryGuard(path.dirname(source.resolved));
	const targetParentGuard = await createNearestExistingDirectoryGuard(target.rootReal, path.dirname(target.resolved));
	await getFsSafeTestHooks()?.beforeRootFallbackMutation?.("move", target.resolved);
	await assertAsyncDirectoryGuard(sourceParentGuard);
	await assertAsyncDirectoryGuard(targetParentGuard);
	try {
		await fs$1.rename(source.resolved, target.resolved);
	} catch (error) {
		if (isNotFoundPathError(error)) throw fileNotFoundError(error instanceof Error ? error : void 0);
		if (hasNodeErrorCode(error, "EEXIST")) throw new FsSafeError("already-exists", "destination exists", { cause: error instanceof Error ? error : void 0 });
		throw error;
	}
	await assertAsyncDirectoryGuard(targetParentGuard).catch(() => void 0);
}
async function writeFileFallback(root, params) {
	if (params.overwrite === false) {
		await writeMissingFileFallback(root, params);
		return;
	}
	const target = await openWritableFileInRoot(root, {
		relativePath: params.relativePath,
		mkdir: params.mkdir,
		mode: params.mode,
		denyMutations: params.denyMutations,
		truncateExisting: false
	});
	const destinationPath = target.realPath;
	const mode = params.mode ?? target.stat.mode & 511;
	await target.handle.close().catch(() => {});
	const destinationGuard = await createAsyncDirectoryGuard(path.dirname(destinationPath));
	let tempPath = null;
	let unregisterTempPath = null;
	try {
		tempPath = buildAtomicWriteTempPath(destinationPath);
		unregisterTempPath = registerTempPathForExit(tempPath);
		const written = await writeTempFileForAtomicReplace({
			tempPath,
			data: params.data,
			encoding: params.encoding,
			mode: mode || 384
		});
		unregisterTempPath.setIdentity(written.cleanupIdentity);
		const commitTempPath = tempPath;
		await withAsyncDirectoryGuards([destinationGuard], async () => {
			await fs$1.rename(commitTempPath, destinationPath);
		});
		tempPath = null;
		unregisterTempPath();
		unregisterTempPath = null;
		try {
			await verifyAtomicWriteResult({
				root,
				targetPath: destinationPath,
				expectedIdentity: written.identity
			});
		} catch (err) {
			emitWriteBoundaryWarning(`post-write verification failed: ${String(err)}`);
			throw err;
		}
	} finally {
		if (tempPath) await fs$1.rm(tempPath, { force: true }).catch(() => {});
		unregisterTempPath?.();
	}
}
async function writeMissingFileFallback(root, params) {
	const { rootReal, resolved } = await resolveGuardedWritePathInRoot(root, {
		relativePath: params.relativePath,
		denyMutations: params.denyMutations
	});
	const targetPath = params.mkdir === false ? resolved : await prepareRootWriteTarget(rootReal, resolved);
	const parentGuard = await createAsyncDirectoryGuard(path.dirname(targetPath));
	let created = false;
	let createdIdentity;
	try {
		const { handle, writtenStat } = await withAsyncDirectoryGuards([parentGuard], async () => {
			const handle = await fs$1.open(targetPath, OPEN_WRITE_CREATE_FLAGS, params.mode ?? 384);
			created = true;
			try {
				createdIdentity = await handle.stat();
				if (typeof params.data === "string") await handle.writeFile(params.data, params.encoding ?? "utf8");
				else await handle.writeFile(params.data);
				return {
					handle,
					writtenStat: await handle.stat()
				};
			} catch (error) {
				await handle.close().catch(() => void 0);
				throw error;
			}
		}, { onPostGuardFailure: async ({ handle }) => {
			created = false;
			await handle.close().catch(() => void 0);
		} });
		await handle.close();
		await verifyAtomicWriteResult({
			root,
			targetPath,
			expectedIdentity: writtenStat
		});
		created = false;
	} catch (err) {
		if (hasNodeErrorCode(err, "EEXIST")) throw new FsSafeError("already-exists", "file already exists", { cause: err instanceof Error ? err : void 0 });
		throw err;
	} finally {
		if (created && createdIdentity) await removePathIfIdentityUnchanged(targetPath, createdIdentity).catch(() => void 0);
	}
}
//#endregion
export { stringifyJsonDocument as a, resolveOpenedFileRealPathForHandle as c, root as i, openLocalFileSafely as n, PATH_ALIAS_POLICIES as o, readLocalFileSafely as r, assertNoPathAliasEscape as s, DEFAULT_ROOT_MAX_BYTES as t };
