import { S as ProviderWrapStreamFnContext } from "../../runtime-api-B8urSeFb.js";
import { c as StreamFn } from "../../index-Q1SbbORG.js";
import "../../agent-core-CmZwnml7.js";
import { t as VllmQwenThinkingFormat } from "../../thinking-policy-S8m1kTa5.js";
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