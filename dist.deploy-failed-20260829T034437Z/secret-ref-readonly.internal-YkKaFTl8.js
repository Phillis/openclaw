import { u as resolveDefaultSecretProviderAlias } from "./ref-contract-BHWY70rN.js";
//#region src/plugin-sdk/secret-ref-readonly.internal.ts
/** Checks whether a read-only plugin path may resolve a secret through an env provider. */
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (!providerConfig) return params.provider === resolveDefaultSecretProviderAlias(params.cfg ?? {}, "env");
	if (providerConfig.source !== "env") return false;
	const allowlist = providerConfig.allowlist;
	return !allowlist || allowlist.includes(params.id);
}
//#endregion
export { canResolveEnvSecretRefInReadOnlyPath as t };
