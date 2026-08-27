//#region packages/normalization-core/src/string-normalization.d.ts
/** Retains runtime string entries from arrays without normalizing their contents. */
declare function filterStringEntries(value: unknown): string[];
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
/** Normalizes string entries and lowercases each retained value. */
declare function normalizeStringEntriesLower(list?: ReadonlyArray<unknown>): string[];
/** Returns first-seen unique values while preserving insertion order. */
declare function uniqueValues<T>(values: Iterable<T>): T[];
/** Returns first-seen unique strings while preserving insertion order. */
declare function uniqueStrings(values: Iterable<string>): string[];
/** Returns unique strings sorted with stable ASCII comparison. */
declare function sortUniqueStrings(values: Iterable<string>): string[];
/** Normalizes entries, removes duplicates, and preserves first-seen order. */
declare function normalizeUniqueStringEntries(values?: Iterable<unknown>): string[];
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
declare function normalizeUniqueStringEntriesLower(values?: Iterable<unknown>): string[];
/** Normalizes entries, removes duplicates, and returns sorted output. */
declare function normalizeSortedUniqueStringEntries(values?: Iterable<unknown>): string[];
/** Normalizes array-backed string lists and rejects non-array input as empty. */
declare function normalizeTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list and removes duplicates. */
declare function normalizeUniqueTrimmedStringList(value: unknown): string[];
/** Normalizes an array-backed string list, removes duplicates, and sorts it. */
declare function normalizeSortedUniqueTrimmedStringList(value: unknown): string[];
/** Returns undefined instead of an empty normalized array-backed string list. */
declare function normalizeOptionalTrimmedStringList(value: unknown): string[] | undefined;
/** Returns undefined for non-arrays but preserves an empty array for explicit arrays. */
declare function normalizeArrayBackedTrimmedStringList(value: unknown): string[] | undefined;
/** Normalizes either a single string-like value or an array-backed string list. */
declare function normalizeSingleOrTrimmedStringList(value: unknown): string[];
/** Normalizes single-or-array string input and removes duplicates. */
declare function normalizeUniqueSingleOrTrimmedStringList(value: unknown): string[];
/** Parses either array entries or comma-separated string entries into trimmed values. */
declare function normalizeCsvOrLooseStringList(value: unknown): string[];
/** Normalizes user-facing names into permissive lowercase slugs that may keep #/@/._+. */
declare function normalizeHyphenSlug(raw?: string | null): string;
/** Normalizes @/#-prefixed channel names into strict lowercase hyphen slugs without the prefix. */
declare function normalizeAtHashSlug(raw?: string | null): string;
//#endregion
export { sortUniqueStrings as _, normalizeHyphenSlug as a, normalizeSortedUniqueStringEntries as c, normalizeStringEntriesLower as d, normalizeTrimmedStringList as f, normalizeUniqueTrimmedStringList as g, normalizeUniqueStringEntriesLower as h, normalizeCsvOrLooseStringList as i, normalizeSortedUniqueTrimmedStringList as l, normalizeUniqueStringEntries as m, normalizeArrayBackedTrimmedStringList as n, normalizeOptionalTrimmedStringList as o, normalizeUniqueSingleOrTrimmedStringList as p, normalizeAtHashSlug as r, normalizeSingleOrTrimmedStringList as s, filterStringEntries as t, normalizeStringEntries as u, uniqueStrings as v, uniqueValues as y };