import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as buildPluginApprovalExpiredMessage, u as buildPluginApprovalResolvedMessage } from "./plugin-approvals-DzVTK3Ht.js";
import { s as normalizeApprovalRequest } from "./approval-request-account-binding-MS1_u7L5.js";
import "./approval-gateway-runtime-DelVRdGm.js";
import { n as buildApprovalResolvedReplyPayload } from "./approval-renderers-BlWA2qKe.js";
import "./approval-handler-runtime-DyEQpGva.js";
//#region src/plugin-sdk/approval-handler-runtime.ts
/**
* Runtime SDK subpath for approval handler adapters and approval view text helpers.
*/
/** Builds channel-visible resolved approval text for exec and plugin approvals. */
function buildChannelApprovalResolvedText(params) {
	if (params.view.approvalKind === "plugin") return buildPluginApprovalResolvedMessage(params.resolved);
	const resolvedByText = params.resolved.resolvedBy ? ` Resolved by ${params.resolved.resolvedBy}.` : "";
	return buildApprovalResolvedReplyPayload({
		approvalId: params.request.id,
		approvalSlug: params.request.id.slice(0, 8),
		text: `✅ Exec approval ${params.resolved.decision}.${resolvedByText} ID: ${params.request.id}`
	}).text ?? "";
}
/** Builds channel-visible expiration text for exec and plugin approvals. */
function buildChannelApprovalExpiredText(params) {
	const request = normalizeApprovalRequest(params.request);
	if (request.approvalKind === "plugin") return buildPluginApprovalExpiredMessage(request);
	return `⏱️ Exec approval expired. ID: ${request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
	return normalizeOptionalString(params.plannedAccountId) ?? normalizeOptionalString(params.contextAccountId) ?? normalizeOptionalString(params.fallbackAccountId);
}
//#endregion
export { buildChannelApprovalResolvedText as n, resolvePreparedApprovalAccountId as r, buildChannelApprovalExpiredText as t };
