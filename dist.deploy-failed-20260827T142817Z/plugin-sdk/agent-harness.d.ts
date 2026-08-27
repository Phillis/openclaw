import { o as ModelCompatConfig, r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { M as ChatType } from "../types.base-DUfwpzwr.js";
import { X as GroupToolPolicyConfig } from "../types.channels-D0WNvlsX.js";
import { i as AgentToolUpdateCallback, r as AgentToolResult } from "../types-CkbcxW1I.js";
import { v as SourceReplyDeliveryMode } from "../types-Byd4mWhx.js";
import { t as InboundEventKind } from "../kind-CC2t750M.js";
import { T as AuthProfileStore } from "../types-BFl3Ao02.js";
import { ct as InputProvenance, g as TaskSuggestionDeliveryMode, ut as PluginHookChannelContext } from "../templating-CW47wETJ.js";
import { t as DiagnosticTraceContext } from "../diagnostic-trace-context-c5mRZYEt.js";
import { Bo as SkillWorkshopRunOptions, Ca as CronToolOptions, Dt as SandboxContext, Go as ScheduledToolPolicyContext, Hr as PreparedModelRuntimeSnapshot, Ka as ProcessToolDefaults, Mt as DelegationCapability, Ot as SandboxToolPolicy, Sa as CronCreatorToolAllowlistEntry, Wo as TrustedSubagentCompletionHandoff, _ as ToolOutcomeObserver, bo as AgentToolResultMiddlewareEvent, cn as ExecToolDefaults, ln as ModelAuthMode, nt as AgentHarness, on as ConversationRecallContext, vo as AgentToolResultMiddleware, wa as CronToolsAllowCaptureRef, wo as OpenClawAgentToolResult, xt as AgentHarnessV2 } from "../host-capability-types-3XBDy-df.js";
import { Xt as SystemAgentOperation, on as OperationalRunInstanceRef } from "../types-4_wTt5Pv.js";
import { i as SkillSnapshot, o as SkillUsagePath } from "../types-Hb8WnKto.js";
import { n as AnyAgentTool } from "../common-B5mmPMAR.js";
import { r as ToolDefinition } from "../model-catalog-CGi0o8D0.js";
import { G as createCodexAppServerToolResultExtensionRunner, W as createAgentToolResultMiddlewareRunner, i as EmbeddedRunAttemptParamsV2, jn as ResolvedConversationCapabilityProfile, mt as PluginToolMcpMeta, pt as disposeRegisteredAgentHarnesses, r as EmbeddedRunAttemptParams, vt as OpenClawCodingToolConstructionPlan } from "../agent-harness-runtime-nE3bGDs-.js";
import { n as abortAndDrainEmbeddedAgentRun, r as abortEmbeddedAgentRun, s as resolveActiveEmbeddedRunSessionId } from "../runs-D4DP9OmQ.js";
import { TSchema } from "typebox";

//#region src/agents/tools/system-agent-tool.d.ts
type SystemAgentToolOptions = {
  /** Where setup side effects run; the gateway surface never manages its own daemon. */surface: "cli" | "gateway";
  /**
   * Host-verified consent for THIS turn: true only when the host judged the
   * user's actual message to be an explicit approval. The model-supplied
   * `approved` argument alone must never authorize a mutation (prompt
   * injection, model error).
   */
  approvalArmed?: boolean;
  /**
   * Approval is scoped to one exact operation: a denied mutating call records
   * its canonical hash here (host-owned, survives turns), and an armed turn
   * may execute only a call matching that hash. Cleared after use.
   */
  proposalRef?: {
    current?: string;
    operation?: SystemAgentOperation;
  };
  /**
   * Host handoff channel for actions the tool cannot perform itself
   * (interactive channel setup, external onboarding guidance, opening the
   * agent TUI). The engine reads it after the turn; CLI MCP hosts mirror it
   * from tool events.
   */
  directiveRef?: {
    current?: SystemAgentToolDirective;
  };
};
/** Host directives the hosting chat engine handles after the turn. */
type SystemAgentToolDirective = {
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
  kind: "model-setup";
  workspace?: string;
} | {
  kind: "open-tui";
  agentId?: string;
  workspace?: string;
} | Extract<SystemAgentOperation, {
  kind: "open-setup";
}> | {
  kind: "approved-operation";
  operation: SystemAgentOperation;
};
//#endregion
//#region src/agents/tool-search-types.d.ts
type CatalogSource = "openclaw" | "mcp" | "client";
type CatalogTool = AnyAgentTool | ToolDefinition;
type ToolSearchCatalogToolExecutor = (params: {
  tool: CatalogTool;
  toolName: string;
  source: CatalogSource;
  sourceName?: string;
  toolCallId: string;
  parentToolCallId?: string;
  input: unknown;
  signal?: AbortSignal;
  onUpdate?: AgentToolUpdateCallback;
  acceptResultBeforeProjection: (result: AgentToolResult<unknown>) => Promise<AgentToolResult<unknown>>;
}) => Promise<AgentToolResult<unknown>>;
/** Catalog entry retained behind compacted Tool Search control tools. */
type ToolSearchCatalogEntry = {
  id: string;
  source: CatalogSource;
  sourceName?: string;
  mcp?: PluginToolMcpMeta;
  name: string;
  label?: string;
  description: string;
  parameters?: unknown;
  outputSchema?: TSchema;
  tool: CatalogTool;
};
type ToolSearchCatalogSession = {
  entries: ToolSearchCatalogEntry[];
  counterScope: string;
  searchCount: number;
  describeCount: number;
  callCount: number;
};
type ToolSearchCatalogRef = {
  current?: ToolSearchCatalogSession;
};
//#endregion
//#region src/agents/agent-tools.d.ts
/** Public options for building one plugin-owned agent tool surface. */
type OpenClawCodingToolsOptions = {
  agentId?: string;
  exec?: ExecToolDefaults & ProcessToolDefaults;
  messageProvider?: string; /** Canonical transport channel when tool-policy provider differs from delivery channel. */
  messageChannel?: string; /** Capabilities declared by the gateway client that originated this run. */
  clientCaps?: string[]; /** Out-of-band plugin bindings attached by the run initiator. */
  toolBindings?: Readonly<Record<string, unknown>>; /** Trusted runtime-only authorization for one bounded cross-conversation recall pass. */
  conversationRecall?: ConversationRecallContext; /** Normalized conversation kind when the caller already has channel metadata. */
  chatType?: ChatType; /** Specific ingress provider used only for transport tool availability. */
  toolPolicyMessageProvider?: string;
  agentAccountId?: string;
  messageTo?: string;
  messageThreadId?: string | number; /** Trusted platform-native conversation id for the active inbound turn. */
  nativeChannelId?: string; /** Opaque host-issued capability for current-turn channel message actions. */
  messageActionTurnCapability?: string;
  sandbox?: SandboxContext | null;
  sessionKey?: string;
  /**
   * The durable store session key for the live run when it differs from the
   * sandbox/policy session key used to construct the tool set.
   */
  runSessionKey?: string; /** Ephemeral session UUID — regenerated on /new and /reset. */
  sessionId?: string;
  /**
   * Explicit one-shot local CLI runs should not keep plugin-owned process
   * resources alive after emitting their result.
   */
  oneShotCliRun?: boolean; /** Stable run identifier for this agent invocation. */
  runId?: string; /** Exact admitted run instance for lifecycle-bound subprocess capabilities. */
  operationalRunInstance?: OperationalRunInstanceRef; /** Device-scoped operator session allowed to review approvals initiated by this run. */
  approvalReviewerDeviceId?: string; /** Diagnostic trace context for hook/log correlation during this run. */
  trace?: DiagnosticTraceContext; /** What initiated this run (for trigger-specific tool restrictions). */
  trigger?: string; /** Stable cron job identifier populated for cron-triggered runs. */
  jobId?: string; /** Relative workspace path that memory-triggered writes may append to. */
  memoryFlushWritePath?: string;
  agentDir?: string;
  preparedModelRuntime?: PreparedModelRuntimeSnapshot; /** Task working directory for coding tools. Defaults to workspaceDir. */
  cwd?: string;
  workspaceDir?: string;
  /**
   * Workspace directory that spawned subagents should inherit.
   * When sandboxing uses a copied workspace (`ro` or `none`), workspaceDir is the
   * sandbox copy but subagents should inherit the real agent workspace instead.
   * Defaults to workspaceDir when not set.
   */
  spawnWorkspaceDir?: string;
  config?: OpenClawConfig;
  abortSignal?: AbortSignal; /** Disable hook-owned diagnostics when an outer runtime owns tool diagnostics. */
  emitBeforeToolCallDiagnostics?: boolean; /** Skip hook wrapping when an outer tool-call boundary owns hook execution. */
  wrapBeforeToolCallHook?: boolean;
  /**
   * Provider of the currently selected model (used for provider-specific tool quirks).
   * Example: "anthropic", "openai", "google", "openai".
   */
  modelProvider?: string; /** Model id for the current provider (used for model-specific tool gating). */
  modelId?: string; /** Internal review-run restrictions and proposal provenance. */
  skillWorkshop?: SkillWorkshopRunOptions; /** Attempt-local authority to start or redirect delegated work. */
  delegationCapability?: DelegationCapability; /** Model API for the current provider (used for provider-native tool arbitration). */
  modelApi?: string; /** Model context window in tokens (used to scale read-tool output budget). */
  modelContextWindowTokens?: number; /** Resolved runtime model compatibility hints. */
  modelCompat?: ModelCompatConfig; /** If false, keep OpenClaw web_search even when a provider-native search tool is active. */
  suppressManagedWebSearch?: boolean;
  webSearchEnabled?: boolean;
  /**
   * Auth mode for the current provider. We only need this for Anthropic OAuth
   * tool-name blocking quirks.
   */
  modelAuthMode?: ModelAuthMode; /** Current channel ID for auto-threading (Slack). */
  currentChannelId?: string; /** Routable target for the current conversation when it differs from the native channel ID. */
  currentMessagingTarget?: string; /** Normalized conversation id exposed to tool hooks. Defaults to currentChannelId. */
  hookChannelId?: string; /** Channel-owned sender/chat metadata exposed to subprocess environments. */
  channelContext?: PluginHookChannelContext; /** Current thread timestamp for auto-threading (Slack). */
  currentThreadTs?: string; /** Current inbound message id for action fallbacks (e.g. Telegram react). */
  currentMessageId?: string | number; /** True when the current inbound turn carried audio media. */
  currentInboundAudio?: boolean; /** Dynamic audio state for runs that can accept steered input after tool creation. */
  hasCurrentInboundAudio?: () => boolean; /** Group id for channel-level tool policy resolution. */
  groupId?: string | null; /** Group channel label (e.g. #general) for channel-level tool policy resolution. */
  groupChannel?: string | null; /** Group space label (e.g. guild/team id) for channel-level tool policy resolution. */
  groupSpace?: string | null; /** Trusted provider role ids for the requester in this group turn. */
  memberRoleIds?: string[]; /** Parent session key for subagent group policy inheritance. */
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null; /** Reply-to mode for Slack auto-threading. */
  replyToMode?: "off" | "first" | "all" | "batched"; /** Mutable ref to track if a reply was sent (for "first" mode). */
  hasRepliedRef?: {
    value: boolean;
  }; /** Allow plugin tools for this run to late-bind the gateway subagent. */
  allowGatewaySubagentBinding?: boolean; /** Runtime-scoped explicit allowlist used to materialize matching plugin tools. */
  runtimeToolAllowlist?: string[]; /** True when runtimeToolAllowlist is real parent authority that child sessions inherit. */
  inheritRuntimeToolAllowlist?: boolean; /** Mutable spawn capability snapshot refreshed after late-bound runtime tools are authorized. */
  inheritedToolAllowlistRef?: string[]; /** Mutable cron creator cap ref for callers that append final runtime tools later. */
  cronCreatorToolAllowlistRef?: CronCreatorToolAllowlistEntry[]; /** Mutable proof that the cron cap reached the final executable surface. */
  cronCreatorToolAllowlistCaptureRef?: CronToolsAllowCaptureRef; /** Visible fail-closed reason for queued Codex configured-MCP cron mutations. */
  cronCreatorAuthorityUnavailableReason?: CronToolOptions["creatorAuthorityUnavailableReason"]; /** If true, the model has native vision capability */
  modelHasVision?: boolean; /** Mutable model-context generation used to expire screenshot coordinate frames. */
  computerContextEpoch?: {
    value: number;
  }; /** Require explicit message targets (no implicit last-route sends). */
  requireExplicitMessageTarget?: boolean; /** Visible source replies must be sent through the message tool when set to message_tool_only. */
  sourceReplyDeliveryMode?: SourceReplyDeliveryMode; /** Action sink available for model-proposed follow-up tasks. */
  taskSuggestionDeliveryMode?: TaskSuggestionDeliveryMode;
  inboundEventKind?: InboundEventKind; /** If true, omit the message tool from the tool list. */
  disableMessageTool?: boolean; /** Collector runs never open operator approval flows. */
  swarmCollector?: boolean; /** Synthetic structured_output schema for collector runs. */
  swarmOutputSchema?: Record<string, unknown>; /** Keep the message tool available even when the selected profile omits it. */
  forceMessageTool?: boolean; /** Include the heartbeat response tool for structured heartbeat outcomes. */
  enableHeartbeatTool?: boolean; /** Keep the heartbeat response tool available even when the selected profile omits it. */
  forceHeartbeatTool?: boolean; /** If false, build plugin tools only while preserving the shared policy pipeline. */
  includeCoreTools?: boolean; /** Include Tool Search control tools when enabled for this run. */
  includeToolSearchControls?: boolean; /** Executes cataloged tools through the active agent run lifecycle. */
  toolSearchCatalogExecutor?: ToolSearchCatalogToolExecutor; /** Runtime-local Tool Search catalog ref shared with attempt compaction. */
  toolSearchCatalogRef?: ToolSearchCatalogRef; /** Limits which tool families are materialized before the shared policy pipeline runs. */
  toolConstructionPlan?: OpenClawCodingToolConstructionPlan; /** Ring-zero OpenClaw tool; set only by the OpenClaw agent runner. */
  systemAgentTool?: SystemAgentToolOptions; /** Trusted sender identity bit for command/channel-action auth and owner-gated plugin tools. */
  senderIsOwner?: boolean; /** Auth profiles already loaded for this run; used for prompt-time tool availability. */
  authProfileStore?: AuthProfileStore; /** Callback invoked when sessions_yield tool is called. */
  onYield?: (message: string) => Promise<void> | void; /** Optional instrumentation callback for tool preparation stage timing. */
  recordToolPrepStage?: (name: string) => void; /** Lower routine policy-removal audits for diagnostic-only tool probes. */
  toolPolicyAuditLogLevel?: "info" | "debug"; /** Live observer called after wrapped tool outcomes are recorded. */
  onToolOutcome?: ToolOutcomeObserver; /** Reads the sticky untrusted-content flag for the current user turn. */
  isTurnTainted?: () => boolean; /** Supplies run-global model-call ordering for parallel tool outcomes. */
  allocateToolOutcomeOrdinal?: (toolCallId?: string) => number; /** Runtime-only resolved skill paths that the read tool may load under workspaceOnly. */
  skillsSnapshot?: SkillSnapshot; /** Original identities for sandbox-materialized skill instruction paths. */
  skillUsagePaths?: SkillUsagePath[]; /** Prepared conversation-scoped facts for callers that already resolved this run context. */
  conversationCapabilityProfile?: ResolvedConversationCapabilityProfile; /** Trusted conversation policy prepared at channel ingress. */
  conversationToolPolicy?: GroupToolPolicyConfig;
  inputProvenance?: InputProvenance; /** Consumed in-process completion capability; never derived from model-facing input. */
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff; /** Trusted server-stamped authority for an explicitly capped scheduled run. */
  scheduledToolPolicy?: ScheduledToolPolicyContext;
};
/** Build the runtime tool list exposed through the public agent harness SDK. */
declare function createOpenClawCodingTools(options?: OpenClawCodingToolsOptions): AnyAgentTool[];
//#endregion
//#region src/agents/web-search-tool-policy.d.ts
type WebSearchToolPolicyParams = {
  webSearchEnabled?: boolean;
  config?: OpenClawConfig;
  modelProvider?: string;
  modelId?: string;
  agentId?: string;
  sessionKey?: string;
  sessionId?: string;
  sandboxToolPolicy?: SandboxToolPolicy;
  messageProvider?: string;
  agentAccountId?: string | null;
  groupId?: string | null;
  groupChannel?: string | null;
  groupSpace?: string | null;
  spawnedBy?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  senderUsername?: string | null;
  senderE164?: string | null;
  inputProvenance?: InputProvenance;
  trustedInternalHandoff?: TrustedSubagentCompletionHandoff;
  scheduledToolPolicy?: ScheduledToolPolicyContext;
  runtimeToolAllowlist?: string[];
};
type WebSearchToolPolicyResolution = {
  allowed: boolean;
  persistentAllowed: boolean;
};
/** Resolves current and sender-independent policy for the managed web_search tool. */
declare function resolveWebSearchToolPolicy(params: WebSearchToolPolicyParams): WebSearchToolPolicyResolution;
//#endregion
export { type AgentHarness, type AgentHarnessV2, type AgentToolResultMiddleware, type AgentToolResultMiddlewareEvent, type AnyAgentTool, type EmbeddedRunAttemptParams, type EmbeddedRunAttemptParamsV2, type OpenClawAgentToolResult, abortEmbeddedAgentRun as abortAgentHarnessRun, abortAndDrainEmbeddedAgentRun as abortAndDrainAgentHarnessRun, createAgentToolResultMiddlewareRunner, createCodexAppServerToolResultExtensionRunner, createOpenClawCodingTools, disposeRegisteredAgentHarnesses, resolveActiveEmbeddedRunSessionId, resolveWebSearchToolPolicy };