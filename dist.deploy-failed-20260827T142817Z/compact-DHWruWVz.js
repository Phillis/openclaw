import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { c as resolveUserPath } from "./home-dir-DcrXWQPU.js";
import "./utils-DEqefz4f.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as resolveAgentModelFallbackValues } from "./model-input-ekSMR50U.js";
import { g as resolveSessionAgentIds, h as resolveSessionAgentId, m as resolveRunModelFallbacksOverride } from "./agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "./agent-scope-config-BdXMWufB.js";
import { a as isSubagentSessionKey, c as parseAgentSessionKey, i as isCronSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { D as freezeDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, w as createDiagnosticTraceContext } from "./diagnostic-events-Djn4AVRp.js";
import { i as generateSecureToken } from "./secure-random-Ds4AFLgz.js";
import { t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-B1YRfQOc.js";
import { _ as isDefaultAgentRuntimeId, i as isOpenAIProvider, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { n as DEFAULT_MODEL, r as DEFAULT_PROVIDER } from "./defaults-CdX9UGcX.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import { n as resolveProviderIdForAuth } from "./provider-auth-aliases-BN9nuenf.js";
import { r as runCommandWithTimeout } from "./exec-BL80Wdzl.js";
import { i as wrapStreamFnTextTransforms } from "./text-transforms.runtime-B6WHs5nn.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-BK7CLYaF.js";
import { a as unwrapSecretSentinelsForProviderEgress, t as protectPreparedProviderRuntimeAuth } from "./provider-secret-egress-Cl2Qy4wH.js";
import { t as getGlobalHookRunner, x as withPluginRuntimeGenerationScope } from "./hook-runner-global-BNCkTxOs.js";
import { n as normalizeMessageChannel } from "./message-channel-core-BDhVfGhd.js";
import "./message-channel-T4W5YOto.js";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { t as emitSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
import { s as listRegisteredPluginAgentPromptGuidance } from "./command-registration-C4qDDcdq.js";
import { Q as resolveChannelMessageToolHints, Z as listChannelSupportedActions, et as resolveChannelReactionGuidance } from "./agent-tools.before-tool-call-aNXucund.js";
import { H as transformProviderSystemPrompt, M as resolveProviderTextTransforms, b as prepareProviderRuntimeAuth } from "./provider-runtime-DStPs6cE.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore } from "./store-DOJuehrg.js";
import { n as extractModelCompat } from "./provider-model-compat-B1p8TIBp.js";
import { Q as parseGitUrl, a as agentSessionAutomaticCompaction, n as createAgentSessionForEmbeddedRunner, st as getModelRegistryRuntime } from "./sessions-CfDirsu7.js";
import { v as estimateTokens } from "./agent-core-r8cobJ0S.js";
import { r as detectRuntimeShell } from "./shell-utils-D4AwY_uT.js";
import { s as sanitizeToolUseResultPairingForModel } from "./ai-transport-runtime-host-CbbOK2Ws.js";
import { t as SessionManager } from "./session-manager-BUfxqRpP.js";
import { t as MissingProviderAuthError } from "./model-auth-runtime-shared-C48YoQY0.js";
import { i as resolveCliBackendConfig } from "./cli-backends-B_2M8BON.js";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-CRHh8KMu.js";
import { c as prepareModelRuntimeSnapshot, t as acquireAgentRunPreparedModelRuntime } from "./prepared-model-runtime-BNByaYVk.js";
import { l as resolveAgentHarnessPreparedAuthSupport, u as resolveAgentHarnessPreparedRouteSupport } from "./thinking-runtime-CvHDRR81.js";
import { n as applyLocalNoAuthHeaderOverride, o as resolveModelAuthMode, t as applyAuthHeaderOverride } from "./model-auth-B7VlMZMb.js";
import { r as resolveOpenClawReferencePaths } from "./docs-path-CIMgdwYZ.js";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-BVWviD3T.js";
import { s as prepareSystemAgentRunAdmission } from "./admitted-run-context-BxSN0sUe.js";
import { a as describeFailoverError, i as coerceToFailoverError } from "./failover-error-EKvoWJQa.js";
import { b as compactWithSafetyTimeout, x as resolveCompactionTimeoutMs } from "./diagnostic-DO3P5TXi.js";
import { t as pickFallbackThinkingLevel } from "./embedded-agent-helpers-djcKKwhg.js";
import { _ as isRealConversationMessage, a as resolveAgentRunSessionTarget, b as setCompactionSafeguardCancelReason, c as isReasoningTagProvider, d as toSessionToolAllowlist, et as flushPendingToolResultsAfterIdle, f as applySystemPromptToSession, g as hasMeaningfulConversationContent, h as buildEmbeddedExtensionFactories, i as applyAgentRunSessionTargetIdentity, it as validateReplayTurns, l as collectAllowedToolNames, m as createEmbeddedAgentResourceLoader, o as buildEmbeddedMessageActionDiscoveryInput, ot as getHistoryLimitFromSessionKey, p as buildEmbeddedSystemPrompt, rt as sanitizeSessionHistory, s as prepareAgentMemoryPrompt, st as limitHistoryTurns, tt as logRuntimeToolSchemaQuarantine, u as collectRegisteredToolNames, x as createPreparedEmbeddedAgentSettingsManager, y as consumeCompactionSafeguardCancelReason } from "./builtin-openclaw-DTeM8adv.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "./diagnostic-llm-content-CAc71KJ1.js";
import { t as isAcpRuntimeSpawnAvailable } from "./availability-B4_z8STG.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks--FUKcLjc.js";
import { t as resolveConversationCapabilityProfile } from "./conversation-capability-profile-Bery-vw5.js";
import { t as createBundleLspToolRuntime } from "./agent-bundle-lsp-runtime-tzxg4Vbd.js";
import { n as createBundleMcpToolRuntime } from "./agent-bundle-mcp-materialize-CsqvVIQf.js";
import "./agent-bundle-mcp-tools-B0z92taC.js";
import { t as log } from "./logger-XkrUQwkD.js";
import { a as resolveBootstrapContextForRun, i as makeBootstrapWarn, s as resolveContextInjectionMode } from "./bootstrap-files-BYIPQKgr.js";
import { n as resolveSkillsPrompt } from "./workspace-skill-prompt-Dr2ICDqe.js";
import { i as resolveEmbeddedRunSkillEntries, n as mapSandboxSkillUsagePaths, r as resolveSandboxSkillRuntimeInputs, t as mapSandboxSkillEntriesForPrompt } from "./sandbox-skills-Blrv2Iv7.js";
import { n as applySkillEnvOverridesFromSnapshot, t as applySkillEnvOverrides } from "./env-overrides-CED9N3NO.js";
import { n as resolveSandboxContext } from "./context-C5jzJkKC.js";
import "./sandbox-CvisDJF6.js";
import { t as applyExtraParamsToAgent } from "./extra-params-Dcj5MiIB.js";
import { n as rewriteTranscriptEntriesInSessionManager } from "./transcript-runtime-state-CWV9RKmB.js";
import { n as mapThinkingLevelForProvider, t as mapThinkingLevel } from "./utils-CefVZRZM.js";
import { _ as resolveEmbeddedCompactionThinkingLevel, b as listActiveProcessSessionReferences, g as resolveEmbeddedCompactionTarget, h as resolveCompactionHarnessRuntime, m as resolveCompactionContextTokenBudget, y as resolveHeartbeatPromptForSystemPrompt } from "./attempt-prompt-helpers-gLglSwD1.js";
import { t as resolveProcessToolScopeKey } from "./bash-process-scope-Bmw8_ghL.js";
import { r as prepareAgentRuntimeAuth } from "./prepare-auth-D74a7V0k.js";
import { t as guardSessionManager } from "./session-tool-result-guard-wrapper-CkaOIree.js";
import { n as filterRuntimeCompatibleTools, t as filterProviderNormalizableTools } from "./tool-schema-projection-ZrMdwk4s.js";
import { t as applyFinalEffectiveToolPolicy } from "./effective-tool-policy-BD0HFSsD.js";
import { i as resolveRuntimeOsLabel } from "./os-summary-q1rQKLEc.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt-thread-helpers-8XoZfu0M.js";
import { a as resolveEmbeddedAgentStreamFn, i as resolveEmbeddedAgentBaseStreamFn, r as resolveEmbeddedAgentApiKey, t as wrapStreamFnWithDiagnosticModelCallEvents } from "./attempt.model-diagnostic-events-Dhn3c4eJ.js";
import { n as resolveSystemPromptRepoRoot, o as resolveAgentPromptSurfaceForSessionKey } from "./system-prompt-params-BCFUhFnY.js";
import { t as resolveMemorySearchConfig } from "./memory-search-C4Fkjiqw.js";
import { i as resolveUserTimezone, t as formatDateStamp } from "./date-time-DeTgYjja.js";
import { a as isSilentOverflowProneModel, i as applyAgentCompactionSettingsFromConfig, o as resolveEffectiveCompactionMode, r as applyAgentAutoCompactionGuard } from "./openclaw-runtime-BIGh2OIC.js";
import { n as prepareWatchedSessionsPrompt } from "./watched-sessions-prompt-DdBrho6A.js";
import { o as prepareEmbeddedSessionActiveProjectKeys } from "./session-prompt-state-6IEK6xZr.js";
import { t as registerProviderStreamForModel } from "./provider-stream-DFoLArnM.js";
import { i as isFallbackSummaryError } from "./model-fallback-attempt-BVsIYD_3.js";
import { t as createOpenClawCodingTools } from "./agent-tools-BkxVdpcN.js";
import { t as runWithModelFallback } from "./model-fallback-runner-7lOT1PJ9.js";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.js";
import { t as splitSdkTools } from "./tool-split-BoVvbhLZ.js";
import { t as getMachineDisplayName } from "./machine-name-Dhnqqwdy.js";
import { n as collectRuntimeChannelCapabilities } from "./system-prompt-report-BrC6a8yX.js";
import { n as getCurrentActiveNodeContext, t as formatActiveNodeContextLabel } from "./active-node-context-_qYwwG99.js";
import { r as resolveEmbeddedSandboxInfoExecPolicy, t as buildEmbeddedSandboxInfo } from "./sandbox-info-BUHh3xtb.js";
import { r as resolveModelAsync } from "./model-BoOus0uf.js";
import { t as materializePreparedRuntimeModel } from "./materialize-model-BwpyFizB.js";
import { c as selectAgentHarness, l as selectAgentHarnessForPreparedModelProviders } from "./selection-BtKGm7U7.js";
import { n as buildAgentRuntimePlan } from "./build-CNCLeebz.js";
import { a as resolveReusableRuntimeModelAuth, r as providerUsesCredentialScopedModelMetadata } from "./credential-scoped-model-BehkTMq1.js";
import { n as resolvePreparedRuntimeModelAuth, t as resolvePreparedRuntimeAuthAttempts } from "./resolve-auth-CXzQN75G.js";
import { n as classifyCompactionReason, o as resolveCompactionFailureReason, r as formatUnknownCompactionReasonDetail } from "./compact-reasons-D69aGDYv.js";
import { i as getActiveMemorySearchManagerCore } from "./memory-runtime-BZttLURQ.js";
import { a as resolveCompactionCheckpointTranscriptPosition, i as readSessionLeafStateFromTranscriptAsync, o as resolveSessionCompactionCheckpointReason, t as createFileBackedCompactionCheckpointStore } from "./session-compaction-checkpoints-Cd3HG7Fd.js";
import os from "node:os";
import path from "node:path";
import fs from "node:fs/promises";
import { captureOpenAIResponsesCompaction, requestPreparedOpenAIResponsesCompaction, resolveOpenAIResponsesCompactEndpointPlan } from "@openclaw/ai/transports";
//#region src/agents/project-memory-scope.ts
const MAX_PROJECT_KEY_CACHE_ENTRIES = 128;
const GIT_CONFIG_TIMEOUT_MS = 4e3;
const projectKeyByRepoRoot = /* @__PURE__ */ new Map();
function escapeProjectKeyForAnnotation(value) {
	return value.replaceAll("%", "%25").replaceAll(";", "%3b").replaceAll("<", "%3c").replaceAll(">", "%3e").replaceAll("\r", "%0d").replaceAll("\n", "%0a");
}
async function resolveUncachedProjectKey(repoRoot) {
	try {
		const result = await runCommandWithTimeout([
			"git",
			"-C",
			repoRoot,
			"config",
			"--get",
			"remote.origin.url"
		], { timeoutMs: GIT_CONFIG_TIMEOUT_MS });
		if (result.code === 0) {
			const source = parseGitUrl(`git:${result.stdout.trim()}`);
			if (source) return escapeProjectKeyForAnnotation(`${source.host.toLowerCase()}/${source.path}`);
		}
	} catch {}
	return `path:${escapeProjectKeyForAnnotation(repoRoot)}`;
}
/** Resolve one stable repository identity without spawning Git again for the same root. */
function resolveProjectKey(repoRoot) {
	const canonicalRoot = path.resolve(repoRoot);
	const cached = projectKeyByRepoRoot.get(canonicalRoot);
	if (cached) {
		projectKeyByRepoRoot.delete(canonicalRoot);
		projectKeyByRepoRoot.set(canonicalRoot, cached);
		return cached;
	}
	const pending = resolveUncachedProjectKey(canonicalRoot);
	projectKeyByRepoRoot.set(canonicalRoot, pending);
	pruneMapToMaxSize(projectKeyByRepoRoot, MAX_PROJECT_KEY_CACHE_ENTRIES);
	return pending;
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-diagnostics.ts
const hasRealConversationContent = isRealConversationMessage;
function createDirectCompactionDiagId() {
	return `cmp-${Date.now().toString(36)}-${generateSecureToken(4)}`;
}
function resolveCompactionProviderStream(params) {
	return registerProviderStreamForModel({
		model: params.effectiveModel,
		cfg: params.config,
		agentDir: params.agentDir,
		workspaceDir: params.effectiveWorkspace,
		apiRegistry: params.apiRegistry
	});
}
function normalizeObservedTokenCount(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function getMessageTextChars(msg) {
	const content = msg.content;
	if (typeof content === "string") return content.length;
	return Array.isArray(content) ? content.reduce((total, block) => {
		const text = block && typeof block === "object" ? block.text : void 0;
		return total + (typeof text === "string" ? text.length : 0);
	}, 0) : 0;
}
function resolveMessageToolLabel(msg) {
	const candidate = msg.toolName ?? msg.name ?? msg.tool;
	return typeof candidate === "string" && candidate.trim().length > 0 ? candidate : void 0;
}
function summarizeCompactionMessages(messages) {
	let historyTextChars = 0;
	let toolResultChars = 0;
	const contributors = [];
	let estTokens = 0;
	let tokenEstimationFailed = false;
	for (const msg of messages) {
		const role = typeof msg.role === "string" ? msg.role : "unknown";
		const chars = getMessageTextChars(msg);
		historyTextChars += chars;
		if (role === "toolResult") toolResultChars += chars;
		contributors.push({
			role,
			chars,
			tool: resolveMessageToolLabel(msg)
		});
		if (!tokenEstimationFailed) try {
			estTokens += estimateTokens(msg);
		} catch {
			tokenEstimationFailed = true;
		}
	}
	return {
		messages: messages.length,
		historyTextChars,
		toolResultChars,
		estTokens: tokenEstimationFailed ? void 0 : estTokens,
		contributors: contributors.toSorted((left, right) => right.chars - left.chars).slice(0, 3)
	};
}
function containsRealConversationMessages(messages) {
	return messages.some((message, index, allMessages) => hasRealConversationContent(message, allMessages, index));
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-hooks.ts
function resolvePostCompactionIndexSyncMode(config) {
	const mode = config?.agents?.defaults?.compaction?.postIndexSync;
	if (mode === "off" || mode === "async" || mode === "await") return mode;
	return "async";
}
async function runPostCompactionSessionMemorySync(params) {
	if (!params.config) return;
	try {
		const sessionFile = params.sessionFile.trim();
		if (!sessionFile) return;
		const agentId = resolveSessionAgentId({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		const resolvedMemory = resolveMemorySearchConfig(params.config, agentId);
		if (!resolvedMemory || !resolvedMemory.sources.includes("sessions")) return;
		if (!resolvedMemory.sync.sessions.postCompactionForce) return;
		const { manager } = await getActiveMemorySearchManagerCore({
			cfg: params.config,
			agentId
		});
		if (!manager?.sync) return;
		const sessionId = params.sessionId?.trim();
		await manager.sync({
			reason: "post-compaction",
			...sessionId ? { sessions: [{
				agentId,
				sessionId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {}
			}] } : { archiveFiles: [sessionFile] }
		});
	} catch (err) {
		log.warn(`memory sync skipped (post-compaction): ${formatErrorMessage(err)}`);
	}
}
function syncPostCompactionSessionMemory(params) {
	if (params.mode === "off" || !params.config) return Promise.resolve();
	const syncTask = runPostCompactionSessionMemorySync({
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId,
		sessionFile: params.sessionFile
	});
	if (params.mode === "await") return syncTask;
	return Promise.resolve();
}
/** Emits post-compaction transcript and memory-index side effects for a compacted session file. */
async function runPostCompactionSideEffects(params) {
	const sessionFile = params.sessionFile.trim();
	if (!sessionFile) return;
	emitSessionTranscriptUpdate({
		sessionFile,
		sessionKey: params.sessionKey,
		...params.sessionId ? { sessionId: params.sessionId } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
	await syncPostCompactionSessionMemory({
		config: params.config,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		agentId: params.agentId,
		sessionFile,
		mode: resolvePostCompactionIndexSyncMode(params.config)
	});
}
/** Converts the global hook runner into the compaction-specific hook shape. */
function asCompactionHookRunner(hookRunner) {
	if (!hookRunner) return null;
	return {
		hasHooks: (hookName) => hookRunner.hasHooks?.(hookName) ?? false,
		runBeforeCompaction: hookRunner.runBeforeCompaction?.bind(hookRunner),
		runAfterCompaction: hookRunner.runAfterCompaction?.bind(hookRunner)
	};
}
function estimateTokenCountSafe(messages, estimateTokensFn) {
	try {
		let total = 0;
		for (const message of messages) total += estimateTokensFn(message);
		return total;
	} catch {
		return;
	}
}
/** Builds before-hook metrics while tolerating providers that cannot estimate all messages. */
function buildBeforeCompactionHookMetrics(params) {
	return {
		messageCountOriginal: params.originalMessages.length,
		tokenCountOriginal: estimateTokenCountSafe(params.originalMessages, params.estimateTokensFn),
		messageCountBefore: params.currentMessages.length,
		tokenCountBefore: params.observedTokenCount ?? estimateTokenCountSafe(params.currentMessages, params.estimateTokensFn)
	};
}
/** Runs internal and plugin before-compaction hooks, forwarding hook-produced messages. */
async function runBeforeCompactionHooks(params) {
	const missingSessionKey = false;
	const hookSessionKey = params.sessionKey;
	try {
		const hookEvent = createInternalHookEvent("session", "compact:before", hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey,
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore,
			messageCountOriginal: params.metrics.messageCountOriginal,
			tokenCountOriginal: params.metrics.tokenCountOriginal
		});
		await triggerInternalHook(hookEvent);
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "before",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: hookSessionKey
		});
	} catch (err) {
		log.warn("session:compact:before hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	if (params.hookRunner?.hasHooks?.("before_compaction")) try {
		await params.hookRunner.runBeforeCompaction?.({
			messageCount: params.metrics.messageCountBefore,
			tokenCount: params.metrics.tokenCountBefore
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		log.warn("before_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	return {
		hookSessionKey,
		missingSessionKey
	};
}
/** Estimates compacted-session token count and rejects impossible growth from stale estimates. */
function estimateTokensAfterCompaction(params) {
	const tokensAfter = estimateTokenCountSafe(params.messagesAfter, params.estimateTokensFn);
	if (tokensAfter === void 0) return;
	const sanityCheckBaseline = params.observedTokenCount ?? params.fullSessionTokensBefore;
	if (sanityCheckBaseline > 0 && tokensAfter > (params.observedTokenCount !== void 0 ? sanityCheckBaseline : sanityCheckBaseline * 1.1)) return;
	return tokensAfter;
}
/** Runs internal and plugin after-compaction hooks with the final compacted metrics. */
async function runAfterCompactionHooks(params) {
	try {
		const hookEvent = createInternalHookEvent("session", "compact:after", params.hookSessionKey, {
			sessionId: params.sessionId,
			missingSessionKey: params.missingSessionKey,
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			summaryLength: params.summaryLength,
			tokensBefore: params.tokensBefore,
			tokensAfter: params.tokensAfter,
			firstKeptEntryId: params.firstKeptEntryId
		});
		await triggerInternalHook(hookEvent);
		if (hookEvent.messages.length > 0) await params.onHookMessages?.({
			phase: "after",
			messages: hookEvent.messages.slice(),
			sessionId: params.sessionId,
			sessionKey: params.hookSessionKey
		});
	} catch (err) {
		log.warn("session:compact:after hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
	if (params.hookRunner?.hasHooks?.("after_compaction")) try {
		await params.hookRunner.runAfterCompaction?.({
			messageCount: params.messageCountAfter,
			tokenCount: params.tokensAfter,
			compactedCount: params.compactedCount,
			sessionFile: params.sessionFile,
			...params.previousSessionId ? { previousSessionId: params.previousSessionId } : {}
		}, {
			sessionId: params.sessionId,
			agentId: params.sessionAgentId,
			sessionKey: params.hookSessionKey,
			workspaceDir: params.workspaceDir,
			messageProvider: params.messageProvider
		});
	} catch (err) {
		log.warn("after_compaction hook failed", {
			errorMessage: formatErrorMessage(err),
			errorStack: err instanceof Error ? err.stack : void 0
		});
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-runtime-preparation.ts
/** Resolves the shared policy, target, and harness ownership for either compaction entry point. */
function resolveCompactionRuntimeSelection(params) {
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey ?? void 0;
	const runtimePolicyAgentId = params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId;
	const policyTarget = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const policyProvider = policyTarget.provider ?? "openai";
	const policyModelId = policyTarget.model ?? "gpt-5.6-sol";
	const policy = resolveAgentHarnessPolicy({
		provider: policyProvider,
		modelId: policyModelId,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	});
	const configuredHarnessRuntime = policy.runtimeSource && policy.runtimeSource !== "implicit" && !isDefaultAgentRuntimeId(policy.runtime) ? policy.runtime : void 0;
	const boundHarnessRuntime = normalizeOptionalAgentRuntimeId(params.boundHarnessRuntime);
	const selectedHarnessRuntime = params.selectedHarnessRuntime ?? resolveCompactionHarnessRuntime({
		boundHarnessRuntime,
		preparedRuntimePlan: params.preparedRuntimePlan,
		configuredHarnessRuntime,
		provider: policyProvider,
		modelId: policyModelId
	});
	const target = resolveEmbeddedCompactionTarget({
		config: params.config,
		provider: params.provider,
		modelId: params.modelId,
		authProfileId: params.authProfileId,
		harnessRuntime: selectedHarnessRuntime,
		modelSelectionLocked: params.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const provider = target.provider ?? "openai";
	const modelId = target.model ?? "gpt-5.6-sol";
	return {
		runtimePolicySessionKey,
		runtimePolicyAgentId,
		boundHarnessRuntime,
		selectedHarnessRuntime,
		selectedHarnessRuntimeOverride: boundHarnessRuntime ? void 0 : selectedHarnessRuntime,
		target,
		runtimeModelAuth: resolveReusableRuntimeModelAuth({
			plan: params.runtimeAuthPlan ?? params.preparedRuntimePlan?.auth,
			provider,
			modelId,
			authProfileId: target.authProfileId
		}),
		provider,
		runtimeProvider: target.runtimeProvider ?? provider,
		contextConfigProvider: target.contextProvider ?? provider,
		modelId
	};
}
function buildCompactionHarnessModelProvider(params) {
	const route = params.plan?.modelRoute;
	return {
		api: route?.api ?? params.model?.api,
		baseUrl: route?.baseUrl ?? params.model?.baseUrl,
		...resolveAgentHarnessPreparedRouteSupport(params.plan),
		...params.plan ? { preparedAuth: resolveAgentHarnessPreparedAuthSupport({
			plan: params.plan,
			source: params.attempt?.kind === "implicit" ? void 0 : params.attempt?.kind
		}) } : {}
	};
}
/** Prepares one ordered auth-attempt set and converges it on a single compaction harness. */
async function prepareCompactionHarnessAuth(params) {
	const runtimeAuthProfileStore = isOpenAIProvider(params.provider) ? ensureAuthProfileStore(params.agentDir, {
		externalCliProviderIds: ["openai"],
		allowKeychainPrompt: false
	}) : ensureAuthProfileStoreWithoutExternalProfiles(params.agentDir, { allowKeychainPrompt: false });
	const selectPreparedHarness = (attempts) => selectAgentHarnessForPreparedModelProviders({
		provider: params.provider,
		modelId: params.modelId,
		modelProviders: attempts.map((attempt) => buildCompactionHarnessModelProvider({
			model: params.model,
			plan: attempt.plan,
			attempt
		})),
		config: params.config,
		agentId: params.runtimePolicyAgentId,
		sessionKey: params.runtimePolicySessionKey ?? void 0,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
	});
	const initialHarness = params.reusableRuntimeAuthPlan ? void 0 : selectAgentHarness({
		provider: params.provider,
		modelId: params.modelId,
		modelProvider: buildCompactionHarnessModelProvider({ model: params.model }),
		config: params.config,
		agentId: params.runtimePolicyAgentId,
		sessionKey: params.runtimePolicySessionKey ?? void 0,
		agentHarnessId: params.agentHarnessId,
		agentHarnessRuntimeOverride: params.agentHarnessRuntimeOverride
	});
	const prepare = (harness) => prepareAgentRuntimeAuth({
		provider: params.provider,
		modelId: params.modelId,
		modelApi: params.model?.api,
		modelBaseUrl: params.model?.baseUrl,
		config: params.config,
		env: process.env,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		authProfileStore: runtimeAuthProfileStore,
		sessionAuthProfileId: params.authProfileId,
		sessionAuthProfileSource: params.authProfileIdSource,
		harnessId: harness.id,
		harnessRuntime: harness.id,
		harnessAuthBootstrap: harness.authBootstrap
	});
	let runtimeAuthPreparation = params.reusableRuntimeAuthPlan ? {
		plan: params.reusableRuntimeAuthPlan,
		attempts: [{
			kind: "implicit",
			plan: params.reusableRuntimeAuthPlan
		}]
	} : prepare(initialHarness);
	let selectedPreparedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
	if (!params.reusableRuntimeAuthPlan && selectedPreparedHarness.id !== initialHarness?.id) {
		runtimeAuthPreparation = prepare(selectedPreparedHarness);
		const confirmedHarness = selectPreparedHarness(runtimeAuthPreparation.attempts);
		if (confirmedHarness.id !== selectedPreparedHarness.id) throw new Error(`${params.convergenceErrorPrefix ?? "Prepared compaction"} auth routes did not converge on one agent harness for ${params.provider}/${params.modelId}.`);
		selectedPreparedHarness = confirmedHarness;
	}
	return {
		runtimeAuthProfileStore,
		runtimeAuthPreparation,
		selectedPreparedHarness,
		providerUsesProfileScopedModelMetadata: providerUsesCredentialScopedModelMetadata({
			provider: params.metadataProvider ?? params.provider,
			modelId: params.modelId,
			config: params.config,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir
		})
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-agent.ts
async function prepareCompactionSessionAgent(params) {
	const authStorage = params.authStorage && typeof params.authStorage === "object" && "getApiKey" in params.authStorage && typeof params.authStorage.getApiKey === "function" ? params.authStorage : void 0;
	const transportApiKey = authStorage ? await resolveEmbeddedAgentApiKey({
		provider: params.effectiveModel.provider,
		resolvedApiKey: params.resolvedApiKey,
		authStorage
	}) : params.resolvedApiKey;
	params.session.agent.streamFn = resolveEmbeddedAgentStreamFn({
		llmRuntime: params.llmRuntime,
		currentStreamFn: resolveEmbeddedAgentBaseStreamFn({ session: params.session }),
		providerStreamFn: params.providerStreamFn,
		sessionId: params.sessionId,
		signal: params.signal,
		model: params.effectiveModel,
		resolvedApiKey: params.resolvedApiKey,
		transportAuthAvailable: Boolean(transportApiKey?.trim()),
		authProfileId: params.runtimePlan?.auth.forwardedAuthProfileId,
		authStorage: params.authStorage
	});
	const providerTextTransforms = resolveProviderTextTransforms({
		provider: params.provider,
		config: params.config,
		workspaceDir: params.effectiveWorkspace
	});
	if (providerTextTransforms) params.session.agent.streamFn = wrapStreamFnTextTransforms({
		streamFn: params.session.agent.streamFn,
		input: providerTextTransforms.input,
		output: providerTextTransforms.output,
		transformSystemPrompt: false
	});
	const providerThinkingLevel = mapThinkingLevelForProvider(params.thinkLevel);
	const preparedRuntimeExtraParams = params.runtimePlan?.transport.resolveExtraParams({
		thinkingLevel: providerThinkingLevel,
		agentId: params.sessionAgentId,
		workspaceDir: params.effectiveWorkspace,
		model: params.effectiveModel
	});
	return {
		...applyExtraParamsToAgent(params.session.agent, params.config, params.provider, params.modelId, void 0, providerThinkingLevel, params.sessionAgentId, params.effectiveWorkspace, params.effectiveModel, params.agentDir, void 0, {
			...preparedRuntimeExtraParams ? { preparedExtraParams: preparedRuntimeExtraParams } : {},
			nativeWebSearchPolicyContext: {
				sessionKey: params.sessionKey,
				webSearchEnabled: false,
				runtimeToolAllowlist: [],
				sandboxToolPolicy: params.sandboxToolPolicy,
				messageProvider: params.messageProvider,
				agentAccountId: params.agentAccountId,
				groupId: params.groupId,
				groupChannel: params.groupChannel,
				groupSpace: params.groupSpace,
				spawnedBy: params.spawnedBy,
				senderId: params.senderId,
				senderName: params.senderName,
				senderUsername: params.senderUsername,
				senderE164: params.senderE164
			}
		}),
		transportApiKey
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-checkpoint.ts
const compactionCheckpointStore = createFileBackedCompactionCheckpointStore();
async function persistCompactionCheckpoint(params) {
	if (!params.config || !params.sessionKey || !params.snapshot) return false;
	try {
		const transcriptState = await readSessionLeafStateFromTranscriptAsync(params.sessionTarget ?? params.sessionFile);
		const checkpointPosition = resolveCompactionCheckpointTranscriptPosition({
			preferredLeafId: params.leafId,
			transcriptState
		});
		return await compactionCheckpointStore.persistCheckpoint({
			cfg: params.config,
			...params.sessionTarget?.agentId ? { agentId: params.sessionTarget.agentId } : {},
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentHarnessId: params.agentHarnessId,
			reason: resolveSessionCompactionCheckpointReason({ trigger: params.trigger }),
			snapshot: params.snapshot,
			summary: params.summary,
			firstKeptEntryId: params.firstKeptEntryId,
			tokensBefore: params.tokensBefore,
			tokensAfter: params.tokensAfter,
			postSessionFile: params.sessionTarget ? formatSqliteSessionFileMarker(params.sessionTarget) : params.sessionFile,
			postLeafId: checkpointPosition.leafId,
			postEntryId: checkpointPosition.entryId,
			createdAt: params.createdAt
		}) !== null;
	} catch (err) {
		log.warn("failed to persist compaction checkpoint", { errorMessage: formatErrorMessage(err) });
		return false;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-duplicate-user-messages.ts
/**
* Removes short-window duplicate user turns from compaction summaries.
*/
const DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS = 6e4;
const MIN_DUPLICATE_USER_MESSAGE_CHARS = 24;
function normalizeUserMessageContent(content) {
	if (typeof content === "string") return content.replace(/\s+/g, " ").trim();
	if (!Array.isArray(content)) return;
	const textParts = [];
	for (const block of content) {
		if (!isRecord(block)) return;
		if (block.type === "image") return;
		if (block.type === "text" && typeof block.text === "string") textParts.push(block.text);
	}
	return textParts.join("\n").replace(/\s+/g, " ").trim();
}
function duplicateSignature(message) {
	if (!isRecord(message) || message.role !== "user" || typeof message.timestamp !== "number") return;
	const text = normalizeUserMessageContent(message.content);
	if (!text || text.length < MIN_DUPLICATE_USER_MESSAGE_CHARS) return;
	const metadata = message["__openclaw"];
	const senderId = isRecord(metadata) && typeof metadata.senderId === "string" ? metadata.senderId : "";
	return {
		key: JSON.stringify([senderId, text.normalize("NFC").toLowerCase()]),
		timestamp: message.timestamp
	};
}
/** Drop later duplicate user messages while preserving the first prompt. */
function dedupeDuplicateUserMessagesForCompaction(messages, options = {}) {
	const windowMs = options.windowMs ?? DEFAULT_DUPLICATE_USER_MESSAGE_WINDOW_MS;
	const lastSeenAtByKey = /* @__PURE__ */ new Map();
	let removed = 0;
	const result = [];
	for (const message of messages) {
		const signature = duplicateSignature(message);
		if (!signature) {
			result.push(message);
			continue;
		}
		const lastSeenAt = lastSeenAtByKey.get(signature.key);
		lastSeenAtByKey.set(signature.key, signature.timestamp);
		if (typeof lastSeenAt === "number" && signature.timestamp - lastSeenAt <= windowMs) {
			removed += 1;
			continue;
		}
		result.push(message);
	}
	return removed > 0 ? result : [...messages];
}
//#endregion
//#region src/agents/embedded-agent-runner/server-endpoint-compaction.ts
/** Try provider-owned compaction and persist its replay checkpoint on the session owner. */
async function attemptServerEndpointCompaction(params) {
	if (params.trigger === "overflow" || params.customInstructions?.trim() || !resolveOpenAIResponsesCompactEndpointPlan(params.model, params.extraParams).enabled) return;
	try {
		const messages = params.context.messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
		if (messages.at(-1)?.role !== "assistant") return;
		const owner = params.sessionManager.getBranch().findLast((entry) => entry.type === "message" && entry.message.role === "assistant");
		if (!owner || owner.type !== "message" || owner.message.role !== "assistant") throw new Error("Responses compact endpoint requires a persisted assistant owner");
		const compacted = await compactWithSafetyTimeout((signal) => requestPreparedOpenAIResponsesCompaction(params.streamFn, params.model, {
			systemPrompt: params.context.systemPrompt,
			messages
		}, {
			...params.requestOptions,
			signal
		}), params.requestOptions.timeoutMs, params.requestOptions.signal ? { abortSignal: params.requestOptions.signal } : void 0);
		const replacement = structuredClone(owner.message);
		captureOpenAIResponsesCompaction(replacement, compacted.item, replacement.content.length, compacted.model, compacted.replayMetadata);
		const rewritten = rewriteTranscriptEntriesInSessionManager({
			sessionManager: params.sessionManager,
			replacements: [{
				entryId: owner.id,
				message: replacement
			}],
			preserveReplacementCompactionReplay: true
		});
		if (replacement.providerReplay?.type !== "openai-responses-compaction" || !rewritten.changed) throw new Error(`Responses compact endpoint checkpoint was not persisted: ${rewritten.reason}`);
		return compacted;
	} catch (err) {
		log.debug(`Responses compact endpoint failed; falling back to client compaction: ${formatErrorMessage(err)}`);
		return;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compaction-session-execution.ts
/**
* Executes compaction while owning the transcript lock, session lifecycle,
* hooks, checkpoint, and optional successor transcript rotation.
*/
async function executePreparedCompactionSession(runtime) {
	const { params, diagId, trigger, attempt, maxAttempts, runId, compactionModelCallTrace, diagnosticCompactionRunId, nextDiagnosticModelCallId, agentDir, provider, modelId, attemptedThinking, fail, authStorage, modelRegistry, apiKeyInfo, hasRuntimeAuthExchange, sandboxSessionKey, sandbox, effectiveWorkspace, effectiveCwd, contextTokenBudget, effectiveModel, runtimePlan, runtimePlanModelContext, runAbortController, effectiveTools, allowedToolNames, buildSystemPromptText, resolvedMessageProvider, sessionAgentId } = runtime;
	let thinkLevel = runtime.thinkLevel;
	let compactionSessionManager = null;
	let checkpointSnapshot = null;
	let checkpointSnapshotRetained = false;
	try {
		const compactionTimeoutMs = resolveCompactionTimeoutMs(params.config);
		const sessionTarget = await resolveAgentRunSessionTarget({
			agentId: sessionAgentId,
			config: params.config,
			missingSessionKey: "resolve-existing",
			sessionFile: params.sessionFile,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionTarget: params.sessionTarget
		});
		try {
			const transcriptPolicy = runtimePlan.transcript.resolvePolicy(runtimePlanModelContext);
			const sessionManager = guardSessionManager(SessionManager.open(sessionTarget), {
				agentId: sessionAgentId,
				sessionKey: params.sessionKey,
				config: params.config,
				contextWindowTokens: contextTokenBudget,
				allowSyntheticToolResults: transcriptPolicy.allowSyntheticToolResults,
				missingToolResultText: effectiveModel.api === "openai-responses" || effectiveModel.api === "azure-openai-responses" || effectiveModel.api === "openai-chatgpt-responses" ? "aborted" : void 0,
				allowedToolNames
			});
			checkpointSnapshot = await compactionCheckpointStore.captureSnapshot({
				sessionManager,
				sessionFile: params.sessionFile,
				sessionTarget
			});
			compactionSessionManager = sessionManager;
			const settingsManager = createPreparedEmbeddedAgentSettingsManager({
				cwd: effectiveCwd,
				agentDir,
				cfg: params.config,
				pluginMetadataSnapshot: getCurrentPluginMetadataSnapshot({
					config: params.config,
					env: process.env,
					workspaceDir: effectiveWorkspace
				}),
				contextTokenBudget
			});
			const resourceLoader = createEmbeddedAgentResourceLoader({
				cwd: effectiveCwd,
				agentDir,
				settingsManager,
				extensionFactories: buildEmbeddedExtensionFactories({
					cfg: params.config,
					sessionManager,
					provider,
					modelId,
					model: effectiveModel,
					contextTokenBudget,
					agentId: sessionAgentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey ?? sandboxSessionKey,
					runId
				})
			});
			await resourceLoader.reload();
			applyAgentCompactionSettingsFromConfig({
				settingsManager,
				cfg: params.config,
				contextTokenBudget
			});
			applyAgentAutoCompactionGuard({
				settingsManager,
				silentOverflowProneProvider: isSilentOverflowProneModel({
					provider,
					modelId,
					baseUrl: effectiveModel.baseUrl ?? void 0
				})
			});
			const { customTools } = splitSdkTools({
				tools: effectiveTools,
				sandboxEnabled: Boolean(sandbox?.enabled),
				toolHookContext: {
					agentId: sessionAgentId,
					config: params.config,
					cwd: effectiveCwd,
					sessionKey: sandboxSessionKey,
					sessionId: params.sessionId,
					runId: params.runId,
					channelId: params.currentChannelId
				}
			});
			const sessionToolAllowlist = toSessionToolAllowlist(collectRegisteredToolNames(customTools));
			const providerStreamFn = resolveCompactionProviderStream({
				effectiveModel,
				config: params.config,
				agentDir,
				effectiveWorkspace,
				apiRegistry: getModelRegistryRuntime(modelRegistry).apiRegistry
			});
			while (true) {
				attemptedThinking.add(thinkLevel);
				const systemPromptText = buildSystemPromptText(thinkLevel);
				let session;
				try {
					session = (await createAgentSessionForEmbeddedRunner({
						cwd: effectiveCwd,
						agentDir,
						authStorage,
						modelRegistry,
						model: effectiveModel,
						thinkingLevel: mapThinkingLevel(thinkLevel),
						tools: sessionToolAllowlist,
						customTools,
						sessionManager,
						settingsManager,
						resourceLoader
					}, {})).session;
					session.setActiveToolsByName(sessionToolAllowlist);
					applySystemPromptToSession(session, systemPromptText);
					const { effectiveExtraParams, transportApiKey } = await prepareCompactionSessionAgent({
						session,
						llmRuntime: getModelRegistryRuntime(modelRegistry).llmRuntime,
						providerStreamFn,
						sessionId: params.sessionId,
						signal: runAbortController.signal,
						effectiveModel,
						resolvedApiKey: hasRuntimeAuthExchange ? void 0 : apiKeyInfo?.apiKey,
						authStorage,
						config: params.config,
						provider,
						modelId,
						thinkLevel,
						sessionAgentId,
						effectiveWorkspace,
						agentDir,
						runtimePlan,
						sessionKey: sandboxSessionKey,
						sandboxToolPolicy: sandbox?.tools,
						messageProvider: resolvedMessageProvider,
						agentAccountId: params.agentAccountId,
						groupId: params.groupId,
						groupChannel: params.groupChannel,
						groupSpace: params.groupSpace,
						spawnedBy: params.spawnedBy,
						senderId: params.senderId,
						senderName: params.senderName,
						senderUsername: params.senderUsername,
						senderE164: params.senderE164
					});
					session.agent.streamFn = wrapStreamFnWithDiagnosticModelCallEvents(session.agent.streamFn, {
						runId: diagnosticCompactionRunId,
						...params.sessionKey && { sessionKey: params.sessionKey },
						sessionId: params.sessionId,
						provider,
						model: modelId,
						api: effectiveModel.api,
						transport: session.agent.transport,
						contextTokenBudget,
						trace: compactionModelCallTrace,
						contentCapture: resolveDiagnosticModelContentCapturePolicy(params.config),
						nextCallId: nextDiagnosticModelCallId
					});
					const dedupedValidated = dedupeDuplicateUserMessagesForCompaction(await validateReplayTurns({
						messages: await sanitizeSessionHistory({
							messages: session.messages,
							modelApi: effectiveModel.api,
							modelId,
							provider,
							allowedToolNames,
							config: params.config,
							workspaceDir: effectiveWorkspace,
							env: process.env,
							model: effectiveModel,
							sessionManager,
							sessionId: params.sessionId,
							policy: transcriptPolicy,
							preserveLatestAssistantThinking: false
						}),
						modelApi: effectiveModel.api,
						modelId,
						provider,
						config: params.config,
						workspaceDir: effectiveWorkspace,
						env: process.env,
						model: effectiveModel,
						sessionId: params.sessionId,
						policy: transcriptPolicy
					}));
					session.agent.state.messages = dedupedValidated;
					const originalMessages = session.messages.slice();
					const truncated = limitHistoryTurns(session.messages, getHistoryLimitFromSessionKey(params.sessionKey, params.config));
					const limited = transcriptPolicy.repairToolUseResultPairing ? sanitizeToolUseResultPairingForModel(truncated, effectiveModel.api === "openai-responses" || effectiveModel.api === "azure-openai-responses" || effectiveModel.api === "openai-chatgpt-responses") : truncated;
					if (limited.length > 0) session.agent.state.messages = limited;
					const hookRunner = asCompactionHookRunner(getGlobalHookRunner());
					const observedTokenCount = normalizeObservedTokenCount(params.currentTokenCount);
					const beforeHookMetrics = buildBeforeCompactionHookMetrics({
						originalMessages,
						currentMessages: session.messages,
						observedTokenCount,
						estimateTokensFn: estimateTokens
					});
					const { hookSessionKey, missingSessionKey } = await runBeforeCompactionHooks({
						hookRunner,
						sessionId: params.sessionId,
						sessionKey: sessionTarget.sessionKey,
						sessionAgentId,
						workspaceDir: effectiveWorkspace,
						messageProvider: resolvedMessageProvider,
						metrics: beforeHookMetrics,
						onHookMessages: params.onCompactionHookMessages
					});
					const { messageCountOriginal, tokenCountBefore: limitedTranscriptTokensBefore } = beforeHookMetrics;
					const diagEnabled = log.isEnabled("debug");
					const preMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
					if (diagEnabled && preMetrics) {
						log.debug(`[compaction-diag] start runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} pre.messages=${preMetrics.messages} pre.historyTextChars=${preMetrics.historyTextChars} pre.toolResultChars=${preMetrics.toolResultChars} pre.estTokens=${preMetrics.estTokens ?? "unknown"}`);
						log.debug(`[compaction-diag] contributors diagId=${diagId} top=${JSON.stringify(preMetrics.contributors)}`);
					}
					if (!containsRealConversationMessages(session.messages)) {
						log.info(`[compaction] skipping — no real conversation messages (sessionKey=${params.sessionKey ?? params.sessionId})`);
						return {
							ok: true,
							compacted: false,
							reason: "no real conversation messages"
						};
					}
					const compactStartedAt = Date.now();
					const serverResult = await attemptServerEndpointCompaction({
						trigger,
						streamFn: session.agent.streamFn,
						model: effectiveModel,
						context: {
							systemPrompt: systemPromptText,
							messages: session.messages
						},
						sessionManager,
						extraParams: effectiveExtraParams,
						customInstructions: params.customInstructions,
						requestOptions: {
							apiKey: transportApiKey,
							sessionId: params.sessionId,
							authProfileId: runtimePlan.auth.forwardedAuthProfileId,
							timeoutMs: compactionTimeoutMs,
							signal: params.abortSignal
						}
					});
					const activeSession = session;
					const clientResult = serverResult ? void 0 : await compactWithSafetyTimeout(() => {
						setCompactionSafeguardCancelReason(compactionSessionManager, void 0);
						return resolveEffectiveCompactionMode(params.config) === "default" && trigger !== "manual" ? activeSession[agentSessionAutomaticCompaction](params.customInstructions) : activeSession.compact(params.customInstructions);
					}, compactionTimeoutMs, {
						abortSignal: params.abortSignal,
						onCancel: () => {
							activeSession.abortCompaction();
						}
					});
					const effectiveFirstKeptEntryId = clientResult?.firstKeptEntryId;
					const tokensBefore = serverResult?.usage.input_tokens ?? clientResult.tokensBefore;
					const tokensAfter = serverResult?.usage.output_tokens ?? estimateTokensAfterCompaction({
						messagesAfter: session.messages,
						observedTokenCount,
						fullSessionTokensBefore: limitedTranscriptTokensBefore ?? 0,
						estimateTokensFn: estimateTokens
					});
					const messageCountAfter = session.messages.length;
					const compactedCount = Math.max(0, messageCountOriginal - messageCountAfter);
					const activeSessionFile = formatSqliteSessionFileMarker({
						...sessionTarget,
						sessionId: params.sessionId
					});
					await runPostCompactionSideEffects({
						config: params.config,
						sessionKey: params.sessionKey,
						sessionId: params.sessionId,
						agentId: sessionAgentId,
						sessionFile: activeSessionFile
					});
					if (clientResult) checkpointSnapshotRetained = await persistCompactionCheckpoint({
						config: params.config,
						sessionKey: params.sessionKey,
						sessionId: params.sessionId,
						trigger: params.trigger,
						snapshot: checkpointSnapshot,
						summary: clientResult.summary,
						firstKeptEntryId: effectiveFirstKeptEntryId,
						tokensBefore: observedTokenCount ?? clientResult.tokensBefore,
						tokensAfter,
						sessionFile: activeSessionFile,
						leafId: sessionManager.getLeafId?.() ?? void 0,
						createdAt: compactStartedAt
					});
					const postMetrics = diagEnabled ? summarizeCompactionMessages(session.messages) : void 0;
					if (diagEnabled && preMetrics && postMetrics) log.debug(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=compacted reason=none durationMs=${Date.now() - compactStartedAt} retrying=false post.messages=${postMetrics.messages} post.historyTextChars=${postMetrics.historyTextChars} post.toolResultChars=${postMetrics.toolResultChars} post.estTokens=${postMetrics.estTokens ?? "unknown"} delta.messages=${postMetrics.messages - preMetrics.messages} delta.historyTextChars=${postMetrics.historyTextChars - preMetrics.historyTextChars} delta.toolResultChars=${postMetrics.toolResultChars - preMetrics.toolResultChars} delta.estTokens=${typeof preMetrics.estTokens === "number" && typeof postMetrics.estTokens === "number" ? postMetrics.estTokens - preMetrics.estTokens : "unknown"}`);
					await runAfterCompactionHooks({
						hookRunner,
						sessionId: params.sessionId,
						sessionAgentId,
						hookSessionKey,
						missingSessionKey,
						workspaceDir: effectiveWorkspace,
						messageProvider: resolvedMessageProvider,
						messageCountAfter,
						tokensAfter,
						compactedCount,
						sessionFile: activeSessionFile,
						summaryLength: clientResult?.summary.length,
						tokensBefore,
						firstKeptEntryId: effectiveFirstKeptEntryId,
						onHookMessages: params.onCompactionHookMessages
					});
					return {
						ok: true,
						compacted: true,
						...serverResult ? { compactionKind: "server-endpoint" } : {},
						result: {
							...clientResult ? {
								summary: clientResult.summary,
								firstKeptEntryId: clientResult.firstKeptEntryId
							} : { kind: "server-endpoint" },
							tokensBefore: serverResult ? tokensBefore : observedTokenCount ?? clientResult.tokensBefore,
							tokensAfter,
							details: serverResult ? {
								compactionKind: "server-endpoint",
								droppedMessageCount: serverResult.usage.dropped_message_count
							} : clientResult.details
						}
					};
				} catch (err) {
					const fallbackThinking = pickFallbackThinkingLevel({
						message: formatErrorMessage(err),
						attempted: attemptedThinking
					});
					if (fallbackThinking) {
						log.warn(`[compaction] request rejected for ${provider}/${modelId}; retrying with ${fallbackThinking}`);
						thinkLevel = fallbackThinking;
						continue;
					}
					throw err;
				} finally {
					try {
						await flushPendingToolResultsAfterIdle({
							agent: session?.agent,
							sessionManager
						});
					} catch {}
					try {
						session?.dispose();
					} catch {}
				}
			}
		} finally {
			await runtime.disposeToolRuntimes();
		}
	} catch (err) {
		return fail(resolveCompactionFailureReason({
			reason: formatErrorMessage(err),
			safeguardCancelReason: consumeCompactionSafeguardCancelReason(compactionSessionManager)
		}), err);
	} finally {
		if (!checkpointSnapshotRetained) await compactionCheckpointStore.cleanupSnapshot(checkpointSnapshot);
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/model-resolution.ts
/** Resolves embedded-run models through discovery first, then the prepared static catalog. */
async function resolveTieredModel(params) {
	const providers = params.fallbackProvider && params.fallbackProvider !== params.provider ? [params.provider, params.fallbackProvider] : [params.provider];
	let firstResolution;
	const resolveCandidates = async (options) => {
		for (const provider of providers) {
			const resolution = await resolveModelAsync(provider, params.modelId, params.agentDir, params.config, options);
			firstResolution ??= resolution;
			if (resolution.model) return {
				provider,
				resolution
			};
		}
	};
	const firstTier = await resolveCandidates({
		skipAgentDiscovery: true,
		allowBundledStaticCatalogFallback: params.staticCatalogOwnsTransport,
		preferBundledStaticCatalogTransport: params.staticCatalogOwnsTransport,
		preparedModelRuntime: params.preparedModelRuntime,
		workspaceDir: params.workspaceDir,
		authProfileId: params.authProfileId,
		authProfileMode: params.authProfileMode
	});
	if (firstTier) return firstTier;
	if (params.staticCatalogOwnsTransport) return {
		provider: params.fallbackProvider ?? params.provider,
		resolution: firstResolution
	};
	const config = params.config ?? {};
	const preparedModelRuntime = params.preparedModelRuntime ?? await prepareModelRuntimeSnapshot({
		config,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir
	});
	return await resolveCandidates({
		...preparedModelRuntime.createStores(),
		workspaceDir: params.workspaceDir,
		authProfileId: params.authProfileId,
		authProfileMode: params.authProfileMode,
		allowBundledStaticCatalogFallback: true,
		preparedModelRuntime
	}) ?? {
		provider: params.fallbackProvider ?? params.provider,
		resolution: firstResolution
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction-preparation.ts
/**
* Prepares one direct embedded-agent compaction attempt through model, auth,
* workspace, and sandbox resolution.
*/
async function prepareDirectCompactionAttempt(params) {
	const startedAt = Date.now();
	const diagId = params.diagId?.trim() || createDirectCompactionDiagId();
	const trigger = params.trigger ?? "manual";
	const attempt = params.attempt ?? 1;
	const maxAttempts = params.maxAttempts ?? 1;
	const runId = params.runId ?? params.sessionId;
	const compactionModelCallTrace = freezeDiagnosticTraceContext(getActiveDiagnosticTraceContext() ?? createDiagnosticTraceContext());
	const diagnosticCompactionRunId = `${runId}:compaction:${diagId}`;
	let diagnosticModelCallSeq = 0;
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	const earlyAgentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, earlyAgentIds.sessionAgentId);
	const { runtimePolicySessionKey, runtimePolicyAgentId, boundHarnessRuntime, selectedHarnessRuntimeOverride, runtimeModelAuth: { plan: reusableRuntimeAuthPlan, authProfileId, modelAuth: initialModelAuth }, provider, runtimeProvider, contextConfigProvider, modelId } = resolveCompactionRuntimeSelection({
		...params,
		modelId: params.model,
		boundHarnessRuntime: params.agentHarnessId,
		preparedRuntimePlan: params.runtimePlan
	});
	await ensureSelectedAgentHarnessPlugin({
		config: params.config,
		provider,
		modelId,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride,
		workspaceDir: resolvedWorkspace,
		pluginRegistry: params.preparedModelRuntime.pluginRegistry
	});
	const attemptedThinking = /* @__PURE__ */ new Set();
	const fail = (reason, err) => {
		const failureReason = classifyCompactionReason(reason);
		const failure = err ? describeFailoverError(err) : void 0;
		const detail = failureReason === "unknown" ? formatUnknownCompactionReasonDetail(reason) : void 0;
		const detailSuffix = detail ? ` detail=${detail}` : "";
		log.warn(`[compaction-diag] end runId=${runId} sessionKey=${params.sessionKey ?? params.sessionId} diagId=${diagId} trigger=${trigger} provider=${provider}/${modelId} attempt=${attempt} maxAttempts=${maxAttempts} outcome=failed reason=${failureReason}${detailSuffix} durationMs=${Date.now() - startedAt}`);
		return {
			ok: false,
			compacted: false,
			reason,
			failure: failure ? {
				reason: failure.reason,
				status: failure.status,
				code: failure.code,
				rawError: failure.rawError ?? failure.message
			} : void 0
		};
	};
	const preparedModelRuntime = params.preparedModelRuntime;
	const { resolution: modelResolution } = await resolveTieredModel({
		provider: runtimeProvider,
		modelId,
		agentDir,
		config: params.config,
		workspaceDir: resolvedWorkspace,
		...initialModelAuth,
		preparedModelRuntime
	});
	const { model, error, authStorage, modelRegistry } = modelResolution;
	if (!model) return {
		ok: false,
		result: fail(error ?? `Unknown model: ${runtimeProvider}/${modelId}`)
	};
	const modelResolutionOptions = {
		authStorage,
		modelRegistry,
		preparedModelRuntime,
		workspaceDir: resolvedWorkspace
	};
	const { runtimeAuthProfileStore, runtimeAuthPreparation, selectedPreparedHarness, providerUsesProfileScopedModelMetadata } = await prepareCompactionHarnessAuth({
		...params,
		provider,
		metadataProvider: runtimeProvider,
		modelId,
		model,
		reusableRuntimeAuthPlan,
		agentDir,
		workspaceDir: resolvedWorkspace,
		authProfileId,
		runtimePolicyAgentId,
		runtimePolicySessionKey,
		agentHarnessId: boundHarnessRuntime,
		agentHarnessRuntimeOverride: selectedHarnessRuntimeOverride
	});
	const preparedHarnessRuntime = selectedPreparedHarness.id;
	const resolvePreparedModel = ({ config, authProfileId: profileId, authProfileMode: resolvedAuthProfileMode }) => resolveModelAsync(runtimeProvider, modelId, agentDir, config, {
		...modelResolutionOptions,
		skipAgentDiscovery: true,
		allowBundledStaticCatalogFallback: true,
		preferBundledStaticCatalogTransport: true,
		authProfileId: profileId,
		authProfileMode: resolvedAuthProfileMode
	});
	const materializeAuthAttemptModel = async (materializeParams) => await materializePreparedRuntimeModel({
		plan: materializeParams.plan,
		provider,
		modelId,
		config: params.config,
		model: materializeParams.model,
		forceResolve: materializeParams.forceResolve,
		resolveModel: resolvePreparedModel
	}) ?? materializeParams.model;
	const resolveRuntimeAuthAttempt = () => resolvePreparedRuntimeAuthAttempts({
		attempts: runtimeAuthPreparation.attempts,
		store: runtimeAuthProfileStore,
		modelId,
		model,
		materializeModel: materializeAuthAttemptModel,
		forceCredentialScopedDirectModelResolve: providerUsesProfileScopedModelMetadata,
		resolveAuth: async ({ attempt: preparedAttempt, model: attemptModel }) => await resolvePreparedRuntimeModelAuth({
			plan: preparedAttempt.plan,
			model: attemptModel,
			cfg: params.config,
			store: runtimeAuthProfileStore,
			agentDir,
			workspaceDir: resolvedWorkspace,
			...preparedAttempt.allowAuthProfileFallback !== void 0 ? { allowAuthProfileFallback: preparedAttempt.allowAuthProfileFallback } : {},
			secretSentinels: true
		}),
		errorMessage: `Prepared compaction auth attempts could not be resolved for ${provider}/${modelId}.`
	});
	let resolvedAuthAttempt;
	try {
		resolvedAuthAttempt = await resolveRuntimeAuthAttempt();
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	let runtimeModel = resolvedAuthAttempt.model;
	const apiKeyInfo = resolvedAuthAttempt.auth;
	const resolvedRuntimeAuthPlan = resolvedAuthAttempt.plan;
	let hasRuntimeAuthExchange = false;
	try {
		if (!apiKeyInfo.apiKey) {
			if (apiKeyInfo.mode !== "aws-sdk") throw new MissingProviderAuthError(runtimeModel.provider, apiKeyInfo);
		} else {
			const preparedAuth = protectPreparedProviderRuntimeAuth({
				provider: runtimeModel.provider,
				preparedAuth: await prepareProviderRuntimeAuth({
					provider: runtimeModel.provider,
					config: params.config,
					workspaceDir: resolvedWorkspace,
					env: process.env,
					context: {
						config: params.config,
						agentDir,
						workspaceDir: resolvedWorkspace,
						env: process.env,
						provider: runtimeModel.provider,
						modelId,
						model: runtimeModel,
						apiKey: unwrapSecretSentinelsForProviderEgress(apiKeyInfo.apiKey, "provider runtime auth exchange"),
						authMode: apiKeyInfo.mode,
						profileId: apiKeyInfo.profileId
					}
				})
			});
			runtimeModel = applyPreparedRuntimeAuthToModel(runtimeModel, preparedAuth);
			const runtimeApiKey = preparedAuth?.apiKey ?? apiKeyInfo.apiKey;
			hasRuntimeAuthExchange = Boolean(preparedAuth?.apiKey);
			if (!runtimeApiKey) throw new Error(`Provider "${runtimeModel.provider}" runtime auth returned no apiKey.`);
			authStorage.setRuntimeApiKey(runtimeModel.provider, runtimeApiKey);
		}
	} catch (err) {
		return {
			ok: false,
			result: fail(formatErrorMessage(err), err)
		};
	}
	const runtimeCompat = runtimeModel.compat && typeof runtimeModel.compat === "object" ? runtimeModel.compat : void 0;
	const thinkingFormat = typeof runtimeCompat?.thinkingFormat === "string" ? runtimeCompat.thinkingFormat : void 0;
	const supportedReasoningEfforts = runtimeCompat?.supportedReasoningEfforts === null || Array.isArray(runtimeCompat?.supportedReasoningEfforts) && runtimeCompat.supportedReasoningEfforts.every((effort) => typeof effort === "string") ? runtimeCompat.supportedReasoningEfforts : void 0;
	const thinkingCompat = thinkingFormat !== void 0 || supportedReasoningEfforts !== void 0 ? {
		thinkingFormat,
		supportedReasoningEfforts
	} : void 0;
	const thinkingCatalogEntry = {
		provider: runtimeModel.provider,
		id: runtimeModel.id,
		api: runtimeModel.api,
		reasoning: runtimeModel.reasoning,
		params: runtimeModel.params,
		...thinkingCompat ? { compat: thinkingCompat } : {}
	};
	const thinkLevel = resolveEmbeddedCompactionThinkingLevel({
		config: params.config,
		provider: runtimeModel.provider,
		modelId: runtimeModel.id,
		inheritedLevel: params.thinkLevel,
		catalog: [thinkingCatalogEntry],
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey,
		agentRuntime: preparedHarnessRuntime
	});
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
	const placementParams = params;
	const sandbox = placementParams.sandbox === void 0 ? await resolveSandboxContext({
		config: params.config,
		execOverrides: params.execOverrides,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	}) : placementParams.sandbox;
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed embedded compaction runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	await fs.mkdir(effectiveWorkspace, { recursive: true });
	const isSqliteSessionTranscript = true;
	const { sessionAgentId: effectiveSkillAgentId } = earlyAgentIds;
	return {
		ok: true,
		value: {
			params,
			startedAt,
			diagId,
			trigger,
			attempt,
			maxAttempts,
			runId,
			compactionModelCallTrace,
			diagnosticCompactionRunId,
			nextDiagnosticModelCallId: () => `${diagnosticCompactionRunId}:model:${diagnosticModelCallSeq += 1}`,
			earlyAgentIds,
			agentDir,
			provider,
			contextConfigProvider,
			modelId,
			preparedHarnessRuntime,
			thinkLevel,
			attemptedThinking,
			fail,
			authStorage,
			modelRegistry,
			runtimeModel,
			apiKeyInfo,
			resolvedRuntimeAuthPlan,
			hasRuntimeAuthExchange,
			resolvedWorkspace,
			sandboxSessionKey,
			sandbox,
			effectiveWorkspace,
			effectiveCwd,
			isSqliteSessionTranscript,
			effectiveSkillAgentId
		}
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/prepared-compaction-runtime.ts
/**
* Builds the skills, tools, capability profile, and system prompt used by one
* prepared direct compaction attempt.
*/
async function buildPreparedCompactionRuntime(prepared) {
	const { params, runId, agentDir, provider, contextConfigProvider, modelId, preparedHarnessRuntime, thinkLevel, runtimeModel, apiKeyInfo, resolvedRuntimeAuthPlan, hasRuntimeAuthExchange, resolvedWorkspace, sandboxSessionKey, sandbox, effectiveWorkspace, effectiveCwd, effectiveSkillAgentId } = prepared;
	let restoreSkillEnv;
	let bundleMcpRuntime;
	let bundleLspRuntime;
	let toolRuntimesDisposed = false;
	let skillEnvironmentRestored = false;
	const disposeToolRuntimes = async () => {
		if (toolRuntimesDisposed) return;
		toolRuntimesDisposed = true;
		try {
			await bundleMcpRuntime?.dispose();
		} catch {}
		try {
			await bundleLspRuntime?.dispose();
		} catch {}
	};
	const restoreSkillEnvironment = () => {
		if (skillEnvironmentRestored) return;
		skillEnvironmentRestored = true;
		restoreSkillEnv?.();
	};
	const dispose = async () => {
		await disposeToolRuntimes();
		restoreSkillEnvironment();
	};
	try {
		const { skillsEligibility, skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace, skillsSnapshot: skillsSnapshotForRun, skillsWorkspaceDir: effectiveSkillsWorkspace, workspaceOnly: loadSkillsWorkspaceOnly } = resolveSandboxSkillRuntimeInputs({
			sandbox,
			effectiveWorkspace,
			skillsSnapshot: params.skillsSnapshot
		});
		const { shouldLoadSkillEntries, skillEntries } = resolveEmbeddedRunSkillEntries({
			workspaceDir: effectiveSkillsWorkspace,
			config: params.config,
			agentId: effectiveSkillAgentId,
			eligibility: skillsEligibility,
			skillsSnapshot: skillsSnapshotForRun,
			workspaceOnly: loadSkillsWorkspaceOnly
		});
		restoreSkillEnv = skillsSnapshotForRun ? applySkillEnvOverridesFromSnapshot({
			snapshot: skillsSnapshotForRun,
			config: params.config
		}) : applySkillEnvOverrides({
			skills: skillEntries ?? [],
			config: params.config
		});
		const promptSkillEntries = mapSandboxSkillEntriesForPrompt({
			entries: shouldLoadSkillEntries ? skillEntries : void 0,
			skillsWorkspaceDir: effectiveSkillsWorkspace,
			skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace
		});
		const skillUsagePaths = mapSandboxSkillUsagePaths({
			paths: sandbox?.skillUsagePaths,
			skillsWorkspaceDir: effectiveSkillsWorkspace,
			skillsPromptWorkspaceDir: effectiveSkillsPromptWorkspace
		});
		const skillsPrompt = resolveSkillsPrompt({
			skillsSnapshot: skillsSnapshotForRun,
			entries: promptSkillEntries,
			config: params.config,
			workspaceDir: effectiveSkillsPromptWorkspace,
			agentId: effectiveSkillAgentId,
			eligibility: skillsEligibility
		});
		const sessionLabel = params.sessionKey ?? params.sessionId;
		const resolvedMessageProvider = params.messageChannel ?? params.messageProvider;
		const { contextFiles } = resolveContextInjectionMode(params.config, effectiveSkillAgentId) === "never" ? { contextFiles: [] } : await resolveBootstrapContextForRun({
			workspaceDir: effectiveWorkspace,
			config: params.config,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			chatType: params.chatType,
			agentId: effectiveSkillAgentId,
			warn: makeBootstrapWarn({
				sessionLabel,
				warn: (message) => log.warn(message)
			})
		});
		const runtimeModelWithContext = runtimeModel;
		const contextTokenBudget = resolveCompactionContextTokenBudget({
			config: params.config,
			provider: contextConfigProvider,
			modelId,
			model: runtimeModelWithContext,
			agentId: effectiveSkillAgentId,
			requestedTokenBudget: params.contextTokenBudget,
			fallbackTokenBudget: params.tokenBudget
		});
		const effectiveModel = applyAuthHeaderOverride(applyLocalNoAuthHeaderOverride(contextTokenBudget < (runtimeModelWithContext.contextWindow ?? Infinity) ? {
			...runtimeModelWithContext,
			contextWindow: contextTokenBudget
		} : runtimeModelWithContext, apiKeyInfo), hasRuntimeAuthExchange ? null : apiKeyInfo, params.config);
		const reuseFullRuntimePlan = params.runtimePlan?.auth === resolvedRuntimeAuthPlan;
		const preparedRuntimePlan = (reuseFullRuntimePlan ? params.runtimePlan : void 0) ?? buildAgentRuntimePlan({
			provider,
			modelId,
			model: effectiveModel,
			modelApi: effectiveModel.api,
			harnessId: preparedHarnessRuntime,
			harnessRuntime: preparedHarnessRuntime,
			authProfileMode: resolvedRuntimeAuthPlan.selectedAuthMode,
			sessionAuthProfileId: resolvedRuntimeAuthPlan.forwardedAuthProfileId,
			sessionAuthProfileSource: resolvedRuntimeAuthPlan.forwardedAuthProfileSource,
			sessionAuthProfileCandidateIds: resolvedRuntimeAuthPlan.forwardedAuthProfileCandidateIds,
			modelRoute: resolvedRuntimeAuthPlan.modelRoute,
			config: params.config,
			workspaceDir: effectiveWorkspace,
			agentDir,
			agentId: effectiveSkillAgentId,
			thinkingLevel: mapThinkingLevelForProvider(thinkLevel)
		});
		const runtimePlan = reuseFullRuntimePlan ? preparedRuntimePlan : {
			...preparedRuntimePlan,
			auth: resolvedRuntimeAuthPlan
		};
		const runAbortController = new AbortController();
		const spawnWorkspaceDir = effectiveCwd !== effectiveWorkspace ? resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox,
			resolvedWorkspace
		});
		const runtimeCapabilityProfile = resolveConversationCapabilityProfile({
			config: params.config,
			sessionKey: sandboxSessionKey,
			runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
			sessionId: params.sessionId,
			runId: params.runId,
			agentDir,
			agentAccountId: params.agentAccountId,
			messageProvider: resolvedMessageProvider,
			chatType: params.chatType,
			conversationToolPolicy: params.conversationToolPolicy,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderIsOwner: params.senderIsOwner,
			modelProvider: effectiveModel.provider,
			modelId,
			modelApi: effectiveModel.api,
			modelContextWindowTokens: contextTokenBudget,
			workspaceDir: effectiveWorkspace,
			cwd: effectiveCwd,
			spawnWorkspaceDir,
			skillsSnapshot: skillsSnapshotForRun,
			sandboxToolPolicy: sandbox?.tools,
			inputProvenance: params.inputProvenance,
			trustedInternalHandoff: params.trustedInternalHandoff
		});
		const toolsEnabled = supportsModelTools(effectiveModel);
		const toolsRaw = toolsEnabled ? createOpenClawCodingTools({
			exec: {
				...params.execOverrides,
				config: params.config,
				elevated: params.bashElevated
			},
			sandbox,
			messageProvider: resolvedMessageProvider,
			clientCaps: params.clientCaps,
			chatType: params.chatType,
			agentAccountId: params.agentAccountId,
			sessionKey: sandboxSessionKey,
			runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
			sessionId: params.sessionId,
			runId: params.runId,
			oneShotCliRun: params.oneShotCliRun,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			allowGatewaySubagentBinding: params.allowGatewaySubagentBinding,
			agentDir,
			cwd: effectiveCwd,
			workspaceDir: effectiveWorkspace,
			spawnWorkspaceDir,
			config: params.config,
			webSearchEnabled: params.toolOverrides?.webSearch !== false,
			abortSignal: runAbortController.signal,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			modelProvider: effectiveModel.provider,
			modelId,
			modelHasVision: effectiveModel.input?.includes("image") ?? false,
			modelCompat: extractModelCompat(effectiveModel),
			modelApi: effectiveModel.api,
			modelContextWindowTokens: contextTokenBudget,
			skillsSnapshot: skillsSnapshotForRun,
			skillUsagePaths,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			modelAuthMode: resolveModelAuthMode(effectiveModel.provider, params.config, void 0, { workspaceDir: effectiveWorkspace })
		}) : [];
		const runtimePlanModelContext = {
			workspaceDir: effectiveWorkspace,
			modelApi: effectiveModel.api,
			model: effectiveModel
		};
		const normalizableToolProjection = filterProviderNormalizableTools(toolsEnabled ? toolsRaw : []);
		logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableToolProjection.diagnostics,
			tools: toolsEnabled ? toolsRaw : [],
			runId,
			agentId: effectiveSkillAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const tools = runtimePlan.tools.normalize([...normalizableToolProjection.tools], runtimePlanModelContext);
		bundleMcpRuntime = toolsEnabled ? await createBundleMcpToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: tools.map((tool) => tool.name)
		}) : void 0;
		bundleLspRuntime = toolsEnabled ? await createBundleLspToolRuntime({
			workspaceDir: effectiveWorkspace,
			cfg: params.config,
			reservedToolNames: [...tools.map((tool) => tool.name), ...bundleMcpRuntime?.tools.map((tool) => tool.name) ?? []]
		}) : void 0;
		const filteredBundledTools = applyFinalEffectiveToolPolicy({
			bundledTools: [...bundleMcpRuntime?.tools ?? [], ...bundleLspRuntime?.tools ?? []],
			config: params.config,
			conversationCapabilityProfile: runtimeCapabilityProfile,
			warn: (message) => log.warn(message)
		});
		const normalizableBundledToolProjection = filterProviderNormalizableTools(filteredBundledTools);
		if (normalizableBundledToolProjection.diagnostics.length > 0) logRuntimeToolSchemaQuarantine({
			diagnostics: normalizableBundledToolProjection.diagnostics,
			tools: filteredBundledTools,
			runId,
			agentId: effectiveSkillAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const normalizedBundledTools = filteredBundledTools.length > 0 ? runtimePlan.tools.normalize([...normalizableBundledToolProjection.tools], runtimePlanModelContext) : filteredBundledTools;
		const projectedEffectiveTools = [...tools, ...normalizedBundledTools];
		const toolSchemaProjection = filterRuntimeCompatibleTools(projectedEffectiveTools);
		logRuntimeToolSchemaQuarantine({
			diagnostics: toolSchemaProjection.diagnostics,
			tools: projectedEffectiveTools,
			runId,
			agentId: effectiveSkillAgentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId
		});
		const effectiveTools = [...toolSchemaProjection.tools];
		const allowedToolNames = collectAllowedToolNames({ tools: effectiveTools });
		runtimePlan.tools.logDiagnostics(effectiveTools, runtimePlanModelContext);
		const machineName = await getMachineDisplayName();
		const runtimeChannel = normalizeMessageChannel(params.messageChannel ?? params.messageProvider);
		const runtimeCapabilities = collectRuntimeChannelCapabilities({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		});
		const reactionGuidance = runtimeChannel && params.config ? resolveChannelReactionGuidance({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const { defaultAgentId, sessionAgentId } = resolveSessionAgentIds({
			sessionKey: params.sessionKey,
			config: params.config,
			agentId: params.agentId
		});
		const channelActions = runtimeChannel ? listChannelSupportedActions(buildEmbeddedMessageActionDiscoveryInput({
			cfg: params.config,
			channel: runtimeChannel,
			currentChannelId: params.currentChannelId,
			currentThreadTs: params.currentThreadTs,
			currentMessageId: params.currentMessageId,
			accountId: params.agentAccountId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			agentId: sessionAgentId,
			senderId: params.senderId
		})) : void 0;
		const messageToolHints = runtimeChannel ? resolveChannelMessageToolHints({
			cfg: params.config,
			channel: runtimeChannel,
			accountId: params.agentAccountId
		}) : void 0;
		const runtimeInfo = {
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			host: machineName,
			os: resolveRuntimeOsLabel(),
			arch: os.arch(),
			node: process.version,
			model: `${provider}/${modelId}`,
			shell: detectRuntimeShell(),
			channel: runtimeChannel,
			chatType: params.chatType,
			capabilities: runtimeCapabilities,
			channelActions,
			activeProcessSessions: listActiveProcessSessionReferences({ scopeKey: resolveProcessToolScopeKey({
				sessionKey: sandboxSessionKey,
				agentId: sessionAgentId
			}) }),
			activeNode: formatActiveNodeContextLabel(getCurrentActiveNodeContext())
		};
		const sandboxInfoExecPolicy = resolveEmbeddedSandboxInfoExecPolicy({
			config: params.config,
			agentId: sessionAgentId,
			sessionKey: params.sessionKey,
			sandboxAvailable: sandbox?.enabled === true,
			execOverrides: params.execOverrides
		});
		const sandboxInfo = buildEmbeddedSandboxInfo(sandbox, params.bashElevated, sandboxInfoExecPolicy);
		const reasoningTagHint = isReasoningTagProvider(provider, {
			config: params.config,
			workspaceDir: effectiveWorkspace,
			env: process.env,
			modelId,
			modelApi: effectiveModel.api,
			model: effectiveModel
		});
		const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
		const userDate = formatDateStamp(Date.now(), userTimezone);
		const promptSurface = resolveAgentPromptSurfaceForSessionKey(params.sessionKey);
		const promptMode = isSubagentSessionKey(params.sessionKey) || isCronSessionKey(params.sessionKey) ? "minimal" : "full";
		const nativeCommandGuidanceLines = listRegisteredPluginAgentPromptGuidance({ surface: promptSurface });
		const openClawReferences = await resolveOpenClawReferencePaths({
			workspaceDir: effectiveWorkspace,
			argv1: process.argv[1],
			cwd: effectiveCwd,
			moduleUrl: import.meta.url
		});
		const promptContributionContext = {
			config: params.config,
			agentDir,
			workspaceDir: effectiveWorkspace,
			provider,
			modelId,
			promptMode,
			runtimeChannel,
			runtimeCapabilities,
			agentId: sessionAgentId
		};
		const promptContribution = runtimePlan.prompt.resolveSystemPromptContribution(promptContributionContext);
		const preparedMemoryPrompt = await prepareAgentMemoryPrompt({
			enabled: promptMode === "full",
			toolNames: effectiveTools.map((tool) => tool.name),
			citationsMode: params.config?.memory?.citations,
			agentId: runtimeInfo.agentId,
			agentSessionKey: runtimeInfo.sessionKey,
			sandboxed: sandboxInfo?.enabled === true
		});
		const preparedWatchedSessions = prepareWatchedSessionsPrompt({
			enabled: promptMode === "full",
			config: params.config,
			sessionKey: params.sessionKey,
			sandboxed: sandboxInfo?.enabled === true,
			toolNames: effectiveTools.map((tool) => tool.name),
			capabilityToolNames: allowedToolNames
		});
		const activeProjectKeys = params.preparedModelRuntime?.activeProjectKeys ?? [];
		const buildSystemPromptText = (defaultThinkLevel) => {
			const builtSystemPrompt = buildEmbeddedSystemPrompt({
				config: params.config,
				agentId: sessionAgentId,
				workspaceDir: effectiveWorkspace,
				defaultThinkLevel,
				reasoningLevel: params.reasoningLevel ?? "off",
				extraSystemPrompt: params.extraSystemPrompt,
				ownerNumbers: params.ownerNumbers,
				reasoningTagHint,
				heartbeatPrompt: resolveHeartbeatPromptForSystemPrompt({
					config: params.config,
					agentId: sessionAgentId,
					defaultAgentId
				}),
				skillsPrompt,
				docsPath: openClawReferences.docsPath ?? void 0,
				sourcePath: openClawReferences.sourcePath ?? void 0,
				promptMode,
				promptSurface,
				sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
				acpEnabled: isAcpRuntimeSpawnAvailable({
					config: params.config,
					sandboxed: sandboxInfo?.enabled === true
				}),
				runtimeInfo,
				reactionGuidance,
				messageToolHints,
				sandboxInfo,
				tools: effectiveTools,
				userTimezone,
				userDate,
				contextFiles,
				activeProjectKeys,
				preparedMemoryPrompt,
				preparedWatchedSessions,
				promptContribution,
				nativeCommandGuidanceLines
			});
			return transformProviderSystemPrompt({
				provider,
				config: params.config,
				workspaceDir: effectiveWorkspace,
				context: {
					config: params.config,
					agentDir,
					workspaceDir: effectiveWorkspace,
					provider,
					modelId,
					promptMode,
					runtimeChannel,
					runtimeCapabilities,
					agentId: sessionAgentId,
					systemPrompt: builtSystemPrompt
				}
			});
		};
		return {
			...prepared,
			contextTokenBudget,
			effectiveModel,
			runtimePlan,
			runtimePlanModelContext,
			runAbortController,
			effectiveTools,
			allowedToolNames,
			buildSystemPromptText,
			resolvedMessageProvider,
			sessionAgentId,
			disposeToolRuntimes,
			restoreSkillEnvironment,
			dispose
		};
	} catch (err) {
		await dispose();
		throw err;
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/direct-compaction.ts
/** Coordinates one direct compaction attempt through explicit lifecycle phases. */
async function compactEmbeddedAgentSessionDirectOnce(params) {
	const preparation = await prepareDirectCompactionAttempt(params);
	if (!preparation.ok) return preparation.result;
	let runtime;
	try {
		runtime = await buildPreparedCompactionRuntime(preparation.value);
		return await executePreparedCompactionSession(runtime);
	} catch (err) {
		const reason = resolveCompactionFailureReason({
			reason: formatErrorMessage(err),
			safeguardCancelReason: void 0
		});
		return preparation.value.fail(reason, err);
	} finally {
		await runtime?.dispose();
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/compact.ts
/**
* Public facade and fallback coordinator for embedded-agent compaction.
*/
function lockedHarnessCompactionFailure(runtime) {
	return {
		ok: false,
		compacted: false,
		reason: runtime ? `Model selection is locked to native agent harness "${runtime}"; generic compaction is unavailable.` : "Model selection is locked but the persisted agent harness is unavailable.",
		failure: { reason: "model_selection_locked" }
	};
}
async function compactNativeCliSession(params) {
	const runtime = normalizeOptionalAgentRuntimeId(params.runtime);
	if (!runtime || params.compactParams.trigger !== "manual") return;
	const backend = resolveCliBackendConfig(runtime, params.compactParams.config, { agentId: params.compactParams.agentId });
	if (!backend?.ownsNativeCompaction) return;
	const manualCompaction = backend.manualCompaction;
	if (!manualCompaction) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" owns compaction but does not support manual compaction.`
	};
	const cliSessionBinding = params.compactParams.cliSessionBinding;
	const cliSessionId = (cliSessionBinding?.sessionId ?? params.compactParams.cliSessionId)?.trim();
	if (!cliSessionId) return {
		ok: false,
		compacted: false,
		reason: `CLI backend "${runtime}" cannot manually compact without a resumable native session.`
	};
	const { runCliAgent } = await import("./cli-runner-CWH3UUi_.js");
	const runId = `${params.compactParams.runId ?? params.compactParams.sessionId}:native-compact`;
	const sessionAgentId = resolveSessionAgentIds({
		sessionKey: params.compactParams.sessionKey,
		config: params.compactParams.config,
		agentId: params.compactParams.agentId
	}).sessionAgentId;
	const preparedRunAdmission = prepareSystemAgentRunAdmission(params.compactParams.config ?? {}, runId, sessionAgentId, "agents.native-compaction");
	try {
		await runCliAgent({
			preparedRunAdmission,
			sessionId: params.compactParams.sessionId,
			sessionKey: params.compactParams.sessionKey,
			sessionFile: params.compactParams.sessionFile,
			agentId: params.compactParams.agentId,
			workspaceDir: params.compactParams.workspaceDir,
			cwd: params.compactParams.cwd,
			agentDir: params.compactParams.agentDir,
			config: params.compactParams.config,
			prompt: manualCompaction.buildPrompt(params.compactParams.customInstructions),
			provider: runtime,
			modelProvider: params.compactParams.provider,
			model: params.compactParams.model,
			thinkLevel: params.compactParams.thinkLevel,
			timeoutMs: resolveCompactionTimeoutMs(params.compactParams.config),
			runId,
			cliSessionId,
			...cliSessionBinding ? { cliSessionBinding } : {},
			...cliSessionBinding?.authProfileId ? { authProfileId: cliSessionBinding.authProfileId } : params.compactParams.authProfileId ? { authProfileId: params.compactParams.authProfileId } : {},
			...params.compactParams.sessionEntry ? { sessionEntry: params.compactParams.sessionEntry } : {},
			trigger: "manual",
			controlOperation: "compact",
			disableCliLiveSession: true,
			allowEmptyAssistantReplyAsSilent: true,
			abortSignal: params.compactParams.abortSignal
		});
	} catch (err) {
		return {
			ok: false,
			compacted: false,
			reason: `CLI backend "${runtime}" failed to compact its native session: ${formatErrorMessage(err)}`
		};
	} finally {
		preparedRunAdmission.close();
	}
	return {
		ok: true,
		compacted: true,
		reason: `CLI backend "${runtime}" compacted its native session.`
	};
}
function hasExplicitCompactionModel(params) {
	return Boolean(params.config?.agents?.defaults?.compaction?.model?.trim());
}
function resolveCompactionFallbacksOverride(params) {
	if (params.modelSelectionLocked) return [];
	return params.modelFallbacksOverride ?? resolveRunModelFallbacksOverride({
		cfg: params.config,
		sessionKey: params.sessionKey
	});
}
function hasCompactionModelFallbackCandidates(params) {
	const fallbacksOverride = resolveCompactionFallbacksOverride(params);
	const defaultFallbacks = resolveAgentModelFallbackValues(params.config?.agents?.defaults?.model);
	return (fallbacksOverride ?? defaultFallbacks).length > 0;
}
function classifyCompactionFallbackResult(result, provider, model) {
	if (result.ok) return null;
	const reason = result.reason?.trim();
	if (!reason) return null;
	const failoverError = coerceToFailoverError(Object.assign(new Error(result.failure?.rawError ?? reason), {
		status: result.failure?.status,
		code: result.failure?.code
	}), {
		provider,
		model
	});
	return failoverError ? { error: failoverError } : null;
}
function fallbackFailureToCompactionResult(err) {
	return {
		ok: false,
		compacted: false,
		reason: isFallbackSummaryError(err) ? err.message : formatErrorMessage(err)
	};
}
/**
* Core compaction logic without lane queueing.
* Use this when already inside a session/global lane to avoid deadlocks.
*/
async function compactEmbeddedAgentSessionDirect(paramsInput) {
	const paramsBase = applyAgentRunSessionTargetIdentity(paramsInput);
	const lockedHarnessRuntime = normalizeOptionalAgentRuntimeId(paramsBase.agentHarnessId);
	const deferLockedHarnessFailure = (paramsBase.trigger === "manual" && lockedHarnessRuntime ? resolveCliBackendConfig(lockedHarnessRuntime, paramsBase.config, { agentId: paramsBase.agentId }) : void 0)?.ownsNativeCompaction === true;
	if (paramsBase.modelSelectionLocked === true && lockedHarnessRuntime !== "openclaw" && !deferLockedHarnessFailure) return lockedHarnessCompactionFailure(lockedHarnessRuntime);
	const runSessionTarget = await resolveAgentRunSessionTarget({
		...paramsBase,
		missingSessionKey: "resolve-existing"
	});
	const requestedParams = {
		...paramsBase,
		agentId: runSessionTarget.agentId,
		sessionId: runSessionTarget.sessionId,
		sessionKey: runSessionTarget.sessionKey,
		sessionTarget: runSessionTarget,
		sessionFile: runSessionTarget.sessionKey
	};
	const requestedAgentIds = resolveSessionAgentIds({
		sessionKey: requestedParams.sessionKey,
		config: requestedParams.config,
		agentId: requestedParams.agentId
	});
	const requestedAgentDir = requestedParams.agentDir ?? resolveAgentDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId);
	const requestedWorkspaceDir = resolveUserPath(requestedParams.workspaceDir);
	const canonicalWorkspaceDir = resolveUserPath(resolveAgentWorkspaceDir(requestedParams.config ?? {}, requestedAgentIds.sessionAgentId));
	const runtimeSelection = resolveCompactionRuntimeSelection({
		...requestedParams,
		modelId: requestedParams.model,
		boundHarnessRuntime: requestedParams.agentHarnessId,
		preparedRuntimePlan: requestedParams.runtimePlan
	});
	const nativeCliResult = await compactNativeCliSession({
		runtime: runtimeSelection.selectedHarnessRuntime,
		compactParams: {
			...requestedParams,
			agentDir: requestedAgentDir,
			workspaceDir: requestedWorkspaceDir
		}
	});
	if (nativeCliResult) return nativeCliResult;
	if (requestedParams.modelSelectionLocked === true && lockedHarnessRuntime !== "openclaw") return lockedHarnessCompactionFailure(lockedHarnessRuntime);
	const pluginPlanCompactionTarget = resolveEmbeddedCompactionTarget({
		config: requestedParams.config,
		provider: requestedParams.provider,
		modelId: requestedParams.model,
		authProfileId: requestedParams.authProfileId,
		modelSelectionLocked: requestedParams.modelSelectionLocked,
		defaultProvider: DEFAULT_PROVIDER,
		defaultModel: DEFAULT_MODEL
	});
	const currentPluginMetadataSnapshot = getCurrentPluginMetadataSnapshot({
		config: requestedParams.config ?? {},
		workspaceDir: requestedWorkspaceDir,
		env: process.env,
		allowWorkspaceScopedSnapshot: true
	});
	const pluginPlanCandidates = resolveModelCandidateChain({
		cfg: requestedParams.config,
		manifestPlugins: currentPluginMetadataSnapshot?.plugins ?? [],
		provider: pluginPlanCompactionTarget.provider ?? "openai",
		model: pluginPlanCompactionTarget.model ?? "gpt-5.6-sol",
		requestedRouteResolution: "resolved",
		fallbacksOverride: resolveCompactionFallbacksOverride(requestedParams)
	});
	const runtimePluginSelections = [{
		provider: runtimeSelection.provider,
		modelId: runtimeSelection.modelId,
		...runtimeSelection.selectedHarnessRuntime ? { runtime: runtimeSelection.selectedHarnessRuntime } : {},
		agentId: requestedAgentIds.sessionAgentId
	}, ...pluginPlanCandidates.filter((candidate) => candidate.provider !== runtimeSelection.provider || candidate.model !== runtimeSelection.modelId).map((candidate) => runtimeSelection.boundHarnessRuntime ? {
		provider: candidate.provider,
		modelId: candidate.model,
		runtime: runtimeSelection.boundHarnessRuntime,
		agentId: requestedAgentIds.sessionAgentId
	} : {
		provider: candidate.provider,
		modelId: candidate.model,
		agentId: requestedAgentIds.sessionAgentId
	})];
	const preparedModelRuntimeLease = await acquireAgentRunPreparedModelRuntime({
		config: requestedParams.config ?? {},
		agentId: requestedAgentIds.sessionAgentId,
		agentDir: requestedAgentDir,
		workspaceDir: requestedWorkspaceDir,
		preserveWorkspaceDirOnRefresh: requestedWorkspaceDir !== canonicalWorkspaceDir,
		...requestedParams.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
		runtimePluginSelections
	});
	try {
		const preparedModelRuntimeOwnerSnapshot = preparedModelRuntimeLease.snapshot;
		const preparedWorkspaceDir = preparedModelRuntimeOwnerSnapshot.workspaceDir ?? requestedWorkspaceDir;
		const repoRoot = resolveSystemPromptRepoRoot({
			config: preparedModelRuntimeOwnerSnapshot.config,
			workspaceDir: preparedWorkspaceDir,
			cwd: requestedParams.cwd
		}) ?? null;
		const projectKey = repoRoot ? await resolveProjectKey(repoRoot) : null;
		const activeProjectKeys = prepareEmbeddedSessionActiveProjectKeys(requestedParams.sessionId, projectKey);
		const preparedModelRuntime = Object.freeze({
			...preparedModelRuntimeOwnerSnapshot,
			repoRoot,
			projectKey,
			activeProjectKeys
		});
		const params = {
			...requestedParams,
			config: preparedModelRuntime.config,
			agentId: preparedModelRuntime.agentId ?? requestedAgentIds.sessionAgentId,
			agentDir: preparedModelRuntime.agentDir,
			workspaceDir: preparedWorkspaceDir,
			preparedModelRuntime
		};
		const compactPrepared = async () => {
			if (hasExplicitCompactionModel(params) || !hasCompactionModelFallbackCandidates(params)) return await compactEmbeddedAgentSessionDirectOnce(params);
			const resolvedCompactionTarget = resolveEmbeddedCompactionTarget({
				config: params.config,
				provider: params.provider,
				modelId: params.model,
				authProfileId: params.authProfileId,
				modelSelectionLocked: params.modelSelectionLocked,
				defaultProvider: DEFAULT_PROVIDER,
				defaultModel: DEFAULT_MODEL
			});
			const primaryProvider = resolvedCompactionTarget.provider ?? "openai";
			const primaryModel = resolvedCompactionTarget.model ?? "gpt-5.6-sol";
			const requestedPrimaryProvider = params.provider?.trim() || "openai";
			const resolveAuthProvider = (provider) => resolveProviderIdForAuth(provider, {
				config: params.config,
				metadataSnapshot: preparedModelRuntime.metadataSnapshot
			});
			const primaryAuthProviders = new Set([primaryProvider, requestedPrimaryProvider].map(resolveAuthProvider));
			const fallbacksOverride = resolveCompactionFallbacksOverride(params);
			const resolvedPrimaryCandidate = resolveModelCandidateChain({
				cfg: params.config,
				manifestPlugins: preparedModelRuntime.metadataSnapshot.plugins,
				provider: primaryProvider,
				model: primaryModel,
				requestedRouteResolution: "resolved",
				fallbacksOverride
			})[0];
			const fallbackAgentId = resolveSessionAgentIds({
				sessionKey: params.sandboxSessionKey ?? params.sessionKey,
				config: params.config,
				agentId: params.agentId
			}).sessionAgentId;
			const fallbackSessionKey = params.sandboxSessionKey ?? params.sessionKey ?? params.sessionId;
			return (await runWithModelFallback({
				cfg: params.config,
				manifestPlugins: preparedModelRuntime.metadataSnapshot.plugins,
				provider: primaryProvider,
				model: primaryModel,
				requestedRouteResolution: "resolved",
				runId: params.runId ?? params.sessionId,
				agentDir: params.agentDir,
				agentId: fallbackAgentId,
				sessionId: params.sessionId,
				sessionKey: fallbackSessionKey,
				userLockedAuthProfileId: params.authProfileIdSource === "user" ? params.authProfileId : void 0,
				abortSignal: params.abortSignal,
				prepareAgentHarnessRuntime: async ({ provider, model, agentHarnessRuntimeOverride }) => {
					await ensureSelectedAgentHarnessPlugin({
						config: params.config,
						provider,
						modelId: model,
						agentId: fallbackAgentId,
						sessionKey: fallbackSessionKey,
						agentHarnessRuntimeOverride,
						workspaceDir: params.workspaceDir,
						pluginRegistry: preparedModelRuntime.pluginRegistry
					});
				},
				fallbacksOverride,
				classifyResult: ({ result, provider, model }) => classifyCompactionFallbackResult(result, provider, model),
				run: async (provider, model) => {
					const isPrimaryCandidate = provider === resolvedPrimaryCandidate?.provider && model === resolvedPrimaryCandidate.model;
					const preservesPrimaryAuth = isPrimaryCandidate || primaryAuthProviders.has(resolveAuthProvider(provider));
					const authProfileId = preservesPrimaryAuth ? params.authProfileId : void 0;
					return await compactEmbeddedAgentSessionDirectOnce({
						...params,
						provider,
						model,
						authProfileId,
						authProfileIdSource: preservesPrimaryAuth ? params.authProfileIdSource : void 0,
						runtimeAuthPlan: isPrimaryCandidate ? params.runtimeAuthPlan : void 0,
						runtimePlan: isPrimaryCandidate ? params.runtimePlan : void 0
					});
				}
			})).result;
		};
		return await withPluginRuntimeGenerationScope(preparedModelRuntime, compactPrepared);
	} catch (err) {
		return fallbackFailureToCompactionResult(err);
	} finally {
		preparedModelRuntimeLease.release();
	}
}
const testing = {
	compactNativeCliSession,
	hasRealConversationContent,
	hasMeaningfulConversationContent,
	containsRealConversationMessages,
	estimateTokensAfterCompaction,
	buildBeforeCompactionHookMetrics,
	resolveCompactionProviderStream,
	prepareCompactionSessionAgent,
	runBeforeCompactionHooks,
	runAfterCompactionHooks,
	runPostCompactionSideEffects
};
//#endregion
export { compactionCheckpointStore as a, resolveCompactionRuntimeSelection as c, resolveProjectKey as d, resolveTieredModel as i, asCompactionHookRunner as l, compactNativeCliSession as n, persistCompactionCheckpoint as o, testing as r, prepareCompactionHarnessAuth as s, compactEmbeddedAgentSessionDirect as t, runPostCompactionSideEffects as u };
