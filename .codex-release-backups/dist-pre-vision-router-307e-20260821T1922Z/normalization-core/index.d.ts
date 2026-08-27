import { _ as readStringValue, a as normalizeBoundedOptionalString, c as normalizeNullableString, d as normalizeOptionalStringifiedId, f as normalizeOptionalThreadValue, g as readNonEmptyStringPreservingWhitespace, h as readNonBlankString, i as lowercasePreservingWhitespace, l as normalizeOptionalLowercaseString, m as normalizeStringifiedOptionalString, n as hasNonEmptyString, o as normalizeFastMode, p as normalizeStringifiedEntries, r as localeLowercasePreservingWhitespace, s as normalizeLowercaseStringOrEmpty, t as FastMode, u as normalizeOptionalString, v as resolvePrimaryStringValue } from "../string-coerce-DsF9nZ3v.js";
import { n as estimateStringChars, r as estimateTokensFromChars, t as CHARS_PER_TOKEN_ESTIMATE } from "../cjk-chars-NOoBHfZE.js";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, l as isStringRecord, n as asNullableObjectRecord, o as asRecord, r as asNullableRecord, s as filterStringRecord, t as asNonArrayRecord, u as readStringField } from "../record-coerce-BBBs1yAw.js";
import { i as truncateWithMarker, n as sliceUtf16Safe, r as truncateUtf16Safe, t as avoidTrailingHighSurrogateBreak } from "../utf16-slice-2zRSY-iT.js";
import { a as toErrorObject, i as stringifyNonErrorCause, n as coerceErrorMessage, o as toStringifiedError, r as formatErrorMessage, s as toStructuredErrorObject, t as FormatErrorMessageOptions } from "../error-coercion-BNmzukkS.js";
import { A as resolveExpiresAtMsFromEpochSeconds, C as parseStrictNonNegativeInteger, D as resolveExpiresAtMsFromDurationMs, E as resolveDateTimestampMs, F as resolveTimerTimeoutMs, I as resolveTimestampMsToIsoString, L as timestampMsToIsoFileStamp, M as resolveNonNegativeIntegerOption, N as resolveOptionalIntegerOption, O as resolveExpiresAtMsFromDurationOrEpoch, P as resolvePositiveTimerTimeoutMs, R as timestampMsToIsoString, S as parseStrictInteger, T as positiveSecondsToSafeMilliseconds, _ as nonNegativeSecondsToSafeMilliseconds, a as addTimerTimeoutGraceMs, b as parseFiniteNumber, c as asFiniteNumberInRange, d as asPositiveSafeInteger, f as asSafeIntegerInRange, g as isFutureDateTimestampMs, h as finiteSecondsToTimerSafeMilliseconds, i as UNIX_EPOCH_ISO_STRING, j as resolveIntegerOption, k as resolveExpiresAtMsFromDurationSeconds, l as asNonNegativeFiniteNumber, m as clampTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS, o as asDateTimestampMs, p as clampPositiveTimerTimeoutMs, r as MAX_TIMER_TIMEOUT_SECONDS, s as asFiniteNumber, t as MAX_DATE_TIMESTAMP_MS, u as asPositiveFiniteNumber, v as parseDateFirstTimestampMs, w as parseStrictPositiveInteger, x as parseStrictFiniteNumber, y as parseDateStringTimestampMs } from "../number-coercion-BP2p4ndn.js";
import { _ as sortUniqueStrings, a as normalizeHyphenSlug, c as normalizeSortedUniqueStringEntries, d as normalizeStringEntriesLower, f as normalizeTrimmedStringList, g as normalizeUniqueTrimmedStringList, h as normalizeUniqueStringEntriesLower, i as normalizeCsvOrLooseStringList, l as normalizeSortedUniqueTrimmedStringList, m as normalizeUniqueStringEntries, n as normalizeArrayBackedTrimmedStringList, o as normalizeOptionalTrimmedStringList, p as normalizeUniqueSingleOrTrimmedStringList, r as normalizeAtHashSlug, s as normalizeSingleOrTrimmedStringList, t as filterStringEntries, u as normalizeStringEntries, v as uniqueStrings, y as uniqueValues } from "../string-normalization-DSYgOoGk.js";
import { parseBoolean } from "./boolean-coercion.js";
import { expectDefined, first, last } from "./expect.js";
import { safeParseJson, safeParseJsonRecord } from "./json-coercion.js";
import { stableStringify } from "./stable-stringify.js";

//#region packages/normalization-core/src/balanced-json.d.ts
type JsonOpeningDelimiter = "{" | "[";
type BalancedJsonFragment = {
  json: string;
  startIndex: number;
  endIndex: number;
};
/** Extracts the first balanced JSON object/array from text. */
declare function extractBalancedJsonPrefix(raw: string, opts?: {
  openers?: readonly JsonOpeningDelimiter[];
}): BalancedJsonFragment | null;
/** Extracts every balanced JSON object/array fragment from arbitrary text. */
declare function extractBalancedJsonFragments(raw: string, opts?: {
  openers?: readonly JsonOpeningDelimiter[];
}): BalancedJsonFragment[];
//#endregion
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
type RelativeTimeUnit = "second" | "minute" | "hour" | "day";
/** Buckets an absolute duration while preserving nested display rounding at unit boundaries. */
declare function bucketRelativeTimeMs(durationMs: number): {
  value: number;
  unit: RelativeTimeUnit;
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
declare function formatByteSize(bytes: number, options: ByteSizeFormatOptions): string;
//#endregion
//#region packages/normalization-core/src/text-decoding.d.ts
type DecodeTextPrefixOptions = {
  encoding?: string;
  truncated?: boolean;
};
/** Decodes a byte prefix without inventing a replacement character for a cut trailing sequence. */
declare function decodeTextPrefix(bytes: Uint8Array, options?: DecodeTextPrefixOptions): string;
//#endregion
export { CHARS_PER_TOKEN_ESTIMATE, DecodeTextPrefixOptions, FastMode, FormatErrorMessageOptions, MAX_DATE_TIMESTAMP_MS, MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS, RelativeTimeUnit, UNIX_EPOCH_ISO_STRING, addTimerTimeoutGraceMs, asDateTimestampMs, asFiniteNumber, asFiniteNumberInRange, asNonArrayRecord, asNonNegativeFiniteNumber, asNullableObjectRecord, asNullableRecord, asOptionalObjectRecord, asOptionalRecord, asPositiveFiniteNumber, asPositiveSafeInteger, asRecord, asSafeIntegerInRange, avoidTrailingHighSurrogateBreak, bucketRelativeTimeMs, clampPositiveTimerTimeoutMs, clampTimerTimeoutMs, coerceErrorMessage, decodeTextPrefix, estimateStringChars, estimateTokensFromChars, expectDefined, extractBalancedJsonFragments, extractBalancedJsonPrefix, filterStringEntries, filterStringRecord, finiteSecondsToTimerSafeMilliseconds, first, formatByteSize, formatErrorMessage, hasNonEmptyString, isFutureDateTimestampMs, isRecord, isStringRecord, last, localeLowercasePreservingWhitespace, lowercasePreservingWhitespace, nonNegativeSecondsToSafeMilliseconds, normalizeArrayBackedTrimmedStringList, normalizeAtHashSlug, normalizeBoundedOptionalString, normalizeCsvOrLooseStringList, normalizeFastMode, normalizeHyphenSlug, normalizeLowercaseStringOrEmpty, normalizeNullableString, normalizeOptionalLowercaseString, normalizeOptionalString, normalizeOptionalStringifiedId, normalizeOptionalThreadValue, normalizeOptionalTrimmedStringList, normalizeSingleOrTrimmedStringList, normalizeSortedUniqueStringEntries, normalizeSortedUniqueTrimmedStringList, normalizeStringEntries, normalizeStringEntriesLower, normalizeStringifiedEntries, normalizeStringifiedOptionalString, normalizeTrimmedStringList, normalizeUniqueSingleOrTrimmedStringList, normalizeUniqueStringEntries, normalizeUniqueStringEntriesLower, normalizeUniqueTrimmedStringList, parseBoolean, parseDateFirstTimestampMs, parseDateStringTimestampMs, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, positiveSecondsToSafeMilliseconds, readNonBlankString, readNonEmptyStringPreservingWhitespace, readStringField, readStringValue, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveExpiresAtMsFromDurationOrEpoch, resolveExpiresAtMsFromDurationSeconds, resolveExpiresAtMsFromEpochSeconds, resolveIntegerOption, resolveNonNegativeIntegerOption, resolveOptionalIntegerOption, resolvePositiveTimerTimeoutMs, resolvePrimaryStringValue, resolveTimerTimeoutMs, resolveTimestampMsToIsoString, safeParseJson, safeParseJsonRecord, sliceUtf16Safe, sortUniqueStrings, stableStringify, stringifyNonErrorCause, timestampMsToIsoFileStamp, timestampMsToIsoString, toErrorObject, toStringifiedError, toStructuredErrorObject, truncateUtf16Safe, truncateWithMarker, uniqueStrings, uniqueValues };