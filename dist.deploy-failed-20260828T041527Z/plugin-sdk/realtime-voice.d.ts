import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { $ as PluginRuntimeCore, Et as EmbeddedAgentQueueMessageOutcome, ai as DiagnosticEventInput, et as RuntimeLogger, qr as RealtimeVoiceProviderPlugin, rr as RunEmbeddedAgentParams } from "../types-DP7cDwEi.js";
import { $ as TalkEventType, A as RealtimeVoiceCloseOptions, B as RealtimeVoiceRole, C as RealtimeVoiceBridge, D as RealtimeVoiceBrowserSession, E as RealtimeVoiceBridgeEvent, F as RealtimeVoiceProviderConfiguredContext, G as realtimeVoiceAudioDurationMs, H as RealtimeVoiceToolCallEvent, I as RealtimeVoiceProviderId, J as TalkBrain, K as toOpenAICompatibleRealtimeAudioFormat, L as RealtimeVoiceProviderResolveConfigContext, M as RealtimeVoiceGatewayControl, N as RealtimeVoiceProviderCapabilities, O as RealtimeVoiceBrowserSessionCreateRequest, P as RealtimeVoiceProviderConfig, Q as TalkEventSequencer, R as RealtimeVoiceResponseError, S as RealtimeVoiceBargeInOptions, T as RealtimeVoiceBridgeCreateRequest, U as RealtimeVoiceToolResultOptions, V as RealtimeVoiceTool, W as normalizeRealtimeVoiceResponseOutcome, X as TalkEventContext, Y as TalkEvent, Z as TalkEventInput, _ as REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, b as RealtimeVoiceAudioClearReason, et as TalkMode, g as OpenAICompatibleRealtimeAudioFormat, j as RealtimeVoiceCloseReason, k as RealtimeVoiceCloseDisposition, nt as createTalkEventSequencer, q as TALK_EVENT_TYPES, tt as TalkTransport, v as REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, w as RealtimeVoiceBridgeCallbacks, x as RealtimeVoiceAudioFormat, y as RealtimeVoiceAgentConsultRunner, z as RealtimeVoiceResponseOutcome } from "../provider-types-CbuAPn98.js";
import { a as isSupportedRealtimeVoiceActivationName, c as normalizeRealtimeVoiceActivationNamePrefix, d as sortRealtimeVoiceActivationNames, i as RealtimeVoiceActivationNameTranscriptResult, l as normalizeSupportedRealtimeVoiceActivationName, n as RealtimeVoiceActivationNameEdge, o as matchRealtimeVoiceActivationName, r as RealtimeVoiceActivationNameMatchKind, s as normalizeRealtimeVoiceActivationName, t as REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS, u as realtimeVoiceActivationNameWordCount } from "../activation-name-aEW1Buep.js";
import { i as createRealtimeVoiceAudioQueue, n as RealtimeVoiceSessionConnection, r as RealtimeVoiceSessionLifecycle, t as RealtimeVoiceAudioQueue } from "../realtime-session-lifecycle-BZIQ1zRE.js";
//#region src/talk/diagnostics.d.ts
type TalkDiagnosticEventInput = Extract<DiagnosticEventInput, {
  type: "talk.event";
}>;
/** Convert a Talk event into the bounded diagnostic payload shape. */
declare function createTalkDiagnosticEvent(event: TalkEvent): TalkDiagnosticEventInput;
/** Emit a trusted internal diagnostic event for one Talk event. */
declare function recordTalkDiagnosticEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/logging.d.ts
/**
 * Log severity produced from Talk event envelopes.
 */
type TalkLogLevel = "info" | "warn";
/**
 * Compact structured log record for a non-noisy Talk event.
 */
type TalkLogRecord = {
  level: TalkLogLevel;
  message: string;
  attributes: Record<string, string | number | boolean>;
};
/**
 * Converts high-level Talk events into compact structured log records, skipping noisy deltas.
 */
declare function createTalkLogRecord(event: TalkEvent): TalkLogRecord | undefined;
/**
 * Emits Talk logs best-effort so logging failures never break realtime audio handling.
 */
declare function recordTalkLogEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/observability.d.ts
/** Record one Talk event through diagnostics and logging projections. */
declare function recordTalkObservabilityEvent(event: TalkEvent): void;
//#endregion
//#region src/talk/talk-session-controller.d.ts
/**
 * Why a turn-scoped Talk operation could not emit an event.
 */
type TalkTurnFailureReason = "no_active_turn" | "stale_turn";
/**
 * Successful turn operation with the emitted Talk event.
 */
type TalkTurnSuccess = {
  event: TalkEvent;
  ok: true;
  turnId: string;
};
/**
 * Failed turn operation when the requested turn does not match controller state.
 */
type TalkTurnFailure = {
  ok: false;
  reason: TalkTurnFailureReason;
};
/**
 * Result for ending or cancelling an active Talk turn.
 */
type TalkTurnResult = TalkTurnSuccess | TalkTurnFailure;
/**
 * Result for operations that ensure a turn exists and may emit a start event.
 */
type TalkEnsureTurnResult = {
  event?: TalkEvent;
  turnId: string;
};
/**
 * Stateful Talk event controller for one session's turns, output audio, and recent event buffer.
 */
type TalkSessionController = {
  readonly activeTurnId: string | undefined;
  readonly context: TalkEventContext;
  readonly outputAudioActive: boolean;
  readonly recentEvents: readonly TalkEvent[];
  clearActiveTurn(): void;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  startTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
  endTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  cancelTurn(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkTurnResult;
  finishOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEvent | undefined;
  startOutputAudio(params?: {
    payload?: unknown;
    turnId?: string;
  }): TalkEnsureTurnResult;
};
/**
 * Session context plus controller retention settings.
 */
type TalkSessionControllerParams = TalkEventContext & {
  maxRecentEvents?: number;
  turnIdPrefix?: string;
};
/**
 * Optional controller hooks and sequencer overrides for tests and observers.
 */
type TalkSessionControllerOptions = {
  now?: () => Date | string;
  onEvent?: (event: TalkEvent) => void;
  sequencer?: TalkEventSequencer;
};
/**
 * Creates a per-session Talk controller that emits correlated turn and output-audio events.
 */
declare function createTalkSessionController(params: TalkSessionControllerParams, options?: TalkSessionControllerOptions): TalkSessionController;
/**
 * Normalizes legacy realtime transport names into Talk transport families.
 */
declare function normalizeTalkTransport(value: string | undefined): string | undefined;
//#endregion
//#region src/talk/consult-transcript.d.ts
/** Reason a transcript should be ignored before creating a consult request. */
type SkippableRealtimeVoiceConsultTranscriptReason = "empty" | "incomplete-transcript" | "trailing-fragment" | "non-actionable-closing";
/** Classify transcript text that is empty, incomplete, fragmented, or non-actionable. */
declare function classifySkippableRealtimeVoiceConsultTranscript(text: string): SkippableRealtimeVoiceConsultTranscriptReason | undefined;
//#endregion
//#region src/talk/consult-question.d.ts
type RealtimeVoiceConsultQuestionMatchOptions = {
  /** Minimum overlap ratio against the smaller token set for fuzzy matches. */
  minTokenOverlapRatio?: number;
  /** Minimum number of non-stopword tokens that must overlap. */
  minTokenOverlapCount?: number;
};
type RealtimeVoiceSpeakableToolResultOptions = {
  /** Candidate result keys to read from object-shaped tool output. */
  keys?: readonly string[];
  /** Maximum spoken result length before appending a truncation marker. */
  maxChars?: number;
};
/** Read the consult question from a raw string or selected object keys. */
declare function readRealtimeVoiceConsultQuestion(args: unknown, keys?: readonly string[]): string | undefined;
/** Normalize consult questions for stable matching across punctuation/casing. */
declare function normalizeRealtimeVoiceConsultQuestion(value: string | undefined): string | undefined;
/** Compare two consult questions with exact, containment, and token-overlap matching. */
declare function matchRealtimeVoiceConsultQuestions(left: string | undefined, right: string | undefined, options?: RealtimeVoiceConsultQuestionMatchOptions): boolean;
/** Extract a bounded speakable string from a tool result payload. */
declare function readSpeakableRealtimeVoiceToolResult(result: unknown, options?: RealtimeVoiceSpeakableToolResultOptions): string | undefined;
//#endregion
//#region src/talk/forced-consult-coordinator.d.ts
/** Timer abstraction used so tests can inject deterministic fake timers. */
type RealtimeVoiceForcedConsultTimer = {
  clear(): void;
};
/** Coordinator tuning and injectable clock/timer/matcher hooks. */
type RealtimeVoiceForcedConsultCoordinatorOptions = {
  limit?: number;
  /** Window for matching late native consults to forced consult handles. */
  nativeDedupeMs?: number;
  now?: () => number;
  setTimer?: (fn: () => void, ms: number) => RealtimeVoiceForcedConsultTimer;
  questionsMatch?: (left: string | undefined, right: string | undefined) => boolean;
};
/** Stable handle for one forced consult lifecycle. */
type RealtimeVoiceForcedConsultHandle<TContext = unknown> = {
  id: string;
  question: string;
  context?: TContext;
};
/** Classification of a native provider consult relative to forced consult state. */
type RealtimeVoiceForcedConsultNativeMatch<TContext = unknown> = {
  kind: "none";
  question?: string;
} | {
  kind: "pending";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "in_flight";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
} | {
  kind: "already_delivered";
  question?: string;
  handle: RealtimeVoiceForcedConsultHandle<TContext>;
};
type RealtimeVoiceForcedConsultNativeRecentOptions = {
  /** Treat native calls without readable questions as recent generic consults. */
  allowUnknownQuestion?: boolean;
};
/** Public state machine for forced/native consult dedupe in a voice session. */
type RealtimeVoiceForcedConsultCoordinator<TContext = unknown> = {
  prepare(question: string, options?: {
    context?: TContext;
    id?: string;
  }): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  schedule(handle: RealtimeVoiceForcedConsultHandle<TContext>, delayMs: number, run: (handle: RealtimeVoiceForcedConsultHandle<TContext>) => void): void;
  clearPending(): void;
  consumePending(question?: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  cancelPending(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  recordNativeConsult(args: unknown, nativeCallId?: string): RealtimeVoiceForcedConsultNativeMatch<TContext>;
  markStarted(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markDelivered(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  markCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  isCancelled(handle: RealtimeVoiceForcedConsultHandle<TContext>): boolean;
  nativeCallIds(handle: RealtimeVoiceForcedConsultHandle<TContext>): readonly string[];
  handles(): readonly RealtimeVoiceForcedConsultHandle<TContext>[];
  rememberQuestion(handle: RealtimeVoiceForcedConsultHandle<TContext>, question: string): void;
  findRecent(question: string): RealtimeVoiceForcedConsultHandle<TContext> | undefined;
  hasRecent(question: string): boolean;
  hasRecentNativeConsult(question: string, options?: RealtimeVoiceForcedConsultNativeRecentOptions): boolean;
  remove(handle: RealtimeVoiceForcedConsultHandle<TContext>): void;
  clear(): void;
};
/** Create an in-memory forced-consult coordinator for one realtime session. */
declare function createRealtimeVoiceForcedConsultCoordinator<TContext = unknown>(options?: RealtimeVoiceForcedConsultCoordinatorOptions): RealtimeVoiceForcedConsultCoordinator<TContext>;
//#endregion
//#region src/talk/turn-context-tracker.d.ts
/**
 * Retention and clock controls for realtime voice turn context tracking.
 */
type RealtimeVoiceTurnContextTrackerOptions = {
  limit?: number;
  ignoredContextTtlMs?: number;
  now?: () => number;
  deferUntilAudio?: boolean;
};
/**
 * Mutable handle for a single realtime voice turn and caller-owned per-turn metadata.
 */
type RealtimeVoiceTurnContextHandle<TContext, TExtra extends object = Record<never, never>> = TExtra & {
  id: string;
  context: TContext;
  hasAudio: boolean;
  closed: boolean;
  startedAt: number;
  lastAudioAt?: number;
};
type RealtimeVoiceTurnContextOpenArgs<TExtra extends object> = keyof TExtra extends never ? [extra?: TExtra] : [extra: TExtra];
/**
 * Tracks which realtime voice turn context should be attached to the next audio-bearing response.
 */
type RealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>> = {
  open(context: TContext, ...extra: RealtimeVoiceTurnContextOpenArgs<TExtra>): RealtimeVoiceTurnContextHandle<TContext, TExtra>;
  markAudio(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  close(handle: RealtimeVoiceTurnContextHandle<TContext, TExtra>): void;
  consumeAudioContext(): TContext | undefined;
  peekAudioTurn(): RealtimeVoiceTurnContextHandle<TContext, TExtra> | undefined;
  hasAudioContext(): boolean;
  rememberIgnoredContext(context: TContext | undefined): void;
  consumeIgnoredContext(): TContext | undefined;
  size(): number;
  clear(): void;
};
declare function createRealtimeVoiceTurnContextTracker<TContext, TExtra extends object = Record<never, never>>(options?: RealtimeVoiceTurnContextTrackerOptions): RealtimeVoiceTurnContextTracker<TContext, TExtra>;
//#endregion
//#region src/talk/output-activity-tracker.d.ts
/**
 * Realtime voice output activity counters and playback-state tracking.
 *
 * Providers use this to decide whether assistant output is active,
 * interruptible, or overdue relative to the audio duration already emitted.
 */
type RealtimeVoiceOutputActivityTrackerOptions = {
  /** Injectable clock for deterministic tests and playback watchdog math. */
  now?: () => number;
};
/** One output activity increment from source audio and/or sink audio. */
type RealtimeVoiceOutputActivityDelta = {
  audioMs?: number;
  sourceAudioBytes?: number;
  sinkAudioBytes?: number;
};
/** Current output counters and playback timestamps. */
type RealtimeVoiceOutputActivitySnapshot = {
  audioMs: number;
  chunks: number;
  sourceAudioBytes: number;
  sinkAudioBytes: number;
  playbackStarted: boolean;
  streamEnding: boolean;
  lastAudioAt?: number;
  playbackStartedAt?: number;
};
/** Mutable tracker for one realtime voice output stream. */
type RealtimeVoiceOutputActivityTracker = {
  markStreamOpened(): void;
  markStreamEnding(): void;
  markPlaybackStarted(): void;
  markAudio(delta: RealtimeVoiceOutputActivityDelta): void;
  reset(): void;
  /** Whether output exists or the downstream sink reports active playback. */
  isActive(sinkActive?: boolean): boolean;
  /** Whether caller speech should be treated as interrupting current output. */
  isInterruptible(sinkActive?: boolean): boolean;
  elapsedPlaybackMs(): number;
  /** Delay before watchdog should assume playback has exceeded expected audio duration. */
  playbackWatchdogDelayMs(options: {
    marginMs: number;
    minMs?: number;
  }): number | undefined;
  snapshot(): RealtimeVoiceOutputActivitySnapshot;
};
/** Create a fresh output activity tracker for a realtime voice session. */
declare function createRealtimeVoiceOutputActivityTracker(options?: RealtimeVoiceOutputActivityTrackerOptions): RealtimeVoiceOutputActivityTracker;
//#endregion
//#region src/talk/agent-consult-tool.d.ts
/** Stable provider-facing tool name for realtime voice agent delegation. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME = "openclaw_agent_consult";
/** Closed policy set controlling whether the consult tool is exposed. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES: readonly ["safe-read-only", "owner", "none"];
/** Tool exposure policy for the shared realtime voice consult tool. */
type RealtimeVoiceAgentConsultToolPolicy = (typeof REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES)[number];
/** Normalized tool-call arguments accepted from realtime providers. */
type RealtimeVoiceAgentConsultArgs = {
  question: string;
  context?: string;
  responseStyle?: string;
  confirmationId?: string;
};
/** Compact transcript entry included in delegated agent prompts. */
type RealtimeVoiceAgentConsultTranscriptEntry = {
  role: "user" | "assistant";
  text: string;
};
/** Shared realtime voice function-tool descriptor projected to providers. */
declare const REALTIME_VOICE_AGENT_CONSULT_TOOL: RealtimeVoiceTool;
/** Build the interim spoken instruction while the delegated agent turn runs. */
declare function buildRealtimeVoiceAgentConsultWorkingResponse(audienceLabel?: string): Record<string, unknown>;
/** Type guard for user/config supplied consult tool policies. */
declare function isRealtimeVoiceAgentConsultToolPolicy(value: unknown): value is RealtimeVoiceAgentConsultToolPolicy;
/** Normalize a configured consult tool policy with a caller-owned fallback. */
declare function resolveRealtimeVoiceAgentConsultToolPolicy(value: unknown, fallback: RealtimeVoiceAgentConsultToolPolicy): RealtimeVoiceAgentConsultToolPolicy;
/** Merge the shared consult tool with provider/plugin custom realtime tools. */
declare function resolveRealtimeVoiceAgentConsultTools(policy: RealtimeVoiceAgentConsultToolPolicy, customTools?: RealtimeVoiceTool[]): RealtimeVoiceTool[];
/** Resolve the OpenClaw tool allowlist paired with the consult exposure policy. */
declare function resolveRealtimeVoiceAgentConsultToolsAllow(policy: RealtimeVoiceAgentConsultToolPolicy): string[] | undefined;
/** Build model instructions for when the voice agent should call the consult tool. */
declare function buildRealtimeVoiceAgentConsultPolicyInstructions(config: {
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultPolicy?: "auto" | "substantive" | "always";
}): string | undefined;
/** Build the shared instructions for a realtime voice agent session. */
declare function buildRealtimeVoiceSessionInstructions(params: {
  base: string;
  isAgentProxy: boolean;
  bootstrapContextInstructions?: string;
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultPolicy: "auto" | "always";
}): string;
/** Parse provider-owned consult tool arguments into the normalized contract. */
declare function parseRealtimeVoiceAgentConsultArgs(args: unknown): RealtimeVoiceAgentConsultArgs;
/** Build the plain chat message used by browser/chat forwarding paths. */
declare function buildRealtimeVoiceAgentConsultChatMessage(args: unknown): string;
/** Build the delegated OpenClaw agent prompt for a live voice consult. */
declare function buildRealtimeVoiceAgentConsultPrompt(params: {
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
}): string;
/** Collect only visible answer text from streamed delegated-agent payloads. */
declare function collectRealtimeVoiceAgentConsultVisibleText(payloads: Array<{
  text?: unknown;
  isError?: boolean;
  isReasoning?: boolean;
  isCommentary?: boolean;
}>): string | null;
//#endregion
//#region src/talk/exact-speech-protocol.d.ts
type RealtimeVoiceConsultToolCallOutcome = {
  kind: "exact-speech-echo";
  text: string;
} | {
  kind: "consult";
  message: string;
} | {
  kind: "malformed";
  error: string;
};
/** Build the internal user message that asks a realtime model to speak exact text. */
declare function buildRealtimeVoiceSpeakExactMessage(params: {
  text: string;
  surfaceLabel: string;
}): string;
/** Classify a provider consult call before normal agent delegation. */
declare function classifyRealtimeVoiceConsultToolCall(args: unknown, options: {
  retainedExactSpeechTexts: readonly string[];
}): RealtimeVoiceConsultToolCallOutcome;
//#endregion
//#region src/talk/realtime-session-policy.d.ts
type RealtimeVoiceWakeNamePolicy = "always" | "automatic" | "never";
type RealtimeVoiceSessionPolicy = {
  toolPolicy: RealtimeVoiceAgentConsultToolPolicy;
  consultToolsAllow: string[] | undefined;
  consultPolicy: "auto" | "always";
  wakeNamePolicy: RealtimeVoiceWakeNamePolicy;
  wakeNames: string[];
  autoRespondToAudio: boolean;
};
/** Resolve generic consult, activation-name, and auto-response session policy. */
declare function resolveRealtimeVoiceSessionPolicy(params: {
  isAgentProxy: boolean;
  supportsActivationNameGating: boolean;
  configuredToolPolicy: unknown;
  configuredConsultPolicy: "auto" | "always" | undefined;
  requireWakeName: boolean | undefined;
  configuredWakeNames: string[] | undefined;
  cfg: OpenClawConfig;
  agentId: string;
}): RealtimeVoiceSessionPolicy;
declare function isRealtimeVoiceWakeNameRequired(policy: RealtimeVoiceWakeNamePolicy, humanParticipantCount: number): boolean;
declare function resolveRealtimeVoiceInterruptResponseOnInputAudio(value: unknown): boolean;
declare function resolveRealtimeVoiceBargeIn(params: {
  configuredBargeIn: boolean | undefined;
  interruptResponseOnInputAudio: unknown;
}): boolean;
declare function resolveRealtimeVoiceMinBargeInAudioEndMs(configured: number | undefined): number;
//#endregion
//#region src/talk/agent-consult-runtime.d.ts
/**
 * Agent runtime surface used by realtime voice consults.
 */
type RealtimeVoiceAgentConsultRuntime = PluginRuntimeCore["agent"];
/**
 * Speakable text returned to the realtime voice bridge after an agent consult.
 */
type RealtimeVoiceAgentConsultResult = {
  text: string;
};
/**
 * Sender-auth contract revision for official realtime voice plugins.
 *
 * Revision 1 forwards ingress-authenticated `senderId` and `senderIsOwner` unchanged. Ingress
 * owns authentication; consumers that require this handoff must fail closed on other revisions.
 */
declare const REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION = 1;
/**
 * Controls whether voice consults run in a fresh session or fork context from the requester.
 */
type RealtimeVoiceAgentConsultContextMode = "isolated" | "fork";
type RealtimeVoiceAgentConsultRunRegistration = {
  abortSignal?: AbortSignal;
  cleanup?: () => void;
};
/**
 * Fails closed when a realtime consult would cross a model-selection lock.
 */
declare function assertRealtimeVoiceAgentConsultModelSelectionUnlocked(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  agentId: string;
  sessionKey: string;
  spawnedBy?: string | null;
  storePath?: string;
}): void;
/**
 * Runs an embedded agent consult and returns concise speakable text for realtime voice playback.
 */
declare function consultRealtimeVoiceAgent(params: {
  cfg: OpenClawConfig;
  agentRuntime: RealtimeVoiceAgentConsultRuntime;
  logger: Pick<RuntimeLogger, "warn">;
  sessionKey: string;
  messageProvider: string;
  lane: string;
  runIdPrefix: string;
  args: unknown;
  transcript: RealtimeVoiceAgentConsultTranscriptEntry[];
  surface: string;
  userLabel: string;
  assistantLabel?: string;
  questionSourceLabel?: string;
  agentId?: string;
  spawnedBy?: string | null;
  /** Sender identity established by the caller's ingress authorization boundary. */
  senderId?: string | null;
  /** Trusted owner bit established by the caller's ingress authorization boundary. */
  senderIsOwner?: boolean;
  contextMode?: RealtimeVoiceAgentConsultContextMode;
  provider?: RunEmbeddedAgentParams["provider"];
  model?: RunEmbeddedAgentParams["model"];
  thinkLevel?: RunEmbeddedAgentParams["thinkLevel"];
  fastMode?: RunEmbeddedAgentParams["fastMode"];
  timeoutMs?: number;
  toolsAllow?: string[];
  extraSystemPrompt?: string;
  fallbackText?: string;
  abortSignal?: AbortSignal;
  onRunStarted?: (params: {
    runId: string;
    sessionId: string;
    timeoutMs: number;
  }) => RealtimeVoiceAgentConsultRunRegistration | void;
}): Promise<RealtimeVoiceAgentConsultResult>;
//#endregion
//#region src/talk/agent-talkback-runtime.d.ts
/** Text produced by a delegated voice consult. */
type RealtimeVoiceAgentTalkbackResult = {
  text: string;
};
/** Minimal queue API owned by a realtime voice session. */
type RealtimeVoiceAgentTalkbackQueue = {
  close(): void;
  enqueue(question: string, metadata?: unknown): void;
};
/** Runtime dependencies and policy knobs for the talkback queue. */
type RealtimeVoiceAgentTalkbackQueueParams = {
  /** Delay used to merge nearby transcript fragments into one consult. */
  debounceMs: number;
  isStopped: () => boolean;
  logger: Pick<RuntimeLogger, "info" | "warn">;
  logPrefix: string;
  responseStyle: string;
  fallbackText: string;
  /** Delegates a batched question to OpenClaw and respects the abort signal. */
  consult: (args: {
    question: string;
    metadata?: unknown;
    responseStyle: string;
    signal: AbortSignal;
  }) => Promise<RealtimeVoiceAgentTalkbackResult>;
  /** Delivers final speakable text back to the realtime provider/session. */
  deliver: (text: string) => void;
};
/** Create a serial consult queue for realtime transcript talkback. */
declare function createRealtimeVoiceAgentTalkbackQueue(params: RealtimeVoiceAgentTalkbackQueueParams): RealtimeVoiceAgentTalkbackQueue;
//#endregion
//#region src/talk/agent-run-control-shared.d.ts
/** Provider-facing control modes for status, steering, cancellation, and follow-up work. */
declare const REALTIME_VOICE_AGENT_CONTROL_MODES: readonly ["status", "steer", "cancel", "followup"];
/** Closed set of realtime voice agent-control modes. */
type RealtimeVoiceAgentControlMode = (typeof REALTIME_VOICE_AGENT_CONTROL_MODES)[number];
/** Provider return shape for control calls that cancel active work immediately. */
type RealtimeVoiceAgentControlProviderResult = {
  status: "cancelled";
  message: string;
};
/** Stable provider-facing tool name for active-run voice control. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME = "openclaw_agent_control";
/** Realtime function-tool descriptor projected to voice providers. */
declare const REALTIME_VOICE_AGENT_CONTROL_TOOL: RealtimeVoiceTool;
/** Classified control intent plus whether automatic tool routing is safe. */
type RealtimeVoiceAgentControlIntent = {
  mode: RealtimeVoiceAgentControlMode;
  confidence: "high" | "medium" | "low";
  reason: "explicit_mode" | "cancel_safety" | "status_query" | "followup_marker" | "steer_command" | "safe_default";
  shouldAutoControl: boolean;
};
/** Snapshot of active work used when recent Talk events cannot describe status. */
type RealtimeVoiceAgentRunActivity = {
  activeWorkKind?: "tool_call" | "model_call" | "embedded_run";
  hasActiveEmbeddedRun?: boolean;
  activeToolName?: string;
  activeToolCallId?: string;
  activeToolAgeMs?: number;
  lastProgressAgeMs?: number;
  lastProgressReason?: string;
};
/** Result returned after applying or reporting a voice control request. */
type RealtimeVoiceAgentControlResult = {
  ok: boolean;
  mode: RealtimeVoiceAgentControlMode;
  sessionKey: string;
  sessionId?: string;
  active: boolean;
  queued?: boolean;
  aborted?: boolean;
  target?: "embedded_run" | "reply_run";
  reason?: string;
  message: string;
  speak: boolean;
  show: boolean;
  suppress: boolean;
  providerResult?: RealtimeVoiceAgentControlProviderResult;
  enqueuedAtMs?: number;
  deliveredAtMs?: number;
};
/** Normalize user/config/provider supplied control modes. */
declare function normalizeRealtimeVoiceAgentControlMode(value: unknown): RealtimeVoiceAgentControlMode | undefined;
/** Classify raw spoken control text with conservative auto-control gating. */
declare function resolveRealtimeVoiceAgentControlIntent(params: {
  text: string;
  mode?: unknown;
}): RealtimeVoiceAgentControlIntent;
/** Return the best control mode for a spoken utterance, even if auto-routing is unsafe. */
declare function classifyRealtimeVoiceAgentControlText(text: string): RealtimeVoiceAgentControlMode;
/** Whether a spoken utterance is safe to route automatically to the control tool. */
declare function shouldAutoControlRealtimeVoiceAgentText(text: string): boolean;
/** Parse provider-owned control tool args from JSON strings or object payloads. */
declare function parseRealtimeVoiceAgentControlToolArgs(args: unknown): {
  text: string;
  mode: RealtimeVoiceAgentControlMode;
};
/** Build the system-style instruction that forces exact spoken status output. */
declare function buildRealtimeVoiceAgentControlSpeechMessage(text: string): string;
/** Provider result payload used when the control tool cancels active work. */
declare function buildRealtimeVoiceAgentCancelProviderResult(message?: string): RealtimeVoiceAgentControlProviderResult;
//#endregion
//#region src/talk/agent-run-control.d.ts
type RealtimeVoiceAgentControlDeps = {
  abortEmbeddedAgentRun: (sessionId: string) => boolean;
  queueEmbeddedAgentMessageWithOutcomeAsync: (sessionId: string, text: string, options?: {
    steeringMode?: "all";
    debounceMs?: number;
    isInboundUserMessage?: boolean;
    taskSuggestionDeliveryMode?: undefined;
  }) => Promise<EmbeddedAgentQueueMessageOutcome>;
  getDiagnosticSessionActivitySnapshot: (params: {
    sessionId?: string;
    sessionKey?: string;
  }) => RealtimeVoiceAgentRunActivity;
  resolveActiveEmbeddedRunSessionId: (sessionKey: string) => string | undefined;
};
/** Apply a spoken status, cancel, steer, or follow-up request to an active run. */
declare function controlRealtimeVoiceAgentRun(params: {
  sessionKey: string;
  text: string;
  mode?: unknown;
  recentEvents?: readonly TalkEvent[];
}, deps?: RealtimeVoiceAgentControlDeps): Promise<RealtimeVoiceAgentControlResult>;
//#endregion
//#region src/talk/fast-context-runtime.d.ts
type Logger = {
  debug?: (message: string) => void;
};
/** Fast-context lookup policy for realtime voice consult shortcuts. */
type RealtimeVoiceFastContextConfig = {
  enabled: boolean;
  /** Maximum memory/session hits to include in the spoken-context prompt. */
  maxResults: number;
  /** Search backends allowed for the quick lookup. */
  sources: Array<"memory" | "sessions">;
  /** Deadline before the quick lookup gives up. */
  timeoutMs: number;
  /** Whether miss/unavailable/timeout should fall back to a full consult. */
  fallbackToConsult: boolean;
};
/** Human labels used in generated fast-context responses. */
type RealtimeVoiceFastContextLabels = {
  audienceLabel: string;
  contextName: string;
};
type RealtimeVoiceFastContextConsultResult = {
  handled: false;
} | {
  handled: true;
  result: RealtimeVoiceAgentConsultResult;
};
/** Try to answer a realtime consult from fast memory/session context. */
declare function resolveRealtimeVoiceFastContextConsult(params: {
  cfg: OpenClawConfig;
  agentId: string;
  sessionKey: string;
  config: RealtimeVoiceFastContextConfig;
  args: unknown;
  logger: Logger;
  labels?: Partial<RealtimeVoiceFastContextLabels>;
}): Promise<RealtimeVoiceFastContextConsultResult>;
//#endregion
//#region src/talk/provider-registry.d.ts
/**
 * Normalizes realtime voice provider ids so direct ids and aliases compare through one registry key.
 */
declare function normalizeRealtimeVoiceProviderId(providerId: string | undefined): RealtimeVoiceProviderId | undefined;
/**
 * Lists canonical realtime voice provider plugins in registry order.
 */
declare function listRealtimeVoiceProviders(cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin[];
/**
 * Resolves a realtime voice provider by canonical id or declared alias.
 */
declare function getRealtimeVoiceProvider(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderPlugin | undefined;
/**
 * Converts a realtime voice provider id or alias into the canonical provider id when known.
 */
declare function canonicalizeRealtimeVoiceProviderId(providerId: string | undefined, cfg?: OpenClawConfig): RealtimeVoiceProviderId | undefined;
//#endregion
//#region src/talk/provider-resolver.d.ts
/** Resolved realtime voice provider plus provider-normalized config. */
type ResolvedRealtimeVoiceProvider = {
  provider: RealtimeVoiceProviderPlugin;
  providerConfig: RealtimeVoiceProviderConfig;
};
/** Inputs for resolving a configured or auto-selected realtime voice provider. */
type ResolveConfiguredRealtimeVoiceProviderParams = {
  configuredProviderId?: string;
  providerConfigs?: Record<string, Record<string, unknown> | undefined>;
  /** Last-mile overrides from a session/client request. */
  providerConfigOverrides?: Record<string, unknown>;
  cfg?: OpenClawConfig;
  /** Alternate config object used by generic provider selection internals. */
  cfgForResolve?: OpenClawConfig;
  /** Agent whose browser-session auth store should be inspected. */
  agentId?: string;
  /** Test/runtime override for the provider list. */
  providers?: RealtimeVoiceProviderPlugin[];
  /** Availability gate checked before auto-candidate config normalization. */
  isProviderAvailable?: (provider: RealtimeVoiceProviderPlugin) => boolean;
  /** Raises the capability-specific error when no automatic provider is available. */
  assertProviderAvailable?: (provider: RealtimeVoiceProviderPlugin) => void;
  /** Model injected before provider-specific resolveConfig runs. */
  defaultModel?: string;
  /** Runtime surface being selected. Defaults to the provider bridge path. */
  surface?: "browser-session" | "gateway-relay" | "bridge";
  noRegisteredProviderMessage?: string;
};
/** Resolve the configured realtime voice provider or auto-select the first configured one. */
declare function resolveConfiguredRealtimeVoiceProvider(params: ResolveConfiguredRealtimeVoiceProviderParams): ResolvedRealtimeVoiceProvider;
//#endregion
//#region src/talk/session-runtime.d.ts
/**
 * Transport-facing audio target used by realtime voice bridge sessions.
 */
type RealtimeVoiceAudioSink = {
  isOpen?: () => boolean;
  sendAudio: (audio: Buffer) => void;
  clearAudio?: (reason?: RealtimeVoiceAudioClearReason) => void;
  sendMark?: (markName: string) => void;
};
/**
 * Controls how provider playback marks are bridged to transports that may or may not ack marks.
 */
type RealtimeVoiceMarkStrategy = "transport" | "ack-immediately" | "ignore";
/**
 * Stable session facade handed to gateway code and provider tool callbacks.
 */
type RealtimeVoiceBridgeSession = {
  bridge: RealtimeVoiceBridge;
  acknowledgeMark(markName?: string): void;
  close(options?: RealtimeVoiceCloseOptions): void;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  sendUserMessage(text: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  setMediaTimestamp(ts: number): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void | Promise<void>;
  triggerGreeting(instructions?: string): void;
};
/**
 * Provider bridge inputs plus transport callbacks for one realtime voice session.
 */
type RealtimeVoiceBridgeSessionParams = {
  provider: RealtimeVoiceProviderPlugin;
  cfg?: OpenClawConfig;
  /** Host-selected agent scope for provider auth and agent-owned bridge state. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  audioSink: RealtimeVoiceAudioSink;
  instructions?: string;
  language?: string;
  initialGreetingInstructions?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  markStrategy?: RealtimeVoiceMarkStrategy;
  triggerGreetingOnReady?: boolean;
  tools?: RealtimeVoiceTool[];
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onResponseDone?: (outcome: RealtimeVoiceResponseOutcome) => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent, session: RealtimeVoiceBridgeSession) => void | Promise<void>;
  onReady?: (session: RealtimeVoiceBridgeSession) => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
/**
 * Creates a realtime voice bridge session and wires provider events to the configured audio sink.
 */
declare function createRealtimeVoiceBridgeSession(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
//#endregion
//#region src/talk/session-log-runtime.d.ts
/** Ring-buffer entry for transcript text used by Talk health and echo suppression. */
type RealtimeVoiceTranscriptEntry = {
  at: string;
  role: RealtimeVoiceRole;
  text: string;
};
/** Compact health snapshot exposed to diagnostics without dumping full transcript history. */
type RealtimeVoiceTranscriptHealth = {
  realtimeTranscriptLines: number;
  lastRealtimeTranscriptAt?: string;
  lastRealtimeTranscriptRole?: RealtimeVoiceRole;
  lastRealtimeTranscriptText?: string;
  recentRealtimeTranscript: RealtimeVoiceTranscriptEntry[];
};
/** Bridge event plus capture time, kept separate from provider event payload shape. */
type RealtimeVoiceBridgeEventLogEntry = RealtimeVoiceBridgeEvent & {
  at: string;
};
/** Compact health snapshot of recent realtime bridge events. */
type RealtimeVoiceBridgeEventHealth = {
  lastRealtimeEventAt?: string;
  lastRealtimeEventType?: string;
  lastRealtimeEventDetail?: string;
  recentRealtimeEvents: RealtimeVoiceBridgeEventLogEntry[];
};
/** Appends a transcript entry and trims old rows in-place to bound Talk diagnostics memory. */
declare function recordRealtimeVoiceTranscript(transcript: RealtimeVoiceTranscriptEntry[], role: RealtimeVoiceRole, text: string, maxEntries?: number): RealtimeVoiceTranscriptEntry;
/** Summarizes transcript history for health endpoints and UI diagnostics. */
declare function getRealtimeVoiceTranscriptHealth(transcript: RealtimeVoiceTranscriptEntry[]): RealtimeVoiceTranscriptHealth;
/** Records low-volume bridge events while dropping raw audio chunks from diagnostics. */
declare function recordRealtimeVoiceBridgeEvent(events: RealtimeVoiceBridgeEventLogEntry[], event: RealtimeVoiceBridgeEvent, maxEntries?: number): void;
/** Summarizes recent bridge events without exposing the full rolling event buffer. */
declare function getRealtimeVoiceBridgeEventHealth(events: RealtimeVoiceBridgeEventLogEntry[]): RealtimeVoiceBridgeEventHealth;
/** Detects user transcript text that likely came from assistant speaker echo, not speech. */
declare function isLikelyRealtimeVoiceAssistantEchoTranscript(params: {
  transcript: RealtimeVoiceTranscriptEntry[];
  text: string;
  lookbackMs: number;
  nowMs?: number;
}): boolean;
/** Extends input suppression through the estimated playback tail for assistant audio. */
declare function extendRealtimeVoiceOutputEchoSuppression(params: {
  audio: Buffer;
  bytesPerMs: number;
  tailMs: number;
  nowMs: number;
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
}): {
  lastOutputPlayableUntilMs: number;
  suppressInputUntilMs: number;
  durationMs: number;
};
//#endregion
//#region src/talk/realtime-session-harness.d.ts
type RealtimeVoiceSessionHarnessTalkPayloads = {
  turnStarted: () => unknown;
  turnEnded: (reason: string) => unknown;
  inputAudioDelta: (audio: Buffer) => unknown;
  outputAudioStarted: () => unknown;
  outputAudioDelta: (audio: Buffer) => unknown;
  outputAudioDone: (reason: string) => unknown;
};
type RealtimeVoiceSessionHarnessEchoSuppression = {
  bytesPerMs: number;
  tailMs: number;
  transcriptLookbackMs: number;
};
type RealtimeVoiceSessionHarnessHealth = ReturnType<typeof getRealtimeVoiceTranscriptHealth> & Partial<ReturnType<typeof getRealtimeVoiceBridgeEventHealth>> & {
  providerConnected: boolean;
  realtimeReady: boolean;
  audioInputActive: boolean;
  audioOutputActive: boolean;
  lastInputAt?: string;
  lastOutputAt?: string;
  lastSuppressedInputAt?: string;
  lastInputBytes: number;
  lastOutputBytes: number;
  suppressedInputBytes: number;
  recentTalkEvents: Array<{
    id: string;
    type: TalkEvent["type"];
    sessionId: string;
    turnId?: string;
    seq: number;
    timestamp: string;
    final?: boolean;
  }>;
};
type RealtimeVoiceSessionHarness<TForcedConsultContext = unknown> = {
  readonly forcedConsults: RealtimeVoiceForcedConsultCoordinator<TForcedConsultContext>;
  readonly outputActivity: RealtimeVoiceOutputActivityTracker;
  readonly talk: TalkSessionController;
  readonly talkback: RealtimeVoiceAgentTalkbackQueue | undefined;
  readonly transcript: RealtimeVoiceTranscriptEntry[];
  close(): void;
  createBridge(params: RealtimeVoiceBridgeSessionParams): RealtimeVoiceBridgeSession;
  emit<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
  ensureTurn(): string;
  endTurn(reason?: string): void;
  finishResponse(outcome: RealtimeVoiceResponseOutcome): TalkTurnResult;
  finishOutputAudio(reason: string): void;
  flushOutput(flush: () => void): void;
  getHealth(params: {
    providerConnected: boolean;
    realtimeReady: boolean;
  }): RealtimeVoiceSessionHarnessHealth;
  handleBargeIn(options: RealtimeVoiceBargeInOptions, flushOutput: () => void): void;
  isLikelyAssistantEchoTranscript(text: string): boolean;
  isOutputPlaybackWindowActive(): boolean;
  recordInputAudio(audio: Buffer): boolean;
  recordOutputAudio(audio: Buffer, activity?: RealtimeVoiceOutputActivityDelta): void;
  recordTranscript(role: RealtimeVoiceRole, text: string): RealtimeVoiceTranscriptEntry;
};
declare function createRealtimeVoiceSessionHarness<TForcedConsultContext = unknown>(params: {
  talk: TalkSessionControllerParams;
  talkPayloads: RealtimeVoiceSessionHarnessTalkPayloads;
  onTalkEvent?: (event: TalkEvent) => void;
  talkback?: Omit<RealtimeVoiceAgentTalkbackQueueParams, "isStopped">;
  forcedConsults?: RealtimeVoiceForcedConsultCoordinatorOptions;
  echoSuppression?: RealtimeVoiceSessionHarnessEchoSuppression;
  transcriptLookbackMs?: number;
  captureBridgeEvents?: boolean;
}): RealtimeVoiceSessionHarness<TForcedConsultContext>;
//#endregion
//#region src/talk/audio-energy.d.ts
type AudioEnergyStats = {
  peak: number;
  rms: number;
};
/** Read RMS and absolute peak from complete little-endian signed PCM16 samples. */
declare function readPcm16AudioStats(audio: Buffer): AudioEnergyStats;
/** Calculate normalized RMS from G.711 mu-law bytes. */
declare function calculateMulawRms(muLaw: Buffer): number;
/** Build an OR-threshold gate with optional sustained onset, silence hold, and cooldown. */
declare function createSpeechThresholdGate(options: {
  cooldownMs?: number;
  peakThreshold?: number;
  rmsThreshold?: number;
  silenceFrames?: number;
  speechFrames?: number;
}): {
  accept(stats: AudioEnergyStats, acceptOptions?: {
    nowMs?: number;
    onTrigger?: () => boolean;
  }): boolean;
};
//#endregion
//#region src/talk/audio-codec.d.ts
/** Resample little-endian signed 16-bit PCM to another integer sample rate. */
declare function resamplePcm(input: Buffer, inputSampleRate: number, outputSampleRate: number): Buffer;
/** Create a chunk-safe PCM resampler that preserves filter and fractional phase state. */
declare function createStreamingPcmResampler(inputSampleRate: number, outputSampleRate: number): {
  process(chunk: Buffer): Buffer;
  flush(): Buffer;
};
/** Resample little-endian signed 16-bit PCM to the telephony 8 kHz rate. */
declare function resamplePcmTo8k(input: Buffer, inputSampleRate: number): Buffer;
/** Convert little-endian signed 16-bit PCM samples to G.711 mu-law bytes. */
declare function pcmToMulaw(pcm: Buffer): Buffer;
/** Expand G.711 mu-law bytes into little-endian signed 16-bit PCM samples. */
declare function mulawToPcm(mulaw: Buffer): Buffer;
/** Resample signed 16-bit PCM to 8 kHz and encode it as G.711 mu-law. */
declare function convertPcmToMulaw8k(pcm: Buffer, inputSampleRate: number): Buffer;
//#endregion
export { type AudioEnergyStats, type OpenAICompatibleRealtimeAudioFormat, REALTIME_VOICE_ACTIVATION_NAME_MAX_WORDS, REALTIME_VOICE_AGENT_CONSULT_SENDER_AUTH_VERSION, REALTIME_VOICE_AGENT_CONSULT_TOOL, REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME, REALTIME_VOICE_AGENT_CONSULT_TOOL_POLICIES, REALTIME_VOICE_AGENT_CONTROL_MODES, REALTIME_VOICE_AGENT_CONTROL_TOOL, REALTIME_VOICE_AGENT_CONTROL_TOOL_NAME, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ, type RealtimeVoiceActivationNameEdge, type RealtimeVoiceActivationNameMatchKind, type RealtimeVoiceActivationNameTranscriptResult, type RealtimeVoiceAgentConsultArgs, type RealtimeVoiceAgentConsultResult, type RealtimeVoiceAgentConsultRunner, type RealtimeVoiceAgentConsultRuntime, type RealtimeVoiceAgentConsultToolPolicy, type RealtimeVoiceAgentConsultTranscriptEntry, type RealtimeVoiceAgentControlIntent, type RealtimeVoiceAgentControlMode, type RealtimeVoiceAgentControlProviderResult, type RealtimeVoiceAgentControlResult, type RealtimeVoiceAgentTalkbackQueue, type RealtimeVoiceAgentTalkbackQueueParams, type RealtimeVoiceAgentTalkbackResult, type RealtimeVoiceAudioFormat, type RealtimeVoiceAudioQueue, type RealtimeVoiceAudioSink, type RealtimeVoiceBargeInOptions, type RealtimeVoiceBridge, type RealtimeVoiceBridgeCallbacks, type RealtimeVoiceBridgeCreateRequest, type RealtimeVoiceBridgeEvent, type RealtimeVoiceBridgeEventHealth, type RealtimeVoiceBridgeEventLogEntry, type RealtimeVoiceBridgeSession, type RealtimeVoiceBridgeSessionParams, type RealtimeVoiceBrowserSession, type RealtimeVoiceBrowserSessionCreateRequest, type RealtimeVoiceCloseDisposition, type RealtimeVoiceCloseOptions, type RealtimeVoiceCloseReason, type RealtimeVoiceConsultQuestionMatchOptions, type RealtimeVoiceConsultToolCallOutcome, type RealtimeVoiceFastContextConfig, type RealtimeVoiceFastContextConsultResult, type RealtimeVoiceFastContextLabels, type RealtimeVoiceForcedConsultCoordinator, type RealtimeVoiceForcedConsultCoordinatorOptions, type RealtimeVoiceForcedConsultHandle, type RealtimeVoiceForcedConsultNativeMatch, type RealtimeVoiceForcedConsultNativeRecentOptions, type RealtimeVoiceForcedConsultTimer, type RealtimeVoiceGatewayControl, type RealtimeVoiceMarkStrategy, type RealtimeVoiceOutputActivityDelta, type RealtimeVoiceOutputActivitySnapshot, type RealtimeVoiceOutputActivityTracker, type RealtimeVoiceOutputActivityTrackerOptions, type RealtimeVoiceProviderCapabilities, type RealtimeVoiceProviderConfig, type RealtimeVoiceProviderConfiguredContext, type RealtimeVoiceProviderId, type RealtimeVoiceProviderPlugin, type RealtimeVoiceProviderResolveConfigContext, type RealtimeVoiceResponseError, type RealtimeVoiceResponseOutcome, type RealtimeVoiceRole, type RealtimeVoiceSessionConnection, type RealtimeVoiceSessionHarness, RealtimeVoiceSessionLifecycle, type RealtimeVoiceSessionPolicy, type RealtimeVoiceSpeakableToolResultOptions, type RealtimeVoiceTool, type RealtimeVoiceToolCallEvent, type RealtimeVoiceToolResultOptions, type RealtimeVoiceTranscriptEntry, type RealtimeVoiceTranscriptHealth, type RealtimeVoiceTurnContextHandle, type RealtimeVoiceTurnContextTracker, type RealtimeVoiceTurnContextTrackerOptions, type RealtimeVoiceWakeNamePolicy, type ResolveConfiguredRealtimeVoiceProviderParams, type ResolvedRealtimeVoiceProvider, type SkippableRealtimeVoiceConsultTranscriptReason, TALK_EVENT_TYPES, type TalkBrain, type TalkEnsureTurnResult, type TalkEvent, type TalkEventContext, type TalkEventInput, type TalkEventSequencer, type TalkEventType, type TalkMode, type TalkSessionController, type TalkSessionControllerOptions, type TalkSessionControllerParams, type TalkTransport, type TalkTurnFailure, type TalkTurnFailureReason, type TalkTurnResult, type TalkTurnSuccess, assertRealtimeVoiceAgentConsultModelSelectionUnlocked, buildRealtimeVoiceAgentCancelProviderResult, buildRealtimeVoiceAgentConsultChatMessage, buildRealtimeVoiceAgentConsultPolicyInstructions, buildRealtimeVoiceAgentConsultPrompt, buildRealtimeVoiceAgentConsultWorkingResponse, buildRealtimeVoiceAgentControlSpeechMessage, buildRealtimeVoiceSessionInstructions, buildRealtimeVoiceSpeakExactMessage, calculateMulawRms, canonicalizeRealtimeVoiceProviderId, classifyRealtimeVoiceAgentControlText, classifyRealtimeVoiceConsultToolCall, classifySkippableRealtimeVoiceConsultTranscript, collectRealtimeVoiceAgentConsultVisibleText, consultRealtimeVoiceAgent, controlRealtimeVoiceAgentRun, convertPcmToMulaw8k, createRealtimeVoiceAgentTalkbackQueue, createRealtimeVoiceAudioQueue, createRealtimeVoiceBridgeSession, createRealtimeVoiceForcedConsultCoordinator, createRealtimeVoiceOutputActivityTracker, createRealtimeVoiceSessionHarness, createRealtimeVoiceTurnContextTracker, createSpeechThresholdGate, createStreamingPcmResampler, createTalkDiagnosticEvent, createTalkEventSequencer, createTalkLogRecord, createTalkSessionController, extendRealtimeVoiceOutputEchoSuppression, getRealtimeVoiceBridgeEventHealth, getRealtimeVoiceProvider, getRealtimeVoiceTranscriptHealth, isLikelyRealtimeVoiceAssistantEchoTranscript, isRealtimeVoiceAgentConsultToolPolicy, isRealtimeVoiceWakeNameRequired, isSupportedRealtimeVoiceActivationName, listRealtimeVoiceProviders, matchRealtimeVoiceActivationName, matchRealtimeVoiceConsultQuestions, mulawToPcm, normalizeRealtimeVoiceActivationName, normalizeRealtimeVoiceActivationNamePrefix, normalizeRealtimeVoiceAgentControlMode, normalizeRealtimeVoiceConsultQuestion, normalizeRealtimeVoiceProviderId, normalizeRealtimeVoiceResponseOutcome, normalizeSupportedRealtimeVoiceActivationName, normalizeTalkTransport, parseRealtimeVoiceAgentConsultArgs, parseRealtimeVoiceAgentControlToolArgs, pcmToMulaw, readPcm16AudioStats, readRealtimeVoiceConsultQuestion, readSpeakableRealtimeVoiceToolResult, realtimeVoiceActivationNameWordCount, realtimeVoiceAudioDurationMs, recordRealtimeVoiceBridgeEvent, recordRealtimeVoiceTranscript, recordTalkDiagnosticEvent, recordTalkLogEvent, recordTalkObservabilityEvent, resamplePcm, resamplePcmTo8k, resolveConfiguredRealtimeVoiceProvider, resolveRealtimeVoiceAgentConsultToolPolicy, resolveRealtimeVoiceAgentConsultTools, resolveRealtimeVoiceAgentConsultToolsAllow, resolveRealtimeVoiceAgentControlIntent, resolveRealtimeVoiceBargeIn, resolveRealtimeVoiceFastContextConsult, resolveRealtimeVoiceInterruptResponseOnInputAudio, resolveRealtimeVoiceMinBargeInAudioEndMs, resolveRealtimeVoiceSessionPolicy, shouldAutoControlRealtimeVoiceAgentText, sortRealtimeVoiceActivationNames, toOpenAICompatibleRealtimeAudioFormat };