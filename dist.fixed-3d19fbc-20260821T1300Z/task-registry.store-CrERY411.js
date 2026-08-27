import { a as deleteTaskRegistryRecordFromSqlite, d as upsertTaskDeliveryStateToSqlite, f as upsertTaskRegistryRecordToSqlite, i as deleteTaskDeliveryStateFromSqlite, l as loadTaskRegistryStateFromSqlite, m as upsertTaskWithDeliveryStateToSqlite, n as closeTaskRegistryDatabase, r as deleteTaskAndDeliveryStateFromSqlite, s as listTaskRegistryRecordsByOwnerKeyFromSqlite, u as saveTaskRegistryStateToSqlite } from "./task-registry.store.sqlite-BYtBcm7q.js";
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
