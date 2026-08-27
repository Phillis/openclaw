import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-C7gqXY2T.js";
import { _ as MentionPatternsPolicySchema, a as ContextVisibilityModeSchema, g as MarkdownConfigSchema, n as BlockStreamingCoalesceSchema, u as GroupPolicySchema } from "./zod-schema.core-D1Ak_xoR.js";
import { a as buildChannelConfigSchema, l as buildNestedDmConfigSchema, o as buildGroupEntrySchema, t as AllowFromListSchema } from "./config-schema-C8KVhsqS.js";
import { a as createScopedChannelConfigAdapter, t as adaptScopedAccountAccessor } from "./channel-config-helpers-C6dKYMZI.js";
import { n as describeAccountSnapshot } from "./account-helpers-CEliAVvN.js";
import { r as buildSecretInputSchema } from "./secret-input-CkeFVjF0.js";
import { t as createChannelConfigUiHints } from "./channel-config-ui-hints-n0RsDUR5.js";
import "./channel-config-schema-Heqt9qxQ.js";
import "./channel-core-DqKFW3vi.js";
import { a as resolveMatrixAccountConfig } from "./account-config-BBbAX8mT.js";
import { i as resolveMatrixAccount, r as resolveDefaultMatrixAccountId, t as listMatrixAccountIds } from "./accounts-CfCyqoAF.js";
import { t as normalizeMatrixAllowList } from "./allowlist-B7PQrrUU.js";
import { r as matrixSetupContract, t as createMatrixSetupWizardProxy } from "./setup-core-k3slpyju.js";
//#region extensions/matrix/src/config-adapter.ts
const matrixConfigAdapter = createScopedChannelConfigAdapter({
	sectionKey: "matrix",
	listAccountIds: listMatrixAccountIds,
	resolveAccount: adaptScopedAccountAccessor(resolveMatrixAccount),
	resolveAccessorAccount: ({ cfg, accountId }) => resolveMatrixAccountConfig({
		cfg,
		accountId
	}),
	defaultAccountId: resolveDefaultMatrixAccountId,
	clearBaseFields: [
		"name",
		"homeserver",
		"network",
		"proxy",
		"userId",
		"accessToken",
		"password",
		"deviceId",
		"deviceName",
		"avatarUrl",
		"initialSyncLimit"
	],
	resolveAllowFrom: (account) => account.dm?.allowFrom,
	formatAllowFrom: (allowFrom) => normalizeMatrixAllowList(allowFrom)
});
//#endregion
//#region extensions/matrix/src/config-ui-hints.ts
const matrixChannelConfigUiHints = {
	...createChannelConfigUiHints({
		channelLabel: "Matrix",
		mentionPatterns: {
			targetDescription: "Matrix room IDs",
			policyNote: "Native Matrix mention evidence still triggers even when regex patterns are denied.",
			denyNote: "Native mention evidence still triggers."
		}
	}),
	allowBots: {
		label: "Matrix Allow Bot Messages",
		help: "Allow messages from other configured Matrix bot accounts to trigger replies (default: false). Set \"mentions\" to require a visible room mention."
	},
	botLoopProtection: {
		label: "Matrix Bot Loop Protection",
		help: "Sliding-window guard for accepted Matrix configured-bot loops. Default is enabled whenever allowBots lets configured bot messages reach dispatch."
	},
	"botLoopProtection.enabled": {
		label: "Matrix Bot Loop Protection Enabled",
		help: "Enable the bot-pair loop guard. Defaults to true when allowBots is true or \"mentions\", and false when configured bot messages are ignored."
	},
	"botLoopProtection.maxEventsPerWindow": {
		label: "Matrix Bot Loop Events per Window",
		help: "Maximum accepted bot-pair messages within the sliding window before suppression starts. Default: 20."
	},
	"botLoopProtection.windowSeconds": {
		label: "Matrix Bot Loop Window Seconds",
		help: "Sliding window length for counting bot-pair messages. Default: 60."
	},
	"botLoopProtection.cooldownSeconds": {
		label: "Matrix Bot Loop Cooldown Seconds",
		help: "How long to suppress the bot pair after it exceeds the budget. Default: 60."
	},
	dangerouslyAllowNameMatching: {
		label: "Matrix Display Name Matching",
		help: "Compatibility opt-in for resolving Matrix display names and joined room names in allowlists. Prefer full @user:server IDs and room IDs or aliases because names are mutable."
	},
	...createChannelConfigUiHints({
		channelLabel: "Matrix",
		progress: {}
	})
};
//#endregion
//#region extensions/matrix/src/config-schema.ts
const matrixActionSchema = object({
	reactions: boolean().optional(),
	messages: boolean().optional(),
	pins: boolean().optional(),
	profile: boolean().optional(),
	memberInfo: boolean().optional(),
	channelInfo: boolean().optional(),
	verification: boolean().optional()
}).optional();
const matrixThreadBindingsSchema = object({
	enabled: boolean().optional(),
	idleHours: number().nonnegative().optional(),
	maxAgeHours: number().nonnegative().optional(),
	spawnSessions: boolean().optional(),
	defaultSpawnContext: _enum(["isolated", "fork"]).optional()
}).optional();
const matrixExecApprovalsSchema = object({
	enabled: union([boolean(), literal("auto")]).optional(),
	approvers: AllowFromListSchema,
	agentFilter: array(string()).optional(),
	sessionFilter: array(string()).optional(),
	target: _enum([
		"dm",
		"channel",
		"both"
	]).optional()
}).optional();
const botLoopProtectionSchema = object({
	enabled: boolean().optional(),
	maxEventsPerWindow: number().int().positive().optional(),
	windowSeconds: number().int().positive().optional(),
	cooldownSeconds: number().int().positive().optional()
}).strict().optional();
const matrixRoomSchema = buildGroupEntrySchema({
	account: string().optional(),
	allowBots: union([boolean(), literal("mentions")]).optional(),
	botLoopProtection: botLoopProtectionSchema,
	autoReply: boolean().optional(),
	users: AllowFromListSchema
}).omit({
	toolsBySender: true,
	allowFrom: true
}).strict().optional();
const matrixNetworkSchema = object({ dangerouslyAllowPrivateNetwork: boolean().optional() }).strict().optional();
const matrixStreamingSchema = object({
	mode: _enum([
		"partial",
		"quiet",
		"progress",
		"off"
	]).optional(),
	chunkMode: _enum(["length", "newline"]).optional(),
	block: object({
		enabled: boolean().optional(),
		coalesce: BlockStreamingCoalesceSchema.optional()
	}).strict().optional(),
	progress: object({
		label: union([string(), literal(false)]).optional(),
		labels: array(string()).optional(),
		maxLines: number().int().positive().optional(),
		maxLineChars: number().int().positive().optional(),
		toolProgress: boolean().optional(),
		commandText: _enum(["raw", "status"]).optional()
	}).strict().optional(),
	preview: object({ toolProgress: boolean().optional() }).strict().optional()
}).strict();
const retiredMatrixAccountStreamingKeys = [
	"streamMode",
	"chunkMode",
	"blockStreaming",
	"blockStreamingCoalesce",
	"draftChunk"
];
function hasCanonicalMatrixAccountStreaming(account) {
	if (typeof account !== "object" || account === null || Array.isArray(account)) return true;
	if (retiredMatrixAccountStreamingKeys.some((key) => Object.hasOwn(account, key))) return false;
	if (!Object.hasOwn(account, "streaming")) return true;
	const streaming = account.streaming;
	return typeof streaming === "object" && streaming !== null && !Array.isArray(streaming);
}
const MatrixChannelConfigSchema = buildChannelConfigSchema(object({
	name: string().optional(),
	enabled: boolean().optional(),
	configWrites: boolean().optional(),
	defaultAccount: string().optional(),
	accounts: record(string(), unknown().refine(hasCanonicalMatrixAccountStreaming, { message: "flat or scalar streaming values are no longer supported; use streaming.* and run \"openclaw doctor --fix\"" })).optional(),
	markdown: MarkdownConfigSchema,
	homeserver: string().optional(),
	network: matrixNetworkSchema,
	proxy: string().optional(),
	userId: string().optional(),
	accessToken: buildSecretInputSchema().optional(),
	password: buildSecretInputSchema().optional(),
	deviceId: string().optional(),
	deviceName: string().optional(),
	avatarUrl: string().optional(),
	initialSyncLimit: number().optional(),
	encryption: boolean().optional(),
	allowlistOnly: boolean().optional(),
	dangerouslyAllowNameMatching: boolean().optional(),
	allowBots: union([boolean(), literal("mentions")]).optional(),
	botLoopProtection: botLoopProtectionSchema,
	groupPolicy: GroupPolicySchema.optional(),
	mentionPatterns: MentionPatternsPolicySchema.optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	streaming: matrixStreamingSchema.optional(),
	replyToMode: _enum([
		"off",
		"first",
		"all",
		"batched"
	]).optional(),
	threadReplies: _enum([
		"off",
		"inbound",
		"always"
	]).optional(),
	textChunkLimit: number().optional(),
	responsePrefix: string().optional(),
	ackReaction: string().optional(),
	ackReactionScope: _enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"none",
		"off"
	]).optional(),
	reactionNotifications: _enum(["off", "own"]).optional(),
	threadBindings: matrixThreadBindingsSchema,
	startupVerification: _enum(["off", "if-unverified"]).optional(),
	startupVerificationCooldownHours: number().optional(),
	mediaMaxMb: number().optional(),
	historyLimit: number().int().min(0).optional(),
	autoJoin: _enum([
		"always",
		"allowlist",
		"off"
	]).optional(),
	autoJoinAllowlist: AllowFromListSchema,
	groupAllowFrom: AllowFromListSchema,
	dm: buildNestedDmConfigSchema({
		sessionScope: _enum(["per-user", "per-room"]).optional(),
		threadReplies: _enum([
			"off",
			"inbound",
			"always"
		]).optional()
	}),
	execApprovals: matrixExecApprovalsSchema,
	groups: object({}).catchall(matrixRoomSchema).optional(),
	rooms: object({}).catchall(matrixRoomSchema).optional(),
	actions: matrixActionSchema
}), { uiHints: matrixChannelConfigUiHints });
const matrixPluginBase = {
	id: "matrix",
	meta: {
		id: "matrix",
		label: "Matrix",
		selectionLabel: "Matrix (plugin)",
		docsPath: "/channels/matrix",
		docsLabel: "matrix",
		blurb: "open protocol; configure a homeserver + access token.",
		order: 70,
		quickstartAllowFrom: true
	},
	setupWizard: createMatrixSetupWizardProxy(async () => ({ matrixSetupWizard: (await import("./setup-surface-BtGpYsxN.js")).matrixSetupWizard })),
	setupContract: matrixSetupContract,
	capabilities: {
		chatTypes: [
			"direct",
			"group",
			"thread"
		],
		polls: true,
		reactions: true,
		threads: true,
		media: true
	},
	reload: { configPrefixes: ["channels.matrix"] },
	configSchema: MatrixChannelConfigSchema,
	config: {
		...matrixConfigAdapter,
		isConfigured: (account) => account.configured,
		describeAccount: (account) => describeAccountSnapshot({
			account,
			configured: account.configured,
			extra: { baseUrl: account.homeserver }
		})
	}
};
const matrixSetupPlugin = {
	...matrixPluginBase,
	config: {
		...matrixPluginBase.config,
		hasConfiguredState: ({ cfg }) => resolveMatrixAccount({ cfg }).configured
	}
};
//#endregion
export { matrixSetupPlugin as n, matrixPluginBase as t };
