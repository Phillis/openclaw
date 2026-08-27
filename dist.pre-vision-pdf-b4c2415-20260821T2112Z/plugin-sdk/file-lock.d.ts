//#region src/plugin-sdk/file-lock.d.ts
/** Retry and stale-recovery policy for acquiring a filesystem lock. */
type FileLockOptions = {
  /** Retry policy used while waiting for another process or logical holder to release. */retries: {
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    randomize?: boolean;
  }; /** Milliseconds used to classify contended sidecars as stale. */
  stale: number; /** Fail closed for security-sensitive state; generic locks retain shipped stale recovery. */
  staleRecovery?: "fail-closed" | "remove-if-unchanged";
  /**
   * Logical operation identity for intentional nested acquisition.
   * Reuse one key only within that call chain; omit it for ordinary contention.
   */
  reentrantOwner?: string;
};
/** Live file-lock handle returned after successful acquisition. */
type FileLockHandle = {
  /** Absolute path to the `.lock` sidecar held for this file path. */lockPath: string; /** Releases one held reference; callers must await it before assuming peers can proceed. */
  release: () => Promise<void>;
};
/** Stable error code used when lock acquisition retries are exhausted. */
declare const FILE_LOCK_TIMEOUT_ERROR_CODE = "file_lock_timeout";
/** Stable error code used when stale lock recovery cannot proceed safely. */
declare const FILE_LOCK_STALE_ERROR_CODE = "file_lock_stale";
/** Typed error thrown when a lock cannot be acquired before timeout. */
type FileLockTimeoutError = Error & {
  /** Stable error discriminator for lock acquisition timeout handling. */code: typeof FILE_LOCK_TIMEOUT_ERROR_CODE; /** Lock sidecar path that could not be acquired before retries were exhausted. */
  lockPath: string;
};
/** Typed error thrown when a stale lock sidecar cannot be reclaimed safely. */
type FileLockStaleError = Error & {
  /** Stable error discriminator for stale-lock reclaim failures. */code: typeof FILE_LOCK_STALE_ERROR_CODE; /** Lock sidecar path that could not be safely reclaimed. */
  lockPath: string;
};
/** Reset process-local file-lock state for tests that isolate lock managers. */
declare function resetFileLockStateForTest(): void;
/** Wait for process-local file-lock state to drain before test teardown. */
declare function drainFileLockStateForTest(): Promise<void>;
/** Acquire an owner-scoped process-local file lock backed by a `.lock` sidecar file. */
declare function acquireFileLock(filePath: string, options: FileLockOptions): Promise<FileLockHandle>;
/** Result of a doctor-owned attempt to remove one retired file-lock sidecar. */
type StaleFileLockReclaimResult = "missing" | "removed" | "retained";
/** Remove one definitely stale, unchanged regular lock sidecar; retain every ambiguous owner. */
declare function reclaimDefinitelyStaleFileLock(lockPath: string): Promise<StaleFileLockReclaimResult>;
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
declare function withFileLock<T>(filePath: string, options: FileLockOptions, fn: () => Promise<T>): Promise<T>;
//#endregion
export { FILE_LOCK_STALE_ERROR_CODE, FILE_LOCK_TIMEOUT_ERROR_CODE, FileLockHandle, FileLockOptions, FileLockStaleError, FileLockTimeoutError, StaleFileLockReclaimResult, acquireFileLock, drainFileLockStateForTest, reclaimDefinitelyStaleFileLock, resetFileLockStateForTest, withFileLock };