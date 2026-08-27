import { n as sliceUtf16Safe, r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject, t as coerceErrorMessage } from "./error-coercion-DisD0JTb.js";
import { C as parseStrictNonNegativeInteger, a as addTimerTimeoutGraceMs, h as finiteSecondsToTimerSafeMilliseconds, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord, c as isRecord, t as asNonArrayRecord, u as readStringField } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { r as root } from "./fs-safe-X_oyl7Rx.js";
import { l as resolveAgentDir } from "./agent-scope-config-CsnnOL14.js";
import { a as isSubagentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { d as hasPendingInternalDiagnosticEvent, o as emitTrustedDiagnosticEvent } from "./diagnostic-events-Djn4AVRp.js";
import { c as isBlockedHostnameOrIp, t as SsrFBlockedError } from "./ssrf-CQ4RdJXm.js";
import { J as finalizeToolTerminalPresentation, nt as consumeAdjustedParamsForToolCall, r as getBeforeToolCallFailureDisposition, rt as consumePreExecutionBlockedToolCall, u as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-rUQaaAPY.js";
import { c as resolveToolExecutionErrorKind, l as resolveToolResultFailureKind, n as isToolResultError, t as formatToolExecutionErrorMessage } from "./tool-result-error-CIJSdhiL.js";
import { d as saveMediaBuffer, s as getMediaDir } from "./store-CvNsGg9Z.js";
import { o as resolveModelAuthMode } from "./model-auth-BgXCiN_L.js";
import { n as isToolAllowed } from "./tool-policy-DhUMjkbX.js";
import { C as setBeforeToolCallDiagnosticsEnabled, S as isToolWrappedWithBeforeToolCallHook, g as getChannelAgentToolMeta } from "./gateway-IvUFCG_L.js";
import { i as getPluginToolMeta } from "./tools-BkbGUY3V.js";
import { r as isReplaySafeToolCall } from "./tool-mutation-D4StAzyF.js";
import { a as isMessagingToolSendAction, r as isMessagingTool } from "./embedded-agent-messaging-C9qejd0j.js";
import { t as runAgentHarnessAfterToolCallHook } from "./hook-helpers-CPjTRX5t.js";
import { n as isHostScopedAgentToolActive } from "./agent-tools.ring-zero-context-C-QXByzs.js";
import { t as log } from "./logger-BQ2aebRn.js";
import { n as sanitizeEnvVars } from "./sanitize-env-vars-CuvLvbib.js";
import { a as buildEmbeddedAttemptToolRunContext } from "./settled-turn-finalization-result-DJ-XWS4f.js";
import { i as resolveLiveToolResultMaxChars, t as DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS } from "./tool-result-limits-DISobJ_J.js";
import { r as sliceToolResultTextToBudget, t as estimateToolResultTextChars } from "./tool-result-text-budget-PxJMBljG.js";
import { o as normalizeHeartbeatToolResponse } from "./heartbeat-tool-response-CyHYyyCM.js";
import { n as normalizeAgentRuntimeTools } from "./tools-DFlVySyX.js";
import { i as projectRuntimeToolInputSchema, t as filterProviderNormalizableTools } from "./tool-schema-projection-ZrMdwk4s.js";
import { a as extractMessagingToolSend, i as filterToolResultMediaUrls, o as extractMessagingToolSendResult, r as extractToolResultMediaArtifact } from "./embedded-agent-tool-media-KjvMwMPe.js";
import { c as sanitizeToolResult } from "./embedded-agent-tool-results-BNVzkCt4.js";
import { n as isDeliveredMessageToolOnlySourceReplyResult, r as isDeliveredMessagingToolResult } from "./embedded-agent-message-tool-source-reply-sDukJQNW.js";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-D6EJ_Q3z.js";
import { r as resolveAttemptSpawnWorkspaceDir } from "./attempt-thread-helpers-RqtqcDvn.js";
import { t as createAgentToolResultMiddlewareRunner } from "./tool-result-middleware-BRI1jLZq.js";
import { i as runWithCronCreatorAuthorityCapabilityResolver } from "./cron-creator-authority-context-jKyB9xcY.js";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.js";
import { t as isApprovalNotFoundError } from "./approval-errors-Bzw_-cAg.js";
import "./error-runtime-oXQewkZq.js";
import { t as expectDefined } from "./expect-runtime--WgnKYXT.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as formatApprovalDisplayPath } from "./approval-display-paths-DlQSsCnq.js";
import { f as createCodexAppServerToolResultExtensionRunner } from "./agent-harness-runtime-m419GIim.js";
import { n as invokeNativeHookRelay, o as resolveNativeHookRelayDeferredToolApproval, t as hasNativeHookRelayInvocation } from "./native-hook-relay-BqmjmOxx.js";
import "./agent-runtime-BrXIJxek.js";
import { A as readCodexPluginConfig, O as isCodexRemoteExecPlacementSandbox } from "./session-binding-CuZlPg0f.js";
import { ct as CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE, d as releaseLeasedSharedCodexAppServerClient, ut as isJsonObject, w as resolveCodexGatewayTimeoutWithGraceMs } from "./shared-client-B5mi5IxU.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-utility-runtime-BSdEoze8.js";
import { o as createDeferred } from "./extension-shared-D4oakjAV.js";
import { E as itemStatus, P as readItem, b as auditNativeToolUnfinishedStatus, h as isCodexNotificationForTurn, v as auditNativeToolName, y as auditNativeToolTerminalStatus } from "./attempt-client-cleanup-o--1yVH9.js";
import { r as sanitizeInlineImageDataUrl, t as invalidInlineImageText } from "./image-payload-sanitizer-CU0iwcQa.js";
import { G as filterCodexDynamicToolsForDisabledNativeSurface, J as normalizeCodexDynamicToolName, K as isForcedPrivateQaCodexRuntime, U as resolveCodexWebSearchPlan, W as filterCodexDynamicTools, q as isSystemAgentOnlyCodexDynamicToolAllowlist } from "./thread-lifecycle-Dd9pvkoI.js";
import "./media-store-BggRqAk6.js";
import "./diagnostic-runtime-D2EQVlem.js";
import { t as registerRetainedNativeHookRelayForBundledRuntime } from "./native-hook-relay-runtime-79-wmMSq.js";
import { l as readCodexTurn } from "./protocol-validators-DQMpwHD0.js";
import "./file-access-runtime-DIwyQCYy.js";
import "./media-runtime-B_HWTN-G.js";
import { r as formatCodexDisplayText } from "./command-formatters-C9xt78Pf.js";
import "./codex-mcp-projection-B5HHHqEY.js";
import "./sandbox--CGfwVXk.js";
import { a as resolveCodexNodeExecToolOverrides, i as resolveCodexNativeExecutionPolicy } from "./sandbox-guard-C7UKRWEI.js";
import { g as normalizeOpenAIToolSchemas } from "./provider-tools-mj-Qt8cY.js";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createHash, randomUUID } from "node:crypto";
import path, { posix } from "node:path";
import { spawn } from "node:child_process";
import { isIP } from "node:net";
import { once } from "node:events";
import { WebSocketServer } from "ws";
//#region extensions/codex/src/app-server/dynamic-tool-response-state.ts
/** Retains the host-owned app preview without adding it to Codex's response payload. */
function withDynamicToolTranscriptDetails(response, details) {
	if (!details || typeof details !== "object" || Array.isArray(details)) return response;
	const mcpAppPreview = details.mcpAppPreview;
	if (!mcpAppPreview || typeof mcpAppPreview !== "object" || Array.isArray(mcpAppPreview)) return response;
	Object.defineProperty(response, "transcriptDetails", {
		configurable: true,
		enumerable: false,
		value: { mcpAppPreview }
	});
	return response;
}
function withDynamicToolTerminalResolution(response, terminalResolution) {
	if (terminalResolution) {
		Object.defineProperties(response, {
			terminalResolution: {
				configurable: true,
				enumerable: false,
				value: terminalResolution
			},
			executionStarted: {
				configurable: true,
				enumerable: false,
				value: terminalResolution.executionStarted
			},
			...terminalResolution.executedArguments ? { executedArguments: {
				configurable: true,
				enumerable: false,
				value: terminalResolution.executedArguments
			} } : {}
		});
		withDynamicToolSideEffectEvidence(response, terminalResolution.sideEffectEvidence);
	}
	return response;
}
function withDynamicToolExecutionState(response, state) {
	Object.defineProperties(response, {
		executedArguments: {
			configurable: true,
			enumerable: false,
			value: state.executedArguments
		},
		executionStarted: {
			configurable: true,
			enumerable: false,
			value: state.executionStarted
		}
	});
	return withDynamicToolSideEffectEvidence(response, state.sideEffectEvidence === true);
}
function withDynamicToolSideEffectEvidence(response, sideEffectEvidence) {
	if (!sideEffectEvidence) {
		delete response.sideEffectEvidence;
		return response;
	}
	Object.defineProperty(response, "sideEffectEvidence", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function createFailedDynamicToolResponse(message, options) {
	const response = {
		contentItems: [{
			type: "inputText",
			text: message
		}],
		success: false
	};
	Object.defineProperties(response, {
		diagnosticTerminalReason: {
			configurable: true,
			enumerable: false,
			value: options?.terminalReason ?? "failed"
		},
		diagnosticTerminalType: {
			configurable: true,
			enumerable: false,
			value: "error"
		}
	});
	if (options?.executionStarted !== void 0) Object.defineProperty(response, "executionStarted", {
		configurable: true,
		enumerable: false,
		value: options.executionStarted
	});
	if (options?.executedArguments !== void 0) Object.defineProperty(response, "executedArguments", {
		configurable: true,
		enumerable: false,
		value: options.executedArguments
	});
	return withDynamicToolSideEffectEvidence(response, options?.sideEffectEvidence === true);
}
//#endregion
//#region extensions/codex/src/app-server/tool-abort-terminal-reason.ts
/** Leaf helper shared by native and dynamic tool diagnostics. */
const CODEX_TIMEOUT_ABORT_REASONS = /* @__PURE__ */ new Set([
	"codex_startup_timeout",
	"turn_completion_idle_timeout",
	"turn_progress_idle_timeout",
	"turn_terminal_idle_timeout"
]);
/** Preserves timeout provenance when an enclosing run aborts an active tool. */
function resolveCodexToolAbortTerminalReason(signal) {
	try {
		const reason = signal.reason;
		if (typeof reason === "string") {
			if (CODEX_TIMEOUT_ABORT_REASONS.has(reason)) return "timed_out";
			return reason === "client_closed" ? "failed" : "cancelled";
		}
		if (reason && typeof reason === "object") {
			const record = reason;
			if (record.name === "TimeoutError" || record.reason === "timeout") return "timed_out";
		}
	} catch {
		return "cancelled";
	}
	return "cancelled";
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-execution.ts
/**
* Timeout, terminal-release, and diagnostic helpers for Codex dynamic tool
* calls.
*/
/** Default timeout for Codex dynamic tool calls. */
const CODEX_DYNAMIC_TOOL_TIMEOUT_MS = 9e4;
/** Hard cap for per-call Codex dynamic tool timeout overrides. */
const CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS = 6e5;
const CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS = 3e4;
const CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS = 12e4;
const CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS = 3e4;
const CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS = 3e4;
/** Timeout for image-understanding style dynamic tool calls. */
const CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS = 6e4;
/** Timeout for message-delivery dynamic tool calls. */
const CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS = 6e5;
/** Outer default for collector waits: full swarm budget plus completion grace. */
const CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS = 63e4;
const LOG_FIELD_MAX_LENGTH = 160;
function normalizeLogField(value) {
	if (typeof value !== "string") return;
	const normalized = value.replaceAll(String.fromCharCode(27), " ").replaceAll("\r", " ").replaceAll("\n", " ").replaceAll("	", " ").trim();
	if (!normalized) return;
	return normalized.length > LOG_FIELD_MAX_LENGTH ? `${truncateUtf16Safe(normalized, LOG_FIELD_MAX_LENGTH - 3)}...` : normalized;
}
function readNumericTimeoutMs(value) {
	if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
	if (typeof value === "string") {
		const parsed = parseStrictNonNegativeInteger(value);
		if (parsed !== void 0) return Math.max(0, Math.floor(parsed));
	}
}
function formatDynamicToolTimeoutDetails(params) {
	const tool = normalizeLogField(params.call.tool) ?? "unknown";
	const baseMeta = {
		tool: params.call.tool,
		toolCallId: params.call.callId,
		threadId: params.call.threadId,
		turnId: params.call.turnId,
		timeoutMs: params.timeoutMs,
		timeoutKind: "codex_dynamic_tool_rpc"
	};
	if (tool !== "process" || !isJsonObject(params.call.arguments)) return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms while running tool ${tool}.`,
		consoleMessage: `codex dynamic tool timeout: tool=${tool} toolTimeoutMs=${params.timeoutMs}; per-tool-call watchdog, not session idle`,
		meta: baseMeta
	};
	const action = normalizeLogField(params.call.arguments.action);
	const sessionId = normalizeLogField(params.call.arguments.sessionId);
	const requestedTimeoutMs = readNumericTimeoutMs(params.call.arguments.timeout);
	const actionPart = action ? ` action=${action}` : "";
	const sessionPart = sessionId ? ` sessionId=${sessionId}` : "";
	const requestedPart = requestedTimeoutMs === void 0 ? "" : ` requestedWaitMs=${requestedTimeoutMs}`;
	const retryHint = action === "poll" ? "; repeated lines usually mean process-poll retry churn, not model progress" : "";
	const responseTarget = action || sessionId ? ` while waiting for process${actionPart}${sessionPart}` : " while waiting for the process tool";
	return {
		responseMessage: `OpenClaw dynamic tool call timed out after ${params.timeoutMs}ms${responseTarget}. This is a tool RPC timeout, not a session idle timeout.`,
		consoleMessage: `codex process tool timeout:${actionPart}${sessionPart} toolTimeoutMs=${params.timeoutMs}${requestedPart}; per-tool-call watchdog, not session idle${retryHint}`,
		meta: {
			...baseMeta,
			processAction: action,
			processSessionId: sessionId,
			processRequestedTimeoutMs: requestedTimeoutMs
		}
	};
}
/**
* Runs a dynamic tool call with run-abort and per-call timeout handling,
* returning a Codex protocol response instead of throwing.
*/
async function handleDynamicToolCallWithTimeout(params) {
	let didNotifyAgentToolResult = false;
	const conservativeRaceResponses = /* @__PURE__ */ new WeakSet();
	const finalizeTerminal = (response) => {
		const executionSnapshot = params.toolBridge.consumeToolExecutionSnapshot?.(params.call.callId);
		const observedExecutionStarted = executionSnapshot?.executionStarted ?? (conservativeRaceResponses.has(response) ? void 0 : response.executionStarted);
		const terminalResolution = params.observeToolTerminal?.({
			toolCallId: params.call.callId,
			toolName: params.call.tool,
			arguments: response.executedArguments ?? executionSnapshot?.executedArguments ?? params.call.arguments,
			...params.toolMeta ? { meta: params.toolMeta } : {},
			...observedExecutionStarted !== void 0 ? { executionStarted: observedExecutionStarted } : {},
			outcome: response.success ? "success" : "failure",
			...!response.success ? { failure: { error: readDynamicToolResponseText(response) } } : {}
		});
		return withDynamicToolTerminalResolution(response, terminalResolution);
	};
	const createFailedAfterPossibleDispatch = (message, terminalReason) => {
		const response = createFailedDynamicToolResponse(message, {
			executionStarted: true,
			sideEffectEvidence: true,
			terminalReason
		});
		conservativeRaceResponses.add(response);
		return response;
	};
	const notifyAgentToolResult = (event) => {
		if (didNotifyAgentToolResult) return;
		didNotifyAgentToolResult = true;
		try {
			params.onAgentToolResult?.(event);
		} catch (error) {
			log.warn(`onAgentToolResult handler failed: tool=${params.call.tool} error=${String(error)}`);
		}
	};
	const notifyFailedToolResult = (message, terminalReason = "failed") => {
		notifyAgentToolResult({
			toolName: params.call.tool,
			result: {
				content: [{
					type: "text",
					text: message
				}],
				details: {
					status: terminalReason,
					error: message
				}
			},
			isError: true
		});
	};
	if (params.signal.aborted) {
		const message = "OpenClaw dynamic tool call aborted before execution.";
		const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
		params.onFallbackSelected?.();
		notifyFailedToolResult(message, terminalReason);
		return finalizeTerminal(createFailedDynamicToolResponse(message, {
			executionStarted: false,
			terminalReason
		}));
	}
	const controller = new AbortController();
	let timeout;
	let timedOut = false;
	let resolveAbort;
	const abortFromRun = () => {
		const message = "OpenClaw dynamic tool call aborted.";
		const terminalReason = resolveCodexToolAbortTerminalReason(params.signal);
		params.onFallbackSelected?.();
		controller.abort(params.signal.reason ?? /* @__PURE__ */ new Error(message));
		notifyFailedToolResult(message, terminalReason);
		resolveAbort?.(createFailedAfterPossibleDispatch(message, terminalReason));
	};
	const abortPromise = new Promise((resolve) => {
		resolveAbort = resolve;
	});
	const timeoutPromise = new Promise((resolve) => {
		const timeoutMs = clampDynamicToolTimeoutMs(params.timeoutMs);
		timeout = setTimeout(() => {
			timedOut = true;
			const timeoutDetails = formatDynamicToolTimeoutDetails({
				call: params.call,
				timeoutMs
			});
			params.onFallbackSelected?.();
			controller.abort(new Error(timeoutDetails.responseMessage));
			params.onTimeout?.();
			log.warn("codex dynamic tool call timed out", {
				...timeoutDetails.meta,
				consoleMessage: timeoutDetails.consoleMessage
			});
			notifyFailedToolResult(timeoutDetails.responseMessage, "timed_out");
			resolve(createFailedAfterPossibleDispatch(timeoutDetails.responseMessage, "timed_out"));
		}, timeoutMs);
		timeout.unref?.();
	});
	try {
		params.signal.addEventListener("abort", abortFromRun, { once: true });
		if (params.signal.aborted) abortFromRun();
		const response = await Promise.race([
			params.toolBridge.handleToolCall(params.call, {
				signal: controller.signal,
				onAgentToolResult: notifyAgentToolResult,
				toolCallOrdinal: params.toolCallOrdinal,
				retainExecutionSnapshot: true
			}),
			abortPromise,
			timeoutPromise
		]);
		if (!response.success && !didNotifyAgentToolResult) notifyFailedToolResult(readDynamicToolResponseText(response), response.diagnosticTerminalReason ?? "failed");
		return finalizeTerminal(response);
	} catch (error) {
		const terminalReason = params.signal.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : resolveToolExecutionErrorKind(error);
		const message = formatToolExecutionErrorMessage(error, "OpenClaw dynamic tool call failed.");
		notifyFailedToolResult(message, terminalReason);
		return finalizeTerminal(createFailedAfterPossibleDispatch(message, terminalReason));
	} finally {
		if (timeout) clearTimeout(timeout);
		params.signal.removeEventListener("abort", abortFromRun);
		resolveAbort = void 0;
		if (!timedOut && !controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("OpenClaw dynamic tool call finished."));
	}
}
function readDynamicToolResponseText(response) {
	return response.contentItems.flatMap((item) => item.type === "inputText" && typeof item.text === "string" ? [item.text] : []).join("\n").trim() || "OpenClaw dynamic tool call failed.";
}
/** Strips OpenClaw-only metadata before sending a dynamic tool response to Codex. */
function toCodexDynamicToolProtocolResponse(response) {
	return {
		contentItems: response.contentItems,
		success: response.success
	};
}
/** Adds async-started progress details when a tool result continues out of band. */
function toCodexDynamicToolProgressResponse(response, protocolResponse) {
	const transcriptDetails = response.transcriptDetails;
	if (response.asyncStarted !== true && transcriptDetails === void 0) return protocolResponse;
	return {
		...protocolResponse,
		...transcriptDetails ? { details: transcriptDetails } : {},
		...response.asyncStarted === true ? { details: {
			...transcriptDetails,
			async: true,
			status: "started"
		} } : {}
	};
}
/** Decides whether a terminal dynamic tool response can release the Codex turn. */
function shouldReleaseTurnAfterTerminalDynamicTool(state) {
	return !state.completed && !state.aborted && state.responseSuccess && !state.currentTurnHadNonTerminalDynamicToolResult && state.activeAppServerTurnRequests === 0 && state.activeTurnItemIdsCount === 0 && state.pendingOpenClawDynamicToolCompletionIdsCount === 0;
}
/** Returns true when a non-async result should block terminal-release shortcuts. */
function shouldBlockTerminalReleaseForNonTerminalDynamicToolResult(response) {
	return response.asyncStarted !== true;
}
/** Resolves whether terminal diagnostic state should release, wait, or stay idle. */
function resolveTerminalDynamicToolBatchAction(state) {
	if (state.activeAppServerTurnRequests > 0 || state.activeTurnItemIdsCount > 0 || state.pendingOpenClawDynamicToolCompletionIdsCount > 0) return "wait";
	if (state.currentTurnHadNonTerminalDynamicToolResult) return "clear-nonterminal-batch";
	if (state.hasPendingTerminalDynamicToolRelease) return "release-pending-terminal";
	return "idle";
}
/** Returns true for diagnostic events that terminate a dynamic tool call. */
function isDynamicToolTerminalDiagnosticEvent(event) {
	return event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
/** Matches terminal diagnostics to a specific dynamic tool call id/name. */
function isMatchingDynamicToolTerminalDiagnostic(params) {
	if (params.event.toolCallId !== params.call.callId || params.event.toolName !== params.call.tool) return false;
	if (params.runId !== void 0) return params.event.runId === params.runId;
	if (params.sessionId !== void 0) return params.event.sessionId === params.sessionId;
	if (params.sessionKey !== void 0) return params.event.sessionKey === params.sessionKey;
	return params.event.runId === void 0 && params.event.sessionId === void 0 && params.event.sessionKey === void 0;
}
/** Checks pending diagnostics for a terminal event matching a tool call. */
function hasPendingDynamicToolTerminalDiagnostic(params) {
	return hasPendingInternalDiagnosticEvent((event) => {
		if (!isDynamicToolTerminalDiagnosticEvent(event)) return false;
		return isMatchingDynamicToolTerminalDiagnostic({
			event,
			call: params.call,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		});
	});
}
/** Resolves per-tool timeout, applying media/message defaults and hard caps. */
function resolveDynamicToolCallTimeoutMs(params) {
	if (params.call.tool === "computer") return clampDynamicToolTimeoutMs(readComputerToolTimeoutMs(params.call.arguments));
	if (params.call.tool === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
	if (params.call.tool === "agents_wait") {
		const requestedMs = readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? CODEX_DYNAMIC_AGENTS_WAIT_TOOL_TIMEOUT_MS;
		return Math.max(1, Math.min(63e4, Math.floor(requestedMs)));
	}
	return clampDynamicToolTimeoutMs(readDynamicToolCallTimeoutMs(params.call.arguments) ?? readConfiguredDynamicToolTimeoutMs(params.call.tool, params.config) ?? CODEX_DYNAMIC_TOOL_TIMEOUT_MS);
}
function readComputerToolTimeoutMs(value) {
	const args = isJsonObject(value) ? value : void 0;
	const action = typeof args?.action === "string" ? args.action : void 0;
	const gatewayTimeoutMs = readPositiveFiniteTimeoutMs(args?.timeoutMs) ?? CODEX_DYNAMIC_COMPUTER_GATEWAY_TIMEOUT_MS;
	const gatewayCallCount = action === "screenshot" || action === "wait" ? 3 : 4;
	return (action === "wait" || action === "hold_key" ? Math.max(0, Number(args?.duration) || 0) * 1e3 : 0) + gatewayCallCount * gatewayTimeoutMs + CODEX_DYNAMIC_COMPUTER_COMPLETION_GRACE_MS;
}
function readDynamicToolCallTimeoutMs(value) {
	if (!isJsonObject(value)) return;
	const timeoutMs = readPositiveFiniteTimeoutMs(value.timeoutMs);
	if (timeoutMs !== void 0) return timeoutMs;
	const timeoutSecondsMs = readDynamicToolTimeoutSecondsAsMs(value.timeoutSeconds);
	return timeoutSecondsMs === void 0 ? void 0 : addTimerTimeoutGraceMs(timeoutSecondsMs, CODEX_DYNAMIC_TOOL_TIMEOUT_SECONDS_GRACE_MS);
}
function readConfiguredDynamicToolTimeoutMs(toolName, config) {
	if (toolName === "image_generate") {
		const imageModel = config?.agents?.defaults?.mediaModels?.image;
		if (!imageModel || typeof imageModel !== "object") return CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
		return readPositiveFiniteTimeoutMs(imageModel.timeoutMs) ?? CODEX_DYNAMIC_IMAGE_GENERATION_TOOL_TIMEOUT_MS;
	}
	if (toolName === "image") {
		const candidates = (config?.tools?.media?.models ?? []).filter((entry) => !entry.capabilities || entry.capabilities.includes("image"));
		const capabilityTimeoutMs = readTimeoutSecondsAsMs(config?.tools?.media?.image?.timeoutSeconds);
		return Math.max(capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS, ...candidates.map((entry) => readTimeoutSecondsAsMs(entry.timeoutSeconds) ?? capabilityTimeoutMs ?? CODEX_DYNAMIC_IMAGE_TOOL_TIMEOUT_MS));
	}
	if (toolName === "message") return CODEX_DYNAMIC_MESSAGE_TOOL_TIMEOUT_MS;
}
function readTimeoutSecondsAsMs(value) {
	const seconds = readPositiveFiniteTimeoutMs(value);
	return seconds === void 0 ? void 0 : seconds * 1e3;
}
function readDynamicToolTimeoutSecondsAsMs(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || !Number.isInteger(value) || value <= 0) return;
	return value * 1e3;
}
function readPositiveFiniteTimeoutMs(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.floor(value) : void 0;
}
function clampDynamicToolTimeoutMs(timeoutMs) {
	return Math.max(1, Math.min(CODEX_DYNAMIC_TOOL_MAX_TIMEOUT_MS, Math.floor(timeoutMs)));
}
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay-state.ts
const pending = /* @__PURE__ */ new Set();
/** Owns delayed hook-relay cleanup across runtime scheduling and test teardown. */
const nativeHookRelayUnregisterQueue = {
	add(entry) {
		pending.add(entry);
	},
	delete(entry) {
		return pending.delete(entry);
	},
	flush() {
		while (pending.size > 0) {
			const entry = pending.values().next().value;
			if (!entry) return;
			clearTimeout(entry.timeout);
			entry.unregister();
		}
	},
	clear() {
		for (const entry of pending) clearTimeout(entry.timeout);
		pending.clear();
	}
};
//#endregion
//#region extensions/codex/src/app-server/native-hook-relay.ts
/**
* Bridges Codex native hook callbacks into OpenClaw's native hook relay so
* app-server tool events can still run OpenClaw policy and diagnostics.
*/
/** Codex hook events that can be registered through OpenClaw's native relay. */
const CODEX_NATIVE_HOOK_RELAY_EVENTS = [
	"pre_tool_use",
	"post_tool_use",
	"permission_request",
	"before_agent_finalize"
];
const CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS = CODEX_NATIVE_HOOK_RELAY_EVENTS.filter((event) => event !== "permission_request");
const CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS = 30 * 6e4;
/** Extra relay lifetime after the expected turn budget, preventing late hook drops. */
const CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS = 5 * 6e4;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS = 250;
const CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS = 1e3;
const CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC = 10;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS = 1e4;
const CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS = 5e3;
const MAX_PENDING_DIRECT_CHILD_ADMISSIONS = 32;
const CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID = {
	exec: [
		"Bash",
		"exec",
		"exec_command"
	],
	apply_patch: [
		"apply_patch",
		"Write",
		"Edit"
	],
	spawn_agent: ["spawn_agent", "Agent"]
};
/** Defers relay unregister so late native hook subprocesses can still resolve. */
function scheduleCodexNativeHookRelayUnregister(params) {
	let pending;
	const unregister = () => {
		if (!pending) return;
		const current = pending;
		pending = void 0;
		if (!nativeHookRelayUnregisterQueue.delete(current)) return;
		params.relay.unregister();
	};
	const timeout = setTimeout(unregister, resolveCodexNativeHookRelayUnregisterGraceMs(params.hookTimeoutSec));
	pending = {
		timeout,
		unregister
	};
	nativeHookRelayUnregisterQueue.add(pending);
	timeout.unref();
}
/** Computes the delayed unregister window from Codex's hook timeout. */
function resolveCodexNativeHookRelayUnregisterGraceMs(hookTimeoutSec) {
	const hookTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 0;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_UNREGISTER_GRACE_MS, addTimerTimeoutGraceMs(hookTimeoutMs, CODEX_NATIVE_HOOK_RELAY_UNREGISTER_EXTRA_GRACE_MS) ?? 0);
}
/** Records a native pre-tool failure that Codex does not project as a tool item. */
function emitCodexNativePreToolUseFailureDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		runId: params.runId,
		toolName: params.failure.toolName,
		toolCallId: params.failure.toolCallId,
		durationMs: params.failure.durationMs,
		errorCategory: "before_tool_call",
		terminalReason: params.terminalReason ?? (params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : params.failure.disposition),
		...params.sourceTimestampMs !== void 0 ? { sourceTimestampMs: params.sourceTimestampMs } : {}
	});
}
/** Registers an OpenClaw native hook relay for a Codex app-server turn. */
function createCodexNativeHookRelay(params) {
	if (params.options?.enabled === false) return;
	const directChildClaims = /* @__PURE__ */ new Map();
	const pendingDirectChildAdmissions = /* @__PURE__ */ new Map();
	let foregroundClosed = false;
	let successfulYieldRetentionAuthorized = false;
	const assertClaim = (threadId, claim) => () => directChildClaims.get(threadId) === claim;
	const rejectPendingAdmissions = (reason) => {
		for (const pending of pendingDirectChildAdmissions.values()) pending.reject(new Error(reason));
		pendingDirectChildAdmissions.clear();
	};
	const relay = registerRetainedNativeHookRelayForBundledRuntime({
		provider: "codex",
		relayId: buildCodexNativeHookRelayId({
			agentId: params.agentId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey
		}),
		...params.generation ? { generation: params.generation } : {},
		...params.generationMismatchGraceMs ? { generationMismatchGraceMs: params.generationMismatchGraceMs } : {},
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.config ? { config: params.config } : {},
		runId: params.runId,
		...params.channelId ? { channelId: params.channelId } : {},
		...params.requester ? { requester: params.requester } : {},
		...params.approvalContext ? { approvalContext: params.approvalContext } : {},
		allowedEvents: params.events,
		preToolUseLoopDetection: params.loopDetectionPreToolUseRelay,
		ttlMs: resolveCodexNativeHookRelayTtlMs({
			explicitTtlMs: params.options?.ttlMs,
			attemptTimeoutMs: params.attemptTimeoutMs,
			startupTimeoutMs: params.startupTimeoutMs,
			turnStartTimeoutMs: params.turnStartTimeoutMs
		}),
		signal: params.signal,
		runBeforeToolCall: params.hostCapabilities.runBeforeToolCall,
		assertActive: params.hostCapabilities.assertActive,
		retention: {
			readClaim: readCodexNativeChildThreadId,
			shouldRetainAfterForegroundClose: () => successfulYieldRetentionAuthorized && directChildClaims.size > 0,
			allowPreToolUse: (childThreadId) => directChildClaims.has(childThreadId),
			awaitForegroundAdmission: (childThreadId) => {
				if (foregroundClosed) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission unavailable"));
				const existingClaim = directChildClaims.get(childThreadId);
				if (existingClaim) return Promise.resolve(assertClaim(childThreadId, existingClaim));
				const existingPending = pendingDirectChildAdmissions.get(childThreadId);
				if (existingPending) return existingPending.promise.then((claim) => assertClaim(childThreadId, claim));
				if (pendingDirectChildAdmissions.size >= MAX_PENDING_DIRECT_CHILD_ADMISSIONS) return Promise.reject(/* @__PURE__ */ new Error("native hook relay foreground admission capacity reached"));
				const { promise, resolve, reject } = createDeferred();
				pendingDirectChildAdmissions.set(childThreadId, {
					promise,
					resolve,
					reject
				});
				return promise.then((claim) => assertClaim(childThreadId, claim));
			},
			onDispose: () => {
				foregroundClosed = true;
				rejectPendingAdmissions("native hook relay registration closed");
			}
		},
		onPreToolUseFailure: params.onPreToolUseFailure,
		command: {
			nice: 10,
			timeoutMs: params.options?.gatewayTimeoutMs
		}
	});
	const unregister = () => {
		foregroundClosed = true;
		rejectPendingAdmissions("native hook relay foreground closed");
		relay.unregister();
	};
	return {
		...relay,
		unregister,
		authorizeRetentionAfterSuccessfulYield: () => {
			successfulYieldRetentionAuthorized = true;
		},
		rejectPendingDirectChild: (threadIdInput, reason) => {
			const threadId = threadIdInput.trim();
			const pending = threadId ? pendingDirectChildAdmissions.get(threadId) : void 0;
			if (!pending) return;
			pendingDirectChildAdmissions.delete(threadId);
			pending.reject(new Error(reason));
		},
		claimDirectChild: (threadIdInput) => {
			const threadId = threadIdInput.trim();
			if (!threadId) return () => void 0;
			if (directChildClaims.get(threadId)) return () => void 0;
			const claim = Symbol(threadId);
			directChildClaims.set(threadId, claim);
			const pending = pendingDirectChildAdmissions.get(threadId);
			pendingDirectChildAdmissions.delete(threadId);
			pending?.resolve(claim);
			let released = false;
			return () => {
				if (released) return;
				released = true;
				if (directChildClaims.get(threadId) !== claim) return;
				directChildClaims.delete(threadId);
				if (foregroundClosed && directChildClaims.size === 0) relay.unregister();
			};
		}
	};
}
function readCodexNativeChildThreadId(rawPayload) {
	if (!isJsonObject(rawPayload) || typeof rawPayload.agent_id !== "string") return;
	return rawPayload.agent_id.trim() || void 0;
}
/** Selects the native hook events Codex should install for the current approval mode. */
function resolveCodexNativeHookRelayEvents(params) {
	if (params.configuredEvents?.length) return params.configuredEvents;
	return params.appServer.approvalPolicy === "never" ? CODEX_NATIVE_HOOK_RELAY_EVENTS : CODEX_NATIVE_HOOK_RELAY_EVENTS_WITH_APP_SERVER_APPROVALS;
}
/** Derives the native hook relay TTL from the turn budget unless explicitly configured. */
function resolveCodexNativeHookRelayTtlMs(params) {
	if (params.explicitTtlMs !== void 0) return params.explicitTtlMs;
	const relayBudgetMs = params.attemptTimeoutMs + params.startupTimeoutMs + params.turnStartTimeoutMs + CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS;
	return Math.max(CODEX_NATIVE_HOOK_RELAY_MIN_TTL_MS, Math.floor(relayBudgetMs));
}
/** Builds a stable relay id scoped to the agent and session identity. */
function buildCodexNativeHookRelayId(params) {
	const hash = createHash("sha256");
	hash.update("openclaw:codex:native-hook-relay:v1");
	hash.update("\0");
	hash.update(params.agentId?.trim() || "");
	hash.update("\0");
	hash.update(params.sessionKey?.trim() || params.sessionId);
	return `codex-${hash.digest("hex").slice(0, 40)}`;
}
const CODEX_HOOK_EVENT_BY_NATIVE_EVENT = {
	pre_tool_use: "PreToolUse",
	post_tool_use: "PostToolUse",
	permission_request: "PermissionRequest",
	before_agent_finalize: "Stop"
};
const CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT = {
	pre_tool_use: "pre_tool_use",
	post_tool_use: "post_tool_use",
	permission_request: "permission_request",
	before_agent_finalize: "stop"
};
const CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS = ["/<session-flags>/config.toml", "<session-flags>/config.toml"];
/** Builds the Codex config overlay that installs trusted command hooks for relay events. */
function buildCodexNativeHookRelayConfig(params) {
	const events = params.events?.length ? params.events : CODEX_NATIVE_HOOK_RELAY_EVENTS;
	const selectedEvents = new Set(events);
	const config = { "features.hooks": true };
	const hookState = {};
	for (const event of CODEX_NATIVE_HOOK_RELAY_EVENTS) {
		const codexEvent = CODEX_HOOK_EVENT_BY_NATIVE_EVENT[event];
		const selected = selectedEvents.has(event);
		const shouldRelay = params.relay.shouldRelayEvent(event);
		const selectedNoopPreToolUse = selected && event === "pre_tool_use" && !shouldRelay && params.loopDetectionPreToolUseRelay;
		if (!selected || !shouldRelay && !selectedNoopPreToolUse) {
			if (selected || params.clearOmittedEvents) config[`hooks.${codexEvent}`] = [];
			if (params.clearOmittedEvents) for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = { enabled: false };
			continue;
		}
		const timeout = normalizeHookTimeoutSec(params.hookTimeoutSec);
		const command = params.relay.commandForEvent(event, { timeoutMs: resolveCodexNativeHookRelayCommandTimeoutMs(timeout) });
		const matcher = selectedNoopPreToolUse ? void 0 : buildCodexNativeToolMatcher(params.relay.toolMatcherForEvent(event));
		config[`hooks.${codexEvent}`] = [{
			...matcher ? { matcher } : {},
			hooks: [{
				type: "command",
				command,
				timeout,
				async: false,
				statusMessage: "OpenClaw native hook relay"
			}]
		}];
		const state = {
			enabled: true,
			trusted_hash: codexCommandHookTrustedHash({
				event,
				command,
				matcher,
				timeout,
				statusMessage: "OpenClaw native hook relay"
			})
		};
		for (const sourcePath of CODEX_SESSION_FLAGS_HOOK_SOURCE_PATHS) hookState[`${sourcePath}:${CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[event]}:0:0`] = state;
	}
	config["hooks.state"] = hookState;
	return config;
}
/** Builds a Codex config overlay that disables native hooks and clears hook arrays. */
function buildCodexNativeHookRelayDisabledConfig() {
	return {
		"features.hooks": false,
		"hooks.PreToolUse": [],
		"hooks.PostToolUse": [],
		"hooks.PermissionRequest": [],
		"hooks.Stop": []
	};
}
function normalizeHookTimeoutSec(value) {
	return typeof value === "number" && Number.isFinite(value) && value > 0 ? Math.ceil(value) : CODEX_NATIVE_HOOK_RELAY_DEFAULT_TIMEOUT_SEC;
}
function resolveCodexNativeHookRelayCommandTimeoutMs(hookTimeoutSec) {
	const parentTimeoutMs = finiteSecondsToTimerSafeMilliseconds(normalizeHookTimeoutSec(hookTimeoutSec)) ?? 5e3;
	const parentMarginMs = Math.min(CODEX_NATIVE_HOOK_RELAY_COMMAND_MAX_PARENT_MARGIN_MS, Math.max(CODEX_NATIVE_HOOK_RELAY_COMMAND_MIN_PARENT_MARGIN_MS, Math.floor(parentTimeoutMs / 5)));
	return Math.max(1, parentTimeoutMs - parentMarginMs);
}
function buildCodexNativeToolMatcher(toolNames) {
	if (toolNames === void 0) return;
	if (toolNames.length === 0) throw new TypeError("Codex native hook matcher requires at least one tool name");
	const nativeNames = /* @__PURE__ */ new Set();
	let hasCustomToolName = false;
	for (const toolName of toolNames) {
		const canonicalToolName = toolName.trim();
		if (!canonicalToolName || canonicalToolName === "*") throw new TypeError("Codex native hook matcher requires canonical OpenClaw tool ids");
		const nativeAliases = CODEX_HOOK_MATCHER_NAMES_BY_TOOL_ID[canonicalToolName];
		if (!nativeAliases) hasCustomToolName = true;
		for (const nativeName of nativeAliases ?? [canonicalToolName]) nativeNames.add(nativeName);
	}
	const sortedNames = Array.from(nativeNames).toSorted();
	if (!hasCustomToolName && sortedNames.every((toolName) => /^[A-Za-z0-9_]+$/.test(toolName))) return sortedNames.join("|");
	return `(?i)^(?:${sortedNames.map((toolName) => toolName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})$`;
}
function codexCommandHookTrustedHash(params) {
	const identity = {
		event_name: CODEX_HOOK_KEY_LABEL_BY_NATIVE_EVENT[params.event],
		...params.matcher ? { matcher: params.matcher } : {},
		hooks: [{
			async: false,
			command: params.command,
			statusMessage: params.statusMessage,
			timeout: params.timeout,
			type: "command"
		}]
	};
	return `sha256:${createHash("sha256").update(JSON.stringify(sortJsonValue(identity))).digest("hex")}`;
}
function sortJsonValue(value) {
	if (!value || typeof value !== "object") return value;
	if (Array.isArray(value)) return value.map(sortJsonValue);
	const sorted = {};
	for (const [key, entry] of Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right))) sorted[key] = sortJsonValue(entry);
	return sorted;
}
//#endregion
//#region extensions/codex/src/app-server/event-projector-native-tool-lifecycle.ts
/** Projects metadata-only lifecycle diagnostics for native tool items. */
var CodexNativeToolLifecycleProjector = class {
	constructor(context, threadId, turnId, options = {}) {
		this.context = context;
		this.threadId = threadId;
		this.turnId = turnId;
		this.options = options;
		this.startedAtByItem = /* @__PURE__ */ new Map();
		this.activeItems = /* @__PURE__ */ new Map();
		this.webSearchCompletionByItem = /* @__PURE__ */ new Map();
		this.completedItemIds = /* @__PURE__ */ new Set();
		this.approvalFailureDispositionByItem = /* @__PURE__ */ new Map();
		this.preToolUseFailureByItem = /* @__PURE__ */ new Map();
		this.finalized = false;
	}
	handleNotification(notification) {
		const params = isJsonObject(notification.params) ? notification.params : void 0;
		if (!params || !isCodexNotificationForTurn(params, this.threadId, this.turnId)) return;
		if (notification.method === "turn/completed") {
			const turn = readCodexTurn(params.turn);
			if (!turn || turn.id !== this.turnId) return;
			for (const item of turn.items ?? []) this.recordSnapshotItem(item);
			return;
		}
		if (notification.method === "rawResponseItem/completed") {
			const item = isJsonObject(params.item) ? params.item : void 0;
			if (item) this.recordRawWebSearchResult(item);
			return;
		}
		if (notification.method !== "item/started" && notification.method !== "item/completed") return;
		const item = readItem(params.item);
		if (!item) return;
		this.recordItem({
			phase: notification.method === "item/started" ? "start" : "result",
			item,
			sourceTimestampMs: asDateTimestampMs(notification.method === "item/started" ? params.startedAtMs : params.completedAtMs)
		});
	}
	recordItem(params) {
		const toolName = auditNativeToolName(params.item);
		if (!toolName || this.completedItemIds.has(params.item.id)) return;
		if (params.phase === "start") {
			this.recordStarted(params.item.id, toolName, auditNativeToolUnfinishedStatus(params.item), params.sourceTimestampMs);
			return;
		}
		if (params.item.type === "webSearch") {
			this.webSearchCompletionByItem.set(params.item.id, {
				runWasAborted: this.options.runAbortSignal?.aborted === true,
				sourceTimestampMs: params.sourceTimestampMs
			});
			return;
		}
		const itemDurationMs = typeof params.item.durationMs === "number" ? params.item.durationMs : void 0;
		this.recordTerminal(params.item.id, toolName, auditNativeToolTerminalStatus(params.item), {
			itemDurationMs,
			sourceTimestampMs: params.sourceTimestampMs
		});
	}
	recordApprovalFailureDisposition(toolCallId, disposition) {
		if (!this.completedItemIds.has(toolCallId)) this.approvalFailureDispositionByItem.set(toolCallId, disposition);
	}
	recordPreToolUseFailure(failure, runWasAborted = this.options.runAbortSignal?.aborted === true) {
		if (this.completedItemIds.has(failure.toolCallId)) return;
		const record = {
			failure,
			terminalReason: runWasAborted && this.options.runAbortSignal ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal) : failure.disposition
		};
		if (this.finalized) {
			this.completedItemIds.add(failure.toolCallId);
			this.emitPreToolUseFailure(record, failure.toolName, failure.durationMs);
			return;
		}
		this.preToolUseFailureByItem.set(failure.toolCallId, record);
	}
	recordRawWebSearchResult(item) {
		if (readStringField(item, "type") !== "web_search_call") return;
		const toolCallId = readStringField(item, "id");
		if (!toolCallId || this.completedItemIds.has(toolCallId)) return;
		const toolName = "web_search";
		this.recordStarted(toolCallId, toolName, "unknown");
		const rawStatus = readStringField(item, "status");
		if (rawStatus === "in_progress" || rawStatus === "running") return;
		const status = rawStatus === "completed" ? "completed" : rawStatus === "cancelled" ? "cancelled" : rawStatus === "failed" || rawStatus === "error" || rawStatus === "incomplete" ? "failed" : "unknown";
		this.recordTerminal(toolCallId, toolName, status, { sourceTimestampMs: this.webSearchCompletionByItem.get(toolCallId)?.sourceTimestampMs });
	}
	recordTerminal(toolCallId, toolName, status, options = {}) {
		const runWasAborted = options.runWasAborted ?? this.options.runAbortSignal?.aborted === true;
		const preToolUseFailure = this.preToolUseFailureByItem.get(toolCallId);
		this.preToolUseFailureByItem.delete(toolCallId);
		const approvalFailureDisposition = this.approvalFailureDispositionByItem.get(toolCallId);
		this.approvalFailureDispositionByItem.delete(toolCallId);
		this.completedItemIds.add(toolCallId);
		this.activeItems.delete(toolCallId);
		this.webSearchCompletionByItem.delete(toolCallId);
		const startedAt = this.startedAtByItem.get(toolCallId);
		this.startedAtByItem.delete(toolCallId);
		const endedAt = options.sourceTimestampMs ?? Date.now();
		const durationMs = options.itemDurationMs ?? (startedAt === void 0 ? 0 : Math.max(0, endedAt - startedAt));
		if (preToolUseFailure) {
			this.emitPreToolUseFailure(preToolUseFailure, toolName, durationMs, options.sourceTimestampMs);
			return;
		}
		const terminalEvent = approvalFailureDisposition ? {
			type: "tool.execution.error",
			durationMs,
			errorCategory: "codex_native_tool_approval",
			terminalReason: approvalFailureDisposition
		} : status === "blocked" ? {
			type: "tool.execution.blocked",
			reason: "codex_native_tool_blocked",
			deniedReason: "codex_native_tool_blocked"
		} : status === "failed" || status === "cancelled" || status === "unknown" ? {
			type: "tool.execution.error",
			durationMs,
			errorCategory: status === "unknown" ? "codex_native_tool_outcome_unknown" : status === "cancelled" ? "aborted" : "codex_native_tool_error",
			...status === "unknown" ? { errorCode: "tool_outcome_unknown" } : {},
			terminalReason: status === "unknown" ? "failed" : runWasAborted && this.options.runAbortSignal ? resolveCodexToolAbortTerminalReason(this.options.runAbortSignal) : status === "cancelled" ? "cancelled" : "failed"
		} : {
			type: "tool.execution.completed",
			durationMs
		};
		emitTrustedDiagnosticEvent({
			...this.buildBase(toolCallId, toolName),
			...terminalEvent,
			...options.sourceTimestampMs !== void 0 ? { sourceTimestampMs: options.sourceTimestampMs } : {}
		});
	}
	finalizeActive(runWasAborted = this.options.runAbortSignal?.aborted === true) {
		this.finalized = true;
		for (const [toolCallId, { toolName, unfinishedStatus }] of this.activeItems) {
			const webSearchCompletion = this.webSearchCompletionByItem.get(toolCallId);
			const itemRunWasAborted = webSearchCompletion ? webSearchCompletion.runWasAborted : runWasAborted;
			this.recordTerminal(toolCallId, toolName, unfinishedStatus, {
				runWasAborted: itemRunWasAborted,
				sourceTimestampMs: webSearchCompletion?.sourceTimestampMs
			});
		}
		for (const [toolCallId, record] of this.preToolUseFailureByItem) if (!this.completedItemIds.has(toolCallId)) this.recordTerminal(toolCallId, record.failure.toolName, "failed", { itemDurationMs: record.failure.durationMs });
		this.activeItems.clear();
		this.webSearchCompletionByItem.clear();
		this.approvalFailureDispositionByItem.clear();
		this.preToolUseFailureByItem.clear();
	}
	emitPreToolUseFailure(record, toolName, durationMs, sourceTimestampMs) {
		emitCodexNativePreToolUseFailureDiagnostic({
			agentId: this.context.agentId,
			sessionId: this.context.sessionId,
			sessionKey: this.context.sessionKey,
			runId: this.context.runId,
			failure: {
				...record.failure,
				toolName,
				durationMs
			},
			terminalReason: record.terminalReason,
			sourceTimestampMs
		});
	}
	recordSnapshotItem(item) {
		if (!auditNativeToolName(item) || this.completedItemIds.has(item.id) || itemStatus(item) === "running") return;
		const toolName = auditNativeToolName(item);
		if (!toolName) return;
		this.recordStarted(item.id, toolName, auditNativeToolUnfinishedStatus(item));
		this.recordItem({
			phase: "result",
			item
		});
	}
	recordStarted(toolCallId, toolName, unfinishedStatus, sourceTimestampMs) {
		if (this.activeItems.has(toolCallId)) return;
		this.startedAtByItem.set(toolCallId, sourceTimestampMs ?? Date.now());
		this.activeItems.set(toolCallId, {
			toolName,
			unfinishedStatus
		});
		emitTrustedDiagnosticEvent({
			type: "tool.execution.started",
			...this.buildBase(toolCallId, toolName),
			...sourceTimestampMs !== void 0 ? { sourceTimestampMs } : {}
		});
	}
	buildBase(toolCallId, toolName) {
		return {
			agentId: this.context.agentId,
			runId: this.context.runId,
			sessionId: this.context.sessionId,
			sessionKey: this.context.sessionKey,
			toolName,
			toolCallId
		};
	}
};
//#endregion
//#region extensions/codex/src/app-server/remote-workspace-path.ts
/** Projects a gateway workspace path into the remote Codex execution workspace. */
function mapCodexAppServerRemoteWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeWorkspaceMatchPath(params.remoteWorkspaceRoot);
	const normalizedValue = normalizeWorkspaceMatchPath(params.value);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	if (normalizedValue === localRoot) return remoteRoot;
	const prefix = `${localRoot}/`;
	if (!normalizedValue.startsWith(prefix)) throw new Error(`Codex remoteWorkspaceRoot is configured but cwd ${params.value} is outside OpenClaw workspace root ${params.localWorkspaceRoot}; refusing to send a gateway-local cwd to the remote Codex app-server.`);
	return joinRemoteWorkspacePath(remoteRoot, normalizedValue.slice(prefix.length));
}
/** Maps a remote workspace artifact back into the corresponding gateway workspace. */
function mapCodexAppServerLocalWorkspacePath(params) {
	if (!params.remoteWorkspaceRoot) return params.value;
	const localRoot = normalizeWorkspaceMatchPath(params.localWorkspaceRoot);
	const remoteRoot = normalizeWorkspaceMatchPath(params.remoteWorkspaceRoot);
	if (!localRoot || !remoteRoot) throw new Error("Codex remoteWorkspaceRoot requires non-empty workspace roots.");
	const normalizedValue = normalizeWorkspaceMatchPath(params.value);
	if (!normalizedValue || isCodexPassThroughMediaSource(normalizedValue)) return params.value;
	const usesWindowsPaths = /^[a-z]:\//iu.test(remoteRoot) || remoteRoot.startsWith("//");
	const matchValue = usesWindowsPaths ? normalizedValue.toLowerCase() : normalizedValue;
	const matchRoot = usesWindowsPaths ? remoteRoot.toLowerCase() : remoteRoot;
	if (matchValue === matchRoot) return params.localWorkspaceRoot;
	const prefix = matchRoot.endsWith("/") ? matchRoot : `${matchRoot}/`;
	const isRemoteWorkspacePath = matchValue.startsWith(prefix);
	if (!isRemoteWorkspacePath && isAbsoluteWorkspacePath(normalizedValue)) throw new Error(`Codex remote workspace artifact ${params.value} is outside ${params.remoteWorkspaceRoot}.`);
	const suffixSegments = (isRemoteWorkspacePath ? normalizedValue.slice(prefix.length) : normalizedValue).split("/");
	if (suffixSegments.some((segment) => segment === "..")) throw new Error(`Codex remote workspace artifact ${params.value} must stay inside ${params.remoteWorkspaceRoot}.`);
	return path.join(params.localWorkspaceRoot, ...suffixSegments.filter((segment) => segment !== "."));
}
function normalizeWorkspaceMatchPath(value) {
	const normalized = value.replace(/\\/gu, "/");
	if (/^[a-z]:\/$/iu.test(normalized)) return normalized;
	return normalized.length > 1 ? normalized.replace(/[\\/]+$/u, "") : normalized;
}
/** Keeps remote URLs and opaque managed media references out of workspace path mapping. */
function isCodexPassThroughMediaSource(value) {
	return /^(?:https?|mxc|buffer|media):\/\//iu.test(value) || /^data:/iu.test(value);
}
function isAbsoluteWorkspacePath(value) {
	return value.startsWith("/") || /^[a-z]:\//iu.test(value) || /^[a-z][a-z0-9+.-]*:/iu.test(value);
}
function joinRemoteWorkspacePath(remoteRoot, suffix) {
	return remoteRoot.endsWith("/") ? `${remoteRoot}${suffix}` : `${remoteRoot}/${suffix}`;
}
//#endregion
//#region extensions/codex/src/app-server/remote-workspace-media.ts
const REMOTE_WORKSPACE_MEDIA_TIMEOUT_MS = 6e4;
const REMOTE_WORKSPACE_MEDIA_MAX_BYTES = 64 * 1024 * 1024;
const REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS = 16;
const CODEX_REMOTE_MEDIA_CHUNK_BYTES = 512 * 1024;
const CODEX_REMOTE_COMMAND_DEFAULT_OUTPUT_BYTES = 1024 * 1024;
const CODEX_BOUNDED_REMOTE_FILE_READER = [
	"try{",
	"const fs=require(\"node:fs\");",
	"const path=require(\"node:path\");",
	"const file=process.argv[1];",
	"const max=Number(process.argv[2]);",
	"const offset=Number(process.argv[3]);",
	"const chunk=Number(process.argv[4]);",
	"const workspace=process.argv[5];",
	"if(!Number.isSafeInteger(max)||max<0)throw Error(\"invalid media byte limit\");",
	"if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(chunk)||chunk<=0)throw Error(\"invalid media chunk\");",
	"if(fs.lstatSync(file).isSymbolicLink())throw Error(\"symbolic links are not allowed\");",
	"const noFollow=fs.constants.O_NOFOLLOW??0;",
	"const fd=fs.openSync(file,fs.constants.O_RDONLY|noFollow);",
	"try{",
	"const before=fs.fstatSync(fd);",
	"if(!before.isFile())throw Error(\"not a regular file\");",
	"if(workspace){",
	"const descriptor=process.platform===\"linux\"?fs.realpathSync(`/proc/self/fd/${fd}`):fs.realpathSync(file);",
	"const relative=path.relative(fs.realpathSync(workspace),descriptor);",
	"if(!relative||relative===\"..\"||relative.startsWith(`..${path.sep}`)||path.isAbsolute(relative))throw Error(\"file escapes remote workspace\");",
	"const verified=fs.statSync(descriptor);",
	"if(verified.dev!==before.dev||verified.ino!==before.ino)throw Error(\"file changed while being opened\");",
	"}",
	"if(before.size>max)throw Error(`file exceeds limit of ${max} bytes`);",
	"if(offset>before.size)throw Error(\"file changed while being read\");",
	"const expected=Math.min(chunk,before.size-offset);",
	"const buffer=Buffer.allocUnsafe(expected);",
	"let total=0;",
	"while(total<buffer.length){",
	"const count=fs.readSync(fd,buffer,total,buffer.length-total,offset+total);",
	"if(count===0)break;total+=count;",
	"}",
	"if(total!==expected)throw Error(\"file changed while being read\");",
	"const after=fs.fstatSync(fd);",
	"const revision=stat=>[stat.dev,stat.ino,stat.size,stat.mtimeMs,stat.ctimeMs].join(\":\");",
	"if(!after.isFile()||revision(after)!==revision(before))throw Error(\"file changed while being read\");",
	"process.stdout.write(JSON.stringify({dataBase64:buffer.toString(\"base64\"),size:before.size,revision:revision(before)}));",
	"}finally{fs.closeSync(fd)}",
	"}catch(error){process.stderr.write(error instanceof Error?error.message:String(error));process.exitCode=1}"
].join("");
const MESSAGE_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"media_url",
	"path",
	"filePath",
	"fileUrl",
	"imageUrl",
	"image_url"
];
const MESSAGE_MEDIA_ARRAY_KEYS = [
	"mediaUrls",
	"media_urls",
	"imageUrls",
	"image_urls"
];
const ATTACHMENT_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
/** Reads actual remote bytes with a cap enforced by Codex before transport. */
async function readBoundedCodexRemoteWorkspaceFile(params) {
	if (!Number.isSafeInteger(params.maxBytes) || params.maxBytes < 0) throw new Error("Codex remote workspace upload requires a valid media byte limit.");
	params.signal?.throwIfAborted();
	const chunks = [];
	let offset = 0;
	let expectedSize;
	let expectedRevision;
	const startedAt = Date.now();
	do {
		params.signal?.throwIfAborted();
		const timeoutMs = params.timeoutMs === void 0 ? void 0 : params.timeoutMs - (Date.now() - startedAt);
		if (timeoutMs !== void 0 && timeoutMs <= 0) throw new Error("Codex remote workspace file transfer timed out.");
		let response;
		try {
			response = await params.client.request("command/exec", {
				command: [
					"node",
					"-e",
					CODEX_BOUNDED_REMOTE_FILE_READER,
					"--",
					params.path,
					String(params.maxBytes),
					String(offset),
					String(CODEX_REMOTE_MEDIA_CHUNK_BYTES),
					...params.workspaceRoot ? [params.workspaceRoot] : []
				],
				env: {
					NODE_OPTIONS: null,
					NODE_PATH: null
				},
				...timeoutMs === void 0 ? {} : { timeoutMs }
			}, {
				signal: params.signal,
				timeoutMs
			});
		} catch (error) {
			if (error instanceof Error && /failed to spawn|executable.*not found|\bENOENT\b/iu.test(error.message)) throw new Error("Codex remote workspace file transfer requires Node.js on the remote app-server host.", { cause: error });
			throw error;
		}
		if (!response || response.exitCode !== 0) {
			const detail = typeof response?.stderr === "string" ? response.stderr.trim() : "";
			throw new Error(`Codex remote workspace artifact could not be read: ${params.path}${detail ? `: ${detail}` : ""}`);
		}
		if (typeof response.stdout !== "string" || response.stdout.length > CODEX_REMOTE_COMMAND_DEFAULT_OUTPUT_BYTES) throw new Error("Codex remote workspace artifact exceeded the native command output cap.");
		let payload;
		try {
			payload = JSON.parse(response.stdout);
		} catch {
			throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		}
		if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		const chunk = payload;
		if (typeof chunk.dataBase64 !== "string" || !Number.isSafeInteger(chunk.size) || chunk.size < 0 || chunk.size > params.maxBytes || typeof chunk.revision !== "string" || !chunk.revision) throw new Error("Codex remote workspace artifact returned invalid or oversized chunk data.");
		if (expectedSize === void 0) {
			expectedSize = chunk.size;
			expectedRevision = chunk.revision;
		}
		if (chunk.size !== expectedSize || chunk.revision !== expectedRevision) throw new Error("Codex remote workspace artifact changed during chunked transfer.");
		const remainingBytes = expectedSize - offset;
		const expectedChunkBytes = Math.min(CODEX_REMOTE_MEDIA_CHUNK_BYTES, remainingBytes);
		if (chunk.dataBase64.length > Math.ceil(expectedChunkBytes / 3) * 4) throw new Error("Codex remote workspace artifact returned oversized chunk data.");
		const buffer = Buffer.from(chunk.dataBase64, "base64");
		if (buffer.byteLength !== expectedChunkBytes || buffer.toString("base64") !== chunk.dataBase64) throw new Error("Codex remote workspace artifact returned invalid chunk data.");
		chunks.push(buffer);
		offset += buffer.byteLength;
	} while (offset < (expectedSize ?? 0));
	return { dataBase64: Buffer.concat(chunks, offset).toString("base64") };
}
/** Stages authoritative bounded remote bytes into immutable Gateway-owned media. */
async function prepareCodexRemoteWorkspaceMessageMedia(params) {
	const { localWorkspaceRoot, remoteWorkspaceRoot } = params;
	if (!localWorkspaceRoot || !remoteWorkspaceRoot) return params.args;
	const remotePathsByLocalPath = /* @__PURE__ */ new Map();
	const gatewayManagedPaths = /* @__PURE__ */ new Set();
	const gatewayMediaRoot = getMediaDir();
	let attachmentEntries = 0;
	const mapMediaPath = (value) => {
		if (typeof value !== "string") return value;
		if (isGatewayManagedMediaPath(value, gatewayMediaRoot)) {
			attachmentEntries += 1;
			gatewayManagedPaths.add(value);
			return value;
		}
		const mapped = mapCodexAppServerLocalWorkspacePath({
			value,
			localWorkspaceRoot,
			remoteWorkspaceRoot
		});
		if (value.trim() && !isCodexPassThroughMediaSource(value)) {
			attachmentEntries += 1;
			remotePathsByLocalPath.set(mapped, mapCodexAppServerRemoteWorkspacePath({
				value: mapped,
				localWorkspaceRoot,
				remoteWorkspaceRoot
			}));
		}
		return mapped;
	};
	let mappedArgs = params.args;
	const setMappedValue = (key, value) => {
		if (value === params.args[key]) return;
		if (mappedArgs === params.args) mappedArgs = { ...params.args };
		mappedArgs[key] = value;
	};
	for (const key of MESSAGE_MEDIA_KEYS) setMappedValue(key, mapMediaPath(params.args[key]));
	for (const key of MESSAGE_MEDIA_ARRAY_KEYS) {
		const value = params.args[key];
		if (Array.isArray(value)) {
			const mapped = value.map(mapMediaPath);
			if (mapped.some((entry, index) => entry !== value[index])) setMappedValue(key, mapped);
		}
	}
	if (Array.isArray(params.args.attachments)) {
		const attachments = params.args.attachments;
		const mapped = attachments.map((attachment) => {
			if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return attachment;
			const record = attachment;
			let mappedAttachment = record;
			for (const key of ATTACHMENT_MEDIA_KEYS) {
				const value = mapMediaPath(record[key]);
				if (value !== record[key]) {
					if (mappedAttachment === record) mappedAttachment = { ...record };
					mappedAttachment[key] = value;
				}
			}
			return mappedAttachment;
		});
		if (mapped.some((attachment, index) => attachment !== attachments[index])) setMappedValue("attachments", mapped);
	}
	if (attachmentEntries > REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS) throw new Error(`Codex remote workspace upload exceeds the ${REMOTE_WORKSPACE_MEDIA_MAX_ATTACHMENTS}-attachment limit.`);
	for (const managedPath of gatewayManagedPaths) await assertGatewayManagedMediaPath(managedPath, gatewayMediaRoot);
	if (remotePathsByLocalPath.size === 0) return mappedArgs;
	const readRemoteFile = params.readRemoteFile;
	if (!readRemoteFile) throw new Error("Codex remote workspace file transfer requires an active app-server client.");
	const maxBytes = params.maxBytes ?? REMOTE_WORKSPACE_MEDIA_MAX_BYTES;
	const timeoutMs = params.timeoutMs ?? REMOTE_WORKSPACE_MEDIA_TIMEOUT_MS;
	const deadline = Date.now() + timeoutMs;
	const stagedPaths = /* @__PURE__ */ new Map();
	let totalBytes = 0;
	for (const [localPath, remotePath] of remotePathsByLocalPath) {
		params.signal?.throwIfAborted();
		const remainingBytes = maxBytes - totalBytes;
		const remainingMs = deadline - Date.now();
		if (remainingMs <= 0) throw new Error("Codex remote workspace attachment batch timed out.");
		const response = await readRemoteFile({
			path: remotePath,
			maxBytes: remainingBytes,
			workspaceRoot: remoteWorkspaceRoot,
			signal: params.signal,
			timeoutMs: remainingMs
		});
		if (!response || typeof response.dataBase64 !== "string") throw new Error(`Codex remote workspace artifact returned no file data: ${remotePath}`);
		if (response.dataBase64.length > Math.ceil(remainingBytes / 3) * 4) throw new Error(`Codex remote workspace artifact exceeds the limit of ${remainingBytes} bytes.`);
		const remoteBuffer = Buffer.from(response.dataBase64, "base64");
		if (remoteBuffer.byteLength > remainingBytes || remoteBuffer.toString("base64") !== response.dataBase64) throw new Error(`Codex remote workspace artifact returned invalid or oversized file data: ${remotePath}`);
		totalBytes += remoteBuffer.byteLength;
		const saved = await saveMediaBuffer(remoteBuffer, void 0, "outbound", maxBytes, path.basename(remotePath));
		stagedPaths.set(localPath, saved.path);
	}
	return mapMessageMediaValues(mappedArgs, (value) => stagedPaths.get(value) ?? value);
}
function isGatewayManagedMediaPath(value, mediaRoot) {
	if (!path.isAbsolute(value)) return false;
	const relativePath = path.relative(mediaRoot, value);
	return Boolean(relativePath && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath));
}
async function assertGatewayManagedMediaPath(value, mediaRoot) {
	const opened = await (await root(mediaRoot, { symlinks: "reject" })).open(path.relative(mediaRoot, value), { symlinks: "reject" });
	try {
		if (!(await opened.handle.stat()).isFile()) throw new Error(`Codex Gateway-managed media is not a regular file: ${value}`);
	} finally {
		await opened[Symbol.asyncDispose]();
	}
}
function mapMessageMediaValues(args, mapValue) {
	const mapped = { ...args };
	for (const key of MESSAGE_MEDIA_KEYS) {
		const value = mapped[key];
		if (typeof value === "string") mapped[key] = mapValue(value);
	}
	for (const key of MESSAGE_MEDIA_ARRAY_KEYS) {
		const value = mapped[key];
		if (Array.isArray(value)) mapped[key] = value.map((entry) => typeof entry === "string" ? mapValue(entry) : entry);
	}
	if (Array.isArray(mapped.attachments)) mapped.attachments = mapped.attachments.map((attachment) => {
		if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) return attachment;
		const record = { ...attachment };
		for (const key of ATTACHMENT_MEDIA_KEYS) {
			const value = record[key];
			if (typeof value === "string") record[key] = mapValue(value);
		}
		return record;
	});
	return mapped;
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build-state.ts
/** Mutable dependency seam shared by dynamic-tool construction and its behavioral tests. */
const dynamicToolBuildState = {};
//#endregion
//#region extensions/codex/src/app-server/shell-dynamic-tools.ts
const CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME = "node_exec";
const CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME = "node_process";
const CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES = /* @__PURE__ */ new Set([
	"host",
	"security",
	"ask"
]);
/** Returns true when plugin config explicitly removes any named dynamic tool. */
function isCodexDynamicToolExcluded(config, names) {
	const normalizedNames = new Set(names.map((name) => normalizeCodexDynamicToolName(name)));
	return (config.codexDynamicToolsExclude ?? []).some((name) => normalizedNames.has(normalizeCodexDynamicToolName(name)));
}
function createNodeExecDynamicTool(execTool, configuredNode) {
	const pinnedNode = configuredNode?.trim();
	return {
		...execTool,
		name: CODEX_NODE_EXEC_DYNAMIC_TOOL_NAME,
		description: pinnedNode ? "Run a shell command on the OpenClaw configured remote node for this session. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Use node_process for follow-up on backgrounded node_exec sessions. Use Codex's native shell for local app-server work." : "Run a shell command on an OpenClaw remote node. Select the node by name or id when multiple nodes are available. This tool always uses OpenClaw host=node internally and follows the existing node exec approval and allowlist policy. Use node_process for follow-up on backgrounded node_exec sessions. Use Codex's native shell for local app-server work.",
		parameters: hideNodeExecDynamicToolParameters(execTool.parameters, { hideNode: Boolean(pinnedNode) }),
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await execTool.execute(toolCallId, pinNodeExecDynamicToolArgs(args, pinnedNode), signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace("Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.", "Use node_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.") }) : item)
			};
		}
	};
}
function createNodeProcessDynamicTool(processTool) {
	return {
		...processTool,
		name: CODEX_NODE_PROCESS_DYNAMIC_TOOL_NAME,
		description: "Manage node_exec sessions that were started on OpenClaw remote nodes: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for node_exec follow-up; use Codex's native shell session handling for local app-server work."
	};
}
function pinNodeExecDynamicToolArgs(args, configuredNode) {
	const { host: _host, security: _security, ask: _ask, node: requestedNode, ...rest } = args && typeof args === "object" && !Array.isArray(args) ? args : {};
	const node = configuredNode ?? (typeof requestedNode === "string" ? requestedNode.trim() : "");
	return {
		...rest,
		host: "node",
		...node ? { node } : {}
	};
}
function hideNodeExecDynamicToolParameters(parameters, options) {
	if (!parameters || typeof parameters !== "object" || Array.isArray(parameters)) return parameters;
	const schema = parameters;
	const rawProperties = schema.properties;
	if (!rawProperties || typeof rawProperties !== "object" || Array.isArray(rawProperties)) return parameters;
	const nextProperties = Object.fromEntries(Object.entries(rawProperties).filter(([name]) => !CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name)) && !(options.hideNode && normalizeCodexDynamicToolName(name) === "node")));
	const rawRequired = schema.required;
	const nextRequired = Array.isArray(rawRequired) ? rawRequired.filter((name) => typeof name !== "string" || !CODEX_NODE_EXEC_POLICY_PARAMETER_NAMES.has(normalizeCodexDynamicToolName(name)) && !(options.hideNode && normalizeCodexDynamicToolName(name) === "node")) : rawRequired;
	return {
		...schema,
		properties: nextProperties,
		...Array.isArray(rawRequired) ? { required: nextRequired } : {}
	};
}
//#endregion
//#region extensions/codex/src/app-server/vision-tools.ts
/**
* Filters Codex dynamic tools for turns that already contain image inputs so
* models with native vision do not get redundant image-inspection tools.
*/
/** Removes the image tool when the model can directly consume inbound images. */
function filterToolsForVisionInputs(tools, params) {
	if (!params.modelHasVision || !params.hasInboundImages) return tools;
	return tools.filter((tool) => tool.name !== "image");
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-build.ts
/**
* Builds the Codex app-server dynamic tool list for one turn, including
* OpenClaw-owned tools, Codex native-tool fallback rules, sandbox shell shims,
* and provider allowlist normalization.
*/
const CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS = [
	"exec",
	"process",
	"read",
	"write",
	"edit",
	"apply_patch"
];
const CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW = /* @__PURE__ */ new Set(["read", "write"]);
function preserveRingZeroSystemAgentTool(allTools, filteredTools) {
	const openclaw = allTools.find((tool) => tool.name === "openclaw" && tool.catalogMode === "direct-only");
	if (!openclaw) return filteredTools;
	return [openclaw, ...filteredTools.filter((tool) => tool.name !== "openclaw")];
}
/** Splits sandbox and run session keys so tool calls can bind to both scopes when needed. */
function resolveOpenClawCodingToolsSessionKeys(params, sandboxSessionKey) {
	return {
		sessionKey: sandboxSessionKey,
		runSessionKey: params.sessionKey && params.sessionKey !== sandboxSessionKey ? params.sessionKey : void 0
	};
}
/** Returns the canonical channel used for Codex message routing and receipts. */
function resolveCodexMessageToolProvider(params) {
	return params.messageChannel ?? params.messageProvider;
}
/** Resolves the channel id that hook events should target for this Codex app-server turn. */
function resolveCodexAppServerHookChannelId(params, sandboxSessionKey) {
	return buildAgentHookContextChannelFields({
		sessionKey: sandboxSessionKey,
		messageChannel: params.messageChannel,
		messageProvider: params.messageProvider,
		currentChannelId: params.currentChannelId,
		messageTo: params.messageTo
	}).channelId;
}
const CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS = 1e3;
const CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS = 500;
/** Creates cheap optional timing instrumentation for the dynamic-tool hot path. */
function createCodexDynamicToolBuildStageTracker(options = {}) {
	if (!options.enabled) return {
		mark() {},
		snapshot() {
			return {
				totalMs: 0,
				stages: []
			};
		}
	};
	const startedAt = Date.now();
	let previousAt = startedAt;
	const stages = [];
	const toMs = (value) => Math.max(0, Math.round(value));
	return {
		mark(name) {
			const currentAt = Date.now();
			stages.push({
				name,
				durationMs: toMs(currentAt - previousAt),
				elapsedMs: toMs(currentAt - startedAt)
			});
			previousAt = currentAt;
		},
		snapshot() {
			return {
				totalMs: toMs(Date.now() - startedAt),
				stages: stages.slice()
			};
		}
	};
}
/** Returns true when dynamic-tool construction is slow enough to warrant a warning log. */
function shouldWarnCodexDynamicToolBuildStageSummary(summary) {
	return summary.totalMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_TOTAL_MS || summary.stages.some((stage) => stage.durationMs >= CODEX_DYNAMIC_TOOL_BUILD_WARN_STAGE_MS);
}
/** Formats per-stage timings into the compact form used by Codex app-server logs. */
function formatCodexDynamicToolBuildStageSummary(summary) {
	return summary.stages.length > 0 ? summary.stages.map((stage) => `${stage.name}:${stage.durationMs}ms@${stage.elapsedMs}ms`).join(",") : "none";
}
/** Builds, filters, and normalizes Codex-compatible runtime tools for a single turn. */
async function buildDynamicTools(input) {
	const { params } = input;
	const messagePolicyParams = input.ignoreDisableMessageTool ? {
		...params,
		disableMessageTool: false
	} : params;
	if (params.disableTools) {
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	if (!supportsModelTools(params.model)) {
		input.onPersistentWebSearchPolicyResolved?.(false);
		input.onWebSearchPolicyResolved?.(false);
		return [];
	}
	const toolBuildStages = createCodexDynamicToolBuildStageTracker({ enabled: input.profilerEnabled });
	const modelHasVision = params.model.input?.includes("image") ?? false;
	const agentDir = params.agentDir ?? resolveAgentDir(params.config ?? {}, input.sessionAgentId);
	const injectedOpenClawCodingToolsFactory = dynamicToolBuildState.openClawCodingToolsFactory;
	let agentHarnessModule;
	const loadAgentHarnessModule = async () => agentHarnessModule ??= await import("./plugin-sdk/agent-harness.js");
	const createOpenClawCodingTools = injectedOpenClawCodingToolsFactory ?? (await loadAgentHarnessModule()).createOpenClawCodingTools;
	toolBuildStages.mark("load-agent-harness-tools");
	const sessionKeys = resolveOpenClawCodingToolsSessionKeys(params, input.sandboxSessionKey);
	const nativeExecutionPolicy = resolveCodexNativeExecutionPolicyForDynamicTools(input);
	const buildOpenClawCodingTools = () => params.hostCapabilities.bindToolSurface(createOpenClawCodingTools({
		agentId: input.sessionAgentId,
		...buildEmbeddedAttemptToolRunContext(params),
		exec: {
			...params.execOverrides,
			...resolveCodexNodeExecToolOverrides(nativeExecutionPolicy),
			config: params.config,
			elevated: params.bashElevated
		},
		sandbox: input.sandbox,
		messageProvider: resolveCodexMessageToolProvider(params),
		toolPolicyMessageProvider: params.messageProvider ?? params.messageChannel,
		clientCaps: params.clientCaps,
		chatType: params.chatType,
		agentAccountId: params.agentAccountId,
		messageTo: params.messageTo,
		messageThreadId: params.messageThreadId,
		nativeChannelId: params.chatId,
		messageActionTurnCapability: params.messageActionTurnCapability,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		senderIsOwner: params.senderIsOwner,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy,
		allowGatewaySubagentBinding: params.allowGatewaySubagentBinding || isForcedPrivateQaCodexRuntime(),
		...sessionKeys,
		sessionId: params.sessionId,
		runId: params.runId,
		approvalReviewerDeviceId: params.approvalReviewerDeviceId,
		agentDir,
		cwd: input.effectiveCwd ?? input.effectiveWorkspace,
		workspaceDir: input.effectiveWorkspace,
		spawnWorkspaceDir: input.effectiveCwd && input.effectiveCwd !== input.effectiveWorkspace ? input.resolvedWorkspace : resolveAttemptSpawnWorkspaceDir({
			sandbox: input.sandbox,
			resolvedWorkspace: input.resolvedWorkspace
		}),
		config: params.config,
		authProfileStore: params.toolAuthProfileStore ?? params.authProfileStore,
		abortSignal: input.runAbortController.signal,
		emitBeforeToolCallDiagnostics: false,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		modelCompat: params.model.compat && typeof params.model.compat === "object" ? params.model.compat : void 0,
		modelApi: params.model.api,
		modelContextWindowTokens: params.model.contextWindow,
		delegationCapability: params.delegationCapability,
		modelAuthMode: resolveModelAuthMode(params.model.provider, params.config, params.toolAuthProfileStore ?? params.authProfileStore, { workspaceDir: input.effectiveWorkspace }),
		suppressManagedWebSearch: false,
		currentChannelId: params.currentChannelId,
		currentMessagingTarget: params.currentMessagingTarget,
		hookChannelId: resolveCodexAppServerHookChannelId(params, input.sandboxSessionKey),
		currentThreadTs: params.currentThreadTs,
		currentMessageId: params.currentMessageId,
		replyToMode: params.replyToMode,
		hasRepliedRef: params.hasRepliedRef,
		modelHasVision,
		computerContextEpoch: input.computerContextEpoch,
		requireExplicitMessageTarget: params.requireExplicitMessageTarget ?? isSubagentSessionKey(params.sessionKey),
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		disableMessageTool: input.ignoreDisableMessageTool ? false : params.disableMessageTool,
		forceMessageTool: shouldForceMessageTool(messagePolicyParams),
		enableHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		forceHeartbeatTool: params.trigger === "heartbeat" || input.forceHeartbeatTool === true,
		onYield: (message) => {
			input.onYieldDetected();
			input.onCodexAppServerEvent?.({
				stream: "codex_app_server.tool",
				data: {
					name: "sessions_yield",
					message
				}
			});
		},
		recordToolPrepStage: (name) => {
			toolBuildStages.mark(name);
		},
		onToolOutcome: params.onToolOutcome,
		isTurnTainted: params.isTurnTainted,
		allocateToolOutcomeOrdinal: params.allocateToolOutcomeOrdinal,
		cronCreatorToolAllowlistRef: input.cronCreatorToolAllowlistRef,
		cronCreatorToolAllowlistCaptureRef: input.cronCreatorToolAllowlistCaptureRef,
		cronCreatorAuthorityUnavailableReason: input.cronCreatorAuthorityUnavailableReason
	}), { cwd: input.effectiveCwd ?? input.effectiveWorkspace });
	const allTools = input.resolveCronCreatorToolAuthority ? runWithCronCreatorAuthorityCapabilityResolver({
		capability: params.cronCreatorAuthorityCapability,
		runId: params.runId,
		resolve: input.resolveCronCreatorToolAuthority,
		run: buildOpenClawCodingTools
	}) : buildOpenClawCodingTools();
	toolBuildStages.mark("create-openclaw-coding-tools");
	const preNormalizationDiagnostics = [];
	const readableAllToolProjection = filterProviderNormalizableTools(allTools);
	preNormalizationDiagnostics.push(...readableAllToolProjection.diagnostics);
	const webSearchPlan = resolveCodexWebSearchPlan({
		config: params.config,
		disableTools: params.disableTools,
		nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled,
		nativeProviderWebSearchSupport: input.nativeProviderWebSearchSupport
	});
	const readableAllTools = [...readableAllToolProjection.tools];
	const normallyProfiledTools = input.nativeToolSurfaceEnabled === false ? filterCodexDynamicToolsForDisabledNativeSurface(readableAllTools, input.pluginConfig, { preserveShell: shouldKeepOpenClawShellDynamicTools(input, nativeExecutionPolicy) }) : filterCodexDynamicTools(readableAllTools, input.pluginConfig);
	const profileFilteredTools = (input.isHostScopedToolActive?.("openclaw") ?? isHostScopedAgentToolActive("openclaw")) && isSystemAgentOnlyCodexDynamicToolAllowlist(params.toolsAllow) ? preserveRingZeroSystemAgentTool(readableAllTools, normallyProfiledTools) : normallyProfiledTools;
	const codexFilteredTools = addNodeShellDynamicToolsIfNeeded(addSandboxShellDynamicToolsIfAvailable(isCodexMemoryFlushRun(params) ? filterCodexMemoryFlushDynamicTools(readableAllTools) : profileFilteredTools, readableAllTools, input), readableAllTools, input, nativeExecutionPolicy);
	toolBuildStages.mark("codex-filtering");
	const visionFilteredTools = filterToolsForVisionInputs(codexFilteredTools, {
		modelHasVision,
		hasInboundImages: (params.images?.length ?? 0) > 0
	});
	toolBuildStages.mark("vision-filtering");
	const webSearchPresent = visionFilteredTools.some((tool) => tool.name === "web_search");
	const persistentCodexWebSearchSurface = params.config?.tools?.web?.search?.enabled !== false && !(input.pluginConfig.codexDynamicToolsExclude ?? []).some((name) => normalizeCodexDynamicToolName(name) === "web_search");
	const webSearchPolicy = webSearchPresent || persistentCodexWebSearchSurface ? (await loadAgentHarnessModule()).resolveWebSearchToolPolicy({
		config: params.config,
		modelProvider: params.model.provider,
		modelId: params.modelId,
		agentId: input.sessionAgentId,
		sessionKey: input.sandboxSessionKey,
		sandboxToolPolicy: input.sandbox?.tools,
		messageProvider: resolveCodexMessageToolProvider(params),
		agentAccountId: params.agentAccountId,
		groupId: params.groupId,
		groupChannel: params.groupChannel,
		groupSpace: params.groupSpace,
		spawnedBy: params.spawnedBy,
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername,
		senderE164: params.senderE164,
		inputProvenance: params.inputProvenance,
		trustedInternalHandoff: params.trustedInternalHandoff,
		scheduledToolPolicy: params.scheduledToolPolicy
	}) : {
		allowed: false,
		persistentAllowed: false
	};
	const transientWebSearchRestriction = !webSearchPolicy.allowed && webSearchPolicy.persistentAllowed || isCodexMemoryFlushRun(params);
	input.onPersistentWebSearchPolicyResolved?.(webSearchPresent || persistentCodexWebSearchSurface && transientWebSearchRestriction && webSearchPolicy.persistentAllowed);
	const filteredTools = filterCodexDynamicToolsForAllowlist(visionFilteredTools, includeForcedCodexDynamicToolAllow(params.toolsAllow, messagePolicyParams));
	toolBuildStages.mark("allowlist-filter");
	const normalizedTools = normalizeAgentRuntimeTools({
		runtimePlan: input.ignoreRuntimePlan ? void 0 : params.runtimePlan,
		tools: filteredTools,
		provider: params.provider,
		config: params.config,
		workspaceDir: input.effectiveWorkspace,
		env: process.env,
		modelId: params.modelId,
		modelApi: params.model.api,
		model: params.model,
		allowProviderRuntimePluginLoad: input.ignoreRuntimePlan ? false : void 0,
		onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
	});
	toolBuildStages.mark("runtime-normalization");
	input.onWebSearchPolicyResolved?.(normalizedTools.some((tool) => tool.name === "web_search"));
	const exposedTools = webSearchPlan.suppressManagedWebSearch ? normalizedTools.filter((tool) => tool.name !== "web_search") : normalizedTools;
	if (preNormalizationDiagnostics.length > 0) log.warn(`codex app-server quarantined ${preNormalizationDiagnostics.length} unsupported runtime tool schema${preNormalizationDiagnostics.length === 1 ? "" : "s"} before dynamic tool registration`, {
		runId: params.runId,
		sessionId: params.sessionId,
		diagnostics: preNormalizationDiagnostics.map((diagnostic) => ({
			index: diagnostic.toolIndex,
			tool: diagnostic.toolName,
			violations: diagnostic.violations.slice(0, 12),
			violationCount: diagnostic.violations.length
		}))
	});
	const summary = toolBuildStages.snapshot();
	if (shouldWarnCodexDynamicToolBuildStageSummary(summary)) {
		const phase = input.forceHeartbeatTool ? "registered-tools" : "runtime-tools";
		log.warn(`codex app-server dynamic tool build timings runId=${params.runId} sessionId=${params.sessionId} phase=${phase} totalMs=${summary.totalMs} stages=${formatCodexDynamicToolBuildStageSummary(summary)}`, {
			runId: params.runId,
			sessionId: params.sessionId,
			phase,
			totalMs: summary.totalMs,
			stages: summary.stages,
			allToolCount: readableAllTools.length,
			codexFilteredToolCount: codexFilteredTools.length,
			visionFilteredToolCount: visionFilteredTools.length,
			filteredToolCount: filteredTools.length,
			normalizedToolCount: exposedTools.length,
			forceHeartbeatTool: input.forceHeartbeatTool === true,
			ignoreRuntimePlan: input.ignoreRuntimePlan === true,
			nativeToolSurfaceEnabled: input.nativeToolSurfaceEnabled === true
		});
	}
	return exposedTools;
}
/** Preserves delivery-critical tools when a narrow allowlist would otherwise hide them. */
function includeForcedCodexDynamicToolAllow(toolsAllow, params) {
	if (toolsAllow === void 0 || hasWildcardCodexToolsAllow(toolsAllow)) return toolsAllow;
	const forcedToolNames = shouldForceMessageTool(params) ? ["message"] : [];
	if (forcedToolNames.length === 0) return toolsAllow;
	if (toolsAllow.length === 0) return forcedToolNames;
	const normalized = new Set(toolsAllow.map((name) => normalizeCodexDynamicToolName(name)));
	const missingToolNames = forcedToolNames.filter((toolName) => !normalized.has(normalizeCodexDynamicToolName(toolName)));
	return missingToolNames.length === 0 ? toolsAllow : [...toolsAllow, ...missingToolNames];
}
/** Decides whether Codex native code mode can own shell/file tools for this turn. */
function shouldEnableCodexAppServerNativeToolSurface(params, sandbox, options = {}) {
	if (params.pluginHarnessToolPolicyRestricted === true) return false;
	if (isCodexMemoryFlushRun(params)) return false;
	if (params.disableTools) return false;
	const toolsAllow = includeForcedCodexDynamicToolAllow(params.toolsAllow, params);
	if (toolsAllow === void 0) return canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
	return hasWildcardCodexToolsAllow(toolsAllow) && canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options);
}
/** Returns true when OpenClaw policy requires the Node-owned exec/process tools instead. */
function isCodexNativeExecutionBlockedByNodeExecHost(params, options = {}) {
	return !resolveCodexNativeExecutionPolicy({
		config: params.config,
		sessionKey: resolveCodexRuntimePolicySessionKey(params, options.runtimeSessionKey),
		sessionId: params.sessionId,
		agentId: options.agentId,
		execOverrides: params.execOverrides,
		sandboxAvailable: options.sandbox?.enabled,
		readRuntimeSessionEntry: true
	}).nativeToolSurfaceAllowed;
}
function resolveCodexRuntimePolicySessionKey(params, runtimeSessionKey) {
	return runtimeSessionKey?.trim() || params.sandboxSessionKey?.trim() || params.sessionKey?.trim() || params.sessionId;
}
function canCodexAppServerNativeToolSurfaceHonorSandbox(sandbox, options = {}) {
	if (!sandbox?.enabled) return true;
	if (options.sandboxExecServerEnabled === true && sandbox.backend && canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox)) return true;
	return false;
}
function canSandboxToolPolicyExposeCodexNativeToolSurface(sandbox) {
	return CODEX_NATIVE_SANDBOX_TOOL_REQUIREMENTS.every((toolName) => isToolAllowed(sandbox.tools, toolName));
}
function isCodexMemoryFlushRun(params) {
	return params?.trigger === "memory" && Boolean(params.memoryFlushWritePath?.trim());
}
function filterCodexMemoryFlushDynamicTools(tools) {
	return tools.filter((tool) => CODEX_MEMORY_FLUSH_DYNAMIC_TOOL_ALLOW.has(normalizeCodexDynamicToolName(tool.name)));
}
/** Requires a Codex sandbox environment only when native tools must run inside OpenClaw sandboxing. */
function shouldRequireCodexSandboxExecServerEnvironment(params) {
	return Boolean(isCodexRemoteExecPlacementSandbox(params.sandbox) || params.sandbox?.enabled && params.nativeToolSurfaceEnabled && params.sandboxExecServerEnabled);
}
/** Selects the sandbox exec-server environment passed through the Codex app-server protocol. */
function resolveCodexSandboxEnvironmentSelection(environment, nativeToolSurfaceEnabled) {
	return nativeToolSurfaceEnabled ? environment ? [environment] : void 0 : [];
}
/** Chooses the cwd visible to Codex native execution after sandbox exec-server setup. */
function resolveCodexAppServerExecutionCwd(params) {
	return mapCodexAppServerRemoteWorkspacePath({
		value: params.environment && params.nativeToolSurfaceEnabled ? params.environment.cwd : params.effectiveCwd,
		localWorkspaceRoot: params.localWorkspaceRoot,
		remoteWorkspaceRoot: params.remoteWorkspaceRoot
	});
}
/** Converts OpenClaw sandbox networking into Codex's external-sandbox policy shape. */
function resolveCodexExternalSandboxPolicyForOpenClawSandbox(sandbox) {
	return {
		type: "externalSandbox",
		networkAccess: codexNetworkAccessForOpenClawSandbox(sandbox) ? "enabled" : "restricted"
	};
}
function usesDockerNetworkConfig(sandbox) {
	const backendId = sandbox?.backendId.trim().toLowerCase();
	return backendId === "docker" || backendId === "podman";
}
function codexNetworkAccessForOpenClawSandbox(sandbox) {
	if (!usesDockerNetworkConfig(sandbox)) return true;
	const network = sandbox?.docker?.network?.trim().toLowerCase();
	return Boolean(network && network !== "none");
}
/** Returns a Codex config copy with all app exposure disabled for restricted thread tools. */
function disableCodexPluginThreadConfig(pluginConfig) {
	const config = readCodexPluginConfig(pluginConfig);
	return {
		...config,
		codexPlugins: {
			...config.codexPlugins,
			enabled: false
		}
	};
}
/** Adds sandbox_exec/process aliases when native Code Mode cannot directly honor the sandbox. */
function addSandboxShellDynamicToolsIfAvailable(filteredTools, allTools, input) {
	if (!shouldExposeSandboxExecDynamicTool(input) || isSandboxShellDynamicToolExcluded(input.pluginConfig)) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	if (!execTool || !processTool) return filteredTools;
	const sandboxExecTool = {
		...execTool,
		name: "sandbox_exec",
		description: "Run a shell command through OpenClaw's configured sandbox backend for this session. Use when OpenClaw sandboxing is active or when a command must execute in the sandbox backend, such as an SSH-backed sandbox or Docker container-path bind layout. Use Codex's native shell only when no OpenClaw sandbox is active and native Code Mode is available.",
		execute: async (toolCallId, args, signal, onUpdate) => {
			const result = await execTool.execute(toolCallId, args, signal, onUpdate);
			return {
				...result,
				content: result.content.map((item) => item.type === "text" ? Object.assign({}, item, { text: item.text.replace("Use process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.", "Use sandbox_process (list/poll/log/write/send-keys/submit/paste/kill/clear/remove) for follow-up.") }) : item)
			};
		}
	};
	const sandboxProcessTool = {
		...processTool,
		name: "sandbox_process",
		description: "Manage sandbox_exec sessions that were started through OpenClaw's configured sandbox backend for this session: list, poll, log, write, send-keys, submit, paste, kill, clear, or remove. Use only for sandbox_exec follow-up; use Codex's native shell session handling only when no OpenClaw sandbox is active and native Code Mode is available."
	};
	return [
		...filteredTools,
		sandboxExecTool,
		sandboxProcessTool
	];
}
function shouldExposeSandboxExecDynamicTool(input) {
	if (isCodexMemoryFlushRun(input.params)) return false;
	if (isCodexNativeExecutionBlockedByNodeExecHost(input.params, {
		agentId: input.sessionAgentId,
		runtimeSessionKey: input.sandboxSessionKey,
		sandbox: input.sandbox
	})) return false;
	const backendId = input.sandbox?.enabled ? input.sandbox.backendId.trim().toLowerCase() : "";
	return Boolean(backendId && input.nativeToolSurfaceEnabled === false);
}
function isSandboxShellDynamicToolExcluded(config) {
	return isCodexDynamicToolExcluded(config, [
		"exec",
		"sandbox_exec",
		"process",
		"sandbox_process"
	]);
}
function addNodeShellDynamicToolsIfNeeded(filteredTools, allTools, input, nodePolicy) {
	if (isCodexMemoryFlushRun(input.params)) return filteredTools;
	const nodeExecIsDefault = nodePolicy.effectiveExecHost === "node";
	const nodeExecAvailableFromAuto = nodePolicy.requestedExecHost === "auto" && nodePolicy.effectiveExecHost === "gateway";
	if (!nodeExecIsDefault && !nodeExecAvailableFromAuto) return filteredTools;
	const execTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "exec");
	const processTool = allTools.find((tool) => normalizeCodexDynamicToolName(tool.name) === "process");
	if (!execTool || !processTool) return filteredTools;
	const toolsToAppend = [];
	if (!isCodexDynamicToolExcluded(input.pluginConfig, ["exec", "node_exec"]) && !filteredTools.some((tool) => normalizeCodexDynamicToolName(tool.name) === "node_exec")) toolsToAppend.push(createNodeExecDynamicTool(execTool, nodePolicy.node));
	if (!isCodexDynamicToolExcluded(input.pluginConfig, ["process", "node_process"]) && !filteredTools.some((tool) => normalizeCodexDynamicToolName(tool.name) === "node_process")) toolsToAppend.push(createNodeProcessDynamicTool(processTool));
	return toolsToAppend.length > 0 ? [...filteredTools, ...toolsToAppend] : filteredTools;
}
function shouldKeepOpenClawShellDynamicTools(input, nodePolicy) {
	return !isCodexMemoryFlushRun(input.params) && input.nativeToolSurfaceEnabled === false && input.sandbox?.enabled !== true && nodePolicy.effectiveExecHost !== "node";
}
function resolveCodexNativeExecutionPolicyForDynamicTools(input) {
	return resolveCodexNativeExecutionPolicy({
		config: input.params.config,
		sessionKey: resolveCodexRuntimePolicySessionKey(input.params, input.sandboxSessionKey),
		sessionId: input.params.sessionId,
		agentId: input.sessionAgentId,
		execOverrides: input.params.execOverrides,
		sandboxAvailable: input.sandbox?.enabled,
		readRuntimeSessionEntry: true
	});
}
/** Applies a normalized tool allowlist while preserving shell aliases for exec/process. */
function filterCodexDynamicToolsForAllowlist(tools, toolsAllow) {
	if (!toolsAllow) return tools;
	if (toolsAllow.length === 0) return [];
	if (hasWildcardCodexToolsAllow(toolsAllow)) return tools;
	const allowSet = new Set(toolsAllow.map((name) => normalizeCodexDynamicToolName(name)).filter(Boolean));
	return tools.filter((tool) => {
		const normalized = normalizeCodexDynamicToolName(tool.name);
		return allowSet.has(normalized) || normalized === "sandbox_exec" && allowSet.has("exec") || normalized === "sandbox_process" && (allowSet.has("exec") || allowSet.has("process")) || normalized === "node_exec" && allowSet.has("exec") || normalized === "node_process" && (allowSet.has("exec") || allowSet.has("process"));
	});
}
/** Detects the wildcard allowlist marker after Codex tool-name normalization. */
function hasWildcardCodexToolsAllow(toolsAllow) {
	return toolsAllow.some((name) => normalizeCodexDynamicToolName(name) === "*");
}
/** Forces message delivery through the message tool when the source channel requires it. */
function shouldForceMessageTool(params) {
	return params.disableMessageTool !== true && params.sourceReplyDeliveryMode === "message_tool_only";
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server-registry.ts
const sandboxExecServerRegistry = {
	servers: /* @__PURE__ */ new Map(),
	async closeAll() {
		const servers = await Promise.allSettled(this.servers.values());
		this.servers.clear();
		await Promise.all(servers.map(async (entry) => {
			if (entry.status !== "fulfilled") return;
			const server = entry.value;
			server.refCount = 0;
			if (server.closed) return;
			server.closed = true;
			for (const client of server.server.clients) client.close(1001, "shutdown");
			await new Promise((resolve) => {
				server.server.close(() => resolve());
			});
		}));
	}
};
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/json-rpc.ts
/** JSON-RPC error code used when a sandbox filesystem resource does not exist. */
const JSON_RPC_NOT_FOUND = -32004;
/** JSON-RPC error code used when a sandbox exec-server method is unsupported. */
const JSON_RPC_METHOD_NOT_FOUND = -32601;
/** Protocol-level error carrying the JSON-RPC error code to send to the client. */
var JsonRpcProtocolError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
	}
};
/** Parses raw WebSocket data into a JSON-RPC request object. */
function parseRequest(data) {
	const text = (Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data)).toString("utf8");
	return requireObject(JSON.parse(text), "JSON-RPC request");
}
/** Validates that a JSON value is a non-array object. */
function requireObject(value, label) {
	if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${label} must be an object.`);
	return value;
}
/** Validates a non-empty string JSON-RPC parameter. */
function requireString(value, label) {
	if (typeof value !== "string" || !value) throw new Error(`${label} must be a non-empty string.`);
	return value;
}
/** Validates a base64 payload parameter as a string; decoding happens at call sites. */
function requireBase64String(value, label) {
	if (typeof value !== "string") throw new Error(`${label} must be a string.`);
	return value;
}
/** Validates a finite numeric JSON-RPC parameter. */
function requireNumber(value, label) {
	if (typeof value !== "number" || !Number.isFinite(value)) throw new Error(`${label} must be a finite number.`);
	return value;
}
/** Validates a non-empty string-array JSON-RPC parameter. */
function requireStringArray(value, label) {
	if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) throw new Error(`${label} must be a string array.`);
	if (value.length === 0) throw new Error(`${label} must not be empty.`);
	return value;
}
/** Reads HTTP headers from JSON-RPC params, defaulting to an empty header list. */
function readHttpHeaders(value) {
	if (!Array.isArray(value)) return [];
	return value.map((entry, index) => {
		const record = requireObject(entry, `header ${index}`);
		return {
			name: requireString(record.name, "header name"),
			value: requireString(record.value, "header value")
		};
	});
}
/** Sends a JSON-RPC success response over the WebSocket. */
function sendResult(socket, id, result) {
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		id,
		result: result === void 0 ? {} : result
	}));
}
/** Sends a JSON-RPC error response over the WebSocket. */
function sendError(socket, id, code, message) {
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		id: id ?? null,
		error: {
			code,
			message
		}
	}));
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/path-uri.ts
/** Converts Codex PathUri protocol values into sandbox-backend path strings. */
const WINDOWS_DRIVE_PATH_RE = /^\/[A-Za-z]:(?:\/|$)/u;
/** Resolves one Codex exec-server PathUri into a POSIX sandbox path. */
function resolveExecServerPath(rawPath, label) {
	let pathUrl;
	try {
		pathUrl = new URL(rawPath);
	} catch (error) {
		throw new Error(`${label} must be a valid file URI: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	if (pathUrl.protocol !== "file:") throw new Error(`${label} URI must use the file scheme, received ${pathUrl.protocol.slice(0, -1)}.`);
	if (pathUrl.search || pathUrl.hash) throw new Error(`${label} file URI must not include a query or fragment.`);
	let resolved;
	try {
		resolved = fileURLToPath(pathUrl, { windows: false });
	} catch (error) {
		throw new Error(`${label} file URI is not valid for the sandbox: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
	if (WINDOWS_DRIVE_PATH_RE.test(resolved)) throw new Error(`${label} Windows file URI is not supported by the sandbox.`);
	if (resolved.includes("\0")) throw new Error(`${label} file URI must not contain a null byte.`);
	return resolved;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/fs-policy.ts
/**
* Resolves Codex filesystem sandbox policy payloads into OpenClaw path/glob
* checks for sandbox exec-server filesystem operations.
*/
/** Resolves request-local sandbox policy and asserts each requested path has the needed access. */
function assertFsSandboxAccess(execServer, record, requests) {
	assertResolvedFsSandboxAccess(resolveFsSandboxPolicy(execServer, record), requests);
}
/** Parses a Codex managed filesystem sandbox context into normalized access entries. */
function resolveFsSandboxPolicy(execServer, record) {
	if (record.sandbox === void 0 || record.sandbox === null) return;
	const sandbox = requireObject(record.sandbox, "fs sandbox context");
	const permissions = requireObject(sandbox.permissions, "fs sandbox permissions");
	const permissionType = requireString(permissions.type, "fs sandbox permissions type");
	if (permissionType === "disabled" || permissionType === "external") return {
		unrestricted: true,
		entries: []
	};
	if (permissionType !== "managed") throw new Error(`Unsupported Codex fs sandbox permission type: ${permissionType}`);
	const fileSystem = requireObject(permissions.file_system, "fs sandbox file system permissions");
	const fileSystemType = requireString(fileSystem.type, "fs sandbox file system permissions type");
	if (fileSystemType === "unrestricted") return {
		unrestricted: true,
		entries: []
	};
	if (fileSystemType !== "restricted") throw new Error(`Unsupported Codex fs sandbox file system type: ${fileSystemType}`);
	if (!Array.isArray(fileSystem.entries)) throw new Error("fs sandbox file system entries must be an array.");
	const cwd = readFsSandboxCwd(execServer, sandbox);
	return {
		unrestricted: false,
		entries: fileSystem.entries.flatMap((entry, index) => {
			const resolved = resolveFsSandboxEntry(requireObject(entry, `fs sandbox entry ${index}`), cwd);
			return resolved ? [resolved] : [];
		})
	};
}
function readFsSandboxCwd(execServer, sandbox) {
	if (sandbox.cwd === void 0 || sandbox.cwd === null) return normalizeSandboxAbsolutePath(execServer.sandbox.containerWorkdir, "sandbox cwd");
	return normalizeSandboxAbsolutePath(resolveExecServerPath(requireString(sandbox.cwd, "sandbox cwd"), "sandbox cwd"), "sandbox cwd");
}
function resolveFsSandboxEntry(entry, cwd) {
	const access = readFsAccessMode(entry.access);
	const pathSpec = requireObject(entry.path, "fs sandbox entry path");
	const pathType = requireString(pathSpec.type, "fs sandbox entry path type");
	if (pathType === "path") return {
		kind: "path",
		path: normalizeSandboxAbsolutePath(resolveExecServerPath(requireString(pathSpec.path, "fs sandbox path"), "fs sandbox path"), "fs sandbox path"),
		access
	};
	if (pathType === "special") {
		if (isNonGrantingFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path"))) return;
		return {
			kind: "path",
			path: resolveFsSpecialPath(requireObject(pathSpec.value, "fs sandbox special path"), cwd),
			access
		};
	}
	if (pathType === "glob_pattern") {
		const pattern = requireString(pathSpec.pattern, "fs sandbox glob pattern");
		const absolutePattern = normalizeSandboxGlobPattern(pattern.startsWith("/") ? pattern : posix.join(cwd, pattern));
		return {
			kind: "glob",
			pattern: absolutePattern,
			matcher: compileSandboxGlobPattern(absolutePattern),
			literalPrefix: sandboxGlobLiteralPrefix(absolutePattern),
			access
		};
	}
	throw new Error(`Unsupported Codex fs sandbox path type: ${pathType}`);
}
function isNonGrantingFsSpecialPath(value) {
	const kind = requireString(value.kind, "fs sandbox special path kind");
	return kind === "minimal" || kind === "unknown";
}
function readFsAccessMode(value) {
	if (value === "read" || value === "write" || value === "none") return value;
	if (value === "deny") return "none";
	throw new Error("fs sandbox entry access must be read, write, none, or deny.");
}
function resolveFsSpecialPath(value, cwd) {
	const kind = requireString(value.kind, "fs sandbox special path kind");
	if (kind === "root") return "/";
	if (kind === "project_roots" || kind === "current_working_directory") {
		const subpath = value.subpath === void 0 || value.subpath === null ? void 0 : requireString(value.subpath, "fs sandbox project roots subpath");
		return normalizeSandboxAbsolutePath(subpath ? posix.join(cwd, subpath) : cwd, "fs sandbox project roots path");
	}
	if (kind === "slash_tmp" || kind === "tmpdir") return "/tmp";
	throw new Error(`Unsupported Codex fs sandbox special path: ${kind}`);
}
/** Asserts access against an already resolved filesystem sandbox policy. */
function assertResolvedFsSandboxAccess(policy, requests) {
	if (!policy?.unrestricted && policy) for (const request of requests) {
		const access = resolveFsAccess(policy, request.path);
		if (request.access === "read" && access === "none") throw new Error(`Codex fs sandbox denied read access to ${request.path}`);
		if (request.access === "write" && access !== "write") throw new Error(`Codex fs sandbox denied write access to ${request.path}`);
	}
}
function resolveFsAccess(policy, rawPath) {
	if (policy.unrestricted) return "write";
	const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
	let selected;
	for (const entry of policy.entries) {
		if (!fsSandboxEntryMatches(entry, target)) continue;
		const candidate = {
			specificity: fsSandboxEntrySpecificity(entry),
			rank: fsAccessRank(entry.access),
			access: entry.access
		};
		if (!selected || candidate.specificity > selected.specificity || candidate.specificity === selected.specificity && candidate.rank > selected.rank) selected = candidate;
	}
	return selected?.access ?? "none";
}
/** Rejects recursive writes/removes that would cross protected read-only descendants. */
function assertNoReadOnlyDescendant(policy, rawPath, operation) {
	if (!policy || policy.unrestricted) return;
	const target = normalizeSandboxAbsolutePath(rawPath, "fs path");
	const protectedDescendant = policy.entries.find((entry) => {
		if (entry.access === "write" || !fsSandboxEntryCanAffectDescendant(entry, target)) return false;
		if (entry.kind === "glob") return true;
		const protectedPath = entry.path;
		return protectedPath && resolveFsAccess(policy, protectedPath) !== "write";
	});
	if (protectedDescendant) {
		const protectedPath = protectedDescendant.kind === "path" ? protectedDescendant.path : protectedDescendant.pattern;
		throw new Error(`Codex fs sandbox denied recursive ${operation} of ${rawPath} because ${protectedPath} is not writable.`);
	}
}
/** Normalizes and validates an absolute POSIX path inside the sandbox namespace. */
function normalizeSandboxAbsolutePath(rawPath, label) {
	if (!rawPath || rawPath.includes("\0") || !rawPath.startsWith("/")) throw new Error(`${label} must be an absolute sandbox path.`);
	const normalized = posix.normalize(rawPath);
	return normalized === "//" ? "/" : normalized;
}
/** Returns true when target is root itself or a descendant of root. */
function pathContains(root, target) {
	return root === "/" || target === root || target.startsWith(`${root}/`);
}
function fsSandboxEntryMatches(entry, target) {
	if (entry.kind === "path") return pathContains(entry.path, target);
	return entry.matcher.test(target);
}
function fsSandboxEntryCanAffectDescendant(entry, target) {
	if (entry.kind === "path") return pathContains(target, entry.path) && target !== entry.path;
	return pathContains(target, entry.literalPrefix) || pathContains(entry.literalPrefix, target);
}
function fsSandboxEntrySpecificity(entry) {
	return pathSpecificity(entry.kind === "path" ? entry.path : entry.literalPrefix);
}
function pathSpecificity(filePath) {
	return filePath === "/" ? 0 : filePath.split("/").filter(Boolean).length;
}
function fsAccessRank(access) {
	if (access === "none") return 2;
	if (access === "write") return 1;
	return 0;
}
function normalizeSandboxGlobPattern(pattern) {
	if (!pattern || pattern.includes("\0") || !pattern.startsWith("/")) throw new Error("fs sandbox glob pattern must be absolute.");
	return pattern.replace(/\/{2,}/gu, "/");
}
function compileSandboxGlobPattern(pattern) {
	let source = "^";
	for (let index = 0; index < pattern.length; index += 1) {
		const char = pattern[index];
		const next = pattern[index + 1];
		if (char === "*" && next === "*" && pattern[index + 2] === "/") {
			source += "(?:.*/)?";
			index += 2;
		} else if (char === "*" && next === "*") {
			source += ".*";
			index += 1;
		} else if (char === "*") source += "[^/]*";
		else if (char === "?") source += "[^/]";
		else if (char === "[") {
			const compiledClass = compileSandboxGlobCharacterClass(pattern, index);
			source += compiledClass.source;
			index = compiledClass.endIndex;
		} else source += char?.replace(/[\\^$+?.()|[\]{}]/gu, "\\$&") ?? "";
	}
	source += "$";
	return new RegExp(source, "u");
}
function compileSandboxGlobCharacterClass(pattern, startIndex) {
	let index = startIndex + 1;
	if (index >= pattern.length) throw new Error("fs sandbox glob character class must be closed.");
	const negated = pattern[index] === "!" || pattern[index] === "^";
	if (negated) index += 1;
	let body = "";
	for (; index < pattern.length; index += 1) {
		const char = pattern[index];
		if (char === "]" && body) return {
			source: `[${negated ? "^" : ""}${body}]`,
			endIndex: index
		};
		if (!char || char === "/") throw new Error("fs sandbox glob character class cannot match path separators.");
		body += escapeSandboxGlobCharacterClassChar(char, body.length === 0);
	}
	throw new Error("fs sandbox glob character class must be closed.");
}
function escapeSandboxGlobCharacterClassChar(char, first) {
	if (char === "\\" || char === "]") return `\\${char}`;
	if (first && char === "^") return "\\^";
	return char;
}
function sandboxGlobLiteralPrefix(pattern) {
	const wildcardIndex = pattern.search(/[*?[]/u);
	const prefix = wildcardIndex === -1 ? pattern : pattern.slice(0, wildcardIndex);
	const slash = prefix.lastIndexOf("/");
	if (slash <= 0) return "/";
	return normalizeSandboxAbsolutePath(prefix.slice(0, slash), "fs sandbox glob prefix");
}
/** Safely joins a single directory entry name onto a sandbox parent path. */
function joinSandboxChildPath(parent, child) {
	if (!child || child === "." || child === ".." || child.includes("/") || child.includes("\0")) throw new Error(`Invalid sandbox directory entry name: ${child}`);
	return parent.endsWith("/") ? `${parent}${child}` : `${parent}/${child}`;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/runtime.ts
/** Returns the configured sandbox backend or fails the current JSON-RPC request. */
function requireBackend(execServer) {
	const backend = execServer.sandbox.backend;
	if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
	return backend;
}
/** Returns the configured filesystem bridge or fails the current JSON-RPC request. */
function requireFsBridge(execServer) {
	const fsBridge = execServer.sandbox.fsBridge;
	if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
	return fsBridge;
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/filesystem.ts
/**
* Implements filesystem JSON-RPC handlers for the Codex sandbox exec-server
* with OpenClaw sandbox policy checks before every bridge operation.
*/
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES = 512 * 1024 * 1024;
const CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS = 128;
const CODEX_SANDBOX_EXEC_SERVER_MAX_BUFFERED_FILE_READ_BYTES = 64 * 1024 * 1024;
const CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES = 1024 * 1024;
const CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES = 32;
/** Opens a policy-checked sandbox file under a bounded, connection-owned handle. */
async function openFile(execServer, handles, params) {
	const record = requireObject(params, "fs/open params");
	const handleId = requireFileReadHandleId(record.handleId);
	if (handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
	if (handles.has(handleId)) throw new JsonRpcProtocolError(-32600, `file read handle \`${handleId}\` already exists`);
	if (handles.size >= CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS) throw new JsonRpcProtocolError(-32600, `at most ${CODEX_SANDBOX_EXEC_SERVER_MAX_OPEN_FILE_READS} file reads may be open per connection`);
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "read path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = requireFsBridge(execServer);
	const handle = {
		abortController: new AbortController(),
		closeRequested: false,
		reservedBytes: 0
	};
	handles.set(handleId, handle);
	try {
		const stat = await fsBridge.stat({
			filePath,
			signal: handle.abortController.signal
		});
		if (handles.get(handleId) !== handle || handle.closeRequested || handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
		if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
		if (stat.type !== "file") throw new JsonRpcProtocolError(-32600, "file read handle requires a regular file");
		if (!Number.isSafeInteger(stat.size) || stat.size < 0) throw new JsonRpcProtocolError(-32600, "file size must be a non-negative safe integer");
		if (stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_BUFFERED_FILE_READ_BYTES - bufferedFileReadBytes(handles)) throw new JsonRpcProtocolError(-32600, "sandbox file read exceeds the per-connection buffered file limit");
		handle.reservedBytes = stat.size;
		const data = await fsBridge.readFile({
			filePath,
			maxBytes: handle.reservedBytes,
			signal: handle.abortController.signal
		});
		if (handles.get(handleId) !== handle || handle.closeRequested || handles.closed) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
		if (data.byteLength > handle.reservedBytes) throw new JsonRpcProtocolError(-32600, "sandbox file read exceeds the per-connection buffered file limit");
		handle.reservedBytes = data.byteLength;
		handle.data = data;
		return { handleId };
	} catch (error) {
		if (handles.get(handleId) === handle) handles.delete(handleId);
		throw error;
	}
}
/** Reads a bounded base64 block from a handle belonging to this connection. */
function readFileBlock(handles, params) {
	const record = requireObject(params, "fs/readBlock params");
	const handleId = requireFileReadHandleId(record.handleId);
	const handle = handles.get(handleId);
	if (!handle?.data) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, `unknown file read handle \`${handleId}\``);
	const offset = requireNumber(record.offset, "offset");
	const length = requireNumber(record.len, "len");
	if (!Number.isSafeInteger(offset) || offset < 0) throw new JsonRpcProtocolError(-32600, "file read offset must be a non-negative safe integer");
	if (!Number.isSafeInteger(length) || length < 1 || length > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES) throw new JsonRpcProtocolError(-32600, `file read block length must be between 1 and ${CODEX_SANDBOX_EXEC_SERVER_MAX_READ_BLOCK_BYTES}`);
	const chunk = handle.data.subarray(offset, Math.min(offset + length, handle.data.byteLength));
	return {
		chunk: chunk.toString("base64"),
		eof: offset + chunk.byteLength >= handle.data.byteLength
	};
}
/** Closes one connection-owned file handle; repeated closes are harmless. */
function closeFile(handles, params) {
	closeFileReadHandle(handles, requireFileReadHandleId(requireObject(params, "fs/close params").handleId));
	return {};
}
/** Cancels a disconnected socket without releasing unsettled read reservations. */
function closeAllFileReads(handles) {
	handles.closed = true;
	for (const handleId of handles.keys()) closeFileReadHandle(handles, handleId);
}
function closeFileReadHandle(handles, handleId) {
	const handle = handles.get(handleId);
	if (!handle) return;
	handle.closeRequested = true;
	if (handle.data !== void 0) {
		handles.delete(handleId);
		return;
	}
	handle.abortController.abort();
}
function bufferedFileReadBytes(handles) {
	let total = 0;
	for (const handle of handles.values()) total += handle.reservedBytes;
	return total;
}
function requireFileReadHandleId(value) {
	const handleId = requireString(value, "handleId");
	if (Buffer.byteLength(handleId, "utf8") > CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES) throw new JsonRpcProtocolError(-32600, `file read handle ID must not exceed ${CODEX_SANDBOX_EXEC_SERVER_MAX_FILE_READ_HANDLE_ID_BYTES} bytes`);
	return handleId;
}
/** Reads a sandbox file as base64 after read-policy and size checks. */
async function readFile(execServer, params) {
	const record = requireObject(params, "fs/readFile params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "read path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = requireFsBridge(execServer);
	const stat = await fsBridge.stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	assertSandboxFileReadWithinLimit(stat);
	return { dataBase64: (await fsBridge.readFile({
		filePath,
		maxBytes: CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES
	})).toString("base64") };
}
/** Writes base64 data to an existing sandbox directory after write-policy checks. */
async function writeFile(execServer, params) {
	const record = requireObject(params, "fs/writeFile params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "write path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}]);
	const fsBridge = requireFsBridge(execServer);
	if ((await fsBridge.stat({ filePath: posix.dirname(filePath) }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	await fsBridge.writeFile({
		filePath,
		data: Buffer.from(requireBase64String(record.dataBase64, "dataBase64"), "base64"),
		mkdir: false
	});
}
/** Creates a sandbox directory, respecting recursive and parent-directory semantics. */
async function createDirectory(execServer, params) {
	const record = requireObject(params, "fs/createDirectory params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "create-directory path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "write"
	}]);
	const fsBridge = requireFsBridge(execServer);
	if (record.recursive === false) {
		const parentPath = posix.dirname(filePath);
		if ((await fsBridge.stat({ filePath: parentPath }))?.type !== "directory") throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "parent directory not found");
	}
	await fsBridge.mkdirp({ filePath });
}
/** Returns normalized metadata for a sandbox path. */
async function getMetadata(execServer, params) {
	const record = requireObject(params, "fs/getMetadata params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "metadata path");
	assertFsSandboxAccess(execServer, record, [{
		path: filePath,
		access: "read"
	}]);
	const stat = await requireFsBridge(execServer).stat({ filePath });
	if (!stat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	return metadataResponse(stat);
}
/** Lists sandbox directory entries visible under the resolved filesystem policy. */
async function readDirectory(execServer, params) {
	const record = requireObject(params, "fs/readDirectory params");
	return { entries: await listDirectoryEntries(execServer, resolveExecServerPath(requireString(record.path, "path"), "read-directory path"), resolveFsSandboxPolicy(execServer, record)) };
}
async function listDirectoryEntries(execServer, filePath, fsSandboxPolicy) {
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "read"
	}]);
	const fsBridge = requireFsBridge(execServer);
	const backend = requireBackend(execServer);
	const resolved = fsBridge.resolvePath({ filePath });
	if (!resolved) throw new Error(`Cannot resolve sandbox path: ${filePath}`);
	const result = await backend.runShellCommand({
		script: "find \"$1\" -mindepth 1 -maxdepth 1 -exec sh -c 'for path do name=${path##*/}; if [ -L \"$path\" ]; then kind=o; elif [ -d \"$path\" ]; then kind=d; elif [ -f \"$path\" ]; then kind=f; else kind=o; fi; printf \"%s\\t%s\\n\" \"$kind\" \"$name\"; done' sh {} +",
		args: [resolved.containerPath],
		allowFailure: true
	});
	if (result.code !== 0) {
		const stderr = result.stderr.toString("utf8").trim();
		throw new Error(stderr || `sandbox directory listing failed with code ${result.code}`);
	}
	return result.stdout.toString("utf8").split("\n").filter(Boolean).map((line) => {
		const [kind = "o", fileName = ""] = line.split("	");
		return {
			fileName,
			isDirectory: kind === "d",
			isFile: kind === "f"
		};
	});
}
/** Removes a sandbox path after rejecting writes outside policy or under read-only descendants. */
async function removePath(execServer, params) {
	const record = requireObject(params, "fs/remove params");
	const filePath = resolveExecServerPath(requireString(record.path, "path"), "remove path");
	const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: filePath,
		access: "write"
	}]);
	if (record.recursive !== false) assertNoReadOnlyDescendant(fsSandboxPolicy, filePath, "remove");
	await requireFsBridge(execServer).remove({
		filePath,
		recursive: record.recursive !== false,
		force: record.force !== false
	});
}
/** Copies sandbox files or recursive directories while enforcing source and destination policy. */
async function copyPath(execServer, params) {
	const record = requireObject(params, "fs/copy params");
	const sourcePath = resolveExecServerPath(requireString(record.sourcePath ?? record.source, "sourcePath"), "copy source path");
	const destinationPath = resolveExecServerPath(requireString(record.destinationPath ?? record.destination, "destinationPath"), "copy destination path");
	const fsSandboxPolicy = resolveFsSandboxPolicy(execServer, record);
	assertResolvedFsSandboxAccess(fsSandboxPolicy, [{
		path: sourcePath,
		access: "read"
	}, {
		path: destinationPath,
		access: "write"
	}]);
	await copySandboxPath(execServer, {
		sourcePath,
		destinationPath,
		recursive: record.recursive === true,
		fsSandboxPolicy
	});
}
async function copySandboxPath(execServer, params) {
	const fsBridge = execServer.sandbox.fsBridge;
	if (!fsBridge) throw new Error("Sandbox filesystem bridge is unavailable.");
	assertResolvedFsSandboxAccess(params.fsSandboxPolicy, [{
		path: params.sourcePath,
		access: "read"
	}, {
		path: params.destinationPath,
		access: "write"
	}]);
	const sourceStat = await fsBridge.stat({ filePath: params.sourcePath });
	if (!sourceStat) throw new JsonRpcProtocolError(JSON_RPC_NOT_FOUND, "file not found");
	if (sourceStat?.type === "directory") {
		if (!params.recursive) throw new Error(`Cannot copy directory without recursive=true: ${params.sourcePath}`);
		if (pathContains(normalizeSandboxAbsolutePath(params.sourcePath, "copy source path"), normalizeSandboxAbsolutePath(params.destinationPath, "copy destination path"))) throw new Error("Cannot recursively copy a directory into itself.");
		await fsBridge.mkdirp({ filePath: params.destinationPath });
		for (const entry of await listDirectoryEntries(execServer, params.sourcePath, params.fsSandboxPolicy)) {
			if (!entry.isDirectory && !entry.isFile) throw new Error(`Cannot copy unsupported filesystem entry: ${entry.fileName}`);
			await copySandboxPath(execServer, {
				sourcePath: joinSandboxChildPath(params.sourcePath, entry.fileName),
				destinationPath: joinSandboxChildPath(params.destinationPath, entry.fileName),
				recursive: true,
				fsSandboxPolicy: params.fsSandboxPolicy
			});
		}
		return;
	}
	if (sourceStat.type === "file" && fsBridge.copyFile) {
		await fsBridge.copyFile({
			sourcePath: params.sourcePath,
			destinationPath: params.destinationPath,
			mkdir: true
		});
		return;
	}
	assertSandboxFileReadWithinLimit(sourceStat);
	const data = await fsBridge.readFile({
		filePath: params.sourcePath,
		maxBytes: CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES
	});
	await fsBridge.writeFile({
		filePath: params.destinationPath,
		data,
		mkdir: true
	});
}
function assertSandboxFileReadWithinLimit(stat) {
	if (stat.type === "file" && stat.size > CODEX_SANDBOX_EXEC_SERVER_MAX_READ_FILE_BYTES) throw new Error(`file is too large to read through Codex sandbox exec-server: ${stat.size} bytes`);
}
function metadataResponse(stat) {
	return {
		isDirectory: stat?.type === "directory",
		isFile: stat?.type === "file",
		isSymlink: false,
		size: stat?.size ?? 0,
		createdAtMs: 0,
		modifiedAtMs: stat?.mtimeMs ?? 0
	};
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/http.ts
/**
* Implements sandboxed HTTP requests for Codex native tools by routing network
* access through the active OpenClaw sandbox backend.
*/
/** Maximum JSON-line size accepted from the streaming HTTP helper process. */
const SANDBOX_HTTP_STREAM_LINE_MAX_CHARS = 256 * 1024;
/** Handles one sandbox HTTP JSON-RPC request, optionally streaming response body deltas. */
async function httpRequest(execServer, socket, params) {
	const record = requireObject(params, "http/request params");
	const requestId = requireString(record.requestId, "requestId");
	const url = requireString(record.url, "url");
	assertSandboxHttpRequestTargetAllowed(url);
	const request = {
		method: requireString(record.method, "method"),
		url,
		headers: readHttpHeaders(record.headers),
		bodyBase64: typeof record.bodyBase64 === "string" ? record.bodyBase64 : void 0,
		timeoutMs: typeof record.timeoutMs === "number" && record.timeoutMs > 0 ? Math.floor(record.timeoutMs) : void 0,
		streamResponse: record.streamResponse === true
	};
	if (request.streamResponse) return await runStreamingSandboxHttpRequest(execServer, socket, requestId, request);
	return await runSandboxHttpRequest(execServer, {
		...request,
		streamResponse: false
	});
}
function assertSandboxHttpRequestTargetAllowed(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new SsrFBlockedError("Invalid URL supplied to sandbox http/request");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new SsrFBlockedError(`Blocked non-HTTP(S) protocol in sandbox http/request: ${parsed.protocol}`);
	if (isBlockedHostnameOrIp(parsed.hostname)) throw new SsrFBlockedError(`Blocked hostname or private/internal IP in sandbox http/request: ${parsed.hostname}`);
}
async function runSandboxHttpRequest(execServer, params) {
	const result = await requireBackend(execServer).runShellCommand({
		script: SANDBOX_HTTP_REQUEST_SCRIPT,
		stdin: JSON.stringify(params),
		allowFailure: true
	});
	if (result.code !== 0) {
		const stderr = result.stderr.toString("utf8").trim();
		throw new Error(stderr || `sandbox http/request failed with code ${result.code}`);
	}
	const parsed = JSON.parse(result.stdout.toString("utf8"));
	if (typeof parsed.status !== "number" || !Array.isArray(parsed.headers)) throw new Error("sandbox http/request returned an invalid response envelope");
	return {
		status: parsed.status,
		headers: readHttpHeaders(parsed.headers),
		bodyBase64: typeof parsed.bodyBase64 === "string" ? parsed.bodyBase64 : ""
	};
}
async function runStreamingSandboxHttpRequest(execServer, socket, requestId, params) {
	const backend = requireBackend(execServer);
	const execSpec = await backend.buildExecSpec({
		command: SANDBOX_HTTP_REQUEST_SCRIPT,
		workdir: execServer.sandbox.containerWorkdir,
		env: {},
		usePty: false
	});
	let child;
	try {
		const [command, ...args] = execSpec.argv;
		if (!command) throw new Error("OpenClaw sandbox HTTP exec spec did not provide a command.");
		child = spawn(command, args, {
			env: execSpec.env,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
	} catch (error) {
		try {
			await backend.finalizeExec?.({
				status: "failed",
				exitCode: null,
				timedOut: false,
				token: execSpec.finalizeToken
			});
		} catch (finalizeError) {
			log.warn("codex sandbox http/request finalize after start failure failed", { error: finalizeError });
		}
		throw error;
	}
	const abortOnSocketClose = () => child.kill("SIGTERM");
	socket.once("close", abortOnSocketClose);
	child.once("close", () => {
		socket.off("close", abortOnSocketClose);
	});
	child.stdin.on("error", (error) => {
		if (error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED") return;
		log.warn("codex sandbox http/request stdin write failed", { error });
	});
	child.stdin.end(JSON.stringify(params));
	return await readStreamingSandboxHttpResponse({
		child,
		execSpec,
		finalizeExec: backend.finalizeExec,
		requestId,
		socket
	});
}
function readStreamingSandboxHttpResponse(params) {
	return new Promise((resolve, reject) => {
		let headerResolved = false;
		let failed = false;
		let childFailure = null;
		let lastBodySeq = 0;
		let stdoutBuffer = "";
		let stderr = "";
		const finalize = async (status, exitCode) => {
			await params.finalizeExec?.({
				status,
				exitCode,
				timedOut: false,
				token: params.execSpec.finalizeToken
			});
		};
		const fail = (message, exitCode) => {
			if (failed) return;
			failed = true;
			finalize("failed", exitCode).catch((error) => {
				log.warn("codex sandbox http/request finalize failed", { error });
			});
			if (headerResolved) {
				sendHttpBodyDelta(params.socket, {
					requestId: params.requestId,
					seq: lastBodySeq + 1,
					deltaBase64: "",
					done: true,
					error: message
				});
				return;
			}
			reject(new Error(message));
		};
		params.child.stdout.setEncoding("utf8");
		params.child.stdout.on("data", (chunk) => {
			stdoutBuffer += chunk;
			let newline = stdoutBuffer.indexOf("\n");
			while (newline >= 0) {
				const line = stdoutBuffer.slice(0, newline).trim();
				stdoutBuffer = stdoutBuffer.slice(newline + 1);
				if (line) try {
					const message = requireObject(JSON.parse(line), "http stream message");
					const type = requireString(message.type, "http stream message type");
					if (type === "headers") {
						headerResolved = true;
						resolve({
							status: requireNumber(message.status, "http status"),
							headers: readHttpHeaders(message.headers),
							bodyBase64: ""
						});
					} else if (type === "bodyDelta") {
						const seq = requireNumber(message.seq, "http body sequence");
						lastBodySeq = Math.max(lastBodySeq, seq);
						sendHttpBodyDelta(params.socket, {
							requestId: params.requestId,
							seq,
							deltaBase64: typeof message.deltaBase64 === "string" ? message.deltaBase64 : "",
							done: message.done === true,
							error: typeof message.error === "string" ? message.error : null
						});
					}
				} catch (error) {
					fail(error instanceof Error ? error.message : String(error), null);
				}
				newline = stdoutBuffer.indexOf("\n");
			}
			if (stdoutBuffer.length > SANDBOX_HTTP_STREAM_LINE_MAX_CHARS) {
				params.child.kill("SIGKILL");
				fail(`sandbox http/request produced an unterminated stdout line longer than ${SANDBOX_HTTP_STREAM_LINE_MAX_CHARS} characters`, null);
			}
		});
		params.child.stderr.setEncoding("utf8");
		params.child.stderr.on("data", (chunk) => {
			stderr = sliceUtf16Safe(`${stderr}${chunk}`, -4096);
		});
		params.child.once("error", (error) => {
			childFailure ??= error.message;
		});
		params.child.once("close", (code) => {
			const exitCode = code ?? 1;
			if (failed) return;
			if (childFailure) {
				fail(childFailure, exitCode);
				return;
			}
			if (exitCode === 0) {
				finalize("completed", exitCode).catch((error) => {
					log.warn("codex sandbox http/request finalize failed", { error });
				});
				if (!headerResolved) reject(/* @__PURE__ */ new Error("sandbox http/request exited before returning headers"));
				return;
			}
			fail(stderr.trim() || `sandbox http/request failed with code ${exitCode}`, exitCode);
		});
	});
}
const SANDBOX_HTTP_REQUEST_SCRIPT = String.raw`
tmp=$(mktemp "$TMPDIR/openclaw-http.XXXXXX.py" 2>/dev/null || mktemp "/tmp/openclaw-http.XXXXXX.py") || exit 1
trap 'rm -f "$tmp"' EXIT
cat > "$tmp" <<'PY'
import base64
import json
import ipaddress
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

def emit(payload):
    print(json.dumps(payload, separators=(",", ":")), flush=True)

def response_headers(response):
    return [{"name": name, "value": value} for name, value in response.headers.items()]

BLOCKED_HOSTNAMES = {
    "localhost",
    "localhost.localdomain",
    "metadata.google.internal",
}
CLOUD_METADATA_IP_ADDRESSES = {
    "100.100.100.200",
    "fd00:ec2::254",
}
BLOCKED_IPV4_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100.64.0.0/10",
        "198.18.0.0/15",
    )
)
BLOCKED_IPV6_NETWORKS = tuple(
    ipaddress.ip_network(network)
    for network in (
        "100::/64",
        "2001:2::/48",
        "2001:20::/28",
        "2001:db8::/32",
        "fec0::/10",
    )
)
PINNED_ADDRESSES = {}

def normalize_hostname(hostname):
    return (hostname or "").strip("[]").rstrip(".").lower()

def is_blocked_hostname(hostname):
    normalized = normalize_hostname(hostname)
    return (
        normalized in BLOCKED_HOSTNAMES
        or normalized.endswith(".localhost")
        or normalized.endswith(".local")
        or normalized.endswith(".internal")
    )

def is_blocked_ip(address):
    try:
        parsed = ipaddress.ip_address(address)
    except ValueError:
        return False
    embedded_ipv4 = extract_embedded_ipv4(parsed)
    if embedded_ipv4 is not None and is_blocked_ip(str(embedded_ipv4)):
        return True
    if str(parsed).lower() in CLOUD_METADATA_IP_ADDRESSES:
        return True
    if isinstance(parsed, ipaddress.IPv4Address):
        if any(parsed in network for network in BLOCKED_IPV4_NETWORKS):
            return True
    else:
        if any(parsed in network for network in BLOCKED_IPV6_NETWORKS):
            return True
    return (
        parsed.is_loopback
        or parsed.is_private
        or parsed.is_link_local
        or parsed.is_multicast
        or parsed.is_reserved
        or parsed.is_unspecified
    )

def ipv4_from_int(value):
    return ipaddress.IPv4Address(value & 0xffffffff)

def extract_embedded_ipv4(address):
    if not isinstance(address, ipaddress.IPv6Address):
        return None
    if address.ipv4_mapped is not None:
        return address.ipv4_mapped
    value = int(address)
    hextets = [(value >> shift) & 0xffff for shift in range(112, -1, -16)]
    if hextets[:6] == [0, 0, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 0, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[:6] == [0x64, 0xff9b, 1, 0, 0, 0]:
        return ipv4_from_int(value)
    if hextets[0] == 0x2002:
        return ipv4_from_int((hextets[1] << 16) | hextets[2])
    if hextets[0] == 0x2001 and hextets[1] == 0:
        return ipv4_from_int(((hextets[6] << 16) | hextets[7]) ^ 0xffffffff)
    if (hextets[4] & 0xfcff) == 0 and hextets[5] == 0x5efe:
        return ipv4_from_int((hextets[6] << 16) | hextets[7])
    return None

def assert_url_allowed(url):
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError("http/request only supports http and https URLs")
    hostname = normalize_hostname(parsed.hostname)
    if not hostname or is_blocked_hostname(hostname) or is_blocked_ip(hostname):
        raise ValueError("Blocked hostname or private/internal/special-use IP address")
    try:
        results = socket.getaddrinfo(hostname, parsed.port, proto=socket.IPPROTO_TCP)
    except socket.gaierror as error:
        raise ValueError(f"Unable to resolve hostname: {hostname}") from error
    addresses = {entry[4][0] for entry in results if entry[4]}
    if not addresses or any(is_blocked_ip(address) for address in addresses):
        raise ValueError("Blocked: resolves to private/internal/special-use IP address")
    PINNED_ADDRESSES[hostname] = sorted(addresses)

class GuardedRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        assert_url_allowed(newurl)
        return super().redirect_request(req, fp, code, msg, headers, newurl)

def pinned_getaddrinfo(original_getaddrinfo):
    def getaddrinfo(host, port, family=0, type=0, proto=0, flags=0):
        pinned = PINNED_ADDRESSES.get(normalize_hostname(host))
        if not pinned:
            return original_getaddrinfo(host, port, family, type, proto, flags)
        results = []
        for address in pinned:
            results.extend(original_getaddrinfo(address, port, family, type, proto, flags))
        return results
    return getaddrinfo

def handle_response(input_data, response):
    headers = response_headers(response)
    status = int(getattr(response, "status", getattr(response, "code", 0)))
    if input_data.get("streamResponse"):
        emit({"type": "headers", "status": status, "headers": headers})
        seq = 1
        while True:
            chunk = response.read(65536)
            if not chunk:
                break
            emit({
                "type": "bodyDelta",
                "seq": seq,
                "deltaBase64": base64.b64encode(chunk).decode("ascii"),
                "done": False,
            })
            seq += 1
        emit({"type": "bodyDelta", "seq": seq, "deltaBase64": "", "done": True})
        return
    body = response.read()
    emit({
        "status": status,
        "headers": headers,
        "bodyBase64": base64.b64encode(body).decode("ascii"),
    })

def main():
    input_data = json.load(sys.stdin)
    url = str(input_data.get("url", ""))
    assert_url_allowed(url)
    body_base64 = input_data.get("bodyBase64")
    data = base64.b64decode(body_base64) if isinstance(body_base64, str) else None
    request = urllib.request.Request(
        url,
        data=data,
        method=str(input_data.get("method", "GET")),
    )
    for header in input_data.get("headers") or []:
        request.add_header(str(header.get("name", "")), str(header.get("value", "")))
    timeout_ms = input_data.get("timeoutMs")
    timeout = None
    if isinstance(timeout_ms, (int, float)) and timeout_ms > 0:
        timeout = timeout_ms / 1000
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), GuardedRedirectHandler)
    original_getaddrinfo = socket.getaddrinfo
    socket.getaddrinfo = pinned_getaddrinfo(original_getaddrinfo)
    try:
        with opener.open(request, timeout=timeout) as response:
            handle_response(input_data, response)
    except urllib.error.HTTPError as response:
        handle_response(input_data, response)
    finally:
        socket.getaddrinfo = original_getaddrinfo

if __name__ == "__main__":
    main()
PY
python3 "$tmp"
`.trim();
function sendHttpBodyDelta(socket, params) {
	if (socket.readyState !== 1) return;
	socket.send(JSON.stringify({
		jsonrpc: "2.0",
		method: "http/request/bodyDelta",
		params: {
			requestId: params.requestId,
			seq: params.seq,
			deltaBase64: params.deltaBase64,
			done: params.done,
			error: params.error ?? null
		}
	}));
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server/processes.ts
/**
* Manages subprocess lifecycle, streaming output buffers, stdin writes, and
* termination for Codex sandbox exec-server process RPCs.
*/
const ENV_KEY_RE = /^[A-Za-z_][A-Za-z0-9_]*$/;
const RETAINED_PROCESS_OUTPUT_BYTES = 1024 * 1024;
const CLOSED_PROCESS_EVICTION_MS = 6e4;
/** Starts a sandbox-backed process and registers it in the connection-local process table. */
async function startProcess(execServer, processes, socket, params) {
	const record = requireObject(params, "process/start params");
	const processId = requireString(record.processId, "processId");
	if (processes.has(processId)) throw new Error(`process already exists: ${processId}`);
	const argv = requireStringArray(record.argv, "argv");
	const cwd = resolveExecServerPath(requireString(record.cwd, "cwd"), "process cwd");
	rejectUnsupportedArg0(record.arg0);
	const env = readProcessEnv(record);
	const managed = {
		processId,
		chunks: [],
		retainedOutputBytes: 0,
		nextSeq: 1,
		exited: false,
		exitCode: null,
		closed: false,
		failure: null,
		tty: record.tty === true,
		pipeStdin: record.pipeStdin === true,
		abortController: new AbortController(),
		child: null,
		finalized: false,
		waiters: [],
		emitNotification: (method, notificationParams) => {
			if (socket.readyState === 1) socket.send(JSON.stringify({
				jsonrpc: "2.0",
				method,
				params: notificationParams
			}));
		},
		evictProcess: () => {
			if (managed.evictionTimer) return;
			managed.evictionTimer = setTimeout(() => {
				if (processes.get(processId) === managed && managed.closed) processes.delete(processId);
			}, CLOSED_PROCESS_EVICTION_MS);
			managed.evictionTimer.unref?.();
		}
	};
	processes.set(processId, managed);
	try {
		await runProcess(execServer, managed, {
			argv,
			cwd,
			env
		});
	} catch (error) {
		processes.delete(processId);
		managed.failure = coerceErrorMessage(error);
		managed.exitCode = null;
		managed.exited = true;
		managed.closed = true;
		notifyProcessWaiters(managed);
		throw error;
	}
	return { processId };
}
async function runProcess(execServer, managed, params) {
	const backend = execServer.sandbox.backend;
	if (!backend) throw new Error("OpenClaw sandbox backend is unavailable.");
	throwIfProcessStartCancelled(managed);
	const execSpec = await backend.buildExecSpec({
		command: shellCommandFromArgv(params.argv),
		workdir: params.cwd,
		env: params.env,
		usePty: false
	});
	managed.finalizeToken = execSpec.finalizeToken;
	managed.finalizeExec = backend.finalizeExec;
	let child;
	try {
		if (managed.abortController.signal.aborted) throw new Error("process start cancelled");
		const [command, ...args] = execSpec.argv;
		if (!command) throw new Error("OpenClaw sandbox exec spec did not provide a command.");
		child = spawn(command, args, {
			env: execSpec.env,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			]
		});
	} catch (error) {
		managed.failure = coerceErrorMessage(error);
		await finalizeProcess(managed).catch((finalizeError) => {
			log.warn("codex sandbox exec-server finalize after start failure failed", {
				processId: managed.processId,
				error: coerceErrorMessage(finalizeError)
			});
		});
		throw error;
	}
	managed.child = child;
	const abortListener = () => child.kill("SIGTERM");
	managed.abortController.signal.addEventListener("abort", abortListener, { once: true });
	child.stdout.on("data", (chunk) => appendProcessChunk(managed, managed.tty ? "pty" : "stdout", chunk));
	child.stderr.on("data", (chunk) => appendProcessChunk(managed, "stderr", chunk));
	child.once("error", (error) => {
		managed.failure ??= error.message;
		notifyProcessWaiters(managed);
	});
	child.once("close", (code) => {
		managed.abortController.signal.removeEventListener("abort", abortListener);
		emitProcessClosed(managed, code ?? 1);
	});
	if (!managed.tty && !managed.pipeStdin) child.stdin.end();
}
function throwIfProcessStartCancelled(managed) {
	if (managed.abortController.signal.aborted) throw new Error("process start cancelled");
}
function appendProcessChunk(managed, stream, data) {
	if (data.length === 0) return;
	const chunk = {
		seq: managed.nextSeq,
		stream,
		chunk: data.toString("base64")
	};
	managed.chunks.push(chunk);
	managed.retainedOutputBytes += data.length;
	while (managed.retainedOutputBytes > RETAINED_PROCESS_OUTPUT_BYTES && managed.chunks.length > 1) {
		const removed = managed.chunks.shift();
		if (!removed) break;
		managed.retainedOutputBytes -= Buffer.from(removed.chunk, "base64").byteLength;
	}
	managed.nextSeq += 1;
	managed.emitNotification("process/output", {
		processId: managed.processId,
		seq: chunk.seq,
		stream: chunk.stream,
		chunk: chunk.chunk
	});
	notifyProcessWaiters(managed);
}
function emitProcessClosed(managed, exitCode) {
	if (!managed.exited) {
		const exitSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.exitCode = exitCode;
		managed.exited = true;
		if (exitCode !== null) managed.emitNotification("process/exited", {
			processId: managed.processId,
			seq: exitSeq,
			exitCode
		});
	}
	if (!managed.closed) {
		const closeSeq = managed.nextSeq;
		managed.nextSeq += 1;
		managed.closed = true;
		managed.emitNotification("process/closed", {
			processId: managed.processId,
			seq: closeSeq
		});
	}
	finalizeProcess(managed).catch((error) => {
		const message = coerceErrorMessage(error);
		managed.failure ??= message;
		log.warn("codex sandbox exec-server finalize failed", {
			processId: managed.processId,
			error: message
		});
	});
	managed.evictProcess();
	notifyProcessWaiters(managed);
}
async function finalizeProcess(managed) {
	if (managed.finalized) return;
	managed.finalized = true;
	managed.child?.stdin.destroy();
	await managed.finalizeExec?.({
		status: managed.failure ? "failed" : "completed",
		exitCode: managed.exitCode,
		timedOut: false,
		token: managed.finalizeToken
	});
}
function limitProcessChunks(chunks, maxBytes) {
	if (!maxBytes) return chunks;
	const retained = [];
	let retainedBytes = 0;
	for (const chunk of chunks) {
		const byteLength = Buffer.from(chunk.chunk, "base64").byteLength;
		if (retained.length > 0 && retainedBytes + byteLength > maxBytes) break;
		retained.push(chunk);
		retainedBytes += byteLength;
		if (retainedBytes >= maxBytes) break;
	}
	return retained;
}
/** Reads buffered process output, optionally waiting for new output or process close. */
async function readProcess(processes, params) {
	const record = requireObject(params, "process/read params");
	const managed = requireProcess(processes, requireString(record.processId, "processId"));
	const afterSeq = typeof record.afterSeq === "number" ? record.afterSeq : 0;
	const waitMs = typeof record.waitMs === "number" && record.waitMs > 0 ? record.waitMs : 0;
	if (!managed.exited && !hasChunksAtOrAfter(managed, afterSeq) && waitMs > 0) await waitForProcessUpdate(managed, waitMs);
	const chunks = limitProcessChunks(managed.chunks.filter((chunk) => chunk.seq > afterSeq), typeof record.maxBytes === "number" && record.maxBytes > 0 ? record.maxBytes : void 0);
	const lastChunk = chunks.at(-1);
	return {
		chunks,
		nextSeq: lastChunk ? lastChunk.seq + 1 : managed.nextSeq,
		exited: managed.exited,
		exitCode: managed.exitCode,
		closed: managed.closed,
		failure: managed.failure
	};
}
/** Writes base64 stdin data to a running process when stdin is still open. */
function writeProcess(processes, params) {
	const record = requireObject(params, "process/write params");
	const processId = requireString(record.processId, "processId");
	const managed = processes.get(processId);
	if (!managed) return { status: "unknownProcess" };
	const chunk = Buffer.from(requireString(record.chunk, "chunk"), "base64");
	if (!managed.tty && !managed.pipeStdin || managed.closed || !managed.child?.stdin.writable) return { status: "stdinClosed" };
	managed.child.stdin.write(chunk);
	return { status: "accepted" };
}
/** Requests process termination and reports whether it was running at call time. */
function terminateProcess(processes, params) {
	const processId = requireString(requireObject(params, "process/terminate params").processId, "processId");
	const managed = processes.get(processId);
	if (!managed) return { running: false };
	const running = !managed.exited;
	managed.abortController.abort();
	managed.child?.kill("SIGTERM");
	if (running && !managed.child) emitProcessClosed(managed, null);
	return { running };
}
function waitForProcessUpdate(managed, waitMs) {
	return new Promise((resolve) => {
		const timer = setTimeout(done, Math.min(waitMs, 3e4));
		function done() {
			clearTimeout(timer);
			managed.waiters = managed.waiters.filter((waiter) => waiter !== done);
			resolve();
		}
		managed.waiters.push(done);
	});
}
function notifyProcessWaiters(managed) {
	const waiters = managed.waiters;
	managed.waiters = [];
	for (const waiter of waiters) waiter();
}
function hasChunksAtOrAfter(managed, afterSeq) {
	return managed.chunks.some((chunk) => chunk.seq > afterSeq);
}
function shellCommandFromArgv(argv) {
	return argv.map(shellEscape).join(" ");
}
function shellEscape(value) {
	return `'${value.replaceAll("'", `'"'"'`)}'`;
}
function requireProcess(processes, processId) {
	const managed = processes.get(processId);
	if (!managed) throw new Error(`unknown process: ${processId}`);
	return managed;
}
function rejectUnsupportedArg0(value) {
	if (value === void 0 || value === null) return;
	if (typeof value === "string") throw new Error("Codex sandbox exec-server does not support arg0 overrides.");
	throw new Error("arg0 must be a string or null.");
}
function readEnv(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const env = {};
	for (const [key, rawValue] of Object.entries(value)) if (typeof rawValue === "string" && ENV_KEY_RE.test(key)) env[key] = rawValue;
	return env;
}
function readProcessEnv(record) {
	return sanitizeEnvVars({
		...buildEnvFromPolicy(record.envPolicy),
		...readEnv(record.env)
	}).allowed;
}
function buildEnvFromPolicy(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const policy = value;
	const inheritedEnv = readEnv(policy.set);
	const includeOnly = readStringList(policy.includeOnly);
	if (includeOnly.length > 0) filterEnvKeys(inheritedEnv, includeOnly, true);
	return inheritedEnv;
}
function filterEnvKeys(env, patterns, keepMatches) {
	if (patterns.length === 0) return;
	const regexes = patterns.map((pattern) => wildcardPatternToRegex(pattern));
	for (const key of Object.keys(env)) if (regexes.some((regex) => regex.test(key)) !== keepMatches) delete env[key];
}
function wildcardPatternToRegex(pattern) {
	const escaped = pattern.replace(/[.+^${}()|[\]\\]/gu, "\\$&");
	return new RegExp(`^${escaped.replaceAll("*", ".*").replaceAll("?", ".")}$`, "iu");
}
function readStringList(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string") : [];
}
//#endregion
//#region extensions/codex/src/app-server/sandbox-exec-server.ts
/**
* Hosts the local OpenClaw sandbox exec-server that Codex app-server native
* execution can register as an external environment.
*/
const CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES = 100 * 1024 * 1024;
/** Starts or reuses a sandbox exec-server and registers it with Codex app-server. */
async function ensureCodexSandboxExecServerEnvironment(params) {
	if (!params.sandbox?.enabled || !params.sandbox.backend) return;
	if (!canExposeLocalExecServerToAppServer(params.appServerStartOptions)) throw new Error("OpenClaw Codex exec-server uses a local loopback URL and cannot be registered with a remote Codex app-server.");
	const execServer = await acquireOpenClawExecServer(params.sandbox);
	try {
		await params.client.request("environment/add", {
			environmentId: execServer.environmentId,
			execServerUrl: execServer.url
		}, {
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
	} catch (error) {
		await releaseOpenClawExecServer(execServer);
		if (isEnvironmentAddUnsupported(error)) {
			log.warn("codex app-server does not support remote environments yet", { environmentId: execServer.environmentId });
			return;
		}
		throw error;
	}
	return {
		environmentId: execServer.environmentId,
		cwd: params.sandbox.containerWorkdir
	};
}
/** Releases the sandbox exec-server lease associated with a sandbox runtime. */
async function releaseCodexSandboxExecServerEnvironment(sandbox) {
	if (!sandbox?.enabled) return;
	const server = await sandboxExecServerRegistry.servers.get(sandbox.runtimeId)?.catch(() => void 0);
	if (server) await releaseOpenClawExecServer(server);
}
function isEnvironmentAddUnsupported(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("environment/add") && (error.message.includes("unknown variant") || error.message.includes("Method not found"));
}
function canExposeLocalExecServerToAppServer(startOptions) {
	if (!startOptions || startOptions.transport !== "websocket") return true;
	if (typeof startOptions.url !== "string") return false;
	try {
		const host = new URL(startOptions.url).hostname.toLowerCase();
		const ipHost = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
		if (host === "localhost" || ipHost === "::1") return true;
		return isIP(ipHost) === 4 && ipHost.split(".")[0] === "127";
	} catch {
		return false;
	}
}
async function acquireOpenClawExecServer(sandbox) {
	const key = sandbox.runtimeId;
	while (true) {
		const promise = sandboxExecServerRegistry.servers.get(key) ?? startAndRememberOpenClawExecServer(sandbox);
		const server = await promise;
		if (!server.closed && sandboxExecServerRegistry.servers.get(key) === promise) {
			server.refCount += 1;
			return server;
		}
	}
}
function startAndRememberOpenClawExecServer(sandbox) {
	const created = startOpenClawExecServer(sandbox);
	const key = sandbox.runtimeId;
	sandboxExecServerRegistry.servers.set(key, created);
	created.catch(() => {
		if (sandboxExecServerRegistry.servers.get(key) === created) sandboxExecServerRegistry.servers.delete(key);
	});
	return created;
}
async function startOpenClawExecServer(sandbox) {
	const server = new WebSocketServer({
		host: "127.0.0.1",
		port: 0,
		maxPayload: CODEX_SANDBOX_EXEC_SERVER_MAX_INBOUND_MESSAGE_BYTES
	});
	await once(server, "listening");
	const address = server.address();
	if (!address || typeof address === "string") throw new Error("OpenClaw Codex exec-server did not bind to a TCP port.");
	const environmentId = buildEnvironmentId(sandbox);
	const authPath = `/openclaw-${randomUUID()}`;
	const execServer = {
		authPath,
		closed: false,
		environmentId,
		refCount: 0,
		url: `ws://127.0.0.1:${address.port}${authPath}`,
		sandbox,
		server
	};
	server.on("connection", (socket, request) => {
		socket.on("error", handleExecServerSocketError);
		if (!isAuthorizedExecServerRequest(execServer, request)) {
			socket.close(1008, "unauthorized");
			return;
		}
		handleConnection(execServer, socket);
	});
	log.info("codex sandbox exec-server started", {
		environmentId,
		runtimeId: sandbox.runtimeId,
		backendId: sandbox.backendId
	});
	return execServer;
}
async function releaseOpenClawExecServer(execServer) {
	if (execServer.closed) return;
	execServer.refCount = Math.max(0, execServer.refCount - 1);
	if (execServer.refCount > 0) return;
	const current = await sandboxExecServerRegistry.servers.get(execServer.sandbox.runtimeId)?.catch(() => void 0);
	if (execServer.refCount > 0 || execServer.closed) return;
	if (current === execServer) sandboxExecServerRegistry.servers.delete(execServer.sandbox.runtimeId);
	await closeOpenClawExecServer(execServer);
}
async function closeOpenClawExecServer(execServer) {
	if (execServer.closed) return;
	execServer.closed = true;
	for (const client of execServer.server.clients) client.close(1001, "shutdown");
	await new Promise((resolve) => {
		execServer.server.close(() => resolve());
	});
}
function buildEnvironmentId(sandbox) {
	return `openclaw-sandbox-${createHash("sha256").update(sandbox.runtimeId).digest("hex").slice(0, 16)}`;
}
function isAuthorizedExecServerRequest(execServer, request) {
	return new URL(request.url ?? "", "ws://127.0.0.1").pathname === execServer.authPath;
}
function handleConnection(execServer, socket) {
	const processes = /* @__PURE__ */ new Map();
	const fileReads = /* @__PURE__ */ new Map();
	socket.on("message", (data) => {
		handleMessage(execServer, processes, fileReads, socket, data).catch((error) => {
			log.warn("codex sandbox exec-server message failed", { error });
		});
	});
	socket.on("close", () => {
		closeAllFileReads(fileReads);
		for (const process of processes.values()) process.abortController.abort();
	});
}
function handleExecServerSocketError(error) {
	log.debug("codex sandbox exec-server websocket failed", { error });
}
async function handleMessage(execServer, processes, fileReads, socket, data) {
	const request = parseRequest(data);
	if (!request.method) {
		sendError(socket, request.id, -32600, "Invalid Request");
		return;
	}
	const method = request.method;
	if (request.id === void 0) {
		if (method !== "initialized") sendError(socket, -1, -32600, `Unexpected notification: ${method}`);
		return;
	}
	try {
		const result = await dispatchRequest(execServer, processes, fileReads, socket, {
			...request,
			method
		});
		sendResult(socket, request.id, result);
	} catch (error) {
		sendError(socket, request.id, error instanceof JsonRpcProtocolError ? error.code : -32603, error instanceof Error ? error.message : String(error));
	}
}
async function dispatchRequest(execServer, processes, fileReads, socket, request) {
	switch (request.method) {
		case "initialize": return { sessionId: randomUUID() };
		case "environment/info": return {
			shell: {
				name: "sh",
				path: "/bin/sh"
			},
			cwd: pathToFileURL(execServer.sandbox.containerWorkdir, { windows: false }).href,
			capabilities: { networkProxyLaunch: false }
		};
		case "environment/status": return { status: "ready" };
		case "process/start": return startProcess(execServer, processes, socket, request.params);
		case "process/read": return await readProcess(processes, request.params);
		case "process/write": return writeProcess(processes, request.params);
		case "process/terminate": return terminateProcess(processes, request.params);
		case "fs/open": return await openFile(execServer, fileReads, request.params);
		case "fs/readBlock": return readFileBlock(fileReads, request.params);
		case "fs/close": return closeFile(fileReads, request.params);
		case "fs/readFile": return await readFile(execServer, request.params);
		case "fs/writeFile":
			await writeFile(execServer, request.params);
			return {};
		case "fs/createDirectory":
			await createDirectory(execServer, request.params);
			return {};
		case "fs/getMetadata": return await getMetadata(execServer, request.params);
		case "fs/readDirectory": return await readDirectory(execServer, request.params);
		case "fs/remove":
			await removePath(execServer, request.params);
			return {};
		case "fs/copy":
			await copyPath(execServer, request.params);
			return {};
		case "http/request": return await httpRequest(execServer, socket, request.params);
		default: throw new JsonRpcProtocolError(JSON_RPC_METHOD_NOT_FOUND, `Unsupported OpenClaw sandbox exec-server method: ${request.method}`);
	}
}
//#endregion
//#region extensions/codex/src/app-server/provider-capabilities.ts
function resolveOverriddenProviderWebSearchSupport(modelProviderOverride) {
	const provider = modelProviderOverride?.trim().toLowerCase();
	if (!provider) return;
	return provider === "openai" ? "supported" : "unsupported";
}
async function readConfiguredProviderWebSearchSupport(params) {
	return (await params.client.request("modelProvider/capabilities/read", {}, {
		timeoutMs: params.timeoutMs,
		signal: params.signal
	})).webSearch ? "supported" : "unsupported";
}
async function resolveCodexProviderWebSearchSupportForClient(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	try {
		return await readConfiguredProviderWebSearchSupport(params);
	} catch {
		return "unknown";
	}
}
async function resolveCodexProviderWebSearchSupport(params) {
	const overrideSupport = resolveOverriddenProviderWebSearchSupport(params.modelProviderOverride);
	if (overrideSupport) return overrideSupport;
	let client;
	try {
		client = await params.clientFactory({
			startOptions: params.appServer.start,
			...params.preparedAuth ? { preparedAuth: params.preparedAuth } : { authProfileId: params.authProfileId },
			agentDir: params.agentDir,
			config: params.config,
			timeoutMs: params.appServer.requestTimeoutMs
		});
		return await resolveCodexProviderWebSearchSupportForClient({
			client,
			timeoutMs: params.appServer.requestTimeoutMs,
			modelProviderOverride: params.modelProviderOverride,
			signal: params.signal
		});
	} catch {
		return "unknown";
	} finally {
		if (client) releaseLeasedSharedCodexAppServerClient(client);
	}
}
//#endregion
//#region extensions/codex/src/app-server/plugin-approval-roundtrip.ts
const DEFAULT_CODEX_APPROVAL_TIMEOUT_MS = 12e4;
const MAX_PLUGIN_APPROVAL_TITLE_LENGTH = 80;
const MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH = 256;
const ANSI_OSC_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b]|\u009d)[^\u001b\u009c\u0007]*(?:\u0007|\u001b\\|\u009c)`, "g");
const ANSI_CONTROL_SEQUENCE_RE = new RegExp(String.raw`(?:\u001b\[[0-?]*[ -/]*[@-~]|\u009b[0-?]*[ -/]*[@-~]|\u001b[@-Z\\-_])`, "g");
const CONTROL_CHARACTER_RE = new RegExp(String.raw`[\u0000-\u001f\u007f-\u009f]+`, "g");
const INVISIBLE_FORMATTING_CONTROL_RE = new RegExp(String.raw`[\u00ad\u034f\u061c\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff\ufe00-\ufe0f\u{e0100}-\u{e01ef}]`, "gu");
const DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE = new RegExp(String.raw`(?:\u001b\][^\u001b\u009c\u0007]*|\u009d[^\u001b\u009c\u0007]*|\u001b\[[0-?]*[ -/]*|\u009b[0-?]*[ -/]*|\u001b)$`);
/** Starts a two-phase plugin approval request through the OpenClaw gateway. */
async function requestPluginApproval(params) {
	const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
	return params.hostCapabilities.requestApproval({
		title: truncateCodexApprovalDisplayText(params.title, MAX_PLUGIN_APPROVAL_TITLE_LENGTH),
		description: truncateCodexApprovalDisplayText(params.description, MAX_PLUGIN_APPROVAL_DESCRIPTION_LENGTH),
		severity: params.severity,
		toolName: params.toolName,
		toolCallId: params.toolCallId,
		timeoutMs,
		transportTimeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs),
		...params.allowedDecisions ? { allowedDecisions: params.allowedDecisions } : {}
	});
}
/** Detects the gateway's explicit null-decision marker for unavailable approvals. */
function approvalRequestExplicitlyUnavailable(result) {
	if (result === null || result === void 0 || typeof result !== "object") return false;
	let descriptor;
	try {
		descriptor = Object.getOwnPropertyDescriptor(result, "decision");
	} catch {
		return false;
	}
	return descriptor !== void 0 && "value" in descriptor && descriptor.value === null;
}
/** Waits for the gateway's final approval decision, respecting turn aborts. */
async function waitForPluginApprovalDecision(params) {
	const timeoutMs = DEFAULT_CODEX_APPROVAL_TIMEOUT_MS;
	const waitPromise = params.hostCapabilities.waitForApproval({
		approvalId: params.approvalId,
		timeoutMs,
		transportTimeoutMs: resolveCodexGatewayTimeoutWithGraceMs(timeoutMs),
		signal: params.signal
	}).catch((error) => {
		if (isApprovalNotFoundError(error)) return null;
		throw error;
	});
	const bindDecision = (result) => result;
	if (!params.signal) return bindDecision(await waitPromise);
	let onAbort;
	const abortPromise = new Promise((_, reject) => {
		if (params.signal.aborted) {
			reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
			return;
		}
		onAbort = () => reject(toErrorObject(params.signal.reason, "Non-Error rejection"));
		params.signal.addEventListener("abort", onAbort, { once: true });
	});
	try {
		return bindDecision(await Promise.race([waitPromise, abortPromise]));
	} finally {
		if (onAbort) params.signal.removeEventListener("abort", onAbort);
	}
}
/** Converts a gateway exec approval decision into the app-server approval outcome enum. */
function mapExecDecisionToOutcome(decision) {
	if (decision === "allow-once") return "approved-once";
	if (decision === "allow-always") return "approved-session";
	if (decision === null || decision === void 0) return "unavailable";
	return "denied";
}
function truncateCodexApprovalDisplayText(value, maxLength) {
	return value.length <= maxLength ? value : `${truncateUtf16Safe(value, maxLength - 3)}...`;
}
function stripDanglingCodexApprovalTerminalSequence(value) {
	return value.replace(DANGLING_TERMINAL_SEQUENCE_SUFFIX_RE, "");
}
function sanitizeCodexApprovalVisibleText(value, options = {}) {
	const terminalSafe = value.replace(ANSI_OSC_SEQUENCE_RE, "").replace(ANSI_CONTROL_SEQUENCE_RE, "");
	return (options.stripDanglingTerminalSequence ? stripDanglingCodexApprovalTerminalSequence(terminalSafe) : terminalSafe).replace(INVISIBLE_FORMATTING_CONTROL_RE, " ").replace(CONTROL_CHARACTER_RE, " ").replace(/\s+/g, " ").trim();
}
//#endregion
//#region extensions/codex/src/app-server/approval-bridge.ts
/**
* Bridges Codex app-server approval requests into OpenClaw policy hooks and
* plugin approval UX.
*/
const PERMISSION_DESCRIPTION_MAX_LENGTH = 700;
const PERMISSION_SAMPLE_LIMIT = 2;
const PERMISSION_VALUE_MAX_LENGTH = 48;
const COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH = 80;
const APPROVAL_PREVIEW_SCAN_MAX_LENGTH = 4096;
const APPROVAL_PREVIEW_OMITTED = "[preview truncated or unsafe content omitted]";
const CONCRETE_TOOL_AUTO_APPROVAL_METHODS = /* @__PURE__ */ new Set(["item/commandExecution/requestApproval", "item/fileChange/requestApproval"]);
/**
* Handles one app-server approval request for the active thread/turn, returning
* the app-server response payload when the request belongs to this run.
*/
async function handleCodexAppServerApprovalRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!matchesCurrentTurn(requestParams, params.threadId, params.turnId)) return;
	const context = buildApprovalContext({
		method: params.method,
		requestParams,
		paramsForRun: params.paramsForRun
	});
	const resolvePolicyApproval = (outcome, message = approvalResolutionMessage(outcome)) => {
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: outcome === "denied" ? "denied" : "approved",
			title: context.title,
			...context.eventDetails,
			...approvalEventScope(params.method, outcome),
			message
		});
		return buildApprovalResponse(params.method, context.requestParams, outcome);
	};
	try {
		const policyOutcome = await runOpenClawToolPolicyForApprovalRequest({
			method: params.method,
			requestParams,
			paramsForRun: params.paramsForRun,
			context,
			nativeHookRelay: params.nativeHookRelay,
			autoApprove: params.autoApprove,
			signal: params.signal
		});
		if (policyOutcome?.outcome === "denied") {
			recordNativeToolFailureDisposition(params, context, policyOutcome.failureDisposition);
			return resolvePolicyApproval("denied", policyOutcome.reason);
		}
		if (policyOutcome?.outcome === "approved-once" || policyOutcome?.outcome === "approved-session") return resolvePolicyApproval(policyOutcome.outcome);
		const canAutoApproveConcreteToolCall = CONCRETE_TOOL_AUTO_APPROVAL_METHODS.has(params.method);
		if (canAutoApproveConcreteToolCall && params.autoApproveOpenClawToolPolicy === true && policyOutcome?.outcome === "allowed") return resolvePolicyApproval("approved-once", "Codex app-server approval accepted by OpenClaw tool policy.");
		if (canAutoApproveConcreteToolCall && params.autoApprove === true) return resolvePolicyApproval("approved-session", "Codex app-server approval auto-approved by runtime policy.");
		const requestResult = await requestPluginApproval({
			hostCapabilities: params.paramsForRun.hostCapabilities,
			title: context.title,
			description: context.description,
			severity: context.severity,
			toolName: context.toolName,
			toolCallId: context.approvalId
		});
		const approvalId = requestResult?.id;
		if (!approvalId) {
			recordNativeToolFailureDisposition(params, context, "failed");
			emitApprovalEvent(params.paramsForRun, {
				phase: "resolved",
				kind: context.kind,
				status: "unavailable",
				title: context.title,
				...context.eventDetails,
				...approvalEventScope(params.method, "denied"),
				message: "Codex app-server approval route unavailable."
			});
			return buildApprovalResponse(params.method, context.requestParams, "denied");
		}
		emitApprovalEvent(params.paramsForRun, {
			phase: "requested",
			kind: context.kind,
			status: "pending",
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			message: "Codex app-server approval requested."
		});
		const requestUnavailable = approvalRequestExplicitlyUnavailable(requestResult);
		const decision = requestUnavailable ? null : await waitForPluginApprovalDecision({
			approvalId,
			signal: params.signal,
			hostCapabilities: params.paramsForRun.hostCapabilities
		});
		const approvalExpired = !requestUnavailable && decision === null;
		const outcome = params.signal?.aborted ? "cancelled" : mapExecDecisionToOutcome(decision);
		if (outcome === "cancelled") recordNativeToolFailureDisposition(params, context, params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : "cancelled");
		else if (outcome === "unavailable") recordNativeToolFailureDisposition(params, context, approvalExpired ? "timed_out" : "failed");
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: outcome === "denied" ? "denied" : outcome === "unavailable" ? "unavailable" : outcome === "cancelled" ? "failed" : "approved",
			title: context.title,
			approvalId,
			approvalSlug: approvalId,
			...context.eventDetails,
			...approvalEventScope(params.method, outcome),
			message: approvalResolutionMessage(outcome)
		});
		return buildApprovalResponse(params.method, context.requestParams, outcome);
	} catch (error) {
		const cancelled = params.signal?.aborted === true;
		recordNativeToolFailureDisposition(params, context, cancelled && params.signal ? resolveCodexToolAbortTerminalReason(params.signal) : "failed");
		emitApprovalEvent(params.paramsForRun, {
			phase: "resolved",
			kind: context.kind,
			status: cancelled ? "failed" : "unavailable",
			title: context.title,
			...context.eventDetails,
			...approvalEventScope(params.method, cancelled ? "cancelled" : "denied"),
			message: cancelled ? "Codex app-server approval cancelled because the run stopped." : `Codex app-server approval route failed: ${formatCodexDisplayText(coerceErrorMessage(error))}`
		});
		return buildApprovalResponse(params.method, context.requestParams, cancelled ? "cancelled" : "denied");
	}
}
function recordNativeToolFailureDisposition(params, context, disposition) {
	if (!context.itemId || !disposition) return;
	try {
		params.onNativeToolFailureDisposition?.(context.itemId, params.signal?.aborted ? resolveCodexToolAbortTerminalReason(params.signal) : disposition);
	} catch {}
}
/** Converts an OpenClaw approval outcome into the app-server method response. */
function buildApprovalResponse(method, requestParams, outcome) {
	if (method === "item/commandExecution/requestApproval") return { decision: commandApprovalDecision(requestParams, outcome) };
	if (method === "item/fileChange/requestApproval") return { decision: fileChangeApprovalDecision(outcome) };
	if (method === "item/permissions/requestApproval") {
		if (outcome === "approved-session" || outcome === "approved-once") return {
			permissions: requestedPermissions(requestParams),
			scope: outcome === "approved-session" ? "session" : "turn"
		};
		return {
			permissions: {},
			scope: "turn"
		};
	}
	return unsupportedApprovalResponse();
}
function matchesCurrentTurn(requestParams, threadId, turnId) {
	if (!requestParams) return false;
	const requestThreadId = readStringField(requestParams, "threadId");
	const requestTurnId = readStringField(requestParams, "turnId");
	return requestThreadId === threadId && requestTurnId === turnId;
}
function buildApprovalContext(params) {
	const itemId = readStringField(params.requestParams, "itemId") ?? readStringField(params.requestParams, "callId") ?? readStringField(params.requestParams, "approvalId");
	const approvalId = readStringField(params.requestParams, "approvalId") ?? itemId;
	const commandDetailLines = params.method === "item/commandExecution/requestApproval" ? describeCommandApprovalDetails(params.requestParams) : [];
	const commandPreview = sanitizeApprovalPreview(readDisplayCommandPreview(params.requestParams), commandDetailLines.length > 0 ? COMMAND_PREVIEW_WITH_DETAILS_MAX_LENGTH : 180);
	const reasonPreview = sanitizeApprovalPreview(readStringPreview(params.requestParams, "reason"), 180);
	const command = commandPreview.text;
	const reason = reasonPreview.text;
	const kind = approvalKindForMethod(params.method);
	const permissionLines = params.method === "item/permissions/requestApproval" ? describeRequestedPermissions(params.requestParams) : [];
	const title = kind === "exec" ? "Codex app-server command approval" : params.method === "item/permissions/requestApproval" ? "Codex app-server permission approval" : kind === "plugin" ? "Codex app-server file approval" : "Codex app-server approval";
	const subject = permissionLines[0] ?? (command ? `Command: ${formatApprovalPreviewSubject(command, commandPreview.omitted)}` : commandPreview.omitted ? `Command: ${APPROVAL_PREVIEW_OMITTED}` : reason ? `Reason: ${formatApprovalPreviewSubject(reason, reasonPreview.omitted)}` : reasonPreview.omitted ? `Reason: ${APPROVAL_PREVIEW_OMITTED}` : `Request method: ${params.method}`);
	return {
		kind,
		title,
		description: permissionLines.length > 0 ? joinDescriptionLinesWithinLimit(permissionLines, PERMISSION_DESCRIPTION_MAX_LENGTH) : [
			subject,
			...commandDetailLines,
			params.paramsForRun.sessionKey && `Session: ${params.paramsForRun.sessionKey}`
		].filter(Boolean).join("\n"),
		severity: kind === "exec" ? "warning" : "info",
		toolName: kind === "exec" ? "codex_command_approval" : params.method === "item/permissions/requestApproval" ? "codex_permission_approval" : "codex_file_approval",
		itemId,
		approvalId,
		requestParams: params.requestParams,
		eventDetails: {
			...itemId ? { itemId } : {},
			...command ? { command } : {},
			...commandPreview.omitted ? { commandPreviewOmitted: true } : {},
			...reason ? { reason } : {},
			...reasonPreview.omitted ? { reasonPreviewOmitted: true } : {}
		}
	};
}
async function runOpenClawToolPolicyForApprovalRequest(params) {
	const policyRequest = buildOpenClawToolPolicyRequest(params.method, params.requestParams);
	if (!policyRequest) return;
	const cwd = readStringField(params.requestParams, "cwd") ?? params.paramsForRun.workspaceDir;
	const nativeRelayOutcome = await runNativeRelayToolPolicyForApprovalRequest({
		method: params.method,
		requestParams: params.requestParams,
		context: params.context,
		policyRequest,
		nativeHookRelay: params.nativeHookRelay,
		autoApprove: params.autoApprove,
		assertActive: params.paramsForRun.hostCapabilities.assertActive,
		cwd,
		signal: params.signal
	});
	if (nativeRelayOutcome?.blocked) return {
		outcome: "denied",
		reason: nativeRelayOutcome.reason,
		...nativeRelayOutcome.failureDisposition ? { failureDisposition: nativeRelayOutcome.failureDisposition } : {}
	};
	if (nativeRelayOutcome?.outcome === "approved-once" || nativeRelayOutcome?.outcome === "approved-session") return { outcome: nativeRelayOutcome.outcome };
	if (nativeRelayOutcome?.handled) return { outcome: "allowed" };
	const outcome = await params.paramsForRun.hostCapabilities.runBeforeToolCall({
		toolName: policyRequest.toolName,
		params: policyRequest.params,
		...cwd ? { nativeOperation: { cwd } } : {},
		...params.context.approvalId ? { toolCallId: params.context.approvalId } : {},
		signal: params.signal
	});
	if (outcome.blocked) return {
		outcome: "denied",
		reason: outcome.reason,
		...outcome.kind === "failure" && outcome.disposition !== "blocked" ? { failureDisposition: outcome.disposition } : {}
	};
	if ("params" in outcome && toolPolicyParamsWereRewritten(policyRequest.params, outcome.params)) return {
		outcome: "denied",
		reason: "OpenClaw tool policy rewrote Codex app-server approval params; refusing original request."
	};
	if (outcome.approvalResolution) return { outcome: "approved-once" };
	return { outcome: "allowed" };
}
async function runNativeRelayToolPolicyForApprovalRequest(params) {
	const nativeHookRelay = params.nativeHookRelay;
	if (params.method !== "item/commandExecution/requestApproval" || !nativeHookRelay?.allowedEvents.includes("pre_tool_use")) return;
	const payload = buildNativeRelayPreToolUsePayload({
		requestParams: params.requestParams,
		policyRequest: params.policyRequest,
		context: params.context,
		cwd: params.cwd
	});
	if (!payload) return;
	const resolveDeferredApproval = async () => {
		const approvalOutcome = await resolveNativeHookRelayDeferredToolApproval({
			relayId: nativeHookRelay.relayId,
			toolUseId: params.context.approvalId,
			signal: params.signal
		});
		params.assertActive();
		if (approvalOutcome?.outcome === "denied") return {
			handled: true,
			blocked: true,
			reason: approvalOutcome.reason,
			...approvalOutcome.failureDisposition ? { failureDisposition: approvalOutcome.failureDisposition } : {}
		};
		return approvalOutcome?.outcome === "approved-once" ? {
			handled: true,
			outcome: approvalOutcome.outcome
		} : { handled: true };
	};
	if (hasNativeHookRelayInvocation({
		relayId: nativeHookRelay.relayId,
		event: "pre_tool_use",
		toolUseId: params.context.approvalId
	})) return resolveDeferredApproval();
	try {
		const decision = readNativeRelayPreToolUseDecision(await invokeNativeHookRelay({
			provider: "codex",
			relayId: nativeHookRelay.relayId,
			generation: nativeHookRelay.generation,
			event: "pre_tool_use",
			rawPayload: payload,
			requireGeneration: true
		}));
		if (decision.blocked) return {
			handled: true,
			blocked: true,
			reason: decision.reason,
			...decision.failureDisposition ? { failureDisposition: decision.failureDisposition } : {}
		};
		return await resolveDeferredApproval();
	} catch (error) {
		if (params.autoApprove === true && !hasNativeHookRelayInvocation({
			relayId: nativeHookRelay.relayId,
			event: "pre_tool_use",
			toolUseId: params.context.approvalId
		})) return;
		return {
			handled: true,
			blocked: true,
			reason: `OpenClaw native hook relay unavailable for Codex app-server approval: ${formatCodexDisplayText(coerceErrorMessage(error))}`,
			failureDisposition: "failed"
		};
	}
}
function buildNativeRelayPreToolUsePayload(params) {
	const command = readStringField(params.policyRequest.params, "command");
	if (!command) return;
	const turnId = readStringField(params.requestParams, "turnId");
	return {
		hook_event_name: "PreToolUse",
		openclaw_approval_mode: "report",
		tool_name: "exec_command",
		...params.context.approvalId ? { tool_use_id: params.context.approvalId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...turnId ? { turn_id: turnId } : {},
		tool_input: {
			...params.policyRequest.params,
			command,
			cmd: command
		}
	};
}
function readNativeRelayPreToolUseDecision(response) {
	if (!response || response.exitCode !== 0) return {
		blocked: true,
		reason: sanitizeRelayDecisionReason(response?.stderr) || sanitizeRelayDecisionReason(response?.stdout) || "OpenClaw native hook relay failed for Codex app-server approval.",
		failureDisposition: response?.failureDisposition ?? "failed"
	};
	const stdout = response.stdout?.trim();
	if (!stdout) return { blocked: false };
	const parsed = parseRelayJsonResponse(stdout);
	const output = isJsonObject(parsed?.hookSpecificOutput) ? parsed.hookSpecificOutput : void 0;
	if (output?.permissionDecision === "deny") return {
		blocked: true,
		reason: readStringField(output, "permissionDecisionReason") || "OpenClaw native hook policy denied Codex app-server approval.",
		...response.failureDisposition ? { failureDisposition: response.failureDisposition } : {}
	};
	return {
		blocked: true,
		reason: output ? "OpenClaw native hook relay returned a non-deny Codex app-server approval decision." : "OpenClaw native hook relay returned an unreadable Codex app-server approval result.",
		failureDisposition: "failed"
	};
}
function parseRelayJsonResponse(text) {
	try {
		const parsed = JSON.parse(text);
		return isJsonObject(parsed) ? parsed : void 0;
	} catch {
		return;
	}
}
function sanitizeRelayDecisionReason(value) {
	return sanitizeApprovalPreview(value ? {
		value,
		clipped: false
	} : void 0, 240).text;
}
function buildOpenClawToolPolicyRequest(method, requestParams) {
	if (method === "item/commandExecution/requestApproval") {
		const command = readPolicyCommand(requestParams);
		return {
			toolName: "exec",
			params: {
				...command ? { command } : {},
				...readStringField(requestParams, "cwd") ? { cwd: readStringField(requestParams, "cwd") } : {},
				approval: requestParams ?? {}
			}
		};
	}
	if (method === "item/fileChange/requestApproval") return {
		toolName: "apply_patch",
		params: requestParams ?? {}
	};
	if (method === "item/permissions/requestApproval") return {
		toolName: "codex_permission_approval",
		params: requestParams ?? {}
	};
}
function toolPolicyParamsWereRewritten(original, candidate) {
	if (candidate === original) return false;
	const originalText = stableJsonText(original);
	const candidateText = stableJsonText(candidate);
	return !candidateText || candidateText !== originalText;
}
function stableJsonText(value) {
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean") return JSON.stringify(value);
	if (Array.isArray(value)) {
		const items = value.map((item) => stableJsonText(item));
		return items.every((item) => item !== void 0) ? `[${items.join(",")}]` : void 0;
	}
	if (isJsonObject(value)) {
		const entries = Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, item]) => {
			const text = stableJsonText(item);
			return text === void 0 ? void 0 : `${JSON.stringify(key)}:${text}`;
		});
		return entries.every((entry) => entry !== void 0) ? `{${entries.join(",")}}` : void 0;
	}
}
function commandApprovalDecision(requestParams, outcome) {
	if (outcome === "cancelled") return commandRejectionDecision(requestParams, "cancel");
	if (outcome === "denied" || outcome === "unavailable") return commandRejectionDecision(requestParams, "decline");
	if (outcome === "approved-session") {
		if (hasAvailableDecision(requestParams, "acceptForSession")) return "acceptForSession";
		const amendmentDecision = findAvailableCommandAmendmentDecision(requestParams);
		if (amendmentDecision) return amendmentDecision;
	}
	return hasAvailableDecision(requestParams, "accept") ? "accept" : commandRejectionDecision(requestParams, "decline");
}
function fileChangeApprovalDecision(outcome) {
	if (outcome === "cancelled") return "cancel";
	if (outcome === "denied" || outcome === "unavailable") return "decline";
	return outcome === "approved-session" ? "acceptForSession" : "accept";
}
function requestedPermissions(requestParams) {
	const permissions = isJsonObject(requestParams?.permissions) ? requestParams.permissions : {};
	const granted = {};
	if (isJsonObject(permissions.network)) granted.network = permissions.network;
	if (isJsonObject(permissions.fileSystem)) granted.fileSystem = permissions.fileSystem;
	return granted;
}
function unsupportedApprovalResponse() {
	return {
		decision: "decline",
		reason: "OpenClaw codex app-server bridge does not grant native approvals yet."
	};
}
function describeRequestedPermissions(requestParams) {
	return describePermissionProfile(requestedPermissions(requestParams), "Permissions");
}
function describeCommandApprovalDetails(requestParams) {
	const lines = [];
	const additionalPermissions = isJsonObject(requestParams?.additionalPermissions) ? requestParams.additionalPermissions : void 0;
	if (additionalPermissions) lines.push(...describePermissionProfile(additionalPermissions, "Additional permissions"));
	const execpolicySummary = summarizeStringArray(requestParams?.proposedExecpolicyAmendment, "Proposed exec policy", sanitizePermissionScalar);
	if (execpolicySummary) lines.push(execpolicySummary);
	const networkAmendmentSummary = summarizeNetworkPolicyAmendments(requestParams?.proposedNetworkPolicyAmendments);
	if (networkAmendmentSummary) lines.push(networkAmendmentSummary);
	return lines;
}
function describePermissionProfile(permissions, label) {
	const lines = [];
	const kinds = [];
	const risks = /* @__PURE__ */ new Set();
	if (isJsonObject(permissions.network)) kinds.push("network");
	if (isJsonObject(permissions.fileSystem)) kinds.push("fileSystem");
	if (kinds.length > 0) lines.push(`${label}: ${kinds.join(", ")}`);
	let networkSummary;
	if (isJsonObject(permissions.network)) {
		const summaries = [summarizeNetworkEnabledPermission(permissions.network, risks), summarizePermissionRecord(permissions.network, risks, [{
			key: "allowHosts",
			label: "allowHosts",
			sanitize: sanitizePermissionHostValue,
			risksFor: permissionHostRisks
		}])].filter((summary) => Boolean(summary));
		networkSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	let fileSystemSummary;
	if (isJsonObject(permissions.fileSystem)) {
		const summaries = [summarizePermissionRecord(permissions.fileSystem, risks, [
			{
				key: "read",
				label: "read",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "write",
				label: "write",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "roots",
				label: "roots",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "readPaths",
				label: "readPaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			},
			{
				key: "writePaths",
				label: "writePaths",
				sanitize: sanitizePermissionPathValue,
				risksFor: permissionPathRisks
			}
		]), summarizeFileSystemEntries(permissions.fileSystem, risks)].filter((summary) => Boolean(summary));
		fileSystemSummary = summaries.length > 0 ? summaries.join("; ") : void 0;
	}
	if (risks.size > 0) lines.push(`High-risk targets: ${[...risks].join(", ")}`);
	if (networkSummary) lines.push(`Network ${networkSummary}`);
	if (fileSystemSummary) lines.push(`File system ${fileSystemSummary}`);
	return lines;
}
function summarizeNetworkEnabledPermission(permission, risks) {
	const enabled = permission.enabled;
	if (typeof enabled !== "boolean") return;
	if (enabled) risks.add("network access");
	return `enabled: ${enabled}`;
}
function summarizeFileSystemEntries(permission, risks) {
	const entries = permission.entries;
	if (!Array.isArray(entries)) return;
	const samples = [];
	let count = 0;
	for (const entry of entries) {
		const item = isJsonObject(entry) ? entry : void 0;
		const path = typeof item?.path === "string" ? item.path.trim() : "";
		const access = typeof item?.access === "string" ? item.access.trim() : "";
		if (!path || !access) continue;
		count += 1;
		if (access !== "none") for (const risk of permissionPathRisks(path)) risks.add(risk);
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(access)} ${sanitizePermissionPathValue(path)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `entries: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizePermissionRecord(permission, risks, descriptors) {
	return descriptors.map((descriptor) => summarizePermissionArray(permission, descriptor, risks)).filter(Boolean).join("; ") || void 0;
}
function summarizePermissionArray(record, descriptor, risks) {
	const values = normalizeTrimmedStringList(record[descriptor.key]);
	if (values.length === 0) return;
	for (const value of values) for (const risk of descriptor.risksFor(value)) risks.add(risk);
	const sampleValues = values.slice(0, PERMISSION_SAMPLE_LIMIT).map(descriptor.sanitize).filter(Boolean);
	if (sampleValues.length === 0) return `${descriptor.label}: ${values.length}`;
	const remaining = values.length - sampleValues.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${descriptor.label}: ${sampleValues.join(", ")}${remainderSuffix}`;
}
function summarizeStringArray(value, label, sanitize) {
	if (!Array.isArray(value)) return;
	const values = value.filter((entry) => typeof entry === "string").map((entry) => sanitize(entry)).filter(Boolean);
	if (values.length === 0) return;
	const samples = values.slice(0, PERMISSION_SAMPLE_LIMIT);
	const remaining = values.length - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `${label}: ${samples.join(", ")}${remainderSuffix}`;
}
function summarizeNetworkPolicyAmendments(value) {
	if (!Array.isArray(value)) return;
	const samples = [];
	let count = 0;
	for (const entry of value) {
		const amendment = isJsonObject(entry) ? entry : void 0;
		const host = typeof amendment?.host === "string" ? amendment.host : "";
		const action = typeof amendment?.action === "string" ? amendment.action : "";
		if (!host || !action) continue;
		count += 1;
		if (samples.length < PERMISSION_SAMPLE_LIMIT) samples.push(`${sanitizePermissionScalar(action)} ${sanitizePermissionHostValue(host)}`);
	}
	if (count === 0) return;
	const remaining = count - samples.length;
	const remainderSuffix = remaining > 0 ? ` (+${remaining} more)` : "";
	return `Proposed network policy: ${samples.join(", ")}${remainderSuffix}`;
}
function sanitizePermissionHostValue(value) {
	const withoutScheme = sanitizePermissionScalar(value).toLowerCase().replace(/^[a-z][a-z0-9+.-]*:\/\//, "");
	const authority = withoutScheme.split(/[/?#]/, 1)[0] ?? withoutScheme;
	return truncateCodexApprovalDisplayText(authority.includes("@") ? authority.slice(authority.lastIndexOf("@") + 1) : authority, PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionPathValue(value) {
	return truncateCodexApprovalDisplayText(formatApprovalDisplayPath(sanitizePermissionScalar(value)), PERMISSION_VALUE_MAX_LENGTH);
}
function sanitizePermissionScalar(value) {
	return sanitizeCodexApprovalVisibleText(value);
}
function permissionHostRisks(value) {
	const normalized = value.trim().toLowerCase();
	const risks = [];
	if (normalized.includes("*")) {
		risks.push("wildcard hosts");
		if (isPrivateNetworkHostPattern(normalized)) risks.push("private-network wildcards");
	}
	return risks;
}
function permissionPathRisks(value) {
	const normalized = sanitizePermissionScalar(value);
	const risks = [];
	if (normalized === "/" || normalized === "\\" || /^[A-Za-z]:[\\/]*$/.test(normalized)) risks.push("filesystem root");
	return risks;
}
function isPrivateNetworkHostPattern(value) {
	const wildcardStripped = value.toLowerCase().replace(/^\*\./, "");
	if (wildcardStripped === "localhost" || wildcardStripped === "local" || wildcardStripped === "internal" || wildcardStripped === "lan" || wildcardStripped === "home" || wildcardStripped === "corp" || wildcardStripped === "private" || wildcardStripped.endsWith(".local") || wildcardStripped.endsWith(".internal") || wildcardStripped.endsWith(".lan") || wildcardStripped.endsWith(".home") || wildcardStripped.endsWith(".corp") || wildcardStripped.endsWith(".private")) return true;
	if (wildcardStripped.startsWith("10.") || wildcardStripped.startsWith("127.") || wildcardStripped.startsWith("192.168.") || wildcardStripped.startsWith("169.254.")) return true;
	return /^172\.(1[6-9]|2\d|3[0-1])\./.test(wildcardStripped);
}
function hasAvailableDecision(requestParams, decision) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return true;
	return available.includes(decision);
}
function findAvailableCommandAmendmentDecision(requestParams) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return;
	return available.find((entry) => isJsonObject(entry) && (isJsonObject(entry.acceptWithExecpolicyAmendment) || isJsonObject(entry.applyNetworkPolicyAmendment)));
}
function commandRejectionDecision(requestParams, preferred) {
	const available = requestParams?.availableDecisions;
	if (!Array.isArray(available)) return preferred;
	if (available.includes(preferred)) return preferred;
	const alternate = preferred === "decline" ? "cancel" : "decline";
	if (available.includes(alternate)) return alternate;
	return preferred;
}
function approvalResolutionMessage(outcome) {
	if (outcome === "approved-session") return "Codex app-server approval granted for the session.";
	if (outcome === "approved-once") return "Codex app-server approval granted for this turn.";
	if (outcome === "cancelled") return "Codex app-server approval cancelled.";
	if (outcome === "unavailable") return "Codex app-server approval unavailable.";
	return "Codex app-server approval denied.";
}
function approvalEventScope(method, outcome) {
	return method === "item/permissions/requestApproval" ? { scope: outcome === "approved-session" ? "session" : "turn" } : {};
}
function approvalKindForMethod(method) {
	if (method.includes("commandExecution") || method.includes("execCommand")) return "exec";
	if (method.includes("fileChange") || method.includes("Patch") || method.includes("permissions")) return "plugin";
	return "unknown";
}
function emitApprovalEvent(params, data) {
	params.onAgentEvent?.({
		stream: "approval",
		data
	});
}
function readDisplayCommandPreview(record) {
	const actionCommand = readCommandActionsPreview(record);
	if (actionCommand) return actionCommand;
	return readCommandPreview(record);
}
function readPolicyCommand(record) {
	const command = record?.command;
	if (typeof command === "string") return command;
	if (Array.isArray(command) && command.every((part) => typeof part === "string")) return command.join(" ");
	const actionCommands = readCommandActions(record);
	if (actionCommands.length > 0) return actionCommands.join(" && ");
}
function readCommandActions(record) {
	const actions = record?.commandActions;
	if (!Array.isArray(actions)) return [];
	return actions.map((action) => isJsonObject(action) ? readStringField(action, "command") : void 0).filter((command) => Boolean(command));
}
function readCommandActionsPreview(record) {
	let source;
	for (const command of readCommandActions(record)) {
		source = appendPreviewPart(source, command, " && ");
		if (source.clipped) break;
	}
	return source;
}
function readCommandPreview(record) {
	const command = record?.command;
	if (typeof command === "string") return previewSource(command);
	if (!Array.isArray(command)) return;
	let source;
	for (const part of command) {
		if (typeof part !== "string") return;
		source = appendPreviewPart(source, part, " ");
		if (source.clipped) break;
	}
	return source;
}
function readStringPreview(record, key) {
	const value = readStringField(record, key);
	return value === void 0 ? void 0 : previewSource(value);
}
function previewSource(value) {
	return {
		value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped: value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH
	};
}
function appendPreviewPart(source, part, separator) {
	const value = `${source?.value ? `${source.value}${separator}` : ""}${part}`;
	const clipped = source?.clipped === true || value.length > APPROVAL_PREVIEW_SCAN_MAX_LENGTH;
	return {
		value: sliceUtf16Safe(value, 0, APPROVAL_PREVIEW_SCAN_MAX_LENGTH),
		clipped
	};
}
function sanitizeApprovalPreview(source, maxLength) {
	if (!source || !source.value) return { omitted: false };
	const sanitized = sanitizeCodexApprovalVisibleText(stripDanglingCodexApprovalTerminalSequence(source.value));
	if (!sanitized) return { omitted: true };
	return {
		text: formatCodexDisplayText(truncateCodexApprovalDisplayText(sanitized, maxLength)),
		omitted: source.clipped
	};
}
function formatApprovalPreviewSubject(text, omitted) {
	return omitted ? `${text} ${APPROVAL_PREVIEW_OMITTED}` : text;
}
function joinDescriptionLinesWithinLimit(lines, maxLength) {
	let description = "";
	for (const line of lines) {
		const prefix = description ? "\n" : "";
		const next = `${description}${prefix}${line}`;
		if (next.length <= maxLength) {
			description = next;
			continue;
		}
		const remaining = maxLength - description.length - prefix.length;
		if (remaining < 3) break;
		description += `${prefix}${truncateCodexApprovalDisplayText(line, remaining)}`;
		break;
	}
	return description;
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tool-diagnostics.ts
/**
* Trusted diagnostics emitted around Codex dynamic tool execution lifecycle.
*/
/** Emits a start event for one Codex dynamic tool call. */
function emitDynamicToolStartedDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.started",
		agentId: params.agentId,
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId
	});
}
/** Emits an error event for one Codex dynamic tool call. */
function emitDynamicToolErrorDiagnostic(params) {
	emitTrustedDiagnosticEvent({
		type: "tool.execution.error",
		agentId: params.agentId,
		runId: params.runId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		toolName: params.call.tool,
		toolCallId: params.call.callId,
		durationMs: params.durationMs,
		errorCategory: "codex_dynamic_tool_error",
		terminalReason: params.terminalReason ?? "failed"
	});
}
/** Emits the terminal event matching a dynamic tool response's diagnostic type. */
function emitDynamicToolTerminalDiagnostic(params) {
	const terminalType = params.response.diagnosticTerminalType ?? (params.response.success ? "completed" : "error");
	if (terminalType === "completed") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.completed",
			agentId: params.agentId,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			durationMs: params.durationMs
		});
		return;
	}
	if (terminalType === "blocked") {
		emitTrustedDiagnosticEvent({
			type: "tool.execution.blocked",
			agentId: params.agentId,
			runId: params.runId,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			toolName: params.call.tool,
			toolCallId: params.call.callId,
			deniedReason: "plugin-before-tool-call",
			reason: "Tool call blocked"
		});
		return;
	}
	emitDynamicToolErrorDiagnostic({
		...params,
		terminalReason: params.response.diagnosticTerminalReason ?? "failed"
	});
}
//#endregion
//#region extensions/codex/src/app-server/elicitation-bridge.ts
const MCP_TOOL_APPROVAL_KIND = "mcp_tool_call";
const MCP_TOOL_APPROVAL_KIND_KEY = "codex_approval_kind";
const MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY = "connector_name";
const MCP_TOOL_APPROVAL_TOOL_TITLE_KEY = "tool_title";
const MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY = "tool_description";
const MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY = "tool_params_display";
const MCP_TOOL_APPROVAL_SOURCE_KEY = "source";
const MCP_TOOL_APPROVAL_CONNECTOR_SOURCE = "connector";
const CODEX_APPS_SERVER_NAME = "codex_apps";
const COMPUTER_USE_APPROVAL_TITLE = "Computer Use approval";
const EMPTY_OBJECT_SCHEMA = {
	type: "object",
	properties: {}
};
const PLUGIN_APP_ID_META_KEYS = [
	"app_id",
	"appId",
	"codex_app_id",
	"codexAppId"
];
const PLUGIN_CONNECTOR_ID_META_KEYS = ["connector_id", "connectorId"];
const PLUGIN_NAME_META_KEYS = [
	"plugin_name",
	"pluginName",
	"codex_plugin_name",
	"codexPluginName"
];
const PLUGIN_CONFIG_KEY_META_KEYS = [
	"config_key",
	"configKey",
	"codex_config_key"
];
const PLUGIN_MARKETPLACE_NAME_META_KEYS = [
	"marketplace_name",
	"marketplaceName",
	"codex_marketplace_name",
	"codexMarketplaceName"
];
const MAX_DISPLAY_PARAM_ENTRIES = 8;
const MAX_DISPLAY_PARAM_VALUE_LENGTH = 120;
const MAX_DISPLAY_VALUE_ARRAY_ITEMS = 8;
const MAX_DISPLAY_VALUE_OBJECT_KEYS = 8;
const MAX_DISPLAY_VALUE_DEPTH = 3;
const DISPLAY_TEXT_SCAN_MAX_LENGTH = 4096;
async function handleCodexAppServerElicitationRequest(params) {
	const requestParams = isJsonObject(params.requestParams) ? params.requestParams : void 0;
	if (!requestParams || readNonBlankStringField(requestParams, "threadId") !== params.threadId) return;
	const requestTurnId = requestParams.turnId;
	if (requestTurnId !== null && requestTurnId !== void 0 && requestTurnId !== params.turnId) return;
	const pluginResolution = resolvePluginElicitation({
		requestParams,
		pluginAppPolicyContext: params.pluginAppPolicyContext
	});
	if (pluginResolution.kind !== "not_plugin") {
		if (params.paramsForRun.trigger === "cron" && params.paramsForRun.scheduledRuntimeAuthority) {
			logPluginElicitationDecline("scheduled_authority_non_interactive", requestParams);
			return declineElicitationResponse();
		}
		if (pluginResolution.kind === "decline") {
			logPluginElicitationDecline(pluginResolution.reason, requestParams);
			return declineElicitationResponse();
		}
		if (requestTurnId !== params.turnId) {
			logPluginElicitationDecline("missing_active_turn", requestParams);
			return declineElicitationResponse();
		}
		return await buildPluginPolicyElicitationResponse({
			entry: pluginResolution.entry,
			requestParams,
			paramsForRun: params.paramsForRun,
			signal: params.signal
		});
	}
	const approvalPrompt = readComputerUseApprovalElicitation(requestParams, params.computerUseMcpServerName) ?? readBridgeableApprovalElicitation(requestParams);
	if (!approvalPrompt) return;
	return buildElicitationResponse(approvalPrompt, await requestPluginApprovalOutcome({
		paramsForRun: params.paramsForRun,
		title: approvalPrompt.title,
		description: approvalPrompt.description,
		allowedDecisions: approvalPrompt.allowedDecisions,
		signal: params.signal
	}));
}
function resolvePluginElicitation(params) {
	const requestParams = params.requestParams;
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const context = params.pluginAppPolicyContext;
	const entries = context ? Object.values(context.apps) : [];
	const pluginEntries = entries.filter(isPluginAppPolicyContextEntry);
	const appId = readFirstString$1(meta, PLUGIN_APP_ID_META_KEYS) ?? readFirstString$1(requestParams, PLUGIN_APP_ID_META_KEYS);
	const connectorId = readFirstString$1(meta, PLUGIN_CONNECTOR_ID_META_KEYS);
	const isCodexConnectorApproval = isCodexConnectorApprovalElicitation(requestParams, meta);
	if (isCodexConnectorApproval && appId && connectorId && appId !== connectorId) return {
		kind: "decline",
		reason: "app_id_connector_id_mismatch"
	};
	if (appId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		const entry = context.apps[appId];
		if (entry?.source === "account" && !isCodexConnectorApproval) return {
			kind: "decline",
			reason: "account_app_source_mismatch"
		};
		return uniquePluginMatch(entry ? [entry] : [], "app_id");
	}
	if (isCodexConnectorApproval && connectorId) {
		if (!context) return {
			kind: "decline",
			reason: "missing_policy_context"
		};
		const entry = context.apps[connectorId];
		return uniquePluginMatch(entry ? [entry] : [], "connector_id");
	}
	const serverName = readNonBlankStringField(requestParams, "serverName");
	if (serverName && context) {
		const matches = entries.filter((entry) => entry.mcpServerNames.includes(serverName));
		if (matches.length > 0) return uniquePluginMatch(matches, "server_name");
	}
	const metadataResolution = resolvePluginStableMetadataMatch({
		meta,
		requestParams,
		entries: pluginEntries,
		context
	});
	if (metadataResolution.kind !== "not_plugin") return metadataResolution;
	if (context && hasDisplayNameOnlyPluginMatch(meta, entries)) return {
		kind: "decline",
		reason: "display_name_only"
	};
	return { kind: "not_plugin" };
}
function isCodexConnectorApprovalElicitation(requestParams, meta) {
	return readNonBlankStringField(requestParams, "serverName") === CODEX_APPS_SERVER_NAME && readNonBlankStringField(meta, MCP_TOOL_APPROVAL_KIND_KEY) === MCP_TOOL_APPROVAL_KIND && readNonBlankStringField(meta, MCP_TOOL_APPROVAL_SOURCE_KEY) === MCP_TOOL_APPROVAL_CONNECTOR_SOURCE;
}
function resolvePluginStableMetadataMatch(params) {
	const pluginName = readFirstString$1(params.meta, PLUGIN_NAME_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_NAME_META_KEYS);
	const configKey = readFirstString$1(params.meta, PLUGIN_CONFIG_KEY_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_CONFIG_KEY_META_KEYS);
	const marketplaceName = readFirstString$1(params.meta, PLUGIN_MARKETPLACE_NAME_META_KEYS) ?? readFirstString$1(params.requestParams, PLUGIN_MARKETPLACE_NAME_META_KEYS);
	if (!pluginName && !configKey) return { kind: "not_plugin" };
	if (!params.context) return {
		kind: "decline",
		reason: "missing_policy_context"
	};
	return uniquePluginMatch(params.entries.filter((entry) => {
		if (marketplaceName && entry.marketplaceName !== marketplaceName) return false;
		if (pluginName && entry.pluginName !== pluginName) return false;
		if (configKey && entry.configKey !== configKey) return false;
		return true;
	}), "metadata");
}
function uniquePluginMatch(matches, source) {
	if (matches.length === 1 && matches[0]) return {
		kind: "matched",
		entry: matches[0]
	};
	return {
		kind: "decline",
		reason: matches.length === 0 ? `${source}_not_enabled` : `${source}_ambiguous`
	};
}
function hasDisplayNameOnlyPluginMatch(meta, entries) {
	const connectorName = readNonBlankStringField(meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY);
	if (!connectorName) return false;
	const normalized = normalizePluginIdentityText(connectorName);
	return entries.some((entry) => normalizePluginIdentityText(appPolicyDisplayName(entry)) === normalized || isPluginAppPolicyContextEntry(entry) && normalizePluginIdentityText(entry.configKey) === normalized);
}
function isPluginAppPolicyContextEntry(entry) {
	return entry.source !== "account";
}
function appPolicyDisplayName(entry) {
	return isPluginAppPolicyContextEntry(entry) ? entry.pluginName : entry.appName;
}
function normalizePluginIdentityText(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
async function buildPluginPolicyElicitationResponse(params) {
	const mode = resolvePluginDestructiveApprovalMode(params.entry);
	if (mode === "deny") {
		logPluginElicitationDecline("destructive_actions_disabled", params.requestParams);
		return declineElicitationResponse();
	}
	const approvalPrompt = readPluginApprovalElicitation(params.entry, params.requestParams);
	if (!approvalPrompt) {
		logPluginElicitationDecline("unsupported_schema", params.requestParams);
		return declineElicitationResponse();
	}
	const response = buildElicitationResponse(approvalPrompt, "approved-once");
	if (isJsonObject(response) && response.action === "accept") {
		if (mode === "allow") return response;
		return buildElicitationResponse(approvalPrompt, oneShotPluginPolicyApprovalOutcome(mode, await requestPluginApprovalOutcome({
			paramsForRun: params.paramsForRun,
			title: approvalPrompt.title,
			description: approvalPrompt.description,
			allowedDecisions: allowedPluginPolicyApprovalDecisions(mode, approvalPrompt),
			signal: params.signal
		})));
	}
	logPluginElicitationDecline("unmappable_schema", params.requestParams);
	return declineElicitationResponse();
}
function resolvePluginDestructiveApprovalMode(entry) {
	return entry.destructiveApprovalMode ?? (entry.allowDestructiveActions ? "allow" : "deny");
}
function allowedPluginPolicyApprovalDecisions(mode, approvalPrompt) {
	const allowedDecisions = approvalPrompt.allowedDecisions ?? ["allow-once", "deny"];
	if (mode !== "ask") return allowedDecisions;
	return allowedDecisions.filter((decision) => decision !== "allow-always");
}
function oneShotPluginPolicyApprovalOutcome(mode, outcome) {
	return mode === "ask" && outcome === "approved-session" ? "approved-once" : outcome;
}
function readPluginApprovalElicitation(entry, requestParams) {
	if (readNonBlankStringField(requestParams, "mode") !== "form" || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || "Codex plugin approval";
	const descriptionMeta = { ...meta };
	if (!readNonBlankStringField(descriptionMeta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY)) descriptionMeta[MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY] = appPolicyDisplayName(entry);
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: descriptionMeta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(readNonBlankStringField(requestParams, "serverName"))
		}),
		requestedSchema,
		meta,
		persistHintsMode: "explicit",
		allowedDecisions: buildApprovalAllowedDecisions(requestedSchema, meta)
	};
}
function buildApprovalAllowedDecisions(requestedSchema, meta) {
	return canMapPersistentApproval(requestedSchema, meta) ? [
		"allow-once",
		"allow-always",
		"deny"
	] : ["allow-once", "deny"];
}
function canMapPersistentApproval(requestedSchema, meta) {
	const persistHints = readPersistHints(meta, "explicit");
	if (persistHints.length > 0) return persistHints.includes("always");
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).some(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return false;
		return isPersistField({
			name,
			schema,
			required: false
		}) && chooseAlwaysPersistOptionValue(readEnumOptions(schema)) !== void 0;
	});
}
function declineElicitationResponse() {
	return {
		action: "decline",
		content: null,
		_meta: null
	};
}
function logPluginElicitationDecline(reason, requestParams) {
	log.debug("codex plugin elicitation declined", {
		reason,
		serverName: readNonBlankStringField(requestParams, "serverName"),
		mode: readNonBlankStringField(requestParams, "mode")
	});
}
function readBridgeableApprovalElicitation(requestParams) {
	if (!requestParams || readNonBlankStringField(requestParams, "mode") !== "form" || !isJsonObject(requestParams["_meta"]) || requestParams["_meta"][MCP_TOOL_APPROVAL_KIND_KEY] !== MCP_TOOL_APPROVAL_KIND || !isJsonObject(requestParams.requestedSchema)) return;
	const requestedSchema = requestParams.requestedSchema;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || "Codex MCP tool approval";
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta: requestParams["_meta"],
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(readNonBlankStringField(requestParams, "serverName"))
		}),
		requestedSchema,
		meta: requestParams["_meta"]
	};
}
function readComputerUseApprovalElicitation(requestParams, expectedServerName) {
	const serverName = readNonBlankStringField(requestParams, "serverName");
	if (!serverName || !expectedServerName || serverName !== expectedServerName || readNonBlankStringField(requestParams, "mode") !== "form") return;
	const requestedSchema = isJsonObject(requestParams?.requestedSchema) ? requestParams.requestedSchema : EMPTY_OBJECT_SCHEMA;
	if (readNonBlankStringField(requestedSchema, "type") !== "object" || !isJsonObject(requestedSchema.properties)) return;
	const meta = isJsonObject(requestParams?.["_meta"]) ? requestParams["_meta"] : {};
	const title = sanitizeDisplayText(readNonBlankStringField(requestParams, "message") ?? "") || COMPUTER_USE_APPROVAL_TITLE;
	return {
		title,
		description: buildApprovalDescription({
			title,
			meta,
			requestedSchema,
			serverName: sanitizeOptionalDisplayText(serverName)
		}),
		requestedSchema,
		meta
	};
}
function buildApprovalDescription(params) {
	const connectorName = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_CONNECTOR_NAME_KEY));
	const toolTitle = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_TOOL_TITLE_KEY));
	const toolDescription = sanitizeOptionalDisplayText(readNonBlankStringField(params.meta, MCP_TOOL_APPROVAL_TOOL_DESCRIPTION_KEY));
	const summaryLines = [
		connectorName && `App: ${connectorName}`,
		toolTitle && `Tool: ${toolTitle}`,
		params.serverName && `MCP server: ${params.serverName}`,
		toolDescription
	].filter((line) => Boolean(line));
	const paramLines = readDisplayParamLines(params.meta);
	const propertyLines = readPropertyDescriptionLines(params.requestedSchema);
	return [
		params.title,
		summaryLines.join("\n"),
		paramLines.length > 0 ? ["Parameters:", ...paramLines].join("\n") : "",
		propertyLines.length > 0 ? ["Fields:", ...propertyLines].join("\n") : ""
	].filter(Boolean).join("\n\n");
}
function readPropertyDescriptionLines(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.entries(properties).map(([name, value]) => {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) return;
		const propTitle = sanitizeDisplayText(readNonBlankStringField(schema, "title") ?? "") || sanitizeDisplayText(name) || "field";
		const description = sanitizeOptionalDisplayText(readNonBlankStringField(schema, "description"));
		return description ? `- ${propTitle}: ${description}` : `- ${propTitle}`;
	}).filter((line) => Boolean(line));
}
function readDisplayParamLines(meta) {
	const displayParams = meta[MCP_TOOL_APPROVAL_TOOL_PARAMS_DISPLAY_KEY];
	if (!Array.isArray(displayParams)) return [];
	const lines = displayParams.slice(0, MAX_DISPLAY_PARAM_ENTRIES).map((entry) => {
		const param = isJsonObject(entry) ? entry : void 0;
		if (!param) return;
		const name = sanitizeOptionalDisplayText(readNonBlankStringField(param, "display_name")) ?? sanitizeOptionalDisplayText(readNonBlankStringField(param, "name"));
		if (!name) return;
		return `- ${name}: ${formatDisplayParamValue(param.value)}`;
	}).filter((line) => Boolean(line));
	const remaining = displayParams.length - MAX_DISPLAY_PARAM_ENTRIES;
	return remaining > 0 ? [...lines, `- Additional parameters: ${remaining} more`] : lines;
}
function formatDisplayParamValue(value) {
	return truncateCodexApprovalDisplayText(sanitizeDisplayText(typeof value === "string" ? value : formatDisplayJsonValue(value ?? null)), MAX_DISPLAY_PARAM_VALUE_LENGTH);
}
function formatDisplayJsonValue(value, depth = MAX_DISPLAY_VALUE_DEPTH) {
	if (value === null) return "null";
	if (typeof value === "string") return JSON.stringify(truncateCodexApprovalDisplayText(sanitizeDisplayText(value), 80));
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (Array.isArray(value)) {
		if (depth <= 0) return "[truncated]";
		const parts = [];
		const limit = Math.min(value.length, MAX_DISPLAY_VALUE_ARRAY_ITEMS);
		for (let i = 0; i < limit; i += 1) parts.push(formatDisplayJsonValue(value[i] ?? null, depth - 1));
		if (value.length > MAX_DISPLAY_VALUE_ARRAY_ITEMS) parts.push("...");
		return `[${parts.join(",")}]`;
	}
	if (typeof value === "object") {
		if (depth <= 0) return "{truncated}";
		const parts = [];
		let count = 0;
		let truncated = false;
		for (const key in value) {
			if (!Object.hasOwn(value, key)) continue;
			if (count >= MAX_DISPLAY_VALUE_OBJECT_KEYS) {
				truncated = true;
				break;
			}
			const safeKey = truncateCodexApprovalDisplayText(sanitizeDisplayText(key), 80);
			parts.push(`${JSON.stringify(safeKey)}:${formatDisplayJsonValue(value[key] ?? null, depth - 1)}`);
			count += 1;
		}
		if (truncated) parts.push("...");
		return `{${parts.join(",")}}`;
	}
	return "null";
}
function sanitizeOptionalDisplayText(value) {
	return (value === void 0 ? "" : sanitizeDisplayText(value)) || void 0;
}
function sanitizeDisplayText(value) {
	const scanned = sliceUtf16Safe(value, 0, DISPLAY_TEXT_SCAN_MAX_LENGTH);
	const clipped = value.length > DISPLAY_TEXT_SCAN_MAX_LENGTH;
	const sanitized = sanitizeCodexApprovalVisibleText(scanned, { stripDanglingTerminalSequence: true });
	const escaped = sanitized ? formatCodexDisplayText(sanitized) : "";
	return clipped && escaped ? `${escaped}...` : escaped;
}
async function requestPluginApprovalOutcome(params) {
	try {
		const requestResult = await requestPluginApproval({
			hostCapabilities: params.paramsForRun.hostCapabilities,
			title: params.title,
			description: params.description,
			severity: "warning",
			toolName: "codex_mcp_tool_approval",
			allowedDecisions: params.allowedDecisions
		});
		const approvalId = requestResult?.id;
		if (!approvalId) return "unavailable";
		return mapExecDecisionToOutcome(approvalRequestExplicitlyUnavailable(requestResult) ? null : await waitForPluginApprovalDecision({
			hostCapabilities: params.paramsForRun.hostCapabilities,
			approvalId,
			signal: params.signal
		}));
	} catch {
		return params.signal?.aborted ? "cancelled" : "denied";
	}
}
function buildElicitationResponse(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	if (outcome === "cancelled") return {
		action: "cancel",
		content: null,
		_meta: null
	};
	if (outcome === "denied" || outcome === "unavailable") return {
		action: "decline",
		content: null,
		_meta: null
	};
	const content = buildAcceptedContent(approvalPrompt, outcome);
	if (!content && !hasNoSchemaProperties(requestedSchema)) {
		log.warn("codex MCP approval elicitation approved without a mappable response", {
			approvalKind: meta[MCP_TOOL_APPROVAL_KIND_KEY],
			fields: Object.keys(requestedSchema.properties ?? {}),
			outcome
		});
		return declineElicitationResponse();
	}
	return {
		action: "accept",
		content: content ?? null,
		_meta: buildAcceptedMeta(meta, outcome, approvalPrompt.persistHintsMode ?? "legacy")
	};
}
function buildAcceptedContent(approvalPrompt, outcome) {
	const { requestedSchema, meta } = approvalPrompt;
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : void 0;
	if (!properties) return;
	const required = Array.isArray(requestedSchema.required) ? new Set(requestedSchema.required.filter((entry) => typeof entry === "string")) : /* @__PURE__ */ new Set();
	const content = {};
	let sawApprovalField = false;
	for (const [name, value] of Object.entries(properties)) {
		const schema = isJsonObject(value) ? value : void 0;
		if (!schema) continue;
		const property = {
			name,
			schema,
			required: required.has(name)
		};
		const next = readApprovalFieldValue(property, outcome) ?? readPersistFieldValue(property, meta, outcome, approvalPrompt.persistHintsMode ?? "legacy") ?? readFallbackFieldValue(property, outcome);
		if (next === void 0) {
			if (isApprovalField(property)) sawApprovalField = true;
			if (property.required) return;
			continue;
		}
		if (isApprovalField(property)) sawApprovalField = true;
		content[name] = next;
	}
	return sawApprovalField ? content : void 0;
}
function readApprovalFieldValue(property, outcome) {
	if (!isApprovalField(property)) return;
	if (readNonBlankStringField(property.schema, "type") === "boolean") return true;
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const sessionChoice = options.find((option) => isSessionApprovalOption(option));
	const acceptChoice = options.find((option) => isPositiveApprovalOption(option));
	if (outcome === "approved-session") return sessionChoice?.value ?? acceptChoice?.value;
	return acceptChoice?.value ?? sessionChoice?.value;
}
function readPersistFieldValue(property, meta, outcome, persistHintsMode) {
	if (!isPersistField(property) || outcome !== "approved-session") return;
	const persistHints = readPersistHints(meta, persistHintsMode);
	const options = readEnumOptions(property.schema);
	if (options.length === 0) return;
	const preferred = choosePersistHint(persistHints);
	if (preferred) return options.find((option) => option.value === preferred || option.label === preferred)?.value;
	if (persistHintsMode === "explicit") return chooseAlwaysPersistOptionValue(options);
}
function readFallbackFieldValue(property, outcome) {
	if (outcome === "approved-once" && isPersistField(property)) return;
	return property.schema.default;
}
function isApprovalField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(approve|approval|allow|accept|decision)\b/.test(haystack);
}
function isPersistField(property) {
	const haystack = propertyText(property).toLowerCase();
	return /\b(persist|session|always|scope)\b/.test(haystack);
}
function propertyText(property) {
	return [
		property.name,
		readNonBlankStringField(property.schema, "title"),
		readNonBlankStringField(property.schema, "description")
	].filter(Boolean).join(" ");
}
function readPersistHints(meta, mode = "legacy") {
	const raw = meta.persist;
	if (typeof raw === "string") return [raw];
	if (Array.isArray(raw)) return raw.filter((entry) => typeof entry === "string");
	return mode === "legacy" ? ["session", "always"] : [];
}
function buildAcceptedMeta(meta, outcome, persistHintsMode) {
	if (outcome !== "approved-session") return null;
	const persist = choosePersistHint(readPersistHints(meta, persistHintsMode));
	return persist ? { persist } : null;
}
function choosePersistHint(persistHints) {
	if (persistHints.includes("always")) return "always";
	if (persistHints.includes("session")) return "session";
}
function chooseAlwaysPersistOptionValue(options) {
	return options.find((option) => optionMatchesPersist(option, "always"))?.value;
}
function optionMatchesPersist(option, persist) {
	return option.value.toLowerCase() === persist || option.label.toLowerCase() === persist;
}
function hasNoSchemaProperties(requestedSchema) {
	const properties = isJsonObject(requestedSchema.properties) ? requestedSchema.properties : {};
	return Object.keys(properties).length === 0;
}
function readEnumOptions(schema) {
	if (Array.isArray(schema.enum)) {
		const values = schema.enum.filter((entry) => typeof entry === "string");
		const labels = Array.isArray(schema.enumNames) ? schema.enumNames.filter((entry) => typeof entry === "string") : [];
		return values.map((value, index) => ({
			value,
			label: labels[index] ?? value
		}));
	}
	if (Array.isArray(schema.oneOf)) return schema.oneOf.map((entry) => {
		const option = isJsonObject(entry) ? entry : void 0;
		const value = readNonBlankStringField(option, "const");
		if (!value) return;
		return {
			value,
			label: readNonBlankStringField(option, "title") ?? value
		};
	}).filter((entry) => Boolean(entry));
	return [];
}
function isPositiveApprovalOption(option) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return /\b(allow|approve|accept|yes|continue|proceed|true)\b/.test(haystack);
}
function isSessionApprovalOption(option) {
	const haystack = `${option.value} ${option.label}`.toLowerCase();
	return /\b(session|always|persistent)\b/.test(haystack) && /\b(allow|approve|accept)\b/.test(haystack);
}
function readNonBlankStringField(record, key) {
	const value = record?.[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function readFirstString$1(record, keys) {
	for (const key of keys) {
		const value = readNonBlankStringField(record, key);
		if (value) return value;
	}
}
//#endregion
//#region extensions/codex/src/app-server/dynamic-tools.ts
/**
* Bridges OpenClaw runtime tools into Codex app-server dynamic tool specs and
* tool-call responses.
*/
function applyCurrentMessageProvider(toolName, args, currentProvider) {
	const hasProvider = typeof args.provider === "string" && args.provider.trim().length > 0 ? true : typeof args.channel === "string" && args.channel.trim().length > 0;
	const provider = currentProvider?.trim();
	if (toolName !== "message" || hasProvider || !provider) return args;
	return {
		...args,
		provider
	};
}
function normalizeRouteToken(value) {
	if (typeof value === "number") return Number.isFinite(value) ? String(value) : void 0;
	const normalized = value?.trim().toLowerCase();
	return normalized ? normalized : void 0;
}
function sourceRouteTokens(hookContext) {
	const tokens = /* @__PURE__ */ new Set();
	const currentTarget = normalizeRouteToken(hookContext?.currentMessagingTarget);
	const currentChannel = normalizeRouteToken(hookContext?.currentChannelId);
	const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
	if (currentTarget) tokens.add(currentTarget);
	if (currentChannel) tokens.add(currentChannel);
	const channelPrefixIndex = currentChannel?.indexOf(":") ?? -1;
	if (channelPrefixIndex >= 0 && currentChannel) {
		const unprefixedChannel = currentChannel.slice(channelPrefixIndex + 1);
		if (unprefixedChannel) {
			tokens.add(unprefixedChannel);
			for (const segment of unprefixedChannel.split(/[;,]/u)) {
				const token = normalizeRouteToken(segment);
				if (token) tokens.add(token);
			}
		}
	}
	if (currentProvider && currentChannel?.startsWith(`${currentProvider}:`)) {
		const unprefixedChannel = currentChannel.slice(currentProvider.length + 1);
		if (unprefixedChannel) tokens.add(unprefixedChannel);
	}
	return tokens;
}
function routeTokenMatchesSource(token, hookContext) {
	const normalized = normalizeRouteToken(token);
	return normalized !== void 0 && sourceRouteTokens(hookContext).has(normalized);
}
function routeProviderMatchesSource(provider, hookContext) {
	const normalized = normalizeRouteToken(provider);
	if (!normalized) return false;
	const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
	const currentChannel = normalizeRouteToken(hookContext?.currentChannelId);
	return currentProvider === normalized || currentChannel?.startsWith(`${normalized}:`) === true;
}
function routeTokenMatchesCurrentMessage(token, hookContext) {
	const normalized = normalizeRouteToken(token);
	return normalized !== void 0 && normalized === normalizeRouteToken(hookContext?.currentMessageId);
}
function readRouteToken(record, key) {
	const value = record[key];
	return typeof value === "string" || typeof value === "number" ? value : void 0;
}
function explicitRouteTokensMismatchCurrent(args, keys, currentToken) {
	const normalizedCurrent = normalizeRouteToken(currentToken);
	if (!normalizedCurrent) return false;
	return keys.some((key) => {
		const normalized = normalizeRouteToken(readRouteToken(args, key));
		return normalized !== void 0 && normalized !== normalizedCurrent;
	});
}
function explicitThreadRouteTargetsNonSource(args, hookContext, messagingTarget) {
	const normalizedCurrentThread = normalizeRouteToken(hookContext?.currentThreadId);
	const explicitThreadTokens = [...EXPLICIT_MESSAGE_THREAD_KEYS.map((key) => normalizeRouteToken(readRouteToken(args, key))), normalizeRouteToken(messagingTarget?.threadId)].filter((value) => value !== void 0);
	if (explicitThreadTokens.length === 0) return false;
	return normalizedCurrentThread === void 0 || explicitThreadTokens.some((value) => value !== normalizedCurrentThread);
}
function replyReceiptMatchesCurrentMessage(value, hookContext, depth = 0) {
	if (depth > 4 || value === null) return false;
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (!trimmed || !["{", "["].includes(trimmed[0] ?? "")) return false;
		try {
			return replyReceiptMatchesCurrentMessage(JSON.parse(trimmed), hookContext, depth + 1);
		} catch {
			return false;
		}
	}
	if (typeof value !== "object") return false;
	if (Array.isArray(value)) return value.some((item) => replyReceiptMatchesCurrentMessage(item, hookContext, depth + 1));
	const record = value;
	for (const key of [
		"repliedTo",
		"replyTo",
		"replyToId",
		"replyToIdFull"
	]) if (routeTokenMatchesCurrentMessage(typeof record[key] === "string" ? record[key] : void 0, hookContext)) return true;
	for (const key of [
		"content",
		"details",
		"payload",
		"receipt",
		"result",
		"results",
		"sendResult",
		"text"
	]) if (replyReceiptMatchesCurrentMessage(record[key], hookContext, depth + 1)) return true;
	return false;
}
function hasExplicitNonSourceMessageRoute(args, hookContext, messagingTarget) {
	const currentProvider = normalizeRouteToken(hookContext?.currentChannelProvider);
	for (const key of EXPLICIT_MESSAGE_PROVIDER_KEYS) {
		const provider = normalizeRouteToken(typeof args[key] === "string" ? args[key] : void 0);
		if (provider && currentProvider !== provider && !routeProviderMatchesSource(provider, hookContext)) return true;
	}
	const targetValues = [...EXPLICIT_MESSAGE_TARGET_KEYS.map((key) => typeof args[key] === "string" ? args[key] : void 0), ...Array.isArray(args.targets) ? args.targets.map((value) => typeof value === "string" ? value : void 0) : []].filter((value) => normalizeRouteToken(value) !== void 0);
	if (explicitThreadRouteTargetsNonSource(args, hookContext, messagingTarget)) return true;
	if (explicitRouteTokensMismatchCurrent(args, EXPLICIT_MESSAGE_REPLY_KEYS, hookContext?.currentMessageId)) return true;
	if (messagingTarget?.to !== void 0 && !routeTokenMatchesSource(messagingTarget.to, hookContext)) return true;
	if (messagingTarget?.to !== void 0) return false;
	if (targetValues.length === 0) return false;
	if (targetValues.some((value) => !routeTokenMatchesSource(value, hookContext))) return true;
	return false;
}
function normalizeAcceptedSessionSpawn(result) {
	const details = asOptionalRecord(asOptionalRecord(result)?.details);
	if (!details || details.status !== "accepted") return null;
	const runId = normalizeOptionalString(details.runId);
	const childSessionKey = normalizeOptionalString(details.childSessionKey);
	return runId && childSessionKey ? {
		runId,
		childSessionKey
	} : null;
}
/** Namespace attached to OpenClaw-owned dynamic tools exposed to Codex. */
const CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE = "openclaw";
const ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES = /* @__PURE__ */ new Set([
	"agents_list",
	"sessions_spawn",
	"sessions_yield"
]);
const EXPLICIT_MESSAGE_PROVIDER_KEYS = ["channel", "provider"];
const EXPLICIT_MESSAGE_TARGET_KEYS = [
	"target",
	"to",
	"channelId"
];
const EXPLICIT_MESSAGE_THREAD_KEYS = [
	"threadId",
	"thread_id",
	"messageThreadId",
	"topicId"
];
const EXPLICIT_MESSAGE_REPLY_KEYS = [
	"replyTo",
	"replyToId",
	"replyToIdFull"
];
function computerFrameImageIdentity(content) {
	if (!Array.isArray(content)) return;
	const images = content.filter((block) => block.type === "image");
	if (images.length !== 1) return;
	const image = expectDefined(images[0], "single Codex computer frame image");
	return createHash("sha256").update(JSON.stringify([image.mimeType, image.data])).digest("hex");
}
function invalidateComputerFrame(contextEpoch) {
	contextEpoch.value += 1;
	delete contextEpoch.frameToolCallId;
	delete contextEpoch.frameImageIdentity;
}
/**
* Creates dynamic tool specs and a call handler that executes OpenClaw tools,
* applies hooks/middleware, and records delivery/media telemetry.
*/
function createCodexDynamicToolBridge(params) {
	const toolResultHookContext = toToolResultHookContext(params.hookContext);
	const contextWindowTokens = params.hookContext?.contextWindowTokens;
	const toolResultMaxChars = typeof contextWindowTokens === "number" && Number.isFinite(contextWindowTokens) && contextWindowTokens > 0 ? Math.max(1, resolveLiveToolResultMaxChars({ contextWindowTokens })) : DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
	const availableProjection = projectCodexExecutableDynamicToolSurface(params.tools, params.hookContext);
	const registeredProjection = params.registeredTools ? projectCodexDynamicTools(params.registeredTools) : availableProjection;
	const availableTools = availableProjection.tools;
	const quarantinedAvailableToolNames = new Set(availableProjection.quarantinedTools.map((tool) => tool.tool));
	const registeredSpecTools = (params.registeredTools ? registeredProjection.tools : availableTools).filter((entry) => !quarantinedAvailableToolNames.has(entry.name));
	const toolMap = new Map(availableTools.map((entry) => [entry.name, entry]));
	const registeredToolNames = new Set(registeredSpecTools.map((entry) => entry.name));
	const quarantinedTools = dedupeQuarantinedDynamicTools([...availableProjection.quarantinedTools, ...registeredProjection.quarantinedTools]);
	warnQuarantinedDynamicTools(quarantinedTools);
	emitQuarantinedDynamicToolDiagnostics(quarantinedTools, params.hookContext);
	const telemetry = {
		didSendViaMessagingTool: false,
		didDeliverSourceReplyViaMessageTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		messagingToolSourceReplyPayloads: [],
		toolMediaUrls: [],
		toolAudioAsVoice: false,
		acceptedSessionSpawns: [],
		quarantinedTools
	};
	const middlewareRunner = createAgentToolResultMiddlewareRunner({
		runtime: "codex",
		...toolResultHookContext
	});
	const isReplaySafeToolInstance = (tool) => {
		const pluginMeta = getPluginToolMeta(tool);
		if (pluginMeta) return pluginMeta.replaySafe === true;
		return getChannelAgentToolMeta(tool) === void 0;
	};
	const legacyExtensionRunner = createCodexAppServerToolResultExtensionRunner(toolResultHookContext);
	const executionSnapshotStates = /* @__PURE__ */ new Map();
	const directToolNames = /* @__PURE__ */ new Set([...ALWAYS_DIRECT_DYNAMIC_TOOL_NAMES, ...params.directToolNames ?? []]);
	let readRemoteWorkspaceFile;
	return {
		availableTools: availableTools.map((entry) => entry.tool),
		availableSpecs: createCodexDynamicToolSpecs({
			entries: availableTools,
			loading: params.loading ?? "searchable",
			directToolNames
		}),
		specs: createCodexDynamicToolSpecs({
			entries: registeredSpecTools,
			loading: params.loading ?? "searchable",
			directToolNames
		}),
		resultContentSourceForTool: (toolName) => toolMap.get(toolName)?.tool.resultContentSource,
		telemetry,
		setRemoteWorkspaceFileReader: (reader) => {
			readRemoteWorkspaceFile = reader;
		},
		consumeToolExecutionSnapshot: (toolCallId) => {
			const state = executionSnapshotStates.get(toolCallId);
			executionSnapshotStates.delete(toolCallId);
			if (state) state.consumed = true;
			return state?.snapshot;
		},
		handleToolCall: async (call, options) => {
			const toolEntry = toolMap.get(call.tool);
			if (!toolEntry) {
				const executedArguments = asNonArrayRecord(call.arguments);
				const message = registeredToolNames.has(call.tool) ? `OpenClaw tool is not available for this turn: ${call.tool}` : `Unknown OpenClaw tool: ${call.tool}`;
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedToolResult(message),
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName: call.tool,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, call.tool, failedToolResult(message), true);
				return createFailedDynamicToolResponse(message, {
					executedArguments,
					executionStarted: false
				});
			}
			const { tool, name: toolName } = toolEntry;
			const args = asNonArrayRecord(call.arguments);
			const startedAt = Date.now();
			const signal = composeAbortSignals(params.signal, options?.signal);
			let didStartExecution = false;
			let didDispatchExecution = false;
			let executionPrevented = false;
			let executedArgs = structuredClone(args);
			const executionSnapshotState = {
				consumed: false,
				retainAfterCompletion: options?.retainExecutionSnapshot === true
			};
			executionSnapshotStates.set(call.callId, executionSnapshotState);
			const captureExecutionBoundary = () => {
				didStartExecution ||= didDispatchExecution;
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const adjustedExecutedArgs = consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
				if (isRecord(adjustedExecutedArgs)) executedArgs = adjustedExecutedArgs;
				if (!executionSnapshotState.consumed) executionSnapshotState.snapshot = {
					executedArguments: structuredClone(executedArgs),
					executionStarted: didStartExecution && !executionPrevented
				};
			};
			try {
				const toolArgs = tool.prepareArguments ? tool.prepareArguments(args) : args;
				const preparedArgs = toolName === "message" && isRecord(toolArgs) ? await prepareCodexRemoteWorkspaceMessageMedia({
					args: toolArgs,
					localWorkspaceRoot: params.hookContext?.workspaceDir,
					remoteWorkspaceRoot: params.hookContext?.remoteWorkspaceRoot,
					readRemoteFile: readRemoteWorkspaceFile,
					timeoutMs: params.hookContext?.remoteWorkspaceRequestTimeoutMs,
					signal
				}) : toolArgs;
				const telemetryArgs = isRecord(preparedArgs) ? preparedArgs : args;
				executedArgs = structuredClone(telemetryArgs);
				const messagingContext = {
					config: params.hookContext?.config,
					currentChannelId: params.hookContext?.currentChannelId,
					currentMessagingTarget: params.hookContext?.currentMessagingTarget,
					currentThreadId: params.hookContext?.currentThreadId,
					replyToMode: params.hookContext?.replyToMode,
					hasRepliedRef: params.hookContext?.hasRepliedRef ? { value: params.hookContext.hasRepliedRef.value } : void 0
				};
				didDispatchExecution = true;
				const rawResult = await tool.execute(call.callId, preparedArgs, signal);
				captureExecutionBoundary();
				const telemetryRawResult = sanitizeToolResult(rawResult);
				const rawIsError = isToolResultError(rawResult);
				const rawResultFailureKind = resolveToolResultFailureKind(rawResult);
				const middlewareResult = await middlewareRunner.applyToolResultMiddleware({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					isError: rawIsError,
					result: rawResult
				});
				const result = await legacyExtensionRunner.applyToolResultExtensions({
					threadId: call.threadId,
					turnId: call.turnId,
					toolCallId: call.callId,
					toolName,
					args: structuredClone(executedArgs),
					result: middlewareResult
				});
				const resultIsError = rawIsError || isToolResultError(result);
				const acceptedSessionSpawn = toolName === "sessions_spawn" && !rawIsError ? normalizeAcceptedSessionSpawn(telemetryRawResult) : null;
				if (acceptedSessionSpawn) telemetry.acceptedSessionSpawns.push(acceptedSessionSpawn);
				const finalResultFailureKind = resolveToolResultFailureKind(result);
				const resultFailureKind = rawResultFailureKind ?? finalResultFailureKind;
				const observerResult = rawResultFailureKind && finalResultFailureKind !== rawResultFailureKind ? {
					...result,
					details: {
						...isRecord(result.details) ? result.details : {},
						status: rawResultFailureKind
					}
				} : result;
				notifyAgentToolResult(options?.onAgentToolResult, toolName, observerResult, resultIsError);
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					result,
					startedAt
				});
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result,
					isError: resultIsError,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				const messagingTelemetryArgs = applyCurrentMessageProvider(toolName, executedArgs, params.hookContext?.currentChannelProvider);
				const messagingTarget = isMessagingTool(toolName) ? extractMessagingToolSend(toolName, messagingTelemetryArgs, messagingContext) : void 0;
				const confirmedMessagingTarget = !rawIsError && messagingTarget ? extractMessagingToolSendResult(messagingTarget, telemetryRawResult) : messagingTarget;
				const terminalType = resultFailureKind === "blocked" ? "blocked" : resultIsError ? "error" : "completed";
				const contentItems = convertToolContents(result.content, toolResultMaxChars);
				const deliveredFrameImages = contentItems.filter((item) => item.type === "inputImage");
				const finalFrameImageIdentity = computerFrameImageIdentity(result.content);
				if (toolName === "computer" && params.computerContextEpoch?.frameToolCallId === call.callId && (deliveredFrameImages.length !== 1 || finalFrameImageIdentity === void 0 || finalFrameImageIdentity !== params.computerContextEpoch.frameImageIdentity)) invalidateComputerFrame(params.computerContextEpoch);
				const response = withDiagnosticTerminalType({
					contentItems,
					success: !resultIsError
				}, terminalType);
				withDynamicToolTranscriptDetails(response, result.details);
				withDiagnosticFailureDisposition(response, resultFailureKind);
				const blocksSourceReplyTermination = hasExplicitNonSourceMessageRoute(executedArgs, params.hookContext, confirmedMessagingTarget);
				const deliveredSourceReply = isDeliveredMessageToolOnlySourceReplyResult({
					sourceReplyDeliveryMode: params.hookContext?.sourceReplyDeliveryMode,
					toolName,
					args: executedArgs,
					result,
					hookResult: rawResult,
					isError: resultIsError,
					allowExplicitSourceRoute: !blocksSourceReplyTermination
				});
				const receiptConfirmedSourceReply = params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" && toolName === "message" && normalizeRouteToken(typeof executedArgs.action === "string" ? executedArgs.action : void 0) === "reply" && !resultIsError && !blocksSourceReplyTermination && isDeliveredMessagingToolResult({
					toolName,
					args: executedArgs,
					result,
					hookResult: rawResult,
					isError: resultIsError
				}) && (replyReceiptMatchesCurrentMessage(rawResult, params.hookContext) || replyReceiptMatchesCurrentMessage(result, params.hookContext));
				const toolConfirmedSourceReply = params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" && toolName === "message" && !resultIsError && (rawResult.terminate === true || result.terminate === true);
				const confirmedSourceReply = params.hookContext?.sourceReplyDeliveryMode === "message_tool_only" && toolName === "message" && (toolConfirmedSourceReply || deliveredSourceReply || receiptConfirmedSourceReply);
				const sourceReplyFinal = confirmedSourceReply ? executedArgs.final !== false : void 0;
				collectToolTelemetry({
					toolName,
					args: executedArgs,
					result,
					mediaTrustResult: telemetryRawResult,
					telemetry,
					isError: resultIsError,
					messagingTarget: confirmedMessagingTarget,
					sourceReplyFinal
				});
				if (deliveredSourceReply || receiptConfirmedSourceReply || toolConfirmedSourceReply) telemetry.didDeliverSourceReplyViaMessageTool = true;
				const continuesSourceReplyProgress = confirmedSourceReply && sourceReplyFinal === false;
				withDynamicToolTermination(response, (rawResult.terminate === true || result.terminate === true) && !continuesSourceReplyProgress || isToolResultYield(rawResult) || isToolResultYield(result) || confirmedSourceReply && sourceReplyFinal === true);
				const asyncStarted = isAsyncStartedToolResult(rawResult) || isAsyncStartedToolResult(result);
				withDynamicToolAsyncStarted(response, asyncStarted);
				const replaySafe = executionPrevented || !asyncStarted && isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs);
				return withDynamicToolExecutionState(response, {
					executedArguments: executedArgs,
					executionStarted: didStartExecution && !executionPrevented,
					sideEffectEvidence: !replaySafe
				});
			} catch (error) {
				captureExecutionBoundary();
				if (toolName === "computer" && params.computerContextEpoch?.frameToolCallId === call.callId) invalidateComputerFrame(params.computerContextEpoch);
				const executionDisposition = getBeforeToolCallFailureDisposition(error) ?? (signal.aborted ? resolveCodexToolAbortTerminalReason(signal) : resolveToolExecutionErrorKind(error));
				const errorMessage = formatToolExecutionErrorMessage(error, "OpenClaw dynamic tool call failed.");
				executionPrevented = executionPrevented || consumePreExecutionBlockedToolCall(call.callId, toolResultHookContext.runId);
				const failedResult = failedToolResult(errorMessage, executionDisposition);
				finalizeToolTerminalPresentation({
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					result: failedResult,
					isError: true,
					observer: params.hookContext?.onToolOutcome,
					toolName,
					toolCallOrdinal: options?.toolCallOrdinal
				});
				notifyAgentToolResult(options?.onAgentToolResult, toolName, failedResult, true);
				collectToolTelemetry({
					toolName,
					args: executedArgs,
					result: void 0,
					telemetry,
					isError: true
				});
				runAgentHarnessAfterToolCallHook({
					toolName,
					toolCallId: call.callId,
					runId: toolResultHookContext.runId,
					agentId: toolResultHookContext.agentId,
					sessionId: toolResultHookContext.sessionId,
					sessionKey: toolResultHookContext.sessionKey,
					channelId: toolResultHookContext.channelId,
					startArgs: executedArgs,
					error: errorMessage,
					startedAt
				});
				const replaySafe = !didStartExecution || executionPrevented || isReplaySafeToolInstance(toolEntry.tool) && isReplaySafeToolCall(toolName, executedArgs);
				return withDynamicToolExecutionState(withDiagnosticFailureDisposition({
					contentItems: [{
						type: "inputText",
						text: errorMessage
					}],
					success: false
				}, executionDisposition), {
					executedArguments: executedArgs,
					executionStarted: didStartExecution && !executionPrevented,
					sideEffectEvidence: didStartExecution && !replaySafe
				});
			} finally {
				if (executionSnapshotStates.get(call.callId) === executionSnapshotState && (executionSnapshotState.consumed || !executionSnapshotState.retainAfterCompletion)) executionSnapshotStates.delete(call.callId);
				consumeAdjustedParamsForToolCall(call.callId, toolResultHookContext.runId);
			}
		}
	};
}
function projectCodexExecutableDynamicToolSurface(tools, hookContext) {
	const projected = projectCodexDynamicTools(tools);
	const wrapped = wrapProjectedCodexDynamicTools(projected.tools, hookContext);
	return {
		tools: wrapped.tools,
		quarantinedTools: dedupeQuarantinedDynamicTools([...projected.quarantinedTools, ...wrapped.quarantinedTools])
	};
}
/** Applies the exact schema and hook-wrapper projection used by the executable Codex bridge. */
function projectCodexExecutableDynamicTools(params) {
	const projected = projectCodexExecutableDynamicToolSurface(params.tools, params.hookContext);
	return {
		availableTools: projected.tools.map((entry) => entry.tool),
		quarantinedTools: projected.quarantinedTools
	};
}
function notifyAgentToolResult(observer, toolName, result, isError) {
	try {
		observer?.({
			toolName,
			result: sanitizeToolResult(result),
			isError
		});
	} catch (error) {
		log.warn(`onAgentToolResult handler failed: tool=${toolName} error=${String(error)}`);
	}
}
function failedToolResult(message, status = "failed") {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details: {
			status,
			error: message
		}
	};
}
function wrapProjectedCodexDynamicTools(tools, hookContext) {
	const wrappedTools = [];
	const quarantinedTools = [];
	for (const entry of tools) try {
		if (isToolWrappedWithBeforeToolCallHook(entry.tool)) {
			setBeforeToolCallDiagnosticsEnabled(entry.tool, false);
			wrappedTools.push(entry);
			continue;
		}
		wrappedTools.push({
			...entry,
			tool: wrapToolWithBeforeToolCallHook(entry.tool, hookContext, { emitDiagnostics: false })
		});
	} catch {
		quarantinedTools.push({
			tool: entry.name,
			violations: [`${entry.name} could not be wrapped for before-tool-call hooks`]
		});
	}
	return {
		tools: wrappedTools,
		quarantinedTools
	};
}
function createCodexDynamicToolSpecs(params) {
	const specs = [];
	const namespaceTools = [];
	const directOnlyNamespaceTools = [];
	const entries = params.loading === "direct" ? params.entries : params.entries.toSorted((left, right) => left.name.localeCompare(right.name));
	for (const entry of entries) {
		const functionSpec = createCodexDynamicToolFunctionSpec({ entry });
		if (entry.name === "openclaw" && params.directToolNames.has(entry.name)) {
			specs.push(functionSpec);
			continue;
		}
		if (entry.tool.catalogMode === "direct-only") {
			directOnlyNamespaceTools.push(functionSpec);
			continue;
		}
		if (params.loading === "direct" || params.directToolNames.has(entry.name)) {
			specs.push(functionSpec);
			continue;
		}
		namespaceTools.push({
			...functionSpec,
			deferLoading: true
		});
	}
	if (namespaceTools.length > 0) specs.push({
		type: "namespace",
		name: CODEX_OPENCLAW_DYNAMIC_TOOL_NAMESPACE,
		description: "",
		tools: namespaceTools
	});
	if (directOnlyNamespaceTools.length > 0) specs.push({
		type: "namespace",
		name: CODEX_OPENCLAW_DIRECT_DYNAMIC_TOOL_NAMESPACE,
		description: "",
		tools: directOnlyNamespaceTools
	});
	return specs;
}
function createCodexDynamicToolFunctionSpec(params) {
	return {
		type: "function",
		name: params.entry.name,
		description: params.entry.description,
		inputSchema: params.entry.inputSchema
	};
}
function projectCodexDynamicTools(tools) {
	const projectedTools = [];
	const quarantinedTools = [];
	let length;
	try {
		length = tools.length;
	} catch {
		return {
			tools: [],
			quarantinedTools: [{
				tool: "tool[0]",
				violations: ["tool[0] is unreadable"]
			}]
		};
	}
	for (let toolIndex = 0; toolIndex < length; toolIndex += 1) {
		let tool;
		try {
			tool = tools[toolIndex];
		} catch {
			quarantinedTools.push({
				tool: `tool[${toolIndex}]`,
				violations: [`tool[${toolIndex}] is unreadable`]
			});
			continue;
		}
		const descriptor = readCodexDynamicToolDescriptor(tool, toolIndex);
		if (!descriptor.ok) {
			quarantinedTools.push(descriptor.diagnostic);
			continue;
		}
		const normalizedParameters = normalizeOpenAIToolSchemas({
			provider: "openai",
			modelApi: "openai-chatgpt-responses",
			tools: [{ parameters: descriptor.parameters }]
		})[0]?.parameters;
		const projection = projectRuntimeToolInputSchema(normalizedParameters ?? descriptor.parameters, `${descriptor.name}.inputSchema`);
		if (projection.violations.length > 0) {
			quarantinedTools.push({
				tool: descriptor.name,
				violations: projection.violations
			});
			continue;
		}
		projectedTools.push({
			tool,
			name: descriptor.name,
			description: descriptor.description,
			inputSchema: projection.schema
		});
	}
	return {
		tools: projectedTools,
		quarantinedTools
	};
}
function readCodexDynamicToolDescriptor(tool, toolIndex) {
	const fallbackName = `tool[${toolIndex}]`;
	let name;
	try {
		const rawName = tool.name;
		if (typeof rawName !== "string" || !rawName) return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name must be a non-empty string`]
			}
		};
		name = rawName;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: fallbackName,
				violations: [`${fallbackName}.name is unreadable`]
			}
		};
	}
	let description;
	try {
		description = typeof tool.description === "string" ? tool.description : "";
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.description is unreadable`]
			}
		};
	}
	let parameters;
	try {
		parameters = tool.parameters;
	} catch {
		return {
			ok: false,
			diagnostic: {
				tool: name,
				violations: [`${name}.inputSchema is unreadable`]
			}
		};
	}
	return {
		ok: true,
		name,
		description,
		parameters
	};
}
function warnQuarantinedDynamicTools(tools) {
	if (tools.length === 0) return;
	const unique = /* @__PURE__ */ new Map();
	for (const tool of tools) unique.set(tool.tool, tool.violations);
	log.warn(`codex app-server quarantined ${unique.size} dynamic ${unique.size === 1 ? "tool" : "tools"} with unsupported input schemas: ${[...unique.keys()].join(", ")}`, { tools: [...unique.entries()].map(([tool, violations]) => ({
		tool,
		violations
	})) });
}
function emitQuarantinedDynamicToolDiagnostics(tools, ctx) {
	for (const tool of tools) emitTrustedDiagnosticEvent({
		type: "tool.execution.blocked",
		agentId: ctx?.agentId,
		runId: ctx?.runId,
		sessionId: ctx?.sessionId,
		sessionKey: ctx?.sessionKey,
		toolName: tool.tool,
		deniedReason: "unsupported_tool_schema",
		reason: tool.violations.join(", ")
	});
}
function dedupeQuarantinedDynamicTools(tools) {
	return [...new Map(tools.map((tool) => [tool.tool, {
		tool: tool.tool,
		violations: tool.violations
	}])).values()];
}
function toToolResultHookContext(ctx) {
	const { agentId, sessionId, sessionKey, runId, channelId } = ctx ?? {};
	return {
		...agentId && { agentId },
		...sessionId && { sessionId },
		...sessionKey && { sessionKey },
		...runId && { runId },
		...channelId && { channelId }
	};
}
function composeAbortSignals(...signals) {
	const activeSignals = signals.filter((signal) => Boolean(signal));
	if (activeSignals.length === 0) return new AbortController().signal;
	if (activeSignals.length === 1) return expectDefined(activeSignals[0], "single active Codex abort signal");
	return AbortSignal.any(activeSignals);
}
function collectToolTelemetry(params) {
	if (params.isError) return;
	if (!params.isError && params.toolName === "cron" && isCronAddAction(params.args)) params.telemetry.successfulCronAdds = (params.telemetry.successfulCronAdds ?? 0) + 1;
	if (!params.isError && params.toolName === "heartbeat_respond") {
		const response = normalizeHeartbeatToolResponse(params.result?.details);
		if (response) params.telemetry.heartbeatToolResponse = response;
	}
	if (!params.isError && params.result) {
		const media = extractToolResultMediaArtifact(params.result);
		if (media) {
			const mediaUrls = filterToolResultMediaUrls(params.toolName, media.mediaUrls, params.mediaTrustResult ?? params.result);
			const seen = new Set(params.telemetry.toolMediaUrls);
			for (const mediaUrl of mediaUrls) if (!seen.has(mediaUrl)) {
				seen.add(mediaUrl);
				params.telemetry.toolMediaUrls.push(mediaUrl);
			}
			if (media.audioAsVoice) params.telemetry.toolAudioAsVoice = true;
		}
	}
	if (!isMessagingTool(params.toolName)) return;
	const isMessagingSendAction = isMessagingToolSendAction(params.toolName, params.args);
	if (!isMessagingSendAction && !params.messagingTarget) return;
	if (!isMessagingSendAction && !isDeliveredMessagingToolResult({
		toolName: params.toolName,
		args: params.args,
		result: params.result,
		hookResult: params.mediaTrustResult,
		isError: params.isError
	})) return;
	params.telemetry.didSendViaMessagingTool = true;
	const sourceReplyPayload = extractInternalSourceReplyPayload(params.result?.details);
	if (sourceReplyPayload) {
		const record = {
			...sourceReplyPayload,
			...params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}
		};
		params.telemetry.messagingToolSourceReplyPayloads.push(record);
		return record;
	}
	const text = readFirstString(params.args, [
		"text",
		"message",
		"body",
		"content"
	]);
	if (text) params.telemetry.messagingToolSentTexts.push(text);
	const mediaUrls = collectMediaUrls(params.args);
	params.telemetry.messagingToolSentMediaUrls.push(...mediaUrls);
	const record = {
		...params.messagingTarget ?? {
			tool: params.toolName,
			provider: readFirstString(params.args, ["provider", "channel"]) ?? params.toolName,
			accountId: readFirstString(params.args, ["accountId", "account_id"]),
			to: readFirstString(params.args, [
				"to",
				"target",
				"recipient"
			]),
			threadId: readFirstString(params.args, [
				"threadId",
				"thread_id",
				"messageThreadId"
			])
		},
		...text ? { text } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {},
		...params.sourceReplyFinal !== void 0 ? { sourceReplyFinal: params.sourceReplyFinal } : {}
	};
	params.telemetry.messagingToolSentTargets.push(record);
	return record;
}
function extractInternalSourceReplyPayload(details) {
	if (!isRecord(details) || details.sourceReplySink !== "internal-ui") return;
	const rawPayload = details.sourceReply;
	if (!isRecord(rawPayload)) return;
	const text = readFirstString(rawPayload, ["text", "message"]);
	const mediaUrls = collectMediaUrls(rawPayload);
	const mediaUrl = typeof rawPayload.mediaUrl === "string" && rawPayload.mediaUrl.trim() ? rawPayload.mediaUrl.trim() : mediaUrls[0];
	const payload = {
		...text ? { text } : {},
		...mediaUrl ? { mediaUrl } : {},
		...mediaUrls.length > 0 ? { mediaUrls } : {},
		...rawPayload.audioAsVoice === true ? { audioAsVoice: true } : {},
		...isRecord(rawPayload.presentation) ? { presentation: rawPayload.presentation } : {},
		...isRecord(rawPayload.interactive) ? { interactive: rawPayload.interactive } : {},
		...isRecord(rawPayload.channelData) ? { channelData: rawPayload.channelData } : {},
		...typeof details.idempotencyKey === "string" && details.idempotencyKey.trim() ? { idempotencyKey: details.idempotencyKey.trim() } : {}
	};
	return text || mediaUrls.length > 0 || payload.presentation || payload.interactive ? payload : void 0;
}
function isToolResultYield(result) {
	const details = result.details;
	if (!isRecord(details) || typeof details.status !== "string") return false;
	return details.status.trim().toLowerCase() === "yielded";
}
function isAsyncStartedToolResult(result) {
	const details = result.details;
	return isRecord(details) && details.async === true && details.status === "started";
}
function withDiagnosticTerminalType(response, terminalType) {
	Object.defineProperty(response, "diagnosticTerminalType", {
		configurable: true,
		enumerable: false,
		value: terminalType
	});
	return response;
}
function withDiagnosticFailureDisposition(response, disposition) {
	if (!disposition) return response;
	withDiagnosticTerminalType(response, disposition === "blocked" ? "blocked" : "error");
	if (disposition !== "blocked") Object.defineProperty(response, "diagnosticTerminalReason", {
		configurable: true,
		enumerable: false,
		value: disposition
	});
	return response;
}
function withDynamicToolTermination(response, terminate) {
	if (!terminate) return response;
	Object.defineProperty(response, "terminate", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function withDynamicToolAsyncStarted(response, asyncStarted) {
	if (!asyncStarted) return response;
	Object.defineProperty(response, "asyncStarted", {
		configurable: true,
		enumerable: false,
		value: true
	});
	return response;
}
function normalizeToolResultMaxChars(maxChars) {
	return typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0 ? Math.floor(maxChars) : DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS;
}
function convertToolContents(content, toolResultMaxChars = DEFAULT_MAX_LIVE_TOOL_RESULT_CHARS) {
	const maxChars = normalizeToolResultMaxChars(toolResultMaxChars);
	const totalTextChars = content.reduce((total, item) => total + (item.type === "text" ? item.text.length : 0), 0);
	if (content.reduce((total, item) => total + (item.type === "text" ? estimateToolResultTextChars(item.text) : 0), 0) <= maxChars) return content.flatMap(convertToolContent);
	const noticeText = `...(OpenClaw truncated dynamic tool result: original ${totalTextChars} chars, weighted budget ${maxChars}; rerun with narrower args.)`;
	const notice = `\n${noticeText}`;
	const noticeChars = estimateToolResultTextChars(notice);
	let remainingTextBudget = Math.max(0, maxChars - noticeChars);
	let appendedNotice = false;
	const output = [];
	for (const item of content) {
		if (item.type !== "text") {
			output.push(...convertToolContent(item));
			continue;
		}
		if (appendedNotice) continue;
		if (noticeChars >= maxChars) {
			output.push({
				type: "inputText",
				text: sliceToolResultTextToBudget(noticeText, maxChars)
			});
			appendedNotice = true;
			continue;
		}
		const text = sliceToolResultTextToBudget(item.text, remainingTextBudget);
		remainingTextBudget -= estimateToolResultTextChars(text);
		if (remainingTextBudget <= 0 || text.length < item.text.length) {
			output.push({
				type: "inputText",
				text: `${text.trimEnd()}${notice}`
			});
			appendedNotice = true;
		} else if (text.length > 0) output.push({
			type: "inputText",
			text
		});
	}
	if (!appendedNotice) output.push({
		type: "inputText",
		text: sliceToolResultTextToBudget(noticeText, maxChars)
	});
	return output;
}
function convertToolContent(content) {
	if (content.type === "text") return [{
		type: "inputText",
		text: content.text
	}];
	const imageUrl = sanitizeInlineImageDataUrl(`data:${content.mimeType};base64,${content.data}`);
	if (!imageUrl) return [{
		type: "inputText",
		text: invalidInlineImageText("codex dynamic tool")
	}];
	return [{
		type: "inputImage",
		imageUrl
	}];
}
function readFirstString(record, keys) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === "string" && value.trim()) return value.trim();
		if (typeof value === "number" && Number.isFinite(value)) return String(value);
	}
}
function collectMediaUrls(record) {
	const urls = [];
	const pushMediaUrl = (value) => {
		if (typeof value === "string" && value.trim()) urls.push(value.trim());
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const attachment = value;
		for (const key of [
			"media",
			"mediaUrl",
			"path",
			"filePath",
			"fileUrl",
			"url"
		]) pushMediaUrl(attachment[key]);
	};
	for (const key of [
		"media",
		"mediaUrl",
		"media_url",
		"path",
		"filePath",
		"fileUrl",
		"imageUrl",
		"image_url"
	]) {
		const value = record[key];
		pushMediaUrl(value);
	}
	for (const key of [
		"mediaUrls",
		"media_urls",
		"imageUrls",
		"image_urls"
	]) {
		const value = record[key];
		if (!Array.isArray(value)) continue;
		for (const entry of value) pushMediaUrl(entry);
	}
	const attachments = record.attachments;
	if (Array.isArray(attachments)) for (const attachment of attachments) pushAttachment(attachment);
	return urls;
}
function isCronAddAction(args) {
	const action = args.action;
	return typeof action === "string" && action.trim().toLowerCase() === "add";
}
//#endregion
export { buildCodexNativeHookRelayDisabledConfig as A, resolveDynamicToolCallTimeoutMs as B, shouldWarnCodexDynamicToolBuildStageSummary as C, CODEX_NATIVE_HOOK_RELAY_EVENTS as D, CodexNativeToolLifecycleProjector as E, scheduleCodexNativeHookRelayUnregister as F, toCodexDynamicToolProtocolResponse as G, shouldBlockTerminalReleaseForNonTerminalDynamicToolResult as H, handleDynamicToolCallWithTimeout as I, resolveCodexToolAbortTerminalReason as K, hasPendingDynamicToolTerminalDiagnostic as L, emitCodexNativePreToolUseFailureDiagnostic as M, resolveCodexNativeHookRelayEvents as N, CODEX_NATIVE_HOOK_RELAY_TTL_GRACE_MS as O, resolveCodexNativeHookRelayTtlMs as P, isDynamicToolTerminalDiagnosticEvent as R, shouldRequireCodexSandboxExecServerEnvironment as S, readBoundedCodexRemoteWorkspaceFile as T, shouldReleaseTurnAfterTerminalDynamicTool as U, resolveTerminalDynamicToolBatchAction as V, toCodexDynamicToolProgressResponse as W, resolveCodexAppServerHookChannelId as _, emitDynamicToolStartedDiagnostic as a, resolveCodexSandboxEnvironmentSelection as b, resolveCodexProviderWebSearchSupport as c, releaseCodexSandboxExecServerEnvironment as d, buildDynamicTools as f, resolveCodexAppServerExecutionCwd as g, formatCodexDynamicToolBuildStageSummary as h, emitDynamicToolErrorDiagnostic as i, createCodexNativeHookRelay as j, buildCodexNativeHookRelayConfig as k, resolveCodexProviderWebSearchSupportForClient as l, disableCodexPluginThreadConfig as m, projectCodexExecutableDynamicTools as n, emitDynamicToolTerminalDiagnostic as o, createCodexDynamicToolBuildStageTracker as p, handleCodexAppServerElicitationRequest as r, handleCodexAppServerApprovalRequest as s, createCodexDynamicToolBridge as t, ensureCodexSandboxExecServerEnvironment as u, resolveCodexExternalSandboxPolicyForOpenClawSandbox as v, filterToolsForVisionInputs as w, shouldEnableCodexAppServerNativeToolSurface as x, resolveCodexMessageToolProvider as y, isMatchingDynamicToolTerminalDiagnostic as z };
