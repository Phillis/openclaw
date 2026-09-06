/**
 * Real bridge-session rollover on unrecoverable context overflow.
 *
 * Bridge sessions (agent:*:pi / agent:*:handoff-*) have no human who can type
 * /reset, so after compaction and retries are exhausted we rotate the session
 * entry to a fresh window with the same canonical key. The atomic primitive is
 * `resetSessionEntryLifecycle` — the same one interactive /reset uses — which
 * writes the reset boundary header and the replacement entry in one SQLite
 * transaction. Historical transcript rows stay searchable; only the live entry
 * advances.
 */
import { randomUUID } from "node:crypto";
import { clearAllCliSessions } from "../../../config/sessions/cli-session-binding.js";
import { resolveSessionStorePathCore } from "../../../config/sessions/paths.js";
import { resolveResetPreservedSelection } from "../../../config/sessions/reset-preserved-selection.js";
import { resetSessionEntryLifecycle } from "../../../config/sessions/session-accessor.js";
import {
  SESSION_TOTAL_TOKENS_VERSION,
  type InternalSessionEntry,
} from "../../../config/sessions/types.js";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import { log } from "../logger.js";

export type BridgeSessionRolloverParams = {
  agentId: string;
  config?: OpenClawConfig;
  sessionKey: string;
  workspaceDir: string;
};

/**
 * Bridge sessions (agent:*:pi / agent:*:handoff-*) are non-interactive: nobody
 * can type /reset, so ceiling/overflow recovery must roll them over
 * automatically. Shared by the overflow-recovery branch and the chat.send
 * admission ceiling so both paths key on one definition.
 */
export function isBridgeSessionKey(sessionKey: string): boolean {
  return /\bagent:[^:]+:(pi|handoff-[^:]+.*)$/.test(sessionKey);
}

/**
 * Rotates the bridge session entry to a fresh window in one transaction.
 * Returns false when there is no persisted entry to rotate (nothing to reset).
 * Throws only on storage failure; callers must catch and fall back to the
 * surface path.
 */
export async function performBridgeSessionRollover(
  params: BridgeSessionRolloverParams,
): Promise<boolean> {
  const storePath = resolveSessionStorePathCore(params.config?.session?.store, {
    agentId: params.agentId,
  });
  let entryExisted = true;
  await resetSessionEntryLifecycle({
    agentId: params.agentId,
    archivePreviousTranscript: false,
    resetBoundary: { context: "clear", reason: "reset", cwd: params.workspaceDir },
    storePath,
    target: { canonicalKey: params.sessionKey, storeKeys: [params.sessionKey] },
    buildNextEntry: ({ currentEntry }) => {
      if (!currentEntry) {
        // A bridge session that overflowed always has a persisted entry; a
        // missing one means the row vanished mid-run and there is nothing
        // legitimate to rotate.
        entryExisted = false;
        throw new Error(`No persisted session entry to rotate for ${params.sessionKey}`);
      }
      const now = Date.now();
      const nextSessionId = randomUUID();
      const nextEntry: InternalSessionEntry = {
        ...currentEntry,
        ...resolveResetPreservedSelection({ entry: currentEntry }),
        sessionId: nextSessionId,
        lifecycleRevision: randomUUID(),
        updatedAt: now,
        sessionStartedAt: now,
        systemSent: false,
        abortedLastRun: false,
        compactionCount: 0,
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        totalTokensFresh: true,
        totalTokensVersion: SESSION_TOTAL_TOKENS_VERSION,
      };
      // A rotated window must not inherit CLI provider bindings; the next turn
      // starts a fresh CLI conversation, matching interactive /reset.
      clearAllCliSessions(nextEntry);
      return nextEntry;
    },
  });
  log.warn(
    `[context-overflow-recovery] bridge session ${params.sessionKey} rotated to a fresh window ` +
      `(agentId=${params.agentId} storePath=${storePath})`,
  );
  return entryExisted;
}
