import { n as PluginStateKeyedStore, t as OpenKeyedStoreOptions } from "./plugin-state-store.types-Bw8X6IMk.js";
//#region extensions/memory-core/src/dreaming-state.d.ts
type MemoryCoreOpenKeyedStore = <T>(options: OpenKeyedStoreOptions) => PluginStateKeyedStore<T>;
declare function configureMemoryCoreDreamingState(openKeyedStore: MemoryCoreOpenKeyedStore): void;
//#endregion
export { configureMemoryCoreDreamingState as n, MemoryCoreOpenKeyedStore as t };