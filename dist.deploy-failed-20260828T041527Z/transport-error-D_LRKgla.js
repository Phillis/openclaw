//#region src/gateway/transport-error.ts
var GatewayTransportError = class extends Error {
	constructor(params) {
		super(params.message);
		this.name = "GatewayTransportError";
		this.kind = params.kind;
		this.connectionDetails = params.connectionDetails;
		if (params.code !== void 0) this.code = params.code;
		if (params.reason !== void 0) this.reason = params.reason;
		if (params.timeoutMs !== void 0) this.timeoutMs = params.timeoutMs;
	}
};
function isGatewayTransportError(value) {
	if (value instanceof GatewayTransportError) return true;
	if (!(value instanceof Error) || value.name !== "GatewayTransportError") return false;
	return "kind" in value && (value.kind === "closed" || value.kind === "timeout") && "connectionDetails" in value && typeof value.connectionDetails === "object" && value.connectionDetails !== null;
}
/** Transport uncertainty permits read recovery or an exclusively ownership-locked mutation. */
function isGatewayRpcUnavailableError(error) {
	if (isGatewayTransportError(error)) return error.kind === "timeout" || [
		void 0,
		1006,
		1012
	].includes(error.code);
	return error instanceof Error && error.name === "Error" && (/^gateway closed \((?:1006|1012)\): [^\r\n]*$/u.test(error.message) || /^gateway timeout after \d+ms(?:\n[\s\S]*)?$/u.test(error.message));
}
//#endregion
export { isGatewayRpcUnavailableError as n, isGatewayTransportError as r, GatewayTransportError as t };
