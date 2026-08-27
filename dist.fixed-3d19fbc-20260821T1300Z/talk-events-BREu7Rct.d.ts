//#region src/talk/talk-events.d.ts
/**
 * Canonical event names emitted by Talk sessions across realtime and STT/TTS flows.
 */
declare const TALK_EVENT_TYPES: readonly ["session.started", "session.ready", "session.closed", "session.error", "session.replaced", "turn.started", "turn.ended", "turn.cancelled", "capture.started", "capture.stopped", "capture.cancelled", "capture.once", "input.audio.delta", "input.audio.committed", "transcript.delta", "transcript.done", "output.text.delta", "output.text.done", "output.audio.started", "output.audio.delta", "output.audio.done", "tool.call", "tool.progress", "tool.result", "tool.error", "usage.metrics", "latency.metrics", "health.changed"];
/**
 * Talk event name accepted by the event sequencer.
 */
type TalkEventType = (typeof TALK_EVENT_TYPES)[number];
/**
 * High-level media mode used to group Talk session telemetry.
 */
type TalkMode = "realtime" | "stt-tts" | "transcription";
/**
 * Transport family carrying Talk audio and session control.
 */
type TalkTransport = "webrtc" | "provider-websocket" | "gateway-relay" | "managed-room";
/**
 * Brain mode that explains whether Talk output is agent-mediated, tool-only, or passive.
 */
type TalkBrain = "agent-consult" | "direct-tools" | "none";
/**
 * Session-level correlation fields copied onto every Talk event.
 */
type TalkEventContext = {
  sessionId: string;
  mode: TalkMode;
  transport: TalkTransport;
  brain: TalkBrain;
  provider?: string;
};
/**
 * Sequenced Talk event envelope delivered to observers and gateway clients.
 */
type TalkEvent<TPayload = unknown> = TalkEventContext & {
  id: string;
  type: TalkEventType;
  turnId?: string;
  captureId?: string;
  seq: number;
  timestamp: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
  payload: TPayload;
};
/**
 * Caller-supplied event payload before session context, id, sequence, and timestamp are attached.
 */
type TalkEventInput<TPayload = unknown> = {
  type: TalkEventType;
  payload: TPayload;
  turnId?: string;
  captureId?: string;
  timestamp?: string;
  final?: boolean;
  callId?: string;
  itemId?: string;
  parentId?: string;
};
//#endregion
export { TalkEventType as a, TalkEventInput as i, TalkEvent as n, TalkMode as o, TalkEventContext as r, TalkTransport as s, TalkBrain as t };