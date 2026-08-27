import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { r as normalizeProviderId$1 } from "./provider-id-DMd-TDFp.js";
import { n as normalizeGooglePreviewModelId$1, t as normalizeAntigravityPreviewModelId$1 } from "./provider-model-id-normalize-DODOj1rv.js";
import "./defaults-CdX9UGcX.js";
import "./model-selection-normalize-DRjRnS6Y.js";
import "./provider-attribution-CNkOWY2x.js";
import "./gpt5-prompt-overlay-1wvhhu5B.js";
import "./src-5i09w5fd.js";
import { i as normalizeModelCompat } from "./provider-model-compat-C4PXDgtP.js";
import "./provider-claude-thinking-CBFvK_PW.js";
import { a as buildOpenAICompatibleReplayPolicy, c as resolveTaggedReasoningOutputMode, i as buildNativeAnthropicReplayPolicyForModel, l as sanitizeGoogleGeminiReplayHistory, n as buildGoogleGeminiReplayPolicy, o as buildPassthroughGeminiSanitizingReplayPolicy, r as buildHybridAnthropicOrOpenAIReplayPolicy, t as buildAnthropicReplayPolicyForModel } from "./provider-replay-helpers-By8YdHBX.js";
import "./moonshot-thinking-C8-sxJN0.js";
import { t as definePluginEntry } from "./plugin-entry-BIDZMa3K.js";
//#region src/plugins/provider-model-helpers.ts
/** True when an id matches a normalized exact value or value prefix. */
function matchesExactOrPrefix(id, values) {
	const normalizedId = normalizeLowercaseStringOrEmpty(id);
	return values.some((value) => {
		const normalizedValue = normalizeLowercaseStringOrEmpty(value);
		return normalizedId === normalizedValue || normalizedId.startsWith(normalizedValue);
	});
}
/** Clones the first available template model and patches it for a dynamic model id. */
function cloneFirstTemplateModel(params) {
	return resolveFamilyForwardCompatModel({
		providerId: params.providerId,
		modelId: params.modelId,
		ctx: params.ctx,
		cases: [{
			match: () => true,
			templateIds: params.templateIds
		}],
		patch: params.patch
	});
}
function resolveFamilyForwardCompatModel(params) {
	const modelId = (params.modelId ?? params.ctx.modelId).trim();
	const normalizedModelId = params.normalizedModelId ?? normalizeLowercaseStringOrEmpty(modelId);
	const family = params.cases.find((candidate) => typeof candidate.match === "function" ? candidate.match(normalizedModelId) : candidate.match.includes(normalizedModelId));
	if (!family) return;
	const existing = params.preserveExisting ? params.ctx.modelRegistry.find(params.providerId, modelId) : null;
	if (existing) return existing;
	const context = {
		modelId,
		normalizedModelId,
		providerId: params.providerId
	};
	const resolvePatch = (template) => {
		const patchContext = {
			...context,
			template
		};
		const familyPatch = typeof family.patch === "function" ? family.patch(patchContext) : family.patch;
		return {
			...params.patch,
			...familyPatch
		};
	};
	const templateSources = family.templateSources ?? [{ templateIds: family.templateIds ?? [] }];
	for (const source of templateSources) for (const templateId of uniqueStrings(source.templateIds).filter(Boolean)) {
		const template = params.ctx.modelRegistry.find(source.providerId ?? params.providerId, templateId);
		if (template) return normalizeModelCompat({
			...template,
			id: modelId,
			name: modelId,
			...resolvePatch(template)
		});
	}
	if (!params.synthesize) return;
	const patch = resolvePatch();
	return normalizeModelCompat({
		id: modelId,
		name: modelId,
		...patch,
		cost: patch?.cost ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: patch?.contextWindow ?? 2e5,
		maxTokens: patch?.maxTokens ?? 2e5
	});
}
//#endregion
//#region src/plugin-sdk/provider-model-shared.ts
/** Defines the canonical setup, discovery, and wizard flow for one self-hosted OpenAI endpoint. */
function defineSelfHostedOpenAICompatibleProvider(options) {
	const loadProviderSetup = async () => await import("./plugin-sdk/provider-setup.js");
	return definePluginEntry({
		id: options.id,
		name: `${options.label} Provider`,
		description: `Bundled ${options.label} provider plugin`,
		register(api) {
			api.registerProvider({
				...options.overrides,
				id: options.id,
				label: options.label,
				docsPath: `/providers/${options.id}`,
				envVars: [options.apiKeyEnvVar],
				auth: [{
					id: "custom",
					label: options.label,
					hint: options.hint,
					kind: "custom",
					run: async (ctx) => {
						return await (await loadProviderSetup()).promptAndConfigureOpenAICompatibleSelfHostedProviderAuth({
							cfg: ctx.config,
							prompter: ctx.prompter,
							providerId: options.id,
							providerLabel: options.label,
							defaultBaseUrl: options.defaultBaseUrl,
							defaultApiKeyEnvVar: options.apiKeyEnvVar,
							modelPlaceholder: options.modelPlaceholder
						});
					},
					runNonInteractive: async (ctx) => {
						return await (await loadProviderSetup()).configureOpenAICompatibleSelfHostedProviderNonInteractive({
							ctx,
							providerId: options.id,
							providerLabel: options.label,
							defaultBaseUrl: options.defaultBaseUrl,
							defaultApiKeyEnvVar: options.apiKeyEnvVar,
							modelPlaceholder: options.modelPlaceholder
						});
					}
				}],
				catalog: {
					order: "late",
					run: async (ctx) => {
						const setup = await loadProviderSetup();
						return await setup.discoverOpenAICompatibleSelfHostedProvider({
							ctx,
							providerId: options.id,
							buildProvider: async (params) => {
								const baseUrl = (params?.baseUrl?.trim() || options.defaultBaseUrl).replace(/\/+$/, "");
								return {
									baseUrl,
									api: "openai-completions",
									models: await setup.discoverOpenAICompatibleLocalModels({
										baseUrl,
										apiKey: params?.apiKey,
										label: options.label,
										discoverRuntimeContext: false
									})
								};
							}
						});
					}
				},
				wizard: {
					setup: {
						choiceId: options.id,
						choiceLabel: options.label,
						choiceHint: options.hint,
						groupId: options.id,
						groupLabel: options.label,
						groupHint: options.groupHint,
						methodId: "custom"
					},
					modelPicker: {
						label: `${options.label} (custom)`,
						hint: `Enter ${options.label} URL + API key + model`,
						methodId: "custom"
					}
				}
			});
		}
	});
}
/**
* Normalizes provider ids for config, catalog, and plugin-registry matching.
*/
function normalizeProviderId(provider) {
	return normalizeProviderId$1(provider);
}
/** Compare canonical flat rates without assuming display-only models include cost metadata. */
function modelCostsEqual(current, expected) {
	return current?.input === expected.input && current?.output === expected.output && current?.cacheRead === expected.cacheRead && current?.cacheWrite === expected.cacheWrite;
}
const LOCAL_MODEL_FAMILY_PREFERENCES = [
	/gemma[-_.]?4(?!\d)/,
	/qwen[-_.]?3[._]5(?!\d)/,
	/qwen[-_.]?3(?!\d)/,
	/gpt[-_.]?oss/,
	/gemma[-_.]?3(?!\d)/,
	/llama[-_.]?4(?!\d)/,
	/llama[-_.]?3(?!\d)/,
	/phi[-_.]?4(?!\d)/,
	/mistral/,
	/deepseek/
];
const LOCAL_MODEL_SPECIALIST_PATTERN = /embed|rerank|whisper|-vl\b|vision|omni|guard/;
/**
* Setup-assistant preference for agentic tool-calling quality in current BFCL-class results.
* Heuristic contract; safe to retune as local model families improve.
*/
function selectPreferredLocalModelId(modelIds) {
	const familyCount = LOCAL_MODEL_FAMILY_PREFERENCES.length;
	let preferred;
	let preferredRank = Number.POSITIVE_INFINITY;
	for (const rawId of modelIds) {
		const id = rawId.trim();
		if (!id) continue;
		const normalized = id.toLowerCase();
		const familyRank = LOCAL_MODEL_FAMILY_PREFERENCES.findIndex((pattern) => pattern.test(normalized));
		const rank = LOCAL_MODEL_SPECIALIST_PATTERN.test(normalized) ? familyCount * 3 : familyRank >= 0 ? familyRank + (normalized.includes("coder") ? familyCount : 0) : familyCount * 2 + (normalized.includes("coder") ? 1 : 0);
		if (rank < preferredRank) {
			preferred = id;
			preferredRank = rank;
		}
	}
	return preferred;
}
function getModelProviderHint(modelId) {
	const trimmed = normalizeOptionalLowercaseString(modelId);
	if (!trimmed) return null;
	const slashIndex = trimmed.indexOf("/");
	if (slashIndex <= 0) return null;
	return trimmed.slice(0, slashIndex) || null;
}
/** @deprecated Proxy provider-owned model helper; do not use from third-party plugins. */
function isProxyReasoningUnsupportedModelHint(modelId) {
	return getModelProviderHint(modelId) === "x-ai";
}
/**
* Normalizes Antigravity preview model ids to the canonical provider catalog form.
*/
function normalizeAntigravityPreviewModelId(id) {
	return normalizeAntigravityPreviewModelId$1(id);
}
/**
* Normalizes Google preview model ids to the canonical provider catalog form.
*/
function normalizeGooglePreviewModelId(id) {
	return normalizeGooglePreviewModelId$1(id);
}
/**
* Builds provider replay hooks for a known transcript/reasoning compatibility family.
*/
function buildProviderReplayFamilyHooks(options) {
	switch (options.family) {
		case "openai-compatible": {
			const policyOptions = {
				sanitizeToolCallIds: options.sanitizeToolCallIds,
				duplicateToolCallIdStyle: options.duplicateToolCallIdStyle,
				dropReasoningFromHistory: options.dropReasoningFromHistory
			};
			return { buildReplayPolicy: (ctx) => buildOpenAICompatibleReplayPolicy(ctx.modelApi, {
				...policyOptions,
				modelId: ctx.modelId
			}) };
		}
		case "anthropic-by-model": return { buildReplayPolicy: ({ modelId, model }) => buildAnthropicReplayPolicyForModel(modelId, model) };
		case "native-anthropic-by-model": return { buildReplayPolicy: ({ modelId, model }) => buildNativeAnthropicReplayPolicyForModel(modelId, model) };
		case "google-gemini": return {
			buildReplayPolicy: () => buildGoogleGeminiReplayPolicy(),
			sanitizeReplayHistory: (ctx) => sanitizeGoogleGeminiReplayHistory(ctx),
			resolveReasoningOutputMode: (_ctx) => resolveTaggedReasoningOutputMode()
		};
		case "passthrough-gemini": return { buildReplayPolicy: ({ modelId }) => buildPassthroughGeminiSanitizingReplayPolicy(modelId) };
		case "hybrid-anthropic-openai": return { buildReplayPolicy: (ctx) => buildHybridAnthropicOrOpenAIReplayPolicy(ctx, { anthropicModelDropThinkingBlocks: options.anthropicModelDropThinkingBlocks }) };
	}
	throw new Error("Unsupported provider replay family");
}
/** @deprecated Provider-owned replay hook shortcut; use local provider hooks instead. */
const OPENAI_COMPATIBLE_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "openai-compatible" });
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
const ANTHROPIC_BY_MODEL_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "anthropic-by-model" });
/** @deprecated Anthropic provider-owned replay hook shortcut; use local provider hooks instead. */
const NATIVE_ANTHROPIC_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" });
/** @deprecated Google provider-owned replay hook shortcut; use local provider hooks instead. */
const PASSTHROUGH_GEMINI_REPLAY_HOOKS = buildProviderReplayFamilyHooks({ family: "passthrough-gemini" });
//#endregion
export { buildProviderReplayFamilyHooks as a, modelCostsEqual as c, normalizeProviderId as d, selectPreferredLocalModelId as f, resolveFamilyForwardCompatModel as h, PASSTHROUGH_GEMINI_REPLAY_HOOKS as i, normalizeAntigravityPreviewModelId as l, matchesExactOrPrefix as m, NATIVE_ANTHROPIC_REPLAY_HOOKS as n, defineSelfHostedOpenAICompatibleProvider as o, cloneFirstTemplateModel as p, OPENAI_COMPATIBLE_REPLAY_HOOKS as r, isProxyReasoningUnsupportedModelHint as s, ANTHROPIC_BY_MODEL_REPLAY_HOOKS as t, normalizeGooglePreviewModelId as u };
