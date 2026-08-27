import { b as StreamFn } from "./types-DKu1Bc4Q.js";
import { G as ThinkLevel } from "./hook-types-CQwktOys.js";

//#region src/llm/providers/stream-wrappers/moonshot-thinking.d.ts
type MoonshotThinkingType = "enabled" | "disabled";
type MoonshotThinkingKeep = "all";
type MoonshotPayloadFinalizer = (result: unknown, payload: Record<string, unknown>) => unknown;
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
declare function resolveMoonshotThinkingType(params: {
  configuredThinking: unknown;
  thinkingLevel?: ThinkLevel;
}): MoonshotThinkingType | undefined;
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
declare function resolveMoonshotThinkingKeep(params: {
  configuredThinking: unknown;
}): MoonshotThinkingKeep | undefined;
/** @deprecated Moonshot provider-owned stream helper; do not use from third-party plugins. */
declare function createMoonshotThinkingWrapper(baseStreamFn: StreamFn | undefined, thinkingType?: MoonshotThinkingType, thinkingKeep?: MoonshotThinkingKeep, finalizePayload?: MoonshotPayloadFinalizer): StreamFn;
//#endregion
export { resolveMoonshotThinkingKeep as n, resolveMoonshotThinkingType as r, createMoonshotThinkingWrapper as t };