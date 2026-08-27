import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as buildPluginApprovalExpiredMessage, u as buildPluginApprovalResolvedMessage } from "./plugin-approvals-CmZhR5of.js";
import "./approval-gateway-runtime-3ii5FzIG.js";
import "./approval-handler-runtime-BMVPld8J.js";
import { n as buildApprovalResolvedReplyPayload } from "./approval-renderers-CzPk5-xw.js";
//#region src/plugin-sdk/approval-handler-runtime.ts
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
	if (params.view.approvalKind === "plugin") return buildPluginApprovalExpiredMessage(params.request);
	return `⏱️ Exec approval expired. ID: ${params.request.id}`;
}
function resolvePreparedApprovalAccountId(params) {
	return normalizeOptionalString(params.plannedAccountId) ?? normalizeOptionalString(params.contextAccountId) ?? normalizeOptionalString(params.fallbackAccountId);
}
//#endregion
export { buildChannelApprovalResolvedText as n, resolvePreparedApprovalAccountId as r, buildChannelApprovalExpiredText as t };
