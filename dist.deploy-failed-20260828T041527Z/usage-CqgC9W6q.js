import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { h as resolveSessionAgentId } from "./agent-scope-DigoIwHb.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { a as resolveSessionFilePathOptions, i as resolveSessionFilePathCore } from "./paths-DVAvlIOc.js";
import { a as hasGatewayClientCap, t as GATEWAY_CLIENT_CAPS } from "./client-info-UYcIi_5g.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { _i as validateSessionsUsageParams } from "./src-4dv5TpeQ.js";
import { i as resolveStoredSessionKeyForAgentStore, n as resolveSessionStoreAgentId } from "./session-store-key-DRF7yKG5.js";
import { d as sessionDeliveryOrigin, u as sessionDeliveryChannel } from "./delivery-context.shared-azPdmUls.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { n as loadCombinedSessionStoreForGatewayCore } from "./combined-store-gateway-ChJFvtyM.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
import { t as resolvePreferredSessionKeyForSessionIdMatches } from "./session-id-resolution-Di-LWuJc.js";
import { t as listGatewayAgentsBasic } from "./agent-list-HVk8EUft.js";
import { n as resolveRequestedSessionAgentId } from "./session-request-agent-C9E8iDY4.js";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-Dmx2MxPy.js";
import "./session-utils-uVsFjoXC.js";
import { a as resolveTimezone, i as resolveTimeZoneDayStartMs, t as createTimeZoneDayKeyFormatter } from "./format-datetime-Bp7Mn3G9.js";
import { r as snapshotUsageLedger } from "./usage-ledger-Bg3oQjmy.js";
import { d as gatewayClientSessionCreator, i as operatorSessionCap } from "./operator-role-policy-il7s4lXY.js";
import { d as isGatewayAdmin, u as createSessionListEntryFilter } from "./session-sharing-DSLYm21V.js";
import { t as assertValidParams } from "./validation-kYFXohur.js";
import { r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.js";
import { c as mergeSessionCostSummaryInto, d as mergeUsageLatency, f as usageDailyModelIdentity, i as loadSessionUsageTimeSeries, l as buildUsageAggregateTail, m as resolveExistingUsageSessionFile, o as loadCostUsageSummaryFromCache, p as usageModelIdentity, r as loadSessionLogs, s as loadSessionCostSummariesFromCache, t as discoverAllSessions, u as mergeUsageDailyLatency } from "./session-cost-usage-D4LdnKXV.js";
import { n as loadUsageStatusStaleWhileRevalidate } from "./models-auth-status-usage-cache-D3oOfG7b.js";
import fs from "node:fs";
//#region src/gateway/server-methods/usage.ts
const USAGE_CACHE_TTL_MS = 3e4;
const USAGE_CACHE_MAX = 256;
const USAGE_AGENT_LOAD_CONCURRENCY = 12;
async function runUsageAgentTasks(tasks) {
	const result = await runTasksWithConcurrency({
		tasks,
		limit: USAGE_AGENT_LOAD_CONCURRENCY,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
	return result.results;
}
const MAX_USAGE_DAYS = 366 * 100;
const costUsageCache = /* @__PURE__ */ new Map();
const sessionsUsageCache = /* @__PURE__ */ new Map();
var SessionsUsageInvalidRequestError = class extends Error {};
function resolveSessionUsageTarget(key, config, agentIdHint) {
	const { canonicalKey, entry, storePath } = loadGatewaySessionEntryReadOnly(key, agentIdHint ? { agentId: agentIdHint } : void 0);
	const parsed = parseAgentSessionKey(key);
	const agentId = parsed?.agentId ?? agentIdHint ?? resolveSessionAgentId({
		config,
		sessionKey: key
	});
	const sessionId = entry?.sessionId ?? parsed?.rest ?? key;
	const sessionFile = entry ? resolveExistingUsageSessionFile({
		agentId,
		sessionId,
		sessionTarget: {
			agentId,
			sessionId,
			sessionKey: canonicalKey,
			storePath
		}
	}) : resolveExistingUsageSessionFile({
		agentId,
		sessionId,
		sessionFile: resolveSessionFilePathCore(sessionId, void 0, resolveSessionFilePathOptions({
			storePath,
			agentId
		}))
	});
	return sessionFile ? {
		entry,
		agentId,
		sessionId,
		sessionFile
	} : void 0;
}
function setUsageCache(cache, cacheKey, entry) {
	if (!cache.has(cacheKey) && cache.size >= USAGE_CACHE_MAX) {
		let evictionKey = cache.keys().next().value;
		for (const [key, candidate] of cache) if (!candidate.inFlight) {
			evictionKey = key;
			break;
		}
		if (evictionKey !== void 0) cache.delete(evictionKey);
	}
	cache.set(cacheKey, entry);
}
async function loadUsageResultCached(params) {
	const { cache, cacheKey, configRef } = params;
	const candidate = cache.get(cacheKey);
	const cached = configRef === void 0 || candidate?.configRef === configRef ? candidate : void 0;
	if (cached?.value && cached.updatedAt && Date.now() - cached.updatedAt < USAGE_CACHE_TTL_MS) return cached.value;
	if (cached?.inFlight) return cached.value && cached.updatedAt ? cached.value : await cached.inFlight;
	const entry = cached ?? { ...configRef && { configRef } };
	const inFlight = params.load().then((value) => {
		if (cache.get(cacheKey) !== entry) return value;
		if (params.isComplete?.(value) ?? true) {
			entry.value = value;
			entry.updatedAt = Date.now();
		} else if (!entry.value) {
			entry.value = value;
			delete entry.updatedAt;
		}
		return value;
	}).catch((error) => {
		if (entry.value) return entry.value;
		throw error;
	}).finally(() => {
		const current = cache.get(cacheKey);
		if (current === entry && current.inFlight === inFlight) current.inFlight = void 0;
	});
	entry.inFlight = inFlight;
	setUsageCache(cache, cacheKey, entry);
	return entry.value && entry.updatedAt ? entry.value : await inFlight;
}
function usageDayBucketCacheKey(dayBucket) {
	return dayBucket ? dayBucket.mode === "time-zone" ? `time-zone:${dayBucket.timeZone}` : `utc-offset:${dayBucket.utcOffsetMinutes}` : "gateway";
}
function sessionsUsageCacheKey(params) {
	return JSON.stringify([
		params.agentScope === "all" ? "all" : `agent:${params.agentId}`,
		params.startMs,
		params.endMs,
		params.includeUntimestamped === true,
		usageDayBucketCacheKey(params.dayBucket),
		params.limit,
		params.groupingMode,
		params.specificKey,
		params.includeContextWeight,
		...params.visibilityIdentity ? [params.visibilityIdentity] : []
	]);
}
async function loadSessionsUsageResultCached(params) {
	return await loadUsageResultCached({
		cache: sessionsUsageCache,
		cacheKey: sessionsUsageCacheKey(params),
		configRef: params.configRef,
		load: params.load,
		isComplete: (result) => !result.cacheStatus || result.cacheStatus.status === "fresh"
	});
}
function resolveSessionUsageFileOrRespond(key, respond, config) {
	const sessionOwner = resolveRequestedSessionAgentId(config, key);
	if (!sessionOwner.ok) {
		respond(false, void 0, sessionOwner.error);
		return null;
	}
	let resolved;
	try {
		resolved = resolveSessionUsageTarget(key, config, sessionOwner.agentId);
	} catch {
		resolved = void 0;
	}
	if (!resolved) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `Invalid session key: ${key}`));
		return null;
	}
	return {
		config,
		...resolved
	};
}
const parseDateParts = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw.trim());
	if (!match) return;
	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const monthIndex = Number(monthStr) - 1;
	const day = Number(dayStr);
	if (!Number.isFinite(year) || !Number.isFinite(monthIndex) || !Number.isFinite(day)) return;
	const probe = new Date(Date.UTC(year, monthIndex, day));
	if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== monthIndex || probe.getUTCDate() !== day) return;
	return {
		year,
		monthIndex,
		day
	};
};
const shiftDateParts = (parts, days) => {
	const shifted = new Date(Date.UTC(parts.year, parts.monthIndex, parts.day + days));
	return {
		year: shifted.getUTCFullYear(),
		monthIndex: shifted.getUTCMonth(),
		day: shifted.getUTCDate()
	};
};
const datePartsToStartMs = (parts, interpretation) => {
	const { year, monthIndex, day } = parts;
	if (interpretation.mode === "gateway") return new Date(year, monthIndex, day).getTime();
	if (interpretation.mode === "time-zone") return resolveTimeZoneDayStartMs(formatDateParts(year, monthIndex, day), interpretation.timeZone);
	if (interpretation.mode === "utc-offset") return Date.UTC(year, monthIndex, day) - interpretation.utcOffsetMinutes * 60 * 1e3;
	return Date.UTC(year, monthIndex, day);
};
const datePartsToEndMs = (parts, interpretation) => {
	const lookaheadDays = interpretation.mode === "time-zone" ? 2 : 1;
	for (let daysAhead = 1; daysAhead <= lookaheadDays; daysAhead += 1) {
		const nextDayStartMs = datePartsToStartMs(shiftDateParts(parts, daysAhead), interpretation);
		if (nextDayStartMs !== void 0) return nextDayStartMs - 1;
	}
};
const findInvalidExplicitDate = (params) => {
	for (const field of ["startDate", "endDate"]) {
		const raw = params[field];
		if (raw === void 0 || raw === null || typeof raw === "string" && raw.trim() === "") continue;
		if (parseDateParts(raw) === void 0) return field;
	}
};
/**
* Parse a UTC offset string in the format UTC+H, UTC-H, UTC+HH, UTC-HH, UTC+H:MM, UTC-HH:MM.
* Returns the UTC offset in minutes (east-positive), or undefined if invalid.
*/
const parseUtcOffsetToMinutes = (raw) => {
	if (typeof raw !== "string" || !raw.trim()) return;
	const match = /^UTC([+-])(\d{1,2})(?::([0-5]\d))?$/.exec(raw.trim());
	if (!match) return;
	const sign = match[1] === "+" ? 1 : -1;
	const hours = Number(match[2]);
	const minutes = Number(match[3] ?? "0");
	if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return;
	if (hours > 14 || hours === 14 && minutes !== 0) return;
	const totalMinutes = sign * (hours * 60 + minutes);
	if (totalMinutes < -720 || totalMinutes > 840) return;
	return totalMinutes;
};
const resolveDateInterpretation = (params) => {
	if (params.mode === "gateway") return {
		ok: true,
		value: { mode: "gateway" }
	};
	if (params.mode === "specific") {
		const utcOffsetMinutes = parseUtcOffsetToMinutes(params.utcOffset);
		if (params.timeZone !== void 0 && params.timeZone !== null) {
			const requestedTimeZone = normalizeOptionalString(params.timeZone);
			const timeZone = requestedTimeZone ? resolveTimezone(requestedTimeZone) : void 0;
			if (!timeZone) {
				if (utcOffsetMinutes !== void 0) return {
					ok: true,
					value: {
						mode: "utc-offset",
						utcOffsetMinutes
					}
				};
				return {
					ok: false,
					error: "invalid timeZone: expected a valid IANA time zone"
				};
			}
			return {
				ok: true,
				value: {
					mode: "time-zone",
					timeZone,
					formatDayKey: createTimeZoneDayKeyFormatter(timeZone)
				}
			};
		}
		if (utcOffsetMinutes !== void 0) return {
			ok: true,
			value: {
				mode: "utc-offset",
				utcOffsetMinutes
			}
		};
	}
	return {
		ok: true,
		value: { mode: "utc" }
	};
};
const resolveDayBucket = (interpretation) => {
	if (interpretation.mode === "gateway") return;
	if (interpretation.mode === "time-zone") return {
		mode: "time-zone",
		timeZone: interpretation.timeZone
	};
	return {
		mode: "utc-offset",
		utcOffsetMinutes: interpretation.mode === "utc-offset" ? interpretation.utcOffsetMinutes : 0
	};
};
const getDateParts = (date, interpretation) => {
	if (interpretation.mode === "gateway") return {
		year: date.getFullYear(),
		monthIndex: date.getMonth(),
		day: date.getDate()
	};
	if (interpretation.mode === "time-zone") {
		const parts = parseDateParts(interpretation.formatDayKey(date));
		if (!parts) throw new Error("timezone formatter returned an invalid calendar day");
		return parts;
	}
	if (interpretation.mode === "utc-offset") {
		const shifted = new Date(date.getTime() + interpretation.utcOffsetMinutes * 60 * 1e3);
		return {
			year: shifted.getUTCFullYear(),
			monthIndex: shifted.getUTCMonth(),
			day: shifted.getUTCDate()
		};
	}
	return {
		year: date.getUTCFullYear(),
		monthIndex: date.getUTCMonth(),
		day: date.getUTCDate()
	};
};
const formatDateLabel = (ms, interpretation) => {
	const parts = getDateParts(new Date(ms), interpretation);
	return formatDateParts(parts.year, parts.monthIndex, parts.day);
};
const formatDateParts = (year, monthIndex, day) => `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
const parseDays = (raw) => {
	const fromFinite = (n) => {
		if (!Number.isFinite(n)) return;
		return Math.min(Math.floor(n), MAX_USAGE_DAYS);
	};
	if (typeof raw === "number") return fromFinite(raw);
	if (typeof raw === "string" && raw.trim() !== "") return fromFinite(Number(raw));
};
const resolveRangeDays = (raw) => {
	if (raw === "all") return "all";
	if (raw === "7d") return 7;
	if (raw === "30d") return 30;
	if (raw === "90d") return 90;
	if (raw === "1y") return 365;
};
const resolveTrailingDays = (endDateParts, days, interpretation) => {
	const startMs = datePartsToStartMs(shiftDateParts(endDateParts, -(days - 1)), interpretation);
	const endMs = datePartsToEndMs(endDateParts, interpretation);
	if (startMs === void 0 || endMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	return {
		ok: true,
		value: {
			startMs,
			endMs
		}
	};
};
/**
* Get date range from params (startDate/endDate or days).
* Falls back to last 30 days if not provided.
*/
const resolveDateRange = (params, resolvedInterpretation) => {
	const invalidDate = findInvalidExplicitDate(params);
	if (invalidDate) return {
		ok: false,
		error: `invalid ${invalidDate}: expected a valid YYYY-MM-DD calendar date`
	};
	const now = /* @__PURE__ */ new Date();
	const interpretationResolution = resolvedInterpretation ? {
		ok: true,
		value: resolvedInterpretation
	} : resolveDateInterpretation(params);
	if (!interpretationResolution.ok) return interpretationResolution;
	const interpretation = interpretationResolution.value;
	const todayDateParts = getDateParts(now, interpretation);
	const todayEndMs = datePartsToEndMs(todayDateParts, interpretation);
	if (todayEndMs === void 0) return {
		ok: false,
		error: "calendar day does not exist in requested time zone"
	};
	const startDateParts = parseDateParts(params.startDate);
	const endDateParts = parseDateParts(params.endDate);
	if (startDateParts === void 0 !== (endDateParts === void 0)) return {
		ok: false,
		error: "startDate and endDate must be provided together"
	};
	if (startDateParts && endDateParts) {
		const startMs = datePartsToStartMs(startDateParts, interpretation);
		const endStartMs = datePartsToStartMs(endDateParts, interpretation);
		const endMs = datePartsToEndMs(endDateParts, interpretation);
		if (startMs === void 0 || endStartMs === void 0 || endMs === void 0) return {
			ok: false,
			error: "calendar day does not exist in requested time zone"
		};
		if (startMs > endStartMs) return {
			ok: false,
			error: "startDate must not be after endDate"
		};
		return {
			ok: true,
			value: {
				startMs,
				endMs
			}
		};
	}
	const rangeDays = resolveRangeDays(params.range);
	if (rangeDays === "all") return {
		ok: true,
		value: {
			startMs: 0,
			endMs: todayEndMs,
			includeUntimestamped: true
		}
	};
	if (rangeDays !== void 0) return resolveTrailingDays(todayDateParts, rangeDays, interpretation);
	const days = parseDays(params.days);
	if (days !== void 0) return resolveTrailingDays(todayDateParts, Math.max(1, days), interpretation);
	return resolveTrailingDays(todayDateParts, 30, interpretation);
};
function resolveUsageDateRangeOrRespond(params, respond) {
	const interpretation = resolveDateInterpretation(params);
	if (!interpretation.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, interpretation.error));
		return null;
	}
	const range = resolveDateRange(params, interpretation.value);
	if (!range.ok) {
		respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, range.error));
		return null;
	}
	return {
		interpretation: interpretation.value,
		range: range.value
	};
}
function buildStoreBySessionId(store) {
	const matchesBySessionId = /* @__PURE__ */ new Map();
	for (const [key, entry] of Object.entries(store)) {
		if (!entry?.sessionId) continue;
		const matches = matchesBySessionId.get(entry.sessionId) ?? [];
		matches.push([key, entry]);
		matchesBySessionId.set(entry.sessionId, matches);
	}
	const storeBySessionId = /* @__PURE__ */ new Map();
	for (const [sessionId, matches] of matchesBySessionId) {
		const preferredKey = resolvePreferredSessionKeyForSessionIdMatches(matches, sessionId);
		if (!preferredKey) continue;
		const preferredEntry = store[preferredKey];
		if (preferredEntry) storeBySessionId.set(sessionId, {
			key: preferredKey,
			entry: preferredEntry
		});
	}
	return storeBySessionId;
}
function filterSessionStoreByAgent(params) {
	const scopedAgentId = normalizeAgentId(params.agentId);
	const scopedStore = {};
	for (const [key, entry] of Object.entries(params.store)) {
		if (key.trim().toLowerCase() === "global") {
			scopedStore[key] = entry;
			continue;
		}
		if (resolveSessionStoreAgentId(params.config, key) === scopedAgentId) scopedStore[key] = entry;
	}
	return scopedStore;
}
async function discoverAllSessionsForUsage(params) {
	const requestedAgentId = normalizeOptionalString(params.agentId);
	return (await runUsageAgentTasks((requestedAgentId ? [{ id: normalizeAgentId(requestedAgentId) }] : listGatewayAgentsBasic(params.config).agents).map((agent) => async () => {
		const agentId = normalizeAgentId(agent.id);
		return (await discoverAllSessions({
			agentId,
			startMs: params.startMs,
			endMs: params.endMs,
			includeFirstUserMessage: false
		})).map((session) => Object.assign({}, session, { agentId }));
	}))).flat().toSorted((a, b) => b.mtime - a.mtime);
}
function addUniqueSessionIds(target, ids) {
	const seen = new Set(target);
	for (const id of ids) {
		const normalized = normalizeOptionalString(id);
		if (normalized && !seen.has(normalized)) {
			seen.add(normalized);
			target.push(normalized);
		}
	}
	return target;
}
function resolveUsageFamilySessionIds(entry, currentSessionId) {
	return addUniqueSessionIds([], [currentSessionId, ...entry?.usageFamilySessionIds ?? []]);
}
function maybeMergeFamilyEntry(params) {
	if (params.groupingMode !== "family") {
		params.mergedEntries.push(params.base);
		return;
	}
	const includedSessionIds = resolveUsageFamilySessionIds(params.base.storeEntry, params.base.sessionId);
	params.mergedEntries.push({
		...params.base,
		scope: "family",
		sessionFamilyKey: params.base.storeEntry?.usageFamilyKey ?? params.base.key,
		currentSessionId: params.base.sessionId,
		includedSessionIds
	});
}
async function loadCostUsageSummaryCached(params) {
	const allAgents = params.agentScope === "all";
	const agentId = allAgents ? void 0 : normalizeAgentId(params.agentId ?? resolveSessionAgentId({ config: params.config }));
	const dayBucketKey = usageDayBucketCacheKey(params.dayBucket);
	const cacheKey = `${allAgents ? "all" : `agent:${agentId}`}:${params.startMs}-${params.endMs}:${dayBucketKey}`;
	return await loadUsageResultCached({
		cache: costUsageCache,
		cacheKey,
		load: () => allAgents ? loadAllAgentCostUsageSummary({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config
		}) : loadCostUsageSummaryFromCache({
			startMs: params.startMs,
			endMs: params.endMs,
			dayBucket: params.dayBucket,
			config: params.config,
			agentId: expectDefined(agentId, "non-aggregate usage agent id"),
			requestRefresh: true,
			refreshMode: "background"
		})
	});
}
async function loadAllAgentCostUsageSummary(params) {
	const summaries = await runUsageAgentTasks(listGatewayAgentsBasic(params.config).agents.map((agent) => normalizeAgentId(agent.id)).map((agentId) => () => loadCostUsageSummaryFromCache({
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket,
		config: params.config,
		agentId,
		requestRefresh: true,
		refreshMode: "background"
	})));
	const dailyByDate = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	let cacheStatus;
	let updatedAt = 0;
	let days = 0;
	for (const summary of summaries) {
		updatedAt = Math.max(updatedAt, summary.updatedAt);
		days = Math.max(days, summary.days);
		addCostUsageTotals(totals, summary.totals);
		if (summary.cacheStatus) cacheStatus = mergeUsageCacheStatus(cacheStatus, summary.cacheStatus);
		for (const day of summary.daily) {
			const entry = dailyByDate.get(day.date) ?? {
				date: day.date,
				...createEmptyCostUsageTotals()
			};
			addCostUsageTotals(entry, day);
			dailyByDate.set(day.date, entry);
		}
	}
	return {
		updatedAt,
		days,
		daily: Array.from(dailyByDate.values()).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals,
		...cacheStatus ? { cacheStatus } : {}
	};
}
function mergeUsageCacheStatus(target, source) {
	if (!target) return { ...source };
	const statusRank = {
		fresh: 0,
		partial: 1,
		stale: 2,
		refreshing: 3
	};
	return {
		status: statusRank[source.status] > statusRank[target.status] ? source.status : target.status,
		cachedFiles: target.cachedFiles + source.cachedFiles,
		pendingFiles: target.pendingFiles + source.pendingFiles,
		staleFiles: target.staleFiles + source.staleFiles,
		refreshedAt: target.refreshedAt === void 0 ? source.refreshedAt : source.refreshedAt === void 0 ? target.refreshedAt : Math.max(target.refreshedAt, source.refreshedAt)
	};
}
const usageHandlers = {
	"usage.status": async ({ respond, context, client }) => {
		const coldRead = hasGatewayClientCap(client?.connect?.caps, GATEWAY_CLIENT_CAPS.USAGE_REFRESHING) ? "refresh-marker" : void 0;
		respond(true, await loadUsageStatusStaleWhileRevalidate({
			config: context.getRuntimeConfig(),
			coldRead
		}), void 0);
	},
	"usage.ledger": async ({ respond }) => {
		respond(true, snapshotUsageLedger(), void 0);
	},
	"usage.cost": async ({ respond, params, context, client }) => {
		const dateRange = resolveUsageDateRangeOrRespond(params ?? {}, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		if (!isGatewayAdmin(client ?? null) && operatorSessionCap(client ?? null, config) === "none") {
			respond(false, void 0, errorShape(ErrorCodes.FORBIDDEN, "Aggregate usage includes sessions hidden by your operator role; ask an administrator to review Gateway-wide usage."));
			return;
		}
		const { startMs, endMs } = range;
		const agentId = normalizeOptionalString(params?.agentId);
		const agentScope = params?.agentScope === "all" && !agentId ? "all" : void 0;
		let effectiveAgentId = agentId;
		if (!agentScope && !effectiveAgentId) {
			const requestedAgent = resolveRequestedSessionAgentId(config, "main");
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			effectiveAgentId = requestedAgent.agentId;
		}
		respond(true, await loadCostUsageSummaryCached({
			startMs,
			endMs,
			dayBucket: resolveDayBucket(dateInterpretation),
			config,
			agentId: effectiveAgentId,
			agentScope
		}), void 0);
	},
	"sessions.usage": async ({ respond, params, context, client }) => {
		if (!assertValidParams(params, validateSessionsUsageParams, "sessions.usage", respond)) return;
		const p = params;
		const dateRange = resolveUsageDateRangeOrRespond(p, respond);
		if (!dateRange) return;
		const { interpretation: dateInterpretation, range } = dateRange;
		const config = context.getRuntimeConfig();
		const sessionCap = operatorSessionCap(client ?? null, config);
		const visibilityFilter = sessionCap === "none" ? createSessionListEntryFilter({
			client: client ?? null,
			cfg: config
		}) : void 0;
		const profileId = gatewayClientSessionCreator(client ?? null)?.id;
		const visibilityIdentity = sessionCap && profileId ? `${profileId}:${sessionCap}` : void 0;
		const { startMs, endMs, includeUntimestamped } = range;
		const dayBucket = resolveDayBucket(dateInterpretation);
		const limit = typeof p.limit === "number" && Number.isFinite(p.limit) ? p.limit : 50;
		const includeContextWeight = p.includeContextWeight ?? false;
		const specificKey = normalizeOptionalString(p.key) ?? null;
		const requestedAgentId = normalizeOptionalString(p.agentId);
		const requestedAllAgents = p.agentScope === "all";
		if (requestedAllAgents && (requestedAgentId || specificKey)) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentScope=all cannot be combined with key or agentId"));
			return;
		}
		const specificSessionOwner = specificKey ? resolveRequestedSessionAgentId(config, specificKey, requestedAgentId) : void 0;
		if (specificSessionOwner && !specificSessionOwner.ok) {
			respond(false, void 0, specificSessionOwner.error);
			return;
		}
		const implicitAgent = !requestedAllAgents && !specificSessionOwner?.agentId && !requestedAgentId ? resolveRequestedSessionAgentId(config, "main") : void 0;
		if (implicitAgent && !implicitAgent.ok) {
			respond(false, void 0, implicitAgent.error);
			return;
		}
		const effectiveAgentId = requestedAllAgents ? void 0 : normalizeAgentId(specificSessionOwner?.agentId ?? requestedAgentId ?? implicitAgent?.agentId);
		const groupingMode = p.groupBy === "family" || p.includeHistorical === true ? "family" : "instance";
		let result;
		try {
			result = await loadSessionsUsageResultCached({
				configRef: config,
				...effectiveAgentId ? { agentId: effectiveAgentId } : { agentScope: "all" },
				startMs,
				endMs,
				includeUntimestamped,
				dayBucket,
				limit,
				groupingMode,
				specificKey,
				includeContextWeight,
				...visibilityIdentity ? { visibilityIdentity } : {},
				load: async () => {
					const { store } = loadCombinedSessionStoreForGatewayCore(config, effectiveAgentId ? { agentId: effectiveAgentId } : {});
					const agentStore = effectiveAgentId ? filterSessionStoreByAgent({
						config,
						store,
						agentId: effectiveAgentId
					}) : store;
					const scopedStore = visibilityFilter ? Object.fromEntries(Object.entries(agentStore).filter(([key, entry]) => visibilityFilter(key, entry))) : agentStore;
					const now = Date.now();
					const mergedEntries = [];
					if (specificKey) {
						const scopedSpecificKey = resolveStoredSessionKeyForAgentStore({
							cfg: config,
							agentId: effectiveAgentId ?? expectDefined(specificSessionOwner?.agentId, "specific session owner"),
							sessionKey: specificKey
						});
						const scopedParsed = parseAgentSessionKey(scopedSpecificKey);
						const agentIdFromKey = scopedParsed?.agentId ?? effectiveAgentId ?? expectDefined(specificSessionOwner?.agentId, "specific session owner");
						const keyRest = scopedParsed?.rest ?? specificKey;
						const storeBySessionId = buildStoreBySessionId(scopedStore);
						const storeMatch = scopedStore[scopedSpecificKey] ? {
							key: scopedSpecificKey,
							entry: scopedStore[scopedSpecificKey]
						} : scopedStore[specificKey] ? {
							key: specificKey,
							entry: scopedStore[specificKey]
						} : null;
						const storeByIdMatch = storeBySessionId.get(keyRest) ?? (keyRest !== specificKey ? storeBySessionId.get(specificKey) : void 0) ?? null;
						const resolvedStoreKey = storeMatch?.key ?? storeByIdMatch?.key ?? scopedSpecificKey;
						const storeEntry = storeMatch?.entry ?? storeByIdMatch?.entry;
						if (visibilityFilter && !storeEntry) throw new SessionsUsageInvalidRequestError(`Invalid session reference: ${specificKey}`);
						const sessionId = storeEntry?.sessionId ?? keyRest;
						let resolved;
						try {
							resolved = resolveSessionUsageTarget(resolvedStoreKey, config, agentIdFromKey);
							if (!resolved || resolved.agentId !== agentIdFromKey || resolved.sessionId !== sessionId) throw new Error("session target mismatch");
						} catch {
							throw new SessionsUsageInvalidRequestError(`Invalid session reference: ${specificKey}`);
						}
						const { sessionFile } = resolved;
						let updatedAt;
						if (parseSqliteSessionFileMarker(sessionFile)) updatedAt = storeEntry?.updatedAt ?? now;
						else try {
							const stats = fs.statSync(sessionFile);
							if (stats.isFile()) updatedAt = storeEntry?.updatedAt ?? stats.mtimeMs;
						} catch {}
						if (updatedAt !== void 0) maybeMergeFamilyEntry({
							mergedEntries,
							groupingMode,
							base: {
								key: resolvedStoreKey,
								agentId: agentIdFromKey,
								sessionId,
								sessionFile,
								label: storeEntry?.label,
								updatedAt,
								storeEntry
							}
						});
					} else {
						const discoveredSessions = await discoverAllSessionsForUsage({
							config,
							...effectiveAgentId ? { agentId: effectiveAgentId } : {},
							startMs,
							endMs
						});
						const storeBySessionId = buildStoreBySessionId(scopedStore);
						const storeFamilySessionIds = /* @__PURE__ */ new Set();
						if (groupingMode === "family") for (const entry of Object.values(scopedStore)) for (const sessionId of entry?.usageFamilySessionIds ?? []) storeFamilySessionIds.add(sessionId);
						for (const discovered of discoveredSessions) {
							const storeMatch = storeBySessionId.get(discovered.sessionId);
							if (visibilityFilter && !storeMatch) continue;
							if (storeMatch) maybeMergeFamilyEntry({
								mergedEntries,
								groupingMode,
								base: {
									key: storeMatch.key,
									agentId: discovered.agentId,
									sessionId: discovered.sessionId,
									sessionFile: discovered.sessionFile,
									label: storeMatch.entry.label,
									updatedAt: storeMatch.entry.updatedAt ?? discovered.mtime,
									storeEntry: storeMatch.entry
								}
							});
							else {
								if (groupingMode === "family" && storeFamilySessionIds.has(discovered.sessionId)) continue;
								mergedEntries.push({
									key: `agent:${discovered.agentId}:${discovered.sessionId}`,
									agentId: discovered.agentId,
									sessionId: discovered.sessionId,
									sessionFile: discovered.sessionFile,
									label: void 0,
									updatedAt: discovered.mtime,
									scope: "instance"
								});
							}
						}
					}
					mergedEntries.sort((a, b) => b.updatedAt - a.updatedAt);
					const sessions = [];
					const aggregateTotals = createEmptyCostUsageTotals();
					const aggregateMessages = {
						total: 0,
						user: 0,
						assistant: 0,
						toolCalls: 0,
						toolResults: 0,
						errors: 0
					};
					const toolAggregateMap = /* @__PURE__ */ new Map();
					const byModelMap = /* @__PURE__ */ new Map();
					const byProviderMap = /* @__PURE__ */ new Map();
					const byAgentMap = /* @__PURE__ */ new Map();
					const byChannelMap = /* @__PURE__ */ new Map();
					const dailyAggregateMap = /* @__PURE__ */ new Map();
					const latencyTotals = {
						count: 0,
						sum: 0,
						min: Number.POSITIVE_INFINITY,
						max: 0,
						p95Max: 0
					};
					const dailyLatencyMap = /* @__PURE__ */ new Map();
					const modelDailyMap = /* @__PURE__ */ new Map();
					let cacheStatus;
					const usageByEntryIndex = Array.from({ length: mergedEntries.length }, () => null);
					const sessionsByAgent = /* @__PURE__ */ new Map();
					for (const [entryIndex, merged] of mergedEntries.entries()) for (const includedSessionId of merged.includedSessionIds ?? [merged.sessionId]) {
						const includedSessionFile = includedSessionId === merged.sessionId ? merged.sessionFile : resolveExistingUsageSessionFile({
							sessionId: includedSessionId,
							agentId: merged.agentId
						});
						if (!includedSessionFile) continue;
						const agentSessions = sessionsByAgent.get(merged.agentId) ?? [];
						agentSessions.push({
							entryIndex,
							sessionId: includedSessionId,
							sessionFile: includedSessionFile
						});
						sessionsByAgent.set(merged.agentId, agentSessions);
					}
					const agentLoads = await runUsageAgentTasks(Array.from(sessionsByAgent.entries()).map(([agentId, agentSessions]) => async () => ({
						agentSessions,
						loaded: await loadSessionCostSummariesFromCache({
							sessions: agentSessions,
							config,
							agentId,
							startMs,
							endMs,
							includeUntimestamped,
							dayBucket
						})
					})));
					for (const { agentSessions, loaded } of agentLoads) {
						cacheStatus = mergeUsageCacheStatus(cacheStatus, loaded.cacheStatus);
						for (const [index, summary] of loaded.summaries.entries()) {
							if (!summary) continue;
							const session = expectDefined(agentSessions[index], "agent sessions entry at index");
							const merged = expectDefined(mergedEntries[session.entryIndex], "merged entries entry at session.entry index");
							const usage = usageByEntryIndex[session.entryIndex] ?? createEmptyCostUsageTotals();
							usage.sessionId = merged.sessionId;
							usage.sessionFile = merged.sessionFile;
							mergeSessionCostSummaryInto(usage, summary);
							usageByEntryIndex[session.entryIndex] = usage;
						}
					}
					let longestSessionDurationMs = 0;
					let activeSessionCount = 0;
					for (const [entryIndex, merged] of mergedEntries.entries()) {
						const agentId = merged.agentId;
						const usage = usageByEntryIndex[entryIndex] ?? null;
						if (usage) {
							addCostUsageTotals(aggregateTotals, usage);
							longestSessionDurationMs = Math.max(longestSessionDurationMs, usage.durationMs ?? 0);
							if (usage.firstActivity !== void 0 || (usage.messageCounts?.total ?? 0) > 0) activeSessionCount += 1;
						}
						const channel = sessionDeliveryChannel(merged.storeEntry);
						const chatType = merged.storeEntry?.chatType ?? sessionDeliveryOrigin(merged.storeEntry)?.chatType;
						if (usage) {
							if (usage.messageCounts) {
								aggregateMessages.total += usage.messageCounts.total;
								aggregateMessages.user += usage.messageCounts.user;
								aggregateMessages.assistant += usage.messageCounts.assistant;
								aggregateMessages.toolCalls += usage.messageCounts.toolCalls;
								aggregateMessages.toolResults += usage.messageCounts.toolResults;
								aggregateMessages.errors += usage.messageCounts.errors;
							}
							if (usage.toolUsage) for (const tool of usage.toolUsage.tools) toolAggregateMap.set(tool.name, (toolAggregateMap.get(tool.name) ?? 0) + tool.count);
							if (usage.modelUsage) for (const entry of usage.modelUsage) {
								const modelKey = usageModelIdentity(entry.provider, entry.model);
								const modelExisting = byModelMap.get(modelKey) ?? {
									provider: entry.provider,
									model: entry.model,
									count: 0,
									totals: createEmptyCostUsageTotals()
								};
								modelExisting.count += entry.count;
								addCostUsageTotals(modelExisting.totals, entry.totals);
								byModelMap.set(modelKey, modelExisting);
								const providerKey = entry.provider ?? "unknown";
								const providerExisting = byProviderMap.get(providerKey) ?? {
									provider: entry.provider,
									model: void 0,
									count: 0,
									totals: createEmptyCostUsageTotals()
								};
								providerExisting.count += entry.count;
								addCostUsageTotals(providerExisting.totals, entry.totals);
								byProviderMap.set(providerKey, providerExisting);
							}
							mergeUsageLatency(latencyTotals, usage.latency);
							mergeUsageDailyLatency(dailyLatencyMap, usage.dailyLatency);
							if (usage.dailyModelUsage) for (const entry of usage.dailyModelUsage) {
								const key = usageDailyModelIdentity(entry.date, entry.provider, entry.model);
								const existing = modelDailyMap.get(key) ?? {
									date: entry.date,
									provider: entry.provider,
									model: entry.model,
									tokens: 0,
									cost: 0,
									count: 0
								};
								existing.tokens += entry.tokens;
								existing.cost += entry.cost;
								existing.count += entry.count;
								modelDailyMap.set(key, existing);
							}
							if (agentId) {
								const agentTotals = byAgentMap.get(agentId) ?? createEmptyCostUsageTotals();
								addCostUsageTotals(agentTotals, usage);
								byAgentMap.set(agentId, agentTotals);
							}
							if (channel) {
								const channelTotals = byChannelMap.get(channel) ?? createEmptyCostUsageTotals();
								addCostUsageTotals(channelTotals, usage);
								byChannelMap.set(channel, channelTotals);
							}
							if (usage.dailyBreakdown) for (const day of usage.dailyBreakdown) {
								const daily = dailyAggregateMap.get(day.date) ?? {
									date: day.date,
									tokens: 0,
									cost: 0,
									messages: 0,
									toolCalls: 0,
									errors: 0
								};
								daily.tokens += day.tokens;
								daily.cost += day.cost;
								dailyAggregateMap.set(day.date, daily);
							}
							if (usage.dailyMessageCounts) for (const day of usage.dailyMessageCounts) {
								const daily = dailyAggregateMap.get(day.date) ?? {
									date: day.date,
									tokens: 0,
									cost: 0,
									messages: 0,
									toolCalls: 0,
									errors: 0
								};
								daily.messages += day.total;
								daily.toolCalls += day.toolCalls;
								daily.errors += day.errors;
								dailyAggregateMap.set(day.date, daily);
							}
						}
						if (entryIndex < limit) sessions.push({
							key: merged.key,
							label: merged.label,
							sessionId: merged.sessionId,
							scope: merged.scope ?? "instance",
							sessionFamilyKey: merged.sessionFamilyKey,
							currentSessionId: merged.currentSessionId,
							includedSessionIds: merged.includedSessionIds,
							historicalInstanceCount: merged.includedSessionIds?.length,
							updatedAt: merged.updatedAt,
							agentId,
							channel,
							chatType,
							origin: sessionDeliveryOrigin(merged.storeEntry),
							modelOverride: merged.storeEntry?.modelOverride,
							providerOverride: merged.storeEntry?.providerOverride,
							modelProvider: merged.storeEntry?.modelProvider,
							model: merged.storeEntry?.model,
							usage,
							contextWeight: includeContextWeight ? merged.storeEntry?.systemPromptReport ?? null : void 0
						});
					}
					const tail = buildUsageAggregateTail({
						byChannelMap,
						latencyTotals,
						dailyLatencyMap,
						modelDailyMap,
						dailyMap: dailyAggregateMap
					});
					const aggregates = {
						sessionCount: activeSessionCount,
						...longestSessionDurationMs > 0 ? { longestSessionDurationMs } : {},
						messages: aggregateMessages,
						tools: {
							totalCalls: Array.from(toolAggregateMap.values()).reduce((sum, count) => sum + count, 0),
							uniqueTools: toolAggregateMap.size,
							tools: Array.from(toolAggregateMap.entries()).map(([name, count]) => ({
								name,
								count
							})).toSorted((a, b) => b.count - a.count)
						},
						byModel: Array.from(byModelMap.values()).toSorted((a, b) => {
							const costDiff = (b.totals?.totalCost ?? 0) - (a.totals?.totalCost ?? 0);
							if (costDiff !== 0) return costDiff;
							return (b.totals?.totalTokens ?? 0) - (a.totals?.totalTokens ?? 0);
						}),
						byProvider: Array.from(byProviderMap.values()).toSorted((a, b) => {
							const costDiff = (b.totals?.totalCost ?? 0) - (a.totals?.totalCost ?? 0);
							if (costDiff !== 0) return costDiff;
							return (b.totals?.totalTokens ?? 0) - (a.totals?.totalTokens ?? 0);
						}),
						byAgent: Array.from(byAgentMap.entries()).map(([id, totals]) => ({
							agentId: id,
							totals
						})).toSorted((a, b) => (b.totals?.totalCost ?? 0) - (a.totals?.totalCost ?? 0)),
						...tail
					};
					return {
						updatedAt: now,
						startDate: formatDateLabel(startMs, dateInterpretation),
						endDate: formatDateLabel(endMs, dateInterpretation),
						sessions,
						totals: aggregateTotals,
						aggregates,
						cacheStatus
					};
				}
			});
		} catch (err) {
			if (err instanceof SessionsUsageInvalidRequestError) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, err.message));
				return;
			}
			throw err;
		}
		respond(true, result, void 0);
	},
	"sessions.usage.timeseries": async ({ respond, params, context }) => {
		const key = normalizeOptionalString(params?.key) ?? null;
		if (!key) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key is required for timeseries"));
			return;
		}
		const resolved = resolveSessionUsageFileOrRespond(key, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, entry, agentId, sessionId, sessionFile } = resolved;
		const timeseries = await loadSessionUsageTimeSeries({
			sessionId,
			sessionEntry: entry,
			sessionFile,
			config,
			agentId,
			maxPoints: 200
		});
		if (!timeseries) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, `No transcript found for session: ${key}`));
			return;
		}
		respond(true, timeseries, void 0);
	},
	"sessions.usage.logs": async ({ respond, params, context }) => {
		const key = normalizeOptionalString(params?.key) ?? null;
		if (!key) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "key is required for logs"));
			return;
		}
		const limit = typeof params?.limit === "number" && Number.isFinite(params.limit) ? Math.min(params.limit, 1e3) : 200;
		const resolved = resolveSessionUsageFileOrRespond(key, respond, context.getRuntimeConfig());
		if (!resolved) return;
		const { config, entry, agentId, sessionId, sessionFile } = resolved;
		respond(true, { logs: await loadSessionLogs({
			sessionId,
			sessionEntry: entry,
			sessionFile,
			config,
			agentId,
			limit
		}) ?? [] }, void 0);
	}
};
//#endregion
export { usageHandlers as t };
