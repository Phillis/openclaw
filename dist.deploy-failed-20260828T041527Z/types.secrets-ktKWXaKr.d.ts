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
export { SecretsConfig as i, SecretRef as n, SecretRefSource as r, SecretInput as t };