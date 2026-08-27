import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { d as isSecretRef, v as resolveSecretInputRef } from "./types.secrets-BrIfhxSG.js";
import { c as resolveDefaultSecretProviderAlias, s as isValidSecretRef } from "./ref-contract-BDz7f4XS.js";
import { a as resolveTokenExpiryState, r as hasUsableOAuthCredential } from "./credential-state-DRH6Q-Y3.js";
import { c as isNonSecretApiKeyMarker, s as isKnownEnvApiKeyMarker } from "./model-auth-markers-DzAepWRR.js";
//#region src/agents/auth-profiles/read-only-availability.ts
/** Pure, non-resolving credential availability checks shared by status and route selection. */
function hasMalformedSecretInputSyntax(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:") || trimmed.startsWith("$");
}
function resolveSecretRefReadOnlyAvailability(value, cfg, env) {
	if (!isSecretRef(value) || !isValidSecretRef(value)) return false;
	const source = cfg.secrets?.providers?.[value.provider];
	const isImplicitProvider = value.source === "env" && value.provider === resolveDefaultSecretProviderAlias(cfg, "env") || value.source === "store" && value.provider === resolveDefaultSecretProviderAlias(cfg, "store");
	if (!source && !isImplicitProvider || source && source.source !== value.source) return false;
	if (value.source === "env") return source?.source === "env" && source.allowlist && !source.allowlist.includes(value.id) ? false : hasNonEmptyString(env[value.id]) ? true : void 0;
	if (value.source === "file" && source?.source === "file" && source.mode === "singleValue" !== (value.id === "value")) return false;
}
function resolveSecretInputReadOnlyAvailability(value, refValue, cfg, env) {
	const { ref } = resolveSecretInputRef({
		value,
		refValue,
		defaults: cfg.secrets?.defaults
	});
	if (ref) return resolveSecretRefReadOnlyAvailability(ref, cfg, env);
	if (!hasNonEmptyString(value)) return false;
	if (hasMalformedSecretInputSyntax(value)) return false;
	return isKnownEnvApiKeyMarker(value) ? hasNonEmptyString(env[value.trim()]) : isNonSecretApiKeyMarker(value) ? void 0 : true;
}
function resolveStoredCredentialReadOnlyAvailability(params) {
	const { credential, cfg, env } = params;
	const now = params.now ?? Date.now();
	if (credential.type === "api_key") return resolveSecretInputReadOnlyAvailability(credential.key, credential.keyRef, cfg, env);
	if (credential.type === "token") {
		const expiryState = resolveTokenExpiryState(credential.expires, now);
		if (expiryState === "expired" || expiryState === "invalid_expires") return false;
		return resolveSecretInputReadOnlyAvailability(credential.token, credential.tokenRef, cfg, env);
	}
	if (hasUsableOAuthCredential(credential, { now })) return true;
	if (hasNonEmptyString(credential.refresh)) return params.canRefreshOAuth ? true : void 0;
	return credential.oauthRef && !hasNonEmptyString(credential.access) ? void 0 : false;
}
//#endregion
export { resolveSecretRefReadOnlyAvailability as n, resolveStoredCredentialReadOnlyAvailability as r, hasMalformedSecretInputSyntax as t };
