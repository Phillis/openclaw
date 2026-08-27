import { n as describeAccountSnapshot } from "../../account-helpers-Cnv50TjD.js";
import { i as resolveBuzzAccount, o as resolveDefaultBuzzAccountId, r as listBuzzAccountIds } from "../../types-CwQqI1bE.js";
import { a as BuzzConfigSchema, n as buzzSetupContract, t as buzzSetupWizard } from "../../setup-surface-BPFBfvQ3.js";
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
