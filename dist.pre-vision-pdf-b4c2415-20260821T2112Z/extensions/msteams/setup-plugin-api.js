import { n as describeAccountSnapshot } from "../../account-helpers-CEliAVvN.js";
import { g as resolveMSTeamsCredentials } from "../../graph-users-B5yWW-ul.js";
import { a as msteamsSetupContract, o as msteamsConfigAdapter, s as msteamsMeta, t as msteamsSetupWizard } from "../../setup-surface-BxOGXYHO.js";
import { t as MSTeamsChannelConfigSchema } from "../../config-schema-BleYFo7l.js";
//#region extensions/msteams/src/channel.setup.ts
const msteamsSetupPlugin = {
	id: "msteams",
	meta: {
		...msteamsMeta,
		aliases: [...msteamsMeta.aliases]
	},
	capabilities: {
		chatTypes: [
			"direct",
			"channel",
			"thread"
		],
		polls: true,
		threads: true,
		media: true
	},
	reload: { configPrefixes: ["channels.msteams"] },
	configSchema: MSTeamsChannelConfigSchema,
	config: {
		...msteamsConfigAdapter,
		isConfigured: (_account, cfg) => Boolean(resolveMSTeamsCredentials(cfg.channels?.msteams)),
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured
		})
	},
	setupWizard: msteamsSetupWizard,
	setupContract: msteamsSetupContract
};
//#endregion
export { msteamsSetupPlugin };
