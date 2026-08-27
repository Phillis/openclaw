import { t as matchesApprovalRequestFilters } from "./approval-request-filters-DoqGC04V.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-CLJpuj7I.js";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-BbV7ZcKh.js";
import "./approval-native-runtime-tP3eeJgJ.js";
import { o as resolveDefaultDiscordAccountId, s as resolveDiscordAccount } from "./accounts-nD0JW5tp.js";
import { t as getDiscordExecApprovalApprovers } from "./exec-approvals-Ta4ocfUk.js";
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
