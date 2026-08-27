import { b as OpenClawPluginApi, n as OpenClawPluginDefinition, r as OpenClawPluginConfigSchema } from "../../plugin-entry-DyrRrRy2.js";
import "../../types.adapters-DVrIc5zd.js";
import "../../types.public-DowZo4tb.js";
import "../../setup-helpers-BRsuqhOh.js";
//#region extensions/matrix/src/cli-metadata.d.ts
declare function registerMatrixCliMetadata(api: OpenClawPluginApi): void;
//#endregion
//#region extensions/matrix/cli-metadata.d.ts
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
export { _default as default, registerMatrixCliMetadata };