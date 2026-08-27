import "./defaults-CdX9UGcX.js";
import { a as resolveContextTokensForModel } from "./context-BCVmjNPU.js";
//#region src/auto-reply/reply/model-selection-context.ts
/** Resolves the context window token count for the selected provider/model. */
function resolveContextTokens(params) {
	const modelContextTokens = resolveContextTokensForModel({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		modelContextWindow: params.modelContextWindow,
		modelContextTokens: params.modelContextTokens,
		allowAsyncLoad: false
	});
	const agentContextTokens = typeof params.agentCfg?.contextTokens === "number" && params.agentCfg.contextTokens > 0 ? Math.floor(params.agentCfg.contextTokens) : void 0;
	if (agentContextTokens !== void 0) return modelContextTokens !== void 0 ? Math.min(agentContextTokens, modelContextTokens) : agentContextTokens;
	return modelContextTokens ?? 2e5;
}
//#endregion
export { resolveContextTokens as t };
