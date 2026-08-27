import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-C8jKEm3h.js";
//#region extensions/codex/src/app-server/model-runtime.ts
const CODEX_APP_SERVER_RUNTIME_MODEL_PARAM = "codexAppServerRuntimeModel";
function buildCodexRuntimeModelParams(catalogId, runtimeModelId) {
	return catalogId === runtimeModelId ? void 0 : { [CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]: runtimeModelId };
}
function readCodexRuntimeModelId(model, fallbackId) {
	return normalizeOptionalString(model?.params?.[CODEX_APP_SERVER_RUNTIME_MODEL_PARAM]) ?? model?.id ?? fallbackId;
}
//#endregion
export { readCodexRuntimeModelId as n, buildCodexRuntimeModelParams as t };
