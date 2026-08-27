import { A as ModelMediaInputConfig, D as ModelCompatConfig, T as ModelApi, i as OpenClawConfig } from "./types.openclaw-Bon4guJK.js";
import { h as ThinkingLevelMap } from "./types-Sg3pk96c.js";
import "./types-BgZZ1ot4.js";
import { i as AuthProfileStore } from "./types-D0nbqcAi.js";
import { D as ModelCatalogStatus } from "./manifest-registry-BTc0dNop.js";
import "./plugin-metadata-snapshot-zyXEJFTB.js";
import "./usage-Dicm0IrQ.js";
//#region src/plugins/provider-catalog-outcome.d.ts
type ProviderCatalogOutcome = {
  provider: string;
  /** Auth profile tested by discovery; omission means provider-wide auth. */
  profileId?: string;
  status: "ready" | "auth-rejected" | "unavailable";
};
//#endregion
//#region src/agents/model-catalog.types.d.ts
/** Input modalities a catalog entry can advertise. */
type ModelInputType = "text" | "image" | "audio" | "video" | "document";
type ModelContextWindowOption = {
  id: string;
  label: string;
  contextWindow: number;
};
/** Normalized model metadata exposed by the agent model catalog. */
type ModelCatalogEntry = {
  id: string;
  name: string;
  provider: string;
  /** Provider-owned strongest-first picker order; internal and never projected to clients. */
  providerOrder?: number;
  alias?: string;
  api?: ModelApi;
  /** Private transport provenance for route matching; never project directly to clients. */
  baseUrl?: string;
  contextWindow?: number;
  contextWindows?: ModelContextWindowOption[];
  contextWindowDefault?: string;
  contextTokens?: number;
  reasoning?: boolean;
  /** Config-authored reasoning override; internal provenance, never project to clients. */
  configuredReasoning?: boolean;
  /** Concrete runtime owner of thinking policy; internal and never project to clients. */
  thinkingPolicyProvider?: string;
  /** Provider-owned effort support for this exact physical model route. */
  thinkingLevelMap?: ThinkingLevelMap;
  input?: ModelInputType[];
  params?: Record<string, unknown>;
  compat?: ModelCompatConfig;
  mediaInput?: ModelMediaInputConfig;
  status?: ModelCatalogStatus;
  statusReason?: string;
  replaces?: string[];
  replacedBy?: string;
};
/** Logical catalog rows plus the physical variants used for route selection. */
type ModelCatalogSnapshot = {
  entries: ModelCatalogEntry[];
  routeVariants: ModelCatalogEntry[];
  /** Provider-owned outcome of each live catalog request in this generation. */
  providerOutcomes?: readonly ProviderCatalogOutcome[];
  /** Static provider-hook rows captured alongside the full lifecycle generation. */
  staticEntries?: ModelCatalogEntry[];
  /**
   * `false` only when this snapshot came from a degraded load (discovery threw,
   * static or empty fallback). Absent/`true` means authoritative — consumers that
   * destroy durable state (e.g. resetting a pinned model override) must treat only
   * an explicit `false` as degraded, so unrelated hand-built snapshots stay safe.
   */
  authoritative?: boolean;
};
//#endregion
//#region src/secrets/provider-env-vars.d.ts
/** Manifest-provided evidence that a provider auth credential exists outside config. */
type ProviderAuthEvidence = {
  type: "local-file-with-env";
  fileEnvVar?: string;
  fallbackPaths?: readonly string[];
  requiresAnyEnv?: readonly string[];
  requiresAllEnv?: readonly string[];
  credentialMarker: string;
  source?: string;
};
//#endregion
//#region src/agents/model-auth-env.d.ts
type EnvApiKeyLookupOptions = {
  config?: OpenClawConfig;
  workspaceDir?: string;
  aliasMap?: Readonly<Record<string, string>>;
  candidateMap?: Readonly<Record<string, readonly string[]>>;
  authEvidenceMap?: Readonly<Record<string, readonly ProviderAuthEvidence[]>>;
  setupProviderFallbackRefs?: readonly string[];
  skipSetupProviderFallback?: boolean;
};
//#endregion
//#region src/agents/model-auth-runtime-shared.d.ts
/** Resolved credential material and provenance for one provider request. */
type ResolvedProviderAuth = {
  apiKey?: string;
  profileId?: string;
  source: string;
  mode: "api-key" | "oauth" | "token" | "aws-sdk";
};
/** Require a normalized API key or throw a provider-auth error. */
declare function requireApiKey(auth: ResolvedProviderAuth, provider: string): string;
//#endregion
//#region src/agents/model-auth-provider.d.ts
type ProviderCredentialPrecedence = "profile-first" | "env-first";
/** Resolves the credential that should be used for one provider request. */
declare function resolveApiKeyForProviderCore(params: {
  provider: string;
  cfg?: OpenClawConfig;
  profileId?: string;
  preferredProfile?: string;
  store?: AuthProfileStore;
  agentDir?: string;
  workspaceDir?: string;
  /** When true, treat profileId as a user-locked selection that must not be
   *  silently overridden by env/config credentials. */
  lockedProfile?: boolean;
  forceRefresh?: boolean;
  credentialPrecedence?: ProviderCredentialPrecedence;
  /** Skip implicit profile discovery for a prepared env/config fallback attempt. */
  allowAuthProfileFallback?: boolean;
  /** Skip plugin setup fallback when the prepared route already excludes it. */
  skipSetupProviderFallback?: boolean;
  modelId?: string;
  modelApi?: string;
  /** Keep SecretRef-backed model credentials opaque until a sentinel-aware transport boundary. */
  secretSentinels?: boolean;
}): Promise<ResolvedProviderAuth>;
//#endregion
//#region src/agents/model-auth-model.d.ts
type ModelAuthMode = "api-key" | "oauth" | "token" | "mixed" | "aws-sdk" | "unknown";
//#endregion
//#region src/agents/model-auth-runtime.d.ts
/** Precomputed provider-auth lookup tables reused during one runtime turn. */
type RuntimeProviderAuthLookup = {
  envApiKey: Pick<EnvApiKeyLookupOptions, "aliasMap" | "candidateMap" | "authEvidenceMap" | "skipSetupProviderFallback">;
  setupProviderFallbackRefs?: readonly string[];
  syntheticAuthProviderRefs?: readonly string[];
  syntheticAuthProviderRefsComplete?: boolean;
};
//#endregion
//#region src/plugin-sdk/provider-model-types.d.ts
/** A concrete provider route. Order expresses provider default, never credential precedence. */
type ProviderModelRouteAuthRequirement = "api-key" | "subscription";
type ProviderRouteOverridePresence = "none" | "present";
type ProviderModelRouteRuntimePolicy = {
  /** Agent runtime ids that can reproduce this route without losing transport behavior. */
  compatibleIds: readonly string[];
};
//#endregion
export { ModelAuthMode as a, requireApiKey as c, ProviderCatalogOutcome as d, RuntimeProviderAuthLookup as i, ModelCatalogEntry as l, ProviderModelRouteRuntimePolicy as n, resolveApiKeyForProviderCore as o, ProviderRouteOverridePresence as r, ResolvedProviderAuth as s, ProviderModelRouteAuthRequirement as t, ModelCatalogSnapshot as u };