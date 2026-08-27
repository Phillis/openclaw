import { b as setQwenChatTemplateThinking, m as isOpenAICompatibleThinkingEnabled, r as composeProviderStreamWrappers, u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-8IapgNRS.js";
import { d as normalizeProviderId } from "./provider-model-shared-Br4ZCuuk.js";
import { n as resolveVllmQwenThinkingFormatFromCompat } from "./thinking-policy-DTJgaIHg.js";
//#region extensions/vllm/stream.ts
function isVllmProviderId(providerId) {
	return normalizeProviderId(providerId) === "vllm";
}
function resolveVllmQwenThinkingFormat(ctx) {
	return resolveVllmQwenThinkingFormatFromCompat(ctx.model?.compat);
}
function isVllmNemotronModel(model) {
	return model.api === "openai-completions" && typeof model.provider === "string" && normalizeProviderId(model.provider) === "vllm" && typeof model.id === "string" && /\bnemotron-3(?:[-_](?:nano|super|ultra))?\b/i.test(model.id);
}
function setNemotronThinkingOffChatTemplateKwargs(payload) {
	const defaults = {
		enable_thinking: false,
		force_nonempty_content: true
	};
	const existing = payload.chat_template_kwargs;
	payload.chat_template_kwargs = existing && typeof existing === "object" && !Array.isArray(existing) ? {
		...defaults,
		...existing
	} : defaults;
}
function createVllmQwenThinkingWrapper(params) {
	return createPayloadPatchStreamWrapper(params.baseStreamFn, ({ payload: payloadObj, options }) => {
		const enableThinking = isOpenAICompatibleThinkingEnabled({
			thinkingLevel: params.thinkingLevel,
			options
		});
		if (params.format === "chat-template") setQwenChatTemplateThinking(payloadObj, enableThinking);
		else payloadObj.enable_thinking = enableThinking;
		delete payloadObj.reasoning_effort;
		delete payloadObj.reasoningEffort;
		delete payloadObj.reasoning;
	}, { shouldPatch: ({ model }) => model.api === "openai-completions" && (model.reasoning ?? true) });
}
function wrapVllmProviderStream(ctx) {
	if (!isVllmProviderId(ctx.provider) || ctx.model && ctx.model.api !== "openai-completions") return;
	const qwenFormat = resolveVllmQwenThinkingFormat(ctx);
	const shouldHandleNemotron = ctx.thinkingLevel === "off" && isVllmNemotronModel({
		api: "openai-completions",
		provider: ctx.provider,
		id: ctx.modelId
	});
	if (!qwenFormat && !shouldHandleNemotron) return;
	return composeProviderStreamWrappers(ctx.streamFn, qwenFormat && ((streamFn) => createVllmQwenThinkingWrapper({
		baseStreamFn: streamFn,
		format: qwenFormat,
		thinkingLevel: ctx.thinkingLevel
	})), (streamFn) => createPayloadPatchStreamWrapper(streamFn, ({ payload }) => setNemotronThinkingOffChatTemplateKwargs(payload), { shouldPatch: ({ model }) => model.api === "openai-completions" && ctx.thinkingLevel === "off" && isVllmNemotronModel(model) }));
}
//#endregion
export { wrapVllmProviderStream as n, createVllmQwenThinkingWrapper as t };
