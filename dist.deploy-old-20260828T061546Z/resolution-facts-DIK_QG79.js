import { s as coerceSecretRef, t as DEFAULT_SECRET_PROVIDER_ALIAS } from "./types.secrets-Bre8L6Ts.js";
//#region src/config/resolution-facts.ts
const configResolutionFacts = /* @__PURE__ */ new WeakMap();
const authoredSecretRefsByFacts = /* @__PURE__ */ new WeakMap();
function createConfigResolutionFacts(warnings, pendingEnvSecretRefs = /* @__PURE__ */ new Map(), envProvider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	const facts = new Set(warnings.map(({ configPath }) => configPath));
	if (pendingEnvSecretRefs.size > 0) {
		const provider = envProvider?.trim() || "default";
		authoredSecretRefsByFacts.set(facts, new Map([...pendingEnvSecretRefs].map(([path, id]) => [path, {
			source: "env",
			provider,
			id
		}])));
	}
	return facts;
}
function setConfigResolutionFacts(target, facts) {
	if (!target || typeof target !== "object") return;
	if (facts === null) {
		configResolutionFacts.delete(target);
		return;
	}
	configResolutionFacts.set(target, facts);
}
function getConfigResolutionFacts(target) {
	return target && typeof target === "object" ? configResolutionFacts.get(target) ?? null : null;
}
function copyConfigResolutionFacts(source, target) {
	setConfigResolutionFacts(target, getConfigResolutionFacts(source));
}
function cloneConfigWithResolutionFacts(value) {
	const cloned = structuredClone(value);
	copyConfigResolutionFacts(value, cloned);
	return cloned;
}
function copyConfigResolutionFactsExcept(source, target, paths) {
	const facts = getConfigResolutionFacts(source);
	if (facts === null) {
		setConfigResolutionFacts(target, null);
		return;
	}
	const authoredSecretRefs = authoredSecretRefsByFacts.get(facts);
	if (paths.length === 0 || !paths.some((path) => facts.has(path) || authoredSecretRefs?.has(path) === true)) {
		setConfigResolutionFacts(target, facts);
		return;
	}
	const remaining = new Set(facts);
	paths.forEach((path) => remaining.delete(path));
	if (authoredSecretRefs) {
		const remainingAuthoredSecretRefs = new Map(authoredSecretRefs);
		paths.forEach((path) => remainingAuthoredSecretRefs.delete(path));
		if (remainingAuthoredSecretRefs.size > 0) authoredSecretRefsByFacts.set(remaining, remainingAuthoredSecretRefs);
	}
	setConfigResolutionFacts(target, remaining);
}
function hasUnresolvedConfigPath(target, path) {
	return getConfigResolutionFacts(target)?.has(path) === true;
}
/** Returns only a still-pending reference recorded from the authored config source. */
function getAuthoredConfigSecretRef(target, path) {
	const facts = getConfigResolutionFacts(target);
	return facts ? authoredSecretRefsByFacts.get(facts)?.get(path) ?? null : null;
}
/** Reads inline references from authored facts and structured references from their values. */
function resolveConfigSecretRef(params) {
	return typeof params.value === "string" && getConfigResolutionFacts(params.config) !== null ? getAuthoredConfigSecretRef(params.config, params.path) : coerceSecretRef(params.value, params.defaults);
}
function hasUnresolvedConfigPathInSubtree(target, path) {
	const facts = getConfigResolutionFacts(target);
	if (facts === null) return false;
	for (const candidate of facts) if (candidate === path || candidate.startsWith(`${path}.`) || candidate.startsWith(`${path}[`)) return true;
	return false;
}
//#endregion
export { getAuthoredConfigSecretRef as a, hasUnresolvedConfigPathInSubtree as c, createConfigResolutionFacts as i, resolveConfigSecretRef as l, copyConfigResolutionFacts as n, getConfigResolutionFacts as o, copyConfigResolutionFactsExcept as r, hasUnresolvedConfigPath as s, cloneConfigWithResolutionFacts as t, setConfigResolutionFacts as u };
