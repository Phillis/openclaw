import { t as asBoolean } from "./boolean-DmBL0YJK.js";
import { t as extractArchive } from "./archive-8JuAoUNj.js";
import { n as ARCHIVE_LIMIT_ERROR_CODE, r as ArchiveLimitError } from "./archive-zip-preflight-DGSqQDgP.js";
import "./archive-ZawvEmz-.js";
import { d as saveMediaBuffer } from "./store-CvNsGg9Z.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./media-store-BggRqAk6.js";
import { l as FILE_TRANSFER_SUBDIR, n as DIR_FETCH_HARD_MAX_BYTES, r as DIR_FETCH_TOOL_DESCRIPTOR, t as DIR_FETCH_DEFAULT_MAX_BYTES } from "./descriptors-DycDwW-G.js";
import { i as mimeFromExtension, t as IMAGE_MIME_INLINE_SET } from "./mime-Bmiz_ln2.js";
import { t as appendFileTransferAudit } from "./audit-BEpvsf3X.js";
import { i as readClampedInt, n as readRequiredNodePath, r as humanSize, t as invokeNodeToolPayload } from "./node-tool-invoke-Dnp5Ncfg.js";
import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/file-transfer/src/tools/dir-fetch-tool.ts
const MEDIA_URL_CAP = 25;
const TAR_UNPACK_TIMEOUT_MS = 6e4;
const TAR_UNPACK_MAX_ENTRIES = 5e3;
const DIR_FETCH_MAX_UNCOMPRESSED_BYTES = 64 * 1024 * 1024;
const DIR_FETCH_MAX_SINGLE_FILE_BYTES = 16 * 1024 * 1024;
function filterDirFetchArchiveEntry(entry) {
	return (entry.kind === "file" || entry.kind === "directory") && !entry.path.includes("\\") ? "extract" : "skip";
}
function classifyArchiveFailure(error) {
	const reason = error instanceof Error ? error.message : String(error);
	if (error instanceof ArchiveLimitError && error.code !== ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT) return {
		auditCode: "TREE_TOO_LARGE",
		publicCode: "UNCOMPRESSED_TOO_LARGE",
		reason
	};
	return {
		auditCode: "UNSAFE_ARCHIVE",
		publicCode: "UNSAFE_ARCHIVE",
		reason
	};
}
async function computeFileSha256(filePath) {
	const hash = crypto.createHash("sha256");
	const handle = await fs.open(filePath, "r");
	try {
		const chunkSize = 64 * 1024;
		const buf = Buffer.allocUnsafe(chunkSize);
		while (true) {
			const { bytesRead } = await handle.read(buf, 0, chunkSize, null);
			if (bytesRead === 0) break;
			hash.update(buf.subarray(0, bytesRead));
		}
	} finally {
		await handle.close();
	}
	return hash.digest("hex");
}
/**
* Walk a directory recursively, collecting file entries (skips directories).
* Skips symlinks — we don't want to follow links the archive might have
* carried in. Files only.
*/
async function walkDir(dir, rootDir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const results = [];
	for (const entry of entries) {
		const absPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			const nested = await walkDir(absPath, rootDir);
			results.push(...nested);
		} else if (entry.isFile()) {
			const relPath = path.relative(rootDir, absPath);
			results.push({
				relPath,
				absPath
			});
		}
	}
	return results;
}
function createDirFetchTool() {
	return {
		...DIR_FETCH_TOOL_DESCRIPTOR,
		execute: async (_toolCallId, args) => {
			const params = args;
			const { node, requestedPath: dirPath } = readRequiredNodePath(params);
			const { nodeId, nodeDisplayName, payload, startedAt } = await invokeNodeToolPayload({
				node,
				params,
				command: "dir.fetch",
				commandParams: {
					path: dirPath,
					maxBytes: readClampedInt({
						input: params,
						key: "maxBytes",
						defaultValue: DIR_FETCH_DEFAULT_MAX_BYTES,
						hardMin: 1,
						hardMax: DIR_FETCH_HARD_MAX_BYTES
					}),
					includeDotfiles: asBoolean(params.includeDotfiles) ?? false
				},
				requestedPath: dirPath
			});
			const canonicalPath = typeof payload.path === "string" ? payload.path : "";
			const tarBase64 = typeof payload.tarBase64 === "string" ? payload.tarBase64 : "";
			const tarBytes = typeof payload.tarBytes === "number" ? payload.tarBytes : -1;
			const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
			const fileCount = typeof payload.fileCount === "number" ? payload.fileCount : 0;
			if (!canonicalPath || !tarBase64 || tarBytes < 0 || !sha256) throw new Error("invalid dir.fetch payload (missing fields)");
			const tarBuffer = Buffer.from(tarBase64, "base64");
			if (tarBuffer.byteLength !== tarBytes) throw new Error(`dir.fetch size mismatch: payload says ${tarBytes} bytes, decoded ${tarBuffer.byteLength}`);
			if (crypto.createHash("sha256").update(tarBuffer).digest("hex") !== sha256) throw new Error("dir.fetch sha256 mismatch (integrity failure)");
			const savedTar = await saveMediaBuffer(tarBuffer, "application/gzip", FILE_TRANSFER_SUBDIR, DIR_FETCH_HARD_MAX_BYTES);
			const tarDir = path.dirname(savedTar.path);
			const unpackId = `dir-fetch-${path.basename(savedTar.path, path.extname(savedTar.path))}`;
			const rootDir = path.join(tarDir, unpackId);
			await fs.mkdir(rootDir, {
				recursive: true,
				mode: 448
			});
			try {
				await extractArchive({
					archivePath: savedTar.path,
					destDir: rootDir,
					kind: "tar",
					tarGzip: true,
					timeoutMs: TAR_UNPACK_TIMEOUT_MS,
					entryModes: "clamp",
					entryFilter: filterDirFetchArchiveEntry,
					onFiltered: "reject-archive",
					limits: {
						maxArchiveBytes: DIR_FETCH_HARD_MAX_BYTES,
						maxEntries: TAR_UNPACK_MAX_ENTRIES,
						maxExtractedBytes: DIR_FETCH_MAX_UNCOMPRESSED_BYTES,
						maxEntryBytes: DIR_FETCH_MAX_SINGLE_FILE_BYTES
					}
				});
			} catch (error) {
				await Promise.all([fs.rm(rootDir, {
					recursive: true,
					force: true
				}).catch(() => void 0), fs.rm(savedTar.path, { force: true }).catch(() => void 0)]);
				const failure = classifyArchiveFailure(error);
				await appendFileTransferAudit({
					op: "dir.fetch",
					nodeId,
					nodeDisplayName,
					requestedPath: dirPath,
					canonicalPath,
					decision: "error",
					errorCode: failure.auditCode,
					errorMessage: failure.reason,
					sizeBytes: tarBytes,
					sha256,
					durationMs: Date.now() - startedAt
				});
				throw new Error(`dir.fetch ${failure.publicCode}: ${failure.reason}`, { cause: error });
			}
			const walked = await walkDir(rootDir, rootDir);
			const files = [];
			for (const { relPath, absPath } of walked) {
				let size;
				try {
					size = (await fs.stat(absPath)).size;
				} catch {
					continue;
				}
				const mimeType = mimeFromExtension(relPath);
				const fileSha256 = await computeFileSha256(absPath);
				files.push({
					relPath,
					size,
					mimeType,
					sha256: fileSha256,
					localPath: absPath
				});
			}
			const imageFiles = files.filter((f) => IMAGE_MIME_INLINE_SET.has(f.mimeType));
			const nonImageFiles = files.filter((f) => !IMAGE_MIME_INLINE_SET.has(f.mimeType));
			const allOrdered = [...imageFiles, ...nonImageFiles];
			const droppedFromMedia = Math.max(0, allOrdered.length - MEDIA_URL_CAP);
			const mediaUrls = allOrdered.slice(0, MEDIA_URL_CAP).map((f) => f.localPath);
			const shortHash = sha256.slice(0, 12);
			const mediaNote = droppedFromMedia ? ` (channel attaches first ${MEDIA_URL_CAP}; ${droppedFromMedia} more in details.files)` : "";
			const summaryText = `Fetched ${fileCount} files from ${canonicalPath} (${humanSize(tarBytes)} compressed, sha256:${shortHash}) — saved on the gateway under ${rootDir}/${mediaNote}`;
			await appendFileTransferAudit({
				op: "dir.fetch",
				nodeId,
				nodeDisplayName,
				requestedPath: dirPath,
				canonicalPath,
				decision: "allowed",
				sizeBytes: tarBytes,
				sha256,
				durationMs: Date.now() - startedAt
			});
			return {
				content: [{
					type: "text",
					text: summaryText
				}],
				details: {
					path: canonicalPath,
					rootDir,
					fileCount,
					tarBytes,
					sha256,
					files,
					media: { mediaUrls }
				}
			};
		}
	};
}
//#endregion
export { createDirFetchTool };
