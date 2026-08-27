import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as logWarn } from "./logger-frf2HPJn.js";
import { C as selectSessionTranscriptLeafControlledPath } from "./session-transcript-index-B7GQuTh4.js";
import "./session-accessor.sqlite-transcript-store-Cgnm_AHf.js";
import { O as buildSessionContext$1, z as uuidv7 } from "./agent-core-BNJRSUk4.js";
import { randomUUID } from "node:crypto";
import { stripCompactionReplayCheckpointInPlace } from "@openclaw/ai/transports";
//#region src/agents/sessions/session-manager-id.ts
function createManagedSessionId() {
	return uuidv7();
}
/** Generates a short collision-checked id, with a full UUID fallback. */
function generateSessionEntryId(existing) {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		const id = randomUUID().slice(0, 8);
		if (!existing.has(id)) return id;
	}
	return randomUUID();
}
//#endregion
//#region src/agents/sessions/session-manager-codec.ts
function isSessionContextMetadataEntry(entry) {
	return entry.type === "thinking_level_change" || entry.type === "model_change" || entry.type === "custom" || entry.type === "label" || entry.type === "session_info";
}
function migrateSessionFileEntryToCurrentVersion(entry, originalIndex, state) {
	if (state.sourceVersion < 2) if (entry.type === "session") entry.version = 2;
	else {
		entry.id = state.createEntryId(originalIndex);
		entry.parentId = state.previousId;
		state.previousId = entry.id;
		if (entry.type === "compaction") {
			const compaction = entry;
			if (typeof compaction.firstKeptEntryIndex === "number") {
				const firstKeptEntryId = state.resolveOriginalEntryId?.(compaction.firstKeptEntryIndex);
				if (firstKeptEntryId) compaction.firstKeptEntryId = firstKeptEntryId;
				delete compaction.firstKeptEntryIndex;
			}
		}
	}
	if (state.sourceVersion < 3) {
		if (entry.type === "session") entry.version = 3;
		else if (entry.type === "message" && entry.message) {
			const message = entry.message;
			if (message.role === "hookMessage") {
				message.role = "custom";
				message.customType ||= "hook";
			}
		}
	}
}
function migrateToCurrentVersion(entries, entriesByOriginalIndex) {
	const version = entries.find((entry) => entry.type === "session")?.version ?? 1;
	if (version >= 3) return false;
	const ids = /* @__PURE__ */ new Set();
	const state = {
		createEntryId: () => {
			const id = generateSessionEntryId(ids);
			ids.add(id);
			return id;
		},
		previousId: null,
		resolveOriginalEntryId: (originalIndex) => {
			const targetEntry = entriesByOriginalIndex ? entriesByOriginalIndex[originalIndex] : entries[originalIndex];
			return targetEntry && targetEntry.type !== "session" ? targetEntry.id : void 0;
		},
		sourceVersion: version
	};
	for (const [index, entry] of entries.entries()) migrateSessionFileEntryToCurrentVersion(entry, index, state);
	return true;
}
function migrateSessionEntries(entries) {
	migrateToCurrentVersion(entries);
}
function parseSessionEntries(content) {
	return parseJsonlEntries(content);
}
function getLatestCompactionEntry(entries) {
	for (const entry of entries.toReversed()) {
		if (entry.type === "reset") return null;
		if (entry.type === "compaction") return entry;
	}
	return null;
}
function buildSessionContext(entries, leafId, byIdInput) {
	let contextEntries = entries;
	let contextById = byIdInput;
	if (leafId === void 0) {
		const selectedEntries = selectSessionTranscriptLeafControlledPath(entries);
		if (selectedEntries !== void 0) {
			contextEntries = selectedEntries;
			contextById = void 0;
		}
	}
	let byId = contextById;
	if (!byId) {
		byId = /* @__PURE__ */ new Map();
		for (const entry of contextEntries) byId.set(entry.id, entry);
	}
	if (leafId === null) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	let leaf = leafId ? byId.get(leafId) : void 0;
	leaf ??= contextEntries.at(-1);
	if (!leaf) return {
		messages: [],
		thinkingLevel: "off",
		model: null
	};
	const path = [];
	let current = leaf;
	while (current) {
		path.push(current);
		current = current.parentId ? byId.get(current.parentId) : void 0;
	}
	path.reverse();
	return buildSessionContext$1(path);
}
function parseJsonlEntries(content) {
	const entries = [];
	let skipped = 0;
	for (const line of content.trim().split("\n")) {
		if (!line.trim()) continue;
		try {
			entries.push(normalizeLoadedFileEntry(JSON.parse(line)));
		} catch {
			skipped += 1;
		}
	}
	if (skipped > 0) logWarn(`parseJsonlEntries: skipped ${skipped} malformed JSONL line(s) — ${entries.length} valid entries were loaded`);
	return entries;
}
function normalizeLoadedFileEntry(entry) {
	if (!isRecord(entry) || entry.type !== "message" || !isRecord(entry.message)) return entry;
	const message = entry.message;
	if ((message.role === "assistant" || message.role === "toolResult") && typeof message.content === "string") {
		message.content = [{
			type: "text",
			text: message.content
		}];
		stripCompactionReplayCheckpointInPlace(message);
	} else if (message.role === "toolResult" && isRecord(message.content)) message.content = [message.content];
	return entry;
}
function isSessionEntryType(type) {
	switch (type) {
		case "message":
		case "thinking_level_change":
		case "model_change":
		case "compaction":
		case "reset":
		case "branch_summary":
		case "custom":
		case "custom_message":
		case "label":
		case "session_info": return true;
		default: return false;
	}
}
function isIndexedSessionEntry(entry) {
	if (!isRecord(entry) || !isSessionEntryType(entry.type) || typeof entry.id !== "string" || entry.id.length === 0 || entry.parentId !== void 0 && entry.parentId !== null && typeof entry.parentId !== "string" || entry.timestamp !== void 0 && typeof entry.timestamp !== "string") return false;
	switch (entry.type) {
		case "message": return isReadableMessage(entry.message);
		case "thinking_level_change": return typeof entry.thinkingLevel === "string" && entry.thinkingLevel.length > 0;
		case "model_change": return typeof entry.provider === "string" && entry.provider.length > 0 && typeof entry.modelId === "string" && entry.modelId.length > 0;
		case "compaction": return typeof entry.summary === "string" && typeof entry.firstKeptEntryId === "string" && entry.firstKeptEntryId.length > 0 && typeof entry.tokensBefore === "number";
		case "reset": return [
			"new",
			"reset",
			"idle",
			"daily",
			"cron-stale"
		].includes(String(entry.reason)) && (entry.firstKeptEntryId === void 0 || typeof entry.firstKeptEntryId === "string");
		case "branch_summary": return typeof entry.fromId === "string" && typeof entry.summary === "string";
		case "custom": return typeof entry.customType === "string" && entry.customType.length > 0;
		case "custom_message": return typeof entry.customType === "string" && entry.customType.length > 0 && isReadableContent(entry.content) && typeof entry.display === "boolean";
		case "label": return typeof entry.targetId === "string" && entry.targetId.length > 0 && (entry.label === void 0 || typeof entry.label === "string");
		case "session_info": return entry.name === void 0 || typeof entry.name === "string";
		default: return false;
	}
}
function isReadableContent(value) {
	return typeof value === "string" || Array.isArray(value) && value.every((part) => isRecord(part) && typeof part.type === "string");
}
function isReadableMessage(value) {
	if (!isRecord(value) || typeof value.role !== "string") return false;
	switch (value.role) {
		case "user":
		case "assistant": return isReadableContent(value.content);
		case "toolResult": return typeof value.toolCallId === "string" && typeof value.toolName === "string" && typeof value.isError === "boolean" && Array.isArray(value.content);
		case "custom": return typeof value.customType === "string" && isReadableContent(value.content);
		case "bashExecution": return typeof value.command === "string" && typeof value.output === "string";
		default: return false;
	}
}
function isReadableLegacySessionEntry(value) {
	const message = isRecord(value) && value.type === "message" ? value.message : void 0;
	const readableLegacyMessage = isRecord(message) && message.role === "hookMessage" ? isReadableContent(message.content) : isReadableMessage(message);
	return isRecord(value) && isSessionEntryType(value.type) && (value.type !== "message" || readableLegacyMessage);
}
function normalizePersistedLegacyHookMessage(value) {
	if (!isRecord(value) || value.type !== "message" || !isRecord(value.message)) return value;
	const message = value.message;
	if (message.role !== "custom" || message.customType !== void 0 || !isReadableContent(message.content)) return value;
	return {
		...value,
		message: {
			...message,
			customType: "hook"
		}
	};
}
function parseParentLinkedOpaqueEntry(record) {
	if (!isRecord(record) || record.type === "session" || record.type === "leaf" || typeof record.id !== "string" || record.id.length === 0 || record.parentId !== null && typeof record.parentId !== "string") return;
	return {
		id: record.id,
		parentId: record.parentId
	};
}
function parseOpaqueLeafEntry(record) {
	if (!isRecord(record) || record.type !== "leaf" || typeof record.id !== "string" || record.id.length === 0 || record.parentId !== null && typeof record.parentId !== "string" || record.targetId !== null && typeof record.targetId !== "string" || record.appendParentId !== void 0 && record.appendParentId !== null && typeof record.appendParentId !== "string" || record.appendMode !== void 0 && record.appendMode !== "side") return;
	return {
		id: record.id,
		parentId: record.parentId,
		targetId: record.targetId,
		...record.appendParentId !== void 0 ? { appendParentId: record.appendParentId } : {},
		...record.appendMode === "side" ? { appendMode: record.appendMode } : {}
	};
}
function partitionSessionFileEntries(entries) {
	const fileEntries = [];
	const opaqueEntries = [];
	const fileEntriesByOriginalIndex = [];
	const acceptsLegacyEntries = (entries.find((entry) => isRecord(entry) && entry.type === "session" && typeof entry.id === "string")?.version ?? 1) < 3;
	let hasHeader = false;
	for (const [originalIndex, rawEntry] of entries.entries()) {
		const entry = normalizePersistedLegacyHookMessage(rawEntry);
		if (!hasHeader && isRecord(entry) && entry.type === "session" && typeof entry.id === "string") {
			fileEntries.push(entry);
			fileEntriesByOriginalIndex[originalIndex] = entry;
			hasHeader = true;
			continue;
		}
		if (isIndexedSessionEntry(entry) || acceptsLegacyEntries && isReadableLegacySessionEntry(entry)) {
			fileEntries.push(entry);
			fileEntriesByOriginalIndex[originalIndex] = entry;
			continue;
		}
		opaqueEntries.push({
			index: fileEntries.length,
			record: entry
		});
	}
	return {
		fileEntries,
		opaqueEntries,
		fileEntriesByOriginalIndex
	};
}
//#endregion
export { migrateSessionEntries as a, normalizeLoadedFileEntry as c, parseSessionEntries as d, partitionSessionFileEntries as f, isSessionContextMetadataEntry as i, parseOpaqueLeafEntry as l, generateSessionEntryId as m, getLatestCompactionEntry as n, migrateSessionFileEntryToCurrentVersion as o, createManagedSessionId as p, isIndexedSessionEntry as r, migrateToCurrentVersion as s, buildSessionContext as t, parseParentLinkedOpaqueEntry as u };
