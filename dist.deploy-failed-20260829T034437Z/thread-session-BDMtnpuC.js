import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { h as resolveThreadSessionKeys } from "./session-key-Dbce_H9p.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import { t as createChannelApprovalAuth } from "./approval-auth-helpers-Bs9uwexj.js";
import { r as normalizeMSTeamsMessagingTarget } from "./resolve-allowlist-BwaUYROy.js";
//#region extensions/msteams/src/approval-auth.ts
const MSTEAMS_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function normalizeMSTeamsApproverId(value) {
	const normalized = normalizeMSTeamsMessagingTarget(String(value));
	const id = normalizeOptionalLowercaseString(normalized?.startsWith("user:") ? normalized.slice(5) : normalized);
	return id && MSTEAMS_ID_RE.test(id) ? id : void 0;
}
function resolveMSTeamsChannelConfig(cfg) {
	return cfg.channels?.msteams;
}
const msTeamsApproval = createChannelApprovalAuth({
	channelLabel: "Microsoft Teams",
	resolveInputs: ({ cfg }) => {
		const channel = resolveMSTeamsChannelConfig(cfg);
		return {
			allowFrom: channel?.allowFrom,
			defaultTo: channel?.defaultTo
		};
	},
	normalizeApprover: normalizeMSTeamsApproverId,
	normalizeSenderId: (value) => {
		const trimmed = normalizeOptionalLowercaseString(value);
		if (!trimmed) return;
		return MSTEAMS_ID_RE.test(trimmed) ? trimmed : void 0;
	}
});
const getMSTeamsApprovalApprovers = msTeamsApproval.resolveApprovers;
const msTeamsApprovalAuth = msTeamsApproval.approvalAuth;
//#endregion
//#region extensions/msteams/src/monitor-handler/thread-session.ts
const TRAILING_THREAD_SUFFIX = /(?::thread:[^:]+)+$/;
function resolveMSTeamsRouteSessionKey(params) {
	const channelThreadId = params.isChannel ? params.conversationMessageId ?? params.replyToId ?? void 0 : void 0;
	const cleanBase = params.baseSessionKey.replace(TRAILING_THREAD_SUFFIX, "");
	return resolveThreadSessionKeys({
		baseSessionKey: cleanBase,
		threadId: channelThreadId,
		parentSessionKey: channelThreadId ? cleanBase : void 0
	}).sessionKey;
}
//#endregion
export { getMSTeamsApprovalApprovers as n, msTeamsApprovalAuth as r, resolveMSTeamsRouteSessionKey as t };
