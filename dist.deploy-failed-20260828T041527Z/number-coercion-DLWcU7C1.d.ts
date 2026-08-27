//#region packages/normalization-core/src/number-coercion.d.ts
/** Returns a number only when the input is already finite. */
declare function asFiniteNumber(value: unknown): number | undefined;
/** Returns a finite number only when it satisfies the supplied inclusive/exclusive bounds. */
declare function asFiniteNumberInRange(value: unknown, range: {
  min?: number;
  max?: number;
  minExclusive?: boolean;
  maxExclusive?: boolean;
}): number | undefined;
/** Returns a safe integer only when it satisfies the supplied inclusive bounds. */
declare function asSafeIntegerInRange(value: unknown, range: {
  min?: number;
  max?: number;
}): number | undefined;
/** Parses finite numbers from number values or strict numeric string tokens. */
declare function parseFiniteNumber(value: unknown): number | undefined;
/** Parses only safe integer numbers or base-10 integer strings. */
declare function parseStrictInteger(value: unknown): number | undefined;
/** Parses only finite decimal/scientific string tokens, rejecting partial numbers. */
declare function parseStrictFiniteNumber(value: unknown): number | undefined;
/** Returns positive safe integers without string coercion. */
declare function asPositiveSafeInteger(value: unknown): number | undefined;
/** Conservative upper bound for Node timer delays. */
declare const MAX_TIMER_TIMEOUT_MS = 2147000000;
/** Timer bound expressed in whole seconds for env/config inputs. */
declare const MAX_TIMER_TIMEOUT_SECONDS: number;
/** Clamps finite millisecond values into the Node-safe timer range. */
declare function clampTimerTimeoutMs(valueMs: unknown, minMs?: number): number | undefined;
/** Converts finite positive seconds to Node-safe milliseconds. */
declare function finiteSecondsToTimerSafeMilliseconds(value: unknown, opts?: {
  floorSeconds?: boolean;
}): number | undefined;
/** Resolves an integer option with a non-negative lower bound. */
declare function resolveNonNegativeIntegerOption(value: unknown, fallback: number): number;
/** Parses strict positive integer values from numbers or strings. */
declare function parseStrictPositiveInteger(value: unknown): number | undefined;
/** Parses strict non-negative integer values from numbers or strings. */
declare function parseStrictNonNegativeInteger(value: unknown): number | undefined;
/** Converts strict positive seconds to safe millisecond counts. */
declare function positiveSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Converts strict non-negative seconds to safe millisecond counts. */
declare function nonNegativeSecondsToSafeMilliseconds(value: unknown): number | undefined;
/** Resolves an absolute expiration timestamp from a positive duration in seconds. */
declare function resolveExpiresAtMsFromDurationSeconds(value: unknown, opts?: {
  nowMs?: number;
  bufferMs?: number;
  minRemainingMs?: number;
}): number | undefined;
/** Resolves an absolute expiration timestamp from Unix epoch seconds. */
declare function resolveExpiresAtMsFromEpochSeconds(value: unknown, opts?: {
  bufferMs?: number;
  maxMs?: number;
}): number | undefined;
/** Resolves expiration input that may be relative seconds, epoch seconds, or epoch milliseconds. */
declare function resolveExpiresAtMsFromDurationOrEpoch(value: unknown, opts?: {
  nowMs?: number;
  relativeSecondsThreshold?: number;
  absoluteMillisecondsThreshold?: number;
}): number | undefined;
//#endregion
export { resolveExpiresAtMsFromDurationSeconds as _, asPositiveSafeInteger as a, finiteSecondsToTimerSafeMilliseconds as c, parseStrictFiniteNumber as d, parseStrictInteger as f, resolveExpiresAtMsFromDurationOrEpoch as g, positiveSecondsToSafeMilliseconds as h, asFiniteNumberInRange as i, nonNegativeSecondsToSafeMilliseconds as l, parseStrictPositiveInteger as m, MAX_TIMER_TIMEOUT_SECONDS as n, asSafeIntegerInRange as o, parseStrictNonNegativeInteger as p, asFiniteNumber as r, clampTimerTimeoutMs as s, MAX_TIMER_TIMEOUT_MS as t, parseFiniteNumber as u, resolveExpiresAtMsFromEpochSeconds as v, resolveNonNegativeIntegerOption as y };