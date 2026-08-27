import { t as Result } from "./result-VHVNeWs6.js";
import { n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
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
/**
 * Session-level correlation fields copied onto every Talk event.
 */
type TalkEventContext = {
  sessionId: string;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
};
/**
 * Sequenced Talk event envelope delivered to observers and gateway clients.
 */
type TalkEvent<TPayload = unknown> = TalkEventContext & {
  id: string;
  type: TalkEventType;
  turnId?: string;
  captureId?: string;
  seq: number;
  timestamp: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
  payload: TPayload;
};
/**
 * Caller-supplied event payload before session context, id, sequence, and timestamp are attached.
 */
type TalkEventInput<TPayload = unknown> = {
  type: TalkEventType;
  payload: TPayload;
  turnId?: string;
  captureId?: string;
  timestamp?: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
};
/**
 * Per-session event sequencer that enforces correlation ids before emitting events.
 */
type TalkEventSequencer = {
  next<TPayload>(input: TalkEventInput<TPayload>): TalkEvent<TPayload>;
};
/**
 * Creates a sequencer that stamps Talk events with stable session context and monotonic ids.
 */
declare function createTalkEventSequencer(context: TalkEventContext, options?: {
  now?: () => Date | string;
}): TalkEventSequencer;
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
declare function realtimeVoiceAudioDurationMs(format: RealtimeVoiceAudioFormat, byteLength: number): number;
type OpenAICompatibleRealtimeAudioFormat = {
  type: "audio/pcm";
  rate: 24000;
} | {
  type: "audio/pcmu";
};
declare function toOpenAICompatibleRealtimeAudioFormat(format: RealtimeVoiceAudioFormat): OpenAICompatibleRealtimeAudioFormat;
declare const REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ: RealtimeVoiceAudioFormat;
declare const REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ: RealtimeVoiceAudioFormat;
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
type RealtimeVoiceCloseDisposition = "abort" | "detach";
type RealtimeVoiceCloseOptions = {
  /** Whether closing the transport also cancels work already accepted by the host. */
  disposition?: RealtimeVoiceCloseDisposition;
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
/** Normalizes OpenAI-style realtime response status details into the shared Talk contract. */
declare function normalizeRealtimeVoiceResponseOutcome(params: {
  providerLabel: string;
  response: unknown;
  responseId?: unknown;
}): RealtimeVoiceResponseOutcome;
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
  supportsBargeIn?: boolean;
  /** True when provider VAD reports confirmed interruptions through onClearAudio("barge-in"). */
  handlesInputAudioBargeIn?: boolean;
  supportsToolCalls?: boolean;
  /** True when user transcripts are reliable enough to gate responses on a leading wake name. */
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
  /** Host-selected agent scope for provider auth readiness. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceAgentConsultRunner = (params: {
  prompt: string;
  signal?: AbortSignal;
}) => Promise<{
  text: string;
}>;
type RealtimeVoiceBridgeCreateRequest = RealtimeVoiceBridgeCallbacks & {
  cfg?: OpenClawConfig;
  /** Host-selected agent scope for provider auth and agent-owned bridge state. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  instructions?: string;
  language?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  tools?: RealtimeVoiceTool[];
  /** Host-injected agent delegation runner for provider-owned realtime control channels. */
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
  reasoningEffort?: string;
  /** Host-injected agent delegation runner for provider-owned realtime control channels. */
  runAgentConsult?: RealtimeVoiceAgentConsultRunner;
  /** Host-owned control callbacks for browser media sessions whose provider wire stays server-side. */
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
  offerResponseMaxBytes?: number;
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
  supportsToolResultContinuation?: boolean;
  /** False when the provider cannot accept a tool result without starting a response. */
  supportsToolResultSuppression?: boolean;
  /** Per-session override for provider-confirmed input-audio barge-in handling. */
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
  close(options?: RealtimeVoiceCloseOptions): void;
  isConnected(): boolean;
};
type RealtimeVoiceBargeInOptions = {
  /**
   * The caller has already confirmed assistant audio is still playing in its output sink.
   * This lets providers interrupt output even when the sink cannot provide real playback marks.
   */
  audioPlaybackActive?: boolean;
  /** Interrupt even when normal barge-in audio-duration guards would treat the event as echo. */
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
/** Trusted caller facts projected by core; never accepted from tool arguments. */
type TranscriptToolCaller = {
  kind: "operator";
  source: "channel-owner" | "local" | "scheduled";
} | {
  kind: "channel";
  channel: string;
  accountId?: string;
  senderId: string;
  groupId?: string;
  groupSpace?: string;
  roleIds: readonly string[];
};
type TranscriptToolAction = "import" | "start" | "status" | "stop" | "summarize";
type TranscriptSourceAccessControl = {
  /** Ingress channel whose trusted account owns this provider's account namespace. */
  channelId: string;
  /** Resolve and validate the canonical account before persistence. */
  resolveAccountId: (params: {
    cfg?: OpenClawConfig;
    source: TranscriptSourceLocator;
  }) => Result<string | undefined, string>;
  /** Apply the provider's native access policy to the resolved source. */
  authorize: (params: {
    action: TranscriptToolAction;
    caller: TranscriptToolCaller;
    cfg?: OpenClawConfig;
    source: TranscriptSourceLocator;
  }) => Promise<Result<void, string>>;
};
/** Provider contract for transcript capture/import integrations. */
type TranscriptSourceProvider = {
  id: string;
  aliases?: readonly string[];
  /** Closed access contract for providers sharing one inbound channel namespace. */
  accessControl?: TranscriptSourceAccessControl;
  name: string;
  sourceKinds: readonly TranscriptSourceKind[];
  start?: (request: TranscriptStartRequest) => Promise<TranscriptsStartResult>;
  stop?: (request: TranscriptStopRequest) => Promise<TranscriptsStopResult>;
  status?: (source: TranscriptSourceLocator, cfg?: OpenClawConfig) => Promise<TranscriptSourceStatus[]>;
  importTranscript?: (request: TranscriptImportRequest) => Promise<TranscriptUtterance[]>;
};
//#endregion
export { TalkEventType as $, RealtimeVoiceCloseOptions as A, RealtimeVoiceRole as B, RealtimeVoiceBridge as C, RealtimeVoiceBrowserSession as D, RealtimeVoiceBridgeEvent as E, RealtimeVoiceProviderConfiguredContext as F, realtimeVoiceAudioDurationMs as G, RealtimeVoiceToolCallEvent as H, RealtimeVoiceProviderId as I, TalkBrain as J, toOpenAICompatibleRealtimeAudioFormat as K, RealtimeVoiceProviderResolveConfigContext as L, RealtimeVoiceGatewayControl as M, RealtimeVoiceProviderCapabilities as N, RealtimeVoiceBrowserSessionCreateRequest as O, RealtimeVoiceProviderConfig as P, TalkEventSequencer as Q, RealtimeVoiceResponseError as R, RealtimeVoiceBargeInOptions as S, RealtimeVoiceBridgeCreateRequest as T, RealtimeVoiceToolResultOptions as U, RealtimeVoiceTool as V, normalizeRealtimeVoiceResponseOutcome as W, TalkEventContext as X, TalkEvent as Y, TalkEventInput as Z, REALTIME_VOICE_AUDIO_FORMAT_G711_ULAW_8KHZ as _, TranscriptSourceKind as a, RealtimeVoiceAudioClearReason as b, TranscriptSourceStatus as c, TranscriptToolAction as d, TalkMode as et, TranscriptToolCaller as f, OpenAICompatibleRealtimeAudioFormat as g, TranscriptsStopResult as h, TranscriptSourceAccessControl as i, RealtimeVoiceCloseReason as j, RealtimeVoiceCloseDisposition as k, TranscriptStartRequest as l, TranscriptsStartResult as m, TranscriptParticipant as n, createTalkEventSequencer as nt, TranscriptSourceLocator as o, TranscriptUtterance as p, TALK_EVENT_TYPES as q, TranscriptSessionDescriptor as r, TranscriptSourceProvider as s, TranscriptImportRequest as t, TalkTransport as tt, TranscriptStopRequest as u, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ as v, RealtimeVoiceBridgeCallbacks as w, RealtimeVoiceAudioFormat as x, RealtimeVoiceAgentConsultRunner as y, RealtimeVoiceResponseOutcome as z };