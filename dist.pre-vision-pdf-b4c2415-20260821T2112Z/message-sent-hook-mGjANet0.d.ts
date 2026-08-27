import { P as SilentReplyConversationType, r as OpenClawConfig } from "./types.openclaw-D3TBp_34.js";
import { S as ReplyToMode } from "./types.base-COwCxNSg.js";
import { i as ReplyPayload } from "./reply-payload-BCOsEWHC.js";
import { n as SessionTranscriptDeliveryMirror } from "./transcript-GMGfC0_y.js";
import { $t as ReplyDispatchKind, H as PluginHookReplyPayloadSendingContext } from "./subagent-requester-context-CM5vebzA.js";
import { O as RenderedMessageBatchPlanItem, m as ChannelMessageUnknownSendReconciliationResult } from "./types-Bw7pm7u4.js";
import { r as OutboundPayloadDeliverySuppressionReason } from "./deliver-types-DVCVe8Gi.js";
import { o as OutboundIdentity, s as OutboundDeliveryFormattingOptions } from "./outbound.types-d5PlQIet.js";
import { DatabaseSync } from "node:sqlite";
//#region src/infra/delivery-queue-sqlite.types.d.ts
type DeliveryQueueCompletionRetention = "permanent" | Readonly<{
  idPrefix: string;
  maxAgeMs: number;
  maxEntries: number;
}>;
//#endregion
//#region src/infra/outbound/delivery-completion.d.ts
/** Serializable owner callback for a durable queue entry. */
type DurableDeliveryCompletion = {
  kind: "conversation";
  agentId: string;
  operationId: string;
  storePath?: string;
} | {
  kind: "pending-final";
  deliveryId: string;
  intentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
};
//#endregion
//#region src/infra/outbound/identity.d.ts
/** Trims outbound identity fields and drops empty identity payloads. */
declare function normalizeOutboundIdentity(identity?: OutboundIdentity | null): OutboundIdentity | undefined;
/** Resolves an agent's configured identity into channel-safe outbound metadata. */
declare function resolveAgentOutboundIdentity(cfg: OpenClawConfig, agentId: string): OutboundIdentity | undefined;
//#endregion
//#region src/infra/outbound/mirror.d.ts
/**
 * Transcript append data emitted after an outbound send completes.
 */
type OutboundMirror = {
  sessionKey: string;
  agentId?: string;
  text?: string;
  mediaUrls?: string[];
  idempotencyKey?: string;
  expectedSessionId?: string;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
};
/**
 * Delivery-layer mirror data with optional group/channel correlation metadata.
 */
type DeliveryMirror = OutboundMirror & {
  /** Whether this message is being sent in a group/channel context */isGroup?: boolean; /** Group or channel identifier for correlation with received events */
  groupId?: string;
};
//#endregion
//#region src/infra/outbound/prepared-batch.d.ts
declare const PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION: 1;
type PreparedOutboundAcceptedEntry = {
  sourceIndex: number;
  status: "accepted";
  payload: ReplyPayload;
  replyHookChanged: boolean;
  messageHookChanged: boolean;
  preparedMediaCount: number;
};
type PreparedOutboundSuppressedEntry = {
  sourceIndex: number;
  status: "suppressed";
  reason: OutboundPayloadDeliverySuppressionReason;
  hookEffect?: {
    cancelReason?: string;
    metadata?: Record<string, unknown>;
  };
};
type PreparedOutboundBatchEntry = PreparedOutboundAcceptedEntry | PreparedOutboundSuppressedEntry;
/** Canonical post-policy payload custody persisted by the durable outbound queue. */
type PreparedOutboundBatch = {
  schemaVersion: typeof PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION;
  sourcePayloadCount: number; /** True only when accepted payloads already passed post-policy channel normalization. */
  channelNormalized?: true;
  runId?: string;
  entries: PreparedOutboundBatchEntry[];
};
//#endregion
//#region src/infra/outbound/session-context.d.ts
type OutboundSessionContext = {
  /**
   * Canonical session key used for internal hook dispatch.
   *
   * MUST equal the agent runtime's `params.sessionKey` for the run that
   * produced the payload being delivered. Plugins observing both
   * `agent_end`/`llm_input`/`llm_output`/`before_tool_call`/`after_tool_call`
   * and `message_sending`/`message_sent` rely on this equality to correlate
   * per-turn state across the agent-loop and delivery boundaries.
   *
   * Callers populating this field should use the same value the agent runner
   * received as its sessionKey — in the chat path that is
   * `targetSessionKey || ctx.SessionKey` (see
   * `auto-reply/reply/get-reply.ts`). Followup, ACP, command, and cron
   * delivery paths each have their own canonical value to forward; consult
   * the relevant runner.
   */
  key?: string;
  /**
   * Session key used for policy resolution when delivery differs from the
   * control session. Used to look up silent-reply policy, send rate limits,
   * agent-scoped channel preferences, etc., for the chat the reply is being
   * delivered into. May equal `key` when there is no redirect; otherwise
   * `policyKey` describes the *delivery target*'s session while `key`
   * describes the *control session* whose hooks fire.
   */
  policyKey?: string; /** Explicit conversation type for policy resolution when a session key is generic. */
  conversationType?: SilentReplyConversationType;
  /**
   * Caller-declared destination conversation kind for metadata-only audit
   * projection. Never derived from session-key parsing: policy keys can name
   * an acted-on session that is not the delivery destination, and a wrong
   * "direct" here over-collects under audit.messages="direct".
   */
  conversationKind?: "direct" | "group" | "channel"; /** Active agent id used for workspace-scoped media roots. */
  agentId?: string; /** Originating account id used for requester-scoped group policy resolution. */
  requesterAccountId?: string; /** Originating sender id used for sender-scoped outbound media policy. */
  requesterSenderId?: string; /** Originating sender display name for name-keyed sender policy matching. */
  requesterSenderName?: string; /** Originating sender username for username-keyed sender policy matching. */
  requesterSenderUsername?: string; /** Originating sender E.164 phone number for e164-keyed sender policy matching. */
  requesterSenderE164?: string;
};
/** Builds the outbound delivery session context, omitting empty policy fields. */
declare function buildOutboundSessionContext(params: {
  cfg: OpenClawConfig;
  sessionKey?: string | null;
  policySessionKey?: string | null;
  conversationType?: string | null;
  isGroup?: boolean | null;
  agentId?: string | null;
  requesterAccountId?: string | null;
  requesterSenderId?: string | null;
  requesterSenderName?: string | null;
  requesterSenderUsername?: string | null;
  requesterSenderE164?: string | null;
}): OutboundSessionContext | undefined;
//#endregion
//#region src/infra/outbound/delivery-queue-types.d.ts
type QueuedRenderedMessageBatchPlan = {
  payloadCount: number;
  textCount: number;
  mediaCount: number;
  voiceCount: number;
  presentationCount: number;
  interactiveCount: number;
  channelDataCount: number;
  items: readonly RenderedMessageBatchPlanItem[];
};
type QueuedReplyPayloadSendingHook = {
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  context: PluginHookReplyPayloadSendingContext;
};
type QueuedDeliveryPayload = {
  channel: string;
  to: string;
  accountId?: string;
  queuePolicy?: "required" | "best_effort";
  requireUnknownSendReconciliation?: boolean;
  requiresProducerClaim?: boolean;
  preparedBatch?: PreparedOutboundBatch;
  payloads?: ReplyPayload[];
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  threadId?: string | number | null;
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  identity?: OutboundIdentity;
  bestEffort?: boolean;
  gifPlayback?: boolean;
  forceDocument?: boolean;
  silent?: boolean;
  mirror?: DeliveryMirror;
  session?: OutboundSessionContext;
  gatewayClientScopes?: readonly string[];
  preparedMessageId?: string;
  deliveryCompletion?: DurableDeliveryCompletion;
  completionRetention?: DeliveryQueueCompletionRetention;
  legacyUnknownSendReconciliation?: Exclude<ChannelMessageUnknownSendReconciliationResult, {
    status: "unresolved";
  }>;
  legacyPreparedContentUnavailable?: true;
  maxRetries?: number;
};
type QueuedDelivery = Omit<QueuedDeliveryPayload, "preparedBatch" | "payloads"> & {
  preparedBatch: PreparedOutboundBatch;
  id: string;
  enqueuedAt: number;
  retryCount: number;
  attemptCount: number;
  availableAt?: number;
  producerClaimId?: string;
  lastAttemptAt?: number;
  lastError?: string;
  platformSendAttemptId?: string;
  platformSendStartedAt?: number;
  effectiveReplyToId?: string | null;
  recoveryState?: "producer_claimed" | "send_attempt_started" | "unknown_after_send";
  retainOnFailure?: true;
};
//#endregion
//#region src/infra/outbound/message-sent-hook.d.ts
type MessageSentEvent = {
  success: boolean;
  content: string;
  error?: string;
  messageId?: string;
};
//#endregion
export { QueuedReplyPayloadSendingHook as a, PreparedOutboundBatch as c, resolveAgentOutboundIdentity as d, DurableDeliveryCompletion as f, QueuedRenderedMessageBatchPlan as i, DeliveryMirror as l, QueuedDelivery as n, OutboundSessionContext as o, DeliveryQueueCompletionRetention as p, QueuedDeliveryPayload as r, buildOutboundSessionContext as s, MessageSentEvent as t, normalizeOutboundIdentity as u };