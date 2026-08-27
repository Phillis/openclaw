import { r as OpenClawConfig, v as TalkProviderConfig, y as OperatorScope } from "./types.openclaw-a_kGc1gJ.js";
import { o as SecretRef } from "./types.secrets-BBdlv1za.js";
import { B as ResolvedTtsPersona } from "./types.channels-D0WNvlsX.js";
import { n as RuntimeEnv } from "./runtime-DRcp7-j9.js";
import { N as ChannelThreadingToolContext, r as ChannelAccountSnapshot } from "./types.core-D43joVXt.js";
import { b as SessionCreatedVia, m as CronScheduledToolPolicy, y as SessionCreatedActor } from "./types-Byd4mWhx.js";
import { T as AuthProfileStore, l as MediaUnderstandingProvider } from "./types-BFl3Ao02.js";
import { ct as InputProvenance, w as AgentPlanStep } from "./templating-CW47wETJ.js";
import { n as SessionsCompanionAskResult, r as SessionsCompanionStateResult, t as SessionObserverDigest } from "./sessions-BUeXCrXH.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
import { s as TalkTransport } from "./talk-events-BREu7Rct.js";
import { Kt as PluginHookBeforeToolCallResult, dt as PluginToolMatcher, it as PluginHookToolContext, t as PluginSubagentRequesterContext, x as PluginHookBeforeToolCallEvent, yt as PluginJsonValue } from "./subagent-requester-context-z4dMhVci.js";
import { a as CronRunStatus, c as CronToolsAllowProvenance, i as CronPayload, l as CronRuntimeAuthority, n as CronJobCreate, r as CronJobPatch, s as CronStoredJob, t as CronJob } from "./types-DZa2C0_H.js";
import { i as ExecApprovalDecision, o as ExecApprovalRequestPayload$1 } from "./exec-approvals-core-ByvfWxmW.js";
import { n as ModelCatalogSnapshot, t as ModelCatalogEntry } from "./model-catalog.types-DC-D_GgG.js";
import { p as WizardPrompter } from "./setup-wizard-types-CHxDmPK8.js";
import { c as PluginApprovalRequest, l as PluginApprovalRequestPayload } from "./plugin-approvals-Dx9uGZHC.js";
import { n as createSubsystemLogger } from "./subsystem-RmDRaRJV.js";
import { B as ErrorShape, G as WorkerInferenceOptions, J as ApprovalPresentation, U as RequestFrame, W as WorkerInferenceModelRef, Z as SessionApprovalReplay, _ as SystemAgentWizardCancel, a as WizardAnswer, c as PortalSummary, f as NodePluginToolDescriptor, g as SystemAgentChatQuestion, h as WorkerEnvironmentState, i as WorkerTranscriptMessage, l as Snapshot, m as ScopeUpgradeResult, n as WorkerConnectParams, o as WizardStep$1, p as NodeSkillDescriptor, r as WorkerTranscriptCommitParams, s as PortalOpenResult, t as WorkerAdmissionHandshake, u as SessionPlacementDiskSpace, v as AgentsListResult, y as AgentWaitParams, z as ConnectParams } from "./index-Cf_fvo6T.js";
import { o as ComputerUseCapabilityDescriptor } from "./computer-use-contract-C1cuNDDf.js";
import { o as SsrFPolicy } from "./ssrf-UB_ute2q.js";
import { Static, Type } from "typebox";
import { DatabaseSync } from "node:sqlite";
import { WebSocket } from "ws";

//#region src/agents/internal-event-contract.d.ts
declare const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION: "task_completion";
declare const AGENT_INTERNAL_EVENT_SOURCES: readonly ["subagent", "cron", "image_generation", "video_generation", "music_generation"];
declare const AGENT_INTERNAL_EVENT_STATUSES: readonly ["ok", "timeout", "error", "unknown"];
type AgentInternalEventSource = (typeof AGENT_INTERNAL_EVENT_SOURCES)[number];
type AgentInternalEventStatus = (typeof AGENT_INTERNAL_EVENT_STATUSES)[number];
//#endregion
//#region src/agents/generated-attachments.d.ts
type AgentGeneratedAttachment = {
  type?: "image" | "audio" | "video" | "file";
  path?: string;
  url?: string;
  mediaUrl?: string;
  filePath?: string;
  mimeType?: string;
  name?: string;
  sizeBytes?: number;
  durationMs?: number;
  width?: number;
  height?: number;
};
//#endregion
//#region src/agents/internal-events.d.ts
type AgentTaskCompletionInternalEvent = {
  type: typeof AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION;
  source: AgentInternalEventSource;
  childSessionKey: string;
  childSessionId?: string;
  announceType: string;
  taskLabel: string;
  status: AgentInternalEventStatus;
  statusLabel: string;
  result: string;
  attachments?: AgentGeneratedAttachment[];
  mediaUrls?: string[];
  statsLine?: string;
  replyInstruction: string;
};
/** Internal event variants that can be rendered into agent prompt context. */
type AgentInternalEvent = AgentTaskCompletionInternalEvent;
//#endregion
//#region src/plugins/runtime/tool-grant.d.ts
/** Owner-scoped additive plugin tools for one trusted agent run. */
type RuntimePluginToolGrant = {
  pluginId: string;
  toolNames: readonly string[];
};
//#endregion
//#region src/audit/execution-identity-admission.d.ts
declare const ExecutionIdentityAdmissionEnvelopeSchema: Type.TObject<{
  envelopeVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
  runtimeInstanceId: Type.TString;
  agentId: Type.TString;
  ingress: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"local-cli">, Type.TLiteral<"gateway-client">, Type.TLiteral<"channel">, Type.TLiteral<"api">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"task">, Type.TLiteral<"subagent">, Type.TLiteral<"acp">, Type.TLiteral<"worker">, Type.TLiteral<"plugin">, Type.TLiteral<"recovery">, Type.TLiteral<"system">]>;
    boundary: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
    rawSourceRef: Type.TOptional<Type.TString>;
  }>;
  runtime: Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"gateway">, Type.TLiteral<"embedded">, Type.TLiteral<"worker">, Type.TLiteral<"plugin-harness">, Type.TLiteral<"acp">]>;
  }>;
  invoker: Type.TOptional<Type.TUnion<[Type.TObject<{
    state: Type.TLiteral<"present">;
    kind: Type.TUnion<[Type.TLiteral<"person">, Type.TLiteral<"agent">, Type.TLiteral<"service">, Type.TLiteral<"schedule">, Type.TLiteral<"webhook">, Type.TLiteral<"system">, Type.TLiteral<"local-account">, Type.TLiteral<"runtime">]>;
    rawPrincipalRef: Type.TString;
    displayLabel: Type.TOptional<Type.TString>;
  }>, Type.TObject<{
    state: Type.TLiteral<"unknown">;
  }>]>>;
  applicableGrants: Type.TArray<Type.TObject<{
    rawGrantRef: Type.TString;
    state: Type.TUnion<[Type.TLiteral<"present">, Type.TLiteral<"absent">, Type.TLiteral<"unknown">, Type.TLiteral<"unsupported">]>;
  }>>;
  assurance: Type.TArray<Type.TObject<{
    kind: Type.TUnion<[Type.TLiteral<"durable-profile">, Type.TLiteral<"trusted-proxy">, Type.TLiteral<"tailscale-whois">, Type.TLiteral<"device-proof">, Type.TLiteral<"channel-admission">, Type.TLiteral<"local-process">, Type.TLiteral<"spawn-lineage">, Type.TLiteral<"worker-admission">, Type.TLiteral<"runtime-binding">, Type.TLiteral<"other">]>;
    rawEvidenceRef: Type.TString;
    strength: Type.TUnion<[Type.TLiteral<"self-asserted">, Type.TLiteral<"boundary-verified">, Type.TLiteral<"cryptographic">]>;
  }>>;
}>;
declare const ExecutionIdentityAdmissionTokenSchema: Type.TObject<{
  tokenVersion: Type.TLiteral<1>;
  contextId: Type.TString;
  executionId: Type.TString;
  runId: Type.TString;
  createdAt: Type.TInteger;
}>;
type ExecutionIdentityAdmissionEnvelope = Static<typeof ExecutionIdentityAdmissionEnvelopeSchema>;
type ExecutionIdentityAdmissionFacts = Omit<ExecutionIdentityAdmissionEnvelope, "envelopeVersion" | "contextId" | "executionId" | "createdAt" | "runtimeInstanceId" | "ingress" | "applicableGrants" | "assurance"> & {
  ingress: Omit<ExecutionIdentityAdmissionEnvelope["ingress"], "state"> & {
    state?: ExecutionIdentityAdmissionEnvelope["ingress"]["state"];
  };
  applicableGrants?: ExecutionIdentityAdmissionEnvelope["applicableGrants"];
  assurance?: ExecutionIdentityAdmissionEnvelope["assurance"];
};
type ExecutionIdentityAdmissionToken = Static<typeof ExecutionIdentityAdmissionTokenSchema>;
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
  export { AdmittedRunContext, OperationalRunInstanceRef, PreparedAgentRunAdmission, closeAdmittedRunDelegatedAuthority, createExecutionIdentityRecoveryAdmission, createOperationalRunInstanceRef, getAdmittedRunDelegatedAuthority, isRetainedAdmittedRunDelegatedAuthorityActive, prepareAgentRunAdmission, prepareSystemAgentRunAdmission, resolvePreparedRunAdmission, retainAdmittedRunDelegatedAuthority };
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
  operationalRunInstance: OperationalRunInstanceRef; /** Exact post-prepare owner; repeated fallback/retry returns the same object. */
  admit: (runtimeKind: ExecutionIdentityAdmissionFacts["runtime"]["kind"], runtimeInstanceId?: string) => Promise<AdmittedRunContext>; /** Idempotently closes the exact delegated approval lease, if admission occurred. */
  close: () => void;
}>;
/** Reads the immutable outer-run authority without reviving a closed claim. */
declare function getAdmittedRunDelegatedAuthority(context: AdmittedRunContext): AgentRunDelegatedAuthority | undefined;
/** Idempotently compare-releases the authority captured by this admission. */
declare function closeAdmittedRunDelegatedAuthority(context: AdmittedRunContext): boolean;
/** Internal relay claim; it never revives the ordinary foreground lookup. */
declare function retainAdmittedRunDelegatedAuthority(context: AdmittedRunContext): (() => void) | undefined;
declare function isRetainedAdmittedRunDelegatedAuthorityActive(context: AdmittedRunContext): boolean;
type ExecutionIdentityRecoveryAdmission = Readonly<{
  /** Recovery retries never manufacture replacement identity when exact evidence is absent. */retryOnly: boolean;
  consume: (runId: string) => Readonly<{
    accepted: boolean;
    token?: ExecutionIdentityAdmissionToken;
  }>;
}>;
/** Creates a one-shot recovery admission owned by the durable recovery resolver. */
declare function createExecutionIdentityRecoveryAdmission(params: {
  retryOnly: boolean;
  token?: ExecutionIdentityAdmissionToken;
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
//#region src/cron/service/list-page-types.d.ts
/** Enabled-state filter accepted by paginated cron listing. */
type CronJobsEnabledFilter = "all" | "enabled" | "disabled";
/** Schedule-kind filter accepted by paginated cron listing. */
type CronJobsScheduleKindFilter = "all" | "at" | "every" | "cron" | "on-exit" | "stream";
/** Last-run status filter, including jobs that have not produced a status yet. */
type CronJobsLastRunStatusFilter = "all" | CronRunStatus | "unknown";
/** Stable sort keys supported by paginated cron listing. */
type CronJobsSortBy = "nextRunAtMs" | "updatedAtMs" | "name";
/** Sort direction for paginated cron listing. */
type CronSortDir = "asc" | "desc";
/** Input contract for filtered, sorted, offset-based cron job pages. */
type CronListPageOptions = {
  includeDisabled?: boolean;
  limit?: number;
  offset?: number;
  query?: string;
  enabled?: CronJobsEnabledFilter;
  scheduleKind?: CronJobsScheduleKindFilter;
  lastRunStatus?: CronJobsLastRunStatusFilter;
  sortBy?: CronJobsSortBy;
  sortDir?: CronSortDir;
  agentId?: string;
};
/** Offset-page result returned by cron listPage callers. */
type CronListPageResult<TJobs extends readonly CronJob[] = CronJob[]> = {
  jobs: TJobs; /** Opaque revision for the complete filtered, sorted result set. */
  snapshotRevision: string;
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
  nextOffset: number | null;
};
//#endregion
//#region src/infra/sqlite-wal.d.ts
type SqliteWalCheckpointMode = "PASSIVE" | "FULL" | "RESTART" | "TRUNCATE";
type SqliteWalMaintenance = {
  checkpoint: () => boolean;
  close: (options?: {
    checkpointMode?: SqliteWalCheckpointMode;
  }) => boolean;
};
//#endregion
//#region src/state/openclaw-state-db-contract.d.ts
/** Open shared SQLite database handle plus WAL maintenance lifecycle. */
type OpenClawStateDatabase = {
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
/** Options for resolving or overriding the shared state database path. */
type OpenClawStateDatabaseOptions = {
  env?: NodeJS.ProcessEnv;
  path?: string;
  database?: OpenClawStateDatabase;
  readOnly?: boolean;
};
//#endregion
//#region src/cron/service/state.d.ts
/** Direct-run mode: respect due time or force execution. */
type CronRunMode = "due" | "force";
/** Main-session wake strategy used after enqueuing cron text. */
type CronWakeMode = "now" | "next-heartbeat";
/** Lightweight service status returned to gateway/control surfaces. */
type CronStatusSummary = {
  enabled: boolean; /** @deprecated Alias for `sqlitePath`. */
  storePath: string; /** Storage backend identifier. */
  storage: "sqlite"; /** Resolved path to the shared state SQLite database. */
  sqlitePath: string;
  jobs: number;
  nextWakeAtMs: number | null;
};
/** Result shape for immediate or queued cron run requests. */
type CronRunResult = {
  ok: true;
  ran: true;
} | {
  ok: true;
  enqueued: true;
  runId: string;
} | {
  ok: true;
  ran: false;
  reason: "not-due";
} | {
  ok: true;
  ran: false;
  reason: "already-running";
} | {
  ok: true;
  ran: false;
  reason: "restart-recovery-pending";
} | {
  ok: true;
  ran: false;
  reason: "invalid-spec";
} | {
  ok: true;
  ran: false;
  reason: "stopped";
} | {
  ok: false;
};
/** Remove result that distinguishes missing jobs from failed removal. */
type CronRemoveResult = {
  ok: true;
  removed: boolean;
} | {
  ok: false;
  removed: false;
};
/** Created cron job returned by service mutation calls. */
type CronDeclarativeAddResult = CronStoredJob & {
  created: boolean;
  updated?: boolean;
  job: CronStoredJob;
};
type CronAddResult = CronStoredJob | CronDeclarativeAddResult;
/** Updated cron job returned by service mutation calls. */
type CronUpdateResult = CronJob;
/** Chronological job list returned by service read calls. */
type CronListResult = CronJob[];
/** Normalized create input accepted by the cron service. */
type CronAddInput = CronJobCreate;
/** Caller-specific declaration-key visibility and explicit enablement metadata. */
type CronAddOptions = {
  matchesExisting?: (job: CronJob) => boolean;
  enabledExplicit?: boolean; /** Gateway/doctor-owned heartbeat jobs require this opt-in at service creation. */
  systemOwned?: boolean; /** Authenticated caller provenance stamped by the service, never public input. */
  scheduledToolPolicy?: CronScheduledToolPolicy; /** Private proof from an authenticated agent-runtime caller. */
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void; /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
/** Normalized patch input accepted by cron service updates. */
type CronUpdateInput = CronJobPatch;
/** Authenticated caller provenance used only when a tool policy is explicitly adopted. */
type CronUpdateOptions = {
  scheduledToolPolicy?: CronScheduledToolPolicy;
  toolsAllowProvenance?: CronToolsAllowProvenance; /** Synchronous Gateway-owned liveness guard consumed immediately before mutation. */
  commitGuard?: () => void; /** One-use fresh capture; callback presence means fresh even when it returns undefined. */
  captureRuntimeAuthority?: () => CronRuntimeAuthority | undefined;
};
type CronCommitGuardOptions = {
  /** Synchronous Gateway-owned guard consumed at the mutation owner. */commitGuard?: () => void;
};
/** Cron-store-locked guard evaluated against the current job before an update applies. */
type CronUpdatePrecondition = (job: CronJob, nowMs: number) => void | Promise<void>;
//#endregion
//#region src/cron/service-contract.d.ts
type CronWakeResult = {
  ok: true;
} | {
  ok: false;
  reason?: "unwakeable-session-key";
};
/** Result shape for direct/queued cron runs. */
type CronServiceRunResult = CronRunResult;
type CronServiceRunOptions = {
  payload?: CronPayload; /** Internal event-source runs keep their persisted trigger on force execution. */
  evaluateTrigger?: boolean; /** Current stream batch exposed to trigger scripts as trigger.streamBatch. */
  streamBatch?: string; /** Source schedule identity checked under the cron store lock before admission. */
  streamScheduleKey?: string; /** Logical source identity; rejects retired batches under same-schedule ABA. */
  streamSourceIdentity?: string;
  onTriggerDisposition?: (disposition: "fired" | "dropped" | "busy" | "error") => void; /** Synchronous caller-authority guard consumed before run reservation. */
  commitGuard?: () => void;
};
/** Public cron service facade used by gateway, plugin SDK, and tests. */
interface CronServiceContract {
  start(): Promise<void>;
  stop(): void;
  status(): Promise<CronStatusSummary>;
  list(opts?: {
    includeDisabled?: boolean;
  }): Promise<CronListResult>;
  listPage(opts?: CronListPageOptions): Promise<CronListPageResult>;
  add(input: CronAddInput, opts?: CronAddOptions): Promise<CronAddResult>;
  update(id: string, patch: CronUpdateInput, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  updateWithPrecondition(id: string, patch: CronUpdateInput, precondition: CronUpdatePrecondition, opts?: CronUpdateOptions): Promise<CronUpdateResult>;
  remove(id: string, opts?: {
    systemOwned?: boolean;
  } & CronCommitGuardOptions): Promise<CronRemoveResult>;
  run(id: string, mode?: CronRunMode, opts?: CronServiceRunOptions): Promise<CronServiceRunResult>;
  enqueueRun(id: string, mode?: CronRunMode, opts?: CronCommitGuardOptions): Promise<CronServiceRunResult>;
  getJob(id: string): CronJob | undefined;
  readJob(id: string): Promise<CronJob | undefined>;
  getDefaultAgentId(): string | undefined;
  wake(opts: {
    mode: CronWakeMode;
    text: string;
    sessionKey?: string;
    agentId?: string;
  }): CronWakeResult;
}
//#endregion
//#region src/gateway/methods/descriptor.d.ts
/** Scope marker for methods that only authenticated node clients may call. */
declare const NODE_GATEWAY_METHOD_SCOPE: "node";
/** Scope marker for methods whose handler derives the required operator scope at runtime. */
declare const DYNAMIC_GATEWAY_METHOD_SCOPE: "dynamic";
/** Authorization scope attached to a gateway method descriptor. */
type GatewayMethodScope = OperatorScope | typeof NODE_GATEWAY_METHOD_SCOPE | typeof DYNAMIC_GATEWAY_METHOD_SCOPE;
/** Owner metadata used to keep core, plugin, channel, and auxiliary methods distinguishable. */
type GatewayMethodOwner = {
  kind: "core";
  area: string;
} | {
  kind: "plugin";
  pluginId: string;
} | {
  kind: "channel";
  channelId: string;
} | {
  kind: "aux";
  area: string;
};
/** Startup availability flag exposed to clients as retryable startup-unavailable errors. */
type GatewayMethodStartupAvailability = "available" | "unavailable-until-sidecars";
type GatewayMethodHandler = (opts: never) => unknown;
/** Complete metadata for one dispatchable gateway method. */
type GatewayMethodDescriptor = {
  name: string;
  handler: GatewayMethodHandler;
  scope: GatewayMethodScope;
  owner: GatewayMethodOwner;
  since?: string;
  startup?: GatewayMethodStartupAvailability;
  controlPlaneWrite?: boolean;
  advertise?: boolean;
  description?: string;
};
/** Read-only method registry view used by request dispatch and method listing. */
type GatewayMethodRegistryView = {
  /** Opaque registry handle carried into request scope by the gateway composition root. */pluginRegistry?: object;
  getHandler: (name: string) => GatewayMethodHandler | undefined;
  listMethods: () => string[];
  listAdvertisedMethods: () => string[];
  getScope: (name: string) => GatewayMethodScope | undefined;
  isStartupUnavailable: (name: string) => boolean;
  isControlPlaneWrite: (name: string) => boolean;
  descriptors: () => readonly GatewayMethodDescriptor[];
};
//#endregion
//#region src/gateway/session-observer-contract.d.ts
type SessionObserverEvent = {
  runId: string;
  seq: number;
  stream: string;
  ts: number;
  data: Record<string, unknown>;
  lifecycleGeneration?: string;
  sessionKey?: string;
  sessionId?: string;
  agentId?: string;
};
type SessionObserverCompanionSnapshot = {
  agentId: string;
  runId?: string;
  digest?: SessionObserverDigest;
  notes: Array<{
    sequence: number;
    text: string;
  }>;
};
type SessionObserverService = {
  handleEvent: (event: SessionObserverEvent) => void;
  setConnectionVisibility: (connId: string, visible: boolean) => void;
  removeConnection: (connId: string) => void;
  getCompanionSnapshot: (sessionKey: string, agentId?: string) => SessionObserverCompanionSnapshot;
  dispose: () => void;
};
//#endregion
//#region src/gateway/session-companion.d.ts
type SessionCompanionTarget = {
  sessionKey: string;
  agentId: string;
};
type SessionCompanionService = {
  ask: (params: {
    agentId: string;
    sessionKey: string;
    question: string;
    connId: string;
    signal?: AbortSignal;
  }) => Promise<SessionsCompanionAskResult>;
  state: (target: SessionCompanionTarget) => SessionsCompanionStateResult;
  reset: (target: SessionCompanionTarget) => void;
  dispose: () => void;
};
//#endregion
//#region src/gateway/chat-queued-turns.d.ts
type QueuedChatTurnEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string; /** False once collect-mode transfers cancellation to the aggregate owner. */
  abortable?: boolean;
  agentId?: string;
  ownerConnId?: string;
  ownerDeviceId?: string;
};
//#endregion
//#region src/plugins/provider-auth-types.d.ts
/** Provider secret input modes: inline plaintext or external secret reference. */
type SecretInputMode = "plaintext" | "ref";
//#endregion
//#region src/commands/daemon-runtime.d.ts
type GatewayDaemonRuntime = "node";
//#endregion
//#region src/commands/onboard-types.d.ts
type OnboardMode = "local" | "remote";
/**
 * Auth choices are plugin-owned contract ids plus a few legacy aliases that
 * are normalized elsewhere (for example `oauth` -> `setup-token`).
 */
type BuiltInAuthChoice = /** @deprecated Use `setup-token`. */"oauth" | "setup-token" | "token" | "apiKey" | "custom-api-key" | "skip";
type AuthChoice = BuiltInAuthChoice | (string & {});
type GatewayAuthChoice = "token" | "password";
type ResetScope = "config" | "config+creds+sessions" | "full";
type GatewayBind = "loopback" | "lan" | "auto" | "custom" | "tailnet";
type TailscaleMode = "off" | "serve" | "funnel";
declare const NODE_MANAGER_CHOICES: readonly ["npm", "pnpm", "bun"];
type NodeManagerChoice = (typeof NODE_MANAGER_CHOICES)[number];
declare const ONBOARD_FLOWS: readonly ["quickstart", "advanced", "manual", "import"];
type OnboardFlow = (typeof ONBOARD_FLOWS)[number];
type OnboardDynamicProviderOptions = {
  /**
   * Provider-specific non-interactive auth flags are plugin-owned and keyed by
   * manifest `providerAuthChoices[].optionKey` values.
   */
  [optionKey: string]: unknown;
};
/** Parsed options accepted by `openclaw onboard`. */
type OnboardOptions = OnboardDynamicProviderOptions & {
  mode?: OnboardMode; /** "manual" is an alias for "advanced". */
  flow?: OnboardFlow; /** Force the classic multi-step interactive wizard instead of guided setup. */
  classic?: boolean; /** Force the terminal hatch instead of the guided browser handoff. */
  tui?: boolean;
  workspace?: string; /** Name for the first persisted agent; defaults to `main` in non-interactive setup. */
  agentName?: string;
  nonInteractive?: boolean; /** Required for non-interactive setup; skips the interactive risk prompt when true. */
  acceptRisk?: boolean;
  reset?: boolean;
  resetScope?: ResetScope;
  authChoice?: AuthChoice; /** Used when `authChoice=token` in non-interactive mode. */
  tokenProvider?: string; /** Used when `authChoice=token` in non-interactive mode. */
  token?: string; /** Used when `authChoice=token` in non-interactive mode. */
  tokenProfileId?: string; /** Used when `authChoice=token` in non-interactive mode. */
  tokenExpiresIn?: string; /** API key persistence mode for setup flows (default: plaintext). */
  secretInputMode?: SecretInputMode;
  arceeaiApiKey?: string;
  cloudflareAiGatewayAccountId?: string;
  cloudflareAiGatewayGatewayId?: string;
  customBaseUrl?: string;
  customApiKey?: string;
  lmstudioApiKey?: string;
  customModelId?: string;
  customProviderId?: string;
  customCompatibility?: "openai" | "openai-responses" | "anthropic";
  customImageInput?: boolean;
  gatewayPort?: number;
  gatewayBind?: GatewayBind;
  gatewayAuth?: GatewayAuthChoice;
  gatewayToken?: string;
  gatewayTokenRefEnv?: string;
  gatewayPassword?: string;
  tailscale?: TailscaleMode;
  tailscaleResetOnExit?: boolean;
  installDaemon?: boolean;
  daemonRuntime?: GatewayDaemonRuntime;
  skipChannels?: boolean;
  skipSkills?: boolean;
  skipBootstrap?: boolean;
  skipSearch?: boolean;
  skipHealth?: boolean;
  skipUi?: boolean;
  suppressGatewayTokenOutput?: boolean;
  skipHooks?: boolean;
  nodeManager?: NodeManagerChoice;
  remoteUrl?: string;
  remoteToken?: string;
  importFrom?: string;
  importSource?: string;
  importSecrets?: boolean;
  json?: boolean;
};
//#endregion
//#region src/gateway/server-methods/wizard.d.ts
type ChannelSetupWizardRunner = (opts: {
  channel?: string;
  onConfigured?: (accounts: Array<{
    channel: string;
    accountId: string;
  }>) => void;
  beforePersistentEffect?: () => Promise<void>;
}, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
//#endregion
//#region src/gateway/control-ui-contract.d.ts
/** Check-run rollup for a PR head commit, chip pill + CI monitoring popover. */
type ControlUiSessionPullRequestChecks = {
  state: "pending" | "passing" | "failing";
  passed: number;
  failed: number;
  skipped: number; /** Queued/in-progress runs plus stale conclusions GitHub invalidated. */
  running: number;
};
/** One GitHub pull request whose head is the session's working branch. */
type ControlUiSessionPullRequest = {
  number: number;
  owner: string;
  repo: string;
  branch: string;
  title: string;
  url: string;
  state: "open" | "draft" | "merged" | "closed";
  additions?: number;
  deletions?: number; /** Latest check-run rollup for the head commit; absent when no checks ran. */
  checks?: ControlUiSessionPullRequestChecks;
  checksUrl?: string;
};
/**
 * The session's working branch, resolved from local git only so the pre-PR
 * "Create PR" row keeps rendering while the GitHub quota is exhausted.
 */
type ControlUiSessionBranch = {
  owner: string;
  repo: string;
  branch: string; /** Working-tree diff vs the merge base with the remote default branch. */
  additions?: number;
  deletions?: number;
  /**
   * GitHub "open a pull request for this branch" page. Absent while the
   * branch is unpushed or has nothing to compare — the row then only reports
   * the session's local changed files.
   */
  createUrl?: string;
};
/** Pull requests detected for a session's git branch, chip row payload. */
type ControlUiSessionPullRequests = {
  pullRequests: ControlUiSessionPullRequest[];
  /**
   * Present when the session's non-default GitHub branch has a creatable PR
   * on origin or local changed files in the working tree.
   */
  branch?: ControlUiSessionBranch; /** GitHub quota exhausted; entries may be stale until the limit resets. */
  rateLimited: boolean;
};
//#endregion
//#region src/gateway/control-ui-session-prs.d.ts
type ControlUiSessionPullRequestsParams = {
  sessionKey: string;
  agentId?: string;
  refresh?: boolean;
};
//#endregion
//#region src/gateway/server-broadcast-types.d.ts
type GatewayBroadcastStateVersion = {
  presence?: number;
  health?: number;
};
/** Options for gateway websocket broadcasts. */
type GatewayBroadcastOpts = {
  /** Agent scope for agent-relative keys such as `global`. */agentId?: string;
  dropIfSlow?: boolean; /** Canonical subscription keys for session-scoped delivery. */
  sessionKeys?: readonly string[];
  stateVersion?: GatewayBroadcastStateVersion;
};
/** Broadcast function signature for all connected clients. */
type GatewayBroadcastFn = (event: string, payload: unknown, opts?: GatewayBroadcastOpts) => void;
/** Broadcast function signature for targeted connection ids. */
type GatewayBroadcastToConnIdsFn = (event: string, payload: unknown, connIds: ReadonlySet<string>, opts?: GatewayBroadcastOpts) => void;
//#endregion
//#region src/gateway/control-ui-session-pr-subscriptions.d.ts
type LoadSessionPullRequests = (params: ControlUiSessionPullRequestsParams) => Promise<ControlUiSessionPullRequests>;
type SubscriptionDeps = {
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  load?: LoadSessionPullRequests;
  setTimer?: typeof globalThis.setTimeout;
  clearTimer?: typeof globalThis.clearTimeout;
};
type ControlUiSessionPullRequestSubscriptions = {
  replace: (connId: string, sessionKeys: readonly string[], refreshSessionKeys?: ReadonlySet<string>) => Promise<void>;
  unsubscribe: (connId: string) => void;
  pollNow: () => Promise<void>;
  stop: () => void;
};
/**
 * Owns the union of connection replace-sets. Only this union drives GitHub
 * refreshes, so hidden/disconnected clients cannot leave orphan polling work.
 */
declare function createControlUiSessionPullRequestSubscriptions(deps: SubscriptionDeps): ControlUiSessionPullRequestSubscriptions;
//#endregion
//#region src/gateway/session-viewer-presence.d.ts
type SessionViewerPresenceDeclarationsDeps = {
  onReplace: (connId: string, sessionKeys: readonly string[]) => void;
};
type SessionViewerPresenceDeclarations = {
  replace: (connId: string, sessionKeys: readonly string[]) => readonly string[];
  unsubscribe: (connId: string) => void;
  stop: () => void;
};
/** Owns one replace-set per websocket connection until empty declaration or disconnect. */
declare function createSessionViewerPresenceDeclarations(deps: SessionViewerPresenceDeclarationsDeps): SessionViewerPresenceDeclarations;
//#endregion
//#region src/process/exec-result.d.ts
type SpawnResult = {
  pid?: number;
  stdout: string;
  stderr: string;
  stdoutTruncatedBytes?: number;
  stderrTruncatedBytes?: number;
  preservedStdoutLines?: string[];
  preservedStderrLines?: string[];
  code: number | null;
  signal: NodeJS.Signals | null;
  killed: boolean;
  termination: "exit" | "timeout" | "no-output-timeout" | "signal";
  noOutputTimedOut?: boolean;
  outputLimitExceeded?: boolean;
  outputErrorStream?: "stdout" | "stderr";
};
//#endregion
//#region src/gateway/desktop/managed-linux.d.ts
type ManagedLinuxDesktopStatus = {
  state: "not-started";
} | {
  state: "starting";
  display?: number;
  port?: number;
} | {
  state: "running";
  display: number;
  port: number;
} | {
  state: "failed";
  error: string;
  display?: number;
  port?: number;
};
//#endregion
//#region src/gateway/desktop/host-source.d.ts
type HostDesktopStatus = {
  enabled: false;
  state: "disabled";
  port: number;
} | {
  enabled: true;
  state: "attached";
  port: number;
  security: string;
} | {
  enabled: true;
  state: "unavailable";
  port: number;
  security?: string;
} | {
  enabled: true;
  state: "managed";
  managedState: ManagedLinuxDesktopStatus["state"] | "unknown";
  port: number;
  display?: number;
  error?: string;
  security?: "VncAuth";
};
type HostDesktopService = {
  observe(params: {
    control: boolean;
    credentials?: {
      username?: string;
      password?: string;
    };
  }): Promise<{
    transport: "rfb";
    wsPath: string;
    expiresAtMs: number;
    control: boolean;
    auth: "vnc-password" | "ard-account";
    vncPassword?: string;
  }>;
  status(): Promise<HostDesktopStatus>;
};
//#endregion
//#region src/infra/voicewake-routing.d.ts
type VoiceWakeRouteTarget = {
  mode: "current";
  agentId?: undefined;
  sessionKey?: undefined;
} | {
  agentId: string;
  sessionKey?: undefined;
  mode?: undefined;
} | {
  sessionKey: string;
  agentId?: undefined;
  mode?: undefined;
};
type VoiceWakeRouteRule = {
  trigger: string;
  target: VoiceWakeRouteTarget;
};
type VoiceWakeRoutingConfig = {
  version: 1;
  defaultTarget: VoiceWakeRouteTarget;
  routes: VoiceWakeRouteRule[];
  updatedAtMs: number;
};
//#endregion
//#region src/cli/outbound-send-mapping.d.ts
type CliOutboundSendSource = {
  [channelId: string]: unknown;
};
//#endregion
//#region src/cli/deps.types.d.ts
/** CLI dependency bag currently used by outbound send command plumbing. */
type CliDeps = CliOutboundSendSource;
//#endregion
//#region src/infra/system-agent-approvals.d.ts
type SystemAgentApprovalRequestPayload = {
  title: string;
  description: string;
  command: string;
  proposalHash: string;
  allowedDecisions: readonly ExecApprovalDecision[];
  agentId?: string | null;
  sessionKey?: string | null;
  sessionId: string;
  turnSourceChannel?: null;
  turnSourceAccountId?: null;
};
//#endregion
//#region src/system-agent/operation-types.d.ts
/** Parsed OpenClaw operation before approval/execution. */
type SystemAgentOperation = {
  kind: "none";
  message: string;
} | {
  kind: "overview";
} | {
  kind: "doctor";
} | {
  kind: "doctor-fix";
} | {
  kind: "status";
} | {
  kind: "health";
} | {
  kind: "config-validate";
} | {
  kind: "config-get";
  path: string;
} | {
  kind: "config-schema";
  path?: string;
} | {
  kind: "config-set";
  path: string;
  value: string;
} | {
  kind: "config-set-ref";
  path: string;
  source: "env" | "file" | "exec" | "store";
  id: string;
  provider?: string;
} | {
  kind: "setup";
  workspace?: string;
  model?: string;
  agentName?: string;
} | {
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "channel-list";
} | {
  kind: "channel-info";
  channel: string;
} | {
  kind: "channel-setup";
  channel: string;
} | {
  kind: "skills-setup";
} | {
  kind: "search-setup";
} | {
  kind: "gateway-config-setup";
} | {
  kind: "memory-import";
} | {
  kind: "open-setup";
  target: "guided" | "classic" | "channels" | "search" | "gateway";
  channel?: string;
} | {
  kind: "gateway-status";
} | {
  kind: "gateway-start";
} | {
  kind: "gateway-stop";
} | {
  kind: "gateway-restart";
} | {
  kind: "agents";
} | {
  kind: "models";
} | {
  kind: "plugin-list";
} | {
  kind: "plugin-search";
  query: string;
} | {
  kind: "plugin-install";
  spec: string;
} | {
  kind: "plugin-uninstall";
  pluginId: string;
} | {
  kind: "audit";
} | {
  kind: "create-agent";
  agentId: string;
  workspace?: string;
  model?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
  agentDraft?: "hatch";
} | {
  kind: "set-default-model";
  model: string;
  agentId?: string;
};
//#endregion
//#region src/wizard/session.d.ts
type WizardStep = WizardStep$1;
type WizardSessionStatus = "running" | "done" | "cancelled" | "error";
type WizardNextResult = {
  done: boolean;
  step?: WizardStep;
  status: WizardSessionStatus;
  error?: string;
  channels?: string[];
  accounts?: Array<{
    channel: string;
    accountId: string;
  }>;
  preparedModelRef?: string;
};
declare class WizardSession {
  private runner;
  private readonly abortController;
  private readonly expiryTimer;
  private readonly runnerPromise;
  private currentStep;
  private progressSteps;
  private deliveredProgressStepIds;
  private stepDeferred;
  private pendingTerminalResolution;
  private cancellationLocked;
  private settled;
  private pendingExternalUrl;
  private answerDeferred;
  private status;
  private error;
  private configuredAccounts;
  private preparedModelRef;
  constructor(runner: (prompter: WizardPrompter, signal: AbortSignal, session: WizardSession) => Promise<void>, options?: {
    timeoutMs?: number;
  });
  next(): Promise<WizardNextResult>;
  private terminalResult;
  /** Record what the channels flow actually configured (channels flow only). */
  setConfiguredAccounts(accounts: ReadonlyArray<{
    channel: string;
    accountId: string;
  }>): void;
  /** Record the exact provider-owned model prepared by a setup flow. */
  setPreparedModelRef(modelRef: string): void;
  answer(stepId: string, value: unknown): Promise<string | undefined>;
  cancel(): boolean;
  /** The underlying mutation crossed its durable commit point and must finish. */
  lockCancellation(): void;
  get signal(): AbortSignal;
  pushStep(step: WizardStep): void;
  pushProgress(message: string): void;
  private rememberDeliveredProgressStep;
  queueExternalUrl(url: string): void;
  consumeExternalUrl(): string | undefined;
  private run;
  awaitAnswer(step: WizardStep, validate?: (value: string) => string | undefined): Promise<unknown>;
  private resolveStep;
  getStatus(): WizardSessionStatus;
  /** Whether the runner has stopped and can no longer mutate setup state. */
  isSettled(): boolean;
  /** Resolves after the runner can no longer mutate setup state. */
  whenSettled(): Promise<void>;
  getError(): string | undefined;
}
//#endregion
//#region src/gateway/cron-creator-authority-grant.d.ts
type CronCreatorAuthorityGrant = Readonly<{
  runId: string;
  token: string;
}>;
type CronCreatorAuthorityRunScope = {
  readonly runId: string;
  readonly signal: AbortSignal;
  readonly grantTokens: Set<string>;
  active: boolean;
  abort: () => void;
};
//#endregion
//#region src/channels/threading-tool-context-internal.d.ts
/** Host-only turn correlation carried beside the plugin-facing threading contract. */
type InternalChannelThreadingToolContext = ChannelThreadingToolContext & {
  currentSourceTurnId?: string;
};
//#endregion
//#region src/gateway/message-action-turn-capability.d.ts
type AgentRuntimeMessageActionContextBase = {
  expiresAtMs: number;
  sessionId?: string; /** Durable session entry that owns restart-recovery receipt state. */
  sourceReplySessionKey?: string;
  requesterAccountId?: string;
  requesterSenderId?: string;
  toolContext?: InternalChannelThreadingToolContext;
};
type AgentRuntimeMessageActionContext = AgentRuntimeMessageActionContextBase & ({
  sourceReplyFinal: true;
  sourceReplyToolCallId: string;
} | {
  sourceReplyFinal?: false;
  sourceReplyToolCallId?: string;
});
//#endregion
//#region src/gateway/worker-environments/placement-state.d.ts
declare const WORKER_SESSION_PLACEMENT_STATES: readonly ["local", "requested", "provisioning", "syncing", "starting", "active", "draining", "reconciling", "reclaimed", "failed"];
type WorkerSessionPlacementState = (typeof WORKER_SESSION_PLACEMENT_STATES)[number];
//#endregion
//#region src/gateway/worker-environments/placement-record.d.ts
type WorkerSessionPlacementIdentity = {
  sessionId: string;
  agentId: string;
  sessionKey: string;
};
type WorkerPlacementExecutionMode = "worker-turn" | "remote-exec";
type WorkerSessionPlacementDispatchIdentity = WorkerSessionPlacementIdentity & {
  executionMode?: WorkerPlacementExecutionMode;
};
type WorkerSessionTurnOwner = {
  kind: "local";
  environmentId?: string;
  ownerEpoch?: number;
} | {
  kind: "worker";
  environmentId: string;
  ownerEpoch: number;
};
type WorkerSessionTurnClaim = {
  sessionId: string;
  claimId: string;
  runId: string;
  placementGeneration: number;
  owner: WorkerSessionTurnOwner;
};
type PersistedTurnClaim = {
  owner: "local";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: null;
} | {
  owner: "worker";
  claimId: string;
  runId: string;
  generation: number;
  ownerEpoch: number;
};
type WorkerWorkspaceResultConflict = {
  paths: string[];
  stagedResultRef: string;
  totalCount?: number;
};
type PersistedLocalTurnClaim = Extract<PersistedTurnClaim, {
  owner: "local";
}>;
type PlacementRecordBase<TurnClaim extends PersistedTurnClaim | null> = WorkerSessionPlacementIdentity & {
  generation: number;
  executionMode: WorkerPlacementExecutionMode;
  turnClaim: TurnClaim;
  createdAtMs: number;
  updatedAtMs: number;
  stateChangedAtMs: number; /** Process-local UI projection; deliberately absent from SQLite. */
  workspaceResultConflict?: WorkerWorkspaceResultConflict;
};
type UnclaimedPlacementRecordBase = PlacementRecordBase<null>;
type LocalClaimablePlacementRecordBase = PlacementRecordBase<PersistedLocalTurnClaim | null>;
type EmptyWorkerPlacementMetadata = {
  environmentId: null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type ProvisioningPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: null;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type SyncingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: null;
  remoteWorkspaceDir: null;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type StartingPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: null;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: null;
  lastLiveEventAckCursor: null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type OwnedWorkerPlacementMetadata = {
  environmentId: string;
  activeOwnerEpoch: number;
  workspaceBaseManifestRef: string;
  remoteWorkspaceDir: string;
  workerBundleHash: string;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  recoveryError: null;
  terminalReason: null;
  terminalAtMs: null;
};
type TerminalPlacementMetadata = {
  environmentId: string | null;
  activeOwnerEpoch: number | null;
  workspaceBaseManifestRef: string | null;
  remoteWorkspaceDir: string | null;
  workerBundleHash: string | null;
  lastTranscriptAckCursor: number | null;
  lastLiveEventAckCursor: number | null;
  terminalReason: string | null;
  terminalAtMs: number | null;
};
type LocalPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "local";
};
type RequestedPlacementRecord = LocalClaimablePlacementRecordBase & EmptyWorkerPlacementMetadata & {
  state: "requested";
};
type ProvisioningPlacementRecord = UnclaimedPlacementRecordBase & ProvisioningPlacementMetadata & {
  state: "provisioning";
};
type SyncingPlacementRecord = UnclaimedPlacementRecordBase & SyncingPlacementMetadata & {
  state: "syncing";
};
type StartingPlacementRecord = UnclaimedPlacementRecordBase & StartingPlacementMetadata & {
  state: "starting";
};
type ActivePlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "active";
};
type DrainingPlacementRecord = PlacementRecordBase<PersistedTurnClaim | null> & OwnedWorkerPlacementMetadata & {
  state: "draining";
};
type ReconcilingPlacementRecord = UnclaimedPlacementRecordBase & OwnedWorkerPlacementMetadata & {
  state: "reconciling";
};
type ReclaimedPlacementRecord = UnclaimedPlacementRecordBase & Omit<OwnedWorkerPlacementMetadata, "terminalReason" | "terminalAtMs"> & TerminalPlacementMetadata & {
  state: "reclaimed";
};
type FailedPlacementRecord = LocalClaimablePlacementRecordBase & TerminalPlacementMetadata & {
  state: "failed";
  recoveryError: string;
};
type WorkerSessionPlacementRecord = LocalPlacementRecord | RequestedPlacementRecord | ProvisioningPlacementRecord | SyncingPlacementRecord | StartingPlacementRecord | ActivePlacementRecord | DrainingPlacementRecord | ReconcilingPlacementRecord | ReclaimedPlacementRecord | FailedPlacementRecord;
type WorkerSessionPlacementTransitionPatch = {
  environmentId?: string | null;
  activeOwnerEpoch?: number | null;
  workspaceBaseManifestRef?: string | null;
  remoteWorkspaceDir?: string | null;
  workerBundleHash?: string | null;
  lastTranscriptAckCursor?: number | null;
  lastLiveEventAckCursor?: number | null;
  recoveryError?: string | null;
  terminalReason?: string | null;
};
//#endregion
//#region src/gateway/agent-runtime-identity-token.d.ts
type AgentRuntimeCronSelfManagementContext = {
  jobId: string;
  expiresAtMs: number;
};
type AgentRuntimeIdentity = {
  kind: "agentRuntime";
  agentId: string;
  sessionKey: string;
  operationalRunInstance: OperationalRunInstanceRef;
  delegatedAuthority: AgentRuntimeDelegatedAuthority;
  approvalOwnerPluginId?: string;
  executionIdentity?: ExecutionIdentityAdmissionToken;
  turnSourceChannel?: string;
  turnSourceTo?: string;
  turnSourceAccountId?: string;
  turnSourceThreadId?: string | number;
  messageActionContext?: AgentRuntimeMessageActionContext;
  cronSelfManagementContext?: AgentRuntimeCronSelfManagementContext;
  cronToolsAllowCapture?: "final-executable-surface";
  cronCreatorAuthorityGrant?: CronCreatorAuthorityGrant;
  sessionSpawnContext?: AgentRuntimeSessionSpawnContext;
};
type AgentRuntimeDelegatedAuthority = AgentRunDelegatedAuthority & ({
  kind: "local";
} | {
  kind: "worker";
  turnClaim: WorkerSessionTurnClaim;
});
type AgentRuntimeSessionSpawnContext = {
  completionOwnerSessionKey?: string;
  inheritedToolPolicy: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
type AgentRuntimeApprovalAuthorityValidator = (identity: AgentRuntimeIdentity) => boolean;
//#endregion
//#region src/infra/agent-events.d.ts
/** Approval event phase for request/resolution transitions. */
type AgentApprovalEventPhase = "requested" | "resolved";
/** Approval status after routing, user action, or delivery failure. */
type AgentApprovalEventStatus = "pending" | "unavailable" | "approved" | "denied" | "failed";
/** Approval family used by renderers and host hooks. */
type AgentApprovalEventKind = "exec" | "plugin" | "unknown";
/** Payload for approval requests and their later resolution events. */
type AgentApprovalEventData = {
  phase: AgentApprovalEventPhase;
  kind: AgentApprovalEventKind;
  status: AgentApprovalEventStatus;
  title: string;
  itemId?: string;
  toolCallId?: string;
  approvalId?: string;
  approvalSlug?: string;
  command?: string;
  host?: string;
  reason?: string;
  scope?: "turn" | "session";
  message?: string;
};
/** Stream name for agent events delivered to gateway listeners and plugin host hooks. */
type AgentEventStream = "lifecycle" | "tool" | "assistant" | "usage" | "error" | "item" | "plan" | "approval" | "command_output" | "patch" | "compaction" | "thinking" | (string & {});
/** Enriched event delivered to subscribers after sequencing and context stamping. */
type AgentEventPayload = {
  runId: string;
  seq: number;
  stream: AgentEventStream;
  ts: number;
  data: Record<string, unknown>; /** Internal, non-enumerable gateway lifecycle generation that owns this run. */
  lifecycleGeneration?: string;
  sessionKey?: string;
  /**
   * sessionId the run was bound to when it started. Lifecycle persistence uses
   * this to reject terminal events from a pre-`sessions.reset` run that would
   * otherwise clobber the rotated session row resolved by the shared sessionKey.
   */
  sessionId?: string;
  agentId?: string;
};
/** Emits an agent event after assigning per-run sequence, timestamp, and context metadata. */
declare function emitAgentEvent(event: Omit<AgentEventPayload, "seq" | "ts">): void;
/** Subscribes to sequenced agent events; returns an unsubscribe callback. */
declare function onAgentEvent(listener: (evt: AgentEventPayload) => void): () => void;
/** Clears agent event state; test suites with a live Gateway can preserve its listeners. */
declare function resetAgentEventsForTest(options?: {
  preserveListeners?: boolean;
}): void;
//#endregion
//#region src/gateway/server-chat-progress-snapshot.d.ts
type ChatRunProgressSnapshot = {
  events: AgentEventPayload[];
  byteLength: number;
  lastSeq: number;
};
//#endregion
//#region src/gateway/server-chat-state.d.ts
type ChatRunTiming = {
  ackedAtMs: number;
  connId: string;
  dispatchStartedAtMs?: number;
  firstAssistantEventSent?: boolean;
  receivedAtMs: number;
};
type ChatRunRegistration = {
  sessionKey: string;
  agentId?: string;
  clientRunId: string;
  chatSendTiming?: ChatRunTiming;
};
type ChatRunEntry = ChatRunRegistration & {
  registeredAtMs: number;
  registeredSequence: number;
};
type ChatAbortMarker = number | {
  abortedAtMs: number;
  sequence: number;
};
type BufferedAgentEvent = {
  sessionKey?: string;
  agentId?: string;
  payload: AgentEventPayload & {
    spawnedBy?: string;
  };
};
type ChatRunPlanSnapshot = {
  steps: AgentPlanStep[];
  explanation?: string;
};
type ChatRunAgentTextState = {
  lastSentAt?: number;
  bufferedEvent?: BufferedAgentEvent;
};
type ChatRunToolRecipientState = {
  connIds: Set<string>;
  updatedAt: number;
  finalizedAt?: number;
};
type ChatRunRecord = {
  registrations?: ChatRunEntry[];
  rawBuffer?: string;
  buffer?: string; /** Projection stays valid only while source matches rawBuffer; readers refresh it lazily. */
  bufferProjection?: {
    source: string;
    suppress: boolean;
  };
  planSnapshot?: ChatRunPlanSnapshot;
  progressSnapshot?: ChatRunProgressSnapshot; /** Last time any buffered assistant text changed, including suppressed raw buffers. */
  bufferUpdatedAt?: number;
  deltaSentAt?: number; /** Length of text at the time of the last broadcast, used to avoid duplicate flushes. */
  deltaLastBroadcastLen?: number;
  deltaLastBroadcastText?: string;
  agentText?: {
    assistant?: ChatRunAgentTextState;
    thinking?: ChatRunAgentTextState;
  };
  abortMarker?: ChatAbortMarker;
  toolRecipient?: ChatRunToolRecipientState;
};
type ChatRunRegistry = {
  add: (sessionId: string, entry: ChatRunRegistration) => void;
  peek: (sessionId: string) => ChatRunEntry | undefined;
  shift: (sessionId: string) => ChatRunEntry | undefined;
  remove: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  clear: () => void;
};
type ChatRunState = {
  runs: Map<string, ChatRunRecord>;
  registry: ChatRunRegistry;
  toolEventRecipients: ToolEventRecipientRegistry;
  getOrCreate: (runId: string) => ChatRunRecord;
  resolveBuffer: (runId: string) => {
    text: string;
    suppress: boolean;
  };
  hasAbortMarker: (runId: string) => boolean;
  deleteAbortMarker: (runId: string) => void;
  recordProgressEvent: (runId: string, event: AgentEventPayload) => void;
  clearRun: (runId: string) => void;
  clear: () => void;
};
type ToolEventRecipientRegistry = {
  add: (runId: string, connId: string) => void;
  get: (runId: string) => ReadonlySet<string> | undefined;
  markFinal: (runId: string) => void;
};
//#endregion
//#region src/gateway/chat-abort.d.ts
type ChatAbortControllerEntry = {
  controller: AbortController;
  sessionId: string;
  sessionKey: string;
  lifecycleGeneration?: string; /** Exact operational instance created by this controller registration. */
  operationalRunInstance?: OperationalRunInstanceRef; /** Exact approval lease captured when this controller's execution was admitted. */
  agentRunDelegatedAuthority?: AgentRunDelegatedAuthority;
  agentId?: string;
  startedAtMs: number;
  expiresAtMs: number;
  ownerConnId?: string;
  ownerDeviceId?: string;
  providerId?: string;
  authProviderId?: string;
  abortStopReason?: string; /** Latest argument-free validation diagnostic for operator-initiated aborts. */
  toolErrorSummary?: string;
  /**
   * False for backend/internal agent runs that may share a session key but must
   * not be projected into operator chat surfaces.
   */
  controlUiVisible?: boolean;
  /**
   * Controls only the sessions.list active-run projection. Terminal lifecycle
   * clears this before chat.send settles, while the entry stays as the retry
   * idempotency guard until normal cleanup removes it.
   */
  projectSessionActive?: boolean; /** True after the terminal session-store update has completed. */
  projectSessionTerminalPersisted?: boolean; /** A terminal lifecycle event was observed and is awaiting persistence. */
  projectSessionTerminalPending?: boolean; /** Store timestamp expected from the observed terminal lifecycle event. */
  projectSessionTerminalObservedAt?: number; /** In-flight terminal session-store update used by restart shutdown. */
  projectSessionTerminalPersistence?: Promise<void>; /** Caller completion requested cleanup before terminal lifecycle persistence settled. */
  registrationCleanupRequested?: boolean; /** False after the owning reply run commits a terminal outcome. */
  isAbortable?: (entry: ChatAbortControllerEntry) => boolean; /** Runs once when this registration is actually removed. */
  onRemoved?: () => void;
  /**
   * Which RPC owns this registration. Absent (undefined) is treated as
   * `"chat-send"` so pre-existing callers that constructed entries without
   * a kind keep their behavior. Consumers that need "chat.send specifically
   * is active" must check `kind !== "agent"`, not just `.has(runId)`.
   */
  kind?: "chat-send" | "agent"; /** Side questions stay independent from main-turn TUI session stops. */
  turnKind?: "main" | "btw";
};
//#endregion
//#region src/gateway/config-reload-status.types.d.ts
type GatewayHotReloadStatus = "active" | "disabled";
//#endregion
//#region src/gateway/device-scope-upgrade.d.ts
type UpgradeOwner = {
  deviceId: string;
  publicKey: string;
};
/** Coordinates live device scope-upgrade waiters with the durable pairing store. */
declare class ScopeUpgradeCoordinator {
  private readonly entries;
  register(params: {
    requestId: string;
    expiresAtMs: number;
    owner: UpgradeOwner;
    requestedScopes: string[];
    initialToken?: string;
    initialApprovedAtMs?: number;
  }): boolean;
  notify(requestId: string, resolution: "approved" | "rejected"): void;
  wait(requestId: string, owner: UpgradeOwner): Promise<ScopeUpgradeResult | null>;
  private waitForResult;
  private readDurableResult;
  private retainTerminal;
}
//#endregion
//#region src/gateway/operator-approval-store.d.ts
type OperatorApprovalKind = "exec" | "plugin" | "system-agent";
type OperatorApprovalStatus = "pending" | "allowed" | "denied" | "expired" | "cancelled";
type OperatorApprovalDecision = "allow-once" | "allow-always" | "deny";
type OperatorApprovalTerminalReason = "user" | "timeout" | "malformed-verdict" | "no-route" | "run-aborted" | "gateway-restart" | "storage-corrupt";
type OperatorApprovalResolverKind = "device" | "channel" | "runtime" | "system";
type OperatorApprovalRequester = {
  deviceId: string | null;
  clientId: string | null;
  deviceTokenAuth: boolean;
};
type OperatorApprovalSource = {
  agentId: string | null;
  sessionKey: string | null;
  sessionId: string | null;
  runId: string | null;
  toolCallId: string | null;
  toolName: string | null;
};
type OperatorApprovalResolver = {
  kind: OperatorApprovalResolverKind;
  id: string | null;
};
type OperatorApprovalRecord = {
  id: string;
  resolutionRef: string;
  kind: OperatorApprovalKind;
  status: OperatorApprovalStatus;
  presentation: ApprovalPresentation;
  requester: OperatorApprovalRequester;
  reviewerDeviceIds: string[];
  source: OperatorApprovalSource;
  audienceSessionKeys: string[];
  runtimeEpoch: string;
  createdAtMs: number;
  expiresAtMs: number;
  updatedAtMs: number;
  decision: OperatorApprovalDecision | null;
  terminalReason: OperatorApprovalTerminalReason | null;
  resolvedAtMs: number | null;
  resolver: OperatorApprovalResolver | null;
  consumedAtMs: number | null;
  consumedBy: string | null;
};
type ResolveOperatorApprovalResult = {
  outcome: "resolved";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-resolved";
  retry: "same" | "conflict";
  record: OperatorApprovalRecord;
} | {
  outcome: "decision-not-allowed";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
type ForceDenyOperatorApprovalResult = {
  outcome: "denied";
  record: OperatorApprovalRecord;
} | {
  outcome: "expired";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-due";
  record: OperatorApprovalRecord;
} | {
  outcome: "already-terminal";
  record: OperatorApprovalRecord;
} | {
  outcome: "not-found";
} | {
  outcome: "corrupt";
};
//#endregion
//#region src/gateway/exec-approval-manager.d.ts
type ExecApprovalRequestPayload = ExecApprovalRequestPayload$1;
type ExecApprovalResolutionSource = "operator" | "auto-review";
type ExecApprovalRecord<TPayload = ExecApprovalRequestPayload> = {
  id: string;
  request: TPayload;
  createdAtMs: number;
  expiresAtMs: number;
  requestedByConnId?: string | null;
  requestedByDeviceId?: string | null;
  requestedByClientId?: string | null;
  requestedByDeviceTokenAuth?: boolean;
  approvalReviewerDeviceIds?: string[];
  resolvedAtMs?: number;
  decision?: ExecApprovalDecision;
  consumedDecision?: ExecApprovalDecision;
  resolutionSource?: ExecApprovalResolutionSource;
  askFallbackConsumed?: boolean;
  resolvedBy?: string | null;
  status?: OperatorApprovalStatus;
  terminalReason?: OperatorApprovalTerminalReason | null;
  runtimeEpoch?: string;
  resolverKind?: OperatorApprovalResolver["kind"] | null;
  consumedAtMs?: number | null;
  consumedBy?: string | null;
  executionIdentityToken?: ExecutionIdentityAdmissionToken; /** Exact source authority retained only for use-time liveness validation. */
  agentRuntimeDelegatedAuthority?: AgentRuntimeDelegatedAuthority;
};
type OperatorApprovalPersistenceRuntime = {
  runtimeEpoch: string;
  databaseOptions?: OpenClawStateDatabaseOptions;
};
type ExecApprovalManagerOptions<TPayload> = {
  approvalKind?: OperatorApprovalKind;
  persistence?: OperatorApprovalPersistenceRuntime;
  resolveAllowedDecisions?: (request: TPayload) => readonly ExecApprovalDecision[];
  /** Session-lineage audience policy is gateway-owned and injected as a
   * non-throwing resolver; importing it here would close an agents->gateway
   * barrel cycle. Absent resolver (tests) seeds only the raising session. */
  resolveAudienceSessionKeys?: (sourceSessionKey: string, sourceAgentId?: string | null) => string[];
  onError?: (error: Error, context: {
    approvalId: string;
    approvalKind: OperatorApprovalKind;
    operation: "expire";
  }) => void;
  onLifecycle?: (event: OperatorApprovalLifecycleEvent) => void;
  validateAgentRuntimeDelegatedAuthority?: (authority: AgentRuntimeDelegatedAuthority) => boolean;
};
type OperatorApprovalLifecycleEvent = {
  phase: "pending" | "terminal";
  record: OperatorApprovalRecord;
};
type WithLiveRecord<TResult, TPayload> = TResult extends {
  record: OperatorApprovalRecord;
} ? TResult & {
  liveRecord?: ExecApprovalRecord<TPayload>;
} : TResult;
type ExecApprovalResolveResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ResolveOperatorApprovalResult, TPayload>;
type ExecApprovalForceDenyResult<TPayload = ExecApprovalRequestPayload> = WithLiveRecord<ForceDenyOperatorApprovalResult, TPayload>;
type ExecApprovalDurableLookup = {
  outcome: "found";
  record: OperatorApprovalRecord;
} | {
  outcome: "missing" | "corrupt";
  id: string;
};
type ExecApprovalIdLookupResult = {
  kind: "exact" | "prefix";
  id: string;
} | {
  kind: "ambiguous";
  ids: string[];
} | {
  kind: "none";
};
declare class ExecApprovalManager<TPayload = ExecApprovalRequestPayload> {
  private readonly options;
  private pending;
  constructor(options?: ExecApprovalManagerOptions<TPayload>);
  get approvalKind(): OperatorApprovalKind;
  get runtimeEpoch(): string | null;
  create(request: TPayload, timeoutMs: number, id?: string | null): ExecApprovalRecord<TPayload>;
  /**
   * Register an approval record and return a promise that resolves when the decision is made.
   * This separates registration (synchronous) from waiting (async), allowing callers to
   * confirm registration before the decision is made.
   */
  register(record: ExecApprovalRecord<TPayload>, _timeoutMs: number): Promise<ExecApprovalDecision | null>;
  private emitLifecycle;
  private projectLocalRecord;
  /** Persist the first verdict, then release the process-local waiter. */
  resolveDetailed(recordId: string, decision: ExecApprovalDecision, resolver: OperatorApprovalResolver, localResolvedBy?: string | null, localResolutionSource?: ExecApprovalResolutionSource): ExecApprovalResolveResult<TPayload>;
  /** Persist a fail-closed terminal state, then release the local waiter. */
  forceDenyDetailed(recordId: string, reason: OperatorApprovalTerminalReason, resolver: OperatorApprovalResolver, status?: "denied" | "expired" | "cancelled", localDecision?: ExecApprovalDecision | null, requireDue?: boolean, localResolvedBy?: string | null): ExecApprovalForceDenyResult<TPayload>;
  private settleLocalFromStore;
  /** Settle one durable terminal transition and report whether this manager published it. */
  reconcileDurableTerminal(record: OperatorApprovalRecord): boolean;
  /** Reconciles durable truth with an existing waiter without rehydrating its request. */
  reconcileDurableLookup(lookup: ExecApprovalDurableLookup, localResolvedBy?: string | null): OperatorApprovalRecord | null;
  private settleLocalStorageFailure;
  private persistStorageCorruptDeny;
  private settleLocalEntry;
  private scheduleResolvedCleanup;
  private resolvedGraceAnchorMs;
  /** Retains an existing local binding across async delivery; final release starts a fresh grace. */
  retainForHandoff(recordId: string): (() => void) | null;
  private reportError;
  private scheduleExpiryTimer;
  private expireDue;
  private resolveLocal;
  private expireLocal;
  resolve(recordId: string, decision: ExecApprovalDecision, resolvedBy?: string | null): boolean;
  /**
   * Trusted auto-review resolution (identity-matched approval runtime).
   * Always allow-once; system.run replay validation treats the resulting
   * record more strictly than an operator decision (see #103515).
   */
  resolveAutoReview(recordId: string, resolvedBy?: string | null): boolean;
  /**
   * One-shot ask-fallback re-admission for a timed-out approval. This is
   * pre-gate policy on the process-local record only: the durable row stays
   * `expired` and no execution authority is minted here. The strict exec
   * timeout cutover is deferred (docs/refactor/operator-approvals.md); until
   * then system.run replay uses this flag to keep re-admission single-use.
   */
  consumeAskFallback(recordId: string): boolean;
  expire(recordId: string, resolvedBy?: string | null): boolean;
  getSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  /** Returns an exact live request snapshot without reading durable state or mutating expiry. */
  getLiveSnapshot(recordId: string): ExecApprovalRecord<TPayload> | null;
  listPendingRecords(): ExecApprovalRecord<TPayload>[];
  consumeAllowOnce(recordId: string, consumerId?: string): boolean;
  /**
   * Wait for decision on an already-registered approval.
   * Returns the decision promise if the ID is pending, null otherwise.
   */
  awaitDecision(recordId: string): Promise<ExecApprovalDecision | null> | null;
  /** Projects an allowed decision only while its exact runtime authority is live. */
  projectDecisionIfActive(recordId: string, decision: ExecApprovalDecision | null): ExecApprovalDecision | null;
  /** Atomically closes a live approval whose exact delegated owner is gone. */
  forceDenyIfDelegatedAuthorityClosed(recordId: string): ExecApprovalForceDenyResult<TPayload> | null;
  lookupApprovalId(input: string, opts?: {
    includeResolved?: boolean;
    filter?: (record: ExecApprovalRecord<TPayload>) => boolean;
  }): ExecApprovalIdLookupResult;
  lookupPendingId(input: string): ExecApprovalIdLookupResult;
}
//#endregion
//#region src/plugins/runtime-degraded-state.d.ts
/** Boot-stable quarantine state for configured plugins whose payload failed verification. */
type PluginVerificationFailureReason = "missing-install-path" | "missing-package-dir" | "missing-package-json" | "unreadable-package-json" | "invalid-package-json" | "missing-bundle-manifest" | "invalid-bundle-manifest" | "missing-main-entry" | "missing-extension-entry" | "missing-openclaw-peer-link";
//#endregion
//#region src/gateway/health/types.d.ts
type ProtocolHealth = Snapshot["health"];
type ProtocolPlugin = NonNullable<ProtocolHealth["plugins"]>;
type UnavailablePlugin = NonNullable<ProtocolPlugin["unavailable"]>[number];
/** Health snapshot for one configured channel account. */
type ChannelAccountHealthSummary = ChannelAccountSnapshot & {
  authAgeMs?: number | null;
  [key: string]: unknown;
};
/** Channel-level health summary with optional per-account details. */
type ChannelHealthSummary = ChannelAccountHealthSummary & {
  accounts?: Record<string, ChannelAccountHealthSummary>;
};
type AgentHealthSummary = NonNullable<ProtocolHealth["agents"]>[number];
/** Plugin registry health summary. */
type PluginHealthSummary = Omit<ProtocolPlugin, "unavailable"> & {
  unavailable?: Array<Omit<UnavailablePlugin, "diagnostic"> & {
    diagnostic: Omit<UnavailablePlugin["diagnostic"], "reason"> & {
      reason: PluginVerificationFailureReason;
    };
  }>;
};
/** Full gateway health payload consumed by `openclaw health`. */
type HealthSummary = ProtocolHealth & {
  ok: true;
  ts: number;
  durationMs: number;
  plugins?: PluginHealthSummary;
  channels: Record<string, ChannelHealthSummary>;
  channelOrder: string[];
  channelLabels: Record<string, string>;
  heartbeatSeconds: number;
  agents: AgentHealthSummary[];
  sessions: NonNullable<ProtocolHealth["sessions"]>;
};
//#endregion
//#region src/infra/device-pairing-node-state.d.ts
/** Registry projection of a paired device's authenticated node-role state. */
type PairedDeviceNodeBinding = {
  identity: string;
  generation?: string;
};
//#endregion
//#region src/gateway/node-plugin-tool-snapshot.d.ts
type RegisteredNodePluginToolCommand = {
  pluginId: string;
  command: {
    command?: string;
    agentTool?: {
      name?: string;
      description?: string;
      parameters?: unknown;
      mcp?: {
        server?: string;
        tool?: string;
      };
    };
  };
};
//#endregion
//#region src/gateway/node-registry.invoke-stream.d.ts
type NodeInvokeProgressParams = {
  invokeId: string;
  nodeId: string;
  connId: string | undefined;
  seq: number;
  chunk: string;
};
type NodeInvokeResultParams = {
  id: string;
  nodeId: string;
  connId: string | undefined;
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
//#endregion
//#region src/gateway/plugin-node-capability.d.ts
/** Path marker used to scope plugin-hosted node URLs with one-time capabilities. */
declare const PLUGIN_NODE_CAPABILITY_PATH_PREFIX = "/__openclaw__/cap";
/** Default lifetime for plugin-node capability tokens. */
declare const DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS: number;
/** Declared plugin surface that may receive scoped node capabilities. */
type PluginNodeCapabilitySurface = {
  surface: string;
  ttlMs?: number;
  scopeKey?: string;
};
/** Client state used to authorize plugin-node surface capabilities. */
type PluginNodeCapabilityClient = {
  /** Retired clients cannot back HTTP capability auth or its renewal while close is pending. */invalidated?: boolean;
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
};
/** Parsed URL details after extracting path/query capability tokens. */
type NormalizedPluginNodeCapabilityUrl = {
  pathname: string;
  capability?: string;
  rewrittenUrl?: string;
  scopedPath: boolean;
  malformedScopedPath: boolean;
};
/** Mint an opaque capability token for plugin-node surface access. */
declare function mintPluginNodeCapabilityToken(): string;
/** Append a capability path segment to a plugin host URL. */
declare function buildPluginNodeCapabilityScopedHostUrl(baseUrl: string, capability: string): string | undefined;
/** Parse and rewrite scoped capability URLs into canonical paths plus query tokens. */
declare function normalizePluginNodeCapabilityScopedUrl(rawUrl: string): NormalizedPluginNodeCapabilityUrl;
//#endregion
//#region src/gateway/worker-environments/connection-identity.d.ts
/** Hash-only worker identity retained after admission. */
type WorkerConnectionIdentity = {
  environmentId: string;
  credentialHash: string;
  bundleHash: string;
  sessionId: string | null;
  runId: string | null;
  ownerEpoch: number;
  rpcSetVersion: number;
  protocolFeatures: string[];
  credentialExpiresAtMs: number;
};
//#endregion
//#region src/gateway/server/ws-types.d.ts
type GatewayWsConnectionKind = "gateway" | "worker";
/**
 * Runtime WebSocket client state tracked by the gateway server.
 */
type GatewayWsClient = PluginNodeCapabilityClient & {
  socket: WebSocket;
  connect: ConnectParams;
  connId: string;
  connectionKind?: GatewayWsConnectionKind;
  worker?: WorkerConnectionIdentity;
  isDeviceTokenAuth?: boolean; /** Temporary legacy migration session closed when normal enforcement resumes. */
  isControlUiDeviceAuthMigrationSession?: boolean; /** Signed shared-auth session admitted only to approve its own upgrade pairing. */
  isControlUiDeviceAuthMigration?: boolean; /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  usesSharedGatewayAuth: boolean;
  sharedGatewaySessionGeneration?: string;
  presenceKey?: string;
  authenticatedUserId?: string; /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  clientIp?: string;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */isLocalClient?: true;
    approvalRuntime?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
  };
  canvasHostUrl?: string;
  canvasCapability?: string;
  canvasCapabilityExpiresAtMs?: number;
  invalidatedReason?: string;
};
//#endregion
//#region src/gateway/node-registry.d.ts
/** Connected node session advertised over Gateway websocket. */
type NodeSession = {
  nodeId: string;
  connId: string; /** Persistent device key and node-token identity authenticated for this connection. */
  pairingIdentity?: string; /** Persistent pairing generation authenticated before this session was registered. */
  pairingGeneration?: string;
  client: GatewayWsClient;
  clientId?: string;
  clientMode?: string;
  displayName?: string;
  platform?: string;
  version?: string;
  coreVersion?: string;
  uiVersion?: string;
  deviceFamily?: string;
  modelIdentifier?: string;
  remoteIp?: string;
  declaredCaps: string[];
  sessionCapsCeiling?: string[];
  caps: string[];
  declaredCommands: string[];
  sessionCommandsCeiling?: string[];
  commands: string[];
  computerUse?: ComputerUseCapabilityDescriptor; /** Exact node-local build admitted for worker session hosting. */
  workerRuns?: WorkerAdmissionHandshake;
  declaredNodePluginTools: NodePluginToolDescriptor[];
  nodePluginTools: NodePluginToolDescriptor[];
  nodeSkills: NodeSkillDescriptor[];
  declaredPermissions?: Record<string, boolean>;
  permissions?: Record<string, boolean>;
  pathEnv?: string;
  connectedAtMs: number;
  lastActiveAtMs?: number;
  presenceUpdatedAtMs?: number;
};
type PairingBoundNodeSession = NodeSession & {
  pairingIdentity: string;
};
/** Result payload returned from node.invoke. */
type NodeInvokeResult = {
  ok: boolean;
  payload?: unknown;
  payloadJSON?: string | null;
  error?: {
    code?: string;
    message?: string;
  } | null;
};
/** Connectivity probe result for a registered node. */
type NodeConnectivityResult = {
  ok: true;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
  };
};
declare const SERIALIZED_EVENT_PAYLOAD: unique symbol;
type SerializedEventPayload = {
  readonly json: string;
  readonly [SERIALIZED_EVENT_PAYLOAD]: true;
};
/** Event transport for nodes that cannot keep a WebSocket open, such as watchOS. */
type NodeEventTransport = {
  send: (event: string, payload: unknown) => boolean;
  sendRaw: (event: string, payloadJSON?: SerializedEventPayload | null) => boolean;
  checkConnectivity?: (timeoutMs: number) => Promise<NodeConnectivityResult>;
};
type PairedDeviceNodeBindingSnapshot = PairedDeviceNodeBinding;
type NodeSessionRegistrationOptions = {
  remoteIp?: string | undefined;
  pairingIdentity: string;
  pairingGeneration?: string | undefined;
};
type NodeRegistryOptions = {
  listRegisteredNodePluginToolCommands?: (() => readonly RegisteredNodePluginToolCommand[] | undefined) | undefined;
  nodePluginToolsEnabled?: boolean;
  nodeSkillsEnabled?: boolean;
  resolveCurrentPairingState?: (nodeId: string) => Promise<PairedDeviceNodeBindingSnapshot | undefined>;
  isPairingStateCurrent?: (nodeId: string, expected: PairedDeviceNodeBinding) => boolean;
  onPairingGenerationChanged?: (params: {
    nodeId: string;
    previousPairingGeneration: string;
    nextPairingGeneration: string;
    preserveSessionState: boolean;
  }) => void;
  onPairingInvalidated?: (params: {
    nodeId: string;
    connId: string;
  }) => void;
};
/** Registry of currently connected Gateway nodes. */
declare class NodeRegistry {
  private readonly options;
  private nodesById;
  private nodesByConn;
  private eventTransportsByConn;
  private pendingInvokes;
  private invokeStreams;
  private authorizedSystemRunEvents;
  private pairingGenerationEventChains;
  constructor(options?: NodeRegistryOptions);
  private listConnectedSessions;
  private capturePairingLease;
  private currentSessionForLease;
  private settlePairingLease;
  private resolvePairingLease;
  private normalizePluginToolDescriptors;
  private replaceEffectiveNodePluginTools;
  refreshNodePluginTools(): void;
  /** Register a websocket client as the current connection for its node id. */
  register(client: GatewayWsClient, opts: NodeSessionRegistrationOptions): PairingBoundNodeSession;
  /** Register a node whose events are delivered by an HTTP polling transport. */
  registerTransport(client: GatewayWsClient, opts: NodeSessionRegistrationOptions, transport: NodeEventTransport): PairingBoundNodeSession;
  private registerSession;
  /** Unregister one connection and reject invokes tied to that connection. */
  unregister(connId: string): string | null;
  /** List connected node sessions. */
  listConnected(): NodeSession[];
  /** Filter connected sessions against an already-loaded pairing-state snapshot. */
  listConnectedForPairingStates(currentPairingStates: ReadonlyMap<string, PairedDeviceNodeBindingSnapshot>): NodeSession[];
  /** Reconcile connected sessions through the synchronous persistent-pairing owner. */
  listCurrentConnectedSync(): NodeSession[];
  /** Resolve persistent pairing state before projecting connected sessions. */
  listCurrentConnected(): Promise<NodeSession[]>;
  private invalidateSessionForPairingChange;
  /** Immediately retires one exact transport after its persisted pairing authority changes. */
  invalidateConnectionForPairingChange(connId: string, reason?: string): boolean;
  /** Return a connected node session by node id. */
  get(nodeId: string): NodeSession | undefined;
  private getRegisteredSession;
  /** Return only the session authenticated for the requested persistent pairing generation. */
  getForPairingGeneration(nodeId: string, pairingGeneration: string): NodeSession | undefined;
  private getRegisteredSessionForPairingGeneration;
  /** Revalidates that one inbound node connection still owns its persisted pairing state. */
  isConnectionCurrentPairingState(connId: string): Promise<boolean>;
  /** Updates recent input activity for the exact authenticated node connection. */
  updatePresenceActivity(params: {
    nodeId: string;
    connId?: string;
    idleSeconds: number;
    saturated?: boolean;
    observedAtMs?: number;
  }): NodeSession | null;
  /** Clears recent input activity for the exact authenticated node connection. */
  clearPresenceActivity(params: {
    nodeId: string;
    connId?: string;
  }): boolean | null;
  /** Returns the connected node with the freshest reported local input. */
  getActiveNode(connectedNodes?: readonly NodeSession[]): NodeSession | undefined;
  private publishActiveNodeContext;
  /** Probe websocket liveness with ping/pong when the socket supports it. */
  checkConnectivity(nodeId: string, timeoutMs?: number): Promise<NodeConnectivityResult>;
  updateNodePluginTools(nodeId: string, connId: string | undefined, tools: readonly NodePluginToolDescriptor[]): NodeSession | null;
  updateNodeSkills(nodeId: string, connId: string | undefined, skills: readonly NodeSkillDescriptor[]): NodeSession | null;
  updateSurface(nodeId: string, surface: {
    caps?: readonly string[];
    commands: readonly string[];
    permissions?: Record<string, boolean> | undefined;
  }, generationTransition?: {
    expectedConnId: string;
    expectedPairingIdentity: string;
    expectedPairingGeneration?: string;
    nextPairingGeneration: string;
  }): NodeSession | null;
  private clearPresenceIfAccessibilityUnavailable;
  invoke(params: {
    nodeId: string;
    expectedConnId?: string;
    expectedPairingGeneration?: string;
    command: string;
    params?: unknown;
    timeoutMs?: number; /** Inactivity deadline reset by each ordered progress chunk. */
    idleTimeoutMs?: number;
    onProgress?: (chunk: string) => void;
    signal?: AbortSignal;
    idempotencyKey?: string;
    sessionKey?: string; /** Receives the id after pairing validation and a successful dispatch. */
    onDispatchReady?: (invokeId: string) => void; /** Revalidates caller authority at the registry-owned transport handoff. */
    isDispatchAuthorized?: () => boolean;
  }): Promise<NodeInvokeResult>;
  /** Send one ordered input frame to a pending streaming invoke. */
  sendInvokeInput(invokeId: string, payload: unknown): void;
  handleInvokeProgress(params: NodeInvokeProgressParams): boolean;
  /** Authorize an inbound system.run event against a recently issued node invoke. */
  authorizeSystemRunEvent(params: {
    nodeId: string;
    connId?: string;
    runId?: string;
    sessionKey: string;
    terminal: boolean;
  }): boolean;
  private rememberAuthorizedSystemRunEvent;
  private forgetAuthorizedSystemRunEvent;
  private authorizedSystemRunEventExpiresAt;
  private matchAuthorizedSystemRunEvent;
  private matchSingleAuthorizedSystemRunEvent;
  private authorizedSystemRunSessionMatches;
  private allowsLegacyMacRunIdFallback;
  private pruneAuthorizedSystemRunEvents;
  private authorizedSystemRunEventKey;
  handleInvokeResult(params: NodeInvokeResultParams): boolean;
  sendEvent(nodeId: string, event: string, payload?: unknown): boolean;
  sendEventRaw(nodeId: string, event: string, payloadJSON?: SerializedEventPayload | null): boolean;
  /** Sends command-free events only to the exact authenticated pairing connection. */
  sendEventForPairingIdentity(params: {
    nodeId: string;
    connId: string;
    pairingIdentity: string;
    event: string;
    payload?: unknown;
  }): Promise<boolean>;
  /** Sends only to a session that still owns the requested persistent pairing generation. */
  sendEventRawForPairingGeneration(nodeId: string, pairingGeneration: string, event: string, payloadJSON?: SerializedEventPayload | null): Promise<boolean>;
  private sendEventRawForPairingGenerationNow;
  private sendEventInternal;
  private sendEventRawInternal;
  private sendEventToSession;
  private isNodeWebSocketOpen;
  private rejectSlowNodeSocket;
}
//#endregion
//#region src/gateway/portals/portal-service.d.ts
type GatewayPortalOpenParams = {
  targetPort: number;
  title?: string;
  description?: string;
  path?: string;
};
type GatewayPortalService = {
  open: (params: GatewayPortalOpenParams) => Promise<PortalOpenResult>;
  list: () => PortalSummary[];
  close: (id: string) => Promise<void>;
  closeAll: () => Promise<void>;
};
//#endregion
//#region src/gateway/server-channel-runtime.types.d.ts
/** Snapshot of channel runtime state keyed by channel and account id. */
type ChannelRuntimeSnapshot = {
  channels: Partial<Record<ChannelId, ChannelAccountSnapshot>>;
  channelAccounts: Partial<Record<ChannelId, Record<string, ChannelAccountSnapshot>>>;
};
type StartChannelOptions = {
  preserveRestartAttempts?: boolean;
  preserveManualStop?: boolean;
  deferAccountStartUntil?: Promise<void>;
  manual?: boolean;
};
//#endregion
//#region src/cron/scratch-store.d.ts
type CronJobScratch = {
  content: string;
  revision: number;
  sourceSha256?: string;
  updatedAtMs: number;
};
/**
 * Present scratch content plus the persisted revision. An unset scratch keeps a
 * tombstone row so `currentRevision` stays monotonic across unset/recreate and
 * stale compare-and-swap writers cannot resurrect old content.
 */
type CronJobScratchState = {
  currentRevision: number;
  scratch?: CronJobScratch;
};
type CronJobScratchWriteResult = {
  ok: true;
  currentRevision: number;
  scratch?: CronJobScratch;
} | {
  ok: false;
  reason: "revision-conflict";
  currentRevision: number;
};
//#endregion
//#region src/gateway/server-cron-contract.d.ts
type GatewayCronServiceContract = CronServiceContract & {
  /** Remove an owned declarative job family from obsolete SQLite store partitions. */removeStaleJobFamily(family: {
    declarationKey: string;
    name: string;
    ownerPluginTag: string;
  }): Promise<number>;
  readScratch(id: string): Promise<CronJobScratchState>;
  writeScratch(id: string, params: {
    content: string | null;
    expectedRevision?: number;
    sourceSha256?: string;
    commitGuard?: () => void;
  }): Promise<CronJobScratchWriteResult>; /** Serialize agent-job removal with the roster commit and restore on failure. */
  removeAgentJobsTransactional<T>(agentId: string, commit: () => Promise<T>): Promise<T>; /** Temporarily disarm ticks without running startup recovery on resume. */
  pauseScheduling(): void;
  resumeScheduling(): void; /** Scheduler-owned work not represented by active cron run markers. */
  getSuspensionBlockerCount?(): number; /** Materialize lazy cron dependencies before a synchronous operator wake. */
  prepareWake?(): Promise<void>; /** Stop cron and await scheduler-owned child process teardown. */
  stopAndDrain?(): Promise<void>;
};
//#endregion
//#region src/infra/approval-gateway-runtime.types.d.ts
type GatewayApprovalEventKind = "exec" | "plugin";
//#endregion
//#region src/gateway/server-methods/agent-request-types.d.ts
type AgentRunRequest = {
  message: string;
  agentId?: string;
  provider?: string;
  model?: string;
  to?: string;
  replyTo?: string;
  sessionId?: string;
  sessionKey?: string;
  expectedExistingSessionId?: string;
  thinking?: string;
  deliver?: boolean;
  attachments?: Array<{
    type?: string;
    mimeType?: string;
    fileName?: string;
    content?: unknown;
  }>;
  channel?: string;
  replyChannel?: string;
  accountId?: string;
  replyAccountId?: string;
  threadId?: string;
  groupId?: string;
  groupChannel?: string;
  groupSpace?: string;
  lane?: string;
  cwd?: string;
  extraSystemPrompt?: string;
  modelRun?: boolean;
  promptMode?: "full" | "minimal" | "none";
  bootstrapContextMode?: "full" | "lightweight";
  bootstrapContextRunKind?: "default" | "heartbeat" | "cron";
  acpTurnSource?: "manual_spawn";
  internalRuntimeHandoffId?: string;
  internalExecutionIdentityRetry?: boolean;
  internalExecutionIdentityRecoveryAttempt?: number;
  execApprovalFollowupExpectedSessionId?: string;
  internalEvents?: AgentInternalEvent[];
  suppressPromptPersistence?: boolean;
  sessionEffects?: "visible" | "internal";
  idempotencyKey: string;
  sourceReplyDeliveryMode?: "automatic" | "message_tool_only";
  disableMessageTool?: boolean;
  swarmCollector?: boolean;
  swarmOutputSchema?: Record<string, unknown>;
  forceRestartSafeTools?: boolean;
  forceCodeModeTools?: boolean;
  timeout?: number;
  bestEffortDeliver?: boolean;
  cleanupBundleMcpOnRunEnd?: boolean;
  label?: string;
  inputProvenance?: InputProvenance;
  workspaceDir?: string;
  voiceWakeTrigger?: string;
};
//#endregion
//#region src/gateway/server-instance-runtime.types.d.ts
type GatewayApprovalEventPublisher = {
  publishRequested: (kind: GatewayApprovalEventKind, request: unknown) => number;
  publishResolved: (kind: GatewayApprovalEventKind, resolved: unknown) => void;
};
type GatewayRecoveryRuntime = {
  dispatchAgent: <T = unknown>(params: AgentRunRequest, timeoutMs?: number, options?: {
    allowModelOverride?: boolean;
    scopes?: string[];
  }) => Promise<T>;
  waitForAgent: <T = unknown>(params: AgentWaitParams, timeoutMs?: number) => Promise<T>;
  sendRecoveryNotice: (params: {
    channel: string;
    to: string;
    accountId?: string;
    threadId?: string | number;
    text: string;
    idempotencyKey: string;
  }) => Promise<{
    /** True when delivery produced zero platform results (policy/channel suppression). */suppressed: boolean;
  }>;
};
//#endregion
//#region src/gateway/server-model-catalog.types.d.ts
type GatewayModelCatalogSnapshot = ModelCatalogSnapshot & {
  agentId: string;
  agentDir: string;
  catalogComplete: boolean;
  workspaceDir: string;
  config: OpenClawConfig;
};
//#endregion
//#region src/gateway/server-shared.d.ts
type DedupeEntry = {
  ts: number;
  ok: boolean; /** Optional effectful-request fingerprint for methods with caller-supplied operation ids. */
  requestIdentity?: string;
  payload?: unknown;
  error?: ErrorShape;
};
//#endregion
//#region src/gateway/server/event-loop-health.d.ts
type GatewayEventLoopHealthReason = "event_loop_delay" | "event_loop_utilization" | "cpu";
type GatewayEventLoopHealth = {
  degraded: boolean;
  degradedSinceMs: number | null;
  reasons: GatewayEventLoopHealthReason[];
  intervalMs: number;
  delayP99Ms: number;
  delayMaxMs: number;
  utilization: number;
  cpuCoreRatio: number;
};
//#endregion
//#region src/gateway/terminal/launch.d.ts
/** Why a terminal cannot open, or `null` when it can. */
type TerminalLaunchBlock = {
  kind: "disabled";
} | {
  kind: "owner-required";
  message: string;
} | {
  kind: "unknown-agent";
  agentId: string;
} | {
  kind: "sandboxed";
  agentId: string;
  mode: "all";
};
/** Resolved plan for a host terminal session. */
type TerminalLaunchPlan = {
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  initialCommand?: string[];
  cwdOverride?: string;
};
/** Terminal launch resolution result: either a runnable plan or a block reason. */
type TerminalLaunchResolution = {
  ok: true;
  plan: TerminalLaunchPlan;
} | {
  ok: false;
  block: TerminalLaunchBlock;
};
//#endregion
//#region src/infra/terminal-file-upload.d.ts
type TerminalUploadFile = {
  name: string;
  contentBase64: string;
};
type TerminalUploadResult = {
  path: string;
  size: number;
};
//#endregion
//#region src/gateway/terminal/session-types.d.ts
type TerminalSessionSummary = {
  sessionId: string;
  agentId: string;
  shell: string;
  cwd: string;
  attached: boolean;
  owner: "conn" | `agent:${string}`;
  createdAtMs: number;
};
type TerminalAttachSummary = Omit<TerminalSessionSummary, "attached" | "owner" | "createdAtMs"> & {
  buffer: string;
  seq: number;
};
//#endregion
//#region src/process/terminal-pty.d.ts
/** Live PTY handle shared by gateway terminals and node-host commands. */
type TerminalPtyHandle = {
  pid: number;
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  onData(listener: (chunk: string) => void): void;
  onExit(listener: (event: {
    exitCode: number;
    signal?: number;
  }) => void): void;
  kill(signal?: string): void;
};
declare function spawnTerminalPty(params: {
  file: string;
  args: string[];
  cwd?: string;
  env: Record<string, string>;
  cols: number;
  rows: number;
}): Promise<TerminalPtyHandle>;
//#endregion
//#region src/gateway/terminal/backend.d.ts
type TerminalBackendExit = {
  exitCode?: number;
  signal?: number;
  error?: string;
};
interface TerminalBackend {
  write(data: string): void;
  resize(cols: number, rows: number): void;
  pause(): void;
  resume(): void;
  kill(): void;
  onData(callback: (data: string) => void): void;
  onExit(callback: (exit: TerminalBackendExit) => void): void;
}
type LocalTerminalBackendSpawner = typeof spawnTerminalPty;
//#endregion
//#region src/gateway/terminal/session-manager.types.d.ts
type TerminalEventSink = (connId: string, event: string, payload: unknown) => void;
type TerminalOwner = {
  kind: "conn";
  connId: string;
} | {
  kind: "agent";
  agentSessionKey: string;
  agentId?: string;
};
type TerminalSessionManagerOptions = {
  emit: TerminalEventSink;
  getBufferedAmount?: (connId: string) => number | undefined;
  spawn?: LocalTerminalBackendSpawner;
  maxSessions?: number;
  env?: NodeJS.ProcessEnv; /** Detach grace; 0 preserves kill-on-disconnect. Gateway wiring owns its default. */
  detachGraceMs?: number;
  maxDetachedSessions?: number;
  scrollbackChars?: number;
};
type TerminalOpenRequest = {
  owner: TerminalOwner;
  agentId: string;
  cwd: string;
  shell: string;
  args: string[];
  cols: number;
  rows: number;
  env: Record<string, string>; /** Request-scoped cancellation; a late backend is killed before registration. */
  signal?: AbortSignal;
  createBackend?: () => Promise<TerminalBackend>;
  stageUpload?: (file: TerminalUploadFile) => Promise<TerminalUploadResult>;
};
type TerminalOpenOutcome = {
  ok: true;
  sessionId: string;
  agentId: string;
  cwd: string;
  shell: string;
} | {
  ok: false;
  code: "limit" | "spawn_failed" | "closed";
  message: string;
};
//#endregion
//#region src/gateway/terminal/session-manager.d.ts
/**
 * Tracks live PTY sessions keyed by session id, with a reverse index for
 * connection owners and viewers so disconnect cleanup stays bounded.
 */
declare class TerminalSessionManager {
  private readonly sessions;
  private readonly byConn;
  private readonly pendingOpens;
  private readonly pendingByConn;
  private readonly emit;
  private readonly getBufferedAmount;
  private readonly spawn?;
  private readonly maxSessions;
  private readonly detachGraceMs;
  private readonly maxDetachedSessions;
  private readonly scrollbackChars;
  private opening;
  private spawning;
  constructor(options: TerminalSessionManagerOptions);
  /** Number of live sessions; used by tests and health surfaces. */
  get size(): number;
  /** Spawns a shell and wires its output/exit to its live connection recipients. */
  open(request: TerminalOpenRequest): Promise<TerminalOpenOutcome>;
  /** Writes client input to a session; returns false when the session is gone. */
  write(connId: string, sessionId: string, data: string): boolean;
  /** Writes agent input after proving session-key ownership. */
  writeAgent(agentSessionKey: string, sessionId: string, data: string, agentId?: string): boolean;
  private writeSession;
  /** Applies a new PTY grid size; returns false when the session is gone. */
  resize(connId: string, sessionId: string, cols: number, rows: number): boolean;
  /** Resizes an agent-owned PTY after proving session-key ownership. */
  resizeAgent(agentSessionKey: string, sessionId: string, cols: number, rows: number, agentId?: string): boolean;
  private resizeSession;
  /** Stages a file on the same host as an owned terminal session. */
  upload(connId: string, sessionId: string, file: TerminalUploadFile): Promise<TerminalUploadResult | undefined>;
  /** Closes one session on operator request. */
  close(connId: string, sessionId: string): boolean;
  /** Closes an agent-owned PTY after proving session-key ownership. */
  closeAgent(agentSessionKey: string, sessionId: string, agentId?: string): boolean;
  /** Closes every live or spawning PTY owned by one exact agent session or task. */
  closeAgentSessions(agentSessionKey: string, agentId?: string): number;
  /**
   * Rebinds a connection-owned session, or co-attaches a viewer to an
   * agent-owned session. Operator-to-operator attach remains take-over; only
   * agent-owned sessions gain shared viewers.
   */
  attach(connId: string, sessionId: string): TerminalAttachSummary | undefined;
  private attachSummary;
  /** Every live session, oldest first; all admin connections see the same list. */
  list(): TerminalSessionSummary[];
  /** Raw buffered output for one session, or undefined when it is gone. */
  snapshot(sessionId: string): string | undefined;
  /** Raw buffer for an agent-owned session, guarded by the caller session key. */
  snapshotAgent(agentSessionKey: string, sessionId: string, agentId?: string): string | undefined;
  /** Live sessions owned by one agent tool caller. */
  listAgent(agentSessionKey: string, agentId?: string): TerminalSessionSummary[];
  private trackPendingOpen;
  private openAbortMessage;
  private untrackPendingOpen;
  /**
   * Handles a dropped connection: detaches its sessions for later reattach
   * when a grace period is configured, otherwise kills them (legacy behavior,
   * still selected by detachedSessionTimeoutSeconds: 0).
   */
  handleDisconnect(connId: string): void;
  /** Closes live and pending sessions whose agent no longer permits a host shell. */
  closeDisallowedAgents(isAllowed: (agentId: string) => boolean): void;
  /** Parks a session ownerless with a reaper; PTY output keeps buffering. */
  private detach;
  private enforceDetachedCap;
  /**
   * Tears down every session — detached ones included — on gateway
   * shutdown/stop. Silent because the sockets are going away anyway (disabling
   * the terminal is a `gateway` restart, so that path also runs through here,
   * not a live notification).
   */
  disposeAll(): void;
  private indexByConn;
  private unindexByConn;
  /**
   * Claims the longest-idle agent-owned session as an eviction candidate when
   * the pool is exhausted. Viewer-attached and connection-owned sessions are
   * never evicted; an idle viewer-free background job losing its PTY under
   * pressure is the accepted tradeoff for keeping the pool available. Claimed
   * sessions are skipped so concurrent opens select distinct victims.
   */
  private claimLongestIdleAgentSession;
  private removeViewer;
  private interactiveSession;
  /** Agents may operate only PTYs created by their exact trusted session key. */
  private agentOwnedSession;
  private sessionConnIds;
  private finalize;
}
//#endregion
//#region src/gateway/worker-environments/placement-workspace-result.d.ts
type WorkerWorkspacePendingResult = {
  sessionId: string;
  environmentId: string;
  ownerEpoch: number;
  placementGeneration: number;
  claimId: string;
  runId: string;
  gatewayInstanceId: string;
  recoveryRequestedAtMs: number | null;
  workspaceAcceptedAtMs: number | null;
  stagedResultRef: string | null;
};
//#endregion
//#region src/gateway/worker-environments/workspace-manifest.d.ts
type WorkerWorkspaceManifestEntry = {
  path: string;
  type: "file";
  mode: number;
  size: number;
  sha256: string;
} | {
  path: string;
  type: "symlink";
  mode: number;
  target: string;
};
type WorkerWorkspaceManifest = {
  version: 1;
  baseCommit: string | null;
  entries: WorkerWorkspaceManifestEntry[];
  directories?: string[];
};
type WorkerWorkspaceReconciliationJournal = {
  version: 1;
  temporaryNonce: string;
  baseManifestRef: string;
  currentManifestRef: string;
  baseEntries: WorkerWorkspaceManifestEntry[];
  appliedEntries: WorkerWorkspaceManifestEntry[];
  baseDirectories?: string[];
  appliedDirectories?: string[];
  appliedManifestRef?: string;
  baseTree: string;
  basePackSha256: string;
  basePack: Uint8Array;
};
type WorkerWorkspaceReconciliationJournalAdapter = {
  load(): WorkerWorkspaceReconciliationJournal | undefined;
  begin(journal: WorkerWorkspaceReconciliationJournal): void;
  commit(manifestRef: string): void;
  abort(): void;
};
//#endregion
//#region src/gateway/worker-environments/placement-store.d.ts
declare const RETIRABLE_PLACEMENT_STATES: readonly ["local", "reclaimed", "failed"];
type WorkerSessionPlacementRetirement = {
  sessionId: string;
  expectedState: (typeof RETIRABLE_PLACEMENT_STATES)[number];
  expectedGeneration: number;
};
declare function createWorkerSessionPlacementStore(options?: {
  database?: OpenClawStateDatabase;
  now?: () => number;
}): {
  registerTurnClaimClosedHandler(handler: (claim: WorkerSessionTurnClaim) => void): () => void;
  get(sessionId: string): WorkerSessionPlacementRecord | undefined;
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
  retireSessionPlacement(input: WorkerSessionPlacementRetirement): void;
  recordWorkspaceResultConflict(claim: WorkerSessionTurnClaim, conflict: WorkerWorkspaceResultConflict | undefined): void;
  startDispatch(input: WorkerSessionPlacementDispatchIdentity): WorkerSessionPlacementRecord;
  transition(input: {
    sessionId: string;
    from: WorkerSessionPlacementState;
    to: WorkerSessionPlacementState;
    expectedGeneration: number;
    patch?: WorkerSessionPlacementTransitionPatch;
  }): WorkerSessionPlacementRecord;
  startDrain(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    workspaceBaseManifestRef?: string;
  }): WorkerSessionPlacementRecord;
  finishReclaim(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
  }): WorkerSessionPlacementRecord;
  startReconcile(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
  }): WorkerSessionPlacementRecord;
  validateWorkerOwner(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
  }): boolean;
  fail(input: {
    sessionId: string;
    recoveryError: string;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  adoptActive(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration?: number;
  }): WorkerSessionPlacementRecord;
  listForReconcile(): WorkerSessionPlacementRecord[];
  list(): WorkerSessionPlacementRecord[];
  workspaceResultInstanceId(): string;
  listPendingWorkspaceResults(): WorkerWorkspacePendingResult[];
  markWorkspaceResultPending(claim: WorkerSessionTurnClaim): void;
  recordStagedWorkspaceResult(claim: WorkerSessionTurnClaim, stagedResultRef: string): void;
  acceptWorkspaceResult(claim: WorkerSessionTurnClaim): void;
  handoffWorkspaceResultRecovery(claim: WorkerSessionTurnClaim): void;
  abandonWorkspaceResult(pending: WorkerWorkspacePendingResult): void;
  listWorkspaceReconciliationOwners(): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  pruneOrphanedWorkspaceReconciliations(options: {
    retainFailedOwner: (recoveryError: string) => boolean;
  }): {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }[];
  loadWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    allowFailedOwner?: boolean;
  }): WorkerWorkspaceReconciliationJournal | undefined;
  beginWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, journal: WorkerWorkspaceReconciliationJournal): void;
  abortWorkspaceReconciliation(owner: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    placementGeneration: number;
  }, options?: {
    force?: boolean;
  }): void;
  failWorkspaceResultAndReleaseTurn(pending: WorkerWorkspacePendingResult, error: unknown): WorkerSessionPlacementRecord;
  releaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  completeWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim, options?: {
    reclaim?: boolean;
  }): WorkerSessionPlacementRecord;
  cancelWorkspaceResultAndReleaseTurn(claim: WorkerSessionTurnClaim): WorkerSessionPlacementRecord;
  clearLocalTurnClaimsAfterRestart(): number;
  waitForTurnClaimRelease(sessionIdInput: string, waitOptions: {
    timeoutMs: number;
    signal?: AbortSignal;
  }): Promise<void>;
  validateTurnClaim(claim: WorkerSessionTurnClaim): boolean;
  updateAckCursors(input: {
    claim: WorkerSessionTurnClaim;
    transcript?: number;
    liveEvent?: number;
    workspaceResultPending?: boolean;
  }): WorkerSessionPlacementRecord;
  updateWorkspaceBaseManifest(input: {
    claim: WorkerSessionTurnClaim;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  acceptIdleWorkspaceReconciliation(input: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    expectedGeneration: number;
    manifestRef: string;
  }): WorkerSessionPlacementRecord;
  authorizeWorkerTurnTools(claim: WorkerSessionTurnClaim, toolNames: readonly string[]): void;
  isWorkerTurnToolAuthorized(binding: {
    sessionId: string;
    environmentId: string;
    ownerEpoch: number;
    runId: string;
  }, toolName: string): boolean;
  closeWorkerTurnToolState(claim: WorkerSessionTurnClaim): Promise<void>;
  beginWorkerSessionToolOperation(params: {
    binding: {
      sessionId: string;
      environmentId: string;
      ownerEpoch: number;
      runId: string;
    };
    toolName: "sessions_spawn" | "sessions_send";
    toolCallId: string;
    requestDigest: string;
    childSessionKey?: string;
  }): {
    kind: "execute";
    claimId: string;
    operationSeed: string;
    childSessionKey?: string;
  } | {
    kind: "in-progress";
    claimId: string;
  } | {
    kind: "completed";
    resultJson: string;
  } | {
    kind: "unknown";
  } | {
    kind: "capacity";
  } | {
    kind: "conflict";
  } | {
    kind: "unauthorized";
  };
  bindWorkerSessionToolOperationChild(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    childSessionKey: string;
  }): boolean;
  completeWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
    resultJson: string;
    failed?: boolean;
  }): boolean;
  abandonWorkerSessionToolOperation(params: {
    sourceSessionId: string;
    sourceClaimId: string;
    toolCallId: string;
    requestDigest: string;
  }): boolean;
  recoverWorkerSessionToolOperationsAfterRestart(): number;
  claimTurn(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
  claimReclaimWorkspaceResult(input: WorkerSessionPlacementIdentity & {
    owner: WorkerSessionTurnOwner;
    claimId: string;
    runId: string;
  }): WorkerSessionTurnClaim;
};
type WorkerSessionPlacementStore = ReturnType<typeof createWorkerSessionPlacementStore>;
type WorkerSessionPlacementRetirementService = Pick<WorkerSessionPlacementStore, "retireSessionPlacement">;
//#endregion
//#region src/gateway/worker-environments/placement-projector.d.ts
type WorkerSessionPlacementReader = {
  getMany(sessionIds: readonly string[]): ReadonlyMap<string, WorkerSessionPlacementRecord>;
};
type WorkerPlacementDiskSpaceReader = {
  read(record: WorkerSessionPlacementRecord): SessionPlacementDiskSpace | undefined;
  version(): number;
};
//#endregion
//#region packages/media-generation-core/src/normalization.d.ts
/** Primitive value types reported in media generation normalization metadata. */
type MediaNormalizationValue = string | number | boolean;
/** Requested/applied value pair plus provenance for a normalized media option. */
type MediaNormalizationEntry<TValue extends MediaNormalizationValue> = {
  requested?: TValue;
  applied?: TValue;
  derivedFrom?: string;
  supportedValues?: readonly TValue[];
};
//#endregion
//#region src/image-generation/types.d.ts
/** Non-empty binary image asset returned by an image-generation provider. */
type GeneratedImageAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  revisedPrompt?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationResolution = "1K" | "2K" | "4K";
type ImageGenerationQuality = "low" | "medium" | "high" | "auto";
type ImageGenerationOutputFormat = "png" | "jpeg" | "webp";
type ImageGenerationBackground = "transparent" | "opaque" | "auto";
type ImageGenerationOpenAIBackground = ImageGenerationBackground;
type ImageGenerationOpenAIModeration = "low" | "auto";
type ImageGenerationOpenAIOptions = {
  background?: ImageGenerationOpenAIBackground;
  moderation?: ImageGenerationOpenAIModeration;
  outputCompression?: number;
  user?: string;
};
type ImageGenerationProviderOptions = Record<string, unknown> & {
  openai?: ImageGenerationOpenAIOptions;
};
type ImageGenerationIgnoredOverrideKey = "size" | "aspectRatio" | "resolution" | "quality" | "outputFormat" | "background";
type ImageGenerationIgnoredOverride = {
  key: ImageGenerationIgnoredOverrideKey;
  value: string;
};
type ImageGenerationSourceImage = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Runtime request passed to an image-generation provider implementation. */
type ImageGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  providerOptions?: ImageGenerationProviderOptions;
  ssrfPolicy?: SsrFPolicy;
};
type ImageGenerationResult = {
  images: GeneratedImageAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};
type ImageGenerationModeCapabilities = {
  maxCount?: number;
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean;
};
type ImageGenerationEditCapabilities = ImageGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
  maxInputImagesByModel?: Readonly<Record<string, number>>;
  maxInputImagesByModelPrefix?: Readonly<Record<string, number>>;
};
type ImageGenerationGeometryCapabilities = {
  sizes?: string[];
  sizesByModel?: Record<string, string[]>;
  aspectRatios?: string[];
  aspectRatiosByModel?: Record<string, string[]>;
  resolutions?: ImageGenerationResolution[];
  resolutionsByModel?: Record<string, ImageGenerationResolution[]>;
};
type ImageGenerationOutputCapabilities = {
  qualities?: ImageGenerationQuality[];
  formats?: ImageGenerationOutputFormat[];
  backgrounds?: ImageGenerationBackground[];
};
type ImageGenerationNormalization = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<ImageGenerationResolution>;
};
type ImageGenerationProviderCapabilities = {
  generate: ImageGenerationModeCapabilities;
  edit: ImageGenerationEditCapabilities;
  geometry?: ImageGenerationGeometryCapabilities;
  output?: ImageGenerationOutputCapabilities;
};
type ImageGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string; /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: ImageGenerationProviderCapabilities;
  isConfigured?: (ctx: ImageGenerationProviderConfiguredContext) => boolean;
  generateImage: (req: ImageGenerationRequest) => Promise<ImageGenerationResult>;
};
//#endregion
//#region src/music-generation/types.d.ts
/**
 * Public music generation provider contracts.
 *
 * Providers implement these request/result/capability shapes so the core
 * runtime can normalize prompts, options, assets, and fallback diagnostics.
 */
/** Audio output formats currently understood by music generation providers. */
type MusicGenerationOutputFormat = "mp3" | "wav";
/** Non-empty in-memory audio asset returned from a music generation provider. */
type GeneratedMusicAsset = {
  buffer: Buffer;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
/** Optional source image passed to image-conditioned music edit models. */
type MusicGenerationSourceImage = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type MusicGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Provider request after runtime fallback and override normalization. */
type MusicGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  lyrics?: string;
  instrumental?: boolean;
  durationSeconds?: number;
  format?: MusicGenerationOutputFormat;
  inputImages?: MusicGenerationSourceImage[];
};
/** Provider result before runtime fallback metadata is attached. */
type MusicGenerationResult = {
  tracks: GeneratedMusicAsset[];
  model?: string;
  lyrics?: string[];
  metadata?: Record<string, unknown>;
};
/** Caller override dropped because the selected provider/model does not support it. */
type MusicGenerationIgnoredOverride = {
  key: "lyrics" | "instrumental" | "durationSeconds" | "format";
  value: string | boolean | number;
};
/** Capability block for prompt-only music generation. */
type MusicGenerationModeCapabilities = {
  maxTracks?: number;
  maxDurationSeconds?: number;
  supportsLyrics?: boolean;
  supportsLyricsByModel?: Readonly<Record<string, boolean>>;
  supportsInstrumental?: boolean;
  supportsInstrumentalByModel?: Readonly<Record<string, boolean>>;
  supportsDuration?: boolean;
  supportsFormat?: boolean;
  supportedFormats?: readonly MusicGenerationOutputFormat[];
  supportedFormatsByModel?: Readonly<Record<string, readonly MusicGenerationOutputFormat[]>>;
};
/** Capability block for image-conditioned music generation. */
type MusicGenerationEditCapabilities = MusicGenerationModeCapabilities & {
  enabled: boolean;
  maxInputImages?: number;
};
/** Provider capability declaration, including optional mode-specific overrides. */
type MusicGenerationProviderCapabilities = MusicGenerationModeCapabilities & {
  maxInputImages?: number;
  generate?: MusicGenerationModeCapabilities;
  edit?: MusicGenerationEditCapabilities;
};
/** Normalization metadata attached to runtime results. */
type MusicGenerationNormalization = {
  durationSeconds?: MediaNormalizationEntry<number>;
};
/** Provider implementation contract consumed by the music generation runtime. */
type MusicGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string;
  models?: string[];
  capabilities: MusicGenerationProviderCapabilities;
  isConfigured?: (ctx: MusicGenerationProviderConfiguredContext) => boolean;
  generateMusic: (req: MusicGenerationRequest) => Promise<MusicGenerationResult>;
};
//#endregion
//#region src/realtime-transcription/provider-types.d.ts
type RealtimeTranscriptionProviderId = string;
type RealtimeTranscriptionProviderConfig = Record<string, unknown>;
type RealtimeTranscriptionProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeTranscriptionProviderConfig;
};
type RealtimeTranscriptionProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Callback hooks emitted by realtime transcription sessions. */
type RealtimeTranscriptionSessionCallbacks = {
  onPartial?: (partial: string) => void;
  onTranscript?: (transcript: string) => void;
  onSpeechStart?: () => void;
  onError?: (error: Error) => void;
};
/** Inputs passed to a provider when creating a transcription session. */
type RealtimeTranscriptionSessionCreateRequest = RealtimeTranscriptionSessionCallbacks & {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeTranscriptionProviderConfig;
};
/** Runtime control surface for a realtime transcription session. */
type RealtimeTranscriptionSession = {
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  close(): void;
  isConnected(): boolean;
};
//#endregion
//#region src/talk/provider-types.d.ts
type RealtimeVoiceProviderId = string;
type RealtimeVoiceRole = "user" | "assistant";
type RealtimeVoiceCloseReason = "completed" | "error";
type RealtimeVoiceAudioFormat = {
  encoding: "g711_ulaw";
  sampleRateHz: 8000;
  channels: 1;
} | {
  encoding: "pcm16";
  sampleRateHz: 24000;
  channels: 1;
};
type RealtimeVoiceTool = {
  type: "function";
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};
type RealtimeVoiceToolCallEvent = {
  itemId: string;
  callId: string;
  name: string;
  args: unknown;
};
type RealtimeVoiceToolResultOptions = {
  /**
   * Submit the tool result without prompting the realtime provider to generate a new assistant
   * response. Use when another channel has already delivered the user-visible answer.
   */
  suppressResponse?: boolean;
  willContinue?: boolean;
};
type RealtimeVoiceBridgeEvent = {
  direction: "client" | "server";
  type: string;
  detail?: string;
  itemId?: string;
  responseId?: string;
};
type RealtimeVoiceResponseError = {
  code?: string;
  message?: string;
  type?: string;
};
type RealtimeVoiceResponseOutcomeBase = {
  responseId?: string;
};
type RealtimeVoiceResponseOutcome = (RealtimeVoiceResponseOutcomeBase & {
  status: "completed";
}) | (RealtimeVoiceResponseOutcomeBase & {
  status: "cancelled";
  reason?: string;
}) | (RealtimeVoiceResponseOutcomeBase & {
  status: "failed" | "incomplete";
  reason?: string;
  error?: RealtimeVoiceResponseError;
  message: string;
});
type RealtimeVoiceAudioClearReason = "barge-in";
type RealtimeVoiceBridgeCallbacks = {
  onAudio: (audio: Buffer) => void;
  onClearAudio: (reason?: RealtimeVoiceAudioClearReason) => void;
  onMark?: (markName: string) => void;
  onTranscript?: (role: RealtimeVoiceRole, text: string, isFinal: boolean) => void;
  onEvent?: (event: RealtimeVoiceBridgeEvent) => void;
  onResponseDone?: (outcome: RealtimeVoiceResponseOutcome) => void;
  onToolCall?: (event: RealtimeVoiceToolCallEvent) => void;
  onReady?: () => void;
  onError?: (error: Error) => void;
  onClose?: (reason: RealtimeVoiceCloseReason) => void;
};
type RealtimeVoiceProviderConfig = Record<string, unknown>;
type RealtimeVoiceProviderCapabilities = {
  transports: TalkTransport[];
  inputAudioFormats: RealtimeVoiceAudioFormat[];
  outputAudioFormats: RealtimeVoiceAudioFormat[];
  supportsBrowserSession?: boolean;
  supportsBargeIn?: boolean; /** True when provider VAD reports confirmed interruptions through onClearAudio("barge-in"). */
  handlesInputAudioBargeIn?: boolean;
  supportsToolCalls?: boolean; /** True when user transcripts are reliable enough to gate responses on a leading wake name. */
  supportsActivationNameGating?: boolean;
  supportsVideoFrames?: boolean;
  supportsSessionResumption?: boolean;
};
type RealtimeVoiceProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
};
type RealtimeVoiceAgentConsultRunner = (params: {
  prompt: string;
  signal?: AbortSignal;
}) => Promise<{
  text: string;
}>;
type RealtimeVoiceBridgeCreateRequest = RealtimeVoiceBridgeCallbacks & {
  cfg?: OpenClawConfig; /** Host-selected agent scope for provider auth and agent-owned bridge state. */
  agentId?: string;
  providerConfig: RealtimeVoiceProviderConfig;
  audioFormat?: RealtimeVoiceAudioFormat;
  instructions?: string;
  language?: string;
  autoRespondToAudio?: boolean;
  interruptResponseOnInputAudio?: boolean;
  tools?: RealtimeVoiceTool[]; /** Host-injected agent delegation runner for provider-owned realtime control channels. */
  runAgentConsult?: RealtimeVoiceAgentConsultRunner;
};
type RealtimeVoiceBrowserSessionCreateRequest = {
  cfg?: OpenClawConfig;
  providerConfig: RealtimeVoiceProviderConfig;
  instructions?: string;
  tools?: RealtimeVoiceTool[];
  model?: string;
  voice?: string;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  reasoningEffort?: string; /** Host-injected agent delegation runner for provider-owned realtime control channels. */
  runAgentConsult?: RealtimeVoiceAgentConsultRunner; /** Host-owned control callbacks for browser media sessions whose provider wire stays server-side. */
  gatewayControl?: RealtimeVoiceGatewayControl;
};
/** Narrow host/plugin seam for Gateway-owned control of a client-owned media session. */
type RealtimeVoiceGatewayControl = Omit<RealtimeVoiceBridgeCallbacks, "onAudio" | "onClearAudio" | "onMark"> & {
  bindBridge: (bridge: RealtimeVoiceBridge) => void;
};
type RealtimeVoiceBrowserAudioContract = {
  inputEncoding: "pcm16" | "g711_ulaw";
  inputSampleRateHz: number;
  outputEncoding: "pcm16" | "g711_ulaw";
  outputSampleRateHz: number;
};
type RealtimeVoiceBrowserWebRtcSdpSession = {
  provider: RealtimeVoiceProviderId;
  transport: "webrtc";
  clientSecret: string;
  offerUrl?: string;
  offerHeaders?: Record<string, string>;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserJsonPcmWebSocketSession = {
  provider: RealtimeVoiceProviderId;
  transport: "provider-websocket";
  protocol: string;
  clientSecret: string;
  websocketUrl: string;
  audio: RealtimeVoiceBrowserAudioContract;
  initialMessage?: unknown;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserGatewayRelaySession = {
  provider: RealtimeVoiceProviderId;
  transport: "gateway-relay";
  relaySessionId: string;
  audio: RealtimeVoiceBrowserAudioContract;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserManagedRoomSession = {
  provider: RealtimeVoiceProviderId;
  transport: "managed-room";
  roomUrl: string;
  token?: string;
  model?: string;
  voice?: string;
  expiresAt?: number;
};
type RealtimeVoiceBrowserSession = RealtimeVoiceBrowserWebRtcSdpSession | RealtimeVoiceBrowserJsonPcmWebSocketSession | RealtimeVoiceBrowserGatewayRelaySession | RealtimeVoiceBrowserManagedRoomSession;
type RealtimeVoiceBridge = {
  supportsToolResultContinuation?: boolean; /** False when the provider cannot accept a tool result without starting a response. */
  supportsToolResultSuppression?: boolean; /** Per-session override for provider-confirmed input-audio barge-in handling. */
  handlesInputAudioBargeIn?: boolean;
  connect(): Promise<void>;
  sendAudio(audio: Buffer): void;
  setMediaTimestamp(ts: number): void;
  sendUserMessage?(text: string, options?: {
    toolChoice?: {
      type: "function";
      name: string;
    };
  }): void;
  triggerGreeting?(instructions?: string): void;
  handleBargeIn?(options?: RealtimeVoiceBargeInOptions): void;
  /**
   * Returns void when submission completes synchronously, or a Promise that resolves at the
   * asynchronous completion boundary exposed by the provider and rejects on submission failure.
   */
  submitToolResult(callId: string, result: unknown, options?: RealtimeVoiceToolResultOptions): void | Promise<void>;
  acknowledgeMark(markName?: string): void;
  close(): void;
  isConnected(): boolean;
};
type RealtimeVoiceBargeInOptions = {
  /**
   * The caller has already confirmed assistant audio is still playing in its output sink.
   * This lets providers interrupt output even when the sink cannot provide real playback marks.
   */
  audioPlaybackActive?: boolean; /** Interrupt even when normal barge-in audio-duration guards would treat the event as echo. */
  force?: boolean;
};
//#endregion
//#region src/transcripts/provider-types.d.ts
/**
 * Public contracts for transcript source providers.
 *
 * Providers can stream live utterances, import post-hoc transcript text, expose
 * status, and stop active sessions using shared session/source descriptors.
 */
/** Supported source families for transcript providers. */
type TranscriptSourceKind = "live-audio" | "live-caption" | "posthoc-transcript" | "recording-stt";
/** Provider-specific locator for a live, recorded, or imported transcript source. */
type TranscriptSourceLocator = {
  providerId: string;
  kind?: TranscriptSourceKind;
  accountId?: string;
  guildId?: string;
  channelId?: string;
  meetingUrl?: string;
  threadTs?: string;
  fileId?: string;
  [key: string]: string | undefined;
};
/** Speaker/participant identity attached to an utterance. */
type TranscriptParticipant = {
  id?: string;
  label: string;
};
/** One captured or imported transcript utterance. */
type TranscriptUtterance = {
  id?: string;
  sessionId?: string;
  startedAt?: string;
  endedAt?: string;
  speaker?: TranscriptParticipant;
  text: string;
  final?: boolean;
  metadata?: Record<string, unknown>;
};
/** Durable transcript session metadata. */
type TranscriptSessionDescriptor = {
  sessionId: string;
  title?: string;
  source: TranscriptSourceLocator;
  startedAt: string;
  stoppedAt?: string;
  metadata?: Record<string, unknown>;
};
/** Request passed to providers that can start live transcript capture. */
type TranscriptStartRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  abortSignal?: AbortSignal;
  startupWaitMs?: number;
  onUtterance: (utterance: TranscriptUtterance) => void | Promise<void>;
  onStatus?: (status: TranscriptSourceStatus) => void | Promise<void>;
};
/**
 * Result from starting a transcript source provider.
 *
 * Providers retain cleanup ownership until they return `ok: true`. A failed or
 * rejected start must release any partial capture before it settles.
 */
type TranscriptsStartResult = {
  ok: true;
  session: TranscriptSessionDescriptor;
} | {
  ok: false;
  error: string;
};
/** Request passed to providers that can stop live transcript capture. */
type TranscriptStopRequest = {
  cfg?: OpenClawConfig;
  sessionId: string;
  source: TranscriptSourceLocator;
  reason?: string;
};
/** Result from stopping a transcript source provider. */
type TranscriptsStopResult = {
  ok: true;
  sessionId: string;
  stoppedAt?: string;
} | {
  ok: false;
  error: string;
};
/** Runtime status reported by transcript source providers. */
type TranscriptSourceStatus = {
  sessionId?: string;
  active: boolean;
  message?: string;
  source?: TranscriptSourceLocator;
};
/** Request passed to providers that import post-hoc transcript text. */
type TranscriptImportRequest = {
  cfg?: OpenClawConfig;
  session: TranscriptSessionDescriptor;
  text: string;
  speakerLabel?: string;
};
/** Provider contract for transcript capture/import integrations. */
type TranscriptSourceProvider$1 = {
  id: string;
  aliases?: readonly string[];
  name: string;
  sourceKinds: readonly TranscriptSourceKind[];
  start?: (request: TranscriptStartRequest) => Promise<TranscriptsStartResult>;
  stop?: (request: TranscriptStopRequest) => Promise<TranscriptsStopResult>;
  status?: (source: TranscriptSourceLocator, cfg?: OpenClawConfig) => Promise<TranscriptSourceStatus[]>;
  importTranscript?: (request: TranscriptImportRequest) => Promise<TranscriptUtterance[]>;
};
//#endregion
//#region src/tts/provider-types.d.ts
/** Canonical speech provider identifier after provider registry normalization. */
type SpeechProviderId = string;
/** Output context requested from a speech provider. */
type SpeechSynthesisTarget = "audio-file" | "voice-note" | "telephony";
/** Provider-owned normalized config map. */
type SpeechProviderConfig = Record<string, unknown>;
/** Provider-owned per-request directive/persona overrides. */
type SpeechProviderOverrides = Record<string, unknown>;
/** Policy controlling which [[tts:*]] directive fields can affect synthesis. */
type SpeechModelOverridePolicy = {
  enabled: boolean;
  allowText: boolean;
  allowProvider: boolean;
  allowVoice: boolean;
  allowModelId: boolean;
  allowVoiceSettings: boolean;
  allowNormalization: boolean;
  allowSeed: boolean;
};
/** Parsed directive overrides grouped by provider. */
type TtsDirectiveOverrides = {
  ttsText?: string;
  provider?: SpeechProviderId;
  providerOverrides?: Record<string, SpeechProviderOverrides>;
};
/** Result of parsing TTS directives from message text. */
type TtsDirectiveParseResult = {
  cleanedText: string;
  ttsText?: string;
  hasDirective: boolean;
  overrides: TtsDirectiveOverrides;
  warnings: string[];
};
/** Context for checking whether a provider has enough config to synthesize. */
type SpeechProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  timeoutMs: number;
};
/** Request for buffered speech synthesis. */
type SpeechSynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Buffered speech synthesis result plus file/voice-note compatibility metadata. */
type SpeechSynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
};
type SpeechSynthesisStreamRequest = SpeechSynthesisRequest;
/** Streaming speech synthesis result; release frees provider transport resources. */
type SpeechSynthesisStreamResult = {
  audioStream: ReadableStream<Uint8Array>;
  outputFormat: string;
  fileExtension: string;
  voiceCompatible: boolean;
  release?: () => Promise<void>;
};
/** Telephony synthesis request for provider output that needs a fixed sample rate. */
type SpeechTelephonySynthesisRequest = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  timeoutMs: number;
};
/** Telephony synthesis result with sample-rate metadata for call transports. */
type SpeechTelephonySynthesisResult = {
  audioBuffer: Buffer;
  outputFormat: string;
  sampleRate: number;
};
/** Provider hook input for applying persona/config before synthesis. */
type SpeechProviderPrepareSynthesisContext = {
  text: string;
  cfg: OpenClawConfig;
  providerConfig: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
  persona?: ResolvedTtsPersona;
  personaProviderConfig?: SpeechProviderConfig;
  target: SpeechSynthesisTarget;
  timeoutMs: number;
};
/** Optional provider-prepared synthesis overrides. */
type SpeechProviderPreparedSynthesis = {
  text?: string;
  providerConfig?: SpeechProviderConfig;
  providerOverrides?: SpeechProviderOverrides;
};
/** Voice metadata returned by provider list-voices hooks. */
type SpeechVoiceOption = {
  id: string;
  name?: string;
  category?: string;
  description?: string;
  locale?: string;
  gender?: string;
  personalities?: string[];
};
/** Provider voice-listing request with optional direct auth/URL overrides. */
type SpeechListVoicesRequest = {
  cfg?: OpenClawConfig;
  providerConfig?: SpeechProviderConfig;
  apiKey?: string;
  baseUrl?: string; /** Core-resolved request timeout after config and provider defaults. */
  timeoutMs?: number;
};
/** Provider hook input for resolving normalized config from raw OpenClaw config. */
type SpeechProviderResolveConfigContext = {
  cfg: OpenClawConfig;
  rawConfig: Record<string, unknown>;
  timeoutMs: number;
};
/** One parsed directive key/value plus current provider override state. */
type SpeechDirectiveTokenParseContext = {
  key: string;
  value: string;
  policy: SpeechModelOverridePolicy;
  selectedProvider?: SpeechProviderId;
  providerConfig?: SpeechProviderConfig;
  currentOverrides?: SpeechProviderOverrides;
};
/** Provider directive parser result. */
type SpeechDirectiveTokenParseResult = {
  handled: boolean;
  overrides?: SpeechProviderOverrides;
  warnings?: string[];
};
/** Provider hook input for resolving talk-command speech config. */
type SpeechProviderResolveTalkConfigContext = {
  cfg: OpenClawConfig;
  baseTtsConfig: Record<string, unknown>;
  talkProviderConfig: TalkProviderConfig;
  timeoutMs: number;
};
/** Provider hook input for per-call talk-command overrides. */
type SpeechProviderResolveTalkOverridesContext = {
  talkProviderConfig: TalkProviderConfig;
  params: Record<string, unknown>;
};
//#endregion
//#region src/video-generation/types.d.ts
type GeneratedVideoAsset = {
  /** Non-empty raw video bytes for local delivery; may accompany url as a fallback. */buffer?: Buffer;
  /** Provider-hosted URL returned instead of bytes or alongside them as a delivery fallback.
   * When buffer is absent, surfaces can forward the URL without materializing the video. */
  url?: string;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
type VideoGenerationResolution = "360P" | "480P" | "540P" | "720P" | "768P" | "1080P" | (string & {});
/**
 * Canonical semantic role hints for reference assets. The list covers the
 * near-universal I2V vocabulary plus per-kind reference roles. Providers may
 * accept additional role strings (extend the asset.role type with a plain
 * string at call sites) — core forwards whatever value is set.
 */
type VideoGenerationAssetRole = "first_frame" | "last_frame" | "reference_image" | "reference_video" | "reference_audio";
type VideoGenerationSourceAsset = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  /**
   * Optional semantic role hint forwarded to the provider. Canonical values
   * come from `VideoGenerationAssetRole`; plain strings are accepted for
   * provider-specific extensions. Core does not validate the value beyond
   * shape.
   */
  role?: VideoGenerationAssetRole | (string & {});
  metadata?: Record<string, unknown>;
};
type VideoGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
type VideoGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number; /** Enable generated audio in the output when the provider supports it. Distinct from inputAudios (reference audio input). */
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[]; /** Reference audio assets (e.g. background music). Role field on each asset is forwarded to the provider as-is. */
  inputAudios?: VideoGenerationSourceAsset[]; /** Arbitrary provider-specific options forwarded as-is to provider.generateVideo. Core does not validate or log the contents. */
  providerOptions?: Record<string, unknown>;
};
type VideoGenerationModelCapabilitiesContext = {
  provider: string;
  model: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};
type VideoGenerationResult = {
  videos: GeneratedVideoAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};
type VideoGenerationIgnoredOverride = {
  key: "size" | "aspectRatio" | "resolution" | "audio" | "watermark";
  value: string | boolean;
};
type VideoGenerationMode = "generate" | "imageToVideo" | "videoToVideo";
/**
 * Primitive type tag for a declared `providerOptions` key. Core validates
 * the agent-supplied value against this tag before forwarding it to the
 * provider. Kept deliberately narrow — plugins that need richer shapes
 * should keep those fields out of the typed contract and reinterpret the
 * forwarded opaque value inside their own provider code.
 */
type VideoGenerationProviderOptionType = "number" | "boolean" | "string";
type VideoGenerationModeCapabilities = {
  maxVideos?: number;
  maxInputImages?: number;
  maxInputImagesByModel?: Readonly<Record<string, number>>;
  maxInputVideos?: number;
  maxInputVideosByModel?: Readonly<Record<string, number>>; /** Max number of reference audio assets the provider accepts (e.g. background music, voice reference). */
  maxInputAudios?: number;
  maxInputAudiosByModel?: Readonly<Record<string, number>>;
  maxDurationSeconds?: number;
  supportedDurationSeconds?: readonly number[];
  supportedDurationSecondsByModel?: Readonly<Record<string, readonly number[]>>;
  sizes?: readonly string[];
  aspectRatios?: readonly string[];
  resolutions?: readonly VideoGenerationResolution[];
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean; /** Provider can generate audio in the output video. */
  supportsAudio?: boolean;
  supportsWatermark?: boolean;
  /**
   * Declared typed schema for the opaque `VideoGenerationRequest.providerOptions`
   * bag. Keys listed here are accepted; any other keys the agent passes are
   * rejected at the runtime fallback boundary so mis-typed or provider-specific
   * options never silently reach the wrong provider. Plugins that currently
   * accept no providerOptions should leave this undefined or set to `{}`.
   */
  providerOptions?: Readonly<Record<string, VideoGenerationProviderOptionType>>;
};
type VideoGenerationTransformCapabilities = VideoGenerationModeCapabilities & {
  enabled: boolean;
};
type VideoGenerationProviderCapabilities = VideoGenerationModeCapabilities & {
  generate?: VideoGenerationModeCapabilities;
  imageToVideo?: VideoGenerationTransformCapabilities;
  videoToVideo?: VideoGenerationTransformCapabilities;
};
/** Static catalog metadata that overrides provider defaults for one video model. */
type VideoGenerationCatalogModelEntry = {
  capabilities?: VideoGenerationProviderCapabilities;
  modes?: readonly VideoGenerationMode[];
};
type VideoGenerationNormalization = {
  size?: MediaNormalizationEntry<string>;
  aspectRatio?: MediaNormalizationEntry<string>;
  resolution?: MediaNormalizationEntry<VideoGenerationResolution>;
  durationSeconds?: MediaNormalizationEntry<number>;
};
type VideoGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string; /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: VideoGenerationProviderCapabilities;
  catalogByModel?: Readonly<Record<string, VideoGenerationCatalogModelEntry>>;
  isConfigured?: (ctx: VideoGenerationProviderConfiguredContext) => boolean;
  resolveModelCapabilities?: (ctx: VideoGenerationModelCapabilitiesContext) => VideoGenerationProviderCapabilities | undefined | Promise<VideoGenerationProviderCapabilities | undefined>;
  generateVideo: (req: VideoGenerationRequest) => Promise<VideoGenerationResult>;
};
//#endregion
//#region src/plugins/host-hooks.d.ts
/** Reason passed to plugin cleanup callbacks when host-owned state changes. */
type PluginHostCleanupReason = "disable" | "reset" | "delete" | "restart";
type PluginSessionExtensionProjectionContext = {
  sessionKey: string;
  sessionId?: string;
  state: PluginJsonValue | undefined;
};
/** Session extension registration owned by a plugin namespace. */
type PluginSessionExtensionRegistration = {
  namespace: string;
  description: string;
  project?: (ctx: PluginSessionExtensionProjectionContext) => PluginJsonValue | undefined;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
  }) => void | Promise<void>;
  /**
   * When set, after every successful `patchSessionExtension` the projected
   * value is mirrored to `SessionEntry[<slotKey>]` so non-plugin readers
   * can consume the typed slot without reaching into
   * `pluginExtensions[pluginId][namespace]`.
   *
   * The slot is a read-only mirror: writes always go through
   * `patchSessionExtension`; the host overwrites the slot value on every
   * subsequent patch.
   */
  sessionEntrySlotKey?: string;
  /**
   * Optional JSON-compatible schema describing the projected slot value.
   * Purely informational at this layer; clients may use it to validate the
   * mirrored slot against a contract.
   */
  sessionEntrySlotSchema?: PluginJsonValue;
};
type PluginSessionExtensionProjection = {
  pluginId: string;
  namespace: string;
  value: PluginJsonValue;
};
type PluginToolPolicyDecision = PluginHookBeforeToolCallResult | {
  allow?: boolean;
  reason?: string;
};
type PluginTrustedToolPolicyRegistration = {
  id: string;
  description: string;
  matcher?: PluginToolMatcher;
  evaluate: (event: PluginHookBeforeToolCallEvent, ctx: PluginHookToolContext) => PluginToolPolicyDecision | void | Promise<PluginToolPolicyDecision | void>;
};
type PluginToolMetadataRegistration = {
  toolName: string;
  displayName?: string;
  description?: string;
  risk?: "low" | "medium" | "high";
  tags?: string[];
};
type PluginControlUiTabGroup = "control" | "agent";
type PluginControlUiDescriptor = {
  id: string; /** "tab" adds a sidebar tab; "widget" advertises a trusted dashboard renderer. */
  surface: "session" | "tool" | "run" | "settings" | "tab" | "widget";
  label: string;
  description?: string;
  placement?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[]; /** Icon name hint for tab descriptors; unknown names fall back to a generic icon. */
  icon?: string;
  /**
   * Gateway HTTP path (e.g. /plugins/<id>/panel) rendered in a sandboxed frame
   * when the Control UI has no bundled view for this tab.
   */
  path?: string; /** Sidebar group for tab descriptors; defaults to "control". */
  group?: PluginControlUiTabGroup; /** Sort order among plugin tabs; lower renders first. */
  order?: number;
};
type PluginSessionActionContext = {
  pluginId: string;
  actionId: string;
  sessionKey?: string;
  agentId?: string;
  payload?: PluginJsonValue;
  client?: {
    connId?: string;
    scopes: string[];
  };
};
type PluginSessionActionResult = {
  ok?: true;
  result?: PluginJsonValue;
  reply?: PluginJsonValue;
  continueAgent?: boolean;
} | {
  ok: false;
  error: string;
  code?: string;
  details?: PluginJsonValue;
};
type PluginSessionActionRegistration = {
  id: string;
  description?: string;
  schema?: PluginJsonValue;
  requiredScopes?: OperatorScope[];
  handler: (ctx: PluginSessionActionContext) => PluginSessionActionResult | void | Promise<PluginSessionActionResult | void>;
};
type PluginRuntimeLifecycleRegistration = {
  id: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey?: string;
    runId?: string;
  }) => void | Promise<void>;
};
type PluginAgentEventSubscriptionRegistration = {
  id: string;
  description?: string;
  streams?: AgentEventStream[];
  handle: (event: AgentEventPayload, ctx: {
    getRunContext: <T extends PluginJsonValue = PluginJsonValue>(namespace: string) => T | undefined;
    setRunContext: (namespace: string, value: PluginJsonValue) => void;
    clearRunContext: (namespace?: string) => void;
  }) => void | Promise<void>;
};
type PluginAgentEventEmitParams = {
  runId: string;
  stream: AgentEventStream;
  data: PluginJsonValue;
  sessionKey?: string;
};
type PluginAgentEventEmitResult = {
  emitted: true;
  stream: AgentEventStream;
} | {
  emitted: false;
  reason: string;
};
type PluginRunContextPatch = {
  runId: string;
  namespace: string;
  value?: PluginJsonValue;
  unset?: boolean;
};
type PluginRunContextGetParams = {
  runId: string;
  namespace: string;
};
type PluginSessionSchedulerJobRegistration = {
  id: string;
  sessionKey: string;
  kind: string;
  description?: string;
  cleanup?: (ctx: {
    reason: PluginHostCleanupReason;
    sessionKey: string;
    jobId: string;
  }) => void | Promise<void>;
};
type PluginSessionSchedulerJobHandle = {
  id: string;
  pluginId: string;
  sessionKey: string;
  kind: string;
};
type PluginSessionAttachmentFile = {
  path: string;
};
type PluginAttachmentChannelHints = {
  parseMode?: "HTML";
  silent?: boolean; /** Require host detection to match this MIME before forcing document delivery. */
  forceDocumentMime?: string;
  threadId?: string | number; /** @deprecated Put portable attachment hints directly on `channelHints`. */
  telegram?: {
    parseMode?: "HTML";
    disableNotification?: boolean;
    /**
     * Require host-side detection to match this MIME before forcing document delivery.
     * Mismatched files are rejected before the outbound adapter is called.
     */
    forceDocumentMime?: string;
  }; /** @deprecated Use `channelHints.threadId`. */
  slack?: {
    threadTs?: string;
  };
};
type PluginSessionAttachmentCaptionFormat = "plain" | "html" | "markdown";
type PluginSessionAttachmentParams = {
  sessionKey: string;
  files: PluginSessionAttachmentFile[];
  text?: string;
  threadId?: string | number;
  forceDocument?: boolean;
  maxBytes?: number;
  captionFormat?: PluginSessionAttachmentCaptionFormat;
  channelHints?: PluginAttachmentChannelHints;
};
type PluginSessionAttachmentResult = {
  ok: true;
  channel: string;
  deliveredTo: string;
  count: number;
} | {
  ok: false;
  error: string;
};
type PluginSessionTurnScheduleCommonParams = {
  sessionKey: string;
  message: string;
  agentId?: string;
  deliveryMode?: "none" | "announce";
  name?: string; /** Optional cleanup tag. Reserved cron-name delimiters like `:` are rejected. */
  tag?: string;
};
type PluginSessionTurnScheduleParams = ({
  at: string | number | Date;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  delayMs: number;
  deleteAfterRun?: boolean;
} & PluginSessionTurnScheduleCommonParams) | ({
  cron: string;
  tz?: string;
  deleteAfterRun?: false;
} & PluginSessionTurnScheduleCommonParams);
type PluginSessionTurnUnscheduleByTagParams = {
  sessionKey: string;
  tag: string;
};
type PluginSessionTurnUnscheduleByTagResult = {
  removed: number;
  failed: number;
};
//#endregion
//#region src/plugins/capability-provider.types.d.ts
/** JSON-compatible provider settings for one configured worker profile. */
type WorkerProfile = Readonly<Record<string, PluginJsonValue>>;
/** SSH endpoint material returned by a worker provider after provisioning. */
type WorkerSshEndpoint = {
  host: string;
  port: number;
  /**
   * Up to 10 ordered unique integer ports (1..65535) after `port`; excludes the primary.
   * Core rotates only for idempotent probes, content-addressed transfers, receipt/lock-guarded
   * artifact installation, convergent managed-worktree mirroring, and tunnel reconnects.
   * Ambiguous unguarded stateful commands fail closed and are not replayed.
   */
  fallbackPorts?: readonly number[];
  user: string; /** OpenSSH public host-key line obtained from trusted provisioning output. */
  hostKey: string; /** Secret reference only; providers must never return plaintext key material. */
  keyRef: SecretRef;
};
/** Resolved SSH client identity. Providers may return a local path or ephemeral material. */
type WorkerSshIdentity = {
  kind: "path";
  path: string;
} | {
  kind: "material";
  contents: string;
};
/** Durable context supplied when a worker provider resolves the identity it minted. */
type WorkerSshIdentityRequest = {
  leaseId: string;
  profile: WorkerProfile;
  keyRef: SecretRef;
};
/** Closed set of applications installed and launchable on a provisioned worker desktop. */
type WorkerDesktopApp = {
  id: "browser";
  executablePath: string;
  cdpPort: number;
} | {
  id: "terminal";
  executablePath: string;
};
/** Optional interactive desktop endpoint provisioned with the lease (warm-time capability). */
type WorkerDesktopEndpoint = {
  /** Desktop service protocol on the worker loopback; "rfb" is the only phase-1 value. */protocol: "rfb"; /** Loopback port on the worker (e.g. 5900). */
  port: number; /** Absolute on-box path to the per-lease password file; read over SSH, never persisted as plaintext. */
  passwordFilePath?: string; /** Closed application metadata advertised by the provider for this desktop. */
  apps?: WorkerDesktopApp[];
};
/** Durable lease identity and endpoint returned by a successful provision operation. */
type WorkerLease = {
  leaseId: string; /** The SSH account also owns processes unrelated to this worker lease. */
  sharedHost?: boolean;
  desktop?: WorkerDesktopEndpoint;
} & ({
  ssh: WorkerSshEndpoint;
  node?: never;
} | {
  node: {
    deviceId: string;
  };
  ssh?: never;
});
/** Authoritative inspection result for an already-known worker lease. */
type WorkerLeaseStatus = {
  status: "active"; /** Explicit provider fact used to reconcile leases persisted before this metadata existed. */
  sharedHost?: boolean;
} | {
  status: "dormant";
} | {
  status: "destroyed";
} | {
  status: "unknown";
};
/** Permanent provider rejection recorded as a terminal worker failure. */
declare class WorkerProviderError extends Error {
  readonly code = "invalid_profile";
  constructor(message: string);
}
/** Cloud-worker lifecycle capability registered by a plugin. */
type WorkerProvider = {
  id: string;
  /**
   * Provision before preparing an installation when the lease transport decides whether an
   * installation is needed. Defaults to false so SSH providers retain prepare-before-allocation.
   */
  provisionBeforeInstallation?: boolean;
  /**
   * Provision or adopt the lease for this operation id.
   * Repeating the same operation id must be idempotent across gateway restarts.
   */
  provision: (profile: WorkerProfile, operationId: string) => Promise<WorkerLease>; /** Maximum core wait for one provision attempt, including provider-owned setup and cleanup. */
  resolveProvisionTimeoutMs?: (profile: WorkerProfile) => number; /** Throws on transient/indeterminate failures; `unknown` means authoritative absence. */
  inspect: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<WorkerLeaseStatus>;
  /**
   * Resolves provider-owned dynamic identities. When absent, the gateway uses its generic
   * SecretRef resolver; when present, failures are authoritative and never fall back.
   */
  resolveSshIdentity?: (request: WorkerSshIdentityRequest) => Promise<WorkerSshIdentity>;
  renew?: (leaseId: string) => Promise<void>; /** Idempotent; resolves only after the provider can prove teardown. */
  destroy: (lease: {
    leaseId: string;
    profile: WorkerProfile;
  }) => Promise<void>;
};
/** Speech capability registered by a plugin. */
type SpeechProviderPlugin = {
  id: SpeechProviderId;
  label: string;
  aliases?: string[];
  autoSelectOrder?: number; /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  defaultModel?: string;
  models?: readonly string[];
  voices?: readonly string[];
  resolveConfig?: (ctx: SpeechProviderResolveConfigContext) => SpeechProviderConfig;
  parseDirectiveToken?: (ctx: SpeechDirectiveTokenParseContext) => SpeechDirectiveTokenParseResult;
  resolveTalkConfig?: (ctx: SpeechProviderResolveTalkConfigContext) => SpeechProviderConfig;
  resolveTalkOverrides?: (ctx: SpeechProviderResolveTalkOverridesContext) => SpeechProviderConfig | undefined;
  prepareSynthesis?: (ctx: SpeechProviderPrepareSynthesisContext) => SpeechProviderPreparedSynthesis | undefined | Promise<SpeechProviderPreparedSynthesis | undefined>;
  isConfigured: (ctx: SpeechProviderConfiguredContext) => boolean;
  synthesize: (req: SpeechSynthesisRequest) => Promise<SpeechSynthesisResult>;
  streamSynthesize?: (req: SpeechSynthesisStreamRequest) => Promise<SpeechSynthesisStreamResult>;
  synthesizeTelephony?: (req: SpeechTelephonySynthesisRequest) => Promise<SpeechTelephonySynthesisResult>;
  listVoices?: (req: SpeechListVoicesRequest) => Promise<SpeechVoiceOption[]>;
};
/** Realtime transcription capability registered by a plugin. */
type RealtimeTranscriptionProviderPlugin = {
  id: RealtimeTranscriptionProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[];
  autoSelectOrder?: number;
  resolveConfig?: (ctx: RealtimeTranscriptionProviderResolveConfigContext) => RealtimeTranscriptionProviderConfig;
  isConfigured: (ctx: RealtimeTranscriptionProviderConfiguredContext) => boolean;
  createSession: (req: RealtimeTranscriptionSessionCreateRequest) => RealtimeTranscriptionSession;
};
/** Transcript source capability registered by a channel or meeting plugin. */
type TranscriptSourceProvider = TranscriptSourceProvider$1;
/** Realtime voice capability registered by a plugin. */
type RealtimeVoiceProviderPlugin = {
  id: RealtimeVoiceProviderId;
  label: string;
  aliases?: string[];
  defaultModel?: string;
  models?: readonly string[]; /** Known speaker voices for pickers; providers still accept free-form values. */
  voices?: readonly string[];
  autoSelectOrder?: number;
  capabilities?: RealtimeVoiceProviderCapabilities;
  resolveConfig?: (ctx: RealtimeVoiceProviderResolveConfigContext) => RealtimeVoiceProviderConfig;
  isConfigured: (ctx: RealtimeVoiceProviderConfiguredContext) => boolean;
  createBridge: (req: RealtimeVoiceBridgeCreateRequest) => RealtimeVoiceBridge;
  createBrowserSession?: (req: RealtimeVoiceBrowserSessionCreateRequest) => Promise<RealtimeVoiceBrowserSession>;
};
type MediaUnderstandingProviderPlugin = MediaUnderstandingProvider;
type ImageGenerationProviderPlugin = ImageGenerationProvider;
type VideoGenerationProviderPlugin = VideoGenerationProvider;
type MusicGenerationProviderPlugin = MusicGenerationProvider;
//#endregion
//#region src/worker/tool-authority.d.ts
declare const WORKER_TOOL_NAMES: readonly ["read", "write", "edit", "apply_patch", "exec", "process", "browser", "sessions_spawn", "sessions_send"];
type WorkerToolName = (typeof WORKER_TOOL_NAMES)[number];
type WorkerToolAuthority = {
  allowedToolNames: WorkerToolName[];
};
//#endregion
//#region src/worker/launch-descriptor.d.ts
type WorkerBrowserLaunchDescriptor = {
  cdpUrl: string;
  launcherPath: string;
};
type WorkerLaunchAssignment = {
  /** Host placement namespace used for worker-local policy, hooks, and audit attribution. */agentId: string;
  operationalRunInstance: OperationalRunInstanceRef; /** Opaque host-signed runtime envelope; worker code never parses private identity. */
  agentRuntimeIdentityToken: string;
  runId: string;
  turnId: string;
  prompt: string;
  suppressPromptTranscript: boolean;
  workspaceDir: string;
  modelRef: WorkerInferenceModelRef;
  inferenceOptions: WorkerInferenceOptions;
  systemPrompt?: string;
  initialMessages: WorkerTranscriptMessage[];
  transcript: {
    baseLeafId: WorkerTranscriptCommitParams["baseLeafId"];
    nextSeq: number;
  };
  liveEvents: {
    ackedSeq: number;
    nextSeq: number;
  };
  toolAuthority: WorkerToolAuthority;
  browser?: WorkerBrowserLaunchDescriptor;
};
type WorkerLaunchAdmission = Omit<WorkerConnectParams["admission"], "runId"> & {
  sessionId: string;
};
type WorkerLaunchPlan = {
  version: 3;
  admission: WorkerLaunchAdmission;
  assignment: WorkerLaunchAssignment;
};
//#endregion
//#region src/worker/node-workspace-transfer-protocol.d.ts
type NodeWorkerWorkspaceTransferInput = {
  direction: "download";
  token: string;
  manifestRef: string;
} | {
  direction: "upload";
  token: string;
  baseManifestRef: string;
};
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-core.d.ts
type WorkerWorkspaceApplyResult = {
  manifestRef: string;
  manifest: WorkerWorkspaceManifest;
  conflictPaths: string[];
  verifyLocalStable(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/tunnel-contract.d.ts
type WorkerTunnelStatus = "stopped" | "connecting" | "connected" | "reconnecting";
type WorkerTunnelRequest = {
  environmentId: string;
  ownerEpoch: number;
};
type WorkerWorkspaceCommand = {
  argv: readonly string[];
  transportRetry: "idempotent" | "never";
  onDispatchReady?: () => void;
  input?: string;
  timeoutMs?: number;
  signal?: AbortSignal;
  transfer?: NodeWorkerWorkspaceTransferInput;
};
type WorkerWorkspaceSyncRequest = {
  localPath: string;
  sessionId: string;
  generation: number;
};
type WorkerWorkspaceSyncResult = {
  mode: "git" | "plain";
  remoteWorkspaceDir: string;
  manifestRef: string;
};
type WorkerWorkspaceReconcileRequest = {
  localPath: string;
  remoteWorkspaceDir: string;
  baseManifestRef: string;
  journal: WorkerWorkspaceReconciliationJournalAdapter;
  stagedResult?: {
    ref: string;
    record(ref: string): void;
  };
};
type WorkerWorkspaceReconcileResult = {
  manifestRef: string;
  changed: boolean; /** Re-read the remote workspace after local acceptance, immediately before teardown. */
  verifyStable(): Promise<void>; /** Re-read the accepted local result after the remote stability fence. */
  verifyLocalStable(): Promise<void>; /** Apply the prepared candidate locally without making it restart-authoritative. */
  applyPreparedStagedResult?(): Promise<void>; /** Return the accepted local manifest and any keep-local conflicts after apply. */
  getAppliedWorkspaceResult?(): WorkerWorkspaceApplyResult | undefined; /** Publish the verified candidate for restart recovery. */
  publishStagedResult?(): Promise<void>;
  discardPreparedStagedResult?(): Promise<void>;
};
type WorkerWorkspaceQuiescence = {
  /** Prove the watchdog lease still owns stopped processes and extend it through teardown. */assertActive(): Promise<void>; /** Resume only the remote processes stopped by this quiescence owner. */
  resume(): Promise<void>;
};
type WorkerTurnLaunchRequest = {
  plan: WorkerLaunchPlan;
  placementGeneration: number;
  timeoutMs?: number;
  signal?: AbortSignal;
  onDispatchReady?: () => void;
};
type WorkerTunnelHandle = {
  environmentId: string;
  ownerEpoch: number;
  launchTurn(request: WorkerTurnLaunchRequest): Promise<SpawnResult>;
  runWorkspaceCommand(command: WorkerWorkspaceCommand): Promise<SpawnResult>;
  quiesceWorkspace(remoteWorkspaceDir: string): Promise<WorkerWorkspaceQuiescence>;
  syncWorkspace(request: WorkerWorkspaceSyncRequest): Promise<WorkerWorkspaceSyncResult>;
  reconcileWorkspace(request: WorkerWorkspaceReconcileRequest): Promise<WorkerWorkspaceReconcileResult>;
  stop(): Promise<void>;
};
//#endregion
//#region src/gateway/worker-environments/service-contract.d.ts
/** Non-secret worker projection available to Gateway request handlers. */
type WorkerEnvironmentServiceRecord = {
  environmentId: string;
  providerId: string;
  leaseId: string | null;
  sharedHost: boolean | null;
  state: WorkerEnvironmentState;
  ownerEpoch: number;
  createdAtMs: number;
  idleSinceAtMs: number | null;
  attachedSessionIds: readonly string[];
  desktopAvailable: boolean;
  desktopApps: readonly WorkerDesktopApp["id"][];
  tunnelStatus: WorkerTunnelStatus;
  error?: string;
};
type WorkerDesktopObserveResult = {
  transport: "rfb";
  wsPath: string;
  expiresAtMs: number;
  control: boolean;
  vncPassword?: string;
};
type WorkerDesktopLaunchResult = {
  app: WorkerDesktopApp["id"];
  status: "ready";
};
/** Request-facing lifecycle methods, kept separate from persistence and provider internals. */
type WorkerEnvironmentServiceContract = {
  list(): WorkerEnvironmentServiceRecord[];
  get(environmentId: string): WorkerEnvironmentServiceRecord | undefined;
  create(profileId: string, idempotencyKey: string): Promise<WorkerEnvironmentServiceRecord>;
  destroy(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  destroyUnattached(environmentId: string): Promise<WorkerEnvironmentServiceRecord>;
  observeDesktop(request: {
    environmentId: string;
    control: boolean;
  }): Promise<WorkerDesktopObserveResult>;
  launchDesktopApp(request: {
    environmentId: string;
    app: WorkerDesktopApp["id"];
  }): Promise<WorkerDesktopLaunchResult>;
  startTunnel(request: WorkerTunnelRequest): Promise<WorkerTunnelHandle>;
  stopTunnel(environmentId: string, ownerEpoch?: number): Promise<void>;
};
type WorkerPlacementDispatchRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
  profileId: string;
  executionMode: WorkerPlacementExecutionMode;
  deviceId?: string;
  inheritedProfile?: {
    providerId: string;
    profileSnapshot: WorkerProfile;
  };
};
type WorkerPlacementReclaimRequest = {
  sessionId: string;
  sessionKey: string;
  agentId: string;
};
type WorkerPlacementDispatchContract = {
  dispatch(request: WorkerPlacementDispatchRequest): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "active";
  }>>;
  reclaim?(request: WorkerPlacementReclaimRequest): Promise<Extract<WorkerSessionPlacementRecord, {
    state: "local" | "reclaimed";
  }>>;
  forceDestroyEnvironment?(environmentId: string, onCleanupError?: (error: unknown) => void): Promise<WorkerEnvironmentServiceRecord>;
  reconcileActive?(environmentId?: string): Promise<void>;
};
//#endregion
//#region src/gateway/server-methods/chat-metadata-contract.d.ts
type ChatMetadataSessionEntry = {
  authProfileOverride?: string;
  authProfileOverrideSource?: "auto" | "user";
  authProfileOverrideCompactionCount?: number;
};
type ChatMetadataReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
};
type ChatMetadataResult = {
  commands?: unknown[];
  models?: unknown[];
  swarmEnabled: boolean;
};
//#endregion
//#region src/gateway/server-methods/chat-startup-projection-contract.d.ts
type ChatStartupProjectionReadParams = {
  agentId: string;
  sessionEntry?: ChatMetadataSessionEntry;
  includeSystem: boolean;
};
type ChatStartupProjectionResult = {
  metadata: ChatMetadataResult;
  sessionModelCatalog: ModelCatalogEntry[];
  defaultModelCatalog: ModelCatalogEntry[];
  agentsList: AgentsListResult;
};
//#endregion
//#region src/gateway/server-methods/session-creation-provenance.d.ts
type TrustedSessionCreation = {
  via: SessionCreatedVia;
  actor?: SessionCreatedActor; /** Immutable completion recipient for a spawn-owned visible session. */
  completionOwnerSessionKey?: string; /** Effective caller tool-policy snapshot for an in-process visible spawn. */
  inheritedToolPolicy?: {
    version: 1;
    allow: string[];
    deny: string[];
  };
};
//#endregion
//#region src/gateway/server-methods/shared-types.d.ts
/**
 * Shared gateway request types used by every server-method module.
 */
type SubsystemLogger = ReturnType<typeof createSubsystemLogger>;
/** Trusted in-process spawn control plane that already owns this run's task row.
    Gateway CLI tracking only covers runs nobody else records, so a marked run
    must never get a second row. */
type GatewayAgentRunTaskOwner = "plugin_subagent" | "native_subagent";
/** Per-connection client metadata captured after the gateway handshake. */
type GatewayClient = {
  connect: ConnectParams;
  connId?: string;
  presenceKey?: string;
  clientIp?: string; /** Client id verified against the server-approved device pairing record. */
  pairedClientId?: string;
  authenticatedUserId?: string; /** Verified Tailscale provider identity; generic proxy identities must not infer this. */
  authenticatedUserIsTailscaleProvider?: boolean;
  authenticatedUserProfile?: {
    profileId: string;
    displayName: string | null;
    avatarRevision?: string;
    hasAvatar: boolean;
    updatedAt: number;
  };
  pluginSurfaceUrls?: Record<string, string>;
  pluginNodeCapabilitySurfaces?: Record<string, PluginNodeCapabilitySurface>;
  pluginNodeCapabilities?: Record<string, {
    capability: string;
    expiresAtMs: number;
  }>;
  isDeviceTokenAuth?: boolean; /** Temporary legacy migration session closed when normal enforcement resumes. */
  isControlUiDeviceAuthMigrationSession?: boolean; /** Signed shared-auth session admitted only to approve its own upgrade pairing. */
  isControlUiDeviceAuthMigration?: boolean;
  internal?: {
    /** Handshake-attested direct-local transport; never accepted from wire params. */isLocalClient?: true; /** Marks the server-constructed client used by trusted in-process dispatch. */
    syntheticClient?: true; /** Overrides persisted sender attribution without changing the authorizing client identity. */
    senderAttribution?: {
      id: string;
      name?: string;
    }; /** Trusted session creation provenance; never accepted from Gateway wire params. */
    sessionCreation?: TrustedSessionCreation;
    allowModelOverride?: boolean;
    approvalRuntime?: boolean;
    cronRunContinuation?: boolean;
    agentRuntimeIdentity?: AgentRuntimeIdentity;
    pluginRuntimeOwnerId?: string;
    agentRunTracking?: GatewayAgentRunTaskOwner; /** Host-captured requester lineage for opt-in plugin subagent completion delivery. */
    pluginSubagentRequester?: PluginSubagentRequesterContext; /** Host-owned exact media set for a scoped automatic recovery delivery. */
    internalDeliveryMediaUrls?: string[];
    internalDeliverySuppressText?: boolean; /** Plugin-owned tools authorized for this internal subagent run. */
    runtimePluginToolGrant?: RuntimePluginToolGrant; /** Opaque in-process subagent-completion capability; never accepted from wire params. */
    delegatedToolPolicyHandoffId?: string;
  };
};
/** Callback used by method handlers to emit one protocol response frame. */
type RespondFn = (ok: boolean, payload?: unknown, error?: ErrorShape, meta?: Record<string, unknown>) => void;
/** Minimal hosted OpenClaw contract retained by the gateway request router. */
/**
 * Structural mirror of the engine's SystemAgentAssistantTurn. Kept local as a
 * leaf contract: importing the assistant module here closes a madge cycle
 * through the agents/config cluster.
 */
type SystemAgentHistoryTurn = {
  role: "user" | "assistant";
  text: string;
};
type GatewaySystemAgentSession = {
  engine: {
    handle: (message: string, options?: {
      uiContext?: {
        page: string;
      };
    }) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    answerWizard: (answer: WizardAnswer) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    cancelWizard: (cancel: SystemAgentWizardCancel) => Promise<{
      text: string;
      action: "none" | "exit" | "open-tui" | "open-setup";
      sensitive?: boolean;
      question?: SystemAgentChatQuestion;
    }>;
    seedHistory: (turns: readonly SystemAgentHistoryTurn[]) => void;
    historyLength: () => number;
    historySince: (index: number) => SystemAgentHistoryTurn[];
    getPendingOperatorProposal: () => {
      operation: SystemAgentOperation;
      hash: string;
    } | null;
    resolveOperatorApproval: (decision: "allow-once" | "allow-always" | "deny" | null, proposalHash: string) => Promise<unknown>;
    dispose: () => Promise<void>;
  };
  welcome: string;
  welcomeQuestion?: SystemAgentChatQuestion; /** Audit cursor captured with the pending caretaker welcome; cleared after delivery. */
  welcomeAuditSequence?: number;
  lastUsedAt: number;
  ownerKey: string;
  pendingApproval?: {
    id: string;
    proposalHash: string;
  };
};
/** Kernel-owned services and state that can be constructed without binding sockets. */
type GatewayKernelContext = {
  deps: CliDeps;
  cron: GatewayCronServiceContract;
  cronStorePath: string;
  getRuntimeConfig: () => OpenClawConfig; /** Prepared listener certificate pin; undefined when Gateway TLS is disabled. */
  gatewayTlsFingerprint?: string;
  sessionCompanion?: SessionCompanionService;
  sessionObserver?: SessionObserverService;
  resolveTerminalLaunchPolicy: (agentId?: string) => TerminalLaunchResolution;
  isTerminalEnabled: () => boolean;
  execApprovalManager?: ExecApprovalManager;
  scopeUpgradeCoordinator?: ScopeUpgradeCoordinator; /** Cancels durable approvals owned by one actively aborted run. */
  cancelRunBoundApprovals?: (runId: string) => number;
  pluginApprovalManager?: ExecApprovalManager<PluginApprovalRequestPayload>;
  systemAgentApprovalManager?: ExecApprovalManager<SystemAgentApprovalRequestPayload>;
  forwardPluginApprovalRequest?: (request: PluginApprovalRequest) => Promise<boolean>;
  pluginApprovalIosPushDelivery?: {
    handleRequested?: (request: PluginApprovalRequest, opts?: {
      isTargetVisible?: (target: {
        deviceId: string;
        scopes: readonly string[];
      }) => boolean;
    }) => Promise<boolean>;
    handleExpired?: (request: PluginApprovalRequest) => Promise<void>;
  };
  listSessionPendingApprovals?: (sessionKey: string, client: GatewayClient | null) => SessionApprovalReplay;
  loadGatewayModelCatalog: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[]>;
  loadGatewayModelCatalogSnapshot: (params?: {
    agentId?: string;
    agentDir?: string;
    readOnly?: boolean;
    workspaceDir?: string;
  }) => Promise<GatewayModelCatalogSnapshot>;
  readPreparedGatewayModelCatalog?: (params?: {
    agentId?: string;
    agentDir?: string;
    workspaceDir?: string;
  }) => Promise<ModelCatalogEntry[] | undefined>;
  readChatMetadata: (params: ChatMetadataReadParams) => Promise<ChatMetadataResult>;
  readChatStartupProjection?: (params: ChatStartupProjectionReadParams) => Promise<ChatStartupProjectionResult>;
  getHealthCache: () => HealthSummary | null;
  logHealth: {
    error: (message: string) => void;
  };
  logGateway: SubsystemLogger;
  incrementPresenceVersion: () => number;
  getHealthVersion: () => number; /** Instance-local native approval subscribers; never derived from a network client. */
  approvalEvents?: GatewayApprovalEventPublisher;
  recoveryRuntime?: GatewayRecoveryRuntime;
  enforceSharedGatewayAuthGenerationForConfigWrite?: (nextConfig: OpenClawConfig) => void;
  claimControlUiDeviceAuthMigration?: (deviceId: string) => boolean;
  releaseControlUiDeviceAuthMigrationClaim?: (deviceId: string) => void;
  completeControlUiDeviceAuthMigration?: (device: {
    deviceId: string;
    publicKey: string;
    scopes: string[];
  }) => void;
  nodeRegistry: NodeRegistry;
  agentRunSeq: Map<string, number>;
  chatAbortControllers: Map<string, ChatAbortControllerEntry>; /** Cancel identities for turns waiting in the followup/collect queue. */
  chatQueuedTurns: Map<string, QueuedChatTurnEntry>;
  chatRunState: ChatRunState;
  addChatRun: (sessionId: string, entry: ChatRunRegistration) => void;
  removeChatRun: (sessionId: string, clientRunId: string, sessionKey?: string) => ChatRunEntry | undefined;
  dedupe: Map<string, DedupeEntry>;
  wizardSessions: Map<string, WizardSession>;
  systemAgentSessions: Map<string, GatewaySystemAgentSession>;
  findRunningWizard: () => string | null;
  purgeWizardSession: (id: string) => void;
  wizardRunner: (opts: OnboardOptions, runtime: RuntimeEnv, prompter: WizardPrompter) => Promise<void>;
  channelWizardRunner: ChannelSetupWizardRunner;
  unavailableGatewayMethods?: ReadonlySet<string>;
};
/** Socket-bound services and connection state supplied by the Gateway transports. */
type GatewayTransportContext = {
  portalService?: GatewayPortalService;
  getMcpAppSandboxPort?: () => number | undefined;
  ensureSandboxHostPort?: () => Promise<number>;
  broadcast: GatewayBroadcastFn;
  broadcastToConnIds: GatewayBroadcastToConnIdsFn;
  nodeSendToSession: (sessionKey: string, event: string, payload: unknown) => void;
  nodeSendToAllSubscribed: (event: string, payload: unknown) => void;
  nodeSubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribe: (nodeId: string, sessionKey: string, connId?: string) => void;
  nodeUnsubscribeAll: (nodeId: string) => void;
  hasConnectedTalkNode: () => Promise<boolean>;
  isConnectionActive?: (connId: string) => boolean;
  hasExecApprovalClients?: (excludeConnId?: string) => boolean;
  getApprovalClientConnIds?: <TPayload>(params?: {
    approvalKind?: "exec" | "plugin" | "system-agent";
    excludeConnId?: string;
    filter?: (client: GatewayClient, record?: ExecApprovalRecord<TPayload>) => boolean;
    record?: ExecApprovalRecord<TPayload>;
  }) => ReadonlySet<string>;
  disconnectClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
  }) => void;
  invalidateClientsForDevice?: (deviceId: string, opts?: {
    role?: string;
    reason?: string;
  }) => void;
  hasConnectedClientsForDevice?: (deviceId: string) => boolean;
  refreshConnectedUserProfile?: (profile: {
    id: string;
    displayName: string | null;
    avatarRevision: string;
    hasAvatar: boolean;
    updatedAt: number;
  }) => void;
  disconnectClientsUsingSharedGatewayAuth?: () => void;
  terminalSessions?: TerminalSessionManager;
  subscribeSessionEvents: (connId: string) => void;
  unsubscribeSessionEvents: (connId: string) => void;
  subscribeSessionMessageEvents: (connId: string, sessionKey: string, opts?: {
    includeApprovals?: boolean;
    provisional?: boolean;
  }) => ((() => void) & {
    commit: () => void;
  }) | undefined;
  unsubscribeSessionMessageEvents: (connId: string, sessionKey: string) => void;
  unsubscribeAllSessionEvents: (connId: string) => void;
  getSessionEventSubscriberConnIds: () => ReadonlySet<string>;
  registerToolEventRecipient: (runId: string, connId: string) => void;
};
/** Resident-owned services bridged into request handling by the server lifecycle. */
type GatewayResidentBridgeContext = {
  controlUiSessionPullRequests?: ReturnType<typeof createControlUiSessionPullRequestSubscriptions>;
  sessionViewerPresence?: ReturnType<typeof createSessionViewerPresenceDeclarations>;
  notifyPluginMetadataChanged: () => void;
  refreshHealthSnapshot: (opts?: {
    probe?: boolean;
    includeSensitive?: boolean;
  }) => Promise<HealthSummary>; /** Durable cloud-worker lifecycle; absent from lightweight in-process contexts. */
  workerEnvironmentService?: WorkerEnvironmentServiceContract; /** Gateway-host desktop acquisition and observation; present only after enabled startup. */
  hostDesktopService?: HostDesktopService; /** Durable per-session worker placement; absent only from lightweight in-process contexts. */
  workerSessionPlacementService?: WorkerSessionPlacementReader & Partial<WorkerSessionPlacementRetirementService>; /** Process-local health samples fenced to the exact active placement owner. */
  workerPlacementDiskSpaceReader?: WorkerPlacementDiskSpaceReader; /** Use-time approval authority validation over the live run/worker owners. */
  validateAgentRuntimeApprovalAuthority?: AgentRuntimeApprovalAuthorityValidator; /** One-way local-to-worker dispatch; absent when cloud workers are disabled. */
  workerPlacementDispatchService?: WorkerPlacementDispatchContract;
  getRuntimeSnapshot: () => ChannelRuntimeSnapshot;
  getEventLoopHealth?: () => GatewayEventLoopHealth | undefined;
  getConfigReloaderHotReloadStatus?: () => GatewayHotReloadStatus | undefined;
  startChannel: (channel: ChannelId, accountId?: string, opts?: StartChannelOptions) => Promise<void>;
  stopChannel: (channel: ChannelId, accountId?: string) => Promise<void>;
  markChannelLoggedOut: (channelId: ChannelId, cleared: boolean, accountId?: string) => void;
  broadcastVoiceWakeChanged: (triggers: string[]) => void;
  broadcastVoiceWakeRoutingChanged: (config: VoiceWakeRoutingConfig) => void;
};
/** Complete runtime context available to gateway request handlers. */
type GatewayRequestContext = GatewayKernelContext & GatewayTransportContext & GatewayResidentBridgeContext;
/** Full dispatch context for raw request frames before params are normalized. */
type GatewayRequestOptions = {
  req: RequestFrame;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  methodRegistry?: GatewayMethodRegistryView; /** In-process caller lifetime; never serialized into a Gateway request frame. */
  signal?: AbortSignal;
};
/** Commit-time guard captured by the pre-dispatch session participation check. */
type SessionMutationAuthorization = {
  assertCurrent: () => void;
  assertTargetCurrent: (target: {
    sessionKey: string;
    agentId?: string;
  }) => void;
};
/** Normalized method invocation options passed to registered handlers. */
type GatewayRequestHandlerOptions = {
  req: RequestFrame;
  params: Record<string, unknown>;
  client: GatewayClient | null;
  isWebchatConnect: (params: ConnectParams | null | undefined) => boolean;
  respond: RespondFn;
  context: GatewayRequestContext;
  sessionMutationAuthorization?: SessionMutationAuthorization; /** In-process caller lifetime; absent for ordinary transport requests. */
  signal?: AbortSignal;
};
/** Single gateway method implementation. */
type GatewayRequestHandler = (opts: GatewayRequestHandlerOptions) => Promise<void> | void;
/** Registry fragment keyed by gateway protocol method name. */
type GatewayRequestHandlers = Record<string, GatewayRequestHandler>;
//#endregion
export { SpeechProviderConfig as $, SecretInputMode as $t, PluginRunContextPatch as A, ImageGenerationOutputFormat as At, PluginSessionSchedulerJobRegistration as B, buildPluginNodeCapabilityScopedHostUrl as Bt, WorkerSshIdentity as C, MusicGenerationOutputFormat as Ct, PluginAgentEventSubscriptionRegistration as D, ImageGenerationBackground as Dt, PluginAgentEventEmitResult as E, GeneratedImageAsset as Et, PluginSessionAttachmentParams as F, ImageGenerationSourceImage as Ft, PluginTrustedToolPolicyRegistration as G, emitAgentEvent as Gt, PluginSessionTurnUnscheduleByTagParams as H, normalizePluginNodeCapabilityScopedUrl as Ht, PluginSessionAttachmentResult as I, NodeSession as It, VideoGenerationNormalization as J, CronCreatorAuthorityGrant as Jt, GeneratedVideoAsset as K, onAgentEvent as Kt, PluginSessionExtensionProjection as L, DEFAULT_PLUGIN_NODE_CAPABILITY_TTL_MS as Lt, PluginSessionActionContext as M, ImageGenerationProviderOptions as Mt, PluginSessionActionRegistration as N, ImageGenerationQuality as Nt, PluginControlUiDescriptor as O, ImageGenerationIgnoredOverride as Ot, PluginSessionActionResult as P, ImageGenerationResolution as Pt, SpeechModelOverridePolicy as Q, SpawnResult as Qt, PluginSessionExtensionRegistration as R, NormalizedPluginNodeCapabilityUrl as Rt, WorkerSshEndpoint as S, MusicGenerationNormalization as St, PluginAgentEventEmitParams as T, MusicGenerationSourceImage as Tt, PluginSessionTurnUnscheduleByTagResult as U, AgentApprovalEventData as Ut, PluginSessionTurnScheduleParams as V, mintPluginNodeCapabilityToken as Vt, PluginToolMetadataRegistration as W, AgentEventPayload as Wt, VideoGenerationResolution as X, SystemAgentOperation as Xt, VideoGenerationProvider as Y, CronCreatorAuthorityRunScope as Yt, VideoGenerationSourceAsset as Z, CliDeps as Zt, WorkerLease as _, RealtimeVoiceTool as _t, GatewayRequestOptions as a, AdmittedRunContext as an, TranscriptStopRequest as at, WorkerProvider as b, GeneratedMusicAsset as bt, MediaUnderstandingProviderPlugin as c, admitted_run_context_d_exports as cn, RealtimeVoiceAudioClearReason as ct, RealtimeVoiceProviderPlugin as d, RealtimeVoiceBridge as dt, GatewayMethodDescriptor as en, SpeechProviderId as et, SpeechProviderPlugin as f, RealtimeVoiceBridgeEvent as ft, WorkerDesktopEndpoint as g, RealtimeVoiceRole as gt, WorkerDesktopApp as h, RealtimeVoiceResponseOutcome as ht, GatewayRequestHandlers as i, SqliteWalMaintenance as in, TranscriptStartRequest as it, PluginRuntimeLifecycleRegistration as j, ImageGenerationProvider as jt, PluginRunContextGetParams as k, ImageGenerationNormalization as kt, MusicGenerationProviderPlugin as l, RuntimePluginToolGrant as ln, RealtimeVoiceAudioFormat as lt, VideoGenerationProviderPlugin as m, RealtimeVoiceProviderConfig as mt, GatewayRequestHandler as n, OpenClawStateDatabase as nn, TtsDirectiveOverrides as nt, RespondFn as o, OperationalRunInstanceRef as on, TranscriptsStartResult as ot, TranscriptSourceProvider as p, RealtimeVoiceCloseReason as pt, VideoGenerationIgnoredOverride as q, resetAgentEventsForTest as qt, GatewayRequestHandlerOptions as r, OpenClawStateDatabaseOptions as rn, TtsDirectiveParseResult as rt, ImageGenerationProviderPlugin as s, PreparedAgentRunAdmission as sn, TranscriptsStopResult as st, GatewayRequestContext as t, CronServiceContract as tn, SpeechVoiceOption as tt, RealtimeTranscriptionProviderPlugin as u, AgentInternalEvent as un, RealtimeVoiceBargeInOptions as ut, WorkerLeaseStatus as v, RealtimeVoiceToolCallEvent as vt, WorkerSshIdentityRequest as w, MusicGenerationProvider as wt, WorkerProviderError as x, MusicGenerationIgnoredOverride as xt, WorkerProfile as y, RealtimeVoiceToolResultOptions as yt, PluginSessionSchedulerJobHandle as z, PLUGIN_NODE_CAPABILITY_PATH_PREFIX as zt };