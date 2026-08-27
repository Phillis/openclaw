import { _ as upsertTaskWithDeliveryStateToSqlite, a as deleteTaskDeliveryStateFromSqlite, c as listTaskRegistryRecordsByOwnerKeyFromSqlite, h as upsertTaskRegistryRecordToSqlite, i as deleteTaskAndDeliveryStateFromSqlite, m as upsertTaskDeliveryStateToSqlite, o as deleteTaskRegistryRecordFromSqlite, p as saveTaskRegistryStateToSqlite, r as closeTaskRegistryDatabase, u as loadTaskRegistryStateFromSqlite } from "./task-registry.store.sqlite-7NOoQ9mC.js";
//#region src/tasks/task-registry.store.ts
const defaultTaskRegistryStore = {
	loadSnapshot: loadTaskRegistryStateFromSqlite,
	saveSnapshot: saveTaskRegistryStateToSqlite,
	listTasksForOwnerKey: listTaskRegistryRecordsByOwnerKeyFromSqlite,
	upsertTaskWithDeliveryState: upsertTaskWithDeliveryStateToSqlite,
	upsertTask: upsertTaskRegistryRecordToSqlite,
	deleteTaskWithDeliveryState: deleteTaskAndDeliveryStateFromSqlite,
	deleteTask: deleteTaskRegistryRecordFromSqlite,
	upsertDeliveryState: upsertTaskDeliveryStateToSqlite,
	deleteDeliveryState: deleteTaskDeliveryStateFromSqlite,
	close: closeTaskRegistryDatabase
};
let configuredTaskRegistryStore = defaultTaskRegistryStore;
let configuredTaskRegistryObservers = null;
function getTaskRegistryStore() {
	return configuredTaskRegistryStore;
}
function getTaskRegistryObservers() {
	return configuredTaskRegistryObservers;
}
function configureTaskRegistryRuntime(params) {
	if (params.store) configuredTaskRegistryStore = params.store;
	if ("observers" in params) configuredTaskRegistryObservers = params.observers ?? null;
}
function resetTaskRegistryRuntimeForTests() {
	configuredTaskRegistryStore.close?.();
	configuredTaskRegistryStore = defaultTaskRegistryStore;
	configuredTaskRegistryObservers = null;
}
//#endregion
export { resetTaskRegistryRuntimeForTests as i, getTaskRegistryObservers as n, getTaskRegistryStore as r, configureTaskRegistryRuntime as t };
