import { n as assertSafePathPrefix } from "./safe-path-segment-C4hKsB9L.js";
import { d as createAsyncDirectoryGuard } from "./absolute-path-DBVN5h2m.js";
import { c as withAsyncDirectoryGuards, p as syncDirectoryBestEffort } from "./pinned-write-CKWgTqHs.js";
import { t as registerTempPathForExit } from "./temp-cleanup-Cr3s_L0p.js";
import { t as serializePathWrite } from "./write-queue-Cw9r0L36.js";
import { randomUUID } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region ../../../../../../openclaw/node_modules/@openclaw/fs-safe/dist/sibling-temp.js
function buildTempPath(dir, tempPrefix) {
	const safePrefix = assertSafePathPrefix(tempPrefix ?? ".fs-safe-stream", { label: "sibling temp prefix" });
	return path.join(dir, `${safePrefix}.${process.pid}.${randomUUID()}.tmp`);
}
async function syncFileBestEffort(filePath) {
	const handle = await fs.open(filePath, "r+");
	try {
		await handle.sync();
	} catch (error) {
		if (error.code !== "EPERM") throw error;
	} finally {
		await handle.close();
	}
}
function assertFinalPathIsSibling(dir, filePath) {
	const resolvedDir = path.resolve(dir);
	const resolvedFile = path.resolve(filePath);
	if (path.dirname(resolvedFile) !== resolvedDir) throw new Error("Final path must be in the sibling temp directory.");
}
async function writeSiblingTempFile(options) {
	const dir = path.resolve(options.dir);
	await fs.mkdir(dir, {
		recursive: true,
		mode: options.dirMode ?? 448
	});
	if (options.chmodDir !== false) await fs.chmod(dir, options.dirMode ?? 448).catch(() => void 0);
	const dirGuard = await createAsyncDirectoryGuard(dir);
	const tempPath = buildTempPath(dir, options.tempPrefix);
	const unregisterTempPath = registerTempPathForExit(tempPath);
	let tempExists = false;
	try {
		tempExists = true;
		const result = await options.writeTemp(tempPath);
		unregisterTempPath.setIdentity(await fs.lstat(tempPath));
		if (options.mode !== void 0) await fs.chmod(tempPath, options.mode).catch(() => void 0);
		if (options.syncTempFile) await syncFileBestEffort(tempPath);
		const filePath = path.resolve(options.resolveFinalPath(result));
		assertFinalPathIsSibling(dir, filePath);
		await serializePathWrite(filePath, async () => {
			await withAsyncDirectoryGuards([dirGuard], async () => {
				await fs.rename(tempPath, filePath);
			});
			tempExists = false;
			unregisterTempPath();
			if (options.mode !== void 0) await fs.chmod(filePath, options.mode).catch(() => void 0);
			if (options.syncParentDir) await syncDirectoryBestEffort(dir);
		});
		return {
			filePath,
			result
		};
	} finally {
		if (tempExists) await fs.rm(tempPath, { force: true }).catch(() => void 0);
		unregisterTempPath();
	}
}
//#endregion
export { writeSiblingTempFile as t };
