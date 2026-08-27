import { n as GatewayClientName, t as GatewayClientMode } from "./client-info-CBeyXFzt.js";
import { f as AgentToolResult, u as AgentTool } from "./types-aADBdueZ.js";
import "./index-Bf1XfcnS.js";
import { S as MessagePresentation, b as ReplyPayload, v as ReplyDeliveryContext } from "./types-BdTyUrVT.js";
import { Ct as ChatType, bt as ReplyToMode, n as OpenClawConfig, yt as MarkdownTableMode } from "./types.openclaw-BssW6c46.js";
import { a as MsgContext, v as InboundEventKind } from "./templating-BCMFHjRY.js";
import "./types-Ds34fJCS.js";
import { n as PollInput } from "./polls-CfHkU59X.js";
import { t as ChannelId } from "./channel-id.types-myn0PI2A.js";
import { TSchema } from "typebox";
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
//#region src/media/load-options.d.ts
/** Host callback used to read an already-authorized outbound media file. */
type OutboundMediaReadFile = (filePath: string) => Promise<Buffer>;
/** Host-provided file access used when a runtime can read outbound media from local disk. */
type OutboundMediaAccess = {
  localRoots?: readonly string[];
  readFile?: OutboundMediaReadFile;
  /** Agent workspace directory for resolving relative media paths. */
  workspaceDir?: string;
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
//#region src/channels/message/types.d.ts
type OutboundReplyFacts = Readonly<{
  source: "explicit";
  replyToId: string;
}> | Readonly<{
  source: "implicit";
  replyToId: string;
  mode: "first" | "all";
}>;
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
  target?: {
    kind: "chat" | "channel" | "room" | "conversation";
    id: string;
  };
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
  gatewayClientScopes?: readonly string[];
  /** @internal Opaque durable intent id for exact provider-side send reconciliation. */
  deliveryQueueId?: string;
  /** @internal Stable platform-send index within one durable payload. */
  deliveryPartIndex?: number;
  /** @internal Exact platform-send count within one durable payload. */
  deliveryPartCount?: number;
  /** @internal Channel-valid id reserved before a correlated conversation turn is sent. */
  preparedMessageId?: string;
  /** @internal Refresh durable timing before recipient-visible or finalizing platform I/O. */
  onPlatformSendDispatch?: () => Promise<void>;
  /** @internal Report each completed platform sub-send before another fallible step. */
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
  target?: MessageReceiptSourceResult["target"];
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
  platformSendStartedAt?: number;
  /** Canonical reply target persisted after hooks and before platform I/O. */
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
  capabilities?: DurableFinalDeliveryRequirementMap;
  /** Opt into provider reconciliation for ordinary single-payload queued sends. */
  automaticUnknownSendReconciliation?: boolean;
  /**
   * Synchronous provider admission before a durable intent is created or replayed.
   * Providers must not perform I/O from this hook.
   */
  admitDeferredDelivery?: (ctx: ChannelMessageDeferredDeliveryAdmissionContext) => ChannelMessageDeferredDeliveryAdmissionResult;
  /** Send shapes for which reconciliation can prove the complete durable intent. */
  reconcileUnknownSendKinds?: Partial<Record<UnknownSendReconciliationKind, boolean>>;
  reconcileUnknownSend?: (ctx: ChannelMessageUnknownSendContext) => Promise<ChannelMessageUnknownSendReconciliationResult | null> | ChannelMessageUnknownSendReconciliationResult | null;
  /** Cleanup after core authoritatively retires an ambiguous send as failed. */
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
//#region src/channels/plugins/conversation-read-origin.d.ts
/**
 * Server-owned origin for one tool or message-action invocation.
 *
 * Missing and unknown values must remain delegated; callers must never derive
 * this from model arguments, provider parameters, config, or persisted state.
 */
type ConversationReadInvocationOrigin = "delegated" | "direct-operator";
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
  reconnectAttempts?: number;
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
  groupId?: string | null;
  /** Human label for channel-like group conversations (e.g. #general). */
  groupChannel?: string | null;
  groupSpace?: string | null;
  accountId?: string | null;
  /** Trusted host instruction to ignore toolsBySender for non-ingress work. */
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
  audioFileFormats?: readonly string[];
  /** Voice notes can carry the final reply text as a visible caption. */
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
  baseSessionKey: string;
  /** Route authority for explicit recipient session selection. */
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
    replyToId?: string | null;
    /** True when replyToId came from an explicit payload target or reply tag. */
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
  CurrentMessageId?: string | number;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: MsgContext["ReplyToMode"];
  ReplyToId?: string;
  ReplyToIdFull?: string;
  ThreadLabel?: string;
  MessageThreadId?: string | number;
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
};
type ChannelThreadingToolContext = {
  currentChannelId?: string;
  /** Trusted normalized conversation kind for the active inbound turn. */
  currentChatType?: ChatType;
  /** Routable messaging target when it differs from the platform-native channel id. */
  currentMessagingTarget?: string;
  currentGraphChannelId?: string;
  currentChannelProvider?: ChannelId;
  currentThreadTs?: string;
  currentMessageId?: string | number;
  replyToMode?: "off" | "first" | "all" | "batched";
  hasRepliedRef?: {
    value: boolean;
  };
  /** True when posting at the parent conversation root would leak a thread-originated reply. */
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
  targetPrefixes?: readonly string[];
  /** Re-resolve the current owner when channel behavior exceeds generic bindings. */
  resolveConversationRouteOwner?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    conversation: {
      kind: "direct" | "group" | "channel";
      peerId: string;
      /** Canonical delivery target when it differs from the routing peer. */
      target?: string;
      threadId?: string;
      nativeChannelId?: string;
      context?: {
        parentPeerId?: string;
        guildId?: string;
        teamId?: string;
        memberRoleIds?: string[];
      };
    };
  }) => {
    kind: "agent";
    agentId: string;
  } | {
    kind: "plugin";
    pluginId: string;
    fallbackAgentId: string;
  } | {
    kind: "unavailable";
  } | null | undefined;
  /** DM targets rebuilt from session keys require an explicit `user:` kind prefix. */
  directTargetStyle?: "user-prefixed";
  /** Equality rule for ids carried by prefixed outbound targets. */
  targetIdComparison?: "case-sensitive" | "lowercase";
  /** Bare numeric conversation/topic shorthand is valid for this channel. */
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
    hint?: string;
    /** Bare words that are command/session references for this channel, not literal destinations. */
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
  reply?: OutboundReplyFacts;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  accountId?: string | null;
  /** Trusted originating account id paired with requesterSenderId. */
  requesterAccountId?: string | null;
  /**
   * Trusted sender id from inbound context. This is server-injected and must
   * never be sourced from tool/model-controlled params.
   */
  requesterSenderId?: string | null;
  /** Trusted owner identity bit from command/channel-action auth. */
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
  /**
   * Server-owned fact: this caller receives proven-not-sent failures and resends
   * them. Plugins forward it into durable sends so recovery does not replay too.
   */
  deliveryRetryOwner?: "caller";
};
type ChannelToolSend = {
  to: string;
  accountId?: string | null;
  threadId?: string | null;
  /** True when the native provider send may inherit the active conversation thread. */
  threadImplicit?: boolean;
  threadSuppressed?: boolean;
};
type ChannelMessagePreparedSendPayloadContext = {
  ctx: ChannelMessageActionContext;
  to: string;
  payload: ReplyPayload;
  replyToId?: string | null;
  /** Preserve caller intent when plugins translate reply ids into durable payloads. */
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
  /** Delegate conversation-read authorization to this adapter for bundled registrations only. */
  providerOwnedReadGates?: true | readonly ChannelMessageActionName[];
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
    aliases: string[];
    /** Alias fields that identify the destination conversation, not an existing message. */
    deliveryTargetAliases?: string[];
    /** Convert typed owner fields such as chatId into the canonical shared target shape. */
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
  }) => boolean;
  /** Return true when a provider-native tool invocation has a visible or destructive side effect. */
  isToolDeliveryAction?: (params: {
    args: Record<string, unknown>;
  }) => boolean;
  extractToolSend?: (params: {
    args: Record<string, unknown>;
  }) => ChannelToolSend | null;
  /** Recover the actual resolved send route from a successful action result. */
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
type ChannelPollResult = Pick<MessageReceiptSourceResult, "messageId" | "toJid" | "channelId" | "conversationId" | "pollId"> & {
  messageId: string;
  receipt?: MessageReceipt;
};
/** Shared poll input after core has normalized the common poll model. */
type ChannelPollContext = Pick<ChannelMessageSendPollContext, "cfg" | "to" | "poll" | "accountId" | "threadId" | "silent" | "isAnonymous" | "gatewayClientScopes" | "onPlatformSendDispatch"> & {
  content?: string;
  /** Trusted originating turn context for channel-owned delivery correlation. */
  sessionKey?: string;
  inboundEventKind?: InboundEventKind;
};
/** Minimal base for all channel probe results. Channel-specific probes extend this. */
type BaseProbeResult<TError = string | null> = {
  ok: boolean;
  error?: TError;
};
//#endregion
export { MessageReceipt as A, ChannelStreamingAdapter as C, ConversationReadInvocationOrigin as D, ChannelTtsVoiceDeliveryCapabilities as E, OutboundMediaReadFile as F, RenderedMessageBatchPlanItem as M, OutboundSendDeps as N, ChannelMessageAdapterShape as O, OutboundMediaAccess as P, ChannelStatusIssue as S, ChannelThreadingToolContext as T, ChannelOutboundTargetMode as _, ChannelAgentTool as a, ChannelSecurityContext as b, ChannelDirectoryEntry as c, ChannelHeartbeatDeps as d, ChannelLogSink as f, ChannelMeta as g, ChannelMessagingAdapter as h, ChannelAgentPromptAdapter as i, OutboundReplyFacts as j, ChannelMessageUnknownSendReconciliationResult as k, ChannelDirectoryEntryKind as l, ChannelMessageActionAdapter as m, ChannelAccountSnapshot as n, ChannelAgentToolFactory as o, ChannelMentionAdapter as p, ChannelAccountState as r, ChannelCapabilities as s, BaseProbeResult as t, ChannelGroupContext as u, ChannelPollContext as v, ChannelThreadingAdapter as w, ChannelSecurityDmPolicy as x, ChannelPollResult as y };