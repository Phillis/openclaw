import { a as OLLAMA_DEFAULT_API_KEY } from "../../defaults-BNbpVpwQ.js";
import { i as buildOllamaProvider, o as capLocalOllamaProviderContext } from "../../provider-models-D_v4dC88.js";
import { a as shouldUseSyntheticOllamaAuth, r as resolveOllamaDiscoveryResult, t as OLLAMA_PROVIDER_ID } from "../../discovery-shared-DmNtuPcd.js";
//#region extensions/ollama/provider-discovery.ts
function resolveOllamaPluginConfig(ctx) {
	return (ctx.config.plugins?.entries ?? {}).ollama?.config ?? {};
}
async function runOllamaDiscovery(ctx) {
	return await resolveOllamaDiscoveryResult({
		ctx,
		pluginConfig: resolveOllamaPluginConfig(ctx),
		buildProvider: async (...args) => capLocalOllamaProviderContext(await buildOllamaProvider(...args))
	});
}
const ollamaProviderDiscovery = {
	id: OLLAMA_PROVIDER_ID,
	label: "Ollama",
	docsPath: "/providers/ollama",
	envVars: ["OLLAMA_API_KEY"],
	auth: [],
	resolveSyntheticAuth: ({ provider, providerConfig }) => {
		if (!shouldUseSyntheticOllamaAuth(providerConfig)) return;
		return {
			apiKey: OLLAMA_DEFAULT_API_KEY,
			source: `models.providers.${provider ?? "ollama"} (synthetic local key)`,
			mode: "api-key"
		};
	},
	catalog: {
		order: "late",
		run: runOllamaDiscovery
	}
};
//#endregion
export { ollamaProviderDiscovery as default, ollamaProviderDiscovery };
