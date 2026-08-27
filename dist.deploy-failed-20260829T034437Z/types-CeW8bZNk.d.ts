import { u as Skill } from "./types-Kt4lh6nX.js";
import { g as SandboxDockerSettings } from "./types.models-BxGvs1Ab.js";
//#region src/skills/types.d.ts
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
//#region src/agents/sandbox/types.docker.d.ts
type RequiredDockerConfigKeys = "image" | "containerPrefix" | "workdir" | "readOnlyRoot" | "tmpfs" | "network" | "capDrop";
type SandboxDockerConfig = Omit<SandboxDockerSettings, RequiredDockerConfigKeys> & Required<Pick<SandboxDockerSettings, RequiredDockerConfigKeys>>;
//#endregion
//#region src/agents/sandbox/types.d.ts
type SandboxToolPolicy = {
  allow?: string[];
  deny?: string[];
};
type SandboxToolPolicySource = {
  source: "agent" | "global" | "default";
  /**
   * Config key path hint for humans.
   * (Keyed agent entries use `agents.entries.*.…` form.)
   */
  key: string;
};
type SandboxToolPolicyResolved = {
  allow: string[];
  deny: string[];
  sources: {
    allow: SandboxToolPolicySource;
    deny: SandboxToolPolicySource;
  };
};
type SandboxWorkspaceAccess = "none" | "ro" | "rw";
type SandboxBrowserConfig = {
  enabled: boolean;
  image: string;
  containerPrefix: string;
  network: string;
  cdpPort: number;
  cdpSourceRange?: string;
  vncPort: number;
  noVncPort: number;
  headless: boolean;
  noVncEnabled: boolean;
  allowHostControl: boolean;
  autoStart: boolean;
  autoStartTimeoutMs: number;
  binds?: string[];
};
type SandboxPruneConfig = {
  idleHours: number;
  maxAgeDays: number;
};
type SandboxSshConfig = {
  target?: string;
  command: string;
  workspaceRoot: string;
  strictHostKeyChecking: boolean;
  updateHostKeys: boolean;
  identityFile?: string;
  certificateFile?: string;
  knownHostsFile?: string;
  identityData?: string;
  certificateData?: string;
  knownHostsData?: string;
};
type SandboxScope = "session" | "agent" | "shared";
type SandboxConfig = {
  mode: "off" | "non-main" | "all";
  backend: SandboxBackendId;
  scope: SandboxScope;
  workspaceAccess: SandboxWorkspaceAccess;
  workspaceRoot: string;
  dockerTmpfsSource: "default" | "configured";
  docker: SandboxDockerConfig;
  ssh: SandboxSshConfig;
  browser: SandboxBrowserConfig;
  tools: SandboxToolPolicy;
  prune: SandboxPruneConfig;
};
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
export { SkillUsagePath as S, SandboxFsStat as _, SandboxToolPolicyResolved as a, SkillSnapshot as b, SandboxBackendCommandResult as c, SandboxBackendId as d, SandboxBackendPreparedWorkdirDiscarder as f, SandboxFsBridge as g, SandboxFsBridgeContext as h, SandboxToolPolicy as i, SandboxBackendExecSpec as l, SandboxBackendWorkdirValidator as m, SandboxContext as n, SandboxWorkspaceAccess as o, SandboxBackendWorkdirValidation as p, SandboxSshConfig as r, SandboxBackendCommandParams as s, SandboxConfig as t, SandboxBackendHandle as u, SandboxResolvedPath as v, SkillTelemetrySource as x, ExplicitSkillSelection as y };