import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { f as asSafeIntegerInRange, s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { u as readStringField } from "./record-coerce-DItp3I4t.js";
import { gt as normalizeUsage } from "./session-accessor-CIiPoGwM.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-harness-runtime-DrXbITHA.js";
import { ut as isJsonObject } from "./shared-client-fWU6PNZb.js";
import "./text-utility-runtime-BSdEoze8.js";
//#region extensions/codex/src/app-server/attempt-notifications.ts
/**
* Predicates and readers for Codex app-server notification envelopes.
*/
const CODEX_TURN_ABORT_MARKER_START = "<turn_aborted>";
const CODEX_TURN_ABORT_MARKER_END = "</turn_aborted>";
/** Builds compact activity metadata for watchdog and diagnostic updates. */
function describeNotificationActivity(notification) {
	if (!isJsonObject(notification.params)) return { lastNotificationMethod: notification.method };
	if (notification.method !== "rawResponseItem/completed") return { lastNotificationMethod: notification.method };
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	if (!item) return { lastNotificationMethod: notification.method };
	return {
		lastNotificationMethod: notification.method,
		lastNotificationItemId: readStringField(item, "id"),
		lastNotificationItemType: readStringField(item, "type"),
		lastNotificationItemRole: readStringField(item, "role"),
		lastAssistantTextPreview: readRawAssistantTextPreview(item)
	};
}
/** Tracks active app-server item ids from item start/completion notifications. */
function updateActiveTurnItemIds(notification, activeItemIds) {
	if (notification.method !== "item/started" && notification.method !== "item/completed") return;
	const itemId = readNotificationItemId(notification);
	if (!itemId) return;
	if (notification.method === "item/started") {
		activeItemIds.add(itemId);
		return;
	}
	activeItemIds.delete(itemId);
}
function updateActiveCompletionBlockerItemIds(notification, activeItemIds) {
	if (notification.method !== "item/started" && notification.method !== "item/completed") return;
	const itemId = readNotificationItemId(notification);
	if (!itemId) return;
	if (notification.method === "item/completed") {
		activeItemIds.delete(itemId);
		return;
	}
	const item = readCodexNotificationItem(notification.params);
	if (item && isCompletionBlockingItem(item)) activeItemIds.add(itemId);
}
function isCompletionBlockingItem(item) {
	switch (item.type) {
		case "collabAgentToolCall":
		case "commandExecution":
		case "dynamicToolCall":
		case "fileChange":
		case "imageGeneration":
		case "imageView":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
function isCompletedAssistantNotification(notification) {
	if (!isJsonObject(notification.params)) return false;
	if (notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readStringField(item, "type") === "agentMessage" && readStringField(item, "phase") !== "commentary");
}
/** Returns true for completed app-server reasoning items. */
function isReasoningItemCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readStringField(item, "type") === "reasoning" : false;
}
/** Returns true for completed assistant commentary items. */
function isAssistantCommentaryCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "item/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readStringField(item, "type") === "agentMessage" && readStringField(item, "phase") === "commentary");
}
/** Returns true for completed raw response reasoning items. */
function isRawReasoningCompletionNotification(notification) {
	if (!isJsonObject(notification.params) || notification.method !== "rawResponseItem/completed") return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readStringField(item, "type") === "reasoning" : false;
}
/** Returns true for streamed app-server reasoning progress. */
function isReasoningProgressNotification(notification) {
	return notification.method === "item/reasoning/textDelta" || notification.method === "item/reasoning/summaryTextDelta" || notification.method === "item/reasoning/summaryPartAdded";
}
/** Returns true when assistant completion can release the short idle watch. */
function isAssistantCompletionReleaseNotification(notification, turnCrossedToolHandoff) {
	if (isCompletedAssistantNotification(notification)) return true;
	return !turnCrossedToolHandoff && isRawAssistantCompletionNotification(notification);
}
/** Returns true when a notification proves assistant output is still active. */
function shouldDisarmAssistantCompletionIdleWatch(notification) {
	if (!isJsonObject(notification.params)) return false;
	if (notification.method === "item/started") return true;
	if (notification.method === "item/agentMessage/delta") return true;
	return false;
}
/** Reads an item id from supported notification envelope shapes. */
function readNotificationItemId(notification) {
	if (!isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return (item ? readStringField(item, "id") : void 0) ?? readStringField(notification.params, "itemId") ?? readStringField(notification.params, "id");
}
/** Detects completion for an OpenClaw dynamic tool result still awaited by Codex. */
function isPendingOpenClawDynamicToolCompletionNotification(notification, pendingOpenClawDynamicToolCompletionIds) {
	if (notification.method !== "item/completed" || !isJsonObject(notification.params)) return false;
	const itemId = readNotificationItemId(notification);
	if (!itemId || !pendingOpenClawDynamicToolCompletionIds.has(itemId)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	const itemType = item ? readStringField(item, "type") : void 0;
	return itemType === void 0 || itemType === "dynamicToolCall";
}
/** Returns true for raw response tool-output completion notifications. */
function isRawToolOutputCompletionNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	switch (item ? readStringField(item, "type") : void 0) {
		case "custom_tool_call_output":
		case "function_call_output": return true;
		default: return false;
	}
}
function isRawFunctionToolOutputCompletionNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return item ? readStringField(item, "type") === "function_call_output" : false;
}
/** Returns true for progress on Codex-native tool item types. */
function isNativeToolProgressNotification(notification) {
	if (notification.method !== "item/started" && notification.method !== "item/completed" && notification.method !== "item/updated") return false;
	if (!isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	switch (item ? readStringField(item, "type") : void 0) {
		case "commandExecution":
		case "fileChange":
		case "mcpToolCall":
		case "webSearch": return true;
		default: return false;
	}
}
/** Returns true for file-change patch update notifications. */
function isFileChangePatchUpdatedNotification(notification) {
	return notification.method === "item/fileChange/patchUpdated" && isJsonObject(notification.params);
}
/** Returns true for raw assistant message progress with readable text. */
function isRawAssistantProgressNotification(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readStringField(item, "type") === "message" && readStringField(item, "role") === "assistant" && readRawAssistantTextPreview(item));
}
/** Returns true for raw assistant completion outside commentary phase. */
function isRawAssistantCompletionNotification(notification) {
	if (!isRawAssistantProgressNotification(notification) || !isJsonObject(notification.params)) return false;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	return Boolean(item && readStringField(item, "phase") !== "commentary");
}
function readRawAssistantTextPreview(item) {
	if (readStringField(item, "role") !== "assistant" || !Array.isArray(item.content)) return;
	const text = item.content.flatMap((content) => {
		if (!isJsonObject(content)) return [];
		const contentText = readStringField(content, "text");
		return contentText ? [contentText] : [];
	}).join("\n").trim();
	if (!text) return;
	return text.length > 240 ? `${truncateUtf16Safe(text, 237)}...` : text;
}
/** Returns true for app-server error notifications that will retry. */
function isRetryableErrorNotification(value) {
	return isJsonObject(value) && value.willRetry === true;
}
/** Returns true for terminal app-server thread status strings. */
function isTerminalTurnStatus(status) {
	return status === "completed" || status === "interrupted" || status === "failed";
}
/**
* Detects Codex's synthetic interrupted-turn marker while ignoring the current
* user prompt echoed through raw response events.
*/
function isCodexTurnAbortMarkerNotification(notification, options = {}) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return false;
	const item = notification.params.item;
	const role = isJsonObject(item) ? readStringField(item, "role") : void 0;
	if (!isJsonObject(item) || readStringField(item, "type") !== "message" || role !== "user" && role !== "developer") return false;
	const text = extractRawResponseItemText(item).trim();
	const currentPromptTexts = [options.currentPromptText, ...options.currentPromptTexts ?? []].filter(isNonEmptyString).map((prompt) => prompt.trim());
	if (role === "user" && currentPromptTexts.includes(text)) return false;
	return readCodexTurnAbortMarkerBody(text) !== void 0;
}
function readCodexTurnAbortMarkerBody(text) {
	if (!text.startsWith(CODEX_TURN_ABORT_MARKER_START) || !text.endsWith(CODEX_TURN_ABORT_MARKER_END)) return;
	return text.slice(14, -15).trim();
}
function extractRawResponseItemText(item) {
	const content = item.content;
	if (!Array.isArray(content)) return "";
	return content.flatMap((entry) => {
		if (!isJsonObject(entry)) return [];
		const type = readStringField(entry, "type");
		if (type !== "input_text" && type !== "text") return [];
		const text = readStringField(entry, "text");
		return text ? [text] : [];
	}).join("");
}
/** Reads a typed Codex item from notification params when id/type are present. */
function readCodexNotificationItem(params) {
	if (!isJsonObject(params) || !isJsonObject(params.item)) return;
	const item = params.item;
	return typeof item.id === "string" && typeof item.type === "string" ? item : void 0;
}
/** Reads the stable call id from a model-emitted raw tool item. */
function readRawResponseToolCallId(notification) {
	if (notification.method !== "rawResponseItem/completed" || !isJsonObject(notification.params)) return;
	const item = isJsonObject(notification.params.item) ? notification.params.item : void 0;
	if (!item) return;
	switch (readStringField(item, "type")) {
		case "custom_tool_call":
		case "function_call":
		case "local_shell_call":
		case "tool_search_call": return readStringField(item, "call_id");
		case "image_generation_call":
		case "web_search_call": return readStringField(item, "id");
		default: return;
	}
}
/** Maps Codex item types to the tool name shown in execution progress. */
function codexExecutionToolName(item) {
	if (item.type === "dynamicToolCall" && typeof item.tool === "string") return item.tool;
	if (item.type === "mcpToolCall" && typeof item.tool === "string") {
		const server = typeof item.server === "string" && item.server ? item.server : void 0;
		return server ? `${server}.${item.tool}` : item.tool;
	}
	if (item.type === "commandExecution") return "bash";
	if (item.type === "fileChange") return "apply_patch";
	if (item.type === "webSearch") return "web_search";
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-usage.ts
function readTokenCount(record, key) {
	return asSafeIntegerInRange(record[key], { min: 0 });
}
function readCodexThreadTokenUsage(params) {
	const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
	const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
	return last ? normalizeCodexThreadTokenUsage(last) : void 0;
}
function readCodexThreadContextSnapshot(params) {
	const tokenUsage = isJsonObject(params.tokenUsage) ? params.tokenUsage : void 0;
	const last = tokenUsage && isJsonObject(tokenUsage.last) ? tokenUsage.last : void 0;
	const modelContextWindow = tokenUsage ? readTokenCount(tokenUsage, "modelContextWindow") : void 0;
	const activeContextTokens = last ? readTokenCount(last, "totalTokens") : void 0;
	const inputTokens = last ? readTokenCount(last, "inputTokens") : void 0;
	const cachedInputTokens = last ? readTokenCount(last, "cachedInputTokens") : void 0;
	const cacheWriteInputTokens = last ? readTokenCount(last, "cacheWriteInputTokens") : void 0;
	const outputTokens = last ? readTokenCount(last, "outputTokens") : void 0;
	const reasoningOutputTokens = last ? readTokenCount(last, "reasoningOutputTokens") : void 0;
	return {
		...activeContextTokens !== void 0 ? { activeContextTokens } : {},
		...cachedInputTokens !== void 0 ? { cachedInputTokens } : {},
		...cacheWriteInputTokens !== void 0 ? { cacheWriteInputTokens } : {},
		...inputTokens !== void 0 ? { inputTokens } : {},
		...modelContextWindow && modelContextWindow > 0 ? { modelContextWindow } : {},
		...outputTokens !== void 0 ? { outputTokens } : {},
		...inputTokens !== void 0 ? { promptTokens: inputTokens } : {},
		...reasoningOutputTokens !== void 0 ? { reasoningOutputTokens } : {}
	};
}
function projectCodexThreadUsageUpdate(params, currentUsage, applyUsage, emitContext) {
	applyUsage(readCodexThreadTokenUsage(params) ?? currentUsage);
	const context = readCodexThreadContextSnapshot(params);
	if (Object.keys(context).length > 0) emitContext(context);
}
function normalizeCodexThreadTokenUsage(record) {
	return normalizeCodexTokenUsageBreakdown(record, "thread");
}
function normalizeCodexResponseTokenUsage(record) {
	return normalizeCodexTokenUsageBreakdown(record, "response");
}
function normalizeCodexTokenUsageBreakdown(record, source) {
	const readCount = source === "response" ? readTokenCount : (value, key) => asFiniteNumber(value[key]);
	const totalTokens = readCount(record, "totalTokens");
	const inputTokens = readCount(record, "inputTokens");
	const cacheRead = readCount(record, "cachedInputTokens");
	const output = readCount(record, "outputTokens");
	const reasoningTokens = readCount(record, "reasoningOutputTokens");
	const cacheWrite = record.cacheWriteInputTokens === void 0 && source === "response" ? 0 : readCount(record, "cacheWriteInputTokens");
	if (source === "response" && (totalTokens === void 0 || inputTokens === void 0 || cacheRead === void 0 || cacheWrite === void 0 || output === void 0 || reasoningTokens === void 0 || cacheRead + cacheWrite > inputTokens || totalTokens !== inputTokens + output)) return;
	const usage = normalizeUsage({
		input: inputTokens === void 0 ? void 0 : Math.max(0, inputTokens - (cacheRead ?? 0) - (cacheWrite ?? 0)),
		output,
		cacheRead,
		cacheWrite,
		reasoningTokens,
		total: totalTokens
	});
	if (!usage) return;
	return {
		...usage,
		contextUsage: source === "response" && inputTokens !== void 0 && totalTokens !== void 0 ? {
			state: "available",
			promptTokens: inputTokens,
			totalTokens
		} : { state: "unavailable" }
	};
}
var CodexResponseCompletionProjection = class {
	constructor() {
		this.responseIds = /* @__PURE__ */ new Set();
	}
	get modelIterations() {
		return this.responseIds.size;
	}
	clear() {
		this.usage = void 0;
	}
	record(params) {
		const responseId = readStringField(params, "responseId");
		if (responseId) this.responseIds.add(responseId);
		const usage = isJsonObject(params.usage) ? params.usage : void 0;
		this.usage = usage ? normalizeCodexResponseTokenUsage(usage) : void 0;
	}
};
//#endregion
export { readRawResponseToolCallId as C, updateActiveTurnItemIds as E, readNotificationItemId as S, updateActiveCompletionBlockerItemIds as T, isReasoningItemCompletionNotification as _, codexExecutionToolName as a, isTerminalTurnStatus as b, isAssistantCompletionReleaseNotification as c, isNativeToolProgressNotification as d, isPendingOpenClawDynamicToolCompletionNotification as f, isRawToolOutputCompletionNotification as g, isRawReasoningCompletionNotification as h, readCodexThreadContextSnapshot as i, isCodexTurnAbortMarkerNotification as l, isRawFunctionToolOutputCompletionNotification as m, normalizeCodexResponseTokenUsage as n, describeNotificationActivity as o, isRawAssistantProgressNotification as p, projectCodexThreadUsageUpdate as r, isAssistantCommentaryCompletionNotification as s, CodexResponseCompletionProjection as t, isFileChangePatchUpdatedNotification as u, isReasoningProgressNotification as v, shouldDisarmAssistantCompletionIdleWatch as w, readCodexNotificationItem as x, isRetryableErrorNotification as y };
