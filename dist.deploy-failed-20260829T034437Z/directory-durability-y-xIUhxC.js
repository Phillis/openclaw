import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { t as resolveReadOpenFlags } from "./read-open-flags-DGgM-BoE.js";
import { n as sameFileIdentityForCleanup, t as sameFileIdentity } from "./file-identity-CaVBmM56.js";
import "./fs-safe-CmrQUApq.js";
import { d as pinDirectory, f as syncDirectory } from "./pinned-write-powa_mtU.js";
import { n as requireNativeBinding, t as getNativeBinding } from "./native-CIvGO3cR.js";
import { f as syncNativeFileBestEffort, u as getFsSafeTestHooks } from "./sidecar-lock-ChVk6eKw.js";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/file-hash.js
async function hashFileHandle(handle, native = getNativeBinding()) {
	if (!(await handle.stat()).isFile()) throw new FsSafeError("not-file", "SHA-256 input is not a regular file");
	if (native) return await native.sha256File(handle.fd);
	const hash = createHash("sha256");
	const buffer = Buffer.allocUnsafe(64 * 1024);
	let position = 0;
	while (true) {
		const { bytesRead } = await handle.read(buffer, 0, buffer.length, position);
		if (bytesRead === 0) return {
			bytes: position,
			digest: hash.digest("hex")
		};
		hash.update(buffer.subarray(0, bytesRead));
		position += bytesRead;
	}
}
async function hashPath(filePath) {
	const before = await fs$1.lstat(filePath);
	if (before.isSymbolicLink()) throw new FsSafeError("symlink", "SHA-256 path must not be a symbolic link");
	if (!before.isFile()) throw new FsSafeError("not-file", "SHA-256 path is not a regular file");
	let handle;
	try {
		handle = await fs$1.open(filePath, resolveReadOpenFlags());
	} catch (error) {
		if (error?.code === "ELOOP") throw new FsSafeError("symlink", "SHA-256 path must not be a symbolic link", { cause: error });
		throw error;
	}
	try {
		const opened = await handle.stat();
		const current = await fs$1.lstat(filePath);
		if (!opened.isFile()) throw new FsSafeError("not-file", "SHA-256 path is not a regular file");
		if (current.isSymbolicLink() || !current.isFile() || !sameFileIdentity(before, opened) || !sameFileIdentity(opened, current)) throw new FsSafeError("path-mismatch", "SHA-256 path changed while opening");
		return await hashFileHandle(handle);
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function sha256File(input) {
	return typeof input === "string" ? await hashPath(input) : await hashFileHandle(input);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/publish-file-failure.js
function rememberCreatedTarget(state, identity, phase) {
	state.targetCreated = true;
	state.targetIdentity = {
		dev: Number(identity.dev),
		ino: Number(identity.ino)
	};
	state.targetCleanupIdentity = {
		dev: identity.dev,
		ino: identity.ino
	};
	state.phase = phase;
}
function publicationFailure(error, state, cleanup) {
	const cause = error instanceof Error ? error : new Error(String(error));
	const details = {
		phase: state.phase,
		targetCreated: state.targetCreated,
		...state.targetIdentity ? { targetIdentity: state.targetIdentity } : {},
		...state.directorySync ? { directorySync: state.directorySync } : {},
		cleanup
	};
	return new FsSafeError(error instanceof FsSafeError ? error.code : "helper-failed", `exclusive file publication failed during ${state.phase}: ${cause.message}`, {
		cause,
		details
	});
}
function directorySyncFailure(error) {
	const code = error?.code;
	return typeof code === "string" ? {
		status: "failed",
		code
	} : { status: "failed" };
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/publish-file.js
const HARDLINK_FALLBACK_CODES = /* @__PURE__ */ new Set([
	"EPERM",
	"EXDEV",
	"ENOTSUP",
	"EOPNOTSUPP",
	"ENOSYS"
]);
const NATIVE_COPY_FALLBACK_CODES = /* @__PURE__ */ new Set([
	"EINVAL",
	"ENOSYS",
	"ENOTSUP",
	"EOPNOTSUPP",
	"EPERM",
	"EXDEV"
]);
function isHardlinkFallbackError(error) {
	return HARDLINK_FALLBACK_CODES.has(error?.code ?? "");
}
function sourceOpenFlags() {
	return fs.constants.O_RDONLY | (process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0);
}
function directoryOpenFlags() {
	return fs.constants.O_RDONLY | (typeof fs.constants.O_DIRECTORY === "number" ? fs.constants.O_DIRECTORY : 0);
}
async function openNativeParent(filePath) {
	const parentPath = path.dirname(filePath);
	const handle = await fs$1.open(parentPath, directoryOpenFlags());
	try {
		const pathname = await fs$1.lstat(parentPath, { bigint: true });
		const opened = await handle.stat({ bigint: true });
		if (pathname.isSymbolicLink() || !sameFileIdentity(pathname, opened)) throw new FsSafeError("path-mismatch", "publication parent changed while opening");
		return {
			basename: path.basename(filePath),
			handle
		};
	} catch (error) {
		await handle.close().catch(() => void 0);
		throw error;
	}
}
async function assertPinnedSourceCurrent(params) {
	const opened = await params.handle.stat({ bigint: true });
	const current = await fs$1.lstat(params.sourcePath, { bigint: true });
	if (!opened.isFile() || current.isSymbolicLink() || !current.isFile() || !sameFileIdentity(opened, params.identity) || !sameFileIdentity(current, opened)) throw new FsSafeError("path-mismatch", "publication source changed during operation");
}
async function copyPinnedSource(params) {
	if (params.native && params.targetNativeParent) for (const method of ["clone", "copy-file-range"]) {
		let nativeFd;
		try {
			if (method === "clone") nativeFd = params.native.cloneFileExclusive(params.source.fd, params.targetNativeParent.handle.fd, params.targetNativeParent.basename);
			else {
				const copied = await params.native.copyFileRangeExclusive(params.source.fd, params.targetNativeParent.handle.fd, params.targetNativeParent.basename);
				if (copied.errorCode) throw Object.assign(new Error(copied.errorMessage ?? "native copy failed"), { code: copied.errorCode });
				nativeFd = copied.fd;
			}
		} catch (error) {
			if (NATIVE_COPY_FALLBACK_CODES.has(error.code ?? "")) continue;
			throw error;
		}
		let target;
		const createdIdentity = fs.fstatSync(nativeFd, { bigint: true });
		rememberCreatedTarget(params.failure, createdIdentity, "copy-verify");
		try {
			await getFsSafeTestHooks()?.afterPublishTargetCreated?.("exclusive-copy", params.targetPath, createdIdentity);
			const identity = await fs$1.lstat(params.targetPath, { bigint: true });
			target = await fs$1.open(params.targetPath, sourceOpenFlags());
			const opened = await target.stat({ bigint: true });
			if (identity.isSymbolicLink() || !identity.isFile() || !sameFileIdentity(createdIdentity, identity) || !sameFileIdentity(createdIdentity, opened)) throw new FsSafeError("path-mismatch", "native publication target changed after copy");
			const hashed = await hashFileHandle(target, params.native);
			fs.closeSync(nativeFd);
			nativeFd = void 0;
			return {
				handle: target,
				exactIdentity: opened,
				digest: hashed.digest,
				bytes: hashed.bytes
			};
		} catch (error) {
			await target?.close().catch(() => void 0);
			throw error;
		} finally {
			if (nativeFd !== void 0) fs.closeSync(nativeFd);
		}
	}
	const target = await fs$1.open(params.targetPath, "wx+", 384);
	const exactIdentity = await target.stat({ bigint: true });
	rememberCreatedTarget(params.failure, exactIdentity, "copy-verify");
	try {
		await getFsSafeTestHooks()?.afterPublishTargetCreated?.("exclusive-copy", params.targetPath, exactIdentity);
		const hash = createHash("sha256");
		const buffer = Buffer.allocUnsafe(64 * 1024);
		let position = 0;
		while (true) {
			const { bytesRead } = await params.source.read(buffer, 0, buffer.length, position);
			if (bytesRead === 0) break;
			hash.update(buffer.subarray(0, bytesRead));
			let written = 0;
			while (written < bytesRead) {
				const result = await target.write(buffer, written, bytesRead - written, position + written);
				if (result.bytesWritten <= 0) throw new FsSafeError("helper-failed", "exclusive publication copy made no progress");
				written += result.bytesWritten;
			}
			position += bytesRead;
		}
		await target.sync();
		return {
			handle: target,
			exactIdentity,
			digest: hash.digest("hex"),
			bytes: position
		};
	} catch (error) {
		await target.close().catch(() => void 0);
		throw error;
	}
}
async function removeCreatedTargetIfUnchanged(targetPath, identity) {
	if (!identity) return "unknown";
	try {
		const current = await fs$1.lstat(targetPath, { bigint: true });
		if (!current.isSymbolicLink() && sameFileIdentityForCleanup(current, identity)) {
			await fs$1.rm(targetPath);
			return "removed";
		}
		return "preserved";
	} catch (error) {
		return error.code === "ENOENT" ? "removed" : "unknown";
	}
}
async function syncPublishedParent(params) {
	params.failure.phase = "directory-sync";
	try {
		await getFsSafeTestHooks()?.beforePublishDirectorySync?.(params.method, params.targetPath, params.failure.targetIdentity);
		return await params.parent.sync();
	} catch (error) {
		params.failure.directorySync = directorySyncFailure(error);
		throw error;
	}
}
async function publishFileExclusive(params) {
	const sourcePath = path.resolve(params.sourcePath);
	const targetPath = path.resolve(params.targetPath);
	const parentPath = path.dirname(targetPath);
	if (params.parentReceipt && path.resolve(params.parentReceipt.path) !== parentPath) throw new FsSafeError("path-mismatch", "publication parent receipt does not match target parent");
	const sourcePathStat = await fs$1.lstat(sourcePath);
	if (sourcePathStat.isSymbolicLink() || !sourcePathStat.isFile()) throw new FsSafeError("not-file", "publication source must be a regular file");
	const source = await fs$1.open(sourcePath, sourceOpenFlags());
	let parent;
	let sourceNativeParent;
	let targetNativeParent;
	const failure = {
		phase: params.strategy === "rename-noreplace" ? "rename-create" : "hardlink-create",
		targetCreated: false,
		preserveTarget: false
	};
	try {
		parent = await pinDirectory(params.parentReceipt ?? parentPath, { label: "publication parent" });
		const sourceIdentity = await source.stat();
		const sourceExactIdentity = await source.stat({ bigint: true });
		const sourcePathExactIdentity = await fs$1.lstat(sourcePath, { bigint: true });
		if (sourcePathExactIdentity.isSymbolicLink() || !sourcePathExactIdentity.isFile() || !sameFileIdentity(sourcePathExactIdentity, sourceExactIdentity) || params.expectedSourceIdentity && !sameFileIdentity(params.expectedSourceIdentity, typeof params.expectedSourceIdentity.dev === "bigint" || typeof params.expectedSourceIdentity.ino === "bigint" ? sourceExactIdentity : sourceIdentity)) throw new FsSafeError("path-mismatch", "publication source identity did not match");
		await parent.assertCurrent();
		await assertPinnedSourceCurrent({
			sourcePath,
			handle: source,
			identity: sourceExactIdentity
		});
		const native = params.strategy === "rename-noreplace" ? requireNativeBinding() : getNativeBinding();
		if (native) {
			sourceNativeParent = await openNativeParent(sourcePath);
			targetNativeParent = await openNativeParent(targetPath);
		}
		if (params.strategy === "rename-noreplace") {
			requireNativeBinding().renameNoReplace(sourceNativeParent.handle.fd, sourceNativeParent.basename, targetNativeParent.handle.fd, targetNativeParent.basename);
			rememberCreatedTarget(failure, sourceExactIdentity, "rename-verify");
			failure.preserveTarget = true;
			await getFsSafeTestHooks()?.afterPublishTargetCreated?.("rename-noreplace", targetPath, sourceExactIdentity);
			const targetExactIdentity = await fs$1.lstat(targetPath, { bigint: true });
			if (targetExactIdentity.isSymbolicLink() || !targetExactIdentity.isFile() || !sameFileIdentity(targetExactIdentity, sourceExactIdentity)) throw new FsSafeError("path-mismatch", "no-replace publication target changed");
			try {
				await fs$1.lstat(sourcePath);
				throw new FsSafeError("path-mismatch", "no-replace publication source still exists");
			} catch (error) {
				if (error.code !== "ENOENT") throw error;
			}
			syncNativeFileBestEffort(sourceNativeParent.handle.fd);
			return {
				method: "rename-noreplace",
				identity: await fs$1.lstat(targetPath),
				directorySync: await syncPublishedParent({
					parent,
					failure,
					method: "rename-noreplace",
					targetPath
				})
			};
		}
		try {
			if (native) native.linkBeneath(sourceNativeParent.handle.fd, sourceNativeParent.basename, targetNativeParent.handle.fd, targetNativeParent.basename);
			else await fs$1.link(sourcePath, targetPath);
			rememberCreatedTarget(failure, sourceExactIdentity, "hardlink-verify");
			await getFsSafeTestHooks()?.afterPublishTargetCreated?.("hardlink", targetPath, sourceExactIdentity);
			const targetExactIdentity = await fs$1.lstat(targetPath, { bigint: true });
			if (targetExactIdentity.isSymbolicLink() || !targetExactIdentity.isFile() || !sameFileIdentity(targetExactIdentity, sourceExactIdentity)) throw new FsSafeError("path-mismatch", "hardlink publication target changed");
			await assertPinnedSourceCurrent({
				sourcePath,
				handle: source,
				identity: sourceExactIdentity
			});
			return {
				method: "hardlink",
				identity: await fs$1.lstat(targetPath),
				directorySync: await syncPublishedParent({
					parent,
					failure,
					method: "hardlink",
					targetPath
				})
			};
		} catch (error) {
			if (failure.targetCreated || !isHardlinkFallbackError(error) || params.strategy === "link-required") throw error;
		}
		failure.phase = "copy-create";
		let target;
		try {
			const copied = await copyPinnedSource({
				source,
				targetPath,
				native,
				targetNativeParent,
				failure
			});
			target = copied.handle;
			await target.stat();
			const targetPathStat = await fs$1.lstat(targetPath);
			const targetPathExactStat = await fs$1.lstat(targetPath, { bigint: true });
			const copiedBack = await hashFileHandle(target, native);
			const sourceAfter = await hashFileHandle(source, native);
			if (targetPathStat.isSymbolicLink() || targetPathExactStat.isSymbolicLink() || !sameFileIdentity(targetPathExactStat, copied.exactIdentity) || copiedBack.bytes !== copied.bytes || copiedBack.digest !== copied.digest || sourceAfter.bytes !== copied.bytes || sourceAfter.digest !== copied.digest) throw new FsSafeError("path-mismatch", "exclusive publication copy failed content fencing");
			await assertPinnedSourceCurrent({
				sourcePath,
				handle: source,
				identity: sourceExactIdentity
			});
			return {
				method: "exclusive-copy",
				identity: targetPathStat,
				directorySync: await syncPublishedParent({
					parent,
					failure,
					method: "exclusive-copy",
					targetPath
				})
			};
		} catch (error) {
			await target?.close().catch(() => void 0);
			target = void 0;
			throw error;
		} finally {
			await target?.close().catch(() => void 0);
		}
	} catch (error) {
		if (!failure.targetCreated) throw error;
		const preserveSyncFailure = failure.phase === "directory-sync" && params.onSyncFailure === "preserve";
		throw publicationFailure(error, failure, failure.preserveTarget || preserveSyncFailure ? "preserved" : await removeCreatedTargetIfUnchanged(targetPath, failure.targetCleanupIdentity));
	} finally {
		await sourceNativeParent?.handle.close().catch(() => void 0);
		await targetNativeParent?.handle.close().catch(() => void 0);
		await source.close().catch(() => void 0);
		await parent?.close().catch(() => void 0);
	}
}
//#endregion
//#region src/infra/directory-durability.ts
function isUnsupportedDirectorySyncError(error) {
	const code = error.code;
	return code === "EINVAL" || code === "ENOTSUP" || code === "ENOSYS" || process.platform === "win32" && (code === "EISDIR" || code === "EPERM" || code === "EACCES");
}
/** Require a real directory sync at product commit boundaries. */
function requireDirectorySync(outcome, label) {
	if (outcome.status !== "unsupported" || process.platform === "win32") return;
	const code = outcome.code ? ` (${outcome.code})` : "";
	throw new Error(`${label} does not support crash-durable directory synchronization${code}.`);
}
function getPublishFileExclusiveFailureDetails(error) {
	if (!(error instanceof FsSafeError)) return;
	const details = error.details;
	if (!details || typeof details.targetCreated !== "boolean" || details.cleanup !== "removed" && details.cleanup !== "preserved" && details.cleanup !== "unknown") return;
	return details;
}
function postPublicationFailure(params) {
	const cause = params.error instanceof Error ? params.error : new Error(String(params.error));
	return new FsSafeError(params.error instanceof FsSafeError ? params.error.code : "helper-failed", `File publication failed after target creation: ${cause.message}`, {
		cause,
		details: {
			phase: params.phase,
			targetCreated: true,
			targetIdentity: {
				dev: params.published.identity.dev,
				ino: params.published.identity.ino
			},
			cleanup: "preserved"
		}
	});
}
/** Publish one file without replacement under OpenClaw's durability policy. */
async function publishFileNoClobber(sourcePath, targetPath, options) {
	const sourceIdentity = await fs$1.lstat(sourcePath);
	const published = await publishFileExclusive({
		sourcePath,
		targetPath,
		expectedSourceIdentity: sourceIdentity,
		strategy: options.strategy
	});
	const degraded = published.directorySync.status === "unsupported";
	if (options.durability === "fail-closed") try {
		requireDirectorySync(published.directorySync, "File publication directory");
	} catch (error) {
		throw postPublicationFailure({
			error,
			phase: "directory-sync",
			published
		});
	}
	if (options.moveSource) try {
		const currentSource = await fs$1.lstat(sourcePath);
		if (!currentSource.isFile() || !sameFileIdentity(currentSource, sourceIdentity)) throw new Error(`File publication source changed before removal: ${sourcePath}`);
		await fs$1.unlink(sourcePath);
	} catch (error) {
		throw postPublicationFailure({
			error,
			phase: published.method === "hardlink" ? "hardlink-verify" : "copy-verify",
			published
		});
	}
	return {
		...published,
		durability: degraded ? "degraded" : "durable"
	};
}
/** Compatibility adapter for former best-effort call sites. */
async function syncDirectoryIfSupported(directoryPath) {
	try {
		return await syncDirectory(directoryPath);
	} catch (error) {
		if (!isUnsupportedDirectorySyncError(error)) throw error;
		const code = error.code;
		return code ? {
			status: "unsupported",
			code
		} : { status: "unsupported" };
	}
}
//#endregion
export { isHardlinkFallbackError as a, syncDirectoryIfSupported as i, publishFileNoClobber as n, publishFileExclusive as o, requireDirectorySync as r, sha256File as s, getPublishFileExclusiveFailureDetails as t };
