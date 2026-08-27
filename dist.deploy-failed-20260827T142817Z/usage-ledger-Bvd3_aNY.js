import { f as resolveHomeDir } from "./utils-DEqefz4f.js";
import { a as isSubagentSessionKey, i as isCronSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
/**
* Derives the ledger turn class from a session key. Session key shapes: cron
* runs (`agent:<id>:cron:*`), spawned subagents (`agent:<id>:subagent:*`),
* the incognito marker (hidden/heartbeat-style sessions), and everything else
* falls back to interactive.
*/
function resolveUsageLedgerTurnClass(sessionKey) {
	const key = sessionKey?.trim() || "";
	if (!key) return "interactive";
	if (isCronSessionKey(key)) return "cron";
	if (isSubagentSessionKey(key)) return "subagent";
	if (isIncognitoSessionKey(key)) return "incognito";
	return "interactive";
}
function formatUtcDate(ms) {
	return new Date(ms).toISOString().slice(0, 10);
}
function normalizeTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return 0;
	return Math.min(Math.floor(value), Number.MAX_SAFE_INTEGER);
}
function buildLedgerKey(dimension) {
	return [
		dimension.provider,
		dimension.model,
		dimension.agentId,
		dimension.turnClass
	].join("\0");
}
/** Global ledger singleton consumed by the runtime integration. */
const state = {
	map: /* @__PURE__ */ new Map(),
	trackedDay: ""
};
function stateMap() {
	return state;
}
/** Resolves the ledger logs dir (defaults to `~/.openclaw/logs`). */
function resolveLedgerLogsDir() {
	return path.join(resolveHomeDir() ?? os.homedir(), "logs");
}
/**
* Records one settled model call usage into the in-process rollup. Non-throwing
* and synchronous so it can sit on the hot settle path without affecting run
* behavior. Returns the aggregated entry, or `undefined` when the event carried
* no token counts or the rollup is already at cardinality cap.
*/
function recordUsageLedger(input, now = Date.now) {
	const tsMs = now();
	const provider = (input.provider ?? "").trim();
	const model = (input.model ?? "").trim();
	const agentId = (input.agentId ?? "").trim();
	if (!provider || !model || !agentId) return;
	const turnClass = input.turnClass;
	const usage = input.usage;
	const inputTokens = normalizeTokenCount(usage?.input);
	const outputTokens = normalizeTokenCount(usage?.output);
	const cacheReadTokens = normalizeTokenCount(usage?.cacheRead);
	const cacheWriteTokens = normalizeTokenCount(usage?.cacheWrite);
	const totalTokens = normalizeTokenCount(usage?.total ?? inputTokens + outputTokens + cacheReadTokens + cacheWriteTokens);
	if (inputTokens === 0 && outputTokens === 0 && cacheReadTokens === 0 && cacheWriteTokens === 0) return;
	advanceLedgerDay(tsMs);
	const key = buildLedgerKey({
		provider,
		model,
		agentId,
		turnClass
	});
	if (!stateMap().map.has(key) && stateMap().map.size >= 1e4) return;
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
			lastTsMs: tsMs
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
const ENTRY_SORT_KEY = (e) => [
	e.provider,
	e.model,
	e.agentId,
	e.turnClass
].join("\0");
function entriesInWriteOrder() {
	return Array.from(stateMap().map.values()).toSorted((a, b) => ENTRY_SORT_KEY(a).localeCompare(ENTRY_SORT_KEY(b)));
}
/**
* Appends the current rollup as one JSONL line to the given UTC day's file.
* Returns the number of entries written (0 when nothing is tracked).
*/
function flushUsageLedger(options = {}, now = Date.now) {
	const entries = entriesInWriteOrder();
	if (entries.length === 0) return 0;
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
			totalTokens: e.totalTokens
		}))
	});
	fs.appendFileSync(path.join(dir, `usage-ledger-${day}.jsonl`), `${line}\n`, "utf8");
	return entries.length;
}
/** Returns a detached snapshot of the current rollup (safe for RPC serialization). */
function snapshotUsageLedger() {
	return entriesInWriteOrder().map((e) => ({ ...e }));
}
/** Empties the in-memory rollup (tests, day roll-over, gateway teardown). */
function resetUsageLedgerForTest() {
	stateMap().map.clear();
	stateMap().trackedDay = "";
}
/** Flushes a completed day and clears the rollup for the new day. */
function rollOverUsageLedger(options = {}) {
	const flushed = flushUsageLedger({
		day: options.day ?? (stateMap().trackedDay || formatUtcDate(Date.now())),
		logsDir: options.logsDir
	});
	resetUsageLedgerForTest();
	return flushed;
}
/** Marks the current UTC day as tracked, flushing the completed prior day's rollup on roll-over. */
function advanceLedgerDay(nowMs) {
	const day = formatUtcDate(nowMs);
	const tracked = stateMap().trackedDay;
	if (tracked && tracked !== day) {
		flushUsageLedger({ day: tracked });
		stateMap().map.clear();
	}
	stateMap().trackedDay = day;
}
let dailyTimer;
let signalListenerInstalled = false;
const flushOnSignal = () => {
	try {
		rollOverUsageLedger();
	} catch {}
};
/**
* Arms the daily rollover timer and best-effort SIGTERM/SIGINT flush. Idempotent
* so it can be called from the boot path and again defensively.
*/
function startUsageLedger() {
	if (!signalListenerInstalled) {
		signalListenerInstalled = true;
		process.once("SIGTERM", flushOnSignal);
		process.once("SIGINT", flushOnSignal);
	}
	if (dailyTimer) return;
	const armTimer = () => {
		dailyTimer = setTimeout(() => {
			dailyTimer = void 0;
			try {
				advanceLedgerDay(Date.now());
			} catch {}
			armTimer();
		}, delayUntilNextUtcDay());
		dailyTimer.unref?.();
	};
	armTimer();
}
function delayUntilNextUtcDay() {
	const now = /* @__PURE__ */ new Date();
	const nextUtcDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
	return Math.max(1e3, nextUtcDay.getTime() - now.getTime());
}
//#endregion
export { startUsageLedger as i, resolveUsageLedgerTurnClass as n, snapshotUsageLedger as r, recordUsageLedger as t };
