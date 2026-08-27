import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import "./utils-DEqefz4f.js";
import { a as projectSafeChannelAccountSnapshotFields, o as redactChannelAccountSnapshotBaseUrl } from "./account-snapshot-fields-BFfRc-QZ.js";
//#region src/channels/account-summary.ts
/**
* Channel account summary helpers.
*
* Builds safe status snapshots and resolves enabled/configured account state.
*/
/**
* Builds the safe account snapshot shown by CLI, gateway, and status summaries.
*/
function buildChannelAccountSummary(params) {
	const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
	return redactChannelAccountSnapshotBaseUrl({
		enabled: params.enabled,
		configured: params.configured,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...described,
		accountId: params.accountId
	});
}
/**
* Formats allowFrom entries with a plugin formatter when one exists.
*/
function formatChannelAllowFrom(params) {
	if (params.plugin.config.formatAllowFrom) return params.plugin.config.formatAllowFrom({
		cfg: params.cfg,
		accountId: params.accountId,
		allowFrom: params.allowFrom
	});
	return normalizeStringEntries(params.allowFrom);
}
/**
* Resolves whether a channel account should be treated as enabled.
*/
function resolveChannelAccountEnabled(params) {
	if (params.plugin.config.isEnabled) return params.plugin.config.isEnabled(params.account, params.cfg);
	return (isRecord(params.account) ? params.account.enabled : void 0) !== false;
}
/**
* Resolves whether a channel account has enough configuration to run.
*/
async function resolveChannelAccountConfigured(params) {
	if (params.plugin.config.isConfigured) return await params.plugin.config.isConfigured(params.account, params.cfg);
	if (params.readAccountConfiguredField) return (isRecord(params.account) ? params.account.configured : void 0) !== false;
	return true;
}
//#endregion
export { resolveChannelAccountEnabled as i, formatChannelAllowFrom as n, resolveChannelAccountConfigured as r, buildChannelAccountSummary as t };
