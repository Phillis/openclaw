//#region src/infra/errno.d.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
declare function isErrno(err: unknown): err is NodeJS.ErrnoException;
/** Checks whether an errno-shaped value has the exact code. */
declare function hasErrnoCode(err: unknown, code: string): boolean;
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
declare function isMissingPathError(err: unknown): boolean;
//#endregion
//#region src/infra/errors.d.ts
declare function extractErrorCode(err: unknown): string | undefined;
declare function readErrorName(err: unknown): string;
declare function collectErrorGraphCandidates(err: unknown, resolveNested?: (current: Record<string, unknown>) => Iterable<unknown>): unknown[];
declare function formatErrorMessage(err: unknown): string;
declare function formatUncaughtError(err: unknown): string;
//#endregion
export { readErrorName as a, isMissingPathError as c, formatUncaughtError as i, extractErrorCode as n, hasErrnoCode as o, formatErrorMessage as r, isErrno as s, collectErrorGraphCandidates as t };