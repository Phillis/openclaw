import { $ as AcpRuntimeTurnInput, G as AcpRuntimeEnsureInput, H as AcpRuntime, J as AcpRuntimePromptMode, K as AcpRuntimeEvent, Q as AcpRuntimeTurnAttachment, U as AcpRuntimeCapabilities, W as AcpRuntimeDoctorReport, X as AcpRuntimeStatus, Y as AcpRuntimeSessionMode, Z as AcpRuntimeTurn, et as AcpRuntimeTurnResult, n as OpenClawConfig, nt as AcpSessionUpdateTag, q as AcpRuntimeHandle, tt as AcpRuntimeTurnResultError } from "../types.openclaw-6A5yUI1l.js";
import { a as SessionEntry, f as AcpSessionRuntimeOptions, m as SessionAcpMeta, p as SessionAcpIdentity } from "../types-B4JofTdW.js";
import { xr as AdmittedRunContext } from "../types-BJ8oTDFw.js";
import { a as requireAcpRuntimeBackend, c as AcpRuntimeErrorCode, i as registerAcpRuntimeBackend, l as isAcpRuntimeError, n as AcpRuntimeBackend, o as unregisterAcpRuntimeBackend, r as getAcpRuntimeBackend, s as AcpRuntimeError, t as tryDispatchAcpReplyHook } from "../acpx-Ck4tXMqw.js";
import { DatabaseSync } from "node:sqlite";
//#region src/acp/runtime/session-meta.d.ts
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  agentId?: string;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
declare function readAcpSessionEntry(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  clone?: boolean;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
}): AcpSessionStoreEntry | null;
declare function listAcpSessionEntries(params: {
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  clone?: boolean;
  databasePath?: string;
}): Promise<AcpSessionStoreEntry[]>;
declare function upsertAcpSessionMeta(params: {
  sessionKey: string;
  agentId?: string;
  cfg?: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  databasePath?: string;
  now?: () => number;
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  mutate: (current: SessionAcpMeta | undefined, entry: SessionEntry | undefined) => SessionAcpMeta | null | undefined;
}): Promise<SessionEntry | null>;
//#endregion
//#region src/acp/control-plane/manager.types.d.ts
/** Result of resolving persisted ACP metadata for a session key. */
type AcpSessionResolution = {
  kind: "none";
  sessionKey: string;
} | {
  kind: "stale";
  sessionKey: string;
  error: AcpRuntimeError;
} | {
  kind: "ready";
  sessionKey: string;
  meta: SessionAcpMeta;
  entry?: SessionEntry;
};
/** Input required to create or resume an ACP runtime session. */
type AcpInitializeSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  agent: string;
  mode: AcpRuntimeSessionMode;
  resumeSessionId?: string;
  runtimeOptions?: Partial<AcpSessionRuntimeOptions>;
  modelExplicit?: boolean;
  cwd?: string;
  backendId?: string;
};
type AcpTurnAttachment = AcpRuntimeTurnAttachment;
/** Input for one ACP prompt turn routed through the manager. */
type AcpRunTurnInput = {
  /** Private admitted execution context supplied by the owning host ingress. */admittedRunContext: AdmittedRunContext;
  cfg: OpenClawConfig;
  sessionKey: string;
  provenance: "human" | "agent" | "system";
  text: string;
  attachments?: AcpTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  onLifecycle?: (event: AcpTurnLifecycleEvent) => Promise<void> | void;
  onEvent?: (event: AcpRuntimeEvent) => Promise<void> | void;
};
type AcpTurnLifecycleEvent = {
  type: "prompt_submitted";
  at: number;
};
/** Input for closing, resetting, or cleaning up an ACP session. */
type AcpCloseSessionInput = {
  cfg: OpenClawConfig;
  sessionKey: string;
  reason: string;
  discardPersistentState?: boolean;
  clearMeta?: boolean;
  allowBackendUnavailable?: boolean;
  requireAcpSession?: boolean;
};
type AcpCloseSessionResult = {
  runtimeClosed: boolean;
  runtimeNotice?: string;
  metaCleared: boolean;
};
/** User-facing session status assembled from persisted metadata and runtime status. */
type AcpSessionStatus = {
  sessionKey: string;
  backend: string;
  agent: string;
  identity?: SessionAcpIdentity;
  state: SessionAcpMeta["state"];
  mode: AcpRuntimeSessionMode;
  runtimeOptions: AcpSessionRuntimeOptions;
  capabilities: AcpRuntimeCapabilities;
  runtimeStatus?: AcpRuntimeStatus;
  lastActivityAt: number;
  lastError?: string;
};
/** Process-local ACP manager counters exposed for diagnostics. */
type AcpManagerObservabilitySnapshot = {
  runtimeCache: {
    activeSessions: number;
    idleTtlMs: number;
    evictedTotal: number;
    lastEvictedAt?: number;
  };
  turns: {
    active: number;
    queueDepth: number;
    completed: number;
    failed: number;
    averageLatencyMs: number;
    maxLatencyMs: number;
  };
  errorsByCode: Record<string, number>;
};
type AcpStartupIdentityReconcileResult = {
  checked: number;
  resolved: number;
  failed: number;
};
type AcpSessionManagerDeps = {
  listAcpSessions: typeof listAcpSessionEntries;
  loadSessionEntry: typeof readAcpSessionEntry;
  upsertSessionMeta: typeof upsertAcpSessionMeta;
  getRuntimeBackend: typeof getAcpRuntimeBackend;
  requireRuntimeBackend: typeof requireAcpRuntimeBackend;
};
//#endregion
//#region src/acp/control-plane/manager.core.d.ts
/** Coordinates ACP session metadata, runtime handles, per-session queues, and turn execution. */
declare class AcpSessionManager {
  private readonly actorQueue;
  private readonly runtimeHandles;
  private readonly activeTurnBySession;
  private readonly turnLatencyStats;
  private readonly errorCountsByCode;
  private readonly deps;
  constructor(deps?: AcpSessionManagerDeps);
  resolveSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): AcpSessionResolution;
  getObservabilitySnapshot(): AcpManagerObservabilitySnapshot;
  reconcilePendingSessionIdentities(params: {
    cfg: OpenClawConfig;
  }): Promise<AcpStartupIdentityReconcileResult>;
  initializeSession(input: AcpInitializeSessionInput): Promise<{
    runtime: AcpRuntime;
    handle: AcpRuntimeHandle;
    meta: SessionAcpMeta;
  }>;
  getSessionStatus(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    signal?: AbortSignal;
  }): Promise<AcpSessionStatus>;
  setSessionRuntimeMode(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    runtimeMode: string;
  }): Promise<AcpSessionRuntimeOptions>;
  setSessionConfigOption(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    key: string;
    value: string;
  }): Promise<AcpSessionRuntimeOptions>;
  updateSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    patch: Partial<AcpSessionRuntimeOptions>;
  }): Promise<AcpSessionRuntimeOptions>;
  resetSessionRuntimeOptions(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
  }): Promise<AcpSessionRuntimeOptions>;
  runTurn(input: AcpRunTurnInput): Promise<void>;
  cancelSession(params: {
    cfg: OpenClawConfig;
    sessionKey: string;
    reason?: string;
  }): Promise<void>;
  closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult>;
  private ensureRuntimeHandle;
  private runtimeOptionCommandServices;
  private enforceConcurrentSessionLimit;
  private recordTurnCompletion;
  private recordErrorCode;
  private resolveRuntimeCapabilities;
  private evictIdleRuntimeHandles;
  private applyRuntimeControls;
  private setSessionState;
  private reconcileRuntimeSessionIdentifiers;
  private writeSessionMeta;
  private withSessionActor;
  private throwIfAborted;
}
//#endregion
//#region src/acp/control-plane/manager.d.ts
/** Returns the process-wide ACP session manager singleton. */
declare function getAcpSessionManager(): AcpSessionManager;
//#endregion
//#region src/plugin-sdk/acp-runtime.d.ts
declare function resolveAcpSessionAvailability(params: {
  config: OpenClawConfig;
  backendId: string;
  agentId: string;
}): {
  available: true;
} | {
  available: false;
  message: string;
};
/** Lazy ACP test helper facade combining control-plane and runtime registry helpers. */
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
} & {
  resetAcpRuntimeBackendsForTests(): void;
  getAcpRuntimeRegistryGlobalStateForTests(): {
    backendsById: Map<string, AcpRuntimeBackend>;
  };
};
//#endregion
export { type AcpRuntime, type AcpRuntimeCapabilities, type AcpRuntimeDoctorReport, type AcpRuntimeEnsureInput, AcpRuntimeError, type AcpRuntimeErrorCode, type AcpRuntimeEvent, type AcpRuntimeHandle, type AcpRuntimeStatus, type AcpRuntimeTurn, type AcpRuntimeTurnAttachment, type AcpRuntimeTurnInput, type AcpRuntimeTurnResult, type AcpRuntimeTurnResultError, type AcpSessionStoreEntry, type AcpSessionUpdateTag, testing as __testing, testing, getAcpRuntimeBackend, getAcpSessionManager, isAcpRuntimeError, readAcpSessionEntry, registerAcpRuntimeBackend, requireAcpRuntimeBackend, resolveAcpSessionAvailability, tryDispatchAcpReplyHook, unregisterAcpRuntimeBackend };