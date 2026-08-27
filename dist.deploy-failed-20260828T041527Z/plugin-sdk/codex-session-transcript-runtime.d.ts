import "../agent-core-BkRJ6FA8.js";
import { c as AgentMessage } from "../types-aADBdueZ.js";
import { l as TranscriptEntryAnchor, u as TranscriptTurnAdmission } from "../types-DpImvtmp.js";
import { f as TranscriptMessageAppendOptions, m as TranscriptUpdatePayload, p as TranscriptMessageAppendResult } from "../session-manager-9ZigNj1A.js";
import { i as SessionTranscriptMemoryHitKey, o as SessionTranscriptReadParams } from "../session-transcript-memory-hit-CvRrX8sW.js";
import { l as SessionTranscriptTargetParams } from "../session-transcript-runtime-DMFcjN1j.js";
//#region src/plugin-sdk/session-transcript-lock-runtime.d.ts
type InternalSessionTranscriptTarget = {
  agentId: string;
  memoryKey: SessionTranscriptMemoryHitKey;
  sessionId: string;
  sessionKey: string;
  targetKind: "runtime-session";
};
type InternalSessionTranscriptWriteLockParams = SessionTranscriptReadParams & {
  config?: TranscriptMessageAppendOptions<unknown>["config"];
};
type InternalSessionTranscriptWriteLockContext = {
  appendMessage: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
  publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
  readEvents: () => Promise<unknown[]>;
  target: InternalSessionTranscriptTarget;
};
//#endregion
//#region src/plugin-sdk/codex-session-transcript-runtime.d.ts
/** Reads the bundled Codex mirror strictly before one admitted user row. */
declare function readCodexSessionTranscriptEventsBeforeAdmission(params: SessionTranscriptTargetParams, admission: TranscriptTurnAdmission): Promise<unknown[]>;
type CodexSessionTranscriptMirrorWriteLockContext = InternalSessionTranscriptWriteLockContext & {
  appendMessageWithMessageSequence: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<{
    messageSeq?: number;
    result: TranscriptMessageAppendResult<TMessage> | undefined;
  }>;
  readMessageFacts: (params: {
    idempotencyKeys: readonly string[];
  }) => Promise<{
    anchorsByIdempotencyKey: Map<string, TranscriptEntryAnchor>;
    existingIdempotencyKeys: Set<string>;
    messagesByIdempotencyKey: Map<string, AgentMessage>;
  }>;
};
/** Runs the bundled Codex mirror under the transcript writer lock. */
declare function withCodexSessionTranscriptMirrorWriteLock<T>(params: InternalSessionTranscriptWriteLockParams, run: (context: CodexSessionTranscriptMirrorWriteLockContext) => Promise<T> | T): Promise<T>;
//#endregion
export { CodexSessionTranscriptMirrorWriteLockContext, readCodexSessionTranscriptEventsBeforeAdmission, withCodexSessionTranscriptMirrorWriteLock };