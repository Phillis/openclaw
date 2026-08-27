import { dt as ProviderCatalogContext, ft as ProviderCatalogResult, h as ProviderPrepareDynamicModelContext, ut as ProviderRuntimeModel, v as ProviderResolveDynamicModelContext } from "../../plugin-entry-C1So83n6.js";
import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/github-copilot/dynamic-models.d.ts
declare function createGithubCopilotDynamicModelHooks(params: {
  discoveryEnabled(config?: OpenClawConfig): boolean;
}): {
  prepareDynamicModel: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  resolveDynamicModel: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | undefined;
  runCatalog: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
  preferRuntimeResolvedModel: ({ config }: {
    config?: OpenClawConfig;
  }) => boolean;
};
//#endregion
export { createGithubCopilotDynamicModelHooks };