//#region src/system-agent/audit.d.ts
/**
 * Append-only audit log helpers for OpenClaw writes.
 *
 * Discovery and read-only commands stay quiet; persistent operations append a
 * SQLite entry under the shared state directory with config hashes and redacted details.
 */
type SystemAgentAuditEntry = {
  timestamp: string;
  operation: string;
  summary: string;
  configPath?: string;
  configHashBefore?: string | null;
  configHashAfter?: string | null;
  details?: Record<string, unknown>;
};
declare const SYSTEM_AGENT_AUDIT_SCOPE = "system-agent-audit";
declare const SYSTEM_AGENT_AUDIT_MAX_ENTRIES = 50000;
declare const SYSTEM_AGENT_AUDIT_STORE_LABEL = "SQLite diagnostic_events/system-agent-audit state (latest 50000 rows)";
/** Append one OpenClaw audit entry and return its SQLite owner label. */
declare function appendSystemAgentAuditEntry(entry: Omit<SystemAgentAuditEntry, "timestamp">, opts?: {
  env?: NodeJS.ProcessEnv;
}): Promise<string>;
//#endregion
export { SYSTEM_AGENT_AUDIT_MAX_ENTRIES, SYSTEM_AGENT_AUDIT_SCOPE, SYSTEM_AGENT_AUDIT_STORE_LABEL, SystemAgentAuditEntry, appendSystemAgentAuditEntry };