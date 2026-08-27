import { ci as DispatchReplyWithBufferedBlockDispatcher, li as DispatchReplyWithDispatcher, oi as finalizeInboundContextForSdk } from "../agent-harness-runtime-D3DJE4wK.js";
import { rt as CommandTurnContext } from "../templating-tHzj-d8O.js";
import { m as resolveChunkMode } from "../outbound.types-0KyfFtcR.js";
import { i as ReplyPayload } from "../reply-payload-BQTBO3cM.js";
import { n as generateConversationLabel } from "../conversation-label-generator-XjzW4KVi.js";
//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };