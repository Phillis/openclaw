//#region src/gateway/server-runtime-service-shared.ts
/** Creates a heartbeat runner placeholder for minimal/test gateway service state. */
function createNoopHeartbeatRunner() {
	return {
		stop: () => {},
		updateConfig: (_cfg) => {}
	};
}
//#endregion
export { createNoopHeartbeatRunner as t };
