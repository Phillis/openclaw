import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./redact-CWP17HFN.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import "./utils-Bw16L5tB.js";
import { n as containsEnvVarReference } from "./env-substitution-DXYJj0ec.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as normalizeAgentModelRefForConfig, t as normalizeAgentModelMapForConfig } from "./model-input-ILUprkGk.js";
import { n as normalizeAgentId } from "./agent-id-CeT3w4ap.js";
import { i as listAgentEntriesWithSource, n as hasAgentRosterProperty, o as readAgentRosterProperty, r as listAgentEntries, y as toAgentEntriesRecord } from "./agent-scope-config-CUBiGmG3.js";
import { a as resolveModelProviderRouteOverridePresence, i as resolveMergedModelProviderModels, n as resolveMergedModelProviderConfig, r as resolveMergedModelProviderEntry } from "./model-provider-config-B3wTMsqG.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { t as coerceConfig } from "./io.read-helpers-YVBmmwxJ.js";
import { c as hasUnresolvedConfigPathInSubtree, o as getConfigResolutionFacts, s as hasUnresolvedConfigPath } from "./resolution-facts-DIK_QG79.js";
import { a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { n as createMergePatch, t as applyMergePatch } from "./merge-patch-BukSB2Pq.js";
import { t as isSecretRefShape } from "./redact-snapshot.secret-ref-C5jAxjdG.js";
import { t as resolveDirectBundledProviderPolicySurface } from "./provider-policy-surface-D3wds4go.js";
import { isDeepStrictEqual } from "node:util";
//#region src/config/agent-roster-provenance.ts
function rosterEntryBoundaryContainsInclude(value) {
	if (!isRecord(value)) return false;
	if (Object.hasOwn(value, "$include")) return true;
	return [value.id, value.default].some((field) => isRecord(field) && Object.hasOwn(field, "$include"));
}
function authoredRosterBoundaryContainsInclude(value) {
	if (isRecord(value) && Object.hasOwn(value, "$include")) return true;
	if (Array.isArray(value)) return value.some(rosterEntryBoundaryContainsInclude);
	if (!isRecord(value)) return false;
	return Object.values(value).some(rosterEntryBoundaryContainsInclude);
}
function readRosterValue(raw) {
	if (!isRecord(raw) || !isRecord(raw.agents)) return;
	if (Object.hasOwn(raw.agents, "entries")) return raw.agents.entries;
	return Object.hasOwn(raw.agents, "list") ? raw.agents.list : void 0;
}
/**
* Roster include ownership decision table:
* - Include-owned: an include contributes membership or default metadata at agents.entries/list,
*   an entry object, an id/default field, a nested entries/list $include, or an ambiguous
*   byte-identical roster contribution.
* - Locally owned: ancestor includes contribute only unrelated config, or an include is nested
*   inside entry-internal identity/model/etc. fields that cannot change membership or default;
*   canonical roster writes preserve those entry-internal authored include nodes in place.
*/
function includeContributionOwnsAgentRoster(event) {
	if (event.path.length === 0) return hasAgentRosterProperty(event.value);
	if (event.path.length === 1 && event.path[0] === "agents") return isRecord(event.value) && (Object.hasOwn(event.value, "entries") || Object.hasOwn(event.value, "list"));
	if (event.path[0] !== "agents") return false;
	if (event.path[1] === "entries") return event.path.length <= 3 || event.path[3] === "default";
	if (event.path[1] === "list") return event.path.length <= 3 || event.path[3] === "id" || event.path[3] === "default";
	return false;
}
function includeContributionOwnsBindings(event) {
	if (event.path.length === 0) return isRecord(event.value) && Object.hasOwn(event.value, "bindings");
	return event.path[0] === "bindings";
}
/** Whether include/env resolution produced a non-empty roster before raw migrations. */
function hasResolvedRosterBeforeMigrations(snapshot) {
	return listAgentEntries(snapshot.sourceConfigBeforeMigrations ?? {}).length > 0;
}
/** Whether an include, rather than the authored root, owns agents.entries. */
function configIncludeOwnsAgentRosterValues(params) {
	const resolved = params.sourceConfigBeforeMigrations;
	if (!hasAgentRosterProperty(resolved)) return false;
	if (authoredRosterBoundaryContainsInclude(readRosterValue(params.parsed))) return true;
	return params.includeContributesRoster === true;
}
/** Whether an include, rather than the authored root, owns agents.entries. */
function configIncludeOwnsAgentRoster(snapshot) {
	return configIncludeOwnsAgentRosterValues({
		parsed: snapshot.parsed,
		sourceConfigBeforeMigrations: snapshot.sourceConfigBeforeMigrations,
		includeContributesRoster: snapshot.agentRosterIncludeOwned
	});
}
//#endregion
//#region src/config/io.write-prepare.ts
const AGENT_ROSTER_PATHS = [["agents", "entries"], ["agents", "list"]];
var DuplicateAgentRosterIdError = class extends Error {
	constructor(agentId) {
		super(`Config write cannot canonicalize duplicate normalized agent id "${agentId}".`);
		this.name = "DuplicateAgentRosterIdError";
	}
};
function assertUniqueNormalizedLegacyRosterIds(value) {
	const normalizedIds = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.id !== "string") continue;
		const agentId = normalizeAgentId(entry.id);
		if (normalizedIds.has(agentId)) throw new DuplicateAgentRosterIdError(agentId);
		normalizedIds.add(agentId);
	}
}
function cloneUnknown(value) {
	return structuredClone(value);
}
function projectSourceOntoRuntimeShape(source, runtime) {
	if (!isRecord(source) || !isRecord(runtime)) return cloneUnknown(source);
	const next = {};
	for (const [key, sourceValue] of Object.entries(source)) {
		if (!(key in runtime)) {
			next[key] = cloneUnknown(sourceValue);
			continue;
		}
		next[key] = projectSourceOntoRuntimeShape(sourceValue, runtime[key]);
	}
	return next;
}
function hasOwnValidIncludeDirective(value) {
	if (!isRecord(value) || !Object.hasOwn(value, "$include")) return false;
	const includeValue = value.$include;
	return typeof includeValue === "string" || Array.isArray(includeValue) && includeValue.every((entry) => typeof entry === "string");
}
function collectIncludeOwnedPaths(value, path = []) {
	if (Array.isArray(value)) return value.flatMap((child, index) => collectIncludeOwnedPaths(child, [...path, String(index)]));
	if (!isRecord(value)) return [];
	if (hasOwnValidIncludeDirective(value)) return [path];
	return Object.entries(value).flatMap(([key, child]) => collectIncludeOwnedPaths(child, [...path, key]));
}
function collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath) {
	const includeValue = getPathValue(rootAuthoredConfig, includePath);
	if (!hasOwnValidIncludeDirective(includeValue)) return [];
	return Object.keys(includeValue).flatMap((key) => key === "$include" || isBlockedObjectKey(key) ? [] : [[...includePath, key]]);
}
function isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path) {
	return collectMutableSiblingPathsAtInclude(rootAuthoredConfig, includePath).some((siblingPath) => {
		if (!pathStartsWith(path, siblingPath)) return false;
		return !collectIncludeOwnedPaths(getPathValue(rootAuthoredConfig, siblingPath), siblingPath).some((nestedIncludePath) => pathStartsWith(path, nestedIncludePath) || pathStartsWith(nestedIncludePath, path));
	});
}
function formatConfigPath(path) {
	return path.length > 0 ? path.join(".") : "<root>";
}
function findContainingArrayPath(root, path) {
	let current = root;
	const currentPath = [];
	for (const segment of path) {
		if (Array.isArray(current)) return currentPath;
		if (!isRecord(current)) return;
		current = current[segment];
		currentPath.push(segment);
	}
}
function hasChangedEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	return value.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, value[index]) && !isDeepStrictEqual(nextValue[itemIndex], item));
}
function hasNewEquivalentArraySibling(value, nextValue, index) {
	if (!Array.isArray(value) || !Array.isArray(nextValue) || index >= value.length) return false;
	const includedValue = value[index];
	if (!isDeepStrictEqual(nextValue[index], includedValue)) return false;
	return nextValue.some((item, itemIndex) => itemIndex !== index && isDeepStrictEqual(item, includedValue) && !isDeepStrictEqual(value[itemIndex], includedValue));
}
function getPathValue(value, path) {
	let current = value;
	for (const segment of path) {
		if (Array.isArray(current)) {
			const index = parseArrayIndexPathSegment(segment);
			if (index === void 0 || index >= current.length) return;
			current = current[index];
			continue;
		}
		if (!isRecord(current)) return;
		current = current[segment];
	}
	return current;
}
function setPathValue(value, path, nextValue) {
	if (path.length === 0) return cloneUnknown(nextValue);
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length) return value;
		const next = [...value];
		next[index] = setPathValue(value[index], tail, nextValue);
		return next;
	}
	if (!isRecord(value)) return value;
	return {
		...value,
		[head]: setPathValue(value[head], tail, nextValue)
	};
}
function pathStartsWith(path, prefix) {
	return prefix.length <= path.length && prefix.every((segment, index) => path[index] === segment);
}
function pathOverlapsAny(path, candidates) {
	return Boolean(candidates?.some((candidate) => pathStartsWith(path, candidate) || pathStartsWith(candidate, path)));
}
function isIncludeOwnedPath(rootAuthoredConfig, path) {
	return collectIncludeOwnedPaths(rootAuthoredConfig).some((includePath) => {
		if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
		return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
	});
}
function findOverlappingIncludeOwnedPath(rootAuthoredConfig, path) {
	return collectIncludeOwnedPaths(rootAuthoredConfig).find((includePath) => {
		if (!(pathStartsWith(path, includePath) || pathStartsWith(includePath, path))) return false;
		return !isMutableSiblingPathAtInclude(rootAuthoredConfig, includePath, path);
	});
}
function setPathValueCreatingParents(value, path, nextValue) {
	if (path.length === 0) return cloneUnknown(nextValue);
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value) || isNumericPathSegment(head)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0) return value;
		const next = Array.isArray(value) ? [...value] : [];
		next[index] = setPathValueCreatingParents(next[index], tail, nextValue);
		return next;
	}
	const record = isRecord(value) ? value : {};
	return {
		...record,
		[head]: setPathValueCreatingParents(record[head], tail, nextValue)
	};
}
function deletePathValue(value, path) {
	if (path.length === 0) return value;
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length || tail.length === 0) return value;
		const next = [...value];
		next[index] = deletePathValue(value[index], tail);
		return next;
	}
	if (!isRecord(value) || !Object.hasOwn(value, head)) return value;
	const next = { ...value };
	if (tail.length === 0) {
		delete next[head];
		return next;
	}
	next[head] = deletePathValue(value[head], tail);
	return next;
}
function normalizeTouchedAgentModelMapEntries(params) {
	const touchedMaps = /* @__PURE__ */ new Map();
	const addKey = (path, modelId) => {
		const serialized = path.join("\0");
		const target = touchedMaps.get(serialized) ?? {
			path,
			canonicalKeys: /* @__PURE__ */ new Set()
		};
		target.canonicalKeys.add(normalizeAgentModelRefForConfig(modelId));
		touchedMaps.set(serialized, target);
	};
	const defaultsModelsPatch = getPathValue(params.patch, [
		"agents",
		"defaults",
		"models"
	]);
	if (isRecord(defaultsModelsPatch)) for (const modelId of Object.keys(defaultsModelsPatch)) addKey([
		"agents",
		"defaults",
		"models"
	], modelId);
	const entriesPatch = getPathValue(params.patch, ["agents", "entries"]);
	if (isRecord(entriesPatch)) {
		for (const [agentId, entryPatch] of Object.entries(entriesPatch)) if (isRecord(entryPatch) && isRecord(entryPatch.models)) for (const modelId of Object.keys(entryPatch.models)) addKey([
			"agents",
			"entries",
			agentId,
			"models"
		], modelId);
	}
	const explicitModelMaps = [[
		"agents",
		"defaults",
		"models"
	]];
	const explicitEntries = getPathValue(params.explicitSetValueSource, ["agents", "entries"]);
	if (isRecord(explicitEntries)) for (const agentId of Object.keys(explicitEntries)) explicitModelMaps.push([
		"agents",
		"entries",
		agentId,
		"models"
	]);
	for (const modelMapPath of explicitModelMaps) for (const explicitPath of params.explicitSetPaths ?? []) {
		if (pathStartsWith(explicitPath, modelMapPath) && explicitPath.length > modelMapPath.length) {
			const modelId = explicitPath[modelMapPath.length];
			if (modelId) addKey(modelMapPath, modelId);
			continue;
		}
		if (!pathStartsWith(explicitPath, modelMapPath) && !pathStartsWith(modelMapPath, explicitPath)) continue;
		const explicitModels = getPathValue(params.explicitSetValueSource, modelMapPath);
		if (!isRecord(explicitModels)) continue;
		for (const modelId of Object.keys(explicitModels)) addKey(modelMapPath, modelId);
	}
	let next = params.projectedSource;
	for (const { path, canonicalKeys } of touchedMaps.values()) {
		const models = getPathValue(next, path);
		if (!isRecord(models)) continue;
		const touchedEntries = [];
		const untouchedEntries = [];
		let hasRetiredTouchedKey = false;
		for (const [modelId, entry] of Object.entries(models)) {
			const normalizedModelId = normalizeAgentModelRefForConfig(modelId);
			if (!canonicalKeys.has(normalizedModelId)) {
				untouchedEntries.push([modelId, entry]);
				continue;
			}
			touchedEntries.push([modelId, entry]);
			hasRetiredTouchedKey ||= normalizedModelId !== modelId;
		}
		if (hasRetiredTouchedKey) {
			const normalizedTouchedEntries = normalizeAgentModelMapForConfig(Object.fromEntries(touchedEntries));
			next = setPathValue(next, path, Object.fromEntries([...untouchedEntries, ...Object.entries(normalizedTouchedEntries)]));
		}
	}
	return next;
}
function preserveSourceValueAtPath(params) {
	if (pathOverlapsAny(params.path, params.unsetPaths)) return params.persistedCandidate;
	if (isIncludeOwnedPath(params.rootAuthoredConfig, params.path)) return params.persistedCandidate;
	if (getPathValue(params.nextConfig, params.path) !== void 0) return params.persistedCandidate;
	const sourceValue = params.sourceValue ?? getPathValue(params.sourceConfig, params.path);
	if (sourceValue === void 0 || getPathValue(params.persistedCandidate, params.path) !== void 0) return params.persistedCandidate;
	return setPathValueCreatingParents(params.persistedCandidate, params.path, sourceValue);
}
function preserveAuthoredAgentParams(params) {
	const defaults = getPathValue(params.sourceConfig, ["agents", "defaults"]);
	if (!isRecord(defaults)) return params.persistedCandidate;
	let next = params.persistedCandidate;
	if (Object.hasOwn(defaults, "params")) next = preserveSourceValueAtPath({
		...params,
		persistedCandidate: next,
		path: [
			"agents",
			"defaults",
			"params"
		],
		sourceValue: defaults.params
	});
	const models = defaults.models;
	if (!isRecord(models)) return next;
	const nextModels = getPathValue(params.nextConfig, [
		"agents",
		"defaults",
		"models"
	]);
	for (const [modelId, modelEntry] of Object.entries(models)) {
		if (!isRecord(modelEntry) || !Object.hasOwn(modelEntry, "params")) continue;
		const modelPath = [
			"agents",
			"defaults",
			"models",
			normalizeAgentModelRefForConfig(modelId) || modelId
		];
		const normalizedModelId = modelPath.at(-1);
		if (isRecord(nextModels) && normalizedModelId && !Object.hasOwn(nextModels, normalizedModelId)) continue;
		const paramsPath = [...modelPath, "params"];
		if (modelPath.at(-1) !== modelId) next = deletePathValue(next, [
			"agents",
			"defaults",
			"models",
			modelId
		]);
		if (getPathValue(next, modelPath) === void 0) {
			next = preserveSourceValueAtPath({
				...params,
				persistedCandidate: next,
				path: modelPath,
				sourceValue: modelEntry
			});
			continue;
		}
		next = preserveSourceValueAtPath({
			...params,
			persistedCandidate: next,
			path: paramsPath,
			sourceValue: modelEntry.params
		});
	}
	return next;
}
function projectRootAuthoredIncludeSibling(params) {
	if (params.nextPresent && params.baselinePresent && isDeepStrictEqual(params.next, params.baseline)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.authored)
	};
	if (!params.nextPresent) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: false
	};
	if (!params.baselinePresent) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (hasOwnValidIncludeDirective(params.authored)) return { ok: false };
	if (Array.isArray(params.authored)) return Array.isArray(params.next) ? { ok: false } : {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.authored)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.next)) return collectIncludeOwnedPaths(params.authored).length > 0 ? { ok: false } : {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	if (!isRecord(params.baseline)) return {
		ok: true,
		present: true,
		value: cloneUnknown(params.next)
	};
	const value = cloneUnknown(params.authored);
	const keys = /* @__PURE__ */ new Set([
		...Object.keys(params.authored),
		...Object.keys(params.baseline),
		...Object.keys(params.next)
	]);
	for (const key of keys) {
		if (isBlockedObjectKey(key)) continue;
		const authoredPresent = Object.hasOwn(params.authored, key);
		const baselinePresent = Object.hasOwn(params.baseline, key);
		const nextPresent = Object.hasOwn(params.next, key);
		if (!authoredPresent) {
			if (baselinePresent && nextPresent && isDeepStrictEqual(params.baseline[key], params.next[key])) continue;
			if (!nextPresent) return { ok: false };
			if (baselinePresent && Array.isArray(params.baseline[key]) && Array.isArray(params.next[key])) return { ok: false };
		}
		const projected = projectRootAuthoredIncludeSibling({
			authored: authoredPresent ? params.authored[key] : {},
			baseline: params.baseline[key],
			next: params.next[key],
			baselinePresent,
			nextPresent
		});
		if (!projected.ok) return projected;
		if (projected.present) value[key] = projected.value;
		else delete value[key];
	}
	return {
		ok: true,
		present: true,
		value
	};
}
function preserveUntouchedIncludes(params) {
	let next = params.persistedCandidate;
	for (const includePath of collectIncludeOwnedPaths(params.rootAuthoredConfig)) {
		const containingArrayPath = findContainingArrayPath(params.rootAuthoredConfig, includePath);
		const includeIsArrayEntry = containingArrayPath !== void 0 && includePath.length === containingArrayPath.length + 1;
		const comparisonPath = includeIsArrayEntry ? includePath : containingArrayPath ?? includePath;
		const mutableSiblingPaths = collectMutableSiblingPathsAtInclude(params.rootAuthoredConfig, includePath);
		const relativeMutableSiblingPaths = mutableSiblingPaths.map((path) => path.slice(comparisonPath.length));
		const omitMutableSiblingValues = (value) => relativeMutableSiblingPaths.reduce((current, path) => deletePathValue(current, path), value);
		const nextValue = omitMutableSiblingValues(getPathValue(params.nextConfig, comparisonPath));
		const sourceValue = omitMutableSiblingValues(getPathValue(params.sourceConfig, comparisonPath));
		const runtimeValue = omitMutableSiblingValues(getPathValue(params.runtimeConfig, comparisonPath));
		if (!isDeepStrictEqual(nextValue, sourceValue) && !isDeepStrictEqual(nextValue, runtimeValue)) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
		if (includeIsArrayEntry) {
			const index = parseArrayIndexPathSegment(includePath.at(-1) ?? "");
			const nextArray = getPathValue(params.nextConfig, containingArrayPath);
			const sourceArray = getPathValue(params.sourceConfig, containingArrayPath);
			const runtimeArray = getPathValue(params.runtimeConfig, containingArrayPath);
			if (index !== void 0 && (hasChangedEquivalentArraySibling(sourceArray, nextArray, index) || hasChangedEquivalentArraySibling(runtimeArray, nextArray, index) || hasNewEquivalentArraySibling(sourceArray, nextArray, index) || hasNewEquivalentArraySibling(runtimeArray, nextArray, index))) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
		}
		let authoredIncludeValue = getPathValue(params.rootAuthoredConfig, includePath);
		for (const siblingPath of mutableSiblingPaths) {
			const relativeSiblingPath = siblingPath.slice(includePath.length);
			const nextPresent = hasPathValue(params.nextConfig, siblingPath);
			const projectAgainst = (baselineConfig) => projectRootAuthoredIncludeSibling({
				authored: getPathValue(params.rootAuthoredConfig, siblingPath),
				baseline: getPathValue(baselineConfig, siblingPath),
				next: getPathValue(params.nextConfig, siblingPath),
				baselinePresent: hasPathValue(baselineConfig, siblingPath),
				nextPresent
			});
			const sourceProjection = projectAgainst(params.sourceConfig);
			const projection = sourceProjection.ok ? sourceProjection : projectAgainst(params.runtimeConfig);
			if (!projection.ok) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includePath)}; edit that include file directly or remove the $include first.`);
			authoredIncludeValue = projection.present ? setPathValue(authoredIncludeValue, relativeSiblingPath, projection.value) : deletePathValue(authoredIncludeValue, relativeSiblingPath);
		}
		next = setPathValue(next, includePath, authoredIncludeValue);
	}
	return next;
}
function preserveIncludeOwnedConfigForWrite(params) {
	return preserveUntouchedIncludes({
		...params,
		persistedCandidate: params.nextConfig
	});
}
function hasPathValue(value, path) {
	if (path.length === 0) return true;
	const head = expectDefined(path[0], "config path head");
	const tail = path.slice(1);
	if (Array.isArray(value)) {
		const index = parseArrayIndexPathSegment(head);
		if (index === void 0 || index >= value.length) return false;
		return tail.length === 0 || hasPathValue(value[index], tail);
	}
	if (!isRecord(value)) return false;
	if (isBlockedObjectKey(head) || !Object.hasOwn(value, head)) return false;
	return tail.length === 0 || hasPathValue(value[head], tail);
}
function mergeMissingExplicitValues(currentValue, explicitValue) {
	if (!isRecord(currentValue) || !isRecord(explicitValue)) {
		if (!Array.isArray(currentValue) || !Array.isArray(explicitValue)) return {
			changed: false,
			value: currentValue
		};
		let changed = false;
		const next = [...currentValue];
		for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
			const index = parseArrayIndexPathSegment(key);
			if (index === void 0) continue;
			if (index >= next.length || next[index] === void 0) {
				next[index] = cloneUnknown(childExplicitValue);
				changed = true;
				continue;
			}
			const childMerged = mergeMissingExplicitValues(next[index], childExplicitValue);
			if (childMerged.changed) {
				next[index] = childMerged.value;
				changed = true;
			}
		}
		return {
			changed,
			value: changed ? next : currentValue
		};
	}
	let changed = false;
	const next = { ...currentValue };
	for (const [key, childExplicitValue] of Object.entries(explicitValue)) {
		if (isBlockedObjectKey(key)) continue;
		if (!Object.hasOwn(next, key)) {
			next[key] = cloneUnknown(childExplicitValue);
			changed = true;
			continue;
		}
		const childMerged = mergeMissingExplicitValues(next[key], childExplicitValue);
		if (childMerged.changed) {
			next[key] = childMerged.value;
			changed = true;
		}
	}
	return {
		changed,
		value: changed ? next : currentValue
	};
}
function injectExplicitlySetPaths(params) {
	if (!params.explicitSetPaths || params.explicitSetPaths.length === 0) return params.persistedCandidate;
	let next = params.persistedCandidate;
	for (const path of params.explicitSetPaths) {
		if (path.length === 0 || path.some(isBlockedObjectKey)) continue;
		const includeOwnedPath = params.rootAuthoredConfig ? findOverlappingIncludeOwnedPath(params.rootAuthoredConfig, [...path]) : void 0;
		const preserveDescendantInclude = includeOwnedPath && params.preserveDescendantIncludes === true && includeOwnedPath.length > path.length && pathStartsWith(includeOwnedPath, path);
		const allowIncludeAncestorOverride = includeOwnedPath !== void 0 && includeOwnedPath.length < path.length && pathStartsWith(path, includeOwnedPath) && params.allowIncludeAncestorExplicitSetPaths === true;
		if (includeOwnedPath && !preserveDescendantInclude && !allowIncludeAncestorOverride) throw new Error(`Config write would flatten $include-owned config at ${formatConfigPath(includeOwnedPath)}; edit that include file directly or remove the $include first.`);
		const nextValue = getPathValue(params.valueSource, [...path]);
		if (nextValue === void 0) continue;
		if (!hasPathValue(next, path)) {
			next = setPathValueCreatingParents(next, [...path], nextValue);
			continue;
		}
		const merged = mergeMissingExplicitValues(getPathValue(next, [...path]), nextValue);
		if (merged.changed) next = setPathValue(next, [...path], merged.value);
	}
	return next;
}
function pathTouchesAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath) || pathStartsWith(rosterPath, path));
}
function pathTargetsAgentRoster(path) {
	return AGENT_ROSTER_PATHS.some((rosterPath) => pathStartsWith(path, rosterPath));
}
function canCanonicalizeAgentRoster(value) {
	const roster = readAgentRosterProperty(value);
	if (!roster) return false;
	if (roster.kind === "list") {
		if (!Array.isArray(roster.value) || !roster.value.every((entry) => isRecord(entry) && typeof entry.id === "string")) return false;
		assertUniqueNormalizedLegacyRosterIds(roster.value);
		return true;
	}
	return isRecord(roster.value) && Object.values(roster.value).every(isRecord);
}
function shouldPersistCanonicalAgentRoster(params) {
	if (!canCanonicalizeAgentRoster(params.nextConfig)) return false;
	if (params.explicitSetPaths?.some(pathTouchesAgentRoster) || params.unsetPaths?.some(pathTouchesAgentRoster)) return true;
	const runtimeRoster = toAgentEntriesRecord(listAgentEntries(params.runtimeConfig));
	const sourceRoster = toAgentEntriesRecord(listAgentEntries(params.sourceConfig));
	const nextRoster = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	return !isDeepStrictEqual(runtimeRoster, nextRoster) && !isDeepStrictEqual(sourceRoster, nextRoster);
}
function assertCanonicalAgentRosterRetainsEntries(params) {
	const allowedRemovals = new Set((params.allowedRemovals ?? []).map((agentId) => normalizeAgentId(agentId)));
	const canonicalIds = new Set(listAgentEntries(params.canonicalConfig).map((entry) => normalizeAgentId(entry.id)));
	const droppedIds = listAgentEntries(params.currentConfig).filter((entry) => {
		const agentId = normalizeAgentId(entry.id);
		return !canonicalIds.has(agentId) && !allowedRemovals.has(agentId);
	}).map((entry) => entry.id).toSorted();
	if (droppedIds.length === 0) return;
	throw new Error(`Config write would drop agent roster entries without an explicit deletion: ${droppedIds.join(", ")}.`);
}
function containsAuthoredRosterReference(value, includeEnvStrings) {
	if (typeof value === "string") return includeEnvStrings && containsEnvVarReference(value);
	if (Array.isArray(value)) return value.some((entry) => containsAuthoredRosterReference(entry, includeEnvStrings));
	if (!isRecord(value)) return false;
	return isSecretRefShape(value) || Object.values(value).some((entry) => containsAuthoredRosterReference(entry, includeEnvStrings));
}
function indexAgentRosterSourcePaths(config) {
	return new Map(listAgentEntriesWithSource(config).map(({ entry, source }) => [normalizeAgentId(entry.id), source.kind === "list" ? `agents.list[${source.index}]` : `agents.entries.${source.key}`]));
}
function projectAuthoredRosterValue(params) {
	if (!params.nextPresent) return { present: false };
	const explicitlySet = params.explicitPaths.some((path) => pathStartsWith(params.path, path));
	if (isRecord(params.next)) {
		const authored = isRecord(params.authored) ? params.authored : {};
		const explicit = isRecord(params.explicit) ? params.explicit : {};
		const runtime = isRecord(params.runtime) ? params.runtime : {};
		const source = isRecord(params.source) ? params.source : {};
		const value = {};
		for (const [key, nextValue] of Object.entries(params.next)) {
			if (isBlockedObjectKey(key)) continue;
			const projected = projectAuthoredRosterValue({
				authored: authored[key],
				authoredPresent: Object.hasOwn(authored, key),
				explicit: explicit[key],
				explicitPresent: Object.hasOwn(explicit, key),
				explicitPaths: params.explicitPaths,
				path: [...params.path, key],
				runtime: runtime[key],
				runtimePresent: Object.hasOwn(runtime, key),
				source: source[key],
				sourcePresent: Object.hasOwn(source, key),
				next: nextValue,
				nextPresent: true
			});
			if (projected.present) value[key] = projected.value;
		}
		return {
			present: true,
			value
		};
	}
	if (Array.isArray(params.next)) {
		if (explicitlySet && params.explicitPresent && Array.isArray(params.explicit)) return {
			present: true,
			value: cloneUnknown(params.explicit)
		};
		const authored = Array.isArray(params.authored) ? params.authored : [];
		const explicit = Array.isArray(params.explicit) ? params.explicit : [];
		const runtime = Array.isArray(params.runtime) ? params.runtime : [];
		const source = Array.isArray(params.source) ? params.source : [];
		const usedRuntimeIndexes = /* @__PURE__ */ new Set();
		const usedSourceIndexes = /* @__PURE__ */ new Set();
		const findMatchingIndex = (values, used, nextValue, preferredIndex) => {
			if (preferredIndex < values.length && !used.has(preferredIndex) && isDeepStrictEqual(values[preferredIndex], nextValue)) return preferredIndex;
			const index = values.findIndex((value, candidate) => !used.has(candidate) && isDeepStrictEqual(value, nextValue));
			return index >= 0 ? index : void 0;
		};
		return {
			present: true,
			value: params.next.map((nextValue, index) => {
				const runtimeIndex = findMatchingIndex(runtime, usedRuntimeIndexes, nextValue, index);
				if (runtimeIndex !== void 0) usedRuntimeIndexes.add(runtimeIndex);
				const sourceIndex = findMatchingIndex(source, usedSourceIndexes, nextValue, index);
				if (sourceIndex !== void 0) usedSourceIndexes.add(sourceIndex);
				const fallbackIndexAvailable = !usedRuntimeIndexes.has(index) && !usedSourceIndexes.has(index);
				const authoredIndex = runtimeIndex ?? sourceIndex ?? (fallbackIndexAvailable ? index : void 0);
				const projected = projectAuthoredRosterValue({
					authored: authoredIndex === void 0 ? void 0 : authored[authoredIndex],
					authoredPresent: authoredIndex !== void 0 && authoredIndex < authored.length,
					explicit: explicit[index],
					explicitPresent: index < explicit.length,
					explicitPaths: params.explicitPaths,
					path: [...params.path, String(index)],
					runtime: runtimeIndex === void 0 ? fallbackIndexAvailable ? runtime[index] : void 0 : runtime[runtimeIndex],
					runtimePresent: runtimeIndex !== void 0 || fallbackIndexAvailable && index < runtime.length,
					source: sourceIndex === void 0 ? fallbackIndexAvailable ? source[index] : void 0 : source[sourceIndex],
					sourcePresent: sourceIndex !== void 0 || fallbackIndexAvailable && index < source.length,
					next: nextValue,
					nextPresent: true
				});
				return projected.present ? projected.value : nextValue;
			})
		};
	}
	if (explicitlySet && params.explicitPresent) return {
		present: true,
		value: cloneUnknown(params.explicit)
	};
	const unchangedFromRuntime = params.runtimePresent && isDeepStrictEqual(params.runtime, params.next);
	const unchangedFromSource = params.sourcePresent && isDeepStrictEqual(params.source, params.next);
	return {
		present: true,
		value: params.authoredPresent && (unchangedFromRuntime || unchangedFromSource) ? cloneUnknown(params.authored) : cloneUnknown(params.next)
	};
}
function canonicalizeAgentRosterForExplicitWrite(params) {
	const authoredRoster = readAgentRosterProperty(params.rootAuthoredConfig);
	const preMigrationRoster = readAgentRosterProperty(params.sourceConfigBeforeMigrations);
	const resolvedLegacyList = preMigrationRoster?.kind === "list" && Array.isArray(preMigrationRoster.value) ? preMigrationRoster.value : void 0;
	const authoredEntries = authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) ? Object.fromEntries(authoredRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") return [];
		const { id: _authoredId, ...config } = entry;
		return [[id, config]];
	})) : toAgentEntriesRecord(listAgentEntries(params.rootAuthoredConfig));
	const runtimeEntries = toAgentEntriesRecord(listAgentEntries(params.runtimeConfig));
	const sourceEntries = toAgentEntriesRecord(listAgentEntries(params.sourceConfig));
	const nextEntries = toAgentEntriesRecord(listAgentEntries(params.nextConfig));
	const explicitRoster = readAgentRosterProperty(params.valueSource);
	const rosterFactOwner = coerceConfig(params.sourceConfigBeforeMigrations ?? params.rootAuthoredConfig);
	const sourcePathsByAgentId = indexAgentRosterSourcePaths(rosterFactOwner);
	const resolutionEvaluated = getConfigResolutionFacts(rosterFactOwner) !== null;
	const renamedLegacyIndexes = new Set((params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents" || path[1] !== "list" || path.length !== 4 || path[3] !== "id") return [];
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		return index === void 0 ? [] : [index];
	}));
	const structurallyExplicitLegacyIndexes = new Set(renamedLegacyIndexes);
	for (const path of params.explicitSetPaths ?? []) {
		if (path[0] !== "agents" || path[1] !== "list") continue;
		if (path.length === 2 && explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) {
			explicitRoster.value.forEach((_entry, index) => structurallyExplicitLegacyIndexes.add(index));
			continue;
		}
		if (path.length === 3) {
			const index = parseArrayIndexPathSegment(path[2] ?? "");
			if (index !== void 0) structurallyExplicitLegacyIndexes.add(index);
		}
	}
	for (const index of renamedLegacyIndexes) {
		const entry = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) ? explicitRoster.value[index] : void 0;
		if (isRecord(entry) && typeof entry.id === "string" && (hasUnresolvedConfigPath(rosterFactOwner, `agents.list[${index}].id`) || !resolutionEvaluated && containsEnvVarReference(entry.id))) throw new Error("Config write cannot safely resolve an env-backed renamed agent id; set the resolved literal id or rename the authored entry directly.");
	}
	const resolveExplicitLegacyEntryId = (entry, index) => {
		const explicitId = entry.id;
		if (typeof explicitId !== "string") return;
		if (renamedLegacyIndexes.has(index) || Object.hasOwn(nextEntries, explicitId)) return explicitId;
		if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value)) {
			const authoredIndex = authoredRoster.value.findIndex((authoredEntry) => isRecord(authoredEntry) && authoredEntry.id === explicitId);
			const resolvedEntry = authoredIndex < 0 ? void 0 : resolvedLegacyList?.[authoredIndex];
			if (isRecord(resolvedEntry) && typeof resolvedEntry.id === "string") return resolvedEntry.id;
		}
		return hasUnresolvedConfigPath(rosterFactOwner, `agents.list[${index}].id`) || containsEnvVarReference(explicitId) ? void 0 : explicitId;
	};
	if (explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) {
		const normalizedIds = /* @__PURE__ */ new Set();
		for (const [index, entry] of explicitRoster.value.entries()) {
			if (!isRecord(entry)) continue;
			const resolvedId = resolveExplicitLegacyEntryId(entry, index);
			if (resolvedId === void 0) continue;
			const agentId = normalizeAgentId(resolvedId);
			if (normalizedIds.has(agentId)) throw new DuplicateAgentRosterIdError(agentId);
			normalizedIds.add(agentId);
		}
	}
	const explicitEntries = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) ? Object.fromEntries(explicitRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = structurallyExplicitLegacyIndexes.has(index) ? resolveExplicitLegacyEntryId(entry, index) : typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") {
			if (structurallyExplicitLegacyIndexes.has(index) && typeof entry.id === "string") throw new Error(`Config write cannot safely resolve an explicitly replaced agent list slot for id "${entry.id}"; use a resolved literal id before writing the roster.`);
			return [];
		}
		const { id: _explicitId, ...config } = entry;
		return [[id, config]];
	})) : toAgentEntriesRecord(listAgentEntries(params.valueSource));
	const explicitPaths = (params.explicitSetPaths ?? []).flatMap((path) => {
		if (path[0] !== "agents") return [];
		if (path.length === 1) return [[]];
		if (path[1] === "entries") return [path.slice(2)];
		if (path[1] !== "list") return [];
		if (path.length === 2) return [[]];
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		const authoredEntry = authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) && index !== void 0 ? authoredRoster.value[index] : void 0;
		const explicitEntry = explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value) && index !== void 0 ? explicitRoster.value[index] : void 0;
		const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
		const id = index !== void 0 && (renamedLegacyIndexes.has(index) || path.length === 3 && structurallyExplicitLegacyIndexes.has(index)) && isRecord(explicitEntry) ? explicitEntry.id : isRecord(resolvedEntry) && typeof resolvedEntry.id === "string" ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
		return typeof id === "string" ? [[id, ...path.slice(3)]] : [];
	});
	const entryIdentityByNextId = /* @__PURE__ */ new Map();
	for (const id of Object.keys(nextEntries)) if (Object.hasOwn(runtimeEntries, id) || Object.hasOwn(sourceEntries, id)) entryIdentityByNextId.set(id, id);
	if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value) && explicitRoster?.kind === "list" && Array.isArray(explicitRoster.value)) for (const path of params.explicitSetPaths ?? []) {
		if (path[0] !== "agents" || path[1] !== "list" || path.length !== 4 || path[3] !== "id") continue;
		const index = parseArrayIndexPathSegment(path[2] ?? "");
		const authoredEntry = index === void 0 ? void 0 : authoredRoster.value[index];
		const explicitEntry = index === void 0 ? void 0 : explicitRoster.value[index];
		const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
		const oldId = isRecord(resolvedEntry) ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
		const nextId = isRecord(explicitEntry) ? explicitEntry.id : void 0;
		if (typeof oldId === "string" && typeof nextId === "string") entryIdentityByNextId.set(nextId, oldId);
	}
	const priorIds = /* @__PURE__ */ new Set([...Object.keys(runtimeEntries), ...Object.keys(sourceEntries)]);
	const removedIds = [...priorIds].filter((id) => !Object.hasOwn(nextEntries, id));
	const addedIds = Object.keys(nextEntries).filter((id) => !priorIds.has(id));
	const claimedPriorIds = new Set(entryIdentityByNextId.values());
	for (const nextId of addedIds) {
		if (entryIdentityByNextId.has(nextId)) continue;
		const candidates = removedIds.filter((oldId) => !claimedPriorIds.has(oldId) && (isDeepStrictEqual(nextEntries[nextId], runtimeEntries[oldId]) || isDeepStrictEqual(nextEntries[nextId], sourceEntries[oldId])));
		if (candidates.length === 1) {
			const oldId = candidates[0];
			entryIdentityByNextId.set(nextId, oldId);
			claimedPriorIds.add(oldId);
		}
	}
	const ambiguousAddedIds = addedIds.filter((id) => !entryIdentityByNextId.has(id));
	const ambiguousRemovedIds = removedIds.filter((id) => !claimedPriorIds.has(id));
	if (ambiguousAddedIds.length > 0 && ambiguousRemovedIds.some((id) => {
		const sourcePath = sourcePathsByAgentId.get(normalizeAgentId(id));
		return containsAuthoredRosterReference(authoredEntries[id], !resolutionEvaluated) || Boolean(sourcePath && hasUnresolvedConfigPathInSubtree(rosterFactOwner, sourcePath));
	})) throw new Error("Config write cannot safely match renamed agent entries with authored references; rename agents one at a time.");
	let entries = Object.fromEntries(Object.entries(nextEntries).map(([id, nextEntry]) => {
		const priorId = entryIdentityByNextId.get(id) ?? id;
		const projected = projectAuthoredRosterValue({
			authored: authoredEntries[priorId],
			authoredPresent: Object.hasOwn(authoredEntries, priorId),
			explicit: explicitEntries[id],
			explicitPresent: Object.hasOwn(explicitEntries, id),
			explicitPaths,
			path: [id],
			runtime: runtimeEntries[priorId],
			runtimePresent: Object.hasOwn(runtimeEntries, priorId),
			source: sourceEntries[priorId],
			sourcePresent: Object.hasOwn(sourceEntries, priorId),
			next: nextEntry,
			nextPresent: true
		});
		const value = projected.present ? projected.value : nextEntry;
		if (isRecord(value) && isRecord(nextEntry)) if (Object.hasOwn(nextEntry, "default")) {
			const sourcePath = sourcePathsByAgentId.get(normalizeAgentId(priorId));
			if (!(Object.hasOwn(value, "default") && (containsAuthoredRosterReference(value.default, !resolutionEvaluated) || Boolean(sourcePath && hasUnresolvedConfigPathInSubtree(rosterFactOwner, `${sourcePath}.default`))) && (Object.hasOwn(runtimeEntries, priorId) && isRecord(runtimeEntries[priorId]) && isDeepStrictEqual(runtimeEntries[priorId].default, nextEntry.default) || Object.hasOwn(sourceEntries, priorId) && isRecord(sourceEntries[priorId]) && isDeepStrictEqual(sourceEntries[priorId].default, nextEntry.default)))) value.default = cloneUnknown(nextEntry.default);
		} else delete value.default;
		return [id, value];
	}));
	if (authoredRoster?.kind === "list" && Array.isArray(authoredRoster.value)) {
		const authoredList = authoredRoster.value;
		const nextIdByPriorId = new Map([...entryIdentityByNextId].map(([nextId, priorId]) => [priorId, nextId]));
		const resolveExplicitLegacyIdCandidate = (index) => {
			if (explicitRoster?.kind !== "list" || !Array.isArray(explicitRoster.value)) return;
			const explicitEntry = explicitRoster.value[index];
			if (!isRecord(explicitEntry)) return;
			const id = resolveExplicitLegacyEntryId(explicitEntry, index);
			return id === void 0 ? void 0 : normalizeAgentId(id);
		};
		const resolveExplicitLegacyId = (index) => {
			const resolvedId = resolveExplicitLegacyIdCandidate(index);
			if (!resolvedId || explicitRoster?.kind !== "list" || !Array.isArray(explicitRoster.value)) throw new Error("Config write cannot safely resolve an explicitly replaced agent list slot for unset.");
			for (const [candidateIndex] of explicitRoster.value.entries()) {
				if (candidateIndex === index) continue;
				const candidateId = resolveExplicitLegacyIdCandidate(candidateIndex);
				if (!candidateId) throw new Error("Config write cannot safely resolve every explicit agent id across an indexed list unset.");
				if (candidateId === resolvedId) throw new Error("Config write cannot safely resolve duplicate agent ids across an indexed list unset.");
			}
			return resolvedId;
		};
		for (const unsetPath of params.unsetPaths ?? []) {
			if (unsetPath[0] !== "agents" || unsetPath[1] !== "list") continue;
			if (unsetPath.length === 2) {
				entries = void 0;
				break;
			}
			if (unsetPath.length === 4 && unsetPath[3] === "id") throw new Error("Config write cannot unset an agent id; delete the complete roster entry instead.");
			const index = parseArrayIndexPathSegment(unsetPath[2] ?? "");
			const authoredEntry = index === void 0 ? void 0 : authoredList[index];
			const resolvedEntry = index === void 0 ? void 0 : resolvedLegacyList?.[index];
			const explicitResolvedId = index !== void 0 && structurallyExplicitLegacyIndexes.has(index) && index !== void 0 ? resolveExplicitLegacyId(index) : void 0;
			const id = explicitResolvedId !== void 0 ? explicitResolvedId : isRecord(resolvedEntry) ? resolvedEntry.id : isRecord(authoredEntry) ? authoredEntry.id : void 0;
			if (typeof id !== "string") continue;
			const targetId = explicitResolvedId !== void 0 ? id : nextIdByPriorId.get(id) ?? id;
			entries = deletePathValue(entries, [targetId, ...unsetPath.slice(3)]);
		}
	}
	const withoutLegacyList = deletePathValue(params.valueSource, ["agents", "list"]);
	return entries === void 0 ? deletePathValue(withoutLegacyList, ["agents", "entries"]) : setPathValueCreatingParents(withoutLegacyList, ["agents", "entries"], entries);
}
function restoreAuthoredAgentRoster(value, rootAuthoredConfig) {
	let next = deletePathValue(value, ["agents", "entries"]);
	next = deletePathValue(next, ["agents", "list"]);
	const authoredRoster = readAgentRosterProperty(rootAuthoredConfig);
	return authoredRoster ? setPathValueCreatingParents(next, ["agents", authoredRoster.kind], cloneUnknown(authoredRoster.value)) : next;
}
function projectAuthoredAgentRosterForCanonicalIncludes(params) {
	const authoredRoster = readAgentRosterProperty(params.rootAuthoredConfig);
	if (authoredRoster?.kind !== "list" || !Array.isArray(authoredRoster.value)) return params.rootAuthoredConfig;
	const preMigrationRoster = readAgentRosterProperty(params.sourceConfigBeforeMigrations);
	const resolvedLegacyList = preMigrationRoster?.kind === "list" && Array.isArray(preMigrationRoster.value) ? preMigrationRoster.value : void 0;
	const entries = Object.fromEntries(authoredRoster.value.flatMap((entry, index) => {
		if (!isRecord(entry)) return [];
		const resolvedEntry = resolvedLegacyList?.[index];
		const resolvedId = isRecord(resolvedEntry) ? resolvedEntry.id : void 0;
		const id = typeof resolvedId === "string" ? resolvedId : entry.id;
		if (typeof id !== "string") return [];
		const { id: _authoredId, ...config } = entry;
		return [[normalizeAgentId(id), config]];
	}));
	return setPathValueCreatingParents(deletePathValue(deletePathValue(params.rootAuthoredConfig, ["agents", "list"]), ["agents", "entries"]), ["agents", "entries"], entries);
}
function resolvePersistCandidateForWrite(params) {
	const patch = createMergePatch(params.runtimeConfig, params.nextConfig);
	const projectedSource = normalizeTouchedAgentModelMapEntries({
		projectedSource: projectSourceOntoRuntimeShape(params.sourceConfig, params.runtimeConfig),
		patch,
		explicitSetPaths: params.explicitSetPaths,
		explicitSetValueSource: params.explicitSetValueSource ?? params.nextConfig
	});
	const rootAuthoredConfig = params.rootAuthoredConfig ?? params.sourceConfig;
	const persistCanonicalRoster = shouldPersistCanonicalAgentRoster(params);
	if (persistCanonicalRoster && configIncludeOwnsAgentRosterValues({
		parsed: rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations ?? params.sourceConfig,
		includeContributesRoster: params.agentRosterIncludeOwned
	})) throw new Error("Config write would flatten $include-owned config at agents; edit that include file directly or remove the $include first.");
	const projectedAuthoredRoster = persistCanonicalRoster ? projectAuthoredAgentRosterForCanonicalIncludes({
		rootAuthoredConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations
	}) : rootAuthoredConfig;
	const includeProjectionRootAuthoredConfig = persistCanonicalRoster && !hasAgentRosterProperty(projectedAuthoredRoster) ? setPathValueCreatingParents(projectedAuthoredRoster, ["agents", "entries"], toAgentEntriesRecord(listAgentEntries(params.sourceConfig))) : projectedAuthoredRoster;
	let persistedBase = preserveUntouchedIncludes({
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		persistedCandidate: applyMergePatch(projectedSource, patch)
	});
	const explicitSetPaths = persistCanonicalRoster ? [...(params.explicitSetPaths ?? []).filter((path) => !pathTargetsAgentRoster(path)), ["agents", "entries"]] : params.explicitSetPaths;
	const explicitSetValueSource = persistCanonicalRoster ? canonicalizeAgentRosterForExplicitWrite({
		valueSource: params.explicitSetValueSource ?? params.nextConfig,
		rootAuthoredConfig,
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		sourceConfigBeforeMigrations: params.sourceConfigBeforeMigrations,
		nextConfig: params.nextConfig,
		explicitSetPaths: params.explicitSetPaths,
		unsetPaths: params.unsetPaths
	}) : params.explicitSetValueSource ?? params.nextConfig;
	if (persistCanonicalRoster) {
		persistedBase = deletePathValue(persistedBase, ["agents", "entries"]);
		persistedBase = deletePathValue(persistedBase, ["agents", "list"]);
	}
	const persisted = injectExplicitlySetPaths({
		valueSource: explicitSetValueSource,
		persistedCandidate: persistedBase,
		explicitSetPaths,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		preserveDescendantIncludes: persistCanonicalRoster,
		allowIncludeAncestorExplicitSetPaths: params.allowIncludeAncestorExplicitSetPaths
	});
	const withPreservedIncludes = persistCanonicalRoster ? preserveUntouchedIncludes({
		runtimeConfig: params.runtimeConfig,
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig: includeProjectionRootAuthoredConfig,
		persistedCandidate: persisted
	}) : persisted;
	const preserveAuthoredRoster = canCanonicalizeAgentRoster(params.nextConfig) || params.preserveLegacyAgentRoster === true;
	const withAuthoredRoster = persistCanonicalRoster || !preserveAuthoredRoster ? withPreservedIncludes : restoreAuthoredAgentRoster(withPreservedIncludes, rootAuthoredConfig);
	if (persistCanonicalRoster) assertCanonicalAgentRosterRetainsEntries({
		currentConfig: params.sourceConfig,
		canonicalConfig: withAuthoredRoster,
		allowedRemovals: params.allowedAgentRosterRemovals
	});
	const withSchema = preserveRootSchemaUri({
		rootAuthoredConfig,
		nextConfig: params.nextConfig,
		persistedCandidate: withAuthoredRoster
	});
	return preserveAuthoredAgentParams({
		sourceConfig: params.sourceConfig,
		nextConfig: params.nextConfig,
		rootAuthoredConfig,
		persistedCandidate: withSchema,
		unsetPaths: params.unsetPaths
	});
}
function readRootSchemaUri(value) {
	if (!isRecord(value) || typeof value.$schema !== "string") return;
	return value.$schema;
}
function hasOwnRootSchemaKey(value) {
	return isRecord(value) && Object.hasOwn(value, "$schema");
}
function preserveRootSchemaUri(params) {
	if (hasOwnRootSchemaKey(params.nextConfig)) return params.persistedCandidate;
	const sourceSchema = readRootSchemaUri(params.rootAuthoredConfig);
	if (sourceSchema === void 0 || !isRecord(params.persistedCandidate)) return params.persistedCandidate;
	return {
		...params.persistedCandidate,
		$schema: sourceSchema
	};
}
function isNumericPathSegment(raw) {
	return parseArrayIndexPathSegment(raw) !== void 0;
}
function parseArrayIndexPathSegment(raw) {
	return parseConfigPathArrayIndex(raw);
}
//#endregion
//#region src/config/runtime-source-projection.ts
function isCompatibleTopLevelRuntimeProjectionShape(params) {
	const runtime = params.runtimeSnapshot;
	const candidate = params.candidate;
	for (const key of Object.keys(runtime)) {
		if (!Object.hasOwn(candidate, key)) return false;
		const runtimeValue = runtime[key];
		const candidateValue = candidate[key];
		if ((Array.isArray(runtimeValue) ? "array" : runtimeValue === null ? "null" : typeof runtimeValue) !== (Array.isArray(candidateValue) ? "array" : candidateValue === null ? "null" : typeof candidateValue)) return false;
	}
	return true;
}
/** Projects a runtime-derived config back onto the active authored source snapshot. */
function projectConfigOntoRuntimeSourceSnapshot(config) {
	const runtimeConfigSnapshot = getRuntimeConfigSnapshot();
	const runtimeConfigSourceSnapshot = getRuntimeConfigSourceSnapshot();
	if (!runtimeConfigSnapshot || !runtimeConfigSourceSnapshot) return config;
	if (config === runtimeConfigSnapshot) return runtimeConfigSourceSnapshot;
	if (!isCompatibleTopLevelRuntimeProjectionShape({
		runtimeSnapshot: runtimeConfigSnapshot,
		candidate: config
	})) return config;
	return applyMergePatch(projectSourceOntoRuntimeShape(runtimeConfigSourceSnapshot, runtimeConfigSnapshot), createMergePatch(runtimeConfigSnapshot, config));
}
//#endregion
//#region src/plugins/provider-model-routes.ts
/** Generic adapter for provider-owned model route public artifacts. */
/** Resolves provider-owned catalog id equivalence without loading its runtime. */
function resolveProviderModelCatalogId(params) {
	const provider = normalizeProviderId(params.provider);
	const normalized = (params.surface === void 0 ? resolveDirectBundledProviderPolicySurface(provider) : params.surface)?.normalizeModelCatalogId?.({
		provider,
		modelId: params.modelId
	});
	return typeof normalized === "string" && normalized.trim() ? normalized.trim() : null;
}
function normalizeModelId(provider, modelId, surface) {
	const trimmed = modelId?.trim();
	if (!trimmed) return;
	const canonical = surface?.normalizeModelCatalogId?.({
		provider,
		modelId: trimmed
	});
	return typeof canonical === "string" && canonical.trim() ? canonical.trim() : trimmed;
}
function projectConfiguredModelRoute(model) {
	return {
		...Object.hasOwn(model, "api") ? { api: model.api } : {},
		...Object.hasOwn(model, "baseUrl") ? { baseUrl: model.baseUrl } : {}
	};
}
/** Captures one provider artifact and config view for repeated row resolution. */
function createProviderModelRoutesResolver(params) {
	const provider = normalizeProviderId(params.provider);
	if (!provider) return () => null;
	const surface = params.surface === void 0 ? resolveDirectBundledProviderPolicySurface(provider) : params.surface;
	const resolveModelRoutes = surface?.resolveModelRoutes;
	const providerConfig = resolveMergedModelProviderConfig(params.config, provider);
	const authoredConfig = params.config ? projectConfigOntoRuntimeSourceSnapshot(params.config) : void 0;
	const configuredProvider = providerConfig ? {
		api: providerConfig.api,
		baseUrl: providerConfig.baseUrl
	} : void 0;
	const normalizeConfiguredModelId = (modelId) => normalizeModelId(provider, modelId, surface);
	const canonicalizeModelId = (modelId) => normalizeConfiguredModelId(modelId) ?? modelId.trim();
	const configuredModels = new Map(Array.from(resolveMergedModelProviderModels({
		models: providerConfig?.models,
		normalizeModelId: normalizeConfiguredModelId
	}), ([modelId, model]) => [modelId, projectConfiguredModelRoute(model)]));
	const providerRouteOverridePresence = params.requestTransportOverrides === "present" ? "present" : resolveModelProviderRouteOverridePresence({
		provider,
		authoredConfig
	});
	const routeOverridePresenceByModel = new Map([...configuredModels.keys()].map((modelId) => [modelId, params.requestTransportOverrides === "present" ? "present" : resolveModelProviderRouteOverridePresence({
		provider,
		modelId,
		authoredConfig,
		canonicalizeModelId
	})]));
	const env = params.env ?? process.env;
	return (observed) => {
		if (!resolveModelRoutes) return null;
		const modelId = normalizeModelId(provider, observed?.modelId, surface);
		const configuredModel = modelId ? configuredModels.get(modelId) : void 0;
		const requestTransportOverrides = modelId ? routeOverridePresenceByModel.get(modelId) ?? providerRouteOverridePresence : providerRouteOverridePresence;
		const observedRoutes = observed?.observedRoutes?.filter((route) => route.api != null || route.baseUrl !== void 0 && route.baseUrl !== null);
		return resolveModelRoutes({
			provider,
			...modelId ? { modelId } : {},
			requestTransportOverrides,
			...configuredModel ? { configuredModel } : {},
			...configuredProvider ? { configuredProvider } : {},
			env,
			...observedRoutes && observedRoutes.length > 0 ? { observedRoutes } : {}
		}) ?? null;
	};
}
/** Resolves one model route through its bundled provider public artifact. */
function resolveProviderModelRoutes(params) {
	return createProviderModelRoutesResolver(params)({
		modelId: params.modelId,
		observedRoutes: params.api != null || params.baseUrl !== void 0 && params.baseUrl !== null ? [{
			api: params.api,
			baseUrl: params.baseUrl
		}] : void 0
	});
}
//#endregion
//#region src/agents/provider-model-route.ts
/** Generic core consumers for provider-owned model route facts. */
/** Canonicalizes a model id only when its provider owns catalog equivalence. */
function canonicalizeProviderModelId(providerId, modelId) {
	const provider = normalizeProviderId(providerId);
	return provider && resolveProviderModelCatalogId({
		provider,
		modelId
	}) || modelId;
}
function normalizeRouteBaseUrl(value) {
	try {
		const url = new URL(value);
		url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
		return url.toString();
	} catch {
		return value.replace(/\/+$/u, "");
	}
}
function routeTupleMatches(source, route) {
	return source.api === route.api && typeof source.baseUrl === "string" && normalizeRouteBaseUrl(source.baseUrl) === normalizeRouteBaseUrl(route.baseUrl);
}
/** True when materialized model metadata belongs to the selected provider route. */
function modelMatchesProviderModelRoute(params) {
	if (routeTupleMatches(params, params.route)) return true;
	if (typeof params.api !== "string" || !params.api.trim() || params.api !== params.route.api || typeof params.baseUrl !== "string" || !params.baseUrl.trim()) return false;
	const configuredProvider = {
		api: params.api,
		baseUrl: params.baseUrl,
		models: []
	};
	const provider = normalizeProviderId(params.provider);
	const resolution = resolveProviderModelRoutes({
		provider,
		config: { models: { providers: { [provider]: configuredProvider } } }
	});
	return resolution?.kind === "routes" && resolution.routes.some((candidate) => candidate.authRequirement === params.route.authRequirement && routeTupleMatches(candidate, params.route));
}
/** Creates catalog equivalence and physical-route matching from provider facts. */
function createProviderModelCatalogRoutePolicy(providerId) {
	const provider = normalizeProviderId(providerId);
	return {
		resolveIdentity: (entry) => {
			if (normalizeProviderId(entry.provider) !== provider) return null;
			const id = resolveProviderModelCatalogId({
				provider,
				modelId: splitTrailingAuthProfile(entry.id).model
			});
			return id ? {
				id,
				key: `${provider}/${id}`
			} : null;
		},
		matchesRoute: (entry, route) => normalizeProviderId(entry.provider) === provider && modelMatchesProviderModelRoute({
			provider,
			api: entry.api,
			baseUrl: entry.baseUrl,
			route
		})
	};
}
/** Projects a selected route onto transient config used only for model materialization. */
function projectProviderModelRouteConfig(params) {
	const provider = normalizeProviderId(params.provider);
	const providers = params.config?.models?.providers ?? {};
	const providerEntry = resolveMergedModelProviderEntry(params.config, provider);
	const providerKey = providerEntry?.providerKey ?? provider;
	const providerConfig = providerEntry?.providerConfig ?? { models: [] };
	const routeProviders = Object.fromEntries(Object.entries(providers).filter(([candidate]) => normalizeProviderId(candidate) !== provider || candidate === providerKey));
	return {
		...params.config,
		models: {
			...params.config?.models,
			providers: {
				...routeProviders,
				[providerKey]: {
					...providerConfig,
					auth: params.route.authRequirement === "subscription" ? "oauth" : "api-key",
					api: params.route.api,
					baseUrl: params.route.baseUrl
				}
			}
		}
	};
}
//#endregion
export { createProviderModelRoutesResolver as a, preserveIncludeOwnedConfigForWrite as c, configIncludeOwnsAgentRoster as d, hasResolvedRosterBeforeMigrations as f, projectProviderModelRouteConfig as i, projectSourceOntoRuntimeShape as l, includeContributionOwnsBindings as m, createProviderModelCatalogRoutePolicy as n, resolveProviderModelRoutes as o, includeContributionOwnsAgentRoster as p, modelMatchesProviderModelRoute as r, projectConfigOntoRuntimeSourceSnapshot as s, canonicalizeProviderModelId as t, resolvePersistCandidateForWrite as u };
