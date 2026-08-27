import { U as ensureTaskFlowRegistryReady, Z as reloadTaskFlowRegistryFromStore } from "./task-registry-CV6EhTBX.js";
import { A as reloadTaskRegistryFromStore, x as ensureTaskRegistryReady } from "./task-registry-activity-Yc53RcW7.js";
//#region src/tasks/runtime-internal.ts
function ensureTaskRuntimeStateReady() {
	ensureTaskFlowRegistryReady();
	ensureTaskRegistryReady();
}
function reloadTaskRuntimeStateFromStore() {
	reloadTaskFlowRegistryFromStore();
	reloadTaskRegistryFromStore();
}
//#endregion
export { reloadTaskRuntimeStateFromStore as n, ensureTaskRuntimeStateReady as t };
