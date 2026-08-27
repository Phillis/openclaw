import { tt as CommandTurnContext } from "../templating-DzyASgcc.js";
import { fa as DispatchReplyWithBufferedBlockDispatcher, pa as DispatchReplyWithDispatcher, ua as finalizeInboundContextForSdk } from "../host-capability-types-BQXGgYpD.js";
import { m as resolveChunkMode } from "../outbound.types-d5PlQIet.js";
import { r as ReplyPayload } from "../reply-payload-3XB-UI0d.js";
import { n as generateConversationLabel } from "../conversation-label-generator-D-EANLBz.js";

//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };