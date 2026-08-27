//#region packages/normalization-core/src/string-normalization.d.ts
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
/** Normalizes string entries and lowercases each retained value. */
declare function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>): string[];
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
declare function normalizeHyphenSlug(raw?: string | null): string;
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
declare function normalizeAtHashSlug(raw?: string | null): string;
//#endregion
export { normalizeAtHashSlug, normalizeHyphenSlug, normalizeStringEntries, normalizeStringEntriesLower };