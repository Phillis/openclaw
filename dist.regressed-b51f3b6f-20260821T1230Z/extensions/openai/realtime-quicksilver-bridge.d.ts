import { H as RealtimeVoiceBridgeCreateRequest, J as RealtimeVoiceToolResultOptions, V as RealtimeVoiceBridge } from "../../types-_oRRa2Gg.js";
import { t as OpenAIQuicksilverAuth } from "../../realtime-quicksilver-wire-C6_qTF93.js";
import { n as OpenAIQuicksilverSocketFactory } from "../../realtime-quicksilver-sideband-TIZPyDza.js";

//#region extensions/openai/realtime-quicksilver-bridge.d.ts
type OpenAIQuicksilverVoiceBridgeConfig = RealtimeVoiceBridgeCreateRequest & {
  model: string;
  voice?: string;
  resolveAuth: () => Promise<OpenAIQuicksilverAuth>;
  webSocketFactory?: OpenAIQuicksilverSocketFactory;
};
declare class OpenAIQuicksilverVoiceBridge implements RealtimeVoiceBridge {
  private readonly config;
  readonly supportsToolResultContinuation = true;
  readonly supportsToolResultSuppression = true;
  readonly handlesInputAudioBargeIn = false;
  private socket;
  private readonly lifecycle;
  private activeDelegations;
  private readonly flowId;
  private readonly requestIds;
  constructor(config: OpenAIQuicksilverVoiceBridgeConfig);
  connect(): Promise<void>;
  private connectConnection;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(_ts: number): void;
  sendUserMessage(text: string): void;
  triggerGreeting(instructions?: string): void;
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void;
  acknowledgeMark(_markName?: string): void;
  close(): void;
  isConnected(): boolean;
  handleBargeIn(): void;
  private createSocketFactory;
  private waitForConnection;
  private handleEvent;
  private sendAudioNow;
  private sendContext;
  private sendEvent;
  private fail;
  private failLifecycle;
  private resetTerminalState;
  private closeSocket;
  private notifyClose;
}
//#endregion
export { OpenAIQuicksilverVoiceBridge };