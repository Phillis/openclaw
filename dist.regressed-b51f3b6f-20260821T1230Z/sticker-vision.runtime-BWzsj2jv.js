import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { S as findModelInCatalog } from "./model-selection-shared-BSy9FczT.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-0uJOp6W2.js";
import { a as modelSupportsVision } from "./model-catalog-DRC51wnt.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-BcJkNkF9.js";
import "./agent-runtime-BOIKP1my.js";
//#region extensions/telegram/src/sticker-vision.runtime.ts
async function resolveStickerVisionSupportRuntime(params) {
	const catalog = await loadPreparedModelCatalog({
		config: params.cfg,
		...params.agentId ? {
			agentId: params.agentId,
			agentDir: resolveAgentDir(params.cfg, params.agentId)
		} : {},
		readOnly: true
	});
	const defaultModel = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	const entry = findModelInCatalog(catalog, defaultModel.provider, defaultModel.model);
	if (!entry) return false;
	return modelSupportsVision(entry);
}
//#endregion
export { resolveStickerVisionSupportRuntime };
