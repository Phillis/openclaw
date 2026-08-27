import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-BrIfhxSG.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as createSetupTranslator } from "./i18n-BzsUVhtU.js";
import { t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
import "./secret-input-CkeFVjF0.js";
import { f as createTopLevelChannelParsedAllowFromPrompt, j as setSetupChannelEnabled, l as createTopLevelChannelDmPolicy, p as mergeAllowFromEntries, x as patchTopLevelChannelConfigSection, y as parseSetupEntriesWithParser } from "./setup-wizard-helpers-Dm-d9du3.js";
import { n as defineTokenCredential } from "./setup-credential-DGTRzzky.js";
import "./setup-BVnDItNa.js";
import { a as getPublicKey, o as nip19_exports } from "./esm-wjc48qKt.js";
import { a as parseRelayUrls, i as createNostrSetupStatus, n as createNostrSetupAdapter, o as resolveNostrPrivateKey, r as createNostrSetupContract, s as DEFAULT_RELAYS, t as buildNostrSetupPatch } from "./setup-adapter-BpBc7RdM.js";
//#region extensions/nostr/src/nostr-key-utils.ts
/**
* Validate and normalize a private key (accepts hex or nsec format)
*/
function validatePrivateKey(key) {
	const trimmed = key.trim();
	if (trimmed.startsWith("nsec1") || trimmed.startsWith("NSEC1")) {
		const decoded = nip19_exports.decode(trimmed);
		if (decoded.type !== "nsec") throw new Error("Invalid nsec key: wrong type");
		return decoded.data;
	}
	if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) throw new Error("Private key must be 64 hex characters or nsec bech32 format");
	const bytes = /* @__PURE__ */ new Uint8Array(32);
	for (let i = 0; i < 32; i++) bytes[i] = Number.parseInt(trimmed.slice(i * 2, i * 2 + 2), 16);
	return bytes;
}
/**
* Get public key from private key (hex or nsec format)
*/
function getPublicKeyFromPrivate(privateKey) {
	return getPublicKey(validatePrivateKey(privateKey));
}
/**
* Normalize a pubkey to hex format (accepts npub or hex)
*/
function normalizePubkey(input) {
	const trimmed = input.trim();
	if (trimmed.startsWith("npub1") || trimmed.startsWith("NPUB1")) {
		const decoded = nip19_exports.decode(trimmed);
		if (decoded.type !== "npub" || typeof decoded.data !== "string") throw new Error("Invalid npub key");
		return decoded.data.toLowerCase();
	}
	if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) throw new Error("Pubkey must be 64 hex characters or npub format");
	return trimmed.toLowerCase();
}
//#endregion
//#region extensions/nostr/src/types.ts
const { listAccountIds: listNostrAccountIds, resolveDefaultAccountId: resolveDefaultNostrAccountId } = createAccountListHelpers("nostr", {
	fallbackAccountIdWhenEmpty: false,
	resolveImplicitAccountId: (cfg) => {
		const account = cfg.channels?.nostr;
		return resolveNostrPrivateKey(account?.privateKey) ? normalizeOptionalAccountId(account?.defaultAccount) ?? "default" : void 0;
	}
});
/**
* Resolve a Nostr account from config
*/
function resolveNostrAccount(opts) {
	const accountId = normalizeAccountId(opts.accountId ?? resolveDefaultNostrAccountId(opts.cfg));
	const nostrCfg = opts.cfg.channels?.nostr;
	const baseEnabled = nostrCfg?.enabled !== false;
	const privateKey = resolveNostrPrivateKey(nostrCfg?.privateKey);
	const configured = Boolean(privateKey);
	let publicKey = "";
	if (privateKey) try {
		publicKey = getPublicKeyFromPrivate(privateKey);
	} catch {}
	return {
		accountId,
		name: normalizeOptionalString(nostrCfg?.name),
		enabled: baseEnabled,
		configured,
		privateKey,
		publicKey,
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
//#endregion
//#region extensions/nostr/src/setup-surface.ts
const t = createSetupTranslator();
const channel = "nostr";
const NOSTR_SETUP_HELP_LINES = [
	t("wizard.nostr.helpPrivateKeyFormat"),
	t("wizard.nostr.helpRelaysOptional"),
	t("wizard.nostr.helpEnvVars"),
	`Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`
];
const NOSTR_ALLOW_FROM_HELP_LINES = [
	t("wizard.nostr.allowlistIntro"),
	t("wizard.nostr.examples"),
	"- npub1...",
	"- nostr:npub1...",
	"- 0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
	t("wizard.nostr.multipleEntries"),
	`Docs: ${formatDocsLink("/channels/nostr", "channels/nostr")}`
];
function parseNostrAllowFrom(raw) {
	return parseSetupEntriesWithParser(raw, (entry) => {
		const cleaned = entry.replace(/^nostr:/i, "").trim();
		try {
			return { value: normalizePubkey(cleaned) };
		} catch {
			return { error: `Invalid Nostr pubkey: ${entry}` };
		}
	});
}
const nostrDmPolicy = createTopLevelChannelDmPolicy({
	label: "Nostr",
	channel,
	policyKey: "channels.nostr.dmPolicy",
	allowFromKey: "channels.nostr.allowFrom",
	getCurrent: (cfg) => cfg.channels?.nostr?.dmPolicy ?? "pairing",
	promptAllowFrom: createTopLevelChannelParsedAllowFromPrompt({
		channel,
		defaultAccountId: resolveDefaultNostrAccountId,
		noteTitle: t("wizard.nostr.allowlistTitle"),
		noteLines: NOSTR_ALLOW_FROM_HELP_LINES,
		message: t("wizard.nostr.allowFromPrompt"),
		placeholder: "npub1..., 0123abcd...",
		parseEntries: parseNostrAllowFrom,
		mergeEntries: ({ existing, parsed }) => mergeAllowFromEntries(existing, parsed)
	})
});
const nostrSetupAdapter = createNostrSetupAdapter({
	resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultNostrAccountId(cfg),
	validatePrivateKey: (privateKey) => {
		try {
			getPublicKeyFromPrivate(privateKey);
			return true;
		} catch {
			return false;
		}
	}
});
const nostrSetupContract = createNostrSetupContract(nostrSetupAdapter);
const nostrSetupWizard = {
	channel,
	resolveAccountIdForConfigure: ({ accountOverride, defaultAccountId }) => accountOverride?.trim() || defaultAccountId,
	resolveShouldPromptAccountIds: () => false,
	status: createNostrSetupStatus(resolveNostrAccount),
	introNote: {
		title: t("wizard.nostr.setupTitle"),
		lines: NOSTR_SETUP_HELP_LINES
	},
	envShortcut: {
		prompt: t("wizard.nostr.privateKeyEnvPrompt"),
		preferredEnvVar: "NOSTR_PRIVATE_KEY",
		isAvailable: ({ cfg, accountId }) => accountId === "default" && Boolean(process.env.NOSTR_PRIVATE_KEY?.trim()) && !hasConfiguredSecretInput(resolveNostrAccount({
			cfg,
			accountId
		}).config.privateKey),
		apply: async ({ cfg, accountId }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			enabled: true,
			clearFields: ["privateKey"],
			patch: buildNostrSetupPatch(accountId, {})
		})
	},
	credentials: [defineTokenCredential({
		inputKey: "privateKey",
		configKey: "privateKey",
		providerHint: channel,
		credentialLabel: "private key",
		preferredEnvVar: "NOSTR_PRIVATE_KEY",
		helpTitle: t("wizard.nostr.privateKeyTitle"),
		helpLines: NOSTR_SETUP_HELP_LINES,
		envPrompt: t("wizard.nostr.privateKeyEnvPrompt"),
		keepPrompt: t("wizard.nostr.privateKeyKeep"),
		inputPrompt: t("wizard.nostr.privateKeyInput"),
		allowEnv: ({ accountId }) => accountId === DEFAULT_ACCOUNT_ID,
		resolveAccount: ({ cfg, accountId }) => resolveNostrAccount({
			cfg,
			accountId
		}),
		accountConfigured: (account) => account.configured,
		resolvedValue: (account) => normalizeSecretInputString(account.config.privateKey),
		envValue: () => process.env.NOSTR_PRIVATE_KEY?.trim(),
		patchAccount: ({ cfg, accountId, patch, clearFields }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			enabled: true,
			clearFields,
			patch: buildNostrSetupPatch(accountId, patch)
		}),
		useEnv: { clearFields: ["privateKey"] },
		set: { value: "resolved" }
	})],
	textInputs: [{
		inputKey: "relayUrls",
		message: t("wizard.nostr.relayUrlsPrompt"),
		placeholder: DEFAULT_RELAYS.join(", "),
		required: false,
		applyEmptyValue: true,
		helpTitle: t("wizard.nostr.relaysTitle"),
		helpLines: [t("wizard.nostr.relaysWsOnly"), t("wizard.nostr.helpRelaysOptional")],
		currentValue: ({ cfg, accountId }) => {
			const account = resolveNostrAccount({
				cfg,
				accountId
			});
			const configuredRelays = cfg.channels?.nostr?.relays;
			return (configuredRelays && configuredRelays.length > 0 ? account.relays : []).join(", ");
		},
		keepPrompt: (value) => t("wizard.nostr.relayUrlsKeep", { value }),
		validate: ({ value }) => parseRelayUrls(value).error,
		applySet: async ({ cfg, accountId, value }) => {
			const relayResult = parseRelayUrls(value);
			return patchTopLevelChannelConfigSection({
				cfg,
				channel,
				enabled: true,
				clearFields: relayResult.relays.length > 0 ? void 0 : ["relays"],
				patch: buildNostrSetupPatch(accountId, relayResult.relays.length > 0 ? { relays: relayResult.relays } : {})
			});
		}
	}],
	dmPolicy: nostrDmPolicy,
	disable: (cfg) => setSetupChannelEnabled(cfg, channel, false)
};
//#endregion
export { resolveDefaultNostrAccountId as a, validatePrivateKey as c, listNostrAccountIds as i, nostrSetupContract as n, resolveNostrAccount as o, nostrSetupWizard as r, normalizePubkey as s, nostrSetupAdapter as t };
