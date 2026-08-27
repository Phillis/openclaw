import { u as normalizeStringEntries } from "./string-normalization-e_fvmxMf.js";
import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-Bre8L6Ts.js";
import { At as boolean, Bt as discriminatedUnion, Et as array, Kn as tuple, Nn as record, Rn as string, St as _null, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number, yt as _enum } from "./schemas-CZ9Toj_c.js";
import { n as ZodIssueCode } from "./compat-BJw8yvyp.js";
import { t as isSafeExecutableValue } from "./exec-safety-DtLGRBJm.js";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.js";
import { i as formatExecSecretRefIdValidationMessage, o as isValidExecSecretRefId, s as isValidFileSecretRefId, t as SECRET_PROVIDER_ALIAS_PATTERN } from "./ref-contract-BHWY70rN.js";
import { t as isBuiltInModelProviderOverlayId } from "./model-provider-config-B3wTMsqG.js";
import { n as MODEL_THINKING_FORMATS, t as MODEL_APIS } from "./types.models-Z6EPRVI_.js";
import { n as sensitive } from "./zod-schema.sensitive-OPEpgIMg.js";
import path from "node:path";
//#region src/config/zod-schema.allowdeny.ts
const AllowDenyActionSchema = union([literal("allow"), literal("deny")]);
const AllowDenyChatTypeSchema = union([
	literal("direct"),
	literal("group"),
	literal("channel")
]).optional();
function createAllowDenyChannelRulesSchema() {
	return object({
		default: AllowDenyActionSchema.optional(),
		rules: array(object({
			action: AllowDenyActionSchema,
			match: object({
				channel: string().optional(),
				chatType: AllowDenyChatTypeSchema,
				keyPrefix: string().optional(),
				rawKeyPrefix: string().optional()
			}).strict().optional()
		}).strict()).optional()
	}).strict().optional();
}
//#endregion
//#region src/config/zod-schema.core.ts
const WINDOWS_ABS_PATH_PATTERN = /^[A-Za-z]:[\\/]/;
const WINDOWS_UNC_PATH_PATTERN = /^\\\\[^\\]+\\[^\\]+/;
function isAbsolutePath(value) {
	return path.isAbsolute(value) || WINDOWS_ABS_PATH_PATTERN.test(value) || WINDOWS_UNC_PATH_PATTERN.test(value);
}
/** Config-level secret reference schema shared by model/provider/plugin credential fields. */
const SecretRefSchema = discriminatedUnion("source", [
	object({
		source: literal("env"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().regex(ENV_SECRET_REF_ID_RE, "Env secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict(),
	object({
		source: literal("file"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().refine(isValidFileSecretRefId, "File secret reference id must be an absolute JSON pointer (example: \"/providers/openai/apiKey\"), or \"value\" for singleValue mode.")
	}).strict(),
	object({
		source: literal("exec"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().refine(isValidExecSecretRefId, formatExecSecretRefIdValidationMessage())
	}).strict(),
	object({
		source: literal("store"),
		provider: string().regex(SECRET_PROVIDER_ALIAS_PATTERN, "Secret reference provider must match /^[a-z][a-z0-9_-]{0,63}$/ (example: \"default\")."),
		id: string().regex(ENV_SECRET_REF_ID_RE, "Store secret reference id must match /^[A-Z][A-Z0-9_]{0,127}$/ (example: \"OPENAI_API_KEY\").")
	}).strict()
]);
/** Accepts either legacy inline secret strings or structured secret references. */
const SecretInputSchema = union([string(), SecretRefSchema]);
/** Canonical operator-configurable SSRF policy shared by network-capable surfaces. */
const SsrFPolicyConfigSchema = object({
	dangerouslyAllowPrivateNetwork: boolean().optional(),
	allowRfc2544BenchmarkRange: boolean().optional(),
	allowIpv6UniqueLocalRange: boolean().optional(),
	allowedHostnames: array(string()).optional()
}).strict();
const SecretsEnvProviderSchema = object({
	source: literal("env"),
	allowlist: array(string().regex(ENV_SECRET_REF_ID_RE)).max(256).optional()
}).strict();
const SecretsFileProviderSchema = object({
	source: literal("file"),
	path: string().min(1),
	mode: union([literal("singleValue"), literal("json")]).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	maxBytes: number().int().positive().max(20 * 1024 * 1024).optional()
}).strict();
const SecretsExecProviderSchema = union([object({
	source: literal("exec"),
	command: string().min(1).refine((value) => isSafeExecutableValue(value), "secrets.providers.*.command is unsafe.").refine((value) => isAbsolutePath(value), "secrets.providers.*.command must be an absolute path."),
	args: array(string().max(1024)).max(128).optional(),
	timeoutMs: number().int().positive().max(12e4).optional(),
	noOutputTimeoutMs: number().int().positive().max(12e4).optional(),
	maxOutputBytes: number().int().positive().max(20 * 1024 * 1024).optional(),
	jsonOnly: boolean().optional(),
	env: record(string(), string()).optional(),
	passEnv: array(string().regex(ENV_SECRET_REF_ID_RE)).max(128).optional(),
	trustedDirs: array(string().min(1).refine((value) => isAbsolutePath(value), "trustedDirs entries must be absolute paths.")).max(64).optional()
}).strict(), object({
	source: literal("exec"),
	pluginIntegration: object({
		pluginId: string().min(1).max(128),
		integrationId: string().min(1).max(128)
	}).strict()
}).strict()]);
const SecretsStoreProviderSchema = object({ source: literal("store") }).strict();
const EgressProxyExactHostSchema = string().trim().min(1).superRefine((host, ctx) => {
	try {
		normalizeExactAllowedHost(host);
	} catch (error) {
		ctx.addIssue({
			code: "custom",
			message: error instanceof Error ? error.message : "Invalid allowed host"
		});
	}
});
/** Schema for one configured env/file/exec/store secret provider entry. */
const SecretProviderSchema = union([
	SecretsEnvProviderSchema,
	SecretsFileProviderSchema,
	SecretsExecProviderSchema,
	SecretsStoreProviderSchema
]);
/** Schema for the top-level `secrets` config block. */
const SecretsConfigSchema = object({
	egressProxy: object({
		enabled: boolean().optional(),
		allowedHosts: array(EgressProxyExactHostSchema).max(256).optional(),
		bypassHosts: array(EgressProxyExactHostSchema).max(256).optional()
	}).strict().optional(),
	providers: object({}).catchall(SecretProviderSchema).optional(),
	defaults: object({
		env: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		file: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		exec: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional(),
		store: string().regex(SECRET_PROVIDER_ALIAS_PATTERN).optional()
	}).strict().optional()
}).strict().optional();
const LEGACY_OPENAI_CODEX_RESPONSES_API = "openai-codex-responses";
const OPENAI_CHATGPT_RESPONSES_API = "openai-chatgpt-responses";
const ModelApiSchema = _enum(MODEL_APIS, { error: (issue) => issue.input === LEGACY_OPENAI_CODEX_RESPONSES_API ? `"${LEGACY_OPENAI_CODEX_RESPONSES_API}" is a removed api id; use "${OPENAI_CHATGPT_RESPONSES_API}"` : void 0 });
const ModelCompatSchema = object({
	supportsStore: boolean().optional(),
	supportsPromptCacheKey: boolean().optional(),
	supportsDeveloperRole: boolean().optional(),
	supportsReasoningEffort: boolean().optional(),
	supportsTemperature: boolean().optional(),
	supportsUsageInStreaming: boolean().optional(),
	supportsTools: boolean().optional(),
	codeMode: _enum(["preferred", "capable"]).optional(),
	supportsStrictMode: boolean().optional(),
	supportsJsonSchemaResponseFormat: boolean().optional(),
	requiresStringContent: boolean().optional(),
	strictMessageKeys: boolean().optional(),
	visibleReasoningDetailTypes: array(string().min(1)).optional(),
	supportedReasoningEfforts: array(string().min(1)).optional(),
	reasoningEffortMap: record(string().min(1), string().min(1)).optional(),
	maxTokensField: union([literal("max_completion_tokens"), literal("max_tokens")]).optional(),
	thinkingFormat: _enum(MODEL_THINKING_FORMATS).optional(),
	requiresToolResultName: boolean().optional(),
	requiresAssistantAfterToolResult: boolean().optional(),
	requiresThinkingAsText: boolean().optional(),
	requiresReasoningContentOnAssistantMessages: boolean().optional(),
	toolSchemaProfile: string().optional(),
	unsupportedToolSchemaKeywords: array(string().min(1)).optional(),
	toolCallArgumentsEncoding: string().optional(),
	requiresOpenAiAnthropicToolPayload: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestTlsSchema = object({
	ca: SecretInputSchema.optional().register(sensitive),
	cert: SecretInputSchema.optional().register(sensitive),
	key: SecretInputSchema.optional().register(sensitive),
	passphrase: SecretInputSchema.optional().register(sensitive),
	serverName: string().optional(),
	insecureSkipVerify: boolean().optional()
}).strict().optional();
const ConfiguredProviderRequestAuthSchema = union([
	object({ mode: literal("provider-default") }).strict(),
	object({
		mode: literal("authorization-bearer"),
		token: SecretInputSchema.register(sensitive)
	}).strict(),
	object({
		mode: literal("header"),
		headerName: string().min(1),
		value: SecretInputSchema.register(sensitive),
		prefix: string().optional()
	}).strict()
]).optional();
const ConfiguredProviderRequestProxySchema = union([object({
	mode: literal("env-proxy"),
	tls: ConfiguredProviderRequestTlsSchema
}).strict(), object({
	mode: literal("explicit-proxy"),
	url: string().min(1),
	tls: ConfiguredProviderRequestTlsSchema
}).strict()]).optional();
const ConfiguredProviderRequestFields = {
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	auth: ConfiguredProviderRequestAuthSchema,
	proxy: ConfiguredProviderRequestProxySchema,
	tls: ConfiguredProviderRequestTlsSchema
};
const ConfiguredProviderRequestSchema = object(ConfiguredProviderRequestFields).strict().optional();
const ConfiguredModelProviderRequestSchema = object({
	...ConfiguredProviderRequestFields,
	allowPrivateNetwork: boolean().optional()
}).strict().optional();
const ModelAgentRuntimePolicySchema = object({ id: string().optional() }).strict().optional();
const ModelMediaInputSchema = object({ image: object({
	maxBytes: number().int().positive().optional(),
	maxPixels: number().int().positive().optional(),
	maxSidePx: number().int().positive().optional(),
	preferredSidePx: number().int().positive().optional(),
	tokenMode: union([
		literal("tile"),
		literal("detail"),
		literal("provider")
	]).optional()
}).strict().optional() }).strict();
const ThinkingLevelMapValueSchema = string().nullable();
const ThinkingLevelMapSchema = object({
	off: ThinkingLevelMapValueSchema.optional(),
	minimal: ThinkingLevelMapValueSchema.optional(),
	low: ThinkingLevelMapValueSchema.optional(),
	medium: ThinkingLevelMapValueSchema.optional(),
	high: ThinkingLevelMapValueSchema.optional(),
	xhigh: ThinkingLevelMapValueSchema.optional(),
	max: ThinkingLevelMapValueSchema.optional()
}).strict();
const ModelDefinitionSchema = object({
	id: string().min(1),
	name: string().min(1),
	api: ModelApiSchema.optional(),
	baseUrl: string().min(1).optional(),
	reasoning: boolean().optional(),
	input: array(union([
		literal("text"),
		literal("image"),
		literal("video"),
		literal("audio")
	])).optional(),
	cost: object({
		input: number().optional(),
		output: number().optional(),
		cacheRead: number().optional(),
		cacheWrite: number().optional(),
		tieredPricing: array(object({
			input: number(),
			output: number(),
			cacheRead: number(),
			cacheWrite: number(),
			range: union([tuple([number(), number()]), tuple([number()])])
		}).strict()).optional()
	}).strict().optional(),
	contextWindow: number().positive().optional(),
	contextTokens: number().int().positive().optional(),
	maxTokens: number().positive().optional(),
	thinkingLevelMap: ThinkingLevelMapSchema.optional(),
	params: record(string(), unknown()).optional(),
	agentRuntime: ModelAgentRuntimePolicySchema,
	headers: record(string(), string()).optional(),
	compat: ModelCompatSchema,
	mediaInput: ModelMediaInputSchema.optional(),
	metadataSource: literal("models-add").optional()
}).strict();
const ModelProviderLocalServiceSchema = object({
	command: string().min(1),
	args: array(string()).optional(),
	cwd: string().min(1).optional(),
	env: record(string(), string().register(sensitive)).optional(),
	healthUrl: string().min(1).optional(),
	readyTimeoutMs: number().int().positive().optional(),
	idleStopMs: number().int().nonnegative().optional()
}).strict().optional();
const ModelProviderSchema = object({
	baseUrl: string().optional(),
	apiKey: SecretInputSchema.optional().register(sensitive),
	auth: union([
		literal("api-key"),
		literal("aws-sdk"),
		literal("oauth"),
		literal("token")
	]).optional(),
	api: ModelApiSchema.optional(),
	maxTokens: number().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	region: string().min(1).optional(),
	injectNumCtxForOpenAICompat: boolean().optional(),
	params: record(string(), unknown()).optional(),
	agentRuntime: ModelAgentRuntimePolicySchema,
	localService: ModelProviderLocalServiceSchema,
	headers: record(string(), SecretInputSchema.register(sensitive)).optional(),
	authHeader: boolean().optional(),
	request: ConfiguredModelProviderRequestSchema,
	models: array(ModelDefinitionSchema).optional()
}).strict();
const ModelProvidersSchema = record(string(), ModelProviderSchema).superRefine((providers, ctx) => {
	for (const [providerId, provider] of Object.entries(providers)) {
		if (isBuiltInModelProviderOverlayId(providerId)) continue;
		if (!provider.baseUrl) ctx.addIssue({
			code: "custom",
			path: [providerId, "baseUrl"],
			message: "custom model providers must declare baseUrl; provider overlays without baseUrl are only supported for bundled providers"
		});
		if (!Array.isArray(provider.models)) ctx.addIssue({
			code: "custom",
			path: [providerId, "models"],
			message: "custom model providers must declare models; provider overlays without models are only supported for bundled providers"
		});
	}
});
const ModelCatalogRefreshConfigSchema = object({
	enabled: boolean().optional(),
	url: string().refine((value) => {
		try {
			const parsed = new URL(value);
			return parsed.protocol === "https:" || parsed.protocol === "http:" && [
				"localhost",
				"127.0.0.1",
				"[::1]"
			].includes(parsed.hostname);
		} catch {
			return false;
		}
	}, { message: "models.catalogRefresh.url must use https, or http on localhost" }).optional()
}).strict().optional();
const ModelsConfigSchema = object({
	mode: union([literal("merge"), literal("replace")]).optional(),
	providers: ModelProvidersSchema.optional(),
	catalogRefresh: ModelCatalogRefreshConfigSchema
}).strict().optional();
const VisibleRepliesValueSchema = _enum(["automatic", "message_tool"]);
const AmbientGroupInboundSchema = _enum(["user_request", "room_event"]);
const VisibleRepliesSchema = union([VisibleRepliesValueSchema, boolean()]).overwrite((value) => {
	if (value === true) return "automatic";
	if (value === false) return "message_tool";
	return value;
});
const MentionPatternsPolicySchema = object({
	mode: union([literal("allow"), literal("deny")]).optional(),
	allowIn: array(string()).optional(),
	denyIn: array(string()).optional()
}).strict();
const GroupChatSchema = object({
	mentionPatterns: array(string()).optional(),
	historyLimit: number().int().min(0).optional(),
	unmentionedInbound: AmbientGroupInboundSchema.optional(),
	visibleReplies: VisibleRepliesSchema.optional()
}).strict().optional();
const DmConfigSchema = object({ historyLimit: number().int().min(0).optional() }).strict();
const IdentitySchema = object({
	name: string().optional(),
	theme: string().optional(),
	emoji: string().optional(),
	avatar: string().optional()
}).strict().optional();
const QueueModeSchema = union([
	literal("steer"),
	literal("followup"),
	literal("collect"),
	literal("interrupt")
]);
const QueueDropSchema = union([
	literal("old"),
	literal("new"),
	literal("summarize")
]);
const ReplyToModeSchema = union([
	literal("off"),
	literal("first"),
	literal("all"),
	literal("batched")
]);
const TypingModeSchema = union([
	literal("never"),
	literal("instant"),
	literal("thinking"),
	literal("message")
]);
const GroupPolicySchema = _enum([
	"open",
	"disabled",
	"allowlist"
]);
const DmPolicySchema = _enum([
	"pairing",
	"allowlist",
	"open",
	"disabled"
]);
const ContextVisibilityModeSchema = _enum([
	"all",
	"allowlist",
	"allowlist_quote"
]);
const BlockStreamingCoalesceSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	idleMs: number().int().nonnegative().optional()
}).strict();
const TextChunkModeSchema = _enum(["length", "newline"]);
const ChannelStreamingBlockSchema = object({
	enabled: boolean().optional(),
	coalesce: BlockStreamingCoalesceSchema.optional()
}).strict();
/** Delivery-only nested streaming config for channels without preview modes. */
const ChannelDeliveryStreamingConfigSchema = object({
	chunkMode: TextChunkModeSchema.optional(),
	block: ChannelStreamingBlockSchema.optional()
}).strict();
const ReplyRuntimeConfigSchemaShape = {
	historyLimit: number().int().min(0).optional(),
	dmHistoryLimit: number().int().min(0).optional(),
	contextVisibility: ContextVisibilityModeSchema.optional(),
	dms: record(string(), DmConfigSchema.optional()).optional(),
	textChunkLimit: number().int().positive().optional(),
	streaming: ChannelDeliveryStreamingConfigSchema.optional(),
	responsePrefix: string().optional(),
	mediaMaxMb: number().positive().optional()
};
const BlockStreamingChunkSchema = object({
	minChars: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	breakPreference: union([
		literal("paragraph"),
		literal("newline"),
		literal("sentence")
	]).optional()
}).strict();
const MarkdownConfigSchema = object({ tables: _enum([
	"off",
	"bullets",
	"code",
	"block"
]).optional() }).strict().optional();
const TtsProviderSchema = string().min(1);
const TtsModeSchema = _enum(["final", "all"]);
const TtsAutoSchema = _enum([
	"off",
	"always",
	"inbound",
	"tagged"
]);
const TtsProviderConfigSchema = object({ apiKey: SecretInputSchema.optional().register(sensitive) }).catchall(union([
	string(),
	number(),
	boolean(),
	_null(),
	array(unknown()),
	record(string(), unknown())
]));
const TtsPersonaSchema = object({
	label: string().optional(),
	description: string().optional(),
	provider: TtsProviderSchema.optional(),
	fallbackPolicy: union([
		literal("preserve-persona"),
		literal("provider-defaults"),
		literal("fail")
	]).optional(),
	providers: record(string(), TtsProviderConfigSchema).optional()
}).strict();
const TtsConfigSchema = object({
	auto: TtsAutoSchema.optional(),
	enabled: boolean().optional(),
	mode: TtsModeSchema.optional(),
	provider: TtsProviderSchema.optional(),
	persona: string().optional(),
	personas: record(string(), TtsPersonaSchema).optional(),
	summaryModel: string().optional(),
	modelOverrides: object({
		enabled: boolean().optional(),
		allowText: boolean().optional(),
		allowProvider: boolean().optional(),
		allowVoice: boolean().optional(),
		allowModelId: boolean().optional(),
		allowVoiceSettings: boolean().optional(),
		allowNormalization: boolean().optional(),
		allowSeed: boolean().optional()
	}).strict().optional(),
	providers: record(string(), TtsProviderConfigSchema).optional(),
	maxTextLength: number().int().min(1).optional(),
	timeoutMs: number().int().min(1e3).max(12e4).optional()
}).strict().optional();
const HumanDelaySchema = object({
	mode: union([
		literal("off"),
		literal("natural"),
		literal("custom")
	]).optional(),
	minMs: number().int().nonnegative().optional(),
	maxMs: number().int().nonnegative().optional()
}).strict();
const normalizeAllowFrom = (values) => normalizeStringEntries(values);
/**
* Canonical cross-field check for dmPolicy vs allowFrom. This is the single
* source of truth shared by the Zod schema refinements and the CLI config
* validator so the rule cannot drift between the two surfaces.
*/
const evaluateDmPolicyAllowFromDependency = (params) => {
	const allow = normalizeAllowFrom(params.allowFrom);
	if (params.policy === "open" && !allow.includes("*")) return "open_requires_wildcard";
	if (params.policy === "allowlist" && allow.length === 0) return "allowlist_requires_entries";
	return null;
};
const requireOpenAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "open_requires_wildcard") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
/**
* Validate that dmPolicy="allowlist" has a non-empty allowFrom array.
* Without this, all DMs are silently dropped because the allowlist is empty
* and no senders can match.
*/
const requireAllowlistAllowFrom = (params) => {
	if (evaluateDmPolicyAllowFromDependency({
		policy: params.policy,
		allowFrom: params.allowFrom
	}) !== "allowlist_requires_entries") return;
	params.ctx.addIssue({
		code: ZodIssueCode.custom,
		path: params.path,
		message: params.message
	});
};
const MSTeamsReplyStyleSchema = _enum(["thread", "top-level"]);
const QueueModeBySurfaceSchema = object({
	whatsapp: QueueModeSchema.optional(),
	telegram: QueueModeSchema.optional(),
	discord: QueueModeSchema.optional(),
	irc: QueueModeSchema.optional(),
	googlechat: QueueModeSchema.optional(),
	slack: QueueModeSchema.optional(),
	mattermost: QueueModeSchema.optional(),
	signal: QueueModeSchema.optional(),
	imessage: QueueModeSchema.optional(),
	msteams: QueueModeSchema.optional(),
	webchat: QueueModeSchema.optional(),
	matrix: QueueModeSchema.optional()
}).strict().optional();
const DebounceMsBySurfaceSchema = record(string(), number().int().nonnegative()).optional();
const QueueSchema = object({
	mode: QueueModeSchema.optional(),
	byChannel: QueueModeBySurfaceSchema,
	debounceMsByChannel: DebounceMsBySurfaceSchema,
	cap: number().int().positive().optional(),
	drop: QueueDropSchema.optional()
}).strict().optional();
const InboundDebounceSchema = object({
	debounceMs: number().int().nonnegative().optional(),
	byChannel: DebounceMsBySurfaceSchema
}).strict().optional();
const HexColorSchema = string().regex(/^#?[0-9a-fA-F]{6}$/, "expected hex color (RRGGBB)");
const ExecutableTokenSchema = string().refine(isSafeExecutableValue, "expected safe executable name or path");
const MediaUnderstandingScopeSchema = createAllowDenyChannelRulesSchema();
const MediaUnderstandingAttachmentsSchema = object({
	mode: union([literal("first"), literal("all")]).optional(),
	maxAttachments: number().int().positive().optional(),
	prefer: union([
		literal("first"),
		literal("last"),
		literal("path"),
		literal("url")
	]).optional()
}).strict().optional();
const MediaUnderstandingCapabilitiesSchema = array(union([
	literal("image"),
	literal("audio"),
	literal("video")
])).optional();
const ProviderOptionValueSchema = union([
	string(),
	number(),
	boolean()
]);
const ProviderOptionsSchema = record(string(), record(string(), ProviderOptionValueSchema)).optional();
const MediaUnderstandingRuntimeFields = {
	prompt: string().optional(),
	timeoutSeconds: number().int().positive().optional(),
	language: string().optional(),
	providerOptions: ProviderOptionsSchema,
	baseUrl: string().optional(),
	headers: record(string(), string()).optional(),
	request: ConfiguredProviderRequestSchema
};
const MediaUnderstandingModelSchema = object({
	provider: string().optional(),
	model: string().optional(),
	capabilities: MediaUnderstandingCapabilitiesSchema,
	type: union([literal("provider"), literal("cli")]).optional(),
	command: string().optional(),
	args: array(string()).optional(),
	maxChars: number().int().positive().optional(),
	maxBytes: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	profile: string().optional(),
	preferredProfile: string().optional()
}).strict().optional();
const ToolsMediaCapabilitySchema = object({
	enabled: boolean().optional(),
	preferredModel: string().trim().min(1).optional(),
	scope: MediaUnderstandingScopeSchema,
	maxBytes: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	attachments: MediaUnderstandingAttachmentsSchema
}).strict().optional();
const ToolsMediaAudioSchema = object({
	enabled: boolean().optional(),
	preferredModel: string().trim().min(1).optional(),
	scope: MediaUnderstandingScopeSchema,
	maxBytes: number().int().positive().optional(),
	maxChars: number().int().positive().optional(),
	...MediaUnderstandingRuntimeFields,
	attachments: MediaUnderstandingAttachmentsSchema,
	echoTranscript: boolean().optional(),
	echoFormat: string().optional()
}).strict().optional();
const ToolsMediaSchema = object({
	models: array(MediaUnderstandingModelSchema).optional(),
	concurrency: number().int().positive().optional(),
	image: ToolsMediaCapabilitySchema.optional(),
	audio: ToolsMediaAudioSchema.optional(),
	video: ToolsMediaCapabilitySchema.optional()
}).strict().optional();
const LinkModelSchema = object({
	type: literal("cli").optional(),
	command: string().min(1),
	args: array(string()).optional(),
	timeoutSeconds: number().int().positive().optional()
}).strict();
const ToolsLinksSchema = object({
	enabled: boolean().optional(),
	scope: MediaUnderstandingScopeSchema,
	maxLinks: number().int().positive().optional(),
	timeoutSeconds: number().int().positive().optional(),
	models: array(LinkModelSchema).optional()
}).strict().optional();
const NativeCommandsSettingSchema = union([boolean(), literal("auto")]);
const ProviderCommandsSchema = object({
	native: NativeCommandsSettingSchema.optional(),
	nativeSkills: NativeCommandsSettingSchema.optional()
}).strict().optional();
//#endregion
export { ToolsLinksSchema as A, requireOpenAllowFrom as B, ReplyToModeSchema as C, SecretsConfigSchema as D, SecretRefSchema as E, TtsProviderSchema as F, TypingModeSchema as I, VisibleRepliesSchema as L, TtsAutoSchema as M, TtsConfigSchema as N, SsrFPolicyConfigSchema as O, TtsModeSchema as P, evaluateDmPolicyAllowFromDependency as R, ReplyRuntimeConfigSchemaShape as S, SecretProviderSchema as T, createAllowDenyChannelRulesSchema as V, MentionPatternsPolicySchema as _, ContextVisibilityModeSchema as a, ProviderCommandsSchema as b, ExecutableTokenSchema as c, HexColorSchema as d, HumanDelaySchema as f, MarkdownConfigSchema as g, MSTeamsReplyStyleSchema as h, ChannelStreamingBlockSchema as i, ToolsMediaSchema as j, TextChunkModeSchema as k, GroupChatSchema as l, InboundDebounceSchema as m, BlockStreamingCoalesceSchema as n, DmConfigSchema as o, IdentitySchema as p, ChannelDeliveryStreamingConfigSchema as r, DmPolicySchema as s, BlockStreamingChunkSchema as t, GroupPolicySchema as u, ModelsConfigSchema as v, SecretInputSchema as w, QueueSchema as x, NativeCommandsSettingSchema as y, requireAllowlistAllowFrom as z };
