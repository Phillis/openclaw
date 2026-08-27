import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString, m as readNonBlankString, t as hasNonEmptyString } from "../../string-coerce-CIXf7egm.js";
import { t as asBoolean } from "../../boolean-DmBL0YJK.js";
import { F as resolveTimerTimeoutMs, o as asDateTimestampMs, s as asFiniteNumber } from "../../number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord, u as readStringField } from "../../record-coerce-DItp3I4t.js";
import { r as root } from "../../fs-safe-C9N8pCh1.js";
import { c as resolveUserPath } from "../../home-dir-DcrXWQPU.js";
import { r as formatErrorMessage } from "../../errors-CSNUPl5U.js";
import { g as resolveSessionAgentIds } from "../../agent-scope-BizOtGGz.js";
import { d as resolveAgentWorkspaceDir, l as resolveAgentDir } from "../../agent-scope-config-BdXMWufB.js";
import { t as isIncognitoSessionKey } from "../../incognito-session-key-BwpD1Lwd.js";
import { D as freezeDiagnosticTraceContext, T as createDiagnosticTraceContextFromActiveScope, h as onInternalDiagnosticEvent, o as emitTrustedDiagnosticEvent, s as emitTrustedDiagnosticEventWithPrivateData } from "../../diagnostic-events-Djn4AVRp.js";
import { n as MESSAGE_TOOL_DELIVERY_HINTS } from "../../message-tool-delivery-hints-8OSBEg_c.js";
import { i as emitAgentEvent } from "../../agent-events-Cmj8toCy.js";
import { l as resolveContextEngineOwnerPluginId } from "../../registry-BcgtD5p6.js";
import { t as FAST_MODE_AUTO_PROGRESS_KIND } from "../../reply-payload-DVcGHORx.js";
import { n as parseSqliteSessionFileMarker } from "../../legacy-sqlite-marker-COPKCuIN.js";
import { v as getBeforeToolCallPolicyDiagnosticState } from "../../agent-tools.before-tool-call-C_MzhwYQ.js";
import { r as markAuthProfileBlockedUntil } from "../../usage-B18_XzAh.js";
import { d as saveMediaBuffer } from "../../store-CNsqBmYb.js";
import { h as AgentHarnessPreflightError } from "../../failover-error-EKvoWJQa.js";
import { m as resolveAgentRunAbortLifecycleFields } from "../../run-termination-B0y7ra5H.js";
import { c as resolveFastModeForElapsed, n as formatFastModeAutoProgressText } from "../../fast-mode-CCX0YiYh.js";
import { C as setActiveEmbeddedRun, r as clearActiveEmbeddedRun } from "../../runs-CS8YarJf.js";
import { t as callGatewayTool } from "../../gateway-IJRNg5Ul.js";
import { n as resolveDiagnosticModelContentCapturePolicy } from "../../diagnostic-llm-content-CAc71KJ1.js";
import { K as loadExecApprovals } from "../../exec-approvals-DkNiV-ux.js";
import { c as emptyAgentHarnessUserInputAnswers, i as runAgentHarnessGatewayQuestion, n as claimPendingAgentQuestionAnswer, o as buildAgentHarnessUserInputAnswers, s as deliverAgentHarnessUserInputPrompt, t as cancelPendingAgentQuestionForSession } from "../../gateway-question-y5NFHODa.js";
import { n as isHostScopedAgentToolActive } from "../../agent-tools.ring-zero-context-C-QXByzs.js";
import { r as assertContextEngineHostSupport, t as CODEX_APP_SERVER_CONTEXT_ENGINE_HOST } from "../../host-compat-xESS3bi6.js";
import { t as log } from "../../logger-XkrUQwkD.js";
import { n as buildBootstrapContextForFiles, o as resolveBootstrapFilesForRun } from "../../bootstrap-files-DQdZlI4U.js";
import { n as resolveSandboxContext } from "../../context-BIHB56yZ.js";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "../../transcript-visibility-B9GTkD-g.js";
import { o as runAgentCleanupStep } from "../../settled-turn-finalization-result-CMMztFBa.js";
import { a as buildHarnessContextEngineRuntimeContext, c as isActiveHarnessContextEngine, i as bootstrapHarnessContextEngine, l as runHarnessContextEngineMaintenance, n as runAgentEndSideEffects, r as assembleHarnessContextEngine, t as awaitAgentEndSideEffects } from "../../agent-end-side-effects-Ic4K8Doi.js";
import { r as prepareMemorySystemPromptAddition } from "../../delegate-DWe3Wg4D.js";
import { r as resolveGeneratedMediaMaxBytes } from "../../configured-max-bytes-DkfKmiZP.js";
import { a as runAgentHarnessLlmInputHook, n as getAgentHarnessHookRunner, o as runAgentHarnessLlmOutputHook } from "../../lifecycle-hook-helpers-BIigCxgL.js";
import "../../session-store-runtime-BsqwEEwm.js";
import { n as supportsModelTools } from "../../model-tool-support-DIQSEumC.js";
import "../../number-runtime-CoAPZzJY.js";
import "../../string-coerce-runtime-D9ocX9lc.js";
import { c as loadCodexBundleMcpThreadConfig, h as runAgentHarnessBeforeCompactionHook, i as classifyAgentHarnessTerminalOutcome, l as materializeRequesterScopedMcpToolsForHarnessRun, m as runAgentHarnessAfterCompactionHook, n as agentHarnessAttemptTerminal, p as resolveAgentHarnessBeforePromptBuildResult, r as buildWatchedSessionsHarnessContext, u as prepareHarnessNativeMcpAppPreview } from "../../agent-harness-runtime-BqpueKZs.js";
import "../../agent-runtime-BgD3Qbvt.js";
import "../../exec-approvals-runtime-DVqaMbUB.js";
import { A as readCodexPluginConfig, C as resolveCodexComputerUseConfig, D as withMcpElicitationsApprovalPolicy, E as shouldAutoApproveCodexAppServerApprovals, I as resolveCodexModelBackedReviewerPolicyContext, L as isCodexAppServerApprovalPolicyAllowedByRequirements, O as isCodexRemoteExecPlacementSandbox, R as resolveOpenClawExecPolicyForCodexAppServer, _ as sessionBindingIdentity, b as resolveCodexAppServerHomeScope, g as scopeCodexRunBindingStore, h as resolveCodexRunSessionBindingAuthority, j as resolveCodexPluginsPolicy, k as isCodexSandboxExecServerEnabled, m as reclaimCurrentCodexSessionGeneration, o as createCodexSessionGenerationSupersededError } from "../../session-binding-BKWA8Z6K.js";
import { $ as rememberCodexRateLimitsRead, A as withCodexStartupTimeout, B as resolveCodexAppServerClientInstanceId, C as isCodexAppServerStartupError, D as resolveCodexTurnAssistantCompletionIdleTimeoutMs, E as resolveCodexStartupTimeoutMs, F as isCodexAppServerIndeterminateRequestCancellationError, I as isCodexAppServerIndeterminateTransportError, M as isCodexAppServerApprovalRequest, N as isCodexAppServerBrokenPipeError, O as resolveCodexTurnCompletionIdleTimeoutMs, P as isCodexAppServerConnectionClosedError, Q as readRecentCodexRateLimits, R as isCodexAppServerRequestTimeoutError, S as CodexAppServerStartupError, T as resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs, V as CodexAppServerRpcError, W as ensureCodexAppServerClientRuntime, Y as retainCodexAppServerLiveThread, Z as readCodexRateLimitsRevision, at as resolveCodexAppServerPreparedAuthHandoff, c as getSharedCodexAppServerClient, d as releaseLeasedSharedCodexAppServerClient, et as resolveCodexAppServerAuthAccountCacheKey, ft as resolveCodexAppServerHomeDir, g as retireSharedCodexAppServerClientIfCurrent, h as retainSharedCodexAppServerClientIfCurrent, i as clearSharedCodexAppServerClientIfCurrentAndUnclaimed, it as resolveCodexAppServerPreparedApiKeyCacheKey, j as getCodexAppServerClientInstanceId, k as resolveCodexTurnTerminalIdleTimeoutMs, l as isCodexAppServerStartSelectionChangedError, lt as flattenCodexDynamicToolFunctions, nt as resolveCodexAppServerAuthProfileIdForAgent, q as protectCodexAppServerLiveThread, r as clearSharedCodexAppServerClientIfCurrent, rt as resolveCodexAppServerFallbackApiKeyCacheKey, s as getLeasedSharedCodexAppServerClient, tt as resolveCodexAppServerAuthProfileId, ut as isJsonObject, v as withAbortableTimeout, x as CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS } from "../../shared-client-D6jNVc3R.js";
import "../../text-utility-runtime-LRU688AB.js";
import { o as createDeferred } from "../../extension-shared-BCgJMXly.js";
import { A as shouldSynthesizeToolProgressForItem, B as splitPlanText, E as itemStatus, F as readItemString, M as readCodexErrorNotificationMessage, O as shouldClearTerminalPresentationForNativeItem, P as readItem, R as readNonNegativeInteger, T as itemName, a as closeCodexStartupClientBestEffort, d as unsubscribeCodexThreadBestEffort, f as CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS, g as readCodexNotificationThreadId, h as isCodexNotificationForTurn, j as extractRawAssistantText, l as retireCodexAppServerClientAfterTimedOutTurn, m as CodexProjectionDiagnostics, o as interruptCodexTurnAndWaitBestEffort, p as getCodexAppServerTurnRouter, r as CodexAppServerUnsafeSubscriptionError, t as CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS, u as retireUnsafeCodexTurnClientBestEffort, z as readNullableString } from "../../attempt-client-cleanup-CkbyvOpN.js";
import { C as readRawResponseToolCallId, E as updateActiveTurnItemIds, S as readNotificationItemId, T as updateActiveCompletionBlockerItemIds, _ as isReasoningItemCompletionNotification, a as codexExecutionToolName, b as isTerminalTurnStatus, c as isAssistantCompletionReleaseNotification, d as isNativeToolProgressNotification, f as isPendingOpenClawDynamicToolCompletionNotification, g as isRawToolOutputCompletionNotification, h as isRawReasoningCompletionNotification, l as isCodexTurnAbortMarkerNotification, m as isRawFunctionToolOutputCompletionNotification, o as describeNotificationActivity, p as isRawAssistantProgressNotification, r as projectCodexThreadUsageUpdate, s as isAssistantCommentaryCompletionNotification, t as CodexResponseCompletionProjection, u as isFileChangePatchUpdatedNotification, v as isReasoningProgressNotification, w as shouldDisarmAssistantCompletionIdleWatch, x as readCodexNotificationItem, y as isRetryableErrorNotification } from "../../event-projector-usage-8baZc843.js";
import { A as resolveRecoverableCodexPluginConfigKeys, B as resolveCodexContextEngineProjectionReserveTokens, C as mergeCodexThreadConfigs, F as isContextEngineBindingCompatible, I as fitCodexProjectedContextForTurnStart, L as neutralizeCodexExplicitMentionSigils, M as codexDynamicToolsFingerprint, N as codexLegacyDynamicToolsFingerprint, P as buildContextEngineBinding, R as projectContextEngineAssemblyForCodex, S as buildPluginAppPolicyContext, U as resolveCodexWebSearchPlan, V as isCodexAppServerProfilerEnabled, W as filterCodexDynamicTools, X as resolveCodexDynamicToolsLoadingForRuntime, Z as buildCodexUserInput, _ as buildCodexPluginAppsConfigPatchFromPolicyContext, b as buildCodexPluginThreadConfigTimeoutFallback, j as areCodexDynamicToolFingerprintsCompatible, l as buildDeveloperInstructions, n as buildTurnStartParams, p as resolveCodexAppServerThreadModelSelection, q as isSystemAgentOnlyCodexDynamicToolAllowlist, r as startOrResumeThread, t as buildTurnCollaborationMode, v as buildCodexPluginThreadConfig, w as shouldBuildCodexPluginThreadConfig, y as buildCodexPluginThreadConfigInputFingerprint, z as resolveCodexContextEngineProjectionMaxChars } from "../../thread-lifecycle-CWQ_B05h.js";
import { t as resolveCodexLocalRuntimeAttribution } from "../../local-runtime-attribution-DPk90pCh.js";
import { n as createAssistantMessage, r as createAssistantMirrorMessage, t as createAssistantCommentaryMessage } from "../../event-projector-assistant-message-BGzFSXon.js";
import { a as CodexToolProgressProjection, c as isCodexCommandBearingToolCall, d as sanitizeCodexToolResponse, i as readCodexMirroredSessionHistoryMessages, l as resolveCodexToolProgressDetailMode, n as CodexEventProjection, o as shouldEmitTranscriptToolProgress, r as CodexToolTranscriptProjection, s as inferCodexDynamicToolMeta, t as codexNativeSubagentMonitorRuntime, u as sanitizeCodexToolArguments } from "../../native-subagent-monitor-B20UT5b9.js";
import { i as readUpstreamUserText, n as attachUpstreamUserText, r as readMirrorIdentity, t as attachCodexMirrorIdentity } from "../../upstream-prompt-provenance-ClRBije0.js";
import { n as generatedImageAssetFromBase64 } from "../../image-generation-BKrw4Qw3.js";
import "../../media-generation-runtime-DjIirQyy.js";
import "../../media-store-DwVYtNFY.js";
import "../../diagnostic-runtime-D8PDaSTa.js";
import { A as buildCodexNativeHookRelayDisabledConfig, B as resolveDynamicToolCallTimeoutMs, C as shouldWarnCodexDynamicToolBuildStageSummary, E as CodexNativeToolLifecycleProjector, F as scheduleCodexNativeHookRelayUnregister, G as toCodexDynamicToolProtocolResponse, H as shouldBlockTerminalReleaseForNonTerminalDynamicToolResult, I as handleDynamicToolCallWithTimeout, K as resolveCodexToolAbortTerminalReason, L as hasPendingDynamicToolTerminalDiagnostic, M as emitCodexNativePreToolUseFailureDiagnostic, N as resolveCodexNativeHookRelayEvents, O as CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS, P as resolveCodexNativeHookRelayTtlMs, R as isDynamicToolTerminalDiagnosticEvent, S as shouldRequireCodexSandboxExecServerEnvironment, T as readBoundedCodexRemoteWorkspaceFile, U as shouldReleaseTurnAfterTerminalDynamicTool, V as resolveTerminalDynamicToolBatchAction, W as toCodexDynamicToolProgressResponse, _ as resolveCodexAppServerHookChannelId, a as emitDynamicToolStartedDiagnostic, b as resolveCodexSandboxEnvironmentSelection, c as resolveCodexProviderWebSearchSupport, d as releaseCodexSandboxExecServerEnvironment, f as buildDynamicTools, g as resolveCodexAppServerExecutionCwd, h as formatCodexDynamicToolBuildStageSummary, i as emitDynamicToolErrorDiagnostic, j as createCodexNativeHookRelay, k as buildCodexNativeHookRelayConfig, m as disableCodexPluginThreadConfig, n as projectCodexExecutableDynamicTools, o as emitDynamicToolTerminalDiagnostic, p as createCodexDynamicToolBuildStageTracker, r as handleCodexAppServerElicitationRequest, s as handleCodexAppServerApprovalRequest, t as createCodexDynamicToolBridge, u as ensureCodexSandboxExecServerEnvironment, v as resolveCodexExternalSandboxPolicyForOpenClawSandbox, x as shouldEnableCodexAppServerNativeToolSurface, y as resolveCodexMessageToolProvider, z as isMatchingDynamicToolTerminalDiagnostic } from "../../dynamic-tools-DYqJv-0a.js";
import { l as readCodexTurn, o as assertCodexTurnStartResponse, s as readCodexDynamicToolCallParams, u as readCodexTurnCompletedNotification } from "../../protocol-validators-DQMpwHD0.js";
import { d as promptSnapshot, i as mirrorPromptAtTurnStartBestEffort, n as createCodexAppServerUserMessagePersistenceNotifier, o as readCodexMirrorSourceFingerprint, s as serializeCodexMirrorSourceEvidence, t as codexTranscriptMirrorRuntime, u as buildCodexUserPromptMessage } from "../../transcript-mirror-pCbfAPp4.js";
import { a as shouldRefreshCodexRateLimitsForUsageLimitMessage, i as resolveCodexUsageLimitResetAtMs, n as formatCodexUsageLimitErrorMessage } from "../../rate-limits-BeB13CFF.js";
import { t as CODEX_CONTROL_METHODS } from "../../capabilities-BbZiceud.js";
import "../../file-access-runtime-B-jWpmG-.js";
import { r as formatCodexDisplayText } from "../../command-formatters-CoGMIjeC.js";
import "../../incognito-session-DoO9V_or.js";
import { n as resolveCodexAppServerForOpenClawToolPolicy, t as resolveCodexAppServerForModelProvider } from "../../app-server-policy-zqAoixGQ.js";
import { i as defaultCodexAppInventoryCache, n as buildCodexAppServerRuntimeFingerprint, r as buildCodexPluginAppCacheKey } from "../../plugin-app-cache-key-DeAxg-cb.js";
import { n as resolveCodexBindingAppServerConnection } from "../../binding-connection-Bo1-WdPX.js";
import { i as resolveCodexMcpToolOverridesForAgent } from "../../bundle-mcp-codex-B_a7gOZx.js";
import { n as materializeStaticMcpToolsForScheduledHarnessRun, t as captureFinalCodexCronCreatorToolAllowlist } from "../../codex-mcp-projection-f7Q9dzT7.js";
import "../../core-Bqt7fa3M.js";
import { n as prepareCodexAppServerAuthBinding } from "../../auth-binding-D88MiSes.js";
import { a as runCodexComputerUseLiveTest, n as ensureCodexComputerUse, o as killStaleComputerUseMcpChildren, t as defaultCodexPluginMetadataCache } from "../../plugin-metadata-cache-BqDOXQ-V.js";
import crypto, { createHash } from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/codex/src/app-server/attempt-steering.ts
/**
* Debounced steering queue for forwarding user messages to an active Codex
* app-server turn.
*/
const CODEX_STEER_ALL_DEBOUNCE_MS = 500;
var CodexSteeringAcceptedUnconfirmedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexSteeringAcceptedUnconfirmedError";
	}
};
/**
* Creates a queue that batches steer messages while still serializing
* app-server `turn/steer` requests.
*/
function createCodexSteeringQueue(params) {
	let batchedMessages = [];
	const dispatchedBatches = /* @__PURE__ */ new Map();
	const pendingMessages = /* @__PURE__ */ new Set();
	let batchTimer;
	let batchSequence = 0;
	let sendChain = Promise.resolve();
	let sealedError;
	let closedError;
	const clearBatchTimer = () => {
		if (batchTimer) {
			clearTimeout(batchTimer);
			batchTimer = void 0;
		}
	};
	const reportItemAcceptance = (item, accepted) => {
		if (item.acceptance !== "open") return;
		item.acceptance = accepted ? "accepted" : "rejected";
		item.onQueueAccepted?.(accepted);
	};
	const resolveItem = (item) => {
		if (item.settled) return;
		reportItemAcceptance(item, true);
		item.settled = true;
		pendingMessages.delete(item);
		item.resolve();
	};
	const rejectItem = (item, error) => {
		if (item.settled) return;
		item.settled = true;
		pendingMessages.delete(item);
		reportItemAcceptance(item, false);
		item.reject(item.acceptance === "accepted" ? new CodexSteeringAcceptedUnconfirmedError("Codex accepted steering but did not confirm transcript consumption", { cause: error }) : error);
	};
	const closeQueue = (error) => {
		if (closedError) return;
		closedError = error;
		params.signal.removeEventListener("abort", abortQueue);
		clearBatchTimer();
		batchedMessages = [];
		for (const batch of dispatchedBatches.values()) for (const item of batch.items) reportItemAcceptance(item, true);
		dispatchedBatches.clear();
		for (const item of pendingMessages) rejectItem(item, error);
	};
	const sealQueueAdmission = () => {
		if (sealedError || closedError) return;
		sealedError = /* @__PURE__ */ new Error("codex app-server steering queue admission sealed");
		clearBatchTimer();
		batchedMessages = [];
		const dispatchedItems = new Set([...dispatchedBatches.values()].flatMap((batch) => batch.items));
		for (const item of pendingMessages) if (!dispatchedItems.has(item)) rejectItem(item, sealedError);
	};
	const abortQueue = () => {
		closeQueue(/* @__PURE__ */ new Error("codex app-server steering queue aborted"));
	};
	const cancelQueue = () => {
		closeQueue(/* @__PURE__ */ new Error("codex app-server steering queue cancelled"));
	};
	const sendBatch = async (items) => {
		const liveItems = items.filter((item) => !item.settled);
		if (liveItems.length === 0) return;
		const unavailableError = closedError ?? sealedError ?? (params.signal.aborted ? /* @__PURE__ */ new Error("codex app-server steering queue aborted") : void 0);
		if (unavailableError) {
			for (const item of liveItems) rejectItem(item, unavailableError);
			throw unavailableError;
		}
		const clientUserMessageId = `openclaw:${params.turnId}:steer:${++batchSequence}`;
		const batch = { items: liveItems };
		dispatchedBatches.set(clientUserMessageId, batch);
		try {
			await params.client.request("turn/steer", {
				threadId: params.threadId,
				expectedTurnId: params.turnId,
				input: liveItems.flatMap((item) => buildCodexUserInput(item.text, item.images)),
				clientUserMessageId
			}, {
				timeoutMs: params.requestTimeoutMs,
				signal: params.signal
			});
			for (const item of liveItems) reportItemAcceptance(item, true);
		} catch (error) {
			dispatchedBatches.delete(clientUserMessageId);
			const acceptedUnconfirmed = isCodexAppServerIndeterminateRequestCancellationError(error) || isCodexAppServerIndeterminateTransportError(error);
			for (const item of liveItems) {
				if (acceptedUnconfirmed) reportItemAcceptance(item, true);
				rejectItem(item, error);
			}
			throw error;
		}
	};
	const enqueueSend = (items) => {
		const send = sendChain.then(() => sendBatch(items));
		sendChain = send;
		send.catch((error) => {
			for (const item of items) rejectItem(item, error);
			log.debug("codex app-server queued steer failed", { error });
		});
		return send;
	};
	const flushBatch = () => {
		clearBatchTimer();
		const items = batchedMessages;
		batchedMessages = [];
		if (items.length === 0) return sendChain;
		const send = enqueueSend(items);
		send.catch(() => void 0);
		return send;
	};
	const createPendingMessage = (text, options) => {
		let resolveDelivery;
		let rejectDelivery;
		const delivery = new Promise((resolve, reject) => {
			resolveDelivery = resolve;
			rejectDelivery = reject;
		});
		const item = {
			acceptance: "open",
			text,
			images: options?.images,
			onQueueAccepted: options?.onQueueAccepted,
			resolve: resolveDelivery,
			reject: rejectDelivery,
			settled: false
		};
		pendingMessages.add(item);
		return {
			item,
			delivery
		};
	};
	params.signal.addEventListener("abort", abortQueue, { once: true });
	if (params.signal.aborted) abortQueue();
	return {
		async queue(text, options) {
			const unavailableError = closedError ?? sealedError ?? (params.signal.aborted ? /* @__PURE__ */ new Error("codex app-server steering queue aborted") : void 0);
			if (unavailableError) {
				options?.onQueueAccepted?.(false);
				throw unavailableError;
			}
			const pendingUserInput = options?.isInboundUserMessage === true ? params.claimPendingUserInput() : void 0;
			if (pendingUserInput) {
				if (!options?.images?.length) {
					const answered = pendingUserInput.answer(text);
					options?.onQueueAccepted?.(answered);
					if (!answered) throw new Error("codex pending user input rejected the answer");
					return;
				}
				flushBatch().catch(() => void 0);
				const { item, delivery } = createPendingMessage(text, options);
				await Promise.all([enqueueSend([item]).finally(() => pendingUserInput.cancel()), delivery]);
				return;
			}
			const { item, delivery } = createPendingMessage(text, options);
			batchedMessages.push(item);
			clearBatchTimer();
			const debounceMs = normalizeCodexSteerDebounceMs(options?.debounceMs);
			if (debounceMs === 0) flushBatch();
			else batchTimer = setTimeout(() => {
				batchTimer = void 0;
				flushBatch();
			}, debounceMs);
			return await delivery;
		},
		confirmConsumed(clientUserMessageId) {
			const batch = dispatchedBatches.get(clientUserMessageId);
			if (!batch) return false;
			dispatchedBatches.delete(clientUserMessageId);
			for (const item of batch.items) resolveItem(item);
			return true;
		},
		sealAdmission: sealQueueAdmission,
		cancel: cancelQueue
	};
}
/** Normalizes steer debounce milliseconds, preserving explicit zero. */
function normalizeCodexSteerDebounceMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value >= 0 ? Math.floor(value) : CODEX_STEER_ALL_DEBOUNCE_MS;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-assistant.ts
var CodexAssistantProjection = class {
	constructor(params, emitAgentEvent, matchesToolProgressEcho, nextTranscriptTimestamp) {
		this.params = params;
		this.emitAgentEvent = emitAgentEvent;
		this.matchesToolProgressEcho = matchesToolProgressEcho;
		this.nextTranscriptTimestamp = nextTranscriptTimestamp;
		this.assistantTextByItem = /* @__PURE__ */ new Map();
		this.assistantItemOrder = [];
		this.assistantTimestampByItem = /* @__PURE__ */ new Map();
		this.assistantPhaseByItem = /* @__PURE__ */ new Map();
		this.latestTerminalAssistantCandidateSuperseded = false;
		this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff = false;
		this.terminalAssistantCandidateEarlierActiveItemIds = /* @__PURE__ */ new Set();
		this.lastCommentaryProgressTextByItem = /* @__PURE__ */ new Map();
		this.lastAnswerCandidateEventByItem = /* @__PURE__ */ new Map();
		this.pendingRawCommentaryEchoes = 0;
		this.rawPromotedAssistantItemIds = /* @__PURE__ */ new Set();
		this.assistantStarted = false;
		this.streamedPartialAssistantItemReplaceable = false;
	}
	hasCompletedTerminalAssistantText(completedItemIds) {
		const latestCompletedItemId = this.latestCompletedTerminalAssistantItemId;
		if (!latestCompletedItemId) return false;
		const finalItem = this.resolveFinalAssistantTextItem();
		return this.latestCompletedItemId === latestCompletedItemId && finalItem?.itemId === latestCompletedItemId && completedItemIds.has(latestCompletedItemId);
	}
	getLatestTerminalAssistantCandidate() {
		const itemId = this.latestTerminalAssistantCandidateItemId;
		if (!itemId) return;
		const text = this.assistantTextByItem.get(itemId)?.trim();
		return {
			itemId,
			hasText: Boolean(text && !this.isToolProgressEchoText(itemId, text))
		};
	}
	hasLatestTerminalAssistantCandidateText() {
		return !this.latestTerminalAssistantCandidateSuperseded && this.getLatestTerminalAssistantCandidate()?.hasText === true;
	}
	canReleaseLatestTerminalAssistantAfterToolHandoff() {
		return this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff && this.hasLatestTerminalAssistantCandidateText();
	}
	handleNotification(method, params) {
		if (method === "model/rerouted") this.responseModel = readStringField(params, "toModel") ?? this.responseModel;
	}
	async handleAssistantDelta(params) {
		const itemId = readStringField(params, "itemId") ?? "assistant";
		const delta = readStringField(params, "delta") ?? "";
		if (!delta) return;
		if (itemId !== this.pendingRawTerminalAssistantEchoItemId) this.pendingRawTerminalAssistantEchoItemId = void 0;
		const isCommentary = this.isCommentaryAssistantItem(itemId);
		if (!isCommentary && itemId !== this.latestTerminalAssistantCandidateItemId) this.markTerminalAssistantCandidateSupersededBy();
		if (!this.assistantStarted) {
			this.assistantStarted = true;
			await this.params.onAssistantMessageStart?.();
		}
		this.rememberAssistantItem(itemId);
		const text = `${this.assistantTextByItem.get(itemId) ?? ""}${delta}`;
		this.assistantTextByItem.set(itemId, text);
		if (isCommentary) {
			this.emitCommentaryProgress({
				itemId,
				text
			});
			return;
		}
		if (this.isFinalAnswerAssistantItem(itemId)) this.emitAnswerCandidate(itemId, "candidate");
		const knownFinalAnswer = this.shouldStreamAssistantPartial(itemId);
		const replace = this.streamedPartialAssistantItemId !== void 0 && this.streamedPartialAssistantItemId !== itemId;
		if (replace && (!knownFinalAnswer || this.streamedPartialAssistantItemReplaceable)) this.streamedPartialAssistantItemReplaceable = true;
		else if (this.streamedPartialAssistantItemId === void 0) this.streamedPartialAssistantItemReplaceable = !knownFinalAnswer;
		this.streamedPartialAssistantItemId = itemId;
		const replaceable = this.streamedPartialAssistantItemReplaceable;
		const replacement = replace && replaceable;
		const streamPayload = {
			text,
			delta: replacement ? "" : delta,
			...replacement ? { replace: true } : {}
		};
		this.emitAgentEvent({
			stream: "assistant",
			data: {
				...streamPayload,
				...replaceable ? { replaceable: true } : {}
			}
		});
		if (knownFinalAnswer && !replaceable) await this.params.onPartialReply?.(streamPayload);
	}
	recordItemStarted(item, itemId) {
		if (item?.type === "agentMessage" && itemId && itemId !== this.pendingRawTerminalAssistantEchoItemId) this.pendingRawTerminalAssistantEchoItemId = void 0;
		this.rememberAssistantPhase(item);
		if (item?.type === "agentMessage" && itemId) this.rememberAssistantItem(itemId);
		if (itemId && itemId !== this.latestTerminalAssistantCandidateItemId) {
			this.markTerminalAssistantCandidateSupersededBy(itemId, { preserveEarlierActiveItem: true });
			if (this.latestTerminalAssistantCandidateSuperseded) this.pendingRawTerminalAssistantEchoItemId = void 0;
		}
	}
	recordItemCompleted(item, itemId, activeItemIds) {
		if (item?.type === "agentMessage" && itemId && itemId !== this.pendingRawTerminalAssistantEchoItemId) this.pendingRawTerminalAssistantEchoItemId = void 0;
		if (itemId) this.latestCompletedItemId = itemId;
		this.rememberAssistantPhase(item);
		if (item?.type === "agentMessage" && !this.isCommentaryAssistantItem(item.id)) {
			this.latestCompletedTerminalAssistantItemId = item.id;
			this.markLatestTerminalAssistantCandidate(item.id, activeItemIds);
			this.pendingRawTerminalAssistantEchoItemId = item.id;
		} else if (itemId) {
			this.markTerminalAssistantCandidateSupersededBy(itemId, { preserveEarlierActiveItem: true });
			if (this.latestTerminalAssistantCandidateSuperseded) this.pendingRawTerminalAssistantEchoItemId = void 0;
		}
		if (item?.type === "agentMessage" && typeof item.text === "string") {
			this.rememberAssistantItem(item.id);
			this.assistantTextByItem.set(item.id, item.text);
			if (item.text && this.isCommentaryAssistantItem(item.id)) {
				this.emitCommentaryProgress({
					itemId: item.id,
					text: item.text
				});
				this.pendingRawCommentaryEchoes += 1;
			} else if (item.text && this.isFinalAnswerAssistantItem(item.id)) this.emitAnswerCandidate(item.id, "candidate");
		}
	}
	recordSnapshotItem(item) {
		this.rememberAssistantPhase(item);
		if (item.type === "agentMessage" && typeof item.text === "string") {
			this.rememberAssistantItem(item.id);
			this.assistantTextByItem.set(item.id, item.text);
		}
	}
	handleRawResponseItemCompleted(item, activeItemIds) {
		const role = readStringField(item, "role");
		const phase = readStringField(item, "phase");
		const rawItemId = readStringField(item, "id");
		const candidateWasSupersededBeforeRaw = this.latestTerminalAssistantCandidateSuperseded;
		const pendingTerminalAssistantEchoItemId = this.pendingRawTerminalAssistantEchoItemId;
		const isPendingTerminalAssistantEcho = role === "assistant" && phase !== "commentary" && pendingTerminalAssistantEchoItemId !== void 0 && (rawItemId === void 0 || rawItemId === pendingTerminalAssistantEchoItemId);
		if (pendingTerminalAssistantEchoItemId !== void 0 && !isPendingTerminalAssistantEcho) this.pendingRawTerminalAssistantEchoItemId = void 0;
		if (!isPendingTerminalAssistantEcho) {
			this.latestCompletedItemId = void 0;
			this.markTerminalAssistantCandidateSupersededBy(rawItemId);
		}
		if (role !== "assistant") return;
		if (phase === "commentary" && this.pendingRawCommentaryEchoes > 0) {
			this.pendingRawCommentaryEchoes -= 1;
			return;
		}
		const text = extractRawAssistantText(item);
		if (isPendingTerminalAssistantEcho) {
			const typedItemId = pendingTerminalAssistantEchoItemId;
			this.pendingRawTerminalAssistantEchoItemId = void 0;
			if (this.assistantTextByItem.get(typedItemId)?.trim() || !text) return;
			this.rememberAssistantItem(typedItemId);
			this.assistantTextByItem.set(typedItemId, text);
			return;
		}
		if (text === void 0 || !text && (phase === "commentary" || activeItemIds.size > 0 || readStringField(item, "type") !== "message")) return;
		const itemId = rawItemId ?? `raw-assistant-${this.assistantItemOrder.length + 1}`;
		const isIdlessTerminalAssistantAfterCompletedWork = candidateWasSupersededBeforeRaw && rawItemId === void 0 && pendingTerminalAssistantEchoItemId === void 0 && activeItemIds.size === 0;
		if (text && phase !== "commentary" && candidateWasSupersededBeforeRaw && itemId !== this.streamedPartialAssistantItemId && !isIdlessTerminalAssistantAfterCompletedWork) return;
		if (phase) this.assistantPhaseByItem.set(itemId, phase);
		this.rememberAssistantItem(itemId);
		this.assistantTextByItem.set(itemId, text);
		if (!text) return;
		this.rawPromotedAssistantItemIds.add(itemId);
		if (phase === "commentary") this.emitCommentaryProgress({
			itemId,
			text
		});
		else this.markLatestTerminalAssistantCandidate(itemId, activeItemIds, { canReleaseAfterToolHandoff: isIdlessTerminalAssistantAfterCompletedWork });
	}
	collectAssistantTexts() {
		const finalText = this.resolveFinalAssistantTextItem()?.text;
		return finalText ? [finalText] : [];
	}
	collectCommentaryMessages() {
		return this.assistantItemOrder.flatMap((itemId) => {
			if (!this.isCommentaryAssistantItem(itemId)) return [];
			const text = this.assistantTextByItem.get(itemId)?.trim();
			const timestamp = this.assistantTimestampByItem.get(itemId);
			if (!text || timestamp === void 0) return [];
			return [{
				itemId,
				message: createAssistantCommentaryMessage(this.params, text, itemId, timestamp)
			}];
		});
	}
	finalizeAnswerCandidate(turn) {
		if (turn.status !== "completed") {
			this.supersedeVisibleAnswerCandidate();
			return;
		}
		const turnItems = turn.items ?? [];
		const authoritativeIndex = turnItems.findLastIndex((item) => {
			if (item.type !== "agentMessage" || typeof item.text !== "string" || item.text.trim().length === 0) return false;
			const phase = readItemString(item, "phase");
			return phase === "final_answer" || phase === void 0;
		});
		const authoritative = authoritativeIndex >= 0 ? turnItems[authoritativeIndex] : void 0;
		if (turnItems.slice(authoritativeIndex + 1).some(shouldClearTerminalPresentationForNativeItem) || authoritative?.id === this.latestTerminalAssistantCandidateItemId && this.latestTerminalAssistantCandidateSuperseded) {
			this.supersedeVisibleAnswerCandidate();
			return;
		}
		const itemId = authoritative?.id ?? this.visibleAnswerCandidateItemId;
		if (!itemId) return;
		if (itemId !== this.visibleAnswerCandidateItemId) {
			this.supersedeVisibleAnswerCandidate();
			this.visibleAnswerCandidateItemId = itemId;
		}
		this.emitAnswerCandidate(itemId, "selected");
	}
	hasAssistantItemTextForSynthesis() {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId || this.assistantPhaseByItem.get(itemId) === "commentary") continue;
			const text = this.assistantTextByItem.get(itemId);
			if (text && text.length > 0) return true;
		}
		return false;
	}
	createCurrentAttemptAssistantMessage(options) {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId || this.isCommentaryAssistantItem(itemId) || !this.assistantTextByItem.has(itemId)) continue;
			const text = this.assistantTextByItem.get(itemId) ?? "";
			const normalizedText = text.trim();
			if (normalizedText && this.isToolProgressEchoText(itemId, normalizedText)) continue;
			return this.createAssistantMessage(text, options);
		}
	}
	createAssistantMessage(text, options) {
		const message = createAssistantMessage(this.params, text, options);
		return this.responseModel ? {
			...message,
			responseModel: this.responseModel
		} : message;
	}
	createAssistantMirrorMessage(title, text) {
		return createAssistantMirrorMessage(this.params, title, text);
	}
	rememberAssistantPhase(item) {
		if (item?.type !== "agentMessage") return;
		const phase = readItemString(item, "phase");
		if (phase) this.assistantPhaseByItem.set(item.id, phase);
	}
	isCommentaryAssistantItem(itemId) {
		return this.assistantPhaseByItem.get(itemId) === "commentary";
	}
	isFinalAnswerAssistantItem(itemId) {
		return this.assistantPhaseByItem.get(itemId) === "final_answer";
	}
	shouldStreamAssistantPartial(itemId) {
		return this.assistantPhaseByItem.get(itemId) === "final_answer";
	}
	emitCommentaryProgress(params) {
		const progressText = params.text.replace(/\s+/g, " ").trim();
		if (!progressText || this.lastCommentaryProgressTextByItem.get(params.itemId) === progressText) return;
		this.lastCommentaryProgressTextByItem.set(params.itemId, progressText);
		this.emitAgentEvent({
			stream: "item",
			data: {
				itemId: params.itemId,
				kind: "preamble",
				title: "Preamble",
				phase: "update",
				progressText,
				source: "codex-app-server"
			}
		});
	}
	emitAnswerCandidate(itemId, status) {
		const text = this.assistantTextByItem.get(itemId)?.trim();
		if (!text) return;
		if (status === "candidate" && this.visibleAnswerCandidateItemId !== itemId) {
			this.supersedeVisibleAnswerCandidate();
			this.visibleAnswerCandidateItemId = itemId;
		}
		const signature = `${status}\0${text}`;
		if (this.lastAnswerCandidateEventByItem.get(itemId) === signature) return;
		this.lastAnswerCandidateEventByItem.set(itemId, signature);
		this.emitAgentEvent({
			stream: "item",
			data: {
				itemId,
				kind: "answer_candidate",
				title: "Answer candidate",
				phase: "update",
				status,
				progressText: text,
				source: "codex-app-server",
				hideFromChannelProgress: true
			}
		});
	}
	supersedeVisibleAnswerCandidate() {
		const itemId = this.visibleAnswerCandidateItemId;
		if (!itemId) return;
		this.emitAnswerCandidate(itemId, "superseded");
		this.visibleAnswerCandidateItemId = void 0;
	}
	markLatestTerminalAssistantCandidate(itemId, activeItemIds, options) {
		this.latestTerminalAssistantCandidateItemId = itemId;
		this.latestTerminalAssistantCandidateSuperseded = false;
		this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff = options?.canReleaseAfterToolHandoff === true;
		this.terminalAssistantCandidateEarlierActiveItemIds = new Set(activeItemIds);
	}
	markTerminalAssistantCandidateSupersededBy(itemId, options) {
		if (!this.latestTerminalAssistantCandidateItemId) return;
		if (itemId && this.terminalAssistantCandidateEarlierActiveItemIds.has(itemId)) {
			if (!options?.preserveEarlierActiveItem) this.terminalAssistantCandidateEarlierActiveItemIds.delete(itemId);
			return;
		}
		this.latestTerminalAssistantCandidateSuperseded = true;
		this.latestTerminalAssistantCandidateCanReleaseAfterToolHandoff = false;
		this.terminalAssistantCandidateEarlierActiveItemIds.clear();
		this.supersedeVisibleAnswerCandidate();
	}
	resolveFinalAssistantTextItem() {
		for (let i = this.assistantItemOrder.length - 1; i >= 0; i -= 1) {
			const itemId = this.assistantItemOrder[i];
			if (!itemId) continue;
			const text = this.assistantTextByItem.get(itemId)?.trim();
			if (this.assistantPhaseByItem.get(itemId) === "commentary") continue;
			if (text && !this.isToolProgressEchoText(itemId, text)) return {
				itemId,
				text
			};
		}
	}
	rememberAssistantItem(itemId) {
		if (!itemId || this.assistantItemOrder.includes(itemId)) return;
		this.assistantItemOrder.push(itemId);
		this.assistantTimestampByItem.set(itemId, this.nextTranscriptTimestamp());
	}
	isToolProgressEchoText(itemId, text) {
		return this.rawPromotedAssistantItemIds.has(itemId) && this.matchesToolProgressEcho(text);
	}
};
//#endregion
//#region extensions/codex/src/app-server/event-projector-media.ts
const GENERATED_IMAGE_MEDIA_SUBDIR = "tool-image-generation";
var CodexGeneratedMediaProjection = class {
	constructor(config, remote) {
		this.config = config;
		this.remote = remote;
		this.itemIds = /* @__PURE__ */ new Set();
		this.urlsByItemId = /* @__PURE__ */ new Map();
		this.gatewayMaterializedItemIds = /* @__PURE__ */ new Set();
		this.pendingMaterializationsByItemId = /* @__PURE__ */ new Map();
	}
	hasGeneratedMedia() {
		return this.itemIds.size > 0;
	}
	async recordNative(item) {
		if (item?.type !== "imageGeneration") return;
		this.itemIds.add(item.id);
		const result = readItemString(item, "result");
		if (result) {
			await this.recordImage({
				itemId: item.id,
				result,
				revisedPrompt: readItemString(item, "revisedPrompt"),
				source: "native"
			});
			return;
		}
		const savedPath = readItemString(item, "savedPath")?.trim();
		if (savedPath) {
			if (this.remote?.remoteWorkspaceRoot) {
				if (!this.remote.readFile) {
					log.warn("codex remote image has no app-server file transfer", { itemId: item.id });
					return;
				}
				try {
					const response = await this.remote.readFile({
						path: savedPath,
						maxBytes: resolveGeneratedMediaMaxBytes(this.config, "image"),
						signal: this.remote.signal,
						timeoutMs: this.remote.requestTimeoutMs
					});
					if (!response || typeof response.dataBase64 !== "string" || !response.dataBase64) {
						log.warn("codex remote image file returned no inline bytes", { itemId: item.id });
						return;
					}
					await this.recordImage({
						itemId: item.id,
						result: response.dataBase64,
						revisedPrompt: readItemString(item, "revisedPrompt"),
						source: "native"
					});
				} catch (error) {
					log.warn("codex app-server remote image file read failed", {
						itemId: item.id,
						error
					});
				}
				return;
			}
			this.recordUrl({
				itemId: item.id,
				mediaUrl: savedPath
			});
		}
	}
	async recordRaw(item) {
		if (readStringField(item, "type") !== "image_generation_call") return;
		const result = readStringField(item, "result");
		if (!result) return;
		const itemId = readStringField(item, "id") ?? `raw-image-${this.itemIds.size}`;
		await this.recordImage({
			itemId,
			result,
			revisedPrompt: readStringField(item, "revised_prompt") ?? readStringField(item, "revisedPrompt"),
			source: "raw"
		});
	}
	async recordImage(params) {
		this.itemIds.add(params.itemId);
		if (this.gatewayMaterializedItemIds.has(params.itemId)) return;
		let pending = this.pendingMaterializationsByItemId.get(params.itemId);
		while (pending) {
			await pending;
			if (this.gatewayMaterializedItemIds.has(params.itemId)) return;
			pending = this.pendingMaterializationsByItemId.get(params.itemId);
		}
		const materialization = this.materializeImage(params);
		this.pendingMaterializationsByItemId.set(params.itemId, materialization);
		try {
			await materialization;
		} finally {
			if (this.pendingMaterializationsByItemId.get(params.itemId) === materialization) this.pendingMaterializationsByItemId.delete(params.itemId);
		}
	}
	async materializeImage(params) {
		const maxBytes = resolveGeneratedMediaMaxBytes(this.config, "image");
		const estimatedDecodedBytes = estimateBase64DecodedBytes(params.result);
		if (estimatedDecodedBytes !== void 0 && estimatedDecodedBytes > maxBytes) {
			log.warn(`codex app-server ${params.source} image generation result exceeds media limit`, {
				itemId: params.itemId,
				estimatedDecodedBytes,
				maxBytes
			});
			return;
		}
		const asset = generatedImageAssetFromBase64({
			base64: params.result,
			index: this.itemIds.size,
			revisedPrompt: params.revisedPrompt,
			fileNamePrefix: "codex-image-generation",
			sniffMimeType: true
		});
		if (!asset) return;
		try {
			const saved = await saveMediaBuffer(asset.buffer, asset.mimeType, GENERATED_IMAGE_MEDIA_SUBDIR, maxBytes, asset.fileName);
			this.gatewayMaterializedItemIds.add(params.itemId);
			this.recordUrl({
				itemId: params.itemId,
				mediaUrl: saved.path,
				replaceExisting: true
			});
		} catch (error) {
			log.warn(`codex app-server ${params.source} image generation result save failed`, {
				itemId: params.itemId,
				error
			});
		}
	}
	buildToolMediaUrls(params) {
		const mediaUrls = new Set(params.toolMediaUrls?.map((url) => url.trim()).filter(Boolean) ?? []);
		if ((params.messagingToolSentMediaUrls?.length ?? 0) === 0) for (const mediaUrl of this.urlsByItemId.values()) mediaUrls.add(mediaUrl);
		return mediaUrls.size > 0 ? [...mediaUrls] : params.toolMediaUrls;
	}
	buildHostOwnedMediaUrls(params) {
		if ((params.messagingToolSentMediaUrls?.length ?? 0) > 0) return;
		const mediaUrls = [...this.urlsByItemId.values()];
		return mediaUrls.length > 0 ? mediaUrls : void 0;
	}
	recordUrl(params) {
		if (this.urlsByItemId.has(params.itemId) && params.replaceExisting !== true) {
			this.itemIds.add(params.itemId);
			return;
		}
		this.urlsByItemId.set(params.itemId, params.mediaUrl);
		this.itemIds.add(params.itemId);
	}
};
function estimateBase64DecodedBytes(base64) {
	let nonWhitespaceLength = 0;
	let previousCode = -1;
	let lastCode = -1;
	for (let i = 0; i < base64.length; i += 1) {
		const code = base64.charCodeAt(i);
		if (isBase64WhitespaceCode(code)) continue;
		nonWhitespaceLength += 1;
		previousCode = lastCode;
		lastCode = code;
	}
	if (nonWhitespaceLength === 0) return;
	const equalsCode = "=".charCodeAt(0);
	const padding = lastCode === equalsCode ? previousCode === equalsCode ? 2 : 1 : 0;
	return Math.max(0, Math.floor(nonWhitespaceLength * 3 / 4) - padding);
}
function isBase64WhitespaceCode(code) {
	return code === 32 || code === 9 || code === 10 || code === 13;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-reasoning.ts
var CodexReasoningProjection = class {
	constructor(params, emitAgentEvent) {
		this.params = params;
		this.emitAgentEvent = emitAgentEvent;
		this.reasoningTextByGroup = /* @__PURE__ */ new Map();
		this.reasoningItemOrder = /* @__PURE__ */ new Map();
		this.planTextByItem = /* @__PURE__ */ new Map();
		this.reasoningStarted = false;
		this.reasoningEnded = false;
	}
	async handleReasoningDelta(method, params) {
		const itemId = readStringField(params, "itemId") ?? "reasoning";
		const delta = readStringField(params, "delta") ?? "";
		if (!delta) return;
		this.reasoningStarted = true;
		if (!this.reasoningItemOrder.has(itemId)) this.reasoningItemOrder.set(itemId, this.reasoningItemOrder.size);
		const groupIndex = method === "item/reasoning/textDelta" ? readNonNegativeInteger(params, "contentIndex") ?? 0 : readNonNegativeInteger(params, "summaryIndex") ?? 0;
		const groupKey = `${method}\0${itemId}\0${groupIndex}`;
		const current = this.reasoningTextByGroup.get(groupKey);
		this.reasoningTextByGroup.set(groupKey, {
			itemId,
			method,
			index: groupIndex,
			text: `${current?.text ?? ""}${delta}`
		});
		await this.params.onReasoningStream?.({
			text: this.reasoningText(),
			isReasoningSnapshot: true
		});
	}
	handlePlanDelta(params) {
		const itemId = readStringField(params, "itemId") ?? "plan";
		const delta = readStringField(params, "delta") ?? "";
		if (!delta) return;
		const text = `${this.planTextByItem.get(itemId) ?? ""}${delta}`;
		this.planTextByItem.set(itemId, text);
		this.emitPlanUpdate({
			explanation: void 0,
			steps: splitPlanText(text).map((step) => ({
				step,
				status: "pending"
			}))
		});
	}
	handleTurnPlanUpdated(params, source = "codex-app-server") {
		const explanation = readNullableString(params, "explanation");
		const plan = Array.isArray(params.plan) ? params.plan.flatMap((entry) => {
			if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
			const record = entry;
			const step = readStringField(record, "step");
			if (!step) return [];
			return [{
				step,
				status: normalizePlanStepStatus(readStringField(record, "status"))
			}];
		}) : void 0;
		const planText = [explanation, ...(plan ?? []).map(({ step, status }) => `- [${status}] ${step}`)].filter((part) => Boolean(part)).join("\n");
		if (planText) this.turnPlanText = planText;
		this.emitPlanUpdate({
			explanation,
			steps: plan
		}, source);
	}
	recordItem(item) {
		if (item?.type === "plan" && typeof item.text === "string" && item.text) {
			this.planTextByItem.set(item.id, item.text);
			this.emitPlanUpdate({
				explanation: void 0,
				steps: splitPlanText(item.text).map((step) => ({
					step,
					status: "pending"
				}))
			});
		}
	}
	async maybeEndReasoning() {
		if (!this.reasoningStarted || this.reasoningEnded) return;
		this.reasoningEnded = true;
		await this.params.onReasoningEnd?.();
	}
	reasoningText() {
		return collectReasoningTextValues(this.reasoningTextByGroup, this.reasoningItemOrder).join("\n\n");
	}
	planText() {
		return this.turnPlanText ?? [...this.planTextByItem.values()].filter((text) => text.trim().length > 0).join("\n\n");
	}
	emitPlanUpdate(params, source = "codex-app-server") {
		if (!params.explanation && (!params.steps || params.steps.length === 0)) return;
		this.emitAgentEvent({
			stream: "plan",
			data: {
				phase: "update",
				title: "Plan updated",
				source,
				...params.explanation ? { explanation: params.explanation } : {},
				...params.steps && params.steps.length > 0 ? { steps: params.steps } : {}
			}
		});
	}
};
function normalizePlanStepStatus(status) {
	if (status === "inProgress" || status === "in_progress") return "in_progress";
	return status === "completed" ? "completed" : "pending";
}
function collectReasoningTextValues(groups, itemOrder) {
	return [...groups.values()].toSorted((left, right) => {
		const itemDelta = (itemOrder.get(left.itemId) ?? Number.MAX_SAFE_INTEGER) - (itemOrder.get(right.itemId) ?? Number.MAX_SAFE_INTEGER);
		if (itemDelta !== 0) return itemDelta;
		const methodDelta = reasoningMethodOrder(left.method) - reasoningMethodOrder(right.method);
		return methodDelta !== 0 ? methodDelta : left.index - right.index;
	}).map((group) => group.text).filter((text) => text.trim().length > 0);
}
function reasoningMethodOrder(method) {
	return method === "item/reasoning/summaryTextDelta" ? 0 : 1;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-terminal.ts
const attemptTerminal = agentHarnessAttemptTerminal;
//#endregion
//#region extensions/codex/src/app-server/event-projector-snapshot.ts
function readTurnTaintMetadata(message) {
	const metadata = message["__openclaw"];
	return metadata && typeof metadata === "object" && !Array.isArray(metadata) ? metadata : void 0;
}
function applyStickyTurnTaint(messages) {
	let tainted = false;
	return messages.map((message) => {
		if (message.role === "user") {
			tainted = false;
			return message;
		}
		const metadata = readTurnTaintMetadata(message);
		tainted ||= metadata?.turnTainted === true || metadata?.resultContentSource === "network";
		return message.role === "assistant" && tainted ? {
			...message,
			__openclaw: {
				...metadata,
				turnTainted: true
			}
		} : message;
	});
}
function buildCodexMessagesSnapshot(params) {
	const messages = promptSnapshot(params.runParams, params.turnId, params.upstreamUserText);
	if (params.reasoningText) messages.push(attachCodexMirrorIdentity(params.createAssistantMirrorMessage("Codex reasoning", params.reasoningText), `${params.turnId}:reasoning`));
	if (params.planText) messages.push(attachCodexMirrorIdentity(params.createAssistantMirrorMessage("Codex plan", params.planText), `${params.turnId}:plan`));
	const visibleWorkMessages = [...params.runParams.config?.ui?.prefs?.chatPersistCommentary === false ? [] : params.commentaryMessages.map(({ itemId, message }) => attachCodexMirrorIdentity(message, `${params.turnId}:commentary:${itemId}`)), ...params.toolMessages].toSorted((left, right) => (asDateTimestampMs(left.timestamp) ?? 0) - (asDateTimestampMs(right.timestamp) ?? 0));
	messages.push(...visibleWorkMessages);
	if (params.lastAssistant) messages.push(attachCodexMirrorIdentity(params.lastAssistant, `${params.turnId}:assistant`));
	return applyStickyTurnTaint(messages).map((message) => projectAgentHarnessTranscriptMessageForDisplay({
		hidden: params.runParams.trigger === "memory",
		message
	}));
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-result.ts
function buildCodexAttemptResult(input) {
	input.nativeToolLifecycleProjection.finalizeActive();
	const assistantTexts = input.assistantProjection.collectAssistantTexts();
	const commentaryMessages = input.assistantProjection.collectCommentaryMessages();
	const reasoningText = input.reasoningProjection.reasoningText();
	const planText = input.reasoningProjection.planText();
	const completedUsage = input.responseCompletions.usage ?? input.tokenUsage;
	const projectedUsage = input.aborted ? input.tokenUsage : completedUsage;
	const hasAssistantItemText = input.assistantProjection.hasAssistantItemTextForSynthesis();
	const legacyFailClosed = !input.completedTurn || input.completedTurn.status !== "completed" || hasAssistantItemText;
	const hasDeliverableAssistantOnCompletedTurn = input.completedTurn?.status === "completed" && assistantTexts.some((text) => text.trim().length > 0);
	const synthesizedMissingToolResultError = input.toolTranscriptProjection.synthesizeMissingToolResults({
		synthesize: legacyFailClosed,
		terminalDisposition: input.aborted ? "tool_error" : hasDeliverableAssistantOnCompletedTurn ? "diagnostic_only" : "prompt_error"
	});
	const storedMissingToolResultError = synthesizedMissingToolResultError ?? input.synthesizedMissingToolResultError;
	let promptErrorSource = input.promptErrorSource;
	if (synthesizedMissingToolResultError) {
		input.recordSynthesizedMissingToolResultError(synthesizedMissingToolResultError);
		promptErrorSource = promptErrorSource ?? "prompt";
	}
	const assistantMessageOptions = {
		tokenUsage: projectedUsage,
		aborted: input.aborted,
		promptError: input.promptError
	};
	const lastAssistant = assistantTexts.length ? input.assistantProjection.createAssistantMessage(assistantTexts.join("\n\n"), assistantMessageOptions) : void 0;
	const currentAttemptAssistant = input.assistantProjection.createCurrentAttemptAssistantMessage(assistantMessageOptions);
	const messagesSnapshot = buildCodexMessagesSnapshot({
		runParams: input.runParams,
		turnId: input.turnId,
		upstreamUserText: input.upstreamUserText,
		reasoningText,
		planText,
		commentaryMessages,
		toolMessages: input.toolTranscriptProjection.transcriptMessages,
		lastAssistant,
		createAssistantMirrorMessage: (title, text) => input.assistantProjection.createAssistantMirrorMessage(title, text)
	});
	const turnFailed = input.completedTurn?.status === "failed";
	const promptError = input.promptError ?? storedMissingToolResultError ?? (turnFailed ? input.completedTurn?.error?.message ?? "codex app-server turn failed" : null);
	const agentHarnessResultClassification = classifyAgentHarnessTerminalOutcome({
		assistantTexts,
		reasoningText,
		planText,
		promptError,
		turnCompleted: Boolean(input.completedTurn)
	});
	const toolMetas = input.toolProgressProjection.toolMetas;
	const hadPotentialSideEffects = input.toolTelemetry.didSendViaMessagingTool || Boolean(input.toolTelemetry.successfulCronAdds || input.toolTelemetry.acceptedSessionSpawns?.length) || input.generatedMediaProjection.hasGeneratedMedia() || input.toolProgressProjection.hasPotentialSideEffects;
	return {
		terminal: attemptTerminal.normalize({
			aborted: input.aborted,
			promptError,
			promptErrorSource: promptError ? promptErrorSource || "prompt" : null
		}),
		sessionIdUsed: input.runParams.sessionId,
		terminalTurnId: input.turnId,
		...agentHarnessResultClassification ? { agentHarnessResultClassification } : {},
		bootstrapPromptWarningSignaturesSeen: input.runParams.bootstrapPromptWarningSignaturesSeen,
		bootstrapPromptWarningSignature: input.runParams.bootstrapPromptWarningSignature,
		...input.responseCompletions.modelIterations > 0 ? { modelIterations: input.responseCompletions.modelIterations } : {},
		messagesSnapshot,
		assistantTexts,
		toolMetas,
		lastAssistant,
		currentAttemptAssistant,
		...input.toolProgressProjection.lastToolError ? { lastToolError: input.toolProgressProjection.lastToolError } : {},
		didSendViaMessagingTool: input.toolTelemetry.didSendViaMessagingTool,
		didDeliverSourceReplyViaMessageTool: input.toolTelemetry.didDeliverSourceReplyViaMessageTool === true,
		messagingToolSentTexts: input.toolTelemetry.messagingToolSentTexts,
		messagingToolSentMediaUrls: input.toolTelemetry.messagingToolSentMediaUrls,
		messagingToolSentTargets: input.toolTelemetry.messagingToolSentTargets,
		messagingToolSourceReplyPayloads: input.toolTelemetry.messagingToolSourceReplyPayloads ?? [],
		heartbeatToolResponse: input.toolTelemetry.heartbeatToolResponse,
		toolMediaUrls: input.generatedMediaProjection.buildToolMediaUrls(input.toolTelemetry),
		hostOwnedToolMediaUrls: input.generatedMediaProjection.buildHostOwnedMediaUrls(input.toolTelemetry),
		toolAudioAsVoice: input.toolTelemetry.toolAudioAsVoice,
		successfulCronAdds: input.toolTelemetry.successfulCronAdds,
		acceptedSessionSpawns: input.toolTelemetry.acceptedSessionSpawns,
		cloudCodeAssistFormatError: false,
		contextTokens: input.contextTokens,
		attemptUsage: projectedUsage,
		...input.completedCompactionCount > 0 ? { compactionCount: input.completedCompactionCount } : {},
		replayMetadata: {
			hadPotentialSideEffects,
			replaySafe: !hadPotentialSideEffects
		},
		itemLifecycle: {
			startedCount: input.activeItemCount + input.completedItemCount,
			completedCount: input.completedItemCount,
			activeCount: input.activeItemCount
		},
		yieldDetected: input.yieldDetected || false,
		didSendDeterministicApprovalPrompt: input.guardianReviewCount > 0 ? false : void 0
	};
}
//#endregion
//#region extensions/codex/src/app-server/usage-limit-error.ts
/**
* Enriches Codex usage-limit failures with current rate-limit information and
* marks blocked auth profiles when Codex exposes a reset time.
*/
const CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS = 5e3;
function createCodexUsageLimitPromptError(message) {
	return Object.assign(new Error(message), { status: 429 });
}
function isCodexUsageLimitPromptError(error) {
	return error instanceof Error && "status" in error && error.status === 429;
}
/** Marks a Codex auth profile blocked until the reset time advertised by rate limits. */
async function markCodexAuthProfileBlockedFromRateLimits(params) {
	const authProfileId = params.authProfileId?.trim();
	if (!authProfileId || !params.params.authProfileStore) return;
	const blockedUntil = resolveCodexUsageLimitResetAtMs(params.rateLimits);
	if (!blockedUntil) return;
	try {
		await markAuthProfileBlockedUntil({
			store: params.params.authProfileStore,
			profileId: authProfileId,
			blockedUntil,
			source: "codex_rate_limits",
			agentDir: params.params.agentDir,
			runId: params.params.runId,
			modelId: params.params.modelId
		});
	} catch (error) {
		log.debug("failed to mark Codex auth profile blocked from app-server limits", {
			authProfileId,
			error: formatErrorMessage(error)
		});
	}
}
/** Formats a turn-start usage-limit error, refreshing rate limits when needed. */
async function formatCodexTurnStartUsageLimitError(params) {
	return refreshCodexUsageLimitError({
		client: params.client,
		source: readCodexTurnStartUsageLimitErrorSource(params.client, params.error, params.errorNotification, params.rateLimitsRevisionBeforeTurnStart),
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
/** Refreshes a generic prompt usage-limit message into a reset-aware message. */
async function refreshCodexUsageLimitPromptError(params) {
	if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(params.message)) return;
	return refreshCodexUsageLimitError({
		client: params.client,
		source: {
			message: params.message,
			codexErrorInfo: "usageLimitExceeded",
			rateLimits: readRecentCodexRateLimits(params.client)
		},
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
}
async function refreshCodexUsageLimitError(params) {
	const initialMessage = formatCodexUsageLimitErrorMessage(params.source);
	if (!shouldRefreshCodexRateLimitsForUsageLimitMessage(initialMessage)) return initialMessage ? {
		message: initialMessage,
		...params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: params.source.rateLimits } : {}
	} : void 0;
	const rateLimits = await readCodexRateLimitsFromAppServerForUsageLimitError({
		client: params.client,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!rateLimits) return initialMessage ? {
		message: initialMessage,
		...params.source.rateLimitsTrustedForProfile ? { rateLimitsForProfile: params.source.rateLimits } : {}
	} : void 0;
	const message = formatCodexUsageLimitErrorMessage({
		message: params.source.message,
		codexErrorInfo: params.source.codexErrorInfo,
		rateLimits,
		rateLimitsAuthoritative: true
	}) ?? initialMessage;
	return message ? {
		message,
		rateLimitsForProfile: rateLimits
	} : void 0;
}
async function readCodexRateLimitsFromAppServerForUsageLimitError(params) {
	if (params.signal?.aborted) return;
	try {
		const rateLimits = await params.client.request(CODEX_CONTROL_METHODS.rateLimits, void 0, {
			timeoutMs: resolveCodexUsageLimitRateLimitRefreshTimeoutMs(params.timeoutMs),
			signal: params.signal
		});
		rememberCodexRateLimitsRead(params.client, rateLimits);
		return rateLimits;
	} catch (error) {
		log.debug("codex app-server rate-limit refresh failed after usage-limit error", { error: formatErrorMessage(error) });
		return;
	}
}
function resolveCodexUsageLimitRateLimitRefreshTimeoutMs(timeoutMs) {
	if (timeoutMs === void 0 || !Number.isFinite(timeoutMs) || timeoutMs <= 0) return CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS;
	return Math.max(100, Math.min(timeoutMs, CODEX_USAGE_LIMIT_RATE_LIMIT_REFRESH_TIMEOUT_MS));
}
function readCodexTurnStartUsageLimitErrorSource(client, error, errorNotification, rateLimitsRevisionBeforeTurnStart) {
	const notificationError = readCodexErrorNotification(errorNotification);
	const errorPayload = readCodexErrorPayload(error);
	const rateLimits = errorPayload.rateLimits ?? readRecentCodexRateLimits(client);
	const cacheUpdatedDuringTurnStart = rateLimitsRevisionBeforeTurnStart !== void 0 && readCodexRateLimitsRevision(client) > rateLimitsRevisionBeforeTurnStart;
	return {
		message: notificationError?.message ?? errorPayload.message ?? formatErrorMessage(error),
		codexErrorInfo: notificationError?.codexErrorInfo ?? errorPayload.codexErrorInfo,
		rateLimits,
		rateLimitsTrustedForProfile: errorPayload.rateLimits !== void 0 || cacheUpdatedDuringTurnStart
	};
}
function readCodexErrorNotification(notification) {
	if (notification?.method !== "error" || !isJsonObject(notification.params)) return;
	const error = notification.params.error;
	return isJsonObject(error) ? {
		message: readStringField(error, "message"),
		codexErrorInfo: error.codexErrorInfo
	} : void 0;
}
function readCodexErrorPayload(error) {
	const message = error instanceof Error ? error.message : void 0;
	if (!error || typeof error !== "object" || !("data" in error)) return { message };
	const data = error.data;
	if (!isJsonObject(data)) return { message };
	const nestedError = isJsonObject(data.error) ? data.error : data;
	const rateLimits = nestedError.rateLimits ?? data.rateLimits;
	return {
		message: readStringField(nestedError, "message") ?? message,
		codexErrorInfo: nestedError.codexErrorInfo,
		rateLimits
	};
}
//#endregion
//#region extensions/codex/src/app-server/event-projector.ts
var CodexAppServerEventProjector = class {
	constructor(params, threadId, turnId, options = {}) {
		this.params = params;
		this.threadId = threadId;
		this.turnId = turnId;
		this.options = options;
		this.activeItemIds = /* @__PURE__ */ new Set();
		this.completedItemIds = /* @__PURE__ */ new Set();
		this.activeCompactionItemIds = /* @__PURE__ */ new Set();
		this.terminalPresentationClearedItemIds = /* @__PURE__ */ new Set();
		this.nativeToolOutcomeOrdinals = /* @__PURE__ */ new Map();
		this.settledTurnFailureFinalizationAllowed = false;
		this.promptErrorSource = null;
		this.synthesizedMissingToolResultError = null;
		this.aborted = false;
		this.responseCompletions = new CodexResponseCompletionProjection();
		this.completedCompactionCount = 0;
		this.lastTranscriptTimestamp = 0;
		this.contextTokens = options.initialContextTokens;
		this.diagnostics = new CodexProjectionDiagnostics(threadId, turnId);
		this.nativeToolLifecycleProjector = new CodexNativeToolLifecycleProjector(params, threadId, turnId, { runAbortSignal: options.runAbortSignal });
		this.generatedMediaProjection = new CodexGeneratedMediaProjection(params.config, {
			remoteWorkspaceRoot: options.remoteWorkspaceRoot,
			readFile: options.readRemoteWorkspaceFile,
			requestTimeoutMs: options.remoteWorkspaceRequestTimeoutMs,
			signal: options.runAbortSignal
		});
		this.toolProgressProjection = new CodexToolProgressProjection(params);
		this.toolTranscriptProjection = new CodexToolTranscriptProjection(params, threadId, turnId, this.toolProgressProjection, () => this.nextTranscriptTimestamp(), {
			nativePostToolUseRelayEnabled: options.nativePostToolUseRelayEnabled,
			prepareNativeMcpAppResultDetails: options.prepareNativeMcpAppResultDetails,
			trajectoryRecorder: options.trajectoryRecorder
		});
		this.eventProjection = new CodexEventProjection(threadId, turnId, (event) => this.emitAgentEvent(event), this.toolProgressProjection, this.toolTranscriptProjection, options.onNativeToolResultRecorded);
		this.assistantProjection = new CodexAssistantProjection(params, (event) => this.emitAgentEvent(event), (text) => this.toolProgressProjection.matchesEcho(text), () => this.nextTranscriptTimestamp());
		this.reasoningProjection = new CodexReasoningProjection(params, (event) => this.emitAgentEvent(event));
	}
	nextTranscriptTimestamp() {
		this.lastTranscriptTimestamp = Math.max(Date.now(), this.lastTranscriptTimestamp + 1);
		return this.lastTranscriptTimestamp;
	}
	getCompletedTurnStatus() {
		return this.completedTurn?.status;
	}
	hasCompletedTerminalAssistantText() {
		return this.assistantProjection.hasCompletedTerminalAssistantText(this.completedItemIds);
	}
	getLatestTerminalAssistantCandidate() {
		return this.assistantProjection.getLatestTerminalAssistantCandidate();
	}
	hasLatestTerminalAssistantCandidateText() {
		return this.assistantProjection.hasLatestTerminalAssistantCandidateText();
	}
	canReleaseLatestTerminalAssistantAfterToolHandoff() {
		return this.assistantProjection.canReleaseLatestTerminalAssistantAfterToolHandoff();
	}
	/** Restores a completed final item after only the enclosing turn timeout fired. */
	recoverCompletedTerminalAssistantAfterTurnWatchTimeout() {
		if (!this.aborted || this.promptError !== "codex app-server attempt timed out" || !this.hasCompletedTerminalAssistantText()) return false;
		this.aborted = false;
		this.promptError = void 0;
		this.promptErrorSource = null;
		return true;
	}
	/** Resolves the shared model-order position for a native tool item. */
	recordNativeToolOutcome(item) {
		if (!item || this.nativeToolOutcomeOrdinals.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const ordinal = this.params.allocateToolOutcomeOrdinal?.(item.id);
		if (ordinal !== void 0) this.nativeToolOutcomeOrdinals.set(item.id, ordinal);
	}
	recordNativeToolApprovalFailure(toolCallId, disposition) {
		this.nativeToolLifecycleProjector.recordApprovalFailureDisposition(toolCallId, disposition);
	}
	recordNativeToolPreToolUseFailure(failure) {
		this.nativeToolLifecycleProjector.recordPreToolUseFailure(failure);
	}
	async handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params) return;
		if (notification.method === "hook/started" || notification.method === "hook/completed") {
			if (!this.isHookNotificationForCurrentThread(params)) return;
		} else if (notification.method === "guardianWarning") {
			if (readCodexNotificationThreadId(params) !== this.threadId) return;
		} else if (!isCodexNotificationForTurn(params, this.threadId, this.turnId)) return;
		this.nativeToolLifecycleProjector.handleNotification(notification);
		this.assistantProjection.handleNotification(notification.method, params);
		switch (notification.method) {
			case "item/agentMessage/delta":
				await this.assistantProjection.handleAssistantDelta(params);
				break;
			case "item/reasoning/summaryTextDelta":
			case "item/reasoning/textDelta":
				await this.reasoningProjection.handleReasoningDelta(notification.method, params);
				break;
			case "item/plan/delta":
				this.reasoningProjection.handlePlanDelta(params);
				break;
			case "turn/plan/updated":
				this.reasoningProjection.handleTurnPlanUpdated(params);
				break;
			case "item/started":
				await this.handleItemStarted(params);
				break;
			case "item/completed":
				await this.handleItemCompleted(params);
				break;
			case "item/commandExecution/outputDelta":
				this.toolProgressProjection.handleOutputDelta(params, "bash");
				break;
			case "item/autoApprovalReview/started":
			case "item/autoApprovalReview/completed":
				this.eventProjection.handleGuardianReview(notification.method, params);
				break;
			case "guardianWarning":
				this.eventProjection.handleGuardianWarning(params);
				break;
			case "hook/started":
			case "hook/completed":
				this.eventProjection.handleHook(notification.method, params);
				break;
			case "thread/tokenUsage/updated":
				projectCodexThreadUsageUpdate(params, this.tokenUsage, (usage) => this.tokenUsage = usage, (data) => {
					this.contextTokens = data.modelContextWindow ?? this.contextTokens;
					this.emitAgentEvent({
						stream: "codex_app_server.usage",
						data
					});
				});
				break;
			case "turn/completed":
				await this.handleTurnCompleted(params);
				break;
			case "rawResponse/completed":
				this.responseCompletions.record(params);
				break;
			case "rawResponseItem/completed":
				await this.handleRawResponseItemCompleted(params);
				break;
			case "error":
				this.responseCompletions.clear();
				if (params.willRetry === true) break;
				this.settledTurnFailureFinalizationAllowed = (isJsonObject(params.error) ? params.error.codexErrorInfo : void 0) === "serverOverloaded";
				this.promptError = this.formatCodexErrorMessage(params) ?? "codex app-server error";
				this.promptErrorSource = "prompt";
				break;
			case "thread/compacted":
			case "turn/started":
			case "turn/diff/updated":
			case "item/reasoning/summaryPartAdded":
			case "item/commandExecution/terminalInteraction":
			case "item/fileChange/outputDelta":
			case "item/fileChange/patchUpdated":
			case "item/mcpToolCall/progress":
			case "model/rerouted":
			case "model/verification":
			case "turn/moderationMetadata":
			case "model/safetyBuffering/updated": break;
			default:
				this.diagnostics.warnUnknownEvent(notification, params);
				break;
		}
	}
	buildResult(toolTelemetry, options) {
		return buildCodexAttemptResult({
			runParams: this.params,
			turnId: this.turnId,
			upstreamUserText: this.options.upstreamUserText,
			completedTurn: this.completedTurn,
			promptError: this.promptError,
			promptErrorSource: this.promptErrorSource,
			synthesizedMissingToolResultError: this.synthesizedMissingToolResultError,
			recordSynthesizedMissingToolResultError: (error) => {
				this.synthesizedMissingToolResultError = error;
				this.promptErrorSource = this.promptErrorSource ?? "prompt";
			},
			aborted: this.aborted,
			tokenUsage: this.tokenUsage,
			contextTokens: this.contextTokens,
			completedCompactionCount: this.completedCompactionCount,
			activeItemCount: this.activeItemIds.size,
			completedItemCount: this.completedItemIds.size,
			guardianReviewCount: this.eventProjection.guardianReviewCount,
			toolTelemetry,
			yieldDetected: options?.yieldDetected,
			nativeToolLifecycleProjection: this.nativeToolLifecycleProjector,
			assistantProjection: this.assistantProjection,
			reasoningProjection: this.reasoningProjection,
			responseCompletions: this.responseCompletions,
			toolTranscriptProjection: this.toolTranscriptProjection,
			toolProgressProjection: this.toolProgressProjection,
			generatedMediaProjection: this.generatedMediaProjection
		});
	}
	recordDynamicToolCall(params) {
		this.toolTranscriptProjection.recordDynamicToolCall(params);
	}
	/** Projects a successful OpenClaw update_plan call through the native plan stream. */
	recordDynamicPlanUpdate(params) {
		if (isJsonObject(params)) this.reasoningProjection.handleTurnPlanUpdated(params, "openclaw");
	}
	recordDynamicToolResult(params) {
		this.toolProgressProjection.recordDynamicToolResult(params);
		const source = this.options.resolveDynamicToolResultContentSource?.(params.tool);
		this.toolTranscriptProjection.recordDynamicToolResult(params, source);
	}
	markTimedOut() {
		this.aborted = true;
		this.promptError = "codex app-server attempt timed out";
		this.promptErrorSource = "prompt";
	}
	markAborted() {
		this.aborted = true;
		this.responseCompletions.clear();
	}
	isCompacting() {
		return this.activeCompactionItemIds.size > 0;
	}
	async handleItemStarted(params) {
		const item = readItem(params.item);
		const itemId = item?.id ?? readStringField(params, "itemId");
		this.assistantProjection.recordItemStarted(item, itemId);
		if (itemId) this.activeItemIds.add(itemId);
		this.recordNativeToolOutcome(item);
		if (item?.type === "contextCompaction" && itemId) {
			this.activeCompactionItemIds.add(itemId);
			await runAgentHarnessBeforeCompactionHook({
				sessionFile: this.params.sessionFile,
				messages: await this.toolTranscriptProjection.readMirroredSessionMessages(),
				ctx: {
					runId: this.params.runId,
					agentId: this.params.agentId,
					sessionKey: this.params.sessionKey,
					sessionId: this.params.sessionId,
					workspaceDir: this.params.workspaceDir,
					messageProvider: this.params.messageProvider ?? void 0,
					trigger: this.params.trigger,
					channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0
				}
			});
			this.emitAgentEvent({
				stream: "compaction",
				data: {
					phase: "start",
					backend: "codex-app-server",
					threadId: this.threadId,
					turnId: this.turnId,
					itemId
				}
			});
		}
		this.toolProgressProjection.recordToolMeta(item);
		this.eventProjection.emitStandardItemEvent({
			phase: "start",
			item
		});
		await this.eventProjection.emitNormalizedToolItemEvent({
			phase: "start",
			item
		});
		this.toolTranscriptProjection.recordNativeToolCall(item);
		this.toolProgressProjection.emitToolResultSummary(item);
		this.emitAgentEvent({
			stream: "codex_app_server.item",
			data: {
				phase: "started",
				itemId,
				type: item?.type
			}
		});
	}
	async handleItemCompleted(params) {
		const item = readItem(params.item);
		this.diagnostics.warnUnknownItemStatus(item);
		this.recordNativeToolOutcome(item);
		this.clearTerminalPresentationForNativeItem(item);
		const itemId = item?.id ?? readStringField(params, "itemId");
		if (itemId) {
			this.activeItemIds.delete(itemId);
			this.completedItemIds.add(itemId);
		}
		this.assistantProjection.recordItemCompleted(item, itemId, this.activeItemIds);
		this.reasoningProjection.recordItem(item);
		await this.generatedMediaProjection.recordNative(item);
		if (item?.type === "contextCompaction" && itemId) {
			this.activeCompactionItemIds.delete(itemId);
			this.completedCompactionCount += 1;
			this.options.onContextCompacted?.();
			await runAgentHarnessAfterCompactionHook({
				sessionFile: this.params.sessionFile,
				messages: await this.toolTranscriptProjection.readMirroredSessionMessages(),
				compactedCount: -1,
				ctx: {
					runId: this.params.runId,
					agentId: this.params.agentId,
					sessionKey: this.params.sessionKey,
					sessionId: this.params.sessionId,
					workspaceDir: this.params.workspaceDir,
					messageProvider: this.params.messageProvider ?? void 0,
					trigger: this.params.trigger,
					channelId: this.params.messageChannel ?? this.params.messageProvider ?? void 0
				}
			});
			this.emitAgentEvent({
				stream: "compaction",
				data: {
					phase: "end",
					backend: "codex-app-server",
					completed: true,
					threadId: this.threadId,
					turnId: this.turnId,
					itemId
				}
			});
		}
		this.toolProgressProjection.recordToolMeta(item);
		this.toolProgressProjection.rememberCommandAggregateOutputEcho(item);
		this.eventProjection.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.eventProjection.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		this.toolTranscriptProjection.recordNativeToolCall(item);
		await this.toolTranscriptProjection.recordNativeToolResultWithDetails(item);
		this.toolProgressProjection.emitToolResultSummary(item);
		this.toolProgressProjection.emitToolResultOutput(item);
		this.emitAgentEvent({
			stream: "codex_app_server.item",
			data: {
				phase: "completed",
				itemId,
				type: item?.type
			}
		});
	}
	async handleTurnCompleted(params) {
		const turn = readCodexTurn(params.turn);
		if (!turn || turn.id !== this.turnId) return;
		this.completedTurn = turn;
		this.settledTurnFailureFinalizationAllowed = turn.status === "failed" && turn.error?.codexErrorInfo === "serverOverloaded";
		if (turn.status !== "completed") this.responseCompletions.clear();
		if (turn.status === "failed") {
			const usageLimitMessage = formatCodexUsageLimitErrorMessage({
				message: turn.error?.message,
				codexErrorInfo: turn.error?.codexErrorInfo,
				rateLimits: this.options.readRecentRateLimits?.()
			});
			this.promptError = usageLimitMessage ? createCodexUsageLimitPromptError(usageLimitMessage) : turn.error?.message ?? "codex app-server turn failed";
			this.promptErrorSource = "prompt";
		}
		const turnItems = turn.items ?? [];
		for (let index = turnItems.length - 1; index >= 0; index -= 1) {
			const item = turnItems[index];
			if (!item || !this.isCurrentTurnSnapshotItem(item)) continue;
			if (item?.type === "dynamicToolCall") break;
			if (shouldClearTerminalPresentationForNativeItem(item)) {
				this.clearTerminalPresentationForNativeItem(item);
				break;
			}
		}
		for (const item of turnItems) {
			this.diagnostics.warnUnknownItemStatus(item);
			this.assistantProjection.recordSnapshotItem(item);
			this.reasoningProjection.recordItem(item);
			await this.generatedMediaProjection.recordNative(item);
			this.toolProgressProjection.recordToolMeta(item);
			this.toolProgressProjection.rememberCommandAggregateOutputEcho(item);
			await this.emitSnapshotOnlyNativeToolProgress(item);
			this.toolTranscriptProjection.recordNativeToolCall(item);
			await this.toolTranscriptProjection.recordNativeToolResultWithDetails(item);
			this.toolTranscriptProjection.emitAfterToolCallObservation(item);
			this.toolProgressProjection.emitToolResultSummary(item);
			this.toolProgressProjection.emitToolResultOutput(item);
		}
		this.assistantProjection.finalizeAnswerCandidate(turn);
		this.activeCompactionItemIds.clear();
		await this.reasoningProjection.maybeEndReasoning();
	}
	async emitSnapshotOnlyNativeToolProgress(item) {
		if (!shouldSynthesizeToolProgressForItem(item) || !this.isCurrentTurnSnapshotItem(item) || this.completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		if (!this.activeItemIds.has(item.id)) {
			this.eventProjection.emitStandardItemEvent({
				phase: "start",
				item
			});
			await this.eventProjection.emitNormalizedToolItemEvent({
				phase: "start",
				item
			});
		}
		this.activeItemIds.delete(item.id);
		this.eventProjection.emitStandardItemEvent({
			phase: "end",
			item
		});
		await this.eventProjection.emitNormalizedToolItemEvent({
			phase: "result",
			item
		});
		this.completedItemIds.add(item.id);
	}
	isCurrentTurnSnapshotItem(item) {
		const itemTurnId = readItemString(item, "turnId");
		return itemTurnId === void 0 || itemTurnId === this.turnId;
	}
	async handleRawResponseItemCompleted(params) {
		const item = isJsonObject(params.item) ? params.item : void 0;
		if (!item) return;
		this.toolTranscriptProjection.recordRawNativeToolItem(item);
		this.assistantProjection.handleRawResponseItemCompleted(item, this.activeItemIds);
		await this.generatedMediaProjection.recordRaw(item);
	}
	clearTerminalPresentationForNativeItem(item) {
		if (!item || this.terminalPresentationClearedItemIds.has(item.id) || !shouldClearTerminalPresentationForNativeItem(item)) return;
		const toolCallOrdinal = this.nativeToolOutcomeOrdinals.get(item.id);
		this.terminalPresentationClearedItemIds.add(item.id);
		this.params.onToolOutcome?.({
			toolName: itemName(item) ?? item.type,
			argsHash: "",
			resultHash: "",
			...toolCallOrdinal !== void 0 ? { toolCallOrdinal } : {},
			terminalPresentation: void 0,
			presentationOnly: true
		});
	}
	formatCodexErrorMessage(params) {
		const error = isJsonObject(params.error) ? params.error : void 0;
		const usageLimitMessage = formatCodexUsageLimitErrorMessage({
			message: error ? readStringField(error, "message") : void 0,
			codexErrorInfo: error?.codexErrorInfo,
			rateLimits: this.options.readRecentRateLimits?.()
		});
		return usageLimitMessage ? createCodexUsageLimitPromptError(usageLimitMessage) : readCodexErrorNotificationMessage(params);
	}
	emitAgentEvent(event) {
		try {
			emitAgentEvent({
				runId: this.params.runId,
				stream: event.stream,
				data: event.data,
				...this.params.sessionKey ? { sessionKey: this.params.sessionKey } : {}
			});
		} catch (error) {
			log.debug("codex app-server global agent event emit failed", { error });
		}
		try {
			const maybePromise = this.params.onAgentEvent?.(event);
			Promise.resolve(maybePromise).catch((error) => {
				log.debug("codex app-server agent event handler rejected", { error });
			});
		} catch (error) {
			log.debug("codex app-server agent event handler threw", { error });
		}
	}
	isHookNotificationForCurrentThread(params) {
		const threadId = readStringField(params, "threadId");
		const turnId = params.turnId;
		return threadId === this.threadId && (turnId === this.turnId || turnId === null);
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-mcp-app.ts
function readMcpAppResourceUri(item) {
	const uri = normalizeOptionalString(asOptionalRecord(item.appContext)?.resourceUri) ?? normalizeOptionalString(item.mcpAppResourceUri);
	return uri?.startsWith("ui://") ? uri : void 0;
}
function readMcpToolResult(item) {
	const result = asOptionalRecord(item.result);
	if (!result || !Array.isArray(result.content)) return;
	const resultMeta = asOptionalRecord(result["_meta"]);
	return {
		content: result.content,
		...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {},
		...result.isError === true ? { isError: true } : {},
		...resultMeta ? { _meta: resultMeta } : {}
	};
}
function statusTools(status) {
	return Object.entries(status.tools).map(([name, value]) => Object.assign({}, asOptionalRecord(value) ?? {}, { name }));
}
function createNativeMcpRuntime(params) {
	let catalog = null;
	let statuses;
	const createdAt = Date.now();
	const loadStatuses = async () => {
		if (statuses) return statuses;
		statuses = (await params.client.request("mcpServerStatus/list", {
			threadId: params.threadId,
			detail: "full"
		})).data;
		return statuses;
	};
	const getCatalog = async () => {
		if (catalog) return catalog;
		const loaded = await loadStatuses();
		catalog = {
			version: 1,
			generatedAt: Date.now(),
			servers: Object.fromEntries(loaded.map((status) => [status.name, {
				serverName: status.name,
				launchSummary: "Codex native MCP connection",
				toolCount: Object.keys(status.tools).length
			}])),
			tools: loaded.flatMap((status) => statusTools(status).map((tool) => ({
				serverName: status.name,
				safeServerName: status.name,
				toolName: String(tool.name),
				inputSchema: asOptionalRecord(tool.inputSchema) ?? { type: "object" },
				fallbackDescription: normalizeOptionalString(tool.description) ?? String(tool.name)
			})))
		};
		return catalog;
	};
	const runtime = {
		sessionId: params.attempt.sessionId,
		sessionKey: params.attempt.sessionKey,
		workspaceDir: params.attempt.workspaceDir,
		configFingerprint: `${getCodexAppServerClientInstanceId(params.client)}:${params.threadId}`,
		mcpAppsEnabled: true,
		createdAt,
		lastUsedAt: createdAt,
		acquireLease: () => retainSharedCodexAppServerClientIfCurrent(params.client) ?? (() => {}),
		getCatalog,
		peekCatalog: () => catalog,
		markUsed: () => {
			runtime.lastUsedAt = Date.now();
		},
		callTool: async (serverName, toolName, input) => await params.client.request("mcpServer/tool/call", {
			threadId: params.threadId,
			server: serverName,
			tool: toolName,
			arguments: asOptionalRecord(input) ?? {}
		}),
		listTools: async (serverName) => {
			const status = (await loadStatuses()).find((entry) => entry.name === serverName);
			return { tools: status ? statusTools(status) : [] };
		},
		readResource: async (serverName, uri) => await params.client.request("mcpServer/resource/read", {
			threadId: params.threadId,
			server: serverName,
			uri
		}),
		listResources: async (serverName) => {
			return { resources: (await loadStatuses()).find((entry) => entry.name === serverName)?.resources ?? [] };
		},
		listResourceTemplates: async (serverName) => {
			return { resourceTemplates: (await loadStatuses()).find((entry) => entry.name === serverName)?.resourceTemplates ?? [] };
		},
		dispose: async () => {}
	};
	return runtime;
}
function createCodexNativeMcpAppResultDetailsPreparer(params) {
	if (params.attempt.config?.mcp?.apps?.enabled !== true) return;
	const runtime = createNativeMcpRuntime(params);
	return async (item) => {
		const serverName = normalizeOptionalString(item.server);
		const toolName = normalizeOptionalString(item.tool);
		const uiResourceUri = readMcpAppResourceUri(item);
		const toolResult = readMcpToolResult(item);
		if (!serverName || !toolName || !uiResourceUri || !toolResult) return;
		const allowedAppToolNames = new Set((await runtime.getCatalog()).tools.filter((tool) => tool.serverName === serverName).map((tool) => tool.toolName));
		if (allowedAppToolNames.size === 0) return;
		return await prepareHarnessNativeMcpAppPreview({
			runtime,
			serverName,
			toolName,
			uiResourceUri,
			toolCallId: item.id,
			toolInput: item.arguments ?? {},
			toolResult,
			allowedAppToolNames,
			...toolResult["_meta"] !== void 0 ? { resultMetaState: "unavailable" } : {}
		});
	};
}
//#endregion
//#region extensions/codex/src/app-server/user-input-bridge.ts
/** Bridges Codex request_user_input calls to gateway questions and secret text prompts. */
const DEFAULT_USER_INPUT_TIMEOUT_MS = 15 * 6e4;
const NONBLOCKING_USER_INPUT_TIMEOUT_MS = 12e4;
/** Creates a per-turn bridge for pending Codex user-input requests. */
function createCodexUserInputBridge(params) {
	let sensitiveInput;
	let pendingGateway;
	const gatewayCall = params.gatewayCall ?? callGatewayTool;
	const resolveSecret = (value) => {
		const current = sensitiveInput;
		if (!current) return;
		sensitiveInput = void 0;
		current.cleanup();
		current.resolve(value);
	};
	const resolveSecretIfCurrent = (current, value) => {
		if (sensitiveInput !== current) return false;
		resolveSecret(value);
		return true;
	};
	const cancelGateway = () => {
		pendingGateway?.abort.abort(/* @__PURE__ */ new Error("Codex user input request cancelled"));
	};
	return {
		async handleRequest(request) {
			const requestParams = readUserInputParams(request.params);
			if (!requestParams) return;
			if (requestParams.threadId !== params.threadId || requestParams.turnId !== params.turnId) return;
			if (requestParams.questions.length === 0) return emptyUserInputResponse();
			resolveSecret(emptyUserInputResponse());
			cancelGateway();
			if (requestParams.questions.some((question) => question.isSecret)) return new Promise((resolve) => {
				const abortListener = () => resolveSecret(emptyUserInputResponse());
				const timeout = requestParams.isBlocking ? void 0 : setTimeout(() => resolveSecret(emptyUserInputResponse()), NONBLOCKING_USER_INPUT_TIMEOUT_MS);
				timeout?.unref?.();
				const cleanup = () => {
					params.signal?.removeEventListener("abort", abortListener);
					if (timeout) clearTimeout(timeout);
				};
				const current = {
					requestId: request.id,
					threadId: requestParams.threadId,
					questions: requestParams.questions,
					claimed: false,
					resolve,
					cleanup
				};
				sensitiveInput = current;
				params.signal?.addEventListener("abort", abortListener, { once: true });
				if (params.signal?.aborted) {
					resolveSecret(emptyUserInputResponse());
					return;
				}
				deliverAgentHarnessUserInputPrompt(params.paramsForRun, requestParams.questions, {
					formatText: formatCodexDisplayText,
					intro: "Codex needs input:"
				}).catch((error) => {
					log.warn("failed to deliver secret codex user input prompt", { error });
					resolveSecretIfCurrent(current, emptyUserInputResponse());
				});
			});
			const abort = new AbortController();
			const abortFromRun = () => abort.abort(params.signal?.reason);
			params.signal?.addEventListener("abort", abortFromRun, { once: true });
			if (params.signal?.aborted) abortFromRun();
			pendingGateway = {
				requestId: request.id,
				threadId: requestParams.threadId,
				abort
			};
			try {
				const result = await runAgentHarnessGatewayQuestion({
					questions: requestParams.questions,
					sessionKey: params.paramsForRun.sessionKey ?? params.paramsForRun.sessionId,
					agentId: params.paramsForRun.agentId,
					runId: params.paramsForRun.runId,
					timeoutMs: requestParams.isBlocking ? params.paramsForRun.timeoutMs ?? DEFAULT_USER_INPUT_TIMEOUT_MS : NONBLOCKING_USER_INPUT_TIMEOUT_MS,
					gatewayCall,
					delivery: params.paramsForRun,
					promptOptions: {
						formatText: formatCodexDisplayText,
						intro: "Codex needs input:"
					},
					signal: abort.signal
				});
				return result.status === "answered" ? gatewayAnswersToCodexResponse(result.answers.answers) : emptyUserInputResponse();
			} catch (error) {
				log.warn("failed to bridge codex user input through gateway", { error });
				return emptyUserInputResponse();
			} finally {
				params.signal?.removeEventListener("abort", abortFromRun);
				if (pendingGateway?.abort === abort) pendingGateway = void 0;
			}
		},
		claimPendingRequest() {
			const current = sensitiveInput;
			if (!current || current.claimed) return;
			current.claimed = true;
			return {
				answer: (text) => resolveSecretIfCurrent(current, buildUserInputResponse(current.questions, text)),
				cancel: () => resolveSecretIfCurrent(current, emptyUserInputResponse())
			};
		},
		handleNotification(notification) {
			if (notification.method !== "serverRequest/resolved") return;
			const notificationParams = isJsonObject(notification.params) ? notification.params : void 0;
			const requestId = notificationParams ? readRequestId(notificationParams) : void 0;
			if (!notificationParams || requestId === void 0) return;
			if (sensitiveInput && readStringField(notificationParams, "threadId") === sensitiveInput.threadId && String(requestId) === String(sensitiveInput.requestId)) resolveSecret(emptyUserInputResponse());
			if (pendingGateway && readStringField(notificationParams, "threadId") === pendingGateway.threadId && String(requestId) === String(pendingGateway.requestId)) pendingGateway.abort.abort(/* @__PURE__ */ new Error("Codex server request resolved"));
		},
		cancelPending() {
			resolveSecret(emptyUserInputResponse());
			cancelGateway();
		}
	};
}
function readUserInputParams(value) {
	if (!isJsonObject(value)) return;
	const threadId = readStringField(value, "threadId");
	const turnId = readStringField(value, "turnId");
	const itemId = readStringField(value, "itemId");
	const questionsRaw = value.questions;
	if (!threadId || !turnId || !itemId || !Array.isArray(questionsRaw)) return;
	return {
		threadId,
		turnId,
		itemId,
		questions: questionsRaw.map((rawQuestion) => {
			const question = readQuestion(rawQuestion);
			if (question && isJsonObject(rawQuestion) && rawQuestion.multiSelect === true) question.multiSelect = true;
			return question;
		}).filter((question) => Boolean(question)),
		isBlocking: value.isBlocking !== false
	};
}
function readQuestion(value) {
	if (!isJsonObject(value)) return;
	const id = readStringField(value, "id");
	const header = readStringField(value, "header");
	const question = readStringField(value, "question");
	if (!id || !header || !question) return;
	return {
		id,
		header,
		question,
		isOther: value.isOther === true,
		isSecret: value.isSecret === true,
		options: readOptions(value.options)
	};
}
function readOptions(value) {
	if (!Array.isArray(value)) return null;
	const options = value.map(readOption).filter((option) => Boolean(option));
	return options.length > 0 ? options : null;
}
function readOption(value) {
	if (!isJsonObject(value)) return;
	const label = readStringField(value, "label");
	const description = readStringField(value, "description") ?? "";
	return label ? {
		label,
		description
	} : void 0;
}
function buildUserInputResponse(questions, inputText) {
	return buildAgentHarnessUserInputAnswers(questions, inputText);
}
function gatewayAnswersToCodexResponse(answers) {
	return { answers: Object.fromEntries(Object.entries(answers).map(([questionId, values]) => [questionId, { answers: values }])) };
}
function emptyUserInputResponse() {
	return emptyAgentHarnessUserInputAnswers();
}
function readRequestId(record) {
	const value = record.requestId;
	return typeof value === "string" || typeof value === "number" ? value : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-active-turn.ts
async function activateCodexAttemptTurn(resources, turnRuntime, lifecycle, notifications, turn) {
	const { prompt, state: resourceState, projectorRef, trajectoryRecorder, pendingNativePreToolUseFailures } = resources;
	const { context, turnState } = prompt;
	const { runtime, attemptTools } = context;
	const { connection } = runtime;
	const { params, runAbortController, terminalState, abortExplicitly, abortFromUpstream, bindingStore, bindingIdentity, sessionAgentId, sandboxSessionKey, effectiveCwd } = connection;
	const { dynamicToolParams, computerContextEpoch, toolBridge } = attemptTools;
	const { state, userInputBridgeRef, steeringQueueRef, turnWatches, completeTurn, interruptTurn } = turnRuntime;
	const { emitExecutionPhaseOnce, emitLifecycleStart, maybeAnnounceFastModeAutoOff } = lifecycle;
	const { enqueueNotification } = notifications;
	const activeTurnId = turn.turn.id;
	const prepareNativeMcpAppResultDetails = createCodexNativeMcpAppResultDetailsPreparer({
		client: resourceState.client,
		threadId: resourceState.thread.threadId,
		attempt: dynamicToolParams
	});
	const streamState = {
		eventEmitted: false,
		needsTerminalSnapshot: false
	};
	emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
	userInputBridgeRef.current = createCodexUserInputBridge({
		paramsForRun: params,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		signal: runAbortController.signal
	});
	trajectoryRecorder?.recordEvent("prompt.submitted", {
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		prompt: turnState.codexTurnPromptText,
		imagesCount: params.images?.length ?? 0
	});
	projectorRef.current = new CodexAppServerEventProjector({
		...dynamicToolParams,
		onAgentEvent: (event) => {
			if (event.stream === "assistant" && typeof event.data.delta === "string") {
				streamState.eventEmitted = true;
				streamState.needsTerminalSnapshot ||= event.data.replaceable === true;
			}
			return dynamicToolParams.onAgentEvent?.(event);
		}
	}, resourceState.thread.threadId, activeTurnId, {
		initialContextTokens: connection.mutable.startupContextTokens,
		nativePostToolUseRelayEnabled: resourceState.nativeHookRelay?.allowedEvents.includes("post_tool_use") === true && resourceState.nativeHookRelay.shouldRelayEvent("post_tool_use"),
		readRecentRateLimits: () => readRecentCodexRateLimits(resourceState.client),
		runAbortSignal: runAbortController.signal,
		remoteWorkspaceRoot: connection.appServer.remoteWorkspaceRoot,
		remoteWorkspaceRequestTimeoutMs: connection.appServer.requestTimeoutMs,
		readRemoteWorkspaceFile: ({ path, maxBytes, signal, timeoutMs }) => readBoundedCodexRemoteWorkspaceFile({
			client: resourceState.client,
			path,
			maxBytes,
			signal,
			timeoutMs
		}),
		trajectoryRecorder,
		resolveDynamicToolResultContentSource: toolBridge.resultContentSourceForTool,
		onNativeToolResultRecorded: maybeAnnounceFastModeAutoOff,
		...prepareNativeMcpAppResultDetails ? { prepareNativeMcpAppResultDetails } : {},
		upstreamUserText: turnState.codexTurnPromptText,
		onContextCompacted: () => {
			computerContextEpoch.value += 1;
			delete computerContextEpoch.frameToolCallId;
			delete computerContextEpoch.frameImageIdentity;
		}
	});
	if (isTerminalTurnStatus(turn.turn.status)) state.terminalTurnNotificationQueued = true;
	emitLifecycleStart();
	const activeProjector = projectorRef.current;
	turnWatches.armTerminalIdleWatch();
	turnWatches.touchActivity("turn:start", { arm: true });
	turnWatches.armAttemptIdleWatch();
	turnWatches.touchActivity("turn:start", { attemptProgress: true });
	for (const failure of pendingNativePreToolUseFailures.splice(0)) activeProjector.recordNativeToolPreToolUseFailure(failure);
	if (resourceState.turnRoute) try {
		await resourceState.turnRoute.bindTurn(activeTurnId);
	} catch (error) {
		if (!state.terminalTurnNotificationQueued) throw error;
		await resourceState.turnRoute.drain();
		if (!state.completed) {
			turnWatches.clearAllTimers();
			throw error;
		}
	}
	if (!state.completed && isTerminalTurnStatus(turn.turn.status)) await enqueueNotification({
		method: "turn/completed",
		params: {
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			turn: turn.turn
		}
	}, {
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId
	});
	const activeSteeringQueue = createCodexSteeringQueue({
		client: resourceState.client,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		requestTimeoutMs: connection.appServer.requestTimeoutMs,
		claimPendingUserInput: () => userInputBridgeRef.current?.claimPendingRequest(),
		signal: runAbortController.signal
	});
	steeringQueueRef.current = activeSteeringQueue;
	const claimPendingUserInputAnswer = async (text, optionsLocal) => {
		if (optionsLocal?.isInboundUserMessage !== true || optionsLocal.images?.length) return false;
		return await claimPendingAgentQuestionAnswer({
			sessionKey: params.sessionKey ?? params.sessionId,
			text,
			persist: optionsLocal.userTurnTranscriptRecorder ? async () => {
				await optionsLocal.userTurnTranscriptRecorder?.persistApproved();
			} : void 0
		});
	};
	const cancelPendingUserInput = (resolvedBy) => cancelPendingAgentQuestionForSession({
		sessionKey: params.sessionKey ?? params.sessionId,
		resolvedBy
	});
	const queueMessage = async (text, optionsLocal) => {
		const isInboundUserMessage = optionsLocal?.isInboundUserMessage === true;
		if (await claimPendingUserInputAnswer(text, optionsLocal)) {
			optionsLocal?.onQueueAccepted?.(true);
			return;
		} else if (isInboundUserMessage && optionsLocal?.images?.length) try {
			await cancelPendingUserInput("image-reply");
		} catch (error) {
			log.warn("failed to cancel codex gateway question before image steering", { error });
		}
		try {
			await activeSteeringQueue.queue(text, optionsLocal);
		} catch (error) {
			if (error instanceof CodexSteeringAcceptedUnconfirmedError) return {
				transcriptCommit: "unconfirmed",
				errorMessage: formatErrorMessage(error)
			};
			throw error;
		}
	};
	const handle = {
		kind: "embedded",
		runId: params.runId,
		toolAuthorityFingerprint: params.toolAuthorityFingerprint,
		claimPendingUserInputAnswer,
		cancelPendingUserInput,
		queueMessage,
		messageInjection: {
			isAvailable: () => !state.completed && !state.terminalTurnNotificationQueued && !state.timedOut && !runAbortController.signal.aborted,
			queueMessage
		},
		isStreaming: () => !state.completed && !runAbortController.signal.aborted,
		isAborted: () => runAbortController.signal.aborted,
		isStopped: () => state.completed || state.timedOut || runAbortController.signal.aborted,
		isAbortable: () => !terminalState.terminalOutcomeFrozen || terminalState.sharedAbortAllowedAfterTerminalOutcome,
		isCompacting: () => projectorRef.current?.isCompacting() ?? false,
		supportsTranscriptCommitWait: true,
		supportsQueueMessageImages: true,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		cancel: () => abortExplicitly("cancelled"),
		abort: () => abortExplicitly("aborted")
	};
	params.replyOperation?.attachBackend(handle);
	setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
	const freezeRunTerminalOutcome = () => {
		if (terminalState.terminalOutcomeFrozen) return;
		terminalState.terminalOutcomeFrozen = true;
		params.abortSignal?.removeEventListener("abort", abortFromUpstream);
	};
	const notifyUserMessagePersisted = createCodexAppServerUserMessagePersistenceNotifier(params);
	mirrorPromptAtTurnStartBestEffort({
		params,
		agentId: sessionAgentId,
		notifyUserMessagePersisted,
		sessionKey: sandboxSessionKey,
		cwd: effectiveCwd,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		upstreamUserText: turnState.codexTurnPromptText
	});
	const abortListener = () => {
		if (state.timedOut) {
			(async () => {
				if (resourceState.thread.connectionScope !== "supervision") await bindingStore.mutate(bindingIdentity, {
					kind: "clear",
					threadId: resourceState.thread.threadId
				});
				await retireCodexAppServerClientAfterTimedOutTurn(resourceState.client, {
					threadId: resourceState.thread.threadId,
					turnId: activeTurnId,
					reason: String(runAbortController.signal.reason ?? "timeout"),
					suspectPhysicalClient: state.turnWatchTimeoutKind === "terminal"
				});
			})().finally(completeTurn);
			return;
		}
		interruptTurn(activeTurnId).finally(completeTurn);
	};
	runAbortController.signal.addEventListener("abort", abortListener, { once: true });
	if (runAbortController.signal.aborted) abortListener();
	return {
		activeTurnId,
		activeProjector,
		streamState,
		handle,
		freezeRunTerminalOutcome,
		notifyUserMessagePersisted,
		abortListener
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-cleanup.ts
async function cleanupCodexAttempt(resources, turnRuntime, lifecycle, requestRuntime, activeTurn) {
	const { prompt, state: resourceState, trajectoryRecorder, releaseCurrentRoute, releaseSharedClientLeaseAndRetireOneShotClient, releaseSandboxExecEnvironment, runCleanupStep } = resources;
	const { connection } = prompt.context.runtime;
	const { params, options, runAbortController, terminalState, bindingStore, bindingIdentity } = connection;
	const { state, steeringQueueRef, userInputBridgeRef, turnWatches } = turnRuntime;
	const { maybeEmitFastModeAutoResetBestEffort, emitLifecycleTerminal, buildLifecycleTerminalMeta } = lifecycle;
	const { codexModelCallDiagnostics } = requestRuntime;
	const { activeTurnId, abortListener, handle, freezeRunTerminalOutcome } = activeTurn;
	prompt.context.attemptTools.scheduledAppAuthoritySourceRef.current = void 0;
	try {
		steeringQueueRef.current?.cancel();
		if (params.isFinalFallbackAttempt !== false) await maybeEmitFastModeAutoResetBestEffort();
		codexModelCallDiagnostics.emitError("codex app-server run completed without model-call terminal event");
		emitLifecycleTerminal({
			phase: "error",
			error: "codex app-server run completed without lifecycle terminal event",
			...buildLifecycleTerminalMeta({
				aborted: runAbortController.signal.aborted && !state.clientClosedAbort,
				timedOut: state.timedOut
			})
		});
		if (trajectoryRecorder && !resourceState.trajectoryEndRecorded) trajectoryRecorder.recordEvent("session.ended", {
			status: state.timedOut || runAbortController.signal.aborted && !state.clientClosedAbort ? "interrupted" : "cleanup",
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			timedOut: state.timedOut,
			aborted: runAbortController.signal.aborted && !state.clientClosedAbort
		});
		await runCleanupStep("codex-trajectory-flush", () => trajectoryRecorder?.flush());
		const retainLiveIncognitoThread = terminalState.turnSucceeded && isIncognitoSessionKey(params.sessionKey);
		const retainedPersistentThread = terminalState.turnSucceeded && !isIncognitoSessionKey(params.sessionKey) && params.cleanupBundleMcpOnRunEnd !== true && resourceState.thread.liveThreadConfigFingerprint !== void 0 && resourceState.thread.clientId === resolveCodexAppServerClientInstanceId(resourceState.client) && resourceState.thread.preserveNativeModel !== true && resourceState.thread.connectionScope !== "supervision" && !resourceState.thread.ringZeroConfigFingerprint ? (await bindingStore.read(bindingIdentity))?.threadId === resourceState.thread.threadId && await bindingStore.withLease(bindingIdentity, async () => {
			if ((await bindingStore.read(bindingIdentity))?.threadId !== resourceState.thread.threadId) return false;
			return await retainCodexAppServerLiveThread(resourceState.client, resourceState.thread.threadId, resourceState.thread.liveThreadOwnership?.release ?? (async (threadId) => {
				if (!await unsubscribeCodexThreadBestEffort(resourceState.client, {
					threadId,
					timeoutMs: 5e3
				})) {
					await closeCodexStartupClientBestEffort(resourceState.client);
					throw new CodexAppServerUnsafeSubscriptionError(`Codex retained thread subscription could not be released: ${threadId}`);
				}
			}), resourceState.thread.liveThreadConfigFingerprint, connection.mutable.pluginAppServer.serviceTier);
		}) : false;
		const retainLiveThread = retainLiveIncognitoThread || retainedPersistentThread;
		const bindingReleased = isIncognitoSessionKey(params.sessionKey) && !retainLiveIncognitoThread ? await bindingStore.mutate(bindingIdentity, {
			kind: "clear",
			threadId: resourceState.thread.threadId
		}) : true;
		if (!state.timedOut && !retainLiveThread) {
			if (bindingReleased) {
				if (!await unsubscribeCodexThreadBestEffort(resourceState.client, {
					threadId: resourceState.thread.threadId,
					timeoutMs: 5e3
				})) await closeCodexStartupClientBestEffort(resourceState.client);
			}
		}
	} finally {
		await runCleanupStep("codex-user-input-cancel", () => userInputBridgeRef.current?.cancelPending());
		await runCleanupStep("codex-turn-watch-clear", () => turnWatches.clearAllTimers());
		await runCleanupStep("codex-route-release", releaseCurrentRoute);
		await runCleanupStep("codex-shared-client-release", releaseSharedClientLeaseAndRetireOneShotClient);
		const nativeHookRelay = resourceState.nativeHookRelay;
		resourceState.nativeHookRelay = void 0;
		await runCleanupStep("codex-native-hook-relay-release", () => {
			if (!nativeHookRelay) return;
			if (state.shouldDelayNativeHookRelayUnregister) scheduleCodexNativeHookRelayUnregister({
				relay: nativeHookRelay,
				hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec
			});
			else nativeHookRelay.unregister();
		});
		await runCleanupStep("codex-sandbox-release", releaseSandboxExecEnvironment);
		await runCleanupStep("codex-scoped-mcp-dispose", () => prompt.context.attemptTools.scopedMcpTools?.dispose());
		await runCleanupStep("codex-scheduled-mcp-dispose", () => prompt.context.attemptTools.scheduledConfiguredMcp?.dispose());
		await runCleanupStep("codex-abort-listener-remove", () => {
			runAbortController.signal.removeEventListener("abort", abortListener);
		});
		await runCleanupStep("codex-steering-cancel", () => steeringQueueRef.current?.cancel());
		await runCleanupStep("codex-terminal-freeze", freezeRunTerminalOutcome);
		await runCleanupStep("codex-reply-backend-detach", () => params.replyOperation?.detachBackend(handle));
		await runCleanupStep("codex-active-run-clear", () => {
			clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
		});
	}
}
//#endregion
//#region extensions/codex/src/app-server/workspace-dir-cache.ts
/** Process-local cache of Codex workspaces already created by the run loop. */
const codexWorkspaceDirCache = /* @__PURE__ */ new Set();
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle.ts
const CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN = 4;
function shouldKeepCodexSharedAbortOpen(params) {
	const terminal = attemptTerminal.project(params.result.terminal);
	if (params.explicitCancellationObserved || terminal.aborted || terminal.externalAbort) return false;
	return params.trigger === "memory" || !params.attemptSucceeded;
}
function withCodexAppServerFastModeServiceTier(appServer, params) {
	const fastMode = typeof params.fastMode === "function" ? params.fastMode() : params.fastMode;
	const serviceTier = fastMode === void 0 ? appServer.serviceTier : fastMode ? "priority" : void 0;
	if (serviceTier === appServer.serviceTier) return appServer;
	if (serviceTier) return {
		...appServer,
		serviceTier
	};
	return {
		...appServer,
		serviceTier: null
	};
}
function estimateCodexAppServerProjectedTurnTokens(params) {
	const inputChars = params.prompt.length + (params.developerInstructions?.length ?? 0);
	return Math.max(1, Math.ceil(inputChars / CODEX_APP_SERVER_PROJECTED_CHARS_PER_TOKEN));
}
async function ensureCodexWorkspaceDirOnce(workspaceDir) {
	const normalized = path.resolve(workspaceDir);
	if (codexWorkspaceDirCache.has(normalized)) return;
	await fs.mkdir(normalized, { recursive: true });
	codexWorkspaceDirCache.add(normalized);
}
async function emitCodexAppServerEvent(params, event) {
	try {
		emitAgentEvent({
			runId: params.runId,
			stream: event.stream,
			data: event.data,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {}
		});
	} catch (error) {
		log.debug("codex app-server global agent event emit failed", { error });
	}
	try {
		await params.onAgentEvent?.(event);
	} catch (error) {
		log.debug("codex app-server agent event handler threw", { error });
	}
}
async function runCodexAgentEndHook(params, hookParams) {
	const sideEffectParams = {
		...hookParams,
		ctx: {
			...hookParams.ctx,
			config: params.config
		}
	};
	if (!params.messageChannel && !params.messageProvider) {
		await awaitAgentEndSideEffects(sideEffectParams);
		return;
	}
	runAgentEndSideEffects(sideEffectParams);
}
//#endregion
//#region extensions/codex/src/app-server/startup-binding.ts
const CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS = 3e5;
const CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS = 2e4;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS = 8e3;
const CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO = .5;
const CODEX_APP_SERVER_ROLLOUT_TAIL_READ_BYTES = 64 * 1024;
const CODEX_APP_SERVER_BYTE_UNITS = {
	b: 1,
	k: 1024,
	kb: 1024,
	kib: 1024,
	m: 1024 * 1024,
	mb: 1024 * 1024,
	mib: 1024 * 1024,
	g: 1024 * 1024 * 1024,
	gb: 1024 * 1024 * 1024,
	gib: 1024 * 1024 * 1024,
	t: 1024 * 1024 * 1024 * 1024,
	tb: 1024 * 1024 * 1024 * 1024,
	tib: 1024 * 1024 * 1024 * 1024
};
const codexSessionRecordCache = /* @__PURE__ */ new Map();
function parseCodexAppServerByteLimit(value) {
	if (typeof value === "number" && Number.isFinite(value) && value > 0) return Math.floor(value);
	if (typeof value !== "string") return;
	const match = value.trim().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/i);
	if (!match) return;
	const amount = Number(match[1]);
	if (!Number.isFinite(amount) || amount <= 0) return;
	const unit = (match[2] ?? "b").toLowerCase();
	const multiplier = CODEX_APP_SERVER_BYTE_UNITS[unit];
	if (multiplier === void 0) return;
	return Math.max(1, Math.round(amount * multiplier));
}
async function listCodexAppServerRolloutFilesForThread(agentDir, threadId, codexHome, rolloutPath) {
	const resolvedAgentDir = path.resolve(agentDir);
	const resolvedCodexHome = codexHome?.trim() ? path.resolve(codexHome) : resolveCodexAppServerHomeDir(resolvedAgentDir);
	const roots = [
		path.join(resolvedCodexHome, "sessions"),
		path.join(resolveCodexAppServerHomeDir(resolvedAgentDir), "sessions"),
		path.join(resolvedAgentDir, "agent", "codex-home", "sessions"),
		path.join(path.dirname(resolvedAgentDir), "codex-home", "sessions")
	];
	const rolloutRoot = rolloutPath ? roots.find((root) => {
		const relativePath = path.relative(root, rolloutPath);
		return relativePath !== "" && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath);
	}) : void 0;
	if (rolloutPath && rolloutRoot && path.isAbsolute(rolloutPath) && path.extname(rolloutPath) === ".jsonl" && path.basename(rolloutPath).includes(threadId)) try {
		const opened = await (await root(rolloutRoot, {
			hardlinks: "reject",
			maxBytes: Number.MAX_SAFE_INTEGER,
			symlinks: "reject"
		})).open(path.relative(rolloutRoot, rolloutPath));
		return [{
			path: opened.realPath,
			bytes: opened.stat.size,
			handle: opened.handle
		}];
	} catch {}
	const files = [];
	const visited = /* @__PURE__ */ new Set();
	for (const root of roots) {
		if (visited.has(root)) continue;
		visited.add(root);
		const stack = [root];
		while (stack.length > 0) {
			const dir = stack.pop();
			if (!dir) continue;
			let entries;
			try {
				entries = await fs.readdir(dir, { withFileTypes: true });
			} catch {
				continue;
			}
			for (const entry of entries) {
				const file = path.join(dir, entry.name);
				if (entry.isDirectory()) {
					stack.push(file);
					continue;
				}
				if (!entry.isFile() || !entry.name.endsWith(".jsonl") || !entry.name.includes(threadId)) continue;
				try {
					files.push({
						path: file,
						bytes: (await fs.stat(file)).size
					});
				} catch {}
			}
		}
	}
	return files;
}
async function readCodexSessionRecordForSessionFile(sessionFile) {
	if (isSqliteSessionFileMarker(sessionFile)) return;
	const sessionsFile = path.join(path.dirname(sessionFile), "sessions.json");
	const resolvedSessionFile = path.resolve(sessionFile);
	let stat;
	try {
		stat = await fs.stat(sessionsFile);
	} catch {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	const cached = codexSessionRecordCache.get(resolvedSessionFile);
	if (cached?.sessionsFile === sessionsFile && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) return cached.record;
	let store;
	try {
		store = JSON.parse(await fs.readFile(sessionsFile, "utf8"));
	} catch {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	if (!isJsonObject(store)) {
		codexSessionRecordCache.delete(resolvedSessionFile);
		return;
	}
	let found;
	for (const [sessionKey, record] of Object.entries(store)) {
		if (!isJsonObject(record) || typeof record.sessionFile !== "string") continue;
		if (path.resolve(record.sessionFile) !== resolvedSessionFile) continue;
		found = {
			sessionKey,
			...record
		};
		break;
	}
	codexSessionRecordCache.set(resolvedSessionFile, {
		sessionsFile,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		record: found
	});
	return found;
}
function isSqliteSessionFileMarker(sessionFile) {
	return parseSqliteSessionFileMarker(sessionFile) !== void 0;
}
async function readCodexAppServerRolloutTokenSnapshot(file, openedHandle) {
	let handle = openedHandle;
	if (!handle) try {
		handle = await fs.open(file, "r");
	} catch {
		return;
	}
	let snapshot;
	try {
		let position = (await handle.stat()).size;
		const partialLineFragments = [];
		const applySnapshotLine = (line) => {
			const lineSnapshot = readCodexAppServerRolloutTokenSnapshotLine(line);
			if (lineSnapshot === void 0) return false;
			snapshot ??= {};
			snapshot.totalTokens ??= lineSnapshot.totalTokens;
			snapshot.modelContextWindow ??= lineSnapshot.modelContextWindow;
			return snapshot.totalTokens !== void 0 && snapshot.modelContextWindow !== void 0;
		};
		while (position > 0) {
			const bytesToRead = Math.min(position, CODEX_APP_SERVER_ROLLOUT_TAIL_READ_BYTES);
			const nextPosition = position - bytesToRead;
			const chunk = Buffer.allocUnsafe(bytesToRead);
			let bytesRead = 0;
			while (bytesRead < bytesToRead) {
				const result = await handle.read(chunk, bytesRead, bytesToRead - bytesRead, nextPosition + bytesRead);
				if (result.bytesRead === 0) return snapshot;
				bytesRead += result.bytesRead;
			}
			let lineEnd = bytesRead;
			for (let index = bytesRead - 1; index >= 0; index -= 1) {
				if (chunk[index] !== 10) continue;
				const lineFragment = chunk.subarray(index + 1, lineEnd);
				const line = partialLineFragments.length === 0 ? lineFragment.toString("utf8") : Buffer.concat([lineFragment, ...partialLineFragments.toReversed()]).toString("utf8");
				partialLineFragments.length = 0;
				if (applySnapshotLine(line)) return snapshot;
				lineEnd = index;
			}
			if (lineEnd > 0) partialLineFragments.push(chunk.subarray(0, lineEnd));
			position = nextPosition;
		}
		if (partialLineFragments.length > 0) applySnapshotLine(Buffer.concat(partialLineFragments.toReversed()).toString("utf8"));
	} finally {
		await handle.close();
	}
	return snapshot;
}
function readCodexAppServerRolloutTokenSnapshotLine(line) {
	if (!line.trim()) return;
	try {
		const parsed = JSON.parse(line);
		const payload = isJsonObject(parsed) ? parsed.payload : void 0;
		const info = isJsonObject(payload) && payload.type === "token_count" && isJsonObject(payload.info) ? payload.info : void 0;
		if (!info) return;
		const usage = isJsonObject(info.last_token_usage) ? info.last_token_usage : isJsonObject(info.total_token_usage) ? info.total_token_usage : void 0;
		const value = usage?.total_tokens ?? usage?.totalTokens;
		const totalTokens = typeof value === "number" && Number.isFinite(value) ? value : void 0;
		const windowValue = info.model_context_window ?? info.modelContextWindow;
		const modelContextWindow = typeof windowValue === "number" && Number.isFinite(windowValue) && windowValue > 0 ? Math.floor(windowValue) : void 0;
		const snapshot = {};
		if (totalTokens !== void 0) snapshot.totalTokens = totalTokens;
		if (modelContextWindow !== void 0) snapshot.modelContextWindow = modelContextWindow;
		return snapshot.totalTokens !== void 0 || snapshot.modelContextWindow !== void 0 ? snapshot : void 0;
	} catch {
		return;
	}
}
function readCompactionConfig(config) {
	return isJsonObject(config?.agents?.defaults?.compaction) ? config.agents.defaults.compaction : void 0;
}
function resolveCodexAppServerNativeThreadReserveTokens(_config) {
	return CODEX_APP_SERVER_NATIVE_THREAD_DEFAULT_RESERVE_TOKENS;
}
function resolveCodexAppServerNativeThreadTokenFuse(params) {
	const projectedTurnTokens = typeof params.projectedTurnTokens === "number" && Number.isFinite(params.projectedTurnTokens) && params.projectedTurnTokens > 0 ? Math.floor(params.projectedTurnTokens) : 0;
	const contextWindow = params.modelContextWindow ?? CODEX_APP_SERVER_NATIVE_THREAD_FALLBACK_MAX_TOKENS;
	const minPromptBudget = Math.min(CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_TOKENS, Math.max(1, Math.floor(contextWindow * CODEX_APP_SERVER_NATIVE_THREAD_MIN_PROMPT_BUDGET_RATIO)));
	const effectiveReserveTokens = Math.min(params.reserveTokens, Math.max(0, contextWindow - minPromptBudget));
	return Math.max(1, contextWindow - effectiveReserveTokens - projectedTurnTokens);
}
function maxFiniteNumber(values) {
	const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
	if (nums.length === 0) return;
	return Math.max(...nums);
}
function minFiniteNumber(values) {
	const nums = values.filter((value) => typeof value === "number" && Number.isFinite(value));
	if (nums.length === 0) return;
	return Math.min(...nums);
}
function hasContextEngineThreadBootstrapProjection(binding) {
	return binding.contextEngine?.projection?.mode === "thread_bootstrap";
}
/** Clears and drops a binding when the native Codex thread is too large to resume safely. */
async function rotateOversizedCodexAppServerStartupBinding(params) {
	const binding = params.binding;
	if (!binding?.threadId) return { binding };
	if (binding.connectionScope === "supervision") return { binding };
	const sessionRecord = await readCodexSessionRecordForSessionFile(params.sessionFile);
	const rolloutFiles = await listCodexAppServerRolloutFilesForThread(params.agentDir, binding.threadId, params.codexHome, binding.rolloutPath);
	const maxBytes = parseCodexAppServerByteLimit(readCompactionConfig(params.config)?.maxActiveTranscriptBytes);
	if (maxBytes !== void 0 && params.contextEngineActive === true && hasContextEngineThreadBootstrapProjection(binding)) log.debug("codex app-server deferring native transcript byte guard for context-engine thread bootstrap", {
		threadId: binding.threadId,
		engineId: binding.contextEngine?.engineId,
		epoch: binding.contextEngine?.projection?.epoch,
		fingerprint: binding.contextEngine?.projection?.fingerprint
	});
	else if (maxBytes !== void 0) {
		const oversizedFiles = rolloutFiles.filter((file) => file.bytes >= maxBytes);
		if (oversizedFiles.length > 0) {
			await Promise.all(rolloutFiles.map(async (file) => {
				await file.handle?.close();
			}));
			log.warn("codex app-server native transcript exceeded active byte limit; starting a fresh thread", {
				threadId: binding.threadId,
				maxBytes,
				files: oversizedFiles.map((file) => ({
					path: file.path,
					bytes: file.bytes
				}))
			});
			await params.bindingStore.mutate(params.identity, {
				kind: "clear",
				threadId: binding.threadId
			});
			return { binding: void 0 };
		}
	}
	const nativeTokenSnapshots = await Promise.all(rolloutFiles.map(async (file) => readCodexAppServerRolloutTokenSnapshot(file.path, file.handle)));
	const nativeTokens = maxFiniteNumber(nativeTokenSnapshots.map((snapshot) => snapshot?.totalTokens));
	const nativeModelContextWindow = maxFiniteNumber(nativeTokenSnapshots.map((snapshot) => snapshot?.modelContextWindow));
	const sessionModelContextWindow = typeof sessionRecord?.contextTokens === "number" && Number.isFinite(sessionRecord.contextTokens) && sessionRecord.contextTokens > 0 ? Math.floor(sessionRecord.contextTokens) : void 0;
	const reserveTokens = resolveCodexAppServerNativeThreadReserveTokens(params.config);
	const maxTokens = resolveCodexAppServerNativeThreadTokenFuse({
		modelContextWindow: minFiniteNumber([nativeModelContextWindow, sessionModelContextWindow]),
		reserveTokens,
		projectedTurnTokens: params.projectedTurnTokens
	});
	const sessionTokens = sessionRecord?.totalTokensFresh === true && sessionRecord.totalTokensVersion === 1 && typeof sessionRecord?.totalTokens === "number" && Number.isFinite(sessionRecord.totalTokens) ? sessionRecord.totalTokens : void 0;
	const tokenCount = maxFiniteNumber([sessionTokens, nativeTokens]);
	if (tokenCount !== void 0 && tokenCount >= maxTokens) {
		log.warn("codex app-server native transcript exceeded active token limit; starting a fresh thread", {
			threadId: binding.threadId,
			maxTokens,
			sessionKey: sessionRecord?.sessionKey,
			sessionTokens,
			nativeTokens,
			nativeModelContextWindow,
			sessionModelContextWindow,
			reserveTokens,
			projectedTurnTokens: params.projectedTurnTokens
		});
		await params.bindingStore.mutate(params.identity, {
			kind: "clear",
			threadId: binding.threadId
		});
		return { binding: void 0 };
	}
	const startupContextTokens = nativeModelContextWindow ?? sessionModelContextWindow;
	return {
		binding,
		...startupContextTokens ? { startupContextTokens } : {}
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-connection.ts
function applyStoredBindingPermissions(params) {
	if (params.execPolicyTouched || params.binding?.connectionScope === "supervision") return params.appServer;
	return {
		...params.appServer,
		approvalPolicy: params.binding?.approvalPolicy ?? params.appServer.approvalPolicy,
		sandbox: params.binding?.sandbox ?? params.appServer.sandbox
	};
}
async function prepareCodexAttemptConnection({ params, options }) {
	const attemptStartedAt = Date.now();
	const profilerEnabled = isCodexAppServerProfilerEnabled(params.config);
	const codexModelCallTrace = freezeDiagnosticTraceContext(createDiagnosticTraceContextFromActiveScope());
	const codexModelContentCapture = resolveDiagnosticModelContentCapturePolicy(params.config);
	const codexModelCallId = `${params.runId}:codex-model:1`;
	const fastModeAutoStartedAtMs = typeof params.fastModeStartedAtMs === "number" && Number.isFinite(params.fastModeStartedAtMs) ? params.fastModeStartedAtMs : void 0;
	const fastModeAutoProgressState = params.fastModeAutoProgressState ?? {
		offAnnounced: false,
		resetAnnounced: false
	};
	const preDynamicStartupStages = createCodexDynamicToolBuildStageTracker({ enabled: profilerEnabled });
	const attemptClientFactory = options.clientFactory ?? getLeasedSharedCodexAppServerClient;
	const runtimeArtifactRequest = params.captureRuntimeArtifact || params.expectedRuntimeArtifact ? params.expectedRuntimeArtifact ? { expected: params.expectedRuntimeArtifact } : {} : void 0;
	const pluginConfig = readCodexPluginConfig(options.pluginConfig);
	const computerUseConfig = resolveCodexComputerUseConfig({ pluginConfig });
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const beforeToolCallPolicy = getBeforeToolCallPolicyDiagnosticState();
	preDynamicStartupStages.mark("config");
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	await ensureCodexWorkspaceDirOnce(resolvedWorkspace);
	preDynamicStartupStages.mark("workspace");
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
	const contextSessionKey = params.sessionKey?.trim() || sandboxSessionKey;
	const sandbox = params.sandbox !== void 0 ? params.sandbox : await resolveSandboxContext({
		config: params.config,
		sessionKey: sandboxSessionKey,
		workspaceDir: resolvedWorkspace
	});
	preDynamicStartupStages.mark("sandbox");
	const execPolicy = resolveOpenClawExecPolicyForCodexAppServer({
		execOverrides: params.execOverrides,
		approvals: loadExecApprovals(),
		config: params.config,
		agentId: sessionAgentId
	});
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId);
	let bindingIdentity = sessionBindingIdentity({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	});
	let bindingStore = options.bindingStore;
	preDynamicStartupStages.mark("session-agent");
	let activeContextEngine = isActiveHarnessContextEngine(params.contextEngine) ? params.contextEngine : void 0;
	const isInactiveThreadBootstrapBinding = (binding) => !activeContextEngine && binding?.contextEngine?.projection?.mode === "thread_bootstrap";
	if (bindingIdentity.kind === "session" && bindingIdentity.sessionKey && (params.sessionTarget?.storePath || params.config?.session?.store)) {
		const authority = resolveCodexRunSessionBindingAuthority({
			identity: bindingIdentity,
			config: params.config,
			storePath: params.sessionTarget?.storePath
		});
		if (authority === "superseded") throw createCodexSessionGenerationSupersededError(bindingIdentity.sessionId);
		if (authority === "ephemeral") {
			const logicalIdentity = bindingIdentity;
			const physicalIdentity = {
				kind: "session",
				agentId: bindingIdentity.agentId,
				sessionId: bindingIdentity.sessionId
			};
			bindingStore = scopeCodexRunBindingStore({
				bindingStore,
				logicalIdentity,
				physicalIdentity
			});
			bindingIdentity = physicalIdentity;
		}
	}
	let startupBinding = await bindingStore.read(bindingIdentity);
	if (!startupBinding && bindingIdentity.kind === "session" && bindingIdentity.sessionKey) {
		if (!await reclaimCurrentCodexSessionGeneration({
			bindingStore,
			identity: bindingIdentity,
			config: params.config,
			storePath: params.sessionTarget?.storePath
		})) throw createCodexSessionGenerationSupersededError(bindingIdentity.sessionId);
		startupBinding = await bindingStore.read(bindingIdentity);
	}
	preDynamicStartupStages.mark("read-binding");
	const usesSupervisionConnection = startupBinding?.connectionScope === "supervision";
	if (usesSupervisionConnection) activeContextEngine = void 0;
	if (usesSupervisionConnection && pluginConfig.supervision?.enabled !== true) throw new Error("Codex supervision is disabled; refusing to open a native user-home supervised session");
	const resolveRuntimeOptionsForBinding = (selection) => applyStoredBindingPermissions({
		appServer: resolveCodexBindingAppServerConnection({
			binding: startupBinding,
			pluginConfig,
			execPolicy,
			modelProvider: selection.modelProvider,
			model: selection.model,
			config: params.config,
			agentDir,
			openClawSandboxActive: sandbox?.enabled === true
		}).appServer,
		binding: startupBinding,
		execPolicyTouched: execPolicy.touched
	});
	const initialStartupBindingHadInactiveThreadBootstrap = isInactiveThreadBootstrapBinding(startupBinding);
	const preparedAuthRoute = usesSupervisionConnection ? void 0 : params.runtimePlan?.auth.modelRoute;
	const startupAuthProfileCandidate = usesSupervisionConnection ? void 0 : preparedAuthRoute ? params.runtimePlan?.auth.forwardedAuthProfileId : params.runtimePlan?.auth.forwardedAuthProfileId ?? params.authProfileId ?? startupBinding?.authProfileId;
	const resolvedStartupAuthProfileId = usesSupervisionConnection ? void 0 : preparedAuthRoute ? startupAuthProfileCandidate : params.authProfileStore ? resolveCodexAppServerAuthProfileId({
		authProfileId: startupAuthProfileCandidate,
		store: params.authProfileStore,
		config: params.config
	}) : resolveCodexAppServerAuthProfileIdForAgent({
		authProfileId: startupAuthProfileCandidate,
		agentDir,
		config: params.config
	});
	const { authProfileId: startupAuthProfileId, nativeAuthProfile, preparedAuth: startupPreparedAuth } = usesSupervisionConnection ? {
		authProfileId: void 0,
		nativeAuthProfile: true,
		preparedAuth: void 0
	} : await resolveCodexAppServerPreparedAuthHandoff({
		authRequirement: preparedAuthRoute?.authRequirement,
		resolvedApiKey: params.resolvedApiKey,
		authProfileId: resolvedStartupAuthProfileId,
		authProfileStore: params.authProfileStore,
		agentDir,
		homeScope: resolveCodexAppServerHomeScope({ appServer: pluginConfig.appServer }),
		requirePreparedAuth: isCodexRemoteExecPlacementSandbox(sandbox),
		config: params.config,
		subscriptionProfileRequiredError: "Prepared Codex subscription route requires a forwarded OpenAI OAuth or token profile.",
		subscriptionProfileUnusableError: "Prepared Codex subscription auth profile is unusable."
	});
	const startupClientAuthProfileId = usesSupervisionConnection || startupPreparedAuth?.kind === "api-key" ? null : startupAuthProfileId;
	const resolveReviewerPolicyContext = (binding) => {
		const nativeModelOwned = binding?.preserveNativeModel === true;
		return resolveCodexModelBackedReviewerPolicyContext({
			provider: nativeModelOwned ? "codex" : params.provider,
			model: nativeModelOwned ? binding.model : params.modelId,
			bindingModelProvider: binding?.modelProvider,
			bindingModel: binding?.model,
			nativeAuthProfile
		});
	};
	let reviewerPolicyContext = resolveReviewerPolicyContext(startupBinding);
	preDynamicStartupStages.mark("auth-profile");
	let configuredAppServer = resolveRuntimeOptionsForBinding({
		modelProvider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model
	});
	const effectiveWorkspace = sandbox?.enabled ? sandbox.workspaceAccess === "rw" ? resolvedWorkspace : sandbox.workspaceDir : resolvedWorkspace;
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	if (sandbox?.enabled && requestedCwd && requestedCwd !== resolvedWorkspace) throw new Error("cwd override is not supported for sandboxed Codex app-server runs; omit cwd or use the agent workspace as cwd");
	const effectiveCwd = sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace;
	if (effectiveWorkspace !== resolvedWorkspace) await ensureCodexWorkspaceDirOnce(effectiveWorkspace);
	preDynamicStartupStages.mark("effective-workspace");
	const shouldPromoteApprovalPolicy = beforeToolCallPolicy.hasBeforeToolCallHook || beforeToolCallPolicy.trustedToolPolicies.length > 0;
	const resolvePolicyAppServer = () => resolveCodexAppServerForOpenClawToolPolicy({
		appServer: configuredAppServer,
		pluginConfig,
		env: process.env,
		shouldPromote: shouldPromoteApprovalPolicy,
		execPolicy,
		canUseUntrustedApprovalPolicy: shouldPromoteApprovalPolicy && configuredAppServer.approvalPolicy === "never" && (configuredAppServer.start.transport !== "stdio" || isCodexAppServerApprovalPolicyAllowedByRequirements("untrusted"))
	});
	let policyAppServer = resolvePolicyAppServer();
	let appServer = resolveCodexAppServerForModelProvider({
		appServer: policyAppServer,
		provider: reviewerPolicyContext.modelProvider,
		model: reviewerPolicyContext.model,
		config: params.config,
		env: process.env,
		agentDir
	});
	let approvalPolicyPromotedForOpenClawToolPolicy = configuredAppServer.approvalPolicy === "never" && appServer.approvalPolicy === "untrusted";
	if (approvalPolicyPromotedForOpenClawToolPolicy) log.info("codex app-server approval policy promoted for OpenClaw tool policy", {
		from: "never",
		to: "untrusted",
		beforeToolCallHook: beforeToolCallPolicy.hasBeforeToolCallHook,
		trustedToolPolicies: beforeToolCallPolicy.trustedToolPolicies
	});
	preDynamicStartupStages.mark("app-server-policy");
	preDynamicStartupStages.mark("native-hook-relay");
	const terminalState = {
		turnSucceeded: false,
		explicitCancellationObserved: false,
		explicitCancellationReason: void 0,
		terminalOutcomeFrozen: false,
		sharedAbortAllowedAfterTerminalOutcome: false
	};
	const runAbortController = new AbortController();
	let attemptAbortNotified = false;
	const notifyAttemptAbort = () => {
		if (attemptAbortNotified) return;
		attemptAbortNotified = true;
		params.onAttemptAbort?.();
	};
	const abortExplicitly = (reason) => {
		if (terminalState.terminalOutcomeFrozen) {
			if (terminalState.sharedAbortAllowedAfterTerminalOutcome) notifyAttemptAbort();
			return;
		}
		notifyAttemptAbort();
		terminalState.explicitCancellationObserved = true;
		terminalState.explicitCancellationReason ??= reason;
		runAbortController.abort(reason);
	};
	const abortFromUpstream = () => {
		abortExplicitly(params.abortSignal?.reason ?? "upstream_abort");
	};
	if (params.abortSignal?.aborted) abortFromUpstream();
	else params.abortSignal?.addEventListener("abort", abortFromUpstream, { once: true });
	const startupBindingBeforeRotation = startupBinding;
	const startupBindingResolution = await rotateOversizedCodexAppServerStartupBinding({
		binding: startupBinding,
		bindingStore,
		identity: bindingIdentity,
		sessionFile: params.sessionFile,
		agentDir,
		codexHome: appServer.start.env?.CODEX_HOME,
		config: params.config,
		contextEngineActive: Boolean(activeContextEngine)
	});
	startupBinding = startupBindingResolution.binding;
	const initialInactiveThreadBootstrapBindingForcedFreshStart = initialStartupBindingHadInactiveThreadBootstrap && !startupBinding?.threadId;
	preDynamicStartupStages.mark("rotate-binding");
	if (startupBinding !== startupBindingBeforeRotation) {
		reviewerPolicyContext = resolveReviewerPolicyContext(startupBinding);
		configuredAppServer = resolveRuntimeOptionsForBinding({
			modelProvider: reviewerPolicyContext.modelProvider,
			model: reviewerPolicyContext.model
		});
		policyAppServer = resolvePolicyAppServer();
		appServer = resolveCodexAppServerForModelProvider({
			appServer: policyAppServer,
			provider: reviewerPolicyContext.modelProvider,
			model: reviewerPolicyContext.model,
			config: params.config,
			env: process.env,
			agentDir
		});
		approvalPolicyPromotedForOpenClawToolPolicy = configuredAppServer.approvalPolicy === "never" && appServer.approvalPolicy === "untrusted";
	}
	const nativeHookRelayEvents = resolveCodexNativeHookRelayEvents({
		configuredEvents: options.nativeHookRelay?.events,
		appServer
	});
	const mutable = {
		startupBinding,
		startupContextTokens: startupBindingResolution.startupContextTokens,
		pluginAppServer: appServer
	};
	const resolveRuntimeOptionsForCurrentBinding = (selection) => applyStoredBindingPermissions({
		appServer: resolveCodexBindingAppServerConnection({
			binding: mutable.startupBinding,
			pluginConfig,
			execPolicy,
			modelProvider: selection.modelProvider,
			model: selection.model,
			config: params.config,
			agentDir,
			openClawSandboxActive: sandbox?.enabled === true
		}).appServer,
		binding: mutable.startupBinding,
		execPolicyTouched: execPolicy.touched
	});
	return {
		params,
		options,
		attemptStartedAt,
		profilerEnabled,
		codexModelCallTrace,
		codexModelContentCapture,
		codexModelCallId,
		fastModeAutoStartedAtMs,
		fastModeAutoProgressState,
		preDynamicStartupStages,
		attemptClientFactory,
		runtimeArtifactRequest,
		pluginConfig,
		computerUseConfig,
		sessionAgentId,
		resolvedWorkspace,
		sandboxSessionKey,
		contextSessionKey,
		sandbox,
		agentDir,
		bindingIdentity,
		bindingStore,
		activeContextEngine,
		isInactiveThreadBootstrapBinding,
		usesSupervisionConnection,
		startupAuthProfileId,
		startupAuthRequirement: preparedAuthRoute?.authRequirement,
		startupPreparedAuth,
		startupClientAuthProfileId,
		effectiveWorkspace,
		effectiveCwd,
		appServer,
		approvalPolicyPromotedForOpenClawToolPolicy,
		nativeHookRelayEvents,
		runAbortController,
		terminalState,
		abortExplicitly,
		abortFromUpstream,
		resolveReviewerPolicyContext,
		resolveRuntimeOptionsForCurrentBinding,
		mutable,
		initialStartupBindingHadInactiveThreadBootstrap,
		initialInactiveThreadBootstrapBindingForcedFreshStart
	};
}
//#endregion
//#region extensions/codex/src/app-server/attempt-context.ts
/**
* Builds Codex app-server prompt context, workspace bootstrap injections,
* system-prompt reports, and context-engine projection decisions.
*/
const CODEX_NATIVE_PROJECT_DOC_BASENAMES = /* @__PURE__ */ new Set(["agents.md"]);
const CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = /* @__PURE__ */ new Set([
	"identity.md",
	"soul.md",
	"user.md"
]);
const CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES = new Set(CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
const CODEX_MEMORY_CONTEXT_BASENAME = "memory.md";
const CODEX_MEMORY_TOOL_NAMES = /* @__PURE__ */ new Set(["memory_search", "memory_get"]);
const CODEX_BOOTSTRAP_CONTEXT_ORDER = /* @__PURE__ */ new Map([
	["soul.md", 10],
	["identity.md", 20],
	["user.md", 30],
	["bootstrap.md", 50],
	["memory.md", 60]
]);
/** Reads mirrored Codex session history for harness hooks. */
async function readMirroredSessionHistoryMessages(params) {
	const { admission, ...target } = params;
	const messages = await readCodexMirroredSessionHistoryMessages(target, admission);
	if (!messages) log.warn("failed to read mirrored session history for codex harness hooks", { sessionFile: params.sessionFile });
	return messages;
}
/** Reads a valid thread-bootstrap projection request from context-engine output. */
function readContextEngineThreadBootstrapProjection(projection) {
	if (projection?.mode !== "thread_bootstrap") return;
	const epoch = projection.epoch?.trim();
	if (!epoch) {
		log.warn("context engine requested Codex thread-bootstrap projection without an epoch; using per-turn projection");
		return;
	}
	const fingerprint = projection.fingerprint?.trim();
	return {
		mode: "thread_bootstrap",
		epoch,
		...fingerprint ? { fingerprint } : {}
	};
}
/**
* Decides whether an existing Codex thread can reuse its context-engine
* bootstrap projection or must be reprojected.
*/
function resolveContextEngineBootstrapProjectionDecision(params) {
	const bindingProjection = params.startupBinding?.contextEngine?.projection;
	if (!params.startupBinding?.threadId || !bindingProjection) return {
		project: true,
		reason: !params.startupBinding?.threadId ? "missing-thread-binding" : "missing-projection-binding"
	};
	if (!params.expectedBinding || !isContextEngineBindingCompatible(params.startupBinding.contextEngine, params.expectedBinding)) return {
		project: true,
		reason: "context-engine-binding-mismatch"
	};
	if (!areCodexDynamicToolFingerprintsCompatible({
		previous: params.startupBinding.dynamicToolsFingerprint,
		next: params.dynamicToolsFingerprint,
		nextLegacy: params.legacyDynamicToolsFingerprint
	})) return {
		project: true,
		reason: "dynamic-tools-mismatch"
	};
	return bindingProjection.mode !== "thread_bootstrap" || bindingProjection.epoch !== params.projection.epoch || bindingProjection.fingerprint !== params.projection.fingerprint ? {
		project: true,
		reason: "projection-mismatch"
	} : {
		project: false,
		reason: "matching-thread-bootstrap-binding"
	};
}
/**
* Loads workspace bootstrap files and partitions them into Codex-native prompt,
* developer-instruction, heartbeat, and memory-tool contexts.
*/
async function buildCodexWorkspaceBootstrapContext(params) {
	try {
		const memoryToolsAvailable = params.memoryToolNames.length > 0 && canRouteCodexWorkspaceMemoryThroughTools({
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			workspaceDir: params.effectiveWorkspace
		});
		const bootstrapFiles = await resolveBootstrapFilesForRun({
			workspaceDir: params.resolvedWorkspace,
			config: params.params.config,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			chatType: params.params.chatType,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => log.warn(message),
			contextMode: params.params.bootstrapContextMode,
			runKind: params.params.bootstrapContextRunKind
		});
		const memoryToolRoutedBootstrapFiles = memoryToolsAvailable ? selectCodexWorkspaceMemoryReferenceFiles({
			bootstrapFiles,
			workspaceDir: params.resolvedWorkspace
		}) : [];
		const memoryReferenceFiles = memoryToolRoutedBootstrapFiles.map((file) => remapCodexContextFilePath({
			file: toCodexEmbeddedContextFile(file),
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: params.effectiveWorkspace
		}));
		const contextFiles = buildBootstrapContextForFiles(memoryToolsAvailable ? bootstrapFiles.filter((file) => !isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.resolvedWorkspace
		})) : bootstrapFiles, {
			config: params.params.config,
			agentId: params.params.agentId ?? params.sessionAgentId,
			warn: (message) => log.warn(message)
		}).map((file) => remapCodexContextFilePath({
			file,
			sourceWorkspaceDir: params.resolvedWorkspace,
			targetWorkspaceDir: params.effectiveWorkspace
		}));
		const promptContextFiles = selectCodexWorkspacePromptContextFiles(contextFiles, {
			excludeMemory: memoryToolsAvailable,
			memoryWorkspaceDir: params.effectiveWorkspace
		});
		const turnScopedDeveloperInstructionFiles = shouldInjectCodexOpenClawPromptContext(params.params) ? selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) : [];
		return {
			bootstrapFiles,
			contextFiles,
			promptContextFiles,
			turnScopedDeveloperInstructionFiles,
			memoryReferenceFiles,
			memoryToolRoutedBootstrapFiles,
			memoryToolNames: [...params.memoryToolNames],
			memoryToolRouted: memoryToolsAvailable,
			promptContext: renderCodexWorkspaceBootstrapPromptContext(promptContextFiles),
			turnScopedDeveloperInstructions: renderCodexWorkspaceCollaborationDeveloperInstructions(turnScopedDeveloperInstructionFiles),
			memoryCollaborationInstructions: shouldInjectCodexOpenClawPromptContext(params.params) ? await renderCodexWorkspaceMemoryCollaborationInstructions({
				files: memoryReferenceFiles,
				toolNames: params.memoryToolNames,
				memoryToolRouted: memoryToolsAvailable,
				citationsMode: params.params.config?.memory?.citations,
				agentId: params.params.agentId ?? params.sessionAgentId,
				agentSessionKey: params.sessionKey,
				sandboxed: params.sandboxed
			}) : void 0
		};
	} catch (error) {
		log.warn("failed to load codex workspace bootstrap instructions", { error });
		return {
			bootstrapFiles: [],
			contextFiles: []
		};
	}
}
/**
* Builds the prompt-size, bootstrap-file, skill, and tool-schema accounting
* report for a Codex run.
*/
function buildCodexSystemPromptReport(params) {
	const toolEntries = flattenCodexDynamicToolFunctions(params.tools).map(buildCodexToolReportEntry);
	const schemaChars = toolEntries.reduce((sum, tool) => sum + tool.schemaChars, 0);
	const skillsPrompt = params.skillsPrompt.trim();
	const bootstrapMaxChars = readPositiveNumber(params.attempt.config?.agents?.defaults?.bootstrapMaxChars);
	const bootstrapTotalMaxChars = readPositiveNumber(params.attempt.config?.agents?.defaults?.bootstrapTotalMaxChars);
	return {
		source: "run",
		generatedAt: Date.now(),
		sessionId: params.attempt.sessionId,
		sessionKey: params.sessionKey,
		provider: params.attempt.provider,
		model: params.attempt.modelId,
		workspaceDir: params.workspaceDir,
		...bootstrapMaxChars ? { bootstrapMaxChars } : {},
		...bootstrapTotalMaxChars ? { bootstrapTotalMaxChars } : {},
		systemPrompt: {
			chars: params.developerInstructions.length,
			projectContextChars: 0,
			nonProjectContextChars: params.developerInstructions.length,
			hash: sha256Text(params.developerInstructions)
		},
		injectedWorkspaceFiles: buildCodexBootstrapInjectionStats({
			bootstrapFiles: params.workspaceBootstrapContext.bootstrapFiles,
			injectedFiles: params.workspaceBootstrapContext.promptContextFiles ?? [],
			developerInstructionFiles: params.workspaceBootstrapContext.turnScopedDeveloperInstructionFiles ?? [],
			memoryToolRoutedBootstrapFiles: params.workspaceBootstrapContext.memoryToolRoutedBootstrapFiles ?? [],
			memoryToolRouted: params.workspaceBootstrapContext.memoryToolRouted === true
		}),
		skills: {
			promptChars: skillsPrompt.length,
			hash: sha256Text(skillsPrompt),
			entries: buildCodexSkillReportEntries(skillsPrompt)
		},
		tools: {
			listChars: 0,
			schemaChars,
			entries: toolEntries
		}
	};
}
function buildCodexSkillReportEntries(skillsPrompt) {
	if (!skillsPrompt) return [];
	return Array.from(skillsPrompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi)).map((match) => match[0] ?? "").map((block) => ({
		name: block.match(/<name>\s*([^<]+?)\s*<\/name>/i)?.[1]?.trim() || "(unknown)",
		blockChars: block.length
	})).filter((entry) => entry.blockChars > 0);
}
function buildCodexToolReportEntry(tool) {
	const summary = tool.description.trim();
	if (tool.deferLoading === true) return {
		name: tool.name,
		summaryChars: summary.length,
		summaryHash: sha256Text(summary),
		schemaChars: 0,
		schemaHash: stableJsonHash(null),
		propertiesCount: null
	};
	return {
		name: tool.name,
		summaryChars: summary.length,
		summaryHash: sha256Text(summary),
		...buildCodexToolSchemaStats(tool.inputSchema)
	};
}
function buildCodexToolSchemaStats(schema) {
	const schemaChars = (() => {
		try {
			return JSON.stringify(schema).length;
		} catch {
			return 0;
		}
	})();
	const properties = isJsonObject(schema) && isJsonObject(schema.properties) ? schema.properties : null;
	return {
		schemaChars,
		schemaHash: stableJsonHash(schema),
		propertiesCount: properties ? Object.keys(properties).length : null
	};
}
function sha256Text(value) {
	return createHash("sha256").update(value).digest("hex");
}
function normalizeForStableHash(value) {
	if (Array.isArray(value)) return value.map((entry) => normalizeForStableHash(entry));
	if (value && typeof value === "object") {
		const record = value;
		return Object.fromEntries(Object.keys(record).toSorted((left, right) => left.localeCompare(right)).map((key) => [key, normalizeForStableHash(record[key])]));
	}
	return value;
}
function stableJsonHash(value) {
	return sha256Text(JSON.stringify(normalizeForStableHash(value)) ?? "null");
}
function buildCodexBootstrapInjectionStats(params) {
	const injectedIndex = indexCodexContextFileContent(params.injectedFiles);
	const developerInstructionIndex = indexCodexContextFileContent(params.developerInstructionFiles ?? []);
	const memoryToolRoutedPaths = new Set((params.memoryToolRoutedBootstrapFiles ?? []).map((file) => readNonBlankString(file.path)).filter(isNonEmptyString$1).map(normalizeCodexContextFilePath));
	return params.bootstrapFiles.map((file) => {
		const fileName = readNonBlankString(file.name);
		const pathValue = readNonBlankString(file.path) ?? fileName ?? "";
		const displayName = (fileName ?? getCodexContextFileDisplayBasename(pathValue)) || pathValue;
		const baseName = getCodexContextFileBasename(pathValue || fileName || "");
		const rawChars = file.missing ? 0 : (file.content ?? "").trimEnd().length;
		const memoryToolRoutedFile = baseName === CODEX_MEMORY_CONTEXT_BASENAME && params.memoryToolRouted === true && memoryToolRoutedPaths.has(normalizeCodexContextFilePath(pathValue));
		const injected = memoryToolRoutedFile ? void 0 : readCodexIndexedContextFileContent(injectedIndex, pathValue, fileName) ?? readCodexIndexedContextFileContent(developerInstructionIndex, pathValue, fileName);
		let injectedChars = memoryToolRoutedFile ? 0 : injected?.length ?? 0;
		let truncated = memoryToolRoutedFile ? false : !file.missing && injectedChars < rawChars;
		if (injected === void 0 && CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName)) {
			injectedChars = rawChars;
			truncated = false;
		}
		return {
			name: displayName,
			path: pathValue,
			missing: file.missing,
			rawChars,
			injectedChars,
			truncated
		};
	});
}
function indexCodexContextFileContent(files) {
	const byPath = /* @__PURE__ */ new Map();
	const byBaseName = /* @__PURE__ */ new Map();
	for (const file of files) {
		const pathValue = readNonBlankString(file.path);
		if (!pathValue) continue;
		if (!byPath.has(pathValue)) byPath.set(pathValue, file.content);
		const baseName = getCodexContextFileBasename(pathValue);
		if (baseName && !byBaseName.has(baseName)) byBaseName.set(baseName, file.content);
	}
	return {
		byPath,
		byBaseName
	};
}
function readCodexIndexedContextFileContent(index, pathValue, fileName) {
	const pathContent = index.byPath.get(pathValue);
	if (pathContent !== void 0) return pathContent;
	if (fileName) {
		const nameContent = index.byPath.get(fileName);
		if (nameContent !== void 0) return nameContent;
	}
	const baseName = getCodexContextFileBasename(fileName ?? pathValue);
	return baseName ? index.byBaseName.get(baseName) : void 0;
}
function readPositiveNumber(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
/**
* Builds OpenClaw-provided workspace prompt context for the current Codex turn.
*/
function buildCodexOpenClawPromptContext(params) {
	if (!shouldInjectCodexOpenClawPromptContext(params.params)) return;
	const sections = [params.workspacePromptContext?.trim() ? [
		"## OpenClaw Workspace Context",
		"",
		params.workspacePromptContext.trim()
	].join("\n") : void 0, params.watchedSessionsContext?.trim() || void 0].filter(isNonEmptyString$1);
	if (sections.length === 0) return;
	return [
		"OpenClaw runtime context for this turn:",
		"Treat this OpenClaw-provided context as supporting project/user reference for the current request.",
		"",
		...sections
	].join("\n");
}
/**
* Renders the watched-sessions block for the Codex per-turn runtime context.
* Codex builds its own instruction layers, so the embedded prompt's Watched
* Sessions section must be re-surfaced here or Codex-backed main sessions
* keep refusing cross-session questions (openclaw#114797).
*/
function buildCodexWatchedSessionsContext(params) {
	if (!shouldInjectCodexOpenClawPromptContext(params.attempt)) return;
	return buildWatchedSessionsHarnessContext({
		config: params.attempt.config,
		sessionKey: params.sessionKey,
		sandboxed: params.sandboxed,
		toolNames: flattenCodexDynamicToolFunctions(params.dynamicTools).map((tool) => normalizeCodexDynamicToolName(tool.name))
	});
}
function shouldInjectCodexOpenClawPromptContext(params) {
	return !(params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron");
}
/** Renders loaded OpenClaw skill prompts as Codex collaboration instructions. */
function renderCodexSkillsCollaborationInstructions(params) {
	if (!shouldInjectCodexOpenClawPromptContext(params.attempt)) return;
	return params.skillsPrompt?.trim() ? [
		"## OpenClaw Skills",
		"",
		params.skillsPrompt.trim()
	].join("\n") : void 0;
}
/**
* Prepends OpenClaw context while preserving leading delivery metadata as
* routing guidance instead of user request text.
*/
function prependCodexOpenClawPromptContext(prompt, context, options = {}) {
	const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
	if (!context?.trim() && (!deliveryHint || options.preservePromptWithoutContext)) return prompt;
	const promptSection = promptWithoutDeliveryHint.startsWith("OpenClaw assembled context for this turn:") ? promptWithoutDeliveryHint : ["Current user request:", promptWithoutDeliveryHint].join("\n");
	const deliverySection = deliveryHint ? [
		"OpenClaw delivery metadata:",
		"This delivery metadata is runtime routing guidance, not the user's request.",
		deliveryHint
	].join("\n") : void 0;
	return [
		context?.trim(),
		deliverySection,
		promptSection
	].filter(Boolean).join("\n\n");
}
/**
* Maps the surviving user-request portion of an input range after delivery
* metadata has been relocated before the request.
*/
function resolveCodexDeliveryHintPreservedInputRange(params) {
	const { prompt, promptInputRange, decoratedPrompt } = params;
	const { deliveryHint, prompt: promptWithoutDeliveryHint } = splitLeadingCodexDeliveryHint(prompt);
	if (!deliveryHint || !promptInputRange || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || !decoratedPrompt.endsWith(promptWithoutDeliveryHint)) return;
	const promptWithoutDeliveryHintStart = prompt.length - promptWithoutDeliveryHint.length;
	const inputStart = Math.max(promptInputRange.start, promptWithoutDeliveryHintStart);
	const inputEnd = Math.max(inputStart, Math.min(promptInputRange.end, promptWithoutDeliveryHint.length + promptWithoutDeliveryHintStart));
	const decoratedPromptSuffixStart = decoratedPrompt.length - promptWithoutDeliveryHint.length;
	const requestHeader = "Current user request:\n";
	const requestHeaderStart = decoratedPromptSuffixStart - 22;
	return {
		start: inputStart === promptWithoutDeliveryHintStart && decoratedPrompt.slice(requestHeaderStart, decoratedPromptSuffixStart) === requestHeader ? requestHeaderStart : decoratedPromptSuffixStart + inputStart - promptWithoutDeliveryHintStart,
		end: decoratedPromptSuffixStart + inputEnd - promptWithoutDeliveryHintStart
	};
}
function splitLeadingCodexDeliveryHint(prompt) {
	const trimmedStart = prompt.trimStart();
	const matchedHint = MESSAGE_TOOL_DELIVERY_HINTS.find((hint) => trimmedStart.startsWith(hint));
	if (!matchedHint) return { prompt };
	return {
		deliveryHint: matchedHint,
		prompt: trimmedStart.slice(matchedHint.length).replace(/^\s*\n/, "").trimStart()
	};
}
function renderCodexWorkspaceBootstrapPromptContext(contextFiles) {
	const files = contextFiles;
	if (files.length === 0) return;
	const lines = [
		"OpenClaw loaded these user-editable workspace files for the current turn. Codex loads AGENTS.md natively. SOUL.md, IDENTITY.md, and USER.md are provided as turn-scoped collaboration instructions so native Codex subagents do not inherit them. Those files are not repeated here.",
		"",
		"# Project Context",
		"",
		"The following project context files have been loaded:"
	];
	lines.push("");
	for (const file of files) lines.push(`## ${file.path}`, "", file.content, "");
	return lines.join("\n").trim();
}
function selectCodexWorkspacePromptContextFiles(contextFiles, options = {}) {
	const excludeMemory = options.excludeMemory ?? true;
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && !CODEX_NATIVE_PROJECT_DOC_BASENAMES.has(baseName) && !CODEX_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES.has(baseName) && (!excludeMemory || !isCodexWorkspaceRootMemoryContextFile({
			file,
			workspaceDir: options.memoryWorkspaceDir
		})) && !isMissingCodexBootstrapContextFile(file);
	}).toSorted(compareCodexContextFiles);
}
function selectCodexWorkspaceTurnScopedDeveloperInstructionFiles(contextFiles) {
	return selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, CODEX_TURN_SCOPED_WORKSPACE_DEVELOPER_CONTEXT_BASENAMES);
}
function selectCodexWorkspaceDeveloperInstructionFiles(contextFiles, basenames) {
	return contextFiles.filter((file) => {
		const baseName = getCodexContextFileBasename(file.path);
		return baseName && basenames.has(baseName) && !isMissingCodexBootstrapContextFile(file) && file.content.trim().length > 0;
	}).toSorted(compareCodexContextFiles);
}
function renderCodexWorkspaceCollaborationDeveloperInstructions(files) {
	return renderCodexWorkspaceDeveloperInstructions({
		files,
		header: "## OpenClaw Agent Soul",
		preamble: "OpenClaw loaded these workspace instruction files from the active agent workspace. They are the canonical definitions of who you are, how you think and work, and the human you work alongside. Internalize and follow them accordingly.",
		wrapperTag: "AGENT_SOUL"
	});
}
function renderCodexWorkspaceDeveloperInstructions(params) {
	const { files, header, preamble, wrapperTag } = params;
	if (files.length === 0) return;
	const lines = [
		header,
		"",
		preamble,
		""
	];
	if (wrapperTag) lines.push(`<${wrapperTag}>`, "");
	for (const file of files) lines.push(`### ${file.path}`, "", file.content, "");
	if (wrapperTag) lines.push(`</${wrapperTag}>`);
	return lines.join("\n").trim();
}
function selectCodexWorkspaceMemoryReferenceFiles(params) {
	return params.bootstrapFiles.filter((file) => {
		return isCodexWorkspaceRootMemoryBootstrapFile({
			file,
			workspaceDir: params.workspaceDir
		}) && !file.missing && (file.content ?? "").trim().length > 0;
	}).toSorted(compareCodexBootstrapFiles);
}
/**
* Renders a memory-file reference that points Codex at memory tools instead of
* embedding MEMORY.md contents.
*/
function renderCodexWorkspaceMemoryReference(params) {
	if (params.files.length === 0) return;
	const lines = [
		"## OpenClaw Workspace Memory",
		"",
		`MEMORY.md exists in the active agent workspace as a memory file, not an instruction file. OpenClaw does not paste its contents into native Codex turns; use ${(params.toolNames?.length ? params.toolNames : Array.from(CODEX_MEMORY_TOOL_NAMES)).join(" or ")} when durable memory is relevant and the tools are available.`,
		""
	];
	for (const file of params.files) lines.push(`- ${file.path}`);
	return lines.join("\n").trim();
}
async function renderCodexWorkspaceMemoryCollaborationInstructions(params) {
	const sections = [params.memoryToolRouted ? await renderCodexMemoryRecallInstructions({
		toolNames: params.toolNames,
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	}) : void 0, renderCodexWorkspaceMemoryReference({
		files: params.files,
		toolNames: params.toolNames
	})].filter(isNonEmptyString$1);
	return sections.length > 0 ? sections.join("\n\n") : void 0;
}
async function renderCodexMemoryRecallInstructions(params) {
	const memoryPrompt = await prepareMemorySystemPromptAddition({
		availableTools: new Set(params.toolNames),
		citationsMode: params.citationsMode,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		sandboxed: params.sandboxed
	});
	if (!memoryPrompt) return;
	return [memoryPrompt, renderCodexMemoryToolSearchBridge(params.toolNames)].filter(isNonEmptyString$1).join("\n").trim();
}
function renderCodexMemoryToolSearchBridge(toolNames) {
	const memoryToolNames = toolNames.map((name) => normalizeCodexDynamicToolName(name)).filter((name) => CODEX_MEMORY_TOOL_NAMES.has(name)).toSorted();
	if (memoryToolNames.length === 0) return;
	return `Codex may expose ${memoryToolNames.join(" and ")} as deferred tools. When the memory guidance above calls for memory recall, use an already-loaded memory tool directly. If the needed memory tool is deferred and not currently callable, use \`tool_search\` to load it, then call that memory tool.`;
}
/** Lists available memory tool names understood by Codex workspace memory routing. */
function getCodexWorkspaceMemoryToolNames(tools) {
	const availableToolNames = new Set(flattenCodexDynamicToolFunctions(tools).map((tool) => normalizeCodexDynamicToolName(tool.name)));
	return Array.from(CODEX_MEMORY_TOOL_NAMES).filter((name) => availableToolNames.has(name));
}
function canRouteCodexWorkspaceMemoryThroughTools(params) {
	if (!params.config) return false;
	return isSameCodexWorkspacePath(resolveAgentWorkspaceDir(params.config, params.agentId), params.workspaceDir);
}
function isMissingCodexBootstrapContextFile(file) {
	return file.content.trimStart().startsWith("[MISSING] Expected at:");
}
function toCodexEmbeddedContextFile(file) {
	return {
		path: readNonBlankString(file.path) ?? readNonBlankString(file.name) ?? "",
		content: file.content ?? ""
	};
}
function isCodexWorkspaceRootMemoryBootstrapFile(params) {
	return isCodexWorkspaceRootMemoryPath({
		filePath: readNonBlankString(params.file.path) ?? readNonBlankString(params.file.name) ?? "",
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryContextFile(params) {
	if (!params.workspaceDir) return false;
	return isCodexWorkspaceRootMemoryPath({
		filePath: params.file.path,
		workspaceDir: params.workspaceDir
	});
}
function isCodexWorkspaceRootMemoryPath(params) {
	const filePath = params.filePath.trim();
	if (!filePath) return false;
	return (path.isAbsolute(filePath) ? path.resolve(filePath) : path.resolve(params.workspaceDir, filePath)) === path.join(path.resolve(params.workspaceDir), "MEMORY.md");
}
function isSameCodexWorkspacePath(left, right) {
	return path.resolve(left) === path.resolve(right);
}
/**
* Remaps bootstrap file paths from the resolved workspace to the effective Codex
* workspace while preserving platform path separators.
*/
function remapCodexContextFilePath(params) {
	const relativePath = path.relative(params.sourceWorkspaceDir, params.file.path);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath) || params.sourceWorkspaceDir === params.targetWorkspaceDir) return params.file;
	const targetUsesPosixSeparators = params.targetWorkspaceDir.includes("/") && !params.targetWorkspaceDir.includes("\\");
	const normalizedRelativePath = targetUsesPosixSeparators ? relativePath.replaceAll("\\", "/") : relativePath.replaceAll("/", "\\");
	return {
		...params.file,
		path: targetUsesPosixSeparators ? path.posix.join(params.targetWorkspaceDir, normalizedRelativePath) : path.win32.join(params.targetWorkspaceDir, normalizedRelativePath)
	};
}
function compareCodexContextFiles(left, right) {
	const leftPath = normalizeCodexContextFilePath(left.path);
	const rightPath = normalizeCodexContextFilePath(right.path);
	const leftBase = getCodexContextFileBasename(left.path);
	const rightBase = getCodexContextFileBasename(right.path);
	const leftOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(leftBase) ?? Number.MAX_SAFE_INTEGER;
	const rightOrder = CODEX_BOOTSTRAP_CONTEXT_ORDER.get(rightBase) ?? Number.MAX_SAFE_INTEGER;
	if (leftOrder !== rightOrder) return leftOrder - rightOrder;
	if (leftBase !== rightBase) return leftBase.localeCompare(rightBase);
	return leftPath.localeCompare(rightPath);
}
function compareCodexBootstrapFiles(left, right) {
	return compareCodexContextFiles(toCodexEmbeddedContextFile(left), toCodexEmbeddedContextFile(right));
}
function normalizeCodexContextFilePath(filePath) {
	return filePath.trim().replaceAll("\\", "/").toLowerCase();
}
function getCodexContextFileDisplayBasename(filePath) {
	return filePath.trim().replaceAll("\\", "/").split("/").pop()?.trim() ?? "";
}
function getCodexContextFileBasename(filePath) {
	return normalizeCodexContextFilePath(filePath).split("/").pop() ?? "";
}
function normalizeCodexDynamicToolName(name) {
	return name.trim().toLowerCase();
}
function isNonEmptyString$1(value) {
	return typeof value === "string" && value.length > 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-context.ts
async function prepareCodexAttemptContext(runtime, attemptTools) {
	const { connection, runtimeParams, activeSessionId, activeSessionFile, buildActiveRunAttemptParams, effectiveContextWindowInfo, effectiveContextTokenBudget, effectiveRuntimeProviderId, effectiveRuntimeModelId, hookChannelId } = runtime;
	const { params, sessionAgentId, contextSessionKey, activeContextEngine, initialStartupBindingHadInactiveThreadBootstrap, sandboxSessionKey, effectiveWorkspace, effectiveCwd, agentDir, usesSupervisionConnection, resolvedWorkspace, initialInactiveThreadBootstrapBindingForcedFreshStart, sandbox } = connection;
	const { toolBridge } = attemptTools;
	const activeTranscriptTarget = {
		agentId: sessionAgentId,
		sessionFile: activeSessionFile,
		sessionId: activeSessionId,
		sessionKey: contextSessionKey,
		sessionTarget: params.sessionTarget
	};
	const readFencedHistory = async () => {
		const transcriptReadFence = params.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return await readMirroredSessionHistoryMessages({
			...activeTranscriptTarget,
			...transcriptReadFence ? { admission: transcriptReadFence } : {}
		});
	};
	const historyState = { messages: !activeContextEngine && initialStartupBindingHadInactiveThreadBootstrap ? [] : await readFencedHistory() ?? [] };
	const hadSessionTranscriptState = historyState.messages.length > 0;
	const hookContextWindowFields = {
		...effectiveContextWindowInfo?.tokens ? { contextTokenBudget: effectiveContextWindowInfo.tokens } : effectiveContextTokenBudget ? { contextTokenBudget: effectiveContextTokenBudget } : {},
		...effectiveContextWindowInfo?.source ? { contextWindowSource: effectiveContextWindowInfo.source } : {},
		...effectiveContextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: effectiveContextWindowInfo.referenceTokens } : {}
	};
	const hookContext = {
		runId: params.runId,
		agentId: sessionAgentId,
		sessionKey: sandboxSessionKey,
		sessionId: params.sessionId,
		...params.agentHarnessId ? { agentHarnessId: params.agentHarnessId } : {},
		...params.agentHarnessEpoch ? { agentHarnessEpoch: params.agentHarnessEpoch } : {},
		workspaceDir: params.workspaceDir,
		messageProvider: params.messageProvider ?? void 0,
		trigger: params.trigger,
		channelId: hookChannelId,
		...hookContextWindowFields
	};
	const hookRunner = getAgentHarnessHookRunner();
	const buildActiveContextEngineRuntimeContext = () => buildHarnessContextEngineRuntimeContext({
		attempt: buildActiveRunAttemptParams(),
		workspaceDir: effectiveWorkspace,
		cwd: effectiveCwd,
		agentDir,
		activeAgentId: sessionAgentId,
		contextEnginePluginId: resolveContextEngineOwnerPluginId(activeContextEngine),
		tokenBudget: effectiveContextTokenBudget
	});
	if (activeContextEngine) {
		await bootstrapHarnessContextEngine({
			hadSessionFile: hadSessionTranscriptState,
			contextEngine: activeContextEngine,
			sessionId: activeSessionId,
			sessionKey: contextSessionKey,
			sessionFile: activeSessionFile,
			sessionTarget: params.sessionTarget,
			runtimeContext: buildActiveContextEngineRuntimeContext(),
			transcriptReadFence: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
			providerId: effectiveRuntimeProviderId,
			requestedModelId: usesSupervisionConnection ? void 0 : params.requestedModelId,
			modelId: effectiveRuntimeModelId,
			fallbackReason: usesSupervisionConnection ? void 0 : params.fallbackReason,
			degradedReason: usesSupervisionConnection ? void 0 : params.degradedReason,
			runMaintenance: runHarnessContextEngineMaintenance,
			config: params.config,
			warn: (message) => log.warn(message)
		});
		historyState.messages = await readFencedHistory() ?? historyState.messages;
	}
	const workspaceBootstrapContext = await buildCodexWorkspaceBootstrapContext({
		params: runtimeParams,
		resolvedWorkspace,
		effectiveWorkspace,
		sessionKey: contextSessionKey,
		sessionAgentId,
		memoryToolNames: getCodexWorkspaceMemoryToolNames(toolBridge.availableSpecs),
		sandboxed: sandbox?.enabled === true
	});
	const baseDeveloperInstructions = buildDeveloperInstructions(runtimeParams, { dynamicTools: toolBridge.availableSpecs });
	return {
		runtime,
		attemptTools,
		activeTranscriptTarget,
		historyState,
		hookContext,
		hookContextWindowFields,
		hookRunner,
		buildActiveContextEngineRuntimeContext,
		workspaceBootstrapContext,
		baseDeveloperInstructions,
		openClawPromptContext: buildCodexOpenClawPromptContext({
			params: runtimeParams,
			workspacePromptContext: workspaceBootstrapContext.promptContext,
			watchedSessionsContext: buildCodexWatchedSessionsContext({
				attempt: runtimeParams,
				dynamicTools: toolBridge.availableSpecs,
				sessionKey: contextSessionKey,
				sandboxed: sandbox?.enabled === true
			})
		}),
		skillsCollaborationInstructions: renderCodexSkillsCollaborationInstructions({
			attempt: runtimeParams,
			skillsPrompt: params.skillsSnapshot?.prompt
		}),
		promptState: {
			promptText: params.prompt,
			promptContextRange: void 0,
			developerInstructions: baseDeveloperInstructions,
			prePromptMessageCount: historyState.messages.length,
			contextEngineProjection: void 0,
			precomputedStaleBindingContinuityProjectionApplied: false,
			staleBindingContinuityForcedFreshStart: false,
			inactiveThreadBootstrapBindingForcedFreshStart: initialInactiveThreadBootstrapBindingForcedFreshStart
		},
		codexContextProjectionMaxChars: resolveCodexContextEngineProjectionMaxChars({
			contextTokenBudget: effectiveContextTokenBudget,
			reserveTokens: resolveCodexContextEngineProjectionReserveTokens()
		})
	};
}
//#endregion
//#region extensions/codex/src/app-server/attempt-diagnostics.ts
/**
* Diagnostic helpers for Codex app-server model calls and plugin-thread config
* eligibility.
*/
/** Reads a tool schema field in either app-server or OpenClaw naming. */
function readCodexDiagnosticToolParameters(tool) {
	return tool.inputSchema ?? tool.parameters;
}
/** Builds compact diagnostic tool definitions for trusted private telemetry. */
function buildCodexDiagnosticToolDefinitions(tools) {
	return tools.map((tool) => ({
		name: tool.name,
		description: tool.description,
		parameters: readCodexDiagnosticToolParameters(tool)
	}));
}
/** Returns the serialized UTF-8 byte length for a JSON-compatible value. */
function utf8JsonByteLength(value) {
	try {
		return Buffer.byteLength(JSON.stringify(value), "utf8");
	} catch {
		return;
	}
}
/** Builds a short namespaced fingerprint for sensitive log values. */
function fingerprintCodexLogValue(namespace, value) {
	const hash = createHash("sha256");
	hash.update(namespace);
	hash.update("\0");
	hash.update(value);
	return `sha256:${hash.digest("hex").slice(0, 16)}`;
}
/**
* Builds redacted diagnostics explaining whether plugin thread config was
* eligible for a Codex app-server attempt.
*/
function buildCodexPluginThreadConfigEligibilityLogData(params) {
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		enabled: params.pluginThreadConfigRequired,
		policyConfigured: params.resolvedPluginPolicy?.configured === true,
		policyEnabled: params.resolvedPluginPolicy?.enabled === true,
		allowAllPlugins: params.resolvedPluginPolicy?.allowAllPlugins === true,
		pluginConfigKeys: params.resolvedPluginPolicy?.pluginPolicies.map((plugin) => plugin.configKey).toSorted(),
		enabledPluginConfigKeys: params.enabledPluginConfigKeys,
		appCacheKeyFingerprint: fingerprintCodexLogValue("openclaw:codex:plugin-app-cache-key:v1", params.pluginAppCacheKey),
		authProfileId: params.startupAuthProfileId,
		appServerTransport: params.appServer.start.transport,
		appServerCommandSource: params.appServer.start.commandSource
	};
}
/**
* Creates lifecycle emitters for trusted model-call diagnostics with optional
* private payload capture.
*/
function createCodexModelCallDiagnosticEmitter(params) {
	const now = params.now ?? (() => Date.now());
	const toolDefinitions = params.capture.toolDefinitions ? buildCodexDiagnosticToolDefinitions(params.tools) : void 0;
	let startedAt = now();
	let started = false;
	let terminalEmitted = false;
	let requestPayloadBytes;
	const privateData = (modelContent) => modelContent && Object.keys(modelContent).length > 0 ? { modelContent } : void 0;
	const buildContent = () => {
		const modelContent = {
			...params.capture.inputMessages ? { inputMessages: params.buildInputMessages() } : {},
			...params.capture.systemPrompt ? { systemPrompt: params.buildSystemPrompt() } : {},
			...toolDefinitions ? { toolDefinitions } : {}
		};
		return Object.keys(modelContent).length > 0 ? modelContent : void 0;
	};
	const requestPayloadBytesField = () => requestPayloadBytes !== void 0 ? { requestPayloadBytes } : {};
	return {
		setRequestPayloadBytes(bytes) {
			requestPayloadBytes = bytes;
		},
		emitStarted() {
			startedAt = now();
			started = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.started",
				...params.baseFields
			}, privateData(buildContent()));
		},
		emitCompleted(result) {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.completed",
				...params.baseFields,
				durationMs: Math.max(0, now() - startedAt),
				...requestPayloadBytesField()
			}, privateData({
				...buildContent(),
				...params.capture.outputMessages ? { outputMessages: result.lastAssistant ? [result.lastAssistant] : result.assistantTexts } : {}
			}));
		},
		emitError(error, fields = {}) {
			if (!started || terminalEmitted) return;
			terminalEmitted = true;
			emitTrustedDiagnosticEventWithPrivateData({
				type: "model.call.error",
				...params.baseFields,
				durationMs: Math.max(0, now() - startedAt),
				errorCategory: fields.failureKind ?? "error",
				...fields.failureKind ? { failureKind: fields.failureKind } : {},
				...requestPayloadBytesField()
			}, privateData({
				...buildContent(),
				...params.capture.outputMessages ? { outputMessages: [] } : {}
			}));
			params.onErrorDiagnostic?.(error);
		}
	};
}
/** Classifies model-call failures into timeout/abort buckets for diagnostics. */
function classifyCodexModelCallFailureKind(params) {
	if (params.timedOut || params.turnCompletionIdleTimedOut) return "timeout";
	const errorMessage = params.error ? params.formatError(params.error).toLowerCase() : "";
	if (errorMessage.includes("timed out") || errorMessage.includes("timeout")) return "timeout";
	if (params.runAborted && !params.clientClosedAbort) return (typeof params.abortReason === "string" ? params.abortReason.toLowerCase() : params.abortReason ? params.formatError(params.abortReason).toLowerCase() : "").includes("timeout") ? "timeout" : "aborted";
	return errorMessage.includes("aborted") ? "aborted" : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-results.ts
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE = "Codex stopped before confirming the turn was complete. The response may be incomplete; retry if needed.";
const CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE = "Codex stopped before confirming the turn was complete. Some work may already have been performed; verify the current state before retrying.";
const CODEX_APP_SERVER_TERMINAL_IDLE_USER_MESSAGE = "Codex stopped responding: no activity arrived for the turn's liveness window, so the turn was ended and the connection was replaced. Retry to continue on a fresh session.";
/** Joins terminal assistant text blocks into the final attempt answer. */
function collectTerminalAssistantText(result) {
	return result.assistantTexts.join("\n\n").trim();
}
/**
* Builds the user-facing timeout outcome when Codex stops without a terminal
* turn event.
*/
function buildCodexAppServerPromptTimeoutOutcome(params) {
	if (!params.turnCompletionIdleTimedOut) return;
	if (params.turnWatchTimeoutKind === "terminal") {
		if (collectTerminalAssistantText(params.result)) return;
		const terminalReplayBlockedReason = resolveCodexAppServerReplayBlockedReason(params.result);
		return {
			message: CODEX_APP_SERVER_TERMINAL_IDLE_USER_MESSAGE,
			...terminalReplayBlockedReason ? {
				replayInvalid: true,
				livenessState: "abandoned"
			} : {}
		};
	}
	if (params.turnWatchTimeoutKind !== void 0 && params.turnWatchTimeoutKind !== "completion") return;
	const replayBlockedReason = resolveCodexAppServerReplayBlockedReason(params.result);
	return {
		message: replayBlockedReason === "tool_activity" || replayBlockedReason === "potential_side_effect" || replayBlockedReason === "active_item" ? CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_SIDE_EFFECT_USER_MESSAGE : CODEX_APP_SERVER_MISSING_TERMINAL_EVENT_USER_MESSAGE,
		...replayBlockedReason ? {
			replayInvalid: true,
			livenessState: "abandoned"
		} : {}
	};
}
/** Explains why an incomplete app-server turn cannot be safely replayed. */
function resolveCodexAppServerReplayBlockedReason(result) {
	if (result.replayMetadata.hadPotentialSideEffects) return "potential_side_effect";
	if (result.assistantTexts.some((text) => text.trim().length > 0)) return "assistant_output";
	if (result.toolMetas.length > 0 || result.clientToolCalls || result.lastToolError || result.didSendDeterministicApprovalPrompt) return "tool_activity";
	if (result.itemLifecycle.startedCount > 0 || result.itemLifecycle.activeCount > 0) return "active_item";
}
/** Builds an attempt result for failures before the app-server turn starts. */
function buildCodexTurnStartFailureResult(params) {
	return {
		terminal: attemptTerminal.normalize({
			promptError: params.promptError ?? params.message,
			promptErrorSource: "prompt"
		}),
		sessionIdUsed: params.params.sessionId,
		messagesSnapshot: params.messagesSnapshot,
		assistantTexts: [],
		toolMetas: [],
		lastAssistant: void 0,
		currentAttemptAssistant: void 0,
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		cloudCodeAssistFormatError: false,
		replayMetadata: {
			hadPotentialSideEffects: false,
			replaySafe: true
		},
		itemLifecycle: {
			startedCount: 0,
			completedCount: 0,
			activeCount: 0
		},
		systemPromptReport: params.systemPromptReport
	};
}
/** Detects app-server errors caused by invalid image payload data. */
function isInvalidCodexImagePayloadError(message) {
	if (typeof message !== "string" || !message.trim()) return false;
	const normalizedMessage = message.replace(/[_-]+/gu, " ");
	return /\b(?:invalid|malformed)\b[\s\S]{0,120}\b(?:image|image url|base64)\b/iu.test(normalizedMessage) || /\b(?:image|image url|base64)\b[\s\S]{0,120}\b(?:invalid|malformed)\b/iu.test(normalizedMessage);
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-state.ts
async function clearCodexBindingAfterInvalidImagePayload(bindingStore, identity, fields) {
	const currentBinding = await bindingStore.read(identity);
	const expectedThreadId = fields.threadId ?? currentBinding?.threadId;
	if (!expectedThreadId) return;
	if (currentBinding && currentBinding.threadId !== expectedThreadId) {
		log.warn("codex app-server image payload error detected for unbound thread; preserving thread binding", {
			...fields,
			boundThreadId: currentBinding.threadId
		});
		return;
	}
	if (currentBinding?.connectionScope === "supervision") {
		log.warn("codex app-server image payload error detected for supervised thread; preserving native binding", fields);
		return;
	}
	log.warn("codex app-server image payload error detected; clearing thread binding", fields);
	await bindingStore.mutate(identity, {
		kind: "clear",
		threadId: expectedThreadId
	});
}
async function markCodexAppServerBindingCoveredThroughTurn(params) {
	await params.bindingStore.mutate(params.identity, {
		kind: "patch",
		threadId: params.threadId,
		patch: { historyCoveredThrough: (/* @__PURE__ */ new Date()).toISOString() }
	});
}
function isNonEmptyString(value) {
	return typeof value === "string" && value.length > 0;
}
function shouldUseFreshCodexThreadAfterContextEngineOverflow(params) {
	if (!params.contextEngineActive || params.thread.lifecycle.action !== "resumed") return false;
	const message = formatErrorMessage(params.error);
	return /ran out of room in the model'?s context window/iu.test(message) || /context window/iu.test(message) || /context length/iu.test(message) || /maximum context/iu.test(message) || /too many tokens/iu.test(message);
}
function isCodexActiveCompactTurnError(error) {
	if (!(error instanceof CodexAppServerRpcError)) return false;
	const data = isJsonObject(error.data) ? error.data : void 0;
	const codexErrorInfo = isJsonObject(data?.codexErrorInfo) ? data.codexErrorInfo : void 0;
	return (isJsonObject(codexErrorInfo?.activeTurnNotSteerable) ? codexErrorInfo.activeTurnNotSteerable : void 0)?.turnKind === "compact";
}
function readCodexFinalizationHookNotification(notification, threadId, turnId) {
	if (notification.method !== "hook/started" && notification.method !== "hook/completed") return;
	const params = isJsonObject(notification.params) ? notification.params : void 0;
	const run = params && isJsonObject(params.run) ? params.run : void 0;
	if (params?.threadId !== threadId || params.turnId !== turnId || run?.eventName !== "stop" && run?.eventName !== "subagentStop" || typeof run.id !== "string" || !run.id) return;
	if (notification.method === "hook/started") return {
		phase: "started",
		runId: run.id
	};
	return {
		phase: "completed",
		runId: run.id,
		status: typeof run.status === "string" ? run.status : void 0
	};
}
function joinPresentSections(...sections) {
	return sections.filter((section) => Boolean(section?.trim())).join("\n\n");
}
function prependCurrentInboundContext(prompt, context) {
	const text = context?.text.trim();
	return text ? [neutralizeCodexExplicitMentionSigils(text), prompt].filter(Boolean).join("\n\n") : prompt;
}
function waitForCodexNotificationDispatchTurn() {
	return new Promise((resolve) => {
		setImmediate(resolve);
	});
}
function buildCodexAppServerTimeoutDiagnostics(params) {
	const readNonBlankDetailString = (key) => {
		const value = params.details?.[key];
		return hasNonEmptyString(value) ? value : void 0;
	};
	const activeAppServerTurnRequests = asFiniteNumber(params.details?.activeAppServerTurnRequests);
	const activeTurnItemCount = asFiniteNumber(params.details?.activeTurnItemCount);
	const terminalTurnNotificationQueued = asBoolean(params.details?.terminalTurnNotificationQueued);
	const completionIdleWatchArmed = asBoolean(params.details?.completionIdleWatchArmed);
	const assistantCompletionIdleWatchArmed = asBoolean(params.details?.assistantCompletionIdleWatchArmed);
	const terminalIdleWatchArmed = asBoolean(params.details?.terminalIdleWatchArmed);
	return {
		...params.idleMs !== void 0 ? { idleMs: params.idleMs } : {},
		...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
		...params.lastActivityReason ? { lastActivityReason: params.lastActivityReason } : {},
		...readNonBlankDetailString("lastNotificationMethod") ? { lastNotificationMethod: readNonBlankDetailString("lastNotificationMethod") } : {},
		...readNonBlankDetailString("lastNotificationItemId") ? { lastNotificationItemId: readNonBlankDetailString("lastNotificationItemId") } : {},
		...readNonBlankDetailString("lastNotificationItemType") ? { lastNotificationItemType: readNonBlankDetailString("lastNotificationItemType") } : {},
		...readNonBlankDetailString("lastNotificationItemRole") ? { lastNotificationItemRole: readNonBlankDetailString("lastNotificationItemRole") } : {},
		...readNonBlankDetailString("lastAssistantTextPreview") ? { lastAssistantTextPreview: readNonBlankDetailString("lastAssistantTextPreview") } : {},
		...activeAppServerTurnRequests !== void 0 ? { activeAppServerTurnRequests } : {},
		...activeTurnItemCount !== void 0 ? { activeTurnItemCount } : {},
		...terminalTurnNotificationQueued !== void 0 ? { terminalTurnNotificationQueued } : {},
		...completionIdleWatchArmed !== void 0 ? { completionIdleWatchArmed } : {},
		...assistantCompletionIdleWatchArmed !== void 0 ? { assistantCompletionIdleWatchArmed } : {},
		...terminalIdleWatchArmed !== void 0 ? { terminalIdleWatchArmed } : {}
	};
}
//#endregion
//#region extensions/codex/src/app-server/settled-turn-context.ts
function collectUniqueMessageIdentities(messages) {
	const identities = /* @__PURE__ */ new Map();
	for (const [index, message] of messages.entries()) {
		const identity = readMirrorIdentity(message);
		if (!identity) continue;
		if (identities.has(identity)) return;
		identities.set(identity, index);
	}
	return identities;
}
function adoptPersistedHostPrompt(params) {
	const promptIdentity = `${params.turnId}:prompt`;
	if (params.mirroredMessages.some((message) => readMirrorIdentity(message) === promptIdentity)) return params;
	const sourcePrompt = params.settledMessages[0];
	const sourceKey = sourcePrompt?.idempotencyKey;
	if (sourcePrompt?.role !== "user" || readMirrorIdentity(sourcePrompt) !== promptIdentity || typeof sourceKey !== "string" || sourceKey.trim().length === 0) return params;
	const matches = params.historyMessages.flatMap((message, index) => message.role === "user" && message.idempotencyKey === sourceKey ? [{
		index,
		message
	}] : []);
	const persistedPrompt = matches.length === 1 ? matches[0] : void 0;
	const persistedMetadata = persistedPrompt?.message;
	if (!persistedPrompt || readMirrorIdentity(persistedPrompt.message) !== void 0 || readCodexMirrorSourceFingerprint(persistedPrompt.message) !== void 0 || persistedMetadata?.["__openclaw"]?.mirrorOrigin === "codex-app-server") return params;
	const sourceUpstreamText = readUpstreamUserText(sourcePrompt);
	const persistedUpstreamText = readUpstreamUserText(persistedPrompt.message);
	if (persistedUpstreamText !== void 0 && persistedUpstreamText !== sourceUpstreamText) return params;
	let logicalPrompt = attachCodexMirrorIdentity(persistedPrompt.message, promptIdentity);
	if (sourceUpstreamText !== void 0) logicalPrompt = attachUpstreamUserText(logicalPrompt, sourceUpstreamText);
	if (serializeCodexMirrorSourceEvidence(logicalPrompt) !== serializeCodexMirrorSourceEvidence(sourcePrompt)) return params;
	const historyMessages = [...params.historyMessages];
	historyMessages[persistedPrompt.index] = logicalPrompt;
	return {
		historyMessages,
		mirroredMessages: [logicalPrompt, ...params.mirroredMessages]
	};
}
/** Freezes one complete active transcript branch through the settled tool-result boundary. */
function buildCodexSettledTurnFinalizationContext(params) {
	const { historyMessages, mirroredMessages } = adoptPersistedHostPrompt(params);
	const boundaryMessage = params.settledMessages.findLast((message) => message.role === "toolResult");
	const boundaryIdentity = boundaryMessage ? readMirrorIdentity(boundaryMessage) : void 0;
	if (!boundaryMessage || !boundaryIdentity || !boundaryIdentity.startsWith(`${params.turnId}:tool:`)) return;
	const settledBoundaryIndex = params.settledMessages.indexOf(boundaryMessage);
	const requiredIdentities = params.settledMessages.slice(0, settledBoundaryIndex + 1).map(readMirrorIdentity);
	if (requiredIdentities.length === 0 || requiredIdentities.some((identity) => !identity) || new Set(requiredIdentities).size !== requiredIdentities.length || !requiredIdentities.includes(`${params.turnId}:prompt`)) return;
	const historyIdentities = collectUniqueMessageIdentities(historyMessages);
	const mirroredIdentities = collectUniqueMessageIdentities(mirroredMessages);
	if (!historyIdentities || !mirroredIdentities) return;
	const mirroredBoundaryIndex = mirroredIdentities.get(boundaryIdentity);
	if (mirroredBoundaryIndex === void 0) return;
	const mirroredThroughBoundary = mirroredMessages.slice(0, mirroredBoundaryIndex + 1);
	if (mirroredThroughBoundary.length !== requiredIdentities.length || mirroredThroughBoundary.some((message, index) => readMirrorIdentity(message) !== requiredIdentities[index])) return;
	const historyBoundaryIndex = historyIdentities.get(boundaryIdentity);
	if (historyBoundaryIndex === void 0) return;
	let previousHistoryIndex = -1;
	for (const mirroredMessage of mirroredThroughBoundary) {
		const identity = readMirrorIdentity(mirroredMessage);
		const historyIndex = identity ? historyIdentities.get(identity) : void 0;
		const historyMessage = historyIndex === void 0 ? void 0 : historyMessages[historyIndex];
		if (historyIndex === void 0 || historyIndex <= previousHistoryIndex || historyIndex > historyBoundaryIndex || !historyMessage || serializeCodexMirrorSourceEvidence(historyMessage) !== serializeCodexMirrorSourceEvidence(mirroredMessage)) return;
		previousHistoryIndex = historyIndex;
	}
	return {
		source: "openclaw-transcript",
		messages: Object.freeze(structuredClone(params.historyMessages.slice(0, historyBoundaryIndex + 1)))
	};
}
/** Reads and freezes the current active transcript branch after mirroring has settled. */
async function captureCodexSettledTurnFinalizationContext(params) {
	try {
		const historyMessages = await readCodexMirroredSessionHistoryMessages(params);
		if (!historyMessages) return;
		return buildCodexSettledTurnFinalizationContext({
			historyMessages,
			mirroredMessages: params.mirroredMessages,
			settledMessages: params.settledMessages,
			turnId: params.turnId
		});
	} catch (error) {
		log.warn("codex settled-turn finalization context capture failed", {
			error: formatErrorMessage(error),
			turnId: params.turnId
		});
		return;
	}
}
//#endregion
//#region extensions/codex/src/app-server/trajectory.ts
const SENSITIVE_FIELD_RE = /(?:authorization|cookie|credential|key|password|passwd|secret|token)/iu;
const PRIVATE_PAYLOAD_FIELD_RE = /(?:image|screenshot|attachment|fileData|dataUri)/iu;
const AUTHORIZATION_VALUE_RE = /\b(Bearer|Basic)\s+[A-Za-z0-9+/._~=-]{8,}/giu;
const JWT_VALUE_RE = /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/gu;
const COOKIE_PAIR_RE = /\b([A-Za-z][A-Za-z0-9_.-]{1,64})=([A-Za-z0-9+/._~%=-]{16,})(?=;|\s|$)/gu;
const TRAJECTORY_RUNTIME_EVENT_MAX_BYTES = 256 * 1024;
const TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS = ["usage", "promptCache"];
function boundedTrajectoryEvent(event) {
	const line = JSON.stringify(event);
	const bytes = Buffer.byteLength(line, "utf8");
	if (bytes <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES) return event;
	const originalData = event.data && typeof event.data === "object" && !Array.isArray(event.data) ? event.data : {};
	const originalDataKeys = Object.keys(originalData);
	const preservedDataKeys = /* @__PURE__ */ new Set();
	const baseData = {
		truncated: true,
		originalBytes: bytes,
		limitBytes: TRAJECTORY_RUNTIME_EVENT_MAX_BYTES,
		reason: "trajectory-event-size-limit"
	};
	const buildTruncatedEvent = (includeDroppedFields) => {
		const data = { ...baseData };
		for (const key of TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS) if (preservedDataKeys.has(key)) data[key] = originalData[key];
		if (includeDroppedFields) {
			const droppedFields = originalDataKeys.filter((key) => !preservedDataKeys.has(key));
			if (droppedFields.length > 0) data.droppedFields = droppedFields;
		}
		const truncatedEvent = {
			...event,
			data
		};
		const truncated = JSON.stringify(truncatedEvent);
		if (Buffer.byteLength(truncated, "utf8") <= TRAJECTORY_RUNTIME_EVENT_MAX_BYTES) return truncatedEvent;
	};
	let best = buildTruncatedEvent(true) ?? buildTruncatedEvent(false);
	if (!best) return;
	for (const key of TRAJECTORY_RUNTIME_OVERSIZE_PRESERVED_DATA_KEYS) {
		if (!Object.hasOwn(originalData, key)) continue;
		preservedDataKeys.add(key);
		const next = buildTruncatedEvent(true) ?? buildTruncatedEvent(false);
		if (next) {
			best = next;
			continue;
		}
		preservedDataKeys.delete(key);
	}
	return best;
}
function createCodexHostTrajectorySink(params) {
	return {
		write: (event) => {
			params.recorder.recordEvent(event.type, event.data);
		},
		flush: async () => {
			await params.recorder.flush();
		}
	};
}
/** Creates a trajectory recorder when trajectory capture is enabled for the environment. */
function createCodexTrajectoryRecorder(params) {
	if (!parseTrajectoryEnabled(params.env ?? process.env)) return null;
	if (!params.trajectoryRecorder) {
		params.warn?.("codex trajectory capture requires the SQLite host recorder", {
			sessionId: params.attempt.sessionId,
			reason: "sqlite-recorder-unavailable"
		});
		return null;
	}
	const sink = createCodexHostTrajectorySink({ recorder: params.trajectoryRecorder });
	let seq = 0;
	const attribution = resolveCodexLocalRuntimeAttribution(params.attempt);
	return {
		recordEvent: (type, data) => {
			const event = boundedTrajectoryEvent({
				traceSchema: "openclaw-trajectory",
				schemaVersion: 1,
				traceId: params.attempt.sessionId,
				source: "runtime",
				type,
				ts: (/* @__PURE__ */ new Date()).toISOString(),
				seq: seq += 1,
				sourceSeq: seq,
				sessionId: params.attempt.sessionId,
				sessionKey: params.attempt.sessionKey,
				runId: params.attempt.runId,
				workspaceDir: params.cwd,
				provider: attribution.provider,
				modelId: params.attempt.modelId,
				modelApi: attribution.api,
				data: data ? sanitizeValue(data) : void 0
			});
			if (event) sink.write(event);
		},
		flush: sink.flush
	};
}
/** Records compiled prompt/tool context at the start of a Codex runtime attempt. */
function recordCodexTrajectoryContext(recorder, params) {
	if (!recorder) return;
	recorder.recordEvent("context.compiled", {
		systemPrompt: params.developerInstructions,
		prompt: params.prompt ?? params.attempt.prompt,
		imagesCount: params.attempt.images?.length ?? 0,
		tools: toTrajectoryToolDefinitions(params.tools)
	});
}
/** Records final Codex model completion metadata and assistant snapshots. */
function recordCodexTrajectoryCompletion(recorder, params) {
	if (!recorder) return;
	const terminal = attemptTerminal.project(params.result.terminal);
	recorder.recordEvent("model.completed", {
		threadId: params.threadId,
		turnId: params.turnId,
		timedOut: params.timedOut,
		yieldDetected: params.yieldDetected ?? false,
		aborted: terminal.aborted,
		promptError: normalizeCodexTrajectoryError(terminal.promptError),
		usage: params.result.attemptUsage,
		assistantTexts: params.result.assistantTexts,
		messagesSnapshot: params.result.messagesSnapshot
	});
}
function parseTrajectoryEnabled(env) {
	const value = env.OPENCLAW_TRAJECTORY?.trim().toLowerCase();
	if (value === "1" || value === "true" || value === "yes" || value === "on") return true;
	if (value === "0" || value === "false" || value === "no" || value === "off") return false;
	return true;
}
function toTrajectoryToolDefinitions(tools) {
	if (!tools || tools.length === 0) return;
	return flattenCodexDynamicToolFunctions(tools).flatMap((tool) => {
		const name = tool.name?.trim();
		if (!name) return [];
		return [{
			name,
			description: tool.description,
			parameters: sanitizeValue(tool.inputSchema)
		}];
	}).toSorted((left, right) => left.name.localeCompare(right.name));
}
function sanitizeValue(value, depth = 0, key = "") {
	if (value == null || typeof value === "boolean" || typeof value === "number") return value;
	if (typeof value === "string") {
		if (SENSITIVE_FIELD_RE.test(key)) return "<redacted>";
		if (value.startsWith("data:") && value.length > 256) return `<redacted data-uri ${value.slice(0, value.indexOf(",")).length} chars>`;
		if (PRIVATE_PAYLOAD_FIELD_RE.test(key) && value.length > 256) return "<redacted payload>";
		const redacted = redactSensitiveString(value);
		return redacted.length > 2e4 ? `${truncateUtf16Safe(redacted, 2e4)}…` : redacted;
	}
	if (depth >= 6) return "<truncated>";
	if (Array.isArray(value)) return value.slice(0, 100).map((entry) => sanitizeValue(entry, depth + 1, key));
	if (typeof value === "object") {
		const next = {};
		for (const [keyLocal, child] of Object.entries(value).slice(0, 100)) next[keyLocal] = sanitizeValue(child, depth + 1, keyLocal);
		return next;
	}
	return JSON.stringify(value);
}
function redactSensitiveString(value) {
	return value.replace(AUTHORIZATION_VALUE_RE, "$1 <redacted>").replace(JWT_VALUE_RE, "<redacted-jwt>").replace(COOKIE_PAIR_RE, "$1=<redacted>");
}
/** Converts arbitrary prompt errors into trajectory-safe text. */
function normalizeCodexTrajectoryError(value) {
	if (!value) return null;
	if (value instanceof Error) return value.message;
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value);
	} catch {
		return "Unknown error";
	}
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-finalize.ts
async function finalizeCodexAttempt(resources, turnRuntime, lifecycle, notifications, requestRuntime, activeTurn) {
	const { prompt, state: resourceState, trajectoryRecorder, markTrajectoryEndRecorded } = resources;
	const { context, systemPromptReport } = prompt;
	const { runtime, attemptTools, activeTranscriptTarget, hookContext } = context;
	const { hookContextWindowFields, hookRunner } = context;
	const { connection, preparedAuthBinding } = runtime;
	const { effectiveRuntimeProviderId, effectiveRuntimeModelId } = runtime;
	const { params, terminalState, runAbortController, activeContextEngine, bindingStore, bindingIdentity, appServer, usesSupervisionConnection, sessionAgentId, contextSessionKey, effectiveCwd, attemptStartedAt, startupAuthProfileId } = connection;
	const { toolBridge, toolState } = attemptTools;
	const { state, completion, pendingOpenClawDynamicToolCompletionIds, activeTurnItemIds, activeCompletionBlockerItemIds, activeFinalizationHookRunIds, turnWatches } = turnRuntime;
	const { emitLifecycleTerminal, buildLifecycleTerminalMeta } = lifecycle;
	const { drainNotificationQueue } = notifications;
	const { codexModelCallDiagnostics } = requestRuntime;
	const { activeTurnId, activeProjector, streamState, freezeRunTerminalOutcome, notifyUserMessagePersisted } = activeTurn;
	await completion;
	await drainNotificationQueue();
	const hasQuiescentCompletedAssistant = activeProjector.hasCompletedTerminalAssistantText() && state.activeAppServerTurnRequests === 0 && activeTurnItemIds.size === 0 && activeCompletionBlockerItemIds.size === 0 && pendingOpenClawDynamicToolCompletionIds.size === 0 && activeFinalizationHookRunIds.size === 0 && state.unsettledFinalizationHookCount === 0 && state.rejectedFinalizationHookAssistant === void 0;
	const hasRecoverableCompletedAssistant = !turnWatches.isCompletionIdleWatchPinnedByTerminalError() && turnWatches.isAssistantCompletionIdleWatchArmed() && hasQuiescentCompletedAssistant;
	const recoveredTurnWatchTimeout = state.turnCompletionIdleTimedOut && !terminalState.explicitCancellationObserved && hasRecoverableCompletedAssistant && activeProjector.recoverCompletedTerminalAssistantAfterTurnWatchTimeout();
	if (recoveredTurnWatchTimeout) {
		log.warn("codex app-server recovered completed assistant output after missing turn completion", {
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			timeoutKind: state.turnWatchTimeoutKind,
			idleMs: state.turnWatchTimeoutIdleMs,
			timeoutMs: state.turnWatchTimeoutMs
		});
		trajectoryRecorder?.recordEvent("turn.watch_timeout_recovered", {
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			timeoutKind: state.turnWatchTimeoutKind,
			idleMs: state.turnWatchTimeoutIdleMs,
			timeoutMs: state.turnWatchTimeoutMs
		});
	}
	const result = activeProjector.buildResult(toolBridge.telemetry, { yieldDetected: toolState.yieldDetected });
	const projectedTerminal = attemptTerminal.project(result.terminal);
	const effectiveTimedOut = state.timedOut && !recoveredTurnWatchTimeout;
	const effectiveTurnCompletionIdleTimedOut = state.turnCompletionIdleTimedOut && !recoveredTurnWatchTimeout;
	const isFinalAborted = () => projectedTerminal.aborted || terminalState.explicitCancellationObserved || runAbortController.signal.aborted && !state.clientClosedAbort && !recoveredTurnWatchTimeout;
	const clientClosedPromptErrorForFinal = state.clientClosedPromptError && hasRecoverableCompletedAssistant ? void 0 : state.clientClosedPromptError;
	let finalPromptError = clientClosedPromptErrorForFinal ?? (effectiveTurnCompletionIdleTimedOut ? state.turnCompletionIdleTimeoutMessage : effectiveTimedOut ? "codex app-server attempt timed out" : projectedTerminal.promptError);
	const finalPromptErrorMessage = typeof finalPromptError === "string" ? finalPromptError : finalPromptError instanceof Error ? finalPromptError.message : finalPromptError ? formatErrorMessage(finalPromptError) : void 0;
	if (isInvalidCodexImagePayloadError(finalPromptErrorMessage)) await clearCodexBindingAfterInvalidImagePayload(bindingStore, bindingIdentity, {
		phase: "turn_completed",
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		error: finalPromptErrorMessage
	});
	if (resourceState.thread.connectionScope !== "supervision" && shouldUseFreshCodexThreadAfterContextEngineOverflow({
		error: finalPromptError,
		contextEngineActive: Boolean(activeContextEngine),
		thread: resourceState.thread
	})) {
		log.warn("codex app-server context-engine turn overflowed after resume; clearing thread binding for recovery", {
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			error: finalPromptErrorMessage
		});
		await bindingStore.mutate(bindingIdentity, {
			kind: "clear",
			threadId: resourceState.thread.threadId
		});
	}
	const refreshedUsageLimitPromptError = await refreshCodexUsageLimitPromptError({
		client: resourceState.client,
		message: finalPromptErrorMessage,
		timeoutMs: appServer.requestTimeoutMs,
		signal: runAbortController.signal
	});
	if (refreshedUsageLimitPromptError) {
		await markCodexAuthProfileBlockedFromRateLimits({
			params,
			authProfileId: startupAuthProfileId,
			rateLimits: refreshedUsageLimitPromptError.rateLimitsForProfile
		});
		finalPromptError = createCodexUsageLimitPromptError(refreshedUsageLimitPromptError.message);
	} else if (isCodexUsageLimitPromptError(finalPromptError) && state.rateLimitsRevisionBeforeLastTurnStart !== void 0 && readCodexRateLimitsRevision(resourceState.client) > state.rateLimitsRevisionBeforeLastTurnStart) await markCodexAuthProfileBlockedFromRateLimits({
		params,
		authProfileId: startupAuthProfileId,
		rateLimits: readRecentCodexRateLimits(resourceState.client)
	});
	const finalPromptErrorSource = effectiveTimedOut || clientClosedPromptErrorForFinal ? "prompt" : projectedTerminal.promptErrorSource;
	const codexAppServerFailureKind = clientClosedPromptErrorForFinal ? "client_closed_before_turn_completed" : effectiveTurnCompletionIdleTimedOut ? "turn_completion_idle_timeout" : void 0;
	const replayBlockedReason = codexAppServerFailureKind ? resolveCodexAppServerReplayBlockedReason(result) : void 0;
	const promptTimeoutOutcome = buildCodexAppServerPromptTimeoutOutcome({
		result,
		turnCompletionIdleTimedOut: effectiveTurnCompletionIdleTimedOut,
		turnWatchTimeoutKind: state.turnWatchTimeoutKind
	});
	const failureDiagnostics = codexAppServerFailureKind === "client_closed_before_turn_completed" && state.clientClosedDiagnostic ? { transportError: state.clientClosedDiagnostic } : codexAppServerFailureKind === "turn_completion_idle_timeout" && state.turnWatchTimeoutKind === "completion" ? buildCodexAppServerTimeoutDiagnostics({
		idleMs: state.turnWatchTimeoutIdleMs,
		timeoutMs: state.turnWatchTimeoutMs,
		lastActivityReason: state.turnWatchTimeoutLastActivityReason,
		details: state.turnWatchTimeoutDetails
	}) : void 0;
	const codexAppServerFailure = codexAppServerFailureKind ? {
		kind: codexAppServerFailureKind,
		...codexAppServerFailureKind === "turn_completion_idle_timeout" && state.turnWatchTimeoutKind ? { turnWatchTimeoutKind: state.turnWatchTimeoutKind } : {},
		transport: appServer.start.transport,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		replaySafe: replayBlockedReason === void 0,
		...replayBlockedReason ? { replayBlockedReason } : {},
		...failureDiagnostics ? { diagnostics: failureDiagnostics } : {}
	} : void 0;
	const finalAborted = isFinalAborted();
	const completedTurnStatus = activeProjector.getCompletedTurnStatus();
	const locallyCompletedTurn = state.completed && (state.localCompletionRequested || !state.terminalTurnNotificationQueued) && !state.timedOut && clientClosedPromptErrorForFinal === void 0;
	const turnSucceeded = !finalAborted && !effectiveTimedOut && (finalPromptError === null || finalPromptError === void 0) && (completedTurnStatus === "completed" || recoveredTurnWatchTimeout || locallyCompletedTurn);
	if (toolBridge.telemetry.messagingToolSentTargets.some((target) => target.sourceReplyFinal === true)) result.agentHarnessResultClassification = void 0;
	const attemptSucceeded = turnSucceeded && result.agentHarnessResultClassification === void 0;
	terminalState.turnSucceeded = turnSucceeded;
	terminalState.sharedAbortAllowedAfterTerminalOutcome = shouldKeepCodexSharedAbortOpen({
		trigger: params.trigger,
		result,
		attemptSucceeded,
		explicitCancellationObserved: terminalState.explicitCancellationObserved
	});
	freezeRunTerminalOutcome();
	const modelCallFailureKind = classifyCodexModelCallFailureKind({
		error: finalPromptError,
		timedOut: effectiveTimedOut,
		turnCompletionIdleTimedOut: effectiveTurnCompletionIdleTimedOut,
		runAborted: finalAborted,
		abortReason: terminalState.explicitCancellationReason ?? runAbortController.signal.reason,
		clientClosedAbort: state.clientClosedAbort,
		formatError: formatErrorMessage
	}) ?? (finalAborted ? "aborted" : void 0);
	if (modelCallFailureKind) codexModelCallDiagnostics.emitError(finalPromptError ?? "codex app-server attempt interrupted", { failureKind: modelCallFailureKind });
	else if (finalPromptError) codexModelCallDiagnostics.emitError(finalPromptError);
	else codexModelCallDiagnostics.emitCompleted(result);
	const mirrorOutcome = await codexTranscriptMirrorRuntime.mirrorBestEffort({
		params,
		agentId: sessionAgentId,
		notifyUserMessagePersisted,
		result,
		sessionKey: contextSessionKey,
		cwd: effectiveCwd,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId
	});
	const { assistantTranscriptOwned, assistantTranscriptIdempotencyKey, terminalAnchor } = mirrorOutcome;
	const shouldCaptureSettledTurnFinalizationContext = result.assistantTexts.every((text) => !text.trim()) && result.messagesSnapshot.some((message) => message.role === "toolResult") && (!finalPromptError || activeProjector.settledTurnFailureFinalizationAllowed);
	const settledTurnFinalizationContext = shouldCaptureSettledTurnFinalizationContext ? await captureCodexSettledTurnFinalizationContext({
		...activeTranscriptTarget,
		mirroredMessages: mirrorOutcome.mirroredMessages,
		settledMessages: result.messagesSnapshot,
		turnId: activeTurnId
	}) : void 0;
	if (shouldCaptureSettledTurnFinalizationContext && !settledTurnFinalizationContext) log.warn("codex settled-turn finalization context is unavailable", {
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId
	});
	runAgentHarnessLlmOutputHook({
		event: {
			runId: params.runId,
			sessionId: params.sessionId,
			provider: usesSupervisionConnection ? resourceState.thread.modelProvider ?? effectiveRuntimeProviderId : params.provider,
			model: usesSupervisionConnection ? resourceState.thread.model ?? effectiveRuntimeModelId : params.modelId,
			...hookContextWindowFields,
			resolvedRef: usesSupervisionConnection ? `${resourceState.thread.modelProvider ?? effectiveRuntimeProviderId}/${resourceState.thread.model ?? effectiveRuntimeModelId}` : params.runtimePlan?.observability.resolvedRef ?? `${params.provider}/${params.modelId}`,
			...!usesSupervisionConnection && params.runtimePlan?.observability.harnessId ? { harnessId: params.runtimePlan.observability.harnessId } : {},
			assistantTexts: result.assistantTexts,
			...result.lastAssistant ? { lastAssistant: result.lastAssistant } : {},
			...result.attemptUsage ? { usage: result.attemptUsage } : {}
		},
		ctx: hookContext,
		hookRunner
	});
	await runCodexAgentEndHook(params, {
		event: {
			messages: result.messagesSnapshot,
			success: !finalAborted && !finalPromptError,
			...finalPromptError ? { error: formatErrorMessage(finalPromptError) } : {},
			durationMs: Date.now() - attemptStartedAt
		},
		ctx: {
			...hookContext,
			modelProviderId: resourceState.thread.modelProvider ?? effectiveRuntimeProviderId,
			modelId: resourceState.thread.model ?? effectiveRuntimeModelId,
			authProfileId: resourceState.thread.authProfileId ?? startupAuthProfileId,
			modelIterations: result.modelIterations ?? 0,
			skillWorkshopAvailable: flattenCodexDynamicToolFunctions(attemptTools.toolBridge.availableSpecs).some((tool) => tool.name === "skill_workshop"),
			compacted: (result.compactionCount ?? 0) > 0,
			messageChannel: params.messageChannel,
			messageProvider: params.messageProvider,
			chatType: params.chatType,
			agentAccountId: params.agentAccountId,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			memberRoleIds: params.memberRoleIds,
			spawnedBy: params.spawnedBy,
			senderId: params.senderId ?? void 0,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderIsOwner: params.senderIsOwner
		},
		hookRunner
	});
	state.shouldDelayNativeHookRelayUnregister = completedTurnStatus === "completed" && !effectiveTimedOut && !runAbortController.signal.aborted && !finalAborted && !finalPromptError;
	if (state.shouldDelayNativeHookRelayUnregister) try {
		await markCodexAppServerBindingCoveredThroughTurn({
			bindingStore,
			identity: bindingIdentity,
			threadId: resourceState.thread.threadId
		});
	} catch (error) {
		if (resourceState.thread.connectionScope === "supervision") throw error;
		if (!await bindingStore.mutate(bindingIdentity, {
			kind: "clear",
			threadId: resourceState.thread.threadId
		})) throw error;
		log.warn("codex app-server binding coverage update failed after completed turn; cleared stale binding", {
			threadId: resourceState.thread.threadId,
			turnId: activeTurnId,
			error
		});
	}
	recordCodexTrajectoryCompletion(trajectoryRecorder, {
		attempt: params,
		result,
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		timedOut: effectiveTimedOut,
		yieldDetected: toolState.yieldDetected
	});
	trajectoryRecorder?.recordEvent("session.ended", {
		status: finalPromptError ? "error" : finalAborted || effectiveTimedOut ? "interrupted" : "success",
		threadId: resourceState.thread.threadId,
		turnId: activeTurnId,
		timedOut: effectiveTimedOut,
		yieldDetected: toolState.yieldDetected,
		promptError: normalizeCodexTrajectoryError(finalPromptError)
	});
	markTrajectoryEndRecorded();
	const terminalAssistantText = collectTerminalAssistantText(result);
	if (terminalAssistantText && (!streamState.eventEmitted || streamState.needsTerminalSnapshot) && !finalAborted && !finalPromptError) emitCodexAppServerEvent(params, {
		stream: "assistant",
		data: { text: terminalAssistantText }
	});
	emitLifecycleTerminal(finalPromptError ? {
		phase: "error",
		error: formatErrorMessage(finalPromptError),
		...buildLifecycleTerminalMeta({
			aborted: finalAborted,
			timedOut: effectiveTimedOut
		})
	} : {
		phase: "end",
		...buildLifecycleTerminalMeta({
			aborted: finalAborted,
			timedOut: effectiveTimedOut,
			yielded: toolState.yieldDetected
		})
	});
	const finalizedResult = {
		...result,
		terminal: attemptTerminal.normalize({
			timedOut: effectiveTimedOut,
			aborted: finalAborted,
			promptError: finalPromptError,
			promptErrorSource: finalPromptErrorSource
		}),
		...codexAppServerFailure ? { codexAppServerFailure } : {},
		...promptTimeoutOutcome ? { promptTimeoutOutcome } : {},
		...assistantTranscriptOwned ? { assistantTranscriptOwned: true } : {},
		...assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey } : {},
		...terminalAnchor ? { contextEngineTerminalAnchor: terminalAnchor } : {},
		...settledTurnFinalizationContext ? { settledTurnFinalizationContext } : {},
		...resourceState.runtimeArtifact ? { runtimeArtifact: resourceState.runtimeArtifact } : {},
		...!finalAborted && !effectiveTimedOut && !finalPromptError && preparedAuthBinding ? { authBindingFingerprint: preparedAuthBinding.fingerprint } : {},
		systemPromptReport
	};
	if (turnSucceeded && toolState.yieldDetected && !runAbortController.signal.aborted) resourceState.nativeHookRelay?.authorizeRetentionAfterSuccessfulYield();
	return finalizedResult;
}
//#endregion
//#region extensions/codex/src/app-server/attempt-notification-state.ts
/**
* State machine for Codex app-server turn notifications and idle-watch updates.
*/
/** Emits coarse execution phases exactly once from app-server notifications. */
function reportCodexExecutionNotification(params) {
	const { notification } = params;
	if (notification.method === "turn/started") {
		params.emitExecutionPhaseOnce("turn_accepted", { phase: "turn_accepted" });
		return;
	}
	if (notification.method === "item/agentMessage/delta") {
		params.emitExecutionPhaseOnce("assistant_output_started", { phase: "assistant_output_started" });
		return;
	}
	if (notification.method !== "item/started") return;
	const item = readCodexNotificationItem(notification.params);
	const tool = item ? codexExecutionToolName(item) : void 0;
	if (!item || !tool) return;
	params.emitExecutionPhaseOnce(`tool:${item.id}`, {
		phase: "tool_execution_started",
		tool,
		itemId: item.id
	});
}
/** Returns true when a notification ends the current app-server turn. */
function isTerminalCodexTurnNotificationForTurn(params) {
	if (!isCodexNotificationForTurn(params.notification.params, params.threadId, params.turnId)) return false;
	return params.notification.method === "turn/completed";
}
/**
* Applies one notification to active item tracking, idle watches, and terminal
* turn state.
*/
function applyCodexTurnNotificationState(params) {
	const { notification, turnWatches } = params;
	const isCurrentTurnNotification = isCodexNotificationForTurn(notification.params, params.threadId, params.turnId);
	const isTurnCompletion = notification.method === "turn/completed" && isCurrentTurnNotification;
	let turnCrossedToolHandoff = params.turnCrossedToolHandoff;
	if (isCurrentTurnNotification) {
		updateActiveTurnItemIds(notification, params.activeTurnItemIds);
		updateActiveCompletionBlockerItemIds(notification, params.activeCompletionBlockerItemIds);
		turnWatches.touchActivity(`notification:${notification.method}`, {
			details: describeNotificationActivity(notification),
			attemptProgress: true
		});
		params.onReportExecutionNotification(notification);
		if (notification.method === "item/completed" && params.activeTurnItemIds.size === 0) params.onScheduleTerminalDynamicToolReleaseCheck();
	}
	const unblockedAssistantCompletionRelease = isCurrentTurnNotification && turnWatches.isAssistantCompletionIdleWatchArmed() && notification.method === "item/completed" && params.activeTurnItemIds.size === 0;
	const trackedDynamicToolCompletion = isPendingOpenClawDynamicToolCompletionNotification(notification, params.pendingOpenClawDynamicToolCompletionIds);
	const rawToolOutputCompletion = isRawToolOutputCompletionNotification(notification);
	if (isCurrentTurnNotification && (rawToolOutputCompletion || isNativeToolProgressNotification(notification))) turnCrossedToolHandoff = true;
	const assistantCompletionCanRelease = isAssistantCompletionReleaseNotification(notification, turnCrossedToolHandoff);
	const postToolProgressNeedsTerminalGuard = isCurrentTurnNotification && turnCrossedToolHandoff && ((isRawAssistantProgressNotification(notification) || isRawReasoningCompletionNotification(notification)) && params.activeTurnItemIds.size === 0 || isReasoningProgressNotification(notification));
	const postToolPatchUpdateNeedsTerminalGuard = isCurrentTurnNotification && turnCrossedToolHandoff && isFileChangePatchUpdatedNotification(notification);
	const rawResponseItemCompletedWithNoActiveItems = isCurrentTurnNotification && notification.method === "rawResponseItem/completed" && params.activeTurnItemIds.size === 0 && params.activeAppServerTurnRequests === 0 && !assistantCompletionCanRelease && !postToolProgressNeedsTerminalGuard && !rawToolOutputCompletion;
	const shouldArmNoToolPostProgressReplyWatch = isCurrentTurnNotification && !turnCrossedToolHandoff && params.activeTurnItemIds.size === 0 && (isReasoningItemCompletionNotification(notification) || isAssistantCommentaryCompletionNotification(notification));
	const shouldArmNoToolPostRawProgressReplyWatch = !turnCrossedToolHandoff && rawResponseItemCompletedWithNoActiveItems && (isRawReasoningCompletionNotification(notification) || isRawAssistantProgressNotification(notification));
	const shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem = isCurrentTurnNotification && notification.method === "item/completed" && params.activeTurnItemIds.size === 0 && !trackedDynamicToolCompletion && !assistantCompletionCanRelease && !shouldArmNoToolPostProgressReplyWatch;
	const shouldUsePostToolContinuationWatch = turnCrossedToolHandoff && (postToolProgressNeedsTerminalGuard || postToolPatchUpdateNeedsTerminalGuard || rawToolOutputCompletion || trackedDynamicToolCompletion || shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem);
	const armPostToolContinuationWatch = () => {
		turnWatches.armCompletionIdleWatch({ timeoutMs: params.postToolRawAssistantCompletionIdleTimeoutMs });
		turnWatches.extendAttemptIdleWatch(params.postToolRawAssistantCompletionIdleTimeoutMs);
	};
	const armPostProgressReplyWatch = () => {
		turnWatches.armCompletionIdleWatch({ timeoutMs: CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS });
		turnWatches.extendAttemptIdleWatch(CODEX_POST_REASONING_REPLY_IDLE_TIMEOUT_MS);
	};
	if (isCurrentTurnNotification && notification.method === "error") {
		if (isRetryableErrorNotification(notification.params)) turnWatches.disarmCompletionIdleWatch();
		else turnWatches.armCompletionIdleWatch({ pinnedByTerminalError: true });
		turnWatches.disarmAssistantCompletionIdleWatch();
	} else if (isTurnCompletion) turnWatches.disarmAssistantCompletionIdleWatch();
	else if (isCurrentTurnNotification && assistantCompletionCanRelease) turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
	else if (postToolProgressNeedsTerminalGuard || postToolPatchUpdateNeedsTerminalGuard) armPostToolContinuationWatch();
	else if (shouldArmNoToolPostProgressReplyWatch || shouldArmNoToolPostRawProgressReplyWatch) armPostProgressReplyWatch();
	else if (trackedDynamicToolCompletion) armPostToolContinuationWatch();
	else if (unblockedAssistantCompletionRelease) turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
	else if (shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem) if (shouldUsePostToolContinuationWatch) armPostToolContinuationWatch();
	else turnWatches.armCompletionIdleWatch();
	else if (rawResponseItemCompletedWithNoActiveItems) turnWatches.armCompletionIdleWatch();
	else if (isCurrentTurnNotification && rawToolOutputCompletion) armPostToolContinuationWatch();
	else if (isCurrentTurnNotification && shouldDisarmAssistantCompletionIdleWatch(notification)) turnWatches.disarmAssistantCompletionIdleWatch();
	if (turnWatches.isCompletionIdleWatchArmed() && !turnWatches.isCompletionIdleWatchPinnedByTerminalError() && notification.method !== "turn/completed" && isCurrentTurnNotification && !trackedDynamicToolCompletion && !rawToolOutputCompletion && !postToolProgressNeedsTerminalGuard && !postToolPatchUpdateNeedsTerminalGuard && !rawResponseItemCompletedWithNoActiveItems && !shouldArmNoToolPostProgressReplyWatch && !shouldArmNoToolPostRawProgressReplyWatch && !shouldRearmCompletionIdleWatchAfterLastCurrentTurnItem) turnWatches.disarmCompletionIdleWatch();
	if (trackedDynamicToolCompletion) {
		const itemId = readNotificationItemId(notification);
		if (itemId) {
			params.pendingOpenClawDynamicToolCompletionIds.delete(itemId);
			params.onScheduleTerminalDynamicToolReleaseCheck();
		}
	}
	return {
		isCurrentTurnNotification,
		isTurnAbortMarker: isCurrentTurnNotification && isCodexTurnAbortMarkerNotification(notification, { currentPromptTexts: params.currentPromptTexts }),
		isTurnTerminal: isTerminalCodexTurnNotificationForTurn({
			notification,
			threadId: params.threadId,
			turnId: params.turnId
		}),
		turnCrossedToolHandoff
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle-terminal.ts
function buildCodexLifecycleTerminalMeta(input) {
	if (input.timedOut || input.abortStopReason === "timeout") return {
		aborted: true,
		status: "timed_out",
		stopReason: "timeout",
		timeoutPhase: "provider",
		providerStarted: true
	};
	if (input.yielded && !input.aborted) return {
		yielded: true,
		livenessState: "paused",
		stopReason: "end_turn"
	};
	return input.aborted ? {
		aborted: true,
		status: "cancelled",
		stopReason: "stop"
	} : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-lifecycle-controller.ts
function createCodexAttemptLifecycleController(resources, turnRuntime) {
	const { prompt, trajectoryRecorder } = resources;
	const { connection } = prompt.context.runtime;
	const { params, attemptStartedAt, runAbortController, fastModeAutoStartedAtMs, fastModeAutoProgressState } = connection;
	const { state, activeTurnItemIds, pendingOpenClawDynamicToolCompletionIds } = turnRuntime;
	const releaseTurnAfterTerminalDynamicTool = (value) => {
		if (!shouldReleaseTurnAfterTerminalDynamicTool({
			completed: state.completed,
			aborted: runAbortController.signal.aborted,
			responseSuccess: value.response.success,
			currentTurnHadNonTerminalDynamicToolResult: state.currentTurnHadNonTerminalDynamicToolResult,
			activeAppServerTurnRequests: state.activeAppServerTurnRequests,
			activeTurnItemIdsCount: activeTurnItemIds.size,
			pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size
		})) return;
		state.pendingTerminalDynamicToolRelease = void 0;
		trajectoryRecorder?.recordEvent("turn.dynamic_tool_terminal_release", {
			threadId: value.call.threadId,
			turnId: value.call.turnId,
			toolCallId: value.call.callId,
			name: value.call.tool,
			durationMs: value.durationMs
		});
		log.info("codex app-server turn released after terminal dynamic tool result", {
			threadId: value.call.threadId,
			turnId: value.call.turnId,
			toolCallId: value.call.callId,
			tool: value.call.tool,
			durationMs: value.durationMs
		});
		turnRuntime.steeringQueueRef.current?.cancel();
		turnRuntime.interruptTurn(value.call.turnId, { locallyCompleted: true });
		turnRuntime.completeTurn();
	};
	const scheduleTerminalDynamicToolReleaseCheck = () => {
		if (state.terminalDynamicToolReleaseCheckScheduled || !state.pendingTerminalDynamicToolRelease && !state.currentTurnHadNonTerminalDynamicToolResult) return;
		state.terminalDynamicToolReleaseCheckScheduled = true;
		setImmediate(() => {
			state.terminalDynamicToolReleaseCheckScheduled = false;
			if (state.pendingTerminalDynamicToolRelease?.response.success === true && !state.currentTurnHadNonTerminalDynamicToolResult && state.activeAppServerTurnRequests === 0 && pendingOpenClawDynamicToolCompletionIds.size === 0) turnRuntime.steeringQueueRef.current?.cancel();
			const action = resolveTerminalDynamicToolBatchAction({
				activeAppServerTurnRequests: state.activeAppServerTurnRequests,
				activeTurnItemIdsCount: activeTurnItemIds.size,
				pendingOpenClawDynamicToolCompletionIdsCount: pendingOpenClawDynamicToolCompletionIds.size,
				currentTurnHadNonTerminalDynamicToolResult: state.currentTurnHadNonTerminalDynamicToolResult,
				hasPendingTerminalDynamicToolRelease: state.pendingTerminalDynamicToolRelease !== void 0
			});
			if (action === "release-pending-terminal" && state.pendingTerminalDynamicToolRelease) releaseTurnAfterTerminalDynamicTool(state.pendingTerminalDynamicToolRelease);
			else if (action === "clear-nonterminal-batch") {
				state.pendingTerminalDynamicToolRelease = void 0;
				state.currentTurnHadNonTerminalDynamicToolResult = false;
			}
		}).unref?.();
	};
	const scheduleTurnReleaseAfterTerminalDynamicTool = (value) => {
		state.pendingTerminalDynamicToolRelease = value;
		scheduleTerminalDynamicToolReleaseCheck();
	};
	const emitLifecycleStart = () => {
		emitCodexAppServerEvent(params, {
			stream: "lifecycle",
			data: {
				phase: "start",
				startedAt: attemptStartedAt
			}
		});
		state.lifecycleStarted = true;
	};
	const emitLifecycleTerminal = (data) => {
		if (!state.lifecycleStarted || state.lifecycleTerminalEmitted) return;
		emitCodexAppServerEvent(params, {
			stream: "lifecycle",
			data: {
				startedAt: attemptStartedAt,
				endedAt: Date.now(),
				...data,
				...params.deferTerminalLifecycle ? { phase: "finishing" } : {}
			}
		});
		state.lifecycleTerminalEmitted = true;
	};
	const buildLifecycleTerminalMeta = (input) => {
		const abortFields = input.aborted ? resolveAgentRunAbortLifecycleFields(runAbortController.signal) : void 0;
		return buildCodexLifecycleTerminalMeta({
			...input,
			abortStopReason: abortFields?.stopReason
		});
	};
	const executionPhaseKeys = /* @__PURE__ */ new Set();
	const emitExecutionPhaseOnce = (key, info) => {
		if (executionPhaseKeys.has(key)) return;
		executionPhaseKeys.add(key);
		params.onExecutionPhase?.({
			provider: params.provider,
			model: params.modelId,
			backend: "codex-app-server",
			...info
		});
	};
	const reportExecutionNotification = (notification) => {
		reportCodexExecutionNotification({
			notification,
			emitExecutionPhaseOnce
		});
	};
	const emitFastModeAutoProgress = async (payload) => {
		const summary = formatFastModeAutoProgressText(payload);
		await emitCodexAppServerEvent(params, {
			stream: "item",
			data: {
				kind: "status",
				title: "Fast",
				phase: "update",
				summary
			}
		});
		try {
			await params.onToolResult?.({
				text: summary,
				channelData: { openclawProgressKind: FAST_MODE_AUTO_PROGRESS_KIND }
			});
		} catch (error) {
			log.debug("codex app-server fast mode auto progress delivery failed", { error });
		}
	};
	const maybeAnnounceFastModeAutoOff = async () => {
		if (params.fastModeAuto !== true || fastModeAutoStartedAtMs === void 0 || fastModeAutoProgressState.offAnnounced) return;
		const next = resolveFastModeForElapsed({
			mode: "auto",
			startedAtMs: fastModeAutoStartedAtMs,
			fastAutoOnSeconds: params.fastModeAutoOnSeconds
		});
		if (next.enabled) return;
		fastModeAutoProgressState.offAnnounced = true;
		await emitFastModeAutoProgress(next);
	};
	const maybeEmitFastModeAutoReset = async () => {
		if (params.fastModeAuto !== true || !fastModeAutoProgressState.offAnnounced || fastModeAutoProgressState.resetAnnounced) return;
		fastModeAutoProgressState.resetAnnounced = true;
		await emitFastModeAutoProgress({
			enabled: true,
			elapsedSeconds: 0,
			fastAutoOnSeconds: params.fastModeAutoOnSeconds
		});
	};
	const maybeEmitFastModeAutoResetBestEffort = async () => {
		try {
			await maybeEmitFastModeAutoReset();
		} catch (error) {
			log.warn(`codex app-server fast mode auto reset progress failed: ${formatErrorMessage(error)}`);
		}
	};
	return {
		scheduleTerminalDynamicToolReleaseCheck,
		scheduleTurnReleaseAfterTerminalDynamicTool,
		emitLifecycleStart,
		emitLifecycleTerminal,
		buildLifecycleTerminalMeta,
		emitExecutionPhaseOnce,
		reportExecutionNotification,
		maybeAnnounceFastModeAutoOff,
		maybeEmitFastModeAutoResetBestEffort
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-notification-controller.ts
function createCodexAttemptNotificationController(resources, turnRuntime, lifecycle) {
	const { prompt, state: resourceState, projectorRef, registerNativeSubagentMonitor } = resources;
	const { context, turnState } = prompt;
	const { attemptTools, runtime } = context;
	const { connection } = runtime;
	const { appServer, runAbortController } = connection;
	const { allocateCodexToolOutcomeOrdinal } = attemptTools;
	const { state, turnIdRef, userInputBridgeRef, steeringQueueRef, turnWatches, activeTurnItemIds, activeCompletionBlockerItemIds, activeFinalizationHookRunIds, finalizationHookBatchStatuses, pendingOpenClawDynamicToolCompletionIds, postToolRawAssistantCompletionIdleTimeoutMs, completeTurn } = turnRuntime;
	const { scheduleTerminalDynamicToolReleaseCheck, reportExecutionNotification, maybeAnnounceFastModeAutoOff } = lifecycle;
	const isTerminalTurnNotificationForTurn = (notification, notificationTurnId) => isTerminalCodexTurnNotificationForTurn({
		notification,
		threadId: resourceState.thread.threadId,
		turnId: notificationTurnId
	});
	const handleNotification = async (notification) => {
		const projector = projectorRef.current;
		const turnId = turnIdRef.current;
		const steeringQueue = steeringQueueRef.current;
		userInputBridgeRef.current?.handleNotification(notification);
		if (!projector || !turnId) {
			if (notification.method === "error") state.latestStartupErrorNotification = notification;
			return;
		}
		if ((state.timedOut || state.localCompletionRequested) && notification.method === "turn/completed" && readCodexTurnCompletedNotification(notification.params)?.turn.status === "interrupted") {
			completeTurn();
			return;
		}
		const notificationState = applyCodexTurnNotificationState({
			notification,
			threadId: resourceState.thread.threadId,
			turnId,
			currentPromptTexts: [turnState.codexTurnPromptText],
			turnWatches,
			activeTurnItemIds,
			activeCompletionBlockerItemIds,
			activeAppServerTurnRequests: state.activeAppServerTurnRequests,
			pendingOpenClawDynamicToolCompletionIds,
			turnCrossedToolHandoff: state.turnCrossedToolHandoff,
			postToolRawAssistantCompletionIdleTimeoutMs,
			onScheduleTerminalDynamicToolReleaseCheck: scheduleTerminalDynamicToolReleaseCheck,
			onReportExecutionNotification: reportExecutionNotification
		});
		state.turnCrossedToolHandoff = notificationState.turnCrossedToolHandoff;
		if (notificationState.isCurrentTurnNotification && notification.method === "item/completed") {
			const item = readCodexNotificationItem(notification.params);
			if (item?.type === "userMessage" && typeof item.clientId === "string") steeringQueue?.confirmConsumed(item.clientId);
		}
		if (notificationState.isTurnAbortMarker) state.sawCodexInterruptMarker = true;
		const hookNotification = readCodexFinalizationHookNotification(notification, resourceState.thread.threadId, turnId);
		if (hookNotification?.phase === "started") {
			if (activeFinalizationHookRunIds.size === 0) finalizationHookBatchStatuses.clear();
			activeFinalizationHookRunIds.add(hookNotification.runId);
			turnWatches.disarmAssistantCompletionIdleWatch();
		}
		if (notificationState.isTurnTerminal) state.terminalTurnNotificationQueued = true;
		try {
			await waitForCodexNotificationDispatchTurn();
			await projector.handleNotification(notification);
			const canRelease = isAssistantCompletionReleaseNotification(notification, state.turnCrossedToolHandoff) || notificationState.isCurrentTurnNotification && state.turnCrossedToolHandoff && notification.method === "rawResponseItem/completed" && projector.canReleaseLatestTerminalAssistantAfterToolHandoff();
			if (notificationState.isCurrentTurnNotification && canRelease) {
				const itemId = projector.getLatestTerminalAssistantCandidate()?.itemId;
				if (state.rejectedFinalizationHookAssistant && itemId && itemId !== state.rejectedFinalizationHookAssistant.itemId) state.rejectedFinalizationHookAssistant = void 0;
				else if (state.rejectedFinalizationHookAssistant) turnWatches.disarmAssistantCompletionIdleWatch();
				else if (activeFinalizationHookRunIds.size === 0 && !state.terminalTurnNotificationQueued && state.activeAppServerTurnRequests === 0 && activeTurnItemIds.size === 0 && activeCompletionBlockerItemIds.size === 0 && pendingOpenClawDynamicToolCompletionIds.size === 0 && projector.hasLatestTerminalAssistantCandidateText()) turnWatches.armAssistantCompletionIdleWatch(describeNotificationActivity(notification));
			}
			if (notificationState.isCurrentTurnNotification && activeTurnItemIds.size === 0 && isRawFunctionToolOutputCompletionNotification(notification)) await maybeAnnounceFastModeAutoOff();
		} catch (error) {
			log.debug("codex app-server projector notification threw", {
				method: notification.method,
				error
			});
		} finally {
			if (hookNotification?.phase === "completed") {
				state.unsettledFinalizationHookCount = Math.max(0, state.unsettledFinalizationHookCount - 1);
				activeFinalizationHookRunIds.delete(hookNotification.runId);
				finalizationHookBatchStatuses.set(hookNotification.runId, hookNotification.status);
				if (activeFinalizationHookRunIds.size === 0) {
					const statuses = new Set(finalizationHookBatchStatuses.values());
					if (statuses.has("blocked") && !statuses.has("stopped")) {
						const itemId = projector.getLatestTerminalAssistantCandidate()?.itemId;
						state.rejectedFinalizationHookAssistant = itemId ? { itemId } : {};
						turnWatches.disarmAssistantCompletionIdleWatch();
					} else state.rejectedFinalizationHookAssistant = void 0;
				}
				if (activeFinalizationHookRunIds.size === 0 && state.rejectedFinalizationHookAssistant === void 0 && !state.terminalTurnNotificationQueued && state.activeAppServerTurnRequests === 0 && activeTurnItemIds.size === 0 && activeCompletionBlockerItemIds.size === 0 && pendingOpenClawDynamicToolCompletionIds.size === 0 && projector.hasLatestTerminalAssistantCandidateText()) turnWatches.armAssistantCompletionIdleWatch({
					lastNotificationMethod: notification.method,
					hookRunId: hookNotification.runId,
					hookStatus: hookNotification.status
				});
			}
			if (notificationState.isTurnTerminal) {
				if ((readCodexTurnCompletedNotification(notification.params)?.turn)?.status === "interrupted" && state.sawCodexInterruptMarker) projector.markAborted();
				completeTurn();
			}
		}
	};
	const waitForActiveNativeTurnCompletion = async () => {
		const route = resourceState.turnRoute;
		const activeNativeTurnId = resourceState.thread.lifecycle.activeTurnIds?.at(-1) ?? route?.observedNativeTurnId;
		if (!route || !activeNativeTurnId) return false;
		const watch = resourceState.turnRouter.watchNativeTurnCompletion({
			threadId: route.threadId,
			turnId: activeNativeTurnId,
			timeoutMs: Math.min(appServer.requestTimeoutMs, CODEX_APP_SERVER_NATIVE_TURN_WAIT_TIMEOUT_MS),
			signal: runAbortController.signal
		});
		try {
			return await watch.completion;
		} finally {
			watch.cancel();
		}
	};
	const noteNotificationReceived = (notification, scope, receivedAtMs) => {
		const projector = projectorRef.current;
		const turnId = turnIdRef.current;
		if (!projector || !turnId) return;
		if (isTerminalTurnNotificationForTurn(notification, turnId)) {
			state.terminalTurnNotificationQueued = true;
			steeringQueueRef.current?.sealAdmission();
		}
		if (scope.turnId === turnId) {
			const modelToolCallId = readRawResponseToolCallId(notification);
			if (modelToolCallId) allocateCodexToolOutcomeOrdinal?.(modelToolCallId);
			const nativeItem = readCodexNotificationItem(notification.params);
			if (nativeItem?.type === "webSearch") projector.recordNativeToolOutcome(nativeItem);
		}
		if (readCodexFinalizationHookNotification(notification, resourceState.thread.threadId, turnId)?.phase === "started") {
			state.unsettledFinalizationHookCount += 1;
			turnWatches.disarmAssistantCompletionIdleWatch();
		}
		turnWatches.noteNotificationReceived(notification.method, { receivedAtMs });
	};
	const enqueueNotification = async (notification, scope) => {
		log.trace("codex app-server raw notification received", {
			method: notification.method,
			...scope
		});
		await handleNotification(notification);
	};
	const drainNotificationQueue = async () => {
		await resourceState.turnRoute?.drain();
	};
	registerNativeSubagentMonitor(resourceState.thread.threadId);
	return {
		waitForActiveNativeTurnCompletion,
		noteNotificationReceived,
		enqueueNotification,
		drainNotificationQueue
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-prompt.ts
function isRestrictivePromptToolsAllow(toolsAllow) {
	return toolsAllow !== void 0 && !toolsAllow.some((name) => name.trim() === "*");
}
async function prepareCodexAttemptPrompt(context) {
	const { runtime, attemptTools, historyState, hookContext, workspaceBootstrapContext, buildActiveContextEngineRuntimeContext, baseDeveloperInstructions, openClawPromptContext, skillsCollaborationInstructions, promptState, codexContextProjectionMaxChars } = context;
	const { connection, buildActiveRunAttemptParams, effectiveContextTokenBudget, effectiveRuntimeModelId, effectiveRuntimeProviderId } = runtime;
	const { params, activeContextEngine, usesSupervisionConnection, mutable, isInactiveThreadBootstrapBinding, bindingStore, bindingIdentity, agentDir, appServer, contextSessionKey, effectiveWorkspace, sandbox } = connection;
	const { toolBridge } = attemptTools;
	const applyFreshThreadContinuityProjection = () => {
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: historyState.messages,
			originalHistoryMessages: historyState.messages,
			prompt: params.prompt,
			maxRenderedContextChars: codexContextProjectionMaxChars
		});
		promptState.promptText = projection.promptText;
		promptState.promptContextRange = projection.promptContextRange;
		promptState.prePromptMessageCount = projection.prePromptMessageCount;
	};
	const applyActiveContextEngineProjection = async (decisionStartupBinding) => {
		if (!activeContextEngine) return;
		const assembled = await assembleHarnessContextEngine({
			contextEngine: activeContextEngine,
			sessionId: runtime.activeSessionId,
			sessionKey: contextSessionKey,
			messages: historyState.messages,
			tokenBudget: effectiveContextTokenBudget,
			availableTools: new Set(flattenCodexDynamicToolFunctions(toolBridge.availableSpecs).map((tool) => tool.name).filter(isNonEmptyString)),
			citationsMode: params.config?.memory?.citations,
			sandboxed: sandbox?.enabled === true,
			modelId: effectiveRuntimeModelId,
			contextEngineHostSupport: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST,
			providerId: effectiveRuntimeProviderId,
			requestedModelId: usesSupervisionConnection ? void 0 : params.requestedModelId,
			fallbackReason: usesSupervisionConnection ? void 0 : params.fallbackReason,
			degradedReason: usesSupervisionConnection ? void 0 : params.degradedReason,
			runtimeContext: buildActiveContextEngineRuntimeContext(),
			transcriptReadFence: params.userTurnTranscriptRecorder?.getAdmissionReceipt(),
			prompt: params.prompt
		});
		if (!assembled) throw new Error("context engine assemble returned no result");
		const contextEngineProjection = readContextEngineThreadBootstrapProjection(assembled.contextProjection);
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: assembled.messages,
			originalHistoryMessages: historyState.messages,
			prompt: params.prompt,
			systemPromptAddition: assembled.systemPromptAddition,
			maxRenderedContextChars: codexContextProjectionMaxChars,
			toolPayloadMode: contextEngineProjection ? "preserve" : "elide"
		});
		const projectionDecision = contextEngineProjection ? resolveContextEngineBootstrapProjectionDecision({
			startupBinding: decisionStartupBinding,
			expectedBinding: buildContextEngineBinding(buildActiveRunAttemptParams(), contextEngineProjection),
			projection: contextEngineProjection,
			dynamicToolsFingerprint: codexDynamicToolsFingerprint(toolBridge.specs),
			legacyDynamicToolsFingerprint: codexLegacyDynamicToolsFingerprint(toolBridge.specs)
		}) : {
			project: true,
			reason: "per-turn-projection"
		};
		const decisionBinding = decisionStartupBinding;
		log.info("codex app-server context-engine projection decision", {
			sessionId: params.sessionId,
			sessionKey: contextSessionKey,
			engineId: activeContextEngine.info.id,
			mode: contextEngineProjection?.mode ?? assembled.contextProjection?.mode ?? "per_turn",
			epoch: contextEngineProjection?.epoch,
			fingerprint: contextEngineProjection?.fingerprint,
			previousThreadId: decisionBinding?.threadId,
			previousEpoch: decisionBinding?.contextEngine?.projection?.epoch,
			previousFingerprint: decisionBinding?.contextEngine?.projection?.fingerprint,
			projected: projectionDecision.project,
			reason: projectionDecision.reason,
			assembledMessages: assembled.messages.length,
			originalHistoryMessages: historyState.messages.length,
			projectedPromptChars: projection.promptText.length,
			developerInstructionAdditionChars: projection.developerInstructionAddition?.length ?? 0
		});
		promptState.contextEngineProjection = contextEngineProjection;
		promptState.promptText = projectionDecision.project ? projection.promptText : params.prompt;
		promptState.promptContextRange = projectionDecision.project ? projection.promptContextRange : void 0;
		promptState.developerInstructions = joinPresentSections(baseDeveloperInstructions, projection.developerInstructionAddition);
		promptState.prePromptMessageCount = projection.prePromptMessageCount;
	};
	if (activeContextEngine) try {
		await applyActiveContextEngineProjection(runtime.nativeToolSurfaceEnabled ? mutable.startupBinding : void 0);
	} catch (assembleErr) {
		log.warn("context engine assemble failed; using Codex baseline prompt", { error: formatErrorMessage(assembleErr) });
	}
	const codexModelInputHistoryMessages = [];
	const buildPromptFromCurrentInputs = async () => {
		const result = await resolveAgentHarnessBeforePromptBuildResult({
			prompt: prependCurrentInboundContext(promptState.promptText, params.currentInboundContext),
			developerInstructions: promptState.developerInstructions,
			messages: structuredClone(historyState.messages),
			ctx: hookContext,
			bootstrapContextRunKind: params.bootstrapContextRunKind
		});
		if (isRestrictivePromptToolsAllow(result.toolsAllow)) throw new Error("Codex app-server cannot enforce before_prompt_build toolsAllow; use the embedded or Copilot runtime for turn-scoped tool policy.");
		return result;
	};
	const resolveShiftedPromptInputRange = (prompt, promptInputRange, turnPromptText) => {
		if (!promptInputRange || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || !turnPromptText.endsWith(prompt)) return;
		const turnPromptOffset = turnPromptText.length - prompt.length;
		return {
			start: turnPromptOffset + promptInputRange.start,
			end: turnPromptOffset + promptInputRange.end
		};
	};
	const resolveShiftedPromptContextRange = (prompt, promptInputRange, turnPromptText) => {
		const promptTextInputOffset = promptInputRange ? promptInputRange.end - promptState.promptText.length : void 0;
		if (!promptState.promptContextRange || !promptInputRange || promptTextInputOffset === void 0 || promptInputRange.start < 0 || promptInputRange.end < promptInputRange.start || promptInputRange.end > prompt.length || promptTextInputOffset < promptInputRange.start || prompt.slice(promptTextInputOffset, promptInputRange.end) !== promptState.promptText || !turnPromptText.endsWith(prompt)) return;
		const promptTextOffset = prompt.endsWith(promptState.promptText) ? prompt.length - promptState.promptText.length : promptTextInputOffset;
		if (promptTextOffset < 0) return;
		const turnPromptOffset = turnPromptText.length - prompt.length + promptTextOffset;
		const contextRange = {
			start: turnPromptOffset + promptState.promptContextRange.start,
			end: turnPromptOffset + promptState.promptContextRange.end
		};
		return {
			contextRange,
			requestRange: {
				start: contextRange.end,
				end: turnPromptOffset + promptState.promptText.length
			}
		};
	};
	const decorateCodexTurnPromptText = (promptBuildResult) => {
		const turnPromptText = prependCodexOpenClawPromptContext(promptBuildResult.prompt, openClawPromptContext, { preservePromptWithoutContext: params.bootstrapContextMode === "lightweight" && params.bootstrapContextRunKind === "cron" });
		const projectedRanges = resolveShiftedPromptContextRange(promptBuildResult.prompt, promptBuildResult.promptInputRange, turnPromptText);
		const preservedRange = resolveShiftedPromptInputRange(promptBuildResult.prompt, promptBuildResult.promptInputRange, turnPromptText) ?? resolveCodexDeliveryHintPreservedInputRange({
			prompt: promptBuildResult.prompt,
			promptInputRange: promptBuildResult.promptInputRange,
			decoratedPrompt: turnPromptText
		});
		return fitCodexProjectedContextForTurnStart({
			promptText: turnPromptText,
			contextRange: projectedRanges?.contextRange,
			requestRange: projectedRanges?.requestRange,
			preservedRange
		});
	};
	const firstPromptBuild = await buildPromptFromCurrentInputs();
	const turnState = {
		promptBuild: firstPromptBuild,
		codexTurnPromptText: decorateCodexTurnPromptText(firstPromptBuild)
	};
	const buildRenderedCodexDeveloperInstructions = () => joinPresentSections(turnState.promptBuild.developerInstructions, buildTurnCollaborationMode(params, {
		turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
		skillsCollaborationInstructions,
		memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions
	}).settings.developer_instructions ?? void 0);
	const rebuildCodexPromptBuildFromCurrentProjection = async () => {
		turnState.promptBuild = await buildPromptFromCurrentInputs();
		turnState.codexTurnPromptText = decorateCodexTurnPromptText(turnState.promptBuild);
	};
	const rebuildCodexTurnPromptTextFromCurrentProjection = async () => {
		const nextPromptBuild = await buildPromptFromCurrentInputs();
		turnState.promptBuild = {
			...turnState.promptBuild,
			prompt: nextPromptBuild.prompt,
			promptInputRange: nextPromptBuild.promptInputRange
		};
		turnState.codexTurnPromptText = decorateCodexTurnPromptText(nextPromptBuild);
	};
	const selectNewerVisibleHistoryAfterBinding = (binding) => {
		const cutoff = Date.parse(binding.historyCoveredThrough ?? "");
		return historyState.messages.filter((message) => {
			if (message.role !== "user" && message.role !== "assistant") return false;
			const record = message;
			const meta = record["__openclaw"];
			const mirrorIdentity = meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mirrorIdentity : void 0;
			const mirrorOrigin = meta && typeof meta === "object" && !Array.isArray(meta) ? meta.mirrorOrigin : void 0;
			const timestamp = typeof message.timestamp === "number" ? message.timestamp : typeof message.timestamp === "string" ? Date.parse(message.timestamp) : NaN;
			return !(typeof record.idempotencyKey === "string" && record.idempotencyKey.startsWith("codex-app-server:")) && mirrorOrigin !== "codex-app-server" && !(typeof mirrorIdentity === "string" && mirrorIdentity.startsWith("codex-app-server:")) && Number.isFinite(timestamp) && timestamp > (Number.isFinite(cutoff) ? cutoff : 0);
		});
	};
	const applyResumeStaleBindingContinuityProjection = (binding) => {
		const newerVisibleMessages = selectNewerVisibleHistoryAfterBinding(binding);
		if (newerVisibleMessages.length === 0) return false;
		const projection = projectContextEngineAssemblyForCodex({
			assembledMessages: newerVisibleMessages,
			originalHistoryMessages: historyState.messages,
			prompt: params.prompt,
			maxRenderedContextChars: codexContextProjectionMaxChars
		});
		promptState.promptText = projection.promptText;
		promptState.promptContextRange = projection.promptContextRange;
		promptState.prePromptMessageCount = projection.prePromptMessageCount;
		return true;
	};
	const precomputeNoContextEngineStaleBindingProjection = () => {
		promptState.precomputedStaleBindingContinuityProjectionApplied = false;
		promptState.staleBindingContinuityForcedFreshStart = false;
		const binding = mutable.startupBinding;
		if (activeContextEngine || !binding?.threadId || binding.pendingSupervisionBranch) return false;
		if (isInactiveThreadBootstrapBinding(binding)) {
			promptState.inactiveThreadBootstrapBindingForcedFreshStart = true;
			return false;
		}
		const projected = applyResumeStaleBindingContinuityProjection(binding);
		promptState.precomputedStaleBindingContinuityProjectionApplied = projected;
		return projected;
	};
	const applyNoContextEngineContinuityProjection = (action, binding) => {
		if (activeContextEngine || !historyState.messages.some((message) => message.role === "user")) return false;
		if (action === "resumed" && promptState.precomputedStaleBindingContinuityProjectionApplied) return true;
		if (action === "started" && promptState.staleBindingContinuityForcedFreshStart) return true;
		if (action === "started" && promptState.inactiveThreadBootstrapBindingForcedFreshStart) return false;
		if (action === "resumed" && binding) return applyResumeStaleBindingContinuityProjection(binding);
		if (action === "started") {
			applyFreshThreadContinuityProjection();
			return true;
		}
		return false;
	};
	if (precomputeNoContextEngineStaleBindingProjection()) await rebuildCodexPromptBuildFromCurrentProjection();
	const rotateStartupBindingForProjectedTurn = async () => {
		const binding = mutable.startupBinding;
		if (!binding?.threadId) return;
		const previousThreadId = binding.threadId;
		const hadInactiveThreadBootstrapBinding = isInactiveThreadBootstrapBinding(binding);
		const startupBindingResolution = await rotateOversizedCodexAppServerStartupBinding({
			binding,
			bindingStore,
			identity: bindingIdentity,
			sessionFile: params.sessionFile,
			agentDir,
			codexHome: appServer.start.env?.CODEX_HOME,
			config: params.config,
			contextEngineActive: Boolean(activeContextEngine),
			projectedTurnTokens: estimateCodexAppServerProjectedTurnTokens({
				prompt: turnState.codexTurnPromptText,
				developerInstructions: buildRenderedCodexDeveloperInstructions()
			})
		});
		mutable.startupBinding = startupBindingResolution.binding;
		mutable.startupContextTokens = startupBindingResolution.startupContextTokens;
		if (mutable.startupBinding?.threadId) return;
		promptState.inactiveThreadBootstrapBindingForcedFreshStart = hadInactiveThreadBootstrapBinding;
		promptState.staleBindingContinuityForcedFreshStart = promptState.precomputedStaleBindingContinuityProjectionApplied && !promptState.inactiveThreadBootstrapBindingForcedFreshStart;
		if (promptState.staleBindingContinuityForcedFreshStart) applyFreshThreadContinuityProjection();
		if (activeContextEngine) {
			promptState.contextEngineProjection = void 0;
			try {
				await applyActiveContextEngineProjection(void 0);
			} catch (assembleErr) {
				log.warn("context engine assemble failed; using Codex baseline prompt", { error: formatErrorMessage(assembleErr) });
			}
		}
		await rebuildCodexPromptBuildFromCurrentProjection();
		log.info("codex app-server rebuilt turn prompt after native thread rotation", {
			sessionId: params.sessionId,
			sessionKey: contextSessionKey,
			previousThreadId,
			promptChars: turnState.codexTurnPromptText.length,
			developerInstructionChars: buildRenderedCodexDeveloperInstructions()?.length ?? 0
		});
	};
	await rotateStartupBindingForProjectedTurn();
	return {
		context,
		codexModelInputHistoryMessages,
		turnState,
		buildRenderedCodexDeveloperInstructions,
		rebuildCodexTurnPromptTextFromCurrentProjection,
		applyNoContextEngineContinuityProjection,
		systemPromptReport: buildCodexSystemPromptReport({
			attempt: params,
			sessionKey: contextSessionKey,
			workspaceDir: effectiveWorkspace,
			developerInstructions: buildRenderedCodexDeveloperInstructions(),
			workspaceBootstrapContext,
			skillsPrompt: skillsCollaborationInstructions ? params.skillsSnapshot?.prompt ?? "" : "",
			tools: toolBridge.availableSpecs
		})
	};
}
//#endregion
//#region extensions/codex/src/app-server/hook-requester.ts
/** Rebuilds the host-proven requester identity shared by native and bridged tool hooks. */
function buildCodexHookRequester(params) {
	const channel = params.messageChannel ?? params.messageProvider;
	const requester = {
		...channel ? { channel } : {},
		...params.agentAccountId ? { accountId: params.agentAccountId } : {},
		...params.senderId ? { senderId: params.senderId } : {},
		...params.senderIsOwner !== void 0 ? { senderIsOwner: params.senderIsOwner } : {},
		...params.memberRoleIds?.length ? { roleIds: [...params.memberRoleIds] } : {}
	};
	return Object.keys(requester).length > 0 ? requester : void 0;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-resources.ts
function prepareCodexAttemptResources(prompt) {
	const { context, turnState, buildRenderedCodexDeveloperInstructions } = prompt;
	const { runtime, attemptTools } = context;
	const { connection, hookChannelId } = runtime;
	const { appServer, params, effectiveCwd, sessionAgentId, sandboxSessionKey, runAbortController, sandbox, options, nativeHookRelayEvents } = connection;
	const { toolBridge } = attemptTools;
	const hostTrajectoryRecorder = params.trajectoryRecorder;
	const trajectoryRecorder = createCodexTrajectoryRecorder({
		attempt: params,
		cwd: effectiveCwd,
		developerInstructions: buildRenderedCodexDeveloperInstructions(),
		prompt: turnState.codexTurnPromptText,
		trajectoryRecorder: hostTrajectoryRecorder,
		tools: toolBridge.availableSpecs,
		warn: (message, fields) => log.warn(message, fields)
	});
	const state = {
		client: void 0,
		thread: void 0,
		runtimeArtifact: void 0,
		turnRouter: void 0,
		turnRoute: void 0,
		routeActivated: false,
		detachRouteAbort: (() => void 0),
		trajectoryEndRecorded: false,
		nativeHookRelay: void 0,
		nativeSubagentMonitor: void 0,
		nativePreToolUseFailureFallbackActive: false,
		nativePreToolUseFailureFallbackTerminalReason: void 0,
		releaseSharedClientLease: void 0,
		startupClientUnsafe: false,
		sharedCodexClientRetiredForOneShotCleanup: false,
		sandboxExecEnvironmentAcquired: false,
		codexEnvironmentSelection: void 0,
		codexExecutionCwd: effectiveCwd,
		codexSandboxPolicy: void 0,
		restartContextEngineCodexThread: void 0
	};
	const pendingNativePreToolUseFailures = [];
	const projectorRef = {};
	const emitNativePreToolUseFailure = (failure) => {
		emitCodexNativePreToolUseFailureDiagnostic({
			agentId: sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: sandboxSessionKey,
			runId: params.runId,
			signal: runAbortController.signal,
			failure,
			...state.nativePreToolUseFailureFallbackActive ? { terminalReason: state.nativePreToolUseFailureFallbackTerminalReason ?? failure.disposition } : {}
		});
	};
	const flushPendingNativePreToolUseFailures = () => {
		for (const failure of pendingNativePreToolUseFailures.splice(0)) emitNativePreToolUseFailure(failure);
	};
	const activateNativePreToolUseFailureFallback = () => {
		if (!state.nativePreToolUseFailureFallbackActive) {
			state.nativePreToolUseFailureFallbackTerminalReason = runAbortController.signal.aborted ? resolveCodexToolAbortTerminalReason(runAbortController.signal) : void 0;
			state.nativePreToolUseFailureFallbackActive = true;
		}
		flushPendingNativePreToolUseFailures();
	};
	const releaseSharedClientLeaseOnce = () => {
		const release = state.releaseSharedClientLease;
		if (!release) return;
		state.releaseSharedClientLease = void 0;
		release();
	};
	const retireSharedCodexClientForOneShotCleanup = async () => {
		if (params.cleanupBundleMcpOnRunEnd !== true || state.sharedCodexClientRetiredForOneShotCleanup) return;
		state.sharedCodexClientRetiredForOneShotCleanup = true;
		const retired = clearSharedCodexAppServerClientIfCurrentAndUnclaimed(state.client);
		log.info("codex app-server one-shot cleanup checked shared client retirement", {
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			activeLeases: retired.activeLeases,
			pendingAcquires: retired.pendingAcquires,
			closed: retired.closed,
			matchedSharedClient: retired.found
		});
		if (retired.closed) await state.client.closeAndWait({
			exitTimeoutMs: 2e3,
			forceKillDelayMs: 250
		});
	};
	const releaseSharedClientLeaseAndRetireOneShotClient = async () => {
		releaseSharedClientLeaseOnce();
		await retireSharedCodexClientForOneShotCleanup();
	};
	const releaseSandboxExecEnvironment = async () => {
		if (state.sandboxExecEnvironmentAcquired) {
			state.sandboxExecEnvironmentAcquired = false;
			await releaseCodexSandboxExecServerEnvironment(sandbox);
		}
	};
	const runCleanupStep = (step, operation) => runAgentCleanupStep({
		runId: params.runId,
		sessionId: params.sessionId,
		step,
		log,
		cleanup: async () => {
			await operation();
		}
	});
	const unregisterNativeSubagentMonitor = () => {
		state.nativeSubagentMonitor?.unregister();
		state.nativeSubagentMonitor = void 0;
	};
	const registerNativeSubagentMonitor = (parentThreadId) => {
		unregisterNativeSubagentMonitor();
		state.nativeSubagentMonitor = codexNativeSubagentMonitorRuntime.register({
			client: state.client,
			parentThreadId,
			requesterSessionKey: params.sessionKey,
			taskRuntimeScope: params.agentHarnessTaskRuntimeScope,
			agentId: sessionAgentId,
			retainClient: () => retainSharedCodexAppServerClientIfCurrent(state.client),
			retainParentThread: (protectedThreadId) => protectCodexAppServerLiveThread(state.client, protectedThreadId),
			claimDirectChild: (childThreadId) => state.nativeHookRelay?.claimDirectChild(childThreadId),
			rejectPendingDirectChild: (childThreadId, reason) => state.nativeHookRelay?.rejectPendingDirectChild(childThreadId, reason)
		});
	};
	const releaseCurrentRoute = () => {
		state.detachRouteAbort();
		state.detachRouteAbort = () => void 0;
		state.turnRoute?.release();
		state.turnRoute = void 0;
		state.routeActivated = false;
		unregisterNativeSubagentMonitor();
	};
	const startupTimeoutMs = resolveCodexStartupTimeoutMs({
		timeoutMs: params.timeoutMs,
		timeoutFloorMs: options.startupTimeoutFloorMs
	});
	const requesterChannel = params.messageChannel ?? params.messageProvider;
	const requester = buildCodexHookRequester(params);
	const buildNativeHookRelayFinalConfigPatch = (decision) => {
		state.nativeHookRelay?.unregister();
		if (params.pluginHarnessToolPolicyRestricted === true) {
			state.nativeHookRelay = void 0;
			return {
				configPatch: buildCodexNativeHookRelayDisabledConfig(),
				nativeHookRelayGeneration: void 0
			};
		}
		state.nativeHookRelay = createCodexNativeHookRelay({
			options: options.nativeHookRelay,
			generation: decision.action === "resume" ? decision.binding.nativeHookRelayGeneration : void 0,
			generationMismatchGraceMs: decision.action === "resume" && !decision.binding.nativeHookRelayGeneration ? CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS : void 0,
			events: nativeHookRelayEvents,
			agentId: sessionAgentId,
			sessionId: params.sessionId,
			sessionKey: sandboxSessionKey,
			config: params.config,
			runId: params.runId,
			channelId: hookChannelId,
			...requester ? { requester } : {},
			approvalContext: {
				trigger: params.trigger,
				approvalReviewerDeviceId: params.approvalReviewerDeviceId,
				turnSourceChannel: requesterChannel,
				turnSourceTo: params.currentMessagingTarget ?? params.currentChannelId,
				turnSourceAccountId: params.agentAccountId,
				turnSourceThreadId: params.currentThreadTs
			},
			attemptTimeoutMs: params.timeoutMs,
			startupTimeoutMs,
			turnStartTimeoutMs: params.timeoutMs,
			loopDetectionPreToolUseRelay: appServer.loopDetectionPreToolUseRelay,
			signal: runAbortController.signal,
			hostCapabilities: params.hostCapabilities,
			onPreToolUseFailure: (failure) => {
				const projector = projectorRef.current;
				if (projector) projector.recordNativeToolPreToolUseFailure(failure);
				else if (state.nativePreToolUseFailureFallbackActive) emitNativePreToolUseFailure(failure);
				else pendingNativePreToolUseFailures.push(failure);
			}
		});
		return {
			configPatch: state.nativeHookRelay ? buildCodexNativeHookRelayConfig({
				relay: state.nativeHookRelay,
				events: nativeHookRelayEvents,
				hookTimeoutSec: options.nativeHookRelay?.hookTimeoutSec,
				loopDetectionPreToolUseRelay: appServer.loopDetectionPreToolUseRelay
			}) : options.nativeHookRelay?.enabled === false ? buildCodexNativeHookRelayDisabledConfig() : void 0,
			nativeHookRelayGeneration: state.nativeHookRelay?.generation
		};
	};
	return {
		prompt,
		trajectoryRecorder,
		state,
		projectorRef,
		pendingNativePreToolUseFailures,
		markTrajectoryEndRecorded: () => {
			state.trajectoryEndRecorded = true;
		},
		activateNativePreToolUseFailureFallback,
		releaseSharedClientLeaseOnce,
		releaseSharedClientLeaseAndRetireOneShotClient,
		releaseSandboxExecEnvironment,
		runCleanupStep,
		registerNativeSubagentMonitor,
		releaseCurrentRoute,
		startupTimeoutMs,
		buildNativeHookRelayFinalConfigPatch
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-route.ts
async function prepareCodexAttemptRoute(resources, turnRuntime, notifications, handleServerRequest) {
	const { prompt, state: resourceState, trajectoryRecorder, releaseCurrentRoute, registerNativeSubagentMonitor, activateNativePreToolUseFailureFallback, releaseSandboxExecEnvironment, releaseSharedClientLeaseOnce } = resources;
	const { connection } = prompt.context.runtime;
	const { params, runAbortController, abortFromUpstream } = connection;
	const { state, turnIdRef, completeTurn } = turnRuntime;
	const { noteNotificationReceived, enqueueNotification } = notifications;
	const attachRouteAbort = (route) => {
		const onAbort = () => {
			if (state.completed || state.terminalTurnNotificationQueued || runAbortController.signal.aborted) return;
			const reasonText = formatErrorMessage(route.signal.reason);
			const closedClient = reasonText.includes("turn router closed");
			const closeCause = route.signal.reason instanceof Error && route.signal.reason.cause instanceof Error ? route.signal.reason.cause : void 0;
			state.clientClosedPromptError = closedClient ? "codex app-server client closed before turn completed" : `codex app-server turn route closed before turn completed: ${reasonText}`;
			state.clientClosedDiagnostic = closedClient && closeCause ? formatErrorMessage(closeCause) : void 0;
			state.clientClosedAbort = closedClient;
			const activeTurnId = turnIdRef.current;
			if (activeTurnId) trajectoryRecorder?.recordEvent("turn.client_closed", {
				threadId: resourceState.thread.threadId,
				turnId: activeTurnId
			});
			log.warn(state.clientClosedPromptError, {
				threadId: resourceState.thread.threadId,
				turnId: activeTurnId,
				...state.clientClosedDiagnostic ? { transportError: state.clientClosedDiagnostic } : {}
			});
			runAbortController.abort(closedClient ? "client_closed" : "turn_route_closed");
			completeTurn();
		};
		route.signal.addEventListener("abort", onAbort, { once: true });
		if (route.signal.aborted) onAbort();
		return () => route.signal.removeEventListener("abort", onAbort);
	};
	const ensureCurrentThreadRoute = async () => {
		if (resourceState.turnRoute?.threadId !== resourceState.thread.threadId) {
			releaseCurrentRoute();
			resourceState.turnRoute = resourceState.turnRouter.reserveThread({ threadId: resourceState.thread.threadId });
		}
		if (!resourceState.turnRoute) throw new Error("codex app-server turn route was not reserved");
		if (!resourceState.routeActivated) {
			if (!resourceState.nativeSubagentMonitor) registerNativeSubagentMonitor(resourceState.thread.threadId);
			resourceState.detachRouteAbort = attachRouteAbort(resourceState.turnRoute);
			await resourceState.turnRoute.activate({
				onNotificationReceived: noteNotificationReceived,
				onNotification: enqueueNotification,
				onRequest: handleServerRequest
			});
			resourceState.routeActivated = true;
		}
		return resourceState.turnRoute;
	};
	try {
		await ensureCurrentThreadRoute();
	} catch (error) {
		activateNativePreToolUseFailureFallback();
		releaseCurrentRoute();
		resourceState.nativeHookRelay?.unregister();
		await releaseSandboxExecEnvironment();
		releaseSharedClientLeaseOnce();
		params.abortSignal?.removeEventListener("abort", abortFromUpstream);
		throw error;
	}
	return { ensureCurrentThreadRoute };
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-client-prewarm.ts
/** Starts the shared process while tools and prompt context are still being prepared. */
function prewarmCodexAttemptClient(params) {
	const { connection, authProfileStore, authBindingFingerprint } = params;
	const { appServer, attemptClientFactory, options, pluginConfig, runtimeArtifactRequest, startupAuthRequirement, startupClientAuthProfileId, startupPreparedAuth, agentDir, params: runParams, runAbortController } = connection;
	if (options.clientFactory || attemptClientFactory !== getLeasedSharedCodexAppServerClient || runtimeArtifactRequest) return;
	getSharedCodexAppServerClient({
		startOptions: appServer.start,
		pluginConfig,
		...startupPreparedAuth ? { preparedAuth: startupPreparedAuth } : { authProfileId: startupClientAuthProfileId },
		authRequirement: startupAuthRequirement,
		authProfileStore,
		authBindingFingerprint,
		agentDir,
		config: runParams.config,
		timeoutMs: appServer.requestTimeoutMs,
		abandonSignal: runAbortController.signal
	}).catch((error) => {
		log.debug("codex app-server client prewarm failed", { error });
	});
}
//#endregion
//#region extensions/codex/src/app-server/scheduled-app-authority.ts
const CODEX_SCHEDULED_APP_AUTHORITY_NAMESPACE = "codex.apps";
const CODEX_APPS_MCP_SERVER = "codex_apps";
const MCP_STATUS_PAGE_SIZE = 100;
const MCP_STATUS_MAX_PAGES = 100;
const CODEX_APP_AUTHORITY_CAPTURE_TIMEOUT_MS = 6e4;
const CODEX_APP_AUTHORITY_CAPTURE_MIN_TIMEOUT_MS = 100;
function resolveScheduledCodexAppCreatorCaptureDecision(params) {
	if (!params.appsMayBeVisible) return {
		required: false,
		supported: false
	};
	const unavailableReason = params.authenticatedScheduledMode ? "A scheduled Codex continuation cannot create new app-authorized automations. Recreate it from a fresh authenticated owner turn; no automation changes were saved." : params.usesSupervisionConnection ? "Codex apps are visible through a supervised connection that cannot capture creator authority. Use an isolated prepared-profile Codex creator turn; no automation changes were saved." : params.homeScope === "user" ? "Codex apps are visible through a user-home runtime that cannot capture isolated creator authority. Use an agent-scoped prepared-profile Codex creator turn; no automation changes were saved." : !params.hasPreparedAccountIdentity ? "Codex app authority requires a genuine ChatGPT account identity. Reauthenticate the selected Codex profile, then retry; no automation changes were saved." : void 0;
	return {
		required: true,
		supported: !unavailableReason,
		...unavailableReason ? { unavailableReason } : {}
	};
}
function readConnectorId(tool) {
	const meta = asOptionalRecord(asOptionalRecord(tool)?.["_meta"]);
	return normalizeOptionalString(meta?.connector_id) ?? normalizeOptionalString(meta?.connectorId);
}
function normalizeApprovalMode(value) {
	return value === "allow" || value === "deny" || value === "auto" || value === "ask" ? value : void 0;
}
function normalizeAppToolApprovalMode(value) {
	return value === "auto" || value === "prompt" || value === "writes" || value === "approve" ? value : void 0;
}
function defaultApprovalMode(entry) {
	return entry.destructiveApprovalMode ?? (entry.allowDestructiveActions ? "allow" : "deny");
}
function parseScheduledCodexAppAuthority(authority) {
	if (!authority || authority.runtimeId !== "codex") return;
	if (authority.version !== 1) throw new Error("Unsupported Codex scheduled authority version; reauthorize this automation.");
	if (authority.namespace !== CODEX_SCHEDULED_APP_AUTHORITY_NAMESPACE) throw new Error(`Unsupported Codex scheduled authority namespace ${authority.namespace}; reauthorize this automation.`);
	const payload = asOptionalRecord(authority.payload);
	const auth = asOptionalRecord(payload?.auth);
	const profileId = normalizeOptionalString(auth?.profileId);
	const accountId = normalizeOptionalString(auth?.accountId);
	if (payload?.version !== 1 || !profileId || !accountId || !Array.isArray(payload.apps)) throw new Error("Stored Codex app authority is invalid; reauthorize this automation.");
	const seen = /* @__PURE__ */ new Set();
	const apps = payload.apps.map((raw) => {
		const app = asOptionalRecord(raw);
		const id = normalizeOptionalString(app?.id);
		const destructiveApprovalMode = normalizeApprovalMode(app?.destructiveApprovalMode);
		const rawTools = asOptionalRecord(app?.tools);
		if (!id || seen.has(id) || typeof app?.allowDestructiveActions !== "boolean" || typeof app.allowOpenWorld !== "boolean" || !destructiveApprovalMode || !rawTools) throw new Error("Stored Codex app authority is invalid; reauthorize this automation.");
		seen.add(id);
		const tools = {};
		for (const [name, rawMode] of Object.entries(rawTools)) {
			const toolName = normalizeOptionalString(name);
			const mode = normalizeAppToolApprovalMode(rawMode);
			if (!toolName || !mode) throw new Error("Stored Codex app authority is invalid; reauthorize this automation.");
			tools[toolName] = mode;
		}
		return {
			id,
			allowDestructiveActions: app.allowDestructiveActions,
			allowOpenWorld: app.allowOpenWorld,
			destructiveApprovalMode,
			tools
		};
	});
	return {
		version: 1,
		auth: {
			profileId,
			accountId
		},
		apps
	};
}
async function readCodexScheduledAppToolNamesByApp(params) {
	const toolNamesByApp = /* @__PURE__ */ new Map();
	const seenCursors = /* @__PURE__ */ new Set();
	let cursor;
	for (let page = 0; page < MCP_STATUS_MAX_PAGES; page += 1) {
		const response = await params.request("mcpServerStatus/list", {
			...params.threadId ? { threadId: params.threadId } : {},
			detail: "toolsAndAuthOnly",
			limit: MCP_STATUS_PAGE_SIZE,
			...cursor ? { cursor } : {}
		});
		if (!isJsonObject(response) || !Array.isArray(response.data)) throw new Error("Codex mcpServerStatus/list returned invalid scheduled app inventory");
		for (const status of response.data) {
			if (!isJsonObject(status) || !isJsonObject(status.tools)) throw new Error("Codex scheduled app inventory contained an invalid server status");
			if (status.name !== CODEX_APPS_MCP_SERVER) continue;
			for (const [toolName, tool] of Object.entries(status.tools)) {
				const connectorId = readConnectorId(tool);
				if (connectorId) {
					const names = toolNamesByApp.get(connectorId) ?? /* @__PURE__ */ new Set();
					names.add(toolName);
					toolNamesByApp.set(connectorId, names);
				}
			}
		}
		if (response.nextCursor !== void 0 && response.nextCursor !== null && typeof response.nextCursor !== "string") throw new Error("Codex scheduled app inventory returned an invalid pagination cursor");
		cursor = response.nextCursor;
		if (!cursor) return toolNamesByApp;
		if (seenCursors.has(cursor)) throw new Error("Codex app connector inventory repeated its pagination cursor");
		seenCursors.add(cursor);
	}
	throw new Error("Codex app connector inventory exceeded its bounded page limit");
}
/** Reads the current account policy and connector-backed tool names under one caller deadline. */
async function readCurrentCodexScheduledAppPolicy$1(params) {
	const [configResponse, toolNamesByApp] = await Promise.all([params.request("config/read", {
		includeLayers: false,
		...params.configCwd ? { cwd: params.configCwd } : {}
	}), readCodexScheduledAppToolNamesByApp(params)]);
	if (!isJsonObject(configResponse)) throw new Error("Codex config/read returned an invalid scheduled app policy response");
	return {
		config: isJsonObject(configResponse.config) ? configResponse.config : {},
		toolNamesByApp
	};
}
function readToolApprovalMode(config, appId, toolName, fallback = "auto") {
	return normalizeAppToolApprovalMode(asOptionalRecord(asOptionalRecord(asOptionalRecord(asOptionalRecord(config.apps)?.[appId])?.tools)?.[toolName])?.approval_mode) ?? fallback;
}
/** Captures only apps callable on the exact active Codex client/thread. */
async function captureScheduledCodexAppAuthority(params) {
	const requestedTimeoutMs = params.timeoutMs ?? CODEX_APP_AUTHORITY_CAPTURE_TIMEOUT_MS;
	const timeoutMs = Math.min(CODEX_APP_AUTHORITY_CAPTURE_TIMEOUT_MS, Math.max(CODEX_APP_AUTHORITY_CAPTURE_MIN_TIMEOUT_MS, Number.isFinite(requestedTimeoutMs) ? Math.floor(requestedTimeoutMs) : CODEX_APP_AUTHORITY_CAPTURE_TIMEOUT_MS));
	const deadlineMs = Date.now() + timeoutMs;
	const boundedClient = { request: ((method, requestParams) => {
		const remainingTimeoutMs = deadlineMs - Date.now();
		if (remainingTimeoutMs <= 0) throw new CodexScheduledAppAuthorityCaptureTimeoutError();
		return params.client.request(method, requestParams, {
			timeoutMs: remainingTimeoutMs,
			signal: params.signal
		});
	}) };
	let installed;
	let currentPolicy;
	try {
		[installed, currentPolicy] = await withAbortableTimeout({
			promise: Promise.all([boundedClient.request("app/installed", {
				threadId: params.threadId,
				forceRefresh: false
			}), readCurrentCodexScheduledAppPolicy$1({
				request: (method, requestParams) => boundedClient.request(method, requestParams),
				threadId: params.threadId,
				configCwd: params.configCwd
			})]),
			timeoutMs,
			signal: params.signal,
			timeoutMessage: "Codex scheduled app authority capture deadline elapsed",
			createTimeoutError: () => new CodexScheduledAppAuthorityCaptureTimeoutError()
		});
	} catch (error) {
		if (params.signal?.aborted || !(error instanceof CodexScheduledAppAuthorityCaptureTimeoutError) && !isCodexAppServerRequestTimeoutError(error)) throw error;
		throw new Error(`Codex app authority capture exceeded its ${timeoutMs} ms total budget. No automation changes were saved; retry after Codex app inventory is responsive.`, { cause: error });
	}
	const callableIds = new Set(installed.apps.filter((app) => app.enabled && app.callable).map((app) => app.id));
	const apps = Object.entries(params.policyContext.apps).filter(([id]) => callableIds.has(id) && currentPolicy.toolNamesByApp.has(id)).map(([id, policy]) => ({
		id,
		allowDestructiveActions: policy.allowDestructiveActions,
		allowOpenWorld: policy.allowOpenWorld !== false,
		destructiveApprovalMode: defaultApprovalMode(policy),
		tools: Object.fromEntries([...currentPolicy.toolNamesByApp.get(id) ?? []].toSorted().map((toolName) => [toolName, readToolApprovalMode(currentPolicy.config, id, toolName, appApprovalCeiling(defaultApprovalMode(policy)))]))
	})).toSorted((left, right) => left.id.localeCompare(right.id));
	if (apps.length === 0) return;
	return {
		version: 1,
		runtimeId: "codex",
		namespace: CODEX_SCHEDULED_APP_AUTHORITY_NAMESPACE,
		payload: {
			version: 1,
			auth: {
				profileId: params.profileId,
				accountId: params.accountId
			},
			apps
		}
	};
}
var CodexScheduledAppAuthorityCaptureTimeoutError = class extends Error {
	constructor() {
		super("Codex scheduled app authority capture deadline elapsed");
		this.name = "CodexScheduledAppAuthorityCaptureTimeoutError";
	}
};
const APPROVAL_RANK = {
	deny: 0,
	ask: 1,
	auto: 2,
	allow: 3
};
function stricterApprovalMode(left, right) {
	return APPROVAL_RANK[left] <= APPROVAL_RANK[right] ? left : right;
}
function intersectToolApprovalMode(captured, current) {
	if (captured === current) return captured;
	if (captured === "prompt" || current === "prompt") return "prompt";
	if (captured === "approve") return current;
	if (current === "approve") return captured;
	return "prompt";
}
function appApprovalCeiling(mode) {
	if (mode === "allow") return "approve";
	return mode === "ask" ? "prompt" : "auto";
}
function stableStringify(value) {
	if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
	if (value && typeof value === "object") return `{${Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
	return JSON.stringify(value);
}
/** Intersects a stored app-ID cap with current policy without admitting new apps. */
function intersectCodexPluginThreadConfigWithScheduledAuthority(config, authority, currentPolicy = {
	config: {},
	toolNamesByApp: /* @__PURE__ */ new Map()
}) {
	const scheduled = parseScheduledCodexAppAuthority(authority);
	if (!scheduled) return config;
	const omittedAppIds = scheduled.apps.map((app) => app.id).filter((id) => {
		const currentTools = currentPolicy.toolNamesByApp.get(id);
		return !Object.hasOwn(config.policyContext.apps, id) || !currentTools || currentTools.size === 0;
	}).toSorted();
	if (omittedAppIds.length > 0) {
		const visibleIds = omittedAppIds.slice(0, 10).join(", ");
		const remaining = omittedAppIds.length - Math.min(omittedAppIds.length, 10);
		throw new AgentHarnessPreflightError(`Scheduled Codex apps are unavailable under the current policy or account: ${visibleIds}${remaining > 0 ? ` (and ${remaining} more)` : ""}. Restore access or reauthorize the automation from a fresh authenticated Codex owner turn.`);
	}
	const capturedById = new Map(scheduled.apps.map((app) => [app.id, app]));
	const apps = {};
	for (const [id, current] of Object.entries(config.policyContext.apps)) {
		const captured = capturedById.get(id);
		if (!captured) continue;
		apps[id] = {
			...current,
			allowDestructiveActions: current.allowDestructiveActions && captured.allowDestructiveActions,
			allowOpenWorld: current.allowOpenWorld !== false && captured.allowOpenWorld,
			destructiveApprovalMode: stricterApprovalMode(defaultApprovalMode(current), captured.destructiveApprovalMode)
		};
	}
	const policyContext = buildPluginAppPolicyContext(apps, Object.fromEntries(Object.entries(config.policyContext.pluginAppIds).map(([key, ids]) => [key, ids.filter((id) => Object.hasOwn(apps, id))]).filter(([, ids]) => ids.length > 0)));
	const configPatch = buildCodexPluginAppsConfigPatchFromPolicyContext(policyContext);
	const appsPatch = asOptionalRecord(configPatch.apps);
	for (const [appId, captured] of capturedById) {
		const appPatch = asOptionalRecord(appsPatch?.[appId]);
		if (!appPatch || !Object.hasOwn(apps, appId)) continue;
		const currentApp = apps[appId];
		if (!currentApp) continue;
		const storedAppCeiling = appApprovalCeiling(captured.destructiveApprovalMode);
		const currentAppCeiling = appApprovalCeiling(defaultApprovalMode(currentApp));
		const toolNames = currentPolicy.toolNamesByApp.get(appId) ?? /* @__PURE__ */ new Set();
		appPatch.tools = Object.fromEntries([...toolNames].toSorted().map((toolName) => {
			return [toolName, { approval_mode: intersectToolApprovalMode(intersectToolApprovalMode(captured.tools[toolName] ?? storedAppCeiling, storedAppCeiling), intersectToolApprovalMode(readToolApprovalMode(currentPolicy.config, appId, toolName, currentAppCeiling), currentAppCeiling)) }];
		}));
	}
	const fingerprint = crypto.createHash("sha256").update(stableStringify({
		version: 1,
		namespace: CODEX_SCHEDULED_APP_AUTHORITY_NAMESPACE,
		authority: scheduled,
		inputFingerprint: config.inputFingerprint,
		policyContext,
		configPatch
	})).digest("hex");
	return {
		...config,
		fingerprint,
		configPatch,
		provisionalAppIds: Object.keys(apps).toSorted(),
		policyContext
	};
}
function readScheduledCodexAppAuthorityAuth(authority) {
	return parseScheduledCodexAppAuthority(authority)?.auth;
}
function assertScheduledCodexAppAuthorityRuntime(connection, params) {
	const scheduledAuth = readScheduledCodexAppAuthorityAuth(params.scheduledRuntimeAuthority);
	if (!scheduledAuth) return;
	if (params.trigger !== "cron" || connection.usesSupervisionConnection || connection.appServer.start.homeScope === "user") throw new AgentHarnessPreflightError("This automation's Codex app authority requires an isolated scheduled prepared-profile runtime. Reauthorize it from a supported Codex creator turn.");
	const prepared = connection.startupPreparedAuth;
	if (prepared?.kind !== "profile" || prepared.profileId !== scheduledAuth.profileId || prepared.snapshot?.loginParams.type !== "chatgptAuthTokens" || prepared.snapshot.chatgptAccountId !== scheduledAuth.accountId) throw new AgentHarnessPreflightError(`This automation was authorized for Codex profile ${scheduledAuth.profileId}, but that exact prepared account is not active. Restore the profile or reauthorize the automation from a fresh owner turn.`);
}
function buildLegacyScheduledCodexAppRecoveryPrompt(params) {
	if (params.trigger !== "cron" || !params.scheduledRuntimeAuthorityRecoveryRequired || params.scheduledRuntimeAuthority) return;
	return "Scheduled Codex app access is unavailable because this automation predates runtime-specific app authority capture. Tell the operator to recreate or reauthorize it from a fresh authenticated Codex owner turn; do not claim an app action succeeded.";
}
/** Makes stored-cap identity part of thread reuse admission, including cap removal. */
function buildScheduledCodexAppAuthorityInputFingerprint(baseFingerprint, authority) {
	const scheduled = parseScheduledCodexAppAuthority(authority);
	if (!scheduled) return baseFingerprint;
	return crypto.createHash("sha256").update(stableStringify({
		version: 1,
		namespace: CODEX_SCHEDULED_APP_AUTHORITY_NAMESPACE,
		baseFingerprint,
		authority: scheduled
	})).digest("hex");
}
//#endregion
//#region extensions/codex/src/app-server/scheduled-configured-mcp-authority.ts
/** Limits fresh scheduled-authority capture to authenticated local durable operator turns. */
function canResolveScheduledConfiguredMcpCreatorAuthority(params) {
	return params.trigger === "user" && params.connectionClass === "local-loopback" && params.bindingKind === "session" && Boolean(params.bindingSessionKey) && !isIncognitoSessionKey(params.sessionKey) && !params.usesSupervisionConnection && !params.preservesNativeModel && (params.senderIsOwner === true || params.hasFreshCreatorAuthority === true) && !params.senderId && params.inputProvenance === void 0 && params.trustedInternalHandoff === void 0 && !params.spawnedBy && params.scheduledToolPolicy === void 0 && params.hasStaticConfiguredMcp;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-runtime.ts
function resolveCodexAttemptBundleManifestRegistry(preparedModelRuntime) {
	const metadataSnapshot = preparedModelRuntime?.metadataSnapshot;
	return metadataSnapshot?.pluginIds === void 0 ? metadataSnapshot?.manifestRegistry : void 0;
}
async function prepareCodexAttemptRuntime(connection) {
	const { params, pluginConfig, usesSupervisionConnection, appServer, startupAuthProfileId, startupPreparedAuth, startupClientAuthProfileId, agentDir, preDynamicStartupStages, effectiveWorkspace, contextSessionKey, sandboxSessionKey, sessionAgentId, sandbox, attemptClientFactory, runAbortController, activeContextEngine, mutable } = connection;
	const preparedAuthBinding = !usesSupervisionConnection && appServer.start.homeScope !== "user" && startupAuthProfileId ? await prepareCodexAppServerAuthBinding({
		authProfileId: startupAuthProfileId,
		authProfileStore: params.authProfileStore,
		agentDir,
		config: params.config
	}) : void 0;
	assertScheduledCodexAppAuthorityRuntime(connection, params);
	const attemptAuthProfileStore = preparedAuthBinding?.authProfileStore ?? params.authProfileStore;
	prewarmCodexAttemptClient({
		connection,
		authProfileStore: attemptAuthProfileStore,
		authBindingFingerprint: preparedAuthBinding?.fingerprint
	});
	const effectiveContextWindowInfo = usesSupervisionConnection ? void 0 : params.contextWindowInfo;
	const effectiveContextTokenBudget = usesSupervisionConnection ? void 0 : params.contextTokenBudget;
	const effectiveRuntimeProviderId = usesSupervisionConnection ? mutable.startupBinding?.modelProvider ?? "codex" : params.provider;
	const effectiveRuntimeModelId = usesSupervisionConnection ? mutable.startupBinding?.model ?? "codex-native" : params.modelId;
	const { authProfileId: _outerAuthProfileId, contextWindowInfo: _outerContextWindowInfo, contextTokenBudget: _outerContextTokenBudget, model: _outerModel, modelId: _outerModelId, provider: _outerProvider, runtimePlan: _outerRuntimePlan, requestedModelId: _outerRequestedModelId, fallbackReason: _outerFallbackReason, degradedReason: _outerDegradedReason, thinkLevel: _outerThinkLevel, fastMode: _outerFastMode, ...paramsWithoutOuterNativeOwnership } = params;
	const supervisedRuntimeModel = {
		id: effectiveRuntimeModelId,
		name: effectiveRuntimeModelId,
		provider: effectiveRuntimeProviderId,
		api: "openai-chatgpt-responses",
		reasoning: true,
		input: ["text", "image"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: void 0,
		maxTokens: void 0
	};
	const legacyScheduledAppRecoveryPrompt = buildLegacyScheduledCodexAppRecoveryPrompt(params);
	const runtimeParams = usesSupervisionConnection ? {
		...paramsWithoutOuterNativeOwnership,
		provider: "codex",
		modelId: effectiveRuntimeModelId,
		model: supervisedRuntimeModel,
		thinkLevel: _outerThinkLevel,
		fastMode: _outerFastMode,
		sessionKey: contextSessionKey
	} : {
		...params,
		authProfileStore: attemptAuthProfileStore,
		sessionKey: contextSessionKey,
		...legacyScheduledAppRecoveryPrompt ? { extraSystemPrompt: [params.extraSystemPrompt, legacyScheduledAppRecoveryPrompt].filter((value) => Boolean(value?.trim())).join("\n\n") } : {},
		...startupAuthProfileId ? { authProfileId: startupAuthProfileId } : {}
	};
	const activeSessionId = params.sessionId;
	const activeSessionFile = params.sessionFile;
	const buildActiveRunAttemptParams = () => ({
		...runtimeParams,
		sessionId: activeSessionId,
		sessionFile: activeSessionFile
	});
	const startupAuthAccountCacheKey = usesSupervisionConnection ? void 0 : startupPreparedAuth?.kind === "api-key" ? resolveCodexAppServerPreparedApiKeyCacheKey(startupPreparedAuth.apiKey) : startupPreparedAuth?.kind === "profile" ? startupPreparedAuth.snapshot?.secretFreeCacheKey : await resolveCodexAppServerAuthAccountCacheKey({
		authProfileId: startupAuthProfileId,
		authProfileStore: attemptAuthProfileStore,
		agentDir,
		config: params.config
	});
	const startupEnvApiKeyCacheKey = usesSupervisionConnection ? void 0 : startupPreparedAuth || startupAuthProfileId ? void 0 : resolveCodexAppServerFallbackApiKeyCacheKey({ startOptions: appServer.start });
	preDynamicStartupStages.mark("auth-cache");
	const codexMcpToolOverrides = resolveCodexMcpToolOverridesForAgent(params.config, {
		agentId: sessionAgentId,
		toolOverrides: params.toolOverrides
	});
	const bundleManifestRegistry = resolveCodexAttemptBundleManifestRegistry(params.preparedModelRuntime);
	const bundleMcpThreadConfig = await loadCodexBundleMcpThreadConfig({
		workspaceDir: effectiveWorkspace,
		cfg: params.config,
		toolsEnabled: usesSupervisionConnection || supportsModelTools(params.model),
		disableTools: params.disableTools,
		toolsAllow: params.toolsAllow,
		manifestRegistry: bundleManifestRegistry,
		toolOverrides: codexMcpToolOverrides
	});
	const authenticatedScheduledMode = params.trigger === "cron" && params.scheduledToolPolicy !== void 0 && Array.isArray(params.toolsAllow);
	const ownsScheduledConfiguredMcpSurface = authenticatedScheduledMode && (bundleMcpThreadConfig.staticServerNames.length > 0 || mutable.startupBinding?.configuredMcpOwnershipVersion === 1);
	const cronCreatorAuthorityCapability = params.cronCreatorAuthorityCapability;
	const hasFreshCreatorAuthority = cronCreatorAuthorityCapability?.active === true && cronCreatorAuthorityCapability.runId === params.runId && !cronCreatorAuthorityCapability.signal.aborted;
	const mayResolveScheduledConfiguredMcpCreatorAuthority = !authenticatedScheduledMode && canResolveScheduledConfiguredMcpCreatorAuthority({
		trigger: params.trigger,
		connectionClass: appServer.connectionClass,
		bindingKind: connection.bindingIdentity.kind,
		bindingSessionKey: connection.bindingIdentity.kind === "session" ? connection.bindingIdentity.sessionKey : void 0,
		sessionKey: params.sessionKey,
		usesSupervisionConnection,
		preservesNativeModel: mutable.startupBinding?.preserveNativeModel === true,
		senderIsOwner: params.senderIsOwner,
		hasFreshCreatorAuthority,
		senderId: params.senderId,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		spawnedBy: params.spawnedBy,
		scheduledToolPolicy: params.scheduledToolPolicy,
		hasStaticConfiguredMcp: bundleMcpThreadConfig.staticServerNames.length > 0
	});
	preDynamicStartupStages.mark("bundle-mcp");
	const sandboxExecServerEnabled = isCodexSandboxExecServerEnabled(pluginConfig, sandbox);
	const nativeToolSurfaceEnabled = shouldEnableCodexAppServerNativeToolSurface(runtimeParams, sandbox, {
		agentId: sessionAgentId,
		runtimeSessionKey: sandboxSessionKey,
		sandboxExecServerEnabled
	});
	preDynamicStartupStages.mark("native-tool-surface");
	const nativeProviderWebSearchSupport = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled
	}).kind === "native-hosted" ? await resolveCodexProviderWebSearchSupport({
		clientFactory: attemptClientFactory,
		appServer,
		authProfileId: startupClientAuthProfileId,
		preparedAuth: startupPreparedAuth,
		agentDir,
		config: params.config,
		modelProviderOverride: usesSupervisionConnection ? mutable.startupBinding?.modelProvider : resolveCodexAppServerThreadModelSelection({
			provider: params.provider,
			model: params.modelId,
			binding: mutable.startupBinding,
			authProfileId: startupAuthProfileId,
			authProfileStore: attemptAuthProfileStore,
			agentDir,
			config: params.config
		}).modelProvider,
		signal: runAbortController.signal
	}) : "unsupported";
	preDynamicStartupStages.mark("provider-capabilities");
	for (const diagnostic of bundleMcpThreadConfig.diagnostics) log.warn(`bundle-mcp: ${diagnostic.pluginId}: ${diagnostic.message}`);
	if (activeContextEngine) assertContextEngineHostSupport({
		contextEngine: activeContextEngine,
		operation: "agent-run",
		host: CODEX_APP_SERVER_CONTEXT_ENGINE_HOST
	});
	const hookChannelId = resolveCodexAppServerHookChannelId(params, sandboxSessionKey);
	preDynamicStartupStages.mark("context-engine-support");
	return {
		connection,
		preparedAuthBinding,
		runtimeParams,
		activeSessionId,
		activeSessionFile,
		buildActiveRunAttemptParams,
		attemptAuthProfileStore,
		effectiveContextWindowInfo,
		effectiveContextTokenBudget,
		effectiveRuntimeProviderId,
		effectiveRuntimeModelId,
		startupAuthAccountCacheKey,
		startupEnvApiKeyCacheKey,
		bundleMcpThreadConfig,
		bundleManifestRegistry,
		authenticatedScheduledMode,
		ownsScheduledConfiguredMcpSurface,
		canResolveScheduledConfiguredMcpCreatorAuthority: mayResolveScheduledConfiguredMcpCreatorAuthority,
		codexMcpToolOverrides,
		sandboxExecServerEnabled,
		nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport,
		hookChannelId
	};
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-result-projection.ts
/** Project one OpenClaw dynamic-tool response with its executed mutation identity. */
function recordCodexDynamicToolResult(projector, call, response, protocolResponse) {
	projector?.recordDynamicToolResult({
		callId: call.callId,
		tool: call.tool,
		asyncStarted: response.asyncStarted === true,
		terminalResolution: response.terminalResolution,
		success: protocolResponse.success,
		terminalType: response.diagnosticTerminalType ?? (protocolResponse.success ? "completed" : "error"),
		sideEffectEvidence: response.sideEffectEvidence === true || response.terminalResolution?.sideEffectEvidence === true,
		contentItems: protocolResponse.contentItems,
		details: response.transcriptDetails
	});
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-tools.ts
function toTranscriptToolResult(response) {
	const sanitized = sanitizeCodexToolResponse(response);
	const contentItems = Array.isArray(sanitized.contentItems) ? sanitized.contentItems : [];
	const result = {
		...sanitized,
		content: contentItems.map(toTranscriptToolResultContentItem)
	};
	delete result.contentItems;
	delete result.success;
	return result;
}
function toTranscriptToolResultContentItem(item) {
	if (!item || typeof item !== "object") return {
		type: "text",
		text: ""
	};
	const record = item;
	if (record.type === "inputText") return {
		type: "text",
		text: typeof record.text === "string" ? record.text : ""
	};
	if (record.type === "inputImage") return typeof record.imageUrl === "string" ? {
		type: "image",
		url: record.imageUrl
	} : {
		type: "text",
		text: formatUnsupportedCodexDynamicToolOutput(record.type)
	};
	return {
		type: "text",
		text: formatUnsupportedCodexDynamicToolOutput(record.type)
	};
}
function formatUnsupportedCodexDynamicToolOutput(type) {
	const rawType = typeof type === "string" ? type.replace(/\s+/g, " ").trim() : "";
	return `[Unsupported Codex dynamic tool output: ${rawType ? truncateUtf16Safe(rawType, 80) : "unknown"}${rawType.length > 80 ? "..." : ""}]`;
}
function createCodexDynamicToolExecutionRegistry() {
	const executions = /* @__PURE__ */ new Map();
	const keyFor = (call) => JSON.stringify([
		call.threadId,
		call.turnId,
		call.callId
	]);
	return {
		get(call) {
			return executions.get(keyFor(call));
		},
		claim(call, start) {
			const existing = executions.get(keyFor(call));
			if (existing) return {
				execution: existing,
				replayed: true
			};
			const execution = start();
			executions.set(keyFor(call), execution);
			return {
				execution,
				replayed: false
			};
		}
	};
}
function resolveCodexDynamicToolDirectNames(params, hostSystemAgentActive = false) {
	const names = [];
	if (hostSystemAgentActive && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow)) names.push("openclaw");
	if (params.sourceReplyDeliveryMode === "message_tool_only") names.push("message");
	if (params.pluginHarnessToolPolicyRestricted === true) names.push("update_plan");
	return names;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-server-requests.ts
function createCodexAttemptServerRequestController(resources, turnRuntime, lifecycle) {
	const { prompt, state: resourceState, projectorRef, trajectoryRecorder } = resources;
	const { context } = prompt;
	const { runtime, attemptTools } = context;
	const { connection } = runtime;
	const { params, computerUseConfig, runAbortController, appServer, approvalPolicyPromotedForOpenClawToolPolicy, sessionAgentId } = connection;
	const { toolBridge, toolOutcomeOrdinals, suppressedDynamicToolOutcomeOrdinals, allocateCodexToolOutcomeOrdinal } = attemptTools;
	const { state, turnIdRef, userInputBridgeRef, openClawDynamicToolExecutions, pendingOpenClawDynamicToolCompletionIds, postToolRawAssistantCompletionIdleTimeoutMs, turnWatches } = turnRuntime;
	const { emitExecutionPhaseOnce, scheduleTurnReleaseAfterTerminalDynamicTool, scheduleTerminalDynamicToolReleaseCheck } = lifecycle;
	const handleServerRequest = async (request, scope, requestSignal = new AbortController().signal) => {
		const signal = AbortSignal.any([runAbortController.signal, requestSignal]);
		const turnId = turnIdRef.current;
		const projector = projectorRef.current;
		let armCompletionWatchOnResponse = false;
		let requestCountsAsTurnActivity = false;
		let requestKeepsAttemptWatchArmed = false;
		const markCurrentTurnRequestProgress = (options) => {
			state.activeAppServerTurnRequests += 1;
			requestKeepsAttemptWatchArmed = options?.hasIndependentTimeout !== true;
			if (requestKeepsAttemptWatchArmed) state.activeAppServerTurnRequestsWithoutTimeout += 1;
			turnWatches.clearCompletionIdleTimer();
			turnWatches.disarmAssistantCompletionIdleWatch();
			requestCountsAsTurnActivity = true;
			turnWatches.touchActivity(`request:${request.method}:start`, { attemptProgress: true });
		};
		try {
			if (!turnId) return;
			if (request.method === "mcpServer/elicitation/request") {
				if (!scope.turnId || scope.turnId === turnId) {
					armCompletionWatchOnResponse = true;
					markCurrentTurnRequestProgress();
				}
				return await handleCodexAppServerElicitationRequest({
					requestParams: request.params,
					paramsForRun: params,
					threadId: resourceState.thread.threadId,
					turnId,
					pluginAppPolicyContext: resourceState.thread.pluginAppPolicyContext,
					...computerUseConfig.enabled ? { computerUseMcpServerName: computerUseConfig.mcpServerName } : {},
					signal
				});
			}
			if (request.method === "item/tool/requestUserInput") {
				if (scope.turnId === turnId) {
					armCompletionWatchOnResponse = true;
					markCurrentTurnRequestProgress();
				}
				return await userInputBridgeRef.current?.handleRequest({
					id: request.id,
					params: request.params
				});
			}
			if (request.method !== "item/tool/call") {
				if (isCodexAppServerApprovalRequest(request.method)) {
					if (scope.turnId === turnId) {
						armCompletionWatchOnResponse = true;
						markCurrentTurnRequestProgress();
					}
					return await handleCodexAppServerApprovalRequest({
						method: request.method,
						requestParams: request.params,
						paramsForRun: params,
						threadId: resourceState.thread.threadId,
						turnId,
						nativeHookRelay: resourceState.nativeHookRelay,
						autoApprove: shouldAutoApproveCodexAppServerApprovals(appServer),
						autoApproveOpenClawToolPolicy: approvalPolicyPromotedForOpenClawToolPolicy,
						signal,
						onNativeToolFailureDisposition: (itemId, disposition) => projector?.recordNativeToolApprovalFailure(itemId, disposition)
					});
				}
				return;
			}
			const call = readCodexDynamicToolCallParams(request.params);
			if (!call || call.threadId !== resourceState.thread.threadId || call.turnId !== turnId) return;
			const replayedExecution = openClawDynamicToolExecutions.get(call);
			if (replayedExecution) {
				armCompletionWatchOnResponse = true;
				markCurrentTurnRequestProgress({ hasIndependentTimeout: true });
				state.turnCrossedToolHandoff = true;
				return toCodexDynamicToolProtocolResponse(await replayedExecution);
			}
			const toolCallOrdinal = allocateCodexToolOutcomeOrdinal?.(call.callId);
			armCompletionWatchOnResponse = true;
			markCurrentTurnRequestProgress({ hasIndependentTimeout: true });
			state.turnCrossedToolHandoff = true;
			pendingOpenClawDynamicToolCompletionIds.add(call.callId);
			trajectoryRecorder?.recordEvent("tool.call", {
				threadId: call.threadId,
				turnId: call.turnId,
				toolCallId: call.callId,
				name: call.tool,
				arguments: call.arguments
			});
			projector?.recordDynamicToolCall({
				callId: call.callId,
				tool: call.tool,
				arguments: call.arguments
			});
			emitExecutionPhaseOnce(`tool:${call.callId}`, {
				phase: "tool_execution_started",
				tool: call.tool,
				toolCallId: call.callId
			});
			emitDynamicToolStartedDiagnostic({
				call,
				agentId: sessionAgentId,
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey
			});
			const toolMeta = inferCodexDynamicToolMeta(call, resolveCodexToolProgressDetailMode(params.toolProgressDetail));
			const toolArgs = sanitizeCodexToolArguments(call.arguments);
			const commandBearing = isCodexCommandBearingToolCall(call.tool, toolArgs);
			const shouldEmitDynamicToolProgress = shouldEmitTranscriptToolProgress(call.tool, toolArgs);
			if (shouldEmitDynamicToolProgress) emitCodexAppServerEvent(params, {
				stream: "tool",
				data: {
					phase: "start",
					name: call.tool,
					toolCallId: call.callId,
					...toolMeta ? { meta: toolMeta } : {},
					...toolArgs ? { args: toolArgs } : {},
					...commandBearing ? { commandBearing: true } : {}
				}
			});
			const dynamicToolTimeoutMs = resolveDynamicToolCallTimeoutMs({
				call,
				config: params.config
			});
			const toolStartedAt = Date.now();
			let terminalDiagnosticObserved = false;
			const unsubscribeToolDiagnosticObserver = onInternalDiagnosticEvent((event) => {
				if (isDynamicToolTerminalDiagnosticEvent(event) && isMatchingDynamicToolTerminalDiagnostic({
					event,
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				})) terminalDiagnosticObserved = true;
			});
			try {
				const { execution } = openClawDynamicToolExecutions.claim(call, () => handleDynamicToolCallWithTimeout({
					call,
					toolBridge,
					signal,
					timeoutMs: dynamicToolTimeoutMs,
					toolMeta,
					toolCallOrdinal,
					onAgentToolResult: params.onAgentToolResult,
					observeToolTerminal: params.observeToolTerminal,
					onFallbackSelected: () => {
						if (toolCallOrdinal !== void 0) suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
					},
					onTimeout: () => {
						trajectoryRecorder?.recordEvent("tool.timeout", {
							threadId: call.threadId,
							turnId: call.turnId,
							toolCallId: call.callId,
							name: call.tool,
							timeoutMs: dynamicToolTimeoutMs
						});
					}
				}));
				const response = await execution;
				const protocolResponse = toCodexDynamicToolProtocolResponse(response);
				if (!protocolResponse.success && toolCallOrdinal !== void 0) {
					suppressedDynamicToolOutcomeOrdinals.add(toolCallOrdinal);
					params.onToolOutcome?.({
						toolName: call.tool,
						argsHash: "",
						resultHash: "",
						toolCallOrdinal,
						terminalPresentation: void 0,
						presentationOnly: true
					});
				}
				const toolDurationMs = Math.max(0, Date.now() - toolStartedAt);
				trajectoryRecorder?.recordEvent("tool.result", {
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					name: call.tool,
					success: protocolResponse.success,
					contentItems: protocolResponse.contentItems
				});
				recordCodexDynamicToolResult(projector, call, response, protocolResponse);
				if (protocolResponse.success && call.tool === "update_plan") projector?.recordDynamicPlanUpdate(response.executedArguments ?? call.arguments);
				if (shouldEmitDynamicToolProgress) {
					const progressResponse = toCodexDynamicToolProgressResponse(response, protocolResponse);
					emitCodexAppServerEvent(params, {
						stream: "tool",
						data: {
							phase: "result",
							name: call.tool,
							toolCallId: call.callId,
							...toolMeta ? { meta: toolMeta } : {},
							...commandBearing ? { commandBearing: true } : {},
							isError: !protocolResponse.success,
							result: toTranscriptToolResult(progressResponse)
						}
					});
				}
				if (!terminalDiagnosticObserved && !hasPendingDynamicToolTerminalDiagnostic({
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				})) emitDynamicToolTerminalDiagnostic({
					response,
					call,
					agentId: sessionAgentId,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					durationMs: toolDurationMs
				});
				pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
				if (response.terminate === true && response.success) scheduleTurnReleaseAfterTerminalDynamicTool({
					call,
					response,
					durationMs: toolDurationMs
				});
				else if (!shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response)) scheduleTerminalDynamicToolReleaseCheck();
				else {
					state.currentTurnHadNonTerminalDynamicToolResult = true;
					state.pendingTerminalDynamicToolRelease = void 0;
				}
				return protocolResponse;
			} catch (error) {
				pendingOpenClawDynamicToolCompletionIds.delete(call.callId);
				if (!terminalDiagnosticObserved && !hasPendingDynamicToolTerminalDiagnostic({
					call,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey
				})) emitDynamicToolErrorDiagnostic({
					call,
					agentId: sessionAgentId,
					runId: params.runId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					durationMs: Math.max(0, Date.now() - toolStartedAt)
				});
				throw error;
			} finally {
				toolOutcomeOrdinals.delete(call.callId);
				unsubscribeToolDiagnosticObserver();
			}
		} finally {
			if (requestCountsAsTurnActivity) {
				state.activeAppServerTurnRequests = Math.max(0, state.activeAppServerTurnRequests - 1);
				if (requestKeepsAttemptWatchArmed) state.activeAppServerTurnRequestsWithoutTimeout = Math.max(0, state.activeAppServerTurnRequestsWithoutTimeout - 1);
				const postToolContinuationTimeoutMs = request.method === "item/tool/call" && state.turnCrossedToolHandoff ? postToolRawAssistantCompletionIdleTimeoutMs : void 0;
				turnWatches.touchActivity(`request:${request.method}:response`, {
					arm: armCompletionWatchOnResponse,
					attemptProgress: true,
					...postToolContinuationTimeoutMs !== void 0 ? { attemptTimeoutMs: postToolContinuationTimeoutMs } : {}
				});
				if (armCompletionWatchOnResponse && postToolContinuationTimeoutMs !== void 0) turnWatches.armCompletionIdleWatch({ timeoutMs: postToolContinuationTimeoutMs });
				scheduleTerminalDynamicToolReleaseCheck();
			} else turnWatches.scheduleProgressWatches();
		}
	};
	return { handleServerRequest };
}
//#endregion
//#region extensions/codex/src/app-server/computer-use-health.ts
const COMPUTER_USE_HEALTH_MONITOR_STATE = Symbol.for("openclaw.codexComputerUseHealthMonitorState");
function getComputerUseHealthMonitorState() {
	const globalState = globalThis;
	globalState[COMPUTER_USE_HEALTH_MONITOR_STATE] ??= { monitors: /* @__PURE__ */ new WeakMap() };
	return globalState[COMPUTER_USE_HEALTH_MONITOR_STATE];
}
function startCodexComputerUseHealthMonitor(params) {
	const state = getComputerUseHealthMonitorState();
	const existing = state.monitors.get(params.client);
	if (!params.config.enabled || !params.config.healthCheckEnabled) {
		if (existing) clearComputerUseHealthMonitor(params.client, existing);
		return {
			started: false,
			reason: params.config.enabled ? "health_disabled" : "disabled"
		};
	}
	const fingerprint = buildComputerUseHealthMonitorFingerprint(params.config);
	const intervalMs = params.config.healthCheckIntervalMinutes * 6e4;
	if (existing?.fingerprint === fingerprint && existing.repairComputerUseMcpChildren === params.repairComputerUseMcpChildren) return {
		started: false,
		intervalMs,
		reason: "already_started"
	};
	if (existing) clearComputerUseHealthMonitor(params.client, existing);
	const repairComputerUseMcpChildren = params.repairComputerUseMcpChildren ?? (() => killStaleComputerUseMcpChildren({ ancestorPid: params.client.getTransportPid() }));
	const monitor = {
		fingerprint,
		intervalMs,
		repairComputerUseMcpChildren: params.repairComputerUseMcpChildren,
		timer: setInterval(() => {
			runCodexComputerUseHealthProbe(params.client, params.config, monitor, { repairComputerUseMcpChildren });
		}, intervalMs),
		disposeCloseHandler: () => void 0,
		running: false
	};
	monitor.timer.unref?.();
	monitor.disposeCloseHandler = params.client.addCloseHandler((client) => {
		const active = state.monitors.get(client);
		if (active) clearComputerUseHealthMonitor(client, active);
	});
	state.monitors.set(params.client, monitor);
	return {
		started: true,
		intervalMs
	};
}
function buildComputerUseHealthMonitorFingerprint(config) {
	return JSON.stringify({
		autoRepair: config.autoRepair,
		healthCheckIntervalMinutes: config.healthCheckIntervalMinutes,
		liveTestTimeoutMs: config.liveTestTimeoutMs,
		mcpServerName: config.mcpServerName,
		toolCallTimeoutMs: config.toolCallTimeoutMs
	});
}
async function runCodexComputerUseHealthProbe(client, config, monitor, options) {
	if (monitor.running) return;
	monitor.running = true;
	try {
		const { liveTest, repair } = await runCodexComputerUseLiveTest({
			config,
			repairComputerUseMcpChildren: options.repairComputerUseMcpChildren,
			request: async (method, requestParams, requestOptions) => await client.request(method, requestParams, { timeoutMs: requestOptions?.timeoutMs ?? config.liveTestTimeoutMs })
		});
		if (!liveTest.ok) {
			log.warn("codex computer-use periodic health failed", {
				mcpServerName: config.mcpServerName,
				attempts: liveTest.attempts,
				timeoutMs: liveTest.timeoutMs,
				error: liveTest.error,
				repair
			});
			return;
		}
		if (repair?.killedPids.length) log.info("codex computer-use periodic health repaired stale children", {
			mcpServerName: config.mcpServerName,
			killedPids: repair.killedPids
		});
	} catch (error) {
		log.warn("codex computer-use periodic health probe crashed", {
			mcpServerName: config.mcpServerName,
			error: error instanceof Error ? error.message : String(error)
		});
	} finally {
		monitor.running = false;
	}
}
function clearComputerUseHealthMonitor(client, monitor) {
	clearInterval(monitor.timer);
	monitor.disposeCloseHandler();
	getComputerUseHealthMonitorState().monitors.delete(client);
}
//#endregion
//#region extensions/codex/src/app-server/plugin-thread-config-deadline.ts
/** Enforces one bounded startup budget across Codex plugin config discovery. */
const CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS = 6e4;
const CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR = 4;
const CODEX_PLUGIN_THREAD_CONFIG_MIN_TIMEOUT_MS = 100;
var CodexPluginThreadConfigDeadlineError = class extends Error {
	constructor() {
		super("Codex plugin thread config deadline elapsed");
		this.name = "CodexPluginThreadConfigDeadlineError";
	}
};
/** Resolves the plugin policy state reused throughout app-server startup. */
function resolveCodexPluginThreadConfigStartupPolicy(params) {
	const pluginThreadConfigRequired = Boolean(params.scheduledRuntimeAuthority) || !params.nativeToolSurfaceEnabled || shouldBuildCodexPluginThreadConfig(params.pluginConfig);
	const pluginThreadConfigPluginConfig = params.nativeToolSurfaceEnabled || params.scheduledRuntimeAuthority ? params.pluginConfig : disableCodexPluginThreadConfig(params.pluginConfig);
	const resolvedPluginPolicy = pluginThreadConfigRequired ? resolveCodexPluginsPolicy(pluginThreadConfigPluginConfig) : void 0;
	return {
		pluginThreadConfigRequired,
		pluginThreadConfigPluginConfig,
		resolvedPluginPolicy,
		enabledPluginConfigKeys: resolvedPluginPolicy ? resolvedPluginPolicy.pluginPolicies.filter((plugin) => plugin.enabled).map((plugin) => plugin.configKey).toSorted() : void 0
	};
}
/** Builds plugin config without allowing sequential RPC timeouts to consume the turn. */
async function buildCodexPluginThreadConfigWithinDeadline(params) {
	const { requestTimeoutMs, signal, request, failClosedOnTimeout, transform, ...buildParams } = params;
	const timeoutMs = resolveCodexPluginThreadConfigTimeoutMs(requestTimeoutMs);
	const deadlineMs = Date.now() + timeoutMs;
	const boundedRequest = (method, requestParams) => {
		const remainingTimeoutMs = deadlineMs - Date.now();
		if (remainingTimeoutMs <= 0) throw new CodexPluginThreadConfigDeadlineError();
		return request(method, requestParams, {
			timeoutMs: remainingTimeoutMs,
			signal
		});
	};
	try {
		return await withAbortableTimeout({
			signal,
			timeoutMs,
			promise: (async () => {
				const config = await buildCodexPluginThreadConfig({
					...buildParams,
					request: boundedRequest
				});
				return transform ? await transform(config, boundedRequest) : config;
			})(),
			timeoutMessage: "Codex plugin thread config deadline elapsed",
			createTimeoutError: () => new CodexPluginThreadConfigDeadlineError()
		});
	} catch (error) {
		if (signal.aborted || !isCodexPluginThreadConfigTimeoutError(error)) throw error;
		if (failClosedOnTimeout) throw new AgentHarnessPreflightError(`Scheduled Codex app policy verification exceeded its ${timeoutMs} ms startup budget. No app tools were executed. Retry after Codex app inventory is responsive, or reauthorize the automation.`);
		return buildCodexPluginThreadConfigTimeoutFallback({
			pluginConfig: buildParams.pluginConfig,
			appCacheKey: buildParams.appCacheKey,
			message: `Codex plugin discovery exceeded its ${timeoutMs} ms startup budget; plugin apps were disabled for this turn.`
		});
	}
}
/** Creates the recovery metadata and bounded builder used by thread startup. */
function createCodexPluginThreadConfigStartupProvider(params) {
	const { client, policy, inputFingerprint, enabledPluginConfigKeys, appCache, metadataCache: configuredMetadataCache, ...buildParams } = params;
	const metadataCache = configuredMetadataCache ?? defaultCodexPluginMetadataCache;
	return {
		enabled: true,
		requiresCurrentPolicyCheck: Boolean(params.scheduledRuntimeAuthority),
		inputFingerprint,
		enabledPluginConfigKeys,
		accountAppRecoveryEnabled: policy?.allowAllPlugins,
		recoverablePluginConfigKeys: policy ? resolveRecoverableCodexPluginConfigKeys({
			policy,
			metadataCache,
			appCacheKey: params.appCacheKey,
			configCwd: params.configCwd
		}) : void 0,
		build: async (buildOptions) => {
			const config = await buildCodexPluginThreadConfigWithinDeadline({
				...buildParams,
				appCache: appCache ?? defaultCodexAppInventoryCache,
				metadataCache,
				failClosedOnTimeout: Boolean(params.scheduledRuntimeAuthority),
				transform: params.scheduledRuntimeAuthority ? async (builtConfig, request) => intersectCodexPluginThreadConfigWithScheduledAuthority(builtConfig, params.scheduledRuntimeAuthority, await readCurrentCodexScheduledAppPolicy(request, params.configCwd, buildOptions?.threadId)) : void 0,
				request: (method, requestParams, options) => client.request(method, requestParams, options)
			});
			return params.scheduledRuntimeAuthority && params.inputFingerprint ? {
				...config,
				inputFingerprint: params.inputFingerprint
			} : config;
		}
	};
}
async function readCurrentCodexScheduledAppPolicy(request, cwd, threadId) {
	return await readCurrentCodexScheduledAppPolicy$1({
		request,
		configCwd: cwd,
		threadId
	});
}
function resolveCodexPluginThreadConfigTimeoutMs(requestTimeoutMs) {
	return Math.min(CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS, Math.max(CODEX_PLUGIN_THREAD_CONFIG_MIN_TIMEOUT_MS, Math.floor((Number.isFinite(requestTimeoutMs) && requestTimeoutMs > 0 ? requestTimeoutMs : CODEX_PLUGIN_THREAD_CONFIG_MAX_TIMEOUT_MS * CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR) / CODEX_PLUGIN_THREAD_CONFIG_TIMEOUT_DIVISOR)));
}
function isCodexPluginThreadConfigTimeoutError(error) {
	return error instanceof CodexPluginThreadConfigDeadlineError || error instanceof Error && "code" in error && error.code === "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED" && error.message.endsWith(" timed out");
}
//#endregion
//#region extensions/codex/src/app-server/attempt-startup.ts
/**
* Startup orchestration for Codex app-server attempts, including shared-client
* leasing, plugin thread config, sandbox environment, and thread lifecycle binding.
*/
const CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS = 3;
const CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED = "CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED";
/** True when a pre-write context restart must replay on the newly selected owner. */
function isCodexContextRestartSelectionChangedError(error) {
	return error instanceof Error && "code" in error && error.code === CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED;
}
/**
* Starts or resumes the Codex app-server thread and returns the resources the
* run loop must later release.
*/
async function startCodexAttemptThread(params) {
	let pluginAppServer = params.appServer;
	const startupRuntimeAuthProfileId = params.startupPreparedAuth?.kind === "profile" ? params.startupPreparedAuth.profileId : params.startupAuthProfileId ?? void 0;
	const startupRuntimeAuthProfileStore = params.startupPreparedAuth?.kind === "profile" ? params.startupPreparedAuth.store : void 0;
	let releaseSharedClientLease;
	let startupClientForAbandonedRequestCleanup;
	let releaseStartupResourcesOnTimeout;
	let startupAbandoned = false;
	const startupAbandonController = new AbortController();
	const abandonStartupAcquire = () => startupAbandonController.abort();
	params.signal.addEventListener("abort", abandonStartupAcquire, { once: true });
	try {
		const startupResult = await withCodexStartupTimeout({
			timeoutMs: params.startupTimeoutMs,
			signal: params.signal,
			onTimeout: async () => {
				startupAbandoned = true;
				startupAbandonController.abort();
				await params.onStartupTimeout();
				await releaseStartupResourcesOnTimeout?.();
				releaseSharedClientLease?.();
				releaseSharedClientLease = void 0;
				await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
				startupClientForAbandonedRequestCleanup = void 0;
			},
			operation: async () => {
				const threadConfig = mergeCodexThreadConfigs(params.configuredMcpOwnershipVersion === 1 ? void 0 : params.bundleMcpThreadConfig?.configPatch);
				const { pluginThreadConfigRequired, pluginThreadConfigPluginConfig, resolvedPluginPolicy, enabledPluginConfigKeys } = resolveCodexPluginThreadConfigStartupPolicy({
					pluginConfig: params.pluginConfig,
					nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
					scheduledRuntimeAuthority: params.buildAttemptParams().scheduledRuntimeAuthority
				});
				const computerUseMcpElicitationDelegationRequired = params.computerUseConfig.enabled;
				pluginAppServer = resolvedPluginPolicy?.enabled === true || computerUseMcpElicitationDelegationRequired ? {
					...params.appServer,
					approvalPolicy: withMcpElicitationsApprovalPolicy(params.appServer.approvalPolicy)
				} : params.appServer;
				let attemptedClient;
				const startupAttempt = async () => {
					let startupClientLease;
					let startupClient;
					let startupAttemptError;
					let startupAttemptSucceeded = false;
					try {
						const attemptParams = params.buildAttemptParams();
						startupClient = await params.attemptClientFactory({
							startOptions: params.appServer.start,
							pluginConfig: params.pluginConfig,
							...params.startupPreparedAuth ? { preparedAuth: params.startupPreparedAuth } : { authProfileId: params.startupAuthProfileId },
							authRequirement: params.startupAuthRequirement,
							authProfileStore: attemptParams.authProfileStore,
							authBindingFingerprint: params.startupAuthBindingFingerprint,
							...params.runtimeArtifactRequest ? {
								runtimeArtifactMode: "capture",
								...params.runtimeArtifactRequest.expected ? { expectedRuntimeArtifact: params.runtimeArtifactRequest.expected } : {}
							} : {},
							agentId: params.sessionAgentId,
							agentDir: params.agentDir,
							config: params.config,
							onStartedClient: (client) => {
								startupClientForAbandonedRequestCleanup = client;
								if (startupAbandoned || startupAbandonController.signal.aborted) closeCodexStartupClientBestEffort(client);
							},
							abandonSignal: startupAbandonController.signal,
							timeoutMs: params.appServer.requestTimeoutMs
						});
						const activeStartupClient = startupClient;
						let startupClientLeaseReleased = false;
						startupClientLease = () => {
							if (startupClientLeaseReleased) return;
							startupClientLeaseReleased = true;
							releaseLeasedSharedCodexAppServerClient(activeStartupClient);
						};
						releaseSharedClientLease = startupClientLease;
						attemptedClient = activeStartupClient;
						startupClientForAbandonedRequestCleanup = activeStartupClient;
						if (startupAbandoned) throw new CodexAppServerStartupError("timed_out");
						if (startupAbandonController.signal.aborted) throw new CodexAppServerStartupError("aborted");
						let runtimeArtifact;
						if (params.runtimeArtifactRequest) {
							const { readCodexAppServerClientRuntimeArtifact, validateCodexAppServerRuntimeArtifact } = await import("../../runtime-artifact-DJdhMXoL.js");
							runtimeArtifact = readCodexAppServerClientRuntimeArtifact(activeStartupClient);
							const expected = params.runtimeArtifactRequest.expected;
							const matchesExpected = !expected || Boolean(runtimeArtifact && runtimeArtifact.id === expected.id && runtimeArtifact.fingerprint === expected.fingerprint);
							if (!runtimeArtifact || !matchesExpected || !await validateCodexAppServerRuntimeArtifact(runtimeArtifact, startupAbandonController.signal)) {
								retireSharedCodexAppServerClientIfCurrent(activeStartupClient);
								throw new Error(expected ? "Codex app-server runtime artifact does not match verified inference" : "Codex app-server runtime artifact is unavailable or stale");
							}
						}
						ensureCodexAppServerClientRuntime(activeStartupClient, {
							agentDir: params.agentDir,
							authProfileId: startupRuntimeAuthProfileId,
							authMode: params.startupPreparedAuth?.kind === "api-key" ? "prepared-api-key" : "profile",
							authProfileStore: startupRuntimeAuthProfileStore ?? attemptParams.authProfileStore,
							config: params.config
						});
						const turnRouter = getCodexAppServerTurnRouter(activeStartupClient);
						try {
							await ensureCodexComputerUse({
								client: activeStartupClient,
								pluginConfig: params.pluginConfig,
								config: params.config,
								agentDir: params.agentDir,
								timeoutMs: params.appServer.requestTimeoutMs,
								signal: startupAbandonController.signal
							});
						} catch (error) {
							if (startupAbandonController.signal.aborted) throw error;
							throw new AgentHarnessPreflightError(`Codex Computer Use readiness failed: ${formatErrorMessage(error)}`, {
								cause: error,
								scope: "harness"
							});
						}
						const startupRuntimeIdentity = activeStartupClient.getRuntimeIdentity();
						const pluginAppCacheKey = buildCodexPluginAppCacheKey({
							appServer: params.appServer,
							agentDir: params.agentDir,
							authProfileId: startupRuntimeAuthProfileId,
							accountId: params.startupAuthAccountCacheKey,
							envApiKeyFingerprint: params.startupEnvApiKeyCacheKey,
							appServerVersion: activeStartupClient.getServerVersion(),
							runtimeIdentity: startupRuntimeIdentity
						});
						const appServerRuntimeFingerprint = buildCodexAppServerRuntimeFingerprint({
							appServer: params.appServer,
							appServerVersion: activeStartupClient.getServerVersion(),
							runtimeIdentity: startupRuntimeIdentity
						});
						const basePluginThreadConfigInputFingerprint = pluginThreadConfigRequired ? buildCodexPluginThreadConfigInputFingerprint({
							pluginConfig: pluginThreadConfigPluginConfig,
							appCacheKey: pluginAppCacheKey
						}) : void 0;
						const pluginThreadConfigInputFingerprint = basePluginThreadConfigInputFingerprint ? buildScheduledCodexAppAuthorityInputFingerprint(basePluginThreadConfigInputFingerprint, attemptParams.scheduledRuntimeAuthority) : void 0;
						log.debug("codex plugin thread config eligibility", buildCodexPluginThreadConfigEligibilityLogData({
							sessionId: attemptParams.sessionId,
							sessionKey: attemptParams.sessionKey ?? "",
							pluginThreadConfigRequired,
							resolvedPluginPolicy,
							enabledPluginConfigKeys,
							pluginAppCacheKey,
							startupAuthProfileId: startupRuntimeAuthProfileId,
							appServer: params.appServer
						}));
						let startupSandboxEnvironment;
						let startupSandboxEnvironmentAcquired = false;
						const releaseStartupSandboxEnvironment = async () => {
							if (startupSandboxEnvironmentAcquired) {
								startupSandboxEnvironmentAcquired = false;
								await releaseCodexSandboxExecServerEnvironment(params.sandbox);
							}
						};
						releaseStartupResourcesOnTimeout = releaseStartupSandboxEnvironment;
						try {
							const sandboxEnvironmentRequired = shouldRequireCodexSandboxExecServerEnvironment({
								sandbox: params.sandbox,
								nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
								sandboxExecServerEnabled: params.sandboxExecServerEnabled
							});
							startupSandboxEnvironment = sandboxEnvironmentRequired ? await ensureCodexSandboxExecServerEnvironment({
								client: activeStartupClient,
								sandbox: params.sandbox ?? null,
								appServerStartOptions: params.appServer.start,
								timeoutMs: params.appServer.requestTimeoutMs,
								signal: startupAbandonController.signal
							}) : void 0;
							startupSandboxEnvironmentAcquired = Boolean(startupSandboxEnvironment);
							if (startupAbandonController.signal.aborted) {
								await releaseStartupSandboxEnvironment();
								throw new CodexAppServerStartupError("aborted");
							}
							if (sandboxEnvironmentRequired && !startupSandboxEnvironment) throw new Error("Codex app-server did not register an OpenClaw sandbox exec-server environment.");
						} catch (error) {
							await releaseStartupSandboxEnvironment();
							throw error;
						}
						const startupEnvironmentSelection = resolveCodexSandboxEnvironmentSelection(startupSandboxEnvironment, params.nativeToolSurfaceEnabled);
						const startupExecutionCwd = resolveCodexAppServerExecutionCwd({
							effectiveCwd: params.effectiveCwd,
							localWorkspaceRoot: params.effectiveWorkspace,
							environment: startupSandboxEnvironment,
							nativeToolSurfaceEnabled: params.nativeToolSurfaceEnabled,
							remoteWorkspaceRoot: params.appServer.remoteWorkspaceRoot
						});
						const startupSandboxPolicy = startupSandboxEnvironment ? resolveCodexExternalSandboxPolicyForOpenClawSandbox(params.sandbox) : void 0;
						let startupReservation;
						const releaseStartupReservation = () => {
							startupReservation?.release();
							startupReservation = void 0;
						};
						const reserveStartupThread = (threadId) => {
							if (startupReservation) {
								if (startupReservation.threadId !== threadId) throw new Error(`codex app-server reserved ${startupReservation.threadId} but started ${threadId}`);
								return { release: releaseStartupReservation };
							}
							startupReservation = turnRouter.reserveThread({ threadId });
							return { release: releaseStartupReservation };
						};
						const releaseStartupResources = async () => {
							releaseStartupReservation();
							await releaseStartupSandboxEnvironment();
						};
						releaseStartupResourcesOnTimeout = releaseStartupResources;
						const buildThreadLifecycleParams = (signal, reserveResumeThread) => ({
							client: activeStartupClient,
							reserveResumeThread,
							bindingStore: params.bindingStore,
							params: params.buildAttemptParams(),
							agentId: params.sessionAgentId,
							cwd: startupExecutionCwd,
							dynamicTools: params.dynamicTools,
							persistentWebSearchAllowed: params.persistentWebSearchAllowed,
							webSearchAllowed: params.webSearchAllowed,
							appServer: pluginAppServer,
							developerInstructions: params.developerInstructions,
							config: threadConfig,
							finalConfigPatch: params.finalConfigPatch,
							buildFinalConfigPatch: params.buildFinalConfigPatch,
							nativeHookRelayGeneration: params.nativeHookRelayGeneration,
							nativeCodeModeEnabled: params.nativeToolSurfaceEnabled,
							nativeProviderWebSearchSupport: params.nativeProviderWebSearchSupport,
							nativeCodeModeOnlyEnabled: params.appServer.codeModeOnly,
							userMcpServersEnabled: params.configuredMcpOwnershipVersion === 1 ? false : params.nativeToolSurfaceEnabled,
							mcpServersFingerprint: params.configuredMcpOwnershipVersion === 1 ? void 0 : params.bundleMcpThreadConfig.fingerprint,
							mcpServersFingerprintEvaluated: params.configuredMcpOwnershipVersion === 1 || params.bundleMcpThreadConfig.evaluated,
							configuredMcpOwnershipVersion: params.configuredMcpOwnershipVersion,
							environmentSelection: startupEnvironmentSelection,
							appServerRuntimeFingerprint,
							contextEngineProjection: params.contextEngineProjection,
							signal,
							pluginThreadConfig: pluginThreadConfigRequired ? createCodexPluginThreadConfigStartupProvider({
								inputFingerprint: pluginThreadConfigInputFingerprint,
								enabledPluginConfigKeys,
								policy: resolvedPluginPolicy,
								requestTimeoutMs: params.appServer.requestTimeoutMs,
								signal,
								pluginConfig: pluginThreadConfigPluginConfig,
								client: activeStartupClient,
								configCwd: startupExecutionCwd,
								appCacheKey: pluginAppCacheKey,
								scheduledRuntimeAuthority: attemptParams.scheduledRuntimeAuthority
							}) : void 0
						});
						try {
							const startupThread = await startOrResumeThread(buildThreadLifecycleParams(startupAbandonController.signal, reserveStartupThread));
							try {
								reserveStartupThread(startupThread.threadId);
							} catch (error) {
								if (!await unsubscribeCodexThreadBestEffort(activeStartupClient, {
									threadId: startupThread.threadId,
									timeoutMs: 5e3
								})) throw new CodexAppServerUnsafeSubscriptionError("Codex startup subscription cleanup failed", { cause: error });
								throw error;
							}
							if (startupAbandonController.signal.aborted) throw new CodexAppServerStartupError("aborted");
							const startupRoute = startupReservation;
							if (!startupRoute) throw new Error("codex app-server startup did not reserve its thread route");
							startupSandboxEnvironmentAcquired = false;
							startCodexComputerUseHealthMonitor({
								client: activeStartupClient,
								config: params.computerUseConfig
							});
							startupAttemptSucceeded = true;
							return {
								client: activeStartupClient,
								turnRouter,
								turnRoute: startupRoute,
								thread: startupThread,
								sandboxEnvironment: startupSandboxEnvironment,
								environmentSelection: startupEnvironmentSelection,
								executionCwd: startupExecutionCwd,
								sandboxPolicy: startupSandboxPolicy,
								...runtimeArtifact ? { runtimeArtifact } : {},
								restartContextEngineCodexThread: async () => {
									try {
										return await startOrResumeThread(buildThreadLifecycleParams(params.signal));
									} catch (error) {
										if (!isCodexAppServerStartSelectionChangedError(error)) throw error;
										retireSharedCodexAppServerClientIfCurrent(activeStartupClient);
										throw Object.assign(new Error("codex app-server client is closed", { cause: error }), { code: CODEX_APP_SERVER_CONTEXT_RESTART_SELECTION_CHANGED });
									}
								}
							};
						} catch (error) {
							await releaseStartupResources();
							throw error;
						} finally {
							if (releaseStartupResourcesOnTimeout === releaseStartupResources) releaseStartupResourcesOnTimeout = void 0;
						}
					} catch (error) {
						startupAttemptError = error;
						if (!startupAbandoned && !params.signal.aborted && !startupClient) {
							const sharedClient = clearSharedCodexAppServerClientIfCurrentAndUnclaimed(startupClientForAbandonedRequestCleanup);
							if (sharedClient.found && !sharedClient.closed) startupClientForAbandonedRequestCleanup = void 0;
						}
						throw error;
					} finally {
						if (!startupAttemptSucceeded) {
							if (releaseSharedClientLease === startupClientLease) releaseSharedClientLease = void 0;
							startupClientLease?.();
							if (startupAbandoned || params.signal.aborted) {
								if (startupClientForAbandonedRequestCleanup === startupClient) startupClientForAbandonedRequestCleanup = void 0;
								await closeCodexStartupClientBestEffort(startupClient);
							} else if (!isCodexAppServerStartSelectionChangedError(startupAttemptError) && (shouldClearSharedClientAfterStartupRace(startupAttemptError) || shouldClearSharedClientAfterStartupFailure({
								error: startupAttemptError,
								spawnedBy: params.spawnedBy
							}))) {
								if (startupClientForAbandonedRequestCleanup === startupClient) startupClientForAbandonedRequestCleanup = void 0;
								await closeCodexStartupClientBestEffort(startupClient);
							}
						}
					}
				};
				for (let attempt = 1; attempt <= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS; attempt += 1) try {
					return await startupAttempt();
				} catch (error) {
					const selectionChanged = isCodexAppServerStartSelectionChangedError(error);
					if (startupAbandoned || params.signal.aborted || !selectionChanged && !isCodexAppServerConnectionClosedError(error)) throw error;
					const failedClient = attemptedClient;
					const refreshedSharedClient = selectionChanged ? retireSharedCodexAppServerClientIfCurrent(failedClient) : clearSharedCodexAppServerClientIfCurrent(failedClient);
					if (startupClientForAbandonedRequestCleanup === failedClient) startupClientForAbandonedRequestCleanup = void 0;
					if (attempt >= CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS) {
						log.warn(selectionChanged ? "codex app-server executable selection kept changing during startup; retries exhausted" : "codex app-server connection closed during startup; retries exhausted", {
							attempt,
							maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
							refreshedSharedClient,
							error: formatErrorMessage(error)
						});
						throw error;
					}
					log.warn(selectionChanged ? "codex app-server executable selection changed during startup; restarting app-server and retrying" : "codex app-server connection closed during startup; restarting app-server and retrying", {
						attempt,
						nextAttempt: attempt + 1,
						maxAttempts: CODEX_APP_SERVER_STARTUP_CONNECTION_CLOSE_MAX_ATTEMPTS,
						refreshedSharedClient,
						error: formatErrorMessage(error)
					});
				}
				throw new Error("codex app-server startup retry loop exited unexpectedly");
			}
		});
		startupClientForAbandonedRequestCleanup = void 0;
		if (!releaseSharedClientLease) throw new Error("codex app-server startup succeeded without a shared client lease");
		return {
			...startupResult,
			pluginAppServer,
			releaseSharedClientLease
		};
	} catch (error) {
		if (params.signal.aborted || shouldClearSharedClientAfterStartupAbandon(error)) {
			releaseSharedClientLease?.();
			releaseSharedClientLease = void 0;
			await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
			startupClientForAbandonedRequestCleanup = void 0;
		} else if (!isCodexAppServerStartSelectionChangedError(error) && (shouldClearSharedClientAfterStartupRace(error) || shouldClearSharedClientAfterStartupFailure({
			error,
			spawnedBy: params.spawnedBy
		}))) {
			releaseSharedClientLease?.();
			releaseSharedClientLease = void 0;
			await closeCodexStartupClientBestEffort(startupClientForAbandonedRequestCleanup);
			startupClientForAbandonedRequestCleanup = void 0;
		}
		throw error;
	} finally {
		params.signal.removeEventListener("abort", abandonStartupAcquire);
	}
}
function shouldClearSharedClientAfterStartupAbandon(error) {
	return isCodexAppServerStartupError(error);
}
function shouldClearSharedClientAfterStartupRace(error) {
	return shouldClearSharedClientAfterStartupAbandon(error) || isCodexAppServerRequestTimeoutError(error);
}
function shouldClearSharedClientAfterStartupFailure(params) {
	return isCodexAppServerBrokenPipeError(params.error) || !params.spawnedBy;
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-start.ts
async function startCodexAttemptRuntime(resources) {
	const { prompt, state, trajectoryRecorder, activateNativePreToolUseFailureFallback, releaseSandboxExecEnvironment, releaseSharedClientLeaseAndRetireOneShotClient, releaseCurrentRoute, runCleanupStep, startupTimeoutMs, buildNativeHookRelayFinalConfigPatch } = resources;
	const { context, turnState, buildRenderedCodexDeveloperInstructions, rebuildCodexTurnPromptTextFromCurrentProjection, applyNoContextEngineContinuityProjection } = prompt;
	const { runtime, attemptTools, promptState } = context;
	const { connection, runtimeParams, preparedAuthBinding, buildActiveRunAttemptParams, startupAuthAccountCacheKey, startupEnvApiKeyCacheKey, bundleMcpThreadConfig, nativeToolSurfaceEnabled, nativeProviderWebSearchSupport, sandboxExecServerEnabled } = runtime;
	const { toolBridge, toolState } = attemptTools;
	const developerInstructions = joinPresentSections(turnState.promptBuild.developerInstructions, attemptTools.scheduledConfiguredMcp?.diagnosticNotice);
	const { params, attemptClientFactory, bindingStore, appServer, pluginConfig, computerUseConfig, startupClientAuthProfileId, runtimeArtifactRequest, startupPreparedAuth, agentDir, sessionAgentId, effectiveWorkspace, effectiveCwd, sandbox, runAbortController, usesSupervisionConnection, resolveReviewerPolicyContext, resolveRuntimeOptionsForCurrentBinding, startupAuthProfileId, startupAuthRequirement, abortFromUpstream } = connection;
	let pluginAppServer = withCodexAppServerFastModeServiceTier(appServer, runtimeParams);
	try {
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: { phase: "startup" }
		});
		const startupResult = await startCodexAttemptThread({
			attemptClientFactory,
			bindingStore,
			appServer: pluginAppServer,
			pluginConfig,
			computerUseConfig,
			startupAuthProfileId: startupClientAuthProfileId,
			startupAuthRequirement,
			startupAuthBindingFingerprint: preparedAuthBinding?.fingerprint,
			...runtimeArtifactRequest ? { runtimeArtifactRequest } : {},
			startupPreparedAuth,
			startupAuthAccountCacheKey,
			startupEnvApiKeyCacheKey,
			agentDir,
			config: params.config,
			buildAttemptParams: buildActiveRunAttemptParams,
			sessionAgentId,
			effectiveWorkspace,
			effectiveCwd,
			dynamicTools: toolBridge.specs,
			persistentWebSearchAllowed: toolState.persistentWebSearchAllowed,
			webSearchAllowed: toolState.webSearchAllowed,
			developerInstructions,
			buildFinalConfigPatch: buildNativeHookRelayFinalConfigPatch,
			bundleMcpThreadConfig,
			configuredMcpOwnershipVersion: attemptTools.configuredMcpOwnershipVersion,
			nativeToolSurfaceEnabled,
			nativeProviderWebSearchSupport,
			sandboxExecServerEnabled,
			sandbox,
			contextEngineProjection: promptState.contextEngineProjection,
			startupTimeoutMs,
			signal: runAbortController.signal,
			onStartupTimeout: () => runAbortController.abort("codex_startup_timeout"),
			spawnedBy: params.spawnedBy
		});
		state.client = startupResult.client;
		state.thread = startupResult.thread;
		state.runtimeArtifact = startupResult.runtimeArtifact;
		state.turnRouter = startupResult.turnRouter;
		state.turnRoute = startupResult.turnRoute;
		state.sandboxExecEnvironmentAcquired = Boolean(startupResult.sandboxEnvironment);
		state.releaseSharedClientLease = startupResult.releaseSharedClientLease;
		state.restartContextEngineCodexThread = startupResult.restartContextEngineCodexThread;
		pluginAppServer = startupResult.pluginAppServer;
		toolBridge.setRemoteWorkspaceFileReader?.(({ path, maxBytes, workspaceRoot, signal, timeoutMs }) => readBoundedCodexRemoteWorkspaceFile({
			client: startupResult.client,
			path,
			maxBytes,
			workspaceRoot,
			signal,
			timeoutMs
		}));
		if (usesSupervisionConnection && (state.thread.connectionScope !== "supervision" || state.thread.supervisionSourceThreadId !== connection.mutable.startupBinding?.supervisionSourceThreadId)) throw new Error("Codex supervised thread lost its private connection ownership");
		if (state.thread.lifecycle.action === "started" || state.thread.lifecycle.action === "forked") {
			const activePolicy = resolveReviewerPolicyContext(state.thread);
			const activeAppServer = resolveCodexAppServerForModelProvider({
				appServer: resolveRuntimeOptionsForCurrentBinding({
					modelProvider: activePolicy.modelProvider,
					model: activePolicy.model
				}),
				provider: activePolicy.modelProvider,
				model: activePolicy.model,
				config: params.config,
				env: process.env,
				agentDir
			});
			const previousReviewer = pluginAppServer.approvalsReviewer;
			pluginAppServer = {
				...pluginAppServer,
				approvalsReviewer: activeAppServer.approvalsReviewer
			};
			if (pluginAppServer.approvalsReviewer !== previousReviewer) log.info("codex app-server approval reviewer updated from active thread model provider", {
				from: previousReviewer,
				to: pluginAppServer.approvalsReviewer,
				modelProvider: activePolicy.modelProvider
			});
		}
		state.codexEnvironmentSelection = startupResult.environmentSelection;
		state.codexExecutionCwd = startupResult.executionCwd;
		state.codexSandboxPolicy = startupResult.sandboxPolicy;
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "thread_ready",
				threadId: state.thread.threadId,
				action: state.thread.lifecycle.action,
				clientId: state.client.getInstanceId()
			}
		});
		if (applyNoContextEngineContinuityProjection(state.thread.lifecycle.action, state.thread)) await rebuildCodexTurnPromptTextFromCurrentProjection();
		trajectoryRecorder?.recordEvent("session.started", {
			sessionFile: params.sessionFile,
			threadId: state.thread.threadId,
			authProfileId: startupAuthProfileId,
			workspaceDir: effectiveWorkspace,
			toolCount: flattenCodexDynamicToolFunctions(toolBridge.specs).length
		});
		recordCodexTrajectoryContext(trajectoryRecorder, {
			attempt: params,
			cwd: effectiveCwd,
			developerInstructions: joinPresentSections(buildRenderedCodexDeveloperInstructions(), attemptTools.scheduledConfiguredMcp?.diagnosticNotice),
			prompt: turnState.codexTurnPromptText,
			tools: toolBridge.availableSpecs
		});
		connection.mutable.pluginAppServer = pluginAppServer;
	} catch (error) {
		await runCleanupStep("codex-start-failure-hook-fallback", activateNativePreToolUseFailureFallback);
		await runCleanupStep("codex-start-failure-route-release", releaseCurrentRoute);
		const nativeHookRelay = state.nativeHookRelay;
		state.nativeHookRelay = void 0;
		await runCleanupStep("codex-start-failure-native-hook-relay", () => nativeHookRelay?.unregister());
		await runCleanupStep("codex-start-failure-sandbox-release", releaseSandboxExecEnvironment);
		await runCleanupStep("codex-start-failure-shared-client-release", releaseSharedClientLeaseAndRetireOneShotClient);
		await runCleanupStep("codex-start-failure-abort-listener", () => params.abortSignal?.removeEventListener("abort", abortFromUpstream));
		throw error;
	}
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-tool-setup.ts
function isAuthorityResolutionOperationAbort(error, signal) {
	return signal?.aborted === true && error === signal.reason;
}
async function prepareCodexAttemptTools(runtime) {
	const { connection, bundleMcpThreadConfig, bundleManifestRegistry, runtimeParams, effectiveRuntimeModelId, nativeToolSurfaceEnabled, nativeProviderWebSearchSupport, hookChannelId, codexMcpToolOverrides, authenticatedScheduledMode, ownsScheduledConfiguredMcpSurface, canResolveScheduledConfiguredMcpCreatorAuthority } = runtime;
	const { params, preDynamicStartupStages, mutable, startupAuthProfileId, resolvedWorkspace, effectiveWorkspace, effectiveCwd, sandboxSessionKey, sandbox, runAbortController, sessionAgentId, pluginConfig, profilerEnabled, agentDir } = connection;
	const preDynamicSummary = preDynamicStartupStages.snapshot();
	if (shouldWarnCodexDynamicToolBuildStageSummary(preDynamicSummary)) log.warn(`codex app-server pre-dynamic startup timings runId=${params.runId} sessionId=${params.sessionId} totalMs=${preDynamicSummary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(preDynamicSummary)}`, {
		runId: params.runId,
		sessionId: params.sessionId,
		totalMs: preDynamicSummary.totalMs,
		stages: preDynamicSummary.stages,
		hasStartupBinding: Boolean(mutable.startupBinding?.threadId),
		startupAuthProfileId: startupAuthProfileId ?? null,
		bundleMcpDiagnosticCount: bundleMcpThreadConfig.diagnostics.length,
		nativeToolSurfaceEnabled
	});
	const toolState = {
		yieldDetected: false,
		persistentWebSearchAllowed: void 0,
		webSearchAllowed: false
	};
	const toolOutcomeOrdinals = /* @__PURE__ */ new Map();
	const suppressedDynamicToolOutcomeOrdinals = /* @__PURE__ */ new Set();
	const onCodexToolOutcome = params.onToolOutcome ? (observation) => {
		if (observation.toolCallOrdinal !== void 0 && suppressedDynamicToolOutcomeOrdinals.has(observation.toolCallOrdinal)) return;
		params.onToolOutcome?.(observation);
	} : void 0;
	const baseAllocateToolOutcomeOrdinal = params.allocateToolOutcomeOrdinal;
	const allocateCodexToolOutcomeOrdinal = baseAllocateToolOutcomeOrdinal ? (toolCallId) => {
		const reservedOrdinal = toolCallId ? toolOutcomeOrdinals.get(toolCallId) : void 0;
		if (reservedOrdinal !== void 0) return reservedOrdinal;
		const ordinal = baseAllocateToolOutcomeOrdinal(toolCallId);
		if (toolCallId) toolOutcomeOrdinals.set(toolCallId, ordinal);
		return ordinal;
	} : void 0;
	const dynamicToolParams = allocateCodexToolOutcomeOrdinal || onCodexToolOutcome ? {
		...runtimeParams,
		...allocateCodexToolOutcomeOrdinal ? { allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal } : {},
		...onCodexToolOutcome ? { onToolOutcome: onCodexToolOutcome } : {}
	} : runtimeParams;
	const computerContextEpoch = { value: 0 };
	const cronCreatorToolAllowlist = [];
	const cronCreatorToolAllowlistCaptureRef = {};
	const scheduledAppAuthoritySourceRef = {};
	const preparedChatgptAuth = connection.startupPreparedAuth?.kind === "profile" && connection.startupPreparedAuth.snapshot?.loginParams.type === "chatgptAuthTokens" && connection.startupPreparedAuth.snapshot.chatgptAccountId ? {
		profileId: connection.startupPreparedAuth.profileId,
		accountId: connection.startupPreparedAuth.snapshot.chatgptAccountId
	} : void 0;
	const appPolicy = resolveCodexPluginsPolicy(pluginConfig);
	const appCreatorCapture = resolveScheduledCodexAppCreatorCaptureDecision({
		appsMayBeVisible: appPolicy.enabled && (appPolicy.allowAllPlugins || appPolicy.pluginPolicies.some((entry) => entry.enabled)),
		authenticatedScheduledMode,
		usesSupervisionConnection: connection.usesSupervisionConnection,
		homeScope: connection.appServer.start.homeScope,
		hasPreparedAccountIdentity: Boolean(preparedChatgptAuth)
	});
	const codexAppAuthorityUnavailableReason = appCreatorCapture.unavailableReason;
	const canResolveScheduledCodexAppAuthority = appCreatorCapture.supported;
	const requiresScheduledCodexAppAuthority = appCreatorCapture.required;
	const canResolveAnyScheduledCreatorAuthority = canResolveScheduledConfiguredMcpCreatorAuthority || requiresScheduledCodexAppAuthority;
	let toolBridge;
	let creatorAuthorityPromise;
	let resolveCreatorAuthorityImpl;
	const commonToolParams = {
		params: dynamicToolParams,
		resolvedWorkspace,
		effectiveWorkspace,
		effectiveCwd,
		sandboxSessionKey,
		sandbox,
		nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport,
		runAbortController,
		sessionAgentId,
		pluginConfig,
		profilerEnabled,
		...params.cronCreatorAuthorityUnavailableReason === "queued-local-operator" && bundleMcpThreadConfig.staticServerNames.length > 0 ? { cronCreatorAuthorityUnavailableReason: "queued-local-operator-configured-mcp" } : {},
		onYieldDetected: () => {
			toolState.yieldDetected = true;
		},
		onCodexAppServerEvent: (event) => {
			emitCodexAppServerEvent(params, event);
		},
		computerContextEpoch,
		...canResolveAnyScheduledCreatorAuthority ? { resolveCronCreatorToolAuthority: (options) => {
			if (!resolveCreatorAuthorityImpl) throw new Error("configured MCP authority resolver was invoked before tool setup");
			options?.signal?.throwIfAborted();
			if (creatorAuthorityPromise) return creatorAuthorityPromise;
			const pending = resolveCreatorAuthorityImpl(options);
			creatorAuthorityPromise = pending;
			pending.catch((error) => {
				if (creatorAuthorityPromise === pending && isAuthorityResolutionOperationAbort(error, options?.signal)) creatorAuthorityPromise = void 0;
			});
			return pending;
		} } : {}
	};
	const tools = await buildDynamicTools({
		...commonToolParams,
		cronCreatorToolAllowlistRef: cronCreatorToolAllowlist,
		cronCreatorToolAllowlistCaptureRef,
		onPersistentWebSearchPolicyResolved: (allowed) => {
			toolState.persistentWebSearchAllowed = allowed;
		},
		onWebSearchPolicyResolved: (allowed) => {
			toolState.webSearchAllowed = allowed;
		}
	});
	const registeredTools = await buildDynamicTools({
		...commonToolParams,
		forceHeartbeatTool: true,
		ignoreDisableMessageTool: true,
		ignoreRuntimePlan: true
	});
	const policyContext = {
		config: params.config,
		sessionKey: sandboxSessionKey,
		runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0,
		sessionId: params.sessionId,
		runId: params.runId,
		agentId: sessionAgentId,
		agentDir: agentDir ?? resolveAgentDir(params.config ?? {}, sessionAgentId),
		agentAccountId: params.agentAccountId,
		messageProvider: params.messageProvider ?? params.messageChannel,
		messageChannel: params.messageChannel,
		chatType: params.chatType,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		currentChannelId: params.currentChannelId,
		currentMessagingTarget: params.currentMessagingTarget,
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		memberRoleIds: params.memberRoleIds,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		modelProvider: params.provider,
		modelId: params.modelId,
		modelApi: params.model.api,
		modelContextWindowTokens: params.model.contextWindow,
		modelHasVision: params.model.input?.includes("image") ?? false,
		workspaceDir: effectiveWorkspace,
		cwd: effectiveCwd ?? effectiveWorkspace,
		sandboxToolPolicy: sandbox?.tools,
		conversationToolPolicy: params.conversationToolPolicy,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy
	};
	const reservedToolNames = [...tools.map((tool) => tool.name), ...registeredTools.map((tool) => tool.name)];
	const turnSourceChannel = params.messageChannel ?? params.messageProvider;
	const turnSourceTo = params.currentMessagingTarget ?? params.currentChannelId;
	const requester = {
		...turnSourceChannel ? { channel: turnSourceChannel } : {},
		...params.agentAccountId ? { accountId: params.agentAccountId } : {},
		...params.senderId ? { senderId: params.senderId } : {},
		...params.senderIsOwner !== void 0 ? { senderIsOwner: params.senderIsOwner } : {},
		...params.memberRoleIds?.length ? { roleIds: [...params.memberRoleIds] } : {}
	};
	const hasRequester = Object.keys(requester).length > 0;
	const scheduledConfiguredMcp = ownsScheduledConfiguredMcpSurface ? await materializeStaticMcpToolsForScheduledHarnessRun({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		workspaceDir: effectiveWorkspace,
		agentDir: policyContext.agentDir,
		cfg: params.config,
		manifestRegistry: bundleManifestRegistry,
		reservedToolNames,
		toolsAllow: params.toolsAllow,
		toolOverrides: codexMcpToolOverrides,
		autoApproveCodexAppServerApprovals: shouldAutoApproveCodexAppServerApprovals(connection.appServer),
		policyContext,
		warn: (message) => log.warn(message)
	}) : void 0;
	let scopedMcpTools = void 0;
	try {
		scopedMcpTools = authenticatedScheduledMode ? void 0 : await materializeRequesterScopedMcpToolsForHarnessRun({
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			workspaceDir: effectiveWorkspace,
			agentDir: policyContext.agentDir,
			cfg: params.config,
			manifestRegistry: bundleManifestRegistry,
			toolOverrides: codexMcpToolOverrides,
			requesterSenderId: params.senderId,
			agentAccountId: params.agentAccountId,
			messageChannel: params.messageChannel ?? params.messageProvider,
			reservedToolNames,
			toolsAllow: params.toolsAllow,
			policyContext,
			warn: (message) => log.warn(message)
		});
		const scopedExecutable = filterCodexDynamicTools(scheduledConfiguredMcp?.tools ?? scopedMcpTools?.tools ?? [], pluginConfig);
		const scopedAdvertised = filterCodexDynamicTools(scheduledConfiguredMcp?.tools ?? scopedMcpTools?.advertisedTools ?? [], pluginConfig);
		const toolsWithScopedMcp = scopedExecutable.length > 0 ? [...tools, ...scopedExecutable] : tools;
		const registeredWithScopedMcp = scopedAdvertised.length > 0 ? [...registeredTools, ...scopedAdvertised] : registeredTools;
		const hookContext = {
			agentId: sessionAgentId,
			config: params.config,
			contextWindowTokens: params.contextTokenBudget ?? params.model.contextWindow,
			workspaceDir: effectiveWorkspace,
			remoteWorkspaceRoot: connection.appServer.remoteWorkspaceRoot,
			remoteWorkspaceRequestTimeoutMs: connection.appServer.requestTimeoutMs,
			sessionId: params.sessionId,
			sessionKey: sandboxSessionKey,
			runId: params.runId,
			channelId: hookChannelId,
			currentChannelProvider: resolveCodexMessageToolProvider(params),
			currentChannelId: params.currentChannelId,
			currentMessagingTarget: params.currentMessagingTarget,
			currentMessageId: params.currentMessageId,
			currentThreadId: params.currentThreadTs,
			replyToMode: params.replyToMode,
			hasRepliedRef: params.hasRepliedRef,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			onToolOutcome: onCodexToolOutcome,
			allocateToolOutcomeOrdinal: allocateCodexToolOutcomeOrdinal,
			trigger: params.trigger,
			approvalReviewerDeviceId: params.approvalReviewerDeviceId,
			...hasRequester ? { requester } : {},
			...turnSourceChannel ? { turnSourceChannel } : {},
			...turnSourceTo ? { turnSourceTo } : {},
			...params.agentAccountId ? { turnSourceAccountId: params.agentAccountId } : {},
			...params.currentThreadTs !== void 0 ? { turnSourceThreadId: params.currentThreadTs } : {}
		};
		toolBridge = createCodexDynamicToolBridge({
			tools: toolsWithScopedMcp,
			registeredTools: registeredWithScopedMcp,
			signal: runAbortController.signal,
			computerContextEpoch,
			loading: resolveCodexDynamicToolsLoadingForRuntime(pluginConfig, effectiveRuntimeModelId, { connectionClass: connection.appServer.connectionClass }),
			directToolNames: resolveCodexDynamicToolDirectNames(params, isHostScopedAgentToolActive("openclaw")),
			hookContext
		});
		await captureFinalCodexCronCreatorToolAllowlist(cronCreatorToolAllowlist, cronCreatorToolAllowlistCaptureRef, toolBridge.availableTools);
		if (!authenticatedScheduledMode && bundleMcpThreadConfig.staticServerNames.length > 0 && !canResolveScheduledConfiguredMcpCreatorAuthority) delete cronCreatorToolAllowlistCaptureRef.value;
		if (requiresScheduledCodexAppAuthority) delete cronCreatorToolAllowlistCaptureRef.value;
		if (canResolveAnyScheduledCreatorAuthority) resolveCreatorAuthorityImpl = async (options) => {
			options?.signal?.throwIfAborted();
			if (codexAppAuthorityUnavailableReason) throw new Error(codexAppAuthorityUnavailableReason);
			if (!toolBridge) throw new Error("cron creator authority resolver lost the active tool bridge");
			const authorityTools = [];
			const captureRef = {};
			await captureFinalCodexCronCreatorToolAllowlist(authorityTools, captureRef, toolBridge.availableTools);
			if (!captureRef.value) throw new Error("cron creator authority snapshot did not produce provenance");
			const appSource = scheduledAppAuthoritySourceRef.current;
			const runtimeAuthority = canResolveScheduledCodexAppAuthority && preparedChatgptAuth ? appSource ? await captureScheduledCodexAppAuthority({
				...appSource,
				...preparedChatgptAuth,
				signal: options?.signal
			}) : (() => {
				throw new Error("Codex app authority is unavailable before the exact creator thread is active. Retry this automation mutation from the current owner turn.");
			})() : void 0;
			if (!canResolveScheduledConfiguredMcpCreatorAuthority) {
				options?.signal?.throwIfAborted();
				return Object.freeze({
					tools: Object.freeze(authorityTools.map((entry) => Object.freeze(entry))),
					provenance: Object.freeze(captureRef.value),
					...runtimeAuthority ? { runtimeAuthority } : {}
				});
			}
			const authorityRuntimeId = `cron-authority:${params.runId}`;
			let materialized;
			try {
				materialized = await materializeStaticMcpToolsForScheduledHarnessRun({
					sessionId: authorityRuntimeId,
					workspaceDir: effectiveWorkspace,
					agentDir: policyContext.agentDir,
					cfg: params.config,
					manifestRegistry: bundleManifestRegistry,
					reservedToolNames: toolBridge.availableTools.map((tool) => tool.name),
					toolsAllow: params.toolsAllow,
					toolOverrides: codexMcpToolOverrides,
					autoApproveCodexAppServerApprovals: shouldAutoApproveCodexAppServerApprovals(connection.appServer),
					policyContext,
					warn: (message) => log.warn(message),
					retireSessionRuntimeAfterDispose: true
				});
			} catch (error) {
				const detail = error instanceof Error ? error.message : String(error);
				throw new Error(`Configured MCP discovery failed while resolving inherited automation authority: ${detail}. Retry after the server is available, or provide an explicit finite toolsAllow list containing only currently visible tools; no automation changes were saved.`, { cause: error });
			}
			try {
				options?.signal?.throwIfAborted();
				if (materialized.diagnosticNotice) throw new Error(`${materialized.diagnosticNotice} Sign in to the affected MCP server and retry, or provide an explicit finite toolsAllow list containing only currently visible tools. No automation changes were saved.`);
				const projectedConfiguredMcp = projectCodexExecutableDynamicTools({
					tools: filterCodexDynamicTools(materialized.tools, pluginConfig),
					hookContext
				});
				await captureFinalCodexCronCreatorToolAllowlist(authorityTools, captureRef, [...toolBridge.availableTools, ...projectedConfiguredMcp.availableTools]);
				if (!captureRef.value) throw new Error("configured MCP authority snapshot did not produce provenance");
				options?.signal?.throwIfAborted();
				return Object.freeze({
					tools: Object.freeze(authorityTools.map((entry) => Object.freeze(entry))),
					provenance: Object.freeze(captureRef.value),
					...runtimeAuthority ? { runtimeAuthority } : {}
				});
			} finally {
				await materialized.dispose();
			}
		};
		return {
			tools: toolsWithScopedMcp,
			registeredTools: registeredWithScopedMcp,
			scopedMcpTools,
			scheduledConfiguredMcp,
			configuredMcpOwnershipVersion: ownsScheduledConfiguredMcpSurface ? 1 : void 0,
			cronCreatorToolAllowlist,
			cronCreatorToolAllowlistCaptureRef,
			scheduledAppAuthoritySourceRef,
			dynamicToolParams,
			computerContextEpoch,
			toolBridge,
			toolState,
			toolOutcomeOrdinals,
			suppressedDynamicToolOutcomeOrdinals,
			onCodexToolOutcome,
			allocateCodexToolOutcomeOrdinal
		};
	} catch (error) {
		await scopedMcpTools?.dispose();
		await scheduledConfiguredMcp?.dispose();
		throw error;
	}
}
//#endregion
//#region extensions/codex/src/app-server/explicit-skill-input.ts
function comparablePath(value) {
	const resolved = path.resolve(value);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
async function resolveCodexExplicitSkillInputs(params) {
	if (!params.selections?.length) return [];
	try {
		const response = await params.client.request("skills/list", {
			cwds: [params.cwd],
			forceReload: false
		}, { signal: params.signal });
		const cwd = comparablePath(params.cwd);
		const catalog = response.data.find((entry) => comparablePath(entry.cwd) === cwd);
		return params.selections.flatMap((selection) => {
			const selectedPath = comparablePath(selection.path);
			const skill = catalog?.skills.find((candidate) => candidate.enabled && comparablePath(candidate.path) === selectedPath);
			return skill ? [{
				type: "skill",
				name: skill.name,
				path: skill.path
			}] : [];
		});
	} catch (error) {
		log.debug("codex explicit skill catalog unavailable; using prompt fallback", { error: formatErrorMessage(error) });
		return [];
	}
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-request.ts
async function prepareCodexAttemptTurnRequest(resources, turnRuntime, ensureCurrentThreadRoute, waitForActiveNativeTurnCompletion) {
	const { prompt, state: resourceState, releaseCurrentRoute } = resources;
	const { context, turnState, buildRenderedCodexDeveloperInstructions } = prompt;
	const { runtime, attemptTools, hookContextWindowFields, workspaceBootstrapContext } = context;
	const { connection, runtimeParams, effectiveRuntimeProviderId, effectiveRuntimeModelId } = runtime;
	const { tools } = attemptTools;
	const { params, usesSupervisionConnection, codexModelCallId, codexModelCallTrace, codexModelContentCapture, appServer, runAbortController } = connection;
	const { state } = turnRuntime;
	const explicitSkillInputs = await resolveCodexExplicitSkillInputs({
		client: resourceState.client,
		cwd: resourceState.codexExecutionCwd,
		selections: runtimeParams.explicitSkillSelections,
		signal: runAbortController.signal
	});
	const buildCodexModelInputMessages = () => [...prompt.codexModelInputHistoryMessages, buildCodexUserPromptMessage({
		...runtimeParams,
		prompt: turnState.codexTurnPromptText
	})];
	const codexModelCallDiagnostics = createCodexModelCallDiagnosticEmitter({
		baseFields: {
			runId: params.runId,
			callId: codexModelCallId,
			...params.sessionKey ? { sessionKey: params.sessionKey } : {},
			sessionId: params.sessionId,
			provider: usesSupervisionConnection ? resourceState.thread.modelProvider ?? effectiveRuntimeProviderId : params.provider,
			model: usesSupervisionConnection ? resourceState.thread.model ?? effectiveRuntimeModelId : params.modelId,
			api: usesSupervisionConnection ? runtimeParams.model.api : params.model.api,
			transport: appServer.start.transport,
			observationUnit: "turn",
			...hookContextWindowFields,
			trace: codexModelCallTrace
		},
		capture: codexModelContentCapture,
		tools,
		buildInputMessages: buildCodexModelInputMessages,
		buildSystemPrompt: buildRenderedCodexDeveloperInstructions,
		onErrorDiagnostic: (error) => {
			log.debug("codex app-server model call diagnostic ended with error", { error: formatErrorMessage(error) });
		}
	});
	const throwIfTurnStartAcceptedAfterAbort = () => {
		if (!runAbortController.signal.aborted) return;
		const reason = runAbortController.signal.reason;
		if (reason instanceof Error) throw reason;
		const error = new Error(typeof reason === "string" && reason.length > 0 ? reason : "codex app-server turn start aborted before acceptance");
		error.name = "AbortError";
		throw error;
	};
	const startCodexTurn = async () => {
		const activeTurnRoute = await ensureCurrentThreadRoute();
		const turnAppServer = withCodexAppServerFastModeServiceTier(connection.mutable.pluginAppServer, runtimeParams);
		connection.mutable.pluginAppServer = turnAppServer;
		const turnStartParams = buildTurnStartParams(runtimeParams, {
			threadId: resourceState.thread.threadId,
			cwd: resourceState.codexExecutionCwd,
			appServer: turnAppServer,
			promptText: turnState.codexTurnPromptText,
			explicitSkillInputs,
			sandboxPolicy: resourceState.codexSandboxPolicy,
			environmentSelection: resourceState.codexEnvironmentSelection,
			clearInheritedServiceTier: resourceState.thread.clearInheritedServiceTier,
			...usesSupervisionConnection ? {} : {
				model: resourceState.thread.model,
				modelProvider: resourceState.thread.modelProvider
			},
			turnScopedDeveloperInstructions: workspaceBootstrapContext.turnScopedDeveloperInstructions,
			skillsCollaborationInstructions: context.skillsCollaborationInstructions,
			memoryCollaborationInstructions: workspaceBootstrapContext.memoryCollaborationInstructions,
			preserveNativeTurnSettings: usesSupervisionConnection
		});
		codexModelCallDiagnostics.setRequestPayloadBytes(utf8JsonByteLength(turnStartParams));
		state.latestStartupErrorNotification = void 0;
		state.rateLimitsRevisionBeforeLastTurnStart = readCodexRateLimitsRevision(resourceState.client);
		activeTurnRoute.armTurn();
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "turn_starting",
				threadId: resourceState.thread.threadId,
				model: turnStartParams.model,
				effort: turnStartParams.effort,
				collaborationEffort: turnStartParams.collaborationMode?.settings.reasoning_effort,
				serviceTier: turnStartParams.serviceTier
			}
		});
		let acceptedTurnId;
		try {
			const startedTurn = assertCodexTurnStartResponse(await resourceState.client.request("turn/start", turnStartParams, {
				timeoutMs: params.timeoutMs,
				signal: runAbortController.signal
			}));
			acceptedTurnId = startedTurn.turn.id;
			throwIfTurnStartAcceptedAfterAbort();
			return startedTurn;
		} catch (error) {
			if (acceptedTurnId || isCodexAppServerIndeterminateRequestCancellationError(error)) try {
				resourceState.startupClientUnsafe = !await interruptCodexTurnAndWaitBestEffort(resourceState.client, {
					threadId: resourceState.thread.threadId,
					turnId: acceptedTurnId ?? ""
				});
				if (resourceState.startupClientUnsafe) await retireUnsafeCodexTurnClientBestEffort(resourceState.client, "startup interrupt");
			} finally {
				releaseCurrentRoute();
			}
			else await activeTurnRoute.cancelTurn();
			throw error;
		}
	};
	if (resourceState.thread.lifecycle.action === "resumed" && (resourceState.thread.lifecycle.activeTurnIds?.length ?? 0) > 0) {
		log.info("codex app-server resumed thread has active native turn; waiting before turn/start", { threadId: resourceState.thread.threadId });
		emitCodexAppServerEvent(params, {
			stream: "codex_app_server.lifecycle",
			data: {
				phase: "turn_start_waiting_for_native_turn",
				threadId: resourceState.thread.threadId
			}
		});
		if (await waitForActiveNativeTurnCompletion()) await resourceState.turnRoute?.drain();
		else if (!runAbortController.signal.aborted) log.warn("codex app-server active native turn did not complete before turn/start wait timed out", { threadId: resourceState.thread.threadId });
	}
	const buildLlmInputEvent = () => ({
		runId: params.runId,
		sessionId: params.sessionId,
		provider: usesSupervisionConnection ? resourceState.thread.modelProvider ?? effectiveRuntimeProviderId : params.provider,
		model: usesSupervisionConnection ? resourceState.thread.model ?? effectiveRuntimeModelId : params.modelId,
		systemPrompt: buildRenderedCodexDeveloperInstructions(),
		prompt: turnState.codexTurnPromptText,
		historyMessages: prompt.codexModelInputHistoryMessages,
		imagesCount: params.images?.length ?? 0,
		tools
	});
	return {
		codexModelCallDiagnostics,
		startCodexTurn,
		buildLlmInputEvent
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-start.ts
async function startCodexAttemptTurn(resources, turnRuntime, notifications, requestRuntime) {
	const { prompt, state: resourceState, trajectoryRecorder, markTrajectoryEndRecorded, activateNativePreToolUseFailureFallback, releaseCurrentRoute, releaseSandboxExecEnvironment, releaseSharedClientLeaseAndRetireOneShotClient } = resources;
	const { context, turnState, systemPromptReport } = prompt;
	const { runtime, historyState, hookContext, hookContextWindowFields, hookRunner } = context;
	const { connection, runtimeParams, effectiveRuntimeProviderId, effectiveRuntimeModelId } = runtime;
	const { params, usesSupervisionConnection, runAbortController, activeContextEngine, bindingStore, bindingIdentity, appServer, attemptStartedAt, startupAuthProfileId, abortFromUpstream } = connection;
	const { state, turnIdRef } = turnRuntime;
	const { waitForActiveNativeTurnCompletion } = notifications;
	const { codexModelCallDiagnostics, startCodexTurn, buildLlmInputEvent } = requestRuntime;
	let turn;
	try {
		codexModelCallDiagnostics.emitStarted();
		runAgentHarnessLlmInputHook({
			event: buildLlmInputEvent(),
			ctx: hookContext,
			hookRunner
		});
		turn = await startCodexTurn();
	} catch (error) {
		let turnStartError = error;
		if (isCodexActiveCompactTurnError(turnStartError)) {
			log.info("codex app-server turn/start blocked by active compact turn; waiting to retry", { threadId: resourceState.thread.threadId });
			if (await waitForActiveNativeTurnCompletion() && !runAbortController.signal.aborted) {
				emitCodexAppServerEvent(params, {
					stream: "codex_app_server.lifecycle",
					data: {
						phase: "turn_start_retry_after_compact",
						threadId: resourceState.thread.threadId
					}
				});
				try {
					turn = await startCodexTurn();
				} catch (retryError) {
					turnStartError = retryError;
				}
			}
		}
		if (turn === void 0 && resourceState.thread.connectionScope !== "supervision" && shouldUseFreshCodexThreadAfterContextEngineOverflow({
			error: turnStartError,
			contextEngineActive: Boolean(activeContextEngine),
			thread: resourceState.thread
		}) && resourceState.restartContextEngineCodexThread) {
			log.warn("codex app-server context-engine turn overflowed on resume; retrying with fresh thread", {
				threadId: resourceState.thread.threadId,
				error: formatErrorMessage(turnStartError)
			});
			try {
				if (!await bindingStore.mutate(bindingIdentity, {
					kind: "clear",
					threadId: resourceState.thread.threadId
				})) log.warn("codex app-server preserved newer context-engine binding after resume overflow; skipping fresh retry", {
					threadId: resourceState.thread.threadId,
					error: formatErrorMessage(turnStartError)
				});
				else {
					resourceState.thread = await resourceState.restartContextEngineCodexThread();
					const retryBinding = await bindingStore.read(bindingIdentity);
					if (retryBinding && retryBinding.threadId === resourceState.thread.threadId && retryBinding.contextEngine?.projection) {
						await bindingStore.mutate(bindingIdentity, {
							kind: "patch",
							threadId: retryBinding.threadId,
							patch: { contextEngine: {
								...retryBinding.contextEngine,
								projection: void 0
							} }
						});
						log.info("codex app-server cleared stale context-engine projection after overflow retry", {
							threadId: resourceState.thread.threadId,
							previousEpoch: retryBinding.contextEngine.projection.epoch
						});
					}
					emitCodexAppServerEvent(params, {
						stream: "codex_app_server.lifecycle",
						data: {
							phase: "thread_ready_retry",
							threadId: resourceState.thread.threadId
						}
					});
					try {
						turn = await startCodexTurn();
					} catch (retryError) {
						turnStartError = retryError;
					}
				}
			} catch (retrySetupError) {
				turnStartError = retrySetupError;
			}
		}
		if (turn === void 0) {
			const usageLimitError = await formatCodexTurnStartUsageLimitError({
				client: resourceState.client,
				error: turnStartError,
				errorNotification: state.latestStartupErrorNotification,
				rateLimitsRevisionBeforeTurnStart: state.rateLimitsRevisionBeforeLastTurnStart,
				timeoutMs: appServer.requestTimeoutMs,
				signal: runAbortController.signal
			});
			const message = usageLimitError?.message ?? formatErrorMessage(turnStartError);
			if (isInvalidCodexImagePayloadError(message)) await clearCodexBindingAfterInvalidImagePayload(bindingStore, bindingIdentity, {
				phase: "turn_start",
				threadId: resourceState.thread.threadId,
				error: message
			});
			emitCodexAppServerEvent(params, {
				stream: "codex_app_server.lifecycle",
				data: {
					phase: "turn_start_failed",
					error: message
				}
			});
			trajectoryRecorder?.recordEvent("session.ended", {
				status: "error",
				threadId: resourceState.thread.threadId,
				timedOut: state.timedOut,
				aborted: runAbortController.signal.aborted,
				promptError: message
			});
			markTrajectoryEndRecorded();
			runAgentHarnessLlmOutputHook({
				event: {
					runId: params.runId,
					sessionId: params.sessionId,
					provider: usesSupervisionConnection ? resourceState.thread.modelProvider ?? effectiveRuntimeProviderId : params.provider,
					model: usesSupervisionConnection ? resourceState.thread.model ?? effectiveRuntimeModelId : params.modelId,
					...hookContextWindowFields,
					resolvedRef: usesSupervisionConnection ? `${resourceState.thread.modelProvider ?? effectiveRuntimeProviderId}/${resourceState.thread.model ?? effectiveRuntimeModelId}` : params.runtimePlan?.observability.resolvedRef ?? `${params.provider}/${params.modelId}`,
					...!usesSupervisionConnection && params.runtimePlan?.observability.harnessId ? { harnessId: params.runtimePlan.observability.harnessId } : {},
					assistantTexts: []
				},
				ctx: hookContext,
				hookRunner
			});
			const failureKind = classifyCodexModelCallFailureKind({
				error: turnStartError,
				timedOut: state.timedOut,
				turnCompletionIdleTimedOut: state.turnCompletionIdleTimedOut,
				runAborted: runAbortController.signal.aborted,
				abortReason: runAbortController.signal.reason,
				clientClosedAbort: state.clientClosedAbort,
				formatError: formatErrorMessage
			});
			codexModelCallDiagnostics.emitError(message, failureKind ? { failureKind } : {});
			const messagesSnapshot = [...historyState.messages, buildCodexUserPromptMessage({
				...runtimeParams,
				prompt: turnState.codexTurnPromptText
			})];
			await runCodexAgentEndHook(params, {
				event: {
					messages: messagesSnapshot,
					success: false,
					error: message,
					durationMs: Date.now() - attemptStartedAt
				},
				ctx: hookContext,
				hookRunner
			});
			const bindingReleased = isIncognitoSessionKey(params.sessionKey) ? await bindingStore.mutate(bindingIdentity, {
				kind: "clear",
				threadId: resourceState.thread.threadId
			}) : true;
			if (!state.timedOut && bindingReleased && !resourceState.startupClientUnsafe) {
				if (!await unsubscribeCodexThreadBestEffort(resourceState.client, {
					threadId: resourceState.thread.threadId,
					timeoutMs: 5e3
				})) await runAgentCleanupStep({
					runId: params.runId,
					sessionId: params.sessionId,
					step: "codex-retire-unsafe-startup-client",
					log,
					cleanup: async () => closeCodexStartupClientBestEffort(resourceState.client)
				});
			}
			releaseCurrentRoute();
			activateNativePreToolUseFailureFallback();
			resourceState.nativeHookRelay?.unregister();
			await releaseSandboxExecEnvironment();
			await runAgentCleanupStep({
				runId: params.runId,
				sessionId: params.sessionId,
				step: "codex-trajectory-flush-startup-failure",
				log,
				cleanup: async () => trajectoryRecorder?.flush()
			});
			params.abortSignal?.removeEventListener("abort", abortFromUpstream);
			await releaseSharedClientLeaseAndRetireOneShotClient();
			if (usageLimitError) {
				await markCodexAuthProfileBlockedFromRateLimits({
					params,
					authProfileId: startupAuthProfileId,
					rateLimits: usageLimitError.rateLimitsForProfile
				});
				return { result: buildCodexTurnStartFailureResult({
					params,
					message: usageLimitError.message,
					promptError: createCodexUsageLimitPromptError(usageLimitError.message),
					messagesSnapshot,
					systemPromptReport
				}) };
			}
			if (isCodexContextRestartSelectionChangedError(turnStartError)) return { result: {
				...buildCodexTurnStartFailureResult({
					params,
					message,
					messagesSnapshot,
					systemPromptReport
				}),
				codexAppServerFailure: {
					kind: "client_closed_before_turn_completed",
					transport: appServer.start.transport,
					threadId: resourceState.thread.threadId,
					replaySafe: true
				}
			} };
			throw turnStartError;
		}
	}
	if (!turn) {
		activateNativePreToolUseFailureFallback();
		await releaseSharedClientLeaseAndRetireOneShotClient();
		throw new Error("codex app-server turn/start failed without an error");
	}
	const authoritySourceRef = context.attemptTools.scheduledAppAuthoritySourceRef;
	if (resourceState.thread.pluginAppPolicyContext) authoritySourceRef.current = {
		client: resourceState.client,
		threadId: resourceState.thread.threadId,
		policyContext: resourceState.thread.pluginAppPolicyContext,
		configCwd: connection.effectiveCwd
	};
	turnIdRef.current = turn.turn.id;
	resourceState.nativeSubagentMonitor?.bindTurn(turn.turn.id);
	return { turn };
}
//#endregion
//#region extensions/codex/src/app-server/attempt-turn-watches.ts
/**
* Idle-watch controller for Codex app-server turn progress, completion, and
* terminal-event gaps.
*/
/**
* Creates a controller that arms/disarms timers as Codex app-server
* notifications and tool handoffs progress.
*/
function createCodexAttemptTurnWatchController(params) {
	const timers = {};
	let completionIdleWatchArmed = false;
	let completionIdleWatchPinnedByTerminalError = false;
	let completionIdleTimeoutOverrideMs;
	let assistantCompletionIdleWatchArmed = false;
	let assistantCompletionLastActivityAt = Date.now();
	let assistantCompletionLastActivityDetails;
	let attemptIdleWatchArmed = false;
	let terminalIdleWatchArmed = false;
	let completionLastActivityAt = Date.now();
	let completionLastActivityReason = "startup";
	let completionLastActivityDetails;
	let attemptIdleTimeoutOverrideMs;
	let attemptLastProgressAt = Date.now();
	let attemptLastProgressReason = "startup";
	let attemptLastProgressDetails;
	const turnCompletionIdleTimeoutMs = resolveTimerTimeoutMs(params.turnCompletionIdleTimeoutMs, 1);
	const turnAssistantCompletionIdleTimeoutMs = resolveTimerTimeoutMs(params.turnAssistantCompletionIdleTimeoutMs, 1);
	const turnAttemptIdleTimeoutMs = resolveTimerTimeoutMs(params.turnAttemptIdleTimeoutMs, 1);
	const turnTerminalIdleTimeoutMs = resolveTimerTimeoutMs(params.turnTerminalIdleTimeoutMs, 1);
	const interruptTimeoutMs = resolveTimerTimeoutMs(params.interruptTimeoutMs, 1);
	const resolveWatchTimeoutMs = (timeoutMs) => resolveTimerTimeoutMs(timeoutMs, 1);
	const clearTimer = (kind) => {
		const timer = timers[kind];
		if (timer) {
			clearTimeout(timer);
			delete timers[kind];
		}
	};
	const clearCompletionIdleTimer = () => clearTimer("completion");
	const clearAllTimers = () => {
		for (const kind of Object.keys(timers)) clearTimer(kind);
	};
	function scheduleWatch(kind, callback, lastActivityAt, timeoutMs, ready) {
		clearTimer(kind);
		if (!ready || params.isCompleted() || params.signal.aborted) return;
		const elapsedMs = Math.max(0, Date.now() - lastActivityAt);
		const timer = setTimeout(callback, Math.max(1, timeoutMs - elapsedMs));
		timer.unref?.();
		timers[kind] = timer;
	}
	function scheduleCompletionIdleWatch() {
		scheduleWatch("completion", fireCompletionIdleTimeout, completionLastActivityAt, completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs, completionIdleWatchArmed && params.getActiveAppServerTurnRequests() === 0 && params.getActiveCompletionBlockerItemCount() === 0);
	}
	function scheduleAssistantCompletionIdleWatch() {
		scheduleWatch("assistant", fireAssistantCompletionIdleRelease, assistantCompletionLastActivityAt, turnAssistantCompletionIdleTimeoutMs, assistantCompletionIdleWatchArmed && params.getActiveFinalizationHookCount() === 0);
	}
	function shouldPauseAttemptIdleWatch() {
		if (params.getActiveAppServerTurnRequestsWithoutTimeout() > 0) return false;
		return params.getActiveCompletionBlockerItemCount() > 0 || params.getActiveAppServerTurnRequests() > 0;
	}
	function scheduleAttemptIdleWatch() {
		scheduleWatch("attempt", fireAttemptIdleTimeout, attemptLastProgressAt, attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs, attemptIdleWatchArmed && !shouldPauseAttemptIdleWatch());
	}
	function scheduleTerminalIdleWatch() {
		scheduleWatch("terminal", fireTerminalIdleTimeout, completionLastActivityAt, turnTerminalIdleTimeoutMs, terminalIdleWatchArmed && params.getActiveAppServerTurnRequests() === 0);
	}
	function scheduleProgressWatches() {
		scheduleAttemptIdleWatch();
		scheduleCompletionIdleWatch();
		scheduleTerminalIdleWatch();
	}
	function isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs) {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !completionIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0 || params.getActiveCompletionBlockerItemCount() > 0) return false;
		const completionTimeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
		if (completionTimeoutMs > timeoutMs) return false;
		return Math.max(0, Date.now() - completionLastActivityAt) >= completionTimeoutMs;
	}
	function recordAttemptProgress(reason, options) {
		attemptIdleTimeoutOverrideMs = options?.attemptTimeoutMs !== void 0 ? resolveWatchTimeoutMs(options.attemptTimeoutMs) : void 0;
		attemptLastProgressAt = completionLastActivityAt;
		attemptLastProgressReason = reason;
		attemptLastProgressDetails = options?.details;
		params.onAttemptProgress(reason, options?.details);
		scheduleAttemptIdleWatch();
	}
	function fireAssistantCompletionIdleRelease() {
		if (params.isCompleted() || params.signal.aborted || !assistantCompletionIdleWatchArmed) return;
		if (params.getActiveAppServerTurnRequests() > 0 || params.getActiveTurnItemCount() > 0 || params.getActiveFinalizationHookCount() > 0) {
			scheduleAssistantCompletionIdleWatch();
			return;
		}
		if (!params.canReleaseAssistantCompletionIdle()) {
			assistantCompletionIdleWatchArmed = false;
			assistantCompletionLastActivityDetails = void 0;
			clearTimer("assistant");
			return;
		}
		const idleMs = Math.max(0, Date.now() - assistantCompletionLastActivityAt);
		if (idleMs < turnAssistantCompletionIdleTimeoutMs) {
			scheduleAssistantCompletionIdleWatch();
			return;
		}
		assistantCompletionIdleWatchArmed = false;
		clearCompletionIdleTimer();
		clearTimer("terminal");
		const turnId = params.getTurnId();
		const fields = {
			threadId: params.threadId,
			turnId,
			idleMs,
			timeoutMs: turnAssistantCompletionIdleTimeoutMs,
			...assistantCompletionLastActivityDetails
		};
		params.onRecordEvent("turn.assistant_completion_idle_release", fields);
		log.warn("codex app-server turn released after completed assistant item without terminal event", fields);
		if (turnId) {
			params.onInterruptTurn({
				threadId: params.threadId,
				turnId,
				timeoutMs: interruptTimeoutMs
			}).finally(params.onCompleted);
			return;
		}
		params.onCompleted();
	}
	function reportTimeout(timeout) {
		params.onTimeout(timeout);
		const fields = {
			threadId: params.threadId,
			turnId: params.getTurnId(),
			idleMs: timeout.idleMs,
			timeoutMs: timeout.timeoutMs,
			lastActivityReason: timeout.lastActivityReason,
			...timeout.details
		};
		params.onRecordEvent(`turn.${timeout.kind}_idle_timeout`, fields);
		log.warn(`codex app-server turn idle timed out waiting for ${timeout.kind === "terminal" ? "terminal event" : timeout.kind}`, fields);
		params.onAbort(`turn_${timeout.kind}_idle_timeout`);
	}
	function fireAttemptIdleTimeout() {
		if (params.isCompleted() || params.signal.aborted || !attemptIdleWatchArmed || shouldPauseAttemptIdleWatch()) return;
		const idleMs = Math.max(0, Date.now() - attemptLastProgressAt);
		const timeoutMs = attemptIdleTimeoutOverrideMs ?? turnAttemptIdleTimeoutMs;
		if (idleMs < timeoutMs) {
			scheduleAttemptIdleWatch();
			return;
		}
		if (isCompletionIdleTimeoutDueBeforeAttempt(timeoutMs)) {
			fireCompletionIdleTimeout();
			return;
		}
		reportTimeout({
			kind: "progress",
			idleMs,
			timeoutMs,
			lastActivityReason: attemptLastProgressReason,
			details: attemptLastProgressDetails
		});
	}
	function fireCompletionIdleTimeout() {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !completionIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0 || params.getActiveCompletionBlockerItemCount() > 0) return;
		const timeoutMs = completionIdleTimeoutOverrideMs ?? turnCompletionIdleTimeoutMs;
		const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
		if (idleMs < timeoutMs) {
			scheduleCompletionIdleWatch();
			return;
		}
		const details = {
			...completionLastActivityDetails,
			activeAppServerTurnRequests: params.getActiveAppServerTurnRequests(),
			activeTurnItemCount: params.getActiveTurnItemCount(),
			terminalTurnNotificationQueued: params.isTerminalTurnNotificationQueued(),
			completionIdleWatchArmed,
			assistantCompletionIdleWatchArmed,
			terminalIdleWatchArmed
		};
		reportTimeout({
			kind: "completion",
			idleMs,
			timeoutMs,
			lastActivityReason: completionLastActivityReason,
			details
		});
	}
	function fireTerminalIdleTimeout() {
		if (params.isCompleted() || params.isTerminalTurnNotificationQueued() || params.signal.aborted || !terminalIdleWatchArmed || params.getActiveAppServerTurnRequests() > 0) return;
		const idleMs = Math.max(0, Date.now() - completionLastActivityAt);
		if (idleMs < turnTerminalIdleTimeoutMs) {
			scheduleTerminalIdleWatch();
			return;
		}
		reportTimeout({
			kind: "terminal",
			idleMs,
			timeoutMs: turnTerminalIdleTimeoutMs,
			lastActivityReason: completionLastActivityReason,
			details: completionLastActivityDetails
		});
	}
	return {
		isCompletionIdleWatchArmed: () => completionIdleWatchArmed,
		isCompletionIdleWatchPinnedByTerminalError: () => completionIdleWatchPinnedByTerminalError,
		isAssistantCompletionIdleWatchArmed: () => assistantCompletionIdleWatchArmed,
		armAttemptIdleWatch: () => {
			attemptIdleWatchArmed = true;
			scheduleAttemptIdleWatch();
		},
		armTerminalIdleWatch: () => {
			terminalIdleWatchArmed = true;
			scheduleTerminalIdleWatch();
		},
		armCompletionIdleWatch: (options) => {
			completionIdleWatchArmed = true;
			completionIdleWatchPinnedByTerminalError = options?.pinnedByTerminalError === true;
			completionIdleTimeoutOverrideMs = options?.timeoutMs !== void 0 ? resolveWatchTimeoutMs(options.timeoutMs) : void 0;
			scheduleCompletionIdleWatch();
		},
		disarmCompletionIdleWatch: () => {
			completionIdleWatchArmed = false;
			completionIdleWatchPinnedByTerminalError = false;
			completionIdleTimeoutOverrideMs = void 0;
			clearCompletionIdleTimer();
		},
		armAssistantCompletionIdleWatch: (details) => {
			assistantCompletionIdleWatchArmed = true;
			assistantCompletionLastActivityAt = Date.now();
			assistantCompletionLastActivityDetails = details;
			scheduleAssistantCompletionIdleWatch();
		},
		disarmAssistantCompletionIdleWatch: () => {
			assistantCompletionIdleWatchArmed = false;
			assistantCompletionLastActivityDetails = void 0;
			clearTimer("assistant");
		},
		touchActivity: (reason, options) => {
			completionLastActivityAt = Date.now();
			completionLastActivityReason = reason;
			completionLastActivityDetails = options?.details;
			if (options?.attemptProgress) recordAttemptProgress(reason, options);
			params.onProgressDiagnostic(reason);
			if (options?.arm) {
				completionIdleWatchArmed = true;
				completionIdleWatchPinnedByTerminalError = false;
			}
			scheduleProgressWatches();
		},
		noteNotificationReceived: (method, options) => {
			const now = Date.now();
			completionLastActivityAt = Math.max(completionLastActivityAt, Math.min(now, options?.receivedAtMs ?? now));
			completionLastActivityReason = `notification:${method}`;
			if (options?.details !== void 0) completionLastActivityDetails = options.details;
			if (options?.attemptProgress) recordAttemptProgress(completionLastActivityReason, options);
		},
		extendAttemptIdleWatch: (timeoutMs) => {
			attemptIdleTimeoutOverrideMs = resolveWatchTimeoutMs(timeoutMs);
			scheduleAttemptIdleWatch();
		},
		scheduleProgressWatches,
		clearCompletionIdleTimer,
		clearAllTimers
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt-turn-state.ts
const CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS = 6e4;
function createCodexAttemptTurnState(resources) {
	const { prompt, state: resourceState, projectorRef, trajectoryRecorder, startupTimeoutMs } = resources;
	const { context } = prompt;
	const { connection } = context.runtime;
	const { params, options, appServer, runAbortController } = connection;
	const state = {
		latestStartupErrorNotification: void 0,
		rateLimitsRevisionBeforeLastTurnStart: void 0,
		completed: false,
		localCompletionRequested: false,
		terminalTurnNotificationQueued: false,
		sawCodexInterruptMarker: false,
		timedOut: false,
		turnCompletionIdleTimedOut: false,
		turnWatchTimeoutKind: void 0,
		turnWatchTimeoutIdleMs: void 0,
		turnWatchTimeoutMs: void 0,
		turnWatchTimeoutLastActivityReason: void 0,
		turnWatchTimeoutDetails: void 0,
		turnCompletionIdleTimeoutMessage: void 0,
		clientClosedPromptError: void 0,
		clientClosedDiagnostic: void 0,
		clientClosedAbort: false,
		shouldDelayNativeHookRelayUnregister: false,
		lifecycleStarted: false,
		lifecycleTerminalEmitted: false,
		nativeHookRelayLastRenewedAt: 0,
		activeAppServerTurnRequests: 0,
		activeAppServerTurnRequestsWithoutTimeout: 0,
		unsettledFinalizationHookCount: 0,
		rejectedFinalizationHookAssistant: void 0,
		turnCrossedToolHandoff: false,
		pendingTerminalDynamicToolRelease: void 0,
		terminalDynamicToolReleaseCheckScheduled: false,
		currentTurnHadNonTerminalDynamicToolResult: false
	};
	const { promise: completion, resolve: resolveCompletion } = createDeferred();
	const turnCompletionIdleTimeoutMs = resolveCodexTurnCompletionIdleTimeoutMs(options.turnCompletionIdleTimeoutMs ?? appServer.turnCompletionIdleTimeoutMs);
	const turnAssistantCompletionIdleTimeoutMs = resolveCodexTurnAssistantCompletionIdleTimeoutMs(options.turnAssistantCompletionIdleTimeoutMs ?? appServer.turnAssistantCompletionIdleTimeoutMs);
	const postToolRawAssistantCompletionIdleTimeoutMs = resolveCodexPostToolRawAssistantCompletionIdleTimeoutMs(options.postToolRawAssistantCompletionIdleTimeoutMs ?? appServer.postToolRawAssistantCompletionIdleTimeoutMs, turnAssistantCompletionIdleTimeoutMs);
	const turnTerminalIdleTimeoutMs = resolveCodexTurnTerminalIdleTimeoutMs(options.turnTerminalIdleTimeoutMs, params.runTimeoutOverrideMs);
	const turnAttemptIdleTimeoutMs = Math.max(100, Math.floor(params.timeoutMs));
	const pendingOpenClawDynamicToolCompletionIds = /* @__PURE__ */ new Set();
	const openClawDynamicToolExecutions = createCodexDynamicToolExecutionRegistry();
	const activeTurnItemIds = /* @__PURE__ */ new Set();
	const activeCompletionBlockerItemIds = /* @__PURE__ */ new Set();
	const activeFinalizationHookRunIds = /* @__PURE__ */ new Set();
	const finalizationHookBatchStatuses = /* @__PURE__ */ new Map();
	const turnIdRef = {};
	const userInputBridgeRef = {};
	const steeringQueueRef = {};
	const completeTurn = () => {
		if (state.completed) return;
		state.completed = true;
		steeringQueueRef.current?.cancel();
		turnWatches.clearAllTimers();
		resolveCompletion();
	};
	const interruptTurn = async (turnId, completionOptions) => {
		if (completionOptions?.locallyCompleted) state.localCompletionRequested = true;
		const completed = await interruptCodexTurnAndWaitBestEffort(resourceState.client, {
			threadId: resourceState.thread.threadId,
			turnId,
			timeoutMs: completionOptions?.timeoutMs
		});
		if (!completed) await closeCodexStartupClientBestEffort(resourceState.client);
		return completed;
	};
	const renewNativeHookRelayForTurnProgress = () => {
		if (!resourceState.nativeHookRelay || options.nativeHookRelay?.ttlMs !== void 0) return;
		const now = Date.now();
		const renewsRecently = now - state.nativeHookRelayLastRenewedAt < CODEX_NATIVE_HOOK_RELAY_RENEW_INTERVAL_MS;
		const expiresSoon = now >= resourceState.nativeHookRelay.expiresAtMs - CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
		if (renewsRecently && !expiresSoon) return;
		state.nativeHookRelayLastRenewedAt = now;
		resourceState.nativeHookRelay.renew(resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: void 0,
			attemptTimeoutMs: turnAttemptIdleTimeoutMs,
			startupTimeoutMs,
			turnStartTimeoutMs: params.timeoutMs
		}));
	};
	const turnWatches = createCodexAttemptTurnWatchController({
		threadId: resourceState.thread.threadId,
		signal: runAbortController.signal,
		getTurnId: () => turnIdRef.current,
		isCompleted: () => state.completed,
		isTerminalTurnNotificationQueued: () => state.terminalTurnNotificationQueued,
		getActiveAppServerTurnRequests: () => state.activeAppServerTurnRequests,
		getActiveAppServerTurnRequestsWithoutTimeout: () => state.activeAppServerTurnRequestsWithoutTimeout,
		getActiveTurnItemCount: () => activeTurnItemIds.size,
		getActiveCompletionBlockerItemCount: () => activeCompletionBlockerItemIds.size,
		getActiveFinalizationHookCount: () => state.unsettledFinalizationHookCount,
		canReleaseAssistantCompletionIdle: () => projectorRef.current?.hasLatestTerminalAssistantCandidateText() === true,
		turnCompletionIdleTimeoutMs,
		turnAssistantCompletionIdleTimeoutMs,
		turnAttemptIdleTimeoutMs,
		turnTerminalIdleTimeoutMs,
		interruptTimeoutMs: CODEX_APP_SERVER_INTERRUPT_TIMEOUT_MS,
		onInterruptTurn: ({ turnId, timeoutMs }) => interruptTurn(turnId, {
			locallyCompleted: true,
			timeoutMs
		}),
		onTimeout: (timeout) => {
			state.timedOut = true;
			state.turnCompletionIdleTimedOut = true;
			state.turnWatchTimeoutKind = timeout.kind;
			state.turnWatchTimeoutIdleMs = timeout.idleMs;
			state.turnWatchTimeoutMs = timeout.timeoutMs;
			state.turnWatchTimeoutLastActivityReason = timeout.lastActivityReason;
			state.turnWatchTimeoutDetails = timeout.details;
			state.turnCompletionIdleTimeoutMessage = "codex app-server turn idle timed out waiting for turn/completed";
			projectorRef.current?.markTimedOut();
		},
		onAbort: (reason) => runAbortController.abort(reason),
		onCompleted: completeTurn,
		onRecordEvent: (name, fields) => trajectoryRecorder?.recordEvent(name, fields),
		onAttemptProgress: (reason) => {
			renewNativeHookRelayForTurnProgress();
			params.onRunProgress?.({
				reason,
				provider: params.provider,
				model: params.modelId,
				backend: "codex-app-server"
			});
		},
		onProgressDiagnostic: (reason) => {
			emitTrustedDiagnosticEvent({
				type: "run.progress",
				runId: params.runId,
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				reason: `codex_app_server:${reason}`
			});
		}
	});
	return {
		state,
		completion,
		turnCompletionIdleTimeoutMs,
		turnAssistantCompletionIdleTimeoutMs,
		postToolRawAssistantCompletionIdleTimeoutMs,
		turnTerminalIdleTimeoutMs,
		turnAttemptIdleTimeoutMs,
		pendingOpenClawDynamicToolCompletionIds,
		openClawDynamicToolExecutions,
		activeTurnItemIds,
		activeCompletionBlockerItemIds,
		activeFinalizationHookRunIds,
		finalizationHookBatchStatuses,
		turnIdRef,
		userInputBridgeRef,
		steeringQueueRef,
		completeTurn,
		interruptTurn,
		renewNativeHookRelayForTurnProgress,
		turnWatches
	};
}
//#endregion
//#region extensions/codex/src/app-server/run-attempt.ts
async function runCodexAppServerAttempt(params, options) {
	const runtime = await prepareCodexAttemptRuntime(await prepareCodexAttemptConnection({
		params,
		options
	}));
	const resources = prepareCodexAttemptResources(await prepareCodexAttemptPrompt(await prepareCodexAttemptContext(runtime, await prepareCodexAttemptTools(runtime))));
	await startCodexAttemptRuntime(resources);
	const turnRuntime = createCodexAttemptTurnState(resources);
	const lifecycle = createCodexAttemptLifecycleController(resources, turnRuntime);
	const notifications = createCodexAttemptNotificationController(resources, turnRuntime, lifecycle);
	const { ensureCurrentThreadRoute } = await prepareCodexAttemptRoute(resources, turnRuntime, notifications, createCodexAttemptServerRequestController(resources, turnRuntime, lifecycle).handleServerRequest);
	const turnRequest = await prepareCodexAttemptTurnRequest(resources, turnRuntime, ensureCurrentThreadRoute, notifications.waitForActiveNativeTurnCompletion);
	const turnStart = await startCodexAttemptTurn(resources, turnRuntime, notifications, turnRequest);
	if ("result" in turnStart) return turnStart.result;
	const activeTurn = await activateCodexAttemptTurn(resources, turnRuntime, lifecycle, notifications, turnStart.turn);
	try {
		return await finalizeCodexAttempt(resources, turnRuntime, lifecycle, notifications, turnRequest, activeTurn);
	} finally {
		await cleanupCodexAttempt(resources, turnRuntime, lifecycle, turnRequest, activeTurn);
	}
}
//#endregion
export { runCodexAppServerAttempt };
