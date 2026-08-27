import { f as AgentToolResult, p as AgentToolUpdateCallback, u as AgentTool } from "./types-aADBdueZ.js";
import "./index-Bf1XfcnS.js";
import { Ct as ChatType, lt as GroupToolPolicyConfig, n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import { c as SessionToolOverrides, f as CronScheduledToolCallerOrigin, p as CronScheduledToolPolicy } from "./types-Kt4lh6nX.js";
import { t as InputProvenance } from "./input-provenance-tG11qAd-.js";
import { t as DeliveryContext } from "./delivery-context.types-D9JsPwhy.js";
import { n as PluginManifestRegistry } from "./manifest-registry-BvU-V0_L.js";
import { n as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-CzItNOEa.js";
import { t as CronRuntimeAuthority } from "./runtime-authority-UwYXiqCS.js";
import "./delivery-context.shared-tkGLbkan.js";
import { b as SkillSnapshot, i as SandboxToolPolicy } from "./types-CeW8bZNk.js";
import { TSchema } from "typebox";
//#region src/gateway/cron-creator-authority-grant.d.ts
type CronCreatorAuthorityGrant = Readonly<{
  runId: string;
  token: string;
}>;
type CronCreatorAuthorityRunScope = {
  readonly runId: string;
  readonly callerOrigin: CronScheduledToolCallerOrigin;
  readonly signal: AbortSignal;
  readonly grantTokens: Set<string>;
  active: boolean;
  abort: () => void;
};
//#endregion
//#region src/plugins/runtime/tool-grant.d.ts
/** Owner-scoped additive plugin tools for one trusted agent run. */
type RuntimePluginToolGrant = {
  pluginId: string;
  toolNames: readonly string[];
};
//#endregion
//#region src/agents/subagents/announce/subagent-announce-handoff.d.ts
type TrustedSubagentCompletionHandoff = {
  kind: "subagent-completion";
  sourceSessionKey: string;
  sourceSessionId?: string;
  targetSessionKey: string;
  targetSessionId: string;
  provider: string;
  model: string;
};
type SubagentCompletionToolHandoffRegistration = {
  sourceSessionKey: string;
  sourceSessionId?: string;
  targetSessionKey: string;
  targetSessionId: string;
  idempotencyKey: string;
};
//#endregion
//#region src/agents/tools/tool-results.d.ts
declare function jsonResult<TDetails>(payload: TDetails): AgentToolResult<TDetails>;
//#endregion
//#region src/agents/tools/common.d.ts
type AgentToolWithMeta<TParameters extends TSchema, TResult> = AgentTool<TParameters, TResult> & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: (params: unknown, ctx: {
    toolCallId?: string;
    hookContext?: unknown;
    signal?: AbortSignal;
  }) => unknown;
  finalizeBeforeToolCallParams?: (params: unknown, preparedParams: unknown) => unknown;
};
type ErasedAgentToolExecute = {
  execute(this: void, toolCallId: string, params: unknown, signal?: AbortSignal, onUpdate?: AgentToolUpdateCallback): Promise<AgentToolResult<unknown>>;
};
type AnyAgentTool = Omit<AgentTool, "execute"> & ErasedAgentToolExecute & {
  displaySummary?: string;
  /** Keep this tool model-visible; hidden catalog bridges cannot preserve its result contract. */
  catalogMode?: "direct-only";
  /** Gateway client capabilities required before this tool can be assembled. */
  requiredClientCaps?: string[];
  prepareBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["prepareBeforeToolCallParams"];
  finalizeBeforeToolCallParams?: AgentToolWithMeta<TSchema, unknown>["finalizeBeforeToolCallParams"];
};
declare function asToolParamsRecord(params: unknown): Record<string, unknown>;
type StringParamOptions = {
  required?: boolean;
  trim?: boolean;
  label?: string;
  allowEmpty?: boolean;
};
declare function readToolStringParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string;
declare function readToolStringParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string | undefined;
declare function readNumberParam(params: Record<string, unknown>, key: string, options?: {
  required?: boolean;
  label?: string;
  integer?: boolean;
  strict?: boolean;
  positiveInteger?: boolean;
  nonNegativeInteger?: boolean;
}): number | undefined;
declare function readPositiveIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readNonNegativeIntegerParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  max?: number;
}): number | undefined;
declare function readFiniteNumberParam(params: Record<string, unknown>, key: string, options?: {
  message?: string;
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
}): number | undefined;
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options: StringParamOptions & {
  required: true;
}): string[];
declare function readStringArrayParam(params: Record<string, unknown>, key: string, options?: StringParamOptions): string[] | undefined;
//#endregion
//#region src/agents/scheduled-tool-policy.d.ts
/** Trusted runtime context for a scheduled run with a server-stamped tool cap. */
type ScheduledToolPolicyContext = Extract<CronScheduledToolPolicy, {
  mode: "trusted";
}> | (Extract<CronScheduledToolPolicy, {
  mode: "account";
}> & {
  /** Missing legacy runtime contexts are treated as unknown and fail closed. */
  ownerOrigin?: CronScheduledToolCallerOrigin;
});
//#endregion
//#region src/agents/tools/cron-tool.types.d.ts
type CronCreatorToolAllowlistEntry = string | {
  name: string;
  pluginId?: string;
};
type CronToolsAllowCaptureProvenance = {
  version: 1;
  source: "final-executable-surface";
};
type CronToolsAllowCaptureRef = {
  value?: CronToolsAllowCaptureProvenance;
};
type CronCreatorToolAuthorityMaterialization = {
  tools: readonly CronCreatorToolAllowlistEntry[];
  provenance: CronToolsAllowCaptureProvenance;
  /** Opaque runtime-owned authority captured with the same exact executable surface. */
  runtimeAuthority?: CronRuntimeAuthority;
};
type CronCreatorToolAuthoritySnapshot = Omit<CronCreatorToolAuthorityMaterialization, "runtimeAuthority"> & {
  /** Gateway-process one-shot proof consumed only at the matching cron write. */
  grant: CronCreatorAuthorityGrant;
};
type CronToolOptions = {
  agentSessionKey?: string;
  agentId?: string;
  /** Authenticated source account; authority must not be inferred from delivery. */
  agentAccountId?: string;
  /**
   * Resolved config for the calling context. Shapes the advertised schema and
   * description: when cron.triggers.enabled is off, trigger-gated surfaces
   * (trigger, script payloads, stream schedules) are not advertised. Omitting
   * config keeps the full surface for config-less callers.
   */
  config?: OpenClawConfig;
  currentDeliveryContext?: DeliveryContext;
  /**
   * Effective tool surface visible to the caller that created or edited a cron job.
   * Cron agent turns and trigger scripts use fresh runtimes, so agent-origin jobs
   * need this cap persisted before the original session policy is lost.
   */
  creatorToolAllowlist?: CronCreatorToolAllowlistEntry[];
  /** Host-owned proof that creatorToolAllowlist reached the final executable surface. */
  creatorToolAllowlistCaptureRef?: CronToolsAllowCaptureRef;
  /** Attempt-cached authority resolved only when a mutation changes its tool cap. */
  resolveCreatorToolAuthority?: (options?: {
    signal?: AbortSignal;
  }) => Promise<CronCreatorToolAuthoritySnapshot>;
  /** Visible fail-closed reason when a queued local turn cannot retain fresh MCP authority. */
  creatorAuthorityUnavailableReason?: "queued-local-operator-configured-mcp";
  selfRemoveOnlyJobId?: string;
  runId?: string;
};
//#endregion
//#region src/agents/cron-creator-authority-context.d.ts
type CronCreatorAuthorityMaterializer = (options?: {
  signal?: AbortSignal;
}) => Promise<CronCreatorToolAuthorityMaterialization>;
/** Opaque in-process capability minted only by an admitted exact run. */
type CronCreatorAuthorityCapability = CronCreatorAuthorityRunScope;
/** Installs an explicitly transported capability only for synchronous tool construction. */
declare function runWithCronCreatorAuthorityCapabilityResolver<T>(params: {
  capability: CronCreatorAuthorityCapability | undefined;
  runId: string | undefined;
  resolve: CronCreatorAuthorityMaterializer;
  run: () => T;
}): T;
/** Carries a bundled-Codex resolver through synchronous core tool construction. */
declare function runWithCronCreatorAuthorityResolver<T>(params: {
  runId: string;
  resolve: CronCreatorAuthorityMaterializer;
  run: () => T;
}): T;
//#endregion
//#region src/agents/system-prompt.types.d.ts
type PromptMode = "full" | "minimal" | "none";
type SilentReplyPromptMode = "generic" | "none";
//#endregion
//#region src/agents/requester-tool-policy.d.ts
type RequesterToolPolicySource = "current-request" | "persisted-child" | "completion-handoff";
//#endregion
//#region src/agents/sandbox-tool-policy.d.ts
/** Provenance marker for wildcard allowlists created from `alsoAllow`. */
declare const IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW: unique symbol;
//#endregion
//#region src/agents/tool-policy.d.ts
/** Tool allow/deny policy shape accepted by agent and sandbox config. */
type ToolPolicyLike = {
  allow?: string[];
  deny?: string[];
  [IMPLICIT_ALLOW_ALL_FROM_ALSO_ALLOW]?: true;
};
//#endregion
//#region src/agents/conversation-capability-profile.d.ts
type ConversationCapabilityScope = "direct" | "shared" | "unknown";
type ConversationCapabilityProfileParams = {
  config?: OpenClawConfig;
  sessionKey?: string;
  /** Live conversation key when a sandbox/policy key is used for tool filtering. */
  runSessionKey?: string;
  /** Session key used for subagent capability inheritance when it differs from sessionKey. */
  sandboxSessionKey?: string;
  sessionId?: string;
  runId?: string;
  agentId?: string;
  agentDir?: string;
  agentAccountId?: string | null;
  messageProvider?: string | null;
  messageChannel?: string | null;
  chatType?: string;
  messageTo?: string | null;
  messageThreadId?: string | number | null;
  conversationToolPolicy?: GroupToolPolicyConfig;
  currentChannelId?: string | null;
  currentMessagingTarget?: string | null;
  currentThreadTs?: string | null;
  currentMessageId?: string | number | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  memberRoleIds?: readonly string[];
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  senderIsOwner?: boolean;
  modelProvider?: string;
  modelId?: string;
  modelApi?: string;
  modelContextWindowTokens?: number;
  modelHasVision?: boolean;
  workspaceDir?: string;
  cwd?: string;
  spawnWorkspaceDir?: string;
  isCanonicalWorkspace?: boolean;
  promptMode?: PromptMode;
  skillsSnapshot?: SkillSnapshot;
  sandboxToolPolicy?: SandboxToolPolicy;
  runtimeToolAllowlist?: string[];
  /** Persist the runtime allowlist as real parent authority on spawned children. */
  inheritRuntimeToolAllowlist?: boolean;
  runtimePluginToolGrant?: RuntimePluginToolGrant;
  pluginMetadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
  inputProvenance?: InputProvenance;
  /** Consumed in-process completion capability; public callers cannot set this fact. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext;
};
type ResolvedConversationCapabilityProfile = {
  agentId?: string;
  serviceIdentity: {
    agentId?: string;
    agentDir?: string;
    accountId?: string | null;
    runId?: string;
    sessionId?: string;
  };
  model: {
    provider?: string;
    id?: string;
    api?: string;
    contextWindowTokens?: number;
    hasVision?: boolean;
  };
  conversation: {
    scope: ConversationCapabilityScope;
    chatType?: ChatType;
    sessionKey?: string;
    policySessionKey?: string;
    runSessionKey?: string;
    sessionId?: string;
    messageProvider?: string | null;
    messageChannel?: string | null;
    messageTo?: string | null;
    messageThreadId?: string | number | null;
    currentChannelId?: string | null;
    currentMessagingTarget?: string | null;
    currentThreadTs?: string | null;
    currentMessageId?: string | number | null;
    groupId?: string | null;
    groupChannel?: string | null;
    groupSpace?: string | null;
    memberRoleIds?: readonly string[];
    spawnedBy?: string | null;
  };
  sender: {
    id?: string | null;
    name?: string | null;
    username?: string | null;
    e164?: string | null;
    isOwner?: boolean;
  };
  workspace: {
    workspaceDir?: string;
    cwd?: string;
    spawnWorkspaceDir?: string;
    workspaceRoot: string;
    runtimeRoot: string;
    spawnWorkspaceRoot?: string;
    instructionRoot?: string;
    isCanonicalWorkspace?: boolean;
  };
  instructions: {
    agentDir?: string;
    workspaceDir?: string;
    promptMode?: PromptMode;
    isCanonicalWorkspace?: boolean;
  };
  skills: {
    snapshot?: SkillSnapshot;
  };
  policy: {
    agentId?: string;
    sessionKey?: string;
    subagentSessionKey?: string;
    trustedGroup: {
      groupId: string | null | undefined;
      dropped: boolean;
    };
    profile?: string;
    providerProfile?: string;
    profilePolicy?: ToolPolicyLike;
    providerProfilePolicy?: ToolPolicyLike;
    profileAlsoAllow?: string[];
    providerProfileAlsoAllow?: string[];
    globalPolicy?: SandboxToolPolicy;
    globalProviderPolicy?: SandboxToolPolicy;
    agentPolicy?: SandboxToolPolicy;
    agentProviderPolicy?: SandboxToolPolicy;
    groupPolicy?: SandboxToolPolicy;
    senderPolicy?: SandboxToolPolicy;
    sandboxPolicy?: SandboxToolPolicy;
    subagentPolicy?: SandboxToolPolicy;
    inheritedToolPolicy?: SandboxToolPolicy;
    delegated: boolean;
    requesterPolicySource: RequesterToolPolicySource;
    runtimeToolPolicyForInheritance?: ToolPolicyLike;
    inheritancePolicies: Array<ToolPolicyLike | undefined>;
    explicitToolAllowlist: string[];
    /** Explicit config/runtime grants only; excludes built-in profile expansion. */
    explicitToolOverrideAllowlist: string[];
    explicitToolDenylist: string[];
    runtimePluginToolGrant?: RuntimePluginToolGrant;
  };
};
//#endregion
//#region src/agents/agent-bundle-mcp-harness.d.ts
type ScheduledStaticHarnessMcpTools = {
  /** Final executable static MCP tools for this scheduled turn. */
  tools: AnyAgentTool[];
  /** Bounded model/operator warning when configured servers or final policy were incomplete. */
  diagnosticNotice?: string;
  dispose: () => Promise<void>;
};
type MaterializeRequesterScopedMcpToolsForHarnessRunParams = {
  sessionId: string;
  sessionKey?: string;
  agentId?: string;
  workspaceDir: string;
  agentDir?: string;
  cfg?: OpenClawConfig;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
  requesterSenderId?: string | null;
  agentAccountId?: string | null;
  messageChannel?: string | null;
  reservedToolNames?: Iterable<string>;
  toolsAllow?: string[];
  /** When set, applies the same final effective tool policy as the embedded runner. */
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile;
  /** Builds a capability profile when conversationCapabilityProfile is omitted. */
  policyContext?: Omit<ConversationCapabilityProfileParams, "runtimeToolAllowlist">;
  warn?: (message: string) => void;
};
/**
 * Materialize only static configured MCP for an authenticated scheduled turn.
 * No requester identity is accepted here, so requester resolvers stay unreachable.
 */
declare function materializeStaticMcpToolsForScheduledHarnessRunCore(params: Omit<MaterializeRequesterScopedMcpToolsForHarnessRunParams, "requesterSenderId" | "agentAccountId" | "messageChannel"> & {
  toolOverrides?: Pick<SessionToolOverrides, "mcpServers" | "mcpToolsDeny">;
  /** Exact established Codex yolo predicate; no other profile bypasses approval metadata. */
  autoApproveCodexAppServerApprovals?: boolean;
  /** Mutation-only probes retire their isolated runtime after the snapshot. */
  retireSessionRuntimeAfterDispose?: boolean;
}): Promise<ScheduledStaticHarnessMcpTools>;
//#endregion
export { RuntimePluginToolGrant as C, TrustedSubagentCompletionHandoff as S, readPositiveIntegerParam as _, CronCreatorAuthorityCapability as a, jsonResult as b, CronCreatorToolAllowlistEntry as c, ScheduledToolPolicyContext as d, AnyAgentTool as f, readNumberParam as g, readNonNegativeIntegerParam as h, SilentReplyPromptMode as i, CronToolOptions as l, readFiniteNumberParam as m, ResolvedConversationCapabilityProfile as n, runWithCronCreatorAuthorityCapabilityResolver as o, asToolParamsRecord as p, PromptMode as r, runWithCronCreatorAuthorityResolver as s, materializeStaticMcpToolsForScheduledHarnessRunCore as t, CronToolsAllowCaptureRef as u, readStringArrayParam as v, CronCreatorAuthorityGrant as w, SubagentCompletionToolHandoffRegistration as x, readToolStringParam as y };