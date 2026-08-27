import { i as isDeepSeekV4ModelRef } from "./models-DYOru1tw.js";
import { createDeepSeekV4OpenAICompatibleThinkingWrapper } from "openclaw/plugin-sdk/provider-stream-shared";
//#region extensions/deepseek/stream.ts
function createDeepSeekV4ThinkingWrapper(baseStreamFn, thinkingLevel) {
	return createDeepSeekV4OpenAICompatibleThinkingWrapper({
		baseStreamFn,
		thinkingLevel,
		shouldPatchModel: isDeepSeekV4ModelRef
	});
}
//#endregion
export { createDeepSeekV4ThinkingWrapper };
