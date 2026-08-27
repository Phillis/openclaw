import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { b as tryResolveLegacyCompatibilityAgentId, s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import "./session-key-D8GLfPr_.js";
import { C as modelSupportsInput, _ as resolveConfiguredModelRef, l as inferUniqueProviderFromConfiguredModels, x as findModelCatalogEntry } from "./model-selection-shared-0DI3vxkL.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { n as parseModelRef, t as findNormalizedProviderValue } from "./model-selection-normalize-Cvi2hnhD.js";
import { w as resolveDefaultModelForAgent } from "./codex-route-model-ref-WCq2iqcj.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { c as resolveThinkingProfile, o as resolveSupportedThinkingLevel } from "./thinking-D9bT8eOf.js";
import { r as resolveAgentMainSessionKey } from "./main-session-Dth0X5B9.js";
import "./model-catalog-C8gwRpA7.js";
import { t as publishedModelCatalogOwnerMatchesAgent } from "./prepared-model-catalog-owner-CUGU07tR.js";
import { o as resolveEffectiveAgentRuntime, t as concretizeAgentRuntime } from "./thinking-runtime-_QT_qncS.js";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DNLW-mvy.js";
import { i as resolveThinkingDefaultCore, n as resolveThinkingDefault } from "./model-thinking-default-B1YtMmAp.js";
import { t as isCliProvider } from "./model-selection-cli-wVNpvFQW.js";
import "./model-selection-BEGvRdL1.js";
import { r as readAcpSessionMeta } from "./session-meta-8cwXEOoU.js";
import "./sessions-Bh837xaa.js";
import { a as resolveSessionModelRef, t as projectWorkerPlacementAgentRuntime } from "./placement-session-runtime-D3R4yOqT.js";
import { t as resolveModelAgentRuntimeMetadata } from "./agent-runtime-metadata-Cslt9kIV.js";
import { n as lookupContextTokens } from "./context-GlVEvpHA.js";
//#region src/gateway/session-utils-contracts.ts
function createSessionRowModelCacheKey(provider, model) {
	return `${normalizeLowercaseStringOrEmpty(provider)}\0${normalizeOptionalString(model) ?? ""}`;
}
//#endregion
//#region src/gateway/session-utils-model.ts
function listGatewayThinkingLevelOptions(params) {
	return resolveThinkingProfile({
		provider: params.provider,
		model: params.model,
		catalog: params.modelCatalog,
		agentRuntime: params.agentRuntime,
		providerPolicySource: params.providerPolicySource
	}).levels.map(({ id, label }) => ({
		id,
		label
	}));
}
function resolveGatewaySessionThinkingLevel(params) {
	if (!(params.modelCatalog ? findModelCatalogEntry(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0)) return params.level;
	return resolveSupportedThinkingLevel({
		provider: params.provider,
		model: params.model,
		level: params.level,
		catalog: params.modelCatalog,
		agentRuntime: params.agentRuntime,
		providerPolicySource: params.providerPolicySource
	});
}
function resolveGatewaySessionThinkingDefault(params) {
	const agentThinkingDefault = params.agentId ? resolveAgentConfig(params.cfg, params.agentId)?.thinkingDefault : void 0;
	const resolveDefault = params.providerPolicySource === "active" ? (defaultParams) => resolveThinkingDefaultCore({
		...defaultParams,
		providerPolicySource: "active"
	}) : resolveThinkingDefault;
	const defaultLevel = agentThinkingDefault ?? resolveDefault({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		catalog: params.modelCatalog,
		agentRuntime: params.agentRuntime
	});
	return resolveGatewaySessionThinkingLevel({
		provider: params.provider,
		model: params.model,
		level: defaultLevel,
		modelCatalog: params.modelCatalog,
		agentRuntime: params.agentRuntime,
		providerPolicySource: params.providerPolicySource
	});
}
function resolveGatewayModelThinkingProfile(params) {
	const catalogEntry = params.modelCatalog ? findModelCatalogEntry(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	const agentRuntime = params.agentRuntime ?? resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		modelApi: catalogEntry?.api,
		modelBaseUrl: catalogEntry?.baseUrl,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	if (!params.rowContext) return {
		thinkingLevels: listGatewayThinkingLevelOptions({
			provider: params.provider,
			model: params.model,
			modelCatalog: params.modelCatalog,
			agentRuntime,
			providerPolicySource: params.providerPolicySource
		}),
		thinkingDefault: resolveGatewaySessionThinkingDefault({
			cfg: params.cfg,
			provider: params.provider,
			model: params.model,
			agentId: params.agentId,
			modelCatalog: params.modelCatalog,
			agentRuntime,
			providerPolicySource: params.providerPolicySource
		})
	};
	const key = `${normalizeAgentId(params.agentId)}\0${agentRuntime}\0${params.providerPolicySource ?? "active-or-bundled"}\0${createSessionRowModelCacheKey(params.provider, params.model)}`;
	const cached = params.rowContext.thinkingMetadataByModelRef.get(key);
	if (cached) return cached;
	const metadata = {
		thinkingLevels: listGatewayThinkingLevelOptions({
			provider: params.provider,
			model: params.model,
			modelCatalog: params.modelCatalog,
			agentRuntime,
			providerPolicySource: params.providerPolicySource
		}),
		thinkingDefault: resolveGatewaySessionThinkingDefault({
			cfg: params.cfg,
			provider: params.provider,
			model: params.model,
			agentId: params.agentId,
			modelCatalog: params.modelCatalog,
			agentRuntime,
			providerPolicySource: params.providerPolicySource
		})
	};
	params.rowContext.thinkingMetadataByModelRef.set(key, metadata);
	return metadata;
}
function resolveGatewaySessionThinkingProjectionInternal(params) {
	const cachedAcpMeta = params.rowContext?.acpSessionMetaByEntry;
	const acpMeta = params.entry?.acp ?? (params.entry && cachedAcpMeta?.has(params.entry) ? cachedAcpMeta.get(params.entry) : readAcpSessionMeta({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}));
	const configuredAgentRuntime = resolveModelAgentRuntimeMetadata({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		sessionKey: params.sessionKey,
		acpRuntime: acpMeta != null,
		acpBackend: acpMeta?.backend
	});
	const persistedAgentRuntime = resolveSessionRuntimeOverrideForProvider({
		provider: params.provider,
		entry: params.entry,
		cfg: params.cfg
	});
	const persistedAgentRuntimeSource = params.entry?.modelSelectionLocked === true ? "session" : "session-key";
	const agentRuntime = acpMeta || !persistedAgentRuntime ? configuredAgentRuntime : {
		id: persistedAgentRuntime,
		source: persistedAgentRuntimeSource
	};
	const catalogEntry = params.modelCatalog ? findModelCatalogEntry(params.modelCatalog, {
		provider: params.provider,
		modelId: params.model
	}) : void 0;
	const thinkingRuntime = acpMeta ? concretizeAgentRuntime(acpMeta.backend ?? agentRuntime.id) : resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: params.provider,
		modelId: params.model,
		modelApi: catalogEntry?.api,
		modelBaseUrl: catalogEntry?.baseUrl,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: params.entry
	});
	const metadata = resolveGatewayModelThinkingProfile({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		agentRuntime: thinkingRuntime,
		modelCatalog: params.modelCatalog,
		rowContext: params.rowContext,
		providerPolicySource: params.providerPolicySource
	});
	const storedThinkingLevel = normalizeThinkLevel(params.entry?.thinkingLevel);
	const thinkingLevel = storedThinkingLevel ? resolveGatewaySessionThinkingLevel({
		provider: params.provider,
		model: params.model,
		level: storedThinkingLevel,
		modelCatalog: params.modelCatalog,
		agentRuntime: thinkingRuntime,
		providerPolicySource: params.providerPolicySource
	}) : void 0;
	return {
		agentRuntime,
		thinkingLevel,
		effectiveThinkingLevel: thinkingLevel ?? metadata.thinkingDefault,
		thinkingLevels: metadata.thinkingLevels,
		thinkingOptions: metadata.thinkingLevels.map((level) => level.label),
		thinkingDefault: metadata.thinkingDefault
	};
}
function getSessionDefaults(cfg, modelCatalog, options) {
	const agentId = normalizeAgentId(options?.agentId ?? tryResolveLegacyCompatibilityAgentId(cfg) ?? "main");
	const resolved = options?.agentId ? resolveDefaultModelForAgent({
		cfg,
		agentId,
		allowPluginNormalization: options.allowPluginNormalization
	}) : resolveConfiguredModelRef({
		cfg,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL,
		allowPluginNormalization: options?.allowPluginNormalization
	});
	const contextTokens = resolveAgentConfig(cfg, agentId)?.contextTokens ?? cfg.agents?.defaults?.contextTokens ?? lookupContextTokens(resolved.model, { allowAsyncLoad: false }) ?? 2e5;
	const sessionKey = resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	const agentRuntime = projectWorkerPlacementAgentRuntime(resolveModelAgentRuntimeMetadata({
		cfg,
		agentId,
		provider: resolved.provider,
		model: resolved.model,
		sessionKey,
		acpRuntime: false
	}));
	const thinkingProfile = resolveGatewayModelThinkingProfile({
		cfg,
		provider: resolved.provider,
		model: resolved.model,
		agentId,
		modelCatalog,
		sessionKey
	});
	return {
		modelProvider: resolved.provider ?? null,
		model: resolved.model ?? null,
		contextTokens: contextTokens ?? null,
		agentRuntime,
		thinkingLevels: thinkingProfile.thinkingLevels,
		thinkingOptions: thinkingProfile.thinkingLevels.map((level) => level.label),
		thinkingDefault: thinkingProfile.thinkingDefault
	};
}
function normalizeGatewayModelCapabilityBaseUrl(value) {
	const baseUrl = normalizeOptionalString(value);
	if (!baseUrl) return;
	try {
		const parsed = new URL(baseUrl);
		parsed.pathname = parsed.pathname.replace(/\/+$/u, "") || "/";
		return parsed.toString();
	} catch {
		return baseUrl.replace(/\/+$/u, "");
	}
}
function isGatewayModelExplicitlyConfiguredTextOnly(params) {
	if (!params.provider) return false;
	const configuredModel = findNormalizedProviderValue(params.snapshot.config.models?.providers, params.provider)?.models?.find((model) => normalizeLowercaseStringOrEmpty(model.id) === normalizeLowercaseStringOrEmpty(params.model));
	return configuredModel?.input !== void 0 && !configuredModel.input.includes("image");
}
function resolveGatewayProviderStaticModel(params) {
	if (!params.agentId || !params.provider || !publishedModelCatalogOwnerMatchesAgent(params.snapshot, params.agentId)) return;
	const staticEntry = findModelCatalogEntry(params.snapshot.staticEntries ?? [], {
		provider: params.provider,
		modelId: params.model
	});
	if (!staticEntry) return;
	if (params.catalogEntry?.api && params.catalogEntry.api !== staticEntry.api) return;
	const catalogBaseUrl = normalizeGatewayModelCapabilityBaseUrl(params.catalogEntry?.baseUrl);
	const staticBaseUrl = normalizeGatewayModelCapabilityBaseUrl(staticEntry.baseUrl);
	if (catalogBaseUrl && catalogBaseUrl !== staticBaseUrl) return;
	if (isGatewayModelExplicitlyConfiguredTextOnly(params)) return;
	const configuredProvider = findNormalizedProviderValue(params.snapshot.config.models?.providers, params.provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(params.model);
	const configuredModel = configuredProvider?.models?.find((model) => normalizeLowercaseStringOrEmpty(model.id) === normalizedModelId);
	const configuredApi = configuredModel?.api ?? configuredProvider?.api;
	if (configuredApi && configuredApi !== staticEntry.api) return;
	const configuredBaseUrl = normalizeGatewayModelCapabilityBaseUrl(configuredModel?.baseUrl ?? configuredProvider?.baseUrl);
	if (configuredBaseUrl && configuredBaseUrl !== staticBaseUrl) return;
	return staticEntry;
}
async function resolveGatewayModelSupportsImages(params) {
	if (!params.model) return true;
	try {
		for (const readOnly of [true, false]) {
			const loadParams = {
				...params.agentId ? { agentId: params.agentId } : {},
				readOnly
			};
			const snapshot = params.loadGatewayModelCatalogSnapshot ? await params.loadGatewayModelCatalogSnapshot(loadParams) : void 0;
			const catalogEntry = findModelCatalogEntry(snapshot ? snapshot.entries : await params.loadGatewayModelCatalog(loadParams), {
				provider: params.provider,
				modelId: params.model
			});
			const modelEntry = (snapshot && (!catalogEntry || !modelSupportsInput(catalogEntry, "image")) ? resolveGatewayProviderStaticModel({
				snapshot,
				agentId: params.agentId,
				provider: params.provider,
				model: params.model,
				catalogEntry
			}) : void 0) ?? catalogEntry;
			const normalizedProvider = normalizeOptionalLowercaseString(params.provider ?? modelEntry?.provider);
			const normalizedCandidates = [normalizeLowercaseStringOrEmpty(params.model), normalizeLowercaseStringOrEmpty(modelEntry?.name)].filter(Boolean);
			if (modelEntry) {
				if (modelSupportsInput(modelEntry, "image")) return true;
				if (normalizedProvider === "microsoft-foundry" && normalizedCandidates.some((candidate) => candidate.startsWith("gpt-") || candidate.startsWith("o1") || candidate.startsWith("o3") || candidate.startsWith("o4") || candidate === "computer-use-preview")) return true;
				if (normalizedProvider === "claude-cli" && normalizedCandidates.some((candidate) => candidate === "opus" || candidate === "sonnet" || candidate === "haiku" || candidate.startsWith("claude-"))) return true;
				if (readOnly && !snapshot?.catalogComplete && (!snapshot || !isGatewayModelExplicitlyConfiguredTextOnly({
					snapshot,
					provider: params.provider,
					model: params.model
				}))) continue;
				return false;
			}
			if (normalizedProvider === "claude-cli" && normalizedCandidates.some((candidate) => candidate === "opus" || candidate === "sonnet" || candidate === "haiku" || candidate.startsWith("claude-"))) return true;
			if (readOnly && snapshot?.catalogComplete) return false;
		}
		return false;
	} catch {
		return false;
	}
}
function resolveSessionDisplayModelIdentityRefCached(params) {
	const ctx = params.rowContext;
	if (!ctx) return resolveSessionDisplayModelIdentityRef(params);
	const key = `${params.agentId}\u0000${createSessionRowModelCacheKey(params.provider, params.model)}`;
	const cached = ctx.displayModelIdentityByKey.get(key);
	if (cached) return cached;
	const value = resolveSessionDisplayModelIdentityRef(params);
	ctx.displayModelIdentityByKey.set(key, value);
	return value;
}
function resolveSessionDisplayModelIdentityRef(params) {
	const provider = normalizeOptionalString(params.provider);
	const model = normalizeOptionalString(params.model);
	if (!provider || !model || !isCliProvider(provider, params.cfg)) return {
		provider,
		model
	};
	const defaultRef = resolveDefaultModelForAgent({
		cfg: params.cfg,
		agentId: params.agentId
	});
	if (model.includes("/")) {
		const parsedModel = parseModelRef(model, defaultRef.provider);
		if (parsedModel && !isCliProvider(parsedModel.provider, params.cfg)) return parsedModel;
	}
	const inferredProvider = inferUniqueProviderFromConfiguredModels({
		cfg: params.cfg,
		model
	});
	if (inferredProvider && !isCliProvider(inferredProvider, params.cfg)) return {
		provider: inferredProvider,
		model
	};
	const parsedModel = parseModelRef(model, defaultRef.provider);
	if (parsedModel && !isCliProvider(parsedModel.provider, params.cfg)) return parsedModel;
	return {
		provider: defaultRef.provider || provider,
		model
	};
}
async function projectSessionPatchResult(params) {
	const agentId = resolveSessionAgentId({
		config: params.cfg,
		sessionKey: params.canonicalKey,
		agentId: params.targetAgentId
	});
	const resolved = resolveSessionModelRef(params.cfg, params.entry, agentId);
	const displayModel = resolveSessionDisplayModelIdentityRef({
		cfg: params.cfg,
		agentId,
		provider: resolved.provider,
		model: resolved.model
	});
	const modelCatalog = await params.modelCatalogByAgent.get(params.targetAgentId);
	const thinking = resolveGatewaySessionThinkingProjectionInternal({
		cfg: params.cfg,
		agentId,
		provider: displayModel.provider ?? resolved.provider,
		model: displayModel.model ?? resolved.model,
		sessionKey: params.canonicalKey,
		entry: params.entry,
		modelCatalog
	});
	return {
		ok: true,
		path: params.storePath,
		key: params.canonicalKey,
		entry: params.entry,
		resolved: {
			modelProvider: displayModel.provider,
			model: displayModel.model,
			agentRuntime: thinking.agentRuntime,
			...modelCatalog ? {
				thinkingLevel: thinking.effectiveThinkingLevel,
				thinkingLevels: thinking.thinkingLevels
			} : {}
		}
	};
}
//#endregion
export { resolveGatewaySessionThinkingProjectionInternal as a, resolveGatewayModelThinkingProfile as i, projectSessionPatchResult as n, resolveSessionDisplayModelIdentityRefCached as o, resolveGatewayModelSupportsImages as r, createSessionRowModelCacheKey as s, getSessionDefaults as t };
