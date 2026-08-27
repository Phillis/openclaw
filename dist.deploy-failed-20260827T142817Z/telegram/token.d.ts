import { i as OpenClawConfig } from "../types.openclaw-D9FrGbix.js";
import { m as BaseTokenResolution } from "../types.public-DHic20VT.js";
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
type CredentialUnavailableDiagnostic$1 = {
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
  diagnostic: CredentialUnavailableDiagnostic$1;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic$1) => void;
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
//#region extensions/telegram/src/token.d.ts
type CredentialUnavailableDiagnostic = Extract<ReturnType<typeof tryReadSecretFileSync>, {
  status: "configured_unavailable";
}>["diagnostic"];
type TelegramTokenSource = "env" | "tokenFile" | "config" | "none";
type TelegramTokenResolution = BaseTokenResolution & {
  source: TelegramTokenSource;
  credentialDiagnostics?: CredentialUnavailableDiagnostic[];
};
type ResolveTelegramTokenOpts = {
  envToken?: string | null;
  accountId?: string | null;
  logMissingFile?: (message: string) => void;
};
declare function resolveTelegramToken(cfg?: OpenClawConfig, opts?: ResolveTelegramTokenOpts): TelegramTokenResolution;
//#endregion
export { TelegramTokenResolution, resolveTelegramToken };