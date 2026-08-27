import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { o as hasOwnProperty } from "./runtime-shared-DsVbV2C8.js";
import { c as hasConfiguredSecretInputValue, i as createChannelSecretTargetRegistryEntries, s as getChannelSurface, t as collectConditionalChannelFieldAssignments, u as normalizeSecretStringValue } from "./channel-secret-basic-runtime--kHasITf.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
//#region extensions/feishu/src/secret-contract.ts
const secretTargetRegistryEntries = createChannelSecretTargetRegistryEntries({
	channelKey: "feishu",
	account: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	],
	channel: [
		"appSecret",
		"encryptKey",
		"verificationToken"
	]
});
function collectRuntimeConfigAssignments(params) {
	const resolved = getChannelSurface(params.config, "feishu");
	if (!resolved) return;
	const { channel: feishu, surface } = resolved;
	if (surface.channelEnabled && hasConfiguredSecretInputValue(feishu.appId, params.defaults) && hasConfiguredSecretInputValue(feishu.appSecret, params.defaults) && surface.hasExplicitAccounts && !surface.accounts.some(({ accountId }) => normalizeAccountId(accountId) === "default")) surface.accounts.push({
		accountId: "default",
		account: {},
		enabled: true
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "appSecret",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: surface.channelEnabled,
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "appSecret"),
		accountActive: ({ enabled }) => enabled,
		topInactiveReason: "no enabled account inherits this top-level Feishu appSecret.",
		accountInactiveReason: "Feishu account is disabled."
	});
	const baseConnectionMode = normalizeSecretStringValue(feishu.connectionMode) === "webhook" ? "webhook" : "websocket";
	const resolveAccountMode = (account) => hasOwnProperty(account, "connectionMode") ? normalizeSecretStringValue(account.connectionMode) : baseConnectionMode;
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "encryptKey",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "encryptKey") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level encryptKey.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
	collectConditionalChannelFieldAssignments({
		channelKey: "feishu",
		field: "verificationToken",
		channel: feishu,
		surface,
		defaults: params.defaults,
		context: params.context,
		topLevelActiveWithoutAccounts: baseConnectionMode === "webhook",
		topLevelInheritedAccountActive: ({ account, enabled }) => enabled && !hasOwnProperty(account, "verificationToken") && resolveAccountMode(account) === "webhook",
		accountActive: ({ account, enabled }) => enabled && resolveAccountMode(account) === "webhook",
		topInactiveReason: "no enabled Feishu webhook-mode surface inherits this top-level verificationToken.",
		accountInactiveReason: "Feishu account is disabled or not running in webhook mode."
	});
}
const channelSecrets = {
	secretTargetRegistryEntries,
	collectRuntimeConfigAssignments
};
//#endregion
export { collectRuntimeConfigAssignments as n, secretTargetRegistryEntries as r, channelSecrets as t };
