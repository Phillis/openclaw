import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { a as resolveRetryConfig, s as sleepWithAbort } from "./src-BQ327IOM.js";
import { a as readErrorName, n as extractErrorCode, r as formatErrorMessage, t as collectErrorGraphCandidates } from "./errors-CSNUPl5U.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-C4xi4B3U.js";
import { t as classifyTransientNetworkErrorCode } from "./retry-runtime-ELyDVNAC.js";
import { _ as RateLimitError } from "./discord-BinpTEur.js";
//#region extensions/discord/src/retry.ts
const DISCORD_RETRY_DEFAULTS = {
	attempts: 3,
	minDelayMs: 500,
	maxDelayMs: 3e4,
	jitter: .1
};
const DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS = 2;
const DISCORD_TRANSIENT_MESSAGE_RE = /\b(?:bad gateway|fetch failed|network error|networkerror|service unavailable|socket hang up|temporarily unavailable|timed out|timeout)\b|connection (?:closed|reset|refused)/i;
const ambiguousDiscordMessageCreates = /* @__PURE__ */ new WeakSet();
function readDiscordErrorStatus(err) {
	if (!err || typeof err !== "object") return;
	return parseStrictNonNegativeInteger("status" in err && err.status !== void 0 ? err.status : "statusCode" in err && err.statusCode !== void 0 ? err.statusCode : void 0);
}
function classifyDiscordDeliveryFailure(error) {
	const candidates = collectErrorGraphCandidates(error, (current) => [current.cause, current.error]);
	for (const candidate of candidates) {
		const status = readDiscordErrorStatus(candidate);
		if (status !== void 0) {
			if (status === 408 || status >= 500) return "ambiguous";
			if (status >= 400) return "rejected";
		}
	}
	if (candidates.some((candidate) => readErrorName(candidate) === "AbortError" || classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "ambiguous")) return "ambiguous";
	if (candidates.some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) === "pre-connect")) return "pre-connect";
	return candidates.some((candidate) => (candidate instanceof Error || candidate !== null && typeof candidate === "object") && DISCORD_TRANSIENT_MESSAGE_RE.test(formatErrorMessage(candidate))) ? "ambiguous" : "unknown";
}
function recordDiscordMessageCreateAmbiguity(error) {
	if (error !== null && typeof error === "object") ambiguousDiscordMessageCreates.add(error);
}
function hasDiscordMessageCreateAmbiguity(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => candidate !== null && typeof candidate === "object" && ambiguousDiscordMessageCreates.has(candidate));
}
function hasDiscordRateLimitRejection(error) {
	return error instanceof RateLimitError || collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).some((candidate) => readDiscordErrorStatus(candidate) === 429);
}
function isRetryableDiscordTransientError(error) {
	const failure = classifyDiscordDeliveryFailure(error);
	return failure === "ambiguous" || failure === "pre-connect" || hasDiscordRateLimitRejection(error);
}
function isRetryableDiscordPreConnectError(error) {
	const failure = classifyDiscordDeliveryFailure(error);
	return failure === "pre-connect" || failure === "rejected" && hasDiscordRateLimitRejection(error);
}
function resolveDiscordRetryPredicate(safety) {
	return safety === "non-idempotent-create" ? isRetryableDiscordPreConnectError : isRetryableDiscordTransientError;
}
function isRetryableDiscordGatewayTransportError(err) {
	if (!isRetryableDiscordTransientError(err) || err instanceof RateLimitError) return false;
	return !collectErrorGraphCandidates(err, (current) => [current.cause, current.error]).some((candidate) => readDiscordErrorStatus(candidate) !== void 0);
}
function createDiscordRetryRunner(params) {
	const retryConfig = resolveRetryConfig(DISCORD_RETRY_DEFAULTS, params.retry);
	const attempts = retryConfig.attempts > 1 ? retryConfig.attempts + DISCORD_GATEWAY_RECONNECT_EXTRA_ATTEMPTS : retryConfig.attempts;
	return (fn, label, options) => {
		const isRetryable = resolveDiscordRetryPredicate(options?.safety ?? "idempotent");
		let observedGatewayDisconnect = false;
		const runRequest = async () => {
			if (params.signal?.aborted) throw params.signal.reason instanceof Error ? params.signal.reason : /* @__PURE__ */ new Error("Discord request aborted");
			observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
			try {
				return await fn();
			} catch (err) {
				observedGatewayDisconnect ||= params.isGatewayDisconnected?.() === true;
				throw err;
			}
		};
		const shouldRetry = (err, attempt) => isRetryable(err) && (attempt < retryConfig.attempts || observedGatewayDisconnect && isRetryableDiscordGatewayTransportError(err));
		const retryAfterMs = (err) => err instanceof RateLimitError ? err.retryAfter * 1e3 : void 0;
		const signal = params.signal;
		if (signal) return retryAsync(runRequest, {
			...retryConfig,
			attempts,
			label,
			shouldRetry,
			retryAfterMs,
			sleep: async (delayMs) => {
				try {
					await sleepWithAbort(delayMs, signal);
				} catch (error) {
					throw signal.aborted && signal.reason instanceof Error ? signal.reason : error;
				}
			}
		});
		return createChannelApiRetryRunner({
			retry: {
				...retryConfig,
				attempts
			},
			shouldRetry,
			strictShouldRetry: true,
			retryAfterMs,
			verbose: params.verbose
		})(runRequest, label);
	};
}
//#endregion
export { recordDiscordMessageCreateAmbiguity as i, createDiscordRetryRunner as n, hasDiscordMessageCreateAmbiguity as r, classifyDiscordDeliveryFailure as t };
