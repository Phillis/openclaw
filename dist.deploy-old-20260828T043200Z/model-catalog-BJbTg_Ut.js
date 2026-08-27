import { t as buildCodexRuntimeModelParams } from "./model-runtime-ynqmtplO.js";
import { h as readCodexPluginConfig } from "./config-DPdRNnmw.js";
import { t as listAllCodexAppServerModels } from "./models-D6pJi2Wk.js";
import { r as requestOptions } from "./command-rpc-DuyHZSnr.js";
//#region extensions/codex/src/app-server/model-catalog.ts
const OPENAI_CODEX_BASE_URL = "https://chatgpt.com/backend-api/codex";
const DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS = 2500;
const INPUT_TYPES = /* @__PURE__ */ new Set([
	"text",
	"image",
	"audio",
	"video",
	"document"
]);
function isModelInputType(value) {
	return INPUT_TYPES.has(value);
}
function codexAppServerModelsToCatalogEntries(models) {
	return models.map((model, providerOrder) => {
		const input = model.inputModalities.filter(isModelInputType);
		const runtimeParams = buildCodexRuntimeModelParams(model.id, model.model);
		return {
			provider: "openai",
			id: model.id,
			name: model.displayName ?? model.id,
			providerOrder,
			api: "openai-chatgpt-responses",
			baseUrl: OPENAI_CODEX_BASE_URL,
			reasoning: model.supportedReasoningEfforts.length > 0,
			...input.length > 0 ? { input } : {},
			...runtimeParams ? { params: runtimeParams } : {},
			compat: {
				supportsReasoningEffort: model.supportedReasoningEfforts.length > 0,
				supportedReasoningEfforts: model.supportedReasoningEfforts
			}
		};
	});
}
async function loadCodexAppServerModelCatalog(params, pluginConfig) {
	const discovery = readCodexPluginConfig(pluginConfig).discovery;
	if (discovery?.enabled === false) return [];
	return codexAppServerModelsToCatalogEntries((await listAllCodexAppServerModels({
		...requestOptions(pluginConfig, 100, params.config, params.agentDir),
		timeoutMs: discovery?.timeoutMs ?? DEFAULT_MODEL_DISCOVERY_TIMEOUT_MS
	})).models);
}
//#endregion
export { loadCodexAppServerModelCatalog };
