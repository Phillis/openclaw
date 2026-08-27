import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./state-paths-BIUvtBLx.js";
import { t as getZalouserRuntime } from "./runtime-DpqP3-RQ.js";
import { createHash } from "node:crypto";
import os from "node:os";
import path from "node:path";
//#region extensions/zalouser/src/session-state.ts
const ZALOUSER_CREDENTIALS_NAMESPACE = "credentials";
function normalizeZalouserCredentialProfile(profile) {
	return normalizeLowercaseStringOrEmpty(profile) || "default";
}
function zalouserCredentialStoreKey(profile) {
	return `profile:${createHash("sha256").update(normalizeZalouserCredentialProfile(profile)).digest("hex")}`;
}
function resolveLegacyZalouserCredentialsDir(env = process.env) {
	return path.join(resolveStateDir(env, os.homedir), "credentials", "zalouser");
}
function resolveLegacyZalouserCredentialsPath(profile, env = process.env) {
	const normalized = normalizeZalouserCredentialProfile(profile);
	const filename = normalized === "default" ? "credentials.json" : `credentials-${encodeURIComponent(normalized)}.json`;
	return path.join(resolveLegacyZalouserCredentialsDir(env), filename);
}
function normalizeStoredZaloCredentials(value, profile) {
	if (!value || typeof value !== "object") return null;
	const parsed = value;
	if (typeof parsed.imei !== "string" || !parsed.imei || !parsed.cookie || typeof parsed.userAgent !== "string" || !parsed.userAgent || typeof parsed.createdAt !== "string" || !parsed.createdAt) return null;
	return {
		profile: normalizeZalouserCredentialProfile(profile ?? parsed.profile),
		imei: parsed.imei,
		cookie: parsed.cookie,
		userAgent: parsed.userAgent,
		...typeof parsed.language === "string" ? { language: parsed.language } : {},
		createdAt: parsed.createdAt,
		...typeof parsed.lastUsedAt === "string" ? { lastUsedAt: parsed.lastUsedAt } : {}
	};
}
function isZaloCredentialRevocation(value, profile) {
	if (!value || typeof value !== "object") return false;
	const parsed = value;
	return parsed.kind === "revoked" && typeof parsed.revokedAt === "string" && parsed.revokedAt.length > 0 && normalizeZalouserCredentialProfile(parsed.profile) === normalizeZalouserCredentialProfile(profile ?? parsed.profile);
}
function openZalouserCredentialsStore(env = process.env) {
	return getZalouserRuntime().state.openSyncKeyedStore({
		namespace: ZALOUSER_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env
	});
}
function loadStoredZaloCredentials(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const parsed = normalizeStoredZaloCredentials(openZalouserCredentialsStore(env).lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile);
	return parsed?.profile === normalizedProfile ? parsed : null;
}
function saveStoredZaloCredentials(profile, credentials, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	openZalouserCredentialsStore(env).register(zalouserCredentialStoreKey(normalizedProfile), {
		profile: normalizedProfile,
		...credentials
	});
}
function refreshStoredZaloCredentials(profile, credentials, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const update = openZalouserCredentialsStore(env).update;
	if (!update) throw new Error("Zalo credential refresh requires atomic plugin-state updates");
	let saved = true;
	update(zalouserCredentialStoreKey(normalizedProfile), (current) => {
		if (isZaloCredentialRevocation(current, normalizedProfile)) {
			saved = false;
			return current;
		}
		return {
			profile: normalizedProfile,
			...credentials
		};
	});
	return saved;
}
function clearStoredZaloCredentials(profile, env = process.env) {
	const normalizedProfile = normalizeZalouserCredentialProfile(profile);
	const store = openZalouserCredentialsStore(env);
	const hadCredentials = normalizeStoredZaloCredentials(store.lookup(zalouserCredentialStoreKey(normalizedProfile)), normalizedProfile) !== null;
	store.register(zalouserCredentialStoreKey(normalizedProfile), {
		kind: "revoked",
		profile: normalizedProfile,
		revokedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	return hadCredentials;
}
//#endregion
export { normalizeStoredZaloCredentials as a, resolveLegacyZalouserCredentialsDir as c, zalouserCredentialStoreKey as d, loadStoredZaloCredentials as i, resolveLegacyZalouserCredentialsPath as l, clearStoredZaloCredentials as n, normalizeZalouserCredentialProfile as o, isZaloCredentialRevocation as r, refreshStoredZaloCredentials as s, ZALOUSER_CREDENTIALS_NAMESPACE as t, saveStoredZaloCredentials as u };
