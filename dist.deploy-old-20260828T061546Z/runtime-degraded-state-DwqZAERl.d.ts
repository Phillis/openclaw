import { r as SecretRefSource } from "./types.secrets-ktKWXaKr.js";
//#region src/secrets/runtime-degraded-state.d.ts
type SecretOwnerKind = "account" | "capability" | "gateway" | "provider" | "route" | "unknown";
type SecretAssignmentDisposition = "fail-closed" | "isolate";
type DegradedSecretOwner = {
  ownerKind: Exclude<SecretOwnerKind, "unknown">;
  ownerId: string;
  state: "unavailable";
  /** Operator-facing reload state. Omitted legacy/runtime-discovered owners are cold. */
  degradationState?: "cold" | "stale";
  paths: string[];
  refKeys: string[];
  reason: string;
  /** Shared provider failure that made this owner unavailable. Runtime-internal diagnostic data. */
  providerFailures?: Array<{
    source: SecretRefSource;
    provider: string;
  }>;
  /** Ref-scoped failure retained when this owner also has a provider-scoped outage. */
  refFailureReason?: string;
};
/** Throws the canonical typed error when an owner was isolated at startup. */
declare function assertSecretOwnerAvailable(ownerKind: DegradedSecretOwner["ownerKind"], ownerId: string): void;
/** Returns whether an owner is available without activating or resolving its secrets. */
declare function isSecretOwnerAvailable(ownerKind: DegradedSecretOwner["ownerKind"], ownerId: string): boolean;
//#endregion
export { isSecretOwnerAvailable as i, SecretOwnerKind as n, assertSecretOwnerAvailable as r, SecretAssignmentDisposition as t };