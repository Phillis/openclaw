import { r as OpenClawConfig } from "../types.openclaw-a_kGc1gJ.js";
import { l as coerceSecretRef, n as SecretInput, o as SecretRef, u as hasConfiguredSecretInput } from "../types.secrets-BBdlv1za.js";
import { C as AuthProfileCredential, E as OAuthCredential, T as AuthProfileStore } from "../types-BFl3Ao02.js";
import { o as resolveRequiredHomeDir } from "../home-dir-4pOw9r_P.js";
import { Dr as ProviderAuthResult, Fn as upsertAuthProfileWithLock, In as listProfilesForProvider, Mn as suggestOAuthProfileIdForLegacyDefault, Nn as removeProviderAuthProfilesWithLock, Pn as upsertAuthProfile, Sn as ensureAuthProfileStoreForLocalUpdate, Tr as ProviderAuthMethod, Un as DEFAULT_OAUTH_REFRESH_MARGIN_MS, Wn as hasUsableOAuthCredential, hn as omitEnvKeysCaseInsensitive, kn as updateAuthProfileStoreWithLock, kr as ProviderPluginWizardSetup, mn as listKnownProviderAuthEnvVarNames, pn as resolveEnvApiKey, wr as ProviderAuthContext, xn as ensureAuthProfileStore } from "../host-capability-types-3XBDy-df.js";
import { $t as SecretInputMode } from "../types-4_wTt5Pv.js";
import { o as OAuthCredentials } from "../model-catalog-CGi0o8D0.js";
import { p as WizardPrompter } from "../setup-wizard-types-CHxDmPK8.js";
import { n as readCodexCliCredentialsCached, t as readClaudeCliCredentialsCached } from "../cli-credentials-ByX3FVgi.js";
import { a as isNonSecretApiKeyMarker, i as isKnownEnvApiKeyMarker, n as CUSTOM_LOCAL_AUTH_MARKER, o as resolveNonEnvSecretRefApiKeyMarker, r as MINIMAX_OAUTH_MARKER, s as resolveOAuthApiKeyMarker } from "../model-auth-markers-B5Jn1-v2.js";
import { i as resolveDefaultSecretProviderAlias, n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "../normalize-secret-input-Cb_5pGru.js";

//#region src/agents/auth-profiles/constants.d.ts
/** @deprecated Anthropic provider-owned CLI profile id; do not use from third-party plugins. */
declare const CLAUDE_CLI_PROFILE_ID = "anthropic:claude-cli";
/** @deprecated OpenAI provider-owned CLI profile id; do not use from third-party plugins. */
declare const CODEX_CLI_PROFILE_ID = "openai:codex-cli";
//#endregion
//#region src/plugin-sdk/github-copilot-domain.d.ts
/**
 * Coerce a user/config-supplied GitHub host to a safe bare lowercase hostname.
 *
 * Fails closed to public `github.com`: only the public host and data-residency
 * GHE tenants (`*.ghe.com`) are trusted. Any other value falls back to the
 * default rather than being used verbatim, because the resolved host becomes the
 * `api.<host>` endpoint that receives the GitHub OAuth token during exchange — a
 * typo or injected value like `evil.com` must never redirect that token.
 * (Classic self-hosted GHE Server uses arbitrary hostnames but does not host
 * Copilot, so it is deliberately out of scope.) Config-supplied hosts coerce
 * rather than throw; persisted credential origins are rejected upstream with
 * `isSupportedGithubCopilotDomain` before reaching a token request.
 */
declare function normalizeGithubCopilotDomain(raw: string | undefined | null): string;
//#endregion
//#region src/plugin-sdk/provider-auth-copilot-cache.d.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
type CachedCopilotToken = {
  /** Copilot API token returned by GitHub's internal exchange endpoint. */token: string; /** Absolute epoch milliseconds when the Copilot API token expires. */
  expiresAt: number; /** Absolute epoch milliseconds when this cache entry was written. */
  updatedAt: number; /** Copilot integration id that produced this cached token. */
  integrationId?: string; /** SHA-256 fingerprint of the GitHub credential exchanged for this token. */
  sourceCredentialFingerprint?: string;
  /**
   * GitHub host this token was minted for. Guards against reusing a public
   * `github.com` Copilot token against a `*.ghe.com` tenant host (or vice
   * versa) after a domain switch. Shipped caches predate this field and were
   * only ever minted for public github.com, so a missing value means
   * `github.com` (keeps valid public entries usable across upgrade).
   */
  domain?: string;
};
//#endregion
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
/** Resolves an API key from environment or interactive prompt and records the chosen secret mode. */
declare function ensureApiKeyFromEnvOrPrompt(params: {
  config: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
  provider: string;
  envLabel: string;
  promptMessage: string;
  normalize: (value: string) => string;
  validate: (value: string) => string | undefined;
  prompter: WizardPrompter;
  secretInputMode?: SecretInputMode;
  setCredential: (apiKey: SecretInput, mode?: SecretInputMode) => Promise<void>;
}): Promise<string>;
//#endregion
//#region src/agents/models-config.providers.secret-helpers.d.ts
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
declare function normalizeApiKeyConfig(value: string): string;
//#endregion
//#region src/plugins/provider-auth-token.d.ts
/** @deprecated Provider-owned setup helper; do not use from third-party plugins. */
declare function buildTokenProfileId(params: {
  provider: string;
  name: string;
}): string;
/** @deprecated Anthropic provider-owned setup helper; do not use from third-party plugins. */
declare function validateAnthropicSetupToken(raw: string): string | undefined;
//#endregion
//#region src/plugins/provider-auth-helpers.d.ts
type ApiKeyStorageOptions = {
  secretInputMode?: SecretInputMode;
  config?: OpenClawConfig;
};
type WriteOAuthCredentialsOptions = {
  syncSiblingAgents?: boolean;
  profileName?: string;
  displayName?: string;
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
declare function writeOAuthCredentials(provider: string, creds: OAuthCredentials, agentDir?: string, options?: WriteOAuthCredentialsOptions): Promise<string>;
//#endregion
//#region src/plugins/provider-api-key-auth.d.ts
type ProviderApiKeyAuthMethodOptions = {
  providerId: string;
  methodId: string;
  label: string;
  hint?: string;
  wizard?: ProviderPluginWizardSetup;
  optionKey: string;
  flagName: `--${string}`;
  envVar: string;
  promptMessage: string;
  profileId?: string;
  profileIds?: string[];
  allowProfile?: boolean;
  defaultModel?: string;
  preserveExistingPrimary?: boolean;
  expectedProviders?: string[];
  metadata?: Record<string, string>;
  noteMessage?: string;
  noteTitle?: string;
  applyConfig?: (cfg: OpenClawConfig) => OpenClawConfig;
  resolveDefaultModel?: (params: {
    apiKey: string;
    config: OpenClawConfig;
    signal?: AbortSignal;
  }) => Promise<string | undefined>;
};
/** Creates a provider auth method that captures, stores, and configures API-key credentials. */
declare function createProviderApiKeyAuthMethod(params: ProviderApiKeyAuthMethodOptions): ProviderAuthMethod;
//#endregion
//#region src/plugin-sdk/provider-auth-result.d.ts
/**
 * Builds the standard auth result payload for OAuth-style provider login flows.
 *
 * The helper emits both the credential profile and the config patch expected by setup callers,
 * while normalizing model refs so OAuth imports do not persist retired catalog ids.
 */
declare function buildOauthProviderAuthResult(params: {
  /** Provider id stored on the auth profile credential and profile id. */providerId: string; /** Default model ref to seed into config when no explicit patch is supplied. */
  defaultModel: string; /** OAuth access token persisted in the generated auth profile. */
  access: string; /** Optional OAuth refresh token persisted when present. */
  refresh?: string | null; /** Optional expiry timestamp or date-like value normalized to Date-safe milliseconds. */
  expires?: number | null; /** Account email used for credential metadata and default profile naming. */
  email?: string | null; /** Human-readable account label stored in credential metadata. */
  displayName?: string | null; /** Explicit profile name used when deriving the auth profile id. */
  profileName?: string | null; /** Optional prefix added to the generated auth profile id. */
  profilePrefix?: string; /** Provider-specific credential fields merged into the OAuth credential. */
  credentialExtra?: Record<string, unknown>; /** Explicit config patch to emit after model-ref normalization. */
  configPatch?: Partial<OpenClawConfig>; /** Optional setup notes forwarded to provider login callers. */
  notes?: string[];
}): ProviderAuthResult;
//#endregion
//#region src/plugin-sdk/provider-openai-chatgpt-auth.d.ts
/**
 * Identity metadata extracted from OpenAI Codex ChatGPT OAuth tokens.
 */
type OpenAICodexAuthIdentity = {
  /**
   * ChatGPT account id used to group imported profiles under the same account.
   */
  accountId?: string;
  /**
   * ChatGPT subscription plan claim captured for diagnostics and credential metadata.
   */
  chatgptPlanType?: string;
  /**
   * Profile email from the OpenAI token profile claim when available.
   */
  email?: string;
  /**
   * Stable local profile name derived from email, account-scoped subject, or fallback id.
   */
  profileName?: string;
};
/**
 * Decodes a JWT payload without verifying signatures for local metadata extraction.
 */
declare function decodeOpenAICodexJwtPayload(token: string): Record<string, unknown> | undefined;
/**
 * Resolves stable account/profile metadata from OpenAI Codex OAuth access-token claims.
 */
declare function resolveOpenAICodexAuthIdentity(params: {
  /**
   * OpenAI Codex OAuth access token containing ChatGPT auth/profile claims.
   */
  access: string;
  /**
   * Account id supplied by the import source when the access token omits one.
   */
  accountId?: string;
}): OpenAICodexAuthIdentity;
/**
 * Resolves the OAuth access-token expiry timestamp in milliseconds.
 */
declare function resolveOpenAICodexAccessTokenExpiry(access: string): number | undefined;
/**
 * Builds persisted credential metadata for OpenAI Codex OAuth profiles.
 */
declare function buildOpenAICodexCredentialExtra(identity: OpenAICodexAuthIdentity & {
  idToken?: string;
}): Record<string, unknown> | undefined;
/**
 * Picks the imported profile name used when migrating OpenAI Codex auth.
 */
declare function resolveOpenAICodexImportProfileName(identity: Pick<OpenAICodexAuthIdentity, "accountId" | "profileName">,
/**
 * Name to use when imported metadata does not contain an account or stable subject.
 */

fallback: string): string;
//#endregion
//#region src/plugin-sdk/oauth-utils.d.ts
/**
 * Encode a flat object as application/x-www-form-urlencoded form data.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
declare function toFormUrlEncoded(data: Record<string, string>): string;
/**
 * Generate a PKCE verifier/challenge pair suitable for OAuth authorization flows.
 *
 * @deprecated OAuth provider-owned helper; keep this local to provider plugins instead.
 */
declare function generatePkceVerifierChallenge(): {
  verifier: string;
  challenge: string;
};
/** Generate a PKCE verifier/challenge pair with a 64-character hex verifier. */
declare function generateHexPkceVerifierChallenge(): {
  verifier: string;
  challenge: string;
};
//#endregion
//#region src/agents/copilot-dynamic-headers.d.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_EDITOR_VERSION = "vscode/1.107.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_USER_AGENT = "GitHubCopilotChat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_EDITOR_PLUGIN_VERSION = "copilot-chat/0.35.0";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_GITHUB_API_VERSION = "2025-04-01";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const COPILOT_INTEGRATION_ID = "vscode-chat";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare function buildCopilotIdeHeaders(params?: {
  includeApiVersion?: boolean;
}): Record<string, string>;
//#endregion
//#region src/plugin-sdk/provider-auth.d.ts
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare const DEFAULT_COPILOT_API_BASE_URL = "https://api.individual.githubcopilot.com";
/** @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins. */
declare function deriveCopilotApiBaseUrlFromToken(/** Copilot API token text that may contain a `proxy-ep` attribute. */

token: string): string | null;
/**
 * @deprecated GitHub Copilot provider-owned helper; do not use from third-party plugins.
 */
declare function resolveCopilotApiToken(params: {
  /** GitHub OAuth token exchanged for a Copilot API token. */githubToken: string; /** Environment used to resolve the default token cache path. */
  env?: NodeJS.ProcessEnv; /** Fetch implementation used for the Copilot token exchange. */
  fetchImpl?: typeof fetch; /** Explicit cache file path for the exchanged Copilot token. */
  cachePath?: string; /** Cache reader override for tests and alternate storage backends. */
  loadJsonFileImpl?: (path: string) => unknown; /** Cache writer override for tests and alternate storage backends. */
  saveJsonFileImpl?: (path: string, value: CachedCopilotToken) => void;
  /**
   * Data-residency GitHub Enterprise host (e.g. `acme.ghe.com`). Resolved from
   * config by callers that have it; the `COPILOT_GITHUB_DOMAIN` env override
   * still wins. Defaults to `github.com`.
   */
  githubDomain?: string;
  /**
   * OpenClaw config used to resolve the persisted `githubDomain` provider
   * param when an explicit `githubDomain` is not supplied. Precedence is
   * `COPILOT_GITHUB_DOMAIN` env > explicit `githubDomain` > config.
   */
  config?: OpenClawConfig;
}): Promise<{
  /** Copilot API token, from cache or fresh exchange. */token: string; /** Absolute epoch milliseconds when the Copilot API token expires. */
  expiresAt: number; /** Source marker identifying cache path or exchange endpoint. */
  source: string; /** Copilot API base URL derived from token metadata or default endpoint. */
  baseUrl: string;
}>;
/**
 * Checks whether a provider has usable config/env auth or matching local auth profiles.
 */
declare function isProviderApiKeyConfigured(params: {
  /** Provider id to check for config/env auth or local auth profiles. */provider: string; /** Optional runtime config used to resolve provider-owned API-key credentials. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Optional provider-owned acceptance predicate for a known selected credential. */
  acceptsApiKey?: (apiKey: string) => boolean;
}): boolean;
/**
 * Lists auth profile ids usable for a provider without throwing on missing stores or keychain access.
 */
declare function listUsableProviderAuthProfileIds(params: {
  /** Provider id whose usable auth profiles should be listed. */provider: string; /** Optional runtime config used to resolve auth profile order and default agent dir. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): {
  agentDir: string;
  profileIds: string[];
};
/**
 * Checks whether any usable auth profile exists for a provider.
 */
declare function isProviderAuthProfileConfigured(params: {
  /** Provider id to check for usable auth profiles. */provider: string; /** Optional runtime config used to resolve auth profile order and default agent dir. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): boolean;
/**
 * Resolves the first usable auth-profile API key for a provider in configured profile order.
 */
declare function resolveProviderAuthProfileApiKey(params: {
  /** Provider id whose first usable auth profile should resolve to an API key. */provider: string; /** Optional runtime config used to resolve auth profile order and secret refs. */
  cfg?: OpenClawConfig; /** Agent directory containing auth profiles. */
  agentDir?: string; /** Optional allowed profile credential types. */
  profileTypes?: readonly AuthProfileCredential["type"][]; /** Whether profile store reads may prompt for keychain-backed credentials. */
  allowKeychainPrompt?: boolean; /** Whether external CLI auth profiles may be discovered and included. */
  includeExternalCliAuth?: boolean;
}): Promise<string | undefined>;
//#endregion
export { type ApiKeyStorageOptions, type AuthProfileStore, CLAUDE_CLI_PROFILE_ID, CODEX_CLI_PROFILE_ID, COPILOT_EDITOR_PLUGIN_VERSION, COPILOT_EDITOR_VERSION, COPILOT_GITHUB_API_VERSION, COPILOT_INTEGRATION_ID, COPILOT_USER_AGENT, CUSTOM_LOCAL_AUTH_MARKER, type CachedCopilotToken, DEFAULT_COPILOT_API_BASE_URL, DEFAULT_OAUTH_REFRESH_MARGIN_MS, MINIMAX_OAUTH_MARKER, type OAuthCredential, type OpenAICodexAuthIdentity, type OpenClawConfig, type ProviderAuthContext, type ProviderAuthResult, type SecretInput, type SecretInputMode, type WriteOAuthCredentialsOptions, applyAuthProfileConfig, buildApiKeyCredential, buildCopilotIdeHeaders, buildOauthProviderAuthResult, buildOpenAICodexCredentialExtra, buildTokenProfileId, coerceSecretRef, createProviderApiKeyAuthMethod, decodeOpenAICodexJwtPayload, deriveCopilotApiBaseUrlFromToken, ensureApiKeyFromEnvOrPrompt, ensureApiKeyFromOptionEnvOrPrompt, ensureAuthProfileStore, ensureAuthProfileStoreForLocalUpdate, formatApiKeyPreview, generateHexPkceVerifierChallenge, generatePkceVerifierChallenge, hasConfiguredSecretInput, hasUsableOAuthCredential, isKnownEnvApiKeyMarker, isNonSecretApiKeyMarker, isProviderApiKeyConfigured, isProviderAuthProfileConfigured, listKnownProviderAuthEnvVarNames, listProfilesForProvider, listUsableProviderAuthProfileIds, normalizeApiKeyConfig, normalizeApiKeyInput, normalizeGithubCopilotDomain, normalizeOptionalSecretInput, normalizeSecretInput, normalizeSecretInputModeInput, omitEnvKeysCaseInsensitive, promptSecretRefForSetup, readClaudeCliCredentialsCached, readCodexCliCredentialsCached, removeProviderAuthProfilesWithLock, resolveCopilotApiToken, resolveDefaultSecretProviderAlias, resolveEnvApiKey, resolveNonEnvSecretRefApiKeyMarker, resolveOAuthApiKeyMarker, resolveOpenAICodexAccessTokenExpiry, resolveOpenAICodexAuthIdentity, resolveOpenAICodexImportProfileName, resolveProviderAuthProfileApiKey, resolveRequiredHomeDir, resolveSecretInputModeForEnvSelection, suggestOAuthProfileIdForLegacyDefault, toFormUrlEncoded, updateAuthProfileStoreWithLock, upsertApiKeyProfile, upsertAuthProfile, upsertAuthProfileWithLock, validateAnthropicSetupToken, validateApiKeyInput, writeOAuthCredentials };