import { q as ensureTaskFlowRegistryReady, tt as reloadTaskFlowRegistryFromStore } from "./task-registry-DzN8snH1.js";
import { A as ensureTaskRegistryReady, z as reloadTaskRegistryFromStore } from "./task-registry-activity-DGPs-dN3.js";
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
