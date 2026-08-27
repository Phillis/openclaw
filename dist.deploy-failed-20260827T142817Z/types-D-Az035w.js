import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-BrIfhxSG.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./secret-input-Dv7SE4A5.js";
import { a as getPublicKey, o as nip19_exports } from "./esm-B8-t-Wx3.js";
//#region extensions/buzz/src/target.ts
const BUZZ_CHANNEL_ID_PATTERN = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/u;
function normalizeBuzzTarget(target) {
	return target.trim().replace(/^buzz:/iu, "").replace(/^channel:/iu, "");
}
function parseBuzzTarget(target) {
	const channelId = normalizeBuzzTarget(target);
	if (!BUZZ_CHANNEL_ID_PATTERN.test(channelId)) throw new Error("Buzz target must be a channel UUID");
	return channelId.toLowerCase();
}
function isConfiguredBuzzChannel(configuredChannelIds, channelId) {
	try {
		return configuredChannelIds.has(parseBuzzTarget(channelId));
	} catch {
		return false;
	}
}
function buildBuzzTarget(channelId) {
	return `buzz:${parseBuzzTarget(channelId)}`;
}
function looksLikeBuzzTarget(target) {
	try {
		parseBuzzTarget(target);
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region extensions/buzz/src/types.ts
function resolveChannelConfig(cfg) {
	return cfg.channels?.buzz;
}
function normalizeBuzzGroups(groups) {
	if (!groups) return;
	return Object.fromEntries(Object.entries(groups).map(([channelId, group]) => [parseBuzzTarget(channelId), group]));
}
function decodeBuzzPrivateKey(value) {
	const trimmed = value.trim();
	if (/^[0-9a-f]{64}$/iu.test(trimmed)) return Uint8Array.from(Buffer.from(trimmed, "hex"));
	const decoded = nip19_exports.decode(trimmed);
	if (decoded.type !== "nsec") throw new Error("Buzz private key must be nsec or 64-character hex");
	return decoded.data;
}
function resolveBuzzPublicKey(privateKey) {
	return getPublicKey(decodeBuzzPrivateKey(privateKey));
}
function listBuzzAccountIds(cfg) {
	const config = resolveChannelConfig(cfg);
	const relayUrl = config?.relayUrl?.trim() || process.env.BUZZ_RELAY_URL?.trim();
	const privateKeyConfigured = hasConfiguredSecretInput(config?.privateKey, cfg.secrets?.defaults) || Boolean(process.env.BUZZ_PRIVATE_KEY?.trim());
	return relayUrl || privateKeyConfigured ? [DEFAULT_ACCOUNT_ID] : [];
}
function resolveDefaultBuzzAccountId(_cfg) {
	return DEFAULT_ACCOUNT_ID;
}
function resolveBuzzAccount(params) {
	const rawConfig = resolveChannelConfig(params.cfg) ?? {};
	const config = {
		...rawConfig,
		groupPolicy: rawConfig.groupPolicy ?? "allowlist",
		groups: normalizeBuzzGroups(rawConfig.groups)
	};
	const relayUrl = config.relayUrl?.trim() || process.env.BUZZ_RELAY_URL?.trim() || "";
	const privateKey = normalizeSecretInputString(config.privateKey) || process.env.BUZZ_PRIVATE_KEY?.trim() || "";
	const authTag = normalizeSecretInputString(config.authTag) || process.env.BUZZ_AUTH_TAG?.trim() || "";
	let publicKey = "";
	if (privateKey) try {
		publicKey = resolveBuzzPublicKey(privateKey);
	} catch {}
	return {
		accountId: DEFAULT_ACCOUNT_ID,
		name: normalizeOptionalString(config.name) ?? "OpenClaw",
		enabled: config.enabled !== false,
		configured: Boolean(relayUrl && privateKey),
		relayUrl,
		privateKey,
		authTag,
		publicKey,
		config
	};
}
//#endregion
export { resolveDefaultBuzzAccountId as a, isConfiguredBuzzChannel as c, parseBuzzTarget as d, resolveBuzzPublicKey as i, looksLikeBuzzTarget as l, listBuzzAccountIds as n, BUZZ_CHANNEL_ID_PATTERN as o, resolveBuzzAccount as r, buildBuzzTarget as s, decodeBuzzPrivateKey as t, normalizeBuzzTarget as u };
