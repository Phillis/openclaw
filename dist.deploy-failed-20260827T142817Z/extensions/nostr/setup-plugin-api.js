import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-BRqK6RmF.js";
import { a as buildChannelConfigSchema } from "../../config-schema-7k2vg2UM.js";
import { n as describeAccountSnapshot } from "../../account-helpers-CEliAVvN.js";
import { i as createDelegatedSetupWizardProxy } from "../../setup-credential-Cmxmsv9d.js";
import "../../setup-runtime-H55NTv1L.js";
import { t as NostrConfigSchema } from "../../config-schema-C0jBPq4h.js";
import { i as createNostrSetupStatus, n as createNostrSetupAdapter, o as resolveNostrPrivateKey, r as createNostrSetupContract, s as DEFAULT_RELAYS } from "../../setup-adapter-CscT8RwU.js";
//#region extensions/nostr/src/channel.setup.ts
const channel = "nostr";
function getNostrConfig(cfg) {
	return cfg.channels?.nostr;
}
function resolveDefaultSetupNostrAccountId(cfg) {
	const configured = getNostrConfig(cfg)?.defaultAccount;
	return typeof configured === "string" && configured.trim() ? configured.trim() : DEFAULT_ACCOUNT_ID;
}
function resolveSetupNostrAccount(params) {
	const nostrCfg = getNostrConfig(params.cfg);
	const accountId = params.accountId?.trim() || resolveDefaultSetupNostrAccountId(params.cfg);
	const privateKey = resolveNostrPrivateKey(nostrCfg?.privateKey);
	const configured = Boolean(privateKey);
	return {
		accountId,
		name: typeof nostrCfg?.name === "string" ? nostrCfg.name : void 0,
		enabled: nostrCfg?.enabled !== false,
		configured,
		privateKey,
		publicKey: "",
		relays: nostrCfg?.relays ?? DEFAULT_RELAYS,
		profile: nostrCfg?.profile,
		config: {
			enabled: nostrCfg?.enabled,
			name: nostrCfg?.name,
			privateKey: nostrCfg?.privateKey,
			relays: nostrCfg?.relays,
			dmPolicy: nostrCfg?.dmPolicy,
			allowFrom: nostrCfg?.allowFrom,
			profile: nostrCfg?.profile
		}
	};
}
const nostrSetupWizard = createDelegatedSetupWizardProxy({
	channel,
	loadWizard: async () => (await import("../../setup-surface-oaOg9RA7.js")).nostrSetupWizard,
	status: createNostrSetupStatus(resolveSetupNostrAccount),
	resolveShouldPromptAccountIds: () => false,
	delegatePrepare: true,
	delegateFinalize: true
});
const nostrSetupPlugin = {
	id: channel,
	meta: {
		id: channel,
		label: "Nostr",
		selectionLabel: "Nostr",
		docsPath: "/channels/nostr",
		docsLabel: "nostr",
		blurb: "Decentralized DMs via Nostr relays (NIP-04)",
		order: 100
	},
	capabilities: {
		chatTypes: ["direct"],
		media: false
	},
	reload: { configPrefixes: ["channels.nostr"] },
	configSchema: buildChannelConfigSchema(NostrConfigSchema),
	setupContract: createNostrSetupContract(createNostrSetupAdapter({
		resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultSetupNostrAccountId(cfg),
		validatePrivateKey: (privateKey) => /^(?:nsec1|NSEC1)|^[0-9a-fA-F]{64}$/u.test(privateKey)
	})),
	setupWizard: nostrSetupWizard,
	config: {
		listAccountIds: (cfg) => resolveSetupNostrAccount({ cfg }).configured ? [resolveDefaultSetupNostrAccountId(cfg)] : [],
		resolveAccount: (cfg, accountId) => resolveSetupNostrAccount({
			cfg,
			accountId
		}),
		defaultAccountId: resolveDefaultSetupNostrAccountId,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: { publicKey: account.publicKey }
		})
	}
};
//#endregion
export { nostrSetupPlugin };
