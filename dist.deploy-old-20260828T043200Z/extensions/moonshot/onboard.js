import { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, MOONSHOT_DEFAULT_MODEL_ID, MOONSHOT_DEFAULT_MODEL_REF, buildMoonshotProvider } from "./provider-catalog.js";
import { createDefaultModelPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/moonshot/onboard.ts
const moonshotPresetAppliers = createDefaultModelPresetAppliers({
	primaryModelRef: MOONSHOT_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const defaultModel = buildMoonshotProvider().models.find(({ id }) => id === MOONSHOT_DEFAULT_MODEL_ID);
		return defaultModel ? {
			providerId: "moonshot",
			api: "openai-completions",
			baseUrl,
			defaultModel,
			defaultModelId: MOONSHOT_DEFAULT_MODEL_ID,
			aliases: [{
				modelRef: MOONSHOT_DEFAULT_MODEL_REF,
				alias: "Kimi"
			}]
		} : null;
	}
});
function applyMoonshotConfig(cfg) {
	return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_BASE_URL);
}
function applyMoonshotConfigCn(cfg) {
	return moonshotPresetAppliers.applyConfig(cfg, MOONSHOT_CN_BASE_URL);
}
//#endregion
export { applyMoonshotConfig, applyMoonshotConfigCn };
