import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { u as asPositiveFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { n as extractBalancedJsonFragments } from "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { gt as normalizeUsage } from "./session-accessor-Bi6bzKQE.js";
import { n as estimateBase64DecodedBytes } from "./base64-KcXAb-1x.js";
import { i as coerceToFailoverError, p as resolveFailoverStatus, t as FailoverError } from "./failover-error-EKvoWJQa.js";
import { i as scanReasoningTags, r as createReasoningTagTextPartitioner } from "./code-regions-BWkFWnhP.js";
//#region src/agents/cli-output-records.ts
function isClaudeCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "claude-cli";
}
function isGeminiCliProvider(providerId) {
	return normalizeLowercaseStringOrEmpty(providerId) === "google-gemini-cli";
}
function isGeminiStreamJsonDialect(params) {
	return params.backend.jsonlDialect === "gemini-stream-json" || isGeminiCliProvider(params.providerId);
}
function isClaudeStreamJsonDialect(params) {
	if (params.backend.jsonlDialect) return params.backend.jsonlDialect === "claude-stream-json";
	return isClaudeCliProvider(params.providerId);
}
function isStreamJsonDialect(params) {
	return supportsCliJsonlToolEvents(params);
}
/** Returns whether JSONL output carries correlated provider tool events. */
function supportsCliJsonlToolEvents(params) {
	return params.backend.jsonlDialect === "claude-stream-json" || isClaudeCliProvider(params.providerId) || isGeminiStreamJsonDialect(params);
}
function isClaudeStreamJsonResult(params) {
	return supportsCliJsonlToolEvents(params) && params.parsed.type === "result";
}
function extractJsonObjectCandidates(raw) {
	return extractBalancedJsonFragments(raw, { openers: ["{"] }).map((fragment) => fragment.json);
}
function decodeCliRecords(raw) {
	const parsedRecords = [];
	const trimmed = raw.trim();
	if (!trimmed) return parsedRecords;
	try {
		const parsed = JSON.parse(trimmed);
		if (isRecord(parsed)) {
			parsedRecords.push(parsed);
			return parsedRecords;
		}
	} catch {}
	for (const candidate of extractJsonObjectCandidates(trimmed)) try {
		const parsed = JSON.parse(candidate);
		if (isRecord(parsed)) parsedRecords.push(parsed);
	} catch {}
	return parsedRecords;
}
function readNestedErrorMessage(parsed) {
	if (isRecord(parsed.error)) {
		const errorMessage = readNestedErrorMessage(parsed.error);
		if (errorMessage) return errorMessage;
	}
	if (typeof parsed.message === "string") {
		const trimmed = parsed.message.trim();
		if (trimmed) return trimmed;
	}
	if (typeof parsed.error === "string") {
		const trimmed = parsed.error.trim();
		if (trimmed) return trimmed;
	}
}
function unwrapCliErrorText(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return "";
	for (const parsed of decodeCliRecords(trimmed)) {
		const nested = readNestedErrorMessage(parsed);
		if (nested) return nested;
	}
	return trimmed;
}
function normalizeCliUsageRecord(raw) {
	if (!isRecord(raw)) return;
	const usageRaw = raw;
	const usage = normalizeUsage(usageRaw);
	if (!usage) return;
	const reportedInputTotal = [
		usageRaw.inputTokens,
		usageRaw.input_tokens,
		usageRaw.promptTokens,
		usageRaw.prompt_tokens
	].some((value) => typeof value === "number" && value > 0);
	const cliUsage = {
		input: usage.input === 0 && reportedInputTotal && Boolean(usage.cacheRead || usage.cacheWrite) ? 0 : usage.input || void 0,
		output: usage.output || void 0,
		cacheRead: usage.cacheRead || void 0,
		cacheWrite: usage.cacheWrite || void 0,
		total: usage.total || void 0
	};
	return Object.values(cliUsage).some((value) => typeof value === "number" && value > 0) ? cliUsage : void 0;
}
function readCliUsage(parsed) {
	return normalizeCliUsageRecord(isRecord(parsed.message) ? parsed.message.usage : void 0) ?? normalizeCliUsageRecord(parsed.usage) ?? normalizeCliUsageRecord(parsed.stats);
}
function collectCliText(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map((entry) => collectCliText(entry)).join("");
	if (!isRecord(value)) return "";
	if (typeof value.response === "string") return value.response;
	if (typeof value.text === "string") return value.text;
	if (typeof value.result === "string") return value.result;
	if (typeof value.content === "string") return value.content;
	if (Array.isArray(value.content)) return value.content.map((entry) => collectCliText(entry)).join("");
	if (isRecord(value.message)) return collectCliText(value.message);
	return "";
}
function unwrapNestedCliResultText(raw) {
	let text = raw;
	for (let depth = 0; depth < 8; depth += 1) {
		const trimmed = text.trim();
		if (!trimmed.startsWith("{")) return text;
		try {
			const parsed = JSON.parse(trimmed);
			if (!isRecord(parsed) || typeof parsed.type !== "string" || parsed.type !== "result" || typeof parsed.result !== "string") return text;
			text = parsed.result;
		} catch {
			return text;
		}
	}
	return text;
}
function collectExplicitCliErrorText(parsed) {
	const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
	if (parsed.is_error === true || parsed.type === "result" && (subtype.startsWith("error_") || parsed.status === "error")) {
		const text = collectCliText(parsed.result) || collectCliText(parsed.message) || collectCliText(parsed.content);
		if (text) return unwrapCliErrorText(text);
		const nested = readNestedErrorMessage(parsed);
		if (nested) return unwrapCliErrorText(nested);
		if (subtype) return `Claude CLI result subtype ${subtype}.`;
		return "CLI result was marked as an error.";
	}
	const nested = readNestedErrorMessage(parsed);
	if (nested) return unwrapCliErrorText(nested);
	if (parsed.type === "assistant") {
		const text = collectCliText(parsed.message);
		if (/^\s*API Error:/i.test(text)) return unwrapCliErrorText(text);
	}
	if (parsed.type === "error") return unwrapCliErrorText(collectCliText(parsed.message) || collectCliText(parsed.content) || collectCliText(parsed.result) || collectCliText(parsed));
	return "";
}
function readClaudeMaxTurnsFailure(parsed) {
	const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
	const terminalReason = typeof parsed.terminal_reason === "string" ? parsed.terminal_reason.trim() : "";
	if (subtype !== "error_max_turns" && terminalReason !== "max_turns") return;
	const errors = Array.isArray(parsed.errors) ? parsed.errors : [];
	for (const error of errors) {
		if (typeof error !== "string") continue;
		const match = error.match(/maximum number of turns\s*\((\d+)\)/i);
		if (match) {
			const limit = Number.parseInt(match[1] ?? "", 10);
			if (Number.isSafeInteger(limit) && limit > 0) return {
				reason: "max_turns",
				limit
			};
		}
	}
	return { reason: "max_turns" };
}
function readClaudeMaxTurnsErrorText(parsed) {
	if (!Array.isArray(parsed.errors)) return;
	for (const error of parsed.errors) if (typeof error === "string" && error.trim()) return error.trim();
}
function resolveCliTerminalErrorText(parsed, terminalFailure) {
	const explicitErrorText = collectExplicitCliErrorText(parsed);
	return ((terminalFailure ? readClaudeMaxTurnsErrorText(parsed) : void 0) ?? explicitErrorText) || (terminalFailure ? "Reached maximum number of turns." : "");
}
function pickCliSessionId(parsed, backend) {
	const fields = backend.sessionIdFields ?? [
		"session_id",
		"sessionId",
		"conversation_id",
		"conversationId"
	];
	for (const field of fields) {
		const value = parsed[field];
		if (typeof value === "string" && value.trim()) return value.trim();
	}
}
function pickCliResumeCheckpointId(params) {
	if (!isClaudeStreamJsonDialect(params) || params.parsed.type !== "assistant" || params.parsed.parent_tool_use_id != null) return;
	return (typeof params.parsed.uuid === "string" ? params.parsed.uuid.trim() : "") || void 0;
}
function shouldUnwrapNestedCliResultText(params) {
	if (!params.providerId || !isClaudeCliProvider(params.providerId)) return false;
	return !Object.hasOwn(params.parsed, "type") || params.parsed.type === "result";
}
function hasExplicitCliErrorPayload(parsed) {
	if (typeof parsed.error === "string") return Boolean(parsed.error.trim());
	if (isRecord(parsed.error)) return Boolean(readNestedErrorMessage(parsed.error));
	return false;
}
/** Parses a single JSON payload emitted by a CLI backend. */
function parseCliJson(raw, backend, providerId) {
	const parsedRecords = decodeCliRecords(raw);
	if (parsedRecords.length === 0) return null;
	let sessionId;
	let usage;
	let text = "";
	let sawStructuredOutput = false;
	for (const parsed of parsedRecords) {
		sessionId = pickCliSessionId(parsed, backend) ?? sessionId;
		usage = readCliUsage(parsed) ?? usage;
		const terminalFailure = isClaudeStreamJsonDialect({
			backend,
			providerId: providerId ?? ""
		}) ? readClaudeMaxTurnsFailure(parsed) : void 0;
		if (terminalFailure) return {
			text: "",
			sessionId,
			usage,
			errorText: resolveCliTerminalErrorText(parsed, terminalFailure),
			terminalFailure
		};
		const subtype = typeof parsed.subtype === "string" ? parsed.subtype.trim() : "";
		const errorText = parsed.is_error === true || parsed.type === "error" || parsed.type === "result" && (subtype.startsWith("error_") || parsed.status === "error" || hasExplicitCliErrorPayload(parsed)) ? collectExplicitCliErrorText(parsed) : "";
		if (errorText) return {
			text: "",
			sessionId,
			usage,
			errorText
		};
		const nextText = collectCliText(parsed.message) || collectCliText(parsed.content) || collectCliText(parsed.result) || collectCliText(parsed.response) || collectCliText(parsed);
		const trimmedText = (shouldUnwrapNestedCliResultText({
			providerId,
			parsed
		}) ? unwrapNestedCliResultText(nextText) : nextText).trim();
		if (trimmedText) {
			text = trimmedText;
			sawStructuredOutput = true;
			continue;
		}
		if (sessionId || usage) sawStructuredOutput = true;
	}
	if (!text && !sawStructuredOutput) return null;
	return {
		text,
		sessionId,
		usage
	};
}
function parseClaudeCliJsonlResult(params) {
	if (!supportsCliJsonlToolEvents(params)) return null;
	if (typeof params.parsed.type === "string" && params.parsed.type === "result") {
		const terminalFailure = isClaudeStreamJsonDialect(params) ? readClaudeMaxTurnsFailure(params.parsed) : void 0;
		const errorText = resolveCliTerminalErrorText(params.parsed, terminalFailure);
		if (errorText) return {
			text: "",
			sessionId: params.sessionId,
			usage: params.usage,
			errorText,
			...terminalFailure ? { terminalFailure } : {}
		};
		if (typeof params.parsed.result !== "string") return null;
		const resultText = unwrapNestedCliResultText(params.parsed.result).trim();
		if (resultText) return {
			text: resultText,
			sessionId: params.sessionId,
			usage: params.usage
		};
		return {
			text: "",
			sessionId: params.sessionId,
			usage: params.usage
		};
	}
	return null;
}
function preferStreamedClaudeTextOverResult(params) {
	return Boolean(params.resultText) && params.streamedText !== params.resultText && params.finalMessageText === params.resultText;
}
function missingMessageBoundarySeparator(previousText, nextDelta) {
	if (!previousText) return "";
	const trailing = previousText.match(/\n*$/u)?.[0].length ?? 0;
	const leading = nextDelta.match(/^\n*/u)?.[0].length ?? 0;
	return "\n".repeat(Math.max(0, 2 - trailing - leading));
}
function parseClaudeCliStreamingDelta(params) {
	if (!supportsCliJsonlToolEvents(params)) return null;
	if (params.parsed.type !== "stream_event" || !isRecord(params.parsed.event)) return null;
	const event = params.parsed.event;
	if (event.type !== "content_block_delta" || !isRecord(event.delta)) return null;
	const delta = event.delta;
	if (delta.type !== "text_delta" || typeof delta.text !== "string") return null;
	if (!delta.text) return null;
	return delta.text;
}
const GEMINI_CLI_ERROR_EVENT_FALLBACK = "Gemini CLI emitted an error event.";
const GEMINI_CLI_RESULT_ERROR_FALLBACK = "Gemini CLI result status was error.";
function isFallbackGeminiCliStreamJsonError(errorText) {
	return errorText === GEMINI_CLI_ERROR_EVENT_FALLBACK || errorText === GEMINI_CLI_RESULT_ERROR_FALLBACK;
}
function preferGeminiCliStreamJsonError(current, next) {
	if (!current) return next;
	if (isFallbackGeminiCliStreamJsonError(current) && !isFallbackGeminiCliStreamJsonError(next)) return next;
	return current;
}
function readGeminiCliStreamJsonError(parsed) {
	if (parsed.type === "error" && parsed.severity === "error") return collectExplicitCliErrorText(parsed) || GEMINI_CLI_ERROR_EVENT_FALLBACK;
	if (parsed.type === "result" && parsed.status === "error") return collectExplicitCliErrorText(parsed) || GEMINI_CLI_RESULT_ERROR_FALLBACK;
}
//#endregion
//#region src/agents/cli-output-events.ts
function createToolUseTracker() {
	return {
		pendingByIndex: /* @__PURE__ */ new Map(),
		nameById: /* @__PURE__ */ new Map(),
		startedIds: /* @__PURE__ */ new Set(),
		resultDeliveredIds: /* @__PURE__ */ new Set()
	};
}
function emitToolStartOnce(tracker, toolCallId, name, kind, args, onToolUseStart) {
	if (tracker.startedIds.has(toolCallId)) return;
	tracker.startedIds.add(toolCallId);
	tracker.nameById.set(toolCallId, name);
	onToolUseStart?.({
		toolCallId,
		name,
		kind,
		args
	});
}
function emitToolResultOnce(tracker, toolCallId, isError, result, onToolResult) {
	if (tracker.resultDeliveredIds.has(toolCallId)) return;
	tracker.resultDeliveredIds.add(toolCallId);
	onToolResult?.({
		toolCallId,
		name: tracker.nameById.get(toolCallId) ?? "",
		isError,
		result
	});
}
function projectCliBackendEvent(params) {
	const { event, state } = params;
	if (state.output?.errorText && event.kind !== "sessionId" && event.kind !== "result") return;
	state.sawCustomJsonlEvent = true;
	if (event.kind === "sessionId") {
		const sessionId = event.sessionId.trim();
		if (sessionId && sessionId !== state.sessionId) {
			state.sessionId = sessionId;
			params.onSessionId?.(sessionId);
		}
		if (state.output) state.output = {
			...state.output,
			sessionId: state.sessionId
		};
		return;
	}
	if (event.kind === "text") {
		if (!event.text) return;
		state.assistantText += event.text;
		params.onAssistantDelta({
			text: state.assistantText,
			delta: event.text,
			sessionId: state.sessionId,
			usage: state.usage
		});
		return;
	}
	if (event.kind === "thinking") {
		if (!event.text || !params.onThinkingDelta) return;
		state.customThinkingText += event.text;
		params.onThinkingDelta({
			text: state.customThinkingText,
			delta: event.text,
			isReasoningSnapshot: true
		});
		return;
	}
	if (event.kind === "toolStart") {
		emitToolStartOnce(params.toolTracker, event.toolCallId, event.name, "tool_use", event.args ?? {}, params.onDisplayToolUseStart ?? params.onToolUseStart);
		return;
	}
	if (event.kind === "toolResult") {
		if (event.name) params.toolTracker.nameById.set(event.toolCallId, event.name);
		emitToolResultOnce(params.toolTracker, event.toolCallId, event.isError === true, event.result, params.onDisplayToolResult ?? params.onToolResult);
		return;
	}
	const normalizedSessionId = event.sessionId?.trim();
	if (normalizedSessionId && normalizedSessionId !== state.sessionId) {
		state.sessionId = normalizedSessionId;
		params.onSessionId?.(normalizedSessionId);
	}
	if (event.usage) {
		state.usage = event.usage;
		params.onUsage?.(event.usage, true);
	}
	const existingErrorText = state.output?.errorText;
	const eventText = event.text?.trim() ?? "";
	const existingText = state.output?.text.trim() ?? "";
	const streamedText = state.assistantText.trim();
	const delegatedText = params.texts.join("\n").trim();
	const resultText = existingErrorText ? existingText || delegatedText || streamedText : eventText || existingText || delegatedText || streamedText;
	const errorText = existingErrorText || event.errorText;
	state.output = {
		...state.output,
		text: resultText,
		sessionId: state.sessionId,
		usage: state.usage,
		...errorText ? { errorText } : {}
	};
}
function projectCliTaggedReasoning(params) {
	let text = params.currentText;
	for (const delta of params.deltas) {
		if (delta.kind === "text") {
			params.onVisibleText(delta.text);
			continue;
		}
		text += delta.text;
		if (!params.hasNativeThinking) params.onThinkingDelta?.({
			text,
			delta: delta.text,
			isReasoningSnapshot: true
		});
	}
	return text;
}
function isClaudeToolUseBlockType(type) {
	return type === "tool_use" || type === "server_tool_use" || type === "mcp_tool_use";
}
function isClaudeAssistantToolResultBlockType(type) {
	return typeof type === "string" && type.endsWith("_tool_result") && type !== "tool_result";
}
function isClaudeToolResultError(content) {
	return isRecord(content) && typeof content.type === "string" && content.type.endsWith("_error");
}
function parseToolInputJson(parts) {
	if (parts.length === 0) return {};
	try {
		const parsed = JSON.parse(parts.join(""));
		return isRecord(parsed) ? parsed : {};
	} catch {
		return {};
	}
}
function dispatchClaudeCliStreamingToolEvent(params) {
	if (!supportsCliJsonlToolEvents(params)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "content_block_start" && typeof event.index === "number" && isRecord(event.content_block)) {
			const block = event.content_block;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (toolCallId && name) tracker.pendingByIndex.set(event.index, {
					toolCallId,
					name,
					kind: block.type,
					inputJsonParts: []
				});
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (toolCallId) emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
			return;
		}
		if (event.type === "content_block_delta" && typeof event.index === "number" && isRecord(event.delta)) {
			if (event.delta.type === "input_json_delta" && typeof event.delta.partial_json === "string") tracker.pendingByIndex.get(event.index)?.inputJsonParts.push(event.delta.partial_json);
			return;
		}
		if (event.type === "content_block_stop" && typeof event.index === "number") {
			const pending = tracker.pendingByIndex.get(event.index);
			tracker.pendingByIndex.delete(event.index);
			if (pending) emitToolStartOnce(tracker, pending.toolCallId, pending.name, pending.kind, parseToolInputJson(pending.inputJsonParts), params.onToolUseStart);
			return;
		}
		return;
	}
	if (params.parsed.type === "assistant" && isRecord(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord(block)) continue;
			if (isClaudeToolUseBlockType(block.type)) {
				const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
				const name = typeof block.name === "string" ? block.name.trim() : "";
				if (!toolCallId || !name) continue;
				const args = isRecord(block.input) ? block.input : {};
				emitToolStartOnce(tracker, toolCallId, name, block.type, args, params.onToolUseStart);
			} else if (isClaudeAssistantToolResultBlockType(block.type)) {
				const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
				if (!toolCallId) continue;
				emitToolResultOnce(tracker, toolCallId, block.is_error === true || isClaudeToolResultError(block.content), block.content, params.onToolResult);
			}
		}
		return;
	}
	if (params.parsed.type === "user" && isRecord(params.parsed.message)) {
		const message = params.parsed.message;
		const content = Array.isArray(message.content) ? message.content : [];
		for (const block of content) {
			if (!isRecord(block) || block.type !== "tool_result") continue;
			const toolCallId = typeof block.tool_use_id === "string" ? block.tool_use_id.trim() : "";
			if (!toolCallId) continue;
			emitToolResultOnce(tracker, toolCallId, block.is_error === true, block.content, params.onToolResult);
		}
	}
}
function createThinkingTracker() {
	return {
		streamedByIndex: /* @__PURE__ */ new Map(),
		emittedText: "",
		nextSyntheticBlockIndex: 0,
		progressTokens: 0
	};
}
function resetThinkingBlockState(tracker) {
	tracker.streamedByIndex.clear();
	tracker.emittedText = "";
	tracker.currentSyntheticBlockIndex = void 0;
	tracker.nextSyntheticBlockIndex = 0;
	tracker.progressTokens = 0;
}
function resetThinkingTrackerForMessage(tracker, messageId) {
	if (messageId && messageId === tracker.currentMessageId) return;
	if (messageId && tracker.currentMessageId === void 0) {
		tracker.currentMessageId = messageId;
		return;
	}
	resetThinkingBlockState(tracker);
	tracker.currentMessageId = messageId;
}
function beginClaudeContentBlock(tracker, index) {
	if (typeof index === "number") {
		tracker.currentSyntheticBlockIndex = index;
		tracker.nextSyntheticBlockIndex = Math.max(tracker.nextSyntheticBlockIndex, index + 1);
		return;
	}
	if (index !== void 0) {
		tracker.currentSyntheticBlockIndex = void 0;
		return;
	}
	tracker.currentSyntheticBlockIndex = tracker.nextSyntheticBlockIndex;
	tracker.nextSyntheticBlockIndex += 1;
}
function stopClaudeContentBlock(tracker) {
	tracker.currentSyntheticBlockIndex = void 0;
}
function resolveClaudeContentBlockIndex(tracker, index) {
	if (typeof index === "number") {
		tracker.nextSyntheticBlockIndex = Math.max(tracker.nextSyntheticBlockIndex, index + 1);
		return index;
	}
	if (index !== void 0) return null;
	return tracker.currentSyntheticBlockIndex ?? null;
}
function assembleThinkingTextByIndex(streamedByIndex) {
	return [...streamedByIndex.entries()].toSorted(([left], [right]) => left - right).map(([, text]) => text).join("");
}
function emitClaudeThinking(tracker, index, streamed, delta, onThinkingDelta) {
	tracker.streamedByIndex.set(index, `${streamed}${delta}`);
	tracker.emittedText = assembleThinkingTextByIndex(tracker.streamedByIndex);
	onThinkingDelta({
		text: tracker.emittedText,
		delta,
		isReasoningSnapshot: true
	});
}
function readThinkingProgressTokens(delta) {
	if (delta.type !== "thinking_delta" || delta.thinking !== "") return;
	return asPositiveFiniteNumber(delta.estimated_tokens);
}
function emitClaudeThinkingProgress(tracker, progressTokensDelta, onThinkingProgress) {
	tracker.progressTokens += progressTokensDelta;
	onThinkingProgress({ progressTokens: tracker.progressTokens });
}
function dispatchClaudeCliThinking(params) {
	if (!supportsCliJsonlToolEvents(params)) return;
	const tracker = params.tracker;
	if (params.parsed.type === "stream_event" && isRecord(params.parsed.event)) {
		const event = params.parsed.event;
		if (event.type === "message_start") {
			const message = isRecord(event.message) ? event.message : void 0;
			resetThinkingTrackerForMessage(tracker, typeof message?.id === "string" ? message.id : void 0);
			return;
		}
		if (event.type === "content_block_start") {
			beginClaudeContentBlock(tracker, event.index);
			return;
		}
		if (event.type === "content_block_stop") {
			stopClaudeContentBlock(tracker);
			return;
		}
		if (event.type !== "content_block_delta" || !isRecord(event.delta)) return;
		const blockIndex = resolveClaudeContentBlockIndex(tracker, event.index);
		if (blockIndex === null) return;
		const progressTokensDelta = readThinkingProgressTokens(event.delta);
		if (progressTokensDelta !== void 0 && params.onThinkingProgress) {
			emitClaudeThinkingProgress(tracker, progressTokensDelta, params.onThinkingProgress);
			return;
		}
		if (event.delta.type !== "thinking_delta" || typeof event.delta.thinking !== "string") return;
		if (!event.delta.thinking) return;
		if (!params.onThinkingDelta) return;
		emitClaudeThinking(tracker, blockIndex, tracker.streamedByIndex.get(blockIndex) ?? "", event.delta.thinking, params.onThinkingDelta);
		return;
	}
	if (params.parsed.type === "assistant" && isRecord(params.parsed.message)) {
		resetThinkingTrackerForMessage(tracker, typeof params.parsed.message.id === "string" ? params.parsed.message.id : void 0);
		const content = Array.isArray(params.parsed.message.content) ? params.parsed.message.content : [];
		for (const [index, block] of content.entries()) {
			if (!isRecord(block) || block.type !== "thinking" || typeof block.thinking !== "string") continue;
			if (!params.onThinkingDelta) continue;
			tracker.streamedByIndex.set(index, block.thinking);
			const text = assembleThinkingTextByIndex(tracker.streamedByIndex);
			if (text === tracker.emittedText) continue;
			tracker.emittedText = text;
			params.onThinkingDelta({
				text,
				delta: block.thinking,
				isReasoningSnapshot: true
			});
		}
	}
}
function dispatchGeminiCliStreamingToolEvent(params) {
	if (!isGeminiStreamJsonDialect(params)) return;
	if (params.parsed.type === "tool_use") {
		const toolCallId = typeof params.parsed.tool_id === "string" ? params.parsed.tool_id.trim() : "";
		const name = typeof params.parsed.tool_name === "string" ? params.parsed.tool_name.trim() : "";
		if (!toolCallId || !name) return;
		const args = isRecord(params.parsed.parameters) ? params.parsed.parameters : {};
		emitToolStartOnce(params.tracker, toolCallId, name, "tool_use", args, params.onToolUseStart);
		return;
	}
	if (params.parsed.type === "tool_result") {
		const toolCallId = typeof params.parsed.tool_id === "string" ? params.parsed.tool_id.trim() : "";
		if (!toolCallId) return;
		const result = params.parsed.status === "error" && isRecord(params.parsed.error) ? params.parsed.error : params.parsed.output;
		emitToolResultOnce(params.tracker, toolCallId, params.parsed.status === "error", result, params.onToolResult);
	}
}
function partitionLeadingTaggedReasoning(text, final) {
	const first = text.search(/\S/u);
	if (first === -1) return final ? {
		pending: false,
		reasoningText: "",
		visibleText: text
	} : { pending: true };
	if (text.charAt(first) !== "<") return {
		pending: false,
		reasoningText: "",
		visibleText: text
	};
	const scan = scanReasoningTags(text, final);
	let depth = 0;
	let end = -1;
	for (const tag of scan.tags) {
		if (depth === 0) {
			const expectedStart = end === -1 ? first : end;
			if (text.slice(expectedStart, tag.index).trim() || tag.isClose || tag.isSelfClosing) break;
		}
		depth += tag.isClose ? -1 : tag.isSelfClosing ? 0 : 1;
		if (depth === 0 && tag.isClose) end = tag.index + tag.text.length;
	}
	const pendingTagAfterBlock = end !== -1 && scan.pendingStart !== void 0 && !text.slice(end, scan.pendingStart).trim();
	if (end === -1) {
		const pendingLeadingTag = scan.pendingStart !== void 0 && !text.slice(first, scan.pendingStart).trim();
		return !final && (depth > 0 || pendingLeadingTag) ? { pending: true } : {
			pending: false,
			reasoningText: "",
			visibleText: text
		};
	}
	if (!final && (depth > 0 || pendingTagAfterBlock || !text.slice(end).trim())) return { pending: true };
	const partitioner = createReasoningTagTextPartitioner();
	const reasoningText = [...partitioner.pushVisible(text.slice(0, end)), ...partitioner.flush()].filter((delta) => delta.kind === "thinking").map((delta) => delta.text).join("");
	return reasoningText ? {
		pending: false,
		reasoningText,
		visibleText: text.slice(end)
	} : {
		pending: false,
		reasoningText: "",
		visibleText: text
	};
}
function createLeadingTaggedReasoningRouter() {
	let pending = "";
	let settled = false;
	const consume = (chunk, final) => {
		if (settled) return chunk ? [{
			kind: "text",
			text: chunk
		}] : [];
		pending += chunk;
		const result = partitionLeadingTaggedReasoning(pending, final);
		if (result.pending) return [];
		settled = true;
		pending = "";
		return [...result.reasoningText ? [{
			kind: "thinking",
			text: result.reasoningText
		}] : [], ...result.visibleText ? [{
			kind: "text",
			text: result.visibleText
		}] : []];
	};
	return {
		push: (chunk) => consume(chunk, false),
		finish: () => consume("", true)
	};
}
/** Creates a stateful parser for streaming JSONL CLI backend output. */
//#endregion
//#region src/agents/cli-output-stream.ts
const CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS = 8 * 1024 * 1024;
const CLI_STREAM_JSON_DEFAULT_MAX_TURN_LINES = 2e4;
const CLI_STREAM_JSON_MISSING_RESULT_ERROR = "CLI stream-json output ended without a result event.";
const CLAUDE_SYNTHETIC_NO_RESPONSE_ERROR = "Claude CLI returned a synthetic no-response result.";
const CLI_STREAM_JSON_OUTPUT_LIMITS = Object.freeze({
	maxTurnRawChars: CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS,
	maxPendingLineChars: CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS,
	maxTurnLines: CLI_STREAM_JSON_DEFAULT_MAX_TURN_LINES
});
function isClaudeSyntheticNoResponse(parsed) {
	if (parsed.type !== "assistant" || !isRecord(parsed.message)) return false;
	const message = parsed.message;
	if (message.model !== "<synthetic>" || !Array.isArray(message.content)) return false;
	return message.content.length === 1 && isRecord(message.content[0]) && message.content[0].type === "text" && message.content[0].text === "No response requested.";
}
/** Frames arbitrary stdout chunks while bounding each individual raw JSONL line. */
function frameBoundedCliJsonlChunk(state, chunk, maxLineChars, onLine) {
	for (let offset = 0; offset < chunk.length;) {
		const newlineIndex = chunk.indexOf("\n", offset);
		const lineEnd = newlineIndex === -1 ? chunk.length : newlineIndex;
		if (state.pending.length + (lineEnd - offset) > maxLineChars) {
			state.pending = "";
			return false;
		}
		state.pending += chunk.slice(offset, lineEnd);
		if (newlineIndex === -1) return true;
		const line = state.pending;
		state.pending = "";
		offset = newlineIndex + 1;
		if (onLine(line) === false) return true;
	}
	return true;
}
/** Drops Claude's echoed binary bytes before they enter retained tool/transcript state. */
function normalizeClaudeCliStreamJsonRecord(parsed) {
	if (parsed.type !== "user" || !isRecord(parsed.message)) return;
	const content = Array.isArray(parsed.message.content) ? parsed.message.content : [];
	let normalized = false;
	let omittedRawChars = 0;
	for (const result of content) {
		if (!isRecord(result) || result.type !== "tool_result" || !Array.isArray(result.content)) continue;
		for (const block of result.content) {
			if (!isRecord(block) || !isRecord(block.source) || block.source.type !== "base64") continue;
			if (block.type !== "image" && !(block.type === "document" && block.source.media_type === "application/pdf")) continue;
			const { data, ...source } = block.source;
			if (typeof data !== "string") continue;
			block.source = source;
			block.omitted = true;
			block.bytes = estimateBase64DecodedBytes(data);
			omittedRawChars += data.length;
			normalized = true;
		}
	}
	return normalized ? {
		line: JSON.stringify(parsed),
		omittedRawChars
	} : void 0;
}
function streamJsonOutputLimitErrorText(kind, limit) {
	if (kind === "line") return `CLI JSONL line exceeded ${limit} characters; refusing to parse output.`;
	if (kind === "lines") return `CLI JSONL output exceeded ${limit} lines; refusing to parse output.`;
	return `CLI JSONL output exceeded ${limit} characters; refusing to parse output.`;
}
function createCliJsonlStreamingParser(params) {
	const lineBuffer = { pending: "" };
	let assistantText = "";
	let customThinkingText = "";
	let pendingClaudeText = "";
	let pendingMessageSeparator = false;
	let currentMessageStart = 0;
	let segmentStart = 0;
	let preserveFrom = 0;
	let sawToolUseSinceText = false;
	let currentMessageHadToolUse = false;
	let previousMessageHadToolUse = false;
	let sessionId;
	let resumeCheckpointId;
	let usage;
	let diagnosticUsage;
	let output = null;
	let parseErrorText = "";
	let rawChars = 0;
	let rawLines = 0;
	const texts = [];
	let sawCustomJsonlEvent = false;
	let sawGeminiStructuredOutput = false;
	let sawTerminalResult = false;
	let sawClaudeSyntheticNoResponse = false;
	const toolTracker = createToolUseTracker();
	const outputLimits = CLI_STREAM_JSON_OUTPUT_LIMITS;
	const classifyClaudeCommentary = Boolean(params.onCommentaryText) && supportsCliJsonlToolEvents(params);
	const thinkingTracker = createThinkingTracker();
	const claudeStreamJson = isClaudeStreamJsonDialect(params);
	let taggedReasoningRouter = createLeadingTaggedReasoningRouter();
	let currentTaggedReasoningText = "";
	const flushPendingClaudeAssistantText = () => {
		if (!pendingClaudeText) return;
		const delta = pendingClaudeText;
		pendingClaudeText = "";
		assistantText = `${assistantText}${delta}`;
		params.onAssistantDelta({
			text: assistantText,
			delta,
			sessionId,
			usage
		});
	};
	const flushPendingClaudeCommentaryText = () => {
		if (!pendingClaudeText) return;
		const text = pendingClaudeText.trim();
		pendingClaudeText = "";
		if (text) params.onCommentaryText?.(text);
	};
	const emitClaudeVisibleText = (delta) => {
		if (!delta) return;
		if (classifyClaudeCommentary) {
			pendingClaudeText = `${pendingClaudeText}${delta}`;
			return;
		}
		const boundaryPending = pendingMessageSeparator || sawToolUseSinceText;
		const isToolSplitBoundary = pendingMessageSeparator ? previousMessageHadToolUse : sawToolUseSinceText;
		const separator = boundaryPending && assistantText ? missingMessageBoundarySeparator(assistantText, delta) : "";
		if (boundaryPending && assistantText) {
			currentMessageStart = assistantText.length + separator.length;
			if (!isToolSplitBoundary) preserveFrom = currentMessageStart;
		}
		pendingMessageSeparator = false;
		sawToolUseSinceText = false;
		const deltaText = `${separator}${delta}`;
		assistantText = `${assistantText}${deltaText}`;
		params.onAssistantDelta({
			text: assistantText,
			delta: deltaText,
			sessionId,
			usage
		});
	};
	const routeTaggedReasoningDeltas = (deltas) => {
		currentTaggedReasoningText = projectCliTaggedReasoning({
			deltas,
			currentText: currentTaggedReasoningText,
			hasNativeThinking: Boolean(thinkingTracker.emittedText),
			onThinkingDelta: params.onThinkingDelta,
			onVisibleText: emitClaudeVisibleText
		});
	};
	const finishTaggedReasoningMessage = () => {
		if (claudeStreamJson) routeTaggedReasoningDeltas(taggedReasoningRouter.finish());
	};
	const beginTaggedReasoningMessage = () => {
		finishTaggedReasoningMessage();
		taggedReasoningRouter = createLeadingTaggedReasoningRouter();
		currentTaggedReasoningText = "";
	};
	const handleCustomJsonlEvent = (event) => {
		const state = {
			assistantText,
			customThinkingText,
			sessionId,
			usage,
			output,
			sawCustomJsonlEvent
		};
		projectCliBackendEvent({
			...params,
			event,
			state,
			texts,
			toolTracker
		});
		({assistantText, customThinkingText, sessionId, usage, output, sawCustomJsonlEvent} = state);
	};
	const accountClaudeJsonlLine = (lineChars) => {
		rawChars += lineChars + 1;
		if (rawChars <= outputLimits.maxTurnRawChars) return true;
		parseErrorText = streamJsonOutputLimitErrorText("raw", outputLimits.maxTurnRawChars);
		lineBuffer.pending = "";
		return false;
	};
	const handleCustomJsonlLine = (line, rawLine) => {
		if (parseErrorText) return true;
		if (!params.parseJsonlEvent) return false;
		let parsed;
		try {
			parsed = params.parseJsonlEvent(line, {
				backendId: params.providerId,
				backend: params.backend
			});
		} catch (error) {
			parseErrorText = truncateUtf16Safe(`CLI backend ${params.providerId} JSONL parser failed: ${formatErrorMessage(error)}`, 500);
			return true;
		}
		if (parsed == null) return false;
		if (claudeStreamJson && !accountClaudeJsonlLine(rawLine.length)) return true;
		for (const event of Array.isArray(parsed) ? parsed : [parsed]) {
			if (event.kind === "result") sawTerminalResult = true;
			handleCustomJsonlEvent(event);
		}
		return true;
	};
	const handleParsedRecord = (parsed) => {
		if (parseErrorText) return;
		const parsedSessionId = pickCliSessionId(parsed, params.backend);
		if (parsed.type === "result" && isStreamJsonDialect(params)) sawTerminalResult = true;
		if (parsedSessionId && parsedSessionId !== sessionId) {
			sessionId = parsedSessionId;
			params.onSessionId?.(parsedSessionId);
		}
		const nextUsage = readCliUsage(parsed);
		const isClaudeTerminalResult = isClaudeStreamJsonDialect({
			backend: params.backend,
			providerId: params.providerId
		}) && parsed.type === "result";
		if (isClaudeTerminalResult && nextUsage && usage) diagnosticUsage = nextUsage;
		if (nextUsage) params.onUsage?.(nextUsage, isClaudeTerminalResult);
		if (!isClaudeStreamJsonResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed
		}) || !usage) usage = nextUsage ?? usage;
		if (parsed.type === "assistant" && isRecord(parsed.message)) {
			resumeCheckpointId = pickCliResumeCheckpointId({
				...params,
				parsed
			}) ?? resumeCheckpointId;
			params.onAssistantMessage?.(parsed.message);
			if (claudeStreamJson && isClaudeSyntheticNoResponse(parsed)) sawClaudeSyntheticNoResponse = true;
		}
		const geminiErrorText = isGeminiStreamJsonDialect(params) ? readGeminiCliStreamJsonError(parsed) : void 0;
		if (isGeminiStreamJsonDialect(params) && (parsed.type === "tool_use" || parsed.type === "tool_result" || parsed.type === "result")) sawGeminiStructuredOutput = true;
		if (geminiErrorText) {
			output = {
				text: "",
				sessionId,
				usage,
				errorText: preferGeminiCliStreamJsonError(output?.errorText, geminiErrorText)
			};
			return;
		}
		if (classifyClaudeCommentary && parsed.type === "result") {
			finishTaggedReasoningMessage();
			flushPendingClaudeAssistantText();
		} else if (parsed.type === "result") finishTaggedReasoningMessage();
		let result = parseClaudeCliJsonlResult({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			sessionId,
			usage
		});
		if (result) {
			if (result.errorText) {
				output = result;
				return;
			}
			if (claudeStreamJson && result.text) {
				const taggedResult = partitionLeadingTaggedReasoning(result.text, true);
				if (!taggedResult.pending && taggedResult.reasoningText) {
					if (!thinkingTracker.emittedText && taggedResult.reasoningText !== currentTaggedReasoningText) currentTaggedReasoningText = projectCliTaggedReasoning({
						deltas: [{
							kind: "thinking",
							text: taggedResult.reasoningText
						}],
						currentText: "",
						hasNativeThinking: false,
						onThinkingDelta: params.onThinkingDelta,
						onVisibleText: emitClaudeVisibleText
					});
					result = {
						...result,
						text: taggedResult.visibleText.trim()
					};
				}
			}
			const streamedText = assistantText.slice(segmentStart).trim();
			const preservedCandidate = assistantText.slice(preserveFrom).trim();
			const nextText = (preferStreamedClaudeTextOverResult({
				streamedText: preservedCandidate,
				finalMessageText: assistantText.slice(currentMessageStart).trim(),
				resultText: result.text
			}) ? preservedCandidate : result.text || streamedText || texts.join("\n").trim()).trim();
			const previousText = output?.text?.trim() ?? "";
			let text = nextText;
			if (previousText && nextText && previousText !== nextText && !nextText.startsWith(previousText)) text = `${previousText}\n${nextText}`;
			else if (!nextText) text = previousText;
			const syntheticNoResponse = sawClaudeSyntheticNoResponse && parsed.subtype === "success" && !text && toolTracker.pendingByIndex.size === 0 && toolTracker.startedIds.size === 0 && toolTracker.resultDeliveredIds.size === 0;
			output = {
				...result,
				text,
				...syntheticNoResponse ? {
					errorText: CLAUDE_SYNTHETIC_NO_RESPONSE_ERROR,
					terminalFailure: { reason: "synthetic_no_response" }
				} : {},
				...resumeCheckpointId ? { resumeCheckpointId } : {},
				...diagnosticUsage ? { diagnosticUsage } : {}
			};
			segmentStart = assistantText.length;
			currentMessageStart = segmentStart;
			preserveFrom = segmentStart;
			pendingMessageSeparator = false;
			sawToolUseSinceText = false;
			currentMessageHadToolUse = false;
			previousMessageHadToolUse = false;
			return;
		}
		const item = isRecord(parsed.item) ? parsed.item : null;
		if (item && typeof item.text === "string") {
			const type = normalizeLowercaseStringOrEmpty(item.type);
			if (!type || type.includes("message")) texts.push(item.text);
		}
		if (parsed.type === "stream_event" && isRecord(parsed.event)) {
			const evt = parsed.event;
			if (evt.type === "message_start") {
				beginTaggedReasoningMessage();
				pendingMessageSeparator = true;
				previousMessageHadToolUse = currentMessageHadToolUse;
				currentMessageHadToolUse = false;
			} else if (evt.type === "message_stop") finishTaggedReasoningMessage();
			const isToolUseBlockStart = evt.type === "content_block_start" && isRecord(evt.content_block) && isClaudeToolUseBlockType(evt.content_block.type);
			if (isToolUseBlockStart) {
				sawToolUseSinceText = true;
				currentMessageHadToolUse = true;
			}
			if (classifyClaudeCommentary) {
				if (isToolUseBlockStart) flushPendingClaudeCommentaryText();
				else if (evt.type === "content_block_start" || evt.type === "message_stop") flushPendingClaudeAssistantText();
			}
		}
		if (params.onThinkingDelta || params.onThinkingProgress) dispatchClaudeCliThinking({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: thinkingTracker,
			onThinkingDelta: params.onThinkingDelta,
			onThinkingProgress: params.onThinkingProgress
		});
		if (params.onToolUseStart || params.onToolResult) dispatchGeminiCliStreamingToolEvent({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: toolTracker,
			onToolUseStart: params.onToolUseStart,
			onToolResult: params.onToolResult
		});
		if (claudeStreamJson || params.onToolUseStart || params.onToolResult) dispatchClaudeCliStreamingToolEvent({
			backend: params.backend,
			providerId: params.providerId,
			parsed,
			tracker: toolTracker,
			onToolUseStart: params.onToolUseStart,
			onToolResult: params.onToolResult
		});
		const delta = parseClaudeCliStreamingDelta({
			backend: params.backend,
			providerId: params.providerId,
			parsed
		});
		if (!delta) {
			if (isGeminiStreamJsonDialect(params) && parsed.type === "message" && parsed.role === "assistant" && typeof parsed.content === "string") {
				const deltaText = parsed.content;
				if (deltaText) {
					assistantText = `${assistantText}${deltaText}`;
					params.onAssistantDelta({
						text: assistantText,
						delta: deltaText,
						sessionId,
						usage
					});
				}
			} else if (isGeminiStreamJsonDialect(params) && parsed.type === "result" && parsed.status === "success") output = {
				text: assistantText.trim(),
				sessionId,
				usage
			};
			return;
		}
		if (claudeStreamJson) {
			routeTaggedReasoningDeltas(taggedReasoningRouter.push(delta));
			return;
		}
		emitClaudeVisibleText(delta);
	};
	const handleJsonlLine = (rawLine) => {
		if (parseErrorText) return;
		const line = rawLine.trim();
		if (!line && !claudeStreamJson) return;
		rawLines += 1;
		if (rawLines > outputLimits.maxTurnLines) {
			parseErrorText = streamJsonOutputLimitErrorText("lines", outputLimits.maxTurnLines);
			lineBuffer.pending = "";
			return;
		}
		if (!line) {
			accountClaudeJsonlLine(rawLine.length);
			return;
		}
		if (handleCustomJsonlLine(line, rawLine)) return;
		const parsedRecords = decodeCliRecords(line);
		if (claudeStreamJson) {
			const normalized = parsedRecords.length === 1 ? normalizeClaudeCliStreamJsonRecord(parsedRecords[0]) : void 0;
			const retainedChars = normalized ? Math.max(normalized.line.length, rawLine.length - normalized.omittedRawChars) : rawLine.length;
			if (!accountClaudeJsonlLine(retainedChars)) return;
		}
		for (const parsed of parsedRecords) handleParsedRecord(parsed);
	};
	return {
		push(chunk) {
			if (!chunk || parseErrorText) return;
			if (!claudeStreamJson) {
				rawChars += chunk.length;
				if (rawChars > outputLimits.maxTurnRawChars) {
					parseErrorText = streamJsonOutputLimitErrorText("raw", outputLimits.maxTurnRawChars);
					lineBuffer.pending = "";
					return;
				}
			}
			if (!frameBoundedCliJsonlChunk(lineBuffer, chunk, outputLimits.maxPendingLineChars, (line) => {
				handleJsonlLine(line);
				return !parseErrorText;
			})) parseErrorText = streamJsonOutputLimitErrorText("line", outputLimits.maxPendingLineChars);
		},
		finish() {
			if (parseErrorText) return;
			const tail = lineBuffer.pending;
			lineBuffer.pending = "";
			if (tail) handleJsonlLine(tail);
			finishTaggedReasoningMessage();
			if (classifyClaudeCommentary) flushPendingClaudeAssistantText();
		},
		getErrorText() {
			return parseErrorText || null;
		},
		hasTerminalResult() {
			return sawTerminalResult;
		},
		getOutput() {
			if (parseErrorText) return {
				text: "",
				sessionId,
				usage,
				...diagnosticUsage ? { diagnosticUsage } : {},
				errorText: parseErrorText
			};
			if (output) return output;
			if (rawLines === 0) return null;
			if (sawCustomJsonlEvent) return {
				text: texts.join("\n").trim() || assistantText.trim(),
				sessionId,
				usage
			};
			if (isStreamJsonDialect(params) && assistantText.trim()) return {
				text: assistantText.trim(),
				sessionId,
				usage,
				...resumeCheckpointId ? { resumeCheckpointId } : {}
			};
			if (isGeminiStreamJsonDialect(params) && sawGeminiStructuredOutput) return {
				text: "",
				sessionId,
				usage
			};
			if (isStreamJsonDialect(params)) return {
				text: "",
				sessionId,
				usage,
				errorText: CLI_STREAM_JSON_MISSING_RESULT_ERROR
			};
			const text = texts.join("\n").trim();
			return text ? {
				text,
				sessionId,
				usage,
				...resumeCheckpointId ? { resumeCheckpointId } : {}
			} : null;
		}
	};
}
//#endregion
//#region src/agents/cli-output.ts
/**
* Parses output from CLI-backed model providers. It supports plain text, JSON,
* JSONL streaming, Claude stream-json dialects, usage metadata, and tool event
* reconstruction.
*/
function normalizeCliContextValue(value) {
	const normalized = value?.trim().replace(/\s+/g, " ");
	return normalized ? truncateUtf16Safe(normalized, 200) : void 0;
}
function formatCliOutputError(output, attribution = {}) {
	if (output.terminalFailure?.reason !== "max_turns") return output.errorText || "CLI failed.";
	const runId = normalizeCliContextValue(attribution.runId);
	const sessionId = normalizeCliContextValue(attribution.sessionId);
	const cliSessionId = normalizeCliContextValue(output.sessionId);
	const context = [
		runId ? `OpenClaw run: ${runId}.` : void 0,
		sessionId ? `OpenClaw session: ${sessionId}.` : void 0,
		cliSessionId ? `Claude session: ${cliSessionId}.` : void 0
	].filter((entry) => Boolean(entry));
	const limit = output.terminalFailure.limit;
	return [
		`Claude CLI stopped after reaching the maximum number of turns${limit ? ` (limit: ${limit})` : ""}.`,
		...context,
		"Tool actions may already have run; verify their effects before retrying.",
		"Retry with a higher --max-turns value or a narrower task."
	].join(" ");
}
/** Parses CLI backend output using the configured JSON/JSONL/plain-text mode. */
function parseCliOutput(params) {
	const outputMode = params.outputMode ?? "text";
	if (outputMode === "text") return {
		text: params.raw.trim(),
		sessionId: params.fallbackSessionId
	};
	if (outputMode === "jsonl") {
		const parser = createCliJsonlStreamingParser({
			backend: params.backend,
			providerId: params.providerId,
			parseJsonlEvent: params.parseJsonlEvent,
			onAssistantDelta: () => {}
		});
		parser.push(params.raw);
		parser.finish();
		const parsed = parser.getOutput();
		if (parsed) return parsed;
		if (isStreamJsonDialect(params)) return {
			text: "",
			sessionId: params.fallbackSessionId,
			errorText: CLI_STREAM_JSON_MISSING_RESULT_ERROR
		};
		return {
			text: params.raw.trim(),
			sessionId: params.fallbackSessionId
		};
	}
	return parseCliJson(params.raw, params.backend, params.providerId) ?? {
		text: params.raw.trim(),
		sessionId: params.fallbackSessionId
	};
}
/** Extracts a human-readable error message from mixed CLI stderr/stdout text. */
function extractCliErrorMessage(raw) {
	const parsedRecords = decodeCliRecords(raw);
	if (parsedRecords.length === 0) return null;
	let errorText = "";
	for (const parsed of parsedRecords) {
		const next = collectExplicitCliErrorText(parsed);
		if (next) errorText = next;
	}
	return errorText || null;
}
//#endregion
//#region src/agents/cli-runner/exit-error.ts
function createCliFailoverError(message, reason, context, options) {
	return new FailoverError(message, {
		reason,
		...context,
		status: resolveFailoverStatus(reason),
		...options
	});
}
function createCliExitFailoverError(params) {
	const candidates = params.candidates.map((candidate) => candidate.trim()).filter(Boolean);
	const structuredError = candidates.map((candidate) => extractCliErrorMessage(candidate)).find(Boolean) ?? null;
	const classified = [structuredError, ...candidates].flatMap((candidate) => candidate ? [coerceToFailoverError(candidate, params.context)] : []).find((error) => error !== null);
	const message = structuredError || classified?.message || candidates[0] || params.fallbackMessage;
	const reason = classified?.reason ?? (candidates.length === 0 ? params.emptyReason : void 0) ?? "unknown";
	const code = reason === "context_overflow" ? "cli_context_overflow" : candidates.length === 0 && params.retryEmptyFailure ? "cli_unknown_empty_failure" : void 0;
	return createCliFailoverError(message, reason, params.context, { code });
}
//#endregion
//#region src/agents/cli-runner/delivery-evidence.ts
const CLI_MESSAGING_DELIVERY_EVIDENCE_KEY = "cliMessagingDeliveryEvidence";
function snapshotCliMessagingDeliveryEvidence(output) {
	if (output.didSendViaMessagingTool !== true) return;
	return {
		didSendViaMessagingTool: true,
		...output.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
		...output.messagingToolSentTexts?.length ? { messagingToolSentTexts: output.messagingToolSentTexts.slice() } : {},
		...output.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: output.messagingToolSentMediaUrls.slice() } : {},
		...output.messagingToolSentTargets?.length ? { messagingToolSentTargets: output.messagingToolSentTargets.slice() } : {},
		...output.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: output.messagingToolSourceReplyPayloads.slice() } : {}
	};
}
/** Attaches confirmed delivery evidence so caller retries cannot duplicate a visible send. */
function attachCliMessagingDeliveryEvidence(error, output) {
	const evidence = snapshotCliMessagingDeliveryEvidence(output);
	if (!evidence) return error;
	if (error && typeof error === "object") try {
		Object.assign(error, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
		return error;
	} catch {}
	const wrapped = new Error(error instanceof Error ? error.message : String(error), { cause: error });
	Object.assign(wrapped, { [CLI_MESSAGING_DELIVERY_EVIDENCE_KEY]: evidence });
	return wrapped;
}
/** Reads confirmed delivery evidence from a failed CLI attempt. */
function getCliMessagingDeliveryEvidence(error) {
	if (!error || typeof error !== "object") return;
	const evidence = error[CLI_MESSAGING_DELIVERY_EVIDENCE_KEY];
	return evidence && typeof evidence === "object" ? snapshotCliMessagingDeliveryEvidence(evidence) : void 0;
}
//#endregion
export { formatCliOutputError as a, CLI_STREAM_JSON_OUTPUT_LIMITS as c, normalizeClaudeCliStreamJsonRecord as d, pickCliSessionId as f, createCliFailoverError as i, createCliJsonlStreamingParser as l, getCliMessagingDeliveryEvidence as n, parseCliOutput as o, createCliExitFailoverError as r, CLI_STREAM_JSON_DEFAULT_MAX_TURN_RAW_CHARS as s, attachCliMessagingDeliveryEvidence as t, frameBoundedCliJsonlChunk as u };
