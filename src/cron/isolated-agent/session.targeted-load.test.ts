import { beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/config.js";
import type { SessionEntry } from "../../config/sessions/types.js";

const { loadSessionEntryMock, listSessionEntriesMock } = vi.hoisted(() => ({
  loadSessionEntryMock: vi.fn(),
  listSessionEntriesMock: vi.fn(() => {
    throw new Error("resolveCronSession must not enumerate the session store");
  }),
}));

vi.mock("../../config/sessions/paths.js", () => ({
  resolveStorePath: vi.fn().mockReturnValue("/tmp/targeted-load-store.json"),
  resolveSessionFilePathOptions: vi.fn().mockReturnValue({ sessionsDir: "/tmp" }),
  resolveSessionFilePath: vi.fn((sessionId: string) => `/tmp/${sessionId}.jsonl`),
}));

vi.mock("../../config/sessions/reset-policy.js", () => ({
  evaluateSessionFreshness: vi.fn().mockReturnValue({ fresh: true }),
  resolveSessionResetPolicy: vi.fn().mockReturnValue({ mode: "idle", idleMinutes: 60 }),
}));

vi.mock("../../agents/bootstrap-cache.js", () => ({
  clearBootstrapSnapshot: vi.fn(),
  clearBootstrapSnapshotOnSessionBoundary: vi.fn(),
  clearBootstrapSnapshotOnSessionRollover: vi.fn(),
}));

vi.mock("../../config/sessions/session-accessor.js", () => ({
  loadSessionEntry: loadSessionEntryMock,
  listSessionEntries: listSessionEntriesMock,
}));

const NOW_MS = 1_737_600_000_000;
const STORE_PATH = "/tmp/targeted-load-store.json";

const sessionEntryFor = (
  sessionKey: string,
  overrides: Partial<SessionEntry> = {},
): SessionEntry => ({
  sessionId: `sid-${sessionKey}`,
  updatedAt: NOW_MS - 1_000,
  systemSent: true,
  ...overrides,
});

const loadCallsByKey = () => {
  const calls = loadSessionEntryMock.mock.calls as Array<[Record<string, unknown>]>;
  return calls.map(([scope]) => scope.sessionKey as string);
};

beforeEach(() => {
  loadSessionEntryMock.mockReset();
  listSessionEntriesMock.mockClear();
});

import { resolveCronSession } from "./session.js";

describe("resolveCronSession targeted load", () => {
  it("loads only the exact target row on the default path", () => {
    const sessionKey = "agent:main:cron:job-a";
    const targetEntry = sessionEntryFor(sessionKey);
    loadSessionEntryMock.mockImplementation(({ sessionKey: key }) =>
      key === sessionKey ? targetEntry : undefined,
    );

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      agentId: "main",
      nowMs: NOW_MS,
    });

    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect(loadCallsByKey()).toEqual([sessionKey]);
    expect(result.initialSessionEntry).toBe(targetEntry);
    expect(result.sessionEntry.sessionId).toBe(targetEntry.sessionId);
    expect(result.isNewSession).toBe(false);
    // Mutable store still contains the target row for downstream persistence.
    expect(result.store[sessionKey]).toBe(targetEntry);
  });

  it("loads only the exact source row when sourceSessionKey differs", () => {
    const sessionKey = "agent:main:cron:job-b";
    const sourceSessionKey = "agent:main:direct:42";
    const targetEntry = sessionEntryFor(sessionKey);
    const sourceEntry = sessionEntryFor(sourceSessionKey, { sessionId: "sid-source" });
    loadSessionEntryMock.mockImplementation(({ sessionKey: key }) => {
      if (key === sessionKey) {
        return targetEntry;
      }
      if (key === sourceSessionKey) {
        return sourceEntry;
      }
      return undefined;
    });

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      sourceSessionKey,
      agentId: "main",
      nowMs: NOW_MS,
    });

    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect([...loadCallsByKey()].toSorted()).toEqual([sessionKey, sourceSessionKey].toSorted());
    // Source must be reachable through the returned mutable store.
    expect(result.store[sourceSessionKey]).toBe(sourceEntry);
    expect(result.store[sessionKey]).toBe(targetEntry);
    expect(result.initialSessionEntry).toBe(targetEntry);
  });

  it("loads only the target row when sourceSessionKey equals sessionKey", () => {
    const sessionKey = "agent:main:cron:job-c";
    const targetEntry = sessionEntryFor(sessionKey);
    loadSessionEntryMock.mockImplementation(({ sessionKey: key }) =>
      key === sessionKey ? targetEntry : undefined,
    );

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      sourceSessionKey: sessionKey,
      agentId: "main",
      nowMs: NOW_MS,
    });

    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect(loadCallsByKey()).toEqual([sessionKey]);
    expect(result.store[sessionKey]).toBe(targetEntry);
  });

  it("treats a whitespace sourceSessionKey as not differing", () => {
    const sessionKey = "agent:main:cron:job-d";
    const targetEntry = sessionEntryFor(sessionKey);
    loadSessionEntryMock.mockImplementation(({ sessionKey: key }) =>
      key === sessionKey ? targetEntry : undefined,
    );

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      sourceSessionKey: "   ",
      agentId: "main",
      nowMs: NOW_MS,
    });

    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect(loadCallsByKey()).toEqual([sessionKey]);
    expect(result.store[sessionKey]).toBe(targetEntry);
  });

  it("does not call loadSessionEntry when the caller injects params.store", () => {
    const sessionKey = "agent:main:cron:job-e";
    const sourceSessionKey = "agent:main:direct:43";
    const targetEntry = sessionEntryFor(sessionKey);
    const sourceEntry = sessionEntryFor(sourceSessionKey, { sessionId: "sid-source" });
    const store: Record<string, SessionEntry> = {
      [sessionKey]: targetEntry,
      [sourceSessionKey]: sourceEntry,
    };

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      sourceSessionKey,
      agentId: "main",
      nowMs: NOW_MS,
      store,
    });

    expect(loadSessionEntryMock).not.toHaveBeenCalled();
    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect(result.store).toBe(store);
    expect(result.initialSessionEntry).toBe(targetEntry);
  });

  it("passes storePath through to the canonical accessor for both rows", () => {
    const sessionKey = "agent:main:cron:job-f";
    const sourceSessionKey = "agent:main:direct:44";
    const targetEntry = sessionEntryFor(sessionKey);
    const sourceEntry = sessionEntryFor(sourceSessionKey);
    loadSessionEntryMock.mockImplementation(({ sessionKey: key }) => {
      if (key === sessionKey) {
        return targetEntry;
      }
      if (key === sourceSessionKey) {
        return sourceEntry;
      }
      return undefined;
    });

    resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      sourceSessionKey,
      agentId: "main",
      nowMs: NOW_MS,
    });

    const scopes = loadSessionEntryMock.mock.calls.map(([scope]) => scope);
    for (const scope of scopes) {
      expect(scope.storePath).toBe(STORE_PATH);
      expect(scope.agentId).toBe("main");
    }
  });

  it("creates a new sessionId when the default path returns no target row", () => {
    const sessionKey = "agent:main:cron:job-g";
    loadSessionEntryMock.mockReturnValue(undefined);

    const result = resolveCronSession({
      cfg: {} as OpenClawConfig,
      sessionKey,
      agentId: "main",
      nowMs: NOW_MS,
    });

    expect(listSessionEntriesMock).not.toHaveBeenCalled();
    expect(loadCallsByKey()).toEqual([sessionKey]);
    expect(result.isNewSession).toBe(true);
    expect(typeof result.sessionEntry.sessionId).toBe("string");
    expect(result.sessionEntry.sessionId.length).toBeGreaterThan(0);
    expect(result.initialSessionEntry).toBeUndefined();
  });
});
