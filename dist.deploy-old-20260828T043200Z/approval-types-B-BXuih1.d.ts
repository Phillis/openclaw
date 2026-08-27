import { yt as SafeBinProfile } from "./types.openclaw-Cjm06lg9.js";
import { a as ApprovalScopeSchema } from "./approvals-DQc6VeB7.js";
import { Static } from "typebox";
//#region src/infra/exec-approvals.types.d.ts
type ExecAllowlistEntry = {
  id?: string;
  pattern: string;
  source?: "allow-always";
  commandText?: string;
  argPattern?: string;
  lastUsedAt?: number;
  lastUsedCommand?: string;
  lastResolvedPath?: string;
};
//#endregion
//#region src/infra/exec-command-resolution.d.ts
type ExecutableResolution = {
  kind: "executable";
  rawExecutable: string;
  resolvedPath?: string;
  resolvedRealPath?: string;
  executableName: string;
};
type CommandResolution = {
  kind: "command";
  execution: ExecutableResolution;
  policy: ExecutableResolution;
  effectiveArgv?: string[];
  wrapperChain?: string[];
  policyBlocked?: boolean;
  blockedWrapper?: string;
};
declare function resolveCommandResolution(command: string, cwd?: string, env?: NodeJS.ProcessEnv): CommandResolution | null;
declare function resolveCommandResolutionFromArgv(argv: string[], cwd?: string, env?: NodeJS.ProcessEnv, platform?: NodeJS.Platform): CommandResolution | null;
declare function resolveExecutableTrustPath(resolution: ExecutableResolution | null | undefined, cwd?: string): string | undefined;
declare function resolveExecutionTargetResolution(resolution: CommandResolution | ExecutableResolution | null): ExecutableResolution | null;
declare function resolvePolicyTargetResolution(resolution: CommandResolution | ExecutableResolution | null): ExecutableResolution | null;
declare function resolveExecutionTargetCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolveExecutionTargetTrustPath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyTargetCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyTargetTrustPath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolveApprovalAuditCandidatePath(resolution: CommandResolution | null, cwd?: string): string | undefined;
declare function resolveApprovalAuditTrustPath(resolution: CommandResolution | null, cwd?: string): string | undefined;
/** @deprecated Use resolveExecutionTargetCandidatePath. */
declare function resolveAllowlistCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function resolvePolicyAllowlistCandidatePath(resolution: CommandResolution | ExecutableResolution | null, cwd?: string): string | undefined;
declare function matchAllowlist(entries: ExecAllowlistEntry[], resolution: ExecutableResolution | null, argv?: string[], platform?: string | null, cwd?: string): ExecAllowlistEntry | null;
type ExecArgvToken = {
  kind: "empty";
  raw: string;
} | {
  kind: "terminator";
  raw: string;
} | {
  kind: "stdin";
  raw: string;
} | {
  kind: "positional";
  raw: string;
} | {
  kind: "option";
  raw: string;
  style: "long";
  flag: string;
  inlineValue?: string;
} | {
  kind: "option";
  raw: string;
  style: "short-cluster";
  cluster: string;
  flags: string[];
};
/**
 * Tokenizes a single argv entry into a normalized option/positional model.
 * Consumers can share this model to keep argv parsing behavior consistent.
 */
declare function parseExecArgvToken(raw: string): ExecArgvToken;
//#endregion
//#region src/infra/exec-command-analysis-types.d.ts
type ExecCommandSegment = {
  raw: string;
  argv: string[];
  sourceArgv?: string[];
  resolution: CommandResolution | null;
};
type ExecCommandAnalysis = {
  ok: boolean;
  reason?: string;
  segments: ExecCommandSegment[];
  chains?: ExecCommandSegment[][];
};
type ShellChainOperator = "&&" | "||" | ";" | "&";
//#endregion
//#region src/infra/command-explainer/types.d.ts
/** Where a parsed command step appeared in the shell source. */
type CommandContext = "top-level" | "command-substitution" | "process-substitution" | "function-definition" | "wrapper-payload";
type SourceSpan = {
  startIndex: number;
  endIndex: number;
  startPosition: {
    row: number;
    column: number;
  };
  endPosition: {
    row: number;
    column: number;
  };
};
type CommandStep = {
  id?: string;
  parentCommandId?: string;
  context: CommandContext;
  executable: string;
  argv: string[];
  text: string;
  span: SourceSpan;
  executableSpan: SourceSpan;
};
type CommandOperatorKind = "and" | "or" | "sequence" | "newline-sequence" | "pipe" | "stderr-pipe" | "background";
type CommandOperator = {
  id: string;
  kind: CommandOperatorKind;
  text: string;
  span: SourceSpan;
  fromCommandId: string;
  toCommandId: string;
  parentCommandId?: string;
};
//#endregion
//#region src/infra/exec-authorization-plan.d.ts
type ExecAuthorizationDialect = "argv" | "posix-shell" | "windows-cmd" | "powershell";
type ExecAuthorizationTransport = {
  kind: "direct";
} | {
  kind: "shell-wrapper";
  wrapperSegment: ExecCommandSegment;
  wrapperArgv: string[];
  wrapperPrefix: string;
  inlineCommand: string;
};
type ExecAuthorizationTrustMode = "executable" | "exact-command" | "prompt-only";
type ExecAuthorizationCandidate = {
  sourceSegment: ExecCommandSegment;
  sourceStep: CommandStep;
  sourceStepId?: string;
  transport: ExecAuthorizationTransport;
  trustMode: ExecAuthorizationTrustMode;
  allowAlways: boolean;
  reasons: string[];
};
type ExecAuthorizationGroup = {
  opToNext?: ShellChainOperator | null;
  candidates: ExecAuthorizationCandidate[];
};
type ExecAuthorizationPlan = {
  ok: true;
  dialect: ExecAuthorizationDialect;
  originalCommand: string;
  groups: ExecAuthorizationGroup[];
  operators: CommandOperator[];
} | {
  ok: false;
  dialect: ExecAuthorizationDialect;
  originalCommand: string;
  reason: string;
  groups: [];
  operators: [];
};
//#endregion
//#region src/infra/exec-safe-bin-trust.d.ts
type TrustedSafeBinPathParams = {
  resolvedPath: string;
  trustedDirs?: ReadonlySet<string>;
};
declare function isTrustedSafeBinPath(params: TrustedSafeBinPathParams): boolean;
//#endregion
//#region src/infra/exec-approvals-allowlist.d.ts
declare function normalizeSafeBins(entries?: readonly string[]): Set<string>;
declare function resolveSafeBins(entries?: readonly string[] | null): Set<string>;
declare function isSafeBinUsage(params: {
  argv: string[];
  resolution: ExecutableResolution | null;
  safeBins: Set<string>;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  isTrustedSafeBinPathFn?: typeof isTrustedSafeBinPath;
}): boolean;
type ExecAllowlistEvaluation = {
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
};
type ExecSegmentSatisfiedBy = "allowlist" | "safeBins" | "inlineChain" | "safeBuiltins" | "skills" | null;
type SkillBinTrustEntry = {
  name: string;
  resolvedPath: string;
};
type ExecAllowlistContext = {
  allowlist: ExecAllowlistEntry[];
  safeBins: Set<string>;
  safeBinProfiles?: Readonly<Record<string, SafeBinProfile>>;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  trustedSafeBinDirs?: ReadonlySet<string>;
  skillBins?: readonly SkillBinTrustEntry[];
  autoAllowSkills?: boolean;
  allowShellBuiltins?: boolean;
};
declare function evaluateExecAllowlist(params: {
  analysis: ExecCommandAnalysis;
} & ExecAllowlistContext): ExecAllowlistEvaluation;
type ExecAllowlistAnalysis = {
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  allowlistMatches: ExecAllowlistEntry[];
  segments: ExecCommandSegment[];
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  segmentSatisfiedBy: ExecSegmentSatisfiedBy[];
  authorizationPlan?: ExecAuthorizationPlan;
};
type AllowAlwaysPattern = {
  pattern: string;
  argPattern?: string;
};
/**
 * Derive persisted allowlist patterns for an "allow always" decision.
 * When a command is wrapped in a shell (for example `zsh -lc "<cmd>"`),
 * persist the inner executable(s) rather than the shell binary.
 */
declare function resolveAllowAlwaysPatternEntries(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): AllowAlwaysPattern[];
declare function resolveAllowAlwaysPatterns(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): string[];
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
declare function evaluateShellAllowlist(params: {
  command: string;
  env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): ExecAllowlistAnalysis;
declare function evaluateShellAllowlistWithAuthorization(params: {
  command: string;
  env?: NodeJS.ProcessEnv;
} & ExecAllowlistContext): Promise<ExecAllowlistAnalysis>;
declare function evaluateExecAllowlistWithAuthorization(params: {
  analysis: ExecCommandAnalysis;
  command?: string;
} & ExecAllowlistContext): Promise<ExecAllowlistEvaluation & {
  segments?: ExecCommandSegment[];
  authorizationPlan?: ExecAuthorizationPlan;
}>;
//#endregion
//#region src/infra/approval-scope.d.ts
type ApprovalScope = Static<typeof ApprovalScopeSchema>;
//#endregion
//#region src/infra/command-analysis/explain.d.ts
/** Compact command explanation summary shown in approval UI. */
type CommandExplanationSummary = {
  commandCount: number;
  nestedCommandCount: number;
  riskKinds: string[];
  warningLines: string[];
};
//#endregion
//#region src/infra/exec-approval-policy-snapshot.d.ts
type ExecApprovalPolicyRule = {
  pattern: string;
  argPattern?: string;
  source?: "allow-always";
};
type ExecApprovalPolicySnapshot = {
  security: "deny" | "allowlist" | "full";
  ask: "off" | "on-miss" | "always";
  askFallback: "deny" | "allowlist" | "full";
  autoAllowSkills: boolean;
  allowlistRules: readonly ExecApprovalPolicyRule[];
};
//#endregion
//#region src/infra/exec-approvals-core.d.ts
type ExecHost = "sandbox" | "gateway" | "node";
type ExecTarget = "auto" | ExecHost;
type ExecSecurity = "deny" | "allowlist" | "full";
type ExecAsk = "off" | "on-miss" | "always";
type ExecMode = "deny" | "allowlist" | "ask" | "auto" | "full";
type ExecApprovalDecision = "allow-once" | "allow-always" | "deny";
type ExecApprovalUnavailableDecision = "allow-always";
declare const EXEC_TARGET_VALUES: readonly ExecTarget[];
declare function normalizeExecHost(value?: string | null): ExecHost | null;
declare function normalizeExecTarget(value?: string | null): ExecTarget | null;
declare function requireValidExecTarget(value?: unknown): ExecTarget | null;
declare function normalizeExecSecurity(value?: string | null): ExecSecurity | null;
declare function normalizeExecAsk(value?: string | null): ExecAsk | null;
declare function normalizeExecMode(value?: string | null): ExecMode | null;
declare function resolveExecModeFromPolicy(params: {
  security: ExecSecurity;
  ask: ExecAsk;
}): ExecMode;
declare function resolveExecPolicyForMode(mode: ExecMode): {
  security: ExecSecurity;
  ask: ExecAsk;
  autoReview: boolean;
};
declare function resolveExecModePolicy(params: {
  mode?: ExecMode | null;
  security: ExecSecurity;
  ask: ExecAsk;
}): {
  mode: ExecMode;
  security: ExecSecurity;
  ask: ExecAsk;
  autoReview: boolean;
};
type SystemRunApprovalBinding = {
  argv: string[];
  cwd: string | null;
  agentId: string | null;
  sessionKey: string | null;
  envHash: string | null;
};
type SystemRunApprovalFileOperand = {
  argvIndex: number;
  path: string;
  sha256: string;
};
type SystemRunApprovalPlan = {
  argv: string[];
  cwd: string | null;
  commandText: string;
  commandPreview?: string | null;
  agentId: string | null;
  sessionKey: string | null;
  policySnapshot?: ExecApprovalPolicySnapshot;
  mutableFileOperand?: SystemRunApprovalFileOperand | null;
};
type ExecApprovalCommandSpan = {
  startIndex: number;
  endIndex: number;
};
/** Cron job identity recorded at approval creation for a cron isolated run. */
type ExecApprovalCronExecutionSource = {
  jobId: string;
  jobConfigRevision: string;
};
type ExecApprovalRequestPayload = {
  command: string;
  commandPreview?: string | null;
  commandArgv?: string[];
  envKeys?: string[];
  systemRunBinding?: SystemRunApprovalBinding | null;
  systemRunPlan?: SystemRunApprovalPlan | null;
  cwd?: string | null;
  nodeId?: string | null;
  host?: string | null;
  security?: string | null;
  ask?: string | null;
  warningText?: string | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  commandAnalysis?: CommandExplanationSummary | null;
  commandSpans?: ExecApprovalCommandSpan[];
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[];
  allowedDecisions?: readonly ExecApprovalDecision[];
  agentId?: string | null;
  resolvedPath?: string | null;
  sessionKey?: string | null;
  sessionId?: string | null;
  runId?: string | null;
  toolCallId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
  /** Gateway-recorded cron source; never taken from client request params. */
  cronExecutionSource?: ExecApprovalCronExecutionSource | null;
  /** Exact operation binding prepared at creation for standing-grant minting. */
  cronOperationBinding?: string | null;
};
type ExecApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "exec";
  id: string;
  request: ExecApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
type ExecApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: ExecApprovalRequest["request"];
};
type ExecApprovalsDefaults = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
};
type ExecApprovalsAgent = ExecApprovalsDefaults & {
  allowlist?: ExecAllowlistEntry[];
};
type ExecApprovalsFile = {
  version: 1;
  socket?: {
    path?: string;
    token?: string;
  };
  defaults?: ExecApprovalsDefaults;
  agents?: Record<string, ExecApprovalsAgent>;
};
type ExecApprovalsSnapshot = {
  path: string;
  exists: boolean;
  raw: string | null;
  file: ExecApprovalsFile;
  hash: string;
};
type ExecApprovalsResolved = {
  path: string;
  socketPath: string;
  token: string;
  defaults: Required<ExecApprovalsDefaults>;
  agent: Required<ExecApprovalsDefaults>;
  agentSources: {
    security: string | null;
    ask: string | null;
    askFallback: string | null;
  };
  allowlist: ExecAllowlistEntry[];
  file: ExecApprovalsFile;
};
declare const DEFAULT_EXEC_APPROVAL_TIMEOUT_MS = 1800000;
//#endregion
//#region src/infra/exec-approvals-contracts.d.ts
type ExecApprovalsDefaultOverrides = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
  requireSocket?: boolean;
};
type AllowAlwaysPersistenceReason = "no-reusable-pattern" | "prompt-only" | "runtime-payload" | "unplanned";
type AllowAlwaysPersistenceDecision = {
  kind: "patterns";
  patterns: readonly AllowAlwaysPattern[];
  commandText?: string;
} | {
  kind: "exact-command";
  commandText: string;
} | {
  kind: "one-shot";
  reasons: AllowAlwaysPersistenceReason[];
};
//#endregion
//#region src/infra/exec-approvals-config.d.ts
declare const DEFAULT_EXEC_APPROVAL_ASK_FALLBACK: ExecSecurity;
declare function resolveExecApprovalsPath(env?: NodeJS.ProcessEnv): string;
declare function resolveExecApprovalsSocketPath(): string;
declare function resolveExecApprovalsDisplayPath(): string;
declare function resolveExecApprovalsTranscriptPath(): string;
declare function mergeExecApprovalsSocketDefaults(params: {
  normalized: ExecApprovalsFile;
  current?: ExecApprovalsFile;
}): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-store.d.ts
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
declare function saveExecApprovals(file: ExecApprovalsFile): void;
declare function restoreExecApprovalsSnapshot(snapshot: ExecApprovalsSnapshot): void;
declare function ensureExecApprovals(): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals-policy.d.ts
declare function requiresExecApproval(params: {
  ask: ExecAsk;
  security: ExecSecurity;
  analysisOk: boolean;
  allowlistSatisfied: boolean;
  durableApprovalSatisfied?: boolean;
}): boolean;
declare function commandRequiresSecurityAuditSuppressionApproval(params: {
  command: string;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  segments: Array<{
    argv: string[];
    raw?: string;
  }>;
}): boolean;
declare function minSecurity(a: ExecSecurity, b: ExecSecurity): ExecSecurity;
declare function maxAsk(a: ExecAsk, b: ExecAsk): ExecAsk;
declare const DEFAULT_EXEC_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
declare const OPTIONAL_EXEC_APPROVAL_DECISIONS: readonly ["allow-always"];
declare function normalizeExecApprovalUnavailableDecisions(decisions?: readonly string[] | readonly ExecApprovalUnavailableDecision[] | null): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalAllowedDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalDecision[];
declare function resolveExecApprovalUnavailableDecisions(params?: {
  ask?: string | null;
  allowAlwaysPersistence?: AllowAlwaysPersistenceDecision | null;
}): readonly ExecApprovalUnavailableDecision[];
declare function resolveExecApprovalRequestAllowedDecisions(params?: {
  ask?: string | null;
  unavailableDecisions?: readonly ExecApprovalUnavailableDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
declare function isExecApprovalDecisionAllowed(params: {
  decision: ExecApprovalDecision;
  ask?: string | null;
}): boolean;
//#endregion
//#region src/infra/exec-approvals-allow-always.d.ts
declare function hasDurableExecApproval(params: {
  analysisOk: boolean;
  segmentAllowlistEntries: Array<ExecAllowlistEntry | null>;
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasNodeCommandAllowAlwaysMarker(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function hasExactCommandDurableExecApproval(params: {
  allowlist?: readonly ExecAllowlistEntry[];
  commandText?: string | null;
}): boolean;
declare function addAllowlistEntry(approvals: ExecApprovalsFile, agentId: string | undefined, pattern: string, options?: {
  argPattern?: string;
  source?: ExecAllowlistEntry["source"];
}): void;
declare function addDurableCommandApproval(approvals: ExecApprovalsFile, agentId: string | undefined, commandText: string): void;
declare function resolveAllowAlwaysPatternCoverage(params: {
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
}): {
  complete: boolean;
  patterns: ReturnType<typeof resolveAllowAlwaysPatternEntries>;
};
declare function persistAllowAlwaysPatterns(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  segments: ExecCommandSegment[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  commandText?: string;
  strictInlineEval?: boolean;
}): ReturnType<typeof resolveAllowAlwaysPatternEntries>;
declare function resolveAllowAlwaysPersistenceDecision(params: {
  segments: ExecCommandSegment[];
  commandText?: string | null;
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  platform?: string | null;
  strictInlineEval?: boolean;
  authorizationPlan?: ExecAuthorizationPlan;
  runtimePayload?: boolean;
  preparedCoverage?: ReturnType<typeof resolveAllowAlwaysPatternCoverage> | null;
}): AllowAlwaysPersistenceDecision;
declare function persistAllowAlwaysDecision(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  decision: AllowAlwaysPersistenceDecision;
}): void;
//#endregion
//#region src/infra/exec-approvals-authorization.d.ts
type ExecApprovalUsageAuthorization = {
  source: "current-policy" | "ask-fallback" | "explicit-approval" | "auto-review";
  security: ExecSecurity;
  ask: ExecAsk;
  allowlistSatisfied: boolean;
  policySnapshot?: ExecApprovalPolicySnapshot;
  requireAutoAllowSkills?: boolean;
  requireExactCommandApproval?: boolean;
  requireDurableAllowlistApproval?: boolean;
};
declare function recordAllowlistUse(approvals: ExecApprovalsFile, agentId: string | undefined, entry: ExecAllowlistEntry, command: string, resolvedPath?: string): void;
declare function recordAllowlistMatchesUse(params: {
  approvals: ExecApprovalsFile;
  agentId: string | undefined;
  matches: readonly ExecAllowlistEntry[];
  command: string;
  resolvedPath?: string;
  authorization?: ExecApprovalUsageAuthorization;
}): void;
//#endregion
//#region src/infra/exec-approvals-socket.d.ts
declare function requestExecApprovalViaSocket(params: {
  socketPath: string;
  token: string;
  request: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<ExecApprovalDecision | null>;
//#endregion
//#region src/infra/exec-approvals.d.ts
declare function normalizeExecApprovals(file: ExecApprovalsFile): ExecApprovalsFile;
declare function resolveExecApprovals(agentId?: string, overrides?: ExecApprovalsDefaultOverrides): ExecApprovalsResolved;
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
//#endregion
//#region src/infra/plugin-approvals.d.ts
/** Button/action metadata shown with a plugin approval request. */
type PluginApprovalActionView = {
  kind?: "command" | "decision";
  label: string;
  command: string;
  decision?: ExecApprovalDecision;
  style?: "primary" | "secondary" | "success" | "danger";
};
/** Request payload supplied by plugin approval callers. */
type PluginApprovalRequestPayload = {
  pluginId?: string | null;
  title: string;
  description: string;
  detail?: string | null;
  severity?: "info" | "warning" | "critical" | null;
  /** Owner-declared blast-radius facts; display-only, never authorization. */
  scope?: ApprovalScope | null;
  toolName?: string | null;
  toolCallId?: string | null;
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null;
  /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
  /** Descriptive wire metadata; readers derive it from the payload when absent. */
  approvalKind?: "plugin";
  id: string;
  request: PluginApprovalRequestPayload;
  createdAtMs: number;
  expiresAtMs: number;
};
/** Resolved plugin approval decision plus optional request snapshot. */
type PluginApprovalResolved = {
  id: string;
  decision: ExecApprovalDecision;
  resolvedBy?: string | null;
  ts: number;
  request?: PluginApprovalRequestPayload;
};
declare const DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS = 120000;
declare const MAX_PLUGIN_APPROVAL_TIMEOUT_MS = 600000;
declare const PLUGIN_APPROVAL_TITLE_MAX_LENGTH = 80;
declare const PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH = 512;
declare const PLUGIN_APPROVAL_DETAIL_MAX_LENGTH = 16384;
declare const DEFAULT_PLUGIN_APPROVAL_DECISIONS: readonly ["allow-once", "allow-always", "deny"];
/** Caps reviewer-only plugin detail by Unicode code point without splitting surrogate pairs. */
declare function truncatePluginApprovalDetail(value: string): string;
/** Clamp a plugin approval timeout to the supported runtime bounds. */
declare function resolvePluginApprovalTimeoutMs(value: unknown): number;
/** Format an approval decision for user-facing messages. */
declare function approvalDecisionLabel(decision: ExecApprovalDecision): string;
/** Resolve explicit plugin approval decisions or fall back to defaults. */
declare function resolvePluginApprovalRequestAllowedDecisions(params?: {
  allowedDecisions?: readonly ExecApprovalDecision[] | readonly string[] | null;
}): readonly ExecApprovalDecision[];
/** Build the pending plugin approval message. */
declare function buildPluginApprovalRequestMessage(request: PluginApprovalRequest, nowMsValue: number): string;
/** Build the plugin approval resolution message. */
declare function buildPluginApprovalResolvedMessage(resolved: PluginApprovalResolved): string;
/** Build the plugin approval expiration message. */
declare function buildPluginApprovalExpiredMessage(request: PluginApprovalRequest): string;
//#endregion
//#region src/infra/approval-types.d.ts
type ChannelApprovalKind = "exec" | "plugin";
/** Backward-compatible request shape accepted from Gateway events and replay. */
type ApprovalRequestInput = ExecApprovalRequest | PluginApprovalRequest;
type NormalizedApprovalRequest<TRequest extends ApprovalRequestInput> = TRequest extends ExecApprovalRequest ? TRequest & {
  approvalKind: "exec";
} : TRequest extends PluginApprovalRequest ? TRequest & {
  approvalKind: "plugin";
} : never;
//#endregion
export { mergeExecApprovalsSocketDefaults as $, ExecCommandAnalysis as $t, hasExactCommandDurableExecApproval as A, normalizeExecMode as At, maxAsk as B, ExecAllowlistAnalysis as Bt, resolveExecApprovalsFromFile as C, ExecSecurity as Ct, addAllowlistEntry as D, SystemRunApprovalPlan as Dt, recordAllowlistUse as E, SystemRunApprovalFileOperand as Et, resolveAllowAlwaysPersistenceDecision as F, resolveExecModePolicy as Ft, resolveExecApprovalRequestAllowedDecisions as G, evaluateExecAllowlistWithAuthorization as Gt, normalizeExecApprovalUnavailableDecisions as H, ExecSegmentSatisfiedBy as Ht, DEFAULT_EXEC_APPROVAL_DECISIONS as I, resolveExecPolicyForMode as It, loadExecApprovals as J, isSafeBinUsage as Jt, resolveExecApprovalUnavailableDecisions as K, evaluateShellAllowlist as Kt, OPTIONAL_EXEC_APPROVAL_DECISIONS as L, CommandExplanationSummary as Lt, persistAllowAlwaysDecision as M, normalizeExecTarget as Mt, persistAllowAlwaysPatterns as N, requireValidExecTarget as Nt, addDurableCommandApproval as O, normalizeExecAsk as Ot, resolveAllowAlwaysPatternCoverage as P, resolveExecModeFromPolicy as Pt, DEFAULT_EXEC_APPROVAL_ASK_FALLBACK as Q, resolveSafeBins as Qt, commandRequiresSecurityAuditSuppressionApproval as R, ApprovalScope as Rt, resolveExecApprovals as S, ExecMode as St, recordAllowlistMatchesUse as T, SystemRunApprovalBinding as Tt, requiresExecApproval as U, SkillBinTrustEntry as Ut, minSecurity as V, ExecAllowlistEvaluation as Vt, resolveExecApprovalAllowedDecisions as W, evaluateExecAllowlist as Wt, restoreExecApprovalsSnapshot as X, resolveAllowAlwaysPatternEntries as Xt, readExecApprovalsSnapshot as Y, normalizeSafeBins as Yt, saveExecApprovals as Z, resolveAllowAlwaysPatterns as Zt, buildPluginApprovalResolvedMessage as _, resolvePolicyTargetCandidatePath as _n, ExecApprovalsFile as _t, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS as a, matchAllowlist as an, AllowAlwaysPersistenceReason as at, truncatePluginApprovalDetail as b, ExecAllowlistEntry as bn, ExecAsk as bt, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH as c, resolveApprovalAuditCandidatePath as cn, EXEC_TARGET_VALUES as ct, PluginApprovalRequest as d, resolveCommandResolutionFromArgv as dn, ExecApprovalRequest as dt, ExecCommandSegment as en, resolveExecApprovalsDisplayPath as et, PluginApprovalRequestPayload as f, resolveExecutableTrustPath as fn, ExecApprovalRequestPayload as ft, buildPluginApprovalRequestMessage as g, resolvePolicyAllowlistCandidatePath as gn, ExecApprovalsDefaults as gt, buildPluginApprovalExpiredMessage as h, resolveExecutionTargetTrustPath as hn, ExecApprovalsAgent as ht, DEFAULT_PLUGIN_APPROVAL_DECISIONS as i, ExecutableResolution as in, AllowAlwaysPersistenceDecision as it, hasNodeCommandAllowAlwaysMarker as j, normalizeExecSecurity as jt, hasDurableExecApproval as k, normalizeExecHost as kt, PLUGIN_APPROVAL_TITLE_MAX_LENGTH as l, resolveApprovalAuditTrustPath as ln, ExecApprovalCommandSpan as lt, approvalDecisionLabel as m, resolveExecutionTargetResolution as mn, ExecApprovalUnavailableDecision as mt, ChannelApprovalKind as n, CommandResolution as nn, resolveExecApprovalsSocketPath as nt, MAX_PLUGIN_APPROVAL_TIMEOUT_MS as o, parseExecArgvToken as on, ExecApprovalsDefaultOverrides as ot, PluginApprovalResolved as p, resolveExecutionTargetCandidatePath as pn, ExecApprovalResolved as pt, ensureExecApprovals as q, evaluateShellAllowlistWithAuthorization as qt, NormalizedApprovalRequest as r, ExecArgvToken as rn, resolveExecApprovalsTranscriptPath as rt, PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH as s, resolveAllowlistCandidatePath as sn, DEFAULT_EXEC_APPROVAL_TIMEOUT_MS as st, ApprovalRequestInput as t, ShellChainOperator as tn, resolveExecApprovalsPath as tt, PluginApprovalActionView as u, resolveCommandResolution as un, ExecApprovalDecision as ut, resolvePluginApprovalRequestAllowedDecisions as v, resolvePolicyTargetResolution as vn, ExecApprovalsResolved as vt, requestExecApprovalViaSocket as w, ExecTarget as wt, normalizeExecApprovals as x, ExecHost as xt, resolvePluginApprovalTimeoutMs as y, resolvePolicyTargetTrustPath as yn, ExecApprovalsSnapshot as yt, isExecApprovalDecisionAllowed as z, AllowAlwaysPattern as zt };