import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { c as parseAgentSessionKey, f as parseThreadSessionSuffix, i as isCronSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { o as resolveSessionStorePathCore } from "./paths-B2oibYbs.js";
import { o as isSilentReplyText } from "./tokens-CMI0yx54.js";
import { i as copyReplyPayloadMetadata } from "./reply-payload-DVcGHORx.js";
import { p as stringifyRouteThreadId } from "./channel-route-BRTlwR_x.js";
import { o as isAudioFileName } from "./mime-Hm4eS2i0.js";
import { n as canonicalizeMainSessionAlias, r as resolveAgentMainSessionKey } from "./main-session-er-Gn_t_.js";
import { z as beginSessionWorkAdmission } from "./agent-harness-session-key-BMj1lPtX.js";
import { o as withSystemEventOwner } from "./system-event-ownership-BACexIXt.js";
import { n as stripOutboundTargetKindPrefix, r as stripTargetProviderPrefix } from "./channel-target-prefix-DCp3_j8g.js";
import { s as resolveSessionWorkStartError } from "./lifecycle-BOW0O5mU.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-DxrLtJZQ.js";
import { o as hasReplyPayloadContent } from "./payload-ByplrRCQ.js";
import { s as projectOutboundPayloadPlanForMirror, t as createOutboundPayloadPlan } from "./payloads-YIMlWZ2P.js";
import "./inbound.runtime-CHPMAfjg.js";
import { t as loadCronSessionEntryLatest } from "./session-DG3Q0V2O.js";
import { c as resolveCronLifecycleRevisionIdentity, d as pickSummaryFromOutput, u as pickLastNonEmptyTextFromPayloads } from "./run-session-state-LIADNFmz.js";
import { t as cleanupCronRunSessionAfterRun } from "./session-cleanup-Dd1HnxXX.js";
import { t as resolveDeliveryTarget } from "./delivery-target-Cob1tKCy.js";
import { a as loadDeliverySubagentRegistryRuntime, c as logCronDeliveryWarn, d as normalizeSilentReplyText, f as resolveCronDeliveryBestEffort, g as waitForCompletedDirectCronDelivery, h as retryTransientDirectCronDelivery, i as isStaleCronDelivery, l as maybeApplyTtsToCronPayloads, m as resolveCronDeliveryStartDelayMs, n as buildDirectCronDeliveryIdempotencyKey, o as logCronDeliveryError, p as resolveCronDeliveryScheduledAtMs, r as isCompletedDirectCronDelivery, s as logCronDeliveryErrorDeferred, t as DIRECT_CRON_DELIVERY_COMPLETION_RETENTION, u as normalizeDeliveryTarget } from "./delivery-dispatch-policy-v786u1Hh.js";
import { n as isLikelyInterimCronMessage, t as expectsSubagentFollowup } from "./subagent-followup-hints-CdPqyvGp.js";
//#region src/cron/isolated-agent/delivery-route-session-key.ts
/**
* Picks the session-key identity used to resolve a cron delivery's outbound route.
*
* An isolated run does not carry its bound source conversation's namespace.
* Reuse only a canonical conversation belonging to the same agent, actual
* delivery provider, and destination; otherwise jobs can adopt another peer's
* conversation or thread.
*/
function selectCronRouteCurrentSessionKey(job, agentSessionKey, deliveryProvider, deliveryTarget) {
	const bound = (job.sessionKey ?? "").trim();
	const parsedBound = parseAgentSessionKey(bound);
	const parsedRun = parseAgentSessionKey(agentSessionKey);
	if (!parsedBound || !parsedRun || parsedBound.agentId !== parsedRun.agentId) return agentSessionKey;
	const conversation = /^([^:]+):(direct|group|channel):([^:]+)(?::thread:[^:]+)?$/i.exec(parsedBound.rest);
	const targetPeerId = stripOutboundTargetKindPrefix(stripTargetProviderPrefix(deliveryTarget, deliveryProvider));
	if (conversation?.[1]?.toLowerCase() !== deliveryProvider.trim().toLowerCase() || conversation[3] !== targetPeerId) return agentSessionKey;
	return bound;
}
//#endregion
//#region src/cron/isolated-agent/delivery-dispatch-awareness.ts
/** Session awareness and transcript mirroring for direct cron delivery. */
const deliveryOutboundRuntimeLoader$1 = createLazyImportLoader(() => import("./delivery-outbound.runtime.js"));
const outboundSessionRuntimeLoader = createLazyImportLoader(() => import("./outbound-session-y6-VW0qe.js"));
const transcriptRuntimeLoader = createLazyImportLoader(() => import("./transcript.runtime.js"));
function shouldQueueCronAwareness(params) {
	return params.job.sessionTarget === "isolated" && !params.deliveryBestEffort && params.delivery.mode === "explicit";
}
function resolveCronAwarenessMainSessionKey(params) {
	return params.cfg.session?.scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg: params.cfg,
		agentId: params.agentId
	});
}
function isSameSessionKey(left, right) {
	const normalizedLeft = normalizeOptionalString(left);
	const normalizedRight = normalizeOptionalString(right);
	return normalizedLeft != null && normalizedLeft === normalizedRight;
}
function resolveCronAwarenessText(params) {
	if (params.outboundPayloads?.length) {
		const projectedText = resolveDirectCronTranscriptMirrorText(projectDeliveredDirectCronPayloadsForMirror(params.outboundPayloads));
		if (projectedText) return projectedText;
	}
	return params.deliveryPayloads ? pickLastNonEmptyTextFromPayloads(params.deliveryPayloads) : normalizeOptionalString(params.outputText) ?? normalizeOptionalString(params.synthesizedText);
}
function resolveDirectCronSummaryFallbackText(params) {
	return normalizeOptionalString(params.outputText) ?? normalizeOptionalString(params.summary) ?? normalizeOptionalString(params.synthesizedText);
}
function shouldAttachDirectCronFallbackText(payload) {
	return Boolean(payload.channelData) && !hasReplyPayloadContent(payload, {
		trimText: true,
		hasChannelData: false
	});
}
function resolveDirectCronFallbackSourceIndex(payloads, fallbackText) {
	if (!fallbackText) return;
	const index = payloads.findLastIndex((payload) => normalizeOptionalString(payload.text) === fallbackText);
	return index >= 0 ? index : void 0;
}
function formatTargetCronDeliveryAwarenessText(text) {
	return `A scheduled automation delivered this message to this channel:\n${text}`;
}
function formatTargetCronDeliveryFailureAwarenessText(params) {
	const targetParts = [`${params.channel}:${params.to}`];
	if (params.threadId) targetParts.push(`thread ${params.threadId}`);
	return [
		"A scheduled automation attempted to deliver to this channel, but delivery failed.",
		`Job: ${params.job.name || params.job.id}`,
		`Target: ${targetParts.join(" ")}`,
		"Check automation history for delivery error details.",
		params.partialDelivered ? "One or more scheduled message payloads may already have been delivered." : "No scheduled message was delivered."
	].join("\n");
}
async function queueCronAwarenessSystemEvent(params) {
	try {
		const { enqueueSystemEvent } = await deliveryOutboundRuntimeLoader$1.load();
		const mainSessionKey = resolveCronAwarenessMainSessionKey({
			cfg: params.cfg,
			agentId: params.agentId
		});
		if (params.queueMainSession) enqueueSystemEvent(params.text, withSystemEventOwner({
			sessionKey: mainSessionKey,
			contextKey: params.deliveryIdempotencyKey
		}, params.agentId));
		const targetSessionKey = params.targetSessionKey;
		if (targetSessionKey && (!isSameSessionKey(targetSessionKey, mainSessionKey) || !params.queueMainSession)) enqueueSystemEvent(params.targetText ?? formatTargetCronDeliveryAwarenessText(params.text), withSystemEventOwner({
			sessionKey: targetSessionKey,
			contextKey: params.deliveryIdempotencyKey
		}, params.agentId));
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.jobId}] failed to queue isolated cron awareness: ${formatErrorMessage(err)}`);
	}
}
function isCustomCronSessionTarget(sessionTarget) {
	return typeof sessionTarget === "string" && sessionTarget.startsWith("session:");
}
function buildDirectCronTranscriptMirrorPayloads(payloads) {
	return payloads.map((payload) => {
		const spokenText = normalizeOptionalString(payload.spokenText);
		if (!spokenText) return payload;
		const mediaUrls = [payload.mediaUrl, ...payload.mediaUrls ?? []].filter((url) => Boolean(url) && !isAudioFileName(url));
		const { mediaUrl: _mediaUrl, mediaUrls: _mediaUrls, audioAsVoice: _audioAsVoice, spokenText: _spokenText, ...rest } = payload;
		return {
			...rest,
			text: spokenText,
			...mediaUrls.length ? { mediaUrls } : {}
		};
	});
}
function resolveDirectCronTranscriptMirrorText(params) {
	const text = normalizeOptionalString(params.text);
	const mediaText = resolveMirroredTranscriptText({ mediaUrls: params.mediaUrls }) ?? void 0;
	if (text && mediaText) return `${text}\n${mediaText}`;
	if (text || mediaText) return text ?? mediaText;
}
function pickDirectCronMirrorPayloadText(payload) {
	return normalizeOptionalString(payload.hookContent) ?? normalizeOptionalString(payload.text);
}
function isTtsAudioMirrorOnly(params) {
	return (params.payload.audioAsVoice === true || Boolean(params.payload.hookContent)) && isAudioFileName(params.mediaUrl);
}
function projectDeliveredDirectCronPayloadsForMirror(payloads) {
	const textParts = [];
	const mediaUrls = [];
	for (const payload of payloads) {
		const text = pickDirectCronMirrorPayloadText(payload);
		if (text) textParts.push(text);
		for (const mediaUrl of payload.mediaUrls) {
			if (isTtsAudioMirrorOnly({
				payload,
				mediaUrl
			})) continue;
			mediaUrls.push(mediaUrl);
		}
	}
	return {
		text: textParts.join("\n"),
		mediaUrls
	};
}
function canonicalizeDirectCronRouteSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	const canonical = canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey
	});
	if (canonical !== sessionKey) return canonical;
	const thread = parseThreadSessionSuffix(sessionKey);
	if (!thread.baseSessionKey || !thread.threadId) return sessionKey;
	const canonicalBase = canonicalizeMainSessionAlias({
		cfg: params.cfg,
		agentId: params.agentId,
		sessionKey: thread.baseSessionKey
	});
	if (canonicalBase === thread.baseSessionKey || canonicalBase === "global") return sessionKey;
	return `${canonicalBase}:thread:${thread.threadId}`;
}
async function resolveCronDeliveryRouteSessionKey(params) {
	try {
		const { resolveOutboundSessionRoute, ensureOutboundSessionEntry } = await outboundSessionRuntimeLoader.load();
		const route = await resolveOutboundSessionRoute({
			cfg: params.cfg,
			channel: params.delivery.channel,
			agentId: params.agentId,
			accountId: params.delivery.accountId,
			target: params.delivery.to,
			currentSessionKey: selectCronRouteCurrentSessionKey(params.job, params.agentSessionKey, params.delivery.channel, params.delivery.to),
			threadId: params.delivery.threadId
		});
		const routeSessionKey = route?.sessionKey?.trim();
		if (!route || !routeSessionKey) return params.agentSessionKey;
		const canonicalRouteSessionKey = canonicalizeDirectCronRouteSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: routeSessionKey
		});
		const canonicalRouteBaseSessionKey = canonicalizeDirectCronRouteSessionKey({
			cfg: params.cfg,
			agentId: params.agentId,
			sessionKey: route.baseSessionKey
		});
		const canonicalRoute = canonicalRouteSessionKey === route.sessionKey && canonicalRouteBaseSessionKey === route.baseSessionKey ? route : {
			...route,
			sessionKey: canonicalRouteSessionKey,
			baseSessionKey: canonicalRouteBaseSessionKey
		};
		await ensureOutboundSessionEntry({
			cfg: params.cfg,
			channel: params.delivery.channel,
			accountId: params.delivery.accountId,
			route: canonicalRoute
		});
		return canonicalRouteSessionKey;
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] failed to resolve destination session for ${params.warningContext}: ${formatErrorMessage(err)}`);
		return params.agentSessionKey;
	}
}
/** Resolves the transcript mirror session for direct cron delivery. */
async function resolveDirectCronDeliverySessionKey(params) {
	if (isCustomCronSessionTarget(params.job.sessionTarget)) return params.agentSessionKey;
	return await resolveCronDeliveryRouteSessionKey({
		cfg: params.cfg,
		job: params.job,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		delivery: params.delivery,
		warningContext: "direct delivery mirror"
	});
}
function resolveCronMessageToolAwarenessTarget(params) {
	const { target } = params.delivery;
	const text = normalizeOptionalString(target.text) ?? resolveMirroredTranscriptText({ mediaUrls: target.mediaUrls }) ?? void 0;
	if (!text) return;
	const targetChannel = normalizeOptionalString(target.provider);
	const channel = targetChannel && targetChannel !== "message" ? targetChannel : params.delivery.verifiedTarget && params.resolvedDelivery.ok ? params.resolvedDelivery.channel : void 0;
	const to = normalizeOptionalString(target.to) ?? (params.delivery.verifiedTarget && params.resolvedDelivery.ok ? params.resolvedDelivery.to : void 0);
	if (!channel || !to) return;
	const accountId = target.accountId ?? (params.delivery.verifiedTarget && params.resolvedDelivery.ok ? params.resolvedDelivery.accountId : void 0);
	const threadId = target.threadId ?? (params.delivery.verifiedTarget && target.threadImplicit === true && params.resolvedDelivery.ok ? params.resolvedDelivery.threadId : void 0);
	return {
		ok: true,
		channel,
		to,
		...accountId ? { accountId } : {},
		...threadId ? { threadId } : {},
		mode: "explicit",
		text
	};
}
/** Queues target-session context awareness for cron deliveries made via message tool. */
async function queueCronMessageToolDeliveryAwareness(params) {
	const seen = /* @__PURE__ */ new Set();
	for (const delivery of params.sourceDeliveryOutcome.visibleDeliveries) {
		const target = resolveCronMessageToolAwarenessTarget({
			delivery,
			resolvedDelivery: params.resolvedDelivery
		});
		if (!target) continue;
		const dedupeKey = [
			target.channel,
			normalizeDeliveryTarget(target.channel, target.to),
			target.accountId ?? "",
			target.threadId ?? "",
			target.text
		].join("\0");
		if (seen.has(dedupeKey)) continue;
		seen.add(dedupeKey);
		const targetSessionKey = await resolveCronDeliveryRouteSessionKey({
			cfg: params.cfg,
			job: params.job,
			agentId: params.agentId,
			agentSessionKey: params.agentSessionKey,
			delivery: target,
			warningContext: "message-tool delivery awareness"
		});
		const deliveryIdempotencyKey = buildDirectCronDeliveryIdempotencyKey({
			jobId: params.job.id,
			runStartedAt: params.runStartedAt,
			delivery: target
		});
		await queueCronAwarenessSystemEvent({
			cfg: params.cfg,
			jobId: params.job.id,
			agentId: params.agentId,
			deliveryIdempotencyKey,
			queueMainSession: false,
			targetSessionKey,
			text: target.text
		});
	}
}
async function appendDirectCronDeliveryTranscriptMirror(params) {
	if (!params.mirror.text && !params.mirror.mediaUrls?.length) return;
	try {
		const { appendAssistantMessageToSessionTranscript } = await transcriptRuntimeLoader.load();
		const result = await appendAssistantMessageToSessionTranscript(params.mirror);
		if (!result.ok) await logCronDeliveryWarn(`[cron:${params.job.id}] failed to mirror direct delivery into session transcript: ${result.reason}`);
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] failed to mirror direct delivery into session transcript: ${formatErrorMessage(err)}`);
	}
}
async function appendAdmittedDirectCronDeliveryTranscriptMirror(params) {
	const storePath = params.mirror.storePath;
	const initial = storePath ? loadCronSessionEntryLatest(storePath, params.mirror.sessionKey) : void 0;
	const expectedSessionId = params.mirror.expectedSessionId ?? initial?.sessionId;
	const expectedLifecycleRevision = params.mirror.expectedLifecycleRevision ?? initial?.lifecycleRevision;
	if (!storePath || !expectedSessionId) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] skipped transcript mirror without an exact session identity`);
		return;
	}
	const admittedMirror = {
		...params.mirror,
		expectedSessionId,
		...expectedLifecycleRevision ? { expectedLifecycleRevision } : {}
	};
	try {
		const admission = await beginSessionWorkAdmission({
			scope: storePath,
			identities: [
				params.mirror.sessionKey,
				expectedSessionId,
				expectedLifecycleRevision ? resolveCronLifecycleRevisionIdentity(expectedLifecycleRevision) : void 0
			],
			signal: params.abortSignal,
			assertAllowed: () => {
				const latest = loadCronSessionEntryLatest(storePath, params.mirror.sessionKey);
				if (latest?.sessionId !== expectedSessionId || expectedLifecycleRevision !== void 0 && latest.lifecycleRevision !== expectedLifecycleRevision) throw new Error(`Session "${params.mirror.sessionKey}" changed before transcript mirror.`);
				const archivedError = resolveSessionWorkStartError(params.mirror.sessionKey, latest);
				if (archivedError) throw new Error(archivedError);
			}
		});
		try {
			await admission.run(() => appendDirectCronDeliveryTranscriptMirror({
				job: params.job,
				mirror: admittedMirror
			}));
		} finally {
			admission.release();
		}
	} catch (err) {
		await logCronDeliveryWarn(`[cron:${params.job.id}] skipped transcript mirror: ${formatErrorMessage(err)}`);
	}
}
//#endregion
//#region src/cron/isolated-agent/delivery-payload-normalization.ts
function normalizeDirectPayload(payload) {
	const normalized = payload.text ? normalizeSilentReplyText(payload.text) : void 0;
	return normalized ? {
		...payload,
		text: normalized.strippedTrailingSilentToken ? void 0 : normalized.text
	} : payload;
}
function normalizeDirectCronDeliveryPayloads(params) {
	const fallback = normalizeSilentReplyText(resolveDirectCronSummaryFallbackText(params));
	const fallbackText = fallback.strippedTrailingSilentToken ? void 0 : fallback.text;
	const candidates = params.deliveryPayloads.map(normalizeDirectPayload).filter((payload) => hasReplyPayloadContent(payload, { trimText: true }));
	if (candidates.length === 0 && fallbackText) candidates.push({ text: fallbackText });
	let fallbackSourceIndex = resolveDirectCronFallbackSourceIndex(candidates, fallbackText);
	if (fallbackText && fallbackSourceIndex === void 0 && candidates.some(shouldAttachDirectCronFallbackText)) {
		candidates.unshift({ text: fallbackText });
		fallbackSourceIndex = 0;
	}
	const prepared = candidates.map((payload) => shouldAttachDirectCronFallbackText(payload) && fallbackText && fallbackSourceIndex !== void 0 ? copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: {
		text: fallbackText,
		replacesPayloadIndex: fallbackSourceIndex
	} })) : payload);
	const accepted = [];
	let fallbackSourceSuppressed = false;
	let channelSuppressed = false;
	for (const [index, candidate] of prepared.entries()) {
		const transformed = params.channelTransform ? params.channelTransform.apply(candidate) : candidate;
		if (transformed === null) {
			channelSuppressed = true;
			fallbackSourceSuppressed ||= index === fallbackSourceIndex;
		} else accepted.push({
			payload: transformed,
			sourceIndex: index
		});
	}
	if (accepted.length === 0) return {
		kind: "suppress",
		reason: channelSuppressed ? "channel_transform" : "empty"
	};
	const acceptedFallbackIndex = accepted.findIndex(({ sourceIndex }) => sourceIndex === fallbackSourceIndex);
	return {
		kind: "deliver",
		payload: accepted.map(({ payload }) => {
			const fallbackMeta = payload.fallbackText;
			if (!fallbackMeta || fallbackMeta.replacesPayloadIndex !== fallbackSourceIndex) return payload;
			return copyReplyPayloadMetadata(payload, Object.assign({}, payload, { fallbackText: fallbackSourceSuppressed || acceptedFallbackIndex < 0 ? void 0 : {
				...fallbackMeta,
				replacesPayloadIndex: acceptedFallbackIndex
			} }));
		})
	};
}
//#endregion
//#region src/cron/isolated-agent/delivery-dispatch.ts
const deliveryOutboundRuntimeLoader = createLazyImportLoader(() => import("./delivery-outbound.runtime.js"));
const subagentFollowupRuntimeLoader = createLazyImportLoader(() => import("./subagent-followup.runtime.js"));
/** Dispatches cron run output through verified message-tool or direct delivery paths. */
async function dispatchCronDelivery(params) {
	const sourceDeliverySatisfied = params.sourceDeliveryOutcome.satisfiesSourceDelivery;
	const verifiedMessageToolDelivery = params.sourceDeliveryOutcome.verifiedMessageToolDelivery;
	let summary = params.summary;
	let outputText = params.outputText;
	let synthesizedText = params.synthesizedText;
	let deliveryPayloads = params.deliveryPayloads;
	let delivered = verifiedMessageToolDelivery;
	let deliveryAttempted = verifiedMessageToolDelivery;
	let deliveryError;
	let deliverySuppressionReason;
	let directCronSessionCleanupAttempted = false;
	let deferredDeletingSessionMirror;
	const buildDeliveryState = (result) => ({
		...result ? { result } : {},
		delivered,
		deliveryAttempted,
		...deliveryError ? { deliveryError } : {},
		...deliverySuppressionReason ? { deliverySuppressionReason } : {},
		cronRunSessionCleanupAttempted: directCronSessionCleanupAttempted,
		summary,
		outputText,
		synthesizedText,
		deliveryPayloads
	});
	const formatDeliveryTargetError = (error) => params.sourceDeliveryOutcome.unverifiedMessageToolDelivery ? `${error}; the agent used the message tool, but OpenClaw could not verify that message matched the cron delivery target` : error;
	const failDeliveryTarget = (error) => params.withRunSession({
		status: "error",
		error: formatDeliveryTargetError(error),
		errorKind: "delivery-target",
		summary,
		outputText,
		deliveryAttempted,
		...params.telemetry
	});
	const cleanupDirectCronSessionIfNeeded = async () => {
		if (directCronSessionCleanupAttempted) return "not-requested";
		const cleanupOutcome = await cleanupCronRunSessionAfterRun({
			job: params.job,
			agentSessionKey: params.agentSessionKey,
			sessionId: params.sessionId,
			lifecycleRevision: params.lifecycleRevision,
			sessionUpdatedAt: params.sessionUpdatedAt,
			beforeDelete: params.beforeSessionDelete,
			reason: "cron-delete-after-run-fallback"
		});
		if (cleanupOutcome !== "not-requested") directCronSessionCleanupAttempted = true;
		const survivingMirror = deferredDeletingSessionMirror;
		deferredDeletingSessionMirror = void 0;
		if (cleanupOutcome !== "not-requested" && cleanupOutcome !== "deleted" && survivingMirror) await appendAdmittedDirectCronDeliveryTranscriptMirror({
			job: params.job,
			mirror: survivingMirror,
			abortSignal: params.abortSignal
		});
		return cleanupOutcome;
	};
	const finishSilentReplyDelivery = async (reason) => {
		deliveryAttempted = true;
		deliverySuppressionReason = reason;
		await cleanupDirectCronSessionIfNeeded();
		return params.withRunSession({
			status: "ok",
			summary,
			outputText,
			delivered: false,
			deliveryAttempted: true,
			...reason ? { deliverySuppressionReason: reason } : {},
			...params.telemetry
		});
	};
	const deliverViaDirect = async (delivery, options) => {
		const { buildOutboundSessionContext, createOutboundSendDeps, resolveAgentOutboundIdentity, resolveCronChannelReplyTransform, sendDurableMessageBatchCore } = await deliveryOutboundRuntimeLoader.load();
		const payloadNormalization = normalizeDirectCronDeliveryPayloads({
			deliveryPayloads,
			outputText,
			summary,
			synthesizedText,
			channelTransform: resolveCronChannelReplyTransform({
				channel: delivery.channel,
				cfg: params.cfgWithAgentDefaults,
				accountId: delivery.accountId
			})
		});
		if (payloadNormalization.kind === "suppress") return await finishSilentReplyDelivery(payloadNormalization.reason);
		const normalizedPayloads = payloadNormalization.payload;
		const deliveryIdempotencyKey = buildDirectCronDeliveryIdempotencyKey({
			jobId: params.job.id,
			runStartedAt: params.runStartedAt,
			delivery
		});
		let completedDelivery = false;
		try {
			completedDelivery = isCompletedDirectCronDelivery(deliveryIdempotencyKey);
		} catch (err) {
			if (!params.deliveryBestEffort) throw err;
			await logCronDeliveryWarn(`[cron:${params.job.id}] durable delivery receipt unavailable; continuing best-effort delivery: ${formatErrorMessage(err)}`);
		}
		if (completedDelivery) {
			delivered = true;
			deliveryAttempted = true;
			return null;
		}
		const identity = resolveAgentOutboundIdentity(params.cfgWithAgentDefaults, params.agentId);
		try {
			if (params.isAborted()) return params.withRunSession({
				status: "error",
				error: params.abortReason(),
				deliveryAttempted,
				...params.telemetry
			});
			if (params.deliveryRequested && isStaleCronDelivery({
				job: params.job,
				runStartedAt: params.runStartedAt
			})) {
				deliveryAttempted = true;
				const nowMs = Date.now();
				const scheduledAtMs = resolveCronDeliveryScheduledAtMs({
					job: params.job,
					runStartedAt: params.runStartedAt
				});
				const startDelayMs = resolveCronDeliveryStartDelayMs({
					job: params.job,
					runStartedAt: params.runStartedAt
				});
				await logCronDeliveryWarn(`[cron:${params.job.id}] skipping stale delivery scheduled at ${new Date(scheduledAtMs).toISOString()}, started ${Math.round(startDelayMs / 6e4)}m late, current age ${Math.round((nowMs - scheduledAtMs) / 6e4)}m`);
				return params.withRunSession({
					status: "ok",
					summary,
					outputText,
					deliveryAttempted,
					delivered: false,
					...params.telemetry
				});
			}
			const payloadsForDelivery = (await maybeApplyTtsToCronPayloads({
				cfg: params.cfgWithAgentDefaults,
				payloads: normalizedPayloads,
				delivery,
				agentId: params.agentId,
				ttsAuto: params.ttsAuto
			})).filter((p) => hasReplyPayloadContent(p, { trimText: true }));
			if (payloadsForDelivery.length === 0) return await finishSilentReplyDelivery();
			deliveryAttempted = true;
			const deliverySessionKey = await resolveDirectCronDeliverySessionKey({
				cfg: params.cfgWithAgentDefaults,
				job: params.job,
				agentId: params.agentId,
				agentSessionKey: params.agentSessionKey,
				delivery
			});
			const deliverySession = buildOutboundSessionContext({
				cfg: params.cfgWithAgentDefaults,
				agentId: params.agentId,
				sessionKey: deliverySessionKey
			});
			const awarenessMainSessionKey = resolveCronAwarenessMainSessionKey({
				cfg: params.cfgWithAgentDefaults,
				agentId: params.agentId
			});
			const mirrorTargetsAwarenessMainSession = isSameSessionKey(deliverySessionKey, awarenessMainSessionKey);
			const mirrorTargetsDeletingRunSession = params.job.deleteAfterRun === true && isCronSessionKey(params.agentSessionKey) && isSameSessionKey(deliverySessionKey, params.agentSessionKey);
			let hadPartialFailure = false;
			let completedByConcurrentDelivery = false;
			let payloadMayHaveReachedRecipientBeforeFailure = false;
			const attemptedPayloadsForMirror = [];
			const onError = params.deliveryBestEffort ? (err, _payload) => {
				hadPartialFailure = true;
				deliveryError ??= formatErrorMessage(err);
				logCronDeliveryErrorDeferred(`[cron:${params.job.id}] delivery payload failed (bestEffort): ${formatErrorMessage(err)}`);
			} : void 0;
			const runDelivery = async () => {
				attemptedPayloadsForMirror.length = 0;
				const send = await sendDurableMessageBatchCore({
					cfg: params.cfgWithAgentDefaults,
					channel: delivery.channel,
					to: delivery.to,
					accountId: delivery.accountId,
					threadId: delivery.threadId,
					payloads: payloadsForDelivery,
					session: deliverySession,
					identity,
					bestEffort: params.deliveryBestEffort,
					durability: params.deliveryBestEffort ? "best_effort" : "required",
					deliveryIntentId: deliveryIdempotencyKey,
					reusePendingDeliveryIntent: true,
					completionRetention: DIRECT_CRON_DELIVERY_COMPLETION_RETENTION,
					deps: createOutboundSendDeps(params.deps),
					signal: params.abortSignal,
					onError,
					onPayload: (payload) => {
						attemptedPayloadsForMirror.push(payload);
					}
				});
				payloadMayHaveReachedRecipientBeforeFailure ||= send.payloadOutcomes?.some((outcome) => outcome.status === "sent" || outcome.status === "failed" && outcome.sentBeforeError || outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity") ?? false;
				if (send.status === "failed" && await waitForCompletedDirectCronDelivery({
					id: deliveryIdempotencyKey,
					signal: params.abortSignal
				})) {
					completedByConcurrentDelivery = true;
					return [];
				}
				if (send.status === "failed") throw send.error;
				if (send.status === "partial_failed") {
					payloadMayHaveReachedRecipientBeforeFailure = true;
					if (!params.deliveryBestEffort) throw send.error;
					hadPartialFailure = true;
					deliveryError ??= formatErrorMessage(send.error);
				}
				return send.status === "sent" || send.status === "partial_failed" ? send.results : [];
			};
			let deliveryResults;
			try {
				deliveryResults = options?.retryTransient ? await retryTransientDirectCronDelivery({
					jobId: params.job.id,
					signal: params.abortSignal,
					run: runDelivery,
					shouldRetryError: () => !payloadMayHaveReachedRecipientBeforeFailure
				}) : await runDelivery();
			} catch (err) {
				const failureAwarenessText = formatTargetCronDeliveryFailureAwarenessText({
					job: params.job,
					channel: delivery.channel,
					to: delivery.to,
					threadId: stringifyRouteThreadId(delivery.threadId),
					partialDelivered: payloadMayHaveReachedRecipientBeforeFailure
				});
				await queueCronAwarenessSystemEvent({
					cfg: params.cfgWithAgentDefaults,
					jobId: params.job.id,
					agentId: params.agentId,
					deliveryIdempotencyKey: `${deliveryIdempotencyKey}:failure`,
					queueMainSession: false,
					targetSessionKey: deliverySessionKey,
					text: failureAwarenessText,
					targetText: failureAwarenessText
				});
				throw err;
			}
			if (completedByConcurrentDelivery) {
				delivered = true;
				return null;
			}
			delivered = deliveryResults.length > 0 && !hadPartialFailure;
			const deliveryAwarenessText = resolveCronAwarenessText({
				outputText,
				synthesizedText,
				deliveryPayloads: payloadsForDelivery,
				outboundPayloads: attemptedPayloadsForMirror
			});
			const shouldQueueAwarenessForDelivery = shouldQueueCronAwareness({
				job: params.job,
				delivery,
				deliveryBestEffort: params.deliveryBestEffort
			});
			const deliveryWillReachAwarenessMainSession = mirrorTargetsAwarenessMainSession && shouldQueueAwarenessForDelivery && Boolean(shouldQueueAwarenessForDelivery ? deliveryAwarenessText : void 0);
			const mirrorWouldBypassIsolatedAwarenessPolicy = mirrorTargetsAwarenessMainSession && params.job.sessionTarget === "isolated" && delivery.mode !== "explicit";
			if (delivered && !deliveryWillReachAwarenessMainSession && !mirrorWouldBypassIsolatedAwarenessPolicy) {
				const mirrorText = resolveDirectCronTranscriptMirrorText(attemptedPayloadsForMirror.length > 0 ? projectDeliveredDirectCronPayloadsForMirror(attemptedPayloadsForMirror) : projectOutboundPayloadPlanForMirror(createOutboundPayloadPlan(buildDirectCronTranscriptMirrorPayloads(payloadsForDelivery), {
					cfg: params.cfgWithAgentDefaults,
					sessionKey: deliverySessionKey,
					surface: delivery.channel
				})));
				const transcriptMirror = {
					sessionKey: deliverySessionKey,
					agentId: params.agentId,
					...mirrorTargetsDeletingRunSession ? {
						expectedSessionId: params.sessionId,
						expectedLifecycleRevision: params.lifecycleRevision
					} : {},
					text: mirrorText,
					mediaUrls: void 0,
					storePath: resolveSessionStorePathCore(params.cfgWithAgentDefaults.session?.store, { agentId: params.agentId }),
					idempotencyKey: deliveryIdempotencyKey,
					config: params.cfgWithAgentDefaults
				};
				if (mirrorTargetsDeletingRunSession) deferredDeletingSessionMirror = transcriptMirror;
				else await appendAdmittedDirectCronDeliveryTranscriptMirror({
					job: params.job,
					mirror: transcriptMirror,
					abortSignal: params.abortSignal
				});
			}
			if (delivered && !params.deliveryBestEffort && deliveryAwarenessText && (shouldQueueAwarenessForDelivery || !isSameSessionKey(deliverySessionKey, awarenessMainSessionKey))) await queueCronAwarenessSystemEvent({
				cfg: params.cfgWithAgentDefaults,
				jobId: params.job.id,
				agentId: params.agentId,
				deliveryIdempotencyKey,
				queueMainSession: shouldQueueAwarenessForDelivery,
				text: deliveryAwarenessText,
				targetSessionKey: deliverySessionKey
			});
			return null;
		} catch (err) {
			if (!params.deliveryBestEffort) return params.withRunSession({
				status: "error",
				summary,
				outputText,
				error: String(err),
				deliveryAttempted,
				...params.telemetry
			});
			await logCronDeliveryError(`[cron:${params.job.id}] delivery failed (bestEffort): ${formatErrorMessage(err)}`);
			deliveryError = formatErrorMessage(err);
			return null;
		}
	};
	const deliverViaDirectAndCleanup = async (delivery, options = { retryTransient: true }) => {
		try {
			return await deliverViaDirect(delivery, options);
		} finally {
			await cleanupDirectCronSessionIfNeeded();
		}
	};
	const finalizeTextDelivery = async (delivery) => {
		if (!synthesizedText && !params.spawnOnlyHandoff) return null;
		const initialSynthesizedText = synthesizedText?.trim() ?? "";
		const spawnOnlyHandoff = params.spawnOnlyHandoff;
		const expectedSubagentFollowup = expectsSubagentFollowup(initialSynthesizedText);
		const subagentRegistryRuntime = await loadDeliverySubagentRegistryRuntime();
		const subagentFollowupSessionKey = params.runSessionKey;
		let activeSubagentRuns = subagentRegistryRuntime.countActiveDescendantRuns(subagentFollowupSessionKey);
		const shouldCheckCompletedDescendants = activeSubagentRuns === 0 && (spawnOnlyHandoff || isLikelyInterimCronMessage(initialSynthesizedText));
		const subagentFollowupRuntime = shouldCheckCompletedDescendants || activeSubagentRuns > 0 || expectedSubagentFollowup ? await subagentFollowupRuntimeLoader.load() : void 0;
		const completedDescendantReply = shouldCheckCompletedDescendants ? await subagentFollowupRuntime?.readDescendantSubagentFallbackReply({
			sessionKey: subagentFollowupSessionKey,
			runStartedAt: params.runStartedAt
		}) : void 0;
		const hadDescendants = activeSubagentRuns > 0 || Boolean(completedDescendantReply);
		if ((!params.deliveryBestEffort || spawnOnlyHandoff) && (activeSubagentRuns > 0 || expectedSubagentFollowup)) {
			let finalReply = await subagentFollowupRuntime?.waitForDescendantSubagentSummary({
				sessionKey: subagentFollowupSessionKey,
				initialReply: initialSynthesizedText,
				timeoutMs: params.timeoutMs,
				observedActiveDescendants: activeSubagentRuns > 0 || expectedSubagentFollowup
			});
			activeSubagentRuns = subagentRegistryRuntime.countActiveDescendantRuns(subagentFollowupSessionKey);
			if (!finalReply && activeSubagentRuns === 0) finalReply = await subagentFollowupRuntime?.readDescendantSubagentFallbackReply({
				sessionKey: subagentFollowupSessionKey,
				runStartedAt: params.runStartedAt
			});
			if (finalReply && activeSubagentRuns === 0) {
				outputText = finalReply;
				summary = pickSummaryFromOutput(finalReply) ?? summary;
				synthesizedText = finalReply;
				deliveryPayloads = [{ text: finalReply }];
			}
		} else if (completedDescendantReply) {
			outputText = completedDescendantReply;
			summary = pickSummaryFromOutput(completedDescendantReply) ?? summary;
			synthesizedText = completedDescendantReply;
			deliveryPayloads = [{ text: completedDescendantReply }];
		}
		if (spawnOnlyHandoff && !synthesizedText?.trim()) {
			const error = params.isAborted() ? params.abortReason() : activeSubagentRuns > 0 ? "cron child-session handoff timed out before producing a final assistant payload" : "cron child-session handoff completed without a final assistant payload";
			deliveryAttempted = true;
			return params.withRunSession({
				status: "error",
				error,
				delivered: false,
				deliveryAttempted,
				...params.telemetry
			});
		}
		if (!params.deliveryBestEffort && activeSubagentRuns > 0) {
			deliveryAttempted = true;
			return params.withRunSession({
				status: "ok",
				summary,
				outputText,
				deliveryAttempted,
				...params.telemetry
			});
		}
		if (hadDescendants && synthesizedText?.trim() === initialSynthesizedText && isLikelyInterimCronMessage(initialSynthesizedText) && !isSilentReplyText(initialSynthesizedText, "NO_REPLY")) {
			deliveryAttempted = true;
			return params.withRunSession({
				status: "ok",
				summary,
				outputText,
				deliveryAttempted,
				...params.telemetry
			});
		}
		const normalizedSynthesizedText = normalizeSilentReplyText(synthesizedText);
		if (normalizedSynthesizedText.text === void 0 || normalizedSynthesizedText.strippedTrailingSilentToken) return await finishSilentReplyDelivery();
		synthesizedText = normalizedSynthesizedText.text;
		outputText = synthesizedText;
		if (params.isAborted()) return params.withRunSession({
			status: "error",
			error: params.abortReason(),
			deliveryAttempted,
			...params.telemetry
		});
		return await deliverViaDirectAndCleanup(delivery, { retryTransient: true });
	};
	if (params.deliveryRequested && !params.skipHeartbeatDelivery && !sourceDeliverySatisfied) {
		if (!params.resolvedDelivery.ok) {
			await cleanupDirectCronSessionIfNeeded();
			if (!params.deliveryBestEffort) return buildDeliveryState(failDeliveryTarget(params.resolvedDelivery.error.message));
			delivered = false;
			deliveryError = params.resolvedDelivery.error.message;
			await logCronDeliveryWarn(`[cron:${params.job.id}] ${params.resolvedDelivery.error.message}`);
			return buildDeliveryState(params.withRunSession({
				status: "ok",
				summary,
				outputText,
				delivered,
				deliveryError,
				deliveryAttempted,
				...params.telemetry
			}));
		}
		if (params.deliveryPayloadHasStructuredContent || params.resolvedDelivery.threadId != null && !params.spawnOnlyHandoff) {
			const directResult = await deliverViaDirectAndCleanup(params.resolvedDelivery);
			if (directResult) return buildDeliveryState(directResult);
		} else {
			const finalizedTextResult = await finalizeTextDelivery(params.resolvedDelivery);
			if (finalizedTextResult) return buildDeliveryState(finalizedTextResult);
		}
	}
	return buildDeliveryState();
}
//#endregion
export { dispatchCronDelivery, queueCronMessageToolDeliveryAwareness, resolveCronDeliveryBestEffort, resolveDeliveryTarget };
