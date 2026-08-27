//#region node_modules/@openclaw/fs-safe/dist/archive-kind.d.ts
type ArchiveKind = "tar" | "tar-bzip2" | "tar-zstd" | "zip";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-limits.d.ts
type ArchiveExtractLimits = {
  /**
   * Max archive file bytes (compressed).
   */
  maxArchiveBytes?: number; /** Max number of extracted entries (files + dirs). */
  maxEntries?: number; /** Max extracted bytes (sum of all files). */
  maxExtractedBytes?: number; /** Max extracted bytes for a single file entry. */
  maxEntryBytes?: number; /** Max bytes in one PAX, GNU long-name, or related TAR metadata entry. */
  maxMetaEntryBytes?: number; /** Max path components in one extracted entry after stripComponents. */
  maxEntryPathComponents?: number;
};
declare const ARCHIVE_LIMIT_ERROR_CODE: {
  readonly ARCHIVE_SIZE_EXCEEDS_LIMIT: "archive-size-exceeds-limit";
  readonly ENTRY_COUNT_EXCEEDS_LIMIT: "archive-entry-count-exceeds-limit";
  readonly ENTRY_EXTRACTED_SIZE_EXCEEDS_LIMIT: "archive-entry-extracted-size-exceeds-limit";
  readonly EXTRACTED_SIZE_EXCEEDS_LIMIT: "archive-extracted-size-exceeds-limit";
  readonly META_ENTRY_SIZE_EXCEEDS_LIMIT: "archive-meta-entry-size-exceeds-limit";
  readonly MANIFEST_SIZE_EXCEEDS_LIMIT: "archive-manifest-size-exceeds-limit";
  readonly ENTRY_PATH_COMPONENTS_EXCEEDS_LIMIT: "archive-entry-path-components-exceeds-limit";
};
type ArchiveLimitErrorCode = (typeof ARCHIVE_LIMIT_ERROR_CODE)[keyof typeof ARCHIVE_LIMIT_ERROR_CODE];
declare class ArchiveLimitError extends Error {
  readonly code: ArchiveLimitErrorCode;
  constructor(code: ArchiveLimitErrorCode);
}
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-policy.d.ts
type ArchiveEntryKind = "file" | "directory" | "symlink" | "other";
type ArchiveEntryModePolicy = "clamp" | "preserve";
type ArchiveFilteredEntryPolicy = "reject-archive" | "skip-entry";
type ArchiveEntryFilter = (entry: {
  path: string;
  kind: ArchiveEntryKind;
  size: number;
}) => "extract" | "skip";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive-options.d.ts
type ArchiveLogger = {
  info?: (message: string) => void;
  warn?: (message: string) => void;
};
type ExtractArchiveOptions = {
  archivePath: string;
  destDir: string;
  timeoutMs: number;
  kind?: ArchiveKind;
  stripComponents?: number;
  tarGzip?: boolean;
  limits?: ArchiveExtractLimits;
  logger?: ArchiveLogger;
  entryModes?: ArchiveEntryModePolicy;
  entryFilter?: ArchiveEntryFilter;
  onFiltered?: ArchiveFilteredEntryPolicy;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/archive.d.ts
declare function extractArchive(params: ExtractArchiveOptions): Promise<void>;
//#endregion
export { ArchiveExtractLimits as a, ARCHIVE_LIMIT_ERROR_CODE as i, ExtractArchiveOptions as n, ArchiveLimitError as o, ArchiveEntryKind as r, ArchiveKind as s, extractArchive as t };