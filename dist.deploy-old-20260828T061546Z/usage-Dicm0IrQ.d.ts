import { i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import { i as AuthProfileStore, r as AuthProfileFailureReason } from "./types-D0nbqcAi.js";
import { r as PluginMetadataSnapshot } from "./plugin-metadata-snapshot.types-B_pmflbL.js";
import { r as SqliteWalMaintenance, t as OpenClawStateDatabase } from "./openclaw-state-db-contract-BPw6fYCC.js";
import { DatabaseSync } from "node:sqlite";
//#region src/agents/auth-profiles/external-cli-discovery.d.ts
/** External CLI auth discovery mode used while loading auth profile stores. */
type ExternalCliAuthDiscovery = {
  mode: "none";
  allowKeychainPrompt?: false;
  config?: OpenClawConfig;
} | {
  mode: "existing";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
} | {
  mode: "scoped";
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  providerIds?: Iterable<string>;
  profileIds?: Iterable<string>;
};
//#endregion
//#region src/state/openclaw-agent-db-contract.d.ts
/** Open per-agent SQLite database handle plus lifecycle maintenance. */
type OpenClawAgentDatabase = {
  agentId: string;
  db: DatabaseSync;
  path: string;
  walMaintenance: SqliteWalMaintenance;
};
//#endregion
//#region src/agents/auth-profiles/sqlite.d.ts
type AuthProfileDatabase = OpenClawAgentDatabase | OpenClawStateDatabase;
//#endregion
//#region src/agents/auth-profiles/store.d.ts
type LoadAuthProfileStoreOptions = {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  database?: AuthProfileDatabase;
  externalCli?: ExternalCliAuthDiscovery;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
};
type SaveAuthProfileStoreOptions = {
  filterExternalAuthProfiles?: boolean;
  preserveOrderProfileIds?: Iterable<string>;
  preserveStateProfileIds?: Iterable<string>;
  pruneOrderProfileIds?: Iterable<string>;
  sharedStoreWrite?: boolean;
  syncExternalCli?: boolean;
};
/** Apply an auth store update inside the SQLite write lock; null only on lock contention. */
declare function updateAuthProfileStoreWithLock(params: {
  agentDir?: string;
  sharedStoreWrite?: boolean;
  stateDir?: string;
  saveOptions?: SaveAuthProfileStoreOptions;
  updater: (store: AuthProfileStore) => boolean;
}): Promise<AuthProfileStore | null>;
/** Loads the effective runtime store for an agent, including inherited main profiles. */
declare function loadAuthProfileStoreForRuntime(agentDir?: string, options?: LoadAuthProfileStoreOptions): AuthProfileStore;
/** Ensure an auth store is available, including runtime/external profile overlays. */
declare function ensureAuthProfileStore(agentDir?: string, options?: {
  allowKeychainPrompt?: boolean;
  config?: OpenClawConfig;
  externalCli?: ExternalCliAuthDiscovery;
  externalCliProviderIds?: Iterable<string>;
  externalCliProfileIds?: Iterable<string>;
  inheritedAuthDir?: string;
  readOnly?: boolean;
  syncExternalCli?: boolean;
}): AuthProfileStore;
//#endregion
//#region src/agents/auth-profiles/credential-state.d.ts
/** Reason code for why a stored auth credential can or cannot be used. */
type AuthCredentialReasonCode = "ok" | "missing_credential" | "invalid_expires" | "expired" | "unresolved_ref" | "malformed_api_key";
//#endregion
//#region src/agents/provider-auth-aliases.d.ts
/** Inputs that control plugin metadata and trust scope for auth alias lookup. */
type ProviderAuthAliasLookupParams = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  env?: NodeJS.ProcessEnv;
  includeUntrustedWorkspacePlugins?: boolean;
  metadataSnapshot?: Pick<PluginMetadataSnapshot, "plugins">;
};
//#endregion
//#region src/agents/auth-profiles/order.d.ts
/** Reason a profile is or is not eligible for provider auth. */
type AuthProfileEligibilityReasonCode = AuthCredentialReasonCode | "profile_missing" | "provider_mismatch" | "mode_mismatch";
/** Eligibility decision for one auth profile candidate. */
type AuthProfileEligibility = {
  eligible: boolean;
  reasonCode: AuthProfileEligibilityReasonCode;
};
/** Resolves whether a profile can be used for a provider right now. */
declare function resolveAuthProfileEligibility(params: {
  cfg?: OpenClawConfig;
  authAliasLookupParams?: ProviderAuthAliasLookupParams;
  store: AuthProfileStore;
  provider: string;
  profileId: string;
  now?: number;
}): AuthProfileEligibility;
type ResolveAuthProfileOrderParams = {
  cfg?: OpenClawConfig;
  store: AuthProfileStore;
  provider: string;
  /** Exact prepared metadata for request paths that must not rediscover plugin aliases. */
  authAliasLookupParams?: ProviderAuthAliasLookupParams;
  preferredProfile?: string;
  /** Model that will consume the profile, for model-scoped cooldowns. */
  forModel?: string;
  /** Read-only status keeps unresolved refs ordered so availability remains unknown. */
  readinessMode?: "execution" | "read-only";
};
/** Resolves ordered usable auth profile ids for a provider. */
declare function resolveAuthProfileOrder(params: ResolveAuthProfileOrderParams): string[];
//#endregion
//#region src/agents/auth-profiles/usage-state.d.ts
/**
 * Check if a profile is currently in cooldown (due to rate limits, overload, or other transient failures).
 */
declare function isProfileInCooldown(store: AuthProfileStore, profileId: string, now?: number, forModel?: string): boolean;
/**
 * Return the soonest `unusableUntil` timestamp (ms epoch) among the given
 * profiles, or `null` when no profile has a recorded cooldown. Note: the
 * returned timestamp may be in the past if the cooldown has already expired.
 */
declare function getSoonestCooldownExpiry(store: AuthProfileStore, profileIds: string[], options?: {
  now?: number;
  forModel?: string;
}): number | null;
//#endregion
//#region src/agents/auth-profiles/usage.d.ts
/** Starts bounded background refreshes for long WHAM-only profile blocks. */
declare function maybeReprobeWhamBlockedProfiles(params: {
  store: AuthProfileStore;
  profileIds: string[];
  agentDir?: string;
  forModel?: string;
  now?: number;
}): void;
/**
 * Infer the most likely reason all candidate profiles are currently unavailable.
 *
 * We prefer explicit active `disabledReason` values (for example billing/auth)
 * over generic cooldown buckets, then fall back to failure-count signals.
 */
declare function resolveProfilesUnavailableReason(params: {
  store: AuthProfileStore;
  profileIds: string[];
  now?: number;
}): AuthProfileFailureReason | null;
//#endregion
export { resolveAuthProfileEligibility as a, loadAuthProfileStoreForRuntime as c, isProfileInCooldown as i, updateAuthProfileStoreWithLock as l, resolveProfilesUnavailableReason as n, resolveAuthProfileOrder as o, getSoonestCooldownExpiry as r, ensureAuthProfileStore as s, maybeReprobeWhamBlockedProfiles as t, AuthProfileDatabase as u };