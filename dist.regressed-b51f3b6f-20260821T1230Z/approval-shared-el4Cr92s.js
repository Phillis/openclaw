import { t as matchesApprovalRequestFilters } from "./approval-request-filters-_pjvVPDW.js";
import { n as isChannelExecApprovalClientEnabledFromConfig } from "./approval-client-helpers-BEu_luW2.js";
import { r as doesApprovalRequestSelectChannelAccount } from "./approval-request-account-binding-DaAFUqxc.js";
import "./approval-native-runtime-C2YMa3vm.js";
import { o as resolveDefaultDiscordAccountId, s as resolveDiscordAccount } from "./accounts-B99sjC_p.js";
import { t as getDiscordExecApprovalApprovers } from "./exec-approvals-RpTU5pce.js";
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
