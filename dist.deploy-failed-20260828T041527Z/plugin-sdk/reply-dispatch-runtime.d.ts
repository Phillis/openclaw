import { ci as DispatchReplyWithBufferedBlockDispatcher, li as DispatchReplyWithDispatcher, oi as finalizeInboundContextForSdk } from "../agent-harness-runtime-CESurA0d.js";
import { rt as CommandTurnContext } from "../templating-D4gA1hJr.js";
import { m as resolveChunkMode } from "../outbound.types-CjLqEEYw.js";
import { i as ReplyPayload } from "../reply-payload-BiDTglEn.js";
import { n as generateConversationLabel } from "../conversation-label-generator-BXQ_nWKx.js";
//#region src/plugin-sdk/reply-dispatch-runtime.d.ts
/** Dispatches a reply with buffered block support after lazy-loading the runtime dispatcher. */
declare const dispatchReplyWithBufferedBlockDispatcher: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatches a reply through the provider dispatcher after lazy-loading runtime code. */
declare const dispatchReplyWithDispatcher: DispatchReplyWithDispatcher;
//#endregion
export { type CommandTurnContext, type DispatchReplyWithBufferedBlockDispatcher, type DispatchReplyWithDispatcher, type ReplyPayload, dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, resolveChunkMode };