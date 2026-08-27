import { t as asProtocolRecord } from "./protocol-value-normalization-CClaEoK7.js";
//#region packages/gateway-protocol/src/gateway-error-details.ts
/** Gateway JSON-RPC style error codes shared by clients and server handlers. */
const ErrorCodes = {
	/** @deprecated Retained for source compatibility; no current server emitter. */
	NOT_LINKED: "NOT_LINKED",
	/** Device exists but still needs an explicit pairing approval. */
	NOT_PAIRED: "NOT_PAIRED",
	/** @deprecated Retained for source compatibility; no current server emitter. */
	AGENT_TIMEOUT: "AGENT_TIMEOUT",
	/** Request payload failed protocol validation or method preconditions. */
	INVALID_REQUEST: "INVALID_REQUEST",
	/** Authenticated caller lacks permission for the requested operation. */
	FORBIDDEN: "FORBIDDEN",
	/** Approval resolution referenced a missing or expired approval request. */
	APPROVAL_NOT_FOUND: "APPROVAL_NOT_FOUND",
	/** Gateway service or required backend is temporarily unavailable. */
	UNAVAILABLE: "UNAVAILABLE"
};
/** Stable discriminants for structured method-level failures. */
const GatewayErrorDetailCodes = {
	MISSING_SCOPE: "MISSING_SCOPE",
	MCP_APP_VIEW_EXPIRED: "MCP_APP_VIEW_EXPIRED",
	USER_PREFS_LIMIT_EXCEEDED: "USER_PREFS_LIMIT_EXCEEDED",
	SESSION_COMPANION_BUSY: "SESSION_COMPANION_BUSY",
	PROJECT_CLONE_FAILED: "PROJECT_CLONE_FAILED",
	UNKNOWN_AGENT_ID: "UNKNOWN_AGENT_ID",
	WIZARD_NOT_FOUND: "WIZARD_NOT_FOUND"
};
const LEGACY_MISSING_SCOPE_PATTERN = /\bmissing scope:\s*([a-z0-9._-]+)/i;
/** Reads validated missing-scope details from an untrusted protocol payload. */
function readMissingScopeErrorDetails(details) {
	const record = asProtocolRecord(details);
	if (record?.code !== GatewayErrorDetailCodes.MISSING_SCOPE) return null;
	const missingScope = typeof record.missingScope === "string" ? record.missingScope.trim() : "";
	const requiredScopes = Array.isArray(record.requiredScopes) ? record.requiredScopes.map((scope) => typeof scope === "string" ? scope.trim() : "") : [];
	if (!missingScope || requiredScopes.length === 0 || requiredScopes.some((scope) => !scope)) return null;
	return {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes
	};
}
function isMcpAppViewExpiredError(error) {
	return asProtocolRecord(asProtocolRecord(error)?.details)?.code === GatewayErrorDetailCodes.MCP_APP_VIEW_EXPIRED;
}
/**
* Reads a method-level missing-scope failure, preferring structured details.
* The message fallback keeps clients compatible with gateways predating structured details.
*/
function readMissingScopeError(error) {
	const record = asProtocolRecord(error);
	if (!record) return null;
	const structured = readMissingScopeErrorDetails(record.details);
	if (structured) return structured;
	const gatewayError = record;
	const code = typeof gatewayError.gatewayCode === "string" ? gatewayError.gatewayCode : typeof gatewayError.code === "string" ? gatewayError.code : "";
	if (code !== ErrorCodes.FORBIDDEN && code !== ErrorCodes.INVALID_REQUEST) return null;
	const missingScope = (typeof gatewayError.message === "string" ? gatewayError.message : "").match(LEGACY_MISSING_SCOPE_PATTERN)?.[1];
	return missingScope ? {
		code: GatewayErrorDetailCodes.MISSING_SCOPE,
		missingScope,
		requiredScopes: [missingScope]
	} : null;
}
//#endregion
export { readMissingScopeErrorDetails as a, readMissingScopeError as i, GatewayErrorDetailCodes as n, isMcpAppViewExpiredError as r, ErrorCodes as t };
