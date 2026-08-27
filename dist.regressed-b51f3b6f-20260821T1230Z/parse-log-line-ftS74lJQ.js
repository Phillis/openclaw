import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
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
			module: typeof parsed.module === "string" ? parsed.module : void 0
		};
	} catch {
		return {};
	}
}
function resolveContext(value, meta) {
	const metadataContext = parseMetaName(meta?.name);
	if (metadataContext.subsystem || metadataContext.module) return metadataContext;
	return parseMetaName(value["0"]);
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
			message: typeof parsed.message === "string" ? parsed.message : extractMessage(parsed),
			raw
		};
	} catch {
		return null;
	}
}
//#endregion
export { parseLogLine as t };
