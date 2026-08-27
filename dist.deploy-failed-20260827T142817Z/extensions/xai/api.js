import { c as normalizeOptionalLowercaseString } from "../../string-coerce-CIXf7egm.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import { i as normalizeXaiModelId } from "../../model-id-BJsQwvwb.js";
import { a as XAI_DEFAULT_MODEL_ID, c as buildXaiModelDefinition, i as XAI_DEFAULT_MAX_TOKENS, n as XAI_DEFAULT_CONTEXT_WINDOW, o as XAI_IMAGE_MODELS, r as XAI_DEFAULT_IMAGE_MODEL, s as buildXaiCatalogModels, t as XAI_BASE_URL, u as resolveXaiCatalogEntry } from "../../model-definitions-LKzPOBHs.js";
import { n as XAI_TOOL_SCHEMA_PROFILE, r as applyXaiModelCompat, t as HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING } from "../../model-compat-Cg9kXWDu.js";
import { a as applyXaiProviderConfig, r as applyXaiConfig, t as XAI_DEFAULT_MODEL_REF } from "../../onboard-ZJyBm3Lb.js";
import { i as buildXaiProvider } from "../../provider-catalog-CUR-D_iV.js";
import { t as applyXaiRuntimeModelCompat } from "../../runtime-model-compat-B9Jjs5LT.js";
import { r as resolveXaiForwardCompatModel, t as isModernXaiModel } from "../../provider-models-HhEC-zDC.js";
import { t as resolveXaiTransport } from "../../provider-routing-r2E4yXx0.js";
import { t as buildXaiImageGenerationProvider } from "../../image-generation-provider-CndxSIJw.js";
//#region extensions/xai/api.ts
function isXaiModelHint(modelId) {
	return getModelProviderHint(modelId) === "x-ai";
}
function getModelProviderHint(modelId) {
	const trimmed = normalizeOptionalLowercaseString(modelId);
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return null;
	return trimmed.slice(0, slashIndex) || null;
}
//#endregion
export { HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING, XAI_BASE_URL, XAI_DEFAULT_CONTEXT_WINDOW, XAI_DEFAULT_IMAGE_MODEL, XAI_DEFAULT_MAX_TOKENS, XAI_DEFAULT_MODEL_ID, XAI_DEFAULT_MODEL_REF, XAI_IMAGE_MODELS, XAI_TOOL_SCHEMA_PROFILE, applyXaiConfig, applyXaiModelCompat, applyXaiProviderConfig, applyXaiRuntimeModelCompat, buildXaiCatalogModels, buildXaiImageGenerationProvider, buildXaiModelDefinition, buildXaiProvider, isModernXaiModel, isXaiModelHint, normalizeXaiModelId, resolveXaiCatalogEntry, resolveXaiForwardCompatModel, resolveXaiTransport };
