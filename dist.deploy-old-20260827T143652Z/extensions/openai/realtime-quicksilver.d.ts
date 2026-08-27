//#region extensions/openai/realtime-quicksilver.d.ts
declare const OPENAI_GPT_LIVE_MODELS: readonly ["gpt-live-1-codex", "gpt-live-1-boulder-alpha"];
declare function isOpenAIGptLiveModel(model: string | undefined): boolean;
declare function isSupportedOpenAIGptLiveModel(model: string | undefined): boolean;
//#endregion
export { OPENAI_GPT_LIVE_MODELS, isOpenAIGptLiveModel, isSupportedOpenAIGptLiveModel };