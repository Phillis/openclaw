import { n as OpenClawPluginConfigSchema, r as OpenClawPluginApi, t as OpenClawPluginDefinition } from "../../types-BwmvzNiR.js";
//#region extensions/codex/cli-metadata.d.ts
declare function registerCodexCliMetadata(api: OpenClawPluginApi): void;
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
export { _default as default, registerCodexCliMetadata };