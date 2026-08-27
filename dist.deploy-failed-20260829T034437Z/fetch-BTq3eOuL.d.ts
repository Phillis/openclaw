import { $ as SessionMaintenanceMode, Q as ReplyToMode, T as TtsAutoMode, n as OpenClawConfig, ot as SilentReplyConversationType, tt as ChatType } from "./types.openclaw-BjZ8Xxcu.js";
import { o as ImageContent, p as TextContent, s as Message } from "./types-Sg3pk96c.js";
import "./types-CippcftS.js";
import { g as DeliveryContext, h as SourceReplyDeliveryMode } from "./types-CW5W8UCv.js";
import { Bt as MediaFact, Dt as TranscriptEntryAnchor, F as OutboundPayloadDeliverySuppressionReason, Jt as LegacyInteractiveReply, Mt as ExecutionIdentityAdmissionToken, N as OutboundDeliveryResult, P as OutboundPayloadDeliveryOutcome, Rt as PluginHookChannelContext, S as ChannelDeliveryCapabilities, T as OutboundDeliveryFormattingOptions, Yt as MessagePresentation, Zt as ReplyPayloadDelivery, ct as RenderedMessageBatchPlanItem, ft as FinalizedMsgContext, lt as OutboundSendDeps, qt as ReplyPayload$1, sn as ApprovalScope, st as OutboundReplyFacts, ut as OutboundMediaAccess, w as OutboundIdentity } from "./types.adapters-UsYT95C9.js";
import { n as AgentMessage, o as BashExecutionMessage, s as CustomMessage } from "./agent-core-Q1SbbORG.js";
import { t as PluginConversationBinding } from "./conversation-binding.types-gHdw7bgv.js";
import { n as PinnedDispatcherPolicy, r as SsrFPolicy, t as LookupFn } from "./ssrf-Ck7fh8Hg.js";
import { DatabaseSync } from "node:sqlite";
import "kysely";
import { ImageMetadata } from "rastermill";
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
  /** Present on Gateway-owned conversation intents created with route authorization. */
  routeFingerprint?: string;
} | {
  kind: "pending-final";
  deliveryId: string;
  intentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
};
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.d.ts
type ReplyDispatchKind = "tool" | "block" | "final";
type ReplyDispatchSettledCounts = {
  delivered: number;
  deliveredNotVisible: number;
  cancelled: number;
  failedBeforeSend: number;
  failedAfterSend: number;
};
type ReplyDispatchReceipt = {
  counts: Record<ReplyDispatchKind, ReplyDispatchSettledCounts>;
  anyVisibleDelivered: boolean;
};
type ReplyFollowupAdmissionBarrierTimeoutPolicy = {
  /** Absolute failsafe for owner activity that never settles. */
  maxTimeoutMs: number;
  /** Extend by another default settle interval while bounded owner work remains active. */
  shouldExtend: () => boolean;
};
type ReplyDispatchRuntimeInfo = {
  kind: ReplyDispatchKind;
  assistantMessageIndex?: number;
  /** @internal Claim direct-send custody immediately before recipient-visible platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Bind this delivery's host-owned completion to a transformed payload. */
  bindPendingFinalDelivery?: <T extends ReplyPayload$1>(payload: T) => T;
};
type ReplyDispatchBeforeDeliver = (payload: ReplyPayload$1, info: ReplyDispatchRuntimeInfo) => Promise<ReplyPayload$1 | null> | ReplyPayload$1 | null;
/** An owner-declared settlement budget for one before-delivery callback. */
type ReplyDispatchBeforeDeliverOptions = {
  /** Positive finite per-callback deadline in milliseconds; omit for the dispatcher default. */
  timeoutMs?: number;
};
type ReplyDispatcher = {
  sendToolResult: (payload: ReplyPayload$1) => boolean;
  sendBlockReply: (payload: ReplyPayload$1) => boolean;
  sendFinalReply: (payload: ReplyPayload$1) => boolean;
  appendBeforeDeliver?: (hook: ReplyDispatchBeforeDeliver, options?: ReplyDispatchBeforeDeliverOptions) => void;
  supportsSettledReceipt?: true;
  waitForIdle: () => Promise<void | ReplyDispatchReceipt>;
  /** @deprecated Remove in the next Plugin SDK major; retains admission-time counts. */
  getQueuedCounts: () => Record<ReplyDispatchKind, number>;
  /** @deprecated Remove in the next Plugin SDK major; derived from settled receipts. */
  getCancelledCounts?: () => Record<ReplyDispatchKind, number>;
  /** @deprecated Remove in the next Plugin SDK major; derived from settled receipts. */
  getFailedCounts: () => Record<ReplyDispatchKind, number>;
  markComplete: () => void;
  /** Owner-declared deadline for holding queued follow-ups behind all queued deliveries. */
  resolveFollowupAdmissionBarrierTimeoutPolicy?: () => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
//#endregion
//#region src/infra/diagnostic-trace-context.d.ts
type DiagnosticTraceContext = {
  /** W3C trace id, 32 lowercase hex chars. */
  readonly traceId: string;
  /** Current span id, 16 lowercase hex chars. */
  readonly spanId?: string;
  /** Parent span id, 16 lowercase hex chars. */
  readonly parentSpanId?: string;
  /** W3C trace flags, 2 lowercase hex chars. Defaults to sampled. */
  readonly traceFlags?: string;
};
//#endregion
//#region src/plugins/hook-before-agent-start.types.d.ts
type PluginHookBeforeModelResolveAttachment = {
  kind: "image" | "video" | "audio" | "document" | "other";
  mimeType?: string;
};
type PluginHookBeforeModelResolveEvent = {
  /** User prompt for this run. No session messages are available yet in this phase. */
  prompt: string;
  /** Attachment metadata for file-aware model routing. */
  attachments?: PluginHookBeforeModelResolveAttachment[];
};
type PluginHookBeforeModelResolveResult = {
  /** Override the model for this agent run. E.g. "llama3.3:8b" */
  modelOverride?: string;
  /** Override the provider for this agent run. E.g. "local-provider" */
  providerOverride?: string;
};
type PluginHookBeforePromptBuildEvent = {
  prompt: string;
  /** Session messages prepared for this run. */
  messages: unknown[];
};
type PluginHookBeforePromptBuildResult = {
  systemPrompt?: string;
  prependContext?: string;
  appendContext?: string;
  /**
   * Narrows the tools submitted to the model for this turn.
   * An empty array disables optional tools; omitted leaves the existing tool policy unchanged.
   */
  toolsAllow?: string[];
  /**
   * Prepended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  prependSystemContext?: string;
  /**
   * Appended to the agent system prompt so providers can cache it (e.g. prompt caching).
   * Use for static plugin guidance instead of prependContext to avoid per-turn token cost.
   */
  appendSystemContext?: string;
};
//#endregion
//#region src/plugins/hook-before-tool-call-result.d.ts
declare const PluginApprovalResolutions: {
  readonly ALLOW_ONCE: "allow-once";
  readonly ALLOW_ALWAYS: "allow-always";
  readonly DENY: "deny";
  readonly TIMEOUT: "timeout";
  readonly CANCELLED: "cancelled";
};
type PluginApprovalResolution = (typeof PluginApprovalResolutions)[keyof typeof PluginApprovalResolutions];
type PluginHookBeforeToolCallResult = {
  params?: Record<string, unknown>;
  block?: boolean;
  blockReason?: string;
  requireApproval?: {
    title: string;
    description: string;
    scope?: ApprovalScope;
    severity?: "info" | "warning" | "critical";
    timeoutMs?: number;
    /**
     * @deprecated Unresolved approvals always deny; retained for plugin API
     * compatibility. The field will be removed after one deprecation release train.
     */
    timeoutBehavior?: "allow" | "deny";
    /** Override timeout text and return the timeout as a blocked tool result. */
    timeoutReason?: string;
    allowedDecisions?: Array<"allow-once" | "allow-always" | "deny">;
    pluginId?: string;
    onResolution?: (decision: PluginApprovalResolution) => Promise<void> | void;
  };
};
//#endregion
//#region src/plugins/hook-decision-types.d.ts
/** Content is fine. Proceed normally. */
type HookDecisionPass = {
  outcome: "pass";
};
/**
 * Content is blocked. `reason` is internal plugin-local detail; core must not log,
 * persist, broadcast, or expose it verbatim. `message` is user-facing detail.
 */
type HookDecisionBlock = {
  outcome: "block";
  /** Internal plugin-local reason. Do not log, persist, broadcast, or expose verbatim. */
  reason: string;
  /** Optional user-facing detail included in the block response envelope. */
  message?: string;
  /** Plugin-defined category for analytics (e.g. "violence", "pii", "cost_limit"). */
  category?: string;
  /** Opaque metadata for the plugin's own use. Core does not interpret it. */
  metadata?: Record<string, unknown>;
};
/** Outcomes valid for input gates (before_agent_run). */
type InputGateDecision = HookDecisionPass | HookDecisionBlock;
//#endregion
//#region src/hooks/message-hook-media.d.ts
/** Stable media fact exposed to message-hook consumers. */
type MessageHookMediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaFact["kind"];
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string;
};
//#endregion
//#region src/plugins/hook-message.types.d.ts
/** Ordered media fact exposed by inbound message hooks. */
type PluginHookMediaFact = MessageHookMediaFact;
/** Channel-neutral geographic fix carried by an inbound provider update. */
type PluginHookLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  source?: "pin" | "place" | "live";
  isLive?: boolean;
  livePeriodSeconds?: number;
  caption?: string;
};
/** Stable provider update identity for transport-level correlation and deduplication. */
type PluginHookProviderUpdate = {
  id: string;
  kind: string;
  messageId?: string;
  messageTimestamp?: number;
  editedTimestamp?: number;
};
/** Provider metadata plus deprecated media aliases retained during the SDK migration window. */
type PluginHookInboundMessageMetadata = Record<string, unknown> & {
  /** @deprecated Use the first `event.media` fact with a defined `path`. */
  mediaPath?: string;
  /** @deprecated Use the first `event.media` fact's `url ?? path`. */
  mediaUrl?: string;
  /** @deprecated Use the first `event.media` fact's `contentType ?? kind`. */
  mediaType?: string;
  /** @deprecated Collect defined `path` values from `event.media` in order. */
  mediaPaths?: string[];
  /** @deprecated Collect each defined `url ?? path` from `event.media` in order. */
  mediaUrls?: string[];
  /** @deprecated Collect each defined `contentType ?? kind` from `event.media` in order. */
  mediaTypes?: string[];
  /** @deprecated Use the first `event.originalMedia` fact with a defined `path`. */
  originalMediaPath?: string;
  /** @deprecated Use the first `event.originalMedia` fact's `url ?? path`. */
  originalMediaUrl?: string;
  /** @deprecated Use the first `event.originalMedia` fact's `contentType ?? kind`. */
  originalMediaType?: string;
  /** @deprecated Collect defined `path` values from `event.originalMedia` in order. */
  originalMediaPaths?: string[];
  /** @deprecated Collect each defined `url ?? path` from `event.originalMedia` in order. */
  originalMediaUrls?: string[];
  /** @deprecated Collect each defined `contentType ?? kind` from `event.originalMedia` in order. */
  originalMediaTypes?: string[];
  /** @deprecated Use `event.mediaStagingPending`. */
  mediaStagingPending?: boolean;
};
type PluginHookMessageContext = {
  channelId: string;
  accountId?: string;
  conversationId?: string;
  /**
   * Canonical session key for this conversation — the same value the agent
   * runtime sees as `params.sessionKey` for the run that produced the
   * outbound payload, and the same value `agent_end`/`llm_input`/`llm_output`
   * fire with. Plugins correlating per-turn state across `agent_end` and
   * `message_sending` rely on this equality.
   *
   * For inbound message hooks (`inbound_claim` etc.), this is the canonical
   * session for the inbound conversation as resolved by `resolveSessionKey`
   * / `deriveInboundMessageHookContext`.
   *
   * For outbound delivery hooks (`message_sending` and `message_sent`),
   * this mirrors `OutboundSessionContext.key` from the dispatch path when
   * delivery has a session attached. When the outbound path has no
   * resolvable session (e.g. internal smoke runs without
   * `OutboundSessionContext`), this field is omitted; plugins must treat
   * it as optional.
   */
  sessionKey?: string;
  /**
   * Per-turn run identifier (UUID), unique to one end-to-end agent turn:
   * stable across all LLM-call iterations, retry attempts (compaction,
   * empty-response, planning-only, etc.), and multi-payload reply chunks
   * within that turn; distinct for each new inbound user message and for
   * each cron/heartbeat/followup-triggered run.
   *
   * Generated once in `agent-runner-execution.ts`/`followup-runner.ts` via
   * `crypto.randomUUID()`. Currently populated for inbound message hooks
   * (`inbound_claim`, `message_received`) and for agent-runtime hooks that
   * already receive the run id (e.g. `agent_end`, `llm_input`, `llm_output`).
   * It is **not yet** plumbed through the outbound delivery path, so
   * plugins observing `message_sending` / `message_sent` should not rely
   * on `runId` to correlate against `agent_end`; use `sessionKey` for
   * outbound→inbound correlation today (with the caveat that it cannot
   * disambiguate concurrent turns in the same session).
   */
  runId?: string;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  callDepth?: number;
};
type PluginHookInboundClaimContext = PluginHookMessageContext & {
  /** Resolved owner for session scopes whose canonical key does not encode an agent id. */
  agentId?: string;
  parentConversationId?: string;
  senderId?: string;
  messageId?: string;
  pluginBinding?: PluginConversationBinding;
};
type PluginHookInboundClaimEvent = {
  content: string;
  body?: string;
  bodyForAgent?: string;
  transcript?: string;
  timestamp?: number;
  channel: string;
  accountId?: string;
  conversationId?: string;
  parentConversationId?: string;
  senderId?: string;
  senderName?: string;
  senderUsername?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  threadId?: string | number;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  isGroup: boolean;
  commandAuthorized?: boolean;
  senderIsOwner?: boolean;
  wasMentioned?: boolean;
  location?: PluginHookLocation;
  providerUpdate?: PluginHookProviderUpdate;
  /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[];
  /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
  mediaStagingPending?: boolean;
  metadata?: PluginHookInboundMessageMetadata;
};
type PluginHookMessageReceivedEvent = {
  from: string;
  content: string;
  timestamp?: number;
  threadId?: string | number;
  messageId?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  location?: PluginHookLocation;
  providerUpdate?: PluginHookProviderUpdate;
  /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[];
  /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[];
  /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
  mediaStagingPending?: boolean;
  metadata?: PluginHookInboundMessageMetadata;
};
type PluginHookMessageSendingEvent = {
  to: string;
  content: string;
  replyToId?: string | number;
  threadId?: string | number;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSendingResult = {
  content?: string;
  cancel?: boolean;
  cancelReason?: string;
  metadata?: Record<string, unknown>;
};
type PluginHookMessageSentEvent = {
  to: string;
  content: string;
  success: boolean;
  messageId?: string;
  sessionKey?: string;
  runId?: string;
  trace?: DiagnosticTraceContext;
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  error?: string;
};
//#endregion
//#region src/plugins/hook-skill.types.d.ts
type PluginHookSkillProposalKind = "create" | "update";
type PluginHookSkillBundleFile = {
  path: string;
  content: string;
  encoding: "utf8" | "base64";
  sha256: string;
  sizeBytes: number;
};
type PluginHookSkillBundleSnapshot = {
  skillMd: PluginHookSkillBundleFile;
  files: PluginHookSkillBundleFile[];
  treeSha256: string;
};
type PluginHookSkillProposalEvaluateEvent = {
  /** Caller-supplied correlation metadata; not authenticated identity or authorization proof. */
  correlationId?: string;
  proposal: {
    id: string;
    kind: PluginHookSkillProposalKind;
    revision: string;
    revisionSha256: string;
    targetCurrentSha256?: string;
  };
  skill: {
    name: string;
    skillKey: string;
    description: string;
    source?: string;
  };
  candidate: PluginHookSkillBundleSnapshot;
  baseline?: PluginHookSkillBundleSnapshot;
  reason: "created" | "revised" | "manual" | "apply";
};
type PluginHookSkillEvaluationFinding = {
  ruleId: string;
  severity: "info" | "warn" | "critical";
  message: string;
  file?: string;
  line?: number;
};
type PluginHookSkillProposalEvaluateResult = {
  summary?: string;
  findings?: PluginHookSkillEvaluationFinding[];
  metrics?: Record<string, string | number | boolean>;
  /** Version of the underlying evaluator or ruleset, separate from the plugin package. */
  evaluatorVersion?: string;
  /** Bounded evaluator mode label such as `static`, `llm`, or `baseline-comparison`. */
  mode?: string;
  decision?: "pass" | "revise" | "block";
  decisionReason?: string;
};
type PluginHookSkillProposalEvaluationAttribution = {
  evaluatorId: string;
  pluginId: string;
  pluginVersion?: string;
};
type PluginHookSkillProposalEvaluationOutcome = (PluginHookSkillProposalEvaluationAttribution & {
  status: "completed";
  result: PluginHookSkillProposalEvaluateResult;
}) | (PluginHookSkillProposalEvaluationAttribution & {
  status: "skipped";
}) | (PluginHookSkillProposalEvaluationAttribution & {
  status: "error";
  error: string;
});
type PluginHookSkillArtifact = {
  name: string;
  skillKey: string;
  description?: string;
  skillFile: string;
  skillDir: string;
  source: string;
  revision: {
    declaredVersion?: string;
    contentSha256: string;
    treeSha256: string;
    sourceVersion?: string;
  };
};
type PluginHookSkillChangedEvent = {
  action: "created" | "updated" | "removed";
  source: "workshop" | "clawhub" | "source-install" | "upload";
  occurredAt: string;
  before?: PluginHookSkillArtifact;
  after?: PluginHookSkillArtifact;
  proposal?: {
    id: string;
    revision: string;
    revisionSha256: string;
  };
};
type PluginHookSkillProposalChangedEvent = {
  eventId: string;
  sequence: number;
  action: "created" | "revised" | "evaluation_completed" | "applied" | "rejected" | "quarantined" | "stale";
  occurredAt: string;
  correlationId?: string;
  proposal: {
    id: string;
    kind: PluginHookSkillProposalKind;
    status: "pending" | "applied" | "rejected" | "quarantined" | "stale";
    revision: string;
    revisionSha256: string;
    skillName: string;
    skillKey: string;
    skillFile: string;
    source?: string;
  };
  evaluations?: readonly PluginHookSkillProposalEvaluationOutcome[];
};
type PluginHookSkillContext = {
  workspaceDir: string;
  agentId?: string;
};
//#endregion
//#region src/plugins/host-hook-json.d.ts
/** JSON primitive values accepted across plugin host-hook boundaries. */
type PluginJsonPrimitive = string | number | boolean | null;
/** Bounded JSON value shape accepted from plugin hooks. */
type PluginJsonValue = PluginJsonPrimitive | PluginJsonValue[] | {
  [key: string]: PluginJsonValue;
};
//#endregion
//#region src/plugins/host-hook-turn-types.d.ts
/** Placement for context injected into the next agent turn. */
type PluginNextTurnInjectionPlacement = "prepend_context" | "append_context";
/** Plugin request to inject text into the next turn for a session. */
type PluginNextTurnInjection = {
  sessionKey: string;
  text: string;
  idempotencyKey?: string;
  placement?: PluginNextTurnInjectionPlacement;
  ttlMs?: number;
  metadata?: PluginJsonValue;
};
/** Stored next-turn injection after session/plugin metadata is attached. */
type PluginNextTurnInjectionRecord = Omit<PluginNextTurnInjection, "sessionKey"> & {
  id: string;
  pluginId: string;
  pluginName?: string;
  createdAt: number;
  placement: PluginNextTurnInjectionPlacement;
};
/** Result returned after enqueueing a next-turn injection. */
type PluginNextTurnInjectionEnqueueResult = {
  enqueued: boolean;
  id: string;
  sessionKey: string;
};
/** Event passed to plugins before an agent turn is prepared. */
type PluginAgentTurnPrepareEvent = {
  prompt: string;
  messages: unknown[];
  queuedInjections: PluginNextTurnInjectionRecord[];
};
/** Plugin contribution to prepend or append context for a prepared agent turn. */
type PluginAgentTurnPrepareResult = {
  prependContext?: string;
  appendContext?: string;
};
/** Event passed to plugins that contribute heartbeat prompt context. */
type PluginHeartbeatPromptContributionEvent = {
  sessionKey?: string;
  agentId?: string;
  heartbeatName?: string;
};
/** Plugin contribution to heartbeat prompt context. */
type PluginHeartbeatPromptContributionResult = {
  prependContext?: string;
  appendContext?: string;
};
//#endregion
//#region src/plugins/hook-types.d.ts
type PluginHookName = "before_model_resolve" | "agent_turn_prepare" | "before_prompt_build" | "before_agent_reply" | "model_call_started" | "model_call_ended" | "llm_input" | "llm_output" | "before_agent_finalize" | "agent_end" | "before_compaction" | "after_compaction" | "before_reset" | "inbound_claim" | "channel_pairing_requested" | "message_received" | "message_sending" | "reply_payload_sending" | "message_sent" | "before_tool_call" | "after_tool_call" | "tool_result_persist" | "before_message_write" | "session_start" | "session_end" | "subagent_delivery_target" | "subagent_spawned" | "subagent_progress" | "subagent_ended" | "gateway_start" | "gateway_stop" | "heartbeat_prompt_contribution" | "cron_reconciled" | "cron_changed" | "skill_proposal_evaluate" | "skill_proposal_changed" | "skill_changed" | "before_dispatch" | "reply_dispatch" | "before_install" | "before_agent_run" | "resolve_exec_env";
type PluginHookChannelPairingRequestedEvent = {
  /** Channel that created the pending pairing request. */
  channel: string;
  /** Provider account ID for multi-account channel setups. */
  accountId?: string;
  /** Channel-scoped sender ID awaiting operator approval. */
  senderId: string;
  /** Short-lived code accepted by `openclaw pairing approve`. */
  code: string;
  /** Sender-supplied channel metadata for operator notification/audit. Treat as untrusted. */
  metadata?: Record<string, string | undefined>;
};
type PluginHookChannelPairingContext = {
  channelId: string;
  accountId?: string;
  senderId: string;
};
declare const PLUGIN_HOOK_AGENT_TRIGGERS: readonly ["cron", "heartbeat", "user"];
type PluginHookAgentTrigger = (typeof PLUGIN_HOOK_AGENT_TRIGGERS)[number];
type PluginToolMatcher = readonly [string, ...string[]];
type PluginHookRegistrationOptions<K extends PluginHookName> = {
  priority?: number;
  registrationId?: string;
  timeoutMs?: number;
} & (K extends "before_agent_reply" ? {
  /** Host-enforced turn triggers that may invoke this reply hook. */
  eligibleTriggers?: readonly [PluginHookAgentTrigger, ...PluginHookAgentTrigger[]];
} : {
  eligibleTriggers?: never;
}) & (K extends "before_tool_call" | "after_tool_call" ? {
  matcher?: PluginToolMatcher;
} : {
  matcher?: never;
}) & (K extends "before_prompt_build" ? {
  /** Run only after the host has finalized the turn's policy-filtered tool surface. */
  requiresToolAuthority?: true;
} : {
  requiresToolAuthority?: never;
});
type PluginHookToolAuthority = {
  /** Opaque host fingerprint for the exact turn, route, policy, and active tool surface. */
  readonly fingerprint: string;
  /** Checks whether the finalized turn surface contains this exact tool. */
  allows(toolName: string): boolean;
  /** Rejects retained or timed-out capabilities after the host dispatch closes. */
  assertActive(): void;
};
type PluginHookAgentContext = {
  runId?: string;
  jobId?: string;
  trace?: DiagnosticTraceContext;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  workspaceDir?: string;
  /** Run-prepared repository identities; empty when the turn is outside a repository. */
  activeProjectKeys?: string[];
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string;
  /** Channel/plugin id for channel-originated runs, e.g. `discord`. */
  channel?: string;
  /** Channel account used by the agent when multiple accounts are configured. */
  accountId?: string;
  /** Conversation target id for channel-originated runs. Mirrors `channelId` for compatibility. */
  chatId?: string;
  /** Sender identity for channel-originated runs when available. */
  senderId?: string;
  trigger?: string;
  channelId?: string;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
  /**
   * @deprecated Core does not populate cross-app sender ids. Channel plugins
   * should expose channel-specific identities by augmenting `channelContext.sender`.
   */
  senderExternalId?: string;
  /** Channel-owned sender/chat details. Plugins may augment the nested interfaces. */
  channelContext?: PluginHookChannelContext;
  /** Present only for post-policy prompt enrichment hooks that requested tool authority. */
  toolAuthority?: PluginHookToolAuthority;
};
type PluginHookContextWindowSource = "model" | "modelsConfig" | "agentContextTokens" | "default";
type PluginHookBeforeAgentReplyEvent = {
  cleanedBody: string;
};
type PluginHookBeforeAgentReplyResult = {
  handled: boolean;
  reply?: ReplyPayload$1;
  reason?: string;
};
type PluginHookLlmInputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  systemPrompt?: string;
  prompt: string;
  historyMessages: unknown[];
  imagesCount: number;
  tools?: unknown[];
};
type PluginHookModelCallBaseEvent = {
  runId: string;
  callId: string;
  sessionKey?: string;
  sessionId?: string;
  provider: string;
  model: string;
  api?: string;
  transport?: string;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
};
type PluginHookModelCallStartedEvent = PluginHookModelCallBaseEvent;
type PluginHookModelCallEndedEvent = PluginHookModelCallBaseEvent & {
  durationMs: number;
  outcome: "completed" | "error";
  errorCategory?: string;
  failureKind?: "aborted" | "connection_closed" | "connection_reset" | "terminated" | "timeout";
  requestPayloadBytes?: number;
  responseStreamBytes?: number;
  timeToFirstByteMs?: number;
  upstreamRequestIdHash?: string;
};
type PluginHookLlmOutputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string;
  /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource;
  /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
  /**
   * Fully resolved provider/model ref used for the call.
   *
   * This intentionally keeps the provider prefix so operator tooling can
   * distinguish e.g. openai/gpt-5.4 from codex/gpt-5.4 even when display
   * names collapse to just the model id.
   */
  resolvedRef?: string;
  /**
   * Harness/backend responsible for the model loop. Kept separate from
   * `resolvedRef` so provider/model consumers keep a stable parse contract.
   */
  harnessId?: string;
  /** The original user prompt that produced this output. */
  prompt?: string;
  assistantTexts: string[];
  lastAssistant?: unknown;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Requested reasoning/think effort for this call (provider think level, e.g.
   * "off" | "low" | "medium" | "high"). Lets a passive footer show the mode the
   * user is actually running without re-deriving it.
   */
  reasoningEffort?: string;
  /** Whether fast mode was active for this call. */
  fastMode?: boolean;
};
type PluginHookAgentEndEvent = {
  runId?: string;
  messages: unknown[];
  success: boolean;
  error?: string;
  durationMs?: number;
};
type PluginHookBeforeAgentFinalizeEvent = {
  runId?: string;
  sessionId: string;
  sessionKey?: string;
  turnId?: string;
  provider?: string;
  model?: string;
  cwd?: string;
  transcriptPath?: string;
  stopHookActive: boolean;
  lastAssistantMessage?: string;
  messages?: unknown[];
};
type PluginHookBeforeAgentFinalizeResult = {
  /**
   * continue: accept normal finalization.
   * revise: block finalization and ask the harness for another model pass.
   * finalize: force finalization even if another hook requested revision.
   */
  action?: "continue" | "revise" | "finalize";
  reason?: string;
  retry?: {
    instruction: string;
    idempotencyKey?: string;
    maxAttempts?: number;
  };
};
type PluginHookBeforeCompactionEvent = {
  messageCount: number;
  compactingCount?: number;
  tokenCount?: number;
  messages?: unknown[];
  sessionFile?: string;
};
type PluginHookBeforeResetEvent = {
  sessionFile?: string;
  messages?: unknown[];
  reason?: string;
};
type PluginHookAfterCompactionEvent = {
  messageCount: number;
  tokenCount?: number;
  compactedCount: number;
  sessionFile?: string;
  /** Physical session generation replaced by this compaction, when it rotated. */
  previousSessionId?: string;
};
type PluginHookInboundClaimResult = {
  handled: boolean;
  reply?: ReplyPayload$1;
};
type PluginHookBeforeDispatchEvent = {
  messageId?: string;
  content: string;
  body?: string;
  channel?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
  isGroup?: boolean;
  timestamp?: number;
};
type PluginHookBeforeDispatchContext = {
  messageId?: string;
  channelId?: string;
  accountId?: string;
  conversationId?: string;
  sessionKey?: string;
  senderId?: string;
  replyToId?: string;
  replyToIdFull?: string;
  replyToBody?: string;
  replyToSender?: string;
  replyToIsQuote?: boolean;
};
type PluginHookBeforeDispatchResult = {
  handled: boolean;
  text?: string;
};
type PluginHookReplyDispatchEvent = {
  ctx: FinalizedMsgContext;
  runId?: string;
  sessionKey?: string;
  toolsAllow?: string[];
  images?: Array<{
    data: string;
    mimeType: string;
  }>;
  inboundAudio: boolean;
  sessionTtsAuto?: TtsAutoMode;
  ttsChannel?: string;
  suppressUserDelivery?: boolean;
  suppressReplyLifecycle?: boolean;
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  shouldRouteToOriginating: boolean;
  originatingChannel?: string;
  originatingTo?: string;
  originatingAccountId?: string;
  originatingThreadId?: string | number;
  originatingChatType?: ChatType;
  shouldSendToolSummaries: boolean;
  shouldSendFullToolDetails: boolean;
  sendPolicy: "allow" | "deny";
  isTailDispatch?: boolean;
};
type PluginHookReplyDispatchContext = {
  cfg: OpenClawConfig;
  dispatcher: ReplyDispatcher;
  abortSignal?: AbortSignal;
  onReplyStart?: () => Promise<void> | void;
  recordProcessed: (outcome: "completed" | "skipped" | "error", opts?: {
    reason?: string;
    error?: string;
  }) => void;
  markIdle: (reason: string) => void;
};
type PluginHookReplyDispatchResult = {
  handled: boolean;
  queuedFinal: boolean;
  counts: Record<ReplyDispatchKind, number>;
};
/**
 * Per-turn execution state for the outbound reply, available to every harness
 * (embedded, CLI, Codex app-server) — sourced from the unified `runResult.meta`
 * at dispatch, not from the harness-specific `llm_output` hook. Lets a plugin
 * render a passive per-response footer without re-deriving run state.
 */
type PluginHookReplyUsageState = {
  provider?: string;
  model?: string;
  /** Resolved provider/model ref actually used (keeps the provider prefix). */
  resolvedRef?: string;
  /** Requested reasoning/think effort (e.g. "off" | "low" | "medium" | "high"). */
  reasoningEffort?: string;
  fastMode?: boolean;
  /** True when a model fallback was used for this turn. */
  fallbackUsed?: boolean;
  /** Owning agent + session for this reply. */
  agentId?: string;
  sessionId?: string;
  /** Chat surface kind (e.g. "direct" | "group"). */
  chatType?: string;
  /** Credential mode the turn ran under (e.g. "oauth" | "api_key"). */
  authMode?: string;
  /** Session model-override source, when a non-default model was pinned. */
  overrideSource?: string;
  /** Provider/model ref requested for the turn (vs resolvedRef actually used). */
  requested?: string;
  /** Estimated cost of this turn in USD, when a cost table is configured. */
  turnUsd?: number;
  /** Wall-clock duration of the turn in milliseconds. */
  durationMs?: number;
  /** Owning agent's configured identity (name/emoji/avatar), when set. */
  identity?: {
    name?: string;
    emoji?: string;
    avatar?: string;
  };
  compactionCount?: number;
  /** Effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number;
  /**
   * Actual context-window occupancy at the END of the turn — the final model
   * call's prompt tokens, NOT the per-turn aggregate. This is the value
   * `context.used_tokens` / `context.pct_used` must use: the aggregate prompt
   * total over a multi-call tool loop overstates occupancy (often beyond the
   * window). Absent on harnesses that don't report it (the contract then falls
   * back to the aggregate prompt total, which is correct for single-call turns).
   */
  contextUsedTokens?: number;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
  /**
   * Usage from the FINAL model call of the turn only — vs `usage`, which is the
   * turn aggregate summed across every tool-loop call. Lets a footer render the
   * last exchange's i/o + cache instead of the whole turn. Absent on harnesses
   * that don't report per-call usage.
   */
  lastUsage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    total?: number;
  };
};
type PluginHookReplyPayloadSendingEvent = {
  payload: PluginHookReplyPayload;
  kind: ReplyDispatchKind;
  channel?: string;
  sessionKey?: string;
  runId?: string;
  /**
   * Per-turn usage snapshot for live dispatcher delivery. Absent on durable
   * delivery/replay paths, and whenever no exact run correlation is available.
   */
  usageState?: PluginHookReplyUsageState;
};
type PluginHookReplyPayload = Omit<ReplyPayload$1, "trustedLocalMedia">;
type PluginHookReplyPayloadSendingContext = PluginHookMessageContext;
type PluginHookReplyPayloadSendingResult = {
  payload?: PluginHookReplyPayload;
  cancel?: boolean;
  reason?: string;
};
type PluginHookToolKind = "code_mode_exec";
type PluginHookToolInputKind = "javascript" | "typescript";
/** Host-derived identity for the message requester that initiated a tool call. */
type PluginHookToolRequesterContext = {
  /** Channel/plugin id, for example `discord` or `telegram`. */
  readonly channel?: string;
  /** Channel account used by the agent when multiple accounts are configured. */
  readonly accountId?: string;
  /** Channel-scoped sender id when the host received one. */
  readonly senderId?: string;
  /** True only when the host resolved the sender as an owner. */
  readonly senderIsOwner?: boolean;
  /** Provider-native role ids when the channel supplies them. */
  readonly roleIds?: readonly string[];
};
type PluginHookToolContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string;
  /** Aborts when the owning tool call is cancelled. Hook timeout expiry does not abort this signal. */
  abortSignal?: AbortSignal;
  trace?: DiagnosticTraceContext;
  toolName: string;
  /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind;
  /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
  toolInputKind?: PluginHookToolInputKind;
  toolCallId?: string;
  getSessionExtension?: (namespace: string) => PluginJsonValue | undefined;
  channelId?: string;
  /**
   * Message requester for this turn. Absent for non-message runs and harnesses
   * that cannot prove requester identity. Authorization hooks should fail
   * closed when a required field is absent.
   */
  requester?: PluginHookToolRequesterContext;
};
type PluginHookBeforeToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind;
  /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
  toolInputKind?: PluginHookToolInputKind;
  runId?: string;
  toolCallId?: string;
  /**
   * Optional best-effort destination path hints the host derived from `params`
   * for well-known tool envelopes (e.g. `apply_patch`).
   *
   * This is a convenience hint, not an authoritative parse result: the host's
   * extractor may be intentionally lenient and can return paths for malformed
   * or partial envelopes. Plugins may use `derivedPaths` as a fast path, but
   * should parse and validate `params` themselves when correctness or policy
   * decisions depend on the exact set of affected paths. Absent for tools the
   * host does not know how to derive paths for.
   */
  derivedPaths?: readonly string[];
};
type PluginHookAfterToolCallEvent = {
  toolName: string;
  params: Record<string, unknown>;
  runId?: string;
  toolCallId?: string;
  result?: unknown;
  error?: string;
  durationMs?: number;
};
type PluginHookToolResultPersistContext = {
  agentId?: string;
  sessionKey?: string;
  toolName?: string;
  toolCallId?: string;
};
type PluginHookToolResultPersistEvent = {
  toolName?: string;
  toolCallId?: string;
  message: AgentMessage;
  isSynthetic?: boolean;
};
type PluginHookToolResultPersistResult = {
  message?: AgentMessage;
};
type PluginHookBeforeMessageWriteEvent = {
  message: AgentMessage;
  sessionKey?: string;
  agentId?: string;
};
type PluginHookBeforeMessageWriteResult = {
  block?: boolean;
  message?: AgentMessage;
};
type PluginHookSessionContext = {
  agentId?: string;
  sessionId: string;
  sessionKey?: string;
};
type PluginHookSessionStartEvent = {
  sessionId: string;
  sessionKey?: string;
  resumedFrom?: string;
};
type PluginHookSessionEndReason = "new" | "reset" | "idle" | "daily" | "compaction" | "deleted" | "shutdown" | "restart" | "unknown";
type PluginHookSessionEndEvent = {
  sessionId: string;
  sessionKey?: string;
  messageCount: number;
  durationMs?: number;
  reason?: PluginHookSessionEndReason;
  sessionFile?: string;
  transcriptArchived?: boolean;
  nextSessionId?: string;
  nextSessionKey?: string;
};
type PluginHookSubagentContext = {
  runId?: string;
  childSessionKey?: string;
  requesterSessionKey?: string;
};
type PluginHookSubagentTargetKind = "subagent" | "acp";
type PluginHookSubagentRequester = {
  channel?: string;
  accountId?: string;
  to?: string;
  threadId?: string | number;
  /** Native source channel/conversation id, when distinct from the routable target. */
  channelId?: string | number;
  /** Native source message that initiated the parent run, when available. */
  messageId?: string | number;
};
type PluginHookSubagentSpawnBase = {
  childSessionKey: string;
  agentId: string;
  label?: string;
  mode: "run" | "session";
  requester?: PluginHookSubagentRequester;
  threadRequested: boolean;
};
type PluginHookSubagentDeliveryTargetEvent = {
  childSessionKey: string;
  requesterSessionKey: string;
  requesterOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
  childRunId?: string;
  spawnMode?: "run" | "session";
  expectsCompletionMessage: boolean;
};
/**
 * @deprecated Core route projection resolves subagent delivery targets from
 * `SessionBindingRecord` and channel `resolveDeliveryTarget`. This hook result
 * remains for plugin compatibility during the transition.
 */
type PluginHookSubagentDeliveryTargetResult = {
  origin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
};
type PluginHookSubagentSpawnedEvent = PluginHookSubagentSpawnBase & {
  runId: string;
  /** Fully resolved provider/model ref applied to the spawned child session. */
  resolvedModel?: string;
  /** Provider prefix parsed from resolvedModel when the ref includes one. */
  resolvedProvider?: string;
};
/** Portable channel presentation signal for one background child run. */
type PluginHookSubagentProgressEvent = {
  phase: "started";
  runId: string;
  childSessionKey: string;
  requester?: PluginHookSubagentRequester;
} | {
  phase: "ended";
  runId: string;
  childSessionKey: string;
  outcome: "ok" | "error" | "timeout" | "killed" | "unknown";
  requester?: PluginHookSubagentRequester;
};
type PluginHookSubagentEndedEvent = {
  targetSessionKey: string;
  targetKind: PluginHookSubagentTargetKind;
  reason: string;
  sendFarewell?: boolean;
  accountId?: string;
  runId?: string;
  endedAt?: number;
  outcome?: "ok" | "error" | "timeout" | "killed" | "reset" | "deleted";
  error?: string;
};
type PluginHookGatewayContext = {
  port?: number;
  config?: OpenClawConfig;
  workspaceDir?: string;
  getCron?: () => PluginHookGatewayCronService | undefined;
};
type PluginHookCronReconciledContext = PluginHookGatewayContext & {
  /** Aborts when this exact scheduler snapshot is superseded or the Gateway closes. */
  abortSignal: AbortSignal;
};
type PluginHookGatewayStartEvent = {
  port: number;
};
type PluginHookGatewayStopEvent = {
  reason?: string;
};
type PluginHookCronReconciledEvent = {
  reason: "startup" | "reload";
  enabled: boolean;
};
type PluginHookGatewayCronRunStatus = "ok" | "error" | "skipped";
type PluginHookGatewayCronDeliveryStatus = "not-requested" | "delivered" | "not-delivered" | "unknown";
type PluginHookGatewayCronJobState = {
  nextRunAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number;
  lastRunStatus?: PluginHookGatewayCronRunStatus;
  lastError?: string;
  lastDurationMs?: number;
  lastDelivered?: boolean;
  lastDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastDeliveryError?: string;
  deliverySuppressionReason?: string;
  lastFailureNotificationDelivered?: boolean;
  lastFailureNotificationDeliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  lastFailureNotificationDeliveryError?: string;
  streamStatus?: "starting" | "running" | "restarting" | "stopped" | "disabled" | "error";
  streamError?: string;
  streamConsecutiveFailures?: number;
  streamRestartExhausted?: boolean;
  streamDroppedBatches?: number;
  streamCoalescedBatches?: number;
  streamLastStartedAtMs?: number;
  streamLastExitAtMs?: number;
};
type PluginHookGatewayCronJob = {
  id: string;
  declarationKey?: string;
  /** Agent id that owns this cron job. */
  agentId?: string;
  name?: string;
  description?: string;
  enabled?: boolean;
  schedule?: {
    kind: "cron";
    expr?: string;
    tz?: string;
    staggerMs?: number;
  } | {
    kind: "at";
    at?: string;
  } | {
    kind: "every";
    everyMs?: number;
    anchorMs?: number;
  } | {
    kind: "on-exit";
    command?: string;
    cwd?: string;
  } | {
    kind: "stream";
    command?: string[];
    cwd?: string;
    mode?: "line" | "match";
    match?: string;
    batchMs?: number;
    maxBatchBytes?: number;
  };
  sessionTarget?: string;
  wakeMode?: string;
  payload?: {
    kind?: string;
    text?: string;
  };
  state?: PluginHookGatewayCronJobState;
  createdAtMs?: number;
  updatedAtMs?: number;
};
type PluginHookCronChangedEvent = {
  action: "added" | "updated" | "removed" | "started" | "finished" | "scheduled";
  jobId: string;
  job?: PluginHookGatewayCronJob;
  /** Top-level session target for downstream routing (mirrors job.sessionTarget). */
  sessionTarget?: string;
  /** Agent id that owns this cron job (mirrors job.agentId). */
  agentId?: string;
  runAtMs?: number;
  durationMs?: number;
  status?: PluginHookGatewayCronRunStatus;
  completionStatus?: "succeeded" | "failed" | "unknown";
  error?: string;
  summary?: string;
  delivered?: boolean;
  deliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  deliveryError?: string;
  deliverySuppressionReason?: string;
  sessionId?: string;
  sessionKey?: string;
  runId?: string;
  nextRunAtMs?: number;
  model?: string;
  provider?: string;
};
type PluginHookGatewayCronCreateInput = {
  declarationKey?: string;
  name: string;
  description: string;
  enabled: boolean;
  schedule: {
    kind: string;
    expr: string;
    tz?: string;
  };
  sessionTarget: string;
  wakeMode: string;
  payload: {
    kind: string;
    text?: string;
  };
};
type PluginHookGatewayCronUpdateInput = Partial<PluginHookGatewayCronCreateInput>;
type PluginHookGatewayCronRemoveResult = {
  removed?: boolean;
};
type PluginHookGatewayCronService = {
  list: (opts?: {
    includeDisabled?: boolean;
  }) => Promise<PluginHookGatewayCronJob[]>;
  add: (input: PluginHookGatewayCronCreateInput) => Promise<unknown>;
  update: (id: string, patch: PluginHookGatewayCronUpdateInput) => Promise<unknown>;
  remove: (id: string) => Promise<PluginHookGatewayCronRemoveResult>;
  removeStaleJobFamily: (family: {
    declarationKey: string;
    name: string;
    ownerPluginTag: string;
  }) => Promise<number>;
};
type PluginInstallTargetType = "skill" | "plugin";
type PluginInstallRequestKind = "skill-install" | "plugin-dir" | "plugin-archive" | "plugin-file" | "plugin-npm" | "plugin-git";
type PluginInstallSourcePathKind = "file" | "directory";
type PluginInstallFinding = {
  ruleId: string;
  severity: "info" | "warn" | "critical";
  file: string;
  line: number;
  message: string;
};
type PluginHookBeforeInstallRequest = {
  kind: PluginInstallRequestKind;
  mode: "install" | "update";
  requestedSpecifier?: string;
};
type PluginHookBeforeInstallBuiltinScan = {
  status: "ok" | "error";
  scannedFiles: number;
  critical: number;
  warn: number;
  info: number;
  findings: PluginInstallFinding[];
  error?: string;
};
type PluginHookBeforeInstallSkillInstallSpec = {
  id?: string;
  kind: "brew" | "node" | "go" | "uv" | "download";
  label?: string;
  bins?: string[];
  os?: string[];
  formula?: string;
  package?: string;
  module?: string;
  url?: string;
  sha256?: string;
  archive?: string;
  extract?: boolean;
  stripComponents?: number;
  targetDir?: string;
};
type PluginHookBeforeInstallSkill = {
  installId: string;
  installSpec?: PluginHookBeforeInstallSkillInstallSpec;
};
type PluginHookBeforeInstallPlugin = {
  pluginId: string;
  contentType: "bundle" | "package" | "file";
  packageName?: string;
  manifestId?: string;
  version?: string;
  extensions?: string[];
};
type PluginHookBeforeInstallContext = {
  targetType: PluginInstallTargetType;
  requestKind: PluginInstallRequestKind;
  origin?: string;
};
type PluginHookBeforeInstallEvent = {
  targetType: PluginInstallTargetType;
  targetName: string;
  sourcePath: string;
  sourcePathKind: PluginInstallSourcePathKind;
  origin?: string;
  request: PluginHookBeforeInstallRequest;
  builtinScan: PluginHookBeforeInstallBuiltinScan;
  skill?: PluginHookBeforeInstallSkill;
  plugin?: PluginHookBeforeInstallPlugin;
};
type PluginHookBeforeInstallResult = {
  findings?: PluginInstallFinding[];
  block?: boolean;
  blockReason?: string;
};
/** Event payload for the before_agent_run gate hook. */
type PluginHookBeforeAgentRunEvent = {
  /** The user's message that triggered this run. */
  prompt: string;
  /** Loaded session history before the current prompt is submitted. */
  messages: unknown[];
  /** Active system prompt prepared for this run. */
  systemPrompt?: string;
  /** Account identity when available. */
  accountId?: string;
  /** Channel the message came from. */
  channelId?: string;
  /** Sender identity when available. */
  senderId?: string;
  /** Trusted sender identity bit when available. */
  senderIsOwner?: boolean;
};
/** Result type for before_agent_run. Returns pass/block or void (= pass). */
type PluginHookBeforeAgentRunResult = InputGateDecision | void;
type PluginHookResolveExecEnvEvent = {
  sessionKey?: string;
  toolName: "exec";
  host: "gateway" | "sandbox" | "node";
};
type PluginHookResolveExecEnvContext = PluginHookAgentContext;
type PluginHookHandlerMap = {
  agent_turn_prepare: (event: PluginAgentTurnPrepareEvent, ctx: PluginHookAgentContext) => Promise<PluginAgentTurnPrepareResult | void> | PluginAgentTurnPrepareResult | void;
  before_model_resolve: (event: PluginHookBeforeModelResolveEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeModelResolveResult | void> | PluginHookBeforeModelResolveResult | void;
  before_prompt_build: (event: PluginHookBeforePromptBuildEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforePromptBuildResult | void> | PluginHookBeforePromptBuildResult | void;
  before_agent_reply: (event: PluginHookBeforeAgentReplyEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentReplyResult | void> | PluginHookBeforeAgentReplyResult | void;
  model_call_started: (event: PluginHookModelCallStartedEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  model_call_ended: (event: PluginHookModelCallEndedEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  llm_input: (event: PluginHookLlmInputEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  llm_output: (event: PluginHookLlmOutputEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_agent_finalize: (event: PluginHookBeforeAgentFinalizeEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentFinalizeResult | void> | PluginHookBeforeAgentFinalizeResult | void;
  agent_end: (event: PluginHookAgentEndEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_compaction: (event: PluginHookBeforeCompactionEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  after_compaction: (event: PluginHookAfterCompactionEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  before_reset: (event: PluginHookBeforeResetEvent, ctx: PluginHookAgentContext) => Promise<void> | void;
  inbound_claim: (event: PluginHookInboundClaimEvent, ctx: PluginHookInboundClaimContext) => Promise<PluginHookInboundClaimResult | void> | PluginHookInboundClaimResult | void;
  channel_pairing_requested: (event: PluginHookChannelPairingRequestedEvent, ctx: PluginHookChannelPairingContext) => Promise<void> | void;
  before_dispatch: (event: PluginHookBeforeDispatchEvent, ctx: PluginHookBeforeDispatchContext) => Promise<PluginHookBeforeDispatchResult | void> | PluginHookBeforeDispatchResult | void;
  reply_dispatch: (event: PluginHookReplyDispatchEvent, ctx: PluginHookReplyDispatchContext) => Promise<PluginHookReplyDispatchResult | void> | PluginHookReplyDispatchResult | void;
  reply_payload_sending: (event: PluginHookReplyPayloadSendingEvent, ctx: PluginHookReplyPayloadSendingContext) => Promise<PluginHookReplyPayloadSendingResult | void> | PluginHookReplyPayloadSendingResult | void;
  message_received: (event: PluginHookMessageReceivedEvent, ctx: PluginHookMessageContext) => Promise<void> | void;
  message_sending: (event: PluginHookMessageSendingEvent, ctx: PluginHookMessageContext) => Promise<PluginHookMessageSendingResult | void> | PluginHookMessageSendingResult | void;
  message_sent: (event: PluginHookMessageSentEvent, ctx: PluginHookMessageContext) => Promise<void> | void;
  before_tool_call: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => Promise<PluginHookBeforeToolCallResult | void> | PluginHookBeforeToolCallResult | void;
  after_tool_call: (event: PluginHookAfterToolCallEvent, ctx: PluginHookToolContext) => Promise<void> | void;
  tool_result_persist: (event: PluginHookToolResultPersistEvent, ctx: PluginHookToolResultPersistContext) => PluginHookToolResultPersistResult | void;
  before_message_write: (event: PluginHookBeforeMessageWriteEvent, ctx: {
    agentId?: string;
    sessionKey?: string;
  }) => PluginHookBeforeMessageWriteResult | void;
  session_start: (event: PluginHookSessionStartEvent, ctx: PluginHookSessionContext) => Promise<void> | void;
  session_end: (event: PluginHookSessionEndEvent, ctx: PluginHookSessionContext) => Promise<void> | void;
  subagent_delivery_target: (event: PluginHookSubagentDeliveryTargetEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentDeliveryTargetResult | void> | PluginHookSubagentDeliveryTargetResult | void;
  subagent_spawned: (event: PluginHookSubagentSpawnedEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  subagent_progress: (event: PluginHookSubagentProgressEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  subagent_ended: (event: PluginHookSubagentEndedEvent, ctx: PluginHookSubagentContext) => Promise<void> | void;
  gateway_start: (event: PluginHookGatewayStartEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  gateway_stop: (event: PluginHookGatewayStopEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  heartbeat_prompt_contribution: (event: PluginHeartbeatPromptContributionEvent, ctx: PluginHookAgentContext) => Promise<PluginHeartbeatPromptContributionResult | void> | PluginHeartbeatPromptContributionResult | void;
  cron_reconciled: (event: PluginHookCronReconciledEvent, ctx: PluginHookCronReconciledContext) => Promise<void> | void;
  cron_changed: (event: PluginHookCronChangedEvent, ctx: PluginHookGatewayContext) => Promise<void> | void;
  skill_proposal_evaluate: (event: PluginHookSkillProposalEvaluateEvent, ctx: PluginHookSkillContext) => Promise<PluginHookSkillProposalEvaluateResult | void> | PluginHookSkillProposalEvaluateResult | void;
  skill_proposal_changed: (event: PluginHookSkillProposalChangedEvent, ctx: PluginHookSkillContext) => Promise<void> | void;
  skill_changed: (event: PluginHookSkillChangedEvent, ctx: PluginHookSkillContext) => Promise<void> | void;
  before_install: (event: PluginHookBeforeInstallEvent, ctx: PluginHookBeforeInstallContext) => Promise<PluginHookBeforeInstallResult | void> | PluginHookBeforeInstallResult | void;
  before_agent_run: (event: PluginHookBeforeAgentRunEvent, ctx: PluginHookAgentContext) => Promise<PluginHookBeforeAgentRunResult> | PluginHookBeforeAgentRunResult;
  resolve_exec_env: (event: PluginHookResolveExecEnvEvent, ctx: PluginHookResolveExecEnvContext) => Promise<Record<string, string> | void> | Record<string, string> | void;
};
type PluginHookRegistration<K extends PluginHookName = PluginHookName> = {
  pluginId: string;
  registrationId?: string;
  hookName: K;
  handler: PluginHookHandlerMap[K];
  matcher?: PluginToolMatcher;
  priority?: number;
  timeoutMs?: number;
  eligibleTriggers?: readonly PluginHookAgentTrigger[];
  requiresToolAuthority?: true;
  source: string;
};
//#endregion
//#region src/config/sessions/store-maintenance.d.ts
type ResolvedSessionMaintenanceConfig = {
  mode: SessionMaintenanceMode;
  pruneAfterMs: number;
  archiveDashboardAfterMs: number | null;
  maxEntries: number;
  modelRunPruneAfterMs: number;
  preserveRecentMs?: number | null;
  resetArchiveRetentionMs: number | null;
  maxDiskBytes: number | null;
  highWaterBytes: number | null;
};
type ResolvedSessionMaintenanceConfigInput = Omit<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs"> & Partial<Pick<ResolvedSessionMaintenanceConfig, "archiveDashboardAfterMs" | "modelRunPruneAfterMs">>;
//#endregion
//#region src/config/sessions/session-accessor.types.d.ts
interface SessionTranscriptRuntimeTarget {
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
}
//#endregion
//#region src/agents/sessions/session-manager-types.d.ts
interface SessionHeader {
  type: "session";
  version?: number;
  id: string;
  timestamp: string;
  cwd: string;
  parentSession?: string;
}
interface NewSessionOptions {
  id?: string;
  parentSession?: string;
}
interface SessionEntryBase {
  type: string;
  id: string;
  parentId: string | null;
  timestamp: string;
  /** This row consumes the raw side cursor instead of the visible leaf. */
  appendMode?: "side";
}
interface SessionMessageEntry extends SessionEntryBase {
  type: "message";
  message: AgentMessage;
}
interface ThinkingLevelChangeEntry extends SessionEntryBase {
  type: "thinking_level_change";
  thinkingLevel: string;
}
interface ModelChangeEntry extends SessionEntryBase {
  type: "model_change";
  provider: string;
  modelId: string;
}
interface CompactionEntry<T = unknown> extends SessionEntryBase {
  type: "compaction";
  summary: string;
  firstKeptEntryId: string;
  tokensBefore: number;
  /** Extension-specific data, such as artifact indexes or version markers. */
  details?: T;
  /** True for extension-generated compaction entries. */
  fromHook?: boolean;
}
type ResetReason = "new" | "reset" | "idle" | "daily" | "cron-stale";
interface ResetEntry extends SessionEntryBase {
  type: "reset";
  reason: ResetReason;
  firstKeptEntryId?: string;
}
interface BranchSummaryEntry<T = unknown> extends SessionEntryBase {
  type: "branch_summary";
  fromId: string;
  summary: string;
  /** Extension-specific data that is not sent to the model. */
  details?: T;
  /** True for extension-generated branch summaries. */
  fromHook?: boolean;
}
/** Extension state that is persisted but excluded from model context. */
interface CustomEntry<T = unknown> extends SessionEntryBase {
  type: "custom";
  customType: string;
  data?: T;
}
interface LabelEntry extends SessionEntryBase {
  type: "label";
  targetId: string;
  label: string | undefined;
}
interface SessionInfoEntry extends SessionEntryBase {
  type: "session_info";
  name?: string;
}
/** Extension message that participates in model context. */
interface CustomMessageEntry<T = unknown> extends SessionEntryBase {
  type: "custom_message";
  customType: string;
  content: string | (TextContent | ImageContent)[];
  details?: T;
  display: boolean;
}
type SessionEntry = SessionMessageEntry | ThinkingLevelChangeEntry | ModelChangeEntry | CompactionEntry | ResetEntry | BranchSummaryEntry | CustomEntry | CustomMessageEntry | LabelEntry | SessionInfoEntry;
type FileEntry = SessionHeader | SessionEntry;
type AppendPersistenceOptions = {
  appendIntent?: "active-branch";
  config?: OpenClawConfig;
  idempotencyLookup?: "scan" | "scan-assistant" | "caller-checked";
  invalidateSerializedPrefixCache?: boolean;
};
interface SessionTreeNode {
  entry: SessionEntry;
  children: SessionTreeNode[];
  label?: string;
  labelTimestamp?: string;
}
interface SessionContext {
  messages: AgentMessage[];
  thinkingLevel: string;
  model: {
    provider: string;
    modelId: string;
  } | null;
}
type PreservedOpaqueFileEntry = {
  index: number;
  record: unknown;
};
type SessionLeafControl = {
  type: "leaf";
  id: string;
  parentId: string | null;
  timestamp: string;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
};
//#endregion
//#region src/agents/sessions/session-manager-codec.d.ts
declare function parseOpaqueLeafEntry(record: unknown): {
  id: string;
  parentId: string | null;
  targetId: string | null;
  appendParentId?: string | null;
  appendMode?: "side";
} | undefined;
//#endregion
//#region src/agents/sessions/session-manager-core.d.ts
type SessionManagerPersistenceTarget = SessionTranscriptRuntimeTarget;
type SessionManagerBoundedContextLimits = {
  maxBytes: number;
  maxEvents: number;
};
declare class SessionManagerCore {
  migrated: boolean;
  protected sessionId: string;
  protected cwd: string;
  protected fileEntries: FileEntry[];
  protected opaqueFileEntries: PreservedOpaqueFileEntry[];
  protected byId: Map<string, SessionEntry>;
  protected opaqueParentsById: Map<string, string | null>;
  protected logicalParentsById: Map<string, string | null>;
  protected invalidLeafControlIds: Set<string>;
  protected labelsById: Map<string, string>;
  protected labelTimestampsById: Map<string, string>;
  protected leafId: string | null;
  protected appendParentId: string | null;
  protected appendMode: "side" | undefined;
  protected pendingDeliberateAppend: boolean;
  protected persistenceTarget: SessionManagerPersistenceTarget | undefined;
  protected persistenceHeaderPending: boolean;
  protected boundedContextLimits: SessionManagerBoundedContextLimits | undefined;
  protected boundedContextIncomplete: boolean;
  protected persistedBoundaryCount: number | undefined;
  constructor(cwd: string, persistenceTarget?: SessionManagerPersistenceTarget, loadedEntries?: FileEntry[], boundedContext?: {
    boundaryCount: number;
    limits: SessionManagerBoundedContextLimits;
  });
  setSessionTarget(target: SessionManagerPersistenceTarget): void;
  /** Active-only loads can omit sibling rows even when they fit the context limits. */
  protected ensureCompletePersistedHistory(): void;
  protected setLoadedSessionTarget(target: SessionManagerPersistenceTarget | undefined, entries: FileEntry[]): void;
  reloadPersistedTranscript(): void;
  newSession(options?: NewSessionOptions): string | undefined;
  private initializeSession;
  protected resolveOpaqueLeafTargetId(targetId: string | null): string | null;
  protected resolveOpaqueAppendParentId(parentId: string | null): string | null;
  protected resolveOpaqueLeafControl(leafEntry: ReturnType<typeof parseOpaqueLeafEntry>): {
    leafId: string | null;
    appendParentId: string | null;
    appendMode?: "side";
  } | undefined;
  protected buildIndex(): void;
  protected resolveCanonicalParentId(parentId: string | null): string | null;
  protected normalizeEntryParent(entry: SessionEntry): SessionEntry;
  private findFirstCanonicalDescendantOnBranch;
  private findFirstCanonicalDescendant;
  protected resolveBranchTargetId(branchFromId: string): string | null | undefined;
  protected clampOpaqueFileEntryIndexes(): void;
  protected createLeafControl(parentId: string | null, appendParentId?: string | null, appendMode?: "side"): SessionLeafControl;
  protected rememberLeafControl(leafEntry: SessionLeafControl): void;
  getAppendParentId(): string | null;
  getAppendMode(): "side" | undefined;
  protected getPersistedFileEntries(leafAppendParentId?: string | null, leafAppendMode?: "side"): unknown[];
  getPersistedEntries(): unknown[];
  clearPreservedOpaqueFileEntries(): void;
  protected replacePersistedTranscript(options?: {
    leafAppendParentId?: string | null;
    leafAppendMode?: "side";
  }): void;
  /** SQLite appends are synchronous; retained for the AgentSession contract. */
  protected flushPendingPersistence(): void;
  isPersisted(): boolean;
  getCwd(): string;
  getSessionId(): string;
  getSessionTarget(): SessionManagerPersistenceTarget | undefined;
}
//#endregion
//#region src/agents/sessions/session-manager-persistence.d.ts
type PersistRecordResult = string | null | undefined | {
  anchor?: TranscriptEntryAnchor;
  adoptedMessageId?: string;
  effectiveParentId: string | null;
};
declare class SessionManagerPersistence extends SessionManagerCore {
  removeTrailingEntries(predicate: (entry: SessionEntry) => boolean, options?: {
    preserveTrailing?: (entry: SessionEntry) => boolean;
  }): number;
  protected persistRecord(entry: unknown, options?: AppendPersistenceOptions): PersistRecordResult;
  persist(entry: SessionEntry, options?: AppendPersistenceOptions): PersistRecordResult;
  private persistSqliteRecord;
}
//#endregion
//#region src/agents/sessions/session-manager-entries.d.ts
declare class SessionManagerEntries extends SessionManagerPersistence {
  protected appendEntry(entry: SessionEntry, options?: AppendPersistenceOptions): TranscriptEntryAnchor | undefined;
  private resolveCurrentKeyedUserId;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendMessageWithTranscriptAnchor(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): {
    entryId: string;
    anchor?: TranscriptEntryAnchor;
  };
  appendThinkingLevelChange(thinkingLevel: string): string;
  appendModelChange(provider: string, modelId: string): string;
  appendCompaction(summary: string, firstKeptEntryId: string, tokensBefore: number, details?: unknown, fromHook?: boolean): string;
  appendResetBoundary(reason: ResetReason, firstKeptEntryId?: string): string;
  appendCustomEntry(customType: string, data?: unknown): string;
  appendSessionInfo(name: string): string;
  getSessionName(): string | undefined;
  appendCustomMessageEntry(customType: string, content: string | (TextContent | ImageContent)[], display: boolean, details?: unknown): string;
  getLeafId(): string | null;
  appendLeafControl(params: {
    targetId: string | null;
    appendParentId: string | null;
    appendMode?: "side";
  }): SessionLeafControl;
  getLeafEntry(): SessionEntry | undefined;
  getEntry(id: string): SessionEntry | undefined;
  getChildren(parentId: string): SessionEntry[];
  getLabel(id: string): string | undefined;
  appendLabelChange(targetId: string, label: string | undefined): string;
  getBranch(fromId?: string): SessionEntry[];
  buildSessionContext(): SessionContext;
  getBoundaryCount(): number;
  getHeader(): SessionHeader | null;
  getEntries(): SessionEntry[];
  getTree(): SessionTreeNode[];
  branch(branchFromId: string): void;
  resetLeaf(): void;
  branchWithSummary(branchFromId: string | null, summary: string, details?: unknown, fromHook?: boolean): string;
}
//#endregion
//#region src/agents/sessions/session-manager-branching.d.ts
declare class SessionManagerBranching extends SessionManagerEntries {
  private collectBranchedSessionPath;
  createBranchedSession(leafId: string): Promise<string | undefined>;
}
//#endregion
//#region src/agents/sessions/session-manager.d.ts
declare class SessionManager extends SessionManagerBranching {
  private constructor();
  /** Makes pending append-oriented persistence durable without rewriting committed entries. */
  flushPendingPersistence(): void;
  appendMessage(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): string;
  appendMessageWithTranscriptAnchor(message: Message | CustomMessage | BashExecutionMessage, options?: AppendPersistenceOptions): {
    entryId: string;
    anchor?: TranscriptEntryAnchor;
  };
  static open(target: SessionTranscriptRuntimeTarget, cwdOverride?: string, contextLimits?: SessionManagerBoundedContextLimits): SessionManager;
  /** Opens only the selected model-context tail while preserving the complete durable transcript. */
  static openBounded(target: SessionTranscriptRuntimeTarget, options: SessionManagerBoundedContextLimits & {
    cwd?: string;
  }): SessionManager;
  /** Appends to the current transcript leaf without hydrating its history. */
  static appendMessageToTranscript(target: SessionTranscriptRuntimeTarget, message: Message | CustomMessage | BashExecutionMessage, options?: Pick<AppendPersistenceOptions, "config">): string;
  static inMemory(cwd?: string): SessionManager;
  static fromEntries(entries: readonly unknown[], cwdOverride?: string): SessionManager;
}
type ReadonlySessionManager = Pick<SessionManager, "getCwd" | "getSessionId" | "getSessionTarget" | "getLeafId" | "getAppendParentId" | "getAppendMode" | "getLeafEntry" | "getEntry" | "getLabel" | "getBranch" | "getHeader" | "getEntries" | "getTree" | "getSessionName">;
//#endregion
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
} | {
  kind: "channel-final-suppressed";
  reason: "stale-foreground";
  sourceMessageId?: string;
};
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
  /** Whether this message is being sent in a group/channel context */
  isGroup?: boolean;
  /** Group or channel identifier for correlation with received events */
  groupId?: string;
};
//#endregion
//#region src/infra/outbound/prepared-batch.d.ts
declare const PREPARED_OUTBOUND_BATCH_SCHEMA_VERSION: 1;
type PreparedOutboundAcceptedEntry = {
  sourceIndex: number;
  status: "accepted";
  payload: ReplyPayload$1;
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
  sourcePayloadCount: number;
  /** True only when accepted payloads already passed post-policy channel normalization. */
  channelNormalized?: true;
  runId?: string;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
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
  policyKey?: string;
  /** Explicit conversation type for policy resolution when a session key is generic. */
  conversationType?: SilentReplyConversationType;
  /**
   * Caller-declared destination conversation kind for metadata-only audit
   * projection. Never derived from session-key parsing: policy keys can name
   * an acted-on session that is not the delivery destination, and a wrong
   * "direct" here over-collects under audit.messages="direct".
   */
  conversationKind?: "direct" | "group" | "channel";
  /** Active agent id used for workspace-scoped media roots. */
  agentId?: string;
  /** Originating account id used for requester-scoped group policy resolution. */
  requesterAccountId?: string;
  /** Originating sender id used for sender-scoped outbound media policy. */
  requesterSenderId?: string;
  /** Originating sender display name for name-keyed sender policy matching. */
  requesterSenderName?: string;
  /** Originating sender username for username-keyed sender policy matching. */
  requesterSenderUsername?: string;
  /** Originating sender E.164 phone number for e164-keyed sender policy matching. */
  requesterSenderE164?: string;
};
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
//#endregion
//#region src/plugins/runtime/subagent-requester-context.d.ts
type PluginSubagentRequesterContext = Readonly<{
  sessionKey: string;
  origin: Readonly<DeliveryContext>;
}>;
//#endregion
//#region src/infra/outbound/message-sent-hook.d.ts
type MessageSentEvent = {
  success: boolean;
  content: string;
  error?: string;
  messageId?: string;
};
//#endregion
//#region src/infra/outbound/reply-payload-parts.d.ts
/** Derived sendability facts for text/media outbound payload delivery. */
type SendableOutboundReplyParts = {
  /** Raw text selected for delivery before trimming. */
  text: string;
  /** Text after trimming whitespace for sendability checks. */
  trimmedText: string;
  /** Normalized non-empty media URLs. */
  mediaUrls: string[];
  /** Number of normalized media URLs. */
  mediaCount: number;
  /** Whether trimmed text is sendable. */
  hasText: boolean;
  /** Whether at least one media URL is sendable. */
  hasMedia: boolean;
  /** Whether the payload has any sendable text or media. */
  hasContent: boolean;
};
/** Normalize reply payload text/media into a trimmed, sendable shape for delivery paths. */
declare function resolveSendableOutboundReplyParts(payload: {
  text?: string;
  mediaUrls?: string[];
  mediaUrl?: string;
}, options?: {
  text?: string;
}): SendableOutboundReplyParts;
//#endregion
//#region src/plugin-sdk/reply-payload.d.ts
/** Plugin-facing reply payload without core-only trusted local media internals. */
type ReplyPayload = Omit<ReplyPayload$1, "trustedLocalMedia">;
//#endregion
//#region src/infra/outbound/payloads.d.ts
/** Runtime-ready outbound payload after text/media/rich-content normalization. */
type NormalizedOutboundPayload = {
  text: string;
  mediaUrls: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload$1["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload$1["location"];
  /** Hook-only content for audio-only TTS payloads. Never used as channel text/caption. */
  hookContent?: string;
};
/** JSON-safe outbound payload projection used for envelopes and diagnostics. */
type OutboundPayloadJson = {
  text: string;
  mediaUrl: string | null;
  mediaUrls?: string[];
  audioAsVoice?: boolean;
  presentation?: MessagePresentation;
  presentationTextMode?: ReplyPayload$1["presentationTextMode"];
  delivery?: ReplyPayloadDelivery;
  interactive?: LegacyInteractiveReply;
  channelData?: Record<string, unknown>;
  location?: ReplyPayload$1["location"];
};
/** Prepared payload entry that keeps source indexing plus reusable projections. */
type OutboundPayloadPlan = {
  sourceIndex: number;
  payload: ReplyPayload$1;
  parts: ReturnType<typeof resolveSendableOutboundReplyParts>;
  hasPresentation: boolean;
  hasInteractive: boolean;
  hasChannelData: boolean;
};
/** Projects a payload plan into JSON-safe envelope/debug payloads. */
declare function projectOutboundPayloadPlanForJson(plan: readonly OutboundPayloadPlan[]): OutboundPayloadJson[];
//#endregion
//#region src/infra/outbound/deliver-contracts.d.ts
type ConversationDeliveryAttemptAuthority = Omit<Extract<DurableDeliveryCompletion, {
  kind: "conversation";
}>, "kind">;
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
  payloads: ReplyPayload$1[];
  /** Admitted run correlation copied into the prepared durable batch. */
  runId?: string;
  /** @internal Exact admitted execution provenance copied into durable custody. */
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
  /** @internal Canonical post-policy batch used by queue recovery and physical delivery. */
  preparedBatch?: PreparedOutboundBatch;
  reply?: OutboundReplyFacts;
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
  onPayload?: (payload: NormalizedOutboundPayload) => void;
  /** @internal Reports the effective payload only after an identified platform send. */
  onDeliveredPayload?: (payload: NormalizedOutboundPayload) => void;
  onPayloadDeliveryOutcome?: (outcome: OutboundPayloadDeliveryOutcome) => void;
  /** @internal Runs after each identified platform result, before further fallible work. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
  /** @internal Reports a settled native payload for post-terminal message_sent observation. */
  onMessageSentEvent?: (event: MessageSentEvent, sourceIndex: number) => void;
  /** @internal Persists ambiguous-send state immediately before platform I/O. */
  onPlatformSendStart?: (route: PlatformSendRoute, sourceIndex?: number) => Promise<void>;
  /** @internal Opaque durable intent id forwarded to provider reconciliation hooks. */
  deliveryQueueId?: string;
  /** @internal Stable producer id used to make queue creation idempotent across crashes. */
  deliveryIntentId?: string;
  /** @internal Retain the completed receipt for a producer-owned replayable intent. */
  completionRetention?: DeliveryQueueCompletionRetention;
  /** @internal Producer-specific durable recovery attempt budget. */
  maxRetries?: number;
  /** @internal Retry this producer's pending intent only when no platform send began. */
  reusePendingDeliveryIntent?: boolean;
  /** @internal Serializable owner state finalized after live or recovered delivery. */
  deliveryCompletion?: DurableDeliveryCompletion;
  /** @internal The caller resends proven-not-sent payloads itself, so recovery must not. */
  deliveryRetryOwner?: "caller";
  /** @internal Ephemeral route authority for a recovered attempt; never owns completion. */
  conversationDeliveryAttemptAuthority?: ConversationDeliveryAttemptAuthority;
  /** @internal Revalidates authority once per durable queue execution, before adapter fanout. */
  onDeliveryAttempt?: () => Promise<void>;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Recheck the concrete post-hook send shape before platform I/O. */
  requiredUnknownSendReconciliation?: boolean;
  /** @internal Caller preflight explicitly required provider unknown-send reconciliation. */
  requireUnknownSendReconciliation?: boolean;
  /** @internal Revalidate caller authority before direct adapter code can run. */
  onDirectAdapterHandoff?: () => Promise<void>;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** Session/agent context used for hooks and media local-root scoping. */
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
  replyToId?: string | null;
  replyToMode?: ReplyToMode;
  /** @internal Skip write-ahead queue (used by crash-recovery to avoid re-enqueueing). */
  skipQueue?: boolean;
  /** @internal Fence recovery ownership at the same provider boundary as live sends. */
  deliveryProducerClaimId?: string;
  /** @internal Keep the exact live producer claim alive during platform preparation. */
  deliveryProducerLeaseRequired?: boolean;
  /** @internal Recovery already ran provider admission after its pending-row re-read. */
  deferredDeliveryAdmissionPassed?: true;
  /** @internal State directory that owns the existing recovery queue entry. */
  deliveryQueueStateDir?: string;
  /** @internal Let recovery run commit hooks after it has acked the recovered queue entry. */
  deferCommitHooks?: boolean;
  queuePolicy?: OutboundDeliveryQueuePolicy;
  renderedBatchPlan?: QueuedRenderedMessageBatchPlan;
  onDeliveryIntent?: (intent: OutboundDeliveryIntent) => void;
};
//#endregion
//#region src/media/image-ops.d.ts
/** JPEG resize request passed through the media-runtime/plugin SDK surface. */
type ResizeToJpegParams = {
  buffer: Buffer;
  maxSide: number;
  quality: number;
  withoutEnlargement?: boolean;
};
/** Fully probes display dimensions through Rastermill when header-only metadata is insufficient. */
declare function getImageMetadata(buffer: Buffer): Promise<ImageMetadata | null>;
/** Resizes or encodes image bytes as JPEG through the shared image processor. */
declare function resizeToJpeg(params: ResizeToJpegParams): Promise<Buffer>;
//#endregion
//#region packages/retry/src/index.d.ts
type RetryConfig = {
  attempts?: number;
  minDelayMs?: number;
  maxDelayMs?: number;
  /** Fractional symmetric spread or full jitter. */
  jitter?: number | "full";
};
type RetryDelayContext = {
  attempt: number;
  maxAttempts: number;
  err: unknown;
  label?: string;
};
type RetryInfo = RetryDelayContext & {
  delayMs: number;
};
type RetryOptions = RetryConfig & {
  label?: string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  retryAfterMs?: (err: unknown) => number | undefined;
  retryAfterMaxDelayMs?: number;
  delayMs?: number | ((context: RetryDelayContext) => number);
  onRetry?: (info: RetryInfo) => unknown;
  random?: () => number;
  sleep?: (ms: number) => Promise<void>;
};
//#endregion
//#region src/media/store.d.ts
/** Restores the caller-facing filename from media-store paths with embedded UUID suffixes. */
declare function extractOriginalFilename(filePath: string): string;
/** Media-store file metadata returned after bytes are persisted under a safe media ID. */
type SavedMedia = {
  id: string;
  path: string;
  size: number;
  contentType?: string;
};
/** Saves an in-memory media buffer under a UUID-backed media ID. */
declare function saveMediaBuffer(buffer: Buffer, contentType?: string, subdir?: string, maxBytes?: number, originalFilename?: string, detectionFilePathHint?: string): Promise<SavedMedia>;
//#endregion
//#region src/media/fetch.d.ts
/** Remote media bytes plus metadata before they are persisted to the media store. */
type FetchMediaResult = {
  buffer: Buffer;
  contentType?: string;
  fileName?: string;
};
/** Saved media record enriched with the best remote filename candidate. */
type SavedRemoteMedia = SavedMedia & {
  fileName?: string;
};
/** Retry policy applied around the complete guarded fetch and body read/save operation. */
type MediaFetchRetryOptions = RetryOptions;
/** Fetch-compatible injection point used by tests and guarded network callers. */
type FetchLike = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
/** Alternate dispatcher/lookup pair tried inside a single guarded fetch attempt. */
type FetchDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
  lookupFn?: LookupFn;
};
type FetchMediaOptions = {
  url: string;
  fetchImpl?: FetchLike;
  requestInit?: RequestInit;
  filePathHint?: string;
  maxBytes?: number;
  maxRedirects?: number;
  /** Require HTTPS for the initial URL and every redirect target. */
  requireHttps?: boolean;
  /** Abort the complete guarded fetch and body operation after this deadline (ms). */
  timeoutMs?: number;
  /** Abort if final response headers have not arrived by this deadline (ms). */
  responseHeaderTimeoutMs?: number;
  /** Abort if the response body stops yielding data for this long (ms). */
  readIdleTimeoutMs?: number;
  ssrfPolicy?: SsrFPolicy;
  lookupFn?: LookupFn;
  dispatcherPolicy?: PinnedDispatcherPolicy;
  dispatcherAttempts?: FetchDispatcherAttempt[];
  shouldRetryFetchError?: (error: unknown) => boolean;
  /**
   * Retries the complete guarded fetch/read-or-save operation. Dispatcher
   * attempts still run inside each retry attempt.
   */
  retry?: MediaFetchRetryOptions;
  /**
   * Allow an operator-configured explicit proxy to resolve target DNS after
   * hostname-policy checks instead of forcing local pinned-DNS first.
   */
  trustExplicitProxyDns?: boolean;
};
/** Options for validating and saving an existing Response body into the media store. */
type SaveResponseMediaOptions = {
  sourceUrl?: string;
  filePathHint?: string;
  maxBytes?: number;
  readIdleTimeoutMs?: number;
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Options for guarded URL fetches that are saved directly into the media store. */
type SaveRemoteMediaOptions = FetchMediaOptions & {
  fallbackContentType?: string;
  subdir?: string;
  originalFilename?: string;
};
/** Validates and saves a caller-provided response without performing a new fetch. */
declare function saveResponseMedia(res: Response, options?: SaveResponseMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and saves the body into the media store. */
declare function saveRemoteMedia(options: SaveRemoteMediaOptions): Promise<SavedRemoteMedia>;
/** Fetches media through SSRF guards and returns the bounded response body as a buffer. */
declare function readRemoteMediaBuffer(options: FetchMediaOptions): Promise<FetchMediaResult>;
/** @deprecated Use `readRemoteMediaBuffer` for buffer reads or `saveRemoteMedia` for URL-to-store. */
declare const fetchRemoteMedia: typeof readRemoteMediaBuffer;
//#endregion
export { PluginJsonValue as A, ReplyFollowupAdmissionBarrierTimeoutPolicy as B, PluginHookToolContext as C, PluginToolMatcher as D, PluginHookToolRequesterContext as E, ReplyDispatchBeforeDeliverOptions as F, ReplyDispatchKind as I, ReplyDispatchReceipt as L, PluginHookBeforeToolCallResult as M, DiagnosticTraceContext as N, PluginNextTurnInjection as O, ReplyDispatchBeforeDeliver as P, ReplyDispatchRuntimeInfo as R, PluginHookRegistrationOptions as S, PluginHookToolKind as T, ResolvedSessionMaintenanceConfigInput as _, extractOriginalFilename as a, PluginHookName as b, resizeToJpeg as c, OutboundDeliveryQueuePolicy as d, projectOutboundPayloadPlanForJson as f, SessionManager as g, ReadonlySessionManager as h, saveResponseMedia as i, PluginApprovalResolution as j, PluginNextTurnInjectionEnqueueResult as k, DeliverOutboundPayloadsParams as l, PluginSubagentRequesterContext as m, readRemoteMediaBuffer as n, saveMediaBuffer as o, ReplyPayload as p, saveRemoteMedia as r, getImageMetadata as s, fetchRemoteMedia as t, DurableFinalDeliveryRequirements as u, PluginHookBeforeToolCallEvent as v, PluginHookToolInputKind as w, PluginHookRegistration as x, PluginHookHandlerMap as y, ReplyDispatcher as z };