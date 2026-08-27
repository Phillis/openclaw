//#region src/infra/errors.d.ts
declare function extractErrorCode(err: unknown): string | undefined;
declare function readErrorName(err: unknown): string;
declare function collectErrorGraphCandidates(err: unknown, resolveNested?: (current: Record<string, unknown>) => Iterable<unknown>): unknown[];
declare function formatErrorMessage(err: unknown): string;
declare function formatUncaughtError(err: unknown): string;
//#endregion
export { readErrorName as a, formatUncaughtError as i, extractErrorCode as n, formatErrorMessage as r, collectErrorGraphCandidates as t };