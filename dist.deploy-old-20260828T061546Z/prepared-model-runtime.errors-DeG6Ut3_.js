//#region src/agents/prepared-model-runtime.errors.ts
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {};
var PreparedModelRuntimePublicationSupersededError = class extends PreparedModelRuntimeOwnerNotPublishedError {};
//#endregion
export { PreparedModelRuntimePublicationSupersededError as n, PreparedModelRuntimeOwnerNotPublishedError as t };
