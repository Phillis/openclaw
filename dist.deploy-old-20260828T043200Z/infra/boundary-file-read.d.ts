import fs from "node:fs";
//#region node_modules/@openclaw/fs-safe/dist/root-path.d.ts
type RootPathAliasPolicy = {
  allowFinalSymlinkForUnlink?: boolean;
  allowFinalHardlinkForUnlink?: boolean;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/path-policy.d.ts
type PathAliasPolicy = RootPathAliasPolicy;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/pinned-open.d.ts
type PinnedOpenSyncFailureReason = "path" | "validation" | "io";
type PinnedOpenSyncAllowedType = "file" | "directory";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-file.d.ts
type BoundaryReadFs = Pick<typeof fs, "closeSync" | "constants" | "fstatSync" | "lstatSync" | "openSync" | "readFileSync" | "realpathSync">;
type RootFileOpenFailureReason = PinnedOpenSyncFailureReason | "validation";
type RootFileOpenResult = {
  ok: true;
  path: string;
  fd: number;
  stat: fs.Stats;
  rootRealPath: string;
} | {
  ok: false;
  reason: RootFileOpenFailureReason;
  error?: unknown;
};
type RootFileOpenFailure = Extract<RootFileOpenResult, {
  ok: false;
}>;
type OpenRootFileSyncParams = {
  absolutePath: string;
  rootPath: string;
  boundaryLabel: string;
  rootRealPath?: string;
  maxBytes?: number;
  rejectHardlinks?: boolean;
  rejectSymlinks?: boolean;
  allowedType?: PinnedOpenSyncAllowedType;
  skipLexicalRootCheck?: boolean;
  ioFs?: BoundaryReadFs;
};
type OpenRootFileParams = OpenRootFileSyncParams & {
  aliasPolicy?: PathAliasPolicy;
};
declare function canUseRootFileOpen(ioFs: typeof fs): boolean;
declare function openRootFileSync(params: OpenRootFileSyncParams): RootFileOpenResult;
declare function matchRootFileOpenFailure<T>(failure: RootFileOpenFailure, handlers: {
  path?: (failure: RootFileOpenFailure) => T;
  validation?: (failure: RootFileOpenFailure) => T;
  io?: (failure: RootFileOpenFailure) => T;
  fallback: (failure: RootFileOpenFailure) => T;
}): T;
declare function openRootFile(params: OpenRootFileParams): Promise<RootFileOpenResult>;
//#endregion
//#region src/infra/boundary-file-read.d.ts
/**
 * Opens a root-scoped file after canonicalizing symlink parents. fs-safe
 * rejects every symlink path component by default; the workspace contract
 * follows contained parent symlinks (directory aliases) while final-symlink
 * targets and out-of-root escapes stay rejected by openRootFile itself.
 */
declare function openRootFileFollowingParents(params: OpenRootFileParams): Promise<RootFileOpenResult>;
declare function isRootFileMissingFailure(failure: RootFileOpenFailure): boolean;
/**
 * Describes a root-scoped open failure without collapsing every cause into a
 * containment violation. Only `validation` means the path failed the boundary or
 * alias check; a missing artifact or an unreadable descriptor is an ordinary
 * operational state, and reporting those as escapes sends operators hunting a
 * security incident that never happened.
 */
declare function describeRootFileOpenFailure(params: {
  failure: RootFileOpenFailure;
  subject: string;
  boundaryLabel: string;
  filePath: string;
}): string;
/** Read a pinned descriptor without changing OpenClaw's user-facing overflow error. */
declare function readFileDescriptorBounded(fd: number, maxBytes: number): Promise<Buffer>;
/** Synchronous variant for callers that own a pinned descriptor. */
declare function readFileDescriptorBoundedSync(fd: number, maxBytes: number): Buffer;
//#endregion
export { type RootFileOpenFailure, type RootFileOpenResult, canUseRootFileOpen, describeRootFileOpenFailure, isRootFileMissingFailure, matchRootFileOpenFailure, openRootFile, openRootFileFollowingParents, openRootFileSync, readFileDescriptorBounded, readFileDescriptorBoundedSync };