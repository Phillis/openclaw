import { b as RealtimeEvent } from "./realtime-voice-session-policy-RYlcLlbp.js";
import { t as OpenAIRealtimeProtocol } from "./realtime-voice-protocol-Cgyv6R-4.js";

//#region src/talk/realtime-session-lifecycle.d.ts
type RealtimeVoiceSessionConnection = Readonly<{
  id: symbol;
  signal: AbortSignal;
}>;
//#endregion
//#region extensions/openai/realtime-voice-events.d.ts
declare class OpenAIRealtimeMalformedAudioError extends Error {}
declare abstract class OpenAIRealtimeEvents extends OpenAIRealtimeProtocol {
  protected handleEvent(event: RealtimeEvent, connection: RealtimeVoiceSessionConnection): void;
  private handleCompletedResponse;
  private handleResponseDone;
  private rejectToolCallArguments;
  private describeServerEvent;
  protected abstract acceptsEvent(connection: RealtimeVoiceSessionConnection): boolean;
  protected abstract isTransportOpen(): boolean;
  protected abstract onSessionUpdated(connection: RealtimeVoiceSessionConnection): void;
  protected abstract rotateExpiredSession(): void;
  protected abstract failToolCallSessionLimit(error: Error, connection: RealtimeVoiceSessionConnection): void;
}
//#endregion
export { OpenAIRealtimeMalformedAudioError as n, RealtimeVoiceSessionConnection as r, OpenAIRealtimeEvents as t };