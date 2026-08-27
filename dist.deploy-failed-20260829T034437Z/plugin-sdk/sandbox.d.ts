import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import "../config-dyztAPSU.js";
import { a as RootReadOptions, n as OpenResult, r as Root, s as ReadResult } from "../root-impl-DRDYcBUl.js";
import { n as FileIdentityStat, t as resolvePreferredOpenClawTmpDir } from "../tmp-openclaw-dir-mAiu1cbv.js";
import { _ as SandboxFsStat, c as SandboxBackendCommandResult, d as SandboxBackendId, f as SandboxBackendPreparedWorkdirDiscarder, g as SandboxFsBridge, h as SandboxFsBridgeContext, l as SandboxBackendExecSpec, m as SandboxBackendWorkdirValidator, n as SandboxContext, p as SandboxBackendWorkdirValidation, r as SandboxSshConfig, s as SandboxBackendCommandParams, u as SandboxBackendHandle, v as SandboxResolvedPath } from "../types-CeW8bZNk.js";
import { a as getSandboxBackendWorkdirResolver, c as CreateSandboxBackendParams, d as SandboxBackendRegistration, f as SandboxBackendRuntimeInfo, i as getSandboxBackendManager, l as SandboxBackendFactory, n as resolveSandboxRuntimeStatus, o as registerSandboxBackend, p as SandboxBackendWorkdirResolver, r as getSandboxBackendFactory, s as requireSandboxBackendFactory, t as isToolAllowed, u as SandboxBackendManager } from "../sandbox-Ob67xdL9.js";
import { Readable } from "node:stream";
//#region node_modules/@openclaw/fs-safe/dist/sidecar-lock-types.d.ts
type SidecarLockRetryOptions = {
  retries?: number;
  factor?: number;
  minTimeout?: number;
  maxTimeout?: number;
  randomize?: boolean;
};
type SidecarLockStaleRecovery = "fail-closed" | "remove-if-unchanged";
//#endregion
//#region src/agents/sandbox/sanitize-env-vars.d.ts
type EnvVarSanitizationResult = {
  allowed: Record<string, string>;
  blocked: string[];
  warnings: string[];
};
type EnvSanitizationOptions = {
  strictMode?: boolean;
  customBlockedPatterns?: ReadonlyArray<RegExp>;
  customAllowedPatterns?: ReadonlyArray<RegExp>;
};
/** Sanitizes inherited environment variables for automatic sandbox propagation. */
declare function sanitizeEnvVars(envVars: Record<string, string | undefined>, options?: EnvSanitizationOptions): EnvVarSanitizationResult;
//#endregion
//#region src/agents/sandbox/ssh.d.ts
type SshSandboxSettings = {
  command: string;
  target: string;
  strictHostKeyChecking: boolean;
  updateHostKeys: boolean;
  identityFile?: string;
  certificateFile?: string;
  knownHostsFile?: string;
  identityData?: string;
  certificateData?: string;
  knownHostsData?: string;
};
/** Temporary SSH session descriptor with an isolated config file. */
type SshSandboxSession = {
  command: string;
  configPath: string;
  host: string;
};
/** Parameters for one SSH sandbox command execution. */
type RunSshSandboxCommandParams = {
  session: SshSandboxSession;
  remoteCommand: string;
  stdin?: Buffer | string;
  allowFailure?: boolean;
  signal?: AbortSignal;
  tty?: boolean;
};
/** Single-quote a value for POSIX shell argv construction. */
declare function shellEscape(value: string): string;
/** Build a remote shell command from literal argv entries. */
declare function buildRemoteCommand(argv: string[]): string;
/** Build the wrapped remote `/bin/sh -c` command for sandbox exec. */
declare function buildExecRemoteCommand(params: {
  command: string;
  workdir?: string;
  env: Record<string, string>;
}): string;
/** Validate and build a remote exec command for untrusted model input. */
declare function buildValidatedExecRemoteCommand(params: {
  command: string;
  workdir?: string;
  env: Record<string, string>;
}): string;
/** Stage exec environment through private SSH stdin, never local or remote argv. */
declare function prepareSshSandboxExec(params: {
  session: SshSandboxSession;
  remoteCommand: string;
  env: Record<string, string>;
  tty?: boolean;
}): Promise<{
  argv: string[];
  cleanup: () => Promise<void>;
}>;
declare function buildRemoteWorkdirValidationCommand(params: {
  workdir: string;
  root: string;
}): string;
/** Build the local ssh argv for a prepared sandbox session. */
declare function buildSshSandboxArgv(params: {
  session: SshSandboxSession;
  remoteCommand: string;
  tty?: boolean;
}): string[];
/** Create a temporary SSH session from already-rendered ssh config text. */
declare function createSshSandboxSessionFromConfigText(params: {
  configText: string;
  host?: string;
  command?: string;
}): Promise<SshSandboxSession>;
/** Create a temporary SSH session from structured sandbox SSH settings. */
declare function createSshSandboxSessionFromSettings(settings: SshSandboxSettings): Promise<SshSandboxSession>;
/** Remove temporary SSH config and materialized secret files. */
declare function disposeSshSandboxSession(session: SshSandboxSession): Promise<void>;
/** Run a remote command through ssh and return buffered stdout/stderr. */
declare function runSshSandboxCommand(params: RunSshSandboxCommandParams): Promise<SandboxBackendCommandResult>;
/** Stream a local directory to the remote sandbox with tar over ssh. */
declare function uploadDirectoryToSshTarget(params: {
  session: SshSandboxSession;
  localDir: string;
  remoteDir: string;
  remoteRootDir?: string;
  signal?: AbortSignal;
}): Promise<void>;
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.types.d.ts
/** Minimal remote shell contract used by the SSH filesystem bridge. */
type RemoteShellSandboxHandle = {
  remoteWorkspaceDir: string;
  remoteAgentWorkspaceDir: string;
  runRemoteShellScript(params: SandboxBackendCommandParams): Promise<SandboxBackendCommandResult>;
};
//#endregion
//#region src/agents/sandbox/remote-fs-bridge.d.ts
/** Create the filesystem bridge for remote shell-backed sandbox runtimes. */
declare function createRemoteShellSandboxFsBridge(params: {
  sandbox: SandboxFsBridgeContext;
  runtime: RemoteShellSandboxHandle;
}): SandboxFsBridge;
//#endregion
//#region src/agents/sandbox/fs-bridge-rename-targets.d.ts
/**
 * Shared writable-target resolution for sandbox fs bridge rename operations.
 */
/** Resolves both rename endpoints and verifies write access before command execution. */
declare function resolveWritableRenameTargets<T extends {
  containerPath: string;
}>(params: {
  from: string;
  to: string;
  cwd?: string;
  action?: string;
  resolveTarget: (params: {
    filePath: string;
    cwd?: string;
  }) => T;
  ensureWritable: (target: T, action: string) => void;
}): {
  from: T;
  to: T;
};
/** Adapter used by bridge implementations that pass resolver callbacks separately. */
declare function resolveWritableRenameTargetsForBridge<T extends {
  containerPath: string;
}>(params: {
  from: string;
  to: string;
  cwd?: string;
  action?: string;
}, resolveTarget: (params: {
  filePath: string;
  cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): {
  from: T;
  to: T;
};
/** Creates a reusable resolver bound to a bridge's target and permission helpers. */
declare function createWritableRenameTargetResolver<T extends {
  containerPath: string;
}>(resolveTarget: (params: {
  filePath: string;
  cwd?: string;
}) => T, ensureWritable: (target: T, action: string) => void): (params: {
  from: string;
  to: string;
  cwd?: string;
}) => {
  from: T;
  to: T;
};
//#endregion
//#region src/plugin-sdk/run-command.d.ts
/** Captured process result returned by plugin command execution helpers. */
type PluginCommandRunResult = {
  /** Process exit code, with `1` used when the command failed before spawning or did not report one. */
  code: number;
  /** Captured standard output as UTF-8 text. */
  stdout: string;
  /** Captured standard error, normalized to include timeout or thrown-error messages. */
  stderr: string;
};
/** Options for commands that are launched on behalf of a plugin runtime. */
type PluginCommandRunOptions = {
  /** Executable and arguments, with the command name in the first slot. */
  argv: string[];
  /** Hard execution limit in milliseconds before the command is terminated. */
  timeoutMs: number;
  /** Working directory for the child process. Defaults to the current process directory. */
  cwd?: string;
  /** Environment passed to the child process. Defaults to the current process environment. */
  env?: NodeJS.ProcessEnv;
};
/** Run a plugin-managed command with timeout handling and normalized stdout/stderr results. */
declare function runPluginCommandWithTimeout(options: PluginCommandRunOptions): Promise<PluginCommandRunResult>;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/file-store-prune.d.ts
type FileStorePruneOptions = {
  ttlMs: number;
  recursive?: boolean;
  maxDepth?: number;
  pruneEmptyDirs?: boolean;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/file-lock.d.ts
type FileLockRetryOptions = SidecarLockRetryOptions;
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/json-document-store.d.ts
type JsonStoreLockOptions = {
  staleMs?: number;
  timeoutMs?: number;
  retry?: FileLockRetryOptions;
  staleRecovery?: SidecarLockStaleRecovery;
  managerKey?: string;
};
type JsonFileStoreOptions = {
  trailingNewline?: boolean;
  lock?: boolean | JsonStoreLockOptions;
};
type JsonStore<T> = {
  readonly filePath: string;
  read(): Promise<T | undefined>;
  readOr(fallback: T): Promise<T>;
  readRequired(): Promise<T>;
  write(value: T): Promise<void>;
  update(run: (current: T | undefined) => T | Promise<T>): Promise<T>;
  updateOr(fallback: T, run: (current: T) => T | Promise<T>): Promise<T>;
};
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/file-store.d.ts
type FileStoreWriteOptions = {
  dirMode?: number;
  mode?: number;
  maxBytes?: number;
  tempPrefix?: string;
};
type FileStoreReadOptions = RootReadOptions & {
  encoding?: BufferEncoding;
};
type FileStore = {
  readonly rootDir: string;
  path(relativePath: string): string;
  root(): Promise<Root>;
  write(relativePath: string, data: string | Uint8Array, options?: FileStoreWriteOptions): Promise<string>;
  writeStream(relativePath: string, stream: Readable, options?: FileStoreWriteOptions): Promise<string>;
  copyIn(relativePath: string, sourcePath: string, options?: FileStoreWriteOptions): Promise<string>;
  open(relativePath: string, options?: RootReadOptions): Promise<OpenResult>;
  read(relativePath: string, options?: RootReadOptions): Promise<ReadResult>;
  readBytes(relativePath: string, options?: RootReadOptions): Promise<Buffer>;
  readText(relativePath: string, options?: FileStoreReadOptions): Promise<string>;
  readTextIfExists(relativePath: string, options?: FileStoreReadOptions): Promise<string | null>;
  readJson<T = unknown>(relativePath: string, options?: FileStoreReadOptions): Promise<T>;
  readJsonIfExists<T = unknown>(relativePath: string, options?: FileStoreReadOptions): Promise<T | null>;
  remove(relativePath: string): Promise<void>;
  exists(relativePath: string): Promise<boolean>;
  writeText(relativePath: string, data: string | Uint8Array, options?: FileStoreWriteOptions): Promise<string>;
  writeJson(relativePath: string, data: unknown, options?: FileStoreWriteOptions & {
    trailingNewline?: boolean;
  }): Promise<string>;
  json<T = unknown>(relativePath: string, options?: JsonFileStoreOptions): JsonStore<T>;
  pruneExpired(options: FileStorePruneOptions): Promise<void>;
};
type FileStoreSync = {
  readonly rootDir: string;
  path(relativePath: string): string;
  readTextIfExists(relativePath: string, options?: {
    maxBytes?: number;
  }): string | null;
  readJsonIfExists<T = unknown>(relativePath: string, options?: {
    maxBytes?: number;
  }): T | null;
  write(relativePath: string, data: string | Uint8Array, options?: FileStoreWriteOptions): string;
  writeText(relativePath: string, data: string | Uint8Array, options?: FileStoreWriteOptions): string;
  writeJson(relativePath: string, data: unknown, options?: FileStoreWriteOptions & {
    trailingNewline?: boolean;
  }): string;
};
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
export { type CreateSandboxBackendParams, type OpenClawConfig, type PluginCommandRunOptions, type PluginCommandRunResult, type RemoteShellSandboxHandle, type RunSshSandboxCommandParams, type SandboxBackendCommandParams, type SandboxBackendCommandResult, type SandboxBackendExecSpec, type SandboxBackendFactory, type SandboxBackendHandle, type SandboxBackendId, type SandboxBackendManager, type SandboxBackendPreparedWorkdirDiscarder, type SandboxBackendRegistration, type SandboxBackendRuntimeInfo, type SandboxBackendWorkdirResolver, type SandboxBackendWorkdirValidation, type SandboxBackendWorkdirValidator, type SandboxContext, type SandboxFsBridge, type SandboxFsStat, type SandboxResolvedPath, type SandboxSshConfig, type SshSandboxSession, type SshSandboxSettings, type TempWorkspace, type TempWorkspaceOptions, type TempWorkspaceSync, buildExecRemoteCommand, buildRemoteCommand, buildRemoteWorkdirValidationCommand, buildSshSandboxArgv, buildValidatedExecRemoteCommand, createRemoteShellSandboxFsBridge, createSshSandboxSessionFromConfigText, createSshSandboxSessionFromSettings, createWritableRenameTargetResolver, disposeSshSandboxSession, getSandboxBackendFactory, getSandboxBackendManager, getSandboxBackendWorkdirResolver, isToolAllowed, prepareSshSandboxExec, registerSandboxBackend, requireSandboxBackendFactory, resolvePreferredOpenClawTmpDir, resolveSandboxRuntimeStatus, resolveWritableRenameTargets, resolveWritableRenameTargetsForBridge, runPluginCommandWithTimeout, runSshSandboxCommand, sanitizeEnvVars, shellEscape, tempWorkspace, tempWorkspaceSync, uploadDirectoryToSshTarget, withTempWorkspace, withTempWorkspaceSync };