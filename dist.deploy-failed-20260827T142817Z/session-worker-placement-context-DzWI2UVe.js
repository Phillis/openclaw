import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { t as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BULcX9xX.js";
import { n as getFallbackGatewayContext } from "./server-plugin-fallback-context-CA_ZMhwm.js";
import { t as createWorkerSessionPlacementStore } from "./placement-store-DlroVJnD.js";
//#region src/gateway/session-worker-placement-context.ts
const localPlacementState = resolveGlobalSingleton(Symbol.for("openclaw.localSessionWorkerPlacementContext"), () => ({}), (state) => {
	state.store = void 0;
});
/** Uses the live Gateway owner when present; embedded runtimes share the same lightweight DB. */
function resolveSessionWorkerPlacementContext() {
	const gatewayContext = getPluginRuntimeGatewayRequestScope()?.context ?? getFallbackGatewayContext();
	if (gatewayContext?.workerSessionPlacementService) return gatewayContext;
	localPlacementState.store ??= createWorkerSessionPlacementStore();
	return { workerSessionPlacementService: localPlacementState.store };
}
//#endregion
export { resolveSessionWorkerPlacementContext };
