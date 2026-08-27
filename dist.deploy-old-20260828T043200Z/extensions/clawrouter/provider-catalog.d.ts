import { st as ProviderRuntimeModel } from "../../runtime-api-IAhSVA75.js";
import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-DRR8P0H2.js";
import { t as LiveModelCatalogFetchGuard } from "../../provider-catalog-live-runtime-DWMCbxpy.js";
import "../../provider-model-shared-CNwMbffr.js";
//#region extensions/clawrouter/provider-catalog.d.ts
declare const CLAWROUTER_REASONING_EFFORT_LEVELS: readonly [readonly ["none", "off"], readonly ["minimal", "minimal"], readonly ["low", "low"], readonly ["medium", "medium"], readonly ["high", "high"], readonly ["xhigh", "xhigh"], readonly ["max", "max"]];
type CatalogReasoningEffort = (typeof CLAWROUTER_REASONING_EFFORT_LEVELS)[number][0];
declare function normalizeClawRouterReasoningEfforts(value: unknown): CatalogReasoningEffort[] | undefined;
declare function normalizeClawRouterRootUrl(baseUrl: string | undefined): string;
declare function normalizeClawRouterApiBaseUrl(baseUrl: string | undefined): string;
declare function buildClawRouterProviderConfig(params: {
  apiKey: string;
  discoveryApiKey?: string;
  baseUrl?: string;
  fetchGuard?: LiveModelCatalogFetchGuard;
}): Promise<ModelProviderDeclarationConfig>;
declare function normalizeClawRouterResolvedModel(model: ProviderRuntimeModel): ProviderRuntimeModel | undefined;
declare function prepareClawRouterRequestModel(model: ProviderRuntimeModel): ProviderRuntimeModel;
//#endregion
export { CLAWROUTER_REASONING_EFFORT_LEVELS, buildClawRouterProviderConfig, normalizeClawRouterApiBaseUrl, normalizeClawRouterReasoningEfforts, normalizeClawRouterResolvedModel, normalizeClawRouterRootUrl, prepareClawRouterRequestModel };