import { a as writeRuntimeJson } from "./runtime-LRpY2Icg.js";
//#region src/cli/gateway-cli/health-route.ts
async function resolveRouteRpcOptions(args, deps) {
	if (args.localPortOverride === void 0) return args.rpc;
	const config = await (deps.readNonObservingHealthConfig ?? (await import("./health-CeqxuFQG.js")).readNonObservingHealthConfig)();
	return {
		...args.rpc,
		localPortOverride: args.localPortOverride,
		config: {
			...config,
			gateway: {
				...config.gateway,
				mode: "local",
				port: args.localPortOverride
			}
		}
	};
}
/** Run the successful JSON path without loading text presentation modules. */
async function runGatewayHealthJsonRoute(args, runtime, deps = {}) {
	let rpc;
	try {
		rpc = await resolveRouteRpcOptions(args, deps);
		writeRuntimeJson(runtime, await (deps.callGateway ?? (await import("./gateway-rpc-BH5pry0E.js")).callGatewayFromCliWithTransport)("health", rpc, void 0, {
			defaultTimeoutMs: 1e4,
			sharedStateMode: "read-only"
		}));
	} catch (error) {
		if (!rpc) throw error;
		const [healthModule, callModule] = await Promise.all([deps.emitReachableGatewayAuthDiagnostic && deps.readNonObservingHealthConfig ? void 0 : import("./health-CeqxuFQG.js"), deps.formatGatewayAuthErrorJson && deps.formatGatewayClientRequestErrorJson && deps.formatGatewayTransportErrorJson ? void 0 : import("./call-Dplee5Oc.js")]);
		const emitReachableGatewayAuthDiagnostic = deps.emitReachableGatewayAuthDiagnostic ?? healthModule?.emitReachableGatewayAuthDiagnostic;
		const readNonObservingHealthConfig = deps.readNonObservingHealthConfig ?? healthModule?.readNonObservingHealthConfig;
		if (!emitReachableGatewayAuthDiagnostic || !readNonObservingHealthConfig) throw error;
		if (await emitReachableGatewayAuthDiagnostic({
			error,
			config: rpc.config ?? await readNonObservingHealthConfig(),
			runtime,
			timeoutMs: Number(rpc.timeout ?? "10000"),
			token: rpc.token,
			password: rpc.password,
			localPortOverride: rpc.localPortOverride,
			json: true
		})) return;
		const formatGatewayAuthErrorJson = deps.formatGatewayAuthErrorJson ?? callModule?.formatGatewayAuthErrorJson;
		const formatGatewayClientRequestErrorJson = deps.formatGatewayClientRequestErrorJson ?? callModule?.formatGatewayClientRequestErrorJson;
		const formatGatewayTransportErrorJson = deps.formatGatewayTransportErrorJson ?? callModule?.formatGatewayTransportErrorJson;
		const payload = formatGatewayAuthErrorJson?.(error) ?? formatGatewayClientRequestErrorJson?.(error) ?? formatGatewayTransportErrorJson?.(error);
		if (payload) {
			writeRuntimeJson(runtime, payload);
			runtime.exit(1);
			return;
		}
		throw error;
	}
}
//#endregion
export { runGatewayHealthJsonRoute };
