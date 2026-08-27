import { i as OpenClawConfig } from "./types.openclaw-woQof385.js";
import { c as AcpRuntimePromptMode, f as AcpRuntimeTurnAttachment, l as AcpRuntimeSessionMode, n as AcpRuntimeCapabilities, o as AcpRuntimeEvent, s as AcpRuntimeHandle, t as AcpRuntime, u as AcpRuntimeStatus } from "./types-DI-7ERAP.js";
import { a as SessionAcpIdentity, c as SessionAcpMeta, i as AcpSessionRuntimeOptions } from "./types-Bst3_XVW.js";
import { o as SessionEntry } from "./types-7aAIDdHX.js";
import { t as AdmittedRunContext } from "./openclaw-state-db.generated-BmPqI7Gr.js";
import { n as AcpRuntimeError } from "./errors-Buu3ylDF.js";
import { n as readAcpSessionEntry, r as upsertAcpSessionMeta, t as listAcpSessionEntries } from "./session-meta-f0V461E6.js";

//#region src/acp/runtime/registry.d.ts
/** Registered ACP backend with optional health probe used for auto-selection. */
type AcpRuntimeBackend = {
  id: string;
  runtime: AcpRuntime;
  healthy?: () => boolean;
};
/** Resolves a backend by id, or the first healthy backend when no id is supplied. */
declare function getAcpRuntimeBackend(id?: string): AcpRuntimeBackend | null;
/** Resolves a healthy backend or throws a typed ACP runtime error. */
declare function requireAcpRuntimeBackend(id?: string): AcpRuntimeBackend;
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
declare const testing: {
  resetAcpSessionManagerForTests(): void;
  setAcpSessionManagerForTests(manager: unknown): void;
};
//#endregion
export { AcpCloseSessionResult as a, AcpRunTurnInput as c, AcpStartupIdentityReconcileResult as d, AcpCloseSessionInput as i, AcpSessionResolution as l, testing as n, AcpInitializeSessionInput as o, AcpSessionManager as r, AcpManagerObservabilitySnapshot as s, getAcpSessionManager as t, AcpSessionStatus as u };