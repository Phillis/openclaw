import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { P as ReplyPayload, S as GetReplyOptions, s as RuntimeMsgContext } from "./templating-CbdZP_k6.js";
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: RuntimeMsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };