import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as hasConfiguredSecretInput, y as resolveSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import { t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-D5EZZ925.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./secret-input-bJBlHnFk.js";
import { a as getPublicKey, o as nip19_exports } from "./esm-DvxIBjlD.js";
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
	const resolveCredential = (field) => resolveSecretInputString({
		value: config[field],
		path: `channels.buzz.${field}`,
		mode: "inspect"
	});
	const privateKeyResolution = resolveCredential("privateKey");
	const authTagResolution = resolveCredential("authTag");
	const privateKey = privateKeyResolution.value ?? (privateKeyResolution.status === "missing" ? process.env.BUZZ_PRIVATE_KEY?.trim() || "" : "");
	const authTag = authTagResolution.value ?? (authTagResolution.status === "missing" ? process.env.BUZZ_AUTH_TAG?.trim() || "" : "");
	let publicKey = "";
	if (privateKey) try {
		publicKey = resolveBuzzPublicKey(privateKey);
	} catch {}
	return {
		accountId: DEFAULT_ACCOUNT_ID,
		name: normalizeOptionalString(config.name) ?? "OpenClaw",
		enabled: config.enabled !== false,
		configured: Boolean(relayUrl && (privateKey || privateKeyResolution.ref)),
		relayUrl,
		privateKey,
		authTag,
		publicKey,
		tokenStatus: privateKeyResolution.ref || authTagResolution.ref ? "configured_unavailable" : privateKey ? "available" : "missing",
		config
	};
}
function assertBuzzAccountAvailable(account) {
	assertSecretOwnerAvailable("account", `buzz:${account.accountId}`);
	if (account.tokenStatus === "configured_unavailable") throw new Error(`Buzz credentials for account "${account.accountId}" are configured but unavailable.`);
}
//#endregion
export { resolveBuzzPublicKey as a, buildBuzzTarget as c, normalizeBuzzTarget as d, parseBuzzTarget as f, resolveBuzzAccount as i, isConfiguredBuzzChannel as l, decodeBuzzPrivateKey as n, resolveDefaultBuzzAccountId as o, listBuzzAccountIds as r, BUZZ_CHANNEL_ID_PATTERN as s, assertBuzzAccountAvailable as t, looksLikeBuzzTarget as u };
