import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import "./session-key-D8GLfPr_.js";
import { An as preprocess, At as boolean, Bt as discriminatedUnion, Et as array, Ln as strictObject, Nn as record, Qn as url, Rn as string, Tc as config, Tn as object, Xn as union, Zn as unknown, dn as literal, un as lazy, wc as NEVER, wn as number, yt as _enum } from "./schemas-C7gqXY2T.js";
import { t as en_default } from "./en-CzFrTG0z.js";
import { n as ZodIssueCode } from "./compat-C0N6pXWd.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { a as AgentSandboxSchema, c as MemorySearchSchema, d as AgentModelSchema, f as AgentToolModelSchema, i as AgentModelRuntimeEntrySchema, n as AgentEntrySchema, o as ElevatedAllowFromSchema, r as AgentModelPolicySchema, s as HeartbeatSchema, t as AgentContextLimitsSchema, u as ToolsSchema } from "./zod-schema.agent-runtime-2QFZPjK2.js";
import { d as isSecretRef } from "./types.secrets-BrIfhxSG.js";
import { s as isValidSecretRef } from "./ref-contract-BDz7f4XS.js";
import { D as SecretsConfigSchema, H as createAllowDenyChannelRulesSchema, I as TypingModeSchema, L as VisibleRepliesSchema, N as TtsConfigSchema, O as SsrFPolicyConfigSchema, d as HexColorSchema, f as HumanDelaySchema, l as GroupChatSchema, m as InboundDebounceSchema, n as BlockStreamingCoalesceSchema, t as BlockStreamingChunkSchema, v as ModelsConfigSchema, w as SecretInputSchema, x as QueueSchema, y as NativeCommandsSettingSchema } from "./zod-schema.core-D1Ak_xoR.js";
import { n as sensitive, t as configUiMetadata } from "./zod-schema.sensitive-BqMmdX0V.js";
import { t as isPluginJsonValue } from "./host-hook-json-CRVrIqU9.js";
import { t as isSensitiveConfigPath } from "./sensitive-paths-uMRji-4g.js";
import { i as ApprovalsSchema, n as ChannelsSchema } from "./zod-schema.channels-config-DkZP1G3R.js";
import { a as READ_SCOPE, c as WRITE_SCOPE, i as QUESTIONS_SCOPE, n as APPROVALS_SCOPE, o as TALK_SCOPE, r as PAIRING_SCOPE, s as TALK_SECRETS_SCOPE, t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import { n as isHttpUrl, r as isHttpsUrl } from "./url-protocol-OU3K-ySz.js";
import path from "node:path";
//#region src/config/schema.shared.ts
/** Deep-clone schema payloads before callers mutate plugin or base schema fragments. */
function cloneSchema(value) {
	return structuredClone(value);
}
/** Narrow unknown JSON-schema fragments to non-array objects. */
function asSchemaObject(value) {
	return asNullableRecord(value);
}
/** Return whether a schema node exposes nested fields through properties, items, or unions. */
function schemaHasChildren(schema) {
	if (schema.properties && Object.keys(schema.properties).length > 0) return true;
	if (schema.additionalProperties && typeof schema.additionalProperties === "object") return true;
	if (Array.isArray(schema.items)) return schema.items.some((entry) => typeof entry === "object" && entry !== null);
	for (const branch of [
		schema.oneOf,
		schema.anyOf,
		schema.allOf
	]) if (branch?.some((entry) => entry && typeof entry === "object" && schemaHasChildren(entry))) return true;
	return Boolean(schema.items && typeof schema.items === "object");
}
/** Find the most specific wildcard UI hint that matches a concrete config path. */
function findWildcardHintMatch(params) {
	const targetParts = params.targetParts ?? params.splitPath(params.path);
	let bestMatch;
	for (const [hintPath, hint] of Object.entries(params.uiHints)) {
		if (params.acceptHint && !params.acceptHint(hint)) continue;
		const hintParts = params.splitPath(hintPath);
		if (hintParts.length > targetParts.length || !params.includeAncestors && hintParts.length !== targetParts.length) continue;
		let wildcardCount = 0;
		let matches = true;
		for (let index = 0; index < hintParts.length; index += 1) {
			const hintPart = hintParts[index];
			if (hintPart === targetParts[index]) continue;
			if (hintPart === "*") {
				wildcardCount += 1;
				continue;
			}
			matches = false;
			break;
		}
		if (!matches) continue;
		if (!bestMatch || hintParts.length > bestMatch.partCount || hintParts.length === bestMatch.partCount && wildcardCount < bestMatch.wildcardCount) bestMatch = {
			path: hintPath,
			hint,
			partCount: hintParts.length,
			wildcardCount
		};
	}
	return bestMatch ? {
		path: bestMatch.path,
		hint: bestMatch.hint
	} : null;
}
//#endregion
//#region src/cli/parse-bytes.ts
const UNIT_MULTIPLIERS = {
	b: 1,
	kb: 1024,
	k: 1024,
	mb: 1024 ** 2,
	m: 1024 ** 2,
	gb: 1024 ** 3,
	g: 1024 ** 3,
	tb: 1024 ** 4,
	t: 1024 ** 4
};
function invalidByteSize(raw, reason) {
	const value = raw.trim() ? `"${raw}"` : "empty value";
	const prefix = reason ? `Invalid byte size (${reason}): ${value}.` : `Invalid byte size: ${value}.`;
	return /* @__PURE__ */ new Error(`${prefix} Use values like 512kb, 10mb, 1gb, or 500.`);
}
/** Parse a non-negative byte size with optional binary units like kb, mb, gb, or tb. */
function parseByteSize(raw, opts) {
	const trimmed = normalizeLowercaseStringOrEmpty(normalizeOptionalString(raw) ?? "");
	if (!trimmed) throw invalidByteSize(raw, "empty");
	const m = /^(\d+(?:\.\d+)?)([a-z]+)?$/.exec(trimmed);
	if (!m) throw invalidByteSize(raw);
	const value = Number(m[1]);
	if (!Number.isFinite(value) || value < 0) throw invalidByteSize(raw);
	const unit = normalizeLowercaseStringOrEmpty(m[2] ?? opts?.defaultUnit ?? "b");
	const multiplier = UNIT_MULTIPLIERS[unit];
	if (!multiplier) throw invalidByteSize(raw, `unknown unit "${unit}"`);
	const bytes = Math.round(value * multiplier);
	if (!Number.isSafeInteger(bytes)) throw invalidByteSize(raw);
	return bytes;
}
//#endregion
//#region src/config/byte-size.ts
/**
* Parse an optional byte-size value from config.
* Accepts non-negative numbers or strings like "2mb".
*/
function parseNonNegativeByteSize(value) {
	if (typeof value === "number") {
		const int = Math.floor(value);
		return Number.isSafeInteger(int) && int >= 0 ? int : null;
	}
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed) return null;
		try {
			const bytes = parseByteSize(trimmed, { defaultUnit: "b" });
			return bytes >= 0 ? bytes : null;
		} catch {
			return null;
		}
	}
	return null;
}
/** Validates byte-size strings accepted by agent default byte-threshold config. */
function isValidNonNegativeByteSizeString(value) {
	return parseNonNegativeByteSize(value) !== null;
}
//#endregion
//#region src/config/zod-schema.agent-defaults.ts
const SilentReplyPolicySchema = union([literal("allow"), literal("disallow")]);
const NonNegativeByteSizeSchema = union([number().int().nonnegative(), string().refine(isValidNonNegativeByteSizeString, "Expected byte size string like 2mb")]);
const OptionalBootstrapFileNameSchema = _enum([
	"SOUL.md",
	"USER.md",
	"HEARTBEAT.md",
	"IDENTITY.md"
]);
const AgentThinkingLevelSchema = _enum([
	"off",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"adaptive",
	"max",
	"ultra"
]);
const EmbeddedAgentConfigSchema = object({
	projectSettingsPolicy: union([
		literal("trusted"),
		literal("sanitize"),
		literal("ignore")
	]).optional(),
	executionContract: union([literal("default"), literal("strict-agentic")]).optional()
}).strict();
const SilentReplyPolicyConfigSchema = object({
	group: SilentReplyPolicySchema.optional(),
	internal: SilentReplyPolicySchema.optional()
}).strict();
const AgentDefaultsSchema = object({
	/** Global default provider params applied to all models before per-model and per-agent overrides. */
	params: record(string(), unknown()).optional(),
	model: AgentModelSchema.optional(),
	utilityModel: string().optional(),
	imageModel: AgentToolModelSchema.optional(),
	mediaModels: object({
		image: AgentToolModelSchema.optional(),
		video: AgentToolModelSchema.optional(),
		music: AgentToolModelSchema.optional()
	}).strict().optional(),
	voiceModel: AgentToolModelSchema.optional(),
	pdfModel: AgentToolModelSchema.optional(),
	pdfMaxMb: number().positive().optional(),
	pdfMaxPages: number().int().positive().optional(),
	models: record(string(), AgentModelRuntimeEntrySchema).optional(),
	modelPolicy: AgentModelPolicySchema.optional(),
	workspace: string().optional(),
	skills: array(string()).optional(),
	silentReply: SilentReplyPolicyConfigSchema.optional(),
	repoRoot: string().optional(),
	skipBootstrap: boolean().optional(),
	skipOptionalBootstrapFiles: array(OptionalBootstrapFileNameSchema).optional(),
	contextInjection: union([
		literal("always"),
		literal("continuation-skip"),
		literal("never")
	]).optional(),
	bootstrapMaxChars: number().int().positive().optional(),
	bootstrapTotalMaxChars: number().int().positive().optional(),
	experimental: object({ localModelLean: boolean().optional() }).strict().optional(),
	userTimezone: string().optional(),
	startupContext: object({
		enabled: boolean().optional(),
		applyOn: array(union([literal("new"), literal("reset")])).optional(),
		dailyMemoryDays: number().int().min(1).max(14).optional(),
		maxFileBytes: number().int().min(1).max(64 * 1024).optional(),
		maxFileChars: number().int().min(1).max(1e4).optional(),
		maxTotalChars: number().int().min(1).max(5e4).optional()
	}).strict().optional(),
	contextLimits: AgentContextLimitsSchema,
	contextTokens: number().int().positive().optional(),
	contextPruning: object({
		mode: union([literal("off"), literal("cache-ttl")]).optional(),
		ttl: string().optional(),
		tools: object({
			allow: array(string()).optional(),
			deny: array(string()).optional()
		}).strict().optional(),
		hardClear: object({
			enabled: boolean().optional(),
			placeholder: string().optional()
		}).strict().optional()
	}).strict().optional(),
	compaction: object({
		enabled: boolean().optional(),
		mode: union([literal("default"), literal("safeguard")]).optional(),
		provider: string().optional(),
		thinkingLevel: AgentThinkingLevelSchema.optional(),
		keepRecentTokens: number().int().positive().optional(),
		identifierPolicy: union([literal("strict"), literal("off")]).optional(),
		recentTurnsPreserve: number().int().min(0).max(12).optional(),
		qualityGuard: object({
			enabled: boolean().optional(),
			maxRetries: number().int().nonnegative().optional()
		}).strict().optional(),
		midTurnPrecheck: object({ enabled: boolean().optional() }).strict().optional(),
		postIndexSync: _enum([
			"off",
			"async",
			"await"
		]).optional(),
		postCompactionSections: array(string()).optional(),
		model: string().optional(),
		contextUsageThreshold: number().gt(0).lt(1).optional(),
		timeoutSeconds: number().int().positive().optional(),
		memoryFlush: object({
			enabled: boolean().optional(),
			model: string().optional(),
			softThresholdTokens: number().int().nonnegative().optional(),
			forceFlushTranscriptBytes: NonNegativeByteSizeSchema.optional()
		}).strict().optional(),
		maxActiveTranscriptBytes: NonNegativeByteSizeSchema.optional(),
		notifyUser: boolean().optional()
	}).strict().optional(),
	embeddedAgent: EmbeddedAgentConfigSchema.optional(),
	thinkingDefault: AgentThinkingLevelSchema.optional(),
	fastModeDefault: union([boolean(), literal("auto")]).optional(),
	verboseDefault: union([
		literal("off"),
		literal("on"),
		literal("full")
	]).optional(),
	toolProgressDetail: union([literal("explain"), literal("raw")]).optional(),
	reasoningDefault: union([
		literal("off"),
		literal("on"),
		literal("stream")
	]).optional(),
	elevatedDefault: union([
		literal("off"),
		literal("on"),
		literal("ask"),
		literal("full")
	]).optional(),
	blockStreamingDefault: union([literal("off"), literal("on")]).optional(),
	blockStreamingBreak: union([literal("text_end"), literal("message_end")]).optional(),
	blockStreamingChunk: BlockStreamingChunkSchema.optional(),
	blockStreamingCoalesce: BlockStreamingCoalesceSchema.optional(),
	humanDelay: HumanDelaySchema.optional(),
	timeoutSeconds: number().int().nonnegative().optional(),
	mediaMaxMb: number().positive().optional(),
	imageMaxDimensionPx: number().int().positive().optional(),
	imageQuality: _enum([
		"auto",
		"efficient",
		"balanced",
		"high"
	]).optional(),
	typingIntervalSeconds: number().int().positive().optional(),
	typingMode: TypingModeSchema.optional(),
	heartbeat: HeartbeatSchema.unwrap().safeExtend({ agentId: string().trim().min(1).optional() }).optional(),
	systemAgent: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	authInheritance: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	sessionStore: object({ agentId: string().trim().min(1).optional() }).strict().optional(),
	maxConcurrent: number().int().positive().optional(),
	subagents: object({
		delegationMode: _enum(["suggest", "prefer"]).optional(),
		allowAgents: array(string()).optional(),
		maxConcurrent: number().int().positive().optional(),
		maxSpawnDepth: number().int().min(1).max(5).optional().describe("Maximum nesting depth for sub-agent spawning. 1 = no nesting (default), 2 = sub-agents can spawn sub-sub-agents."),
		maxChildrenPerAgent: number().int().min(1).max(20).optional().describe("Maximum number of active children a single agent session can spawn (default: 5)."),
		archiveAfterMinutes: number().int().min(0).optional(),
		model: AgentModelSchema.optional(),
		thinking: string().optional(),
		runTimeoutSeconds: number().int().min(0).optional(),
		announceTimeoutMs: number().int().positive().optional(),
		requireAgentId: boolean().optional()
	}).strict().optional(),
	sandbox: AgentSandboxSchema
}).strict().optional();
//#endregion
//#region src/config/zod-schema.agents.ts
const AgentEntryConfigSchema = preprocess((value, ctx) => {
	if (value && typeof value === "object" && !Array.isArray(value)) for (const key of Object.getOwnPropertyNames(value)) {
		if (!isBlockedObjectKey(key)) continue;
		ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [key],
			message: "agent entries must not contain blocked object keys"
		});
		return NEVER;
	}
	return value;
}, AgentEntrySchema.omit({ id: true }).extend({ default: boolean().optional() }));
const AgentsSchema = object({
	ownership: literal("explicit").optional(),
	defaults: lazy(() => AgentDefaultsSchema).optional(),
	entries: record(string().regex(/^[a-z0-9_][a-z0-9_-]{0,63}$/i, "Invalid agent id"), AgentEntryConfigSchema).optional()
}).strict().superRefine((value, ctx) => {
	const entries = Object.entries(value.entries ?? {});
	if (entries.length === 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["entries"],
		message: "agents.entries must contain at least one configured agent"
	});
	const marked = entries.filter(([, entry]) => entry.default === true);
	if (marked.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["entries"],
		message: `agents.entries must contain at most one default=true entry (found ${marked.length})`
	});
	if (value.ownership === "explicit" && marked.length > 0) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["ownership"],
		message: "agents.ownership=explicit cannot be combined with a legacy default=true marker"
	});
	if (entries.length > 1 && marked.length === 0 && value.ownership !== "explicit") ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["ownership"],
		message: "multi-agent rosters require agents.ownership=\"explicit\" or one legacy default=true marker; add agents.ownership=\"explicit\" or run openclaw doctor"
	});
}).optional();
const BindingMatchSchema = object({
	channel: string(),
	accountId: string().optional(),
	peer: object({
		kind: union([
			literal("direct"),
			literal("group"),
			literal("channel")
		]),
		id: string()
	}).strict().optional(),
	guildId: string().optional(),
	teamId: string().optional(),
	roles: array(string()).optional()
}).strict();
const BindingSessionSchema = object({ dmScope: union([
	literal("main"),
	literal("per-peer"),
	literal("per-channel-peer"),
	literal("per-account-channel-peer")
]).optional() }).strict();
const BindingsSchema = array(union([object({
	type: literal("route").optional(),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	session: BindingSessionSchema.optional()
}).strict(), object({
	type: literal("acp"),
	agentId: string(),
	comment: string().optional(),
	match: BindingMatchSchema,
	acp: object({
		mode: _enum(["persistent", "oneshot"]).optional(),
		label: string().optional(),
		cwd: string().optional(),
		backend: string().optional()
	}).strict().optional()
}).strict().superRefine((value, ctx) => {
	if (!(normalizeOptionalString(value.match.peer?.id) ?? "")) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["match", "peer"],
		message: "ACP bindings require match.peer.id to target a concrete conversation."
	});
})])).optional();
const BroadcastSchema = object({ strategy: _enum(["parallel", "sequential"]).optional() }).catchall(array(string())).optional();
//#endregion
//#region src/config/zod-schema.cloud-workers.ts
function validateCloudWorkerProfileSettings(value) {
	if (typeof value !== "object" || value === null || Array.isArray(value) || !isPluginJsonValue(value)) return "Worker profile settings must be bounded finite JSON";
	const visit = (entry) => {
		if (Array.isArray(entry)) return entry.map(visit).find((error) => error !== void 0);
		if (typeof entry !== "object" || entry === null) return;
		for (const [key, child] of Object.entries(entry)) {
			const baseKey = key.replace(/ref$/i, "");
			if (key.toLowerCase() === "keyref" || isSensitiveConfigPath(key) || baseKey !== key && isSensitiveConfigPath(baseKey)) {
				if (!isSecretRef(child) || !isValidSecretRef(child)) return `Worker profile ${key} must use a SecretRef`;
				continue;
			}
			const error = visit(child);
			if (error) return error;
		}
	};
	return visit(value);
}
const CloudWorkerSettingsSchema = record(string(), unknown()).superRefine((value, ctx) => {
	const message = validateCloudWorkerProfileSettings(value);
	if (message) ctx.addIssue({
		code: "custom",
		message
	});
});
const CloudWorkerProfileShape = {
	provider: string().trim().min(1).register(configUiMetadata, {
		label: "Cloud Worker Provider",
		help: "Worker provider id registered by a plugin. The configured plugin must expose this id before the gateway can provision environments from the profile."
	}),
	install: _enum(["bundle", "npm"]).optional().default("bundle").register(configUiMetadata, {
		label: "Cloud Worker Install Method",
		help: "Worker installation method: \"bundle\" (default) transfers the gateway's content-hashed installed build and supports released, development, and unreleased versions; \"npm\" installs the exact gateway version and is available only when that version is released."
	}),
	settings: CloudWorkerSettingsSchema.optional().register(configUiMetadata, {
		label: "Cloud Worker Provider Settings",
		help: "Provider-owned settings validated by the selected plugin. Use SecretRef objects for secret-bearing values; opaque settings do not gain automatic secret resolution."
	})
};
const CloudWorkerProfileSchema = object(CloudWorkerProfileShape).strict().register(configUiMetadata, {
	label: "Cloud Worker Profile",
	help: "One cloud worker profile selected by name when creating an environment. Keep provider credentials in supported references rather than embedding secret material in this block."
});
const CloudWorkerProfileIdSchema = string().min(1).refine((value) => value === value.trim(), "Worker profile ids must not contain outer whitespace");
const CloudWorkersConfigShape = {
	desktop: boolean().optional().register(configUiMetadata, {
		label: "Cloud Worker Desktop (Labs)",
		help: "Enables the experimental worker.desktop.observe surface and Control UI Desktop panel for desktop-capable cloud worker environments."
	}),
	profiles: record(CloudWorkerProfileIdSchema, CloudWorkerProfileSchema).optional().register(configUiMetadata, {
		label: "Cloud Worker Profiles",
		help: "Named cloud worker profiles. Each profile selects a worker provider registered by a plugin and carries provider-owned settings."
	})
};
const CloudWorkersConfigSchema = object(CloudWorkersConfigShape).strict().optional();
const CLOUD_WORKER_FIELD_SCHEMAS = {
	"cloudWorkers.desktop": CloudWorkersConfigShape.desktop,
	"cloudWorkers.profiles": CloudWorkersConfigShape.profiles,
	"cloudWorkers.profiles.*": CloudWorkerProfileSchema,
	"cloudWorkers.profiles.*.provider": CloudWorkerProfileShape.provider,
	"cloudWorkers.profiles.*.install": CloudWorkerProfileShape.install,
	"cloudWorkers.profiles.*.settings": CloudWorkerProfileShape.settings
};
function projectCloudWorkerFieldMetadata(field) {
	return Object.fromEntries(Object.entries(CLOUD_WORKER_FIELD_SCHEMAS).flatMap(([path, schema]) => {
		const value = configUiMetadata.get(schema)?.[field];
		return typeof value === "string" ? [[path, value]] : [];
	}));
}
const CLOUD_WORKER_FIELD_LABELS = projectCloudWorkerFieldMetadata("label");
const CLOUD_WORKER_FIELD_HELP = projectCloudWorkerFieldMetadata("help");
//#endregion
//#region src/config/zod-schema.desktop.ts
const DesktopHostConfigShape = {
	enabled: boolean().register(configUiMetadata, {
		label: "Gateway Host Desktop (Labs)",
		help: "Enables the experimental gateway-host desktop source. Restart the gateway after changing this setting."
	}),
	managed: boolean().optional().register(configUiMetadata, {
		label: "Managed Linux Host Desktop",
		help: "Runs and supervises a loopback-only headless TigerVNC/XFCE desktop on Linux. An explicit port or existing default-port VNC server still takes precedence."
	}),
	port: number().int().min(1).max(65535).optional().register(configUiMetadata, {
		label: "Gateway Host VNC Port",
		help: "Loopback RFB port of an already-running VNC server on the gateway host (default: 5900)."
	}),
	passwordFile: string().trim().min(1).refine(path.isAbsolute, "Gateway host VNC passwordFile must be an absolute path").optional().register(configUiMetadata, {
		label: "Gateway Host VNC Password File",
		help: "Absolute path to the VNC password file. Omit on macOS to use account/ARD authentication after that support lands."
	})
};
const DesktopConfigShape = { host: object(DesktopHostConfigShape).strict().register(configUiMetadata, {
	label: "Gateway Host Desktop",
	help: "Connects to an existing loopback VNC server or, on Linux, an explicitly enabled managed headless desktop."
}).optional().register(configUiMetadata, {
	label: "Gateway Host Desktop",
	help: "Experimental gateway-host desktop observation backed by an existing or managed loopback VNC server."
}) };
const DesktopConfigSchema = object(DesktopConfigShape).strict().optional();
const DESKTOP_FIELD_SCHEMAS = {
	"desktop.host": DesktopConfigShape.host,
	"desktop.host.enabled": DesktopHostConfigShape.enabled,
	"desktop.host.managed": DesktopHostConfigShape.managed,
	"desktop.host.port": DesktopHostConfigShape.port,
	"desktop.host.passwordFile": DesktopHostConfigShape.passwordFile
};
function projectDesktopFieldMetadata(field) {
	return Object.fromEntries(Object.entries(DESKTOP_FIELD_SCHEMAS).flatMap(([fieldPath, schema]) => {
		const value = configUiMetadata.get(schema)?.[field];
		return typeof value === "string" ? [[fieldPath, value]] : [];
	}));
}
const DESKTOP_FIELD_LABELS = projectDesktopFieldMetadata("label");
const DESKTOP_FIELD_HELP = projectDesktopFieldMetadata("help");
//#endregion
//#region src/config/zod-schema.node-host.ts
const BrowserSnapshotDefaultsSchema = object({ mode: literal("efficient").optional() }).strict().optional();
const NodeHostAgentRunsSchema = object({ claude: object({ enabled: boolean().optional() }).strict().optional() }).strict().optional();
const NodeHostWorkerRunsSchema = object({ enabled: boolean().optional() }).strict().optional();
const GatewayRemoteConfigSchema = strictObject({
	url: string().optional(),
	transport: union([literal("ssh"), literal("direct")]).optional(),
	remotePort: number().int().min(1).max(65535).optional(),
	token: SecretInputSchema.optional().register(sensitive),
	password: SecretInputSchema.optional().register(sensitive),
	tlsFingerprint: string().optional(),
	sshTarget: string().optional(),
	sshIdentity: string().optional(),
	sshHostKeyPolicy: union([literal("strict"), literal("openssh")]).optional()
}).optional();
const TailscaleServiceNameSchema = string().regex(/^svc:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/, { message: "Tailscale serviceName must use the \"svc:<dns-label>\" format, for example \"svc:openclaw\"" });
const SecuritySchema = strictObject({
	audit: strictObject({ suppressions: array(strictObject({
		checkId: string().min(1),
		titleIncludes: string().min(1).optional(),
		detailIncludes: string().min(1).optional(),
		reason: string().min(1).optional()
	})).optional() }).optional(),
	installPolicy: strictObject({
		enabled: boolean().optional(),
		targets: array(union([literal("skill"), literal("plugin")])).min(1).optional(),
		exec: strictObject({
			source: literal("exec"),
			command: string().min(1),
			args: array(string()).optional(),
			timeoutMs: number().int().min(1).optional(),
			noOutputTimeoutMs: number().int().min(1).optional(),
			maxOutputBytes: number().int().min(1).optional(),
			env: record(string(), string().register(sensitive)).optional(),
			passEnv: array(string()).optional(),
			trustedDirs: array(string()).optional()
		}).optional()
	}).optional()
}).optional();
const AccessGroupsSchema = record(string().min(1), discriminatedUnion("type", [strictObject({
	type: literal("discord.channelAudience"),
	guildId: string().min(1),
	channelId: string().min(1),
	membership: literal("canViewChannel").optional()
}), strictObject({
	type: literal("message.senders"),
	members: record(string().min(1), array(string().min(1)))
})])).optional();
const LoggingLevelSchema = union([
	literal("silent"),
	literal("fatal"),
	literal("error"),
	literal("warn"),
	literal("info"),
	literal("debug"),
	literal("trace")
]);
const MemorySchema = strictObject({
	citations: union([
		literal("auto"),
		literal("on"),
		literal("off")
	]).optional(),
	search: MemorySearchSchema
}).optional();
const HttpUrlSchema = string().url().refine(isHttpUrl, "Expected http:// or https:// URL");
const McpOAuthClientMetadataUrlSchema = string().url().refine((value) => {
	const url = new URL(value);
	return isHttpsUrl(url) && url.pathname !== "/";
}, "Expected https:// URL with a non-root pathname");
const ResponsesEndpointUrlFetchShape = {
	allowUrl: boolean().optional(),
	urlAllowlist: array(string()).optional(),
	allowedMimes: array(string()).optional(),
	maxBytes: number().int().positive().optional(),
	maxRedirects: number().int().nonnegative().optional(),
	timeoutMs: number().int().positive().optional()
};
const SkillEntrySchema = strictObject({
	enabled: boolean().optional(),
	apiKey: SecretInputSchema.optional().register(sensitive),
	env: record(string(), string()).optional(),
	config: record(string(), unknown()).optional()
});
const PluginEntrySchema = strictObject({
	enabled: boolean().optional(),
	hooks: strictObject({
		allowPromptInjection: boolean().optional(),
		allowConversationAccess: boolean().optional(),
		timeoutMs: number().int().positive().max(6e5).optional(),
		timeouts: record(string(), number().int().positive().max(6e5)).optional()
	}).optional(),
	subagent: strictObject({
		allowModelOverride: boolean().optional(),
		allowedModels: array(string()).optional()
	}).optional(),
	llm: strictObject({
		allowModelOverride: boolean().optional(),
		allowedModels: array(string()).optional(),
		allowedCompletionModels: array(string()).optional(),
		allowAuthProfileOverride: boolean().optional(),
		allowAgentIdOverride: boolean().optional()
	}).optional(),
	config: record(string(), unknown()).optional()
});
const TalkProviderEntrySchema = object({ apiKey: SecretInputSchema.optional().register(sensitive) }).catchall(unknown());
const TalkRealtimeSchema = strictObject({
	provider: string().optional(),
	providers: record(string(), TalkProviderEntrySchema).optional(),
	model: string().optional(),
	speakerVoice: string().optional(),
	speakerVoiceId: string().optional(),
	instructions: string().optional(),
	mode: _enum([
		"realtime",
		"stt-tts",
		"transcription"
	]).optional(),
	transport: _enum([
		"webrtc",
		"provider-websocket",
		"gateway-relay",
		"managed-room"
	]).optional(),
	vadThreshold: number().min(0).max(1).optional(),
	silenceDurationMs: number().int().positive().optional(),
	prefixPaddingMs: number().int().nonnegative().optional(),
	reasoningEffort: string().min(1).optional(),
	brain: _enum([
		"agent-consult",
		"direct-tools",
		"none"
	]).optional(),
	consultRouting: _enum(["provider-direct", "force-agent-consult"]).optional()
}).superRefine((realtime, ctx) => {
	const provider = normalizeLowercaseStringOrEmpty(realtime.provider ?? "");
	const providers = realtime.providers ? Object.keys(realtime.providers) : [];
	if (provider && providers.length > 0 && !Object.hasOwn(realtime.providers, provider)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `talk.realtime.provider must match a key in talk.realtime.providers (missing "${provider}")`
	});
	if (!provider && providers.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: "talk.realtime.provider is required when talk.realtime.providers defines multiple providers"
	});
});
const TalkSchema = strictObject({
	agentId: string().trim().min(1).optional(),
	provider: string().optional(),
	providers: record(string(), TalkProviderEntrySchema).optional(),
	realtime: TalkRealtimeSchema.optional(),
	consultThinkingLevel: _enum([
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh",
		"adaptive",
		"max",
		"ultra"
	]).optional(),
	consultFastMode: boolean().optional(),
	speechLocale: string().optional(),
	interruptOnSpeech: boolean().optional(),
	silenceTimeoutMs: number().int().positive().optional()
}).superRefine((talk, ctx) => {
	const provider = normalizeLowercaseStringOrEmpty(talk.provider ?? "");
	const providers = talk.providers ? Object.keys(talk.providers) : [];
	if (provider && providers.length > 0 && !Object.hasOwn(talk.providers, provider)) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: `talk.provider must match a key in talk.providers (missing "${provider}")`
	});
	if (!provider && providers.length > 1) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["provider"],
		message: "talk.provider is required when talk.providers defines multiple providers"
	});
});
const McpServerSchema = object({
	enabled: boolean().optional(),
	command: string().optional(),
	args: array(string()).optional(),
	env: record(string(), union([
		string().register(sensitive),
		number(),
		boolean()
	]).register(sensitive)).optional(),
	cwd: string().optional(),
	url: HttpUrlSchema.optional(),
	transport: union([
		literal("stdio"),
		literal("sse"),
		literal("streamable-http")
	]).optional(),
	headers: record(string(), union([
		string().register(sensitive),
		number(),
		boolean()
	]).register(sensitive)).optional(),
	connectionTimeoutMs: number().finite().positive().optional(),
	requestTimeoutMs: number().finite().positive().optional(),
	supportsParallelToolCalls: boolean().optional(),
	auth: literal("oauth").optional(),
	oauth: strictObject({
		identity: _enum(["shared", "per-requester"]).optional(),
		authProfileId: string().trim().min(1).optional(),
		scope: string().trim().min(1).optional(),
		redirectUrl: HttpUrlSchema.optional(),
		clientMetadataUrl: McpOAuthClientMetadataUrlSchema.optional()
	}).optional(),
	sslVerify: boolean().optional(),
	clientCert: string().optional(),
	clientKey: string().optional(),
	toolFilter: strictObject({
		include: array(string().trim().min(1)).min(1).optional(),
		exclude: array(string().trim().min(1)).min(1).optional()
	}).optional(),
	codex: strictObject({
		agents: array(string().trim().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/i)).min(1).optional(),
		defaultToolsApprovalMode: _enum([
			"auto",
			"prompt",
			"approve"
		]).optional()
	}).optional()
}).superRefine((data, ctx) => {
	for (const key of [
		"connectTimeout",
		"connect_timeout",
		"timeout",
		"workingDirectory",
		"supports_parallel_tool_calls",
		"ssl_verify",
		"client_cert",
		"client_key"
	]) if (Object.hasOwn(data, key)) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: `Unrecognized key: "${key}"`
	});
	const codex = data.codex;
	if (codex && Object.hasOwn(codex, "default_tools_approval_mode")) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["codex", "default_tools_approval_mode"],
		message: "Unrecognized key: \"default_tools_approval_mode\""
	});
	if (Object.hasOwn(data, "disabled")) {
		const disabled = Reflect.get(data, "disabled");
		const replacement = typeof disabled === "boolean" ? `"enabled: ${!disabled}" instead, then run "openclaw doctor --fix" to migrate existing config` : "the canonical \"enabled\" boolean instead";
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: `unsupported key "disabled"; use ${replacement}`,
			path: ["disabled"]
		});
	}
	if (data.oauth?.identity === "per-requester") {
		if (data.auth !== "oauth") ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" requires auth: \"oauth\"",
			path: ["oauth", "identity"]
		});
		if (data.oauth.authProfileId) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.authProfileId cannot be used with oauth.identity \"per-requester\"",
			path: ["oauth", "authProfileId"]
		});
		if (!data.url) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" requires an HTTP server URL",
			path: ["oauth", "identity"]
		});
		if (data.command !== void 0 || data.transport === "stdio") ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "oauth.identity \"per-requester\" cannot be combined with a command or \"stdio\" transport",
			path: ["oauth", "identity"]
		});
	}
	if (data.transport === "stdio" && (typeof data.command !== "string" || data.command.trim().length === 0)) ctx.addIssue({
		code: ZodIssueCode.custom,
		message: "\"stdio\" transport requires a non-empty command",
		path: ["transport"]
	});
}).catchall(unknown());
const RESERVED_MCP_SERVER_NAME = "__proto__";
const RESERVED_MCP_SERVER_NAME_ERROR = "MCP server name \"__proto__\" is reserved; rename the server";
const McpServerNameSchema = string().refine((value) => value !== RESERVED_MCP_SERVER_NAME, RESERVED_MCP_SERVER_NAME_ERROR);
const NodeHostMcpServerNameSchema = McpServerNameSchema.refine((value) => value.length > 0 && value === value.trim(), "MCP server name must be non-empty and must not have surrounding whitespace");
function createMcpServersSchema(serverNameSchema) {
	return preprocess((value, ctx) => {
		if (value !== null && typeof value === "object" && !Array.isArray(value) && Object.hasOwn(value, RESERVED_MCP_SERVER_NAME)) {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [RESERVED_MCP_SERVER_NAME],
				message: RESERVED_MCP_SERVER_NAME_ERROR
			});
			return NEVER;
		}
		return value;
	}, record(serverNameSchema, McpServerSchema));
}
function validateHttpOrigin(value) {
	try {
		const url = new URL(value);
		return (url.protocol === "http:" || url.protocol === "https:") && url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password;
	} catch {
		return false;
	}
}
const McpConfigSchema = strictObject({
	servers: createMcpServersSchema(McpServerNameSchema).optional(),
	apps: strictObject({
		enabled: boolean().optional(),
		sandboxOrigin: string().url().refine(validateHttpOrigin, "sandboxOrigin must be an HTTP(S) origin without a path, query, or credentials").optional(),
		sandboxPort: number().int().min(1).max(65535).optional()
	}).optional()
}).optional();
const NodeHostSchema = strictObject({
	agentRuns: NodeHostAgentRunsSchema,
	workerRuns: NodeHostWorkerRunsSchema,
	browserProxy: strictObject({
		enabled: boolean().optional(),
		allowProfiles: array(string()).optional()
	}).optional(),
	mcp: strictObject({ servers: createMcpServersSchema(NodeHostMcpServerNameSchema).optional() }).optional(),
	skills: strictObject({ enabled: boolean().optional() }).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.gateway.ts
const OperatorScopeSchema = _enum([
	ADMIN_SCOPE,
	READ_SCOPE,
	WRITE_SCOPE,
	APPROVALS_SCOPE,
	QUESTIONS_SCOPE,
	PAIRING_SCOPE,
	TALK_SCOPE,
	TALK_SECRETS_SCOPE
]);
const GATEWAY_HTTP_LOOPBACK_HOSTS = /* @__PURE__ */ new Set([
	"localhost",
	"127.0.0.1",
	"[::1]"
]);
function validateGatewayPublicOrigin(value) {
	if (!validateHttpOrigin(value)) return false;
	const url = new URL(value);
	return url.protocol === "https:" || GATEWAY_HTTP_LOOPBACK_HOSTS.has(url.hostname);
}
const GatewayConfigSchema = strictObject({
	port: number().int().min(1).max(65535).optional(),
	mode: union([literal("local"), literal("remote")]).optional(),
	bind: union([
		literal("auto"),
		literal("lan"),
		literal("loopback"),
		literal("custom"),
		literal("tailnet")
	]).optional(),
	customBindHost: string().optional(),
	publicOrigin: string().url().refine(validateGatewayPublicOrigin, "gateway.publicOrigin must be a bare HTTPS origin; HTTP is allowed only for localhost, 127.0.0.1, or [::1]").optional(),
	controlUi: strictObject({
		dangerouslyDisableDeviceAuth: boolean().optional(),
		enabled: boolean().optional(),
		basePath: string().optional(),
		root: string().optional(),
		toolTitles: boolean().optional(),
		sessionObserver: boolean().optional(),
		embedSandbox: union([
			literal("strict"),
			literal("scripts"),
			literal("trusted")
		]).optional(),
		allowExternalEmbedUrls: boolean().optional(),
		allowedOrigins: array(string()).optional(),
		dangerouslyAllowHostHeaderOriginFallback: boolean().optional()
	}).optional(),
	cliAgents: strictObject({ enabled: boolean().optional() }).optional(),
	terminal: strictObject({
		enabled: boolean().optional(),
		shell: string().optional(),
		detachedSessionTimeoutSeconds: number().int().min(0).optional()
	}).optional(),
	auth: strictObject({
		mode: union([
			literal("none"),
			literal("token"),
			literal("password"),
			literal("trusted-proxy")
		]).optional(),
		token: SecretInputSchema.optional().register(sensitive),
		password: SecretInputSchema.optional().register(sensitive),
		allowTailscale: boolean().optional(),
		identityScopes: record(string().min(1), array(OperatorScopeSchema)).optional(),
		rateLimit: strictObject({
			maxAttempts: number().optional(),
			windowMs: number().optional(),
			lockoutMs: number().optional(),
			exemptLoopback: boolean().optional()
		}).optional(),
		trustedProxy: strictObject({
			userHeader: string().min(1, "userHeader is required for trusted-proxy mode"),
			requiredHeaders: array(string()).optional(),
			allowUsers: array(string()).optional(),
			allowLoopback: boolean().optional(),
			deviceAutoApprove: strictObject({
				enabled: boolean().optional(),
				scopes: array(string().min(1)).optional()
			}).optional()
		}).optional()
	}).optional(),
	trustedProxies: array(string()).optional(),
	allowRealIpFallback: boolean().optional(),
	tools: strictObject({
		deny: array(string()).optional(),
		allow: array(string()).optional()
	}).optional(),
	tailscale: strictObject({
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		resetOnExit: boolean().optional(),
		serviceName: TailscaleServiceNameSchema.optional(),
		preserveFunnel: boolean().optional()
	}).optional(),
	remote: GatewayRemoteConfigSchema,
	reload: strictObject({ mode: union([literal("off"), literal("hybrid")]).optional() }).optional(),
	tls: object({
		enabled: boolean().optional(),
		autoGenerate: boolean().optional(),
		certPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "certPath must not be blank"),
		keyPath: string().optional().refine((v) => v === void 0 || v.trim().length > 0, "keyPath must not be blank"),
		caPath: string().optional()
	}).optional(),
	http: strictObject({
		endpoints: strictObject({
			chatCompletions: strictObject({
				enabled: boolean().optional(),
				images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional()
			}).optional(),
			responses: strictObject({
				enabled: boolean().optional(),
				maxUrlParts: number().int().nonnegative().optional(),
				files: strictObject({
					...ResponsesEndpointUrlFetchShape,
					maxChars: number().int().positive().optional(),
					pdf: strictObject({
						maxPages: number().int().positive().optional(),
						maxPixels: number().int().positive().optional(),
						minTextChars: number().int().nonnegative().optional()
					}).optional()
				}).optional(),
				images: strictObject({ ...ResponsesEndpointUrlFetchShape }).optional()
			}).optional()
		}).optional(),
		securityHeaders: strictObject({ strictTransportSecurity: union([string(), literal(false)]).optional() }).optional()
	}).optional(),
	push: strictObject({ apns: strictObject({ relay: strictObject({
		baseUrl: string().optional(),
		timeoutMs: number().int().positive().optional()
	}).optional() }).optional() }).optional(),
	nodes: strictObject({
		browser: strictObject({
			mode: union([
				literal("auto"),
				literal("manual"),
				literal("off")
			]).optional(),
			node: string().optional()
		}).optional(),
		pairing: strictObject({
			autoApproveLocal: boolean().optional(),
			autoApproveCidrs: array(string()).optional(),
			sshVerify: union([boolean(), strictObject({
				user: string().optional(),
				identity: string().optional(),
				timeoutMs: number().int().positive().optional(),
				cidrs: array(string()).optional()
			})]).optional()
		}).optional(),
		pluginTools: strictObject({ enabled: boolean().optional() }).optional(),
		allowSkills: boolean().optional(),
		commands: strictObject({
			allow: array(string()).optional(),
			deny: array(string()).optional()
		}).optional()
	}).optional()
}).optional();
//#endregion
//#region src/config/zod-schema.hooks.ts
function isSafeRelativeModulePath(raw) {
	const value = raw.trim();
	if (!value) return false;
	if (path.isAbsolute(value)) return false;
	if (value.startsWith("~")) return false;
	if (value.includes(":")) return false;
	if (value.split(/[\\/]+/g).some((part) => part === "..")) return false;
	return true;
}
const SafeRelativeModulePathSchema = string().refine(isSafeRelativeModulePath, "module must be a safe relative path (no absolute paths)");
const HookMappingSchema = object({
	id: string().optional(),
	match: object({
		path: string().optional(),
		source: string().optional()
	}).optional(),
	action: union([literal("wake"), literal("agent")]).optional(),
	wakeMode: union([literal("now"), literal("next-heartbeat")]).optional(),
	name: string().optional(),
	agentId: string().optional(),
	sessionKey: string().optional().register(sensitive),
	sessionMode: union([literal("isolated"), literal("persistent")]).optional(),
	messageTemplate: string().optional(),
	textTemplate: string().optional(),
	deliver: boolean().optional(),
	allowUnsafeExternalContent: boolean().optional(),
	channel: string().trim().min(1).optional(),
	to: string().optional(),
	model: string().optional(),
	thinking: string().optional(),
	timeoutSeconds: number().int().positive().optional(),
	transform: object({
		module: SafeRelativeModulePathSchema,
		export: string().optional()
	}).strict().optional()
}).strict().optional();
const HookConfigSchema = object({
	enabled: boolean().optional(),
	env: record(string(), string()).optional()
}).passthrough();
const InternalHooksSchema = object({
	enabled: boolean().optional(),
	entries: record(string(), HookConfigSchema).optional(),
	load: object({ extraDirs: array(string()).optional() }).strict().optional()
}).strict().optional();
const HooksGmailSchema = object({
	account: string().optional(),
	label: string().optional(),
	topic: string().optional(),
	subscription: string().optional(),
	pushToken: string().optional().register(sensitive),
	hookUrl: string().optional(),
	includeBody: boolean().optional(),
	maxBytes: number().int().positive().optional(),
	renewEveryMinutes: number().int().positive().optional(),
	allowUnsafeExternalContent: boolean().optional(),
	serve: object({
		bind: string().optional(),
		port: number().int().positive().optional(),
		path: string().optional()
	}).strict().optional(),
	tailscale: object({
		mode: union([
			literal("off"),
			literal("serve"),
			literal("funnel")
		]).optional(),
		path: string().optional(),
		target: string().optional()
	}).strict().optional(),
	model: string().optional(),
	thinking: union([
		literal("off"),
		literal("minimal"),
		literal("low"),
		literal("medium"),
		literal("high")
	]).optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.proxy.ts
const ProxyLoopbackModeSchema = _enum([
	"gateway-only",
	"proxy",
	"block"
]);
const ProxyTlsConfigSchema = object({ caFile: string().min(1).optional() }).strict().optional();
const ProxyConfigSchema = object({
	enabled: boolean().optional(),
	proxyUrl: url().refine(isHttpUrl, { message: "proxyUrl must use http:// or https://" }).register(sensitive).optional(),
	tls: ProxyTlsConfigSchema,
	loopbackMode: ProxyLoopbackModeSchema.optional()
}).strict().optional();
//#endregion
//#region src/config/zod-schema.session.ts
const SessionResetConfigSchema = object({
	mode: union([
		literal("none"),
		literal("daily"),
		literal("idle")
	]).optional(),
	atHour: number().int().min(0).max(23).optional(),
	idleMinutes: number().int().positive().optional()
}).strict();
const PositiveDurationSchema = union([string(), number()]).superRefine((value, ctx) => {
	try {
		if (parseDurationMs(normalizeStringifiedOptionalString(value) ?? "", { defaultUnit: "d" }) <= 0) ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "duration must be positive (use ms, s, m, h, d), e.g. 30d"
		});
	} catch {
		ctx.addIssue({
			code: ZodIssueCode.custom,
			message: "invalid duration (use ms, s, m, h, d)"
		});
	}
});
const SessionSendPolicySchema = createAllowDenyChannelRulesSchema();
const SessionSchema = object({
	scope: union([literal("per-sender"), literal("global")]).optional(),
	dmScope: union([
		literal("main"),
		literal("per-peer"),
		literal("per-channel-peer"),
		literal("per-account-channel-peer")
	]).optional(),
	identityLinks: record(string(), array(string())).optional(),
	resetTriggers: array(string()).optional(),
	reset: SessionResetConfigSchema.optional(),
	resetByType: object({
		direct: SessionResetConfigSchema.optional(),
		group: SessionResetConfigSchema.optional(),
		thread: SessionResetConfigSchema.optional()
	}).strict().optional(),
	resetByChannel: record(string(), SessionResetConfigSchema).optional(),
	store: string().optional(),
	mainKey: string().optional(),
	sendPolicy: SessionSendPolicySchema.optional(),
	threadBindings: object({
		enabled: boolean().optional(),
		idleHours: number().nonnegative().optional(),
		maxAgeHours: number().nonnegative().optional(),
		spawnSessions: boolean().optional(),
		defaultSpawnContext: _enum(["isolated", "fork"]).optional()
	}).strict().optional(),
	sharing: object({
		readOnly: boolean().optional(),
		suggest: boolean().optional(),
		drafts: boolean().optional()
	}).strict().optional(),
	maintenance: object({
		mode: _enum(["enforce", "warn"]).optional(),
		pruneAfter: PositiveDurationSchema.optional(),
		maxEntries: number().int().positive().optional(),
		resetArchiveRetention: union([PositiveDurationSchema, literal(false)]).optional(),
		maxDiskBytes: union([
			string(),
			number(),
			literal(false)
		]).optional(),
		highWaterBytes: union([string(), number()]).optional()
	}).strict().superRefine((val, ctx) => {
		if (val.maxDiskBytes !== void 0 && val.maxDiskBytes !== false) try {
			parseByteSize(normalizeStringifiedOptionalString(val.maxDiskBytes) ?? "", { defaultUnit: "b" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["maxDiskBytes"],
				message: "invalid size (use b, kb, mb, gb, tb)"
			});
		}
		if (val.highWaterBytes !== void 0) try {
			parseByteSize(normalizeStringifiedOptionalString(val.highWaterBytes) ?? "", { defaultUnit: "b" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["highWaterBytes"],
				message: "invalid size (use b, kb, mb, gb, tb)"
			});
		}
	}).optional()
}).strict().optional();
const ResponseUsageModeSchema = _enum([
	"on",
	"off",
	"tokens",
	"full"
]);
const MessagesSchema = object({
	visibleReplies: VisibleRepliesSchema.optional(),
	responsePrefix: string().optional(),
	usageTemplate: union([string(), record(string(), unknown())]).optional(),
	responseUsage: union([ResponseUsageModeSchema, record(string(), ResponseUsageModeSchema)]).optional(),
	groupChat: GroupChatSchema,
	queue: QueueSchema,
	inbound: InboundDebounceSchema,
	ackReaction: string().optional(),
	ackReactionScope: _enum([
		"group-mentions",
		"group-all",
		"direct",
		"all",
		"off",
		"none"
	]).optional(),
	statusReactions: object({ enabled: boolean().optional() }).strict().optional(),
	suppressToolErrors: boolean().optional()
}).strict().optional();
const CommandsSchema = object({
	native: NativeCommandsSettingSchema.optional().default("auto"),
	nativeSkills: NativeCommandsSettingSchema.optional().default("auto"),
	text: boolean().optional(),
	bash: boolean().optional(),
	bashForegroundMs: number().int().min(0).max(3e4).optional(),
	config: boolean().optional(),
	mcp: boolean().optional(),
	plugins: boolean().optional(),
	debug: boolean().optional(),
	restart: boolean().optional().default(true),
	ownerAllowFrom: array(union([string(), number()])).optional(),
	allowFrom: ElevatedAllowFromSchema.optional()
}).strict().optional().default(() => ({
	native: "auto",
	nativeSkills: "auto",
	restart: true
}));
//#endregion
//#region src/config/zod-schema.root-shape.ts
const MetricNamePrefixSchema = string().max(128).regex(/^(?:[A-Za-z][A-Za-z0-9_./-]*)?$/);
const OpenClawSchemaShape = {
	$schema: string().optional(),
	meta: strictObject({
		lastTouchedVersion: string().optional(),
		migrations: strictObject({ modelPolicyAllowlist: literal(true).optional() }).optional()
	}).optional(),
	env: object({
		shellEnv: strictObject({
			enabled: boolean().optional(),
			timeoutMs: number().int().nonnegative().optional()
		}).optional(),
		vars: record(string(), string()).optional()
	}).strict().optional(),
	wizard: strictObject({
		accessMode: union([literal("full"), literal("guarded")]).optional(),
		appRecommendations: boolean().optional(),
		lastRunAt: string().optional(),
		lastRunVersion: string().optional(),
		lastRunCommit: string().optional(),
		lastRunCommand: string().optional(),
		lastRunMode: union([literal("local"), literal("remote")]).optional(),
		localModelLeanAutoModel: string().optional(),
		securityAcknowledgedAt: string().optional()
	}).optional(),
	diagnostics: strictObject({
		enabled: boolean().optional(),
		flags: array(string()).optional(),
		otel: strictObject({
			enabled: boolean().optional(),
			endpoint: string().optional(),
			tracesEndpoint: string().optional(),
			metricsEndpoint: string().optional(),
			logsEndpoint: string().optional(),
			protocol: literal("http/protobuf").optional(),
			headers: record(string(), string()).optional(),
			serviceName: string().optional(),
			metricNamePrefix: MetricNamePrefixSchema.optional(),
			traces: boolean().optional(),
			metrics: boolean().optional(),
			logs: boolean().optional(),
			logsExporter: union([
				literal("otlp"),
				literal("stdout"),
				literal("both")
			]).optional(),
			sampleRate: number().min(0).max(1).optional(),
			flushIntervalMs: number().int().nonnegative().optional(),
			captureContent: boolean().optional()
		}).optional(),
		cacheTrace: strictObject({ enabled: boolean().optional() }).optional()
	}).optional(),
	logging: strictObject({
		level: LoggingLevelSchema.optional(),
		file: string().optional(),
		maxFileBytes: number().int().positive().optional(),
		consoleLevel: LoggingLevelSchema.optional(),
		consoleStyle: union([literal("pretty"), literal("json")]).optional(),
		redactPatterns: array(string()).optional(),
		audit: strictObject({
			enabled: boolean().optional(),
			executionIdentity: boolean().optional(),
			messages: union([
				literal("off"),
				literal("direct"),
				literal("all")
			]).optional()
		}).optional()
	}).optional(),
	update: strictObject({
		channel: union([
			literal("stable"),
			literal("extended-stable"),
			literal("beta"),
			literal("dev")
		]).optional(),
		checkOnStart: boolean().optional(),
		auto: strictObject({ enabled: boolean().optional() }).optional()
	}).optional(),
	browser: strictObject({
		enabled: boolean().optional(),
		allowSystemProfileImport: boolean().optional(),
		evaluateEnabled: boolean().optional(),
		cdpUrl: string().optional(),
		executablePath: string().optional(),
		headless: boolean().optional(),
		noSandbox: boolean().optional(),
		attachOnly: boolean().optional(),
		defaultProfile: string().optional(),
		snapshotDefaults: BrowserSnapshotDefaultsSchema,
		ssrfPolicy: SsrFPolicyConfigSchema.optional(),
		profiles: record(string().regex(/^[a-z0-9-]+$/, "Profile names must be alphanumeric with hyphens only"), strictObject({
			cdpPort: number().int().min(1).max(65535).optional(),
			cdpUrl: string().optional(),
			userDataDir: string().optional(),
			mcpCommand: string().optional(),
			mcpArgs: array(string()).optional(),
			driver: union([
				literal("openclaw"),
				literal("clawd"),
				literal("existing-session"),
				literal("extension")
			]).optional(),
			headless: boolean().optional(),
			executablePath: string().optional(),
			attachOnly: boolean().optional()
		}).refine((value) => value.driver === "existing-session" || value.driver === "extension" || value.cdpPort || value.cdpUrl, { message: "Profile must set cdpPort or cdpUrl" }).refine((value) => value.driver === "existing-session" || !value.userDataDir, { message: "Profile userDataDir is only supported with driver=\"existing-session\"" }).refine((value) => value.driver !== "extension" || !value.cdpUrl, { message: "Profile cdpUrl is not supported with driver=\"extension\" (the relay owns the endpoint)" })).optional(),
		extraArgs: array(string()).optional(),
		tabCleanup: strictObject({ enabled: boolean().optional() }).optional(),
		extensionRelay: strictObject({ allowLegacyAuth: boolean().optional() }).optional()
	}).optional(),
	ui: strictObject({
		seamColor: HexColorSchema.optional(),
		assistant: strictObject({
			name: string().max(50).optional(),
			avatar: string().max(2e6).optional()
		}).optional(),
		prefs: strictObject({
			theme: union([
				literal("claw"),
				literal("knot"),
				literal("dash"),
				literal("custom")
			]).optional(),
			themeMode: union([
				literal("light"),
				literal("dark"),
				literal("system")
			]).optional(),
			locale: string().max(20).optional(),
			chatShowThinking: boolean().optional(),
			chatShowToolCalls: boolean().optional(),
			chatPersistCommentary: boolean().optional(),
			chatSendShortcut: union([literal("enter"), literal("modifier-enter")]).optional(),
			chatFollowUpMode: union([literal("steer"), literal("queue")]).optional(),
			sidebarEntries: array(string()).optional()
		}).optional()
	}).optional(),
	secrets: SecretsConfigSchema,
	auth: strictObject({
		profiles: record(string(), strictObject({
			provider: string(),
			mode: union([
				literal("api_key"),
				literal("aws-sdk"),
				literal("oauth"),
				literal("token")
			]),
			email: string().optional(),
			displayName: string().optional()
		})).optional(),
		order: record(string(), array(string())).optional()
	}).optional(),
	accessGroups: AccessGroupsSchema,
	acp: strictObject({
		enabled: boolean().optional(),
		dispatch: strictObject({ enabled: boolean().optional() }).optional(),
		backend: string().optional(),
		fallbacks: array(string()).optional(),
		defaultAgent: string().optional(),
		allowedAgents: array(string()).optional(),
		stream: strictObject({
			repeatSuppression: boolean().optional(),
			deliveryMode: union([literal("live"), literal("final_only")]).optional(),
			tagVisibility: record(string(), boolean()).optional()
		}).optional(),
		runtime: strictObject({ installCommand: string().optional() }).optional()
	}).optional(),
	models: ModelsConfigSchema,
	nodeHost: NodeHostSchema,
	agents: AgentsSchema,
	tools: ToolsSchema,
	security: SecuritySchema,
	bindings: BindingsSchema,
	broadcast: BroadcastSchema,
	attachments: strictObject({ ttlHours: number().int().min(1).max(168).optional() }).optional(),
	messages: MessagesSchema,
	tts: TtsConfigSchema,
	commands: CommandsSchema,
	approvals: ApprovalsSchema,
	session: SessionSchema,
	cron: strictObject({
		enabled: boolean().optional(),
		triggers: strictObject({ enabled: boolean().optional() }).optional(),
		webhookToken: SecretInputSchema.optional().register(sensitive),
		webhookSsrfPolicy: SsrFPolicyConfigSchema.optional(),
		sessionRetention: union([string(), literal(false)]).optional(),
		failureAlert: strictObject({
			enabled: boolean().optional(),
			after: number().int().min(1).optional(),
			cooldownMs: number().int().min(0).optional(),
			includeSkipped: boolean().optional(),
			mode: _enum(["announce", "webhook"]).optional(),
			accountId: string().optional(),
			channel: string().optional(),
			to: string().optional()
		}).optional()
	}).superRefine((val, ctx) => {
		if (val.sessionRetention !== void 0 && val.sessionRetention !== false) try {
			parseDurationMs(normalizeStringifiedOptionalString(val.sessionRetention) ?? "", { defaultUnit: "h" });
		} catch {
			ctx.addIssue({
				code: ZodIssueCode.custom,
				path: ["sessionRetention"],
				message: "invalid duration (use ms, s, m, h, d)"
			});
		}
	}).optional(),
	transcripts: strictObject({
		enabled: boolean().optional(),
		autoStart: array(strictObject({
			providerId: string().min(1),
			sessionId: string().min(1).optional(),
			title: string().min(1).optional(),
			accountId: string().min(1).optional(),
			guildId: string().min(1).optional(),
			channelId: string().min(1).optional(),
			meetingUrl: string().min(1).optional()
		})).optional()
	}).optional(),
	hooks: strictObject({
		enabled: boolean().optional(),
		path: string().optional(),
		token: string().optional().register(sensitive),
		defaultSessionKey: string().optional(),
		allowRequestSessionKey: boolean().optional(),
		allowedSessionKeyPrefixes: array(string()).optional(),
		allowedAgentIds: array(string()).optional(),
		presets: array(string()).optional(),
		transformsDir: string().optional(),
		mappings: array(HookMappingSchema).optional(),
		gmail: HooksGmailSchema,
		internal: InternalHooksSchema
	}).superRefine((hooks, ctx) => {
		const hasDefaultSessionKey = hooks.defaultSessionKey?.trim();
		for (const [index, mapping] of (hooks.mappings ?? []).entries()) {
			if (!mapping) continue;
			if ((mapping.action ?? "agent") === "agent" && mapping.sessionMode === "persistent" && !mapping.sessionKey?.trim() && !hasDefaultSessionKey && !mapping.transform) ctx.addIssue({
				code: ZodIssueCode.custom,
				path: [
					"mappings",
					index,
					"sessionKey"
				],
				message: "persistent hook mappings require sessionKey, hooks.defaultSessionKey, or a transform"
			});
		}
	}).optional(),
	channels: ChannelsSchema,
	discovery: strictObject({
		wideArea: strictObject({ domain: string().optional() }).optional(),
		mdns: strictObject({ mode: _enum([
			"off",
			"minimal",
			"full"
		]).optional() }).optional()
	}).optional(),
	talk: TalkSchema.optional(),
	gateway: GatewayConfigSchema,
	cloudWorkers: CloudWorkersConfigSchema,
	desktop: DesktopConfigSchema,
	memory: MemorySchema,
	mcp: McpConfigSchema,
	skills: strictObject({
		allowBundled: array(string()).optional(),
		load: strictObject({
			extraDirs: array(string()).optional(),
			allowSymlinkTargets: array(string()).optional(),
			watch: boolean().optional()
		}).optional(),
		install: strictObject({
			preferBrew: boolean().optional(),
			nodeManager: union([
				literal("npm"),
				literal("pnpm"),
				literal("yarn"),
				literal("bun")
			]).optional(),
			allowUploadedArchives: boolean().optional()
		}).optional(),
		limits: strictObject({
			maxCandidatesPerRoot: number().int().min(1).optional(),
			maxSkillsLoadedPerSource: number().int().min(1).optional(),
			maxSkillsInPrompt: number().int().min(0).optional(),
			maxSkillsPromptChars: number().int().min(0).optional(),
			maxSkillFileBytes: number().int().min(0).optional()
		}).optional(),
		workshop: strictObject({
			autonomous: strictObject({ mode: union([
				literal("off"),
				literal("propose"),
				literal("auto")
			]).optional() }).optional(),
			approvalPolicy: union([literal("pending"), literal("auto")]).optional(),
			allowSymlinkTargetWrites: boolean().optional(),
			maxPending: number().int().min(1).optional(),
			maxSkillBytes: number().int().min(1).optional()
		}).optional(),
		entries: record(string(), SkillEntrySchema).optional()
	}).optional(),
	plugins: strictObject({
		enabled: boolean().optional(),
		allow: array(string()).optional(),
		deny: array(string()).optional(),
		load: strictObject({ paths: array(string()).optional() }).optional(),
		slots: strictObject({
			memory: string().optional(),
			contextEngine: string().optional()
		}).optional(),
		entries: record(string(), PluginEntrySchema).optional()
	}).optional(),
	surfaces: record(string(), strictObject({ silentReply: SilentReplyPolicyConfigSchema.optional() })).optional(),
	proxy: ProxyConfigSchema
};
//#endregion
//#region src/config/zod-schema.ts
function installZodDefaultLocale() {
	config(en_default());
}
installZodDefaultLocale();
const OpenClawSchema = strictObject(OpenClawSchemaShape).superRefine((cfg, ctx) => {
	const agents = listAgentEntries(cfg);
	const agentIds = new Set(agents.map((agent) => agent.id));
	const effectiveAgentIds = new Set(agents.map((agent) => normalizeAgentId(agent.id)));
	if (agents.length === 0) effectiveAgentIds.add("main");
	const explicitTargets = [
		{
			path: [
				"agents",
				"defaults",
				"heartbeat",
				"agentId"
			],
			agentId: cfg.agents?.defaults?.heartbeat?.agentId
		},
		{
			path: [
				"agents",
				"defaults",
				"systemAgent",
				"agentId"
			],
			agentId: cfg.agents?.defaults?.systemAgent?.agentId
		},
		{
			path: ["talk", "agentId"],
			agentId: cfg.talk?.agentId
		}
	];
	for (const target of explicitTargets) if (typeof target.agentId === "string" && !effectiveAgentIds.has(normalizeAgentId(target.agentId))) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: [...target.path],
		message: `Unknown agent id "${target.agentId}" (not in agents.entries).`
	});
	if (agents.length === 0) return;
	const bindings = cfg.bindings;
	if (Array.isArray(bindings)) for (let idx = 0; idx < bindings.length; idx += 1) {
		const binding = bindings[idx];
		if (!binding || typeof binding !== "object") continue;
		const agentId = binding.agentId;
		if (typeof agentId === "string" && agentId !== "main" && !effectiveAgentIds.has(normalizeAgentId(agentId))) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"bindings",
				idx,
				"agentId"
			],
			message: `Unknown agent id "${agentId}" (not in agents.entries).`
		});
	}
	const broadcast = cfg.broadcast;
	if (!broadcast) return;
	for (const [peerId, ids] of Object.entries(broadcast)) {
		if (peerId === "strategy") continue;
		if (!Array.isArray(ids)) continue;
		for (const [idx, agentId] of ids.entries()) if (!agentIds.has(agentId)) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: [
				"broadcast",
				peerId,
				idx
			],
			message: `Unknown agent id "${agentId}" (not in agents.entries).`
		});
	}
});
//#endregion
export { DESKTOP_FIELD_LABELS as a, validateCloudWorkerProfileSettings as c, asSchemaObject as d, cloneSchema as f, DESKTOP_FIELD_HELP as i, parseNonNegativeByteSize as l, schemaHasChildren as m, McpServerNameSchema as n, CLOUD_WORKER_FIELD_HELP as o, findWildcardHintMatch as p, NodeHostMcpServerNameSchema as r, CLOUD_WORKER_FIELD_LABELS as s, OpenClawSchema as t, parseByteSize as u };
