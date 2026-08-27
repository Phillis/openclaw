import { isMiMoReasoningModelRef } from "./thinking.js";
import { createDeepSeekV4OpenAICompatibleThinkingWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/xiaomi/stream.ts
function createMiMoThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: isMiMoReasoningModelRef
	});
}
//#endregion
export { createMiMoThinkingWrapper };
