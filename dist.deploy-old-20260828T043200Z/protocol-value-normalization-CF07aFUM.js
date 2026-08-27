//#region packages/gateway-protocol/src/protocol-value-normalization.ts
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
export { normalizeOptionalProtocolString as n, isNonEmptyProtocolString as t };
