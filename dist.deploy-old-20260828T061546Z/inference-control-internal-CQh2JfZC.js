//#region src/gateway/worker-environments/inference-control-internal.ts
const sessionDrainByService = /* @__PURE__ */ new WeakMap();
function registerWorkerInferenceSessionDrain(service, beginDrain) {
	sessionDrainByService.set(service, beginDrain);
}
function beginWorkerInferenceSessionDrain(service, sessionId) {
	if (typeof service !== "object" || service === null) return;
	return sessionDrainByService.get(service)?.(sessionId);
}
//#endregion
export { registerWorkerInferenceSessionDrain as n, beginWorkerInferenceSessionDrain as t };
