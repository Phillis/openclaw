import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { i as resolveGoogleChatAccount } from "./accounts-DOsM6Oru.js";
import { i as normalizeGoogleChatTarget, r as isGoogleChatUserTarget } from "./targets-BerPjzFn.js";
//#region extensions/googlechat/src/approval-auth.ts
function normalizeGoogleChatApproverId(value) {
	const normalized = normalizeGoogleChatTarget(String(value));
	if (!normalized || !isGoogleChatUserTarget(normalized)) return;
	const suffix = normalizeLowercaseStringOrEmpty(normalized.slice(6));
	if (!suffix || suffix.includes("@")) return;
	return `users/${suffix}`;
}
const googleChatApproval = createChannelApprovalAuth({
	channelLabel: "Google Chat",
	resolveInputs: ({ cfg, accountId }) => {
		const account = resolveGoogleChatAccount({
			cfg,
			accountId
		}).config;
		return {
			allowFrom: account.allowFrom,
			defaultTo: account.defaultTo
		};
	},
	normalizeApprover: normalizeGoogleChatApproverId
});
const getGoogleChatApprovalApprovers = googleChatApproval.resolveApprovers;
const googleChatApprovalAuth = googleChatApproval.approvalAuth;
//#endregion
export { googleChatApprovalAuth as n, normalizeGoogleChatApproverId as r, getGoogleChatApprovalApprovers as t };
