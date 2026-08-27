import "../types.openclaw-ClnaeuRs.js";
import "../manifest-registry-BxbBLC7n.js";
import { r as LoadInstalledPluginIndexParams, t as InstalledPluginIndex } from "../installed-plugin-index-types-CJPGKiY7.js";
import "../installed-plugin-index-D0ZQ7Jlt.js";
import "../plugin-metadata-snapshot.types-Unqs8JMC.js";
import "../config-normalization-shared-Cl2Pix2b.js";
import { t as InstalledPluginIndexStoreOptions } from "../installed-plugin-index-store-B_MbHlTC.js";
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