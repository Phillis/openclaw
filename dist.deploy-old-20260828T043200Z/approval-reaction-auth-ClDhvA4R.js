import { a as resolveApprovalApprovers } from "./approval-auth-helpers-Bs9uwexj.js";
import { i as resolveMatrixAccount } from "./accounts-CePJXe0h.js";
import { t as normalizeMatrixApproverId } from "./approval-ids-DPAIXCWD.js";
//#region extensions/matrix/src/approval-reaction-auth.ts
function normalizeMatrixExecApproverId(value) {
	const normalized = normalizeMatrixApproverId(value);
	return normalized === "*" ? void 0 : normalized;
}
function getMatrixApprovalReactionApprovers(params) {
	const account = resolveMatrixAccount(params).config;
	if (params.approvalKind === "plugin") return resolveApprovalApprovers({
		allowFrom: account.dm?.allowFrom,
		normalizeApprover: normalizeMatrixApproverId
	});
	return resolveApprovalApprovers({
		explicit: account.execApprovals?.approvers,
		allowFrom: account.dm?.allowFrom,
		normalizeApprover: normalizeMatrixExecApproverId
	});
}
function isMatrixApprovalReactionAuthorizedSender(params) {
	const normalizedSenderId = params.senderId ? normalizeMatrixApproverId(params.senderId) : void 0;
	if (!normalizedSenderId) return false;
	return getMatrixApprovalReactionApprovers(params).includes(normalizedSenderId);
}
//#endregion
export { isMatrixApprovalReactionAuthorizedSender };
