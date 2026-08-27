import { isQwenTokenPlanDeepSeekV4ModelId, isQwenTokenPlanGlmModelId, isQwenTokenPlanKimiModelId, isQwenTokenPlanThinkingOnlyModelId, supportsQwenTokenPlanGlmMaxThinking } from "./models.js";
import { asOptionalRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { streamSimple } from "openclaw/plugin-sdk/llm";
import { normalizeProviderId } from "openclaw/plugin-sdk/provider-model-shared";
import { createPayloadPatchStreamWrapper, isOpenAICompatibleThinkingEnabled, normalizeOpenAICompatibleReasoningReplay, setQwenChatTemplateThinking } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/qwen/stream.ts
function resolveQwenThinkingLevel(thinkingLevel, options) {
	const runtimeOptions = options ?? {};
	const raw = runtimeOptions.reasoningEffort ?? runtimeOptions.reasoning ?? thinkingLevel;
	if (typeof raw !== "string") return thinkingLevel;
	const normalized = raw.trim().toLowerCase();
	if (normalized === "none") return "off";
	switch (normalized) {
		case "off":
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
		case "max": return normalized;
		default: return thinkingLevel;
	}
}
function isQwenProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "qwen" || normalized === "qwen-token-plan" || normalized === "bailian-token-plan" || normalized === "modelstudio" || normalized === "qwencloud" || normalized === "dashscope";
}
function isQwenTokenPlanProviderId(providerId) {
	const normalized = normalizeProviderId(providerId);
	return normalized === "qwen-token-plan" || normalized === "bailian-token-plan";
}
function resolveQwenTokenPlanThinkingContract(providerId, modelId) {
	if (!isQwenTokenPlanProviderId(providerId)) return;
	if (isQwenTokenPlanDeepSeekV4ModelId(modelId)) return { family: "deepseek-v4" };
	if (isQwenTokenPlanKimiModelId(modelId)) return { family: "kimi" };
	if (isQwenTokenPlanGlmModelId(modelId)) return {
		family: "glm",
		supportsMax: supportsQwenTokenPlanGlmMaxThinking(modelId)
	};
}
function patchTokenPlanDeepSeekV4Payload(payload, thinkingLevel, enableThinking) {
	delete payload.thinking;
	if (!enableThinking) {
		delete payload.reasoning_effort;
		normalizeOpenAICompatibleReasoningReplay(payload, { thinkingEnabled: false });
		return;
	}
	payload.reasoning_effort = thinkingLevel === "xhigh" || thinkingLevel === "max" ? "max" : "high";
	normalizeOpenAICompatibleReasoningReplay(payload, { thinkingEnabled: true });
}
function patchTokenPlanKimiPayload(payload, enableThinking) {
	delete payload.thinking;
	delete payload.reasoning_effort;
	if (enableThinking) normalizeOpenAICompatibleReasoningReplay(payload, {
		thinkingEnabled: true,
		shouldBackfillAssistantMessage: (message) => Array.isArray(message.tool_calls) && message.tool_calls.length > 0
	});
}
function normalizeTokenPlanThinkingToolChoice(payload, enableThinking, forceThinking) {
	if (!enableThinking) return false;
	const toolChoice = payload.tool_choice;
	const toolChoiceType = asOptionalRecord(toolChoice)?.type;
	if (toolChoiceType === "auto" || toolChoiceType === "none") {
		payload.tool_choice = toolChoiceType;
		return true;
	}
	if (toolChoice == null || toolChoice === "auto" || toolChoice === "none") return true;
	if (!forceThinking && (toolChoiceType === "tool" || toolChoiceType === "function")) {
		payload.enable_thinking = false;
		return false;
	}
	payload.tool_choice = "auto";
	return true;
}
function enforceQwenTokenPlanPayloadAfterCaller(payload, tokenPlanContract, forceThinking, requestedEnableThinking, requestedThinkingLevel) {
	const hasPayloadThinking = typeof payload.enable_thinking === "boolean";
	let enableThinking = forceThinking || (hasPayloadThinking ? payload.enable_thinking !== false : requestedEnableThinking);
	const rawThinkingLevel = typeof payload.reasoning_effort === "string" ? payload.reasoning_effort : hasPayloadThinking ? void 0 : requestedThinkingLevel;
	if (!forceThinking && rawThinkingLevel === "off") enableThinking = false;
	payload.enable_thinking = enableThinking;
	enableThinking = normalizeTokenPlanThinkingToolChoice(payload, enableThinking, forceThinking);
	if (tokenPlanContract?.family === "deepseek-v4") patchTokenPlanDeepSeekV4Payload(payload, rawThinkingLevel === "xhigh" || rawThinkingLevel === "max" ? "max" : "high", enableThinking);
	else if (tokenPlanContract?.family === "kimi") patchTokenPlanKimiPayload(payload, enableThinking);
	else if (tokenPlanContract?.family === "glm") {
		if (Array.isArray(payload.tools) && payload.tools.length > 0) payload.tool_stream = true;
		if (rawThinkingLevel === "none" && enableThinking) delete payload.thinking;
		else patchTokenPlanGlmPayload(payload, typeof rawThinkingLevel === "string" ? resolveQwenThinkingLevel(rawThinkingLevel, void 0) : void 0, enableThinking, tokenPlanContract.supportsMax);
	} else {
		delete payload.thinking;
		delete payload.reasoning_effort;
	}
	delete payload.reasoningEffort;
	delete payload.reasoning;
}
function finalizeQwenTokenPlanPayloadAfterCaller(value, fallbackPayload, tokenPlanContract, forceThinking, requestedEnableThinking, requestedThinkingLevel) {
	const finalPayload = asOptionalRecord(value) ?? fallbackPayload;
	if (finalPayload) enforceQwenTokenPlanPayloadAfterCaller(finalPayload, tokenPlanContract, forceThinking, requestedEnableThinking, requestedThinkingLevel);
	return value;
}
function createQwenTokenPlanConstraintWrapper(baseStreamFn, tokenPlanContract, forceThinking, thinkingLevel) {
	const underlying = baseStreamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.api !== "openai-completions" || !model.reasoning && !forceThinking) return underlying(model, context, options);
		const requestedThinkingLevel = resolveQwenThinkingLevel(thinkingLevel, options);
		const requestedEnableThinking = forceThinking || isOpenAICompatibleThinkingEnabled({
			thinkingLevel,
			options
		});
		const originalOnPayload = options?.onPayload;
		return underlying(model, context, {
			...options,
			onPayload(payload, payloadModel) {
				const payloadObj = asOptionalRecord(payload);
				const result = originalOnPayload?.(payload, payloadModel);
				if (result && typeof result.then === "function") return Promise.resolve(result).then((resolved) => finalizeQwenTokenPlanPayloadAfterCaller(resolved, payloadObj, tokenPlanContract, forceThinking, requestedEnableThinking, requestedThinkingLevel));
				return finalizeQwenTokenPlanPayloadAfterCaller(result, payloadObj, tokenPlanContract, forceThinking, requestedEnableThinking, requestedThinkingLevel);
			}
		});
	};
}
function patchTokenPlanGlmPayload(payload, thinkingLevel, enableThinking, supportsMax) {
	delete payload.thinking;
	if (!enableThinking) {
		delete payload.reasoning_effort;
		return;
	}
	switch (thinkingLevel) {
		case "minimal":
		case "low":
		case "medium":
		case "high":
		case "xhigh":
			payload.reasoning_effort = thinkingLevel;
			return;
		case "max":
			payload.reasoning_effort = supportsMax ? "max" : "xhigh";
			return;
		default: delete payload.reasoning_effort;
	}
}
function readQwenThinkingFormatFromModel(model) {
	if (model.api !== "openai-completions") return;
	const compat = model.compat && typeof model.compat === "object" ? model.compat : void 0;
	return typeof compat?.thinkingFormat === "string" ? compat.thinkingFormat : void 0;
}
function createQwenThinkingWrapper(baseStreamFn, thinkingLevel, thinkingFormat, forceThinking = false, tokenPlanContract) {
	return createPayloadPatchStreamWrapper(baseStreamFn, ({ payload: payloadObj, model, options }) => {
		const effectiveThinkingLevel = resolveQwenThinkingLevel(thinkingLevel, options);
		const enableThinking = forceThinking || isOpenAICompatibleThinkingEnabled({
			thinkingLevel,
			options
		});
		if ((thinkingFormat ?? readQwenThinkingFormatFromModel(model)) === "qwen-chat-template") {
			setQwenChatTemplateThinking(payloadObj, enableThinking);
			delete payloadObj.enable_thinking;
		} else payloadObj.enable_thinking = enableThinking;
		if (tokenPlanContract?.family === "deepseek-v4") patchTokenPlanDeepSeekV4Payload(payloadObj, effectiveThinkingLevel, enableThinking);
		else if (tokenPlanContract?.family === "kimi") patchTokenPlanKimiPayload(payloadObj, false);
		else if (tokenPlanContract?.family === "glm") patchTokenPlanGlmPayload(payloadObj, effectiveThinkingLevel, enableThinking, tokenPlanContract.supportsMax);
		else delete payloadObj.reasoning_effort;
		delete payloadObj.reasoningEffort;
		delete payloadObj.reasoning;
	}, { shouldPatch: ({ model }) => model.api === "openai-completions" && (model.reasoning || forceThinking) });
}
function wrapQwenProviderStream(ctx) {
	if (!isQwenProviderId(ctx.provider) || ctx.model && ctx.model.api !== "openai-completions") return;
	const thinkingFormat = ctx.model ? readQwenThinkingFormatFromModel(ctx.model) : void 0;
	const explicitLegacyThinkingFormat = normalizeProviderId(ctx.provider) === "bailian-token-plan" && thinkingFormat !== void 0;
	if (explicitLegacyThinkingFormat && thinkingFormat !== "qwen-chat-template") return ctx.streamFn;
	const tokenPlanContract = explicitLegacyThinkingFormat ? void 0 : resolveQwenTokenPlanThinkingContract(ctx.provider, ctx.modelId);
	const useTokenPlanConstraints = isQwenTokenPlanProviderId(ctx.provider) && !explicitLegacyThinkingFormat && thinkingFormat === void 0;
	const forceThinking = useTokenPlanConstraints && isQwenTokenPlanThinkingOnlyModelId(ctx.modelId);
	let streamFn = createQwenThinkingWrapper(ctx.streamFn, ctx.thinkingLevel, thinkingFormat, forceThinking, tokenPlanContract);
	if (useTokenPlanConstraints) streamFn = createQwenTokenPlanConstraintWrapper(streamFn, tokenPlanContract, forceThinking, ctx.thinkingLevel);
	return streamFn;
}
//#endregion
export { createQwenThinkingWrapper, wrapQwenProviderStream };
