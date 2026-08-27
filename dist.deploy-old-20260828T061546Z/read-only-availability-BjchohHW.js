import { t as hasNonEmptyString } from "./string-coerce-CIXf7egm.js";
import { d as isSecretRef, v as resolveSecretInputRef } from "./types.secrets-Bre8L6Ts.js";
import { l as isValidSecretRef, u as resolveDefaultSecretProviderAlias } from "./ref-contract-BHWY70rN.js";
import { a as resolveTokenExpiryState, r as hasUsableOAuthCredential } from "./credential-state-DJrnG0Ay.js";
import { c as isNonSecretApiKeyMarker, s as isKnownEnvApiKeyMarker } from "./model-auth-markers-Dy2BML3M.js";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-YkKaFTl8.js";
//#region src/agents/auth-profiles/read-only-availability.ts
/** Pure, non-resolving credential availability checks shared by status and route selection. */
function hasMalformedSecretInputSyntax(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:") || trimmed.startsWith("$");
}
function resolveSecretRefReadOnlyAvailability(value, cfg, env) {
	if (!isSecretRef(value) || !isValidSecretRef(value)) return false;
	if (value.source === "env") {
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg,
			provider: value.provider,
			id: value.id
		})) return false;
		return hasNonEmptyString(env[value.id]) ? true : void 0;
	}
	const source = cfg.secrets?.providers?.[value.provider];
	const isImplicitProvider = value.source === "store" && value.provider === resolveDefaultSecretProviderAlias(cfg, "store");
	if (!source && !isImplicitProvider || source && source.source !== value.source) return false;
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
