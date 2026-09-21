import { withOpenClawAgentDatabaseReadOnly } from "../../state/openclaw-agent-db-readonly.js";
import { loadExactSessionEntryReadOnly } from "./session-accessor.sqlite-exact-read.js";
import { resolveSqliteScope, toDatabaseOptions } from "./session-accessor.sqlite-scope.js";

/** Identity needed to probe one run session's transcript event activity. */
export type TranscriptEventsSinceScope = {
  agentId?: string;
  defaultAgentId?: string;
  env?: NodeJS.ProcessEnv;
  storePath: string;
  sessionKey: string;
};

/**
 * Count transcript events appended for the run session at or after `sinceMs`.
 *
 * Read-only probe over the exact agent database the transcript writer uses
 * (`transcript_events.session_id`, `created_at` ms): the zero-transcript
 * watchdog polls this cheap count instead of rereading message payloads. A
 * missing session entry means the run has not rendered its first event yet, so
 * it counts as zero. Never creates, registers, or migrates a database; read
 * failures surface to the caller, which treats them as unknown activity.
 */
export function countTranscriptEventsSince(
  scope: TranscriptEventsSinceScope,
  sinceMs: number,
): number {
  const sessionKey = scope.sessionKey.trim();
  if (!sessionKey) {
    return 0;
  }
  const entry = loadExactSessionEntryReadOnly({
    agentId: scope.agentId,
    defaultAgentId: scope.defaultAgentId,
    env: scope.env,
    storePath: scope.storePath,
    sessionKey,
  })?.entry;
  const sessionId = entry?.sessionId;
  if (!sessionId) {
    return 0;
  }
  const resolved = resolveSqliteScope({
    agentId: scope.agentId,
    defaultAgentId: scope.defaultAgentId,
    env: scope.env,
    storePath: scope.storePath,
    sessionKey,
  });
  const result = withOpenClawAgentDatabaseReadOnly((database) => {
    const row = database.db
      .prepare(
        "SELECT COUNT(*) AS count FROM transcript_events WHERE session_id = ? AND created_at >= ?",
      )
      // SAFETY: node:sqlite .get returns UnknownRecord; the query selects exactly one COUNT column.
      .get(sessionId, sinceMs) as { count?: number } | undefined;
    return Number.isFinite(row?.count) ? Math.max(0, Math.floor(row?.count ?? 0)) : 0;
  }, toDatabaseOptions(resolved));
  return result.found ? result.value : 0;
}
