import { _i as InternalGetReplyFromConfig, ci as DispatchReplyWithBufferedBlockDispatcher, di as ReplyDispatcherWithTypingOptions, fi as createReplyDispatcher, gi as CommandSessionMetadataChange, hi as DispatchReplyFromConfig, li as DispatchReplyWithDispatcher, mi as DispatchFromConfigResult, oi as finalizeInboundContextForSdk, pi as createReplyDispatcherWithTyping, si as settleReplyDispatcher, ui as ReplyDispatcherOptions, vi as InternalGetReplyOptions } from "../agent-harness-runtime-CESurA0d.js";
import { r as OpenClawConfig } from "../types.openclaw-CflOMr0r.js";
import { C as ReplyToMode } from "../types.base-AciWfV9W.js";
import "../types-DFD58Wgt.js";
import "../config-Cj6rqxXJ.js";
import { i as ReplyPayload$1 } from "../reply-payload-DrFti5n9.js";
import { y as SourceReplyDeliveryMode } from "../types-CheMd8wT.js";
import { f as UntrustedStructuredContextEntry, l as RuntimeMsgContext, m as GetReplyOptions, n as ChannelStructuredContextEntry, p as BlockReplyContext, r as FinalizedMsgContext, rt as CommandTurnContext, s as MsgContext } from "../templating-D4gA1hJr.js";
import "../deliver-types-Ccj5Ek8e.js";
import { c as ChunkMode, d as chunkMarkdownTextWithMode, f as chunkText, h as resolveTextChunkLimit, m as resolveChunkMode, p as chunkTextWithMode, u as chunkMarkdownText } from "../outbound.types-CjLqEEYw.js";
import "../deliver-contracts-DPxbngUe.js";
import { ct as ReplyDispatchBeforeDeliverOptions, ft as ReplyDispatcher, lt as ReplyDispatchKind, pt as ReplyFollowupAdmissionBarrierTimeoutPolicy } from "../hook-runner-global-BT-5aVkB.js";
import { i as ReplyPayload } from "../reply-payload-BiDTglEn.js";
import { i as isSilentReplyText, n as SILENT_REPLY_TOKEN, t as HEARTBEAT_TOKEN } from "../tokens-CLx0Aap_.js";
import { n as createInboundDebouncer, r as resolveInboundDebounceMs } from "../inbound-debounce-BS6CYEPJ.js";
import { n as isAbortRequestText, t as isBtwRequestText } from "../btw-command-CqYL5UGX.js";
import { n as generateConversationLabel, t as ConversationLabelParams } from "../conversation-label-generator-BXQ_nWKx.js";
//#region src/auto-reply/heartbeat.d.ts
/** Default prompt for heartbeat turns when config does not override it. */
declare const HEARTBEAT_PROMPT = "Follow the heartbeat monitor scratch context when provided. Recurring tasks are automations; create or change their schedules with the automations tool, not heartbeat scratch. Do not infer or repeat old tasks from prior chats. If nothing needs attention, reply NO_REPLY.";
declare const DEFAULT_HEARTBEAT_ACK_MAX_CHARS = 300;
/** Resolves configured heartbeat prompt text with the built-in default fallback. */
declare function resolveHeartbeatPromptCore(raw?: string): string;
type StripHeartbeatMode = "heartbeat" | "message";
/** Strips HEARTBEAT_OK acknowledgements and decides whether visible notification is needed. */
declare function stripHeartbeatToken(raw?: string, opts?: {
  mode?: StripHeartbeatMode;
  maxAckChars?: number;
}): {
  shouldSkip: boolean;
  text: string;
  didStrip: boolean;
};
//#endregion
//#region src/auto-reply/dispatch.d.ts
type InternalDispatchReplyOptions = Omit<InternalGetReplyOptions, "onBlockReply">;
type ReplyPayloadRunState = {
  runId?: string;
};
type DispatchInboundResult = DispatchFromConfigResult;
/** Dispatches one finalized inbound message through reply resolution and queued delivery. */
declare function dispatchInboundMessage(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
  replyPayloadRunState?: ReplyPayloadRunState;
  /** Observe-only turns run the agent without entering outbound hook stages. */
  outboundHooks?: "enabled" | "disabled";
  onSettled?: () => void | Promise<void>;
}): Promise<DispatchInboundResult>;
type BufferedInboundDispatcherParams = {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherWithTypingOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
  dispatchReplyFromConfig?: DispatchReplyFromConfig;
  onSessionMetadataChanges?: (changes: CommandSessionMetadataChange[]) => void;
};
declare function dispatchInboundMessageWithBufferedDispatcher(params: BufferedInboundDispatcherParams): Promise<DispatchInboundResult>;
/** Creates a plain dispatcher, installs global send hooks, and dispatches the inbound message. */
declare function dispatchInboundMessageWithDispatcher(params: {
  ctx: MsgContext | FinalizedMsgContext;
  cfg: OpenClawConfig;
  dispatcherOptions: ReplyDispatcherOptions;
  toolsAllow?: string[];
  replyOptions?: InternalDispatchReplyOptions;
  replyResolver?: InternalGetReplyFromConfig;
}): Promise<DispatchInboundResult>;
//#endregion
//#region src/auto-reply/group-activation.d.ts
/** Supported group activation modes. */
type GroupActivationMode = "mention" | "always";
/** Normalize a raw group activation mode string. */
declare function normalizeGroupActivation(raw?: string | null): GroupActivationMode | undefined;
/** Parse `/activation` commands from inbound message text. */
declare function parseActivationCommand(raw?: string): {
  hasCommand: boolean;
  mode?: GroupActivationMode;
};
//#endregion
//#region src/auto-reply/heartbeat-reply-payload.d.ts
/**
 * Pick the last outbound-capable reply payload for heartbeat delivery.
 *
 * Reasoning payloads are skipped using the shared SDK classifier
 * `isReasoningReplyPayload`, which recognizes the `isReasoning` flag plus the
 * common reasoning/thinking text prefixes (including lowercased and Markdown
 * blockquoted forms). Heartbeat delivery keeps separate reasoning payloads
 * internal; without this guard, a trailing reasoning payload (which reasoning
 * models can emit after the final answer) would be selected as the visible
 * heartbeat reply.
 */
declare function resolveHeartbeatReplyPayload(replyResult: ReplyPayload$1 | ReplyPayload$1[] | undefined): ReplyPayload$1 | undefined;
//#endregion
//#region src/auto-reply/reply/get-reply.d.ts
declare function getReplyFromConfig(ctx: RuntimeMsgContext, opts?: GetReplyOptions, configOverride?: OpenClawConfig): Promise<ReplyPayload$1 | ReplyPayload$1[] | undefined>;
//#endregion
//#region src/auto-reply/reply/inbound-dedupe.d.ts
declare function resetInboundDedupe(): void;
//#endregion
//#region src/auto-reply/reply/provider-dispatcher.d.ts
/** Dispatch a reply using the buffered block dispatcher path. */
declare const dispatchReplyWithBufferedBlockDispatcherCore: DispatchReplyWithBufferedBlockDispatcher;
/** Dispatch a reply using the standard dispatcher path. */
declare const dispatchReplyWithDispatcherCore: DispatchReplyWithDispatcher;
//#endregion
//#region src/auto-reply/reply/reply-reference.d.ts
/** Stateful planner for reply-to ids across one delivery flow. */
type ReplyReferencePlanner = {
  /** Returns the effective reply/thread id for the next send without updating state. */
  peek(): string | undefined;
  /** Returns the effective reply/thread id for the next send and updates state. */
  use(): string | undefined;
  /** Mark that a reply was sent (needed when no reference is used). */
  markSent(): void;
  /** Whether a reply has been sent in this flow. */
  hasReplied(): boolean;
};
/** Creates a planner that tracks whether a reply reference has already been consumed. */
declare function createReplyReferencePlanner(options: {
  replyToMode: ReplyToMode;
  /** Existing thread/reference id (preferred when allowed by replyToMode). */
  existingId?: string;
  /** Id to start a new thread/reference when allowed (e.g., parent message id). */
  startId?: string;
  /** Disable reply references entirely (e.g., when posting inside a new thread). */
  allowReference?: boolean;
  /** Seed the planner with prior reply state. */
  hasReplied?: boolean;
}): ReplyReferencePlanner;
//#endregion
export { type BlockReplyContext, type ChannelStructuredContextEntry, type ChunkMode, type CommandTurnContext, type ConversationLabelParams, DEFAULT_HEARTBEAT_ACK_MAX_CHARS, type FinalizedMsgContext, type GetReplyOptions, HEARTBEAT_PROMPT, HEARTBEAT_TOKEN, type MsgContext, type ReplyDispatchBeforeDeliverOptions, type ReplyDispatchKind, type ReplyDispatcher, type ReplyDispatcherOptions, type ReplyDispatcherWithTypingOptions, type ReplyFollowupAdmissionBarrierTimeoutPolicy, type ReplyPayload, SILENT_REPLY_TOKEN, type SourceReplyDeliveryMode, type UntrustedStructuredContextEntry, chunkMarkdownText, chunkMarkdownTextWithMode, chunkText, chunkTextWithMode, createInboundDebouncer, createReplyDispatcher, createReplyDispatcherWithTyping, createReplyReferencePlanner, dispatchInboundMessage, dispatchInboundMessageWithBufferedDispatcher, dispatchInboundMessageWithDispatcher, dispatchReplyWithBufferedBlockDispatcherCore as dispatchReplyWithBufferedBlockDispatcher, dispatchReplyWithDispatcherCore as dispatchReplyWithDispatcher, finalizeInboundContextForSdk as finalizeInboundContext, generateConversationLabel, getReplyFromConfig, isAbortRequestText, isBtwRequestText, isSilentReplyText, normalizeGroupActivation, parseActivationCommand, resetInboundDedupe, resolveChunkMode, resolveHeartbeatPromptCore, resolveHeartbeatReplyPayload, resolveInboundDebounceMs, resolveTextChunkLimit, settleReplyDispatcher, stripHeartbeatToken };