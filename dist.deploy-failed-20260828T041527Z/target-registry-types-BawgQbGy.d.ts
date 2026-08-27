import { n as OpenClawConfig, tt as SecretRef } from "./types.openclaw-R2xZRh0U.js";
import { n as PluginManifestRegistry } from "./manifest-registry-Bng9dXoi.js";
//#region src/secrets/resolve-types.d.ts
/** Shared per-runtime cache for resolved SecretRefs and file provider payloads. */
type SecretRefResolveCache = {
  /** In-flight or completed resolution promise keyed by `secretRefKey(ref)`. */
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  /** In-flight or completed parsed file-provider payload keyed by provider alias. */
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
//#endregion
//#region src/secrets/runtime-degraded-state.d.ts
type SecretOwnerKind = "account" | "capability" | "gateway" | "provider" | "route" | "unknown";
type SecretAssignmentDisposition = "fail-closed" | "isolate";
//#endregion
//#region src/secrets/runtime-shared.d.ts
type SecretResolverWarningCode = "SECRETS_REF_OVERRIDES_PLAINTEXT" | "SECRETS_REF_IGNORED_INACTIVE_SURFACE" | "SECRETS_OWNER_UNAVAILABLE" | "WEB_SEARCH_PROVIDER_INVALID_AUTODETECT" | "WEB_SEARCH_AUTODETECT_SELECTED" | "WEB_SEARCH_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_SEARCH_KEY_UNRESOLVED_NO_FALLBACK" | "WEB_FETCH_PROVIDER_INVALID_AUTODETECT" | "WEB_FETCH_AUTODETECT_SELECTED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_FALLBACK_USED" | "WEB_FETCH_PROVIDER_KEY_UNRESOLVED_NO_FALLBACK";
type SecretResolverWarning = {
  code: SecretResolverWarningCode;
  path: string;
  message: string;
};
type SecretAssignment = {
  ref: SecretRef;
  path: string;
  expected: "string" | "string-or-object";
  ownerKind: SecretOwnerKind;
  ownerId: string;
  requiredForGateway: boolean;
  disposition: SecretAssignmentDisposition;
  /** Digest of the complete owner config captured before secret materialization. */
  ownerContractDigest?: string;
  apply: (value: unknown) => void;
  /** Applies the canonical unavailable state when this owner must start cold. */
  applyUnavailable?: () => void;
};
type ResolverContext = {
  sourceConfig: OpenClawConfig;
  env: NodeJS.ProcessEnv;
  cache: SecretRefResolveCache;
  manifestRegistry?: Pick<PluginManifestRegistry, "plugins">;
  warnings: SecretResolverWarning[];
  warningKeys: Set<string>;
  assignments: SecretAssignment[];
};
type SecretDefaults = NonNullable<OpenClawConfig["secrets"]>["defaults"];
//#endregion
//#region src/secrets/target-registry-types.d.ts
/** Config document that owns a registered secret-bearing target. */
type SecretTargetConfigFile = "openclaw.json" | "auth-profile-store";
/** Storage shape used by a target: inline SecretInput or a sibling `*Ref` field. */
type SecretTargetShape = "secret_input" | "sibling_ref";
/** Resolved value shape accepted by runtime and apply validation. */
type SecretTargetExpected = "string" | "string-or-object";
/** Auth profile families that have separate secret target coverage. */
type AuthProfileType = "api_key" | "token";
/**
 * Registry metadata for one configurable secret-bearing value.
 */
type SecretTargetRegistryEntry = {
  /** Stable id used by plans, audits, docs, and targeted discovery filters. */
  id: string;
  /** Plan/configure target family; aliases keep CLI-facing names additive. */
  targetType: string;
  targetTypeAliases?: string[];
  /** Config document where the value is discovered or rewritten. */
  configFile: SecretTargetConfigFile;
  /** Dot-path pattern for the secret-bearing value; `*` captures path segments. */
  pathPattern: string;
  /** Structured pattern segments preserve literal plugin IDs containing dots. */
  pathPatternSegments?: string[];
  /** Optional sibling SecretRef path materialized from the same captures as `pathPattern`. */
  refPathPattern?: string;
  /** Whether the registered value stores a SecretInput directly or via a sibling ref field. */
  secretShape: SecretTargetShape;
  /** Runtime value shape accepted after SecretRef resolution. */
  expectedResolvedValue: SecretTargetExpected;
  /** Enables `openclaw secrets apply` targeting for this entry. */
  includeInPlan: boolean;
  /** Enables interactive/non-interactive configure candidate generation. */
  includeInConfigure: boolean;
  /** Enables plaintext/unresolved-ref audit scanning. */
  includeInAudit: boolean;
  /** Captured path segment that names the owning provider, when applicable. */
  providerIdPathSegmentIndex?: number;
  /** Captured path segment that names the owning account/profile, when applicable. */
  accountIdPathSegmentIndex?: number;
  /** Auth-profile family for auth-profiles.json entries. */
  authProfileType?: AuthProfileType;
  /** Enables provider-shadowing diagnostics for provider-auth surfaces with fallback order. */
  trackProviderShadowing?: boolean;
};
//#endregion
export { ResolverContext as n, SecretDefaults as r, SecretTargetRegistryEntry as t };