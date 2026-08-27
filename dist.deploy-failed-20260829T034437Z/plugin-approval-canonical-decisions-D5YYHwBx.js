import { d as resolvePluginApprovalRequestAllowedDecisions } from "./plugin-approvals-DzVTK3Ht.js";
//#region src/infra/plugin-approval-canonical-decisions.ts
/** Add the fail-closed deny verdict to the normalized plugin decision set. */
function resolveCanonicalPluginApprovalRequestAllowedDecisions(params) {
	const allowedDecisions = resolvePluginApprovalRequestAllowedDecisions(params);
	return allowedDecisions.includes("deny") ? allowedDecisions : [...allowedDecisions, "deny"];
}
//#endregion
export { resolveCanonicalPluginApprovalRequestAllowedDecisions as t };
