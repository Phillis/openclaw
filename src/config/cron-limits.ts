// Computes cron scheduling limits from config.
/**
 * Default maximum number of cron jobs allowed to run at once.
 *
 * Scheduled turns can each spawn a full agent harness (and, for Codex-backed
 * work, a separate app-server tree). Keeping this aligned with the default
 * top-level agent concurrency avoids an eight-run cron burst doubling the
 * normal process and CPU budget.
 */
export const DEFAULT_CRON_MAX_CONCURRENT_RUNS = 4;
const DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS = 30_000;

/** Resolves cron concurrency config, flooring finite values and clamping to at least one. */
export function resolveCronMaxConcurrentRuns(): number {
  return DEFAULT_CRON_MAX_CONCURRENT_RUNS;
}

/** Resolves the minimum cadence for trigger-bearing cron jobs. */
export function resolveCronTriggerMinIntervalMs(): number {
  return DEFAULT_CRON_TRIGGER_MIN_INTERVAL_MS;
}
