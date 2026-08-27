import { c as formatConnectErrorMessage } from "./connect-error-details-Do3cAiyu.js";
//#region packages/gateway-client/src/protocol-request.ts
var GatewayProtocolRequestError = class extends Error {
	constructor(error) {
		super(error.message ?? "request failed");
		this.name = "GatewayProtocolRequestError";
		this.code = error.code ?? "UNAVAILABLE";
		this.gatewayCode = this.code;
		this.details = error.details;
		this.retryable = error.retryable === true;
		this.retryAfterMs = error.retryAfterMs;
	}
};
/** A local transport deadline, distinct from a Gateway's authoritative rejection. */
var GatewayProtocolRequestTimeoutError = class extends Error {
	constructor(params, message = `gateway request timed out after ${params.timeoutMs}ms: ${params.method}`) {
		super(message);
		this.code = "CLIENT_TIMEOUT";
		this.name = "GatewayProtocolRequestTimeoutError";
		this.method = params.method;
		this.timeoutMs = params.timeoutMs;
		this.requestSent = params.requestSent;
	}
};
//#endregion
//#region packages/gateway-client/src/request-error.ts
var GatewayClientRequestError = class extends GatewayProtocolRequestError {
	constructor(error) {
		super({
			...error,
			message: formatConnectErrorMessage({
				message: error.message,
				details: error.details
			})
		});
		this.name = "GatewayClientRequestError";
	}
};
//#endregion
export { GatewayProtocolRequestError as n, GatewayProtocolRequestTimeoutError as r, GatewayClientRequestError as t };
