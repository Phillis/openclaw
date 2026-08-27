import { n as OpenClawConfig } from "../types.openclaw-CNftZ6Ix.js";
import { n as SecretRef, t as SecretInput } from "../types.secrets-G6HDh4-9.js";
import { n as WizardPrompter } from "../types.plugin-Bmqj6gl7.js";
import { Q as upsertAuthProfileWithLockOrThrow, X as upsertAuthProfile, Z as upsertAuthProfileWithLock, yr as SecretInputMode } from "../types-lxuSJRGv.js";
import { t as createProviderApiKeyAuthMethod } from "../provider-api-key-auth-DB0Lwvgb.js";

//#region src/plugins/provider-auth-ref.d.ts
/** Copy overrides used while prompting for provider secret-ref setup. */
type SecretRefSetupPromptCopy = {
  sourceMessage?: string;
  envVarMessage?: string;
  envVarPlaceholder?: string;
  envVarFormatError?: string;
  envVarMissingError?: (envVar: string) => string;
  noProvidersMessage?: string;
  envValidatedMessage?: (envVar: string) => string;
  providerValidatedMessage?: (provider: string, id: string, source: "file" | "exec" | "store") => string;
};
declare function promptSecretRefForSetup(params: {
  provider: string;
  config: OpenClawConfig;
  prompter: WizardPrompter;
  preferredEnvVar?: string;
  copy?: SecretRefSetupPromptCopy;
  env?: NodeJS.ProcessEnv;
}): Promise<{
  ref: SecretRef;
  resolvedValue: string;
}>;
//#endregion
//#region src/plugins/provider-auth-mode.d.ts
/** Prompt copy overrides for provider secret input mode selection. */
type SecretInputModePromptCopy = {
  modeMessage?: string;
  plaintextLabel?: string;
  plaintextHint?: string;
  refLabel?: string;
  refHint?: string;
};
/** Resolves provider secret input mode from explicit option or wizard selection. */
declare function resolveSecretInputModeForEnvSelection(params: {
  prompter: Pick<WizardPrompter, "select">;
  explicitMode?: SecretInputMode;
  copy?: SecretInputModePromptCopy;
}): Promise<SecretInputMode>;
//#endregion
//#region src/plugins/provider-auth-input.d.ts
/** Normalizes pasted API-key input, including shell assignment forms. */
declare function normalizeApiKeyInput(raw: string): string;
/** Validates required API-key input for setup prompts. */
declare const validateApiKeyInput: (value: string) => "Required" | "Paste the API key value, not an OpenClaw onboarding command." | undefined;
/** Formats a redacted API-key preview for setup confirmation prompts. */
declare function formatApiKeyPreview(raw: string, opts?: {
  head?: number;
  tail?: number;
}): string;
/** Normalizes secret input mode values accepted by provider setup. */
declare function normalizeSecretInputModeInput(secretInputMode: string | null | undefined): SecretInputMode | undefined;
/** Resolves an API key from CLI options first, then environment or prompt fallback. */
declare function ensureApiKeyFromOptionEnvOrPrompt(params: {
  token: string | undefined;
  tokenProvider: string | undefined;
  secretInputMode?: SecretInputMode;
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  expectedProviders: string[];
  provider: string;
  envLabel: string;
  promptMessage: string;
  normalize: (value: string) => string;
  validate: (value: string) => string | undefined;
  prompter: WizardPrompter;
  setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
  noteMessage?: string;
  noteTitle?: string;
}): Promise<string>;
//#endregion
//#region src/plugins/provider-auth-helpers.d.ts
type ApiKeyStorageOptions = {
  secretInputMode?: SecretInputMode;
  config?: OpenClawConfig;
};
declare function buildApiKeyCredential(provider: string, input: SecretInput, metadata?: Record<string, string>, options?: ApiKeyStorageOptions): {
  type: "api_key";
  provider: string;
  key?: string;
  keyRef?: SecretRef;
  metadata?: Record<string, string>;
};
declare function upsertApiKeyProfile(params: {
  provider: string;
  input: SecretInput;
  agentDir?: string;
  options?: ApiKeyStorageOptions;
  profileId?: string;
  metadata?: Record<string, string>;
}): string;
declare function applyAuthProfileConfig(cfg: OpenClawConfig, params: {
  profileId: string;
  provider: string;
  mode: "api_key" | "aws-sdk" | "oauth" | "token";
  email?: string;
  displayName?: string;
  preferProfileFirst?: boolean;
}): OpenClawConfig;
//#endregion
//#region src/utils/normalize-secret-input.d.ts
/**
 * Secret normalization for copy/pasted credentials.
 *
 * Common footgun: line breaks (especially `\r`) embedded in API keys/tokens.
 * We strip line breaks anywhere, then trim whitespace at the ends.
 *
 * Another frequent source of runtime failures is rich-text/Unicode artifacts
 * (smart punctuation, box-drawing chars, etc.) pasted into API keys. These can
 * break HTTP header construction (`ByteString` violations). Drop non-Latin1
 * code points so malformed keys fail as auth errors instead of crashing request
 * setup.
 *
 * Intentionally does NOT remove ordinary spaces inside the string to avoid
 * silently altering "Bearer <token>" style values.
 */
/**
 * Normalizes a raw secret value from config, env, setup prompts, or plugin SDK callers.
 * Returns an empty string for absent/invalid input so callers can keep boolean presence checks simple.
 */
declare function normalizeSecretInput(value: unknown): string;
/**
 * Normalizes a raw secret value and converts empty normalized output to `undefined`.
 * Use this at optional config boundaries where "not configured" is clearer than an empty string.
 */
declare function normalizeOptionalSecretInput(value: unknown): string | undefined;
//#endregion
export { type ApiKeyStorageOptions, type OpenClawConfig, type SecretInput, applyAuthProfileConfig, buildApiKeyCredential, createProviderApiKeyAuthMethod, ensureApiKeyFromOptionEnvOrPrompt, formatApiKeyPreview, normalizeApiKeyInput, normalizeOptionalSecretInput, normalizeSecretInput, normalizeSecretInputModeInput, promptSecretRefForSetup, resolveSecretInputModeForEnvSelection, upsertApiKeyProfile, upsertAuthProfile, upsertAuthProfileWithLock, upsertAuthProfileWithLockOrThrow, validateApiKeyInput };