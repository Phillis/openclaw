import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-Bre8L6Ts.js";
import "./account-id-BH0zJUew.js";
import { t as defineChannelSetupContract } from "./setup-contract-CIbR6uxD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import "./secret-input-bJBlHnFk.js";
import { t as createSetupTranslator } from "./i18n-BQpjgFU-.js";
import { N as splitSetupEntries, s as createStandardChannelSetupStatus, x as patchTopLevelChannelConfigSection } from "./setup-wizard-helpers-BGcFrkxT.js";
import "./setup-BevReM2T.js";
import "./channel-setup-BFU3ELzE.js";
import { c as bytesToHex, n as bech32 } from "./base-CN8S0a2r.js";
//#region extensions/nostr/src/default-relays.ts
const DEFAULT_RELAYS = ["wss://relay.damus.io", "wss://nos.lol"];
//#endregion
//#region node_modules/nostr-tools/lib/esm/nip19.js
var utf8Decoder = new TextDecoder("utf-8");
new TextEncoder();
var Bech32MaxSize = 5e3;
function decode(code) {
	let { prefix, words } = bech32.decode(code, Bech32MaxSize);
	let data = new Uint8Array(bech32.fromWords(words));
	switch (prefix) {
		case "nprofile": {
			let tlv = parseTLV(data);
			if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for nprofile");
			if (tlv[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
			return {
				type: "nprofile",
				data: {
					pubkey: bytesToHex(tlv[0][0]),
					relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
				}
			};
		}
		case "nevent": {
			let tlv = parseTLV(data);
			if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for nevent");
			if (tlv[0][0].length !== 32) throw new Error("TLV 0 should be 32 bytes");
			if (tlv[2] && tlv[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
			if (tlv[3] && tlv[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
			return {
				type: "nevent",
				data: {
					id: bytesToHex(tlv[0][0]),
					relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
					author: tlv[2]?.[0] ? bytesToHex(tlv[2][0]) : void 0,
					kind: tlv[3]?.[0] ? parseInt(bytesToHex(tlv[3][0]), 16) : void 0
				}
			};
		}
		case "naddr": {
			let tlv = parseTLV(data);
			if (!tlv[0]?.[0]) throw new Error("missing TLV 0 for naddr");
			if (!tlv[2]?.[0]) throw new Error("missing TLV 2 for naddr");
			if (tlv[2][0].length !== 32) throw new Error("TLV 2 should be 32 bytes");
			if (!tlv[3]?.[0]) throw new Error("missing TLV 3 for naddr");
			if (tlv[3][0].length !== 4) throw new Error("TLV 3 should be 4 bytes");
			return {
				type: "naddr",
				data: {
					identifier: utf8Decoder.decode(tlv[0][0]),
					pubkey: bytesToHex(tlv[2][0]),
					kind: parseInt(bytesToHex(tlv[3][0]), 16),
					relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
				}
			};
		}
		case "nsec": return {
			type: prefix,
			data
		};
		case "npub":
		case "note": return {
			type: prefix,
			data: bytesToHex(data)
		};
		default: throw new Error(`unknown prefix ${prefix}`);
	}
}
function parseTLV(data) {
	let result = {};
	let rest = data;
	while (rest.length > 0) {
		if (rest.length < 2) throw new Error("not enough data to read TLV");
		let t = rest[0];
		let l = rest[1];
		let v = rest.slice(2, 2 + l);
		rest = rest.slice(2 + l);
		if (v.length < l) throw new Error(`not enough data to read on TLV ${t}`);
		result[t] = result[t] || [];
		result[t].push(v);
	}
	return result;
}
//#endregion
//#region extensions/nostr/src/private-key.ts
const NOSTR_PRIVATE_KEY_ENV_VAR = "NOSTR_PRIVATE_KEY";
const SECP256K1_ORDER = BigInt("0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141");
/** Validate and normalize a private key (hex or NIP-19 nsec). */
function validatePrivateKey(key) {
	const trimmed = key.trim();
	let bytes;
	if (trimmed.startsWith("nsec1") || trimmed.startsWith("NSEC1")) {
		let decoded;
		try {
			decoded = decode(trimmed);
		} catch {
			throw new Error("Invalid nsec private key");
		}
		if (decoded.type !== "nsec") throw new Error("Invalid nsec key type");
		bytes = decoded.data;
	} else {
		if (!/^[0-9a-fA-F]{64}$/.test(trimmed)) throw new Error("Private key must be 64 hex characters or nsec bech32 format");
		bytes = Uint8Array.from({ length: 32 }, (_, index) => Number.parseInt(trimmed.slice(index * 2, index * 2 + 2), 16));
	}
	if (bytes.length !== 32) throw new Error("Private key must decode to 32 bytes");
	const scalar = Array.from(bytes).reduce((value, byte) => value << 8n | BigInt(byte), 0n);
	if (scalar === 0n || scalar >= SECP256K1_ORDER) throw new Error("Private key scalar is out of range");
	return bytes;
}
function hasConfiguredNostrPrivateKey(value) {
	return hasConfiguredSecretInput(value) || Boolean(process.env["NOSTR_PRIVATE_KEY"]?.trim());
}
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
				try {
					validatePrivateKey(privateKey);
				} catch {
					return "Nostr private key must be valid nsec or 64-character hex.";
				}
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
export { parseRelayUrls as a, validatePrivateKey as c, createNostrSetupStatus as i, decode as l, createNostrSetupAdapter as n, hasConfiguredNostrPrivateKey as o, createNostrSetupContract as r, resolveNostrPrivateKey as s, buildNostrSetupPatch as t, DEFAULT_RELAYS as u };
