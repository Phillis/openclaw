import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { n as canonicalPathFromExistingAncestor, o as resolveAbsolutePathForWrite } from "./absolute-path-CYFPfAjt.js";
import { r as root } from "./fs-safe-CmrQUApq.js";
import "./security-runtime-qrFVi6LG.js";
import { n as matchesFileIdentity, r as readPathBinding, t as fileIdentity } from "./path-binding-ipb_4NPa.js";
import { r as rejectCanonicalPathChange } from "./path-errors-ClX7o3Bz.js";
import { t as inspectStrictBase64 } from "./base64-DHgbKH6a.js";
import path from "node:path";
import fs from "node:fs/promises";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/node-host/file-write.ts
const MAX_CONTENT_BYTES = 16 * 1024 * 1024;
function sha256Hex(buf) {
	return crypto.createHash("sha256").update(buf).digest("hex");
}
function err(code, message, canonicalPath) {
	return {
		ok: false,
		code,
		message,
		...canonicalPath ? { canonicalPath } : {}
	};
}
function symlinkRedirectError(error) {
	return err("SYMLINK_REDIRECT", "path traverses a symlink; refusing because followSymlinks=false (set plugins.entries.file-transfer.config.nodes.<node>.followSymlinks=true to allow, or update allowWritePaths to the canonical path)", error.cause && typeof error.cause === "object" && "canonicalPath" in error.cause && typeof error.cause.canonicalPath === "string" ? error.cause.canonicalPath : void 0);
}
function writeFsSafeError(error, targetPath) {
	if (error.code === "symlink") return err("SYMLINK_TARGET_DENIED", `path is a symlink; refusing to write through it: ${targetPath}`);
	if (error.code === "not-file") return err("IS_DIRECTORY", `path resolves to a directory: ${targetPath}`);
	if (error.code === "already-exists") return err("EXISTS_NO_OVERWRITE", `file already exists and overwrite is false: ${targetPath}`);
	return err("WRITE_ERROR", error.message, targetPath);
}
async function captureWriteBinding(canonicalTargetPath, targetIdentity) {
	let anchorPath = path.dirname(canonicalTargetPath);
	for (;;) try {
		const stats = await fs.stat(anchorPath, { bigint: true });
		if (!stats.isDirectory()) throw new Error(`write anchor is not a directory: ${anchorPath}`);
		const anchor = fileIdentity(stats);
		return {
			kind: "write",
			anchorPath,
			anchorDevice: anchor.device,
			anchorInode: anchor.inode,
			...targetIdentity ? {
				targetDevice: targetIdentity.device,
				targetInode: targetIdentity.inode
			} : {}
		};
	} catch (error) {
		if ((error && typeof error === "object" && "code" in error ? error.code : void 0) !== "ENOENT") throw error;
		const parent = path.dirname(anchorPath);
		if (parent === anchorPath) throw error;
		anchorPath = parent;
	}
}
async function writeBoundTarget(input) {
	const expectedTarget = input.binding.targetDevice && input.binding.targetInode ? {
		device: input.binding.targetDevice,
		inode: input.binding.targetInode
	} : void 0;
	if (expectedTarget) {
		let handle;
		try {
			handle = await fs.open(input.canonicalTargetPath, "r+");
		} catch {
			return err("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
		}
		try {
			const stats = await handle.stat({ bigint: true });
			if (!stats.isFile() || !matchesFileIdentity(stats, expectedTarget)) return err("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
			await handle.truncate(0);
			await handle.writeFile(input.buffer);
			await handle.sync();
			return {
				ok: true,
				path: input.canonicalTargetPath,
				overwritten: true,
				identity: fileIdentity(stats)
			};
		} finally {
			await handle.close().catch(() => void 0);
		}
	}
	let anchorRoot;
	try {
		anchorRoot = await root(input.binding.anchorPath);
		if (!matchesFileIdentity(await fs.stat(anchorRoot.rootReal, { bigint: true }), {
			device: input.binding.anchorDevice,
			inode: input.binding.anchorInode
		})) throw new Error("write anchor changed");
	} catch {
		return err("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
	}
	const relativeTarget = path.relative(anchorRoot.rootReal, input.canonicalTargetPath);
	if (!relativeTarget || path.isAbsolute(relativeTarget) || relativeTarget === ".." || relativeTarget.startsWith(`..${path.sep}`)) return err("WRITE_ERROR", "write target is outside the authorized anchor");
	try {
		await anchorRoot.create(relativeTarget, input.buffer, { mkdir: true });
		const opened = await anchorRoot.open(relativeTarget);
		try {
			const stats = await opened.handle.stat({ bigint: true });
			return {
				ok: true,
				path: opened.realPath,
				overwritten: false,
				identity: fileIdentity(stats)
			};
		} finally {
			await opened.handle.close().catch(() => void 0);
		}
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "already-exists") return err("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", input.canonicalTargetPath);
		if (error instanceof FsSafeError) return writeFsSafeError(error, input.canonicalTargetPath);
		return err("WRITE_ERROR", `failed to write file: ${String(error)}`);
	}
}
async function handleFileWrite(params) {
	const rawPath = typeof params?.path === "string" ? params.path : "";
	const hasContentBase64 = typeof params?.contentBase64 === "string";
	const contentBase64 = hasContentBase64 ? params.contentBase64 : "";
	const overwrite = params?.overwrite === true;
	const createParents = params?.createParents === true;
	const expectedSha256 = typeof params?.expectedSha256 === "string" ? params.expectedSha256 : void 0;
	const followSymlinks = params?.followSymlinks === true;
	const preflightOnly = params?.preflightOnly === true;
	if (!rawPath) return err("INVALID_PATH", "path is required");
	if (rawPath.includes("\0")) return err("INVALID_PATH", "path must not contain NUL bytes");
	if (!path.isAbsolute(rawPath)) return err("INVALID_PATH", "path must be absolute");
	if (!hasContentBase64) return err("INVALID_BASE64", "contentBase64 is required");
	const decodedBytes = inspectStrictBase64(contentBase64);
	if (decodedBytes === void 0) return err("INVALID_BASE64", "contentBase64 is not valid base64");
	if (decodedBytes > MAX_CONTENT_BYTES) return err("FILE_TOO_LARGE", `decoded content is ${decodedBytes} bytes; maximum is ${MAX_CONTENT_BYTES} bytes (16 MB)`);
	const buf = Buffer.from(contentBase64, "base64");
	const reEncoded = buf.toString("base64");
	const normalize = (s) => s.replace(/=+$/u, "").replace(/-/gu, "+").replace(/_/gu, "/");
	if (normalize(reEncoded) !== normalize(contentBase64)) return err("INVALID_BASE64", "contentBase64 is not valid base64");
	let targetPath;
	let parentDir;
	let parentExists;
	try {
		const resolved = await resolveAbsolutePathForWrite(rawPath, { symlinks: followSymlinks ? "follow" : "reject" });
		targetPath = resolved.path;
		parentDir = resolved.parentDir;
		parentExists = resolved.parentExists;
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") return symlinkRedirectError(error);
		throw error;
	}
	const canonicalTargetPath = await canonicalPathFromExistingAncestor(targetPath);
	const canonicalPathChange = rejectCanonicalPathChange(params.expectedCanonicalPath, canonicalTargetPath);
	if (canonicalPathChange) return canonicalPathChange;
	const expectedBinding = readPathBinding(params.expectedBinding);
	if (params.expectedBinding !== void 0 && expectedBinding?.kind !== "write") return err("CANONICAL_PATH_CHANGED", "filesystem identity differs from the authorized target", canonicalTargetPath);
	if (!parentExists) {
		if (!createParents) return err("PARENT_NOT_FOUND", `parent directory does not exist: ${parentDir}`);
		if (preflightOnly) {
			const computedSha256 = sha256Hex(buf);
			if (expectedSha256 && expectedSha256.toLowerCase() !== computedSha256) return err("INTEGRITY_FAILURE", `sha256 mismatch: expected ${expectedSha256.toLowerCase()}, got ${computedSha256}`, targetPath);
			return {
				ok: true,
				path: canonicalTargetPath,
				size: buf.length,
				sha256: computedSha256,
				overwritten: false,
				binding: await captureWriteBinding(canonicalTargetPath)
			};
		}
		if (!expectedBinding) try {
			await fs.mkdir(parentDir, { recursive: true });
		} catch (mkdirErr) {
			return err("WRITE_ERROR", `failed to create parent directories: ${mkdirErr instanceof Error ? mkdirErr.message : String(mkdirErr)}`);
		}
	}
	try {
		await resolveAbsolutePathForWrite(targetPath, { symlinks: followSymlinks ? "follow" : "reject" });
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") return symlinkRedirectError(error);
		throw error;
	}
	const targetFileName = path.basename(targetPath);
	let overwritten = false;
	let existingIdentity;
	try {
		const existingLStat = await fs.lstat(targetPath, { bigint: true });
		if (existingLStat.isSymbolicLink()) return err("SYMLINK_TARGET_DENIED", `path is a symlink; refusing to write through it: ${targetPath}`);
		if (existingLStat.isDirectory()) return err("IS_DIRECTORY", `path resolves to a directory: ${targetPath}`);
		if (!overwrite) return err("EXISTS_NO_OVERWRITE", `file already exists and overwrite is false: ${targetPath}`);
		overwritten = true;
		existingIdentity = fileIdentity(existingLStat);
	} catch (statErr) {
		const statErrorCode = statErr instanceof FsSafeError ? statErr.code : statErr.code;
		if (statErrorCode !== "not-found" && statErrorCode !== "ENOENT") {
			const message = statErr instanceof Error ? statErr.message : String(statErr);
			if (message.toLowerCase().includes("permission")) return err("PERMISSION_DENIED", `permission denied: ${targetPath}`);
			return err("WRITE_ERROR", `unexpected stat error: ${message}`);
		}
	}
	const computedSha256 = sha256Hex(buf);
	if (expectedSha256 && expectedSha256.toLowerCase() !== computedSha256) return err("INTEGRITY_FAILURE", `sha256 mismatch: expected ${expectedSha256.toLowerCase()}, got ${computedSha256}`, targetPath);
	if (preflightOnly) return {
		ok: true,
		path: canonicalTargetPath,
		size: buf.length,
		sha256: computedSha256,
		overwritten,
		binding: await captureWriteBinding(canonicalTargetPath, existingIdentity)
	};
	if (expectedBinding?.kind === "write") {
		const writeResult = await writeBoundTarget({
			binding: expectedBinding,
			buffer: buf,
			canonicalTargetPath
		});
		if (!writeResult.ok) return writeResult;
		return {
			ok: true,
			path: writeResult.path,
			size: buf.length,
			sha256: computedSha256,
			overwritten: writeResult.overwritten,
			binding: {
				kind: "existing",
				...writeResult.identity
			}
		};
	}
	const parentRoot = await root(parentDir);
	try {
		if (overwrite) await parentRoot.write(targetFileName, buf);
		else await parentRoot.create(targetFileName, buf);
	} catch (writeErr) {
		if (writeErr instanceof FsSafeError) return writeFsSafeError(writeErr, targetPath);
		const message = writeErr instanceof Error ? writeErr.message : String(writeErr);
		if (message.toLowerCase().includes("permission") || message.toLowerCase().includes("access")) return err("PERMISSION_DENIED", `permission denied writing to: ${parentDir}`);
		return err("WRITE_ERROR", `failed to write file: ${message}`);
	}
	let canonicalPath = targetPath;
	let finalIdentity;
	try {
		const opened = await parentRoot.open(targetFileName);
		canonicalPath = opened.realPath;
		finalIdentity = fileIdentity(await opened.handle.stat({ bigint: true }));
		await opened.handle.close().catch(() => void 0);
	} catch (openErr) {
		if (openErr instanceof FsSafeError) return writeFsSafeError(openErr, targetPath);
	}
	return {
		ok: true,
		path: canonicalPath,
		size: buf.length,
		sha256: computedSha256,
		overwritten,
		binding: {
			kind: "existing",
			...finalIdentity ?? fileIdentity(await fs.stat(canonicalPath, { bigint: true }))
		}
	};
}
//#endregion
export { handleFileWrite };
