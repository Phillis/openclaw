import { n as isTransientNetworkError } from "./retryable-network-errors-cvh3iRtf.js";
import { i as extractProviderWrappedHttpStatus, n as extractErrorHttpStatus, r as extractLeadingHttpStatus } from "./assistant-error-format-DYl5XHJg.js";
import { h as INCOMPLETE_ASSISTANT_STREAM_RE, n as classifyFailoverSignal } from "./classify-DkuNrlYG.js";
import milliseconds from "ms";
import { parseRetryAfterHttpDateMs } from "@openclaw/ai/internal/retry-after";
//#region packages/llm-core/src/types.ts
/** Stable error codes for provider outcomes that cannot be replayed safely. */
const PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE = "PROVIDER_POST_DISPATCH_AMBIGUITY";
const PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE = "PROVIDER_FAILURE_WITH_OUTPUT";
//#endregion
//#region src/agents/failover/retry-evidence.ts
const RETRYABLE_HTTP_STATUS_CODES = /* @__PURE__ */ new Set([
	429,
	500,
	502,
	503,
	504,
	524
]);
const RATE_LIMIT_RETRY_CONTEXT_RE = /rate.?limit|too many requests|resource[_ -]?exhausted|daily (?:request|usage) limit|requests? per day|tokens? per day|quota[_ -]?exceeded/i;
const TRANSIENT_RETRY_EVIDENCE_RE = /overloaded|rate.?limit|too many requests|service.?unavailable|server.?error|internal.?error|provider.?returned.?error|network.?error|connection.?error|connection.?refused|connection.?lost|other side closed|fetch failed|upstream.?connect|reset before headers|socket hang up|socket connection was closed|timed? out|timeout|terminated|websocket.?closed|websocket.?error|ended without|http2 request did not get a response|retry delay|you can retry your request|try your request again|please retry your request|resource[_ -]?exhausted/i;
const LONG_WINDOW_RATE_LIMIT_RE = /\b(?:daily|weekly|monthly|tokens per day|requests per day|usage limit|subscription|insufficient[_ -]?quota|current quota|quota[_ -]?exceeded|(?:go|free)usagelimiterror|available balance|out of budget)\b/i;
const SHORT_RATE_LIMIT_UNIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm)\b/i;
const SHORT_WINDOW_RATE_LIMIT_RE = /\b(?:requests per minute|tokens per minute|per-minute|rpm|tpm|model_cooldown)\b|请求过于频繁|调用频率|频率限制/i;
const RETRY_AFTER_VALUE_RE = /\bretry[- ]after\b\s*:?\s*(?:in\s*)?([^\r\n;]+)/i;
const RETRY_AFTER_NUMBER_RE = /^(\d+(?:\.\d+)?)\s*([a-z]+)?\b/i;
const MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS = 60;
/** Extract guarded HTTP status evidence for retry and diagnostic consumers. */
function extractFailoverHttpStatus(message, options) {
	if (!message) return;
	return (options?.includeLabeledStatus ? extractErrorHttpStatus(message) : extractLeadingHttpStatus(message.trim()) ?? extractProviderWrappedHttpStatus(message.trim()))?.code;
}
function resolveRetrySignalStatus(signal) {
	return signal.status ?? extractFailoverHttpStatus(signal.message);
}
/** Narrow evidence that replaying the same assistant request may succeed within this session. */
function hasTransientRetryEvidence(signal) {
	const status = resolveRetrySignalStatus(signal);
	return status !== void 0 && RETRYABLE_HTTP_STATUS_CODES.has(status) || INCOMPLETE_ASSISTANT_STREAM_RE.test(signal.message ?? "") || TRANSIENT_RETRY_EVIDENCE_RE.test(signal.message ?? "") || isTransientNetworkError({ code: signal.code });
}
function hasRateLimitRetryContext(signal) {
	return resolveRetrySignalStatus(signal) === 429 || RATE_LIMIT_RETRY_CONTEXT_RE.test(signal.message ?? "");
}
function parseRetryAfterSeconds(valueText, nowMs) {
	const secondsMatch = RETRY_AFTER_NUMBER_RE.exec(valueText);
	if (secondsMatch?.[1]) {
		const value = Number(secondsMatch[1]);
		if (!Number.isFinite(value) || value < 0) return;
		const unit = secondsMatch[2]?.toLowerCase();
		if (unit && !/^(?:milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d)$/.test(unit)) return;
		const unitMilliseconds = milliseconds(`1${unit ?? "s"}`);
		return unitMilliseconds === 1 ? value / 1e3 : value * (unitMilliseconds / 1e3);
	}
	const retryAtMs = parseRetryAfterHttpDateMs(valueText, nowMs);
	return retryAtMs === void 0 ? void 0 : Math.max(0, (retryAtMs - nowMs) / 1e3);
}
/** Classify provider rate-limit text without deciding a caller's retry policy. */
function classifyRateLimitWindow(message, nowMs = Date.now()) {
	const raw = message?.trim();
	if (!raw) return { kind: "unknown" };
	const hasShortRateLimitUnit = SHORT_RATE_LIMIT_UNIT_RE.test(raw);
	const retryAfterValue = RETRY_AFTER_VALUE_RE.exec(raw)?.[1]?.trim();
	const retryAfterSeconds = retryAfterValue ? parseRetryAfterSeconds(retryAfterValue, nowMs) : void 0;
	if (retryAfterSeconds !== void 0) return retryAfterSeconds > MAX_SHORT_WINDOW_RETRY_AFTER_SECONDS ? { kind: "long" } : {
		kind: "short",
		retryAfterSeconds
	};
	if (retryAfterValue && !hasShortRateLimitUnit) return { kind: "long" };
	if (LONG_WINDOW_RATE_LIMIT_RE.test(raw) && !hasShortRateLimitUnit) return { kind: "long" };
	if (SHORT_WINDOW_RATE_LIMIT_RE.test(raw) || extractLeadingHttpStatus(raw)?.code === 429) return { kind: "short" };
	return { kind: "unknown" };
}
/** Apply the intra-attempt replay policy to one already-classified failover signal. */
function shouldRetryFailoverSignal(params) {
	if (!params.hasTransientEvidence) return false;
	const reason = params.classification?.kind === "reason" ? params.classification.reason : void 0;
	if (classifyRateLimitWindow(params.signal.message).kind === "long" && (reason === "billing" || reason === "rate_limit" || hasRateLimitRetryContext(params.signal))) return false;
	return true;
}
//#endregion
//#region src/llm/utils/retry.ts
const REPLAY_UNSAFE_ASSISTANT_ERROR_CODES = /* @__PURE__ */ new Set([PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE, PROVIDER_POST_DISPATCH_AMBIGUITY_ERROR_CODE]);
/** True when replaying the failed assistant request could duplicate unknown provider output. */
function isReplayUnsafeAssistantError(message) {
	return Boolean(message?.errorCode && REPLAY_UNSAFE_ASSISTANT_ERROR_CODES.has(message.errorCode));
}
/** Classify transient provider/transport failures for outer retry policy. */
function isRetryableAssistantError(message) {
	if (message.stopReason !== "error" || !message.errorMessage || isReplayUnsafeAssistantError(message)) return false;
	const errorMessage = message.errorMessage.trim();
	const status = extractFailoverHttpStatus(errorMessage);
	const signal = {
		message: errorMessage,
		provider: message.provider,
		code: message.errorCode,
		errorType: message.errorType,
		...status === void 0 ? {} : { status }
	};
	return shouldRetryFailoverSignal({
		classification: classifyFailoverSignal(signal),
		hasTransientEvidence: hasTransientRetryEvidence(signal),
		signal
	});
}
//#endregion
export { extractFailoverHttpStatus as i, isRetryableAssistantError as n, classifyRateLimitWindow as r, isReplayUnsafeAssistantError as t };
