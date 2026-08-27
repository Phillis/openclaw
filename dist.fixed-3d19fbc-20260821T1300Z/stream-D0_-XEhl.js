import { C as applyAnthropicEphemeralCacheControlMarkers, u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-Ch9sLjFi.js";
import { n as buildCopilotRuntimeHeaders } from "./runtime-identity-diY1Mqo_.js";
import { r as stripCopilotAssistantThinkingMessages } from "./replay-policy-BGQanM5B.js";
import { t as sanitizeCopilotReplayResponsePayload } from "./connection-bound-ids-Dyns8Anl.js";
//#region extensions/github-copilot/stream.ts
function containsCopilotContentType(value, type) {
	if (Array.isArray(value)) return value.some((item) => containsCopilotContentType(item, type));
	if (!value || typeof value !== "object") return false;
	const entry = value;
	return entry.type === type || containsCopilotContentType(entry.content, type);
}
function inferCopilotInitiator(messages) {
	const last = messages[messages.length - 1];
	if (!last) return "user";
	if (last.role === "user" && containsCopilotContentType(last.content, "tool_result")) return "agent";
	return last.role === "user" ? "user" : "agent";
}
function hasCopilotVisionInput(messages) {
	return messages.some((message) => {
		if (message.role === "user" && Array.isArray(message.content)) return message.content.some((item) => containsCopilotContentType(item, "image"));
		if (message.role === "toolResult" && Array.isArray(message.content)) return message.content.some((item) => containsCopilotContentType(item, "image"));
		return false;
	});
}
function buildCopilotDynamicHeaders(params) {
	return {
		...buildCopilotRuntimeHeaders(),
		"x-initiator": inferCopilotInitiator(params.messages),
		...params.hasImages ? { "Copilot-Vision-Request": "true" } : {}
	};
}
function patchOnPayloadResult(result, patchPayload = sanitizeCopilotReplayResponsePayload, fallbackPayload) {
	if (result && typeof result === "object" && "then" in result) return Promise.resolve(result).then((next) => {
		patchPayload(next === void 0 ? fallbackPayload : next);
		return next;
	});
	patchPayload(result === void 0 ? fallbackPayload : result);
	return result;
}
function buildCopilotRequestHeaders(context, headers) {
	return {
		...buildCopilotDynamicHeaders({
			messages: context.messages,
			hasImages: hasCopilotVisionInput(context.messages)
		}),
		...headers
	};
}
function normalizeCopilotAnthropicToolIds(messages) {
	const blocks = [];
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		const content = message.content;
		if (!Array.isArray(content)) continue;
		for (const block of content) {
			if (!block || typeof block !== "object") continue;
			const record = block;
			const idKey = record.type === "tool_use" ? "id" : record.type === "tool_result" ? "tool_use_id" : null;
			const rawId = idKey ? record[idKey] : void 0;
			if (idKey && typeof rawId === "string") blocks.push({
				record,
				idKey,
				rawId
			});
		}
	}
	const validId = /^[a-zA-Z0-9_-]{1,64}$/;
	const reserved = new Set(blocks.filter((block) => block.idKey === "id" && validId.test(block.rawId)).map((block) => block.rawId));
	const used = new Set(reserved);
	const claimedValid = /* @__PURE__ */ new Set();
	const pendingByRawId = /* @__PURE__ */ new Map();
	const lastResolvedByRawId = /* @__PURE__ */ new Map();
	const allocate = (rawId) => {
		if (validId.test(rawId) && !claimedValid.has(rawId)) {
			claimedValid.add(rawId);
			return rawId;
		}
		const base = rawId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) || "tool";
		if (!used.has(base)) {
			used.add(base);
			return base;
		}
		for (let occurrence = 2;; occurrence += 1) {
			const suffix = `_${occurrence}`;
			const candidate = `${base.slice(0, 64 - suffix.length)}${suffix}`;
			if (!used.has(candidate)) {
				used.add(candidate);
				return candidate;
			}
		}
	};
	for (const block of blocks) {
		if (block.idKey === "id") {
			const wireId = allocate(block.rawId);
			const pending = pendingByRawId.get(block.rawId);
			if (pending) pending.push(wireId);
			else pendingByRawId.set(block.rawId, [wireId]);
			block.record.id = wireId;
			continue;
		}
		const pending = pendingByRawId.get(block.rawId);
		const wireId = pending?.shift() ?? lastResolvedByRawId.get(block.rawId) ?? allocate(block.rawId);
		if (pending?.length === 0) pendingByRawId.delete(block.rawId);
		lastResolvedByRawId.set(block.rawId, wireId);
		block.record.tool_use_id = wireId;
	}
}
function patchCopilotAnthropicPayload(payload) {
	if (Array.isArray(payload.messages)) {
		const messages = stripCopilotAssistantThinkingMessages(payload.messages);
		payload.messages = messages;
		normalizeCopilotAnthropicToolIds(messages);
	}
	applyAnthropicEphemeralCacheControlMarkers(payload);
}
function wrapCopilotAnthropicStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	const payloadWrapper = createPayloadPatchStreamWrapper(underlying, ({ payload }) => patchCopilotAnthropicPayload(payload));
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "anthropic-messages") return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		return payloadWrapper(model, context, {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers),
			onPayload: (payload, payloadModel) => patchOnPayloadResult(originalOnPayload?.(payload, payloadModel), (replacement) => {
				if (replacement && typeof replacement === "object") patchCopilotAnthropicPayload(replacement);
			}, payload)
		});
	};
}
function wrapCopilotOpenAIResponsesStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "openai-responses") return underlying(model, context, options);
		const originalOnPayload = options?.onPayload;
		const wrappedOptions = {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers),
			onPayload: (payload, payloadModel) => {
				sanitizeCopilotReplayResponsePayload(payload);
				return patchOnPayloadResult(originalOnPayload?.(payload, payloadModel));
			}
		};
		return underlying(model, context, wrappedOptions);
	};
}
function wrapCopilotOpenAICompletionsStream(baseStreamFn) {
	if (!baseStreamFn) return;
	const underlying = baseStreamFn;
	return (model, context, options) => {
		if (model.provider !== "github-copilot" || model.api !== "openai-completions") return underlying(model, context, options);
		return underlying(model, context, {
			...options,
			headers: buildCopilotRequestHeaders(context, options?.headers)
		});
	};
}
function wrapCopilotProviderStream(ctx) {
	return wrapCopilotOpenAICompletionsStream(wrapCopilotOpenAIResponsesStream(wrapCopilotAnthropicStream(ctx.streamFn)));
}
//#endregion
export { wrapCopilotProviderStream as n, wrapCopilotAnthropicStream as t };
