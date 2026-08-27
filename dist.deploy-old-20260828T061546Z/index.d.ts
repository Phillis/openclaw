import { a as SessionEntry } from "./types-B7fPbrj5.js";
import { u as applyTemplate$1 } from "./templating-BkMhYZzX.js";
import { A as RuntimeEnv } from "./manifest-registry-BTc0dNop.js";
import { st as loadConfig$1 } from "./config-7RZyYa4d.js";
import { a as deriveSessionKey$1, d as CliDeps, f as runExec$2, i as SessionDiskBudgetSweepResult, m as runCommandWithTimeout$2, o as resolveSessionKey$1, s as resolveSessionStorePathCore } from "./web-media-B_-fi4t2.js";
import { r as SessionMaintenanceWarning, t as ResolvedSessionMaintenanceConfig } from "./store-maintenance-jmXr4vd4.js";
import { t as getReplyFromConfig$2 } from "./get-reply-CDywEitd.js";
//#region src/utils.d.ts
/** Normalizes phone-like input into the loose E.164 shape used by channel helpers. */
declare function normalizeE164$1(number: string): string;
//#endregion
//#region src/cli/deps.d.ts
declare function createDefaultDeps$1(): CliDeps;
//#endregion
//#region src/cli/prompt.d.ts
/** Prompts for yes/no input, honoring global `--yes` before opening stdin. */
declare function promptYesNo$2(question: string, defaultYes?: boolean): Promise<boolean>;
//#endregion
//#region src/cli/wait.d.ts
declare function waitForever$1(): Promise<void>;
//#endregion
//#region src/infra/binaries.d.ts
declare function ensureBinary$2(name: string, exec?: typeof runExec$2, runtime?: RuntimeEnv): Promise<void>;
//#endregion
//#region src/infra/ports.d.ts
declare class PortInUseError$1 extends Error {
  port: number;
  details?: string;
  constructor(port: number, details?: string);
}
declare function describePortOwner$1(port: number): Promise<string | undefined>;
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
declare function ensurePortAvailable$1(port: number, host?: string, signal?: AbortSignal): Promise<void>;
declare function handlePortError$1(err: unknown, port: number, context: string, runtime?: RuntimeEnv): Promise<never>;
//#endregion
//#region src/config/sessions/store-maintenance-operations.d.ts
type SessionMaintenanceApplyReport = {
  mode: ResolvedSessionMaintenanceConfig["mode"];
  beforeCount: number;
  afterCount: number;
  archived: number;
  modelRunPruned: number;
  pruned: number;
  capped: number;
  diskBudget: SessionDiskBudgetSweepResult | null;
};
//#endregion
//#region src/infra/state-migrations.legacy-session-store.d.ts
type LegacySessionStoreLoadOptions = {
  skipCache?: boolean;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  runMaintenance?: boolean;
  clone?: boolean;
  hydrateSkillPromptRefs?: boolean;
};
type LegacySessionStoreSaveOptions = {
  skipMaintenance?: boolean;
  takeCacheOwnership?: boolean;
  activeSessionKey?: string;
  onWarn?: (warning: SessionMaintenanceWarning) => void | Promise<void>;
  onMaintenanceApplied?: (report: SessionMaintenanceApplyReport) => void | Promise<void>;
  maintenanceOverride?: Partial<ResolvedSessionMaintenanceConfig>;
  maintenanceConfig?: ResolvedSessionMaintenanceConfig;
  singleEntryPersistence?: {
    sessionKey: string;
    entry: SessionEntry;
  };
  requireWriteSuccess?: boolean;
};
declare function loadLegacySessionStore(storePath: string, options?: LegacySessionStoreLoadOptions): Record<string, SessionEntry>;
declare function saveLegacySessionStore(storePath: string, store: Record<string, SessionEntry>, options?: LegacySessionStoreSaveOptions): Promise<void>;
//#endregion
//#region src/plugins/runtime/runtime-web-channel-plugin.d.ts
type WebChannelHeavyRuntimeModule = {
  loginWeb: (verbose: boolean, waitForConnection?: (sock: unknown) => Promise<void>, runtime?: unknown, accountId?: string) => Promise<void>;
  monitorWebChannel: (...args: unknown[]) => Promise<unknown>;
  monitorWebInbox: (...args: unknown[]) => Promise<unknown>;
  startWebLoginWithQr: (...args: unknown[]) => Promise<unknown>;
  waitForWebLogin: (...args: unknown[]) => Promise<unknown>;
  extractText: (...args: unknown[]) => unknown;
};
/** Starts web-channel monitoring through the heavy runtime API. */
declare function monitorWebChannel$2(...args: Parameters<WebChannelHeavyRuntimeModule["monitorWebChannel"]>): ReturnType<WebChannelHeavyRuntimeModule["monitorWebChannel"]>;
declare namespace library_d_exports {
  export { PortInUseError$1 as PortInUseError, applyTemplate$1 as applyTemplate, createDefaultDeps$1 as createDefaultDeps, deriveSessionKey$1 as deriveSessionKey, describePortOwner$1 as describePortOwner, ensureBinary$1 as ensureBinary, ensurePortAvailable$1 as ensurePortAvailable, getReplyFromConfig$1 as getReplyFromConfig, handlePortError$1 as handlePortError, loadConfig$1 as loadConfig, loadLegacySessionStore as loadSessionStore, monitorWebChannel$1 as monitorWebChannel, normalizeE164$1 as normalizeE164, promptYesNo$1 as promptYesNo, resolveSessionKey$1 as resolveSessionKey, resolveSessionStorePathCore as resolveStorePath, runCommandWithTimeout$1 as runCommandWithTimeout, runExec$1 as runExec, saveSessionStore$1 as saveSessionStore, waitForever$1 as waitForever };
}
type GetReplyFromConfig = typeof getReplyFromConfig$2;
type PromptYesNo = typeof promptYesNo$2;
type EnsureBinary = typeof ensureBinary$2;
type RunExec = typeof runExec$2;
type RunCommandWithTimeout = typeof runCommandWithTimeout$2;
type MonitorWebChannel = typeof monitorWebChannel$2;
declare const getReplyFromConfig$1: GetReplyFromConfig;
declare const promptYesNo$1: PromptYesNo;
declare const ensureBinary$1: EnsureBinary;
declare const runExec$1: RunExec;
declare const runCommandWithTimeout$1: RunCommandWithTimeout;
declare const monitorWebChannel$1: MonitorWebChannel;
/**
 * @deprecated Legacy sessions.json compatibility for package-root consumers.
 * Use SQLite-backed session APIs. Remove after 2026-10-12, once the v2026.7.x
 * upgrade window no longer requires the legacy doctor importer.
 */
declare function saveSessionStore$1(storePath: string, store: Parameters<typeof saveLegacySessionStore>[1], options?: LegacySessionStoreSaveOptions): Promise<void>;
//#endregion
//#region src/index.d.ts
type LegacyCliDeps = {
  runCli: (argv: string[], options?: {
    retainConsoleRoutingUntilProcessExit?: boolean;
  }) => Promise<void>;
};
type LibraryExports = typeof library_d_exports;
declare let applyTemplate: LibraryExports["applyTemplate"];
declare let createDefaultDeps: LibraryExports["createDefaultDeps"];
declare let deriveSessionKey: LibraryExports["deriveSessionKey"];
declare let describePortOwner: LibraryExports["describePortOwner"];
declare let ensureBinary: LibraryExports["ensureBinary"];
declare let ensurePortAvailable: LibraryExports["ensurePortAvailable"];
declare let getReplyFromConfig: LibraryExports["getReplyFromConfig"];
declare let handlePortError: LibraryExports["handlePortError"];
declare let loadConfig: LibraryExports["loadConfig"];
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
declare let loadSessionStore: LibraryExports["loadSessionStore"];
declare let monitorWebChannel: LibraryExports["monitorWebChannel"];
declare let normalizeE164: LibraryExports["normalizeE164"];
declare let PortInUseError: LibraryExports["PortInUseError"];
declare let promptYesNo: LibraryExports["promptYesNo"];
declare let resolveSessionKey: LibraryExports["resolveSessionKey"];
declare let resolveStorePath: LibraryExports["resolveStorePath"];
declare let runCommandWithTimeout: LibraryExports["runCommandWithTimeout"];
declare let runExec: LibraryExports["runExec"];
/** @deprecated Use SQLite-backed session APIs. Scheduled for removal after 2026-10-12. */
declare let saveSessionStore: LibraryExports["saveSessionStore"];
declare let waitForever: LibraryExports["waitForever"];
declare function runLegacyCliEntry(argv?: string[], deps?: LegacyCliDeps, options?: {
  retainConsoleRoutingUntilProcessExit?: boolean;
}): Promise<void>;
//#endregion
export { PortInUseError, applyTemplate, createDefaultDeps, deriveSessionKey, describePortOwner, ensureBinary, ensurePortAvailable, getReplyFromConfig, handlePortError, loadConfig, loadSessionStore, monitorWebChannel, normalizeE164, promptYesNo, resolveSessionKey, resolveStorePath, runCommandWithTimeout, runExec, runLegacyCliEntry, saveSessionStore, waitForever };