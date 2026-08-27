import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { B as requireOpenAllowFrom, E as SecretRefSchema, r as ChannelDeliveryStreamingConfigSchema, s as DmPolicySchema, z as requireAllowlistAllowFrom } from "./zod-schema.core-CTdpjCBO.js";
import { n as sensitive } from "./zod-schema.sensitive-OPEpgIMg.js";
import { o as buildGroupEntrySchema } from "./config-schema-ikPYPY3Q.js";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, n as createLazyFacadeObjectValue } from "./facade-loader-BwQ2fefX.js";
import { t as ChannelBotLoopProtectionSchema } from "./zod-schema.channels-config-D6JdoD4u.js";
import { t as resolveAccountEntry } from "./account-lookup-CaTe6-6f.js";
import { l as buildChannelReactionShape, r as ChannelSendReadReceiptsSchema, s as buildChannelAllowBotsSchema, t as ChannelDangerouslyAllowNameMatchingSchema, u as buildCommonChannelAccountShape } from "./channel-config-schema-DeVmAx-r.js";
//#region src/config/zod-schema.providers-googlechat.ts
const GoogleChatDmSchema = object({ enabled: boolean().optional() }).strict();
const GoogleChatGroupSchema = object({
	enabled: boolean().optional(),
	requireMention: boolean().optional(),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	users: array(union([string(), number()])).optional(),
	systemPrompt: string().optional()
}).strict();
const GoogleChatAccountSchemaBase = object({
	...buildCommonChannelAccountShape({
		groupPolicyDefault: true,
		omit: ["mentionPatterns"],
		streaming: ChannelDeliveryStreamingConfigSchema.optional()
	}),
	allowBots: buildChannelAllowBotsSchema(),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	dangerouslyAllowNameMatching: ChannelDangerouslyAllowNameMatchingSchema,
	requireMention: boolean().optional(),
	groups: record(string(), GoogleChatGroupSchema.optional()).optional(),
	serviceAccount: union([
		string(),
		record(string(), unknown()),
		SecretRefSchema
	]).optional().register(sensitive),
	serviceAccountFile: string().optional(),
	audienceType: _enum(["app-url", "project-number"]).optional(),
	audience: string().optional(),
	appPrincipal: string().optional(),
	webhookPath: string().optional(),
	webhookUrl: string().optional(),
	botUser: string().optional(),
	dm: GoogleChatDmSchema.optional(),
	typingIndicator: _enum([
		"none",
		"message",
		"reaction"
	]).optional()
}).strict();
const GoogleChatConfigSchema = GoogleChatAccountSchemaBase.extend({
	dmPolicy: DmPolicySchema.optional().default("pairing"),
	accounts: record(string(), GoogleChatAccountSchemaBase.optional()).optional(),
	defaultAccount: string().optional()
}).superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dmPolicy=\"open\" requires channels.googlechat.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.googlechat.dmPolicy=\"allowlist\" requires channels.googlechat.allowFrom to contain at least one sender ID"
	});
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? value.allowFrom;
		requireOpenAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.googlechat.accounts.*.dmPolicy=\"open\" requires channels.googlechat.accounts.*.allowFrom (or channels.googlechat.allowFrom) to include \"*\""
		});
		requireAllowlistAllowFrom({
			policy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.googlechat.accounts.*.dmPolicy=\"allowlist\" requires channels.googlechat.accounts.*.allowFrom (or channels.googlechat.allowFrom) to contain at least one sender ID"
		});
	}
});
//#endregion
//#region src/config/zod-schema.providers-whatsapp.ts
const WhatsAppGroupEntrySchema = buildGroupEntrySchema(void 0, { omit: [
	"skills",
	"enabled",
	"allowFrom"
] }).optional();
const WhatsAppGroupsSchema = record(string(), WhatsAppGroupEntrySchema).optional();
const WhatsAppDirectEntrySchema = object({ systemPrompt: string().optional() }).strict().optional();
const WhatsAppDirectSchema = record(string(), WhatsAppDirectEntrySchema).optional();
const WhatsAppPluginHooksSchema = object({ messageReceived: boolean().optional() }).strict().optional();
function buildWhatsAppCommonShape(params) {
	return {
		...buildCommonChannelAccountShape({
			useDefaults: params.useDefaults,
			omit: ["name"],
			allowFrom: array(string()).optional(),
			groupAllowFrom: array(string()).optional(),
			streaming: ChannelDeliveryStreamingConfigSchema.optional(),
			mediaMaxMb: number().int().positive().optional()
		}),
		sendReadReceipts: ChannelSendReadReceiptsSchema,
		selfChatMode: boolean().optional(),
		groups: WhatsAppGroupsSchema,
		direct: WhatsAppDirectSchema,
		...buildChannelReactionShape({ reactionLevels: [
			"off",
			"ack",
			"minimal",
			"extensive"
		] }),
		pluginHooks: WhatsAppPluginHooksSchema
	};
}
function enforceOpenDmPolicyAllowFromStar(params) {
	if (params.dmPolicy !== "open") return;
	if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).includes("*")) return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
function enforceAllowlistDmPolicyAllowFrom(params) {
	if (params.dmPolicy !== "allowlist") return;
	if (normalizeStringEntries(Array.isArray(params.allowFrom) ? params.allowFrom : []).length > 0) return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path ?? ["allowFrom"],
		message: params.message
	});
}
const WhatsAppAccountSchema = object({
	...buildWhatsAppCommonShape({ useDefaults: false }),
	name: string().optional(),
	/** Override auth directory for this WhatsApp account (Baileys multi-file auth state). */
	authDir: string().optional(),
	mediaMaxMb: number().int().positive().optional()
}).strict();
const WhatsAppConfigSchema = object({
	...buildWhatsAppCommonShape({ useDefaults: true }),
	accounts: record(string(), WhatsAppAccountSchema.optional()).optional(),
	defaultAccount: string().optional(),
	mediaMaxMb: number().int().positive().optional().default(50),
	actions: object({
		reactions: boolean().optional(),
		sendMessage: boolean().optional(),
		polls: boolean().optional(),
		calls: boolean().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	const defaultAccount = resolveAccountEntry(value.accounts, "default");
	enforceOpenDmPolicyAllowFromStar({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"open\" requires channels.whatsapp.allowFrom to include \"*\""
	});
	enforceAllowlistDmPolicyAllowFrom({
		dmPolicy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		message: "channels.whatsapp.dmPolicy=\"allowlist\" requires channels.whatsapp.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? (accountId === "default" ? void 0 : defaultAccount?.dmPolicy) ?? value.dmPolicy;
		const effectiveAllowFrom = account.allowFrom ?? (accountId === "default" ? void 0 : defaultAccount?.allowFrom) ?? value.allowFrom;
		enforceOpenDmPolicyAllowFromStar({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"open\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to include \"*\""
		});
		enforceAllowlistDmPolicyAllowFrom({
			dmPolicy: effectivePolicy,
			allowFrom: effectiveAllowFrom,
			ctx,
			path: [
				"accounts",
				accountId,
				"allowFrom"
			],
			message: "channels.whatsapp.accounts.*.dmPolicy=\"allowlist\" requires channels.whatsapp.accounts.*.allowFrom (or channels.whatsapp.allowFrom) to contain at least one sender ID"
		});
	}
});
//#endregion
//#region src/plugin-sdk/bundled-channel-config-schema.ts
/**
* Bundled-channel config schemas for OpenClaw-maintained plugins.
*
* Third-party plugins should define plugin-local schemas and import primitives
* from openclaw/plugin-sdk/channel-config-schema instead of depending on these
* bundled channel schemas. Internal callers use this subpath only for the
* bundled provider schemas; generic primitives come from channel-config-schema.
*/
function createLegacyExternalChannelConfigSchema() {
	return object({}).passthrough();
}
/**
* @deprecated Compatibility for external channel packages published through 2026.7.1.
* Their package manifests remain the validation owner. Remove after the minimum supported
* Slack, Discord, Signal, and Teams packages use plugin-owned config schemas.
*/
const SlackConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const DiscordConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const SignalConfigSchema = createLegacyExternalChannelConfigSchema();
/** @deprecated See SlackConfigSchema. */
const MSTeamsConfigSchema = createLegacyExternalChannelConfigSchema();
function loadBundledConfigSchema(dirName, exportName) {
	const schema = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName,
		artifactBasename: "config-api.js"
	})[exportName];
	if (!schema) throw new Error(`Bundled plugin ${dirName} config API does not export ${exportName}`);
	return schema;
}
const IMessageConfigSchema = createLazyFacadeObjectValue(() => loadBundledConfigSchema("imessage", "IMessageConfigSchema"));
const TelegramConfigSchema = createLazyFacadeObjectValue(() => loadBundledConfigSchema("telegram", "TelegramConfigSchema"));
//#endregion
export { SlackConfigSchema as a, GoogleChatConfigSchema as c, SignalConfigSchema as i, IMessageConfigSchema as n, TelegramConfigSchema as o, MSTeamsConfigSchema as r, WhatsAppConfigSchema as s, DiscordConfigSchema as t };
