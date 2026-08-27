import { n as FileStoreSync, t as FileStore } from "../file-store-Cui6rzwB.js";
import { r as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-BdLSz-Cn.js";

//#region node_modules/@openclaw/fs-safe/dist/file-identity.d.ts
type FileIdentityStat = {
  dev: number | bigint;
  ino: number | bigint;
};
//#endregion
//#region src/infra/temp-download.d.ts
type TempDownloadTarget = {
  dir: string;
  path: string;
  file(fileName?: string): string;
  cleanup: () => Promise<void>;
  [Symbol.asyncDispose](): Promise<void>;
};
declare function sanitizeTempFileName(fileName: string): string;
/** Build a stable temp path shape while keeping caller-controlled text filename-safe. */
declare function buildRandomTempFilePath(params: {
  prefix: string;
  extension?: string;
  tmpDir?: string;
  now?: number;
  uuid?: string;
}): string;
declare function createTempDownloadTarget(params: {
  prefix: string;
  fileName?: string;
  tmpDir?: string;
}): Promise<TempDownloadTarget>;
/** Run with a private temp download path and always attempt workspace cleanup. */
declare function withTempDownloadPath<T>(params: {
  prefix: string;
  fileName?: string;
  tmpDir?: string;
}, fn: (tmpPath: string) => Promise<T>): Promise<T>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/temp-cleanup.d.ts
type TempPathIdentityReceipt = FileIdentityStat;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/private-temp-workspace.d.ts
type TempWorkspaceCleanupResult = "removed" | "missing" | "identity-mismatch";
type TempWorkspaceOptions = {
  rootDir: string;
  prefix: string;
  dirMode?: number;
  mode?: number;
};
type TempWorkspace = {
  dir: string;
  identity: TempPathIdentityReceipt;
  store: FileStore;
  path(fileName: string): string;
  write(fileName: string, data: string | Uint8Array): Promise<string>;
  writeText(fileName: string, data: string): Promise<string>;
  writeJson(fileName: string, data: unknown, options?: {
    trailingNewline?: boolean;
  }): Promise<string>;
  copyIn(fileName: string, sourcePath: string): Promise<string>;
  read(fileName: string): Promise<Buffer>;
  cleanup(): Promise<TempWorkspaceCleanupResult>;
  [Symbol.asyncDispose](): Promise<void>;
};
type TempWorkspaceSync = {
  dir: string;
  identity: TempPathIdentityReceipt;
  store: FileStoreSync;
  path(fileName: string): string;
  write(fileName: string, data: string | Uint8Array): string;
  writeText(fileName: string, data: string): string;
  writeJson(fileName: string, data: unknown, options?: {
    trailingNewline?: boolean;
  }): string;
  read(fileName: string): Buffer;
  cleanup(): TempWorkspaceCleanupResult;
  [Symbol.dispose](): void;
};
declare function tempWorkspace(options: TempWorkspaceOptions): Promise<TempWorkspace>;
declare function withTempWorkspace<T>(options: TempWorkspaceOptions, run: (workspace: TempWorkspace) => Promise<T>): Promise<T>;
declare function tempWorkspaceSync(options: TempWorkspaceOptions): TempWorkspaceSync;
declare function withTempWorkspaceSync<T>(options: TempWorkspaceOptions, run: (workspace: TempWorkspaceSync) => T): T;
//#endregion
export { type TempWorkspace, type TempWorkspaceOptions, type TempWorkspaceSync, buildRandomTempFilePath, createTempDownloadTarget, resolvePreferredOpenClawTmpDir, sanitizeTempFileName, tempWorkspace, tempWorkspaceSync, withTempDownloadPath, withTempWorkspace, withTempWorkspaceSync };