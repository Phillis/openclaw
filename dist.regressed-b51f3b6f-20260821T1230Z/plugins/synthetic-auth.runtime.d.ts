import { r as LoadInstalledPluginIndexParams, t as InstalledPluginIndex } from "../installed-plugin-index-types-C4mEs_4Z.js";
import { n as InstalledPluginIndexStoreOptions } from "../installed-plugin-index-store-BtVMRm-J.js";

//#region src/plugins/plugin-registry-snapshot.d.ts
type PluginRegistrySnapshot = InstalledPluginIndex;
type LoadPluginRegistryParams = LoadInstalledPluginIndexParams & InstalledPluginIndexStoreOptions & {
  index?: PluginRegistrySnapshot;
  preferPersisted?: boolean;
  allowCurrent?: boolean;
};
//#endregion
//#region src/plugins/synthetic-auth.runtime.d.ts
type SyntheticAuthProviderRefParams = LoadPluginRegistryParams & {
  index?: PluginRegistrySnapshot;
  registryDiagnostics?: readonly unknown[];
};
/** Lists provider refs that can satisfy synthetic auth profile lookups. */
declare function resolveRuntimeSyntheticAuthProviderRefs(params?: SyntheticAuthProviderRefParams): string[];
/** Returns synthetic-auth refs plus whether the control-plane data source was complete. */
declare function resolveRuntimeSyntheticAuthProviderRefState(params?: SyntheticAuthProviderRefParams): {
  refs: string[];
  complete: boolean;
};
//#endregion
export { resolveRuntimeSyntheticAuthProviderRefState, resolveRuntimeSyntheticAuthProviderRefs };