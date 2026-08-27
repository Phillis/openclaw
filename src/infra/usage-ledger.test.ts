// Covers the in-process usage accounting ledger rollup, day flush, and JSONL shape.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  MAX_USAGE_LEDGER_ENTRIES,
  flushUsageLedger,
  recordUsageLedger,
  resetUsageLedgerForTest,
  resolveUsageLedgerTurnClass,
  rollOverUsageLedger,
  snapshotUsageLedger,
  startUsageLedger,
  stopUsageLedger,
} from "./usage-ledger.js";

describe("resolveUsageLedgerTurnClass", () => {
  it("classifies cron, subagent, incognito, and interactive session keys", () => {
    expect(resolveUsageLedgerTurnClass("agent:dev:cron:nightly:run:abc")).toBe("cron");
    expect(resolveUsageLedgerTurnClass("agent:dev:subagent:research")).toBe("subagent");
    expect(resolveUsageLedgerTurnClass("agent:dev:dashboard:incognito-xyz")).toBe("incognito");
    expect(resolveUsageLedgerTurnClass("agent:dev:main")).toBe("interactive");
    expect(resolveUsageLedgerTurnClass("agent:dev:telegram:direct:123")).toBe("interactive");
    expect(resolveUsageLedgerTurnClass("")).toBe("interactive");
    expect(resolveUsageLedgerTurnClass(undefined)).toBe("interactive");
    // Nested subagent suffix on a cron key stays cron (priority order).
    expect(resolveUsageLedgerTurnClass("agent:dev:cron:job:run:r")).toBe("cron");
  });
});

describe("recordUsageLedger + snapshotUsageLedger", () => {
  beforeEach(() => {
    resetUsageLedgerForTest();
  });
  afterEach(() => {
    resetUsageLedgerForTest();
    stopUsageLedger();
  });

  it("rolls usage by provider x model x agent x turn class and aggregates", () => {
    recordUsageLedger({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "dev",
      turnClass: "interactive",
      usage: { input: 10, output: 5, cacheRead: 2, total: 17 },
    });
    recordUsageLedger({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "dev",
      turnClass: "interactive",
      usage: { input: 3, output: 1, cacheWrite: 4, total: 8 },
    });
    const snap = snapshotUsageLedger();
    expect(snap).toHaveLength(1);
    expect(snap[0]).toMatchObject({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "dev",
      turnClass: "interactive",
      calls: 2,
      inputTokens: 13,
      outputTokens: 6,
      cacheReadTokens: 2,
      cacheWriteTokens: 4,
      totalTokens: 25,
    });
    expect(snap[0].lastTsMs).toBeGreaterThanOrEqual(snap[0].firstTsMs);
  });

  it("tracks distinct dimensions separately", () => {
    recordUsageLedger({
      provider: "openai",
      model: "gpt-5",
      agentId: "dev",
      turnClass: "cron",
      usage: { input: 1, output: 1 },
    });
    recordUsageLedger({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "prod",
      turnClass: "subagent",
      usage: { input: 2, output: 2 },
    });
    expect(snapshotUsageLedger()).toHaveLength(2);
  });

  it("returns undefined and records nothing for zero usage or missing identity", () => {
    expect(
      recordUsageLedger({
        provider: "anthropic",
        model: "claude",
        agentId: "dev",
        turnClass: "interactive",
        usage: { input: 0, output: 0 },
      }),
    ).toBeUndefined();
    expect(
      recordUsageLedger({
        provider: "",
        model: "claude",
        agentId: "dev",
        turnClass: "interactive",
        usage: { input: 5 },
      }),
    ).toBeUndefined();
    expect(snapshotUsageLedger()).toHaveLength(0);
  });

  it("drops new dimensions beyond the cardinality cap", () => {
    resetUsageLedgerForTest();
    for (let i = 0; i < MAX_USAGE_LEDGER_ENTRIES + 5; i += 1) {
      recordUsageLedger({
        provider: "p",
        model: `m-${i}`,
        agentId: "a",
        turnClass: "interactive",
        usage: { input: 1, output: 1 },
      });
    }
    expect(snapshotUsageLedger()).toHaveLength(MAX_USAGE_LEDGER_ENTRIES);
  });
});

describe("flushUsageLedger", () => {
  it("writes valid append-only JSONL with one snapshot line per flush into the day file", () => {
    resetUsageLedgerForTest();
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "usage-ledger-"));
    const logsDir = path.join(tempRoot, "logs");
    recordUsageLedger({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "dev",
      turnClass: "cron",
      usage: { input: 7, output: 3, total: 10 },
    });

    const pushed = flushUsageLedger({ day: "2026-01-02", logsDir });
    expect(pushed).toBe(1);
    // Second flush is a second snapshot line for the same active day (append-only).
    expect(flushUsageLedger({ day: "2026-01-02", logsDir })).toBe(1);

    const file = path.join(logsDir, "usage-ledger-2026-01-02.jsonl");
    expect(fs.existsSync(file)).toBe(true);
    const lines = fs.readFileSync(file, "utf8").trim().split("\n");
    expect(lines).toHaveLength(2);
    const first = JSON.parse(lines[0]!) as {
      date: string;
      ts: number;
      entries: Array<{
        provider: string;
        model: string;
        agentId: string;
        turnClass: string;
        calls: number;
        inputTokens: number;
        outputTokens: number;
        totalTokens: number;
      }>;
    };
    expect(first.date).toBe("2026-01-02");
    expect(typeof first.ts).toBe("number");
    expect(first.entries).toHaveLength(1);
    expect(first.entries[0]).toMatchObject({
      provider: "anthropic",
      model: "claude-opus",
      agentId: "dev",
      turnClass: "cron",
      calls: 1,
      inputTokens: 7,
      outputTokens: 3,
      totalTokens: 10,
    });
    expect(first.entries[0].cacheReadTokens).toBe(0);

    // Writes into an isolated dir; no default ~/.openclaw/logs side effect.
    expect(fs.existsSync(path.join(os.homedir(), "logs"))).toBe(false);

    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it("writes nothing when the rollup is empty", () => {
    resetUsageLedgerForTest();
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "usage-ledger-empty-"));
    expect(flushUsageLedger({ logsDir: path.join(tempRoot, "logs") })).toBe(0);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });
});

describe("rollOverUsageLedger", () => {
  beforeEach(() => resetUsageLedgerForTest());
  afterEach(() => resetUsageLedgerForTest());
  it("flushes the completed day's snapshot and clears the in-memory rollup", () => {
    resetUsageLedgerForTest();
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "usage-ledger-roll-"));
    const logsDir = path.join(tempRoot, "logs");
    const priorDay = "2026-01-02";
    recordUsageLedger({
      provider: "openai",
      model: "gpt",
      agentId: "d",
      turnClass: "interactive",
      usage: { input: 5, output: 5 },
    });
    const flushed = rollOverUsageLedger({ day: priorDay, logsDir });
    expect(flushed).toBe(1);
    expect(snapshotUsageLedger()).toHaveLength(0);
    const file = path.join(logsDir, `usage-ledger-${priorDay}.jsonl`);
    expect(fs.existsSync(file)).toBe(true);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });
});

describe("startUsageLedger / stopUsageLedger", () => {
  afterEach(() => stopUsageLedger());
  it("arms and disarms the daily rollover timer without throwing", () => {
    resetUsageLedgerForTest();
    expect(() => startUsageLedger()).not.toThrow();
    expect(() => startUsageLedger()).not.toThrow();
    expect(() => stopUsageLedger()).not.toThrow();
  });
});
