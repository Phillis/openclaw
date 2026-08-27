import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import { a as sanitizeSafePathSegment, r as assertSafePathSegment } from "./safe-path-segment-C4hKsB9L.js";
import { t as registerTempPathForExit } from "./temp-cleanup-Cr3s_L0p.js";
import "node:crypto";
import fs from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { lstat, mkdtemp, rm } from "node:fs/promises";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/secure-temp-dir.js
function isNodeErrorWithCode$1(err, code) {
	return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
function resolveSecureTempRoot(options) {
	const fallbackPrefix = assertSafePathSegment(options.fallbackPrefix, {
		allowDotPrefix: true,
		label: "fallback temp prefix"
	});
	const TMP_DIR_ACCESS_MODE = fs.constants.W_OK | fs.constants.X_OK;
	const accessSync = options.accessSync ?? fs.accessSync;
	const chmodSync = options.chmodSync ?? fs.chmodSync;
	const lstatSync = options.lstatSync ?? fs.lstatSync;
	const mkdirSync = options.mkdirSync ?? fs.mkdirSync;
	const warn = options.warn ?? ((message) => console.warn(message));
	const warningPrefix = options.warningPrefix ?? "[fs-safe]";
	const unsafeFallbackLabel = options.unsafeFallbackLabel ?? "secure temp dir";
	const getuid = options.getuid ?? (() => {
		try {
			return typeof process.getuid === "function" ? process.getuid() : void 0;
		} catch {
			return;
		}
	});
	const tmpdir$1 = typeof options.tmpdir === "function" ? options.tmpdir : tmpdir;
	const platform = options.platform ?? process.platform;
	const uid = getuid();
	const isSecureDirForUser = (st) => {
		if (uid === void 0) return true;
		if (typeof st.uid === "number" && st.uid !== uid) return false;
		if (typeof st.mode === "number" && (st.mode & 18) !== 0) return false;
		return true;
	};
	const fallback = () => {
		const base = tmpdir$1();
		const suffix = uid === void 0 ? fallbackPrefix : `${fallbackPrefix}-${uid}`;
		return (platform === "win32" ? path.win32.join : path.join)(base, suffix);
	};
	const isTrustedTmpDir = (st) => {
		return st.isDirectory() && !st.isSymbolicLink() && isSecureDirForUser(st);
	};
	const resolveDirState = (candidatePath) => {
		try {
			const candidate = lstatSync(candidatePath);
			if (!isTrustedTmpDir(candidate)) return "invalid";
			accessSync(candidatePath, TMP_DIR_ACCESS_MODE);
			return "available";
		} catch (err) {
			if (isNodeErrorWithCode$1(err, "ENOENT")) return "missing";
			return "invalid";
		}
	};
	const tryRepairWritableBits = (candidatePath) => {
		try {
			const st = lstatSync(candidatePath);
			if (!st.isDirectory() || st.isSymbolicLink()) return false;
			if (uid !== void 0 && typeof st.uid === "number" && st.uid !== uid) return false;
			if (typeof st.mode !== "number") return false;
			if ((st.mode & 18) === 0) return resolveDirState(candidatePath) === "available";
			try {
				chmodSync(candidatePath, 448);
			} catch (chmodErr) {
				if (isNodeErrorWithCode$1(chmodErr, "EPERM") || isNodeErrorWithCode$1(chmodErr, "EACCES") || isNodeErrorWithCode$1(chmodErr, "ENOENT")) return resolveDirState(candidatePath) === "available";
				throw chmodErr;
			}
			warn(`${warningPrefix} tightened permissions on temp dir: ${candidatePath}`);
			return resolveDirState(candidatePath) === "available";
		} catch {
			return false;
		}
	};
	const ensureTrustedFallbackDir = () => {
		const fallbackPath = fallback();
		const state = resolveDirState(fallbackPath);
		if (state === "available") return fallbackPath;
		if (state === "invalid") {
			if (tryRepairWritableBits(fallbackPath)) return fallbackPath;
			throw new Error(`Unsafe fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		}
		try {
			mkdirSync(fallbackPath, {
				recursive: true,
				mode: 448
			});
			chmodSync(fallbackPath, 448);
		} catch {
			throw new Error(`Unable to create fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		}
		if (resolveDirState(fallbackPath) !== "available" && !tryRepairWritableBits(fallbackPath)) throw new Error(`Unsafe fallback ${unsafeFallbackLabel}: ${fallbackPath}`);
		return fallbackPath;
	};
	if (options.skipPreferredOnWindows === true && platform === "win32") return ensureTrustedFallbackDir();
	if (!options.preferredDir) return ensureTrustedFallbackDir();
	const existingPreferredState = resolveDirState(options.preferredDir);
	if (existingPreferredState === "available") return options.preferredDir;
	if (existingPreferredState === "invalid") {
		if (tryRepairWritableBits(options.preferredDir)) return options.preferredDir;
		return ensureTrustedFallbackDir();
	}
	try {
		accessSync(path.dirname(options.preferredDir), TMP_DIR_ACCESS_MODE);
		mkdirSync(options.preferredDir, {
			recursive: true,
			mode: 448
		});
		chmodSync(options.preferredDir, 448);
		if (resolveDirState(options.preferredDir) !== "available" && !tryRepairWritableBits(options.preferredDir)) return ensureTrustedFallbackDir();
		return options.preferredDir;
	} catch {
		return ensureTrustedFallbackDir();
	}
}
//#endregion
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/temp-target.js
const HYPHEN_CHAR_CODE = 45;
function trimHyphenEdges(value) {
	let start = 0;
	let end = value.length;
	while (start < end && value.charCodeAt(start) === HYPHEN_CHAR_CODE) start += 1;
	while (end > start && value.charCodeAt(end - 1) === HYPHEN_CHAR_CODE) end -= 1;
	return start === 0 && end === value.length ? value : value.slice(start, end);
}
function sanitizePrefix(prefix) {
	return trimHyphenEdges(prefix.replace(/[^a-zA-Z0-9_-]+/g, "-")) || "tmp";
}
function sanitizeTempFileName(fileName) {
	return sanitizeSafePathSegment(path.basename(fileName), "download.bin", { allowDotPrefix: true });
}
function isNodeErrorWithCode(err, code) {
	return typeof err === "object" && err !== null && "code" in err && err.code === code;
}
async function cleanupTempDir(dir, identity, onCleanupError) {
	try {
		const current = await lstat(dir).catch((error) => {
			if (isNodeErrorWithCode(error, "ENOENT")) return;
			throw error;
		});
		if (!current || !sameFileIdentity(current, identity)) return;
		await rm(dir, {
			recursive: true,
			force: true
		});
	} catch (err) {
		if (!isNodeErrorWithCode(err, "ENOENT")) onCleanupError?.(err);
	}
}
function resolveTempRoot(rootDir) {
	return path.resolve(rootDir ?? resolveSecureTempRoot({ fallbackPrefix: "fs-safe" }));
}
async function tempFile(params) {
	const rootDir = resolveTempRoot(params.rootDir);
	const prefix = `${sanitizePrefix(params.prefix)}-`;
	const dir = await mkdtemp(path.join(rootDir, prefix));
	const identity = await lstat(dir);
	const unregisterTempDir = registerTempPathForExit(dir, {
		recursive: true,
		identity
	});
	const file = (fileName) => path.join(dir, sanitizeTempFileName(fileName ?? params.fileName ?? "download.bin"));
	const cleanup = async () => {
		try {
			await cleanupTempDir(dir, identity, params.onCleanupError);
		} finally {
			unregisterTempDir();
		}
	};
	return {
		dir,
		path: file(),
		file,
		cleanup,
		[Symbol.asyncDispose]: cleanup
	};
}
//#endregion
export { resolveSecureTempRoot as n, tempFile as t };
