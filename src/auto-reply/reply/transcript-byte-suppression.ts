import { readTranscriptSuppressionLatchedAt } from "../../config/sessions/session-transcript-truncate.js";
// Bricked-seat alerting for byte-triggered transcript suppression that outlives
// compaction. Loud, rate-limited logging plus a structured agent event so
// operators and plugins can see a seat that can no longer run turns.
import { emitAgentEvent } from "../../infra/agent-events.js";
import { createSubsystemLogger } from "../../logging/subsystem.js";

const log = createSubsystemLogger("auto-reply/preflight-compaction");

/** A suppressed seat older than this alerts on every turn, rate-limited per session. */
export const TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS = 60 * 60 * 1000;
/** Per-session alert floor so a fully suppressed seat stays loud but not spammy. */
export const TRANSCRIPT_SUPPRESSION_ALERT_RATE_LIMIT_MS = 15 * 60 * 1000;

const lastAlertAtBySession = new Map<string, number>();

export function resetTranscriptSuppressionAlertRateLimitsForTest(): void {
  lastAlertAtBySession.clear();
}

export type TranscriptByteSuppressionAlertOutcome = {
  alerted: boolean;
  persistedMs?: number;
  rateLimited?: boolean;
};

/**
 * Emits the bricked-seat alert when byte-triggered suppression has persisted past
 * the staleness threshold. Unknown latch age never alerts; the caller stamps
 * `latchedAt` when it first observes an undated latch so age becomes knowable.
 */
export function maybeAlertTranscriptByteSuppression(params: {
  sessionKey: string;
  runId?: string;
  agentId?: string;
  activeTranscriptBytes: number;
  maxActiveTranscriptBytes: number;
  latchedAt?: number;
  autoTruncateOutcome: string;
  now?: number;
}): TranscriptByteSuppressionAlertOutcome {
  const now = params.now ?? Date.now();
  const latchedAt = readTranscriptSuppressionLatchedAt({ latchedAt: params.latchedAt });
  if (latchedAt === undefined) {
    return { alerted: false };
  }
  const persistedMs = Math.max(0, now - latchedAt);
  if (persistedMs < TRANSCRIPT_SUPPRESSION_ALERT_AFTER_MS) {
    return { alerted: false, persistedMs };
  }
  const lastAlertAt = lastAlertAtBySession.get(params.sessionKey);
  if (lastAlertAt !== undefined && now - lastAlertAt < TRANSCRIPT_SUPPRESSION_ALERT_RATE_LIMIT_MS) {
    return { alerted: false, persistedMs, rateLimited: true };
  }
  lastAlertAtBySession.set(params.sessionKey, now);
  const fields = {
    sessionKey: params.sessionKey,
    activeTranscriptBytes: params.activeTranscriptBytes,
    maxActiveTranscriptBytes: params.maxActiveTranscriptBytes,
    suppressionPersistedMs: persistedMs,
    autoTruncateOutcome: params.autoTruncateOutcome,
  };
  log.error(
    "SESSION SUPPRESSED ABOVE TRANSCRIPT BYTE LIMIT — compaction cannot fit the active transcript and turns are being suppressed; the seat may be bricked",
    fields,
  );
  if (params.runId) {
    emitAgentEvent({
      runId: params.runId,
      ...(params.sessionKey ? { sessionKey: params.sessionKey } : {}),
      ...(params.agentId ? { agentId: params.agentId } : {}),
      stream: "compaction",
      data: { phase: "suppressed", level: "alert", ...fields },
    });
  }
  return { alerted: true, persistedMs };
}
