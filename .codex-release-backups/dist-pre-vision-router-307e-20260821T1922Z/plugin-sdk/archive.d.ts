import { a as ArchiveExtractLimits, i as ARCHIVE_LIMIT_ERROR_CODE, n as ExtractArchiveOptions, o as ArchiveLimitError, r as ArchiveEntryKind, s as ArchiveKind, t as extractArchive } from "../archive-BkMPUm4U.js";

//#region node_modules/@openclaw/fs-safe/dist/archive-read.d.ts
declare function readArchiveEntry(archivePath: string, entryPath: string, options: {
  maxBytes: number;
  kind?: ArchiveKind;
}): Promise<Buffer>;
//#endregion
export { ARCHIVE_LIMIT_ERROR_CODE, type ArchiveEntryKind, type ArchiveExtractLimits, ArchiveLimitError, type ExtractArchiveOptions, extractArchive, readArchiveEntry };