//#region src/gateway/server-recovery-runtime-context.ts
let activeRuntime;
/** Registers the recovery principal owned by the latest process-global Gateway instance. */
function registerGatewayRecoveryRuntime(runtime) {
	const owner = Symbol("gateway-recovery-runtime");
	activeRuntime = {
		owner,
		runtime
	};
	let released = false;
	return () => {
		if (released) return;
		released = true;
		if (activeRuntime?.owner === owner) activeRuntime = void 0;
	};
}
function getGatewayRecoveryRuntime() {
	return activeRuntime?.runtime;
}
/** Dispatches detached Gateway lifecycle work through the active instance principal. */
async function dispatchGatewayLifecycleMethod(method, params, options = {}) {
	const agentParams = params;
	const { resolveGatewayContext, timeoutMs, ...dispatchOptions } = options;
	const runtime = resolveGatewayContext ? resolveGatewayContext()?.recoveryRuntime : getGatewayRecoveryRuntime();
	if (!runtime) throw new Error(`Gateway instance lifecycle dispatch unavailable for ${method}`);
	return await runtime.dispatchAgent(agentParams, timeoutMs, dispatchOptions);
}
//#endregion
export { getGatewayRecoveryRuntime as n, registerGatewayRecoveryRuntime as r, dispatchGatewayLifecycleMethod as t };
