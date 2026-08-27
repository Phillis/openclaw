import { n as ResolverContext, r as SecretDefaults, t as SecretTargetRegistryEntry } from "../../target-registry-types-B_YdM07w.js";
//#region extensions/nostr/src/secret-contract.d.ts
declare const secretTargetRegistryEntries: SecretTargetRegistryEntry[];
declare function collectRuntimeConfigAssignments(params: {
  config: {
    channels?: Record<string, unknown>;
  };
  defaults?: SecretDefaults;
  context: ResolverContext;
}): void;
declare const channelSecrets: {
  secretTargetRegistryEntries: SecretTargetRegistryEntry[];
  collectRuntimeConfigAssignments: typeof collectRuntimeConfigAssignments;
};
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };