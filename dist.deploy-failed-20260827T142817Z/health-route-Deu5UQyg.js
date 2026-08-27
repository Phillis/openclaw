import { a as writeRuntimeJson } from "./runtime-DtFIMC-W.js";
//#region src/cli/gateway-cli/health-route.ts
async function resolveRouteRpcOptions(args, deps) {
	if (args.localPortOverride === void 0) return args.rpc;
	const config = await (deps.readBestEffortConfig ?? (await import("./read-best-effort-config.runtime.js")).readBestEffortConfig)();
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
		writeRuntimeJson(runtime, await (deps.callGateway ?? (await import("./gateway-rpc-DlTqPzAp.js")).callGatewayFromCliWithTransport)("health", rpc, void 0, { defaultTimeoutMs: 1e4 }));
	} catch (error) {
		if (!rpc) {
			runtime.error(String(error));
			runtime.exit(1);
			return;
		}
		const [healthModule, configModule, callModule] = await Promise.all([
			deps.emitReachableGatewayAuthDiagnostic ? void 0 : import("./health-ucfCHFsw.js"),
			deps.readBestEffortConfig ? void 0 : import("./read-best-effort-config.runtime.js"),
			deps.formatGatewayAuthErrorJson && deps.formatGatewayClientRequestErrorJson && deps.formatGatewayTransportErrorJson ? void 0 : import("./call-n89JPEIA.js")
		]);
		const emitReachableGatewayAuthDiagnostic = deps.emitReachableGatewayAuthDiagnostic ?? healthModule?.emitReachableGatewayAuthDiagnostic;
		const readBestEffortConfig = deps.readBestEffortConfig ?? configModule?.readBestEffortConfig;
		if (!emitReachableGatewayAuthDiagnostic || !readBestEffortConfig) throw error;
		if (await emitReachableGatewayAuthDiagnostic({
			error,
			config: rpc.config ?? await readBestEffortConfig(),
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
