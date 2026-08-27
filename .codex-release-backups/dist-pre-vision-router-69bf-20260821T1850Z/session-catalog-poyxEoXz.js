import { y as parseDateStringTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./agent-scope-D9GLFAyB.js";
import { a as listAgentIds, p as resolveDefaultAgentId } from "./agent-scope-config-CsnnOL14.js";
import "./session-upstream-links-i-TvS0qu.js";
import "./input-provenance-BA6fPshG.js";
import { p as withSessionTranscriptWriteLock } from "./session-transcript-runtime-CcyNX9RF.js";
import { d as parseCliReseedPrompt, n as parseClaudeCliHistoryEntry, o as resolveClaudeCliPromptTextCandidates, s as resolveClaudeCliTimestampMs } from "./cli-session-history.claude-DD2NttVO.js";
import { createHash } from "node:crypto";
//#region src/plugins/session-catalog.ts
function normalizeUserText(text) {
	return text.trim().replace(/\s+/g, " ");
}
function isExternalUserText(probe, text) {
	const normalized = text === void 0 ? "" : normalizeUserText(text);
	return !probe.ownRecentUserTexts.includes(normalized);
}
function listSessionCatalogEntries(params) {
	const requestEntries = params.sessionEntries?.entriesForCatalog?.();
	if (requestEntries) return requestEntries;
	const defaultAgentId = resolveDefaultAgentId(params.config);
	return [defaultAgentId, ...listAgentIds(params.config).filter((agentId) => agentId !== defaultAgentId)].flatMap((agentId) => {
		return (params.sessionEntries ? params.sessionEntries.entriesForAgent(agentId) : params.runtime.agent.session.listSessionEntries({
			agentId,
			readOnly: true
		})).map((entry) => Object.assign({}, entry, { agentId }));
	});
}
function sessionCatalogAdoptedSourceKey(hostId, threadId) {
	return `${hostId}\0${threadId}`;
}
function sessionCatalogAdoptedSessionKey(prefix, source) {
	return `${prefix}${createHash("sha256").update(source).digest("hex")}`;
}
function listAdoptedSessionCatalogSessions(params) {
	const adopted = /* @__PURE__ */ new Map();
	for (const { sessionKey, entry } of listSessionCatalogEntries(params)) {
		const source = params.sourceFromEntry(entry);
		if (source && entry.pluginOwnerId === params.pluginId && entry.initializationPending !== true) adopted.set(sessionCatalogAdoptedSourceKey(source.hostId, source.threadId), sessionKey);
	}
	return adopted;
}
function createSessionCatalogAdoptionCoordinator() {
	const operations = /* @__PURE__ */ new Map();
	return async (params) => {
		const pending = operations.get(params.sourceKey);
		if (pending) return await pending;
		const operation = (async () => {
			const existing = params.findExisting();
			if (existing) return await params.complete({ sessionKey: existing });
			const continued = await params.create().catch((error) => {
				const raced = params.findExisting();
				if (raced) return { sessionKey: raced };
				throw error;
			});
			return await params.complete(continued);
		})();
		operations.set(params.sourceKey, operation);
		try {
			return await operation;
		} finally {
			if (operations.get(params.sourceKey) === operation) operations.delete(params.sourceKey);
		}
	};
}
//#endregion
//#region src/plugins/session-catalog-history-import.ts
const SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS = 200;
const SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT = 100;
function importedSessionCatalogMessage(params) {
	const timestamp = parseDateStringTimestampMs(params.item.timestamp) ?? params.fallbackTimestamp;
	const importedText = params.item.text?.trim();
	if (!importedText && params.item.type === "reasoning") return;
	const text = importedText || "[Unsupported catalog transcript item]";
	if (params.item.type === "userMessage") return {
		role: "user",
		content: text,
		timestamp,
		__openclaw: { mirrorOrigin: `${params.catalogId}-catalog-import` }
	};
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: `${params.item.type === "reasoning" ? "Thinking\n\n" : params.item.type === "toolCall" ? "Tool call\n\n" : params.item.type === "toolResult" ? "Tool result\n\n" : params.item.type === "other" ? "Other\n\n" : ""}${text}`
		}],
		timestamp,
		api: "openai-responses",
		provider: params.catalogId,
		model: params.item.model ?? "native-history",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		stopReason: "stop"
	};
}
function fitSessionCatalogItemToBytes(item, maxBytes) {
	if (Buffer.byteLength(JSON.stringify(item), "utf8") <= maxBytes) return item;
	const text = item.text;
	if (typeof text !== "string") return;
	const candidate = (length) => {
		const safeLength = length > 0 && /[\uD800-\uDBFF]/u.test(text.charAt(length - 1)) ? length - 1 : length;
		return {
			...item,
			text: `${text.slice(0, safeLength)}…`,
			truncated: true
		};
	};
	let low = 0;
	let high = text.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (Buffer.byteLength(JSON.stringify(candidate(middle)), "utf8") <= maxBytes) low = middle;
		else high = middle - 1;
	}
	const bounded = candidate(low);
	return Buffer.byteLength(JSON.stringify(bounded), "utf8") <= maxBytes ? bounded : void 0;
}
function importableSessionCatalogItem(item) {
	const { raw: _raw, ...importable } = item;
	return importable;
}
async function readBoundedSessionCatalogHistory(params) {
	const pages = [];
	let cursor;
	let itemCount = 0;
	let bytes = 0;
	while (itemCount < SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS) {
		const page = await params.read({
			limit: Math.min(SESSION_CATALOG_HISTORY_IMPORT_PAGE_LIMIT, SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS - itemCount),
			...cursor ? { cursor } : {}
		});
		const retained = [];
		for (let index = page.items.length - 1; index >= 0; index -= 1) {
			const item = page.items[index];
			if (!item) continue;
			const importableItem = importableSessionCatalogItem(item);
			const itemBytes = Buffer.byteLength(JSON.stringify(importableItem), "utf8");
			const remainingBytes = SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES - bytes;
			if (itemCount > 0 && itemBytes > remainingBytes) return [retained, ...pages.toReversed()].flat();
			const retainedItem = itemBytes <= remainingBytes ? importableItem : fitSessionCatalogItemToBytes(importableItem, remainingBytes);
			if (!retainedItem) continue;
			const retainedItemBytes = Buffer.byteLength(JSON.stringify(retainedItem), "utf8");
			retained.unshift(retainedItem);
			itemCount += 1;
			bytes += retainedItemBytes;
			if (itemCount === SESSION_CATALOG_HISTORY_IMPORT_MAX_ITEMS || bytes === SESSION_CATALOG_HISTORY_IMPORT_MAX_BYTES) return [retained, ...pages.toReversed()].flat();
		}
		pages.push(retained);
		if (!page.nextCursor || page.nextCursor === cursor) break;
		cursor = page.nextCursor;
	}
	return pages.toReversed().flat();
}
async function importSessionCatalogHistory(params) {
	const items = await readBoundedSessionCatalogHistory({ read: params.read });
	const fallbackTimestamp = Date.now();
	await withSessionTranscriptWriteLock(params, async (transcript) => {
		for (const [index, item] of items.entries()) {
			const imported = importedSessionCatalogMessage({
				catalogId: params.catalogId,
				item,
				fallbackTimestamp: fallbackTimestamp + index
			});
			if (!imported) continue;
			const message = {
				...imported,
				idempotencyKey: `${params.catalogId}-catalog:${params.threadId}:${item.id ?? index}`
			};
			await transcript.appendMessage({
				message,
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
		}
	});
}
//#endregion
//#region src/gateway/cli-session-history.claude-activity.ts
function classifyClaudeCliHistoryEntry(params) {
	const entry = params.entry;
	const content = entry.message?.content;
	if (entry.type !== "user" || entry.message?.role !== "user") return { humanTurn: false };
	if (typeof content !== "string" && !Array.isArray(content)) return { humanTurn: false };
	const candidates = resolveClaudeCliPromptTextCandidates(entry, content);
	if (candidates.length === 0 || candidates.some(({ text }) => text.startsWith("[Inter-session message]") || parseCliReseedPrompt(text).kind !== "none")) return { humanTurn: false };
	if (parseClaudeCliHistoryEntry(entry, params.cliSessionId, params.sourceLineNumber, /* @__PURE__ */ new Map(), { reseedMode: "preserve" })?.role !== "user") return { humanTurn: false };
	const occurredAt = resolveClaudeCliTimestampMs(entry.timestamp);
	return {
		humanTurn: true,
		userText: candidates[0]?.text,
		...occurredAt === void 0 ? {} : { occurredAt }
	};
}
/** Classifies one native JSONL row through the same filters used by history import. */
function classifyClaudeCliHistoryLine(params) {
	let entry;
	try {
		entry = JSON.parse(params.line);
	} catch {
		return { humanTurn: false };
	}
	return classifyClaudeCliHistoryEntry({
		...params,
		entry
	});
}
/** Applies native history filters to an already-decoded catalog user message. */
function classifyClaudeCliHistoryMessage(params) {
	return classifyClaudeCliHistoryEntry({
		cliSessionId: params.cliSessionId,
		sourceLineNumber: params.sourceLineNumber,
		entry: {
			type: "user",
			timestamp: params.timestamp,
			message: {
				role: "user",
				content: params.content
			}
		}
	});
}
//#endregion
export { isExternalUserText as a, normalizeUserText as c, createSessionCatalogAdoptionCoordinator as i, sessionCatalogAdoptedSessionKey as l, classifyClaudeCliHistoryMessage as n, listAdoptedSessionCatalogSessions as o, importSessionCatalogHistory as r, listSessionCatalogEntries as s, classifyClaudeCliHistoryLine as t, sessionCatalogAdoptedSourceKey as u };
