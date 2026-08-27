import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { u as normalizeStringEntries, v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import { a as isPreExecutionBlockedToolResult, d as runWithToolExecutionValidation, l as rewrapToolWithBeforeToolCallHook, r as getBeforeToolCallFailureDisposition, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-BcJc3ySa.js";
import { F as SESSION_TOOL_STDERR_TAIL_BYTES, I as appendBoundedTextTail } from "./sessions-BHNzcBA2.js";
import { n as ToolInputError, r as asToolParamsRecord } from "./common-ciEJghJz.js";
import { a as wrapExternalContent, i as truncateSanitizedExternalContent } from "./external-content-IQUFD6xt.js";
import { i as protectNetworkToolExecutionError, l as resolveToolResultFailureKind, r as isTrustedToolExecutionPreflightError } from "./tool-result-error-CIJSdhiL.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { t as levenshteinDistance } from "./levenshtein-distance-BP7b43oK.js";
import { S as isToolWrappedWithBeforeToolCallHook, g as getChannelAgentToolMeta } from "./gateway-A68ONVQZ.js";
import { i as getPluginToolMeta } from "./tools-BRlxfgwj.js";
import { t as isCoreCodingSurfaceToolName } from "./core-tool-factory-descriptors-B3S4aQAF.js";
import { n as isAgentToolReplaySafe } from "./tool-replay-safety-B_xTwlME.js";
import os from "node:os";
import { spawn } from "node:child_process";
import { Type } from "typebox";
import { Guard } from "typebox/guard";
//#region src/agents/tool-schema-hints.ts
/** Bounded TypeScript-style hints for model-visible tool input and output schemas. */
const MAX_COMPACT_INPUT_HINT_CHARS = 300;
const MAX_COMPACT_OUTPUT_HINT_CHARS = 800;
const MAX_COMPACT_INPUT_SCHEMA_PROPERTIES = 16;
const MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES = 21;
const MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS = 128;
const MAX_COMPACT_INPUT_DEPTH = 4;
const MAX_COMPACT_OUTPUT_DEPTH = 6;
const MAX_COMPACT_UNION_TYPES = 4;
const MAX_COMPACT_ENUM_VALUES = 8;
const MAX_COMPACT_ENUM_CHARS = 96;
const IDENTIFIER_RE = /^[A-Za-z_$][A-Za-z0-9_$]*$/u;
const UNSUPPORTED_SHAPE_KEYWORDS = [
	"$ref",
	"$dynamicRef",
	"$recursiveRef",
	"allOf",
	"patternProperties",
	"unevaluatedProperties",
	"dependentSchemas",
	"dependencies",
	"if",
	"then",
	"else",
	"prefixItems",
	"unevaluatedItems"
];
const INPUT_LIMITS = {
	maxChars: MAX_COMPACT_INPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_INPUT_DEPTH,
	maxProperties: MAX_COMPACT_INPUT_SCHEMA_PROPERTIES
};
const OUTPUT_LIMITS = {
	maxChars: MAX_COMPACT_OUTPUT_HINT_CHARS,
	maxDepth: MAX_COMPACT_OUTPUT_DEPTH,
	maxProperties: MAX_COMPACT_OUTPUT_SCHEMA_PROPERTIES
};
const UNKNOWN_HINT = {
	text: "unknown",
	complete: false
};
function completeHint(text) {
	return {
		text,
		complete: true
	};
}
function withSupportedShape(schema, hint) {
	return UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(schema, key)) ? {
		...hint,
		complete: false
	} : hint;
}
function normalizeNullableSchemaForHint(schema) {
	if (!Object.hasOwn(schema, "nullable")) return schema;
	if (typeof schema.nullable !== "boolean") return;
	const types = typeof schema.type === "string" ? [schema.type] : Array.isArray(schema.type) && schema.type.every((value) => typeof value === "string") ? schema.type : void 0;
	if (!types) return;
	if (!schema.nullable) return schema;
	return {
		...schema,
		nullable: false,
		type: [.../* @__PURE__ */ new Set([...types, "null"])]
	};
}
function renderPrimitive(value) {
	if (value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
}
function compactLiteralUnion(values) {
	if (!Array.isArray(values) || values.length === 0 || values.length > MAX_COMPACT_ENUM_VALUES) return;
	const rendered = values.map(renderPrimitive);
	if (rendered.some((value) => value === void 0)) return;
	const result = [...new Set(rendered)].join(" | ");
	return result.length <= MAX_COMPACT_ENUM_CHARS ? completeHint(result) : void 0;
}
function compactSchemaUnion(schema, depth, limits) {
	const hasAnyOf = Object.hasOwn(schema, "anyOf");
	const hasOneOf = Object.hasOwn(schema, "oneOf");
	if (!hasAnyOf && !hasOneOf) return;
	if (hasAnyOf && hasOneOf) return UNKNOWN_HINT;
	const variants = hasAnyOf ? schema.anyOf : schema.oneOf;
	if (!Array.isArray(variants) || variants.length === 0 || variants.length > MAX_COMPACT_ENUM_VALUES) return UNKNOWN_HINT;
	if ([
		"const",
		"enum",
		"type",
		"properties",
		"required",
		"additionalProperties",
		"items"
	].some((key) => Object.hasOwn(schema, key))) return UNKNOWN_HINT;
	const literalVariants = variants.map((variant) => {
		if (!isRecord(variant) || !Object.hasOwn(variant, "const") || UNSUPPORTED_SHAPE_KEYWORDS.some((key) => Object.hasOwn(variant, key))) return;
		return variant.const;
	});
	if (literalVariants.every((value) => value !== void 0)) {
		const literalUnion = compactLiteralUnion(literalVariants);
		if (literalUnion) return literalUnion;
	}
	if (variants.length > MAX_COMPACT_UNION_TYPES) return UNKNOWN_HINT;
	const rendered = variants.map((variant) => compactSchemaType(variant, depth + 1, limits));
	if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
	return completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | "));
}
function insertLexicallyBounded(values, value, limit) {
	if (limit <= 0) return;
	let low = 0;
	let high = values.length;
	while (low < high) {
		const middle = Math.floor((low + high) / 2);
		if ((values[middle] ?? "").localeCompare(value) < 0) low = middle + 1;
		else high = middle;
	}
	if (low >= limit) return;
	values.splice(low, 0, value);
	if (values.length > limit) values.pop();
}
function compactObjectHint(schema, depth, limits) {
	if (!isRecord(schema.properties)) {
		const requiredValues = Array.isArray(schema.required) ? schema.required : [];
		return !(requiredValues.length > limits.maxProperties || requiredValues.some((value) => typeof value === "string")) && schema.additionalProperties === false ? completeHint("{}") : {
			text: "{ ... }",
			complete: false
		};
	}
	const properties = schema.properties;
	const requiredValues = Array.isArray(schema.required) ? schema.required : [];
	const invalidRequired = requiredValues.length <= limits.maxProperties && requiredValues.some((value) => typeof value !== "string");
	const required = new Set(requiredValues.slice(0, limits.maxProperties).filter((value) => typeof value === "string"));
	const requiredKeys = [];
	let missingRequired = false;
	for (const key of required) {
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			missingRequired = true;
			continue;
		}
		if (!Object.hasOwn(properties, key)) {
			missingRequired = true;
			continue;
		}
		insertLexicallyBounded(requiredKeys, key, limits.maxProperties);
	}
	const optionalLimit = limits.maxProperties - requiredKeys.length;
	const optionalKeys = [];
	let optionalCount = 0;
	let oversizedOptionalKey = false;
	for (const key in properties) {
		if (!Object.hasOwn(properties, key) || required.has(key)) continue;
		optionalCount += 1;
		if (key.length > MAX_COMPACT_SCHEMA_PROPERTY_NAME_CHARS) {
			oversizedOptionalKey = true;
			continue;
		}
		insertLexicallyBounded(optionalKeys, key, optionalLimit);
	}
	const keys = [...requiredKeys, ...optionalKeys];
	const structurallyIncomplete = requiredValues.length > limits.maxProperties || invalidRequired || missingRequired || oversizedOptionalKey || optionalCount > optionalLimit;
	let omitted = structurallyIncomplete || schema.additionalProperties === true || isRecord(schema.additionalProperties);
	let complete = !structurallyIncomplete && schema.additionalProperties === false;
	const parts = [];
	for (const key of keys) {
		const name = IDENTIFIER_RE.test(key) ? key : JSON.stringify(key);
		const propertyHint = compactSchemaType(properties[key], depth, limits);
		complete &&= propertyHint.complete;
		const part = `${name}${required.has(key) ? "" : "?"}: ${propertyHint.text}`;
		if (`{ ${[...parts, part].join("; ")} }`.length > limits.maxChars) {
			omitted = true;
			complete = false;
			break;
		}
		parts.push(part);
	}
	if (parts.length === 0) return keys.length === 0 && !omitted ? {
		text: "{}",
		complete
	} : {
		text: "{ ... }",
		complete: false
	};
	return {
		text: `{ ${parts.join("; ")}${omitted ? "; ..." : ""} }`,
		complete
	};
}
function compactSchemaType(schema, depth = 0, limits = INPUT_LIMITS) {
	if (!isRecord(schema)) return UNKNOWN_HINT;
	if (Object.keys(schema).length === 0) return completeHint("unknown");
	if (depth >= limits.maxDepth) return UNKNOWN_HINT;
	const normalizedNullableSchema = normalizeNullableSchemaForHint(schema);
	if (!normalizedNullableSchema) return UNKNOWN_HINT;
	if (normalizedNullableSchema !== schema) return compactSchemaType(normalizedNullableSchema, depth, limits);
	const finish = (hint) => withSupportedShape(schema, hint);
	const schemaUnion = compactSchemaUnion(schema, depth, limits);
	if (schemaUnion) return finish(schemaUnion);
	const literal = renderPrimitive(schema.const);
	if (literal !== void 0) return finish(completeHint(literal));
	const enumUnion = compactLiteralUnion(schema.enum);
	if (enumUnion) return finish(enumUnion);
	const type = schema.type;
	if (Array.isArray(type)) {
		if (type.length === 0 || type.length > MAX_COMPACT_UNION_TYPES || !type.every((value) => typeof value === "string")) return UNKNOWN_HINT;
		const rendered = type.map((value) => compactSchemaType({
			...schema,
			type: value
		}, depth + 1, limits));
		if (rendered.some((hint) => !hint.complete)) return UNKNOWN_HINT;
		return finish(completeHint([...new Set(rendered.map((hint) => hint.text))].join(" | ")));
	}
	if (type === "integer" || type === "number") return finish(completeHint("number"));
	if (type === "array") {
		const itemHint = compactSchemaType(schema.items, depth + 1, limits);
		return finish({
			text: `Array<${itemHint.text}>`,
			complete: itemHint.complete
		});
	}
	if (type === "object") return finish(compactObjectHint(schema, depth + 1, limits));
	if (type === "string" || type === "boolean" || type === "null") return finish(completeHint(type));
	return UNKNOWN_HINT;
}
/** Compact one tool input schema. Unknown inputs remain explicit for safe describe fallback. */
function compactToolInputHint(schema) {
	if (!isRecord(schema)) return "unknown";
	const hint = schema.type === "object" ? compactObjectHint(schema, 0, INPUT_LIMITS) : compactSchemaType(schema, 0, INPUT_LIMITS);
	return hint.text.length <= INPUT_LIMITS.maxChars ? hint.text : "unknown";
}
/** Compact one trusted output schema. Omit incomplete hints instead of inviting field guesses. */
function compactToolOutputHint(schema) {
	const hint = compactSchemaType(schema, 0, OUTPUT_LIMITS);
	return hint.complete && hint.text.length <= OUTPUT_LIMITS.maxChars ? hint.text : void 0;
}
//#endregion
//#region src/agents/tool-search-types.ts
const TOOL_SEARCH_CODE_MODE_TOOL_NAME = "tool_search_code";
const TOOL_SEARCH_RAW_TOOL_NAME = "tool_search";
const TOOL_DESCRIBE_RAW_TOOL_NAME = "tool_describe";
const TOOL_CALL_RAW_TOOL_NAME = "tool_call";
const MAX_TOOL_SEARCH_BATCH_RESPONSE_CHARS = 4e3;
const TOOL_SEARCH_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
	TOOL_SEARCH_CODE_MODE_TOOL_NAME,
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
]);
const TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES = /* @__PURE__ */ new Set([
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
]);
//#endregion
//#region src/agents/tool-search-catalog.ts
const MAX_REUSABLE_CATALOG_SNAPSHOTS = 256;
const reusableCatalogSnapshots = /* @__PURE__ */ new Map();
const catalogFingerprints = /* @__PURE__ */ new WeakMap();
const catalogToolIdentities = /* @__PURE__ */ new WeakMap();
const untrustedSchemaIdentities = /* @__PURE__ */ new WeakMap();
let nextCatalogToolIdentity = 1;
let nextUntrustedSchemaIdentity = 1;
function getReusableCatalogSnapshotCountForTest() {
	return reusableCatalogSnapshots.size;
}
function reusableCatalogKey(input) {
	if (input.sessionId?.trim()) return `session:${input.sessionId.trim()}`;
	if (input.sessionKey?.trim()) return `key:${input.sessionKey.trim()}`;
	const agentId = input.agentId?.trim();
	return agentId ? `agent:${agentId}` : void 0;
}
function stableJsonFingerprint(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (value === null || typeof value !== "object") return JSON.stringify(value) ?? "undefined";
	if (seen.has(value)) return "\"[Circular]\"";
	seen.add(value);
	if (Array.isArray(value)) return `[${value.map((item) => stableJsonFingerprint(item, seen)).join(",")}]`;
	const record = value;
	return `{${Object.keys(record).toSorted().map((key) => `${JSON.stringify(key)}:${stableJsonFingerprint(record[key], seen)}`).join(",")}}`;
}
function catalogToolIdentity(tool) {
	const existing = catalogToolIdentities.get(tool);
	if (existing !== void 0) return existing;
	const next = nextCatalogToolIdentity;
	nextCatalogToolIdentity += 1;
	catalogToolIdentities.set(tool, next);
	return next;
}
function untrustedSchemaFingerprint(schema) {
	if (schema === null || typeof schema !== "object") return stableJsonFingerprint(schema);
	const existing = untrustedSchemaIdentities.get(schema);
	if (existing !== void 0) return `object:${existing}`;
	const next = nextUntrustedSchemaIdentity;
	nextUntrustedSchemaIdentity += 1;
	untrustedSchemaIdentities.set(schema, next);
	return `object:${next}`;
}
function catalogEntriesFingerprint(entries) {
	return entries.map((entry) => [
		entry.id,
		entry.source,
		entry.sourceName ?? "",
		stableJsonFingerprint(entry.mcp),
		entry.name,
		entry.label ?? "",
		entry.description,
		entry.source === "openclaw" ? stableJsonFingerprint(entry.parameters) : untrustedSchemaFingerprint(entry.parameters),
		entry.source === "openclaw" ? stableJsonFingerprint(entry.outputSchema) : untrustedSchemaFingerprint(entry.outputSchema),
		String(catalogToolIdentity(entry.tool))
	].map((part) => JSON.stringify(part)).join(":")).toSorted().join("\n");
}
function restoreToolSearchCatalog(params) {
	const next = {
		entries: params.entries,
		counterScope: generateSecureToken(12),
		searchCount: 0,
		describeCount: 0,
		callCount: 0
	};
	params.catalogRef.current = next;
	catalogFingerprints.set(next, params.fingerprint);
}
function rememberReusableCatalog(key, catalog) {
	if (!key) return;
	const fingerprint = catalogFingerprints.get(catalog);
	if (!fingerprint) return;
	if (reusableCatalogSnapshots.has(key)) reusableCatalogSnapshots.delete(key);
	reusableCatalogSnapshots.set(key, {
		entries: catalog.entries,
		fingerprint
	});
	pruneMapToMaxSize(reusableCatalogSnapshots, MAX_REUSABLE_CATALOG_SNAPSHOTS);
}
function classifyTool(tool) {
	const meta = getPluginToolMeta(tool);
	const pluginId = meta?.pluginId?.trim();
	const mcp = meta?.mcp;
	if (mcp) return {
		source: "mcp",
		sourceName: mcp.safeServerName || pluginId || "mcp",
		mcp
	};
	if (pluginId === "bundle-mcp") return {
		source: "mcp",
		sourceName: pluginId
	};
	if (pluginId) return {
		source: "openclaw",
		sourceName: pluginId
	};
	return {
		source: "openclaw",
		sourceName: "core"
	};
}
function makeCatalogId(tool, source, sourceName) {
	return `${source}:${sourceName?.trim() || "core"}:${tool.name}`;
}
function wrapCatalogTool(tool, hookContext) {
	if (!hookContext || isToolWrappedWithBeforeToolCallHook(tool)) return tool;
	return wrapToolWithBeforeToolCallHook(tool, hookContext);
}
function toCatalogEntry(tool, sourceOverride, hookContext) {
	const classified = classifyTool(tool);
	const source = sourceOverride ?? classified.source;
	const sourceName = sourceOverride === "client" ? "client" : classified.sourceName;
	const catalogTool = source === "client" ? tool : wrapCatalogTool(tool, hookContext);
	return {
		id: makeCatalogId(tool, source, sourceName),
		source,
		sourceName,
		...source === "mcp" && classified.mcp ? { mcp: classified.mcp } : {},
		name: tool.name,
		label: tool.label,
		description: tool.description ?? "",
		parameters: tool.parameters,
		...source === "openclaw" && tool.outputSchema ? { outputSchema: tool.outputSchema } : {},
		tool: catalogTool
	};
}
function shouldCatalogTool(tool) {
	return !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) && tool.catalogMode !== "direct-only";
}
/**
* Core file/shell primitives and caller-required names (e.g. message when it is
* the only reply path) stay visible while remaining searchable. Both must
* resolve to trusted OpenClaw tools: an MCP lookalike must never become a
* direct delivery or core-coding tool.
*/
function isDirectVisibleCatalogTool(tool, directToolNames) {
	const classified = classifyTool(tool);
	return classified.source === "openclaw" && (directToolNames.has(tool.name) || isCoreCodingSurfaceToolName(tool.name) && classified.sourceName === "core");
}
function registerHeadlessToolSearchCatalog(params) {
	const { catalogRef, tools, hookContext } = params;
	registerToolSearchCatalog({
		catalogRef,
		entries: tools.filter((tool) => shouldCatalogTool(tool)).map((tool) => {
			return toCatalogEntry(hookContext && isToolWrappedWithBeforeToolCallHook(tool) ? rewrapToolWithBeforeToolCallHook(tool, hookContext) : tool, void 0, hookContext);
		})
	});
}
function collectUniqueCatalogToolNames(tools) {
	const nameCounts = /* @__PURE__ */ new Map();
	for (const tool of tools) if (shouldCatalogTool(tool)) nameCounts.set(tool.name, (nameCounts.get(tool.name) ?? 0) + 1);
	return new Set(Array.from(nameCounts).filter(([, count]) => count === 1).map(([name]) => name));
}
function registerToolSearchCatalog(params) {
	const prior = params.append ? params.catalogRef.current : void 0;
	const byId = new Map((prior?.entries ?? []).map((entry) => [entry.id, entry]));
	for (const entry of params.entries) byId.set(entry.id, entry);
	const next = {
		entries: Array.from(byId.values()).toSorted((a, b) => a.id.localeCompare(b.id)),
		counterScope: prior?.counterScope ?? generateSecureToken(12),
		searchCount: prior?.searchCount ?? 0,
		describeCount: prior?.describeCount ?? 0,
		callCount: prior?.callCount ?? 0
	};
	catalogFingerprints.set(next, catalogEntriesFingerprint(next.entries));
	params.catalogRef.current = next;
	return next;
}
function clearToolSearchCatalog(params) {
	if (params.catalogRef) params.catalogRef.current = void 0;
	if (!params.runId?.trim()) {
		const snapshotKey = reusableCatalogKey(params);
		if (snapshotKey) reusableCatalogSnapshots.delete(snapshotKey);
	}
}
/** Restricts a run-scoped catalog to an already-resolved set of concrete tool names. */
function restrictToolSearchCatalog(params) {
	const current = params.catalogRef?.current;
	if (!current) return 0;
	const entries = (params.baselineEntries ?? current.entries).filter((entry) => params.allowedToolNames.has(entry.name));
	if (entries.length === current.entries.length && entries.every((entry, index) => entry === current.entries[index])) return entries.length;
	current.entries = entries;
	catalogFingerprints.set(current, catalogEntriesFingerprint(entries));
	return entries.length;
}
function resolveCatalog(ctx) {
	const catalog = ctx.catalogRef?.current;
	if (!catalog) throw new ToolInputError("Tool Search catalog is unavailable for this run.");
	return catalog;
}
function visibleCatalogEntries(catalog, options) {
	return options?.includeMcp === false ? catalog.entries.filter((entry) => entry.source !== "mcp") : catalog.entries;
}
function compactToolSearchCatalogEntry(entry) {
	const output = entry.source === "openclaw" ? compactToolOutputHint(entry.outputSchema) : void 0;
	const mcp = entry.mcp ? {
		serverName: entry.mcp.serverName,
		safeServerName: entry.mcp.safeServerName,
		toolName: entry.mcp.toolName,
		operation: entry.mcp.operation
	} : void 0;
	return {
		id: entry.id,
		source: entry.source,
		sourceName: entry.sourceName,
		...mcp ? { mcp } : {},
		name: entry.name,
		label: entry.label,
		description: entry.description,
		input: entry.source === "openclaw" ? compactToolInputHint(entry.parameters) : "unknown",
		...output ? { output } : {}
	};
}
function createToolSearchCatalogRef() {
	return {};
}
function applyToolCatalogCompaction(params) {
	if (!params.enabled) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const hasControlTool = params.tools.some((tool) => params.isVisibleControlTool(tool));
	const catalogRef = params.catalogRef;
	if (!hasControlTool || !catalogRef) return {
		tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const visible = [];
	const catalog = [];
	const shouldCatalog = (tool) => shouldCatalogTool(tool) && (params.shouldCatalogTool?.(tool) ?? true);
	for (const tool of params.tools) {
		if (params.isVisibleControlTool(tool)) {
			visible.push(tool);
			continue;
		}
		if (TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)) continue;
		if (shouldCatalog(tool)) {
			catalog.push(toCatalogEntry(tool, void 0, params.toolHookContext));
			if (!params.isVisibleCatalogTool?.(tool)) continue;
		}
		visible.push(tool);
	}
	const incomingFingerprint = catalogEntriesFingerprint(catalog);
	const existingCatalog = catalogRef.current;
	if (existingCatalog && catalogFingerprints.get(existingCatalog) === incomingFingerprint) return {
		tools: visible,
		compacted: catalog.length > 0,
		catalogToolCount: catalog.length,
		catalogRegistered: true,
		catalogReused: true
	};
	const reusableKey = catalog.some((entry) => isToolWrappedWithBeforeToolCallHook(entry.tool)) ? void 0 : reusableCatalogKey(params);
	const reusableSnapshot = reusableKey ? reusableCatalogSnapshots.get(reusableKey) : void 0;
	if (reusableSnapshot?.fingerprint === incomingFingerprint) {
		restoreToolSearchCatalog({
			catalogRef,
			entries: reusableSnapshot.entries,
			fingerprint: reusableSnapshot.fingerprint
		});
		if (reusableKey) {
			reusableCatalogSnapshots.delete(reusableKey);
			reusableCatalogSnapshots.set(reusableKey, reusableSnapshot);
		}
		return {
			tools: visible,
			compacted: catalog.length > 0,
			catalogToolCount: catalog.length,
			catalogRegistered: true,
			catalogReused: true
		};
	}
	rememberReusableCatalog(reusableKey, registerToolSearchCatalog({
		catalogRef,
		entries: catalog
	}));
	return {
		tools: visible,
		compacted: catalog.length > 0,
		catalogToolCount: catalog.length,
		catalogRegistered: true,
		catalogReused: false
	};
}
function addClientToolsToToolCatalog(params) {
	const catalogRef = params.catalogRef;
	if (!params.enabled || !catalogRef?.current) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0
	};
	registerToolSearchCatalog({
		catalogRef,
		entries: params.tools.map((tool) => toCatalogEntry(tool, "client")),
		append: true
	});
	return {
		tools: [],
		compacted: params.tools.length > 0,
		catalogToolCount: params.tools.length
	};
}
//#endregion
//#region src/agents/tool-search-code-mode-child.ts
const TOOL_SEARCH_CODE_MODE_CHILD_SOURCE = String.raw`
import vm from "node:vm";

let activeController;

function send(message) {
  if (typeof process.send === "function" && process.connected) {
    process.send(message);
  }
}

function sendAndFlush(message) {
  return new Promise((resolve) => {
    if (typeof process.send !== "function" || !process.connected) {
      resolve();
      return;
    }
    try {
      process.send(message, () => resolve());
    } catch {
      resolve();
    }
  });
}

function toJsonSafe(value) {
  if (value === undefined) {
    return null;
  }
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    if (value instanceof Error) {
      return value.message;
    }
    if (value === null) {
      return null;
    }
    switch (typeof value) {
      case "string":
        return value;
      case "number":
      case "boolean":
      case "bigint":
      case "symbol":
      case "function":
        return String(value);
      default:
        return Object.prototype.toString.call(value);
    }
  }
}

function formatLogItem(value) {
  if (typeof value === "string") {
    return value;
  }
  const safe = toJsonSafe(value);
  return typeof safe === "string" ? safe : JSON.stringify(safe);
}

function bridgeResultPayload(message) {
  if (!message.ok) {
    return typeof message.error === "string" ? message.error : "tool bridge failed";
  }
  const json = JSON.stringify(toJsonSafe(message.value));
  return typeof json === "string" ? json : "null";
}

function settleBridge(message) {
  if (!activeController) {
    return;
  }
  const id = typeof message?.id === "string" ? message.id : "";
  try {
    activeController.settleBridge(id, Boolean(message.ok), bridgeResultPayload(message));
  } catch (error) {
    send({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function buildModelScriptSource(code) {
  return "(async (openclaw, console) => {\n" + code + "\n})(openclaw, console)";
}

function buildControllerSource() {
  // The controller returns promise-like bridge handles. The model code can await
  // them naturally, while the parent process serializes real tool calls.
  return (
    '"use strict";\n' +
    "(() => {\n" +
    "const pending = new Map();\n" +
    "const bridgeMessages = [];\n" +
    "const logs = [];\n" +
    "let idleWaiters = [];\n" +
    "let nextBridgeId = 1;\n" +
    toJsonSafe.toString() +
    "\n" +
    formatLogItem.toString() +
    "\n" +
    "function notifyBridgeIdle() {\n" +
    "  if (pending.size !== 0 || bridgeMessages.length !== 0) return;\n" +
    "  const waiters = idleWaiters;\n" +
    "  idleWaiters = [];\n" +
    "  for (const resolve of waiters) resolve();\n" +
    "}\n" +
    "function isBridgeIdle() {\n" +
    "  return pending.size === 0 && bridgeMessages.length === 0;\n" +
    "}\n" +
    "function waitForBridgeIdle() {\n" +
    "  if (isBridgeIdle()) return Promise.resolve();\n" +
    "  return new Promise((resolve) => idleWaiters.push(resolve));\n" +
    "}\n" +
    "function bridge(method, args) {\n" +
    "  let promise;\n" +
    "  const start = () => {\n" +
    "    if (!promise) {\n" +
    "      const id = String(nextBridgeId++);\n" +
    "      promise = new Promise((resolve, reject) => {\n" +
    "        pending.set(id, { resolve, reject });\n" +
    "        bridgeMessages.push({ id, method, args: toJsonSafe(args) });\n" +
    "      });\n" +
    "    }\n" +
    "    return promise;\n" +
    "  };\n" +
    "  return Object.freeze({\n" +
    "    then: (resolve, reject) => start().then(resolve, reject),\n" +
    "    catch: (reject) => start().catch(reject),\n" +
    "    finally: (onFinally) => start().finally(onFinally),\n" +
    "  });\n" +
    "}\n" +
    "const console = Object.freeze({\n" +
    "  log: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  warn: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "  error: (...items) => logs.push(items.map(formatLogItem)),\n" +
    "});\n" +
    "const openclaw = Object.freeze({\n" +
    "  tools: Object.freeze({\n" +
    "    search: (query, options) => bridge('search', [query, options]),\n" +
    "    describe: (id) => bridge('describe', [id]),\n" +
    "    call: (id, input) => bridge('call', [id, input]),\n" +
    "  }),\n" +
    "});\n" +
    "return Object.freeze({\n" +
    "  openclaw,\n" +
    "  console,\n" +
    "  isBridgeIdle,\n" +
    "  waitForBridgeIdle,\n" +
    "  takeLogs: () => logs.splice(0),\n" +
    "  takeBridgeMessages: () => bridgeMessages.splice(0),\n" +
    "  settleBridge: (id, ok, payload) => {\n" +
    "    const waiter = pending.get(String(id));\n" +
    "    if (!waiter) return;\n" +
    "    pending.delete(String(id));\n" +
    "    if (ok) {\n" +
    "      waiter.resolve(JSON.parse(String(payload)));\n" +
    "    } else {\n" +
    "      waiter.reject(new Error(String(payload)));\n" +
    "    }\n" +
    "    Promise.resolve().then(notifyBridgeIdle);\n" +
    "  },\n" +
    "});\n" +
    "})()"
  );
}

function pumpController(controller) {
  for (const items of controller.takeLogs()) {
    send({ type: "log", items });
  }
  for (const message of controller.takeBridgeMessages()) {
    send({ type: "bridge", id: message.id, method: message.method, args: message.args });
  }
}

async function runModelCode(code, timeoutMs) {
  const sandbox = Object.create(null);
  const context = vm.createContext(sandbox, {
    name: "tool_search_code",
    codeGeneration: { strings: false, wasm: false },
  });
  const controllerScript = new vm.Script(buildControllerSource(), {
    filename: "tool_search_code:controller.js",
  });
  const controller = controllerScript.runInContext(context, {
    timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
    breakOnSigint: false,
  });
  Object.defineProperties(sandbox, {
    console: { value: controller.console, enumerable: true },
    openclaw: { value: controller.openclaw, enumerable: true },
  });
  activeController = controller;
  const pumpTimer = setInterval(() => pumpController(controller), 1);
  try {
    const modelScript = new vm.Script(buildModelScriptSource(code), {
      filename: "tool_search_code:model.js",
    });
    const result = await Promise.resolve(
      modelScript.runInContext(context, {
        timeout: Math.max(1, Math.min(Number(timeoutMs) || 1, 2147483647)),
        breakOnSigint: false,
      }),
    ).then(
      (value) => ({ ok: true, value: toJsonSafe(value) }),
      (error) => ({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
    do {
      pumpController(controller);
      await controller.waitForBridgeIdle();
      pumpController(controller);
    } while (!controller.isBridgeIdle());
    pumpController(controller);
    await sendAndFlush(
      result.ok
        ? { type: "result", ok: true, value: result.value }
        : { type: "result", ok: false, error: result.error },
    );
  } finally {
    clearInterval(pumpTimer);
    activeController = undefined;
  }
}

process.on("message", (message) => {
  if (message?.type === "bridge-result") {
    settleBridge(message);
    return;
  }
  if (message?.type !== "run") {
    return;
  }
  const code = typeof message.code === "string" ? message.code : "";
  runModelCode(code, message.timeoutMs).catch((error) => {
    return sendAndFlush({
      type: "result",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    });
  }).finally(() => {
    setTimeout(() => process.exit(0), 100);
  });
});
`;
//#endregion
//#region src/agents/tool-search-json.ts
/** Convert bridge and transcript values into detached JSON-compatible data. */
function toToolSearchJsonSafe(value) {
	if (value === void 0) return null;
	try {
		const serialized = JSON.stringify(value);
		return serialized === void 0 ? null : JSON.parse(serialized);
	} catch {
		if (value instanceof Error) return value.message;
		if (value === null) return null;
		switch (typeof value) {
			case "string": return value;
			case "number":
			case "boolean":
			case "bigint":
			case "symbol":
			case "function": return String(value);
			default: return Object.prototype.toString.call(value);
		}
	}
}
//#endregion
//#region src/agents/tool-search-input-arguments.ts
/**
* Generic `tool_call` wrappers carry no target schema, so some providers serialize
* nested arrays as XML-style `{item: ...}` wrappers and string-quote scalar numbers
* before the target tool's own schema is applied. Both rewrites happen only where
* the target schema explicitly declares the matching shape (array, number, or
* integer), so every other value still reaches fail-closed validation exactly as
* the model sent it. Native numbers and objects stay untouched; noncanonical
* strings fail through to the validator instead of being silently coerced.
*/
/** Model arguments are small; a bounded walk keeps hostile-shaped input cheap. */
const MAX_SCHEMA_DEPTH = 12;
/** Observed transcripts nest the wrapper more than once (`{item:{item:[...]}}`). */
const MAX_ITEM_UNWRAPS = 4;
/**
* Canonical JSON-number grammar (RFC 8259 §6): optional `-`, integer (`0` or
* non-zero digit + digits), optional fraction, optional exponent. Leading-zero
* ints, hex, plus sign, `Infinity`, `NaN`, and whitespace all fail to match, so
* combined with `Number.isFinite`/`Number.isSafeInteger` no noncanonical input
* survives coercion.
*/
const CANONICAL_JSON_NUMBER = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?$/;
/** Only a single-key `item` object is an unambiguous wrapper; anything else is data. */
function readXmlItemWrapper(value) {
	if (!isRecord(value)) return;
	const keys = Object.keys(value);
	return keys.length === 1 && keys[0] === "item" ? { wrapped: value.item } : void 0;
}
function schemaMatchesType(schema, typeName) {
	const type = schema.type;
	return type === typeName || Array.isArray(type) && type.includes(typeName);
}
function schemaExpectsArray(schema) {
	return schemaMatchesType(schema, "array");
}
/**
* An element schema that itself declares an `item` property makes `{item: ...}`
* a plausible single element, so the wrapper reading is ambiguous and skipped.
*/
function elementSchemaDeclaresItem(items) {
	return isRecord(items) && isRecord(items.properties) && Object.hasOwn(items.properties, "item");
}
function normalizeArrayLocation(value, schema, depth) {
	const items = schema.items;
	let unwrapped = value;
	if (!Array.isArray(unwrapped) && !elementSchemaDeclaresItem(items)) {
		for (let unwraps = 0; unwraps < MAX_ITEM_UNWRAPS; unwraps += 1) {
			const wrapper = readXmlItemWrapper(unwrapped);
			if (!wrapper) break;
			unwrapped = wrapper.wrapped;
			if (Array.isArray(unwrapped)) break;
		}
		if (unwrapped !== value) unwrapped = Array.isArray(unwrapped) ? unwrapped : [unwrapped];
	}
	if (!Array.isArray(unwrapped) || !isRecord(items)) return unwrapped;
	let changed = unwrapped !== value;
	const normalized = unwrapped.map((element) => {
		const normalizedElement = normalizeToolSearchTargetInput(element, items, depth + 1);
		changed ||= normalizedElement !== element;
		return normalizedElement;
	});
	return changed ? normalized : value;
}
/**
* Returns the parsed number when `value` is a canonical JSON-number string and
* the schema demands a number/integer at this exact location, otherwise returns
* `value` unchanged. Integer additionally requires `Number.isSafeInteger`; no
* values are truncated or rounded. Noncanonical strings fall through, leaving
* the target validator to reject them.
*/
function coerceNumericStringAtSchema(value, schema) {
	if (typeof value !== "string") return value;
	const wantsInteger = schemaMatchesType(schema, "integer");
	if (!wantsInteger && !schemaMatchesType(schema, "number")) return value;
	if (!CANONICAL_JSON_NUMBER.test(value)) return value;
	const parsed = Number(value);
	if (wantsInteger) return Number.isSafeInteger(parsed) ? parsed : value;
	return Number.isFinite(parsed) ? parsed : value;
}
/**
* Returns the input with unambiguous XML-style array wrappers removed at the
* locations the target schema declares as arrays, plus canonical JSON-number
* strings coerced to numbers where the schema declares number/integer. The
* original value is returned unchanged when nothing was rewritten, so callers
* keep object identity and validators still see the model input on rejection.
*/
function normalizeToolSearchTargetInput(value, schema, depth = 0) {
	if (depth >= MAX_SCHEMA_DEPTH || !isRecord(schema)) return value;
	if (schemaExpectsArray(schema)) return normalizeArrayLocation(value, schema, depth);
	const coerced = coerceNumericStringAtSchema(value, schema);
	if (coerced !== value) return coerced;
	const properties = schema.properties;
	if (!isRecord(value) || Array.isArray(value) || !isRecord(properties)) return value;
	let changed = false;
	const normalized = {};
	for (const [key, child] of Object.entries(value)) {
		const childSchema = Object.hasOwn(properties, key) ? properties[key] : void 0;
		const normalizedChild = childSchema === void 0 ? child : normalizeToolSearchTargetInput(child, childSchema, depth + 1);
		normalized[key] = normalizedChild;
		changed ||= normalizedChild !== child;
	}
	return changed ? normalized : value;
}
//#endregion
//#region src/agents/tool-search-ranking.ts
/** BM25 term-frequency saturation. Standard Okapi default. */
const BM25_K1 = 1.2;
/** BM25 length normalization. Standard Okapi default. */
const BM25_B = .75;
/**
* Terms carrying no discriminating signal in a tool catalog. IDF already damps
* these; dropping them keeps a query like "read a file and post it" from
* scoring on "a"/"it" when a tool description happens to repeat them.
*
* Capability verbs stay out of this list even when they look like filler:
* "get" names real operations ("get_weather"), and discarding it would reduce
* "get issue" to "issue" and let a shorter delete/update entry outrank it.
*/
const STOPWORDS = /* @__PURE__ */ new Set([
	"a",
	"an",
	"and",
	"are",
	"as",
	"at",
	"be",
	"but",
	"by",
	"can",
	"do",
	"for",
	"from",
	"had",
	"has",
	"have",
	"here",
	"how",
	"i",
	"if",
	"in",
	"into",
	"is",
	"it",
	"its",
	"me",
	"my",
	"no",
	"not",
	"of",
	"on",
	"or",
	"our",
	"so",
	"that",
	"the",
	"their",
	"them",
	"then",
	"there",
	"these",
	"they",
	"this",
	"to",
	"up",
	"us",
	"was",
	"we",
	"were",
	"what",
	"when",
	"where",
	"which",
	"who",
	"why",
	"will",
	"with",
	"you",
	"your"
]);
/**
* Query vocabulary mapped to the capability words tool descriptions actually
* use. This bridges intent to wording ("look up the price" -> "search"), which
* pure lexical overlap cannot do.
*
* Values must stay generic capability terms. Never put plugin, vendor, or
* product names here: those break silently when a plugin is renamed, and a
* catalog is not required to contain any particular provider.
*/
const QUERY_EXPANSIONS = [
	{
		terms: [
			"look",
			"lookup",
			"google",
			"research"
		],
		add: [
			"search",
			"web",
			"find"
		]
	},
	{
		terms: [
			"current",
			"today",
			"latest",
			"now",
			"recent",
			"news",
			"price",
			"weather"
		],
		add: ["search", "web"]
	},
	{
		terms: [
			"url",
			"link",
			"page",
			"article",
			"site",
			"website"
		],
		add: [
			"fetch",
			"web",
			"browse"
		]
	},
	{
		terms: [
			"remember",
			"recall",
			"memory",
			"earlier",
			"previously",
			"discussed",
			"decided"
		],
		add: [
			"memory",
			"recall",
			"history"
		]
	},
	{
		terms: [
			"remind",
			"reminder",
			"later",
			"tomorrow",
			"daily",
			"weekly",
			"recurring"
		],
		add: [
			"schedule",
			"automations",
			"cron",
			"reminder"
		]
	},
	{
		terms: [
			"say",
			"tell",
			"reply",
			"respond",
			"answer"
		],
		add: ["message", "send"]
	},
	{
		terms: [
			"picture",
			"photo",
			"meme",
			"screenshot"
		],
		add: ["image"]
	},
	{
		terms: [
			"speak",
			"say",
			"voice"
		],
		add: ["audio", "speech"]
	},
	{
		terms: [
			"run",
			"execute",
			"command",
			"shell",
			"terminal"
		],
		add: ["exec", "process"]
	},
	{
		terms: [
			"directory",
			"folder",
			"path"
		],
		add: ["file", "list"]
	}
];
/**
* Light English suffix stripper. Not a full Porter stemmer: it exists so that
* "scheduling" reaches a tool described as "Schedule a recurring task", which
* exact-token matching misses entirely. Applied repeatedly so plural verb forms
* ("reminders" -> "reminder" -> "remind") collapse to one root.
*/
function stem(token) {
	let current = token;
	for (let pass = 0; pass < 3; pass += 1) {
		const next = stripOneSuffix(current);
		if (next === current) return current;
		current = next;
	}
	return current;
}
/**
* Words ending in `s` that are not plurals. Stripping it changes the meaning and
* collides with an unrelated root: "news" would become "new" and then literal-
* match every "Create a new ..." tool, outranking the search tool the query
* meant. Several are ordinary tool vocabulary here ("status", "canvas", "alias").
*/
const NON_PLURAL_S_WORDS = /* @__PURE__ */ new Set([
	"news",
	"status",
	"alias",
	"canvas",
	"focus",
	"bonus",
	"virus",
	"atlas",
	"lens",
	"axis",
	"basis",
	"analysis",
	"gas",
	"bus",
	"plus"
]);
/** Suffixes whose stripping can expose a consonant doubled only by inflection. */
const UNDOUBLING_SUFFIXES = /* @__PURE__ */ new Set([
	"ing",
	"ed",
	"er"
]);
/** Doubles that belong to the root ("call", "process", "off", "buzz"). */
const KEPT_DOUBLE_CONSONANTS = /* @__PURE__ */ new Set([
	"l",
	"s",
	"f",
	"z"
]);
/**
* "running" strips to "runn", which would never meet "run". English doubles the
* final consonant before these suffixes, so undo that — otherwise the stemmer
* makes common pairs (run/running, stop/stopping, log/logging) unreachable, a
* regression the old substring scorer did not have.
*/
function undoubleFinalConsonant(token) {
	const last = token.at(-1);
	if (!last || last !== token.at(-2) || KEPT_DOUBLE_CONSONANTS.has(last) || "aeiou".includes(last) || token.length <= 3) return token;
	return token.slice(0, -1);
}
function stripOneSuffix(token) {
	if (token.length <= 3 || NON_PLURAL_S_WORDS.has(token)) return token;
	for (const suffix of [
		"ies",
		"ing",
		"ed",
		"ly",
		"es",
		"er",
		"s",
		"e"
	]) {
		if (!token.endsWith(suffix) || token.length - suffix.length < 3) continue;
		if (suffix === "s" && token.endsWith("ss")) continue;
		if (suffix === "ies") return `${token.slice(0, -3)}y`;
		const stripped = token.slice(0, -suffix.length);
		return UNDOUBLING_SUFFIXES.has(suffix) ? undoubleFinalConsonant(stripped) : stripped;
	}
	return token;
}
/**
* Word parts inside a compound identifier, matched rather than split so an
* acronym stays whole. Splitting on case transitions cuts "URLs" into "UR"/"Ls"
* and makes the obvious query unable to reach the tool; the first alternative
* keeps a run of capitals together, including a trailing plural `s`.
*/
const WORD_PARTS = /\p{Lu}+s?(?![\p{Ll}])|\p{Lu}?\p{Ll}+|\p{N}+/gu;
/**
* Splits on anything that is not a word character, which keeps `_`-joined tool
* names addressable as whole tokens while still emitting their parts, including
* camelCase components that MCP catalogs commonly use.
*
* Unicode letters survive rather than being rejected: a catalog is allowed to
* name or describe tools in another script, and dropping those would make them
* permanently unreachable. What makes non-English queries fruitless in practice
* is that catalogs are written in English, which is why `tool_search` asks the
* model to query in English rather than this function refusing the input.
*/
function splitWords(input) {
	const words = [];
	for (const raw of input.split(/[^\p{L}\p{N}_]+/u)) {
		if (!raw) continue;
		words.push(raw.toLowerCase());
		const parts = [];
		for (const underscorePart of raw.split("_")) for (const casePart of underscorePart.match(WORD_PARTS) ?? []) parts.push(casePart.toLowerCase());
		if (parts.length < 2) continue;
		for (const part of parts) words.push(part);
	}
	return words;
}
/**
* Stems for one word. `-ies` is ambiguous — "policies" is "policy" but "cookies"
* is "cookie" — so both readings are emitted and whichever the catalog actually
* uses will match. Every other word has a single stem.
*/
function stemVariants(word) {
	if (word.length > 4 && word.endsWith("ies")) {
		const base = word.slice(0, -3);
		return [`${base}y`, stem(`${base}ie`)];
	}
	const stemmed = stem(word);
	return stemmed ? [stemmed] : [];
}
/** Indexable terms for one document, with stopwords dropped and roots collapsed. */
function tokenizeDocument(input) {
	return splitWords(input).filter((word) => !STOPWORDS.has(word)).flatMap(stemVariants).filter(Boolean);
}
/**
* Triggers are matched on a singularized word rather than the document stemmer.
* Full stemming collapses unrelated vocabulary — "news" becomes "new", so "open
* a new issue" would silently acquire a web-search intent — and an expansion
* that fires on the wrong word is worse than one that does not fire.
*/
function normalizeTrigger(word) {
	if (word.length > 4 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
	return word.length > 4 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
}
const NORMALIZED_EXPANSIONS = QUERY_EXPANSIONS.map((group) => ({
	triggers: new Set(group.terms.map(normalizeTrigger)),
	add: group.add.map(stem)
}));
/**
* Weight for a term the caller did not write. Expansions are a hint about what
* the catalog might call this capability, so they must not let a merely related
* tool outscore one that matches the words actually typed.
*/
const EXPANSION_WEIGHT = .35;
/** Query terms: literal words at full weight, expansions discounted. */
function tokenizeQuery(input) {
	const words = splitWords(input).filter((word) => !STOPWORDS.has(word));
	const weights = /* @__PURE__ */ new Map();
	for (const term of words.flatMap(stemVariants).filter(Boolean)) weights.set(term, 1);
	const triggers = new Set(words.map(normalizeTrigger));
	for (const group of NORMALIZED_EXPANSIONS) {
		if (![...group.triggers].some((trigger) => triggers.has(trigger))) continue;
		for (const addition of group.add) weights.set(addition, Math.max(weights.get(addition) ?? 0, EXPANSION_WEIGHT));
	}
	return [...weights].map(([term, weight]) => ({
		term,
		weight
	}));
}
function buildLexicalIndex(documents) {
	const documentFrequency = /* @__PURE__ */ new Map();
	const prepared = documents.map((document) => {
		const termCounts = /* @__PURE__ */ new Map();
		for (const term of document.terms) termCounts.set(term, (termCounts.get(term) ?? 0) + 1);
		for (const term of termCounts.keys()) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
		return {
			value: document.value,
			termCounts,
			length: document.terms.length
		};
	});
	const totalLength = prepared.reduce((sum, document) => sum + document.length, 0);
	return {
		documents: prepared,
		documentFrequency,
		averageLength: prepared.length > 0 ? totalLength / prepared.length : 0
	};
}
/**
* Okapi BM25. Ranks by how well a document matches the query terms, damping
* terms that appear across most of the catalog and normalizing for description
* length so a verbose tool does not outrank a precise one.
*
* An empty query scores nothing on purpose: returning the whole catalog in
* arbitrary order would look like a ranked answer without being one.
*
* `matchedLiteral` reports whether a hit shares any word the caller actually
* typed. Callers rank on it first: discounting expansions is not sufficient on
* its own, because BM25 sums per term and a common literal term carries little
* IDF, so a short document collecting two rare expansions can still outscore it.
*/
function scoreLexical(index, queryTerms) {
	if (queryTerms.length === 0 || index.documents.length === 0) return [];
	const total = index.documents.length;
	const results = [];
	for (const document of index.documents) {
		let score = 0;
		let matchedLiteral = false;
		for (const { term, weight } of queryTerms) {
			const frequency = document.termCounts.get(term);
			if (!frequency) continue;
			if (weight >= 1) matchedLiteral = true;
			const matching = index.documentFrequency.get(term) ?? 0;
			const idf = Math.log(1 + (total - matching + .5) / (matching + .5));
			const normalized = index.averageLength > 0 ? document.length / index.averageLength : 1;
			score += weight * (idf * (frequency * 2.2)) / (frequency + BM25_K1 * (1 - BM25_B + BM25_B * normalized));
		}
		if (score > 0) results.push({
			value: document.value,
			score,
			matchedLiteral
		});
	}
	return results;
}
//#endregion
//#region src/agents/tool-search-request.ts
function readToolSearchLimit(value, config) {
	if (value === void 0) return config.searchDefaultLimit;
	if (typeof value !== "number" || !Number.isInteger(value) || value < 1) throw new ToolInputError("limit must be a positive integer.");
	return Math.min(value, config.maxSearchLimit);
}
function readBatchToolSearchQuery(value, field, maxGraphemes) {
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError(`${field} must be a non-empty string.`);
	const query = value.trim();
	if (maxGraphemes !== void 0 && !Guard.IsMaxLength(query, maxGraphemes)) throw new ToolInputError(`${field} must not exceed ${maxGraphemes} characters.`);
	return query;
}
function readToolSearchArgs(args, config) {
	const params = asToolParamsRecord(args);
	const query = params.query;
	if (typeof query !== "string") throw new ToolInputError("query must be a string.");
	const options = isRecord(params.options) ? params.options : void 0;
	return {
		query,
		limit: readToolSearchLimit(params.limit ?? options?.limit, config)
	};
}
function readToolSearchRequest(args, config) {
	const params = asToolParamsRecord(args);
	const hasQuery = params.query !== void 0;
	if (hasQuery === (params.queries !== void 0)) throw new ToolInputError("provide exactly one of query or queries.");
	if (hasQuery) return {
		kind: "single",
		search: readToolSearchArgs(params, config)
	};
	if (params.limit !== void 0 || params.options !== void 0) throw new ToolInputError("set limit on each batch query, not on the batch request.");
	if (!Array.isArray(params.queries) || params.queries.length === 0) throw new ToolInputError("queries must be a non-empty array.");
	if (params.queries.length > 16) throw new ToolInputError(`queries may contain at most 16 entries.`);
	const searches = params.queries.map((value, index) => {
		if (!isRecord(value)) throw new ToolInputError(`queries[${index}] must be an object.`);
		const query = readBatchToolSearchQuery(value.query, `queries[${index}].query`, 512);
		try {
			return {
				query,
				limit: readToolSearchLimit(value.limit, config)
			};
		} catch (error) {
			if (error instanceof ToolInputError) throw new ToolInputError(`queries[${index}].${error.message}`);
			throw error;
		}
	});
	const requestedResults = searches.reduce((total, search) => total + search.limit, 0);
	if (requestedResults > 50) throw new ToolInputError(`batch queries resolve to ${requestedResults} results, but may request at most 50 in total. An omitted limit counts as ${config.searchDefaultLimit}; set smaller per-query limits and retry.`);
	const serializedQueries = JSON.stringify(searches.map((search) => search.query));
	if (new TextEncoder().encode(serializedQueries).byteLength > 512) throw new ToolInputError(`serialized batch query text may use at most 512 UTF-8 bytes.`);
	return {
		kind: "batch",
		searches
	};
}
//#endregion
//#region src/agents/tool-search-transcript.ts
function readMessageToolResultId(message) {
	const record = message;
	const role = typeof record.role === "string" ? record.role : "";
	const canUseDirectId = role === "toolResult" || role === "tool";
	const direct = record.toolCallId ?? record.toolUseId ?? record.tool_use_id;
	if (canUseDirectId && typeof direct === "string" && direct.trim()) return direct;
	const content = record.content;
	if (!Array.isArray(content)) return;
	for (const block of content) {
		if (!isRecord(block) || block.type !== "toolResult") continue;
		const nested = block.toolCallId ?? block.toolUseId ?? block.tool_use_id ?? block.id;
		if (typeof nested === "string" && nested.trim()) return nested;
	}
}
function textFromToolSearchProjectionResult(result, isError) {
	if (isRecord(result)) {
		const detailError = (isRecord(result.details) ? result.details : void 0)?.error;
		if (typeof detailError === "string" && detailError.trim()) return detailError;
		const content = result.content;
		if (Array.isArray(content)) {
			const text = content.map((item) => isRecord(item) && typeof item.text === "string" ? item.text : "").filter(Boolean).join("\n");
			if (text.trim()) return text;
		}
	}
	const safe = toToolSearchJsonSafe(result);
	if (typeof safe === "string") return safe;
	const encoded = JSON.stringify(safe);
	if (typeof encoded === "string") return encoded;
	return isError ? "Tool Search target tool failed." : "Tool Search target tool completed.";
}
function buildToolSearchTargetTranscriptMessages(projection) {
	const input = toToolSearchJsonSafe(projection.input);
	const timestamp = projection.timestamp ?? Date.now();
	const resultRecord = isRecord(projection.result) ? projection.result : void 0;
	const resultContent = Array.isArray(resultRecord?.content) && resultRecord.content.length > 0 ? toToolSearchJsonSafe(resultRecord.content) : [{
		type: "text",
		text: textFromToolSearchProjectionResult(projection.result, projection.isError)
	}];
	return [{
		role: "assistant",
		content: [{
			type: "toolCall",
			id: projection.toolCallId,
			name: projection.toolName,
			arguments: input,
			input
		}],
		stopReason: "toolUse",
		timestamp
	}, {
		role: "toolResult",
		toolCallId: projection.toolCallId,
		toolName: projection.toolName,
		isError: projection.isError,
		content: resultContent,
		timestamp
	}];
}
function projectToolSearchTargetTranscriptMessages(messages, projections) {
	if (projections.length === 0) return messages;
	const byParent = /* @__PURE__ */ new Map();
	const unmatched = [];
	for (const projection of projections) {
		const parent = projection.parentToolCallId?.trim();
		if (!parent) {
			unmatched.push(projection);
			continue;
		}
		const group = byParent.get(parent) ?? [];
		group.push(projection);
		byParent.set(parent, group);
	}
	const inserted = /* @__PURE__ */ new Set();
	const projected = [];
	for (const message of messages) {
		projected.push(message);
		const toolResultId = readMessageToolResultId(message);
		const group = toolResultId ? byParent.get(toolResultId) : void 0;
		if (!group) continue;
		for (const projection of group) {
			projected.push(...buildToolSearchTargetTranscriptMessages(projection));
			inserted.add(projection);
		}
	}
	for (const projection of [...unmatched, ...projections]) {
		if (inserted.has(projection)) continue;
		projected.push(...buildToolSearchTargetTranscriptMessages(projection));
		inserted.add(projection);
	}
	return projected;
}
function freezeJsonSnapshot(value) {
	if (value === null || typeof value !== "object") return value;
	for (const nested of Object.values(value)) freezeJsonSnapshot(nested);
	return Object.freeze(value);
}
/** Capture a stable JSON-safe result before delayed transcript settlement. */
function snapshotToolSearchTargetTranscriptResult(result) {
	const hasDetails = "details" in result;
	const snapshot = toToolSearchJsonSafe(result);
	if (!isRecord(snapshot)) throw new Error("Tool Search target result could not be captured for transcript projection.");
	if (hasDetails && !("details" in snapshot)) snapshot.details = result.details === void 0 ? void 0 : toToolSearchJsonSafe(result.details);
	return freezeJsonSnapshot(snapshot);
}
//#endregion
//#region src/agents/tool-search-runtime.ts
function describeEntry(entry) {
	return {
		...compactToolSearchCatalogEntry(entry),
		parameters: entry.parameters ?? {},
		...entry.outputSchema ? { outputSchema: entry.outputSchema } : {}
	};
}
/**
* Text indexed for one catalog entry. Parameter names and their descriptions are
* included because they often carry the only words a task shares with a tool:
* "post a message to a channel" reaches a tool whose description says only
* "Send a message" through its `channel` parameter. Codex and the Claude API
* tool-search tools index argument metadata for the same reason.
*/
function toolSearchEntryText(entry, parameterText) {
	const parameters = parameterText ?? (entry.source === "openclaw" ? readParameterText(entry.parameters) : "");
	return [
		entry.name,
		entry.id,
		entry.label ?? "",
		entry.description,
		parameters
	].filter(Boolean).join(" ");
}
/** Collects property names and descriptions from a JSON-Schema-shaped value. */
function readParameterText(parameters, depth = 0) {
	if (depth > 4 || !isRecord(parameters)) return "";
	const parts = [];
	const description = parameters.description;
	if (typeof description === "string") parts.push(description);
	const properties = parameters.properties;
	if (isRecord(properties)) for (const [name, child] of Object.entries(properties)) {
		parts.push(name);
		parts.push(readParameterText(child, depth + 1));
	}
	const items = parameters.items;
	if (items !== void 0) parts.push(readParameterText(items, depth + 1));
	return parts.filter(Boolean).join(" ");
}
function tokenizeLookupValue(input) {
	return new Set(normalizeStringEntries(input.toLowerCase().split(/[^a-z0-9]+/u)));
}
function scoreUnknownToolSuggestion(needle, entry) {
	const normalizedNeedle = needle.toLowerCase();
	const name = entry.name.toLowerCase();
	const id = entry.id.toLowerCase();
	const label = (entry.label ?? "").toLowerCase();
	const description = entry.description.toLowerCase();
	const needleTokens = tokenizeLookupValue(needle);
	const entryTokens = tokenizeLookupValue(`${entry.name} ${entry.id} ${entry.label ?? ""} ${entry.description}`);
	let score = 0;
	if (name && normalizedNeedle.includes(name) || id.includes(normalizedNeedle)) score += 40;
	if (name && needleTokens.has(name)) score += 40;
	for (const token of needleTokens) if (entryTokens.has(token)) score += 12;
	if (label.includes(normalizedNeedle) || description.includes(normalizedNeedle)) score += 8;
	return score;
}
function formatUnknownToolIdError(needle, entries, options = {}) {
	const nameCounts = /* @__PURE__ */ new Map();
	for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
	const suggestions = uniqueStrings(entries.map((entry) => ({
		value: options.exactIdOnly || (nameCounts.get(entry.name) ?? 0) > 1 ? entry.id : entry.name,
		score: scoreUnknownToolSuggestion(needle, entry)
	})).filter((candidate) => candidate.score > 0).toSorted((a, b) => b.score - a.score || a.value.localeCompare(b.value)).map((candidate) => candidate.value)).slice(0, 3);
	const recoveryText = options.recoverySurface === "code-mode" ? "Use openclaw.tools.search to find a tool, openclaw.tools.describe to inspect it, then openclaw.tools.call with the exact id or name." : options.recoverySurface === "tools" ? "Use tools.search to find a tool, tools.describe to inspect it, then tools.call with the exact id or name." : "Use tool_search to find a tool, tool_describe to inspect it, then tool_call with the exact id or name.";
	if (suggestions.length === 0) return `Unknown tool id: ${needle}. ${recoveryText}`;
	return `Unknown tool id: ${needle}. Did you mean: ${suggestions.join(", ")}? ${recoveryText}`;
}
function findEntry(catalog, id, options, errorOptions) {
	const needle = id.trim();
	const entries = visibleCatalogEntries(catalog, options);
	const exactIdEntry = entries.find((candidate) => candidate.id === needle);
	if (exactIdEntry) return exactIdEntry;
	const namedEntries = entries.filter((candidate) => candidate.name === needle);
	if (namedEntries.length > 1) throw new ToolInputError(`Ambiguous tool name: ${needle}; use an exact tool id.`);
	const namedEntry = namedEntries[0];
	if (!namedEntry) throw new ToolInputError(formatUnknownToolIdError(needle, entries, errorOptions));
	return namedEntry;
}
function findEntryByExactId(catalog, id, errorOptions = {}) {
	const needle = id.trim();
	const entry = catalog.entries.find((candidate) => candidate.id === needle);
	if (!entry) throw new ToolInputError(formatUnknownToolIdError(needle, catalog.entries, {
		...errorOptions,
		exactIdOnly: true
	}));
	return entry;
}
function readToolSearchId(args) {
	const params = asToolParamsRecord(args);
	const value = params.id ?? params.toolId ?? params.name;
	if (typeof value !== "string" || !value.trim()) throw new ToolInputError("id must be a non-empty string.");
	return value.trim();
}
function readToolSearchCallArgs(args, catalog) {
	const params = asToolParamsRecord(args);
	const dottedInput = Object.fromEntries(Object.entries(params).filter(([key]) => key.startsWith("args.") && key.length > 5).map(([key, value]) => [key.slice(5), value]));
	const nestedInput = params.args ?? params.input;
	if (nestedInput != null) return {
		id: readToolSearchId(params),
		input: isRecord(nestedInput) ? {
			...dottedInput,
			...nestedInput
		} : nestedInput
	};
	const selectorKeys = [
		"id",
		"toolId",
		"name"
	];
	const matchingSelectors = catalog ? selectorKeys.flatMap((key) => {
		const value = params[key];
		if (typeof value !== "string") return [];
		const matches = catalog.entries.filter((entry) => entry.id === value || entry.name === value);
		return matches.length > 0 ? [{
			key,
			matches
		}] : [];
	}) : [];
	if (new Set(matchingSelectors.flatMap(({ matches }) => matches.map((entry) => entry.id))).size > 1) throw new ToolInputError("Ambiguous tool selectors: pass the target tool id and nest target arguments under args.");
	const matchingSelector = matchingSelectors[0]?.key;
	const selector = matchingSelector ?? selectorKeys.find((key) => params[key] != null);
	const id = readToolSearchId(selector ? { [selector]: params[selector] } : params);
	const wrapperKeys = /* @__PURE__ */ new Set([
		"args",
		"input",
		...matchingSelectors.map(({ key }) => key),
		...matchingSelector ? [] : [selector ?? "id"]
	]);
	const targetInputEntries = Object.entries(params).filter(([key]) => !wrapperKeys.has(key));
	const flattenedInput = Object.fromEntries(targetInputEntries.filter(([key]) => !(key.startsWith("args.") && key.length > 5)));
	return {
		id,
		input: {
			...dottedInput,
			...flattenedInput
		}
	};
}
function getTelemetry(catalog) {
	const sources = {
		openclaw: 0,
		mcp: 0,
		client: 0
	};
	for (const entry of catalog.entries) sources[entry.source] += 1;
	return {
		catalogSize: catalog.entries.length,
		sources,
		counterScope: catalog.counterScope,
		searchCount: catalog.searchCount,
		describeCount: catalog.describeCount,
		callCount: catalog.callCount
	};
}
function matchesCachedToolSearchIndex(cached, entries) {
	return cached.entries.length === entries.length && entries.every((entry, index) => {
		const snapshot = cached.entries[index];
		return snapshot?.entry === entry && snapshot.id === entry.id && snapshot.source === entry.source && snapshot.name === entry.name && snapshot.label === entry.label && snapshot.description === entry.description && snapshot.parameters === entry.parameters && snapshot.parameterText === (entry.source === "openclaw" ? readParameterText(entry.parameters) : "");
	});
}
let schemaValidatorModulePromise;
const catalogSchemaCacheIds = /* @__PURE__ */ new WeakMap();
let nextCatalogSchemaCacheId = 0;
function getCatalogSchemaCacheKey(entry, schemaName, schema) {
	const prefix = `tool-${schemaName === "inputSchema" ? "input" : "output"}:${entry.id}`;
	if (typeof schema !== "object" || schema === null) return `${prefix}:${String(schema)}`;
	let schemaCacheId = catalogSchemaCacheIds.get(schema);
	if (schemaCacheId === void 0) {
		schemaCacheId = nextCatalogSchemaCacheId++;
		catalogSchemaCacheIds.set(schema, schemaCacheId);
	}
	return `${prefix}:${schemaCacheId}:${JSON.stringify(schema)}`;
}
async function validateCatalogSchemaValue(entry, schemaName, value) {
	const schema = schemaName === "inputSchema" ? entry.parameters : entry.outputSchema;
	if (entry.source !== "openclaw" || !schema) return;
	try {
		schemaValidatorModulePromise ??= import("./schema-validator-Bind9AcR.js");
		const { validateJsonSchemaValue } = await schemaValidatorModulePromise;
		return validateJsonSchemaValue({
			schema,
			cacheKey: getCatalogSchemaCacheKey(entry, schemaName, schema),
			value
		});
	} catch (error) {
		throw new Error(`Tool "${entry.id}" has an invalid ${schemaName}.`, { cause: error });
	}
}
function formatCatalogInputError(entry, errors, value) {
	const schema = isRecord(entry.parameters) ? entry.parameters : void 0;
	const propertyNames = isRecord(schema?.properties) ? Object.keys(schema.properties) : [];
	const knownProperties = new Set(propertyNames);
	const suggestions = uniqueStrings((schema?.additionalProperties === false && isRecord(value) ? Object.keys(value).filter((name) => !knownProperties.has(name)) : errors.flatMap((error) => error.additionalProperty ? [error.additionalProperty] : [])).flatMap((unexpected) => {
		const nearest = propertyNames.map((name) => ({
			name,
			distance: levenshteinDistance(unexpected, name)
		})).filter(({ distance }) => distance <= Math.min(3, Math.max(1, Math.ceil(unexpected.length / 3)))).toSorted((left, right) => left.distance - right.distance || left.name.localeCompare(right.name))[0];
		return nearest ? [nearest.name] : [];
	})).slice(0, 3);
	const details = errors.map((error) => error.text).join("; ");
	const hint = suggestions.length > 0 ? ` Did you mean: ${suggestions.join(", ")}?` : "";
	return `Invalid arguments for tool "${entry.id}": ${details}.${hint}`;
}
async function assertCatalogInputMatchesSchema(entry, value) {
	const validation = await validateCatalogSchemaValue(entry, "inputSchema", value);
	if (validation && !validation.ok) throw new ToolInputError(formatCatalogInputError(entry, validation.errors, value));
}
async function assertCatalogOutputSchemaIsValid(entry) {
	await validateCatalogSchemaValue(entry, "outputSchema", void 0);
}
async function assertCatalogOutputMatchesSchema(entry, result) {
	if (!entry.outputSchema) return;
	if (isPreExecutionBlockedToolResult(result)) {
		const details = unwrapToolResultValue(result);
		const reason = isRecord(details) && typeof details.reason === "string" && details.reason.trim() ? details.reason : "Tool call blocked by policy";
		throw new Error(`Tool "${entry.id}" was blocked before execution: ${reason}`);
	}
	const validation = await validateCatalogSchemaValue(entry, "outputSchema", unwrapToolResultValue(result));
	if (!validation || validation.ok) return;
	throw new Error(`Tool "${entry.id}" returned details that do not match its declared outputSchema.`);
}
function sanitizeToolCallIdPart(value) {
	return value.trim().replace(/[^A-Za-z0-9_.:-]+/g, "_").slice(0, 120) || "call";
}
var ToolSearchRuntime = class {
	constructor(ctx, config, options = {}) {
		this.ctx = ctx;
		this.config = config;
		this.options = options;
		this.callSequence = 0;
		this.networkInvocations = /* @__PURE__ */ new Map();
		this.searchIndexes = /* @__PURE__ */ new WeakMap();
		this.search = async (query, options) => {
			const catalog = resolveCatalog(this.ctx);
			catalog.searchCount += 1;
			const limit = readToolSearchLimit(options?.limit, this.config);
			const entries = visibleCatalogEntries(catalog, options);
			const exact = query.trim().toLowerCase();
			const isExact = (entry) => entry.name.toLowerCase() === exact || entry.id.toLowerCase() === exact;
			const exactMatches = entries.filter(isExact);
			if (limit === 1 && exactMatches.length === 1) return exactMatches.slice(0, limit).map((entry) => compactToolSearchCatalogEntry(entry));
			const includeMcp = options?.includeMcp !== false;
			let catalogIndexes = this.searchIndexes.get(catalog);
			if (!catalogIndexes) {
				catalogIndexes = /* @__PURE__ */ new Map();
				this.searchIndexes.set(catalog, catalogIndexes);
			}
			let cachedIndex = catalogIndexes.get(includeMcp);
			if (!cachedIndex || !matchesCachedToolSearchIndex(cachedIndex, entries)) {
				const indexedEntries = entries.map((entry) => ({
					entry,
					id: entry.id,
					source: entry.source,
					name: entry.name,
					label: entry.label,
					description: entry.description,
					parameters: entry.parameters,
					parameterText: entry.source === "openclaw" ? readParameterText(entry.parameters) : ""
				}));
				cachedIndex = {
					entries: indexedEntries,
					index: buildLexicalIndex(indexedEntries.map(({ entry, parameterText }) => ({
						value: entry,
						terms: tokenizeDocument(toolSearchEntryText(entry, parameterText))
					})))
				};
				catalogIndexes.set(includeMcp, cachedIndex);
			}
			const ranked = scoreLexical(cachedIndex.index, tokenizeQuery(query)).toSorted((a, b) => Number(isExact(b.value)) - Number(isExact(a.value)) || Number(b.matchedLiteral) - Number(a.matchedLiteral) || b.score - a.score || a.value.id.localeCompare(b.value.id)).map((hit) => hit.value);
			return [...entries.filter((entry) => isExact(entry) && !ranked.includes(entry)), ...ranked].slice(0, limit).map((entry) => compactToolSearchCatalogEntry(entry));
		};
		this.all = (options) => visibleCatalogEntries(resolveCatalog(this.ctx), options).map((entry) => compactToolSearchCatalogEntry(entry));
		this.namespaceEntries = () => resolveCatalog(this.ctx).entries.map((entry) => Object.assign(compactToolSearchCatalogEntry(entry), {
			...entry.mcp ? { mcp: entry.mcp } : {},
			parameters: entry.parameters ?? {}
		}));
		this.describe = async (id, options) => {
			const catalog = resolveCatalog(this.ctx);
			catalog.describeCount += 1;
			return describeEntry(findEntry(catalog, id, options, options));
		};
		this.call = async (id, input, options) => {
			const catalog = resolveCatalog(this.ctx);
			return await this.callEntry(catalog, findEntry(catalog, id, options, options), input, options);
		};
		this.callExactId = async (id, input, options) => {
			const catalog = resolveCatalog(this.ctx);
			return await this.callEntry(catalog, findEntryByExactId(catalog, id, options), input, options);
		};
		this.callValue = async (id, input, options) => unwrapToolResultValue((await this.call(id, input, options)).result);
		this.isReplaySafeExactId = (id) => {
			let entry;
			try {
				entry = findEntryByExactId(resolveCatalog(this.ctx), id);
			} catch {
				return false;
			}
			if (entry.source !== "openclaw") return false;
			const pluginMeta = getPluginToolMeta(entry.tool);
			if (pluginMeta) return pluginMeta.mcp ? false : pluginMeta.replaySafe === true;
			if (getChannelAgentToolMeta(entry.tool)) return false;
			return isAgentToolReplaySafe(entry.tool);
		};
		this.callEntry = async (catalog, entry, input, options) => {
			catalog.callCount += 1;
			const targetInput = input ?? {};
			const normalizedInput = entry.source === "openclaw" ? normalizeToolSearchTargetInput(targetInput, entry.parameters) : targetInput;
			await assertCatalogOutputSchemaIsValid(entry);
			const toolCallId = `tool_search_code:${sanitizeToolCallIdPart(options?.parentToolCallId ?? "direct")}:${entry.name}:${++this.callSequence}`;
			const executeTool = this.ctx.executeTool ?? (async (params) => {
				const result = await params.tool.execute(params.toolCallId, params.input, params.signal, params.onUpdate, void 0);
				return await params.acceptResultBeforeProjection(result);
			});
			let preExecutionBlocked = false;
			const acceptResultBeforeProjection = async (candidate) => {
				if (isPreExecutionBlockedToolResult(candidate)) {
					preExecutionBlocked = true;
					await assertCatalogOutputMatchesSchema(entry, candidate);
				}
				const snapshot = snapshotToolSearchTargetTranscriptResult(candidate);
				await assertCatalogOutputMatchesSchema(entry, snapshot);
				return snapshot;
			};
			const validateInput = this.options.validateInput && entry.source === "openclaw";
			const executionTool = validateInput && !isToolWrappedWithBeforeToolCallHook(entry.tool) ? wrapToolWithBeforeToolCallHook(entry.tool) : entry.tool;
			const runExecution = async () => {
				const parentToolCallId = options?.parentToolCallId ?? toolCallId;
				const signal = options?.signal ?? this.ctx.abortSignal;
				const networkInvocation = entry.tool.resultContentSource === "network" ? this.networkInvocations.get(parentToolCallId) ?? {
					active: 0,
					observed: false
				} : void 0;
				if (networkInvocation) {
					networkInvocation.active += 1;
					this.networkInvocations.set(parentToolCallId, networkInvocation);
				}
				try {
					const result = await executeTool({
						tool: executionTool,
						toolName: entry.name,
						source: entry.source,
						sourceName: entry.sourceName,
						toolCallId,
						parentToolCallId: options?.parentToolCallId,
						input: normalizedInput,
						signal,
						onUpdate: options?.onUpdate,
						acceptResultBeforeProjection
					});
					if (networkInvocation && !preExecutionBlocked) networkInvocation.observed = true;
					return result;
				} catch (error) {
					if (networkInvocation && !preExecutionBlocked && getBeforeToolCallFailureDisposition(error) === void 0 && !isTrustedToolExecutionPreflightError(error) && !(signal?.aborted && error === signal.reason)) networkInvocation.observed = true;
					throw error;
				} finally {
					if (networkInvocation && --networkInvocation.active === 0 && !networkInvocation.observed) this.networkInvocations.delete(parentToolCallId);
				}
			};
			const acceptedResult = await acceptResultBeforeProjection(validateInput ? await runWithToolExecutionValidation(toolCallId, async (finalInput) => await assertCatalogInputMatchesSchema(entry, finalInput), runExecution) : await runExecution());
			return {
				tool: compactToolSearchCatalogEntry(entry),
				result: acceptedResult
			};
		};
	}
	hasNetworkContent(parentToolCallId) {
		return parentToolCallId ? this.networkInvocations.has(parentToolCallId) : this.networkInvocations.size > 0;
	}
	telemetry() {
		return getTelemetry(resolveCatalog(this.ctx));
	}
};
/** Preserve programmatic values while protecting the model-facing control output. */
function formatToolSearchControlResult(payload, runtime, parentToolCallId) {
	const result = jsonResult(payload);
	const content = result.content[0];
	if (!runtime?.hasNetworkContent(parentToolCallId) || content?.type !== "text") return result;
	const bounded = truncateSanitizedExternalContent(content.text, 2e4);
	const text = wrapExternalContent(bounded.truncated ? `${truncateSanitizedExternalContent(content.text, 19988).text}\n[truncated]` : bounded.text, { source: "api" });
	return {
		...result,
		content: [{
			...content,
			text
		}]
	};
}
/** Keep dynamic failures rejected without exposing network-controlled error text. */
function formatToolSearchControlError(error, runtime, parentToolCallId, signal) {
	if (!runtime?.hasNetworkContent(parentToolCallId) || getBeforeToolCallFailureDisposition(error) !== void 0 || isTrustedToolExecutionPreflightError(error) || signal?.aborted && error === signal.reason) return error;
	return protectNetworkToolExecutionError(error, "Tool Search call failed.", signal);
}
function unwrapToolResultValue(result) {
	return isRecord(result) && "details" in result ? result.details : result;
}
//#endregion
//#region src/agents/tool-search-code-mode.ts
async function runCodeMode(params) {
	const runtime = new ToolSearchRuntime(params.ctx, params.config, { validateInput: true });
	params.onRuntime?.(runtime);
	const logs = [];
	return {
		ok: true,
		value: toToolSearchJsonSafe(await runCodeModeChild({
			code: params.code,
			config: params.config,
			logs,
			parentToolCallId: params.toolCallId,
			runtime,
			signal: params.signal,
			onUpdate: params.onUpdate
		})),
		logs,
		telemetry: runtime.telemetry()
	};
}
function buildCodeModeChildArgs() {
	if (!process.allowedNodeEnvironmentFlags.has("--permission")) throw new ToolInputError("tool_search_code requires a Node runtime with --permission support.");
	return [
		"--permission",
		"--input-type=module",
		"--eval",
		TOOL_SEARCH_CODE_MODE_CHILD_SOURCE
	];
}
function isCodeModeBridgeMethod(value) {
	return value === "search" || value === "describe" || value === "call";
}
async function runCodeModeBridgeRequest(runtime, method, args, options) {
	const values = Array.isArray(args) ? args : [];
	switch (method) {
		case "search": {
			const query = values[0];
			if (typeof query !== "string") throw new ToolInputError("search query must be a string.");
			const optionsLocal = isRecord(values[1]) ? values[1] : void 0;
			return await runtime.search(query, { limit: typeof optionsLocal?.limit === "number" ? optionsLocal.limit : void 0 });
		}
		case "describe": {
			const id = values[0];
			if (typeof id !== "string") throw new ToolInputError("describe id must be a string.");
			return await runtime.describe(id, { recoverySurface: "code-mode" });
		}
		case "call": {
			const id = values[0];
			if (typeof id !== "string") throw new ToolInputError("call id must be a string.");
			return await runtime.call(id, values[1] ?? {}, {
				...options,
				recoverySurface: "code-mode"
			});
		}
	}
	throw new ToolInputError("Unsupported tool_search_code bridge method.");
}
function appendToolSearchCodeStderrTail(current, chunk) {
	return appendBoundedTextTail(current, chunk, SESSION_TOOL_STDERR_TAIL_BYTES);
}
function runCodeModeChild(params) {
	return new Promise((resolve, reject) => {
		const child = spawn(process.execPath, buildCodeModeChildArgs(), {
			cwd: os.tmpdir(),
			env: {},
			stdio: [
				"ignore",
				"ignore",
				"pipe",
				"ipc"
			]
		});
		let stderrTail = "";
		let settled = false;
		let timedOut = false;
		let exitRejectionTimer;
		const bridgeAbortController = new AbortController();
		const settle = (callback) => {
			if (settled) return;
			settled = true;
			if (timer) clearTimeout(timer);
			if (exitRejectionTimer) clearTimeout(exitRejectionTimer);
			params.signal?.removeEventListener("abort", abortFromParent);
			child.kill();
			callback();
		};
		const abortFromParent = () => {
			bridgeAbortController.abort(params.signal?.reason);
			child.kill("SIGKILL");
			settle(() => reject(/* @__PURE__ */ new Error("tool_search_code aborted")));
		};
		const timer = setTimeout(() => {
			timedOut = true;
			bridgeAbortController.abort(/* @__PURE__ */ new Error("tool_search_code timed out"));
			child.kill("SIGKILL");
			settle(() => reject(/* @__PURE__ */ new Error("tool_search_code timed out")));
		}, params.config.codeTimeoutMs);
		params.signal?.addEventListener("abort", abortFromParent, { once: true });
		if (params.signal?.aborted) {
			abortFromParent();
			return;
		}
		child.stderr?.setEncoding("utf8");
		child.stderr?.on("data", (chunk) => {
			stderrTail = appendToolSearchCodeStderrTail(stderrTail, chunk);
		});
		child.stderr?.on("error", (error) => {
			settle(() => reject(error));
		});
		child.on("error", (error) => {
			settle(() => reject(error));
		});
		child.on("exit", (code, signal) => {
			if (settled) return;
			const rejectOnExit = () => {
				const suffix = stderrTail.trim();
				const detail = suffix ? `: ${sliceUtf16Safe(suffix, -500)}` : "";
				settle(() => reject(/* @__PURE__ */ new Error(timedOut ? "tool_search_code timed out" : `tool_search_code child exited with ${signal ?? code}${detail}`)));
			};
			if (code === 0 && signal === null) {
				exitRejectionTimer = setTimeout(rejectOnExit, 250);
				return;
			}
			rejectOnExit();
		});
		child.on("message", (message) => {
			if (settled || !isRecord(message) || typeof message.type !== "string") return;
			if (message.type === "log") {
				const items = Array.isArray(message.items) ? message.items : [];
				params.logs.push(items.map((item) => String(item)).join(" "));
				return;
			}
			if (message.type === "result") {
				if (message.ok) settle(() => resolve(message.value));
				else settle(() => reject(new Error(typeof message.error === "string" ? message.error : "code failed")));
				return;
			}
			if (message.type !== "bridge") return;
			const id = typeof message.id === "string" ? message.id : "";
			const method = isCodeModeBridgeMethod(message.method) ? message.method : void 0;
			if (!id || !method) return;
			runCodeModeBridgeRequest(params.runtime, method, message.args, {
				parentToolCallId: params.parentToolCallId,
				signal: bridgeAbortController.signal,
				onUpdate: params.onUpdate
			}).then((value) => {
				if (settled || !child.connected) return;
				const response = {
					type: "bridge-result",
					id,
					ok: true,
					value: toToolSearchJsonSafe(value)
				};
				child.send(response, () => void 0);
			}).catch((error) => {
				if (settled || !child.connected) return;
				const response = {
					type: "bridge-result",
					id,
					ok: false,
					error: error instanceof Error ? error.message : String(error)
				};
				child.send(response, () => void 0);
			});
		});
		child.send({
			type: "run",
			code: params.code,
			timeoutMs: params.config.codeTimeoutMs
		});
	});
}
function readToolSearchCode(args) {
	const code = asToolParamsRecord(args).code;
	if (typeof code !== "string" || !code.trim()) throw new ToolInputError("code must be a non-empty string.");
	return code;
}
//#endregion
//#region src/agents/tool-search-config.ts
const DEFAULT_CODE_TIMEOUT_MS = 1e4;
const DEFAULT_SEARCH_LIMIT = 8;
const DEFAULT_MAX_SEARCH_LIMIT = 20;
function readToolSearchConfig(config) {
	const toolSearch = (isRecord(config?.tools) ? config.tools : void 0)?.toolSearch;
	if (toolSearch === true) return { enabled: true };
	if (toolSearch === false) return { enabled: false };
	return isRecord(toolSearch) ? toolSearch : {};
}
function resolveBoolean(value, fallback) {
	return typeof value === "boolean" ? value : fallback;
}
function readInteger(value, fallback) {
	return typeof value === "number" && Number.isInteger(value) && value > 0 ? value : fallback;
}
let toolSearchCodeModeSupportedForTest;
let toolSearchMinCodeTimeoutMsForTest;
function isToolSearchCodeModeSupported() {
	if (toolSearchCodeModeSupportedForTest !== void 0) return toolSearchCodeModeSupportedForTest;
	return process.allowedNodeEnvironmentFlags.has("--permission");
}
function resolveMinCodeTimeoutMs() {
	return toolSearchMinCodeTimeoutMsForTest ?? 1e3;
}
function resolveToolSearchConfig(config) {
	const raw = readToolSearchConfig(config);
	const rawMode = typeof raw.mode === "string" ? raw.mode : "code";
	const requestedMode = rawMode === "tools" || rawMode === "directory" || rawMode === "code" ? rawMode : "code";
	const mode = requestedMode === "code" && !isToolSearchCodeModeSupported() ? "tools" : requestedMode;
	const configured = Object.keys(raw).some((key) => key !== "enabled");
	const maxSearchLimit = Math.max(1, Math.min(50, readInteger(raw.maxSearchLimit, DEFAULT_MAX_SEARCH_LIMIT)));
	return {
		enabled: resolveBoolean(raw.enabled, configured),
		mode,
		codeTimeoutMs: Math.max(resolveMinCodeTimeoutMs(), Math.min(6e4, readInteger(raw.codeTimeoutMs, DEFAULT_CODE_TIMEOUT_MS))),
		searchDefaultLimit: Math.max(1, Math.min(maxSearchLimit, readInteger(raw.searchDefaultLimit, DEFAULT_SEARCH_LIMIT))),
		maxSearchLimit
	};
}
function setToolSearchCodeModeSupportedForTest(value) {
	toolSearchCodeModeSupportedForTest = value;
}
function setToolSearchMinCodeTimeoutMsForTest(value) {
	toolSearchMinCodeTimeoutMsForTest = typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
//#endregion
//#region src/agents/tool-search-directory.ts
const MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS = 18e3;
const TOOL_DIRECTORY_IDENTIFIER_RE = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/u;
const toolSchemaDirectoryPromptCache = /* @__PURE__ */ new WeakMap();
function applyToolSchemaDirectoryCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	if (!config.enabled) return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	if (!params.tools.some((tool) => tool.name === "tool_search")) return {
		tools: params.tools.filter((tool) => !TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name)),
		compacted: false,
		catalogToolCount: 0,
		catalogRegistered: false,
		catalogReused: false
	};
	const directToolNames = new Set(normalizeStringEntries(Array.from(params.directToolNames ?? [])));
	const uniqueCatalogToolNames = collectUniqueCatalogToolNames(params.tools);
	return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: (tool) => TOOL_SCHEMA_DIRECTORY_CONTROL_TOOL_NAMES.has(tool.name),
		isVisibleCatalogTool: (tool) => uniqueCatalogToolNames.has(tool.name) && isDirectVisibleCatalogTool(tool, directToolNames)
	});
}
function buildToolSchemaDirectoryPrompt(ctx, options) {
	const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
	const catalog = resolveCatalog(ctx);
	const cacheKey = `${config.mode}:${options?.includeMcp === false ? "without-mcp" : "all"}`;
	let cachedPrompts = toolSchemaDirectoryPromptCache.get(catalog.entries);
	const cachedPrompt = cachedPrompts?.get(cacheKey);
	if (cachedPrompt !== void 0) return cachedPrompt;
	const prompt = formatToolSearchCatalogDirectory(visibleCatalogEntries(catalog, options), config.mode);
	if (!cachedPrompts) {
		cachedPrompts = /* @__PURE__ */ new Map();
		toolSchemaDirectoryPromptCache.set(catalog.entries, cachedPrompts);
	}
	cachedPrompts.set(cacheKey, prompt);
	return prompt;
}
function resolveToolSearchCatalogTool(ctx, name, options) {
	if (typeof name !== "string") return;
	const needle = name.trim();
	if (!needle) return;
	try {
		const matches = visibleCatalogEntries(resolveCatalog(ctx), options).filter((entry) => entry.name === needle);
		return matches.length === 1 ? matches[0]?.tool : void 0;
	} catch (error) {
		if (error instanceof ToolInputError) return;
		throw error;
	}
}
function compactDirectoryDescription(description) {
	const normalized = description.replace(/\s+/g, " ").trim();
	if (normalized.length <= 180) return normalized;
	return `${truncateUtf16Safe(normalized, 177).trimEnd()}...`;
}
function formatToolDirectoryIdentifier(value) {
	const trimmed = value?.trim();
	return trimmed && TOOL_DIRECTORY_IDENTIFIER_RE.test(trimmed) ? trimmed : void 0;
}
function formatToolDirectoryEntry(entry) {
	if (entry.source !== "openclaw") return;
	const name = formatToolDirectoryIdentifier(entry.name);
	if (!name) return;
	const description = compactDirectoryDescription(entry.description);
	const ownerName = formatToolDirectoryIdentifier(entry.sourceName);
	return `- ${name}${ownerName ? ` (${ownerName})` : ""}: ${description || "No description."}`;
}
function renderToolSearchCatalogDirectory(lines, total, mode) {
	const omitted = total - lines.length;
	const guidance = mode === "code" ? "Use tool_search_code with openclaw.tools.search(query), openclaw.tools.describe(id), and openclaw.tools.call(id, args)." : omitted > 0 ? "Use tool_search to find them, then tool_describe to load a full schema before tool_call." : "Call tool_describe with a listed tool name to load its full schema before using tool_call.";
	const footer = omitted > 0 ? `${omitted} additional tools omitted. ${guidance}` : guidance;
	return [
		"Available deferred-schema tools:",
		...lines,
		"",
		"Policy-approved MCP and client tools may also be discoverable through search.",
		footer
	].join("\n");
}
function formatToolSearchCatalogDirectory(entries, mode) {
	if (entries.length === 0) return "Available deferred-schema tools: none.";
	const nameCounts = /* @__PURE__ */ new Map();
	for (const entry of entries) nameCounts.set(entry.name, (nameCounts.get(entry.name) ?? 0) + 1);
	const lines = entries.filter((entry) => nameCounts.get(entry.name) === 1).toSorted((left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0) || (left.id < right.id ? -1 : left.id > right.id ? 1 : 0)).map(formatToolDirectoryEntry).filter((line) => Boolean(line));
	const fullDirectory = renderToolSearchCatalogDirectory(lines, entries.length, mode);
	if (fullDirectory.length <= 18e3) return fullDirectory;
	let low = 0;
	let high = lines.length;
	while (low < high) {
		const middle = Math.ceil((low + high) / 2);
		if (renderToolSearchCatalogDirectory(lines.slice(0, middle), entries.length, mode).length <= 18e3) low = middle;
		else high = middle - 1;
	}
	return renderToolSearchCatalogDirectory(lines.slice(0, low), entries.length, mode);
}
//#endregion
//#region src/agents/tool-search.ts
/** Tool Search catalog compaction for large OpenClaw, MCP, and client tool inventories. */
const MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS = 180;
const MAX_BATCH_CANDIDATE_DESCRIPTION_SCAN_CHARS = MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS * 4;
const MAX_BATCH_CANDIDATE_METADATA_CHARS = 2e3;
function compactBatchCandidateDescription(candidate) {
	const prefix = truncateUtf16Safe(candidate.description, MAX_BATCH_CANDIDATE_DESCRIPTION_SCAN_CHARS);
	const normalized = prefix.replace(/\s+/g, " ").trim();
	if (prefix.length === candidate.description.length && normalized.length <= MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS) return {
		...candidate,
		description: normalized
	};
	const compacted = truncateUtf16Safe(normalized, MAX_BATCH_CANDIDATE_DESCRIPTION_CHARS - 3).trimEnd();
	return {
		...candidate,
		description: `${compacted}...`
	};
}
function compactBatchCandidate(candidate) {
	const mandatoryChars = candidate.id.length + candidate.source.length + candidate.name.length + candidate.input.length;
	if (mandatoryChars > MAX_BATCH_CANDIDATE_METADATA_CHARS) return;
	let remaining = MAX_BATCH_CANDIDATE_METADATA_CHARS - mandatoryChars;
	const retain = (value) => {
		if (value === void 0 || value.length > remaining) return;
		remaining -= value.length;
		return value;
	};
	const sourceName = retain(candidate.sourceName);
	const label = retain(candidate.label);
	const mcpChars = candidate.mcp ? candidate.mcp.serverName.length + candidate.mcp.safeServerName.length + candidate.mcp.toolName.length + candidate.mcp.operation.length : 0;
	const mcp = candidate.mcp && mcpChars <= remaining ? candidate.mcp : void 0;
	if (mcp) remaining -= mcpChars;
	const output = retain(candidate.output);
	return {
		...compactBatchCandidateDescription(candidate),
		sourceName,
		label,
		mcp,
		output
	};
}
function boundToolSearchBatchResponse(results) {
	const bounded = results.map((result) => {
		const candidates = result.candidates.map(compactBatchCandidate).filter((candidate) => candidate !== void 0);
		const groupTruncated = candidates.length < result.candidates.length;
		return {
			...result,
			candidates,
			...groupTruncated ? { truncated: true } : {}
		};
	});
	let truncated = bounded.some((result) => result.truncated);
	const render = () => ({
		results: bounded,
		...truncated ? { truncated: true } : {}
	});
	while (JSON.stringify(render(), null, 2).length > MAX_TOOL_SEARCH_BATCH_RESPONSE_CHARS) {
		const removable = bounded.map((result, index) => ({
			index,
			rank: result.candidates.length,
			candidate: result.candidates.at(-1)
		})).filter((item) => item.candidate !== void 0).toSorted((a, b) => b.rank - a.rank || JSON.stringify(b.candidate).length - JSON.stringify(a.candidate).length || a.index - b.index)[0];
		if (!removable) break;
		const group = bounded[removable.index];
		group?.candidates.pop();
		if (group) group.truncated = true;
		truncated = true;
	}
	return render();
}
function shouldExposeControlTool(name, mode) {
	if (name === "tool_search_code") return mode === "code";
	if (name === "tool_search" || name === "tool_describe" || name === "tool_call") return mode === "tools";
	return false;
}
/** Replace visible tools with Tool Search controls and register hidden catalog entries. */
function applyToolSearchCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	const directToolNames = new Set(normalizeStringEntries(Array.from(params.directToolNames ?? [])));
	return applyToolCatalogCompaction({
		...params,
		enabled: config.enabled,
		isVisibleControlTool: (tool) => TOOL_SEARCH_CONTROL_TOOL_NAMES.has(tool.name) && shouldExposeControlTool(tool.name, config.mode),
		isVisibleCatalogTool: (tool) => isDirectVisibleCatalogTool(tool, directToolNames)
	});
}
/** Move client-provided tools into an existing Tool Search catalog. */
function addClientToolsToToolSearchCatalog(params) {
	const config = resolveToolSearchConfig(params.config);
	if (config.mode === "directory") return {
		tools: params.tools,
		compacted: false,
		catalogToolCount: 0
	};
	return addClientToolsToToolCatalog({
		...params,
		enabled: config.enabled
	});
}
/** Create Tool Search control tools for the current run/session context. */
function createToolSearchTools(ctx) {
	const config = resolveToolSearchConfig(ctx.runtimeConfig ?? ctx.config);
	const runtime = new ToolSearchRuntime(ctx, config, { validateInput: true });
	return [
		{
			name: TOOL_SEARCH_CODE_MODE_TOOL_NAME,
			label: "Tool Search Code",
			description: "Run JavaScript in an isolated Node subprocess over a large tool catalog. APIs: `openclaw.tools.search(query: string, options?)`, `openclaw.tools.describe(id: string)`, and `openclaw.tools.call(id: string, args?)`. Search takes a positional query string, which must be in English: matching is lexical against tool names and descriptions, which are written in English. Call returns `{ tool, result }`; JSON values normally live in `result.details`.",
			parameters: Type.Object({ code: Type.String({ description: "JavaScript body for an async function. Use return to return the final value. The openclaw.tools bridge is available." }) }),
			execute: async (toolCallId, args, signal, onUpdate) => {
				let executionRuntime;
				try {
					return formatToolSearchControlResult(await runCodeMode({
						toolCallId,
						ctx,
						code: readToolSearchCode(args),
						config,
						signal,
						onUpdate,
						onRuntime: (value) => {
							executionRuntime = value;
						}
					}), executionRuntime);
				} catch (error) {
					throw formatToolSearchControlError(error, executionRuntime, toolCallId, signal ?? ctx.abortSignal);
				}
			}
		},
		{
			name: TOOL_SEARCH_RAW_TOOL_NAME,
			label: "Tool Search",
			description: "Search the effective Tool Search catalog. Pass exactly one of query for one search or queries for several independent searches in one call. Batch results stay grouped in request order. Queries must be in English: matching is lexical against tool names and descriptions, which are written in English, so another language will usually match nothing. Pass an exact result id or name to tool_call; use tool_describe only when you need its input schema.",
			parameters: Type.Object({
				query: Type.Optional(Type.String({ description: "Single search query, in English. Do not set this when queries is present." })),
				limit: Type.Optional(Type.Integer({
					minimum: 1,
					description: "Maximum number of single-search results."
				})),
				queries: Type.Optional(Type.Array(Type.Object({
					query: Type.String({
						minLength: 1,
						maxLength: 512,
						description: "Search query, in English. Describe the capability you need."
					}),
					limit: Type.Optional(Type.Integer({
						minimum: 1,
						description: `Maximum results for this query. Defaults to ${config.searchDefaultLimit} when omitted.`
					}))
				}), {
					minItems: 1,
					maxItems: 16,
					description: `Independent searches. Do not set query when this is present. Their effective limits may total at most 50; an omitted item limit counts as ${config.searchDefaultLimit}. The serialized query strings may use at most 512 UTF-8 bytes in total.`
				}))
			}),
			execute: async (_toolCallId, args) => {
				const request = readToolSearchRequest(args, config);
				if (request.kind === "single") return jsonResult(await runtime.search(request.search.query, { limit: request.search.limit }));
				return jsonResult(boundToolSearchBatchResponse(await Promise.all(request.searches.map(async (search) => ({
					query: search.query,
					candidates: await runtime.search(search.query, { limit: search.limit })
				})))));
			}
		},
		{
			name: TOOL_DESCRIBE_RAW_TOOL_NAME,
			label: "Tool Describe",
			description: "Load the full schema and metadata for one search result when its input is not already clear.",
			parameters: Type.Object({ id: Type.String({ description: "Tool search result id or tool name." }) }),
			execute: async (_toolCallId, args) => jsonResult(await runtime.describe(readToolSearchId(args)))
		},
		{
			name: TOOL_CALL_RAW_TOOL_NAME,
			label: "Tool Call",
			description: "Call an exact Tool Search result id or name through OpenClaw.",
			parameters: Type.Object({
				id: Type.String({ description: "Tool search result id or tool name." }),
				args: Type.Optional(Type.Record(Type.String(), Type.Unknown(), { description: "Tool input." }))
			}),
			execute: async (toolCallId, args, signal, onUpdate) => {
				const call = readToolSearchCallArgs(args, resolveCatalog(ctx));
				try {
					const callResult = await runtime.call(call.id, call.input, {
						parentToolCallId: toolCallId,
						signal,
						onUpdate
					});
					const wrappedResult = formatToolSearchControlResult(callResult, runtime, toolCallId);
					const failureKind = resolveToolResultFailureKind(callResult.result);
					if (!failureKind) return wrappedResult;
					return {
						...wrappedResult,
						details: {
							...callResult,
							status: failureKind
						}
					};
				} catch (error) {
					throw formatToolSearchControlError(error, runtime, toolCallId, signal ?? ctx.abortSignal);
				}
			}
		}
	];
}
const testing = {
	getReusableCatalogSnapshotCountForTest,
	maxToolSchemaDirectoryPromptChars: MAX_TOOL_SCHEMA_DIRECTORY_PROMPT_CHARS,
	resolveToolSearchConfig,
	isToolSearchCodeModeSupported,
	setToolSearchCodeModeSupportedForTest,
	setToolSearchMinCodeTimeoutMsForTest,
	applyToolSearchCatalog,
	addClientToolsToToolSearchCatalog,
	appendToolSearchCodeStderrTail,
	runCodeModeChild
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.toolSearchTestApi")] = testing;
//#endregion
export { TOOL_SEARCH_CONTROL_TOOL_NAMES as C, TOOL_SEARCH_CODE_MODE_TOOL_NAME as S, isDirectVisibleCatalogTool as _, buildToolSchemaDirectoryPrompt as a, TOOL_CALL_RAW_TOOL_NAME as b, ToolSearchRuntime as c, addClientToolsToToolCatalog as d, applyToolCatalogCompaction as f, createToolSearchCatalogRef as g, compactToolSearchCatalogEntry as h, applyToolSchemaDirectoryCatalog as i, formatToolSearchControlResult as l, collectUniqueCatalogToolNames as m, applyToolSearchCatalog as n, resolveToolSearchCatalogTool as o, clearToolSearchCatalog as p, createToolSearchTools as r, resolveToolSearchConfig as s, addClientToolsToToolSearchCatalog as t, projectToolSearchTargetTranscriptMessages as u, registerHeadlessToolSearchCatalog as v, TOOL_SEARCH_RAW_TOOL_NAME as w, TOOL_DESCRIBE_RAW_TOOL_NAME as x, restrictToolSearchCatalog as y };
