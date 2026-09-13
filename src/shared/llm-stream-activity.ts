import { resolveGlobalSingleton } from "./global-singleton.js";

const { runLastActivityMs } = resolveGlobalSingleton(
  Symbol.for("openclaw.llmStreamActivity"),
  () => ({
    runLastActivityMs: new Map<string, number>(),
  }),
  (state) => {
    state.runLastActivityMs.clear();
  },
);

/**
 * Run-scoped LLM stream progress timestamps, fed per provider chunk by the
 * idle-timeout stream wrapper. Consumers (attempt drain grace) read recency
 * to distinguish an actively producing stream from a stalled one at the
 * moment the attempt deadline fires.
 */
export function notifyLlmStreamActivity(runId: string): void {
  runLastActivityMs.set(runId, Date.now());
}

export function getLastLlmStreamActivityMs(runId: string): number {
  return runLastActivityMs.get(runId) ?? 0;
}

export function clearLlmStreamActivityRun(runId: string): void {
  runLastActivityMs.delete(runId);
}
