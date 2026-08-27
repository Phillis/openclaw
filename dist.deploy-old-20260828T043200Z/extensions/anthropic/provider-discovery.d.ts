import { d as ProviderPlugin } from "../../plugin-entry-BZAeuuKK.js";
import "../../provider-model-shared-CGkcIAOx.js";
//#region extensions/anthropic/provider-discovery.d.ts
declare function resolveClaudeCliSyntheticAuth(config: object | undefined): {
  apiKey: string;
  source: string;
  mode: "oauth";
} | undefined;
declare const anthropicProviderDiscovery: ProviderPlugin;
//#endregion
export { anthropicProviderDiscovery as default, resolveClaudeCliSyntheticAuth };