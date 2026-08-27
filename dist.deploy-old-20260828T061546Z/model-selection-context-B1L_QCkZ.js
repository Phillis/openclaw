import "./defaults-CdX9UGcX.js";
import { a as resolveContextTokensForModel } from "./context-o5tuEdcP.js";
//#region src/auto-reply/reply/model-selection-context.ts
/** Resolves the context window token count for the selected provider/model. */
function resolveContextTokens(params) {
	return resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false
	}) ?? 2e5;
}
//#endregion
export { resolveContextTokens as t };
