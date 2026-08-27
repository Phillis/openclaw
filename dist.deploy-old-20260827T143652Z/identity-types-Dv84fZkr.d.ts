import { O as OutboundMediaAccess } from "./types.core-CgEwvJMs.js";
import { _ as ReplyPayload } from "./types-CoqV37wL.js";
import { _t as ReplyToMode, gt as MarkdownTableMode, n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
import { n as PollInput } from "./polls-CfHkU59X.js";
import { t as ChannelId } from "./channel-id.types-DjYEl-_2.js";

//#region src/infra/outbound/send-deps.d.ts
/**
 * Dynamic bag of per-channel send functions, keyed by channel ID.
 * Each outbound adapter resolves its own function from this record and
 * falls back to a direct import when the key is absent.
 */
type OutboundSendDeps = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/channels/message/types.d.ts
/** Capability names a channel must advertise before core can rely on durable final delivery. */
declare const durableFinalDeliveryCapabilities: readonly ["text", "media", "poll", "payload", "silent", "replyTo", "thread", "nativeQuote", "messageSendingHooks", "batch", "reconcileUnknownSend", "afterSendSuccess", "afterCommit"];
/** Durable final delivery capability key understood by message-channel adapters. */
type DurableFinalDeliveryCapability = (typeof durableFinalDeliveryCapabilities)[number];
/** Capability map used by adapters to declare which final-send guarantees they support. */
type DurableFinalDeliveryRequirementMap = Partial<Record<DurableFinalDeliveryCapability, boolean>>;
/** Raw platform result shape normalized into a message receipt. */
type MessageReceiptSourceResult = {
  channel?: string;
  messageId?: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  toJid?: string;
  pollId?: string;
  timestamp?: number;
  meta?: Record<string, unknown>;
};
/** Logical part kind for multi-part rendered messages. */
type MessageReceiptPartKind = "text" | "media" | "voice" | "poll" | "card" | "preview" | "unknown";
/** One platform message produced by a logical outbound send. */
type MessageReceiptPart = {
  platformMessageId: string;
  kind: MessageReceiptPartKind;
  index: number;
  threadId?: string;
  replyToId?: string;
  raw?: MessageReceiptSourceResult;
};
/** Normalized receipt for all platform messages that make up a logical send. */
type MessageReceipt = {
  primaryPlatformMessageId?: string;
  platformMessageIds: string[];
  parts: MessageReceiptPart[];
  threadId?: string;
  replyToId?: string;
  editToken?: string;
  deleteToken?: string;
  sentAt: number;
  raw?: readonly MessageReceiptSourceResult[];
};
/** Render-plan item category used before adapter-specific send execution. */
type RenderedMessageBatchPlanKind = "text" | "media" | "voice" | "presentation" | "interactive" | "channelData" | "empty";
/** Render plan for a single reply payload after text/media/presentation splitting. */
type RenderedMessageBatchPlanItem = {
  index: number;
  kinds: readonly RenderedMessageBatchPlanKind[];
  text?: string;
  mediaUrls: readonly string[];
  audioAsVoice?: boolean;
  presentationBlockCount?: number;
  hasInteractive?: boolean;
  hasChannelData?: boolean;
};
/** Aggregate render plan for a batch of reply payloads. */
type RenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
/** Common text-send context shared by text, media, payload, and poll adapter calls. */
type ChannelMessageSendTextContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  to: string;
  text: string;
  accountId?: string | null;
  deps?: OutboundSendDeps;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
  signal?: AbortSignal;
  gatewayClientScopes?: readonly string[]; /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string; /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number; /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number; /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string; /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>; /** @internal Report each completed platform sub-send before another fallible step. */
  onDeliveryResult?: (result: ChannelMessageSendResult) => Promise<void> | void;
};
/** Media send context with validated access hooks and media presentation hints. */
type ChannelMessageSendMediaContext<TConfig = OpenClawConfig> = ChannelMessageSendTextContext<TConfig> & {
  mediaUrl: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
};
/** Rich reply payload send context used when adapters can consume structured payloads. */
type ChannelMessageSendPayloadContext<TConfig = OpenClawConfig> = ChannelMessageSendTextContext<TConfig> & {
  payload: ReplyPayload;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  audioAsVoice?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
};
/** Poll send context; thread ids stay string-like because poll APIs do not accept numeric ids. */
type ChannelMessageSendPollContext<TConfig = OpenClawConfig> = Omit<ChannelMessageSendTextContext<TConfig>, "text" | "threadId"> & {
  poll: PollInput;
  threadId?: string | null;
  isAnonymous?: boolean;
};
/** Adapter send result normalized to a receipt plus optional legacy message id. */
type ChannelMessageSendResult = {
  receipt: MessageReceipt;
  messageId?: string;
};
/** Concrete send shapes an adapter can reconcile after an unknown platform outcome. */
declare const unknownSendReconciliationKinds: readonly ["text", "media", "payload", "poll", "batch"];
type UnknownSendReconciliationKind = (typeof unknownSendReconciliationKinds)[number];
/** Send-attempt context tagged with the adapter method core is about to call. */
type ChannelMessageSendAttemptContext<TConfig = OpenClawConfig> = (ChannelMessageSendTextContext<TConfig> & {
  kind: "text";
}) | (ChannelMessageSendMediaContext<TConfig> & {
  kind: "media";
}) | (ChannelMessageSendPayloadContext<TConfig> & {
  kind: "payload";
}) | (ChannelMessageSendPollContext<TConfig> & {
  kind: "poll";
});
/** Lifecycle context emitted after an adapter send succeeds but before commit finishes. */
type ChannelMessageSendSuccessContext<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = ChannelMessageSendAttemptContext<TConfig> & {
  result: TSendResult;
  attemptToken?: unknown;
};
/** Lifecycle context emitted after an adapter send throws or rejects. */
type ChannelMessageSendFailureContext<TConfig = OpenClawConfig> = ChannelMessageSendAttemptContext<TConfig> & {
  error: unknown;
  attemptToken?: unknown;
};
/** Lifecycle context emitted when a successful send is being durably committed. */
type ChannelMessageSendCommitContext<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = ChannelMessageSendSuccessContext<TConfig, TSendResult>;
/** Durable queue context used to reconcile a send whose platform state is unknown. */
type ChannelMessageUnknownSendContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  queueId: string;
  channel: string;
  to: string;
  accountId?: string | null;
  enqueuedAt: number;
  retryCount: number;
  platformSendStartedAt?: number; /** Canonical reply target persisted after hooks and before platform I/O. */
  effectiveReplyToId?: string | null;
  payloads: readonly ReplyPayload[];
  renderedBatchPlan?: RenderedMessageBatchPlan;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  threadId?: string | number | null;
  silent?: boolean;
};
/** Adapter verdict for whether an unknown queued send reached the platform. */
type ChannelMessageUnknownSendReconciliationResult = {
  status: "sent";
  receipt: MessageReceipt;
  messageId?: string;
} | {
  status: "not_sent";
} | {
  status: "unresolved";
  error?: string;
  retryable?: boolean;
};
/** Provider decision made before core persists or replays a deferred delivery. */
type ChannelMessageDeferredDeliveryAdmissionResult = {
  status: "allowed";
} | {
  status: "permanent_rejection";
  reason: string;
};
/** Minimal context available at deferred-delivery admission boundaries. */
type ChannelMessageDeferredDeliveryAdmissionContext<TConfig = OpenClawConfig> = {
  cfg: TConfig;
  channel: string;
  to: string;
  accountId?: string | null;
  phase: "live" | "recovery";
};
/** Optional hooks around adapter send attempts, platform success/failure, and commit. */
type ChannelMessageSendLifecycleAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  beforeSendAttempt?: (ctx: ChannelMessageSendAttemptContext<TConfig>) => unknown;
  afterSendSuccess?: (ctx: ChannelMessageSendSuccessContext<TConfig, TSendResult>) => Promise<void> | void;
  afterSendFailure?: (ctx: ChannelMessageSendFailureContext<TConfig>) => Promise<void> | void;
  afterCommit?: (ctx: ChannelMessageSendCommitContext<TConfig, TSendResult>) => Promise<void> | void;
};
/** Adapter methods a message channel can implement for outbound text/media/payload/poll sends. */
type ChannelMessageSendAdapter<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  text?: (ctx: ChannelMessageSendTextContext<TConfig>) => Promise<TSendResult>;
  media?: (ctx: ChannelMessageSendMediaContext<TConfig>) => Promise<TSendResult>;
  payload?: (ctx: ChannelMessageSendPayloadContext<TConfig>) => Promise<TSendResult>;
  poll?: (ctx: ChannelMessageSendPollContext<TConfig>) => Promise<TSendResult>;
  lifecycle?: ChannelMessageSendLifecycleAdapter<TConfig, TSendResult>;
};
/** Durable final-delivery extension for queue reconciliation and capability declaration. */
type ChannelMessageDurableFinalAdapter = {
  capabilities?: DurableFinalDeliveryRequirementMap; /** Opt into provider reconciliation for ordinary single-payload queued sends. */
  automaticUnknownSendReconciliation?: boolean;
  /**
   * Synchronous provider admission before a durable intent is created or replayed.
   * Providers must not perform I/O from this hook.
   */
  admitDeferredDelivery?: (ctx: ChannelMessageDeferredDeliveryAdmissionContext) => ChannelMessageDeferredDeliveryAdmissionResult; /** Send shapes for which reconciliation can prove the complete durable intent. */
  reconcileUnknownSendKinds?: Partial<Record<UnknownSendReconciliationKind, boolean>>;
  reconcileUnknownSend?: (ctx: ChannelMessageUnknownSendContext) => Promise<ChannelMessageUnknownSendReconciliationResult | null> | ChannelMessageUnknownSendReconciliationResult | null; /** Cleanup after core authoritatively retires an ambiguous send as failed. */
  afterUnknownSendTerminal?: (ctx: ChannelMessageUnknownSendContext) => Promise<void> | void;
};
/** Live-message feature key declared by adapters that support preview or streaming behavior. */
type ChannelMessageLiveCapability = "draftPreview" | "previewFinalization" | "progressUpdates" | "nativeStreaming" | "quietFinalization";
/** Capability keys for turning a preview into a final platform message. */
declare const livePreviewFinalizerCapabilities: readonly ["finalEdit", "normalFallback", "discardPending", "previewReceipt", "retainOnAmbiguousFailure"];
/** Finalizer capability key understood by live-message adapters. */
type LivePreviewFinalizerCapability = (typeof livePreviewFinalizerCapabilities)[number];
/** Capability map for preview finalization behavior. */
type LivePreviewFinalizerCapabilityMap = Partial<Record<LivePreviewFinalizerCapability, boolean>>;
/** Adapter shape for finalizing live previews. */
type ChannelMessageLiveFinalizerAdapterShape = {
  capabilities?: LivePreviewFinalizerCapabilityMap;
};
/** Adapter shape for live preview and streaming message features. */
type ChannelMessageLiveAdapterShape = {
  capabilities?: Partial<Record<ChannelMessageLiveCapability, boolean>>;
  finalizer?: ChannelMessageLiveFinalizerAdapterShape;
};
/** Receive acknowledgement timing policy for durable inbound message records. */
type ChannelMessageReceiveAckPolicy = "after_receive_record" | "after_agent_dispatch" | "after_durable_send" | "manual";
/** Adapter receive shape for default and supported inbound acknowledgement policies. */
type ChannelMessageReceiveAdapterShape = {
  defaultAckPolicy?: ChannelMessageReceiveAckPolicy;
  supportedAckPolicies?: readonly ChannelMessageReceiveAckPolicy[];
};
/** Full message adapter shape composed from send, durable-final, live, and receive facets. */
type ChannelMessageAdapterShape<TConfig = OpenClawConfig, TSendResult extends ChannelMessageSendResult = ChannelMessageSendResult> = {
  id?: string;
  durableFinal?: ChannelMessageDurableFinalAdapter;
  send?: ChannelMessageSendAdapter<TConfig, TSendResult>;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
//#endregion
//#region src/infra/outbound/deliver-types.d.ts
/** Successful channel send result normalized for core delivery accounting. */
type OutboundDeliveryResult = {
  channel: ChannelId;
  messageId: string;
  chatId?: string;
  channelId?: string;
  roomId?: string;
  conversationId?: string;
  timestamp?: number;
  toJid?: string;
  pollId?: string;
  receipt?: MessageReceipt;
  meta?: Record<string, unknown>;
};
/** Reason a payload was intentionally not sent after normalization or hooks. */
type OutboundPayloadDeliverySuppressionReason = "cancelled_by_message_sending_hook" | "cancelled_by_reply_payload_sending_hook" | "empty_after_message_sending_hook" | "empty_after_reply_payload_sending_hook" | "no_visible_payload" | "adapter_returned_no_identity";
/** Delivery phase where a failure occurred. */
type OutboundDeliveryFailureStage = "platform_send" | "queue" | "unknown";
type OutboundPayloadDeliveryKind = "text" | "media" | "other";
/** Per-payload delivery status emitted to callers and channel send summaries. */
type OutboundPayloadDeliveryOutcome = {
  index: number;
  status: "sent";
  results: OutboundDeliveryResult[]; /** Effective post-hook, post-render payload kind. */
  deliveryKind?: OutboundPayloadDeliveryKind;
} | {
  index: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
} | {
  index: number;
  status: "failed";
  error: unknown;
  sentBeforeError: boolean;
  stage: OutboundDeliveryFailureStage; /** Identified platform sends from this payload before its terminal failure. */
  results?: OutboundDeliveryResult[]; /** Effective post-hook, post-render payload kind when platform delivery began. */
  deliveryKind?: OutboundPayloadDeliveryKind;
};
//#endregion
//#region src/auto-reply/chunk.d.ts
type TextChunkProvider = ChannelId;
/**
 * Chunking mode for outbound messages:
 * - "length": Split only when exceeding textChunkLimit (default)
 * - "newline": Prefer breaking on "soft" boundaries. Historically this split on every
 *   newline; now it only breaks on paragraph boundaries (blank lines) unless the text
 *   exceeds the length limit.
 */
type ChunkMode = "length" | "newline";
declare function resolveTextChunkLimit(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null, opts?: {
  fallbackLimit?: number;
}): number;
declare function resolveChunkMode(cfg: OpenClawConfig | undefined, provider?: TextChunkProvider, accountId?: string | null): ChunkMode;
/**
 * Split text on newlines, trimming line whitespace.
 * Blank lines are folded into the next non-empty line as leading "\n" prefixes.
 * Long lines can be split by length (default) or kept intact via splitLongLines:false.
 */
declare function chunkByNewline(text: string, maxLineLength: number, opts?: {
  splitLongLines?: boolean;
  trimLines?: boolean;
  isSafeBreak?: (index: number) => boolean;
}): string[];
/**
 * Unified chunking function that dispatches based on mode.
 */
declare function chunkTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkMarkdownTextWithMode(text: string, limit: number, mode: ChunkMode): string[];
declare function chunkText(text: string, limit: number): string[];
declare function chunkMarkdownText(text: string, limit: number): string[];
//#endregion
//#region src/infra/outbound/formatting.d.ts
/**
 * Formatting and chunking hints carried through outbound delivery planning.
 */
type OutboundDeliveryFormattingOptions = {
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  parseMode?: "HTML";
};
//#endregion
//#region src/infra/outbound/identity-types.d.ts
/** Agent identity metadata that outbound channels can render with a message. */
type OutboundIdentity = {
  name?: string;
  avatarUrl?: string;
  emoji?: string;
  theme?: string;
};
//#endregion
export { OutboundSendDeps as _, chunkMarkdownTextWithMode as a, resolveChunkMode as c, OutboundPayloadDeliveryOutcome as d, OutboundPayloadDeliverySuppressionReason as f, RenderedMessageBatchPlanItem as g, MessageReceipt as h, chunkMarkdownText as i, resolveTextChunkLimit as l, ChannelMessageUnknownSendReconciliationResult as m, OutboundDeliveryFormattingOptions as n, chunkText as o, ChannelMessageAdapterShape as p, chunkByNewline as r, chunkTextWithMode as s, OutboundIdentity as t, OutboundDeliveryResult as u };