import { t as ErrorCodes } from "./gateway-error-details-C2IaYyht.js";
import { d as errorShape, t as formatValidationErrors } from "./validation-errors-rELRlKfn.js";
//#region src/gateway/server-methods/validation.ts
/** Validate params and return the standard method error without emitting a response. */
function validateGatewayMethodParams(params, validate, method) {
	if (validate(params)) return;
	return errorShape(ErrorCodes.INVALID_REQUEST, `invalid ${method} params: ${formatValidationErrors(validate.errors)}`);
}
/** Validate params and emit the standard INVALID_REQUEST response on failure. */
function assertValidParams(params, validate, method, respond) {
	const error = validateGatewayMethodParams(params, validate, method);
	if (!error) return true;
	respond(false, void 0, error);
	return false;
}
/** Bind a core method to its schema before exposing it through the open plugin registry. */
function defineValidatedGatewayMethod(method, validate, handler) {
	return (options) => {
		if (!assertValidParams(options.params, validate, method, options.respond)) return;
		return handler({
			...options,
			params: options.params
		});
	};
}
//#endregion
export { defineValidatedGatewayMethod as n, validateGatewayMethodParams as r, assertValidParams as t };
