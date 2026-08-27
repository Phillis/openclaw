import { n as describeAccountSnapshot } from "../../account-helpers-CEliAVvN.js";
import { a as resolveDefaultBuzzAccountId, n as listBuzzAccountIds, r as resolveBuzzAccount } from "../../types-C5tYJCky.js";
import { a as BuzzConfigSchema, n as buzzSetupContract, t as buzzSetupWizard } from "../../setup-surface-D9WHxl6x.js";
//#region extensions/buzz/src/channel.setup.ts
const buzzSetupPlugin = {
	id: "buzz",
	meta: {
		id: "buzz",
		label: "Buzz",
		selectionLabel: "Buzz",
		docsPath: "/channels/buzz",
		docsLabel: "buzz",
		blurb: "Connect OpenClaw agents to Buzz team rooms.",
		markdownCapable: true,
		order: 56
	},
	capabilities: {
		chatTypes: ["group"],
		threads: true
	},
	reload: { configPrefixes: ["channels.buzz"] },
	configSchema: BuzzConfigSchema,
	setupContract: buzzSetupContract,
	setupWizard: buzzSetupWizard,
	config: {
		listAccountIds: listBuzzAccountIds,
		resolveAccount: (cfg, accountId) => resolveBuzzAccount({
			cfg,
			accountId
		}),
		defaultAccountId: resolveDefaultBuzzAccountId,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: {
				baseUrl: account.relayUrl,
				publicKey: account.publicKey
			}
		})
	}
};
//#endregion
export { buzzSetupPlugin };
