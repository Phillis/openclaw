import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, dn as literal, wn as number, yt as _enum } from "./schemas-C7gqXY2T.js";
import "./zod-schema.agent-runtime-2QFZPjK2.js";
import { C as ReplyToModeSchema, a as ContextVisibilityModeSchema, g as MarkdownConfigSchema, i as ChannelStreamingBlockSchema, k as TextChunkModeSchema, o as DmConfigSchema, r as ChannelDeliveryStreamingConfigSchema, s as DmPolicySchema, t as BlockStreamingChunkSchema, u as GroupPolicySchema } from "./zod-schema.core-D1Ak_xoR.js";
import { r as ChannelMentionPatternsSchemas } from "./config-schema-C8KVhsqS.js";
import { a as NativeExecApprovalEnableModeSchema, o as ChannelHealthMonitorSchema, s as ChannelHeartbeatVisibilitySchema } from "./zod-schema.channels-config-DkZP1G3R.js";
//#region src/config/zod-schema.channel-messaging-common.ts
const UnifiedStreamingModeSchema = _enum([
	"off",
	"partial",
	"block",
	"progress"
]);
const ChannelStreamingPreviewSchema = object({
	chunk: BlockStreamingChunkSchema.optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional()
}).strict();
const ChannelStreamingProgressSchema = object({
	label: union([string(), literal(false)]).optional(),
	labels: array(string()).optional(),
	maxLines: number().int().positive().optional(),
	maxLineChars: number().int().positive().optional(),
	toolProgress: boolean().optional(),
	commandText: _enum(["raw", "status"]).optional(),
	commentary: boolean().optional(),
	narration: boolean().optional()
}).strict();
const ChannelPreviewStreamingConfigSchema = object({
	mode: UnifiedStreamingModeSchema.optional(),
	chunkMode: TextChunkModeSchema.optional(),
	preview: ChannelStreamingPreviewSchema.optional(),
	progress: ChannelStreamingProgressSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
const CommonCapabilitiesSchema = array(string()).optional();
const CommonIdListSchema = array(union([string(), number()])).optional();
const CommonDefaultToSchema = string().optional();
const CommonMentionPatternsSchema = ChannelMentionPatternsSchemas.canonical.optional();
const CommonStreamingSchema = ChannelDeliveryStreamingConfigSchema.optional();
const CommonMediaMaxMbSchema = number().positive().optional();
const CommonReplyToModeSchema = ReplyToModeSchema.optional();
function createCommonChannelAccountShape(options) {
	return {
		name: string().optional(),
		capabilities: options.capabilities ?? CommonCapabilitiesSchema,
		markdown: MarkdownConfigSchema,
		configWrites: boolean().optional(),
		enabled: boolean().optional(),
		dmPolicy: options.useDefaults || options.dmPolicyDefault ? DmPolicySchema.optional().default("pairing") : DmPolicySchema.optional(),
		allowFrom: options.allowFrom ?? CommonIdListSchema,
		defaultTo: options.defaultTo ?? CommonDefaultToSchema,
		groupAllowFrom: options.groupAllowFrom ?? CommonIdListSchema,
		groupPolicy: options.useDefaults || options.groupPolicyDefault ? GroupPolicySchema.optional().default("allowlist") : GroupPolicySchema.optional(),
		mentionPatterns: options.mentionPatterns ?? CommonMentionPatternsSchema,
		contextVisibility: ContextVisibilityModeSchema.optional(),
		historyLimit: number().int().min(0).optional(),
		dmHistoryLimit: number().int().min(0).optional(),
		dms: record(string(), DmConfigSchema.optional()).optional(),
		textChunkLimit: number().int().positive().optional(),
		streaming: options.streaming ?? CommonStreamingSchema,
		heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
		healthMonitor: ChannelHealthMonitorSchema,
		responsePrefix: string().optional(),
		mediaMaxMb: options.mediaMaxMb ?? CommonMediaMaxMbSchema,
		replyToMode: options.replyToMode ?? CommonReplyToModeSchema
	};
}
/** Build shared channel account leaves while preserving channel-specific omissions and schemas. */
function buildCommonChannelAccountShape(options = {}) {
	const shape = createCommonChannelAccountShape(options);
	const omitted = new Set(options.omit ?? []);
	return Object.fromEntries(Object.entries(shape).filter(([key]) => !omitted.has(key)));
}
const ChannelDangerouslyAllowNameMatchingSchema = boolean().optional();
const ChannelSendReadReceiptsSchema = boolean().optional();
/** Build the shared allowBots leaf without widening boolean-only channels. */
function buildChannelAllowBotsSchema(options) {
	return options?.allowMentions ? union([boolean(), literal("mentions")]).optional() : boolean().optional();
}
/** Build native exec-approval routing with channel-specific approver ids and extras. */
function buildChannelExecApprovalsSchema(approverSchema, extraShape) {
	return object({
		enabled: NativeExecApprovalEnableModeSchema.optional(),
		approvers: array(approverSchema).optional(),
		agentFilter: array(string()).optional(),
		sessionFilter: array(string()).optional(),
		target: _enum([
			"dm",
			"channel",
			"both"
		]).optional(),
		...extraShape ?? {}
	}).strict().optional();
}
/** Build the repeated reaction leaves while retaining each channel's exact enum. */
function buildChannelReactionShape(options) {
	return {
		...options.notificationModes ? { reactionNotifications: _enum(options.notificationModes).optional() } : {},
		...options.reactionAllowlist ? { reactionAllowlist: array(union([string(), number()])).optional() } : {},
		...options.reactionLevels ? { reactionLevel: _enum(options.reactionLevels).optional() } : {},
		...options.ackReaction ? { ackReaction: options.ackReaction } : {}
	};
}
//#endregion
export { ChannelStreamingProgressSchema as a, buildChannelExecApprovalsSchema as c, ChannelStreamingPreviewSchema as i, buildChannelReactionShape as l, ChannelPreviewStreamingConfigSchema as n, UnifiedStreamingModeSchema as o, ChannelSendReadReceiptsSchema as r, buildChannelAllowBotsSchema as s, ChannelDangerouslyAllowNameMatchingSchema as t, buildCommonChannelAccountShape as u };
