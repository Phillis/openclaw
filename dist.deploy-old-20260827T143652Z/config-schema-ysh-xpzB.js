import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wc as NEVER, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { B as requireAllowlistAllowFrom, N as TtsConfigSchema, V as requireOpenAllowFrom, b as ProviderCommandsSchema } from "./zod-schema.core-DlR2bhDb.js";
import { a as buildChannelConfigSchema, o as buildGroupEntrySchema } from "./config-schema-7k2vg2UM.js";
import { t as ChannelBotLoopProtectionSchema } from "./zod-schema.channels-config-CZ6nezAF.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { i as registerSensitiveConfigSchema, r as buildSecretInputSchema } from "./secret-input-Dv7SE4A5.js";
import { t as createChannelConfigUiHints } from "./channel-config-ui-hints-n0RsDUR5.js";
import { a as ChannelStreamingProgressSchema, c as buildChannelExecApprovalsSchema, l as buildChannelReactionShape, n as ChannelPreviewStreamingConfigSchema, s as buildChannelAllowBotsSchema, t as ChannelDangerouslyAllowNameMatchingSchema, u as buildCommonChannelAccountShape } from "./channel-config-schema-B2VBzFY9.js";
import "./channel-core-BRUYuJMt.js";
//#region extensions/discord/src/config-ui-hints.ts
const discordChannelConfigUiHints = {
	"": {
		label: "Discord",
		help: "Discord channel provider configuration for bot auth, retry policy, streaming, thread bindings, and optional voice capabilities. Keep privileged intents and advanced features disabled unless needed."
	},
	...createChannelConfigUiHints({
		channelLabel: "Discord",
		dmPolicy: { channelKey: "discord" },
		configWrites: true,
		mentionPatterns: {
			targetDescription: "Discord channel IDs",
			policyNote: "Native Discord @mentions still trigger even when regex patterns are denied.",
			denyNote: "Native @mentions still trigger."
		},
		nativeCommands: true,
		streaming: {
			"": "Discord preview streaming is off by default. Set mode to \"partial\", \"block\", or \"progress\" to opt in. Run openclaw doctor --fix to migrate legacy keys.",
			mode: "Discord preview mode: \"off\" | \"partial\" | \"block\" | \"progress\". Default: \"off\".",
			chunkMode: "Chunking mode for outbound Discord text delivery: \"length\" (default) or \"newline\".",
			"block.enabled": "Enable normal Discord block replies. This takes precedence over editable preview delivery.",
			"block.coalesce": "Merge streamed Discord block replies before final delivery.",
			"preview.chunk.minChars": "Minimum chars before emitting a Discord stream preview update when channels.discord.streaming.mode=\"block\" (default: 200).",
			"preview.chunk.maxChars": "Target max size for a Discord stream preview chunk when channels.discord.streaming.mode=\"block\" (default: 800; clamped to channels.discord.textChunkLimit).",
			"preview.chunk.breakPreference": "Preferred breakpoints for Discord draft chunks (paragraph | newline | sentence). Default: paragraph.",
			"preview.toolProgress": "Show tool/progress activity in the live draft preview message (default: true). Set false to hide interim tool updates while the draft preview stays active.",
			"preview.commandText": "Command/exec detail in preview tool-progress lines: \"status\" is the safe default; \"raw\" opts into command text."
		},
		progress: { includeCommentary: true }
	}),
	proxy: {
		label: "Discord Proxy URL",
		help: "Proxy URL for Discord gateway + API requests (app-id lookup and allowlist resolution). Set per account via channels.discord.accounts.<id>.proxy."
	},
	maxLinesPerMessage: {
		label: "Discord Max Lines Per Message",
		help: "Soft max line count per Discord message (default: 17)."
	},
	suppressEmbeds: {
		label: "Discord Suppress Link Embeds",
		help: "Suppress Discord-generated link embeds on outbound messages by default. Explicit embeds still send normally. Default: true."
	},
	"thread.inheritParent": {
		label: "Discord Thread Parent Inheritance",
		help: "If true, Discord thread sessions inherit the parent channel transcript (default: false)."
	},
	"threadBindings.enabled": {
		label: "Discord Thread Binding Enabled",
		help: "Enable Discord thread binding features (/focus, bound-thread routing/delivery, and thread-bound subagent sessions). Overrides session.threadBindings.enabled when set."
	},
	"threadBindings.idleHours": {
		label: "Discord Thread Binding Idle Timeout (hours)",
		help: "Inactivity window in hours for Discord thread-bound sessions (/focus and spawned thread sessions). Set 0 to disable idle auto-unfocus (default: 24). Overrides session.threadBindings.idleHours when set."
	},
	"threadBindings.maxAgeHours": {
		label: "Discord Thread Binding Max Age (hours)",
		help: "Optional hard max age in hours for Discord thread-bound sessions. Set 0 to disable hard cap (default: 0). Overrides session.threadBindings.maxAgeHours when set."
	},
	"threadBindings.spawnSessions": {
		label: "Discord Thread-Bound Session Spawn",
		help: "Allow sessions_spawn(thread=true) and ACP thread spawns to auto-create and bind Discord threads (default: true). Set false to disable for this account/channel."
	},
	"threadBindings.defaultSpawnContext": {
		label: "Discord Thread Spawn Context",
		help: "Default native subagent context for thread-bound spawns. \"fork\" starts from the requester transcript; \"isolated\" starts clean. Default: \"fork\"."
	},
	"agentComponents.ttlMs": {
		label: "Discord Component TTL (ms)",
		help: "How long sent Discord component callbacks remain registered. Default is 1800000 (30 minutes); maximum is 86400000 (24 hours)."
	},
	"intents.messageContent": {
		label: "Discord Message Content Intent",
		help: "Request the privileged Message Content intent (default: true). Set false only for mention-only guild operation when Discord cannot grant the intent; DMs and explicit mentions still include message content."
	},
	"intents.presence": {
		label: "Discord Presence Intent",
		help: "Enable the Guild Presences privileged intent. Must also be enabled in the Discord Developer Portal. Allows tracking user activities (e.g. Spotify). Default: false."
	},
	"intents.guildMembers": {
		label: "Discord Guild Members Intent",
		help: "Enable the Guild Members privileged intent. Must also be enabled in the Discord Developer Portal. Default: false."
	},
	"intents.voiceStates": {
		label: "Discord Voice States Intent",
		help: "Enable the Guild Voice States intent. Defaults to the effective Discord voice setting; set true only for Discord voice channel conversations."
	},
	"voice.enabled": {
		label: "Discord Voice Enabled",
		help: "Enable Discord voice channel conversations. Text-only Discord configs leave voice off by default; set true to enable /vc commands and the Guild Voice States intent."
	},
	"voice.model": {
		label: "Discord Voice Model",
		help: "Optional LLM model override for Discord voice channel responses and realtime agent consults (for example openai/gpt-5.6-sol). Leave unset to inherit the routed agent model."
	},
	"voice.mode": {
		label: "Discord Voice Mode",
		help: "Conversation mode: agent-proxy (default) uses realtime voice as the microphone/speaker for the routed OpenClaw agent, stt-tts uses batch speech-to-text plus TTS, and bidi lets the realtime provider converse directly with the OpenClaw consult tool."
	},
	"voice.agentSession": {
		label: "Discord Voice Agent Session",
		help: "Controls which OpenClaw conversation receives voice turns. Leave unset for the voice channel session, or set mode=\"target\" with a Discord target such as channel:123 to make voice an extension of an existing text channel session."
	},
	"voice.agentSession.target": {
		label: "Discord Voice Agent Session Target",
		help: "Discord target used when voice.agentSession.mode=\"target\", for example channel:123."
	},
	"voice.followUsersEnabled": {
		label: "Discord Voice Follow Users Enabled",
		help: "Toggle Discord voice follow-users behavior without removing the saved voice.followUsers list. Defaults to true when followUsers is configured."
	},
	"voice.followUsers": {
		label: "Discord Voice Follow Users",
		help: "Discord user IDs to follow into voice channels. The bot joins when a followed user joins or moves, and leaves when that user disconnects."
	},
	"voice.realtime.provider": {
		label: "Discord Realtime Provider",
		help: "Realtime voice provider for agent-proxy or bidi Discord voice modes, such as openai."
	},
	"voice.realtime.model": {
		label: "Discord Realtime Model",
		help: "Provider realtime session model, such as gpt-realtime-2.1. This is separate from voice.model, which remains the OpenClaw agent brain model."
	},
	"voice.realtime.speakerVoice": {
		label: "Discord Realtime Speaker Voice",
		help: "Provider realtime output voice name, such as cedar."
	},
	"voice.realtime.speakerVoiceId": {
		label: "Discord Realtime Speaker Voice ID",
		help: "Provider realtime output voice id."
	},
	"voice.realtime.toolPolicy": {
		label: "Discord Realtime Tool Policy",
		help: "Tool policy for the OpenClaw agent consult tool in realtime voice modes: safe-read-only, owner, or none. Default is owner for agent-proxy and safe-read-only for bidi."
	},
	"voice.realtime.consultPolicy": {
		label: "Discord Realtime Consult Policy",
		help: "Use always to strongly prefer the OpenClaw agent brain for substantive realtime turns. agent-proxy defaults to always."
	},
	"voice.realtime.requireWakeName": {
		label: "Discord Realtime Require Wake Name",
		help: "Control OpenAI agent-proxy wake-name gating. Unset listens naturally with one human and requires a wake name with two or more; true always requires one and false never does."
	},
	"voice.realtime.wakeNames": {
		label: "Discord Realtime Wake Names",
		help: "One- or two-word activation names used whenever OpenAI agent-proxy Discord realtime voice has an active wake-name gate."
	},
	"voice.realtime.bootstrapContextFiles": {
		label: "Discord Realtime Bootstrap Context Files",
		help: "Agent profile bootstrap files included in realtime provider instructions for direct voice identity/persona grounding. Defaults to IDENTITY.md, USER.md, and SOUL.md; set [] to disable."
	},
	"voice.realtime.bargeIn": {
		label: "Discord Realtime Barge-In",
		help: "Allow Discord speaker-start events to interrupt active realtime playback. Set true to keep manual interruption when provider input-audio interruption is disabled for echo control."
	},
	"voice.realtime.minBargeInAudioEndMs": {
		label: "Discord Realtime Minimum Barge-In Audio (ms)",
		help: "Minimum assistant playback duration before a Discord barge-in truncates realtime audio. Default: 250; set 0 for immediate interruption in low-echo rooms."
	},
	"voice.realtime.providers": {
		label: "Discord Realtime Provider Settings",
		help: "Provider-specific realtime voice settings keyed by provider id.",
		advanced: true
	},
	"voice.autoJoin": {
		label: "Discord Voice Auto-Join",
		help: "Voice channels to auto-join on startup (list of guildId/channelId entries)."
	},
	"voice.allowedChannels": {
		label: "Discord Voice Allowed Channels",
		help: "Optional voice channel residency allowlist. When set, /vc join, auto-join, and bot voice-state moves are restricted to these guildId/channelId entries. Leave unset to allow any voice channel."
	},
	"voice.daveEncryption": {
		label: "Discord Voice DAVE Encryption",
		help: "Toggle DAVE end-to-end encryption for Discord voice joins (default: true in @discordjs/voice; Discord may require this)."
	},
	"voice.decryptionFailureTolerance": {
		label: "Discord Voice Decrypt Failure Tolerance",
		help: "Consecutive decrypt failures before DAVE attempts session recovery (passed to @discordjs/voice; default: 24)."
	},
	"voice.connectTimeoutMs": {
		label: "Discord Voice Connect Timeout (ms)",
		help: "Initial @discordjs/voice Ready wait before a join is treated as failed. Default: 30000."
	},
	"voice.reconnectGraceMs": {
		label: "Discord Voice Reconnect Grace (ms)",
		help: "Grace period for a disconnected Discord voice session to enter Signalling or Connecting before OpenClaw destroys it. Default: 15000."
	},
	"voice.captureSilenceGraceMs": {
		label: "Discord Voice Capture Silence Grace (ms)",
		help: "Silence window after Discord reports a speaker ended before OpenClaw finalizes the audio segment for transcription. Default: 2000."
	},
	"voice.tts": {
		label: "Discord Voice Text-to-Speech",
		help: "Optional TTS overrides for Discord voice playback (merged with tts)."
	},
	"pluralkit.enabled": {
		label: "Discord PluralKit Enabled",
		help: "Resolve PluralKit proxied messages and treat system members as distinct senders."
	},
	"pluralkit.token": {
		label: "Discord PluralKit Token",
		help: "Optional PluralKit token for resolving private systems or members."
	},
	activity: {
		label: "Discord Presence Activity",
		help: "Discord presence activity text (defaults to custom status)."
	},
	status: {
		label: "Discord Presence Status",
		help: "Discord presence status (online, dnd, idle, invisible)."
	},
	"autoPresence.enabled": {
		label: "Discord Auto Presence Enabled",
		help: "Enable automatic Discord bot presence updates based on runtime/model availability signals. When enabled: healthy=>online, degraded/unknown=>idle, exhausted/unavailable=>dnd."
	},
	"autoPresence.intervalMs": {
		label: "Discord Auto Presence Check Interval (ms)",
		help: "How often to evaluate Discord auto-presence state in milliseconds (default: 30000)."
	},
	"autoPresence.minUpdateIntervalMs": {
		label: "Discord Auto Presence Min Update Interval (ms)",
		help: "Minimum time between actual Discord presence update calls in milliseconds (default: 15000). Prevents status spam on noisy state changes."
	},
	"guilds.*.presenceEvents": {
		label: "Discord Online Presence Events",
		help: "Route selected human offline-to-online transitions into the configured guild channel as agent system events. Requires the Guild Presences privileged intent and an enabled agent heartbeat."
	},
	"guilds.*.presenceEvents.enabled": {
		label: "Discord Online Presence Events Enabled",
		help: "Enable online-presence agent wakes for this guild. Defaults to true when presenceEvents is configured."
	},
	"guilds.*.presenceEvents.channelId": {
		label: "Discord Online Presence Target Channel",
		help: "Numeric Discord channel ID whose routed agent session receives online-presence events and greeting delivery."
	},
	"guilds.*.presenceEvents.users": {
		label: "Discord Online Presence User IDs",
		help: "Optional immutable Discord user ID allowlist. Omit to include all human members in the guild."
	},
	"guilds.*.presenceEvents.reconnectSuppressSeconds": {
		label: "Discord Online Presence Reconnect Suppression",
		help: "Suppress online-presence events for this many seconds after a new Gateway session while guild presence state is rebuilt. Resumed sessions are unaffected. 0 disables. Default: 300."
	},
	"guilds.*.presenceEvents.burstLimit": {
		label: "Discord Online Presence Burst Limit",
		help: "Maximum successfully queued online-presence events for this guild per burst window; the rest are suppressed and logged once. Default: 8."
	},
	"guilds.*.presenceEvents.burstWindowSeconds": {
		label: "Discord Online Presence Burst Window",
		help: "Sliding window in seconds used for burst detection. Default: 60."
	},
	activityType: {
		label: "Discord Presence Activity Type",
		help: "Discord presence activity type (0=Playing,1=Streaming,2=Listening,3=Watching,4=Custom,5=Competing)."
	},
	activityUrl: {
		label: "Discord Presence Activity URL",
		help: "Discord presence streaming URL (required for activityType=1)."
	},
	allowBots: {
		label: "Discord Allow Bot Messages",
		help: "Allow bot-authored messages to trigger Discord replies (default: false). Set \"mentions\" to only accept bot messages that mention the bot."
	},
	botLoopProtection: {
		label: "Discord Bot Loop Protection",
		help: "Sliding-window guard for bot-to-bot Discord loops. Default is enabled whenever allowBots lets bot-authored messages reach dispatch."
	},
	"botLoopProtection.enabled": {
		label: "Discord Bot Loop Protection Enabled",
		help: "Enable the bot-pair loop guard. Defaults to true when allowBots is true or \"mentions\", and false when bot messages are ignored."
	},
	"botLoopProtection.maxEventsPerWindow": {
		label: "Discord Bot Pair Events Per Window",
		help: "Maximum messages a single Discord bot pair may exchange in the configured window before suppression starts. Default: 20."
	},
	"botLoopProtection.windowSeconds": {
		label: "Discord Bot Loop Window Seconds",
		help: "Sliding window length in seconds for Discord bot-pair loop budgets. Default: 60."
	},
	"botLoopProtection.cooldownSeconds": {
		label: "Discord Bot Loop Cooldown Seconds",
		help: "Seconds to suppress a Discord bot pair after it exceeds the loop budget. Default: 60."
	},
	mentionAliases: {
		label: "Discord Mention Aliases",
		help: "Map outbound @handle text to stable Discord user IDs before sending. Set per account via channels.discord.accounts.<id>.mentionAliases."
	},
	token: {
		label: "Discord Bot Token",
		help: "Discord bot token used for gateway and REST API authentication for this provider account. Keep this secret out of committed config and rotate immediately after any leak.",
		sensitive: true
	},
	applicationId: {
		label: "Discord Application ID",
		help: "Optional Discord application/client ID. Set this when hosted environments cannot reach Discord's application lookup endpoint during startup."
	},
	activities: {
		label: "Discord Activities",
		help: "Enable Discord Activity widgets for this account. Routes, the agent tool, and the launch handler remain disabled when this block is absent."
	},
	"activities.clientSecret": {
		label: "Discord Activities Client Secret",
		help: "OAuth2 client secret for the Discord application. DISCORD_CLIENT_SECRET is used when this field is unset.",
		sensitive: true
	},
	"activities.applicationId": {
		label: "Discord Activities Application ID",
		help: "Optional Activity application ID. Defaults to the bot application ID learned at gateway startup."
	}
};
//#endregion
//#region extensions/discord/src/config-schema.ts
const SecretInputSchema = buildSecretInputSchema();
const DiscordPreviewStreamingConfigSchema = ChannelPreviewStreamingConfigSchema.extend({ progress: ChannelStreamingProgressSchema.optional() }).strict();
const DiscordIdSchema = union([string(), number()]).transform((value, ctx) => {
	if (typeof value === "number") {
		if (!Number.isSafeInteger(value) || value < 0) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				message: `Discord ID "${String(value)}" is not a valid non-negative safe integer. Wrap it in quotes in your config file.`
			});
			return NEVER;
		}
		return String(value);
	}
	return value;
}).pipe(string());
const DiscordIdListSchema = array(DiscordIdSchema);
const DiscordSnowflakeStringSchema = string().regex(/^\d+$/, "Discord user ID must be numeric");
const DiscordDmSchema = object({
	enabled: boolean().optional(),
	groupEnabled: boolean().optional(),
	groupChannels: DiscordIdListSchema.optional()
}).strict();
const DiscordPresenceEventsSchema = object({
	enabled: boolean().optional(),
	channelId: DiscordSnowflakeStringSchema,
	users: array(DiscordSnowflakeStringSchema).optional(),
	reconnectSuppressSeconds: number().int().min(0).optional(),
	burstLimit: number().int().positive().optional(),
	burstWindowSeconds: number().int().positive().optional()
}).strict();
const DiscordThreadSchema = object({ inheritParent: boolean().optional() }).strict();
const DiscordGuildChannelSchema = buildGroupEntrySchema({
	ignoreOtherMentions: boolean().optional(),
	users: DiscordIdListSchema.optional(),
	roles: DiscordIdListSchema.optional(),
	includeThreadStarter: boolean().optional(),
	autoThread: boolean().optional(),
	/** Naming strategy for auto-created threads. "message" uses message text; "generated" creates an LLM title after thread creation. */
	autoThreadName: _enum(["message", "generated"]).optional(),
	/** Archive duration for auto-created threads in minutes. Discord supports 60, 1440 (1 day), 4320 (3 days), 10080 (1 week). Default: 60. */
	autoArchiveDuration: union([
		_enum([
			"60",
			"1440",
			"4320",
			"10080"
		]),
		literal(60),
		literal(1440),
		literal(4320),
		literal(10080)
	]).optional()
}, { omit: ["allowFrom"] });
const DiscordGuildSchema = buildGroupEntrySchema({
	slug: string().optional(),
	ignoreOtherMentions: boolean().optional(),
	...buildChannelReactionShape({ notificationModes: [
		"off",
		"own",
		"all",
		"allowlist"
	] }),
	users: DiscordIdListSchema.optional(),
	roles: DiscordIdListSchema.optional(),
	presenceEvents: DiscordPresenceEventsSchema.optional(),
	channels: record(string(), DiscordGuildChannelSchema.optional()).optional()
}, { omit: [
	"enabled",
	"skills",
	"allowFrom",
	"systemPrompt"
] });
const DiscordVoiceAutoJoinSchema = object({
	guildId: string().min(1),
	channelId: string().min(1)
}).strict();
const DiscordVoiceAllowedChannelSchema = object({
	guildId: string().min(1),
	channelId: string().min(1)
}).strict();
const DiscordVoiceRealtimeToolPolicySchema = _enum([
	"safe-read-only",
	"owner",
	"none"
]);
const DiscordVoiceRealtimeConsultPolicySchema = _enum(["auto", "always"]);
const DiscordVoiceRealtimeBootstrapContextFileSchema = _enum([
	"IDENTITY.md",
	"USER.md",
	"SOUL.md"
]);
const DiscordVoiceRealtimeWakeNameSchema = string().min(1).regex(/^\s*[^a-z0-9]*[a-z0-9]+(?:[^a-z0-9]+[a-z0-9]+)?[^a-z0-9]*\s*$/i, { message: "Discord realtime wake names must be one or two words." });
const DiscordVoiceRealtimeSchema = object({
	provider: string().min(1).optional(),
	model: string().min(1).optional(),
	speakerVoice: string().min(1).optional(),
	speakerVoiceId: string().min(1).optional(),
	instructions: string().min(1).optional(),
	toolPolicy: DiscordVoiceRealtimeToolPolicySchema.optional(),
	consultPolicy: DiscordVoiceRealtimeConsultPolicySchema.optional(),
	requireWakeName: boolean().optional(),
	wakeNames: array(DiscordVoiceRealtimeWakeNameSchema).min(1).optional(),
	bootstrapContextFiles: array(DiscordVoiceRealtimeBootstrapContextFileSchema).optional(),
	bargeIn: boolean().optional(),
	minBargeInAudioEndMs: number().int().min(0).max(1e4).optional(),
	debounceMs: number().int().positive().max(1e4).optional(),
	providers: record(string(), record(string(), unknown()).optional()).optional()
}).strict();
const DiscordVoiceAgentSessionSchema = object({
	mode: _enum(["voice", "target"]).optional(),
	target: string().min(1).optional()
}).strict().superRefine((value, ctx) => {
	if (value.mode === "target" && !value.target) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["target"],
		message: "voice.agentSession.target is required when mode is \"target\""
	});
});
const DiscordVoiceSchema = object({
	enabled: boolean().optional(),
	mode: _enum([
		"stt-tts",
		"agent-proxy",
		"bidi"
	]).optional(),
	agentSession: DiscordVoiceAgentSessionSchema.optional(),
	model: string().min(1).optional(),
	realtime: DiscordVoiceRealtimeSchema.optional(),
	autoJoin: array(DiscordVoiceAutoJoinSchema).optional(),
	followUsersEnabled: boolean().optional(),
	followUsers: array(string().min(1)).optional(),
	allowedChannels: array(DiscordVoiceAllowedChannelSchema).optional(),
	daveEncryption: boolean().optional(),
	decryptionFailureTolerance: number().int().min(0).optional(),
	connectTimeoutMs: number().int().positive().max(12e4).optional(),
	reconnectGraceMs: number().int().positive().max(12e4).optional(),
	captureSilenceGraceMs: number().int().positive().max(3e4).optional(),
	tts: TtsConfigSchema.optional()
}).strict().optional();
const DiscordAccountSchema = object({
	...buildCommonChannelAccountShape({
		omit: ["groupAllowFrom"],
		groupPolicyDefault: true,
		allowFrom: DiscordIdListSchema.optional(),
		streaming: DiscordPreviewStreamingConfigSchema.optional()
	}),
	commands: ProviderCommandsSchema,
	token: registerSensitiveConfigSchema(SecretInputSchema.optional()),
	applicationId: DiscordIdSchema.optional(),
	activities: object({
		clientSecret: registerSensitiveConfigSchema(string().min(1).optional()),
		applicationId: DiscordSnowflakeStringSchema.optional()
	}).strict().optional(),
	proxy: string().optional(),
	allowBots: buildChannelAllowBotsSchema({ allowMentions: true }),
	botLoopProtection: ChannelBotLoopProtectionSchema.optional(),
	dangerouslyAllowNameMatching: ChannelDangerouslyAllowNameMatchingSchema,
	mentionAliases: record(string(), DiscordSnowflakeStringSchema).optional(),
	suppressEmbeds: boolean().optional(),
	maxLinesPerMessage: number().int().positive().optional(),
	actions: object({
		reactions: boolean().optional(),
		stickers: boolean().optional(),
		emojiUploads: boolean().optional(),
		stickerUploads: boolean().optional(),
		polls: boolean().optional(),
		permissions: boolean().optional(),
		messages: boolean().optional(),
		threads: boolean().optional(),
		pins: boolean().optional(),
		search: boolean().optional(),
		memberInfo: boolean().optional(),
		roleInfo: boolean().optional(),
		roles: boolean().optional(),
		channelInfo: boolean().optional(),
		voiceStatus: boolean().optional(),
		events: boolean().optional(),
		moderation: boolean().optional(),
		channels: boolean().optional(),
		presence: boolean().optional()
	}).strict().optional(),
	thread: DiscordThreadSchema.optional(),
	dm: DiscordDmSchema.optional(),
	guilds: record(string(), DiscordGuildSchema.optional()).optional(),
	execApprovals: buildChannelExecApprovalsSchema(DiscordIdSchema, { cleanupAfterResolve: boolean().optional() }),
	agentComponents: object({
		enabled: boolean().optional(),
		ttlMs: number().int().positive().max(1440 * 60 * 1e3).optional()
	}).strict().optional(),
	slashCommand: object({ ephemeral: boolean().optional() }).strict().optional(),
	threadBindings: object({
		enabled: boolean().optional(),
		idleHours: number().nonnegative().optional(),
		maxAgeHours: number().nonnegative().optional(),
		spawnSessions: boolean().optional(),
		defaultSpawnContext: _enum(["isolated", "fork"]).optional()
	}).strict().optional(),
	intents: object({
		messageContent: boolean().optional(),
		presence: boolean().optional(),
		guildMembers: boolean().optional(),
		voiceStates: boolean().optional()
	}).strict().optional(),
	voice: DiscordVoiceSchema,
	pluralkit: object({
		enabled: boolean().optional(),
		token: registerSensitiveConfigSchema(SecretInputSchema.optional())
	}).strict().optional(),
	...buildChannelReactionShape({ ackReaction: string().optional() }),
	ackReactionScope: _enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"off",
		"none"
	]).optional(),
	activity: string().optional(),
	status: _enum([
		"online",
		"dnd",
		"idle",
		"invisible"
	]).optional(),
	autoPresence: object({
		enabled: boolean().optional(),
		intervalMs: number().int().positive().optional(),
		minUpdateIntervalMs: number().int().positive().optional()
	}).strict().optional(),
	activityType: union([
		literal(0),
		literal(1),
		literal(2),
		literal(3),
		literal(4),
		literal(5)
	]).optional(),
	activityUrl: string().url().optional(),
	inboundWorker: object({ runTimeoutMs: number().int().nonnegative().optional() }).strict().optional()
}).strict().superRefine((value, ctx) => {
	const activityText = normalizeOptionalString(value.activity) ?? "";
	const hasActivity = Boolean(activityText);
	const hasActivityType = value.activityType !== void 0;
	const activityUrl = normalizeOptionalString(value.activityUrl) ?? "";
	const hasActivityUrl = Boolean(activityUrl);
	if ((hasActivityType || hasActivityUrl) && !hasActivity) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "channels.discord.activity is required when activityType or activityUrl is set",
		path: ["activity"]
	});
	if (value.activityType === 1 && !hasActivityUrl) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "channels.discord.activityUrl is required when activityType is 1 (Streaming)",
		path: ["activityUrl"]
	});
	if (hasActivityUrl && value.activityType !== 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "channels.discord.activityType must be 1 (Streaming) when activityUrl is set",
		path: ["activityType"]
	});
	const autoPresenceInterval = value.autoPresence?.intervalMs;
	const autoPresenceMinUpdate = value.autoPresence?.minUpdateIntervalMs;
	if (typeof autoPresenceInterval === "number" && typeof autoPresenceMinUpdate === "number" && autoPresenceMinUpdate > autoPresenceInterval) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "channels.discord.autoPresence.minUpdateIntervalMs must be less than or equal to channels.discord.autoPresence.intervalMs",
		path: ["autoPresence", "minUpdateIntervalMs"]
	});
});
const DiscordChannelConfigSchema = buildChannelConfigSchema(DiscordAccountSchema.extend({
	accounts: record(string(), DiscordAccountSchema.optional()).optional(),
	defaultAccount: string().optional()
}).superRefine((value, ctx) => {
	const dmPolicy = value.dmPolicy ?? "pairing";
	const allowFrom = value.allowFrom;
	requireOpenAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.discord.dmPolicy=\"open\" requires channels.discord.allowFrom to include \"*\""
	});
	requireAllowlistAllowFrom({
		policy: dmPolicy,
		allowFrom,
		ctx,
		path: ["allowFrom"],
		message: "channels.discord.dmPolicy=\"allowlist\" requires channels.discord.allowFrom to contain at least one sender ID"
	});
	if (!value.accounts) return;
	for (const [accountId, account] of Object.entries(value.accounts)) {
		if (!account) continue;
		const effectivePolicy = account.dmPolicy ?? value.dmPolicy ?? "pairing";
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
			message: "channels.discord.accounts.*.dmPolicy=\"open\" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to include \"*\""
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
			message: "channels.discord.accounts.*.dmPolicy=\"allowlist\" requires channels.discord.accounts.*.allowFrom (or channels.discord.allowFrom) to contain at least one sender ID"
		});
	}
}), { uiHints: discordChannelConfigUiHints });
//#endregion
export { DiscordChannelConfigSchema as t };
