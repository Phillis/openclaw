import "../types.openclaw-Bon4guJK.js";
import "../manifest-registry-BTc0dNop.js";
import { r as LoadInstalledPluginIndexParams, t as InstalledPluginIndex } from "../installed-plugin-index-types-DqGs1nBu.js";
import "../installed-plugin-index-n0ogEwjU.js";
import "../plugin-metadata-snapshot.types-B_pmflbL.js";
import "../config-normalization-shared-SCW3-07V.js";
import { t as InstalledPluginIndexStoreOptions } from "../installed-plugin-index-store-DmLQvgHr.js";
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