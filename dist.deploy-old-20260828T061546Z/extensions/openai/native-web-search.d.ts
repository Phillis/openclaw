import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
import { c as StreamFn } from "../../agent-core-Q1SbbORG.js";
//#region extensions/openai/native-web-search.d.ts
declare function createOpenAINativeWebSearchWrapper(baseStreamFn: StreamFn | undefined, params: {
  config?: OpenClawConfig;
  agentId?: string;
  nativeWebSearchAllowedByToolPolicy?: boolean;
}): StreamFn;
//#endregion
export { createOpenAINativeWebSearchWrapper };