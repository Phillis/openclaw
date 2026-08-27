import { t as ErrorCodes } from "./gateway-error-details-BWo6Le6w.js";
import { l as formatValidationErrors, s as errorShape } from "./error-codes-CMSvT5-d.js";
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
//#endregion
export { validateGatewayMethodParams as n, assertValidParams as t };
