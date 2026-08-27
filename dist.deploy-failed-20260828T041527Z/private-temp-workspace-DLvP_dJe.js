import "./fs-safe-defaults-BPVQr7Lx.js";
import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { n as sameFileIdentityForCleanup } from "./file-identity-CaVBmM56.js";
import { i as isNotFoundPathError } from "./path-D138yf8v.js";
import { t as registerTempPathForExit } from "./temp-cleanup-AnQDWpEQ.js";
import { i as openRootFileSync, n as matchRootFileOpenFailure } from "./root-file-B4L4VJ7-.js";
import { n as fileStoreSync, r as throwFsSafeReadError, t as fileStore } from "./file-store-CTahCFAi.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/private-temp-workspace.js
function sanitizeTempPrefix(prefix) {
	const sanitized = prefix.trim().replace(/[^a-zA-Z0-9._-]/g, "-");
	if (!sanitized || sanitized === "." || sanitized === "..") return "fs-safe-";
	return sanitized.endsWith("-") ? sanitized : `${sanitized}-`;
}
function resolveWorkspaceLeaf(dir, fileName) {
	return path.join(dir, assertWorkspaceFileName(fileName));
}
function assertWorkspaceFileName(fileName) {
	const value = fileName.trim();
	if (!value || value === "." || value === ".." || value.includes("\0") || value.includes("/") || value.includes("\\") || path.basename(value) !== value) throw new Error(`Invalid temp workspace file name: ${JSON.stringify(fileName)}`);
	return value;
}
function throwTempWorkspaceOpenFailure(failure) {
	return matchRootFileOpenFailure(failure, {
		path: ({ error }) => {
			if (isNotFoundPathError(error)) throw new FsSafeError("not-found", "temp workspace file not found", { cause: error });
			throw new FsSafeError("path-mismatch", "temp workspace target changed during read", { cause: error });
		},
		validation: ({ error }) => {
			if (error instanceof FsSafeError) throw error;
			throw new FsSafeError("path-mismatch", "temp workspace target failed read validation", { cause: error });
		},
		io: ({ error }) => throwFsSafeReadError(error, "temp workspace"),
		fallback: ({ error }) => {
			throw new FsSafeError("path-mismatch", "temp workspace target changed during read", { cause: error });
		}
	});
}
async function ensurePrivateDirectory(dir, mode) {
	await fs$1.mkdir(dir, {
		recursive: true,
		mode
	});
	if (!(await fs$1.stat(dir)).isDirectory()) throw new Error(`Temp root must be a directory: ${dir}`);
	await fs$1.chmod(dir, mode).catch(() => void 0);
}
function ensurePrivateDirectorySync(dir, mode) {
	fs.mkdirSync(dir, {
		recursive: true,
		mode
	});
	if (!fs.statSync(dir).isDirectory()) throw new Error(`Temp root must be a directory: ${dir}`);
	try {
		fs.chmodSync(dir, mode);
	} catch {}
}
async function cleanupWorkspace(dir, identity) {
	let current;
	try {
		current = await fs$1.lstat(dir, { bigint: true });
	} catch (error) {
		return error.code === "ENOENT" ? "missing" : "identity-mismatch";
	}
	if (!sameFileIdentityForCleanup(current, identity)) return "identity-mismatch";
	await fs$1.rm(dir, {
		recursive: true,
		force: true
	});
	return "removed";
}
function cleanupWorkspaceSync(dir, identity) {
	let current;
	try {
		current = fs.lstatSync(dir, { bigint: true });
	} catch (error) {
		return error.code === "ENOENT" ? "missing" : "identity-mismatch";
	}
	if (!sameFileIdentityForCleanup(current, identity)) return "identity-mismatch";
	fs.rmSync(dir, {
		recursive: true,
		force: true
	});
	return "removed";
}
async function createTempWorkspace(options) {
	const dirMode = options.dirMode ?? 448;
	const mode = options.mode ?? 384;
	const requestedRoot = path.resolve(options.rootDir);
	const root = await fs$1.realpath(requestedRoot).catch(() => requestedRoot);
	await ensurePrivateDirectory(root, dirMode);
	const dir = await fs$1.mkdtemp(path.join(root, sanitizeTempPrefix(options.prefix)));
	await fs$1.chmod(dir, dirMode).catch(() => void 0);
	const stat = await fs$1.lstat(dir, { bigint: true });
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Temp workspace must be a directory: ${dir}`);
	const identity = {
		dev: Number(stat.dev),
		ino: Number(stat.ino)
	};
	const cleanupIdentity = {
		dev: stat.dev,
		ino: stat.ino
	};
	const unregisterTempDir = registerTempPathForExit(dir, {
		recursive: true,
		identity: cleanupIdentity
	});
	const store = fileStore({
		rootDir: dir,
		private: true,
		dirMode,
		mode
	});
	return {
		dir,
		identity,
		store,
		path: (fileName) => resolveWorkspaceLeaf(dir, fileName),
		write: async (fileName, data) => await store.write(assertWorkspaceFileName(fileName), data, { mode }),
		writeText: async (fileName, data) => await store.writeText(assertWorkspaceFileName(fileName), data, { mode }),
		writeJson: async (fileName, data, writeOptions) => await store.writeJson(assertWorkspaceFileName(fileName), data, {
			mode,
			trailingNewline: writeOptions?.trailingNewline
		}),
		copyIn: async (fileName, sourcePath) => await store.copyIn(assertWorkspaceFileName(fileName), sourcePath, { mode }),
		read: async (fileName) => {
			try {
				return await store.readBytes(assertWorkspaceFileName(fileName));
			} catch (error) {
				throwFsSafeReadError(error, "temp workspace");
			}
		},
		cleanup: async () => {
			try {
				return await cleanupWorkspace(dir, cleanupIdentity);
			} finally {
				unregisterTempDir();
			}
		},
		[Symbol.asyncDispose]: async () => {
			try {
				await cleanupWorkspace(dir, cleanupIdentity);
			} finally {
				unregisterTempDir();
			}
		}
	};
}
async function tempWorkspace(options) {
	return await createTempWorkspace(options);
}
async function withTempWorkspace(options, run) {
	const workspace = await createTempWorkspace({
		...options,
		prefix: `${sanitizeTempPrefix(options.prefix)}${randomUUID()}-`
	});
	try {
		return await run(workspace);
	} finally {
		await workspace.cleanup();
	}
}
function tempWorkspaceSync(options) {
	const dirMode = options.dirMode ?? 448;
	const mode = options.mode ?? 384;
	const requestedRoot = path.resolve(options.rootDir);
	let root = requestedRoot;
	try {
		root = fs.realpathSync.native(requestedRoot);
	} catch {
		root = requestedRoot;
	}
	ensurePrivateDirectorySync(root, dirMode);
	const dir = fs.mkdtempSync(path.join(root, sanitizeTempPrefix(options.prefix)));
	try {
		fs.chmodSync(dir, dirMode);
	} catch {}
	const stat = fs.lstatSync(dir, { bigint: true });
	if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`Temp workspace must be a directory: ${dir}`);
	const identity = {
		dev: Number(stat.dev),
		ino: Number(stat.ino)
	};
	const cleanupIdentity = {
		dev: stat.dev,
		ino: stat.ino
	};
	const unregisterTempDir = registerTempPathForExit(dir, {
		recursive: true,
		identity: cleanupIdentity
	});
	const store = fileStoreSync({
		rootDir: dir,
		private: true,
		dirMode,
		mode
	});
	return {
		dir,
		identity,
		store,
		path: (fileName) => resolveWorkspaceLeaf(dir, fileName),
		write: (fileName, data) => store.write(assertWorkspaceFileName(fileName), data, { mode }),
		writeText: (fileName, data) => store.writeText(assertWorkspaceFileName(fileName), data, { mode }),
		writeJson: (fileName, data, writeOptions) => store.writeJson(assertWorkspaceFileName(fileName), data, {
			mode,
			trailingNewline: writeOptions?.trailingNewline
		}),
		read: (fileName) => {
			const opened = openRootFileSync({
				absolutePath: store.path(assertWorkspaceFileName(fileName)),
				rootPath: dir,
				boundaryLabel: "temp workspace",
				rejectHardlinks: true
			});
			if (!opened.ok) throwTempWorkspaceOpenFailure(opened);
			try {
				try {
					return fs.readFileSync(opened.fd);
				} catch (error) {
					throwFsSafeReadError(error, "temp workspace");
				}
			} finally {
				fs.closeSync(opened.fd);
			}
		},
		cleanup: () => {
			try {
				return cleanupWorkspaceSync(dir, cleanupIdentity);
			} finally {
				unregisterTempDir();
			}
		},
		[Symbol.dispose]: () => {
			try {
				cleanupWorkspaceSync(dir, cleanupIdentity);
			} finally {
				unregisterTempDir();
			}
		}
	};
}
function withTempWorkspaceSync(options, run) {
	const workspace = tempWorkspaceSync({
		...options,
		prefix: `${sanitizeTempPrefix(options.prefix)}${randomUUID()}-`
	});
	try {
		return run(workspace);
	} finally {
		workspace.cleanup();
	}
}
//#endregion
export { withTempWorkspaceSync as i, tempWorkspaceSync as n, withTempWorkspace as r, tempWorkspace as t };
