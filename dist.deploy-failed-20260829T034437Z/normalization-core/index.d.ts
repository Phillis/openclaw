import { _ as readStringValue, a as normalizeBoundedOptionalString, c as normalizeNullableString, d as normalizeOptionalStringifiedId, f as normalizeOptionalThreadValue, g as readNonEmptyStringPreservingWhitespace, h as readNonBlankString, i as lowercasePreservingWhitespace, l as normalizeOptionalLowercaseString, m as normalizeStringifiedOptionalString, n as hasNonEmptyString, o as normalizeFastMode, p as normalizeStringifiedEntries, r as localeLowercasePreservingWhitespace, s as normalizeLowercaseStringOrEmpty, t as FastMode, u as normalizeOptionalString, v as resolvePrimaryStringValue } from "../string-coerce-DsF9nZ3v.js";
import { a as toErrorObject, i as stringifyNonErrorCause, n as coerceErrorMessage, o as toStringifiedError, r as formatErrorMessage, s as toStructuredErrorObject, t as FormatErrorMessageOptions } from "../error-coercion-BrwX_4Ji.js";
import { parseBoolean } from "./boolean-coercion.js";
import { n as estimateStringChars, r as estimateTokensFromChars, t as CHARS_PER_TOKEN_ESTIMATE } from "../cjk-chars-NOoBHfZE.js";
import { expectDefined, first, last } from "./expect.js";
import { safeParseJson, safeParseJsonRecord } from "./json-coercion.js";
import { MAX_DATE_TIMESTAMP_MS, MAX_TIMER_TIMEOUT_MS, MAX_TIMER_TIMEOUT_SECONDS, UNIX_EPOCH_ISO_STRING, addTimerTimeoutGraceMs, asDateTimestampMs, asFiniteNumber, asFiniteNumberInRange, asNonNegativeFiniteNumber, asPositiveFiniteNumber, asPositiveSafeInteger, asSafeIntegerInRange, clampPositiveTimerTimeoutMs, clampTimerTimeoutMs, finiteSecondsToTimerSafeMilliseconds, isFutureDateTimestampMs, nonNegativeSecondsToSafeMilliseconds, parseDateFirstTimestampMs, parseDateStringTimestampMs, parseFiniteNumber, parseStrictFiniteNumber, parseStrictInteger, parseStrictNonNegativeInteger, parseStrictPositiveInteger, positiveSecondsToSafeMilliseconds, resolveDateTimestampMs, resolveExpiresAtMsFromDurationMs, resolveExpiresAtMsFromDurationOrEpoch, resolveExpiresAtMsFromDurationSeconds, resolveExpiresAtMsFromEpochSeconds, resolveIntegerOption, resolveNonNegativeIntegerOption, resolveOptionalIntegerOption, resolvePositiveTimerTimeoutMs, resolveTimerTimeoutMs, resolveTimestampMsToIsoString, timestampMsToIsoFileStamp, timestampMsToIsoString } from "./number-coercion.js";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord, l as isStringRecord, n as asNullableObjectRecord, o as asRecord, r as asNullableRecord, s as filterStringRecord, t as asNonArrayRecord, u as readStringField } from "../record-coerce-BBBs1yAw.js";
import { stableStringify } from "./stable-stringify.js";
import { filterStringEntries, normalizeArrayBackedTrimmedStringList, normalizeAtHashSlug, normalizeCsvOrLooseStringList, normalizeHyphenSlug, normalizeOptionalTrimmedStringList, normalizeSingleOrTrimmedStringList, normalizeSortedUniqueStringEntries, normalizeSortedUniqueTrimmedStringList, normalizeStringEntries, normalizeStringEntriesLower, normalizeTrimmedStringList, normalizeUniqueSingleOrTrimmedStringList, normalizeUniqueStringEntries, normalizeUniqueStringEntriesLower, normalizeUniqueTrimmedStringList, sortUniqueStrings, uniqueStrings, uniqueValues } from "./string-normalization.js";
import { i as truncateWithMarker, n as sliceUtf16Safe, r as truncateUtf16Safe, t as avoidTrailingHighSurrogateBreak } from "../utf16-slice-2zRSY-iT.js";
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