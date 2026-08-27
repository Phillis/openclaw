import { a as OpenClawPluginApi, an as OpenClawPluginSecurityAuditCollector, un as OpenClawPluginNodeHostCommand } from "../../acpx-BA25QFjp.js";
//#region extensions/browser/plugin-registration.d.ts
/** Browser plugin reload policy. */
declare const browserPluginReload: {
  restartPrefixes: string[];
  hotPrefixes: string[];
};
declare const browserPluginNodeHostCommands: OpenClawPluginNodeHostCommand[];
/** Security audit collectors contributed by the Browser plugin. */
declare const browserSecurityAuditCollectors: OpenClawPluginSecurityAuditCollector[];
/** Register Browser tool factories, CLI, gateway methods, services, and audits. */
declare function registerBrowserPlugin(api: OpenClawPluginApi): void;
//#endregion
export { browserPluginNodeHostCommands, browserPluginReload, browserSecurityAuditCollectors, registerBrowserPlugin };