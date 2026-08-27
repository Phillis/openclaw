import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { z as coerceFiniteScheduleNumber } from "./row-codec-DhVyr5Q_.js";
import { t as parseAbsoluteTimeMs } from "./parse-CXcqOHNZ.js";
import { n as parseOffsetlessIsoDateTimeInTimeZone } from "./parse-offsetless-zoned-datetime-tp1hmUTr.js";
import { Cron, CronDate } from "croner";
//#region src/cron/schedule.ts
/** Computes at/every/cron schedule timestamps with bounded Croner caching. */
const CRON_EVAL_CACHE_MAX = 512;
const DAY_MS = 864e5;
const cronEvalCache = /* @__PURE__ */ new Map();
const cronTimezoneFormatters = /* @__PURE__ */ new WeakMap();
function resolveCronTimezone(tz) {
	const trimmed = normalizeOptionalString(tz) ?? "";
	if (trimmed) return trimmed;
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function resolveCachedCron(expr, timezone) {
	const key = `${timezone}\u0000${expr}`;
	const cached = cronEvalCache.get(key);
	if (cached) {
		cronEvalCache.delete(key);
		cronEvalCache.set(key, cached);
		return cached;
	}
	pruneMapToMaxSize(cronEvalCache, CRON_EVAL_CACHE_MAX - 1);
	const next = new Cron(expr, {
		timezone,
		catch: false
	});
	cronEvalCache.set(key, next);
	return next;
}
function resolveCronFromSchedule(schedule) {
	if (typeof schedule.expr !== "string") throw new Error("invalid cron schedule: expr is required");
	const expr = schedule.expr.trim();
	if (!expr) return;
	return resolveCachedCron(expr, resolveCronTimezone(schedule.tz));
}
function hasNearbyCronTimezoneTransition(cron, timezone, nowMs, candidateMs) {
	let formatter = cronTimezoneFormatters.get(cron);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat("en-US", {
			timeZone: timezone,
			timeZoneName: "longOffset"
		});
		cronTimezoneFormatters.set(cron, formatter);
	}
	const resolvedFormatter = formatter;
	const readOffset = (instantMs) => resolvedFormatter.formatToParts(new Date(instantMs)).find((part) => part.type === "timeZoneName")?.value;
	const currentOffset = readOffset(nowMs);
	const candidateOffset = readOffset(candidateMs);
	return currentOffset !== candidateOffset || currentOffset !== readOffset(nowMs - DAY_MS) || candidateOffset !== readOffset(candidateMs - DAY_MS);
}
function resolveCronWallTimeMs(instantMs, timezone) {
	const local = new CronDate(new Date(instantMs), timezone);
	return Date.UTC(local.year, local.month, local.day, local.hour, local.minute, local.second, local.ms);
}
function resolveFirstCronOccurrenceMs(instantMs, timezone) {
	const resolved = parseOffsetlessIsoDateTimeInTimeZone(new Date(resolveCronWallTimeMs(instantMs, timezone)).toISOString().slice(0, -1), timezone);
	return resolved === null ? void 0 : Date.parse(resolved);
}
function matchesCronOccurrence(cron, instant) {
	return cron.match.bind(cron)(instant);
}
function findCronTimezoneTransitionMs(firstMs, lastMs, timezone) {
	let beforeSeconds = Math.floor(Math.min(firstMs, lastMs) / 1e3);
	let afterSeconds = Math.floor(Math.max(firstMs, lastMs) / 1e3);
	const previousOffsetMs = resolveCronWallTimeMs(beforeSeconds * 1e3, timezone) - beforeSeconds * 1e3;
	if (previousOffsetMs === resolveCronWallTimeMs(afterSeconds * 1e3, timezone) - afterSeconds * 1e3) return;
	while (afterSeconds - beforeSeconds > 1) {
		const middleSeconds = Math.floor((beforeSeconds + afterSeconds) / 2);
		if (resolveCronWallTimeMs(middleSeconds * 1e3, timezone) - middleSeconds * 1e3 === previousOffsetMs) beforeSeconds = middleSeconds;
		else afterSeconds = middleSeconds;
	}
	return afterSeconds * 1e3;
}
function resolveCronRunAtTransitionMs(cron, transitionMs, timezone) {
	let transition = new Date(transitionMs);
	for (;;) {
		const candidate = matchesCronOccurrence(cron, transition) ? transition : cron.nextRun(transition);
		if (!candidate) return;
		if (matchesCronOccurrence(cron, candidate)) return resolveFirstCronOccurrenceMs(candidate.getTime(), timezone);
		const candidateMs = candidate.getTime();
		const nextTransitionMs = findCronTimezoneTransitionMs(candidateMs - DAY_MS, candidateMs, timezone);
		if (nextTransitionMs === void 0 || nextTransitionMs <= transition.getTime()) return;
		transition = new Date(nextTransitionMs);
	}
}
function resolveNextCronOccurrenceMs(cron, nowMs, nextMs, timezone) {
	if (!matchesCronOccurrence(cron, new Date(nextMs))) {
		const transitionMs = findCronTimezoneTransitionMs(nextMs - DAY_MS, nextMs, timezone);
		return transitionMs === void 0 ? void 0 : resolveCronRunAtTransitionMs(cron, transitionMs, timezone);
	}
	const firstOccurrenceMs = resolveFirstCronOccurrenceMs(nextMs, timezone);
	if (firstOccurrenceMs === void 0 || firstOccurrenceMs > nowMs) return firstOccurrenceMs;
	const firstCurrentOccurrenceMs = resolveFirstCronOccurrenceMs(nowMs, timezone);
	const inRepeatedInterval = firstCurrentOccurrenceMs !== void 0 && firstCurrentOccurrenceMs < nowMs;
	const transitionStartMs = inRepeatedInterval ? firstCurrentOccurrenceMs : nowMs;
	const transitionEndMs = inRepeatedInterval ? nowMs : nextMs;
	const overlapMs = inRepeatedInterval ? nowMs - firstCurrentOccurrenceMs : nextMs - firstOccurrenceMs;
	const transitionMs = findCronTimezoneTransitionMs(transitionStartMs, transitionEndMs, timezone);
	if (transitionMs === void 0) return;
	return resolveCronRunAtTransitionMs(cron, transitionMs + overlapMs, timezone);
}
function resolveValidatedNextCronOccurrenceMs(cron, nowMs, candidateMs, timezone) {
	if (candidateMs > nowMs && !hasNearbyCronTimezoneTransition(cron, timezone, nowMs, candidateMs)) return candidateMs;
	const normalizedMs = resolveNextCronOccurrenceMs(cron, nowMs, candidateMs, timezone);
	return normalizedMs !== void 0 && normalizedMs > nowMs ? normalizedMs : void 0;
}
/** Computes the next scheduled run timestamp after now for at/every/cron schedules. */
function computeNextRunAtMs(schedule, nowMs) {
	if (asDateTimestampMs(nowMs) === void 0) return;
	if (schedule.kind === "at") {
		const atMs = parseAbsoluteTimeMs(schedule.at);
		if (atMs === null) return;
		return atMs > nowMs ? atMs : void 0;
	}
	if (schedule.kind === "every") {
		const everyMsRaw = coerceFiniteScheduleNumber(schedule.everyMs);
		if (everyMsRaw === void 0) return;
		const everyMs = Math.floor(everyMsRaw);
		if (everyMs < 1) return;
		const anchorRaw = coerceFiniteScheduleNumber(schedule.anchorMs);
		if (schedule.anchorMs !== void 0 && (anchorRaw === void 0 || anchorRaw < 0)) return;
		const anchor = Math.max(0, Math.floor(anchorRaw ?? nowMs));
		if (nowMs < anchor) return anchor;
		const elapsed = nowMs - anchor;
		return asDateTimestampMs(anchor + (Math.floor(elapsed / everyMs) + 1) * everyMs);
	}
	if (schedule.kind === "on-exit" || schedule.kind === "stream") return;
	const cron = resolveCronFromSchedule(schedule);
	if (!cron) return;
	const nextMs = cron.nextRun(new Date(nowMs))?.getTime();
	if (nextMs === void 0) return;
	const timezone = resolveCronTimezone(schedule.tz);
	const normalizedNextMs = resolveValidatedNextCronOccurrenceMs(cron, nowMs, nextMs, timezone);
	if (normalizedNextMs !== void 0) return normalizedNextMs;
	if (nextMs > nowMs) return;
	const nextSecondMs = Math.floor(nowMs / 1e3) * 1e3 + 1e3;
	const retryMs = cron.nextRun(new Date(nextSecondMs))?.getTime();
	if (retryMs !== void 0) {
		const normalizedRetryMs = resolveValidatedNextCronOccurrenceMs(cron, nowMs, retryMs, timezone);
		if (normalizedRetryMs !== void 0) return normalizedRetryMs;
	}
	const tomorrowMs = new Date(nowMs).setUTCHours(24, 0, 0, 0);
	const retry2Ms = cron.nextRun(new Date(tomorrowMs))?.getTime();
	return retry2Ms !== void 0 ? resolveValidatedNextCronOccurrenceMs(cron, nowMs, retry2Ms, timezone) : void 0;
}
/** Computes the previous cron-expression run timestamp before now. */
function computePreviousRunAtMs(schedule, nowMs) {
	if (schedule.kind !== "cron" || asDateTimestampMs(nowMs) === void 0) return;
	const cron = resolveCronFromSchedule(schedule);
	if (!cron) return;
	let previousMs = cron.previousRuns(1, new Date(nowMs))[0]?.getTime();
	const timezone = resolveCronTimezone(schedule.tz);
	if (previousMs !== void 0 && previousMs < nowMs && !hasNearbyCronTimezoneTransition(cron, timezone, nowMs, previousMs)) return previousMs;
	const firstCurrentOccurrenceMs = resolveFirstCronOccurrenceMs(nowMs, timezone);
	if (firstCurrentOccurrenceMs !== void 0 && firstCurrentOccurrenceMs < nowMs) {
		const transitionMs = findCronTimezoneTransitionMs(firstCurrentOccurrenceMs, nowMs, timezone);
		if (transitionMs !== void 0) {
			const overlapEndMs = transitionMs + nowMs - firstCurrentOccurrenceMs;
			const candidateMs = cron.previousRuns(1, new Date(overlapEndMs))[0]?.getTime();
			if (candidateMs !== void 0) previousMs = candidateMs;
		}
	}
	if (previousMs === void 0) return;
	while (!matchesCronOccurrence(cron, new Date(previousMs))) {
		const transitionMs = findCronTimezoneTransitionMs(previousMs - DAY_MS, previousMs, timezone);
		if (transitionMs === void 0) return;
		const beforeTransition = /* @__PURE__ */ new Date(transitionMs - 1e3);
		const candidateMs = (matchesCronOccurrence(cron, beforeTransition) ? beforeTransition : cron.previousRuns(1, beforeTransition)[0])?.getTime();
		if (candidateMs === void 0 || candidateMs >= previousMs) return;
		previousMs = candidateMs;
	}
	const normalizedPreviousMs = resolveFirstCronOccurrenceMs(previousMs, timezone);
	return normalizedPreviousMs !== void 0 && normalizedPreviousMs < nowMs ? normalizedPreviousMs : void 0;
}
/** Clears the Croner expression cache for deterministic tests. */
function clearCronScheduleCacheForTest() {
	cronEvalCache.clear();
}
/** Returns the Croner expression cache size for tests. */
function getCronScheduleCacheSizeForTest() {
	return cronEvalCache.size;
}
/** Returns the Croner expression cache capacity for tests. */
function getCronScheduleCacheMaxForTest() {
	return CRON_EVAL_CACHE_MAX;
}
/** Returns whether an expression/timezone pair is present in the Croner cache for tests. */
function hasCronInCacheForTest(expr, tz) {
	return cronEvalCache.has(`${tz}\u0000${expr}`);
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.cronScheduleTestApi")] = {
	clearCronScheduleCacheForTest,
	getCronScheduleCacheSizeForTest,
	getCronScheduleCacheMaxForTest,
	hasCronInCacheForTest
};
//#endregion
export { computePreviousRunAtMs as n, computeNextRunAtMs as t };
