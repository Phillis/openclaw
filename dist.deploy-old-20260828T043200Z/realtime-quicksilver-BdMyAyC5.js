//#region extensions/openai/realtime-quicksilver.ts
const OPENAI_GPT_LIVE_MODEL_PREFIX = "gpt-live";
const OPENAI_GPT_LIVE_MODELS = ["gpt-live-1-codex", "gpt-live-1-boulder-alpha"];
function isOpenAIGptLiveModel(model) {
	if (!model) return false;
	const normalized = model.trim().toLowerCase();
	return normalized === OPENAI_GPT_LIVE_MODEL_PREFIX || normalized.startsWith(`${OPENAI_GPT_LIVE_MODEL_PREFIX}-`);
}
function isSupportedOpenAIGptLiveModel(model) {
	if (!model) return false;
	const normalized = model.trim().toLowerCase();
	return OPENAI_GPT_LIVE_MODELS.includes(normalized);
}
//#endregion
export { isOpenAIGptLiveModel as n, isSupportedOpenAIGptLiveModel as r, OPENAI_GPT_LIVE_MODELS as t };
