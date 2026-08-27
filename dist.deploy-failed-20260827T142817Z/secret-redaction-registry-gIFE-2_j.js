import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.js";
//#region src/logging/secret-redaction-registry.ts
const MIN_SECRET_VALUE_LENGTH = 6;
const MAX_SECRET_VALUES = 512;
const registeredValues = /* @__PURE__ */ new Map();
let compiledMatcher;
let firstChars = /* @__PURE__ */ new Set();
function rebuildProbe() {
	firstChars = new Set([...registeredValues.keys()].map((value) => value.charAt(0)));
	compiledMatcher = void 0;
}
function registerOneSecretValue(value) {
	if (registeredValues.delete(value)) {
		registeredValues.set(value, true);
		return;
	}
	registeredValues.set(value, true);
	pruneMapToMaxSize(registeredValues, MAX_SECRET_VALUES);
	rebuildProbe();
}
/** Registers one resolved secret for exact-value log redaction. */
function registerSecretValueForRedaction(value) {
	if (value.length < MIN_SECRET_VALUE_LENGTH) return;
	const encoded = encodeURIComponent(value);
	if (encoded !== value) registerOneSecretValue(encoded);
	const jsonEscaped = JSON.stringify(value).slice(1, -1);
	if (jsonEscaped !== value) registerOneSecretValue(jsonEscaped);
	registerOneSecretValue(value);
}
/** Returns whether a value has SecretRef provenance in the process registry. */
function isSecretValueRegisteredForRedaction(value) {
	return registeredValues.has(value);
}
function hasRegisteredSecretValuesForRedaction() {
	return registeredValues.size > 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	if (!text || registeredValues.size === 0) return text;
	let couldMatch = false;
	for (const firstChar of firstChars) if (text.includes(firstChar)) {
		couldMatch = true;
		break;
	}
	if (!couldMatch) return text;
	compiledMatcher ??= new RegExp([...registeredValues.keys()].toSorted((left, right) => right.length - left.length).map(escapeRegExp).join("|"), "g");
	return text.replace(compiledMatcher, (value) => mask(value));
}
function resetSecretRedactionRegistryForTest() {
	registeredValues.clear();
	rebuildProbe();
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
//#endregion
export { registerSecretValueForRedaction as i, isSecretValueRegisteredForRedaction as n, redactRegisteredSecretValues as r, hasRegisteredSecretValuesForRedaction as t };
