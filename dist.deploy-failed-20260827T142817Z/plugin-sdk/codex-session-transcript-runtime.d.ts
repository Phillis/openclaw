import { c as AgentMessage } from "../types-DKu1Bc4Q.js";
import { c as TranscriptEntryAnchor, l as TranscriptTurnAdmission } from "../types-B6SpuL0v.js";
import { f as TranscriptMessageAppendOptions, m as TranscriptUpdatePayload, p as TranscriptMessageAppendResult } from "../session-manager-B7xs4kTa.js";
import { i as SessionTranscriptMemoryHitKey, o as SessionTranscriptReadParams } from "../session-transcript-memory-hit-BfMVa8Yq.js";
import { l as SessionTranscriptTargetParams } from "../session-transcript-runtime-XV2Uq6lp.js";

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