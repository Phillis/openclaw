import { p as PluginLogger } from "../../types-DYqBZyXL.js";
import { H as RealtimeVoiceBridgeCreateRequest, V as RealtimeVoiceBridge } from "../../types-VwFxFFS1.js";
import { t as OpenAIQuicksilverAuth } from "../../realtime-quicksilver-wire-C6_qTF93.js";
import { n as OpenAIQuicksilverSocketFactory } from "../../realtime-quicksilver-sideband-TIZPyDza.js";
import { OpenAIQuicksilverAudioPeerCallbacks, OpenAIQuicksilverAudioPeerContract } from "./realtime-quicksilver-peer.runtime.js";

//#region extensions/openai/realtime-quicksilver-gateway-bridge.d.ts
type OpenAIQuicksilverBridgeConfig = RealtimeVoiceBridgeCreateRequest & {
  model: string;
  voice: string;
  logger: Pick<PluginLogger, "debug" | "warn">;
  resolveAuth: () => Promise<OpenAIQuicksilverAuth>;
  createPeer?: (callbacks: OpenAIQuicksilverAudioPeerCallbacks, signal: AbortSignal) => Promise<OpenAIQuicksilverAudioPeerContract>;
  fetchImpl?: typeof fetch;
  webSocketFactory?: OpenAIQuicksilverSocketFactory;
  connectTimeoutMs?: number;
};
/** Realtime voice bridge used only when a Gateway relay injects the agent runner. */
declare class OpenAIQuicksilverGatewayBridge implements RealtimeVoiceBridge {
  private readonly config;
  readonly supportsToolResultContinuation = false;
  readonly supportsToolResultSuppression = false;
  private abortController;
  private connectPromise;
  private delegations;
  private connected;
  private closed;
  private closeNotified;
  private peer;
  private pendingAudio;
  private ready;
  private sideband;
  private timer;
  constructor(config: OpenAIQuicksilverBridgeConfig);
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(_ts: number): void;
  sendUserMessage(text: string): void;
  submitToolResult(): void;
  acknowledgeMark(): void;
  close(): void;
  isConnected(): boolean;
  private connectInternal;
  private attachSidebandHandlers;
  private handleSidebandFrame;
  private scheduleExpiry;
  private fail;
  private teardown;
  private releaseResources;
}
//#endregion
export { OpenAIQuicksilverGatewayBridge };