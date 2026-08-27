import { at as RealtimeVoiceBargeInOptions, dt as RealtimeVoiceToolResultOptions, it as RealtimeVoiceAudioFormat } from "./types-R6eI-mj_.js";
import { _ as XaiRealtimeEvent, v as XaiRealtimeSessionUpdate, y as XaiRealtimeVoiceBridgeConfig } from "./realtime-voice-config-DV3YOtdc.js";

//#region src/talk/realtime-session-lifecycle.d.ts
type RealtimeVoiceSessionConnection = Readonly<{
  id: symbol;
  signal: AbortSignal;
}>;
//#endregion
//#region extensions/xai/realtime-voice-protocol.d.ts
declare class XaiRealtimePlaybackMarkOverflowError extends Error {}
declare abstract class XaiRealtimeVoiceProtocol {
  protected readonly config: XaiRealtimeVoiceBridgeConfig;
  protected readonly audioFormat: RealtimeVoiceAudioFormat;
  protected markQueue: string[];
  protected responseStartTimestamp: number | null;
  protected responseActive: boolean;
  protected responseCreateInFlight: boolean;
  protected responseCancelInFlight: boolean;
  protected responseCreatePending: boolean;
  protected continuingToolCallIds: Set<string>;
  protected pendingToolCallIds: Set<string>;
  protected latestMediaTimestamp: number;
  protected lastAssistantItemId: string | null;
  protected toolCallBuffers: Map<string, {
    name: string;
    callId: string;
    args: string;
  }>;
  protected deliveredToolCallKeys: Set<string>;
  protected pendingToolResultAcks: Set<string>;
  protected conversationId: string | null;
  constructor(config: XaiRealtimeVoiceBridgeConfig);
  protected abstract sendEvent(event: unknown, detail?: string): void;
  protected sendUserMessageNow(text: string): void;
  protected submitToolResultNow(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  acknowledgeMark(markName?: string): void;
  handleBargeIn(options?: RealtimeVoiceBargeInOptions): void;
  protected handleServerVadBargeIn(): void;
  protected buildSessionUpdate(): XaiRealtimeSessionUpdate;
  private resolveRealtimeAudioFormat;
  protected emitToolCallOnce(fields: {
    itemId?: string;
    callId?: string;
    name?: string;
    rawArgs?: string;
  }): void;
  private rejectToolCallArguments;
  private flushPendingResponseCreateAfterToolResults;
  protected requestResponseCreate(): void;
  protected flushPendingResponseCreate(): void;
  protected resetRealtimeSessionState(options?: {
    preserveToolCallState?: boolean;
  }): void;
  protected emitAudioWithPlaybackMark(audio: Buffer): void;
  protected abstract resetInputTranscripts(): void;
  protected abstract handleEvent(event: XaiRealtimeEvent, connection: RealtimeVoiceSessionConnection): void;
}
//#endregion
export { XaiRealtimeVoiceProtocol as n, RealtimeVoiceSessionConnection as r, XaiRealtimePlaybackMarkOverflowError as t };