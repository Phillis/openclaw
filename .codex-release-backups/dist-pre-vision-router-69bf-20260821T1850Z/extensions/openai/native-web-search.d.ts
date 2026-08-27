import { n as OpenClawConfig } from "../../types.openclaw-LvSHMCsQ.js";
import { s as StreamFn } from "../../types-BH0Q4SbZ.js";
//#region extensions/openai/native-web-search.d.ts
declare function createOpenAINativeWebSearchWrapper(baseStreamFn: StreamFn | undefined, params: {
  config?: OpenClawConfig;
  agentId?: string;
  nativeWebSearchAllowedByToolPolicy?: boolean;
}): StreamFn;
//#endregion
export { createOpenAINativeWebSearchWrapper };