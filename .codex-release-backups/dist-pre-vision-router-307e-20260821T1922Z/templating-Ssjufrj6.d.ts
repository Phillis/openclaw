import { D as GroupToolPolicyConfig, H as ReplyToMode, L as DmScope } from "./types.openclaw-LvSHMCsQ.js";
import { t as FastMode } from "./string-coerce-D1ftETdv.js";
import { o as ImageContent } from "./types-GU_0Dtwq.js";
import { a as SessionEntry, b as SessionRunStatus, f as SessionRestartRecoveryState, l as SessionCreatedActor, p as SourceReplyDeliveryMode, r as InternalSessionEntry, u as SessionCreatedVia } from "./types-CwTle-f6.js";
import { t as AgentMessage } from "./types-BH0Q4SbZ.js";
import { i as MediaUnderstandingDecision, s as MediaUnderstandingOutput } from "./types-BWT7ESoe.js";

//#region src/config/sessions/transcript-entry-anchor.d.ts
/** Immutable transcript identity issued by the SQLite append transaction. */
type TranscriptEntryAnchor = Readonly<{
  agentId: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
  generation: string;
  entryId: string;
  rawSeq: number;
  effectiveParentId: string | null;
  activeMessagePosition: number;
  idempotencyKey?: string;
}>;
/** Current user row bound to one recorder-owned logical turn. */
type TranscriptTurnAdmission = TranscriptEntryAnchor & Readonly<{
  logicalTurnId: string;
  role: "user";
}>;
/** Exact accepted transcript range, inclusive of admission and terminal. */
type TranscriptTurnBoundary = Readonly<{
  admission: TranscriptTurnAdmission;
  terminal: TranscriptEntryAnchor;
}>;
//#endregion
//#region src/channels/location.d.ts
/** Normalized source kind for channel-provided geographic locations. */
type LocationSource = "pin" | "place" | "live";
/** Channel-neutral location payload passed from plugins into shared prompt rendering. */
type NormalizedLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
  name?: string;
  address?: string;
  isLive?: boolean;
  source?: LocationSource;
  caption?: string;
};
/** Portable outbound location fields supported by channel send adapters. */
type OutboundLocation = Pick<NormalizedLocation, "latitude" | "longitude" | "accuracy" | "name" | "address">;
//#endregion
//#region src/interactive/payload.d.ts
type InteractiveButtonStyle = "primary" | "secondary" | "success" | "danger";
/** Visual tone for a portable message presentation. */
type MessagePresentationTone = "info" | "success" | "warning" | "danger" | "neutral";
/** Core-owned model-picker action; channels serialize it only inside private envelopes. */
type ModelPickerAction = ({
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-providers";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-models";
  providerToken: string;
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "show-recents";
  cursor?: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-model";
  providerToken: string;
  modelToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "choose-runtime";
  providerToken: string;
  modelToken: string;
  runtimeToken: string;
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "reset";
} | {
  type: "model-picker";
  version: 1;
  snapshotToken: string;
  intent: "cancel";
}) & {
  /** Legacy command/callback payload fields are deliberately unavailable on picker actions. */readonly command?: never;
  readonly value?: never;
};
/** Portable typed action behind a button or select option. */
type MessagePresentationAction = {
  /** Run a core/plugin slash command through the target channel's native command path. */type: "command";
  command: string;
} | {
  /** Opaque callback value interpreted by the target channel/plugin. */type: "callback";
  value: string;
} | ModelPickerAction | {
  /** Resolve one durable operator approval without exposing transport callback data. */type: "approval";
  approvalId: string;
  approvalKind: "exec" | "plugin";
  decision: "allow-once" | "allow-always" | "deny";
} | {
  /** Resolve one runtime-authored operator question choice. */type: "question";
  questionId: string;
  optionValue: string;
} | {
  /** Open a normal external link. */type: "url";
  url: string;
} | {
  /** Launch a channel-native web app. */type: "web-app"; /** External web app URL for channels that launch web apps by URL. */
  url: string; /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId?: string;
} | {
  /** Launch a channel-native web app. */type: "web-app"; /** External web app URL for channels that launch web apps by URL. */
  url?: string; /** OpenClaw hosted-widget ID whose launch mechanics are owned by the channel. */
  widgetId: string;
};
/** Portable action control rendered as a button or link by channel adapters. */
type MessagePresentationButton = {
  /** User-visible button label. */label: string; /** Typed action sent when the button is pressed. */
  action?: MessagePresentationAction;
  /**
   * Legacy opaque callback value sent when the button is pressed.
   * Prefer action for new presentation controls.
   * @deprecated Use action.
   */
  value?: string; /** @deprecated Use an action with type "url". */
  url?: string; /** @deprecated Use an action with type "web-app". */
  webApp?: {
    url: string;
  };
  /**
   * @deprecated Use an action with type "web-app". Accepted for legacy JSON payloads only.
   */
  web_app?: {
    url: string;
  }; /** Higher-priority buttons are kept first when channel limits require truncation. */
  priority?: number; /** Disable the button when the target channel supports disabled controls. */
  disabled?: boolean; /** Keep this action available after a successful interaction when the target channel supports it. */
  reusable?: boolean; /** Optional visual style hint; unsupported channels ignore or normalize it. */
  style?: InteractiveButtonStyle;
};
/** Portable select/menu option. */
type MessagePresentationOption = {
  /** User-visible option label. */label: string; /** Typed action sent when the option is selected. */
  action?: Extract<MessagePresentationAction, {
    type: "command" | "callback" | "model-picker";
  }>; /** @deprecated Use action. */
  value?: string;
};
type LegacyInteractiveReplyOption = MessagePresentationOption;
type LegacyInteractiveReplyTextBlock = {
  type: "text";
  text: string;
};
type LegacyInteractiveReplySelectBlock = {
  type: "select";
  placeholder?: string;
  options: LegacyInteractiveReplyOption[];
};
type LegacyInteractiveReplyBlock = LegacyInteractiveReplyTextBlock | MessagePresentationButtonsBlock | LegacyInteractiveReplySelectBlock;
type LegacyInteractiveReply = {
  blocks: LegacyInteractiveReplyBlock[];
};
/** @deprecated Use MessagePresentation. */
type InteractiveReply = LegacyInteractiveReply;
type MessagePresentationTextBlock = {
  type: "text"; /** Primary markdown-ish text rendered in the message body. */
  text: string;
};
type MessagePresentationContextBlock = {
  type: "context"; /** Lower-emphasis contextual text, or normal text on channels without context support. */
  text: string;
};
type MessagePresentationDividerBlock = {
  type: "divider";
};
type MessagePresentationButtonsBlock = {
  type: "buttons"; /** Button row candidates; core may split or truncate them for channel limits. */
  buttons: MessagePresentationButton[];
};
type MessagePresentationSelectBlock = {
  type: "select"; /** Optional prompt shown above or inside the select control. */
  placeholder?: string; /** Menu options; core may truncate them for channel limits. */
  options: MessagePresentationOption[];
};
type MessagePresentationChartSegment = {
  /** Category label shown in the chart legend. */label: string; /** Positive segment magnitude. */
  value: number;
};
type MessagePresentationChartSeries = {
  /** Unique series name shown in the chart legend. */name: string; /** One finite value for each chart category, in category order. */
  values: number[];
};
type MessagePresentationChartBlock = {
  type: "chart";
  chartType: "pie"; /** Short chart heading. */
  title: string;
  segments: MessagePresentationChartSegment[];
} | {
  type: "chart";
  chartType: "bar" | "area" | "line"; /** Short chart heading. */
  title: string; /** Ordered categories shared by every series. */
  categories: string[];
  series: MessagePresentationChartSeries[];
  xLabel?: string;
  yLabel?: string;
};
/** Scalar cell value supported by portable table presentations. */
type MessagePresentationTableCell = string | number;
/** Portable table rendered natively where supported and linearly elsewhere. */
type MessagePresentationTableBlock = {
  type: "table"; /** Short table heading used by native renderers and fallback text. */
  caption: string; /** Unique ordered column labels shared by every row. */
  headers: string[]; /** Rows whose width exactly matches the header count. */
  rows: MessagePresentationTableCell[][]; /** Optional column whose cells should be rendered as row headers. */
  rowHeaderColumnIndex?: number;
};
type MessagePresentationBlock = MessagePresentationTextBlock | MessagePresentationContextBlock | MessagePresentationDividerBlock | MessagePresentationButtonsBlock | MessagePresentationSelectBlock | MessagePresentationChartBlock | MessagePresentationTableBlock;
type MessagePresentation = {
  /** Optional short heading rendered before blocks when the channel supports it. */title?: string; /** Optional severity/status tone for renderers that support toned presentations. */
  tone?: MessagePresentationTone; /** Ordered portable blocks rendered or downgraded by the target channel adapter. */
  blocks: MessagePresentationBlock[];
};
type ReplyPayloadDeliveryPin = {
  enabled: boolean;
  notify?: boolean;
  required?: boolean;
};
type ReplyPayloadDelivery = {
  pin?: boolean | ReplyPayloadDeliveryPin;
};
//#endregion
//#region src/auto-reply/reply-payload.d.ts
type ReplyMediaAttachment = {
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
  height?: number; /** Internal per-URL trust carried until mixed media is split for history projection. */
  trustedLocalMedia?: boolean;
};
/** Channel-agnostic assistant reply payload. */
type ReplyPayload = {
  text?: string; /** Visible body a channel adapter may use when native structured content requires text. */
  fallbackText?: {
    text: string; /** Batch payload replaced when the adapter adopts this fallback body. */
    replacesPayloadIndex?: number;
  };
  mediaUrl?: string;
  mediaUrls?: string[]; /** Prepared metadata aligned with mediaUrls for client-facing history projection. */
  attachments?: ReplyMediaAttachment[]; /** Internal-only trust signal for gateway webchat local media embedding. */
  trustedLocalMedia?: boolean; /** Treat media as live-only content and avoid persisting the underlying media reference. */
  sensitiveMedia?: boolean; /** Channel-agnostic rich presentation. Core degrades or asks the channel renderer to map it. */
  presentation?: MessagePresentation; /** Runtime-authored text is the exact fallback, not additional native presentation content. */
  presentationTextMode?: "fallback"; /** Channel-agnostic delivery preferences, e.g. pin the sent message when supported. */
  delivery?: ReplyPayloadDelivery;
  /**
   * @deprecated Use presentation.
   *
   * Internal legacy representation used by existing approval/reply helpers during migration.
   */
  interactive?: InteractiveReply;
  btw?: {
    question: string;
  };
  replyToId?: string;
  replyToTag?: boolean; /** True when [[reply_to_current]] was present but not yet mapped to a message id. */
  replyToCurrent?: boolean; /** Send audio as voice message (bubble) instead of audio file. Defaults to false. */
  audioAsVoice?: boolean; /** Send video media as a round video note when the channel supports it. */
  videoAsNote?: boolean; /** Channel-neutral geographic location or named place. */
  location?: OutboundLocation;
  /**
   * Text synthesized into an audio-only TTS payload. Exposed to hooks for
   * archival/search use when no visible channel text is sent.
   */
  spokenText?: string;
  /**
   * Marks a TTS media payload as supplemental audio for assistant text that is
   * already visible through streaming or transcript projection.
   */
  ttsSupplement?: ReplyPayloadTtsSupplement;
  isError?: boolean;
  /** Marks this payload as a reasoning/thinking block. Channels that do not
   *  have a dedicated reasoning lane (e.g. WhatsApp, web) should suppress it. */
  isReasoning?: boolean; /** Marks pre-tool commentary (💬) — a display lane, suppressed unless the channel opts in. */
  isCommentary?: boolean; /** Reasoning stream text is a complete replacement snapshot, not a delta. */
  isReasoningSnapshot?: boolean;
  /** Marks this payload as a compaction status notice (start/end).
   *  Should be excluded from TTS transcript accumulation so compaction
   *  status lines are not synthesised into the spoken assistant reply. */
  isCompactionNotice?: boolean; /** Marks this payload as a model-fallback transition/recovery notice. */
  isFallbackNotice?: boolean; /** Marks this payload as transient status, not assistant answer content. */
  isStatusNotice?: boolean; /** Channel-specific payload data (per-channel envelope). */
  channelData?: Record<string, unknown>;
};
/** Metadata for audio-only media that supplements already-visible assistant text. */
type ReplyPayloadTtsSupplement = {
  spokenText: string;
  visibleTextAlreadyDelivered?: boolean;
};
/** Reply policy facts that provider adapters use to resolve the final transport route. */
type ReplyDeliveryContext = {
  chatType?: "direct" | "group" | "channel" | null;
  replyToMode: ReplyToMode;
};
//#endregion
//#region src/channels/streaming.d.ts
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
};
//#endregion
//#region packages/media-core/src/constants.d.ts
/** Canonical media families used by attachment facts, routing, and MIME classification. */
type MediaKind = "image" | "audio" | "video" | "document" | "sticker" | "unknown";
/** Maps a MIME type to the media family used for size limits and routing. */
declare function mediaKindFromMime(mime?: string | null): MediaKind | undefined;
//#endregion
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
//#endregion
//#region src/media/media-facts.d.ts
/** One ordered runtime attachment; array position is its alignment identity. */
type MediaFact = {
  path?: string;
  url?: string;
  contentType?: string;
  kind?: MediaKind;
  fileName?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
  transcribed?: boolean;
  messageId?: string;
  workspaceDir?: string; /** Internal proof that this exact fact was covered by a legacy staged projection. */
  staged?: boolean;
  hydrationSuppressed?: boolean;
};
declare const LEGACY_MEDIA_CONTEXT_KEYS: readonly ["MediaPath", "MediaPaths", "MediaUrl", "MediaUrls", "MediaType", "MediaTypes", "MediaDir", "MediaTranscribedIndexes", "MediaStaged", "MediaWorkspaceDir"];
type LegacyMediaContextKey = (typeof LEGACY_MEDIA_CONTEXT_KEYS)[number];
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined; /** Fences recovery-only transcript writes against concurrent ownership changes. */
  mainRestartRecoveryCycleId: string | undefined;
  mainRestartRecoveryRevision: number | undefined;
  restartRecoveryBeforeAgentReplyState: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryRequestFingerprint: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryTerminalRunIds: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  status: SessionRunStatus | undefined;
};
/** Lifecycle fields committed with an accepted transcript turn. */
type SessionTranscriptTurnLifecyclePatch = {
  abortedLastRun?: boolean;
  endedAt?: number;
  lifecycleRunId?: InternalSessionEntry["lifecycleRunId"];
  pendingFinalDelivery?: InternalSessionEntry["pendingFinalDelivery"];
  mainRestartRecovery?: InternalSessionEntry["mainRestartRecovery"];
  restartRecoveryBeforeAgentReplyState?: SessionRestartRecoveryState["restartRecoveryBeforeAgentReplyState"];
  restartRecoveryDeliveryReceiptState?: SessionRestartRecoveryState["restartRecoveryDeliveryReceiptState"];
  restartRecoveryDeliveryToolCallId?: SessionRestartRecoveryState["restartRecoveryDeliveryToolCallId"];
  restartRecoveryDeliveryContext?: SessionRestartRecoveryState["restartRecoveryDeliveryContext"];
  restartRecoveryDeliveryRequestFingerprint?: SessionRestartRecoveryState["restartRecoveryDeliveryRequestFingerprint"];
  restartRecoveryDeliveryRunId?: SessionRestartRecoveryState["restartRecoveryDeliveryRunId"];
  restartRecoveryDeliverySourceRunId?: SessionRestartRecoveryState["restartRecoveryDeliverySourceRunId"];
  restartRecoveryRequesterAccountId?: SessionRestartRecoveryState["restartRecoveryRequesterAccountId"];
  restartRecoveryRequesterSenderId?: SessionRestartRecoveryState["restartRecoveryRequesterSenderId"];
  restartRecoverySameChannelThreadRequired?: SessionRestartRecoveryState["restartRecoverySameChannelThreadRequired"];
  restartRecoverySourceIngress?: SessionRestartRecoveryState["restartRecoverySourceIngress"];
  restartRecoverySourceReplyDeliveryMode?: SessionRestartRecoveryState["restartRecoverySourceReplyDeliveryMode"];
  restartRecoveryForceSafeTools?: InternalSessionEntry["restartRecoveryForceSafeTools"];
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"]; /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: SessionRunStatus;
  updatedAt?: number;
};
//#endregion
//#region src/sessions/input-provenance.d.ts
declare const INPUT_PROVENANCE_KIND_VALUES: readonly ["external_user", "inter_session", "internal_system"];
type InputProvenanceKind = (typeof INPUT_PROVENANCE_KIND_VALUES)[number];
type InputProvenance = {
  kind: InputProvenanceKind;
  originSessionId?: string;
  sourceSessionKey?: string;
  sourceChannel?: string;
  sourceTool?: string;
};
//#endregion
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = SessionEntry;
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}>;
type UserTurnTranscriptUpdateMode = "inline" | "none";
type UserTurnBeforeMessageWrite = (params: {
  message: PersistedUserTurnMessage;
  agentId?: string;
  sessionKey?: string;
}) => AgentMessage | null;
type UserTurnTranscriptPersistenceTarget = {
  sessionId: string;
  expectedSessionId?: string;
  sessionKey: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  sessionStore?: Record<string, UserTurnSessionEntry>;
  storePath?: string;
  agentId: string;
  threadId?: string | number;
  cwd?: string;
  config?: unknown;
  beforeMessageWrite?: UserTurnBeforeMessageWrite;
};
type UserTurnTranscriptTarget = UserTurnTranscriptPersistenceTarget;
type UserTurnTranscriptAdmissionReceipt = TranscriptTurnAdmission;
type UserTurnTranscriptPersistResult = {
  /** True only when this call inserted the transcript message. */appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>; /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  getPersistedMessage?: () => PersistedUserTurnMessage | undefined;
  getAdmissionReceipt: () => UserTurnTranscriptAdmissionReceipt | undefined;
  setAdmissionHandler?: (handler: (admission: UserTurnTranscriptAdmissionReceipt) => void) => void;
  markSentToProvider?: () => void;
  markRuntimePersistencePending: (pending: Promise<void>) => void;
  markRuntimePersisted: (message?: PersistedUserTurnMessage, anchor?: TranscriptEntryAnchor | UserTurnTranscriptAdmissionReceipt) => void;
  markBlocked: () => void;
  hasPersisted: () => boolean;
  isBlocked: () => boolean;
  hasRuntimePersistencePending: () => boolean;
  waitForRuntimePersistence: () => Promise<void>;
  persistApproved: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
    expectedSessionId?: string;
    expectedSessionState?: SessionTranscriptTurnExpectedState;
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch; /** Allow a later explicit persistence attempt when this attempt appends nothing. */
    retryIfUnpersisted?: boolean;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistBlocked: (message: PersistedUserTurnMessage, params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
  persistFallback: (params?: {
    target?: UserTurnTranscriptTargetResolver;
    updateMode?: UserTurnTranscriptUpdateMode;
    cwd?: string;
  }) => Promise<UserTurnTranscriptPersistResult | undefined>;
};
//#endregion
//#region src/auto-reply/reply/typing.d.ts
/** Controller for channel typing indicator lifecycle during a reply run. */
type TypingController = {
  onReplyStart: () => Promise<void>;
  startTypingLoop: () => Promise<void>;
  startTypingOnText: (text?: string) => Promise<void>;
  refreshTypingTtl: () => void;
  isActive: () => boolean;
  markRunComplete: () => void;
  markDispatchIdle: () => void;
  cleanup: () => void;
};
//#endregion
//#region src/auto-reply/get-reply-options.types.d.ts
type BlockReplyContext = {
  abortSignal?: AbortSignal;
  timeoutMs?: number; /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
};
/** Context passed to onModelSelected callback with actual model used. */
type ModelSelectedContext = {
  provider: string;
  model: string;
  thinkLevel: string | undefined;
};
/** Typing indicator class for channel-owned UX policy. */
type TypingPolicy = "auto" | "user_message" | "system_event" | "internal_webchat" | "heartbeat";
/** Per-turn policy for source-message reply threading. */
type ReplyThreadingPolicy = {
  /** Override implicit reply-to-current behavior for the current turn. */implicitCurrentMessage?: "default" | "allow" | "deny";
};
/** Action sink available for model-proposed follow-up tasks during this turn. */
type TaskSuggestionDeliveryMode = "gateway";
/** Correlates queued reply ownership transfer with later delivery drains. */
type QueuedReplyDeliveryCorrelation = {
  begin: () => (() => void) | void;
};
/**
 * Exclusive: each lifecycle is its own collect-admission identity.
 * Cancel-only: share collect identity via ownerKey (gateway chat.send).
 */
type TurnAdoptionAdmission = "exclusive" | "cancel-only";
/**
 * Canonical turn-ownership lifecycle (adopt / defer / abandon / settle).
 * Single surface for durable ingress, gateway cancel identity, and reply-lane transfer.
 */
type TurnAdoptionLifecycle = {
  /**
   * Admission isolation mode (closed). Exclusive isolates collect identity per
   * lifecycle; cancel-only shares via ownerKey. Never inferred from onAbandoned.
   * Durable ingress sets exclusive; gateway cancel identity sets cancel-only.
   */
  admission?: TurnAdoptionAdmission; /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>; /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void; /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void; /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void; /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void; /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal; /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
  cronCreatorAuthorityUnavailable?: "queued-local-operator";
};
/** Partial assistant payload emitted during streaming or replacement updates. */
type PartialReplyPayload = {
  /**
   * Sanitized text, which may be an enumerable memoized getter. Content materializes on first
   * read: direct-delivery consumers pay per partial, while throttled consumers pay per flush.
   */
  text?: ReplyPayload["text"];
  mediaUrls?: ReplyPayload["mediaUrls"];
  delta?: string;
  replace?: true;
};
type ReasoningStreamPayload = Pick<ReplyPayload, "text" | "mediaUrls" | "isReasoning" | "isReasoningSnapshot"> & {
  requiresReasoningProgressOptIn?: boolean;
};
type ReasoningProgressPayload = {
  progressTokens: number;
};
/** Return false until the channel has accepted operator-visible progress. */
type ProgressCallbackResult = boolean | void;
/** Reply generation options shared by auto-reply, webchat, channels, and tests. */
type GetReplyOptions = {
  /** Override run id for agent events (defaults to random UUID). */runId?: string; /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string; /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal; /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[]; /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[]; /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[]; /** Notifies when an agent run actually starts (useful for webchat command handling). */
  onAgentRunStart?: (runId: string) => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle; /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder; /** Gateway already attempted exact active-run injection for this turn. */
  messageInjectionAttempted?: true; /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void; /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void; /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean; /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy; /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean; /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string; /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string; /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode; /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number; /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight"; /** If true, suppress tool error warning payloads for this run. */
  suppressToolErrorWarnings?: boolean; /** Dynamic form used when verbose progress visibility can change mid-run. */
  shouldSuppressToolErrorWarnings?: () => boolean | undefined; /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean; /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[]; /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean; /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean; /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void; /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean; /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when a concrete work item starts, updates, or completes. */
  onItemEvent?: (payload: {
    itemId?: string;
    toolCallId?: string;
    kind?: string;
    title?: string;
    name?: string;
    phase?: string;
    status?: string;
    summary?: string;
    progressText?: string;
    meta?: string;
    commandBearing?: boolean;
    approvalId?: string;
    approvalSlug?: string;
    suppressDurableProgress?: true;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /**
   * Called when the utility-model narration of the in-progress turn changes.
   * Providing this callback opts the channel into progress narration; core
   * only generates narration when a utility model resolves (explicit
   * config or the provider-declared default; utilityModel: "" disables).
   * An empty text clears narration; a retained model preamble still wins before
   * the channel falls back to raw tool progress.
   */
  onNarrationUpdate?: (payload: {
    text: string;
  }) => Promise<void> | void; /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void; /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean; /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean; /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean; /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean; /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean; /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when an approval becomes pending or resolves. */
  onApprovalEvent?: (payload: {
    phase?: string;
    kind?: string;
    status?: string;
    title?: string;
    itemId?: string;
    toolCallId?: string;
    approvalId?: string;
    approvalSlug?: string;
    command?: string;
    host?: string;
    reason?: string;
    scope?: "turn" | "session";
    message?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when command output streams or completes. */
  onCommandOutput?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    output?: string;
    status?: string;
    exitCode?: number | null;
    durationMs?: number;
    cwd?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when a patch completes with a file summary. */
  onPatchSummary?: (payload: {
    itemId?: string;
    phase?: string;
    title?: string;
    toolCallId?: string;
    name?: string;
    added?: string[];
    modified?: string[];
    deleted?: string[];
    summary?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult; /** Called when context auto-compaction completes. */
  onCompactionEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when the actual model is selected (including after fallback).
   * Use this to get model/provider/thinkLevel for responsePrefix template interpolation. */
  onModelSelected?: (ctx: ModelSelectedContext) => void;
  /**
   * Controls whether normal assistant replies are automatically delivered to
   * the source conversation. `message_tool_only` prefers message-tool visible
   * delivery and keeps normal final text, block output, and preview output
   * private unless dispatch explicitly marks a source reply as deliverable.
   */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode; /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[]; /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void; /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void; /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean; /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void; /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean; /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number; /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[]; /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
};
//#endregion
//#region src/channels/inbound-event/kind.d.ts
/**
 * High-level inbound event class used to separate actionable user requests from room activity.
 */
type InboundEventKind = "user_request" | "room_event";
//#endregion
//#region src/plugins/hook-channel-context.types.d.ts
interface PluginHookChannelSenderContext {
  /** Channel-scoped sender ID, matching `ctx.senderId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelChatContext {
  /** Transport-native conversation ID, matching `ctx.chatId` when both are present. */
  id?: string;
  [key: string]: unknown;
}
interface PluginHookChannelContext {
  /** Sender metadata supplied by the originating channel. */
  sender?: PluginHookChannelSenderContext;
  /** Chat/conversation metadata supplied by the originating channel. */
  chat?: PluginHookChannelChatContext;
}
//#endregion
//#region src/auto-reply/command-turn-context.d.ts
type CommandTurnKind = "native" | "text-slash" | "normal";
type BaseCommandTurnContext = {
  commandName?: string;
  body?: string;
};
type NativeCommandTurnContext = BaseCommandTurnContext & {
  kind: "native";
  source: "native";
  authorized: boolean;
};
type TextSlashCommandTurnContext = BaseCommandTurnContext & {
  kind: "text-slash";
  source: "text";
  authorized: boolean;
};
type NormalCommandTurnContext = BaseCommandTurnContext & {
  kind: "normal";
  source: "message";
  authorized: false;
};
type CommandTurnContext = NativeCommandTurnContext | TextSlashCommandTurnContext | NormalCommandTurnContext;
//#endregion
//#region src/auto-reply/commands-args.types.d.ts
/** Primitive values accepted by parsed auto-reply command args. */
type CommandArgValue = string | number | boolean | bigint;
/** Named parsed auto-reply command values. */
type CommandArgValues = Record<string, CommandArgValue>;
/** Parsed command argument bundle with raw source and structured values. */
type CommandArgs = {
  raw?: string;
  values?: CommandArgValues;
};
//#endregion
//#region src/auto-reply/reply/history.types.d.ts
/** Normalized history message used when building reply context. */
type HistoryEntry = {
  sender: string;
  body: string;
  timestamp?: number;
  messageId?: string;
  media?: HistoryMediaEntry[];
};
/** Media metadata attached to a normalized history message. */
type HistoryMediaEntry = Pick<MediaFact, "contentType" | "durationMs" | "height" | "kind" | "messageId" | "path" | "url" | "width">;
//#endregion
//#region src/auto-reply/templating.d.ts
/** Valid message channels for routing. */
type OriginatingChannelType = string & {
  readonly __originatingChannelBrand?: never;
};
type MentionSource = "explicit_bot" | "subteam" | "mention_pattern" | "implicit_thread" | "command_bypass" | "none";
type InboundSourceModality = "text" | "voice" | "audio" | "image" | "video" | "document";
type StickerContextMetadata = {
  cachedDescription?: string;
  emoji?: string;
  setName?: string;
  description?: string;
  fileId?: string;
  fileUniqueId?: string;
  uniqueFileId?: string;
  isAnimated?: boolean;
  isVideo?: boolean;
} & Record<string, unknown>;
type ChannelStructuredContextEntry = {
  label: string;
  source?: string;
  type?: string;
  payload: unknown; /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[]; /** Internal visible-text hints for legacy assistant rows without transcript ids. */
  sessionTranscriptAssistantTextDedupeKeys?: string[];
};
type SessionTranscriptContext = {
  chatWindow?: boolean;
  historyLimit: number;
  beforeTimestampMs?: number;
  minTimestampMs?: number;
  senderLabels?: {
    assistant: string;
    user: string;
  };
};
/** @deprecated Use ChannelStructuredContextEntry. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
type UntrustedStructuredContextEntry = ChannelStructuredContextEntry;
/** Structured supplemental facts projected into prompt context by inbound finalization. */
type SupplementalContextFacts = {
  quote?: {
    id?: string;
    fullId?: string;
    body?: string;
    sender?: string;
    senderAllowed?: boolean;
    isExternal?: boolean;
    isQuote?: boolean;
  };
  forwarded?: {
    from?: string;
    fromType?: string;
    fromId?: string;
    date?: number;
    senderAllowed?: boolean;
  };
  thread?: {
    id?: string;
    starterBody?: string;
    historyBody?: string;
    label?: string;
    parentSessionKey?: string;
    modelParentSessionKey?: string;
    senderAllowed?: boolean;
  };
  channelStructuredContext?: ChannelStructuredContextEntry[]; /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string; /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */commandText: string; /** Prompt-facing text used for the agent turn. */
  agentText: string; /** Normalized visible/raw inbound text before command-specific projection. */
  rawText: string;
};
/** Raw inbound message context accepted from channels before finalization. */
type MsgContext = Partial<CanonicalInboundText> & {
  Body?: string;
  InboundEventKind?: InboundEventKind;
  /**
   * Agent prompt body (may include envelope/history/context). Prefer this for prompt shaping.
   * Should use real newlines (`\n`), not escaped `\\n`.
   */
  BodyForAgent?: string;
  /**
   * Recent chat history for context (untrusted user content). Prefer passing this
   * as structured context blocks in the user prompt rather than rendering plaintext envelopes.
   */
  InboundHistory?: HistoryEntry[]; /** Internal facts used to merge canonical transcript turns before dispatch. */
  SessionTranscriptContext?: SessionTranscriptContext;
  /**
   * @deprecated Use CommandBody.
   *
   * Raw message body without structural context (history, sender labels).
   * Legacy alias for CommandBody. Falls back to Body if not set.
   */
  RawBody?: string;
  /**
   * Prefer for command detection; RawBody is treated as legacy alias.
   */
  CommandBody?: string;
  /**
   * Command parsing body. Prefer this over CommandBody/RawBody when set.
   * Should be the "clean" text (no history/sender context).
   */
  BodyForCommands?: string;
  CommandArgs?: CommandArgs;
  From?: string;
  To?: string;
  SessionKey?: string;
  /**
   * Resolved agent scope for canonical session keys that do not encode the agent
   * id, such as selected-agent global sessions.
   */
  AgentId?: string; /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string; /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string; /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number; /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy; /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string; /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
  ReplyToIdFull?: string;
  ReplyToBody?: string;
  ReplyToQuoteText?: string;
  ReplyToSender?: string;
  ReplyChain?: Array<{
    messageId?: string;
    threadId?: string;
    sender?: string;
    senderId?: string;
    senderUsername?: string;
    timestamp?: number;
    body?: string;
    isQuote?: boolean;
    mediaType?: string;
    mediaPath?: string;
    mediaRef?: string;
    replyToId?: string;
    forwardedFrom?: string;
    forwardedFromId?: string;
    forwardedFromUsername?: string;
    forwardedDate?: number;
  }>;
  ReplyToIsQuote?: boolean; /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
  ReplyToForwardedFrom?: string;
  ReplyToForwardedFromType?: string;
  ReplyToForwardedFromId?: string;
  ReplyToForwardedFromUsername?: string;
  ReplyToForwardedFromTitle?: string;
  ReplyToForwardedDate?: number;
  ForwardedFrom?: string;
  ForwardedFromType?: string;
  ForwardedFromId?: string;
  ForwardedFromUsername?: string;
  ForwardedFromTitle?: string;
  ForwardedFromSignature?: string;
  ForwardedFromChatType?: string;
  ForwardedFromMessageId?: number;
  ForwardedDate?: number;
  ThreadStarterBody?: string; /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string; /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string; /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string; /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string; /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string; /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[]; /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[]; /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[]; /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[]; /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality; /** @deprecated Use each media fact's `workspaceDir`. */
  MediaWorkspaceDir?: string;
  /** Attachment indexes whose audio was already transcribed before media understanding runs. */
  /** @deprecated Use each media fact's `transcribed` field. */
  MediaTranscribedIndexes?: number[];
  /**
   * Marker: skip downstream stageSandboxMedia. chat.send RPC sets this so
   * staging runs synchronously before respond() and surfaces 5xx to the
   * client; any later failure only reaches the broadcast channel.
   */
  /** @deprecated Use each media fact's `workspaceDir` or `staged` proof. */
  MediaStaged?: boolean; /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata; /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean; /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string; /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string; /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig; /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string; /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string; /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts; /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[]; /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[]; /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[]; /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[]; /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance; /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string; /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string; /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string; /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string; /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number; /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number; /** Provider label. */
  Provider?: string; /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string; /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean; /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean; /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean; /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[]; /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[]; /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[]; /** Provider-native source that caused the current mention decision. */
  MentionSource?: MentionSource;
  CommandAuthorized?: boolean;
  CommandTurn?: CommandTurnContext;
  CommandSource?: "text" | "native";
  CommandInterpretationSuppressed?: boolean;
  CommandTargetSessionKey?: string;
  /**
   * Internal flag: command handling prepared trailing prompt text for ACP dispatch.
   * Used for `/new <prompt>` and `/reset <prompt>` on ACP-bound sessions.
   */
  AcpDispatchTailAfterReset?: boolean; /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[]; /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[]; /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>; /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string; /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number; /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number; /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string; /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext; /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string; /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string; /** Telegram forum supergroup marker. */
  IsForum?: boolean; /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string; /** Warning: DM has topics enabled but this message is not in a topic. */
  TopicRequiredButMissing?: boolean;
  /**
   * Originating channel for reply routing.
   * When set, replies should be routed back to this provider
   * instead of using lastChannel from the session.
   */
  OriginatingChannel?: OriginatingChannelType;
  /**
   * Originating destination for reply routing.
   * The chat/channel/user ID where the reply should be sent.
   */
  OriginatingTo?: string;
  /**
   * True when the current turn intentionally requested external delivery to
   * OriginatingChannel/OriginatingTo, rather than inheriting stale session route metadata.
   */
  ExplicitDeliverRoute?: boolean;
  /**
   * Internal proof that the channel ingress owner admitted this sender/event.
   * Correlation interceptors must fail closed when this proof is absent.
   */
  InboundAccessAuthorized?: boolean;
  /**
   * Internal flag for channels that emit message_received through a channel-specific
   * privacy gate before entering the shared reply dispatcher.
   */
  SuppressMessageReceivedHooks?: boolean;
  /**
   * Provider-specific parent conversation id for threaded contexts.
   * For Discord threads, this is the parent channel id.
   */
  ThreadParentId?: string;
  /**
   * Messages from hooks to be included in the response.
   * Used for hook confirmation messages like "Session context saved to memory".
   */
  HookMessages?: string[];
};
type FinalizedMsgContext = Omit<MsgContext, "CommandAuthorized"> & {
  /**
   * Always set by finalizeInboundContext().
   * Default-deny: missing/undefined becomes false.
   */
  CommandAuthorized: boolean;
  /**
   * Populated by finalizeInboundContext(); optional for public SDK
   * compatibility with existing plugin-constructed finalized contexts.
   */
  CommandTurn?: CommandTurnContext;
};
type RuntimeMediaContextKey = "MediaPath" | "MediaUrl" | "MediaType" | "MediaDir" | "MediaPaths" | "MediaUrls" | "MediaTypes" | "MediaWorkspaceDir" | "MediaTranscribedIndexes" | "MediaStaged";
/** Internal inbound context; legacy media fields exist only on the shipped SDK adapter. */
type RuntimeMsgContext = Omit<MsgContext, RuntimeMediaContextKey>;
type FinalizedRuntimeMsgContext = Omit<RuntimeMsgContext, "CommandAuthorized" | keyof CanonicalInboundText> & CanonicalInboundText & {
  CommandAuthorized: boolean;
  CommandTurn?: CommandTurnContext;
};
//#endregion
export { ReplyMediaAttachment as A, TranscriptTurnAdmission as B, LegacyMediaContextKey as C, mediaKindFromMime as D, MediaKind as E, MessagePresentationButton as F, ModelPickerAction as I, ReplyPayloadDelivery as L, LegacyInteractiveReply as M, MessagePresentation as N, AgentPlanStep as O, MessagePresentationAction as P, ReplyPayloadDeliveryPin as R, InputProvenance as S, PromptImageOrderEntry as T, TranscriptTurnBoundary as V, GetReplyOptions as _, MsgContext as a, TurnAdoptionLifecycle as b, SupplementalContextFacts as c, CommandArgValues as d, CommandTurnContext as f, BlockReplyContext as g, InboundEventKind as h, MentionSource as i, ReplyPayload as j, ReplyDeliveryContext as k, HistoryEntry as l, PluginHookChannelContext as m, FinalizedRuntimeMsgContext as n, OriginatingChannelType as o, CommandTurnKind as p, InboundSourceModality as r, SessionTranscriptContext as s, FinalizedMsgContext as t, HistoryMediaEntry as u, PartialReplyPayload as v, MediaFact as w, UserTurnTranscriptRecorder as x, TaskSuggestionDeliveryMode as y, TranscriptEntryAnchor as z };