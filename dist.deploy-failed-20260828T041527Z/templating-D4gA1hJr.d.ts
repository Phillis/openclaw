import { _t as GroupToolPolicyConfig } from "./types.openclaw-CflOMr0r.js";
import { t as FastMode } from "./string-coerce-DjUc69CC.js";
import { A as StreamingMode, C as ReplyToMode, c as ChannelStreamingCommandTextMode, d as ChannelStreamingProgressConfig, h as DmScope, i as BlockStreamingCoalesceConfig, j as TextChunkMode } from "./types.base-AciWfV9W.js";
import { o as ImageContent } from "./types-CL_qQaPo.js";
import { t as AgentMessage } from "./types-CPd3N9Q-.js";
import { i as ReplyPayload } from "./reply-payload-DrFti5n9.js";
import { b as SessionCreatedActor, c as SessionEntry, g as SessionRestartRecoveryState, i as InternalSessionEntry, x as SessionCreatedVia, y as SourceReplyDeliveryMode } from "./types-CheMd8wT.js";
import { t as InboundEventKind } from "./kind-CC2t750M.js";
import { c as MediaUnderstandingDecision, k as MediaUnderstandingOutput } from "./types-DjaZR6Mg.js";
import { n as MediaFact, r as MediaFactInput } from "./media-facts-DiJU7b10.js";
import { n as CommandArgs } from "./commands-args.types-zglMcgeO.js";
import { t as HistoryEntry } from "./history.types-iIF09aVV.js";
import { t as StreamingCompatEntry } from "./streaming-config-readers-B-h0E9Du.js";
import { ut as SessionRunStatus } from "./index-DDvcPW_b.js";
import { Static, Type } from "typebox";
//#region src/media/prompt-image-order.d.ts
/** Tracks whether prompt images stayed inline or were offloaded while preserving model order. */
type PromptImageOrderEntry = "inline" | "offloaded";
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
//#region src/auto-reply/command-turn-context.d.ts
type CommandTurnKind = "native" | "text-slash" | "normal";
/** Transport-level source labels carried through auto-reply dispatch. */
type CommandTurnSource = "native" | "text" | "message";
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
/** Builds a normalized command-turn context and forces normal messages to unauthorized. */
declare function createCommandTurnContext(source: CommandTurnSource, input: {
  authorized: boolean;
  commandName?: string;
  body?: string;
}): CommandTurnContext;
/** Returns true for channel-native command turns. */
declare function isNativeCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true for text slash-command turns regardless of authorization. */
declare function isTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
declare function isAuthorizedTextSlashCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
/** Returns true when a turn was explicitly invoked by a native or authorized text command. */
declare function isExplicitCommandTurn(commandTurn: CommandTurnContext | undefined): boolean;
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
//#region src/channels/streaming.d.ts
declare function isChannelProgressDraftWorkToolName(name: string | null | undefined): boolean;
declare function isPotentialTruncatedFinal(finalText: string): boolean;
declare function selectLongerFinalText(params: {
  finalText: string;
  candidateTexts: readonly (string | undefined)[];
}): string | undefined;
declare function resolveTranscriptBackedChannelFinalText(params: {
  finalText: string;
  resolveCandidateText: () => Promise<string | undefined>;
}): Promise<string>;
type ChannelProgressLineOptions = {
  /** Whether generated tool details should use Markdown formatting. */
  markdown?: boolean;
  /** Detail shape for tool arguments shown in progress drafts. */
  detailMode?: "explain" | "raw";
  /** Whether command progress should show raw command text or status-only copy. */
  commandText?: ChannelStreamingCommandTextMode;
};
type AgentPlanStepStatus = "pending" | "in_progress" | "completed";
type AgentPlanStep = {
  step: string;
  status: AgentPlanStepStatus;
};
type AgentPlanStepInput = AgentPlanStep | string;
/**
 * TODO(remove): normalizes the pre-2026.7.2 string plan-step wire shape to
 * pending typed steps. Bundled producers all emit typed steps, and
 * @openclaw/codex is force-updated with core, so this only covers a plugin
 * pinned against an update. Delete once that cannot happen.
 */
declare function normalizeAgentPlanSteps(value: unknown): AgentPlanStep[] | undefined;
type ChannelProgressDraftLineInput = {
  event: "tool";
  itemId?: string;
  toolCallId?: string;
  name?: string;
  phase?: string;
  args?: Record<string, unknown>;
} | {
  event: "item";
  itemId?: string;
  toolCallId?: string;
  itemKind?: string;
  title?: string;
  name?: string;
  phase?: string;
  status?: string;
  summary?: string;
  progressText?: string;
  meta?: string;
  commandBearing?: boolean;
} | {
  event: "plan";
  phase?: string;
  title?: string;
  explanation?: string;
  steps?: readonly AgentPlanStepInput[];
} | {
  event: "approval";
  phase?: string;
  title?: string;
  command?: string;
  reason?: string;
  message?: string;
} | {
  event: "command-output";
  itemId?: string;
  toolCallId?: string;
  phase?: string;
  title?: string;
  name?: string;
  status?: string;
  exitCode?: number | null;
} | {
  event: "patch";
  itemId?: string;
  toolCallId?: string;
  phase?: string;
  title?: string;
  name?: string;
  added?: string[];
  modified?: string[];
  deleted?: string[];
  summary?: string;
};
type ChannelProgressDraftLineKind = ChannelProgressDraftLineInput["event"];
type ChannelProgressDraftLine = {
  /** Stable line id used to update an existing progress line in place. */
  id?: string;
  /** Progress event family that produced this line. */
  kind: ChannelProgressDraftLineKind;
  /** Rendered line text before final draft truncation/prefix formatting. */
  text: string;
  /** Human-readable label for UI renderers. */
  label: string;
  /** Optional leading icon for rich or plain progress renderers. */
  icon?: string;
  /** Compact detail text separated from label/icon. */
  detail?: string;
  /** Optional lifecycle status, such as completed or exit code. */
  status?: string;
  /** Normalized tool name when the line represents tool work. */
  toolName?: string;
  /** Whether final formatting should add a bullet/line prefix. */
  prefix?: boolean;
};
declare function formatChannelProgressDraftLine(
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined,
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function formatChannelProgressDraftLineForEntry(
/** Channel streaming config source for command-text defaults. */
entry: StreamingCompatEntry | null | undefined,
/** Structured progress event to render as one draft line. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): string | undefined;
declare function buildChannelProgressDraftLine(
/** Structured progress event to normalize into draft-line metadata. */
input: ChannelProgressDraftLineInput,
/** Formatting options for tool details and command text. */
options?: ChannelProgressLineOptions): ChannelProgressDraftLine | undefined;
declare function createChannelProgressDraftGate(params: {
  /** Callback that starts the channel progress draft. */
  onStart: () => void | Promise<void>;
  /** Delay after the first work event before a draft starts. */
  initialDelayMs?: number;
  /** Reports timer-fired startup failures, which have no awaiting caller. */
  onStartError?: (error: unknown) => void;
  /** Timer implementation, injectable for tests. */
  setTimeoutFn?: typeof setTimeout;
  /** Timer clearer, injectable for tests. */
  clearTimeoutFn?: typeof clearTimeout;
}): {
  readonly hasStarted: boolean;
  readonly workEvents: number;
  noteWork(): Promise<boolean>;
  startNow(): Promise<void>;
  cancel(): void;
  reset(): void;
};
declare function resolveChannelStreamingChunkMode(entry: StreamingCompatEntry | null | undefined): TextChunkMode | undefined;
declare function resolveChannelStreamingBlockEnabled(entry: StreamingCompatEntry | null | undefined): boolean | undefined;
declare function resolveChannelStreamingBlockEnabled(entry: StreamingCompatEntry | null | undefined, previewPolicy: {
  previewAvailable: boolean;
  blockStreamingDefault?: "off" | "on";
}): boolean;
declare function resolveChannelStreamingBlockCoalesce(entry: StreamingCompatEntry | null | undefined): BlockStreamingCoalesceConfig | undefined;
declare function resolveChannelStreamingPreviewToolProgress(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean,
/**
 * The channel's resolved stream mode. Only the caller knows it: channels pick
 * their own default when `streaming.mode` is unset (Telegram uses "progress",
 * Discord uses "off", and Slack uses "progress"), and this helper has no
 * channel identity to guess with. Omitting it reads the configured mode and
 * treats unset as "partial".
 */
mode?: StreamingMode): boolean;
declare function resolveChannelStreamingProgressCommentary(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean,
/**
 * The channel's resolved stream mode, for the same reason
 * resolveChannelStreamingPreviewToolProgress takes one: only the caller knows
 * which default applies when `streaming.mode` is unset. Guessing "partial"
 * here made `progress.commentary: true` a silent no-op on the progress-draft
 * channels, such as Telegram, whose own default is "progress".
 */
mode?: StreamingMode): boolean;
declare function resolveChannelStreamingProgressNarration(entry: StreamingCompatEntry | null | undefined, defaultValue?: boolean): boolean;
declare function resolveChannelStreamingPreviewCommandText(entry: StreamingCompatEntry | null | undefined, defaultValue?: ChannelStreamingCommandTextMode): ChannelStreamingCommandTextMode;
declare function resolveChannelStreamingSuppressDefaultToolProgressMessages(entry: StreamingCompatEntry | null | undefined, options?: {
  draftStreamActive?: boolean;
  mode?: StreamingMode;
  previewToolProgressEnabled?: boolean;
  previewStreamingEnabled?: boolean;
}): boolean;
declare function resolveChannelPreviewStreamMode(entry: StreamingCompatEntry | null | undefined, defaultMode: StreamingMode): StreamingMode;
declare function resolveChannelProgressDraftConfig(entry: StreamingCompatEntry | null | undefined): ChannelStreamingProgressConfig;
declare function resolveChannelProgressDraftMaxLines(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
declare function resolveChannelProgressDraftMaxLineChars(entry: StreamingCompatEntry | null | undefined, defaultValue?: number): number;
declare function formatPlanChecklistLines(steps: readonly AgentPlanStep[], options: {
  maxLines: number;
  maxLineChars: number;
}): string[];
declare function normalizeChannelProgressDraftLineIdentity(
/** Progress line whose duplicate/update identity should be normalized. */
line: string | ChannelProgressDraftLine | undefined): string;
declare function mergeChannelProgressDraftLine<TLine extends string | ChannelProgressDraftLine>(
/** Existing progress draft lines in display order. */
lines: TLine[],
/** New or updated progress line. */
line: TLine,
/** Merge limits for rolling progress drafts. */
params: {
  maxLines: number;
}): TLine[];
declare function formatChannelProgressDraftText(params: {
  /** Channel streaming config source for progress label and bounds. */
  entry?: StreamingCompatEntry | null;
  /** Ordered progress lines to render. */
  lines: Array<string | ChannelProgressDraftLine>;
  /** Stable seed used when choosing automatic progress labels. */
  seed?: string;
  /** Random source used when choosing automatic progress labels. */
  random?: () => number;
  /** Optional formatter applied after line compaction. */
  formatLine?: (line: string) => string;
  /** Prefix used for plain progress lines that lack their own icon. */
  bullet?: string;
  /** Short narration paragraph; when present it replaces the tool lines. */
  narration?: string;
  /** Latest full plan snapshot, rendered independently from rolling tool lines. */
  plan?: readonly AgentPlanStep[];
}): string;
//#endregion
//#region src/config/sessions/session-transcript-turn-lifecycle.types.d.ts
/** Authoritative lifecycle snapshot required for an atomic transcript admission. */
type SessionTranscriptTurnExpectedState = {
  /** Rejects a run-owned turn after another admitted run takes writer ownership. */
  expectedWriterRunId?: string;
  abortedLastRun: boolean | undefined;
  /** Fences recovery-only transcript writes against concurrent ownership changes. */
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
  lastRunId?: InternalSessionEntry["lastRunId"];
  lastRunError?: InternalSessionEntry["lastRunError"];
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
  restartRecoveryRuns?: InternalSessionEntry["restartRecoveryRuns"];
  /** Durable tombstones merged with the fresh row inside the SQLite write transaction. */
  restartRecoveryTerminalRunIds?: SessionRestartRecoveryState["restartRecoveryTerminalRunIds"];
  runtimeMs?: number;
  startedAt?: number;
  status?: SessionRunStatus;
  updatedAt?: number;
};
//#endregion
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
//#region src/sessions/user-turn-transcript.types.d.ts
type UserTurnSessionEntry = SessionEntry;
type PersistedUserTurnMediaInput = Pick<MediaFactInput, "contentType" | "durationMs" | "fileName" | "height" | "hydrationSuppressed" | "messageId" | "path" | "sizeBytes" | "transcribed" | "url" | "width"> & {
  kind?: string | null;
  workspaceDir?: string | null;
};
type PersistedUserTurnMessage = Extract<AgentMessage, {
  role: "user";
}> & {
  __openclaw?: Record<string, unknown>;
};
type UserTurnInput = {
  text?: string | null;
  media?: readonly PersistedUserTurnMediaInput[] | null;
  /** Restart-safe native image placement; model-visible prompt bytes remain separate. */
  mediaImageLayout?: {
    slots: readonly {
      kind: "inline" | "offloaded";
      factIndex?: number;
    }[];
    suppressedFactIndexes?: readonly number[];
  } | null;
  timestamp?: number;
  idempotencyKey?: string;
  /** Durable transcript message reference used to render and hydrate replies. */
  replyToId?: string;
  /** Bounded display fallback for replies whose target is outside loaded history. */
  replyToPreview?: {
    text: string;
    senderLabel?: string | null;
  } | null;
  senderIsOwner?: boolean;
  provenance?: InputProvenance;
  /** Durable participant attribution. Callers must opt in at the product boundary. */
  sender?: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
  } | null;
  /** Durable transport correlation; stored privately and never rendered into model input. */
  transport?: {
    channel?: string;
    conversationRef?: string;
    messageId?: string;
    replyToId?: string;
    threadId?: string;
  };
};
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
  /** True only when this call inserted the transcript message. */
  appended?: boolean;
  sessionFile: string;
  sessionEntry: UserTurnSessionEntry | undefined;
  messageId: string;
  message: PersistedUserTurnMessage;
  admission: UserTurnTranscriptAdmissionReceipt;
};
type UserTurnTranscriptTargetResolver = UserTurnTranscriptTarget | (() => UserTurnTranscriptTarget | undefined | Promise<UserTurnTranscriptTarget | undefined>);
type UserTurnTranscriptRecorder = {
  readonly message: PersistedUserTurnMessage | undefined;
  resolveMessage: () => Promise<PersistedUserTurnMessage | undefined>;
  /** Replaces generated current-turn text before runtime persistence/provider submission. */
  replaceTextBeforePersistence?: (text: string) => void;
  /** Confirms exact-run steering provenance after transcript commitment is proven. */
  confirmSteerTargetRunIdForPersistence?: (targetRunId: string) => Promise<void>;
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
    sessionLifecyclePatch?: SessionTranscriptTurnLifecyclePatch;
    /** Allow a later explicit persistence attempt when this attempt appends nothing. */
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
  timeoutMs?: number;
  /** Source assistant message index from the upstream stream, when available. */
  assistantMessageIndex?: number;
  /** @internal Stable durable outbound intent owned by the producing runtime. */
  deliveryIntentId?: string;
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
  /** Override implicit reply-to-current behavior for the current turn. */
  implicitCurrentMessage?: "default" | "allow" | "deny";
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
  admission?: TurnAdoptionAdmission;
  /** Transcript branch leaf from which this turn was admitted. */
  originatingLeafEntryId?: string | null;
  onAdopted: () => void | Promise<void>;
  /** Return false to reject followup enqueue. */
  onDeferred?: () => boolean | void;
  /** Deferred turn finished without owning the reply lane. */
  onAbandoned?: () => void;
  /** Always fires when the followup ownership cycle ends (admitted or not). Gateway cleanup. */
  onSettled?: () => void;
  /** Retires cancellation ownership while retaining live identity. */
  onCancellationRetired?: () => void;
  /** Stable cancellation owner for collect-mode batches. */
  ownerKey?: string;
  abortSignal?: AbortSignal;
  /** Ephemeral fact: a direct local operator turn lost fresh cron authority when queued. */
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
  /** Override run id for agent events (defaults to random UUID). */
  runId?: string;
  /** Stable provider prompt-cache affinity key; distinct from run id/idempotency. */
  promptCacheKey?: string;
  /** Abort signal for the underlying agent run. */
  abortSignal?: AbortSignal;
  /** Optional inbound images (used for webchat attachments). */
  images?: ImageContent[];
  /** Original inline/offloaded attachment order for inbound images. */
  imageOrder?: PromptImageOrderEntry[];
  /** Ordered media facts whose model-facing text projection is already present in the prompt. */
  media?: MediaFact[];
  /** Notifies when an agent run actually starts (useful for webchat command handling). */
  onAgentRunStart?: (runId: string, executionIdentityToken?: ExecutionIdentityAdmissionToken) => void;
  /** Reports the terminal agent-run classification to the shared dispatch owner. */
  onAgentRunTerminalOutcome?: (outcome: "completed" | "failed") => void;
  /**
   * Canonical adoption lifecycle (adopted / deferred / abandoned / settled + pre-adoption abort).
   */
  turnAdoptionLifecycle?: TurnAdoptionLifecycle;
  /** Shared lifecycle owner for the current user-turn transcript append. */
  userTurnTranscriptRecorder?: UserTurnTranscriptRecorder;
  /** Gateway-owned start-or-steer decision for this turn. */
  messageInjectionDisposition?: "none" | "accepted" | "rejected";
  /** Current user turn is already durable; replay it without appending another copy. */
  suppressNextUserMessagePersistence?: boolean;
  onReplyStart?: () => Promise<void> | void;
  /** Called when the typing controller cleans up (e.g., run ended with NO_REPLY). */
  onTypingCleanup?: () => void;
  onTypingController?: (typing: TypingController) => void;
  /** If false, send only the initial typing signal without periodic keepalive refreshes. */
  typingKeepalive?: boolean;
  isHeartbeat?: boolean;
  /** Policy-level typing control for run classes (user/system/internal/heartbeat). */
  typingPolicy?: TypingPolicy;
  /** Force-disable typing indicators for this run (system/internal/cross-channel routes). */
  suppressTyping?: boolean;
  /** Resolved heartbeat model override (provider/model string from merged per-agent config). */
  heartbeatModelOverride?: string;
  /** One-shot thinking level override for this run; does not persist to the session. */
  thinkingLevelOverride?: string;
  /** One-shot fast-mode override for this run; does not persist to the session. */
  fastModeOverride?: FastMode;
  /** One-shot auto fast-mode cutoff override in seconds; does not persist to the session. */
  fastModeAutoOnSecondsOverride?: number;
  /** Controls bootstrap workspace context injection (default: full). */
  bootstrapContextMode?: "full" | "lightweight";
  /** If true, suppress tool error warning payloads for this run. */
  suppressToolErrorWarnings?: boolean;
  /** If true, run the model without OpenClaw tools for this turn. */
  disableTools?: boolean;
  /** Runtime tool allow-list for this turn. Empty means no tools. */
  toolsAllow?: string[];
  /** If true, include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean;
  /** If true, keep the heartbeat response tool available even under narrow tool profiles. */
  forceHeartbeatTool?: boolean;
  /**
   * If true, dispatch skips default tool/progress text messages and expects the
   * channel to surface progress via its own streaming/edit UX.
   */
  suppressDefaultToolProgressMessages?: boolean;
  /** Suppress standalone tool/progress text even when verbose progress is enabled. */
  suppressToolProgressMessages?: boolean;
  /** Allow channel-owned tool lifecycle feedback while text progress remains hidden. */
  allowToolLifecycleWhenProgressHidden?: boolean;
  /**
   * Called before dispatch with a live getter for whether verbose standalone
   * progress messages are active for this run. Channels that render tool or
   * commentary progress inside an ephemeral streaming draft should yield those
   * draft lines while the getter returns true, so progress is not rendered in
   * both lanes at once.
   */
  onVerboseProgressVisibility?: (isActive: () => boolean) => void;
  /** Preserve source-event callback start order for stateful channel progress renderers. */
  preserveProgressCallbackStartOrder?: boolean;
  onPartialReply?: (payload: PartialReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningStream?: (payload: ReasoningStreamPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onReasoningProgress?: (payload: ReasoningProgressPayload) => Promise<void> | void;
  streamReasoningInNonStreamModes?: boolean;
  /** Called when a thinking/reasoning block ends. */
  onReasoningEnd?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a new assistant message starts (e.g., after tool call or thinking block). */
  onAssistantMessageStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called synchronously when a block reply is logically emitted, before async
   * delivery drains. Useful for channels that need to rotate preview state at
   * block boundaries without waiting for transport acks. */
  onBlockReplyQueued?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  onBlockReply?: (payload: ReplyPayload, context?: BlockReplyContext) => Promise<void> | void;
  onToolResult?: (payload: ReplyPayload) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a tool phase starts/updates, before summary payloads are emitted. */
  onToolStart?: (payload: {
    itemId?: string;
    toolCallId?: string;
    name?: string;
    phase?: string;
    args?: Record<string, unknown>;
    detailMode?: "explain" | "raw";
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a concrete work item starts, updates, or completes. */
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
  }) => Promise<void> | void;
  /** Channel-owned final and queued-turn boundaries for the current narrator. */
  onProgressNarratorLifecycle?: (lifecycle: {
    beginTurn: () => void;
    stopTurn: () => void;
  }) => void;
  /** False while utility-model narration has no visible progress draft. */
  isProgressDraftVisible?: () => boolean;
  /**
   * Omit exec/bash command text from narration model input, mirroring the
   * channel's `streaming.progress.commandText: "status"` display policy so
   * narration never receives more command detail than the draft shows.
   */
  narrationHideCommandText?: boolean;
  /** In progress mode, classify Claude pre-tool text; true also renders it as commentary. */
  commentaryProgressEnabled?: boolean;
  /** Bridge typed preambles to a channel-owned progress headline without commentary. */
  progressPreambleEnabled?: boolean;
  /** Deliver durable reasoning payloads to channels that own a separate reasoning lane. */
  reasoningPayloadsEnabled?: boolean;
  /** Deliver durable commentary (💬) payloads to channels that own a separate commentary lane. */
  commentaryPayloadsEnabled?: boolean;
  /** Optional turn-frozen commentary owner; visibility is live by default.
   * With the static opt-in and this callback, core freezes, evaluates once, and snapshots. */
  shouldDeliverCommentaryPayloads?: () => boolean;
  /** Called when the agent emits a structured plan update. */
  onPlanUpdate?: (payload: {
    phase?: string;
    title?: string;
    explanation?: string;
    steps?: AgentPlanStep[];
    source?: string;
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when an approval becomes pending or resolves. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when command output streams or completes. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when a patch completes with a file summary. */
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
  }) => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction starts (allows UX feedback during the pause). */
  onCompactionStart?: () => Promise<ProgressCallbackResult> | ProgressCallbackResult;
  /** Called when context auto-compaction completes. */
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
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode;
  /** Enables task-suggestion tools only when the initiating surface can action Gateway events. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  /** Starts delivery tracking when this turn later drains as a queued followup. */
  queuedDeliveryCorrelations?: QueuedReplyDeliveryCorrelation[];
  /** Called after a queued followup owns the reply lane, before its model run starts. */
  onQueuedFollowupAdmitted?: () => Promise<void> | void;
  /** Called after an admitted queued followup finishes, including failed attempts. */
  onQueuedFollowupSettled?: () => Promise<void> | void;
  /** Allow channel-owned progress UI while final/source reply delivery remains message-tool-only. */
  allowProgressCallbacksWhenSourceDeliverySuppressed?: boolean;
  /** Called when a suppressed source reply mode observes visible delivery through another path. */
  onObservedReplyDelivery?: () => Promise<void> | void;
  /** Emit tool result summaries for channel-owned progress UI even when verbose is off. */
  forceToolResultProgress?: boolean;
  disableBlockStreaming?: boolean;
  /** Timeout for block reply delivery (ms). */
  blockReplyTimeoutMs?: number;
  /** If provided, only load these skills for this session (empty = no skills). */
  skillFilter?: string[];
  /** Mutable ref to track if a reply was sent (for Slack "first" threading mode). */
  hasRepliedRef?: {
    value: boolean;
  };
  /** Override agent timeout in seconds (0 = no timeout). Threads through to resolveAgentTimeoutMs. */
  timeoutOverrideSeconds?: number;
};
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
  payload: unknown;
  /** Internal exact-id hints for canonical transcript/live-cache deduplication. */
  sessionTranscriptDedupeMessageIds?: string[];
  /** Internal visible-text hints for legacy assistant rows without transcript ids. */
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
  channelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use channelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  untrustedContext?: ChannelStructuredContextEntry[];
  groupSystemPrompt?: string;
  /** Prompt-like group metadata from user-controlled sources; never enters the system prompt. */
  untrustedGroupSystemPrompt?: string;
};
/** Canonical normalized inbound text populated once by `finalizeInboundContext`. */
type CanonicalInboundText = {
  /** Clean text used for command and directive parsing. */
  commandText: string;
  /** Prompt-facing text used for the agent turn. */
  agentText: string;
  /** Normalized visible/raw inbound text before command-specific projection. */
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
  InboundHistory?: HistoryEntry[];
  /** Internal facts used to merge canonical transcript turns before dispatch. */
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
  AgentId?: string;
  /** Effective routed DM scope, including binding overrides. */
  DmScope?: DmScope;
  /**
   * Session-like key used for runtime policy (sandbox/tool policy) when the
   * conversation key intentionally remains broader, such as a main-session DM.
   */
  RuntimePolicySessionKey?: string;
  /** Provider account id (multi-account). */
  AccountId?: string;
  ParentSessionKey?: string;
  /**
   * Session key used only for inheriting session-scoped model/provider
   * overrides. Unlike ParentSessionKey, this must not trigger transcript
   * forking or parent-session lifecycle behavior.
   */
  ModelParentSessionKey?: string;
  MessageSid?: string;
  /** Provider-specific full message id when MessageSid is a shortened alias. */
  MessageSidFull?: string;
  MessageSids?: string[];
  MessageSidFirst?: string;
  MessageSidLast?: string;
  AmbientTranscriptWatermarkKey?: string;
  AmbientTranscriptBody?: string;
  AmbientTranscriptMessageId?: string;
  AmbientTranscriptTimestampMs?: number;
  AmbientTranscriptPreviousMessageId?: string;
  AmbientTranscriptPreviousTimestampMs?: number;
  /** Per-turn reply-threading overrides. */
  ReplyThreading?: ReplyThreadingPolicy;
  /** Effective channel reply mode prepared for this turn. */
  ReplyToMode?: ReplyToMode;
  ReplyToId?: string;
  /**
   * Root message id for thread reconstruction (used by Feishu for root_id).
   * When a message is part of a thread, this is the id of the first message.
   */
  RootMessageId?: string;
  /** Provider-specific full reply-to id when ReplyToId is a shortened alias. */
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
  ReplyToIsQuote?: boolean;
  /** Forward origin from the reply target (when reply_to_message is a forwarded message). */
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
  ThreadStarterBody?: string;
  /** Full thread history when starting a new thread session. */
  ThreadHistoryBody?: string;
  IsFirstThreadTurn?: boolean;
  ThreadLabel?: string;
  /** @deprecated Use `media?.[0]?.path`. */
  MediaPath?: string;
  /** @deprecated Use `media?.[0]?.url`. */
  MediaUrl?: string;
  /** @deprecated Use `media?.[0]?.contentType` or `.kind`. */
  MediaType?: string;
  /** @deprecated Derive the directory from `media?.[0]?.path` at the consuming boundary. */
  MediaDir?: string;
  /** @deprecated Use `media?.map((entry) => entry.path)`. */
  MediaPaths?: string[];
  /** @deprecated Use `media?.map((entry) => entry.url)`. */
  MediaUrls?: string[];
  /** @deprecated Use `media?.map((entry) => entry.contentType ?? entry.kind)`. */
  MediaTypes?: string[];
  /** Ordered current-turn media facts; array position is attachment identity. */
  media?: MediaFact[];
  /** Original message modality before transcription or other media normalization. */
  SourceModality?: InboundSourceModality;
  /** @deprecated Use each media fact's `workspaceDir`. */
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
  MediaStaged?: boolean;
  /** Telegram sticker metadata (emoji, set name, file IDs, cached description). */
  Sticker?: StickerContextMetadata;
  /** True when current-turn sticker media is present in structured facts. */
  StickerMediaIncluded?: boolean;
  /** Skip automatic understanding for the current sticker because its cached description is used. */
  SkipStickerMediaUnderstanding?: boolean;
  OutputDir?: string;
  OutputBase?: string;
  /** Remote host for SCP when media lives on a different machine (e.g., openclaw@192.168.64.3). */
  MediaRemoteHost?: string;
  Transcript?: string;
  MediaUnderstanding?: MediaUnderstandingOutput[];
  MediaUnderstandingDecisions?: MediaUnderstandingDecision[];
  LinkUnderstanding?: string[];
  Prompt?: string;
  MaxChars?: number;
  ChatType?: string;
  /** Trusted channel-configured policy for this admitted conversation turn. */
  ConversationToolPolicy?: GroupToolPolicyConfig;
  /** Human label for envelope headers (conversation label, not sender). */
  ConversationLabel?: string;
  GroupSubject?: string;
  /** Human label for channel-like group conversations (e.g. #general, #support). */
  GroupChannel?: string;
  GroupSpace?: string;
  /** Trusted provider role ids for the sender in this group turn. */
  MemberRoleIds?: string[];
  GroupMembers?: string;
  GroupSystemPrompt?: string;
  /**
   * Canonical inbound supplemental facts for new channel code. `finalizeInboundContext`
   * projects these to the existing flat reply/forward/thread/group prompt fields.
   */
  SupplementalContext?: SupplementalContextFacts;
  /** Channel-provided metadata that must not be treated as system instructions. */
  ChannelPromptContext?: string[];
  /** @deprecated Use ChannelPromptContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedContext?: string[];
  /** Structured channel metadata rendered by prompt assembly as fenced JSON. */
  ChannelStructuredContext?: ChannelStructuredContextEntry[];
  /** @deprecated Use ChannelStructuredContext. Removal: after 2026-09-08 (see sdk-untrusted-context-identifier-aliases). */
  UntrustedStructuredContext?: UntrustedStructuredContextEntry[];
  /** System-attached provenance for the current inbound message. */
  InputProvenance?: InputProvenance;
  /** Explicit owner allowlist overrides (trusted, configuration-derived). */
  OwnerAllowFrom?: Array<string | number>;
  SenderName?: string;
  SenderId?: string;
  /** Trusted in-process creation provenance; never populated from channel payloads. */
  SessionCreation?: {
    via: SessionCreatedVia;
    actor?: SessionCreatedActor;
    sandbox?: "required";
  };
  SenderUsername?: string;
  SenderTag?: string;
  SenderE164?: string;
  SenderIsBot?: boolean;
  /** Channel-ingress fact: sender is the operator's own account (from-me). */
  SenderIsSelf?: boolean;
  Timestamp?: number;
  LocationLat?: number;
  LocationLon?: number;
  LocationAccuracy?: number;
  LocationName?: string;
  LocationAddress?: string;
  LocationSource?: string;
  LocationIsLive?: boolean;
  LocationLivePeriodSeconds?: number;
  LocationCaption?: string;
  /** Stable identity of the provider update that carried this message. */
  ProviderUpdateId?: string;
  /** Provider update kind, for example `message` or `edited_message`. */
  ProviderUpdateKind?: string;
  /** Provider-native timestamp for the original message. */
  ProviderMessageTimestamp?: number;
  /** Provider-native timestamp for an edited message update. */
  ProviderEditTimestamp?: number;
  /** Provider label. */
  Provider?: string;
  /** Provider surface label. Prefer this over `Provider` when available. */
  Surface?: string;
  /** Platform bot username when command mentions should be normalized. */
  BotUsername?: string;
  WasMentioned?: boolean;
  /** Effective channel-owned mention policy before any plugin-binding bypass. */
  GroupRequireMention?: boolean;
  /** True when this turn explicitly mentioned the current bot target. */
  ExplicitlyMentionedBot?: boolean;
  /** Provider-native explicit user mention ids present on this turn. */
  MentionedUserIds?: string[];
  /** Provider-native explicit user-group/subteam mention ids present on this turn. */
  MentionedSubteamIds?: string[];
  /** Provider-native implicit mention wake reasons present on this turn. */
  ImplicitMentionKinds?: string[];
  /** Provider-native source that caused the current mention decision. */
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
  AcpDispatchTailAfterReset?: boolean;
  /** Gateway client scopes when the message originates from the gateway. */
  GatewayClientScopes?: string[];
  /** Gateway client capabilities when the message originates from the gateway. */
  GatewayClientCaps?: string[];
  /** Run-scoped plugin tool bindings; never rendered into prompt text. */
  GatewayRunToolBindings?: Readonly<Record<string, unknown>>;
  /** Gateway device id allowed to review approvals initiated by this turn. */
  ApprovalReviewerDeviceId?: string;
  /** Thread identifier (Telegram topic id or Matrix thread event id). */
  MessageThreadId?: string | number;
  /** Provider-native thread target for reply delivery without making the session thread-scoped. */
  TransportThreadId?: string | number;
  /** Platform-native channel/conversation id (e.g. Slack DM channel "D…" id). */
  NativeChannelId?: string;
  /** Channel-owned local conversation image reference; never rendered into prompt text. */
  ConversationAvatar?: string;
  /** Channel-owned metadata exposed to plugin hook context, not prompt text. */
  ChannelContext?: PluginHookChannelContext;
  /** Provider-native chat/conversation id used by channel plugins that expose `chat_id`. */
  ChatId?: string;
  /** Stable provider-native direct-peer id when a DM room/user mapping must survive later writes. */
  NativeDirectUserId?: string;
  /** Telegram forum supergroup marker. */
  IsForum?: boolean;
  /** Human-readable Telegram forum topic name (cached from service messages). */
  TopicName?: string;
  /** Warning: DM has topics enabled but this message is not in a topic. */
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
  /** Internal marker that channel ingress authoritatively observed route-context facts. */
  ConversationRouteContextObserved?: boolean;
  /** Canonical peer used by route selection; delivery targets may use a different namespace. */
  ConversationRoutePeerId?: string;
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
export { resolveTranscriptBackedChannelFinalText as $, buildChannelProgressDraftLineForEntry as A, normalizeChannelProgressDraftLineIdentity as B, TranscriptTurnBoundary as C, ChannelProgressDraftLineInput as D, ChannelProgressDraftLine as E, formatPlanChecklistLines as F, resolveChannelStreamingBlockCoalesce as G, resolveChannelProgressDraftConfig as H, isChannelProgressDraftWorkToolName as I, resolveChannelStreamingPreviewCommandText as J, resolveChannelStreamingBlockEnabled as K, isPotentialTruncatedFinal as L, formatChannelProgressDraftLine as M, formatChannelProgressDraftLineForEntry as N, ChannelProgressLineOptions as O, formatChannelProgressDraftText as P, resolveChannelStreamingSuppressDefaultToolProgressMessages as Q, mergeChannelProgressDraftLine as R, TranscriptTurnAdmission as S, AgentPlanStepStatus as T, resolveChannelProgressDraftMaxLineChars as U, resolveChannelPreviewStreamMode as V, resolveChannelProgressDraftMaxLines as W, resolveChannelStreamingProgressCommentary as X, resolveChannelStreamingPreviewToolProgress as Y, resolveChannelStreamingProgressNarration as Z, TurnAdoptionLifecycle as _, InboundSourceModality as a, createCommandTurnContext as at, UserTurnTranscriptRecorder as b, OriginatingChannelType as c, isNativeCommandTurn as ct, SupplementalContextFacts as d, PluginHookChannelChatContext as dt, selectLongerFinalText as et, UntrustedStructuredContextEntry as f, PluginHookChannelContext as ft, TaskSuggestionDeliveryMode as g, PartialReplyPayload as h, FinalizedRuntimeMsgContext as i, CommandTurnKind as it, createChannelProgressDraftGate as j, buildChannelProgressDraftLine as k, RuntimeMsgContext as l, isTextSlashCommandTurn as lt, GetReplyOptions as m, PromptImageOrderEntry as mt, ChannelStructuredContextEntry as n, ExecutionIdentityAdmissionToken as nt, MentionSource as o, isAuthorizedTextSlashCommandTurn as ot, BlockReplyContext as p, PluginHookChannelSenderContext as pt, resolveChannelStreamingChunkMode as q, FinalizedMsgContext as r, CommandTurnContext as rt, MsgContext as s, isExplicitCommandTurn as st, CanonicalInboundText as t, ExecutionIdentityAdmissionFacts as tt, SessionTranscriptContext as u, InputProvenance as ut, UserTurnInput as v, AgentPlanStep as w, TranscriptEntryAnchor as x, UserTurnTranscriptAdmissionReceipt as y, normalizeAgentPlanSteps as z };