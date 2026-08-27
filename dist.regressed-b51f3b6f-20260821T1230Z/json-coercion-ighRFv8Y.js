import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
//#region packages/normalization-core/src/json-coercion.ts
/** Parses JSON without throwing, returning undefined for invalid input. */
function safeParseJson(value) {
	try {
		return JSON.parse(value);
	} catch {
		return;
	}
}
/** Parses JSON into a non-array record, returning undefined for every other result. */
function safeParseJsonRecord(value) {
	return asOptionalRecord(safeParseJson(value));
}
//#endregion
export { safeParseJsonRecord as n, safeParseJson as t };
