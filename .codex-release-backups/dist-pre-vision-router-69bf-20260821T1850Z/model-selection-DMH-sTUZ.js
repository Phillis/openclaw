import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as hasLegacyAutoFallbackWithoutOrigin } from "./agent-scope-D9GLFAyB.js";
import { l as resolveAgentDir, p as resolveDefaultAgentId, s as resolveAgentConfig } from "./agent-scope-config-CsnnOL14.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { i as legacyModelKey, o as normalizeModelRef, s as normalizeProviderId } from "./model-ref-shared-poyRjWh_.js";
import { r as buildConfiguredModelCatalog, y as resolveModelAliasFromPair } from "./model-selection-shared-0DI3vxkL.js";
import { a as listOpenAIAuthProfileProvidersForAgentRuntime } from "./openai-routing-BC0q3X-J.js";
import { t as isDiagnosticFlagEnabled } from "./diagnostic-flags-Doha8xVC.js";
import { s as normalizeThinkLevel } from "./thinking.shared-bHYuuc1L.js";
import { t as resolveAgentHarnessPolicy } from "./policy-Ce8eESmX.js";
import { n as isStoredCredentialCompatibleWithAuthProvider } from "./order-DNPkDbkT.js";
import { n as resolveThinkingDefault } from "./model-thinking-default-B1YtMmAp.js";
import { l as resolveReasoningDefault } from "./model-selection-BEGvRdL1.js";
import { n as SessionWorkStartInvalidatedError } from "./lifecycle-4IbI4BFl.js";
import { i as applyModelOverrideToSessionEntry } from "./model-overrides-D4SC_nUZ.js";
import { n as createModelVisibilityPolicy, t as RUNTIME_MODEL_VISIBILITY_NORMALIZATION } from "./model-visibility-policy-tlnamKen.js";
import { i as resolveStoredModelOverride, n as normalizeStoredRuntimeModelRef, r as resolveDirectStoredModelOverride, t as isStaleHeartbeatAutoFallbackOverride } from "./stored-model-override-7d8IMDiz.js";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot } from "./session-snapshot-merge-Bi3PsSDQ.js";
import { t as clearSessionAuthProfileOverride } from "./session-override-Bt9HxG2P.js";
import "./model-selection-directive-DM5duJPs.js";
import "./model-selection-context-C-xXzj1B.js";
//#region src/auto-reply/reply/model-runtime-normalization.ts
/** Prepared plugin metadata handoff for runtime model normalization. */
/** Carries the Gateway-owned metadata snapshot through one model-selection run. */
function resolveRuntimeNormalization(cfg) {
	return {
		...RUNTIME_MODEL_VISIBILITY_NORMALIZATION,
		manifestPlugins: getCurrentPluginMetadataSnapshot({
			config: cfg,
			allowWorkspaceScopedSnapshot: true
		})?.plugins
	};
}
function normalizeRuntimeRef(provider, model, normalization = RUNTIME_MODEL_VISIBILITY_NORMALIZATION) {
	return normalizeModelRef(provider, model, normalization);
}
//#endregion
//#region src/auto-reply/reply/model-selection.ts
/** Model selection state for reply runs, including catalog and override handling. */
function resolveConfiguredModelThinkingDefault(raw) {
	if (raw === false || raw === "disabled" || raw === "none") return "off";
	return typeof raw === "string" ? normalizeThinkLevel(raw) : void 0;
}
/** Creates minimal model-selection state for fast test mode. */
function createFastTestModelSelectionState(params) {
	return {
		provider: params.provider,
		model: params.model,
		requestedRouteResolution: "resolved",
		allowedModelKeys: /* @__PURE__ */ new Set(),
		allowedModelCatalog: [],
		policyAliasIndex: {
			byAlias: /* @__PURE__ */ new Map(),
			byKey: /* @__PURE__ */ new Map()
		},
		resetModelOverride: false,
		resetModelOverrideRef: void 0,
		resetModelOverrideReason: void 0,
		modelPolicyConfigPath: void 0,
		modelPolicyRepairConfigPath: void 0,
		resolveThinkingCatalog: async () => [],
		resolveDefaultThinkingLevel: async () => params.agentCfg?.thinkingDefault,
		hasConfiguredThinkingDefault: params.agentCfg?.thinkingDefault !== void 0,
		resolveDefaultReasoningLevel: async () => "off",
		needsModelCatalog: false,
		modelContextWindow: void 0,
		modelContextTokens: void 0
	};
}
const modelCatalogRuntimeLoader = createLazyImportLoader(() => import("./agents/model-catalog.runtime.js"));
const sessionPersistenceRuntimeLoader = createLazyImportLoader(() => import("./session-entry-persistence-BcR19WdB.js"));
function loadPreparedModelCatalogRuntime() {
	return modelCatalogRuntimeLoader.load();
}
function loadSessionPersistenceRuntime() {
	return sessionPersistenceRuntimeLoader.load();
}
function findSelectedCatalogEntry(params) {
	const selectedKey = modelKey(normalizeProviderId(params.provider), params.model);
	return params.catalog?.find((entry) => modelKey(entry.provider, entry.id) === selectedKey);
}
/** Resolves provider/model, allowlist, catalog, and thinking defaults for a reply run. */
async function createModelSelectionState(params) {
	const timingEnabled = isDiagnosticFlagEnabled("ingress.timing", params.cfg);
	const startMs = timingEnabled ? Date.now() : 0;
	const logStage = (stage, extra) => {
		if (!timingEnabled) return;
		const suffix = extra ? ` ${extra}` : "";
		console.log(`[model-selection] session=${params.sessionKey ?? "(no-session)"} stage=${stage} elapsedMs=${Date.now() - startMs}${suffix}`);
	};
	const { cfg, agentCfg, sessionEntry, sessionStore, sessionKey, parentSessionKey, storePath, defaultProvider, defaultModel } = params;
	const catalogAgentId = params.agentId ?? resolveDefaultAgentId(cfg);
	const catalogScope = {
		config: cfg,
		agentId: catalogAgentId,
		agentDir: resolveAgentDir(cfg, catalogAgentId)
	};
	const loadRuntimeCatalogSnapshot = async () => params.loadPreparedModelCatalog ? await params.loadPreparedModelCatalog() : params.preparedModelCatalog ?? (await loadPreparedModelCatalogRuntime()).loadPreparedModelCatalogSnapshot(catalogScope);
	const runtimeModelNormalization = resolveRuntimeNormalization(cfg);
	const { manifestPlugins } = runtimeModelNormalization;
	let { provider, model } = params;
	let requestedRouteResolution = "resolved";
	const primaryProvider = params.primaryProvider ?? defaultProvider;
	const primaryModel = params.primaryModel ?? defaultModel;
	const hasOneTurnModelOverride = params.hasOneTurnModelOverride === true;
	const modelSelectionLocked = sessionEntry?.modelSelectionLocked === true;
	const agentEntry = params.agentId ? resolveAgentConfig(cfg, params.agentId) : void 0;
	let visibilityPolicy = createModelVisibilityPolicy({
		cfg,
		catalog: [],
		defaultProvider,
		defaultModel,
		agentId: params.agentId,
		...runtimeModelNormalization
	});
	const hasAllowlist = !visibilityPolicy.allowAny;
	const hasConfiguredModels = Object.keys(agentCfg?.models ?? {}).length > 0 || Object.keys(agentEntry?.models ?? {}).length > 0;
	const defaultModelVisibleByWildcard = visibilityPolicy.allowsByWildcard({
		provider: defaultProvider,
		model: defaultModel
	});
	const configuredModelCatalog = buildConfiguredModelCatalog({
		cfg,
		manifestPlugins
	});
	const needsModelCatalog = params.hasModelDirective || hasAllowlist && visibilityPolicy.hasProviderWildcards && !defaultModelVisibleByWildcard;
	let allowedModelKeys = /* @__PURE__ */ new Set();
	let allowedModelCatalog = configuredModelCatalog;
	let modelCatalog = null;
	let catalogAuthoritative = true;
	let resetModelOverride = false;
	let resetModelOverrideRef;
	let resetModelOverrideReason;
	const directStoredModelOverride = resolveDirectStoredModelOverride({
		sessionEntry,
		defaultProvider
	});
	const staleHeartbeatAutoFallbackOverride = isStaleHeartbeatAutoFallbackOverride({
		isHeartbeat: params.isHeartbeat,
		hasResolvedHeartbeatModelOverride: params.hasResolvedHeartbeatModelOverride,
		sessionEntry,
		storedOverride: directStoredModelOverride,
		defaultProvider,
		defaultModel,
		primaryProvider: params.primaryProvider,
		primaryModel: params.primaryModel
	});
	const primaryHarnessPolicy = resolveAgentHarnessPolicy({
		provider: primaryProvider,
		modelId: primaryModel,
		config: cfg,
		agentId: params.agentId,
		sessionKey
	});
	const staleLegacyOpenAICodexAutoOverride = directStoredModelOverride?.source === "session" && sessionEntry?.modelOverrideSource === "auto" && normalizeProviderId(directStoredModelOverride.provider ?? "") === "openai" && normalizeProviderId(primaryProvider) === "openai" && primaryHarnessPolicy.runtime === "codex" && normalizeRuntimeRef("openai", directStoredModelOverride.model, runtimeModelNormalization).model === normalizeRuntimeRef("openai", primaryModel, runtimeModelNormalization).model;
	const normalizedCurrentSelection = normalizeRuntimeRef(provider, model, runtimeModelNormalization);
	const normalizedDirectOverride = directStoredModelOverride ? normalizeRuntimeRef(directStoredModelOverride.provider ?? defaultProvider, directStoredModelOverride.model, runtimeModelNormalization) : null;
	const staleLegacyAutoFallbackWithoutOrigin = directStoredModelOverride?.source === "session" && hasLegacyAutoFallbackWithoutOrigin(sessionEntry) && normalizedDirectOverride !== null && modelKey(normalizedCurrentSelection.provider, normalizedCurrentSelection.model) !== modelKey(normalizedDirectOverride.provider, normalizedDirectOverride.model);
	const staleDirectStoredOverride = staleHeartbeatAutoFallbackOverride || staleLegacyOpenAICodexAutoOverride || staleLegacyAutoFallbackWithoutOrigin;
	if (needsModelCatalog) {
		const catalogSnapshot = await loadRuntimeCatalogSnapshot();
		modelCatalog = catalogSnapshot.entries;
		catalogAuthoritative = catalogSnapshot.authoritative !== false;
		logStage("catalog-loaded", `entries=${modelCatalog.length} authoritative=${catalogAuthoritative}`);
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: modelCatalog,
			defaultProvider,
			defaultModel,
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	} else if (hasAllowlist || hasConfiguredModels) {
		visibilityPolicy = createModelVisibilityPolicy({
			cfg,
			catalog: configuredModelCatalog,
			defaultProvider,
			defaultModel,
			agentId: params.agentId,
			...runtimeModelNormalization
		});
		allowedModelCatalog = visibilityPolicy.allowedCatalog;
		allowedModelKeys = visibilityPolicy.allowedKeys;
		logStage("configured-allowlist-built", `allowed=${allowedModelCatalog.length} keys=${allowedModelKeys.size}`);
	} else if (configuredModelCatalog.length > 0) logStage("configured-catalog-ready", `entries=${configuredModelCatalog.length}`);
	if (sessionEntry && sessionStore && sessionKey && directStoredModelOverride && !hasOneTurnModelOverride) {
		const normalizedOverride = normalizeStoredRuntimeModelRef(directStoredModelOverride.provider ?? defaultProvider, directStoredModelOverride.model, cfg, sessionEntry, runtimeModelNormalization);
		const key = modelKey(normalizedOverride.provider, normalizedOverride.model);
		const overrideAllowed = visibilityPolicy.allowsKey(key);
		const shouldResetOverride = (staleDirectStoredOverride || !overrideAllowed) && !modelSelectionLocked;
		if (shouldResetOverride && !staleDirectStoredOverride && !catalogAuthoritative) {
			resetModelOverrideRef = key;
			resetModelOverrideReason = "temporarily-unavailable";
		} else if (shouldResetOverride) {
			const initialSessionEntry = { ...sessionEntry };
			const nextSessionEntry = { ...sessionEntry };
			const { updated } = applyModelOverrideToSessionEntry({
				entry: nextSessionEntry,
				selection: {
					provider: primaryProvider,
					model: primaryModel,
					isDefault: true
				},
				preserveAuthProfileOverride: staleDirectStoredOverride
			});
			let resetApplied = updated;
			if (updated) {
				if (storePath) {
					const { persistReplySessionEntry } = await loadSessionPersistenceRuntime();
					const persistence = await persistReplySessionEntry({
						storePath,
						sessionKey,
						initialEntry: initialSessionEntry,
						entry: nextSessionEntry
					});
					if (persistence.status === "lifecycle-invalidated") throw new SessionWorkStartInvalidatedError(persistence.error);
					const persistedEntry = persistence.entry;
					resetApplied = sessionModelOverrideChangesApplied({
						initial: initialSessionEntry,
						next: nextSessionEntry,
						current: persistedEntry
					});
					adoptPersistedSessionSnapshot(sessionEntry, persistedEntry);
				} else adoptPersistedSessionSnapshot(sessionEntry, nextSessionEntry);
				sessionStore[sessionKey] = sessionEntry;
			}
			resetModelOverride = resetApplied;
			if (resetApplied) {
				resetModelOverrideRef = key;
				resetModelOverrideReason = staleDirectStoredOverride ? "stale" : "disallowed";
			}
		}
	}
	if (staleDirectStoredOverride) {
		if (modelKey(normalizedCurrentSelection.provider, normalizedCurrentSelection.model) === (normalizedDirectOverride ? modelKey(normalizedDirectOverride.provider, normalizedDirectOverride.model) : void 0)) {
			provider = primaryProvider;
			model = primaryModel;
			requestedRouteResolution = "resolved";
		}
	}
	const storedOverride = resolveStoredModelOverride({
		sessionEntry,
		sessionStore,
		sessionKey,
		parentSessionKey,
		defaultProvider
	});
	const skipStoredOverride = params.skipStoredModelOverride === true || hasOneTurnModelOverride || params.hasResolvedHeartbeatModelOverride === true || resetModelOverride && staleDirectStoredOverride && storedOverride?.source === "session";
	if (storedOverride?.model && !skipStoredOverride) {
		const storedProvider = storedOverride.provider || defaultProvider;
		const storedRouteCataloged = Boolean(findSelectedCatalogEntry({
			catalog: modelCatalog ?? allowedModelCatalog,
			provider: storedProvider,
			model: storedOverride.model
		}));
		const storedAlias = storedOverride.routeResolution === "raw" && !storedRouteCataloged ? resolveModelAliasFromPair({
			cfg,
			provider: storedProvider,
			model: storedOverride.model,
			defaultProvider,
			aliasIndex: visibilityPolicy.selectionAliasIndex,
			...runtimeModelNormalization
		}) : null;
		const normalizedStoredOverride = normalizeStoredRuntimeModelRef(storedAlias?.provider ?? storedProvider, storedAlias?.model ?? storedOverride.model, cfg, sessionEntry, runtimeModelNormalization);
		const key = modelKey(normalizedStoredOverride.provider, normalizedStoredOverride.model);
		if (modelSelectionLocked || visibilityPolicy.allowsKey(key)) {
			provider = normalizedStoredOverride.provider;
			model = normalizedStoredOverride.model;
			requestedRouteResolution = storedAlias || storedRouteCataloged ? "resolved" : storedOverride.routeResolution;
		}
	}
	if (!(params.hasModelDirective || hasOneTurnModelOverride || modelSelectionLocked)) {
		const unresolvedSelectionKey = modelKey(provider, model);
		const allowedInitialSelection = visibilityPolicy.resolveSelection({
			provider,
			model
		});
		if (!allowedInitialSelection) {
			const policyPath = visibilityPolicy.allowConfigPath ?? "modelPolicy.allow";
			throw new Error(`Configured default model "${modelKey(provider, model)}" is not allowed by ${policyPath}, and no allowed model is available.`);
		}
		provider = allowedInitialSelection.provider;
		model = allowedInitialSelection.model;
		if (modelKey(provider, model) !== unresolvedSelectionKey) requestedRouteResolution = "resolved";
	}
	if (!params.skipStoredModelOverride && sessionEntry && sessionStore && sessionKey && sessionEntry.authProfileOverride) {
		const { ensureAuthProfileStore } = await import("./agents/auth-profiles.runtime.js");
		const store = ensureAuthProfileStore(void 0, { allowKeychainPrompt: false });
		logStage("auth-profile-store-loaded", `profiles=${Object.keys(store.profiles).length}`);
		const profile = store.profiles[sessionEntry.authProfileOverride];
		const harnessPolicy = resolveAgentHarnessPolicy({
			provider,
			modelId: model,
			config: cfg,
			agentId: params.agentId,
			sessionKey
		});
		const acceptedAuthProviders = listOpenAIAuthProfileProvidersForAgentRuntime({
			provider,
			harnessRuntime: harnessPolicy.runtime,
			config: cfg
		}).map(normalizeProviderId);
		if (!(profile != null && acceptedAuthProviders.some((accepted) => isStoredCredentialCompatibleWithAuthProvider({
			cfg,
			provider: accepted,
			credential: profile
		})))) await clearSessionAuthProfileOverride({
			sessionEntry,
			sessionStore,
			sessionKey,
			storePath
		});
	}
	let thinkingCatalog;
	let manifestModelCatalog = null;
	const buildThinkingCatalog = (catalog) => createModelVisibilityPolicy({
		cfg,
		catalog,
		defaultProvider,
		defaultModel,
		agentId: params.agentId,
		...runtimeModelNormalization
	}).allowedCatalog;
	const loadManifestCatalog = async () => {
		if (manifestModelCatalog) return manifestModelCatalog;
		const { loadManifestModelCatalog } = await loadPreparedModelCatalogRuntime();
		manifestModelCatalog = loadManifestModelCatalog({
			config: cfg,
			fallbackToMetadataScan: false
		});
		logStage("manifest-catalog-loaded", `entries=${manifestModelCatalog.length}`);
		return manifestModelCatalog;
	};
	const resolveThinkingCatalog = async () => {
		if (thinkingCatalog) return thinkingCatalog;
		let catalogForThinking = allowedModelCatalog.length > 0 ? allowedModelCatalog : modelCatalog && modelCatalog.length > 0 ? buildThinkingCatalog(modelCatalog) : [];
		let selectedCatalogEntry = findSelectedCatalogEntry({
			catalog: catalogForThinking,
			provider,
			model
		});
		if (!modelCatalog && selectedCatalogEntry?.reasoning === void 0) {
			const manifestCatalog = buildThinkingCatalog(await loadManifestCatalog());
			const manifestSelectedEntry = findSelectedCatalogEntry({
				catalog: manifestCatalog,
				provider,
				model
			});
			if (manifestSelectedEntry?.reasoning !== void 0) {
				catalogForThinking = manifestCatalog;
				selectedCatalogEntry = manifestSelectedEntry;
			}
		}
		if (!modelCatalog && (!selectedCatalogEntry || selectedCatalogEntry.reasoning === void 0)) {
			modelCatalog = (await loadRuntimeCatalogSnapshot()).entries;
			logStage("catalog-loaded-for-thinking", `entries=${modelCatalog.length}`);
			const runtimeCatalog = buildThinkingCatalog(modelCatalog);
			catalogForThinking = findSelectedCatalogEntry({
				catalog: runtimeCatalog,
				provider,
				model
			}) || !catalogForThinking || catalogForThinking.length === 0 ? runtimeCatalog.length > 0 ? runtimeCatalog : allowedModelCatalog : allowedModelCatalog;
		}
		thinkingCatalog = catalogForThinking.length > 0 ? catalogForThinking : void 0;
		return thinkingCatalog;
	};
	const defaultThinkingLevels = /* @__PURE__ */ new Map();
	const resolveDefaultThinkingLevel = async (selection) => {
		const selectedProvider = selection?.provider ?? provider;
		const selectedModel = selection?.model ?? model;
		const cacheKey = `${modelKey(selectedProvider, selectedModel)}\0${selection?.agentRuntime ?? ""}`;
		const cached = defaultThinkingLevels.get(cacheKey);
		if (cached) return cached;
		const agentThinkingDefault = agentEntry?.thinkingDefault;
		if (agentThinkingDefault) {
			defaultThinkingLevels.set(cacheKey, agentThinkingDefault);
			return agentThinkingDefault;
		}
		const configuredModels = cfg.agents?.defaults?.models;
		const canonicalKey = modelKey(selectedProvider, selectedModel);
		const legacyKey = legacyModelKey(selectedProvider, selectedModel);
		const resolvedConfiguredModelThinkingDefault = resolveConfiguredModelThinkingDefault(configuredModels?.[canonicalKey]?.params?.thinking ?? (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0));
		if (resolvedConfiguredModelThinkingDefault) {
			defaultThinkingLevels.set(cacheKey, resolvedConfiguredModelThinkingDefault);
			return resolvedConfiguredModelThinkingDefault;
		}
		const configuredThinkingDefault = agentCfg?.thinkingDefault;
		if (configuredThinkingDefault) {
			defaultThinkingLevels.set(cacheKey, configuredThinkingDefault);
			return configuredThinkingDefault;
		}
		const catalogForThinking = await resolveThinkingCatalog();
		const defaultThinkingLevel = resolveThinkingDefault({
			cfg,
			provider: selectedProvider,
			model: selectedModel,
			catalog: catalogForThinking,
			agentRuntime: selection?.agentRuntime
		}) ?? "off";
		defaultThinkingLevels.set(cacheKey, defaultThinkingLevel);
		return defaultThinkingLevel;
	};
	let defaultReasoningLevel;
	const resolveDefaultReasoningLevel = async () => {
		if (defaultReasoningLevel) return defaultReasoningLevel;
		let catalogForReasoning = modelCatalog ?? allowedModelCatalog;
		let selectedReasoningEntry = findSelectedCatalogEntry({
			catalog: catalogForReasoning,
			provider,
			model
		});
		if (!modelCatalog && selectedReasoningEntry?.reasoning === void 0) {
			const manifestCatalog = await loadManifestCatalog();
			const manifestReasoningCatalog = hasAllowlist || hasConfiguredModels ? buildThinkingCatalog(manifestCatalog) : manifestCatalog;
			const manifestSelectedEntry = findSelectedCatalogEntry({
				catalog: manifestReasoningCatalog,
				provider,
				model
			});
			if (manifestSelectedEntry?.reasoning !== void 0) {
				catalogForReasoning = manifestReasoningCatalog;
				selectedReasoningEntry = manifestSelectedEntry;
			}
		}
		if ((!catalogForReasoning || catalogForReasoning.length === 0) && selectedReasoningEntry?.reasoning === void 0) {
			modelCatalog = (await loadRuntimeCatalogSnapshot()).entries;
			logStage("catalog-loaded-for-reasoning", `entries=${modelCatalog.length}`);
			catalogForReasoning = modelCatalog;
		}
		defaultReasoningLevel = resolveReasoningDefault({
			provider,
			model,
			catalog: catalogForReasoning
		});
		return defaultReasoningLevel;
	};
	const selectedCatalogEntry = findSelectedCatalogEntry({
		catalog: modelCatalog ?? allowedModelCatalog,
		provider,
		model
	});
	const configuredModels = cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(provider, model);
	const legacyKey = legacyModelKey(provider, model);
	const configuredModelThinkingDefault = configuredModels?.[canonicalKey]?.params?.thinking ?? (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
	const hasConfiguredThinkingDefault = agentEntry?.thinkingDefault !== void 0 || resolveConfiguredModelThinkingDefault(configuredModelThinkingDefault) !== void 0 || agentCfg?.thinkingDefault !== void 0;
	return {
		provider,
		model,
		requestedRouteResolution,
		allowedModelKeys,
		allowedModelCatalog,
		policyAliasIndex: visibilityPolicy.policyAliasIndex,
		resetModelOverride,
		resetModelOverrideRef,
		resetModelOverrideReason,
		modelPolicyConfigPath: visibilityPolicy.allowConfigPath ?? void 0,
		modelPolicyRepairConfigPath: visibilityPolicy.allowRepairConfigPath,
		resolveThinkingCatalog,
		resolveDefaultThinkingLevel,
		hasConfiguredThinkingDefault,
		resolveDefaultReasoningLevel,
		needsModelCatalog,
		modelContextWindow: selectedCatalogEntry?.contextWindow,
		modelContextTokens: selectedCatalogEntry?.contextTokens
	};
}
//#endregion
export { createModelSelectionState as n, createFastTestModelSelectionState as t };
