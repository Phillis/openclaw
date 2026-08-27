import { P as SilentReplyConversationType, r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { S as ReplyToMode } from "./types.base-COwCxNSg.js";
import { i as ReplyPayload } from "./reply-payload-BCOsEWHC.js";
import { f as MessagePresentation, j as ReplyPayloadDelivery, o as LegacyInteractiveReply } from "./payload-D0D49c9Y.js";
import { t as OutboundMediaAccess } from "./load-options-63mp15In.js";
import { k as OutboundSendDeps } from "./types-Bw7pm7u4.js";
import { n as OutboundPayloadDeliveryOutcome, t as OutboundDeliveryResult } from "./deliver-types-DVCVe8Gi.js";
import { o as OutboundIdentity, s as OutboundDeliveryFormattingOptions, t as ChannelDeliveryCapabilities } from "./outbound.types-d5PlQIet.js";
import { a as QueuedReplyPayloadSendingHook, c as PreparedOutboundBatch, f as DurableDeliveryCompletion, i as QueuedRenderedMessageBatchPlan, l as DeliveryMirror, o as OutboundSessionContext, p as DeliveryQueueCompletionRetention, t as MessageSentEvent } from "./message-sent-hook-mGjANet0.js";
import { k as resolveSendableOutboundReplyParts } from "./reply-payload-3XB-UI0d.js";

//#region src/infra/outbound/reply-policy.d.ts
/** Resolved reply target plus whether it came from payload or ambient context. */
type ReplyToResolution = {
  replyToId?: string;
  source?: "explicit" | "implicit";
};
/** Creates a reply-to supplier that consumes implicit single-use reply ids once. */
declare function createReplyToFanout(params: {
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  replyToIdSource?: ReplyToResolution["source"];
}): () => string | undefined;
//#endregion
//#region src/infra/outbound/payloads.d.ts
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
type NormalizedOutboundPayload = {
  text: string;
  mediaUrls: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload["location"]; /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
  hookContent?: string;
};
/** JSON-safe outbound payload projection used for envelopes and diagnostics. */
type OutboundPayloadJson = {
  text: string;
  mediaUrl: string | null;
  mediaUrls?: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload["location"];
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload;
  parts: ReturnType<typeof resolveSendableOutboundReplyParts>;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
type OutboundPayloadPlanContext = {
  cfg?: OpenClawConfig;
  sessionKey?: string;
  surface?: string;
  conversationType?: SilentReplyConversationType;
  extractMarkdownImages?: boolean;
};
/** Text/media projection used to mirror outbound replies into session state. */
/** Builds the canonical outbound payload plan shared by delivery projections. */
declare function createOutboundPayloadPlan(payloads: readonly ReplyPayload[], context?: OutboundPayloadPlanContext): OutboundPayloadPlan[];
/** Projects a payload plan back to normalized reply payloads for delivery. */
declare function projectOutboundPayloadPlanForDelivery(plan: readonly OutboundPayloadPlan[]): ReplyPayload[];
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
declare function projectOutboundPayloadPlanForJson(plan: readonly OutboundPayloadPlan[]): OutboundPayloadJson[];
//#endregion
//#region src/infra/outbound/deliver-contracts.d.ts
type OutboundDeliveryQueuePolicy = "required" | "best_effort";
type OutboundDeliveryIntent = {
  id: string;
  channel: string;
  to: string;
  accountId?: string;
  queuePolicy: OutboundDeliveryQueuePolicy;
};
type DurableFinalDeliveryRequirement = keyof NonNullable<ChannelDeliveryCapabilities["durableFinal"]>;
type DurableFinalDeliveryRequirements = Partial<Record<DurableFinalDeliveryRequirement, boolean>>;
type PlatformSendRoute = {
  replyToId?: string | null;
  threadId?: string | number | null;
};
type DeliverOutboundPayloadsCoreParams = {
  cfg: OpenClawConfig;
  channel: string;
  to: string;
  accountId?: string;
  payloads: ReplyPayload[]; /** @internal Canonical post-policy batch used by queue recovery and physical delivery. */
  preparedBatch?: PreparedOutboundBatch;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  mediaAccess?: OutboundMediaAccess;
  gifPlayback?: boolean;
  forceDocument?: boolean;
  replyPayloadSendingHook?: QueuedReplyPayloadSendingHook;
  abortSignal?: AbortSignal;
  bestEffort?: boolean;
  onError?: (err: unknown, payload: NormalizedOutboundPayload) => void;
  onPayload?: (payload: NormalizedOutboundPayload) => void; /** @internal Reports the effective payload only after an identified platform send. */
  onDeliveredPayload?: (payload: NormalizedOutboundPayload) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void; /** @internal Runs after each identified platform result, before further fallible work. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void; /** @internal Reports a settled native payload for post-terminal message_sent observation. */
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void; /** @internal Persists ambiguous-send state immediately before platform I/O. */
  onPlatformSendStart?: (route: PlatformSendRoute) => Promise<void>; /** @internal Opaque durable intent id forwarded to provider reconciliation hooks. */
  deliveryQueueId?: string; /** @internal Stable producer id used to make queue creation idempotent across crashes. */
  deliveryIntentId?: string; /** @internal Retain the completed receipt for a producer-owned replayable intent. */
  completionRetention?: DeliveryQueueCompletionRetention; /** @internal Producer-specific durable recovery attempt budget. */
  maxRetries?: number; /** @internal Retry this producer's pending intent only when no platform send began. */
  reusePendingDeliveryIntent?: boolean; /** @internal Serializable owner state finalized after live or recovered delivery. */
  deliveryCompletion?: DurableDeliveryCompletion; /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string; /** @internal Recheck the concrete post-hook send shape before platform I/O. */
  requiredUnknownSendReconciliation?: boolean; /** @internal Caller preflight explicitly required provider unknown-send reconciliation. */
  requireUnknownSendReconciliation?: boolean; /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>; /** Session/agent context used for hooks and media local-root scoping. */
  session?: OutboundSessionContext;
  mirror?: DeliveryMirror;
  silent?: boolean;
  gatewayClientScopes?: readonly string[];
  conversationReadOrigin?: "delegated" | "direct-operator";
};
/**
 * @deprecated Direct outbound delivery is compatibility/runtime substrate.
 * New message lifecycle code should use `sendDurableMessageBatch` from
 * `src/channels/message/send.ts` or `deliverInboundReplyWithMessageSendContext`
 * from `src/channels/turn/durable-delivery.ts`. Keep direct use only for
 * outbound substrate, recovery, and compatibility paths.
 */
type DeliverOutboundPayloadsParams = DeliverOutboundPayloadsCoreParams & {
  /** @internal Skip write-ahead queue (used by crash-recovery to avoid re-enqueueing). */skipQueue?: boolean; /** @internal Fence recovery ownership at the same provider boundary as live sends. */
  deliveryProducerClaimId?: string; /** @internal Keep the exact live producer claim alive during platform preparation. */
  deliveryProducerLeaseRequired?: boolean; /** @internal Recovery already ran provider admission after its pending-row re-read. */
  deferredDeliveryAdmissionPassed?: true; /** @internal State directory that owns the existing recovery queue entry. */
  deliveryQueueStateDir?: string; /** @internal Let recovery run commit hooks after it has acked the recovered queue entry. */
  deferCommitHooks?: boolean;
  queuePolicy?: OutboundDeliveryQueuePolicy;
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  onDeliveryIntent?: (intent: OutboundDeliveryIntent) => void;
};
//#endregion
export { OutboundDeliveryQueuePolicy as a, projectOutboundPayloadPlanForJson as c, OutboundDeliveryIntent as i, ReplyToResolution as l, DurableFinalDeliveryRequirement as n, createOutboundPayloadPlan as o, DurableFinalDeliveryRequirements as r, projectOutboundPayloadPlanForDelivery as s, DeliverOutboundPayloadsParams as t, createReplyToFanout as u };