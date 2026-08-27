import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
//#region src/config/types.secrets.ts
/** Provider alias used when a SecretRef omits a source-specific provider. */
const DEFAULT_SECRET_PROVIDER_ALIAS = "default";
/** Strict env-var id shape accepted for env-backed SecretRefs. */
const ENV_SECRET_REF_ID_RE = /^[A-Z][A-Z0-9_]{0,127}$/;
/** Legacy env SecretRef marker retained for config migration/read compatibility. */
const LEGACY_SECRETREF_ENV_MARKER_PREFIX = "secretref-env:";
/** Older env SecretRef marker retained for migration/read compatibility. */
const LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX = "__env__:";
const ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
const ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
/** Return whether an env SecretRef id is a supported uppercase environment variable name. */
function isValidEnvSecretRefId(value) {
	return ENV_SECRET_REF_ID_RE.test(value);
}
/** Narrow a value to the canonical SecretRef object shape. */
function isSecretRef(value) {
	if (!isRecord(value)) return false;
	if (Object.keys(value).length !== 3) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.provider === "string" && value.provider.trim().length > 0 && typeof value.id === "string" && value.id.trim().length > 0;
}
function isLegacySecretRefWithoutProvider(value) {
	if (!isRecord(value)) return false;
	return (value.source === "env" || value.source === "file" || value.source === "exec" || value.source === "store") && typeof value.id === "string" && value.id.trim().length > 0 && value.provider === void 0;
}
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
	if (!match) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id: expectDefined(match[1], "types.secrets regex capture 1")
	};
}
/** Collect env ids from supported SecretRef shapes anywhere in a config tree. */
function collectEnvSecretRefIds(value) {
	const ids = /* @__PURE__ */ new Set();
	const seen = /* @__PURE__ */ new WeakSet();
	const visit = (candidate) => {
		const ref = coerceSecretRef(candidate);
		if (ref?.source === "env" && isValidEnvSecretRefId(ref.id)) {
			ids.add(ref.id);
			return;
		}
		if (typeof candidate !== "object" || candidate === null || seen.has(candidate)) return;
		seen.add(candidate);
		for (const child of Array.isArray(candidate) ? candidate : Object.values(candidate)) visit(child);
	};
	visit(value);
	return ids;
}
/** Detect retired env SecretRef marker strings for migration and explicit rejection. */
function isLegacySecretRefEnvMarker(value) {
	if (typeof value !== "string") return false;
	const trimmed = value.trim();
	return trimmed.startsWith("secretref-env:") || trimmed.startsWith("__env__:");
}
/** Parse legacy env SecretRef marker strings for config migration. */
function parseLegacySecretRefEnvMarker(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (!isLegacySecretRefEnvMarker(value)) return null;
	const trimmed = value.trim();
	const prefix = trimmed.startsWith("secretref-env:") ? LEGACY_SECRETREF_ENV_MARKER_PREFIX : trimmed.startsWith("__env__:") ? LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX : void 0;
	if (!prefix) return null;
	const id = trimmed.slice(prefix.length);
	if (!ENV_SECRET_REF_ID_RE.test(id)) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id
	};
}
/** Coerce canonical and env-shorthand secret inputs into a SecretRef.
* Retired string markers are parsed only by doctor migration above. */
function coerceSecretRef(value, defaults) {
	if (isSecretRef(value)) return value;
	if (isLegacySecretRefWithoutProvider(value)) {
		const provider = defaults?.[value.source] ?? "default";
		return {
			source: value.source,
			provider,
			id: value.id
		};
	}
	const envTemplate = parseEnvTemplateSecretRef(value, defaults?.env);
	if (envTemplate) return envTemplate;
	return null;
}
/** Return whether a value contains either a literal secret string or resolvable SecretRef shape. */
function hasConfiguredSecretInput(value, defaults) {
	if (normalizeSecretInputString(value)) return true;
	return coerceSecretRef(value, defaults) !== null;
}
/** Trim a literal secret input string while leaving non-string inputs unresolved. */
function normalizeSecretInputString(value) {
	return normalizeOptionalString(value);
}
function formatSecretRefLabel(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
/** Error thrown when strict secret reads encounter a configured but unresolved SecretRef. */
var UnresolvedSecretInputError = class extends Error {
	constructor(params) {
		super(`${params.path}: unresolved SecretRef "${formatSecretRefLabel(params.ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`);
		this.name = "UnresolvedSecretInputError";
		this.path = params.path;
		this.ref = params.ref;
	}
};
/** Narrow errors from strict secret read sites without parsing user-facing messages. */
function isUnresolvedSecretInputError(value) {
	return value instanceof UnresolvedSecretInputError;
}
function createUnresolvedSecretInputError(params) {
	return new UnresolvedSecretInputError(params);
}
/** Throw when a secret field still contains an unresolved SecretRef at a read site. */
function assertSecretInputResolved(params) {
	const { ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	if (!ref) return;
	throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
}
/** Resolve a secret field to either a literal value, a configured-unavailable ref, or missing. */
function resolveSecretInputString(params) {
	const { explicitRef, ref } = resolveSecretInputRef({
		value: params.value,
		refValue: params.refValue,
		defaults: params.defaults
	});
	const normalized = normalizeSecretInputString(params.value);
	if (normalized && !explicitRef) return {
		status: "available",
		value: normalized,
		ref: null
	};
	if (!ref) return {
		status: "missing",
		value: void 0,
		ref: null
	};
	if ((params.mode ?? "strict") === "strict") throw createUnresolvedSecretInputError({
		path: params.path,
		ref
	});
	return {
		status: "configured_unavailable",
		value: void 0,
		ref
	};
}
/** Return a strict literal secret value, throwing if the field still points at a SecretRef. */
function normalizeResolvedSecretInputString(params) {
	const resolved = resolveSecretInputString({
		...params,
		mode: "strict"
	});
	if (resolved.status === "available") return resolved.value;
}
/** Resolve explicit `refValue` before inline secret references embedded in `value`. */
function resolveSecretInputRef(params) {
	const explicitRef = coerceSecretRef(params.refValue, params.defaults);
	const inlineRef = explicitRef ? null : coerceSecretRef(params.value, params.defaults);
	return {
		explicitRef,
		inlineRef,
		ref: explicitRef ?? inlineRef
	};
}
//#endregion
export { parseLegacySecretRefEnvMarker as _, UnresolvedSecretInputError as a, collectEnvSecretRefIds as c, isSecretRef as d, isUnresolvedSecretInputError as f, parseEnvTemplateSecretRef as g, normalizeSecretInputString as h, LEGACY_SECRETREF_ENV_MARKER_PREFIX as i, hasConfiguredSecretInput as l, normalizeResolvedSecretInputString as m, ENV_SECRET_REF_ID_RE as n, assertSecretInputResolved as o, isValidEnvSecretRefId as p, LEGACY_DOUBLE_UNDERSCORE_ENV_MARKER_PREFIX as r, coerceSecretRef as s, DEFAULT_SECRET_PROVIDER_ALIAS as t, isLegacySecretRefEnvMarker as u, resolveSecretInputRef as v, resolveSecretInputString as y };
