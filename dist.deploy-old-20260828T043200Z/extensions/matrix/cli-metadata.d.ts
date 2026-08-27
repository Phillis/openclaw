import { b as OpenClawPluginApi, n as OpenClawPluginDefinition, r as OpenClawPluginConfigSchema } from "../../plugin-entry-Bvo-51M-.js";
import "../../types.adapters-UsYT95C9.js";
import "../../types.public-BgN3WB8T.js";
import "../../setup-helpers-775K7_O6.js";
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