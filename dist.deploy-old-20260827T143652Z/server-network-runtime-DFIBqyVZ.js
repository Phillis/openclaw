import { r as ensureGlobalUndiciEnvProxyDispatcher } from "./undici-global-dispatcher-BQQC_-bK.js";
//#region src/gateway/server-network-runtime.ts
/** Applies process-wide gateway network runtime setup. */
function bootstrapGatewayNetworkRuntime() {
	ensureGlobalUndiciEnvProxyDispatcher();
}
//#endregion
export { bootstrapGatewayNetworkRuntime };
