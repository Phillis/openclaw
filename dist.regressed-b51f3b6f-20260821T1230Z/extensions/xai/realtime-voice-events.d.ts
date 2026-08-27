import { n as XaiRealtimeVoiceProtocol, r as RealtimeVoiceSessionConnection } from "../../realtime-voice-protocol-CN8efCrN.js";
import { _ as XaiRealtimeEvent } from "../../realtime-voice-config-DnuL-hUe.js";

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