import { p as resolveProviderHttpRequestConfig } from "./shared-DOiR3nrc.js";
import "./provider-http-gpLoOs40.js";
import { p as normalizeGoogleGenerativeAiBaseUrl, s as DEFAULT_GOOGLE_API_BASE_URL } from "./provider-policy-D7T154rP.js";
import "./thinking-api-CVb-WksZ.js";
import "./gemini-cli-provider-CxgZt2Ka.js";
import { t as parseGeminiAuth } from "./gemini-auth-B2h6lAH-.js";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-CmxNk9FN.js";
import "./onboard-LbovL8Br.js";
import "./transport-stream-BvL1AVEQ.js";
import "./provider-registration-DBV52aKB.js";
//#region extensions/google/api.ts
function resolveTrustedGoogleGenerativeAiBaseUrl(baseUrl) {
	const normalized = normalizeGoogleGenerativeAiBaseUrl(baseUrl) ?? "https://generativelanguage.googleapis.com/v1beta";
	let url;
	try {
		url = new URL(normalized);
	} catch {
		throw new Error("Google Generative AI baseUrl must be a valid https URL on generativelanguage.googleapis.com");
	}
	if (url.protocol !== "https:" || url.hostname.toLowerCase() !== "generativelanguage.googleapis.com") throw new Error("Google Generative AI baseUrl must use https://generativelanguage.googleapis.com");
	return normalized;
}
function resolveGoogleGenerativeAiHttpRequestConfig(params) {
	const baseUrl = resolveTrustedGoogleGenerativeAiBaseUrl(params.baseUrl);
	return resolveProviderHttpRequestConfig({
		baseUrl,
		defaultBaseUrl: DEFAULT_GOOGLE_API_BASE_URL,
		allowPrivateNetwork: params.request?.allowPrivateNetwork,
		headers: params.headers,
		request: params.request,
		defaultHeaders: {
			...parseGeminiAuth(params.apiKey).headers,
			...resolveGoogleApiClientHeaders({
				baseUrl,
				api: "google-generative-ai",
				capability: params.capability,
				transport: params.transport
			})
		},
		provider: "google",
		api: "google-generative-ai",
		capability: params.capability,
		transport: params.transport
	});
}
//#endregion
export { resolveGoogleGenerativeAiHttpRequestConfig as t };
