//#region src/plugins/capability-provider.types.ts
/** Provision failed after allocation and the provider could not prove cleanup completed. */
var WorkerProvisionCleanupError = class extends AggregateError {
	constructor(leaseId, provisionError, cleanupError) {
		super([provisionError, cleanupError], "Worker provision failed after allocation and cleanup is indeterminate", { cause: provisionError });
		this.provisionError = provisionError;
		this.cleanupError = cleanupError;
		this.code = "cleanup_indeterminate";
		this.name = "WorkerProvisionCleanupError";
		this.leaseId = leaseId.trim();
		if (!this.leaseId) throw new TypeError("Worker provision cleanup lease id must be non-empty");
	}
};
/** Permanent provider rejection recorded as a terminal worker failure. */
var WorkerProviderError = class extends Error {
	constructor(message) {
		super(message);
		this.code = "invalid_profile";
		this.name = "WorkerProviderError";
	}
	static cleanupIndeterminate(leaseId, provisionError, cleanupError) {
		return new WorkerProvisionCleanupError(leaseId, provisionError, cleanupError);
	}
	static isCleanupIndeterminate(error) {
		return error instanceof WorkerProvisionCleanupError;
	}
};
//#endregion
export { WorkerProviderError as t };
