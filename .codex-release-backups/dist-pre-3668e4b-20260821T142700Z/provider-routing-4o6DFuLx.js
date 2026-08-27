import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./model-definitions-LKzPOBHs.js";
import { t as isXaiProviderId } from "./provider-id-DiXbMZh4.js";
//#region extensions/xai/provider-routing.ts
const XAI_NATIVE_ENDPOINT_HOSTS = /* @__PURE__ */ new Set(["api.x.ai"]);
function resolveHostname(value) {
	try {
		return new URL(value).hostname.toLowerCase();
	} catch {
		return;
	}
}
function isXaiNativeEndpoint(baseUrl) {
	return typeof baseUrl === "string" && XAI_NATIVE_ENDPOINT_HOSTS.has(resolveHostname(baseUrl) ?? "");
}
function shouldUseXaiResponsesTransport(params) {
	const hasDefaultXaiRoute = isXaiProviderId(params.provider) && !normalizeOptionalString(params.baseUrl);
	return params.api === "openai-responses" ? hasDefaultXaiRoute : params.api === "openai-completions" && (isXaiNativeEndpoint(params.baseUrl) || hasDefaultXaiRoute);
}
function resolveXaiTransport(params) {
	if (!shouldUseXaiResponsesTransport(params)) return;
	return {
		api: "openai-responses",
		baseUrl: normalizeOptionalString(params.baseUrl) ?? (isXaiProviderId(params.provider) ? "https://api.x.ai/v1" : void 0)
	};
}
//#endregion
export { resolveXaiTransport as t };
