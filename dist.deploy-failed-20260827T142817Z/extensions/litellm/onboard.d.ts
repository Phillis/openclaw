import { n as OpenClawConfig, o as ModelDefinitionConfig } from "../../types.openclaw-BrHw7tim.js";
//#region extensions/litellm/onboard.d.ts
declare const LITELLM_BASE_URL = "http://localhost:4000";
declare const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
declare const LITELLM_DEFAULT_MODEL_REF = "litellm/claude-opus-4-6";
declare function buildLitellmModelDefinition(): ModelDefinitionConfig;
declare const applyLitellmConfig: (cfg: OpenClawConfig) => OpenClawConfig, applyLitellmProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion
export { LITELLM_BASE_URL, LITELLM_DEFAULT_MODEL_ID, LITELLM_DEFAULT_MODEL_REF, applyLitellmConfig, applyLitellmProviderConfig, buildLitellmModelDefinition };