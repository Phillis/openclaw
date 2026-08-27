import { Kt as RealtimeVoiceBridge, en as RealtimeVoiceToolResultOptions } from "../../plugin-entry-bE5OaTNY.js";
import "../../realtime-voice-CZ4NkWHg.js";
import { r as RealtimeVoiceSessionConnection, t as OpenAIRealtimeEvents } from "../../realtime-voice-events-UbSyCutp.js";
import { _ as OpenAIRealtimeVoiceBridgeConfig, h as OpenAIRealtimeUserMessageOptions } from "../../realtime-voice-session-policy-CeV4j6Kp.js";
//#region extensions/openai/realtime-voice-bridge.d.ts
declare class OpenAIRealtimeBridge extends OpenAIRealtimeEvents implements RealtimeVoiceBridge {
  private static readonly DEFAULT_MODEL;
  private static readonly MAX_RECONNECT_ATTEMPTS;
  private static readonly BASE_RECONNECT_DELAY_MS;
  private static readonly CONNECT_TIMEOUT_MS;
  private ws;
  private readonly lifecycle;
  private connectionUrl;
  private readonly flowId;
  private sessionReadyFired;
  private reconnectReason;
  private activeConnectionReason;
  private terminalError;
  private droppedInputAudioFrames;
  private lastInputAudioDropWarningAt;
  constructor(config: OpenAIRealtimeVoiceBridgeConfig);
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  sendUserMessage(text: string, options?: OpenAIRealtimeUserMessageOptions): void;
  triggerGreeting(instructions?: string): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  close(): void;
  isConnected(): boolean;
  private doConnect;
  private resolveConnectionParams;
  private resolveDefaultConnectionParams;
  private resolveApiKeyConnectionParams;
  private attemptReconnect;
  private markSessionReady;
  private resetTerminalState;
  private failConnection;
  private notifyClose;
  protected sendEvent(event: unknown, detail?: string): void;
  protected acceptsEvent(connection: RealtimeVoiceSessionConnection): boolean;
  protected isTransportOpen(): boolean;
  protected onSessionUpdated(connection: RealtimeVoiceSessionConnection): void;
  protected rotateExpiredSession(): void;
  protected failToolCallSessionLimit(error: Error, connection: RealtimeVoiceSessionConnection): void;
}
//#endregion
export { OpenAIRealtimeBridge };