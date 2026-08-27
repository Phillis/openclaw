//#region packages/normalization-core/src/string-coerce.d.ts
/** Trims string input and returns undefined for non-strings or empty strings. */
declare function normalizeOptionalString(value: unknown): string | undefined;
type FastMode = boolean | "auto";
//#endregion
export { normalizeOptionalString as n, FastMode as t };