import "./plugin-entry-bE5OaTNY.js";
import { n as OpenClawConfig } from "./types.openclaw-D3Ap19Na.js";
//#region extensions/feishu/src/security-audit-shared.d.ts
declare function collectFeishuSecurityAuditFindings(params: {
  cfg: OpenClawConfig;
}): {
  checkId: string;
  severity: "warn";
  title: string;
  detail: string;
  remediation: string;
}[];
//#endregion
export { collectFeishuSecurityAuditFindings as t };