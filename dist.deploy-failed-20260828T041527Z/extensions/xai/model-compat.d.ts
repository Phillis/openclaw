import { i as normalizeXaiModelId } from "../../model-id-DjgicLW1.js";
//#region extensions/xai/model-compat.d.ts
declare const XAI_TOOL_SCHEMA_PROFILE = "xai";
declare const HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING = "html-entities";
declare function applyXaiModelCompat<T extends {
  compat?: unknown;
}>(model: T): T;
//#endregion
export { HTML_ENTITY_TOOL_CALL_ARGUMENTS_ENCODING, XAI_TOOL_SCHEMA_PROFILE, applyXaiModelCompat, normalizeXaiModelId as normalizeNativeXaiModelId };