import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { m as readNonBlankString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { M as resolveNonNegativeIntegerOption, j as resolveIntegerOption, l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber, v as parseDateFirstTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { n as estimateStringChars, r as estimateTokensFromChars } from "./cjk-chars-B-gnWt4x.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import "./utils-D9gvQMP6.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { g as materializeSessionArchiveForRead } from "./artifacts-Cg2BoGvO.js";
import { g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { t as readFileWindowFully } from "./file-read-DtMn74uz.js";
import { ct as stripUserEnvelopeForDisplay, ht as stripEnvelope, lt as extractInboundSenderLabel, st as stripInternalMetadataForDisplay } from "./openclaw-state-db-BciZ4rHE.js";
import { D as resolveSessionTranscriptReadTarget, T as resolveConcreteSessionStorePath, _ as resolveVisibleMessagePositions, a as readRecentSessionTranscriptMessageEvents, g as readVisibleMessageRange, gt as normalizeUsage, h as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, mt as hasNonzeroUsage, p as readSessionTranscriptMessageEvents, pt as deriveSessionTotalTokens, v as getActiveTranscriptKysely, x as isSessionTranscriptProjectionUnavailableError, y as withCurrentProjectionSnapshot } from "./session-accessor-CIiPoGwM.js";
import { S as selectSessionTranscriptActiveEntries } from "./session-transcript-index-B7GQuTh4.js";
import { t as extractAssistantPhaseText } from "./chat-message-content-BibNiFIq.js";
import { x as streamSessionTranscriptLines } from "./session-accessor.sqlite-canonical-repair-BLguUqtM.js";
import { a as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-BZJL8ACd.js";
import { r as jsonUtf8Bytes } from "./json-utf8-bytes-3IFmJZrr.js";
import { i as stripInlineDirectiveTagsForDisplay } from "./directive-tags-CvzK-y8_.js";
import { n as extractToolCallNames, r as hasToolCall } from "./transcript-tools-C_OjPXzW.js";
import { a as resolveSessionTranscriptCandidates, o as resolveSessionTranscriptResetArchiveCandidatesAsync } from "./session-transcript-files.fs-oqmavapF.js";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
//#region src/gateway/chat-sanitize.ts
function extractMessageSenderLabel(entry) {
	if (typeof entry.senderLabel === "string" && entry.senderLabel.trim()) return entry.senderLabel.trim();
	if (typeof entry.content === "string") return extractInboundSenderLabel(entry.content);
	if (Array.isArray(entry.content)) for (const item of entry.content) {
		if (!item || typeof item !== "object") continue;
		const text = item.text;
		if (typeof text !== "string") continue;
		const senderLabel = extractInboundSenderLabel(text);
		if (senderLabel) return senderLabel;
	}
	if (typeof entry.text === "string") return extractInboundSenderLabel(entry.text);
	return null;
}
function stripEnvelopeFromContentWithRole(content, role) {
	const stripUserEnvelope = role === "user";
	let changed = false;
	return {
		content: content.map((item) => {
			if (!item || typeof item !== "object") return item;
			const entry = item;
			if (!(entry.type === "text" || role === "user" && entry.type === "input_text" || role === "assistant" && (entry.type === "input_text" || entry.type === "output_text")) || typeof entry.text !== "string") return item;
			const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
			if (stripped === entry.text) return item;
			changed = true;
			return {
				...entry,
				text: stripped
			};
		}),
		changed
	};
}
/** Strips OpenClaw envelope metadata from one display message without mutating it. */
function stripEnvelopeFromMessage(message) {
	if (!message || typeof message !== "object") return message;
	const entry = message;
	const role = typeof entry.role === "string" ? normalizeLowercaseStringOrEmpty(entry.role) : "";
	const stripUserEnvelope = role === "user";
	let changed = false;
	const next = { ...entry };
	const senderLabel = stripUserEnvelope ? extractMessageSenderLabel(entry) : null;
	if (senderLabel && entry.senderLabel !== senderLabel) {
		next.senderLabel = senderLabel;
		changed = true;
	}
	if (typeof entry.content === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.content) : stripInternalMetadataForDisplay(entry.content);
		if (stripped !== entry.content) {
			next.content = stripped;
			changed = true;
		}
	} else if (Array.isArray(entry.content)) {
		const updated = stripEnvelopeFromContentWithRole(entry.content, role);
		if (updated.changed) {
			next.content = updated.content;
			changed = true;
		}
	} else if (typeof entry.text === "string") {
		const stripped = stripUserEnvelope ? stripUserEnvelopeForDisplay(entry.text) : stripInternalMetadataForDisplay(entry.text);
		if (stripped !== entry.text) {
			next.text = stripped;
			changed = true;
		}
	}
	return changed ? next : message;
}
/** Strips envelope metadata from a message array, preserving the original array when unchanged. */
function stripEnvelopeFromMessages(messages) {
	if (messages.length === 0) return messages;
	let changed = false;
	const next = messages.map((message) => {
		const stripped = stripEnvelopeFromMessage(message);
		if (stripped !== message) changed = true;
		return stripped;
	});
	return changed ? next : messages;
}
//#endregion
//#region src/gateway/session-transcript-json.ts
/** Reads a nonblank transcript field while preserving its original whitespace. */
function readNonBlankStringPreservingWhitespace(value) {
	return readNonBlankString(value);
}
const TRANSCRIPT_FIELD_REGEX_CACHE = /* @__PURE__ */ new Map();
function getTranscriptFieldRegexes(field) {
	let cached = TRANSCRIPT_FIELD_REGEX_CACHE.get(field);
	if (!cached) {
		const escapedField = escapeRegExp(field);
		cached = {
			stringRe: new RegExp(`"${escapedField}"\\s*:\\s*"((?:\\\\.|[^"\\\\])*)"`),
			nullRe: new RegExp(`"${escapedField}"\\s*:\\s*null`),
			numberRe: new RegExp(`"${escapedField}"\\s*:\\s*(-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)`)
		};
		TRANSCRIPT_FIELD_REGEX_CACHE.set(field, cached);
	}
	return cached;
}
function extractJsonStringFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).stringRe.exec(prefix);
	if (!match) return;
	try {
		return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
	} catch {
		return;
	}
}
function extractJsonNullableStringFieldPrefix(prefix, field) {
	if (getTranscriptFieldRegexes(field).nullRe.test(prefix)) return null;
	return extractJsonStringFieldPrefix(prefix, field);
}
function extractJsonNumberFieldPrefix(prefix, field) {
	const match = getTranscriptFieldRegexes(field).numberRe.exec(prefix);
	if (!match) return;
	const decoded = Number(match[1]);
	return Number.isFinite(decoded) ? decoded : void 0;
}
//#endregion
//#region src/gateway/session-transcript-message.ts
/** Attach OpenClaw metadata to a transcript message without dropping existing metadata. */
function attachOpenClawTranscriptMeta(message, meta) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return message;
	const record = message;
	const existing = record["__openclaw"] && typeof record["__openclaw"] === "object" && !Array.isArray(record["__openclaw"]) ? record["__openclaw"] : {};
	return {
		...record,
		__openclaw: {
			...existing,
			...meta
		}
	};
}
function readTranscriptMessageIdempotencyKey(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return;
	const value = message.idempotencyKey;
	return typeof value === "string" && value.trim() ? value : void 0;
}
/** Project one stored transcript entry onto the client-visible chat history shape. */
function projectTranscriptEntryMessage(entry, seq) {
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return null;
	const record = entry;
	if (record.message) {
		const recordTimestampMs = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : typeof record.timestamp === "number" ? record.timestamp : NaN;
		const idempotencyKey = readTranscriptMessageIdempotencyKey(record.message);
		return attachOpenClawTranscriptMeta(record.message, {
			...typeof record.id === "string" ? { id: record.id } : {},
			...idempotencyKey ? { idempotencyKey } : {},
			...Number.isFinite(recordTimestampMs) ? { recordTimestampMs } : {},
			seq
		});
	}
	if (record.type !== "compaction" && record.type !== "reset") return null;
	const kind = record.type;
	const parsedTimestamp = typeof record.timestamp === "string" ? Date.parse(record.timestamp) : NaN;
	return {
		role: "system",
		content: [{
			type: "text",
			text: kind === "compaction" ? "Compaction" : "Reset"
		}],
		timestamp: Number.isFinite(parsedTimestamp) ? parsedTimestamp : Date.now(),
		__openclaw: {
			kind,
			id: typeof record.id === "string" ? record.id : void 0,
			seq
		}
	};
}
//#endregion
//#region src/gateway/session-utils.fs.ts
const RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES = 8 * 1024 * 1024;
const transcriptIndexes = /* @__PURE__ */ new Map();
const MAX_TRANSCRIPT_INDEXES = 256;
function normalizeRecentSessionReadOptions(opts) {
	const maxMessages = resolveNonNegativeIntegerOption(opts?.maxMessages, 0);
	return {
		maxMessages,
		maxBytes: resolveIntegerOption(opts?.maxBytes, RECENT_SESSION_MESSAGES_DEFAULT_MAX_BYTES, { min: 1024 }),
		maxLines: resolveIntegerOption(opts?.maxLines, maxMessages * 20 + 20, { min: maxMessages })
	};
}
async function readRecentTranscriptTailLinesAsync(filePath, stat, opts) {
	const { maxBytes, maxLines } = normalizeRecentSessionReadOptions(opts);
	const readLen = Math.min(stat.size, maxBytes);
	const readStart = Math.max(0, stat.size - readLen);
	const handle = await fs.promises.open(filePath, "r");
	try {
		const buffer = Buffer.alloc(readLen);
		const bytesRead = await readFileWindowFully(handle, buffer, readStart);
		if (bytesRead <= 0) return [];
		return buffer.toString("utf-8", 0, bytesRead).split(/\r?\n/).slice(readStart > 0 ? 1 : 0).filter((line) => line.trim().length > 0).slice(-maxLines);
	} finally {
		await handle.close();
	}
}
const MAX_TRANSCRIPT_PARSE_LINE_BYTES = 256 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS = 64 * 1024;
const OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS = 64 * 1024;
const MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES = 32;
const TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER = "[chat.history omitted: message too large]";
function isOversizedTranscriptLine(line) {
	return Buffer.byteLength(line, "utf8") > MAX_TRANSCRIPT_PARSE_LINE_BYTES;
}
function isJsonObjectFieldToken(source, tokenIndex) {
	for (let index = tokenIndex - 1; index >= 0; index--) {
		const char = source.charAt(index);
		if (/\s/.test(char)) continue;
		return char === "{" || char === ",";
	}
	return true;
}
function extractJsonStringFieldWindow(source, field, startIndex = 0, endIndex = source.length) {
	const fieldToken = JSON.stringify(field);
	let searchIndex = startIndex;
	while (searchIndex < endIndex) {
		const tokenIndex = source.indexOf(fieldToken, searchIndex);
		if (tokenIndex < 0 || tokenIndex >= endIndex) return;
		searchIndex = tokenIndex + fieldToken.length;
		if (!isJsonObjectFieldToken(source, tokenIndex)) continue;
		const match = /^\s*:\s*"((?:\\.|[^"\\])*)"/.exec(source.slice(searchIndex, endIndex));
		if (!match) continue;
		try {
			return readNonBlankStringPreservingWhitespace(JSON.parse(`"${match[1]}"`));
		} catch {
			return;
		}
	}
}
function extractJsonStringFieldSuffix(source, field) {
	return extractJsonStringFieldWindow(source, field, Math.max(0, source.length - OVERSIZED_TRANSCRIPT_METADATA_SUFFIX_CHARS));
}
function recoverOversizedMultimodalTranscriptRecord(line) {
	const markerPrefix = "__openclaw_omitted_image_";
	if (line.includes(markerPrefix)) return;
	const payloads = [];
	const dataPattern = /"data"\s*:\s*"/g;
	let scannedCandidates = 0;
	for (let dataMatch = dataPattern.exec(line); dataMatch; dataMatch = dataPattern.exec(line)) {
		if (!isJsonObjectFieldToken(line, dataMatch.index)) continue;
		if (++scannedCandidates > MAX_OVERSIZED_TRANSCRIPT_RECOVERY_CANDIDATES) return;
		const start = dataMatch.index + dataMatch[0].length;
		let end = start;
		let padding = 0;
		let valid = true;
		for (; end < line.length && line.charCodeAt(end) !== 34; end++) {
			const code = line.charCodeAt(end);
			if (code === 92) {
				valid = false;
				end++;
				continue;
			}
			if (!valid) continue;
			if (code === 61) {
				if (++padding > 2) valid = false;
			} else if (padding > 0 || ((code | 32) < 97 || (code | 32) > 122) && (code < 48 || code > 57) && code !== 43 && code !== 47) valid = false;
		}
		if (end >= line.length) return;
		dataPattern.lastIndex = end + 1;
		if (!valid || (end - start) % 4 !== 0) continue;
		payloads.push({
			start,
			end,
			marker: `${markerPrefix}${payloads.length}__`,
			bytes: (end - start) * 3 / 4 - padding
		});
	}
	if (payloads.length === 0) return;
	try {
		const parseBoundedRedaction = (selected) => {
			const bytes = selected.reduce((remaining, payload) => remaining - (payload.end - payload.start - payload.marker.length), Buffer.byteLength(line, "utf8"));
			if (selected.length === 0 || bytes > MAX_TRANSCRIPT_PARSE_LINE_BYTES) return;
			let cursor = 0;
			const parts = [];
			for (const payload of selected) {
				parts.push(line.slice(cursor, payload.start), payload.marker);
				cursor = payload.end;
			}
			parts.push(line.slice(cursor));
			const markers = new Set(selected.map((payload) => payload.marker));
			const parsed = JSON.parse(parts.join(""), (_key, value) => {
				if (typeof value === "string" && value.startsWith(markerPrefix) && !markers.delete(value)) throw new Error("invalid transcript image recovery marker");
				return value;
			});
			if (markers.size > 0 || !parsed || typeof parsed !== "object" || Array.isArray(parsed)) return;
			return parsed;
		};
		const imageDataOwners = (block) => {
			const source = block.source;
			return source && typeof source === "object" && source.type === "base64" ? [block, source] : [block];
		};
		const previewContent = (parseBoundedRedaction(payloads)?.message)?.content;
		if (!Array.isArray(previewContent)) return;
		const payloadByMarker = new Map(payloads.map((payload) => [payload.marker, payload]));
		const imageMarkers = /* @__PURE__ */ new Set();
		for (const candidate of previewContent) {
			if (!candidate || typeof candidate !== "object" || candidate.type !== "image") continue;
			for (const owner of imageDataOwners(candidate)) {
				if (typeof owner.data !== "string") continue;
				if (!payloadByMarker.has(owner.data) || imageMarkers.has(owner.data)) return;
				imageMarkers.add(owner.data);
			}
		}
		if (imageMarkers.size === 0) return;
		const imagePayloads = payloads.filter((payload) => imageMarkers.has(payload.marker));
		const record = parseBoundedRedaction(imagePayloads);
		const content = (record?.message)?.content;
		if (!record || !Array.isArray(content)) return;
		const remaining = new Map(imagePayloads.map((payload) => [payload.marker, payload]));
		for (const candidate of content) {
			if (!candidate || typeof candidate !== "object" || candidate.type !== "image") continue;
			const block = candidate;
			let imageBytes;
			for (const owner of imageDataOwners(block)) {
				if (typeof owner.data !== "string") continue;
				const payload = remaining.get(owner.data);
				if (!payload) return;
				remaining.delete(payload.marker);
				imageBytes ??= payload.bytes;
				delete owner.data;
			}
			if (imageBytes !== void 0) {
				block.omitted = true;
				block.bytes = imageBytes;
			}
		}
		return remaining.size === 0 && jsonUtf8Bytes(record) <= MAX_TRANSCRIPT_PARSE_LINE_BYTES ? record : void 0;
	} catch {
		return;
	}
}
function parseTranscriptRecord(line) {
	const oversized = isOversizedTranscriptLine(line);
	const recoveredRecord = oversized ? recoverOversizedMultimodalTranscriptRecord(line) : void 0;
	if (!oversized || recoveredRecord) try {
		const parsed = recoveredRecord ?? JSON.parse(line);
		if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
		const record = parsed;
		const id = readNonBlankStringPreservingWhitespace(record.id);
		return {
			byteLength: Buffer.byteLength(line, "utf8"),
			...id ? { id } : {},
			...recoveredRecord ? { recoveredImageData: true } : {},
			record
		};
	} catch {
		return null;
	}
	const prefix = line.slice(0, OVERSIZED_TRANSCRIPT_METADATA_PREFIX_CHARS);
	const messageMatch = /"message"\s*:/.exec(prefix);
	const recordPrefix = messageMatch ? prefix.slice(0, messageMatch.index) : prefix;
	const id = extractJsonStringFieldPrefix(prefix, "id");
	const parentId = extractJsonNullableStringFieldPrefix(prefix, "parentId");
	const type = extractJsonStringFieldPrefix(prefix, "type");
	const timestamp = extractJsonStringFieldPrefix(recordPrefix, "timestamp") ?? extractJsonNumberFieldPrefix(recordPrefix, "timestamp");
	const role = extractJsonStringFieldPrefix(prefix, "role") ?? "assistant";
	const idempotencyKey = extractJsonStringFieldPrefix(prefix, "idempotencyKey") ?? extractJsonStringFieldSuffix(line, "idempotencyKey");
	const record = {
		...type ? { type } : {},
		...id ? { id } : {},
		...parentId !== void 0 ? { parentId } : {},
		...timestamp !== void 0 ? { timestamp } : {},
		message: {
			role,
			...idempotencyKey ? { idempotencyKey } : {},
			content: [{
				type: "text",
				text: TRANSCRIPT_OVERSIZED_MESSAGE_PLACEHOLDER
			}],
			__openclaw: {
				truncated: true,
				reason: "oversized"
			}
		}
	};
	return {
		byteLength: Buffer.byteLength(line, "utf8"),
		...id ? { id } : {},
		record
	};
}
function parseRecentTranscriptTailSnapshot(lines, maxMessages) {
	const selected = projectResetBoundary(selectSessionTranscriptActiveEntries({
		entries: lines.flatMap((line) => {
			const entry = parseTranscriptRecord(line);
			return entry ? [entry] : [];
		}),
		recordOf: (entry) => entry.record,
		failClosedOnInvalidLeafControl: true
	}));
	const messages = [];
	for (const entry of selected) {
		const message = projectTranscriptEntryMessage(entry.record, messages.length + 1);
		if (message) messages.push(message);
	}
	return {
		messages: messages.slice(-maxMessages),
		transcriptEvents: selected.map((entry) => entry.record)
	};
}
function isVisibleTranscriptRecord(record) {
	return Boolean(record.message) || record.type === "compaction" || record.type === "reset";
}
function projectResetBoundary(entries) {
	const boundaryIndex = entries.findLastIndex(({ record }) => {
		return record.type === "compaction" || record.type === "reset";
	});
	if (boundaryIndex < 0 || entries[boundaryIndex]?.record.type !== "reset") return entries;
	const firstKeptEntryId = entries[boundaryIndex]?.record.firstKeptEntryId;
	const firstKeptIndex = typeof firstKeptEntryId === "string" ? entries.findIndex((entry, index) => index < boundaryIndex && entry.id === firstKeptEntryId) : -1;
	return [...firstKeptIndex < 0 ? [] : entries.slice(firstKeptIndex, boundaryIndex).filter(({ record }) => {
		const role = record.message?.role;
		return role === "user" || role === "assistant";
	}), ...entries.slice(boundaryIndex)];
}
function toIndexedEntries(entries) {
	const indexed = [];
	for (const entry of entries) if (isVisibleTranscriptRecord(entry.record)) indexed.push({
		...entry,
		seq: indexed.length + 1
	});
	return indexed;
}
async function buildSessionTranscriptIndex(filePath) {
	const records = [];
	const stream = fs.createReadStream(filePath, { encoding: "utf8" });
	const lines = readline.createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	try {
		for await (const line of lines) if (line.trim()) {
			const record = parseTranscriptRecord(line);
			if (record) records.push(record);
		}
	} finally {
		lines.close();
		stream.destroy();
	}
	return { entries: toIndexedEntries(projectResetBoundary(selectSessionTranscriptActiveEntries({
		entries: records,
		recordOf: (entry) => entry.record
	}))) };
}
async function readSessionTranscriptIndex(filePath, opts = {}) {
	const stat = await fs.promises.stat(filePath).catch(() => null);
	if (!stat?.isFile()) {
		transcriptIndexes.delete(filePath);
		return null;
	}
	const identity = `${stat.mtimeMs}:${stat.size}`;
	let cached = opts.cache === "skip" ? void 0 : transcriptIndexes.get(filePath);
	if (cached?.identity === identity) {
		transcriptIndexes.delete(filePath);
		transcriptIndexes.set(filePath, cached);
	}
	if (cached?.identity !== identity) {
		cached = {
			identity,
			value: buildSessionTranscriptIndex(filePath)
		};
		if (opts.cache !== "skip") {
			transcriptIndexes.delete(filePath);
			transcriptIndexes.set(filePath, cached);
			pruneMapToMaxSize(transcriptIndexes, MAX_TRANSCRIPT_INDEXES);
		}
	}
	let index;
	try {
		index = await cached.value;
	} catch (error) {
		if (transcriptIndexes.get(filePath) === cached) transcriptIndexes.delete(filePath);
		throw error;
	}
	return index;
}
function findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId) {
	return resolveSessionTranscriptCandidates(sessionId, storePath, sessionFile, agentId).find((value) => fs.existsSync(value)) ?? null;
}
/** Single owner for bounded reads of live JSONL artifacts and cold reset archives. */
var ArchivedTranscriptReader = class {
	constructor(scope) {
		this.scope = scope;
	}
	async resolvePath(opts) {
		return (await this.resolveArtifact(opts))?.path ?? null;
	}
	activePath() {
		return findExistingTranscriptPath(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
	}
	async resolveArtifact(opts) {
		if (opts.resetArchiveOnly !== true) {
			const activePath = this.activePath();
			if (activePath) return {
				path: activePath,
				source: "active"
			};
		}
		if (opts.allowResetArchiveFallback !== true) return null;
		const archives = await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId);
		for (const archivePath of archives) {
			if (!(await fs.promises.stat(archivePath).catch(() => null))?.isFile()) continue;
			if (opts.resetArchiveOnly !== true) {
				const activePath = this.activePath();
				if (activePath) return {
					path: activePath,
					source: "active"
				};
			}
			try {
				return {
					path: materializeSessionArchiveForRead(archivePath),
					source: "reset-archive"
				};
			} catch {
				continue;
			}
		}
		return null;
	}
	async read(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return { messages: [] };
		if (opts.mode === "recent") {
			if (normalizeRecentSessionReadOptions(opts).maxMessages === 0) return { messages: [] };
			return {
				messages: (await readRecentSessionSnapshotFromPathAsync(artifact.path, normalizeRecentSessionReadOptions(opts))).messages,
				transcriptPath: artifact.path
			};
		}
		return {
			messages: (await readSessionTranscriptIndex(artifact.path))?.entries.flatMap(indexedTranscriptEntryToMessages) ?? [],
			transcriptPath: artifact.path
		};
	}
	async readById(messageId, opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			oversized: false,
			found: false
		};
		const entry = (await readSessionTranscriptIndex(artifact.path))?.entries.find((candidate) => candidate.id === messageId);
		if (!entry) return {
			oversized: false,
			found: false
		};
		if (entry.byteLength > MAX_TRANSCRIPT_PARSE_LINE_BYTES && (entry.recoveredImageData !== true || jsonUtf8Bytes(entry.record) > MAX_TRANSCRIPT_PARSE_LINE_BYTES)) return {
			oversized: true,
			found: true,
			seq: entry.seq
		};
		return {
			message: indexedTranscriptEntryToMessage(entry),
			seq: entry.seq,
			oversized: false,
			found: true
		};
	}
	async readRecentWithStats(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			messages: [],
			totalMessages: 0
		};
		const totalMessages = (await readSessionTranscriptIndex(artifact.path))?.entries.length ?? 0;
		const normalized = normalizeRecentSessionReadOptions(opts);
		const snapshot = normalized.maxMessages === 0 ? {
			messages: [],
			transcriptEvents: []
		} : await readRecentSessionSnapshotFromPathAsync(artifact.path, normalized);
		const firstSeq = Math.max(1, totalMessages - snapshot.messages.length + 1);
		return {
			messages: snapshot.messages.map((message, index) => attachOpenClawTranscriptMeta(message, { seq: firstSeq + index })),
			transcriptEvents: snapshot.transcriptEvents,
			totalMessages,
			transcriptPath: artifact.path,
			transcriptSource: artifact.source
		};
	}
	async readPage(opts) {
		const artifact = await this.resolveArtifact(opts);
		if (!artifact) return {
			messages: [],
			totalMessages: 0
		};
		const index = await readSessionTranscriptIndex(artifact.path);
		if (!index) return {
			messages: [],
			totalMessages: 0,
			transcriptPath: artifact.path
		};
		const totalMessages = index.entries.length;
		const offset = Math.min(resolveNonNegativeIntegerOption(opts.offset, 0), totalMessages);
		const endExclusive = Math.max(0, totalMessages - offset);
		const start = Math.max(0, endExclusive - resolveNonNegativeIntegerOption(opts.maxMessages, 0));
		const entries = index.entries.slice(start, endExclusive);
		return {
			messages: entries.flatMap(indexedTranscriptEntryToMessages),
			transcriptEvents: entries.map((entry) => entry.record),
			totalMessages,
			transcriptPath: artifact.path,
			transcriptSource: artifact.source
		};
	}
	async readAroundId(opts) {
		const artifacts = [];
		if (opts.resetArchiveOnly !== true) {
			const activePath = this.activePath();
			if (activePath) artifacts.push({
				path: activePath,
				source: "active"
			});
		}
		if (opts.allowResetArchiveFallback === true) for (const archivePath of await resolveSessionTranscriptResetArchiveCandidatesAsync(this.scope.sessionId, this.scope.storePath, this.scope.sessionFile, this.scope.agentId)) try {
			artifacts.push({
				path: materializeSessionArchiveForRead(archivePath),
				source: "reset-archive"
			});
		} catch {}
		let activeTotalMessages = 0;
		for (const artifact of artifacts) {
			const index = await readSessionTranscriptIndex(artifact.path);
			if (!index) continue;
			if (artifact.source === "active") activeTotalMessages = index.entries.length;
			const anchorIndex = index.entries.findIndex((entry) => entry.id === opts.messageId);
			if (anchorIndex < 0) continue;
			const pageSize = Math.max(1, Math.floor(opts.maxMessages));
			const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
			const start = Math.min(Math.max(0, anchorIndex - olderMessages), Math.max(0, index.entries.length - pageSize));
			const endExclusive = Math.min(index.entries.length, start + pageSize);
			const readStart = Math.max(0, start - 1);
			return {
				found: true,
				hasOverreadContext: readStart < start,
				messages: index.entries.slice(readStart, endExclusive).flatMap(indexedTranscriptEntryToMessages),
				offset: index.entries.length - endExclusive,
				totalMessages: index.entries.length,
				transcriptPath: artifact.path,
				transcriptSource: artifact.source
			};
		}
		return {
			found: false,
			hasOverreadContext: false,
			messages: [],
			offset: 0,
			totalMessages: activeTotalMessages
		};
	}
};
async function readRecentSessionSnapshotFromPathAsync(filePath, opts) {
	const { maxMessages } = opts;
	let stat;
	try {
		stat = await fs.promises.stat(filePath);
	} catch {
		return {
			messages: [],
			transcriptEvents: []
		};
	}
	if (stat.size === 0) return {
		messages: [],
		transcriptEvents: []
	};
	return parseRecentTranscriptTailSnapshot(await readRecentTranscriptTailLinesAsync(filePath, stat, { ...opts }), maxMessages);
}
function indexedTranscriptEntryToMessage(entry) {
	return projectTranscriptEntryMessage(entry.record, entry.seq);
}
function indexedTranscriptEntryToMessages(entry) {
	const message = indexedTranscriptEntryToMessage(entry);
	return message ? [message] : [];
}
function capArrayByJsonBytes(items, maxBytes) {
	if (items.length === 0) return {
		items,
		bytes: 2
	};
	const parts = items.map((item) => jsonUtf8Bytes(item));
	let bytes = 2 + parts.reduce((a, b) => a + b, 0) + (items.length - 1);
	let start = 0;
	while (bytes > maxBytes && start < items.length - 1) {
		bytes -= expectDefined(parts[start], "parts entry at start") + 1;
		start += 1;
	}
	return {
		items: start > 0 ? items.slice(start) : items,
		bytes
	};
}
async function resolveSessionHistoryTranscriptPathAsync(sessionId, storePath, sessionFile, opts) {
	return await new ArchivedTranscriptReader({
		agentId: opts?.agentId,
		sessionFile,
		sessionId,
		storePath
	}).resolvePath({ allowResetArchiveFallback: opts?.allowResetArchiveFallback });
}
function extractTranscriptUsageCost(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
	const cost = raw.cost;
	if (!cost || typeof cost !== "object" || Array.isArray(cost)) return;
	const total = cost.total;
	return asNonNegativeFiniteNumber(total);
}
function extractTranscriptContentEstimatedChars(content) {
	if (typeof content === "string") {
		const normalized = stripInlineDirectiveTagsForDisplay(content).text.trim();
		return normalized ? estimateStringChars(normalized) : 0;
	}
	if (!Array.isArray(content)) return 0;
	let chars = 0;
	for (const part of content) {
		if (!part || typeof part !== "object" || Array.isArray(part)) continue;
		const record = part;
		if (typeof record.text !== "string") continue;
		const type = typeof record.type === "string" ? record.type : "text";
		if (type !== "text" && type !== "output_text" && type !== "input_text") continue;
		const normalized = stripInlineDirectiveTagsForDisplay(record.text).text.trim();
		if (normalized) chars += estimateStringChars(normalized);
	}
	return chars;
}
function extractTranscriptTokenEstimateFromLine(line) {
	if (isOversizedTranscriptLine(line)) return null;
	try {
		const parsed = JSON.parse(line);
		const message = parsed.message && typeof parsed.message === "object" && !Array.isArray(parsed.message) ? parsed.message : void 0;
		if (!message) return null;
		const role = typeof message.role === "string" ? message.role : void 0;
		if (role !== "user" && role !== "assistant") return null;
		const modelProvider = typeof message.provider === "string" ? message.provider.trim() : typeof parsed.provider === "string" ? parsed.provider.trim() : void 0;
		const model = typeof message.model === "string" ? message.model.trim() : typeof parsed.model === "string" ? parsed.model.trim() : void 0;
		if (role === "assistant" && modelProvider === "openclaw" && model === "delivery-mirror") return null;
		const contentChars = extractTranscriptContentEstimatedChars(message.content);
		if (contentChars <= 0) return null;
		return {
			estimatedChars: contentChars,
			hasModelIdentity: role === "assistant" && Boolean(modelProvider || model)
		};
	} catch {
		return null;
	}
}
function extractUsageSnapshotFromTranscriptLine(line) {
	if (isOversizedTranscriptLine(line)) return null;
	try {
		const parsed = JSON.parse(line);
		const message = parsed.message && typeof parsed.message === "object" && !Array.isArray(parsed.message) ? parsed.message : void 0;
		if (!message) return null;
		const role = typeof message.role === "string" ? message.role : void 0;
		if (role && role !== "assistant") return null;
		const usageRaw = message.usage && typeof message.usage === "object" && !Array.isArray(message.usage) ? message.usage : parsed.usage && typeof parsed.usage === "object" && !Array.isArray(parsed.usage) ? parsed.usage : void 0;
		const usageRecord = usageRaw;
		const usage = normalizeUsage(usageRecord);
		const legacyCliUsage = (typeof message.api === "string" ? message.api.trim() : void 0) === "cli" && usageRecord !== void 0 && usageRecord.contextUsage === void 0;
		const totalTokens = legacyCliUsage ? void 0 : asPositiveFiniteNumber(deriveSessionTotalTokens({ usage }));
		const costUsd = extractTranscriptUsageCost(usageRaw);
		const modelProvider = typeof message.provider === "string" ? message.provider.trim() : typeof parsed.provider === "string" ? parsed.provider.trim() : void 0;
		const model = typeof message.model === "string" ? message.model.trim() : typeof parsed.model === "string" ? parsed.model.trim() : void 0;
		const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
		const hasMeaningfulUsage = hasNonzeroUsage(usage) || typeof totalTokens === "number" || typeof costUsd === "number" && Number.isFinite(costUsd);
		if (!hasMeaningfulUsage && !Boolean(modelProvider || model)) return null;
		if (isDeliveryMirror && !hasMeaningfulUsage) return null;
		const snapshot = {};
		if (!isDeliveryMirror) {
			if (modelProvider) snapshot.modelProvider = modelProvider;
			if (model) snapshot.model = model;
		}
		if (typeof usage?.input === "number" && Number.isFinite(usage.input)) snapshot.inputTokens = usage.input;
		if (typeof usage?.output === "number" && Number.isFinite(usage.output)) snapshot.outputTokens = usage.output;
		if (typeof usage?.cacheRead === "number" && Number.isFinite(usage.cacheRead)) snapshot.cacheRead = usage.cacheRead;
		if (typeof usage?.cacheWrite === "number" && Number.isFinite(usage.cacheWrite)) snapshot.cacheWrite = usage.cacheWrite;
		if (legacyCliUsage) snapshot.contextUsage = { state: "unavailable" };
		else if (usage?.contextUsage) snapshot.contextUsage = usage.contextUsage;
		if (typeof totalTokens === "number") {
			snapshot.totalTokens = totalTokens;
			snapshot.totalTokensFresh = true;
		}
		if (typeof costUsd === "number" && Number.isFinite(costUsd)) snapshot.costUsd = costUsd;
		return snapshot;
	} catch {
		return null;
	}
}
function extractAggregateUsageFromTranscriptLines(lines) {
	const snapshot = {};
	let sawSnapshot = false;
	let inputTokens = 0;
	let outputTokens = 0;
	let cacheRead = 0;
	let cacheWrite = 0;
	let sawInputTokens = false;
	let sawOutputTokens = false;
	let sawCacheRead = false;
	let sawCacheWrite = false;
	let costUsdTotal = 0;
	let sawCost = false;
	let estimatedTranscriptChars = 0;
	let sawEstimatedTranscriptContent = false;
	let sawEstimateModelIdentity = false;
	for (const line of lines) {
		const estimate = extractTranscriptTokenEstimateFromLine(line);
		if (estimate) {
			estimatedTranscriptChars += estimate.estimatedChars;
			sawEstimatedTranscriptContent = true;
			sawEstimateModelIdentity ||= estimate.hasModelIdentity;
		}
		const current = extractUsageSnapshotFromTranscriptLine(line);
		if (!current) continue;
		sawSnapshot = true;
		if (current.modelProvider) snapshot.modelProvider = current.modelProvider;
		if (current.model) snapshot.model = current.model;
		if (typeof current.inputTokens === "number") {
			inputTokens += current.inputTokens;
			sawInputTokens = true;
		}
		if (typeof current.outputTokens === "number") {
			outputTokens += current.outputTokens;
			sawOutputTokens = true;
		}
		if (typeof current.cacheRead === "number") {
			cacheRead += current.cacheRead;
			sawCacheRead = true;
		}
		if (typeof current.cacheWrite === "number") {
			cacheWrite += current.cacheWrite;
			sawCacheWrite = true;
		}
		if (current.contextUsage) snapshot.contextUsage = current.contextUsage;
		else if (typeof current.totalTokens === "number") delete snapshot.contextUsage;
		if (current.contextUsage?.state === "unavailable") {
			delete snapshot.totalTokens;
			delete snapshot.totalTokensFresh;
		} else if (typeof current.totalTokens === "number") {
			snapshot.totalTokens = current.totalTokens;
			snapshot.totalTokensFresh = true;
		}
		if (typeof current.costUsd === "number" && Number.isFinite(current.costUsd)) {
			costUsdTotal += current.costUsd;
			sawCost = true;
		}
	}
	if (!sawSnapshot) return null;
	if (sawInputTokens) snapshot.inputTokens = inputTokens;
	if (sawOutputTokens) snapshot.outputTokens = outputTokens;
	if (sawCacheRead) snapshot.cacheRead = cacheRead;
	if (sawCacheWrite) snapshot.cacheWrite = cacheWrite;
	if (sawCost) snapshot.costUsd = costUsdTotal;
	if (typeof snapshot.totalTokens !== "number" && snapshot.contextUsage?.state !== "unavailable" && sawEstimatedTranscriptContent && sawEstimateModelIdentity) {
		const estimatedTotalTokens = estimateTokensFromChars(estimatedTranscriptChars);
		if (estimatedTotalTokens > 0) {
			snapshot.totalTokens = estimatedTotalTokens;
			snapshot.totalTokensFresh = true;
		}
	}
	return snapshot;
}
async function readLatestSessionUsageFromTranscriptFileAsync(sessionId, storePath, sessionFile, agentId) {
	const filePath = findExistingTranscriptPath(sessionId, storePath, sessionFile, agentId);
	if (!filePath) return null;
	try {
		if ((await fs.promises.stat(filePath)).size === 0) return null;
		const lines = [];
		for await (const line of streamSessionTranscriptLines(filePath)) lines.push(line);
		return extractAggregateUsageFromTranscriptLines(lines);
	} catch {
		return null;
	}
}
function normalizeRole(role, isTool) {
	if (isTool) return "tool";
	switch (normalizeLowercaseStringOrEmpty(role)) {
		case "user": return "user";
		case "assistant": return "assistant";
		case "system": return "system";
		case "tool": return "tool";
		default: return "other";
	}
}
function truncatePreviewText(text, maxChars) {
	if (text.length <= maxChars) return text;
	return `${truncateUtf16Safe(text, maxChars - 3)}...`;
}
function extractPreviewText(message) {
	if (normalizeLowercaseStringOrEmpty(message.role) === "assistant") {
		const assistantText = extractAssistantPhaseText(message);
		if (assistantText) {
			const normalized = stripInlineDirectiveTagsForDisplay(assistantText).text.trim();
			return normalized ? normalized : null;
		}
		return null;
	}
	if (typeof message.content === "string") {
		const normalized = stripInlineDirectiveTagsForDisplay(message.content).text.trim();
		return normalized ? normalized : null;
	}
	if (Array.isArray(message.content)) {
		const parts = message.content.map((entry) => typeof entry?.text === "string" ? stripInlineDirectiveTagsForDisplay(entry.text).text : "").filter((text) => text.trim().length > 0);
		if (parts.length > 0) return parts.join("\n").trim();
	}
	if (typeof message.text === "string") {
		const normalized = stripInlineDirectiveTagsForDisplay(message.text).text.trim();
		return normalized ? normalized : null;
	}
	return null;
}
function isToolCall(message) {
	return hasToolCall(message);
}
function extractToolNames(message) {
	return extractToolCallNames(message);
}
function extractMediaSummary(message) {
	if (!Array.isArray(message.content)) return null;
	for (const entry of message.content) {
		const raw = normalizeLowercaseStringOrEmpty(entry?.type);
		if (!raw || raw === "text" || raw === "toolcall" || raw === "tool_call") continue;
		return `[${raw}]`;
	}
	return null;
}
function buildSessionPreviewItems(messages, maxItems, maxChars) {
	const items = [];
	for (const message of messages) {
		if (!message || typeof message !== "object" || Array.isArray(message)) continue;
		const previewMessage = message;
		const toolCall = isToolCall(previewMessage);
		const role = normalizeRole(previewMessage.role, toolCall);
		let text = extractPreviewText(previewMessage);
		if (!text) {
			const toolNames = extractToolNames(previewMessage);
			if (toolNames.length > 0) {
				const shown = toolNames.slice(0, 2);
				const overflow = toolNames.length - shown.length;
				text = `call ${shown.join(", ")}`;
				if (overflow > 0) text += ` +${overflow}`;
			}
		}
		if (!text) text = extractMediaSummary(previewMessage);
		if (!text) continue;
		let trimmed = text.trim();
		if (!trimmed) continue;
		if (role === "user") trimmed = stripEnvelope(trimmed);
		trimmed = truncatePreviewText(trimmed, maxChars);
		items.push({
			role,
			text: trimmed
		});
	}
	if (items.length <= maxItems) return items;
	return items.slice(-maxItems);
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-history-events.ts
function resolveVisibleHistoryProjection(projection) {
	const visibleMessages = resolveVisibleMessagePositions(projection);
	const db = getActiveTranscriptKysely(projection.database);
	const rows = executeSqliteQuerySync(projection.database.db, db.selectFrom("session_transcript_active_events as active").innerJoin("transcript_event_identities as identity", (join) => join.onRef("identity.session_id", "=", "active.session_id").onRef("identity.seq", "=", "active.event_seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["identity.event_type", "event.event_json"]).select((eb) => eb.selectFrom("session_transcript_active_events as next").select((nextEb) => nextEb.fn.min("next.message_position").as("position")).whereRef("next.session_id", "=", "active.session_id").whereRef("next.active_position", ">", "active.active_position").where("next.message_position", "is not", null).as("next_message_position")).where("active.session_id", "=", projection.resolved.sessionId).where("identity.event_type", "in", ["compaction", "reset"]).orderBy("active.active_position", "asc")).rows;
	const latestBoundaryIsReset = rows.at(-1)?.event_type === "reset";
	const visibleRows = latestBoundaryIsReset ? rows.slice(-1) : rows;
	let priorBoundaries = 0;
	const boundaries = visibleRows.map((row) => {
		const messagePosition = latestBoundaryIsReset ? visibleMessages.kept.length : Math.min(row.next_message_position ?? projection.state.activeMessageCount, visibleMessages.total);
		return {
			displayPosition: messagePosition + priorBoundaries++,
			event: JSON.parse(row.event_json),
			messagePosition
		};
	});
	return {
		boundaries,
		total: visibleMessages.total + boundaries.length
	};
}
function readVisibleHistoryRange(projection, start, endExclusive, history = resolveVisibleHistoryProjection(projection)) {
	const boundedStart = Math.min(Math.max(0, start), history.total);
	const boundedEnd = Math.min(Math.max(boundedStart, endExclusive), history.total);
	if (boundedEnd <= boundedStart) return [];
	const boundaries = new Map(history.boundaries.map((boundary) => [boundary.displayPosition, boundary]));
	const boundariesBefore = history.boundaries.filter((boundary) => boundary.displayPosition < boundedStart).length;
	const selectedBoundaryCount = history.boundaries.filter((boundary) => boundary.displayPosition >= boundedStart && boundary.displayPosition < boundedEnd).length;
	const messageStart = boundedStart - boundariesBefore;
	const messages = readVisibleMessageRange(projection, messageStart, messageStart + boundedEnd - boundedStart - selectedBoundaryCount);
	let messageIndex = 0;
	const events = [];
	for (let displayPosition = boundedStart; displayPosition < boundedEnd; displayPosition += 1) {
		const boundary = boundaries.get(displayPosition);
		if (boundary) {
			events.push({
				event: boundary.event,
				seq: displayPosition + 1
			});
			continue;
		}
		const message = messages[messageIndex++];
		if (message) events.push({
			event: message.event,
			seq: displayPosition + 1
		});
	}
	return events;
}
function readVisibleMessageById(projection, eventId) {
	const db = getActiveTranscriptKysely(projection.database);
	const row = executeSqliteQueryTakeFirstSync(projection.database.db, db.selectFrom("transcript_event_identities as identity").innerJoin("session_transcript_active_events as active", (join) => join.onRef("active.session_id", "=", "identity.session_id").onRef("active.event_seq", "=", "identity.seq")).innerJoin("transcript_events as event", (join) => join.onRef("event.session_id", "=", "active.session_id").onRef("event.seq", "=", "active.event_seq")).select(["active.message_position", "event.event_json"]).where("identity.session_id", "=", projection.resolved.sessionId).where("identity.event_id", "=", eventId).where("active.message_position", "is not", null));
	if (!row || row.message_position === null) return;
	const visible = resolveVisibleMessagePositions(projection);
	const logicalPosition = row.message_position >= visible.postStart ? visible.kept.length + row.message_position - visible.postStart : visible.kept.indexOf(row.message_position);
	return logicalPosition < 0 ? void 0 : {
		event: JSON.parse(row.event_json),
		seq: logicalPosition + 1
	};
}
function resolveHistoryEventById(projection, eventId, history = resolveVisibleHistoryProjection(projection)) {
	const boundary = history.boundaries.find((candidate) => candidate.event.id === eventId);
	if (boundary) return {
		event: boundary.event,
		seq: boundary.displayPosition + 1
	};
	const message = readVisibleMessageById(projection, eventId);
	if (!message) return;
	const messagePosition = message.seq - 1;
	const precedingBoundaries = history.boundaries.filter((candidate) => candidate.messagePosition <= messagePosition).length;
	return {
		event: message.event,
		seq: message.seq + precedingBoundaries
	};
}
function readSessionTranscriptHistoryEvents(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		return readVisibleHistoryRange(projection, 0, history.total, history);
	});
}
function readRecentSessionTranscriptHistoryEvents(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const maxMessages = Math.min(MAX_VISIBLE_MESSAGE_MAX_MESSAGES, Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0)));
		const maxLines = Math.max(0, Math.floor(Number.isFinite(options.maxLines) ? options.maxLines : 0));
		if (maxMessages === 0 || maxLines === 0) return {
			activeLeafEntryId: projection.state.leafEventId,
			events: [],
			totalMessages: history.total
		};
		const maxBytes = Math.max(1024, Math.floor(Number.isFinite(options.maxBytes) ? options.maxBytes : 8 * 1024 * 1024));
		const candidates = readVisibleHistoryRange(projection, Math.max(0, history.total - maxLines), history.total, history);
		const selected = [];
		let bytes = 0;
		for (const event of candidates.toReversed()) {
			const eventBytes = Buffer.byteLength(JSON.stringify(event.event)) + 1;
			if (selected.length >= maxMessages || selected.length > 0 && bytes + eventBytes > maxBytes) break;
			selected.push(event);
			bytes += eventBytes;
		}
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: selected.toReversed(),
			totalMessages: history.total
		};
	});
}
function readSessionTranscriptHistoryEventPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const offset = Math.min(Math.max(0, Math.floor(Number.isFinite(options.offset) ? options.offset : 0)), history.total);
		const maxMessages = Math.max(0, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 0));
		const endExclusive = Math.max(0, history.total - offset);
		const start = Math.max(0, endExclusive - maxMessages);
		return {
			activeLeafEntryId: projection.state.leafEventId,
			events: readVisibleHistoryRange(projection, start, endExclusive, history),
			totalMessages: history.total
		};
	});
}
function readSessionTranscriptHistoryEventCount(scope) {
	return withCurrentProjectionSnapshot(scope, (projection) => resolveVisibleHistoryProjection(projection).total);
}
function readSessionTranscriptHistoryEventById(scope, eventId) {
	return withCurrentProjectionSnapshot(scope, (projection) => resolveHistoryEventById(projection, eventId));
}
function readSessionTranscriptHistoryAnchorPage(scope, options) {
	return withCurrentProjectionSnapshot(scope, (projection) => {
		const history = resolveVisibleHistoryProjection(projection);
		const anchor = resolveHistoryEventById(projection, options.messageId, history);
		if (!anchor) return {
			events: [],
			found: false,
			hasOverreadContext: false,
			offset: 0,
			totalMessages: history.total
		};
		const pageSize = Math.max(1, Math.floor(Number.isFinite(options.maxMessages) ? options.maxMessages : 1));
		const anchorPosition = anchor.seq - 1;
		const olderMessages = pageSize - Math.floor(pageSize / 2) - 1;
		const latestStart = Math.max(0, history.total - pageSize);
		const start = Math.min(Math.max(0, anchorPosition - olderMessages), latestStart);
		const endExclusive = Math.min(history.total, start + pageSize);
		const readStart = Math.max(0, start - 1);
		return {
			events: readVisibleHistoryRange(projection, readStart, endExclusive, history),
			found: true,
			hasOverreadContext: readStart < start,
			offset: history.total - endExclusive,
			totalMessages: history.total
		};
	});
}
//#endregion
//#region src/gateway/session-transcript-derived-readers.ts
function extractSqliteUsageSnapshot(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	const usageRaw = record.usage && typeof record.usage === "object" && !Array.isArray(record.usage) ? record.usage : void 0;
	const usage = normalizeUsage(usageRaw);
	const normalizedUsage = usage ?? {};
	const legacyCliUsage = record.api === "cli" && usageRaw && usageRaw.contextUsage === void 0;
	const totalTokens = legacyCliUsage ? void 0 : deriveSessionTotalTokens({ usage });
	const modelProvider = typeof record.provider === "string" ? record.provider.trim() : void 0;
	const model = typeof record.model === "string" ? record.model.trim() : void 0;
	const costUsd = typeof usageRaw?.cost?.total === "number" && Number.isFinite(usageRaw.cost.total) ? usageRaw.cost.total : usageRaw?.costUsd;
	const hasMeaningfulUsage = hasNonzeroUsage(usage) || typeof totalTokens === "number" || typeof costUsd === "number" && Number.isFinite(costUsd) && costUsd > 0;
	const isDeliveryMirror = modelProvider === "openclaw" && model === "delivery-mirror";
	if (!hasMeaningfulUsage && !modelProvider && !model) return null;
	if (isDeliveryMirror && !hasMeaningfulUsage) return null;
	return {
		...!isDeliveryMirror && modelProvider ? { modelProvider } : {},
		...!isDeliveryMirror && model ? { model } : {},
		...typeof normalizedUsage.input === "number" ? { inputTokens: normalizedUsage.input } : {},
		...typeof normalizedUsage.output === "number" ? { outputTokens: normalizedUsage.output } : {},
		...typeof normalizedUsage.cacheRead === "number" ? { cacheRead: normalizedUsage.cacheRead } : {},
		...typeof normalizedUsage.cacheWrite === "number" ? { cacheWrite: normalizedUsage.cacheWrite } : {},
		...legacyCliUsage ? { contextUsage: { state: "unavailable" } } : normalizedUsage.contextUsage ? { contextUsage: normalizedUsage.contextUsage } : {},
		...typeof totalTokens === "number" ? {
			totalTokens,
			totalTokensFresh: true
		} : {},
		...typeof costUsd === "number" && Number.isFinite(costUsd) ? { costUsd } : {}
	};
}
function aggregateSqliteUsageSnapshots(messages) {
	const aggregate = {};
	let sawUsage = false;
	let inputTokens = 0;
	let outputTokens = 0;
	let cacheRead = 0;
	let cacheWrite = 0;
	let costUsd = 0;
	let sawInput = false;
	let sawOutput = false;
	let sawCacheRead = false;
	let sawCacheWrite = false;
	let sawCost = false;
	for (const message of messages) {
		const snapshot = extractSqliteUsageSnapshot(message);
		if (!snapshot) continue;
		sawUsage = true;
		if (snapshot.modelProvider) aggregate.modelProvider = snapshot.modelProvider;
		if (snapshot.model) aggregate.model = snapshot.model;
		if (typeof snapshot.inputTokens === "number") {
			inputTokens += snapshot.inputTokens;
			sawInput = true;
		}
		if (typeof snapshot.outputTokens === "number") {
			outputTokens += snapshot.outputTokens;
			sawOutput = true;
		}
		if (typeof snapshot.cacheRead === "number") {
			cacheRead += snapshot.cacheRead;
			sawCacheRead = true;
		}
		if (typeof snapshot.cacheWrite === "number") {
			cacheWrite += snapshot.cacheWrite;
			sawCacheWrite = true;
		}
		if (snapshot.contextUsage) aggregate.contextUsage = snapshot.contextUsage;
		else if (typeof snapshot.totalTokens === "number") delete aggregate.contextUsage;
		if (snapshot.contextUsage?.state === "unavailable") {
			delete aggregate.totalTokens;
			delete aggregate.totalTokensFresh;
		} else if (typeof snapshot.totalTokens === "number") {
			aggregate.totalTokens = snapshot.totalTokens;
			aggregate.totalTokensFresh = true;
		}
		if (typeof snapshot.costUsd === "number") {
			costUsd += snapshot.costUsd;
			sawCost = true;
		}
	}
	if (!sawUsage) return null;
	if (sawInput) aggregate.inputTokens = inputTokens;
	if (sawOutput) aggregate.outputTokens = outputTokens;
	if (sawCacheRead) aggregate.cacheRead = cacheRead;
	if (sawCacheWrite) aggregate.cacheWrite = cacheWrite;
	if (sawCost) aggregate.costUsd = costUsd;
	return aggregate;
}
//#endregion
//#region src/gateway/session-transcript-readers.ts
function resolveTranscriptReadTarget(scope) {
	const target = resolveSessionTranscriptReadTarget(scope);
	return {
		agentId: target.agentId,
		sessionFile: target.sessionKey ?? target.sessionId,
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		storePath: target.storePath
	};
}
function toTranscriptReadScope(target) {
	return {
		...target.agentId ? { agentId: target.agentId } : {},
		sessionId: target.sessionId,
		...target.sessionKey ? { sessionKey: target.sessionKey } : {},
		...target.storePath ? { storePath: target.storePath } : {}
	};
}
function archivedTranscriptReader(target) {
	return new ArchivedTranscriptReader({
		agentId: target.agentId,
		sessionId: target.sessionId,
		storePath: target.storePath
	});
}
function readTranscriptRecordTimestampMs(event) {
	return parseDateFirstTimestampMs(event.timestamp);
}
function extractMessageRecord(event) {
	if (!event || typeof event !== "object" || Array.isArray(event)) return;
	const record = event;
	if (record.message === void 0) return;
	const recordTimestampMs = readTranscriptRecordTimestampMs(event);
	return {
		...typeof record.id === "string" ? { id: record.id } : {},
		message: record.message,
		...recordTimestampMs !== void 0 ? { recordTimestampMs } : {}
	};
}
function extractMessageRecordsFromEventEntries(entries) {
	return entries.flatMap((entry) => {
		const record = extractMessageRecord(entry.event);
		return record ? [{
			...record,
			seq: entry.seq
		}] : [];
	});
}
function readSqliteMessageRecordsSync(target) {
	return extractMessageRecordsFromEventEntries(readSessionTranscriptMessageEvents(toTranscriptReadScope(target)));
}
async function readSqliteMessageRecords(target) {
	return extractMessageRecordsFromEventEntries(readSessionTranscriptMessageEvents(toTranscriptReadScope(target)));
}
function projectSqliteHistoryEvents(entries) {
	return entries.flatMap((entry) => {
		const message = projectTranscriptEntryMessage(entry.event, entry.seq);
		return message ? [message] : [];
	});
}
async function readSqliteHistoryMessages(target) {
	return projectSqliteHistoryEvents(readSessionTranscriptHistoryEvents(toTranscriptReadScope(target)));
}
function readSqliteMessagesSync(target) {
	return readSqliteMessageRecordsSync(target).map(sqliteRecordMessageWithSeq);
}
function normalizeRecentSqliteReadOptions(opts) {
	const maxMessages = Math.max(0, Math.floor(opts?.maxMessages ?? 0));
	const maxBytes = typeof opts?.maxBytes === "number" && Number.isFinite(opts.maxBytes) ? Math.max(1024, Math.floor(opts.maxBytes)) : 8 * 1024 * 1024;
	const defaultMaxLines = maxMessages * 20 + 20;
	return {
		maxMessages,
		maxBytes,
		maxLines: typeof opts?.maxLines === "number" && Number.isFinite(opts.maxLines) ? Math.max(maxMessages, Math.floor(opts.maxLines)) : defaultMaxLines
	};
}
async function readRecentSqliteMessageRecords(target, opts) {
	const normalized = normalizeRecentSqliteReadOptions(opts);
	const page = readRecentSessionTranscriptHistoryEvents(toTranscriptReadScope(target), normalized);
	return {
		...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		messages: projectSqliteHistoryEvents(page.events),
		transcriptEvents: page.events.map((entry) => entry.event),
		totalMessages: page.totalMessages
	};
}
function readRecentSqliteUsageMessages(target, maxBytes) {
	return extractMessageRecordsFromEventEntries(readRecentSessionTranscriptMessageEvents(toTranscriptReadScope(target), {
		maxBytes: Math.max(1024, Math.floor(Number.isFinite(maxBytes) ? maxBytes : 8 * 1024 * 1024)),
		maxLines: 1e3,
		maxMessages: 1e3
	}).events).map((record) => record.message);
}
function sqliteRecordMessageWithSeq(record) {
	const rawIdempotencyKey = record.message?.idempotencyKey;
	const idempotencyKey = typeof rawIdempotencyKey === "string" && rawIdempotencyKey.trim() ? rawIdempotencyKey.trim() : void 0;
	return attachOpenClawTranscriptMeta(record.message, {
		...record.id ? { id: record.id } : {},
		...idempotencyKey ? { idempotencyKey } : {},
		...record.recordTimestampMs !== void 0 ? { recordTimestampMs: record.recordTimestampMs } : {},
		seq: record.seq
	});
}
function sqliteMessageEventWithSeq(entry) {
	return projectTranscriptEntryMessage(entry.event, entry.seq);
}
function extractMessageRole(message) {
	return message && typeof message === "object" && !Array.isArray(message) ? message.role : void 0;
}
function extractSessionTranscriptText(message) {
	if (!message || typeof message !== "object" || Array.isArray(message)) return null;
	const record = message;
	if (typeof record.content === "string") return record.content.trim() || null;
	if (Array.isArray(record.content)) return record.content.map((entry) => entry && typeof entry === "object" && typeof entry.text === "string" ? entry.text : "").filter((part) => part.trim()).join("\n").trim() || null;
	if (typeof record.text === "string") return record.text.trim() || null;
	return null;
}
function readSqliteAggregateUsageSnapshot(target) {
	return aggregateSqliteUsageSnapshots(readSqliteMessagesSync(target));
}
function buildSqlitePreviewItems(target, maxItems, maxChars) {
	return buildSessionPreviewItems(readSqliteMessagesSync(target), maxItems, maxChars);
}
/** Reads display messages asynchronously through the reader seam. */
async function readSessionMessagesAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	if (opts.mode === "recent") {
		const { messages } = await readRecentSqliteMessageRecords(target, opts);
		if (messages.length === 0 && opts.allowResetArchiveFallback === true) return (await archivedTranscriptReader(target).read({
			...opts,
			resetArchiveOnly: true
		})).messages;
		return messages;
	}
	const messages = await readSqliteHistoryMessages(target);
	if (messages.length === 0 && opts.allowResetArchiveFallback === true) return (await archivedTranscriptReader(target).read({
		...opts,
		resetArchiveOnly: true
	})).messages;
	return messages;
}
/** Reads display messages with source metadata through the reader seam. */
async function readSessionMessagesWithSourceAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const messages = opts.mode === "recent" ? (await readRecentSqliteMessageRecords(target, opts)).messages : await readSqliteHistoryMessages(target);
	if (messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).read({
		...opts,
		resetArchiveOnly: true
	});
	return {
		messages,
		transcriptPath: target.sessionFile
	};
}
/** Finds one display message by transcript id through the reader seam. */
async function readSessionMessageByIdAsync(scope, messageId, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const foundEvent = readSessionTranscriptHistoryEventById(toTranscriptReadScope(target), messageId);
	if (foundEvent) return {
		found: true,
		message: projectTranscriptEntryMessage(foundEvent.event, foundEvent.seq),
		oversized: false,
		seq: foundEvent.seq
	};
	if (opts?.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readById(messageId, {
		...opts,
		resetArchiveOnly: true
	});
	return {
		found: false,
		oversized: false
	};
}
/** Visits display messages asynchronously through the reader seam. */
async function visitSessionMessagesAsync(scope, visit, _opts) {
	const target = resolveTranscriptReadTarget(scope);
	let count = 0;
	for (const record of await readSqliteMessageRecords(target)) {
		visit(record.message, record.seq);
		count += 1;
	}
	return count;
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const transcriptScope = toTranscriptReadScope(resolveTranscriptReadTarget(scope));
	try {
		return readSessionTranscriptHistoryEventCount(transcriptScope);
	} catch (error) {
		if (!isSessionTranscriptProjectionUnavailableError(error)) throw error;
		await waitForSessionTranscriptProjection(transcriptScope);
		return readSessionTranscriptHistoryEventCount(transcriptScope);
	}
}
/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const { activeLeafEntryId, messages, transcriptEvents, totalMessages } = await readRecentSqliteMessageRecords(target, opts);
	if (totalMessages === 0 && messages.length === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readRecentWithStats({
		...opts,
		resetArchiveOnly: true
	});
	return {
		...activeLeafEntryId !== void 0 ? { activeLeafEntryId } : {},
		messages,
		transcriptEvents,
		totalMessages,
		transcriptPath: target.sessionFile,
		transcriptSource: "active"
	};
}
/** Reads one offset page with total-count metadata through the reader seam. */
async function readSessionMessagesPageWithStatsAsync(scope, opts) {
	const target = resolveTranscriptReadTarget(scope);
	const page = readSessionTranscriptHistoryEventPage(toTranscriptReadScope(target), opts);
	if (page.totalMessages === 0 && opts.allowResetArchiveFallback === true) return await archivedTranscriptReader(target).readPage({
		...opts,
		resetArchiveOnly: true
	});
	return {
		...Object.hasOwn(page, "activeLeafEntryId") ? { activeLeafEntryId: page.activeLeafEntryId } : {},
		messages: projectSqliteHistoryEvents(page.events),
		transcriptEvents: page.events.map((entry) => entry.event),
		totalMessages: page.totalMessages,
		transcriptPath: target.sessionFile,
		transcriptSource: "active"
	};
}
/** Reads aggregate usage from a full transcript asynchronously through the reader seam. */
async function readLatestSessionUsageFromTranscriptAsync(scope) {
	const artifactFile = scope.sessionFile?.trim();
	const concreteStorePath = resolveConcreteSessionStorePath(scope.storePath);
	const targetAgentId = scope.agentId?.trim() || resolveAgentIdFromSessionKey(scope.sessionKey);
	if (!Boolean(targetAgentId && scope.sessionKey?.trim() && concreteStorePath) && artifactFile && path.isAbsolute(artifactFile) && artifactFile.endsWith(".jsonl")) return await readLatestSessionUsageFromTranscriptFileAsync(scope.sessionId, concreteStorePath, artifactFile, void 0);
	return readSqliteAggregateUsageSnapshot(resolveTranscriptReadTarget(scope));
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	return aggregateSqliteUsageSnapshots(readRecentSqliteUsageMessages(resolveTranscriptReadTarget(scope), maxBytes));
}
/** Reads compact session preview items through the reader seam. */
function readSessionPreviewItemsFromTranscript(scope, maxItems, maxChars) {
	return buildSqlitePreviewItems(resolveTranscriptReadTarget(scope), maxItems, maxChars);
}
//#endregion
export { stripEnvelopeFromMessages as C, stripEnvelopeFromMessage as S, ArchivedTranscriptReader as _, readRecentSessionUsageFromTranscript as a, attachOpenClawTranscriptMeta as b, readSessionMessagesAsync as c, readSessionPreviewItemsFromTranscript as d, resolveTranscriptReadTarget as f, readSessionTranscriptHistoryAnchorPage as g, visitSessionMessagesAsync as h, readRecentSessionMessagesWithStatsAsync as i, readSessionMessagesPageWithStatsAsync as l, toTranscriptReadScope as m, extractSessionTranscriptText as n, readSessionMessageByIdAsync as o, sqliteMessageEventWithSeq as p, readLatestSessionUsageFromTranscriptAsync as r, readSessionMessageCountAsync as s, extractMessageRole as t, readSessionMessagesWithSourceAsync as u, capArrayByJsonBytes as v, projectTranscriptEntryMessage as x, resolveSessionHistoryTranscriptPathAsync as y };
