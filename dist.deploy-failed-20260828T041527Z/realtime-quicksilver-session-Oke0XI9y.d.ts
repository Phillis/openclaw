import { At as PluginLogger, Jt as RealtimeVoiceBrowserSession, Kt as RealtimeVoiceBridge, Yt as RealtimeVoiceBrowserSessionCreateRequest, Zt as RealtimeVoiceProviderCapabilities } from "./plugin-entry-bE5OaTNY.js";
import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
import "./config-contracts-yQGnmAhr.js";
import "./realtime-voice-CZ4NkWHg.js";
import { r as OpenAIQuicksilverInitialItem, t as OpenAIQuicksilverAuth } from "./realtime-quicksilver-wire-C6_qTF93.js";
import { n as OpenAIQuicksilverSocketFactory } from "./realtime-quicksilver-sideband-B7km5XUv.js";
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
  gaSession?: Record<string, unknown> & {
    model: string;
  };
  gaSideband?: {
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