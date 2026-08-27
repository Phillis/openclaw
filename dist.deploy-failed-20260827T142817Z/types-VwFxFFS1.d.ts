import { J as SecretRef, S as TtsAutoMode, Y as ChatType, a as ModelCompatConfig, f as TalkProviderConfig, i as ModelApi, n as OpenClawConfig, p as OperatorScope, s as ModelMediaInputConfig, x as ResolvedTtsPersona } from "./types.openclaw-Djf9z9fV.js";
import { _ as SessionObserverDigest, d as HookExternalContentSource, g as CronScheduledToolPolicy, l as SessionCreatedActor, m as DeliveryContext, p as SourceReplyDeliveryMode, u as SessionCreatedVia, v as SessionsCompanionAskResult, y as SessionsCompanionStateResult } from "./types-BlSI-hFu.js";
import { t as AgentMessage } from "./types-BH0Q4SbZ.js";
import { Ct as ExecApprovalDecision, V as ChannelAccountSnapshot, ht as WizardPrompter, it as ChannelThreadingToolContext, mt as PluginApprovalRequestPayload, pt as PluginApprovalRequest, wt as ExecApprovalRequestPayload$1 } from "./setup-wizard-types-BJbOEFA2.js";
import { C as ModelCatalogStatus, E as RuntimeEnv } from "./manifest-registry-CHpEok17.js";
import { O as AgentPlanStep, S as InputProvenance, j as ReplyPayload, m as PluginHookChannelContext, t as FinalizedMsgContext, w as MediaFact } from "./templating-B3rf5Xpv.js";
import { a as MediaUnderstandingProvider } from "./types-B8xDlc6k.js";
import { r as AuthProfileStore } from "./types-CqXVEXj4.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { t as MediaNormalizationEntry } from "./normalization-CdPHM6JL.js";
import { o as ImageGenerationProvider } from "./types-D-iNbuMW.js";
import { i as VideoGenerationProvider } from "./types-DcEPFU9l.js";
import { Static, TSchema, Type } from "typebox";
import { DatabaseSync } from "node:sqlite";
import { ClientOptions, WebSocket } from "ws";

//#region src/agents/failover/signal.d.ts
/** Persisted and wire-visible failover reason codes. Spellings are frozen. */
declare const FAILOVER_REASONS: readonly ["auth", "auth_permanent", "format", "rate_limit", "overloaded", "billing", "server_error", "timeout", "tls_certificate", "context_overflow", "model_not_found", "session_expired", "empty_response", "no_error_details", "unclassified", "unknown"];
type FailoverReason = (typeof FAILOVER_REASONS)[number];
//#endregion
//#region src/talk/talk-events.d.ts
/**
 * Canonical event names emitted by Talk sessions across realtime and STT/TTS flows.
 */
declare const TALK_EVENT_TYPES: readonly ["session.started", "session.ready", "session.closed", "session.error", "session.replaced", "turn.started", "turn.ended", "turn.cancelled", "capture.started", "capture.stopped", "capture.cancelled", "capture.once", "input.audio.delta", "input.audio.committed", "transcript.delta", "transcript.done", "output.text.delta", "output.text.done", "output.audio.started", "output.audio.delta", "output.audio.done", "tool.call", "tool.progress", "tool.result", "tool.error", "usage.metrics", "latency.metrics", "health.changed"];
/**
 * Talk event name accepted by the event sequencer.
 */
type TalkEventType = (typeof TALK_EVENT_TYPES)[number];
/**
 * High-level media mode used to group Talk session telemetry.
 */
type TalkMode = "realtime" | "stt-tts" | "transcription";
/**
 * Transport family carrying Talk audio and session control.
 */
type TalkTransport = "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
/**
 * Brain mode that explains whether Talk output is agent-mediated, tool-only, or passive.
 */
type TalkBrain = "agent-consult" | "direct-tools" | "none";
//#endregion
//#region src/infra/diagnostic-trace-context.d.ts
type DiagnosticTraceContext = {
  /** W3C trace id, 32 lowercase hex chars. */readonly traceId: string; /** Current span id, 16 lowercase hex chars. */
  readonly spanId?: string; /** Parent span id, 16 lowercase hex chars. */
  readonly parentSpanId?: string; /** W3C trace flags, 2 lowercase hex chars. Defaults to sampled. */
  readonly traceFlags?: string;
};
//#endregion
//#region src/logging/levels.d.ts
declare const ALLOWED_LOG_LEVELS: readonly ["silent", "fatal", "error", "warn", "info", "debug", "trace"];
type LogLevel = (typeof ALLOWED_LOG_LEVELS)[number];
//#endregion
//#region src/logging/subsystem.d.ts
type SubsystemLogger$1 = {
  subsystem: string;
  isEnabled: (level: LogLevel, target?: "any" | "console" | "file") => boolean;
  trace: (message: string, meta?: Record<string, unknown>) => void;
  debug: (message: string, meta?: Record<string, unknown>) => void;
  info: (message: string, meta?: Record<string, unknown>) => void;
  warn: (message: string, meta?: Record<string, unknown>) => void;
  error: (message: string, meta?: Record<string, unknown>) => void;
  fatal: (message: string, meta?: Record<string, unknown>) => void;
  raw: (message: string) => void;
  child: (name: string) => SubsystemLogger$1;
};
declare function createSubsystemLogger(subsystem: string): SubsystemLogger$1;
//#endregion
//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type VerboseLevel = "off" | "on" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Minimal model catalog entry needed to choose thinking defaults. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  api?: string;
  reasoning?: boolean;
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};
//#endregion
//#region src/agents/internal-event-contract.d.ts
declare const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION: "task_completion";
declare const AGENT_INTERNAL_EVENT_SOURCES: readonly ["subagent", "cron", "image_generation", "video_generation", "music_generation"];
declare const AGENT_INTERNAL_EVENT_STATUSES: readonly ["ok", "timeout", "error", "unknown"];
type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
//#endregion
//#region src/agents/generated-attachments.d.ts
type AgentGeneratedAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
};
//#endregion
//#region src/agents/internal-events.d.ts
type AgentTaskCompletionInternalEvent = {
  type: typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
  source: AgentInternalEventSource;
  childSessionKey: string;
  childSessionId?: string;
  announceType: string;
  taskLabel: string;
  status: AgentInternalEventStatus;
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
  replyInstruction: string;
};
/** Internal event variants that can be rendered into agent prompt context. */
type AgentInternalEvent = AgentTaskCompletionInternalEvent;
//#endregion
//#region src/plugins/runtime/tool-grant.d.ts
/** Owner-scoped additive plugin tools for one trusted agent run. */
type RuntimePluginToolGrant = {
  pluginId: string;
  toolNames: readonly string[];
};
//#endregion
//#region src/auto-reply/reply/reply-dispatcher.types.d.ts
type ReplyDispatchKind = "tool" | "block" | "final";
type ReplyFollowupAdmissionBarrierTimeoutPolicy = {
  /** Absolute failsafe for owner activity that never settles. */maxTimeoutMs: number; /** Extend by another default settle interval while bounded owner work remains active. */
  shouldExtend: () => boolean;
};
type ReplyDispatchRuntimeInfo = {
  kind: ReplyDispatchKind;
  assistantMessageIndex?: number; /** @internal Claim direct-send custody immediately before recipient-visible platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>; /** @internal Bind this delivery's host-owned completion to a transformed payload. */
  bindPendingFinalDelivery?: <T extends ReplyPayload>(payload: T) => T;
};
type ReplyDispatchBeforeDeliver = (payload: ReplyPayload, info: ReplyDispatchRuntimeInfo) => Promise<ReplyPayload | null> | ReplyPayload | null;
/** An owner-declared settlement budget for one before-delivery callback. */
type ReplyDispatchBeforeDeliverOptions = {
  /** Positive finite per-callback deadline in milliseconds; omit for the dispatcher default. */timeoutMs?: number;
};
type ReplyDispatcher = {
  sendToolResult: (payload: ReplyPayload) => boolean;
  sendBlockReply: (payload: ReplyPayload) => boolean;
  sendFinalReply: (payload: ReplyPayload) => boolean;
  appendBeforeDeliver?: (hook: ReplyDispatchBeforeDeliver, options?: ReplyDispatchBeforeDeliverOptions) => void;
  waitForIdle: () => Promise<void>;
  getQueuedCounts: () => Record<ReplyDispatchKind, number>;
  getCancelledCounts?: () => Record<ReplyDispatchKind, number>;
  getFailedCounts: () => Record<ReplyDispatchKind, number>;
  markComplete: () => void; /** Owner-declared deadline for holding queued follow-ups behind all queued deliveries. */
  resolveFollowupAdmissionBarrierTimeoutPolicy?: () => ReplyFollowupAdmissionBarrierTimeoutPolicy | undefined;
};
//#endregion
//#region src/cron/runtime-authority.d.ts
type CronRuntimeAuthority = Readonly<{
  version: 1; /** Concrete harness runtime that alone may consume this opaque authority. */
  runtimeId: string; /** Runtime-owned payload discriminator; core never interprets its value. */
  namespace: string;
  payload: Readonly<Record<string, unknown>>;
}>;
//#endregion
//#region src/plugins/hook-before-agent-start.types.d.ts
type PluginHookBeforeModelResolveAttachment = {
  kind: "image" | "video" | "audio" | "document" | "other";
  mimeType?: string;
};
type PluginHookBeforeModelResolveOverrideName = "modelOverride" | "providerOverride" | "thinkingLevelOverride" | "fastModeOverride";
type PluginHookBeforeModelResolveEvent = {
  /**
   * Versioned host contract for model-resolution controls. Older hosts omit
   * this field, allowing plugins to degrade without guessing from host version.
   */
  readonly controlContractVersion?: 1; /** Result fields this host will honor for the current run. */
  readonly supportedOverrides?: readonly PluginHookBeforeModelResolveOverrideName[]; /** User prompt for this run. No session messages are available yet in this phase. */
  prompt: string; /** Provider selected before model-routing hooks run. */
  provider?: string; /** Model selected before model-routing hooks run. */
  model?: string; /** Original primary provider before a configured fallback candidate was selected. */
  requestedProvider?: string; /** Original primary model before a configured fallback candidate was selected. */
  requestedModel?: string; /** True when this hook is resolving a non-primary configured fallback candidate. */
  fallbackUsed?: boolean; /** Attachment metadata for file-aware model routing. */
  attachments?: PluginHookBeforeModelResolveAttachment[];
};
type PluginHookBeforeModelResolveResult = {
  /** Override the model for this agent run. E.g. "llama3.3:8b" */modelOverride?: string; /** Override the provider for this agent run. E.g. "local-provider" */
  providerOverride?: string; /** Override the run's reasoning effort after the selected model is resolved. */
  thinkingLevelOverride?: ThinkLevel; /** Enable or disable provider fast mode for this run. */
  fastModeOverride?: boolean;
};
type PluginHookBeforePromptBuildEvent = {
  prompt: string; /** Session messages prepared for this run. */
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
    severity?: "info" | "warning" | "critical";
    timeoutMs?: number;
    /**
     * @deprecated Unresolved approvals always deny; retained for plugin API
     * compatibility. The field will be removed after one deprecation release train.
     */
    timeoutBehavior?: "allow" | "deny"; /** Override timeout text and return the timeout as a blocked tool result. */
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
  outcome: "block"; /** Internal plugin-local reason. Do not log, persist, broadcast, or expose verbatim. */
  reason: string; /** Optional user-facing detail included in the block response envelope. */
  message?: string; /** Plugin-defined category for analytics (e.g. "violence", "pii", "cost_limit"). */
  category?: string; /** Opaque metadata for the plugin's own use. Core does not interpret it. */
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
//#region src/plugins/conversation-binding.types.d.ts
/** Plugin-supplied context for requesting a channel conversation binding. */
type PluginConversationBindingRequestParams = {
  summary?: string;
  detachHint?: string;
  data?: Record<string, unknown>;
};
/** Maintainer/user decision recorded for a plugin conversation binding request. */
type PluginConversationBindingResolutionDecision = "allow-once" | "allow-always" | "deny";
/** Stored binding between a plugin and an external channel conversation. */
type PluginConversationBinding = {
  bindingId: string;
  pluginId: string;
  pluginName?: string;
  pluginRoot: string;
  channel: string;
  accountId: string;
  conversationId: string;
  parentConversationId?: string;
  threadId?: string | number;
  boundAt: number;
  summary?: string;
  detachHint?: string;
  data?: Record<string, unknown>;
};
/** Result returned when a plugin asks to bind to a conversation. */
type PluginConversationBindingRequestResult = {
  status: "bound";
  binding: PluginConversationBinding;
} | {
  status: "pending";
  approvalId: string;
  reply: ReplyPayload;
} | {
  status: "error";
  message: string;
};
/** Event emitted after a pending conversation binding request is resolved. */
type PluginConversationBindingResolvedEvent = {
  status: "approved" | "denied";
  binding?: PluginConversationBinding;
  decision: PluginConversationBindingResolutionDecision;
  request: {
    summary?: string;
    detachHint?: string;
    data?: Record<string, unknown>;
    requestedBySenderId?: string;
    conversation: {
      channel: string;
      accountId: string;
      conversationId: string;
      parentConversationId?: string;
      threadId?: string | number;
    };
  };
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
  /** @deprecated Use the first `event.media` fact with a defined `path`. */mediaPath?: string; /** @deprecated Use the first `event.media` fact's `url ?? path`. */
  mediaUrl?: string; /** @deprecated Use the first `event.media` fact's `contentType ?? kind`. */
  mediaType?: string; /** @deprecated Collect defined `path` values from `event.media` in order. */
  mediaPaths?: string[]; /** @deprecated Collect each defined `url ?? path` from `event.media` in order. */
  mediaUrls?: string[]; /** @deprecated Collect each defined `contentType ?? kind` from `event.media` in order. */
  mediaTypes?: string[]; /** @deprecated Use the first `event.originalMedia` fact with a defined `path`. */
  originalMediaPath?: string; /** @deprecated Use the first `event.originalMedia` fact's `url ?? path`. */
  originalMediaUrl?: string; /** @deprecated Use the first `event.originalMedia` fact's `contentType ?? kind`. */
  originalMediaType?: string; /** @deprecated Collect defined `path` values from `event.originalMedia` in order. */
  originalMediaPaths?: string[]; /** @deprecated Collect each defined `url ?? path` from `event.originalMedia` in order. */
  originalMediaUrls?: string[]; /** @deprecated Collect each defined `contentType ?? kind` from `event.originalMedia` in order. */
  originalMediaTypes?: string[]; /** @deprecated Use `event.mediaStagingPending`. */
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
  /** Resolved owner for session scopes whose canonical key does not encode an agent id. */agentId?: string;
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
  providerUpdate?: PluginHookProviderUpdate; /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[]; /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[]; /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
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
  providerUpdate?: PluginHookProviderUpdate; /** Staged, locally usable attachments in stable source order. */
  media?: PluginHookMediaFact[]; /** Original attachment facts when local staging has not completed yet. */
  originalMedia?: PluginHookMediaFact[]; /** True when `originalMedia` is present but `media` is intentionally withheld pending staging. */
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
  /** Caller-supplied correlation metadata; not authenticated identity or authorization proof. */correlationId?: string;
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
  metrics?: Record<string, string | number | boolean>; /** Version of the underlying evaluator or ruleset, separate from the plugin package. */
  evaluatorVersion?: string; /** Bounded evaluator mode label such as `static`, `llm`, or `baseline-comparison`. */
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
type PluginHookName = "before_model_resolve" | "agent_turn_prepare" | "before_prompt_build" | "before_agent_reply" | "model_call_started" | "model_call_ended" | "llm_input" | "llm_output" | "before_agent_finalize" | "agent_end" | "before_compaction" | "after_compaction" | "before_reset" | "inbound_claim" | "channel_pairing_requested" | "message_received" | "message_sending" | "reply_payload_sending" | "message_sent" | "before_tool_call" | "after_tool_call" | "tool_result_persist" | "before_message_write" | "session_start" | "session_end"
/**
 * @deprecated Core prepares thread-bound subagent bindings through channel
 * session-binding adapters before `subagent_spawned` fires. Use
 * `subagent_spawned` for post-launch observation in new plugins.
 */
| "subagent_spawning" | "subagent_delivery_target" | "subagent_spawned" | "subagent_progress" | "subagent_ended" | "gateway_start" | "gateway_stop" | "heartbeat_prompt_contribution" | "cron_reconciled" | "cron_changed" | "skill_proposal_evaluate" | "skill_proposal_changed" | "skill_changed" | "before_dispatch" | "reply_dispatch" | "before_install" | "before_agent_run" | "resolve_exec_env";
type PluginHookChannelPairingRequestedEvent = {
  /** Channel that created the pending pairing request. */channel: string; /** Provider account ID for multi-account channel setups. */
  accountId?: string; /** Channel-scoped sender ID awaiting operator approval. */
  senderId: string; /** Short-lived code accepted by `openclaw pairing approve`. */
  code: string; /** Sender-supplied channel metadata for operator notification/audit. Treat as untrusted. */
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
  /** Host-enforced turn triggers that may invoke this reply hook. */eligibleTriggers?: readonly [PluginHookAgentTrigger, ...PluginHookAgentTrigger[]];
} : {
  eligibleTriggers?: never;
}) & (K extends "before_tool_call" | "after_tool_call" ? {
  matcher?: PluginToolMatcher;
} : {
  matcher?: never;
});
type PluginHookAgentContext = {
  runId?: string;
  jobId?: string;
  /**
   * Stable identity for a caller-owned source prompt before runtime wrapping.
   *
   * Currently populated for non-empty isolated cron `agentTurn` payloads as
   * `sha256:` plus the full lowercase SHA-256 digest of the canonicalized
   * stored message. The raw source prompt is never exposed through this field.
   */
  sourcePromptHash?: `sha256:${string}`;
  trace?: DiagnosticTraceContext;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string; /** Host-owned sticky harness lane for this session generation. */
  agentHarnessId?: string; /** Opaque host-owned lane epoch; changes only after explicit migration/reset. */
  agentHarnessEpoch?: string; /** Versioned host contract for trusted session ancestry and internal handoffs. */
  lineageContractVersion?: 1; /** Host-owned lineage facts. Raw prompt provenance never populates this field. */
  sessionLineage?: {
    spawnedBySessionKey?: string;
    internalHandoff?: {
      kind: "subagent-completion";
      sourceSessionKey: string;
      sourceSessionId?: string;
    };
  };
  workspaceDir?: string; /** Run-prepared repository identities; empty when the turn is outside a repository. */
  activeProjectKeys?: string[];
  modelProviderId?: string;
  modelId?: string;
  messageProvider?: string; /** Channel/plugin id for channel-originated runs, e.g. `discord`. */
  channel?: string; /** Channel account used by the agent when multiple accounts are configured. */
  accountId?: string; /** Conversation target id for channel-originated runs. Mirrors `channelId` for compatibility. */
  chatId?: string; /** Sender identity for channel-originated runs when available. */
  senderId?: string;
  trigger?: string;
  channelId?: string; /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number; /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource; /** Native/configured reference window when a lower cap wins. */
  contextWindowReferenceTokens?: number;
  /**
   * @deprecated Core does not populate cross-app sender ids. Channel plugins
   * should expose channel-specific identities by augmenting `channelContext.sender`.
   */
  senderExternalId?: string; /** Channel-owned sender/chat details. Plugins may augment the nested interfaces. */
  channelContext?: PluginHookChannelContext;
};
type PluginHookContextWindowSource = "model" | "modelsConfig" | "agentContextTokens" | "default";
type PluginHookBeforeAgentReplyEvent = {
  cleanedBody: string;
};
type PluginHookBeforeAgentReplyResult = {
  handled: boolean;
  reply?: ReplyPayload;
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
  sessionId?: string; /** Host-owned sticky harness lane effective for this call. */
  agentHarnessId?: string; /** Opaque host-owned lane epoch for this session generation. */
  agentHarnessEpoch?: string;
  provider: string;
  model: string; /** Original primary provider requested before fallback selection. */
  requestedProvider?: string; /** Original primary model requested before fallback selection. */
  requestedModel?: string; /** Explicit effective provider; mirrors `provider` for unambiguous attribution. */
  effectiveProvider?: string; /** Explicit effective model; mirrors `model` for unambiguous attribution. */
  effectiveModel?: string; /** True when the effective call is running on a fallback selection. */
  fallbackUsed?: boolean; /** Closed causal code when the host can attribute the fallback. */
  fallbackReason?: FailoverReason;
  api?: string;
  transport?: string; /** Requested reasoning/think effort applied to this model call. */
  reasoningEffort?: string; /** Effective provider fast-mode state when this model call started. */
  fastMode?: boolean; /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number; /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource; /** Native/configured reference window when a lower cap wins. */
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
  upstreamRequestIdHash?: string; /** Provider-reported usage for this individual call, when available. */
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    reasoningTokens?: number;
    promptTokens?: number;
    total?: number;
  };
};
type PluginHookLlmOutputEvent = {
  runId: string;
  sessionId: string;
  provider: string;
  model: string; /** Original primary provider requested before fallback selection. */
  requestedProvider?: string; /** Original primary model requested before fallback selection. */
  requestedModel?: string; /** Explicit effective provider; mirrors `provider` for unambiguous attribution. */
  effectiveProvider?: string; /** Explicit effective model; mirrors `model` for unambiguous attribution. */
  effectiveModel?: string; /** True when the effective output came from a fallback selection. */
  fallbackUsed?: boolean; /** Closed causal code when the host can attribute the fallback. */
  fallbackReason?: FailoverReason; /** Resolved effective context-token budget after model/config/agent caps. */
  contextTokenBudget?: number; /** Source that supplied the resolved context-token budget. */
  contextWindowSource?: PluginHookContextWindowSource; /** Native/configured reference window when a lower cap wins. */
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
  harnessId?: string; /** The original user prompt that produced this output. */
  prompt?: string;
  assistantTexts: string[];
  lastAssistant?: unknown;
  usage?: {
    input?: number;
    output?: number;
    cacheRead?: number;
    cacheWrite?: number;
    reasoningTokens?: number;
    promptTokens?: number;
    total?: number;
  };
  /**
   * Requested reasoning/think effort for this call (provider think level, e.g.
   * "off" | "low" | "medium" | "high"). Lets a passive footer show the mode the
   * user is actually running without re-deriving it.
   */
  reasoningEffort?: string; /** Whether fast mode was active for this call. */
  fastMode?: boolean;
};
type PluginHookAgentEndEvent = {
  runId?: string;
  messages: unknown[];
  success: boolean;
  /**
   * True only when this event is terminal for the complete outer run. Model
   * fallback candidates that may be followed by another candidate emit false.
   * New hosts always populate this field; it remains optional so existing
   * third-party harness source continues to compile.
   */
  terminal?: boolean;
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
  sessionFile?: string; /** Physical session generation replaced by this compaction, when it rotated. */
  previousSessionId?: string;
};
type PluginHookInboundClaimResult = {
  handled: boolean;
  reply?: ReplyPayload;
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
  model?: string; /** Resolved provider/model ref actually used (keeps the provider prefix). */
  resolvedRef?: string; /** Requested reasoning/think effort (e.g. "off" | "low" | "medium" | "high"). */
  reasoningEffort?: string;
  fastMode?: boolean; /** True when a model fallback was used for this turn. */
  fallbackUsed?: boolean; /** Owning agent + session for this reply. */
  agentId?: string;
  sessionId?: string; /** Chat surface kind (e.g. "direct" | "group"). */
  chatType?: string; /** Credential mode the turn ran under (e.g. "oauth" | "api_key"). */
  authMode?: string; /** Session model-override source, when a non-default model was pinned. */
  overrideSource?: string; /** Provider/model ref requested for the turn (vs resolvedRef actually used). */
  requested?: string; /** Estimated cost of this turn in USD, when a cost table is configured. */
  turnUsd?: number; /** Wall-clock duration of the turn in milliseconds. */
  durationMs?: number; /** Owning agent's configured identity (name/emoji/avatar), when set. */
  identity?: {
    name?: string;
    emoji?: string;
    avatar?: string;
  };
  compactionCount?: number; /** Effective context-token budget after model/config/agent caps. */
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
type PluginHookReplyPayload = Omit<ReplyPayload, "trustedLocalMedia">;
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
  /** Channel/plugin id, for example `discord` or `telegram`. */readonly channel?: string; /** Channel account used by the agent when multiple accounts are configured. */
  readonly accountId?: string; /** Channel-scoped sender id when the host received one. */
  readonly senderId?: string; /** True only when the host resolved the sender as an owner. */
  readonly senderIsOwner?: boolean; /** Provider-native role ids when the channel supplies them. */
  readonly roleIds?: readonly string[];
};
type PluginHookToolContext = {
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  runId?: string; /** Aborts when the owning tool call is cancelled. Hook timeout expiry does not abort this signal. */
  abortSignal?: AbortSignal;
  trace?: DiagnosticTraceContext;
  toolName: string; /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind; /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
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
  params: Record<string, unknown>; /** Host-authoritative discriminator for tools that intentionally share names. */
  toolKind?: PluginHookToolKind; /** Host-authoritative input/runtime family for tools whose payloads need policy distinction. */
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
  threadId?: string | number; /** Native source channel/conversation id, when distinct from the routable target. */
  channelId?: string | number; /** Native source message that initiated the parent run, when available. */
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
/**
 * @deprecated Core prepares thread-bound subagent bindings through channel
 * session-binding adapters before `subagent_spawned` fires. Use
 * `subagent_spawned` for post-launch observation in new plugins.
 */
type PluginHookSubagentSpawningEvent = PluginHookSubagentSpawnBase;
/**
 * @deprecated Core prepares thread-bound subagent bindings through channel
 * session-binding adapters before `subagent_spawned` fires. Returning routing
 * data from `subagent_spawning` is retained only for older runtimes.
 */
type PluginHookSubagentSpawningResult = {
  status: "ok";
  /**
   * @deprecated Core now resolves thread-bound spawn routing from session
   * bindings and channel route projection. Keep returning this only for
   * compatibility with older OpenClaw runtimes.
   */
  threadBindingReady?: boolean;
  /**
   * @deprecated Use channel `resolveDeliveryTarget` plus core
   * `SessionBindingRecord` projection instead of returning an ad hoc
   * delivery route from this hook.
   */
  deliveryOrigin?: {
    channel?: string;
    accountId?: string;
    to?: string;
    threadId?: string | number;
  };
} | {
  status: "error";
  error: string;
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
  runId: string; /** Fully resolved provider/model ref applied to the spawned child session. */
  resolvedModel?: string; /** Provider prefix parsed from resolvedModel when the ref includes one. */
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
  /** Aborts when this exact scheduler snapshot is superseded or the Gateway closes. */abortSignal: AbortSignal;
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
  declarationKey?: string; /** Agent id that owns this cron job. */
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
  job?: PluginHookGatewayCronJob; /** Top-level session target for downstream routing (mirrors job.sessionTarget). */
  sessionTarget?: string; /** Agent id that owns this cron job (mirrors job.agentId). */
  agentId?: string;
  runAtMs?: number;
  durationMs?: number;
  status?: PluginHookGatewayCronRunStatus;
  error?: string;
  summary?: string;
  delivered?: boolean;
  deliveryStatus?: PluginHookGatewayCronDeliveryStatus;
  deliveryError?: string;
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
  /** The user's message that triggered this run. */prompt: string; /** Loaded session history before the current prompt is submitted. */
  messages: unknown[]; /** Active system prompt prepared for this run. */
  systemPrompt?: string; /** Account identity when available. */
  accountId?: string; /** Channel the message came from. */
  channelId?: string; /** Sender identity when available. */
  senderId?: string; /** Trusted sender identity bit when available. */
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
  /**
   * @deprecated Core prepares thread-bound subagent bindings through channel
   * session-binding adapters before `subagent_spawned` fires. Use
   * `subagent_spawned` for post-launch observation in new plugins.
   */
  subagent_spawning: (event: PluginHookSubagentSpawningEvent, ctx: PluginHookSubagentContext) => Promise<PluginHookSubagentSpawningResult | void> | PluginHookSubagentSpawningResult | void;
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
  source: string;
};
//#endregion
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
//#endregion
//#region src/infra/agent-run-registry.d.ts
type AgentRunDelegatedAuthority = Readonly<{
  operationalRunInstance: Readonly<{
    instanceId: string;
    runId: string;
  }>;
  lifecycleGeneration: string;
  claimId: string;
}>;
//#endregion
//#region src/agents/admitted-run-context.d.ts
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef; /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>; /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
//#endregion
//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string; /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  status: "ready" | "auth-rejected" | "unavailable";
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string; /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi; /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
};
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[]; /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[]; /** Static provider-hook rows captured alongside the full lifecycle generation. */
  staticEntries?: ModelCatalogEntry[];
  /**
   * `false` only when this snapshot came from a degraded load (discovery threw,
   * static or empty fallback). Absent/`true` means authoritative — consumers that
   * destroy durable state (e.g. resetting a pinned model override) must treat only
   * an explicit `false` as degraded, so unrelated hand-built snapshots stay safe.
   */
  authoritative?: boolean;
};
//#endregion
//#region src/cron/types-shared.d.ts
/** Optional dynamic-cadence bounds for one cron job. */
type CronPacing = {
  min?: string;
  max?: string;
};
/** Shared persisted cron job envelope used by runtime and external config shapes. */
type CronJobBase<TSchedule, TSessionTarget, TWakeMode, TPayload, TDelivery, TFailureAlert> = {
  id: string;
  agentId?: string;
  sessionKey?: string;
  name: string;
  description?: string;
  enabled: boolean;
  deleteAfterRun?: boolean;
  createdAtMs: number;
  updatedAtMs: number;
  schedule: TSchedule;
  pacing?: CronPacing;
  sessionTarget: TSessionTarget;
  wakeMode: TWakeMode;
  payload: TPayload;
  delivery?: TDelivery;
  failureAlert?: TFailureAlert;
};
//#endregion
//#region src/cron/types.d.ts
/** Supported schedule forms persisted in cron job specs. */
type CronSchedule = {
  kind: "at";
  at: string;
} | {
  kind: "every";
  everyMs: number;
  anchorMs?: number;
} | {
  kind: "cron";
  expr: string;
  tz?: string; /** Optional deterministic stagger window in milliseconds (0 keeps exact schedule). */
  staggerMs?: number;
} | {
  /**
   * Event-driven (non-time) trigger: the job fires once when a gateway-owned
   * watcher process running `command` exits. The watcher lives under the
   * gateway ProcessSupervisor, NOT inside any agent turn's process tree, so
   * it survives the per-turn spawn-and-kill teardown that CLI backends apply
   * (#71662). On exit the job runs through the normal cron run pipeline, so
   * delivery to the bound session works exactly like a scheduled main job.
   * `computeNextRunAtMs` returns undefined for this kind (never time-due).
   */
  kind: "on-exit";
  command: string;
  cwd?: string;
} | {
  /** Event-driven source whose supervised argv emits payload-triggering lines. */kind: "stream";
  command: string[];
  cwd?: string;
  mode?: "line" | "match"; /** JavaScript regular-expression source, required when mode is "match". */
  match?: string;
  batchMs?: number;
  maxBatchBytes?: number;
};
/** Runtime target that decides whether a job joins main, isolated, or a named session. */
type CronSessionTarget = "main" | "isolated" | "current" | `session:${string}`;
/** Wake policy for main-session jobs waiting on heartbeat/user activity. */
type CronWakeMode$1 = "next-heartbeat" | "now";
/** Messaging channel id accepted by cron delivery settings. */
type CronMessageChannel = ChannelId;
/** Delivery mode for job completion output. */
type CronDeliveryMode = "none" | "announce" | "webhook";
/** Completion delivery configuration for cron job output. */
type CronDelivery = {
  mode: CronDeliveryMode;
  channel?: CronMessageChannel;
  to?: string; /** Explicit thread/topic id for channels that support threaded delivery. */
  threadId?: string | number; /** Explicit channel account id for multi-account setups (e.g. multiple Telegram bots). */
  accountId?: string;
  bestEffort?: boolean; /** Additional webhook destination used when a job must keep chat delivery. */
  completionDestination?: CronCompletionDestination; /** Separate destination for failure notifications. */
  failureDestination?: CronFailureDestination;
};
/** Webhook completion destination used alongside chat delivery. */
type CronCompletionDestination = {
  mode: "webhook";
  to?: string;
};
/** Destination override for failed-run notifications. */
type CronFailureDestination = {
  channel?: CronMessageChannel;
  to?: string;
  accountId?: string;
  mode?: "announce" | "webhook";
};
/** Partial failure-destination update shape; null clears individual override fields. */
type CronFailureDestinationPatch = {
  channel?: CronMessageChannel | null;
  to?: string | null;
  accountId?: string | null;
  mode?: "announce" | "webhook" | null;
};
/** Partial delivery update shape; null clears optional delivery destinations or fields. */
type CronDeliveryPatch = Partial<Pick<CronDelivery, "mode" | "bestEffort">> & {
  channel?: CronMessageChannel | null;
  to?: string | null;
  threadId?: string | number | null;
  accountId?: string | null;
  completionDestination?: CronCompletionDestination | null;
  failureDestination?: CronFailureDestinationPatch | null;
};
/** Execution outcome, separate from delivery outcome. */
type CronRunStatus = "ok" | "error" | "skipped";
/** Delivery outcome for completion or failure-notification sends. */
type CronDeliveryStatus = "delivered" | "not-delivered" | "unknown" | "not-requested";
/** Severity level for persisted cron run diagnostics. */
type CronRunDiagnosticSeverity = "info" | "warn" | "error";
/** Subsystem that produced a cron run diagnostic entry. */
type CronRunDiagnosticSource = "cron-preflight" | "cron-setup" | "model-preflight" | "agent-run" | "tool" | "exec" | "delivery";
/** Timestamped diagnostic entry preserved for cron run troubleshooting. */
type CronRunDiagnostic = {
  ts: number;
  source: CronRunDiagnosticSource;
  severity: CronRunDiagnosticSeverity;
  message: string;
  toolName?: string;
  exitCode?: number | null;
  truncated?: boolean;
};
/** Bounded diagnostic bundle stored on the run outcome. */
type CronRunDiagnostics = {
  summary?: string;
  entries: CronRunDiagnostic[];
};
/** Failure alert policy persisted on a cron job. */
type CronFailureAlert = {
  after?: number;
  channel?: CronMessageChannel;
  to?: string;
  cooldownMs?: number; /** When true, consecutive skipped runs count toward the alert threshold. */
  includeSkipped?: boolean; /** Delivery mode: announce (via messaging channels) or webhook (HTTP POST). */
  mode?: "announce" | "webhook"; /** Account ID for multi-account channel configurations. */
  accountId?: string;
};
/** Partial failure-alert update; null clears an inherited field override. */
type CronFailureAlertPatch = { [K in keyof CronFailureAlert]?: CronFailureAlert[K] | null };
/** Payload variants cron can execute in main-session or detached modes. */
type CronPayload = ({
  kind: "systemEvent";
  text: string;
} & CronPayloadToolAllow) | (CronAgentTurnPayload & CronPayloadToolAllow) | (CronCommandPayload & CronPayloadToolAllow) | (CronScriptPayload & CronPayloadToolAllow) | ({
  kind: "heartbeat";
} & CronPayloadToolAllow);
/** Partial payload update shape used by cron patch/edit flows. */
type CronPayloadPatch = ({
  kind: "systemEvent";
  text?: string;
} & CronPayloadToolAllowPatch) | (CronAgentTurnPayloadPatch & CronPayloadToolAllowPatch) | (CronCommandPayloadPatch & CronPayloadToolAllowPatch) | (CronScriptPayloadPatch & CronPayloadToolAllowPatch) | ({
  kind: "heartbeat";
} & CronPayloadToolAllowPatch);
type CronPayloadToolAllow = {
  /** Restricts agentTurn execution, or the trigger runtime for other payload kinds. */toolsAllow?: string[]; /** Server-managed marker for auto-stamped defaults; explicit restrictions omit it. */
  toolsAllowIsDefault?: boolean;
};
type CronPayloadToolAllowPatch = {
  toolsAllow?: string[] | null;
  toolsAllowIsDefault?: boolean;
};
type CronAgentTurnPayloadFields = {
  message: string; /** Optional model override (provider/model or alias). */
  model?: string; /** Optional per-job fallback models; overrides agent/global fallbacks when defined. */
  fallbacks?: string[];
  thinking?: string;
  timeoutSeconds?: number;
  allowUnsafeExternalContent?: boolean; /** Immutable external hook provenance for async dispatch. */
  externalContentSource?: HookExternalContentSource; /** If true, run with lightweight bootstrap context. */
  lightContext?: boolean;
};
type CronAgentTurnPayload = {
  kind: "agentTurn";
} & CronAgentTurnPayloadFields;
type CronAgentTurnPayloadPatch = {
  kind: "agentTurn";
} & Partial<Omit<CronAgentTurnPayloadFields, "model" | "fallbacks" | "toolsAllow" | "thinking">> & {
  model?: string | null;
  fallbacks?: string[] | null;
  toolsAllow?: string[] | null;
  thinking?: string | null;
};
type CronCommandPayloadFields = {
  /** Explicit argv vector to execute. Use a shell wrapper argv for shell syntax. */argv: string[];
  cwd?: string;
  env?: Record<string, string>;
  input?: string;
  timeoutSeconds?: number;
  noOutputTimeoutSeconds?: number;
  outputMaxBytes?: number;
};
type CronCommandPayload = {
  kind: "command";
} & CronCommandPayloadFields;
type CronCommandPayloadPatch = {
  kind: "command";
} & Partial<CronCommandPayloadFields>;
type CronScriptPayloadFields = {
  script: string;
  timeoutSeconds?: number;
  toolBudget?: number;
};
type CronScriptPayload = {
  kind: "script";
} & CronScriptPayloadFields;
type CronScriptPayloadPatch = {
  kind: "script";
} & Partial<CronScriptPayloadFields>;
/** Mutable runtime state persisted beside the immutable cron job spec. */
type CronJobState = {
  nextRunAtMs?: number;
  /**
   * When the current scheduling inputs took effect. Restart catch-up replays a
   * missed slot only when the slot is newer than this, because slots computed
   * from a freshly edited schedule never existed under the old one. Absent on
   * jobs whose schedule has not changed, where every computed slot is real.
   */
  scheduleActivatedAtMs?: number; /** Exact startup catch-up slot protected from future-slot repair across restarts. */
  startupCatchupAtMs?: number; /** Exact paced completion slot protected from future-slot repair until consumed. */
  pacedNextRunAtMs?: number; /** Exact recurring slot retained across an out-of-band manual force run. */
  forcePreservedNextRunAtMs?: number; /** Durable pre-admission reservation. Cleared on restart without recording a run. */
  queuedAtMs?: number;
  runningAtMs?: number;
  lastRunAtMs?: number; /** Preferred execution outcome field. */
  lastRunStatus?: CronRunStatus; /** @deprecated Use lastRunStatus. */
  lastStatus?: "ok" | "error" | "skipped";
  lastError?: string;
  lastDiagnostics?: CronRunDiagnostics;
  lastDiagnosticSummary?: string; /** Classified reason for the last error (when available). */
  lastErrorReason?: FailoverReason;
  lastDurationMs?: number; /** Number of consecutive execution errors (reset on success). Used for backoff. */
  consecutiveErrors?: number; /** Durable explanation for a scheduler-owned automatic disable transition. */
  autoDisabled?: {
    reason: "consecutive-failures" | "schedule-errors";
    atMs: number;
    consecutiveErrors: number;
  }; /** Number of consecutive skipped executions (reset on success or error). */
  consecutiveSkipped?: number; /** Last failure alert timestamp (ms since epoch) for cooldown gating. */
  lastFailureAlertAtMs?: number; /** Number of consecutive schedule computation errors. Auto-disables job after threshold. */
  scheduleErrorCount?: number; /** Timestamp of the last trigger script evaluation. */
  lastTriggerEvalAtMs?: number; /** Number of completed trigger script evaluations. */
  triggerEvalCount?: number; /** Timestamp of the last trigger evaluation that fired. */
  lastTriggerFireAtMs?: number; /** JSON state returned by the last trigger script evaluation. */
  triggerState?: unknown; /** Current gateway-owned stream source lifecycle state. */
  streamStatus?: "starting" | "running" | "restarting" | "stopped" | "disabled" | "error";
  streamError?: string;
  streamConsecutiveFailures?: number;
  streamRestartExhausted?: boolean;
  streamSourceIdentity?: string;
  streamDroppedBatches?: number;
  streamCoalescedBatches?: number;
  streamLastStartedAtMs?: number;
  streamLastExitAtMs?: number; /** Explicit delivery outcome, separate from execution outcome. */
  lastDeliveryStatus?: CronDeliveryStatus; /** Delivery-specific error text when available. */
  lastDeliveryError?: string; /** Whether the last run's output was delivered to the target channel. */
  lastDelivered?: boolean; /** Whether the last failed run's failure notification was delivered to the target channel. */
  lastFailureNotificationDelivered?: boolean; /** Delivery outcome for the last failed run's failure notification. */
  lastFailureNotificationDeliveryStatus?: CronDeliveryStatus; /** Delivery-specific error for the last failed run's failure notification. */
  lastFailureNotificationDeliveryError?: string;
};
type CronTrigger = {
  script: string;
  once?: boolean;
};
/** Public cron job contract with spec fields and mutable run state. */
type CronJob = CronJobBase<CronSchedule, CronSessionTarget, CronWakeMode$1, CronPayload, CronDelivery, CronFailureAlert | false> & {
  declarationKey?: string;
  displayName?: string;
  owner?: {
    agentId?: string;
    sessionKey?: string; /** Authenticated account that created this scheduled authority envelope. */
    accountId?: string;
  }; /** Server-authored provenance for requester-scoped scheduled tool authority. */
  scheduledToolPolicy?: CronScheduledToolPolicy;
  trigger?: CronTrigger;
  state: CronJobState;
};
/** Store-only proof omitted from public Gateway results and the CronJob wire/type contract. */
type CronToolsAllowProvenance = {
  version: 1;
  source: "final-executable-surface";
};
/** Persisted row shape; public Gateway and wire contracts use CronJob. */
type CronStoredJob = CronJob & {
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Runtime-private authority omitted from public Gateway and wire contracts. */
  runtimeAuthority?: CronRuntimeAuthority; /** Authority was explicitly cleared and must be reauthorized before app reuse. */
  runtimeAuthorityRecoveryRequired?: true;
};
type CronJobStateInput = Partial<Omit<CronJobState, "autoDisabled" | "scheduleActivatedAtMs" | "streamSourceIdentity">>;
/** Create input accepted by cron APIs before id/timestamps/state are assigned. */
type CronJobCreate = Omit<CronJob, "id" | "createdAtMs" | "updatedAtMs" | "state" | "scheduledToolPolicy"> & {
  /** Internal callers can reserve a durable id before creation; public cron.add omits this. */id?: string;
  state?: CronJobStateInput;
};
/** Patch input accepted by cron APIs without allowing immutable identity fields. */
type CronJobPatch = Partial<Omit<CronJob, "id" | "createdAtMs" | "state" | "payload" | "delivery" | "failureAlert" | "declarationKey" | "displayName" | "owner" | "scheduledToolPolicy" | "pacing" | "trigger">> & {
  displayName?: string | null;
  pacing?: CronPacing | null;
  trigger?: CronTrigger | null;
  payload?: CronPayloadPatch;
  delivery?: CronDeliveryPatch;
  failureAlert?: CronFailureAlertPatch | false | null;
  state?: CronJobStateInput;
};
//#endregion
//#region src/cron/service/list-page-types.d.ts
/** Enabled-state filter accepted by paginated cron listing. */
type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Schedule-kind filter accepted by paginated cron listing. */
type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron" | "on-exit" | "stream";
/** Last-run status filter, including jobs that have not produced a status yet. */
type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Stable sort keys supported by paginated cron listing. */
type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Sort direction for paginated cron listing. */
type CronSortDir = "asc" | "desc";
/** Input contract for filtered, sorted, offset-based cron job pages. */
type CronListPageOptions = {
  includeDisabled?: boolean;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: CronJobsEnabledFilter;
  scheduleKind?: CronJobsScheduleKindFilter;
  lastRunStatus?: CronJobsLastRunStatusFilter;
  sortBy?: CronJobsSortBy;
  sortDir?: CronSortDir;
  agentId?: string;
};
/** Offset-page result returned by cron listPage callers. */
type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs; /** Opaque revision for the complete filtered, sorted result set. */
  snapshotRevision: string;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
//#endregion
//#region src/infra/sqlite-wal.d.ts
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
type SqliteWalMaintenance = {
  checkpoint: () => boolean;
  close: (options?: {
    checkpointMode?: SqliteWalCheckpointMode;
  }) => boolean;
};
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
type OpenClawStateDatabase = {
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
  database?: OpenClawStateDatabase;
  readOnly?: boolean;
};
//#endregion
//#region src/cron/service/state.d.ts
/** Direct-run mode: respect due time or force execution. */
type CronRunMode = "due" | "force";
/** Main-session wake strategy used after enqueuing cron text. */
type CronWakeMode = "now" | "next-heartbeat";
/** Lightweight service status returned to gateway/control surfaces. */
type CronStatusSummary = {
  enabled: boolean; /** @deprecated Alias for `sqlitePath`. */
  storePath: string; /** Storage backend identifier. */
  storage: "sqlite"; /** Resolved path to the shared state SQLite database. */
  sqlitePath: string;
  jobs: number;
  nextWakeAtMs: number | null;
};
/** Result shape for immediate or queued cron run requests. */
type CronRunResult = {
  ok: true;
  ran: true;
} | {
  ok: true;
  enqueued: true;
  runId: string;
} | {
  ok: true;
  ran: false;
  reason: "not-due";
} | {
  ok: true;
  ran: false;
  reason: "already-running";
} | {
  ok: true;
  ran: false;
  reason: "restart-recovery-pending";
} | {
  ok: true;
  ran: false;
  reason: "invalid-spec";
} | {
  ok: true;
  ran: false;
  reason: "stopped";
} | {
  ok: false;
};
/** Remove result that distinguishes missing jobs from failed removal. */
type CronRemoveResult = {
  ok: true;
  removed: boolean;
} | {
  ok: false;
  removed: false;
};
/** Created cron job returned by service mutation calls. */
type CronDeclarativeAddResult = CronStoredJob & {
  created: boolean;
  updated?: boolean;
  job: CronStoredJob;
};
type CronAddResult = CronStoredJob | CronDeclarativeAddResult;
/** Updated cron job returned by service mutation calls. */
type CronUpdateResult = CronJob;
/** Chronological job list returned by service read calls. */
type CronListResult = CronJob[];
/** Normalized create input accepted by the cron service. */
type CronAddInput = CronJobCreate;
/** Caller-specific declaration-key visibility and explicit enablement metadata. */
type CronAddOptions = {
  matchesExisting?: (job: CronJob) => boolean;
  enabledExplicit?: boolean; /** Gateway/doctor-owned heartbeat jobs require this opt-in at service creation. */
  systemOwned?: boolean; /** Authenticated caller provenance stamped by the service, never public input. */
  scheduledToolPolicy?: CronScheduledToolPolicy; /** Private proof from an authenticated agent-runtime caller. */
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void; /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
/** Normalized patch input accepted by cron service updates. */
type CronUpdateInput = CronJobPatch;
/** Authenticated caller provenance used only when a tool policy is explicitly adopted. */
type CronUpdateOptions = {
  scheduledToolPolicy?: CronScheduledToolPolicy;
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void; /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
type CronCommitGuardOptions = {
  /** Synchronous Gateway-owned guard consumed at the mutation owner. */commitGuard?: () => void;
};
/** Cron-store-locked guard evaluated against the current job before an update applies. */
type CronUpdatePrecondition = (job: CronJob, nowMs: number) => void | Promise<void>;
//#endregion
//#region src/cron/service-contract.d.ts
type CronWakeResult = {
  ok: true;
} | {
  ok: false;
  reason?: "unwakeable-session-key";
};
/** Result shape for direct/queued cron runs. */
type CronServiceRunResult = CronRunResult;
type CronServiceRunOptions = {
  payload?: CronPayload; /** Internal event-source runs keep their persisted trigger on force execution. */
  evaluateTrigger?: boolean; /** Current stream batch exposed to trigger scripts as trigger.streamBatch. */
  streamBatch?: string; /** Source schedule identity checked under the cron store lock before admission. */
  streamScheduleKey?: string; /** Logical source identity; rejects retired batches under same-schedule ABA. */
  streamSourceIdentity?: string;
  onTriggerDisposition?: (disposition: "fired" | "dropped" | "busy" | "error") => void; /** Synchronous caller-authority guard consumed before run reservation. */
  commitGuard?: () => void;
};
/** Public cron service facade used by gateway, plugin SDK, and tests. */
interface CronServiceContract {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<CronStatusSummary>;
  list(opts?: {
    includeDisabled?: boolean;
  }): Promise<CronListResult>;
  listPage(opts?: CronListPageOptions): Promise<CronListPageResult>;
  add(input: CronAddInput, opts?: CronAddOptions): Promise<CronAddResult>;
  update(id: string, patch: CronUpdateInput, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  updateWithPrecondition(id: string, patch: CronUpdateInput, precondition: CronUpdatePrecondition, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  remove(id: string, opts?: {
    systemOwned?: boolean;
  } & CronCommitGuardOptions): Promise<CronRemoveResult>;
  run(id: string, mode?: CronRunMode, opts?: CronServiceRunOptions): Promise<CronServiceRunResult>;
  enqueueRun(id: string, mode?: CronRunMode, opts?: CronCommitGuardOptions): Promise<CronServiceRunResult>;
  getJob(id: string): CronJob | undefined;
  readJob(id: string): Promise<CronJob | undefined>;
  getDefaultAgentId(): string | undefined;
  wake(opts: {
    mode: CronWakeMode;
    text: string;
    sessionKey?: string;
    agentId?: string;
  }): CronWakeResult;
}
//#endregion
//#region src/gateway/methods/descriptor.d.ts
/** Scope marker for methods that only authenticated node clients may call. */
declare const NODE_GATEWAY_METHOD_SCOPE: "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
declare const DYNAMIC_GATEWAY_METHOD_SCOPE: "dynamic";
/** Authorization scope attached to a gateway method descriptor. */
type GatewayMethodScope = OperatorScope | typeof NODE_GATEWAY_METHOD_SCOPE | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;
/** Owner metadata used to keep core, plugin, channel, and auxiliary methods distinguishable. */
type GatewayMethodOwner = {
  kind: "core";
  area: string;
} | {
  kind: "plugin";
  pluginId: string;
} | {
  kind: "channel";
  channelId: string;
} | {
  kind: "aux";
  area: string;
};
/** Startup availability flag exposed to clients as retryable startup-unavailable errors. */
type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";
type GatewayMethodHandler = (opts: never) => unknown;
/** Complete metadata for one dispatchable gateway method. */
type GatewayMethodDescriptor = {
  name: string;
  handler: GatewayMethodHandler;
  scope: GatewayMethodScope;
  owner: GatewayMethodOwner;
  since?: string;
  startup?: GatewayMethodStartupAvailability;
  controlPlaneWrite?: boolean;
  advertise?: boolean;
  description?: string;
};
/** Read-only method registry view used by request dispatch and method listing. */
type GatewayMethodRegistryView = {
  /** Opaque registry handle carried into request scope by the gateway composition root. */pluginRegistry?: object;
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
//#endregion
//#region src/gateway/session-observer-contract.d.ts
type SessionObserverEvent = {
  runId: string;
  seq: number;
  stream: string;
  ts: number;
  data: Record<string, unknown>;
  lifecycleGeneration?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
};
type SessionObserverCompanionSnapshot = {
  agentId: string;
  runId?: string;
  digest?: SessionObserverDigest;
  notes: Array<{
    sequence: number;
    text: string;
  }>;
};
type SessionObserverService = {
  handleEvent: (event: SessionObserverEvent) => void;
  setConnectionVisibility: (connId: string, visible: boolean) => void;
  removeConnection: (connId: string) => void;
  getCompanionSnapshot: (sessionKey: string, agentId?: string) => SessionObserverCompanionSnapshot;
  dispose: () => void;
};
//#endregion
//#region src/gateway/session-companion.d.ts
type SessionCompanionTarget = {
  sessionKey: string;
  agentId: string;
};
type SessionCompanionService = {
  ask: (params: {
    agentId: string;
    sessionKey: string;
    question: string;
    connId: string;
    signal?: AbortSignal;
  }) => Promise<SessionsCompanionAskResult>;
  state: (target: SessionCompanionTarget) => SessionsCompanionStateResult;
  reset: (target: SessionCompanionTarget) => void;
  dispose: () => void;
};
//#endregion
//#region src/gateway/chat-queued-turns.d.ts
type QueuedChatTurnEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string; /** False once collect-mode transfers cancellation to the aggregate owner. */
  abortable?: boolean;
  agentId?: string;
  ownerConnId?: string;
  ownerDeviceId?: string;
};
//#endregion
//#region src/plugins/provider-auth-types.d.ts
/** Provider secret input modes: inline plaintext or external secret reference. */
type SecretInputMode = "plaintext" | "ref";
//#endregion
//#region src/commands/daemon-runtime.d.ts
type GatewayDaemonRuntime = "node";
//#endregion
//#region src/commands/onboard-types.d.ts
type OnboardMode = "local" | "remote";
/**
 * Auth choices are plugin-owned contract ids plus a few legacy aliases that
 * are normalized elsewhere (for example `oauth` -> `setup-token`).
 */
type BuiltInAuthChoice = /** @deprecated Use `setup-token`. */"oauth" | "setup-token" | "token" | "apiKey" | "custom-api-key" | "skip";
type AuthChoice = BuiltInAuthChoice | (string & {});
type GatewayAuthChoice = "token" | "password";
type ResetScope = "config" | "config+creds+sessions" | "full";
type GatewayBind = "loopback" | "lan" | "auto" | "custom" | "tailnet";
type TailscaleMode = "off" | "serve" | "funnel";
declare const NODE_MANAGER_CHOICES: readonly ["npm", "pnpm", "bun"];
type NodeManagerChoice = (typeof NODE_MANAGER_CHOICES)[number];
declare const ONBOARD_FLOWS: readonly ["quickstart", "advanced", "manual", "import"];
type OnboardFlow = (typeof ONBOARD_FLOWS)[number];
type OnboardDynamicProviderOptions = {
  /**
   * Provider-specific non-interactive auth flags are plugin-owned and keyed by
   * manifest `providerAuthChoices[].optionKey` values.
   */
  [optionKey: string]: unknown;
};
/** Parsed options accepted by `openclaw onboard`. */
type OnboardOptions = OnboardDynamicProviderOptions & {
  mode?: OnboardMode; /** "manual" is an alias for "advanced". */
  flow?: OnboardFlow; /** Force the classic multi-step interactive wizard instead of guided setup. */
  classic?: boolean; /** Force the terminal hatch instead of the guided browser handoff. */
  tui?: boolean;
  workspace?: string; /** Name for the first persisted agent; defaults to `main` in non-interactive setup. */
  agentName?: string;
  nonInteractive?: boolean; /** Required for non-interactive setup; skips the interactive risk prompt when true. */
  acceptRisk?: boolean;
  reset?: boolean;
  resetScope?: ResetScope;
  authChoice?: AuthChoice; /** Used when `authChoice=token` in non-interactive mode. */
  tokenProvider?: string; /** Used when `authChoice=token` in non-interactive mode. */
  token?: string; /** Used when `authChoice=token` in non-interactive mode. */
  tokenProfileId?: string; /** Used when `authChoice=token` in non-interactive mode. */
  tokenExpiresIn?: string; /** API key persistence mode for setup flows (default: plaintext). */
  secretInputMode?: SecretInputMode;
  arceeaiApiKey?: string;
  cloudflareAiGatewayAccountId?: string;
  cloudflareAiGatewayGatewayId?: string;
  customBaseUrl?: string;
  customApiKey?: string;
  lmstudioApiKey?: string;
  customModelId?: string;
  customProviderId?: string;
  customCompatibility?: "openai" | "openai-responses" | "anthropic";
  customImageInput?: boolean;
  gatewayPort?: number;
  gatewayBind?: GatewayBind;
  gatewayAuth?: GatewayAuthChoice;
  gatewayToken?: string;
  gatewayTokenRefEnv?: string;
  gatewayPassword?: string;
  tailscale?: TailscaleMode;
  tailscaleResetOnExit?: boolean;
  installDaemon?: boolean;
  daemonRuntime?: GatewayDaemonRuntime;
  skipChannels?: boolean;
  skipSkills?: boolean;
  skipBootstrap?: boolean;
  skipSearch?: boolean;
  skipHealth?: boolean;
  skipUi?: boolean;
  suppressGatewayTokenOutput?: boolean;
  skipHooks?: boolean;
  nodeManager?: NodeManagerChoice;
  remoteUrl?: string;
  remoteToken?: string;
  importFrom?: string;
  importSource?: string;
  importSecrets?: boolean;
  json?: boolean;
};
//#endregion
//#region src/gateway/server-methods/wizard.d.ts
type ChannelSetupWizardRunner = (opts: {
  channel?: string;
  onConfigured?: (accounts: Array<{
    channel: string;
    accountId: string;
  }>) => void;
  beforePersistentEffect?: () => Promise<void>;
}, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
//#endregion
//#region src/gateway/control-ui-contract.d.ts
/** Check-run rollup for a PR head commit, chip pill + CI monitoring popover. */
type ControlUiSessionPullRequestChecks = {
  state: "pending" | "passing" | "failing";
  passed: number;
  failed: number;
  skipped: number; /** Queued/in-progress runs plus stale conclusions GitHub invalidated. */
  running: number;
};
/** One GitHub pull request whose head is the session's working branch. */
type ControlUiSessionPullRequest = {
  number: number;
  owner: string;
  repo: string;
  branch: string;
  title: string;
  url: string;
  state: "open" | "draft" | "merged" | "closed";
  additions?: number;
  deletions?: number; /** Latest check-run rollup for the head commit; absent when no checks ran. */
  checks?: ControlUiSessionPullRequestChecks;
  checksUrl?: string;
};
/**
 * The session's working branch, resolved from local git only so the pre-PR
 * "Create PR" row keeps rendering while the GitHub quota is exhausted.
 */
type ControlUiSessionBranch = {
  owner: string;
  repo: string;
  branch: string; /** Working-tree diff vs the merge base with the remote default branch. */
  additions?: number;
  deletions?: number;
  /**
   * GitHub "open a pull request for this branch" page. Absent while the
   * branch is unpushed or has nothing to compare — the row then only reports
   * the session's local changed files.
   */
  createUrl?: string;
};
/** Pull requests detected for a session's git branch, chip row payload. */
type ControlUiSessionPullRequests = {
  pullRequests: ControlUiSessionPullRequest[];
  /**
   * Present when the session's non-default GitHub branch has a creatable PR
   * on origin or local changed files in the working tree.
   */
  branch?: ControlUiSessionBranch; /** GitHub quota exhausted; entries may be stale until the limit resets. */
  rateLimited: boolean;
};
//#endregion
//#region src/gateway/control-ui-session-prs.d.ts
type ControlUiSessionPullRequestsParams = {
  sessionKey: string;
  agentId?: string;
  refresh?: boolean;
};
//#endregion
//#region src/gateway/server-broadcast-types.d.ts
type GatewayBroadcastStateVersion = {
  presence?: number;
  health?: number;
};
/** Options for gateway websocket broadcasts. */
type GatewayBroadcastOpts = {
  /** Agent scope for agent-relative keys such as `global`. */agentId?: string;
  dropIfSlow?: boolean; /** Canonical subscription keys for session-scoped delivery. */
  sessionKeys?: readonly string[];
  stateVersion?: GatewayBroadcastStateVersion;
};
/** Broadcast function signature for all connected clients. */
type GatewayBroadcastFn = (event: string, payload: unknown, opts?: GatewayBroadcastOpts) => void;
/** Broadcast function signature for targeted connection ids. */
type GatewayBroadcastToConnIdsFn = (event: string, payload: unknown, connIds: ReadonlySet<string>, opts?: GatewayBroadcastOpts) => void;
//#endregion
//#region src/gateway/control-ui-session-pr-subscriptions.d.ts
type LoadSessionPullRequests = (params: ControlUiSessionPullRequestsParams) => Promise<ControlUiSessionPullRequests>;
type SubscriptionDeps = {
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  load?: LoadSessionPullRequests;
  setTimer?: typeof globalThis.setTimeout;
  clearTimer?: typeof globalThis.clearTimeout;
};
type ControlUiSessionPullRequestSubscriptions = {
  replace: (connId: string, sessionKeys: readonly string[], refreshSessionKeys?: ReadonlySet<string>) => Promise<void>;
  unsubscribe: (connId: string) => void;
  pollNow: () => Promise<void>;
  stop: () => void;
};
/**
 * Owns the union of connection replace-sets. Only this union drives GitHub
 * refreshes, so hidden/disconnected clients cannot leave orphan polling work.
 */
declare function createControlUiSessionPullRequestSubscriptions(deps: SubscriptionDeps): ControlUiSessionPullRequestSubscriptions;
//#endregion
//#region src/gateway/session-viewer-presence.d.ts
type SessionViewerPresenceDeclarationsDeps = {
  onReplace: (connId: string, sessionKeys: readonly string[]) => void;
};
type SessionViewerPresenceDeclarations = {
  replace: (connId: string, sessionKeys: readonly string[]) => readonly string[];
  unsubscribe: (connId: string) => void;
  stop: () => void;
};
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
declare function createSessionViewerPresenceDeclarations(deps: SessionViewerPresenceDeclarationsDeps): SessionViewerPresenceDeclarations;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
//#endregion
//#region src/gateway/desktop/managed-linux.d.ts
type ManagedLinuxDesktopStatus = {
  state: "not-started";
} | {
  state: "starting";
  display?: number;
  port?: number;
} | {
  state: "running";
  display: number;
  port: number;
} | {
  state: "failed";
  error: string;
  display?: number;
  port?: number;
};
//#endregion
//#region src/gateway/desktop/host-source.d.ts
type HostDesktopStatus = {
  enabled: false;
  state: "disabled";
  port: number;
} | {
  enabled: true;
  state: "attached";
  port: number;
  security: string;
} | {
  enabled: true;
  state: "unavailable";
  port: number;
  security?: string;
} | {
  enabled: true;
  state: "managed";
  managedState: ManagedLinuxDesktopStatus["state"] | "unknown";
  port: number;
  display?: number;
  error?: string;
  security?: "VncAuth";
};
type HostDesktopService = {
  observe(params: {
    control: boolean;
    credentials?: {
      username?: string;
      password?: string;
    };
  }): Promise<{
    transport: "rfb";
    wsPath: string;
    expiresAtMs: number;
    control: boolean;
    auth: "vnc-password" | "ard-account";
    vncPassword?: string;
  }>;
  status(): Promise<HostDesktopStatus>;
};
//#endregion
//#region src/infra/voicewake-routing.d.ts
type VoiceWakeRouteTarget = {
  mode: "current";
  agentId?: undefined;
  sessionKey?: undefined;
} | {
  agentId: string;
  sessionKey?: undefined;
  mode?: undefined;
} | {
  sessionKey: string;
  agentId?: undefined;
  mode?: undefined;
};
type VoiceWakeRouteRule = {
  trigger: string;
  target: VoiceWakeRouteTarget;
};
type VoiceWakeRoutingConfig = {
  version: 1;
  defaultTarget: VoiceWakeRouteTarget;
  routes: VoiceWakeRouteRule[];
  updatedAtMs: number;
};
//#endregion
//#region packages/gateway-protocol/src/schema/approvals.d.ts
/** Reviewer-safe presentation discriminated by the approval owner. */
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  detail: Type.TOptional<Type.TString>;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WorkerInferenceModelRefSchema: Type.TObject<{
  readonly provider: Type.TString;
  readonly model: Type.TString;
}>;
declare const WorkerInferenceOptionsSchema: Type.TObject<{
  readonly temperature: Type.TOptional<Type.TNumber>;
  readonly maxTokens: Type.TOptional<Type.TInteger>;
  readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
  readonly thinkingBudgets: Type.TOptional<Type.TObject<{
    readonly minimal: Type.TOptional<Type.TInteger>;
    readonly low: Type.TOptional<Type.TInteger>;
    readonly medium: Type.TOptional<Type.TInteger>;
    readonly high: Type.TOptional<Type.TInteger>;
    readonly max: Type.TOptional<Type.TInteger>;
  }>>;
}>;
type WorkerInferenceModelRef = Static<typeof WorkerInferenceModelRefSchema>;
type WorkerInferenceOptions = Static<typeof WorkerInferenceOptionsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["webchat-ui", "openclaw-control-ui", "openclaw-browser-copilot", "openclaw-tui", "webchat", "cli", "gateway-client", "openclaw-macos", "openclaw-linux", "openclaw-ios", "openclaw-watchos", "openclaw-android", "node-host", "openclaw-worker", "test", "fingerprint", "openclaw-probe"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "worker", "test", "probe", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>; /** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
  computerUse: Type.TOptional<Type.TUnknown>; /** Additive node-local worker build identity; presence advertises session hosting. */
  workerRuns: Type.TOptional<Type.TObject<{
    bundleHash: Type.TString;
    openclawVersion: Type.TString;
    protocolFeatures: Type.TArray<Type.TString>;
  }>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  device: Type.TOptional<Type.TObject<{
    id: Type.TString;
    publicKey: Type.TString;
    signature: Type.TString;
    signedAt: Type.TInteger;
    nonce: Type.TString;
  }>>;
  auth: Type.TOptional<Type.TObject<{
    token: Type.TOptional<Type.TString>;
    bootstrapToken: Type.TOptional<Type.TString>;
    deviceToken: Type.TOptional<Type.TString>;
    password: Type.TOptional<Type.TString>;
    approvalRuntimeToken: Type.TOptional<Type.TString>;
    agentRuntimeIdentityToken: Type.TOptional<Type.TString>;
  }>>;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Standard structured error shape used in response frames and connect failures. */
declare const ErrorShapeSchema: Type.TObject<{
  code: Type.TString;
  message: Type.TString;
  details: Type.TOptional<Type.TUnknown>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Client request frame envelope; `method` selects the payload validator. */
declare const RequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  traceparent: Type.TOptional<Type.TString>;
}>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.d.ts
declare const SessionCatalogHostSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
  connected: Type.TBoolean;
  nodeId: Type.TOptional<Type.TString>;
  sessions: Type.TArray<Type.TObject<{
    threadId: Type.TString;
    name: Type.TOptional<Type.TString>;
    cwd: Type.TOptional<Type.TString>;
    status: Type.TString;
    createdAt: Type.TOptional<Type.TNumber>;
    updatedAt: Type.TOptional<Type.TNumber>;
    recencyAt: Type.TOptional<Type.TNumber>;
    source: Type.TOptional<Type.TString>;
    modelProvider: Type.TOptional<Type.TString>;
    cliVersion: Type.TOptional<Type.TString>;
    gitBranch: Type.TOptional<Type.TString>;
    customGroup: Type.TOptional<Type.TString>;
    pullRequest: Type.TOptional<Type.TObject<{
      numbers: Type.TArray<Type.TInteger>;
      state: Type.TUnion<[Type.TLiteral<"open">, Type.TLiteral<"draft">, Type.TLiteral<"merged">, Type.TLiteral<"closed">]>;
    }>>;
    archived: Type.TBoolean;
    sessionKey: Type.TOptional<Type.TString>;
    createdActor: Type.TOptional<Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    canContinue: Type.TBoolean;
    canArchive: Type.TBoolean;
    canOpenTerminal: Type.TOptional<Type.TBoolean>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
  }>>;
}>;
declare const SessionsCatalogReadParamsSchema: Type.TObject<{
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
declare const SessionsCatalogReadResultSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TOptional<Type.TString>;
  threadId: Type.TString;
  items: Type.TArray<Type.TObject<{
    id: Type.TOptional<Type.TString>;
    type: Type.TUnion<[Type.TLiteral<"userMessage">, Type.TLiteral<"agentMessage">, Type.TLiteral<"reasoning">, Type.TLiteral<"toolCall">, Type.TLiteral<"toolResult">, Type.TLiteral<"other">]>;
    text: Type.TOptional<Type.TString>;
    timestamp: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    truncated: Type.TOptional<Type.TBoolean>;
    raw: Type.TOptional<Type.TUnknown>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogContinueParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  confirmNoOtherRunner: Type.TLiteral<true>;
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
type SessionCatalogHost = Static<typeof SessionCatalogHostSchema>;
type SessionsCatalogReadParams = Static<typeof SessionsCatalogReadParamsSchema>;
type SessionsCatalogReadResult = Static<typeof SessionsCatalogReadResultSchema>;
type SessionsCatalogContinueParams = Static<typeof SessionsCatalogContinueParamsSchema>;
type SessionsCatalogArchiveParams = Static<typeof SessionsCatalogArchiveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Waits for a submitted agent run to complete or time out. */
declare const AgentWaitParamsSchema: Type.TObject<{
  runId: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
type AgentWaitParams = Static<typeof AgentWaitParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
declare const AgentsListResultSchema: Type.TObject<{
  defaultId: Type.TString;
  ownership: Type.TOptional<Type.TUnion<[Type.TLiteral<"sole">, Type.TLiteral<"legacy">, Type.TLiteral<"explicit">]>>;
  selectionRequired: Type.TOptional<Type.TBoolean>;
  mainKey: Type.TString;
  scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
  agents: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>>;
    name: Type.TOptional<Type.TString>;
    identity: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      theme: Type.TOptional<Type.TString>;
      emoji: Type.TOptional<Type.TString>;
      avatar: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    workspace: Type.TOptional<Type.TString>;
    workspaceGit: Type.TOptional<Type.TBoolean>;
    model: Type.TOptional<Type.TObject<{
      primary: Type.TOptional<Type.TString>;
      fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    agentRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
    }>>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
    thinkingDefault: Type.TOptional<Type.TString>;
  }>>;
}>;
type AgentsListResult = Static<typeof AgentsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.d.ts
declare const SystemAgentWizardCancelSchema: Type.TObject<{
  /** The visible step this action belongs to; stale controls must not affect a newer step. */stepId: Type.TString;
}>;
/**
 * Structured choice attached to a chat reply. Card-capable clients render the
 * options and send back `reply` (default: `label`) as the next message; text
 * clients ignore this and use the reply prose, which always stands alone.
 */
declare const SystemAgentChatQuestionSchema: Type.TObject<{
  id: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    recommended: Type.TOptional<Type.TBoolean>; /** Message text a client sends when this option is chosen; defaults to label. */
    reply: Type.TOptional<Type.TString>;
  }>>; /** Free-text answers are also accepted for this question. */
  isOther: Type.TOptional<Type.TBoolean>; /** Client-owned action for the visible skip control; omitted means send a reply. */
  skipAction: Type.TOptional<Type.TLiteral<"exit">>;
}>;
type SystemAgentWizardCancel = Static<typeof SystemAgentWizardCancelSchema>;
type SystemAgentChatQuestion = Static<typeof SystemAgentChatQuestionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
/** Returns the terminal scope-upgrade state to the identity-bound waiter. */
declare const ScopeUpgradeResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"approved">;
  requestId: Type.TString;
  deviceToken: Type.TString;
  scopes: Type.TArray<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"rejected">;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
  requestId: Type.TString;
}>]>;
type ScopeUpgradeResult = Static<typeof ScopeUpgradeResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<Type.TObject<{
    server: Type.TString;
    tool: Type.TString;
  }>>;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
declare const SessionPlacementDiskSpaceSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  availableBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  observedAtMs: Type.TInteger;
}>;
type SessionPlacementDiskSpace = Static<typeof SessionPlacementDiskSpaceSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  presence: Type.TArray<Type.TObject<{
    host: Type.TOptional<Type.TString>;
    ip: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    ts: Type.TInteger;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
    user: Type.TOptional<Type.TObject<{
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */id: Type.TString;
      email: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>; /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
    watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  health: Type.TObject<{
    ok: Type.TOptional<Type.TLiteral<true>>;
    ts: Type.TOptional<Type.TInteger>;
    durationMs: Type.TOptional<Type.TInteger>;
    eventLoop: Type.TOptional<Type.TObject<{
      degraded: Type.TBoolean;
      degradedSinceMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
      intervalMs: Type.TNumber;
      delayP99Ms: Type.TNumber;
      delayMaxMs: Type.TNumber;
      utilization: Type.TNumber;
      cpuCoreRatio: Type.TNumber;
    }>>;
    plugins: Type.TOptional<Type.TObject<{
      loaded: Type.TArray<Type.TString>;
      errors: Type.TArray<Type.TObject<{
        id: Type.TString;
        origin: Type.TString;
        activated: Type.TBoolean;
        activationSource: Type.TOptional<Type.TString>;
        activationReason: Type.TOptional<Type.TString>;
        failurePhase: Type.TOptional<Type.TString>;
        error: Type.TString;
      }>>;
      unavailable: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        state: Type.TLiteral<"configured-unavailable">;
        diagnostic: Type.TObject<{
          kind: Type.TLiteral<"plugin-verification">;
          reason: Type.TString;
          detail: Type.TString;
        }>;
      }>>>;
    }>>;
    contextEngines: Type.TOptional<Type.TObject<{
      quarantined: Type.TArray<Type.TObject<{
        engineId: Type.TString;
        owner: Type.TOptional<Type.TString>;
        operation: Type.TString;
        reason: Type.TString;
        failedAt: Type.TInteger;
      }>>;
    }>>;
    deliveryQueues: Type.TOptional<Type.TObject<{
      failed: Type.TArray<Type.TObject<{
        queueName: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>;
      ingressFailed: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>>;
      ingressPressure: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        laneCount: Type.TInteger;
        pendingCount: Type.TInteger;
        claimedCount: Type.TInteger;
        blockedCount: Type.TInteger;
        oldestReceivedAt: Type.TInteger;
      }>>>;
    }>>;
    modelPricing: Type.TOptional<Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">, Type.TLiteral<"disabled">]>;
      sources: Type.TArray<Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"openrouter">, Type.TLiteral<"litellm">, Type.TLiteral<"bootstrap">, Type.TLiteral<"refresh">]>;
        state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">]>;
        lastFailureAt: Type.TOptional<Type.TInteger>;
        detail: Type.TOptional<Type.TString>;
      }>>;
      lastFailureAt: Type.TOptional<Type.TInteger>;
      detail: Type.TOptional<Type.TString>;
    }>>;
    configReload: Type.TOptional<Type.TObject<{
      hotReloadStatus: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"disabled">]>;
    }>>;
    channels: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    channelOrder: Type.TOptional<Type.TArray<Type.TString>>;
    channelLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    heartbeatSeconds: Type.TOptional<Type.TInteger>;
    defaultAgentId: Type.TOptional<Type.TString>;
    agents: Type.TOptional<Type.TArray<Type.TObject<{
      agentId: Type.TString;
      name: Type.TOptional<Type.TString>;
      isDefault: Type.TBoolean;
      heartbeat: Type.TObject<{
        enabled: Type.TBoolean;
        every: Type.TString;
        everyMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        prompt: Type.TString;
        target: Type.TString;
        model: Type.TOptional<Type.TString>;
        session: Type.TOptional<Type.TString>;
        ackMaxChars: Type.TInteger;
      }>;
      sessions: Type.TObject<{
        path: Type.TString;
        count: Type.TInteger;
        recent: Type.TArray<Type.TObject<{
          key: Type.TString;
          updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
          age: Type.TUnion<[Type.TInteger, Type.TNull]>;
        }>>;
      }>;
    }>>>;
    sessions: Type.TOptional<Type.TObject<{
      path: Type.TString;
      count: Type.TInteger;
      recent: Type.TArray<Type.TObject<{
        key: Type.TString;
        updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
        age: Type.TUnion<[Type.TInteger, Type.TNull]>;
      }>>;
    }>>;
  }>;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger; /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    ownership: Type.TOptional<Type.TUnion<[Type.TLiteral<"sole">, Type.TLiteral<"legacy">, Type.TLiteral<"explicit">]>>;
    selectionRequired: Type.TOptional<Type.TBoolean>;
    mainKey: Type.TString;
    mainSessionKey: Type.TString;
    scope: Type.TOptional<Type.TString>;
  }>>;
  authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
  updateAvailable: Type.TOptional<Type.TObject<{
    currentVersion: Type.TString;
    latestVersion: Type.TString;
    channel: Type.TString;
    currentSha: Type.TOptional<Type.TString>;
    upstreamRef: Type.TOptional<Type.TString>;
    upstreamSha: Type.TOptional<Type.TString>;
    commitsBehind: Type.TOptional<Type.TInteger>;
    commits: Type.TOptional<Type.TArray<Type.TObject<{
      sha: Type.TString;
      subject: Type.TString;
    }>>>;
  }>>;
  updateSchedule: Type.TOptional<Type.TObject<{
    channel: Type.TString;
    autoEnabled: Type.TBoolean;
    install: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"package">, Type.TLiteral<"git">, Type.TLiteral<"unknown">]>;
      git: Type.TOptional<Type.TUnion<[Type.TObject<{
        status: Type.TLiteral<"current">;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"behind">;
        commitsBehind: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"ahead">;
        commitsAhead: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"diverged">;
        commitsAhead: Type.TInteger;
        commitsBehind: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"unavailable">;
        reason: Type.TUnion<[Type.TLiteral<"fetch-failed">, Type.TLiteral<"no-upstream">, Type.TLiteral<"no-upstream-sha">, Type.TLiteral<"comparison-failed">, Type.TLiteral<"git-unavailable">]>;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>]>>;
    }>>;
    target: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"package">;
      version: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"git">;
      upstreamRef: Type.TString;
      upstreamSha: Type.TString;
      commitsBehind: Type.TInteger;
    }>]>>;
    campaign: Type.TOptional<Type.TObject<{
      id: Type.TString;
      state: Type.TUnion<[Type.TLiteral<"waiting-for-idle">, Type.TLiteral<"countdown">, Type.TLiteral<"applying">]>;
      announcedAtMs: Type.TInteger;
      applyAtMs: Type.TOptional<Type.TInteger>;
      holdUntilMs: Type.TOptional<Type.TInteger>;
      forceAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
    }>>;
  }>>;
}>;
type Snapshot = Static<typeof SnapshotSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/portals.d.ts
declare const PortalSummarySchema: Type.TObject<{
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TOptional<Type.TString>;
  url: Type.TOptional<Type.TString>;
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
}>;
declare const PortalOpenResultSchema: Type.TObject<{
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TString;
  url: Type.TString;
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
}>;
type PortalSummary = Static<typeof PortalSummarySchema>;
type PortalOpenResult = Static<typeof PortalOpenResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Client answer payload for the current wizard step. */
declare const WizardAnswerSchema: Type.TObject<{
  stepId: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
}>;
/** UI contract for one wizard step rendered by gateway clients. */
declare const WizardStepSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
  title: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
  options: Type.TOptional<Type.TArray<Type.TObject<{
    value: Type.TUnknown;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
  }>>>;
  initialValue: Type.TOptional<Type.TUnknown>;
  placeholder: Type.TOptional<Type.TString>;
  sensitive: Type.TOptional<Type.TBoolean>;
  executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
  externalUrl: Type.TOptional<Type.TString>;
  deviceCode: Type.TOptional<Type.TObject<{
    code: Type.TString;
    expiresInMinutes: Type.TOptional<Type.TInteger>;
    message: Type.TOptional<Type.TString>;
  }>>;
}>;
type WizardAnswer = Static<typeof WizardAnswerSchema>;
type WizardStep$1 = Static<typeof WizardStepSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
/** Build identity presented by a worker before the gateway admits it. */
declare const WorkerAdmissionHandshakeSchema: Type.TObject<{
  bundleHash: Type.TString;
  openclawVersion: Type.TString;
  protocolFeatures: Type.TArray<Type.TString>;
}>;
/** Dedicated first-frame payload accepted only on the worker ingress. */
declare const WorkerConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TLiteral<"openclaw-worker">;
    version: Type.TString;
    platform: Type.TString;
    mode: Type.TLiteral<"worker">;
  }>;
  role: Type.TLiteral<"worker">;
  admission: Type.TUnion<[Type.TObject<{
    sessionId: Type.TNull;
    runId: Type.TNull;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>, Type.TObject<{
    sessionId: Type.TString;
    runId: Type.TString;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>]>;
}>;
declare const WorkerTranscriptMessageSchema: Type.TUnion<[Type.TObject<{
  role: Type.TLiteral<"user">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"assistant">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking">;
    thinking: Type.TString;
    thinkingSignature: Type.TOptional<Type.TString>;
    redacted: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolCall">;
    id: Type.TString;
    name: Type.TString;
    arguments: Type.TRecord<"^.*$", Type.TUnknown>;
    thoughtSignature: Type.TOptional<Type.TString>;
    executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
  }>]>>;
  api: Type.TString;
  provider: Type.TString;
  model: Type.TString;
  responseModel: Type.TOptional<Type.TString>;
  responseId: Type.TOptional<Type.TString>;
  providerReplay: Type.TOptional<Type.TObject<{
    v: Type.TLiteral<1>;
    type: Type.TString;
    id: Type.TOptional<Type.TString>;
    data: Type.TString;
    replayIndex: Type.TOptional<Type.TInteger>;
    provider: Type.TString;
    api: Type.TString;
    model: Type.TString;
    baseUrlHash: Type.TOptional<Type.TString>;
    sessionHash: Type.TOptional<Type.TString>;
    authProfileHash: Type.TOptional<Type.TString>;
  }>>;
  diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TString;
    timestamp: Type.TInteger;
    error: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      message: Type.TString;
      stack: Type.TOptional<Type.TString>;
      code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>>;
  usage: Type.TObject<{
    input: Type.TNumber;
    output: Type.TNumber;
    cacheRead: Type.TNumber;
    cacheWrite: Type.TNumber;
    contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
      state: Type.TLiteral<"available">;
      promptTokens: Type.TNumber;
      totalTokens: Type.TNumber;
    }>, Type.TObject<{
      state: Type.TLiteral<"unavailable">;
    }>]>>;
    totalTokens: Type.TNumber;
    cost: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      total: Type.TNumber;
      totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
    }>;
  }>;
  stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
  errorMessage: Type.TOptional<Type.TString>;
  errorCode: Type.TOptional<Type.TString>;
  errorType: Type.TOptional<Type.TString>;
  errorBody: Type.TOptional<Type.TString>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"toolResult">;
  toolCallId: Type.TString;
  toolName: Type.TString;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  details: Type.TOptional<Type.TUnknown>;
  isError: Type.TBoolean;
  timestamp: Type.TInteger;
}>]>;
declare const WorkerTranscriptCommitParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  seq: Type.TInteger;
  baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
  messages: Type.TArray<Type.TUnion<[Type.TObject<{
    role: Type.TLiteral<"user">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"assistant">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking">;
      thinking: Type.TString;
      thinkingSignature: Type.TOptional<Type.TString>;
      redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolCall">;
      id: Type.TString;
      name: Type.TString;
      arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      thoughtSignature: Type.TOptional<Type.TString>;
      executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    api: Type.TString;
    provider: Type.TString;
    model: Type.TString;
    responseModel: Type.TOptional<Type.TString>;
    responseId: Type.TOptional<Type.TString>;
    providerReplay: Type.TOptional<Type.TObject<{
      v: Type.TLiteral<1>;
      type: Type.TString;
      id: Type.TOptional<Type.TString>;
      data: Type.TString;
      replayIndex: Type.TOptional<Type.TInteger>;
      provider: Type.TString;
      api: Type.TString;
      model: Type.TString;
      baseUrlHash: Type.TOptional<Type.TString>;
      sessionHash: Type.TOptional<Type.TString>;
      authProfileHash: Type.TOptional<Type.TString>;
    }>>;
    diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TString;
      timestamp: Type.TInteger;
      error: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        message: Type.TString;
        stack: Type.TOptional<Type.TString>;
        code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      }>>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>>;
    usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
    errorMessage: Type.TOptional<Type.TString>;
    errorCode: Type.TOptional<Type.TString>;
    errorType: Type.TOptional<Type.TString>;
    errorBody: Type.TOptional<Type.TString>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"toolResult">;
    toolCallId: Type.TString;
    toolName: Type.TString;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    details: Type.TOptional<Type.TUnknown>;
    isError: Type.TBoolean;
    timestamp: Type.TInteger;
  }>]>>;
}>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerTranscriptMessage = Static<typeof WorkerTranscriptMessageSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
//#endregion
//#region src/cli/outbound-send-mapping.d.ts
type CliOutboundSendSource = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/cli/deps.types.d.ts
/** CLI dependency bag currently used by outbound send command plumbing. */
type CliDeps = CliOutboundSendSource;
//#endregion
//#region src/infra/system-agent-approvals.d.ts
type SystemAgentApprovalRequestPayload = {
  title: string;
  description: string;
  command: string;
  proposalHash: string;
  allowedDecisions: readonly ExecApprovalDecision[];
  agentId?: string | null;
  sessionKey?: string | null;
  sessionId: string;
  turnSourceChannel?: null;
  turnSourceAccountId?: null;
};
//#endregion
//#region src/plugins/runtime/subagent-requester-context.d.ts
type PluginSubagentRequesterContext = Readonly<{
  sessionKey: string;
  origin: Readonly<DeliveryContext>;
}>;
//#endregion
//#region src/system-agent/operation-types.d.ts
/** Parsed OpenClaw operation before approval/execution. */
type SystemAgentOperation = {
  kind: "none";
  message: string;
} | {
  kind: "overview";
} | {
  kind: "doctor";
} | {
  kind: "doctor-fix";
} | {
  kind: "status";
} | {
  kind: "health";
} | {
  kind: "config-validate";
} | {
  kind: "config-get";
  path: string;
} | {
  kind: "config-schema";
  path?: string;
} | {
  kind: "config-set";
  path: string;
  value: string;
} | {
  kind: "config-set-ref";
  path: string;
  source: "env" | "file" | "exec" | "store";
  id: string;
  provider?: string;
} | {
  kind: "setup";
  workspace?: string;
  model?: string;
  agentName?: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "channel-list";
} | {
  kind: "channel-info";
  channel: string;
} | {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "skills-setup";
} | {
  kind: "search-setup";
} | {
  kind: "gateway-config-setup";
} | {
  kind: "memory-import";
} | {
  kind: "open-setup";
  target: "guided" | "classic" | "channels" | "search" | "gateway";
  channel?: string;
} | {
  kind: "gateway-status";
} | {
  kind: "gateway-start";
} | {
  kind: "gateway-stop";
} | {
  kind: "gateway-restart";
} | {
  kind: "agents";
} | {
  kind: "models";
} | {
  kind: "plugin-list";
} | {
  kind: "plugin-search";
  query: string;
} | {
  kind: "plugin-install";
  spec: string;
} | {
  kind: "plugin-uninstall";
  pluginId: string;
} | {
  kind: "audit";
} | {
  kind: "create-agent";
  agentId: string;
  workspace?: string;
  model?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
  agentDraft?: "hatch";
} | {
  kind: "set-default-model";
  model: string;
  agentId?: string;
};
//#endregion
//#region src/wizard/session.d.ts
type WizardStep = WizardStep$1;
type WizardSessionStatus = "running" | "done" | "cancelled" | "error";
type WizardNextResult = {
  done: boolean;
  step?: WizardStep;
  status: WizardSessionStatus;
  error?: string;
  channels?: string[];
  accounts?: Array<{
    channel: string;
    accountId: string;
  }>;
  preparedModelRef?: string;
};
declare class WizardSession {
  private runner;
  private readonly abortController;
  private readonly expiryTimer;
  private readonly runnerPromise;
  private currentStep;
  private progressSteps;
  private deliveredProgressStepIds;
  private stepDeferred;
  private pendingTerminalResolution;
  private cancellationLocked;
  private settled;
  private pendingExternalUrl;
  private answerDeferred;
  private status;
  private error;
  private configuredAccounts;
  private preparedModelRef;
  constructor(runner: (prompter: WizardPrompter, signal: AbortSignal, session: WizardSession) => Promise<void>, options?: {
    timeoutMs?: number;
  });
  next(): Promise<WizardNextResult>;
  private terminalResult;
  /** Record what the channels flow actually configured (channels flow only). */
  setConfiguredAccounts(accounts: ReadonlyArray<{
    channel: string;
    accountId: string;
  }>): void;
  /** Record the exact provider-owned model prepared by a setup flow. */
  setPreparedModelRef(modelRef: string): void;
  answer(stepId: string, value: unknown): Promise<string | undefined>;
  cancel(): boolean;
  /** The underlying mutation crossed its durable commit point and must finish. */
  lockCancellation(): void;
  get signal(): AbortSignal;
  pushStep(step: WizardStep): void;
  pushProgress(message: string): void;
  private rememberDeliveredProgressStep;
  queueExternalUrl(url: string): void;
  consumeExternalUrl(): string | undefined;
  private run;
  awaitAnswer(step: WizardStep, validate?: (value: string) => string | undefined): Promise<unknown>;
  private resolveStep;
  getStatus(): WizardSessionStatus;
  /** Whether the runner has stopped and can no longer mutate setup state. */
  isSettled(): boolean;
  /** Resolves after the runner can no longer mutate setup state. */
  whenSettled(): Promise<void>;
  getError(): string | undefined;
}
//#endregion
//#region src/gateway/cron-creator-authority-grant.d.ts
type CronCreatorAuthorityGrant = Readonly<{
  runId: string;
  token: string;
}>;
type CronCreatorAuthorityRunScope = {
  readonly runId: string;
  readonly signal: AbortSignal;
  readonly grantTokens: Set<string>;
  active: boolean;
  abort: () => void;
};
//#endregion
//#region src/channels/threading-tool-context-internal.d.ts
/** Host-only turn correlation carried beside the plugin-facing threading contract. */
type InternalChannelThreadingToolContext = ChannelThreadingToolContext & {
  currentSourceTurnId?: string;
};
//#endregion
//#region src/gateway/message-action-turn-capability.d.ts
type AgentRuntimeMessageActionContextBase = {
  expiresAtMs: number;
  sessionId?: string; /** Durable session entry that owns restart-recovery receipt state. */
  sourceReplySessionKey?: string;
  requesterAccountId?: string;
  requesterSenderId?: string;
  toolContext?: InternalChannelThreadingToolContext;
};
type AgentRuntimeMessageActionContext = AgentRuntimeMessageActionContextBase & ({
  sourceReplyFinal: true;
  sourceReplyToolCallId: string;
} | {
  sourceReplyFinal?: false;
  sourceReplyToolCallId?: string;
});
//#endregion
//#region src/gateway/worker-environments/placement-state.d.ts
declare const WORKER_SESSION_PLACEMENT_STATES: readonly ["local", "requested", "provisioning", "syncing", "starting", "active", "draining", "reconciling", "reclaimed", "failed"];
type WorkerSessionPlacementState = (typeof WORKER_SESSION_PLACEMENT_STATES)[number];
//#endregion
//#region src/gateway/worker-environments/placement-record.d.ts
type WorkerSessionPlacementIdentity = {
  sessionId: string;
  agentId: string;
  sessionKey: string;
};
type WorkerPlacementExecutionMode = "worker-turn" | "remote-exec";
type WorkerSessionPlacementDispatchIdentity = WorkerSessionPlacementIdentity & {
  executionMode?: WorkerPlacementExecutionMode;
};
type WorkerSessionTurnOwner = {
  kind: "local";
  environmentId?: string;
  ownerEpoch?: number;
} | {
  kind: "worker";
  environmentId: string;
  ownerEpoch: number;
};
type WorkerSessionTurnClaim = {
  sessionId: string;
  claimId: string;
  runId: string;
  placementGeneration: number;
  owner: WorkerSessionTurnOwner;
};
type PersistedTurnClaim = {
  owner: "local";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: null;
} | {
  owner: "worker";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: number;
};
type WorkerWorkspaceResultConflict = {
  paths: string[];
  stagedResultRef: string;
  totalCount?: number;
};
type PersistedLocalTurnClaim = Extract<PersistedTurnClaim, {
  owner: "local";
}>;
type PlacementRecordBase<TurnClaim extends PersistedTurnClaim | null> = WorkerSessionPlacementIdentity & {
  generation: number;
  executionMode: WorkerPlacementExecutionMode;
  turnClaim: TurnClaim;
  createdAtMs: number;
  updatedAtMs: number;
  stateChangedAtMs: number; /** Process-local UI projection; deliberately absent from SQLite. */
  workspaceResultConflict?: WorkerWorkspaceResultConflict;
};
type UnclaimedPlacementRecordBase = PlacementRecordBase<null>;
type LocalClaimablePlacementRecordBase = PlacementRecordBase<PersistedLocalTurnClaim | null>;
type EmptyWorkerPlacementMetadata = {
  environmentId: null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type ProvisioningPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type SyncingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type StartingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type OwnedWorkerPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: number;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type TerminalPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: number | null;
  workspaceBaseManifestRef: string | null;
  remoteWorkspaceDir: string | null;
  workerBundleHash: string | null;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  terminalReason: string | null;
  terminalAtMs: number | null;
};
type LocalPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "local";
};
type RequestedPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "requested";
};
type ProvisioningPlacementRecord = UnclaimedPlacementRecordBase & ProvisioningPlacementMetadata & {
  state: "provisioning";
};
type SyncingPlacementRecord = UnclaimedPlacementRecordBase & SyncingPlacementMetadata & {
  state: "syncing";
};
type StartingPlacementRecord = UnclaimedPlacementRecordBase & StartingPlacementMetadata & {
  state: "starting";
};
type ActivePlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "active";
};
type DrainingPlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "draining";
};
type ReconcilingPlacementRecord = UnclaimedPlacementRecordBase & OwnedWorkerPlacementMetadata & {
  state: "reconciling";
};
type ReclaimedPlacementRecord = UnclaimedPlacementRecordBase & Omit<OwnedWorkerPlacementMetadata, "terminalReason" | "terminalAtMs"> & TerminalPlacementMetadata & {
  state: "reclaimed";
};
type FailedPlacementRecord = LocalClaimablePlacementRecordBase & TerminalPlacementMetadata & {
  state: "failed";
  recoveryError: string;
};
type WorkerSessionPlacementRecord = LocalPlacementRecord | RequestedPlacementRecord | ProvisioningPlacementRecord | SyncingPlacementRecord | StartingPlacementRecord | ActivePlacementRecord | DrainingPlacementRecord | ReconcilingPlacementRecord | ReclaimedPlacementRecord | FailedPlacementRecord;
type WorkerSessionPlacementTransitionPatch = {
  environmentId?: string | null;
  activeOwnerEpoch?: number | null;
  workspaceBaseManifestRef?: string | null;
  remoteWorkspaceDir?: string | null;
  workerBundleHash?: string | null;
  lastTranscriptAckCursor?: number | null;
  lastLiveEventAckCursor?: number | null;
  recoveryError?: string | null;
  terminalReason?: string | null;
};
//#endregion
//#region src/gateway/agent-runtime-identity-token.d.ts
type AgentRuntimeCronSelfManagementContext = {
  jobId: string;
  expiresAtMs: number;
};
type AgentRuntimeIdentity = {
  kind: "agentRuntime";
  agentId: string;
  sessionKey: string;
  operationalRunInstance: OperationalRunInstanceRef;
  delegatedAuthority: AgentRuntimeDelegatedAuthority;
  approvalOwnerPluginId?: string;
  executionIdentity?: ExecutionIdentityAdmissionToken;
  turnSourceChannel?: string;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  messageActionContext?: AgentRuntimeMessageActionContext;
  cronSelfManagementContext?: AgentRuntimeCronSelfManagementContext;
  cronToolsAllowCapture?: "final-executable-surface";
  cronCreatorAuthorityGrant?: CronCreatorAuthorityGrant;
  sessionSpawnContext?: AgentRuntimeSessionSpawnContext;
};
type AgentRuntimeDelegatedAuthority = AgentRunDelegatedAuthority & ({
  kind: "local";
} | {
  kind: "worker";
  turnClaim: WorkerSessionTurnClaim;
});
type AgentRuntimeSessionSpawnContext = {
  completionOwnerSessionKey?: string;
  inheritedToolPolicy: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
type AgentRuntimeApprovalAuthorityValidator = (identity: AgentRuntimeIdentity) => boolean;
//#endregion
//#region src/infra/agent-events.d.ts
/** Stream name for agent events delivered to gateway listeners and plugin host hooks. */
type AgentEventStream = "lifecycle" | "tool" | "assistant" | "usage" | "error" | "item" | "plan" | "approval" | "command_output" | "patch" | "compaction" | "thinking" | (string & {});
/** Enriched event delivered to subscribers after sequencing and context stamping. */
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<string, unknown>; /** Internal, non-enumerable gateway lifecycle generation that owns this run. */
  lifecycleGeneration?: string;
  sessionKey?: string;
  /**
   * sessionId the run was bound to when it started. Lifecycle persistence uses
   * this to reject terminal events from a pre-`sessions.reset` run that would
   * otherwise clobber the rotated session row resolved by the shared sessionKey.
   */
  sessionId?: string;
  agentId?: string;
};
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
declare function onAgentEvent(listener: (evt: AgentEventPayload) => void): () => void;
//#endregion
//#region src/gateway/server-chat-progress-snapshot.d.ts
type ChatRunProgressSnapshot = {
  events: AgentEventPayload[];
  byteLength: number;
  lastSeq: number;
};
//#endregion
//#region src/gateway/server-chat-state.d.ts
type ChatRunTiming = {
  ackedAtMs: number;
  connId: string;
  dispatchStartedAtMs?: number;
  firstAssistantEventSent?: boolean;
  receivedAtMs: number;
};
type ChatRunRegistration = {
  sessionKey: string;
  agentId?: string;
  clientRunId: string;
  chatSendTiming?: ChatRunTiming;
};
type ChatRunEntry = ChatRunRegistration & {
  registeredAtMs: number;
  registeredSequence: number;
};
type ChatAbortMarker = number | {
  abortedAtMs: number;
  sequence: number;
};
type BufferedAgentEvent = {
  sessionKey?: string;
  agentId?: string;
  payload: AgentEventPayload & {
    spawnedBy?: string;
  };
};
type ChatRunPlanSnapshot = {
  steps: AgentPlanStep[];
  explanation?: string;
};
type ChatRunAgentTextState = {
  lastSentAt?: number;
  bufferedEvent?: BufferedAgentEvent;
};
type ChatRunToolRecipientState = {
  connIds: Set<string>;
  updatedAt: number;
  finalizedAt?: number;
};
type ChatRunRecord = {
  registrations?: ChatRunEntry[];
  rawBuffer?: string;
  buffer?: string; /** Projection stays valid only while source matches rawBuffer; readers refresh it lazily. */
  bufferProjection?: {
    source: string;
    suppress: boolean;
  };
  planSnapshot?: ChatRunPlanSnapshot;
  progressSnapshot?: ChatRunProgressSnapshot; /** Last time any buffered assistant text changed, including suppressed raw buffers. */
  bufferUpdatedAt?: number;
  deltaSentAt?: number; /** Length of text at the time of the last broadcast, used to avoid duplicate flushes. */
  deltaLastBroadcastLen?: number;
  deltaLastBroadcastText?: string;
  agentText?: {
    assistant?: ChatRunAgentTextState;
    thinking?: ChatRunAgentTextState;
  };
  abortMarker?: ChatAbortMarker;
  toolRecipient?: ChatRunToolRecipientState;
};
type ChatRunRegistry = {
  add: (sessionId: string, entry: ChatRunRegistration) => void;
  peek: (sessionId: string) => ChatRunEntry | undefined;
  shift: (sessionId: string) => ChatRunEntry | undefined;
  remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  clear: () => void;
};
type ChatRunState = {
  runs: Map<string, ChatRunRecord>;
  registry: ChatRunRegistry;
  toolEventRecipients: ToolEventRecipientRegistry;
  getOrCreate: (runId: string) => ChatRunRecord;
  resolveBuffer: (runId: string) => {
    text: string;
    suppress: boolean;
  };
  hasAbortMarker: (runId: string) => boolean;
  deleteAbortMarker: (runId: string) => void;
  recordProgressEvent: (runId: string, event: AgentEventPayload) => void;
  clearRun: (runId: string) => void;
  clear: () => void;
};
type ToolEventRecipientRegistry = {
  add: (runId: string, connId: string) => void;
  get: (runId: string) => ReadonlySet<string> | undefined;
  markFinal: (runId: string) => void;
};
//#endregion
//#region src/gateway/chat-abort.d.ts
type ChatAbortControllerEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string;
  lifecycleGeneration?: string; /** Exact operational instance created by this controller registration. */
  operationalRunInstance?: OperationalRunInstanceRef; /** Exact approval lease captured when this controller's execution was admitted. */
  agentRunDelegatedAuthority?: AgentRunDelegatedAuthority;
  agentId?: string;
  startedAtMs: number;
  expiresAtMs: number;
  ownerConnId?: string;
  ownerDeviceId?: string;
  providerId?: string;
  authProviderId?: string;
  abortStopReason?: string; /** Latest argument-free validation diagnostic for operator-initiated aborts. */
  toolErrorSummary?: string;
  /**
   * False for backend/internal agent runs that may share a session key but must
   * not be projected into operator chat surfaces.
   */
  controlUiVisible?: boolean;
  /**
   * Controls only the sessions.list active-run projection. Terminal lifecycle
   * clears this before chat.send settles, while the entry stays as the retry
   * idempotency guard until normal cleanup removes it.
   */
  projectSessionActive?: boolean; /** True after the terminal session-store update has completed. */
  projectSessionTerminalPersisted?: boolean; /** A terminal lifecycle event was observed and is awaiting persistence. */
  projectSessionTerminalPending?: boolean; /** Store timestamp expected from the observed terminal lifecycle event. */
  projectSessionTerminalObservedAt?: number; /** In-flight terminal session-store update used by restart shutdown. */
  projectSessionTerminalPersistence?: Promise<void>; /** Caller completion requested cleanup before terminal lifecycle persistence settled. */
  registrationCleanupRequested?: boolean; /** False after the owning reply run commits a terminal outcome. */
  isAbortable?: (entry: ChatAbortControllerEntry) => boolean; /** Runs once when this registration is actually removed. */
  onRemoved?: () => void;
  /**
   * Which RPC owns this registration. Absent (undefined) is treated as
   * `"chat-send"` so pre-existing callers that constructed entries without
   * a kind keep their behavior. Consumers that need "chat.send specifically
   * is active" must check `kind !== "agent"`, not just `.has(runId)`.
   */
  kind?: "chat-send" | "agent"; /** Side questions stay independent from main-turn TUI session stops. */
  turnKind?: "main" | "btw";
};
//#endregion
//#region src/gateway/config-reload-status.types.d.ts
type GatewayHotReloadStatus = "active" | "disabled";
//#endregion
//#region src/gateway/device-scope-upgrade.d.ts
type UpgradeOwner = {
  deviceId: string;
  publicKey: string;
};
/** Coordinates live device scope-upgrade waiters with the durable pairing store. */
declare class ScopeUpgradeCoordinator {
  private readonly entries;
  register(params: {
    requestId: string;
    expiresAtMs: number;
    owner: UpgradeOwner;
    requestedScopes: string[];
    initialToken?: string;
    initialApprovedAtMs?: number;
  }): boolean;
  notify(requestId: string, resolution: "approved" | "rejected"): void;
  wait(requestId: string, owner: UpgradeOwner): Promise<ScopeUpgradeResult | null>;
  private waitForResult;
  private readDurableResult;
  private retainTerminal;
}
//#endregion
//#region src/gateway/operator-approval-store.d.ts
type OperatorApprovalKind = "exec" | "plugin" | "system-agent";
type OperatorApprovalStatus = "pending" | "allowed" | "denied" | "expired" | "cancelled";
type OperatorApprovalDecision = "allow-once" | "allow-always" | "deny";
type OperatorApprovalTerminalReason = "user" | "timeout" | "malformed-verdict" | "no-route" | "run-aborted" | "gateway-restart" | "storage-corrupt";
type OperatorApprovalResolverKind = "device" | "channel" | "runtime" | "system";
type OperatorApprovalRequester = {
  deviceId: string | null;
  clientId: string | null;
  deviceTokenAuth: boolean;
};
type OperatorApprovalSource = {
  agentId: string | null;
  sessionKey: string | null;
  sessionId: string | null;
  runId: string | null;
  toolCallId: string | null;
  toolName: string | null;
};
type OperatorApprovalResolver = {
  kind: OperatorApprovalResolverKind;
  id: string | null;
};
type OperatorApprovalRecord = {
  id: string;
  resolutionRef: string;
  kind: OperatorApprovalKind;
  status: OperatorApprovalStatus;
  presentation: ApprovalPresentation;
  requester: OperatorApprovalRequester;
  reviewerDeviceIds: string[];
  source: OperatorApprovalSource;
  audienceSessionKeys: string[];
  runtimeEpoch: string;
  createdAtMs: number;
  expiresAtMs: number;
  updatedAtMs: number;
  decision: OperatorApprovalDecision | null;
  terminalReason: OperatorApprovalTerminalReason | null;
  resolvedAtMs: number | null;
  resolver: OperatorApprovalResolver | null;
  consumedAtMs: number | null;
  consumedBy: string | null;
};
type ResolveOperatorApprovalResult = {
  outcome: "resolved";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-resolved";
  retry: "same" | "conflict";
  record: OperatorApprovalRecord;
} | {
  outcome: "decision-not-allowed";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
type ForceDenyOperatorApprovalResult = {
  outcome: "denied";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-due";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-terminal";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
//#endregion
//#region src/gateway/exec-approval-manager.d.ts
type ExecApprovalRequestPayload = ExecApprovalRequestPayload$1;
type ExecApprovalResolutionSource = "operator" | "auto-review";
type ExecApprovalRecord<TPayload = ExecApprovalRequestPayload> = {
  id: string;
  request: TPayload;
  createdAtMs: number;
  expiresAtMs: number;
  requestedByConnId?: string | null;
  requestedByDeviceId?: string | null;
  requestedByClientId?: string | null;
  requestedByDeviceTokenAuth?: boolean;
  approvalReviewerDeviceIds?: string[];
  resolvedAtMs?: number;
  decision?: ExecApprovalDecision;
  consumedDecision?: ExecApprovalDecision;
  resolutionSource?: ExecApprovalResolutionSource;
  askFallbackConsumed?: boolean;
  resolvedBy?: string | null;
  status?: OperatorApprovalStatus;
  terminalReason?: OperatorApprovalTerminalReason | null;
  runtimeEpoch?: string;
  resolverKind?: OperatorApprovalResolver["kind"] | null;
  consumedAtMs?: number | null;
  consumedBy?: string | null;
  executionIdentityToken?: ExecutionIdentityAdmissionToken; /** Exact source authority retained only for use-time liveness validation. */
  agentRuntimeDelegatedAuthority?: AgentRuntimeDelegatedAuthority;
};
type OperatorApprovalPersistenceRuntime = {
  runtimeEpoch: string;
  databaseOptions?: OpenClawStateDatabaseOptions;
};
type ExecApprovalManagerOptions<TPayload> = {
  approvalKind?: OperatorApprovalKind;
  persistence?: OperatorApprovalPersistenceRuntime;
  resolveAllowedDecisions?: (request: TPayload) => readonly ExecApprovalDecision[];
  /** Session-lineage audience policy is gateway-owned and injected as a
   * non-throwing resolver; importing it here would close an agents->gateway
   * barrel cycle. Absent resolver (tests) seeds only the raising session. */
  resolveAudienceSessionKeys?: (sourceSessionKey: string, sourceAgentId?: string | null) => string[];
  onError?: (error: Error, context: {
    approvalId: string;
    approvalKind: OperatorApprovalKind;
    operation: "expire";
  }) => void;
  onLifecycle?: (event: OperatorApprovalLifecycleEvent) => void;
  validateAgentRuntimeDelegatedAuthority?: (authority: AgentRuntimeDelegatedAuthority) => boolean;
};
type OperatorApprovalLifecycleEvent = {
  phase: "pending" | "terminal";
  record: OperatorApprovalRecord;
};
type WithLiveRecord<TResult, TPayload> = TResult extends {
  record: OperatorApprovalRecord;
} ? TResult & {
  liveRecord?: ExecApprovalRecord<TPayload>;
} : TResult;
type ExecApprovalResolveResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ResolveOperatorApprovalResult, TPayload>;
type ExecApprovalForceDenyResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ForceDenyOperatorApprovalResult, TPayload>;
type ExecApprovalDurableLookup = {
  outcome: "found";
  record: OperatorApprovalRecord;
} | {
  outcome: "missing" | "corrupt";
  id: string;
};
type ExecApprovalIdLookupResult = {
  kind: "exact" | "prefix";
  id: string;
} | {
  kind: "ambiguous";
  ids: string[];
} | {
  kind: "none";
};
declare class ExecApprovalManager<TPayload = ExecApprovalRequestPayload> {
  private readonly options;
  private pending;
  constructor(options?: ExecApprovalManagerOptions<TPayload>);
  get approvalKind(): OperatorApprovalKind;
  get runtimeEpoch(): string | null;
  create(request: TPayload, timeoutMs: number, id?: string | null): ExecApprovalRecord<TPayload>;
  /**
   * Register an approval record and return a promise that resolves when the decision is made.
   * This separates registration (synchronous) from waiting (async), allowing callers to
   * confirm registration before the decision is made.
   */
  register(record: ExecApprovalRecord<TPayload>, _timeoutMs: number): Promise<ExecApprovalDecision | null>;
  private emitLifecycle;
  private projectLocalRecord;
  /** Persist the first verdict, then release the process-local waiter. */
  resolveDetailed(recordId: string, decision: ExecApprovalDecision, resolver: OperatorApprovalResolver, localResolvedBy?: string | null, localResolutionSource?: ExecApprovalResolutionSource): ExecApprovalResolveResult<TPayload>;
  /** Persist a fail-closed terminal state, then release the local waiter. */
  forceDenyDetailed(recordId: string, reason: OperatorApprovalTerminalReason, resolver: OperatorApprovalResolver, status?: "denied" | "expired" | "cancelled", localDecision?: ExecApprovalDecision | null, requireDue?: boolean, localResolvedBy?: string | null): ExecApprovalForceDenyResult<TPayload>;
  private settleLocalFromStore;
  /** Settle one durable terminal transition and report whether this manager published it. */
  reconcileDurableTerminal(record: OperatorApprovalRecord): boolean;
  /** Reconciles durable truth with an existing waiter without rehydrating its request. */
  reconcileDurableLookup(lookup: ExecApprovalDurableLookup, localResolvedBy?: string | null): OperatorApprovalRecord | null;
  private settleLocalStorageFailure;
  private persistStorageCorruptDeny;
  private settleLocalEntry;
  private scheduleResolvedCleanup;
  private resolvedGraceAnchorMs;
  /** Retains an existing local binding across async delivery; final release starts a fresh grace. */
  retainForHandoff(recordId: string): (() => void) | null;
  private reportError;
  private scheduleExpiryTimer;
  private expireDue;
  private resolveLocal;
  private expireLocal;
  resolve(recordId: string, decision: ExecApprovalDecision, resolvedBy?: string | null): boolean;
  /**
   * Trusted auto-review resolution (identity-matched approval runtime).
   * Always allow-once; system.run replay validation treats the resulting
   * record more strictly than an operator decision (see #103515).
   */
  resolveAutoReview(recordId: string, resolvedBy?: string | null): boolean;
  /**
   * One-shot ask-fallback re-admission for a timed-out approval. This is
   * pre-gate policy on the process-local record only: the durable row stays
   * `expired` and no execution authority is minted here. The strict exec
   * timeout cutover is deferred (docs/refactor/operator-approvals.md); until
   * then system.run replay uses this flag to keep re-admission single-use.
   */
  consumeAskFallback(recordId: string): boolean;
  expire(recordId: string, resolvedBy?: string | null): boolean;
  getSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  /** Returns an exact live request snapshot without reading durable state or mutating expiry. */
  getLiveSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  listPendingRecords(): ExecApprovalRecord<TPayload>[];
  consumeAllowOnce(recordId: string, consumerId?: string): boolean;
  /**
   * Wait for decision on an already-registered approval.
   * Returns the decision promise if the ID is pending, null otherwise.
   */
  awaitDecision(recordId: string): Promise<ExecApprovalDecision | null> | null;
  /** Projects an allowed decision only while its exact runtime authority is live. */
  projectDecisionIfActive(recordId: string, decision: ExecApprovalDecision | null): ExecApprovalDecision | null;
  /** Atomically closes a live approval whose exact delegated owner is gone. */
  forceDenyIfDelegatedAuthorityClosed(recordId: string): ExecApprovalForceDenyResult<TPayload> | null;
  lookupApprovalId(input: string, opts?: {
    includeResolved?: boolean;
    filter?: (record: ExecApprovalRecord<TPayload>) => boolean;
  }): ExecApprovalIdLookupResult;
  lookupPendingId(input: string): ExecApprovalIdLookupResult;
}
//#endregion
//#region src/plugins/runtime-degraded-state.d.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
type PluginVerificationFailureReason = "missing-install-path" | "missing-package-dir" | "missing-package-json" | "unreadable-package-json" | "invalid-package-json" | "missing-bundle-manifest" | "invalid-bundle-manifest" | "missing-main-entry" | "missing-extension-entry" | "missing-openclaw-peer-link";
//#endregion
//#region src/gateway/health/types.d.ts
type ProtocolHealth = Snapshot["health"];
type ProtocolPlugin = NonNullable<ProtocolHealth["plugins"]>;
type UnavailablePlugin = NonNullable<ProtocolPlugin["unavailable"]>[number];
/** Health snapshot for one configured channel account. */
type ChannelAccountHealthSummary = ChannelAccountSnapshot & {
  authAgeMs?: number | null;
  [key: string]: unknown;
};
/** Channel-level health summary with optional per-account details. */
type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};
type AgentHealthSummary = NonNullable<ProtocolHealth["agents"]>[number];
/** Plugin registry health summary. */
type PluginHealthSummary = Omit<ProtocolPlugin, "unavailable"> & {
  unavailable?: Array<Omit<UnavailablePlugin, "diagnostic"> & {
    diagnostic: Omit<UnavailablePlugin["diagnostic"], "reason"> & {
      reason: PluginVerificationFailureReason;
    };
  }>;
};
/** Full gateway health payload consumed by `openclaw health`. */
type HealthSummary = ProtocolHealth & {
  ok: true;
  ts: number;
  durationMs: number;
  plugins?: PluginHealthSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  agents: AgentHealthSummary[];
  sessions: NonNullable<ProtocolHealth["sessions"]>;
};
//#endregion
//#region src/infra/device-pairing-node-state.d.ts
/** Registry projection of a paired device's authenticated node-role state. */
type PairedDeviceNodeBinding = {
  identity: string;
  generation?: string;
};
//#endregion
//#region src/plugins/types.node-host.d.ts
type OpenClawPluginNodeHostCommandAvailabilityContext = {
  /** Node-local configuration used to build this host's Gateway declaration. */config: OpenClawConfig; /** Node-host process environment. */
  env: NodeJS.ProcessEnv;
};
type OpenClawPluginNodeHostCommandIo = {
  emitChunk(chunk: string): Promise<void>;
  onInput(callback: (payloadJSON: string) => void): void;
  signal: AbortSignal;
};
type OpenClawPluginNodeHostCommandContext = {
  /** Emit one node-owned event through the active Gateway connection. */sendNodeEvent(event: string, payload: unknown): Promise<unknown>; /** Agent session that owns this invocation, when the caller supplied one. */
  sessionKey?: string; /** Aborts when the Gateway cancels this specific node-host invocation. */
  signal?: AbortSignal;
};
type OpenClawPluginNodeHostCommandBase = {
  command: string;
  cap?: string;
  dangerous?: boolean; /** Return false to omit this command and capability from the node declaration. */
  isAvailable?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => boolean; /** Watch node-local availability and request a fresh Gateway declaration. */
  watchAvailability?: (context: OpenClawPluginNodeHostCommandAvailabilityContext, onChange: () => void) => (() => void) | void; /** Optional Computer Use declaration published with this command's node manifest. */
  computerUse?: (context: OpenClawPluginNodeHostCommandAvailabilityContext) => unknown;
  agentTool?: {
    name: string;
    description: string;
    parameters?: Record<string, unknown>; /** Platforms where this tool is allowlisted by default; omit for explicit config only. */
    defaultPlatforms?: Array<"ios" | "android" | "macos" | "windows" | "linux" | "unknown">;
    mcp?: {
      server: string;
      tool: string;
    };
  };
};
type OpenClawPluginNodeHostCommand = OpenClawPluginNodeHostCommandBase & {
  duplex?: boolean;
  handle: (paramsJSON?: string | null, io?: OpenClawPluginNodeHostCommandIo, context?: OpenClawPluginNodeHostCommandContext) => Promise<string>;
};
//#endregion
//#region src/plugins/computer-use-contract.d.ts
declare const ComputerUseCapabilityDescriptorSchema: Type.TObject<{
  contractVersion: Type.TLiteral<2>;
  provider: Type.TObject<{
    id: Type.TString;
    label: Type.TString;
    generation: Type.TString;
  }>;
  actions: Type.TArray<Type.TEnum<["screenshot", "left_click", "right_click", "middle_click", "double_click", "triple_click", "mouse_move", "left_click_drag", "left_mouse_down", "left_mouse_up", "scroll", "type", "key", "hold_key", "wait", "list_apps", "list_windows", "get_accessibility_tree", "get_cursor_position", "get_window_state", "launch_app", "kill_app", "bring_to_front", "set_value", "zoom", "get_browser_state", "browser_prepare", "browser_navigate", "browser_click", "browser_type", "browser_dialog", "browser_set_input_files", "browser_download", "browser_pointer", "escalate_scope", "get_recording_state", "start_recording", "stop_recording", "replay_trajectory", "invoke_menu"]>>;
  targets: Type.TArray<Type.TEnum<["screen", "window", "element", "browser"]>>;
  deliveryModes: Type.TArray<Type.TEnum<["background", "foreground"]>>;
  observations: Type.TArray<Type.TEnum<["image", "accessibility", "browser"]>>;
  features: Type.TObject<{
    recording: Type.TBoolean;
    agentCursor: Type.TBoolean;
    multiDisplay: Type.TBoolean;
  }>;
}>;
type ComputerUseCapabilityDescriptor = Static<typeof ComputerUseCapabilityDescriptorSchema>;
//#endregion
//#region src/gateway/node-plugin-tool-snapshot.d.ts
type RegisteredNodePluginToolCommand = {
  pluginId: string;
  command: {
    command?: string;
    agentTool?: {
      name?: string;
      description?: string;
      parameters?: unknown;
      mcp?: {
        server?: string;
        tool?: string;
      };
    };
  };
};
//#endregion
//#region src/gateway/node-registry.invoke-stream.d.ts
type NodeInvokeProgressParams = {
  invokeId: string;
  nodeId: string;
  connId: string | undefined;
  seq: number;
  chunk: string;
};
type NodeInvokeResultParams = {
  id: string;
  nodeId: string;
  connId: string | undefined;
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
//#endregion
//#region src/gateway/plugin-node-capability.d.ts
/** Declared plugin surface that may receive scoped node capabilities. */
type PluginNodeCapabilitySurface = {
  surface: string;
  ttlMs?: number;
  scopeKey?: string;
};
/** Client state used to authorize plugin-node surface capabilities. */
type PluginNodeCapabilityClient = {
  /** Retired clients cannot back HTTP capability auth or its renewal while close is pending. */invalidated?: boolean;
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
};
//#endregion
//#region src/gateway/worker-environments/connection-identity.d.ts
/** Hash-only worker identity retained after admission. */
type WorkerConnectionIdentity = {
  environmentId: string;
  credentialHash: string;
  bundleHash: string;
  sessionId: string | null;
  runId: string | null;
  ownerEpoch: number;
  rpcSetVersion: number;
  protocolFeatures: string[];
  credentialExpiresAtMs: number;
};
//#endregion
//#region src/gateway/server/ws-types.d.ts
type GatewayWsConnectionKind = "gateway" | "worker";
/**
 * Runtime WebSocket client state tracked by the gateway server.
 */
type GatewayWsClient = PluginNodeCapabilityClient & {
  socket: WebSocket;
  connect: ConnectParams;
  connId: string;
  connectionKind?: GatewayWsConnectionKind;
  worker?: WorkerConnectionIdentity;
  isDeviceTokenAuth?: boolean; /** Temporary legacy migration session closed when normal enforcement resumes. */
  isControlUiDeviceAuthMigrationSession?: boolean; /** Signed shared-auth session admitted only to approve its own upgrade pairing. */
  isControlUiDeviceAuthMigration?: boolean; /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  usesSharedGatewayAuth: boolean;
  sharedGatewaySessionGeneration?: string;
  presenceKey?: string;
  authenticatedUserId?: string; /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  clientIp?: string;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */isLocalClient?: true;
    approvalRuntime?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
  };
  canvasHostUrl?: string;
  canvasCapability?: string;
  canvasCapabilityExpiresAtMs?: number;
  invalidatedReason?: string;
};
//#endregion
//#region src/gateway/node-registry.d.ts
/** Connected node session advertised over Gateway websocket. */
type NodeSession = {
  nodeId: string;
  connId: string; /** Persistent device key and node-token identity authenticated for this connection. */
  pairingIdentity?: string; /** Persistent pairing generation authenticated before this session was registered. */
  pairingGeneration?: string;
  client: GatewayWsClient;
  clientId?: string;
  clientMode?: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  remoteIp?: string;
  declaredCaps: string[];
  sessionCapsCeiling?: string[];
  caps: string[];
  declaredCommands: string[];
  sessionCommandsCeiling?: string[];
  commands: string[];
  computerUse?: ComputerUseCapabilityDescriptor; /** Exact node-local build admitted for worker session hosting. */
  workerRuns?: WorkerAdmissionHandshake;
  declaredNodePluginTools: NodePluginToolDescriptor[];
  nodePluginTools: NodePluginToolDescriptor[];
  nodeSkills: NodeSkillDescriptor[];
  declaredPermissions?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  connectedAtMs: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
};
type PairingBoundNodeSession = NodeSession & {
  pairingIdentity: string;
};
/** Result payload returned from node.invoke. */
type NodeInvokeResult = {
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
/** Connectivity probe result for a registered node. */
type NodeConnectivityResult = {
  ok: true;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
declare const SERIALIZED_EVENT_PAYLOAD: unique symbol;
type SerializedEventPayload = {
  readonly json: string;
  readonly [SERIALIZED_EVENT_PAYLOAD]: true;
};
/** Event transport for nodes that cannot keep a WebSocket open, such as watchOS. */
type NodeEventTransport = {
  send: (event: string, payload: unknown) => boolean;
  sendRaw: (event: string, payloadJSON?: SerializedEventPayload | null) => boolean;
  checkConnectivity?: (timeoutMs: number) => Promise<NodeConnectivityResult>;
};
type PairedDeviceNodeBindingSnapshot = PairedDeviceNodeBinding;
type NodeSessionRegistrationOptions = {
  remoteIp?: string | undefined;
  pairingIdentity: string;
  pairingGeneration?: string | undefined;
};
type NodeRegistryOptions = {
  listRegisteredNodePluginToolCommands?: (() => readonly RegisteredNodePluginToolCommand[] | undefined) | undefined;
  nodePluginToolsEnabled?: boolean;
  nodeSkillsEnabled?: boolean;
  resolveCurrentPairingState?: (nodeId: string) => Promise<PairedDeviceNodeBindingSnapshot | undefined>;
  isPairingStateCurrent?: (nodeId: string, expected: PairedDeviceNodeBinding) => boolean;
  onPairingGenerationChanged?: (params: {
    nodeId: string;
    previousPairingGeneration: string;
    nextPairingGeneration: string;
    preserveSessionState: boolean;
  }) => void;
  onPairingInvalidated?: (params: {
    nodeId: string;
    connId: string;
  }) => void;
};
/** Registry of currently connected Gateway nodes. */
declare class NodeRegistry {
  private readonly options;
  private nodesById;
  private nodesByConn;
  private eventTransportsByConn;
  private pendingInvokes;
  private invokeStreams;
  private authorizedSystemRunEvents;
  private pairingGenerationEventChains;
  constructor(options?: NodeRegistryOptions);
  private listConnectedSessions;
  private capturePairingLease;
  private currentSessionForLease;
  private settlePairingLease;
  private resolvePairingLease;
  private normalizePluginToolDescriptors;
  private replaceEffectiveNodePluginTools;
  refreshNodePluginTools(): void;
  /** Register a websocket client as the current connection for its node id. */
  register(client: GatewayWsClient, opts: NodeSessionRegistrationOptions): PairingBoundNodeSession;
  /** Register a node whose events are delivered by an HTTP polling transport. */
  registerTransport(client: GatewayWsClient, opts: NodeSessionRegistrationOptions, transport: NodeEventTransport): PairingBoundNodeSession;
  private registerSession;
  /** Unregister one connection and reject invokes tied to that connection. */
  unregister(connId: string): string | null;
  /** List connected node sessions. */
  listConnected(): NodeSession[];
  /** Filter connected sessions against an already-loaded pairing-state snapshot. */
  listConnectedForPairingStates(currentPairingStates: ReadonlyMap<string, PairedDeviceNodeBindingSnapshot>): NodeSession[];
  /** Reconcile connected sessions through the synchronous persistent-pairing owner. */
  listCurrentConnectedSync(): NodeSession[];
  /** Resolve persistent pairing state before projecting connected sessions. */
  listCurrentConnected(): Promise<NodeSession[]>;
  private invalidateSessionForPairingChange;
  /** Immediately retires one exact transport after its persisted pairing authority changes. */
  invalidateConnectionForPairingChange(connId: string, reason?: string): boolean;
  /** Return a connected node session by node id. */
  get(nodeId: string): NodeSession | undefined;
  private getRegisteredSession;
  /** Return only the session authenticated for the requested persistent pairing generation. */
  getForPairingGeneration(nodeId: string, pairingGeneration: string): NodeSession | undefined;
  private getRegisteredSessionForPairingGeneration;
  /** Revalidates that one inbound node connection still owns its persisted pairing state. */
  isConnectionCurrentPairingState(connId: string): Promise<boolean>;
  /** Updates recent input activity for the exact authenticated node connection. */
  updatePresenceActivity(params: {
    nodeId: string;
    connId?: string;
    idleSeconds: number;
    saturated?: boolean;
    observedAtMs?: number;
  }): NodeSession | null;
  /** Clears recent input activity for the exact authenticated node connection. */
  clearPresenceActivity(params: {
    nodeId: string;
    connId?: string;
  }): boolean | null;
  /** Returns the connected node with the freshest reported local input. */
  getActiveNode(connectedNodes?: readonly NodeSession[]): NodeSession | undefined;
  private publishActiveNodeContext;
  /** Probe websocket liveness with ping/pong when the socket supports it. */
  checkConnectivity(nodeId: string, timeoutMs?: number): Promise<NodeConnectivityResult>;
  updateNodePluginTools(nodeId: string, connId: string | undefined, tools: readonly NodePluginToolDescriptor[]): NodeSession | null;
  updateNodeSkills(nodeId: string, connId: string | undefined, skills: readonly NodeSkillDescriptor[]): NodeSession | null;
  updateSurface(nodeId: string, surface: {
    caps?: readonly string[];
    commands: readonly string[];
    permissions?: Record<string, boolean> | undefined;
  }, generationTransition?: {
    expectedConnId: string;
    expectedPairingIdentity: string;
    expectedPairingGeneration?: string;
    nextPairingGeneration: string;
  }): NodeSession | null;
  private clearPresenceIfAccessibilityUnavailable;
  invoke(params: {
    nodeId: string;
    expectedConnId?: string;
    expectedPairingGeneration?: string;
    command: string;
    params?: unknown;
    timeoutMs?: number; /** Inactivity deadline reset by each ordered progress chunk. */
    idleTimeoutMs?: number;
    onProgress?: (chunk: string) => void;
    signal?: AbortSignal;
    idempotencyKey?: string;
    sessionKey?: string; /** Receives the id after pairing validation and a successful dispatch. */
    onDispatchReady?: (invokeId: string) => void; /** Revalidates caller authority at the registry-owned transport handoff. */
    isDispatchAuthorized?: () => boolean;
  }): Promise<NodeInvokeResult>;
  /** Send one ordered input frame to a pending streaming invoke. */
  sendInvokeInput(invokeId: string, payload: unknown): void;
  handleInvokeProgress(params: NodeInvokeProgressParams): boolean;
  /** Authorize an inbound system.run event against a recently issued node invoke. */
  authorizeSystemRunEvent(params: {
    nodeId: string;
    connId?: string;
    runId?: string;
    sessionKey: string;
    terminal: boolean;
  }): boolean;
  private rememberAuthorizedSystemRunEvent;
  private forgetAuthorizedSystemRunEvent;
  private authorizedSystemRunEventExpiresAt;
  private matchAuthorizedSystemRunEvent;
  private matchSingleAuthorizedSystemRunEvent;
  private authorizedSystemRunSessionMatches;
  private allowsLegacyMacRunIdFallback;
  private pruneAuthorizedSystemRunEvents;
  private authorizedSystemRunEventKey;
  handleInvokeResult(params: NodeInvokeResultParams): boolean;
  sendEvent(nodeId: string, event: string, payload?: unknown): boolean;
  sendEventRaw(nodeId: string, event: string, payloadJSON?: SerializedEventPayload | null): boolean;
  /** Sends command-free events only to the exact authenticated pairing connection. */
  sendEventForPairingIdentity(params: {
    nodeId: string;
    connId: string;
    pairingIdentity: string;
    event: string;
    payload?: unknown;
  }): Promise<boolean>;
  /** Sends only to a session that still owns the requested persistent pairing generation. */
  sendEventRawForPairingGeneration(nodeId: string, pairingGeneration: string, event: string, payloadJSON?: SerializedEventPayload | null): Promise<boolean>;
  private sendEventRawForPairingGenerationNow;
  private sendEventInternal;
  private sendEventRawInternal;
  private sendEventToSession;
  private isNodeWebSocketOpen;
  private rejectSlowNodeSocket;
}
//#endregion
//#region src/gateway/portals/portal-service.d.ts
type GatewayPortalOpenParams = {
  targetPort: number;
  title?: string;
  description?: string;
  path?: string;
};
type GatewayPortalService = {
  open: (params: GatewayPortalOpenParams) => Promise<PortalOpenResult>;
  list: () => PortalSummary[];
  close: (id: string) => Promise<void>;
  closeAll: () => Promise<void>;
};
//#endregion
//#region src/gateway/server-channel-runtime.types.d.ts
/** Snapshot of channel runtime state keyed by channel and account id. */
type ChannelRuntimeSnapshot = {
  channels: Partial<Record<ChannelId, ChannelAccountSnapshot>>;
  channelAccounts: Partial<Record<ChannelId, Record<string, ChannelAccountSnapshot>>>;
};
type StartChannelOptions = {
  preserveRestartAttempts?: boolean;
  preserveManualStop?: boolean;
  deferAccountStartUntil?: Promise<void>;
  manual?: boolean;
};
//#endregion
//#region src/cron/scratch-store.d.ts
type CronJobScratch = {
  content: string;
  revision: number;
  sourceSha256?: string;
  updatedAtMs: number;
};
/**
 * Present scratch content plus the persisted revision. An unset scratch keeps a
 * tombstone row so `currentRevision` stays monotonic across unset/recreate and
 * stale compare-and-swap writers cannot resurrect old content.
 */
type CronJobScratchState = {
  currentRevision: number;
  scratch?: CronJobScratch;
};
type CronJobScratchWriteResult = {
  ok: true;
  currentRevision: number;
  scratch?: CronJobScratch;
} | {
  ok: false;
  reason: "revision-conflict";
  currentRevision: number;
};
//#endregion
//#region src/gateway/server-cron-contract.d.ts
type GatewayCronServiceContract = CronServiceContract & {
  /** Remove an owned declarative job family from obsolete SQLite store partitions. */removeStaleJobFamily(family: {
    declarationKey: string;
    name: string;
    ownerPluginTag: string;
  }): Promise<number>;
  readScratch(id: string): Promise<CronJobScratchState>;
  writeScratch(id: string, params: {
    content: string | null;
    expectedRevision?: number;
    sourceSha256?: string;
    commitGuard?: () => void;
  }): Promise<CronJobScratchWriteResult>; /** Serialize agent-job removal with the roster commit and restore on failure. */
  removeAgentJobsTransactional<T>(agentId: string, commit: () => Promise<T>): Promise<T>; /** Temporarily disarm ticks without running startup recovery on resume. */
  pauseScheduling(): void;
  resumeScheduling(): void; /** Scheduler-owned work not represented by active cron run markers. */
  getSuspensionBlockerCount?(): number; /** Materialize lazy cron dependencies before a synchronous operator wake. */
  prepareWake?(): Promise<void>; /** Stop cron and await scheduler-owned child process teardown. */
  stopAndDrain?(): Promise<void>;
};
//#endregion
//#region src/infra/approval-gateway-runtime.types.d.ts
type GatewayApprovalEventKind = "exec" | "plugin";
//#endregion
//#region src/gateway/server-methods/agent-request-types.d.ts
type AgentRunRequest = {
  message: string;
  agentId?: string;
  provider?: string;
  model?: string;
  to?: string;
  replyTo?: string;
  sessionId?: string;
  sessionKey?: string;
  expectedExistingSessionId?: string;
  thinking?: string;
  deliver?: boolean;
  attachments?: Array<{
    type?: string;
    mimeType?: string;
    fileName?: string;
    content?: unknown;
  }>;
  channel?: string;
  replyChannel?: string;
  accountId?: string;
  replyAccountId?: string;
  threadId?: string;
  groupId?: string;
  groupChannel?: string;
  groupSpace?: string;
  lane?: string;
  cwd?: string;
  extraSystemPrompt?: string;
  modelRun?: boolean;
  promptMode?: "full" | "minimal" | "none";
  bootstrapContextMode?: "full" | "lightweight";
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
  acpTurnSource?: "manual_spawn";
  internalRuntimeHandoffId?: string;
  internalExecutionIdentityRetry?: boolean;
  internalExecutionIdentityRecoveryAttempt?: number;
  execApprovalFollowupExpectedSessionId?: string;
  internalEvents?: AgentInternalEvent[];
  suppressPromptPersistence?: boolean;
  sessionEffects?: "visible" | "internal";
  idempotencyKey: string;
  sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
  disableMessageTool?: boolean;
  swarmCollector?: boolean;
  swarmOutputSchema?: Record<string, unknown>;
  forceRestartSafeTools?: boolean;
  forceCodeModeTools?: boolean;
  timeout?: number;
  bestEffortDeliver?: boolean;
  cleanupBundleMcpOnRunEnd?: boolean;
  label?: string;
  inputProvenance?: InputProvenance;
  workspaceDir?: string;
  voiceWakeTrigger?: string;
};
//#endregion
//#region src/gateway/server-instance-runtime.types.d.ts
type GatewayApprovalEventPublisher = {
  publishRequested: (kind: GatewayApprovalEventKind, request: unknown) => number;
  publishResolved: (kind: GatewayApprovalEventKind, resolved: unknown) => void;
};
type GatewayRecoveryRuntime = {
  dispatchAgent: <T = unknown>(params: AgentRunRequest, timeoutMs?: number, options?: {
    allowModelOverride?: boolean;
    scopes?: string[];
  }) => Promise<T>;
  waitForAgent: <T = unknown>(params: AgentWaitParams, timeoutMs?: number) => Promise<T>;
  sendRecoveryNotice: (params: {
    channel: string;
    to: string;
    accountId?: string;
    threadId?: string | number;
    text: string;
    idempotencyKey: string;
  }) => Promise<{
    /** True when delivery produced zero platform results (policy/channel suppression). */suppressed: boolean;
  }>;
};
//#endregion
//#region src/gateway/server-model-catalog.types.d.ts
type GatewayModelCatalogSnapshot = ModelCatalogSnapshot & {
  agentId: string;
  agentDir: string;
  catalogComplete: boolean;
  workspaceDir: string;
  config: OpenClawConfig;
};
//#endregion
//#region src/gateway/server-shared.d.ts
type DedupeEntry = {
  ts: number;
  ok: boolean; /** Optional effectful-request fingerprint for methods with caller-supplied operation ids. */
  requestIdentity?: string;
  payload?: unknown;
  error?: ErrorShape;
};
//#endregion
//#region src/gateway/server/event-loop-health.d.ts
type GatewayEventLoopHealthReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type GatewayEventLoopHealth = {
  degraded: boolean;
  degradedSinceMs: number | null;
  reasons: GatewayEventLoopHealthReason[];
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
};
//#endregion
//#region src/gateway/terminal/launch.d.ts
/** Why a terminal cannot open, or `null` when it can. */
type TerminalLaunchBlock = {
  kind: "disabled";
} | {
  kind: "owner-required";
  message: string;
} | {
  kind: "unknown-agent";
  agentId: string;
} | {
  kind: "sandboxed";
  agentId: string;
  mode: "all";
};
/** Resolved plan for a host terminal session. */
type TerminalLaunchPlan = {
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  initialCommand?: string[];
  cwdOverride?: string;
};
/** Terminal launch resolution result: either a runnable plan or a block reason. */
type TerminalLaunchResolution = {
  ok: true;
  plan: TerminalLaunchPlan;
} | {
  ok: false;
  block: TerminalLaunchBlock;
};
//#endregion
//#region src/infra/terminal-file-upload.d.ts
type TerminalUploadFile = {
  name: string;
  contentBase64: string;
};
type TerminalUploadResult = {
  path: string;
  size: number;
};
//#endregion
//#region src/gateway/terminal/session-types.d.ts
type TerminalSessionSummary = {
  sessionId: string;
  agentId: string;
  shell: string;
  cwd: string;
  attached: boolean;
  owner: "conn" | `agent:${string}`;
  createdAtMs: number;
};
type TerminalAttachSummary = Omit<TerminalSessionSummary, "attached" | "owner" | "createdAtMs"> & {
  buffer: string;
  seq: number;
};
//#endregion
//#region src/process/terminal-pty.d.ts
/** Live PTY handle shared by gateway terminals and node-host commands. */
type TerminalPtyHandle = {
  pid: number;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  onData(listener: (chunk: string) => void): void;
  onExit(listener: (event: {
    exitCode: number;
    signal?: number;
  }) => void): void;
  kill(signal?: string): void;
};
declare function spawnTerminalPty(params: {
  file: string;
  args: string[];
  cwd?: string;
  env: Record<string, string>;
  cols: number;
  rows: number;
}): Promise<TerminalPtyHandle>;
//#endregion
//#region src/gateway/terminal/backend.d.ts
type TerminalBackendExit = {
  exitCode?: number;
  signal?: number;
  error?: string;
};
interface TerminalBackend {
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  kill(): void;
  onData(callback: (data: string) => void): void;
  onExit(callback: (exit: TerminalBackendExit) => void): void;
}
type LocalTerminalBackendSpawner = typeof spawnTerminalPty;
//#endregion
//#region src/gateway/terminal/session-manager.types.d.ts
type TerminalEventSink = (connId: string, event: string, payload: unknown) => void;
type TerminalOwner = {
  kind: "conn";
  connId: string;
} | {
  kind: "agent";
  agentSessionKey: string;
  agentId?: string;
};
type TerminalSessionManagerOptions = {
  emit: TerminalEventSink;
  getBufferedAmount?: (connId: string) => number | undefined;
  spawn?: LocalTerminalBackendSpawner;
  maxSessions?: number;
  env?: NodeJS.ProcessEnv; /** Detach grace; 0 preserves kill-on-disconnect. Gateway wiring owns its default. */
  detachGraceMs?: number;
  maxDetachedSessions?: number;
  scrollbackChars?: number;
};
type TerminalOpenRequest = {
  owner: TerminalOwner;
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  cols: number;
  rows: number;
  env: Record<string, string>; /** Request-scoped cancellation; a late backend is killed before registration. */
  signal?: AbortSignal;
  createBackend?: () => Promise<TerminalBackend>;
  stageUpload?: (file: TerminalUploadFile) => Promise<TerminalUploadResult>;
};
type TerminalOpenOutcome = {
  ok: true;
  sessionId: string;
  agentId: string;
  cwd: string;
  shell: string;
} | {
  ok: false;
  code: "limit" | "spawn_failed" | "closed";
  message: string;
};
//#endregion
//#region src/gateway/terminal/session-manager.d.ts
/**
 * Tracks live PTY sessions keyed by session id, with a reverse index for
 * connection owners and viewers so disconnect cleanup stays bounded.
 */
declare class TerminalSessionManager {
  private readonly sessions;
  private readonly byConn;
  private readonly pendingOpens;
  private readonly pendingByConn;
  private readonly emit;
  private readonly getBufferedAmount;
  private readonly spawn?;
  private readonly maxSessions;
  private readonly detachGraceMs;
  private readonly maxDetachedSessions;
  private readonly scrollbackChars;
  private opening;
  private spawning;
  constructor(options: TerminalSessionManagerOptions);
  /** Number of live sessions; used by tests and health surfaces. */
  get size(): number;
  /** Spawns a shell and wires its output/exit to its live connection recipients. */
  open(request: TerminalOpenRequest): Promise<TerminalOpenOutcome>;
  /** Writes client input to a session; returns false when the session is gone. */
  write(connId: string, sessionId: string, data: string): boolean;
  /** Writes agent input after proving session-key ownership. */
  writeAgent(agentSessionKey: string, sessionId: string, data: string, agentId?: string): boolean;
  private writeSession;
  /** Applies a new PTY grid size; returns false when the session is gone. */
  resize(connId: string, sessionId: string, cols: number, rows: number): boolean;
  /** Resizes an agent-owned PTY after proving session-key ownership. */
  resizeAgent(agentSessionKey: string, sessionId: string, cols: number, rows: number, agentId?: string): boolean;
  private resizeSession;
  /** Stages a file on the same host as an owned terminal session. */
  upload(connId: string, sessionId: string, file: TerminalUploadFile): Promise<TerminalUploadResult | undefined>;
  /** Closes one session on operator request. */
  close(connId: string, sessionId: string): boolean;
  /** Closes an agent-owned PTY after proving session-key ownership. */
  closeAgent(agentSessionKey: string, sessionId: string, agentId?: string): boolean;
  /** Closes every live or spawning PTY owned by one exact agent session or task. */
  closeAgentSessions(agentSessionKey: string, agentId?: string): number;
  /**
   * Rebinds a connection-owned session, or co-attaches a viewer to an
   * agent-owned session. Operator-to-operator attach remains take-over; only
   * agent-owned sessions gain shared viewers.
   */
  attach(connId: string, sessionId: string): TerminalAttachSummary | undefined;
  private attachSummary;
  /** Every live session, oldest first; all admin connections see the same list. */
  list(): TerminalSessionSummary[];
  /** Raw buffered output for one session, or undefined when it is gone. */
  snapshot(sessionId: string): string | undefined;
  /** Raw buffer for an agent-owned session, guarded by the caller session key. */
  snapshotAgent(agentSessionKey: string, sessionId: string, agentId?: string): string | undefined;
  /** Live sessions owned by one agent tool caller. */
  listAgent(agentSessionKey: string, agentId?: string): TerminalSessionSummary[];
  private trackPendingOpen;
  private openAbortMessage;
  private untrackPendingOpen;
  /**
   * Handles a dropped connection: detaches its sessions for later reattach
   * when a grace period is configured, otherwise kills them (legacy behavior,
   * still selected by detachedSessionTimeoutSeconds: 0).
   */
  handleDisconnect(connId: string): void;
  /** Closes live and pending sessions whose agent no longer permits a host shell. */
  closeDisallowedAgents(isAllowed: (agentId: string) => boolean): void;
  /** Parks a session ownerless with a reaper; PTY output keeps buffering. */
  private detach;
  private enforceDetachedCap;
  /**
   * Tears down every session — detached ones included — on gateway
   * shutdown/stop. Silent because the sockets are going away anyway (disabling
   * the terminal is a `gateway` restart, so that path also runs through here,
   * not a live notification).
   */
  disposeAll(): void;
  private indexByConn;
  private unindexByConn;
  /**
   * Claims the longest-idle agent-owned session as an eviction candidate when
   * the pool is exhausted. Viewer-attached and connection-owned sessions are
   * never evicted; an idle viewer-free background job losing its PTY under
   * pressure is the accepted tradeoff for keeping the pool available. Claimed
   * sessions are skipped so concurrent opens select distinct victims.
   */
  private claimLongestIdleAgentSession;
  private removeViewer;
  private interactiveSession;
  /** Agents may operate only PTYs created by their exact trusted session key. */
  private agentOwnedSession;
  private sessionConnIds;
  private finalize;
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-result.d.ts
type WorkerWorkspacePendingResult = {
  sessionId: string;
  environmentId: string;
  ownerEpoch: number;
  placementGeneration: number;
  claimId: string;
  runId: string;
  gatewayInstanceId: string;
  recoveryRequestedAtMs: number | null;
  workspaceAcceptedAtMs: number | null;
  stagedResultRef: string | null;
};
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.d.ts
type WorkerWorkspaceManifestEntry = {
  path: string;
  type: "file";
  mode: number;
  size: number;
  sha256: string;
} | {
  path: string;
  type: "symlink";
  mode: number;
  target: string;
};
type WorkerWorkspaceManifest = {
  version: 1;
  baseCommit: string | null;
  entries: WorkerWorkspaceManifestEntry[];
  directories?: string[];
};
type WorkerWorkspaceReconciliationJournal = {
  version: 1;
  temporaryNonce: string;
  baseManifestRef: string;
  currentManifestRef: string;
  baseEntries: WorkerWorkspaceManifestEntry[];
  appliedEntries: WorkerWorkspaceManifestEntry[];
  baseDirectories?: string[];
  appliedDirectories?: string[];
  appliedManifestRef?: string;
  baseTree: string;
  basePackSha256: string;
  basePack: Uint8Array;
};
type WorkerWorkspaceReconciliationJournalAdapter = {
  load(): WorkerWorkspaceReconciliationJournal | undefined;
  begin(journal: WorkerWorkspaceReconciliationJournal): void;
  commit(manifestRef: string): void;
  abort(): void;
};
//#endregion
//#region src/gateway/worker-environments/placement-store.d.ts
declare const RETIRABLE_PLACEMENT_STATES: readonly ["local", "reclaimed", "failed"];
type WorkerSessionPlacementRetirement = {
  sessionId: string;
  expectedState: (typeof RETIRABLE_PLACEMENT_STATES)[number];
  expectedGeneration: number;
};
declare function createWorkerSessionPlacementStore(options?: {
  database?: OpenClawStateDatabase;
  now?: () => number;
}): {
  registerTurnClaimClosedHandler(handler: (claim: WorkerSessionTurnClaim) => void): () => void;
  get(sessionId: string): WorkerSessionPlacementRecord | undefined;
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
  retireSessionPlacement(input: WorkerSessionPlacementRetirement): void;
  recordWorkspaceResultConflict(claim: WorkerSessionTurnClaim, conflict: WorkerWorkspaceResultConflict | undefined): void;
  startDispatch(input: WorkerSessionPlacementDispatchIdentity): WorkerSessionPlacementRecord;
  transition(input: {
    sessionId: string;
    from: WorkerSessionPlacementState;
    to: WorkerSessionPlacementState;
    expectedGeneration: number;
    patch?: WorkerSessionPlacementTransitionPatch;
  }): WorkerSessionPlacementRecord;
  startDrain(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    workspaceBaseManifestRef?: string;
  }): WorkerSessionPlacementRecord;
  finishReclaim(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
  }): WorkerSessionPlacementRecord;
  startReconcile(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
  }): WorkerSessionPlacementRecord;
  validateWorkerOwner(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
  }): boolean;
  fail(input: {
    sessionId: string;
    recoveryError: string;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  adoptActive(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  listForReconcile(): WorkerSessionPlacementRecord[];
  list(): WorkerSessionPlacementRecord[];
  workspaceResultInstanceId(): string;
  listPendingWorkspaceResults(): WorkerWorkspacePendingResult[];
  markWorkspaceResultPending(claim: WorkerSessionTurnClaim): void;
  recordStagedWorkspaceResult(claim: WorkerSessionTurnClaim, stagedResultRef: string): void;
  acceptWorkspaceResult(claim: WorkerSessionTurnClaim): void;
  handoffWorkspaceResultRecovery(claim: WorkerSessionTurnClaim): void;
  abandonWorkspaceResult(pending: WorkerWorkspacePendingResult): void;
  listWorkspaceReconciliationOwners(): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  pruneOrphanedWorkspaceReconciliations(options: {
    retainFailedOwner: (recoveryError: string) => boolean;
  }): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  loadWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    allowFailedOwner?: boolean;
  }): WorkerWorkspaceReconciliationJournal | undefined;
  beginWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, journal: WorkerWorkspaceReconciliationJournal): void;
  abortWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    force?: boolean;
  }): void;
  failWorkspaceResultAndReleaseTurn(pending: WorkerWorkspacePendingResult, error: unknown): WorkerSessionPlacementRecord;
  releaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  completeWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim, options?: {
    reclaim?: boolean;
  }): WorkerSessionPlacementRecord;
  cancelWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  clearLocalTurnClaimsAfterRestart(): number;
  waitForTurnClaimRelease(sessionIdInput: string, waitOptions: {
    timeoutMs: number;
    signal?: AbortSignal;
  }): Promise<void>;
  validateTurnClaim(claim: WorkerSessionTurnClaim): boolean;
  updateAckCursors(input: {
    claim: WorkerSessionTurnClaim;
    transcript?: number;
    liveEvent?: number;
    workspaceResultPending?: boolean;
  }): WorkerSessionPlacementRecord;
  updateWorkspaceBaseManifest(input: {
    claim: WorkerSessionTurnClaim;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  acceptIdleWorkspaceReconciliation(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  authorizeWorkerTurnTools(claim: WorkerSessionTurnClaim, toolNames: readonly string[]): void;
  isWorkerTurnToolAuthorized(binding: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    runId: string;
  }, toolName: string): boolean;
  closeWorkerTurnToolState(claim: WorkerSessionTurnClaim): Promise<void>;
  beginWorkerSessionToolOperation(params: {
    binding: {
      sessionId: string;
      environmentId: string;
      ownerEpoch: number;
      runId: string;
    };
    toolName: "sessions_spawn" | "sessions_send";
    toolCallId: string;
    requestDigest: string;
    childSessionKey?: string;
  }): {
    kind: "execute";
    claimId: string;
    operationSeed: string;
    childSessionKey?: string;
  } | {
    kind: "in-progress";
    claimId: string;
  } | {
    kind: "completed";
    resultJson: string;
  } | {
    kind: "unknown";
  } | {
    kind: "capacity";
  } | {
    kind: "conflict";
  } | {
    kind: "unauthorized";
  };
  bindWorkerSessionToolOperationChild(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    childSessionKey: string;
  }): boolean;
  completeWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    resultJson: string;
    failed?: boolean;
  }): boolean;
  abandonWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
  }): boolean;
  recoverWorkerSessionToolOperationsAfterRestart(): number;
  claimTurn(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
  claimReclaimWorkspaceResult(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
};
type WorkerSessionPlacementStore = ReturnType<typeof createWorkerSessionPlacementStore>;
type WorkerSessionPlacementRetirementService = Pick<WorkerSessionPlacementStore, "retireSessionPlacement">;
//#endregion
//#region src/gateway/worker-environments/placement-projector.d.ts
type WorkerSessionPlacementReader = {
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
};
type WorkerPlacementDiskSpaceReader = {
  read(record: WorkerSessionPlacementRecord): SessionPlacementDiskSpace | undefined;
  version(): number;
};
//#endregion
//#region src/music-generation/types.d.ts
/**
 * Public music generation provider contracts.
 *
 * Providers implement these request/result/capability shapes so the core
 * runtime can normalize prompts, options, assets, and fallback diagnostics.
 */
/** Audio output formats currently understood by music generation providers. */
type MusicGenerationOutputFormat = "mp3" | "wav";
/** Non-empty in-memory audio asset returned from a music generation provider. */
type GeneratedMusicAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
/** Optional source image passed to image-conditioned music edit models. */
type MusicGenerationSourceImage = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type MusicGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Provider request after runtime fallback and override normalization. */
type MusicGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
};
/** Provider result before runtime fallback metadata is attached. */
type MusicGenerationResult = {
  tracks: GeneratedMusicAsset[];
  model?: string;
  lyrics?: string[];
  metadata?: Record<string, unknown>;
};
/** Caller override dropped because the selected provider/model does not support it. */
type MusicGenerationIgnoredOverride = {
  key: "lyrics" | "instrumental" | "durationSeconds" | "format";
  value: string | boolean | number;
};
/** Capability block for prompt-only music generation. */
type MusicGenerationModeCapabilities = {
  maxTracks?: number;
  maxDurationSeconds?: number;
  supportsLyrics?: boolean;
  supportsLyricsByModel?: Readonly<Record<string, boolean>>;
  supportsInstrumental?: boolean;
  supportsInstrumentalByModel?: Readonly<Record<string, boolean>>;
  supportsDuration?: boolean;
  supportsFormat?: boolean;
  supportedFormats?: readonly MusicGenerationOutputFormat[];
  supportedFormatsByModel?: Readonly<Record<string, readonly MusicGenerationOutputFormat[]>>;
};
/** Capability block for image-conditioned music generation. */
type MusicGenerationEditCapabilities = MusicGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
};
/** Provider capability declaration, including optional mode-specific overrides. */
type MusicGenerationProviderCapabilities = MusicGenerationModeCapabilities & {
  maxInputImages?: number;
  generate?: MusicGenerationModeCapabilities;
  edit?: MusicGenerationEditCapabilities;
};
/** Normalization metadata attached to runtime results. */
type MusicGenerationNormalization = {
  durationSeconds?: MediaNormalizationEntry<number>;
};
/** Provider implementation contract consumed by the music generation runtime. */
type MusicGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  models?: string[];
  capabilities: MusicGenerationProviderCapabilities;
  isConfigured?: (ctx: MusicGenerationProviderConfiguredContext) => boolean;
  generateMusic: (req: MusicGenerationRequest) => Promise<MusicGenerationResult>;
};
//#endregion
//#region src/realtime-transcription/provider-types.d.ts
type RealtimeTranscriptionProviderId = string;
type RealtimeTranscriptionProviderConfig = Record<string, unknown>;
type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};
type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Callback hooks emitted by realtime transcription sessions. */
type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};
/** Inputs passed to a provider when creating a transcription session. */
type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Runtime control surface for a realtime transcription session. */
type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
//#endregion
//#region src/talk/provider-types.d.ts
type RealtimeVoiceProviderId = string;
type RealtimeVoiceRole = "user" | "assistant";
type RealtimeVoiceCloseReason = "completed" | "error";
type RealtimeVoiceAudioFormat = {
  encoding: "g711_ulaw";
  sampleRateHz: 8000;
  channels: 1;
} | {
  encoding: "pcm16";
  sampleRateHz: 24000;
  channels: 1;
};
type RealtimeVoiceTool = {
  type: "function";
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};
type RealtimeVoiceToolCallEvent = {
  itemId: string;
  callId: string;
  name: string;
  args: unknown;
};
type RealtimeVoiceToolResultOptions = {
  /**
   * Submit the tool result without prompting the realtime provider to generate a new assistant
   * response. Use when another channel has already delivered the user-visible answer.
   */
  suppressResponse?: boolean;
  willContinue?: boolean;
};
type RealtimeVoiceBridgeEvent = {
  direction: "client" | "server";
  type: string;
  detail?: string;
  itemId?: string;
  responseId?: string;
};
type RealtimeVoiceResponseError = {
  code?: string;
  message?: string;
  type?: string;
};
type RealtimeVoiceResponseOutcomeBase = {
  responseId?: string;
};
type RealtimeVoiceResponseOutcome = (RealtimeVoiceResponseOutcomeBase & {
  status: "completed";
}) | (RealtimeVoiceResponseOutcomeBase & {
  status: "cancelled";
  reason?: string;
}) | (RealtimeVoiceResponseOutcomeBase & {
  status: "failed" | "incomplete";
  reason?: string;
  error?: RealtimeVoiceResponseError;
  message: string;
});
type RealtimeVoiceAudioClearReason = "barge-in";
type RealtimeVoiceBridgeCallbacks = {
  onAudio: (audio: Buffer) => void;
  onClearAudio: (reason?: RealtimeVoiceAudioClearReason) => void;
  onMark?: (markName: string) => void;
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onResponseDone?: (outcome: RealtimeVoiceResponseOutcome) => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
type RealtimeVoiceProviderConfig = Record<string, unknown>;
type RealtimeVoiceProviderCapabilities = {
  transports: TalkTransport[];
  inputAudioFormats: RealtimeVoiceAudioFormat[];
  outputAudioFormats: RealtimeVoiceAudioFormat[];
  supportsBrowserSession?: boolean;
  supportsBargeIn?: boolean; /** True when provider VAD reports confirmed interruptions through onClearAudio("barge-in"). */
  handlesInputAudioBargeIn?: boolean;
  supportsToolCalls?: boolean; /** True when user transcripts are reliable enough to gate responses on a leading wake name. */
  supportsActivationNameGating?: boolean;
  supportsVideoFrames?: boolean;
  supportsSessionResumption?: boolean;
};
type RealtimeVoiceProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceAgentConsultRunner = (params: {
  prompt: string;
  signal?: AbortSignal;
}) => Promise<{
  text: string;
}>;
type RealtimeVoiceBridgeCreateRequest = RealtimeVoiceBridgeCallbacks & {
  cfg?: OpenClawConfig; /** Host-selected agent scope for provider auth and agent-owned bridge state. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  instructions?: string;
  language?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  tools?: RealtimeVoiceTool[]; /** Host-injected agent delegation runner for provider-owned realtime control channels. */
  runAgentConsult?: RealtimeVoiceAgentConsultRunner;
};
type RealtimeVoiceBrowserSessionCreateRequest = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  instructions?: string;
  tools?: RealtimeVoiceTool[];
  model?: string;
  voice?: string;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  reasoningEffort?: string; /** Host-injected agent delegation runner for provider-owned realtime control channels. */
  runAgentConsult?: RealtimeVoiceAgentConsultRunner; /** Host-owned control callbacks for browser media sessions whose provider wire stays server-side. */
  gatewayControl?: RealtimeVoiceGatewayControl;
};
/** Narrow host/plugin seam for Gateway-owned control of a client-owned media session. */
type RealtimeVoiceGatewayControl = Omit<RealtimeVoiceBridgeCallbacks, "onAudio" | "onClearAudio" | "onMark"> & {
  bindBridge: (bridge: RealtimeVoiceBridge) => void;
};
type RealtimeVoiceBrowserAudioContract = {
  inputEncoding: "pcm16" | "g711_ulaw";
  inputSampleRateHz: number;
  outputEncoding: "pcm16" | "g711_ulaw";
  outputSampleRateHz: number;
};
type RealtimeVoiceBrowserWebRtcSdpSession = {
  provider: RealtimeVoiceProviderId;
  transport: "webrtc";
  clientSecret: string;
  offerUrl?: string;
  offerHeaders?: Record<string, string>;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserJsonPcmWebSocketSession = {
  provider: RealtimeVoiceProviderId;
  transport: "provider-websocket";
  protocol: string;
  clientSecret: string;
  websocketUrl: string;
  audio: RealtimeVoiceBrowserAudioContract;
  initialMessage?: unknown;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserGatewayRelaySession = {
  provider: RealtimeVoiceProviderId;
  transport: "gateway-relay";
  relaySessionId: string;
  audio: RealtimeVoiceBrowserAudioContract;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserManagedRoomSession = {
  provider: RealtimeVoiceProviderId;
  transport: "managed-room";
  roomUrl: string;
  token?: string;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserSession = RealtimeVoiceBrowserWebRtcSdpSession | RealtimeVoiceBrowserJsonPcmWebSocketSession | RealtimeVoiceBrowserGatewayRelaySession | RealtimeVoiceBrowserManagedRoomSession;
type RealtimeVoiceBridge = {
  supportsToolResultContinuation?: boolean; /** False when the provider cannot accept a tool result without starting a response. */
  supportsToolResultSuppression?: boolean; /** Per-session override for provider-confirmed input-audio barge-in handling. */
  handlesInputAudioBargeIn?: boolean;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(ts: number): void;
  sendUserMessage?(text: string, options?: {
    toolChoice?: {
      type: "function";
      name: string;
    };
  }): void;
  triggerGreeting?(instructions?: string): void;
  handleBargeIn?(options?: RealtimeVoiceBargeInOptions): void;
  /**
   * Returns void when submission completes synchronously, or a Promise that resolves at the
   * asynchronous completion boundary exposed by the provider and rejects on submission failure.
   */
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void | Promise<void>;
  acknowledgeMark(markName?: string): void;
  close(): void;
  isConnected(): boolean;
};
type RealtimeVoiceBargeInOptions = {
  /**
   * The caller has already confirmed assistant audio is still playing in its output sink.
   * This lets providers interrupt output even when the sink cannot provide real playback marks.
   */
  audioPlaybackActive?: boolean; /** Interrupt even when normal barge-in audio-duration guards would treat the event as echo. */
  force?: boolean;
};
//#endregion
//#region src/transcripts/provider-types.d.ts
/**
 * Public contracts for transcript source providers.
 *
 * Providers can stream live utterances, import post-hoc transcript text, expose
 * status, and stop active sessions using shared session/source descriptors.
 */
/** Supported source families for transcript providers. */
type TranscriptSourceKind = "live-audio" | "live-caption" | "posthoc-transcript" | "recording-stt";
/** Provider-specific locator for a live, recorded, or imported transcript source. */
type TranscriptSourceLocator = {
  providerId: string;
  kind?: TranscriptSourceKind;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
  threadTs?: string;
  fileId?: string;
  [key: string]: string | undefined;
};
/** Speaker/participant identity attached to an utterance. */
type TranscriptParticipant = {
  id?: string;
  label: string;
};
/** One captured or imported transcript utterance. */
type TranscriptUtterance = {
  id?: string;
  sessionId?: string;
  startedAt?: string;
  endedAt?: string;
  speaker?: TranscriptParticipant;
  text: string;
  final?: boolean;
  metadata?: Record<string, unknown>;
};
/** Durable transcript session metadata. */
type TranscriptSessionDescriptor = {
  sessionId: string;
  title?: string;
  source: TranscriptSourceLocator;
  startedAt: string;
  stoppedAt?: string;
  metadata?: Record<string, unknown>;
};
/** Request passed to providers that can start live transcript capture. */
type TranscriptStartRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  abortSignal?: AbortSignal;
  startupWaitMs?: number;
  onUtterance: (utterance: TranscriptUtterance) => void | Promise<void>;
  onStatus?: (status: TranscriptSourceStatus) => void | Promise<void>;
};
/**
 * Result from starting a transcript source provider.
 *
 * Providers retain cleanup ownership until they return `ok: true`. A failed or
 * rejected start must release any partial capture before it settles.
 */
type TranscriptsStartResult = {
  ok: true;
  session: TranscriptSessionDescriptor;
} | {
  ok: false;
  error: string;
};
/** Request passed to providers that can stop live transcript capture. */
type TranscriptStopRequest = {
  cfg?: OpenClawConfig;
  sessionId: string;
  source: TranscriptSourceLocator;
  reason?: string;
};
/** Result from stopping a transcript source provider. */
type TranscriptsStopResult = {
  ok: true;
  sessionId: string;
  stoppedAt?: string;
} | {
  ok: false;
  error: string;
};
/** Runtime status reported by transcript source providers. */
type TranscriptSourceStatus = {
  sessionId?: string;
  active: boolean;
  message?: string;
  source?: TranscriptSourceLocator;
};
/** Request passed to providers that import post-hoc transcript text. */
type TranscriptImportRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  text: string;
  speakerLabel?: string;
};
/** Provider contract for transcript capture/import integrations. */
type TranscriptSourceProvider$1 = {
  id: string;
  aliases?: readonly string[];
  name: string;
  sourceKinds: readonly TranscriptSourceKind[];
  start?: (request: TranscriptStartRequest) => Promise<TranscriptsStartResult>;
  stop?: (request: TranscriptStopRequest) => Promise<TranscriptsStopResult>;
  status?: (source: TranscriptSourceLocator, cfg?: OpenClawConfig) => Promise<TranscriptSourceStatus[]>;
  importTranscript?: (request: TranscriptImportRequest) => Promise<TranscriptUtterance[]>;
};
//#endregion
//#region src/tts/provider-types.d.ts
/** Canonical speech provider identifier after provider registry normalization. */
type SpeechProviderId = string;
/** Output context requested from a speech provider. */
type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
/** Provider-owned normalized config map. */
type SpeechProviderConfig = Record<string, unknown>;
/** Provider-owned per-request directive/persona overrides. */
type SpeechProviderOverrides = Record<string, unknown>;
/** Policy controlling which [[tts:*]] directive fields can affect synthesis. */
type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};
/** Parsed directive overrides grouped by provider. */
type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};
/** Result of parsing TTS directives from message text. */
type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};
/** Context for checking whether a provider has enough config to synthesize. */
type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};
/** Request for buffered speech synthesis. */
type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Buffered speech synthesis result plus file/voice-note compatibility metadata. */
type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};
type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;
/** Streaming speech synthesis result; release frees provider transport resources. */
type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};
/** Telephony synthesis request for provider output that needs a fixed sample rate. */
type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Telephony synthesis result with sample-rate metadata for call transports. */
type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};
/** Provider hook input for applying persona/config before synthesis. */
type SpeechProviderPrepareSynthesisContext = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  timeoutMs: number;
};
/** Optional provider-prepared synthesis overrides. */
type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};
/** Voice metadata returned by provider list-voices hooks. */
type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};
/** Provider voice-listing request with optional direct auth/URL overrides. */
type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string; /** Core-resolved request timeout after config and provider defaults. */
  timeoutMs?: number;
};
/** Provider hook input for resolving normalized config from raw OpenClaw config. */
type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};
/** One parsed directive key/value plus current provider override state. */
type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};
/** Provider directive parser result. */
type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};
/** Provider hook input for resolving talk-command speech config. */
type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};
/** Provider hook input for per-call talk-command overrides. */
type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
//#endregion
//#region src/plugins/host-hooks.d.ts
/** Reason passed to plugin cleanup callbacks when host-owned state changes. */
type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";
type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};
/** Session extension registration owned by a plugin namespace. */
type PluginSessionExtensionRegistration = {
  namespace: string;
  description: string;
  project?: (ctx: PluginSessionExtensionProjectionContext) => PluginJsonValue | undefined;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
  }) => void | Promise<void>;
  /**
   * When set, after every successful `patchSessionExtension` the projected
   * value is mirrored to `SessionEntry[<slotKey>]` so non-plugin readers
   * can consume the typed slot without reaching into
   * `pluginExtensions[pluginId][namespace]`.
   *
   * The slot is a read-only mirror: writes always go through
   * `patchSessionExtension`; the host overwrites the slot value on every
   * subsequent patch.
   */
  sessionEntrySlotKey?: string;
  /**
   * Optional JSON-compatible schema describing the projected slot value.
   * Purely informational at this layer; clients may use it to validate the
   * mirrored slot against a contract.
   */
  sessionEntrySlotSchema?: PluginJsonValue;
};
type PluginToolPolicyDecision = PluginHookBeforeToolCallResult | {
  allow?: boolean;
  reason?: string;
};
type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  matcher?: PluginToolMatcher;
  evaluate: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};
type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};
type PluginControlUiTabGroup = "control" | "agent";
type PluginControlUiDescriptor = {
  id: string; /** "tab" adds a sidebar tab; "widget" advertises a trusted dashboard renderer. */
  surface: "session" | "tool" | "run" | "settings" | "tab" | "widget";
  label: string;
  description?: string;
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[]; /** Icon name hint for tab descriptors; unknown names fall back to a generic icon. */
  icon?: string;
  /**
   * Gateway HTTP path (e.g. /plugins/<id>/panel) rendered in a sandboxed frame
   * when the Control UI has no bundled view for this tab.
   */
  path?: string; /** Sidebar group for tab descriptors; defaults to "control". */
  group?: PluginControlUiTabGroup; /** Sort order among plugin tabs; lower renders first. */
  order?: number;
};
type PluginSessionActionContext = {
  pluginId: string;
  actionId: string;
  sessionKey?: string;
  agentId?: string;
  payload?: PluginJsonValue;
  client?: {
    connId?: string;
    scopes: string[];
  };
};
type PluginSessionActionResult = {
  ok?: true;
  result?: PluginJsonValue;
  reply?: PluginJsonValue;
  continueAgent?: boolean;
} | {
  ok: false;
  error: string;
  code?: string;
  details?: PluginJsonValue;
};
type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (ctx: PluginSessionActionContext) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};
type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};
type PluginAgentEventSubscriptionRegistration = {
  id: string;
  description?: string;
  streams?: AgentEventStream[];
  handle: (event: AgentEventPayload, ctx: {
    getRunContext: <T extends PluginJsonValue = PluginJsonValue>(namespace: string) => T | undefined;
    setRunContext: (namespace: string, value: PluginJsonValue) => void;
    clearRunContext: (namespace?: string) => void;
  }) => void | Promise<void>;
};
type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};
type PluginAgentEventEmitResult = {
  emitted: true;
  stream: AgentEventStream;
} | {
  emitted: false;
  reason: string;
};
type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};
type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};
type PluginSessionSchedulerJobRegistration = {
  id: string;
  sessionKey: string;
  kind: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey: string;
    jobId: string;
  }) => void | Promise<void>;
};
type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};
type PluginSessionAttachmentFile = {
  path: string;
};
type PluginAttachmentChannelHints = {
  parseMode?: "HTML";
  silent?: boolean; /** Require host detection to match this MIME before forcing document delivery. */
  forceDocumentMime?: string;
  threadId?: string | number; /** @deprecated Put portable attachment hints directly on `channelHints`. */
  telegram?: {
    parseMode?: "HTML";
    disableNotification?: boolean;
    /**
     * Require host-side detection to match this MIME before forcing document delivery.
     * Mismatched files are rejected before the outbound adapter is called.
     */
    forceDocumentMime?: string;
  }; /** @deprecated Use `channelHints.threadId`. */
  slack?: {
    threadTs?: string;
  };
};
type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";
type PluginSessionAttachmentParams = {
  sessionKey: string;
  files: PluginSessionAttachmentFile[];
  text?: string;
  threadId?: string | number;
  forceDocument?: boolean;
  maxBytes?: number;
  captionFormat?: PluginSessionAttachmentCaptionFormat;
  channelHints?: PluginAttachmentChannelHints;
};
type PluginSessionAttachmentResult = {
  ok: true;
  channel: string;
  deliveredTo: string;
  count: number;
} | {
  ok: false;
  error: string;
};
type PluginSessionTurnScheduleCommonParams = {
  sessionKey: string;
  message: string;
  agentId?: string;
  deliveryMode?: "none" | "announce";
  name?: string; /** Optional cleanup tag. Reserved cron-name delimiters like `:` are rejected. */
  tag?: string;
};
type PluginSessionTurnScheduleParams = ({
  at: string | number | Date;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  delayMs: number;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  cron: string;
  tz?: string;
  deleteAfterRun?: false;
} & PluginSessionTurnScheduleCommonParams);
type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};
type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};
//#endregion
//#region src/plugins/capability-provider.types.d.ts
/** JSON-compatible provider settings for one configured worker profile. */
type WorkerProfile = Readonly<Record<string, PluginJsonValue>>;
/** SSH endpoint material returned by a worker provider after provisioning. */
type WorkerSshEndpoint = {
  host: string;
  port: number;
  /**
   * Up to 10 ordered unique integer ports (1..65535) after `port`; excludes the primary.
   * Core rotates only for idempotent probes, content-addressed transfers, receipt/lock-guarded
   * artifact installation, convergent managed-worktree mirroring, and tunnel reconnects.
   * Ambiguous unguarded stateful commands fail closed and are not replayed.
   */
  fallbackPorts?: readonly number[];
  user: string; /** OpenSSH public host-key line obtained from trusted provisioning output. */
  hostKey: string; /** Secret reference only; providers must never return plaintext key material. */
  keyRef: SecretRef;
};
/** Resolved SSH client identity. Providers may return a local path or ephemeral material. */
type WorkerSshIdentity = {
  kind: "path";
  path: string;
} | {
  kind: "material";
  contents: string;
};
/** Durable context supplied when a worker provider resolves the identity it minted. */
type WorkerSshIdentityRequest = {
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
};
/** Closed set of applications installed and launchable on a provisioned worker desktop. */
type WorkerDesktopApp = {
  id: "browser";
  executablePath: string;
  cdpPort: number;
} | {
  id: "terminal";
  executablePath: string;
};
/** Optional interactive desktop endpoint provisioned with the lease (warm-time capability). */
type WorkerDesktopEndpoint = {
  /** Desktop service protocol on the worker loopback; "rfb" is the only phase-1 value. */protocol: "rfb"; /** Loopback port on the worker (e.g. 5900). */
  port: number; /** Absolute on-box path to the per-lease password file; read over SSH, never persisted as plaintext. */
  passwordFilePath?: string; /** Closed application metadata advertised by the provider for this desktop. */
  apps?: WorkerDesktopApp[];
};
/** Durable lease identity and endpoint returned by a successful provision operation. */
type WorkerLease = {
  leaseId: string; /** The SSH account also owns processes unrelated to this worker lease. */
  sharedHost?: boolean;
  desktop?: WorkerDesktopEndpoint;
} & ({
  ssh: WorkerSshEndpoint;
  node?: never;
} | {
  node: {
    deviceId: string;
  };
  ssh?: never;
});
/** Authoritative inspection result for an already-known worker lease. */
type WorkerLeaseStatus = {
  status: "active"; /** Explicit provider fact used to reconcile leases persisted before this metadata existed. */
  sharedHost?: boolean;
} | {
  status: "dormant";
} | {
  status: "destroyed";
} | {
  status: "unknown";
};
/** Cloud-worker lifecycle capability registered by a plugin. */
type WorkerProvider = {
  id: string;
  /**
   * Provision before preparing an installation when the lease transport decides whether an
   * installation is needed. Defaults to false so SSH providers retain prepare-before-allocation.
   */
  provisionBeforeInstallation?: boolean;
  /**
   * Provision or adopt the lease for this operation id.
   * Repeating the same operation id must be idempotent across gateway restarts.
   */
  provision: (profile: WorkerProfile, operationId: string) => Promise<WorkerLease>; /** Maximum core wait for one provision attempt, including provider-owned setup and cleanup. */
  resolveProvisionTimeoutMs?: (profile: WorkerProfile) => number; /** Throws on transient/indeterminate failures; `unknown` means authoritative absence. */
  inspect: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<WorkerLeaseStatus>;
  /**
   * Resolves provider-owned dynamic identities. When absent, the gateway uses its generic
   * SecretRef resolver; when present, failures are authoritative and never fall back.
   */
  resolveSshIdentity?: (request: WorkerSshIdentityRequest) => Promise<WorkerSshIdentity>;
  renew?: (leaseId: string) => Promise<void>; /** Idempotent; resolves only after the provider can prove teardown. */
  destroy: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<void>;
};
/** Speech capability registered by a plugin. */
type SpeechProviderPlugin = {
  id: SpeechProviderId;
  label: string;
  aliases?: string[];
  autoSelectOrder?: number; /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  defaultModel?: string;
  models?: readonly string[];
  voices?: readonly string[];
  resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
  parseDirectiveToken?: (ctx: SpeechDirectiveTokenParseContext) => SpeechDirectiveTokenParseResult;
  resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
  resolveTalkOverrides?: (ctx: SpeechProviderResolveTalkOverridesContext) => SpeechProviderConfig | undefined;
  prepareSynthesis?: (ctx: SpeechProviderPrepareSynthesisContext) => SpeechProviderPreparedSynthesis | undefined | Promise<SpeechProviderPreparedSynthesis | undefined>;
  isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
  synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
  streamSynthesize?: (req: SpeechSynthesisStreamRequest) => Promise<SpeechSynthesisStreamResult>;
  synthesizeTelephony?: (req: SpeechTelephonySynthesisRequest) => Promise<SpeechTelephonySynthesisResult>;
  listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
};
/** Realtime transcription capability registered by a plugin. */
type RealtimeTranscriptionProviderPlugin = {
  id: RealtimeTranscriptionProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  autoSelectOrder?: number;
  resolveConfig?: (ctx: RealtimeTranscriptionProviderResolveConfigContext) => RealtimeTranscriptionProviderConfig;
  isConfigured: (ctx: RealtimeTranscriptionProviderConfiguredContext) => boolean;
  createSession: (req: RealtimeTranscriptionSessionCreateRequest) => RealtimeTranscriptionSession;
};
/** Transcript source capability registered by a channel or meeting plugin. */
type TranscriptSourceProvider = TranscriptSourceProvider$1;
/** Realtime voice capability registered by a plugin. */
type RealtimeVoiceProviderPlugin = {
  id: RealtimeVoiceProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[]; /** Known speaker voices for pickers; providers still accept free-form values. */
  voices?: readonly string[];
  autoSelectOrder?: number;
  capabilities?: RealtimeVoiceProviderCapabilities;
  resolveConfig?: (ctx: RealtimeVoiceProviderResolveConfigContext) => RealtimeVoiceProviderConfig;
  isConfigured: (ctx: RealtimeVoiceProviderConfiguredContext) => boolean;
  createBridge: (req: RealtimeVoiceBridgeCreateRequest) => RealtimeVoiceBridge;
  createBrowserSession?: (req: RealtimeVoiceBrowserSessionCreateRequest) => Promise<RealtimeVoiceBrowserSession>;
};
type MediaUnderstandingProviderPlugin = MediaUnderstandingProvider;
type ImageGenerationProviderPlugin = ImageGenerationProvider;
type VideoGenerationProviderPlugin = VideoGenerationProvider;
type MusicGenerationProviderPlugin = MusicGenerationProvider;
//#endregion
//#region src/worker/tool-authority.d.ts
declare const WORKER_TOOL_NAMES: readonly ["read", "write", "edit", "apply_patch", "exec", "process", "browser", "sessions_spawn", "sessions_send"];
type WorkerToolName = (typeof WORKER_TOOL_NAMES)[number];
type WorkerToolAuthority = {
  allowedToolNames: WorkerToolName[];
};
//#endregion
//#region src/worker/launch-descriptor.d.ts
type WorkerBrowserLaunchDescriptor = {
  cdpUrl: string;
  launcherPath: string;
};
type WorkerLaunchAssignment = {
  /** Host placement namespace used for worker-local policy, hooks, and audit attribution. */agentId: string;
  operationalRunInstance: OperationalRunInstanceRef; /** Opaque host-signed runtime envelope; worker code never parses private identity. */
  agentRuntimeIdentityToken: string;
  runId: string;
  turnId: string;
  prompt: string;
  suppressPromptTranscript: boolean;
  workspaceDir: string;
  modelRef: WorkerInferenceModelRef;
  inferenceOptions: WorkerInferenceOptions;
  systemPrompt?: string;
  initialMessages: WorkerTranscriptMessage[];
  transcript: {
    baseLeafId: WorkerTranscriptCommitParams["baseLeafId"];
    nextSeq: number;
  };
  liveEvents: {
    ackedSeq: number;
    nextSeq: number;
  };
  toolAuthority: WorkerToolAuthority;
  browser?: WorkerBrowserLaunchDescriptor;
};
type WorkerLaunchAdmission = Omit<WorkerConnectParams["admission"], "runId"> & {
  sessionId: string;
};
type WorkerLaunchPlan = {
  version: 3;
  admission: WorkerLaunchAdmission;
  assignment: WorkerLaunchAssignment;
};
//#endregion
//#region src/worker/node-workspace-transfer-protocol.d.ts
type NodeWorkerWorkspaceTransferInput = {
  direction: "download";
  token: string;
  manifestRef: string;
} | {
  direction: "upload";
  token: string;
  baseManifestRef: string;
};
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-core.d.ts
type WorkerWorkspaceApplyResult = {
  manifestRef: string;
  manifest: WorkerWorkspaceManifest;
  conflictPaths: string[];
  verifyLocalStable(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/tunnel-contract.d.ts
type WorkerTunnelStatus = "stopped" | "connecting" | "connected" | "reconnecting";
type WorkerTunnelRequest = {
  environmentId: string;
  ownerEpoch: number;
};
type WorkerWorkspaceCommand = {
  argv: readonly string[];
  transportRetry: "idempotent" | "never";
  onDispatchReady?: () => void;
  input?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  transfer?: NodeWorkerWorkspaceTransferInput;
};
type WorkerWorkspaceSyncRequest = {
  localPath: string;
  sessionId: string;
  generation: number;
};
type WorkerWorkspaceSyncResult = {
  mode: "git" | "plain";
  remoteWorkspaceDir: string;
  manifestRef: string;
};
type WorkerWorkspaceReconcileRequest = {
  localPath: string;
  remoteWorkspaceDir: string;
  baseManifestRef: string;
  journal: WorkerWorkspaceReconciliationJournalAdapter;
  stagedResult?: {
    ref: string;
    record(ref: string): void;
  };
};
type WorkerWorkspaceReconcileResult = {
  manifestRef: string;
  changed: boolean; /** Re-read the remote workspace after local acceptance, immediately before teardown. */
  verifyStable(): Promise<void>; /** Re-read the accepted local result after the remote stability fence. */
  verifyLocalStable(): Promise<void>; /** Apply the prepared candidate locally without making it restart-authoritative. */
  applyPreparedStagedResult?(): Promise<void>; /** Return the accepted local manifest and any keep-local conflicts after apply. */
  getAppliedWorkspaceResult?(): WorkerWorkspaceApplyResult | undefined; /** Publish the verified candidate for restart recovery. */
  publishStagedResult?(): Promise<void>;
  discardPreparedStagedResult?(): Promise<void>;
};
type WorkerWorkspaceQuiescence = {
  /** Prove the watchdog lease still owns stopped processes and extend it through teardown. */assertActive(): Promise<void>; /** Resume only the remote processes stopped by this quiescence owner. */
  resume(): Promise<void>;
};
type WorkerTurnLaunchRequest = {
  plan: WorkerLaunchPlan;
  placementGeneration: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  onDispatchReady?: () => void;
};
type WorkerTunnelHandle = {
  environmentId: string;
  ownerEpoch: number;
  launchTurn(request: WorkerTurnLaunchRequest): Promise<SpawnResult>;
  runWorkspaceCommand(command: WorkerWorkspaceCommand): Promise<SpawnResult>;
  quiesceWorkspace(remoteWorkspaceDir: string): Promise<WorkerWorkspaceQuiescence>;
  syncWorkspace(request: WorkerWorkspaceSyncRequest): Promise<WorkerWorkspaceSyncResult>;
  reconcileWorkspace(request: WorkerWorkspaceReconcileRequest): Promise<WorkerWorkspaceReconcileResult>;
  stop(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/service-contract.d.ts
/** Non-secret worker projection available to Gateway request handlers. */
type WorkerEnvironmentServiceRecord = {
  environmentId: string;
  providerId: string;
  leaseId: string | null;
  sharedHost: boolean | null;
  state: WorkerEnvironmentState;
  ownerEpoch: number;
  createdAtMs: number;
  idleSinceAtMs: number | null;
  attachedSessionIds: readonly string[];
  desktopAvailable: boolean;
  desktopApps: readonly WorkerDesktopApp["id"][];
  tunnelStatus: WorkerTunnelStatus;
  error?: string;
};
type WorkerDesktopObserveResult = {
  transport: "rfb";
  wsPath: string;
  expiresAtMs: number;
  control: boolean;
  vncPassword?: string;
};
type WorkerDesktopLaunchResult = {
  app: WorkerDesktopApp["id"];
  status: "ready";
};
/** Request-facing lifecycle methods, kept separate from persistence and provider internals. */
type WorkerEnvironmentServiceContract = {
  list(): WorkerEnvironmentServiceRecord[];
  get(environmentId: string): WorkerEnvironmentServiceRecord | undefined;
  create(profileId: string, idempotencyKey: string): Promise<WorkerEnvironmentServiceRecord>;
  destroy(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  destroyUnattached(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  observeDesktop(request: {
    environmentId: string;
    control: boolean;
  }): Promise<WorkerDesktopObserveResult>;
  launchDesktopApp(request: {
    environmentId: string;
    app: WorkerDesktopApp["id"];
  }): Promise<WorkerDesktopLaunchResult>;
  startTunnel(request: WorkerTunnelRequest): Promise<WorkerTunnelHandle>;
  stopTunnel(environmentId: string, ownerEpoch?: number): Promise<void>;
};
type WorkerPlacementDispatchRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
  profileId: string;
  executionMode: WorkerPlacementExecutionMode;
  deviceId?: string;
  inheritedProfile?: {
    providerId: string;
    profileSnapshot: WorkerProfile;
  };
};
type WorkerPlacementReclaimRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
};
type WorkerPlacementDispatchContract = {
  dispatch(request: WorkerPlacementDispatchRequest): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "active";
  }>>;
  reclaim?(request: WorkerPlacementReclaimRequest): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "local" | "reclaimed";
  }>>;
  forceDestroyEnvironment?(environmentId: string, onCleanupError?: (error: unknown) => void): Promise<WorkerEnvironmentServiceRecord>;
  reconcileActive?(environmentId?: string): Promise<void>;
};
//#endregion
//#region src/gateway/server-methods/chat-metadata-contract.d.ts
type ChatMetadataSessionEntry = {
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user";
  authProfileOverrideCompactionCount?: number;
};
type ChatMetadataReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
};
type ChatMetadataResult = {
  commands?: unknown[];
  models?: unknown[];
  swarmEnabled: boolean;
};
//#endregion
//#region src/gateway/server-methods/chat-startup-projection-contract.d.ts
type ChatStartupProjectionReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
  includeSystem: boolean;
};
type ChatStartupProjectionResult = {
  metadata: ChatMetadataResult;
  sessionModelCatalog: ModelCatalogEntry[];
  defaultModelCatalog: ModelCatalogEntry[];
  agentsList: AgentsListResult;
};
//#endregion
//#region src/gateway/server-methods/session-creation-provenance.d.ts
type TrustedSessionCreation = {
  via: SessionCreatedVia;
  actor?: SessionCreatedActor; /** Immutable completion recipient for a spawn-owned visible session. */
  completionOwnerSessionKey?: string; /** Effective caller tool-policy snapshot for an in-process visible spawn. */
  inheritedToolPolicy?: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
//#endregion
//#region src/gateway/server-methods/shared-types.d.ts
/**
 * Shared gateway request types used by every server-method module.
 */
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
/** Trusted in-process spawn control plane that already owns this run's task row.
    Gateway CLI tracking only covers runs nobody else records, so a marked run
    must never get a second row. */
type GatewayAgentRunTaskOwner = "plugin_subagent" | "native_subagent";
/** Per-connection client metadata captured after the gateway handshake. */
type GatewayClient = {
  connect: ConnectParams;
  connId?: string;
  presenceKey?: string;
  clientIp?: string; /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  authenticatedUserId?: string; /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision?: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
  isDeviceTokenAuth?: boolean; /** Temporary legacy migration session closed when normal enforcement resumes. */
  isControlUiDeviceAuthMigrationSession?: boolean; /** Signed shared-auth session admitted only to approve its own upgrade pairing. */
  isControlUiDeviceAuthMigration?: boolean;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */isLocalClient?: true; /** Marks the server-constructed client used by trusted in-process dispatch. */
    syntheticClient?: true; /** Overrides persisted sender attribution without changing the authorizing client identity. */
    senderAttribution?: {
      id: string;
      name?: string;
    }; /** Trusted session creation provenance; never accepted from Gateway wire params. */
    sessionCreation?: TrustedSessionCreation;
    allowModelOverride?: boolean;
    approvalRuntime?: boolean;
    cronRunContinuation?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
    pluginRuntimeOwnerId?: string;
    agentRunTracking?: GatewayAgentRunTaskOwner; /** Host-captured requester lineage for opt-in plugin subagent completion delivery. */
    pluginSubagentRequester?: PluginSubagentRequesterContext; /** Host-owned exact media set for a scoped automatic recovery delivery. */
    internalDeliveryMediaUrls?: string[];
    internalDeliverySuppressText?: boolean; /** Plugin-owned tools authorized for this internal subagent run. */
    runtimePluginToolGrant?: RuntimePluginToolGrant; /** Opaque in-process subagent-completion capability; never accepted from wire params. */
    delegatedToolPolicyHandoffId?: string;
  };
};
/** Callback used by method handlers to emit one protocol response frame. */
type RespondFn = (ok: boolean, payload?: unknown, error?: ErrorShape, meta?: Record<string, unknown>) => void;
/** Minimal hosted OpenClaw contract retained by the gateway request router. */
/**
 * Structural mirror of the engine's SystemAgentAssistantTurn. Kept local as a
 * leaf contract: importing the assistant module here closes a madge cycle
 * through the agents/config cluster.
 */
type SystemAgentHistoryTurn = {
  role: "user" | "assistant";
  text: string;
};
type GatewaySystemAgentSession = {
  engine: {
    handle: (message: string, options?: {
      uiContext?: {
        page: string;
      };
    }) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    answerWizard: (answer: WizardAnswer) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    cancelWizard: (cancel: SystemAgentWizardCancel) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    seedHistory: (turns: readonly SystemAgentHistoryTurn[]) => void;
    historyLength: () => number;
    historySince: (index: number) => SystemAgentHistoryTurn[];
    getPendingOperatorProposal: () => {
      operation: SystemAgentOperation;
      hash: string;
    } | null;
    resolveOperatorApproval: (decision: "allow-once" | "allow-always" | "deny" | null, proposalHash: string) => Promise<unknown>;
    dispose: () => Promise<void>;
  };
  welcome: string;
  welcomeQuestion?: SystemAgentChatQuestion; /** Audit cursor captured with the pending caretaker welcome; cleared after delivery. */
  welcomeAuditSequence?: number;
  lastUsedAt: number;
  ownerKey: string;
  pendingApproval?: {
    id: string;
    proposalHash: string;
  };
};
/** Kernel-owned services and state that can be constructed without binding sockets. */
type GatewayKernelContext = {
  deps: CliDeps;
  cron: GatewayCronServiceContract;
  cronStorePath: string;
  getRuntimeConfig: () => OpenClawConfig; /** Prepared listener certificate pin; undefined when Gateway TLS is disabled. */
  gatewayTlsFingerprint?: string;
  sessionCompanion?: SessionCompanionService;
  sessionObserver?: SessionObserverService;
  resolveTerminalLaunchPolicy: (agentId?: string) => TerminalLaunchResolution;
  isTerminalEnabled: () => boolean;
  execApprovalManager?: ExecApprovalManager;
  scopeUpgradeCoordinator?: ScopeUpgradeCoordinator; /** Cancels durable approvals owned by one actively aborted run. */
  cancelRunBoundApprovals?: (runId: string) => number;
  pluginApprovalManager?: ExecApprovalManager<PluginApprovalRequestPayload>;
  systemAgentApprovalManager?: ExecApprovalManager<SystemAgentApprovalRequestPayload>;
  forwardPluginApprovalRequest?: (request: PluginApprovalRequest) => Promise<boolean>;
  pluginApprovalIosPushDelivery?: {
    handleRequested?: (request: PluginApprovalRequest, opts?: {
      isTargetVisible?: (target: {
        deviceId: string;
        scopes: readonly string[];
      }) => boolean;
    }) => Promise<boolean>;
    handleExpired?: (request: PluginApprovalRequest) => Promise<void>;
  };
  listSessionPendingApprovals?: (sessionKey: string, client: GatewayClient | null) => SessionApprovalReplay;
  loadGatewayModelCatalog: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[]>;
  loadGatewayModelCatalogSnapshot: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<GatewayModelCatalogSnapshot>;
  readPreparedGatewayModelCatalog?: (params?: {
    agentId?: string;
    agentDir?: string;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[] | undefined>;
  readChatMetadata: (params: ChatMetadataReadParams) => Promise<ChatMetadataResult>;
  readChatStartupProjection?: (params: ChatStartupProjectionReadParams) => Promise<ChatStartupProjectionResult>;
  getHealthCache: () => HealthSummary | null;
  logHealth: {
    error: (message: string) => void;
  };
  logGateway: SubsystemLogger;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number; /** Instance-local native approval subscribers; never derived from a network client. */
  approvalEvents?: GatewayApprovalEventPublisher;
  recoveryRuntime?: GatewayRecoveryRuntime;
  enforceSharedGatewayAuthGenerationForConfigWrite?: (nextConfig: OpenClawConfig) => void;
  claimControlUiDeviceAuthMigration?: (deviceId: string) => boolean;
  releaseControlUiDeviceAuthMigrationClaim?: (deviceId: string) => void;
  completeControlUiDeviceAuthMigration?: (device: {
    deviceId: string;
    publicKey: string;
    scopes: string[];
  }) => void;
  nodeRegistry: NodeRegistry;
  agentRunSeq: Map<string, number>;
  chatAbortControllers: Map<string, ChatAbortControllerEntry>; /** Cancel identities for turns waiting in the followup/collect queue. */
  chatQueuedTurns: Map<string, QueuedChatTurnEntry>;
  chatRunState: ChatRunState;
  addChatRun: (sessionId: string, entry: ChatRunRegistration) => void;
  removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  dedupe: Map<string, DedupeEntry>;
  wizardSessions: Map<string, WizardSession>;
  systemAgentSessions: Map<string, GatewaySystemAgentSession>;
  findRunningWizard: () => string | null;
  purgeWizardSession: (id: string) => void;
  wizardRunner: (opts: OnboardOptions, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
  channelWizardRunner: ChannelSetupWizardRunner;
  unavailableGatewayMethods?: ReadonlySet<string>;
};
/** Socket-bound services and connection state supplied by the Gateway transports. */
type GatewayTransportContext = {
  portalService?: GatewayPortalService;
  getMcpAppSandboxPort?: () => number | undefined;
  ensureSandboxHostPort?: () => Promise<number>;
  broadcast: GatewayBroadcastFn;
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
  nodeSubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribeAll: (nodeId: string) => void;
  hasConnectedTalkNode: () => Promise<boolean>;
  isConnectionActive?: (connId: string) => boolean;
  hasExecApprovalClients?: (excludeConnId?: string) => boolean;
  getApprovalClientConnIds?: <TPayload>(params?: {
    approvalKind?: "exec" | "plugin" | "system-agent";
    excludeConnId?: string;
    filter?: (client: GatewayClient, record?: ExecApprovalRecord<TPayload>) => boolean;
    record?: ExecApprovalRecord<TPayload>;
  }) => ReadonlySet<string>;
  disconnectClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
  }) => void;
  invalidateClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
    reason?: string;
  }) => void;
  hasConnectedClientsForDevice?: (deviceId: string) => boolean;
  refreshConnectedUserProfile?: (profile: {
    id: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  }) => void;
  disconnectClientsUsingSharedGatewayAuth?: () => void;
  terminalSessions?: TerminalSessionManager;
  subscribeSessionEvents: (connId: string) => void;
  unsubscribeSessionEvents: (connId: string) => void;
  subscribeSessionMessageEvents: (connId: string, sessionKey: string, opts?: {
    includeApprovals?: boolean;
    provisional?: boolean;
  }) => ((() => void) & {
    commit: () => void;
  }) | undefined;
  unsubscribeSessionMessageEvents: (connId: string, sessionKey: string) => void;
  unsubscribeAllSessionEvents: (connId: string) => void;
  getSessionEventSubscriberConnIds: () => ReadonlySet<string>;
  registerToolEventRecipient: (runId: string, connId: string) => void;
};
/** Resident-owned services bridged into request handling by the server lifecycle. */
type GatewayResidentBridgeContext = {
  controlUiSessionPullRequests?: ReturnType<typeof createControlUiSessionPullRequestSubscriptions>;
  sessionViewerPresence?: ReturnType<typeof createSessionViewerPresenceDeclarations>;
  notifyPluginMetadataChanged: () => void;
  refreshHealthSnapshot: (opts?: {
    probe?: boolean;
    includeSensitive?: boolean;
  }) => Promise<HealthSummary>; /** Durable cloud-worker lifecycle; absent from lightweight in-process contexts. */
  workerEnvironmentService?: WorkerEnvironmentServiceContract; /** Gateway-host desktop acquisition and observation; present only after enabled startup. */
  hostDesktopService?: HostDesktopService; /** Durable per-session worker placement; absent only from lightweight in-process contexts. */
  workerSessionPlacementService?: WorkerSessionPlacementReader & Partial<WorkerSessionPlacementRetirementService>; /** Process-local health samples fenced to the exact active placement owner. */
  workerPlacementDiskSpaceReader?: WorkerPlacementDiskSpaceReader; /** Use-time approval authority validation over the live run/worker owners. */
  validateAgentRuntimeApprovalAuthority?: AgentRuntimeApprovalAuthorityValidator; /** One-way local-to-worker dispatch; absent when cloud workers are disabled. */
  workerPlacementDispatchService?: WorkerPlacementDispatchContract;
  getRuntimeSnapshot: () => ChannelRuntimeSnapshot;
  getEventLoopHealth?: () => GatewayEventLoopHealth | undefined;
  getConfigReloaderHotReloadStatus?: () => GatewayHotReloadStatus | undefined;
  startChannel: (channel: ChannelId, accountId?: string, opts?: StartChannelOptions) => Promise<void>;
  stopChannel: (channel: ChannelId, accountId?: string) => Promise<void>;
  markChannelLoggedOut: (channelId: ChannelId, cleared: boolean, accountId?: string) => void;
  broadcastVoiceWakeChanged: (triggers: string[]) => void;
  broadcastVoiceWakeRoutingChanged: (config: VoiceWakeRoutingConfig) => void;
};
/** Complete runtime context available to gateway request handlers. */
type GatewayRequestContext = GatewayKernelContext & GatewayTransportContext & GatewayResidentBridgeContext;
/** Full dispatch context for raw request frames before params are normalized. */
type GatewayRequestOptions = {
  req: RequestFrame;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  methodRegistry?: GatewayMethodRegistryView; /** In-process caller lifetime; never serialized into a Gateway request frame. */
  signal?: AbortSignal;
};
/** Commit-time guard captured by the pre-dispatch session participation check. */
type SessionMutationAuthorization = {
  assertCurrent: () => void;
  assertTargetCurrent: (target: {
    sessionKey: string;
    agentId?: string;
  }) => void;
};
/** Normalized method invocation options passed to registered handlers. */
type GatewayRequestHandlerOptions = {
  req: RequestFrame;
  params: Record<string, unknown>;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  sessionMutationAuthorization?: SessionMutationAuthorization; /** In-process caller lifetime; absent for ordinary transport requests. */
  signal?: AbortSignal;
};
/** Single gateway method implementation. */
type GatewayRequestHandler = (opts: GatewayRequestHandlerOptions) => Promise<void> | void;
/** Registry fragment keyed by gateway protocol method name. */
type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;
//#endregion
export { MusicGenerationProvider as $, TalkEventType as $t, PluginToolMetadataRegistration as A, PluginJsonValue as At, RealtimeVoiceBargeInOptions as B, ReplyDispatchKind as Bt, PluginSessionAttachmentResult as C, PluginHookReplyPayloadSendingContext as Ct, PluginSessionTurnScheduleParams as D, PluginToolMatcher as Dt, PluginSessionSchedulerJobRegistration as E, PluginHookToolRequesterContext as Et, TtsDirectiveOverrides as F, PluginApprovalResolution as Ft, RealtimeVoiceProviderCapabilities as G, AgentInternalEvent as Gt, RealtimeVoiceBridgeCreateRequest as H, ReplyDispatcher as Ht, TtsDirectiveParseResult as I, PluginHookBeforeToolCallResult as It, RealtimeVoiceToolResultOptions as J, ThinkingCatalogEntry as Jt, RealtimeVoiceProviderConfig as K, ReasoningLevel as Kt, TranscriptSourceProvider$1 as L, CronRuntimeAuthority as Lt, SpeechModelOverridePolicy as M, PluginConversationBindingRequestParams as Mt, SpeechProviderConfig as N, PluginConversationBindingRequestResult as Nt, PluginSessionTurnUnscheduleByTagParams as O, PluginNextTurnInjection as Ot, SpeechVoiceOption as P, PluginConversationBindingResolvedEvent as Pt, MusicGenerationOutputFormat as Q, TalkBrain as Qt, RealtimeVoiceAgentConsultRunner as R, ReplyDispatchBeforeDeliver as Rt, PluginSessionAttachmentParams as S, PluginHookRegistrationOptions as St, PluginSessionSchedulerJobHandle as T, PluginHookToolKind as Tt, RealtimeVoiceBrowserSession as U, ReplyFollowupAdmissionBarrierTimeoutPolicy as Ut, RealtimeVoiceBridge as V, ReplyDispatchRuntimeInfo as Vt, RealtimeVoiceBrowserSessionCreateRequest as W, RuntimePluginToolGrant as Wt, MusicGenerationIgnoredOverride as X, LogLevel as Xt, GeneratedMusicAsset as Y, VerboseLevel as Yt, MusicGenerationNormalization as Z, DiagnosticTraceContext as Zt, PluginControlUiDescriptor as _, OperationalRunInstanceRef as _t, ImageGenerationProviderPlugin as a, SessionCatalogHost as at, PluginRuntimeLifecycleRegistration as b, PluginHookName as bt, RealtimeTranscriptionProviderPlugin as c, SessionsCatalogReadParams as ct, TranscriptSourceProvider as d, SecretInputMode as dt, TalkMode as en, MusicGenerationSourceImage as et, VideoGenerationProviderPlugin as f, GatewayMethodDescriptor as ft, PluginAgentEventSubscriptionRegistration as g, AdmittedRunContext as gt, PluginAgentEventEmitResult as h, ProviderCatalogOutcome as ht, GatewayRequestOptions as i, NodePluginToolDescriptor as it, PluginTrustedToolPolicyRegistration as j, PluginConversationBinding as jt, PluginSessionTurnUnscheduleByTagResult as k, PluginNextTurnInjectionEnqueueResult as kt, RealtimeVoiceProviderPlugin as l, SessionsCatalogReadResult as lt, PluginAgentEventEmitParams as m, ModelCatalogSnapshot as mt, GatewayRequestHandler as n, FailoverReason as nn, onAgentEvent as nt, MediaUnderstandingProviderPlugin as o, SessionsCatalogArchiveParams as ot, WorkerProvider as p, ModelCatalogEntry as pt, RealtimeVoiceTool as q, ThinkLevel as qt, GatewayRequestHandlers as r, CronCreatorAuthorityRunScope as rt, MusicGenerationProviderPlugin as s, SessionsCatalogContinueParams as st, GatewayRequestContext as t, TalkTransport as tn, OpenClawPluginNodeHostCommand as tt, SpeechProviderPlugin as u, SpawnResult as ut, PluginRunContextGetParams as v, PreparedAgentRunAdmission as vt, PluginSessionExtensionRegistration as w, PluginHookToolInputKind as wt, PluginSessionActionRegistration as x, PluginHookRegistration as xt, PluginRunContextPatch as y, PluginHookHandlerMap as yt, RealtimeVoiceAudioFormat as z, ReplyDispatchBeforeDeliverOptions as zt };