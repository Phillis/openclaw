import { At as PluginLogger, Kt as RealtimeVoiceBridge, en as RealtimeVoiceToolResultOptions, qt as RealtimeVoiceBridgeCreateRequest } from "../../plugin-entry-DyrRrRy2.js";
import "../../realtime-voice-CMgQVfpG.js";
import { t as OpenAIQuicksilverAuth } from "../../realtime-quicksilver-wire-C6_qTF93.js";
import { n as OpenAIQuicksilverSocketFactory } from "../../realtime-quicksilver-sideband-B7km5XUv.js";
//#region extensions/openai/realtime-quicksilver-bridge.d.ts
type OpenAIQuicksilverVoiceBridgeConfig = RealtimeVoiceBridgeCreateRequest & {
  model: string;
  voice?: string;
  resolveAuth: () => Promise<OpenAIQuicksilverAuth>;
  logger?: Pick<PluginLogger, "warn">;
  webSocketFactory?: OpenAIQuicksilverSocketFactory;
};
declare class OpenAIQuicksilverVoiceBridge implements RealtimeVoiceBridge {
  private readonly config;
  readonly supportsToolResultContinuation = true;
  readonly supportsToolResultSuppression = true;
  readonly handlesInputAudioBargeIn = false;
  private socket;
  private readonly lifecycle;
  private inboundTelephonyResampler;
  private outboundTelephonyResampler;
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