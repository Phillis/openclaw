import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { a as ContextVisibilityModeSchema, u as GroupPolicySchema } from "./zod-schema.core-CTdpjCBO.js";
//#region src/config/zod-schema.channels.ts
/** Optional heartbeat visibility controls shared by channel schemas. */
const ChannelHeartbeatVisibilitySchema = object({
	showOk: boolean().optional(),
	showAlerts: boolean().optional(),
	useIndicator: boolean().optional()
}).strict().optional();
const ChannelHealthMonitorSchema = object({ enabled: boolean().optional() }).strict().optional();
//#endregion
//#region src/config/zod-schema.approvals.ts
/** Native exec approval mode accepted by config. */
const NativeExecApprovalEnableModeSchema = union([boolean(), literal("auto")]);
const ExecApprovalForwardTargetSchema = object({
	channel: string().min(1),
	to: string().min(1),
	accountId: string().optional(),
	threadId: union([string(), number()]).optional()
}).strict();
const ExecApprovalForwardingSchema = object({
	enabled: boolean().optional(),
	mode: union([
		literal("session"),
		literal("targets"),
		literal("both")
	]).optional(),
	agentFilter: array(string()).optional(),
	sessionFilter: array(string()).optional(),
	targets: array(ExecApprovalForwardTargetSchema).optional()
}).strict().optional();
const ApprovalsSchema = object({
	exec: ExecApprovalForwardingSchema,
	plugin: ExecApprovalForwardingSchema
}).strict().optional();
//#endregion
//#region src/config/zod-schema.implicit-mentions.ts
const ChannelImplicitMentionsSchema = object({
	replyToBot: boolean().optional(),
	quotedBot: boolean().optional(),
	threadParticipation: boolean().optional()
}).strict();
//#endregion
//#region src/config/zod-schema.channels-config.ts
const ChannelModelByChannelSchema = record(string(), record(string(), string())).optional();
const ChannelBotLoopProtectionSchema = object({
	enabled: boolean().optional(),
	maxEventsPerWindow: number().int().positive().optional(),
	windowSeconds: number().int().positive().optional(),
	cooldownSeconds: number().int().positive().optional()
}).strict();
function addLegacyChannelAcpBindingIssues(value, ctx, path = []) {
	if (!value || typeof value !== "object") return;
	if (Array.isArray(value)) {
		value.forEach((entry, index) => addLegacyChannelAcpBindingIssues(entry, ctx, [...path, index]));
		return;
	}
	const record = value;
	const bindings = record.bindings;
	if (bindings && typeof bindings === "object" && !Array.isArray(bindings)) {
		const acp = bindings.acp;
		if (acp && typeof acp === "object") ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				...path,
				"bindings",
				"acp"
			],
			message: "Legacy channel-local ACP bindings were removed; use top-level bindings[] entries."
		});
	}
	for (const [key, entry] of Object.entries(record)) addLegacyChannelAcpBindingIssues(entry, ctx, [...path, key]);
}
const ChannelsSchema = object({
	defaults: object({
		groupPolicy: GroupPolicySchema.optional(),
		contextVisibility: ContextVisibilityModeSchema.optional(),
		heartbeatVisibility: ChannelHeartbeatVisibilitySchema,
		botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
		implicitMentions: ChannelImplicitMentionsSchema.optional()
	}).strict().optional(),
	modelByChannel: ChannelModelByChannelSchema
}).passthrough().superRefine((value, ctx) => {
	addLegacyChannelAcpBindingIssues(value, ctx);
}).optional();
//#endregion
export { NativeExecApprovalEnableModeSchema as a, ApprovalsSchema as i, ChannelsSchema as n, ChannelHealthMonitorSchema as o, ChannelImplicitMentionsSchema as r, ChannelHeartbeatVisibilitySchema as s, ChannelBotLoopProtectionSchema as t };
