import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/matrix/src/storage-paths.ts
function sanitizeMatrixPathSegment(value) {
	return normalizeLowercaseStringOrEmpty(value).replace(/[^a-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "") || "unknown";
}
function resolveMatrixHomeserverKey(homeserver) {
	try {
		const url = new URL(homeserver);
		if (url.host) return sanitizeMatrixPathSegment(url.host);
	} catch {}
	return sanitizeMatrixPathSegment(homeserver);
}
function hashMatrixAccessToken(accessToken) {
	return crypto.createHash("sha256").update(accessToken).digest("hex").slice(0, 16);
}
function resolveMatrixCredentialsFilename(accountId) {
	const normalized = normalizeAccountId(accountId);
	return normalized === "default" ? "credentials.json" : `credentials-${normalized}.json`;
}
function resolveMatrixCredentialsDir(stateDir) {
	return path.join(stateDir, "credentials", "matrix");
}
function resolveMatrixCredentialsPath(params) {
	return path.join(resolveMatrixCredentialsDir(params.stateDir), resolveMatrixCredentialsFilename(params.accountId));
}
function resolveMatrixAccountStorageRoot(params) {
	const accountKey = sanitizeMatrixPathSegment(params.accountId ?? "default");
	const userKey = sanitizeMatrixPathSegment(params.userId);
	const serverKey = resolveMatrixHomeserverKey(params.homeserver);
	const tokenHash = hashMatrixAccessToken(params.accessToken);
	return {
		rootDir: path.join(params.stateDir, "matrix", "accounts", accountKey, `${serverKey}__${userKey}`, tokenHash),
		accountKey,
		tokenHash
	};
}
//#endregion
export { resolveMatrixCredentialsPath as a, resolveMatrixCredentialsFilename as i, resolveMatrixAccountStorageRoot as n, resolveMatrixHomeserverKey as o, resolveMatrixCredentialsDir as r, sanitizeMatrixPathSegment as s, hashMatrixAccessToken as t };
