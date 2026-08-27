import { h as TelegramNetworkConfig, l as TelegramAccountConfig, n as OpenClawConfig, u as TelegramActionConfig } from "./types.openclaw-VfFCsbZD.js";
import { P as BaseTokenResolution } from "./types.adapters-BCj_O1Hf.js";
import { n as PinnedDispatcherPolicy } from "./ssrf-CIroieCz.js";
//#region node_modules/@openclaw/fs-safe/dist/errors.d.ts
type FsSafeErrorCode = "already-exists" | "denied-path" | "device-path" | "hardlink" | "helper-failed" | "helper-unavailable" | "invalid-path" | "insecure-permissions" | "not-empty" | "not-file" | "not-found" | "not-owned" | "not-removable" | "outside-workspace" | "path-alias" | "path-mismatch" | "permission-unverified" | "read-failed" | "secret-exists" | "store-reentrant-update" | "symlink" | "timeout" | "too-large" | "unsupported-platform";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/secret-file.d.ts
type SecretFileReadOptions = {
  maxBytes?: number;
  rejectSymlink?: boolean;
  rejectHardlinks?: boolean;
};
//#endregion
//#region src/infra/secret-file.d.ts
type CredentialUnavailableDiagnostic$2 = {
  code: "CREDENTIAL_FILE_UNAVAILABLE";
  path: string;
  reason: FsSafeErrorCode;
};
/** Closed credential state used by channel account resolvers. */
type CredentialResult<T> = {
  status: "available";
  value: T;
} | {
  status: "configured_unavailable";
  diagnostic: CredentialUnavailableDiagnostic$2;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic$2) => void;
  };
};
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: CredentialFileReadOptions): string | undefined;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options?: SecretFileReadOptions): string | undefined;
/** Reads an explicitly configured credential file without exposing its filesystem path. */
declare function tryReadSecretFileSync(filePath: string, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): ConfiguredCredentialResult<string>;
declare function tryReadSecretFileSync(filePath: string | undefined, label: string, options: SecretFileReadOptions | undefined, diagnostic: {
  configPath: string;
}): CredentialResult<string>;
//#endregion
//#region extensions/telegram/src/fetch.d.ts
type TelegramDispatcherAttempt = {
  dispatcherPolicy?: PinnedDispatcherPolicy;
};
declare function shouldRetryTelegramTransportFallback(err: unknown): boolean;
type TelegramTransport = {
  fetch: typeof fetch;
  sourceFetch: typeof fetch;
  dispatcherAttempts?: TelegramDispatcherAttempt[];
  /**
   * Promote this transport to its next fallback dispatcher before the next
   * request. The original error, when available, is retained in diagnostics.
   * Returns false when no fallback path exists.
   */
  forceFallback?: (reason: string, err?: unknown) => boolean;
  /**
   * Release all dispatchers owned by this transport and the TCP sockets they
   * hold. Safe to call multiple times; subsequent calls resolve immediately.
   *
   * Callers that pass their own `proxyFetch` own the underlying dispatcher
   * lifecycle themselves and this is effectively a no-op. Callers that let
   * this module construct the transport MUST invoke `close()` when the
   * transport is no longer needed (e.g. on polling session dispose or when
   * swapping transports after a network stall); otherwise undici keeps the
   * keep-alive sockets open indefinitely, leaking hundreds of connections
   * to api.telegram.org over long-running sessions.
   */
  close(): Promise<void>;
};
declare function resolveTelegramTransport(proxyFetch?: typeof fetch, options?: {
  network?: TelegramNetworkConfig;
}): TelegramTransport;
declare function resolveTelegramFetch(proxyFetch?: typeof fetch, options?: {
  network?: TelegramNetworkConfig;
}): typeof fetch;
//#endregion
//#region extensions/telegram/src/token.d.ts
type CredentialUnavailableDiagnostic$1 = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
type TelegramTokenResolution = BaseTokenResolution & {
  source: TelegramTokenSource;
  credentialDiagnostics?: CredentialUnavailableDiagnostic$1[];
};
type ResolveTelegramTokenOpts = {
  envToken?: string | null;
  accountId?: string | null;
  logMissingFile?: (message: string) => void;
};
declare function resolveTelegramToken(cfg?: OpenClawConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
//#endregion
//#region extensions/telegram/src/account-config.d.ts
declare function resolveTelegramAccountConfig(cfg: OpenClawConfig, accountId: string): TelegramAccountConfig | undefined;
declare function mergeTelegramAccountConfig(cfg: OpenClawConfig, accountId: string): TelegramAccountConfig;
//#endregion
//#region extensions/telegram/src/accounts.d.ts
type CredentialUnavailableDiagnostic = NonNullable<ReturnType<typeof resolveTelegramToken>["credentialDiagnostics"]>[number];
type ResolvedTelegramAccount = {
  accountId: string;
  enabled: boolean;
  name?: string;
  token: string;
  tokenSource: "env" | "tokenFile" | "config" | "none";
  tokenStatus: "available" | "configured_unavailable" | "missing";
  credentialDiagnostics?: CredentialUnavailableDiagnostic[];
  config: TelegramAccountConfig;
};
type TelegramMediaRuntimeOptions = {
  token: string;
  transport?: TelegramTransport;
  apiRoot?: string;
  trustedLocalFileRoots?: readonly string[];
  dangerouslyAllowPrivateNetwork?: boolean;
};
declare function listTelegramAccountIds(cfg: OpenClawConfig): string[];
/** @internal Reset the once-per-process warning flag. Exported for tests only. */
declare function resetMissingDefaultWarnFlag(): void;
declare function resolveDefaultTelegramAccountId(cfg: OpenClawConfig): string;
declare function createTelegramActionGate(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): (key: keyof TelegramActionConfig, defaultValue?: boolean) => boolean;
declare function resolveTelegramMediaRuntimeOptions(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  token: string;
  transport?: TelegramTransport;
}): TelegramMediaRuntimeOptions;
type TelegramPollActionGateState = {
  sendMessageEnabled: boolean;
  pollEnabled: boolean;
  enabled: boolean;
};
declare function resolveTelegramPollActionGateState(isActionEnabled: (key: keyof TelegramActionConfig, defaultValue?: boolean) => boolean): TelegramPollActionGateState;
declare function resolveTelegramAccount(params: {
  cfg: OpenClawConfig;
  accountId?: string | null;
}): ResolvedTelegramAccount;
declare function listEnabledTelegramAccounts(cfg: OpenClawConfig): ResolvedTelegramAccount[];
//#endregion
export { resolveTelegramTransport as _, listEnabledTelegramAccounts as a, resolveDefaultTelegramAccountId as c, resolveTelegramPollActionGateState as d, mergeTelegramAccountConfig as f, resolveTelegramFetch as g, resolveTelegramToken as h, createTelegramActionGate as i, resolveTelegramAccount as l, TelegramTokenResolution as m, TelegramMediaRuntimeOptions as n, listTelegramAccountIds as o, resolveTelegramAccountConfig as p, TelegramPollActionGateState as r, resetMissingDefaultWarnFlag as s, ResolvedTelegramAccount as t, resolveTelegramMediaRuntimeOptions as u, shouldRetryTelegramTransportFallback as v, tryReadSecretFileSync as y };