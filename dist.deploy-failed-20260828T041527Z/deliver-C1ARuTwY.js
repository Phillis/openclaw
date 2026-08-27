import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { a as emitInternalDiagnosticEvent } from "./diagnostic-events-BGzDm6gu.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { r as getOwnedSessionTranscriptWriterFence } from "./transcript-write-context-LK0MNWC3.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-DxrLtJZQ.js";
import { t as getGlobalHookRunner } from "./hook-runner-global-CDBq1X4a.js";
import { n as PlatformMessageNotDispatchedError, t as OutboundDeliveryError } from "./deliver-types-w6kiySpD.js";
import { i as findPlatformMessageRejectedError, s as isProvenDeliveryNotSentError } from "./delivery-recovery.shared-B2XgPiah.js";
import { a as settleDurableDelivery, i as rejectDurableDelivery, r as markDurableDeliveryQueued } from "./delivery-completion-CDrntLbO.js";
import { d as suppressedPayloadOutcome, f as toOutboundDeliveryError, i as resolveOutboundDurableFinalDeliverySupport, n as throwIfAborted, o as createRenderedMessageBatchPlan, r as createChannelHandler, t as prepareOutboundPayloadBatch } from "./deliver-prepare-DXM4XCVk.js";
import { C as normalizeOutboundReplyFacts, x as createReplyToDeliveryPolicy } from "./reply-payload-i0RzN2iF.js";
import { l as resolveOutboundPayloadMirrorText } from "./payloads-BDBV7AYm.js";
import { a as runOutboundDeliveryCommitHooks, c as deliveryKindForPayload, d as maybePinDeliveredMessage, f as normalizeEmptyPayloadForDelivery, g as stripInternalRuntimeScaffoldingFromPayload, h as resolveOutboundMediaAccessForSend, l as hasDeliveryResultIdentity, m as renderPresentationForDelivery, o as buildPayloadSummary, s as collectPayloadMediaSources, u as maybeNotifyAfterDeliveredPayload } from "./delivery-queue-reconciliation-CUGy8Pa1.js";
import { n as hasTrustedMessageAuditListeners } from "./message-audit-events-DGtoPYvb.js";
import { t as diagnosticErrorCategory } from "./diagnostic-error-metadata-qnHBNuqn.js";
import { r as resolveOutboundMediaMaxBytes } from "./configured-max-bytes-B5djOrK5.js";
import { n as deriveDurableFinalDeliveryRequirementsForBatch, r as payloadRequiresDurablePayloadTransport } from "./capabilities-B_v2fZ1U.js";
import { a as emitOutboundAuditLifecycle, c as uniformOutboundAuditTerminals, d as isDeliveryAbortError, f as persistQueuedPostSendState, h as resolveDeferredDeliveryAdmission, i as completedOutboundAuditTerminals, l as createMessageSentEmitter, m as OUTBOUND_DELIVERY_LOG_SCOPE, o as emitOutboundAuditTerminals, p as persistQueuedPreSendState, r as withActiveDeliveryClaim, s as failedOutboundAuditTerminals, u as createQueuedDeliveryOwner } from "./delivery-queue-recovery-qoOfjfCc.js";
import { C as claimReusableDeliveryPlatformSendAttempt, D as PLATFORM_SEND_OWNER_LEASE_MS, M as preparedOutboundSuppressionOutcomes, O as createInitialDeliveryProducerClaim, _ as markDeliveryPlatformSendDispatched, a as failDelivery, b as StableDeliveryPreparationLostError, f as loadPendingDelivery, i as enqueuePreparedDeliveryOnce, j as mapPreparedOutboundAcceptedPayloads, k as acceptedPreparedOutboundEntries, l as findDeliveryIntentOwner, n as enqueueDelivery, o as failDeliveryAfterPlatformSend, r as enqueueDeliveryOnce, s as failDeliveryBeforePlatformSend, v as moveToFailed, w as renewDeliveryPlatformSendLease, x as withStableDeliveryPreparation } from "./delivery-queue-storage-BJKj2sCe.js";
import { s as cancelDeliveryQueueMediaRetention } from "./delivery-queue-media-staging-DziHvpn8.js";
import { i as stageQueuePayloadMedia, r as releaseSpoolArtifacts } from "./delivery-queue-media-spool-gOZs_CIq.js";
import { c as resolveTextChunkLimit, i as chunkMarkdownTextWithMode, n as chunkByParagraph, s as resolveChunkMode } from "./chunk-_fxsAvI_.js";
//#region src/infra/outbound/deliver-queue-admission.ts
function restoreQueuedDeliveryCustody(params, entry) {
	const { id: _id, enqueuedAt: _enqueuedAt, retryCount: _retryCount, attemptCount: _attemptCount, requiresProducerClaim: _requiresProducerClaim, availableAt: _availableAt, producerClaimId: _producerClaimId, lastAttemptAt: _lastAttemptAt, lastError: _lastError, platformSendAttemptId: _platformSendAttemptId, platformSendStartedAt: _platformSendStartedAt, effectiveReplyToId: _effectiveReplyToId, recoveryState: _recoveryState, maxRetries: _maxRetries, legacyUnknownSendReconciliation: _legacyUnknownSendReconciliation, legacyPreparedContentUnavailable: _legacyPreparedContentUnavailable, ...custody } = entry;
	const payloads = acceptedPreparedOutboundEntries(custody.preparedBatch).map((prepared) => prepared.payload);
	return {
		...params,
		...custody,
		payloads
	};
}
/** Stages producer-owned media and atomically admits one durable outbound intent. */
async function stageAndEnqueueOutboundDelivery(params, preparedBatch, options) {
	const { channel, to } = params;
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const acceptedPayloads = acceptedPreparedOutboundEntries(preparedBatch).map((entry) => stripInternalRuntimeScaffoldingFromPayload(entry.payload));
	const renderedBatchPlan = params.renderedBatchPlan ?? createRenderedMessageBatchPlan(acceptedPayloads);
	if (params.deliveryIntentId && params.reusePendingDeliveryIntent) {
		const existing = await loadPendingDelivery(params.deliveryIntentId);
		if (existing) return {
			id: existing.id,
			created: false
		};
	}
	const staged = await stageQueuePayloadMedia({
		payloads: acceptedPayloads,
		mediaAccess: resolveOutboundMediaAccessForSend(params, channel, collectPayloadMediaSources(acceptedPayloads)),
		maxBytes: resolveOutboundMediaMaxBytes({
			cfg: params.cfg,
			channel,
			accountId: params.accountId
		})
	});
	if (staged.status !== "staged") {
		if (queuePolicy === "required") throw new Error(`Required durable message send is unsupported for ${channel}: ${staged.reason} cannot be persisted`);
		return null;
	}
	try {
		const initialProducerClaim = options?.claimForLiveDelivery ? createInitialDeliveryProducerClaim() : void 0;
		const queuedPreparedBatch = mapPreparedOutboundAcceptedPayloads(preparedBatch, staged.payloads);
		const delivery = {
			channel,
			to,
			accountId: params.accountId,
			queuePolicy,
			requireUnknownSendReconciliation: params.requireUnknownSendReconciliation,
			...params.reusePendingDeliveryIntent ? { requiresProducerClaim: true } : {},
			...initialProducerClaim ? { initialProducerClaim } : {},
			preparedBatch: queuedPreparedBatch,
			renderedBatchPlan,
			threadId: params.threadId,
			reply: normalizeOutboundReplyFacts(params),
			formatting: params.formatting,
			identity: params.identity,
			bestEffort: params.bestEffort,
			gifPlayback: params.gifPlayback,
			forceDocument: params.forceDocument,
			silent: params.silent,
			mirror: params.mirror,
			session: params.session,
			gatewayClientScopes: params.gatewayClientScopes,
			preparedMessageId: params.preparedMessageId,
			completionRetention: params.completionRetention,
			maxRetries: params.maxRetries,
			deliveryCompletion: params.deliveryCompletion
		};
		if (params.deliveryIntentId) {
			const queued = options?.getStablePreparation ? await enqueuePreparedDeliveryOnce(delivery, params.deliveryIntentId, options.getStablePreparation(), void 0, staged.mediaStageId) : await enqueueDeliveryOnce(delivery, params.deliveryIntentId, void 0, staged.mediaStageId);
			if (!queued.created) {
				cancelDeliveryQueueMediaRetention(staged.mediaStageId);
				await releaseSpoolArtifacts(staged.artifacts);
			}
			return {
				...queued,
				...queued.created && initialProducerClaim ? { producerClaimId: initialProducerClaim.producerClaimId } : {}
			};
		}
		return {
			id: await enqueueDelivery(delivery, void 0, staged.mediaStageId),
			created: true,
			...initialProducerClaim ? { producerClaimId: initialProducerClaim.producerClaimId } : {}
		};
	} catch (err) {
		cancelDeliveryQueueMediaRetention(staged.mediaStageId);
		await releaseSpoolArtifacts(staged.artifacts);
		throw err;
	}
}
//#endregion
//#region src/infra/outbound/deliver-results.ts
function createDeliveryResultRecorder(params) {
	const results = params.results;
	let reportedResults = [];
	const resultIdentityKey = (delivery) => JSON.stringify([
		delivery.channel,
		delivery.messageId,
		delivery.target,
		delivery.timestamp,
		delivery.toJid,
		delivery.pollId
	]);
	const resultPlatformIds = (delivery, options) => {
		const ids = /* @__PURE__ */ new Set();
		const add = (value) => {
			const id = value?.trim();
			if (id && id !== "unknown" && id !== "suppressed") ids.add(id);
		};
		if (!options?.receiptOnly) add(delivery.messageId);
		add(delivery.receipt?.primaryPlatformMessageId);
		for (const id of delivery.receipt?.platformMessageIds ?? []) add(id);
		for (const part of delivery.receipt?.parts ?? []) add(part.platformMessageId);
		return ids;
	};
	const reportIdentifiedDeliveryResult = async (delivery) => {
		if (!hasDeliveryResultIdentity(delivery)) return;
		const resultIndex = results.length;
		results.push(delivery);
		reportedResults.push({
			identityKey: resultIdentityKey(delivery),
			resultIndex
		});
		await params.onDeliveryResult?.(delivery);
	};
	const recordIdentifiedDeliveryResults = async (deliveries, options) => {
		const reportedByIdentity = /* @__PURE__ */ new Map();
		for (const reported of reportedResults) {
			const matches = reportedByIdentity.get(reported.identityKey) ?? [];
			matches.push(reported.resultIndex);
			reportedByIdentity.set(reported.identityKey, matches);
		}
		try {
			const recorded = [];
			const availableReportedIndices = new Set(reportedResults.map((reported) => reported.resultIndex));
			const replacements = /* @__PURE__ */ new Map();
			const removals = /* @__PURE__ */ new Set();
			const appendResults = [];
			for (const delivery of deliveries) {
				if (!hasDeliveryResultIdentity(delivery)) {
					recorded.push(false);
					continue;
				}
				const receiptPartIds = (delivery.receipt?.parts ?? []).map((part) => part.platformMessageId?.trim()).filter((id) => Boolean(id && id !== "unknown" && id !== "suppressed"));
				const receiptIds = receiptPartIds.length > 0 ? receiptPartIds : [...resultPlatformIds(delivery, { receiptOnly: true })];
				const coveredIndices = [];
				for (const receiptId of receiptIds) {
					const matchingIndices = reportedResults.filter((reported) => availableReportedIndices.has(reported.resultIndex) && !coveredIndices.includes(reported.resultIndex) && results[reported.resultIndex]?.channel === delivery.channel && resultPlatformIds(expectDefined(results[reported.resultIndex], "results entry at reported.result index")).has(receiptId)).map((reported) => reported.resultIndex);
					const matchingIndex = options?.finalResultIsLastReported ? matchingIndices.at(-1) : matchingIndices[0];
					if (matchingIndex !== void 0 && !coveredIndices.includes(matchingIndex)) coveredIndices.push(matchingIndex);
				}
				let reportedIndex;
				if (coveredIndices.length > 0) {
					reportedIndex = Math.min(...coveredIndices);
					for (const coveredIndex of coveredIndices) {
						availableReportedIndices.delete(coveredIndex);
						if (coveredIndex !== reportedIndex) removals.add(coveredIndex);
					}
				} else {
					const reportedMatches = (reportedByIdentity.get(resultIdentityKey(delivery)) ?? []).filter((index) => availableReportedIndices.has(index));
					reportedIndex = options?.finalResultIsLastReported ? reportedMatches.at(-1) : reportedMatches[0];
					if (reportedIndex !== void 0) availableReportedIndices.delete(reportedIndex);
				}
				if (reportedIndex !== void 0) replacements.set(reportedIndex, delivery);
				else appendResults.push(delivery);
				recorded.push(true);
			}
			if (replacements.size > 0 || removals.size > 0) {
				const reconciled = results.flatMap((result, index) => {
					if (removals.has(index)) return [];
					return [replacements.get(index) ?? result];
				});
				results.splice(0, results.length, ...reconciled);
			}
			for (const delivery of appendResults) {
				results.push(delivery);
				await params.onDeliveryResult?.(delivery);
			}
			return recorded;
		} finally {
			reportedResults = [];
		}
	};
	const recordIdentifiedDeliveryResult = async (delivery) => (await recordIdentifiedDeliveryResults([delivery], { finalResultIsLastReported: true }))[0] ?? false;
	return {
		recordIdentifiedDeliveryResult,
		recordIdentifiedDeliveryResults,
		reportIdentifiedDeliveryResult,
		resetReportedResults: () => {
			reportedResults = [];
		}
	};
}
//#endregion
//#region src/infra/outbound/deliver-transcript.ts
const log$3 = createSubsystemLogger("outbound/deliver");
const loadTranscriptRuntime = createLazyRuntimeModule(() => import("./transcript.runtime.js"));
async function mirrorDeliveredPayloads(params) {
	const mirror = params.delivery.mirror;
	if (!mirror || params.payloads.length === 0) return;
	const deliveredMirror = {
		text: params.payloads.map((payload) => payload.hookContent ?? resolveOutboundPayloadMirrorText(payload)).filter((text) => text.trim()).join("\n"),
		mediaUrls: params.payloads.flatMap((payload) => payload.mediaUrls)
	};
	const mirrorText = resolveMirroredTranscriptText({
		text: deliveredMirror.text,
		mediaUrls: deliveredMirror.mediaUrls
	});
	if (!mirrorText) return;
	try {
		const { appendAssistantMessageToSessionTranscript } = await loadTranscriptRuntime();
		const writerFence = getOwnedSessionTranscriptWriterFence();
		const mirrorResult = await appendAssistantMessageToSessionTranscript({
			agentId: mirror.agentId,
			sessionKey: mirror.sessionKey,
			expectedSessionId: mirror.expectedSessionId,
			...writerFence?.expectedLifecycleRevision !== void 0 ? { expectedLifecycleRevision: writerFence.expectedLifecycleRevision } : {},
			...writerFence ? { expectedWriterRunId: writerFence.expectedWriterRunId } : {},
			text: mirrorText,
			idempotencyKey: mirror.idempotencyKey,
			deliveryMirror: mirror.deliveryMirror,
			config: params.delivery.cfg
		});
		if (!mirrorResult.ok) log$3.warn(`failed to mirror outbound delivery into session transcript; channel send already succeeded: ${mirrorResult.reason}`, {
			channel: params.channel,
			to: params.to,
			sessionKey: mirror.sessionKey
		});
	} catch (err) {
		log$3.warn(`failed to mirror outbound delivery into session transcript; channel send already succeeded: ${formatErrorMessage(err)}`, {
			channel: params.channel,
			to: params.to,
			sessionKey: mirror.sessionKey
		});
	}
}
//#endregion
//#region src/infra/outbound/message-plan.ts
function assertStableMediaFanout(params, payloadIndex, originalMediaCount, effective) {
	if (!params.requiredUnknownSendReconciliation) return;
	if ((params.renderedBatchPlan?.items[payloadIndex]?.mediaUrls.length ?? originalMediaCount) !== effective.mediaUrls.length) throw new Error(`Required durable message send changed platform fan-out after outbound transforms for ${params.channel}`);
}
function withPlannedReplyTo(overrides, consumeReplyTo) {
	return consumeReplyTo ? consumeReplyTo({ ...overrides }) : { ...overrides };
}
function chunkTextForPlan(params) {
	const chunks = params.formatting ? params.chunker(params.text, params.limit, { formatting: params.formatting }) : params.chunker(params.text, params.limit);
	return chunks.length === 0 && params.text ? [params.text] : chunks;
}
/**
* Plans text sends, preserving reply-to policy across chunked delivery units.
*/
function planOutboundTextMessageUnits(params) {
	const planTextUnit = (text, deliveryPartIndex, chunkedTextFormatting) => {
		const overrides = {
			...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
			deliveryPartIndex
		};
		return {
			kind: "text",
			text,
			overrides: chunkedTextFormatting ? {
				...overrides,
				formatting: {
					...overrides.formatting,
					...chunkedTextFormatting
				}
			} : overrides
		};
	};
	const withDeliveryTopology = (units) => {
		const deliveryPartCount = units.length;
		for (const unit of units) unit.overrides.deliveryPartCount = deliveryPartCount;
		return units;
	};
	if (!params.chunker || params.textLimit === void 0) return withDeliveryTopology([planTextUnit(params.text, 0)]);
	if (params.chunkMode === "newline") {
		const blockChunks = (params.chunkerMode ?? "text") === "markdown" ? chunkMarkdownTextWithMode(params.text, params.textLimit, "newline") : chunkByParagraph(params.text, params.textLimit);
		if (!blockChunks.length && params.text) blockChunks.push(params.text);
		const units = [];
		for (const blockChunk of blockChunks) {
			const chunks = chunkTextForPlan({
				text: blockChunk,
				limit: params.textLimit,
				chunker: params.chunker,
				formatting: params.formatting
			});
			for (const chunk of chunks) units.push(planTextUnit(chunk, units.length, params.chunkedTextFormatting));
		}
		return withDeliveryTopology(units);
	}
	return withDeliveryTopology(chunkTextForPlan({
		text: params.text,
		limit: params.textLimit,
		chunker: params.chunker,
		formatting: params.formatting
	}).map((chunk, index) => planTextUnit(chunk, index, params.chunkedTextFormatting)));
}
/**
* Plans media sends with a caption only on the leading media unit.
*/
function planOutboundMediaMessageUnits(params) {
	const deliveryPartCount = params.mediaUrls.length;
	return params.mediaUrls.map((mediaUrl, index) => ({
		kind: "media",
		mediaUrl,
		...index === 0 ? { caption: params.caption } : {},
		overrides: {
			...withPlannedReplyTo(params.overrides, params.consumeReplyTo),
			deliveryPartIndex: index,
			deliveryPartCount
		}
	}));
}
//#endregion
//#region src/infra/outbound/deliver-core.ts
const log$2 = createSubsystemLogger("outbound/deliver");
async function deliverOutboundPayloadsCore(params) {
	const { cfg, channel, to } = params;
	const preparedBatch = params.preparedBatch;
	if (!preparedBatch) throw new Error("Outbound delivery requires a prepared payload batch");
	const accountId = params.accountId;
	const reply = params.reply;
	const deps = params.deps;
	const abortSignal = params.abortSignal;
	const results = [];
	const { recordIdentifiedDeliveryResult, recordIdentifiedDeliveryResults, reportIdentifiedDeliveryResult, resetReportedResults } = createDeliveryResultRecorder({
		results,
		onDeliveryResult: params.onDeliveryResult
	});
	let activeSourceIndex;
	const resolveMediaAccess = (mediaSources) => resolveOutboundMediaAccessForSend(params, channel, mediaSources);
	const createHandler = (mediaSources) => createChannelHandler({
		cfg,
		agentId: params.session?.agentId,
		channel,
		to,
		deps,
		accountId,
		replyToId: reply?.replyToId,
		replyToMode: reply?.source === "implicit" ? reply.mode : void 0,
		formatting: params.formatting,
		threadId: params.threadId,
		identity: params.identity,
		gifPlayback: params.gifPlayback,
		forceDocument: params.forceDocument,
		silent: params.silent,
		mediaAccess: resolveMediaAccess(mediaSources),
		gatewayClientScopes: params.gatewayClientScopes,
		conversationReadOrigin: params.conversationReadOrigin,
		deliveryQueueId: params.deliveryQueueId,
		preparedMessageId: params.preparedMessageId,
		requiredUnknownSendReconciliation: params.requiredUnknownSendReconciliation,
		onPlatformSendStart: async (route) => {
			await params.onPlatformSendStart?.(route, activeSourceIndex);
		},
		onDirectAdapterHandoff: params.onDirectAdapterHandoff,
		onPlatformSendDispatch: params.onPlatformSendDispatch,
		onDeliveryResult: reportIdentifiedDeliveryResult
	});
	const baseHandler = await createHandler([]);
	let preparedTarget = baseHandler.buildTargetRef({ threadId: params.threadId });
	const maybeAdoptTargetFromDelivery = (result) => {
		if (params.threadId != null || preparedTarget.threadId != null) return;
		const adoptedTarget = baseHandler.adoptTargetFromDelivery?.({
			target: preparedTarget,
			result
		});
		if (adoptedTarget?.threadId != null) preparedTarget = {
			...preparedTarget,
			threadId: adoptedTarget.threadId
		};
	};
	const withPreparedTarget = (overrides) => preparedTarget.threadId == null ? overrides : {
		...overrides,
		threadId: preparedTarget.threadId
	};
	const adoptSuccessfulResultsSince = (resultIndex) => {
		for (const result of results.slice(resultIndex)) maybeAdoptTargetFromDelivery(result);
	};
	const handlerByMediaSources = /* @__PURE__ */ new Map();
	const getDeliveryHandler = (mediaSources) => {
		if (mediaSources.length === 0) return Promise.resolve(baseHandler);
		const key = JSON.stringify(mediaSources);
		return getOrCreatePromise(handlerByMediaSources, key, () => createHandler(mediaSources));
	};
	const handler = baseHandler;
	const configuredTextLimit = handler.chunker ? resolveTextChunkLimit(cfg, channel, accountId, { fallbackLimit: handler.textChunkLimit }) : void 0;
	const textLimit = params.formatting?.textLimit ?? (handler.resolveEffectiveTextChunkLimit ? handler.resolveEffectiveTextChunkLimit({
		fallbackLimit: configuredTextLimit,
		formatting: params.formatting
	}) : configuredTextLimit);
	const chunkMode = handler.chunker ? params.formatting?.chunkMode ?? resolveChunkMode(cfg, channel, accountId) : "length";
	const { resolveCurrentReplyTo, applyReplyToConsumption } = createReplyToDeliveryPolicy({ reply });
	const sendTextChunks = async (sendHandler, text, overrides = {}) => {
		const units = planOutboundTextMessageUnits({
			text,
			overrides,
			chunker: sendHandler.chunker,
			chunkerMode: sendHandler.chunkerMode,
			chunkedTextFormatting: sendHandler.chunkedTextFormatting,
			textLimit,
			chunkMode,
			formatting: params.formatting,
			consumeReplyTo: (value) => applyReplyToConsumption(value, { consumeImplicitReply: value.replyToIdSource === "implicit" })
		});
		for (const unit of units) {
			if (unit.kind !== "text") continue;
			throwIfAborted(abortSignal);
			const resultIndex = results.length;
			await recordIdentifiedDeliveryResult(await sendHandler.sendText(unit.text, withPreparedTarget(unit.overrides)));
			adoptSuccessfulResultsSince(resultIndex);
		}
	};
	const acceptedEntries = acceptedPreparedOutboundEntries(preparedBatch);
	const payloadOutcomes = [...preparedOutboundSuppressionOutcomes(preparedBatch)];
	const effectiveDeliveryKinds = /* @__PURE__ */ new Map();
	const recordPayloadOutcome = (outcome) => {
		const deliveryKind = effectiveDeliveryKinds.get(outcome.index);
		const recordedOutcome = deliveryKind && outcome.status !== "suppressed" ? {
			...outcome,
			deliveryKind
		} : outcome;
		payloadOutcomes.push(recordedOutcome);
		params.onPayloadDeliveryOutcome?.(recordedOutcome);
	};
	for (const outcome of payloadOutcomes) params.onPayloadDeliveryOutcome?.(outcome);
	const deliveredMirrorPayloads = [];
	const recordDeliveredPayload = (payloadSummary, deliveredResults) => {
		if (deliveredResults.length === 0) return;
		try {
			params.onDeliveredPayload?.(payloadSummary);
		} catch (error) {
			log$2.warn("Outbound delivered-payload observer failed after platform send.", {
				channel,
				to,
				error: formatErrorMessage(error)
			});
		}
		if (params.mirror) deliveredMirrorPayloads.push(payloadSummary);
	};
	const diagnosticSessionKey = params.mirror?.sessionKey ?? params.session?.key ?? params.session?.policyKey;
	for (const [deliveryPayloadIndex, preparedEntry] of acceptedEntries.entries()) {
		const payloadIndex = preparedEntry.sourceIndex;
		activeSourceIndex = payloadIndex;
		const payload = preparedEntry.payload;
		const payloadResultStartIndex = results.length;
		let effectivePayload;
		let payloadSummary = buildPayloadSummary(payload);
		const originalMediaCount = preparedEntry.preparedMediaCount;
		let deliveryKind = "other";
		let deliveryStartedAt = 0;
		let deliveryStarted = false;
		let deliveryFinished = false;
		let messageSentEventRecorded = false;
		const recordMessageSentEvent = (event) => {
			if (messageSentEventRecorded) return;
			messageSentEventRecorded = true;
			params.onMessageSentEvent?.(event, payloadIndex);
		};
		const startDeliveryDiagnostics = (kind) => {
			deliveryKind = kind;
			deliveryStartedAt = Date.now();
			deliveryStarted = true;
			deliveryFinished = false;
			emitInternalDiagnosticEvent({
				type: "message.delivery.started",
				channel,
				deliveryKind,
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		const completeDeliveryDiagnostics = (resultCount) => {
			if (!deliveryStarted) return;
			deliveryFinished = true;
			emitInternalDiagnosticEvent({
				type: "message.delivery.completed",
				channel,
				deliveryKind,
				durationMs: Date.now() - deliveryStartedAt,
				resultCount,
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		const errorDeliveryDiagnostics = (err) => {
			if (!deliveryStarted || deliveryFinished) return;
			deliveryFinished = true;
			emitInternalDiagnosticEvent({
				type: "message.delivery.error",
				channel,
				deliveryKind,
				durationMs: Date.now() - deliveryStartedAt,
				errorCategory: diagnosticErrorCategory(err),
				...diagnosticSessionKey ? { sessionKey: diagnosticSessionKey } : {}
			});
		};
		try {
			throwIfAborted(abortSignal);
			const deliveryPayload = payload;
			const renderedPayload = stripInternalRuntimeScaffoldingFromPayload(await renderPresentationForDelivery(await getDeliveryHandler(buildPayloadSummary(deliveryPayload).mediaUrls), deliveryPayload));
			const renderedHandler = await getDeliveryHandler(buildPayloadSummary(renderedPayload).mediaUrls);
			const normalizedEffectivePayload = (preparedBatch.channelNormalized !== true || renderedPayload !== deliveryPayload) && renderedHandler.normalizePayload ? renderedHandler.normalizePayload(renderedPayload) : renderedPayload;
			effectivePayload = normalizedEffectivePayload ? normalizeEmptyPayloadForDelivery(stripInternalRuntimeScaffoldingFromPayload(normalizedEffectivePayload)) : null;
			if (!effectivePayload) {
				recordPayloadOutcome(suppressedPayloadOutcome({
					index: payloadIndex,
					reason: preparedEntry.messageHookChanged ? "empty_after_message_sending_hook" : preparedEntry.replyHookChanged ? "empty_after_reply_payload_sending_hook" : "no_visible_payload"
				}));
				continue;
			}
			const effectivePayloadSummary = buildPayloadSummary(effectivePayload);
			assertStableMediaFanout(params, deliveryPayloadIndex, originalMediaCount, effectivePayloadSummary);
			payloadSummary = effectivePayloadSummary;
			const deliveryHandler = await getDeliveryHandler(payloadSummary.mediaUrls);
			const effectiveDeliveryKind = deliveryKindForPayload(effectivePayload, payloadSummary);
			effectiveDeliveryKinds.set(payloadIndex, effectiveDeliveryKind);
			startDeliveryDiagnostics(effectiveDeliveryKind);
			params.onPayload?.(payloadSummary);
			const replyToResolution = resolveCurrentReplyTo(effectivePayload);
			const sendOverrides = {
				replyToId: replyToResolution.replyToId,
				replyToIdSource: replyToResolution.source,
				...preparedTarget.threadId != null ? { threadId: preparedTarget.threadId } : {},
				...effectivePayload.audioAsVoice === true ? { audioAsVoice: true } : {},
				...params.forceDocument !== void 0 ? { forceDocument: params.forceDocument } : {}
			};
			const applySendReplyToConsumption = (overrides) => applyReplyToConsumption(overrides, { consumeImplicitReply: replyToResolution.source === "implicit" });
			const deliveryTarget = () => deliveryHandler.buildTargetRef({ threadId: preparedTarget.threadId });
			const beforeCount = results.length;
			let mirroredPayload = payloadSummary;
			let mediaMessageIds;
			if (deliveryHandler.sendPayload && payloadRequiresDurablePayloadTransport(effectivePayload, { sendTextOnlyErrorPayloads: deliveryHandler.sendTextOnlyErrorPayloads })) {
				await recordIdentifiedDeliveryResult(await deliveryHandler.sendPayload(effectivePayload, withPreparedTarget(applySendReplyToConsumption(sendOverrides))));
				adoptSuccessfulResultsSince(beforeCount);
				if (results.slice(beforeCount).length === 0) {
					completeDeliveryDiagnostics(0);
					recordPayloadOutcome(suppressedPayloadOutcome({
						index: payloadIndex,
						reason: "adapter_returned_no_identity"
					}));
					continue;
				}
			} else if (payloadSummary.mediaUrls.length === 0) if (deliveryHandler.sendFormattedText) {
				await recordIdentifiedDeliveryResults(await deliveryHandler.sendFormattedText(payloadSummary.text, withPreparedTarget(applySendReplyToConsumption(sendOverrides))));
				adoptSuccessfulResultsSince(beforeCount);
			} else await sendTextChunks(deliveryHandler, payloadSummary.text, sendOverrides);
			else if (!deliveryHandler.supportsMedia) {
				log$2.warn("Plugin outbound adapter does not implement sendMedia; media URLs will be dropped and text fallback will be used", {
					channel,
					to,
					mediaCount: payloadSummary.mediaUrls.length
				});
				const fallbackText = payloadSummary.text.trim();
				if (!fallbackText) throw new Error("Plugin outbound adapter does not implement sendMedia and no text fallback is available for media payload");
				await sendTextChunks(deliveryHandler, fallbackText, sendOverrides);
				mirroredPayload = {
					...payloadSummary,
					text: fallbackText,
					mediaUrls: []
				};
			} else {
				mediaMessageIds = {};
				const mediaUnits = planOutboundMediaMessageUnits({
					mediaUrls: payloadSummary.mediaUrls,
					caption: payloadSummary.text,
					overrides: sendOverrides,
					consumeReplyTo: applySendReplyToConsumption
				});
				for (const unit of mediaUnits) {
					if (unit.kind !== "media") continue;
					throwIfAborted(abortSignal);
					const resultIndex = results.length;
					const delivery = deliveryHandler.sendFormattedMedia ? await deliveryHandler.sendFormattedMedia(unit.caption ?? "", unit.mediaUrl, withPreparedTarget(unit.overrides)) : await deliveryHandler.sendMedia(unit.caption ?? "", unit.mediaUrl, withPreparedTarget(unit.overrides));
					const recorded = await recordIdentifiedDeliveryResult(delivery);
					adoptSuccessfulResultsSince(resultIndex);
					if (recorded) {
						mediaMessageIds.first ??= delivery.messageId;
						mediaMessageIds.last = delivery.messageId;
					}
				}
			}
			const deliveredResults = results.slice(beforeCount);
			if (deliveredResults.length > 0) {
				recordPayloadOutcome({
					index: payloadIndex,
					status: "sent",
					results: deliveredResults
				});
				recordDeliveredPayload(mirroredPayload, deliveredResults);
			} else recordPayloadOutcome(suppressedPayloadOutcome({
				index: payloadIndex,
				reason: "adapter_returned_no_identity"
			}));
			const firstMessageId = mediaMessageIds ? mediaMessageIds.first : deliveredResults.find((entry) => entry.messageId)?.messageId;
			const lastMessageId = mediaMessageIds ? mediaMessageIds.last : deliveredResults.at(-1)?.messageId;
			recordMessageSentEvent({
				success: deliveredResults.length > 0,
				content: payloadSummary.hookContent ?? payloadSummary.text,
				messageId: lastMessageId
			});
			await maybePinDeliveredMessage({
				handler: deliveryHandler,
				payload: effectivePayload,
				target: deliveryTarget(),
				messageId: firstMessageId,
				gatewayClientScopes: params.gatewayClientScopes
			});
			await maybeNotifyAfterDeliveredPayload({
				handler: deliveryHandler,
				payload: effectivePayload,
				target: deliveryTarget(),
				results: deliveredResults
			});
			completeDeliveryDiagnostics(deliveredResults.length);
		} catch (err) {
			resetReportedResults();
			const failedPayloadResults = results.slice(payloadResultStartIndex);
			adoptSuccessfulResultsSince(payloadResultStartIndex);
			if (effectivePayload && failedPayloadResults.length > 0) await maybeNotifyAfterDeliveredPayload({
				handler: await getDeliveryHandler(buildPayloadSummary(effectivePayload).mediaUrls),
				payload: effectivePayload,
				target: baseHandler.buildTargetRef({ threadId: preparedTarget.threadId }),
				results: failedPayloadResults
			});
			recordPayloadOutcome({
				index: payloadIndex,
				status: "failed",
				error: err,
				sentBeforeError: failedPayloadResults.length > 0,
				stage: "platform_send",
				results: failedPayloadResults
			});
			errorDeliveryDiagnostics(err);
			recordMessageSentEvent({
				success: false,
				content: payloadSummary.hookContent ?? payloadSummary.text,
				error: formatErrorMessage(err),
				...failedPayloadResults.at(-1)?.messageId ? { messageId: failedPayloadResults.at(-1).messageId } : {}
			});
			if (!params.bestEffort) throw toOutboundDeliveryError({
				error: err,
				results,
				payloadOutcomes,
				stage: "platform_send"
			});
			params.onError?.(err, payloadSummary);
		}
	}
	await mirrorDeliveredPayloads({
		delivery: params,
		payloads: deliveredMirrorPayloads,
		channel,
		to
	});
	return results;
}
//#endregion
//#region src/infra/outbound/deliver-queue-execute.ts
const log$1 = createSubsystemLogger("outbound/deliver");
async function deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt, producerClaimId, producerLeaseSignal) {
	const throwIfProducerLeaseLost = () => {
		if (producerLeaseSignal?.aborted) throw producerLeaseSignal.reason;
	};
	const payloadCount = params.preparedBatch?.sourcePayloadCount ?? params.payloads.length;
	let hadPartialFailure = false;
	let lastPayloadError;
	let partialFailuresAreProvenNotSent = true;
	const ownsAuditTerminal = params.deliveryQueueId === void 0;
	const auditPayloadOutcomes = ownsAuditTerminal && hasTrustedMessageAuditListeners() ? [] : void 0;
	const reusableProducerClaimId = params.reusePendingDeliveryIntent ? producerClaimId : void 0;
	const stablePayloadOutcomes = reusableProducerClaimId ? [] : void 0;
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const platformQueueId = queueId ?? params.deliveryQueueId;
	const platformQueuePolicy = queueId ? queuePolicy : params.queuePolicy ?? "required";
	const platformQueueStateDir = queueId ? void 0 : params.deliveryQueueStateDir;
	const exactReconciliationRequired = params.requireUnknownSendReconciliation === true && platformQueueId !== void 0;
	let queuedPreSendState;
	let queuedPostSendState;
	let platformSendStarted = false;
	let platformSendRoute;
	let platformSendSourceIndex;
	const auditPlatformStartedPayloads = /* @__PURE__ */ new Set();
	const platformDispatchedPayloads = /* @__PURE__ */ new Set();
	let deliveredResults = [];
	let commitHooksRun = false;
	const settleDeliveryCompletion = async (result) => {
		if (!params.deliveryCompletion) return;
		await settleDurableDelivery(params.deliveryCompletion, result ? { result } : { platformSendStarted }, platformQueueStateDir);
	};
	const messageSentEvents = [];
	const sessionKeyForInternalHooks = params.mirror?.sessionKey ?? params.session?.key;
	const { emitMessageSent, hasMessageSentHooks } = createMessageSentEmitter({
		hookRunner: getGlobalHookRunner(),
		channel: params.channel,
		to: params.to,
		accountId: params.accountId,
		sessionKeyForInternalHooks,
		isGroup: params.mirror?.isGroup,
		groupId: params.mirror?.groupId,
		runId: params.preparedBatch?.runId,
		logPrefix: OUTBOUND_DELIVERY_LOG_SCOPE
	});
	if (hasMessageSentHooks && params.session?.agentId && !sessionKeyForInternalHooks) log$1.warn(`${OUTBOUND_DELIVERY_LOG_SCOPE}: session.agentId present without session key; internal message:sent hook will be skipped`, {
		channel: params.channel,
		to: params.to,
		agentId: params.session.agentId
	});
	const flushMessageSentEvents = () => {
		if (params.deferCommitHooks) return;
		for (const event of messageSentEvents) emitMessageSent(event);
		messageSentEvents.length = 0;
	};
	const queueOwner = queueId ? createQueuedDeliveryOwner({
		queueId,
		expectedPlatformSendAttemptId: () => producerClaimId
	}) : void 0;
	const ackOwnedQueue = (options) => {
		throwIfProducerLeaseLost();
		if (!queueOwner) throw new Error("Queued delivery acknowledgement requires a queue id");
		return queueOwner.ack(options);
	};
	const recordOwnedQueueFailure = (record, error) => {
		throwIfProducerLeaseLost();
		if (!queueOwner) throw new Error("Queued delivery failure requires a queue id");
		return queueOwner.fail(record, error);
	};
	const persistOwnedPostSendState = () => {
		throwIfProducerLeaseLost();
		if (!queueId) throw new Error("Queued delivery post-send state requires a queue id");
		return persistQueuedPostSendState({
			queueId,
			queuePolicy,
			...reusableProducerClaimId ? { producerClaimId: reusableProducerClaimId } : {},
			...producerClaimId ? { expectedPlatformSendAttemptId: producerClaimId } : {}
		});
	};
	const emitTerminals = (terminals) => {
		if (!ownsAuditTerminal) return;
		emitOutboundAuditTerminals({
			context: params,
			terminals,
			startedAt: auditStartedAt,
			...queueId ? { queueId } : {}
		});
	};
	const runCommitHooksAfterAck = async () => {
		if (queuedPostSendState !== "acked" || params.deferCommitHooks || commitHooksRun) return;
		commitHooksRun = true;
		flushMessageSentEvents();
		if (deliveredResults.length > 0) await runOutboundDeliveryCommitHooks(deliveredResults);
	};
	const wrappedParams = {
		...params,
		...exactReconciliationRequired && params.payloads.length === 1 ? { deliveryQueueId: platformQueueId } : { deliveryQueueId: void 0 },
		requiredUnknownSendReconciliation: exactReconciliationRequired,
		onPlatformSendStart: async (route, sourceIndex) => {
			params.abortSignal?.throwIfAborted();
			platformSendRoute = route;
			platformSendSourceIndex = sourceIndex;
			if (platformQueueId && !exactReconciliationRequired && queuedPreSendState === void 0) {
				queuedPreSendState = await persistQueuedPreSendState({
					queueId: platformQueueId,
					queuePolicy: platformQueuePolicy,
					stateDir: platformQueueStateDir,
					route,
					producerClaimId,
					retainSpoolArtifacts: queueId === null && params.deliveryQueueId !== void 0
				});
				if (queueId && queuedPreSendState === "acked") queuedPostSendState = "acked";
			}
			if (platformQueueId && sourceIndex !== void 0 && !auditPlatformStartedPayloads.has(sourceIndex)) {
				auditPlatformStartedPayloads.add(sourceIndex);
				emitOutboundAuditLifecycle({
					context: params,
					outcome: "platform_started",
					queueId: platformQueueId,
					startedAt: auditStartedAt,
					payloadIndexes: [sourceIndex]
				});
			}
			params.abortSignal?.throwIfAborted();
			await params.onPlatformSendStart?.(route);
			params.abortSignal?.throwIfAborted();
			platformSendStarted = true;
		},
		onDirectAdapterHandoff: async () => {
			params.abortSignal?.throwIfAborted();
			await params.onPlatformSendDispatch?.();
			params.abortSignal?.throwIfAborted();
		},
		onPlatformSendDispatch: async () => {
			params.abortSignal?.throwIfAborted();
			if (platformQueueId && queuedPreSendState !== "acked" && queuedPostSendState === void 0) try {
				if (producerClaimId) await markDeliveryPlatformSendDispatched(platformQueueId, platformQueueStateDir, platformSendRoute, producerClaimId);
				else await markDeliveryPlatformSendDispatched(platformQueueId, platformQueueStateDir, platformSendRoute);
				queuedPreSendState ??= "marked";
			} catch (dispatchMarkError) {
				if (exactReconciliationRequired || producerClaimId) throw dispatchMarkError;
				log$1.warn(`failed to refresh queued delivery ${platformQueueId} at platform dispatch; continuing best-effort send: ${formatErrorMessage(dispatchMarkError)}`);
			}
			params.abortSignal?.throwIfAborted();
			await params.onPlatformSendDispatch?.();
			params.abortSignal?.throwIfAborted();
			if (platformSendSourceIndex !== void 0) platformDispatchedPayloads.add(platformSendSourceIndex);
		},
		onError: (err, payload) => {
			throwIfProducerLeaseLost();
			hadPartialFailure = true;
			lastPayloadError = err;
			partialFailuresAreProvenNotSent &&= isProvenDeliveryNotSentError(err);
			params.onError?.(err, payload);
		},
		...params.onPayloadDeliveryOutcome || auditPayloadOutcomes || stablePayloadOutcomes ? { onPayloadDeliveryOutcome: (outcome) => {
			if (outcome.status === "failed" && platformDispatchedPayloads.has(outcome.index) && !isProvenDeliveryNotSentError(outcome.error)) outcome.sentBeforeError = true;
			auditPayloadOutcomes?.push(outcome);
			stablePayloadOutcomes?.push(outcome);
			params.onPayloadDeliveryOutcome?.(outcome);
		} } : {},
		onDeliveryResult: async (result) => {
			deliveredResults.push(result);
			if (queueId && queuedPostSendState === void 0) queuedPostSendState = await persistOwnedPostSendState();
			await params.onDeliveryResult?.(result);
		},
		onMessageSentEvent: (event, sourceIndex) => {
			messageSentEvents.push(event);
			params.onMessageSentEvent?.(event, sourceIndex);
		}
	};
	let platformResultsReturned = false;
	try {
		throwIfProducerLeaseLost();
		const conversationAttemptAuthority = params.deliveryCompletion?.kind === "conversation" ? params.deliveryCompletion : params.conversationDeliveryAttemptAuthority;
		if (conversationAttemptAuthority) {
			if (!conversationAttemptAuthority.routeFingerprint || !params.onDeliveryAttempt) throw new PlatformMessageNotDispatchedError("Conversation delivery is missing its current route authorization", {
				cause: void 0,
				retryable: false
			});
			await params.onDeliveryAttempt();
			throwIfProducerLeaseLost();
		}
		const results = await deliverOutboundPayloadsCore(wrappedParams);
		deliveredResults = results;
		throwIfProducerLeaseLost();
		platformResultsReturned = true;
		if (queueId && results.length > 0 && stablePayloadOutcomes?.some((outcome) => outcome.status === "suppressed" && outcome.reason === "adapter_returned_no_identity")) {
			const error = "platform send returned no delivery identity for part of the delivery batch";
			await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, error);
			queuedPostSendState = "failed";
			throw new OutboundDeliveryError(error, {
				cause: /* @__PURE__ */ new Error(error),
				results,
				payloadOutcomes: stablePayloadOutcomes,
				stage: "platform_send"
			});
		}
		if (!queueId) {
			await settleDeliveryCompletion(results.at(-1));
			if (!params.deferCommitHooks) {
				flushMessageSentEvents();
				await runOutboundDeliveryCommitHooks(results);
			}
			emitTerminals(() => hadPartialFailure ? failedOutboundAuditTerminals({
				payloadCount,
				results,
				payloadOutcomes: auditPayloadOutcomes ?? [],
				failureStage: "platform_send"
			}) : completedOutboundAuditTerminals({
				payloadCount,
				results,
				payloadOutcomes: auditPayloadOutcomes ?? []
			}));
			return results;
		}
		if (queueId) if (hadPartialFailure) {
			const partialSendEvidence = results.length > 0 || platformDispatchedPayloads.size > 0 && !partialFailuresAreProvenNotSent || lastPayloadError instanceof OutboundDeliveryError && lastPayloadError.sentBeforeError;
			const postSendState = queuedPostSendState ?? (partialSendEvidence ? await persistOwnedPostSendState() : void 0);
			const error = "partial delivery failure (bestEffort)";
			if (postSendState === void 0 || postSendState === "marked") await recordOwnedQueueFailure(!partialSendEvidence && partialFailuresAreProvenNotSent ? failDeliveryBeforePlatformSend : failDelivery, error).catch((err) => {
				log$1.warn(`failed to mark queued delivery ${queueId} as failed after partial failure; continuing best-effort delivery: ${formatErrorMessage(err)}`);
			});
			else if (postSendState === "acked") {
				await runCommitHooksAfterAck();
				emitTerminals(() => failedOutboundAuditTerminals({
					payloadCount,
					results,
					payloadOutcomes: auditPayloadOutcomes ?? [],
					failureStage: "platform_send"
				}));
			}
		} else {
			const postSendState = queuedPostSendState ?? (results.length > 0 || queuedPreSendState === "marked" ? await persistOwnedPostSendState() : queuedPreSendState === "acked" ? "acked" : void 0);
			await settleDeliveryCompletion(results.at(-1));
			if (results.length === 0 && postSendState === "marked") {
				await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, "platform send returned no delivery identity");
				queuedPostSendState = "failed";
				return results;
			}
			if (postSendState === "acked" ? true : postSendState === "failed" ? false : await (results.length === 0 && typeof params.completionRetention === "object" ? ackOwnedQueue({ suppressCompletionReceipt: true }) : ackOwnedQueue()).then(() => true).catch(async (err) => {
				const hasSendEvidence = deliveredResults.length > 0 || queuedPreSendState !== void 0;
				try {
					if (hasSendEvidence) {
						await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, `failed to ack sent delivery: ${formatErrorMessage(err)}`);
						queuedPostSendState = "failed";
					} else await recordOwnedQueueFailure(failDelivery, `failed to ack unsent delivery: ${formatErrorMessage(err)}`);
				} catch (persistErr) {
					log$1.warn(`failed to preserve queued delivery ${queueId} after ack failure: ${formatErrorMessage(persistErr)}`);
				}
				if (queuePolicy === "required") throw err;
				log$1.warn(hasSendEvidence ? `failed to ack queued delivery ${queueId}; preserved unknown-after-send state: ${formatErrorMessage(err)}` : `failed to ack unsent queued delivery ${queueId}; retained it for retry: ${formatErrorMessage(err)}`);
				return false;
			})) {
				queuedPostSendState = "acked";
				await runCommitHooksAfterAck();
				emitTerminals(() => completedOutboundAuditTerminals({
					payloadCount,
					results,
					payloadOutcomes: auditPayloadOutcomes ?? []
				}));
			}
		}
		return results;
	} catch (err) {
		throwIfProducerLeaseLost();
		if (err instanceof OutboundDeliveryError && err.results.length > 0) deliveredResults = err.results;
		const hasPlatformSendEvidence = deliveredResults.length > 0 || queuedPreSendState === "marked" || queuedPostSendState === "marked" || err instanceof OutboundDeliveryError && err.sentBeforeError || stablePayloadOutcomes?.some((outcome) => outcome.status === "sent") === true;
		const emitFailedTerminals = (failureStage) => emitTerminals(() => failedOutboundAuditTerminals({
			payloadCount,
			results: deliveredResults,
			payloadOutcomes: auditPayloadOutcomes ?? [],
			failureStage
		}));
		const platformSendFailureStage = err instanceof OutboundDeliveryError ? err.stage : "platform_send";
		if (queueId) {
			if (queuedPreSendState === "acked") {
				await runCommitHooksAfterAck();
				emitFailedTerminals(platformSendFailureStage);
			} else if (isDeliveryAbortError(err)) {
				if (hasPlatformSendEvidence) {
					if (queuedPostSendState !== "failed") {
						await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, `delivery aborted after platform send: ${formatErrorMessage(err)}`);
						queuedPostSendState = "failed";
					}
				} else if (params.abortSignal?.aborted !== true) await recordOwnedQueueFailure(failDelivery, formatErrorMessage(err)).catch((failErr) => {
					log$1.warn(`failed to preserve queued delivery ${queueId} after provider abort: ${formatErrorMessage(failErr)}`);
				});
				else if (await (producerClaimId ? ackOwnedQueue({ suppressCompletionReceipt: true }) : ackOwnedQueue()).then(() => true).catch(() => false)) {
					queuedPostSendState = "acked";
					await runCommitHooksAfterAck();
					emitFailedTerminals("queue");
				}
			} else if (!platformResultsReturned) if (deliveredResults.length > 0 || !isProvenDeliveryNotSentError(err) && (platformDispatchedPayloads.size > 0 || err instanceof OutboundDeliveryError && err.sentBeforeError)) {
				try {
					queuedPostSendState ??= await persistOwnedPostSendState();
					if (queuedPostSendState === "marked") {
						await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, formatErrorMessage(err));
						queuedPostSendState = "failed";
					}
				} catch (persistErr) {
					log$1.warn(`failed to preserve queued delivery ${queueId} post-send evidence: ${formatErrorMessage(persistErr)}`);
				}
				await runCommitHooksAfterAck();
				if (queuedPostSendState === "acked") emitFailedTerminals(platformSendFailureStage);
			} else {
				const permanentRejection = findPlatformMessageRejectedError(err);
				let terminalRejectionHandled = false;
				if (permanentRejection) {
					let ownerRejected = false;
					let queueAcked = false;
					try {
						if (producerClaimId !== void 0 && (deliveredResults.length > 0 || queuedPostSendState === "marked" || stablePayloadOutcomes?.some((outcome) => outcome.status === "sent"))) {
							await recordOwnedQueueFailure(failDeliveryAfterPlatformSend, `delivery partially sent before permanent rejection: ${permanentRejection.message}`);
							queuedPostSendState = "failed";
							terminalRejectionHandled = true;
						} else {
							if (params.deliveryCompletion) {
								await rejectDurableDelivery(params.deliveryCompletion, permanentRejection.message, platformQueueStateDir);
								ownerRejected = true;
							}
							await (producerClaimId ? ackOwnedQueue({ suppressCompletionReceipt: true }) : ackOwnedQueue());
							queueAcked = true;
						}
					} catch (rejectionError) {
						log$1.warn(`failed to finalize permanently rejected delivery ${queueId}: ${formatErrorMessage(rejectionError)}`);
					}
					terminalRejectionHandled ||= ownerRejected || queueAcked;
					if (queueAcked) {
						queuedPostSendState = "acked";
						await runCommitHooksAfterAck();
						emitFailedTerminals("platform_send");
					}
				}
				if (!terminalRejectionHandled) if (isProvenDeliveryNotSentError(err) && params.deliveryRetryOwner === "caller" && !params.deliveryCompletion) try {
					throwIfProducerLeaseLost();
					await releaseSpoolArtifacts(await moveToFailed(queueId, platformQueueStateDir, producerClaimId ?? null), platformQueueStateDir);
					emitFailedTerminals(platformSendFailureStage);
				} catch (failErr) {
					log$1.warn(`failed to dead-letter queued delivery ${queueId} after proven-not-sent failure: ${formatErrorMessage(failErr)}`);
				}
				else {
					const recoveryOwnsRetry = isProvenDeliveryNotSentError(err);
					const recordFailure = recoveryOwnsRetry ? failDeliveryBeforePlatformSend : failDelivery;
					try {
						await recordOwnedQueueFailure(recordFailure, formatErrorMessage(err));
						if (recoveryOwnsRetry && err instanceof OutboundDeliveryError) err.recoveryOwnedRetry = true;
					} catch (failErr) {
						log$1.warn(`failed to mark queued delivery ${queueId} as failed: ${formatErrorMessage(failErr)}`);
					}
				}
			}
		} else {
			flushMessageSentEvents();
			emitFailedTerminals(platformSendFailureStage);
		}
		throw err;
	}
}
/** Core delivery logic (extracted for queue wrapper). */
//#endregion
//#region src/infra/outbound/delivery-queue-lease.ts
const PLATFORM_SEND_OWNER_HEARTBEAT_MS = Math.floor(PLATFORM_SEND_OWNER_LEASE_MS / 3);
var DeliveryProducerLeaseLostError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "DeliveryProducerLeaseLostError";
	}
};
function lostProducerLeaseError(id, cause) {
	return new DeliveryProducerLeaseLostError(`Delivery platform claim was lost: ${id}`, { cause });
}
/** Maintains one already-acquired producer claim during fallible preparation and send. */
async function startDeliveryProducerLease(params) {
	let confirmedExpiresAt;
	try {
		const initialExpiry = await params.renew();
		if (initialExpiry === void 0 || initialExpiry <= Date.now()) throw lostProducerLeaseError(params.id);
		confirmedExpiresAt = initialExpiry;
	} catch (error) {
		if (error instanceof DeliveryProducerLeaseLostError) throw error;
		throw lostProducerLeaseError(params.id, error);
	}
	const lost = new AbortController();
	let stopped = false;
	let renewing = false;
	let expiryTimer;
	const abortLost = (cause) => {
		if (!stopped && !lost.signal.aborted) lost.abort(lostProducerLeaseError(params.id, cause));
	};
	const scheduleExpiry = () => {
		if (expiryTimer) clearTimeout(expiryTimer);
		expiryTimer = setTimeout(() => abortLost(), Math.max(1, confirmedExpiresAt - Date.now()));
		expiryTimer.unref?.();
	};
	const renew = async () => {
		if (stopped || renewing || lost.signal.aborted) return;
		renewing = true;
		try {
			const expiresAt = await params.renew();
			if (stopped) return;
			if (expiresAt === void 0) {
				abortLost();
				return;
			}
			confirmedExpiresAt = expiresAt;
			scheduleExpiry();
		} catch (error) {
			if (!stopped && Date.now() >= confirmedExpiresAt) abortLost(error);
		} finally {
			renewing = false;
		}
	};
	scheduleExpiry();
	const heartbeat = setInterval(() => void renew(), PLATFORM_SEND_OWNER_HEARTBEAT_MS);
	heartbeat.unref?.();
	return {
		signal: lost.signal,
		stop: () => {
			if (stopped) return;
			stopped = true;
			clearInterval(heartbeat);
			if (expiryTimer) clearTimeout(expiryTimer);
		}
	};
}
//#endregion
//#region src/infra/outbound/deliver-queue.ts
const log = createSubsystemLogger("outbound/deliver");
function isReusablePreparedDeliveryOwner(owner) {
	return owner?.namespace === "prepared" && (owner.status === "pending" || owner.status === "completed");
}
async function runOutboundDelivery(params) {
	return await runOutboundDeliveryInternal(params);
}
async function runOutboundDeliveryInternal(input) {
	const { replyToId, replyToMode, ...currentParams } = input;
	const reply = normalizeOutboundReplyFacts({
		reply: input.reply,
		replyToId,
		replyToMode
	});
	const params = {
		...currentParams,
		...reply ? { reply } : {}
	};
	const stableIntentId = params.deliveryIntentId?.trim();
	if (stableIntentId) {
		const stableParams = stableIntentId === params.deliveryIntentId ? params : {
			...params,
			deliveryIntentId: stableIntentId
		};
		const claim = await withActiveDeliveryClaim(stableIntentId, async () => {
			const preparation = await withStableDeliveryPreparation({
				id: stableIntentId,
				run: async (owner) => await runOutboundDeliveryWithQueue(stableParams, true, owner)
			});
			return preparation.status === "claimed" ? preparation.value : await runOutboundDeliveryWithQueue(stableParams, true, void 0, false);
		});
		if (claim.status === "claimed") return claim.value;
		if (isReusablePreparedDeliveryOwner(params.reusePendingDeliveryIntent ? findDeliveryIntentOwner(stableIntentId) : null)) return [];
		throw new Error(`Stable delivery intent is already queued: ${stableIntentId}`);
	}
	return await runOutboundDeliveryWithQueue(params, false);
}
async function deliverWithProducerLease(params, queueId, auditStartedAt, producerClaimId) {
	if (params.deliveryProducerLeaseRequired !== true) return await deliverOutboundPayloadsWithQueueCleanup(params, queueId, auditStartedAt, producerClaimId);
	const platformQueueId = queueId ?? params.deliveryQueueId;
	if (!platformQueueId || !producerClaimId) throw new Error("Delivery producer lease requires an exact queue owner");
	const stateDir = queueId ? void 0 : params.deliveryQueueStateDir;
	const lease = await startDeliveryProducerLease({
		id: platformQueueId,
		renew: async () => await renewDeliveryPlatformSendLease(platformQueueId, stateDir, producerClaimId)
	});
	const abortSignal = params.abortSignal ? AbortSignal.any([params.abortSignal, lease.signal]) : lease.signal;
	try {
		return await deliverOutboundPayloadsWithQueueCleanup({
			...params,
			abortSignal
		}, queueId, auditStartedAt, producerClaimId, lease.signal);
	} finally {
		lease.stop();
	}
}
async function runOutboundDeliveryWithQueue(params, stableIntentClaimHeld, stablePreparationOwner, allowFreshPreparation = true) {
	const auditStartedAt = Date.now();
	const { channel, to, payloads } = params;
	const emitPreQueueFailure = () => {
		if (params.deliveryQueueId !== void 0) return;
		emitOutboundAuditTerminals({
			context: params,
			terminals: () => uniformOutboundAuditTerminals(params.payloads.length, {
				outcome: "failed",
				failureStage: "queue"
			}),
			startedAt: auditStartedAt
		});
	};
	if (params.requireUnknownSendReconciliation === true && payloads.length !== 1) {
		emitPreQueueFailure();
		throw new Error(`Required durable message send is unsupported for ${channel}: unknown-send reconciliation requires exactly one payload`);
	}
	if (params.deferredDeliveryAdmissionPassed !== true) {
		const admission = resolveDeferredDeliveryAdmission({
			cfg: params.cfg,
			channel,
			to,
			accountId: params.accountId,
			phase: "live"
		}, { agentId: params.session?.agentId });
		if (admission.status === "permanent_rejection") {
			emitPreQueueFailure();
			throw new Error(admission.reason);
		}
	}
	const queuePolicy = params.queuePolicy ?? "best_effort";
	const existingStableDelivery = params.deliveryIntentId ? await loadPendingDelivery(params.deliveryIntentId) : null;
	if (params.deliveryIntentId && !existingStableDelivery && !stablePreparationOwner) {
		const owner = findDeliveryIntentOwner(params.deliveryIntentId);
		if (owner) {
			if (params.reusePendingDeliveryIntent && isReusablePreparedDeliveryOwner(owner)) return [];
			throw new Error(owner.namespace === "legacy" ? `Stable delivery intent is awaiting queue migration: ${params.deliveryIntentId}` : `Stable delivery intent is already queued: ${params.deliveryIntentId}`);
		}
	}
	if (params.deliveryIntentId && !existingStableDelivery && !allowFreshPreparation) throw new Error(`Stable delivery intent is already queued: ${params.deliveryIntentId}`);
	if (existingStableDelivery && !params.reusePendingDeliveryIntent) throw new Error(`Stable delivery intent is already queued: ${params.deliveryIntentId}`);
	let preparedBatch;
	try {
		preparedBatch = existingStableDelivery?.preparedBatch ?? params.preparedBatch ?? await prepareOutboundPayloadBatch(params, { onBeforeFirstModifier: stablePreparationOwner?.beforeFirstModifier });
		stablePreparationOwner?.markPrepared();
	} catch (error) {
		emitPreQueueFailure();
		if (params.payloads.length > 0) {
			const { emitMessageSent } = createMessageSentEmitter({
				hookRunner: getGlobalHookRunner(),
				channel,
				to,
				accountId: params.accountId,
				sessionKeyForInternalHooks: params.mirror?.sessionKey ?? params.session?.key,
				isGroup: params.mirror?.isGroup,
				groupId: params.mirror?.groupId,
				runId: params.replyPayloadSendingHook?.runId,
				logPrefix: OUTBOUND_DELIVERY_LOG_SCOPE
			});
			for (const payload of params.payloads) {
				const summary = buildPayloadSummary(payload);
				emitMessageSent({
					success: false,
					content: summary.hookContent ?? summary.text,
					error: formatErrorMessage(error)
				});
			}
		}
		throw error;
	}
	const preparedPayloads = acceptedPreparedOutboundEntries(preparedBatch).map((entry) => entry.payload);
	const preparedRenderedBatchPlan = existingStableDelivery?.renderedBatchPlan ?? (params.preparedBatch ? params.renderedBatchPlan : void 0) ?? createRenderedMessageBatchPlan(preparedPayloads);
	let unknownSendReconciliationEnabled = params.requireUnknownSendReconciliation === true;
	if (params.requireUnknownSendReconciliation !== false && preparedPayloads.length === 1) {
		const requirements = deriveDurableFinalDeliveryRequirementsForBatch({
			payloads: preparedPayloads,
			replyToId: params.reply?.replyToId,
			threadId: params.threadId,
			silent: params.silent,
			reconcileUnknownSend: true
		});
		delete requirements.messageSendingHooks;
		const support = await resolveOutboundDurableFinalDeliverySupport({
			cfg: params.cfg,
			agentId: params.session?.agentId,
			channel,
			requirements
		});
		if (params.requireUnknownSendReconciliation === true && !support.ok) {
			emitPreQueueFailure();
			throw new Error(`Required durable message send is unsupported for ${channel}: prepared payload capability mismatch${support.capability ? ` (${support.capability})` : ""}`);
		}
		unknownSendReconciliationEnabled = support.ok && (params.requireUnknownSendReconciliation === true || support.automaticUnknownSendReconciliation);
	}
	const deliveryParams = {
		...params,
		payloads: preparedPayloads,
		preparedBatch,
		renderedBatchPlan: preparedRenderedBatchPlan,
		...unknownSendReconciliationEnabled ? { requireUnknownSendReconciliation: true } : {}
	};
	const shouldPersistSuppressedIntent = Boolean(params.deliveryIntentId || params.deliveryCompletion || params.completionRetention);
	const queued = params.skipQueue || preparedPayloads.length === 0 && !shouldPersistSuppressedIntent ? null : await stageAndEnqueueOutboundDelivery(deliveryParams, preparedBatch, {
		claimForLiveDelivery: true,
		...stablePreparationOwner ? { getStablePreparation: stablePreparationOwner.current } : {}
	}).catch((err) => {
		if (queuePolicy === "required" || err instanceof StableDeliveryPreparationLostError) {
			emitPreQueueFailure();
			throw err;
		}
		log.warn(`outbound queue write failed; continuing without durability (channel=${params.channel} to=${params.to}): ${formatErrorMessage(err)}`);
		return null;
	});
	const queueId = queued?.id ?? null;
	if (queued?.created && stablePreparationOwner) stablePreparationOwner.markPublished();
	if (queueId && params.deliveryCompletion) {
		if ((await markDurableDeliveryQueued(params.deliveryCompletion, queueId, queued?.created ? "prepared" : void 0)).state !== "queued") {
			await createQueuedDeliveryOwner({
				queueId,
				expectedPlatformSendAttemptId: queued?.producerClaimId
			}).ack({ suppressCompletionReceipt: true });
			return [];
		}
	}
	if (queueId) emitOutboundAuditLifecycle({
		context: deliveryParams,
		outcome: "queued",
		queueId,
		startedAt: auditStartedAt
	});
	if (queueId) params.onDeliveryIntent?.({
		id: queueId,
		channel,
		to,
		...params.accountId ? { accountId: params.accountId } : {},
		queuePolicy
	});
	if (!queueId) return await deliverWithProducerLease(deliveryParams, null, auditStartedAt, params.deliveryProducerClaimId);
	if (!queued?.created && !params.reusePendingDeliveryIntent) throw new Error(`Stable delivery intent is already queued: ${queueId}`);
	const deliverClaimedIntent = async () => {
		const producerClaimId = queued?.producerClaimId ?? (params.reusePendingDeliveryIntent ? await claimReusableDeliveryPlatformSendAttempt(queueId) : void 0);
		if (!producerClaimId) throw new Error(queued?.created ? `Delivery platform claim was lost: ${queueId}` : `Stable delivery intent is already queued: ${queueId}`);
		let claimedDeliveryParams = {
			...deliveryParams,
			deliveryProducerLeaseRequired: true
		};
		if (queued?.created !== true) {
			const queuedEntry = await loadPendingDelivery(queueId);
			if (!queuedEntry || queuedEntry.producerClaimId !== producerClaimId) throw new Error(`Delivery platform claim was lost: ${queueId}`);
			claimedDeliveryParams = {
				...restoreQueuedDeliveryCustody(deliveryParams, queuedEntry),
				deliveryProducerLeaseRequired: true
			};
		}
		return deliverWithProducerLease(claimedDeliveryParams, queueId, auditStartedAt, producerClaimId);
	};
	if (stableIntentClaimHeld) return await deliverClaimedIntent();
	const claimResult = await withActiveDeliveryClaim(queueId, deliverClaimedIntent);
	if (claimResult.status === "claimed") return claimResult.value;
	if (params.reusePendingDeliveryIntent) return [];
	return [];
}
//#endregion
//#region src/infra/outbound/deliver.ts
/**
* @deprecated Direct outbound delivery is compatibility/runtime substrate.
* New message lifecycle code should use `sendDurableMessageBatch` or
* `deliverInboundReplyWithMessageSendContext`.
*/
async function deliverOutboundPayloads(params) {
	return await runOutboundDelivery(params);
}
async function deliverOutboundPayloadsInternal(params) {
	return await runOutboundDeliveryInternal(params);
}
//#endregion
export { deliverOutboundPayloadsInternal as n, stageAndEnqueueOutboundDelivery as r, deliverOutboundPayloads as t };
