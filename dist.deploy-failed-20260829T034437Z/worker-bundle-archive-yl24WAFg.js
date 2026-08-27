import { a as hashWorkerBundleManifest, i as compareWorkerBundlePaths } from "./worker-bundle-hash-mYTNaYdm.js";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import * as tar from "tar";
//#region src/shared/worker-bundle-archive.ts
const MAX_ENTRY_PATH_LENGTH = 1024;
const MAX_ARCHIVE_DEPTH = 64;
const MAX_DECOMPRESSION_RATIO = 64;
function requireArchivePath(value) {
	if (!value || value.length > MAX_ENTRY_PATH_LENGTH || value.includes("\\") || value.includes("\0") || value.startsWith("/") || path.posix.normalize(value) !== value || value === ".." || value.startsWith("../")) throw new Error(`Invalid worker bundle archive path: ${value}`);
	return value;
}
async function hashFile(filePath) {
	const hash = createHash("sha256");
	const handle = await fs.open(filePath, "r");
	try {
		for await (const chunk of handle.createReadStream()) hash.update(chunk);
	} finally {
		await handle.close();
	}
	return hash.digest("hex");
}
async function readWorkerBundleArchiveManifest(tarballPath, limits) {
	const pending = [];
	const paths = /* @__PURE__ */ new Set();
	let expandedBytes = 0;
	await tar.list({
		file: tarballPath,
		strict: true,
		maxDepth: MAX_ARCHIVE_DEPTH,
		maxDecompressionRatio: MAX_DECOMPRESSION_RATIO,
		onReadEntry(entry) {
			const entryPath = requireArchivePath(entry.path);
			if (paths.has(entryPath)) throw new Error(`Duplicate worker bundle archive path: ${entryPath}`);
			paths.add(entryPath);
			if (paths.size > limits.maxEntries) throw new Error("Worker bundle archive exceeds its entry limit");
			if (!Number.isSafeInteger(entry.size) || entry.size < 0) throw new Error(`Invalid worker bundle archive size: ${entryPath}`);
			expandedBytes += entry.size;
			if (!Number.isSafeInteger(expandedBytes) || expandedBytes > limits.maxExpandedBytes) throw new Error("Worker bundle archive exceeds its expanded byte limit");
			const hash = createHash("sha256");
			const item = {
				path: entryPath,
				mode: entry.mode,
				headerSize: entry.size,
				actualSize: 0,
				type: entry.type
			};
			pending.push(item);
			entry.on("data", (chunk) => {
				item.actualSize += chunk.byteLength;
				hash.update(chunk);
			});
			entry.on("end", () => {
				item.sha256 = hash.digest("hex");
			});
			entry.on("error", (error) => {
				item.error = error instanceof Error ? error : new Error(String(error));
			});
		}
	});
	return pending.map((entry) => {
		if (entry.error) throw entry.error;
		if (entry.type !== "File" || entry.mode === void 0 || entry.actualSize !== entry.headerSize || entry.sha256 === void 0) throw new Error(`Invalid worker bundle tar entry: ${entry.path}`);
		return {
			path: entry.path,
			mode: process.platform === "win32" ? 448 : entry.mode,
			size: entry.actualSize,
			sha256: entry.sha256
		};
	}).toSorted((left, right) => compareWorkerBundlePaths(left.path, right.path));
}
async function readWorkerBundleDirectoryManifest(params) {
	const root = await fs.realpath(params.root);
	const entries = [];
	let totalBytes = 0;
	const visit = async (directory, relativeRoot) => {
		const children = await fs.readdir(directory, { withFileTypes: true });
		for (const child of children) {
			if (!relativeRoot && params.ignoreTopLevel?.has(child.name)) continue;
			const relative = requireArchivePath(relativeRoot ? `${relativeRoot}/${child.name}` : child.name);
			const absolute = path.join(directory, child.name);
			const stats = await fs.lstat(absolute);
			if (stats.isSymbolicLink()) throw new Error(`Worker bundle contains a symbolic link: ${relative}`);
			if (stats.isDirectory()) {
				await visit(absolute, relative);
				continue;
			}
			if (!stats.isFile()) throw new Error(`Worker bundle contains an unsupported entry: ${relative}`);
			totalBytes += stats.size;
			if (entries.length >= params.limits.maxEntries || !Number.isSafeInteger(totalBytes) || totalBytes > params.limits.maxExpandedBytes) throw new Error("Worker bundle directory exceeds its limits");
			entries.push({
				path: relative,
				mode: process.platform === "win32" ? 448 : stats.mode & 511,
				size: stats.size,
				sha256: await hashFile(absolute)
			});
		}
	};
	await visit(root, "");
	return entries.toSorted((left, right) => compareWorkerBundlePaths(left.path, right.path));
}
async function extractWorkerBundleArchive(params) {
	const manifest = await readWorkerBundleArchiveManifest(params.tarballPath, params.limits);
	if (hashWorkerBundleManifest(manifest) !== params.expectedBundleHash) throw new Error("Worker bundle archive manifest does not match its expected hash");
	const allowed = new Set(manifest.map((entry) => entry.path));
	await fs.mkdir(params.destination, {
		recursive: true,
		mode: 448
	});
	await tar.extract({
		cwd: params.destination,
		file: params.tarballPath,
		strict: true,
		preservePaths: false,
		preserveOwner: false,
		noMtime: true,
		chmod: true,
		processUmask: 63,
		maxDepth: MAX_ARCHIVE_DEPTH,
		maxDecompressionRatio: MAX_DECOMPRESSION_RATIO,
		filter: (entryPath) => allowed.has(entryPath)
	});
	if (hashWorkerBundleManifest(await readWorkerBundleDirectoryManifest({
		root: params.destination,
		limits: params.limits
	})) !== params.expectedBundleHash) throw new Error("Extracted worker bundle does not match its expected hash");
}
//#endregion
export { readWorkerBundleArchiveManifest as n, readWorkerBundleDirectoryManifest as r, extractWorkerBundleArchive as t };
