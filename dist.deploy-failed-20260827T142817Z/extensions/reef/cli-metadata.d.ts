import { g as OpenClawPluginApi, n as OpenClawPluginDefinition, r as OpenClawPluginConfigSchema } from "../../plugin-entry-GuVBIlyS.js";
//#region extensions/reef/src/cli-metadata.d.ts
declare function registerReefCliMetadata(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/reef/cli-metadata.d.ts
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
export { _default as default, registerReefCliMetadata };