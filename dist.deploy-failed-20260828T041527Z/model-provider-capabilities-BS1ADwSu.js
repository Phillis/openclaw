import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BoHcdoGc.js";
import { r as resolveManifestProviderAuthChoices } from "./provider-auth-choices-DZw3W3ra.js";
import { i as supportsSetupManualSecret } from "./setup-inference-auth-options-DDoD9isn.js";
//#region src/gateway/server-methods/model-provider-capabilities.ts
function resolveModelProviderCapabilities(params) {
	const env = params.env ?? process.env;
	const resolveProvider = (provider) => resolveProviderIdForAuth(provider, {
		config: params.config,
		env,
		workspaceDir: params.workspaceDir,
		includeUntrustedWorkspacePlugins: false,
		metadataSnapshot: params.metadataSnapshot
	});
	const capabilities = /* @__PURE__ */ new Map();
	for (const choice of resolveManifestProviderAuthChoices({
		config: params.config,
		env,
		workspaceDir: params.workspaceDir,
		includeUntrustedWorkspacePlugins: false,
		metadataSnapshot: params.metadataSnapshot
	})) {
		const provider = resolveProvider(choice.providerId);
		const current = capabilities.get(provider);
		const apiKeySupported = choice.methodId === "api-key";
		const quickApiKeySetup = apiKeySupported && supportsSetupManualSecret(choice);
		capabilities.set(provider, {
			provider,
			apiKeySupported: current?.apiKeySupported === true || apiKeySupported,
			quickApiKeySetup: current?.quickApiKeySetup === true || quickApiKeySetup
		});
	}
	return {
		capabilities: [...capabilities.values()].toSorted((a, b) => a.provider.localeCompare(b.provider)),
		resolveProvider
	};
}
//#endregion
export { resolveModelProviderCapabilities as t };
