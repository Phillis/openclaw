import { a as resolveApprovalApprovers } from "./approval-auth-helpers-Bs9uwexj.js";
import { t as matchesApprovalRequestFilters } from "./approval-request-filters-fSalMZ5e.js";
import { m as getExecApprovalReplyMetadata } from "./exec-approval-reply-BxJ7uYTc.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-CYx_kSno.js";
import "./approval-client-runtime-nQOweXeg.js";
import "./approval-delivery-runtime-B5r9JaLG.js";
import "./approval-native-runtime-BqI80IgE.js";
import { c as resolveDiscordAccount } from "./accounts-Ce_-CVy_.js";
import { t as parseDiscordTarget } from "./target-parsing-CEpBARoV.js";
//#region extensions/discord/src/exec-approvals.ts
function normalizeDiscordApproverId(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	if (/^\d+$/.test(trimmed)) return trimmed;
	try {
		const target = parseDiscordTarget(trimmed);
		return target?.kind === "user" ? target.id : void 0;
	} catch {
		return;
	}
}
function resolveDiscordOwnerApprovers(cfg) {
	const ownerAllowFrom = cfg.commands?.ownerAllowFrom;
	if (!Array.isArray(ownerAllowFrom) || ownerAllowFrom.length === 0) return [];
	return resolveApprovalApprovers({
		explicit: ownerAllowFrom,
		normalizeApprover: (value) => normalizeDiscordApproverId(String(value))
	});
}
function getDiscordExecApprovalApprovers(params) {
	return resolveApprovalApprovers({
		explicit: params.configOverride?.approvers ?? resolveDiscordAccount(params).config.execApprovals?.approvers ?? resolveDiscordOwnerApprovers(params.cfg),
		normalizeApprover: (value) => normalizeDiscordApproverId(String(value))
	});
}
function isDiscordExecApprovalClientEnabled(params) {
	return isChannelExecApprovalClientEnabledFromConfig({
		enabled: (params.configOverride ?? resolveDiscordAccount(params).config.execApprovals)?.enabled,
		approverCount: getDiscordExecApprovalApprovers({
			cfg: params.cfg,
			accountId: params.accountId,
			configOverride: params.configOverride
		}).length
	});
}
function isDiscordExecApprovalApprover(params) {
	const senderId = params.senderId?.trim();
	if (!senderId) return false;
	return getDiscordExecApprovalApprovers({
		cfg: params.cfg,
		accountId: params.accountId,
		configOverride: params.configOverride
	}).includes(senderId);
}
function shouldSuppressLocalDiscordExecApprovalPrompt(params) {
	const metadata = getExecApprovalReplyMetadata(params.payload);
	const config = resolveDiscordAccount(params).config.execApprovals;
	return params.hint?.kind === "approval-pending" && params.hint.nativeRouteActive === true && isDiscordExecApprovalClientEnabled(params) && metadata !== null && matchesApprovalRequestFilters({
		request: {
			agentId: metadata.agentId,
			sessionKey: metadata.sessionKey
		},
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
//#endregion
export { shouldSuppressLocalDiscordExecApprovalPrompt as i, isDiscordExecApprovalApprover as n, isDiscordExecApprovalClientEnabled as r, getDiscordExecApprovalApprovers as t };
