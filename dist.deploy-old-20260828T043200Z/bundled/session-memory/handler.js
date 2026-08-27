import { l as normalizeOptionalString } from "../../string-coerce-CIXf7egm.js";
import { n as isVitestRuntimeEnv } from "../../test-runtime-env-DQDRzsLt.js";
import "../../env-ChWDbSFK.js";
import { r as root } from "../../fs-safe-CmrQUApq.js";
import { m as shortenHomePath } from "../../utils-Bw16L5tB.js";
import { w as resolveStateDir } from "../../paths-BBSTUjD5.js";
import { l as resolveAgentIdByWorkspacePath } from "../../agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir } from "../../agent-scope-config-CUBiGmG3.js";
import { c as parseAgentSessionKey } from "../../session-key-utils-Di3FvABa.js";
import { b as toAgentStoreSessionKey } from "../../session-key-Dbce_H9p.js";
import { o as resolveSessionStorePathCore } from "../../paths-DVAvlIOc.js";
import { t as createSubsystemLogger } from "../../subsystem-a4KzJVZG.js";
import { v as runWithGatewayIndependentRootWorkContinuation } from "../../gateway-work-admission-CTDt7IQ1.js";
import { v as selectVisibleTranscriptEvents } from "../../session-transcript-index-DtVCy6vi.js";
import { l as readSessionTranscriptBoundedMessageTailPage } from "../../session-accessor-B-FKZX9M.js";
import { R as isOpenClawDeliveryMirrorAssistantMessage, b as loadTranscriptEvents } from "../../session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { h as formatHookErrorForLog } from "../../hook-runner-global-CWpWIBkz.js";
import { r as sanitizeModelSpecialTokens } from "../../external-content-IQUFD6xt.js";
import { a as hasInterSessionUserProvenance } from "../../input-provenance-CCQsDhUy.js";
import { i as resolveUserTimezone } from "../../date-time-Ch20W-k8.js";
import { p as createMemoryWriteProvenanceObserver } from "../../agent-tools.read-B0kEbcx5.js";
import { t as generateSlugViaLLM } from "../../llm-slug-generator-BAe-9-xI.js";
import { r as isSessionAutoResetReason } from "../../session-auto-reset-Cb1X1lJp.js";
import { t as classifySessionMessageOrigin } from "../../session-provenance-HdsJkZBJ.js";
import { i as resolveHookConfig } from "../../config-lcKXe5Oi.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/hooks/bundled/session-memory/transcript.ts
const SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX = String.raw`(?:(?:\|DSML\|)|(?:\uFF5CDSML\uFF5C))?`;
const SESSION_MEMORY_TOOL_DIRECTIVE_KIND = String.raw`(?:tool_calls?|function_calls?|tool_use_error)`;
const SESSION_MEMORY_DROP_BLOCK_RE = new RegExp(String.raw`<${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}\b[^>]*>` + String.raw`[\s\S]*?(?:<\/${SESSION_MEMORY_TOOL_DIRECTIVE_PREFIX}${SESSION_MEMORY_TOOL_DIRECTIVE_KIND}>|$)`, "gi");
const SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE = /<(system|assistant|user)\b[^>]*>[\s\S]*?<\/\1>/gi;
const SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE = /<\/?(?:system|assistant|user)\b[^>]*>/gi;
const SESSION_MEMORY_TRAILING_NO_REPLY_RE = /(?:^|\n)\s*NO_REPLY\s*$/i;
const SESSION_MEMORY_JSON_LINE_SEPARATOR_RE = /[\u0085\u2028\u2029]/gu;
function quoteSessionMemoryText(text) {
	return JSON.stringify(text).replace(SESSION_MEMORY_JSON_LINE_SEPARATOR_RE, (separator) => `\\u${separator.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function isNoReplyMarker(text) {
	const trimmed = text.trim();
	return /^NO_REPLY$/i.test(trimmed) || /^\{\s*"action"\s*:\s*"NO_REPLY"\s*\}$/i.test(trimmed);
}
function sanitizeSessionMemoryTranscriptText(text) {
	if (isNoReplyMarker(text)) return null;
	return sanitizeModelSpecialTokens(text).replace(SESSION_MEMORY_DROP_BLOCK_RE, "").replace(SESSION_MEMORY_ROLE_DIRECTIVE_BLOCK_RE, "").replace(SESSION_MEMORY_ROLE_DIRECTIVE_TAG_RE, "").replace(SESSION_MEMORY_TRAILING_NO_REPLY_RE, "").trim() || null;
}
function extractTextMessageContent(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return;
	for (const block of content) {
		if (!block || typeof block !== "object") continue;
		const candidate = block;
		if (candidate.type === "text" && typeof candidate.text === "string") return candidate.text;
	}
}
function renderSessionMemoryMessage(entry, turnOrigin) {
	if (!entry || typeof entry !== "object") return { turnOrigin };
	const record = entry;
	if (record.type !== "message" || !record.message) return { turnOrigin };
	const role = record.message.role;
	if (role !== "user" && role !== "assistant" || !("content" in record.message)) return { turnOrigin };
	const nextTurnOrigin = role === "user" ? classifySessionMessageOrigin(record.message, turnOrigin) : turnOrigin;
	const originClass = classifySessionMessageOrigin(record.message, nextTurnOrigin);
	if (role === "user" && hasInterSessionUserProvenance(record.message)) return { turnOrigin: nextTurnOrigin };
	const text = extractTextMessageContent(record.message.content);
	const sanitized = text ? sanitizeSessionMemoryTranscriptText(text) : null;
	if (!sanitized) return { turnOrigin: nextTurnOrigin };
	if (sanitized.startsWith("/")) return {
		turnOrigin: nextTurnOrigin,
		...role === "user" ? { message: {
			isDeliveryMirror: false,
			originClass,
			role
		} } : {}
	};
	return {
		turnOrigin: nextTurnOrigin,
		message: {
			isDeliveryMirror: isOpenClawDeliveryMirrorAssistantMessage(record.message),
			originClass,
			role,
			text: sanitized
		}
	};
}
function renderSessionMemoryRecords(events) {
	const allMessages = [];
	let lastAssistantText;
	let turnOrigin = "untrusted";
	for (const event of events) {
		const result = renderSessionMemoryMessage(event, turnOrigin);
		turnOrigin = result.turnOrigin;
		const rendered = result.message;
		if (!rendered) continue;
		if (rendered.role === "user") lastAssistantText = void 0;
		if (!rendered.text) continue;
		if (rendered.isDeliveryMirror && rendered.text === lastAssistantText) continue;
		allMessages.push({
			line: `${rendered.role}: ${quoteSessionMemoryText(rendered.text)}`,
			originClass: rendered.originClass
		});
		if (rendered.role === "assistant") lastAssistantText = rendered.text;
	}
	return allMessages;
}
/** Counts transcript events that remain after session-memory filtering and deduplication. */
function countSessionMemoryMessages(events) {
	return renderSessionMemoryRecords(events).length;
}
function getRecentSessionProjectionFromEvents(events, messageCount = 15) {
	const limit = Number.isFinite(messageCount) ? Math.max(0, Math.floor(messageCount)) : 0;
	if (limit === 0) return null;
	const records = renderSessionMemoryRecords(events).slice(-limit);
	if (records.length === 0) return null;
	return {
		content: records.map((record) => record.line).join("\n"),
		originClass: records.some((record) => record.originClass === "untrusted" || record.originClass === "system") ? "untrusted" : "agent"
	};
}
//#endregion
//#region src/hooks/bundled/session-memory/handler.ts
/**
* Session memory hook handler
*
* Saves session context to memory when /new or /reset command is triggered
* Creates a new dated memory file with a timestamp slug by default
*/
const log = createSubsystemLogger("hooks/session-memory");
const SESSION_MEMORY_CAPTURE_MAX_BYTES = 8 * 1024 * 1024;
const SESSION_MEMORY_CAPTURE_PAGE_MESSAGES = 256;
const SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES = 4096;
function pickDateTimePart(parts, type) {
	return parts.find((part) => part.type === type)?.value;
}
function formatLocalSessionTimestamp(date, timeZone) {
	const parts = new Intl.DateTimeFormat("en-US", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hourCycle: "h23"
	}).formatToParts(date);
	const year = pickDateTimePart(parts, "year") ?? String(date.getFullYear()).padStart(4, "0");
	const month = pickDateTimePart(parts, "month") ?? String(date.getMonth() + 1).padStart(2, "0");
	const day = pickDateTimePart(parts, "day") ?? String(date.getDate()).padStart(2, "0");
	const hour = pickDateTimePart(parts, "hour") ?? String(date.getHours()).padStart(2, "0");
	const minute = pickDateTimePart(parts, "minute") ?? String(date.getMinutes()).padStart(2, "0");
	const second = pickDateTimePart(parts, "second") ?? String(date.getSeconds()).padStart(2, "0");
	return {
		date: `${year}-${month}-${day}`,
		time: `${hour}:${minute}:${second}`,
		timeSlug: `${hour}${minute}`
	};
}
async function resolveAvailableMemoryFilename(params) {
	const basename = `${params.dateStr}-${params.slug}`;
	let suffix = 1;
	while (true) {
		const filename = suffix === 1 ? `${basename}.md` : `${basename}-${suffix}.md`;
		try {
			await fs.access(path.join(params.memoryDir, filename));
			suffix += 1;
		} catch (err) {
			if (err.code === "ENOENT") return filename;
			throw err;
		}
	}
}
async function getRecentSqliteSessionContent(scope, messageCount, capturedEvents) {
	const events = capturedEvents ?? await loadTranscriptEvents({ ...scope });
	const latestResetIndex = capturedEvents ? -1 : events.findLastIndex((event) => Boolean(event) && typeof event === "object" && !Array.isArray(event) && event.type === "reset");
	return getRecentSessionProjectionFromEvents(selectVisibleTranscriptEvents(latestResetIndex >= 0 ? events.slice(0, latestResetIndex) : events), messageCount);
}
function relinkCapturedActiveMessageEvents(events) {
	let parentId = null;
	return events.map((event, index) => {
		if (!event || typeof event !== "object" || Array.isArray(event)) return event;
		const record = event;
		if (record.type !== "message") return event;
		const id = typeof record.id === "string" ? record.id : `session-memory-${index + 1}`;
		const linked = {
			...record,
			id,
			parentId
		};
		parentId = id;
		return linked;
	});
}
function captureRecentSessionMemoryEvents(scope, messageCount) {
	const captured = [];
	let capturedBytes = 0;
	let offset = 0;
	let totalMessages = Number.POSITIVE_INFINITY;
	while (offset < totalMessages && offset < SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES && capturedBytes < SESSION_MEMORY_CAPTURE_MAX_BYTES && countSessionMemoryMessages(selectVisibleTranscriptEvents(relinkCapturedActiveMessageEvents(captured))) < messageCount) {
		const page = readSessionTranscriptBoundedMessageTailPage(scope, {
			maxBytes: SESSION_MEMORY_CAPTURE_MAX_BYTES - capturedBytes,
			maxMessages: Math.min(SESSION_MEMORY_CAPTURE_PAGE_MESSAGES, SESSION_MEMORY_CAPTURE_MAX_SCANNED_MESSAGES - offset),
			offset
		});
		totalMessages = page.totalMessages;
		if (page.scannedMessages === 0) break;
		captured.unshift(...page.events.map(({ event }) => event));
		capturedBytes += page.serializedBytes;
		offset += page.scannedMessages;
	}
	return relinkCapturedActiveMessageEvents(captured);
}
function resolveDisplaySessionKey(params) {
	if (!params.cfg || !params.workspaceDir) return params.sessionKey;
	const workspaceAgentId = resolveAgentIdByWorkspacePath(params.cfg, params.workspaceDir);
	const parsed = parseAgentSessionKey(params.sessionKey);
	if (!workspaceAgentId || !parsed || workspaceAgentId === parsed.agentId) return params.sessionKey;
	return toAgentStoreSessionKey({
		agentId: workspaceAgentId,
		requestKey: parsed.rest
	});
}
const pendingSessionMemoryWrites = /* @__PURE__ */ new Set();
function requireSessionMemoryAgentId(event) {
	const agentId = normalizeOptionalString(event.context?.agentId);
	if (!agentId) throw new Error("Session memory hook contract requires context.agentId");
	return agentId;
}
async function flushSessionMemoryWritesForTest() {
	await Promise.allSettled(pendingSessionMemoryWrites);
}
async function saveSessionMemoryNow(event, agentId, capturedEvents) {
	try {
		log.debug("Session memory hook triggered", {
			action: event.action,
			type: event.type
		});
		const context = event.context || {};
		const cfg = context.cfg;
		const contextWorkspaceDir = typeof context.workspaceDir === "string" && context.workspaceDir.trim().length > 0 ? context.workspaceDir : void 0;
		const contextStorePath = typeof context.storePath === "string" && context.storePath.trim() ? context.storePath.trim() : void 0;
		const workspaceDir = contextWorkspaceDir || (cfg ? resolveAgentWorkspaceDir(cfg, agentId) : path.join(resolveStateDir(process.env, os.homedir), "workspace"));
		const displaySessionKey = resolveDisplaySessionKey({
			cfg,
			workspaceDir: contextWorkspaceDir,
			sessionKey: event.sessionKey
		});
		const memoryDir = path.join(workspaceDir, "memory");
		await fs.mkdir(memoryDir, { recursive: true });
		const now = new Date(event.timestamp);
		const userTimezone = resolveUserTimezone(cfg?.agents?.defaults?.userTimezone ?? process.env.TZ);
		const localTimestamp = formatLocalSessionTimestamp(now, userTimezone);
		const dateStr = localTimestamp.date;
		const sessionEntry = event.type === "command" ? context.previousSessionEntry || context.sessionEntry || {} : context.sessionEntry || {};
		const currentSessionId = typeof sessionEntry.sessionId === "string" && sessionEntry.sessionId.trim() ? sessionEntry.sessionId.trim() : void 0;
		log.debug("Session context resolved", {
			sessionId: currentSessionId,
			hasCfg: Boolean(cfg)
		});
		const hookConfig = resolveHookConfig(cfg, "session-memory");
		const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
		let slug = null;
		let transcript = {
			status: "available",
			content: null,
			originClass: "agent"
		};
		if (currentSessionId) {
			try {
				const projection = await getRecentSqliteSessionContent({
					agentId,
					sessionId: currentSessionId,
					sessionKey: event.sessionKey,
					storePath: contextStorePath ?? resolveSessionStorePathCore(cfg?.session?.store, { agentId })
				}, messageCount, capturedEvents);
				transcript = projection ? {
					status: "available",
					...projection
				} : {
					status: "available",
					content: null,
					originClass: "agent"
				};
			} catch (error) {
				const reason = formatHookErrorForLog(error);
				transcript = {
					status: "unavailable",
					reason
				};
				log.warn("Session transcript unavailable for memory capture", {
					sessionKey: event.sessionKey,
					error: reason
				});
			}
			log.debug("Session content loaded", {
				length: transcript.status === "available" ? transcript.content?.length ?? 0 : 0,
				messageCount
			});
			const allowLlmSlug = !isVitestRuntimeEnv() && hookConfig?.llmSlug === true;
			if (transcript.status === "available" && transcript.content && cfg && allowLlmSlug) {
				log.debug("Calling generateSlugViaLLM...");
				const slugModel = typeof hookConfig?.model === "string" ? hookConfig.model : void 0;
				slug = await generateSlugViaLLM({
					sessionContent: transcript.content,
					cfg,
					agentId,
					model: slugModel
				});
				log.debug("Generated slug", { slug });
			}
		}
		if (!slug) {
			slug = localTimestamp.timeSlug;
			log.debug("Using fallback timestamp slug", { slug });
		}
		const filename = await resolveAvailableMemoryFilename({
			memoryDir,
			dateStr,
			slug
		});
		const memoryFilePath = path.join(memoryDir, filename);
		log.debug("Memory file path resolved", {
			filename,
			path: shortenHomePath(memoryFilePath)
		});
		const timeStr = localTimestamp.time;
		const sessionId = sessionEntry.sessionId || "unknown";
		const boundaryDetail = event.type === "session" ? `- **Reason**: ${context.reason || "unknown"}` : `- **Source**: ${context.commandSource || "unknown"}`;
		const entryParts = [
			`# Session: ${dateStr} ${timeStr} ${userTimezone}`,
			"",
			`- **Session Key**: ${displaySessionKey}`,
			`- **Session ID**: ${sessionId}`,
			boundaryDetail,
			""
		];
		if (transcript.status === "available" && transcript.content) entryParts.push("## Conversation Summary", "", transcript.content, "");
		else if (transcript.status === "unavailable") entryParts.push("## Conversation Summary", "", `> Transcript content was unavailable: ${JSON.stringify(transcript.reason)}`, "");
		const entry = entryParts.join("\n");
		const memoryRoot = await root(memoryDir);
		const provenanceObserver = createMemoryWriteProvenanceObserver({
			mutationRoot: workspaceDir,
			workspaceDir,
			resolveOriginClass: () => transcript.status === "available" ? transcript.originClass : "agent",
			sessionId: currentSessionId,
			sessionKey: event.sessionKey,
			now: () => now.getTime()
		});
		const commit = () => memoryRoot.write(filename, entry, { encoding: "utf-8" });
		await provenanceObserver.write({
			absolutePath: memoryFilePath,
			contentBefore: "",
			contentAfter: entry,
			commit
		});
		log.debug("Memory file written successfully");
		const relPath = shortenHomePath(memoryFilePath);
		log.info(`Session context saved to ${relPath}`);
	} catch (err) {
		if (err instanceof Error) log.error("Failed to save session memory", {
			errorName: err.name,
			errorMessage: err.message,
			stack: err.stack
		});
		else log.error("Failed to save session memory", { error: String(err) });
	}
}
const saveSessionToMemory = (event) => {
	const isResetCommand = event.action === "new" || event.action === "reset";
	const isAutoReset = event.type === "session" && event.action === "auto-reset" && isSessionAutoResetReason(event.context.reason);
	if ((event.type !== "command" || !isResetCommand) && !isAutoReset) return;
	const agentId = requireSessionMemoryAgentId(event);
	let capturedEvents;
	try {
		const context = event.context || {};
		const sessionEntry = event.type === "command" ? context.previousSessionEntry || context.sessionEntry || {} : context.sessionEntry || {};
		const sessionId = typeof sessionEntry.sessionId === "string" && sessionEntry.sessionId.trim() ? sessionEntry.sessionId.trim() : void 0;
		if (sessionId) {
			const cfg = context.cfg;
			const storePath = typeof context.storePath === "string" && context.storePath.trim() ? context.storePath.trim() : resolveSessionStorePathCore(cfg?.session?.store, { agentId });
			const hookConfig = resolveHookConfig(cfg, "session-memory");
			const messageCount = typeof hookConfig?.messages === "number" && hookConfig.messages > 0 ? hookConfig.messages : 15;
			capturedEvents = captureRecentSessionMemoryEvents({
				agentId,
				sessionId,
				sessionKey: event.sessionKey,
				storePath
			}, messageCount);
		}
	} catch {}
	const writePromise = isAutoReset ? saveSessionMemoryNow(event, agentId, capturedEvents) : runWithGatewayIndependentRootWorkContinuation(() => saveSessionMemoryNow(event, agentId, capturedEvents));
	pendingSessionMemoryWrites.add(writePromise);
	writePromise.finally(() => {
		pendingSessionMemoryWrites.delete(writePromise);
	});
	if (isAutoReset) return writePromise;
};
//#endregion
export { saveSessionToMemory as default, flushSessionMemoryWritesForTest };
