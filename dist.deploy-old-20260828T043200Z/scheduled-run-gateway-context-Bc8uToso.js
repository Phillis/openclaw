import { o as withPluginRuntimeGatewayContextResolver } from "./gateway-request-scope-B19X7f09.js";
//#region src/gateway/scheduled-run-gateway-context.ts
/**
* Supplies a Gateway request context to scheduler-owned agent runs.
*
* Timer ticks, hook dispatch queues, and heartbeat wakeups have no Gateway
* request of their own, so trusted built-in tools (terminal, dashboard) resolve
* no context and fail mid-run. RPC-triggered runs already inherit a scope from
* their caller and must keep it.
*/
function fenceScheduledGatewayContextResolver(resolveGatewayContext) {
	if (!resolveGatewayContext) return;
	return () => {
		return resolveGatewayContext()?.resolveGatewayContext?.() ?? void 0;
	};
}
/**
* Runs scheduler-owned work with a Gateway context.
*
* Detached work replaces any request scope inherited when it was queued or
* armed. Caller-owned work must stay outside this boundary.
*/
async function runWithScheduledGatewayContext(params) {
	const resolveGatewayContext = params.resolveGatewayContext;
	if (!resolveGatewayContext) return await params.run();
	return await withPluginRuntimeGatewayContextResolver(resolveGatewayContext, params.run, { inheritRequestScope: false });
}
//#endregion
export { runWithScheduledGatewayContext as n, fenceScheduledGatewayContextResolver as t };
