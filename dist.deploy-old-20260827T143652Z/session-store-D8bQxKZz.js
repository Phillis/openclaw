import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { l as asNonNegativeFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./defaults-CdX9UGcX.js";
import { at as getCliSessionBinding, en as patchSessionEntryCore, it as clearAllCliSessions, mt as hasNonzeroUsage, pt as deriveSessionTotalTokens } from "./session-accessor-Bi6bzKQE.js";
import { D as resolveMaintenanceConfigFromInput } from "./agent-harness-session-key-BMj1lPtX.js";
import { b as setSessionRuntimeModel } from "./restart-recovery-state-BoowPFT5.js";
import { t as isCliProvider } from "./model-selection-cli-BKHYNvuu.js";
import "./model-selection-CMo6Emvk.js";
import "./sessions-D-jhKYGW.js";
import { r as clearMainSessionRecoveryAfterAgentRun } from "./main-session-recovery-clear-H7IP1700.js";
import { a as setCliSessionBinding, o as setCliSessionId, t as clearCliSession } from "./cli-session-BMkhQ-yp.js";
import { i as projectSessionSnapshotChanges } from "./session-snapshot-merge-Bi3PsSDQ.js";
import { randomUUID } from "node:crypto";
//#region src/agents/command/session-store.ts
/**
* Updates persisted session metadata after agent command runs.
*/
const usageFormatModuleLoader = createLazyImportLoader(() => import("./usage-format-CQ53b74o.js"));
const contextModuleLoader = createLazyImportLoader(() => import("./context-ovgM8-r4.js"));
async function getUsageFormatModule() {
	return await usageFormatModuleLoader.load();
}
async function getContextModule() {
	return await contextModuleLoader.load();
}
function resolvePositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
/** Applies run result metadata, usage, and CLI bindings to a session entry. */
async function updateSessionStoreAfterAgentRun(params) {
	const { cfg, sessionId, sessionKey, storePath, sessionStore, defaultProvider, defaultModel, fallbackProvider, fallbackModel, result } = params;
	const now = Date.now();
	const touchInteraction = params.touchInteraction !== false;
	const touchActivity = params.touchActivity !== false;
	const usage = result.meta.agentMeta?.usage;
	const promptTokens = result.meta.agentMeta?.promptTokens;
	const lastCallUsage = result.meta.agentMeta?.lastCallUsage;
	const compactionTokensAfter = typeof result.meta.agentMeta?.compactionTokensAfter === "number" && Number.isFinite(result.meta.agentMeta.compactionTokensAfter) && result.meta.agentMeta.compactionTokensAfter >= 0 ? Math.floor(result.meta.agentMeta.compactionTokensAfter) : void 0;
	const compactionsThisRun = Math.max(0, result.meta.agentMeta?.compactionCount ?? 0);
	const modelUsed = result.meta.agentMeta?.model ?? fallbackModel ?? defaultModel;
	const providerUsed = result.meta.agentMeta?.provider ?? fallbackProvider ?? defaultProvider;
	const agentHarnessId = normalizeOptionalString(result.meta.agentMeta?.agentHarnessId);
	const runtimeContextTokens = resolvePositiveInteger(result.meta.agentMeta?.contextTokens);
	const contextBudgetStatus = result.meta.agentMeta?.contextBudgetStatus;
	const contextTokens = runtimeContextTokens !== void 0 ? runtimeContextTokens : (await getContextModule()).resolveContextTokensForModel({
		cfg,
		provider: providerUsed,
		model: modelUsed,
		contextTokensOverride: params.contextTokensOverride,
		fallbackContextTokens: 2e5,
		allowAsyncLoad: false
	}) ?? 2e5;
	const preserveUserFacingRunState = params.preserveUserFacingSessionModelState === true;
	const preserveRuntimeModel = params.preserveRuntimeModel === true || preserveUserFacingRunState;
	const hadPreExistingEntry = sessionStore[sessionKey] !== void 0;
	const entry = sessionStore[sessionKey] ?? {
		sessionId,
		updatedAt: now,
		sessionStartedAt: now
	};
	const next = {
		...entry,
		sessionId,
		updatedAt: now,
		sessionStartedAt: entry.sessionId === sessionId ? entry.sessionStartedAt ?? now : now,
		lastInteractionAt: touchInteraction ? now : entry.lastInteractionAt,
		lastActivityAt: touchActivity ? now : entry.lastActivityAt,
		...preserveRuntimeModel ? {} : { contextTokens }
	};
	if (entry.sessionId !== sessionId) {
		delete next.sessionFile;
		next.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		next.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			sessionId
		]));
	}
	if (preserveRuntimeModel) {
		if (entry.model) {
			next.contextTokens = entry.contextTokens;
			if (entry.modelProvider) setSessionRuntimeModel(next, {
				provider: entry.modelProvider,
				model: entry.model
			});
			else next.model = entry.model;
		}
	} else setSessionRuntimeModel(next, {
		provider: providerUsed,
		model: modelUsed
	});
	if (!preserveUserFacingRunState) {
		if (!preserveRuntimeModel) {
			if (agentHarnessId) {
				if (!entry.modelSelectionLocked || entry.agentHarnessId === agentHarnessId) {
					const laneEpoch = entry.agentHarnessLaneEpochs?.[agentHarnessId] ?? randomUUID();
					next.agentHarnessId = agentHarnessId;
					next.agentHarnessEpoch = laneEpoch;
					next.agentHarnessLaneEpochs = {
						...entry.agentHarnessLaneEpochs,
						[agentHarnessId]: laneEpoch
					};
				}
			} else if (result.meta.executionTrace?.runner === "cli") {
				if (!entry.agentHarnessEpoch) next.agentHarnessId = void 0;
			}
		}
		if (!preserveRuntimeModel && isCliProvider(providerUsed, cfg)) {
			const cliSessionBinding = result.meta.agentMeta?.cliSessionBinding;
			if (result.meta.agentMeta?.clearCliSessionBinding === true) clearCliSession(next, providerUsed);
			else if (cliSessionBinding?.sessionId?.trim()) setCliSessionBinding(next, providerUsed, cliSessionBinding);
			else {
				const cliSessionId = result.meta.agentMeta?.sessionId?.trim();
				if (cliSessionId) setCliSessionId(next, providerUsed, cliSessionId);
			}
		}
		next.abortedLastRun = result.meta.aborted ?? false;
		clearMainSessionRecoveryAfterAgentRun(next, params.clearRestartRecoveryForceSafeTools);
		if (result.meta.systemPromptReport) next.systemPromptReport = result.meta.systemPromptReport;
		if (!preserveRuntimeModel) next.contextBudgetStatus = contextBudgetStatus;
	}
	if (hasNonzeroUsage(usage) && !preserveUserFacingRunState) {
		const { estimateUsageCost, resolveModelCostConfig } = await getUsageFormatModule();
		const input = usage.input ?? 0;
		const output = usage.output ?? 0;
		const totalTokens = deriveSessionTotalTokens({
			lastCallUsage,
			contextTokens,
			promptTokens
		});
		const runEstimatedCostUsd = asNonNegativeFiniteNumber(estimateUsageCost({
			usage,
			cost: resolveModelCostConfig({
				provider: providerUsed,
				model: modelUsed,
				config: cfg,
				agentDir: params.agentDir
			})
		}));
		next.inputTokens = input;
		next.outputTokens = output;
		const hasUsageTotalTokens = typeof totalTokens === "number" && Number.isFinite(totalTokens) && totalTokens > 0;
		const useCompactionSnapshot = compactionTokensAfter !== void 0 && !hasUsageTotalTokens;
		if (useCompactionSnapshot) {
			next.totalTokens = compactionTokensAfter;
			next.totalTokensFresh = true;
			next.totalTokensVersion = 1;
			next.inputTokens = void 0;
			next.outputTokens = void 0;
			next.cacheRead = void 0;
			next.cacheWrite = void 0;
			next.contextBudgetStatus = void 0;
		} else if (hasUsageTotalTokens) {
			next.totalTokens = totalTokens;
			next.totalTokensFresh = true;
			next.totalTokensVersion = 1;
		} else {
			next.totalTokens = void 0;
			next.totalTokensFresh = false;
			next.totalTokensVersion = void 0;
		}
		if (!useCompactionSnapshot) {
			next.cacheRead = usage.cacheRead ?? 0;
			next.cacheWrite = usage.cacheWrite ?? 0;
		}
		if (runEstimatedCostUsd !== void 0) next.estimatedCostUsd = runEstimatedCostUsd;
	} else if (compactionTokensAfter !== void 0 && !preserveUserFacingRunState) {
		next.totalTokens = compactionTokensAfter;
		next.totalTokensFresh = true;
		next.totalTokensVersion = 1;
		next.inputTokens = void 0;
		next.outputTokens = void 0;
		next.cacheRead = void 0;
		next.cacheWrite = void 0;
		next.contextBudgetStatus = void 0;
	} else if (!preserveUserFacingRunState && typeof entry.totalTokens === "number" && Number.isFinite(entry.totalTokens) && entry.totalTokens > 0) {
		next.totalTokens = entry.totalTokens;
		next.totalTokensFresh = false;
		next.totalTokensVersion = void 0;
	}
	if (compactionsThisRun > 0 && !preserveUserFacingRunState) next.compactionCount = (entry.compactionCount ?? 0) + compactionsThisRun;
	const metadataPatch = preserveUserFacingRunState ? {
		updatedAt: next.updatedAt,
		...touchInteraction ? { lastInteractionAt: next.lastInteractionAt } : {}
	} : next;
	const maintenanceConfig = resolveMaintenanceConfigFromInput(cfg.session?.maintenance);
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (!context.existingEntry && hadPreExistingEntry || !preserveUserFacingRunState && context.existingEntry && context.existingEntry.sessionId !== entry.sessionId) return null;
		return preserveUserFacingRunState ? metadataPatch : projectSessionSnapshotChanges({
			initial: entry,
			next,
			current: currentEntry,
			reassertAbortedLastRun: result.meta.aborted === true
		});
	}, {
		...preserveUserFacingRunState ? {} : { fallbackEntry: entry },
		maintenanceConfig
	});
	if (persisted) sessionStore[sessionKey] = persisted;
}
/** Clears a stored CLI session binding after a failed or invalidated run. */
async function clearCliSessionInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedSessionId, expectedCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry) return;
	let didClear = false;
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (expectedSessionId && (!context.existingEntry || currentEntry.sessionId !== expectedSessionId)) return null;
		if (expectedCliSessionId && getCliSessionBinding(currentEntry, provider)?.sessionId !== expectedCliSessionId) return null;
		const next = { ...currentEntry };
		clearCliSession(next, provider);
		next.updatedAt = Date.now();
		didClear = true;
		return next;
	}, { fallbackEntry: entry });
	if (persisted && didClear) {
		sessionStore[sessionKey] = persisted;
		return persisted;
	}
}
/** Clears the one-shot fork marker before the resumed CLI process starts. */
async function consumeCliSessionForkInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	const binding = entry?.cliSessionBindings?.[provider];
	if (!entry || binding?.sessionId !== expectedCliSessionId || binding.forkNextResume !== true) return;
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry) => {
		const currentBinding = currentEntry.cliSessionBindings?.[provider];
		if (currentBinding?.sessionId !== expectedCliSessionId || currentBinding.forkNextResume !== true) return null;
		const next = { ...currentEntry };
		const { forkNextResume: _forkNextResume, ...consumedBinding } = currentBinding;
		setCliSessionBinding(next, provider, consumedBinding);
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
/** Arms a fork marker for recovery, or re-arms one after a failed CLI turn. */
async function restoreCliSessionForkInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	const binding = entry?.cliSessionBindings?.[provider];
	if (!entry || binding?.sessionId !== expectedCliSessionId || binding.forkNextResume === true) return;
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry) => {
		const currentBinding = currentEntry.cliSessionBindings?.[provider];
		if (currentBinding?.sessionId !== expectedCliSessionId || currentBinding.forkNextResume === true) return null;
		const next = { ...currentEntry };
		setCliSessionBinding(next, provider, {
			...currentBinding,
			forkNextResume: true
		});
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
/** Rebinds a claimed fork to its successor before the rest of the CLI turn can fail. */
async function persistCliSessionForkSuccessorInStore(params) {
	const { provider, sessionKey, sessionStore, storePath, expectedCliSessionId, successorCliSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry || successorCliSessionId === expectedCliSessionId) return;
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry) => {
		const currentBinding = currentEntry.cliSessionBindings?.[provider];
		if (currentBinding?.sessionId !== expectedCliSessionId || currentBinding.forkNextResume === true) return null;
		const next = { ...currentEntry };
		setCliSessionBinding(next, provider, {
			...currentBinding,
			sessionId: successorCliSessionId,
			forceReuse: true
		});
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
/** Records CLI compaction metadata on the persisted session entry. */
async function recordCliCompactionInStore(params) {
	const { compactionKind, sessionKey, sessionStore, storePath, expectedSessionId } = params;
	const entry = sessionStore[sessionKey];
	if (!entry) return;
	const next = { ...entry };
	if (compactionKind === "context-engine") clearAllCliSessions(next);
	next.compactionCount = (entry.compactionCount ?? 0) + 1;
	next.updatedAt = Date.now();
	const newSessionId = normalizeOptionalString(params.newSessionId);
	if (newSessionId && newSessionId !== entry.sessionId) {
		delete next.sessionFile;
		next.sessionId = newSessionId;
		next.usageFamilyKey = entry.usageFamilyKey ?? sessionKey;
		next.usageFamilySessionIds = Array.from(/* @__PURE__ */ new Set([
			...entry.usageFamilySessionIds ?? [],
			entry.sessionId,
			newSessionId
		]));
	}
	const tokensAfterCompaction = asNonNegativeFiniteNumber(params.tokensAfter);
	next.contextBudgetStatus = void 0;
	next.inputTokens = void 0;
	next.outputTokens = void 0;
	next.cacheRead = void 0;
	next.cacheWrite = void 0;
	if (tokensAfterCompaction !== void 0) {
		next.totalTokens = Math.floor(tokensAfterCompaction);
		next.totalTokensFresh = true;
		next.totalTokensVersion = 1;
	} else {
		next.totalTokensFresh = false;
		next.totalTokensVersion = void 0;
	}
	const persisted = await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (currentEntry, context) => {
		if (expectedSessionId && (!context.existingEntry || currentEntry.sessionId !== expectedSessionId)) return null;
		return next;
	}, { fallbackEntry: entry });
	if (persisted) sessionStore[sessionKey] = persisted;
	return persisted ?? void 0;
}
//#endregion
export { restoreCliSessionForkInStore as a, recordCliCompactionInStore as i, consumeCliSessionForkInStore as n, updateSessionStoreAfterAgentRun as o, persistCliSessionForkSuccessorInStore as r, clearCliSessionInStore as t };
