import { MISTRAL_BASE_URL, MISTRAL_DEFAULT_MODEL_ID, MISTRAL_DEFAULT_MODEL_REF, buildMistralModelDefinition } from "./model-definitions.js";
import { createDefaultModelPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/mistral/onboard.ts
const { applyConfig: applyMistralConfig, applyProviderConfig: applyMistralProviderConfig } = createDefaultModelPresetAppliers({
	primaryModelRef: MISTRAL_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "mistral",
		api: "openai-completions",
		baseUrl: MISTRAL_BASE_URL,
		defaultModel: buildMistralModelDefinition(),
		defaultModelId: MISTRAL_DEFAULT_MODEL_ID,
		aliases: [{
			modelRef: MISTRAL_DEFAULT_MODEL_REF,
			alias: "Mistral"
		}]
	})
});
//#endregion
export { applyMistralConfig, applyMistralProviderConfig };
