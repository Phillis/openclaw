import { g as readStringValue, o as normalizeLowercaseStringOrEmpty, t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import { n as resolveProviderEndpoint, r as resolveProviderRequestCapabilities } from "./provider-attribution-iFUXefU9.js";
import { f as resolveProviderRequestPolicyConfig, o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport, s as inheritModelProviderMetadataOwners } from "./provider-request-config-DRrgUN7e.js";
import { r as loadBundledPluginPublicSurfaceModuleSync } from "./facade-runtime-CUuLg79-.js";
import { i as getModelProviderRuntimePluginHandle, m as wrapProviderSimpleCompletionStreamFn } from "./provider-hook-runtime-CveTzjDw.js";
import { N as resolveProviderTransportTurnStateWithPlugin, k as resolveProviderStreamFn } from "./provider-runtime-Drkiu7-F.js";
import "./ai-transport-host-L9Kcs5M6.js";
import { o as getModelProviderLocalService, t as attachModelProviderLocalService } from "./provider-local-service-rVF87zTk.js";
import { t as event_stream_exports } from "./event-stream-MHM-_qcK.js";
import { o as makeMissingToolResult$1, s as normalizeLegacyToolResultId, t as classifyToolUseResultPairing } from "./tool-result-pairing-DSYUlrYa.js";
import { c as hasCopilotVisionInput, o as buildCopilotDynamicHeaders } from "./copilot-dynamic-headers-C42FH9jo.js";
import { r as buildStreamErrorAssistantMessage } from "./stream-message-shared-Cyrn1UHN.js";
import { a as isThinkingLikeBlock, r as extractToolResultIds, t as extractToolCallsFromAssistant } from "./tool-call-id-DucKMMFh.js";
import { n as normalizeAllowedToolNames, t as isAllowedToolCallName } from "./tool-call-shared-BxbmRH0F.js";
import { replaceCompactionReplayOwnerContent } from "@openclaw/ai/transports";
import { configureAiTransportHost, getAiTransportHost } from "@openclaw/ai";
import { resolveModelBoundThinkingReplayMode } from "@openclaw/ai/internal/anthropic";
//#region src/agents/anthropic-vertex-stream.ts
/**
* Anthropic Vertex stream facade.
* Keeps Vertex-specific provider implementation in the bundled provider plugin
* while core imports a small stable factory.
*/
function loadAnthropicVertexStreamFacade() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: "anthropic-vertex",
		artifactBasename: "api.js"
	});
}
/** Creates an Anthropic Vertex stream function through the bundled provider facade. */
function createAnthropicVertexStreamFnForModel(model, env = process.env) {
	return loadAnthropicVertexStreamFacade().createAnthropicVertexStreamFnForModel(model, env);
}
//#endregion
//#region src/agents/custom-api-registry.ts
const CUSTOM_API_SOURCE_PREFIX = "openclaw-custom-api:";
/** Returns the registry source id used for a custom API stream function. */
function getCustomApiRegistrySourceId(api) {
	return `${CUSTOM_API_SOURCE_PREFIX}${api}`;
}
function adaptCustomStream(model, stream) {
	if (!(stream instanceof Promise)) return stream;
	const adapted = (0, event_stream_exports.createAssistantMessageEventStream)();
	(async () => {
		try {
			const resolved = await stream;
			for await (const event of resolved) adapted.push(event);
			adapted.end(await resolved.result());
		} catch (error) {
			const message = buildStreamErrorAssistantMessage({
				model,
				errorMessage: error instanceof Error ? error.message : String(error)
			});
			adapted.push({
				type: "error",
				reason: "error",
				error: message
			});
		}
	})();
	return adapted;
}
/** Registers a custom API stream function when no provider already owns it. */
function ensureCustomApiRegistered(registry, api, streamFn) {
	if (registry.getApiProvider(api)) return false;
	registry.registerApiProvider({
		api,
		stream: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options)),
		streamSimple: (model, context, options) => adaptCustomStream(model, streamFn(model, context, options))
	}, getCustomApiRegistrySourceId(api));
	return true;
}
//#endregion
//#region src/agents/replay-turn-classification.ts
/** Returns true when an assistant turn contains only provider reasoning and blank text. */
function hasOnlyAssistantReasoningContent(message) {
	if (message.role !== "assistant") return false;
	const content = Array.isArray(message.content) ? message.content : message.content != null && typeof message.content === "object" ? [message.content] : [];
	let hasThinking = false;
	for (const block of content) {
		if (!block || typeof block !== "object") return false;
		const record = block;
		if (record.type === "thinking" || record.type === "redacted_thinking") {
			hasThinking = true;
			continue;
		}
		if (record.type === "text" && typeof record.text === "string" && !record.text.trim()) continue;
		return false;
	}
	return hasThinking;
}
/** Returns true when a token-limited turn contains only incomplete provider reasoning. */
function isReasoningOnlyLengthAssistantTurn(message) {
	return message.stopReason === "length" && hasOnlyAssistantReasoningContent(message);
}
//#endregion
//#region src/agents/session-transcript-repair.ts
/**
* Transcript repair helpers for tool-call replay.
*
* Normalizes raw tool-call blocks and synthesizes missing tool results without rewriting trusted local payloads.
*/
const RAW_TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"toolUse",
	"functionCall",
	"tool_call",
	"tool_use",
	"function_call"
]);
function isRawToolCallBlock(block) {
	if (!block || typeof block !== "object") return false;
	const type = block.type;
	return typeof type === "string" && RAW_TOOL_CALL_BLOCK_TYPES.has(type);
}
function hasToolCallInput(block) {
	const hasInput = "input" in block ? block.input !== void 0 && block.input !== null : false;
	const hasArguments = "arguments" in block ? block.arguments !== void 0 && block.arguments !== null : false;
	return hasInput || hasArguments;
}
function hasToolCallId(block) {
	return hasNonEmptyString(block.id) || hasNonEmptyString(block.call_id) || hasNonEmptyString(block.toolCallId) || hasNonEmptyString(block.toolUseId) || hasNonEmptyString(block.tool_call_id) || hasNonEmptyString(block.tool_use_id);
}
function hasPartialJson(block) {
	return typeof block.partialJson === "string";
}
function isCompleteJsonObject(value) {
	return safeParseJsonRecord(value) !== void 0;
}
function isFinalizedOpenAIResponsesToolCall(message, block) {
	if (message.role !== "assistant" || !("stopReason" in message) || message.stopReason !== "toolUse" || !hasPartialJson(block) || typeof block.id !== "string" || "input" in block || !block.arguments || typeof block.arguments !== "object" || Array.isArray(block.arguments) || !isCompleteJsonObject(block.partialJson) && (block.partialJson.trim() !== "" || Object.keys(block.arguments).length > 0)) return false;
	const separator = block.id.indexOf("|");
	return separator > 0 && separator < block.id.length - 1;
}
function sanitizeToolCallBlock(block) {
	const rawName = readStringValue(block.name);
	const trimmedName = rawName?.trim();
	const hasTrimmedName = typeof trimmedName === "string" && trimmedName.length > 0;
	const normalizedName = hasTrimmedName ? trimmedName : void 0;
	const nameChanged = hasTrimmedName && rawName !== trimmedName;
	if (!nameChanged) return block;
	const next = { ...block };
	if (nameChanged && normalizedName) next.name = normalizedName;
	return next;
}
function countRawToolCallBlocks(content) {
	let count = 0;
	for (const block of content) if (isRawToolCallBlock(block)) count += 1;
	return count;
}
function isReplaySafeThinkingAssistantTurn(content, allowedToolNames) {
	let sawToolCall = false;
	const seenToolCallIds = /* @__PURE__ */ new Set();
	for (const block of content) {
		if (!isRawToolCallBlock(block)) continue;
		sawToolCall = true;
		const toolCallId = typeof block.id === "string" ? block.id.trim() : "";
		if (!hasToolCallInput(block) || hasPartialJson(block) || !toolCallId || seenToolCallIds.has(toolCallId) || !isAllowedToolCallName(block.name, allowedToolNames)) return false;
		seenToolCallIds.add(toolCallId);
		if (sanitizeToolCallBlock(block) !== block) return false;
	}
	return sawToolCall;
}
function hasSessionsSpawnAttachmentToolCall(content) {
	for (const block of content) {
		if (!isRawToolCallBlock(block) || block.name !== "sessions_spawn") continue;
		const input = block.input;
		if (!input || typeof input !== "object") continue;
		const attachments = input.attachments;
		if (Array.isArray(attachments) && attachments.length > 0) return true;
	}
	return false;
}
function makeMissingToolResult(params) {
	return makeMissingToolResult$1(params);
}
function stripToolResultDetails(messages) {
	let touched = false;
	const out = [];
	for (const msg of messages) {
		if (!msg || typeof msg !== "object" || msg.role !== "toolResult") {
			out.push(msg);
			continue;
		}
		if (!("details" in msg)) {
			out.push(msg);
			continue;
		}
		const sanitized = { ...msg };
		delete sanitized.details;
		touched = true;
		out.push(sanitized);
	}
	return touched ? out : messages;
}
function collectFollowingToolResults(messages, index) {
	const ids = /* @__PURE__ */ new Set();
	const assistant = messages[index];
	const currentToolCalls = assistant && typeof assistant === "object" && assistant.role === "assistant" ? extractToolCallsFromAssistant(assistant) : [];
	let sawNonToolResult = false;
	let displaced = false;
	for (let nextIndex = index + 1; nextIndex < messages.length; nextIndex += 1) {
		const message = messages[nextIndex];
		if (!message || typeof message !== "object") {
			sawNonToolResult = true;
			continue;
		}
		if (message.role === "assistant" && extractToolCallsFromAssistant(message).length > 0) break;
		if (message.role === "toolResult") {
			const resultIds = extractToolResultIds(normalizeLegacyToolResultId(message, currentToolCalls));
			for (const id of resultIds) ids.add(id);
			displaced ||= resultIds.length > 0 && sawNonToolResult;
			continue;
		}
		sawNonToolResult = true;
	}
	return {
		ids,
		displaced
	};
}
function repairToolCallInputs(messages, options) {
	let droppedToolCalls = 0;
	let droppedAssistantMessages = 0;
	let changed = false;
	const out = [];
	const allowedToolNames = normalizeAllowedToolNames(options?.allowedToolNames);
	const allowProviderOwnedThinkingReplay = options?.allowProviderOwnedThinkingReplay === true;
	const preservedThinkingToolCallIds = /* @__PURE__ */ new Set();
	const priorToolCallIds = /* @__PURE__ */ new Set();
	for (const [index, msg] of messages.entries()) {
		if (!msg || typeof msg !== "object") {
			changed = true;
			continue;
		}
		if (msg.role !== "assistant" || !Array.isArray(msg.content)) {
			out.push(msg);
			continue;
		}
		if (allowProviderOwnedThinkingReplay && msg.content.some((block) => isThinkingLikeBlock(block)) && countRawToolCallBlocks(msg.content) > 0) {
			const replaySafeToolCalls = extractToolCallsFromAssistant(msg);
			const followingToolResults = collectFollowingToolResults(messages, index);
			if (isReplaySafeThinkingAssistantTurn(msg.content, allowedToolNames) && replaySafeToolCalls.every((toolCall) => !preservedThinkingToolCallIds.has(toolCall.id) && (!hasSessionsSpawnAttachmentToolCall(msg.content) || followingToolResults.ids.has(toolCall.id)) && (!followingToolResults.displaced || !priorToolCallIds.has(toolCall.id)))) {
				for (const toolCall of replaySafeToolCalls) {
					preservedThinkingToolCallIds.add(toolCall.id);
					priorToolCallIds.add(toolCall.id);
				}
				changed ||= followingToolResults.displaced;
				out.push(msg);
			} else {
				droppedToolCalls += countRawToolCallBlocks(msg.content);
				droppedAssistantMessages += 1;
				changed = true;
			}
			continue;
		}
		const nextContent = [];
		let droppedInMessage = 0;
		let messageChanged = false;
		for (const block of msg.content) {
			if (isRawToolCallBlock(block)) {
				if (!hasToolCallInput(block) || !hasToolCallId(block) || !isAllowedToolCallName(block.name, allowedToolNames)) {
					droppedToolCalls += 1;
					droppedInMessage += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
			}
			let workBlock = block;
			if (isRawToolCallBlock(block) && hasPartialJson(block)) {
				if (!isFinalizedOpenAIResponsesToolCall(msg, block)) {
					droppedToolCalls += 1;
					droppedInMessage += 1;
					changed = true;
					messageChanged = true;
					continue;
				}
				const stripped = { ...block };
				delete stripped.partialJson;
				workBlock = stripped;
				changed = true;
				messageChanged = true;
			}
			if (isRawToolCallBlock(workBlock)) {
				if (RAW_TOOL_CALL_BLOCK_TYPES.has(workBlock.type ?? "")) {
					if (normalizeLowercaseStringOrEmpty(typeof workBlock.name === "string" ? workBlock.name.trim() : void 0) === "sessions_spawn") {
						const sanitized = sanitizeToolCallBlock(workBlock);
						if (sanitized !== workBlock) {
							changed = true;
							messageChanged = true;
						}
						nextContent.push(sanitized);
					} else if (typeof workBlock.name === "string") {
						const rawName = workBlock.name;
						const trimmedName = rawName.trim();
						if (rawName !== trimmedName && trimmedName) {
							const renamed = {
								...workBlock,
								name: trimmedName
							};
							nextContent.push(renamed);
							changed = true;
							messageChanged = true;
						} else nextContent.push(workBlock);
					} else nextContent.push(workBlock);
					continue;
				}
			}
			nextContent.push(workBlock);
		}
		if (droppedInMessage > 0) {
			if (nextContent.length === 0) {
				droppedAssistantMessages += 1;
				changed = true;
				continue;
			}
			const nextMessage = replaceCompactionReplayOwnerContent(msg, nextContent);
			for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
			out.push(nextMessage);
			continue;
		}
		if (messageChanged) {
			const nextMessage = replaceCompactionReplayOwnerContent(msg, nextContent);
			for (const toolCall of extractToolCallsFromAssistant(nextMessage)) priorToolCallIds.add(toolCall.id);
			out.push(nextMessage);
			continue;
		}
		for (const toolCall of extractToolCallsFromAssistant(msg)) priorToolCallIds.add(toolCall.id);
		out.push(msg);
	}
	return {
		messages: changed ? out : messages,
		droppedToolCalls,
		droppedAssistantMessages
	};
}
function sanitizeToolCallInputs(messages, options) {
	return repairToolCallInputs(messages, options).messages;
}
function sanitizeToolUseResultPairing(messages, options) {
	return repairToolUseResultPairing(messages, options).messages;
}
function sanitizeToolUseResultPairingForModel(messages, isOpenAIResponsesApi) {
	return sanitizeToolUseResultPairing(messages, {
		erroredAssistantResultPolicy: "drop",
		...isOpenAIResponsesApi ? { missingToolResultText: "aborted" } : {}
	});
}
function shouldDropErroredAssistantResults(options) {
	return options?.erroredAssistantResultPolicy === "drop";
}
function repairToolUseResultPairing(messages, options) {
	const added = [];
	const preserveUnframed = options?.preserveUnframedToolResults === true;
	const pairing = classifyToolUseResultPairing(messages, { preserveUnframedToolResults: preserveUnframed });
	const { frames } = pairing;
	const droppedDuplicateCount = pairing.droppedDuplicateCount;
	let droppedOrphanCount = pairing.droppedOrphanCount;
	const out = [];
	let cursor = 0;
	const pushUnframedRange = (endIndex) => {
		for (; cursor < endIndex; cursor += 1) {
			const message = messages[cursor];
			if (!message || typeof message !== "object") continue;
			if (message.role === "toolResult" && !preserveUnframed) {
				droppedOrphanCount += 1;
				continue;
			}
			out.push(message);
		}
	};
	for (const frame of frames) {
		pushUnframedRange(frame.startIndex);
		cursor = frame.endIndex;
		if (!(frame.failed && shouldDropErroredAssistantResults(options))) {
			out.push(frame.assistant);
			for (const occurrence of frame.occurrences) {
				if (occurrence.result) {
					out.push(occurrence.result);
					continue;
				}
				if (frame.failed) continue;
				const missing = makeMissingToolResult({
					toolCallId: occurrence.id,
					toolName: occurrence.name,
					text: options?.missingToolResultText
				});
				occurrence.result = missing;
				added.push(missing);
				out.push(missing);
			}
		}
		out.push(...frame.remainder);
	}
	pushUnframedRange(messages.length);
	const changed = out.length !== messages.length || out.some((message, index) => message !== messages[index]);
	return {
		messages: changed ? out : messages,
		added,
		droppedDuplicateCount,
		droppedOrphanCount,
		moved: changed
	};
}
//#endregion
//#region src/agents/transport-message-transform.ts
const SYNTHETIC_TOOL_RESULT_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"openclaw-anthropic-messages-transport",
	"bedrock-converse-stream",
	"google-generative-ai",
	"openclaw-google-generative-ai-transport",
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses",
	"openclaw-openai-responses-transport",
	"openclaw-openai-chatgpt-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
const OPENAI_RESPONSES_ABORTED_OUTPUT_APIS = /* @__PURE__ */ new Set([
	"openai-responses",
	"openai-chatgpt-responses",
	"azure-openai-responses",
	"openclaw-openai-responses-transport",
	"openclaw-openai-chatgpt-responses-transport",
	"openclaw-azure-openai-responses-transport"
]);
function defaultAllowSyntheticToolResults(modelApi) {
	return SYNTHETIC_TOOL_RESULT_APIS.has(modelApi);
}
function isFailedAssistantTurn(message) {
	if (message.role !== "assistant") return false;
	return message.stopReason === "error" || message.stopReason === "aborted" || isReasoningOnlyLengthAssistantTurn(message);
}
function failedAssistantHasToolCalls(message) {
	return message.role === "assistant" && (message.stopReason === "error" || message.stopReason === "aborted") && Array.isArray(message.content) && message.content.some((block) => block.type === "toolCall");
}
/** Transforms transcript messages into a provider-safe replay context. */
function transformTransportMessages(messages, model, normalizeToolCallId, options) {
	const allowSyntheticToolResults = defaultAllowSyntheticToolResults(model.api);
	const syntheticToolResultText = OPENAI_RESPONSES_ABORTED_OUTPUT_APIS.has(model.api) ? "aborted" : "No result provided";
	const toolCallIdMap = /* @__PURE__ */ new Map();
	const replayable = messages.map((msg) => {
		if (msg.role === "user") return msg;
		if (msg.role === "toolResult") {
			const normalizedId = toolCallIdMap.get(msg.toolCallId);
			return normalizedId && normalizedId !== msg.toolCallId ? {
				...msg,
				toolCallId: normalizedId
			} : msg;
		}
		if (msg.role !== "assistant") return msg;
		const modelBoundThinkingReplayMode = resolveModelBoundThinkingReplayMode({
			source: {
				provider: msg.provider,
				api: msg.api,
				modelId: msg.model,
				responseModelId: msg.responseModel
			},
			target: {
				provider: model.provider,
				api: model.api,
				modelId: model.id,
				modelParams: model.params
			}
		});
		const isSameModel = modelBoundThinkingReplayMode === "preserve" || msg.provider === model.provider && msg.api === model.api && msg.model === model.id;
		const sourceContent = Array.isArray(msg.content) ? msg.content : msg.content != null && typeof msg.content === "object" ? [msg.content] : [];
		const content = [];
		for (const block of sourceContent) {
			if (block.type === "thinking") {
				if (modelBoundThinkingReplayMode === "drop") continue;
				if (block.redacted) {
					if (isSameModel) content.push(block);
					continue;
				}
				if (isSameModel && block.thinkingSignature) {
					content.push(block);
					continue;
				}
				if (!block.thinking.trim()) continue;
				content.push(isSameModel ? block : {
					type: "text",
					text: block.thinking
				});
				continue;
			}
			if (block.type === "text") {
				content.push(isSameModel ? block : {
					type: "text",
					text: block.text
				});
				continue;
			}
			if (block.type !== "toolCall") {
				content.push(block);
				continue;
			}
			let normalizedToolCall = block;
			if (!isSameModel && block.thoughtSignature && options?.preserveCrossModelToolCallThoughtSignature !== true) {
				normalizedToolCall = { ...normalizedToolCall };
				delete normalizedToolCall.thoughtSignature;
			}
			if ((!isSameModel || options?.normalizeSameModelToolCallIds === true) && normalizeToolCallId) {
				const normalizedId = normalizeToolCallId(block.id, model, msg);
				if (normalizedId !== block.id) {
					toolCallIdMap.set(block.id, normalizedId);
					normalizedToolCall = {
						...normalizedToolCall,
						id: normalizedId
					};
				}
			}
			content.push(normalizedToolCall);
		}
		return {
			...msg,
			content
		};
	}).filter((_, index) => {
		const original = messages[index];
		if (!original) return true;
		return allowSyntheticToolResults ? !isFailedAssistantTurn(original) || failedAssistantHasToolCalls(original) : !isFailedAssistantTurn(original);
	});
	if (!allowSyntheticToolResults) return replayable;
	return repairToolUseResultPairing(replayable, {
		erroredAssistantResultPolicy: "drop",
		missingToolResultText: syntheticToolResultText,
		preserveUnframedToolResults: options?.preserveUnframedToolResults
	}).messages;
}
//#endregion
//#region src/agents/ai-transport-runtime-host.ts
let configured = false;
/** Installs the agent and plugin ports only on paths that execute provider runtime. */
function configureAiTransportRuntimeHost() {
	if (configured) return;
	const host = getAiTransportHost();
	configureAiTransportHost({
		...host,
		plugin: {
			...host.plugin,
			resolveProviderStream: (params) => resolveProviderStreamFn({
				...params,
				config: params.config,
				context: {
					...params.context,
					config: params.context.config,
					model: params.context.model
				}
			}),
			resolveTransportTurnState: (params) => resolveProviderTransportTurnStateWithPlugin({
				...params,
				config: params.config,
				runtimeHandle: getModelProviderRuntimePluginHandle(params.context.model),
				context: {
					...params.context,
					model: params.context.model
				}
			}),
			wrapSimpleCompletionStream: (params) => wrapProviderSimpleCompletionStreamFn({
				...params,
				config: params.config,
				context: {
					...params.context,
					config: params.context.config,
					model: params.context.model
				}
			}),
			createAnthropicVertexStream: createAnthropicVertexStreamFnForModel
		},
		buildCopilotDynamicHeaders: (messages) => buildCopilotDynamicHeaders({
			messages,
			hasImages: hasCopilotVisionInput(messages)
		}),
		resolveProviderEndpointClass: (baseUrl) => resolveProviderEndpoint(baseUrl).endpointClass,
		resolveProviderRequestCapabilities: (input) => resolveProviderRequestCapabilities(input),
		resolveProviderRequestHeaders: (input) => resolveProviderRequestPolicyConfig({
			...input,
			capability: "llm",
			transport: "stream"
		}).headers,
		requiresManagedTransport: (model) => {
			const request = getModelProviderRequestTransport(model);
			return Boolean(request?.proxy || request?.tls || getModelProviderLocalService(model));
		},
		inheritManagedTransport: (source, target) => inheritModelProviderMetadataOwners(source, attachModelProviderLocalService(attachModelProviderRequestTransport(target, getModelProviderRequestTransport(source)), getModelProviderLocalService(source))),
		transformTransportMessages,
		registerCustomApi: ensureCustomApiRegistered
	});
	configured = true;
}
configureAiTransportRuntimeHost();
//#endregion
export { sanitizeToolCallInputs as a, stripToolResultDetails as c, ensureCustomApiRegistered as d, createAnthropicVertexStreamFnForModel as f, repairToolUseResultPairing as i, hasOnlyAssistantReasoningContent as l, transformTransportMessages as n, sanitizeToolUseResultPairing as o, makeMissingToolResult as r, sanitizeToolUseResultPairingForModel as s, configureAiTransportRuntimeHost as t, isReasoningOnlyLengthAssistantTurn as u };
