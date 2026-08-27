import { t as runSecurityAuditCore } from "./audit-DoLlr5b2.js";
//#region src/security/audit.runtime.ts
/** Runtime facade for the full security audit entrypoint. */
function runSecurityAudit(...args) {
	return runSecurityAuditCore(...args);
}
//#endregion
export { runSecurityAudit };
