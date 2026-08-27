import { d as isSecretRef, p as isValidEnvSecretRefId, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./types.secrets-Bre8L6Ts.js";
//#region src/secrets/ref-contract.ts
/** Shared SecretRef grammar and validation helpers for config, schema, SDK, and gateway parity. */
/**
* Runtime secret-reference grammar shared by config parsing, plugin SDK schemas,
* gateway parity checks, and resolver planning.
*/
const FILE_SECRET_REF_SEGMENT_PATTERN = /^(?:[^~]|~0|~1)*$/;
/** Shared alias grammar for env/file/exec/store secret provider names. */
const SECRET_PROVIDER_ALIAS_PATTERN = /^[a-z][a-z0-9_-]{0,63}$/;
const EXEC_SECRET_REF_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/;
/** Canonical id for file secret providers that expose exactly one value. */
const SINGLE_VALUE_FILE_REF_ID = "value";
/** Builds the stable map key used to cache or compare resolved secret refs. */
function secretRefKey(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Resolves the default provider alias for one source, falling back to the built-in alias. */
function resolveDefaultSecretProviderAlias(config, source, options) {
	const configured = config.secrets?.defaults?.[source];
	if (configured?.trim()) return configured.trim();
	if (options?.preferFirstProviderForSource) {
		const providers = config.secrets?.providers;
		if (providers) {
			for (const [providerName, provider] of Object.entries(providers)) if (provider?.source === source) return providerName;
		}
	}
	return DEFAULT_SECRET_PROVIDER_ALIAS;
}
/** Builds an environment-backed gateway credential using its configured provider alias. */
function createGatewayEnvSecretRef(config, envVarName) {
	return {
		source: "env",
		provider: resolveDefaultSecretProviderAlias(config, "env", { preferFirstProviderForSource: true }),
		id: envVarName
	};
}
/** Whether a source-specific built-in provider owns this selected default alias. */
function isBuiltInDefaultSecretProviderRef(config, ref) {
	return config.secrets?.providers?.[ref.provider]?.source !== ref.source && (ref.source === "env" || ref.source === "store") && ref.provider === resolveDefaultSecretProviderAlias(config, ref.source);
}
/** Returns the configured provider source when a SecretRef selects an impossible pairing. */
function resolveSecretRefProviderSourceMismatch(config, ref) {
	const configuredSource = config.secrets?.providers?.[ref.provider]?.source;
	if (!configuredSource || configuredSource === ref.source || isBuiltInDefaultSecretProviderRef(config, ref)) return null;
	return configuredSource;
}
/** Validates file secret ref ids against the shared JSON-pointer-style contract. */
function isValidFileSecretRefId(value) {
	if (value === "value") return true;
	if (!value.startsWith("/")) return false;
	return value.slice(1).split("/").every((segment) => FILE_SECRET_REF_SEGMENT_PATTERN.test(segment));
}
/** Validates a secret provider alias against the shared config/gateway grammar. */
function isValidSecretProviderAlias(value) {
	return SECRET_PROVIDER_ALIAS_PATTERN.test(value);
}
/** Validates exec secret ref ids and reports why invalid ids failed. */
function validateExecSecretRefId(value) {
	if (!EXEC_SECRET_REF_ID_PATTERN.test(value)) return {
		ok: false,
		reason: "pattern"
	};
	for (const segment of value.split("/")) if (segment === "." || segment === "..") return {
		ok: false,
		reason: "traversal-segment"
	};
	return { ok: true };
}
/** Boolean convenience wrapper for callers that only need accept/reject behavior. */
function isValidExecSecretRefId(value) {
	return validateExecSecretRefId(value).ok;
}
/** Validates a complete SecretRef against the shared provider/source/id grammar. */
function isValidSecretRef(ref) {
	if (!isSecretRef(ref)) return false;
	if (!isValidSecretProviderAlias(ref.provider)) return false;
	if (ref.source === "env") return isValidEnvSecretRefId(ref.id);
	if (ref.source === "file") return isValidFileSecretRefId(ref.id);
	if (ref.source === "store") return isValidEnvSecretRefId(ref.id);
	return isValidExecSecretRefId(ref.id);
}
/** Formats the user-facing validation message for rejected exec secret ref ids. */
function formatExecSecretRefIdValidationMessage() {
	return [
		"Exec secret reference id must match /^[A-Za-z0-9][A-Za-z0-9._:/#-]{0,255}$/",
		"and must not include \".\" or \"..\" path segments",
		"(example: \"vault/openai/api-key\" or \"aws/secret#json_key\")."
	].join(" ");
}
//#endregion
export { isBuiltInDefaultSecretProviderRef as a, isValidSecretProviderAlias as c, resolveSecretRefProviderSourceMismatch as d, secretRefKey as f, formatExecSecretRefIdValidationMessage as i, isValidSecretRef as l, SINGLE_VALUE_FILE_REF_ID as n, isValidExecSecretRefId as o, validateExecSecretRefId as p, createGatewayEnvSecretRef as r, isValidFileSecretRefId as s, SECRET_PROVIDER_ALIAS_PATTERN as t, resolveDefaultSecretProviderAlias as u };
