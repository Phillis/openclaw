import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
//#region packages/agent-core/src/harness/session/tool-result-pairing.ts
const TOOL_CALL_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"toolUse",
	"functionCall"
]);
const SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY = "openclawSyntheticMissingToolResult";
const DEFAULT_MISSING_TOOL_RESULT_TEXT = "[openclaw] missing tool result in session history; inserted synthetic error result for transcript repair.";
/** Tracks repeated provider ids by occurrence instead of collapsing them into a set. */
function createToolCallOccurrenceQueue() {
	const pendingById = /* @__PURE__ */ new Map();
	let pendingCount = 0;
	return {
		add(id, occurrence) {
			const pending = pendingById.get(id);
			if (pending) pending.push(occurrence);
			else pendingById.set(id, [occurrence]);
			pendingCount += 1;
		},
		claim(id) {
			const pending = pendingById.get(id);
			const occurrence = pending?.shift();
			if (!occurrence) return;
			pendingCount -= 1;
			if (pending?.length === 0) pendingById.delete(id);
			return occurrence;
		},
		clear() {
			pendingById.clear();
			pendingCount = 0;
		},
		get size() {
			return pendingCount;
		}
	};
}
function extractToolCallsFromAssistant(message) {
	if (!Array.isArray(message.content)) return [];
	return message.content.flatMap((block) => {
		if (!block || typeof block !== "object") return [];
		const record = block;
		if (typeof record.type !== "string" || !TOOL_CALL_TYPES.has(record.type) || typeof record.id !== "string" || !record.id) return [];
		return [{
			id: record.id,
			name: typeof record.name === "string" ? record.name : void 0
		}];
	});
}
function extractToolResultIds(message) {
	const record = message;
	const ids = [];
	for (const value of [
		record.toolCallId,
		record.toolUseId,
		record.tool_call_id,
		record.tool_use_id,
		record.callId,
		record.call_id
	]) {
		if (typeof value !== "string") continue;
		const id = value.trim();
		if (id && !ids.includes(id)) ids.push(id);
	}
	return ids;
}
function extractToolResultId(message) {
	return extractToolResultIds(message)[0] ?? null;
}
function makeMissingToolResult(params) {
	return {
		role: "toolResult",
		toolCallId: params.toolCallId,
		toolName: params.toolName ?? "unknown",
		content: [{
			type: "text",
			text: params.text ?? DEFAULT_MISSING_TOOL_RESULT_TEXT
		}],
		details: {
			[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY]: true,
			reason: "missing_tool_result"
		},
		isError: true,
		timestamp: Date.now()
	};
}
function isSyntheticMissingToolResult(message) {
	if (!message.isError) return false;
	const details = message.details;
	if (details && typeof details === "object" && details[SYNTHETIC_MISSING_TOOL_RESULT_DETAIL_KEY] === true) return true;
	const content = message.content;
	return Array.isArray(content) && content.some((block) => typeof block === "object" && block !== null && block.type === "text" && block.text === DEFAULT_MISSING_TOOL_RESULT_TEXT);
}
function normalizeToolResultName(message, fallbackName) {
	const rawToolName = message.toolName;
	const normalizedToolName = normalizeOptionalString(rawToolName);
	if (normalizedToolName) return rawToolName === normalizedToolName ? message : {
		...message,
		toolName: normalizedToolName
	};
	const normalizedFallback = normalizeOptionalString(fallbackName);
	if (normalizedFallback) return {
		...message,
		toolName: normalizedFallback
	};
	return typeof rawToolName === "string" ? {
		...message,
		toolName: "unknown"
	} : message;
}
function normalizeLegacyToolResultId(message, toolCalls) {
	if (extractToolResultId(message) || toolCalls.length !== 1) return message;
	const toolCall = toolCalls[0];
	if (!toolCall) return message;
	const resultName = normalizeOptionalString(message.toolName);
	const callName = normalizeOptionalString(toolCall.name);
	if (resultName && callName && resultName !== callName) return message;
	return {
		...message,
		toolCallId: toolCall.id,
		isError: true
	};
}
/** Classifies call/result ownership without reordering or synthesizing transcript messages. */
function classifyToolUseResultPairing(messages, options) {
	const frameStartIndexes = messages.flatMap((message, index) => message?.role === "assistant" && extractToolCallsFromAssistant(message).length > 0 ? [index] : []);
	let droppedDuplicateCount = 0;
	let droppedOrphanCount = 0;
	const preserveUnframed = options?.preserveUnframedToolResults === true;
	const frameRecords = frameStartIndexes.map((startIndex, frameIndex) => {
		const assistant = messages[startIndex];
		const toolCalls = extractToolCallsFromAssistant(assistant);
		const occurrences = [];
		const pending = createToolCallOccurrenceQueue();
		const syntheticById = /* @__PURE__ */ new Map();
		for (const toolCall of toolCalls) {
			const occurrence = {
				id: toolCall.id,
				name: toolCall.name
			};
			occurrences.push(occurrence);
			pending.add(toolCall.id, occurrence);
		}
		const endIndex = frameStartIndexes[frameIndex + 1] ?? messages.length;
		const remainder = [];
		const unclaimedResults = [];
		for (let index = startIndex + 1; index < endIndex; index += 1) {
			const message = messages[index];
			if (!message || typeof message !== "object") continue;
			if (message.role !== "toolResult") {
				remainder.push(message);
				continue;
			}
			const normalized = normalizeLegacyToolResultId(message, toolCalls);
			const id = extractToolResultId(normalized);
			const occurrence = id ? pending.claim(id) : void 0;
			if (occurrence) {
				occurrence.result = normalizeToolResultName(normalized, occurrence.name);
				occurrence.sourceResult = message;
				if (isSyntheticMissingToolResult(occurrence.result)) {
					const synthetic = syntheticById.get(occurrence.id);
					if (synthetic) synthetic.push(occurrence);
					else syntheticById.set(occurrence.id, [occurrence]);
				}
				continue;
			}
			if (!id || !occurrences.some((candidate) => candidate.id === id)) {
				unclaimedResults.push({
					result: normalized,
					sourceResult: message,
					id: id ?? void 0
				});
				if (preserveUnframed) remainder.push(normalized);
				continue;
			}
			droppedDuplicateCount += 1;
			if (!isSyntheticMissingToolResult(normalized)) {
				const replaceable = syntheticById.get(id)?.shift();
				if (replaceable) {
					replaceable.result = normalizeToolResultName(normalized, replaceable.name);
					replaceable.sourceResult = message;
				}
			}
		}
		const stopReason = assistant.stopReason;
		return {
			startIndex,
			endIndex,
			assistant,
			remainder,
			unclaimedResults,
			occurrences,
			failed: stopReason === "error" || stopReason === "aborted"
		};
	});
	const unresolvedById = /* @__PURE__ */ new Map();
	for (const frame of frameRecords) {
		for (const occurrence of frame.occurrences) if (!occurrence.result || isSyntheticMissingToolResult(occurrence.result)) {
			const unresolved = unresolvedById.get(occurrence.id);
			if (unresolved) unresolved.push(occurrence);
			else unresolvedById.set(occurrence.id, [occurrence]);
		}
		for (const record of frame.unclaimedResults) {
			const candidates = record.id ? (unresolvedById.get(record.id) ?? []).filter((candidate) => !candidate.result || isSyntheticMissingToolResult(candidate.result) && !isSyntheticMissingToolResult(record.result)) : [];
			if (candidates.length !== 1) {
				droppedOrphanCount += preserveUnframed ? 0 : 1;
				continue;
			}
			const candidate = candidates[0];
			if (!candidate) continue;
			droppedDuplicateCount += candidate.result ? 1 : 0;
			candidate.result = normalizeToolResultName(record.result, candidate.name);
			candidate.sourceResult = record.sourceResult;
			if (preserveUnframed) frame.remainder = frame.remainder.filter((message) => message !== record.result);
		}
	}
	return {
		frames: frameRecords,
		droppedDuplicateCount,
		droppedOrphanCount
	};
}
/** Select reset-tail model context without changing persisted entry bytes or order. */
function selectResetKeptEntries(entries) {
	const pairing = classifyToolUseResultPairing(entries.flatMap((entry) => entry.type === "message" ? [entry.message] : []));
	const pairedResults = new Set(pairing.frames.flatMap((frame) => frame.occurrences.flatMap((occurrence) => occurrence.sourceResult ? [occurrence.sourceResult] : [])));
	return entries.filter((entry) => entry.type === "message" && (entry.message.role === "user" || entry.message.role === "assistant" || entry.message.role === "toolResult" && pairedResults.has(entry.message)));
}
//#endregion
export { extractToolResultIds as a, selectResetKeptEntries as c, extractToolResultId as i, createToolCallOccurrenceQueue as n, makeMissingToolResult as o, extractToolCallsFromAssistant as r, normalizeLegacyToolResultId as s, classifyToolUseResultPairing as t };
