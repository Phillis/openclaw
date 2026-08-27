import { E as ProviderResolveDynamicModelContext, M as ProviderRuntimeModel, N as ProviderCatalogContext, P as ProviderCatalogResult, T as ProviderPrepareDynamicModelContext } from "../../types-7E39v2Gx.js";
import { n as OpenClawConfig } from "../../types.openclaw-3CDavCPO.js";
//#region extensions/github-copilot/dynamic-models.d.ts
declare function createGithubCopilotDynamicModelHooks(params: {
  discoveryEnabled(config?: OpenClawConfig): boolean;
}): {
  prepareDynamicModel: (ctx: ProviderPrepareDynamicModelContext) => Promise<void>;
  resolveDynamicModel: (ctx: ProviderResolveDynamicModelContext) => ProviderRuntimeModel | undefined;
  runCatalog: (ctx: ProviderCatalogContext) => Promise<ProviderCatalogResult>;
  preferRuntimeResolvedModel: ({
    config
  }: {
    config?: OpenClawConfig;
  }) => boolean;
};
//#endregion
export { createGithubCopilotDynamicModelHooks };