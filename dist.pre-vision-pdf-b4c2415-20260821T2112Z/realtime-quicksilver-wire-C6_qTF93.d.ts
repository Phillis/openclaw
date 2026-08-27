//#region extensions/openai/realtime-quicksilver-wire.d.ts
declare const OPENAI_QUICKSILVER_VOICES: readonly ["alloy", "ash", "ballad", "cedar", "coral", "echo", "marin", "sage", "shimmer", "verse"];
type OpenAIQuicksilverVoice = (typeof OPENAI_QUICKSILVER_VOICES)[number];
type OpenAIQuicksilverAuth = {
  type: "api-key";
  token: string;
} | {
  type: "oauth";
  token: string;
  accountId: string;
};
type OpenAIQuicksilverRequestIds = {
  realtimeSessionId: string;
  sessionId: string;
  threadId: string;
};
type OpenAIQuicksilverInitialItem = {
  role: "user" | "assistant";
  text: string;
};
type OpenAIQuicksilverSession = {
  model: string;
  instructions: string;
  audio: {
    output: {
      voice: OpenAIQuicksilverVoice;
    };
  };
  delegation: {
    type: "client";
  };
  initial_items?: Array<{
    type: "message";
    role: "user" | "assistant";
    content: Array<{
      type: "input_text" | "output_text";
      text: string;
    }>;
  }>;
};
type OpenAIQuicksilverSessionUpdate = {
  type: "session.update";
  session: Omit<OpenAIQuicksilverSession, "model">;
};
type OpenAIQuicksilverInboundEvent = {
  kind: "ignored";
  eventType: string;
} | {
  kind: "session-started";
  expiresAt?: number;
} | {
  kind: "audio";
  data: string;
} | {
  kind: "transcript-delta";
  role: "user" | "assistant";
  text: string;
} | {
  kind: "transcript-done";
  role: "user" | "assistant";
  text: string;
} | {
  kind: "delegation";
  id: string;
  prompt: string;
} | {
  kind: "error";
  message: string;
  fatalAuth: boolean;
} | {
  kind: "unknown";
  eventType: string;
};
declare function resolveOpenAIQuicksilverVoice(value: unknown): OpenAIQuicksilverVoice;
declare function buildOpenAIQuicksilverSession(params: {
  model: string;
  instructions?: string;
  voice?: string;
  initialItems?: readonly OpenAIQuicksilverInitialItem[];
}): OpenAIQuicksilverSession;
/** Builds the direct Frameless Bidi WebSocket handshake used by Codex realtime v3. */
declare function buildOpenAIQuicksilverSessionUpdate(params: {
  instructions?: string;
  voice?: string;
  initialItems?: readonly OpenAIQuicksilverInitialItem[];
}): OpenAIQuicksilverSessionUpdate;
declare function buildOpenAIQuicksilverWebSocketUrl(model: string): string;
declare function boundOpenAIQuicksilverContextItems(items: readonly OpenAIQuicksilverInitialItem[]): OpenAIQuicksilverInitialItem[];
declare function openAIQuicksilverAuthHeaders(auth: OpenAIQuicksilverAuth, requestIds: OpenAIQuicksilverRequestIds): Record<string, string>;
declare function buildOpenAIRealtimeSidebandUrl(callId: string): string;
declare function createOpenAIQuicksilverCall(params: {
  auth: OpenAIQuicksilverAuth;
  sdp: string;
  session: OpenAIQuicksilverSession | (Record<string, unknown> & {
    model: string;
  });
  requestIds: OpenAIQuicksilverRequestIds;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
  gaSideband?: boolean;
}): Promise<{
  kind: "gpt-live";
  status: number;
  answerSdp: string;
  callId: string;
  sidebandUrl: string;
} | {
  kind: "ga-realtime";
  status: number;
  answerSdp: string;
} | {
  kind: "ga-sideband";
  status: number;
  answerSdp: string;
  callId: string;
  sidebandUrl: string;
}>;
declare function hangupOpenAIRealtimeCall(params: {
  apiKey: string;
  callId: string;
  signal?: AbortSignal;
  fetchImpl?: typeof fetch;
}): Promise<void>;
declare function parseOpenAIQuicksilverEvent(payload: string): OpenAIQuicksilverInboundEvent | null;
declare function chunkOpenAIQuicksilverAppendText(text: string): string[];
/** Bound completed delegation output while preserving under-limit text byte-for-byte. */
declare function boundOpenAIQuicksilverDelegationResult(text: string): string;
//#endregion
export { boundOpenAIQuicksilverContextItems as a, buildOpenAIQuicksilverSessionUpdate as c, chunkOpenAIQuicksilverAppendText as d, createOpenAIQuicksilverCall as f, resolveOpenAIQuicksilverVoice as g, parseOpenAIQuicksilverEvent as h, OpenAIQuicksilverRequestIds as i, buildOpenAIQuicksilverWebSocketUrl as l, openAIQuicksilverAuthHeaders as m, OpenAIQuicksilverInboundEvent as n, boundOpenAIQuicksilverDelegationResult as o, hangupOpenAIRealtimeCall as p, OpenAIQuicksilverInitialItem as r, buildOpenAIQuicksilverSession as s, OpenAIQuicksilverAuth as t, buildOpenAIRealtimeSidebandUrl as u };