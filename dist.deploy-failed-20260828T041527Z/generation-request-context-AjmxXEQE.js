import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-ClkR7QK5.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-DOiR3nrc.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-DZ1L5hge.js";
import "./provider-http-gpLoOs40.js";
import { t as OPENROUTER_BASE_URL } from "./provider-catalog-TanGhq8c.js";
//#region extensions/openrouter/generation-request-context.ts
async function resolveOpenRouterGenerationRequestContext(params) {
	const auth = await resolveApiKeyForProvider({
		provider: "openrouter",
		cfg: params.cfg,
		agentDir: params.agentDir,
		store: params.authStore
	});
	if (!auth.apiKey) throw new Error("OpenRouter API key missing");
	return resolveProviderHttpRequestConfig({
		baseUrl: params.cfg.models?.providers?.openrouter?.baseUrl,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		allowPrivateNetwork: false,
		defaultHeaders: {
			Authorization: `Bearer ${auth.apiKey}`,
			...params.jsonContentType ? { "Content-Type": "application/json" } : {},
			"HTTP-Referer": "https://openclaw.ai",
			"X-OpenRouter-Title": "OpenClaw"
		},
		request: sanitizeConfiguredModelProviderRequest(params.cfg.models?.providers?.openrouter?.request),
		provider: "openrouter",
		capability: params.capability,
		transport: "http"
	});
}
//#endregion
export { resolveOpenRouterGenerationRequestContext as t };
