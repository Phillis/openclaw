import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { i as normalizeBoundedOptionalString } from "./string-coerce-CIXf7egm.js";
import { v as parseDateFirstTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-runtime-BgD3Qbvt.js";
import "./text-utility-runtime-LRU688AB.js";
import { t as resolveAcpSessionAvailability } from "./acp-runtime-BdQ2pX54.js";
import { n as decodeNodePtyResumeParams, r as runNodePtyCommand, t as resolveNodeHostExecutable } from "./node-host-DzLm_UVz.js";
import { a as isExternalUserText, i as createSessionCatalogAdoptionCoordinator, l as sessionCatalogAdoptedSessionKey, o as listAdoptedSessionCatalogSessions, r as importSessionCatalogHistory, u as sessionCatalogAdoptedSourceKey } from "./session-catalog-BUkkJEWz.js";
import { a as PI_SESSION_READ_COMMAND, i as PI_SESSIONS_LIST_COMMAND, n as piSessionStore, o as PI_TERMINAL_RESUME_COMMAND, r as piSessionStoreAvailable, t as piAcpSessionStoreRoot } from "./pi-session-paths-WBbprMuq.js";
import process from "node:process";
import { createReadStream } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region extensions/acpx/src/pi-session-timestamp.ts
/** Preserve Pi JSONL's date-first string contract while accepting numeric millisecond values. */
function parsePiSessionTimestampMs(value) {
	return parseDateFirstTimestampMs(value);
}
//#endregion
//#region extensions/acpx/src/pi-session-store.ts
const MAX_DISCOVERY_FILES = 1e4;
const SUMMARY_SCAN_BATCH_SIZE = 100;
const MAX_SUMMARY_CACHE_ENTRIES = 256;
const MAX_SESSION_BYTES = 32 * 1024 * 1024;
const MAX_SUMMARY_LINE_BYTES = 1024 * 1024;
const APPEND_PROOF_EDGE_BYTES = 64 * 1024;
const IO_CONCURRENCY = 8;
const PI_FILE_CANDIDATE_CACHE_TTL_MS = 32e3;
const PI_FILE_CANDIDATE_CACHE_MAX_ENTRIES = 8;
const SESSION_ID_PATTERN$2 = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const summaryCache = /* @__PURE__ */ new Map();
const threadFileCache = /* @__PURE__ */ new Map();
const piFileCandidateCache = /* @__PURE__ */ new Map();
function threadCacheKey(storeRoot, threadId) {
	return `${storeRoot}\0${threadId}`;
}
function forgetCachedSummary(file) {
	const cached = summaryCache.get(file);
	const threadId = cached?.summary?.threadId;
	if (cached && threadId) {
		const key = threadCacheKey(cached.storeRoot, threadId);
		if (threadFileCache.get(key) === file) threadFileCache.delete(key);
	}
	summaryCache.delete(file);
}
function cacheSummary(file, value) {
	forgetCachedSummary(file);
	summaryCache.set(file, value);
	while (summaryCache.size > MAX_SUMMARY_CACHE_ENTRIES) {
		const oldest = summaryCache.keys().next().value;
		if (typeof oldest !== "string") break;
		forgetCachedSummary(oldest);
	}
}
async function discoverPiSessionFiles(env) {
	const store = piSessionStore(env);
	const resolvedRoot = await realpathOrResolve(store.root);
	let entries;
	try {
		entries = await fs$1.readdir(resolvedRoot, { withFileTypes: true });
	} catch {
		return {
			root: store.root,
			files: []
		};
	}
	if (store.flat) return {
		root: store.root,
		files: entries.filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl")).slice(0, MAX_DISCOVERY_FILES).map((entry) => path.join(resolvedRoot, entry.name))
	};
	const files = [];
	for (const entry of entries) {
		if (!entry.isDirectory() || files.length >= MAX_DISCOVERY_FILES) continue;
		const directory = path.join(resolvedRoot, entry.name);
		let children;
		try {
			children = await fs$1.readdir(directory, { withFileTypes: true });
		} catch {
			continue;
		}
		for (const child of children) if (child.isFile() && child.name.endsWith(".jsonl")) {
			files.push(path.join(directory, child.name));
			if (files.length >= MAX_DISCOVERY_FILES) break;
		}
	}
	return {
		root: store.root,
		files
	};
}
async function realpathOrResolve(value) {
	try {
		return await fs$1.realpath(value);
	} catch {
		return path.resolve(value);
	}
}
async function mapConcurrent(values, limit, mapper) {
	const results = [];
	results.length = values.length;
	let nextIndex = 0;
	const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
		while (nextIndex < values.length) {
			const index = nextIndex++;
			results[index] = await mapper(values[index]);
		}
	});
	await Promise.all(workers);
	return results;
}
async function scanPiFileCandidates(env) {
	const { root, files } = await discoverPiSessionFiles(env);
	const configuredAcpRoot = piAcpSessionStoreRoot(env);
	const acpRoot = configuredAcpRoot ? await realpathOrResolve(configuredAcpRoot) : void 0;
	return (await mapConcurrent(files, IO_CONCURRENCY, async (file) => {
		try {
			const stats = await fs$1.stat(file);
			return stats.isFile() ? {
				file,
				storeRoot: root,
				identity: `${String(stats.dev)}:${String(stats.ino)}:${String(stats.birthtimeMs)}`,
				mtimeMs: stats.mtimeMs,
				size: stats.size,
				resumable: acpRoot ? pathIsWithin(acpRoot, file) : false
			} : void 0;
		} catch {
			return;
		}
	})).filter((candidate) => candidate !== void 0).toSorted((left, right) => right.mtimeMs - left.mtimeMs);
}
async function piFileCandidates(env) {
	const store = piSessionStore(env);
	const key = `${store.root}\0${store.flat}\0${piAcpSessionStoreRoot(env) ?? ""}`;
	const cached = piFileCandidateCache.get(key);
	if (cached && cached.expiresAt > Date.now()) {
		piFileCandidateCache.delete(key);
		piFileCandidateCache.set(key, cached);
		return await cached.candidates;
	}
	if (cached) piFileCandidateCache.delete(key);
	const candidates = scanPiFileCandidates(env);
	const entry = {
		expiresAt: Date.now() + PI_FILE_CANDIDATE_CACHE_TTL_MS,
		candidates
	};
	piFileCandidateCache.set(key, entry);
	while (piFileCandidateCache.size > PI_FILE_CANDIDATE_CACHE_MAX_ENTRIES) {
		const oldest = piFileCandidateCache.keys().next();
		if (oldest.done) break;
		piFileCandidateCache.delete(oldest.value);
	}
	try {
		return await candidates;
	} catch (error) {
		if (piFileCandidateCache.get(key) === entry) piFileCandidateCache.delete(key);
		throw error;
	}
}
function pathIsWithin(root, candidate) {
	const relative = path.relative(root, candidate);
	return relative !== "" && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
}
function parsePiJsonLines(content) {
	return content.split(/\r?\n/u).flatMap((line) => {
		if (!line.trim()) return [];
		try {
			const value = JSON.parse(line);
			return isRecord(value) ? [value] : [];
		} catch {
			return [];
		}
	});
}
function textFromContent$2(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => isRecord(part) && part.type === "text" && typeof part.text === "string" ? [part.text] : []).join("\n");
}
function processSummaryLine(state, line) {
	const entry = parsePiJsonLines((line.at(-1) === 13 ? line.subarray(0, -1) : line).toString("utf8"))[0];
	if (!entry) return;
	if (!state.header) {
		if (entry.type !== "session") {
			state.invalid = true;
			return;
		}
		state.header = entry;
		return;
	}
	if (entry.type === "session_info") state.name = normalizeBoundedOptionalString(entry.name, 1e3);
	else if (!state.firstMessage && entry.type === "message" && isRecord(entry.message) && entry.message.role === "user") state.firstMessage = normalizeBoundedOptionalString(textFromContent$2(entry.message.content), 1e3);
}
function appendSummaryBytes(state, bytes) {
	if (state.discarding || bytes.length === 0) return;
	if (state.pending.length + bytes.length > MAX_SUMMARY_LINE_BYTES) {
		state.pending = Buffer.alloc(0);
		state.discarding = true;
		return;
	}
	state.pending = state.pending.length === 0 ? Buffer.from(bytes) : Buffer.concat([state.pending, bytes]);
}
async function scanSummaryAppend(candidate, start, state) {
	if (start >= candidate.size || state.invalid) return;
	const stream = createReadStream(candidate.file, {
		start,
		end: candidate.size - 1
	});
	for await (const value of stream) {
		const chunk = Buffer.isBuffer(value) ? value : Buffer.from(value);
		let offset = 0;
		while (offset < chunk.length) {
			const newline = chunk.indexOf(10, offset);
			const end = newline < 0 ? chunk.length : newline;
			appendSummaryBytes(state, chunk.subarray(offset, end));
			if (newline < 0) break;
			if (!state.discarding) processSummaryLine(state, state.pending);
			state.pending = Buffer.alloc(0);
			state.discarding = false;
			if (state.invalid) return;
			offset = newline + 1;
		}
	}
}
async function readAppendProof(file, size) {
	const length = Math.min(size, APPEND_PROOF_EDGE_BYTES);
	if (length === 0) return {
		head: Buffer.alloc(0),
		tail: Buffer.alloc(0)
	};
	const handle = await fs$1.open(file, "r");
	try {
		const head = Buffer.alloc(length);
		const tail = Buffer.alloc(length);
		const [headRead, tailRead] = await Promise.all([handle.read(head, 0, length, 0), handle.read(tail, 0, length, size - length)]);
		return {
			head: head.subarray(0, headRead.bytesRead),
			tail: tail.subarray(0, tailRead.bytesRead)
		};
	} finally {
		await handle.close();
	}
}
async function cachedPrefixIsUnchanged(candidate, cached) {
	if (cached.identity !== candidate.identity || cached.size >= candidate.size) return false;
	const current = await readAppendProof(candidate.file, cached.size);
	return current.head.equals(cached.appendProof.head) && current.tail.equals(cached.appendProof.tail);
}
async function readPiSessionSummary(candidate) {
	const cached = summaryCache.get(candidate.file);
	if (cached?.mtimeMs === candidate.mtimeMs && cached.size === candidate.size) {
		summaryCache.delete(candidate.file);
		summaryCache.set(candidate.file, cached);
		return cached.summary ? {
			...cached.summary,
			canContinue: candidate.resumable
		} : cached.summary;
	}
	let summary;
	let scanState;
	let appendProof;
	try {
		const resumable = cached && await cachedPrefixIsUnchanged(candidate, cached) ? cached : void 0;
		scanState = resumable ? {
			...resumable.scanState,
			pending: Buffer.from(resumable.scanState.pending)
		} : {
			pending: Buffer.alloc(0),
			discarding: false,
			invalid: false
		};
		await scanSummaryAppend(candidate, resumable?.size ?? 0, scanState);
		appendProof = await readAppendProof(candidate.file, candidate.size);
		const projectedState = {
			...scanState,
			pending: Buffer.from(scanState.pending)
		};
		if (!projectedState.discarding && projectedState.pending.length > 0) processSummaryLine(projectedState, projectedState.pending);
		const { header, name, firstMessage } = projectedState;
		const version = header?.type === "session" && typeof header.version === "number" ? header.version : 1;
		const threadId = header?.type === "session" ? normalizeBoundedOptionalString(header.id, 256) : void 0;
		if (header && threadId && SESSION_ID_PATTERN$2.test(threadId)) {
			const cwd = normalizeBoundedOptionalString(header.cwd, 4096);
			const createdAt = parsePiSessionTimestampMs(header.timestamp);
			summary = {
				file: candidate.file,
				version,
				threadId,
				...name || firstMessage ? { name: name ?? firstMessage } : {},
				...cwd ? { cwd } : {},
				status: "stored",
				...createdAt !== void 0 ? { createdAt } : {},
				updatedAt: candidate.mtimeMs,
				recencyAt: candidate.mtimeMs,
				source: "pi-cli",
				modelProvider: "pi",
				archived: false,
				canContinue: candidate.resumable,
				canArchive: false
			};
		}
	} catch {
		return cached?.summary;
	}
	if (cached?.summary?.threadId && cached.summary.threadId !== summary?.threadId) threadFileCache.delete(threadCacheKey(cached.storeRoot, cached.summary.threadId));
	cacheSummary(candidate.file, {
		...candidate,
		summary,
		scanState,
		appendProof
	});
	if (summary) threadFileCache.set(threadCacheKey(candidate.storeRoot, summary.threadId), candidate.file);
	return summary;
}
function summaryMatches(summary, needle) {
	if (!needle) return true;
	return [
		summary.threadId,
		summary.name,
		summary.cwd
	].some((field) => field?.toLocaleLowerCase().includes(needle));
}
async function listPiSummaryPage(env, params) {
	const candidates = await piFileCandidates(env);
	const activeFiles = new Set(candidates.map((candidate) => candidate.file));
	for (const file of summaryCache.keys()) if (!activeFiles.has(file)) forgetCachedSummary(file);
	const target = params.offset + params.limit + 1;
	const matches = [];
	const needle = params.searchTerm?.toLocaleLowerCase();
	for (let index = 0; index < candidates.length && matches.length < target; index += SUMMARY_SCAN_BATCH_SIZE) {
		const summaries = await mapConcurrent(candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE), IO_CONCURRENCY, readPiSessionSummary);
		for (const summary of summaries) if (summary && summaryMatches(summary, needle)) {
			matches.push(summary);
			if (matches.length >= target) break;
		}
	}
	return {
		summaries: matches.slice(params.offset, params.offset + params.limit),
		hasMore: matches.length > params.offset + params.limit
	};
}
async function findPiSummary(threadId, env) {
	const candidates = await piFileCandidates(env);
	for (let index = 0; index < candidates.length; index += SUMMARY_SCAN_BATCH_SIZE) {
		const match = (await mapConcurrent(candidates.slice(index, index + SUMMARY_SCAN_BATCH_SIZE), IO_CONCURRENCY, readPiSessionSummary)).find((summary) => summary?.threadId === threadId);
		if (match) return match;
	}
}
async function readPiSessionFileBaseline(threadId, env) {
	const summary = await findPiSummary(threadId, env);
	if (!summary?.canContinue || summary.version < 3) return;
	try {
		const stats = await fs$1.stat(summary.file);
		return stats.isFile() ? {
			filePath: summary.file,
			offset: stats.size
		} : void 0;
	} catch {
		return;
	}
}
async function readPiSessionById(threadId, env) {
	const cacheKey = threadCacheKey(piSessionStore(env).root, threadId);
	let file = threadFileCache.get(cacheKey);
	for (let attempt = 0; attempt < 2; attempt += 1) {
		if (!file) file = (await findPiSummary(threadId, env))?.file;
		if (!file) throw new Error("Pi session was not found");
		try {
			const stats = await fs$1.stat(file);
			if (!stats.isFile()) throw new Error("Pi session is not a file");
			if (stats.size > MAX_SESSION_BYTES) throw new RangeError("Pi session exceeds the 32 MiB read safety limit");
			const entries = parsePiJsonLines(await fs$1.readFile(file, "utf8"));
			if (entries[0]?.type === "session" && entries[0].id === threadId) return entries;
		} catch (error) {
			if (error instanceof RangeError) throw error;
			if (attempt > 0) throw new Error("Pi session is unavailable", { cause: error });
		}
		threadFileCache.delete(cacheKey);
		file = void 0;
	}
	throw new Error("Pi session changed during read");
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog.ts
const LOCAL_HOST_ID$1 = "gateway";
const DEFAULT_PAGE_LIMIT = 20;
const MAX_PAGE_LIMIT$1 = 100;
const MAX_SEARCH_LENGTH = 500;
const MAX_CURSOR_LENGTH = 128;
const MAX_TRANSCRIPT_ITEM_BYTES = 512 * 1024;
const MAX_TRANSCRIPT_PAGE_BYTES = 20 * 1024 * 1024;
const SESSION_ID_PATTERN$1 = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
function boundedLimit(value, fallback = DEFAULT_PAGE_LIMIT) {
	if (value === void 0) return fallback;
	if (!Number.isInteger(value) || Number(value) < 1 || Number(value) > MAX_PAGE_LIMIT$1) throw new Error(`limit must be an integer between 1 and ${String(MAX_PAGE_LIMIT$1)}`);
	return Number(value);
}
function encodeCursor(offset) {
	return Buffer.from(JSON.stringify({ offset }), "utf8").toString("base64url");
}
function optionalRawCursor(value) {
	if (value === void 0) return;
	if (typeof value !== "string" || value.length === 0 || value.length > MAX_CURSOR_LENGTH) throw new Error("cursor is invalid");
	return value;
}
function decodeCursor(value) {
	const cursor = optionalRawCursor(value);
	if (cursor === void 0) return 0;
	try {
		const bytes = Buffer.from(cursor, "base64url");
		if (bytes.toString("base64url") !== cursor) throw new Error("non-canonical base64url");
		const parsed = JSON.parse(bytes.toString("utf8"));
		if (!isRecord(parsed) || !Number.isSafeInteger(parsed.offset) || Number(parsed.offset) < 0) throw new Error("invalid offset");
		const offset = Number(parsed.offset);
		if (encodeCursor(offset) !== cursor) throw new Error("non-canonical cursor payload");
		return offset;
	} catch (error) {
		throw new Error("cursor is invalid", { cause: error });
	}
}
function isExactPiSessionCursor(value) {
	if (typeof value !== "string") return false;
	try {
		decodeCursor(value);
		return true;
	} catch {
		return false;
	}
}
function truncateUtf8(text, maxBytes) {
	if (Buffer.byteLength(text, "utf8") <= maxBytes) return text;
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(text.slice(0, middle), "utf8") <= maxBytes - 3) low = middle;
		else high = middle - 1;
	}
	const end = low > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(low - 1)) ? low - 1 : low;
	return `${text.slice(0, end)}…`;
}
function transcriptPage(items, limit, offset) {
	const end = Math.max(0, items.length - offset);
	const start = Math.max(0, end - limit);
	const page = [];
	let pageBytes = 2;
	for (let index = end - 1; index >= start; index -= 1) {
		const item = items[index];
		if (!item) continue;
		const bounded = {
			...item,
			text: truncateUtf8(item.text ?? "", MAX_TRANSCRIPT_ITEM_BYTES)
		};
		const itemBytes = Buffer.byteLength(JSON.stringify(bounded), "utf8") + 1;
		if (page.length > 0 && pageBytes + itemBytes > MAX_TRANSCRIPT_PAGE_BYTES) break;
		page.unshift(bounded);
		pageBytes += itemBytes;
	}
	const consumed = offset + page.length;
	return {
		items: page,
		...consumed < items.length ? { nextCursor: encodeCursor(consumed) } : {}
	};
}
function textFromContent$1(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((part) => {
		if (!isRecord(part)) return [];
		if (part.type === "text" && typeof part.text === "string") return [part.text];
		if (part.type === "image") {
			const mimeType = normalizeBoundedOptionalString(part.mimeType, 128);
			return [mimeType ? `[image: ${mimeType}]` : "[image]"];
		}
		return [];
	}).join("\n");
}
function parseListParams(value) {
	if (value === void 0 || value === null) return { limit: DEFAULT_PAGE_LIMIT };
	if (!isRecord(value)) throw new Error("Pi session list parameters must be an object");
	const unknown = Object.keys(value).find((key) => ![
		"searchTerm",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(`unknown Pi session list parameter: ${unknown}`);
	const searchTerm = normalizeBoundedOptionalString(value.searchTerm, MAX_SEARCH_LENGTH);
	if (value.searchTerm !== void 0 && !searchTerm) throw new Error("searchTerm is invalid");
	const cursor = optionalRawCursor(value.cursor);
	return {
		limit: boundedLimit(value.limit),
		...searchTerm ? { searchTerm } : {},
		...cursor ? { cursor } : {}
	};
}
function parseReadParams(value) {
	if (!isRecord(value)) throw new Error("Pi session read parameters must be an object");
	const unknown = Object.keys(value).find((key) => ![
		"threadId",
		"limit",
		"cursor"
	].includes(key));
	if (unknown) throw new Error(`unknown Pi session read parameter: ${unknown}`);
	const threadId = normalizeBoundedOptionalString(value.threadId, 256);
	if (!threadId || !SESSION_ID_PATTERN$1.test(threadId)) throw new Error("threadId is invalid");
	const cursor = optionalRawCursor(value.cursor);
	return {
		threadId,
		limit: boundedLimit(value.limit),
		...cursor ? { cursor } : {}
	};
}
async function listLocalPiSessionPage(value) {
	const params = parseListParams(value);
	const offset = decodeCursor(params.cursor);
	const { summaries, hasMore } = await listPiSummaryPage(process.env, {
		offset,
		limit: params.limit,
		...params.searchTerm ? { searchTerm: params.searchTerm } : {}
	});
	const page = summaries.map(({ file: _file, version: _version, ...session }) => session);
	return {
		sessions: page,
		...hasMore ? { nextCursor: encodeCursor(offset + page.length) } : {}
	};
}
function isoTimestamp(message, entry) {
	const value = parsePiSessionTimestampMs(message.timestamp) ?? parsePiSessionTimestampMs(entry.timestamp);
	if (value === void 0) return;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? void 0 : date.toISOString();
}
function jsonText(value, maxLength = 2e4) {
	try {
		const text = JSON.stringify(value);
		return text.length > maxLength ? `${truncateUtf16Safe(text, maxLength)}…` : text;
	} catch {
		return;
	}
}
function activePiEntries(entries) {
	const header = entries[0];
	if ((header?.type === "session" && typeof header.version === "number" ? header.version : 1) < 2) return entries.slice(1);
	const body = entries.filter((entry) => entry.type !== "session" && normalizeBoundedOptionalString(entry.id, 256));
	const byId = new Map(body.map((entry) => [String(entry.id), entry]));
	const active = [];
	let current = body.at(-1);
	const visited = /* @__PURE__ */ new Set();
	while (current) {
		const id = String(current.id);
		if (visited.has(id)) break;
		visited.add(id);
		active.push(current);
		const parentId = normalizeBoundedOptionalString(current.parentId, 256);
		current = parentId ? byId.get(parentId) : void 0;
	}
	return active.toReversed();
}
function piMessageItems(entry) {
	if (!isRecord(entry.message)) return [];
	const message = entry.message;
	const role = message.role;
	const id = normalizeBoundedOptionalString(entry.id, 256);
	const timestamp = isoTimestamp(message, entry);
	const model = normalizeBoundedOptionalString(message.model, 256);
	const provider = normalizeBoundedOptionalString(message.provider, 256);
	const modelRef = provider && model ? `${provider}/${model}` : model;
	const common = {
		...id ? { id } : {},
		...timestamp ? { timestamp } : {},
		...modelRef ? { model: modelRef } : {}
	};
	if (role === "user") {
		const text = textFromContent$1(message.content);
		return text ? [{
			...common,
			type: "userMessage",
			text
		}] : [];
	}
	if (role === "toolResult") {
		const toolName = normalizeBoundedOptionalString(message.toolName, 256);
		const text = textFromContent$1(message.content);
		return [{
			...common,
			type: "toolResult",
			text: toolName ? `${toolName}\n${text}` : text
		}];
	}
	if (role === "bashExecution") {
		const command = normalizeBoundedOptionalString(message.command, 4096) ?? "bash";
		const output = typeof message.output === "string" ? message.output : "";
		const status = message.cancelled === true ? "command cancelled" : typeof message.exitCode === "number" && message.exitCode !== 0 ? `command exited with code ${String(message.exitCode)}` : "";
		return [{
			...common,
			type: "toolCall",
			text: `bash\n${command}`
		}, {
			...common,
			...id ? { id: `${id}:result` } : {},
			type: "toolResult",
			text: [output, status].filter(Boolean).join("\n\n")
		}];
	}
	if (role === "custom" || role === "hookMessage") {
		if (message.display !== true) return [];
		const customType = normalizeBoundedOptionalString(message.customType, 256);
		const text = textFromContent$1(message.content);
		return text ? [{
			...common,
			type: "other",
			text: customType ? `${customType}\n${text}` : text
		}] : [];
	}
	if (role !== "assistant" || !Array.isArray(message.content)) return [];
	return message.content.flatMap((part, index) => {
		if (!isRecord(part)) return [];
		const partCommon = {
			...common,
			...id ? { id: `${id}:${String(index)}` } : {}
		};
		if (part.type === "text" && typeof part.text === "string") return [{
			...partCommon,
			type: "agentMessage",
			text: part.text
		}];
		if (part.type === "thinking" && typeof part.thinking === "string") return [{
			...partCommon,
			type: "reasoning",
			text: part.thinking
		}];
		if (part.type === "toolCall") {
			const name = normalizeBoundedOptionalString(part.name, 256) ?? "tool";
			const args = jsonText(part.arguments);
			return [{
				...partCommon,
				type: "toolCall",
				text: args ? `${name}\n${args}` : name
			}];
		}
		return [];
	});
}
function piTranscriptItems(entries) {
	return activePiEntries(entries).flatMap((entry) => {
		if (entry.type === "message") return piMessageItems(entry);
		const id = normalizeBoundedOptionalString(entry.id, 256);
		const timestamp = normalizeBoundedOptionalString(entry.timestamp, 128);
		const common = {
			...id ? { id } : {},
			...timestamp ? { timestamp } : {}
		};
		if (entry.type === "compaction" && typeof entry.summary === "string") return [{
			...common,
			type: "other",
			text: entry.summary
		}];
		if (entry.type === "branch_summary" && typeof entry.summary === "string") return [{
			...common,
			type: "other",
			text: entry.summary
		}];
		if (entry.type === "custom_message" && entry.display === true) {
			const text = textFromContent$1(entry.content);
			return text ? [{
				...common,
				type: "other",
				text
			}] : [];
		}
		return [];
	});
}
async function readLocalPiTranscriptPage(value) {
	const params = parseReadParams(value);
	const offset = decodeCursor(params.cursor);
	const page = transcriptPage(piTranscriptItems(await readPiSessionById(params.threadId, process.env)), params.limit, offset);
	return {
		hostId: LOCAL_HOST_ID$1,
		label: "Local Pi",
		threadId: params.threadId,
		...page
	};
}
//#endregion
//#region extensions/acpx/src/pi-session-upstream-activity.ts
const MAX_PI_UPSTREAM_SCAN_BYTES = 1024 * 1024;
async function readFileRange(handle, position, length) {
	const buffer = Buffer.alloc(length);
	let offset = 0;
	while (offset < length) {
		const { bytesRead } = await handle.read(buffer, offset, length - offset, position + offset);
		if (bytesRead <= 0) break;
		offset += bytesRead;
	}
	return offset === length ? buffer : buffer.subarray(0, offset);
}
function parseCompletePiRows(tail) {
	const entries = [];
	let lineStart = 0;
	let classifiedBytes = 0;
	for (let index = 0; index < tail.length; index += 1) {
		if (tail[index] !== 10) continue;
		const line = tail.subarray(lineStart, index).toString("utf8").trim();
		if (line) try {
			const value = JSON.parse(line);
			if (!isRecord(value)) break;
			entries.push(value);
		} catch {
			break;
		}
		classifiedBytes = index + 1;
		lineStart = index + 1;
	}
	return {
		entries,
		classifiedBytes
	};
}
function textFromContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	return content.flatMap((part) => isRecord(part) && part.type === "text" && typeof part.text === "string" ? [part.text] : []).join("\n") || void 0;
}
function readFilePath(probe) {
	return isRecord(probe.upstreamRef) && typeof probe.upstreamRef.filePath === "string" ? probe.upstreamRef.filePath : void 0;
}
function readMarkerOffset(probe) {
	return isRecord(probe.marker) && Number.isSafeInteger(probe.marker.offset) && Number(probe.marker.offset) >= 0 ? Number(probe.marker.offset) : void 0;
}
async function linkContinuedPiSession(sessionKey, threadId) {
	try {
		const baseline = await readPiSessionFileBaseline(threadId, process.env);
		return baseline ? {
			sessionKey,
			upstream: {
				kind: "pi-cli",
				ref: { filePath: baseline.filePath },
				marker: { offset: baseline.offset }
			}
		} : { sessionKey };
	} catch {
		return { sessionKey };
	}
}
async function checkPiSessionUpstreamActivity(probe) {
	if (probe.hostId !== "gateway" || probe.upstreamKind !== "pi-cli") return;
	const filePath = readFilePath(probe);
	const markerOffset = readMarkerOffset(probe);
	if (!filePath || markerOffset === void 0) return;
	let handle;
	try {
		handle = await fs$1.open(filePath, "r");
	} catch (error) {
		return isRecord(error) && error.code === "ENOENT" ? {
			kind: "missing",
			sessionKey: probe.sessionKey
		} : void 0;
	}
	try {
		const stat = await handle.stat();
		if (!stat.isFile()) return {
			kind: "missing",
			sessionKey: probe.sessionKey
		};
		if (stat.size <= markerOffset) return;
		const readLength = Math.min(stat.size - markerOffset, MAX_PI_UPSTREAM_SCAN_BYTES);
		const { entries, classifiedBytes } = parseCompletePiRows(await readFileRange(handle, markerOffset, readLength));
		if (classifiedBytes === 0) return;
		let humanTurns = 0;
		let occurredAt;
		for (const entry of entries) {
			if (entry.type !== "message" || !isRecord(entry.message) || entry.message.role !== "user") continue;
			if (!isExternalUserText(probe, textFromContent(entry.message.content))) continue;
			humanTurns += 1;
			occurredAt = Math.max(occurredAt ?? 0, parsePiSessionTimestampMs(entry.message.timestamp) ?? parsePiSessionTimestampMs(entry.timestamp) ?? stat.mtimeMs);
		}
		const nextOffset = markerOffset + classifiedBytes;
		return {
			kind: "activity",
			sessionKey: probe.sessionKey,
			humanTurns,
			nextMarker: { offset: nextOffset },
			...humanTurns > 0 ? {
				occurredAt: occurredAt ?? stat.mtimeMs,
				dedupeId: String(nextOffset)
			} : {}
		};
	} finally {
		await handle.close();
	}
}
async function checkPiUpstreamActivity(probes) {
	const outcomes = [];
	for (const probe of probes) try {
		const outcome = await checkPiSessionUpstreamActivity(probe);
		if (outcome) outcomes.push(outcome);
	} catch {}
	return outcomes;
}
//#endregion
//#region extensions/acpx/src/pi-session-catalog-runtime.ts
const LOCAL_HOST_ID = "gateway";
const MAX_PAGE_LIMIT = 100;
const MAX_HOSTS = 100;
const NODE_TIMEOUT_MS = 2e4;
const SESSION_ID_PATTERN = /^(?!-)[A-Za-z0-9._:-]{1,256}$/u;
const TRANSCRIPT_ITEM_TYPES = /* @__PURE__ */ new Set([
	"userMessage",
	"agentMessage",
	"reasoning",
	"toolCall",
	"toolResult",
	"other"
]);
const ACPX_BACKEND_ID = "acpx";
const PI_ACP_AGENT_ID = "pi";
const PI_ADOPTED_SESSION_KEY_PREFIX = "plugin:acpx:catalog-adopt:pi:";
var PiCatalogParamsError = class extends Error {};
const continueAdoption = createSessionCatalogAdoptionCoordinator();
function validatePiThreadId(value) {
	if (typeof value !== "string" || !SESSION_ID_PATTERN.test(value)) throw new Error("INVALID_REQUEST: threadId is invalid");
	return value;
}
function isOptionalString(value) {
	return value === void 0 || typeof value === "string";
}
function isOptionalNumber(value) {
	return value === void 0 || typeof value === "number";
}
function isNodeSession(value) {
	return isRecord(value) && typeof value.threadId === "string" && SESSION_ID_PATTERN.test(value.threadId) && typeof value.status === "string" && value.status.length > 0 && typeof value.archived === "boolean" && typeof value.canContinue === "boolean" && typeof value.canArchive === "boolean" && isOptionalString(value.name) && isOptionalString(value.cwd) && isOptionalString(value.source) && isOptionalString(value.modelProvider) && isOptionalString(value.cliVersion) && isOptionalString(value.gitBranch) && isOptionalString(value.sessionKey) && isOptionalNumber(value.createdAt) && isOptionalNumber(value.updatedAt) && isOptionalNumber(value.recencyAt);
}
function isNodeTranscriptItem(value) {
	return isRecord(value) && typeof value.type === "string" && TRANSCRIPT_ITEM_TYPES.has(value.type) && isOptionalString(value.id) && isOptionalString(value.text) && isOptionalString(value.timestamp) && isOptionalString(value.model) && (value.truncated === void 0 || typeof value.truncated === "boolean");
}
function parseNodeParams(paramsJSON) {
	if (!paramsJSON) return;
	try {
		return JSON.parse(paramsJSON);
	} catch (error) {
		throw new Error("Pi session parameters must be valid JSON", { cause: error });
	}
}
function nodeLabel(node) {
	return node.displayName?.trim() || node.remoteIp?.trim() || node.nodeId;
}
function unwrapNodePayload(value) {
	return isRecord(value) && typeof value.payloadJSON === "string" ? JSON.parse(value.payloadJSON) : value;
}
function setCatalogCapabilities(page, capabilities) {
	for (const session of page.sessions) {
		session.canContinue = capabilities.canContinue && session.canContinue;
		session.canOpenTerminal = capabilities.canOpenTerminal;
	}
	return page;
}
function projectPiAdoptedSessions(page, adopted) {
	return {
		...page,
		sessions: page.sessions.map((session) => {
			const sessionKey = adopted.get(sessionCatalogAdoptedSourceKey(LOCAL_HOST_ID, session.threadId));
			return sessionKey ? {
				...session,
				sessionKey
			} : session;
		})
	};
}
async function listPiNodeHost(runtime, query, node) {
	const hostId = `node:${node.nodeId}`;
	const common = {
		hostId,
		label: nodeLabel(node),
		kind: "node",
		connected: node.connected === true,
		nodeId: node.nodeId
	};
	if (node.connected !== true) return {
		...common,
		sessions: [],
		error: {
			code: "NODE_OFFLINE",
			message: "Paired node is offline"
		}
	};
	try {
		const cursor = query.cursors?.[hostId];
		if (cursor !== void 0 && !isExactPiSessionCursor(cursor)) throw new Error("cursor is invalid");
		const page = parseNodeSessionPage(unwrapNodePayload(await runtime.nodes.invoke({
			nodeId: node.nodeId,
			command: PI_SESSIONS_LIST_COMMAND,
			params: {
				...query.limitPerHost ? { limit: query.limitPerHost } : {},
				...query.search ? { searchTerm: query.search } : {},
				...cursor !== void 0 ? { cursor } : {}
			},
			timeoutMs: NODE_TIMEOUT_MS,
			scopes: ["operator.write"]
		})));
		const canOpenTerminal = (node.invocableCommands ?? node.commands)?.includes(PI_TERMINAL_RESUME_COMMAND) === true;
		return {
			...common,
			...setCatalogCapabilities(page, {
				canContinue: false,
				canOpenTerminal
			})
		};
	} catch {
		return {
			...common,
			sessions: [],
			error: {
				code: "NODE_INVOKE_FAILED",
				message: "Paired node Pi sessions are unavailable"
			}
		};
	}
}
function parseNodeSessionPage(value) {
	if (!isRecord(value) || !Array.isArray(value.sessions) || value.sessions.length > MAX_PAGE_LIMIT) throw new Error("Pi node returned an invalid session page");
	if (!value.sessions.every(isNodeSession)) throw new Error("Pi node returned an invalid session page");
	const sessions = value.sessions;
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactPiSessionCursor(nextCursor)) throw new Error("Pi node returned an invalid cursor");
	return {
		sessions,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
function parseNodeTranscriptPage(value, threadId) {
	if (!isRecord(value) || value.threadId !== threadId || !Array.isArray(value.items) || value.items.length > MAX_PAGE_LIMIT || !value.items.every(isNodeTranscriptItem)) throw new Error("Pi node returned an invalid transcript page");
	const nextCursor = value.nextCursor;
	if (nextCursor !== void 0 && !isExactPiSessionCursor(nextCursor)) throw new Error("Pi node returned an invalid cursor");
	return {
		hostId: LOCAL_HOST_ID,
		threadId,
		items: value.items,
		...nextCursor !== void 0 ? { nextCursor } : {}
	};
}
async function listPiHosts(api, query) {
	const runtime = api.runtime;
	const canContinue = resolvePiContinuationAvailability(api).available;
	const adopted = query.sessionEntries ? listAdoptedPiSessions(api, query.sessionEntries) : /* @__PURE__ */ new Map();
	const requested = query.hostIds ? new Set(query.hostIds) : void 0;
	const hosts = [];
	const localStore = !requested || requested.has(LOCAL_HOST_ID) ? piSessionStore(process.env) : void 0;
	if (localStore && (query.allowProcessHomeFallback !== false || !localStore.usesProcessHomeFallback) && piSessionStoreAvailable(process.env, localStore)) try {
		hosts.push({
			hostId: LOCAL_HOST_ID,
			label: "Local Pi",
			kind: "gateway",
			connected: true,
			...await listLocalPiSessionPage({
				limit: query.limitPerHost,
				...query.search ? { searchTerm: query.search } : {},
				cursor: query.cursors?.[LOCAL_HOST_ID]
			}).then((page) => projectPiAdoptedSessions(setCatalogCapabilities(page, {
				canContinue,
				canOpenTerminal: resolveNodeHostExecutable("pi", {
					env: process.env,
					pathEnv: process.env.PATH ?? "",
					strategy: "fallback"
				}) !== void 0
			}), adopted))
		});
	} catch {
		hosts.push({
			hostId: LOCAL_HOST_ID,
			label: "Local Pi",
			kind: "gateway",
			connected: true,
			sessions: [],
			error: {
				code: "LOCAL_READ_FAILED",
				message: "Local Pi sessions are unavailable"
			}
		});
	}
	let nodes;
	try {
		nodes = (await (query.listNodes?.() ?? runtime.nodes.list())).nodes;
	} catch {
		return hosts;
	}
	const eligible = nodes.filter((node) => node.commands?.includes("acpx.pi.sessions.list.v1") && (!requested || requested.has(`node:${node.nodeId}`))).toSorted((left, right) => nodeLabel(left).localeCompare(nodeLabel(right))).slice(0, MAX_HOSTS - hosts.length);
	const nodeHosts = await Promise.all(eligible.map((node) => listPiNodeHost(runtime, query, node)));
	return [...hosts, ...nodeHosts];
}
async function requireLocalPiSession(threadId) {
	const record = (await listLocalPiSessionPage({
		searchTerm: threadId,
		limit: MAX_PAGE_LIMIT
	})).sessions.find((session) => session.threadId === threadId);
	if (!record) throw new Error("Pi session is unavailable");
	return record;
}
function currentPiCatalogConfig(api) {
	return api.runtime.config?.current?.() ?? api.config ?? {};
}
function resolvePiContinuationAvailability(api) {
	const availability = resolveAcpSessionAvailability({
		config: currentPiCatalogConfig(api),
		backendId: ACPX_BACKEND_ID,
		agentId: PI_ACP_AGENT_ID
	});
	if (!availability.available) return availability;
	return resolveNodeHostExecutable("pi", {
		env: process.env,
		pathEnv: process.env.PATH ?? "",
		strategy: "fallback"
	}) ? { available: true } : {
		available: false,
		message: "Pi CLI is unavailable"
	};
}
function listAdoptedPiSessions(api, sessionEntries) {
	return listAdoptedSessionCatalogSessions({
		config: currentPiCatalogConfig(api),
		pluginId: api.id,
		runtime: api.runtime,
		sessionEntries,
		sourceFromEntry: (entry) => {
			const acpx = isRecord(entry.pluginExtensions?.acpx) ? entry.pluginExtensions.acpx : void 0;
			const marker = acpx && isRecord(acpx.piSessionCatalog) ? acpx.piSessionCatalog : void 0;
			return marker && typeof marker.sourceThreadId === "string" ? {
				hostId: LOCAL_HOST_ID,
				threadId: marker.sourceThreadId
			} : void 0;
		}
	});
}
async function continuePiSession(api, hostId, threadId) {
	if (hostId.startsWith("node:")) throw new PiCatalogParamsError("paired-node Pi session rows are view-only");
	if (hostId !== LOCAL_HOST_ID) throw new PiCatalogParamsError("Pi session catalog hostId is invalid");
	const availability = resolvePiContinuationAvailability(api);
	if (!availability.available) throw new PiCatalogParamsError(availability.message);
	const sourceKey = sessionCatalogAdoptedSourceKey(hostId, threadId);
	return await continueAdoption({
		sourceKey,
		findExisting: () => listAdoptedPiSessions(api).get(sourceKey),
		create: async () => {
			const record = await requireLocalPiSession(threadId).catch(() => void 0);
			if (!record) throw new PiCatalogParamsError("Pi session is unavailable");
			if (!record.canContinue) throw new PiCatalogParamsError("Pi session is outside the session store supported by pi-acp");
			const currentAvailability = resolvePiContinuationAvailability(api);
			if (!currentAvailability.available) throw new PiCatalogParamsError(currentAvailability.message);
			const config = currentPiCatalogConfig(api);
			const marker = { sourceThreadId: threadId };
			return { sessionKey: (await api.runtime.agent.session.createSessionEntry({
				cfg: config,
				key: sessionCatalogAdoptedSessionKey(PI_ADOPTED_SESSION_KEY_PREFIX, threadId),
				agentId: resolveDefaultAgentId(config),
				recoverMatchingInitialEntry: true,
				...record.name ? { label: record.name } : {},
				...record.cwd ? { spawnedCwd: record.cwd } : {},
				initialEntry: {
					acpBackendId: ACPX_BACKEND_ID,
					acpSessionBinding: {
						acpAgentId: PI_ACP_AGENT_ID,
						agentSessionId: threadId
					},
					pluginExtensions: { acpx: { piSessionCatalog: marker } }
				},
				afterCreate: async (entry) => {
					await importSessionCatalogHistory({
						catalogId: "pi",
						threadId,
						read: async ({ cursor, limit }) => await readPiTranscript(api.runtime, {
							hostId,
							threadId,
							limit,
							...cursor ? { cursor } : {}
						}),
						sessionId: entry.sessionId,
						sessionKey: entry.key,
						agentId: entry.agentId,
						...record.cwd ? { cwd: record.cwd } : {},
						config
					});
					return { pluginExtensions: { acpx: { piSessionCatalog: marker } } };
				}
			})).key };
		},
		complete: async (continued) => await linkContinuedPiSession(continued.sessionKey, threadId)
	});
}
async function resolveNodePiSession(params) {
	const record = parseNodeSessionPage(unwrapNodePayload(await params.runtime.nodes.invoke({
		nodeId: params.nodeId,
		command: PI_SESSIONS_LIST_COMMAND,
		params: {
			searchTerm: params.threadId,
			limit: MAX_PAGE_LIMIT
		},
		timeoutMs: NODE_TIMEOUT_MS,
		scopes: ["operator.write"]
	}))).sessions.find((session) => session.threadId === params.threadId);
	if (!record) throw new Error("Pi session is unavailable");
	return record;
}
async function openPiTerminal(params) {
	const title = `pi --session ${params.threadId.slice(0, 12)}…`;
	if (params.hostId === LOCAL_HOST_ID) {
		const record = await requireLocalPiSession(params.threadId);
		const resolution = resolveNodeHostExecutable("pi", {
			env: process.env,
			pathEnv: process.env.PATH ?? "",
			strategy: "fallback"
		});
		if (!resolution) throw new Error("Pi CLI is unavailable");
		return {
			kind: "local",
			argv: [
				resolution.executable,
				"--session",
				params.threadId
			],
			...record.cwd ? { cwd: record.cwd } : {},
			...resolution.pathEnv ? { pathEnv: resolution.pathEnv } : {},
			title
		};
	}
	if (!params.hostId.startsWith("node:")) throw new Error("hostId is invalid");
	const nodeId = params.hostId.slice(5);
	if (!(await params.runtime.nodes.list()).nodes.find((candidate) => {
		const commands = candidate.invocableCommands ?? candidate.commands;
		return candidate.nodeId === nodeId && candidate.connected === true && commands?.includes("acpx.pi.sessions.list.v1") === true && commands.includes("acpx.pi.terminal.resume.v1");
	})) throw new Error("paired-node Pi terminal is unavailable");
	const record = await resolveNodePiSession({
		runtime: params.runtime,
		nodeId,
		threadId: params.threadId
	});
	return {
		kind: "node",
		nodeId,
		command: PI_TERMINAL_RESUME_COMMAND,
		paramsJSON: JSON.stringify({ threadId: params.threadId }),
		...record.cwd ? { cwd: record.cwd } : {},
		title
	};
}
async function readPiTranscript(runtime, request) {
	const cursor = request.cursor;
	if (cursor !== void 0 && !isExactPiSessionCursor(cursor)) throw new Error("cursor is invalid");
	if (request.hostId === LOCAL_HOST_ID) {
		assertPiLocalAccess(request.hostId, request.allowProcessHomeFallback);
		return await readLocalPiTranscriptPage({
			threadId: request.threadId,
			...request.limit ? { limit: request.limit } : {},
			...cursor !== void 0 ? { cursor } : {}
		});
	}
	if (!request.hostId.startsWith("node:")) throw new Error("hostId is invalid");
	const nodeId = request.hostId.slice(5);
	const node = (await runtime.nodes.list()).nodes.find((candidate) => candidate.nodeId === nodeId && candidate.connected === true && candidate.commands?.includes("acpx.pi.sessions.read.v1"));
	if (!node) throw new Error("paired-node Pi session host is unavailable");
	return {
		...parseNodeTranscriptPage(unwrapNodePayload(await runtime.nodes.invoke({
			nodeId,
			command: PI_SESSION_READ_COMMAND,
			params: {
				threadId: request.threadId,
				...request.limit ? { limit: request.limit } : {},
				...cursor !== void 0 ? { cursor } : {}
			},
			timeoutMs: NODE_TIMEOUT_MS,
			scopes: ["operator.write"]
		})), request.threadId),
		hostId: request.hostId,
		label: nodeLabel(node)
	};
}
function assertPiLocalAccess(hostId, allowProcessHomeFallback) {
	if (hostId === LOCAL_HOST_ID && allowProcessHomeFallback === false && piSessionStore(process.env).usesProcessHomeFallback) throw new PiCatalogParamsError("local Pi sessions are unavailable in isolated state");
}
async function listPiSessions(paramsJSON) {
	return JSON.stringify(await listLocalPiSessionPage(parseNodeParams(paramsJSON)));
}
async function readPiSession(paramsJSON) {
	return JSON.stringify(await readLocalPiTranscriptPage(parseNodeParams(paramsJSON)));
}
async function resumePiSession(paramsJSON, io) {
	if (!io) throw new Error("Pi terminal command requires duplex transport");
	const params = decodeNodePtyResumeParams(paramsJSON, validatePiThreadId);
	const record = await requireLocalPiSession(params.threadId);
	const resolution = resolveNodeHostExecutable("pi", {
		env: process.env,
		pathEnv: process.env.PATH ?? process.env.Path ?? "",
		strategy: "direct"
	});
	if (!resolution) throw new Error("Pi CLI is unavailable");
	return JSON.stringify(await runNodePtyCommand({
		file: resolution.executable,
		args: ["--session", params.threadId],
		cwd: record.cwd,
		cols: params.cols,
		rows: params.rows
	}, io));
}
function createPiSessionCatalogRuntime(api) {
	return {
		list: async (query) => await listPiHosts(api, query),
		read: async (request) => await readPiTranscript(api.runtime, request),
		continueSession: async (request) => {
			assertPiLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await continuePiSession(api, request.hostId, request.threadId);
		},
		checkUpstreamActivity: (probes, policy) => checkPiUpstreamActivity(probes.filter((probe) => probe.hostId !== LOCAL_HOST_ID || policy?.allowProcessHomeFallback !== false || !piSessionStore(process.env).usesProcessHomeFallback)),
		openTerminal: async (request) => {
			assertPiLocalAccess(request.hostId, request.allowProcessHomeFallback);
			return await openPiTerminal({
				runtime: api.runtime,
				...request
			});
		}
	};
}
//#endregion
export { createPiSessionCatalogRuntime, listPiSessions, readPiSession, resumePiSession };
