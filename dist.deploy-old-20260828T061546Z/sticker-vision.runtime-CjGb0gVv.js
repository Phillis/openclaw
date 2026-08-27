import { l as resolveAgentDir } from "./agent-scope-config-CUBiGmG3.js";
import { S as findModelInCatalog } from "./model-selection-shared-DbjoXfPH.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-BJZ-8dtR.js";
import { a as modelSupportsVision } from "./model-catalog-SLrvGBJu.js";
import { a as loadPreparedModelCatalog } from "./prepared-model-catalog-hBq_POnm.js";
import "./agent-runtime-dai5X0jZ.js";
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
