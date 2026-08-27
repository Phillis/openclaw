import { r as readRegularFile } from "./regular-file-Dwz6p59y.js";
import { n as extractErrorCode } from "./errors-Ccx0R-_Z.js";
import { t as replaceFileAtomic } from "./replace-file-CLSCJ1qR.js";
import "./error-runtime-CmA1H4Zg.js";
import "./security-runtime-qrFVi6LG.js";
import { t as replaceManagedMarkdownBlock } from "./memory-host-markdown-mHNl3RAL.js";
import { o as withMemoryWorkspaceLock } from "./memory-workspace-lock-BGmos1BO.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/memory-core/src/dreaming-dreams-file.ts
const DREAMS_FILENAMES = ["DREAMS.md", "dreams.md"];
const DEEP_START_MARKER = "<!-- openclaw:dreaming:deep:start -->";
const DEEP_END_MARKER = "<!-- openclaw:dreaming:deep:end -->";
async function resolveDreamsPath(workspaceDir) {
	for (const name of DREAMS_FILENAMES) {
		const target = path.join(workspaceDir, name);
		try {
			await fs.access(target);
			return target;
		} catch (err) {
			if (extractErrorCode(err) !== "ENOENT") throw err;
		}
	}
	return path.join(workspaceDir, DREAMS_FILENAMES[0]);
}
function isEmptyDreamsReadError(err) {
	const code = extractErrorCode(err);
	if (code === "ENOENT" || code === "ENOTDIR" || code === "not-found" || code === "not-file" || code === "path-alias" || code === "path-mismatch" || code === "symlink") return true;
	return err instanceof Error && err.message === "path must be a regular file";
}
async function readDreamsFile(dreamsPath) {
	try {
		return (await readRegularFile({ filePath: dreamsPath })).buffer.toString("utf-8");
	} catch (err) {
		if (isEmptyDreamsReadError(err)) return "";
		throw err;
	}
}
async function assertSafeDreamsPath(dreamsPath) {
	const stat = await fs.lstat(dreamsPath).catch((err) => {
		if (extractErrorCode(err) === "ENOENT") return null;
		throw err;
	});
	if (!stat) return;
	if (stat.isSymbolicLink()) throw new Error("Refusing to write symlinked DREAMS.md");
	if (!stat.isFile()) throw new Error("Refusing to write non-file DREAMS.md");
}
async function writeDreamsFileAtomic(dreamsPath, content) {
	await assertSafeDreamsPath(dreamsPath);
	await replaceFileAtomic({
		filePath: dreamsPath,
		content,
		mode: 384,
		preserveExistingMode: true,
		tempPrefix: `${path.basename(dreamsPath)}.dreams`,
		throwOnCleanupError: true
	});
}
async function updateDreamsFile(params) {
	return await withMemoryWorkspaceLock(params.workspaceDir, async () => {
		const dreamsPath = await resolveDreamsPath(params.workspaceDir);
		await fs.mkdir(path.dirname(dreamsPath), { recursive: true });
		const existing = await readDreamsFile(dreamsPath);
		const { content, result, shouldWrite = true } = await params.updater(existing, dreamsPath);
		if (shouldWrite) await writeDreamsFileAtomic(dreamsPath, content.endsWith("\n") ? content : `${content}\n`);
		return result;
	});
}
async function updateDeepDreamsFile(params) {
	const body = params.bodyLines.length > 0 ? params.bodyLines.join("\n") : "- No durable changes.";
	return await updateDreamsFile({
		workspaceDir: params.workspaceDir,
		updater: (existing, dreamsPath) => ({
			content: replaceManagedMarkdownBlock({
				original: existing,
				heading: "## Deep Sleep",
				startMarker: DEEP_START_MARKER,
				endMarker: DEEP_END_MARKER,
				body
			}),
			result: dreamsPath
		})
	});
}
//#endregion
export { updateDreamsFile as i, resolveDreamsPath as n, updateDeepDreamsFile as r, readDreamsFile as t };
