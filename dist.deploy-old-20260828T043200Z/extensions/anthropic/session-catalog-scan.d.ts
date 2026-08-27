import { Stats } from "node:fs";
//#region extensions/anthropic/session-catalog-scan.d.ts
declare const CLAUDE_CATALOG_IO_CONCURRENCY = 32;
type SafeSessionFile = {
  filePath: string;
  stat: Stats;
} | undefined;
type ClaudeProjectDirectorySnapshot = {
  directory: string;
  childNames: string[];
};
type ClaudeProjectsTreeSnapshot = {
  root: string;
  resolvedRoot?: string;
  projectDirectories: ClaudeProjectDirectorySnapshot[];
  treeStamp: string;
};
type ClaudeSessionScanContext = ClaudeProjectsTreeSnapshot & {
  complete: boolean;
  safeFiles: Map<string, Promise<SafeSessionFile>>;
};
declare function mapConcurrent<T, R>(values: T[], limit: number, mapper: (value: T) => Promise<R>): Promise<R[]>;
declare function setBoundedCache<K, V>(cache: Map<K, V>, key: K, value: V, maxEntries: number): void;
declare function safeSessionFileForScan(context: ClaudeSessionScanContext, candidate: string, sessionId: string): Promise<SafeSessionFile>;
declare function readJsonFile(filePath: string, options?: {
  onIoFailure?: () => void;
}): Promise<unknown>;
declare function childDirectories(root: string): Promise<string[]>;
declare function projectsDir(homeDir: string, configDir?: string): string;
declare function readProjectsTreeSnapshot(root: string): Promise<ClaudeProjectsTreeSnapshot>;
declare function desktopSessionStoreAvailable(homeDir: string): Promise<boolean>;
declare function desktopSessionsDir(homeDir: string): string;
declare function currentHomeDir(env?: NodeJS.ProcessEnv): string;
declare function configuredClaudeConfigDir(env?: NodeJS.ProcessEnv): string | undefined;
declare function gatewayClaudeScanOptions(allowProcessHomeFallback?: boolean): {
  configDir?: string;
  includeDesktop: boolean;
};
//#endregion
export { CLAUDE_CATALOG_IO_CONCURRENCY, ClaudeProjectsTreeSnapshot, ClaudeSessionScanContext, childDirectories, configuredClaudeConfigDir, currentHomeDir, desktopSessionStoreAvailable, desktopSessionsDir, gatewayClaudeScanOptions, mapConcurrent, projectsDir, readJsonFile, readProjectsTreeSnapshot, safeSessionFileForScan, setBoundedCache };