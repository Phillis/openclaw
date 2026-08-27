import "./index-Bf1XfcnS.js";
import { l as TranscriptEntryAnchor } from "./types-BdTyUrVT.js";
import "./types.openclaw-BssW6c46.js";
import "./types-Kt4lh6nX.js";
import "./session-manager-Dxs2hJ-i.js";
//#region src/config/sessions/transcript.d.ts
type SessionTranscriptAppendTarget = {
  agentId?: string;
  sessionId: string;
  sessionKey: string;
  storePath: string;
};
type SessionTranscriptAppendResult = {
  ok: true;
  target: SessionTranscriptAppendTarget;
  messageId: string;
  anchor?: TranscriptEntryAnchor;
} | {
  ok: false;
  reason: string;
  code?: "blocked" | "session-rebound";
};
type SessionTranscriptUpdateMode = "inline" | "file-only" | "none";
type SessionTranscriptDeliveryMirror = {
  kind: "channel-final";
  sourceMessageId?: string;
} | {
  kind: "channel-final-suppressed";
  reason: "stale-foreground";
  sourceMessageId?: string;
};
type AssistantTranscriptText = {
  id?: string;
  text: string;
  timestamp?: number;
};
type LatestAssistantTranscriptText = AssistantTranscriptText;
//#endregion
export { SessionTranscriptUpdateMode as i, SessionTranscriptAppendResult as n, SessionTranscriptDeliveryMirror as r, LatestAssistantTranscriptText as t };