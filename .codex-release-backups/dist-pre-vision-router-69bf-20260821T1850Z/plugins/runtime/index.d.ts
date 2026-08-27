import { N as CreatePluginRuntimeOptions, P as PluginRuntime } from "../../host-capability-types-BB7_xyrh.js";

//#region src/plugins/runtime/index.d.ts
declare function createPluginRuntime(_options?: CreatePluginRuntimeOptions): PluginRuntime;
//#endregion
export { type PluginRuntime, createPluginRuntime };