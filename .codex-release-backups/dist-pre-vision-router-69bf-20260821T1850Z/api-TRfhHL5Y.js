import { p as resolveProviderHttpRequestConfig } from "./shared-DEePW_9S.js";
import "./provider-http-D7FntVgP.js";
import { p as normalizeGoogleGenerativeAiBaseUrl, s as DEFAULT_GOOGLE_API_BASE_URL } from "./provider-policy-BnEdDFlj.js";
import "./thinking-api-BjpQ2GTt.js";
import "./gemini-cli-provider-Ce7IHV_Z.js";
import { t as parseGeminiAuth } from "./gemini-auth-Db6o72LA.js";
import { t as resolveGoogleApiClientHeaders } from "./google-api-client-header-cDLy6dWb.js";
import "./onboard-DxgrxVK9.js";
import "./transport-stream-C9u0Yoc7.js";
import "./provider-registration-CNw7Ke8y.js";
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
