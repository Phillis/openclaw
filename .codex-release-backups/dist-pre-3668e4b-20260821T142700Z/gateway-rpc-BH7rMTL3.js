import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
//#region src/cli/gateway-rpc.ts
const gatewayRpcRuntimeLoader = createLazyImportLoader(() => import("./gateway-rpc.runtime.js"));
async function loadGatewayRpcRuntime() {
	return gatewayRpcRuntimeLoader.load();
}
function addGatewayClientOptions(cmd, defaults) {
	return cmd.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--timeout <ms>", "Timeout in ms", String(defaults?.timeoutMs ?? 3e4)).option("--expect-final", "Wait for final response (agent)", false);
}
async function callGatewayFromCli(method, opts, params, extra) {
	return await callGatewayFromCliWithTransport(method, opts, params, extra);
}
/** Resolve whether CLI Gateway options select the implicit local Gateway. */
async function isImplicitLocalGatewayTargetFromCli(opts) {
	return await (await loadGatewayRpcRuntime()).isImplicitLocalGatewayTargetFromCliRuntime(opts);
}
/** Internal CLI facade for callers that need transport or auth policy overrides. */
async function callGatewayFromCliWithTransport(method, opts, params, extra) {
	return await (await loadGatewayRpcRuntime()).callGatewayFromCliRuntime(method, opts, params, extra);
}
//#endregion
export { isImplicitLocalGatewayTargetFromCli as i, callGatewayFromCli as n, callGatewayFromCliWithTransport as r, addGatewayClientOptions as t };
