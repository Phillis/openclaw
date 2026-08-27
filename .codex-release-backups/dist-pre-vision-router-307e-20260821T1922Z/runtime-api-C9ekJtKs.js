import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { m as clampTimerTimeoutMs } from "./number-coercion-oCkfUEEq.js";
import { c as redactSensitiveText } from "./redact-Cl7lwBnl.js";
import "./utils-DEqefz4f.js";
import { t as mergeDeep } from "./deep-merge-DhxZfAYh.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as isVerbose } from "./global-state-BCtvHc7P.js";
import { C as resolveSupportedVoiceModelRefs, E as voiceProviderSupportsModel, S as resolvePrimaryVoiceProviderCandidate, T as resolveVoiceProviderCandidates, w as resolveVoiceModelRefs } from "./loader-B4G6K_LK.js";
import { n as privateFileStoreSync } from "./private-file-store-p6c2I0-s.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { f as markReplyPayloadAsTtsSupplement } from "./reply-payload-DVcGHORx.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import { t as getChannelPlugin } from "./registry-B3yYjPW1.js";
import { i as transcodeAudioBuffer } from "./media-services-BMidrwE0.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { o as hasReplyPayloadContent } from "./payload-ByplrRCQ.js";
import { t as resolveChannelTtsVoiceDelivery } from "./tts-capabilities-BXThoxEX.js";
import { n as normalizeSpeechProviderId } from "./provider-registry-core-DL1pv3pg.js";
import { i as getSpeechProvider, n as parseTtsDirectives, o as listSpeechProviders, r as canonicalizeSpeechProviderId } from "./directives-BCGsQXMa.js";
import { _ as resolveTtsPrefsPath, a as getTtsMaxLength, d as normalizeTtsPersonaId, f as readTtsPrefs, g as resolveTtsPersonaFromPrefs, h as resolveTtsConfig, n as asProviderConfig, o as getTtsPersona, p as resolveModelOverridePolicy, r as asProviderConfigMap, s as isSummarizationEnabled, u as normalizeConfiguredSpeechProviderId, v as resolveTtsRuntimeConfig, x as withSpeakerSelectionCompat, y as resolveTtsSettingsSnapshot } from "./tts-settings-oG9oyjFI.js";
import { t as summarizeText } from "./tts-core-CaWANA4U.js";
import { t as stripMarkdown } from "./strip-markdown-B-rLxE90.js";
import path from "node:path";
//#region src/tts/tts-provider-resolution.ts
function resolvePositiveTimeoutMs(timeoutMs) {
	return typeof timeoutMs === "number" && Number.isFinite(timeoutMs) && timeoutMs > 0 ? clampTimerTimeoutMs(timeoutMs) : void 0;
}
function resolveSpeechProviderTimeoutMs(params) {
	if (params.timeoutMs !== void 0) return resolvePositiveTimeoutMs(params.timeoutMs) ?? params.config.timeoutMs;
	if (params.config.timeoutMsSource !== "default") return resolvePositiveTimeoutMs(params.config.timeoutMs) ?? 3e4;
	return resolvePositiveTimeoutMs(params.provider.defaultTimeoutMs) ?? params.config.timeoutMs;
}
function sortSpeechProvidersForAutoSelection(cfg, providers) {
	return [...providers ?? listSpeechProviders(cfg)].toSorted((left, right) => {
		const leftOrder = left.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
		const rightOrder = right.autoSelectOrder ?? Number.MAX_SAFE_INTEGER;
		if (leftOrder !== rightOrder) return leftOrder - rightOrder;
		return left.id.localeCompare(right.id);
	});
}
function canonicalizeSpeechProviderIdFromInventory(providerId, cfg, providers) {
	const normalized = normalizeSpeechProviderId(providerId);
	if (!normalized) return;
	if (!providers) return canonicalizeSpeechProviderId(providerId, cfg);
	return providers.find((provider) => normalizeSpeechProviderId(provider.id) === normalized || provider.aliases?.some((alias) => normalizeSpeechProviderId(alias) === normalized))?.id ?? canonicalizeSpeechProviderId(providerId, cfg) ?? normalized;
}
function resolveConfiguredSpeechVoiceModelRefs(cfg, providers) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolveSupportedVoiceModelRefs({
		config: effectiveCfg?.agents?.defaults?.voiceModel,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg, providers)
	});
}
function resolveConfiguredSpeechVoiceModelForProvider(params) {
	const provider = params.provider ?? getSpeechProvider(params.providerId, params.cfg);
	if (params.voiceModel) return voiceProviderSupportsModel(provider, params.voiceModel.model) ? params.voiceModel : void 0;
	return resolveSupportedVoiceModelRefs({
		config: params.cfg?.agents?.defaults?.voiceModel,
		providers: provider ? [provider] : [],
		providerId: params.providerId
	})[0];
}
function applyVoiceModelToSpeechProviderConfig(params) {
	const voiceModel = resolveConfiguredSpeechVoiceModelForProvider({
		cfg: params.cfg,
		providerId: params.providerId,
		provider: params.provider,
		voiceModel: params.voiceModel
	});
	if (!voiceModel) return params.providerConfig;
	if (normalizeOptionalString(params.providerConfig.model) || normalizeOptionalString(params.providerConfig.modelId)) return params.providerConfig;
	return {
		...params.providerConfig,
		model: voiceModel.model,
		modelId: voiceModel.model
	};
}
function resolvePersonaProviderConfig(persona, providerId) {
	if (!persona?.providers) return;
	const normalized = normalizeConfiguredSpeechProviderId(providerId) ?? providerId;
	if (Object.hasOwn(persona.providers, normalized)) return persona.providers[normalized];
	if (Object.hasOwn(persona.providers, providerId)) return persona.providers[providerId];
}
function mergeProviderConfigWithPersona(params) {
	if (!params.persona) return {
		providerConfig: params.providerConfig,
		personaBinding: "none"
	};
	const personaProviderConfig = resolvePersonaProviderConfig(params.persona, params.providerId);
	if (!personaProviderConfig) return {
		providerConfig: params.providerConfig,
		personaBinding: "missing"
	};
	return {
		providerConfig: {
			...params.providerConfig,
			...personaProviderConfig
		},
		personaProviderConfig,
		personaBinding: "applied"
	};
}
function resolveRawProviderConfig(raw, providerId) {
	if (!raw) return {};
	return withSpeakerSelectionCompat(asProviderConfig(asProviderConfigMap(raw.providers)[providerId] ?? raw[providerId]));
}
function resolveLazyProviderConfig(config, providerId, cfg, voiceModel, provider) {
	const canonical = normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId);
	const existing = voiceModel ? void 0 : config.providerConfigs[canonical];
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
	if (existing && !effectiveCfg) return existing;
	const rawConfig = resolveRawProviderConfig(config.rawConfig, canonical);
	const rawBaseConfig = config.rawConfig;
	const rawProviders = asProviderConfigMap(config.rawConfig?.providers);
	const resolvedProvider = provider ?? getSpeechProvider(canonical, effectiveCfg);
	let hasRawProviderConfig = Object.hasOwn(rawProviders, canonical) || (rawBaseConfig ? Object.hasOwn(rawBaseConfig, canonical) : false);
	let rawProviderConfig = rawProviders[canonical] ?? rawBaseConfig?.[canonical];
	if (!hasRawProviderConfig) for (const alias of resolvedProvider?.aliases ?? []) {
		const normalizedAlias = normalizeSpeechProviderId(alias);
		if (!normalizedAlias) continue;
		if (Object.hasOwn(rawProviders, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawProviders[normalizedAlias];
			break;
		}
		if (rawBaseConfig && Object.hasOwn(rawBaseConfig, normalizedAlias)) {
			hasRawProviderConfig = true;
			rawProviderConfig = rawBaseConfig[normalizedAlias];
			break;
		}
	}
	const compatRawProviderConfig = applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: withSpeakerSelectionCompat(asProviderConfig(rawProviderConfig)),
		provider: resolvedProvider,
		voiceModel
	});
	const shouldInjectCanonicalProviderConfig = hasRawProviderConfig || Boolean(voiceModel) || Object.keys(rawProviders).length === 0;
	const rawConfigForProvider = {
		...rawBaseConfig,
		providers: shouldInjectCanonicalProviderConfig ? {
			...rawProviders,
			[canonical]: compatRawProviderConfig
		} : rawProviders,
		...shouldInjectCanonicalProviderConfig ? { [canonical]: compatRawProviderConfig } : {}
	};
	const next = withSpeakerSelectionCompat(effectiveCfg && resolvedProvider?.resolveConfig ? resolvedProvider.resolveConfig({
		cfg: effectiveCfg,
		rawConfig: rawConfigForProvider,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config,
			provider: resolvedProvider
		})
	}) : applyVoiceModelToSpeechProviderConfig({
		cfg: effectiveCfg,
		providerId: canonical,
		providerConfig: rawConfig,
		provider: resolvedProvider,
		voiceModel
	}));
	if (!voiceModel) config.providerConfigs[canonical] = next;
	return next;
}
function getResolvedSpeechProviderConfig(config, providerId, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
	return resolveLazyProviderConfig(config, canonicalizeSpeechProviderId(providerId, effectiveCfg) ?? normalizeConfiguredSpeechProviderId(providerId) ?? normalizeLowercaseStringOrEmpty(providerId), effectiveCfg);
}
function getResolvedSpeechProviderConfigFromInventory(params) {
	const effectiveCfg = params.cfg ? resolveTtsRuntimeConfig(params.cfg) : params.config.sourceConfig;
	return resolveLazyProviderConfig(params.config, params.provider.id, effectiveCfg, void 0, params.provider);
}
function getResolvedSpeechProviderConfigForVoiceModel(params) {
	if (!params.voiceModel) return getResolvedSpeechProviderConfig(params.config, params.providerId, params.cfg);
	const effectiveCfg = resolveTtsRuntimeConfig(params.cfg);
	const canonical = canonicalizeSpeechProviderId(params.providerId, effectiveCfg) ?? normalizeConfiguredSpeechProviderId(params.providerId) ?? normalizeLowercaseStringOrEmpty(params.providerId);
	return resolveLazyProviderConfig(params.config, canonical, effectiveCfg, params.voiceModel);
}
function resolveTtsProvider(config, prefsPath) {
	const prefs = readTtsPrefs(prefsPath);
	const prefsProvider = canonicalizeSpeechProviderId(prefs.tts?.provider) ?? normalizeConfiguredSpeechProviderId(prefs.tts?.provider);
	if (prefsProvider) return prefsProvider;
	const activePersona = resolveTtsPersonaFromPrefs(config, prefs);
	const personaProvider = canonicalizeSpeechProviderId(activePersona?.provider, config.sourceConfig) ?? normalizeConfiguredSpeechProviderId(activePersona?.provider);
	if (personaProvider && getSpeechProvider(personaProvider, config.sourceConfig)) return personaProvider;
	if (config.providerSource === "config") return normalizeConfiguredSpeechProviderId(config.provider) ?? config.provider;
	const configuredVoiceProvider = resolveConfiguredSpeechVoiceModelRefs(config.sourceConfig)[0]?.provider;
	if (configuredVoiceProvider && getSpeechProvider(configuredVoiceProvider, config.sourceConfig)) return configuredVoiceProvider;
	const effectiveCfg = config.sourceConfig;
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg)) if (isTtsProviderConfigured(config, provider.id, effectiveCfg)) return provider.id;
	return config.provider;
}
function resolvePreparedTtsProvider(params) {
	const effectiveCfg = params.config.sourceConfig;
	if (params.preference?.source === "prefs") return canonicalizeSpeechProviderIdFromInventory(params.preference.provider, effectiveCfg, params.providers) ?? params.preference.provider;
	if (params.preference?.source === "persona") {
		const preferredProvider = params.preference.provider;
		const personaProvider = params.providers.find((provider) => normalizeSpeechProviderId(provider.id) === normalizeSpeechProviderId(preferredProvider) || provider.aliases?.some((alias) => normalizeSpeechProviderId(alias) === normalizeSpeechProviderId(preferredProvider))) ?? getSpeechProvider(preferredProvider, effectiveCfg);
		if (personaProvider) return personaProvider.id;
	}
	if (params.preference?.source === "config") return normalizeConfiguredSpeechProviderId(params.preference.provider) ?? params.preference.provider;
	const configuredVoiceProvider = resolveConfiguredSpeechVoiceModelRefs(effectiveCfg, params.providers)[0]?.provider;
	if (configuredVoiceProvider) return configuredVoiceProvider;
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg, params.providers)) if (params.configuredByProvider.get(provider.id) === true) return provider.id;
	return params.config.provider;
}
function resolveTtsProviderOrder(primary, cfg, providers) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	const normalizedPrimary = canonicalizeSpeechProviderIdFromInventory(primary, effectiveCfg, providers) ?? primary;
	const ordered = /* @__PURE__ */ new Set([normalizedPrimary]);
	for (const ref of resolveVoiceModelRefs(effectiveCfg?.agents?.defaults?.voiceModel)) {
		const provider = canonicalizeSpeechProviderIdFromInventory(ref.provider, effectiveCfg, providers) ?? ref.provider;
		if (provider !== normalizedPrimary) ordered.add(provider);
	}
	for (const provider of sortSpeechProvidersForAutoSelection(effectiveCfg, providers)) {
		const normalized = provider.id;
		if (normalized !== normalizedPrimary) ordered.add(normalized);
	}
	return [...ordered];
}
function resolveTtsProviderCandidates(primary, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolveVoiceProviderCandidates({
		primaryProvider: canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function resolvePrimaryTtsProviderCandidate(primary, cfg) {
	const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : void 0;
	return resolvePrimaryVoiceProviderCandidate({
		primaryProvider: canonicalizeSpeechProviderId(primary, effectiveCfg) ?? primary,
		providers: sortSpeechProvidersForAutoSelection(effectiveCfg),
		voiceModelConfig: effectiveCfg?.agents?.defaults?.voiceModel
	});
}
function isTtsProviderConfigured(config, provider, cfg) {
	try {
		const effectiveCfg = cfg ? resolveTtsRuntimeConfig(cfg) : config.sourceConfig;
		const resolvedProvider = typeof provider === "string" ? getSpeechProvider(provider, effectiveCfg) : provider;
		if (!resolvedProvider) return false;
		return resolvedProvider.isConfigured({
			cfg: effectiveCfg,
			providerConfig: typeof provider === "string" ? getResolvedSpeechProviderConfig(config, resolvedProvider.id, effectiveCfg) : getResolvedSpeechProviderConfigFromInventory({
				config,
				provider: resolvedProvider,
				cfg: effectiveCfg
			}),
			timeoutMs: resolveSpeechProviderTimeoutMs({
				config,
				provider: resolvedProvider
			})
		}) ?? false;
	} catch {
		return false;
	}
}
//#endregion
//#region src/tts/tts-synthesis-support.ts
function formatTtsProviderError(provider, err) {
	const error = err instanceof Error ? err : new Error(String(err));
	if (error.name === "AbortError") return `${provider}: request timed out`;
	return `${provider}: ${redactSensitiveText(error.message)}`;
}
function sanitizeTtsErrorForLog(err) {
	return redactSensitiveText(formatErrorMessage(err)).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t");
}
function buildTtsFailureResult(errors, attemptedProviders, attempts, persona) {
	return {
		success: false,
		error: `TTS conversion failed: ${errors.join("; ") || "no providers available"}`,
		attemptedProviders,
		attempts,
		persona
	};
}
function resolveReadySpeechProvider(params) {
	const resolvedProvider = getSpeechProvider(params.provider, params.cfg);
	if (!resolvedProvider) return {
		kind: "skip",
		reasonCode: "no_provider_registered",
		message: `${params.provider}: no provider registered`
	};
	const merged = mergeProviderConfigWithPersona({
		providerConfig: getResolvedSpeechProviderConfigForVoiceModel({
			config: params.config,
			providerId: resolvedProvider.id,
			cfg: params.cfg,
			voiceModel: params.voiceModel
		}),
		persona: params.persona,
		providerId: resolvedProvider.id
	});
	if (params.persona?.fallbackPolicy === "fail" && merged.personaBinding === "missing") return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: persona ${params.persona.id} has no provider binding`,
		personaBinding: "missing"
	};
	if (!resolvedProvider.isConfigured({
		cfg: params.cfg,
		providerConfig: merged.providerConfig,
		timeoutMs: resolveSpeechProviderTimeoutMs({
			config: params.config,
			provider: resolvedProvider
		})
	})) return {
		kind: "skip",
		reasonCode: "not_configured",
		message: `${params.provider}: not configured`
	};
	if (params.requireTelephony && !resolvedProvider.synthesizeTelephony) return {
		kind: "skip",
		reasonCode: "unsupported_for_telephony",
		message: `${params.provider}: unsupported for telephony`
	};
	return {
		kind: "ready",
		provider: resolvedProvider,
		providerConfig: merged.providerConfig,
		personaProviderConfig: merged.personaProviderConfig,
		synthesisPersona: params.persona?.fallbackPolicy === "provider-defaults" && merged.personaBinding === "missing" ? void 0 : params.persona,
		personaBinding: merged.personaBinding
	};
}
async function prepareSpeechSynthesis(params) {
	if (!params.provider.prepareSynthesis) return {
		text: params.text,
		providerConfig: params.providerConfig,
		providerOverrides: params.providerOverrides
	};
	const prepared = await params.provider.prepareSynthesis({
		text: params.text,
		cfg: params.cfg,
		providerConfig: params.providerConfig,
		providerOverrides: params.providerOverrides,
		persona: params.persona,
		personaProviderConfig: params.personaProviderConfig,
		target: params.target,
		timeoutMs: params.timeoutMs
	});
	return {
		text: prepared?.text ?? params.text,
		providerConfig: prepared?.providerConfig ? {
			...params.providerConfig,
			...prepared.providerConfig
		} : params.providerConfig,
		providerOverrides: prepared?.providerOverrides ? {
			...params.providerOverrides,
			...prepared.providerOverrides
		} : params.providerOverrides
	};
}
function resolveTtsRequestSetup(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	if (params.text.length > config.maxTextLength) return { error: `Text too long (${params.text.length} chars, max ${config.maxTextLength})` };
	const userProvider = resolveTtsProvider(config, prefsPath);
	const provider = canonicalizeSpeechProviderId(params.providerOverride, cfg) ?? userProvider;
	return {
		cfg,
		config,
		persona: getTtsPersona(config, prefsPath),
		providers: params.disableFallback ? [resolvePrimaryTtsProviderCandidate(provider, cfg)] : resolveTtsProviderCandidates(provider, cfg)
	};
}
async function executeTtsProviderAttempts(params) {
	const { cfg, config, persona, providers } = params;
	const errors = [];
	const attemptedProviders = [];
	const attempts = [];
	const primaryProvider = providers[0]?.provider;
	logVerbose(`${params.logLabel}: starting with provider ${primaryProvider}, fallbacks: ${providers.slice(1).map((entry) => entry.provider).join(", ") || "none"}`);
	for (const { provider, voiceModel } of providers) {
		attemptedProviders.push(provider);
		const providerStart = Date.now();
		try {
			const resolvedProvider = resolveReadySpeechProvider({
				provider,
				cfg,
				config,
				persona,
				voiceModel,
				requireTelephony: params.requireTelephony
			});
			if (resolvedProvider.kind === "skip") {
				errors.push(resolvedProvider.message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: resolvedProvider.reasonCode,
					persona: persona?.id,
					...resolvedProvider.personaBinding ? { personaBinding: resolvedProvider.personaBinding } : {},
					error: resolvedProvider.message
				});
				logVerbose(`${params.logLabel}: provider ${provider} skipped (${resolvedProvider.message})`);
				continue;
			}
			const operation = params.selectOperation({
				provider,
				resolvedProvider
			});
			if (operation.kind === "skip") {
				errors.push(operation.message);
				attempts.push({
					provider,
					outcome: "skipped",
					reasonCode: operation.reasonCode,
					persona: persona?.id,
					personaBinding: resolvedProvider.personaBinding,
					error: operation.message
				});
				logVerbose(`${params.logLabel}: provider ${provider} skipped (${operation.message})`);
				continue;
			}
			const timeoutMs = resolveSpeechProviderTimeoutMs({
				timeoutMs: params.timeoutMs ?? voiceModel?.timeoutMs,
				config,
				provider: resolvedProvider.provider
			});
			const prepared = await prepareSpeechSynthesis({
				provider: resolvedProvider.provider,
				text: params.synthesisText,
				cfg,
				providerConfig: resolvedProvider.providerConfig,
				providerOverrides: params.providerOverrides?.[resolvedProvider.provider.id],
				persona: resolvedProvider.synthesisPersona,
				personaProviderConfig: resolvedProvider.personaProviderConfig,
				target: params.target,
				timeoutMs
			});
			const synthesis = await operation.synthesize({
				prepared,
				cfg,
				target: params.target,
				timeoutMs
			});
			const latencyMs = Date.now() - providerStart;
			attempts.push({
				provider,
				outcome: "success",
				reasonCode: "success",
				persona: persona?.id,
				personaBinding: resolvedProvider.personaBinding,
				latencyMs
			});
			return params.buildSuccess({
				synthesis,
				latencyMs,
				provider,
				providerModel: resolveTtsResultModel(prepared.providerConfig, prepared.providerOverrides),
				providerVoice: resolveTtsResultVoice(prepared.providerConfig, prepared.providerOverrides),
				persona: persona?.id,
				fallbackFrom: provider !== primaryProvider ? primaryProvider : void 0,
				attemptedProviders,
				attempts
			});
		} catch (err) {
			const errorMsg = formatTtsProviderError(provider, err);
			const latencyMs = Date.now() - providerStart;
			errors.push(errorMsg);
			attempts.push({
				provider,
				outcome: "failed",
				reasonCode: err instanceof Error && err.name === "AbortError" ? "timeout" : "provider_error",
				latencyMs,
				persona: persona?.id,
				personaBinding: resolvePersonaBinding(persona, provider),
				error: errorMsg
			});
			const rawError = sanitizeTtsErrorForLog(err);
			if (provider === primaryProvider) {
				const hasFallbacks = providers.length > 1;
				logVerbose(`${params.logLabel}: primary provider ${provider} failed (${rawError})${hasFallbacks ? "; trying fallback providers." : "; no fallback providers configured."}`);
			} else logVerbose(`${params.logLabel}: ${provider} failed (${rawError}); trying next provider.`);
		}
	}
	return buildTtsFailureResult(errors, attemptedProviders, attempts, persona?.id);
}
function resolveTtsResultModel(providerConfig, providerOverrides) {
	return normalizeOptionalString(providerOverrides?.modelId) ?? normalizeOptionalString(providerOverrides?.model) ?? normalizeOptionalString(providerConfig.modelId) ?? normalizeOptionalString(providerConfig.model);
}
function resolveTtsResultVoice(providerConfig, providerOverrides) {
	return normalizeOptionalString(providerOverrides?.speakerVoiceId) ?? normalizeOptionalString(providerOverrides?.speakerVoice) ?? normalizeOptionalString(providerOverrides?.voiceId) ?? normalizeOptionalString(providerOverrides?.voiceName) ?? normalizeOptionalString(providerOverrides?.voice) ?? normalizeOptionalString(providerConfig.speakerVoiceId) ?? normalizeOptionalString(providerConfig.speakerVoice) ?? normalizeOptionalString(providerConfig.voiceId) ?? normalizeOptionalString(providerConfig.voiceName) ?? normalizeOptionalString(providerConfig.voice);
}
function resolvePersonaBinding(persona, provider) {
	return resolvePersonaProviderConfig(persona, provider) != null ? "applied" : persona ? "missing" : "none";
}
//#endregion
//#region src/tts/runtime-availability.ts
/** Host-owned availability guard shared by every speech runtime entrypoint. */
let assertRuntimeAvailable;
/** Installs the process-lifecycle availability guard owned by the OpenClaw host. */
function setSpeechRuntimeAvailabilityGuard(guard) {
	assertRuntimeAvailable = guard;
}
/** Throws the host's typed unavailable error when speech is configured cold. */
function assertSpeechRuntimeAvailable() {
	assertRuntimeAvailable?.();
}
/** Returns false only when the installed host guard rejects speech execution. */
function isSpeechRuntimeAvailable() {
	try {
		assertSpeechRuntimeAvailable();
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/tts/speech-text.ts
const CODE_HEAVY_SPOKEN_FALLBACK = "I've put the detailed response on screen.";
const CODE_HEAVY_FENCED_CHAR_RATIO = .5;
function unwrapFenceContainer(line) {
	let content = line;
	let blockquoteDepth = 0;
	while (true) {
		const match = /^(?: {0,3}>[ \t]?)/u.exec(content);
		if (!match) break;
		content = content.slice(match[0].length);
		blockquoteDepth += 1;
	}
	const indentation = /^ +/u.exec(content)?.[0].length ?? 0;
	const listIndent = indentation > 3 && indentation <= 8 ? indentation : 0;
	if (listIndent > 0) content = content.slice(listIndent);
	return {
		content,
		container: {
			blockquoteDepth,
			listIndent
		}
	};
}
function parseFenceOpener(line) {
	const { content, container } = unwrapFenceContainer(line);
	const fence = /^(?: {0,3})(`{3,}|~{3,})/u.exec(content)?.[1];
	if (!fence) return;
	const marker = fence[0];
	if (marker !== "`" && marker !== "~") return;
	return {
		marker,
		length: fence.length,
		...container
	};
}
function isFenceCloser(line, opener) {
	const { content, container } = unwrapFenceContainer(line);
	if (container.blockquoteDepth !== opener.blockquoteDepth || container.listIndent !== opener.listIndent) return false;
	const fence = /^(?: {0,3})(`+|~+)([ \t]*)$/u.exec(content)?.[1];
	return fence !== void 0 && fence[0] === opener.marker && fence.length >= opener.length;
}
function unwrapFenceBodyLine(line, opener) {
	let content = line;
	for (let index = 0; index < opener.blockquoteDepth; index += 1) {
		const match = /^(?: {0,3}>[ \t]?)/u.exec(content);
		if (!match) return line;
		content = content.slice(match[0].length);
	}
	if (opener.listIndent > 0 && content.startsWith(" ".repeat(opener.listIndent))) return content.slice(opener.listIndent);
	return content;
}
function countFencedCodeChars(text) {
	const lines = text.split(/\r?\n/u);
	let fencedCodeChars = 0;
	let opener;
	let bodyLines = [];
	for (const line of lines) {
		if (!opener) {
			opener = parseFenceOpener(line);
			continue;
		}
		if (isFenceCloser(line, opener)) {
			fencedCodeChars += bodyLines.join("\n").length;
			opener = void 0;
			bodyLines = [];
			continue;
		}
		bodyLines.push(unwrapFenceBodyLine(line, opener));
	}
	if (opener) fencedCodeChars += bodyLines.join("\n").length;
	return fencedCodeChars;
}
function isCodeHeavySpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return false;
	return countFencedCodeChars(trimmed) / trimmed.length >= CODE_HEAVY_FENCED_CHAR_RATIO;
}
function normalizeSpeechText(text) {
	const trimmed = text.trim();
	if (!trimmed) return "";
	return stripMarkdown(trimmed, {
		linkStyle: "label",
		mode: "speech"
	}).trim();
}
//#endregion
//#region src/tts/tts-synthesis.ts
function supportsNativeVoiceNoteTts(channel) {
	return resolveChannelTtsVoiceDelivery(channel) !== void 0;
}
function supportsTranscodedVoiceNoteTts(channel) {
	const delivery = resolveChannelTtsVoiceDelivery(channel);
	return delivery?.synthesisTarget === "voice-note" && delivery.transcodesAudio === true;
}
function resolveTtsSynthesisTarget(channel) {
	return resolveChannelTtsVoiceDelivery(channel)?.synthesisTarget ?? "audio-file";
}
function supportsAudioFileVoiceMemoOutput(params) {
	const formats = new Set(params.audioFileFormats?.map((format) => format.trim().toLowerCase()));
	if (formats.size === 0) return false;
	const extension = params.fileExtension?.trim().toLowerCase();
	if (extension && formats.has(extension.replace(/^\./, ""))) return true;
	const outputFormat = params.outputFormat?.trim().toLowerCase();
	return outputFormat ? formats.has(outputFormat) : false;
}
function shouldDeliverTtsAsVoice(params) {
	const delivery = resolveChannelTtsVoiceDelivery(params.channel);
	if (!delivery) return false;
	if (delivery.synthesisTarget === "audio-file") return params.target === "audio-file" && supportsAudioFileVoiceMemoOutput({
		fileExtension: params.fileExtension,
		outputFormat: params.outputFormat,
		audioFileFormats: delivery.audioFileFormats
	});
	if (params.target !== "voice-note") return false;
	return params.voiceCompatible === true || delivery.transcodesAudio === true;
}
async function textToSpeechCore(params, persistTtsAudio) {
	const synthesis = await synthesizeSpeech(params);
	if (!synthesis.success || !synthesis.audioBuffer || !synthesis.fileExtension) return {
		success: false,
		error: synthesis.error ?? "TTS conversion failed",
		persona: synthesis.persona,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	let audioBuffer = synthesis.audioBuffer;
	let fileExtension = synthesis.fileExtension;
	let outputFormat = synthesis.outputFormat;
	const transcoded = await maybePreTranscodeForVoiceDelivery({
		channel: params.channel,
		target: synthesis.target,
		audioBuffer,
		fileExtension,
		outputFormat
	});
	if (transcoded) {
		audioBuffer = transcoded.audioBuffer;
		fileExtension = transcoded.fileExtension;
		outputFormat = transcoded.outputFormat;
	}
	let audioPath;
	try {
		audioPath = await persistTtsAudio({
			audioBuffer,
			cfg: params.cfg,
			fileExtension,
			outputFormat
		});
	} catch (err) {
		logVerbose(`TTS: audio persistence failed: ${sanitizeTtsErrorForLog(err)}`);
		return {
			success: false,
			error: "TTS audio persistence failed",
			latencyMs: synthesis.latencyMs,
			provider: synthesis.provider,
			persona: synthesis.persona,
			fallbackFrom: synthesis.fallbackFrom,
			attemptedProviders: synthesis.attemptedProviders,
			attempts: synthesis.attempts
		};
	}
	return {
		success: true,
		audioPath,
		latencyMs: synthesis.latencyMs,
		provider: synthesis.provider,
		persona: synthesis.persona,
		fallbackFrom: synthesis.fallbackFrom,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts,
		outputFormat,
		voiceCompatible: synthesis.voiceCompatible,
		audioAsVoice: shouldDeliverTtsAsVoice({
			channel: params.channel,
			target: synthesis.target,
			voiceCompatible: synthesis.voiceCompatible,
			fileExtension,
			outputFormat
		}),
		target: synthesis.target
	};
}
async function maybePreTranscodeForVoiceDelivery(params) {
	if (params.target !== "audio-file") return;
	const preferred = resolveChannelTtsVoiceDelivery(params.channel)?.preferAudioFileFormat?.trim().toLowerCase();
	if (!preferred) return;
	const sourceExt = params.fileExtension.trim().toLowerCase().replace(/^\./, "");
	if (sourceExt === preferred) return;
	const outcome = await transcodeAudioBuffer({
		audioBuffer: params.audioBuffer,
		sourceExtension: sourceExt,
		targetExtension: preferred
	});
	if (!outcome.ok) {
		if (outcome.reason === "transcoder-failed") logVerbose(`TTS: pre-transcode ${sourceExt}->${preferred} for channel=${params.channel ?? "?"} failed: ${outcome.detail ?? "unknown"}`);
		return;
	}
	return {
		audioBuffer: outcome.buffer,
		fileExtension: `.${preferred}`,
		outputFormat: preferred
	};
}
async function synthesizeSpeech(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	const target = resolveTtsSynthesisTarget(params.channel);
	return await executeTtsProviderAttempts({
		cfg,
		config,
		persona,
		providers,
		synthesisText: normalizeSpeechText(params.text),
		providerOverrides: params.overrides?.providerOverrides,
		timeoutMs: params.timeoutMs,
		target,
		logLabel: "TTS",
		selectOperation: ({ resolvedProvider }) => ({
			kind: "ready",
			synthesize: ({ prepared, cfg: runtimeCfg, target: synthesisTarget, timeoutMs }) => resolvedProvider.provider.synthesize({
				text: prepared.text,
				cfg: runtimeCfg,
				providerConfig: prepared.providerConfig,
				target: synthesisTarget,
				providerOverrides: prepared.providerOverrides,
				timeoutMs
			})
		}),
		buildSuccess: ({ synthesis, ...metadata }) => ({
			success: true,
			...metadata,
			audioBuffer: synthesis.audioBuffer,
			outputFormat: synthesis.outputFormat,
			voiceCompatible: synthesis.voiceCompatible,
			fileExtension: synthesis.fileExtension,
			target
		})
	});
}
//#endregion
//#region src/tts/tts-settings-writes.ts
function updateTtsPrefs(prefsPath, update) {
	const prefs = readTtsPrefs(prefsPath);
	update(prefs);
	privateFileStoreSync(path.dirname(prefsPath)).writeText(path.basename(prefsPath), JSON.stringify(prefs, null, 2));
}
function setTtsAutoMode(prefsPath, mode) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		delete next.enabled;
		next.auto = mode;
		prefs.tts = next;
	});
}
function setTtsEnabled(prefsPath, enabled) {
	setTtsAutoMode(prefsPath, enabled ? "always" : "off");
}
function setTtsPersona(prefsPath, persona) {
	updateTtsPrefs(prefsPath, (prefs) => {
		const next = { ...prefs.tts };
		next.persona = normalizeTtsPersonaId(persona) ?? null;
		prefs.tts = next;
	});
}
function setTtsProvider(prefsPath, provider) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			provider: canonicalizeSpeechProviderId(provider) ?? provider
		};
	});
}
function setTtsMaxLength(prefsPath, maxLength) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			maxLength
		};
	});
}
function setSummarizationEnabled(prefsPath, enabled) {
	updateTtsPrefs(prefsPath, (prefs) => {
		prefs.tts = {
			...prefs.tts,
			summarize: enabled
		};
	});
}
//#endregion
//#region src/tts/tts-payload.ts
let lastTtsAttempt;
function getLastTtsAttempt() {
	return lastTtsAttempt;
}
function setLastTtsAttempt(entry) {
	lastTtsAttempt = entry;
}
async function listSpeechVoices(params) {
	assertSpeechRuntimeAvailable();
	const cfg = params.cfg ? resolveTtsRuntimeConfig(params.cfg) : void 0;
	const provider = canonicalizeSpeechProviderId(params.provider, cfg);
	if (!provider) throw new Error("speech provider id is required");
	const config = params.config ?? (cfg ? resolveTtsConfig(cfg) : void 0);
	if (!config) throw new Error(`speech provider ${provider} requires cfg or resolved config`);
	const resolvedProvider = getSpeechProvider(provider, cfg);
	if (!resolvedProvider) throw new Error(`speech provider ${provider} is not registered`);
	if (!resolvedProvider.listVoices) throw new Error(`speech provider ${provider} does not support voice listing`);
	const timeoutMs = resolveSpeechProviderTimeoutMs({
		config,
		provider: resolvedProvider
	});
	return await resolvedProvider.listVoices({
		cfg,
		providerConfig: getResolvedSpeechProviderConfig(config, resolvedProvider.id, cfg),
		apiKey: params.apiKey,
		baseUrl: params.baseUrl,
		timeoutMs
	});
}
function hasLegacyFinalMediaDirective(text) {
	return /(?:^|\n)\s*MEDIA\s*:/i.test(text);
}
async function maybeApplyTtsToPayloadCore(params, persistTtsAudio) {
	if (!isSpeechRuntimeAvailable()) return params.payload;
	if (params.payload.isCompactionNotice) return params.payload;
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const { autoMode, config, prefsPath } = resolveTtsSettingsSnapshot({
		cfg,
		sessionAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if (autoMode === "off") return params.payload;
	const activeProvider = resolveTtsProvider(config, prefsPath);
	const reply = resolveSendableOutboundReplyParts(params.payload);
	const text = reply.text;
	const directives = parseTtsDirectives(text, config.modelOverrides, {
		cfg,
		providerConfigs: config.providerConfigs,
		preferredProviderId: activeProvider
	});
	if (directives.warnings.length > 0) logVerbose(`TTS: ignored directive overrides (${directives.warnings.join("; ")})`);
	if (isVerbose()) {
		const effectiveProvider = directives.overrides?.provider ? canonicalizeSpeechProviderId(directives.overrides.provider, cfg) ?? activeProvider : activeProvider;
		logVerbose(`TTS: auto mode enabled (${autoMode}), channel=${params.channel}, selected provider=${effectiveProvider}, config.provider=${config.provider}, config.providerSource=${config.providerSource}`);
	}
	const trimmedCleaned = directives.cleanedText.trim();
	const visibleText = trimmedCleaned.length > 0 ? trimmedCleaned : "";
	const explicitTtsText = directives.ttsText?.trim() || "";
	const ttsText = explicitTtsText || visibleText;
	const nextPayload = visibleText === text.trim() ? params.payload : {
		...params.payload,
		text: visibleText.length > 0 ? visibleText : void 0
	};
	if (autoMode === "tagged" && !directives.hasDirective) return nextPayload;
	if (autoMode === "inbound" && params.inboundAudio !== true) return nextPayload;
	if ((config.mode ?? "final") === "final" && params.kind && params.kind !== "final") return nextPayload;
	if (!ttsText.trim()) return nextPayload;
	if (reply.hasMedia || hasLegacyFinalMediaDirective(text)) return nextPayload;
	if (!explicitTtsText && ttsText.trim().length < 10) return nextPayload;
	const maxLength = getTtsMaxLength(prefsPath);
	let textForAudio = ttsText.trim();
	let wasSummarized = false;
	if (!explicitTtsText && isCodeHeavySpeechText(textForAudio)) return nextPayload;
	if (textForAudio.length > maxLength) if (!isSummarizationEnabled(prefsPath)) {
		logVerbose(`TTS: truncating long text (${textForAudio.length} > ${maxLength}), summarization disabled.`);
		textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
	} else try {
		textForAudio = (await summarizeText({
			text: textForAudio,
			targetLength: maxLength,
			cfg,
			config,
			timeoutMs: config.timeoutMs
		})).summary;
		wasSummarized = true;
		if (textForAudio.length > config.maxTextLength) {
			logVerbose(`TTS: summary exceeded hard limit (${textForAudio.length} > ${config.maxTextLength}); truncating.`);
			textForAudio = `${truncateUtf16Safe(textForAudio, config.maxTextLength - 3)}...`;
		}
	} catch (err) {
		logVerbose(`TTS: summarization failed, truncating instead: ${err.message}`);
		textForAudio = `${truncateUtf16Safe(textForAudio, maxLength - 3)}...`;
	}
	const normalizedTextForAudio = normalizeSpeechText(textForAudio);
	if (!normalizedTextForAudio) return nextPayload;
	if (!explicitTtsText && normalizedTextForAudio.length < 10) return nextPayload;
	const ttsStart = Date.now();
	const result = await textToSpeechCore({
		text: textForAudio,
		cfg,
		prefsPath,
		channel: params.channel,
		overrides: directives.overrides,
		agentId: params.agentId,
		accountId: params.accountId
	}, persistTtsAudio);
	if (result.success && result.audioPath) {
		lastTtsAttempt = {
			timestamp: Date.now(),
			success: true,
			textLength: text.length,
			summarized: wasSummarized,
			provider: result.provider,
			persona: result.persona,
			fallbackFrom: result.fallbackFrom,
			attemptedProviders: result.attemptedProviders,
			attempts: result.attempts,
			latencyMs: result.latencyMs
		};
		const payloadWithAudio = {
			...nextPayload,
			mediaUrl: result.audioPath,
			audioAsVoice: result.audioAsVoice || params.payload.audioAsVoice,
			spokenText: textForAudio,
			trustedLocalMedia: true
		};
		return nextPayload.text?.trim() ? markReplyPayloadAsTtsSupplement(payloadWithAudio) : payloadWithAudio;
	}
	lastTtsAttempt = {
		timestamp: Date.now(),
		success: false,
		textLength: text.length,
		summarized: wasSummarized,
		persona: result.persona,
		attemptedProviders: result.attemptedProviders,
		attempts: result.attempts,
		error: result.error
	};
	logVerbose(`TTS: conversion failed after ${Date.now() - ttsStart}ms (${result.error ?? "unknown"}).`);
	const channelId = explicitTtsText && nextPayload.channelData ? normalizeMessageChannel(params.channel) : null;
	const hasChannelData = channelId ? getChannelPlugin(channelId)?.messaging?.hasStructuredReplyPayload?.({ payload: nextPayload }) : void 0;
	return explicitTtsText && !hasReplyPayloadContent(nextPayload, { hasChannelData }) ? {
		...nextPayload,
		text: explicitTtsText
	} : nextPayload;
}
//#endregion
//#region src/tts/tts-request.ts
/** Merge a surface TTS override and resolve its inline synthesis directives. */
function prepareTtsRequest(params) {
	const cfg = params.override ? {
		...params.cfg,
		tts: mergeDeep(params.cfg.tts ?? {}, params.override)
	} : params.cfg;
	const config = resolveTtsConfig(cfg);
	return {
		cfg,
		directives: parseTtsDirectives(params.text, config.modelOverrides, {
			cfg,
			providerConfigs: config.providerConfigs,
			preferredProviderId: resolveTtsProvider(config, resolveTtsPrefsPath(config))
		})
	};
}
function resolveExplicitTtsOverrides(params) {
	const cfg = resolveTtsRuntimeConfig(params.cfg);
	const providerInput = params.provider?.trim();
	const modelId = params.modelId?.trim();
	const voiceId = params.voiceId?.trim();
	const config = resolveTtsConfig(cfg, {
		agentId: params.agentId,
		channelId: params.channelId,
		accountId: params.accountId
	});
	const prefsPath = params.prefsPath ?? resolveTtsPrefsPath(config);
	const selectedProvider = canonicalizeSpeechProviderId(providerInput, cfg) ?? (modelId || voiceId ? resolveTtsProvider(config, prefsPath) : void 0);
	if (providerInput && !selectedProvider) throw new Error(`Unknown TTS provider "${providerInput}".`);
	if (!modelId && !voiceId) return selectedProvider ? { provider: selectedProvider } : {};
	if (!selectedProvider) throw new Error("TTS model or voice overrides require a resolved provider.");
	const provider = getSpeechProvider(selectedProvider, cfg);
	if (!provider) throw new Error(`speech provider ${selectedProvider} is not registered`);
	if (!provider.resolveTalkOverrides) throw new Error(`TTS provider "${selectedProvider}" does not support model or voice overrides.`);
	const providerOverrides = provider.resolveTalkOverrides({
		talkProviderConfig: {},
		params: {
			...voiceId ? { voiceId } : {},
			...modelId ? { modelId } : {}
		}
	});
	if ((voiceId || modelId) && (!providerOverrides || Object.keys(providerOverrides).length === 0)) throw new Error(`TTS provider "${selectedProvider}" ignored the requested model or voice overrides.`);
	const overridesRecord = providerOverrides;
	return {
		provider: selectedProvider,
		providerOverrides: { [provider.id]: overridesRecord }
	};
}
//#endregion
//#region src/tts/tts-streaming.ts
async function streamSpeech(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider,
		disableFallback: params.disableFallback,
		agentId: params.agentId,
		channelId: params.channel,
		accountId: params.accountId
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	const target = resolveTtsSynthesisTarget(params.channel);
	return await executeTtsProviderAttempts({
		cfg,
		config,
		persona,
		providers,
		synthesisText: params.text,
		providerOverrides: params.overrides?.providerOverrides,
		timeoutMs: params.timeoutMs,
		target,
		logLabel: "TTS stream",
		selectOperation: ({ provider, resolvedProvider }) => {
			if (!resolvedProvider.provider.streamSynthesize) return {
				kind: "skip",
				reasonCode: "unsupported_for_streaming",
				message: `${provider} does not support streaming TTS`
			};
			return {
				kind: "ready",
				synthesize: ({ prepared, cfg: runtimeCfg, target: synthesisTarget, timeoutMs }) => resolvedProvider.provider.streamSynthesize({
					text: prepared.text,
					cfg: runtimeCfg,
					providerConfig: prepared.providerConfig,
					target: synthesisTarget,
					providerOverrides: prepared.providerOverrides,
					timeoutMs
				})
			};
		},
		buildSuccess: ({ synthesis, ...metadata }) => ({
			success: true,
			...metadata,
			audioStream: synthesis.audioStream,
			outputFormat: synthesis.outputFormat,
			voiceCompatible: synthesis.voiceCompatible,
			fileExtension: synthesis.fileExtension,
			target,
			release: synthesis.release
		})
	});
}
async function textToSpeechStream(params) {
	const synthesis = await streamSpeech(params);
	if (!synthesis.success || !synthesis.audioStream || !synthesis.fileExtension) return {
		success: false,
		error: synthesis.error ?? "Streaming TTS conversion failed",
		persona: synthesis.persona,
		attemptedProviders: synthesis.attemptedProviders,
		attempts: synthesis.attempts
	};
	return synthesis;
}
//#endregion
//#region src/tts/tts-telephony.ts
async function textToSpeechTelephony(params) {
	assertSpeechRuntimeAvailable();
	const setup = resolveTtsRequestSetup({
		text: params.text,
		cfg: params.cfg,
		prefsPath: params.prefsPath,
		providerOverride: params.overrides?.provider
	});
	if ("error" in setup) return {
		success: false,
		error: setup.error
	};
	const { cfg, config, persona, providers } = setup;
	return await executeTtsProviderAttempts({
		cfg,
		config,
		persona,
		providers,
		synthesisText: params.text,
		providerOverrides: params.overrides?.providerOverrides,
		timeoutMs: params.timeoutMs,
		target: "telephony",
		logLabel: "TTS telephony",
		requireTelephony: true,
		selectOperation: ({ resolvedProvider }) => {
			const synthesizeTelephony = resolvedProvider.provider.synthesizeTelephony;
			return {
				kind: "ready",
				synthesize: ({ prepared, cfg: runtimeCfg, timeoutMs }) => synthesizeTelephony({
					text: prepared.text,
					cfg: runtimeCfg,
					providerConfig: prepared.providerConfig,
					providerOverrides: prepared.providerOverrides,
					timeoutMs
				})
			};
		},
		buildSuccess: ({ synthesis, ...metadata }) => ({
			success: true,
			...metadata,
			audioBuffer: synthesis.audioBuffer,
			outputFormat: synthesis.outputFormat,
			sampleRate: synthesis.sampleRate
		})
	});
}
//#endregion
//#region src/tts/runtime-api.ts
function getTtsProvider(config, prefsPath) {
	return resolveTtsProvider(config, prefsPath);
}
const testApi = {
	parseTtsDirectives,
	resolveModelOverridePolicy,
	supportsNativeVoiceNoteTts,
	supportsTranscodedVoiceNoteTts,
	resolveTtsSynthesisTarget,
	shouldDeliverTtsAsVoice,
	summarizeText,
	getResolvedSpeechProviderConfig,
	formatTtsProviderError,
	sanitizeTtsErrorForLog
};
//#endregion
export { getResolvedSpeechProviderConfig as C, resolveTtsProviderOrder as E, setSpeechRuntimeAvailabilityGuard as S, resolvePreparedTtsProvider as T, setTtsProvider as _, textToSpeechStream as a, CODE_HEAVY_SPOKEN_FALLBACK as b, getLastTtsAttempt as c, setLastTtsAttempt as d, setSummarizationEnabled as f, setTtsPersona as g, setTtsMaxLength as h, streamSpeech as i, listSpeechVoices as l, setTtsEnabled as m, testApi as n, prepareTtsRequest as o, setTtsAutoMode as p, textToSpeechTelephony as r, resolveExplicitTtsOverrides as s, getTtsProvider as t, maybeApplyTtsToPayloadCore as u, synthesizeSpeech as v, isTtsProviderConfigured as w, isCodeHeavySpeechText as x, textToSpeechCore as y };
