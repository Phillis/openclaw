import { D as GroupToolPolicyConfig, H as ReplyToMode, I as DmPolicy, L as DmScope, V as MarkdownTableMode, Y as ChatType, b as AgentBinding, n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { n as AgentTool, r as AgentToolResult } from "./types-BH0Q4SbZ.js";
import { E as RuntimeEnv, l as ChannelOwnedSetupContract, u as ChannelSetupAdapter } from "./manifest-registry-CHpEok17.js";
import { F as MessagePresentationButton, N as MessagePresentation, P as MessagePresentationAction, R as ReplyPayloadDeliveryPin, a as MsgContext, h as InboundEventKind, j as ReplyPayload, k as ReplyDeliveryContext } from "./templating-B3rf5Xpv.js";
import { n as ResolverContext, r as SecretDefaults, t as SecretTargetRegistryEntry } from "./target-registry-types-Dptnzkri.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { TSchema } from "typebox";

//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type ExecApprovalPolicyRule = {
  pattern: string;
  argPattern?: string;
  source?: "allow-always";
};
type ExecApprovalPolicySnapshot = {
  security: "deny" | "allowlist" | "full";
  ask: "off" | "on-miss" | "always";
  askFallback: "deny" | "allowlist" | "full";
  autoAllowSkills: boolean;
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
type SystemRunApprovalBinding = {
  argv: string[];
  cwd: string | null;
  agentId: string | null;
  sessionKey: string | null;
  envHash: string | null;
};
type SystemRunApprovalFileOperand = {
  argvIndex: number;
  path: string;
  sha256: string;
};
type SystemRunApprovalPlan = {
  argv: string[];
  cwd: string | null;
  commandText: string;
  commandPreview?: string | null;
  agentId: string | null;
  sessionKey: string | null;
  policySnapshot?: ExecApprovalPolicySnapshot;
  mutableFileOperand?: SystemRunApprovalFileOperand | null;
};
type ExecApprovalCommandSpan = {
  startIndex: number;
  endIndex: number;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  runId?: string | null;
  toolCallId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
type ExecApprovalRequest = {
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
//#endregion
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
//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile; /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
};
//#endregion
//#region src/polls.d.ts
type PollInput = {
  question: string;
  options: string[];
  maxSelections?: number;
  /**
   * Poll duration in seconds.
   * Channel-specific limits apply in each owning plugin.
   */
  durationSeconds?: number;
  /**
   * Poll duration in hours.
   * Used by channels that model duration in hours.
   */
  durationHours?: number;
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
//#region src/wizard/prompts.d.ts
type WizardSelectOption<T = string> = {
  value: T;
  label: string;
  hint?: string;
};
type WizardPromptNavigation = {
  canGoBack?: boolean;
  canGoForward?: boolean;
};
type WizardSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValue?: T;
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardMultiSelectParams<T = string> = {
  message: string;
  options: Array<WizardSelectOption<T>>;
  initialValues?: T[];
  searchable?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardTextParams = {
  message: string;
  initialValue?: string;
  placeholder?: string;
  validate?: (value: string) => string | undefined;
  signal?: AbortSignal;
  sensitive?: boolean;
  navigation?: WizardPromptNavigation;
};
type WizardConfirmParams = {
  message: string;
  initialValue?: boolean;
  layout?: "inline" | "vertical";
  navigation?: WizardPromptNavigation;
};
type WizardProgress = {
  update: (message: string) => void;
  stop: (message?: string) => void;
};
type WizardDeviceCodeParams = {
  title: string;
  code: string;
  expiresInMinutes?: number;
  message?: string;
};
type WizardPrompter = {
  intro: (title: string) => Promise<void>;
  outro: (message: string) => Promise<void>;
  note: (message: string, title?: string) => Promise<void>; /** Present a browser device code as structured UI when the client supports it. */
  deviceCode?: (params: WizardDeviceCodeParams) => Promise<void>;
  plain?: (message: string) => Promise<void>;
  select: <T>(params: WizardSelectParams<T>) => Promise<T>;
  multiselect: <T>(params: WizardMultiSelectParams<T>) => Promise<T[]>;
  text: (params: WizardTextParams) => Promise<string>;
  confirm: (params: WizardConfirmParams) => Promise<boolean>;
  progress: (label: string) => WizardProgress; /** Queue an explicit browser destination for the next interactive client step. */
  openUrl?: (url: string) => Promise<void>;
  disableBackNavigation?: () => void;
};
//#endregion
//#region src/channels/plugins/setup-group-access.d.ts
/**
 * Group access policy selected during channel setup.
 */
type ChannelAccessPolicy = "allowlist" | "open" | "disabled";
//#endregion
//#region src/config/legacy.shared.d.ts
type LegacyConfigRule = {
  path: string[];
  message: string;
  match?: (value: unknown, root: Record<string, unknown>) => boolean;
  requireSourceLiteral?: boolean;
};
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin";
//#endregion
//#region src/infra/plugin-approvals.d.ts
/** Button/action metadata shown with a plugin approval request. */
type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};
/** Request payload supplied by plugin approval callers. */
type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  detail?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  toolName?: string | null;
  toolCallId?: string | null;
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null; /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
/** Resolved plugin approval decision plus optional request snapshot. */
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
//#endregion
//#region src/channels/plugins/approval-native.types.d.ts
/**
 * Native channel surface that can receive approval prompts.
 */
type ChannelApprovalNativeSurface = "origin" | "approver-dm";
/**
 * Native channel destination for an approval prompt.
 */
type ChannelApprovalNativeTarget = {
  to: string;
  threadId?: string | number | null;
};
/**
 * Preferred native delivery surface for approval prompts.
 */
type ChannelApprovalNativeDeliveryPreference = ChannelApprovalNativeSurface | "both";
/**
 * Approval request shapes supported by native channel approval delivery.
 */
type ChannelApprovalNativeRequest = ExecApprovalRequest | PluginApprovalRequest;
/**
 * Capabilities returned by native channel approval delivery inspection.
 */
type ChannelApprovalNativeDeliveryCapabilities = {
  enabled: boolean;
  preferredSurface: ChannelApprovalNativeDeliveryPreference;
  supportsOriginSurface: boolean;
  supportsApproverDmSurface: boolean;
  notifyOriginWhenDmOnly?: boolean;
};
/**
 * Adapter implemented by channel plugins that support native approval delivery.
 */
type ChannelApprovalNativeAdapter = {
  describeDeliveryCapabilities: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeDeliveryCapabilities;
  resolveOriginTarget?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget | null | Promise<ChannelApprovalNativeTarget | null>;
  resolveApproverDmTargets?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    approvalKind: ChannelApprovalKind;
    request: ChannelApprovalNativeRequest;
  }) => ChannelApprovalNativeTarget[] | Promise<ChannelApprovalNativeTarget[]>;
};
//#endregion
//#region src/infra/approval-native-delivery.d.ts
/** One native approval delivery target selected by the channel adapter plan. */
type ChannelApprovalNativePlannedTarget = {
  surface: ChannelApprovalNativeSurface;
  target: ChannelApprovalNativeTarget;
  reason: "preferred" | "fallback";
};
//#endregion
//#region src/infra/approval-native-runtime-types.d.ts
/** Prepared delivery target plus the stable key used to avoid duplicate native messages. */
type PreparedChannelNativeApprovalTarget<TPreparedTarget> = {
  dedupeKey: string;
  target: TPreparedTarget;
};
//#endregion
//#region src/infra/approval-view-model.types.d.ts
type ApprovalPhase = "pending" | "resolved" | "expired";
/** Button or command action shown with a pending approval prompt. */
type ApprovalActionView = {
  kind?: "command" | "decision";
  decision: ExecApprovalDecision;
  label: string;
  style: NonNullable<MessagePresentationButton["style"]>;
  action?: MessagePresentationAction; /** Copyable command fallback for non-interactive surfaces. */
  command: string;
};
/** Label/value metadata row rendered with an approval prompt. */
type ApprovalMetadataView = {
  label: string;
  value: string;
};
type ApprovalViewBase = {
  approvalId: string;
  approvalKind: ChannelApprovalKind;
  phase: ApprovalPhase;
  title: string;
  description?: string | null;
  metadata: ApprovalMetadataView[];
};
/** Shared presentation fields for exec approval views across all phases. */
type ExecApprovalViewBase = ApprovalViewBase & {
  approvalKind: "exec";
  ask?: string | null;
  agentId?: string | null;
  warningText?: string | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandText: string;
  commandPreview?: string | null;
  cwd?: string | null;
  envKeys?: readonly string[];
  host?: string | null;
  nodeId?: string | null;
  sessionKey?: string | null;
};
/** Pending exec approval view, including executable reply actions. */
type ExecApprovalPendingView = ExecApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved exec approval view with the recorded decision. */
type ExecApprovalResolvedView = ExecApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired exec approval view without reply actions. */
type ExecApprovalExpiredView = ExecApprovalViewBase & {
  phase: "expired";
};
/** Shared presentation fields for plugin approval views across all phases. */
type PluginApprovalViewBase = ApprovalViewBase & {
  approvalKind: "plugin";
  agentId?: string | null;
  pluginId?: string | null;
  toolName?: string | null;
  severity: "info" | "warning" | "critical";
};
/** Pending plugin approval view, including executable reply actions. */
type PluginApprovalPendingView = PluginApprovalViewBase & {
  phase: "pending";
  actions: ApprovalActionView[];
  expiresAtMs: number;
};
/** Resolved plugin approval view with the recorded decision. */
type PluginApprovalResolvedView = PluginApprovalViewBase & {
  phase: "resolved";
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
};
/** Expired plugin approval view without reply actions. */
type PluginApprovalExpiredView = PluginApprovalViewBase & {
  phase: "expired";
};
/** Any pending approval view that still accepts a user decision. */
type PendingApprovalView = ExecApprovalPendingView | PluginApprovalPendingView;
/** Any approval view after a decision was recorded. */
type ResolvedApprovalView = ExecApprovalResolvedView | PluginApprovalResolvedView;
/** Any approval view after it can no longer be acted on. */
type ExpiredApprovalView = ExecApprovalExpiredView | PluginApprovalExpiredView;
//#endregion
//#region src/infra/exec-approval-channel-runtime.types.d.ts
/** Approval event families a channel-native approval runtime can subscribe to. */
type ExecApprovalChannelRuntimeEventKind = "exec" | "plugin";
//#endregion
//#region src/infra/approval-handler-runtime-types.d.ts
/** Union of approval request events a native approval handler can receive. */
type ApprovalRequest = ExecApprovalRequest | PluginApprovalRequest;
/** Union of approval resolution events a native approval handler can finalize. */
type ApprovalResolved = ExecApprovalResolved | PluginApprovalResolved;
/** Shared context passed to channel-native approval hooks. */
type ChannelApprovalCapabilityHandlerContext = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  gatewayUrl?: string;
  context?: unknown;
};
/** Result instruction for updating, deleting, clearing, or leaving a delivered approval entry. */
type ChannelApprovalNativeFinalAction<TPayload> = {
  kind: "update";
  payload: TPayload;
} | {
  kind: "delete";
} | {
  kind: "clear-actions";
} | {
  kind: "leave";
};
/** Availability gate for deciding whether a channel-native approval runtime can handle work. */
type ChannelApprovalNativeAvailabilityAdapter = {
  isConfigured: (params: ChannelApprovalCapabilityHandlerContext) => boolean;
  shouldHandle: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest; /** Payload-derived owner; channel adapters must not infer ownership from the id. */
    approvalKind: ChannelApprovalKind;
  }) => boolean;
};
/** Builds channel-native payloads for pending, resolved, and expired approval views. */
type ChannelApprovalNativePresentationAdapter<TPendingPayload = unknown, TFinalPayload = unknown> = {
  buildPendingPayload: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    nowMs: number;
    view: PendingApprovalView;
  }) => TPendingPayload | Promise<TPendingPayload>;
  buildResolvedResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    resolved: ApprovalResolved;
    view: ResolvedApprovalView;
    entry: unknown;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
  buildExpiredResult: (params: ChannelApprovalCapabilityHandlerContext & {
    request: ApprovalRequest;
    view: ExpiredApprovalView;
    entry: unknown;
  }) => ChannelApprovalNativeFinalAction<TFinalPayload> | Promise<ChannelApprovalNativeFinalAction<TFinalPayload>>;
};
type ChannelApprovalNativeTransportAdapterForView<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  prepareTarget: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => PreparedChannelNativeApprovalTarget<TPreparedTarget> | null | Promise<PreparedChannelNativeApprovalTarget<TPreparedTarget> | null>;
  deliverPending: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: TPreparedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => TPendingEntry | null | Promise<TPendingEntry | null>;
  updateEntry?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    payload: TFinalPayload;
    phase: "resolved" | "expired";
  }) => Promise<void>;
  deleteEntry?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    phase: "resolved" | "expired";
  }) => Promise<void>;
};
/** Transport hooks for preparing, delivering, updating, and deleting native approval entries. */
type ChannelApprovalNativeTransportAdapter<TPreparedTarget = unknown, TPendingEntry = unknown, TPendingPayload = unknown, TFinalPayload = unknown> = ChannelApprovalNativeTransportAdapterForView<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
type ChannelApprovalNativeInteractionAdapterForView<TPendingEntry = unknown, TBinding = unknown, TPendingPayload = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  bindPending?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => TBinding | null | Promise<TBinding | null>;
  unbindPending?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    binding: TBinding;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
  }) => Promise<void> | void;
  clearPendingActions?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    phase: "resolved" | "expired";
  }) => Promise<void>;
  cancelDelivered?: (params: ChannelApprovalCapabilityHandlerContext & {
    entry: TPendingEntry;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
  }) => Promise<void> | void;
};
/** Optional hooks for binding and clearing interactive approval controls. */
type ChannelApprovalNativeInteractionAdapter<TPendingEntry = unknown, TBinding = unknown> = ChannelApprovalNativeInteractionAdapterForView<TPendingEntry, TBinding>;
type ChannelApprovalNativeObserveAdapterForView<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown, TPendingView extends PendingApprovalView = PendingApprovalView> = {
  onDeliveryError?: (params: ChannelApprovalCapabilityHandlerContext & {
    error: unknown;
    plannedTarget: ChannelApprovalNativePlannedTarget;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => void;
  onDuplicateSkipped?: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
  }) => void;
  onDelivered?: (params: ChannelApprovalCapabilityHandlerContext & {
    plannedTarget: ChannelApprovalNativePlannedTarget;
    preparedTarget: PreparedChannelNativeApprovalTarget<TPreparedTarget>;
    request: ApprovalRequest;
    approvalKind: ChannelApprovalKind;
    view: TPendingView;
    pendingPayload: TPendingPayload;
    entry: TPendingEntry;
  }) => void;
};
/** Optional observer hooks for delivery errors, duplicates, and successful deliveries. */
type ChannelApprovalNativeObserveAdapter<TPreparedTarget = unknown, TPendingPayload = unknown, TPendingEntry = unknown> = ChannelApprovalNativeObserveAdapterForView<TPreparedTarget, TPendingPayload, TPendingEntry>;
/** Runtime adapter consumed by core after a plugin's strongly typed spec has been erased. */
type ChannelApprovalNativeRuntimeAdapter<TPendingPayload = unknown, TPreparedTarget = unknown, TPendingEntry = unknown, TBinding = unknown, TFinalPayload = unknown> = {
  eventKinds?: readonly ExecApprovalChannelRuntimeEventKind[];
  /**
   * Trusted legacy ownership override retained for compatibility.
   * @deprecated Omit this so core derives approval ownership from the request payload.
   */
  resolveApprovalKind?: (request: ApprovalRequest) => ChannelApprovalKind;
  availability: ChannelApprovalNativeAvailabilityAdapter;
  presentation: ChannelApprovalNativePresentationAdapter<TPendingPayload, TFinalPayload>;
  transport: ChannelApprovalNativeTransportAdapter<TPreparedTarget, TPendingEntry, TPendingPayload, TFinalPayload>;
  interactions?: ChannelApprovalNativeInteractionAdapter<TPendingEntry, TBinding>;
  observe?: ChannelApprovalNativeObserveAdapter;
};
//#endregion
//#region src/routing/resolve-route.d.ts
type RoutePeer = {
  kind: ChatType;
  id: string;
};
type ResolveAgentRouteInput = {
  cfg: OpenClawConfig;
  channel: string;
  accountId?: string | null;
  peer?: RoutePeer | null;
  dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer"; /** Parent peer for threads — used for binding inheritance when peer doesn't match directly. */
  parentPeer?: RoutePeer | null;
  guildId?: string | null;
  teamId?: string | null; /** Discord member role IDs — used for role-based agent routing. */
  memberRoleIds?: string[];
};
type ResolvedAgentRoute = {
  agentId: string;
  channel: string;
  accountId: string; /** Effective direct-message scope after a matching binding override. */
  dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer"; /** Internal session key used for persistence + concurrency. */
  sessionKey: string; /** Convenience alias for direct-chat collapse. */
  mainSessionKey: string; /** Which session should receive inbound last-route updates. */
  lastRoutePolicy: "main" | "session"; /** Match description for debugging/logging. */
  matchedBy: "binding.peer" | "binding.peer.parent" | "binding.peer.wildcard" | "binding.guild+roles" | "binding.guild" | "binding.team" | "binding.account" | "binding.channel" | "default";
};
declare function buildAgentSessionKey(params: {
  agentId: string;
  mainKey?: string;
  channel: string;
  accountId?: string | null;
  peer?: RoutePeer | null; /** DM session scope. */
  dmScope?: "main" | "per-peer" | "per-channel-peer" | "per-account-channel-peer";
  identityLinks?: Record<string, string[]>;
}): string;
declare function resolveAgentRoute(input: ResolveAgentRouteInput): ResolvedAgentRoute;
//#endregion
//#region src/channels/plugins/channel-runtime-surface.types.d.ts
/**
 * Channel runtime context registry types.
 *
 * Defines the public plugin SDK surface for channel runtime context registration and watches.
 */
type ChannelRuntimeContextKey = {
  channelId: string;
  accountId?: string | null;
  capability: string;
};
type ChannelRuntimeContextEvent = {
  type: "registered" | "unregistered";
  key: {
    channelId: string;
    accountId?: string;
    capability: string;
  };
  context?: unknown;
};
type ChannelRuntimeContextRegistry = {
  register: (params: ChannelRuntimeContextKey & {
    context: unknown;
    abortSignal?: AbortSignal;
  }) => {
    dispose: () => void;
  };
  get: <T = unknown>(params: ChannelRuntimeContextKey) => T | undefined;
  watch: (params: {
    channelId?: string;
    accountId?: string | null;
    capability?: string;
    onEvent: (event: ChannelRuntimeContextEvent) => void;
  }) => () => void;
};
/**
 * Minimal channel-runtime surface exported through the public plugin SDK.
 *
 * Gateway startup supplies the full plugin channel runtime, but external callers
 * may still type context-only helpers against this compatibility surface.
 */
type ChannelRuntimeSurface = {
  runtimeContexts: ChannelRuntimeContextRegistry;
  [key: string]: unknown;
};
//#endregion
//#region src/channels/plugins/config-write-policy-shared.d.ts
/**
 * Channel/account scope used to evaluate config write policy.
 */
type ConfigWriteScopeLike<TChannelId extends string = string> = {
  channelId?: TChannelId | null;
  accountId?: string | null;
};
/**
 * Target affected by a config write command.
 */
type ConfigWriteTargetLike<TChannelId extends string = string> = {
  kind: "global";
} | {
  kind: "channel";
  scope: {
    channelId: TChannelId;
  };
} | {
  kind: "account";
  scope: {
    channelId: TChannelId;
    accountId: string;
  };
} | {
  kind: "ambiguous";
  scopes: ConfigWriteScopeLike<TChannelId>[];
};
//#endregion
//#region src/channels/plugins/config-writes.d.ts
/**
 * Target affected by a channel config write.
 */
type ConfigWriteTarget = ConfigWriteTargetLike;
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
//#region packages/gateway-protocol/src/client-info.d.ts
/** Canonical client ids accepted in gateway hello/connect payloads. */
declare const GATEWAY_CLIENT_IDS: {
  readonly WEBCHAT_UI: "webchat-ui";
  readonly CONTROL_UI: "openclaw-control-ui";
  readonly BROWSER_COPILOT: "openclaw-browser-copilot";
  readonly TUI: "openclaw-tui";
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly GATEWAY_CLIENT: "gateway-client";
  readonly MACOS_APP: "openclaw-macos";
  readonly LINUX_APP: "openclaw-linux";
  readonly IOS_APP: "openclaw-ios";
  readonly WATCHOS_APP: "openclaw-watchos";
  readonly ANDROID_APP: "openclaw-android";
  readonly NODE_HOST: "node-host";
  readonly WORKER: "openclaw-worker";
  readonly TEST: "test";
  readonly FINGERPRINT: "fingerprint";
  readonly PROBE: "openclaw-probe";
};
/** Stable gateway client ids used on the wire during hello/connect handshakes. */
type GatewayClientId = (typeof GATEWAY_CLIENT_IDS)[keyof typeof GATEWAY_CLIENT_IDS];
/** Compatibility alias for internal callers that still use "name" terminology. */
type GatewayClientName = GatewayClientId;
/** Coarse modes let policy group clients without matching every product id. */
declare const GATEWAY_CLIENT_MODES: {
  readonly WEBCHAT: "webchat";
  readonly CLI: "cli";
  readonly UI: "ui";
  readonly BACKEND: "backend";
  readonly NODE: "node";
  readonly WORKER: "worker";
  readonly PROBE: "probe";
  readonly TEST: "test";
};
/** Coarse client category used for gateway policy and diagnostics. */
type GatewayClientMode = (typeof GATEWAY_CLIENT_MODES)[keyof typeof GATEWAY_CLIENT_MODES];
//#endregion
//#region src/channels/plugins/conversation-read-origin.d.ts
/**
 * Server-owned origin for one tool or message-action invocation.
 *
 * Missing and unknown values must remain delegated; callers must never derive
 * this from model arguments, provider parameters, config, or persisted state.
 */
type ConversationReadInvocationOrigin = "delegated" | "direct-operator";
//#endregion
//#region src/channels/plugins/message-action-names.d.ts
/**
 * Deliberately closed, core-owned vocabulary so every transport can render every action.
 * Plugins add names through a core PR; runtime registration is intentionally unsupported.
 */
declare const CHANNEL_MESSAGE_ACTION_NAMES: readonly ["send", "broadcast", "poll", "poll-vote", "react", "reactions", "read", "edit", "unsend", "reply", "sendWithEffect", "renameGroup", "setGroupIcon", "addParticipant", "removeParticipant", "leaveGroup", "sendAttachment", "delete", "pin", "unpin", "list-pins", "permissions", "thread-create", "thread-list", "thread-reply", "search", "sticker", "sticker-search", "member-info", "role-info", "emoji-list", "emoji-upload", "sticker-upload", "role-add", "role-remove", "channel-info", "channel-list", "channel-create", "channel-edit", "channel-delete", "channel-move", "category-create", "category-edit", "category-delete", "topic-create", "topic-edit", "voice-status", "event-list", "event-create", "timeout", "kick", "ban", "set-profile", "set-presence", "download-file", "upload-file"];
/**
 * Message action name union derived from the canonical action list.
 */
type ChannelMessageActionName$1 = (typeof CHANNEL_MESSAGE_ACTION_NAMES)[number];
//#endregion
//#region src/channels/plugins/message-capabilities.d.ts
/**
 * Channel message capabilities advertised through plugin discovery hooks.
 */
declare const CHANNEL_MESSAGE_CAPABILITIES: readonly ["presentation", "delivery-pin"];
/**
 * Message capability union derived from the canonical capability list.
 */
type ChannelMessageCapability = (typeof CHANNEL_MESSAGE_CAPABILITIES)[number];
//#endregion
//#region src/channels/plugins/legacy-state-migration.types.d.ts
type ChannelLegacyStateMigrationPlan = {
  kind: "copy" | "move";
  label: string;
  sourcePath: string;
  targetPath: string;
} | {
  kind: "plugin-state-import";
  label: string;
  sourcePath: string;
  targetPath: string;
  pluginId: string;
  namespace: string;
  maxEntries: number;
  defaultTtlMs?: number;
  scopeKey: string;
  stateDir?: string;
  cleanupSource?: "rename" | "remove";
  cleanupWhenEmpty?: boolean; /** Deletes a non-file legacy source (e.g. plugin-state rows) once all entries are covered. */
  removeSource?: () => void | Promise<void>;
  preview?: string;
  shouldReplaceExistingEntry?: (params: {
    key: string;
    existingValue: unknown;
    incomingValue: unknown;
  }) => boolean | Promise<boolean>;
  /**
   * `timestamp` (epoch ms) and `ttlMs` order entries newest-first when capacity forces a
   * partial import; `timestamp` is also persisted as the migrated row's creation time so
   * cap eviction keeps treating imported rows as old as their legacy source.
   */
  readEntries: () => Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }> | Promise<Array<{
    key: string;
    value: unknown;
    ttlMs?: number;
    timestamp?: number;
  }>>;
};
//#endregion
//#region src/channels/plugins/types.core.d.ts
type ChannelExposure = {
  configured?: boolean;
  setup?: boolean;
  docs?: boolean;
};
type ChannelOutboundTargetMode = "explicit" | "implicit" | "heartbeat";
/** Agent tool registered by a channel plugin. */
type ChannelAgentTool = AgentTool;
/** Lazy agent-tool factory used when tool availability depends on config. */
type ChannelAgentToolFactory = (params: {
  cfg?: OpenClawConfig;
}) => ChannelAgentTool[];
/**
 * Discovery-time inputs passed to channel action adapters when the core is
 * asking what an agent should be allowed to see. This is intentionally
 * smaller than execution context: it carries routing/account scope, but no
 * tool params or runtime handles.
 */
type ChannelMessageActionDiscoveryContext = {
  cfg: OpenClawConfig;
  currentChannelId?: string | null;
  currentChannelProvider?: string | null;
  currentThreadTs?: string | null;
  currentMessageId?: string | number | null;
  accountId?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  agentId?: string | null;
  requesterSenderId?: string | null;
  senderIsOwner?: boolean;
};
/**
 * Plugin-owned schema fragments for the shared `message` tool.
 * `current-channel` means expose the fields only when that provider is the
 * active runtime channel. `all-configured` keeps the fields visible even while
 * another configured channel is active, which is useful for cross-channel
 * sends from cron or isolated agents.
 */
type ChannelMessageToolSchemaContribution = {
  properties: Record<string, TSchema>;
  /**
   * Actions whose validation depends on this schema fragment. Cross-channel
   * discovery can hide only these actions when the fragment is current-channel
   * scoped. Omit to keep the legacy conservative behavior.
   */
  actions?: readonly ChannelMessageActionName[] | null;
  visibility?: "current-channel" | "all-configured";
};
type ChannelMessageToolMediaSourceParams = readonly string[] | Partial<Record<ChannelMessageActionName, readonly string[]>>;
type ChannelMessageToolDiscovery = {
  actions?: readonly ChannelMessageActionName[] | null;
  capabilities?: readonly ChannelMessageCapability[] | null;
  schema?: ChannelMessageToolSchemaContribution | ChannelMessageToolSchemaContribution[] | null;
  /**
   * Plugin-owned message-tool params that carry media sources.
   * Core uses this to derive sandbox path normalization and host media-access
   * hints without hardcoding plugin-specific param names. Prefer scoping keys
   * by action so unrelated actions do not inherit another action's media args.
   */
  mediaSourceParams?: ChannelMessageToolMediaSourceParams | null;
};
type ChannelStatusIssue = {
  channel: ChannelId;
  accountId: string;
  kind: "intent" | "permissions" | "config" | "auth" | "runtime";
  message: string;
  fix?: string;
};
type ChannelAccountState = "linked" | "not linked" | "configured" | "not configured" | "enabled" | "disabled";
type ChannelHeartbeatDeps = {
  webAuthExists?: () => Promise<boolean>;
  hasActiveWebListener?: (accountId?: string) => boolean;
};
/** User-facing metadata used in docs, pickers, and setup surfaces. */
type ChannelMeta = {
  id: ChannelId;
  label: string;
  selectionLabel: string;
  docsPath: string;
  docsLabel?: string;
  blurb: string;
  order?: number;
  aliases?: readonly string[];
  selectionDocsPrefix?: string;
  selectionDocsOmitLabel?: boolean;
  selectionExtras?: readonly string[];
  detailLabel?: string;
  systemImage?: string;
  markdownCapable?: boolean;
  exposure?: ChannelExposure;
  quickstartAllowFrom?: boolean;
  forceAccountBinding?: boolean;
  preferSessionLookupForAnnounceTarget?: boolean;
  preferOver?: readonly string[];
};
/** Snapshot row returned by channel status and lifecycle surfaces. */
type ChannelAccountSnapshot = {
  accountId: string;
  name?: string;
  enabled?: boolean;
  configured?: boolean;
  statusState?: string;
  linked?: boolean;
  running?: boolean;
  connected?: boolean;
  restartPending?: boolean;
  reconnectAttempts?: number; /** Slack Socket Mode's app-wide connection count from the latest hello frame. */
  socketModeConnectionCount?: number; /** Timestamp for the latest Socket Mode connection-count observation. */
  socketModeConnectionCountObservedAt?: number | null; /** True when the latest Socket Mode hello reported more than one connection. */
  socketModeSharedConnection?: boolean;
  lastConnectedAt?: number | null;
  lastDisconnect?: string | {
    at: number;
    status?: number;
    error?: string;
    loggedOut?: boolean;
  } | null;
  lastMessageAt?: number | null;
  lastEventAt?: number | null;
  lastTransportActivityAt?: number | null;
  stateReason?: string;
  lastError?: string | null;
  /**
   * Legacy channel-authored health label; channel plugins should publish `lifecycle` instead.
   * Core-derived policy writes remain supported. There is no removal date; removal awaits
   * external plugin adoption.
   */
  healthState?: string;
  /**
   * Recorded account lifecycle, independent of inferred transport health.
   * Optional so channels that never publish lifecycle remain unaffected.
   */
  lifecycle?: "starting" | "ready" | "recovering" | "blocked" | "stopped";
  /**
   * Inbound admission, which is a different failure domain from `connected`.
   * Optional-`true` on purpose: there is no `false` to mistake for "unknown",
   * so the 20+ channels that never report ingress at all stay unaffected.
   */
  ingressUnavailable?: true;
  terminalDisconnect?: boolean;
  lastStartAt?: number | null;
  lastStopAt?: number | null;
  lastInboundAt?: number | null;
  lastOutboundAt?: number | null;
  busy?: boolean;
  activeRuns?: number;
  lastRunActivityAt?: number | null;
  activeRunStartedAt?: number | null;
  mode?: string;
  dmPolicy?: string;
  allowFrom?: string[];
  tokenSource?: string;
  botTokenSource?: string;
  appTokenSource?: string;
  userTokenSource?: string;
  signingSecretSource?: string;
  tokenStatus?: string;
  botTokenStatus?: string;
  appTokenStatus?: string;
  signingSecretStatus?: string;
  userTokenStatus?: string;
  identity?: string;
  credentialSource?: string;
  secretSource?: string;
  audienceType?: string;
  audience?: string;
  webhookPath?: string;
  webhookUrl?: string;
  baseUrl?: string;
  allowUnmentionedGroups?: boolean;
  cliPath?: string | null;
  dbPath?: string | null;
  port?: number | null;
  probe?: unknown;
  lastProbeAt?: number | null;
  audit?: unknown;
  application?: unknown;
  bot?: unknown;
  publicKey?: string | null;
  profile?: unknown;
  channelAccessToken?: string;
  channelSecret?: string;
};
type ChannelLogSink = {
  info: (msg: string) => void;
  warn: (msg: string) => void;
  error: (msg: string) => void;
  debug?: (msg: string) => void;
};
type ChannelGroupContext = {
  cfg: OpenClawConfig;
  groupId?: string | null; /** Human label for channel-like group conversations (e.g. #general). */
  groupChannel?: string | null;
  groupSpace?: string | null;
  accountId?: string | null; /** Trusted host instruction to ignore toolsBySender for non-ingress work. */
  senderPolicyMode?: "always" | "never";
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
};
/** TTS voice delivery behavior advertised by a channel plugin. */
/**
 * Container tokens (file-extension shape, no leading dot) that the host
 * TTS pipeline knows how to pre-transcode synthesized audio into.
 * Channels that benefit from a specific container — currently only
 * iMessage, which needs Apple's native voice-memo CAF descriptor — name
 * one here. Adding a new entry requires extending the host transcoder
 * recipe table in lockstep so a typed declaration cannot silently no-op.
 */
type PreferredAudioFileFormat = "caf";
type ChannelTtsVoiceDeliveryCapabilities = {
  synthesisTarget: "audio-file" | "voice-note";
  transcodesAudio?: boolean;
  audioFileFormats?: readonly string[]; /** Voice notes can carry the final reply text as a visible caption. */
  captionedFinalText?: boolean;
  /**
   * Optional preferred audio container the channel wants for voice-memo
   * delivery. When set and the host can transcode (e.g. `afconvert` on
   * macOS), the TTS pipeline pre-encodes synthesized audio to this format
   * before handing it to the channel. Useful for channels (such as
   * iMessage) whose downstream attempts its own container conversion
   * that races against the upload write and fails.
   */
  preferAudioFileFormat?: PreferredAudioFileFormat;
};
/** Static capability flags advertised by a channel plugin. */
type ChannelCapabilities = {
  chatTypes: Array<ChatType | "thread">;
  polls?: boolean;
  reactions?: boolean;
  edit?: boolean;
  unsend?: boolean;
  reply?: boolean;
  effects?: boolean;
  groupManagement?: boolean;
  threads?: boolean;
  media?: boolean;
  tts?: {
    voice?: ChannelTtsVoiceDeliveryCapabilities;
  };
  nativeCommands?: boolean;
  blockStreaming?: boolean;
};
type ChannelSecurityDmPolicy = {
  policy: string;
  allowFrom?: Array<string | number> | null;
  policyPath?: string;
  allowFromPath: string;
  approveHint: string;
  normalizeEntry?: (raw: string) => string;
};
type ChannelSecurityContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedAccount;
};
type ChannelMentionAdapter = {
  stripRegexes?: (params: {
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => RegExp[];
  stripPatterns?: (params: {
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => string[];
  stripMentions?: (params: {
    text: string;
    ctx: MsgContext;
    cfg: OpenClawConfig | undefined;
    agentId?: string;
  }) => string;
};
type ChannelStreamingAdapter = {
  blockStreamingCoalesceDefaults?: {
    minChars: number;
    idleMs: number;
  };
};
type ChannelStructuredComponents = unknown[];
type ChannelCrossContextPresentationFactory = (params: {
  originLabel: string;
  message: string;
  cfg: OpenClawConfig;
  accountId?: string | null;
}) => MessagePresentation;
type ChannelReplyTransport = {
  replyToId?: string | null;
  threadId?: string | number | null;
};
type ChannelFocusedBindingContext = {
  conversationId: string;
  parentConversationId?: string;
  placement: "current" | "child";
  labelNoun: string;
};
type ChannelOutboundSessionRoute = {
  sessionKey: string;
  baseSessionKey: string; /** Route authority for explicit recipient session selection. */
  recipientSessionExact?: boolean | "direct-alias" | "delivery-identity";
  peer: {
    kind: ChatType;
    id: string;
  };
  chatType: "direct" | "group" | "channel";
  from: string;
  to: string;
  threadId?: string | number;
};
type ChannelThreadingAdapter = {
  /**
   * Where the transport keeps thread identity.
   * "address" (default): the thread is part of the routing address (own channel id, topic id
   * in the target tuple), fully known before send.
   * "message": thread identity lives on a message (e.g. Slack thread_ts) — replying to a
   * message enters its thread, and routes can discover a session-scoping thread only after
   * target lookup.
   */
  threadAddressing?: "address" | "message";
  matchesToolContextTarget?: (params: {
    target: string;
    toolContext: ChannelThreadingToolContext;
  }) => boolean;
  resolveReplyToMode?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    chatType?: string | null;
  }) => "off" | "first" | "all" | "batched";
  /**
   * When replyToMode is "off", allow explicit reply tags/directives to keep replyToId.
   *
   * Default in shared reply flow: true for known providers; per-channel opt-out supported.
   */
  allowExplicitReplyTagsWhenOff?: boolean;
  /**
   * @deprecated Use allowExplicitReplyTagsWhenOff.
   *
   * Deprecated alias for allowExplicitReplyTagsWhenOff.
   * Kept for compatibility with older plugin surfaces.
   */
  allowTagsWhenOff?: boolean;
  buildToolContext?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
    hasRepliedRef?: {
      value: boolean;
    };
  }) => ChannelThreadingToolContext | undefined;
  resolveAutoThreadId?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    to: string;
    toolContext?: ChannelThreadingToolContext;
    replyToId?: string | null;
  }) => string | undefined;
  resolveCurrentChannelId?: (params: {
    to: string;
    threadId?: string | number | null;
  }) => string | undefined;
  resolveReplyTransport?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    threadId?: string | number | null;
    replyToId?: string | null; /** True when replyToId came from an explicit payload target or reply tag. */
    replyToIsExplicit?: boolean;
    replyDelivery?: ReplyDeliveryContext;
  }) => ChannelReplyTransport | null;
  resolveFocusedBinding?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    context: ChannelThreadingContext;
  }) => ChannelFocusedBindingContext | null;
};
type ChannelThreadingContext = {
  Channel?: string;
  From?: string;
  To?: string;
  ChatType?: string;
  CurrentMessageId?: string | number; /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: MsgContext["ReplyToMode"];
  ReplyToId?: string;
  ReplyToIdFull?: string;
  ThreadLabel?: string;
  MessageThreadId?: string | number;
  TransportThreadId?: string | number; /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
};
type ChannelThreadingToolContext = {
  currentChannelId?: string; /** Trusted normalized conversation kind for the active inbound turn. */
  currentChatType?: ChatType; /** Routable messaging target when it differs from the platform-native channel id. */
  currentMessagingTarget?: string;
  currentGraphChannelId?: string;
  currentChannelProvider?: ChannelId;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  }; /** True when posting at the parent conversation root would leak a thread-originated reply. */
  sameChannelThreadRequired?: boolean;
  /**
   * When true, skip cross-context decoration (e.g., "[from X]" prefix).
   * Use this for direct tool invocations where the agent is composing a new message,
   * not forwarding/relaying a message from another conversation.
   */
  skipCrossContextDecoration?: boolean;
};
/** Channel-owned messaging helpers for target parsing, routing, and payload shaping. */
type ChannelMessagingAdapter = {
  /**
   * Provider prefixes accepted in explicit targets, including aliases not used
   * as channel-selection aliases. Core uses these to reject cross-channel
   * targets before plugin-specific normalization.
   */
  targetPrefixes?: readonly string[]; /** DM targets rebuilt from session keys require an explicit `user:` kind prefix. */
  directTargetStyle?: "user-prefixed"; /** Equality rule for ids carried by prefixed outbound targets. */
  targetIdComparison?: "case-sensitive" | "lowercase"; /** Bare numeric conversation/topic shorthand is valid for this channel. */
  numericTopicShorthand?: true;
  normalizeTarget?: (raw: string) => string | undefined;
  defaultMarkdownTableMode?: MarkdownTableMode;
  normalizeExplicitSessionKey?: (params: {
    sessionKey: string;
    ctx: MsgContext;
  }) => string | undefined;
  deriveLegacySessionChatType?: (sessionKey: string) => "direct" | "group" | "channel" | undefined;
  isLegacyGroupSessionKey?: (key: string) => boolean;
  canonicalizeLegacySessionKey?: (params: {
    key: string;
    agentId: string;
  }) => string | null | undefined;
  resolveLegacyGroupSessionKey?: (ctx: MsgContext) => {
    key: string;
    channel: string;
    id: string;
    chatType: "group" | "channel";
  } | null;
  resolveInboundAttachmentRoots?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  resolveRemoteInboundAttachmentRoots?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  /**
   * Bundled plugins that need inbound conversation resolution before runtime
   * bootstrap can mirror it through a top-level `thread-binding-api.ts` surface.
   */
  resolveInboundConversation?: (params: {
    from?: string;
    to?: string;
    conversationId?: string;
    threadId?: string | number;
    threadParentId?: string | number;
    isGroup: boolean;
  }) => {
    conversationId?: string;
    parentConversationId?: string;
  } | null;
  resolveDeliveryTarget?: (params: {
    conversationId: string;
    parentConversationId?: string;
  }) => {
    to?: string;
    threadId?: string;
  } | null;
  /**
   * Canonical plugin-owned session conversation grammar.
   * Use this when the provider encodes thread or scoped-conversation semantics
   * inside `rawId` (for example Telegram topics or Feishu sender scopes).
   * Return `baseConversationId` and `parentConversationCandidates` here when
   * you can so parsing and inheritance stay in one place.
   * `parentConversationCandidates`, when present, should be ordered from the
   * narrowest parent to the broadest/base conversation.
   * Bundled plugins that need the same grammar before runtime bootstrap can
   * mirror this contract through a top-level `session-key-api.ts` surface.
   */
  resolveSessionConversation?: (params: {
    kind: "group" | "channel";
    rawId: string;
  }) => {
    id: string;
    threadId?: string | null;
    baseConversationId?: string | null;
    parentConversationCandidates?: string[];
  } | null;
  /**
   * @deprecated Return parentConversationCandidates from resolveSessionConversation.
   *
   * Legacy compatibility hook for parent fallbacks when a plugin does not need
   * to customize `id` or `threadId`. Core only uses this when
   * `resolveSessionConversation(...)` does not return
   * `parentConversationCandidates`.
   */
  resolveParentConversationCandidates?: (params: {
    kind: "group" | "channel";
    rawId: string;
  }) => string[] | null;
  resolveSessionTarget?: (params: {
    kind: "group" | "channel";
    id: string;
    threadId?: string | null;
  }) => string | undefined;
  /**
   * @deprecated Use `targetResolver` for target id normalization and
   * `resolveOutboundSessionRoute` for session/thread identity. This remains for
   * compatibility with older route parsing helpers.
   */
  parseExplicitTarget?: (params: {
    raw: string;
  }) => {
    to: string;
    threadId?: string | number;
    chatType?: ChatType;
  } | null;
  /**
   * Lightweight chat-type inference used before directory lookup so plugins can
   * steer peer-vs-group resolution without reimplementing host search flow.
   */
  inferTargetChatType?: (params: {
    to: string;
  }) => ChatType | undefined;
  /**
   * Preserve the session thread/topic id for heartbeat replies when that thread
   * is part of the destination identity, not a transient reply thread.
   */
  preserveHeartbeatThreadIdForGroupRoute?: boolean;
  buildCrossContextPresentation?: ChannelCrossContextPresentationFactory;
  transformReplyPayload?: (params: {
    payload: ReplyPayload;
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => ReplyPayload | null;
  hasStructuredReplyPayload?: (params: {
    payload: ReplyPayload;
  }) => boolean;
  targetResolver?: {
    looksLikeId?: (raw: string, normalized?: string) => boolean;
    hint?: string; /** Bare words that are command/session references for this channel, not literal destinations. */
    reservedLiterals?: readonly string[];
    /**
     * Plugin-owned fallback for explicit/native targets or post-directory-miss
     * resolution. This should complement directory lookup, not duplicate it.
     */
    resolveTarget?: (params: {
      cfg: OpenClawConfig;
      accountId?: string | null;
      input: string;
      normalized: string;
      preferredKind?: ChannelDirectoryEntryKind | "channel";
    }) => Promise<{
      to: string;
      kind: ChannelDirectoryEntryKind | "channel";
      display?: string;
      source?: "normalized" | "directory";
    } | null>;
  };
  formatTargetDisplay?: (params: {
    target: string;
    display?: string;
    kind?: ChannelDirectoryEntryKind;
  }) => string;
  /**
   * Provider-specific session-route builder used after target resolution.
   * Keep session-key orchestration in core and channel-native routing rules here.
   * Set `recipientSessionExact` to true only when the target maps unambiguously
   * to the same canonical session that inbound delivery uses. `direct-alias`
   * may be used when only the direct chat kind is authoritative.
   * `delivery-identity` requires a stable outbound-only recipient identity and
   * a provider-keyed session that stays isolated from the agent main session.
   */
  resolveOutboundSessionRoute?: (params: {
    cfg: OpenClawConfig;
    agentId: string;
    accountId?: string | null;
    target: string;
    currentSessionKey?: string;
    resolvedTarget?: {
      to: string;
      kind: ChannelDirectoryEntryKind | "channel";
      display?: string;
      source: "normalized" | "directory";
    };
    replyToId?: string | null;
    threadId?: string | number | null;
  }) => ChannelOutboundSessionRoute | Promise<ChannelOutboundSessionRoute | null> | null;
};
type ChannelAgentPromptAdapter = {
  messageToolHints?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[];
  messageToolCapabilities?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string[] | undefined;
  inboundFormattingHints?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    text_markup: string;
    rules: string[];
  } | undefined;
  reactionGuidance?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    level: "minimal" | "extensive";
    channelLabel?: string;
  } | undefined;
};
type ChannelDirectoryEntryKind = "user" | "group" | "channel";
type ChannelDirectoryEntry = {
  kind: ChannelDirectoryEntryKind;
  id: string;
  name?: string;
  handle?: string;
  avatarUrl?: string;
  rank?: number;
  raw?: unknown;
};
type ChannelMessageActionName = ChannelMessageActionName$1;
/** Execution context passed to channel-owned actions on the shared `message` tool. */
type ChannelMessageActionContext = {
  channel: ChannelId;
  action: ChannelMessageActionName;
  cfg: OpenClawConfig;
  params: Record<string, unknown>;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  accountId?: string | null; /** Trusted originating account id paired with requesterSenderId. */
  requesterAccountId?: string | null;
  /**
   * Trusted sender id from inbound context. This is server-injected and must
   * never be sourced from tool/model-controlled params.
   */
  requesterSenderId?: string | null; /** Trusted owner identity bit from command/channel-action auth. */
  senderIsOwner?: boolean;
  /**
   * Server-owned origin for this operation. Missing values are delegated.
   * Plugins must use it only for conversation-read visibility policy.
   */
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  sessionKey?: string | null;
  sessionId?: string | null;
  inboundEventKind?: InboundEventKind;
  agentId?: string | null;
  gateway?: {
    url?: string;
    token?: string;
    timeoutMs?: number;
    clientName: GatewayClientName;
    clientDisplayName?: string;
    mode: GatewayClientMode;
  };
  toolContext?: ChannelThreadingToolContext;
  dryRun?: boolean;
  gatewayClientScopes?: readonly string[];
};
type ChannelToolSend = {
  to: string;
  accountId?: string | null;
  threadId?: string | null; /** True when the native provider send may inherit the active conversation thread. */
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
};
type ChannelMessagePreparedSendPayloadContext = {
  ctx: ChannelMessageActionContext;
  to: string;
  payload: ReplyPayload;
  replyToId?: string | null; /** Preserve caller intent when plugins translate reply ids into durable payloads. */
  replyToIdSource?: "explicit" | "implicit";
  threadId?: string | number | null;
};
/** Channel-owned action surface for the shared `message` tool. */
type ChannelMessageActionAdapter = {
  /**
   * Unified discovery surface for the shared `message` tool.
   * This returns the scoped actions,
   * capabilities, schema fragments, and any plugin-owned media-source params
   * together so they cannot drift.
   */
  describeMessageTool: (params: ChannelMessageActionDiscoveryContext) => ChannelMessageToolDiscovery | null | undefined;
  supportsAction?: (params: {
    action: ChannelMessageActionName;
  }) => boolean;
  resolveExecutionMode?: (params: {
    action: ChannelMessageActionName;
  }) => "local" | "gateway";
  resolveCliActionRequest?: (params: {
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
  }) => {
    action: ChannelMessageActionName;
    args: Record<string, unknown>;
  };
  messageActionTargetAliases?: Partial<Record<ChannelMessageActionName, {
    aliases: string[]; /** Alias fields that identify the destination conversation, not an existing message. */
    deliveryTargetAliases?: string[]; /** Convert typed owner fields such as chatId into the canonical shared target shape. */
    resolveDeliveryTarget?: (params: {
      args: Record<string, unknown>;
    }) => string | undefined;
    /**
     * Prove that provider-native aliases name the trusted current conversation.
     * Core consults this only for host-owned bundled registrations.
     */
    matchesCurrentConversation?: (params: {
      args: Record<string, unknown>;
      accountId: string;
      toolContext: ChannelThreadingToolContext;
    }) => boolean;
  }>>;
  requiresTrustedRequesterSender?: (params: {
    action: ChannelMessageActionName;
    toolContext?: ChannelThreadingToolContext;
  }) => boolean; /** Return true when a provider-native tool invocation has a visible or destructive side effect. */
  isToolDeliveryAction?: (params: {
    args: Record<string, unknown>;
  }) => boolean;
  extractToolSend?: (params: {
    args: Record<string, unknown>;
  }) => ChannelToolSend | null; /** Recover the actual resolved send route from a successful action result. */
  extractToolSendResult?: (params: {
    result: unknown;
    send: ChannelToolSend;
  }) => ChannelToolSend | null;
  /**
   * Translate generic `message(action=send)` arguments into the payload core
   * should persist, retry, recover, and ack. Return null to keep the legacy
   * plugin-owned action path for sends that cannot be represented durably.
   */
  prepareSendPayload?: (params: ChannelMessagePreparedSendPayloadContext) => ReplyPayload | null | undefined | Promise<ReplyPayload | null | undefined>;
  /**
   * Prefer this for channel-specific poll semantics or extra poll parameters.
   * Core only parses the shared poll model when falling back to `outbound.sendPoll`.
   */
  handleAction?: (ctx: ChannelMessageActionContext) => Promise<AgentToolResult<unknown>>;
};
type ChannelPollResult = {
  messageId: string;
  toJid?: string;
  channelId?: string;
  conversationId?: string;
  pollId?: string;
};
/** Shared poll input after core has normalized the common poll model. */
type ChannelPollContext = {
  cfg: OpenClawConfig;
  to: string;
  poll: PollInput;
  accountId?: string | null;
  threadId?: string | null;
  silent?: boolean;
  isAnonymous?: boolean;
  gatewayClientScopes?: readonly string[]; /** @internal Refresh durable timing before recipient-visible platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
};
/** Minimal base for all channel probe results. Channel-specific probes extend this. */
type BaseProbeResult<TError = string | null> = {
  ok: boolean;
  error?: TError;
};
/** Minimal base for token resolution results. */
type BaseTokenResolution = {
  token: string;
  source: string;
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
//#region src/channels/plugins/outbound.types.d.ts
type ChannelOutboundContext = {
  cfg: OpenClawConfig;
  to: string;
  text: string;
  mediaUrl?: string;
  audioAsVoice?: boolean;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  gifPlayback?: boolean; /** Send image, GIF, or video as document to avoid channel compression. */
  forceDocument?: boolean;
  replyToId?: string | null;
  replyToIdSource?: "explicit" | "implicit";
  replyToMode?: ReplyToMode;
  formatting?: OutboundDeliveryFormattingOptions;
  threadId?: string | number | null;
  accountId?: string | null;
  identity?: OutboundIdentity;
  deps?: OutboundSendDeps;
  silent?: boolean;
  gatewayClientScopes?: readonly string[]; /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string; /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number; /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number; /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string; /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>; /** @internal Report each completed platform sub-send before starting another fallible step. */
  onDeliveryResult?: (result: OutboundDeliveryResult) => Promise<void> | void;
};
type ChannelOutboundPayloadContext = ChannelOutboundContext & {
  payload: ReplyPayload;
};
type ChannelPresentationCapabilities = {
  /** Whether the channel accepts structured presentation payloads at all. */supported?: boolean; /** Whether the channel can render button action blocks natively. */
  buttons?: boolean; /** Whether the channel can render select/menu blocks natively. */
  selects?: boolean; /** Whether the channel can render low-emphasis context blocks natively. */
  context?: boolean; /** Whether the channel can render divider blocks natively. */
  divider?: boolean; /** Whether the channel can render chart blocks natively. */
  charts?: boolean; /** Whether the channel can render table blocks natively. */
  tables?: boolean; /** Per-channel limits used to adapt portable presentation blocks before rendering. */
  limits?: {
    actions?: {
      /** Maximum total button/select actions in one message. */maxActions?: number; /** Maximum buttons per rendered action row. */
      maxActionsPerRow?: number; /** Maximum action rows in one message. */
      maxRows?: number; /** Maximum user-visible button label length. */
      maxLabelLength?: number; /** Maximum callback/action value size in UTF-8 bytes. */
      maxValueBytes?: number; /** Whether action styles such as primary or danger are preserved. */
      supportsStyles?: boolean; /** Whether disabled button state is preserved. */
      supportsDisabled?: boolean; /** Whether priority/layout hints affect native rendering. */
      supportsLayoutHints?: boolean;
    };
    selects?: {
      /** Maximum options in one select/menu block. */maxOptions?: number; /** Maximum user-visible option label length. */
      maxLabelLength?: number; /** Maximum option callback value size in UTF-8 bytes. */
      maxValueBytes?: number;
    };
    text?: {
      /** Maximum text length for title, text, and context blocks. */maxLength?: number; /** Unit used by maxLength. Defaults to Unicode code points. */
      encoding?: "characters" | "utf8-bytes" | "utf16-units"; /** Markdown dialect understood by rendered text blocks. */
      markdownDialect?: "plain" | "markdown" | "html" | "slack-mrkdwn" | "discord-markdown"; /** Whether the channel can edit presentation text in-place. */
      supportsEdit?: boolean;
    };
  };
};
type ChannelDeliveryCapabilities = {
  pin?: boolean;
  durableFinal?: {
    text?: boolean;
    media?: boolean;
    poll?: boolean;
    payload?: boolean;
    silent?: boolean;
    replyTo?: boolean;
    thread?: boolean;
    nativeQuote?: boolean;
    messageSendingHooks?: boolean;
    batch?: boolean;
    reconcileUnknownSend?: boolean;
    afterSendSuccess?: boolean;
    afterCommit?: boolean;
  };
};
type ChannelOutboundPayloadHint = {
  kind: "approval-pending";
  approvalKind: "exec" | "plugin";
  nativeRouteActive?: boolean;
} | {
  kind: "approval-resolved";
  approvalKind: "exec" | "plugin";
};
type ChannelOutboundTargetRef = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
};
type ChannelOutboundFormattedContext = ChannelOutboundContext & {
  abortSignal?: AbortSignal;
};
type ChannelOutboundChunkContext = {
  formatting?: OutboundDeliveryFormattingOptions;
};
type ChannelOutboundNormalizePayloadParams = {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundNormalizePayloadBatchParams = {
  payloads: readonly {
    index: number;
    payload: ReplyPayload;
  }[];
  cfg: OpenClawConfig;
  accountId?: string | null;
};
type ChannelOutboundAdapter = {
  deliveryMode: "direct" | "gateway" | "hybrid";
  chunker?: ((text: string, limit: number, ctx?: ChannelOutboundChunkContext) => string[]) | null;
  chunkerMode?: "text" | "markdown";
  chunkedTextFormatting?: OutboundDeliveryFormattingOptions; /** Lift remote Markdown image syntax in text into outbound media attachments. */
  extractMarkdownImages?: boolean; /** Preserve model-authored Markdown details blocks for a native channel renderer. */
  preserveMarkdownDetails?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => boolean;
  textChunkLimit?: number;
  /**
   * Reserve the exact provider id used by the next single-message send.
   * Presence opts the channel into conversations_turn reply correlation.
   */
  prepareConversationTurnMessageId?: (params: {
    cfg: OpenClawConfig;
    to: string;
    text: string;
    accountId?: string | null;
    threadId?: string | number | null;
  }) => string;
  sanitizeText?: (params: {
    text: string;
    payload: ReplyPayload;
    cfg?: OpenClawConfig;
    accountId?: string;
  }) => string;
  pollMaxOptions?: number;
  supportsPollDurationSeconds?: boolean;
  supportsAnonymousPolls?: boolean;
  normalizePayload?: (params: ChannelOutboundNormalizePayloadParams) => ReplyPayload | null; /** Normalize an ordered batch in place. Return one entry per input; null suppresses that send. */
  normalizePayloadBatch?: (params: ChannelOutboundNormalizePayloadBatchParams) => ReadonlyArray<ReplyPayload | null>;
  sendTextOnlyErrorPayloads?: boolean;
  shouldSkipPlainTextSanitization?: (params: {
    payload: ReplyPayload;
  }) => boolean;
  resolveEffectiveTextChunkLimit?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    fallbackLimit?: number;
  }) => number | undefined;
  shouldSuppressLocalPayloadPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => boolean;
  beforeDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    hint?: ChannelOutboundPayloadHint;
  }) => Promise<void> | void;
  afterDeliverPayload?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    payload: ReplyPayload;
    results: readonly OutboundDeliveryResult[];
  }) => Promise<void> | void; /** Adopt a provider-created thread for later payloads in the same durable batch. */
  adoptTargetFromDelivery?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    result: OutboundDeliveryResult;
  }) => {
    threadId: string | number;
  } | null | undefined; /** Channel-advertised presentation features and limits used by core adaptation. */
  presentationCapabilities?: ChannelPresentationCapabilities;
  /**
   * Account- and formatting-aware capability resolution; takes precedence over
   * the static declaration. Formatting is the delivery's outbound formatting
   * options, so capabilities that only apply to one text funnel (for example
   * rich tables on the markdown path) can turn off for HTML-mode sends.
   */
  resolvePresentationCapabilities?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    formatting?: OutboundDeliveryFormattingOptions;
  }) => ChannelPresentationCapabilities;
  deliveryCapabilities?: ChannelDeliveryCapabilities; /** Render an adapted portable presentation into channel-native payload data. */
  renderPresentation?: (params: {
    payload: ReplyPayload;
    presentation: MessagePresentation;
    ctx: ChannelOutboundPayloadContext;
  }) => Promise<ReplyPayload | null> | ReplyPayload | null;
  pinDeliveredMessage?: (params: {
    cfg: OpenClawConfig;
    target: ChannelOutboundTargetRef;
    messageId: string;
    pin: ReplyPayloadDeliveryPin;
    gatewayClientScopes?: readonly string[];
  }) => Promise<void> | void;
  /**
   * @deprecated Use shouldTreatDeliveredTextAsVisible instead.
   */
  shouldTreatRoutedTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  shouldTreatDeliveredTextAsVisible?: (params: {
    kind: "tool" | "block" | "final";
    text?: string;
  }) => boolean;
  preferFinalAssistantVisibleText?: boolean;
  targetsMatchForReplySuppression?: (params: {
    originTarget: string;
    targetKey: string;
    targetThreadId?: string;
  }) => boolean;
  resolveTarget?: (params: {
    cfg?: OpenClawConfig;
    to?: string;
    allowFrom?: string[];
    accountId?: string | null;
    mode?: ChannelOutboundTargetMode;
  }) => {
    ok: true;
    to: string;
  } | {
    ok: false;
    error: Error;
  };
  sendPayload?: (ctx: ChannelOutboundPayloadContext) => Promise<OutboundDeliveryResult>;
  sendFormattedText?: (ctx: ChannelOutboundFormattedContext) => Promise<OutboundDeliveryResult[]>;
  sendFormattedMedia?: (ctx: ChannelOutboundFormattedContext & {
    mediaUrl: string;
  }) => Promise<OutboundDeliveryResult>;
  sendText?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendMedia?: (ctx: ChannelOutboundContext) => Promise<OutboundDeliveryResult>;
  sendPoll?: (ctx: ChannelPollContext) => Promise<ChannelPollResult>;
};
//#endregion
//#region src/channels/plugins/pairing.types.d.ts
/**
 * Channel pairing hooks used by setup and allowlist approval flows.
 */
type ChannelPairingAdapter = {
  idLabel: string;
  normalizeAllowEntry?: (entry: string) => string; /** Derive the persisted approval entry from the locally issued request. */
  resolveApprovalStoreEntry?: (request: {
    id: string;
    meta?: Record<string, string>;
  }) => string | null | undefined;
  notifyApproval?: (params: {
    cfg: OpenClawConfig;
    id: string;
    accountId?: string;
    meta?: Record<string, string>;
    runtime?: RuntimeEnv;
  }) => Promise<void>;
};
//#endregion
//#region src/channels/plugins/types.adapters.d.ts
type ConfiguredBindingRule = AgentBinding;
type ChannelActionAvailabilityState = {
  kind: "enabled";
} | {
  kind: "disabled";
} | {
  kind: "unsupported";
};
type ChannelApprovalForwardTarget = {
  channel: string;
  to: string;
  accountId?: string | null;
  threadId?: string | number | null;
  source?: "session" | "target";
};
type ChannelCapabilitiesDisplayTone = "default" | "muted" | "success" | "warn" | "error";
type ChannelCapabilitiesDisplayLine = {
  text: string;
  tone?: ChannelCapabilitiesDisplayTone;
};
type ChannelCapabilitiesDiagnostics = {
  lines?: ChannelCapabilitiesDisplayLine[];
  details?: Record<string, unknown>;
};
type ChannelAdapterCallback<T extends (...args: never[]) => unknown> = T;
type ChannelAccountLinkState = "linked" | "not-linked" | "unknown";
type ChannelConfigAdapter<ResolvedAccount> = {
  listAccountIds: (cfg: OpenClawConfig) => string[];
  resolveAccount: (cfg: OpenClawConfig, accountId?: string | null) => ResolvedAccount;
  inspectAccount?: (cfg: OpenClawConfig, accountId?: string | null) => unknown;
  defaultAccountId?: (cfg: OpenClawConfig) => string;
  setAccountEnabled?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    enabled: boolean;
  }) => OpenClawConfig;
  deleteAccount?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig;
  isEnabled?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => boolean>;
  disabledReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  isConfigured?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => boolean | Promise<boolean>>;
  isLinked?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountLinkState | Promise<ChannelAccountLinkState>>;
  unconfiguredReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  unlinkedReason?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => string>;
  describeAccount?: ChannelAdapterCallback<(account: ResolvedAccount, cfg: OpenClawConfig) => ChannelAccountSnapshot>;
  resolveAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
  formatAllowFrom?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    allowFrom: Array<string | number>;
  }) => string[];
  hasConfiguredState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  hasPersistedAuthState?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
  }) => boolean;
  resolveDefaultTo?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => string | undefined;
};
type ChannelSecretsAdapter = {
  secretTargetRegistryEntries?: readonly SecretTargetRegistryEntry[];
  unsupportedSecretRefSurfacePatterns?: readonly string[];
  collectUnsupportedSecretRefConfigCandidates?: (raw: unknown) => Array<{
    path: string;
    value: unknown;
  }>;
  collectRuntimeConfigAssignments?: (params: {
    config: OpenClawConfig;
    defaults: SecretDefaults | undefined;
    context: ResolverContext;
  }) => void;
};
type ChannelGroupAdapter = {
  resolveRequireMention?: (params: ChannelGroupContext) => boolean | undefined;
  resolveToolPolicy?: (params: ChannelGroupContext) => GroupToolPolicyConfig | undefined;
};
type ChannelStatusAdapter<ResolvedAccount, Probe = unknown, Audit = unknown> = {
  defaultRuntime?: ChannelAccountSnapshot;
  buildChannelSummary?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    defaultAccountId: string;
    snapshot: ChannelAccountSnapshot;
  }) => Record<string, unknown> | Promise<Record<string, unknown>>>;
  probeAccount?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
  }) => Promise<Probe>>;
  formatCapabilitiesProbe?: ChannelAdapterCallback<(params: {
    probe: Probe;
  }) => ChannelCapabilitiesDisplayLine[]>;
  auditAccount?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
  }) => Promise<Audit>>;
  buildCapabilitiesDiagnostics?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    timeoutMs: number;
    cfg: OpenClawConfig;
    probe?: Probe;
    audit?: Audit;
    target?: string;
  }) => Promise<ChannelCapabilitiesDiagnostics | undefined>>;
  buildAccountSnapshot?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime?: ChannelAccountSnapshot;
    probe?: Probe;
    audit?: Audit;
  }) => ChannelAccountSnapshot | Promise<ChannelAccountSnapshot>>;
  logSelfId?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
    includeChannelPrefix?: boolean;
  }) => void>;
  resolveAccountState?: ChannelAdapterCallback<(params: {
    account: ResolvedAccount;
    cfg: OpenClawConfig;
    configured: boolean;
    enabled: boolean;
  }) => ChannelAccountState>;
  collectStatusIssues?: (accounts: ChannelAccountSnapshot[]) => ChannelStatusIssue[];
};
type ChannelGatewayContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  abortSignal: AbortSignal;
  log?: ChannelLogSink;
  getStatus: () => ChannelAccountSnapshot;
  setStatus: (next: ChannelAccountSnapshot) => void; /** Clear cached outbound directory lookups after the channel accepts newer directory data. */
  invalidateDirectoryCache?: () => void;
  /**
   * Optional channel runtime helpers for external channel plugins.
   *
   * This field provides the canonical channel runtime helpers for channel
   * dispatch, routing, session, reply, and startup context work.
   *
   * ## Available Features
   *
   * - **reply**: AI response dispatching, formatting, and delivery
   * - **routing**: Agent route resolution and matching
   * - **text**: Text chunking, markdown processing, and control command detection
   * - **session**: Session management and metadata tracking
   * - **media**: Remote media fetching and buffer saving
   * - **commands**: Command authorization and control command handling
   * - **groups**: Group policy resolution and mention requirements
   * - **pairing**: Channel pairing and allow-from management
   *
   * ## Use Cases
   *
   * Channel plugins that need:
   * - AI-powered response generation and delivery
   * - Advanced text processing and formatting
   * - Session tracking and management
   * - Agent routing and policy resolution
   *
   * ## Example
   *
   * ```typescript
   * const emailGatewayAdapter: ChannelGatewayAdapter<EmailAccount> = {
   *   startAccount: async (ctx) => {
   *     // Check availability (for backward compatibility)
   *     if (!ctx.channelRuntime) {
   *       ctx.log?.warn?.("channelRuntime not available - skipping AI features");
   *       return;
   *     }
   *
   *     // Use AI dispatch
   *     await ctx.channelRuntime.reply.dispatchReplyWithBufferedBlockDispatcher({
   *       ctx: { ... },
   *       cfg: ctx.cfg,
   *       dispatcherOptions: {
   *         deliver: async (payload) => {
   *           // Send reply via email
   *         },
   *       },
   *     });
   *   },
   * };
   * ```
   *
   * ## Backward Compatibility
   *
   * - This field is **optional** - channels that don't need it can ignore it
   * - Gateway startup passes a full `createPluginRuntime().channel` surface
   *   when a runtime resolver is configured
   * - External plugins should check for undefined before using
   *
   * @since Plugin SDK 2026.2.19
   * @see {@link https://docs.openclaw.ai/plugins/building-plugins | Plugin SDK documentation}
   */
  channelRuntime?: ChannelRuntimeSurface;
};
type ChannelLogoutResult = {
  cleared: boolean;
  loggedOut?: boolean;
  [key: string]: unknown;
};
type ChannelLoginWithQrStartResult = {
  qrDataUrl?: string;
  message: string;
  connected?: boolean;
};
type ChannelLoginWithQrWaitResult = {
  connected: boolean;
  message: string;
  qrDataUrl?: string;
};
type ChannelLogoutContext<ResolvedAccount = unknown> = {
  cfg: OpenClawConfig;
  accountId: string;
  account: ResolvedAccount;
  runtime: RuntimeEnv;
  log?: ChannelLogSink;
};
type ChannelGatewayAdapter<ResolvedAccount = unknown> = {
  startAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<unknown>;
  stopAccount?: (ctx: ChannelGatewayContext<ResolvedAccount>) => Promise<void>; /** Keep gateway auth bypass resolution mirrored through a lightweight top-level `gateway-auth-api.ts` artifact. */
  resolveGatewayAuthBypassPaths?: (params: {
    cfg: OpenClawConfig;
  }) => string[];
  loginWithQrStart?: (params: {
    accountId?: string;
    force?: boolean;
    timeoutMs?: number;
    verbose?: boolean;
  }) => Promise<ChannelLoginWithQrStartResult>;
  loginWithQrWait?: (params: {
    accountId?: string;
    timeoutMs?: number;
    currentQrDataUrl?: string;
  }) => Promise<ChannelLoginWithQrWaitResult>;
  logoutAccount?: (ctx: ChannelLogoutContext<ResolvedAccount>) => Promise<ChannelLogoutResult>;
};
type ChannelAuthAdapter = {
  login?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    runtime: RuntimeEnv;
    verbose?: boolean;
    channelInput?: string | null;
  }) => Promise<void>;
};
type ChannelHeartbeatAdapter = {
  checkReady?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<{
    ok: boolean;
    reason: string;
  }>;
  sendTyping?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<void> | void;
  clearTyping?: (params: {
    cfg: OpenClawConfig;
    to: string;
    accountId?: string | null;
    threadId?: string | number | null;
    deps?: ChannelHeartbeatDeps;
  }) => Promise<void> | void;
};
type ChannelDirectorySelfParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryListGroupMembersParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  groupId: string;
  limit?: number | null;
  runtime: RuntimeEnv;
};
type ChannelDirectoryAdapter = {
  self?: (params: ChannelDirectorySelfParams) => Promise<ChannelDirectoryEntry | null>;
  listPeers?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listPeersLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroups?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupsLive?: (params: ChannelDirectoryListParams) => Promise<ChannelDirectoryEntry[]>;
  listGroupMembers?: (params: ChannelDirectoryListGroupMembersParams) => Promise<ChannelDirectoryEntry[]>;
};
type ChannelResolveKind = "user" | "group";
type ChannelResolveResult = {
  input: string;
  resolved: boolean;
  id?: string;
  name?: string;
  note?: string;
};
type ChannelResolverAdapter = {
  resolveTargets: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    inputs: string[];
    kind: ChannelResolveKind;
    runtime: RuntimeEnv;
  }) => Promise<ChannelResolveResult[]>;
};
type ChannelElevatedAdapter = {
  allowFromFallback?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => Array<string | number> | undefined;
};
type ChannelCommandAdapter = {
  enforceOwnerForCommands?: boolean;
  skipWhenConfigEmpty?: boolean;
  nativeCommandsAutoEnabled?: boolean;
  nativeSkillsAutoEnabled?: boolean;
  preferSenderE164ForCommands?: boolean;
  resolveNativeCommandName?: (params: {
    commandKey: string;
    defaultName: string;
  }) => string | undefined;
  buildCommandsListChannelData?: (params: {
    currentPage: number;
    totalPages: number;
    agentId?: string;
  }) => ReplyPayload["channelData"] | null;
  buildModelsMenuChannelData?: (params: {
    providers: Array<{
      id: string;
      count: number;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsProviderChannelData?: (params: {
    providers: Array<{
      id: string;
      count: number;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsAddProviderChannelData?: (params: {
    providers: Array<{
      id: string;
    }>;
  }) => ReplyPayload["channelData"] | null;
  buildModelsListChannelData?: (params: {
    provider: string;
    models: readonly string[];
    currentModel?: string;
    currentPage: number;
    totalPages: number;
    pageSize?: number;
    modelNames?: ReadonlyMap<string, string>;
  }) => ReplyPayload["channelData"] | null;
  buildModelBrowseChannelData?: () => ReplyPayload["channelData"] | null;
};
type ChannelDoctorConfigMutation = {
  config: OpenClawConfig;
  changes: string[];
  warnings?: string[];
};
type ChannelDoctorLegacyConfigRule = LegacyConfigRule;
type ChannelDoctorSequenceResult = {
  changeNotes: string[];
  warningNotes: string[];
};
type ChannelDoctorEmptyAllowlistAccountContext = {
  account: Record<string, unknown>;
  channelName: string;
  dmPolicy?: string;
  effectiveAllowFrom?: Array<string | number>;
  parent?: Record<string, unknown>;
  prefix: string;
};
type ChannelDoctorAdapter = {
  dmAllowFromMode?: "topOnly" | "topOrNested" | "nestedOnly";
  groupModel?: "sender" | "route" | "hybrid";
  groupAllowFromFallbackToAllowFrom?: boolean;
  warnOnEmptyGroupSenderAllowlist?: boolean;
  legacyConfigRules?: LegacyConfigRule[];
  normalizeCompatibilityConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation;
  collectPreviewWarnings?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => string[] | Promise<string[]>;
  collectMutableAllowlistWarnings?: (params: {
    cfg: OpenClawConfig;
  }) => string[] | Promise<string[]>;
  repairConfig?: (params: {
    cfg: OpenClawConfig;
    doctorFixCommand: string;
    env?: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  runConfigSequence?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    shouldRepair: boolean;
  }) => ChannelDoctorSequenceResult | Promise<ChannelDoctorSequenceResult>;
  cleanStaleConfig?: (params: {
    cfg: OpenClawConfig;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  collectEmptyAllowlistExtraWarnings?: (params: ChannelDoctorEmptyAllowlistAccountContext) => string[];
  shouldSkipDefaultEmptyGroupAllowlistWarning?: (params: ChannelDoctorEmptyAllowlistAccountContext) => boolean;
};
type ChannelLifecycleAdapter = {
  onAccountConfigChanged?: (params: {
    prevCfg: OpenClawConfig;
    nextCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  onAccountRemoved?: (params: {
    prevCfg: OpenClawConfig;
    accountId: string;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
  runStartupMaintenance?: (params: {
    cfg: OpenClawConfig;
    env?: NodeJS.ProcessEnv;
    log: {
      info?: (message: string) => void;
      warn?: (message: string) => void;
    };
    trigger?: string;
    logPrefix?: string;
  }) => Promise<void> | void;
  /**
   * @deprecated Export stateMigrations from the plugin doctor contract instead.
   * Removal plan: remove the lifecycle adapter after the 2027.1 external-plugin migration window.
   */
  detectLegacyStateMigrations?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
    stateDir: string;
    oauthDir: string;
  }) => ChannelLegacyStateMigrationPlan[] | Promise<ChannelLegacyStateMigrationPlan[]>;
};
type ChannelApprovalDeliveryAdapter = {
  hasConfiguredDmRoute?: (params: {
    cfg: OpenClawConfig;
  }) => boolean;
  shouldSuppressForwardingFallback?: (params: {
    cfg: OpenClawConfig;
    approvalKind: ChannelApprovalKind;
    target: ChannelApprovalForwardTarget;
    request: ExecApprovalRequest | PluginApprovalRequest;
  }) => boolean;
};
type ChannelApproveCommandBehavior = {
  kind: "allow";
} | {
  kind: "ignore";
} | {
  kind: "reply";
  text: string;
};
type ChannelApprovalRenderAdapter = {
  exec?: {
    buildPendingPayload?: (params: {
      cfg: OpenClawConfig;
      request: ExecApprovalRequest;
      target: ChannelApprovalForwardTarget;
      nowMs: number;
    }) => ReplyPayload | null;
    buildResolvedPayload?: (params: {
      cfg: OpenClawConfig;
      resolved: ExecApprovalResolved;
      target: ChannelApprovalForwardTarget;
    }) => ReplyPayload | null;
  };
  plugin?: {
    buildPendingPayload?: (params: {
      cfg: OpenClawConfig;
      request: PluginApprovalRequest;
      target: ChannelApprovalForwardTarget;
      nowMs: number;
    }) => ReplyPayload | null;
    buildResolvedPayload?: (params: {
      cfg: OpenClawConfig;
      resolved: PluginApprovalResolved;
      target: ChannelApprovalForwardTarget;
    }) => ReplyPayload | null;
  };
};
type ChannelApprovalAdapter = {
  delivery?: ChannelApprovalDeliveryAdapter;
  nativeRuntime?: ChannelApprovalNativeRuntimeAdapter;
  render?: ChannelApprovalRenderAdapter;
  native?: ChannelApprovalNativeAdapter;
  describeExecApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
  describePluginApprovalSetup?: (params: {
    channel: string;
    channelLabel: string;
    accountId?: string;
  }) => string | null | undefined;
};
type ChannelApprovalCapability = ChannelApprovalAdapter & {
  authorizeActorAction?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    action: "approve";
    approvalKind: "exec" | "plugin";
  }) => {
    authorized: boolean;
    reason?: string;
  };
  getActionAvailabilityState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
    approvalKind?: ChannelApprovalKind;
  }) => ChannelActionAvailabilityState; /** Exec-native client availability for the initiating surface; distinct from same-chat auth. */
  getExecInitiatingSurfaceState?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    action: "approve";
  }) => ChannelActionAvailabilityState;
  resolveApproveCommandBehavior?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    senderId?: string | null;
    approvalKind: ChannelApprovalKind;
  }) => ChannelApproveCommandBehavior | undefined;
};
type ChannelAllowlistAdapter = {
  applyConfigEdit?: (params: {
    cfg: OpenClawConfig;
    parsedConfig: Record<string, unknown>;
    accountId?: string | null;
    scope: "dm" | "group";
    action: "add" | "remove";
    entry: string;
  }) => {
    kind: "ok";
    changed: boolean;
    pathLabel: string;
    writeTarget: ConfigWriteTarget;
  } | {
    kind: "invalid-entry";
  } | Promise<{
    kind: "ok";
    changed: boolean;
    pathLabel: string;
    writeTarget: ConfigWriteTarget;
  } | {
    kind: "invalid-entry";
  }> | null;
  readConfig?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    dmAllowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    dmPolicy?: string;
    groupPolicy?: string;
    groupOverrides?: Array<{
      label: string;
      entries: Array<string | number>;
    }>;
  } | Promise<{
    dmAllowFrom?: Array<string | number>;
    groupAllowFrom?: Array<string | number>;
    dmPolicy?: string;
    groupPolicy?: string;
    groupOverrides?: Array<{
      label: string;
      entries: Array<string | number>;
    }>;
  }>;
  resolveNames?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    scope: "dm" | "group";
    entries: string[];
  }) => Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }> | Promise<Array<{
    input: string;
    resolved: boolean;
    name?: string | null;
  }>>;
  supportsScope?: (params: {
    scope: "dm" | "group" | "all";
  }) => boolean;
};
type ChannelConfiguredBindingConversationRef = {
  conversationId: string;
  parentConversationId?: string;
};
type ChannelConfiguredBindingMatch = ChannelConfiguredBindingConversationRef & {
  matchPriority?: number;
};
type ChannelCommandConversationContext = {
  accountId: string;
  threadId?: string;
  threadParentId?: string;
  senderId?: string;
  sessionKey?: string;
  parentSessionKey?: string;
  from?: string;
  chatType?: string;
  originatingTo?: string;
  commandTo?: string;
  fallbackTo?: string;
};
type ChannelConfiguredBindingProvider = {
  selfParentConversationByDefault?: boolean;
  compileConfiguredBinding: (params: {
    binding: ConfiguredBindingRule;
    conversationId: string;
  }) => ChannelConfiguredBindingConversationRef | null;
  matchInboundConversation: (params: {
    binding: ConfiguredBindingRule;
    compiledBinding: ChannelConfiguredBindingConversationRef;
    conversationId: string;
    parentConversationId?: string;
  }) => ChannelConfiguredBindingMatch | null;
  resolveCommandConversation?: (params: ChannelCommandConversationContext) => ChannelConfiguredBindingConversationRef | null;
};
type ChannelConversationBindingSupport = {
  supportsCurrentConversationBinding?: boolean;
  isCurrentConversationBindingSupported?: (params: {
    accountId: string;
  }) => boolean;
  /**
   * Preferred placement when a command is started from a top-level conversation
   * without an existing native thread id.
   *
   * - `current`: bind/spawn in the current conversation
   * - `child`: create a child thread/conversation first
   */
  defaultTopLevelPlacement?: "current" | "child";
  resolveConversationRef?: (params: {
    accountId?: string | null;
    conversationId: string;
    parentConversationId?: string;
    threadId?: string | number | null;
  }) => {
    conversationId: string;
    parentConversationId?: string;
  } | null;
  buildBoundReplyPayload?: (params: {
    operation: "acp-spawn";
    placement: "current" | "child";
    conversation: {
      channel: string;
      accountId?: string | null;
      conversationId: string;
      parentConversationId?: string;
    };
  }) => Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null | Promise<Pick<ReplyPayload, "channelData" | "delivery" | "presentation"> | null>;
  buildModelOverrideParentCandidates?: (params: {
    parentConversationId?: string | null;
  }) => string[] | null | undefined;
  shouldStripThreadFromAnnounceOrigin?: (params: {
    requester: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
    entry: {
      channel?: string;
      to?: string;
      threadId?: string | number;
    };
  }) => boolean;
  setIdleTimeoutBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    idleTimeoutMs: number;
  }) => Array<{
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
  }>;
  setMaxAgeBySessionKey?: (params: {
    targetSessionKey: string;
    accountId?: string | null;
    maxAgeMs: number;
  }) => Array<{
    boundAt: number;
    lastActivityAt: number;
    idleTimeoutMs?: number;
    maxAgeMs?: number;
  }>;
  createManager?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
  }) => {
    stop: () => void | Promise<void>;
  } | Promise<{
    stop: () => void | Promise<void>;
  }>;
};
type ChannelSecurityDmRouteContext<ResolvedAccount> = ChannelSecurityContext<ResolvedAccount> & {
  accountId: string;
  principalId?: string;
};
type ChannelSecurityAdapter<ResolvedAccount = unknown> = {
  applyConfigFixes?: (params: {
    cfg: OpenClawConfig;
    env: NodeJS.ProcessEnv;
  }) => ChannelDoctorConfigMutation | Promise<ChannelDoctorConfigMutation>;
  resolveDmPolicy?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount>) => ChannelSecurityDmPolicy | null>;
  dmRouting?: {
    resolveDmScope?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount>) => DmScope | undefined;
    resolveDmRoute?: (ctx: ChannelSecurityDmRouteContext<ResolvedAccount> & {
      route: ResolvedAgentRoute;
    }) => {
      kind: "core" | "isolated";
    } | {
      sessionKey: string;
    } | undefined;
  };
  collectWarnings?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount>) => Promise<string[]> | string[]>;
  collectAuditFindings?: ChannelAdapterCallback<(ctx: ChannelSecurityContext<ResolvedAccount> & {
    sourceConfig: OpenClawConfig;
    orderedAccountIds: string[];
    hasExplicitAccountPath: boolean;
  }) => Promise<Array<{
    checkId: string;
    severity: "info" | "warn" | "critical";
    title: string;
    detail: string;
    remediation?: string;
  }>> | Array<{
    checkId: string;
    severity: "info" | "warn" | "critical";
    title: string;
    detail: string;
    remediation?: string;
  }>>;
};
//#endregion
//#region src/channels/plugins/setup-wizard-types.d.ts
type ChannelSetupPlugin = {
  id: ChannelId;
  meta: ChannelMeta;
  capabilities: ChannelCapabilities;
  config: ChannelConfigAdapter<unknown>;
  setupContract?: ChannelOwnedSetupContract;
  setup?: ChannelSetupAdapter;
  setupWizard?: ChannelSetupWizard | ChannelSetupWizardAdapter;
};
/** Status block shown before users select channels during setup. */
type ChannelSetupWizardStatus = {
  configuredLabel: string;
  unconfiguredLabel: string;
  configuredHint?: string;
  unconfiguredHint?: string;
  configuredScore?: number;
  unconfiguredScore?: number;
  resolveConfigured: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
  }) => boolean | Promise<boolean>;
  resolveStatusLines?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string[] | Promise<string[]>;
  resolveSelectionHint?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => string | undefined | Promise<string | undefined>;
  resolveQuickstartScore?: (params: {
    cfg: OpenClawConfig;
    accountId?: string;
    configured: boolean;
  }) => number | undefined | Promise<number | undefined>;
};
/** Snapshot of one credential before prompting or reusing existing config. */
type ChannelSetupWizardCredentialState = {
  accountConfigured: boolean;
  hasConfiguredValue: boolean;
  resolvedValue?: string;
  envValue?: string;
};
type ChannelSetupWizardCredentialValues = Partial<Record<string, string>>;
/** Optional explanatory note shown when its owning step is reached. */
type ChannelSetupWizardNote = {
  title: string;
  lines: string[];
  shouldShow?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => boolean | Promise<boolean>;
};
/** Lets a wizard configure an account entirely from existing environment. */
type ChannelSetupWizardEnvShortcut = {
  prompt: string;
  preferredEnvVar?: string;
  isAvailable: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative secret/input step for a channel account credential. */
type ChannelSetupWizardCredential = {
  /** Plugin-owned key written into the runtime setup input. */inputKey: string;
  providerHint: string;
  credentialLabel: string;
  preferredEnvVar?: string;
  helpTitle?: string;
  helpLines?: string[];
  envPrompt: string;
  keepPrompt: string;
  inputPrompt: string;
  allowEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  inspect: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelSetupWizardCredentialState;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
    state: ChannelSetupWizardCredentialState;
  }) => boolean | Promise<boolean>;
  applyUseEnv?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    value: unknown;
    resolvedValue: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative text step that can depend on resolved credentials. */
type ChannelSetupWizardTextInput = {
  /** Plugin-owned key written into the runtime setup input. */inputKey: string;
  message: string;
  placeholder?: string; /** Mask input and keep any configured value server-side. */
  sensitive?: boolean;
  required?: boolean;
  applyEmptyValue?: boolean;
  helpTitle?: string;
  helpLines?: string[];
  confirmCurrentValue?: boolean;
  keepPrompt?: string | ((value: string) => string);
  currentValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  initialValue?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined | Promise<string | undefined>;
  shouldPrompt?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    currentValue?: string;
  }) => boolean | Promise<boolean>;
  applyCurrentValue?: boolean;
  validate?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string | undefined;
  normalizeValue?: (params: {
    value: string;
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
  }) => string;
  applySet?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    value: string;
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
type ChannelSetupWizardAllowFromEntry = {
  input: string;
  resolved: boolean;
  id: string | null;
};
/** Channel-specific resolver for user-entered allowlist targets. */
type ChannelSetupWizardAllowFrom = {
  helpTitle?: string;
  helpLines?: string[];
  credentialInputKey?: string;
  message: string;
  placeholder: string;
  invalidWithoutCredentialNote: string;
  parseInputs?: (raw: string) => string[];
  parseId: (raw: string) => string | null;
  resolveEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
  }) => Promise<ChannelSetupWizardAllowFromEntry[]>;
  apply: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    allowFrom: string[];
  }) => OpenClawConfig | Promise<OpenClawConfig>;
};
/** Declarative group/DM access policy step used by interactive setup. */
type ChannelSetupWizardGroupAccess = {
  label: string;
  placeholder: string;
  helpTitle?: string;
  helpLines?: string[];
  skipAllowlistEntries?: boolean;
  currentPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => ChannelAccessPolicy;
  currentEntries: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => string[];
  updatePrompt: (params: {
    cfg: OpenClawConfig;
    accountId: string;
  }) => boolean;
  setPolicy: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    policy: ChannelAccessPolicy;
  }) => OpenClawConfig;
  resolveAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    credentialValues: ChannelSetupWizardCredentialValues;
    entries: string[];
    prompter: Pick<WizardPrompter, "note">;
  }) => Promise<unknown>;
  applyAllowlist?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    resolved: unknown;
  }) => OpenClawConfig;
};
/** Optional pre-step hook for deriving helper config or credential values. */
type ChannelSetupWizardPrepare = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
/** Optional post-step hook for final validation, writes, or post prompts. */
type ChannelSetupWizardFinalize = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  credentialValues: ChannelSetupWizardCredentialValues;
  runtime: ChannelSetupConfigureContext["runtime"];
  prompter: WizardPrompter;
  options?: ChannelSetupConfigureContext["options"];
  forceAllowFrom: boolean;
}) => {
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void | Promise<{
  cfg?: OpenClawConfig;
  credentialValues?: ChannelSetupWizardCredentialValues;
} | void>;
/** Full declarative setup wizard consumed by the generic setup adapter. */
type ChannelSetupWizard = {
  channel: string;
  status: ChannelSetupWizardStatus;
  introNote?: ChannelSetupWizardNote;
  envShortcut?: ChannelSetupWizardEnvShortcut;
  resolveAccountIdForConfigure?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    options?: ChannelSetupConfigureContext["options"];
    accountOverride?: string;
    shouldPromptAccountIds: boolean;
    listAccountIds: ChannelSetupPlugin["config"]["listAccountIds"];
    defaultAccountId: string;
  }) => string | Promise<string>;
  resolveShouldPromptAccountIds?: (params: {
    cfg: OpenClawConfig;
    options?: ChannelSetupConfigureContext["options"];
    shouldPromptAccountIds: boolean;
  }) => boolean;
  prepare?: ChannelSetupWizardPrepare;
  stepOrder?: "credentials-first" | "text-first";
  credentials: ChannelSetupWizardCredential[];
  textInputs?: ChannelSetupWizardTextInput[];
  finalize?: ChannelSetupWizardFinalize;
  completionNote?: ChannelSetupWizardNote;
  dmPolicy?: ChannelSetupDmPolicy;
  allowFrom?: ChannelSetupWizardAllowFrom;
  groupAccess?: ChannelSetupWizardGroupAccess;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
  onAccountRecorded?: ChannelSetupWizardAdapter["onAccountRecorded"];
};
/** Runtime options for selecting and configuring one or more channels. */
type SetupChannelsOptions = {
  allowDisable?: boolean;
  allowIMessageInstall?: boolean;
  allowSignalInstall?: boolean; /** Revalidate host authority immediately before an installer or other durable effect. */
  beforePersistentEffect?: () => Promise<void>;
  onSelection?: (selection: ChannelId[]) => void;
  onPostWriteHook?: (hook: ChannelOnboardingPostWriteHook) => void;
  accountIds?: Partial<Record<ChannelId, string>>;
  onAccountId?: (channel: ChannelId, accountId: string) => void;
  onResolvedPlugin?: (channel: ChannelId, plugin: ChannelSetupPlugin) => void;
  promptAccountIds?: boolean;
  forceAllowFromChannels?: ChannelId[];
  deferStatusUntilSelection?: boolean;
  /**
   * The controlling client finishes device linking itself after config is
   * written (e.g. Control UI renders the WhatsApp QR via web.login.*), so
   * setup surfaces must skip terminal-interactive login/link prompts.
   */
  deferDeviceLinkToClient?: boolean;
  skipStatusNote?: boolean;
  skipDmPolicyPrompt?: boolean;
  skipConfirm?: boolean;
  quickstartDefaults?: boolean;
  initialSelection?: ChannelId[]; /** Finish after the explicitly targeted channel is configured or paused. */
  finishAfterInitialSelection?: boolean;
  secretInputMode?: "plaintext" | "ref";
};
type ChannelSetupStatus = {
  channel: ChannelId;
  configured: boolean;
  statusLines: string[];
  selectionHint?: string;
  quickstartScore?: number;
};
/** Shared context for status checks before channel selection. */
type ChannelSetupStatusContext = {
  cfg: OpenClawConfig;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
};
/** Shared context for applying setup changes for a selected channel. */
type ChannelSetupConfigureContext = {
  cfg: OpenClawConfig;
  runtime: RuntimeEnv;
  prompter: WizardPrompter;
  options?: SetupChannelsOptions;
  accountOverrides: Partial<Record<ChannelId, string>>;
  shouldPromptAccountIds: boolean;
  forceAllowFrom: boolean;
};
/** Context passed after setup has written config to disk. */
type ChannelOnboardingPostWriteContext = {
  previousCfg: OpenClawConfig;
  cfg: OpenClawConfig;
  accountId: string;
  runtime: RuntimeEnv;
};
/** Deferred hook for channel work that must run after config persistence. */
type ChannelOnboardingPostWriteHook = {
  channel: ChannelId;
  accountId: string;
  run: (ctx: {
    cfg: OpenClawConfig;
    runtime: RuntimeEnv;
  }) => Promise<void> | void;
};
type ChannelSetupResult = {
  cfg: OpenClawConfig;
  accountId?: string;
  completion?: "configured";
} | {
  cfg: OpenClawConfig; /** Paused setup is persisted without configured-account hooks or routing. */
  completion: "paused";
  accountId?: never;
};
type ChannelSetupConfiguredResult = ChannelSetupResult | "skip";
type ChannelSetupInteractiveContext = ChannelSetupConfigureContext & {
  configured: boolean;
  label: string;
};
/** Optional direct-message policy contract exposed by setup adapters. */
type ChannelSetupDmPolicy = {
  label: string;
  channel: ChannelId;
  policyKey: string;
  allowFromKey: string;
  resolveConfigKeys?: (cfg: OpenClawConfig, accountId?: string) => {
    policyKey: string;
    allowFromKey: string;
  };
  getCurrent: (cfg: OpenClawConfig, accountId?: string) => DmPolicy;
  setPolicy: (cfg: OpenClawConfig, policy: DmPolicy, accountId?: string) => OpenClawConfig;
  promptAllowFrom?: (params: {
    cfg: OpenClawConfig;
    prompter: WizardPrompter;
    accountId?: string;
  }) => Promise<OpenClawConfig>;
};
/** Imperative adapter consumed by onboarding and setup flows. */
type ChannelSetupWizardAdapter = {
  channel: ChannelId;
  getStatus: (ctx: ChannelSetupStatusContext) => Promise<ChannelSetupStatus>;
  configure: (ctx: ChannelSetupConfigureContext) => Promise<ChannelSetupResult>;
  configureInteractive?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  configureWhenConfigured?: (ctx: ChannelSetupInteractiveContext) => Promise<ChannelSetupConfiguredResult>;
  afterConfigWritten?: (ctx: ChannelOnboardingPostWriteContext) => Promise<void> | void;
  dmPolicy?: ChannelSetupDmPolicy;
  onAccountRecorded?: (accountId: string, options?: SetupChannelsOptions) => void;
  disable?: (cfg: OpenClawConfig) => OpenClawConfig;
};
//#endregion
export { ChannelOutboundSessionRoute as $, OutboundDeliveryFormattingOptions as A, BaseTokenResolution as B, ChannelSecurityAdapter as C, ExecApprovalDecision as Ct, ChannelOutboundAdapter as D, ExecSecurity as Dt, ChannelDeliveryCapabilities as E, ExecMode as Et, chunkText as F, ChannelCapabilities as G, ChannelAgentPromptAdapter as H, chunkTextWithMode as I, ChannelMentionAdapter as J, ChannelDirectoryEntry as K, resolveChunkMode as L, chunkByNewline as M, chunkMarkdownText as N, ChannelOutboundPayloadHint as O, ExecTarget as Ot, chunkMarkdownTextWithMode as P, ChannelMeta as Q, resolveTextChunkLimit as R, ChannelSecretsAdapter as S, OutboundSendDeps as St, ChannelPairingAdapter as T, ExecAsk as Tt, ChannelAgentTool as U, ChannelAccountSnapshot as V, ChannelAgentToolFactory as W, ChannelMessageActionContext as X, ChannelMessageActionAdapter as Y, ChannelMessagingAdapter as Z, ChannelGatewayContext as _, MessageReceipt as _t, ChannelApprovalCapability as a, ChannelLegacyStateMigrationPlan as at, ChannelLifecycleAdapter as b, OutboundMediaAccess as bt, ChannelConfigAdapter as c, OutboundPayloadDeliveryOutcome as ct, ChannelDirectoryAdapter as d, buildAgentSessionKey as dt, ChannelStatusIssue as et, ChannelDoctorAdapter as f, resolveAgentRoute as ft, ChannelGatewayAdapter as g, ChannelMessageAdapterShape as gt, ChannelElevatedAdapter as h, WizardPrompter as ht, ChannelAllowlistAdapter as i, ChannelThreadingToolContext as it, ChunkMode as j, OutboundIdentity as k, ChannelConfiguredBindingProvider as l, OutboundPayloadDeliverySuppressionReason as lt, ChannelDoctorLegacyConfigRule as m, PluginApprovalRequestPayload as mt, ChannelSetupWizard as n, ChannelStructuredComponents as nt, ChannelAuthAdapter as o, ConversationReadInvocationOrigin as ot, ChannelDoctorConfigMutation as p, PluginApprovalRequest as pt, ChannelGroupContext as q, ChannelSetupWizardAdapter as r, ChannelThreadingAdapter as rt, ChannelCommandAdapter as s, OutboundDeliveryResult as st, ChannelSetupDmPolicy as t, ChannelStreamingAdapter as tt, ChannelConversationBindingSupport as u, ChannelRuntimeSurface as ut, ChannelGroupAdapter as v, RenderedMessageBatchPlanItem as vt, ChannelStatusAdapter as w, ExecApprovalRequestPayload as wt, ChannelResolverAdapter as x, OutboundMediaReadFile as xt, ChannelHeartbeatAdapter as y, PollInput as yt, BaseProbeResult as z };