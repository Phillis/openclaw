import { w as ProviderCatalogContext } from "../../plugin-entry-GuVBIlyS.js";
import { s as ModelProviderDeclarationConfig } from "../../types.models-i3fcfEfL.js";
//#region extensions/ollama/provider-discovery.d.ts
type OllamaProviderPlugin = {
  id: string;
  label: string;
  docsPath: string;
  envVars: string[];
  auth: [];
  resolveSyntheticAuth: (ctx: {
    provider?: string;
    providerConfig?: ModelProviderDeclarationConfig;
  }) => {
    apiKey: string;
    source: string;
    mode: "api-key";
  } | undefined;
  catalog: {
    order: "late";
    run: (ctx: ProviderCatalogContext) => ReturnType<typeof runOllamaDiscovery>;
  };
};
declare function runOllamaDiscovery(ctx: ProviderCatalogContext): Promise<{
  provider: ModelProviderDeclarationConfig;
} | null>;
declare const ollamaProviderDiscovery: OllamaProviderPlugin;
//#endregion
export { ollamaProviderDiscovery as default, ollamaProviderDiscovery };