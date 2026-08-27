import { i as ExecApprovalDecision } from "./exec-approvals-core-ByvfWxmW.js";

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
  toolName?: string | null;
  toolCallId?: string | null;
  allowedDecisions?: readonly ExecApprovalDecision[] | null;
  actions?: readonly PluginApprovalActionView[] | null;
  agentId?: string | null;
  sessionKey?: string | null; /** Host-derived source run; never accepted from plugin approval RPC params. */
  runId?: string | null;
  turnSourceChannel?: string | null;
  turnSourceTo?: string | null;
  turnSourceAccountId?: string | null;
  turnSourceThreadId?: string | number | null;
};
/** Timed plugin approval request persisted while awaiting a decision. */
type PluginApprovalRequest = {
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
export { truncatePluginApprovalDetail as _, PLUGIN_APPROVAL_DETAIL_MAX_LENGTH as a, PluginApprovalRequest as c, approvalDecisionLabel as d, buildPluginApprovalExpiredMessage as f, resolvePluginApprovalTimeoutMs as g, resolvePluginApprovalRequestAllowedDecisions as h, PLUGIN_APPROVAL_DESCRIPTION_MAX_LENGTH as i, PluginApprovalRequestPayload as l, buildPluginApprovalResolvedMessage as m, DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS as n, PLUGIN_APPROVAL_TITLE_MAX_LENGTH as o, buildPluginApprovalRequestMessage as p, MAX_PLUGIN_APPROVAL_TIMEOUT_MS as r, PluginApprovalActionView as s, DEFAULT_PLUGIN_APPROVAL_DECISIONS as t, PluginApprovalResolved as u };