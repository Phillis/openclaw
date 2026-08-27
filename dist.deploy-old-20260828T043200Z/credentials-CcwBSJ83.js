import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { i as normalizeMatrixStoredCredentials, n as isMatrixCredentialRevocation, r as matrixCredentialsStoreKey } from "./credentials-state-CTDQ3UhX.js";
import { a as resolveMatrixCredentialsPath, r as resolveMatrixCredentialsDir } from "./storage-paths-B8sBkehG.js";
import { i as openMatrixCredentialsStore, n as credentialsMatchConfig, r as loadMatrixCredentials, t as clearMatrixCredentials } from "./credentials-read-CujlLqDG.js";
//#region extensions/matrix/src/matrix/credentials.ts
function requireCredentialStoreUpdate(store) {
	if (!store.update) throw new Error("Matrix credentials require atomic plugin-state updates");
	return store.update;
}
async function saveMatrixCredentials(credentials, env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const store = openMatrixCredentialsStore(env);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	requireCredentialStoreUpdate(store)(matrixCredentialsStoreKey(normalizedAccountId), (current) => {
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		return {
			accountId: normalizedAccountId,
			homeserver: credentials.homeserver,
			userId: credentials.userId,
			accessToken: credentials.accessToken,
			...typeof credentials.deviceId === "string" ? { deviceId: credentials.deviceId } : {},
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
	});
}
async function saveBackfilledMatrixDeviceId(credentials, env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const store = openMatrixCredentialsStore(env);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let result = "saved";
	requireCredentialStoreUpdate(store)(matrixCredentialsStoreKey(normalizedAccountId), (current) => {
		if (isMatrixCredentialRevocation(current, normalizedAccountId)) {
			result = "skipped";
			return current;
		}
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		if (existing && (existing.homeserver !== credentials.homeserver || existing.userId !== credentials.userId || existing.accessToken !== credentials.accessToken)) {
			result = "skipped";
			return existing;
		}
		return {
			accountId: normalizedAccountId,
			homeserver: credentials.homeserver,
			userId: credentials.userId,
			accessToken: credentials.accessToken,
			...typeof credentials.deviceId === "string" ? { deviceId: credentials.deviceId } : {},
			createdAt: existing?.createdAt ?? now,
			lastUsedAt: now
		};
	});
	return result;
}
async function touchMatrixCredentials(env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	requireCredentialStoreUpdate(openMatrixCredentialsStore(env))(matrixCredentialsStoreKey(normalizedAccountId), (current) => {
		if (isMatrixCredentialRevocation(current, normalizedAccountId)) return current;
		const existing = normalizeMatrixStoredCredentials(current, normalizedAccountId);
		return existing ? {
			...existing,
			lastUsedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : void 0;
	});
}
//#endregion
export { clearMatrixCredentials, credentialsMatchConfig, loadMatrixCredentials, resolveMatrixCredentialsDir, resolveMatrixCredentialsPath, saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
