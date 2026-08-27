import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { r as ModelDefinitionConfig } from "../../types.models-DQnz5K9u.js";
import "../../provider-onboard-DyOOPDmE.js";
//#region extensions/litellm/onboard.d.ts
declare const LITELLM_BASE_URL = "http://localhost:4000";
declare const LITELLM_DEFAULT_MODEL_ID = "claude-opus-4-6";
declare const LITELLM_DEFAULT_MODEL_REF = "litellm/claude-opus-4-6";
declare function buildLitellmModelDefinition(): ModelDefinitionConfig;
declare const applyLitellmConfig: (cfg: OpenClawConfig) => OpenClawConfig, applyLitellmProviderConfig: (cfg: OpenClawConfig) => OpenClawConfig;
//#endregion
export { LITELLM_BASE_URL, LITELLM_DEFAULT_MODEL_ID, LITELLM_DEFAULT_MODEL_REF, applyLitellmConfig, applyLitellmProviderConfig, buildLitellmModelDefinition };