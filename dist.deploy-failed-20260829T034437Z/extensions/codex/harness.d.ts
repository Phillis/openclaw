import { a as AgentHarnessSessionDeletionMutation, i as AgentHarnessNativeCompaction, l as PluginRuntime, o as AgentHarnessV2 } from "../../plugin-entry-SSZcu2d5.js";
import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../setup-wizard-types-DKtF7yYx.js";
import "../../config-contracts-OcWhZue9.js";
import "../../agent-runtime-DmjxJtgl.js";
import { c as CodexThread, d as CodexThreadListParams, f as CodexThreadListResponse, l as CodexThreadForkParams, m as CodexThreadTurnsListResponse, p as CodexThreadTurnsListParams, t as CodexAppServerRuntimeOptions, u as CodexThreadForkResponse } from "../../config-6KUQc6vC.js";
import { z } from "zod";
//#region extensions/codex/src/app-server/managed-thread-store.d.ts
type CodexManagedThreadStore = {
  mark(params: {
    sourceHomeId: string;
    threadId: string;
    rolloutPath?: string;
  }): Promise<boolean>;
  snapshot(): Promise<ReadonlyMap<string, ReadonlySet<string>>>;
};
//#endregion
//#region extensions/codex/src/app-server/session-binding.d.ts
/** Stable owner of one Codex thread binding. */
type CodexAppServerBindingIdentity = {
  kind: "session";
  agentId: string;
  sessionId: string;
  sessionKey?: string;
} | {
  kind: "conversation";
  bindingId: string;
};
declare const pendingSupervisionBranchSchema: z.ZodObject<{
  sourceThreadId: z.ZodString;
  connectionFingerprint: z.ZodOptional<z.ZodString>;
  lastTurnId: z.ZodOptional<z.ZodString>;
  cleanupThreadIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strict>;
declare const threadBindingSchema: z.ZodObject<{
  threadId: z.ZodString;
  clientId: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  cwd: z.ZodString;
  rolloutPath: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  connectionScope: z.ZodOptional<z.ZodLiteral<"supervision">>;
  supervisionSourceThreadId: z.ZodOptional<z.ZodString>;
  authProfileId: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  agentWorkspaceDeveloperInstructions: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  model: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  preserveNativeModel: z.ZodCatch<z.ZodOptional<z.ZodLiteral<true>>>;
  pendingSupervisionBranch: z.ZodOptional<z.ZodObject<{
    sourceThreadId: z.ZodString;
    connectionFingerprint: z.ZodOptional<z.ZodString>;
    lastTurnId: z.ZodOptional<z.ZodString>;
    cleanupThreadIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
  pendingResumeConfiguration: z.ZodOptional<z.ZodLiteral<true>>;
  modelProvider: z.ZodCatch<z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodString>>>;
  approvalPolicy: z.ZodCatch<z.ZodPreprocess<z.ZodOptional<z.ZodEnum<{
    never: "never";
    "on-request": "on-request";
    untrusted: "untrusted";
  }>>>>;
  sandbox: z.ZodCatch<z.ZodOptional<z.ZodEnum<{
    "read-only": "read-only";
    "workspace-write": "workspace-write";
    "danger-full-access": "danger-full-access";
  }>>>;
  serviceTier: z.ZodCatch<z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodCustom<string, string>>>>>;
  networkProxyProfileName: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  networkProxyConfigFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  dynamicToolsFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  dynamicToolsContainDeferred: z.ZodCatch<z.ZodOptional<z.ZodBoolean>>;
  webSearchThreadConfigFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  nativeSkillIsolationFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  userMcpServersFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  mcpServersFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  configuredMcpOwnershipVersion: z.ZodCatch<z.ZodOptional<z.ZodLiteral<1>>>;
  ringZeroConfigFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  ringZeroClientInstanceId: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  nativeToolPolicyRestricted: z.ZodCatch<z.ZodOptional<z.ZodLiteral<true>>>;
  nativeHookRelayGeneration: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  appServerRuntimeFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  pluginAppsFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  pluginAppsInputFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  pluginAppPolicyContext: z.ZodCatch<z.ZodOptional<z.ZodObject<{
    fingerprint: z.ZodString;
    apps: z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodObject<{
      source: z.ZodLiteral<"account">;
      appName: z.ZodString;
      allowDestructiveActions: z.ZodBoolean;
      allowOpenWorld: z.ZodOptional<z.ZodBoolean>;
      destructiveApprovalMode: z.ZodCatch<z.ZodOptional<z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        auto: "auto";
        ask: "ask";
      }>>>;
      mcpServerNames: z.ZodArray<z.ZodString>;
    }, z.core.$strict>, z.ZodObject<{
      source: z.ZodOptional<z.ZodLiteral<"plugin">>;
      configKey: z.ZodString;
      marketplaceName: z.ZodString;
      pluginName: z.ZodString;
      allowDestructiveActions: z.ZodBoolean;
      allowOpenWorld: z.ZodOptional<z.ZodBoolean>;
      destructiveApprovalMode: z.ZodCatch<z.ZodOptional<z.ZodEnum<{
        allow: "allow";
        deny: "deny";
        auto: "auto";
        ask: "ask";
      }>>>;
      mcpServerNames: z.ZodArray<z.ZodString>;
    }, z.core.$strict>]>>;
    pluginAppIds: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodArray<z.ZodString>>>;
  }, z.core.$strict>>>;
  contextEngine: z.ZodCatch<z.ZodOptional<z.ZodObject<{
    schemaVersion: z.ZodLiteral<1>;
    engineId: z.ZodString;
    policyFingerprint: z.ZodString;
    projection: z.ZodCatch<z.ZodOptional<z.ZodObject<{
      schemaVersion: z.ZodLiteral<1>;
      mode: z.ZodLiteral<"thread_bootstrap">;
      epoch: z.ZodString;
      fingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
    }, z.core.$strict>>>;
  }, z.core.$strict>>>;
  environmentSelectionFingerprint: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  conversationStartId: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  conversationSourceTransferComplete: z.ZodCatch<z.ZodOptional<z.ZodLiteral<true>>>;
  historyCoveredThrough: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  continuityCalibration: z.ZodCatch<z.ZodOptional<z.ZodObject<{
    promptChars: z.ZodNumber;
    inputTokens: z.ZodNumber;
  }, z.core.$strip>>>;
}, z.core.$strip>;
/** Durable Codex thread facts. Storage identity and schema stay outside this domain value. */
type CodexAppServerThreadBinding = z.infer<typeof threadBindingSchema>;
/** Persisted source snapshot and orphan-cleanup state for a supervised native branch. */
type CodexAppServerPendingSupervisionBranch = z.infer<typeof pendingSupervisionBranchSchema>;
type CodexAppServerBindingMutation = {
  kind: "set";
  binding: CodexAppServerThreadBinding;
  if?: {
    kind: "absent";
  };
} | {
  kind: "patch";
  threadId: string;
  patch: Partial<Omit<CodexAppServerThreadBinding, "threadId">>;
} | {
  kind: "replace-thread";
  expectedThreadId: string;
  binding: CodexAppServerThreadBinding;
} | {
  kind: "patch-pending-supervision-branch";
  expected: CodexAppServerPendingSupervisionBranch;
  pending: CodexAppServerPendingSupervisionBranch;
} | {
  kind: "commit-pending-supervision-branch";
  expected: CodexAppServerPendingSupervisionBranch;
  threadId: string;
  patch: Partial<Omit<CodexAppServerThreadBinding, "threadId" | "pendingSupervisionBranch">>;
} | {
  kind: "reclaim-generation";
  expectedPreviousSessionId: string;
} | {
  kind: "clear";
  threadId?: string;
  /** Only failed creation may clear the exact provisional supervision owner. */
  expectedPendingSupervisionBranch?: CodexAppServerPendingSupervisionBranch;
};
type CodexSessionGenerationAdoptionResult = "adopted" | "current" | "absent" | "conflict";
type CodexSessionGenerationRetirementResult = "applied" | "absent" | "conflict";
type CodexSessionGenerationReclaimPlan = {
  kind: "resolved";
  result: boolean;
} | {
  kind: "verify";
  expectedPreviousSessionId: string;
};
type CodexAppServerBindingStore = {
  /** Durable ownership rows kept separate from replaceable session bindings. */
  managedThreads?: CodexManagedThreadStore;
  read(identity: CodexAppServerBindingIdentity): Promise<CodexAppServerThreadBinding | undefined>;
  hasOtherThreadOwner(threadId: string, currentIdentity?: CodexAppServerBindingIdentity): Promise<boolean>;
  mutate(identity: CodexAppServerBindingIdentity, mutation: CodexAppServerBindingMutation, assertCurrent?: () => void): Promise<boolean>;
  prepareSessionGenerationReclaim(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>): Promise<CodexSessionGenerationReclaimPlan>;
  adoptSessionGeneration(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>, expectedPreviousSessionId: string): Promise<CodexSessionGenerationAdoptionResult>;
  resetSessionGeneration(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>): Promise<CodexSessionGenerationRetirementResult>;
  retireSessionGeneration(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>): Promise<CodexSessionGenerationRetirementResult>;
  withSessionDeletion<T>(identity: Extract<CodexAppServerBindingIdentity, {
    kind: "session";
  }>, assertCurrent: () => void, run: (binding: CodexAppServerThreadBinding | undefined, mutation: AgentHarnessSessionDeletionMutation) => Promise<T>): Promise<T>;
  withThreadArchiveFence<T>(run: () => Promise<T>): Promise<T>;
  withLease<T>(identity: CodexAppServerBindingIdentity, run: () => Promise<T>): Promise<T>;
};
//#endregion
//#region extensions/codex/src/session-catalog-types.d.ts
type CodexCatalogHome = {
  sourceHomeId: string;
  hostId: string;
  label: string;
  agentDir: string;
  appServer: CodexAppServerRuntimeOptions;
  /** Trusted local root for rollout provenance reads; absent for remote app-server connections. */
  localSessionsRoot?: string;
  usesProcessHomeFallback: boolean;
};
/** Read-only metadata for one Codex app-server thread. */
type CodexSessionCatalogSession = {
  threadId: string;
  /** Opaque connection identity; never exposes the underlying Codex home path. */
  sourceHomeId?: string;
  sessionId?: string;
  name?: string | null;
  /** Display-only fallback kept separate so title search never scans prompt previews. */
  fallbackName?: string;
  cwd?: string;
  status: string;
  activeFlags?: string[];
  createdAt?: number;
  updatedAt?: number;
  recencyAt?: number | null;
  source?: string;
  modelProvider?: string;
  cliVersion?: string;
  gitBranch?: string;
  /** Existing locked OpenClaw chat already mapped to this native source thread. */
  sessionKey?: string;
  archived: boolean;
};
type CodexSessionCatalogPage = {
  sessions: CodexSessionCatalogSession[];
  /** Internal provenance filtered before this page reaches the provider catalog. */
  managedThreads?: Array<{
    threadId: string;
    rolloutPath?: string;
  }>;
  nextCursor?: string;
  backwardsCursor?: string;
};
type CodexSessionCatalogPageParams = {
  cursor?: string;
  limit?: number;
  searchTerm?: string;
  cwd?: string;
  /** Bypasses the brief list memo after a specific thread lookup misses. */
  forceRefresh?: boolean;
};
type CodexSessionCatalogControl = {
  clientId?: string;
  connectionFingerprint?: string;
  withPinnedConnection<T>(run: (control: CodexSessionCatalogControl) => Promise<T>): Promise<T>;
  listPage(params: CodexSessionCatalogPageParams): Promise<CodexSessionCatalogPage>;
  listDescendantPage(params: CodexThreadListParams): Promise<CodexThreadListResponse>;
  listTurnPage(params: CodexThreadTurnsListParams): Promise<CodexThreadTurnsListResponse>;
  forkThread(params: CodexThreadForkParams): Promise<CodexThreadForkResponse>;
  readThread(threadId: string, includeTurns?: boolean): Promise<CodexThread>;
  archiveThread(threadId: string): Promise<void>;
};
type CodexSessionCatalogControlFactory = {
  forRequest(agentId: string, source?: CodexCatalogHome): CodexSessionCatalogControl;
  homesForAgent(agentId: string): readonly CodexCatalogHome[];
  forUpstream(agentId: string, connectionFingerprint: string): CodexSessionCatalogControl | undefined;
};
//#endregion
//#region extensions/codex/harness.d.ts
type CodexAppServerAgentHarnessOptions = {
  id?: string;
  label?: string;
  providerIds?: Iterable<string>;
  pluginConfig?: unknown;
  resolvePluginConfig?: () => unknown;
  resolveConfig?: () => OpenClawConfig | undefined;
  runtime?: PluginRuntime;
  bindingStore: CodexAppServerBindingStore;
  sessionCatalogControlFactory?: CodexSessionCatalogControlFactory;
};
/**
 * Creates the Codex app-server harness used for attempts, side questions,
 * compaction, reset, and disposal.
 */
declare function createCodexAppServerAgentHarness(options: CodexAppServerAgentHarnessOptions): AgentHarnessV2;
/** Creates the private native-compaction bridge registered in host-owned capability state. */
declare function createCodexAppServerNativeCompaction(options: Pick<CodexAppServerAgentHarnessOptions, "bindingStore" | "pluginConfig" | "resolvePluginConfig">): AgentHarnessNativeCompaction;
//#endregion
export { createCodexAppServerAgentHarness, createCodexAppServerNativeCompaction };