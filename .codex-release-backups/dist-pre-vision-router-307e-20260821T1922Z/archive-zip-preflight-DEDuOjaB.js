import { n as ArchiveSecurityError, t as ArchiveFormatError } from "./archive-errors-yA0gvFwU.js";
import { Transform } from "node:stream";
//#region node_modules/@openclaw/fs-safe/dist/archive-limits.js
const DEFAULT_MAX_ARCHIVE_BYTES_ZIP = 256 * 1024 * 1024;
const DEFAULT_MAX_ENTRIES = 5e4;
const DEFAULT_MAX_EXTRACTED_BYTES = 512 * 1024 * 1024;
const DEFAULT_MAX_ENTRY_BYTES = 256 * 1024 * 1024;
const DEFAULT_MAX_META_ENTRY_BYTES = 1024 * 1024;
const ARCHIVE_LIMIT_ERROR_CODE = {
	ARCHIVE_SIZE_EXCEEDS_LIMIT: "archive-size-exceeds-limit",
	ENTRY_COUNT_EXCEEDS_LIMIT: "archive-entry-count-exceeds-limit",
	ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT: "archive-entry-extracted-size-exceeds-limit",
	EXTRACTED_SIZE_EXCEEDS_LIMIT: "archive-extracted-size-exceeds-limit",
	META_ENTRY_SIZE_EXCEEDS_LIMIT: "archive-meta-entry-size-exceeds-limit",
	MANIFEST_SIZE_EXCEEDS_LIMIT: "archive-manifest-size-exceeds-limit",
	ENTRY_PATH_COMPONENTS_EXCEEDS_LIMIT: "archive-entry-path-components-exceeds-limit"
};
const ARCHIVE_LIMIT_ERROR_MESSAGE = {
	[ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT]: "archive size exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT]: "archive entry count exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT]: "archive entry extracted size exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.EXTRACTED_SIZE_EXCEEDS_LIMIT]: "archive extracted size exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.META_ENTRY_SIZE_EXCEEDS_LIMIT]: "archive metadata entry size exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.MANIFEST_SIZE_EXCEEDS_LIMIT]: "archive manifest size exceeds limit",
	[ARCHIVE_LIMIT_ERROR_CODE.ENTRY_PATH_COMPONENTS_EXCEEDS_LIMIT]: "archive entry path components exceed limit"
};
var ArchiveLimitError = class extends Error {
	code;
	constructor(code) {
		super(ARCHIVE_LIMIT_ERROR_MESSAGE[code]);
		this.name = "ArchiveLimitError";
		this.code = code;
	}
};
function clampLimit(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return;
	const v = Math.floor(value);
	return v >= 0 ? v : void 0;
}
function resolveExtractLimits(limits) {
	return {
		maxArchiveBytes: clampLimit(limits?.maxArchiveBytes) ?? 268435456,
		maxEntries: clampLimit(limits?.maxEntries) ?? 5e4,
		maxExtractedBytes: clampLimit(limits?.maxExtractedBytes) ?? 536870912,
		maxEntryBytes: clampLimit(limits?.maxEntryBytes) ?? 268435456,
		maxMetaEntryBytes: clampLimit(limits?.maxMetaEntryBytes) ?? 1048576,
		maxEntryPathComponents: clampLimit(limits?.maxEntryPathComponents) ?? 256
	};
}
function assertArchiveEntryPathComponentsWithinLimit(entryPath, limits) {
	if (entryPath.split(/[\\/]+/u).filter((component) => component.length > 0 && component !== ".").length > limits.maxEntryPathComponents) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_PATH_COMPONENTS_EXCEEDS_LIMIT);
}
function assertArchiveEntryCountWithinLimit(entryCount, limits) {
	if (entryCount > limits.maxEntries) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_COUNT_EXCEEDS_LIMIT);
}
function createByteBudgetTracker(limits) {
	let entryBytes = 0;
	let extractedBytes = 0;
	const addBytes = (bytes) => {
		const b = Math.max(0, Math.floor(bytes));
		if (b === 0) return;
		entryBytes += b;
		if (entryBytes > limits.maxEntryBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
		extractedBytes += b;
		if (extractedBytes > limits.maxExtractedBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.EXTRACTED_SIZE_EXCEEDS_LIMIT);
	};
	return {
		startEntry() {
			entryBytes = 0;
		},
		addBytes,
		addEntrySize(size) {
			const s = Math.max(0, Math.floor(size));
			if (s > limits.maxEntryBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT);
			addBytes(s);
		}
	};
}
function createExtractBudgetTransform(params) {
	return new Transform({ transform(chunk, _encoding, callback) {
		try {
			const buf = chunk instanceof Buffer ? chunk : Buffer.from(chunk);
			params.onChunkBytes(buf.byteLength);
			callback(null, buf);
		} catch (err) {
			callback(err instanceof Error ? err : new Error(String(err)));
		}
	} });
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-zip-preflight.js
const ZIP_EOCD_SIGNATURE = 101010256;
const ZIP64_EOCD_SIGNATURE = 101075792;
const ZIP64_EOCD_LOCATOR_SIGNATURE = 117853008;
const ZIP_EOCD_MIN_BYTES = 22;
const ZIP_EOCD_MAX_COMMENT_BYTES = 65535;
const ZIP64_ENTRY_COUNT_SENTINEL = 65535;
const ZIP64_UINT32_SENTINEL = 4294967295;
const ZIP_CENTRAL_FILE_HEADER_SIGNATURE = 33639248;
const ZIP_CENTRAL_FILE_HEADER_MIN_BYTES = 46;
const ZIP_CENTRAL_FILE_HEADER_NAME_LENGTH_OFFSET = 28;
const ZIP_CENTRAL_FILE_HEADER_EXTRA_LENGTH_OFFSET = 30;
const ZIP_CENTRAL_FILE_HEADER_COMMENT_LENGTH_OFFSET = 32;
const ZIP_EOCD_TOTAL_ENTRIES_OFFSET = 10;
const ZIP_EOCD_CENTRAL_DIRECTORY_SIZE_OFFSET = 12;
const ZIP_EOCD_CENTRAL_DIRECTORY_OFFSET_OFFSET = 16;
const ZIP_EOCD_COMMENT_LENGTH_OFFSET = 20;
const ZIP64_EOCD_LOCATOR_BYTES = 20;
const ZIP64_EOCD_OFFSET_OFFSET = 8;
const ZIP64_EOCD_TOTAL_ENTRIES_OFFSET = 32;
const ZIP64_EOCD_CENTRAL_DIRECTORY_SIZE_OFFSET = 40;
const ZIP64_EOCD_CENTRAL_DIRECTORY_OFFSET_OFFSET = 48;
function asBufferView(buffer) {
	if (Buffer.isBuffer(buffer)) return buffer;
	return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength);
}
function readSafeUInt64LE(buffer, offset) {
	const value = buffer.readBigUInt64LE(offset);
	if (value > BigInt(Number.MAX_SAFE_INTEGER)) return Number.MAX_SAFE_INTEGER;
	return Number(value);
}
function findZipEndOfCentralDirectory(buffer) {
	if (buffer.byteLength < ZIP_EOCD_MIN_BYTES) return -1;
	const minOffset = Math.max(0, buffer.byteLength - ZIP_EOCD_MIN_BYTES - ZIP_EOCD_MAX_COMMENT_BYTES);
	for (let offset = buffer.byteLength - ZIP_EOCD_MIN_BYTES; offset >= minOffset; offset -= 1) {
		if (buffer.readUInt32LE(offset) !== ZIP_EOCD_SIGNATURE) continue;
		const commentLength = buffer.readUInt16LE(offset + ZIP_EOCD_COMMENT_LENGTH_OFFSET);
		if (offset + ZIP_EOCD_MIN_BYTES + commentLength === buffer.byteLength) return offset;
	}
	return -1;
}
function readZip64CentralDirectoryInfo(buffer, eocdOffset) {
	const locatorOffset = eocdOffset - ZIP64_EOCD_LOCATOR_BYTES;
	if (locatorOffset < 0 || buffer.readUInt32LE(locatorOffset) !== ZIP64_EOCD_LOCATOR_SIGNATURE) return null;
	const zip64EocdOffset = readSafeUInt64LE(buffer, locatorOffset + ZIP64_EOCD_OFFSET_OFFSET);
	if (zip64EocdOffset < 0 || zip64EocdOffset + ZIP64_EOCD_CENTRAL_DIRECTORY_OFFSET_OFFSET + 8 > buffer.byteLength || buffer.readUInt32LE(zip64EocdOffset) !== ZIP64_EOCD_SIGNATURE) return null;
	return {
		declaredEntryCount: readSafeUInt64LE(buffer, zip64EocdOffset + ZIP64_EOCD_TOTAL_ENTRIES_OFFSET),
		centralDirectorySize: readSafeUInt64LE(buffer, zip64EocdOffset + ZIP64_EOCD_CENTRAL_DIRECTORY_SIZE_OFFSET),
		centralDirectoryOffset: readSafeUInt64LE(buffer, zip64EocdOffset + ZIP64_EOCD_CENTRAL_DIRECTORY_OFFSET_OFFSET),
		endOfCentralDirectoryOffset: eocdOffset
	};
}
function readZipCentralDirectoryInfo(buffer) {
	const eocdOffset = findZipEndOfCentralDirectory(buffer);
	if (eocdOffset < 0) return null;
	const declaredEntryCount = buffer.readUInt16LE(eocdOffset + ZIP_EOCD_TOTAL_ENTRIES_OFFSET);
	const centralDirectorySize = buffer.readUInt32LE(eocdOffset + ZIP_EOCD_CENTRAL_DIRECTORY_SIZE_OFFSET);
	const centralDirectoryOffset = buffer.readUInt32LE(eocdOffset + ZIP_EOCD_CENTRAL_DIRECTORY_OFFSET_OFFSET);
	if (declaredEntryCount === ZIP64_ENTRY_COUNT_SENTINEL || centralDirectorySize === ZIP64_UINT32_SENTINEL || centralDirectoryOffset === ZIP64_UINT32_SENTINEL) return readZip64CentralDirectoryInfo(buffer, eocdOffset) ?? {
		declaredEntryCount,
		centralDirectoryOffset,
		centralDirectorySize,
		endOfCentralDirectoryOffset: eocdOffset
	};
	return {
		declaredEntryCount,
		centralDirectoryOffset,
		centralDirectorySize,
		endOfCentralDirectoryOffset: eocdOffset
	};
}
function countZipCentralDirectoryHeaders(buffer, info) {
	const start = info.centralDirectoryOffset;
	const declaredEnd = start + info.centralDirectorySize;
	const scanEnd = info.endOfCentralDirectoryOffset;
	if (!Number.isSafeInteger(start) || !Number.isSafeInteger(declaredEnd) || !Number.isSafeInteger(scanEnd) || start < 0 || declaredEnd < start || scanEnd < start || scanEnd > buffer.byteLength) return null;
	let offset = start;
	let count = 0;
	while (offset < scanEnd) {
		if (scanEnd - offset < ZIP_CENTRAL_FILE_HEADER_MIN_BYTES) break;
		if (buffer.readUInt32LE(offset) !== ZIP_CENTRAL_FILE_HEADER_SIGNATURE) break;
		const nameLength = buffer.readUInt16LE(offset + ZIP_CENTRAL_FILE_HEADER_NAME_LENGTH_OFFSET);
		const extraLength = buffer.readUInt16LE(offset + ZIP_CENTRAL_FILE_HEADER_EXTRA_LENGTH_OFFSET);
		const commentLength = buffer.readUInt16LE(offset + ZIP_CENTRAL_FILE_HEADER_COMMENT_LENGTH_OFFSET);
		const nextOffset = offset + ZIP_CENTRAL_FILE_HEADER_MIN_BYTES + nameLength + extraLength + commentLength;
		if (nextOffset <= offset || nextOffset > scanEnd) return null;
		count += 1;
		offset = nextOffset;
	}
	return count > 0 || info.declaredEntryCount === 0 ? count : null;
}
function readZipCentralDirectoryEntryCount(buffer) {
	const view = asBufferView(buffer);
	const info = readZipCentralDirectoryInfo(view);
	if (!info) return null;
	const countedEntryCount = countZipCentralDirectoryHeaders(view, info);
	return countedEntryCount === null ? info.declaredEntryCount : Math.max(info.declaredEntryCount, countedEntryCount);
}
async function loadZipArchiveWithPreflight(buffer, limits) {
	const resolvedLimits = resolveExtractLimits(limits);
	if (buffer.byteLength > resolvedLimits.maxArchiveBytes) throw new ArchiveLimitError(ARCHIVE_LIMIT_ERROR_CODE.ARCHIVE_SIZE_EXCEEDS_LIMIT);
	const entryCount = readZipCentralDirectoryEntryCount(buffer);
	if (entryCount !== null) assertArchiveEntryCountWithinLimit(entryCount, resolvedLimits);
	const JSZip = await importOptionalJsZip();
	let archive;
	try {
		archive = await JSZip.loadAsync(buffer);
	} catch (error) {
		throw new ArchiveFormatError(`invalid ZIP archive: ${error instanceof Error ? error.message : String(error)}`, { cause: error instanceof Error ? error : void 0 });
	}
	if (entryCount !== null && Object.keys(archive.files).length !== entryCount) throw new ArchiveSecurityError("entry-path", "zip archive contains duplicate or colliding entry names");
	return archive;
}
async function importOptionalJsZip() {
	try {
		const module = await import("jszip");
		const candidate = typeof module === "function" ? module : module.default;
		if (typeof candidate !== "object" && typeof candidate !== "function" || candidate === null || typeof candidate.loadAsync !== "function") throw new Error("Optional archive dependency \"jszip\" does not expose loadAsync().");
		return candidate;
	} catch (err) {
		throw missingOptionalArchiveDependencyError("jszip", err);
	}
}
function missingOptionalArchiveDependencyError(packageName, cause) {
	return new Error(`Optional archive dependency "${packageName}" is not installed. Install it to use ZIP archive helpers from @openclaw/fs-safe/archive.`, { cause });
}
//#endregion
export { DEFAULT_MAX_ENTRIES as a, DEFAULT_MAX_META_ENTRY_BYTES as c, createByteBudgetTracker as d, createExtractBudgetTransform as f, DEFAULT_MAX_ARCHIVE_BYTES_ZIP as i, assertArchiveEntryCountWithinLimit as l, ARCHIVE_LIMIT_ERROR_CODE as n, DEFAULT_MAX_ENTRY_BYTES as o, resolveExtractLimits as p, ArchiveLimitError as r, DEFAULT_MAX_EXTRACTED_BYTES as s, loadZipArchiveWithPreflight as t, assertArchiveEntryPathComponentsWithinLimit as u };
