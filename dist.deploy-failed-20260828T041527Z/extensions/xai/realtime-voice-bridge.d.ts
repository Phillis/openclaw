import { Y as RealtimeVoiceBridge, et as RealtimeVoiceToolResultOptions } from "../../runtime-api-B8urSeFb.js";
import "../../realtime-voice-QIDzlY5_.js";
import { r as RealtimeVoiceSessionConnection } from "../../realtime-voice-protocol-DQ2h9sFn.js";
import { XaiRealtimeVoiceEvents } from "./realtime-voice-events.js";
//#region extensions/xai/realtime-voice-bridge.d.ts
declare class XaiRealtimeVoiceBridge extends XaiRealtimeVoiceEvents implements RealtimeVoiceBridge {
  readonly supportsToolResultContinuation = false;
  private ws;
  private terminalError;
  private readonly lifecycle;
  private pendingToolResults;
  private pendingUserMessages;
  private connectionUrl;
  private readonly flowId;
  private sessionReadyFired;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(ts: number): void;
  sendUserMessage(text: string): void;
  triggerGreeting(instructions?: string): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  close(): void;
  isConnected(): boolean;
  private doConnect;
  private resolveConnectionParams;
  private attemptReconnect;
  private reconnectBlockReason;
  protected acceptsEvent(connection: RealtimeVoiceSessionConnection): boolean;
  protected onSessionUpdated(connection: RealtimeVoiceSessionConnection): void;
  protected sendEvent(event: unknown, detail?: string): void;
  private canSubmitInput;
  private failConnection;
  private enterTerminalState;
  private notifyClose;
  private resetTerminalState;
}
//#endregion
export { XaiRealtimeVoiceBridge };