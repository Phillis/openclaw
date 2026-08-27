import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { t as resolveReadOpenFlags } from "./read-open-flags-DGgM-BoE.js";
import { i as guardedRename } from "./pinned-write-powa_mtU.js";
import { t as registerTempPathForExit } from "./temp-cleanup-AnQDWpEQ.js";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region node_modules/@openclaw/fs-safe/dist/move-path.js
function moveCopyFallbackReasonForRenameError(error, platform = process.platform) {
	const code = error?.code;
	if (code === "EXDEV") return "cross-device";
	if (code === "EPERM" && platform === "win32") return "windows-rename-denied";
}
const MAX_HARDLINK_PREFLIGHT_ENTRIES = 5e4;
function hardlinkedSourceError(sourcePath) {
	return new FsSafeError("hardlink", `Refusing to move hardlinked file: ${sourcePath}`);
}
function hardlinkWalkTooLargeError() {
	return new FsSafeError("too-large", `Source hardlink preflight exceeds ${MAX_HARDLINK_PREFLIGHT_ENTRIES} entries`);
}
async function preflightSourceHardlinks(sourcePath) {
	const pending = [sourcePath];
	let discovered = 1;
	while (pending.length > 0) {
		const current = pending.pop();
		const stat = await fs$1.lstat(current);
		if (stat.isFile() && stat.nlink > 1) throw hardlinkedSourceError(current);
		if (!stat.isDirectory()) continue;
		const directory = await fs$1.opendir(current);
		for await (const entry of directory) {
			discovered += 1;
			if (discovered > MAX_HARDLINK_PREFLIGHT_ENTRIES) throw hardlinkWalkTooLargeError();
			pending.push(path.join(current, entry.name));
		}
	}
}
function isSameOrDescendant(parentPath, candidatePath) {
	const relative = path.relative(parentPath, candidatePath);
	return relative === "" || !path.isAbsolute(relative) && !relative.startsWith(`..${path.sep}`) && relative !== "..";
}
async function assertCopyDestinationOutsideSource(sourcePath, targetPath) {
	const sourceReal = await fs$1.realpath(sourcePath);
	const normalizedTarget = path.resolve(targetPath);
	const targetParentReal = await fs$1.realpath(path.dirname(normalizedTarget));
	if (isSameOrDescendant(sourceReal, path.join(targetParentReal, path.basename(normalizedTarget)))) throw new FsSafeError("invalid-path", "Move destination must not be inside the source");
}
function entryIdentity(stat) {
	return {
		ctimeMs: stat.ctimeMs,
		dev: stat.dev,
		ino: stat.ino,
		mode: stat.mode,
		mtimeMs: stat.mtimeMs,
		nlink: stat.nlink,
		size: stat.size
	};
}
function sameIdentity(a, b) {
	return a.dev === b.dev && a.ino === b.ino && a.mode === b.mode && a.nlink === b.nlink && a.size === b.size && a.mtimeMs === b.mtimeMs && a.ctimeMs === b.ctimeMs;
}
function sameDirectoryNode(a, b) {
	return a.dev === b.dev && a.ino === b.ino;
}
function modeBits(mode) {
	return mode & 511;
}
function sourceChangedError(sourcePath) {
	return Object.assign(/* @__PURE__ */ new Error(`Source changed during move fallback: ${sourcePath}`), { code: "ESTALE" });
}
async function assertSourceStillMatches(sourcePath, identity) {
	if (!sameIdentity(identity, entryIdentity(await fs$1.lstat(sourcePath)))) throw sourceChangedError(sourcePath);
}
async function chmodDirectoryPinned(directoryPath, mode) {
	if (process.platform === "win32") return;
	const handle = await fs$1.open(directoryPath, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
	try {
		await handle.chmod(mode);
	} finally {
		await handle.close();
	}
}
async function writeAll(handle, buffer, bytesRead) {
	let offset = 0;
	while (offset < bytesRead) {
		const { bytesWritten } = await handle.write(buffer, offset, bytesRead - offset);
		offset += bytesWritten;
	}
}
async function copyRegularFilePinned(params) {
	let destinationCreated = false;
	let sourceHandle;
	try {
		sourceHandle = await fs$1.open(params.from, resolveReadOpenFlags());
	} catch (error) {
		const code = error?.code;
		if (code === "ELOOP" || code === "ENOENT" || code === "ENOTDIR") throw sourceChangedError(params.from);
		throw error;
	}
	try {
		const openedStat = await sourceHandle.stat();
		if (params.rejectHardlinks && openedStat.nlink > 1) throw hardlinkedSourceError(params.from);
		if (!openedStat.isFile() || !sameIdentity(params.identity, entryIdentity(openedStat))) throw sourceChangedError(params.from);
		const destinationHandle = await fs$1.open(params.to, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, modeBits(params.mode) || 438);
		destinationCreated = true;
		try {
			const scratch = Buffer.allocUnsafe(64 * 1024);
			while (true) {
				const { bytesRead } = await sourceHandle.read(scratch, 0, scratch.length, null);
				if (bytesRead === 0) break;
				await writeAll(destinationHandle, scratch, bytesRead);
			}
			const finalSourceStat = await sourceHandle.stat();
			if (params.rejectHardlinks && finalSourceStat.nlink > 1) throw hardlinkedSourceError(params.from);
			if (!sameIdentity(params.identity, entryIdentity(finalSourceStat))) throw sourceChangedError(params.from);
			await destinationHandle.chmod(modeBits(params.mode));
		} finally {
			await destinationHandle.close();
		}
	} catch (error) {
		if (destinationCreated) await fs$1.rm(params.to, { force: true }).catch(() => void 0);
		throw error;
	} finally {
		await sourceHandle.close();
	}
}
async function copyEntryWithManifest(from, to, options) {
	const sourceStat = await fs$1.lstat(from);
	const identity = entryIdentity(sourceStat);
	if (sourceStat.isSymbolicLink()) {
		await fs$1.symlink(await fs$1.readlink(from), to);
		await assertSourceStillMatches(from, identity);
		return {
			...identity,
			kind: "leaf"
		};
	}
	if (sourceStat.isDirectory()) {
		await fs$1.mkdir(to, { mode: modeBits(sourceStat.mode) || 493 });
		const children = [];
		const childNames = [];
		const directory = await fs$1.opendir(from);
		for await (const entry of directory) {
			if (options.budget && ++options.budget.discovered > MAX_HARDLINK_PREFLIGHT_ENTRIES) throw hardlinkWalkTooLargeError();
			childNames.push(entry.name);
		}
		for (const child of childNames) children.push({
			name: child,
			manifest: await copyEntryWithManifest(path.join(from, child), path.join(to, child), options)
		});
		await assertSourceStillMatches(from, identity);
		await chmodDirectoryPinned(to, modeBits(sourceStat.mode));
		return {
			...identity,
			children,
			kind: "directory"
		};
	}
	if (!sourceStat.isFile()) throw new Error(`Refusing to move non-file path with copy fallback: ${from}`);
	if (options.sourceHardlinks === "reject" && sourceStat.nlink > 1) throw hardlinkedSourceError(from);
	await copyRegularFilePinned({
		from,
		identity,
		mode: sourceStat.mode,
		rejectHardlinks: options.sourceHardlinks === "reject",
		to
	});
	return {
		...identity,
		kind: "leaf"
	};
}
function mergeCleanupResults(a, b) {
	return a === "stale" || b === "stale" ? "stale" : "removed";
}
async function cleanupCopiedEntry(sourcePath, manifest) {
	let currentStat;
	try {
		currentStat = await fs$1.lstat(sourcePath);
	} catch (error) {
		if (error?.code === "ENOENT") return "removed";
		throw error;
	}
	if (manifest.kind === "directory") {
		if (!currentStat.isDirectory() || !sameDirectoryNode(manifest, entryIdentity(currentStat))) return "stale";
		let result = "removed";
		for (const child of manifest.children) result = mergeCleanupResults(result, await cleanupCopiedEntry(path.join(sourcePath, child.name), child.manifest));
		try {
			await fs$1.rmdir(sourcePath);
		} catch (error) {
			const code = error?.code;
			if (code === "ENOTEMPTY" || code === "EEXIST") return "stale";
			throw error;
		}
		return result;
	}
	if (!sameIdentity(manifest, entryIdentity(currentStat))) return "stale";
	await fs$1.unlink(sourcePath);
	return "removed";
}
async function movePathWithCopyFallback(options) {
	const sourcePath = path.resolve(options.from);
	const targetPath = path.resolve(options.to);
	const rejectHardlinks = options.sourceHardlinks === "reject";
	if (rejectHardlinks) await preflightSourceHardlinks(sourcePath);
	if (!rejectHardlinks) try {
		await guardedRename({
			from: sourcePath,
			to: targetPath
		});
		return;
	} catch (error) {
		if (!moveCopyFallbackReasonForRenameError(error)) throw error;
	}
	await assertCopyDestinationOutsideSource(sourcePath, targetPath);
	const targetDir = path.dirname(targetPath);
	const staged = path.join(targetDir, `.fs-safe-move-${process.pid}-${randomUUID()}.tmp`);
	const unregisterStaged = registerTempPathForExit(staged, { recursive: true });
	let stagedCommitted = false;
	try {
		const manifest = await copyEntryWithManifest(sourcePath, staged, {
			sourceHardlinks: options.sourceHardlinks ?? "allow",
			...rejectHardlinks ? { budget: { discovered: 1 } } : {}
		});
		unregisterStaged.setIdentity(await fs$1.lstat(staged, { bigint: true }));
		await assertCopyDestinationOutsideSource(sourcePath, targetPath);
		await guardedRename({
			from: staged,
			to: targetPath
		});
		stagedCommitted = true;
		unregisterStaged();
		if (await cleanupCopiedEntry(sourcePath, manifest) === "stale") throw sourceChangedError(sourcePath);
	} finally {
		if (!stagedCommitted) {
			try {
				const stagedIdentity = await fs$1.lstat(staged, { bigint: true });
				if (!stagedIdentity.isSymbolicLink()) unregisterStaged.setIdentity(stagedIdentity);
			} catch (error) {
				if (error.code === "ENOENT") unregisterStaged();
			}
			try {
				await fs$1.rm(staged, {
					recursive: true,
					force: true
				});
				unregisterStaged();
			} catch {}
		}
	}
}
//#endregion
export { movePathWithCopyFallback as t };
