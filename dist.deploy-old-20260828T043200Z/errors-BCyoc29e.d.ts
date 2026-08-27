//#region node_modules/@openclaw/fs-safe/dist/errors.d.ts
type FsSafeErrorCode = "already-exists" | "denied-path" | "device-path" | "hardlink" | "helper-failed" | "helper-unavailable" | "invalid-path" | "insecure-permissions" | "not-empty" | "not-file" | "not-found" | "not-owned" | "not-removable" | "outside-workspace" | "path-alias" | "path-mismatch" | "permission-unverified" | "read-failed" | "secret-exists" | "store-reentrant-update" | "symlink" | "timeout" | "too-large" | "unsupported-platform";
type FsSafeErrorCategory = "policy" | "operational";
type FsSafeErrorDetails = Readonly<Record<string, unknown>>;
declare class FsSafeError extends Error {
  readonly code: FsSafeErrorCode;
  readonly category: FsSafeErrorCategory;
  readonly details?: FsSafeErrorDetails;
  constructor(code: FsSafeErrorCode, message: string, options?: {
    cause?: unknown;
    details?: FsSafeErrorDetails;
  });
}
//#endregion
export { FsSafeErrorCode as n, FsSafeError as t };