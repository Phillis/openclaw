import { h as ProviderWrapStreamFnContext } from "../../types-R6eI-mj_.js";
import { s as StreamFn } from "../../index-p-0Et-9w.js";
import { t as VllmQwenThinkingFormat } from "../../thinking-policy-CIffGMGZ.js";

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