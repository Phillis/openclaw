import { on as OpenClawPluginSecurityAuditContext } from "../../acpx-D5fMZfg0.js";
import { f as stopBrowserControlService, h as runBrowserProxyCommand, r as handleBrowserGatewayRequest, t as createBrowserPluginService, x as createBrowserTool } from "../../plugin-service-dTIAHi3r.js";
//#region extensions/browser/src/security-audit.d.ts
/** Collects Browser plugin security audit findings for the current config/env. */
declare function collectBrowserSecurityAuditFindings(ctx: OpenClawPluginSecurityAuditContext): {
  checkId: string;
  severity: "warn" | "critical";
  title: string;
  detail: string;
  remediation?: string;
}[];
//#endregion
export { collectBrowserSecurityAuditFindings, createBrowserPluginService, createBrowserTool, handleBrowserGatewayRequest, runBrowserProxyCommand, stopBrowserControlService };