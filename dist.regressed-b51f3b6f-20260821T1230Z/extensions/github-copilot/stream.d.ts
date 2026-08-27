import { C as ProviderWrapStreamFnContext } from "../../types-BwmvzNiR.js";
import { Lt as StreamFn } from "../../types.public-Ca4rxCP0.js";
//#region extensions/github-copilot/stream.d.ts
declare function wrapCopilotAnthropicStream(baseStreamFn: StreamFn | undefined): StreamFn | undefined;
declare function wrapCopilotProviderStream(ctx: ProviderWrapStreamFnContext): StreamFn | undefined;
//#endregion
export { wrapCopilotAnthropicStream, wrapCopilotProviderStream };