import { $o as ChatType, Mi as GroupToolPolicyConfig, i as OpenClawConfig, ns as SandboxDockerSettings } from "./types.openclaw-ClnaeuRs.js";
import { i as CronScheduledToolPolicy, r as CronScheduledToolCallerOrigin, t as Skill } from "./skill-contract-Bes3Les8.js";
import { t as InputProvenance } from "./input-provenance-CbIybIuA.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-Unqs8JMC.js";
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
//#region src/skills/types.d.ts
type SkillCommandDispatchSpec = {
  kind: "tool";
  /** Name of the tool to invoke (AnyAgentTool.name). */
  toolName: string;
  /**
   * How to forward user-provided args to the tool.
   * - raw: forward the raw args string (no core parsing).
   */
  argMode?: "raw";
};
type SkillTelemetrySource = "bundled" | "unknown" | "workspace";
type SkillUsagePath = {
  /** Path visible to the tool runtime when it reads SKILL.md. */
  readPath: string;
  /** Canonical source SKILL.md path used as the lifecycle identity. */
  skillFile: string;
  skillName: string;
  skillSource: SkillTelemetrySource;
};
type ExplicitSkillSelection = {
  name: string;
  path: string;
};
type SkillCommandSpec = {
  name: string;
  /** Human-readable skill title for display surfaces. */
  displayName?: string;
  /** Canonical SKILL.md path for file-scoped usage accounting. */
  skillFile?: string;
  skillName: string;
  description: string;
  /** Whether the model can resolve this skill from its available-skills prompt. */
  modelVisible?: boolean;
  /** Bounded source label used for diagnostics. */
  skillSource?: SkillTelemetrySource;
  /** Localized descriptions for native command surfaces that support them. */
  descriptionLocalizations?: Record<string, string>;
  /** Optional deterministic dispatch behavior for this command. */
  dispatch?: SkillCommandDispatchSpec;
  /** Native prompt template used by Claude-bundle command markdown files. */
  promptTemplate?: string;
  /** Source markdown path for bundle-backed commands. */
  sourceFilePath?: string;
};
type SkillEligibilityContext = {
  nodeSkills?: {
    canExec: boolean;
    node?: string;
  };
  remote?: {
    platforms: string[];
    hasBin: (bin: string) => boolean;
    hasAnyBin: (bins: string[]) => boolean;
    note?: string;
  };
};
type SkillSnapshot = {
  prompt: string;
  /** Complete eligible sync identities, including skills hidden from the model prompt. */
  skills: Array<{
    name: string;
    /** Config key can differ from the prompt-facing skill name. */
    skillKey?: string;
    primaryEnv?: string;
    requiredEnv?: string[];
  }>;
  /** Normalized agent-level filter used to build this snapshot; undefined means unrestricted. */
  skillFilter?: string[];
  /** Sparse per-session overlay applied after the agent-level filter. */
  skillOverrides?: Record<string, boolean>;
  /** Effective node-exec eligibility used to select connected node-hosted skills. */
  nodeSkillsEligibility?: SkillEligibilityContext["nodeSkills"];
  resolvedSkills?: Skill[];
  /** Present only when a session merges skills from distinct agent and execution roots. */
  skillRoots?: {
    agentWorkspaceDir: string;
    executionSkillsDir: string;
  };
  version?: number;
  promptFormatVersion?: number;
};
//#endregion
//#region src/agents/sandbox/fs-bridge.types.d.ts
/**
 * Public sandbox filesystem bridge contracts.
 *
 * Tool and backend code use this interface to access files through the sandbox
 * boundary instead of reaching directly into host paths.
 */
/** Resolved sandbox path with host, relative, and container views. */
type SandboxResolvedPath = {
  hostPath?: string;
  relativePath: string;
  containerPath: string;
};
/** Minimal file stat shape returned by sandbox fs bridge implementations. */
type SandboxFsStat = {
  type: "file" | "directory" | "other";
  size: number;
  mtimeMs: number;
};
/** Filesystem operations exposed across the sandbox boundary. */
type SandboxFsBridge = {
  resolvePath(params: {
    filePath: string;
    cwd?: string;
  }): SandboxResolvedPath;
  /** Reads a safely opened regular file, rejecting growth beyond an optional byte limit. */
  readFile(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
    maxBytes?: number;
  }): Promise<Buffer>;
  /** Streams a regular file within the sandbox when the backend supports native copying. */
  copyFile?(params: {
    sourcePath: string;
    destinationPath: string;
    cwd?: string;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  writeFile(params: {
    filePath: string;
    cwd?: string;
    data: Buffer | string;
    encoding?: BufferEncoding;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  /**
   * Atomically creates a file only when no entry already exists at the path.
   * Backends without this capability must omit it rather than emulate it with
   * a check followed by writeFile.
   */
  createFileExclusive?(params: {
    filePath: string;
    cwd?: string;
    data: Buffer | string;
    encoding?: BufferEncoding;
    mkdir?: boolean;
    signal?: AbortSignal;
  }): Promise<"created" | "exists">;
  mkdirp(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  remove(params: {
    filePath: string;
    cwd?: string;
    recursive?: boolean;
    force?: boolean;
    signal?: AbortSignal;
  }): Promise<void>;
  rename(params: {
    from: string;
    to: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<void>;
  stat(params: {
    filePath: string;
    cwd?: string;
    signal?: AbortSignal;
  }): Promise<SandboxFsStat | null>;
};
//#endregion
//#region src/agents/sandbox/backend-handle.types.d.ts
/**
 * Backend-neutral sandbox runtime handles used by Docker, SSH, and future sandbox providers.
 */
type SandboxBackendId = string;
/** Shell exec specification prepared by a sandbox backend for process launch. */
type SandboxBackendExecSpec = {
  argv: string[];
  env: NodeJS.ProcessEnv;
  stdinMode: "pipe-open" | "pipe-closed";
  finalizeToken?: unknown;
};
type SandboxBackendWorkdirValidation = "host" | "backend";
type SandboxBackendWorkdirValidator = (workdir: string) => Promise<string | null>;
type SandboxBackendPreparedWorkdirDiscarder = (workdir: string) => void;
/** Parameters for backend-managed shell commands used by fs bridges and probes. */
type SandboxBackendCommandParams = {
  script: string;
  args?: string[];
  stdin?: Buffer | string;
  allowFailure?: boolean;
  signal?: AbortSignal;
};
/** Buffered command result returned by sandbox backend shell helpers. */
type SandboxBackendCommandResult = {
  stdout: Buffer;
  stderr: Buffer;
  code: number;
};
/** Runtime context passed to backend-provided filesystem bridge factories. */
type SandboxFsBridgeContext = {
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  workspaceAccess: "none" | "ro" | "rw";
  containerName: string;
  containerWorkdir: string;
  docker: {
    binds?: string[];
  };
  backend?: {
    runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  };
};
/** Live sandbox backend handle for command execution, cleanup, and optional fs bridge creation. */
type SandboxBackendHandle = {
  id: SandboxBackendId;
  runtimeId: string;
  runtimeLabel: string;
  workdir: string;
  env?: Record<string, string>;
  configLabel?: string;
  configLabelKind?: string;
  /**
   * Remote backends own cwd existence checks because valid runtime paths may
   * not exist in the local workspace mirror. Backend validation must be paired
   * with validateWorkdir so cwd is proved after before_tool_call adjustments
   * and before env resolution, approval, preflight, and launch.
   */
  workdirValidation?: SandboxBackendWorkdirValidation;
  validateWorkdir?: SandboxBackendWorkdirValidator;
  /** Discard one-shot state created while validating a backend-owned cwd. */
  discardPreparedWorkdir?: SandboxBackendPreparedWorkdirDiscarder;
  /** Remote cwd roots managed by backend validation. Defaults to workdir. */
  workdirRoots?: readonly string[];
  capabilities?: {
    browser?: boolean;
  };
  buildExecSpec(params: {
    command: string;
    workdir?: string;
    env: Record<string, string>;
    usePty: boolean;
  }): Promise<SandboxBackendExecSpec>;
  finalizeExec?: (params: {
    status: "completed" | "failed";
    exitCode: number | null;
    timedOut: boolean;
    token?: unknown;
  }) => Promise<void>;
  runShellCommand(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
  createFsBridge?: (params: {
    sandbox: SandboxFsBridgeContext;
  }) => SandboxFsBridge;
};
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
//#region src/agents/system-prompt.types.d.ts
type PromptMode = "full" | "minimal" | "none";
type SilentReplyPromptMode = "generic" | "none";
//#endregion
//#region src/agents/sandbox/types.docker.d.ts
type RequiredDockerConfigKeys = "image" | "containerPrefix" | "workdir" | "readOnlyRoot" | "tmpfs" | "network" | "capDrop";
type SandboxDockerConfig = Omit<SandboxDockerSettings, RequiredDockerConfigKeys> & Required<Pick<SandboxDockerSettings, RequiredDockerConfigKeys>>;
//#endregion
//#region src/agents/sandbox/types.d.ts
type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};
type SandboxWorkspaceAccess = "none" | "ro" | "rw";
type SandboxBrowserContext = {
  bridgeUrl: string;
  noVncUrl?: string;
  containerName: string;
};
type SandboxContext = {
  enabled: boolean;
  /** Immutable creator policy: this session may never escape to a host execution target. */
  required?: true;
  backendId: SandboxBackendId;
  sessionKey: string;
  workspaceDir: string;
  agentWorkspaceDir: string;
  skillsWorkspaceDir?: string;
  skillsEligibility?: SkillEligibilityContext;
  skillUsagePaths?: SkillUsagePath[];
  workspaceAccess: SandboxWorkspaceAccess;
  runtimeId: string;
  runtimeLabel: string;
  containerName: string;
  containerWorkdir: string;
  docker: SandboxDockerConfig;
  tools: SandboxToolPolicy;
  browserAllowHostControl: boolean;
  browser?: SandboxBrowserContext;
  fsBridge?: SandboxFsBridge;
  backend?: SandboxBackendHandle;
};
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
declare function resolveConversationCapabilityProfile(params: ConversationCapabilityProfileParams): ResolvedConversationCapabilityProfile;
//#endregion
export { SkillUsagePath as _, SandboxContext as a, RuntimePluginToolGrant as b, ScheduledToolPolicyContext as c, SandboxBackendWorkdirValidator as d, SandboxFsBridge as f, SkillTelemetrySource as g, SkillSnapshot as h, ToolPolicyLike as i, SandboxBackendExecSpec as l, SkillCommandSpec as m, ResolvedConversationCapabilityProfile as n, PromptMode as o, ExplicitSkillSelection as p, resolveConversationCapabilityProfile as r, SilentReplyPromptMode as s, ConversationCapabilityProfileParams as t, SandboxBackendWorkdirValidation as u, SubagentCompletionToolHandoffRegistration as v, TrustedSubagentCompletionHandoff as y };