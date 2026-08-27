import { createChannelConfigUiHints } from "openclaw/plugin-sdk/channel-core";
import { isRecord, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, resolveAccountEntry } from "openclaw/plugin-sdk/account-resolution";
import { ChannelDeliveryStreamingConfigSchema, ChannelSendReadReceiptsSchema, ExecutableTokenSchema, ReplyToModeSchema, buildChannelConfigSchema, buildChannelReactionShape, buildCommonChannelAccountShape, buildGroupEntrySchema, requireAllowlistAllowFrom, requireOpenAllowFrom } from "openclaw/plugin-sdk/channel-config-schema";
import { z } from "zod";
//#region extensions/signal/src/config-ui-hints.ts
const signalChannelConfigUiHints = {
	"": {
		label: "Signal",
		help: "Signal channel provider configuration including account identity and DM policy behavior. Keep account mapping explicit so routing remains stable across multi-device setups."
	},
	...createChannelConfigUiHints({
		channelLabel: "Signal",
		dmPolicy: { channelKey: "signal" },
		configWrites: true
	}),
	account: {
		label: "Signal Account",
		help: "Signal account identifier (phone/number handle) used to bind this channel config to a specific Signal identity. Keep this aligned with your linked device/session state.",
		presentation: "phone-number"
	},
	allowFrom: { presentation: "phone-number" },
	defaultTo: { presentation: "phone-number" },
	groupAllowFrom: { presentation: "phone-number" },
	reactionAllowlist: { presentation: "phone-number" },
	"accounts.*.account": { presentation: "phone-number" },
	"accounts.*.allowFrom.*": { presentation: "phone-number" },
	"accounts.*.defaultTo": { presentation: "phone-number" },
	"accounts.*.groupAllowFrom.*": { presentation: "phone-number" },
	"accounts.*.reactionAllowlist.*": { presentation: "phone-number" },
	transport: {
		label: "Signal Transport",
		help: "Account-owned native process or external endpoint configuration. Named accounts do not inherit this value."
	},
	"transport.kind": {
		label: "Signal Transport Kind",
		help: "Use managed-native to let OpenClaw start signal-cli, external-native for an existing native daemon, or container for signal-cli-rest-api."
	},
	"transport.configPath": {
		label: "Signal CLI Config Path",
		help: "Optional directory passed to signal-cli via --config when the service needs a non-default signal-cli data path."
	},
	"transport.url": {
		label: "Signal Transport URL",
		help: "Base URL for an external-native or container transport, or the connection endpoint for a managed-native daemon when it differs from the bind address."
	}
};
//#endregion
//#region extensions/signal/src/config-schema.ts
const SIGNAL_RETIRED_TRANSPORT_KEYS = [
	"apiMode",
	"configPath",
	"httpUrl",
	"httpHost",
	"httpPort",
	"cliPath",
	"autoStart",
	"startupTimeoutMs",
	"receiveMode",
	"ignoreStories"
];
const SignalTransportUrlSchema = z.string().url().regex(/^[Hh][Tt][Tt][Pp][Ss]?:\/\/(?![^/?#]*@)/, "Expected http:// or https:// URL without embedded credentials");
function projectSignalConfigForUpdateValidation(value) {
	if (process.env.OPENCLAW_UPDATE_IN_PROGRESS !== "1" || !isRecord(value)) return value;
	const next = { ...value };
	for (const key of SIGNAL_RETIRED_TRANSPORT_KEYS) delete next[key];
	if (isRecord(value.accounts)) next.accounts = Object.fromEntries(Object.entries(value.accounts).map(([accountId, account]) => {
		if (!isRecord(account)) return [accountId, account];
		const nextAccount = { ...account };
		for (const key of SIGNAL_RETIRED_TRANSPORT_KEYS) delete nextAccount[key];
		return [accountId, nextAccount];
	}));
	return next;
}
const SignalTransportSchema = z.discriminatedUnion("kind", [
	z.object({
		kind: z.literal("managed-native"),
		configPath: z.string().optional(),
		url: SignalTransportUrlSchema.optional(),
		httpHost: z.string().optional(),
		httpPort: z.number().int().min(1).max(65535).optional(),
		cliPath: ExecutableTokenSchema.optional(),
		startupTimeoutMs: z.number().int().min(1e3).max(12e4).optional(),
		receiveMode: z.union([z.literal("on-start"), z.literal("manual")]).optional(),
		ignoreStories: z.boolean().optional()
	}).strict(),
	z.object({
		kind: z.literal("external-native"),
		url: SignalTransportUrlSchema
	}).strict(),
	z.object({
		kind: z.literal("container"),
		url: SignalTransportUrlSchema
	}).strict()
]);
const DirectGroupReplyToModeByChatTypeSchema = z.object({
	direct: ReplyToModeSchema.optional(),
	group: ReplyToModeSchema.optional()
}).strict();
const SignalGroupEntrySchema = buildGroupEntrySchema({ ingest: z.boolean().optional() }, { omit: [
	"skills",
	"enabled",
	"allowFrom",
	"systemPrompt"
] });
const SignalGroupsSchema = z.record(z.string(), SignalGroupEntrySchema.optional()).optional();
const SignalAccountSchemaBase = z.object({
	...buildCommonChannelAccountShape({
		useDefaults: true,
		omit: ["mentionPatterns"],
		streaming: ChannelDeliveryStreamingConfigSchema.optional(),
		mediaMaxMb: z.number().int().positive().optional()
	}),
	account: z.string().optional(),
	accountUuid: z.string().optional(),
	transport: SignalTransportSchema.optional(),
	ignoreAttachments: z.boolean().optional(),
	sendReadReceipts: ChannelSendReadReceiptsSchema,
	aliases: z.record(z.string(), z.string()).optional(),
	groups: SignalGroupsSchema,
	replyToModeByChatType: DirectGroupReplyToModeByChatTypeSchema.optional(),
	...buildChannelReactionShape({
		notificationModes: [
			"off",
			"own",
			"all",
			"allowlist"
		],
		reactionAllowlist: true,
		reactionLevels: [
			"off",
			"ack",
			"minimal",
			"extensive"
		]
	}),
	actions: z.object({ reactions: z.boolean().optional() }).strict().optional()
}).strict();
const SignalConfigSchemaBase = SignalAccountSchemaBase.extend({
	accounts: z.record(z.string(), SignalAccountSchemaBase.optional()).optional(),
	defaultAccount: z.string().optional()
});
function validateSignalConfigAllowFrom(value, ctx) {
	requireOpenAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.signal.dmPolicy=\"open\" requires channels.signal.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: value.dmPolicy,
		allowFrom: value.allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.signal.dmPolicy=\"allowlist\" requires channels.signal.allowFrom to contain at least one sender ID"
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
			message: "channels.signal.accounts.*.dmPolicy=\"open\" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to include \"*\""
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
			message: "channels.signal.accounts.*.dmPolicy=\"allowlist\" requires channels.signal.accounts.*.allowFrom (or channels.signal.allowFrom) to contain at least one sender ID"
		});
	}
}
function validateSignalContainerAccounts(value, ctx) {
	const defaultAccount = resolveAccountEntry(value.accounts, DEFAULT_ACCOUNT_ID);
	const effectiveDefaultAccount = defaultAccount?.account === void 0 ? value.account : defaultAccount.account;
	const channelEnabled = value.enabled !== false;
	const defaultEnabled = defaultAccount?.enabled !== false;
	if (value.transport?.kind === "container" && channelEnabled && defaultEnabled && !normalizeOptionalString(effectiveDefaultAccount)) ctx.addIssue({
		code: z.ZodIssueCode.custom,
		message: "channels.signal container transport requires an account number on the channel or default account",
		path: ["account"]
	});
	for (const [accountId, account] of Object.entries(value.accounts ?? {})) {
		if (!account || !channelEnabled || account.enabled === false) continue;
		const isDefaultAccount = normalizeAccountId(accountId) === DEFAULT_ACCOUNT_ID;
		if ((isDefaultAccount && value.transport ? value.transport : account.transport)?.kind !== "container" || isDefaultAccount && value.transport) continue;
		if (!normalizeOptionalString(account.account === void 0 ? value.account : account.account)) ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "channels.signal account container transport requires an account number on the account or channel",
			path: [
				"accounts",
				accountId,
				"account"
			]
		});
	}
}
const CanonicalSignalConfigSchema = SignalConfigSchemaBase.superRefine((value, ctx) => {
	validateSignalConfigAllowFrom(value, ctx);
	validateSignalContainerAccounts(value, ctx);
});
const SignalConfigSchema = z.preprocess(projectSignalConfigForUpdateValidation, CanonicalSignalConfigSchema);
const SignalChannelConfigSchema = buildChannelConfigSchema(SignalConfigSchema, { uiHints: signalChannelConfigUiHints });
//#endregion
export { SignalConfigSchema as n, SignalChannelConfigSchema as t };
