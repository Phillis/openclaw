import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { d as redactSensitiveLines, g as resolveRedactOptions } from "./redact-CWP17HFN.js";
import { n as clamp } from "./utils-Bw16L5tB.js";
import { r as isMissingPathError } from "./errno-CkbDOfLk.js";
import { g as isSameRollingLogFileFamily, h as isRollingLogFilePath, m as getResolvedLoggerFileTarget } from "./logger-ij8OHrrv.js";
import { t as readFileWindowFully } from "./file-read-DtMn74uz.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/logging/parse-log-line.ts
function extractMessage(value) {
	const parts = [];
	for (const key of Object.keys(value)) {
		if (!/^\d+$/.test(key)) continue;
		const item = value[key];
		if (typeof item === "string") parts.push(item);
		else if (item != null) parts.push(JSON.stringify(item));
	}
	return parts.join(" ");
}
function parseMetaName(raw) {
	if (typeof raw !== "string") return {};
	try {
		const parsed = JSON.parse(raw);
		return {
			subsystem: typeof parsed.subsystem === "string" ? parsed.subsystem : void 0,
			module: typeof parsed.module === "string" ? parsed.module : void 0,
			plugin: typeof parsed.plugin === "string" ? parsed.plugin : void 0
		};
	} catch {
		return {};
	}
}
function resolveContext(value, meta) {
	const metadataContext = parseMetaName(meta?.name);
	const positionalContext = parseMetaName(value["0"]);
	return {
		subsystem: metadataContext.subsystem ?? positionalContext.subsystem,
		module: metadataContext.module ?? positionalContext.module,
		plugin: metadataContext.plugin ?? positionalContext.plugin
	};
}
/** Parses a raw log line into compact metadata and message text, or null for non-JSON lines. */
function parseLogLine(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed)) return null;
		const meta = isRecord(parsed["_meta"]) ? parsed["_meta"] : void 0;
		const context = resolveContext(parsed, meta);
		const levelRaw = typeof meta?.logLevelName === "string" ? meta.logLevelName : void 0;
		return {
			time: typeof parsed.time === "string" ? parsed.time : typeof meta?.date === "string" ? meta.date : void 0,
			level: normalizeOptionalLowercaseString(levelRaw),
			subsystem: context.subsystem,
			module: context.module,
			plugin: context.plugin,
			message: typeof parsed.message === "string" ? parsed.message : extractMessage(parsed),
			raw
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/logging/log-tail.ts
const DEFAULT_LIMIT = 500;
const DEFAULT_MAX_BYTES = 25e4;
const MAX_LIMIT = 5e3;
const MAX_BYTES = 1e6;
function missingPathToNull(error) {
	if (!isMissingPathError(error)) throw error;
	return null;
}
/** Resolves a rolling daily log path to the newest existing rolling log when needed. */
async function resolveLogFile(file, options) {
	if (await fs.stat(file).catch(missingPathToNull)) return file;
	if (!(options?.rolling ?? isRollingLogFilePath(file))) return file;
	const dir = path.dirname(file);
	const entries = await fs.readdir(dir, { withFileTypes: true }).catch(missingPathToNull);
	if (!entries) return file;
	return (await Promise.all(entries.filter((entry) => entry.isFile() && isSameRollingLogFileFamily(file, entry.name)).map(async (entry) => {
		const fullPath = path.join(dir, entry.name);
		const fileStat = await fs.stat(fullPath).catch(missingPathToNull);
		return fileStat ? {
			path: fullPath,
			mtimeMs: fileStat.mtimeMs
		} : null;
	}))).filter((entry) => Boolean(entry)).toSorted((a, b) => b.mtimeMs - a.mtimeMs)[0]?.path ?? file;
}
async function readLogSlice(params) {
	const stat = await fs.stat(params.file).catch(missingPathToNull);
	if (!stat) return {
		cursor: 0,
		size: 0,
		lines: [],
		truncated: false,
		reset: false
	};
	const size = stat.size;
	const maxBytes = clamp(params.maxBytes, 1, MAX_BYTES);
	const limit = clamp(params.limit, 1, MAX_LIMIT);
	let cursor = typeof params.cursor === "number" && Number.isFinite(params.cursor) ? Math.max(0, Math.floor(params.cursor)) : void 0;
	let reset = false;
	let truncated = false;
	let start;
	if (cursor != null) if (cursor > size) {
		reset = true;
		start = Math.max(0, size - maxBytes);
		truncated = start > 0;
	} else {
		start = cursor;
		if (size - start > maxBytes) {
			reset = true;
			truncated = true;
			start = Math.max(0, size - maxBytes);
		}
	}
	else {
		start = Math.max(0, size - maxBytes);
		truncated = start > 0;
	}
	if (size === 0 || size <= start) return {
		cursor: size,
		size,
		lines: [],
		truncated,
		reset
	};
	const handle = await fs.open(params.file, "r");
	try {
		let prefix = "";
		if (start > 0) {
			const prefixBuf = Buffer.alloc(1);
			const prefixRead = await handle.read(prefixBuf, 0, 1, start - 1);
			prefix = prefixBuf.toString("utf8", 0, prefixRead.bytesRead);
		}
		const length = Math.max(0, size - start);
		const buffer = Buffer.alloc(length);
		const bytesRead = await readFileWindowFully(handle, buffer, start);
		const text = buffer.toString("utf8", 0, bytesRead);
		let lines = text.split("\n");
		lines = lines.slice(0, -1);
		if (start > 0 && prefix !== "\n") lines = lines.slice(1);
		if (params.filter) lines = lines.filter(params.filter);
		if (lines.length > limit) {
			truncated = true;
			lines = lines.slice(lines.length - limit);
		}
		const lastNewline = buffer.subarray(0, bytesRead).lastIndexOf(10);
		cursor = text.endsWith("\n") ? size : start + lastNewline + 1;
		return {
			cursor,
			size,
			lines,
			truncated,
			reset
		};
	} finally {
		await handle.close();
	}
}
/** Reads and redacts the configured log tail with bounded bytes and line count. */
async function readConfiguredLogTail(params, filter) {
	const target = getResolvedLoggerFileTarget();
	const file = await resolveLogFile(target.file, { rolling: target.rolling });
	const result = await readLogSlice({
		file,
		cursor: params?.cursor,
		limit: params?.limit ?? DEFAULT_LIMIT,
		maxBytes: params?.maxBytes ?? DEFAULT_MAX_BYTES,
		filter
	});
	const redaction = resolveRedactOptions();
	return {
		file,
		...result,
		lines: redactSensitiveLines(result.lines, redaction)
	};
}
/** Reads the canonical configured tail and parses its already-redacted lines. */
async function readConfiguredParsedLogTail(params) {
	const tail = await readConfiguredLogTail(params, (raw) => {
		const parsed = parseLogLine(raw);
		return parsed !== null && (params?.filter?.(parsed) ?? true);
	});
	return {
		...tail,
		lines: tail.lines.flatMap((line) => {
			const parsed = parseLogLine(line);
			return parsed ? [parsed] : [];
		})
	};
}
//#endregion
export { readConfiguredParsedLogTail as n, parseLogLine as r, readConfiguredLogTail as t };
