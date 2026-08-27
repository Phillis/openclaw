import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { At as boolean, Bt as discriminatedUnion, Et as array, Lt as custom, Rn as string, St as _null, Xn as union, Zn as unknown, dn as literal, fn as looseObject, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as string$1 } from "./coerce-CtCr8aBa.js";
import { i as logWarn } from "./logger-D4iLuGk3.js";
import { D as selectSessionTranscriptLeafControlledPath } from "./session-transcript-index-DtVCy6vi.js";
import "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { G as uuidv7, P as buildSessionContext$1 } from "./agent-core-CK8RXNcu.js";
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
const sessionEntryTypeSchema = _enum([
	"message",
	"thinking_level_change",
	"model_change",
	"compaction",
	"reset",
	"branch_summary",
	"custom",
	"custom_message",
	"label",
	"session_info"
]);
const readableContentSchema = union([string(), array(looseObject({ type: string() }))]);
const readableMessageSchema = discriminatedUnion("role", [
	looseObject({
		role: literal("user"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("assistant"),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("toolResult"),
		toolCallId: string(),
		toolName: string(),
		isError: boolean(),
		content: array(unknown())
	}),
	looseObject({
		role: literal("custom"),
		customType: string(),
		content: readableContentSchema
	}),
	looseObject({
		role: literal("bashExecution"),
		command: string(),
		output: string()
	})
]);
const indexedSessionEntryBaseShape = {
	id: string().min(1),
	parentId: union([string(), _null()]).optional(),
	timestamp: string().optional()
};
const indexedSessionEntrySchema = discriminatedUnion("type", [
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("message"),
		message: readableMessageSchema
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("thinking_level_change"),
		thinkingLevel: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("model_change"),
		provider: string().min(1),
		modelId: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("compaction"),
		summary: string(),
		firstKeptEntryId: string().min(1),
		tokensBefore: custom((value) => typeof value === "number")
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("reset"),
		reason: string$1().pipe(_enum([
			"new",
			"reset",
			"idle",
			"daily",
			"cron-stale"
		])),
		firstKeptEntryId: string().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("branch_summary"),
		fromId: string(),
		summary: string()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom"),
		customType: string().min(1)
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("custom_message"),
		customType: string().min(1),
		content: readableContentSchema,
		display: boolean()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("label"),
		targetId: string().min(1),
		label: string().optional()
	}),
	looseObject({
		...indexedSessionEntryBaseShape,
		type: literal("session_info"),
		name: string().optional()
	})
]);
const parentLinkedOpaqueEntrySchema = looseObject({
	type: unknown().optional().refine((type) => type !== "session" && type !== "leaf"),
	id: string().min(1),
	parentId: union([string(), _null()])
});
const opaqueLeafEntrySchema = looseObject({
	type: literal("leaf"),
	id: string().min(1),
	parentId: union([string(), _null()]),
	targetId: union([string(), _null()]),
	appendParentId: union([string(), _null()]).optional(),
	appendMode: literal("side").optional()
});
const sessionHeaderSchema = looseObject({
	type: literal("session"),
	id: string()
});
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
	return sessionEntryTypeSchema.safeParse(type).success;
}
function isIndexedSessionEntry(entry) {
	return indexedSessionEntrySchema.safeParse(entry).success;
}
function isReadableContent(value) {
	return readableContentSchema.safeParse(value).success;
}
function isReadableMessage(value) {
	return readableMessageSchema.safeParse(value).success;
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
	const parsed = parentLinkedOpaqueEntrySchema.safeParse(record);
	return parsed.success ? {
		id: parsed.data.id,
		parentId: parsed.data.parentId
	} : void 0;
}
function parseOpaqueLeafEntry(record) {
	const parsed = opaqueLeafEntrySchema.safeParse(record);
	if (!parsed.success) return;
	const leaf = parsed.data;
	return {
		id: leaf.id,
		parentId: leaf.parentId,
		targetId: leaf.targetId,
		...leaf.appendParentId !== void 0 ? { appendParentId: leaf.appendParentId } : {},
		...leaf.appendMode === "side" ? { appendMode: leaf.appendMode } : {}
	};
}
function partitionSessionFileEntries(entries) {
	const fileEntries = [];
	const opaqueEntries = [];
	const fileEntriesByOriginalIndex = [];
	const acceptsLegacyEntries = (entries.find((entry) => sessionHeaderSchema.safeParse(entry).success)?.version ?? 1) < 3;
	let hasHeader = false;
	for (const [originalIndex, rawEntry] of entries.entries()) {
		const entry = normalizePersistedLegacyHookMessage(rawEntry);
		if (!hasHeader && sessionHeaderSchema.safeParse(entry).success) {
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
