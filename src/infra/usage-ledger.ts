/**
 * In-process provider usage accounting ledger.
 *
 * Rolls model-fetch usage (input/output/cache tokens) in memory keyed by
 * provider × model × agent × turn-class, flushed daily to append-only JSONL
 * under `~/.openclaw/logs/usage-ledger-YYYY-MM-DD.jsonl`, and exposed to
 * gateway clients through the read-only `usage.ledger` RPC.
 *
 * Restart durability is intentionally out of scope: the ledger is a bounded
 * in-process rollup sampled on each UTC day boundary (on the first record
 * after midnight) plus best-effort on SIGTERM/SIGINT. Cardinality is capped so
 * an unbounded provider/model/agent space cannot grow the map without bound.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { NormalizedUsage } from "../agents/usage.js";
import {
  isCronSessionKey,
  isIncognitoSessionKey,
  isSubagentSessionKey,
} from "../routing/session-key.js";
import { resolveHomeDir } from "../utils.js";

/** Turn classes the ledger groups usage by. */
export type UsageLedgerTurnClass = "interactive" | "cron" | "subagent" | "incognito" | "unknown";

/** A single rollup dimension tuple (provider × model × agent × turn-class). */
export type UsageLedgerDimension = {
  provider: string;
  model: string;
  agentId: string;
  turnClass: UsageLedgerTurnClass;
};

/** Aggregated token/call totals for one dimension across the in-process window. */
export type UsageLedgerEntry = UsageLedgerDimension & {
  calls: number;
  inputTokens: number;
  outputTokens: number;
  cacheReadTokens: number;
  cacheWriteTokens: number;
  totalTokens: number;
  firstTsMs: number;
  lastTsMs: number;
};

export type UsageLedgerRecordInput = UsageLedgerDimension & {
  usage?: NormalizedUsage | null;
};

/** Upper bound on distinct tracked dimensions before new keys are dropped. */
export const MAX_USAGE_LEDGER_ENTRIES = 10_000;

/**
 * Derives the ledger turn class from a session key. Session key shapes: cron
 * runs (`agent:<id>:cron:*`), spawned subagents (`agent:<id>:subagent:*`),
 * the incognito marker (hidden/heartbeat-style sessions), and everything else
 * falls back to interactive.
 */
export function resolveUsageLedgerTurnClass(
  sessionKey: string | undefined | null,
): UsageLedgerTurnClass {
  const key = sessionKey?.trim() || "";
  if (!key) {
    return "interactive";
  }
  if (isCronSessionKey(key)) {
    return "cron";
  }
  if (isSubagentSessionKey(key)) {
    return "subagent";
  }
  if (isIncognitoSessionKey(key)) {
    return "incognito";
  }
  return "interactive";
}

function formatUtcDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function normalizeTokenCount(value: number | undefined): number {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    return 0;
  }
  return Math.min(Math.floor(value), Number.MAX_SAFE_INTEGER);
}

type LedgerState = {
  map: Map<string, UsageLedgerEntry>;
  trackedDay: string;
};

function buildLedgerKey(dimension: UsageLedgerDimension): string {
  return [dimension.provider, dimension.model, dimension.agentId, dimension.turnClass].join(
    "\u0000",
  );
}

/** Internal store so tests can instantiate isolated ledgers. */
export function createUsageLedgerState(now: () => number = Date.now): LedgerState {
  return { map: new Map<string, UsageLedgerEntry>(), trackedDay: formatUtcDate(now()) };
}

/** Global ledger singleton consumed by the runtime integration. */
const state: LedgerState = { map: new Map<string, UsageLedgerEntry>(), trackedDay: "" };

function stateMap(): LedgerState {
  return state;
}

/** Resolves the ledger logs dir (defaults to `~/.openclaw/logs`). */
export function resolveLedgerLogsDir(): string {
  return path.join(resolveHomeDir() ?? os.homedir(), "logs");
}

/**
 * Records one settled model call usage into the in-process rollup. Non-throwing
 * and synchronous so it can sit on the hot settle path without affecting run
 * behavior. Returns the aggregated entry, or `undefined` when the event carried
 * no token counts or the rollup is already at cardinality cap.
 */
export function recordUsageLedger(
  input: UsageLedgerRecordInput,
  now: () => number = Date.now,
): UsageLedgerEntry | undefined {
  const tsMs = now();
  const provider = (input.provider ?? "").trim();
  const model = (input.model ?? "").trim();
  const agentId = (input.agentId ?? "").trim();
  if (!provider || !model || !agentId) {
    return undefined;
  }
  const turnClass = input.turnClass;
  const usage = input.usage;
  const inputTokens = normalizeTokenCount(usage?.input);
  const outputTokens = normalizeTokenCount(usage?.output);
  const cacheReadTokens = normalizeTokenCount(usage?.cacheRead);
  const cacheWriteTokens = normalizeTokenCount(usage?.cacheWrite);
  const totalTokens = normalizeTokenCount(
    usage?.total ?? inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens,
  );
  if (inputTokens === 0 && outputTokens === 0 && cacheReadTokens === 0 && cacheWriteTokens === 0) {
    return undefined;
  }
  advanceLedgerDay(tsMs);
  const key = buildLedgerKey({ provider, model, agentId, turnClass });
  if (!stateMap().map.has(key) && stateMap().map.size >= MAX_USAGE_LEDGER_ENTRIES) {
    return undefined;
  }
  const entry = stateMap().map.get(key);
  if (!entry) {
    stateMap().map.set(key, {
      provider,
      model,
      agentId,
      turnClass,
      calls: 1,
      inputTokens,
      outputTokens,
      cacheReadTokens,
      cacheWriteTokens,
      totalTokens,
      firstTsMs: tsMs,
      lastTsMs: tsMs,
    });
    return stateMap().map.get(key);
  }
  entry.calls += 1;
  entry.inputTokens += inputTokens;
  entry.outputTokens += outputTokens;
  entry.cacheReadTokens += cacheReadTokens;
  entry.cacheWriteTokens += cacheWriteTokens;
  entry.totalTokens += totalTokens;
  entry.lastTsMs = tsMs;
  return entry;
}

const ENTRY_SORT_KEY = (e: UsageLedgerEntry) =>
  [e.provider, e.model, e.agentId, e.turnClass].join("\u0000");

function entriesInWriteOrder(): UsageLedgerEntry[] {
  return Array.from(stateMap().map.values()).toSorted((a, b) =>
    ENTRY_SORT_KEY(a).localeCompare(ENTRY_SORT_KEY(b)),
  );
}

/**
 * Appends the current rollup as one JSONL line to the given UTC day's file.
 * Returns the number of entries written (0 when nothing is tracked).
 */
export function flushUsageLedger(
  options: { day?: string; logsDir?: string } = {},
  now: () => number = Date.now,
): number {
  const entries = entriesInWriteOrder();
  if (entries.length === 0) {
    return 0;
  }
  const day = options.day ?? formatUtcDate(now());
  const dir = options.logsDir ?? resolveLedgerLogsDir();
  fs.mkdirSync(dir, { recursive: true });
  const line = JSON.stringify({
    date: day,
    ts: now(),
    entries: entries.map((e) => ({
      provider: e.provider,
      model: e.model,
      agentId: e.agentId,
      turnClass: e.turnClass,
      calls: e.calls,
      inputTokens: e.inputTokens,
      outputTokens: e.outputTokens,
      cacheReadTokens: e.cacheReadTokens,
      cacheWriteTokens: e.cacheWriteTokens,
      totalTokens: e.totalTokens,
    })),
  });
  fs.appendFileSync(path.join(dir, `usage-ledger-${day}.jsonl`), `${line}\n`, "utf8");
  return entries.length;
}

/** Returns a detached snapshot of the current rollup (safe for RPC serialization). */
export function snapshotUsageLedger(): UsageLedgerEntry[] {
  return entriesInWriteOrder().map((e) => Object.assign({}, e));
}

/** Empties the in-memory rollup (tests, day roll-over, gateway teardown). */
export function resetUsageLedgerForTest(): void {
  stateMap().map.clear();
  stateMap().trackedDay = "";
}

/** Flushes a completed day and clears the rollup for the new day. */
export function rollOverUsageLedger(options: { day?: string; logsDir?: string } = {}): number {
  const day = options.day ?? (stateMap().trackedDay || formatUtcDate(Date.now()));
  const flushed = flushUsageLedger({ day, logsDir: options.logsDir });
  resetUsageLedgerForTest();
  return flushed;
}

/** Marks the current UTC day as tracked, flushing the completed prior day's rollup on roll-over. */
function advanceLedgerDay(nowMs: number): void {
  const day = formatUtcDate(nowMs);
  const tracked = stateMap().trackedDay;
  if (tracked && tracked !== day) {
    flushUsageLedger({ day: tracked });
    stateMap().map.clear();
  }
  stateMap().trackedDay = day;
}

let dailyTimer: ReturnType<typeof setTimeout> | undefined;
let signalListenerInstalled = false;

const flushOnSignal = () => {
  try {
    rollOverUsageLedger();
  } catch {
    // best-effort flush; never let signal handling break shutdown
  }
};

function removeSignalListeners(): void {
  process.removeListener("SIGTERM", flushOnSignal);
  process.removeListener("SIGINT", flushOnSignal);
}

/**
 * Arms the daily rollover timer and best-effort SIGTERM/SIGINT flush. Idempotent
 * so it can be called from the boot path and again defensively.
 */
export function startUsageLedger(): void {
  if (!signalListenerInstalled) {
    signalListenerInstalled = true;
    process.once("SIGTERM", flushOnSignal);
    process.once("SIGINT", flushOnSignal);
  }
  if (dailyTimer) {
    return;
  }
  const armTimer = () => {
    dailyTimer = setTimeout(() => {
      dailyTimer = undefined;
      try {
        advanceLedgerDay(Date.now());
      } catch {
        // best-effort
      }
      armTimer();
    }, delayUntilNextUtcDay());
    dailyTimer.unref?.();
  };
  armTimer();
}

function delayUntilNextUtcDay(): number {
  const now = new Date();
  const nextUtcDay = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return Math.max(1_000, nextUtcDay.getTime() - now.getTime());
}

/** Stops the daily timer and removes signal listeners (test teardown). */
export function stopUsageLedger(): void {
  if (dailyTimer) {
    clearTimeout(dailyTimer);
    dailyTimer = undefined;
  }
  removeSignalListeners();
  signalListenerInstalled = false;
}
