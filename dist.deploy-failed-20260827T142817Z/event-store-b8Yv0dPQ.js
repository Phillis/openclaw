import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { g as pluginStateEntriesInKeyRange, o as registerPluginStateSyncSequencedJournalEntry } from "./plugin-state-store-3qJxZb8E.js";
import { d as resolveWorkspaceStateIdentity } from "./workspace-state-store-UQmL7k4K.js";
import { createHash } from "node:crypto";
//#region src/memory-host-sdk/event-store.ts
const MEMORY_HOST_EVENTS_PLUGIN_ID = "memory-core";
const MEMORY_HOST_EVENTS_NAMESPACE = "memory-host.events";
const MEMORY_HOST_EVENT_CURSORS_NAMESPACE = "memory-host.event-cursors";
const MAX_MEMORY_HOST_EVENTS = 1e4;
const MAX_MEMORY_HOST_EVENT_CURSORS = 1e3;
const MAX_MEMORY_HOST_EVENT_JSON_BYTES = 8 * 1024;
const MAX_MEMORY_HOST_EVENT_ITEMS = 10;
const MAX_MEMORY_HOST_EVENT_TEXT_BYTES = 2 * 1024;
const MAX_MEMORY_HOST_EVENT_PATH_BYTES = 256;
const WORKSPACE_HASH_BYTES = 24;
function normalizeMemoryHostWorkspaceKey(workspaceDir) {
	const resolved = resolveWorkspaceStateIdentity(workspaceDir).workspacePath.replace(/\\/g, "/");
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function memoryHostWorkspacePrefix(workspaceDir) {
	return createHash("sha256").update(normalizeMemoryHostWorkspaceKey(workspaceDir)).digest("hex").slice(0, WORKSPACE_HASH_BYTES);
}
function eventKeyPrefix(workspaceDir) {
	return `${memoryHostWorkspacePrefix(workspaceDir)}:event:`;
}
function eventKeyRangeEnd(workspaceDir) {
	return `${memoryHostWorkspacePrefix(workspaceDir)}:event;`;
}
function memoryHostEventStorageKey(workspaceDir, sequence) {
	if (!Number.isSafeInteger(sequence)) throw new Error("Memory host event sequence must be a safe integer");
	return `${eventKeyPrefix(workspaceDir)}1:${sequence.toString().padStart(16, "0")}`;
}
function cursorKey(workspaceDir) {
	return `${memoryHostWorkspacePrefix(workspaceDir)}:cursor`;
}
function truncateUtf8(value, maxBytes) {
	if (Buffer.byteLength(value, "utf8") <= maxBytes) return {
		value,
		truncated: false
	};
	let low = 0;
	let high = value.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(value.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
		else high = middle - 1;
	}
	const end = low > 0 && /[\uD800-\uDBFF]/u.test(value.charAt(low - 1)) ? low - 1 : low;
	return {
		value: `${value.slice(0, end)}…`,
		truncated: true
	};
}
function isFiniteNumber(value) {
	return typeof value === "number" && Number.isFinite(value);
}
/** Validate and bound one diagnostic event before storing it in plugin state. */
function normalizeMemoryHostEventRecordForStorage(value) {
	if (!isRecord(value) || typeof value.type !== "string" || typeof value.timestamp !== "string") return null;
	const timestamp = truncateUtf8(value.timestamp, 128);
	let truncated = timestamp.truncated || value.storageTruncated === true;
	if (value.type === "memory.recall.recorded" || value.type === "memory.recall.skipped") {
		if (typeof value.query !== "string" || !Array.isArray(value.results) || (value.type === "memory.recall.recorded" ? !isFiniteNumber(value.resultCount) : !isFiniteNumber(value.skippedResultCount))) return null;
		if (value.type === "memory.recall.skipped" && (value.reason !== "non-short-term-memory-path" || !isFiniteNumber(value.eligibleResultCount) || !isFiniteNumber(value.skippedResultCount))) return null;
		const query = truncateUtf8(value.query, MAX_MEMORY_HOST_EVENT_TEXT_BYTES);
		truncated ||= query.truncated || value.results.length > MAX_MEMORY_HOST_EVENT_ITEMS;
		const results = [];
		for (const result of value.results.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS)) {
			if (!isRecord(result) || typeof result.path !== "string" || !isFiniteNumber(result.startLine) || !isFiniteNumber(result.endLine) || !isFiniteNumber(result.score) || value.type === "memory.recall.skipped" && result.reason !== "non-short-term-memory-path") return null;
			const resultPath = truncateUtf8(result.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			truncated ||= resultPath.truncated;
			results.push({
				path: resultPath.value,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score,
				...value.type === "memory.recall.skipped" ? { reason: "non-short-term-memory-path" } : {}
			});
		}
		const normalized = value.type === "memory.recall.recorded" ? {
			type: "memory.recall.recorded",
			timestamp: timestamp.value,
			query: query.value,
			resultCount: value.resultCount,
			results: results.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score
			})),
			...truncated ? { storageTruncated: true } : {}
		} : {
			type: "memory.recall.skipped",
			timestamp: timestamp.value,
			query: query.value,
			reason: "non-short-term-memory-path",
			eligibleResultCount: value.eligibleResultCount,
			skippedResultCount: value.skippedResultCount,
			results: results.map((result) => ({
				path: result.path,
				startLine: result.startLine,
				endLine: result.endLine,
				score: result.score,
				reason: "non-short-term-memory-path"
			})),
			...truncated ? { storageTruncated: true } : {}
		};
		return Buffer.byteLength(JSON.stringify(normalized), "utf8") <= MAX_MEMORY_HOST_EVENT_JSON_BYTES ? normalized : {
			...normalized,
			results: [],
			storageTruncated: true
		};
	}
	if (value.type === "memory.promotion.applied") {
		if (typeof value.memoryPath !== "string" || !isFiniteNumber(value.applied) || !Array.isArray(value.candidates)) return null;
		const memoryPath = truncateUtf8(value.memoryPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
		truncated ||= memoryPath.truncated || value.candidates.length > MAX_MEMORY_HOST_EVENT_ITEMS;
		const candidates = [];
		for (const candidate of value.candidates.slice(0, MAX_MEMORY_HOST_EVENT_ITEMS)) {
			if (!isRecord(candidate) || typeof candidate.key !== "string" || typeof candidate.path !== "string" || !isFiniteNumber(candidate.startLine) || !isFiniteNumber(candidate.endLine) || !isFiniteNumber(candidate.score) || !isFiniteNumber(candidate.recallCount)) return null;
			const key = truncateUtf8(candidate.key, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			const candidatePath = truncateUtf8(candidate.path, MAX_MEMORY_HOST_EVENT_PATH_BYTES);
			truncated ||= key.truncated || candidatePath.truncated;
			candidates.push({
				key: key.value,
				path: candidatePath.value,
				startLine: candidate.startLine,
				endLine: candidate.endLine,
				score: candidate.score,
				recallCount: candidate.recallCount
			});
		}
		const normalized = {
			type: "memory.promotion.applied",
			timestamp: timestamp.value,
			memoryPath: memoryPath.value,
			applied: value.applied,
			candidates,
			...truncated ? { storageTruncated: true } : {}
		};
		return Buffer.byteLength(JSON.stringify(normalized), "utf8") <= MAX_MEMORY_HOST_EVENT_JSON_BYTES ? normalized : {
			...normalized,
			candidates: [],
			storageTruncated: true
		};
	}
	if (value.type === "memory.dream.completed") {
		if (value.phase !== "light" && value.phase !== "deep" && value.phase !== "rem" || value.outcome !== void 0 && value.outcome !== "completed" && value.outcome !== "failed" || value.error !== void 0 && typeof value.error !== "string" || value.inlinePath !== void 0 && typeof value.inlinePath !== "string" || value.reportPath !== void 0 && typeof value.reportPath !== "string" || !isFiniteNumber(value.lineCount) || value.storageMode !== "inline" && value.storageMode !== "separate" && value.storageMode !== "both") return null;
		const error = value.error ? truncateUtf8(value.error, MAX_MEMORY_HOST_EVENT_TEXT_BYTES) : void 0;
		const inlinePath = value.inlinePath ? truncateUtf8(value.inlinePath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
		const reportPath = value.reportPath ? truncateUtf8(value.reportPath, MAX_MEMORY_HOST_EVENT_PATH_BYTES) : void 0;
		truncated ||= Boolean(error?.truncated || inlinePath?.truncated || reportPath?.truncated);
		return {
			type: value.type,
			timestamp: timestamp.value,
			phase: value.phase,
			...value.outcome ? { outcome: value.outcome } : {},
			...error ? { error: error.value } : {},
			...inlinePath ? { inlinePath: inlinePath.value } : {},
			...reportPath ? { reportPath: reportPath.value } : {},
			lineCount: value.lineCount,
			storageMode: value.storageMode,
			...truncated ? { storageTruncated: true } : {}
		};
	}
	return null;
}
function registerMemoryHostEvent(params) {
	const event = normalizeMemoryHostEventRecordForStorage(params.event);
	if (!event) throw new TypeError("Memory host event is invalid");
	const initialSequence = Math.max(0, listStoredMemoryHostEvents({
		workspaceDir: params.workspaceDir,
		limit: 1,
		...params.env ? { env: params.env } : {}
	}).at(-1)?.value.sequence ?? 0);
	const recordedAt = Date.now();
	registerPluginStateSyncSequencedJournalEntry({
		pluginId: MEMORY_HOST_EVENTS_PLUGIN_ID,
		cursorOptions: {
			namespace: MEMORY_HOST_EVENT_CURSORS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENT_CURSORS,
			...params.env ? { env: params.env } : {}
		},
		cursorKey: cursorKey(params.workspaceDir),
		journalOptions: {
			namespace: MEMORY_HOST_EVENTS_NAMESPACE,
			maxEntries: MAX_MEMORY_HOST_EVENTS,
			...params.env ? { env: params.env } : {}
		},
		initialSequence,
		journalKey: (sequence) => memoryHostEventStorageKey(params.workspaceDir, sequence),
		journalValue: (sequence) => ({
			kind: "event",
			event,
			recordedAt,
			sequence
		})
	});
}
function listStoredMemoryHostEvents(params) {
	const limit = Number.isFinite(params.limit) ? Math.max(1, Math.min(MAX_MEMORY_HOST_EVENTS, Math.floor(params.limit))) : MAX_MEMORY_HOST_EVENTS;
	return pluginStateEntriesInKeyRange({
		pluginId: MEMORY_HOST_EVENTS_PLUGIN_ID,
		namespace: MEMORY_HOST_EVENTS_NAMESPACE,
		keyStartInclusive: eventKeyPrefix(params.workspaceDir),
		keyEndExclusive: eventKeyRangeEnd(params.workspaceDir),
		limit,
		order: "desc",
		...params.env ? { env: params.env } : {}
	}).flatMap((entry) => {
		const value = entry.value;
		return value.kind === "event" ? [{
			...entry,
			value
		}] : [];
	}).toReversed();
}
//#endregion
export { normalizeMemoryHostEventRecordForStorage as n, registerMemoryHostEvent as r, listStoredMemoryHostEvents as t };
