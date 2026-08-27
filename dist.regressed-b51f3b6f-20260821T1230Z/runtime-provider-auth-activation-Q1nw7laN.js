//#region src/secrets/runtime-provider-auth-activation.ts
let activationHandler = null;
function registerProviderAuthRuntimeSnapshotActivation(handler) {
	activationHandler = handler;
}
function registerProviderAuthRuntimeSnapshotActivationOwner(owner) {
	registerProviderAuthRuntimeSnapshotActivation(async (params) => await owner.runExclusive(async () => {
		if (!owner.isCurrent(params.snapshot, params.expectedRevision)) return false;
		try {
			owner.assertValid(params.snapshot);
			if (!params.activateSnapshotIfCurrent()) return false;
			await owner.publish(params.snapshot);
			return true;
		} catch (error) {
			return owner.onError(error, params.snapshot);
		}
	}));
}
function clearProviderAuthRuntimeSnapshotActivation() {
	activationHandler = null;
}
async function activateProviderAuthRuntimeSnapshot(params) {
	return activationHandler ? await activationHandler(params) : params.activateSnapshotIfCurrent();
}
//#endregion
export { clearProviderAuthRuntimeSnapshotActivation as n, registerProviderAuthRuntimeSnapshotActivationOwner as r, activateProviderAuthRuntimeSnapshot as t };
