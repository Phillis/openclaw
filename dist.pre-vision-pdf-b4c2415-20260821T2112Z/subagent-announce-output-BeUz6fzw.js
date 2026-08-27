import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-y-_yRnBE.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { n as safeParseJsonRecord } from "./json-coercion-ighRFv8Y.js";
import "./agent-scope-BizOtGGz.js";
import { f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { r as getRuntimeConfig } from "./io-CeQckj5v.js";
import { n as readTrimmedStringAlias } from "./string-readers-e58-jh1A.js";
import { $ as isAnnounceSkip, nt as selectDeliverableSessionsReply } from "./openclaw-state-db-DlCMR4eQ.js";
import { o as isSilentReplyText } from "./tokens-CMI0yx54.js";
import "./operator-scopes-Dw7Gu2cA.js";
import "./config-Dl8DJbzM.js";
import { s as callGateway } from "./call-D4XcT41c.js";
import { s as resolveLeastPrivilegeOperatorScopesForMethod } from "./method-scopes-DRTuNy7j.js";
import { c as resolveContextEngine } from "./registry-BcgtD5p6.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-IYtayVps.js";
import "./delivery-context.shared-D-qPZITK.js";
import { Qt as loadSessionEntry } from "./session-accessor-Bi6bzKQE.js";
import "./session-accessor.sqlite-lifecycle-Cv8qGX3X.js";
import { g as resolveFreshSessionTotalTokens } from "./restart-recovery-state-BoowPFT5.js";
import { t as formatDurationCompact } from "./format-duration-DKk9BtRb.js";
import { i as loadPreparedModelCatalog } from "./prepared-model-catalog-DhM2CKIW.js";
import { a as buildAgentRunTerminalOutcomeFromWaitResult } from "./agent-run-terminal-outcome-D3lKKt7D.js";
import "./session-binding-service-tMO6MxaM.js";
import "./runs-CS8YarJf.js";
import "./sessions-D-jhKYGW.js";
import "./lifecycle-BOW0O5mU.js";
import { c as readSessionMessagesAsync } from "./session-transcript-readers-CJcK7eRo.js";
import { l as compareSubagentRunGeneration } from "./subagent-registry.store.sqlite-okpdNwYx.js";
import { y as resolveSubagentRunTimerDelayMs } from "./subagent-run-liveness-Xp6SfCLg.js";
import "./session-utils-CCDcSRdK.js";
import "./runtime-status-DwfYu5UM.js";
import { n as wrapPromptDataBlock } from "./sanitize-for-prompt-Bz_9VqrX.js";
import "./sessions-helpers-CuYcNwxb.js";
import { o as hasInProcessGatewayContext, s as dispatchGatewayMethodInProcess } from "./server-plugins-COsnjcH5.js";
import { n as forkSessionEntryFromParent } from "./session-fork-xdqhWyHA.js";
import { t as ensureContextEnginesInitialized } from "./init-CMN7pYF0.js";
import "./lanes-CI0_P-yC.js";
import { n as sanitizeTextContent, t as extractStoredAssistantText } from "./chat-history-text-k473u80J.js";
import { promises } from "node:fs";
//#region src/agents/subagents/registry/subagent-session-cleanup.ts
/**
* Cleanup helper for subagent sessions. It deletes child session state through
* the gateway and preserves lifecycle-hook behavior for session-mode spawns.
*/
function isSessionLifecycleChangedGatewayError(error) {
	if (!(error instanceof Error) || error.name !== "GatewayClientRequestError") return false;
	const requestError = error;
	const details = requestError.details;
	return requestError.gatewayCode === "INVALID_REQUEST" && typeof details === "object" && details !== null && details.reason === "session-changed";
}
/** Deletes a child subagent session and optionally emits session-mode lifecycle hooks. */
async function deleteSubagentSessionForCleanup(params) {
	if (!params.expectedSessionId || !params.expectedLifecycleRevision) return "failed";
	try {
		await params.callGateway({
			method: "sessions.delete",
			params: {
				key: params.childSessionKey,
				deleteTranscript: params.deleteTranscript ?? true,
				emitLifecycleHooks: params.emitLifecycleHooks ?? params.spawnMode === "session",
				expectedSessionId: params.expectedSessionId,
				expectedLifecycleRevision: params.expectedLifecycleRevision
			},
			timeoutMs: params.timeoutMs ?? 1e4
		});
		return "deleted";
	} catch (error) {
		if (isSessionLifecycleChangedGatewayError(error)) return "changed";
		params.onError?.(error);
		return "failed";
	}
}
//#endregion
//#region src/agents/subagents/spawn/subagent-launch-authorization.ts
/** Applies only the exact model choice authorized during spawn planning. */
function applySubagentLaunchAuthorization(request, authorization) {
	const modelOverride = authorization?.modelOverride;
	if (!modelOverride) return request;
	return {
		...request,
		...modelOverride.provider ? { provider: modelOverride.provider } : {},
		model: modelOverride.model
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-deps.ts
const defaultSubagentSpawnDeps = {
	callGateway,
	dispatchGatewayMethodInProcess,
	forkSessionEntryFromParent,
	getGlobalHookRunner,
	getRuntimeConfig,
	hasInProcessGatewayContext,
	ensureContextEnginesInitialized,
	loadPreparedModelCatalog,
	resolveContextEngine
};
let subagentSpawnDeps = defaultSubagentSpawnDeps;
function getSubagentSpawnDeps() {
	return subagentSpawnDeps;
}
function setSubagentSpawnDepsForTest(overrides) {
	subagentSpawnDeps = overrides ? {
		...defaultSubagentSpawnDeps,
		...overrides
	} : defaultSubagentSpawnDeps;
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-gateway.ts
const DEFAULT_SUBAGENT_AGENT_GATEWAY_TIMEOUT_MS = 6e4;
const MAX_SUBAGENT_AGENT_GATEWAY_TIMEOUT_MS = 3e5;
async function callSubagentGatewayWithDispatchMode(params, authorization, options) {
	const authorizedParams = params.params != null && typeof params.params === "object" && !Array.isArray(params.params) ? applySubagentLaunchAuthorization(params.params, authorization) : params.params;
	const leastPrivilegeScopes = resolveLeastPrivilegeOperatorScopesForMethod(params.method, authorizedParams);
	const allowModelOverride = authorization !== void 0;
	const deps = getSubagentSpawnDeps();
	const hasInProcessGateway = deps.hasInProcessGatewayContext();
	const needsOutOfProcessModelOverrideAuth = allowModelOverride && !hasInProcessGateway;
	const scopes = params.scopes ?? (leastPrivilegeScopes.includes("operator.admin") || needsOutOfProcessModelOverrideAuth ? ["operator.admin"] : void 0);
	const request = {
		...params,
		params: authorizedParams,
		...scopes != null ? { scopes } : {}
	};
	if (hasInProcessGateway && request.params != null && typeof request.params === "object" && !Array.isArray(request.params)) {
		const forceSyntheticClient = request.method === "agent" || scopes != null;
		return {
			response: await deps.dispatchGatewayMethodInProcess(request.method, request.params, {
				expectFinal: request.expectFinal,
				...allowModelOverride ? { allowSyntheticModelOverride: true } : {},
				...options?.agentRunTracking ? { agentRunTracking: options.agentRunTracking } : {},
				...forceSyntheticClient ? { forceSyntheticClient: true } : {},
				...typeof request.timeoutMs === "number" ? { timeoutMs: request.timeoutMs } : {},
				...scopes != null ? { syntheticScopes: scopes } : {}
			}),
			dispatchMode: "in_process"
		};
	}
	return {
		response: await deps.callGateway(request),
		dispatchMode: "out_of_process"
	};
}
async function callSubagentGateway(params, authorization) {
	return (await callSubagentGatewayWithDispatchMode(params, authorization)).response;
}
async function callNativeSubagentGateway(params, authorization) {
	const result = await callSubagentGatewayWithDispatchMode(params, authorization, { agentRunTracking: "native_subagent" });
	return {
		response: result.response,
		taskRowOwnership: result.dispatchMode === "in_process" ? "required" : "gateway_best_effort"
	};
}
function readGatewayRunId(response) {
	if (!response || typeof response !== "object") return;
	const { runId } = response;
	return typeof runId === "string" && runId.trim() ? runId.trim() : void 0;
}
function resolveSubagentAgentGatewayTimeoutMs(runTimeoutSeconds) {
	const runTimeoutMs = resolveSubagentRunTimerDelayMs(runTimeoutSeconds) ?? 0;
	if (runTimeoutMs <= 0) return DEFAULT_SUBAGENT_AGENT_GATEWAY_TIMEOUT_MS;
	return Math.min(MAX_SUBAGENT_AGENT_GATEWAY_TIMEOUT_MS, Math.max(DEFAULT_SUBAGENT_AGENT_GATEWAY_TIMEOUT_MS, runTimeoutMs + 5e3));
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-cleanup.ts
const SUBAGENT_CONTROL_GATEWAY_TIMEOUT_MS = 6e4;
function isMatchingAbortResponse(response, gatewayRunId) {
	if (!response || typeof response !== "object") return false;
	const result = response;
	return result.aborted === true && Array.isArray(result.runIds) && result.runIds.some((runId) => runId === gatewayRunId);
}
async function retrySubagentCleanup(attempt, options) {
	for (;;) {
		try {
			if (await attempt()) return true;
		} catch (error) {
			options?.onError?.(error);
		}
		if (options?.shouldRetry?.() === false) return false;
		await new Promise((resolve) => {
			setTimeout(resolve, isFastTestRuntimeEnv() ? 1 : 1e3).unref?.();
		});
	}
}
function requestProvisionalSessionCleanup(childSessionKey, options) {
	return deleteSubagentSessionForCleanup({
		...options,
		childSessionKey,
		callGateway: options?.callGateway ?? callSubagentGateway,
		deleteTranscript: options?.deleteTranscript === true,
		timeoutMs: options?.timeoutMs ?? SUBAGENT_CONTROL_GATEWAY_TIMEOUT_MS
	});
}
async function cleanupProvisionalSession(childSessionKey, options) {
	return await requestProvisionalSessionCleanup(childSessionKey, options) === "deleted";
}
async function waitForProvisionalSessionDeletion(childSessionKey, options) {
	let deleted = false;
	await retrySubagentCleanup(async () => {
		const outcome = await requestProvisionalSessionCleanup(childSessionKey, options);
		deleted = outcome === "deleted";
		return outcome !== "failed";
	});
	return deleted;
}
async function cleanupFailedSpawnBeforeAgentStart(params) {
	const { childSessionKey, attachmentAbsDir, waitForSessionDeletion, ...sessionCleanupOptions } = params;
	let attachmentsRemoved = true;
	if (attachmentAbsDir) try {
		await promises.rm(attachmentAbsDir, {
			recursive: true,
			force: true
		});
	} catch {
		attachmentsRemoved = false;
	}
	return {
		attachmentsRemoved,
		sessionDeleted: await (waitForSessionDeletion ? waitForProvisionalSessionDeletion : cleanupProvisionalSession)(childSessionKey, sessionCleanupOptions)
	};
}
async function terminateAcceptedCollectorRun(params) {
	const call = params.callGateway ?? callSubagentGateway;
	const timeoutMs = params.timeoutMs ?? SUBAGENT_CONTROL_GATEWAY_TIMEOUT_MS;
	await retrySubagentCleanup(async () => {
		try {
			if (isMatchingAbortResponse(await call({
				method: "chat.abort",
				params: {
					sessionKey: params.childSessionKey,
					runId: params.gatewayRunId
				},
				timeoutMs
			}), params.gatewayRunId)) return true;
		} catch {}
		return await requestProvisionalSessionCleanup(params.childSessionKey, {
			deleteTranscript: true,
			expectedSessionId: params.expectedSessionId,
			expectedLifecycleRevision: params.expectedLifecycleRevision,
			callGateway: call,
			timeoutMs
		}) !== "failed";
	});
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-capture.ts
/**
* Helpers for capturing the latest subagent completion reply after a run ends.
*
* Completion output can lag behind lifecycle state, so callers can retry briefly
* before sending an empty or stale announcement.
*/
/** Reads subagent output repeatedly until non-empty text appears or the bounded wait expires. */
async function readLatestSubagentOutputWithRetryUsing(params) {
	const maxWaitMs = Math.max(0, Math.min(params.maxWaitMs, 15e3));
	if (!(maxWaitMs > 0)) return;
	const deadlineAt = performance.now() + maxWaitMs;
	for (;;) {
		const result = await params.readSubagentOutput(params.sessionKey, params.outcome);
		if (result?.trim()) return result;
		const remainingMs = deadlineAt - performance.now();
		if (remainingMs <= 0) return result;
		const sleepMs = Math.min(params.retryIntervalMs, remainingMs);
		await new Promise((resolve) => {
			setTimeout(resolve, sleepMs);
		});
	}
}
/** Captures immediate output first, then optionally waits for a delayed completion reply. */
async function captureSubagentCompletionReplyUsing(params) {
	const immediate = await params.readSubagentOutput(params.sessionKey);
	if (immediate?.trim()) return immediate;
	if (params.waitForReply === false) return;
	return await readLatestSubagentOutputWithRetryUsing({
		sessionKey: params.sessionKey,
		maxWaitMs: params.maxWaitMs,
		retryIntervalMs: params.retryIntervalMs,
		readSubagentOutput: params.readSubagentOutput
	});
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce.runtime.ts
function readSubagentSessionEntry(storePath, sessionKey) {
	return loadSessionEntry({
		storePath,
		sessionKey
	});
}
//#endregion
//#region src/agents/subagents/announce/subagent-yield-output.ts
/**
* sessions_yield transcript detectors.
*
* Accepts provider-specific tool-call and tool-result shapes used by transcript repair and announce capture.
*/
function readToolName(value) {
	const record = asOptionalRecord(value);
	if (!record) return;
	const aliases = [
		"name",
		"toolName",
		"tool_name",
		"functionName",
		"function_name"
	];
	const direct = readTrimmedStringAlias(record, aliases);
	if (direct) return direct;
	const nestedFunction = asOptionalRecord(record.function);
	return nestedFunction ? readTrimmedStringAlias(nestedFunction, aliases) : void 0;
}
function isToolCallBlock(value) {
	const record = asOptionalRecord(value);
	if (!record) return false;
	return record.type === "toolCall" || record.type === "tool_use" || record.type === "toolUse" || record.type === "functionCall" || record.type === "function_call";
}
/** Returns true when an assistant message requested the sessions_yield tool. */
function assistantCallsSessionsYield(message) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "assistant") return false;
	if (Array.isArray(record.content) && record.content.some((block) => isToolCallBlock(block) && readToolName(block) === "sessions_yield")) return true;
	return [record.toolCalls, record.tool_calls].some((toolCalls) => Array.isArray(toolCalls) && toolCalls.some((toolCall) => readToolName(toolCall) === "sessions_yield"));
}
function parseJsonObject(text) {
	const trimmed = text.trim();
	if (!trimmed.startsWith("{")) return;
	return safeParseJsonRecord(trimmed);
}
function readStructuredToolPayload(content) {
	const record = asOptionalRecord(content);
	if (record) return record;
	if (typeof content === "string") return parseJsonObject(content);
	if (!Array.isArray(content)) return;
	for (const block of content) {
		const blockRecord = asOptionalRecord(block);
		if (!blockRecord) continue;
		const text = blockRecord.text;
		if (typeof text !== "string") continue;
		const parsed = parseJsonObject(text);
		if (parsed) return parsed;
	}
}
/** Returns true when a tool result represents a completed sessions_yield handoff. */
function isSessionsYieldToolResult(message, previousAssistantCalledYield) {
	const record = asOptionalRecord(message);
	if (!record || record.role !== "toolResult" && record.role !== "tool") return false;
	if (readToolName(record) === "sessions_yield") return true;
	if (!previousAssistantCalledYield) return false;
	if (asOptionalRecord(record.details)?.status === "yielded") return true;
	return readStructuredToolPayload(record.content)?.status === "yielded";
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-output.ts
/**
* Subagent completion output capture.
*
* Reads child session output, detects waiting states, and formats completion findings for announcements.
*/
const FAST_TEST_RETRY_INTERVAL_MS = 8;
const MAX_CHILD_COMPLETION_RESULT_CHARS = 512;
const MAX_CHILD_COMPLETION_FIELD_CHARS = 256;
const MAX_CHILD_COMPLETION_FINDINGS_CHARS = 4096;
const CHILD_RESULT_TRUNCATION_NOTICE = "\n[child result truncated]";
const ASSISTANT_TOOL_CALL_BLOCK_TYPES = /* @__PURE__ */ new Set([
	"toolCall",
	"tool_use",
	"toolUse",
	"functionCall",
	"function_call"
]);
const defaultSubagentAnnounceOutputDeps = {
	callGateway,
	getRuntimeConfig,
	readSubagentSessionEntry,
	readSessionMessagesAsync,
	resolveAgentIdFromSessionKey,
	resolveSessionStorePathCore
};
let subagentAnnounceOutputDeps = defaultSubagentAnnounceOutputDeps;
function isFastTestMode() {
	return isFastTestRuntimeEnv();
}
function withSubagentOutcomeTiming(outcome, timing) {
	const startedAt = asFiniteNumber(timing.startedAt) ?? asFiniteNumber(outcome.startedAt);
	const endedAt = asFiniteNumber(timing.endedAt) ?? asFiniteNumber(outcome.endedAt);
	const nextTiming = {};
	if (typeof startedAt === "number") nextTiming.startedAt = startedAt;
	if (typeof endedAt === "number") nextTiming.endedAt = endedAt;
	if (typeof startedAt === "number" && typeof endedAt === "number") nextTiming.elapsedMs = Math.max(0, endedAt - startedAt);
	return {
		...outcome,
		...nextTiming
	};
}
function extractSubagentAssistantText(message) {
	if (!message || typeof message !== "object") return "";
	if (message.role !== "assistant") return "";
	const content = message.content;
	if (typeof content === "string") return sanitizeTextContent(content);
	return extractStoredAssistantText(message) ?? "";
}
function countAssistantToolCalls(message) {
	if (!message || typeof message !== "object") return 0;
	const content = message.content;
	const contentToolCalls = Array.isArray(content) ? content.filter((block) => block && typeof block === "object" && ASSISTANT_TOOL_CALL_BLOCK_TYPES.has(block.type ?? "")).length : 0;
	const toolCalls = message.toolCalls ?? message.tool_calls;
	return contentToolCalls + (Array.isArray(toolCalls) ? toolCalls.length : 0);
}
function summarizeSubagentOutputHistory(messages) {
	const snapshot = {};
	let previousAssistantCalledYield = false;
	for (const message of messages) {
		if (!message || typeof message !== "object") continue;
		const role = message.role;
		const provenance = message.provenance;
		if (role === "user" || provenance && typeof provenance === "object" && !Array.isArray(provenance) && provenance.kind === "inter_session") {
			snapshot.latestAssistantText = void 0;
			snapshot.latestSilentText = void 0;
			snapshot.latestToolCallCount = void 0;
			snapshot.waitingForContinuation = false;
			previousAssistantCalledYield = false;
			continue;
		}
		if (role === "assistant") {
			if (assistantCallsSessionsYield(message)) {
				snapshot.latestAssistantText = void 0;
				snapshot.latestSilentText = void 0;
				snapshot.waitingForContinuation = true;
				previousAssistantCalledYield = true;
				continue;
			}
			const text = extractSubagentAssistantText(message).trim();
			if (!text) {
				snapshot.latestToolCallCount = (snapshot.latestToolCallCount ?? 0) + countAssistantToolCalls(message);
				snapshot.waitingForContinuation = false;
				previousAssistantCalledYield = false;
				continue;
			}
			if (isAnnounceSkip(text) || isSilentReplyText(text, "NO_REPLY")) {
				snapshot.latestSilentText = text;
				snapshot.latestAssistantText = void 0;
				snapshot.waitingForContinuation = false;
				previousAssistantCalledYield = false;
				continue;
			}
			snapshot.latestSilentText = void 0;
			snapshot.latestAssistantText = text;
			snapshot.waitingForContinuation = false;
			previousAssistantCalledYield = false;
			continue;
		}
		if (isSessionsYieldToolResult(message, previousAssistantCalledYield)) {
			snapshot.latestAssistantText = void 0;
			snapshot.latestSilentText = void 0;
			snapshot.waitingForContinuation = true;
			previousAssistantCalledYield = false;
			continue;
		}
		previousAssistantCalledYield = false;
	}
	return snapshot;
}
function selectSubagentOutputText(snapshot, outcome) {
	if (snapshot.waitingForContinuation) return;
	if (snapshot.latestSilentText) return snapshot.latestSilentText;
	if (snapshot.latestAssistantText) return snapshot.latestAssistantText;
	if (outcome?.status === "timeout" && snapshot.latestToolCallCount && snapshot.latestToolCallCount > 0) return `${snapshot.latestToolCallCount} tool call(s) made without visible output.`;
}
async function readSubagentOutput(sessionKey, outcome, options) {
	let messages;
	if (options?.sessionTarget) messages = await subagentAnnounceOutputDeps.readSessionMessagesAsync(options.sessionTarget, {
		mode: "recent",
		maxMessages: 100,
		maxBytes: 1024 * 1024
	});
	const history = messages === void 0 ? await subagentAnnounceOutputDeps.callGateway({
		method: "chat.history",
		params: {
			sessionKey,
			limit: 100
		}
	}) : void 0;
	const selected = selectSubagentOutputText(summarizeSubagentOutputHistory(messages ?? (Array.isArray(history?.messages) ? history.messages : [])), outcome);
	if (selected?.trim()) return selected;
}
async function readLatestSubagentOutputWithRetry(params) {
	return await readLatestSubagentOutputWithRetryUsing({
		sessionKey: params.sessionKey,
		maxWaitMs: params.maxWaitMs,
		outcome: params.outcome,
		retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
		readSubagentOutput
	});
}
async function readSubagentTimeoutProgress(sessionKey, maxWaitMs, outcome) {
	const initial = await readSubagentOutput(sessionKey, outcome);
	const progress = initial?.trim() ? initial : await readLatestSubagentOutputWithRetry({
		sessionKey,
		maxWaitMs,
		outcome
	});
	return progress && !isAnnounceSkip(progress) && !isSilentReplyText(progress, "NO_REPLY") ? progress : void 0;
}
async function waitForSubagentRunOutcome(runId, timeoutMs) {
	const waitMs = Math.max(0, Math.floor(timeoutMs));
	return await subagentAnnounceOutputDeps.callGateway({
		method: "agent.wait",
		params: {
			runId,
			timeoutMs: waitMs
		},
		timeoutMs: waitMs + 2e3
	});
}
function applySubagentWaitOutcome(params) {
	const next = {
		outcome: params.outcome,
		startedAt: params.startedAt,
		endedAt: params.endedAt
	};
	if (typeof params.wait?.startedAt === "number" && typeof next.startedAt !== "number") next.startedAt = params.wait.startedAt;
	if (typeof params.wait?.endedAt === "number" && typeof next.endedAt !== "number") next.endedAt = params.wait.endedAt;
	const waitError = typeof params.wait?.error === "string" ? params.wait.error : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromWaitResult(params.wait);
	let outcome = next.outcome;
	if (terminalOutcome?.status === "timeout") outcome = { status: "timeout" };
	else if (terminalOutcome?.reason === "aborted" || terminalOutcome?.reason === "cancelled" || terminalOutcome?.reason === "superseded") outcome = {
		status: "error",
		error: "subagent run terminated"
	};
	else if (terminalOutcome?.reason === "blocked" || terminalOutcome?.reason === "abandoned" || terminalOutcome?.reason === "failed") outcome = {
		status: "error",
		error: terminalOutcome.error ?? waitError
	};
	else if (terminalOutcome?.reason === "completed") outcome = { status: "ok" };
	next.outcome = outcome ? withSubagentOutcomeTiming(outcome, next) : void 0;
	return next;
}
async function captureSubagentCompletionReply(sessionKey, options) {
	return await captureSubagentCompletionReplyUsing({
		sessionKey,
		waitForReply: options?.waitForReply,
		maxWaitMs: isFastTestMode() ? 50 : 1500,
		retryIntervalMs: isFastTestMode() ? FAST_TEST_RETRY_INTERVAL_MS : 100,
		readSubagentOutput: async (nextSessionKey) => await readSubagentOutput(nextSessionKey, options?.outcome, { sessionTarget: options?.sessionTarget })
	});
}
function describeSubagentOutcome(outcome) {
	if (!outcome) return "unknown";
	if (outcome.status === "ok") return "ok";
	if (outcome.status === "timeout") return "timeout";
	if (outcome.status === "error") return outcome.error?.trim() ? `error: ${outcome.error.trim()}` : "error";
	return "unknown";
}
function formatChildResultData(resultText) {
	const text = resultText?.trim() || "(no output)";
	return wrapPromptDataBlock({
		label: "Child result",
		text: text.length > MAX_CHILD_COMPLETION_RESULT_CHARS ? `${truncateUtf16Safe(text, MAX_CHILD_COMPLETION_RESULT_CHARS - 25)}${CHILD_RESULT_TRUNCATION_NOTICE}` : text,
		maxChars: MAX_CHILD_COMPLETION_RESULT_CHARS
	}) || "Child result: (no output)";
}
function truncateChildCompletionField(value) {
	return value.length > MAX_CHILD_COMPLETION_FIELD_CHARS ? `${truncateUtf16Safe(value, MAX_CHILD_COMPLETION_FIELD_CHARS - 1)}…` : value;
}
function selectChildCompletionResultText(child) {
	const primary = child.completion?.resultText;
	const fallback = child.completion?.fallbackResultText ?? child.frozenResultText;
	if (child.execution.outcome?.status === "ok") return selectDeliverableSessionsReply(primary, fallback);
	return (primary ?? fallback)?.trim() || void 0;
}
function hasCapturedChildCompletionReply(child) {
	return [
		child.completion?.resultText,
		child.completion?.fallbackResultText,
		child.frozenResultText
	].some((value) => Boolean(value?.trim()));
}
function buildChildCompletionFindings(children) {
	const sorted = [...children].toSorted((a, b) => {
		if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
		const aEnded = typeof a.execution.endedAt === "number" ? a.execution.endedAt : Number.MAX_SAFE_INTEGER;
		const bEnded = typeof b.execution.endedAt === "number" ? b.execution.endedAt : Number.MAX_SAFE_INTEGER;
		if (aEnded !== bEnded) return aEnded - bEnded;
		return a.childSessionKey < b.childSessionKey ? -1 : a.childSessionKey > b.childSessionKey ? 1 : 0;
	});
	const sections = [];
	for (const [index, child] of sorted.entries()) {
		const resultText = selectChildCompletionResultText(child);
		const outcome = describeSubagentOutcome(child.execution.outcome);
		if (child.execution.outcome?.status === "ok" && !resultText && hasCapturedChildCompletionReply(child)) continue;
		const title = child.label?.trim() || child.task.trim() || child.childSessionKey.trim() || `child ${index + 1}`;
		const displayIndex = sections.length + 1;
		sections.push({
			index: displayIndex,
			actionable: child.execution.outcome?.status !== "ok",
			text: [
				`${displayIndex}. ${truncateChildCompletionField(title)}`,
				`status: ${truncateChildCompletionField(outcome)}`,
				formatChildResultData(resultText)
			].join("\n")
		});
	}
	if (sections.length === 0) return;
	const render = (visibleSections, omittedCount = 0) => [
		"Child completion results:",
		"",
		...visibleSections,
		...omittedCount > 0 ? [`[${omittedCount} additional child completion result${omittedCount === 1 ? "" : "s"} omitted to fit the context budget.]`] : []
	].join("\n\n");
	const allSections = sections.map((section) => section.text);
	if (render(allSections).length <= MAX_CHILD_COMPLETION_FINDINGS_CHARS) return render(allSections);
	const prioritizedSections = [...sections.filter((section) => section.actionable), ...sections.filter((section) => !section.actionable)];
	let visibleSections = [];
	for (const section of prioritizedSections) {
		const nextSections = [...visibleSections, section].toSorted((left, right) => left.index - right.index);
		const omittedCount = sections.length - nextSections.length;
		if (render(nextSections.map((entry) => entry.text), omittedCount).length <= MAX_CHILD_COMPLETION_FINDINGS_CHARS) visibleSections = nextSections;
	}
	return render(visibleSections.map((section) => section.text), sections.length - visibleSections.length);
}
function dedupeLatestChildCompletionRows(children) {
	const latestByChildSessionKey = /* @__PURE__ */ new Map();
	for (const child of children) {
		const existing = latestByChildSessionKey.get(child.childSessionKey);
		if (!existing || compareSubagentRunGeneration(child, existing) > 0) latestByChildSessionKey.set(child.childSessionKey, child);
	}
	return [...latestByChildSessionKey.values()];
}
function filterCurrentDirectChildCompletionRows(children, params) {
	if (typeof params.getLatestSubagentRunByChildSessionKey !== "function") return children;
	return children.filter((child) => {
		const latest = params.getLatestSubagentRunByChildSessionKey?.(child.childSessionKey);
		if (!latest) return true;
		return latest.runId === child.runId && latest.requesterSessionKey === params.requesterSessionKey && (!params.requesterAgentId || latest.requesterAgentId === params.requesterAgentId);
	});
}
function formatTokenCount(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return "0";
	if (value >= 1e6) return `${(value / 1e6).toFixed(1)}m`;
	if (value >= 1e3) {
		const formattedThousands = (value / 1e3).toFixed(1);
		if (Number(formattedThousands) >= 1e3) return `${(value / 1e6).toFixed(1)}m`;
		return `${formattedThousands}k`;
	}
	return String(Math.round(value));
}
async function buildCompactAnnounceStatsLine(params) {
	const cfg = subagentAnnounceOutputDeps.getRuntimeConfig();
	const agentId = subagentAnnounceOutputDeps.resolveAgentIdFromSessionKey(params.sessionKey);
	const storePath = subagentAnnounceOutputDeps.resolveSessionStorePathCore(cfg.session?.store, { agentId });
	let entry = subagentAnnounceOutputDeps.readSubagentSessionEntry(storePath, params.sessionKey);
	const tokenWaitAttempts = isFastTestMode() ? 1 : 3;
	for (let attempt = 0; attempt < tokenWaitAttempts; attempt += 1) {
		if (typeof entry?.inputTokens === "number" || typeof entry?.outputTokens === "number" || resolveFreshSessionTotalTokens(entry) !== void 0) break;
		if (!isFastTestMode()) await new Promise((resolve) => {
			setTimeout(resolve, 150);
		});
		entry = subagentAnnounceOutputDeps.readSubagentSessionEntry(storePath, params.sessionKey);
	}
	const input = typeof entry?.inputTokens === "number" ? entry.inputTokens : 0;
	const output = typeof entry?.outputTokens === "number" ? entry.outputTokens : 0;
	const ioTotal = input + output;
	const promptCache = resolveFreshSessionTotalTokens(entry);
	const parts = [`runtime ${formatDurationCompact(typeof params.startedAt === "number" && typeof params.endedAt === "number" ? Math.max(0, params.endedAt - params.startedAt) : void 0) ?? "n/a"}`, `tokens ${formatTokenCount(ioTotal)} (in ${formatTokenCount(input)} / out ${formatTokenCount(output)})`];
	if (typeof promptCache === "number" && promptCache > ioTotal) parts.push(`prompt/cache ${formatTokenCount(promptCache)}`);
	return `Stats: ${parts.join(" • ")}`;
}
const testing = { setDepsForTest(overrides) {
	subagentAnnounceOutputDeps = overrides ? {
		...defaultSubagentAnnounceOutputDeps,
		...overrides
	} : defaultSubagentAnnounceOutputDeps;
} };
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.subagentAnnounceOutputTestApi")] = testing;
//#endregion
export { deleteSubagentSessionForCleanup as C, applySubagentLaunchAuthorization as S, callSubagentGateway as _, dedupeLatestChildCompletionRows as a, getSubagentSpawnDeps as b, readSubagentOutput as c, withSubagentOutcomeTiming as d, cleanupFailedSpawnBeforeAgentStart as f, callNativeSubagentGateway as g, terminateAcceptedCollectorRun as h, captureSubagentCompletionReply as i, readSubagentTimeoutProgress as l, retrySubagentCleanup as m, buildChildCompletionFindings as n, filterCurrentDirectChildCompletionRows as o, cleanupProvisionalSession as p, buildCompactAnnounceStatsLine as r, readLatestSubagentOutputWithRetry as s, applySubagentWaitOutcome as t, waitForSubagentRunOutcome as u, readGatewayRunId as v, setSubagentSpawnDepsForTest as x, resolveSubagentAgentGatewayTimeoutMs as y };
