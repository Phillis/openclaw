import { t as PLUGIN_REGISTRY_STATE } from "./runtime-state-key-Cno8k69C.js";
import { t as getActivePluginRegistryWorkspaceDirFromStateCore } from "./runtime-workspace-state-kLYmgwOl.js";
//#region src/plugins/runtime-state.ts
function getPluginRegistryState() {
	return globalThis[PLUGIN_REGISTRY_STATE];
}
function getActivePluginRegistryWorkspaceDirFromState() {
	return getActivePluginRegistryWorkspaceDirFromStateCore();
}
//#endregion
export { getPluginRegistryState as n, getActivePluginRegistryWorkspaceDirFromState as t };
