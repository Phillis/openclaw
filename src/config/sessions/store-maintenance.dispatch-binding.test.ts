import { expect, it, onTestFinished } from "vitest";
import {
  closeOpenClawAgentDatabaseByPath,
  openOpenClawAgentDatabase,
} from "../../state/openclaw-agent-db.js";
import {
  applySessionEntryLifecycleMutation,
  loadSessionEntry,
  patchSessionEntryCore,
} from "./session-accessor.js";
import { resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target.js";
import {
  capEntryCount,
  hasDurableSessionDispatchBinding,
  pruneStaleEntries,
} from "./store-maintenance.js";
import { useTempSessionsFixture } from "./test-helpers.js";
import type { InternalSessionEntry } from "./types.js";

const fixture = useTempSessionsFixture("openclaw-dispatch-binding-");
const DAY_MS = 24 * 60 * 60 * 1000;

it("detects durable plugin/harness dispatch bindings", () => {
  expect(hasDurableSessionDispatchBinding(undefined)).toBe(false);
  expect(hasDurableSessionDispatchBinding({})).toBe(false);
  expect(hasDurableSessionDispatchBinding({ pluginOwnerId: "control-plane" })).toBe(true);
  expect(
    hasDurableSessionDispatchBinding({
      cliSessionBindings: { "cli-backend": { sessionId: "native-1" } },
    }),
  ).toBe(true);
  expect(hasDurableSessionDispatchBinding({ acpSessionBinding: { clientId: "acp-1" } })).toBe(true);
  expect(hasDurableSessionDispatchBinding({ cliSessionBindings: {} })).toBe(false);
  expect(hasDurableSessionDispatchBinding({ pluginOwnerId: "  " })).toBe(false);
});

it("cap and age maintenance never archive dispatch-bound sessions", () => {
  const now = Date.now();
  const store: Record<string, InternalSessionEntry> = {
    "agent:main:plugin-owned": {
      sessionId: "plugin-owned",
      updatedAt: now - 90 * DAY_MS,
      pluginOwnerId: "control-plane",
    },
    "agent:main:cli-bound": {
      sessionId: "cli-bound",
      updatedAt: now - 90 * DAY_MS,
      cliSessionBindings: { "cli-backend": { sessionId: "native-1" } },
    },
    "agent:main:ordinary-stale": {
      sessionId: "ordinary-stale",
      updatedAt: now - 90 * DAY_MS,
    },
  };
  const archived: string[] = [];
  pruneStaleEntries(structuredClone(store), 30 * DAY_MS, {
    onArchived: ({ key }) => archived.push(key),
  });
  expect(archived).toEqual(["agent:main:ordinary-stale"]);
  const capped = capEntryCount(structuredClone(store), 1, {
    onArchived: ({ key }) => archived.push(key),
  });
  expect(capped).toBe(1);
  // Only the ordinary stale session was touched; both bound rows survive.
  expect(archived).toEqual(["agent:main:ordinary-stale", "agent:main:ordinary-stale"]);
});

it("SQLite maintenance projection preserves dispatch-bound rows under cap pressure", async () => {
  const storePath = fixture.storePath();
  const now = Date.now();
  const scope = (key: string) => ({ sessionKey: `agent:main:${key}`, storePath });
  const entries = {
    "dispatch:plugin-owned": {
      sessionId: "dispatch-plugin-owned",
      updatedAt: now - 40 * DAY_MS,
      pluginOwnerId: "control-plane",
    },
    "dispatch:acp-bound": {
      sessionId: "dispatch-acp-bound",
      updatedAt: now - 40 * DAY_MS,
      acpSessionBinding: { clientId: "acp-client" },
    },
    "ordinary:least-recently-touched": {
      sessionId: "ordinary-least-recent",
      updatedAt: now - 20 * DAY_MS,
      lastActivityAt: now - 30 * DAY_MS,
    },
    "ordinary:trigger": { sessionId: "trigger", updatedAt: now },
  } satisfies Record<string, InternalSessionEntry>;
  for (const [key, entry] of Object.entries(entries)) {
    await patchSessionEntryCore(scope(key), () => entry, {
      fallbackEntry: entry,
      replaceEntry: true,
      skipMaintenance: true,
    });
  }
  const result = await applySessionEntryLifecycleMutation({
    storePath,
    maintenanceOverride: {
      archiveDashboardAfterMs: 7 * DAY_MS,
      maxEntries: 3,
      mode: "enforce",
      pruneAfterMs: 30 * DAY_MS,
    },
  });
  expect(result).toMatchObject({ capArchived: 1, capped: 1 });
  // The bound rows stay unarchived even though they are the oldest pressure.
  expect(loadSessionEntry(scope("dispatch:plugin-owned"))?.archivedAt).toBeUndefined();
  expect(loadSessionEntry(scope("dispatch:acp-bound"))?.archivedAt).toBeUndefined();
  expect(loadSessionEntry(scope("ordinary:least-recently-touched"))).toMatchObject({
    archiveReason: "active-session-cap",
  });
  const database = openOpenClawAgentDatabase({
    agentId: "main",
    path: resolveSqliteTargetFromSessionStorePath(storePath).path,
  });
  onTestFinished(() => {
    try {
      expect(database.db.isOpen).toBe(false);
    } finally {
      closeOpenClawAgentDatabaseByPath(database.path);
    }
  });
});
