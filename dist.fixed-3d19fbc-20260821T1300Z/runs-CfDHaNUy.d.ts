//#region src/agents/embedded-agent-runner/run-state.d.ts
/** Counts active embedded runs while including auto-reply registry runs for shared sessions. */
declare function getActiveEmbeddedRunCount(): number;
/** Lists active embedded-run session keys from both embedded and auto-reply registries. */
declare function listActiveEmbeddedRunSessionKeys(): string[];
/** Lists active embedded-run session ids from all embedded-run lookup maps. */
declare function listActiveEmbeddedRunSessionIds(): string[];
//#endregion
//#region src/agents/embedded-agent-runner/runs.d.ts
/**
 * Abort embedded OpenClaw runs.
 *
 * - With a sessionId, aborts that single run.
 * - With no sessionId, supports targeted abort modes (for example, compacting runs only).
 */
declare function abortEmbeddedAgentRun(sessionId: string): boolean;
declare function abortEmbeddedAgentRun(sessionId: undefined, opts: {
  mode: "all" | "compacting";
  reason?: "restart";
}): boolean;
/**
 * Wait for active embedded runs to drain.
 *
 * Used during restarts so in-flight runs can finish transcript writes before the
 * next lifecycle starts. If no timeout is passed, waits indefinitely.
 */
declare function waitForActiveEmbeddedRuns(timeoutMs?: number, opts?: {
  pollMs?: number;
}): Promise<{
  drained: boolean;
}>;
//#endregion
export { listActiveEmbeddedRunSessionKeys as a, listActiveEmbeddedRunSessionIds as i, waitForActiveEmbeddedRuns as n, getActiveEmbeddedRunCount as r, abortEmbeddedAgentRun as t };