import { n as ResolverContext, r as SecretDefaults, t as SecretTargetRegistryEntry } from "../../target-registry-types-BSrwtukn.js";
import "../../channel-secret-basic-runtime-CWI_O9hj.js";
//#region extensions/nextcloud-talk/src/secret-contract.d.ts
declare const channelSecrets: {
  secretTargetRegistryEntries: SecretTargetRegistryEntry[];
  collectRuntimeConfigAssignments: (params: {
    config: {
      channels?: Record<string, unknown>;
    };
    defaults?: SecretDefaults;
    context: ResolverContext;
  }) => void;
};
declare const secretTargetRegistryEntries: SecretTargetRegistryEntry[], collectRuntimeConfigAssignments: (params: {
  config: {
    channels?: Record<string, unknown>;
  };
  defaults?: SecretDefaults;
  context: ResolverContext;
}) => void;
//#endregion
export { channelSecrets, collectRuntimeConfigAssignments, secretTargetRegistryEntries };