import { o as ModelDefinitionConfig } from "../../types.openclaw-BBJILky4.js";
//#region extensions/xai/model-definitions.d.ts
declare const XAI_BASE_URL = "https://api.x.ai/v1";
declare const XAI_DEFAULT_IMAGE_MODEL = "grok-imagine-image";
declare const XAI_IMAGE_MODELS: readonly ["grok-imagine-image", "grok-imagine-image-quality"];
declare const XAI_DEFAULT_CONTEXT_WINDOW = 1000000;
declare const XAI_DEFAULT_MAX_TOKENS = 64000;
declare const XAI_DEFAULT_MODEL_ID = "grok-4.3";
declare function isLegacyXaiBuiltinModel(model: unknown): boolean;
declare function buildXaiModelDefinition(): ModelDefinitionConfig;
declare function buildXaiCatalogModels(): ModelDefinitionConfig[];
declare function resolveXaiCatalogEntry(modelId: string): ModelDefinitionConfig | undefined;
//#endregion
export { XAI_BASE_URL, XAI_DEFAULT_CONTEXT_WINDOW, XAI_DEFAULT_IMAGE_MODEL, XAI_DEFAULT_MAX_TOKENS, XAI_DEFAULT_MODEL_ID, XAI_IMAGE_MODELS, buildXaiCatalogModels, buildXaiModelDefinition, isLegacyXaiBuiltinModel, resolveXaiCatalogEntry };