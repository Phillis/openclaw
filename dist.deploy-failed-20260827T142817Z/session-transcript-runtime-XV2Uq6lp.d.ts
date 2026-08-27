import { c as AgentMessage } from "./types-DKu1Bc4Q.js";
import { n as OpenClawConfig } from "./types.openclaw-CNftZ6Ix.js";
import { d as SessionTranscriptVisibleMessageDeltaLimits, f as TranscriptMessageAppendOptions, l as SessionTranscriptRawDeltaLimits, m as TranscriptUpdatePayload, p as TranscriptMessageAppendResult, u as SessionTranscriptRawDeltaResult } from "./session-manager-B7xs4kTa.js";
import { i as SessionTranscriptUpdateMode, n as SessionTranscriptAppendResult, r as SessionTranscriptDeliveryMirror, t as LatestAssistantTranscriptText } from "./transcript-i1CJVrot.js";
import { n as SessionTranscriptIdentity, o as SessionTranscriptReadParams } from "./session-transcript-memory-hit-BfMVa8Yq.js";

//#region src/plugin-sdk/session-transcript-runtime.d.ts
type SessionTranscriptEvent = unknown;
type SessionTranscriptTargetParams = SessionTranscriptReadParams;
/** Scoped target and bounds for one raw generation-aware transcript page. */
type SessionTranscriptRawDeltaParams = SessionTranscriptTargetParams & SessionTranscriptRawDeltaLimits;
/** Scoped target and bounds for one active-path visible-message page. */
type SessionTranscriptVisibleMessageDeltaParams = SessionTranscriptTargetParams & SessionTranscriptVisibleMessageDeltaLimits;
/** Generation-aware outcome for one bounded visible-message read. */
type SessionTranscriptVisibleMessageDeltaResult = {
  kind: "page"; /** Opaque cursor positioned after the last returned visible message. */
  cursor: string; /** Ordered active-path message entries selected for this page. */
  entries: SessionTranscriptMessageEntry[]; /** True when another visible message remains after this page. */
  hasMore: boolean; /** First unread event size when it cannot fit under maxBytes. */
  requiredBytes?: number; /** Stored JSONL bytes represented by entries. */
  serializedBytes: number;
} | {
  kind: "reset"; /** Fresh opaque bootstrap cursor for the current visible generation. */
  cursor: string; /** Stable discontinuity that invalidated the supplied cursor. */
  reason: "anchor_missing" | "anchor_moved" | "generation_mismatch" | "invalid_cursor" | "scope_mismatch";
} | {
  kind: "unavailable";
  reason: "projection_rebuilding";
} | {
  kind: "missing";
};
type SessionTranscriptMessageEntry = {
  /** Stable transcript event id for this message entry. */entryId: string; /** Parent id after active-branch normalization; null when this is a visible root. */
  parentId: string | null; /** Ordered read metadata for this full transcript read, not a resumable cursor. */
  seq: number; /** Redacted agent message payload as persisted by the runtime. */
  message: AgentMessage; /** Convenience mirror of message.role. */
  role: AgentMessage["role"]; /** Entry timestamp recorded by the transcript store, when present. */
  createdAt?: string; /** Message idempotency key, when the persisted message has one. */
  idempotencyKey?: string;
};
type SessionTranscriptTarget = SessionTranscriptIdentity & {
  targetKind: "runtime-session";
};
type SessionTranscriptAppendMessageParams<TMessage> = SessionTranscriptTargetParams & TranscriptMessageAppendOptions<TMessage>;
type SessionTranscriptAppendMessagesParams<TMessage> = SessionTranscriptTargetParams & {
  config?: TranscriptMessageAppendOptions<TMessage>["config"];
  cwd?: string;
  messages: readonly Omit<TranscriptMessageAppendOptions<TMessage>, "config" | "cwd" | "parentId" | "prepareMessageAfterIdempotencyCheck" | "useRawWhenLinear">[];
};
type SessionTranscriptStrictMessageAppendResult<TMessage> = {
  kind: "result";
  result: TranscriptMessageAppendResult<TMessage>;
} | {
  kind: "suppressed";
} | {
  kind: "rejected";
  reason: "session-rebound";
};
type SessionTranscriptAssistantMirrorAppendParams = SessionTranscriptReadParams & {
  config?: OpenClawConfig;
  deliveryMirror?: SessionTranscriptDeliveryMirror;
  idempotencyKey?: string;
  mediaUrls?: string[];
  text?: string;
  updateMode?: SessionTranscriptUpdateMode;
};
type SessionTranscriptWriteLockParams = SessionTranscriptTargetParams & {
  config?: TranscriptMessageAppendOptions<unknown>["config"];
};
type SessionTranscriptWriteLockContext = {
  appendMessage: <TMessage>(options: Omit<TranscriptMessageAppendOptions<TMessage>, "config">) => Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
  publishUpdate: (update?: TranscriptUpdatePayload) => Promise<void>;
  readEvents: () => Promise<SessionTranscriptEvent[]>;
  target: SessionTranscriptTarget;
};
type SessionTranscriptMirrorAppendResult = {
  ok: true;
  messageId: string;
} | Extract<SessionTranscriptAppendResult, {
  ok: false;
}>;
/**
 * Resolves the public identity for a transcript without returning its file path.
 */
declare function resolveSessionTranscriptIdentity(params: SessionTranscriptReadParams): Promise<SessionTranscriptIdentity>;
/**
 * Resolves the public target for transcript operations without exposing the
 * current storage path as identity.
 */
declare function resolveSessionTranscriptTarget(params: SessionTranscriptTargetParams): Promise<SessionTranscriptTarget>;
/**
 * Reads transcript events by public session identity instead of file path.
 */
declare function readSessionTranscriptEvents(params: SessionTranscriptTargetParams): Promise<SessionTranscriptEvent[]>;
/** Reads one bounded raw page; the opaque cursor survives append and resets after replacement. */
declare function readSessionTranscriptRawDelta(params: SessionTranscriptRawDeltaParams): Promise<SessionTranscriptRawDeltaResult>;
/** Reads one bounded active-path page that resumes appends and resets after discontinuities. */
declare function readSessionTranscriptVisibleMessageDelta(params: SessionTranscriptVisibleMessageDeltaParams): Promise<SessionTranscriptVisibleMessageDeltaResult>;
/**
 * Reads visible transcript message entries by scoped identity.
 *
 * This is a branch-safe message projection over the current full transcript
 * read. `seq` is ordered read metadata, not a resumable cursor.
 */
declare function readVisibleSessionTranscriptMessageEntries(params: SessionTranscriptTargetParams): Promise<SessionTranscriptMessageEntry[]>;
/**
 * Reads the latest visible assistant text by scoped identity.
 */
declare function readLatestAssistantTextByIdentity(params: SessionTranscriptTargetParams): Promise<LatestAssistantTranscriptText | undefined>;
/**
 * Appends a delivery-mirror assistant message through the SQLite transcript accessor.
 */
declare function appendAssistantMirrorMessageByIdentity(params: SessionTranscriptAssistantMirrorAppendParams): Promise<SessionTranscriptMirrorAppendResult>;
/**
 * Appends an already-canonical transcript message by scoped transcript target.
 * Media-bearing user turns use ordered `message.__openclaw.media` facts; this
 * low-level API does not infer deprecated top-level Media* projections.
 */
declare function appendSessionTranscriptMessageByIdentity<TMessage>(params: SessionTranscriptAppendMessageParams<TMessage>): Promise<TranscriptMessageAppendResult<TMessage> | undefined>;
/** Appends one message while preserving distinct suppression and session-rebind outcomes. */
declare function appendSessionTranscriptMessageByIdentityStrict<TMessage>(params: SessionTranscriptAppendMessageParams<TMessage>): Promise<SessionTranscriptStrictMessageAppendResult<TMessage>>;
/**
 * Atomically appends one ordered, already-hooked message group. Preparation and
 * redaction finish before SQLite begins; this is the canonical future harness seam.
 */
declare function appendSessionTranscriptMessagesByIdentity<TMessage>(params: SessionTranscriptAppendMessagesParams<TMessage>): Promise<TranscriptMessageAppendResult<TMessage>[]>;
/**
 * Publishes a transcript update by scoped transcript target.
 */
declare function publishSessionTranscriptUpdateByIdentity(params: SessionTranscriptTargetParams & {
  update?: TranscriptUpdatePayload;
}): Promise<void>;
/**
 * Runs transcript work under the write lock for the resolved scoped target.
 */
declare function withSessionTranscriptWriteLock<T>(params: SessionTranscriptWriteLockParams, run: (context: SessionTranscriptWriteLockContext) => Promise<T> | T): Promise<T>;
//#endregion
export { readVisibleSessionTranscriptMessageEntries as C, withSessionTranscriptWriteLock as E, readSessionTranscriptVisibleMessageDelta as S, resolveSessionTranscriptTarget as T, appendSessionTranscriptMessagesByIdentity as _, SessionTranscriptMessageEntry as a, readSessionTranscriptEvents as b, SessionTranscriptTarget as c, SessionTranscriptVisibleMessageDeltaResult as d, SessionTranscriptWriteLockContext as f, appendSessionTranscriptMessageByIdentityStrict as g, appendSessionTranscriptMessageByIdentity as h, SessionTranscriptEvent as i, SessionTranscriptTargetParams as l, appendAssistantMirrorMessageByIdentity as m, SessionTranscriptAppendMessagesParams as n, SessionTranscriptRawDeltaParams as o, SessionTranscriptWriteLockParams as p, SessionTranscriptAssistantMirrorAppendParams as r, SessionTranscriptStrictMessageAppendResult as s, SessionTranscriptAppendMessageParams as t, SessionTranscriptVisibleMessageDeltaParams as u, publishSessionTranscriptUpdateByIdentity as v, resolveSessionTranscriptIdentity as w, readSessionTranscriptRawDelta as x, readLatestAssistantTextByIdentity as y };