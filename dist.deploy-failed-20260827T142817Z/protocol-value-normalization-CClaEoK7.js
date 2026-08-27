//#region packages/gateway-protocol/src/protocol-value-normalization.ts
/** Narrows untrusted protocol values to non-array records. */
function isProtocolRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
/** Converts untrusted protocol values to records without accepting arrays. */
function asProtocolRecord(value) {
	return isProtocolRecord(value) ? value : null;
}
/** Checks string presence without changing wire-significant whitespace. */
function isNonEmptyProtocolString(value) {
	return typeof value === "string" && value.length > 0;
}
/** Trims an optional untrusted string and rejects empty results. */
function normalizeOptionalProtocolString(value) {
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
//#endregion
export { normalizeOptionalProtocolString as i, isNonEmptyProtocolString as n, isProtocolRecord as r, asProtocolRecord as t };
