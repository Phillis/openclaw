import { S as ProviderWrapStreamFnContext } from "../../runtime-api-IAhSVA75.js";
import { c as StreamFn } from "../../index-Q1SbbORG.js";
import "../../agent-core-CmZwnml7.js";
import { t as VllmQwenThinkingFormat } from "../../thinking-policy-ClxuLaSb.js";
//#region extensions/vllm/stream.d.ts
type VllmThinkingLevel = ProviderWrapStreamFnContext["thinkingLevel"];
declare function createVllmQwenThinkingWrapper(params: {
  baseStreamFn: StreamFn | undefined;
  format: VllmQwenThinkingFormat;
  thinkingLevel: VllmThinkingLevel;
}): StreamFn;
declare function wrapVllmProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { createVllmQwenThinkingWrapper, wrapVllmProviderStream };