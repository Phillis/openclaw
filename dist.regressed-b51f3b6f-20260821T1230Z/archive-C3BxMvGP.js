import { t as FsSafeError } from "./errors-CQDiIdj7.js";
import { r as readFileHandleBounded } from "./bounded-read-pTKvsUkY.js";
import { t as sameFileIdentity } from "./file-identity-BDCAnrmX.js";
import { t as getNativeBinding } from "./native-CIvGO3cR.js";
import { a as formatErrorDetail } from "./root-path-CsUfUJ7P.js";
import { t as tempFile } from "./temp-target-qaDePd9x.js";
import { n as ArchiveSecurityError, r as isArchiveFormatErrorMessage, t as ArchiveFormatError } from "./archive-errors-yA0gvFwU.js";
import { o as validateArchiveEntryPath, r as normalizeArchiveEntryPath } from "./archive-entry-DulHWXJZ.js";
import { a as createZipIntegrityTransform, c as readTarEntryInfo, i as normalizeTarParserError, n as preflightTarMetadata, o as normalizeZipIntegrityError, r as importOptionalTar } from "./archive--_gEF4h0.js";
import { a as DEFAULT_MAX_ENTRIES, c as DEFAULT_MAX_META_ENTRY_BYTES, i as DEFAULT_MAX_ARCHIVE_BYTES_ZIP, n as ARCHIVE_LIMIT_ERROR_CODE, r as ArchiveLimitError, t as loadZipArchiveWithPreflight } from "./archive-zip-preflight-DEDuOjaB.js";
import { t as resolveArchiveKind } from "./archive-C_u9XKKj.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import { Readable } from "node:stream";
//#region node_modules/@openclaw/fs-safe/dist/archive-read.js
const ZIP_UNIX_FILE_TYPE_MASK = 61440;
const ZIP_UNIX_SYMLINK_TYPE = 40960;
function normalizedRequestedEntry(entryPath) {
	validateArchiveEntryPath(entryPath, { escapeLabel: "archive root" });
	const normalized = normalizeArchiveEntryPath(entryPath).replace(/^\.\//, "");
	if (!normalized || normalized.endsWith("/")) throw new Error(`archive entry is not a file: ${formatErrorDetail(entryPath)}`);
	return normalized;
}
async function readStreamBounded(stream, maxBytes) {
	if (!(Symbol.asyncIterator in Object(stream))) return await new Promise((resolve, reject) => {
		const readable = stream;
		const chunks = [];
		let total = 0;
		readable.on("data", (chunk) => {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			total += buffer.length;
			if (total > maxBytes) {
				readable.pause();
				reject(new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT));
				return;
			}
			chunks.push(buffer);
		});
		readable.once("end", () => resolve(Buffer.concat(chunks, total)));
		readable.once("error", reject);
	});
	const chunks = [];
	let total = 0;
	for await (const chunk of stream) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		total += buffer.length;
		if (total > maxBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
		chunks.push(buffer);
	}
	return Buffer.concat(chunks, total);
}
async function stageArchiveInput(archivePath) {
	const resolved = await fs$1.realpath(archivePath);
	const before = await fs$1.lstat(archivePath);
	if (before.isSymbolicLink() || !before.isFile()) throw new Error(`archive is not a regular file: ${archivePath}`);
	const noFollow = process.platform !== "win32" && typeof fs.constants.O_NOFOLLOW === "number" ? fs.constants.O_NOFOLLOW : 0;
	const handle = await fs$1.open(resolved, fs.constants.O_RDONLY | noFollow);
	const staged = await tempFile({
		prefix: "fs-safe-archive-read",
		fileName: "archive.bin"
	});
	try {
		const opened = await handle.stat();
		const current = await fs$1.lstat(resolved);
		if (!opened.isFile() || !current.isFile() || !sameFileIdentity(before, opened) || !sameFileIdentity(current, opened)) throw new Error("archive changed during validation");
		const buffer = await readFileHandleBounded(handle, DEFAULT_MAX_ARCHIVE_BYTES_ZIP);
		await fs$1.writeFile(staged.path, buffer, {
			flag: "wx",
			mode: 384
		});
		return {
			path: staged.path,
			buffer,
			cleanup: staged.cleanup
		};
	} catch (error) {
		await staged.cleanup().catch(() => void 0);
		throw error;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
async function readZipEntry(buffer, entryPath, maxBytes) {
	const entry = (await loadZipArchiveWithPreflight(buffer, {
		maxArchiveBytes: DEFAULT_MAX_ARCHIVE_BYTES_ZIP,
		maxEntryBytes: maxBytes,
		maxExtractedBytes: maxBytes
	})).files[entryPath];
	if (!entry || entry.dir) throw new Error(`archive entry not found: ${formatErrorDetail(entryPath)}`);
	if (typeof entry.unixPermissions === "number" && (entry.unixPermissions & ZIP_UNIX_FILE_TYPE_MASK) === ZIP_UNIX_SYMLINK_TYPE) throw new Error(`archive entry is a link: ${formatErrorDetail(entryPath)}`);
	const stream = typeof entry.nodeStream === "function" ? entry.nodeStream() : Readable.from(await entry.async("nodebuffer"));
	const integrity = createZipIntegrityTransform(entry);
	stream.once("error", (error) => integrity.destroy(normalizeZipIntegrityError(error)));
	return await readStreamBounded(stream.pipe(integrity), maxBytes);
}
async function readTarEntry(archivePath, entryPath, maxBytes) {
	const tar = await importOptionalTar();
	await preflightTarMetadata({
		archivePath,
		maxMetaEntryBytes: DEFAULT_MAX_META_ENTRY_BYTES
	});
	let matched;
	let entryError;
	const seenPaths = /* @__PURE__ */ new Set();
	try {
		await tar.t({
			file: archivePath,
			strict: true,
			maxMetaEntrySize: DEFAULT_MAX_META_ENTRY_BYTES,
			onReadEntry(entry) {
				const info = readTarEntryInfo(entry);
				validateArchiveEntryPath(info.path, { escapeLabel: "archive root" });
				const normalized = normalizeArchiveEntryPath(info.path).replace(/^\.\//, "");
				if (seenPaths.has(normalized)) {
					entryError ??= new ArchiveSecurityError("entry-path", `archive contains duplicate entry path: ${formatErrorDetail(normalized)}`);
					entry.resume();
					return;
				}
				seenPaths.add(normalized);
				if (normalized !== entryPath) {
					entry.resume();
					return;
				}
				if (info.type !== "File" && info.type !== "OldFile" && info.type !== "ContiguousFile") {
					entryError ??= /* @__PURE__ */ new Error(`archive entry is not a file: ${formatErrorDetail(entryPath)}`);
					entry.resume();
					return;
				}
				if (info.size > maxBytes) {
					entryError ??= new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
					entry.resume();
					return;
				}
				matched = readStreamBounded(entry, maxBytes);
			}
		});
	} catch (error) {
		throw normalizeTarParserError(error);
	}
	if (entryError) throw entryError;
	if (!matched) throw new Error(`archive entry not found: ${formatErrorDetail(entryPath)}`);
	return await matched;
}
async function readArchiveEntry(archivePath, entryPath, options) {
	if (!Number.isSafeInteger(options.maxBytes) || options.maxBytes < 0) throw new RangeError("maxBytes must be a non-negative safe integer");
	const kind = options.kind ?? resolveArchiveKind(archivePath);
	if (!kind) throw new Error(`unsupported archive: ${archivePath}`);
	const requestedEntry = normalizedRequestedEntry(entryPath);
	const staged = await stageArchiveInput(archivePath);
	try {
		const native = getNativeBinding();
		if (native) try {
			const signal = new AbortController().signal;
			const manifest = await native.inspectArchiveNative(staged.path, kind, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_META_ENTRY_BYTES, DEFAULT_MAX_ARCHIVE_BYTES_ZIP, signal);
			let rawEntryPath;
			const seenPaths = /* @__PURE__ */ new Set();
			for (const entry of manifest) {
				validateArchiveEntryPath(entry.path, { escapeLabel: "archive root" });
				const normalized = normalizeArchiveEntryPath(entry.path).replace(/^\.\//, "");
				if (seenPaths.has(normalized)) throw new ArchiveSecurityError("entry-path", `archive contains duplicate entry path: ${formatErrorDetail(normalized)}`);
				seenPaths.add(normalized);
				if (normalized === requestedEntry) {
					if (entry.kind !== "file") throw new Error(`archive entry is not a file: ${formatErrorDetail(entryPath)}`);
					rawEntryPath = entry.path;
				}
			}
			if (!rawEntryPath) throw new Error(`archive entry not found: ${formatErrorDetail(entryPath)}`);
			return await native.readArchiveEntryNative(staged.path, kind, rawEntryPath, options.maxBytes, DEFAULT_MAX_ENTRIES, DEFAULT_MAX_META_ENTRY_BYTES, signal);
		} catch (error) {
			if (error instanceof Error && error.message.includes(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT)) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
			if (error instanceof Error && isArchiveFormatErrorMessage(error.message)) throw new ArchiveFormatError(error.message, { cause: error });
			throw error;
		}
		if (kind === "tar-zstd" || kind === "tar-bzip2") throw new FsSafeError("helper-unavailable", `${kind} archives require a supported bundled native binding`);
		return kind === "zip" ? await readZipEntry(staged.buffer, requestedEntry, options.maxBytes) : await readTarEntry(staged.path, requestedEntry, options.maxBytes);
	} finally {
		await staged.cleanup();
	}
}
//#endregion
export { readArchiveEntry as t };
