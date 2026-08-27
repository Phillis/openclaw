import { r as __exportAll } from "./rolldown-runtime-DE1ahGrs.js";
import { $ as ZodString, Gr as _coercedDate, H as ZodNumber, Kr as _coercedNumber, Ur as _coercedBigint, Wr as _coercedBoolean, a as ZodBigInt, g as ZodDate, qr as _coercedString, s as ZodBoolean } from "./schemas-CZ9Toj_c.js";
//#region node_modules/zod/v4/classic/coerce.js
var coerce_exports = /* @__PURE__ */ __exportAll({
	bigint: () => bigint,
	boolean: () => boolean,
	date: () => date,
	number: () => number,
	string: () => string
});
function string(params) {
	return _coercedString(ZodString, params);
}
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
	return _coercedBigint(ZodBigInt, params);
}
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
export { string as n, coerce_exports as t };
