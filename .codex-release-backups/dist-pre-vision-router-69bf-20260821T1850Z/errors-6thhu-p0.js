import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./error-runtime-oXQewkZq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
//#region extensions/matrix/src/matrix/errors.ts
function formatMatrixErrorReason(err) {
	return normalizeLowercaseStringOrEmpty(formatErrorMessage(err));
}
function isMatrixNotFoundError(err) {
	const errObj = err;
	if (errObj?.statusCode === 404 || errObj?.body?.errcode === "M_NOT_FOUND") return true;
	const message = formatMatrixErrorReason(err);
	return message.includes("m_not_found") || message.includes("[404]") || message.includes("not found");
}
//#endregion
export { isMatrixNotFoundError as n, formatMatrixErrorReason as t };
