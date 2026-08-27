import { C as buildLlamaCppProviderConfig, a as selectLlamaServerAsset, b as LLAMA_CPP_DEFAULT_PORT, i as resolveManagedLlamaServerPaths, x as LLAMA_CPP_PROVIDER_ID } from "../../llama-server-assets-BCR-CXq6.js";
//#region extensions/llama-cpp/doctor-contract-api.ts
const LEGACY_BASE_URL = "local://llama-cpp";
const PROVIDER_PATH = "models.providers.llama-cpp";
const legacyConfigRules = [{
	path: [
		"models",
		"providers",
		LLAMA_CPP_PROVIDER_ID,
		"baseUrl"
	],
	message: `${PROVIDER_PATH}.baseUrl uses the retired in-process runtime. Run "openclaw doctor --fix", then rerun interactive llama.cpp setup.`,
	match: (value) => value === LEGACY_BASE_URL
}];
function normalizeCompatibilityConfig({ cfg }) {
	const provider = cfg.models?.providers?.[LLAMA_CPP_PROVIDER_ID];
	if (provider?.baseUrl !== LEGACY_BASE_URL) return {
		config: cfg,
		changes: []
	};
	const { command, presetPath } = resolveManagedLlamaServerPaths(selectLlamaServerAsset());
	const rootUrl = `http://127.0.0.1:${LLAMA_CPP_DEFAULT_PORT}`;
	const managed = {
		command,
		baseUrl: `${rootUrl}/v1`,
		healthUrl: `${rootUrl}/health`,
		args: [
			"--host",
			"127.0.0.1",
			"--port",
			String(LLAMA_CPP_DEFAULT_PORT),
			"--models-preset",
			presetPath,
			"--models-max",
			"2",
			"--metrics",
			"--no-ui"
		]
	};
	return {
		config: {
			...cfg,
			models: {
				...cfg.models,
				providers: {
					...cfg.models?.providers,
					[LLAMA_CPP_PROVIDER_ID]: buildLlamaCppProviderConfig(provider, managed)
				}
			}
		},
		changes: [`${PROVIDER_PATH}: migrated from the retired in-process runtime to managed llama-server; rerun interactive llama.cpp setup to verify/install runtime artifacts`]
	};
}
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig };
