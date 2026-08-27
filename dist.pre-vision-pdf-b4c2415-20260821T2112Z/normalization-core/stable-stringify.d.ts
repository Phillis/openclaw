//#region packages/normalization-core/src/stable-stringify.d.ts
/**
 * Stable stringify helper.
 * Serializes arbitrary values with deterministic key ordering and explicit
 * handling for errors, binary data, bigint, non-finite numbers, and cycles.
 */
type StableStringNormalizer = (value: string) => string;
/** Deterministically stringifies values, optionally normalizing strings before key ordering. */
declare function stableStringify(value: unknown, normalizeString?: StableStringNormalizer): string;
//#endregion
export { stableStringify };