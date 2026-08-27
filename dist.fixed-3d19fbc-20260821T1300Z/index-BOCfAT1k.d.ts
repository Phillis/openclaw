import { Static, TSchema, Type } from "typebox";

//#region packages/gateway-protocol/src/schema/approvals.d.ts
/** Reviewer-safe presentation discriminated by the approval owner. */
declare const ApprovalPresentationSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"exec">;
  commandText: Type.TString;
  commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"plugin">;
  title: Type.TString;
  description: Type.TString;
  detail: Type.TOptional<Type.TString>;
  severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
}>, Type.TObject<{
  kind: Type.TLiteral<"system-agent">;
  title: Type.TString;
  description: Type.TString;
  proposalHash: Type.TString;
  agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
}>]>;
/** Authoritative pending approval set returned when a session stream subscribes. */
declare const SessionApprovalReplaySchema: Type.TObject<{
  sessionKey: Type.TString;
  updatedAtMs: Type.TInteger;
  approvals: Type.TArray<Type.TObject<{
    status: Type.TLiteral<"pending">;
    id: Type.TString;
    urlPath: Type.TString;
    createdAtMs: Type.TInteger;
    expiresAtMs: Type.TInteger;
    presentation: Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"exec">;
      commandText: Type.TString;
      commandPreview: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      warningText: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      host: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      nodeId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"plugin">;
      title: Type.TString;
      description: Type.TString;
      detail: Type.TOptional<Type.TString>;
      severity: Type.TUnion<[Type.TLiteral<"info">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
      pluginId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      toolName: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TArray<Type.TUnion<[Type.TLiteral<"allow-once">, Type.TLiteral<"allow-always">, Type.TLiteral<"deny">]>>;
    }>, Type.TObject<{
      kind: Type.TLiteral<"system-agent">;
      title: Type.TString;
      description: Type.TString;
      proposalHash: Type.TString;
      agentId: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
      allowedDecisions: Type.TTuple<[Type.TLiteral<"allow-once">, Type.TLiteral<"deny">]>;
    }>]>;
  }>>;
  truncated: Type.TBoolean;
}>;
type ApprovalPresentation = Static<typeof ApprovalPresentationSchema>;
type SessionApprovalReplay = Static<typeof SessionApprovalReplaySchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-inference.d.ts
declare const WorkerInferenceModelRefSchema: Type.TObject<{
  readonly provider: Type.TString;
  readonly model: Type.TString;
}>;
declare const WorkerInferenceOptionsSchema: Type.TObject<{
  readonly temperature: Type.TOptional<Type.TNumber>;
  readonly maxTokens: Type.TOptional<Type.TInteger>;
  readonly reasoning: Type.TOptional<Type.TUnion<[Type.TLiteral<"off">, Type.TLiteral<"minimal">, Type.TLiteral<"low">, Type.TLiteral<"medium">, Type.TLiteral<"high">, Type.TLiteral<"xhigh">, Type.TLiteral<"adaptive">, Type.TLiteral<"max">]>>;
  readonly thinkingBudgets: Type.TOptional<Type.TObject<{
    readonly minimal: Type.TOptional<Type.TInteger>;
    readonly low: Type.TOptional<Type.TInteger>;
    readonly medium: Type.TOptional<Type.TInteger>;
    readonly high: Type.TOptional<Type.TInteger>;
    readonly max: Type.TOptional<Type.TInteger>;
  }>>;
}>;
type WorkerInferenceModelRef = Static<typeof WorkerInferenceModelRefSchema>;
type WorkerInferenceOptions = Static<typeof WorkerInferenceOptionsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["webchat", "cli", "openclaw-worker", "openclaw-probe", "test", "webchat-ui", "openclaw-control-ui", "openclaw-browser-copilot", "openclaw-tui", "gateway-client", "openclaw-macos", "openclaw-linux", "openclaw-ios", "openclaw-watchos", "openclaw-android", "node-host", "fingerprint"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "worker", "probe", "test", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>; /** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
  computerUse: Type.TOptional<Type.TUnknown>; /** Additive node-local worker build identity; presence advertises session hosting. */
  workerRuns: Type.TOptional<Type.TObject<{
    bundleHash: Type.TString;
    openclawVersion: Type.TString;
    protocolFeatures: Type.TArray<Type.TString>;
  }>>;
  permissions: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
  pathEnv: Type.TOptional<Type.TString>;
  role: Type.TOptional<Type.TString>;
  scopes: Type.TOptional<Type.TArray<Type.TString>>;
  device: Type.TOptional<Type.TObject<{
    id: Type.TString;
    publicKey: Type.TString;
    signature: Type.TString;
    signedAt: Type.TInteger;
    nonce: Type.TString;
  }>>;
  auth: Type.TOptional<Type.TObject<{
    token: Type.TOptional<Type.TString>;
    bootstrapToken: Type.TOptional<Type.TString>;
    deviceToken: Type.TOptional<Type.TString>;
    password: Type.TOptional<Type.TString>;
    approvalRuntimeToken: Type.TOptional<Type.TString>;
    agentRuntimeIdentityToken: Type.TOptional<Type.TString>;
  }>>;
  locale: Type.TOptional<Type.TString>;
  userAgent: Type.TOptional<Type.TString>;
}>;
/** Standard structured error shape used in response frames and connect failures. */
declare const ErrorShapeSchema: Type.TObject<{
  code: Type.TString;
  message: Type.TString;
  details: Type.TOptional<Type.TUnknown>;
  retryable: Type.TOptional<Type.TBoolean>;
  retryAfterMs: Type.TOptional<Type.TInteger>;
}>;
/** Client request frame envelope; `method` selects the payload validator. */
declare const RequestFrameSchema: Type.TObject<{
  type: Type.TLiteral<"req">;
  id: Type.TString;
  method: Type.TString;
  params: Type.TOptional<Type.TUnknown>;
  traceparent: Type.TOptional<Type.TString>;
}>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions-catalog.d.ts
declare const SessionCatalogHostSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
  connected: Type.TBoolean;
  nodeId: Type.TOptional<Type.TString>;
  sessions: Type.TArray<Type.TObject<{
    threadId: Type.TString;
    name: Type.TOptional<Type.TString>;
    cwd: Type.TOptional<Type.TString>;
    status: Type.TString;
    createdAt: Type.TOptional<Type.TNumber>;
    updatedAt: Type.TOptional<Type.TNumber>;
    recencyAt: Type.TOptional<Type.TNumber>;
    source: Type.TOptional<Type.TString>;
    modelProvider: Type.TOptional<Type.TString>;
    cliVersion: Type.TOptional<Type.TString>;
    gitBranch: Type.TOptional<Type.TString>;
    customGroup: Type.TOptional<Type.TString>;
    pullRequest: Type.TOptional<Type.TObject<{
      numbers: Type.TArray<Type.TInteger>;
      state: Type.TUnion<[Type.TLiteral<"open">, Type.TLiteral<"draft">, Type.TLiteral<"merged">, Type.TLiteral<"closed">]>;
    }>>;
    archived: Type.TBoolean;
    sessionKey: Type.TOptional<Type.TString>;
    createdActor: Type.TOptional<Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    canContinue: Type.TBoolean;
    canArchive: Type.TBoolean;
    canOpenTerminal: Type.TOptional<Type.TBoolean>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
  error: Type.TOptional<Type.TObject<{
    code: Type.TString;
    message: Type.TString;
  }>>;
}>;
declare const SessionsCatalogReadParamsSchema: Type.TObject<{
  limit: Type.TOptional<Type.TInteger>;
  cursor: Type.TOptional<Type.TString>;
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
declare const SessionsCatalogReadResultSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TOptional<Type.TString>;
  threadId: Type.TString;
  items: Type.TArray<Type.TObject<{
    id: Type.TOptional<Type.TString>;
    type: Type.TUnion<[Type.TLiteral<"userMessage">, Type.TLiteral<"agentMessage">, Type.TLiteral<"reasoning">, Type.TLiteral<"toolCall">, Type.TLiteral<"toolResult">, Type.TLiteral<"other">]>;
    text: Type.TOptional<Type.TString>;
    timestamp: Type.TOptional<Type.TString>;
    model: Type.TOptional<Type.TString>;
    truncated: Type.TOptional<Type.TBoolean>;
    raw: Type.TOptional<Type.TUnknown>;
  }>>;
  nextCursor: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogContinueParamsSchema: Type.TObject<{
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  confirmNoOtherRunner: Type.TLiteral<true>;
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
}>;
type SessionCatalogHost = Static<typeof SessionCatalogHostSchema>;
type SessionsCatalogReadParams = Static<typeof SessionsCatalogReadParamsSchema>;
type SessionsCatalogReadResult = Static<typeof SessionsCatalogReadResultSchema>;
type SessionsCatalogContinueParams = Static<typeof SessionsCatalogContinueParamsSchema>;
type SessionsCatalogArchiveParams = Static<typeof SessionsCatalogArchiveParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agent.d.ts
/** Waits for a submitted agent run to complete or time out. */
declare const AgentWaitParamsSchema: Type.TObject<{
  runId: Type.TString;
  timeoutMs: Type.TOptional<Type.TInteger>;
}>;
type AgentWaitParams = Static<typeof AgentWaitParamsSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/agents-models-skills.d.ts
declare const AgentsListResultSchema: Type.TObject<{
  defaultId: Type.TString;
  ownership: Type.TOptional<Type.TUnion<[Type.TLiteral<"sole">, Type.TLiteral<"legacy">, Type.TLiteral<"explicit">]>>;
  selectionRequired: Type.TOptional<Type.TBoolean>;
  mainKey: Type.TString;
  scope: Type.TUnion<[Type.TLiteral<"per-sender">, Type.TLiteral<"global">]>;
  agents: Type.TArray<Type.TObject<{
    id: Type.TString;
    kind: Type.TOptional<Type.TUnion<[Type.TLiteral<"agent">, Type.TLiteral<"system">]>>;
    name: Type.TOptional<Type.TString>;
    identity: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      theme: Type.TOptional<Type.TString>;
      emoji: Type.TOptional<Type.TString>;
      avatar: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    workspace: Type.TOptional<Type.TString>;
    workspaceGit: Type.TOptional<Type.TBoolean>;
    model: Type.TOptional<Type.TObject<{
      primary: Type.TOptional<Type.TString>;
      fallbacks: Type.TOptional<Type.TArray<Type.TString>>;
    }>>;
    agentRuntime: Type.TOptional<Type.TObject<{
      id: Type.TString;
      fallback: Type.TOptional<Type.TUnion<[Type.TLiteral<"openclaw">, Type.TLiteral<"none">]>>;
      cloudPlacementSupported: Type.TOptional<Type.TBoolean>;
      source: Type.TUnion<[Type.TLiteral<"env">, Type.TLiteral<"agent">, Type.TLiteral<"defaults">, Type.TLiteral<"model">, Type.TLiteral<"provider">, Type.TLiteral<"implicit">, Type.TLiteral<"session">, Type.TLiteral<"session-key">]>;
    }>>;
    thinkingLevels: Type.TOptional<Type.TArray<Type.TObject<{
      id: Type.TString;
      label: Type.TString;
    }>>>;
    thinkingOptions: Type.TOptional<Type.TArray<Type.TString>>;
    thinkingDefault: Type.TOptional<Type.TString>;
  }>>;
}>;
type AgentsListResult = Static<typeof AgentsListResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.d.ts
declare const SystemAgentWizardCancelSchema: Type.TObject<{
  /** The visible step this action belongs to; stale controls must not affect a newer step. */stepId: Type.TString;
}>;
/**
 * Structured choice attached to a chat reply. Card-capable clients render the
 * options and send back `reply` (default: `label`) as the next message; text
 * clients ignore this and use the reply prose, which always stands alone.
 */
declare const SystemAgentChatQuestionSchema: Type.TObject<{
  id: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    recommended: Type.TOptional<Type.TBoolean>; /** Message text a client sends when this option is chosen; defaults to label. */
    reply: Type.TOptional<Type.TString>;
  }>>; /** Free-text answers are also accepted for this question. */
  isOther: Type.TOptional<Type.TBoolean>; /** Client-owned action for the visible skip control; omitted means send a reply. */
  skipAction: Type.TOptional<Type.TLiteral<"exit">>;
}>;
type SystemAgentWizardCancel = Static<typeof SystemAgentWizardCancelSchema>;
type SystemAgentChatQuestion = Static<typeof SystemAgentChatQuestionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/devices.d.ts
/** Returns the terminal scope-upgrade state to the identity-bound waiter. */
declare const ScopeUpgradeResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"approved">;
  requestId: Type.TString;
  deviceToken: Type.TString;
  scopes: Type.TArray<Type.TString>;
}>, Type.TObject<{
  status: Type.TLiteral<"rejected">;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
  requestId: Type.TString;
}>]>;
type ScopeUpgradeResult = Static<typeof ScopeUpgradeResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/nodes.d.ts
/** Agent-visible tool descriptor advertised by a connected node. */
declare const NodePluginToolDescriptorSchema: Type.TObject<{
  pluginId: Type.TString;
  name: Type.TString;
  description: Type.TString;
  parameters: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  command: Type.TOptional<Type.TString>;
  mcp: Type.TOptional<Type.TObject<{
    server: Type.TString;
    tool: Type.TString;
  }>>;
}>;
type NodePluginToolDescriptor = Static<typeof NodePluginToolDescriptorSchema>;
/** Agent-visible skill descriptor advertised by a connected node. */
declare const NodeSkillDescriptorSchema: Type.TObject<{
  name: Type.TString;
  description: Type.TString;
  content: Type.TString;
}>;
type NodeSkillDescriptor = Static<typeof NodeSkillDescriptorSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
declare const SessionPlacementDiskSpaceSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  availableBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  observedAtMs: Type.TInteger;
}>;
type SessionPlacementDiskSpace = Static<typeof SessionPlacementDiskSpaceSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/snapshot.d.ts
/** Initial and incremental gateway state snapshot payload. */
declare const SnapshotSchema: Type.TObject<{
  presence: Type.TArray<Type.TObject<{
    host: Type.TOptional<Type.TString>;
    ip: Type.TOptional<Type.TString>;
    version: Type.TOptional<Type.TString>;
    platform: Type.TOptional<Type.TString>;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    ts: Type.TInteger;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
    user: Type.TOptional<Type.TObject<{
      /** Opaque identity key: authenticated email today, durable profile id later. Clients group presence by this. */id: Type.TString;
      email: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>; /** Session keys this connection is actively subscribed to (watching). Sorted lexicographically for deterministic snapshots. */
    watchedSessions: Type.TOptional<Type.TArray<Type.TString>>;
  }>>;
  health: Type.TObject<{
    ok: Type.TOptional<Type.TLiteral<true>>;
    ts: Type.TOptional<Type.TInteger>;
    durationMs: Type.TOptional<Type.TInteger>;
    eventLoop: Type.TOptional<Type.TObject<{
      degraded: Type.TBoolean;
      degradedSinceMs: Type.TOptional<Type.TUnion<[Type.TInteger, Type.TNull]>>;
      reasons: Type.TArray<Type.TUnion<[Type.TLiteral<"event_loop_delay">, Type.TLiteral<"event_loop_utilization">, Type.TLiteral<"cpu">]>>;
      intervalMs: Type.TNumber;
      delayP99Ms: Type.TNumber;
      delayMaxMs: Type.TNumber;
      utilization: Type.TNumber;
      cpuCoreRatio: Type.TNumber;
    }>>;
    plugins: Type.TOptional<Type.TObject<{
      loaded: Type.TArray<Type.TString>;
      errors: Type.TArray<Type.TObject<{
        id: Type.TString;
        origin: Type.TString;
        activated: Type.TBoolean;
        activationSource: Type.TOptional<Type.TString>;
        activationReason: Type.TOptional<Type.TString>;
        failurePhase: Type.TOptional<Type.TString>;
        error: Type.TString;
      }>>;
      unavailable: Type.TOptional<Type.TArray<Type.TObject<{
        id: Type.TString;
        state: Type.TLiteral<"configured-unavailable">;
        diagnostic: Type.TObject<{
          kind: Type.TLiteral<"plugin-verification">;
          reason: Type.TString;
          detail: Type.TString;
        }>;
      }>>>;
    }>>;
    contextEngines: Type.TOptional<Type.TObject<{
      quarantined: Type.TArray<Type.TObject<{
        engineId: Type.TString;
        owner: Type.TOptional<Type.TString>;
        operation: Type.TString;
        reason: Type.TString;
        failedAt: Type.TInteger;
      }>>;
    }>>;
    deliveryQueues: Type.TOptional<Type.TObject<{
      failed: Type.TArray<Type.TObject<{
        queueName: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>;
      ingressFailed: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        count: Type.TInteger;
        oldestFailedAt: Type.TOptional<Type.TInteger>;
      }>>>;
      ingressPressure: Type.TOptional<Type.TArray<Type.TObject<{
        channelId: Type.TString;
        accountId: Type.TString;
        laneCount: Type.TInteger;
        pendingCount: Type.TInteger;
        claimedCount: Type.TInteger;
        blockedCount: Type.TInteger;
        oldestReceivedAt: Type.TInteger;
      }>>>;
    }>>;
    modelPricing: Type.TOptional<Type.TObject<{
      state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">, Type.TLiteral<"disabled">]>;
      sources: Type.TArray<Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"openrouter">, Type.TLiteral<"litellm">, Type.TLiteral<"bootstrap">, Type.TLiteral<"refresh">]>;
        state: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"degraded">]>;
        lastFailureAt: Type.TOptional<Type.TInteger>;
        detail: Type.TOptional<Type.TString>;
      }>>;
      lastFailureAt: Type.TOptional<Type.TInteger>;
      detail: Type.TOptional<Type.TString>;
    }>>;
    configReload: Type.TOptional<Type.TObject<{
      hotReloadStatus: Type.TUnion<[Type.TLiteral<"active">, Type.TLiteral<"disabled">]>;
    }>>;
    channels: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    channelOrder: Type.TOptional<Type.TArray<Type.TString>>;
    channelLabels: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
    heartbeatSeconds: Type.TOptional<Type.TInteger>;
    defaultAgentId: Type.TOptional<Type.TString>;
    agents: Type.TOptional<Type.TArray<Type.TObject<{
      agentId: Type.TString;
      name: Type.TOptional<Type.TString>;
      isDefault: Type.TBoolean;
      heartbeat: Type.TObject<{
        enabled: Type.TBoolean;
        every: Type.TString;
        everyMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        prompt: Type.TString;
        target: Type.TString;
        model: Type.TOptional<Type.TString>;
        session: Type.TOptional<Type.TString>;
        ackMaxChars: Type.TInteger;
      }>;
      sessions: Type.TObject<{
        path: Type.TString;
        count: Type.TInteger;
        recent: Type.TArray<Type.TObject<{
          key: Type.TString;
          updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
          age: Type.TUnion<[Type.TInteger, Type.TNull]>;
        }>>;
      }>;
    }>>>;
    sessions: Type.TOptional<Type.TObject<{
      path: Type.TString;
      count: Type.TInteger;
      recent: Type.TArray<Type.TObject<{
        key: Type.TString;
        updatedAt: Type.TUnion<[Type.TInteger, Type.TNull]>;
        age: Type.TUnion<[Type.TInteger, Type.TNull]>;
      }>>;
    }>>;
  }>;
  stateVersion: Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>;
  uptimeMs: Type.TInteger; /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    ownership: Type.TOptional<Type.TUnion<[Type.TLiteral<"sole">, Type.TLiteral<"legacy">, Type.TLiteral<"explicit">]>>;
    selectionRequired: Type.TOptional<Type.TBoolean>;
    mainKey: Type.TString;
    mainSessionKey: Type.TString;
    scope: Type.TOptional<Type.TString>;
  }>>;
  authMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"none">, Type.TLiteral<"token">, Type.TLiteral<"password">, Type.TLiteral<"trusted-proxy">]>>;
  updateAvailable: Type.TOptional<Type.TObject<{
    currentVersion: Type.TString;
    latestVersion: Type.TString;
    channel: Type.TString;
    currentSha: Type.TOptional<Type.TString>;
    upstreamRef: Type.TOptional<Type.TString>;
    upstreamSha: Type.TOptional<Type.TString>;
    commitsBehind: Type.TOptional<Type.TInteger>;
    commits: Type.TOptional<Type.TArray<Type.TObject<{
      sha: Type.TString;
      subject: Type.TString;
    }>>>;
  }>>;
  updateSchedule: Type.TOptional<Type.TObject<{
    channel: Type.TString;
    autoEnabled: Type.TBoolean;
    install: Type.TOptional<Type.TObject<{
      kind: Type.TUnion<[Type.TLiteral<"package">, Type.TLiteral<"git">, Type.TLiteral<"unknown">]>;
      git: Type.TOptional<Type.TUnion<[Type.TObject<{
        status: Type.TLiteral<"current">;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"behind">;
        commitsBehind: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"ahead">;
        commitsAhead: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"diverged">;
        commitsAhead: Type.TInteger;
        commitsBehind: Type.TInteger;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>, Type.TObject<{
        status: Type.TLiteral<"unavailable">;
        reason: Type.TUnion<[Type.TLiteral<"fetch-failed">, Type.TLiteral<"no-upstream">, Type.TLiteral<"no-upstream-sha">, Type.TLiteral<"comparison-failed">, Type.TLiteral<"git-unavailable">]>;
        currentSha: Type.TOptional<Type.TString>;
        commitAtMs: Type.TOptional<Type.TInteger>;
        installedAtMs: Type.TOptional<Type.TInteger>;
      }>]>>;
    }>>;
    target: Type.TOptional<Type.TUnion<[Type.TObject<{
      kind: Type.TLiteral<"package">;
      version: Type.TString;
    }>, Type.TObject<{
      kind: Type.TLiteral<"git">;
      upstreamRef: Type.TString;
      upstreamSha: Type.TString;
      commitsBehind: Type.TInteger;
    }>]>>;
    campaign: Type.TOptional<Type.TObject<{
      id: Type.TString;
      state: Type.TUnion<[Type.TLiteral<"waiting-for-idle">, Type.TLiteral<"countdown">, Type.TLiteral<"applying">]>;
      announcedAtMs: Type.TInteger;
      applyAtMs: Type.TOptional<Type.TInteger>;
      holdUntilMs: Type.TOptional<Type.TInteger>;
      forceAtMs: Type.TInteger;
      updatedAtMs: Type.TInteger;
    }>>;
  }>>;
}>;
type Snapshot = Static<typeof SnapshotSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/portals.d.ts
declare const PortalSummarySchema: Type.TObject<{
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TOptional<Type.TString>;
  url: Type.TOptional<Type.TString>;
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
}>;
declare const PortalOpenResultSchema: Type.TObject<{
  publicUrl: Type.TString;
  path: Type.TOptional<Type.TString>;
  description: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  tokenQuery: Type.TString;
  url: Type.TString;
  id: Type.TString;
  title: Type.TString;
  port: Type.TInteger;
  listenPort: Type.TInteger;
}>;
type PortalSummary = Static<typeof PortalSummarySchema>;
type PortalOpenResult = Static<typeof PortalOpenResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/wizard.d.ts
/** Client answer payload for the current wizard step. */
declare const WizardAnswerSchema: Type.TObject<{
  stepId: Type.TString;
  value: Type.TOptional<Type.TUnknown>;
}>;
/** UI contract for one wizard step rendered by gateway clients. */
declare const WizardStepSchema: Type.TObject<{
  id: Type.TString;
  type: Type.TUnion<[Type.TLiteral<"note">, Type.TLiteral<"select">, Type.TLiteral<"text">, Type.TLiteral<"confirm">, Type.TLiteral<"multiselect">, Type.TLiteral<"progress">, Type.TLiteral<"action">]>;
  title: Type.TOptional<Type.TString>;
  message: Type.TOptional<Type.TString>;
  format: Type.TOptional<Type.TUnion<[Type.TLiteral<"plain">]>>;
  options: Type.TOptional<Type.TArray<Type.TObject<{
    value: Type.TUnknown;
    label: Type.TString;
    hint: Type.TOptional<Type.TString>;
  }>>>;
  initialValue: Type.TOptional<Type.TUnknown>;
  placeholder: Type.TOptional<Type.TString>;
  sensitive: Type.TOptional<Type.TBoolean>;
  executor: Type.TOptional<Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"client">]>>;
  externalUrl: Type.TOptional<Type.TString>;
  deviceCode: Type.TOptional<Type.TObject<{
    code: Type.TString;
    expiresInMinutes: Type.TOptional<Type.TInteger>;
    message: Type.TOptional<Type.TString>;
  }>>;
}>;
type WizardAnswer = Static<typeof WizardAnswerSchema>;
type WizardStep = Static<typeof WizardStepSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
/** Build identity presented by a worker before the gateway admits it. */
declare const WorkerAdmissionHandshakeSchema: Type.TObject<{
  bundleHash: Type.TString;
  openclawVersion: Type.TString;
  protocolFeatures: Type.TArray<Type.TString>;
}>;
/** Dedicated first-frame payload accepted only on the worker ingress. */
declare const WorkerConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TLiteral<"openclaw-worker">;
    version: Type.TString;
    platform: Type.TString;
    mode: Type.TLiteral<"worker">;
  }>;
  role: Type.TLiteral<"worker">;
  admission: Type.TUnion<[Type.TObject<{
    sessionId: Type.TNull;
    runId: Type.TNull;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>, Type.TObject<{
    sessionId: Type.TString;
    runId: Type.TString;
    environmentId: Type.TString;
    credential: Type.TString;
    ownerEpoch: Type.TInteger;
    rpcSetVersion: Type.TInteger;
    handshake: Type.TObject<{
      bundleHash: Type.TString;
      openclawVersion: Type.TString;
      protocolFeatures: Type.TArray<Type.TString>;
    }>;
  }>]>;
}>;
declare const WorkerTranscriptMessageSchema: Type.TUnion<[Type.TObject<{
  role: Type.TLiteral<"user">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"assistant">;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"thinking">;
    thinking: Type.TString;
    thinkingSignature: Type.TOptional<Type.TString>;
    redacted: Type.TOptional<Type.TBoolean>;
  }>, Type.TObject<{
    type: Type.TLiteral<"toolCall">;
    id: Type.TString;
    name: Type.TString;
    arguments: Type.TRecord<"^.*$", Type.TUnknown>;
    thoughtSignature: Type.TOptional<Type.TString>;
    executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
  }>]>>;
  api: Type.TString;
  provider: Type.TString;
  model: Type.TString;
  responseModel: Type.TOptional<Type.TString>;
  responseId: Type.TOptional<Type.TString>;
  providerReplay: Type.TOptional<Type.TObject<{
    v: Type.TLiteral<1>;
    type: Type.TString;
    id: Type.TOptional<Type.TString>;
    data: Type.TString;
    replayIndex: Type.TOptional<Type.TInteger>;
    provider: Type.TString;
    api: Type.TString;
    model: Type.TString;
    baseUrlHash: Type.TOptional<Type.TString>;
    sessionHash: Type.TOptional<Type.TString>;
    authProfileHash: Type.TOptional<Type.TString>;
  }>>;
  diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TString;
    timestamp: Type.TInteger;
    error: Type.TOptional<Type.TObject<{
      name: Type.TOptional<Type.TString>;
      message: Type.TString;
      stack: Type.TOptional<Type.TString>;
      code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
    }>>;
    details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
  }>>>;
  usage: Type.TObject<{
    input: Type.TNumber;
    output: Type.TNumber;
    cacheRead: Type.TNumber;
    cacheWrite: Type.TNumber;
    contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
      state: Type.TLiteral<"available">;
      promptTokens: Type.TNumber;
      totalTokens: Type.TNumber;
    }>, Type.TObject<{
      state: Type.TLiteral<"unavailable">;
    }>]>>;
    totalTokens: Type.TNumber;
    cost: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      total: Type.TNumber;
      totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
    }>;
  }>;
  stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
  errorMessage: Type.TOptional<Type.TString>;
  errorCode: Type.TOptional<Type.TString>;
  errorType: Type.TOptional<Type.TString>;
  errorBody: Type.TOptional<Type.TString>;
  timestamp: Type.TInteger;
}>, Type.TObject<{
  role: Type.TLiteral<"toolResult">;
  toolCallId: Type.TString;
  toolName: Type.TString;
  content: Type.TArray<Type.TUnion<[Type.TObject<{
    type: Type.TLiteral<"text">;
    text: Type.TString;
    textSignature: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    type: Type.TLiteral<"image">;
    data: Type.TString;
    mimeType: Type.TString;
  }>]>>;
  details: Type.TOptional<Type.TUnknown>;
  isError: Type.TBoolean;
  timestamp: Type.TInteger;
}>]>;
declare const WorkerTranscriptCommitParamsSchema: Type.TObject<{
  runEpoch: Type.TInteger;
  seq: Type.TInteger;
  baseLeafId: Type.TUnion<[Type.TString, Type.TNull]>;
  messages: Type.TArray<Type.TUnion<[Type.TObject<{
    role: Type.TLiteral<"user">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"assistant">;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"thinking">;
      thinking: Type.TString;
      thinkingSignature: Type.TOptional<Type.TString>;
      redacted: Type.TOptional<Type.TBoolean>;
    }>, Type.TObject<{
      type: Type.TLiteral<"toolCall">;
      id: Type.TString;
      name: Type.TString;
      arguments: Type.TRecord<"^.*$", Type.TUnknown>;
      thoughtSignature: Type.TOptional<Type.TString>;
      executionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"sequential">, Type.TLiteral<"parallel">]>>;
    }>]>>;
    api: Type.TString;
    provider: Type.TString;
    model: Type.TString;
    responseModel: Type.TOptional<Type.TString>;
    responseId: Type.TOptional<Type.TString>;
    providerReplay: Type.TOptional<Type.TObject<{
      v: Type.TLiteral<1>;
      type: Type.TString;
      id: Type.TOptional<Type.TString>;
      data: Type.TString;
      replayIndex: Type.TOptional<Type.TInteger>;
      provider: Type.TString;
      api: Type.TString;
      model: Type.TString;
      baseUrlHash: Type.TOptional<Type.TString>;
      sessionHash: Type.TOptional<Type.TString>;
      authProfileHash: Type.TOptional<Type.TString>;
    }>>;
    diagnostics: Type.TOptional<Type.TArray<Type.TObject<{
      type: Type.TString;
      timestamp: Type.TInteger;
      error: Type.TOptional<Type.TObject<{
        name: Type.TOptional<Type.TString>;
        message: Type.TString;
        stack: Type.TOptional<Type.TString>;
        code: Type.TOptional<Type.TUnion<[Type.TString, Type.TNumber]>>;
      }>>;
      details: Type.TOptional<Type.TRecord<"^.*$", Type.TUnknown>>;
    }>>>;
    usage: Type.TObject<{
      input: Type.TNumber;
      output: Type.TNumber;
      cacheRead: Type.TNumber;
      cacheWrite: Type.TNumber;
      contextUsage: Type.TOptional<Type.TUnion<[Type.TObject<{
        state: Type.TLiteral<"available">;
        promptTokens: Type.TNumber;
        totalTokens: Type.TNumber;
      }>, Type.TObject<{
        state: Type.TLiteral<"unavailable">;
      }>]>>;
      totalTokens: Type.TNumber;
      cost: Type.TObject<{
        input: Type.TNumber;
        output: Type.TNumber;
        cacheRead: Type.TNumber;
        cacheWrite: Type.TNumber;
        total: Type.TNumber;
        totalOrigin: Type.TOptional<Type.TLiteral<"provider-billed">>;
      }>;
    }>;
    stopReason: Type.TUnion<[Type.TLiteral<"stop">, Type.TLiteral<"length">, Type.TLiteral<"toolUse">, Type.TLiteral<"error">, Type.TLiteral<"aborted">]>;
    errorMessage: Type.TOptional<Type.TString>;
    errorCode: Type.TOptional<Type.TString>;
    errorType: Type.TOptional<Type.TString>;
    errorBody: Type.TOptional<Type.TString>;
    timestamp: Type.TInteger;
  }>, Type.TObject<{
    role: Type.TLiteral<"toolResult">;
    toolCallId: Type.TString;
    toolName: Type.TString;
    content: Type.TArray<Type.TUnion<[Type.TObject<{
      type: Type.TLiteral<"text">;
      text: Type.TString;
      textSignature: Type.TOptional<Type.TString>;
    }>, Type.TObject<{
      type: Type.TLiteral<"image">;
      data: Type.TString;
      mimeType: Type.TString;
    }>]>>;
    details: Type.TOptional<Type.TUnknown>;
    isError: Type.TBoolean;
    timestamp: Type.TInteger;
  }>]>>;
}>;
type WorkerAdmissionHandshake = Static<typeof WorkerAdmissionHandshakeSchema>;
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerTranscriptMessage = Static<typeof WorkerTranscriptMessageSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
//#endregion
export { SessionApprovalReplay as A, SessionsCatalogReadResult as C, WorkerInferenceModelRef as D, RequestFrame as E, WorkerInferenceOptions as O, SessionsCatalogReadParams as S, ErrorShape as T, AgentsListResult as _, WizardAnswer as a, SessionsCatalogArchiveParams as b, PortalSummary as c, NodePluginToolDescriptor as d, NodeSkillDescriptor as f, SystemAgentWizardCancel as g, SystemAgentChatQuestion as h, WorkerTranscriptMessage as i, ApprovalPresentation as k, Snapshot as l, WorkerEnvironmentState as m, WorkerConnectParams as n, WizardStep as o, ScopeUpgradeResult as p, WorkerTranscriptCommitParams as r, PortalOpenResult as s, WorkerAdmissionHandshake as t, SessionPlacementDiskSpace as u, AgentWaitParams as v, ConnectParams as w, SessionsCatalogContinueParams as x, SessionCatalogHost as y };