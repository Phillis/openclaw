import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "./session-key-utils-Di3FvABa.js";
import { a as isPrimarySessionTranscriptFileName, d as parseSessionArchiveTimestamp, f as parseUsageCountedSessionIdFromFileName, g as materializeSessionArchiveForRead, s as isSessionArchiveArtifactName, u as isUsageCountedSessionTranscriptFileName } from "./artifacts-FzMa6c2e.js";
import { i as resolveSessionFilePathCore, l as resolveSessionTranscriptsDirForAgent, r as resolveDefaultSessionStorePath } from "./paths-DVAvlIOc.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { _t as stripMessageIdHints, ft as stripInboundMetadata, gt as stripEnvelope } from "./openclaw-state-db-kmBThqu6.js";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-B6LtW2cN.js";
import "./openclaw-agent-db-BEQsKM0c.js";
import { B as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-_0tYy-zT.js";
import { f as loadSessionEntry, l as listSessionTranscriptInstances } from "./session-accessor.sqlite-entry-Ik-U-wpI.js";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-10dvR_dO.js";
import { T as scanSessionTranscriptTree, b as isSessionTranscriptLeafControl, v as selectVisibleTranscriptEvents, y as isCanonicalSessionTranscriptEntry } from "./session-transcript-index-_z9fjL8c.js";
import "./session-accessor-fcDZuc2H.js";
import { A as readTranscriptStatsSync, S as loadTranscriptEventsSync, T as readTranscriptEventAtSeqSync, y as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
import { o as normalizeUsage } from "./usage-DNKCVmJi.js";
import { t as streamSessionTranscriptLines } from "./transcript-stream-Dmc7cIIB.js";
import { a as resolveModelCostConfigFingerprint, i as resolveModelCostConfig, t as estimateUsageCost } from "./usage-format-CVbhwZGU.js";
import { t as createTimeZoneDayKeyFormatter } from "./format-datetime-Bp7Mn3G9.js";
import { n as cloneCostUsageTotals, r as createEmptyCostUsageTotals, t as addCostUsageTotals } from "./session-cost-usage-totals-D4e-85ui.js";
import { a as writeSessionCostUsageRollup, i as readSessionCostUsageRollupRows, n as deleteSessionCostUsageRollupsExcept, r as isSessionCostUsageRefreshRunning, t as acquireSessionCostUsageRefreshLock } from "./session-cost-usage-cache.sqlite-CYlLdS_u.js";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
function resolveUsageCostSessionStorePath(params) {
	return params.sessionsDir ? path.join(params.sessionsDir, "sessions.json") : resolveDefaultSessionStorePath(params.agentId);
}
async function listUsageCountedTranscriptFileStats(agentId, params) {
	const sessionsDir = params?.sessionsDir ?? resolveSessionTranscriptsDirForAgent(agentId);
	let entries;
	try {
		entries = await fs.promises.readdir(sessionsDir, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	const { firstError, hasError, results } = await runTasksWithConcurrency({
		tasks: entries.filter((entry) => entry.isFile() && isUsageCountedSessionTranscriptFileName(entry.name)).map((entry) => async () => {
			const filePath = path.join(sessionsDir, entry.name);
			let stats;
			try {
				stats = await fs.promises.stat(filePath);
			} catch (error) {
				if (error.code === "ENOENT") return;
				throw error;
			}
			if (params?.minMtimeMs !== void 0 && stats.mtimeMs < params.minMtimeMs) return;
			if (filePath.endsWith(".zst")) try {
				const materialized = materializeSessionArchiveForRead(filePath);
				const materializedStats = await fs.promises.stat(materialized);
				return {
					filePath: materialized,
					kind: "jsonl",
					size: materializedStats.size,
					mtimeMs: stats.mtimeMs,
					device: materializedStats.dev,
					inode: materializedStats.ino
				};
			} catch (error) {
				if (error.code === "ENOENT") return;
				throw error;
			}
			return {
				filePath,
				kind: "jsonl",
				size: stats.size,
				mtimeMs: stats.mtimeMs,
				device: stats.dev,
				inode: stats.ino
			};
		}),
		limit: 32
	});
	if (hasError) throw firstError;
	return results.filter((file) => Boolean(file));
}
function listUsageCountedSqliteTranscriptStats(agentId, params) {
	const storePath = resolveUsageCostSessionStorePath({
		agentId,
		...params?.sessionsDir ? { sessionsDir: params.sessionsDir } : {}
	});
	const files = [];
	for (const instance of listSessionTranscriptInstances({
		agentId,
		storePath,
		clone: false
	})) {
		const marker = {
			agentId,
			sessionId: instance.sessionId,
			storePath
		};
		const mtimeMs = instance.updatedAtMs;
		if (params?.minMtimeMs !== void 0 && mtimeMs < params.minMtimeMs) continue;
		const stats = readTranscriptStatsSync({
			agentId: marker.agentId,
			sessionId: marker.sessionId,
			storePath: marker.storePath
		});
		files.push({
			filePath: formatCanonicalUsageCostSqliteMarker(marker),
			kind: "sqlite",
			mtimeMs,
			sessionId: marker.sessionId,
			size: stats.sizeBytes,
			eventCount: stats.eventCount,
			maxSeq: stats.maxSeq
		});
	}
	return files;
}
function formatCanonicalUsageCostSqliteMarker(marker) {
	const storePath = resolveSqliteTargetFromSessionStorePath(marker.storePath, { agentId: marker.agentId }).path ?? resolveOpenClawAgentSqlitePath({ agentId: marker.agentId });
	return formatSqliteSessionFileMarker({
		...marker,
		storePath
	});
}
async function listUsageCountedTranscriptStats(agentId, params) {
	const fileBacked = await listUsageCountedTranscriptFileStats(agentId, params);
	const sqliteBacked = listUsageCountedSqliteTranscriptStats(agentId, params);
	const sqliteSessionIds = new Set(sqliteBacked.map((file) => file.sessionId).filter(Boolean));
	return [...fileBacked.filter((file) => {
		const sessionId = parseUsageCountedSessionIdFromFileName(path.basename(file.filePath));
		return !sessionId || !sqliteSessionIds.has(sessionId);
	}), ...sqliteBacked];
}
async function resolveUsageCostTranscriptFile(sessionFile) {
	const marker = parseSqliteSessionFileMarker(sessionFile);
	if (marker) {
		const stats = readTranscriptStatsSync({
			agentId: marker.agentId,
			sessionId: marker.sessionId,
			storePath: marker.storePath
		});
		return {
			filePath: formatCanonicalUsageCostSqliteMarker(marker),
			kind: "sqlite",
			mtimeMs: stats.lastMutationAtMs ?? 0,
			sessionId: marker.sessionId,
			size: stats.sizeBytes,
			eventCount: stats.eventCount,
			maxSeq: stats.maxSeq
		};
	}
	if (sessionFile.endsWith(".zst")) try {
		const archiveStats = await fs.promises.stat(sessionFile);
		const materialized = materializeSessionArchiveForRead(sessionFile);
		const materializedStats = await fs.promises.stat(materialized);
		return {
			filePath: materialized,
			kind: "jsonl",
			size: materializedStats.size,
			mtimeMs: archiveStats.mtimeMs,
			device: materializedStats.dev,
			inode: materializedStats.ino
		};
	} catch {
		return;
	}
	const stats = await fs.promises.stat(sessionFile).catch(() => null);
	return stats ? {
		filePath: sessionFile,
		kind: "jsonl",
		size: stats.size,
		mtimeMs: stats.mtimeMs,
		device: stats.dev,
		inode: stats.ino
	} : void 0;
}
function loadSqliteUsageTranscriptEvents(marker) {
	return selectVisibleTranscriptEvents(loadTranscriptEventsSync({
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		storePath: marker.storePath
	})).filter(isRecord);
}
async function* readTranscriptRecords(filePath) {
	const marker = parseSqliteSessionFileMarker(filePath);
	if (marker) {
		for (const event of loadSqliteUsageTranscriptEvents(marker)) yield event;
		return;
	}
	const transcriptPath = filePath.endsWith(".zst") ? materializeSessionArchiveForRead(filePath) : filePath;
	for await (const line of streamSessionTranscriptLines(transcriptPath)) try {
		const parsed = JSON.parse(line);
		if (isRecord(parsed)) yield parsed;
	} catch {}
}
async function* readTranscriptRecordsBestEffort(filePath) {
	try {
		yield* readTranscriptRecords(filePath);
	} catch {}
}
function resolveExistingUsageSessionFile(params) {
	const sessionId = normalizeOptionalString(params.sessionId);
	const target = params.sessionTarget ? {
		agentId: normalizeOptionalString(params.sessionTarget.agentId),
		sessionId: normalizeOptionalString(params.sessionTarget.sessionId),
		sessionKey: normalizeOptionalString(params.sessionTarget.sessionKey),
		storePath: normalizeOptionalString(params.sessionTarget.storePath)
	} : void 0;
	const completeTarget = Boolean(target?.agentId && target.sessionId && target.sessionKey && target.storePath);
	if (target && completeTarget) {
		const targetKeyAgentId = parseAgentSessionKey(target.sessionKey)?.agentId;
		const targetKeyEntry = loadSessionEntry({
			agentId: target.agentId,
			sessionKey: target.sessionKey,
			storePath: target.storePath
		});
		if (sessionId !== void 0 && target.sessionId !== sessionId || target.agentId !== params.agentId || targetKeyAgentId && targetKeyAgentId !== target.agentId || targetKeyEntry && targetKeyEntry.sessionId !== target.sessionId) return;
		return formatCanonicalUsageCostSqliteMarker({
			agentId: target.agentId,
			sessionId: target.sessionId,
			storePath: target.storePath
		});
	}
	const legacySessionFile = params.sessionEntry?.sessionFile;
	const entryMarker = parseSqliteSessionFileMarker(typeof legacySessionFile === "string" ? legacySessionFile : void 0);
	const explicitMarker = parseSqliteSessionFileMarker(params.sessionFile);
	const matchingEntryMarker = entryMarker && (!sessionId || entryMarker.sessionId === sessionId) ? entryMarker : void 0;
	const matchingExplicitMarker = explicitMarker && explicitMarker.agentId === params.agentId && (!sessionId || explicitMarker.sessionId === sessionId) ? explicitMarker : void 0;
	if (!matchingEntryMarker && explicitMarker && !matchingExplicitMarker) return;
	const sqliteMarker = matchingEntryMarker ?? matchingExplicitMarker;
	const targetKeyAgentId = parseAgentSessionKey(target?.sessionKey)?.agentId;
	const targetKeyEntry = target?.sessionKey && sqliteMarker && !completeTarget ? loadSessionEntry({
		agentId: sqliteMarker.agentId,
		sessionKey: target.sessionKey,
		storePath: sqliteMarker.storePath
	}) : void 0;
	if (target && !completeTarget && sqliteMarker && (target.agentId && target.agentId !== sqliteMarker.agentId || target.sessionId && target.sessionId !== sqliteMarker.sessionId || targetKeyAgentId && targetKeyAgentId !== sqliteMarker.agentId || target.sessionKey && targetKeyEntry?.sessionId !== sqliteMarker.sessionId || target.storePath && path.resolve(target.storePath) !== path.resolve(sqliteMarker.storePath))) return;
	if (sqliteMarker) return formatSqliteSessionFileMarker(sqliteMarker);
	if (entryMarker && !params.sessionFile) return;
	const candidate = params.sessionFile ?? (sessionId ? resolveSessionFilePathCore(sessionId, params.sessionEntry, { agentId: params.agentId }) : void 0);
	if (candidate && fs.existsSync(candidate)) return candidate;
	if (!sessionId) return candidate;
	try {
		const sessionsDir = candidate ? path.dirname(candidate) : resolveSessionTranscriptsDirForAgent(params.agentId);
		const baseFileName = `${sessionId}.jsonl`;
		const entries = fs.readdirSync(sessionsDir, { withFileTypes: true }).filter((entry) => {
			return entry.isFile() && (entry.name === baseFileName || entry.name.startsWith(`${baseFileName}.reset.`) || entry.name.startsWith(`${baseFileName}.deleted.`));
		});
		const primary = entries.find((entry) => entry.name === baseFileName);
		if (primary) return path.join(sessionsDir, primary.name);
		const latestArchive = entries.filter((entry) => isSessionArchiveArtifactName(entry.name)).map((entry) => entry.name).toSorted((a, b) => {
			const tsA = parseSessionArchiveTimestamp(a, "deleted") ?? parseSessionArchiveTimestamp(a, "reset") ?? 0;
			return (parseSessionArchiveTimestamp(b, "deleted") ?? parseSessionArchiveTimestamp(b, "reset") ?? 0) - tsA || b.localeCompare(a);
		})[0];
		return latestArchive ? path.join(sessionsDir, latestArchive) : candidate;
	} catch {
		return candidate;
	}
}
//#endregion
//#region src/utils/transcript-tools.ts
/**
* Transcript inspection helpers shared by session filesystem views and usage metrics.
* Keep provider-specific block aliases centralized so both surfaces classify tools consistently.
*/
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set([
	"tool_use",
	"toolcall",
	"tool_call"
]);
const TOOL_RESULT_TYPES = /* @__PURE__ */ new Set(["tool_result", "tool_result_error"]);
const normalizeType = (value) => {
	return typeof value === "string" ? normalizeOptionalLowercaseString(value) ?? "" : "";
};
/** Extracts de-duplicated tool names from direct fields and structured content blocks. */
const extractToolCallNames = (message) => {
	const names = /* @__PURE__ */ new Set();
	const toolNameRaw = message.toolName ?? message.tool_name;
	const toolName = typeof toolNameRaw === "string" ? normalizeOptionalString(toolNameRaw) : void 0;
	if (toolName) names.add(toolName);
	const content = message.content;
	if (!Array.isArray(content)) return Array.from(names);
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeType(block.type);
		if (!TOOL_CALL_TYPES.has(type)) continue;
		const name = typeof block.name === "string" ? normalizeOptionalString(block.name) : void 0;
		if (name) names.add(name);
	}
	return Array.from(names);
};
/** Counts recognized tool-result blocks and the subset explicitly marked as errors. */
const countToolResults = (message) => {
	const content = message.content;
	if (!Array.isArray(content)) return {
		total: 0,
		errors: 0
	};
	let total = 0;
	let errors = 0;
	for (const entry of content) {
		if (!entry || typeof entry !== "object") continue;
		const block = entry;
		const type = normalizeType(block.type);
		if (!TOOL_RESULT_TYPES.has(type)) continue;
		total += 1;
		if (block.is_error === true) errors += 1;
	}
	return {
		total,
		errors
	};
};
//#endregion
//#region src/infra/session-cost-usage-pricing.ts
const normalizeUsageCostTotalOrigin = (value) => value === "provider-billed" ? value : void 0;
const extractCostBreakdown = (usageRaw) => {
	if (!usageRaw || typeof usageRaw !== "object") return;
	const cost = usageRaw.cost;
	if (!cost) return;
	const total = asFiniteNumber(cost.total);
	if (total === void 0 || total < 0) return;
	return {
		total,
		input: asFiniteNumber(cost.input),
		output: asFiniteNumber(cost.output),
		cacheRead: asFiniteNumber(cost.cacheRead),
		cacheWrite: asFiniteNumber(cost.cacheWrite),
		totalOrigin: normalizeUsageCostTotalOrigin(cost.totalOrigin)
	};
};
const parseTimestamp = (entry) => {
	const message = entry.message;
	const messageTimestamp = asFiniteNumber(message?.timestamp);
	if (messageTimestamp !== void 0) {
		const parsed = new Date(messageTimestamp);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
	const raw = entry.timestamp;
	if (typeof raw === "string") {
		const parsed = new Date(raw);
		if (!Number.isNaN(parsed.valueOf())) return parsed;
	}
};
const parseTranscriptEntry = (entry) => {
	const message = entry.message;
	if (!message || typeof message !== "object") return null;
	const roleRaw = message.role;
	const role = roleRaw === "user" || roleRaw === "assistant" ? roleRaw : void 0;
	const isStandaloneToolResult = roleRaw === "tool" || roleRaw === "toolResult";
	if (!role && !isStandaloneToolResult) return null;
	const usageRaw = message.usage ?? entry.usage;
	const usage = usageRaw ? normalizeUsage(usageRaw) ?? void 0 : void 0;
	const provider = (typeof message.provider === "string" ? message.provider : void 0) ?? (typeof entry.provider === "string" ? entry.provider : void 0);
	const model = (typeof message.model === "string" ? message.model : void 0) ?? (typeof entry.model === "string" ? entry.model : void 0);
	const costBreakdown = extractCostBreakdown(usageRaw);
	const stopReason = typeof message.stopReason === "string" ? message.stopReason : void 0;
	const durationMs = asFiniteNumber(message.durationMs ?? entry.durationMs);
	return {
		message,
		role,
		timestamp: parseTimestamp(entry),
		durationMs,
		usage,
		costTotal: costBreakdown?.total,
		costBreakdown,
		provider,
		model,
		stopReason,
		toolNames: isStandaloneToolResult ? [] : extractToolCallNames(message),
		toolResultCounts: isStandaloneToolResult ? {
			total: 1,
			errors: message.isError === true || message.is_error === true ? 1 : 0
		} : countToolResults(message)
	};
};
const computeUsageTokenTotals = (usage) => {
	const input = usage.input ?? 0;
	const output = usage.output ?? 0;
	const cacheRead = usage.cacheRead ?? 0;
	const cacheWrite = usage.cacheWrite ?? 0;
	const componentTotal = input + output + cacheRead + cacheWrite;
	return {
		input,
		output,
		cacheRead,
		cacheWrite,
		componentTotal,
		totalTokens: usage.total ?? componentTotal
	};
};
const applyUsageTotals = (totals, usage) => {
	const usageTotals = computeUsageTokenTotals(usage);
	totals.input += usageTotals.input;
	totals.output += usageTotals.output;
	totals.cacheRead += usageTotals.cacheRead;
	totals.cacheWrite += usageTotals.cacheWrite;
	totals.totalTokens += usageTotals.totalTokens;
};
const applyCostBreakdown = (totals, costBreakdown) => {
	if (costBreakdown === void 0 || costBreakdown.total === void 0) return;
	totals.totalCost += costBreakdown.total;
	totals.inputCost += costBreakdown.input ?? 0;
	totals.outputCost += costBreakdown.output ?? 0;
	totals.cacheReadCost += costBreakdown.cacheRead ?? 0;
	totals.cacheWriteCost += costBreakdown.cacheWrite ?? 0;
};
const applyCostTotal = (totals, costTotal, provider, model) => {
	if (costTotal === void 0) {
		totals.missingCostEntries += 1;
		const modelKey = `${normalizeOptionalString(provider) ?? "unknown"}/${normalizeOptionalString(model) ?? "unknown"}`;
		totals.missingCostByModel ??= {};
		totals.missingCostByModel[modelKey] = (totals.missingCostByModel[modelKey] ?? 0) + 1;
		return;
	}
	totals.totalCost += costTotal;
};
const isModelPricingKnown = (cost) => {
	if (!cost) return false;
	if (cost.tieredPricing && cost.tieredPricing.length > 0) return true;
	return cost.input > 0 || cost.output > 0 || cost.cacheRead > 0 || cost.cacheWrite > 0;
};
const shouldPreserveRecordedZeroCost = (costBreakdown) => costBreakdown?.total === 0 && (costBreakdown.totalOrigin === "provider-billed" || [
	costBreakdown.input,
	costBreakdown.output,
	costBreakdown.cacheRead,
	costBreakdown.cacheWrite
].some((value) => value !== void 0 && value !== 0));
const shouldRecomputeRecordedZeroCost = (params) => params.costTotal === 0 && !shouldPreserveRecordedZeroCost(params.costBreakdown) && isModelPricingKnown(params.cost) && computeUsageTokenTotals(params.usage).totalTokens > 0;
function createUsageCostResolver(params) {
	const cache = /* @__PURE__ */ new Map();
	return ({ provider, model }) => {
		const key = `${provider ?? ""}\0${model ?? ""}`;
		if (cache.has(key)) return cache.get(key);
		const cost = resolveModelCostConfig({
			provider,
			model,
			config: params?.config,
			agentDir: params?.agentDir
		});
		cache.set(key, cost);
		return cost;
	};
}
function parseUsageCostTranscriptEntry(parsed, resolveCost) {
	const entry = parseTranscriptEntry(parsed);
	if (!entry?.usage) return entry;
	const cost = resolveCost({
		provider: entry.provider,
		model: entry.model
	});
	const usageTotals = computeUsageTokenTotals(entry.usage);
	const pricingKnown = isModelPricingKnown(cost);
	const preserveRecordedZeroCost = shouldPreserveRecordedZeroCost(entry.costBreakdown);
	if (cost?.tieredPricing && cost.tieredPricing.length > 0 && !preserveRecordedZeroCost) {
		entry.costTotal = estimateUsageCost({
			usage: entry.usage,
			cost
		});
		entry.costBreakdown = void 0;
	} else if (!pricingKnown && !preserveRecordedZeroCost && (entry.costTotal === void 0 || entry.costTotal === 0) && usageTotals.totalTokens > 0) {
		entry.costTotal = void 0;
		entry.costBreakdown = void 0;
	} else if (entry.costTotal === void 0 || shouldRecomputeRecordedZeroCost({
		usage: entry.usage,
		cost,
		costBreakdown: entry.costBreakdown,
		costTotal: entry.costTotal
	})) {
		entry.costTotal = estimateUsageCost({
			usage: entry.usage,
			cost
		});
		entry.costBreakdown = void 0;
	}
	return entry;
}
//#endregion
//#region src/shared/usage-aggregates.ts
/** Builds a collision-free identity while preserving legacy missing-as-unknown grouping. */
function usageModelIdentity(provider, model) {
	return JSON.stringify([provider ?? "unknown", model ?? "unknown"]);
}
/** Extends the model identity with its calendar bucket without delimiter ambiguity. */
function usageDailyModelIdentity(date, provider, model) {
	return JSON.stringify([
		date,
		provider ?? "unknown",
		model ?? "unknown"
	]);
}
/** Merges latency summaries by keeping weighted averages as sum/count accumulator state. */
function mergeUsageLatency(totals, latency) {
	if (!latency || latency.count <= 0) return;
	totals.count += latency.count;
	totals.sum += latency.avgMs * latency.count;
	totals.min = Math.min(totals.min, latency.minMs);
	totals.max = Math.max(totals.max, latency.maxMs);
	totals.p95Max = Math.max(totals.p95Max, latency.p95Ms);
}
/** Groups daily latency summaries by date while preserving weighted averages for output. */
function mergeUsageDailyLatency(dailyLatencyMap, dailyLatency) {
	for (const day of dailyLatency ?? []) {
		const existing = dailyLatencyMap.get(day.date) ?? {
			date: day.date,
			count: 0,
			sum: 0,
			min: Number.POSITIVE_INFINITY,
			max: 0,
			p95Max: 0
		};
		existing.count += day.count;
		existing.sum += day.avgMs * day.count;
		existing.min = Math.min(existing.min, day.minMs);
		existing.max = Math.max(existing.max, day.maxMs);
		existing.p95Max = Math.max(existing.p95Max, day.p95Ms);
		dailyLatencyMap.set(day.date, existing);
	}
}
/** Builds deterministic usage aggregate arrays for API responses and UI rendering. */
function buildUsageAggregateTail(params) {
	return {
		byChannel: Array.from(params.byChannelMap.entries()).map(([channel, totals]) => ({
			channel,
			totals
		})).toSorted((a, b) => b.totals.totalCost - a.totals.totalCost),
		latency: params.latencyTotals.count > 0 ? {
			count: params.latencyTotals.count,
			avgMs: params.latencyTotals.sum / params.latencyTotals.count,
			minMs: params.latencyTotals.min === Number.POSITIVE_INFINITY ? 0 : params.latencyTotals.min,
			maxMs: params.latencyTotals.max,
			p95Ms: params.latencyTotals.p95Max
		} : void 0,
		dailyLatency: Array.from(params.dailyLatencyMap.values()).map((entry) => ({
			date: entry.date,
			count: entry.count,
			avgMs: entry.count ? entry.sum / entry.count : 0,
			minMs: entry.min === Number.POSITIVE_INFINITY ? 0 : entry.min,
			maxMs: entry.max,
			p95Ms: entry.p95Max
		})).toSorted((a, b) => a.date.localeCompare(b.date)),
		modelDaily: Array.from(params.modelDailyMap.values()).toSorted((a, b) => a.date.localeCompare(b.date) || b.cost - a.cost),
		daily: Array.from(params.dailyMap.values()).toSorted((a, b) => a.date.localeCompare(b.date))
	};
}
//#endregion
//#region src/infra/session-cost-usage-rollup.ts
const MAX_LATENCY_MS = 720 * 60 * 1e3;
const MAX_LATENCY_CENTROIDS = 64;
const ERROR_STOP_REASONS = /* @__PURE__ */ new Set([
	"error",
	"aborted",
	"timeout"
]);
function emptyMessageCounts() {
	return {
		total: 0,
		user: 0,
		assistant: 0,
		toolCalls: 0,
		toolResults: 0,
		errors: 0
	};
}
function createLatencyAggregate() {
	return {
		centroids: [],
		count: 0,
		max: 0,
		sum: 0
	};
}
function compressLatencyCentroids(aggregate) {
	while (aggregate.centroids.length > MAX_LATENCY_CENTROIDS) {
		aggregate.centroids.sort((a, b) => a.value - b.value);
		let mergeIndex = 0;
		let smallestGap = Number.POSITIVE_INFINITY;
		for (let index = 1; index < aggregate.centroids.length; index += 1) {
			const gap = (aggregate.centroids[index]?.value ?? 0) - (aggregate.centroids[index - 1]?.value ?? 0);
			if (gap < smallestGap) {
				smallestGap = gap;
				mergeIndex = index - 1;
			}
		}
		const left = aggregate.centroids[mergeIndex];
		const right = aggregate.centroids[mergeIndex + 1];
		if (!left || !right) break;
		const count = left.count + right.count;
		aggregate.centroids.splice(mergeIndex, 2, {
			count,
			value: (left.value * left.count + right.value * right.count) / count
		});
	}
}
function addLatencyValue(aggregate, value) {
	const wasEmpty = aggregate.count === 0;
	aggregate.count += 1;
	aggregate.sum += value;
	aggregate.min = wasEmpty ? value : Math.min(aggregate.min ?? value, value);
	aggregate.max = Math.max(aggregate.max, value);
	aggregate.centroids.push({
		count: 1,
		value
	});
	compressLatencyCentroids(aggregate);
}
function mergeLatencyAggregate(target, source) {
	if (source.count === 0) return;
	const targetWasEmpty = target.count === 0;
	const sourceMin = source.min ?? source.max;
	target.count += source.count;
	target.sum += source.sum;
	target.min = targetWasEmpty ? sourceMin : Math.min(target.min ?? target.max, sourceMin);
	target.max = Math.max(target.max, source.max);
	target.centroids.push(...source.centroids.map((centroid) => ({
		count: centroid.count,
		value: centroid.value
	})));
	compressLatencyCentroids(target);
}
function createUntimestampedRollup() {
	return {
		totals: createEmptyCostUsageTotals(),
		messageCounts: emptyMessageCounts(),
		tools: [],
		models: []
	};
}
function createSessionUsageRollupData() {
	return {
		buckets: {},
		untimestamped: createUntimestampedRollup()
	};
}
function incrementTool(tools, name) {
	const existing = tools.find((entry) => entry.name === name);
	if (existing) existing.count += 1;
	else tools.push({
		name,
		count: 1
	});
}
function mergeTools(target, tools) {
	for (const tool of tools) target.set(tool.name, (target.get(tool.name) ?? 0) + tool.count);
}
function addModelUsage(models, provider, model, totals) {
	if (!provider && !model) return;
	const modelRef = usageModelIdentity(provider, model);
	let existing = models.find((entry) => usageModelIdentity(entry.provider, entry.model) === modelRef);
	if (!existing) {
		existing = {
			provider,
			model,
			count: 0,
			totals: createEmptyCostUsageTotals()
		};
		models.push(existing);
	}
	existing.count += 1;
	addCostUsageTotals(existing.totals, totals);
}
function mergeModels(target, models) {
	for (const model of models) {
		const modelRef = usageModelIdentity(model.provider, model.model);
		const existing = target.get(modelRef) ?? {
			provider: model.provider,
			model: model.model,
			count: 0,
			totals: createEmptyCostUsageTotals()
		};
		existing.count += model.count;
		addCostUsageTotals(existing.totals, model.totals);
		target.set(modelRef, existing);
	}
}
function addMessageContribution(target, contribution) {
	if (contribution.role === "user") {
		target.user += 1;
		target.total += 1;
	} else if (contribution.role === "assistant") {
		target.assistant += 1;
		target.total += 1;
	}
	target.toolCalls += contribution.toolNames.length;
	target.toolResults += contribution.toolResultCounts.total;
	target.errors += contribution.toolResultCounts.errors;
	if (contribution.stopReason && ERROR_STOP_REASONS.has(contribution.stopReason)) target.errors += 1;
}
function createBucket(timestampMs) {
	return {
		timestampMs,
		...createUntimestampedRollup(),
		latency: createLatencyAggregate()
	};
}
function appendSessionUsageRollupContribution(rollup, contribution) {
	const timestamp = contribution.timestamp;
	const timedBucket = timestamp === void 0 ? void 0 : rollup.buckets[String(timestamp)] ??= createBucket(timestamp);
	const bucket = timedBucket ?? rollup.untimestamped;
	addMessageContribution(bucket.messageCounts, contribution);
	for (const toolName of contribution.toolNames) incrementTool(bucket.tools, toolName);
	if (contribution.usageTotals) {
		addCostUsageTotals(bucket.totals, contribution.usageTotals);
		addModelUsage(bucket.models, contribution.provider, contribution.model, contribution.usageTotals);
	}
	if (!timedBucket) return;
	if (contribution.role === "assistant") {
		const sourceUserTimestamp = contribution.durationMs === void 0 ? rollup.lastUserTimestamp : void 0;
		const latencyMs = contribution.durationMs ?? (sourceUserTimestamp !== void 0 ? Math.max(0, timedBucket.timestampMs - sourceUserTimestamp) : void 0);
		if (latencyMs !== void 0 && Number.isFinite(latencyMs) && latencyMs <= MAX_LATENCY_MS) addLatencyValue(timedBucket.latency, latencyMs);
	}
	if (contribution.role === "user") rollup.lastUserTimestamp = timedBucket.timestampMs;
}
function computeLatencyStats(aggregate) {
	if (aggregate.count === 0) return;
	const targetCount = Math.ceil(aggregate.count * .95);
	let seen = 0;
	let p95Ms = aggregate.max;
	for (const centroid of aggregate.centroids.toSorted((a, b) => a.value - b.value)) {
		seen += centroid.count;
		if (seen >= targetCount) {
			p95Ms = centroid.value;
			break;
		}
	}
	return {
		count: aggregate.count,
		avgMs: aggregate.sum / aggregate.count,
		p95Ms,
		minMs: aggregate.min ?? aggregate.max,
		maxMs: aggregate.max
	};
}
function getUtcQuarterHourBucketKey(date) {
	const dateKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
	const quarterIndex = Math.floor((date.getUTCHours() * 60 + date.getUTCMinutes()) / 15);
	return {
		date: dateKey,
		quarterIndex,
		bucketId: `${dateKey}\0${quarterIndex}`
	};
}
function addMessageCounts(target, source) {
	target.total += source.total;
	target.user += source.user;
	target.assistant += source.assistant;
	target.toolCalls += source.toolCalls;
	target.toolResults += source.toolResults;
	target.errors += source.errors;
}
function sortedModelUsage(models, sortByUsage = true) {
	if (models.size === 0) return;
	const values = Array.from(models.values());
	return sortByUsage ? values.toSorted((a, b) => {
		return b.totals.totalCost - a.totals.totalCost || b.totals.totalTokens - a.totals.totalTokens;
	}) : values;
}
function buildToolUsage(tools, sortTiesByName = true) {
	if (tools.size === 0) return;
	const entries = Array.from(tools.entries()).map(([name, count]) => ({
		name,
		count
	})).toSorted((a, b) => b.count - a.count || (sortTiesByName ? a.name.localeCompare(b.name) : 0));
	return {
		totalCalls: entries.reduce((sum, entry) => sum + entry.count, 0),
		uniqueTools: entries.length,
		tools: entries
	};
}
function mergeDatedRows(left, right, add) {
	const rows = /* @__PURE__ */ new Map();
	for (const row of [...left ?? [], ...right ?? []]) {
		const key = row.quarterIndex === void 0 ? row.date : `${row.date}:${row.quarterIndex}`;
		const existing = rows.get(key);
		if (existing) add(existing, row);
		else rows.set(key, { ...row });
	}
	return rows.size ? Array.from(rows.values()).toSorted((a, b) => a.date.localeCompare(b.date) || (a.quarterIndex ?? 0) - (b.quarterIndex ?? 0)) : void 0;
}
function mergeMessageCountSummaries(left, right) {
	if (!left && !right) return;
	const counts = emptyMessageCounts();
	for (const source of [left, right]) if (source) addMessageCounts(counts, source);
	return counts;
}
function mergeLatencyStats(left, right) {
	if (!left && !right) return;
	const leftCount = left?.count ?? 0;
	const rightCount = right?.count ?? 0;
	const count = leftCount + rightCount;
	return {
		count,
		avgMs: count > 0 ? ((left?.avgMs ?? 0) * leftCount + (right?.avgMs ?? 0) * rightCount) / count : 0,
		p95Ms: Math.max(left?.p95Ms ?? 0, right?.p95Ms ?? 0),
		minMs: Math.min(left?.minMs ?? Number.POSITIVE_INFINITY, right?.minMs ?? Number.POSITIVE_INFINITY),
		maxMs: Math.max(left?.maxMs ?? 0, right?.maxMs ?? 0)
	};
}
function mergeDailyLatencyStats(left, right) {
	const rows = /* @__PURE__ */ new Map();
	for (const row of [...left ?? [], ...right ?? []]) {
		const existing = rows.get(row.date);
		if (!existing) {
			rows.set(row.date, { ...row });
			continue;
		}
		const count = existing.count + row.count;
		existing.avgMs = count > 0 ? (existing.avgMs * existing.count + row.avgMs * row.count) / count : 0;
		existing.count = count;
		existing.p95Ms = Math.max(existing.p95Ms, row.p95Ms);
		existing.minMs = Math.min(existing.minMs, row.minMs);
		existing.maxMs = Math.max(existing.maxMs, row.maxMs);
	}
	return rows.size ? Array.from(rows.values()).toSorted((a, b) => a.date.localeCompare(b.date)) : void 0;
}
function mergeDailyModels(left, right) {
	const rows = /* @__PURE__ */ new Map();
	for (const row of [...left ?? [], ...right ?? []]) {
		const key = usageDailyModelIdentity(row.date, row.provider, row.model);
		const existing = rows.get(key);
		if (!existing) {
			rows.set(key, { ...row });
			continue;
		}
		existing.tokens += row.tokens;
		existing.cost += row.cost;
		existing.count += row.count;
	}
	return rows.size ? Array.from(rows.values()).toSorted((a, b) => a.date.localeCompare(b.date)) : void 0;
}
/** Merges historical session summaries through the canonical usage aggregation rules. */
function mergeSessionCostSummaryInto(target, source) {
	addCostUsageTotals(target, source);
	target.firstActivity = target.firstActivity === void 0 ? source.firstActivity : source.firstActivity === void 0 ? target.firstActivity : Math.min(target.firstActivity, source.firstActivity);
	target.lastActivity = target.lastActivity === void 0 ? source.lastActivity : source.lastActivity === void 0 ? target.lastActivity : Math.max(target.lastActivity, source.lastActivity);
	if (target.firstActivity !== void 0 && target.lastActivity !== void 0) target.durationMs = Math.max(0, target.lastActivity - target.firstActivity);
	const activityDates = /* @__PURE__ */ new Set([...target.activityDates ?? [], ...source.activityDates ?? []]);
	if (activityDates.size) target.activityDates = Array.from(activityDates).toSorted();
	target.dailyBreakdown = mergeDatedRows(target.dailyBreakdown, source.dailyBreakdown, (current, row) => {
		current.tokens += row.tokens;
		current.cost += row.cost;
	});
	target.dailyMessageCounts = mergeDatedRows(target.dailyMessageCounts, source.dailyMessageCounts, addMessageCounts);
	target.utcQuarterHourMessageCounts = mergeDatedRows(target.utcQuarterHourMessageCounts, source.utcQuarterHourMessageCounts, addMessageCounts);
	target.utcQuarterHourTokenUsage = mergeDatedRows(target.utcQuarterHourTokenUsage, source.utcQuarterHourTokenUsage, (current, row) => {
		current.input += row.input;
		current.output += row.output;
		current.cacheRead += row.cacheRead;
		current.cacheWrite += row.cacheWrite;
		current.totalTokens += row.totalTokens;
		current.totalCost += row.totalCost;
	});
	target.dailyLatency = mergeDailyLatencyStats(target.dailyLatency, source.dailyLatency);
	target.dailyModelUsage = mergeDailyModels(target.dailyModelUsage, source.dailyModelUsage);
	target.messageCounts = mergeMessageCountSummaries(target.messageCounts, source.messageCounts);
	const tools = /* @__PURE__ */ new Map();
	mergeTools(tools, target.toolUsage?.tools ?? []);
	mergeTools(tools, source.toolUsage?.tools ?? []);
	target.toolUsage = buildToolUsage(tools, false);
	const models = /* @__PURE__ */ new Map();
	mergeModels(models, target.modelUsage ?? []);
	mergeModels(models, source.modelUsage ?? []);
	target.modelUsage = sortedModelUsage(models, false);
	target.latency = mergeLatencyStats(target.latency, source.latency);
}
function usageBucketsInRange(rollup, startMs, endMs) {
	return Object.values(rollup.buckets).filter((bucket) => bucket.timestampMs >= startMs && bucket.timestampMs <= endMs).toSorted((a, b) => a.timestampMs - b.timestampMs);
}
function buildSessionCostSummaryFromRollup(params) {
	const totals = createEmptyCostUsageTotals();
	const messageCounts = emptyMessageCounts();
	const tools = /* @__PURE__ */ new Map();
	const models = /* @__PURE__ */ new Map();
	const activityDates = /* @__PURE__ */ new Set();
	const dailyUsage = /* @__PURE__ */ new Map();
	const dailyMessages = /* @__PURE__ */ new Map();
	const quarterMessages = /* @__PURE__ */ new Map();
	const quarterTokens = /* @__PURE__ */ new Map();
	const dailyLatencies = /* @__PURE__ */ new Map();
	const dailyModels = /* @__PURE__ */ new Map();
	const allLatencies = createLatencyAggregate();
	let firstActivity;
	let lastActivity;
	const mergeBucket = (bucket) => {
		const date = new Date(bucket.timestampMs);
		const dayKey = params.formatDay(date);
		const quarter = getUtcQuarterHourBucketKey(date);
		firstActivity = firstActivity === void 0 ? bucket.timestampMs : Math.min(firstActivity, bucket.timestampMs);
		lastActivity = lastActivity === void 0 ? bucket.timestampMs : Math.max(lastActivity, bucket.timestampMs);
		activityDates.add(dayKey);
		addCostUsageTotals(totals, bucket.totals);
		addMessageCounts(messageCounts, bucket.messageCounts);
		mergeTools(tools, bucket.tools);
		mergeModels(models, bucket.models);
		const daily = dailyUsage.get(dayKey) ?? {
			tokens: 0,
			cost: 0
		};
		daily.tokens += bucket.totals.totalTokens;
		daily.cost += bucket.totals.totalCost;
		dailyUsage.set(dayKey, daily);
		const dailyMessage = dailyMessages.get(dayKey) ?? {
			date: dayKey,
			...emptyMessageCounts()
		};
		addMessageCounts(dailyMessage, bucket.messageCounts);
		dailyMessages.set(dayKey, dailyMessage);
		const quarterMessage = quarterMessages.get(quarter.bucketId) ?? {
			date: quarter.date,
			quarterIndex: quarter.quarterIndex,
			...emptyMessageCounts()
		};
		addMessageCounts(quarterMessage, bucket.messageCounts);
		quarterMessages.set(quarter.bucketId, quarterMessage);
		const quarterUsage = quarterTokens.get(quarter.bucketId) ?? {
			date: quarter.date,
			quarterIndex: quarter.quarterIndex,
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			totalCost: 0
		};
		quarterUsage.input += bucket.totals.input;
		quarterUsage.output += bucket.totals.output;
		quarterUsage.cacheRead += bucket.totals.cacheRead;
		quarterUsage.cacheWrite += bucket.totals.cacheWrite;
		quarterUsage.totalTokens += bucket.totals.totalTokens;
		quarterUsage.totalCost += bucket.totals.totalCost;
		quarterTokens.set(quarter.bucketId, quarterUsage);
		for (const model of bucket.models) {
			const modelBucketId = usageDailyModelIdentity(dayKey, model.provider, model.model);
			const existing = dailyModels.get(modelBucketId) ?? {
				date: dayKey,
				provider: model.provider,
				model: model.model,
				tokens: 0,
				cost: 0,
				count: 0
			};
			existing.tokens += model.totals.totalTokens;
			existing.cost += model.totals.totalCost;
			existing.count += model.count;
			dailyModels.set(modelBucketId, existing);
		}
		mergeLatencyAggregate(allLatencies, bucket.latency);
		const dailyLatency = dailyLatencies.get(dayKey) ?? createLatencyAggregate();
		mergeLatencyAggregate(dailyLatency, bucket.latency);
		dailyLatencies.set(dayKey, dailyLatency);
	};
	for (const bucket of usageBucketsInRange(params.rollup, params.startMs, params.endMs)) mergeBucket(bucket);
	if (params.includeUntimestamped) {
		addCostUsageTotals(totals, params.rollup.untimestamped.totals);
		addMessageCounts(messageCounts, params.rollup.untimestamped.messageCounts);
		mergeTools(tools, params.rollup.untimestamped.tools);
		mergeModels(models, params.rollup.untimestamped.models);
	}
	const dailyLatency = Array.from(dailyLatencies.entries()).map(([date, aggregate]) => {
		const stats = computeLatencyStats(aggregate);
		return stats ? Object.assign({ date }, stats) : null;
	}).filter((entry) => entry !== null).toSorted((a, b) => a.date.localeCompare(b.date));
	const utcQuarterHourMessageCounts = Array.from(quarterMessages.values()).toSorted((a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex);
	const utcQuarterHourTokenUsage = Array.from(quarterTokens.values()).toSorted((a, b) => a.date.localeCompare(b.date) || a.quarterIndex - b.quarterIndex);
	return {
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		firstActivity,
		lastActivity,
		durationMs: firstActivity !== void 0 && lastActivity !== void 0 ? Math.max(0, lastActivity - firstActivity) : void 0,
		activityDates: Array.from(activityDates).toSorted(),
		dailyBreakdown: Array.from(dailyUsage.entries()).map(([date, usage]) => Object.assign({ date }, usage)).toSorted((a, b) => a.date.localeCompare(b.date)),
		dailyMessageCounts: Array.from(dailyMessages.values()).toSorted((a, b) => a.date.localeCompare(b.date)),
		utcQuarterHourMessageCounts: utcQuarterHourMessageCounts.length ? utcQuarterHourMessageCounts : void 0,
		utcQuarterHourTokenUsage: utcQuarterHourTokenUsage.length ? utcQuarterHourTokenUsage : void 0,
		dailyLatency: dailyLatency.length ? dailyLatency : void 0,
		dailyModelUsage: dailyModels.size ? Array.from(dailyModels.values()).toSorted((a, b) => a.date.localeCompare(b.date) || b.cost - a.cost) : void 0,
		messageCounts,
		toolUsage: buildToolUsage(tools),
		modelUsage: sortedModelUsage(models),
		latency: computeLatencyStats(allLatencies),
		...totals
	};
}
function addRollupToCostUsageSummary(params) {
	for (const bucket of usageBucketsInRange(params.rollup, params.startMs, params.endMs)) {
		const dayKey = params.formatDay(new Date(bucket.timestampMs));
		const daily = params.daily.get(dayKey) ?? createEmptyCostUsageTotals();
		addCostUsageTotals(daily, bucket.totals);
		params.daily.set(dayKey, daily);
		addCostUsageTotals(params.totals, bucket.totals);
	}
}
function cloneSessionUsageRollupData(rollup) {
	return {
		buckets: Object.fromEntries(Object.entries(rollup.buckets).map(([bucketId, bucket]) => [bucketId, {
			...bucket,
			totals: cloneCostUsageTotals(bucket.totals),
			messageCounts: { ...bucket.messageCounts },
			tools: bucket.tools.map((tool) => ({ ...tool })),
			models: bucket.models.map((model) => ({
				...model,
				totals: cloneCostUsageTotals(model.totals)
			})),
			latency: {
				count: bucket.latency.count,
				max: bucket.latency.max,
				sum: bucket.latency.sum,
				...bucket.latency.min !== void 0 ? { min: bucket.latency.min } : {},
				centroids: bucket.latency.centroids.map((centroid) => ({
					count: centroid.count,
					value: centroid.value
				}))
			}
		}])),
		...rollup.lastUserTimestamp !== void 0 ? { lastUserTimestamp: rollup.lastUserTimestamp } : {},
		untimestamped: {
			totals: cloneCostUsageTotals(rollup.untimestamped.totals),
			messageCounts: { ...rollup.untimestamped.messageCounts },
			tools: rollup.untimestamped.tools.map((tool) => ({ ...tool })),
			models: rollup.untimestamped.models.map((model) => ({
				...model,
				totals: cloneCostUsageTotals(model.totals)
			}))
		}
	};
}
//#endregion
//#region src/infra/session-cost-usage-aggregation.ts
const USAGE_COST_ROLLUP_VERSION = 2;
const USAGE_COST_FILE_ANCHOR_BYTES = 4096;
function resolveUsageCostCacheDatabasePath(agentId) {
	return resolveOpenClawAgentSqlitePath({ agentId: normalizeAgentId(agentId) });
}
function resolveUsageCostAgentDir(config, agentId) {
	return resolveAgentDir(config ?? {}, agentId);
}
function resolveUsageCostPricingFingerprint(config, agentDir) {
	return resolveModelCostConfigFingerprint(config, agentDir);
}
function normalizeUsageCostRollup(raw, pricingFingerprint) {
	if (!raw || typeof raw !== "object") return;
	const record = raw;
	if (record.version !== USAGE_COST_ROLLUP_VERSION || record.pricingFingerprint !== pricingFingerprint || !record.checkpoint || !record.rollup || typeof record.scannedAt !== "number" || typeof record.parsedRecords !== "number" || typeof record.countedRecords !== "number") return;
	return record;
}
function readUsageCostRollups(agentId, pricingFingerprint, databasePath, rows = readSessionCostUsageRollupRows(agentId, databasePath)) {
	const result = /* @__PURE__ */ new Map();
	for (const row of rows) try {
		const entry = normalizeUsageCostRollup(JSON.parse(row.valueJson), pricingFingerprint);
		if (entry) result.set(row.key, {
			entry,
			valueJson: row.valueJson
		});
	} catch {}
	return result;
}
function isUsageCostRollupFresh(params) {
	const checkpoint = params.stored?.entry.checkpoint;
	if (!checkpoint || checkpoint.kind !== params.file.kind) return false;
	if (checkpoint.kind === "jsonl") return checkpoint.observedSize === params.file.size && checkpoint.observedMtimeMs === params.file.mtimeMs && checkpoint.device === params.file.device && checkpoint.inode === params.file.inode;
	return checkpoint.size === params.file.size && checkpoint.mtimeMs === params.file.mtimeMs && checkpoint.eventCount === params.file.eventCount && checkpoint.maxSeq === params.file.maxSeq;
}
function canUseUsageCostRollupForPartial(params) {
	const checkpoint = params.stored?.entry.checkpoint;
	if (!checkpoint || checkpoint.kind !== params.file.kind) return false;
	if (checkpoint.kind === "jsonl") return checkpoint.parsedOffset <= params.file.size && checkpoint.device === params.file.device && checkpoint.inode === params.file.inode;
	return checkpoint.maxSeq <= (params.file.maxSeq ?? 0);
}
function getUsageCostStaleRollupFiles(params) {
	return params.files.filter((file) => !isUsageCostRollupFresh({
		stored: params.rollups.get(file.filePath),
		file
	}));
}
function countUsableUsageCostRollups(params) {
	return params.files.reduce((count, file) => count + (canUseUsageCostRollupForPartial({
		stored: params.rollups.get(file.filePath),
		file
	}) ? 1 : 0), 0);
}
function latestUsageCostRollupScan(rollups) {
	let latest = 0;
	for (const { entry } of rollups.values()) latest = Math.max(latest, entry.scannedAt);
	return latest || void 0;
}
function hashUsageCostCheckpoint(value) {
	return createHash("sha256").update(value).digest("base64url");
}
async function readJsonlAnchorHash(filePath, offset) {
	const start = Math.max(0, offset - USAGE_COST_FILE_ANCHOR_BYTES);
	const length = offset - start;
	if (length === 0) return hashUsageCostCheckpoint("");
	const handle = await fs.promises.open(filePath, "r").catch(() => null);
	if (!handle) return;
	try {
		const buffer = Buffer.alloc(length);
		const { bytesRead } = await handle.read(buffer, 0, length, start);
		return bytesRead === length ? hashUsageCostCheckpoint(buffer) : void 0;
	} finally {
		await handle.close().catch(() => void 0);
	}
}
function parseJsonlRecord(line) {
	const text = line.toString("utf8").trim();
	if (!text) return;
	try {
		const parsed = JSON.parse(text);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
async function scanJsonlRange(params) {
	if (params.endOffset <= params.startOffset) return params.startOffset;
	const stream = fs.createReadStream(params.filePath, {
		start: params.startOffset,
		end: params.endOffset - 1
	});
	let carry = Buffer.alloc(0);
	let carryStart = params.startOffset;
	let processedOffset = params.startOffset;
	try {
		for await (const chunk of stream) {
			const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			const data = carry.length === 0 ? bytes : Buffer.concat([carry, bytes]);
			let lineStart = 0;
			for (let newline = data.indexOf(10); newline >= 0; newline = data.indexOf(10, lineStart)) {
				const record = parseJsonlRecord(data.subarray(lineStart, newline));
				if (record) params.onRecord(record);
				processedOffset = carryStart + newline + 1;
				lineStart = newline + 1;
			}
			carry = data.subarray(lineStart);
			carryStart = processedOffset;
		}
		if (carry.length > 0) {
			const record = parseJsonlRecord(carry);
			if (record) {
				params.onRecord(record);
				processedOffset = params.endOffset;
			}
		}
		return processedOffset;
	} finally {
		stream.destroy();
	}
}
function appendParsedEntryToRollup(rollup, entry) {
	let usageTotals;
	if (entry.usage) {
		usageTotals = createEmptyCostUsageTotals();
		applyUsageTotals(usageTotals, entry.usage);
		if (entry.costBreakdown?.total !== void 0) applyCostBreakdown(usageTotals, entry.costBreakdown);
		else applyCostTotal(usageTotals, entry.costTotal, entry.provider, entry.model);
	}
	const timestamp = entry.timestamp?.getTime();
	appendSessionUsageRollupContribution(rollup, {
		timestamp,
		role: entry.role,
		durationMs: entry.durationMs,
		provider: entry.provider,
		model: entry.model,
		stopReason: entry.stopReason,
		toolNames: entry.toolNames,
		toolResultCounts: entry.toolResultCounts,
		usageTotals
	});
	return {
		parsedRecord: Boolean(entry.usage),
		countedRecord: Boolean(entry.usage && timestamp)
	};
}
function scanRecordsIntoRollup(params) {
	let countedRecords = 0;
	let parsedRecords = 0;
	for (const record of params.records) {
		const entry = parseUsageCostTranscriptEntry(record, params.resolveCost);
		if (!entry) continue;
		const counted = appendParsedEntryToRollup(params.rollup, entry);
		countedRecords += counted.countedRecord ? 1 : 0;
		parsedRecords += counted.parsedRecord ? 1 : 0;
	}
	return {
		countedRecords,
		parsedRecords
	};
}
function createUsageRollupScan(params) {
	const previous = params.appendOnly ? params.previous?.entry : void 0;
	const rollup = previous ? cloneSessionUsageRollupData(previous.rollup) : createSessionUsageRollupData();
	let countedRecords = 0;
	let parsedRecords = 0;
	return {
		addRecords(records) {
			const counts = scanRecordsIntoRollup({
				records,
				rollup,
				resolveCost: params.resolveCost
			});
			countedRecords += counts.countedRecords;
			parsedRecords += counts.parsedRecords;
		},
		finish(checkpoint) {
			return {
				version: USAGE_COST_ROLLUP_VERSION,
				pricingFingerprint: params.pricingFingerprint,
				checkpoint,
				scannedAt: Date.now(),
				parsedRecords: (previous?.parsedRecords ?? 0) + parsedRecords,
				countedRecords: (previous?.countedRecords ?? 0) + countedRecords,
				rollup
			};
		}
	};
}
async function scanJsonlUsageRollup(params) {
	const previousCheckpoint = params.previous?.entry.checkpoint.kind === "jsonl" ? params.previous.entry.checkpoint : void 0;
	const identityMatches = previousCheckpoint && previousCheckpoint.device === params.file.device && previousCheckpoint.inode === params.file.inode && previousCheckpoint.parsedOffset <= params.file.size && params.file.size > previousCheckpoint.observedSize;
	const previousAnchor = identityMatches ? await readJsonlAnchorHash(params.file.filePath, previousCheckpoint.parsedOffset) : void 0;
	const appendOnly = Boolean(identityMatches && previousAnchor === previousCheckpoint?.anchorHash && params.previous);
	const startOffset = appendOnly ? previousCheckpoint?.parsedOffset ?? 0 : 0;
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	const processedOffset = await scanJsonlRange({
		filePath: params.file.filePath,
		startOffset,
		endOffset: params.file.size,
		onRecord: (record) => scan.addRecords([record])
	});
	const postStats = await fs.promises.stat(params.file.filePath);
	if (postStats.dev !== params.file.device || postStats.ino !== params.file.inode || postStats.size < params.file.size) throw new Error(`transcript changed identity while scanning: ${params.file.filePath}`);
	const anchorHash = await readJsonlAnchorHash(params.file.filePath, processedOffset);
	if (!anchorHash) throw new Error(`transcript checkpoint unavailable: ${params.file.filePath}`);
	return scan.finish({
		kind: "jsonl",
		parsedOffset: processedOffset,
		observedSize: params.file.size,
		observedMtimeMs: params.file.mtimeMs,
		device: params.file.device ?? 0,
		inode: params.file.inode ?? 0,
		anchorHash
	});
}
function selectIncrementalSqliteRecords(records, previousLeafId) {
	let visibleLeafId = previousLeafId;
	const visible = [];
	for (const record of records) {
		if (isSessionTranscriptLeafControl(record) || record.appendMode === "side") return;
		if (!isCanonicalSessionTranscriptEntry(record)) continue;
		const id = typeof record.id === "string" && record.id ? record.id : void 0;
		if (!id) return;
		if (Object.hasOwn(record, "parentId")) {
			if ((record.parentId === null ? void 0 : record.parentId) !== visibleLeafId) return;
		}
		visible.push(record);
		visibleLeafId = id;
	}
	return {
		records: visible,
		...visibleLeafId ? { visibleLeafId } : {}
	};
}
function sqliteCheckpointAnchorHash(event) {
	return hashUsageCostCheckpoint(JSON.stringify(event));
}
async function scanSqliteUsageRollup(params) {
	const marker = parseSqliteSessionFileMarker(params.file.filePath);
	if (!marker) throw new Error(`invalid SQLite transcript marker: ${params.file.filePath}`);
	const maxSeq = params.file.maxSeq ?? 0;
	const eventCount = params.file.eventCount ?? 0;
	const scope = {
		agentId: marker.agentId,
		sessionId: marker.sessionId,
		storePath: marker.storePath
	};
	const snapshotLastRow = maxSeq > 0 ? readTranscriptEventAtSeqSync(scope, maxSeq) : void 0;
	if (maxSeq > 0 && !snapshotLastRow) throw new Error(`SQLite transcript checkpoint unavailable: ${params.file.filePath}`);
	const snapshotAnchorHash = snapshotLastRow ? sqliteCheckpointAnchorHash(snapshotLastRow.event) : hashUsageCostCheckpoint("");
	const previousCheckpoint = params.previous?.entry.checkpoint.kind === "sqlite" ? params.previous.entry.checkpoint : void 0;
	const previousAnchor = previousCheckpoint?.maxSeq ? readTranscriptEventAtSeqSync(scope, previousCheckpoint.maxSeq) : void 0;
	const anchorMatches = previousCheckpoint?.maxSeq === 0 || previousAnchor && sqliteCheckpointAnchorHash(previousAnchor.event) === previousCheckpoint?.anchorHash;
	const appendCandidate = Boolean(params.previous && previousCheckpoint && previousCheckpoint.maxSeq < maxSeq && previousCheckpoint.eventCount < eventCount && anchorMatches);
	const rows = loadTranscriptEventRowsAfterSeqSync(scope, appendCandidate ? previousCheckpoint?.maxSeq ?? 0 : 0, maxSeq);
	const rawRecords = rows.flatMap((row) => row.event && typeof row.event === "object" && !Array.isArray(row.event) ? [row.event] : []);
	const incremental = appendCandidate ? selectIncrementalSqliteRecords(rawRecords, previousCheckpoint?.visibleLeafId) : void 0;
	const appendOnly = Boolean(incremental && params.previous);
	const allRows = appendOnly ? rows : loadTranscriptEventRowsAfterSeqSync(scope, 0, maxSeq);
	const allRecords = appendOnly ? incremental?.records ?? [] : selectVisibleTranscriptEvents(allRows.map((row) => row.event)).flatMap((event) => event && typeof event === "object" && !Array.isArray(event) ? [event] : []);
	const scan = createUsageRollupScan({
		...params,
		appendOnly
	});
	scan.addRecords(allRecords);
	const postFile = await resolveUsageCostTranscriptFile(params.file.filePath);
	if (!postFile || (postFile.maxSeq ?? 0) < maxSeq || (postFile.eventCount ?? 0) < eventCount) throw new Error(`SQLite transcript changed while scanning: ${params.file.filePath}`);
	const currentLastRow = maxSeq > 0 ? readTranscriptEventAtSeqSync(scope, maxSeq) : void 0;
	if (maxSeq > 0 && !currentLastRow || currentLastRow && sqliteCheckpointAnchorHash(currentLastRow.event) !== snapshotAnchorHash) throw new Error(`SQLite transcript changed while scanning: ${params.file.filePath}`);
	const visibleLeafId = appendOnly ? incremental?.visibleLeafId : scanSessionTranscriptTree(allRows.map((row) => row.event)).leafId ?? void 0;
	return scan.finish({
		kind: "sqlite",
		maxSeq,
		eventCount,
		size: params.file.size,
		mtimeMs: params.file.mtimeMs,
		anchorHash: snapshotAnchorHash,
		...visibleLeafId ? { visibleLeafId } : {}
	});
}
async function scanUsageFileForRollup(params) {
	return params.file.kind === "sqlite" ? await scanSqliteUsageRollup(params) : await scanJsonlUsageRollup(params);
}
async function refreshCostUsageCacheForAgent(params) {
	const databasePath = params.databasePath ?? resolveUsageCostCacheDatabasePath(params.agentId);
	const lock = acquireSessionCostUsageRefreshLock(params.agentId, databasePath);
	if (!lock.acquired) return "busy";
	try {
		const agentDir = params.agentDir ?? resolveUsageCostAgentDir(params.config, params.agentId);
		const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config, agentDir);
		const rows = readSessionCostUsageRollupRows(params.agentId, databasePath);
		const rawValues = new Map(rows.map((row) => [row.key, row.valueJson]));
		const rollups = readUsageCostRollups(params.agentId, pricingFingerprint, databasePath, rows);
		const discoveredFiles = await listUsageCountedTranscriptStats(params.agentId, params.sessionsDir ? { sessionsDir: params.sessionsDir } : void 0);
		const requestedFiles = [];
		for (const requested of params.sessionFiles ?? []) {
			const resolved = await resolveUsageCostTranscriptFile(requested);
			if (resolved) requestedFiles.push(resolved);
		}
		const filesByPath = new Map(discoveredFiles.map((file) => [file.filePath, file]));
		for (const file of requestedFiles) filesByPath.set(file.filePath, file);
		const files = [...filesByPath.values()];
		deleteSessionCostUsageRollupsExcept({
			agentId: params.agentId,
			databasePath,
			liveKeys: new Set(files.map((file) => file.filePath)),
			rows
		});
		const requestedPaths = /* @__PURE__ */ new Set();
		for (const file of requestedFiles) requestedPaths.add(file.filePath);
		const refreshFiles = requestedPaths.size > 0 ? files.filter((file) => requestedPaths.has(file.filePath)) : params.startMs === void 0 ? files : files.filter((file) => file.mtimeMs >= params.startMs);
		const maxFiles = params.maxFiles !== void 0 && Number.isFinite(params.maxFiles) && params.maxFiles > 0 ? Math.floor(params.maxFiles) : void 0;
		const staleFiles = getUsageCostStaleRollupFiles({
			rollups,
			files: refreshFiles
		}).toSorted((a, b) => a.size - b.size || a.filePath.localeCompare(b.filePath)).slice(0, maxFiles);
		const resolveCost = createUsageCostResolver({
			config: params.config,
			agentDir
		});
		for (const file of staleFiles) {
			const entry = await scanUsageFileForRollup({
				file,
				previous: rollups.get(file.filePath),
				pricingFingerprint,
				resolveCost
			});
			const valueJson = JSON.stringify(entry);
			if (!writeSessionCostUsageRollup({
				agentId: params.agentId,
				databasePath,
				rollupId: file.filePath,
				previousValueJson: rawValues.get(file.filePath) ?? null,
				valueJson,
				updatedAt: entry.scannedAt
			})) throw new Error(`usage rollup changed while refreshing: ${file.filePath}`);
			rollups.set(file.filePath, {
				entry,
				valueJson
			});
			rawValues.set(file.filePath, valueJson);
		}
		return "refreshed";
	} finally {
		lock.release();
	}
}
//#endregion
//#region src/infra/session-cost-usage-projection.ts
const formatUtcDayKey = (date) => `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
const createUsageDayKeyFormatter = (dayBucket) => {
	if (dayBucket?.mode === "utc-offset") return (date) => formatUtcDayKey(new Date(date.getTime() + dayBucket.utcOffsetMinutes * 60 * 1e3));
	return createTimeZoneDayKeyFormatter(dayBucket?.mode === "time-zone" ? dayBucket.timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone);
};
/**
* Maximum window (in days) for which we will zero-fill missing calendar
* days. Bounded ranges from the UI's range filter top out at 90 days for
* the explicit picker and "All" is the wildcard escape hatch — anything
* wider than this threshold is treated as an all-time / open-ended range
* and falls back to sparse behavior (only days with activity), since a
* dense series at that scale would produce tens of thousands of zero
* buckets (e.g. a 1970-based startMs → ~20k entries) without any user
* value. 366 days covers a full year + leap-day cushion.
*/
const MAX_ZERO_FILL_DAYS = 366;
/**
* Parse a `YYYY-MM-DD` day key into its UTC calendar-day timestamp. The
* timestamp is only used to enumerate calendar labels; usage timestamps stay
* in their requested timezone bucket.
*/
const parseDayKeyToUtcMs = (dayKey) => {
	const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
	if (!match) return null;
	const year = Number(match[1]);
	const monthIdx = Number(match[2]) - 1;
	const day = Number(match[3]);
	const dayMs = Date.UTC(year, monthIdx, day);
	const date = new Date(dayMs);
	return date.getUTCFullYear() === year && date.getUTCMonth() === monthIdx && date.getUTCDate() === day ? dayMs : null;
};
/**
* Ensure the daily map has an entry for every calendar day in [startMs, endMs].
* Days without activity are inserted with a zero-valued totals bucket so the
* resulting `daily` series matches the requested range length (one bar per
* calendar day) instead of only covering days with recorded usage.
*
* Day keys must use the same calendar zone as the request range. Otherwise a
* remote Gateway can return local-date labels for UTC/browser-local ranges,
* which drops boundary usage when the UI compares calendar windows.
*/
const fillMissingDays = (dailyMap, startMs, endMs, formatDayKey) => {
	if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs < startMs) return;
	const dayMs = 1440 * 60 * 1e3;
	const startKey = formatDayKey(new Date(startMs));
	const endKey = formatDayKey(new Date(endMs));
	const startDayMs = parseDayKeyToUtcMs(startKey);
	const endDayMs = parseDayKeyToUtcMs(endKey);
	if (startDayMs === null || endDayMs === null) {
		if (!dailyMap.has(startKey)) dailyMap.set(startKey, createEmptyCostUsageTotals());
		if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
		return;
	}
	if (Math.floor((endDayMs - startDayMs) / dayMs) + 1 > MAX_ZERO_FILL_DAYS) return;
	const maxIterations = 367;
	for (let cursorMs = startDayMs, i = 0; cursorMs <= endDayMs && i < maxIterations; i += 1) {
		const key = formatUtcDayKey(new Date(cursorMs));
		if (!dailyMap.has(key)) dailyMap.set(key, createEmptyCostUsageTotals());
		cursorMs += dayMs;
	}
	if (!dailyMap.has(endKey)) dailyMap.set(endKey, createEmptyCostUsageTotals());
};
const countCalendarDays = (startMs, endMs, formatDayKey) => {
	const startDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(startMs)));
	const endDayMs = parseDayKeyToUtcMs(formatDayKey(new Date(endMs)));
	if (startDayMs === null || endDayMs === null || endDayMs < startDayMs) return Math.ceil((endMs - startMs) / (1440 * 60 * 1e3)) + 1;
	return Math.floor((endDayMs - startDayMs) / (1440 * 60 * 1e3)) + 1;
};
function buildCostUsageSummaryFromRollups(params) {
	const dailyMap = /* @__PURE__ */ new Map();
	const totals = createEmptyCostUsageTotals();
	const dayFormatter = createUsageDayKeyFormatter(params.dayBucket);
	const staleFiles = getUsageCostStaleRollupFiles(params);
	const cachedFiles = countUsableUsageCostRollups(params);
	for (const file of params.files) {
		const stored = params.rollups.get(file.filePath);
		if (!canUseUsageCostRollupForPartial({
			stored,
			file
		}) || !stored) continue;
		addRollupToCostUsageSummary({
			rollup: stored.entry.rollup,
			startMs: params.startMs,
			endMs: params.endMs,
			formatDay: dayFormatter,
			daily: dailyMap,
			totals
		});
	}
	fillMissingDays(dailyMap, params.startMs, params.endMs, dayFormatter);
	const status = params.refreshing ? "refreshing" : staleFiles.length > 0 ? cachedFiles > 0 ? "partial" : "stale" : "fresh";
	return {
		updatedAt: Date.now(),
		days: countCalendarDays(params.startMs, params.endMs, dayFormatter),
		daily: Array.from(dailyMap.entries()).map(([date, bucket]) => Object.assign({ date }, bucket)).toSorted((a, b) => a.date.localeCompare(b.date)),
		totals,
		cacheStatus: {
			status,
			cachedFiles,
			pendingFiles: staleFiles.length,
			staleFiles: staleFiles.length,
			refreshedAt: latestUsageCostRollupScan(params.rollups)
		}
	};
}
//#endregion
//#region src/infra/session-cost-usage-cache-runtime.ts
const USAGE_COST_REFRESH_RETRY_MIN_MS = 50;
const USAGE_COST_REFRESH_RETRY_MAX_MS = 5e3;
const logger = createSubsystemLogger("usage-cost-cache");
const usageCostRefreshes = /* @__PURE__ */ new Map();
async function loadCostUsageSummary(params) {
	const now = Date.now();
	const defaultStart = new Date(now);
	defaultStart.setDate(defaultStart.getDate() - 29);
	const startMs = params.startMs ?? defaultStart.getTime();
	const endMs = params.endMs ?? now;
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	const result = await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir,
		databasePath
	});
	const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config, agentDir);
	return buildCostUsageSummaryFromRollups({
		rollups: readUsageCostRollups(params.agentId, pricingFingerprint, databasePath),
		files: await listUsageCountedTranscriptStats(params.agentId),
		startMs,
		endMs,
		dayBucket: params.dayBucket,
		refreshing: result === "busy" || usageCostRefreshes.has(databasePath) || isSessionCostUsageRefreshRunning(params.agentId, databasePath)
	});
}
async function loadCostUsageSummaryFromCache(params) {
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config, agentDir);
	let rollups = readUsageCostRollups(params.agentId, pricingFingerprint, databasePath);
	let files = await listUsageCountedTranscriptStats(params.agentId);
	const staleFiles = getUsageCostStaleRollupFiles({
		rollups,
		files
	});
	if (params.requestRefresh !== false && staleFiles.length > 0) {
		const cachedFiles = countUsableUsageCostRollups({
			rollups,
			files
		});
		if (params.refreshMode === "sync-when-empty" && cachedFiles === 0) {
			const result = await refreshCostUsageCacheForAgent({
				config: params.config,
				agentId: params.agentId,
				agentDir,
				startMs: params.startMs
			});
			rollups = readUsageCostRollups(params.agentId, pricingFingerprint, databasePath);
			files = await listUsageCountedTranscriptStats(params.agentId);
			if (result === "refreshed" && getUsageCostStaleRollupFiles({
				rollups,
				files
			}).length > 0) requestCostUsageCacheRefresh({
				config: params.config,
				agentId: params.agentId
			});
		} else requestCostUsageCacheRefresh({
			config: params.config,
			agentId: params.agentId
		});
	}
	return buildCostUsageSummaryFromRollups({
		rollups,
		files,
		startMs: params.startMs,
		endMs: params.endMs,
		dayBucket: params.dayBucket,
		refreshing: usageCostRefreshes.has(databasePath) || isSessionCostUsageRefreshRunning(params.agentId, databasePath)
	});
}
async function loadSessionCostSummariesFromCache(params) {
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config, agentDir);
	const rollups = readUsageCostRollups(params.agentId, pricingFingerprint, databasePath);
	const { results: files } = await runTasksWithConcurrency({
		tasks: params.sessions.map((session) => async () => await resolveUsageCostTranscriptFile(session.sessionFile)),
		limit: 32
	});
	const staleFiles = /* @__PURE__ */ new Set();
	let cachedFiles = 0;
	const hasExplicitRange = params.startMs !== void 0 || params.endMs !== void 0;
	const startMs = params.startMs ?? Number.NEGATIVE_INFINITY;
	const endMs = params.endMs ?? Number.POSITIVE_INFINITY;
	const dayFormatter = createUsageDayKeyFormatter(params.dayBucket);
	const summaries = params.sessions.map((session, index) => {
		const file = files[index];
		const stored = file ? rollups.get(file.filePath) : void 0;
		if (!file || !stored || !isUsageCostRollupFresh({
			stored,
			file
		})) {
			staleFiles.add(file?.filePath ?? session.sessionFile);
			return null;
		}
		cachedFiles += 1;
		return buildSessionCostSummaryFromRollup({
			rollup: stored.entry.rollup,
			sessionId: session.sessionId,
			sessionFile: session.sessionFile,
			startMs,
			endMs,
			includeUntimestamped: params.includeUntimestamped === true || !hasExplicitRange,
			formatDay: dayFormatter
		});
	});
	const refreshRequested = params.requestRefresh !== false && staleFiles.size > 0;
	if (refreshRequested) requestCostUsageCacheRefresh({
		config: params.config,
		agentId: params.agentId,
		sessionFiles: [...staleFiles]
	});
	const refreshRunning = isSessionCostUsageRefreshRunning(params.agentId, databasePath);
	return {
		summaries,
		cacheStatus: {
			status: staleFiles.size === 0 ? "fresh" : refreshRunning || refreshRequested ? "refreshing" : cachedFiles > 0 ? "partial" : "stale",
			cachedFiles,
			pendingFiles: staleFiles.size,
			staleFiles: staleFiles.size,
			refreshedAt: latestUsageCostRollupScan(rollups)
		}
	};
}
function requestCostUsageCacheRefresh(params) {
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	const refreshKey = databasePath;
	const existing = usageCostRefreshes.get(refreshKey);
	if (existing) {
		mergeUsageCostRefreshRequest(existing, params);
		return;
	}
	const state = {
		agentId: params.agentId,
		config: params.config,
		databasePath,
		fullRefreshRequested: false,
		pendingSessionFiles: /* @__PURE__ */ new Set(),
		running: false,
		sessionsDir: resolveSessionTranscriptsDirForAgent(params.agentId),
		busyRetryDelayMs: USAGE_COST_REFRESH_RETRY_MIN_MS
	};
	mergeUsageCostRefreshRequest(state, params);
	usageCostRefreshes.set(refreshKey, state);
	scheduleUsageCostRefresh(refreshKey, state);
}
function mergeUsageCostRefreshRequest(state, params) {
	if (params.config) state.config = params.config;
	state.agentId = params.agentId;
	if (!params.sessionFiles) {
		state.fullRefreshRequested = true;
		return;
	}
	for (const sessionFile of params.sessionFiles) state.pendingSessionFiles.add(sessionFile);
}
function scheduleUsageCostRefresh(refreshKey, state, delayMs = 0) {
	if (state.running || state.timer) return;
	const timer = setTimeout(() => {
		state.timer = void 0;
		runQueuedUsageCostRefresh(refreshKey, state);
	}, delayMs);
	timer.unref?.();
	state.timer = timer;
}
const usageCostRefreshRuntime = { refreshCostUsageCacheForAgent };
async function runQueuedUsageCostRefresh(refreshKey, state) {
	state.running = true;
	let retryDelayMs = 0;
	try {
		while (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) {
			const fullRefreshRequested = state.fullRefreshRequested;
			const sessionFiles = fullRefreshRequested ? [] : [...state.pendingSessionFiles];
			if (!fullRefreshRequested) state.pendingSessionFiles.clear();
			state.fullRefreshRequested = false;
			if (await usageCostRefreshRuntime.refreshCostUsageCacheForAgent({
				config: state.config,
				agentId: state.agentId,
				databasePath: state.databasePath,
				sessionsDir: state.sessionsDir,
				sessionFiles: fullRefreshRequested ? void 0 : sessionFiles
			}) === "busy") {
				if (fullRefreshRequested) state.fullRefreshRequested = true;
				else for (const sessionFile of sessionFiles) state.pendingSessionFiles.add(sessionFile);
				retryDelayMs = state.busyRetryDelayMs;
				state.busyRetryDelayMs = Math.min(state.busyRetryDelayMs * 2, USAGE_COST_REFRESH_RETRY_MAX_MS);
				break;
			}
			state.busyRetryDelayMs = USAGE_COST_REFRESH_RETRY_MIN_MS;
		}
	} catch (error) {
		logger.warn(`background refresh failed: ${formatErrorMessage(error)}`, { error });
	} finally {
		state.running = false;
		if (state.fullRefreshRequested || state.pendingSessionFiles.size > 0) scheduleUsageCostRefresh(refreshKey, state, retryDelayMs);
		else usageCostRefreshes.delete(refreshKey);
	}
}
function clearUsageCostRefreshesForTest() {
	for (const state of usageCostRefreshes.values()) if (state.timer) clearTimeout(state.timer);
	usageCostRefreshes.clear();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionCostUsageTestApi")] = {
	requestCostUsageCacheRefresh,
	usageCostRefreshRuntime,
	clearUsageCostRefreshesForTest
};
//#endregion
//#region src/infra/session-cost-usage-reporting.ts
const USAGE_COST_DIRECT_REFRESH_RETRY_MS = 25;
/**
* Scan all transcript files to discover sessions not in the session store.
* Returns basic metadata for each discovered session.
*/
async function discoverAllSessions(params) {
	const files = await listUsageCountedTranscriptStats(params.agentId, { minMtimeMs: params.startMs });
	const discovered = /* @__PURE__ */ new Map();
	for (const file of files) {
		const filePath = file.filePath;
		const fileName = path.basename(filePath);
		const sqliteMarker = parseSqliteSessionFileMarker(filePath);
		const sessionId = sqliteMarker?.sessionId ?? parseUsageCountedSessionIdFromFileName(fileName);
		if (!sessionId) continue;
		const isPrimaryTranscript = sqliteMarker ? true : isPrimarySessionTranscriptFileName(fileName);
		let firstUserMessage;
		if (params.includeFirstUserMessage !== false) try {
			for await (const parsed of readTranscriptRecords(filePath)) try {
				const message = parsed.message;
				if (message?.role === "user") {
					const content = message.content;
					if (typeof content === "string") firstUserMessage = truncateUtf16Safe(content, 100);
					else if (Array.isArray(content)) {
						for (const block of content) if (typeof block === "object" && block && block.type === "text") {
							const text = block.text;
							if (typeof text === "string") firstUserMessage = truncateUtf16Safe(text, 100);
							break;
						}
					}
					break;
				}
			} catch {}
		} catch {}
		const existing = discovered.get(sessionId);
		const existingIsPrimary = existing ? isPrimarySessionTranscriptFileName(path.basename(existing.sessionFile)) : false;
		if (!existing || isPrimaryTranscript && !existingIsPrimary || isPrimaryTranscript === existingIsPrimary && file.mtimeMs >= existing.mtime) {
			discovered.set(sessionId, {
				sessionId,
				sessionFile: filePath,
				mtime: file.mtimeMs,
				firstUserMessage: firstUserMessage ?? existing?.firstUserMessage
			});
			continue;
		}
		if (!existing.firstUserMessage && firstUserMessage) {
			existing.firstUserMessage = firstUserMessage;
			discovered.set(sessionId, existing);
		}
	}
	return Array.from(discovered.values()).toSorted((a, b) => b.mtime - a.mtime);
}
async function loadSessionCostSummary(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	if (!await resolveUsageCostTranscriptFile(sessionFile)) return null;
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const databasePath = resolveUsageCostCacheDatabasePath(params.agentId);
	while (await refreshCostUsageCacheForAgent({
		config: params.config,
		agentId: params.agentId,
		agentDir,
		databasePath,
		sessionFiles: [sessionFile]
	}) === "busy") await new Promise((resolve) => {
		setTimeout(resolve, USAGE_COST_DIRECT_REFRESH_RETRY_MS);
	});
	const currentFile = await resolveUsageCostTranscriptFile(sessionFile);
	if (!currentFile) return null;
	const pricingFingerprint = resolveUsageCostPricingFingerprint(params.config, agentDir);
	const stored = readUsageCostRollups(params.agentId, pricingFingerprint, databasePath).get(currentFile.filePath);
	if (!stored || !isUsageCostRollupFresh({
		stored,
		file: currentFile
	})) return null;
	const hasExplicitRange = params.startMs !== void 0 || params.endMs !== void 0;
	return buildSessionCostSummaryFromRollup({
		rollup: stored.entry.rollup,
		sessionId: params.sessionId,
		sessionFile,
		startMs: params.startMs ?? Number.NEGATIVE_INFINITY,
		endMs: params.endMs ?? Number.POSITIVE_INFINITY,
		includeUntimestamped: params.includeUntimestamped === true || !hasExplicitRange,
		formatDay: createUsageDayKeyFormatter(params.dayBucket)
	});
}
async function loadSessionUsageTimeSeries(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	if (params.maxPoints !== void 0 && params.maxPoints !== null) {
		if (!Number.isFinite(params.maxPoints) || params.maxPoints <= 0) return {
			sessionId: params.sessionId,
			points: []
		};
	}
	const points = [];
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const record of readTranscriptRecords(sessionFile)) {
		const entry = parseUsageCostTranscriptEntry(record, resolveCost);
		const timestamp = entry?.timestamp?.getTime();
		if (!entry?.usage || !timestamp) continue;
		const { input, output, cacheRead, cacheWrite, totalTokens } = computeUsageTokenTotals(entry.usage);
		points.push({
			timestamp,
			input,
			output,
			cacheRead,
			cacheWrite,
			totalTokens,
			cost: entry.costTotal ?? 0
		});
	}
	let cumulativeTokens = 0;
	let cumulativeCost = 0;
	const sortedPoints = points.toSorted((a, b) => a.timestamp - b.timestamp).map((point) => {
		cumulativeTokens += point.totalTokens;
		cumulativeCost += point.cost;
		return Object.assign(point, {
			cumulativeTokens,
			cumulativeCost
		});
	});
	const maxPoints = params.maxPoints ?? 100;
	if (sortedPoints.length > maxPoints) {
		const step = Math.ceil(sortedPoints.length / maxPoints);
		const downsampled = [];
		let downsampledCumulativeTokens = 0;
		let downsampledCumulativeCost = 0;
		for (let i = 0; i < sortedPoints.length; i += step) {
			const bucket = sortedPoints.slice(i, i + step);
			const bucketLast = bucket[bucket.length - 1];
			if (!bucketLast) continue;
			let bucketInput = 0;
			let bucketOutput = 0;
			let bucketCacheRead = 0;
			let bucketCacheWrite = 0;
			let bucketTotalTokens = 0;
			let bucketCost = 0;
			for (const point of bucket) {
				bucketInput += point.input;
				bucketOutput += point.output;
				bucketCacheRead += point.cacheRead;
				bucketCacheWrite += point.cacheWrite;
				bucketTotalTokens += point.totalTokens;
				bucketCost += point.cost;
			}
			downsampledCumulativeTokens += bucketTotalTokens;
			downsampledCumulativeCost += bucketCost;
			downsampled.push({
				timestamp: bucketLast.timestamp,
				input: bucketInput,
				output: bucketOutput,
				cacheRead: bucketCacheRead,
				cacheWrite: bucketCacheWrite,
				totalTokens: bucketTotalTokens,
				cost: bucketCost,
				cumulativeTokens: downsampledCumulativeTokens,
				cumulativeCost: downsampledCumulativeCost
			});
		}
		return {
			sessionId: params.sessionId,
			points: downsampled
		};
	}
	return {
		sessionId: params.sessionId,
		points: sortedPoints
	};
}
async function loadSessionLogs(params) {
	const sessionFile = resolveExistingUsageSessionFile(params);
	if (!sessionFile) return null;
	if (!parseSqliteSessionFileMarker(sessionFile) && !fs.existsSync(sessionFile)) return null;
	const logs = [];
	if (params.limit !== void 0 && params.limit !== null) {
		if (!Number.isFinite(params.limit) || params.limit <= 0) return [];
	}
	const limit = params.limit ?? 50;
	const boundedLimit = Number.isInteger(limit);
	const retentionLimit = limit * 2;
	const agentDir = resolveUsageCostAgentDir(params.config, params.agentId);
	const resolveCost = createUsageCostResolver({
		config: params.config,
		agentDir
	});
	for await (const parsed of readTranscriptRecordsBestEffort(sessionFile)) try {
		const message = parsed.message;
		if (!message) continue;
		const role = message.role;
		if (role !== "user" && role !== "assistant" && role !== "tool" && role !== "toolResult") continue;
		const contentParts = [];
		const toolName = normalizeOptionalString(message.toolName ?? message.tool_name ?? message.name ?? message.tool);
		if (role === "tool" || role === "toolResult") {
			contentParts.push(`[Tool: ${toolName ?? "tool"}]`);
			contentParts.push("[Tool Result]");
		}
		const rawContent = message.content;
		if (typeof rawContent === "string") contentParts.push(rawContent);
		else if (Array.isArray(rawContent)) {
			const contentText = rawContent.map((block) => {
				if (typeof block === "string") return block;
				const b = block;
				if (b.type === "text" && typeof b.text === "string") return b.text;
				if (b.type === "tool_use") return `[Tool: ${typeof b.name === "string" ? b.name : "unknown"}]`;
				if (b.type === "tool_result") return "[Tool Result]";
				return "";
			}).filter(Boolean).join("\n");
			if (contentText) contentParts.push(contentText);
		}
		const rawToolCalls = message.tool_calls ?? message.toolCalls ?? message.function_call ?? message.functionCall;
		const toolCalls = Array.isArray(rawToolCalls) ? rawToolCalls : rawToolCalls ? [rawToolCalls] : [];
		if (toolCalls.length > 0) for (const call of toolCalls) {
			const callObj = call;
			const directName = typeof callObj.name === "string" ? callObj.name : void 0;
			const fn = callObj.function;
			const fnName = typeof fn?.name === "string" ? fn.name : void 0;
			const name = directName ?? fnName ?? "unknown";
			contentParts.push(`[Tool: ${name}]`);
		}
		let content = contentParts.join("\n").trim();
		if (!content) continue;
		content = stripInboundMetadata(content);
		if (role === "user") content = stripMessageIdHints(stripEnvelope(content)).trim();
		if (!content) continue;
		const maxLen = 2e3;
		if (content.length > maxLen) content = truncateUtf16Safe(content, maxLen) + "…";
		const timestamp = parseTimestamp(parsed)?.getTime() ?? 0;
		let tokens;
		let cost;
		if (role === "assistant") {
			const usageRaw = message.usage;
			const usage = normalizeUsage(usageRaw);
			if (usage) {
				tokens = usage.total ?? (usage.input ?? 0) + (usage.output ?? 0) + (usage.cacheRead ?? 0) + (usage.cacheWrite ?? 0);
				const breakdown = extractCostBreakdown(usageRaw);
				const costConfig = resolveCost({
					provider: (typeof message.provider === "string" ? message.provider : void 0) ?? (typeof parsed.provider === "string" ? parsed.provider : void 0),
					model: (typeof message.model === "string" ? message.model : void 0) ?? (typeof parsed.model === "string" ? parsed.model : void 0)
				});
				if (breakdown?.total !== void 0 && !shouldRecomputeRecordedZeroCost({
					usage,
					cost: costConfig,
					costBreakdown: breakdown,
					costTotal: breakdown.total
				})) cost = breakdown.total;
				else cost = estimateUsageCost({
					usage,
					cost: costConfig
				});
			}
		}
		logs.push({
			timestamp,
			role,
			content,
			tokens,
			cost
		});
		if (boundedLimit && logs.length > retentionLimit) {
			logs.sort((a, b) => a.timestamp - b.timestamp);
			logs.splice(0, logs.length - limit);
		}
	} catch {}
	if (boundedLimit) {
		logs.sort((a, b) => a.timestamp - b.timestamp);
		return logs.length > limit ? logs.slice(-limit) : logs;
	}
	const sortedLogs = logs.toSorted((a, b) => a.timestamp - b.timestamp);
	if (sortedLogs.length > limit) return sortedLogs.slice(-limit);
	return sortedLogs;
}
//#endregion
export { loadCostUsageSummary as a, mergeSessionCostSummaryInto as c, mergeUsageLatency as d, usageDailyModelIdentity as f, loadSessionUsageTimeSeries as i, buildUsageAggregateTail as l, resolveExistingUsageSessionFile as m, loadSessionCostSummary as n, loadCostUsageSummaryFromCache as o, usageModelIdentity as p, loadSessionLogs as r, loadSessionCostSummariesFromCache as s, discoverAllSessions as t, mergeUsageDailyLatency as u };
