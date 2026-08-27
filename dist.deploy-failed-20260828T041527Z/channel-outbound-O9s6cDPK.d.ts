import { ba as DurableMessageSendContextParams, va as DurableMessageBatchSendResult, ya as DurableMessageSendContext } from "./agent-harness-runtime-CESurA0d.js";
import { r as OpenClawConfig } from "./types.openclaw-CflOMr0r.js";
import { A as StreamingMode } from "./types.base-AciWfV9W.js";
import "./types.core-CMY5bxhQ.js";
import { D as ChannelProgressDraftLineInput, E as ChannelProgressDraftLine, O as ChannelProgressLineOptions, w as AgentPlanStep } from "./templating-D4gA1hJr.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-B-h0E9Du.js";
import { S as MessageReceipt, T as MessageReceiptSourceResult, _ as DurableFinalDeliveryRequirementMap, a as ChannelMessageLiveCapability, b as LivePreviewFinalizerCapability, c as ChannelMessageSendMediaContext, f as ChannelMessageSendTextContext, g as DurableFinalDeliveryCapability, h as DeriveDurableFinalDeliveryRequirementsParams, i as ChannelMessageLiveAdapterShape, l as ChannelMessageSendPayloadContext, n as ChannelMessageAdapterShape, o as ChannelMessageReceiveAckPolicy, s as ChannelMessageReceiveAdapterShape, t as ChannelMessageAdapter, u as ChannelMessageSendPollContext, w as MessageReceiptPartKind } from "./types-DoOzdtUM.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./outbound.types-CjLqEEYw.js";
import "./deliver-contracts-DPxbngUe.js";
import "./reply-pipeline-CU7H6UOX.js";
import { J as ChannelIngressQueue, Q as ChannelIngressQueuePruneOptions } from "./runtime-types-CiajX9Q2.js";
import { r as durable_delivery_d_exports } from "./durable-delivery-BM4hRPB5.js";
import "./ingress-monitor-BJ19dTr1.js";
import "./draft-stream-controls-DtMtEbts.js";
import "./runtime-forwarders-B_SOGAqL.js";
//#region src/channels/message/outbound-echo.d.ts
type OutboundMessageIdentityScope = {
  channel: string;
  accountId?: string;
  conversationId: string;
};
type OutboundMessageIdentity = OutboundMessageIdentityScope & ({
  messageId: string;
  sourceId?: string;
} | {
  messageId?: string;
  sourceId: string;
});
/** Records a platform message id emitted by a channel's own outbound send path. */
declare function recordOutboundMessageIdentity(identity: OutboundMessageIdentity): void;
/** Returns whether an inbound platform message matches a recently emitted outbound id. */
declare function isRecentOutboundMessageIdentity(identity: OutboundMessageIdentity): boolean;
//#endregion
//#region src/channels/message/ingress-errors.d.ts
/** Named ingress error factory shared by channel payload and admission failures. */
type ChannelIngressErrorClass<TError extends Error, TArgs extends unknown[]> = {
  new (...args: TArgs): TError;
  readonly name: string;
  readonly prototype: TError;
};
declare function createChannelIngressError(name: string): ChannelIngressErrorClass<Error, [message: string, options?: ErrorOptions]>;
declare function createChannelIngressError<TReason extends string>(name: string, options: {
  withReason: true;
}): ChannelIngressErrorClass<Error & {
  readonly reason: TReason;
}, [reason: TReason, message: string, errorOptions?: ErrorOptions]>;
//#endregion
//#region src/channels/message/ingress-claim-owner.d.ts
declare const INGRESS_CLAIM_PROCESS_ID: string;
declare function processPidFromOwnerId(ownerId: string): number;
//#endregion
//#region src/channels/typing-lifecycle.d.ts
type AsyncTick = () => Promise<void> | void;
type TypingKeepaliveLoop = {
  tick: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
};
/** Creates a cancellable keepalive loop for channel typing indicators. */
declare function createTypingKeepaliveLoop(params: {
  intervalMs: number;
  onTick: AsyncTick;
}): TypingKeepaliveLoop;
//#endregion
//#region src/channels/draft-streaming-chunking.d.ts
type ChannelDraftStreamingChunking = {
  minChars: number;
  maxChars: number;
  breakPreference: "paragraph" | "newline" | "sentence";
};
declare function resolveChannelDraftStreamingChunking(cfg: OpenClawConfig | undefined, channelId: ChannelId, accountId: string | null | undefined, opts: {
  fallbackLimit: number;
}): ChannelDraftStreamingChunking;
//#endregion
//#region src/channels/progress-draft-diffstat.d.ts
type ChannelProgressDraftDiffStat = Readonly<{
  files: number;
  added: number;
  removed: number;
}>;
//#endregion
//#region src/channels/progress-draft-events.d.ts
type ChannelProgressDraftEventLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftEventLineBuilder = (input: ChannelProgressDraftLineInput, options?: ChannelProgressLineOptions) => ChannelProgressDraftEventLine | undefined;
//#endregion
//#region src/channels/progress-work-counter.d.ts
/**
 * Per-turn work counters for live channel progress surfaces. These describe the
 * turn while it runs; nothing here survives into the finished transcript.
 */
declare function createChannelProgressWorkCounter(params?: {
  now?: () => number;
}): {
  noteToolCall(toolName?: string): void;
  reset(): void;
  readonly toolCalls: number;
  readonly elapsedSeconds: number;
};
//#endregion
//#region src/channels/progress-draft-compositor.d.ts
type ChannelProgressDraftMode = StreamingMode;
type ChannelProgressDraftCompositorLine = string | ChannelProgressDraftLine;
type ChannelProgressDraftCompositorSnapshot = Readonly<{
  lines: readonly ChannelProgressDraftCompositorLine[];
  statusHeadline?: string;
  plan?: readonly AgentPlanStep[];
  planExplanation?: string;
  diffStat?: ChannelProgressDraftDiffStat;
}>;
type ChannelProgressDraftUpdateOptions = {
  flush?: boolean;
  lines?: readonly ChannelProgressDraftCompositorLine[];
};
/** Creates a stateful compositor for one streaming channel reply. */
declare function createChannelProgressDraftCompositor(params: {
  entry: StreamingCompatEntry | null | undefined;
  mode: ChannelProgressDraftMode;
  active: boolean;
  seed: string;
  update: (text: string, options?: ChannelProgressDraftUpdateOptions) => Promise<boolean | void> | boolean | void;
  deleteCurrent?: () => Promise<void> | void;
  tryNativeUpdate?: (text: string) => Promise<boolean> | boolean;
  /** Publish when structured lines change even if the rendered text does not. */
  updateOnLineChange?: boolean;
  /**
   * Set when the channel renders `update`'s structured `lines` itself, so the
   * composed text carries only the status block (label, headline, checklist).
   */
  rendersRollingLinesNatively?: boolean;
  formatLine?: (line: string) => string;
  isEmptyLine?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  shouldStartNow?: (line: ChannelProgressDraftCompositorLine | undefined) => boolean;
  reasoningLinePrefix?: string;
  commentaryLinePrefix?: string;
  reasoningGate?: boolean;
  commentaryItalics?: boolean;
  now?: () => number;
  setTimeoutFn?: typeof setTimeout;
  clearTimeoutFn?: typeof clearTimeout;
  /** Channel-specific formatter policy; event/lifecycle ownership remains in the compositor. */
  buildProgressEventLine?: ChannelProgressDraftEventLineBuilder;
}): {
  pushPlanProgress(steps?: AgentPlanStep[], options?: {
    explanation?: string;
  }): Promise<boolean>;
  pushPreambleHeadline(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
  pushNarrationProgress(text?: string): Promise<boolean>;
  pushReasoningProgress(text?: string, options?: {
    snapshot?: boolean;
  }): Promise<boolean>;
  pushCommentaryProgress(text?: string, options?: {
    itemId?: string;
  }): Promise<boolean>;
  pushToolEvent: (payload: {
    name?: string | undefined;
    phase?: string | undefined;
    toolCallId?: string | undefined;
    args?: Record<string, unknown> | undefined;
    itemId?: string | undefined;
  } & {
    detailMode?: "explain" | "raw";
  }) => Promise<boolean>;
  pushItemEvent: (payload: Omit<{
    meta?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    status?: string | undefined;
    phase?: string | undefined;
    summary?: string | undefined;
    toolCallId?: string | undefined;
    itemId?: string | undefined;
    itemKind?: string | undefined;
    progressText?: string | undefined;
    commandBearing?: boolean | undefined;
  }, "itemKind"> & {
    kind?: string;
  }) => Promise<boolean>;
  pushApprovalEvent: (payload: {
    message?: string | undefined;
    title?: string | undefined;
    reason?: string | undefined;
    phase?: string | undefined;
    command?: string | undefined;
  }) => Promise<boolean>;
  pushCommandOutputEvent: (payload: {
    title?: string | undefined;
    name?: string | undefined;
    status?: string | undefined;
    phase?: string | undefined;
    toolCallId?: string | undefined;
    itemId?: string | undefined;
    exitCode?: number | null | undefined;
  }) => Promise<boolean>;
  pushPatchEvent: (payload: {
    title?: string | undefined;
    name?: string | undefined;
    phase?: string | undefined;
    summary?: string | undefined;
    modified?: string[] | undefined;
    added?: string[] | undefined;
    deleted?: string[] | undefined;
    toolCallId?: string | undefined;
    itemId?: string | undefined;
  }) => Promise<boolean>;
  previewToolProgressEnabled: boolean;
  commentaryProgressEnabled: boolean;
  suppressDefaultToolProgressMessages: boolean;
  hasStarted: boolean;
  isVisible: boolean;
  hasStatusHeadline: boolean;
  hasPlanProgress: boolean;
  getSnapshot: () => ChannelProgressDraftCompositorSnapshot;
  markFinalReplyStarted(): void;
  markFinalReplyDelivered(): void;
  beginNewTurn(options?: {
    force?: boolean;
  }): boolean;
  reset(): void;
  resetReasoningProgress(): void;
  mergeReasoningProgress: (text?: string, options?: {
    snapshot?: boolean;
  }) => string;
  suppress(): void;
  cancel(): void;
  start(): Promise<void>;
  noteActivity(options?: {
    startImmediately?: boolean;
  }): Promise<boolean>;
  pushToolProgress: (line?: ChannelProgressDraftCompositorLine, options?: {
    toolName?: string;
    startImmediately?: boolean;
  }) => Promise<boolean>;
};
//#endregion
//#region src/channels/message/capabilities.d.ts
/** Derives the adapter capabilities core needs before it can require durable final delivery. */
declare function deriveDurableFinalDeliveryRequirements(params: DeriveDurableFinalDeliveryRequirementsParams): DurableFinalDeliveryRequirementMap;
//#endregion
//#region src/channels/message/adapter.d.ts
declare const defaultManualReceiveAdapter: {
  readonly defaultAckPolicy: "manual";
  readonly supportedAckPolicies: readonly ["manual"];
};
type ChannelMessageAdapterWithDefaultReceive<TAdapter extends ChannelMessageAdapterShape> = TAdapter & {
  receive: TAdapter["receive"] extends undefined ? typeof defaultManualReceiveAdapter : NonNullable<TAdapter["receive"]>;
};
/** Defines a message adapter while defaulting receive acknowledgement to manual. */
declare function defineChannelMessageAdapter<const TAdapter extends ChannelMessageAdapterShape>(adapter: TAdapter): ChannelMessageAdapter<ChannelMessageAdapterWithDefaultReceive<TAdapter>>;
//#endregion
//#region src/channels/message/outbound-bridge.d.ts
/** Send result accepted from legacy outbound bridge methods before receipt normalization. */
type ChannelMessageOutboundBridgeResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
  messageId?: string;
};
type ChannelMessageOutboundBridgeContext<TContext> = Omit<TContext, "onDeliveryResult"> & {
  onDeliveryResult?: (result: ChannelMessageOutboundBridgeResult) => Promise<void> | void;
};
/** Legacy outbound adapter shape bridged into the channel message adapter contract. */
type ChannelMessageOutboundBridgeAdapter<TConfig = unknown> = {
  deliveryCapabilities?: {
    durableFinal?: DurableFinalDeliveryRequirementMap;
  };
  sendText?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendTextContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendMedia?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendMediaContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPayload?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPayloadContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
  sendPoll?: (ctx: ChannelMessageOutboundBridgeContext<ChannelMessageSendPollContext<TConfig>>) => Promise<ChannelMessageOutboundBridgeResult>;
};
/** Options for building a message adapter from legacy outbound send functions. */
type CreateChannelMessageAdapterFromOutboundParams<TConfig = unknown> = {
  id?: string;
  outbound: ChannelMessageOutboundBridgeAdapter<TConfig>;
  capabilities?: DurableFinalDeliveryRequirementMap;
  live?: ChannelMessageLiveAdapterShape;
  receive?: ChannelMessageReceiveAdapterShape;
};
/** Converts legacy outbound send methods into a typed channel message adapter. */
declare function createChannelMessageAdapterFromOutbound<TConfig = unknown>(params: CreateChannelMessageAdapterFromOutboundParams<TConfig>): ChannelMessageAdapterShape<TConfig>;
//#endregion
//#region src/channels/message/durable-receive.d.ts
/** Pending inbound receive record kept until agent dispatch or durable send completes. */
type DurableInboundReceivePendingRecord<TPayload, TMetadata = unknown> = {
  id: string;
  payload: TPayload;
  metadata?: TMetadata;
  receivedAt: number;
  updatedAt: number;
  attempts: number;
  lastAttemptAt?: number;
  lastError?: string;
};
/** Completed inbound receive tombstone used to detect duplicate platform events. */
type DurableInboundReceiveCompletedRecord<TMetadata = unknown> = {
  id: string;
  completedAt: number;
  metadata?: TMetadata;
};
/** Accept result for a new or duplicate inbound platform event. */
type DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata> = {
  kind: "accepted";
  duplicate: false;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "pending";
  duplicate: true;
  record: DurableInboundReceivePendingRecord<TPayload, TMetadata>;
} | {
  kind: "completed";
  duplicate: true;
  record: DurableInboundReceiveCompletedRecord<TCompletedMetadata>;
};
/** Options recorded when accepting a pending inbound event. */
type DurableInboundReceiveAcceptOptions<TMetadata> = {
  metadata?: TMetadata;
  receivedAt?: number;
};
/** Options recorded when marking an inbound event complete. */
type DurableInboundReceiveCompleteOptions<TCompletedMetadata> = {
  metadata?: TCompletedMetadata;
  completedAt?: number;
};
/** Options recorded when releasing an inbound event for retry. */
type DurableInboundReceiveReleaseOptions = {
  lastError?: string;
  releasedAt?: number;
};
/** Durable receive journal facade used by channel receive pipelines. */
type DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata> = {
  accept(id: string, payload: TPayload, options?: DurableInboundReceiveAcceptOptions<TMetadata>): Promise<DurableInboundReceiveAcceptResult<TPayload, TMetadata, TCompletedMetadata>>;
  pending(): Promise<Array<DurableInboundReceivePendingRecord<TPayload, TMetadata>>>;
  complete(id: string, options?: DurableInboundReceiveCompleteOptions<TCompletedMetadata>): Promise<void>;
  release(id: string, options?: DurableInboundReceiveReleaseOptions): Promise<boolean>;
  deletePending(id: string): Promise<boolean>;
};
/** Queue-backed durable receive journal options with optional retention pruning. */
type DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata> = {
  queue: ChannelIngressQueue<TPayload, TMetadata, TCompletedMetadata>;
  retention?: ChannelIngressQueuePruneOptions;
};
/** Adapts the shared channel ingress queue to the durable receive journal API. */
declare function createDurableInboundReceiveJournalFromQueue<TPayload, TMetadata = unknown, TCompletedMetadata = unknown>(options: DurableInboundReceiveQueueJournalOptions<TPayload, TMetadata, TCompletedMetadata>): DurableInboundReceiveJournal<TPayload, TMetadata, TCompletedMetadata>;
//#endregion
//#region src/channels/message/contracts.d.ts
/**
 * Proof callback used to verify one declared durable-final delivery capability.
 */
type DurableFinalCapabilityProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by durable-final delivery capability.
 */
type DurableFinalCapabilityProofMap = Partial<Record<DurableFinalDeliveryCapability, DurableFinalCapabilityProof>>;
/**
 * Verification result for one durable-final delivery capability.
 */
type DurableFinalCapabilityProofResult = {
  capability: DurableFinalDeliveryCapability;
  status: "verified" | "not_declared";
};
/**
 * Proof callback used to verify one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one live message capability.
 */
type ChannelMessageLiveCapabilityProof = () => Promise<void> | void;
/**
 * Proof callback used to verify one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProof = () => Promise<void> | void;
/**
 * Proof callbacks keyed by live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofMap = Partial<Record<LivePreviewFinalizerCapability, LivePreviewFinalizerCapabilityProof>>;
/**
 * Proof callbacks keyed by live message capability.
 */
type ChannelMessageLiveCapabilityProofMap = Partial<Record<ChannelMessageLiveCapability, ChannelMessageLiveCapabilityProof>>;
/**
 * Proof callbacks keyed by receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofMap = Partial<Record<ChannelMessageReceiveAckPolicy, ChannelMessageReceiveAckPolicyProof>>;
/**
 * Verification result for one live-preview finalizer capability.
 */
type LivePreviewFinalizerCapabilityProofResult = {
  capability: LivePreviewFinalizerCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one live message capability.
 */
type ChannelMessageLiveCapabilityProofResult = {
  capability: ChannelMessageLiveCapability;
  status: "verified" | "not_declared";
};
/**
 * Verification result for one receive acknowledgement policy.
 */
type ChannelMessageReceiveAckPolicyProofResult = {
  policy: ChannelMessageReceiveAckPolicy;
  status: "verified" | "not_declared";
};
/**
 * Verifies proof callbacks for every declared durable-final delivery capability.
 */
declare function verifyDurableFinalCapabilityProofs(params: {
  adapterName: string;
  capabilities?: DurableFinalDeliveryRequirementMap;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies durable-final proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageAdapterCapabilityProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "durableFinal">;
  proofs: DurableFinalCapabilityProofMap;
}): Promise<DurableFinalCapabilityProofResult[]>;
/**
 * Verifies receive acknowledgement proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageReceiveAckPolicyAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "receive">;
  proofs: ChannelMessageReceiveAckPolicyProofMap;
}): Promise<ChannelMessageReceiveAckPolicyProofResult[]>;
/**
 * Verifies live-preview finalizer proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveFinalizerProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: LivePreviewFinalizerCapabilityProofMap;
}): Promise<LivePreviewFinalizerCapabilityProofResult[]>;
/**
 * Verifies live message capability proofs from a channel message adapter declaration.
 */
declare function verifyChannelMessageLiveCapabilityAdapterProofs(params: {
  adapterName: string;
  adapter: Pick<ChannelMessageAdapterShape, "live">;
  proofs: ChannelMessageLiveCapabilityProofMap;
}): Promise<ChannelMessageLiveCapabilityProofResult[]>;
//#endregion
//#region src/channels/message/receipt.d.ts
type MessageReceiptInputResult = MessageReceiptSourceResult & {
  receipt?: MessageReceipt;
};
/** Builds one normalized receipt from platform send results or nested adapter receipts. */
declare function createMessageReceiptFromOutboundResults(params: {
  results: readonly MessageReceiptInputResult[];
  kind?: MessageReceiptPartKind;
  threadId?: string;
  replyToId?: string;
  sentAt?: number;
}): MessageReceipt;
/** Lists unique platform message ids in receipt order. */
declare function listMessageReceiptPlatformIds(receipt: MessageReceipt): string[];
/** Resolves the explicit primary platform id, falling back to the first unique receipt id. */
declare function resolveMessageReceiptPrimaryId(receipt: MessageReceipt): string | undefined;
//#endregion
//#region src/channels/message/receive.d.ts
/** Public alias for channel receive acknowledgement policy names. */
type MessageAckPolicy = ChannelMessageReceiveAckPolicy;
/** Processing stage where a durable inbound message may be acknowledged. */
type MessageAckStage = "receive_record" | "agent_dispatch" | "durable_send" | "manual";
/** Current acknowledgement state for one inbound message context. */
type MessageAckState = "pending" | "acked" | "nacked";
/** Mutable receive context passed through durable inbound message processing. */
type MessageReceiveContext<TMessage = unknown> = {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy: MessageAckPolicy;
  ackState: MessageAckState;
  ackedAt?: number;
  nackErrorMessage?: string;
  receivedAt: number;
  signal: AbortSignal;
  shouldAckAfter(stage: MessageAckStage): boolean;
  ack(): Promise<void>;
  nack(error: unknown): Promise<void>;
};
/** Creates a receive context with idempotent ack and explicit nack state transitions. */
declare function createMessageReceiveContext<TMessage>(params: {
  id: string;
  channel: string;
  accountId?: string;
  message: TMessage;
  ackPolicy?: MessageAckPolicy;
  receivedAt?: number;
  signal?: AbortSignal;
  onAck?: () => Promise<void> | void;
  onNack?: (error: unknown) => Promise<void> | void;
}): MessageReceiveContext<TMessage>;
//#endregion
//#region src/plugin-sdk/channel-outbound.d.ts
type ChannelDurableDeliveryModule = typeof durable_delivery_d_exports;
/** @deprecated The streaming.progress.render key was retired (#122927). */
type ChannelProgressDraftRenderMode = "rich" | "text";
/**
 * @deprecated Load-only bridge: the published Slack channel package
 * (2026.7.2-beta.7 and earlier) imports this at module top level, so removing
 * it makes the installed plugin fail to load after a core upgrade. The config
 * key it read is retired and doctor strips it, so this resolves the same
 * "text"/"rich" answer pre-doctor configs produced and the default otherwise.
 * Remove once managed releases have replaced the old npm latest/extended-stable
 * packages and their upgrade window has closed.
 */
declare function resolveChannelProgressDraftRender(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelProgressDraftRenderMode): ChannelProgressDraftRenderMode;
/** Lazily forwards inbound reply delivery through the channel turn durable-delivery module. */
declare const deliverInboundReplyWithMessageSendContext: ChannelDurableDeliveryModule["deliverInboundReplyWithMessageSendContextCore"];
/** Sends a durable message batch without eager-loading channel message runtime internals. */
declare function sendDurableMessageBatch(
/**
 * Durable send context and outbound batch data forwarded to the channel runtime.
 */
params: DurableMessageSendContextParams): Promise<DurableMessageBatchSendResult>;
/** Runs work inside a durable message send context loaded through the SDK lazy boundary. */
declare function withDurableMessageSendContext<T>(
/**
 * Durable send context used to bind sends, receipts, and lifecycle callbacks.
 */
params: DurableMessageSendContextParams,
/**
 * Callback executed with the loaded durable-send runtime context.
 */
run: (ctx: DurableMessageSendContext) => Promise<T>): Promise<T>;
//#endregion
export { createChannelIngressError as A, createChannelProgressDraftCompositor as C, createTypingKeepaliveLoop as D, resolveChannelDraftStreamingChunking as E, isRecentOutboundMessageIdentity as M, recordOutboundMessageIdentity as N, INGRESS_CLAIM_PROCESS_ID as O, ChannelProgressDraftCompositorSnapshot as S, ChannelDraftStreamingChunking as T, createDurableInboundReceiveJournalFromQueue as _, withDurableMessageSendContext as a, deriveDurableFinalDeliveryRequirements as b, createMessageReceiveContext as c, resolveMessageReceiptPrimaryId as d, verifyChannelMessageAdapterCapabilityProofs as f, verifyDurableFinalCapabilityProofs as g, verifyChannelMessageReceiveAckPolicyAdapterProofs as h, sendDurableMessageBatch as i, OutboundMessageIdentity as j, processPidFromOwnerId as k, createMessageReceiptFromOutboundResults as l, verifyChannelMessageLiveFinalizerProofs as m, deliverInboundReplyWithMessageSendContext as n, MessageAckPolicy as o, verifyChannelMessageLiveCapabilityAdapterProofs as p, resolveChannelProgressDraftRender as r, MessageReceiveContext as s, ChannelProgressDraftRenderMode as t, listMessageReceiptPlatformIds as u, createChannelMessageAdapterFromOutbound as v, createChannelProgressWorkCounter as w, ChannelProgressDraftCompositorLine as x, defineChannelMessageAdapter as y };