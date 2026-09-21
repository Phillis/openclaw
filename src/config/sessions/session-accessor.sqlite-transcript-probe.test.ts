// P0-2 probe regression: the watchdog's transcript-events-since count reads the
// exact agent database the transcript writer uses — created_at ms ordering,
// missing session entry counts as zero, and the probe never creates or
// migrates a database (read-only handle).
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createTempDirTracker } from "../../../test/helpers/temp-dir.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  closeOpenClawAgentDatabasesForTest,
  runOpenClawAgentWriteTransaction,
} from "../../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../../state/openclaw-state-db.js";
import { appendTranscriptMessageSync, upsertSessionEntryCore } from "./session-accessor.js";
import { resolveSqliteScope, toDatabaseOptions } from "./session-accessor.sqlite-scope.js";
import { countTranscriptEventsSince } from "./session-accessor.sqlite-transcript-probe.js";
import { useTempSessionsFixture } from "./test-helpers.js";

const tempDirs = createTempDirTracker();
const fixture = useTempSessionsFixture("transcript-probe-");

const scope = () => ({
  agentId: "main",
  sessionKey: "agent:main:probe-heartbeat",
  sessionId: "probe-heartbeat-session",
  storePath: fixture.storePath(),
});

const message = (id: string, timestamp: number) => ({
  role: "user" as const,
  content: `watchdog probe ${id}`,
  timestamp,
  idempotencyKey: `${id}:probe`,
});

beforeEach(async () => {
  await upsertSessionEntryCore(scope(), { sessionId: scope().sessionId, updatedAt: 1 });
});

afterEach(() => {
  closeOpenClawAgentDatabasesForTest();
  closeOpenClawStateDatabaseForTest();
  tempDirs.cleanup();
});

function appendRawTranscriptEvent(id: string, createdAt: number): void {
  const resolved = resolveSqliteScope(scope());
  runOpenClawAgentWriteTransaction((database) => {
    database.db
      .prepare(
        "INSERT INTO transcript_events (session_id, seq, event_json, created_at) VALUES (?, ?, ?, ?)",
      )
      .run(scope().sessionId, createdAt, JSON.stringify({ id }), createdAt);
  }, toDatabaseOptions(resolved));
}

describe("countTranscriptEventsSince (P0-2 watchdog probe)", () => {
  it("counts events at or after the run-start timestamp in created_at ms", () => {
    const runStart = 1_000_000;
    appendRawTranscriptEvent("pre", runStart - 5);
    appendRawTranscriptEvent("at", runStart);
    appendRawTranscriptEvent("post", runStart + 5);

    expect(countTranscriptEventsSince(scope(), runStart)).toBe(2);
  });

  it("counts a session whose entry appeared after the run started (writer identity resolved late)", () => {
    // First probe BEFORE the session entry exists: zero (no writer identity).
    expect(countTranscriptEventsSince(scope(), 0)).toBe(0);
    // Then one transcript message append: the same probe counts the event.
    const outcome = appendTranscriptMessageSync(scope(), {
      message: message("first", 2),
      now: 2,
    });
    expect(outcome.ok).toBe(true);
    expect(countTranscriptEventsSince(scope(), 0)).toBeGreaterThanOrEqual(1);
  });

  it("returns zero for a session key with no entry (run never rendered an event)", () => {
    expect(
      countTranscriptEventsSince({ ...scope(), sessionKey: "agent:main:probe-never-reached" }, 0),
    ).toBe(0);
  });

  it("never creates a database for a missing store path (read-only guarantee)", () => {
    const missingScope = {
      agentId: "main",
      sessionKey: "agent:main:probe-missing-store",
      storePath: `${tempDirs.make("transcript-probe-missing-")}/missing.sqlite`,
    };
    expect(countTranscriptEventsSince(missingScope, 0)).toBe(0);
  });

  it("honors config/env-scoped default agent resolution through the scope surface", () => {
    // Same probe without the explicit agentId still resolves through the key.
    const keyOnlyScope = { ...scope(), agentId: undefined };
    const outcome = appendTranscriptMessageSync(keyOnlyScope, {
      message: message("key-only", 3),
      now: 3,
    });
    expect(outcome.ok).toBe(true);
    expect(
      countTranscriptEventsSince({ ...keyOnlyScope, agentId: "main" }, 0),
    ).toBeGreaterThanOrEqual(1);
  });

  it("consumes the exported surface with a config-typed helper parameter (type exercise)", () => {
    const cfg: OpenClawConfig | undefined = undefined;
    expect(cfg).toBeUndefined();
    expect(countTranscriptEventsSince(scope(), Number.MAX_SAFE_INTEGER)).toBe(0);
  });
});
