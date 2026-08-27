import { n as OpenClawPluginDefinition, r as OpenClawPluginConfigSchema, x as ProviderPlugin } from "../../plugin-entry-Bvo-51M-.js";
import "../../provider-model-shared-BAQjJAbj.js";
//#region extensions/openai/setup-api.d.ts
declare function buildOpenAISetupProvider(): ProviderPlugin;
declare const _default: Omit<{
  id: string;
  name: string;
  description: string;
  kind?: OpenClawPluginDefinition["kind"];
  configSchema?: OpenClawPluginConfigSchema | (() => OpenClawPluginConfigSchema);
  reload?: OpenClawPluginDefinition["reload"];
  nodeHostCommands?: OpenClawPluginDefinition["nodeHostCommands"];
  securityAuditCollectors?: OpenClawPluginDefinition["securityAuditCollectors"];
  register: NonNullable<OpenClawPluginDefinition["register"]>;
}, "configSchema"> & {
  configSchema: OpenClawPluginConfigSchema;
};
//#endregion
export { buildOpenAISetupProvider, _default as default };