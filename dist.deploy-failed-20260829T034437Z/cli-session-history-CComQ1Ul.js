import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { dt as stripInboundMetadata } from "./openclaw-state-db-CeAO_dqo.js";
import { s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { _t as normalizeCliSessionReseedReceipt, ht as getCliSessionBinding } from "./session-accessor-B-FKZX9M.js";
import { a as stripInlineDirectiveTagsForDisplay } from "./directive-tags-DqL78ij5.js";
import "./model-selection-DHDS-v4K.js";
import { a as parseClaudeCliHistoryEntry, c as redactClaudeCliHistoryMessage, d as resolveClaudeCliSessionFilePath, i as decodeClaudeCliProjectEntry, n as appendCoalescedClaudeCliToolMessage, r as createClaudeReseedImportState, s as readClaudeCliSessionMessages, t as CLAUDE_CLI_PROVIDER } from "./cli-session-history.claude--plzwyp1.js";
import fs from "node:fs";
import { Worker } from "node:worker_threads";
import { setImmediate } from "node:timers/promises";
import readline from "node:readline";
//#region src/gateway/cli-session-history.claude-snapshot.ts
const YIELD_BYTES = 256 * 1024;
const OFFTHREAD_JSONL_LINE_CHARS = 1024 * 1024;
const OVERSIZED_HISTORY_PLACEHOLDER = "[Claude CLI history record omitted from context because it exceeded 1 MiB.]";
const OVERSIZED_ENTRY_WORKER_SOURCE = `
  const { parentPort, workerData } = require("node:worker_threads");
  const boundedString = (value, max) =>
    typeof value === "string" && value.length <= max ? value : undefined;
  try {
    const entry = JSON.parse(workerData);
    const type = entry?.type;
    const message = entry?.message;
    if ((type !== "user" && type !== "assistant") || !message || message.role !== type) {
      parentPort.postMessage(null);
    } else {
      const rawUsage = message.usage;
      const usage = rawUsage && typeof rawUsage === "object"
        ? Object.fromEntries(
            ["input_tokens", "output_tokens", "cache_read_input_tokens", "cache_creation_input_tokens"]
              .flatMap((key) => Number.isFinite(rawUsage[key]) ? [[key, rawUsage[key]]] : []),
          )
        : undefined;
      parentPort.postMessage({
        type,
        timestamp: boundedString(entry.timestamp, 128),
        uuid: boundedString(entry.uuid, 1_024),
        isSidechain: entry.isSidechain === true,
        isMeta: entry.isMeta === true,
        isCompactSummary: entry.isCompactSummary === true,
        isVisibleInTranscriptOnly: entry.isVisibleInTranscriptOnly === true,
        message: {
          role: type,
          content: ${JSON.stringify(OVERSIZED_HISTORY_PLACEHOLDER)},
          model: boundedString(message.model, 256),
          stop_reason: boundedString(message.stop_reason, 128),
          usage,
        },
      });
    }
  } catch {
    parentPort.postMessage(null);
  }
`;
let snapshotCache;
function normalizeOversizedEntry(value) {
	if (!isRecord(value) || value.type !== "user" && value.type !== "assistant") return null;
	const message = value.message;
	if (!isRecord(message) || message.role !== value.type) return null;
	const usage = isRecord(message.usage) ? message.usage : void 0;
	return {
		type: value.type,
		...typeof value.timestamp === "string" ? { timestamp: value.timestamp } : {},
		...typeof value.uuid === "string" ? { uuid: value.uuid } : {},
		...value.isSidechain === true ? { isSidechain: true } : {},
		...value.isMeta === true ? { isMeta: true } : {},
		...value.isCompactSummary === true ? { isCompactSummary: true } : {},
		...value.isVisibleInTranscriptOnly === true ? { isVisibleInTranscriptOnly: true } : {},
		message: {
			role: value.type,
			content: OVERSIZED_HISTORY_PLACEHOLDER,
			...typeof message.model === "string" ? { model: message.model } : {},
			...typeof message.stop_reason === "string" ? { stop_reason: message.stop_reason } : {},
			...usage ? { usage: {
				input_tokens: usage.input_tokens,
				output_tokens: usage.output_tokens,
				cache_read_input_tokens: usage.cache_read_input_tokens,
				cache_creation_input_tokens: usage.cache_creation_input_tokens
			} } : {}
		}
	};
}
async function decodeOversizedClaudeEntry(line) {
	let worker;
	try {
		worker = new Worker(OVERSIZED_ENTRY_WORKER_SOURCE, {
			eval: true,
			workerData: line
		});
	} catch {
		return null;
	}
	return await new Promise((resolve) => {
		let settled = false;
		const finish = (value) => {
			if (settled) return;
			settled = true;
			resolve(normalizeOversizedEntry(value));
		};
		worker.once("message", finish);
		worker.once("error", () => finish(null));
		worker.once("exit", () => finish(null));
	});
}
function fingerprint(stats) {
	return [
		stats.dev,
		stats.ino,
		stats.size,
		stats.mtimeMs,
		stats.ctimeMs
	].join(":");
}
async function resolveSource(params) {
	const candidate = resolveClaudeCliSessionFilePath(params);
	if (!candidate) return;
	try {
		const filePath = await fs.promises.realpath(candidate);
		const sourceFingerprint = fingerprint(await fs.promises.stat(filePath));
		return [filePath, JSON.stringify([
			filePath,
			sourceFingerprint,
			params.cliSessionId,
			params.localSessionId?.trim() || null,
			normalizeCliSessionReseedReceipt(params.reseedReceipt)
		])];
	} catch {
		return;
	}
}
async function parseSnapshot(filePath, params) {
	const messages = [];
	const toolNames = /* @__PURE__ */ new Map();
	const lines = readline.createInterface({
		input: fs.createReadStream(filePath, { encoding: "utf8" }),
		crlfDelay: Number.POSITIVE_INFINITY
	});
	const reseedState = createClaudeReseedImportState(params);
	let bytesSinceYield = 0;
	let lineNumber = 0;
	for await (const line of lines) {
		lineNumber += 1;
		const oversized = line.length > OFFTHREAD_JSONL_LINE_CHARS;
		if (oversized) bytesSinceYield = 0;
		else {
			bytesSinceYield += Buffer.byteLength(line, "utf8") + 1;
			if (bytesSinceYield >= YIELD_BYTES) {
				bytesSinceYield = 0;
				await setImmediate();
			}
			if (!line.trim()) continue;
		}
		try {
			const entry = oversized ? await decodeOversizedClaudeEntry(line) : decodeClaudeCliProjectEntry(line);
			if (!entry) continue;
			const message = parseClaudeCliHistoryEntry(entry, params.cliSessionId, lineNumber, toolNames, {
				reseedMode: "recover",
				reseedState
			});
			if (message) appendCoalescedClaudeCliToolMessage(messages, message);
		} catch {}
	}
	const redacted = [];
	for (const [index, message] of messages.entries()) {
		if (index % 32 === 0) await setImmediate();
		redacted.push(redactClaudeCliHistoryMessage(message));
	}
	return Object.freeze(redacted);
}
async function readClaudeCliSessionMessagesAsync(params) {
	const source = await resolveSource(params);
	if (!source) return [];
	const [filePath, cacheKey] = source;
	if (snapshotCache?.key !== cacheKey) snapshotCache = {
		key: cacheKey,
		pending: parseSnapshot(filePath, params)
	};
	const pending = snapshotCache.pending;
	let snapshot;
	try {
		snapshot = await pending;
	} catch {
		if (snapshotCache?.pending === pending) snapshotCache = void 0;
		return [];
	}
	const messages = [];
	for (const [index, message] of snapshot.entries()) {
		if (index % 32 === 0) await setImmediate();
		messages.push(structuredClone(message));
	}
	return messages;
}
//#endregion
//#region src/gateway/cli-session-history.merge.ts
const DEDUPE_TIMESTAMP_WINDOW_MS = 300 * 1e3;
function extractComparableText(message, role) {
	if (!message || typeof message !== "object") return;
	const record = message;
	const parts = [];
	const text = readStringValue(record.text);
	if (text !== void 0) parts.push(text);
	const rawContent = record.content;
	const content = readStringValue(rawContent);
	if (content !== void 0) parts.push(content);
	else if (Array.isArray(rawContent)) {
		for (const block of rawContent) if (block && typeof block === "object" && "text" in block) {
			const blockText = readStringValue(block.text);
			if (blockText !== void 0) parts.push(blockText);
		}
	}
	if (parts.length === 0) return;
	const joined = parts.join("\n").trim();
	if (!joined) return;
	return stripInlineDirectiveTagsForDisplay(role === "user" ? stripInboundMetadata(joined) : joined).text.replace(/\s+/g, " ").trim() || void 0;
}
function prepareComparableMessage(message, order) {
	if (!message || typeof message !== "object") return {
		message,
		order
	};
	const record = message;
	const role = readStringValue(record.role);
	return {
		message,
		order,
		externalIdentityKey: resolveImportedExternalIdentityKey(message),
		role,
		text: extractComparableText(message, role),
		timestamp: asFiniteNumber(record.timestamp)
	};
}
function resolveImportedExternalIdentityKey(message) {
	if (!message || typeof message !== "object") return;
	const rawMeta = message["__openclaw"];
	if (!rawMeta || typeof rawMeta !== "object") return;
	const externalId = normalizeOptionalString(rawMeta.externalId);
	return externalId ? JSON.stringify([
		externalId,
		normalizeOptionalString(rawMeta.importedFrom),
		normalizeOptionalString(rawMeta.cliSessionId)
	]) : void 0;
}
function addRoleTextCandidate(index, entry) {
	if (!entry.role || !entry.text) return;
	let byText = index.get(entry.role);
	if (!byText) {
		byText = /* @__PURE__ */ new Map();
		index.set(entry.role, byText);
	}
	let summary = byText.get(entry.text);
	if (!summary) {
		summary = {
			hasMissingTimestamp: false,
			buckets: /* @__PURE__ */ new Map()
		};
		byText.set(entry.text, summary);
	}
	if (entry.timestamp === void 0) {
		summary.hasMissingTimestamp = true;
		return;
	}
	const bucketKey = Math.floor(entry.timestamp / DEDUPE_TIMESTAMP_WINDOW_MS);
	const bucket = summary.buckets.get(bucketKey);
	if (bucket) {
		bucket.min = Math.min(bucket.min, entry.timestamp);
		bucket.max = Math.max(bucket.max, entry.timestamp);
	} else summary.buckets.set(bucketKey, {
		min: entry.timestamp,
		max: entry.timestamp
	});
}
function hasRoleTextCandidate(index, entry) {
	if (!entry.role || !entry.text) return false;
	const summary = index.get(entry.role)?.get(entry.text);
	if (!summary) return false;
	if (entry.timestamp === void 0 || summary.hasMissingTimestamp) return true;
	const bucketKey = Math.floor(entry.timestamp / DEDUPE_TIMESTAMP_WINDOW_MS);
	if (summary.buckets.has(bucketKey)) return true;
	const previous = summary.buckets.get(bucketKey - 1);
	if (previous && previous.max >= entry.timestamp - DEDUPE_TIMESTAMP_WINDOW_MS) return true;
	const next = summary.buckets.get(bucketKey + 1);
	return next !== void 0 && next.min <= entry.timestamp + DEDUPE_TIMESTAMP_WINDOW_MS;
}
function compareHistoryMessages(a, b) {
	if (a.timestamp !== void 0 && b.timestamp !== void 0 && a.timestamp !== b.timestamp) return a.timestamp - b.timestamp;
	return a.order - b.order;
}
/** Merges imported CLI transcript messages into local history without duplicating overlaps. */
function mergeImportedChatHistoryMessages(params) {
	if (params.importedMessages.length === 0) return params.localMessages;
	const merged = params.localMessages.map(prepareComparableMessage);
	const exactExternalIdentityIndex = /* @__PURE__ */ new Set();
	const allMessageRoleTextIndex = /* @__PURE__ */ new Map();
	const identitylessRoleTextIndex = /* @__PURE__ */ new Map();
	const indexEntry = (entry) => {
		if (entry.externalIdentityKey) exactExternalIdentityIndex.add(entry.externalIdentityKey);
		else addRoleTextCandidate(identitylessRoleTextIndex, entry);
		addRoleTextCandidate(allMessageRoleTextIndex, entry);
	};
	for (const entry of merged) indexEntry(entry);
	let nextOrder = merged.length;
	for (const message of params.importedMessages) {
		const imported = prepareComparableMessage(message, nextOrder);
		if (imported.externalIdentityKey ? exactExternalIdentityIndex.has(imported.externalIdentityKey) || hasRoleTextCandidate(identitylessRoleTextIndex, imported) : hasRoleTextCandidate(allMessageRoleTextIndex, imported)) continue;
		merged.push(imported);
		indexEntry(imported);
		nextOrder += 1;
	}
	merged.sort(compareHistoryMessages);
	return merged.map((entry) => entry.message);
}
//#endregion
//#region src/gateway/cli-session-history.ts
const ANTHROPIC_PROVIDER = "anthropic";
function resolveEligibleCliSessionBinding(params) {
	const binding = getCliSessionBinding(params.entry, CLAUDE_CLI_PROVIDER);
	const provider = normalizeProviderId(params.provider ?? "");
	const eligible = !provider || params.localMessages.length === 0 || provider === "claude-cli" || provider === ANTHROPIC_PROVIDER;
	return binding?.sessionId && eligible ? binding : void 0;
}
/** Resolves chat history plus whether a bound external transcript was actually incorporated. */
function resolveChatHistoryWithCliSessionImports(params) {
	const binding = resolveEligibleCliSessionBinding(params);
	if (!binding) return {
		messages: params.localMessages,
		imported: false
	};
	const importedMessages = params.preparedImportedMessages ?? readClaudeCliSessionMessages({
		cliSessionId: binding.sessionId,
		homeDir: params.homeDir,
		localSessionId: params.entry?.sessionId,
		reseedReceipt: binding.reseedReceipt
	});
	if (importedMessages.length === 0) return {
		messages: params.localMessages,
		imported: false
	};
	const messages = mergeImportedChatHistoryMessages({
		localMessages: params.localMessages,
		importedMessages
	});
	return messages.length > params.localMessages.length ? {
		messages,
		imported: true
	} : {
		messages: params.localMessages,
		imported: false
	};
}
/** Acquires one request-local redacted view of the process-owned external snapshot. */
async function readChatHistoryCliSessionImportSnapshot(params) {
	const binding = resolveEligibleCliSessionBinding(params);
	return binding?.sessionId ? await readClaudeCliSessionMessagesAsync({
		cliSessionId: binding.sessionId,
		homeDir: params.homeDir,
		localSessionId: params.entry?.sessionId,
		reseedReceipt: binding.reseedReceipt
	}) : [];
}
//#endregion
export { resolveChatHistoryWithCliSessionImports as n, readChatHistoryCliSessionImportSnapshot as t };
