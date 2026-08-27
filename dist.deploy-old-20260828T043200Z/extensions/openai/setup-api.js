import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as createOpenAIProvider } from "../../provider-contract-api-D3yaG_c_.js";
//#region extensions/openai/setup-api.ts
async function runOpenAIProviderAuthMethod(methodId, ctx) {
	const { buildOpenAIProvider } = await import("./openai-provider.js");
	const method = buildOpenAIProvider().auth.find((entry) => entry.id === methodId);
	if (!method) return { profiles: [] };
	return method.run(ctx);
}
function buildOpenAISetupProvider() {
	const provider = createOpenAIProvider();
	for (const method of provider.auth) method.run = async (ctx) => runOpenAIProviderAuthMethod(method.id, ctx);
	return provider;
}
var setup_api_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Setup",
	description: "Lightweight OpenAI setup hooks",
	register(api) {
		api.registerProvider(buildOpenAISetupProvider());
	}
});
//#endregion
export { buildOpenAISetupProvider, setup_api_default as default };
