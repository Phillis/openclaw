import { on as OpenClawPluginSecurityAuditContext } from "../../acpx-hsLTUlEK.js";
import { f as stopBrowserControlService, h as runBrowserProxyCommand, r as handleBrowserGatewayRequest, t as createBrowserPluginService, x as createBrowserTool } from "../../plugin-service-BEXDhs6D.js";
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