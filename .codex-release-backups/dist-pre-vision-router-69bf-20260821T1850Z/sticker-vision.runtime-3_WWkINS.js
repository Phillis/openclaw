import { l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
import { S as findModelInCatalog } from "./model-selection-shared-0DI3vxkL.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import { a as modelSupportsVision } from "./model-catalog-C8gwRpA7.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-DFpNDAcU.js";
import "./agent-runtime-ByiBmP2c.js";
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
