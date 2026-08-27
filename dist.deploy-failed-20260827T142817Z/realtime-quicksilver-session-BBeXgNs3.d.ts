import { p as PluginLogger } from "./types-DYqBZyXL.js";
import { n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { G as RealtimeVoiceProviderCapabilities, U as RealtimeVoiceBrowserSession, V as RealtimeVoiceBridge, W as RealtimeVoiceBrowserSessionCreateRequest } from "./types-VwFxFFS1.js";
import { r as OpenAIQuicksilverInitialItem, t as OpenAIQuicksilverAuth } from "./realtime-quicksilver-wire-C6_qTF93.js";
import { n as OpenAIQuicksilverSocketFactory } from "./realtime-quicksilver-sideband-TIZPyDza.js";
import { IncomingMessage, ServerResponse } from "node:http";

//#region extensions/openai/realtime-quicksilver-session.d.ts
declare const OPENAI_QUICKSILVER_OFFER_PATH = "/plugins/openai/realtime/calls";
declare const OPENAI_QUICKSILVER_CAPABILITIES: {
  transports: ("webrtc" | "gateway-relay")[];
  handlesAgentConsult: true;
  supportsToolCalls: false;
  supportsVideoFrames: false;
};
type OpenAIQuicksilverSessionRequest = RealtimeVoiceBrowserSessionCreateRequest & {
  initialItems?: OpenAIQuicksilverInitialItem[];
  ownerConnId?: string;
  gaSideband?: {
    session: Record<string, unknown> & {
      model: string;
    };
    createBridge: (params: {
      apiKey: string;
      callId: string;
      onTerminal: () => void;
    }) => RealtimeVoiceBridge;
  };
};
declare function resolveOpenAIChatGptSubscriptionAuth(params: {
  cfg?: OpenClawConfig;
  agentDir?: string;
}): Promise<Extract<OpenAIQuicksilverAuth, {
  type: "oauth";
}> | undefined>;
declare function createOpenAIQuicksilverBrowserSessionBroker(params: {
  getConfig: () => OpenClawConfig | undefined;
  logger: Pick<PluginLogger, "debug" | "warn">;
  fetchImpl?: typeof fetch;
  webSocketFactory?: OpenAIQuicksilverSocketFactory;
}): {
  broker: {
    capabilities: Partial<RealtimeVoiceProviderCapabilities> & {
      handlesAgentConsult: true;
    };
    createBrowserSession: (request: OpenAIQuicksilverSessionRequest, auth: OpenAIQuicksilverAuth) => Promise<RealtimeVoiceBrowserSession>;
    cancelBrowserSession: (session: RealtimeVoiceBrowserSession) => Promise<void> | void;
  };
  handler: (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
  cleanup: () => Promise<void>;
  getSessionCounts: () => {
    pending: number;
    inFlight: number;
    active: number;
    reservations: number;
  };
};
//#endregion
export { resolveOpenAIChatGptSubscriptionAuth as i, OPENAI_QUICKSILVER_OFFER_PATH as n, createOpenAIQuicksilverBrowserSessionBroker as r, OPENAI_QUICKSILVER_CAPABILITIES as t };