import { x as ProviderPlugin } from "../../plugin-entry-DF9X1uwv.js";
import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../types-CippcftS.js";
import "../../config-contracts-DBboNIpX.js";
import { n as matchesExactOrPrefix, t as cloneFirstTemplateModel } from "../../provider-model-shared-CP2VzTul.js";
//#region src/plugins/provider-catalog.d.ts
/** Finds a provider catalog template entry by normalized provider and template id. */
declare function findCatalogTemplate(params: {
  entries: ReadonlyArray<{
    provider: string;
    id: string;
  }>;
  providerId: string;
  templateIds: readonly string[];
}): {
  provider: string;
  id: string;
} | undefined;
//#endregion
//#region extensions/openai/shared.d.ts
type SyntheticOpenAIModelCatalogCost = {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
};
type SyntheticOpenAIModelCatalogEntry = {
  provider: string;
  id: string;
  name: string;
  reasoning?: boolean;
  input?: ("text" | "image")[];
  contextWindow?: number;
  contextTokens?: number;
  cost?: SyntheticOpenAIModelCatalogCost;
};
declare const OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS = 272000;
declare function resolveConfiguredOpenAIBaseUrl(cfg: OpenClawConfig | undefined): string;
type OpenAIResponsesProviderHooks = Pick<ProviderPlugin, "buildReplayPolicy" | "prepareExtraParams" | "wrapStreamFn" | "resolveTransportTurnState">;
declare function buildOpenAIResponsesProviderHooks(options?: {
  transport?: "auto" | "sse" | "websocket" | "websocket-cached";
}): OpenAIResponsesProviderHooks;
declare function buildOpenAISyntheticCatalogEntry(template: ReturnType<typeof findCatalogTemplate>, entry: {
  id: string;
  reasoning: boolean;
  input: readonly ("text" | "image")[];
  contextWindow: number;
  contextTokens?: number;
  cost?: SyntheticOpenAIModelCatalogCost;
}): SyntheticOpenAIModelCatalogEntry | undefined;
//#endregion
export { OPENAI_DEFAULT_RUNTIME_CONTEXT_TOKENS, buildOpenAIResponsesProviderHooks, buildOpenAISyntheticCatalogEntry, cloneFirstTemplateModel, findCatalogTemplate, matchesExactOrPrefix, resolveConfiguredOpenAIBaseUrl };