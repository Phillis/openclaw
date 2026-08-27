//#region packages/normalization-core/src/record-coerce.d.ts
/** Returns a non-array record or undefined. */
declare function asOptionalRecord(value: unknown): Record<string, unknown> | undefined;
/** Returns a non-array record or null. */
declare function asNullableRecord(value: unknown): Record<string, unknown> | null;
//#endregion
export { asOptionalRecord as n, asNullableRecord as t };