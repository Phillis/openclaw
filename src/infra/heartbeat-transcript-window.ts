/** Bounded isolated-heartbeat transcript windows (2026-09 heartbeat burn RCA). */
import { buildSessionEndHookPayload } from "../auto-reply/reply/session-hooks.js";
import type { SessionEntry } from "../config/sessions/types.js";
import { getGlobalHookRunner } from "../plugins/hook-runner-global.js";
import { runWithGatewayIndependentRootWorkContinuation } from "../process/gateway-work-admission.js";
import { formatErrorMessage } from "./errors.js";
import type { HeartbeatConfig } from "./heartbeat-config.js";
import { heartbeatLog } from "./heartbeat-log.js";
import { resolveHeartbeatMaxTranscriptTokens } from "./heartbeat-runner-config.js";

const log = heartbeatLog;

/** Rotation fact for an isolated heartbeat transcript window that crossed the cap. */
export type HeartbeatWindowRotation = {
  previousSessionId: string;
  nextSessionId: string;
  previousTokens: number;
  capTokens: number;
};

/** Best available stored-context token count for the previous window. */
function resolveHeartbeatWindowTokens(entry: SessionEntry | undefined) {
  if (!entry) {
    return undefined;
  }
  if (
    entry.totalTokensFresh !== false &&
    typeof entry.totalTokens === "number" &&
    Number.isFinite(entry.totalTokens)
  ) {
    return entry.totalTokens;
  }
  if (typeof entry.contextTokens === "number" && Number.isFinite(entry.contextTokens)) {
    return entry.contextTokens;
  }
  return undefined;
}

/**
 * Bounded heartbeat transcripts (2026-09 burn RCA): the context engine keeps
 * one conversation per heartbeat session key, so a wedged/uncompactable window
 * replays in full, uncached, on every beat. When the previous window's stored
 * context exceeds the cap, the fresh per-beat session id gets a reset lifecycle
 * so the engine rotates to a new window instead of re-wedging.
 */
export function resolveHeartbeatWindowRotation(params: {
  previousEntry: SessionEntry | undefined;
  heartbeat: HeartbeatConfig | undefined;
  nextSessionId: string | undefined;
}): HeartbeatWindowRotation | undefined {
  const capTokens = resolveHeartbeatMaxTranscriptTokens(params.heartbeat);
  if (capTokens <= 0) {
    return undefined;
  }
  const previousSessionId = params.previousEntry?.sessionId?.trim();
  const nextSessionId = params.nextSessionId?.trim();
  if (!previousSessionId || !nextSessionId || previousSessionId === nextSessionId) {
    return undefined;
  }
  const previousTokens = resolveHeartbeatWindowTokens(params.previousEntry);
  if (previousTokens === undefined || previousTokens < capTokens) {
    return undefined;
  }
  return { previousSessionId, nextSessionId, previousTokens, capTokens };
}

/**
 * Journaled rotation: logs reason + old/new sizes and emits the session_end
 * reset lifecycle (same signal as /new) so context-engine conversations rotate
 * to a fresh window. Durable beat state (scratch, cron jobs, heartbeat state)
 * lives outside the transcript and is untouched.
 */
export function emitHeartbeatWindowRotation(
  params: HeartbeatWindowRotation & { agentId: string; sessionKey: string },
): void {
  log.warn("heartbeat: rotating oversized isolated transcript window", {
    sessionKey: params.sessionKey,
    reason: "max-transcript-tokens",
    oldSessionId: params.previousSessionId,
    newSessionId: params.nextSessionId,
    oldTokens: params.previousTokens,
    capTokens: params.capTokens,
  });
  const hookRunner = getGlobalHookRunner();
  if (!hookRunner?.hasHooks("session_end")) {
    return;
  }
  const payload = buildSessionEndHookPayload({
    sessionId: params.previousSessionId,
    sessionKey: params.sessionKey,
    agentId: params.agentId,
    reason: "reset",
    nextSessionId: params.nextSessionId,
  });
  void runWithGatewayIndependentRootWorkContinuation(async () => {
    await hookRunner.runSessionEnd(payload.event, payload.context);
  }, "hooks:session-end").catch((error: unknown) => {
    log.warn(
      `heartbeat: transcript window rotation session_end hook failed: ${formatErrorMessage(error)}`,
    );
  });
}
