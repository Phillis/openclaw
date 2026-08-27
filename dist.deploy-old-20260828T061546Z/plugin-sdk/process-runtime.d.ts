import { a as CommandOptions, c as resolveProcessExitCode, i as shouldSpawnWithShell, n as runExec, o as runCommandWithTimeout, r as resolveCommandEnv, s as SpawnResult, t as runCommandBuffered } from "../exec-VwHB8J3Z.js";
//#region packages/agent-core/src/harness/env/kill-tree.d.ts
type KillProcessTreeOptions = {
  graceMs?: number;
  detached?: boolean;
  force?: boolean;
};
/**
 * Best-effort process-tree termination with graceful shutdown.
 * - Windows: use taskkill /T to include descendants. Sends SIGTERM-equivalent
 *   first (without /F), then force-kills if taskkill refuses or the process
 *   survives the grace period.
 * - Unix: send SIGTERM to process group first, wait grace period, then SIGKILL.
 *
 * Group kill (`process.kill(-pid, ...)`) is only used when the PID is verified
 * as its own process group leader, unless `detached: true` is explicitly passed.
 * This prevents accidentally signaling the gateway's process group when the
 * child shares its parent's group.
 *
 * - `detached: false`: skip group kill unconditionally.
 * - `detached: true`: use group kill unconditionally (trust caller).
 * - `detached` omitted: use group kill only when PID is the group leader.
 */
declare function killProcessTree(pid: number, opts?: KillProcessTreeOptions): void;
//#endregion
//#region src/process/linux-oom-score.d.ts
type OomWrapOptions = {
  platform?: NodeJS.Platform;
  env?: NodeJS.ProcessEnv;
  shellAvailable?: () => boolean;
};
type OomScoreAdjustedSpawn = {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv | undefined;
  wrapped: boolean;
};
declare function prepareOomScoreAdjustedSpawn(command: string, args?: readonly string[], options?: OomWrapOptions): OomScoreAdjustedSpawn;
//#endregion
//#region src/infra/runtime-worker-url.d.ts
/** Resolve a source worker sibling or its stable packaged path under dist. */
declare function resolveRuntimeWorkerUrl(params: {
  currentModuleUrl: string;
  sourceWorkerName: string;
  distWorkerPath: string;
}): URL;
declare function resolveRuntimeWorkerArgv(url: URL): string[];
//#endregion
//#region src/shared/pid-alive.d.ts
/** Returns true only when a positive PID exists and is not a Linux zombie process. */
declare function isPidAlive(pid: number): boolean;
//#endregion
export { type CommandOptions, type OomScoreAdjustedSpawn, type OomWrapOptions, type SpawnResult, isPidAlive, killProcessTree, prepareOomScoreAdjustedSpawn, resolveCommandEnv, resolveProcessExitCode, resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl, runCommandBuffered, runCommandWithTimeout, runExec, shouldSpawnWithShell };