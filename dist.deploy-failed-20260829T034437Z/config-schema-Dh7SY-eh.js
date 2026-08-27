import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { l as ToolPolicySchema } from "./zod-schema.agent-runtime-WXtAE1HE.js";
import { B as requireOpenAllowFrom, h as MSTeamsReplyStyleSchema, z as requireAllowlistAllowFrom } from "./zod-schema.core-CTdpjCBO.js";
import { a as buildChannelConfigSchema } from "./config-schema-ikPYPY3Q.js";
import { i as registerSensitiveConfigSchema, r as buildSecretInputSchema } from "./secret-input-bJBlHnFk.js";
import { t as createChannelConfigUiHints } from "./channel-config-ui-hints-CB6QeFAR.js";
import { n as ChannelPreviewStreamingConfigSchema, t as ChannelDangerouslyAllowNameMatchingSchema, u as buildCommonChannelAccountShape } from "./channel-config-schema-DeVmAx-r.js";
import "./channel-core-CyDgaJnW.js";
//#region extensions/msteams/src/config-ui-hints.ts
const msTeamsChannelConfigUiHints = {
	"": {
		label: "MS Teams",
		help: "Microsoft Teams channel provider configuration and provider-specific policy toggles. Use this section to isolate Teams behavior from other enterprise chat providers."
	},
	configWrites: {
		label: "MS Teams Config Writes",
		help: "Allow Microsoft Teams to write config in response to channel events/commands (default: true)."
	},
	cloud: {
		label: "MS Teams Cloud",
		help: "Teams SDK cloud environment for auth, token validation, and token services: \"Public\", \"USGov\", \"USGovDoD\", or \"China\" (default: Public)."
	},
	serviceUrl: {
		label: "MS Teams Service URL",
		help: "Bot Connector service URL for SDK proactive sends/edits/deletes. Set with cloud for USGov/DoD; set alone for GCC."
	},
	graphMediaFallback: {
		label: "MS Teams Graph Media Fallback",
		help: "Query Microsoft Graph for unresolved channel or group-chat HTML media. Adds one lookup per matching message when enabled (default: false)."
	},
	...createChannelConfigUiHints({
		channelLabel: "MS Teams",
		streaming: { "": {
			label: "MS Teams Streaming",
			help: "Microsoft Teams preview/progress streaming mode: \"off\" | \"partial\" | \"block\" | \"progress\". Personal chats use Teams native streaminfo progress when available."
		} },
		progress: {
			labels: "openclaw",
			titleWording: true
		}
	})
};
//#endregion
//#region extensions/msteams/src/config-schema.ts
const SecretInputSchema = buildSecretInputSchema();
const ToolPolicyBySenderSchema = record(string(), ToolPolicySchema).optional();
const MSTeamsChannelSchema = object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: MSTeamsReplyStyleSchema.optional()
}).strict();
const MSTeamsTeamSchema = object({
	requireMention: boolean().optional(),
	tools: ToolPolicySchema,
	toolsBySender: ToolPolicyBySenderSchema,
	replyStyle: MSTeamsReplyStyleSchema.optional(),
	channels: record(string(), MSTeamsChannelSchema.optional()).optional()
}).strict();
const MSTEAMS_SERVICE_URL_HOST_ALLOWLIST = [
	"smba.trafficmanager.net",
	"smba.infra.gcc.teams.microsoft.com",
	"smba.infra.gov.teams.microsoft.us",
	"smba.infra.dod.teams.microsoft.us",
	"botframework.azure.cn"
];
function isAllowedMSTeamsServiceUrl(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "https:") return false;
		const host = parsed.hostname.toLowerCase();
		return MSTEAMS_SERVICE_URL_HOST_ALLOWLIST.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
	} catch {
		return false;
	}
}
function isAzureChinaBotFrameworkServiceUrl(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "https:") return false;
		const host = parsed.hostname.toLowerCase();
		return host === "botframework.azure.cn" || host.endsWith(".botframework.azure.cn");
	} catch {
		return false;
	}
}
const MSTeamsChannelConfigSchema = buildChannelConfigSchema(object({
	...buildCommonChannelAccountShape({
		useDefaults: true,
		omit: [
			"name",
			"mentionPatterns",
			"replyToMode"
		],
		allowFrom: array(string()).optional(),
		groupAllowFrom: array(string()).optional(),
		streaming: ChannelPreviewStreamingConfigSchema.optional()
	}),
	dangerouslyAllowNameMatching: ChannelDangerouslyAllowNameMatchingSchema,
	appId: string().optional(),
	appPassword: registerSensitiveConfigSchema(SecretInputSchema.optional()),
	tenantId: string().optional(),
	cloud: _enum([
		"Public",
		"USGov",
		"USGovDoD",
		"China"
	]).optional(),
	serviceUrl: string().url().refine(isAllowedMSTeamsServiceUrl, { message: "channels.msteams.serviceUrl must use a supported Microsoft Teams Bot Connector host" }).optional(),
	authType: _enum(["secret", "federated"]).optional(),
	certificatePath: string().optional(),
	certificateThumbprint: string().optional(),
	useManagedIdentity: boolean().optional(),
	managedIdentityClientId: string().optional(),
	webhook: object({
		port: number().int().positive().optional(),
		path: string().optional()
	}).strict().optional(),
	typingIndicator: boolean().optional(),
	mediaAllowHosts: array(string()).optional(),
	mediaAuthAllowHosts: array(string()).optional(),
	graphMediaFallback: boolean().optional(),
	requireMention: boolean().optional(),
	replyStyle: MSTeamsReplyStyleSchema.optional(),
	teams: record(string(), MSTeamsTeamSchema.optional()).optional(),
	/** Max inbound and outbound media size in MB (default: 100MB). */
	/** SharePoint site ID for file uploads in group chats/channels (e.g., "contoso.sharepoint.com,guid1,guid2") */
	sharePointSiteId: string().optional(),
	welcomeCard: boolean().optional(),
	promptStarters: array(string()).optional(),
	groupWelcomeCard: boolean().optional(),
	feedbackEnabled: boolean().optional(),
	feedbackReflection: boolean().optional(),
	feedbackReflectionCooldownMs: number().int().min(0).optional(),
	delegatedAuth: object({
		enabled: boolean().optional(),
		scopes: array(string()).optional()
	}).strict().optional(),
	sso: object({
		enabled: boolean().optional(),
		connectionName: string().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.msteams.dmPolicy=\"open\" requires channels.msteams.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.msteams.dmPolicy=\"allowlist\" requires channels.msteams.allowFrom to contain at least one sender ID"
	});
	if (value.sso?.enabled === true && !value.sso.connectionName?.trim()) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["sso", "connectionName"],
		message: "channels.msteams.sso.enabled=true requires channels.msteams.sso.connectionName to identify the Bot Framework OAuth connection"
	});
	if (value.cloud && value.cloud !== "Public" && value.cloud !== "China" && !value.serviceUrl?.trim()) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["serviceUrl"],
		message: "channels.msteams.cloud requires channels.msteams.serviceUrl for non-public Teams clouds"
	});
	if (value.cloud === "China" && value.serviceUrl?.trim() && !isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["serviceUrl"],
		message: "channels.msteams.cloud=China requires channels.msteams.serviceUrl to use an Azure China Bot Framework channel host"
	});
	if (value.cloud !== "China" && value.serviceUrl?.trim() && isAzureChinaBotFrameworkServiceUrl(value.serviceUrl)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["cloud"],
		message: "Azure China Bot Framework serviceUrl hosts require channels.msteams.cloud=China"
	});
}), { uiHints: msTeamsChannelConfigUiHints });
//#endregion
export { MSTeamsChannelConfigSchema as t };
