import { C as ProviderWrapStreamFnContext } from "../../types-7E39v2Gx.js";
import { Lt as StreamFn } from "../../types.public-B49gnGnS.js";
//#region extensions/github-copilot/stream.d.ts
declare function wrapCopilotAnthropicStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapCopilotAnthropicStream, wrapCopilotProviderStream };