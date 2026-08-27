import { d as resolveProviderRequestHeaders } from "./provider-request-config-DRrgUN7e.js";
import "./provider-http-RuCpoOP3.js";
import "./provider-policy-B27uKd6x.js";
//#region extensions/google/google-api-client-header.ts
function resolveGoogleApiClientHeaders(params) {
	return resolveProviderRequestHeaders({
		provider: "google",
		api: params?.api ?? "google-generative-ai",
		baseUrl: params?.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta",
		capability: params?.capability ?? "other",
		transport: params?.transport ?? "http"
	}) ?? {};
}
//#endregion
export { resolveGoogleApiClientHeaders as t };
