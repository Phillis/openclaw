import { o as ModelDefinitionConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../provider-model-shared-Bld-XGAE.js";
//#region extensions/minimax/model-definitions.d.ts
declare const DEFAULT_MINIMAX_BASE_URL = "https://api.minimax.io/v1";
declare const MINIMAX_API_BASE_URL = "https://api.minimax.io/anthropic";
declare const MINIMAX_CN_API_BASE_URL = "https://api.minimaxi.com/anthropic";
declare const MINIMAX_HOSTED_MODEL_ID = "MiniMax-M3";
declare const MINIMAX_HOSTED_MODEL_REF = "minimax/MiniMax-M3";
declare const DEFAULT_MINIMAX_MAX_TOKENS = 131072;
declare const MINIMAX_API_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_HOSTED_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare const MINIMAX_LM_STUDIO_COST: {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
declare function resolveMinimaxApiCost(modelId: string): ModelDefinitionConfig["cost"];
declare function buildMinimaxModelDefinition(params: {
  id: string;
  name?: string;
  reasoning?: boolean;
  cost: ModelDefinitionConfig["cost"];
  contextWindow: number;
  maxTokens: number;
}): ModelDefinitionConfig;
declare function buildMinimaxApiModelDefinition(modelId: string): ModelDefinitionConfig;
//#endregion
export { DEFAULT_MINIMAX_BASE_URL, DEFAULT_MINIMAX_MAX_TOKENS, MINIMAX_API_BASE_URL, MINIMAX_API_COST, MINIMAX_CN_API_BASE_URL, MINIMAX_HOSTED_COST, MINIMAX_HOSTED_MODEL_ID, MINIMAX_HOSTED_MODEL_REF, MINIMAX_LM_STUDIO_COST, buildMinimaxApiModelDefinition, buildMinimaxModelDefinition, resolveMinimaxApiCost };