//#region packages/normalization-core/src/json-coercion.d.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
declare function safeParseJson(value: string): unknown;
/** Parses JSON into a non-array record, returning undefined for every other result. */
declare function safeParseJsonRecord(value: string): Record<string, unknown> | undefined;
//#endregion
export { safeParseJson, safeParseJsonRecord };