import { h as normalizeSecretInputString, v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import "./enable-CD9vPpHS.js";
import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.js";
import "./common-ciEJghJz.js";
import "./external-content-IQUFD6xt.js";
import "./web-fetch-utils-Bxd0cgz7.js";
import "./web-shared-C6DzgiTT.js";
import "./web-search-provider-common-Dj6BPmvL.js";
import { r as withStrictWebToolsEndpoint } from "./web-guarded-fetch-Nk7X8ejY.js";
//#region src/agents/tools/web-search-citation-redirect.ts
/**
* Citation redirect resolver for web search results.
*
* Follows provider citation redirect URLs through the strict web-tools network guard.
*/
const REDIRECT_TIMEOUT_MS = 5e3;
/**
* Resolve a citation redirect URL to its final destination using a HEAD request.
* Returns the original URL if resolution fails or times out.
*/
async function resolveCitationRedirectUrl(url) {
	try {
		return await withStrictWebToolsEndpoint({
			url,
			init: { method: "HEAD" },
			timeoutMs: REDIRECT_TIMEOUT_MS
		}, async ({ finalUrl }) => finalUrl || url);
	} catch {
		return url;
	}
}
//#endregion
//#region src/agents/tools/web-search-provider-credentials.ts
/**
* Web-search provider credential resolver.
*
* Reads config values, env-backed secret refs, and provider-specific environment variables.
*/
/**
* Resolves web-search provider credentials from config values, secret refs, or
* provider-specific environment variables.
*/
/** Returns the first usable credential for a web-search provider. */
function resolveWebSearchProviderCredential(params) {
	const credentialRef = resolveSecretInputRef({ value: params.credentialValue }).ref;
	if (credentialRef) {
		if (credentialRef.source !== "env") return;
		const fromEnvRef = normalizeSecretInput(process.env[credentialRef.id]);
		if (fromEnvRef) return fromEnvRef;
		return;
	}
	const fromConfig = normalizeSecretInput(normalizeSecretInputString(params.credentialValue));
	if (fromConfig) return fromConfig;
	for (const envVar of params.envVars) {
		const fromEnv = normalizeSecretInput(process.env[envVar]);
		if (fromEnv) return fromEnv;
	}
}
//#endregion
export { resolveCitationRedirectUrl as n, resolveWebSearchProviderCredential as t };
