import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as parseSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import "./session-store-runtime-De3jWY_Z.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { c as readSessionTranscriptRawDelta } from "./session-transcript-runtime-CcyNX9RF.js";
import { A as DEFAULT_TRANSCRIPT_READ_MAX_BYTES, N as LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW, f as DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, j as DEFAULT_TRANSCRIPT_READ_MAX_LINES, x as DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS } from "./types-CyvGmPEE.js";
import { n as clampInt } from "./config-wonC1AOs.js";
import { i as extractTextContent } from "./query-Bb48lyih.js";
import { a as readExplicitMemoryEvidence, c as readStructuredMemoryFailureFromContent, o as readStructuredMemoryEvidenceFromContent, s as readStructuredMemoryFailure } from "./prompt-CpfqKPdB.js";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import * as readline$1 from "node:readline";
//#region extensions/active-memory/transcript.ts
function isUnavailableMemorySearchDebug(debug) {
	return Boolean(debug?.error);
}
function resolveTranscriptReadLimits(limits) {
	return {
		maxChars: clampInt(limits?.maxChars, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS, 1, DEFAULT_PARTIAL_TRANSCRIPT_MAX_CHARS),
		maxLines: clampInt(limits?.maxLines, DEFAULT_TRANSCRIPT_READ_MAX_LINES, 1, DEFAULT_TRANSCRIPT_READ_MAX_LINES),
		maxBytes: clampInt(limits?.maxBytes, DEFAULT_TRANSCRIPT_READ_MAX_BYTES, 1, DEFAULT_TRANSCRIPT_READ_MAX_BYTES)
	};
}
async function streamBoundedTranscriptJsonl(params) {
	const limits = resolveTranscriptReadLimits(params.limits);
	try {
		const stats = await fs$1.stat(params.sessionFile);
		if (!stats.isFile() || stats.size > limits.maxBytes) return;
	} catch {
		return;
	}
	const stream = fs.createReadStream(params.sessionFile, { encoding: "utf8" });
	const rl = readline$1.createInterface({
		input: stream,
		crlfDelay: Infinity
	});
	let seenLines = 0;
	try {
		for await (const line of rl) {
			seenLines += 1;
			if (seenLines > limits.maxLines) break;
			const trimmed = line.trim();
			if (!trimmed) continue;
			try {
				if (params.onRecord(JSON.parse(trimmed))) break;
			} catch {}
		}
	} catch {} finally {
		rl.close();
		stream.destroy();
	}
}
function fileTranscriptSource(sessionFile) {
	return {
		kind: "file",
		sessionFile
	};
}
function transcriptSourceFromReturnedSessionFile(params) {
	const marker = parseSqliteSessionFileMarker(normalizeOptionalString(params.sessionFile));
	if (!marker) return fileTranscriptSource(params.sessionFile);
	return {
		kind: "runtime",
		target: {
			agentId: marker.agentId,
			sessionId: marker.sessionId,
			sessionKey: params.sessionKey,
			storePath: marker.storePath
		}
	};
}
async function streamRuntimeTranscriptEvents(params) {
	const limits = resolveTranscriptReadLimits(params.limits);
	let page;
	try {
		page = await readSessionTranscriptRawDelta({
			...params.target,
			maxBytes: limits.maxBytes,
			maxEvents: limits.maxLines
		});
	} catch {
		return;
	}
	if (page.kind !== "page") return;
	for (const { event } of page.events) try {
		if (params.onRecord(event)) break;
	} catch {}
}
async function streamActiveMemoryTranscriptRecords(params) {
	if (params.source.kind === "runtime") {
		await streamRuntimeTranscriptEvents({
			target: params.source.target,
			limits: params.limits,
			onRecord: params.onRecord
		});
		return;
	}
	await streamBoundedTranscriptJsonl({
		sessionFile: params.source.sessionFile,
		limits: params.limits,
		onRecord: params.onRecord
	});
}
function resolveToolResultMessage(value) {
	const record = asOptionalRecord(value);
	const message = asOptionalRecord(record?.message) ?? (record?.role === "toolResult" ? record : void 0);
	return message && normalizeOptionalString(message.role) === "toolResult" ? message : void 0;
}
function extractActiveMemorySearchDebugFromSessionRecord(value) {
	const message = resolveToolResultMessage(value);
	if (!message) return;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (toolName !== "memory_search" && toolName !== "memory_recall") return;
	const details = asOptionalRecord(message.details);
	const debug = asOptionalRecord(details?.debug);
	const warning = normalizeOptionalString(details?.warning);
	const action = normalizeOptionalString(details?.action);
	const error = normalizeOptionalString(details?.error);
	if (!debug && !warning && !action && !error) return;
	return {
		backend: normalizeOptionalString(debug?.backend),
		configuredMode: normalizeOptionalString(debug?.configuredMode),
		effectiveMode: normalizeOptionalString(debug?.effectiveMode),
		fallback: normalizeOptionalString(debug?.fallback),
		searchMs: typeof debug?.searchMs === "number" && Number.isFinite(debug.searchMs) ? debug.searchMs : void 0,
		hits: typeof debug?.hits === "number" && Number.isFinite(debug.hits) ? debug.hits : void 0,
		warning,
		action,
		error
	};
}
function extractToolResultNameFromSessionRecord(value) {
	const message = resolveToolResultMessage(value);
	if (!message) return;
	return normalizeLowercaseStringOrEmpty(message.toolName) || void 0;
}
function hasUnavailableMemoryResultInSessionRecord(value, toolsAllow = [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, ...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	const details = asOptionalRecord(message.details);
	if (message.isError === true || readStructuredMemoryFailure(details) === true) return true;
	return readStructuredMemoryFailureFromContent(message.content) === true;
}
function hasTerminalUnavailableMemoryResultInSessionRecord(value, toolsAllow) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	const details = asOptionalRecord(message.details);
	if (details?.disabled === true || details?.unavailable === true) return true;
	const status = normalizeOptionalString(details?.status)?.toLowerCase().replace(/[\s-]+/g, "_");
	if (status === "disabled" || status === "unavailable") return true;
	if (toolName !== "memory_search" && toolName !== "memory_recall") return false;
	const debug = extractActiveMemorySearchDebugFromSessionRecord(value);
	return Boolean(debug?.error) || Boolean(details?.error);
}
function createActiveMemoryHookDeadline() {
	const timeoutSentinel = Symbol("active-memory-hook-timeout");
	let timeoutId;
	let resolveTimeout = () => {};
	const promise = new Promise((resolve) => {
		resolveTimeout = resolve;
	});
	const stop = () => {
		if (timeoutId) {
			clearTimeout(timeoutId);
			timeoutId = void 0;
		}
	};
	const arm = (timeoutMs, onTimeout) => {
		stop();
		timeoutId = setTimeout(() => {
			onTimeout();
			resolveTimeout(timeoutSentinel);
		}, timeoutMs);
		timeoutId.unref?.();
	};
	return {
		arm,
		promise,
		stop
	};
}
function hasUsableMemoryResultInSessionRecord(value, toolsAllow = [...DEFAULT_ACTIVE_MEMORY_TOOLS_ALLOW, ...LANCEDB_ACTIVE_MEMORY_TOOLS_ALLOW]) {
	const message = resolveToolResultMessage(value);
	if (!message) return false;
	const toolName = normalizeLowercaseStringOrEmpty(message.toolName);
	if (!toolName || !toolsAllow.includes(toolName)) return false;
	if (hasUnavailableMemoryResultInSessionRecord(value, toolsAllow)) return false;
	const details = asOptionalRecord(message.details);
	const content = extractTextContent(message.content);
	if (toolName === "memory_search") {
		if (Array.isArray(details?.results)) return details.results.length > 0;
		return /"results"\s*:\s*\[\s*([^\s\]])/.test(content);
	}
	if (toolName === "memory_recall") {
		if (Array.isArray(details?.memories)) return details.memories.length > 0;
		return /^Found [1-9]\d* memories:/.test(content);
	}
	if (toolName === "memory_get") {
		const text = normalizeOptionalString(details?.text);
		return text !== void 0 ? text.length > 0 : /"text"\s*:\s*"(?!")/.test(content);
	}
	if (toolName === "lcm_grep") {
		if (typeof details?.totalMatches === "number" && Number.isFinite(details.totalMatches) && details.totalMatches > 0) return true;
		return /^## LCM Grep Results[\s\S]*^\*\*Total matches:\*\*\s+[1-9]\d*$/m.test(content);
	}
	if (toolName === "lcm_describe") {
		const type = normalizeOptionalString(details?.type);
		if (normalizeOptionalString(details?.id) && (type === "summary" || type === "file")) return true;
		return /^LCM_SUMMARY \S+/m.test(content) || /^## LCM File: \S+/m.test(content);
	}
	if (toolName === "lcm_expand_query") {
		if (typeof details?.expandedSummaryCount === "number" && Number.isFinite(details.expandedSummaryCount) && details.expandedSummaryCount > 0 && Boolean(normalizeOptionalString(details?.answer))) return true;
		try {
			const parsed = asOptionalRecord(JSON.parse(content));
			return typeof parsed?.expandedSummaryCount === "number" && Number.isFinite(parsed.expandedSummaryCount) && parsed.expandedSummaryCount > 0 && Boolean(normalizeOptionalString(parsed?.answer));
		} catch {
			return false;
		}
	}
	const normalizedContent = normalizeOptionalString(content);
	const explicitEvidence = details ? readExplicitMemoryEvidence(details) : void 0;
	const structuredEvidence = normalizedContent ? readStructuredMemoryEvidenceFromContent(message.content) : void 0;
	return Boolean(normalizedContent) && explicitEvidence !== false && structuredEvidence !== false;
}
//#endregion
export { hasTerminalUnavailableMemoryResultInSessionRecord as a, isUnavailableMemorySearchDebug as c, transcriptSourceFromReturnedSessionFile as d, fileTranscriptSource as i, resolveTranscriptReadLimits as l, extractActiveMemorySearchDebugFromSessionRecord as n, hasUnavailableMemoryResultInSessionRecord as o, extractToolResultNameFromSessionRecord as r, hasUsableMemoryResultInSessionRecord as s, createActiveMemoryHookDeadline as t, streamActiveMemoryTranscriptRecords as u };
