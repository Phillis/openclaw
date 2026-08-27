import { a as PluginStateSyncKeyedStore, t as OpenKeyedStoreOptions } from "../plugin-state-store.types-DK1KZWMb.js";

//#region src/plugin-state/plugin-state-store.d.ts
/** Opens a sync plugin-state namespace for a non-core plugin id. */
declare function createPluginStateSyncKeyedStore<T>(pluginId: string, options: OpenKeyedStoreOptions): PluginStateSyncKeyedStore<T>;
//#endregion
export { createPluginStateSyncKeyedStore };