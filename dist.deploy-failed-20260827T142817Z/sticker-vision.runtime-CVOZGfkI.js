import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { S as findModelInCatalog } from "./model-selection-shared-DT9x3Cg2.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-Bw2nFxxx.js";
import { a as modelSupportsVision } from "./model-catalog-D1JZ_G7y.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-BFweRhks.js";
import "./agent-runtime-C-ueAbwA.js";
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
