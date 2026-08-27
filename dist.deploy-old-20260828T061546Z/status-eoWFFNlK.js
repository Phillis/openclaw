import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as projectSafeChannelAccountSnapshotFields, o as redactChannelAccountSnapshotBaseUrl } from "./account-snapshot-fields-DPncjgDN.js";
import { t as inspectChannelAccount } from "./account-inspection-ClS4p0kZ.js";
import { i as resolveChannelAccountState, r as resolveChannelAccountLinked, t as applyChannelAccountState } from "./account-state-Bav3alE5.js";
//#region src/channels/plugins/status.ts
/**
* Channel status snapshot builders.
*
* Combines plugin status hooks, account inspection, and safe account field projection.
*/
async function buildChannelAccountSnapshotFromAccount(params) {
	let snapshot;
	if (params.plugin.status?.buildAccountSnapshot) snapshot = await params.plugin.status.buildAccountSnapshot({
		account: params.account,
		cfg: params.cfg,
		runtime: params.runtime,
		probe: params.probe,
		audit: params.audit
	});
	else snapshot = {
		accountId: params.accountId,
		...projectSafeChannelAccountSnapshotFields(params.account),
		...projectSafeChannelAccountSnapshotFields(params.runtime)
	};
	const described = params.plugin.config.describeAccount?.(params.account, params.cfg);
	const enabled = params.plugin.config.isEnabled ? params.plugin.config.isEnabled(params.account, params.cfg) : described?.enabled ?? snapshot.enabled ?? params.enabledFallback ?? true;
	const configured = described?.configured ?? (params.plugin.config.isConfigured ? await params.plugin.config.isConfigured(params.account, params.cfg) : snapshot.configured ?? params.configuredFallback ?? true);
	const state = resolveChannelAccountState({
		enabled,
		configured,
		linked: resolveChannelAccountLinked(configured && params.plugin.config.isLinked ? await params.plugin.config.isLinked(params.account, params.cfg) : void 0, described?.linked ?? snapshot.linked),
		runtime: snapshot,
		disabledReason: params.plugin.config.disabledReason?.(params.account, params.cfg),
		unconfiguredReason: params.plugin.config.unconfiguredReason?.(params.account, params.cfg),
		unlinkedReason: params.plugin.config.unlinkedReason?.(params.account, params.cfg)
	});
	const projectedSnapshot = { ...snapshot };
	applyChannelAccountState(projectedSnapshot, state);
	return redactChannelAccountSnapshotBaseUrl({
		...projectedSnapshot,
		enabled,
		accountId: normalizeOptionalString(snapshot.accountId) ? snapshot.accountId : params.accountId,
		...params.probe !== void 0 && snapshot.probe === void 0 ? { probe: params.probe } : {}
	});
}
async function buildReadOnlySourceChannelAccountSnapshot(params) {
	const inspectedAccount = await inspectChannelAccount(params);
	if (!inspectedAccount) return null;
	return await buildChannelAccountSnapshotFromAccount({
		...params,
		account: inspectedAccount
	});
}
async function resolveChannelAccountSnapshot(params) {
	const account = await inspectChannelAccount(params) ?? params.plugin.config.resolveAccount(params.cfg, params.accountId);
	return await buildChannelAccountSnapshotFromAccount({
		...params,
		account
	});
}
//#endregion
export { buildReadOnlySourceChannelAccountSnapshot as n, resolveChannelAccountSnapshot as r, buildChannelAccountSnapshotFromAccount as t };
