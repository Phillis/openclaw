import { n as normalizeAccountId } from "../../account-id-BH0zJUew.js";
import { a as buildChannelConfigSchema } from "../../config-schema-ikPYPY3Q.js";
import { n as describeAccountSnapshot } from "../../account-helpers-Cnv50TjD.js";
import { i as createDelegatedSetupWizardProxy } from "../../setup-credential-Cg5429p2.js";
import "../../setup-runtime-DoSscGn3.js";
import { t as NostrConfigSchema } from "../../config-schema-CgcIn0fz2.js";
import { i as createNostrSetupStatus, n as createNostrSetupAdapter, o as hasConfiguredNostrPrivateKey, r as createNostrSetupContract, s as resolveNostrPrivateKey, u as DEFAULT_RELAYS } from "../../setup-adapter-DrptPRT0.js";
//#region extensions/nostr/src/channel.setup.ts
const channel = "nostr";
function getNostrConfig(cfg) {
	return cfg.channels?.nostr;
}
function resolveDefaultSetupNostrAccountId(cfg) {
	return normalizeAccountId(getNostrConfig(cfg)?.defaultAccount);
}
function resolveSetupNostrAccount(params) {
	const nostrCfg = getNostrConfig(params.cfg);
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultSetupNostrAccountId(params.cfg));
	const privateKey = resolveNostrPrivateKey(nostrCfg?.privateKey);
	const configured = hasConfiguredNostrPrivateKey(nostrCfg?.privateKey);
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
	loadWizard: async () => (await import("../../setup-surface-hxbUYVTE.js")).nostrSetupWizard,
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
	setupContract: createNostrSetupContract(createNostrSetupAdapter({ resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultSetupNostrAccountId(cfg) })),
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
