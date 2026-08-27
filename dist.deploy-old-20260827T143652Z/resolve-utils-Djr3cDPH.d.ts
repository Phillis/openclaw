import { K as GroupPolicy } from "./types.openclaw-DhIzMzKO.js";
import { O as RuntimeEnv } from "./manifest-registry-CCZunLSs.js";

//#region src/config/runtime-group-policy.d.ts
type RuntimeGroupPolicyResolution = {
  groupPolicy: GroupPolicy;
  providerMissingFallbackApplied: boolean;
};
type ResolveProviderRuntimeGroupPolicyParams = {
  providerConfigPresent: boolean;
  groupPolicy?: GroupPolicy;
  defaultGroupPolicy?: GroupPolicy;
};
type GroupPolicyDefaultsConfig = {
  channels?: {
    defaults?: {
      groupPolicy?: GroupPolicy;
    };
  };
};
/** Read the shared channels default group policy used by provider-specific resolvers. */
declare function resolveDefaultGroupPolicy(cfg: GroupPolicyDefaultsConfig): GroupPolicy | undefined;
/**
 * Resolve the standard channel-provider policy.
 * Configured providers default open; missing provider config defaults allowlist.
 */
declare function resolveOpenProviderRuntimeGroupPolicy(params: ResolveProviderRuntimeGroupPolicyParams): RuntimeGroupPolicyResolution;
/**
 * Log the missing-provider fail-closed fallback once per provider/account.
 * Returns true only when this call emitted the warning.
 */
declare function warnMissingProviderGroupPolicyFallbackOnce(params: {
  providerMissingFallbackApplied: boolean;
  providerKey: string;
  accountId?: string;
  blockedLabel?: string;
  log: (message: string) => void;
}): boolean;
//#endregion
//#region src/channels/allowlists/resolve-utils.d.ts
declare function mergeAllowlist(params: {
  existing?: Array<string | number>;
  additions: string[];
}): string[];
/** Logs a compact resolved/unresolved allowlist lookup summary when there is anything to report. */
declare function summarizeMapping(label: string, mapping: string[], unresolved: string[], runtime: RuntimeEnv): void;
//#endregion
export { warnMissingProviderGroupPolicyFallbackOnce as a, resolveOpenProviderRuntimeGroupPolicy as i, summarizeMapping as n, resolveDefaultGroupPolicy as r, mergeAllowlist as t };