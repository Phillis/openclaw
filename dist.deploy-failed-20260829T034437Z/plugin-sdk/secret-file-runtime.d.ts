//#region node_modules/@openclaw/fs-safe/dist/errors.d.ts
type FsSafeErrorCode = "already-exists" | "denied-path" | "device-path" | "hardlink" | "helper-failed" | "helper-unavailable" | "invalid-path" | "insecure-permissions" | "not-empty" | "not-file" | "not-found" | "not-owned" | "not-removable" | "outside-workspace" | "path-alias" | "path-mismatch" | "permission-unverified" | "read-failed" | "secret-exists" | "store-reentrant-update" | "symlink" | "timeout" | "too-large" | "unsupported-platform";
//#endregion
//#region node_modules/@openclaw/fs-safe/dist/secret-file.d.ts
declare const DEFAULT_SECRET_FILE_MAX_BYTES: number;
declare const PRIVATE_SECRET_DIR_MODE = 448;
declare const PRIVATE_SECRET_FILE_MODE = 384;
type SecretFileReadOptions = {
  maxBytes?: number;
  rejectSymlink?: boolean;
  rejectHardlinks?: boolean;
};
declare function readSecretFileSync(filePath: string, label: string, options?: SecretFileReadOptions): string;
type SecretFileWriteParams = {
  rootDir: string;
  filePath: string;
  content: string | Uint8Array;
  mode?: number;
  dirMode?: number;
};
declare function writeSecretFileAtomic(params: SecretFileWriteParams): Promise<void>;
//#endregion
//#region src/infra/secret-file.d.ts
type SecretFileReadResult = {
  ok: true;
  secret: string;
  resolvedPath: string;
} | {
  ok: false;
  message: string;
  resolvedPath?: string;
  error?: unknown;
};
type CredentialUnavailableDiagnostic = {
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
  diagnostic: CredentialUnavailableDiagnostic;
} | {
  status: "missing";
};
type ConfiguredCredentialResult<T> = Exclude<CredentialResult<T>, {
  status: "missing";
}>;
type CredentialFileReadOptions = SecretFileReadOptions & {
  credentialDiagnostic: {
    configPath: string;
    report: (diagnostic: CredentialUnavailableDiagnostic) => void;
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
/** @deprecated Use readSecretFileSync() or tryReadSecretFileSync(). */
declare function loadSecretFileSync(filePath: string, label: string, options?: Parameters<typeof readSecretFileSync>[2]): SecretFileReadResult;
//#endregion
export { DEFAULT_SECRET_FILE_MAX_BYTES, PRIVATE_SECRET_DIR_MODE, PRIVATE_SECRET_FILE_MODE, type SecretFileReadOptions, type SecretFileReadResult, loadSecretFileSync, readSecretFileSync, tryReadSecretFileSync, writeSecretFileAtomic as writePrivateSecretFileAtomic };