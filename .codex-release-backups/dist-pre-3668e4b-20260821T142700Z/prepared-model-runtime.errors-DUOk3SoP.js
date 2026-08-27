//#region src/agents/prepared-model-runtime.errors.ts
const PREPARED_MODEL_RUNTIME_OWNER_NOT_PUBLISHED_CODE = "prepared_model_runtime_owner_not_published";
var PreparedModelRuntimeOwnerNotPublishedError = class extends Error {
	constructor(message) {
		super(message);
		this.code = PREPARED_MODEL_RUNTIME_OWNER_NOT_PUBLISHED_CODE;
		this.name = "PreparedModelRuntimeOwnerNotPublishedError";
	}
};
var PreparedModelRuntimePublicationSupersededError = class extends PreparedModelRuntimeOwnerNotPublishedError {};
//#endregion
export { PreparedModelRuntimePublicationSupersededError as n, PreparedModelRuntimeOwnerNotPublishedError as t };
