import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as toErrorObject } from "./error-coercion-DisD0JTb.js";
import "./src-BkwWvwB2.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { c as redactSensitiveText, n as getDefaultRedactPatterns, p as readLoggingConfig } from "./redact-Cl7lwBnl.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as sanitizeForLog } from "./ansi-DjDeieuH.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./model-ref-shared-poyRjWh_.js";
import { _ as isDefaultAgentRuntimeId, y as normalizeOptionalAgentRuntimeId } from "./openai-routing-BGuHAkXI.js";
import { t as resolveAgentHarnessPolicy } from "./policy-BHrZvZfs.js";
import { n as getRegisteredAgentHarness } from "./registry-RzPPae7_.js";
import { t as redactIdentifier } from "./redact-identifier-D3LO__f0.js";
import "./errors-wmH7Ncz4.js";
import { c as parseApiErrorInfo } from "./assistant-error-format-DYl5XHJg.js";
import { s as isLikelyContextOverflowError } from "./classify-DbL6Dp79.js";
import { r as isCliRuntimeAlias } from "./model-runtime-aliases-CAkySZhG.js";
import { r as externalCliDiscoveryForProviders } from "./external-cli-discovery-DM5kEN0f.js";
import { t as isCliProvider } from "./model-selection-cli-kgNKYbzM.js";
import { _ as MissingAgentHarnessError, a as describeFailoverError, c as isFailoverError, l as isNonProviderRuntimeCoordinationError, m as resolveModelFallbackError, n as buildFailoverRemediationHint, t as FailoverError, v as isAgentHarnessPreflightError } from "./failover-error-EKvoWJQa.js";
import { d as isAgentRunDirectAbortReason, f as isAgentRunRestartAbortReason } from "./run-termination-B0y7ra5H.js";
import { l as getApiErrorPayloadFingerprint } from "./user-copy-B4A_rZVy.js";
import { u as classifyProviderRuntimeFailureKind } from "./embedded-agent-helpers-djcKKwhg.js";
import { u as isCommandLaneTaskTimeoutError } from "./command-queue-CqN2qr5o.js";
import { n as findAgentRunTerminalOutcome } from "./agent-run-terminal-error-BLySVFXs.js";
import { t as isSandboxProvisioningError } from "./provisioning-error-Cyiculil.js";
import { r as isOpenClawAbortableWrapper } from "./abortable-DUrt_uFK.js";
import { n as isCronTerminalAbortReasonText } from "./execution-errors-CtPvpxmu.js";
import { a as runWithDeferredSessionSuspension, o as suspendSession } from "./session-suspension-C6jpx3Y4.js";
//#region src/agents/embedded-agent-error-observation.ts
/**
* Builds structured observations for embedded-agent API/text failures.
*/
const MAX_OBSERVATION_INPUT_CHARS = 64e3;
const MAX_FINGERPRINT_MESSAGE_CHARS = 8e3;
const RAW_ERROR_PREVIEW_MAX_CHARS = 400;
const PROVIDER_ERROR_PREVIEW_MAX_CHARS = 200;
const REQUEST_ID_RE = /\brequest[_ ]?id\b\s*[:=]\s*["'()]*([A-Za-z0-9._:-]+)/i;
const OBSERVATION_EXTRA_REDACT_PATTERNS = [
	String.raw`\b(?:x-)?api[-_]?key\b\s*[:=]\s*(["']?)([^\s"'\\;]+)\1`,
	String.raw`"(?:api[-_]?key|api_key)"\s*:\s*"([^"]+)"`,
	String.raw`(?:\bCookie\b\s*[:=]\s*[^;=\s]+=|;\s*[^;=\s]+=)([^;\s\r\n]+)`
];
const RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS = /* @__PURE__ */ new Set([
	"auth_html",
	"auth_refresh",
	"auth_scope",
	"upstream_html"
]);
function resolveConfiguredRedactPatterns() {
	const configured = readLoggingConfig()?.redactPatterns;
	if (!Array.isArray(configured)) return [];
	return configured.filter((pattern) => typeof pattern === "string");
}
function truncateForObservation(text, maxChars) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > maxChars ? `${truncateUtf16Safe(trimmed, maxChars)}…` : trimmed;
}
function boundObservationInput(text) {
	const trimmed = text?.trim();
	if (!trimmed) return;
	return trimmed.length > MAX_OBSERVATION_INPUT_CHARS ? truncateUtf16Safe(trimmed, MAX_OBSERVATION_INPUT_CHARS) : trimmed;
}
function replaceRequestIdPreview(text, requestId) {
	if (!text || !requestId) return text;
	return text.split(requestId).join(redactIdentifier(requestId, { len: 12 }));
}
function redactObservationText(text) {
	if (!text) return text;
	const configuredPatterns = resolveConfiguredRedactPatterns();
	return redactSensitiveText(text, {
		mode: "tools",
		patterns: [
			...getDefaultRedactPatterns(),
			...configuredPatterns,
			...OBSERVATION_EXTRA_REDACT_PATTERNS
		]
	});
}
function shouldSuppressRawErrorConsoleSuffix(providerRuntimeFailureKind) {
	return providerRuntimeFailureKind ? RAW_ERROR_CONSOLE_SUPPRESSED_FAILURE_KINDS.has(providerRuntimeFailureKind) : false;
}
function buildObservationFingerprint(params) {
	const boundedMessage = params.message && params.message.length > MAX_FINGERPRINT_MESSAGE_CHARS ? truncateUtf16Safe(params.message, MAX_FINGERPRINT_MESSAGE_CHARS) : params.message;
	const structured = params.httpCode || params.type || boundedMessage ? stableStringify({
		httpCode: params.httpCode,
		type: params.type,
		message: boundedMessage
	}) : null;
	if (structured) return structured;
	if (params.requestId) return params.raw.split(params.requestId).join("<request_id>");
	return getApiErrorPayloadFingerprint(params.raw);
}
function buildApiErrorObservationFields(rawError, opts) {
	const trimmed = boundObservationInput(rawError);
	if (!trimmed) return {};
	try {
		const parsed = parseApiErrorInfo(trimmed);
		const requestId = parsed?.requestId ?? normalizeOptionalString(trimmed.match(REQUEST_ID_RE)?.[1]);
		const requestIdHash = requestId ? redactIdentifier(requestId, { len: 12 }) : void 0;
		const rawFingerprint = buildObservationFingerprint({
			raw: trimmed,
			requestId,
			httpCode: parsed?.httpCode,
			type: parsed?.type,
			message: parsed?.message
		});
		const redactedRawPreview = replaceRequestIdPreview(redactObservationText(trimmed), requestId);
		const redactedProviderMessage = replaceRequestIdPreview(redactObservationText(parsed?.message), requestId);
		return {
			rawErrorPreview: truncateForObservation(redactedRawPreview, RAW_ERROR_PREVIEW_MAX_CHARS),
			rawErrorHash: redactIdentifier(trimmed, { len: 12 }),
			rawErrorFingerprint: rawFingerprint ? redactIdentifier(rawFingerprint, { len: 12 }) : void 0,
			httpCode: parsed?.httpCode,
			providerRuntimeFailureKind: classifyProviderRuntimeFailureKind({
				status: parsed?.httpCode ? Number(parsed.httpCode) : void 0,
				message: trimmed,
				provider: opts?.provider
			}),
			providerErrorType: parsed?.type,
			providerErrorMessagePreview: truncateForObservation(redactedProviderMessage, PROVIDER_ERROR_PREVIEW_MAX_CHARS),
			requestIdHash
		};
	} catch {
		return {};
	}
}
function buildTextObservationFields(text, opts) {
	const observed = buildApiErrorObservationFields(text, opts);
	return {
		textPreview: observed.rawErrorPreview,
		textHash: observed.rawErrorHash,
		textFingerprint: observed.rawErrorFingerprint,
		httpCode: observed.httpCode,
		providerRuntimeFailureKind: observed.providerRuntimeFailureKind,
		providerErrorType: observed.providerErrorType,
		providerErrorMessagePreview: observed.providerErrorMessagePreview,
		requestIdHash: observed.requestIdHash
	};
}
//#endregion
//#region src/agents/model-fallback-observation.ts
/**
* Structured logging for model fallback decisions. The log payload carries
* sanitized error observations plus step fields that make fallback chains
* auditable.
*/
const decisionLog = createSubsystemLogger("model-fallback").child("decision");
const AUTH_DECISION_LOG_COALESCE_WINDOW_MS = 3e4;
const AUTH_DECISION_LOG_COALESCE_MAX_ENTRIES = 100;
/** Return whether fallback decision logging is enabled for warn-level events. */
function isModelFallbackDecisionLogEnabled() {
	return decisionLog.isEnabled("warn");
}
function buildErrorObservationFields(error) {
	const observed = buildTextObservationFields(error);
	return {
		errorPreview: observed.textPreview,
		errorHash: observed.textHash,
		errorFingerprint: observed.textFingerprint,
		httpCode: observed.httpCode,
		providerErrorType: observed.providerErrorType,
		providerErrorMessagePreview: observed.providerErrorMessagePreview,
		requestIdHash: observed.requestIdHash
	};
}
const authDecisionLogCoalesceEntries = /* @__PURE__ */ new Map();
function formatModelRef(candidate) {
	return `${candidate.provider}/${candidate.model}`;
}
function readRouteOrigin(candidate) {
	return candidate.routeOrigin;
}
function readRouteResolution(candidate) {
	return candidate.routeResolution;
}
function isAuthDecisionLogCoalescingEligible(params) {
	return (params.decision === "candidate_failed" || params.decision === "skip_candidate") && (params.reason === "auth" || params.reason === "auth_permanent");
}
function buildAuthDecisionLogCoalesceKey(params, observedError) {
	return JSON.stringify([
		params.sessionId ?? params.runId,
		params.lane,
		params.requestedProvider,
		params.requestedModel,
		params.decision,
		params.candidate.provider,
		params.candidate.model,
		readRouteOrigin(params.candidate),
		readRouteResolution(params.candidate),
		params.attempt,
		params.total,
		params.reason,
		params.status,
		params.code,
		observedError.httpCode,
		observedError.providerErrorType,
		observedError.errorFingerprint ?? observedError.errorHash,
		params.nextCandidate ? formatModelRef(params.nextCandidate) : null,
		params.nextCandidate ? readRouteOrigin(params.nextCandidate) : null,
		params.nextCandidate ? readRouteResolution(params.nextCandidate) : null,
		params.isPrimary,
		params.requestedModelMatched,
		params.fallbackConfigured
	]);
}
function pruneAuthDecisionLogCoalesceEntries(now) {
	const staleBefore = now - AUTH_DECISION_LOG_COALESCE_WINDOW_MS * 2;
	for (const [key, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < staleBefore) authDecisionLogCoalesceEntries.delete(key);
}
function evictOldestAuthDecisionLogCoalesceEntry() {
	let oldestKey;
	let oldestLoggedAt = Infinity;
	for (const [key, entry] of authDecisionLogCoalesceEntries) if (entry.lastLoggedAt < oldestLoggedAt) {
		oldestLoggedAt = entry.lastLoggedAt;
		oldestKey = key;
	}
	if (oldestKey !== void 0) authDecisionLogCoalesceEntries.delete(oldestKey);
}
function rememberAuthDecisionLogCoalesceEntry(key, now) {
	if (!authDecisionLogCoalesceEntries.has(key)) {
		pruneAuthDecisionLogCoalesceEntries(now);
		if (authDecisionLogCoalesceEntries.size >= AUTH_DECISION_LOG_COALESCE_MAX_ENTRIES) evictOldestAuthDecisionLogCoalesceEntry();
	}
	authDecisionLogCoalesceEntries.set(key, {
		lastLoggedAt: now,
		suppressed: 0
	});
}
function resolveAuthDecisionLogCoalescing(params, observedError) {
	if (!isAuthDecisionLogCoalescingEligible(params)) return { shouldLog: true };
	const now = Date.now();
	const key = buildAuthDecisionLogCoalesceKey(params, observedError);
	const recent = authDecisionLogCoalesceEntries.get(key);
	const recentAgeMs = recent ? now - recent.lastLoggedAt : void 0;
	if (recent && recentAgeMs !== void 0 && recentAgeMs >= AUTH_DECISION_LOG_COALESCE_WINDOW_MS * 2) {
		authDecisionLogCoalesceEntries.delete(key);
		rememberAuthDecisionLogCoalesceEntry(key, now);
		return { shouldLog: true };
	}
	if (recent && recentAgeMs !== void 0 && recentAgeMs < AUTH_DECISION_LOG_COALESCE_WINDOW_MS) {
		recent.suppressed += 1;
		return { shouldLog: false };
	}
	const suppressedDuplicateCount = recent?.suppressed;
	rememberAuthDecisionLogCoalesceEntry(key, now);
	return {
		shouldLog: true,
		suppressedDuplicateCount
	};
}
function buildFallbackStepFields(params) {
	const lastPreviousAttempt = params.previousAttempts?.at(-1);
	if (params.decision === "candidate_succeeded") {
		if (!lastPreviousAttempt) return;
		return {
			fallbackStepType: "fallback_step",
			fallbackStepFromModel: `${lastPreviousAttempt.provider}/${lastPreviousAttempt.model}`,
			fallbackStepToModel: formatModelRef(params.candidate),
			...lastPreviousAttempt.reason ? { fallbackStepFromFailureReason: lastPreviousAttempt.reason } : {},
			...lastPreviousAttempt.error ? { fallbackStepFromFailureDetail: lastPreviousAttempt.error } : {},
			...typeof params.attempt === "number" ? { fallbackStepChainPosition: params.attempt } : {},
			fallbackStepFinalOutcome: "succeeded"
		};
	}
	const observed = buildErrorObservationFields(params.error);
	return {
		fallbackStepType: "fallback_step",
		fallbackStepFromModel: formatModelRef(params.candidate),
		...params.nextCandidate ? { fallbackStepToModel: formatModelRef(params.nextCandidate) } : {},
		...params.reason ? { fallbackStepFromFailureReason: params.reason } : {},
		...observed.providerErrorMessagePreview ?? observed.errorPreview ? { fallbackStepFromFailureDetail: observed.providerErrorMessagePreview ?? observed.errorPreview } : {},
		...typeof params.attempt === "number" ? { fallbackStepChainPosition: params.attempt } : {},
		fallbackStepFinalOutcome: params.nextCandidate ? "next_fallback" : "chain_exhausted"
	};
}
/** Log one model fallback decision and return structured fallback-step fields. */
function logModelFallbackDecision(params) {
	const nextText = params.nextCandidate ? `${sanitizeForLog(params.nextCandidate.provider)}/${sanitizeForLog(params.nextCandidate.model)}` : "none";
	const reasonText = params.reason ?? "unknown";
	const observedError = buildErrorObservationFields(params.error);
	const detailText = observedError.providerErrorMessagePreview ?? observedError.errorPreview;
	const fallbackStepFields = params.decision === "skip_candidate" || params.decision === "candidate_failed" || params.decision === "candidate_succeeded" ? buildFallbackStepFields({
		decision: params.decision,
		candidate: params.candidate,
		reason: params.reason,
		error: params.error,
		nextCandidate: params.nextCandidate,
		attempt: params.attempt,
		previousAttempts: params.previousAttempts
	}) : void 0;
	const providerErrorTypeSuffix = observedError.providerErrorType ? ` providerErrorType=${sanitizeForLog(observedError.providerErrorType)}` : "";
	const detailSuffix = detailText ? ` detail=${sanitizeForLog(detailText)}` : "";
	const logCoalescing = resolveAuthDecisionLogCoalescing(params, observedError);
	if (!logCoalescing.shouldLog) return fallbackStepFields;
	const suppressedDuplicateCount = logCoalescing.suppressedDuplicateCount ?? 0;
	const suppressedSuffix = suppressedDuplicateCount > 0 ? ` (${suppressedDuplicateCount} duplicates suppressed in last ${AUTH_DECISION_LOG_COALESCE_WINDOW_MS / 1e3}s)` : "";
	decisionLog.warn("model fallback decision", {
		event: "model_fallback_decision",
		tags: [
			"error_handling",
			"model_fallback",
			params.decision
		],
		runId: params.runId,
		sessionId: params.sessionId,
		lane: params.lane,
		decision: params.decision,
		requestedProvider: params.requestedProvider,
		requestedModel: params.requestedModel,
		candidateProvider: params.candidate.provider,
		candidateModel: params.candidate.model,
		candidateRouteOrigin: readRouteOrigin(params.candidate),
		candidateRouteResolution: readRouteResolution(params.candidate),
		attempt: params.attempt,
		total: params.total,
		reason: params.reason,
		status: params.status,
		code: params.code,
		...observedError,
		...fallbackStepFields,
		nextCandidateProvider: params.nextCandidate?.provider,
		nextCandidateModel: params.nextCandidate?.model,
		nextCandidateRouteOrigin: params.nextCandidate ? readRouteOrigin(params.nextCandidate) : void 0,
		nextCandidateRouteResolution: params.nextCandidate ? readRouteResolution(params.nextCandidate) : void 0,
		isPrimary: params.isPrimary,
		requestedModelMatched: params.requestedModelMatched,
		fallbackConfigured: params.fallbackConfigured,
		allowTransientCooldownProbe: params.allowTransientCooldownProbe,
		profileCount: params.profileCount,
		...suppressedDuplicateCount > 0 ? { suppressedDuplicateCount } : {},
		previousAttempts: params.previousAttempts?.map((attempt) => ({
			provider: attempt.provider,
			model: attempt.model,
			reason: attempt.reason,
			status: attempt.status,
			code: attempt.code,
			...buildErrorObservationFields(attempt.error)
		})),
		consoleMessage: `model fallback decision: decision=${params.decision} requested=${sanitizeForLog(params.requestedProvider)}/${sanitizeForLog(params.requestedModel)} candidate=${sanitizeForLog(params.candidate.provider)}/${sanitizeForLog(params.candidate.model)} reason=${reasonText}${providerErrorTypeSuffix} next=${nextText}${detailSuffix}${suppressedSuffix}`
	});
	return fallbackStepFields;
}
//#endregion
//#region src/agents/model-fallback-attempt.ts
/** Shared attempt, error, and harness helpers for model fallback execution. */
function isFallbackSummaryError(err) {
	return isFailoverError(err) && Array.isArray(err.attempts) && err.soonestCooldownExpiry !== void 0;
}
function isTranscriptNotContinuableError(err) {
	return Boolean(err) && typeof err === "object" && err.code === "openclaw_transcript_not_continuable";
}
function isTerminalAbortReasonString(reason) {
	return isCronTerminalAbortReasonText(reason);
}
function getErrorCauseCandidates(err) {
	const candidates = [];
	if ("cause" in err && err.cause !== void 0) {
		candidates.push(err.cause);
		if (err.cause instanceof Error && "cause" in err.cause && err.cause.cause !== void 0) candidates.push(err.cause.cause);
	}
	return candidates;
}
function isTerminalAbortCandidate(candidate) {
	if (typeof candidate === "string") return isTerminalAbortReasonString(candidate);
	if (!(candidate instanceof Error)) return false;
	return isAgentRunRestartAbortReason(candidate) || candidate.name === "TimeoutError" || candidate.name === "ClientDisconnectError" || isTerminalAbortReasonString(candidate.message);
}
function isTerminalAbort(signal) {
	if (!signal?.aborted) return false;
	const reason = signal.reason;
	return reason instanceof Error ? [reason, ...getErrorCauseCandidates(reason)].some(isTerminalAbortCandidate) : isTerminalAbortCandidate(reason);
}
function isTerminalAbortFromError(err) {
	if (!(err instanceof Error)) return false;
	if (isAgentRunRestartAbortReason(err)) return true;
	const causeCandidates = getErrorCauseCandidates(err);
	if (err.name !== "AbortError") return false;
	if (causeCandidates.some(isAgentRunRestartAbortReason)) return true;
	return isOpenClawAbortableWrapper(err) && causeCandidates.some(isTerminalAbortCandidate);
}
function isCallerAbortSignal(signal) {
	return signal?.aborted === true;
}
function isAgentRunTerminalTimeout(err) {
	return findAgentRunTerminalOutcome(err)?.status === "timeout";
}
function buildFallbackSuccess(params) {
	return {
		outcome: "completed",
		...params
	};
}
async function runFallbackCandidate(params) {
	try {
		const run = () => params.options ? params.run(params.provider, params.model, params.options) : params.run(params.provider, params.model);
		return {
			ok: true,
			result: params.deferSessionSuspension ? await runWithDeferredSessionSuspension(run, params.onDeferredSessionSuspension) : await run()
		};
	} catch (err) {
		if (params.captureHarnessPreflight && isAgentHarnessPreflightError(err)) return {
			ok: false,
			error: err
		};
		if (isAgentRunTerminalTimeout(err) || isCommandLaneTaskTimeoutError(err) || isAgentHarnessPreflightError(err) || isSandboxProvisioningError(err)) throw err;
		const fallbackError = resolveModelFallbackError(err, {
			provider: params.provider,
			model: params.model,
			sessionId: params.attribution?.sessionId,
			lane: params.attribution?.lane
		});
		if (fallbackError.kind === "coordination" || isTerminalAbort(params.abortSignal) || isCallerAbortSignal(params.abortSignal) || isAgentRunDirectAbortReason(err) || isAgentRunRestartAbortReason(err) || isTerminalAbortFromError(err)) throw err;
		return {
			ok: false,
			error: fallbackError.kind === "failover" ? fallbackError.error : err
		};
	}
}
async function runFallbackAttempt(params) {
	const runResult = await runFallbackCandidate(params);
	if (!runResult.ok) return { error: runResult.error };
	const classification = await params.classifyResult?.({
		result: runResult.result,
		provider: params.provider,
		model: params.model,
		attempt: params.attempt,
		total: params.total
	});
	const classifiedError = resolveResultClassificationError(classification, params);
	if (!classifiedError) return { success: buildFallbackSuccess({
		result: runResult.result,
		provider: params.provider,
		model: params.model,
		attempts: params.attempts
	}) };
	if (isTerminalAbort(params.abortSignal) || isCallerAbortSignal(params.abortSignal)) throw toErrorObject(classifiedError, "Non-Error thrown");
	const preserveResultOnExhaustion = classification && "preserveResultOnExhaustion" in classification && classification.preserveResultOnExhaustion === true;
	return {
		error: classifiedError,
		classifiedResult: {
			result: runResult.result,
			provider: params.provider,
			model: params.model
		},
		...preserveResultOnExhaustion ? { exhaustionResult: {
			result: runResult.result,
			provider: params.provider,
			model: params.model,
			priority: typeof classification.preserveResultPriority === "number" && Number.isFinite(classification.preserveResultPriority) ? classification.preserveResultPriority : 0
		} } : {}
	};
}
function resolveResultClassificationError(classification, params) {
	if (!classification) return null;
	if ("error" in classification) return classification.error;
	const message = normalizeOptionalString(classification.message);
	return message ? new FailoverError(message, {
		reason: classification.reason ?? "unknown",
		provider: params.provider,
		model: params.model,
		sessionId: params.attribution?.sessionId,
		lane: params.attribution?.lane,
		status: classification.status,
		code: classification.code,
		rawError: classification.rawError
	}) : null;
}
function sameModelCandidate(a, b) {
	return a.provider === b.provider && a.model === b.model;
}
function resolveNextFallbackCandidateIndex(params) {
	for (let index = params.currentIndex + 1; index < params.candidates.length; index += 1) {
		const candidate = params.candidates[index];
		if (candidate && !params.excludedProviders.has(candidate.provider)) return index;
	}
	return params.candidates.length;
}
function isCliAgentRuntime(runtime, cfg) {
	const normalized = normalizeOptionalString(runtime);
	if (!normalized) return false;
	return isCliRuntimeAlias(normalized) || isCliProvider(normalized, cfg);
}
async function resolveModelFallbackCandidateHarnessAuthPrecheck(params) {
	const { agentHarnessRuntimeOverride, explicitAgentRuntime, runtime, runtimeSource } = resolveModelFallbackCandidateAgentRuntime(params);
	const result = (skipsProviderAuthCooldown) => ({
		skipsProviderAuthCooldown,
		agentHarnessRuntimeOverride,
		runtime,
		laneEligible: !params.requiredAgentHarnessId || runtime === params.requiredAgentHarnessId
	});
	if (params.requiredAgentHarnessId && runtime !== params.requiredAgentHarnessId) return result(false);
	if (!params.cfg) return result(false);
	if (!explicitAgentRuntime && isCliProvider(params.provider, params.cfg)) return result(true);
	if (!runtime) return result(false);
	if (runtime === "openclaw" || runtime === "auto" || runtime === "codex" && runtimeSource === "implicit") return result(false);
	await params.prepareAgentHarnessRuntime?.({
		provider: params.provider,
		model: params.model,
		agentHarnessRuntimeOverride
	});
	if (getRegisteredAgentHarness(runtime)) return result(true);
	if (isCliAgentRuntime(runtime, params.cfg)) return result(true);
	throw new MissingAgentHarnessError(runtime);
}
function resolveModelFallbackCandidateAgentRuntime(params) {
	const agentHarnessRuntimeOverride = params.resolveAgentHarnessRuntimeOverride?.(params.provider, params.model);
	const agentRuntimeOverride = normalizeOptionalAgentRuntimeId(agentHarnessRuntimeOverride);
	const explicitAgentRuntime = agentRuntimeOverride && !isDefaultAgentRuntimeId(agentRuntimeOverride) ? agentRuntimeOverride : void 0;
	if (!params.cfg) return {
		agentHarnessRuntimeOverride,
		explicitAgentRuntime,
		runtime: explicitAgentRuntime
	};
	const harnessPolicy = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.cfg,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	return {
		agentHarnessRuntimeOverride,
		explicitAgentRuntime,
		runtime: explicitAgentRuntime ?? harnessPolicy.runtime,
		runtimeSource: explicitAgentRuntime ? "model" : harnessPolicy.runtimeSource
	};
}
function resolveCandidateAttemptError(described, candidate) {
	if (described.rawError && (!described.provider || described.provider === candidate.provider && (!described.model || described.model === candidate.model))) return described.rawError;
	return described.message;
}
function recordFailedCandidateAttempt(params) {
	const described = describeFailoverError(params.error);
	const error = resolveCandidateAttemptError(described, params.candidate);
	params.attempts.push({
		provider: params.candidate.provider,
		model: params.candidate.model,
		error,
		reason: described.reason ?? "unknown",
		authMode: described.authMode,
		status: described.status,
		code: described.code
	});
	return logModelFallbackDecision({
		decision: "candidate_failed",
		runId: params.runId,
		sessionId: params.sessionId,
		lane: params.lane,
		requestedProvider: params.requestedProvider ?? params.candidate.provider,
		requestedModel: params.requestedModel ?? params.candidate.model,
		candidate: params.candidate,
		attempt: params.attempt,
		total: params.total,
		reason: described.reason,
		status: described.status,
		code: described.code,
		error,
		nextCandidate: params.nextCandidate,
		isPrimary: params.isPrimary,
		requestedModelMatched: params.requestedModelMatched,
		fallbackConfigured: params.fallbackConfigured
	});
}
function appendFailedCandidateAttempt(params) {
	const described = describeFailoverError(params.error);
	params.attempts.push({
		provider: params.candidate.provider,
		model: params.candidate.model,
		error: resolveCandidateAttemptError(described, params.candidate),
		reason: described.reason ?? "unknown",
		authMode: described.authMode,
		status: described.status,
		code: described.code
	});
}
function findLiveSessionModelSwitchRedirectIndex(params) {
	const targetKey = modelKey(params.error.provider, params.error.model);
	for (const [offset, candidate] of params.candidates.slice(params.currentIndex + 1).entries()) if (modelKey(candidate.provider, candidate.model) === targetKey) return params.currentIndex + 1 + offset;
	return null;
}
function hasDifferentLiveSessionRuntimeSelection(params) {
	const normalizeRuntime = (runtime) => {
		const normalized = normalizeOptionalAgentRuntimeId(runtime);
		return normalized && !isDefaultAgentRuntimeId(normalized) ? normalized : void 0;
	};
	return normalizeRuntime(params.currentAgentHarnessRuntimeOverride) !== normalizeRuntime(params.error.agentRuntimeOverride);
}
function throwFallbackFailureSummary(params) {
	if (params.attempts.length <= 1 && params.lastError) throw toErrorObject(params.lastError, "Non-Error thrown");
	if (params.attribution?.sessionId) suspendSession({
		cfg: params.cfg,
		agentId: params.agentId,
		agentDir: params.agentDir,
		sessionId: params.attribution.sessionId,
		reason: "circuit_open",
		failedProvider: params.attempts.at(-1)?.provider ?? "unknown",
		failedModel: params.attempts.at(-1)?.model ?? "unknown"
	});
	const summary = params.attempts.length > 0 ? params.attempts.map(params.formatAttempt).join(" | ") : "unknown";
	const remediation = buildFailoverRemediationHint(params.lastError);
	const message = remediation ? `All ${params.label} failed (${params.attempts.length || params.candidates.length}): ${summary}. ${remediation}` : `All ${params.label} failed (${params.attempts.length || params.candidates.length}): ${summary}`;
	const attempts = params.attempts.map((attempt) => ({
		...attempt,
		reason: attempt.reason ?? "unknown"
	}));
	const lastAttempt = attempts.at(-1);
	throw new FailoverError(message, {
		reason: lastAttempt?.reason ?? "unknown",
		provider: lastAttempt?.provider,
		model: lastAttempt?.model,
		status: lastAttempt?.status,
		code: lastAttempt?.code,
		cause: params.lastError instanceof Error ? params.lastError : void 0,
		sessionId: params.attribution?.sessionId,
		lane: params.attribution?.lane,
		attempts,
		soonestCooldownExpiry: params.soonestCooldownExpiry ?? null
	});
}
function resolveFallbackSoonestCooldownExpiry(params) {
	if (!params.authRuntime || !params.authStore) return null;
	const refreshedStore = params.authRuntime.loadAuthProfileStoreForRuntime(params.agentDir, {
		readOnly: true,
		externalCli: externalCliDiscoveryForProviders({
			cfg: params.cfg,
			providers: params.candidates.map((candidate) => candidate.provider)
		})
	});
	let soonest = null;
	for (const candidate of params.candidates) {
		const ids = params.authRuntime.resolveAuthProfileOrder({
			cfg: params.cfg,
			store: refreshedStore,
			provider: candidate.provider
		});
		const candidateSoonest = params.authRuntime.getSoonestCooldownExpiry(refreshedStore, ids, { forModel: candidate.model });
		if (typeof candidateSoonest === "number" && Number.isFinite(candidateSoonest) && (soonest === null || candidateSoonest < soonest)) soonest = candidateSoonest;
	}
	return soonest;
}
function shouldDiscardDeferredSessionSuspension(params) {
	return isTerminalAbort(params.abortSignal) || isCallerAbortSignal(params.abortSignal) || isAgentRunTerminalTimeout(params.error) || isAgentRunDirectAbortReason(params.error) || isAgentRunRestartAbortReason(params.error) || isTerminalAbortFromError(params.error) || isCommandLaneTaskTimeoutError(params.error) || isNonProviderRuntimeCoordinationError(params.error) || isTranscriptNotContinuableError(params.error) || isLikelyContextOverflowError(formatErrorMessage(params.error));
}
//#endregion
export { buildApiErrorObservationFields as _, isTranscriptNotContinuableError as a, resolveModelFallbackCandidateAgentRuntime as c, runFallbackAttempt as d, sameModelCandidate as f, logModelFallbackDecision as g, isModelFallbackDecisionLogEnabled as h, isFallbackSummaryError as i, resolveModelFallbackCandidateHarnessAuthPrecheck as l, throwFallbackFailureSummary as m, findLiveSessionModelSwitchRedirectIndex as n, recordFailedCandidateAttempt as o, shouldDiscardDeferredSessionSuspension as p, hasDifferentLiveSessionRuntimeSelection as r, resolveFallbackSoonestCooldownExpiry as s, appendFailedCandidateAttempt as t, resolveNextFallbackCandidateIndex as u, buildTextObservationFields as v, shouldSuppressRawErrorConsoleSuffix as y };
