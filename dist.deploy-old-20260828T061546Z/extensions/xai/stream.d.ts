import { S as ProviderWrapStreamFnContext } from "../../runtime-api-B8urSeFb.js";
import { c as StreamFn } from "../../index-Q1SbbORG.js";
import "../../agent-core-CmZwnml7.js";
//#region extensions/xai/stream.d.ts
declare function wrapXaiProviderStream(ctx: ProviderWrapStreamFnContext, runtime?: {
  clientVersion?: string;
}): StreamFn | undefined;
//#endregion
export { wrapXaiProviderStream };