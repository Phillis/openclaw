import "../../session-accessor.sqlite-contract-UKYzFhoS.js";
//#region src/config/sessions/session-accessor.sqlite-delete-snapshot.types.d.ts
type SessionStateDeleteSnapshot = {
  acpParentStreamEventCount: number;
  generation: string | null;
  lastSeq: number | null;
  sessionKey: string | null;
  sessionUpdatedAt: number | null;
  trajectoryLastSeq: number | null;
  transcriptUpdatedAt: number | null;
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive.d.ts
type SessionStateDeletePlan = {
  agentId: string;
  archiveDirectory: string;
  archiveTranscript: boolean;
  databasePath: string;
  reason: "deleted" | "reset";
  sessionId: string;
  snapshot: SessionStateDeleteSnapshot;
};
type MaterializedSessionTranscriptArchive = {
  archiveName: string;
  bytes: Uint8Array;
  createdAt: number;
  encoding: "identity" | "zstd";
  sha256: string;
};
type TranscriptArchiveWorkerPlan = Pick<SessionStateDeletePlan, "agentId" | "archiveDirectory" | "databasePath" | "reason" | "sessionId" | "snapshot">;
type TranscriptArchiveWorkerResult = {
  archive: MaterializedSessionTranscriptArchive | null;
  sessionId: string;
};
type TranscriptArchivePublishPlan = {
  agentId: string;
  archiveDirectory: string;
  databasePath: string;
  generation: string;
  sessionId: string;
};
type TranscriptArchivePublishResult = {
  archivedPath?: string;
  error?: string;
  generation: string;
  sessionId: string;
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive.worker.d.ts
declare function materializeTranscriptArchiveInWorker(plan: TranscriptArchiveWorkerPlan): TranscriptArchiveWorkerResult;
declare function publishTranscriptArchiveInWorker(plan: TranscriptArchivePublishPlan): TranscriptArchivePublishResult;
//#endregion
export { materializeTranscriptArchiveInWorker, publishTranscriptArchiveInWorker };