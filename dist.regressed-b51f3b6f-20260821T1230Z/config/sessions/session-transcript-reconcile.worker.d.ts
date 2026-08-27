import { DatabaseSync } from "node:sqlite";

//#region src/config/sessions/session-transcript-projection-rebuild.d.ts
type TranscriptIndexEntry = {
  messageId: string;
  role: "assistant" | "user";
  text: string;
  timestamp: number;
};
type PreparedSessionTranscriptProjectionMetadata = {
  activeEventCount: number;
  activeMessageCount: number;
  leafEventId: string | null;
  sessionId: string;
  sourceIndexedSeq: number;
  sourceTranscriptUpdatedAt: number | null;
};
type PreparedSessionTranscriptProjection = PreparedSessionTranscriptProjectionMetadata & {
  activeRows: Array<{
    activePosition: number;
    eventSeq: number;
    messagePosition: number | null;
  }>;
  ftsRows: TranscriptIndexEntry[];
};
//#endregion
//#region src/config/sessions/session-transcript-reconcile.worker.d.ts
type SessionTranscriptReconcileWorkerInput = {
  agentId: string;
  path: string;
  preferredSessionId?: string;
};
type EncodedTranscriptFtsChunk = {
  rows: Array<{
    messageId: string;
    role: "assistant" | "user";
    textByteLength: number;
    textByteOffset: number;
    timestamp: number;
  }>;
  textBytes: Uint8Array<ArrayBuffer>;
};
type SessionTranscriptReconcileWorkerMessage = {
  type: "active-chunk";
  rows: PreparedSessionTranscriptProjection["activeRows"];
  sessionId: string;
} | {
  type: "done";
} | {
  type: "failed";
  error: string;
} | {
  type: "fts-chunk";
  chunk: EncodedTranscriptFtsChunk;
  sessionId: string;
} | {
  type: "plan-finish";
  sessionId: string;
} | {
  type: "plan-start";
  plan: PreparedSessionTranscriptProjectionMetadata;
};
//#endregion
export { EncodedTranscriptFtsChunk, SessionTranscriptReconcileWorkerInput, SessionTranscriptReconcileWorkerMessage };