import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import { R as ReplyPayload, f as GetReplyOptions, s as RuntimeMsgContext } from "./templating-BkMhYZzX.js";
import "./config-7RZyYa4d.js";
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: RuntimeMsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload | ReplyPayload[] | undefined>;
//#endregion
export { getReplyFromConfig as t };