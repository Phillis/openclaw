import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { C as resolveSessionAuthProfileOverrideSource } from "./agent-scope-BizOtGGz.js";
import { l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { s as normalizeProviderId } from "./model-ref-shared-poyRjWh_.js";
import { _ as isDefaultAgentRuntimeId, c as resolveContextConfigProviderForRuntime, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { n as isThinkingLevelSupported, o as resolveSupportedThinkingLevel } from "./thinking-dphnnN-M.js";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-B4nRkQcs.js";
import { i as resolveSessionRuntimeOverrideForProvider, t as resolveCompatibleAgentRuntimeForProvider } from "./session-runtime-compat-DHBdzKpB.js";
import "./model-selection-Adc4uFq_.js";
import { a as enqueueSystemEvent } from "./system-events-kSFsVzdG.js";
import { s as refreshQueuedFollowupSession } from "./state-Ba38Yboy.js";
import { a as isModelSelectionLocked, t as MODEL_SELECTION_LOCKED_MESSAGE } from "./model-overrides-D4SC_nUZ.js";
import "./queue-BJiyBphu.js";
import { t as triggerSessionPatchHook } from "./session-patch-hooks-CuzKhV90.js";
import { t as applyModelOverrideWithAuthProfileCompatibility } from "./auth-profile-preservation-hfvuGBc2.js";
import { a as sessionModelOverrideChangesApplied, n as adoptPersistedSessionSnapshot, t as SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS } from "./session-snapshot-merge-Bi3PsSDQ.js";
import { t as applyModelRuntimeDirective } from "./directive-handling.model-runtime-Dh7J52dX.js";
import { t as resolveContextTokens } from "./model-selection-context-CGG9FVo3.js";
import { t as persistReplySessionEntry } from "./session-entry-persistence-DpSMYacP.js";
import { t as persistStickyModelSelectionBestEffort } from "./sticky-model-selection-rm9Q5mpe.js";
//#region src/model-picker/apply-session-model-selection.ts
/** Applies the model transaction field family to one caller-owned snapshot. */
function applySessionModelSelectionToEntry(params) {
	const modelChange = applyModelOverrideWithAuthProfileCompatibility({
		cfg: params.cfg,
		agentDir: params.agentDir,
		entry: params.entry,
		currentProvider: params.currentProvider,
		selection: params.request,
		profileOverride: params.request.profileOverride,
		markLiveSwitchPending: params.markLiveSwitchPending
	});
	const runtimeChange = applyModelRuntimeDirective(params.entry, params.runtime);
	return {
		changed: modelChange.updated || runtimeChange.updated,
		...params.runtime.kind === "clear" || params.runtime.kind === "set" ? { runtimeChange: params.runtime } : {}
	};
}
function resolveRuntimeDirective(params) {
	if (params.request.kind === "unchanged") {
		if (params.entry.agentRuntimeOverride?.trim() && !resolveSessionRuntimeOverrideForProvider({
			provider: params.provider,
			entry: params.entry,
			cfg: params.cfg
		})) return { kind: "clear" };
		return params.request;
	}
	if (params.request.kind === "clear") return params.request;
	const runtime = normalizeOptionalAgentRuntimeId(params.request.runtime);
	if (isDefaultAgentRuntimeId(runtime)) return { kind: "clear" };
	const provider = normalizeProviderId(params.provider);
	const compatibleRuntime = resolveCompatibleAgentRuntimeForProvider({
		provider,
		runtime,
		cfg: params.cfg
	});
	return compatibleRuntime ? {
		kind: "set",
		runtime: compatibleRuntime
	} : {
		kind: "invalid",
		message: `Runtime "${params.request.runtime}" is not supported for ${provider || params.provider}.`
	};
}
function formatModelSwitchEvent(provider, model, alias) {
	const label = `${provider}/${model}`;
	return alias ? `Model switched to ${alias} (${label}).` : `Model switched to ${label}.`;
}
function rejectNotAllowed(provider, model) {
	return {
		status: "rejected",
		reason: "not-allowed",
		message: `Model ${provider}/${model} is not available for this agent.`
	};
}
/** Applies one validated picker selection to the authoritative live session. */
async function applySessionModelSelection(params) {
	const startingEntry = params.storePath ? params.sessionEntry : params.sessionStore[params.sessionKey] ?? params.sessionEntry;
	if (isModelSelectionLocked(startingEntry)) return {
		status: "rejected",
		reason: "locked",
		message: MODEL_SELECTION_LOCKED_MESSAGE
	};
	const normalizedModelKey = modelKey(params.request.provider, params.request.model);
	if (params.allowedModelKeys.size > 0 && !params.allowedModelKeys.has(normalizedModelKey) || !params.modelCatalog.some((entry) => modelKey(entry.provider, entry.id) === normalizedModelKey)) return rejectNotAllowed(params.request.provider, params.request.model);
	const request = {
		...params.request,
		isDefault: normalizedModelKey === modelKey(params.defaultProvider, params.defaultModel)
	};
	const runtime = resolveRuntimeDirective({
		cfg: params.cfg,
		entry: startingEntry,
		provider: request.provider,
		request: request.runtime
	});
	if (runtime.kind === "invalid") return {
		status: "rejected",
		reason: "invalid-runtime",
		message: runtime.message
	};
	const initialEntry = { ...startingEntry };
	const nextEntry = { ...startingEntry };
	const applied = applySessionModelSelectionToEntry({
		cfg: params.cfg,
		agentDir: resolveAgentDir(params.cfg, params.agentId),
		entry: nextEntry,
		currentProvider: params.currentProvider,
		request,
		runtime,
		markLiveSwitchPending: params.markLiveSwitchPending
	});
	const thinkingCatalog = params.thinkingCatalog ?? params.modelCatalog;
	const thinkingRuntime = resolveEffectiveAgentRuntime({
		cfg: params.cfg,
		provider: request.provider,
		modelId: request.model,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionEntry: nextEntry
	});
	const currentThinkingLevel = nextEntry.thinkingLevel;
	let thinkingRemap;
	if (currentThinkingLevel && !isThinkingLevelSupported({
		provider: request.provider,
		model: request.model,
		level: currentThinkingLevel,
		catalog: [...thinkingCatalog],
		agentRuntime: thinkingRuntime
	})) {
		const remapped = resolveSupportedThinkingLevel({
			provider: request.provider,
			model: request.model,
			level: currentThinkingLevel,
			catalog: [...thinkingCatalog],
			agentRuntime: thinkingRuntime
		});
		if (remapped !== currentThinkingLevel) {
			nextEntry.thinkingLevel = remapped;
			thinkingRemap = {
				from: currentThinkingLevel,
				to: remapped,
				provider: request.provider,
				model: request.model
			};
		}
	}
	nextEntry.updatedAt = Date.now();
	let persistedEntry;
	if (params.storePath) {
		const persistence = await persistReplySessionEntry({
			storePath: params.storePath,
			sessionKey: params.sessionKey,
			initialEntry,
			entry: nextEntry,
			allowCreate: params.allowCreate,
			reassertLiveModelSwitchPending: applied.changed && nextEntry.liveModelSwitchPending === true,
			requireModelSelectionUnlocked: true,
			touchedFields: SESSION_MODEL_OVERRIDE_TRANSACTION_FIELDS
		});
		if (persistence.entry) {
			params.sessionStore[params.sessionKey] = persistence.entry;
			adoptPersistedSessionSnapshot(params.sessionEntry, persistence.entry);
		}
		if (persistence.status === "model-selection-locked") return {
			status: "rejected",
			reason: "locked",
			message: MODEL_SELECTION_LOCKED_MESSAGE
		};
		if (persistence.status !== "current" || !sessionModelOverrideChangesApplied({
			initial: initialEntry,
			next: nextEntry,
			current: persistence.entry,
			reassertLiveModelSwitchPending: applied.changed && nextEntry.liveModelSwitchPending === true
		})) return {
			status: "conflict",
			message: "Model change was not applied because the session changed. Retry."
		};
		persistedEntry = persistence.entry;
	} else {
		adoptPersistedSessionSnapshot(params.sessionEntry, nextEntry);
		params.sessionStore[params.sessionKey] = params.sessionEntry;
		persistedEntry = params.sessionEntry;
	}
	const provider = request.provider;
	const model = request.model;
	const effectiveModelRef = `${provider}/${model}`;
	const changed = applied.changed || thinkingRemap !== void 0;
	const configuredDefaultUpdate = params.canPersistStickyModelSelection === true && !request.isDefault ? persistStickyModelSelectionBestEffort({
		agentId: params.agentId,
		model: effectiveModelRef
	}) : void 0;
	if (changed) {
		triggerSessionPatchHook({
			cfg: params.cfg,
			sessionEntry: persistedEntry,
			sessionKey: params.sessionKey,
			patch: {
				key: params.sessionKey,
				model: params.patchModel ?? effectiveModelRef
			}
		});
		refreshQueuedFollowupSession({
			key: params.sessionKey,
			nextProvider: provider,
			nextModel: model,
			nextRouteResolution: "resolved",
			nextModelOverrideSource: request.isDefault ? void 0 : "user",
			nextAuthProfileId: persistedEntry.authProfileOverride,
			nextAuthProfileIdSource: resolveSessionAuthProfileOverrideSource(persistedEntry),
			nextThinking: {
				level: persistedEntry.thinkingLevel,
				catalog: [...thinkingCatalog],
				agentRuntime: resolveEffectiveAgentRuntime({
					cfg: params.cfg,
					provider,
					modelId: model,
					agentId: params.agentId,
					sessionKey: params.sessionKey,
					sessionEntry: persistedEntry
				})
			}
		});
	}
	if (`${params.currentProvider}/${params.currentModel}` !== effectiveModelRef) enqueueSystemEvent(formatModelSwitchEvent(provider, model, request.alias), {
		sessionKey: params.sessionKey,
		contextKey: `model:${effectiveModelRef}`
	});
	const selectedCatalogEntry = params.modelCatalog.find((entry) => modelKey(entry.provider, entry.id) === normalizedModelKey);
	const contextProvider = resolveContextConfigProviderForRuntime({
		provider,
		runtimeId: resolveEffectiveAgentRuntime({
			cfg: params.cfg,
			provider,
			modelId: model,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionEntry: persistedEntry
		}),
		config: params.cfg
	});
	return {
		status: "applied",
		provider,
		model,
		effectiveModelRef,
		changed,
		contextTokens: resolveContextTokens({
			cfg: params.cfg,
			agentCfg: params.cfg.agents?.defaults,
			provider: contextProvider,
			model,
			modelContextWindow: selectedCatalogEntry?.contextWindow,
			modelContextTokens: selectedCatalogEntry?.contextTokens
		}),
		...configuredDefaultUpdate ? { configuredDefaultUpdate } : {},
		...applied.runtimeChange ? { runtimeChange: applied.runtimeChange } : {},
		...thinkingRemap ? { thinkingRemap } : {}
	};
}
//#endregion
export { applySessionModelSelection as t };
