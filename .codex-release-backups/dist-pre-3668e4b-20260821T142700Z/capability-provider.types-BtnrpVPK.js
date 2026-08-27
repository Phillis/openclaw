//#region src/plugins/capability-provider.types.ts
/** Permanent provider rejection recorded as a terminal worker failure. */
var WorkerProviderError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "invalid_profile";
		this.name = "WorkerProviderError";
	}
};
//#endregion
export { WorkerProviderError as t };
