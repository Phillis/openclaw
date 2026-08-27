import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-BrIfhxSG.js";
import { t as defineChannelSetupContract } from "./setup-contract-DNfi_CdO.js";
import { t as createSetupTranslator } from "./i18n-BzsUVhtU.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
import "./secret-input-CkeFVjF0.js";
import { N as splitSetupEntries, s as createStandardChannelSetupStatus, x as patchTopLevelChannelConfigSection } from "./setup-wizard-helpers-Dm-d9du3.js";
import "./setup-BVnDItNa.js";
import "./channel-setup-BeEHkyUZ.js";
//#region extensions/nostr/src/default-relays.ts
const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://nos.lol"];
//#endregion
//#region extensions/nostr/src/private-key.ts
const NOSTR_PRIVATE_KEY_ENV_VAR = "NOSTR_PRIVATE_KEY";
function resolveNostrPrivateKey(value) {
	const configured = normalizeSecretInputString(value);
	if (configured || hasConfiguredSecretInput(value)) return configured ?? "";
	return process.env["NOSTR_PRIVATE_KEY"]?.trim() ?? "";
}
//#endregion
//#region extensions/nostr/src/setup-adapter.ts
const channel = "nostr";
function buildNostrSetupPatch(accountId, patch) {
	return {
		...accountId !== "default" ? { defaultAccount: accountId } : {},
		...patch
	};
}
function parseRelayUrls(raw) {
	const relays = [];
	for (const entry of splitSetupEntries(raw)) {
		try {
			const parsed = new URL(entry);
			if (parsed.protocol !== "ws:" && parsed.protocol !== "wss:") return {
				relays: [],
				error: `Relay must use ws:// or wss:// (${entry})`
			};
		} catch {
			return {
				relays: [],
				error: `Invalid relay URL: ${entry}`
			};
		}
		relays.push(entry);
	}
	return { relays: uniqueStrings(relays) };
}
function createNostrSetupAdapter(params) {
	return {
		resolveAccountId: ({ cfg, accountId }) => params.resolveAccountId(cfg, accountId),
		applyAccountName: ({ cfg, accountId, name }) => patchTopLevelChannelConfigSection({
			cfg,
			channel,
			patch: buildNostrSetupPatch(accountId, name?.trim() ? { name: name.trim() } : {})
		}),
		validateInput: ({ input }) => {
			if (!input.useEnv) {
				const privateKey = input.privateKey?.trim();
				if (!privateKey) return "Nostr requires --private-key or --use-env.";
				if (!params.validatePrivateKey(privateKey)) return "Nostr private key must be valid nsec or 64-character hex.";
			}
			if (input.relayUrls?.trim()) return parseRelayUrls(input.relayUrls).error ?? null;
			return null;
		},
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const relayResult = input.relayUrls?.trim() ? parseRelayUrls(input.relayUrls) : { relays: [] };
			return patchTopLevelChannelConfigSection({
				cfg,
				channel,
				enabled: true,
				clearFields: input.useEnv ? ["privateKey"] : void 0,
				patch: buildNostrSetupPatch(accountId, {
					...input.useEnv ? {} : { privateKey: input.privateKey?.trim() },
					...relayResult.relays.length > 0 ? { relays: relayResult.relays } : {}
				})
			});
		}
	};
}
function createNostrSetupContract(adapter) {
	return defineChannelSetupContract({
		fields: {
			privateKey: {
				kind: "string",
				sensitive: true,
				cli: {
					flags: "--private-key <key>",
					description: "Nostr private key"
				}
			},
			relayUrls: {
				kind: "string",
				cli: {
					flags: "--relay-urls <urls>",
					description: "Nostr relay URLs"
				}
			},
			useEnv: {
				kind: "boolean",
				cli: {
					flags: "--use-env",
					description: "Use NOSTR_PRIVATE_KEY"
				},
				envVars: [NOSTR_PRIVATE_KEY_ENV_VAR]
			}
		},
		adapter
	});
}
function createNostrSetupStatus(resolveAccount) {
	const t = createSetupTranslator();
	return createStandardChannelSetupStatus({
		channelLabel: "Nostr",
		configuredLabel: t("wizard.channels.statusConfigured"),
		unconfiguredLabel: t("wizard.channels.statusNeedsPrivateKey"),
		configuredHint: t("wizard.channels.statusConfigured"),
		unconfiguredHint: t("wizard.channels.statusNeedsPrivateKey"),
		configuredScore: 1,
		unconfiguredScore: 0,
		includeStatusLine: true,
		resolveConfigured: ({ cfg, accountId }) => resolveAccount({
			cfg,
			accountId
		}).configured,
		resolveExtraStatusLines: ({ cfg }) => {
			return [`Relays: ${resolveAccount({ cfg }).relays.length || DEFAULT_RELAYS.length}`];
		}
	});
}
//#endregion
export { parseRelayUrls as a, createNostrSetupStatus as i, createNostrSetupAdapter as n, resolveNostrPrivateKey as o, createNostrSetupContract as r, DEFAULT_RELAYS as s, buildNostrSetupPatch as t };
