import { i as buildModelAliasIndex } from "./model-selection-shared-0DI3vxkL.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import "./model-selection-BEGvRdL1.js";
//#region src/auto-reply/reply/directive-handling.defaults.ts
/** Resolve default provider/model plus alias index for directive parsing. */
function resolveDefaultModel(params) {
	const mainModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId,
		allowPluginNormalization: false
	});
	const defaultProvider = mainModel.provider;
	return {
		defaultProvider,
		defaultModel: mainModel.model,
		aliasIndex: buildModelAliasIndex({
			cfg: params.cfg,
			defaultProvider,
			agentId: params.agentId,
			allowPluginNormalization: false
		})
	};
}
//#endregion
export { resolveDefaultModel as t };
