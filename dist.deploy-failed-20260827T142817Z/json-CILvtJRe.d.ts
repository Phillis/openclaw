import fs from "node:fs";

//#region node_modules/@openclaw/fs-safe/dist/pinned-open.d.ts
type PinnedOpenSyncFailureReason = "path" | "validation" | "io";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/root-file.d.ts
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
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/text-atomic.d.ts
type WriteTextAtomicOptions = {
  mode?: number;
  dirMode?: number;
  trailingNewline?: boolean;
  /**
   * When false, skip the temp-file and parent-directory fsync calls while
   * preserving the temp-file replace/rename behavior.
   *
   * Defaults to true.
   */
  durable?: boolean;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/json.d.ts
type ReadJsonOptions = {
  maxBytes?: number;
};
declare function tryReadJsonSync<T = unknown>(pathname: string, options?: ReadJsonOptions): T | null;
declare function writeJsonSync(pathname: string, data: unknown): void;
declare class JsonFileReadError extends Error {
  readonly filePath: string;
  readonly reason: "read" | "parse";
  constructor(filePath: string, reason: "read" | "parse", cause: unknown);
}
type RootStructuredFileReadResult<T> = {
  ok: true;
  value: T;
  stat: fs.Stats;
  path: string;
  rootRealPath: string;
} | {
  ok: false;
  reason: "open";
  failure: RootFileOpenFailure;
} | {
  ok: false;
  reason: "invalid" | "parse";
  error: string;
};
type ReadRootStructuredFileSyncOptions<T> = {
  rootDir: string;
  rootRealPath?: string;
  relativePath: string;
  boundaryLabel: string;
  rejectHardlinks?: boolean;
  maxBytes?: number;
  parse: (raw: string) => unknown;
  validate?: (value: unknown) => value is T;
  invalidMessage?: string | ((relativePath: string) => string);
};
type ReadRootJsonSyncOptions = Omit<ReadRootStructuredFileSyncOptions<unknown>, "parse" | "validate" | "invalidMessage">;
declare function readRootStructuredFileSync<T>(options: ReadRootStructuredFileSyncOptions<T>): RootStructuredFileReadResult<T>;
declare function readRootJsonSync<T = unknown>(options: ReadRootJsonSyncOptions): RootStructuredFileReadResult<T>;
declare function readRootJsonObjectSync(options: ReadRootJsonSyncOptions): RootStructuredFileReadResult<Record<string, unknown>>;
declare function tryReadJson<T>(filePath: string, options?: ReadJsonOptions): Promise<T | null>;
declare function readJson<T>(filePath: string, options?: ReadJsonOptions): Promise<T>;
declare function readJsonIfExists<T>(filePath: string, options?: ReadJsonOptions): Promise<T | null>;
declare function readJsonSync<T = unknown>(filePath: string, options?: ReadJsonOptions): T;
type WriteJsonOptions = Pick<WriteTextAtomicOptions, "dirMode" | "durable" | "mode" | "trailingNewline">;
declare function writeJson(filePath: string, value: unknown, options?: WriteJsonOptions): Promise<void>;
//#endregion
export { readRootJsonObjectSync as a, tryReadJson as c, writeJsonSync as d, readJsonSync as i, tryReadJsonSync as l, readJson as n, readRootJsonSync as o, readJsonIfExists as r, readRootStructuredFileSync as s, JsonFileReadError as t, writeJson as u };