import { t as hasValidIsoCalendarComponents } from "./iso-time-Bkhu9DzU.js";
//#region src/infra/format-time/parse-offsetless-zoned-datetime.ts
const OFFSETLESS_ISO_DATETIME_RE = /^\d{4}-\d{2}-\d{2}(?:[Tt]\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?)?$/;
function isOffsetlessIsoDateTime(raw) {
	return OFFSETLESS_ISO_DATETIME_RE.test(raw);
}
function parseOffsetlessIsoDateTimeInTimeZone(raw, timeZone) {
	if (!isOffsetlessIsoDateTime(raw) || !hasValidIsoCalendarComponents(raw)) return null;
	try {
		const naiveDate = /* @__PURE__ */ new Date(`${raw}${raw.length === 10 ? "T00:00:00" : ""}Z`);
		const naiveMs = naiveDate.getTime();
		if (Number.isNaN(naiveMs)) return null;
		const expectedParts = {
			year: naiveDate.getUTCFullYear(),
			month: naiveDate.getUTCMonth() + 1,
			day: naiveDate.getUTCDate(),
			hour: naiveDate.getUTCHours(),
			minute: naiveDate.getUTCMinutes(),
			second: naiveDate.getUTCSeconds(),
			millisecond: naiveDate.getUTCMilliseconds()
		};
		const matchingInstants = [
			-864e5,
			0,
			864e5
		].map((shiftMs) => naiveMs - getTimeZoneOffsetMs(naiveMs + shiftMs, timeZone)).filter((candidateMs) => matchesOffsetlessIsoDateTimeParts(candidateMs, timeZone, expectedParts));
		return matchingInstants.length > 0 ? new Date(Math.min(...matchingInstants)).toISOString() : null;
	} catch {
		return null;
	}
}
function matchesOffsetlessIsoDateTimeParts(utcMs, timeZone, expected) {
	const actual = getZonedDateTimeParts(utcMs, timeZone);
	return actual.year === expected.year && actual.month === expected.month && actual.day === expected.day && actual.hour === expected.hour && actual.minute === expected.minute && actual.second === expected.second && actual.millisecond === expected.millisecond;
}
function getTimeZoneOffsetMs(utcMs, timeZone) {
	const parts = getZonedDateTimeParts(utcMs, timeZone);
	return Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second, parts.millisecond) - utcMs;
}
function getZonedDateTimeParts(utcMs, timeZone) {
	const utcDate = new Date(utcMs);
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(utcDate);
	const getNumericPart = (type) => {
		const part = parts.find((candidate) => candidate.type === type);
		return Number.parseInt(part?.value ?? "0", 10);
	};
	return {
		year: getNumericPart("year"),
		month: getNumericPart("month"),
		day: getNumericPart("day"),
		hour: getNumericPart("hour"),
		minute: getNumericPart("minute"),
		second: getNumericPart("second"),
		millisecond: utcDate.getUTCMilliseconds()
	};
}
//#endregion
export { parseOffsetlessIsoDateTimeInTimeZone as n, isOffsetlessIsoDateTime as t };
