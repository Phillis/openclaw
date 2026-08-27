import { l as usesBasetenChatTemplateThinking } from "./models-u5dtUSfP.js";
import { asNonArrayRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createPayloadPatchStreamWrapper, normalizeOpenAICompatibleReasoningReplay } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/baseten/stream.ts
const BASETEN_DEEPSEEK_V4_MODEL_ID = "deepseek-ai/deepseek-v4-pro";
function isThinkingEnabled(level) {
	return level !== void 0 && level !== "off";
}
function isBasetenDeepSeekV4ModelId(modelId) {
	return modelId.trim().toLowerCase() === BASETEN_DEEPSEEK_V4_MODEL_ID;
}
/** Adds Baseten's `chat_template_args.enable_thinking` without dropping caller args. */
function createBasetenThinkingWrapper(ctx) {
	return createPayloadPatchStreamWrapper(ctx.streamFn, ({ payload, model }) => {
		if (model.provider !== "baseten" || model.api !== "openai-completions") return;
		if (isBasetenDeepSeekV4ModelId(model.id)) normalizeOpenAICompatibleReasoningReplay(payload, {
			thinkingEnabled: ctx.thinkingLevel !== "off",
			stripAssistantMessagesOnly: true,
			replaceNullReasoningContent: true
		});
		if (!usesBasetenChatTemplateThinking(model.id)) return;
		payload.chat_template_args = {
			...asNonArrayRecord(payload.chat_template_args),
			enable_thinking: isThinkingEnabled(ctx.thinkingLevel)
		};
	});
}
//#endregion
export { createBasetenThinkingWrapper };
