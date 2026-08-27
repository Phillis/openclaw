import { n as OpenClawConfig } from "./types.openclaw-BssW6c46.js";
import { n as SecretRef } from "./types.secrets-ktKWXaKr.js";
import { n as PluginManifestRegistry } from "./manifest-registry-BvU-V0_L.js";
import { n as SecretOwnerKind, t as SecretAssignmentDisposition } from "./runtime-degraded-state-DwqZAERl.js";
//#region src/secrets/resolve-types.d.ts
/** Shared per-runtime cache for resolved SecretRefs and file provider payloads. */
type SecretRefResolveCache = {
  /** In-flight or completed resolution promise keyed by `secretRefKey(ref)`. */
  resolvedByRefKey?: Map<string, Promise<unknown>>;
  /** In-flight or completed parsed file-provider payload keyed by provider alias. */
  filePayloadByProvider?: Map<string, Promise<unknown>>;
};
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
export { SecretDefaults as n, ResolverContext as t };