import "./types.openclaw-BssW6c46.js";
import "./approvals-Xlp2ut16.js";
import { Static, TSchema, Type } from "typebox";
//#region packages/gateway-protocol/src/schema/sessions-row.d.ts
declare const SessionPermissionModeSchema: Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>;
/** Stable Gateway session row fields; mutation envelopes may add null tombstones. */
declare const SessionRowSchema: Type.TObject<{
  key: Type.TString;
  sessionId: Type.TOptional<Type.TString>;
  incognito: Type.TOptional<Type.TLiteral<true>>;
  kind: Type.TUnion<[Type.TLiteral<"direct">, Type.TLiteral<"group">, Type.TLiteral<"global">, Type.TLiteral<"unknown">]>;
  label: Type.TOptional<Type.TString>;
  icon: Type.TOptional<Type.TString>;
  channelAvatarUrl: Type.TOptional<Type.TString>;
  boardFace: Type.TOptional<Type.TUnion<[Type.TLiteral<"chat">, Type.TLiteral<"dashboard">]>>;
  displayName: Type.TOptional<Type.TString>;
  derivedTitle: Type.TOptional<Type.TString>;
  lastMessagePreview: Type.TOptional<Type.TString>;
  channel: Type.TOptional<Type.TString>;
  /** Stable non-sensitive facts derived from the canonical session route. */
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
    label: Type.TOptional<Type.TString>;
    /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  pinned: Type.TOptional<Type.TBoolean>;
  pinnedAt: Type.TOptional<Type.TNumber>;
  unread: Type.TOptional<Type.TBoolean>;
  lastReadAt: Type.TOptional<Type.TNumber>;
  markedUnreadAt: Type.TOptional<Type.TNumber>;
  lastActivityAt: Type.TOptional<Type.TNumber>;
  lastInteractionAt: Type.TOptional<Type.TNumber>;
  status: Type.TOptional<Type.TUnion<[Type.TLiteral<"queued">, Type.TLiteral<"running">, Type.TLiteral<"done">, Type.TLiteral<"failed">, Type.TLiteral<"killed">, Type.TLiteral<"timeout">]>>;
  lastRunError: Type.TOptional<Type.TString>;
  /** Exact run that produced the latest terminal lifecycle projection. */
  lastRunId: Type.TOptional<Type.TString>;
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
  permissionMode: Type.TOptional<Type.TUnion<[Type.TLiteral<"read-only">, Type.TLiteral<"guarded">, Type.TLiteral<"workspace">, Type.TLiteral<"full">]>>;
  sessionRoot: Type.TOptional<Type.TString>;
  createdVia: Type.TOptional<Type.TUnion<[Type.TLiteral<"operator">, Type.TLiteral<"spawn">, Type.TLiteral<"channel">, Type.TLiteral<"cron">, Type.TLiteral<"talk">, Type.TLiteral<"run">, Type.TLiteral<"plugin">, Type.TLiteral<"internal">]>>;
  createdActor: Type.TOptional<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
  }>>;
  owner: Type.TOptional<Type.TObject<{
    actor: Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      /** Durable profile avatar route; absent for actors without a stored profile avatar. */
      avatarUrl: Type.TOptional<Type.TString>;
    }>;
    assignedBy: Type.TOptional<Type.TObject<{
      type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
      id: Type.TOptional<Type.TString>;
      label: Type.TOptional<Type.TString>;
      /** Durable profile avatar route; absent for actors without a stored profile avatar. */
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    assignedAt: Type.TOptional<Type.TNumber>;
  }>>;
  participants: Type.TOptional<Type.TArray<Type.TObject<{
    type: Type.TUnion<[Type.TLiteral<"human">, Type.TLiteral<"agent">, Type.TLiteral<"system">]>;
    id: Type.TOptional<Type.TString>;
    label: Type.TOptional<Type.TString>;
    /** Durable profile avatar route; absent for actors without a stored profile avatar. */
    avatarUrl: Type.TOptional<Type.TString>;
  }>>>;
  participantCount: Type.TOptional<Type.TInteger>;
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
  /** Persisted override provenance; null means inherited, omission means not projected. */
  modelOverrideSource: Type.TOptional<Type.TUnion<[Type.TLiteral<"user">, Type.TLiteral<"auto">, Type.TNull]>>;
  toolOverrides: Type.TOptional<Type.TObject<{
    mcpServers: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    mcpToolsDeny: Type.TOptional<Type.TRecord<"^.*$", Type.TArray<Type.TString>>>;
    skills: Type.TOptional<Type.TRecord<"^.*$", Type.TBoolean>>;
    webSearch: Type.TOptional<Type.TBoolean>;
  }>>;
}>;
type SessionPermissionMode = Static<typeof SessionPermissionModeSchema>;
type SessionRow = Static<typeof SessionRowSchema>;
type SessionRunStatus = NonNullable<SessionRow["status"]>;
//#endregion
//#region packages/gateway-protocol/src/schema/frames.d.ts
/** Initial client hello/connect payload sent before the gateway accepts frames. */
declare const ConnectParamsSchema: Type.TObject<{
  minProtocol: Type.TInteger;
  maxProtocol: Type.TInteger;
  client: Type.TObject<{
    id: Type.TEnum<["webchat-ui", "openclaw-control-ui", "openclaw-browser-copilot", "openclaw-tui", "webchat", "cli", "gateway-client", "openclaw-macos", "openclaw-linux", "openclaw-ios", "openclaw-watchos", "openclaw-android", "node-host", "openclaw-worker", "test", "fingerprint", "openclaw-probe"]>;
    displayName: Type.TOptional<Type.TString>;
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    platform: Type.TString;
    deviceFamily: Type.TOptional<Type.TString>;
    modelIdentifier: Type.TOptional<Type.TString>;
    /** Self-reported IANA zone. Bounded because the longest real name is well under this cap. */
    timeZone: Type.TOptional<Type.TString>;
    mode: Type.TEnum<["webchat", "cli", "worker", "test", "probe", "ui", "backend", "node"]>;
    instanceId: Type.TOptional<Type.TString>;
  }>;
  caps: Type.TOptional<Type.TArray<Type.TString>>;
  commands: Type.TOptional<Type.TArray<Type.TString>>;
  /** Additive Computer Use declaration; the owning core contract validates its bounded shape. */
  computerUse: Type.TOptional<Type.TUnknown>;
  /** @deprecated Accepted for the shipped v1 node-host envelope; current hosts use runner inventory. */
  workerRuns: Type.TOptional<Type.TObject<{
    bundleHash: Type.TString;
    openclawVersion: Type.TString;
    protocolFeatures: Type.TArray<Type.TString>;
    bundlePrewarm: Type.TOptional<Type.TInteger>;
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
/** Successful gateway hello response with the server protocol and initial state. */
declare const HelloOkSchema: Type.TObject<{
  type: Type.TLiteral<"hello-ok">;
  protocol: Type.TInteger;
  server: Type.TObject<{
    version: Type.TString;
    buildId: Type.TOptional<Type.TString>;
    bootId: Type.TOptional<Type.TString>;
    controlUiBuildSource: Type.TOptional<Type.TUnion<[Type.TLiteral<"bundled">, Type.TLiteral<"configured">]>>;
    connId: Type.TString;
  }>;
  features: Type.TObject<{
    methods: Type.TArray<Type.TString>;
    events: Type.TArray<Type.TString>;
    capabilities: Type.TOptional<Type.TArray<Type.TString>>;
  }>;
  snapshot: Type.TObject<{
    presence: Type.TArray<Type.TObject<{
      host: Type.TOptional<Type.TString>;
      ip: Type.TOptional<Type.TString>;
      version: Type.TOptional<Type.TString>;
      platform: Type.TOptional<Type.TString>;
      deviceFamily: Type.TOptional<Type.TString>;
      modelIdentifier: Type.TOptional<Type.TString>;
      timeZone: Type.TOptional<Type.TString>;
      mode: Type.TOptional<Type.TString>;
      lastInputSeconds: Type.TOptional<Type.TInteger>;
      reason: Type.TOptional<Type.TString>;
      tags: Type.TOptional<Type.TArray<Type.TString>>;
      text: Type.TOptional<Type.TString>;
      ts: Type.TInteger;
      onlineSince: Type.TOptional<Type.TInteger>;
      lastActivityAt: Type.TOptional<Type.TInteger>;
      deviceId: Type.TOptional<Type.TString>;
      roles: Type.TOptional<Type.TArray<Type.TString>>;
      scopes: Type.TOptional<Type.TArray<Type.TString>>;
      instanceId: Type.TOptional<Type.TString>;
      user: Type.TOptional<Type.TObject<{
        id: Type.TString;
        email: Type.TOptional<Type.TString>;
        name: Type.TOptional<Type.TString>;
        avatarUrl: Type.TOptional<Type.TString>;
      }>>;
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
    uptimeMs: Type.TInteger;
    appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
    configPath: Type.TOptional<Type.TString>;
    stateDir: Type.TOptional<Type.TString>;
    sessionDefaults: Type.TOptional<Type.TObject<{
      defaultAgentId: Type.TString;
      modelConfigured: Type.TOptional<Type.TBoolean>;
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
  controlUiTabs: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    id: Type.TString;
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
    icon: Type.TOptional<Type.TString>;
    path: Type.TOptional<Type.TString>;
    placement: Type.TOptional<Type.TString>;
    requiresGatewayAuth: Type.TOptional<Type.TBoolean>;
    group: Type.TOptional<Type.TUnion<[Type.TLiteral<"control">, Type.TLiteral<"agent">]>>;
    order: Type.TOptional<Type.TNumber>;
  }>>>;
  controlUiWidgetKinds: Type.TOptional<Type.TArray<Type.TObject<{
    pluginId: Type.TString;
    kind: Type.TString;
    label: Type.TString;
  }>>>;
  pluginSurfaceUrls: Type.TOptional<Type.TRecord<"^.*$", Type.TString>>;
  auth: Type.TObject<{
    deviceToken: Type.TOptional<Type.TString>;
    recoveryMigrationAllowed: Type.TOptional<Type.TLiteral<true>>;
    recoveryScope: Type.TOptional<Type.TString>;
    role: Type.TString;
    scopes: Type.TArray<Type.TString>;
    issuedAtMs: Type.TOptional<Type.TInteger>;
    deviceTokens: Type.TOptional<Type.TArray<Type.TObject<{
      deviceToken: Type.TString;
      role: Type.TString;
      scopes: Type.TArray<Type.TString>;
      issuedAtMs: Type.TInteger;
    }>>>;
  }>;
  policy: Type.TObject<{
    maxPayload: Type.TInteger;
    maxBufferedBytes: Type.TInteger;
    tickIntervalMs: Type.TInteger;
    attachments: Type.TOptional<Type.TObject<{
      maxBytes: Type.TInteger;
      maxImageBytes: Type.TInteger;
    }>>;
    allowedSessionVisibilities: Type.TOptional<Type.TArray<Type.TUnion<[Type.TLiteral<"shared">, Type.TLiteral<"read-only">, Type.TLiteral<"suggest">, Type.TLiteral<"draft">]>>>;
    hasMultipleSessionSharingIdentities: Type.TOptional<Type.TBoolean>;
  }>;
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
/** Server event frame envelope; `event` selects the payload validator. */
declare const EventFrameSchema: Type.TObject<{
  type: Type.TLiteral<"event">;
  event: Type.TString;
  payload: Type.TOptional<Type.TUnknown>;
  seq: Type.TOptional<Type.TInteger>;
  stateVersion: Type.TOptional<Type.TObject<{
    presence: Type.TInteger;
    health: Type.TInteger;
  }>>;
}>;
type ConnectParams = Static<typeof ConnectParamsSchema>;
type HelloOk = Static<typeof HelloOkSchema>;
type ErrorShape = Static<typeof ErrorShapeSchema>;
type RequestFrame = Static<typeof RequestFrameSchema>;
type EventFrame = Static<typeof EventFrameSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-github-publication.d.ts
declare const SessionGitHubPublishParamsSchema: Type.TObject<{
  sessionKey: Type.TOptional<Type.TString>;
  idempotencyKey: Type.TString;
  title: Type.TOptional<Type.TString>;
  body: Type.TOptional<Type.TString>;
}>;
declare const SessionGitHubPublicationResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"requested">;
  message: Type.TString;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"publishing">;
  message: Type.TString;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"published">;
  url: Type.TString;
  repository: Type.TString;
  branch: Type.TString;
  headCommit: Type.TString;
  requestId: Type.TString;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  code: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"identity_unavailable">, Type.TLiteral<"session_changed">, Type.TLiteral<"workspace_changed">, Type.TLiteral<"not_git">, Type.TLiteral<"not_github">, Type.TLiteral<"no_changes">, Type.TLiteral<"push_rejected">, Type.TLiteral<"github_rejected">, Type.TLiteral<"unavailable">]>;
  message: Type.TString;
  nextAction: Type.TString;
  requestId: Type.TString;
}>]>;
type SessionGitHubPublishParams = Static<typeof SessionGitHubPublishParamsSchema>;
type SessionGitHubPublicationResult = Static<typeof SessionGitHubPublicationResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/worker-admission.d.ts
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
      bundlePrewarm: Type.TOptional<Type.TInteger>;
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
      bundlePrewarm: Type.TOptional<Type.TInteger>;
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
type WorkerConnectParams = Static<typeof WorkerConnectParamsSchema>;
type WorkerTranscriptMessage = Static<typeof WorkerTranscriptMessageSchema>;
type WorkerTranscriptCommitParams = Static<typeof WorkerTranscriptCommitParamsSchema>;
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
//#region packages/gateway-protocol/src/schema/sessions-catalog.d.ts
declare const SessionCatalogHostSchema: Type.TObject<{
  hostId: Type.TString;
  label: Type.TString;
  kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"node">]>;
  connected: Type.TBoolean;
  nodeId: Type.TOptional<Type.TString>;
  sessions: Type.TArray<Type.TObject<{
    threadId: Type.TString;
    sourceHomeId: Type.TOptional<Type.TString>;
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
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
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
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
}>;
declare const SessionsCatalogArchiveParamsSchema: Type.TObject<{
  confirmNoOtherRunner: Type.TLiteral<true>;
  catalogId: Type.TString;
  hostId: Type.TString;
  threadId: Type.TString;
  agentId: Type.TOptional<Type.TString>;
  sourceHomeId: Type.TOptional<Type.TString>;
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
declare const ToolsGitHubAuthorizeStartResultSchema: Type.TObject<{
  requestId: Type.TString;
  userCode: Type.TString;
  verificationUri: Type.TLiteral<"https://github.com/login/device">;
  expiresInMs: Type.TInteger;
  pollAfterMs: Type.TInteger;
}>;
declare const ToolsGitHubAuthorizePollResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"slow_down">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"access_denied">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>, Type.TObject<{
  status: Type.TLiteral<"incorrect_device_code">;
}>, Type.TObject<{
  status: Type.TLiteral<"network_error">;
  retryAfterMs: Type.TInteger;
}>, Type.TObject<{
  status: Type.TLiteral<"failed">;
  reason: Type.TUnion<[Type.TLiteral<"identity_changed">, Type.TLiteral<"setup_failed">]>;
}>, Type.TObject<{
  status: Type.TLiteral<"success">;
  githubStatus: Type.TObject<{
    agentId: Type.TString;
    selectedScope: Type.TUnion<[Type.TLiteral<"system">, Type.TLiteral<"agent">]>;
    selected: Type.TObject<{
      scope: Type.TUnion<[Type.TLiteral<"system">, Type.TLiteral<"agent">]>;
      configured: Type.TBoolean;
      identity: Type.TUnion<[Type.TObject<{
        source: Type.TUnion<[Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
        credentialKind: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"managed-pat">, Type.TLiteral<"managed-oauth">]>;
        credentialState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"unavailable">, Type.TLiteral<"configured_unavailable">, Type.TLiteral<"unverified">, Type.TLiteral<"rate_limited">]>;
        account: Type.TUnion<[Type.TObject<{
          login: Type.TString;
        }>, Type.TNull]>;
        gitAuthor: Type.TObject<{
          name: Type.TUnion<[Type.TString, Type.TNull]>;
          email: Type.TUnion<[Type.TString, Type.TNull]>;
        }>;
        evidence: Type.TUnion<[Type.TLiteral<"github-api">, Type.TLiteral<"none">, Type.TLiteral<"unverified">, Type.TLiteral<"rate-limited">]>;
        accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
        refreshState: Type.TUnion<[Type.TLiteral<"not_applicable">, Type.TLiteral<"available">, Type.TLiteral<"expired">, Type.TLiteral<"unavailable">, Type.TLiteral<"refreshing">, Type.TLiteral<"failed">]>;
        oauthScopes: Type.TArray<Type.TString>;
        repositoryGrants: Type.TLiteral<"unknown">;
      }>, Type.TNull]>;
    }>;
    effective: Type.TObject<{
      source: Type.TUnion<[Type.TLiteral<"system-detected">, Type.TLiteral<"system-configured">, Type.TLiteral<"agent-override">]>;
      credentialKind: Type.TUnion<[Type.TLiteral<"native">, Type.TLiteral<"managed-pat">, Type.TLiteral<"managed-oauth">]>;
      credentialState: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"unavailable">, Type.TLiteral<"configured_unavailable">, Type.TLiteral<"unverified">, Type.TLiteral<"rate_limited">]>;
      account: Type.TUnion<[Type.TObject<{
        login: Type.TString;
      }>, Type.TNull]>;
      gitAuthor: Type.TObject<{
        name: Type.TUnion<[Type.TString, Type.TNull]>;
        email: Type.TUnion<[Type.TString, Type.TNull]>;
      }>;
      evidence: Type.TUnion<[Type.TLiteral<"github-api">, Type.TLiteral<"none">, Type.TLiteral<"unverified">, Type.TLiteral<"rate-limited">]>;
      accessExpiresAtMs: Type.TUnion<[Type.TInteger, Type.TNull]>;
      refreshState: Type.TUnion<[Type.TLiteral<"not_applicable">, Type.TLiteral<"available">, Type.TLiteral<"expired">, Type.TLiteral<"unavailable">, Type.TLiteral<"refreshing">, Type.TLiteral<"failed">]>;
      oauthScopes: Type.TArray<Type.TString>;
      repositoryGrants: Type.TLiteral<"unknown">;
    }>;
  }>;
}>]>;
type ToolsGitHubAuthorizeStartResult = Static<typeof ToolsGitHubAuthorizeStartResultSchema>;
type ToolsGitHubAuthorizePollResult = Static<typeof ToolsGitHubAuthorizePollResultSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/openclaw.d.ts
declare const SystemAgentWizardCancelSchema: Type.TObject<{
  /** The visible step this action belongs to; stale controls must not affect a newer step. */
  stepId: Type.TString;
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
    recommended: Type.TOptional<Type.TBoolean>;
    /** Message text a client sends when this option is chosen; defaults to label. */
    reply: Type.TOptional<Type.TString>;
  }>>;
  /** Free-text answers are also accepted for this question. */
  isOther: Type.TOptional<Type.TBoolean>;
  /** Client-owned action for the visible skip control; omitted means send a reply. */
  skipAction: Type.TOptional<Type.TLiteral<"exit">>;
}>;
type SystemAgentWizardCancel = Static<typeof SystemAgentWizardCancelSchema>;
type SystemAgentChatQuestion = Static<typeof SystemAgentChatQuestionSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/environments.d.ts
/** Durable lifecycle states for plugin-provisioned worker environments. */
declare const WorkerEnvironmentStateSchema: Type.TUnion<[Type.TLiteral<"requested">, Type.TLiteral<"provisioning">, Type.TLiteral<"bootstrapping">, Type.TLiteral<"ready">, Type.TLiteral<"attached">, Type.TLiteral<"idle">, Type.TLiteral<"draining">, Type.TLiteral<"destroying">, Type.TLiteral<"destroyed">, Type.TLiteral<"failed">, Type.TLiteral<"orphaned">]>;
/** Process-local SSH tunnel connectivity for a worker environment. */
declare const WorkerTunnelStatusSchema: Type.TUnion<[Type.TLiteral<"stopped">, Type.TLiteral<"connecting">, Type.TLiteral<"connected">, Type.TLiteral<"reconnecting">]>;
type WorkerEnvironmentState = Static<typeof WorkerEnvironmentStateSchema>;
type WorkerTunnelStatus = Static<typeof WorkerTunnelStatusSchema>;
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
//#region packages/gateway-protocol/src/schema/questions.d.ts
/** Canonical normalized question shown to an operator. */
declare const QuestionSchema: Type.TObject<{
  secretStoreExisting: Type.TOptional<Type.TObject<{
    updatedAtMs: Type.TInteger;
    updatedBy: Type.TOptional<Type.TString>;
  }>>;
  questionId: Type.TString;
  header: Type.TString;
  question: Type.TString;
  options: Type.TArray<Type.TObject<{
    label: Type.TString;
    description: Type.TOptional<Type.TString>;
  }>>;
  multiSelect: Type.TOptional<Type.TBoolean>;
  isOther: Type.TOptional<Type.TBoolean>;
  isSecret: Type.TOptional<Type.TBoolean>;
  secretStore: Type.TOptional<Type.TObject<{
    name: Type.TString;
    kind: Type.TUnion<[Type.TLiteral<"secret">, Type.TLiteral<"env">]>;
    allowedHosts: Type.TOptional<Type.TArray<Type.TString>>;
    reason: Type.TOptional<Type.TString>;
  }>>;
}>;
declare const QuestionAnswersSchema: Type.TObject<{
  answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
}>;
/**
 * One pending or recently resolved transient question request. Flat object with
 * optional terminal fields (exec-approval record precedent): native protocol
 * codegen cannot emit per-status object unions, and the manager owns the
 * status/answers invariant (answers present only when status is "answered").
 */
declare const QuestionRecordSchema: Type.TObject<{
  id: Type.TString;
  questions: Type.TArray<Type.TObject<{
    secretStoreExisting: Type.TOptional<Type.TObject<{
      updatedAtMs: Type.TInteger;
      updatedBy: Type.TOptional<Type.TString>;
    }>>;
    questionId: Type.TString;
    header: Type.TString;
    question: Type.TString;
    options: Type.TArray<Type.TObject<{
      label: Type.TString;
      description: Type.TOptional<Type.TString>;
    }>>;
    multiSelect: Type.TOptional<Type.TBoolean>;
    isOther: Type.TOptional<Type.TBoolean>;
    isSecret: Type.TOptional<Type.TBoolean>;
    secretStore: Type.TOptional<Type.TObject<{
      name: Type.TString;
      kind: Type.TUnion<[Type.TLiteral<"secret">, Type.TLiteral<"env">]>;
      allowedHosts: Type.TOptional<Type.TArray<Type.TString>>;
      reason: Type.TOptional<Type.TString>;
    }>>;
  }>>;
  agentId: Type.TOptional<Type.TString>;
  sessionKey: Type.TOptional<Type.TString>;
  runId: Type.TOptional<Type.TString>;
  createdAtMs: Type.TInteger;
  expiresAtMs: Type.TInteger;
  status: Type.TUnion<[Type.TLiteral<"pending">, Type.TLiteral<"answered">, Type.TLiteral<"cancelled">, Type.TLiteral<"expired">]>;
  answers: Type.TOptional<Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>>;
  resolvedBy: Type.TOptional<Type.TString>;
}>;
declare const QuestionWaitAnswerResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"pending">;
}>, Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  status: Type.TLiteral<"expired">;
}>]>;
declare const QuestionResolveResultSchema: Type.TUnion<[Type.TObject<{
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  status: Type.TLiteral<"cancelled">;
}>]>;
declare const QuestionResolvedEventSchema: Type.TUnion<[Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"answered">;
  answers: Type.TObject<{
    answers: Type.TRecord<"^.*$", Type.TArray<Type.TString>>;
  }>;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"cancelled">;
}>, Type.TObject<{
  id: Type.TString;
  status: Type.TLiteral<"expired">;
}>]>;
type Question = Static<typeof QuestionSchema>;
type QuestionAnswers = Static<typeof QuestionAnswersSchema>;
type QuestionRecord = Static<typeof QuestionRecordSchema>;
type QuestionWaitAnswerResult = Static<typeof QuestionWaitAnswerResultSchema>;
type QuestionResolveResult = Static<typeof QuestionResolveResultSchema>;
type QuestionResolvedEvent = Static<typeof QuestionResolvedEventSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/session-placement.d.ts
declare const SessionPlacementDiskSpaceSchema: Type.TObject<{
  status: Type.TUnion<[Type.TLiteral<"ok">, Type.TLiteral<"warning">, Type.TLiteral<"critical">]>;
  availableBytes: Type.TInteger;
  totalBytes: Type.TInteger;
  observedAtMs: Type.TInteger;
}>;
declare const SessionPlacementRunnerSchema: Type.TObject<{
  kind: Type.TLiteral<"device">;
  status: Type.TUnion<[Type.TLiteral<"available">, Type.TLiteral<"offline">]>;
  deviceId: Type.TOptional<Type.TString>;
}>;
/** Closed destination union for session placement moves. */
declare const SessionMoveTargetSchema: Type.TUnion<[Type.TObject<{
  kind: Type.TLiteral<"gateway">;
}>, Type.TObject<{
  kind: Type.TLiteral<"profile">;
  profileId: Type.TString;
  machineClass: Type.TOptional<Type.TString>;
}>, Type.TObject<{
  kind: Type.TLiteral<"device">;
  deviceId: Type.TString;
}>]>;
type SessionPlacementDiskSpace = Static<typeof SessionPlacementDiskSpaceSchema>;
type SessionPlacementRunner = Static<typeof SessionPlacementRunnerSchema>;
type SessionMoveTarget = Static<typeof SessionMoveTargetSchema>;
//#endregion
//#region packages/gateway-protocol/src/schema/sessions.d.ts
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
/** Companion answer returned only to the requesting operator. */
declare const SessionsCompanionAskResultSchema: Type.TObject<{
  answer: Type.TString;
  ts: Type.TInteger;
}>;
/** Current bounded exchanges for one session companion thread. */
declare const SessionsCompanionStateResultSchema: Type.TObject<{
  exchanges: Type.TArray<Type.TObject<{
    question: Type.TString;
    answer: Type.TString;
    ts: Type.TInteger;
  }>>;
}>;
type SessionObserverDigest = Static<typeof SessionObserverDigestSchema>;
type SessionsCompanionAskResult = Static<typeof SessionsCompanionAskResultSchema>;
type SessionsCompanionStateResult = Static<typeof SessionsCompanionStateResultSchema>;
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
    timeZone: Type.TOptional<Type.TString>;
    mode: Type.TOptional<Type.TString>;
    lastInputSeconds: Type.TOptional<Type.TInteger>;
    reason: Type.TOptional<Type.TString>;
    tags: Type.TOptional<Type.TArray<Type.TString>>;
    text: Type.TOptional<Type.TString>;
    /** Heartbeat freshness, not online duration or user activity. */
    ts: Type.TInteger;
    /** Server timestamps for the person's continuous online interval and last accepted activity. */
    onlineSince: Type.TOptional<Type.TInteger>;
    lastActivityAt: Type.TOptional<Type.TInteger>;
    deviceId: Type.TOptional<Type.TString>;
    roles: Type.TOptional<Type.TArray<Type.TString>>;
    scopes: Type.TOptional<Type.TArray<Type.TString>>;
    instanceId: Type.TOptional<Type.TString>;
    user: Type.TOptional<Type.TObject<{
      /** Canonical profile id when resolved, otherwise authenticated identity. Clients group presence by this. */
      id: Type.TString;
      email: Type.TOptional<Type.TString>;
      name: Type.TOptional<Type.TString>;
      avatarUrl: Type.TOptional<Type.TString>;
    }>>;
    /** Sessions this connection declares it is viewing, independent of transport subscriptions. Sorted lexicographically. */
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
  uptimeMs: Type.TInteger;
  /** Resolved source-config revision accepted by the active Gateway runtime. */
  appliedConfigHash: Type.TOptional<Type.TUnion<[Type.TString, Type.TNull]>>;
  configPath: Type.TOptional<Type.TString>;
  stateDir: Type.TOptional<Type.TString>;
  sessionDefaults: Type.TOptional<Type.TObject<{
    defaultAgentId: Type.TString;
    modelConfigured: Type.TOptional<Type.TBoolean>;
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
  origin: Type.TOptional<Type.TString>;
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
  origin: Type.TOptional<Type.TString>;
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
export { SessionsCatalogContinueParams as A, ConnectParams as B, SystemAgentChatQuestion as C, AgentWaitParams as D, ToolsGitHubAuthorizeStartResult as E, WorkerConnectParams as F, SessionPermissionMode as G, EventFrame as H, WorkerTranscriptCommitParams as I, SessionRow as K, WorkerTranscriptMessage as L, SessionsCatalogReadResult as M, WorkerInferenceModelRef as N, SessionCatalogHost as O, WorkerInferenceOptions as P, SessionGitHubPublicationResult as R, WorkerTunnelStatus as S, ToolsGitHubAuthorizePollResult as T, HelloOk as U, ErrorShape as V, RequestFrame as W, QuestionWaitAnswerResult as _, Snapshot as a, ScopeUpgradeResult as b, SessionsCompanionStateResult as c, SessionPlacementRunner as d, Question as f, QuestionResolvedEvent as g, QuestionResolveResult as h, PortalSummary as i, SessionsCatalogReadParams as j, SessionsCatalogArchiveParams as k, SessionMoveTarget as l, QuestionRecord as m, WizardStep as n, SessionObserverDigest as o, QuestionAnswers as p, SessionRunStatus as q, PortalOpenResult as r, SessionsCompanionAskResult as s, WizardAnswer as t, SessionPlacementDiskSpace as u, NodePluginToolDescriptor as v, SystemAgentWizardCancel as w, WorkerEnvironmentState as x, NodeSkillDescriptor as y, SessionGitHubPublishParams as z };