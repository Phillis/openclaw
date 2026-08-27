import "./plugin-entry-C1So83n6.js";
import "./setup-wizard-types-DVg7Zco4.js";
import "./config-contracts-CbBCWgEm.js";
import "./agent-runtime-DyrGTaeu.js";
import "./secret-input-CHvO7eLi.js";
import { z } from "zod";
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
  threadId?: string | null;
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
  origins: Record<string, CodexConfigLayerMetadata | undefined>;
  layers?: JsonValue[] | null;
};
type CodexConfigReadParams = {
  includeLayers?: boolean;
  cwd?: string | null;
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
  type: "packagedDefaults";
  file: string;
} | {
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
type CodexWireJsonValue = null | boolean | number | string | CodexWireJsonValue[] | { [key in string]?: CodexWireJsonValue; };
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
  name: string;
  /** Present only after the configured server completed MCP initialization. */
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
  originCallId?: string | null;
  server: string;
  uri: string;
  connectorId?: string | null;
};
type ToolCallParams = {
  threadId: string;
  server: string;
  tool: string;
  arguments?: JsonValue;
  _meta?: JsonValue;
};
type CodexMcpResourceContent = {
  uri: string;
  mimeType?: string;
  text: string;
  _meta?: unknown;
} | {
  uri: string;
  mimeType?: string;
  blob: string;
  _meta?: unknown;
};
type ResourceReadResult = {
  contents: CodexMcpResourceContent[];
  originCallId?: string | null;
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
  projectId?: string | null;
  runtimeWorkspaceRoots?: string[] | null;
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
  projectId: string | null;
  historyMode?: "legacy" | "paginated";
  extra?: JsonObject | null;
  name?: string | null;
  preview?: string | null;
  createdAt?: number | null;
  updatedAt?: number | null;
  status?: CodexThreadStatus | null;
  canAcceptDirectInput?: boolean | null;
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
  delivery?: "async" | null;
  contentItems?: CodexDynamicToolCallOutputContentItem[] | null;
  changes: Array<{
    path: string;
    kind: string;
  }>;
  [key: string]: unknown;
};
type CodexStrictReviewRequiredNotification = {
  method: "autoApprovalReview/strictReviewRequired";
  params: JsonObject & {
    threadId: string;
    turnId: string;
    startedAtMs: number;
  };
};
type CodexServerNotification = CodexStrictReviewRequiredNotification | {
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
    codexErrorInfo?: "misalignmentPolicyViolation" | (string & {}) | JsonObject | null;
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
  multiAgentVersion?: "disabled" | "v1" | "v2" | null;
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
  "config/read": CodexConfigReadParams;
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
type CodexAppServerConnectionClass = "local-loopback" | "remote";
type CodexAppServerRemoteAppsSubstrate = "preconfigured";
type CodexAppServerApprovalPolicySource = "config" | "env" | "requirements" | "implicit";
type CodexAppServerEffectiveApprovalPolicy = CodexApprovalPolicy;
type CodexAppServerSandboxMode = "read-only" | "workspace-write" | "danger-full-access";
type CodexAppServerApprovalsReviewer = "user" | "auto_review" | "guardian_subagent";
type CodexAppServerCommandSource = "managed" | "resolved-managed" | "config" | "env";
type CodexManagedCommandOrder = "package-first" | "desktop-first";
type ResolvedCodexAppServerNetworkProxyConfig = {
  profileName: string;
  configFingerprint: string;
  configPatch: JsonObject;
};
type CodexAppServerStartOptions = {
  transport: CodexAppServerTransportMode;
  homeScope?: CodexAppServerHomeScope;
  command: string;
  commandSource?: CodexAppServerCommandSource;
  /** Desktop-first is reserved for the macOS app process that owns Computer Use permissions. */
  managedCommandOrder?: CodexManagedCommandOrder;
  /** Native plugin names checked at the final managed spawn boundary. */
  managedComputerUsePluginNames?: string[];
  managedFallbackCommandPaths?: string[];
  args: string[];
  /** Process working directory for shipped Supervisor stdio endpoint compatibility. */
  cwd?: string;
  url?: string;
  authToken?: string;
  headers: Record<string, string>;
  env?: Record<string, string>;
  clearEnv?: string[];
};
type CodexAppServerRuntimeOptions = {
  start: CodexAppServerStartOptions;
  connectionClass: CodexAppServerConnectionClass;
  remoteAppsSubstrate: CodexAppServerRemoteAppsSubstrate;
  remoteWorkspaceRoot?: string;
  codeModeOnly: boolean;
  loopDetectionPreToolUseRelay: boolean;
  requestTimeoutMs: number;
  turnCompletionIdleTimeoutMs: number;
  turnAssistantCompletionIdleTimeoutMs?: number;
  postToolRawAssistantCompletionIdleTimeoutMs?: number;
  approvalPolicy: CodexAppServerEffectiveApprovalPolicy;
  approvalPolicySource?: CodexAppServerApprovalPolicySource;
  sandbox: CodexAppServerSandboxMode;
  approvalsReviewer: CodexAppServerApprovalsReviewer;
  /** Prepared boundary for an explicit session permission mode. */
  sessionRoot?: string;
  serviceTier?: CodexServiceTier | null;
  networkProxy?: ResolvedCodexAppServerNetworkProxyConfig;
};
//#endregion
export { CodexAppServerRequestResult as a, CodexThread as c, CodexThreadListParams as d, CodexThreadListResponse as f, JsonValue as g, RpcRequest as h, CodexAppServerRequestParams as i, CodexThreadForkParams as l, CodexThreadTurnsListResponse as m, CodexAppServerStartOptions as n, CodexLoginAccountParams as o, CodexThreadTurnsListParams as p, CodexAppServerRequestMethod as r, CodexServerNotification as s, CodexAppServerRuntimeOptions as t, CodexThreadForkResponse as u };