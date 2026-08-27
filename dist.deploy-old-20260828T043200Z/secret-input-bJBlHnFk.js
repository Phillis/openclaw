import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-Bre8L6Ts.js";
import { Bt as discriminatedUnion, Et as array, Rn as string, Tn as object, Xn as union, dn as literal } from "./schemas-CZ9Toj_c.js";
import { i as formatExecSecretRefIdValidationMessage, o as isValidExecSecretRefId, s as isValidFileSecretRefId, t as SECRET_PROVIDER_ALIAS_PATTERN } from "./ref-contract-BHWY70rN.js";
import { n as sensitive } from "./zod-schema.sensitive-OPEpgIMg.js";
//#region src/plugin-sdk/secret-input-schema.ts
/**
* Returns the shared secret-input schema for plaintext values and env/file/exec/store refs.
* Reusing this singleton preserves sensitive-path registration for config redaction.
*/
function buildSecretInputSchema() {
	return secretInputSchema;
}
/** Register a plugin-owned config schema leaf for redaction in host config projections. */
function registerSensitiveConfigSchema(schema) {
	sensitive.add(schema);
	return schema;
}
const providerSchema = string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\").");
const secretInputSchema = union([string(), discriminatedUnion("source", [
	object({
		source: literal("env"),
		provider: providerSchema,
		id: string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("store"),
		provider: providerSchema,
		id: string().regex(ENV_SECRET_REF_ID_RE, "Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("file"),
		provider: providerSchema,
		id: string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
	}).strict(),
	object({
		source: literal("exec"),
		provider: providerSchema,
		id: string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
	}).strict()
])]).register(sensitive);
//#endregion
//#region src/plugin-sdk/secret-input.ts
/**
* Builds an optional secret-input schema for config fields that may be omitted.
* The inner schema stays shared so sensitive-path redaction still recognizes it.
*/
function buildOptionalSecretInputSchema() {
	return buildSecretInputSchema().optional();
}
/**
* Builds an array schema for provider/channel config that accepts multiple secret inputs.
* Each element uses the shared schema so plaintext and ref validation stay identical.
*/
function buildSecretInputArraySchema() {
	return array(buildSecretInputSchema());
}
//#endregion
export { registerSensitiveConfigSchema as i, buildSecretInputArraySchema as n, buildSecretInputSchema as r, buildOptionalSecretInputSchema as t };
