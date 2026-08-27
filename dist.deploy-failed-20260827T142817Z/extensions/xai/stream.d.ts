import { h as ProviderWrapStreamFnContext } from "../../types-R6eI-mj_.js";
import { s as StreamFn } from "../../index-p-0Et-9w.js";
//#region extensions/xai/stream.d.ts
declare function wrapXaiProviderStream(ctx: ProviderWrapStreamFnContext, runtime?: {
  clientVersion?: string;
}): StreamFn | undefined;
//#endregion
export { wrapXaiProviderStream };