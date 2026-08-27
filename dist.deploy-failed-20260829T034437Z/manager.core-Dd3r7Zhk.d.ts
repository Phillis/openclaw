import { i as OpenClawConfig } from "./types.openclaw-ClnaeuRs.js";
import { _ as AcpRuntimeStatus, c as AcpRuntime, g as AcpRuntimeSessionMode, h as AcpRuntimePromptMode, l as AcpRuntimeCapabilities, m as AcpRuntimeHandle, p as AcpRuntimeEvent, r as AcpElicitationHandler, y as AcpRuntimeTurnAttachment } from "./types-B14GSL8O.js";
import { h as ThinkingLevelMap } from "./types-Sg3pk96c.js";
import { a as SessionEntry } from "./types-9lAeZdQb.js";
import { a as SessionAcpIdentity, c as SessionAcpMeta, i as AcpSessionRuntimeOptions } from "./types-Cx-scs5J.js";
import { n as ExecutionIdentityAdmissionToken, t as ExecutionIdentityAdmissionFacts } from "./execution-identity-admission-QJ9jJTde.js";
import { n as AcpRuntimeError } from "./errors-Buu3ylDF.js";
import { DatabaseSync } from "node:sqlite";
import "kysely";
//#region src/auto-reply/thinking.shared.d.ts
/** Canonical thinking level values accepted by chat commands and session state. */
type ThinkLevel = "off" | "minimal" | "low" | "medium" | "high" | "xhigh" | "adaptive" | "max" | "ultra";
type VerboseLevel = "off" | "on" | "full";
type TraceLevel = "off" | "on" | "raw";
type ElevatedLevel = "off" | "on" | "ask" | "full";
type ReasoningLevel = "off" | "on" | "stream";
/** Prepared model catalog fields reused while choosing and dispatching a queued runtime. */
type ThinkingCatalogEntry = {
  provider: string;
  id: string;
  api?: string;
  contextWindow?: number;
  contextTokens?: number;
  reasoning?: boolean;
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  thinkingLevelMap?: ThinkingLevelMap;
  input?: readonly ("text" | "image" | "audio" | "video" | "document")[];
  params?: Record<string, unknown>;
  compat?: {
    thinkingFormat?: string;
    supportedReasoningEfforts?: readonly string[] | null;
  } | null;
};
//#endregion
//#region src/infra/agent-run-registry.d.ts
type AgentRunDelegatedAuthority = Readonly<{
  operationalRunInstance: Readonly<{
    instanceId: string;
    runId: string;
  }>;
  lifecycleGeneration: string;
  claimId: string;
}>;
declare namespace admitted_run_context_d_exports {
  export { AdmittedRunContext, OperationalRunInstanceRef, PreparedAgentRunAdmission, closeAdmittedRunDelegatedAuthority, createExecutionIdentityRecoveryAdmission, createOperationalRunInstanceRef, getAdmittedRunDelegatedAuthority, prepareAgentRunAdmission, prepareSystemAgentRunAdmission, resolveAdmittedRunActiveAssertion, resolvePreparedRunAdmission, retainAdmittedRunBeforeToolCallRecovery };
}
/** Operational lifecycle correlation. This is never identity or authorization evidence. */
type OperationalRunInstanceRef = Readonly<{
  instanceId: string;
  runId: string;
}>;
/** Exact context carried by one admitted execution and every retry/fallback it owns. */
type AdmittedRunContext = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  executionIdentityToken?: ExecutionIdentityAdmissionToken;
}>;
type PreparedAgentRunAdmission = Readonly<{
  operationalRunInstance: OperationalRunInstanceRef;
  /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>;
  /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
/** Reads the immutable outer-run authority without reviving a closed claim. */
declare function getAdmittedRunDelegatedAuthority(context: AdmittedRunContext): AgentRunDelegatedAuthority | undefined;
/** Captures an exact admitted-run assertion for work that may cross an await boundary. */
declare function resolveAdmittedRunActiveAssertion(context: AdmittedRunContext, signal?: AbortSignal): (() => void) | undefined;
/** Idempotently compare-releases the authority captured by this admission. */
declare function closeAdmittedRunDelegatedAuthority(context: AdmittedRunContext): boolean;
type AdmittedRunBeforeToolCallRecovery = Readonly<{
  assertActive: () => void;
  release: () => void;
}>;
/** Recovery-only lease for the already-created native pre-tool policy callback. */
declare function retainAdmittedRunBeforeToolCallRecovery(context: AdmittedRunContext): AdmittedRunBeforeToolCallRecovery | undefined;
type ExecutionIdentityRecoveryAdmission = Readonly<{
  /** Recovery retries never manufacture replacement identity when exact evidence is absent. */
  retryOnly: boolean;
  consume: (runId: string) => Readonly<{
    accepted: boolean;
    token?: ExecutionIdentityAdmissionToken;
  }>;
}>;
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
declare function createExecutionIdentityRecoveryAdmission(params: {
  retryOnly: boolean;
  token?: ExecutionIdentityAdmissionToken;
  expectedOperationalRunId?: string;
}): ExecutionIdentityRecoveryAdmission;
declare function createOperationalRunInstanceRef(runId: string): OperationalRunInstanceRef;
/** Prepares a system-owned run without selecting its eventual execution runtime early. */
declare function prepareSystemAgentRunAdmission(cfg: OpenClawConfig, runId: string, agentId: string, boundary: string): PreparedAgentRunAdmission;
/**
 * Freezes ingress facts before preparation while deferring allocation/capture until the
 * authoritative runtime owner is selected immediately before execution.
 */
declare function prepareAgentRunAdmission(params: {
  cfg: OpenClawConfig;
  facts: Omit<ExecutionIdentityAdmissionFacts, "runtime">;
  operationalRunInstance: OperationalRunInstanceRef;
  recovery?: ExecutionIdentityRecoveryAdmission;
  onAdmitted?: (context: AdmittedRunContext) => void | Promise<void>;
}): PreparedAgentRunAdmission;
/** Resolves a host-only continuation or validates an already-admitted internal caller. */
declare function resolvePreparedRunAdmission(params: {
  runId: string;
  runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"];
  runtimeInstanceId?: string;
  admittedRunContext?: AdmittedRunContext;
  preparedRunAdmission?: PreparedAgentRunAdmission;
}): Promise<AdmittedRunContext>;
//#endregion
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
  /** Private admitted execution context supplied by the owning host ingress. */
  admittedRunContext: AdmittedRunContext;
  cfg: OpenClawConfig;
  sessionKey: string;
  provenance: "human" | "agent" | "system";
  text: string;
  attachments?: AcpTurnAttachment[];
  mode: AcpRuntimePromptMode;
  requestId: string;
  signal?: AbortSignal;
  onElicitation?: AcpElicitationHandler;
  /** Throwable host admission fence immediately before runtime prompt submission. */
  onBeforePrompt?: () => Promise<void> | void;
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
    expectedRunId?: string;
    expectedInstanceId?: string;
    expectedOwnerKey?: string;
  }): Promise<void>;
  closeSession(input: AcpCloseSessionInput): Promise<AcpCloseSessionResult>;
  private ensureRuntimeHandle;
  private runtimeOptionCommandServices;
  private recordTurnCompletion;
  private recordErrorCode;
  private resolveRuntimeCapabilities;
  private applyRuntimeControls;
  private setSessionState;
  private reconcileRuntimeSessionIdentifiers;
  private writeSessionMeta;
  private withSessionActor;
  private throwIfAborted;
}
//#endregion
export { ThinkLevel as _, AcpManagerObservabilitySnapshot as a, VerboseLevel as b, AcpSessionStatus as c, OperationalRunInstanceRef as d, PreparedAgentRunAdmission as f, ReasoningLevel as g, ElevatedLevel as h, AcpInitializeSessionInput as i, AcpStartupIdentityReconcileResult as l, AgentRunDelegatedAuthority as m, AcpCloseSessionInput as n, AcpRunTurnInput as o, admitted_run_context_d_exports as p, AcpCloseSessionResult as r, AcpSessionResolution as s, AcpSessionManager as t, AdmittedRunContext as u, ThinkingCatalogEntry as v, TraceLevel as y };