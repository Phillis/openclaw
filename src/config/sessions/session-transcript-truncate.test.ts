import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, it } from "vitest";
import { loadSessionEntry, replaceSessionEntry } from "./session-accessor.js";
import { replaceTranscriptEvents } from "./session-accessor.sqlite-transcript-write.js";
import { truncateSessionTranscriptToByteBudget } from "./session-transcript-truncate.js";
import { useTempSessionsFixture } from "./test-helpers.js";

const fixture = useTempSessionsFixture("openclaw-transcript-truncate-");

function messageEvent(id: string, parentId: string | null, content: string) {
  return {
    type: "message" as const,
    id,
    parentId,
    message: { role: "user" as const, content },
  };
}

async function seedSession(params: {
  key: string;
  sessionId: string;
  messages: number;
  messageBytes: number;
  entry?: Record<string, unknown>;
}) {
  const events: Array<Record<string, unknown>> = [
    { type: "session", version: 3, id: params.sessionId, timestamp: "2026-10-10T00:00:00Z" },
  ];
  let parentId: string | null = null;
  for (let index = 0; index < params.messages; index += 1) {
    const id = `message-${index}`;
    events.push(messageEvent(id, parentId, "x".repeat(params.messageBytes)));
    parentId = id;
  }
  await replaceTranscriptEvents(
    {
      agentId: "main",
      sessionKey: params.key,
      sessionId: params.sessionId,
      storePath: fixture.storePath(),
    },
    events,
  );
  await replaceSessionEntry(
    { sessionKey: params.key, storePath: fixture.storePath() },
    {
      sessionId: params.sessionId,
      updatedAt: Date.now(),
      ...params.entry,
    },
  );
  return events;
}

it("returns already_fits when the active transcript is under the budget", async () => {
  const key = "agent:main:fits";
  await seedSession({ key, sessionId: "fits-session", messages: 2, messageBytes: 100 });
  const result = await truncateSessionTranscriptToByteBudget({
    agentId: "main",
    maxBytes: 1_000_000,
    sessionKey: key,
    storePath: fixture.storePath(),
  });
  expect(result).toMatchObject({ status: "already_fits" });
});

it("persists the full transcript sidecar, rotates the session, and fits the budget", async () => {
  const key = "agent:main:oversized";
  const events = await seedSession({
    key,
    sessionId: "oversized-session",
    messages: 40,
    messageBytes: 2_000,
  });
  const result = await truncateSessionTranscriptToByteBudget({
    agentId: "main",
    maxBytes: 4_000,
    sessionKey: key,
    storePath: fixture.storePath(),
  });
  expect(result.status).toBe("truncated");
  if (result.status !== "truncated") {
    return;
  }
  // Sidecar holds the complete original transcript, one JSONL line per event.
  expect(existsSync(result.sidecarPath)).toBe(true);
  const sidecarLines = readFileSync(result.sidecarPath, "utf8").trim().split("\n");
  expect(sidecarLines.length).toBe(events.length);
  expect(path.basename(result.sidecarPath)).toMatch(
    /^agent:main:oversized\.truncated-\d{4}-\d{2}-\d{2}T\d+Z\.jsonl$/,
  );
  // The session rotated onto a bounded tail that fits the budget.
  expect(result.activeBytesBefore).toBeGreaterThan(result.activeBytesAfter);
  expect(result.activeBytesAfter).toBeLessThanOrEqual(4_000);
  expect(result.keptEvents).toBeGreaterThan(0);
  expect(result.droppedEvents).toBe(events.length - 1 - result.keptEvents);
  const entry = loadSessionEntry({ sessionKey: key, storePath: fixture.storePath() });
  expect(entry?.sessionId).toBe(result.sessionId);
  expect(entry?.sessionId).not.toBe("oversized-session");
  expect(entry?.transcriptByteCompactionLatch).toBeUndefined();
  expect(entry?.previousSessionId).toBe("oversized-session");
  // The sidecar lives inside the session artifacts directory.
  expect(path.dirname(result.sidecarPath)).toBe(path.dirname(fixture.storePath()));
});

it("refuses to rotate locked or natively-bound sessions", async () => {
  const lockedKey = "agent:main:locked";
  await seedSession({
    key: lockedKey,
    sessionId: "locked-session",
    messages: 10,
    messageBytes: 1_000,
    entry: { modelSelectionLocked: true },
  });
  const locked = await truncateSessionTranscriptToByteBudget({
    agentId: "main",
    maxBytes: 1_000,
    sessionKey: lockedKey,
    storePath: fixture.storePath(),
  });
  expect(locked).toMatchObject({ status: "locked" });

  const boundKey = "agent:main:cli-bound";
  await seedSession({
    key: boundKey,
    sessionId: "cli-bound-session",
    messages: 10,
    messageBytes: 1_000,
    entry: { cliSessionBindings: { "cli-backend": { sessionId: "native-1" } } },
  });
  const bound = await truncateSessionTranscriptToByteBudget({
    agentId: "main",
    maxBytes: 1_000,
    sessionKey: boundKey,
    storePath: fixture.storePath(),
  });
  expect(bound).toMatchObject({ status: "locked" });
  expect(
    loadSessionEntry({ sessionKey: boundKey, storePath: fixture.storePath() })?.sessionId,
  ).toBe("cli-bound-session");
});

it("reports missing for unknown session keys", async () => {
  const result = await truncateSessionTranscriptToByteBudget({
    agentId: "main",
    maxBytes: 1_000,
    sessionKey: "agent:main:missing",
    storePath: fixture.storePath(),
  });
  expect(result).toMatchObject({ status: "missing" });
});
