import { U as ensureTaskFlowRegistryReady, Z as reloadTaskFlowRegistryFromStore } from "./task-registry-DrR4kwK-.js";
import { A as reloadTaskRegistryFromStore, x as ensureTaskRegistryReady } from "./task-registry-activity-CRGhk-1D.js";
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
