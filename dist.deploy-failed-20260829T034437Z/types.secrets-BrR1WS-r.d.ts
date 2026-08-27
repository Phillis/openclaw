//#region src/config/types.secrets.d.ts
/** Supported secret reference backends in config. */
type SecretRefSource = "env" | "file" | "exec" | "store";
/**
 * Stable identifier for a secret in a configured source.
 * Examples:
 * - env source: provider "default", id "OPENAI_API_KEY"
 * - file source: provider "mounted-json", id "/providers/openai/apiKey"
 * - exec source: provider "vault", id "openai/api-key"
 * - store source: provider "default", id "OPENAI_API_KEY"
 */
type SecretRef = {
  source: SecretRefSource;
  provider: string;
  id: string;
};
/** Secret-bearing config input: either a literal string or a structured SecretRef. */
type SecretInput = string | SecretRef;
/** Secret string read mode: throw on unresolved refs or inspect without resolving. */
type SecretInputStringResolutionMode = "strict" | "inspect";
/** Result of reading a secret input without necessarily materializing the secret value. */
type SecretInputStringResolution = {
  status: "available";
  value: string;
  ref: null;
} | {
  status: "configured_unavailable";
  value: undefined;
  ref: SecretRef;
} | {
  status: "missing";
  value: undefined;
  ref: null;
};
type SecretDefaults = {
  /** Default provider alias for env SecretRefs. */
  env?: string;
  /** Default provider alias for file SecretRefs. */
  file?: string;
  /** Default provider alias for exec SecretRefs. */
  exec?: string;
  /** Default provider alias for shared-store SecretRefs. */
  store?: string;
};
/** Narrow a value to the canonical SecretRef object shape. */
declare function isSecretRef(value: unknown): value is SecretRef;
/** Coerce canonical and env-shorthand secret inputs into a SecretRef.
 * Retired string markers are parsed only by doctor migration above. */
declare function coerceSecretRef(value: unknown, defaults?: SecretDefaults): SecretRef | null;
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
declare function hasConfiguredSecretInput(value: unknown, defaults?: SecretDefaults): boolean;
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
declare function normalizeSecretInputString(value: unknown): string | undefined;
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
declare function resolveSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
  mode?: SecretInputStringResolutionMode;
}): SecretInputStringResolution;
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
declare function normalizeResolvedSecretInputString(params: {
  value: unknown;
  refValue?: unknown;
  defaults?: SecretDefaults;
  path: string;
}): string | undefined;
type EnvSecretProviderConfig = {
  source: "env";
  /** Optional env var allowlist (exact names). */
  allowlist?: string[];
};
type FileSecretProviderMode = "singleValue" | "json";
type FileSecretProviderConfig = {
  source: "file";
  path: string;
  mode?: FileSecretProviderMode;
  timeoutMs?: number;
  maxBytes?: number;
};
type ManualExecSecretProviderConfig = {
  source: "exec";
  command: string;
  args?: string[];
  timeoutMs?: number;
  noOutputTimeoutMs?: number;
  maxOutputBytes?: number;
  jsonOnly?: boolean;
  env?: Record<string, string>;
  passEnv?: string[];
  trustedDirs?: string[];
};
type PluginIntegrationSecretProviderConfig = {
  source: "exec";
  pluginIntegration: {
    pluginId: string;
    integrationId: string;
  };
};
type ExecSecretProviderConfig = ManualExecSecretProviderConfig | PluginIntegrationSecretProviderConfig;
type StoreSecretProviderConfig = {
  source: "store";
};
type SecretProviderConfig = EnvSecretProviderConfig | FileSecretProviderConfig | ExecSecretProviderConfig | StoreSecretProviderConfig;
type SecretsConfig = {
  egressProxy?: {
    enabled?: boolean;
    allowedHosts?: string[];
    bypassHosts?: string[];
  };
  providers?: Record<string, SecretProviderConfig>;
  defaults?: {
    env?: string;
    file?: string;
    exec?: string;
    store?: string;
  };
};
//#endregion
export { SecretProviderConfig as a, SecretsConfig as c, isSecretRef as d, normalizeResolvedSecretInputString as f, SecretInputStringResolutionMode as i, coerceSecretRef as l, resolveSecretInputString as m, SecretInput as n, SecretRef as o, normalizeSecretInputString as p, SecretInputStringResolution as r, SecretRefSource as s, PluginIntegrationSecretProviderConfig as t, hasConfiguredSecretInput as u };