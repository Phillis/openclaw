import { Static, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/logs-chat.d.ts
/** Cursor-based request for the gateway log tail endpoint. */
declare const LogsTailParamsSchema: Type.TObject<{
  cursor: Type.TOptional<Type.TInteger>;
  limit: Type.TOptional<Type.TInteger>;
  maxBytes: Type.TOptional<Type.TInteger>;
}>;
/** Gateway log tail payload returned to dashboard clients. */
declare const LogsTailResultSchema: Type.TObject<{
  file: Type.TString;
  cursor: Type.TInteger;
  size: Type.TInteger;
  lines: Type.TArray<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
  reset: Type.TOptional<Type.TBoolean>;
}>;
/** Session-scoped history request used by WebChat and native WebSocket clients. */
declare const ChatHistoryParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  cursor: Type.TOptional<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  messageId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/**
 * Bounded forward catch-up response. Clients replay `messages` as `session.message`
 * payloads. There is no continuation loop: more than 200 raw events or the byte
 * budget returns `reset`, and the client fetches a fresh tail page.
 */
declare const ChatHistoryDeltaResultSchema: Type.TObject<{
  kind: Type.TLiteral<"delta">;
  messages: Type.TArray<Type.TUnknown>;
  deltaCursor: Type.TString;
  sessionInfo: Type.TUnknown;
  agentsList: Type.TOptional<Type.TUnknown>;
  inFlightRun: Type.TOptional<Type.TUnknown>;
  metadata: Type.TOptional<Type.TUnknown>;
}>;
/** Normal cursor discontinuity; clients recover with a fresh tail request. */
declare const ChatHistoryResetResultSchema: Type.TObject<{
  kind: Type.TLiteral<"reset">;
}>;
/** Closed cursor outcome union. */
declare const ChatHistoryCursorResultSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"delta">;
  messages: Type.TArray<Type.TUnknown>;
  deltaCursor: Type.TString;
  sessionInfo: Type.TUnknown;
  agentsList: Type.TOptional<Type.TUnknown>;
  inFlightRun: Type.TOptional<Type.TUnknown>;
  metadata: Type.TOptional<Type.TUnknown>;
}>, Type.TObject<{
  kind: Type.TLiteral<"reset">;
}>]>;
/** Lightweight chat metadata request; optional agent scope keeps selector state explicit. */
declare const ChatMetadataParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
}>;
/** Batched purpose-title request for tool calls rendered in the Control UI. */
declare const ChatToolTitlesParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  items: Type.TArray<Type.TObject<{
    id: Type.TString;
    name: Type.TString;
    input: Type.TString;
  }>>;
}>;
/**
 * Titles keyed by the caller-provided item id; missing ids mean no title.
 * `disabled: true` tells clients the gateway has tool titles switched off so
 * they stop requesting for the rest of the session.
 */
declare const ChatToolTitlesResultSchema: Type.TObject<{
  titles: Type.TRecord<"^.*$", Type.TString>;
  disabled: Type.TOptional<Type.TBoolean>;
}>;
/** Typed result shape for tool-title consumers. */
type ChatToolTitlesResult = Static<typeof ChatToolTitlesResultSchema>;
/** Fetches one stored chat message without forcing history callers to request huge payloads. */
declare const ChatMessageGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  messageId: Type.TString;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Result envelope for single-message lookup, including the stable miss/visibility reason. */
declare const ChatMessageGetResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  message: Type.TOptional<Type.TUnknown>;
  unavailableReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"not_found">, Type.TLiteral<"oversized">, Type.TLiteral<"not_visible">]>>;
}>;
/** Typed result shape for callers that branch on message availability. */
type ChatMessageGetResult = Static<typeof ChatMessageGetResultSchema>;
/** Permissive attachment envelope shared by chat and session entrypoints. */
declare const ChatAttachmentSchema: Type.TObject<{
  type: Type.TOptional<Type.TString>;
  mimeType: Type.TOptional<Type.TString>;
  fileName: Type.TOptional<Type.TString>;
  content: Type.TOptional<Type.TUnknown>;
  sizeBytes: Type.TOptional<Type.TNumber>;
  durationMs: Type.TOptional<Type.TNumber>;
  width: Type.TOptional<Type.TNumber>;
  height: Type.TOptional<Type.TNumber>;
}>;
/** Attachment list shared by chat.send and session creation's initial turn. */
declare const ChatAttachmentsSchema: Type.TArray<Type.TObject<{
  type: Type.TOptional<Type.TString>;
  mimeType: Type.TOptional<Type.TString>;
  fileName: Type.TOptional<Type.TString>;
  content: Type.TOptional<Type.TUnknown>;
  sizeBytes: Type.TOptional<Type.TNumber>;
  durationMs: Type.TOptional<Type.TNumber>;
  width: Type.TOptional<Type.TNumber>;
  height: Type.TOptional<Type.TNumber>;
}>>;
declare const QUEUE_MODES: readonly ["steer", "followup", "collect", "interrupt"];
type QueueMode = (typeof QUEUE_MODES)[number];
/** User-to-agent send request; idempotency key lets clients safely retry transport failures. */
declare const ChatSendParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">]>>;
  fastAutoOnSeconds: Type.TOptional<Type.TInteger>;
  queueMode: Type.TOptional<Type.TString>;
  deliver: Type.TOptional<Type.TBoolean>;
  originatingChannel: Type.TOptional<Type.TString>;
  originatingTo: Type.TOptional<Type.TString>;
  originatingAccountId: Type.TOptional<Type.TString>;
  originatingThreadId: Type.TOptional<Type.TString>;
  replyToId: Type.TOptional<Type.TString>;
  attachments: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TOptional<Type.TString>;
    mimeType: Type.TOptional<Type.TString>;
    fileName: Type.TOptional<Type.TString>;
    content: Type.TOptional<Type.TUnknown>;
    sizeBytes: Type.TOptional<Type.TNumber>;
    durationMs: Type.TOptional<Type.TNumber>;
    width: Type.TOptional<Type.TNumber>;
    height: Type.TOptional<Type.TNumber>;
  }>>>;
  toolBindings: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  timeoutMs: Type.TOptional<Type.TInteger>;
  systemInputProvenance: Type.TOptional<Type.TObject<{
    kind: Type.TString;
    originSessionId: Type.TOptional<Type.TString>;
    sourceSessionKey: Type.TOptional<Type.TString>;
    sourceChannel: Type.TOptional<Type.TString>;
    sourceTool: Type.TOptional<Type.TString>;
  }>>;
  systemProvenanceReceipt: Type.TOptional<Type.TString>;
  suppressCommandInterpretation: Type.TOptional<Type.TBoolean>;
  expectedLeafEntryId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  expectedSessionRoutingContract: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
}>;
/** Cancels the active or named run for a chat session. */
declare const ChatAbortParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  preserveSideRuns: Type.TOptional<Type.TBoolean>;
}>;
/** Inserts an operator-visible synthetic message into an existing chat transcript. */
declare const ChatInjectParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  label: Type.TOptional<Type.TString>;
}>;
/** Coarse startup stages shown while a run has not produced visible activity yet. */
declare const ChatRunStartupPhaseSchema: Type.TUnion<[Type.TLiteral<"preparing_workspace">, Type.TLiteral<"provisioning_environment">, Type.TLiteral<"preparing_context">, Type.TLiteral<"starting_model">]>;
/** Non-terminal run status emitted before assistant or tool activity becomes visible. */
declare const ChatStatusEventSchema: Type.TObject<{
  state: Type.TLiteral<"status">;
  phase: Type.TUnion<[Type.TLiteral<"preparing_workspace">, Type.TLiteral<"provisioning_environment">, Type.TLiteral<"preparing_context">, Type.TLiteral<"starting_model">]>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>;
/** Incremental assistant output event; `replace` marks full-content refresh deltas. */
declare const ChatDeltaEventSchema: Type.TObject<{
  state: Type.TLiteral<"delta">;
  message: Type.TOptional<Type.TUnknown>;
  deltaText: Type.TString;
  replace: Type.TOptional<Type.TBoolean>;
  usage: Type.TOptional<Type.TUnknown>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>;
/** Successful terminal event for a completed chat run. */
declare const ChatFinalEventSchema: Type.TObject<{
  state: Type.TLiteral<"final">;
  message: Type.TOptional<Type.TUnknown>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  yielded: Type.TOptional<Type.TLiteral<true>>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>;
/** Terminal event for user-initiated or coordinator-initiated cancellation. */
declare const ChatAbortedEventSchema: Type.TObject<{
  state: Type.TLiteral<"aborted">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>;
/** Terminal event for failed chat runs with an optional normalized failure kind. */
declare const ChatErrorEventSchema: Type.TObject<{
  state: Type.TLiteral<"error">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>;
/** Public chat stream event union consumed by gateway protocol validators. */
declare const ChatEventSchema: Type.TUnion<[Type.TObject<{
  state: Type.TLiteral<"status">;
  phase: Type.TUnion<[Type.TLiteral<"preparing_workspace">, Type.TLiteral<"provisioning_environment">, Type.TLiteral<"preparing_context">, Type.TLiteral<"starting_model">]>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"delta">;
  message: Type.TOptional<Type.TUnknown>;
  deltaText: Type.TString;
  replace: Type.TOptional<Type.TBoolean>;
  usage: Type.TOptional<Type.TUnknown>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"final">;
  message: Type.TOptional<Type.TUnknown>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  yielded: Type.TOptional<Type.TLiteral<true>>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"aborted">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>, Type.TObject<{
  state: Type.TLiteral<"error">;
  message: Type.TOptional<Type.TUnknown>;
  errorMessage: Type.TOptional<Type.TString>;
  errorKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"refusal">, Type.TLiteral<"timeout">, Type.TLiteral<"rate_limit">, Type.TLiteral<"context_length">, Type.TLiteral<"unknown">]>>;
  usage: Type.TOptional<Type.TUnknown>;
  stopReason: Type.TOptional<Type.TString>;
  runId: Type.TString;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  seq: Type.TInteger;
}>]>;
type ChatHistoryParams = Static<typeof ChatHistoryParamsSchema>;
type ChatHistoryDeltaResult = Static<typeof ChatHistoryDeltaResultSchema>;
type ChatHistoryResetResult = Static<typeof ChatHistoryResetResultSchema>;
type ChatHistoryCursorResult = Static<typeof ChatHistoryCursorResultSchema>;
type ChatMetadataParams = Static<typeof ChatMetadataParamsSchema>;
type ChatToolTitlesParams = Static<typeof ChatToolTitlesParamsSchema>;
type LogsTailParams = Static<typeof LogsTailParamsSchema>;
type LogsTailResult = Static<typeof LogsTailResultSchema>;
type ChatAbortParams = Static<typeof ChatAbortParamsSchema>;
type ChatInjectParams = Static<typeof ChatInjectParamsSchema>;
type ChatRunStartupPhase = Static<typeof ChatRunStartupPhaseSchema>;
type ChatStatusEvent = Static<typeof ChatStatusEventSchema>;
type ChatEvent = Static<typeof ChatEventSchema>;
//#endregion
export { ChatStatusEventSchema as A, ChatMessageGetResultSchema as C, ChatRunStartupPhaseSchema as D, ChatRunStartupPhase as E, LogsTailParams as F, LogsTailParamsSchema as I, LogsTailResult as L, ChatToolTitlesParamsSchema as M, ChatToolTitlesResult as N, ChatSendParamsSchema as O, ChatToolTitlesResultSchema as P, LogsTailResultSchema as R, ChatMessageGetResult as S, ChatMetadataParamsSchema as T, ChatHistoryResetResult as _, ChatAttachmentsSchema as a, ChatInjectParamsSchema as b, ChatEvent as c, ChatHistoryCursorResult as d, ChatHistoryCursorResultSchema as f, ChatHistoryParamsSchema as g, ChatHistoryParams as h, ChatAttachmentSchema as i, ChatToolTitlesParams as j, ChatStatusEvent as k, ChatEventSchema as l, ChatHistoryDeltaResultSchema as m, ChatAbortParamsSchema as n, ChatDeltaEventSchema as o, ChatHistoryDeltaResult as p, ChatAbortedEventSchema as r, ChatErrorEventSchema as s, ChatAbortParams as t, ChatFinalEventSchema as u, ChatHistoryResetResultSchema as v, ChatMetadataParams as w, ChatMessageGetParamsSchema as x, ChatInjectParams as y, QueueMode as z };