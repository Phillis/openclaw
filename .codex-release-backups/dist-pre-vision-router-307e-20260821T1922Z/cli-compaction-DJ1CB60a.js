import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { c as resolveContextEngine } from "./registry-BcgtD5p6.js";
import { g as resolveFreshSessionTotalTokens } from "./restart-recovery-state-BoowPFT5.js";
import { t as SessionManager } from "./session-manager-Clz4xunQ.js";
import { i as resolveCliBackendConfig } from "./cli-backends-Ap-awZem.js";
import { t as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-Cn8ZZVnY.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cwp3tDCy.js";
import { b as compactWithSafetyTimeout, x as resolveCompactionTimeoutMs, y as compactContextEngineWithSafetyTimeout } from "./diagnostic-CV4vi0UN.js";
import { x as createPreparedEmbeddedAgentSettingsManager } from "./builtin-openclaw-B7zVdTs_.js";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.js";
import { f as buildContextEngineRuntimeSettings, u as runContextEngineMaintenance } from "./agent-end-side-effects-PZYoOs99.js";
import "./transcript-visibility-Nr9sDcy6.js";
import { h as shouldPreemptivelyCompactBeforePrompt } from "./settled-turn-finalization-result-Duat7t1d.js";
import { i as resolveLiveToolResultMaxChars } from "./tool-result-limits-DISobJ_J.js";
import { p as buildEmbeddedCompactionRuntimeContext } from "./attempt-prompt-helpers-CUWaUsGQ.js";
import { t as ensureContextEnginesInitialized } from "./init-0ay_bAJJ.js";
import { o as resolveEffectiveCompactionMode, r as applyAgentAutoCompactionGuard } from "./openclaw-runtime-BAcCVI9V.js";
import { n as maybeCompactAgentHarnessSession, r as isRecoverableNativeHarnessBindingFailure, t as resolveContextEngineCompactionSuccessor } from "./compaction-successor-D8YC3nCs.js";
import { a as isBenignCompactionSkipResult, i as isBenignCompactionSkipReason } from "./compact-reasons-D69aGDYv.js";
import { i as recordCliCompactionInStore, t as clearCliSessionInStore } from "./session-store-CXDk1Jvg.js";
//#region src/agents/command/cli-compaction.ts
/**
* CLI turn compaction lifecycle.
*
* This module decides when CLI-backed sessions need context compaction, chooses
* native harness or context-engine compaction, and records resulting session state.
*/
const CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON = "codex app-server owns automatic compaction";
const log = createSubsystemLogger("agents/cli-compaction");
const cliCompactionDeps = {
	openSessionManager: (target) => SessionManager.open(target),
	ensureContextEnginesInitialized,
	resolveContextEngine,
	createPreparedEmbeddedAgentSettingsManager,
	applyAgentAutoCompactionGuard,
	shouldPreemptivelyCompactBeforePrompt,
	resolveLiveToolResultMaxChars,
	runContextEngineMaintenance,
	loadAgentRuntimePluginRegistryHandle,
	ensureSelectedAgentHarnessPlugin,
	maybeCompactAgentHarnessSession,
	clearCliSessionInStore,
	resolveCliBackendConfig,
	recordCliCompactionInStore
};
/** Overrides CLI compaction dependencies for focused tests. */
function setCliCompactionTestDeps(overrides) {
	Object.assign(cliCompactionDeps, overrides);
}
/** Restores production CLI compaction dependencies after tests. */
function resetCliCompactionTestDeps() {
	Object.assign(cliCompactionDeps, {
		openSessionManager: (target) => SessionManager.open(target),
		ensureContextEnginesInitialized,
		resolveContextEngine,
		createPreparedEmbeddedAgentSettingsManager,
		applyAgentAutoCompactionGuard,
		shouldPreemptivelyCompactBeforePrompt,
		resolveLiveToolResultMaxChars,
		runContextEngineMaintenance,
		loadAgentRuntimePluginRegistryHandle,
		ensureSelectedAgentHarnessPlugin,
		maybeCompactAgentHarnessSession,
		clearCliSessionInStore,
		resolveCliBackendConfig,
		recordCliCompactionInStore
	});
}
function resolvePositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.floor(value);
}
function getSessionBranchMessages(sessionManager) {
	return sessionManager.getBranch().flatMap((entry) => entry.type === "message" && typeof entry.message === "object" && entry.message !== null ? [entry.message] : []);
}
function resolveSessionTokenSnapshot(sessionEntry) {
	return resolvePositiveInteger(resolveFreshSessionTotalTokens(sessionEntry));
}
function isNativeHarnessCompactionSession(sessionEntry, provider) {
	const harnessId = sessionEntry?.agentHarnessId?.trim().toLowerCase();
	if (!harnessId || normalizeOptionalAgentRuntimeId(harnessId) === "openclaw") return false;
	const providerId = provider.trim().toLowerCase();
	return harnessId === providerId || harnessId === "copilot" && providerId === "github-copilot" || harnessId === "codex" && (providerId === "codex" || providerId === "openai");
}
function isUnsupportedNativeHarnessCompaction(result) {
	return result?.ok === false && result.failure?.reason === "unsupported_harness_compaction";
}
function isIntentionalNativeAutoCompactionSkip(result) {
	return result?.ok === true && !result.compacted && result.reason === CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON;
}
function readAgentIdFromSessionKey(sessionKey) {
	const parts = sessionKey.trim().split(":");
	return parts[0] === "agent" && parts[1]?.trim() ? parts[1].trim() : void 0;
}
function buildCliCompactionRuntimeContext(params) {
	return {
		...buildEmbeddedCompactionRuntimeContext({
			sessionKey: params.sessionKey,
			messageChannel: params.messageChannel,
			messageProvider: params.messageChannel,
			agentAccountId: params.agentAccountId,
			authProfileId: params.authProfileId,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			config: params.cfg,
			skillsSnapshot: params.skillsSnapshot,
			senderIsOwner: params.senderIsOwner,
			provider: params.provider,
			modelId: params.model,
			harnessRuntime: params.harnessRuntime,
			modelSelectionLocked: params.modelSelectionLocked,
			thinkLevel: params.thinkLevel,
			extraSystemPrompt: params.extraSystemPrompt
		}),
		currentTokenCount: params.currentTokenCount,
		tokenBudget: params.contextTokenBudget,
		trigger: params.trigger
	};
}
async function compactCliTranscript(params) {
	const runtimeContext = buildCliCompactionRuntimeContext({
		sessionKey: params.sessionKey,
		messageChannel: params.messageChannel,
		agentAccountId: params.agentAccountId,
		authProfileId: params.authProfileId,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd,
		agentDir: params.agentDir,
		cfg: params.cfg,
		skillsSnapshot: params.skillsSnapshot,
		senderIsOwner: params.senderIsOwner,
		provider: params.provider,
		model: params.model,
		harnessRuntime: params.harnessRuntime,
		modelSelectionLocked: params.modelSelectionLocked,
		thinkLevel: params.thinkLevel,
		extraSystemPrompt: params.extraSystemPrompt,
		currentTokenCount: params.currentTokenCount,
		contextTokenBudget: params.contextTokenBudget,
		trigger: "cli_budget"
	});
	const runtimeSettings = buildContextEngineRuntimeSettings({
		contextEngineHost: buildGenericCliContextEngineHostSupport({
			backendId: params.provider,
			capabilities: ["compact", "maintain"]
		}),
		provider: params.provider,
		requestedModel: params.model,
		resolvedModel: params.model,
		selectedContextEngineId: params.contextEngine.info.id,
		contextEngineSelectionSource: "configured",
		promptTokenBudget: params.contextTokenBudget
	});
	let compactResult;
	try {
		compactResult = await compactContextEngineWithSafetyTimeout(params.contextEngine, {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: {
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				...params.storePath ? { storePath: params.storePath } : {}
			},
			tokenBudget: params.contextTokenBudget,
			currentTokenCount: params.currentTokenCount,
			force: true,
			compactionTarget: "budget",
			runtimeContext,
			runtimeSettings
		}, resolveCompactionTimeoutMs(params.cfg));
	} catch (error) {
		const reason = error instanceof Error ? error.message : String(error);
		if (isBenignCompactionSkipReason(reason)) {
			log.info(`CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		log.warn(`CLI transcript compaction failed for ${params.provider}/${params.model}: ${reason}`);
		return {
			compacted: false,
			failureReason: reason
		};
	}
	if (!compactResult.ok || !compactResult.compacted) {
		const reason = compactResult.reason;
		if (isBenignCompactionSkipResult(compactResult)) {
			log.info(`CLI transcript compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		log.warn(`CLI transcript compaction did not reduce context for ${params.provider}/${params.model}: ${reason ?? "compaction did not reduce context"}`);
		return {
			compacted: false,
			failureReason: compactResult.reason ?? "compaction did not reduce context"
		};
	}
	const result = compactResult.result;
	const hasSuccessor = Boolean(result?.sessionTarget || result?.sessionId || result?.sessionFile);
	const successor = await resolveContextEngineCompactionSuccessor({
		config: params.cfg,
		currentSessionFile: params.sessionFile,
		currentTarget: {
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			storePath: params.storePath
		},
		result: compactResult
	});
	try {
		await cliCompactionDeps.runContextEngineMaintenance({
			contextEngine: params.contextEngine,
			sessionId: successor.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: successor.sessionFile,
			sessionTarget: hasSuccessor ? successor.sessionTarget : void 0,
			reason: "compaction",
			sessionManager: params.sessionManager,
			runtimeContext,
			runtimeSettings,
			config: params.cfg
		});
	} catch (error) {
		if (!params.bestEffortMaintenance) throw error;
		log.warn(`CLI transcript compaction maintenance failed after fallback for ${params.provider}/${params.model}: ${error instanceof Error ? error.message : String(error)}`);
	}
	return {
		compacted: true,
		...hasSuccessor ? {
			successorSessionFile: successor.sessionFile,
			successorSessionId: successor.sessionId
		} : {},
		...result?.tokensAfter !== void 0 ? { tokensAfter: result.tokensAfter } : {}
	};
}
async function compactNativeHarnessCliTranscript(params) {
	let result;
	try {
		const sessionAgentId = readAgentIdFromSessionKey(params.sessionKey);
		const nativeHarnessId = params.sessionEntry.agentHarnessId?.trim();
		const modelSelectionLocked = params.sessionEntry.modelSelectionLocked === true;
		const authProfileId = params.sessionEntry.authProfileOverride?.trim() || void 0;
		const pluginRegistry = cliCompactionDeps.loadAgentRuntimePluginRegistryHandle({
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			allowGatewaySubagentBinding: true,
			selections: [{
				provider: params.provider,
				modelId: params.model,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				...nativeHarnessId ? { runtime: nativeHarnessId } : {}
			}]
		});
		result = await withPluginRuntimeRegistryScope(pluginRegistry, async () => {
			await cliCompactionDeps.ensureSelectedAgentHarnessPlugin({
				provider: params.provider,
				modelId: params.model,
				config: params.cfg,
				sessionKey: params.sessionKey,
				workspaceDir: params.workspaceDir,
				...sessionAgentId ? { agentId: sessionAgentId } : {},
				...nativeHarnessId ? { agentHarnessRuntimeOverride: nativeHarnessId } : {},
				pluginRegistry
			});
			return await compactWithSafetyTimeout((abortSignal) => cliCompactionDeps.maybeCompactAgentHarnessSession({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				sessionFile: params.sessionFile,
				workspaceDir: params.workspaceDir,
				cwd: params.cwd,
				agentDir: params.agentDir,
				config: params.cfg,
				skillsSnapshot: params.skillsSnapshot,
				provider: params.provider,
				model: params.model,
				authProfileId,
				contextTokenBudget: params.contextTokenBudget,
				currentTokenCount: params.currentTokenCount,
				trigger: "budget",
				force: true,
				messageChannel: params.messageChannel,
				agentAccountId: params.agentAccountId,
				senderIsOwner: params.senderIsOwner,
				thinkLevel: params.thinkLevel,
				extraSystemPrompt: params.extraSystemPrompt,
				modelSelectionLocked,
				allowGatewaySubagentBinding: true,
				...params.contextEngine ? {
					contextEngine: params.contextEngine,
					contextEngineRuntimeContext: buildCliCompactionRuntimeContext({
						sessionKey: params.sessionKey,
						messageChannel: params.messageChannel,
						agentAccountId: params.agentAccountId,
						authProfileId,
						workspaceDir: params.workspaceDir,
						cwd: params.cwd,
						agentDir: params.agentDir,
						cfg: params.cfg,
						skillsSnapshot: params.skillsSnapshot,
						senderIsOwner: params.senderIsOwner,
						provider: params.provider,
						model: params.model,
						harnessRuntime: nativeHarnessId,
						modelSelectionLocked,
						thinkLevel: params.thinkLevel,
						extraSystemPrompt: params.extraSystemPrompt,
						currentTokenCount: params.currentTokenCount,
						contextTokenBudget: params.contextTokenBudget,
						trigger: "cli_native_budget"
					})
				} : {},
				...nativeHarnessId ? { agentHarnessId: nativeHarnessId } : {},
				...abortSignal ? { abortSignal } : {}
			}), resolveCompactionTimeoutMs(params.cfg));
		});
	} catch (error) {
		log.warn(`CLI native harness compaction failed for ${params.provider}/${params.model}: ${error instanceof Error ? error.message : String(error)}`);
		return {
			compacted: false,
			failureReason: error instanceof Error ? error.message : String(error)
		};
	}
	if (!result?.ok || !result.compacted) {
		const reason = result?.reason;
		if (result && isBenignCompactionSkipResult(result)) {
			log.info(`CLI native harness compaction skipped for ${params.provider}/${params.model}: ${reason}`);
			return { compacted: false };
		}
		if (isIntentionalNativeAutoCompactionSkip(result)) {
			log.info(`CLI native harness compaction skipped for ${params.provider}/${params.model}: ${CODEX_APP_SERVER_OWNS_AUTO_COMPACTION_REASON}`);
			return { compacted: false };
		}
		const recoverableBindingFailure = isRecoverableNativeHarnessBindingFailure(result);
		const fallbackToContextEngine = params.sessionEntry.modelSelectionLocked !== true && (isUnsupportedNativeHarnessCompaction(result) || recoverableBindingFailure);
		log.warn(`CLI native harness compaction did not reduce context for ${params.provider}/${params.model}: ${reason}`);
		return {
			compacted: false,
			fallbackToContextEngine,
			clearCliSessionBinding: params.sessionEntry.modelSelectionLocked !== true && recoverableBindingFailure,
			failureReason: result?.reason ?? "native harness compaction did not reduce context"
		};
	}
	return {
		compacted: true,
		result
	};
}
/** Runs pre-turn compaction for a CLI session and returns the updated session entry. */
async function runCliTurnCompactionLifecycle(params) {
	const contextTokenBudget = resolvePositiveInteger(params.sessionEntry?.contextTokens);
	if (!params.storePath || !contextTokenBudget) return params.sessionEntry;
	const sessionManager = cliCompactionDeps.openSessionManager({
		agentId: params.sessionAgentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	});
	const sessionFile = params.sessionKey;
	const settingsManager = await cliCompactionDeps.createPreparedEmbeddedAgentSettingsManager({
		cwd: params.cwd ?? params.workspaceDir,
		agentDir: params.agentDir,
		cfg: params.cfg,
		contextTokenBudget
	});
	const preemptiveCompaction = cliCompactionDeps.shouldPreemptivelyCompactBeforePrompt({
		messages: getSessionBranchMessages(sessionManager),
		prompt: "",
		contextTokenBudget,
		reserveTokens: settingsManager.getCompactionReserveTokens(),
		toolResultMaxChars: cliCompactionDeps.resolveLiveToolResultMaxChars({ contextWindowTokens: contextTokenBudget })
	});
	const tokenSnapshot = resolveSessionTokenSnapshot(params.sessionEntry);
	const currentTokenCount = Math.max(preemptiveCompaction.estimatedPromptTokens, tokenSnapshot ?? 0);
	if (!preemptiveCompaction.shouldCompact && currentTokenCount <= preemptiveCompaction.promptBudgetBeforeReserve) return params.sessionEntry;
	const resolvedBackend = cliCompactionDeps.resolveCliBackendConfig(params.provider, params.cfg);
	const lockedHarnessRuntime = normalizeOptionalAgentRuntimeId(params.sessionEntry?.agentHarnessId);
	if (params.sessionEntry?.modelSelectionLocked === true && lockedHarnessRuntime !== "openclaw" && !isNativeHarnessCompactionSession(params.sessionEntry, params.provider)) throw new Error("CLI compaction cannot replace a model-locked native harness runtime");
	if (resolvedBackend?.ownsNativeCompaction && !isNativeHarnessCompactionSession(params.sessionEntry, params.provider)) {
		log.info(`CLI backend "${params.provider}" owns native compaction — deferring to backend`);
		return params.sessionEntry;
	}
	let compactionKind;
	let contextCompactionOutcome;
	let nativeCompactionResult;
	let useContextEngineCompaction = true;
	let nativeFallbackToContextEngine = false;
	let nativeFallbackNeedsBindingClear = false;
	let resolvedContextEngine;
	let autoCompactionGuardApplied = false;
	const authProfileId = params.sessionEntry?.authProfileOverride?.trim() || void 0;
	const applyAutoCompactionGuard = async (contextEngine) => {
		if (autoCompactionGuardApplied) return;
		autoCompactionGuardApplied = true;
		await cliCompactionDeps.applyAgentAutoCompactionGuard({
			settingsManager,
			contextEngineInfo: contextEngine.info,
			compactionMode: resolveEffectiveCompactionMode(params.cfg)
		});
	};
	if (isNativeHarnessCompactionSession(params.sessionEntry, params.provider)) {
		cliCompactionDeps.ensureContextEnginesInitialized();
		resolvedContextEngine = await cliCompactionDeps.resolveContextEngine(params.cfg);
		await applyAutoCompactionGuard(resolvedContextEngine);
		const nativeOutcome = await compactNativeHarnessCliTranscript({
			cfg: params.cfg,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionFile,
			sessionEntry: params.sessionEntry,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			provider: params.provider,
			model: params.model,
			contextTokenBudget,
			currentTokenCount,
			contextEngine: resolvedContextEngine,
			skillsSnapshot: params.skillsSnapshot,
			messageChannel: params.messageChannel,
			agentAccountId: params.agentAccountId,
			senderIsOwner: params.senderIsOwner,
			thinkLevel: params.thinkLevel,
			extraSystemPrompt: params.extraSystemPrompt
		});
		if (nativeOutcome.compacted) {
			compactionKind = "native-harness";
			nativeCompactionResult = nativeOutcome.result;
			useContextEngineCompaction = false;
		} else if (nativeOutcome.fallbackToContextEngine) {
			nativeFallbackToContextEngine = true;
			nativeFallbackNeedsBindingClear = nativeOutcome.clearCliSessionBinding === true;
		} else if (nativeOutcome.failureReason) throw new Error(`CLI native harness compaction failed for ${params.provider}/${params.model}: ${nativeOutcome.failureReason}`);
		else useContextEngineCompaction = false;
	}
	if (useContextEngineCompaction) {
		if (!resolvedContextEngine) {
			cliCompactionDeps.ensureContextEnginesInitialized();
			resolvedContextEngine = await cliCompactionDeps.resolveContextEngine(params.cfg);
		}
		const contextEngine = resolvedContextEngine;
		await applyAutoCompactionGuard(contextEngine);
		const contextOutcome = await compactCliTranscript({
			agentId: params.sessionAgentId,
			contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionFile,
			sessionManager,
			storePath: params.storePath,
			cfg: params.cfg,
			workspaceDir: params.workspaceDir,
			cwd: params.cwd,
			agentDir: params.agentDir,
			provider: params.provider,
			model: params.model,
			harnessRuntime: params.sessionEntry?.agentHarnessId,
			modelSelectionLocked: params.sessionEntry?.modelSelectionLocked,
			contextTokenBudget,
			currentTokenCount,
			skillsSnapshot: params.skillsSnapshot,
			messageChannel: params.messageChannel,
			agentAccountId: params.agentAccountId,
			authProfileId,
			senderIsOwner: params.senderIsOwner,
			thinkLevel: params.thinkLevel,
			extraSystemPrompt: params.extraSystemPrompt,
			bestEffortMaintenance: nativeFallbackToContextEngine
		});
		contextCompactionOutcome = contextOutcome;
		compactionKind = contextOutcome.compacted ? "context-engine" : void 0;
		if (!compactionKind && contextOutcome.failureReason) throw new Error(`CLI transcript compaction failed for ${params.provider}/${params.model}: ${contextOutcome.failureReason}`);
	}
	if (nativeFallbackNeedsBindingClear && !compactionKind && params.sessionStore) return await cliCompactionDeps.clearCliSessionInStore({
		provider: params.provider,
		sessionKey: params.sessionKey,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		expectedSessionId: params.sessionId
	}) ?? params.sessionEntry;
	if (!compactionKind || !params.sessionStore) return params.sessionEntry;
	return await cliCompactionDeps.recordCliCompactionInStore({
		compactionKind,
		sessionKey: params.sessionKey,
		sessionStore: params.sessionStore,
		storePath: params.storePath,
		tokensAfter: nativeCompactionResult?.result?.tokensAfter ?? contextCompactionOutcome?.tokensAfter,
		newSessionId: nativeCompactionResult?.result?.sessionId ?? contextCompactionOutcome?.successorSessionId,
		expectedSessionId: params.sessionId
	}) ?? params.sessionEntry;
}
//#endregion
export { resetCliCompactionTestDeps, runCliTurnCompactionLifecycle, setCliCompactionTestDeps };
