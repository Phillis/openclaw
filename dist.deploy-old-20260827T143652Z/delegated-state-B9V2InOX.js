import { t as getMSTeamsRuntime } from "./runtime-WoHzfrEz.js";
//#region extensions/msteams/src/delegated-state.ts
const MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME = "msteams-delegated.json";
const MSTEAMS_DELEGATED_TOKEN_NAMESPACE = "delegated-token";
const MSTEAMS_DELEGATED_TOKEN_KEY = "current";
function openDelegatedTokenStore(env) {
	return getMSTeamsRuntime().state.openSyncKeyedStore({
		namespace: MSTEAMS_DELEGATED_TOKEN_NAMESPACE,
		maxEntries: 1,
		overflowPolicy: "reject-new",
		...env ? { env } : {}
	});
}
function normalizeMSTeamsDelegatedTokens(value) {
	if (!value || typeof value !== "object") return null;
	const token = value;
	if (typeof token.accessToken !== "string" || !token.accessToken || typeof token.refreshToken !== "string" || !token.refreshToken || typeof token.expiresAt !== "number" || !Number.isFinite(token.expiresAt) || !Array.isArray(token.scopes) || !token.scopes.every((scope) => typeof scope === "string" && scope.length > 0)) return null;
	return {
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		expiresAt: token.expiresAt,
		scopes: [...token.scopes],
		...typeof token.userPrincipalName === "string" ? { userPrincipalName: token.userPrincipalName } : {}
	};
}
function loadMSTeamsDelegatedTokens(env) {
	return normalizeMSTeamsDelegatedTokens(openDelegatedTokenStore(env).lookup("current")) ?? void 0;
}
function saveMSTeamsDelegatedTokens(tokens, env) {
	const normalized = normalizeMSTeamsDelegatedTokens(tokens);
	if (!normalized) throw new Error("Invalid Microsoft Teams delegated token payload");
	openDelegatedTokenStore(env).register(MSTEAMS_DELEGATED_TOKEN_KEY, normalized);
}
//#endregion
export { normalizeMSTeamsDelegatedTokens as a, loadMSTeamsDelegatedTokens as i, MSTEAMS_DELEGATED_TOKEN_LEGACY_FILENAME as n, saveMSTeamsDelegatedTokens as o, MSTEAMS_DELEGATED_TOKEN_NAMESPACE as r, MSTEAMS_DELEGATED_TOKEN_KEY as t };
