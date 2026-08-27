import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-BEAvjECH.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-Bqbi48q-.js";
import "./provider-http-RuCpoOP3.js";
//#region extensions/fal/http-config.ts
const DEFAULT_FAL_BASE_URL = "https://fal.run";
function resolveFalConfiguredBaseUrl(cfg) {
	return normalizeOptionalString(cfg?.models?.providers?.fal?.baseUrl);
}
async function resolveFalHttpRequestConfig(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "fal",
		cfg: params.req.cfg,
		agentDir: params.req.agentDir,
		store: params.req.authStore
	});
	if (!auth.apiKey) throw new Error("fal API key missing");
	return resolveProviderHttpRequestConfig({
		baseUrl: params.baseUrl ?? resolveFalConfiguredBaseUrl(params.req.cfg),
		defaultBaseUrl: DEFAULT_FAL_BASE_URL,
		allowPrivateNetwork: false,
		defaultHeaders: {
			Authorization: `Key ${auth.apiKey}`,
			"Content-Type": "application/json"
		},
		provider: "fal",
		capability: params.capability,
		transport: "http"
	});
}
//#endregion
export { resolveFalHttpRequestConfig as t };
