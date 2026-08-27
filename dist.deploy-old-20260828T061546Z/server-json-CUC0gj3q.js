import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
//#region src/gateway/server-json.ts
/** Safely parses an optional JSON string, returning a payloadJSON wrapper on parse failure. */
function parseGatewayPayload(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed) return;
	try {
		return JSON.parse(trimmed);
	} catch {
		return { payloadJSON: value };
	}
}
//#endregion
export { parseGatewayPayload as t };
