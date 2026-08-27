//#region src/infra/format-time/format-duration.d.ts
type FormatDurationCompactOptions = {
  /** Show year units instead of folding them into days. Default: false */
  showYears?: boolean;
  /** Add space between units: "2m 5s" instead of "2m5s". Default: false */
  spaced?: boolean;
};
/**
 * Compact compound duration: "500ms", "45s", "2m5s", "1h30m".
 * With `spaced`: "45s", "2m 5s", "1h 30m".
 * Omits trailing zero components: "1m" not "1m 0s", "2h" not "2h 0m".
 * Returns undefined for null/undefined/non-finite/non-positive input.
 */
declare function formatDurationCompact(ms?: number | null, options?: FormatDurationCompactOptions): string | undefined;
//#endregion
//#region src/infra/format-time/format-datetime.d.ts
/**
 * Centralized date/time formatting utilities.
 *
 * All formatters are timezone-aware, using Intl.DateTimeFormat.
 * Consolidates duplicated formatUtcTimestamp / formatZonedTimestamp / resolveExplicitTimezone
 * that previously lived in envelope.ts and session-updates.ts.
 */
/**
 * Validate an IANA timezone string. Returns the string if valid, undefined otherwise.
 */
declare function resolveTimezone(value: string): string | undefined;
type FormatTimestampOptions = {
  /** Include seconds in the output. Default: false */
  displaySeconds?: boolean;
};
type FormatZonedTimestampOptions = FormatTimestampOptions & {
  /** IANA timezone string (e.g., 'America/New_York'). Default: system timezone */
  timeZone?: string;
};
/**
 * Format a Date as a UTC timestamp string.
 *
 * Without seconds: `2024-01-15T14:30Z`
 * With seconds:    `2024-01-15T14:30:05Z`
 */
declare function formatUtcTimestamp(date: Date, options?: FormatTimestampOptions): string;
/**
 * Format a Date with timezone display using Intl.DateTimeFormat.
 *
 * Without seconds: `2024-01-15 14:30 EST`
 * With seconds:    `2024-01-15 14:30:05 EST`
 *
 * Returns undefined if Intl formatting fails.
 */
declare function formatZonedTimestamp(date: Date, options?: FormatZonedTimestampOptions): string | undefined;
//#endregion
export { formatDurationCompact, formatUtcTimestamp, formatZonedTimestamp, resolveTimezone };