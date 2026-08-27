import { c as redactSensitiveText, p as readLoggingConfig } from "./redact-Cl7lwBnl.js";
import { t as loggingState } from "./state-CNIDfzP9.js";
import { stripVTControlCharacters } from "node:util";
//#region src/logging/timestamps.ts
const validTimeZoneCache = /* @__PURE__ */ new Map();
const timestampFormatterCache = /* @__PURE__ */ new Map();
let hostTimeZone;
function isValidTimeZone(tz) {
	const cached = validTimeZoneCache.get(tz);
	if (cached !== void 0) return cached;
	let valid;
	try {
		new Intl.DateTimeFormat("en", { timeZone: tz }).format();
		valid = true;
	} catch {
		valid = false;
	}
	validTimeZoneCache.set(tz, valid);
	return valid;
}
function resolveEffectiveTimeZone(timeZone) {
	const explicit = timeZone ?? process.env.TZ;
	return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
	return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
	const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
	let fmt = timestampFormatterCache.get(effectiveTimeZone);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat("en", {
			timeZone: effectiveTimeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			fractionalSecondDigits: 3,
			timeZoneName: "longOffset"
		});
		timestampFormatterCache.set(effectiveTimeZone, fmt);
	}
	const parts = Object.fromEntries(fmt.formatToParts(date).map((part) => [part.type, part.value]));
	return {
		year: parts.year,
		month: parts.month,
		day: parts.day,
		hour: parts.hour,
		minute: parts.minute,
		second: parts.second,
		fractionalSecond: parts.fractionalSecond,
		offset: formatOffset(parts.timeZoneName ?? "GMT")
	};
}
function formatTimestamp(date, options) {
	const style = options?.style ?? "medium";
	const parts = getTimestampParts(date, options?.timeZone);
	switch (style) {
		case "short": return `${parts.hour}:${parts.minute}:${parts.second}${parts.offset}`;
		case "medium": return `${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
		case "long": return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${parts.fractionalSecond}${parts.offset}`;
	}
	throw new Error("Unsupported timestamp style");
}
//#endregion
//#region src/logging/json-console-line.ts
function formatJsonConsoleLine(params) {
	const envelope = {
		...params.meta,
		time: formatTimestamp(/* @__PURE__ */ new Date(), { style: "long" }),
		level: params.level,
		...params.subsystem ? { subsystem: params.subsystem } : {},
		message: params.message
	};
	return redactSensitiveText(JSON.stringify(envelope, function(key, value) {
		const isStructuralField = this === envelope && (key === "time" || key === "level");
		return typeof value === "string" && !isStructuralField ? redactSensitiveText(value) : value;
	}));
}
/** Formats diagnostics that must bypass console capture without bypassing JSON console style. */
function formatConsoleDiagnosticLine(params) {
	return (loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) === "json" ? formatJsonConsoleLine(params) : params.message;
}
/** Preserves human diagnostic blocks while serializing the whole block as one JSONL record. */
function formatConsoleDiagnosticBlock(params) {
	if ((loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) !== "json") return params.message;
	const trailingNewline = params.message.endsWith("\n") ? "\n" : "";
	return `${formatJsonConsoleLine({
		level: params.level,
		message: stripVTControlCharacters(params.message).trimEnd()
	})}${trailingNewline}`;
}
//#endregion
export { formatTimestamp as i, formatConsoleDiagnosticLine as n, formatJsonConsoleLine as r, formatConsoleDiagnosticBlock as t };
