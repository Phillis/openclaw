//#region src/config/sessions/session-accessor.sqlite-archive.d.ts
type SessionStateDeleteSnapshot = {
  acpParentStreamEventCount: number;
  generation: string | null;
  lastSeq: number | null;
  sessionUpdatedAt: number | null;
  trajectoryLastSeq: number | null;
  transcriptUpdatedAt: number | null;
};
type SessionStateDeletePlan = {
  agentId: string;
  archiveDirectory: string;
  archiveTranscript: boolean;
  databasePath: string;
  reason: "deleted" | "reset";
  sessionId: string;
  snapshot: SessionStateDeleteSnapshot;
};
type TranscriptArchiveWorkerPlan = Pick<SessionStateDeletePlan, "agentId" | "archiveDirectory" | "databasePath" | "reason" | "sessionId" | "snapshot">;
type TranscriptArchiveWorkerResult = {
  archivedPath: string | null;
  sessionId: string;
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive.worker.d.ts
declare function materializeTranscriptArchiveInWorker(plan: TranscriptArchiveWorkerPlan): TranscriptArchiveWorkerResult;
//#endregion
export { materializeTranscriptArchiveInWorker };