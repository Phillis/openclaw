//#region packages/terminal-core/src/restore.d.ts
type RestoreTerminalStateOptions = {
  /**
   * Resumes paused stdin after restoring terminal mode.
   * Keep this off when the process should exit immediately after cleanup.
   *
   * Default: false (safer for "cleanup then exit" call sites).
   */
  resumeStdin?: boolean;
  /**
   * Alias for resumeStdin. Prefer this name to make the behavior explicit.
   *
   * Default: false.
   */
  resumeStdinIfPaused?: boolean;
  /**
   * Stream to write the ANSI reset sequence to.
   * Callers that emit structured data to stdout should route the reset to
   * stderr so parseable output stays clean.
   *
   * Default: process.stdout.
   */
  resetStream?: NodeJS.WriteStream;
};
declare function restoreTerminalState(reason?: string, options?: RestoreTerminalStateOptions): void;
//#endregion
export { restoreTerminalState as t };