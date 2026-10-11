// Emergency byte-budget truncation for seats whose active transcript exceeds the
// host fuse and compaction cannot fit. Persists the full transcript to a sidecar
// before rotating the session onto a bounded tail so the seat keeps running.
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { asOptionalRecord } from "@openclaw/normalization-core/record-coerce";
import { uniqueStrings } from "@openclaw/normalization-core/string-normalization";
import {
  runOpenClawAgentWriteTransaction,
  openOpenClawAgentDatabase,
} from "../../state/openclaw-agent-db.js";
import { resolveSessionArtifactDirectory } from "./paths.js";
import {
  readSessionTranscriptActiveStats,
  readSessionTranscriptBoundedMessageTailPage,
  readSessionTranscriptMessageEventPage,
} from "./session-accessor.sqlite-active-events.js";
import { invalidateSessionBranchCache } from "./session-accessor.sqlite-branches.js";
import type { TranscriptEvent } from "./session-accessor.sqlite-contract.js";
import {
  readSessionEntryRow,
  readSessionIdentitySnapshot,
  writeSessionEntry,
} from "./session-accessor.sqlite-entry-store.js";
import { prepareSessionIdentityPublication } from "./session-accessor.sqlite-identity.js";
import { loadTranscriptEventsFromDatabase } from "./session-accessor.sqlite-read.js";
import {
  resolveSqliteScope,
  runExclusiveSqliteSessionWrite,
  toDatabaseOptions,
} from "./session-accessor.sqlite-scope.js";
import { ensureTranscriptSessionRoot } from "./session-accessor.sqlite-transcript-state.js";
import { appendTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store.js";
import { findSessionTranscriptHeader } from "./session-entry-codec.js";
import {
  markSessionTranscriptIndexDirtyInTransaction,
  reconcileSessionTranscriptIndexInTransaction,
  SYNC_REBUILD_MAX_BYTES,
  SYNC_REBUILD_MAX_ROWS,
} from "./session-transcript-index.js";
import { collectSessionEntryLookupKeys, normalizeStoreSessionKey } from "./store-entry.js";
import { createSessionTranscriptHeader } from "./transcript-header.js";
import type { InternalSessionEntry as SessionEntry } from "./types.js";

/** Cap on kept message events so one pathological transcript cannot stall the rebuild scan. */
const MAX_TRUNCATE_KEEP_MESSAGES = 4_000;

export type SessionTranscriptTruncateOutcome =
  | { status: "missing" }
  | { status: "already_fits"; activeBytes: number }
  | { status: "locked"; activeBytes: number }
  | { status: "sidecar_failed"; error: string; sidecarPath: string }
  | { status: "conflict" }
  | {
      status: "truncated";
      activeBytesBefore: number;
      activeBytesAfter: number;
      droppedEvents: number;
      keptEvents: number;
      previousSessionId: string;
      sessionId: string;
      sidecarPath: string;
      entry: SessionEntry;
    };

function sanitizeSessionKeyForFilename(sessionKey: string): string {
  const sanitized = sessionKey.replaceAll(/[/\\\0]/g, "_").trim();
  return sanitized || "session";
}

function buildTruncateSidecarPath(params: { artifactsDir: string; sessionKey: string }): string {
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "");
  return path.join(
    params.artifactsDir,
    `${sanitizeSessionKeyForFilename(params.sessionKey)}.truncated-${timestamp}.jsonl`,
  );
}

/**
 * Re-chain the kept suffix onto a fresh header so the rotated transcript stays
 * navigable. Transcript events are an opaque storage contract; only the parent
 * linkage is rewritten, every other field passes through unchanged.
 */
function rebuildKeptEventsForRotation(
  header: ReturnType<typeof createSessionTranscriptHeader>,
  kept: readonly TranscriptEvent[],
): TranscriptEvent[] {
  const events: TranscriptEvent[] = [header];
  let parentId: string | null = null;
  for (const event of kept) {
    const record = asOptionalRecord(event);
    const id = typeof record?.id === "string" ? record.id : undefined;
    events.push({ ...record, parentId });
    parentId = id?.trim() ? id : null;
  }
  return events;
}

/**
 * Hard-truncate fallback for the transcript byte fuse: persist the full transcript
 * to `<session>.truncated-<ts>.jsonl`, then rotate the session onto a byte-bounded
 * tail. Locked sessions refuse rotation (their identity belongs to its owner);
 * historical rows stay for search until disk-budget extraction reclaims them.
 */
export async function truncateSessionTranscriptToByteBudget(params: {
  agentId?: string;
  env?: NodeJS.ProcessEnv;
  sessionKey: string;
  /** Logical session store path; also locates the sidecar artifacts directory. */
  storePath: string;
  maxBytes: number;
  expectedSession?: Pick<SessionEntry, "sessionId" | "lifecycleRevision">;
}): Promise<SessionTranscriptTruncateOutcome> {
  const sessionKey = normalizeStoreSessionKey(params.sessionKey);
  if (!sessionKey) {
    return { status: "missing" };
  }
  const resolved = resolveSqliteScope({
    ...(params.agentId ? { agentId: params.agentId } : {}),
    ...(params.env ? { env: params.env } : {}),
    sessionKey,
    storePath: params.storePath,
  });
  const storePath = params.storePath;

  const reader = openOpenClawAgentDatabase(toDatabaseOptions(resolved));
  // Short request keys ("main") canonicalize to agent-scoped rows; the resolved
  // scope key matches the accessor's canonical row key for every request shape.
  const entryRowKey = resolved.sessionKey;
  const entry = readSessionEntryRow(reader, entryRowKey)?.entry;
  if (!entry?.sessionId) {
    return { status: "missing" };
  }
  const readScope = {
    agentId: resolved.agentId,
    sessionId: entry.sessionId,
    sessionKey: entryRowKey,
    storePath,
  };
  const stats = readSessionTranscriptActiveStats(readScope);
  if (stats.sizeBytes <= params.maxBytes) {
    return { status: "already_fits", activeBytes: stats.sizeBytes };
  }
  if (
    entry.modelSelectionLocked === true ||
    entry.acpSessionBinding !== undefined ||
    Object.keys(entry.cliSessionBindings ?? {}).length > 0
  ) {
    // Locked or natively-bound identity cannot rotate; its owning runtime must
    // resolve the overflow, so surface the refusal for operator alerting.
    return { status: "locked", activeBytes: stats.sizeBytes };
  }
  const expected = params.expectedSession ?? {
    sessionId: entry.sessionId,
    lifecycleRevision: entry.lifecycleRevision,
  };

  // Persist the full transcript sidecar before any mutation; failure aborts.
  const fullEvents = loadTranscriptEventsFromDatabase(reader, entry.sessionId);
  const sidecarPath = buildTruncateSidecarPath({
    artifactsDir: resolveSessionArtifactDirectory(storePath),
    sessionKey,
  });
  try {
    fs.mkdirSync(path.dirname(sidecarPath), { recursive: true });
    fs.writeFileSync(
      sidecarPath,
      fullEvents.map((event) => JSON.stringify(event)).join("\n") + (fullEvents.length ? "\n" : ""),
    );
  } catch (error) {
    return { status: "sidecar_failed", error: String(error), sidecarPath };
  }

  const tailPage = readSessionTranscriptBoundedMessageTailPage(readScope, {
    maxBytes: params.maxBytes,
    maxMessages: MAX_TRUNCATE_KEEP_MESSAGES,
    offset: 0,
  });
  let keptMessages = tailPage.events.map((row) => row.event);
  if (keptMessages.length === 0 && tailPage.totalMessages > 0) {
    // A budget smaller than the newest message must still keep that one message;
    // a non-empty transcript never truncates to an empty one.
    const newestPage = readSessionTranscriptMessageEventPage(readScope, {
      maxMessages: 1,
      offset: 0,
      offsetFrom: "end",
    });
    keptMessages = newestPage.events.map((row) => row.event);
  }
  const previousHeader = findSessionTranscriptHeader(fullEvents);
  const nextSessionId = randomUUID();
  const header = createSessionTranscriptHeader({
    cwd: previousHeader?.cwd,
    sessionId: nextSessionId,
    version: previousHeader?.version,
  });
  const nextEvents = rebuildKeptEventsForRotation(header, keptMessages);

  let result: SessionTranscriptTruncateOutcome = { status: "conflict" };
  await runExclusiveSqliteSessionWrite(
    resolved,
    async () => {
      let previousIdentity = new Map<string, SessionEntry>();
      const { databasePath, publish } = runOpenClawAgentWriteTransaction(
        (database) => {
          const current = readSessionEntryRow(database, entryRowKey)?.entry;
          if (
            !current?.sessionId ||
            current.sessionId !== expected.sessionId ||
            current.lifecycleRevision !== expected.lifecycleRevision
          ) {
            result = { status: "conflict" };
            return { databasePath: database.path, publish: () => {} };
          }
          const identityKeys = uniqueStrings([...collectSessionEntryLookupKeys(entryRowKey)]);
          previousIdentity = readSessionIdentitySnapshot(database, identityKeys);
          const targetScope = {
            ...resolved,
            sessionId: nextSessionId,
            sessionKey: entryRowKey,
          };
          let copiedBytes = 0;
          const rebuildSynchronously =
            nextEvents.length <= SYNC_REBUILD_MAX_ROWS &&
            nextEvents.every((event) => {
              copiedBytes += JSON.stringify(event).length;
              return copiedBytes <= SYNC_REBUILD_MAX_BYTES;
            });
          if (!rebuildSynchronously) {
            ensureTranscriptSessionRoot(database, targetScope, Date.parse(header.timestamp));
            markSessionTranscriptIndexDirtyInTransaction(database.db, nextSessionId);
          }
          appendTranscriptEventsInTransaction(database, targetScope, nextEvents);
          if (rebuildSynchronously) {
            reconcileSessionTranscriptIndexInTransaction(database.db, nextSessionId);
          }
          // Rewind-shaped rotation: the bounded tail is a fresh transcript identity.
          const nextEntry: SessionEntry = {
            ...current,
            sessionId: nextSessionId,
            updatedAt: Date.now(),
            systemSent: false,
            abortedLastRun: false,
            lifecycleRunId: undefined,
            lastRunId: undefined,
            startedAt: undefined,
            endedAt: undefined,
            runtimeMs: undefined,
            status: undefined,
            inputTokens: undefined,
            outputTokens: undefined,
            cacheRead: undefined,
            cacheWrite: undefined,
            estimatedCostUsd: undefined,
            totalTokens: undefined,
            totalTokensFresh: undefined,
            totalTokensVersion: undefined,
            contextTokens: undefined,
            contextTokensSource: undefined,
            contextBudgetStatus: undefined,
            transcriptByteCompactionLatch: undefined,
            memoryFlush: undefined,
            systemPromptReport: undefined,
            skillsSnapshot: undefined,
            previousSessionId: current.sessionId,
          };
          writeSessionEntry(database, entryRowKey, nextEntry, {
            previousEntry: current,
          });
          const currentIdentity = readSessionIdentitySnapshot(database, identityKeys);
          const activeBytesAfter = readSessionTranscriptActiveStats({
            agentId: resolved.agentId,
            sessionId: nextSessionId,
            sessionKey,
            storePath,
          }).sizeBytes;
          result = {
            status: "truncated",
            activeBytesBefore: stats.sizeBytes,
            activeBytesAfter,
            // The regenerated header replaces the original one; only messages can drop.
            droppedEvents: Math.max(0, fullEvents.length - 1 - keptMessages.length),
            keptEvents: keptMessages.length,
            previousSessionId: current.sessionId,
            sessionId: nextSessionId,
            sidecarPath,
            entry: nextEntry,
          };
          return {
            databasePath: database.path,
            publish: prepareSessionIdentityPublication(
              database,
              resolved.agentId,
              previousIdentity,
              currentIdentity,
            ),
          };
        },
        toDatabaseOptions(resolved),
        { operationLabel: "session.transcript.truncate" },
      );
      if (result.status === "truncated") {
        invalidateSessionBranchCache(databasePath, [result.previousSessionId, result.sessionId]);
      }
      publish();
    },
    "session.transcript.truncate",
  );
  return result;
}

/** Normalizes an optional persisted latch timestamp for suppression-age alerts. */
export function readTranscriptSuppressionLatchedAt(
  latch: { latchedAt?: unknown } | undefined,
): number | undefined {
  const raw = latch?.latchedAt;
  return typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : undefined;
}
