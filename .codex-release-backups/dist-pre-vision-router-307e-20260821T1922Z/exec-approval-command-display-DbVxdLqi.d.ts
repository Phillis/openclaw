import { tt as SafeBinProfile } from "./types.channels-B7ph6mKI.js";
import { N as ExecAllowlistEntry, _ as ExecSecurity, c as ExecApprovalUnavailableDecision, i as ExecApprovalDecision, m as ExecAsk, o as ExecApprovalRequestPayload } from "./exec-approvals-core-ByvfWxmW.js";

//#region src/infra/exec-command-resolution.d.ts
type ExecutableResolution = {
  rawExecutable: string;
  resolvedPath?: string;
  resolvedRealPath?: string;
  executableName: string;
};
type CommandResolution = {
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
declare function matchAllowlist(entries: ExecAllowlistEntry[], resolution: ExecutableResolution | null, argv?: string[], platform?: string | null): ExecAllowlistEntry | null;
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
//#region src/infra/exec-approval-command-display.d.ts
/** Sanitized approval text plus size-cap status for callers that need UI affordances. */
type SanitizedExecApprovalDisplayText = {
  /** Redacted, spoof-resistant command or warning text safe for an approval prompt. */text: string; /** True when sanitized output exceeded the display cap and was shortened. */
  truncated: boolean; /** True when raw input exceeded the hard cap and was replaced with a fixed marker. */
  oversized: boolean;
};
/** Sanitizes exec command text for approval UI without exposing status metadata. */
declare function sanitizeExecApprovalDisplayText(commandText: string): string;
/**
 * Sanitizes exec command text for approval UI and reports whether size caps changed it.
 */
declare function sanitizeExecApprovalDisplayTextWithStatus(commandText: string): SanitizedExecApprovalDisplayText;
/**
 * Sanitizes warning prose for approval UI while preserving real line boundaries.
 */
declare function sanitizeExecApprovalWarningText(warningText: string): string;
/** Sanitizes warning prose and reports whether display bounds suppressed any content. */
declare function sanitizeExecApprovalWarningTextWithStatus(warningText: string): SanitizedExecApprovalDisplayText;
/** Resolves sanitized command and preview text for exec approval prompts. */
declare function resolveExecApprovalCommandDisplay(request: ExecApprovalRequestPayload): {
  /** Primary command text rendered in the approval prompt. */commandText: string; /** Optional shorter preview, omitted when it would duplicate the primary command text. */
  commandPreview: string | null;
};
//#endregion
export { resolvePolicyAllowlistCandidatePath as $, isSafeBinUsage as A, ExecArgvToken as B, ExecAllowlistEvaluation as C, evaluateExecAllowlistWithAuthorization as D, evaluateExecAllowlist as E, ExecAuthorizationPlan as F, resolveApprovalAuditCandidatePath as G, matchAllowlist as H, ExecCommandAnalysis as I, resolveCommandResolutionFromArgv as J, resolveApprovalAuditTrustPath as K, ExecCommandSegment as L, resolveAllowAlwaysPatternEntries as M, resolveAllowAlwaysPatterns as N, evaluateShellAllowlist as O, resolveSafeBins as P, resolveExecutionTargetTrustPath as Q, ShellChainOperator as R, ExecAllowlistAnalysis as S, SkillBinTrustEntry as T, parseExecArgvToken as U, ExecutableResolution as V, resolveAllowlistCandidatePath as W, resolveExecutionTargetCandidatePath as X, resolveExecutableTrustPath as Y, resolveExecutionTargetResolution as Z, resolveExecApprovalUnavailableDecisions as _, sanitizeExecApprovalWarningText as a, ExecApprovalsDefaultOverrides as b, OPTIONAL_EXEC_APPROVAL_DECISIONS as c, maxAsk as d, resolvePolicyTargetCandidatePath as et, minSecurity as f, resolveExecApprovalRequestAllowedDecisions as g, resolveExecApprovalAllowedDecisions as h, sanitizeExecApprovalDisplayTextWithStatus as i, normalizeSafeBins as j, evaluateShellAllowlistWithAuthorization as k, commandRequiresSecurityAuditSuppressionApproval as l, requiresExecApproval as m, resolveExecApprovalCommandDisplay as n, resolvePolicyTargetTrustPath as nt, sanitizeExecApprovalWarningTextWithStatus as o, normalizeExecApprovalUnavailableDecisions as p, resolveCommandResolution as q, sanitizeExecApprovalDisplayText as r, DEFAULT_EXEC_APPROVAL_DECISIONS as s, SanitizedExecApprovalDisplayText as t, resolvePolicyTargetResolution as tt, isExecApprovalDecisionAllowed as u, AllowAlwaysPersistenceDecision as v, ExecSegmentSatisfiedBy as w, AllowAlwaysPattern as x, AllowAlwaysPersistenceReason as y, CommandResolution as z };