import { n as hasConfiguredUnavailableCredentialStatus, r as hasResolvedCredentialValue } from "./account-snapshot-fields-DPncjgDN.js";
import { i as resolveChannelAccountEnabled, r as resolveChannelAccountConfigured } from "./account-summary-D29QDdia.js";
import { t as inspectReadOnlyChannelAccount } from "./read-only-account-inspect-BMxa0KO1.js";
//#region src/channels/account-inspection.ts
/**
* Inspects one channel account using the plugin hook or read-only fallback.
*/
async function inspectChannelAccount(params) {
	return params.plugin.config.inspectAccount?.(params.cfg, params.accountId) ?? await inspectReadOnlyChannelAccount({
		channelId: params.plugin.id,
		cfg: params.cfg,
		accountId: params.accountId
	});
}
/**
* Resolves an inspected channel account plus enabled/configured state for status surfaces.
*/
async function resolveInspectedChannelAccount(params) {
	const sourceInspectedAccount = await inspectChannelAccount({
		plugin: params.plugin,
		cfg: params.sourceConfig,
		accountId: params.accountId
	});
	const resolvedInspectedAccount = await inspectChannelAccount({
		plugin: params.plugin,
		cfg: params.cfg,
		accountId: params.accountId
	});
	const resolvedInspection = resolvedInspectedAccount;
	const sourceInspection = sourceInspectedAccount;
	const resolvedAccount = resolvedInspectedAccount ?? params.plugin.config.resolveAccount(params.cfg, params.accountId);
	const useSourceUnavailableAccount = Boolean(sourceInspectedAccount && hasConfiguredUnavailableCredentialStatus(sourceInspectedAccount) && (!hasResolvedCredentialValue(resolvedAccount) || sourceInspection?.configured === true && resolvedInspection?.configured === false));
	const account = useSourceUnavailableAccount ? sourceInspectedAccount : resolvedAccount;
	const selectedInspection = useSourceUnavailableAccount ? sourceInspection : resolvedInspection;
	return {
		account,
		enabled: selectedInspection?.enabled ?? resolveChannelAccountEnabled({
			plugin: params.plugin,
			account,
			cfg: params.cfg
		}),
		configured: selectedInspection?.configured ?? await resolveChannelAccountConfigured({
			plugin: params.plugin,
			account,
			cfg: params.cfg,
			readAccountConfiguredField: true
		})
	};
}
//#endregion
export { resolveInspectedChannelAccount as n, inspectChannelAccount as t };
