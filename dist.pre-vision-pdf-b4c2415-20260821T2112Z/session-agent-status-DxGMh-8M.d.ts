import { Static, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/sessions-row.d.ts
declare const SessionToolOverridesSchema: Type.TObject<{
  mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
  skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  webSearch: Type.TOptional<Type.TBoolean>;
}>;
/** Projected actor that caused a session node to be created. */
declare const SessionCreatedActorSchema: Type.TObject<{
  type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
  id: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>; /** Durable profile avatar route; absent for actors without a stored profile avatar. */
  avatarUrl: Type.TOptional<Type.TString>;
}>;
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
declare const SessionRowSchema: Type.TObject<{
  key: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TLiteral<true>>;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"global">, Type.TLiteral<"unknown">]>;
  label: Type.TOptional<Type.TString>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  displayName: Type.TOptional<Type.TString>;
  derivedTitle: Type.TOptional<Type.TString>;
  lastMessagePreview: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>; /** Stable non-sensitive facts derived from the canonical session route. */
  classification: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  accountId: Type.TOptional<Type.TString>;
  peerKind: Type.TOptional<Type.TString>;
  isMain: Type.TOptional<Type.TBoolean>;
  isBackground: Type.TOptional<Type.TBoolean>;
  chatType: Type.TOptional<Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"channel">]>>;
  updatedAt: Type.TOptional<Type.TUnion<[Type.TNumber, Type.TNull]>>;
  archived: Type.TOptional<Type.TBoolean>;
  archivedAt: Type.TOptional<Type.TNumber>;
  archivedBy: Type.TOptional<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>; /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  pinned: Type.TOptional<Type.TBoolean>;
  pinnedAt: Type.TOptional<Type.TNumber>;
  unread: Type.TOptional<Type.TBoolean>;
  lastReadAt: Type.TOptional<Type.TNumber>;
  lastActivityAt: Type.TOptional<Type.TNumber>;
  lastInteractionAt: Type.TOptional<Type.TNumber>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  restartRecoveryStatus: Type.TOptional<Type.TLiteral<"tombstoned">>;
  activeLeafEntryId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  spawnedBy: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  controlOwnerSessionKey: Type.TOptional<Type.TString>;
  childSessions: Type.TOptional<Type.TArray<Type.TString>>;
  forkedFromParent: Type.TOptional<Type.TBoolean>;
  spawnDepth: Type.TOptional<Type.TNumber>;
  subagentRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"orchestrator">, Type.TLiteral<"leaf">]>>;
  subagentControlScope: Type.TOptional<Type.TUnion<[Type.TLiteral<"children">, Type.TLiteral<"none">]>>;
  swarmGroupId: Type.TOptional<Type.TString>;
  worktree: Type.TOptional<Type.TObject<{
    id: Type.TString;
    branch: Type.TString;
    repoRoot: Type.TString;
  }>>;
  execNode: Type.TOptional<Type.TString>;
  execCwd: Type.TOptional<Type.TString>;
  spawnedWorkspaceDir: Type.TOptional<Type.TString>;
  spawnedCwd: Type.TOptional<Type.TString>;
  createdVia: Type.TOptional<Type.TUnion<[Type.TLiteral<"operator">, Type.TLiteral<"spawn">, Type.TLiteral<"channel">, Type.TLiteral<"cron">, Type.TLiteral<"talk">, Type.TLiteral<"run">, Type.TLiteral<"plugin">, Type.TLiteral<"internal">]>>;
  createdActor: Type.TOptional<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>; /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  visibility: Type.TOptional<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>;
  sharingRole: Type.TOptional<Type.TUnion<[Type.TLiteral<"admin">, Type.TLiteral<"owner">, Type.TLiteral<"member">, Type.TLiteral<"viewer">]>>;
  createdAt: Type.TOptional<Type.TNumber>;
  forkSource: Type.TOptional<Type.TObject<{
    sessionKey: Type.TString;
    sessionId: Type.TString;
    entryId: Type.TOptional<Type.TString>;
  }>>;
  previousSessionId: Type.TOptional<Type.TString>;
  inputTokens: Type.TOptional<Type.TNumber>;
  outputTokens: Type.TOptional<Type.TNumber>;
  totalTokens: Type.TOptional<Type.TNumber>;
  totalTokensFresh: Type.TOptional<Type.TBoolean>;
  contextTokens: Type.TOptional<Type.TNumber>;
  estimatedCostUsd: Type.TOptional<Type.TNumber>;
  model: Type.TOptional<Type.TString>;
  modelProvider: Type.TOptional<Type.TString>;
  toolOverrides: Type.TOptional<Type.TObject<{
    mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
    skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    webSearch: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
type SessionCreatedActor = Static<typeof SessionCreatedActorSchema>;
type SessionToolOverrides = Static<typeof SessionToolOverridesSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionRunStatus = NonNullable<SessionRow["status"]>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-create.d.ts
/** Creates or adopts a session with optional model, thinking, label, and parent linkage. */
declare const SessionsCreateParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>;
  model: Type.TOptional<Type.TString>;
  thinkingLevel: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TBoolean>;
  visibility: Type.TOptional<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>;
  catalogId: Type.TOptional<Type.TString>;
  parentSessionKey: Type.TOptional<Type.TString>;
  spawnDepth: Type.TOptional<Type.TInteger>;
  fork: Type.TOptional<Type.TBoolean>;
  forkFrom: Type.TOptional<Type.TLiteral<"last-completed">>;
  emitCommandHooks: Type.TOptional<Type.TBoolean>;
  succeedsParent: Type.TOptional<Type.TBoolean>;
  task: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
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
  projectId: Type.TOptional<Type.TString>;
  worktree: Type.TOptional<Type.TBoolean>;
  worktreeBaseRef: Type.TOptional<Type.TString>;
  worktreeName: Type.TOptional<Type.TString>;
  execNode: Type.TOptional<Type.TString>;
  cwd: Type.TOptional<Type.TString>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-recover.d.ts
/** Recovers one restart-tombstoned session into a fresh same-agent session. */
declare const SessionsRecoverParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const SessionsRecoverResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TString;
  continuation: Type.TUnion<[Type.TObject<{
    status: Type.TLiteral<"started">;
    runId: Type.TString;
  }>, Type.TObject<{
    status: Type.TLiteral<"rejected">;
    error: Type.TObject<{
      code: Type.TString;
      message: Type.TString;
      details: Type.TOptional<Type.TUnknown>;
      retryable: Type.TOptional<Type.TBoolean>;
      retryAfterMs: Type.TOptional<Type.TInteger>;
    }>;
  }>]>;
}>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-resolve.d.ts
/** Resolves a session by key, raw session id, label, short URL id, or parent/agent scope. */
declare const SessionsResolveParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  sessionId: Type.TOptional<Type.TString>;
  label: Type.TOptional<Type.TString>; /** Bare 8-32 character hexadecimal prefix of a session key's trailing UUID. */
  shortId: Type.TOptional<Type.TString>; /** Optional display-name slug used only to narrow ambiguous shortId matches. */
  slugHint: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>; /** Return a successful `{ ok: false }` response when the selector does not match a session. */
  allowMissing: Type.TOptional<Type.TBoolean>;
}>;
type SessionsResolveParams = Static<typeof SessionsResolveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-patch.d.ts
declare const SESSIONS_PATCH_MANY_MAX_TARGETS = 100;
/** Mutable per-session preferences and routing metadata. */
declare const SessionsPatchParamsSchema: Type.TObject<{
  label: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>; /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  statusNote: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  attention: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ttlMinutes: Type.TOptional<Type.TInteger>;
  archived: Type.TOptional<Type.TBoolean>;
  pinned: Type.TOptional<Type.TBoolean>;
  unread: Type.TOptional<Type.TBoolean>;
  thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
  toolOverrides: Type.TOptional<Type.TUnion<[Type.TObject<{
    mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
    skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    webSearch: Type.TOptional<Type.TBoolean>;
  }>, Type.TNull]>>;
  verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  responseUsage: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"tokens">, Type.TLiteral<"full">, Type.TLiteral<"on">, Type.TNull]>>;
  elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  completionOwnerSessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  inheritedToolPolicyVersion: Type.TOptional<Type.TUnion<[Type.TLiteral<1>, Type.TNull]>>;
  inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  sendPolicy: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>>;
  groupActivation: Type.TOptional<Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>>;
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>; /** Reject the mutation if the session was reset or replaced before it commits. */
  expectedSessionId: Type.TOptional<Type.TString>;
  expectedLifecycleRevision: Type.TOptional<Type.TString>;
}>;
declare const SessionsPatchMutationSchema: Type.TObject<{
  label: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>; /** User-defined organization bucket ("category", not chat-group); null clears it. */
  category: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  statusNote: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  attention: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  ttlMinutes: Type.TOptional<Type.TInteger>;
  archived: Type.TOptional<Type.TBoolean>;
  pinned: Type.TOptional<Type.TBoolean>;
  unread: Type.TOptional<Type.TBoolean>;
  thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
  toolOverrides: Type.TOptional<Type.TUnion<[Type.TObject<{
    mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
    skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    webSearch: Type.TOptional<Type.TBoolean>;
  }>, Type.TNull]>>;
  verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  responseUsage: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"tokens">, Type.TLiteral<"full">, Type.TLiteral<"on">, Type.TNull]>>;
  elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  completionOwnerSessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  inheritedToolPolicyVersion: Type.TOptional<Type.TUnion<[Type.TLiteral<1>, Type.TNull]>>;
  inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
  sendPolicy: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>>;
  groupActivation: Type.TOptional<Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>>;
}>;
declare const SessionsPatchManyTargetSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  expectedSessionId: Type.TOptional<Type.TString>;
  expectedLifecycleRevision: Type.TOptional<Type.TString>;
}>;
declare const SessionsPatchManyParamsSchema: Type.TObject<{
  targets: Type.TArray<Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    expectedSessionId: Type.TOptional<Type.TString>;
    expectedLifecycleRevision: Type.TOptional<Type.TString>;
  }>>;
  patch: Type.TObject<{
    label: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>; /** User-defined organization bucket ("category", not chat-group); null clears it. */
    category: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
    statusNote: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    attention: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    ttlMinutes: Type.TOptional<Type.TInteger>;
    archived: Type.TOptional<Type.TBoolean>;
    pinned: Type.TOptional<Type.TBoolean>;
    unread: Type.TOptional<Type.TBoolean>;
    thinkingLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    fastMode: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"auto">, Type.TNull]>>;
    toolOverrides: Type.TOptional<Type.TUnion<[Type.TObject<{
      mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
      mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
      skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
      webSearch: Type.TOptional<Type.TBoolean>;
    }>, Type.TNull]>>;
    verboseLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    traceLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    reasoningLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    responseUsage: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"tokens">, Type.TLiteral<"full">, Type.TLiteral<"on">, Type.TNull]>>;
    elevatedLevel: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execHost: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execSecurity: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execAsk: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    execNode: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    model: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    completionOwnerSessionKey: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    inheritedToolPolicyVersion: Type.TOptional<Type.TUnion<[Type.TLiteral<1>, Type.TNull]>>;
    inheritedToolAllow: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    inheritedToolDeny: Type.TOptional<Type.TUnion<[Type.TArray<Type.TString>, Type.TNull]>>;
    sendPolicy: Type.TOptional<Type.TUnion<[Type.TLiteral<"allow">, Type.TLiteral<"deny">, Type.TNull]>>;
    groupActivation: Type.TOptional<Type.TUnion<[Type.TLiteral<"mention">, Type.TLiteral<"always">, Type.TNull]>>;
  }>;
}>;
declare const SessionsPatchManyResultSchema: Type.TObject<{
  outcomes: Type.TArray<Type.TUnion<[Type.TObject<{
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    ok: Type.TLiteral<true>;
  }>, Type.TObject<{
    error: Type.TObject<{
      code: Type.TString;
      message: Type.TString;
      details: Type.TOptional<Type.TUnknown>;
      retryable: Type.TOptional<Type.TBoolean>;
      retryAfterMs: Type.TOptional<Type.TInteger>;
    }>;
    key: Type.TString;
    agentId: Type.TOptional<Type.TString>;
    ok: Type.TLiteral<false>;
  }>]>>;
}>;
type SessionsPatchParams = Static<typeof SessionsPatchParamsSchema>;
type SessionsPatchMutation = Static<typeof SessionsPatchMutationSchema>;
type SessionsPatchManyTarget = Static<typeof SessionsPatchManyTargetSchema>;
type SessionsPatchManyParams = Static<typeof SessionsPatchManyParamsSchema>;
type SessionsPatchManyResult = Static<typeof SessionsPatchManyResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
declare const SESSION_OBSERVER_HEALTH_VALUES: readonly ["on-track", "grinding", "stuck", "waiting-on-user", "wrapping-up", "done", "failed"];
/** Trajectory judgment produced for one observed agent session. */
declare const SessionObserverHealthSchema: Type.TUnion<[Type.TLiteral<"on-track">, Type.TLiteral<"grinding">, Type.TLiteral<"stuck">, Type.TLiteral<"waiting-on-user">, Type.TLiteral<"wrapping-up">, Type.TLiteral<"done">, Type.TLiteral<"failed">]>;
/** Completed and total step counts from the session's current plan. */
declare const SessionObserverPlanProgressSchema: Type.TObject<{
  completed: Type.TInteger;
  total: Type.TInteger;
}>;
/** Live session status judgment broadcast to subscribed operator clients. */
declare const SessionObserverDigestSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  revision: Type.TInteger;
  updatedAt: Type.TInteger;
  headline: Type.TString;
  assessment: Type.TOptional<Type.TString>;
  health: Type.TUnion<[Type.TLiteral<"on-track">, Type.TLiteral<"grinding">, Type.TLiteral<"stuck">, Type.TLiteral<"waiting-on-user">, Type.TLiteral<"wrapping-up">, Type.TLiteral<"done">, Type.TLiteral<"failed">]>;
  planProgress: Type.TOptional<Type.TObject<{
    completed: Type.TInteger;
    total: Type.TInteger;
  }>>;
}>;
/** Declares whether this connection currently renders session observer output. */
declare const SessionsObserverVisibilityParamsSchema: Type.TObject<{
  visible: Type.TBoolean;
}>;
/** Acknowledges a connection's observer visibility declaration. */
declare const SessionsObserverVisibilityResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
/** One bounded question/answer exchange in the ephemeral session companion. */
declare const SessionCompanionExchangeSchema: Type.TObject<{
  question: Type.TString;
  answer: Type.TString;
  ts: Type.TInteger;
}>;
/** Asks the read-only companion about one session and its workspace. */
declare const SessionsCompanionAskParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  question: Type.TString;
}>;
/** Companion answer returned only to the requesting operator. */
declare const SessionsCompanionAskResultSchema: Type.TObject<{
  answer: Type.TString;
  ts: Type.TInteger;
}>;
/** Selects the in-memory companion thread for one session. */
declare const SessionsCompanionStateParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Current bounded exchanges for one session companion thread. */
declare const SessionsCompanionStateResultSchema: Type.TObject<{
  exchanges: Type.TArray<Type.TObject<{
    question: Type.TString;
    answer: Type.TString;
    ts: Type.TInteger;
  }>>;
}>;
/** Selects the in-memory companion thread to clear. */
declare const SessionsCompanionResetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Acknowledges clearing one companion thread. */
declare const SessionsCompanionResetResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
}>;
/** Start/end event emitted while a session compaction operation runs. */
declare const SessionOperationEventSchema: Type.TObject<{
  operationId: Type.TString;
  operation: Type.TLiteral<"compact">;
  phase: Type.TUnion<[Type.TLiteral<"start">, Type.TLiteral<"end">]>;
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  ts: Type.TInteger;
  completed: Type.TOptional<Type.TBoolean>;
  reason: Type.TOptional<Type.TString>;
}>;
/** Stored compaction checkpoint metadata for branching or restoring a session. */
declare const SessionCompactionCheckpointSchema: Type.TObject<{
  checkpointId: Type.TString;
  sessionKey: Type.TString;
  sessionId: Type.TString;
  createdAt: Type.TInteger;
  reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
  tokensBefore: Type.TOptional<Type.TInteger>;
  tokensAfter: Type.TOptional<Type.TInteger>;
  tokensVersion: Type.TOptional<Type.TLiteral<1>>;
  summary: Type.TOptional<Type.TString>;
  firstKeptEntryId: Type.TOptional<Type.TString>;
  preCompaction: Type.TObject<{
    sessionId: Type.TString;
    sessionFile: Type.TOptional<Type.TString>;
    leafId: Type.TOptional<Type.TString>;
    entryId: Type.TOptional<Type.TString>;
  }>;
  postCompaction: Type.TObject<{
    sessionId: Type.TString;
    sessionFile: Type.TOptional<Type.TString>;
    leafId: Type.TOptional<Type.TString>;
    entryId: Type.TOptional<Type.TString>;
  }>;
}>;
/** Session file grouping used by the Control UI session workspace rail. */
declare const SessionFileKindSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
/** Session relevance marker for browser entries. */
declare const SessionFileRelevanceSchema: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>;
/** Encoding used when a session file preview includes inline content. */
declare const SessionFileContentEncodingSchema: Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>;
/** Renderer class selected for one session workspace file preview. */
declare const SessionFilePreviewKindSchema: Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"unsupported">]>;
/** One file path referenced by a session transcript. */
declare const SessionFileEntrySchema: Type.TObject<{
  path: Type.TString;
  workspacePath: Type.TOptional<Type.TString>;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
  missing: Type.TBoolean;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
  content: Type.TOptional<Type.TString>;
  hash: Type.TOptional<Type.TString>;
  mimeType: Type.TOptional<Type.TString>;
  contentEncoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
  previewKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"unsupported">]>>;
}>;
/** One file or folder in the session-rooted browser. */
declare const SessionFileBrowserEntrySchema: Type.TObject<{
  path: Type.TString;
  name: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
  sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
  size: Type.TOptional<Type.TInteger>;
  updatedAtMs: Type.TOptional<Type.TInteger>;
}>;
/** Folder listing or search result rooted at the session workspace. */
declare const SessionFileBrowserResultSchema: Type.TObject<{
  path: Type.TString;
  parentPath: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
  entries: Type.TArray<Type.TObject<{
    path: Type.TString;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
    sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
  }>>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Lists files touched by a session transcript. */
declare const SessionsFilesListParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  path: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
}>;
/** File references visible in one session workspace. */
declare const SessionsFilesListResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>; /** Whether the session workspace directory is inside a git checkout; absent when the workspace root is unknown or the gateway predates the field. */
  gitCheckout: Type.TOptional<Type.TBoolean>;
  files: Type.TArray<Type.TObject<{
    path: Type.TString;
    workspacePath: Type.TOptional<Type.TString>;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
    hash: Type.TOptional<Type.TString>;
    mimeType: Type.TOptional<Type.TString>;
    contentEncoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
    previewKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"unsupported">]>>;
  }>>;
  browser: Type.TOptional<Type.TObject<{
    path: Type.TString;
    parentPath: Type.TOptional<Type.TString>;
    search: Type.TOptional<Type.TString>;
    entries: Type.TArray<Type.TObject<{
      path: Type.TString;
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"file">, Type.TLiteral<"directory">]>;
      sessionKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">, Type.TLiteral<"mixed">]>>;
      size: Type.TOptional<Type.TInteger>;
      updatedAtMs: Type.TOptional<Type.TInteger>;
    }>>;
    truncated: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
/** Reads one session-referenced file by path. */
declare const SessionsFilesGetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  path: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Result for reading one session-referenced file. */
declare const SessionsFilesGetResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  file: Type.TObject<{
    path: Type.TString;
    workspacePath: Type.TOptional<Type.TString>;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
    hash: Type.TOptional<Type.TString>;
    mimeType: Type.TOptional<Type.TString>;
    contentEncoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
    previewKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"unsupported">]>>;
  }>;
}>;
/** Overwrites one existing session workspace file with hash-based CAS. */
declare const SessionsFilesSetParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  path: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  content: Type.TString;
  expectedHash: Type.TString;
}>;
/** Result for overwriting one session workspace file. */
declare const SessionsFilesSetResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  file: Type.TObject<{
    path: Type.TString;
    workspacePath: Type.TOptional<Type.TString>;
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"modified">, Type.TLiteral<"read">]>;
    missing: Type.TBoolean;
    size: Type.TOptional<Type.TInteger>;
    updatedAtMs: Type.TOptional<Type.TInteger>;
    content: Type.TOptional<Type.TString>;
    hash: Type.TOptional<Type.TString>;
    mimeType: Type.TOptional<Type.TString>;
    contentEncoding: Type.TOptional<Type.TUnion<[Type.TLiteral<"utf8">, Type.TLiteral<"base64">]>>;
    previewKind: Type.TOptional<Type.TUnion<[Type.TLiteral<"text">, Type.TLiteral<"image">, Type.TLiteral<"unsupported">]>>;
  }>;
}>;
/** Opens a session workspace on the Gateway host without accepting a client path. */
declare const SessionsFilesRevealParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Result for revealing a session workspace on the Gateway host. */
declare const SessionsFilesRevealResultSchema: Type.TObject<{
  ok: Type.TBoolean;
  path: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TString>;
}>;
/** Change status for one file in a session checkout diff. */
declare const SessionDiffFileStatusSchema: Type.TUnion<[Type.TLiteral<"added">, Type.TLiteral<"modified">, Type.TLiteral<"deleted">, Type.TLiteral<"renamed">]>;
/** One changed file in a session checkout diff. */
declare const SessionDiffFileSchema: Type.TObject<{
  path: Type.TString;
  oldPath: Type.TOptional<Type.TString>;
  status: Type.TUnion<[Type.TLiteral<"added">, Type.TLiteral<"modified">, Type.TLiteral<"deleted">, Type.TLiteral<"renamed">]>;
  additions: Type.TInteger;
  deletions: Type.TInteger;
  binary: Type.TOptional<Type.TBoolean>;
  untracked: Type.TOptional<Type.TBoolean>; /** Per-file unified patch text; absent for binary or oversized files. */
  patch: Type.TOptional<Type.TString>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** One commit shown in session diff branch metadata. */
declare const SessionDiffCommitSchema: Type.TObject<{
  sha: Type.TString;
  subject: Type.TString;
}>;
/** Selects the session checkout state represented by the diff. */
declare const SessionDiffScopeSchema: Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"uncommitted">, Type.TLiteral<"commit">]>;
/** Reads the git diff of a session checkout against its base branch. */
declare const SessionsDiffParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  scope: Type.TOptional<Type.TUnion<[Type.TLiteral<"all">, Type.TLiteral<"uncommitted">, Type.TLiteral<"commit">]>>;
  commit: Type.TOptional<Type.TString>;
}>;
/** Branch + working-tree diff for one session checkout. */
declare const SessionsDiffResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  root: Type.TOptional<Type.TString>;
  branch: Type.TOptional<Type.TString>; /** Display label of the diff base: the default branch name or "HEAD". */
  baseRef: Type.TOptional<Type.TString>; /** Number of commits between the resolved branch merge base and HEAD. */
  aheadCount: Type.TOptional<Type.TInteger>; /** Newest-first commits between the resolved branch merge base and HEAD. */
  commits: Type.TOptional<Type.TArray<Type.TObject<{
    sha: Type.TString;
    subject: Type.TString;
  }>>>; /** The resolved branch merge-base commit. */
  mergeBase: Type.TOptional<Type.TObject<{
    sha: Type.TString;
    subject: Type.TString;
  }>>;
  files: Type.TArray<Type.TObject<{
    path: Type.TString;
    oldPath: Type.TOptional<Type.TString>;
    status: Type.TUnion<[Type.TLiteral<"added">, Type.TLiteral<"modified">, Type.TLiteral<"deleted">, Type.TLiteral<"renamed">]>;
    additions: Type.TInteger;
    deletions: Type.TInteger;
    binary: Type.TOptional<Type.TBoolean>;
    untracked: Type.TOptional<Type.TBoolean>; /** Per-file unified patch text; absent for binary or oversized files. */
    patch: Type.TOptional<Type.TString>;
    truncated: Type.TOptional<Type.TBoolean>;
  }>>;
  additions: Type.TInteger;
  deletions: Type.TInteger;
  truncated: Type.TOptional<Type.TBoolean>;
  unavailableReason: Type.TOptional<Type.TUnion<[Type.TLiteral<"unknown_session">, Type.TLiteral<"not_git">, Type.TLiteral<"unknown_commit">]>>;
}>;
/** Lists sessions with optional scope, activity, label, and preview filters. */
declare const SessionsListParamsSchema: Type.TObject<{
  /** Maximum rows to return; omitted Gateway RPC calls use a bounded default. */limit: Type.TOptional<Type.TInteger>;
  offset: Type.TOptional<Type.TInteger>;
  activeMinutes: Type.TOptional<Type.TInteger>; /** Require a real user/channel interaction; excludes synthetic isolated heartbeat rows. */
  requireLastInteraction: Type.TOptional<Type.TBoolean>;
  sortBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"updatedAt">, Type.TLiteral<"lastInteractionAt">]>>;
  includeGlobal: Type.TOptional<Type.TBoolean>;
  includeUnknown: Type.TOptional<Type.TBoolean>; /** Limit agent-scoped rows to agents currently present in config. */
  configuredAgentsOnly: Type.TOptional<Type.TBoolean>;
  /**
   * Read first 8KB of each session transcript to derive title from first user message.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  /**
   * Read last 16KB of each session transcript to extract most recent message preview.
   * Performs a file read per session - use `limit` to bound result set on large stores.
   */
  includeLastMessage: Type.TOptional<Type.TBoolean>;
  label: Type.TOptional<Type.TString>; /** Limit rows to sessions with an explicitly stored Control UI face preference. */
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>; /** Filter rows by their permanent creator identity. */
  creatorId: Type.TOptional<Type.TString>;
  spawnedBy: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>;
  search: Type.TOptional<Type.TString>;
  /**
   * True lists archived sessions; "all" lists archived and active;
   * false or omitted lists active sessions.
   */
  archived: Type.TOptional<Type.TUnion<[Type.TBoolean, Type.TLiteral<"all">]>>;
}>;
/** Searches one agent's indexed session transcripts, optionally within selected sessions. */
declare const SessionsSearchParamsSchema: Type.TObject<{
  agentId: Type.TOptional<Type.TString>;
  sessionKeys: Type.TOptional<Type.TArray<Type.TString>>;
  query: Type.TString;
  limit: Type.TOptional<Type.TInteger>;
}>;
/** One full-text session transcript match with follow-up provenance. */
declare const SessionsSearchHitSchema: Type.TObject<{
  sessionKey: Type.TString;
  sessionId: Type.TString;
  messageId: Type.TString;
  role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
  timestamp: Type.TInteger;
  snippet: Type.TString;
  score: Type.TNumber;
}>;
/** Full-text search response; indexing marks a still-running first-use reconcile. */
declare const SessionsSearchResultSchema: Type.TObject<{
  results: Type.TArray<Type.TObject<{
    sessionKey: Type.TString;
    sessionId: Type.TString;
    messageId: Type.TString;
    role: Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"assistant">]>;
    timestamp: Type.TInteger;
    snippet: Type.TString;
    score: Type.TNumber;
  }>>;
  indexing: Type.TOptional<Type.TBoolean>;
  truncated: Type.TOptional<Type.TBoolean>;
}>;
/** Repairs or removes invalid session records from the selected agent scope. */
declare const SessionsCleanupParamsSchema: Type.TObject<{
  agent: Type.TOptional<Type.TString>;
  allAgents: Type.TOptional<Type.TBoolean>;
  enforce: Type.TOptional<Type.TBoolean>;
  activeKey: Type.TOptional<Type.TString>;
  fixMissing: Type.TOptional<Type.TBoolean>;
  fixDmScope: Type.TOptional<Type.TBoolean>;
}>;
/** Reads short previews for selected session keys. */
declare const SessionsPreviewParamsSchema: Type.TObject<{
  keys: Type.TArray<Type.TString>;
  limit: Type.TOptional<Type.TInteger>;
  maxChars: Type.TOptional<Type.TInteger>;
}>;
/** Describes one session and optional derived title/last-message previews. */
declare const SessionsDescribeParamsSchema: Type.TObject<{
  key: Type.TString;
  includeDerivedTitles: Type.TOptional<Type.TBoolean>;
  includeLastMessage: Type.TOptional<Type.TBoolean>;
}>;
declare const SessionWorktreeInfoSchema: Type.TObject<{
  id: Type.TString;
  path: Type.TString;
  branch: Type.TString;
}>;
/** Result returned after creating or adopting a session. */
declare const SessionsCreateResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  entry: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  runStarted: Type.TOptional<Type.TBoolean>;
  runId: Type.TOptional<Type.TString>;
  messageSeq: Type.TOptional<Type.TInteger>;
  runError: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
    details: Type.TOptional<Type.TUnknown>;
    retryable: Type.TOptional<Type.TBoolean>;
    retryAfterMs: Type.TOptional<Type.TInteger>;
  }>>;
  worktree: Type.TOptional<Type.TObject<{
    id: Type.TString;
    path: Type.TString;
    branch: Type.TString;
  }>>;
}>;
/** Sends one message into an existing session. */
declare const SessionsSendParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  message: Type.TString;
  thinking: Type.TOptional<Type.TString>;
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
  timeoutMs: Type.TOptional<Type.TInteger>;
  idempotencyKey: Type.TOptional<Type.TString>;
}>;
/**
 * Reconciles one client-issued send against the live run registry and the durable
 * transcript. Reports whether the run is currently in flight, already durably
 * applied to the transcript (so a retry would duplicate), or absent from both
 * (so a retry is safe because no agent execution side effect could have happened).
 */
declare const SessionsSendReconcileParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  runId: Type.TString;
}>;
declare const SessionsSendReconcileResultSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TString;
  runId: Type.TString;
  status: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"applied">, Type.TLiteral<"not_found">]>;
}>;
/** Subscribes a client to live message updates for one session. */
declare const SessionsMessagesSubscribeParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>; /** Opt in to sanitized durable approval events for this session and its descendants. */
  includeApprovals: Type.TOptional<Type.TLiteral<true>>;
}>;
/** Removes a live message subscription for one session. */
declare const SessionsMessagesUnsubscribeParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Aborts the active or named run for a session. */
declare const SessionsAbortParamsSchema: Type.TObject<{
  key: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  agentId: Type.TOptional<Type.TString>; /** Also discard followup and lane queues for a key-only non-global session abort. */
  clearQueued: Type.TOptional<Type.TBoolean>;
}>;
/** Updates or clears one plugin namespace value on a session record. */
declare const SessionsPluginPatchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  pluginId: Type.TString;
  namespace: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
  unset: Type.TOptional<Type.TBoolean>;
}>;
/** Result returned after patching session plugin state. */
declare const SessionsPluginPatchResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
}>;
/** Resets a session to a new or reset transcript state. */
declare const SessionsResetParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  reason: Type.TOptional<Type.TUnion<[Type.TLiteral<"new">, Type.TLiteral<"reset">]>>;
}>;
/** Deletes a session record and optionally its transcript. */
declare const SessionsDeleteParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  deleteTranscript: Type.TOptional<Type.TBoolean>;
  expectedSessionId: Type.TOptional<Type.TString>;
  expectedLifecycleRevision: Type.TOptional<Type.TString>;
  expectedSessionUpdatedAt: Type.TOptional<Type.TNumber>;
  emitLifecycleHooks: Type.TOptional<Type.TBoolean>;
  /**
   * Restricts the delete to already-archived sessions (archive-then-delete).
   * operator.write callers must set this; deletes without it require
   * operator.admin.
   */
  archivedOnly: Type.TOptional<Type.TBoolean>;
}>;
/** Lists the gateway-owned custom session group catalog (names + order). */
declare const SessionsGroupsListParamsSchema: Type.TObject<{}>;
/** One custom session group catalog entry. */
declare const SessionGroupSchema: Type.TObject<{
  name: Type.TString;
  position: Type.TInteger;
}>;
/** Custom session group catalog in display order. */
declare const SessionsGroupsListResultSchema: Type.TObject<{
  groups: Type.TArray<Type.TObject<{
    name: Type.TString;
    position: Type.TInteger;
  }>>;
  sectionOrder: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Replaces the ordered group catalog; creates listed names, keeps member categories untouched. */
declare const SessionsGroupsPutParamsSchema: Type.TObject<{
  names: Type.TArray<Type.TString>;
  sectionOrder: Type.TOptional<Type.TArray<Type.TString>>;
}>;
/** Renames a group and repoints every member session's category. */
declare const SessionsGroupsRenameParamsSchema: Type.TObject<{
  name: Type.TString;
  to: Type.TString;
}>;
/** Deletes a group and clears every member session's category. */
declare const SessionsGroupsDeleteParamsSchema: Type.TObject<{
  name: Type.TString;
}>;
/** Result for group catalog mutations, with member sessions updated where applicable. */
declare const SessionsGroupsMutationResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  groups: Type.TArray<Type.TObject<{
    name: Type.TString;
    position: Type.TInteger;
  }>>;
  sectionOrder: Type.TOptional<Type.TArray<Type.TString>>;
  updatedSessions: Type.TOptional<Type.TInteger>;
}>;
/** Requests manual compaction for a session transcript. */
declare const SessionsCompactParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  maxLines: Type.TOptional<Type.TInteger>;
}>;
/** Lists compaction checkpoints for one session. */
declare const SessionsCompactionListParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
/** Creates a new branch from a compaction checkpoint. */
declare const SessionsCompactionBranchParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Restores an existing session to a compaction checkpoint. */
declare const SessionsCompactionRestoreParamsSchema: Type.TObject<{
  key: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  checkpointId: Type.TString;
}>;
/** Repoints a session to the active-path state before one persisted user message. */
declare const SessionsRewindParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  entryId: Type.TString;
}>;
/** Creates a new session from the active-path state before one persisted user message. */
declare const SessionsForkParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  entryId: Type.TString;
}>;
declare const SessionsRewindResultSchema: Type.TObject<{
  editorText: Type.TOptional<Type.TString>;
  editorAttachments: Type.TOptional<Type.TArray<Type.TObject<{
    mimeType: Type.TString;
    data: Type.TString;
  }>>>;
}>;
declare const SessionsForkResultSchema: Type.TObject<{
  sessionKey: Type.TString;
  editorText: Type.TOptional<Type.TString>;
  editorAttachments: Type.TOptional<Type.TArray<Type.TObject<{
    mimeType: Type.TString;
    data: Type.TString;
  }>>>;
}>;
declare const SessionBranchSchema: Type.TObject<{
  leafEntryId: Type.TString;
  headline: Type.TString;
  messageCount: Type.TInteger;
  updatedAt: Type.TOptional<Type.TString>;
  active: Type.TBoolean;
}>;
/** Lists transcript DAG tips available for branch switching. */
declare const SessionsBranchesListParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
}>;
declare const SessionsBranchesListResultSchema: Type.TObject<{
  branches: Type.TArray<Type.TObject<{
    leafEntryId: Type.TString;
    headline: Type.TString;
    messageCount: Type.TInteger;
    updatedAt: Type.TOptional<Type.TString>;
    active: Type.TBoolean;
  }>>;
}>;
/** Repoints the active transcript path to one existing DAG tip. */
declare const SessionsBranchesSwitchParamsSchema: Type.TObject<{
  sessionKey: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  leafEntryId: Type.TString;
}>;
declare const SessionsBranchesSwitchResultSchema: Type.TObject<{}>;
/** List response for session compaction checkpoints. */
declare const SessionsCompactionListResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  checkpoints: Type.TArray<Type.TObject<{
    checkpointId: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TString;
    createdAt: Type.TInteger;
    reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
    tokensBefore: Type.TOptional<Type.TInteger>;
    tokensAfter: Type.TOptional<Type.TInteger>;
    tokensVersion: Type.TOptional<Type.TLiteral<1>>;
    summary: Type.TOptional<Type.TString>;
    firstKeptEntryId: Type.TOptional<Type.TString>;
    preCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
    postCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
  }>>;
}>;
/** Branch response with the newly created session key and entry metadata. */
declare const SessionsCompactionBranchResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  sourceKey: Type.TString;
  key: Type.TString;
  sessionId: Type.TString;
  checkpoint: Type.TObject<{
    checkpointId: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TString;
    createdAt: Type.TInteger;
    reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
    tokensBefore: Type.TOptional<Type.TInteger>;
    tokensAfter: Type.TOptional<Type.TInteger>;
    tokensVersion: Type.TOptional<Type.TLiteral<1>>;
    summary: Type.TOptional<Type.TString>;
    firstKeptEntryId: Type.TOptional<Type.TString>;
    preCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
    postCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
  }>;
  entry: Type.TObject<{
    sessionId: Type.TString;
    updatedAt: Type.TInteger;
  }>;
}>;
/** Restore response with updated session entry metadata. */
declare const SessionsCompactionRestoreResultSchema: Type.TObject<{
  ok: Type.TLiteral<true>;
  key: Type.TString;
  sessionId: Type.TString;
  checkpoint: Type.TObject<{
    checkpointId: Type.TString;
    sessionKey: Type.TString;
    sessionId: Type.TString;
    createdAt: Type.TInteger;
    reason: Type.TUnion<[Type.TLiteral<"manual">, Type.TLiteral<"auto-threshold">, Type.TLiteral<"overflow-retry">, Type.TLiteral<"timeout-retry">]>;
    tokensBefore: Type.TOptional<Type.TInteger>;
    tokensAfter: Type.TOptional<Type.TInteger>;
    tokensVersion: Type.TOptional<Type.TLiteral<1>>;
    summary: Type.TOptional<Type.TString>;
    firstKeptEntryId: Type.TOptional<Type.TString>;
    preCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
    postCompaction: Type.TObject<{
      sessionId: Type.TString;
      sessionFile: Type.TOptional<Type.TString>;
      leafId: Type.TOptional<Type.TString>;
      entryId: Type.TOptional<Type.TString>;
    }>;
  }>;
  entry: Type.TObject<{
    sessionId: Type.TString;
    updatedAt: Type.TInteger;
  }>;
}>;
/** Usage report query across one session, one agent, or all agent sessions. */
declare const SessionsUsageParamsSchema: Type.TObject<{
  /** Specific session key to analyze; if omitted returns sessions for the effective agent. */key: Type.TOptional<Type.TString>; /** Agent scope for list-style usage queries. */
  agentId: Type.TOptional<Type.TString>; /** Explicit all-agent scope for list-style usage queries. */
  agentScope: Type.TOptional<Type.TLiteral<"all">>; /** Start date for range filter (YYYY-MM-DD). */
  startDate: Type.TOptional<Type.TString>; /** End date for range filter (YYYY-MM-DD). */
  endDate: Type.TOptional<Type.TString>; /** How start/end dates should be interpreted. Defaults to UTC when omitted. */
  mode: Type.TOptional<Type.TUnion<[Type.TLiteral<"utc">, Type.TLiteral<"gateway">, Type.TLiteral<"specific">]>>; /** Preset range for usage queries when explicit start/end dates are omitted. */
  range: Type.TOptional<Type.TUnion<[Type.TLiteral<"7d">, Type.TLiteral<"30d">, Type.TLiteral<"90d">, Type.TLiteral<"1y">, Type.TLiteral<"all">]>>; /** Usage row grouping. `family` rolls up known rotated session ids for a logical key. */
  groupBy: Type.TOptional<Type.TUnion<[Type.TLiteral<"instance">, Type.TLiteral<"family">]>>; /** Backward-compatible alias for requesting family grouping. */
  includeHistorical: Type.TOptional<Type.TBoolean>; /** UTC offset to use when mode is `specific` (for example, UTC-4 or UTC+5:30). */
  utcOffset: Type.TOptional<Type.TString>; /** IANA time zone for `specific`; preferred over `utcOffset`, which remains a compatibility fallback. */
  timeZone: Type.TOptional<Type.TString>; /** Maximum sessions to return (default 50). */
  limit: Type.TOptional<Type.TInteger>; /** Include context weight breakdown (systemPromptReport). */
  includeContextWeight: Type.TOptional<Type.TBoolean>;
}>;
type SessionsListParams = Static<typeof SessionsListParamsSchema>;
type SessionsCleanupParams = Static<typeof SessionsCleanupParamsSchema>;
type SessionsPreviewParams = Static<typeof SessionsPreviewParamsSchema>;
type SessionsDescribeParams = Static<typeof SessionsDescribeParamsSchema>;
type SessionsSearchParams = Static<typeof SessionsSearchParamsSchema>;
type SessionsSearchHit = Static<typeof SessionsSearchHitSchema>;
type SessionsSearchResult = Static<typeof SessionsSearchResultSchema>;
type SessionCompactionCheckpoint = Static<typeof SessionCompactionCheckpointSchema>;
type SessionOperationEvent = Static<typeof SessionOperationEventSchema>;
type SessionObserverHealth = Static<typeof SessionObserverHealthSchema>;
type SessionObserverPlanProgress = Static<typeof SessionObserverPlanProgressSchema>;
type SessionObserverDigest = Static<typeof SessionObserverDigestSchema>;
type SessionsObserverVisibilityParams = Static<typeof SessionsObserverVisibilityParamsSchema>;
type SessionsObserverVisibilityResult = Static<typeof SessionsObserverVisibilityResultSchema>;
type SessionCompanionExchange = Static<typeof SessionCompanionExchangeSchema>;
type SessionsCompanionAskParams = Static<typeof SessionsCompanionAskParamsSchema>;
type SessionsCompanionAskResult = Static<typeof SessionsCompanionAskResultSchema>;
type SessionsCompanionStateParams = Static<typeof SessionsCompanionStateParamsSchema>;
type SessionsCompanionStateResult = Static<typeof SessionsCompanionStateResultSchema>;
type SessionsCompanionResetParams = Static<typeof SessionsCompanionResetParamsSchema>;
type SessionsCompanionResetResult = Static<typeof SessionsCompanionResetResultSchema>;
type SessionsCompactionListParams = Static<typeof SessionsCompactionListParamsSchema>;
type SessionsCompactionBranchParams = Static<typeof SessionsCompactionBranchParamsSchema>;
type SessionsCompactionRestoreParams = Static<typeof SessionsCompactionRestoreParamsSchema>;
type SessionsCompactionListResult = Static<typeof SessionsCompactionListResultSchema>;
type SessionsCompactionBranchResult = Static<typeof SessionsCompactionBranchResultSchema>;
type SessionsCompactionRestoreResult = Static<typeof SessionsCompactionRestoreResultSchema>;
type SessionsRewindParams = Static<typeof SessionsRewindParamsSchema>;
type SessionsForkParams = Static<typeof SessionsForkParamsSchema>;
type SessionsRewindResult = Static<typeof SessionsRewindResultSchema>;
type SessionsForkResult = Static<typeof SessionsForkResultSchema>;
type SessionBranch = Static<typeof SessionBranchSchema>;
type SessionsBranchesListParams = Static<typeof SessionsBranchesListParamsSchema>;
type SessionsBranchesListResult = Static<typeof SessionsBranchesListResultSchema>;
type SessionsBranchesSwitchParams = Static<typeof SessionsBranchesSwitchParamsSchema>;
type SessionsBranchesSwitchResult = Static<typeof SessionsBranchesSwitchResultSchema>;
type SessionWorktreeInfo = Static<typeof SessionWorktreeInfoSchema>;
type SessionsCreateParams = Static<typeof SessionsCreateParamsSchema>;
type SessionsCreateResult = Static<typeof SessionsCreateResultSchema>;
type SessionsRecoverParams = Static<typeof SessionsRecoverParamsSchema>;
type SessionsRecoverResult = Static<typeof SessionsRecoverResultSchema>;
type SessionsSendParams = Static<typeof SessionsSendParamsSchema>;
type SessionsSendReconcileParams = Static<typeof SessionsSendReconcileParamsSchema>;
type SessionsSendReconcileResult = Static<typeof SessionsSendReconcileResultSchema>;
type SessionsMessagesSubscribeParams = Static<typeof SessionsMessagesSubscribeParamsSchema>;
type SessionsMessagesUnsubscribeParams = Static<typeof SessionsMessagesUnsubscribeParamsSchema>;
type SessionsAbortParams = Static<typeof SessionsAbortParamsSchema>;
type SessionsPluginPatchParams = Static<typeof SessionsPluginPatchParamsSchema>;
type SessionsPluginPatchResult = Static<typeof SessionsPluginPatchResultSchema>;
type SessionsResetParams = Static<typeof SessionsResetParamsSchema>;
type SessionsDeleteParams = Static<typeof SessionsDeleteParamsSchema>;
type SessionGroup = Static<typeof SessionGroupSchema>;
type SessionsGroupsListParams = Static<typeof SessionsGroupsListParamsSchema>;
type SessionsGroupsListResult = Static<typeof SessionsGroupsListResultSchema>;
type SessionsGroupsPutParams = Static<typeof SessionsGroupsPutParamsSchema>;
type SessionsGroupsRenameParams = Static<typeof SessionsGroupsRenameParamsSchema>;
type SessionsGroupsDeleteParams = Static<typeof SessionsGroupsDeleteParamsSchema>;
type SessionsGroupsMutationResult = Static<typeof SessionsGroupsMutationResultSchema>;
type SessionsCompactParams = Static<typeof SessionsCompactParamsSchema>;
type SessionsUsageParams = Static<typeof SessionsUsageParamsSchema>;
type SessionFileContentEncoding = Static<typeof SessionFileContentEncodingSchema>;
type SessionFileKind = Static<typeof SessionFileKindSchema>;
type SessionFilePreviewKind = Static<typeof SessionFilePreviewKindSchema>;
type SessionFileRelevance = Static<typeof SessionFileRelevanceSchema>;
type SessionFileEntry = Static<typeof SessionFileEntrySchema>;
type SessionFileBrowserEntry = Static<typeof SessionFileBrowserEntrySchema>;
type SessionFileBrowserResult = Static<typeof SessionFileBrowserResultSchema>;
type SessionsFilesListParams = Static<typeof SessionsFilesListParamsSchema>;
type SessionsFilesListResult = Static<typeof SessionsFilesListResultSchema>;
type SessionsFilesGetParams = Static<typeof SessionsFilesGetParamsSchema>;
type SessionsFilesGetResult = Static<typeof SessionsFilesGetResultSchema>;
type SessionsFilesSetParams = Static<typeof SessionsFilesSetParamsSchema>;
type SessionsFilesSetResult = Static<typeof SessionsFilesSetResultSchema>;
type SessionsFilesRevealParams = Static<typeof SessionsFilesRevealParamsSchema>;
type SessionsFilesRevealResult = Static<typeof SessionsFilesRevealResultSchema>;
type SessionDiffFileStatus = Static<typeof SessionDiffFileStatusSchema>;
type SessionDiffFile = Static<typeof SessionDiffFileSchema>;
type SessionDiffCommit = Static<typeof SessionDiffCommitSchema>;
type SessionDiffScope = Static<typeof SessionDiffScopeSchema>;
type SessionsDiffParams = Static<typeof SessionsDiffParamsSchema>;
type SessionsDiffResult = Static<typeof SessionsDiffResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/session-agent-status.d.ts
declare const SESSION_AGENT_ATTENTION_ICON_IDS: readonly ["hand", "key", "alert", "flag", "lock", "hourglass"];
type SessionAgentAttentionIconId = (typeof SESSION_AGENT_ATTENTION_ICON_IDS)[number];
type SessionAgentStatus = {
  note: string;
  expiresAt: number;
  attention?: SessionAgentAttentionIconId;
};
//#endregion
export { SessionsBranchesSwitchResult as $, SessionsSendReconcileResultSchema as $n, SessionsFilesSetParamsSchema as $t, SessionFilePreviewKindSchema as A, SessionsPluginPatchResult as An, SessionsCreateResult as At, SessionObserverPlanProgressSchema as B, SessionsRewindResult as Bn, SessionsFilesGetParams as Bt, SessionFileContentEncoding as C, SessionsMessagesUnsubscribeParamsSchema as Cn, SessionToolOverrides as Cr, SessionsCompanionResetResult as Ct, SessionFileKind as D, SessionsObserverVisibilityResultSchema as Dn, SessionsCompanionStateResult as Dt, SessionFileEntrySchema as E, SessionsObserverVisibilityResult as En, SessionsCompanionStateParamsSchema as Et, SessionObserverDigest as F, SessionsRecoverResult as Fn, SessionsDescribeParamsSchema as Ft, SessionsAbortParams as G, SessionsSearchParamsSchema as Gn, SessionsFilesListParamsSchema as Gt, SessionOperationEventSchema as H, SessionsSearchHit as Hn, SessionsFilesGetResult as Ht, SessionObserverDigestSchema as I, SessionsResetParams as In, SessionsDiffParams as It, SessionsBranchesListParamsSchema as J, SessionsSendParams as Jn, SessionsFilesRevealParams as Jt, SessionsAbortParamsSchema as K, SessionsSearchResult as Kn, SessionsFilesListResult as Kt, SessionObserverHealth as L, SessionsResetParamsSchema as Ln, SessionsDiffParamsSchema as Lt, SessionFileRelevanceSchema as M, SessionsPreviewParams as Mn, SessionsDeleteParams as Mt, SessionGroup as N, SessionsPreviewParamsSchema as Nn, SessionsDeleteParamsSchema as Nt, SessionFileKindSchema as O, SessionsPluginPatchParams as On, SessionsCompanionStateResultSchema as Ot, SessionGroupSchema as P, SessionsRecoverParams as Pn, SessionsDescribeParams as Pt, SessionsBranchesSwitchParamsSchema as Q, SessionsSendReconcileResult as Qn, SessionsFilesSetParams as Qt, SessionObserverHealthSchema as R, SessionsRewindParams as Rn, SessionsDiffResult as Rt, SessionFileBrowserResultSchema as S, SessionsMessagesUnsubscribeParams as Sn, SessionRunStatus as Sr, SessionsCompanionResetParamsSchema as St, SessionFileEntry as T, SessionsObserverVisibilityParamsSchema as Tn, SessionsCompanionStateParams as Tt, SessionWorktreeInfo as U, SessionsSearchHitSchema as Un, SessionsFilesGetResultSchema as Ut, SessionOperationEvent as V, SessionsRewindResultSchema as Vn, SessionsFilesGetParamsSchema as Vt, SessionWorktreeInfoSchema as W, SessionsSearchParams as Wn, SessionsFilesListParams as Wt, SessionsBranchesListResultSchema as X, SessionsSendReconcileParams as Xn, SessionsFilesRevealResult as Xt, SessionsBranchesListResult as Y, SessionsSendParamsSchema as Yn, SessionsFilesRevealParamsSchema as Yt, SessionsBranchesSwitchParams as Z, SessionsSendReconcileParamsSchema as Zn, SessionsFilesRevealResultSchema as Zt, SessionDiffScope as _, SessionsGroupsRenameParamsSchema as _n, SessionsCreateParamsSchema as _r, SessionsCompanionAskParams as _t, SessionBranch as a, SessionsForkResultSchema as an, SessionsPatchManyResult as ar, SessionsCompactionBranchParams as at, SessionFileBrowserEntrySchema as b, SessionsMessagesSubscribeParams as bn, SessionRow as br, SessionsCompanionAskResultSchema as bt, SessionCompactionCheckpointSchema as c, SessionsGroupsListParams as cn, SessionsPatchManyTargetSchema as cr, SessionsCompactionBranchResultSchema as ct, SessionDiffCommit as d, SessionsGroupsListResultSchema as dn, SessionsPatchParams as dr, SessionsCompactionListResult as dt, SessionsFilesSetResult as en, SessionsUsageParams as er, SessionsBranchesSwitchResultSchema as et, SessionDiffCommitSchema as f, SessionsGroupsMutationResult as fn, SessionsPatchParamsSchema as fr, SessionsCompactionListResultSchema as ft, SessionDiffFileStatusSchema as g, SessionsGroupsRenameParams as gn, SessionsRecoverResultSchema as gr, SessionsCompactionRestoreResultSchema as gt, SessionDiffFileStatus as h, SessionsGroupsPutParamsSchema as hn, SessionsRecoverParamsSchema as hr, SessionsCompactionRestoreResult as ht, SESSION_OBSERVER_HEALTH_VALUES as i, SessionsForkResult as in, SessionsPatchManyParamsSchema as ir, SessionsCompactParamsSchema as it, SessionFileRelevance as j, SessionsPluginPatchResultSchema as jn, SessionsCreateResultSchema as jt, SessionFilePreviewKind as k, SessionsPluginPatchParamsSchema as kn, SessionsCreateParams as kt, SessionCompanionExchange as l, SessionsGroupsListParamsSchema as ln, SessionsPatchMutation as lr, SessionsCompactionListParams as lt, SessionDiffFileSchema as m, SessionsGroupsPutParams as mn, SessionsResolveParamsSchema as mr, SessionsCompactionRestoreParamsSchema as mt, SessionAgentAttentionIconId as n, SessionsForkParams as nn, SESSIONS_PATCH_MANY_MAX_TARGETS as nr, SessionsCleanupParamsSchema as nt, SessionBranchSchema as o, SessionsGroupsDeleteParams as on, SessionsPatchManyResultSchema as or, SessionsCompactionBranchParamsSchema as ot, SessionDiffFile as p, SessionsGroupsMutationResultSchema as pn, SessionsResolveParams as pr, SessionsCompactionRestoreParams as pt, SessionsBranchesListParams as q, SessionsSearchResultSchema as qn, SessionsFilesListResultSchema as qt, SessionAgentStatus as r, SessionsForkParamsSchema as rn, SessionsPatchManyParams as rr, SessionsCompactParams as rt, SessionCompactionCheckpoint as s, SessionsGroupsDeleteParamsSchema as sn, SessionsPatchManyTarget as sr, SessionsCompactionBranchResult as st, SESSION_AGENT_ATTENTION_ICON_IDS as t, SessionsFilesSetResultSchema as tn, SessionsUsageParamsSchema as tr, SessionsCleanupParams as tt, SessionCompanionExchangeSchema as u, SessionsGroupsListResult as un, SessionsPatchMutationSchema as ur, SessionsCompactionListParamsSchema as ut, SessionDiffScopeSchema as v, SessionsListParams as vn, SessionCreatedActor as vr, SessionsCompanionAskParamsSchema as vt, SessionFileContentEncodingSchema as w, SessionsObserverVisibilityParams as wn, SessionToolOverridesSchema as wr, SessionsCompanionResetResultSchema as wt, SessionFileBrowserResult as x, SessionsMessagesSubscribeParamsSchema as xn, SessionRowSchema as xr, SessionsCompanionResetParams as xt, SessionFileBrowserEntry as y, SessionsListParamsSchema as yn, SessionCreatedActorSchema as yr, SessionsCompanionAskResult as yt, SessionObserverPlanProgress as z, SessionsRewindParamsSchema as zn, SessionsDiffResultSchema as zt };