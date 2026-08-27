import "./retryable-network-errors-y3dAO9Jq.js";
import "./retry-after-CiglPIF1.js";
import "./retry-DIUON3ys.js";
import "./retry-policy-D9ZaAo4y.js";
//#region src/plugin-sdk/retry-runtime.ts
/** Transient failures that prove the request did not reach the remote server. */
const PRE_CONNECT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	"EAI_AGAIN",
	"ECONNREFUSED",
	"ENETUNREACH",
	"ENOTFOUND",
	"UND_ERR_CONNECT_TIMEOUT"
]);
/** Network failures that are transient for idempotent or deduplicated requests. */
const TRANSIENT_NETWORK_ERROR_CODES = /* @__PURE__ */ new Set([
	...PRE_CONNECT_NETWORK_ERROR_CODES,
	"ECONNRESET",
	"EPIPE",
	"ETIMEDOUT",
	"UND_ERR_BODY_TIMEOUT",
	"UND_ERR_HEADERS_TIMEOUT",
	"UND_ERR_SOCKET"
]);
/** Classifies a normalized transport code without imposing a plugin-specific error shape. */
function classifyTransientNetworkErrorCode(code) {
	const normalized = code?.trim().toUpperCase();
	if (!normalized) return;
	if (PRE_CONNECT_NETWORK_ERROR_CODES.has(normalized)) return "pre-connect";
	return TRANSIENT_NETWORK_ERROR_CODES.has(normalized) ? "ambiguous" : void 0;
}
//#endregion
export { classifyTransientNetworkErrorCode as t };
