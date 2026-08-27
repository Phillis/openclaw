import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-Bre8L6Ts.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { t as formatDocsLink } from "./links-ClIwBcy4.js";
import { t as createAccountListHelpers } from "./account-helpers-Cnv50TjD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import "./secret-input-bJBlHnFk.js";
import { t as createSetupTranslator } from "./i18n-BQpjgFU-.js";
import { f as createTopLevelChannelParsedAllowFromPrompt, j as setSetupChannelEnabled, l as createTopLevelChannelDmPolicy, p as mergeAllowFromEntries, x as patchTopLevelChannelConfigSection, y as parseSetupEntriesWithParser } from "./setup-wizard-helpers-BGcFrkxT.js";
import { n as defineTokenCredential } from "./setup-credential-Cg5429p2.js";
import "./setup-BevReM2T.js";
import { n as schnorr, t as sha256 } from "./sha2-DF7LOszp.js";
import { c as bytesToHex, p as hexToBytes } from "./base-CN8S0a2r.js";
import { a as parseRelayUrls, c as validatePrivateKey, i as createNostrSetupStatus, l as decode, n as createNostrSetupAdapter, o as hasConfiguredNostrPrivateKey, r as createNostrSetupContract, s as resolveNostrPrivateKey, t as buildNostrSetupPatch, u as DEFAULT_RELAYS } from "./setup-adapter-Bs06grZz.js";
//#region node_modules/nostr-tools/lib/esm/pure.js
new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function isHex32(input) {
	if (input.length !== 64) return false;
	for (let i2 = 0; i2 < 64; i2++) {
		let cc = input.charCodeAt(i2);
		if (isNaN(cc) || cc < 48 || cc > 102 || cc > 57 && cc < 97) return false;
	}
	return true;
}
var verifiedSymbol = Symbol("verified");
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
	if (!isRecord(event)) return false;
	if (typeof event.kind !== "number") return false;
	if (typeof event.content !== "string") return false;
	if (typeof event.created_at !== "number") return false;
	if (typeof event.pubkey !== "string") return false;
	if (!isHex32(event.pubkey)) return false;
	if (!Array.isArray(event.tags)) return false;
	for (let i2 = 0; i2 < event.tags.length; i2++) {
		let tag = event.tags[i2];
		if (!Array.isArray(tag)) return false;
		for (let j = 0; j < tag.length; j++) if (typeof tag[j] !== "string") return false;
	}
	return true;
}
var JS = class {
	generateSecretKey() {
		return schnorr.utils.randomSecretKey();
	}
	getPublicKey(secretKey) {
		return bytesToHex(schnorr.getPublicKey(secretKey));
	}
	finalizeEvent(t, secretKey) {
		const event = t;
		event.pubkey = bytesToHex(schnorr.getPublicKey(secretKey));
		event.id = getEventHash(event);
		event.sig = bytesToHex(schnorr.sign(hexToBytes(getEventHash(event)), secretKey));
		event[verifiedSymbol] = true;
		return event;
	}
	verifyEvent(event) {
		if (typeof event[verifiedSymbol] === "boolean") return event[verifiedSymbol];
		try {
			const hash = getEventHash(event);
			if (hash !== event.id) {
				event[verifiedSymbol] = false;
				return false;
			}
			const valid = schnorr.verify(hexToBytes(event.sig), hexToBytes(hash), hexToBytes(event.pubkey));
			event[verifiedSymbol] = valid;
			return valid;
		} catch (err) {
			event[verifiedSymbol] = false;
			return false;
		}
	}
};
function serializeEvent(evt) {
	if (!validateEvent(evt)) throw new Error("can't serialize event with wrong or missing properties");
	return JSON.stringify([
		0,
		evt.pubkey,
		evt.created_at,
		evt.kind,
		evt.tags,
		evt.content
	]);
}
function getEventHash(event) {
	return bytesToHex(sha256(utf8Encoder.encode(serializeEvent(event))));
}
var i = new JS();
i.generateSecretKey;
var getPublicKey = i.getPublicKey;
i.finalizeEvent;
i.verifyEvent;
//#endregion
//#region extensions/nostr/src/nostr-key-utils.ts
function getPublicKeyFromPrivate(privateKey) {
	return getPublicKey(validatePrivateKey(privateKey));
}
function normalizePubkey(input) {
	const trimmed = input.trim();
	if (trimmed.startsWith("npub1") || trimmed.startsWith("NPUB1")) {
		const decoded = decode(trimmed);
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
		return hasConfiguredNostrPrivateKey(account?.privateKey) ? normalizeOptionalAccountId(account?.defaultAccount) ?? "default" : void 0;
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
	const configured = hasConfiguredNostrPrivateKey(nostrCfg?.privateKey);
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
const nostrSetupAdapter = createNostrSetupAdapter({ resolveAccountId: (cfg, accountId) => accountId?.trim() || resolveDefaultNostrAccountId(cfg) });
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
export { resolveDefaultNostrAccountId as a, listNostrAccountIds as i, nostrSetupContract as n, resolveNostrAccount as o, nostrSetupWizard as r, normalizePubkey as s, nostrSetupAdapter as t };
