import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
import { s as formatStrictJsonParseFailure } from "./error-format-BAHQH0iA.js";
import { t as toDotPath } from "./dot-path-Fq2FA5PM.js";
import JSON5 from "json5";
//#region src/cli/config-cli-path.ts
function parseIndexSegment(raw) {
	return parseConfigPathArrayIndex(raw);
}
function isIndexSegment(raw) {
	return parseIndexSegment(raw) !== void 0;
}
function parseBracketPathSegment(raw, fullPath) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error(`Invalid path (empty "[]"): ${fullPath}`);
	if (trimmed.startsWith("\"") || trimmed.startsWith("'")) {
		try {
			const parsed = JSON5.parse(trimmed);
			if (typeof parsed === "string" && parsed.trim()) return parsed;
		} catch (err) {
			throw new Error(`Invalid path bracket string (${trimmed}): ${fullPath}`, { cause: err });
		}
		throw new Error(`Invalid path bracket string (${trimmed}): ${fullPath}`);
	}
	return trimmed;
}
function assertNotWhitespaceSegment(current, raw) {
	if (current.length > 0 && !current.trim()) throw new Error(`Invalid path (empty segment): ${raw}`);
}
function findBracketPathClose(path, open) {
	let quote;
	for (let index = open + 1; index < path.length; index += 1) {
		const character = path[index];
		if (quote) {
			if (character === "\\") index += 1;
			else if (character === quote) quote = void 0;
			continue;
		}
		if (character === "]") return index;
		if ((character === "\"" || character === "'") && !path.slice(open + 1, index).trim()) quote = character;
	}
	return -1;
}
function parsePath(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return [];
	const parts = [];
	let current = "";
	let segmentEmitted = false;
	let i = 0;
	while (i < trimmed.length) {
		const ch = trimmed[i];
		if (ch === "\\") {
			const next = trimmed[i + 1];
			if (next === void 0) throw new Error(`Invalid path (trailing escape): ${raw}`);
			current += next;
			i += 2;
			continue;
		}
		if (ch === ".") {
			assertNotWhitespaceSegment(current, raw);
			if (!segmentEmitted && !current.trim()) throw new Error(`Invalid path (empty segment): ${raw}`);
			if (current) parts.push(current.trim());
			current = "";
			segmentEmitted = false;
			i += 1;
			continue;
		}
		if (ch === "[") {
			assertNotWhitespaceSegment(current, raw);
			if (!current.trim() && !segmentEmitted && parts.length > 0) throw new Error(`Invalid path (empty segment): ${raw}`);
			if (current) parts.push(current.trim());
			current = "";
			const close = findBracketPathClose(trimmed, i);
			if (close === -1) throw new Error(`Invalid path (missing "]"): ${raw}`);
			const inside = trimmed.slice(i + 1, close).trim();
			if (!inside) throw new Error(`Invalid path (empty "[]"): ${raw}`);
			parts.push(parseBracketPathSegment(inside, raw));
			const next = trimmed[close + 1];
			if (next !== void 0 && next !== "." && next !== "[") throw new Error(`Invalid path (missing separator after bracket): ${raw}`);
			segmentEmitted = true;
			i = close + 1;
			continue;
		}
		current += ch;
		i += 1;
	}
	if (!segmentEmitted && !current.trim()) throw new Error(`Invalid path (empty segment): ${raw}`);
	if (current) parts.push(current.trim());
	return parts;
}
function parseConfigSetPath(path) {
	const parsedPath = parsePath(path);
	if (parsedPath.length === 0) throw new Error("Path is empty.");
	validatePathSegments(parsedPath);
	return parsedPath;
}
function parseConfigSetValue(raw, strictJson) {
	const trimmed = raw.trim();
	if (strictJson) try {
		return JSON.parse(trimmed);
	} catch (err) {
		throw new Error(formatStrictJsonParseFailure({
			value: raw,
			cause: err
		}), { cause: err });
	}
	try {
		return JSON5.parse(trimmed);
	} catch {
		return raw;
	}
}
function validatePathSegments(path) {
	for (const segment of path) if (!isIndexSegment(segment) && isBlockedObjectKey(segment)) throw new Error(`Invalid path segment: ${segment}`);
}
function hasOwnPathKey(value, key) {
	return Object.hasOwn(value, key);
}
function getAtPath(root, path) {
	let current = root;
	for (const segment of path) {
		if (!current || typeof current !== "object") return { found: false };
		if (Array.isArray(current)) {
			const index = parseIndexSegment(segment);
			if (index === void 0 || index >= current.length) return { found: false };
			current = current[index];
			continue;
		}
		const record = current;
		if (!hasOwnPathKey(record, segment)) return { found: false };
		current = record[segment];
	}
	return {
		found: true,
		value: current
	};
}
function formatConfigUnsetMissingPathMessage(params) {
	if (params.runtimeOnly) return `Config path not found in authored config: ${params.path}. It only exists after runtime defaults are applied, so there is nothing for config unset to remove. Use ${formatCliCommand("openclaw config set <path> <value>")} to override the inherited value.`;
	return `Config path not found: ${params.path}. Nothing was changed. Run ${formatCliCommand("openclaw config get <path>")} first if you are unsure of the path.`;
}
function isSchemaRecord(value) {
	return isRecord(value);
}
function schemaTypes(schema) {
	if (typeof schema.type === "string") return /* @__PURE__ */ new Set([schema.type]);
	if (Array.isArray(schema.type)) return new Set(schema.type.filter((entry) => typeof entry === "string"));
	return /* @__PURE__ */ new Set();
}
function schemaAlternatives(schema, seen = /* @__PURE__ */ new Set()) {
	if (seen.has(schema)) return [];
	seen.add(schema);
	const alternatives = [schema];
	for (const key of [
		"anyOf",
		"oneOf",
		"allOf"
	]) {
		const entries = schema[key];
		if (!Array.isArray(entries)) continue;
		for (const entry of entries) if (isSchemaRecord(entry)) alternatives.push(...schemaAlternatives(entry, seen));
	}
	return alternatives;
}
function schemaLooksArray(schema) {
	return schemaTypes(schema).has("array") || isSchemaRecord(schema.items) || Array.isArray(schema.items);
}
function schemaLooksObject(schema) {
	return schemaTypes(schema).has("object") || isSchemaRecord(schema.properties) || schema.additionalProperties === true || isSchemaRecord(schema.additionalProperties);
}
function propertySchema(schema, segment) {
	const schemas = [];
	for (const alternative of schemaAlternatives(schema)) {
		if (schemaLooksArray(alternative)) {
			const index = parseIndexSegment(segment);
			if (index !== void 0) {
				const indexedItem = Array.isArray(alternative.items) ? alternative.items[index] : alternative.items;
				if (isSchemaRecord(indexedItem)) schemas.push(indexedItem);
			}
			continue;
		}
		const explicit = (isSchemaRecord(alternative.properties) ? alternative.properties : void 0)?.[segment];
		if (isSchemaRecord(explicit)) schemas.push(explicit);
		else if (isSchemaRecord(alternative.additionalProperties)) schemas.push(alternative.additionalProperties);
	}
	return schemas;
}
function schemasAtPath(schema, path) {
	if (!schema) return [];
	let schemas = [schema];
	for (const segment of path) {
		schemas = schemas.flatMap((candidate) => propertySchema(candidate, segment));
		if (schemas.length === 0) return [];
	}
	return schemas;
}
function schemaPrefersArrayAtPath(schema, path) {
	const candidates = schemasAtPath(schema, path).flatMap((candidate) => schemaAlternatives(candidate));
	if (candidates.length === 0) return;
	const hasArray = candidates.some((candidate) => schemaLooksArray(candidate));
	const hasObject = candidates.some((candidate) => schemaLooksObject(candidate));
	if (hasArray && !hasObject) return true;
	if (hasObject && !hasArray) return false;
}
function shouldCreateArrayForMissingPathSegment(params) {
	if (!params.next || params.options?.numericObjectKeys || !isIndexSegment(params.next)) return false;
	const parentPath = params.path.slice(0, params.segmentIndex + 1);
	return schemaPrefersArrayAtPath(params.options?.schema, parentPath) ?? true;
}
function setAtPath(root, path, value, options) {
	const last = path.at(-1);
	if (last === void 0) throw new Error("Config path must contain at least one segment");
	let current = root;
	for (const [i, segment] of path.slice(0, -1).entries()) {
		const nextIsIndex = shouldCreateArrayForMissingPathSegment({
			path,
			segmentIndex: i,
			next: path[i + 1],
			options
		});
		if (Array.isArray(current)) {
			const index = parseIndexSegment(segment);
			if (index === void 0) throw new Error(`Expected numeric index for array segment "${segment}"`);
			const existing = current[index];
			if (!existing || typeof existing !== "object") current[index] = nextIsIndex ? [] : {};
			current = current[index];
			continue;
		}
		if (!current || typeof current !== "object") throw new Error(`Cannot traverse into "${segment}" (not an object)`);
		const record = current;
		const existing = hasOwnPathKey(record, segment) ? record[segment] : void 0;
		if (!existing || typeof existing !== "object") record[segment] = nextIsIndex ? [] : {};
		current = record[segment];
	}
	if (Array.isArray(current)) {
		const index = parseIndexSegment(last);
		if (index === void 0) throw new Error(`Expected numeric index for array segment "${last}"`);
		current[index] = value;
		return;
	}
	if (!current || typeof current !== "object") throw new Error(`Cannot set "${last}" (parent is not an object)`);
	current[last] = value;
}
function modelArrayIds(value) {
	if (!Array.isArray(value)) return null;
	const ids = /* @__PURE__ */ new Set();
	for (const entry of value) {
		if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id.trim()) return null;
		ids.add(entry.id.trim());
	}
	return ids;
}
function mergeModelArrays(existing, patch) {
	const merged = [...existing];
	const indexById = /* @__PURE__ */ new Map();
	for (const [index, entry] of merged.entries()) if (isRecord(entry) && typeof entry.id === "string" && entry.id.trim()) indexById.set(entry.id.trim(), index);
	for (const entry of patch) {
		if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id.trim()) {
			merged.push(entry);
			continue;
		}
		const id = entry.id.trim();
		const existingIndex = indexById.get(id);
		if (existingIndex === void 0) {
			indexById.set(id, merged.length);
			merged.push(entry);
			continue;
		}
		const existingEntry = merged[existingIndex];
		merged[existingIndex] = isRecord(existingEntry) ? {
			...existingEntry,
			...entry
		} : entry;
	}
	return merged;
}
function isProviderModelListPath(path) {
	return path.length === 4 && path[0] === "models" && path[1] === "providers" && path[3] === "models";
}
function mergeConfigValue(existing, patch, path) {
	if (isProviderModelListPath(path) && Array.isArray(existing) && Array.isArray(patch)) return mergeModelArrays(existing, patch);
	if (isRecord(existing) && isRecord(patch)) {
		const next = { ...existing };
		for (const [key, value] of Object.entries(patch)) next[key] = hasOwnPathKey(next, key) && isRecord(next[key]) && isRecord(value) ? mergeConfigValue(next[key], value, [...path, key]) : value;
		return next;
	}
	throw new Error(`Cannot merge ${toDotPath(path)}; use --replace to replace intentionally.`);
}
function mergeAtPath(root, path, value, options) {
	const existing = getAtPath(root, path);
	setAtPath(root, path, existing.found ? mergeConfigValue(existing.value, value, path) : value, options);
}
function isProtectedMapReplacementPath(path) {
	const joined = path.join(".");
	return joined === "agents.defaults.models" || joined === "models.providers" || path.length === 3 && path[0] === "models" && path[1] === "providers" || joined === "agents.entries" || joined === "plugins.entries" || joined === "auth.profiles";
}
function isProtectedArrayReplacementPath(path) {
	return isProviderModelListPath(path);
}
function formatRemovedEntries(entries) {
	const visible = entries.slice(0, 6);
	const suffix = entries.length > visible.length ? `, ... ${entries.length - visible.length} more` : "";
	return `${visible.join(", ")}${suffix}`;
}
function assertNonDestructiveReplacement(params) {
	if (params.allowReplace) return;
	const existing = getAtPath(params.root, params.path);
	if (!existing.found) return;
	const pathLabel = toDotPath(params.path);
	if (isProtectedMapReplacementPath(params.path) && isRecord(existing.value)) {
		if (!isRecord(params.value)) return;
		const nextKeys = new Set(Object.keys(params.value));
		const removed = Object.keys(existing.value).filter((key) => !nextKeys.has(key));
		if (removed.length > 0) throw new Error(`Refusing to replace ${pathLabel}; it would remove existing entries: ${formatRemovedEntries(removed)}. Use --merge to merge object values or --replace to replace intentionally.`);
	}
	if (isProtectedArrayReplacementPath(params.path)) {
		const existingIds = modelArrayIds(existing.value);
		const nextIds = modelArrayIds(params.value);
		if (!existingIds || !nextIds) return;
		const removed = [...existingIds].filter((id) => !nextIds.has(id));
		if (removed.length > 0) throw new Error(`Refusing to replace ${pathLabel}; it would remove existing entries: ${formatRemovedEntries(removed)}. Use --merge to merge by id or --replace to replace intentionally.`);
	}
}
function unsetAtPath(root, path) {
	const last = path.at(-1);
	if (last === void 0) return { removed: false };
	let current = root;
	for (const segment of path.slice(0, -1)) {
		if (!current || typeof current !== "object") return { removed: false };
		if (Array.isArray(current)) {
			const index = parseIndexSegment(segment);
			if (index === void 0 || index >= current.length) return { removed: false };
			current = current[index];
			continue;
		}
		const record = current;
		if (!hasOwnPathKey(record, segment)) return { removed: false };
		current = record[segment];
	}
	if (Array.isArray(current)) {
		const index = parseIndexSegment(last);
		if (index === void 0 || index >= current.length) return { removed: false };
		current.splice(index, 1);
		return {
			removed: true,
			leafContainer: "array"
		};
	}
	if (!current || typeof current !== "object") return { removed: false };
	const record = current;
	if (!hasOwnPathKey(record, last)) return { removed: false };
	delete record[last];
	return {
		removed: true,
		leafContainer: "object"
	};
}
//#endregion
export { parseConfigSetPath as a, unsetAtPath as c, mergeAtPath as i, validatePathSegments as l, formatConfigUnsetMissingPathMessage as n, parseConfigSetValue as o, getAtPath as r, setAtPath as s, assertNonDestructiveReplacement as t };
