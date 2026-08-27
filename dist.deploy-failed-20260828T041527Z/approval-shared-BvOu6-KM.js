import { t as matchesApprovalRequestFilters } from "./approval-request-filters-fSalMZ5e.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-BG_rgRed.js";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-MS1_u7L5.js";
import "./approval-native-runtime-Cy7LXjtb.js";
import { c as resolveDiscordAccount, s as resolveDefaultDiscordAccountId } from "./accounts-DWE66f3w.js";
import { t as getDiscordExecApprovalApprovers } from "./exec-approvals-c5JXQjHw.js";
//#region extensions/discord/src/approval-shared.ts
function isDiscordApprovalAccountEligible(params) {
	const account = resolveDiscordAccount(params);
	const config = params.configOverride ?? account.config.execApprovals;
	return account.enabled && isChannelExecApprovalClientEnabledFromConfig({
		enabled: config?.enabled,
		approverCount: getDiscordExecApprovalApprovers(params).length
	}) && matchesApprovalRequestFilters({
		request: params.request.request,
		agentFilter: config?.agentFilter,
		sessionFilter: config?.sessionFilter
	});
}
function shouldHandleDiscordApprovalRequest(params) {
	const accountId = params.accountId ?? resolveDefaultDiscordAccountId(params.cfg);
	if (!doesApprovalRequestSelectChannelAccount({
		...params,
		channel: "discord",
		defaultAccountId: resolveDefaultDiscordAccountId(params.cfg),
		eligibleAccountIds: isDiscordApprovalAccountEligible({
			...params,
			accountId
		}) ? [accountId] : []
	})) return false;
	return isDiscordApprovalAccountEligible(params);
}
//#endregion
export { shouldHandleDiscordApprovalRequest as t };
