import { p as resolveProviderHttpRequestConfig } from "./shared-BEAvjECH.js";
import "./provider-http-RuCpoOP3.js";
import { p as normalizeGoogleGenerativeAiBaseUrl, s as DEFAULT_GOOGLE_API_BASE_URL } from "./provider-policy-DyHcvvDy.js";
import "./thinking-api-BHX8Lun3.js";
import "./gemini-cli-provider-BeWRHRiJ.js";
import { t as parseGeminiAuth } from "./gemini-auth-Db6o72LA.js";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-D8_DuF6k.js";
import "./onboard-DxgrxVK9.js";
import "./transport-stream-Bz1UF-e2.js";
import "./provider-registration-5PuwJc3T.js";
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
