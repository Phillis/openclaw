import { n as ApprovalScopeSchema } from "./approvals-Xlp2ut16.js";
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
//#endregion
//#region src/infra/exec-approvals-contracts.d.ts
type ExecApprovalsDefaultOverrides = {
  security?: ExecSecurity;
  ask?: ExecAsk;
  askFallback?: ExecSecurity;
  autoAllowSkills?: boolean;
  requireSocket?: boolean;
};
//#endregion
//#region src/infra/exec-approvals-config.d.ts
declare function resolveExecApprovalsDisplayPath(): string;
//#endregion
//#region src/infra/exec-approvals-store.d.ts
declare function readExecApprovalsSnapshot(): ExecApprovalsSnapshot;
declare function loadExecApprovals(): ExecApprovalsFile;
//#endregion
//#region src/infra/exec-approvals.d.ts
declare function resolveExecApprovalsFromFile(params: {
  file: ExecApprovalsFile;
  agentId?: string;
  overrides?: ExecApprovalsDefaultOverrides;
  path?: string;
  socketPath?: string;
  token?: string;
}): ExecApprovalsResolved;
//#endregion
export { ExecApprovalDecision as a, ExecApprovalResolved as c, ExecMode as d, ExecSecurity as f, ApprovalScope as g, CommandExplanationSummary as h, resolveExecApprovalsDisplayPath as i, ExecApprovalsFile as l, resolveExecModePolicy as m, loadExecApprovals as n, ExecApprovalRequest as o, ExecTarget as p, readExecApprovalsSnapshot as r, ExecApprovalRequestPayload as s, resolveExecApprovalsFromFile as t, ExecAsk as u };