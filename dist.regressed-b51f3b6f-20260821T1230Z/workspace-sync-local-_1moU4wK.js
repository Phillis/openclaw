import { n as hasNodeErrorCode } from "./path-D138yf8v.js";
import "./path-guards-fBZukd5S.js";
import { n as runWorkspaceInventoryCommandToFile, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-Do6ryAmJ.js";
import { createReadStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-sync-local.ts
function validateGitRelativePath(file) {
	if (!file || path.posix.isAbsolute(file) || path.posix.normalize(file) !== file || file === ".." || file.startsWith("../")) throw new Error("Worker workspace git file list contains an unsafe path");
	return file;
}
async function* readNulFile(filePath) {
	let pending = Buffer.alloc(0);
	for await (const value of createReadStream(filePath)) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		const buffer = pending.length === 0 ? chunk : Buffer.concat([pending, chunk]);
		let offset = 0;
		for (;;) {
			const separator = buffer.indexOf(0, offset);
			if (separator < 0) break;
			yield validateGitRelativePath(buffer.subarray(offset, separator).toString("utf8"));
			offset = separator + 1;
		}
		pending = Buffer.from(buffer.subarray(offset));
	}
	if (pending.length > 0) throw new Error("Worker workspace git file list is not NUL terminated");
}
async function readWorkspaceTransferPaths(filePath) {
	const paths = /* @__PURE__ */ new Set();
	for await (const entry of readNulFile(filePath)) paths.add(entry);
	return paths;
}
async function runLocalCommandToFile(params) {
	await runWorkspaceInventoryCommandToFile(params);
}
async function createGitTransferList(params) {
	return await createWorkspaceGitTransferList(params);
}
async function filterExistingGitTransferList(params) {
	const output = await fs$1.open(params.outputPath, "wx", 384);
	try {
		for await (const file of readNulFile(params.preparedListPath)) {
			const stats = await fs$1.lstat(path.join(params.gitRoot, file)).catch((error) => {
				if (hasNodeErrorCode(error, "ENOENT")) return;
				throw error;
			});
			if (stats?.isFile() || stats?.isSymbolicLink()) await output.writeFile(`${file}\0`);
		}
	} finally {
		await output.close();
	}
	return params.outputPath;
}
//#endregion
export { runLocalCommandToFile as i, filterExistingGitTransferList as n, readWorkspaceTransferPaths as r, createGitTransferList as t };
