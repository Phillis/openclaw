import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { t as appendConfigPathSegment } from "./dot-path-BOSboevO.js";
import "./utils-Bw16L5tB.js";
//#region src/plugins/config-contract-matches.ts
function normalizePathPattern(pathPattern) {
	return normalizeStringEntries(pathPattern.split("."));
}
function parseCanonicalArrayIndex(segment, length) {
	const index = parseConfigPathArrayIndex(segment);
	return index !== void 0 && index < length ? index : null;
}
/** Collect concrete config values that match a plugin contract path pattern. */
function collectPluginConfigContractMatches(params) {
	const pattern = normalizePathPattern(params.pathPattern);
	if (pattern.length === 0) return [];
	let states = [{
		segments: [],
		value: params.root
	}];
	for (const segment of pattern) {
		const nextStates = [];
		for (const state of states) {
			if (segment === "*") {
				if (Array.isArray(state.value)) {
					for (const [index, value] of state.value.entries()) nextStates.push({
						segments: [...state.segments, index],
						value,
						parent: state.value
					});
					continue;
				}
				if (isRecord(state.value)) for (const [key, value] of Object.entries(state.value)) nextStates.push({
					segments: [...state.segments, key],
					value,
					parent: state.value
				});
				continue;
			}
			if (Array.isArray(state.value)) {
				const index = parseCanonicalArrayIndex(segment, state.value.length);
				if (index !== null) nextStates.push({
					segments: [...state.segments, index],
					value: state.value[index],
					parent: state.value
				});
				continue;
			}
			if (!isRecord(state.value) || !Object.hasOwn(state.value, segment)) continue;
			nextStates.push({
				segments: [...state.segments, segment],
				value: state.value[segment],
				parent: state.value
			});
		}
		states = nextStates;
		if (states.length === 0) break;
	}
	return states.map((state) => ({
		path: state.segments.reduce(appendConfigPathSegment, ""),
		value: state.value,
		parent: state.parent,
		key: String(state.segments.at(-1))
	}));
}
//#endregion
export { collectPluginConfigContractMatches as t };
