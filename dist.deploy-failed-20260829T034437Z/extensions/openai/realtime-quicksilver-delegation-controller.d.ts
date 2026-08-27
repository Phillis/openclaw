import { At as PluginLogger, Ut as RealtimeVoiceAgentConsultRunner } from "../../plugin-entry-DF9X1uwv.js";
import "../../realtime-voice-BaoYop3s.js";
import { n as OpenAIQuicksilverInboundEvent } from "../../realtime-quicksilver-wire-C6_qTF93.js";
import { t as OpenAIQuicksilverSocket } from "../../realtime-quicksilver-sideband-B7km5XUv.js";
import { RawData } from "ws";
//#region extensions/openai/realtime-quicksilver-delegation-controller.d.ts
type OpenAIQuicksilverDelegationControllerOptions = {
  getSocket: () => OpenAIQuicksilverSocket | undefined;
  isCanceledError?: (error: unknown) => boolean;
  logger: Pick<PluginLogger, "debug" | "warn">;
  onFatalError: (error: Error) => void;
  onSessionStarted?: (expiresAt: number | undefined) => void;
  onTranscript?: (role: "user" | "assistant", text: string, done: boolean) => void;
  onWireEventType?: (eventType: string) => void;
  runAgentConsult: RealtimeVoiceAgentConsultRunner;
  signal: AbortSignal;
};
/** Owns the provider's single active delegation and its once-consumed transcript context. */
declare class OpenAIQuicksilverDelegationController {
  private readonly options;
  private activeDelegationId;
  private consultController;
  private readonly onSessionAbort;
  private partialTranscriptRole;
  private pendingDelegation;
  private stopped;
  private transcript;
  constructor(options: OpenAIQuicksilverDelegationControllerOptions);
  handleFrame(data: RawData, isBinary: boolean): void;
  handleEvent(event: OpenAIQuicksilverInboundEvent): void;
  sendToActiveDelegation(text: string, channel: "speakable" | "commentary"): void;
  stop(reason: Error): void;
  /** Releases sideband ownership without canceling work already accepted by the host. */
  detach(): void;
  private appendTranscript;
  private startDelegation;
  private launchDelegation;
  private markStopped;
  private runDelegation;
  private sendAppend;
  private fail;
}
//#endregion
export { OpenAIQuicksilverDelegationController };