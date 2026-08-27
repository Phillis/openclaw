import { A as resolveNonNegativeIntegerOption, C as positiveSecondsToSafeMilliseconds, D as resolveExpiresAtMsFromDurationSeconds, E as resolveExpiresAtMsFromDurationOrEpoch, F as timestampMsToIsoString, M as resolvePositiveTimerTimeoutMs, N as resolveTimerTimeoutMs, O as resolveExpiresAtMsFromEpochSeconds, P as resolveTimestampMsToIsoString, S as parseStrictPositiveInteger, T as resolveExpiresAtMsFromDurationMs, _ as parseDateStringTimestampMs, a as asDateTimestampMs, b as parseStrictInteger, c as asNonNegativeFiniteNumber, d as clampPositiveTimerTimeoutMs, f as clampTimerTimeoutMs, g as parseDateFirstTimestampMs, h as nonNegativeSecondsToSafeMilliseconds, i as addTimerTimeoutGraceMs, j as resolveOptionalIntegerOption, k as resolveIntegerOption, l as asPositiveFiniteNumber, m as isFutureDateTimestampMs, n as MAX_TIMER_TIMEOUT_MS, p as finiteSecondsToTimerSafeMilliseconds, r as MAX_TIMER_TIMEOUT_SECONDS, s as asFiniteNumberInRange, t as MAX_DATE_TIMESTAMP_MS, u as asSafeIntegerInRange, v as parseFiniteNumber, w as resolveDateTimestampMs, x as parseStrictNonNegativeInteger, y as parseStrictFiniteNumber } from "../number-coercion-BMIVhtbY.js";
//#region packages/normalization-core/src/format.d.ts
type ByteSizeUnit = "byte" | "kilo" | "mega" | "giga" | "tera";
type ByteSizeStyle = "iec" | "legacy-binary";
type ByteSizeFormatOptions = {
  style: ByteSizeStyle;
  maxUnit: ByteSizeUnit;
  separator: "" | " ";
  fractionDigits: number | ((value: number, unit: ByteSizeUnit) => number | null);
  floorUnits?: readonly ByteSizeUnit[];
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
declare function formatByteSize(bytes: number, options: ByteSizeFormatOptions): string;
//#endregion
//#region src/infra/tcp-port.d.ts
declare const MAX_TCP_PORT = 65535;
/** Parse a positive TCP port or return null for absent/invalid input. */
declare function parseTcpPort(raw: unknown): number | null;
//#endregion
export { MAX_DATE_TIMESTAMP_MS, MAX_TCP_PORT, MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS, addTimerTimeoutGraceMs, asDateTimestampMs, asFiniteNumberInRange, asNonNegativeFiniteNumber, asPositiveFiniteNumber, asSafeIntegerInRange, clampPositiveTimerTimeoutMs, clampTimerTimeoutMs, finiteSecondsToTimerSafeMilliseconds, formatByteSize, isFutureDateTimestampMs, nonNegativeSecondsToSafeMilliseconds, parseDateFirstTimestampMs, parseDateStringTimestampMs, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, parseTcpPort, positiveSecondsToSafeMilliseconds, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveExpiresAtMsFromDurationOrEpoch, resolveExpiresAtMsFromDurationSeconds, resolveExpiresAtMsFromEpochSeconds, resolveIntegerOption, resolveNonNegativeIntegerOption, resolveOptionalIntegerOption, resolvePositiveTimerTimeoutMs, resolveTimerTimeoutMs, resolveTimestampMsToIsoString, timestampMsToIsoString };