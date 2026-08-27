import { Gt as RealtimeVoiceBargeInOptions, en as RealtimeVoiceToolResultOptions } from "./plugin-entry-Bvo-51M-.js";
import "./realtime-voice-YZBAIZsD.js";
import { S as RealtimeTurnDetectionConfig, _ as OpenAIRealtimeVoiceBridgeConfig, h as OpenAIRealtimeUserMessageOptions, x as RealtimeGaSessionUpdate, y as RealtimeAzureDeploymentSessionUpdate } from "./realtime-voice-session-policy-UgP3G-0o.js";
//#region extensions/openai/realtime-voice-protocol.d.ts
declare abstract class OpenAIRealtimeProtocol {
  protected readonly config: OpenAIRealtimeVoiceBridgeConfig;
  static readonly MAX_TOOL_ARGUMENT_BYTES = 256000;
  static readonly MAX_COMPLETED_TOOL_CALL_IDS = 1024;
  readonly supportsToolResultContinuation = true;
  readonly supportsToolResultSuppression = true;
  protected nextMarkSequence: number;
  protected oldestOutstandingMarkSequence: number | null;
  protected latestOutstandingMarkSequence: number | null;
  protected responseActive: boolean;
  protected responseCreateInFlight: boolean;
  protected manualResponseCreateEventId: string | null;
  protected responseCancelInFlight: boolean;
  protected manualResponseCancelEventId: string | null;
  protected responseCreatePending: boolean;
  protected autoRespondSuppressedForManualResponse: boolean;
  protected continuingToolCallIds: Set<string>;
  protected pendingToolCallIds: Set<string>;
  protected latestMediaTimestamp: number;
  protected assistantAudioItem: {
    itemId: string;
    bytes: number;
    startTimestamp: number;
  } | null;
  protected completedToolCallIds: Set<string>;
  protected standaloneSpeechQueue: string[];
  protected standaloneSpeechActive: boolean;
  protected standaloneSpeechEventId: string | null;
  private readonly audioFormat;
  constructor(config: OpenAIRealtimeVoiceBridgeConfig);
  setMediaTimestamp(ts: number): void;
  acknowledgeMark(markName?: string): void;
  protected sendSessionUpdate(): void;
  protected buildGaSessionUpdate(): RealtimeGaSessionUpdate;
  protected usesAzureDeploymentRealtimeApi(): boolean;
  protected buildAzureDeploymentSessionUpdate(): RealtimeAzureDeploymentSessionUpdate;
  protected buildTurnDetectionConfig(options?: {
    createResponse?: boolean;
    includeInterruptResponse?: boolean;
  }): RealtimeTurnDetectionConfig;
  protected sendAutoResponseSessionUpdate(createResponse: boolean): void;
  protected resolveLegacyRealtimeAudioFormat(): "g711_ulaw" | "pcm16";
  protected releaseResponseState(options?: {
    drain?: boolean;
  }): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  protected requestResponseCreate(options?: OpenAIRealtimeUserMessageOptions): void;
  protected flushStandaloneSpeech(): void;
  protected suppressAutoRespondForManualResponse(): void;
  protected restoreAutoRespondAfterManualResponse(): void;
  protected flushPendingResponseCreate(): void;
  protected resetRealtimeSessionState(): void;
  protected sendMark(): void;
  protected clearOutstandingMarks(): void;
  abstract submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  protected abstract sendEvent(event: unknown, detail?: string): void;
}
//#endregion
export { OpenAIRealtimeProtocol as t };