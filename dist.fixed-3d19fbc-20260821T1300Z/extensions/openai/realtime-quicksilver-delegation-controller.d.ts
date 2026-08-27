import { p as PluginLogger } from "../../types-CCx6rk6K.js";
import { R as RealtimeVoiceAgentConsultRunner } from "../../types-_oRRa2Gg.js";
import { n as OpenAIQuicksilverInboundEvent } from "../../realtime-quicksilver-wire-C6_qTF93.js";
import { t as OpenAIQuicksilverSocket } from "../../realtime-quicksilver-sideband-TIZPyDza.js";
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
  private partialTranscriptRole;
  private pendingDelegation;
  private stopped;
  private transcript;
  constructor(options: OpenAIQuicksilverDelegationControllerOptions);
  handleFrame(data: RawData, isBinary: boolean): void;
  handleEvent(event: OpenAIQuicksilverInboundEvent): void;
  sendToActiveDelegation(text: string, channel: "speakable" | "commentary"): void;
  stop(reason: Error): void;
  private appendTranscript;
  private startDelegation;
  private launchDelegation;
  private runDelegation;
  private sendAppend;
  private fail;
}
//#endregion
export { OpenAIQuicksilverDelegationController };