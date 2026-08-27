import { a as describeMattermostAccount, c as mattermostMeta, i as MattermostChannelConfigSchema, n as mattermostSetupWizard, o as isMattermostConfigured, r as mattermostSetupContract, s as mattermostConfigAdapter, t as mattermostPlugin } from "./channel-plugin-runtime-BVdpsKtP.js";
import { t as resolveMattermostGatewayAuthBypassPaths } from "./gateway-auth-bypass-B93t91oq.js";
//#region extensions/mattermost/src/channel.setup.ts
const mattermostSetupPlugin = {
	id: "mattermost",
	meta: { ...mattermostMeta },
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"group",
			"thread"
		],
		reactions: true,
		threads: true,
		media: true,
		nativeCommands: true
	},
	reload: {
		configPrefixes: ["channels.mattermost"],
		/**
		* accounts.default is promoted; named resolution merges only channel-wide fields
		* plus the selected account. Runtime monitor, debounce, and ingress use accountId.
		*/
		accountScopedRestart: true
	},
	configSchema: MattermostChannelConfigSchema,
	config: {
		...mattermostConfigAdapter,
		isConfigured: isMattermostConfigured,
		describeAccount: describeMattermostAccount
	},
	gateway: { resolveGatewayAuthBypassPaths: resolveMattermostGatewayAuthBypassPaths },
	setupContract: mattermostSetupContract,
	setupWizard: mattermostSetupWizard
};
//#endregion
export { mattermostPlugin, mattermostSetupPlugin };
