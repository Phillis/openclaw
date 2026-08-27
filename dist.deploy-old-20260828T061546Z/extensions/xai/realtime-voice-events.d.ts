import "../../realtime-voice-QIDzlY5_.js";
import { n as XaiRealtimeVoiceProtocol, r as RealtimeVoiceSessionConnection } from "../../realtime-voice-protocol-DQ2h9sFn.js";
import { g as XaiRealtimeEvent } from "../../realtime-voice-config-B5Rt43HF.js";
//#region extensions/xai/realtime-voice-events.d.ts
declare class XaiRealtimeMalformedAudioError extends Error {}
declare abstract class XaiRealtimeVoiceEvents extends XaiRealtimeVoiceProtocol {
  private assistantTranscriptBuffer;
  private assistantTranscriptFinalized;
  private finalizedToolCallItems;
  private inputTranscriptReplacements;
  protected abstract acceptsEvent(connection: RealtimeVoiceSessionConnection): boolean;
  protected abstract onSessionUpdated(connection: RealtimeVoiceSessionConnection): void;
  protected handleEvent(event: XaiRealtimeEvent, connection: RealtimeVoiceSessionConnection): void;
  protected resetInputTranscripts(): void;
  private emitCompletedToolCall;
  private bufferCompletedToolCall;
  private appendAssistantTranscriptDelta;
  private flushAssistantTranscript;
  private resetAssistantTranscript;
  private inputTranscriptKey;
  private handleErrorEvent;
  private describeServerEvent;
}
//#endregion
export { XaiRealtimeMalformedAudioError, XaiRealtimeVoiceEvents };