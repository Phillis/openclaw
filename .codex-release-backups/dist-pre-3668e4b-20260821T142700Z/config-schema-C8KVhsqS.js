import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, wn as number } from "./schemas-C7gqXY2T.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-2QFZPjK2.js";
import { _ as MentionPatternsPolicySchema, s as DmPolicySchema } from "./zod-schema.core-D1Ak_xoR.js";
import { t as validateJsonSchemaValue } from "./schema-validator-C_mQvoOg.js";
import { t as parseConfigPathArrayIndex } from "./path-array-index-CvEcUJa-.js";
/** Optional allowlist array used by channel config schema builders. */
const AllowFromListSchema = array(union([string(), number()])).optional();
/** Canonical per-group/room channel policy shape. */
const ChannelGroupEntrySchema = object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: record(string(), ToolPolicySchema).optional(),
	skills: array(string()).optional(),
	enabled: boolean().optional(),
	allowFrom: AllowFromListSchema,
	systemPrompt: string().optional()
}).strict();
/** Extend the canonical group/room policy shape with channel-owned fields. */
function buildGroupEntrySchema(extraShape, options) {
	const omitted = new Set(options?.omit ?? []);
	return object({
		...Object.fromEntries(Object.entries(ChannelGroupEntrySchema.shape).filter(([key]) => !omitted.has(key))),
		...extraShape ?? {}
	}).strict();
}
/** Shared mention-policy schemas. IRC retains its shipped string-array form. */
const ChannelMentionPatternsSchemas = {
	canonical: MentionPatternsPolicySchema,
	stringArray: array(string())
};
/** Build the common nested DM config block used by channel account schemas. */
function buildNestedDmConfigSchema(extraShape) {
	const baseShape = {
		enabled: boolean().optional(),
		policy: DmPolicySchema.optional(),
		allowFrom: AllowFromListSchema
	};
	return object(extraShape ? {
		...baseShape,
		...extraShape
	} : baseShape).optional();
}
/** Add `accounts` catchall and `defaultAccount` fields to a channel account schema. */
function buildCatchallMultiAccountChannelSchema(accountSchema) {
	return buildMultiAccountChannelSchema(accountSchema, { accountsMode: "catchall" });
}
/** Add the standard accounts/defaultAccount envelope and optional shared account/root refinement. */
function buildMultiAccountChannelSchema(baseSchema, options = {}) {
	const refine = options.refine;
	const rawAccountSchema = options.accountSchema ?? baseSchema;
	const accountSchema = refine ? rawAccountSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : rawAccountSchema;
	const accountValueSchema = options.optionalAccount ? accountSchema.optional() : accountSchema;
	const accountsSchema = options.accountsMode === "catchall" ? object({}).catchall(accountValueSchema).optional() : record(string(), accountValueSchema).optional();
	const channelSchema = baseSchema.extend({
		accounts: accountsSchema,
		defaultAccount: string().optional()
	});
	return refine ? channelSchema.superRefine((value, ctx) => {
		return refine(value, ctx);
	}) : channelSchema;
}
function cloneRuntimeIssue(issue) {
	const record = issue && typeof issue === "object" ? issue : {};
	const path = Array.isArray(record.path) ? record.path.filter((segment) => {
		const kind = typeof segment;
		return kind === "string" || kind === "number";
	}) : void 0;
	return {
		...record,
		...path ? { path } : {}
	};
}
function safeParseRuntimeSchema(schema, value) {
	const result = schema.safeParse(value);
	if (result.success) return {
		success: true,
		data: result.data
	};
	return {
		success: false,
		issues: result.error.issues.map((issue) => cloneRuntimeIssue(issue))
	};
}
function toIssuePath(path) {
	if (!path || path === "<root>") return [];
	return path.split(".").map((segment) => {
		return parseConfigPathArrayIndex(segment) ?? segment;
	});
}
function safeParseJsonSchema(schema, cacheKey, value) {
	const result = validateJsonSchemaValue({
		schema,
		cacheKey,
		value,
		applyDefaults: true
	});
	if (result.ok) return {
		success: true,
		data: result.value
	};
	return {
		success: false,
		issues: result.errors.map((issue) => ({
			path: toIssuePath(issue.path),
			message: issue.message
		}))
	};
}
/** Build a channel config schema from JSON Schema with runtime validation/default support. */
function buildJsonChannelConfigSchema(schema, options) {
	return {
		schema,
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: options?.runtime ?? { safeParse: (value) => safeParseJsonSchema(schema, options?.cacheKey ?? "channel-config-schema:json", value) }
	};
}
/** Build a channel config schema from Zod, exporting JSON Schema when available. */
function buildChannelConfigSchema(schema, options) {
	const schemaWithJson = schema;
	if (typeof schemaWithJson.toJSONSchema === "function") return {
		schema: schemaWithJson.toJSONSchema({
			target: "draft-07",
			...options?.jsonSchemaMode ? { io: options.jsonSchemaMode } : {},
			unrepresentable: "any"
		}),
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
	return {
		schema: {
			type: "object",
			additionalProperties: true
		},
		...options?.uiHints ? { uiHints: options.uiHints } : {},
		runtime: { safeParse: (value) => safeParseRuntimeSchema(schema, value) }
	};
}
/** Return a channel config schema for channels that intentionally accept no config keys. */
function emptyChannelConfigSchema() {
	return {
		schema: {
			type: "object",
			additionalProperties: false,
			properties: {}
		},
		runtime: { safeParse(value) {
			if (value === void 0) return {
				success: true,
				data: void 0
			};
			if (!value || typeof value !== "object" || Array.isArray(value)) return {
				success: false,
				issues: [{
					path: [],
					message: "expected config object"
				}]
			};
			if (Object.keys(value).length > 0) return {
				success: false,
				issues: [{
					path: [],
					message: "config must be empty"
				}]
			};
			return {
				success: true,
				data: value
			};
		} }
	};
}
//#endregion
export { buildChannelConfigSchema as a, buildMultiAccountChannelSchema as c, buildCatchallMultiAccountChannelSchema as i, buildNestedDmConfigSchema as l, ChannelGroupEntrySchema as n, buildGroupEntrySchema as o, ChannelMentionPatternsSchemas as r, buildJsonChannelConfigSchema as s, AllowFromListSchema as t, emptyChannelConfigSchema as u };
