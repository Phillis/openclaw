import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { r as createPluginStateSyncKeyedStore } from "./plugin-state-store-TmxGb72e.js";
import "./plugin-state-store-runtime-zhG4QdUU.js";
import { n as getOptionalMatrixRuntime } from "./runtime-Drg4hYqm.js";
import { i as normalizeMatrixStoredCredentials, r as matrixCredentialsStoreKey, t as MATRIX_CREDENTIALS_NAMESPACE } from "./credentials-state-CTDQ3UhX.js";
import "./storage-paths-B8sBkehG.js";
//#region extensions/matrix/src/matrix/credentials-read.ts
function openMatrixCredentialsStore(env = process.env) {
	const runtime = getOptionalMatrixRuntime();
	return createPluginStateSyncKeyedStore("matrix", {
		namespace: MATRIX_CREDENTIALS_NAMESPACE,
		maxEntries: 256,
		overflowPolicy: "reject-new",
		env: env.OPENCLAW_STATE_DIR?.trim() || !runtime ? env : {
			...env,
			OPENCLAW_STATE_DIR: runtime.state.resolveStateDir(env)
		}
	});
}
function loadMatrixCredentials(env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	const parsed = normalizeMatrixStoredCredentials(openMatrixCredentialsStore(env).lookup(matrixCredentialsStoreKey(accountId)), normalizedAccountId);
	if (!parsed || parsed.accountId !== normalizedAccountId) return null;
	const { accountId: _accountId, ...credentials } = parsed;
	return credentials;
}
function clearMatrixCredentials(env = process.env, accountId) {
	const normalizedAccountId = normalizeAccountId(accountId);
	openMatrixCredentialsStore(env).register(matrixCredentialsStoreKey(normalizedAccountId), {
		accountId: normalizedAccountId,
		kind: "revoked",
		revokedAt: (/* @__PURE__ */ new Date()).toISOString()
	});
}
function credentialsMatchConfig(stored, config) {
	if (!config.userId) {
		if (!config.accessToken) return false;
		return stored.homeserver === config.homeserver && stored.accessToken === config.accessToken;
	}
	return stored.homeserver === config.homeserver && stored.userId === config.userId;
}
//#endregion
export { openMatrixCredentialsStore as i, credentialsMatchConfig as n, loadMatrixCredentials as r, clearMatrixCredentials as t };
