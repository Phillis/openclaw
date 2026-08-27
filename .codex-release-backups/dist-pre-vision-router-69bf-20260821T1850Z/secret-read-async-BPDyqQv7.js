import { t as FsSafeError } from "./errors-hdcLXK2n.js";
import { r as readFileHandleBounded } from "./bounded-read-W_MSGG4q.js";
import { t as sameFileIdentity } from "./file-identity-BUNb7Cm3.js";
import { g as resolveHomeRelativePath } from "./pinned-write-CKWgTqHs.js";
import "./secret-file-CA3Rh4Yx.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/secret-read-async.js
function pathErrorCode(error) {
	const code = error.code;
	return code === "ENOENT" || code === "ENOTDIR" ? "not-found" : "invalid-path";
}
async function readSecretFileOutcome(filePath, label, options) {
	const resolvedPath = resolveHomeRelativePath(filePath.trim());
	if (!resolvedPath) return {
		ok: false,
		code: "invalid-path",
		message: `${label} file path is empty.`
	};
	const maxBytes = options.maxBytes ?? 16384;
	let previewStat;
	try {
		previewStat = await fs$1.lstat(resolvedPath);
		if (previewStat.isSymbolicLink()) {
			if (options.rejectSymlink) return {
				ok: false,
				code: "symlink",
				message: `${label} file at ${resolvedPath} must not be a symlink.`
			};
			previewStat = await fs$1.stat(resolvedPath);
		}
	} catch (error) {
		const normalized = error instanceof Error ? error : new Error(String(error));
		return {
			ok: false,
			code: pathErrorCode(error),
			error: normalized,
			message: `Failed to inspect ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	}
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
	let handle;
	try {
		const realPath = await fs$1.realpath(resolvedPath);
		const noFollow = process.platform !== "win32" && "O_NOFOLLOW" in fs.constants ? fs.constants.O_NOFOLLOW : 0;
		handle = await fs$1.open(realPath, fs.constants.O_RDONLY | noFollow);
		const openedStat = await handle.stat();
		const pathStat = await fs$1.lstat(realPath);
		if (!openedStat.isFile() || !pathStat.isFile() || !sameFileIdentity(previewStat, openedStat) || !sameFileIdentity(pathStat, openedStat) || options.rejectHardlinks !== false && openedStat.nlink > 1) throw new FsSafeError("path-mismatch", "security validation failed");
		const secret = (await readFileHandleBounded(handle, maxBytes)).toString("utf8").trim();
		return secret ? {
			ok: true,
			secret
		} : {
			ok: false,
			code: "invalid-path",
			message: `${label} file at ${resolvedPath} is empty.`
		};
	} catch (error) {
		const normalized = error instanceof Error ? error : new Error(String(error));
		return {
			ok: false,
			code: error instanceof FsSafeError ? error.code : pathErrorCode(error) === "not-found" ? "not-found" : "read-failed",
			error: normalized,
			message: `Failed to read ${label} file at ${resolvedPath}: ${String(normalized)}`
		};
	} finally {
		await handle?.close().catch(() => void 0);
	}
}
async function readSecretFile(filePath, label, options = {}) {
	const result = await readSecretFileOutcome(filePath, label, options);
	if (result.ok) return result.secret;
	throw new FsSafeError(result.code, result.message, { cause: result.error });
}
//#endregion
export { readSecretFile as t };
