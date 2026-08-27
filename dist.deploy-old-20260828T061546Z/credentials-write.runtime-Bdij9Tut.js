import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
//#region extensions/matrix/src/matrix/credentials-write.runtime.ts
const loadMatrixCredentialsRuntime = createLazyRuntimeModule(() => import("./credentials-Bqp8iNY4.js"));
async function saveMatrixCredentials(...args) {
	return (await loadMatrixCredentialsRuntime()).saveMatrixCredentials(...args);
}
async function saveBackfilledMatrixDeviceId(...args) {
	return (await loadMatrixCredentialsRuntime()).saveBackfilledMatrixDeviceId(...args);
}
async function touchMatrixCredentials(...args) {
	return (await loadMatrixCredentialsRuntime()).touchMatrixCredentials(...args);
}
//#endregion
export { saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
