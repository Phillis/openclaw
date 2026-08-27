import { GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS, cleanSchemaForGemini, cleanSchemaForLlamacppGbnf, findLlamacppGbnfSchemaViolations, findOpenAIStrictSchemaViolations, normalizeOpenAIStrictCompatSchema, stripUnsupportedSchemaKeywords } from "@openclaw/ai/internal/openai";
//#region src/plugin-sdk/provider-tools.ts
/**
* Finds unsupported JSON-schema keywords and reports their nested schema paths.
*/
function findUnsupportedSchemaKeywords(schema, path, unsupportedKeywords) {
	if (!schema || typeof schema !== "object") return [];
	if (Array.isArray(schema)) return schema.flatMap((item, index) => findUnsupportedSchemaKeywords(item, `${path}[${index}]`, unsupportedKeywords));
	const record = schema;
	const violations = [];
	const properties = record.properties && typeof record.properties === "object" && !Array.isArray(record.properties) ? record.properties : void 0;
	if (properties) for (const [key, value] of Object.entries(properties)) violations.push(...findUnsupportedSchemaKeywords(value, `${path}.properties.${key}`, unsupportedKeywords));
	for (const [key, value] of Object.entries(record)) {
		if (key === "properties") continue;
		if (unsupportedKeywords.has(key)) violations.push(`${path}.${key}`);
		if (value && typeof value === "object") violations.push(...findUnsupportedSchemaKeywords(value, `${path}.${key}`, unsupportedKeywords));
	}
	return violations;
}
/**
* Rewrites tool schemas into Gemini-compatible JSON schema before provider dispatch.
*/
function normalizeGeminiToolSchemas(ctx) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		return {
			...tool,
			parameters: cleanSchemaForGemini(tool.parameters)
		};
	});
}
/**
* Reports Gemini-incompatible schema keywords without mutating tool definitions.
*/
function inspectGeminiToolSchemas(ctx) {
	return ctx.tools.flatMap((tool, toolIndex) => {
		const violations = findUnsupportedSchemaKeywords(tool.parameters, `${tool.name}.parameters`, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS);
		if (violations.length === 0) return [];
		return [{
			toolName: tool.name,
			toolIndex,
			violations
		}];
	});
}
/** Rewrites tool schemas into the JSON Schema subset accepted by llama.cpp GBNF. */
function normalizeLlamacppGbnfToolSchemas(ctx) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		const parameters = cleanSchemaForLlamacppGbnf(tool.parameters);
		return parameters === tool.parameters ? tool : {
			...tool,
			parameters
		};
	});
}
/** Reports tool-schema constraints that llama.cpp GBNF cannot compile. */
function inspectLlamacppGbnfToolSchemas(ctx) {
	return ctx.tools.flatMap((tool, toolIndex) => {
		const violations = findLlamacppGbnfSchemaViolations(tool.parameters, `${tool.name}.parameters`);
		return violations.length > 0 ? [{
			toolName: tool.name,
			toolIndex,
			violations
		}] : [];
	});
}
/**
* Rewrites OpenAI-native tool schemas to satisfy strict object-schema requirements.
*/
function normalizeOpenAIToolSchemas(ctx) {
	if (!shouldApplyOpenAIToolCompat(ctx)) return ctx.tools;
	return ctx.tools.map((tool) => {
		if (tool.parameters == null) return {
			...tool,
			parameters: normalizeOpenAIStrictCompatSchema({})
		};
		if (typeof tool.parameters !== "object") return tool;
		return {
			...tool,
			parameters: normalizeOpenAIStrictCompatSchema(tool.parameters)
		};
	});
}
function shouldApplyOpenAIToolCompat(ctx) {
	const provider = (ctx.model?.provider ?? ctx.provider ?? "").trim().toLowerCase();
	const api = (ctx.model?.api ?? ctx.modelApi ?? "").trim().toLowerCase();
	const baseUrl = (ctx.model?.baseUrl ?? "").trim().toLowerCase();
	if (provider === "openai") {
		if (api === "openai-responses") return !baseUrl || isOpenAIResponsesBaseUrl(baseUrl);
		return api === "openai-chatgpt-responses" && (!baseUrl || isOpenAIResponsesBaseUrl(baseUrl) || isOpenAICodexBaseUrl(baseUrl));
	}
	return false;
}
function isOpenAIResponsesBaseUrl(baseUrl) {
	return /^https:\/\/api\.openai\.com(?:\/v1)?(?:\/|$)/i.test(baseUrl);
}
function isOpenAICodexBaseUrl(baseUrl) {
	return /^https:\/\/chatgpt\.com\/backend-api(?:\/|$)/i.test(baseUrl);
}
/**
* Reports OpenAI strict-schema diagnostics for transports that enforce them before dispatch.
*/
function inspectOpenAIToolSchemas(ctx) {
	if (!shouldApplyOpenAIToolCompat(ctx)) return [];
	return [];
}
/**
* DeepSeek rejects union keywords in tool schemas.
*/
const DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS = /* @__PURE__ */ new Set(["anyOf", "oneOf"]);
function isNullSchemaVariant(schema) {
	if (!schema || typeof schema !== "object" || Array.isArray(schema)) return false;
	const record = schema;
	if (record.type === "null") return true;
	if (Array.isArray(record.type) && record.type.length === 1 && record.type[0] === "null") return true;
	if ("const" in record && record.const === null) return true;
	return Array.isArray(record.enum) && record.enum.length === 1 && record.enum[0] === null;
}
function normalizeDeepSeekSchema(schema) {
	if (Array.isArray(schema)) {
		let changed = false;
		const normalized = schema.map((entry) => {
			const next = normalizeDeepSeekSchema(entry);
			changed ||= next !== entry;
			return next;
		});
		return changed ? normalized : schema;
	}
	if (!schema || typeof schema !== "object") return schema;
	const record = schema;
	const unionKey = Array.isArray(record.anyOf) ? "anyOf" : Array.isArray(record.oneOf) ? "oneOf" : void 0;
	let changed = false;
	const normalized = {};
	for (const [key, value] of Object.entries(record)) {
		if (key === "anyOf" || key === "oneOf") {
			if (key === unionKey) {
				changed = true;
				continue;
			}
		}
		const next = normalizeDeepSeekSchema(value);
		normalized[key] = next;
		changed ||= next !== value;
	}
	if (!unionKey) return changed ? normalized : schema;
	const normalizedVariants = record[unionKey].map((entry) => normalizeDeepSeekSchema(entry));
	const nonNullVariants = normalizedVariants.filter((entry) => !isNullSchemaVariant(entry));
	const hasNullVariant = nonNullVariants.length < normalizedVariants.length;
	if (nonNullVariants.length > 1 && nonNullVariants.every((entry) => isStringConstVariant(entry))) {
		const enumValues = nonNullVariants.map((entry) => entry.const);
		const merged = {
			...normalized,
			type: "string",
			enum: enumValues
		};
		if (hasNullVariant) merged.nullable = true;
		return merged;
	}
	const selected = nonNullVariants[0] ?? normalizedVariants[0];
	if (!selected || typeof selected !== "object" || Array.isArray(selected)) return normalized;
	const merged = {
		...selected,
		...normalized
	};
	if (hasNullVariant) merged.nullable = true;
	return merged;
}
function isStringConstVariant(entry) {
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	return typeof entry.const === "string";
}
/**
* Rewrites DeepSeek-incompatible union schemas into the closest accepted shape.
*/
function normalizeDeepSeekToolSchemas(ctx) {
	return ctx.tools.map((tool) => {
		if (!tool.parameters || typeof tool.parameters !== "object") return tool;
		const parameters = normalizeDeepSeekSchema(tool.parameters);
		return parameters === tool.parameters ? tool : {
			...tool,
			parameters
		};
	});
}
/**
* Reports DeepSeek-incompatible union schema paths without mutating tool definitions.
*/
function inspectDeepSeekToolSchemas(ctx) {
	return ctx.tools.flatMap((tool, toolIndex) => {
		const violations = findUnsupportedSchemaKeywords(tool.parameters, `${tool.name}.parameters`, DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS);
		if (violations.length === 0) return [];
		return [{
			toolName: tool.name,
			toolIndex,
			violations
		}];
	});
}
/**
* Returns the normalizer and inspector pair for a provider tool-schema compatibility family.
*/
function buildProviderToolCompatFamilyHooks(family) {
	switch (family) {
		case "deepseek": return {
			normalizeToolSchemas: normalizeDeepSeekToolSchemas,
			inspectToolSchemas: inspectDeepSeekToolSchemas
		};
		case "gemini": return {
			normalizeToolSchemas: normalizeGeminiToolSchemas,
			inspectToolSchemas: inspectGeminiToolSchemas
		};
		case "llamacpp-gbnf": return {
			normalizeToolSchemas: normalizeLlamacppGbnfToolSchemas,
			inspectToolSchemas: inspectLlamacppGbnfToolSchemas
		};
		case "openai": return {
			normalizeToolSchemas: normalizeOpenAIToolSchemas,
			inspectToolSchemas: inspectOpenAIToolSchemas
		};
	}
	throw new Error("Unsupported provider tool compatibility family");
}
//#endregion
export { stripUnsupportedSchemaKeywords as _, cleanSchemaForLlamacppGbnf as a, findUnsupportedSchemaKeywords as c, inspectLlamacppGbnfToolSchemas as d, inspectOpenAIToolSchemas as f, normalizeOpenAIToolSchemas as g, normalizeLlamacppGbnfToolSchemas as h, cleanSchemaForGemini as i, inspectDeepSeekToolSchemas as l, normalizeGeminiToolSchemas as m, GEMINI_UNSUPPORTED_SCHEMA_KEYWORDS as n, findLlamacppGbnfSchemaViolations as o, normalizeDeepSeekToolSchemas as p, buildProviderToolCompatFamilyHooks as r, findOpenAIStrictSchemaViolations as s, DEEPSEEK_UNSUPPORTED_SCHEMA_KEYWORDS as t, inspectGeminiToolSchemas as u };
