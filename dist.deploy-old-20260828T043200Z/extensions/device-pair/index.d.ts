import { n as OpenClawPluginDefinition, r as OpenClawPluginConfigSchema } from "../../plugin-entry-Bvo-51M-.js";
//#region extensions/device-pair/index.d.ts
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
export { _default as default };