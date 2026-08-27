import { a as createDeepSeekV4OpenAICompatibleThinkingWrapper, l as createOpenAICompatibleCompletionsThinkingOffWrapper, r as composeProviderStreamWrappers, u as createPayloadPatchStreamWrapper } from "./provider-stream-shared-8IapgNRS.js";
import { r as isOpencodeGoKimiNoReasoningModelId } from "./provider-catalog-DzZhDE6c.js";
import { t as isOpencodeGoFixedAnthropicReasoningModelId } from "./provider-policy-api-DgyFUSEt.js";
import { t as stripOpencodeGoKimiReasoningPayload } from "./reasoning-sanitizer-BA49xp2a.js";
import { n as OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT, r as createOpencodeGoStalledStreamWrapper, t as OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT } from "./stream-termination-CUQgFrxq.js";
//#region extensions/opencode-go/stream.ts
function createOpencodeGoWrapper(baseStreamFn, thinkingLevel) {
	if (!baseStreamFn) return;
	return createOpencodeGoStalledStreamWrapper(composeProviderStreamWrappers(baseStreamFn, (streamFn) => streamFn ? createPayloadPatchStreamWrapper(streamFn, ({ payload }) => stripOpencodeGoKimiReasoningPayload(payload), { shouldPatch: ({ model }) => model.provider === "opencode-go" && isOpencodeGoKimiNoReasoningModelId(model.id) }) : void 0, (streamFn) => {
		if (!streamFn) return;
		const thinkingOff = createOpenAICompatibleCompletionsThinkingOffWrapper(streamFn, thinkingLevel);
		return (model, context, options) => model.provider === "opencode-go" && model.id === "kimi-k3" ? thinkingOff(model, context, options) : streamFn(model, context, options);
	}, (streamFn) => streamFn ? createPayloadPatchStreamWrapper(streamFn, ({ payload }) => {
		delete payload.thinking;
		delete payload.output_config;
	}, { shouldPatch: ({ model }) => model.provider === "opencode-go" && isOpencodeGoFixedAnthropicReasoningModelId(model.id) }) : void 0, (streamFn) => createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn: streamFn,
		thinkingLevel,
		shouldPatchModel: (model) => model.provider === "opencode-go" && model.id === "deepseek-v4-flash",
		resolveReasoningEffort: (level) => level === "low" ? "low" : level === "max" ? "max" : "high"
	}) ?? streamFn, (streamFn) => createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn: streamFn,
		thinkingLevel,
		shouldPatchModel: (model) => model.provider === "opencode-go" && model.id === "deepseek-v4-pro"
	}) ?? streamFn) ?? baseStreamFn, {
		provider: "opencode-go",
		idleTimeoutMs: OPENCODE_GO_STREAM_IDLE_TIMEOUT_MS_DEFAULT,
		firstEventTimeoutMs: OPENCODE_GO_STREAM_FIRST_EVENT_TIMEOUT_MS_DEFAULT
	});
}
//#endregion
export { createOpencodeGoWrapper as t };
