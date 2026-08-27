import { U as ensureTaskFlowRegistryReady, Z as reloadTaskFlowRegistryFromStore } from "./task-registry-1cqXcWjA.js";
import { A as reloadTaskRegistryFromStore, x as ensureTaskRegistryReady } from "./task-registry-activity-CbVvLa99.js";
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
