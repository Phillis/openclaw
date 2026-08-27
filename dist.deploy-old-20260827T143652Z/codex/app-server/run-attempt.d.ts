import { c as AgentHarnessAttemptResult, t as AgentHarnessHostCapabilities, u as EmbeddedRunAttemptParams, v as AgentHarnessRuntimeArtifactBinding } from "../../host-capability-types-CSKZWJAm.js";
import { H as TranscriptEntryAnchor } from "../../templating-CbdZP_k6.js";
import { i as AuthProfileStore } from "../../types-CXLbbwkS.js";
import { u as resolveAuthProfileOrder } from "../../usage-BcXLFbyC.js";
import { TSchema } from "typebox";
import { z } from "zod";
import { Server } from "node:http";
//#region src/agents/harness/native-hook-relay-types.d.ts
declare const NATIVE_HOOK_RELAY_EVENTS: readonly ["pre_tool_use", "post_tool_use", "permission_request", "before_agent_finalize"];
type NativeHookRelayEvent = (typeof NATIVE_HOOK_RELAY_EVENTS)[number];
//#endregion
//#region src/plugin-sdk/agent-harness-runtime.d.ts
type EmbeddedRunAttemptParamsBase = Omit<EmbeddedRunAttemptParams, "admittedRunContext" | "contextEngineLogicalTurnLease" | "onContextEngineTurnCandidate" | "trajectoryRecorder">;
/**
 * @deprecated Use EmbeddedRunAttemptParamsV2. The optional capability keeps
 * existing harness source compatible through 2026-10-12.
 */
/** Current host-prepared attempt contract for agent harnesses. */
type EmbeddedRunAttemptParamsV2 = EmbeddedRunAttemptParamsBase & {
  hostCapabilities: AgentHarnessHostCapabilities;
};
//#endregion
//#region extensions/codex/src/app-server/attempt-terminal.d.ts
type EmbeddedRunAttemptResult = Extract<AgentHarnessAttemptResult, {
  terminal: unknown;
}> & {
  /** Host-private terminal identity returned to the harness selection boundary. */contextEngineTerminalAnchor?: TranscriptEntryAnchor;
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
  model: z.ZodCatch<z.ZodOptional<z.ZodString>>;
  preserveNativeModel: z.ZodCatch<z.ZodOptional<z.ZodLiteral<true>>>;
  pendingSupervisionBranch: z.ZodOptional<z.ZodObject<{
    sourceThreadId: z.ZodString;
    connectionFingerprint: z.ZodOptional<z.ZodString>;
    lastTurnId: z.ZodOptional<z.ZodString>;
    cleanupThreadIds: z.ZodOptional<z.ZodArray<z.ZodString>>;
  }, z.core.$strict>>;
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
        auto: "auto";
        allow: "allow";
        deny: "deny";
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
        auto: "auto";
        allow: "allow";
        deny: "deny";
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
  threadId?: string; /** Only failed creation may clear the exact provisional supervision owner. */
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
  read(identity: CodexAppServerBindingIdentity): Promise<CodexAppServerThreadBinding | undefined>;
  hasOtherThreadOwner(threadId: string, currentIdentity?: CodexAppServerBindingIdentity): Promise<boolean>;
  mutate(identity: CodexAppServerBindingIdentity, mutation: CodexAppServerBindingMutation): Promise<boolean>;
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
  withThreadArchiveFence<T>(run: () => Promise<T>): Promise<T>;
  withLease<T>(identity: CodexAppServerBindingIdentity, run: () => Promise<T>): Promise<T>;
};
//#endregion
//#region extensions/codex/src/app-server/command-exec-protocol.d.ts
/** Bounded, sandboxed argv execution over the existing app-server connection. */
type CodexCommandExecParams = {
  command: string[];
  env?: Partial<Record<string, string | null>> | null;
  outputBytesCap?: number | null;
  timeoutMs?: number | null;
};
type CodexCommandExecResponse = {
  exitCode: number;
  stdout: string;
  stderr: string;
};
//#endregion
//#region extensions/codex/src/app-server/protocol-json.d.ts
type JsonValue = null | boolean | number | string | JsonValue[] | JsonObject;
type JsonObject = {
  [key: string]: JsonValue;
};
//#endregion
//#region extensions/codex/src/app-server/protocol-control-plane.d.ts
/** Current Codex marketplace, app, skill, hook, and config wire contracts. */
type CodexPluginSummary = {
  id: string;
  remotePluginId?: string | null;
  name: string;
  source?: JsonObject;
  installed: boolean;
  enabled: boolean;
  installPolicy?: string;
  mustShowInstallationInterstitial?: boolean | null;
  authPolicy?: string;
  availability?: string;
  interface?: JsonValue;
};
type CodexAppSummary = {
  id: string;
  name: string;
  description: string | null;
  installUrl: string | null;
  category: string | null;
};
type CodexPluginDetail = {
  marketplaceName?: string;
  marketplacePath?: string | null;
  summary: CodexPluginSummary;
  description?: string | null;
  skills?: JsonValue[];
  apps: CodexAppSummary[];
  mcpServers: string[];
};
type CodexPluginMarketplaceEntry = {
  name: string;
  path?: string | null;
  interface?: JsonValue;
  plugins: CodexPluginSummary[];
};
type CodexMarketplaceLoadErrorInfo = {
  marketplacePath: string;
  message: string;
};
type CodexPluginInstalledParams = {
  cwds?: string[] | null;
  installSuggestionPluginNames?: string[] | null;
};
type CodexPluginInstalledResponse = {
  marketplaces: CodexPluginMarketplaceEntry[];
  marketplaceLoadErrors: CodexMarketplaceLoadErrorInfo[];
};
type CodexPluginListResponse = {
  marketplaces: CodexPluginMarketplaceEntry[];
  marketplaceLoadErrors: CodexMarketplaceLoadErrorInfo[];
  featuredPluginIds: string[];
};
type CodexPluginReadResponse = {
  plugin: CodexPluginDetail;
};
type CodexPluginListMarketplaceKind = "local" | "vertical" | "workspace-directory" | "shared-with-me" | "created-by-me-remote";
type CodexPluginListParams = {
  cwds?: string[] | null;
  forceRefetch?: boolean;
  marketplaceKinds?: CodexPluginListMarketplaceKind[] | null;
};
type CodexPluginReadParams = {
  marketplacePath?: string | null;
  remoteMarketplaceName?: string | null;
  pluginName: string;
};
type CodexPluginInstallParams = CodexPluginReadParams;
type CodexPluginInstallResponse = {
  authPolicy: string;
  appsNeedingAuth: CodexAppSummary[];
};
/** App inventory shape consumed by OpenClaw's existing plugin policy. */
type CodexAppInfo = {
  id: string;
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  logoUrlDark?: string | null;
  distributionChannel?: string | null;
  branding?: JsonValue;
  appMetadata?: JsonValue;
  labels?: Record<string, string | undefined> | null;
  installUrl?: string | null;
  isAccessible: boolean;
  isEnabled: boolean;
  pluginDisplayNames: string[];
};
type CodexAppsListParams = {
  cursor?: string | null;
  limit?: number | null;
  threadId?: string | null;
  forceRefetch?: boolean;
};
type CodexAppsListResponse = {
  data: CodexAppInfo[];
  nextCursor?: string | null;
};
type CodexInstalledApp = {
  id: string;
  runtimeName: string | null;
  enabled: boolean;
  callable: boolean;
};
type CodexAppsInstalledParams = {
  threadId?: string | null;
  forceRefresh?: boolean;
};
type CodexAppsInstalledResponse = {
  apps: CodexInstalledApp[];
};
type CodexAppToolSummary = {
  name: string;
  title: string | null;
  description: string;
  isEnabled: boolean;
  disabledReason: string | null;
  isReadOnly: boolean;
};
type CodexConnectorMetadata = {
  id: string;
  name: string;
  description: string | null;
  iconUrl: string | null;
  iconUrlDark: string | null;
  distributionChannel: string | null;
  installUrl: string | null;
  pluginDisplayNames: string[];
  toolSummaries: CodexAppToolSummary[] | null;
};
type CodexAppsReadParams = {
  appIds: string[];
  includeTools?: boolean;
};
type CodexAppsReadResponse = {
  apps: CodexConnectorMetadata[];
  missingAppIds: string[];
};
type CodexSkillScope = "user" | "repo" | "system" | "admin";
type CodexSkillMetadata = {
  name: string;
  description: string;
  shortDescription?: string;
  interface?: JsonObject;
  dependencies?: JsonObject;
  path: string;
  scope: CodexSkillScope;
  enabled: boolean;
};
type CodexSkillErrorInfo = {
  path: string;
  message: string;
};
type CodexSkillsListEntry = {
  cwd: string;
  skills: CodexSkillMetadata[];
  errors: CodexSkillErrorInfo[];
};
type CodexSkillsListResponse = {
  data: CodexSkillsListEntry[];
};
type CodexHooksListResponse = {
  data: JsonValue[];
  nextCursor?: string | null;
};
type CodexConfigReadResponse = {
  config: JsonObject;
  layers?: JsonValue[] | null;
};
type CodexConfigMergeStrategy = "replace" | "upsert";
type CodexConfigEdit = {
  keyPath: string;
  value: JsonValue;
  mergeStrategy: CodexConfigMergeStrategy;
};
type CodexConfigValueWriteParams = CodexConfigEdit & {
  filePath?: string | null;
  expectedVersion?: string | null;
};
type CodexConfigBatchWriteParams = {
  edits: CodexConfigEdit[];
  filePath?: string | null;
  expectedVersion?: string | null;
  reloadUserConfig?: boolean;
};
type CodexConfigLayerSource = {
  type: "mdm";
  domain: string;
  key: string;
} | {
  type: "system";
  file: string;
} | {
  type: "enterpriseManaged";
  id: string;
  name: string;
} | {
  type: "user";
  file: string;
  profile: string | null;
} | {
  type: "project";
  dotCodexFolder: string;
} | {
  type: "sessionFlags";
} | {
  type: "legacyManagedConfigTomlFromFile";
  file: string;
} | {
  type: "legacyManagedConfigTomlFromMdm";
};
type CodexConfigLayerMetadata = {
  name: CodexConfigLayerSource;
  version: string;
};
type CodexWireJsonValue = null | boolean | number | string | CodexWireJsonValue[] | { [key in string]?: CodexWireJsonValue };
type CodexConfigOverriddenMetadata = {
  message: string;
  overridingLayer: CodexConfigLayerMetadata;
  effectiveValue: CodexWireJsonValue;
};
type CodexConfigWriteStatus = "ok" | "okOverridden";
type CodexConfigWriteResponse = {
  status: CodexConfigWriteStatus;
  version: string;
  filePath: string;
  overriddenMetadata: CodexConfigOverriddenMetadata | null;
};
type CodexConfigRequirementsReadResponse = {
  requirements: JsonObject | null;
};
//#endregion
//#region extensions/codex/src/app-server/protocol-mcp.d.ts
type CodexMcpServerStatus = {
  name: string; /** Present only after the configured server completed MCP initialization. */
  serverInfo?: {
    name: string;
    title?: string | null;
    version: string;
    description?: string | null;
    icons?: JsonValue[] | null;
    websiteUrl?: string | null;
  } | null;
  tools: JsonObject;
  resources?: JsonValue[];
  resourceTemplates?: JsonValue[];
  authStatus?: "unsupported" | "notLoggedIn" | "bearerToken" | "oAuth";
};
type CodexListMcpServerStatusResponse = {
  data: CodexMcpServerStatus[];
  nextCursor?: string | null;
};
type ResourceReadParams = {
  threadId?: string | null;
  server: string;
  uri: string;
};
type ToolCallParams = {
  threadId: string;
  server: string;
  tool: string;
  arguments?: JsonValue;
  _meta?: JsonValue;
};
type ResourceReadResult = {
  contents: JsonValue[];
};
type ToolCallResult = {
  content: JsonValue[];
  structuredContent?: JsonValue;
  isError?: boolean;
  _meta?: JsonValue;
};
//#endregion
//#region extensions/codex/src/app-server/protocol.d.ts
type CodexServiceTier = string;
type CodexApprovalPolicy = "untrusted" | "on-request" | {
  granular: {
    sandbox_approval: boolean;
    rules: boolean;
    skill_approval: boolean;
    request_permissions: boolean;
    mcp_elicitations: boolean;
  };
} | "never";
type CodexApprovalsReviewer = "user" | "auto_review" | "guardian_subagent";
type CodexSandboxMode = "read-only" | "workspace-write" | "danger-full-access";
type CodexPersonality = "none" | "friendly" | "pragmatic";
type CodexAppServerRequestMethod = keyof CodexAppServerRequestResultMap | (string & {});
type CodexAppServerRequestParams<M extends CodexAppServerRequestMethod> = M extends keyof CodexAppServerRequestParamsOverride ? CodexAppServerRequestParamsOverride[M] : unknown;
type CodexAppServerRequestResult<M extends CodexAppServerRequestMethod> = M extends keyof CodexAppServerRequestResultMap ? CodexAppServerRequestResultMap[M] : JsonValue | undefined;
type RpcRequest = {
  id?: number | string;
  method: string;
  params?: JsonValue;
};
type CodexInitializeResponse = {
  serverInfo?: {
    name?: string;
    version?: string;
  };
  protocolVersion?: string;
  userAgent?: string;
  codexHome?: string;
  platformFamily?: string;
  platformOs?: string;
};
type CodexUserInput = {
  type: "text";
  text: string;
  text_elements: Array<{
    byteRange: {
      start: number;
      end: number;
    };
    placeholder: string | null;
  }>;
} | {
  type: "image";
  url: string;
} | {
  type: "localImage";
  path: string;
} | {
  type: "skill";
  name: string;
  path: string;
};
type CodexDynamicToolFunctionSpec = JsonObject & {
  type: "function";
  name: string;
  description: string;
  inputSchema: JsonValue;
  deferLoading?: boolean;
};
type CodexDynamicToolNamespaceSpec = JsonObject & {
  type: "namespace";
  name: string;
  description: string;
  tools: CodexDynamicToolFunctionSpec[];
};
type CodexDynamicToolSpec = CodexDynamicToolFunctionSpec | CodexDynamicToolNamespaceSpec;
type CodexTurnEnvironmentParams = JsonObject & {
  environmentId: string;
  cwd: string;
};
type CodexThreadStartParams = JsonObject & {
  input?: CodexUserInput[];
  cwd?: string;
  model?: string;
  modelProvider?: string | null;
  config?: JsonObject;
  personality?: CodexPersonality | null;
  approvalPolicy?: CodexApprovalPolicy | null;
  approvalsReviewer?: CodexApprovalsReviewer | null;
  sandbox?: CodexSandboxMode | null;
  serviceTier?: CodexServiceTier | null;
  dynamicTools?: CodexDynamicToolSpec[] | null;
  developerInstructions?: string;
  experimentalRawEvents?: boolean;
  environments?: CodexTurnEnvironmentParams[] | null;
  ephemeral?: boolean;
};
type CodexThreadStartResponse = {
  thread: CodexThread;
  model: string;
  modelProvider?: string | null;
};
type CodexThreadForkParams = JsonObject & {
  threadId: string;
  lastTurnId?: string | null;
  beforeTurnId?: string | null;
  path?: string | null;
  model?: string | null;
  modelProvider?: string | null;
  serviceTier?: CodexServiceTier | null;
  cwd?: string | null;
  runtimeWorkspaceRoots?: string[] | null;
  approvalPolicy?: CodexApprovalPolicy | null;
  approvalsReviewer?: CodexApprovalsReviewer | null;
  sandbox?: CodexSandboxMode | null;
  permissions?: string | null;
  config?: JsonObject | null;
  baseInstructions?: string;
  developerInstructions?: string;
  ephemeral?: boolean;
  threadSource?: string | null;
  excludeTurns?: boolean;
};
type CodexThreadForkResponse = CodexThreadStartResponse;
declare const CODEX_INTERACTIVE_THREAD_SOURCE_KINDS: readonly ["cli", "vscode"];
type CodexThreadSourceKind = (typeof CODEX_INTERACTIVE_THREAD_SOURCE_KINDS)[number] | "exec" | "appServer" | "subAgent" | "subAgentReview" | "subAgentCompact" | "subAgentThreadSpawn" | "subAgentOther" | "unknown";
type CodexThreadListParams = JsonObject & {
  cursor?: string | null;
  limit?: number | null;
  modelProviders?: string[] | null;
  sortKey?: "created_at" | "updated_at" | "recency_at" | null;
  sortDirection?: "asc" | "desc" | null;
  archived?: boolean | null;
  cwd?: string | string[] | null;
  useStateDbOnly?: boolean;
  searchTerm?: string | null;
  sourceKinds?: CodexThreadSourceKind[] | null;
  parentThreadId?: string | null;
  ancestorThreadId?: string | null;
};
type CodexThreadListResponse = {
  data: CodexThread[];
  nextCursor?: string | null;
  backwardsCursor?: string | null;
};
type CodexThreadReadParams = JsonObject & {
  threadId: string;
  includeTurns?: boolean;
};
type CodexThreadReadResponse = {
  thread: CodexThread;
};
type CodexThreadTurnsListParams = JsonObject & {
  threadId: string;
  cursor?: string | null;
  limit?: number | null;
  sortDirection?: "asc" | "desc" | null;
  itemsView?: "notLoaded" | "summary" | "full" | null;
};
type CodexThreadTurnsListResponse = {
  data: CodexTurn[];
  nextCursor?: string | null;
  backwardsCursor?: string | null;
};
type CodexInitialTurnsPage = Omit<CodexThreadTurnsListResponse, "data"> & {
  data: Pick<CodexTurn, "id" | "status">[];
};
type CodexThreadSetNameParams = JsonObject & {
  threadId: string;
  name: string;
};
type CodexThreadArchiveParams = JsonObject & {
  threadId: string;
};
type CodexThreadDeleteParams = JsonObject & {
  threadId: string;
};
type CodexThreadDeleteResponse = Record<string, never>;
type CodexThreadUnarchiveResponse = {
  thread: CodexThread;
};
type CodexThreadResumeResponse = {
  thread: CodexThread;
  model: string;
  modelProvider?: string | null;
  initialTurnsPage?: CodexInitialTurnsPage | null;
};
type CodexThreadGoalStatus = "active" | "paused" | "blocked" | "usageLimited" | "budgetLimited" | "complete";
type CodexThreadGoal = {
  threadId: string;
  objective: string;
  status: CodexThreadGoalStatus;
  tokenBudget: number | null;
  tokensUsed: number;
  timeUsedSeconds: number;
  createdAt: number;
  updatedAt: number;
};
type CodexThreadGoalSetParams = JsonObject & {
  threadId: string;
  objective?: string;
  status?: CodexThreadGoalStatus;
  tokenBudget?: number | null;
};
type CodexThreadGoalGetParams = JsonObject & {
  threadId: string;
};
type CodexThreadGoalClearParams = JsonObject & {
  threadId: string;
};
type CodexThreadGoalSetResponse = {
  goal: CodexThreadGoal;
};
type CodexThreadGoalGetResponse = {
  goal: CodexThreadGoal | null;
};
type CodexThreadGoalClearResponse = {
  cleared: boolean;
};
type CodexThreadInjectItemsParams = JsonObject & {
  threadId: string;
  items: JsonValue[];
};
type CodexThreadUnsubscribeParams = JsonObject & {
  threadId: string;
};
type CodexTurnInterruptParams = JsonObject & {
  threadId: string;
  turnId: string;
};
type CodexTurnStartResponse = {
  turn: CodexTurn;
};
type CodexTurn = {
  id: string;
  threadId?: string;
  status?: string;
  error?: CodexErrorNotification["error"] | null;
  startedAt?: number | null;
  completedAt?: number | null;
  durationMs?: number | null;
  items: CodexThreadItem[];
};
type CodexThread = {
  id: string;
  sessionId?: string;
  path?: string | null;
  historyMode?: "legacy" | "paginated";
  extra?: JsonObject | null;
  name?: string | null;
  preview?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  status?: CodexThreadStatus | null;
  modelProvider?: string | null;
  cwd?: string | null;
  source?: CodexSessionSource | null;
  threadSource?: string | null;
  agentNickname?: string | null;
  agentRole?: string | null;
  turns?: CodexTurn[];
};
type CodexThreadStatus = {
  type: "notLoaded";
} | {
  type: "idle";
} | {
  type: "systemError";
} | {
  type: "active";
  activeFlags?: string[];
};
type CodexSubAgentThreadSpawnSource = {
  parent_thread_id: string;
  depth?: number;
  agent_path?: string | null;
  agent_nickname?: string | null;
  agent_role?: string | null;
};
type CodexSubAgentSource = "review" | "compact" | "memory_consolidation" | {
  thread_spawn: CodexSubAgentThreadSpawnSource;
} | {
  other: string;
};
type CodexSessionSource = "cli" | "vscode" | "exec" | "appServer" | "unknown" | {
  custom: string;
} | {
  subAgent: CodexSubAgentSource;
};
type CodexThreadItem = {
  id: string;
  type: string;
  title: string | null;
  status: string | null;
  name: string | null;
  tool: string | null;
  server: string | null;
  command: string | null;
  cwd: string | null;
  query: string | null;
  arguments?: JsonValue;
  result?: JsonValue;
  error?: CodexErrorNotification["error"];
  exitCode?: number | null;
  durationMs?: number | null;
  aggregatedOutput: string | null;
  text: string;
  contentItems?: CodexDynamicToolCallOutputContentItem[] | null;
  changes: Array<{
    path: string;
    kind: string;
  }>;
  [key: string]: unknown;
};
type CodexServerNotification = {
  method: string;
  params?: JsonValue;
};
type CodexDynamicToolCallOutputContentItem = {
  type: "inputText";
  text: string;
} | {
  type: "inputImage";
  imageUrl: string;
} | JsonObject;
type CodexErrorNotification = {
  error: {
    message?: string;
    codexErrorInfo?: string | JsonObject | null;
    additionalDetails?: string | null;
    [key: string]: unknown;
  };
  willRetry?: boolean;
  threadId?: string;
  turnId?: string;
};
type CodexModel = {
  id?: string;
  model?: string;
  displayName?: string | null;
  description?: string | null;
  hidden: boolean;
  isDefault: boolean;
  inputModalities: string[];
  supportedReasoningEfforts: CodexReasoningEffortOption[];
  defaultReasoningEffort?: string | null;
};
type CodexReasoningEffortOption = {
  reasoningEffort?: string | null;
};
type CodexModelListResponse = {
  data: CodexModel[];
  nextCursor?: string | null;
};
type CodexGetAccountResponse = {
  account?: JsonValue;
  requiresOpenaiAuth?: boolean;
};
type CodexModelProviderCapabilitiesReadResponse = {
  namespaceTools: boolean;
  imageGeneration: boolean;
  webSearch: boolean;
};
type CodexLoginAccountParams = {
  type: "apiKey";
  apiKey: string;
} | {
  type: "chatgptAuthTokens";
  accessToken: string;
  chatgptAccountId: string;
  chatgptPlanType: string | null;
};
type CodexAppServerRequestParamsOverride = {
  "app/installed": CodexAppsInstalledParams;
  "app/list": CodexAppsListParams;
  "app/read": CodexAppsReadParams;
  "command/exec": CodexCommandExecParams;
  "config/batchWrite": CodexConfigBatchWriteParams;
  "config/value/write": CodexConfigValueWriteParams;
  "environment/add": {
    environmentId: string;
    execServerUrl: string;
  };
  "plugin/installed": CodexPluginInstalledParams;
  "plugin/install": CodexPluginInstallParams;
  "plugin/list": CodexPluginListParams;
  "plugin/read": CodexPluginReadParams;
  "thread/fork": CodexThreadForkParams;
  "thread/archive": CodexThreadArchiveParams;
  "thread/delete": CodexThreadDeleteParams;
  "thread/inject_items": CodexThreadInjectItemsParams;
  "thread/list": CodexThreadListParams;
  "thread/turns/list": CodexThreadTurnsListParams;
  "thread/name/set": CodexThreadSetNameParams;
  "thread/read": CodexThreadReadParams;
  "thread/start": CodexThreadStartParams;
  "thread/unarchive": CodexThreadArchiveParams;
  "thread/unsubscribe": CodexThreadUnsubscribeParams;
  "thread/goal/set": CodexThreadGoalSetParams;
  "thread/goal/get": CodexThreadGoalGetParams;
  "thread/goal/clear": CodexThreadGoalClearParams;
  "turn/interrupt": CodexTurnInterruptParams;
  "mcpServer/resource/read": ResourceReadParams;
  "mcpServer/tool/call": ToolCallParams;
};
type CodexAppServerRequestResultMap = {
  initialize: CodexInitializeResponse;
  "account/rateLimits/read": JsonValue;
  "account/read": CodexGetAccountResponse;
  "app/installed": CodexAppsInstalledResponse;
  "app/list": CodexAppsListResponse;
  "app/read": CodexAppsReadResponse;
  "command/exec": CodexCommandExecResponse;
  "config/batchWrite": CodexConfigWriteResponse;
  "config/mcpServer/reload": JsonValue;
  "config/read": CodexConfigReadResponse;
  "configRequirements/read": CodexConfigRequirementsReadResponse;
  "config/value/write": CodexConfigWriteResponse;
  "environment/add": JsonValue;
  "experimentalFeature/enablement/set": JsonValue;
  "feedback/upload": JsonValue;
  "hooks/list": CodexHooksListResponse;
  "marketplace/add": JsonValue;
  "mcpServerStatus/list": CodexListMcpServerStatusResponse;
  "mcpServer/resource/read": ResourceReadResult;
  "mcpServer/tool/call": ToolCallResult;
  "model/list": CodexModelListResponse;
  "modelProvider/capabilities/read": CodexModelProviderCapabilitiesReadResponse;
  "plugin/installed": CodexPluginInstalledResponse;
  "plugin/install": CodexPluginInstallResponse;
  "plugin/list": CodexPluginListResponse;
  "plugin/read": CodexPluginReadResponse;
  "review/start": JsonValue;
  "skills/list": CodexSkillsListResponse;
  "thread/compact/start": JsonValue;
  "thread/archive": JsonValue;
  "thread/delete": CodexThreadDeleteResponse;
  "thread/fork": CodexThreadForkResponse;
  "thread/inject_items": JsonValue;
  "thread/list": CodexThreadListResponse;
  "thread/turns/list": CodexThreadTurnsListResponse;
  "thread/name/set": JsonValue;
  "thread/read": CodexThreadReadResponse;
  "thread/resume": CodexThreadResumeResponse;
  "thread/start": CodexThreadStartResponse;
  "thread/unarchive": CodexThreadUnarchiveResponse;
  "thread/unsubscribe": JsonValue;
  "thread/goal/set": CodexThreadGoalSetResponse;
  "thread/goal/get": CodexThreadGoalGetResponse;
  "thread/goal/clear": CodexThreadGoalClearResponse;
  "turn/interrupt": JsonValue;
  "turn/start": CodexTurnStartResponse;
  "turn/steer": JsonValue;
};
//#endregion
//#region extensions/codex/src/app-server/config-contracts.d.ts
type CodexAppServerTransportMode = "stdio" | "websocket" | "unix";
type CodexAppServerHomeScope = "agent" | "user";
type CodexAppServerCommandSource = "managed" | "resolved-managed" | "config" | "env";
type CodexManagedCommandOrder = "package-first" | "desktop-first";
type CodexAppServerStartOptions = {
  transport: CodexAppServerTransportMode;
  homeScope?: CodexAppServerHomeScope;
  command: string;
  commandSource?: CodexAppServerCommandSource; /** Desktop-first is reserved for the macOS app process that owns Computer Use permissions. */
  managedCommandOrder?: CodexManagedCommandOrder; /** Native plugin names checked at the final managed spawn boundary. */
  managedComputerUsePluginNames?: string[];
  managedFallbackCommandPaths?: string[];
  args: string[]; /** Process working directory for shipped Supervisor stdio endpoint compatibility. */
  cwd?: string;
  url?: string;
  authToken?: string;
  headers: Record<string, string>;
  env?: Record<string, string>;
  clearEnv?: string[];
};
//#endregion
//#region extensions/codex/src/app-server/transport.d.ts
/**
 * Shared transport lifecycle helpers for stdio and WebSocket Codex app-server
 * connections.
 */
/** Child-process-like transport shape consumed by the Codex app-server client. */
type CodexAppServerTransport = {
  stdin: {
    write: (data: string | Uint8Array, callback?: (error?: Error | null) => void) => unknown;
    end?: () => unknown;
    destroy?: () => unknown;
    unref?: () => unknown;
    on?: (event: "error", listener: (error: Error) => void) => unknown;
  };
  stdout: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  stderr: NodeJS.ReadableStream & {
    destroy?: () => unknown;
    unref?: () => unknown;
  };
  pid?: number;
  exitCode?: number | null;
  signalCode?: string | null;
  killed?: boolean;
  kill?: (signal?: NodeJS.Signals) => unknown;
  unref?: () => unknown;
  once: (event: string, listener: (...args: unknown[]) => void) => unknown;
  off?: (event: string, listener: (...args: unknown[]) => void) => unknown;
};
//#endregion
//#region extensions/codex/src/app-server/client.d.ts
type CodexServerRequestHandler = (request: Required<Pick<RpcRequest, "id" | "method">> & {
  params?: JsonValue;
}, signal?: AbortSignal) => Promise<JsonValue | undefined> | JsonValue | undefined;
/** Notification handler registered on a Codex app-server client. */
type CodexServerNotificationHandler = (notification: CodexServerNotification) => Promise<void> | void;
/** Runtime identity returned by the Codex app-server initialize handshake. */
type CodexAppServerRuntimeIdentity = {
  serverVersion: string;
  userAgent?: string;
  codexHome?: string;
  platformFamily?: string;
  platformOs?: string;
};
/** Stateful app-server JSON-RPC client over stdio or websocket transport. */
declare class CodexAppServerClient {
  private readonly instanceId;
  private readonly child;
  private readonly lines;
  private readonly pending;
  private readonly requestHandlers;
  private readonly notificationHandlers;
  private readonly closeHandlers;
  private nextId;
  private initialized;
  private closed;
  private transportExited;
  private closeError;
  private serverVersion;
  private runtimeIdentity;
  private threadSessionRequestGuard;
  private stderrTail;
  private pendingParse;
  private constructor();
  /** Starts a new app-server client using resolved runtime start options. */
  static start(options?: Partial<CodexAppServerStartOptions>): CodexAppServerClient;
  /** Builds a client around a fake transport for tests. */
  static fromTransportForTests(child: CodexAppServerTransport): CodexAppServerClient;
  /** Performs the app-server initialize handshake and validates protocol version. */
  initialize(): Promise<void>;
  /** Returns the version detected during initialize. */
  getServerVersion(): string | undefined;
  /** Returns runtime metadata detected during initialize. */
  getRuntimeIdentity(): CodexAppServerRuntimeIdentity | undefined;
  /** Returns a bounded, redacted stderr diagnostic from the app-server process. */
  getStderrDiagnostic(): string | undefined;
  /** Returns the terminal transport error that closed this physical client. */
  getCloseError(): Error | undefined;
  /** Stable generation id for this exact physical client instance. */
  getInstanceId(): string;
  /** Installs the spawn-owner check run before config-loading thread requests. */
  setThreadSessionRequestGuard(guard: ((options: {
    signal?: AbortSignal;
    timeoutMs?: number;
    timeoutMessage: string;
    abortMessage: string;
  }) => Promise<() => void>) | undefined): void;
  /** Returns the local transport PID for scoped child-process cleanup, when available. */
  getTransportPid(): number | undefined;
  request<M extends CodexAppServerRequestMethod>(method: M, params: CodexAppServerRequestParams<M>, options?: {
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<CodexAppServerRequestResult<M>>;
  request<T = JsonValue | undefined>(method: string, params?: unknown, options?: {
    timeoutMs?: number;
    signal?: AbortSignal;
  }): Promise<T>;
  private requestWithoutThreadSessionGuard;
  private requestWithOverloadRetry;
  private waitForOverloadRetry;
  private requestOnce;
  /** Sends a fire-and-forget JSON-RPC notification to the app-server. */
  notify(method: string, params?: JsonValue): void;
  /** Registers a handler for app-server requests sent back to OpenClaw. */
  addRequestHandler(handler: CodexServerRequestHandler): () => void;
  /** Registers a notification handler and returns its disposer. */
  addNotificationHandler(handler: CodexServerNotificationHandler): () => void;
  /** Registers a close handler and returns its disposer. */
  addCloseHandler(handler: (client: CodexAppServerClient) => void): () => void;
  /** Closes the transport without waiting for process/socket shutdown. */
  close(): void;
  /** Closes the transport and waits for shutdown according to transport policy. */
  closeAndWait(options?: {
    exitTimeoutMs?: number;
    forceKillDelayMs?: number;
  }): Promise<boolean>;
  /** Closes this transport and runs cleanup only after physical process exit. */
  closeAndRunAfterExit(onExit: () => void, operation: string): Promise<void>;
  private writeMessage;
  private handleLine;
  private handlePendingParseLine;
  private handleParsedMessage;
  private handleResponse;
  private handleServerRequest;
  private runServerRequestHandlers;
  private runServerRequestHandlersWithoutTimeout;
  private handleNotification;
  private closeWithError;
  private markClosed;
  private rejectPendingRequests;
}
//#endregion
//#region extensions/codex/src/app-server/auth-bridge.d.ts
type AuthProfileOrderConfig = Parameters<typeof resolveAuthProfileOrder>[0]["cfg"];
type CodexAppServerAuthRequirement = "api-key" | "subscription";
declare function resolveCodexAppServerAuthProfileIdForAgent(params: {
  authProfileId?: string;
  authProfileStore?: AuthProfileStore;
  agentDir?: string;
  config?: AuthProfileOrderConfig;
}): string | undefined;
type CodexAppServerPreparedAuthProfileSnapshot = {
  loginParams: CodexLoginAccountParams;
  secretFreeCacheKey: string; /** Genuine ChatGPT principal id; email/profile fallbacks are not authorization identity. */
  chatgptAccountId?: string;
};
type CodexAppServerPreparedAuth = {
  kind: "api-key";
  apiKey: string;
} | {
  kind: "profile";
  profileId: string;
  store: AuthProfileStore;
  snapshot?: CodexAppServerPreparedAuthProfileSnapshot;
};
//#endregion
//#region extensions/codex/src/app-server/shared-client.d.ts
type CodexAppServerClientOptions = {
  startOptions?: CodexAppServerStartOptions;
  pluginConfig?: unknown;
  timeoutMs?: number;
  authProfileId?: string | null;
  authProfileStore?: AuthProfileStore;
  authBindingFingerprint?: string; /** Setup-only generation whose exact local runtime bytes are captured. */
  runtimeArtifactMode?: "capture"; /** Previously minted exact runtime required before the process may start. */
  expectedRuntimeArtifact?: AgentHarnessRuntimeArtifactBinding;
  preparedAuth?: CodexAppServerPreparedAuth;
  authRequirement?: CodexAppServerAuthRequirement;
  agentId?: string;
  agentDir?: string;
  config?: Parameters<typeof resolveCodexAppServerAuthProfileIdForAgent>[0]["config"];
  onStartedClient?: (client: CodexAppServerClient) => void;
  abandonSignal?: AbortSignal;
};
/** Factory used by attempt startup and side turns to acquire a leased client. */
type CodexAppServerClientFactory = (options?: CodexAppServerClientOptions) => Promise<CodexAppServerClient>;
//#endregion
//#region extensions/codex/src/app-server/run-attempt-types.d.ts
type CodexRunAttemptOptions = {
  bindingStore: CodexAppServerBindingStore;
  pluginConfig?: unknown;
  startupTimeoutFloorMs?: number;
  nativeHookRelay?: {
    enabled?: boolean;
    events?: readonly NativeHookRelayEvent[];
    ttlMs?: number;
    gatewayTimeoutMs?: number;
    hookTimeoutSec?: number;
  };
  turnCompletionIdleTimeoutMs?: number;
  turnAssistantCompletionIdleTimeoutMs?: number;
  postToolRawAssistantCompletionIdleTimeoutMs?: number;
  turnTerminalIdleTimeoutMs?: number;
  clientFactory?: CodexAppServerClientFactory;
};
//#endregion
//#region extensions/codex/src/app-server/run-attempt.d.ts
declare function runCodexAppServerAttempt(params: EmbeddedRunAttemptParamsV2, options: CodexRunAttemptOptions): Promise<EmbeddedRunAttemptResult>;
//#endregion
export { runCodexAppServerAttempt };