import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { D as resolveExpiresAtMsFromDurationMs } from "./number-coercion-oCkfUEEq.js";
import { t as formatCliCommand } from "./command-format-Dr_cCOb_.js";
import { t as parseDurationMs } from "./parse-duration-CuuCHKpt.js";
import { c as resolveClaudeMythos5ModelIdentity, d as resolveClaudeSonnet5ModelIdentity, f as supportsClaude1MContext, g as supportsClaudeNativeXhighEffort, h as supportsClaudeNativeMaxEffort, o as resolveClaudeFable5ModelIdentity, p as supportsClaudeAdaptiveThinking, s as resolveClaudeModelIdentity, u as resolveClaudeOpus5ModelIdentity } from "./src-88rHSicm.js";
import { n as resolveClaudeThinkingProfile } from "./provider-claude-thinking-rLTe2GOS.js";
import { n as listProfilesForProvider } from "./profile-list-C4c5_QKQ.js";
import { u as upsertAuthProfileWithLockOrThrow } from "./profiles-CaIWIvwD.js";
import { n as suggestOAuthProfileIdForLegacyDefault } from "./repair-Dslh4cqF.js";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CsfMAtQg.js";
import "./provider-auth-DqOUi0El.js";
import { n as validateAnthropicSetupToken, t as buildTokenProfileId } from "./provider-auth-token-BocDZcXC.js";
import { t as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-BvsyofUm.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as buildProviderReplayFamilyHooks, c as modelCostsEqual, p as cloneFirstTemplateModel } from "./provider-model-shared-BRD_qtgE.js";
import "./cli-runtime-CKIbx5b6.js";
import "./provider-auth-api-key-BLOlifEO.js";
import { i as buildOpenAICompatibleProviderCatalog } from "./provider-catalog-live-runtime-Ci3m6-12.js";
import { r as buildManifestModelProviderConfig } from "./provider-catalog-shared-DQtlsVxE.js";
import { n as readClaudeCliCredentialsForSetup, r as readClaudeCliCredentialsForSetupNonInteractive } from "./cli-auth-seam-CQ9L3Qpd.js";
import { i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, n as CLAUDE_CLI_BACKEND_ID, r as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF } from "./cli-constants-BoJ2vZl0.js";
import { n as CLAUDE_CLI_OFF_THINKING_PROFILE } from "./cli-shared-DNXqU_yB.js";
import { t as buildAnthropicCliBackend } from "./cli-backend-BtMAJj_D.js";
import { t as buildClaudeCliCatalogEntries } from "./cli-catalog-BVE6GXPR.js";
import { t as buildAnthropicCliMigrationResult } from "./cli-migration-D4aT-JZe.js";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "./config-defaults-DambxGNN.js";
import { t as acceptsAnthropicLiveModelContract } from "./live-model-contract-gate-CBt6QaTl.js";
import { t as anthropicMediaUnderstandingProvider } from "./media-understanding-provider-B9XmW3Ry.js";
import { n as resolveClaudeCliSyntheticAuth } from "./provider-discovery-CQ8ZEiEZ.js";
import { n as registerClaudeSessionDiscovery, t as createClaudeSessionNodeInvokePolicies } from "./session-catalog-registration-BgUXI5c-.js";
import { c as wrapAnthropicProviderStream, i as isAnthropicOAuthApiKey } from "./stream-wrappers-CdmEqUnk.js";
import { n as resolveAnthropicUsageAuth, t as fetchAnthropicUsage } from "./usage-CGkKXHLT.js";
//#region extensions/anthropic/openclaw.plugin.json
var modelCatalog = {
	"runtimeAugment": true,
	"providers": {
		"claude-cli": { "models": [
			{
				"id": "claude-opus-5",
				"name": "Claude Opus 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"maxTokens": 128e3
			},
			{
				"id": "claude-sonnet-5",
				"name": "Claude Sonnet 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"maxTokens": 128e3
			},
			{
				"id": "claude-fable-5",
				"name": "Claude Fable 5 (Claude CLI)",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 1e6,
				"maxTokens": 128e3
			},
			{
				"id": "claude-opus-4-8",
				"name": "Claude Opus 4.8 (Claude CLI)",
				"status": "deprecated",
				"replacedBy": "claude-opus-5",
				"reasoning": true,
				"input": ["text", "image"],
				"mediaInput": { "image": {
					"maxSidePx": 2576,
					"preferredSidePx": 2576,
					"tokenMode": "provider"
				} },
				"contextWindow": 2e5,
				"maxTokens": 128e3
			}
		] },
		"anthropic": {
			"baseUrl": "https://api.anthropic.com",
			"api": "anthropic-messages",
			"defaultUtilityModel": "claude-haiku-4-5",
			"models": [
				{
					"id": "claude-fable-5",
					"name": "Claude Fable 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"off": "low",
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-opus-5",
					"name": "Claude Opus 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 5,
						"output": 25,
						"cacheRead": .5,
						"cacheWrite": 6.25
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-sonnet-5",
					"name": "Claude Sonnet 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 2,
						"output": 10,
						"cacheRead": .2,
						"cacheWrite": 2.5
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-mythos-5",
					"name": "Claude Mythos 5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"cost": {
						"input": 10,
						"output": 50,
						"cacheRead": 1,
						"cacheWrite": 12.5
					},
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"thinkingLevelMap": {
						"off": "low",
						"minimal": "low",
						"xhigh": "xhigh",
						"max": "max"
					},
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-opus-4-8",
					"name": "Claude Opus 4.8",
					"status": "deprecated",
					"replacedBy": "claude-opus-5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 2576,
						"preferredSidePx": 2576,
						"tokenMode": "provider"
					} },
					"contextWindow": 1e6,
					"maxTokens": 128e3,
					"compat": { "codeMode": "preferred" }
				},
				{
					"id": "claude-haiku-4-5",
					"name": "Claude Haiku 4.5",
					"reasoning": true,
					"input": ["text", "image"],
					"mediaInput": { "image": {
						"maxSidePx": 1568,
						"preferredSidePx": 1568,
						"tokenMode": "provider"
					} },
					"contextWindow": 2e5,
					"maxTokens": 64e3,
					"compat": { "codeMode": "preferred" }
				}
			]
		}
	},
	"discovery": {
		"claude-cli": "static",
		"anthropic": "refreshable"
	}
};
//#endregion
//#region extensions/anthropic/register.runtime.ts
/**
* Anthropic provider runtime registration. It owns API-key/setup-token/Claude
* CLI auth, dynamic model normalization, usage auth, media, and stream wrappers.
*/
const PROVIDER_ID = "anthropic";
function classifyAnthropicFailoverDescriptor(value) {
	switch (value?.trim().toUpperCase()) {
		case "RATE_LIMIT_ERROR": return "rate_limit";
		case "API_ERROR": return "server_error";
		default: return;
	}
}
const DEFAULT_ANTHROPIC_MODEL = "anthropic/claude-opus-5";
const ANTHROPIC_OPUS_48_MODEL_ID = "claude-opus-4-8";
const ANTHROPIC_OPUS_48_DOT_MODEL_ID = "claude-opus-4.8";
const ANTHROPIC_OPUS_47_MODEL_ID = "claude-opus-4-7";
const ANTHROPIC_OPUS_47_DOT_MODEL_ID = "claude-opus-4.7";
const ANTHROPIC_1M_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS = 128e3;
const ANTHROPIC_OPUS_5_COST = {
	input: 5,
	output: 25,
	cacheRead: .5,
	cacheWrite: 6.25
};
const ANTHROPIC_SONNET_5_STANDARD_PRICING_START_MS = Date.UTC(2026, 8, 1);
const ANTHROPIC_SONNET_5_PROMOTIONAL_COST = {
	input: 2,
	output: 10,
	cacheRead: .2,
	cacheWrite: 2.5
};
const ANTHROPIC_SONNET_5_STANDARD_COST = {
	input: 3,
	output: 15,
	cacheRead: .3,
	cacheWrite: 3.75
};
const ANTHROPIC_OPUS_46_MODEL_ID = "claude-opus-4-6";
const ANTHROPIC_OPUS_46_DOT_MODEL_ID = "claude-opus-4.6";
const ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS = [ANTHROPIC_OPUS_46_MODEL_ID, ANTHROPIC_OPUS_46_DOT_MODEL_ID];
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
const ANTHROPIC_SETUP_TOKEN_NOTE_LINES = [
	"Anthropic setup-token auth is supported in OpenClaw.",
	"OpenClaw prefers Claude CLI reuse when it is available on the host.",
	"Anthropic staff told us this OpenClaw path is allowed again.",
	`If you want a direct API billing path instead, use ${formatCliCommand("openclaw models auth login --provider anthropic --method api-key --set-default")} or ${formatCliCommand("openclaw models auth login --provider anthropic --method cli --set-default")}.`
];
function buildAnthropicCatalogProvider() {
	return buildManifestModelProviderConfig({
		providerId: PROVIDER_ID,
		catalog: modelCatalog.providers.anthropic
	});
}
/**
* Discovery credentials arrive as either an API key or a Claude subscription
* OAuth access token. Anthropic rejects an OAuth token sent as `x-api-key`, and
* rejects the request outright when both auth headers are present, so the two
* shapes must select mutually exclusive headers.
*/
function buildAnthropicDiscoveryAuthHeaders(key) {
	if (!key) return {};
	return isAnthropicOAuthApiKey(key) ? { authorization: `Bearer ${key}` } : { "x-api-key": key };
}
/**
* Live discovery replaces the seed catalog with whatever `/v1/models` returns.
* Anthropic does not publish every model it serves, so replacement alone would
* hide shipped entries that have no live row. Re-add the manifest models the
* live response omitted; discovered rows still win on shared ids.
*/
function restoreUnpublishedAnthropicModels(result) {
	if (!result || !("provider" in result)) return result;
	const discovered = result.provider.models ?? [];
	if (discovered.length === 0) return result;
	const discoveredIds = new Set(discovered.map((model) => model.id));
	const unpublished = (buildAnthropicCatalogProvider().models ?? []).filter((model) => !discoveredIds.has(model.id));
	if (unpublished.length === 0) return result;
	return { provider: {
		...result.provider,
		models: [...discovered, ...unpublished.toSorted((a, b) => a.id.localeCompare(b.id))]
	} };
}
function resolveAnthropicSonnet5Cost(nowMs = Date.now()) {
	return nowMs >= ANTHROPIC_SONNET_5_STANDARD_PRICING_START_MS ? ANTHROPIC_SONNET_5_STANDARD_COST : ANTHROPIC_SONNET_5_PROMOTIONAL_COST;
}
const CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS = CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) => ref.startsWith(`claude-cli/`) ? `anthropic/${ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : ref);
function normalizeAnthropicSetupTokenInput(value) {
	return value.replaceAll(/\s+/g, "").trim();
}
function resolveAnthropicSetupTokenProfileId(rawProfileId) {
	if (typeof rawProfileId === "string") {
		const trimmed = rawProfileId.trim();
		if (trimmed.length > 0) {
			if (trimmed.startsWith(`${PROVIDER_ID}:`)) return trimmed;
			return buildTokenProfileId({
				provider: PROVIDER_ID,
				name: trimmed
			});
		}
	}
	return `${PROVIDER_ID}:default`;
}
function resolveAnthropicSetupTokenExpiry(rawExpiresIn) {
	if (typeof rawExpiresIn !== "string" || rawExpiresIn.trim().length === 0) return;
	return resolveExpiresAtMsFromDurationMs(parseDurationMs(rawExpiresIn.trim(), { defaultUnit: "d" }));
}
async function runAnthropicSetupTokenAuth(ctx) {
	const token = (typeof ctx.opts?.token === "string" && ctx.opts.token.trim().length > 0 ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : void 0) ?? normalizeAnthropicSetupTokenInput(await ctx.prompter.text({
		message: "Paste Anthropic setup-token",
		validate: (value) => validateAnthropicSetupToken(normalizeAnthropicSetupTokenInput(value))
	}));
	const tokenError = validateAnthropicSetupToken(token);
	if (tokenError) throw new Error(tokenError);
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts?.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts?.tokenExpiresIn);
	return {
		profiles: [{
			profileId,
			credential: {
				type: "token",
				provider: PROVIDER_ID,
				token,
				...expires ? { expires } : {}
			}
		}],
		defaultModel: DEFAULT_ANTHROPIC_MODEL,
		notes: [...ANTHROPIC_SETUP_TOKEN_NOTE_LINES]
	};
}
function validateAnthropicSetupTokenNonInteractive(ctx) {
	if (ctx.opts.secretInputMode === "ref") {
		ctx.runtime.error("Anthropic setup-token input cannot be stored with --secret-input-mode ref. Use --secret-input-mode plaintext.");
		ctx.runtime.exit(1);
		return null;
	}
	const rawToken = typeof ctx.opts.token === "string" ? normalizeAnthropicSetupTokenInput(ctx.opts.token) : "";
	const tokenError = validateAnthropicSetupToken(rawToken);
	if (tokenError) {
		ctx.runtime.error(["Anthropic setup-token auth requires --token with a valid setup-token.", tokenError].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	try {
		resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	} catch (error) {
		ctx.runtime.error(`Invalid --token-expires-in: ${error instanceof Error ? error.message : String(error)}`);
		ctx.runtime.exit(1);
		return null;
	}
	return rawToken;
}
async function runAnthropicSetupTokenNonInteractive(ctx) {
	const rawToken = validateAnthropicSetupTokenNonInteractive(ctx);
	if (!rawToken) return null;
	const profileId = resolveAnthropicSetupTokenProfileId(ctx.opts.tokenProfileId);
	const expires = resolveAnthropicSetupTokenExpiry(ctx.opts.tokenExpiresIn);
	await upsertAuthProfileWithLockOrThrow({
		profileId,
		credential: {
			type: "token",
			provider: PROVIDER_ID,
			token: rawToken,
			...expires ? { expires } : {}
		},
		agentDir: ctx.agentDir
	});
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[0]);
	ctx.runtime.log(ANTHROPIC_SETUP_TOKEN_NOTE_LINES[1]);
	const withProfile = applyAuthProfileConfig(ctx.config, {
		profileId,
		provider: PROVIDER_ID,
		mode: "token"
	});
	const existingModelConfig = withProfile.agents?.defaults?.model && typeof withProfile.agents.defaults.model === "object" ? withProfile.agents.defaults.model : {};
	return {
		...withProfile,
		agents: {
			...withProfile.agents,
			defaults: {
				...withProfile.agents?.defaults,
				model: {
					...existingModelConfig,
					primary: DEFAULT_ANTHROPIC_MODEL
				}
			}
		}
	};
}
function resolveAnthropic46ForwardCompatModel(params) {
	const trimmedModelId = params.ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	if (trimmedModelId !== lower) return;
	if (!(lower === params.dashModelId || lower === params.dotModelId || lower.startsWith(`${params.dashModelId}-`) || lower.startsWith(`${params.dotModelId}-`))) return;
	const templateIds = [];
	if (lower.startsWith(params.dashModelId)) templateIds.push(lower.replace(params.dashModelId, params.dashTemplateId));
	if (lower.startsWith(params.dotModelId)) templateIds.push(lower.replace(params.dotModelId, params.dotTemplateId));
	templateIds.push(...params.fallbackTemplateIds);
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds,
		ctx: params.ctx,
		patch: normalizeLowercaseStringOrEmpty(params.ctx.provider) === "claude-cli" ? { provider: CLAUDE_CLI_BACKEND_ID } : void 0
	});
}
function resolveAnthropicSnapshotModel(ctx) {
	const modelId = ctx.modelId.trim();
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const match = /^(claude-[a-z0-9]+(?:-[a-z0-9]+)*)-\d{8}$/.exec(normalizedModelId);
	if (modelId !== normalizedModelId || normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID || !match) return;
	const templateId = match[1];
	const captured = cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId,
		templateIds: [templateId],
		ctx
	});
	if (captured) return captured;
	const template = resolveAnthropicManifestModel(templateId);
	return template ? {
		...template,
		id: modelId,
		name: modelId
	} : void 0;
}
/** Newest Claude generation whose request contract this plugin encodes. */
const ANTHROPIC_NEWEST_KNOWN_GENERATION = {
	major: 5,
	minor: 0
};
/**
* Read the generation from either Claude id order: `claude-<family>-<major>[-<minor>]`
* (4.6 onward) and `claude-<major>[-<minor>]-<family>` (through 3.7). The minor
* capture is bounded to two digits so a trailing snapshot date such as
* `claude-opus-4-20250514` does not parse as a minor version.
*/
function resolveAnthropicModelGeneration(modelId) {
	const match = /claude-[a-z]+-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId) ?? /claude-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId);
	if (!match) return;
	return {
		major: Number(match[1]),
		minor: match[2] === void 0 ? 0 : Number(match[2])
	};
}
/**
* Claude ids from a generation newer than anything this plugin encodes. Request
* shaping is selected by version predicates in `@openclaw/llm-core`, so such an
* id would otherwise fall through to pre-4.6 shaping — manual `budget_tokens`
* plus caller sampling params — which current models reject outright.
*/
function isAnthropicUnreleasedGenerationModel(modelId) {
	if (matchesAnthropicModernModel(modelId)) return false;
	const generation = resolveAnthropicModelGeneration(modelId);
	if (!generation) return false;
	return generation.major > ANTHROPIC_NEWEST_KNOWN_GENERATION.major || generation.major === ANTHROPIC_NEWEST_KNOWN_GENERATION.major && generation.minor > ANTHROPIC_NEWEST_KNOWN_GENERATION.minor;
}
/**
* Route an unreleased id onto the newest contract we encode, matching family
* when we recognize it. Stamping `canonicalModelId` is the same seam Bedrock and
* Mantle use to map a provider-native id onto a canonical Claude contract, so
* shaping follows without teaching the shared contracts about unknown ids.
*/
function resolveAnthropicUnreleasedCanonicalModelId(modelId) {
	return /(?:^|-)claude-sonnet-/.test(modelId) ? "claude-sonnet-5" : "claude-opus-5";
}
let anthropicManifestModelIndex;
function resolveAnthropicManifestModel(modelId) {
	if (!anthropicManifestModelIndex) {
		anthropicManifestModelIndex = /* @__PURE__ */ new Map();
		const catalog = buildAnthropicCatalogProvider();
		for (const model of catalog.models ?? []) {
			const api = model.api ?? catalog.api;
			const baseUrl = model.baseUrl ?? catalog.baseUrl;
			if (api && baseUrl) anthropicManifestModelIndex.set(model.id, {
				...model,
				input: model.input.filter((item) => item === "text" || item === "image"),
				provider: PROVIDER_ID,
				api,
				baseUrl
			});
		}
	}
	return anthropicManifestModelIndex.get(modelId);
}
function resolveAnthropicManifestCompat(provider, modelId) {
	return normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID ? resolveAnthropicManifestModel(modelId)?.compat : void 0;
}
function buildAnthropicForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const normalizedProvider = normalizeLowercaseStringOrEmpty(ctx.provider);
	const unreleasedGeneration = isAnthropicUnreleasedGenerationModel(lower);
	if (trimmedModelId !== lower || !(matchesAnthropicModernModel(lower) || unreleasedGeneration)) return;
	if (isAnthropicMandatoryClaude5Model(lower) && normalizedProvider !== PROVIDER_ID) return;
	const provider = normalizedProvider === "claude-cli" ? CLAUDE_CLI_BACKEND_ID : PROVIDER_ID;
	const compat = ctx.modelRegistry.find(provider, trimmedModelId)?.compat ?? resolveAnthropicManifestCompat(provider, trimmedModelId);
	return {
		id: trimmedModelId,
		name: trimmedModelId,
		provider,
		...compat ? { compat } : {},
		api: "anthropic-messages",
		baseUrl: "https://api.anthropic.com",
		reasoning: true,
		input: ["text", "image"],
		cost: isAnthropicMandatoryClaude5Model(trimmedModelId) ? {
			input: 10,
			output: 50,
			cacheRead: 1,
			cacheWrite: 12.5
		} : isAnthropicOpus5Model(trimmedModelId) && provider === PROVIDER_ID ? ANTHROPIC_OPUS_5_COST : isAnthropicSonnet5Model(trimmedModelId) && provider === PROVIDER_ID ? resolveAnthropicSonnet5Cost() : {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: resolveAnthropicFixedContextWindow(provider, trimmedModelId) ?? 2e5,
		maxTokens: isAnthropic128kOutputModel(trimmedModelId) ? ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS : 64e3,
		...unreleasedGeneration ? { params: { canonicalModelId: resolveAnthropicUnreleasedCanonicalModelId(lower) } } : {},
		...supportsClaudeNativeXhighEffort({ id: trimmedModelId }) ? { thinkingLevelMap: {
			...isAnthropicMandatoryClaude5Model(trimmedModelId) ? {
				off: "low",
				minimal: "low"
			} : {},
			xhigh: "xhigh",
			max: "max"
		} } : supportsAnthropicNativeMaxEffort(trimmedModelId) ? { thinkingLevelMap: { max: "max" } } : {}
	};
}
function resolveAnthropicForwardCompatModel(ctx) {
	return resolveAnthropicSnapshotModel(ctx) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_48_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_48_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotModelId: ANTHROPIC_SONNET_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		fallbackTemplateIds: [ANTHROPIC_SONNET_46_MODEL_ID, ANTHROPIC_SONNET_46_DOT_MODEL_ID]
	}) ?? buildAnthropicForwardCompatModel(ctx);
}
function isAnthropicGa1MModel(modelId) {
	return supportsClaude1MContext({ id: modelId });
}
function isAnthropicFable5Model(modelId) {
	return resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicMythos5Model(modelId) {
	return resolveClaudeMythos5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicMandatoryClaude5Model(modelId) {
	return isAnthropicFable5Model(modelId) || isAnthropicMythos5Model(modelId);
}
function isAnthropicSonnet5Model(modelId) {
	return resolveClaudeSonnet5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicOpus5Model(modelId) {
	return resolveClaudeOpus5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicExact1MClaude5Model(modelId) {
	return isAnthropicMandatoryClaude5Model(modelId) || isAnthropicSonnet5Model(modelId) || isAnthropicOpus5Model(modelId);
}
function resolveAnthropicFixedContextWindow(provider, modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || isAnthropicGa1MModel(modelId) && (normalizeLowercaseStringOrEmpty(provider) !== "claude-cli" || normalizeLowercaseStringOrEmpty(modelId).endsWith("[1m]")) ? ANTHROPIC_1M_CONTEXT_TOKENS : void 0;
}
function isAnthropic128kOutputModel(modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || isAnthropicGa1MModel(modelId);
}
function isAnthropicLargeImageModel(modelId) {
	return supportsClaudeNativeXhighEffort({ id: modelId });
}
function isAnthropicMythosPreviewModel(modelId) {
	return /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity({ id: modelId }));
}
function supportsAnthropicNativeMaxEffort(modelId) {
	return supportsClaudeNativeMaxEffort({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasConfiguredModelOverride(config, provider, modelId, override) {
	const providers = config?.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== normalizedProvider) continue;
		if (!Array.isArray(providerConfig?.models)) continue;
		for (const model of providerConfig.models) {
			if (normalizeLowercaseStringOrEmpty(typeof model?.id === "string" ? model.id : "") !== normalizedModelId) continue;
			if (override === "cost" ? model?.cost !== void 0 : typeof model?.contextTokens === "number" && model.contextTokens > 0 || typeof model?.contextWindow === "number" && model.contextWindow > 0) return true;
		}
	}
	return false;
}
function applyAnthropicFixedContextWindow(params) {
	const fixedContextWindow = resolveAnthropicFixedContextWindow(params.provider, params.contractModelId);
	if (fixedContextWindow === void 0) return;
	if (hasConfiguredModelOverride(params.config, params.provider, params.modelId, "context")) return;
	const exactContextWindow = isAnthropicExact1MClaude5Model(params.contractModelId);
	const nextContextWindow = exactContextWindow ? fixedContextWindow : Math.max(params.model.contextWindow ?? 0, fixedContextWindow);
	const nextContextTokens = exactContextWindow ? fixedContextWindow : typeof params.model.contextTokens === "number" ? Math.max(params.model.contextTokens, fixedContextWindow) : fixedContextWindow;
	if (nextContextWindow === params.model.contextWindow && nextContextTokens === params.model.contextTokens) return;
	return {
		...params.model,
		contextWindow: nextContextWindow,
		contextTokens: nextContextTokens
	};
}
function applyAnthropicModernMaxTokens(params) {
	if (!isAnthropic128kOutputModel(params.modelId)) return;
	if ((params.model.maxTokens ?? 0) >= ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS) return;
	return {
		...params.model,
		maxTokens: ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS
	};
}
function applyAnthropicThinkingLevelMap(params) {
	const mandatoryClaude5 = isAnthropicMandatoryClaude5Model(params.modelId);
	const nativeXhigh = mandatoryClaude5 || supportsClaudeNativeXhighEffort({ id: params.modelId });
	if (!supportsAnthropicNativeMaxEffort(params.modelId)) return;
	const current = params.model.thinkingLevelMap;
	const nativeDefaults = isAnthropicMythosPreviewModel(params.modelId) ? { max: "max" } : {
		...mandatoryClaude5 ? {
			off: "low",
			minimal: "low"
		} : {},
		xhigh: nativeXhigh ? "xhigh" : null,
		max: "max"
	};
	const currentEfforts = current;
	if (Object.keys(nativeDefaults).every((level) => currentEfforts?.[level] !== void 0)) return;
	return {
		...params.model,
		thinkingLevelMap: {
			...nativeDefaults,
			...current
		}
	};
}
function matchesAnthropicModernModel(modelId) {
	return supportsClaudeAdaptiveThinking({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasImageInput(input) {
	return Array.isArray(input) && input.includes("image");
}
function supportsAnthropicImageInput(modelId, modelName) {
	return [modelId, modelName].filter((value) => typeof value === "string").some((candidate) => matchesAnthropicModernModel(candidate));
}
function resolveAnthropicImageMediaInput(modelId, modelName) {
	if (!supportsAnthropicImageInput(modelId, modelName)) return;
	const largeImageModel = [modelId, modelName].filter((value) => typeof value === "string").some((ref) => isAnthropicLargeImageModel(ref));
	return { image: {
		maxSidePx: largeImageModel ? 2576 : 1568,
		preferredSidePx: largeImageModel ? 2576 : 1568,
		tokenMode: "provider"
	} };
}
function applyAnthropicImageInputCapability(params) {
	if (hasImageInput(params.model.input)) return;
	if (!supportsAnthropicImageInput(params.modelId, params.model.name)) return;
	return {
		...params.model,
		input: ["text", "image"]
	};
}
function applyAnthropicOpus5Cost(params) {
	if (!isAnthropicOpus5Model(params.modelId)) return;
	if (modelCostsEqual(params.model.cost, ANTHROPIC_OPUS_5_COST)) return;
	return {
		...params.model,
		cost: ANTHROPIC_OPUS_5_COST
	};
}
function applyAnthropicSonnet5Cost(params) {
	if (!isAnthropicSonnet5Model(params.modelId)) return;
	const cost = resolveAnthropicSonnet5Cost();
	if (modelCostsEqual(params.model.cost, cost)) return;
	return {
		...params.model,
		cost
	};
}
function normalizeAnthropicResolvedModel(ctx) {
	const contractModelId = resolveClaudeModelIdentity({
		id: ctx.modelId,
		params: ctx.model.params
	});
	if (isAnthropicMandatoryClaude5Model(contractModelId) && normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID) return;
	const contractModel = isAnthropicExact1MClaude5Model(contractModelId) && !ctx.model.reasoning ? {
		...ctx.model,
		reasoning: true
	} : ctx.model;
	const imageCapableModel = applyAnthropicImageInputCapability({
		modelId: contractModelId,
		model: contractModel
	}) ?? contractModel;
	const mediaInput = resolveAnthropicImageMediaInput(contractModelId, imageCapableModel.name);
	const mediaInputModel = mediaInput ? {
		...imageCapableModel,
		mediaInput: {
			...mediaInput,
			...imageCapableModel.mediaInput,
			image: {
				...mediaInput.image,
				...imageCapableModel.mediaInput?.image
			}
		}
	} : imageCapableModel;
	const outputModel = applyAnthropicModernMaxTokens({
		modelId: contractModelId,
		model: mediaInputModel
	}) ?? mediaInputModel;
	const thinkingLevelModel = applyAnthropicThinkingLevelMap({
		modelId: contractModelId,
		model: outputModel
	}) ?? outputModel;
	const contextWindowModel = applyAnthropicFixedContextWindow({
		config: ctx.config,
		provider: ctx.provider,
		modelId: ctx.modelId,
		contractModelId,
		model: thinkingLevelModel
	}) ?? thinkingLevelModel;
	const pricingModel = normalizeLowercaseStringOrEmpty(ctx.provider) === PROVIDER_ID && !hasConfiguredModelOverride(ctx.config, ctx.provider, ctx.modelId, "cost") ? applyAnthropicOpus5Cost({
		modelId: contractModelId,
		model: contextWindowModel
	}) ?? applyAnthropicSonnet5Cost({
		modelId: contractModelId,
		model: contextWindowModel
	}) ?? contextWindowModel : contextWindowModel;
	return pricingModel === ctx.model ? void 0 : pricingModel;
}
function buildAnthropicAuthDoctorHint(params) {
	const legacyProfileId = params.profileId ?? "anthropic:default";
	const suggested = suggestOAuthProfileIdForLegacyDefault({
		cfg: params.config,
		store: params.store,
		provider: PROVIDER_ID,
		legacyProfileId
	});
	if (!suggested || suggested === legacyProfileId) return "";
	const storeOauthProfiles = listProfilesForProvider(params.store, PROVIDER_ID).filter((id) => params.store.profiles[id]?.type === "oauth").join(", ");
	const cfgMode = params.config?.auth?.profiles?.[legacyProfileId]?.mode;
	const cfgProvider = params.config?.auth?.profiles?.[legacyProfileId]?.provider;
	return [
		"Doctor hint (for GitHub issue):",
		`- provider: ${PROVIDER_ID}`,
		`- config: ${legacyProfileId}${cfgProvider || cfgMode ? ` (provider=${cfgProvider ?? "?"}, mode=${cfgMode ?? "?"})` : ""}`,
		`- auth store oauth profiles: ${storeOauthProfiles || "(none)"}`,
		`- suggested profile: ${suggested}`,
		`Fix: run "${formatCliCommand("openclaw doctor --yes")}"`
	].join("\n");
}
async function runAnthropicCliMigration(ctx) {
	const credential = readClaudeCliCredentialsForSetup();
	if (!credential) throw new Error(["Claude CLI is not authenticated on this host.", `Run ${formatCliCommand("claude auth login")} first, then re-run this setup.`].join("\n"));
	return buildAnthropicCliMigrationResult(ctx.config, credential);
}
async function runAnthropicCliMigrationNonInteractive(ctx) {
	const credentialResult = readClaudeCliCredentialsForSetupNonInteractive();
	if (credentialResult.status !== "available") {
		const error = credentialResult.status === "unreadable" ? ["Auth choice \"anthropic-cli\" found Claude CLI credentials on this host, but they could not be read non-interactively.", "Re-run this command without --non-interactive, or use --auth-choice setup-token / --anthropic-api-key <key>."] : ["Auth choice \"anthropic-cli\" requires Claude CLI auth on this host.", `Run ${formatCliCommand("claude auth login")} first.`];
		ctx.runtime.error(error.join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const result = buildAnthropicCliMigrationResult(ctx.config, credentialResult.credential);
	const currentDefaults = ctx.config.agents?.defaults;
	const currentModel = currentDefaults?.model;
	const currentFallbacks = currentModel && typeof currentModel === "object" && "fallbacks" in currentModel ? currentModel.fallbacks : void 0;
	const migratedModel = result.configPatch?.agents?.defaults?.model;
	const migratedFallbacks = migratedModel && typeof migratedModel === "object" && "fallbacks" in migratedModel ? migratedModel.fallbacks : void 0;
	const nextFallbacks = Array.isArray(migratedFallbacks) ? migratedFallbacks : currentFallbacks;
	return {
		...ctx.config,
		...result.configPatch,
		agents: {
			...ctx.config.agents,
			...result.configPatch?.agents,
			defaults: {
				...currentDefaults,
				...result.configPatch?.agents?.defaults,
				model: {
					...Array.isArray(nextFallbacks) ? { fallbacks: nextFallbacks } : {},
					primary: result.defaultModel
				}
			}
		}
	};
}
/** Build the full Anthropic provider descriptor used by runtime registration. */
function buildAnthropicProvider() {
	const providerId = "anthropic";
	const defaultAnthropicModel = DEFAULT_ANTHROPIC_MODEL;
	return {
		id: providerId,
		label: "Anthropic",
		docsPath: "/providers/models",
		hookAliases: [CLAUDE_CLI_BACKEND_ID],
		envVars: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
		oauthProfileIdRepairs: [{
			legacyProfileId: "anthropic:default",
			promptLabel: "Anthropic"
		}],
		auth: [
			{
				id: "cli",
				label: "Claude CLI",
				hint: "Keep using a local Claude CLI login and run Anthropic models through the Claude CLI runtime",
				kind: "custom",
				wizard: {
					choiceId: "anthropic-cli",
					choiceLabel: "Anthropic Claude CLI",
					choiceHint: "Keep using an existing Claude Code CLI login on this host",
					assistantPriority: -20,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key",
					modelAllowlist: {
						allowedKeys: [...CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS],
						initialSelections: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
						message: "Claude CLI models"
					}
				},
				run: async (ctx) => await runAnthropicCliMigration(ctx),
				runNonInteractive: async (ctx) => await runAnthropicCliMigrationNonInteractive({
					config: ctx.config,
					runtime: ctx.runtime,
					agentDir: ctx.agentDir
				})
			},
			{
				id: "setup-token",
				label: "Anthropic setup-token",
				hint: "Paste a long-lived token created with 'claude setup-token'",
				kind: "token",
				wizard: {
					choiceId: "setup-token",
					choiceLabel: "Anthropic setup-token",
					choiceHint: "Token created by running 'claude setup-token' in your terminal",
					assistantPriority: 40,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key + token"
				},
				run: async (ctx) => await runAnthropicSetupTokenAuth(ctx),
				validateNonInteractive: async (ctx) => Boolean(validateAnthropicSetupTokenNonInteractive(ctx)),
				runNonInteractive: async (ctx) => await runAnthropicSetupTokenNonInteractive(ctx)
			},
			createProviderApiKeyAuthMethod({
				providerId,
				methodId: "api-key",
				label: "Anthropic API key",
				hint: "Direct Anthropic API key",
				optionKey: "anthropicApiKey",
				flagName: "--anthropic-api-key",
				envVar: "ANTHROPIC_API_KEY",
				promptMessage: "Enter Anthropic API key",
				defaultModel: defaultAnthropicModel,
				expectedProviders: ["anthropic"],
				wizard: {
					choiceId: "apiKey",
					choiceLabel: "Anthropic API key",
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key"
				}
			})
		],
		catalog: {
			order: "simple",
			run: async (ctx) => restoreUnpublishedAnthropicModels(await buildOpenAICompatibleProviderCatalog({
				ctx,
				providerId,
				buildProvider: buildAnthropicCatalogProvider,
				modelDiscovery: {
					endpointPath: "v1/models",
					buildRequestHeaders: ({ apiKey, discoveryApiKey }) => ({
						"anthropic-version": "2023-06-01",
						...buildAnthropicDiscoveryAuthHeaders(discoveryApiKey ?? apiKey)
					}),
					acceptUnknownModel: acceptsAnthropicLiveModelContract
				}
			}))
		},
		staticCatalog: {
			order: "simple",
			run: async () => ({ provider: buildAnthropicCatalogProvider() })
		},
		normalizeConfig: ({ provider, providerConfig }) => normalizeAnthropicProviderConfigForProvider({
			provider,
			providerConfig
		}),
		applyConfigDefaults: ({ config, env }) => applyAnthropicConfigDefaults({
			config,
			env
		}),
		resolveDynamicModel: (ctx) => {
			const model = resolveAnthropicForwardCompatModel(ctx);
			if (!model) return;
			return normalizeAnthropicResolvedModel({
				config: ctx.config,
				provider: ctx.provider,
				modelId: ctx.modelId,
				model
			}) ?? model;
		},
		normalizeResolvedModel: (ctx) => normalizeAnthropicResolvedModel(ctx),
		resolveSyntheticAuth: ({ provider }) => normalizeLowercaseStringOrEmpty(provider) === "claude-cli" ? resolveClaudeCliSyntheticAuth() : void 0,
		augmentModelCatalog: () => buildClaudeCliCatalogEntries(),
		...buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" }),
		isModernModelRef: ({ provider, modelId }) => matchesAnthropicModernModel(modelId) && (!isAnthropicMandatoryClaude5Model(modelId) || normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID),
		resolveReasoningOutputMode: () => "native",
		classifyFailoverReason: ({ code, errorType }) => classifyAnthropicFailoverDescriptor(errorType) ?? classifyAnthropicFailoverDescriptor(code),
		resolveThinkingProfile: ({ provider, modelId, params }) => {
			const contractModelId = resolveClaudeModelIdentity({
				id: modelId,
				params
			});
			return isAnthropicMythos5Model(contractModelId) && normalizeLowercaseStringOrEmpty(provider) !== PROVIDER_ID ? CLAUDE_CLI_OFF_THINKING_PROFILE : resolveClaudeThinkingProfile(contractModelId, void 0, { includeNativeMax: [PROVIDER_ID, CLAUDE_CLI_BACKEND_ID].includes(normalizeLowercaseStringOrEmpty(provider)) });
		},
		wrapStreamFn: wrapAnthropicProviderStream,
		resolveUsageAuth: resolveAnthropicUsageAuth,
		fetchUsageSnapshot: fetchAnthropicUsage,
		isCacheTtlEligible: () => true,
		buildAuthDoctorHint: (ctx) => buildAnthropicAuthDoctorHint({
			config: ctx.config,
			store: ctx.store,
			profileId: ctx.profileId
		})
	};
}
/** Register Anthropic provider, Claude CLI backend, and media understanding provider. */
function registerAnthropicPlugin(api) {
	api.registerCliBackend(buildAnthropicCliBackend());
	api.registerProvider(buildAnthropicProvider());
	api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
	registerClaudeSessionDiscovery(api);
	for (const policy of createClaudeSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
}
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
