import { i as formatErrorMessageWithCode } from "./errors-Ccx0R-_Z.js";
import { d as errorShape } from "./validation-errors-rELRlKfn.js";
//#region src/gateway/error-shape.ts
/** Builds a wire error from an unknown failure without diagnostic class names. */
function errorShapeFromError(code, error, opts) {
	return errorShape(code, formatErrorMessageWithCode(error), opts);
}
//#endregion
export { errorShapeFromError as t };
