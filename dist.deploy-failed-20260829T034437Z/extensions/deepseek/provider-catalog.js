import { n as DEEPSEEK_MODEL_CATALOG, t as DEEPSEEK_BASE_URL } from "./models-DYOru1tw.js";
//#region extensions/deepseek/provider-catalog.ts
function buildDeepSeekProvider() {
	return {
		baseUrl: DEEPSEEK_BASE_URL,
		api: "openai-completions",
		models: structuredClone(DEEPSEEK_MODEL_CATALOG)
	};
}
//#endregion
export { buildDeepSeekProvider };
