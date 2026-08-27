//#region node_modules/@openclaw/fs-safe/dist/root-walk.d.ts
type RootWalkSymlinkPolicy = "skip" | "follow-within-root";
type RootWalkLimitBehavior = "truncate" | "throw";
type RootWalkDirectoryErrorBehavior = "throw" | "skip-and-report";
type RootWalkEntryFilterResult = "include" | "skip" | "skip-subtree";
type RootWalkDataEntryKind = "file" | "directory" | "other";
type RootWalkDataEntry = {
  relativePath: string;
  kind: RootWalkDataEntryKind;
  size: number;
};
type RootWalkEntry = RootWalkDataEntry | {
  relativePath: string;
  kind: "truncated";
  size: 0;
} | {
  relativePath: string;
  kind: "directory-error";
  size: 0;
  error: unknown;
};
type RootWalkEntryFilter = (entry: RootWalkDataEntry) => RootWalkEntryFilterResult;
type RootWalkOptions = {
  maxDepth?: number;
  maxEntries?: number;
  symlinkPolicy: RootWalkSymlinkPolicy;
  signal?: AbortSignal;
  limitBehavior?: RootWalkLimitBehavior;
  entryFilter?: RootWalkEntryFilter;
  onDirectoryError?: RootWalkDirectoryErrorBehavior;
};
//#endregion
export { RootWalkOptions as n, RootWalkEntry as t };