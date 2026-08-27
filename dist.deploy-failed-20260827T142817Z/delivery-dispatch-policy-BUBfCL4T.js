import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { t as isFastTestRuntimeEnv } from "./test-runtime-env-DQDRzsLt.js";
import "./env-y-_yRnBE.js";
import { s as sleepWithAbort } from "./src-BQ327IOM.js";
import { c as stripLeadingSilentToken, l as stripSilentToken, n as SILENT_REPLY_TOKEN, s as startsWithSilentToken } from "./tokens-CMI0yx54.js";
import { t as retryAsync } from "./retry-DIUON3ys.js";
import { r as shouldAttemptTtsPayload } from "./tts-config-6u-Ce5AG.js";
import { p as stringifyRouteThreadId } from "./channel-route-BRTlwR_x.js";
import "./backoff-BkMI1WEL.js";
import { i as findPlatformMessageRejectedError, s as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-BBO0H6XC.js";
import { a as normalizeTargetForProvider } from "./target-normalization-CLQX3U0l.js";
import { a as getDeliveryQueueEntryStatus, c as loadDeliveryQueueEntry } from "./delivery-queue-sqlite-CLvxFObU.js";
import { a as OUTBOUND_DELIVERY_QUEUE_NAME } from "./delivery-queue-media-staging-N2a2dlUZ.js";
import { n as isSuppressedControlReplyText } from "./control-reply-text-BXkKqW89.js";
import { s as hasScheduledNextRunAtMs } from "./jobs-scheduling-B85KOk2V.js";
import { t as createCronExecutionId } from "./run-id-kGde0n7U.js";
//#region src/cron/isolated-agent/delivery-dispatch-policy.ts
const DIRECT_CRON_DELIVERY_COMPLETION_RETENTION = {
	idPrefix: "cron-direct-delivery:v1:",
	maxAgeMs: 1440 * 6e4,
	maxEntries: 2e3
};
function normalizeDeliveryTarget(channel, to) {
	const toTrimmed = to.trim();
	return normalizeTargetForProvider(channel, toTrimmed) ?? toTrimmed;
}
function normalizeSilentReplyText(text) {
	if (!text) return {
		text,
		strippedTrailingSilentToken: false
	};
	if (isSuppressedControlReplyText(text)) return {
		text: void 0,
		strippedTrailingSilentToken: false
	};
	let next = text;
	const hasLeadingSilentToken = startsWithSilentToken(next, SILENT_REPLY_TOKEN);
	if (hasLeadingSilentToken) next = stripLeadingSilentToken(next, SILENT_REPLY_TOKEN);
	let strippedTrailingSilentToken = false;
	if (hasLeadingSilentToken || next.toLowerCase().includes("NO_REPLY".toLowerCase())) {
		const trimmedBefore = next.trim();
		const stripped = stripSilentToken(next, SILENT_REPLY_TOKEN);
		strippedTrailingSilentToken = stripped !== trimmedBefore;
		next = stripped;
	}
	if (!next.trim() || isSuppressedControlReplyText(next)) return {
		text: void 0,
		strippedTrailingSilentToken
	};
	return {
		text: next,
		strippedTrailingSilentToken
	};
}
/** Returns whether cron delivery should tolerate per-payload send failures. */
function resolveCronDeliveryBestEffort(job) {
	return job.delivery?.bestEffort === true;
}
/** Successful delivery-target resolution consumed by announce/direct delivery dispatch. */
const PERMANENT_DIRECT_CRON_DELIVERY_ERROR_PATTERNS = [
	/unsupported channel/i,
	/unknown channel/i,
	/chat not found/i,
	/user not found/i,
	/bot.*not.*member/i,
	/bot was blocked by the user/i,
	/forbidden: bot was kicked/i,
	/recipient is not a valid/i,
	/outbound not configured for channel/i
];
const STALE_CRON_DELIVERY_MAX_START_DELAY_MS = 180 * 6e4;
const deliveryLoggerRuntimeLoader = createLazyImportLoader(() => import("./delivery-logger.runtime.js"));
const ttsRuntimeLoader = createLazyImportLoader(() => import("./tts.runtime.js"));
const deliverySubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./delivery-subagent-registry.runtime.js"));
async function loadDeliverySubagentRegistryRuntime() {
	return await deliverySubagentRegistryRuntimeLoader.load();
}
async function logCronDeliveryWarn(message) {
	const { logWarn } = await deliveryLoggerRuntimeLoader.load();
	logWarn(message);
}
async function logCronDeliveryError(message) {
	const { logError } = await deliveryLoggerRuntimeLoader.load();
	logError(message);
}
function logCronDeliveryErrorDeferred(message) {
	deliveryLoggerRuntimeLoader.load().then(({ logError }) => {
		logError(message);
	});
}
function resolveCronDeliveryScheduledAtMs(params) {
	const scheduledAt = params.job.state?.nextRunAtMs;
	return hasScheduledNextRunAtMs(scheduledAt) ? scheduledAt : params.runStartedAt;
}
function resolveCronDeliveryStartDelayMs(params) {
	return params.runStartedAt - resolveCronDeliveryScheduledAtMs(params);
}
function isStaleCronDelivery(params) {
	return resolveCronDeliveryStartDelayMs(params) > STALE_CRON_DELIVERY_MAX_START_DELAY_MS;
}
async function maybeApplyTtsToCronPayloads(params) {
	if (!shouldAttemptTtsPayload({
		cfg: params.cfg,
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		channelId: params.delivery.channel,
		accountId: params.delivery.accountId
	})) return params.payloads;
	const { maybeApplyTtsToPayload } = await ttsRuntimeLoader.load();
	return await Promise.all(params.payloads.map((payload) => maybeApplyTtsToPayload({
		payload,
		cfg: params.cfg,
		channel: params.delivery.channel,
		kind: "final",
		ttsAuto: params.ttsAuto,
		agentId: params.agentId,
		accountId: params.delivery.accountId
	})));
}
function buildDirectCronDeliveryIdempotencyKey(params) {
	const executionId = createCronExecutionId(params.jobId, params.runStartedAt);
	const threadId = params.delivery.threadId == null || params.delivery.threadId === "" ? "" : stringifyRouteThreadId(params.delivery.threadId) ?? "";
	const accountId = params.delivery.accountId?.trim() ?? "";
	const normalizedTo = normalizeDeliveryTarget(params.delivery.channel, params.delivery.to);
	const routeIdentity = [
		params.delivery.channel,
		accountId,
		normalizedTo,
		threadId
	].map(encodeURIComponent).join(":");
	return `${DIRECT_CRON_DELIVERY_COMPLETION_RETENTION.idPrefix}${executionId}:${routeIdentity}`;
}
/** Receipts own recipient delivery; projections never stand in for custody. */
function isCompletedDirectCronDelivery(id) {
	return getDeliveryQueueEntryStatus(OUTBOUND_DELIVERY_QUEUE_NAME, id) === "completed";
}
/** Wait only for an active recipient owner, never for crashed ambiguous sends. */
async function waitForCompletedDirectCronDelivery(params) {
	for (let attempt = 0; attempt < 120; attempt += 1) {
		const status = getDeliveryQueueEntryStatus(OUTBOUND_DELIVERY_QUEUE_NAME, params.id);
		if (status === "completed") return true;
		const owner = status === "pending" ? loadDeliveryQueueEntry(OUTBOUND_DELIVERY_QUEUE_NAME, params.id) : null;
		if (!owner && status === "pending") return isCompletedDirectCronDelivery(params.id);
		if (!owner || (owner.recoveryState === "send_attempt_started" ? typeof owner.platformSendStartedAt !== "number" || owner.platformSendStartedAt <= Date.now() - 3e4 : owner.recoveryState !== "producer_claimed" || typeof owner.availableAt !== "number" || owner.availableAt <= Date.now())) return false;
		if (attempt < 119) await sleepWithAbort(250, params.signal);
	}
	return false;
}
function summarizeDirectCronDeliveryError(error) {
	if (error instanceof Error) return error.message || "error";
	if (typeof error === "string") return error;
	try {
		return JSON.stringify(error) || String(error);
	} catch {
		return String(error);
	}
}
function isTransientDirectCronDeliveryError(error) {
	if (findPlatformMessageRejectedError(error)) return false;
	const message = summarizeDirectCronDeliveryError(error);
	if (!message) return false;
	if (PERMANENT_DIRECT_CRON_DELIVERY_ERROR_PATTERNS.some((re) => re.test(message))) return false;
	return isProvenDeliveryNotSentError(error);
}
function resolveDirectCronRetryDelaysMs() {
	return isFastTestRuntimeEnv() ? [
		0,
		0,
		0
	] : [
		5e3,
		1e4,
		2e4
	];
}
async function retryTransientDirectCronDelivery(params) {
	const retryDelaysMs = resolveDirectCronRetryDelaysMs();
	const assertActive = () => {
		if (params.signal?.aborted) throw new Error("cron delivery aborted");
		if (params.deadlineAtMs !== void 0 && Date.now() >= params.deadlineAtMs) {
			const error = /* @__PURE__ */ new Error("cron delivery deadline exceeded");
			error.name = "TimeoutError";
			throw error;
		}
	};
	assertActive();
	const runWithAbortCheck = async () => {
		assertActive();
		return await params.run();
	};
	return await retryAsync(runWithAbortCheck, {
		attempts: retryDelaysMs.length + 1,
		minDelayMs: 0,
		maxDelayMs: Math.max(...retryDelaysMs),
		delayMs: ({ attempt }) => retryDelaysMs[attempt - 1] ?? 0,
		shouldRetry: (err) => params.signal?.aborted !== true && (params.deadlineAtMs === void 0 || Date.now() < params.deadlineAtMs) && isTransientDirectCronDeliveryError(err) && (params.shouldRetryError?.(err) ?? true),
		onRetry: async ({ attempt, maxAttempts, delayMs, err }) => {
			await logCronDeliveryWarn(`[cron:${params.jobId}] transient ${params.label ?? "direct announce"} delivery failure, retrying ${attempt + 1}/${maxAttempts} in ${Math.round(delayMs / 1e3)}s: ${summarizeDirectCronDeliveryError(err)}`);
			if (delayMs === 0) await sleepWithAbort(0, params.signal);
		},
		sleep: async (delayMs) => {
			const remainingMs = params.deadlineAtMs === void 0 ? delayMs : Math.max(0, params.deadlineAtMs - Date.now());
			await sleepWithAbort(Math.min(delayMs, remainingMs), params.signal);
			assertActive();
		}
	});
}
//#endregion
export { loadDeliverySubagentRegistryRuntime as a, logCronDeliveryWarn as c, normalizeSilentReplyText as d, resolveCronDeliveryBestEffort as f, waitForCompletedDirectCronDelivery as g, retryTransientDirectCronDelivery as h, isStaleCronDelivery as i, maybeApplyTtsToCronPayloads as l, resolveCronDeliveryStartDelayMs as m, buildDirectCronDeliveryIdempotencyKey as n, logCronDeliveryError as o, resolveCronDeliveryScheduledAtMs as p, isCompletedDirectCronDelivery as r, logCronDeliveryErrorDeferred as s, DIRECT_CRON_DELIVERY_COMPLETION_RETENTION as t, normalizeDeliveryTarget as u };
