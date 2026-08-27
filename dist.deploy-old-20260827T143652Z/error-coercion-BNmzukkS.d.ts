//#region packages/normalization-core/src/error-coercion.d.ts
type FormatErrorMessageOptions = {
  redact: (text: string) => string;
};
/** Formats unknown errors with cause details, structured codes, and secret redaction. */
declare function formatErrorMessage(value: unknown, options: FormatErrorMessageOptions): string;
/**
 * Normalizes an unknown thrown value into an Error. Non-Error objects become
 * the `cause` and have their enumerable fields copied so structured details
 * (codes, statuses) survive the coercion.
 */
declare function toErrorObject(value: unknown, fallbackMessage: string): Error;
/** Preserves structured details while isolating hostile object field access. */
declare function toStructuredErrorObject(value: unknown): Error;
/** Preserves Error values and stringifies every other value into a new Error. */
declare function toStringifiedError(value: unknown): Error;
/** Reads Error messages unchanged and stringifies every other value. */
declare function coerceErrorMessage(value: unknown): string;
/** Renders a non-Error cause as useful text without throwing. */
declare function stringifyNonErrorCause(value: unknown): string;
//#endregion
export { toErrorObject as a, stringifyNonErrorCause as i, coerceErrorMessage as n, toStringifiedError as o, formatErrorMessage as r, toStructuredErrorObject as s, FormatErrorMessageOptions as t };