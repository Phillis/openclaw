import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { i as resolveGlobalSingleton, n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.js";
import { o as resolveSessionStorePathCore } from "./paths-CfFmgJmW.js";
import { _ as readToolAllowlistIntersection } from "./tool-policy-CWmnHLY1.js";
import { h as runWithGatewayIndependentRootWorkContinuation } from "./gateway-work-admission-BNrqZgKC.js";
import { t as normalizeChatType } from "./chat-type-CG0X_HJM.js";
import { n as channelRouteDedupeKey, t as channelRouteCompactKey } from "./channel-route-BRTlwR_x.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { $t as loadSessionEntryReadOnly } from "./session-accessor-CIiPoGwM.js";
import "./message-channel-C3nRvjrX.js";
import { n as combineChannelAdmissionEvidence, r as compareChannelAdmissionParticipants } from "./admission-evidence-UgNy_kxM.js";
import "./sessions-Bh837xaa.js";
import { A as waitForQueueDebounce, D as previewQueueSummaryPrompt, E as hasCrossChannelItems, O as removeQueuedItemsByRef, S as buildCollectPrompt, T as drainNextQueueItem, c as trimSummaryElisionsToCap, d as completeFollowupRunLifecycle, f as isFollowupRunAborted, g as retireFollowupRunCancellation, n as FOLLOWUP_QUEUES, p as isFollowupRunDeferredError, r as clearFollowupQueue, u as admitFollowupRunLifecycle, w as drainCollectQueueStep, x as beginQueueDrain } from "./state-DyigdfFK.js";
import { n as clearCommandLane } from "./command-queue-B992TXUy.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-CPjTRX5t.js";
import { a as createUserTurnTranscriptRecorder, n as buildPersistedUserTurnMediaInputsFromFields } from "./user-turn-transcript-CxlxjVGx.js";
import { t as resolveEmbeddedSessionLane } from "./lanes-CVttd5qX.js";
import { t as isRoutableChannel } from "./route-reply-3zhzj640.js";
import { createHash } from "node:crypto";
//#region src/auto-reply/reply/queue/drain.ts
const FOLLOWUP_RUN_CALLBACKS = resolveGlobalMap(Symbol.for("openclaw.followupDrainCallbacks"));
const queuedAdmissionOwnerState = resolveGlobalSingleton(Symbol.for("openclaw.queuedAdmissionOwnerState"), () => ({
	keys: /* @__PURE__ */ new WeakMap(),
	nextId: 1
}));
function hasExclusiveTurnAdmission(lifecycle) {
	return lifecycle?.admission === "exclusive";
}
function resolveTurnAdoptionLifecycleDeliveryKey(lifecycle) {
	if (!lifecycle) return "";
	const explicitOwnerKey = lifecycle.ownerKey ?? "";
	if (!hasExclusiveTurnAdmission(lifecycle)) return explicitOwnerKey;
	let admissionOwnerKey = queuedAdmissionOwnerState.keys.get(lifecycle);
	if (!admissionOwnerKey) {
		admissionOwnerKey = `admission:${queuedAdmissionOwnerState.nextId++}`;
		queuedAdmissionOwnerState.keys.set(lifecycle, admissionOwnerKey);
	}
	return JSON.stringify([explicitOwnerKey, admissionOwnerKey]);
}
function assertSingleAdmissionOwner(items) {
	if (new Set(items.flatMap((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle) ? [item.turnAdoptionLifecycle] : [])).size > 1) throw new Error("followup queue cannot aggregate distinct admission lifecycles");
}
function rememberFollowupDrainCallback(key, runFollowup) {
	FOLLOWUP_RUN_CALLBACKS.set(key, runFollowup);
}
function clearFollowupDrainCallback(key) {
	FOLLOWUP_RUN_CALLBACKS.delete(key);
}
/** Restart the drain for `key` if it is currently idle, using the stored callback. */
function kickFollowupDrainIfIdle(key) {
	const cb = FOLLOWUP_RUN_CALLBACKS.get(key);
	if (!cb) return;
	scheduleFollowupDrain(key, cb);
}
function resolveOriginRoutingMetadata(items) {
	const source = items.find((item) => item.originatingChannel && item.originatingTo) ?? items.find((item) => item.originatingChannel || item.originatingTo || item.originatingAccountId || item.originatingThreadId != null || item.originatingChatId || item.originatingReplyToId || item.originatingReplyToMode || item.originatingChatType);
	if (!source) return {};
	return {
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType
	};
}
function hasVerifiedAdmissionParticipant(run) {
	return compareChannelAdmissionParticipants([run.channelAdmissionEvidence]) === "same";
}
function resolveFollowupAuthorizationKey(run) {
	const execution = run.run;
	return JSON.stringify([
		execution.senderId ?? "",
		JSON.stringify(execution.channelContext ?? null),
		stableStringify(execution.conversationToolPolicy ?? null),
		execution.senderE164 ?? "",
		execution.senderIsOwner === true,
		execution.execOverrides?.host ?? "",
		execution.execOverrides?.security ?? "",
		execution.execOverrides?.ask ?? "",
		execution.execOverrides?.node ?? "",
		execution.execOverrides?.nodeCwd ?? "",
		execution.bashElevated?.enabled === true,
		execution.bashElevated?.allowed === true,
		execution.bashElevated?.defaultLevel ?? "",
		execution.approvalReviewerDeviceId ?? ""
	]);
}
function resolveCollectedRun(items, source) {
	if (compareChannelAdmissionParticipants(items.map((item) => item.channelAdmissionEvidence)) === "same" || !items.every((item) => hasVerifiedAdmissionParticipant(item))) return source;
	return {
		...source,
		senderId: void 0,
		senderName: void 0,
		senderUsername: void 0,
		senderE164: void 0,
		senderIsOwner: false,
		traceAuthorized: false,
		ownerNumbers: []
	};
}
function resolveFollowupDeliveryContextKey(run) {
	const execution = run.run;
	const provenance = execution.inputProvenance;
	return JSON.stringify([
		channelRouteDedupeKey({
			channel: run.originatingChannel,
			to: run.originatingTo,
			accountId: run.originatingAccountId,
			threadId: run.originatingThreadId
		}),
		run.originatingChatId ?? "",
		resolveFollowupReplyAnchor(run) ?? "",
		run.originatingReplyToMode ?? "",
		normalizeChatType(run.originatingChatType) ?? "",
		resolveFollowupAuthorizationKey(run),
		run.turnAdoptionLifecycle?.ownerKey ?? "",
		normalizeOptionalString(execution.runtimePolicySessionKey ?? execution.sessionKey) ?? "",
		execution.provider,
		execution.model,
		execution.messageProvider ?? "",
		JSON.stringify([...new Set(execution.clientCaps ?? [])].toSorted()),
		stableStringify(execution.toolBindings ?? null),
		execution.chatType ?? "",
		execution.agentAccountId ?? "",
		execution.groupId ?? "",
		execution.groupChannel ?? "",
		execution.groupSpace ?? "",
		JSON.stringify([...new Set(execution.memberRoleIds ?? [])].toSorted()),
		execution.spawnedBy ?? "",
		execution.traceAuthorized === true,
		execution.elevatedLevel ?? "",
		provenance?.kind ?? "",
		provenance?.originSessionId ?? "",
		provenance?.sourceSessionKey ?? "",
		provenance?.sourceChannel ?? "",
		provenance?.sourceTool ?? "",
		stableStringify(execution.trustedInternalHandoff ?? null),
		stableStringify(execution.scheduledToolPolicy ?? null),
		stableStringify(execution.runtimePluginToolGrant ?? null),
		stableStringify(run.toolsAllow ?? null),
		stableStringify(run.toolsAllow ? readToolAllowlistIntersection(run.toolsAllow) ?? null : null),
		run.disableTools === true,
		execution.extraSystemPrompt ?? "",
		execution.extraSystemPromptStatic ?? "",
		execution.sourceReplyDeliveryMode ?? "",
		execution.taskSuggestionDeliveryMode ?? "",
		execution.silentReplyPromptMode ?? "",
		execution.enforceFinalTag === true,
		execution.skipProviderRuntimeHints === true,
		execution.silentExpected === true,
		execution.allowEmptyAssistantReplyAsSilent === true,
		execution.suppressNextUserMessagePersistence === true,
		execution.suppressTranscriptOnlyAssistantPersistence === true,
		execution.blockReplyBreak,
		resolveTurnAdoptionLifecycleDeliveryKey(run.turnAdoptionLifecycle)
	]);
}
function resolveFollowupReplyAnchor(run) {
	if (run.originatingReplyToMode === "off") return;
	const replyToId = normalizeOptionalString(run.originatingReplyToId);
	if (replyToId || normalizeMessageChannel(run.originatingChannel) !== "slack") return replyToId;
	const threadId = run.originatingThreadId;
	return (typeof threadId === "number" ? Number.isFinite(threadId) : normalizeOptionalString(threadId) !== void 0) ? void 0 : normalizeOptionalString(run.messageId);
}
function splitCollectItemsByDeliveryContext(items) {
	if (items.length <= 1) return items.length === 0 ? [] : [items];
	const groups = [];
	let currentGroup = [];
	let currentKey;
	for (const item of items) {
		const itemKey = resolveFollowupDeliveryContextKey(item);
		if (currentGroup.length === 0 || itemKey === currentKey) {
			currentGroup.push(item);
			currentKey = itemKey;
			continue;
		}
		groups.push(currentGroup);
		currentGroup = [item];
		currentKey = itemKey;
	}
	if (currentGroup.length > 0) groups.push(currentGroup);
	return groups;
}
function renderCollectItem(item, idx) {
	return renderCollectItemPrompt(item, idx, item.prompt);
}
function renderCollectItemPrompt(item, idx, prompt) {
	const senderLabel = item.run.senderName ?? item.run.senderUsername ?? item.run.senderId ?? item.run.senderE164;
	const senderSuffix = senderLabel ? ` (from ${senderLabel})` : "";
	return `---\nQueued #${idx + 1}${senderSuffix}\n${prompt}`.trim();
}
function collectQueuedPromptMedia(items) {
	const images = [];
	const imageOrder = [];
	const media = [];
	for (const item of items) {
		if (item.images) images.push(...item.images);
		if (item.imageOrder) imageOrder.push(...item.imageOrder);
		if (item.media) media.push(...item.media);
	}
	return {
		...images.length > 0 ? { images } : {},
		...imageOrder.length > 0 ? { imageOrder } : {},
		...media.length > 0 ? { media } : {}
	};
}
function hasCurrentTurnRuntimeMetadata(item) {
	return item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true || Boolean(item.currentInboundContext);
}
function hasRuntimeOnlyFollowupMetadata(item) {
	return item.currentInboundEventKind === "room_event" || item.currentInboundAudio === true;
}
function buildCollectTranscriptPrompt(items) {
	return buildCollectPrompt({
		title: "[Queued messages while agent was busy]",
		items,
		renderItem: (item, index) => renderCollectItemPrompt(item, index, item.transcriptPrompt ?? item.prompt)
	});
}
function resolveFollowupTranscriptTarget(source) {
	const sessionKey = normalizeOptionalString(source.run.sessionKey) ?? source.run.sessionId;
	const storePath = resolveSessionStorePathCore(source.run.config.session?.store, { agentId: source.run.agentId });
	const sessionEntry = loadSessionEntryReadOnly({
		storePath,
		sessionKey,
		clone: false
	});
	return {
		sessionId: sessionEntry?.sessionId ?? source.run.sessionId,
		sessionKey,
		sessionEntry,
		storePath,
		agentId: source.run.agentId,
		cwd: source.run.cwd ?? source.run.workspaceDir,
		config: source.run.config
	};
}
function createCollectUserTurnTranscriptRecorder(items) {
	const transcriptSources = items.filter((item) => item.userTurnTranscriptRecorder);
	const source = transcriptSources.at(-1);
	if (!source) return;
	const buildInput = async () => {
		const messages = await Promise.all(transcriptSources.map(async (item) => await item.userTurnTranscriptRecorder?.resolveMessage()));
		const media = messages.flatMap((message) => buildPersistedUserTurnMediaInputsFromFields(message));
		const timestamp = messages.reduce((latest, message) => {
			const candidate = message?.timestamp;
			return typeof candidate === "number" && (latest === void 0 || candidate > latest) ? candidate : latest;
		}, void 0);
		const transcriptPrompt = buildCollectTranscriptPrompt(transcriptSources);
		const identityHash = createHash("sha256").update(JSON.stringify(transcriptSources.map((item) => [
			item.messageId ?? "",
			item.enqueuedAt,
			item.transcriptPrompt
		]))).digest("hex");
		return {
			text: transcriptPrompt,
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance,
			idempotencyKey: `followup-collect:${source.run.sessionId}:${identityHash}`,
			...timestamp === void 0 ? {} : { timestamp },
			...media.length === 0 ? {} : { media }
		};
	};
	return createUserTurnTranscriptRecorder({
		input: {
			text: buildCollectTranscriptPrompt(transcriptSources),
			senderIsOwner: source.run.senderIsOwner,
			provenance: source.run.inputProvenance
		},
		resolveInput: buildInput,
		target: () => resolveFollowupTranscriptTarget(source),
		errorContext: "collected followup user turn transcript",
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook
	});
}
function resolveAggregateOwner(items) {
	return items.findLast((item) => item.abortSignal) ?? items.findLast((item) => item.turnAdoptionLifecycle) ?? items.at(-1);
}
function requiresIndividualCollectDrain(item) {
	return item.disableCollectBatching === true || hasRuntimeOnlyFollowupMetadata(item);
}
function createAggregateCancellation(items) {
	const owner = resolveAggregateOwner(items);
	const sourceSignals = /* @__PURE__ */ new Map();
	for (const item of items) {
		if (!item.abortSignal) continue;
		const owners = sourceSignals.get(item.abortSignal) ?? /* @__PURE__ */ new Set();
		owners.add(item);
		sourceSignals.set(item.abortSignal, owners);
	}
	const signals = new Set(sourceSignals.keys());
	if (signals.size === 0) return {
		signal: void 0,
		admit: () => void 0,
		dispose: () => void 0
	};
	const onlySignal = signals.size === 1 ? signals.values().next().value : void 0;
	const onlySignalOwned = onlySignal && owner ? sourceSignals.get(onlySignal)?.has(owner) === true : false;
	if (onlySignal && onlySignalOwned) return {
		signal: onlySignal,
		admit: () => void 0,
		dispose: () => void 0
	};
	const controller = new AbortController();
	const listeners = /* @__PURE__ */ new Map();
	for (const signal of signals) {
		const abort = () => controller.abort();
		listeners.set(signal, abort);
		if (signal.aborted) abort();
		else signal.addEventListener("abort", abort, { once: true });
	}
	const disposeSignal = (signal) => {
		const listener = listeners.get(signal);
		if (!listener) return;
		signal.removeEventListener("abort", listener);
		listeners.delete(signal);
	};
	return {
		signal: controller.signal,
		admit: () => {
			for (const [signal, sourceOwners] of sourceSignals) if (!owner || !sourceOwners.has(owner)) disposeSignal(signal);
		},
		dispose: () => {
			for (const signal of listeners.keys()) disposeSignal(signal);
		}
	};
}
function collectCurrentInboundContext(items) {
	const contexts = items.flatMap((item, index) => item.currentInboundContext ? [{
		context: item.currentInboundContext,
		index
	}] : []);
	if (contexts.length === 0) return;
	if (contexts.length === 1) return contexts[0]?.context;
	const renderField = (field) => {
		const blocks = contexts.flatMap(({ context, index }) => {
			const value = context[field];
			return value ? [`Queued #${index + 1} context:\n${value}`] : [];
		});
		return blocks.length > 0 ? blocks.join("\n\n") : void 0;
	};
	const text = renderField("text");
	if (!text) return;
	const resumableText = renderField("resumableText");
	const injectedGoalContexts = [...new Set(contexts.flatMap(({ context }) => context.injectedGoalContexts ?? []))];
	return {
		text,
		...resumableText ? { resumableText } : {},
		promptJoiner: "\n\n",
		...injectedGoalContexts.length > 0 ? { injectedGoalContexts } : {}
	};
}
function collectRuntimeMetadata(items, abortSignal) {
	const currentTurnSource = items.find(hasCurrentTurnRuntimeMetadata);
	const authoritySource = items.at(-1);
	const deliveryCorrelations = items.flatMap((item) => item.deliveryCorrelations ?? []);
	const admissionWaitCallbacks = new Set(items.flatMap((item) => item.onReplyAdmissionWaitChange ? [item.onReplyAdmissionWaitChange] : []));
	const explicitSkillSelections = [...new Map(items.flatMap((item) => item.explicitSkillSelections ?? []).map((selection) => [selection.path, selection])).values()];
	return {
		currentInboundEventKind: currentTurnSource?.currentInboundEventKind,
		currentInboundAudio: currentTurnSource?.currentInboundAudio,
		currentInboundContext: collectCurrentInboundContext(items),
		explicitSkillSelections: explicitSkillSelections.length > 0 ? explicitSkillSelections : void 0,
		channelAdmissionEvidence: combineChannelAdmissionEvidence(items.map((item) => item.channelAdmissionEvidence)),
		toolsAllow: authoritySource?.toolsAllow,
		disableTools: authoritySource?.disableTools,
		abortSignal,
		queueAbortSignal: items.find((item) => item.queueAbortSignal)?.queueAbortSignal,
		deliveryCorrelations: deliveryCorrelations.length > 0 ? deliveryCorrelations : void 0,
		turnAdoptionLifecycle: items.length === 1 ? items[0]?.turnAdoptionLifecycle : void 0,
		onReplyAdmissionWaitChange: admissionWaitCallbacks.size > 0 ? (waiting) => {
			for (const callback of admissionWaitCallbacks) callback(waiting);
		} : void 0
	};
}
function resolveQueuedCronCreatorAuthorityUnavailable(items) {
	return items.some((item) => item.turnAdoptionLifecycle?.cronCreatorAuthorityUnavailable === "queued-local-operator") ? "queued-local-operator" : void 0;
}
function resolveQueueSummaryLines(queue, sources) {
	return sources.map((source) => {
		const sourceIndex = queue.summarySources.indexOf(source);
		return expectDefined(queue.summaryLines[sourceIndex], "summary line for retained source");
	});
}
function createQueueSummaryDelivery(params) {
	const sources = params.sources ? [...params.sources] : [...params.queue.summarySources];
	if (params.sources && !sources.every((source, index) => params.queue.summarySources[index] === source)) return;
	const droppedCount = params.sources ? sources.length : params.queue.droppedCount;
	const prompt = previewQueueSummaryPrompt({
		state: {
			droppedCount,
			summaryLines: params.sources ? resolveQueueSummaryLines(params.queue, sources) : [...params.queue.summaryLines]
		},
		noun: "message"
	});
	if (!prompt) return;
	return {
		prompt,
		droppedCount,
		sources
	};
}
function consumeQueueSummaryDelivery(queue, delivery, completeLifecycles = true) {
	let consumedCount = delivery.sources.length === 0 ? delivery.droppedCount : 0;
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) {
			queue.summarySources.splice(sourceIndex, 1);
			queue.summaryLines.splice(sourceIndex, 1);
			consumedCount += 1;
		} else {
			const elisionIndex = queue.summaryElisions.findIndex((entry) => entry.sources.includes(source) || entry.sourceRefs.has(source));
			if (elisionIndex >= 0) {
				const entry = expectDefined(queue.summaryElisions[elisionIndex], "summary elisions entry at elision index");
				const elidedSourceIndex = entry.sources.indexOf(entry.sourceRefs.get(source) ?? source);
				if (elidedSourceIndex >= 0) {
					entry.sources.splice(elidedSourceIndex, 1);
					entry.summaryLines.splice(elidedSourceIndex, 1);
				}
				entry.count = entry.sources.length;
				consumedCount += 1;
				if (entry.sources.length === 0) queue.summaryElisions.splice(elisionIndex, 1);
			}
		}
		if (completeLifecycles) completeFollowupRunLifecycle(source);
	}
	queue.droppedCount = Math.max(0, queue.droppedCount - consumedCount);
}
function releaseQueueSummaryDeliveryForRetry(queue, delivery) {
	for (const source of delivery.sources) {
		const sourceIndex = queue.summarySources.indexOf(source);
		if (sourceIndex >= 0) queue.summarySources[sourceIndex] = createOverflowSummaryRetrySource(source);
		if (!source.turnAdoptionLifecycle) completeFollowupRunLifecycle(source);
	}
}
function dropAbortedQueueSummarySources(queue) {
	let dropped = 0;
	for (let index = queue.summarySources.length - 1; index >= 0; index -= 1) {
		const source = expectDefined(queue.summarySources[index], "summary sources entry at index");
		if (!isFollowupRunAborted(source)) continue;
		queue.summarySources.splice(index, 1);
		queue.summaryLines.splice(index, 1);
		queue.droppedCount = Math.max(0, queue.droppedCount - 1);
		completeFollowupRunLifecycle(source);
		dropped += 1;
	}
	return dropped;
}
async function runQueueSummaryDelivery(queue, delivery, run, protectedSources = delivery.sources) {
	assertSingleAdmissionOwner(protectedSources);
	const inheritedActiveSources = new Set(protectedSources.filter((source) => queue.activeSummarySources.has(source)));
	for (const source of protectedSources) queue.activeSummarySources.add(source);
	let admitted = false;
	let deferredBeforeAdmission = false;
	const cancellation = createAggregateCancellation(protectedSources);
	const onAdmitted = protectedSources.length > 1 || protectedSources.some((source) => hasExclusiveTurnAdmission(source.turnAdoptionLifecycle)) ? async () => {
		if (admitted) return;
		await Promise.all(protectedSources.map((source) => admitFollowupRunLifecycle(source)));
		cancellation.admit();
		admitted = true;
		consumeQueueSummaryDelivery(queue, {
			...delivery,
			sources: protectedSources
		}, false);
		const aggregateOwner = resolveAggregateOwner(protectedSources);
		for (const source of protectedSources) if (source !== aggregateOwner) retireFollowupRunCancellation(source);
	} : void 0;
	try {
		try {
			await run({
				abortSignal: cancellation.signal,
				onAdmitted
			});
		} catch (err) {
			if (!admitted) {
				deferredBeforeAdmission = isFollowupRunDeferredError(err);
				if (!deferredBeforeAdmission) releaseQueueSummaryDeliveryForRetry(queue, delivery);
			} else for (const source of protectedSources) completeFollowupRunLifecycle(source);
			throw err;
		}
		if (!admitted) {
			const canceledSources = protectedSources.filter(isFollowupRunAborted);
			if (canceledSources.length > 0) {
				consumeQueueSummaryDelivery(queue, {
					...delivery,
					sources: canceledSources
				});
				return false;
			}
		}
		if (!admitted) consumeQueueSummaryDelivery(queue, delivery);
		return true;
	} finally {
		cancellation.dispose();
		const deferredCarryover = deferredBeforeAdmission && inheritedActiveSources.size === 0 ? new Set(protectedSources) : inheritedActiveSources;
		for (const source of protectedSources) {
			if (deferredBeforeAdmission && deferredCarryover.has(source)) continue;
			queue.activeSummarySources.delete(source);
			for (const entry of queue.summaryElisions) {
				const compactSource = entry.sourceRefs.get(source);
				if (compactSource) queue.activeSummarySources.delete(compactSource);
			}
		}
		trimSummaryElisionsToCap(queue);
	}
}
async function dropAbortedFollowups(items, runFollowup) {
	let dropped = 0;
	for (let index = items.length - 1; index >= 0; index -= 1) {
		const item = expectDefined(items[index], "items entry at index");
		if (isFollowupRunAborted(item)) {
			await runFollowup(item);
			completeFollowupRunLifecycle(item);
			items.splice(index, 1);
			dropped += 1;
		}
	}
	return dropped;
}
function resolveCrossChannelKey(item) {
	const { originatingChannel: channel, originatingTo: to, originatingAccountId: accountId } = item;
	const threadId = item.originatingThreadId;
	const replyToId = resolveFollowupReplyAnchor(item);
	const chatType = normalizeChatType(item.originatingChatType);
	if (!channel && !to && !accountId && (threadId == null || threadId === "") && !item.originatingChatId && !replyToId) return chatType ? { key: JSON.stringify(["unresolved", chatType]) } : {};
	if (!isRoutableChannel(channel) || !to) return { key: JSON.stringify([
		"local",
		channel ?? "",
		to ?? "",
		accountId ?? "",
		threadId ?? "",
		item.originatingChatId ?? "",
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) };
	const key = channelRouteCompactKey({
		channel,
		to,
		accountId,
		threadId
	});
	return key ? { key: JSON.stringify([
		key,
		replyToId ?? "",
		item.originatingReplyToMode ?? "",
		chatType ?? ""
	]) } : { cross: true };
}
function resolveOverflowSummarySourceGroup(queue) {
	const source = queue.summarySources[0];
	if (!source) return [];
	const contextKey = resolveFollowupDeliveryContextKey(source);
	const sources = [];
	for (const candidate of queue.summarySources) {
		if (resolveFollowupDeliveryContextKey(candidate) !== contextKey) break;
		sources.push(candidate);
	}
	return sources;
}
async function drainProtectedPriorityFollowup(items, runFollowup) {
	const priority = items.find((item) => item.protectFromQueueOverflow === true);
	if (!priority) return false;
	await runFollowup(priority);
	removeQueuedItemsByRef(items, [priority]);
	return true;
}
function createOverflowSummaryRetrySource(source) {
	return {
		prompt: source.prompt,
		queueAbortSignal: source.queueAbortSignal,
		transcriptPrompt: source.transcriptPrompt,
		explicitSkillSelections: source.explicitSkillSelections,
		toolsAllow: source.toolsAllow,
		disableTools: source.disableTools,
		images: source.images,
		imageOrder: source.imageOrder,
		media: source.media,
		channelAdmissionEvidence: source.channelAdmissionEvidence,
		messageId: source.messageId,
		summaryLine: source.summaryLine,
		enqueuedAt: source.enqueuedAt,
		originatingChannel: source.originatingChannel,
		originatingTo: source.originatingTo,
		originatingAccountId: source.originatingAccountId,
		originatingThreadId: source.originatingThreadId,
		originatingChatId: source.originatingChatId,
		originatingReplyToId: source.originatingReplyToId,
		originatingReplyToMode: source.originatingReplyToMode,
		originatingChatType: source.originatingChatType,
		abortSignal: source.abortSignal,
		turnAdoptionLifecycle: source.turnAdoptionLifecycle,
		onReplyAdmissionWaitChange: source.onReplyAdmissionWaitChange,
		...source.currentInboundEventKind === "room_event" ? { currentInboundEventKind: "room_event" } : {},
		run: source.run
	};
}
function resolveOverflowSummaryInboundEventKind(sources) {
	return sources.length > 0 && sources.every((source) => source.currentInboundEventKind === "room_event") ? "room_event" : void 0;
}
async function runSyntheticOverflowSummary(params) {
	const promptHash = createHash("sha256").update(params.prompt).digest("hex");
	const routeHash = createHash("sha256").update(JSON.stringify([
		channelRouteDedupeKey({
			channel: params.source.originatingChannel,
			to: params.source.originatingTo,
			accountId: params.source.originatingAccountId,
			threadId: params.source.originatingThreadId
		}),
		resolveFollowupReplyAnchor(params.source) ?? "",
		params.source.originatingReplyToMode ?? "",
		normalizeChatType(params.source.originatingChatType) ?? ""
	])).digest("hex");
	const userTurnTranscriptRecorder = createUserTurnTranscriptRecorder({
		input: {
			text: params.prompt,
			idempotencyKey: `followup-overflow:${params.source.run.sessionId}:${routeHash}:${params.source.messageId ?? params.source.enqueuedAt}:${promptHash}`,
			senderIsOwner: params.source.run.senderIsOwner,
			provenance: params.source.run.inputProvenance
		},
		target: () => resolveFollowupTranscriptTarget(params.source),
		beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
		errorContext: "followup overflow summary transcript"
	});
	const currentInboundEventKind = resolveOverflowSummaryInboundEventKind(params.sources);
	const runtimeMetadata = collectRuntimeMetadata(params.sources);
	let admitted = false;
	await params.runFollowup({
		prompt: params.prompt,
		queueAbortSignal: params.source.queueAbortSignal,
		transcriptPrompt: params.prompt,
		messageId: params.source.messageId,
		userTurnTranscriptRecorder,
		run: resolveCollectedRun(params.sources, params.source.run),
		enqueuedAt: Date.now(),
		abortSignal: params.abortSignal,
		onReplyAdmissionWaitChange: runtimeMetadata.onReplyAdmissionWaitChange,
		explicitSkillSelections: runtimeMetadata.explicitSkillSelections,
		channelAdmissionEvidence: runtimeMetadata.channelAdmissionEvidence,
		toolsAllow: runtimeMetadata.toolsAllow,
		disableTools: runtimeMetadata.disableTools,
		...params.onAdmitted ? { turnAdoptionLifecycle: {
			admission: "cancel-only",
			...resolveQueuedCronCreatorAuthorityUnavailable(params.sources) ? { cronCreatorAuthorityUnavailable: "queued-local-operator" } : {},
			onAdopted: async () => {
				await params.onAdmitted?.();
				admitted = true;
			},
			onSettled: () => {
				if (admitted) for (const source of params.sources) completeFollowupRunLifecycle(source);
			}
		} } : {},
		...resolveOriginRoutingMetadata([params.source]),
		...currentInboundEventKind ? { currentInboundEventKind } : {}
	});
}
async function drainElidedOverflowSummary(params) {
	const entry = params.queue.summaryElisions[0];
	if (!entry) return false;
	const retainedSources = params.queue.summaryElisions.length === 1 ? resolveOverflowSummarySourceGroup(params.queue).filter((source) => resolveFollowupDeliveryContextKey(source) === entry.contextKey) : [];
	for (let index = entry.sources.length - 1; index >= 0; index -= 1) {
		const source = expectDefined(entry.sources[index], "sources entry at index");
		if (!isFollowupRunAborted(source)) continue;
		entry.sources.splice(index, 1);
		entry.summaryLines.splice(index, 1);
		entry.count = Math.max(0, entry.count - 1);
		params.queue.droppedCount = Math.max(0, params.queue.droppedCount - 1);
		completeFollowupRunLifecycle(source);
	}
	if (entry.sources.length === 0) {
		params.queue.summaryElisions.shift();
		return true;
	}
	const source = retainedSources.at(-1) ?? entry.sources.at(-1);
	if (!source) return false;
	const elidedCount = entry.sources.length;
	const elidedSources = [...entry.sources];
	const droppedCount = elidedCount + retainedSources.length;
	const retainedSummaryLines = resolveQueueSummaryLines(params.queue, retainedSources);
	const prompt = previewQueueSummaryPrompt({
		state: {
			droppedCount,
			summaryLines: [...entry.summaryLines, ...retainedSummaryLines].slice(-params.queue.cap)
		},
		noun: "message"
	});
	if (!prompt) return false;
	if (!await runQueueSummaryDelivery(params.queue, {
		prompt,
		droppedCount: retainedSources.length,
		sources: retainedSources
	}, async ({ abortSignal, onAdmitted }) => {
		await runSyntheticOverflowSummary({
			source,
			sources: [...elidedSources, ...retainedSources],
			prompt,
			abortSignal,
			onAdmitted,
			runFollowup: params.runFollowup
		});
	}, [...elidedSources, ...retainedSources])) return true;
	const entryIndex = params.queue.summaryElisions.indexOf(entry);
	if (entryIndex < 0) return true;
	const consumedCount = Math.min(elidedCount, entry.sources.length);
	const consumedSources = entry.sources.splice(0, consumedCount);
	entry.summaryLines.splice(0, consumedCount);
	entry.count = entry.sources.length;
	for (const consumedSource of consumedSources) completeFollowupRunLifecycle(consumedSource);
	params.queue.droppedCount = Math.max(0, params.queue.droppedCount - consumedCount);
	if (entry.sources.length === 0) params.queue.summaryElisions.splice(entryIndex, 1);
	return true;
}
async function drainOverflowSummaryGroup(params) {
	if (dropAbortedQueueSummarySources(params.queue) > 0 && params.queue.droppedCount === 0) return true;
	if (params.queue.evictedSummaryCount > 0) {
		const evictedCount = params.queue.evictedSummaryCount;
		params.queue.evictedSummaryCount = 0;
		params.queue.droppedCount = Math.max(0, params.queue.droppedCount - evictedCount);
		defaultRuntime.error?.(`followup queue omitted ${evictedCount} route-isolated overflow summar${evictedCount === 1 ? "y" : "ies"} after reaching the summary context cap`);
		return true;
	}
	if (await drainElidedOverflowSummary(params)) return true;
	const sources = resolveOverflowSummarySourceGroup(params.queue);
	const source = sources.at(-1);
	if (!source) return false;
	const delivery = createQueueSummaryDelivery({
		queue: params.queue,
		sources
	});
	if (!delivery) return false;
	await runQueueSummaryDelivery(params.queue, delivery, async ({ abortSignal, onAdmitted }) => {
		await runSyntheticOverflowSummary({
			source,
			sources: delivery.sources,
			prompt: delivery.prompt,
			abortSignal,
			onAdmitted,
			runFollowup: params.runFollowup
		});
	});
	return true;
}
function scheduleFollowupDrain(key, runFollowup) {
	if (FOLLOWUP_QUEUES.get(key)?.draining) {
		rememberFollowupDrainCallback(key, runFollowup);
		return;
	}
	const queue = beginQueueDrain(FOLLOWUP_QUEUES, key);
	if (!queue) return;
	const effectiveRunFollowup = FOLLOWUP_RUN_CALLBACKS.get(key) ?? runFollowup;
	const reserveOptions = {
		inFlight: queue.inFlight,
		shouldRestoreOnError: () => FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted,
		onDiscard: (item) => completeFollowupRunLifecycle(item)
	};
	rememberFollowupDrainCallback(key, effectiveRunFollowup);
	runWithGatewayIndependentRootWorkContinuation(async () => {
		let retryDeferred = false;
		let waitingForSteer = false;
		try {
			const collectState = { forceIndividualCollect: false };
			while (queue.items.length > 0 || queue.droppedCount > 0) {
				await dropAbortedFollowups(queue.items, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				await waitForQueueDebounce(queue, queue.abortController.signal);
				await dropAbortedFollowups(queue.items, effectiveRunFollowup);
				if (queue.items.length === 0 && queue.droppedCount === 0) break;
				if (queue.items.some((item) => item.steerPending)) {
					waitingForSteer = true;
					break;
				}
				if (await drainProtectedPriorityFollowup(queue.items, effectiveRunFollowup)) continue;
				if (queue.droppedCount > 0 && queue.items.some((item) => item.steerAnchor)) {
					if (!await drainNextQueueItem(queue.items, effectiveRunFollowup, reserveOptions)) break;
					continue;
				}
				if (queue.droppedCount > 0 && await drainOverflowSummaryGroup({
					queue,
					runFollowup: effectiveRunFollowup
				})) continue;
				if (queue.mode === "collect") {
					const isCrossChannel = hasCrossChannelItems(queue.items, resolveCrossChannelKey) || queue.items.some(requiresIndividualCollectDrain);
					if (collectState.forceIndividualCollect && !isCrossChannel && queue.items.length > 1) collectState.forceIndividualCollect = false;
					const collectDrainResult = await drainCollectQueueStep({
						collectState,
						isCrossChannel,
						items: queue.items,
						run: effectiveRunFollowup,
						reserveOptions
					});
					if (collectDrainResult === "empty") break;
					if (collectDrainResult === "drained") continue;
					const contextGroups = splitCollectItemsByDeliveryContext(queue.items.slice());
					if (contextGroups.length === 0) break;
					for (const groupItems of contextGroups) {
						const currentGroupItems = groupItems.filter((item) => queue.items.includes(item));
						const abortedGroupItems = currentGroupItems.filter(isFollowupRunAborted);
						if (abortedGroupItems.length > 0) {
							removeQueuedItemsByRef(queue.items, abortedGroupItems);
							for (const item of abortedGroupItems) completeFollowupRunLifecycle(item);
						}
						const activeGroupItems = currentGroupItems.filter((item) => !isFollowupRunAborted(item));
						if (activeGroupItems.length === 0) continue;
						assertSingleAdmissionOwner(activeGroupItems);
						const groupSource = activeGroupItems.at(-1);
						const run = groupSource ? resolveCollectedRun(activeGroupItems, groupSource.run) : queue.lastRun;
						if (!run) break;
						const routing = resolveOriginRoutingMetadata(activeGroupItems);
						const prompt = buildCollectPrompt({
							title: "[Queued messages while agent was busy]",
							items: activeGroupItems,
							renderItem: renderCollectItem
						});
						const transcriptPrompt = buildCollectTranscriptPrompt(activeGroupItems);
						const userTurnTranscriptRecorder = createCollectUserTurnTranscriptRecorder(activeGroupItems);
						const aggregateOwner = resolveAggregateOwner(activeGroupItems);
						const cancellation = createAggregateCancellation(activeGroupItems);
						let admitted = false;
						const restoreGroupItems = (groupItemsToRestore) => {
							const missingItems = groupItemsToRestore.filter((item) => !queue.items.includes(item));
							queue.items.unshift(...missingItems);
						};
						const needsGroupAdmission = activeGroupItems.length > 1 || activeGroupItems.some((item) => hasExclusiveTurnAdmission(item.turnAdoptionLifecycle));
						const consumeAdmittedGroup = () => {
							cancellation.admit();
							admitted = true;
							removeQueuedItemsByRef(queue.items, activeGroupItems);
							for (const item of activeGroupItems) if (item !== aggregateOwner) retireFollowupRunCancellation(item);
						};
						const admitGroupSources = async () => {
							await Promise.all(activeGroupItems.map((item) => admitFollowupRunLifecycle(item)));
							consumeAdmittedGroup();
						};
						const completeGroup = () => {
							removeQueuedItemsByRef(queue.items, activeGroupItems);
							for (const item of activeGroupItems) completeFollowupRunLifecycle(item);
						};
						const drainGroup = async () => {
							await effectiveRunFollowup({
								prompt,
								transcriptPrompt,
								...userTurnTranscriptRecorder ? { userTurnTranscriptRecorder } : {},
								run,
								messageId: groupSource?.messageId ?? (groupSource ? resolveFollowupReplyAnchor(groupSource) : void 0),
								enqueuedAt: Date.now(),
								...routing,
								...collectRuntimeMetadata(activeGroupItems, cancellation.signal),
								...needsGroupAdmission ? { turnAdoptionLifecycle: {
									admission: "cancel-only",
									...resolveQueuedCronCreatorAuthorityUnavailable(activeGroupItems) ? { cronCreatorAuthorityUnavailable: "queued-local-operator" } : {},
									onAdopted: admitGroupSources,
									onSettled: () => {
										if (admitted) completeGroup();
									}
								} } : {},
								...collectQueuedPromptMedia(activeGroupItems)
							});
						};
						try {
							for (const item of activeGroupItems) queue.inFlight.add(item);
							await drainGroup();
						} catch (err) {
							if (admitted) completeGroup();
							else if (FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted) restoreGroupItems(activeGroupItems);
							else for (const item of activeGroupItems) completeFollowupRunLifecycle(item);
							throw err;
						} finally {
							for (const item of activeGroupItems) queue.inFlight.delete(item);
							cancellation.dispose();
						}
						if (!admitted) {
							const canceledSources = activeGroupItems.filter(isFollowupRunAborted);
							if (canceledSources.length > 0) {
								removeQueuedItemsByRef(queue.items, canceledSources);
								for (const item of canceledSources) completeFollowupRunLifecycle(item);
								const survivors = activeGroupItems.filter((item) => !canceledSources.includes(item));
								if (FOLLOWUP_QUEUES.get(key) === queue && !queue.abortController.signal.aborted) {
									restoreGroupItems(survivors);
									if (survivors.length > 0) break;
								} else for (const item of survivors) completeFollowupRunLifecycle(item);
								continue;
							}
						}
						completeGroup();
					}
					continue;
				}
				if (!await drainNextQueueItem(queue.items, effectiveRunFollowup, reserveOptions)) break;
			}
		} catch (err) {
			queue.lastEnqueuedAt = Date.now();
			if (isFollowupRunDeferredError(err)) retryDeferred = true;
			else defaultRuntime.error?.(`followup queue drain failed for ${key}: ${String(err)}`);
		} finally {
			queue.draining = false;
			const hasPendingQueueWork = queue.items.length > 0 || queue.droppedCount > 0;
			if (waitingForSteer && hasPendingQueueWork) {
				if (!queue.items.some((item) => item.steerPending)) scheduleFollowupDrain(key, effectiveRunFollowup);
			} else if (retryDeferred && hasPendingQueueWork) scheduleFollowupDrain(key, effectiveRunFollowup);
			else if (!hasPendingQueueWork) {
				if (FOLLOWUP_QUEUES.get(key) === queue) {
					FOLLOWUP_QUEUES.delete(key);
					clearFollowupDrainCallback(key);
				}
			} else scheduleFollowupDrain(key, effectiveRunFollowup);
		}
	}).catch((err) => {
		queue.draining = false;
		defaultRuntime.error?.(`followup queue drain admission failed for ${key}: ${String(err)}`);
	});
}
//#endregion
//#region src/auto-reply/reply/queue/cleanup.ts
const defaultQueueCleanupDeps = {
	resolveEmbeddedSessionLane,
	clearCommandLane
};
const queueCleanupDeps = { ...defaultQueueCleanupDeps };
function resolveQueueCleanupLaneResolver() {
	return typeof queueCleanupDeps.resolveEmbeddedSessionLane === "function" ? queueCleanupDeps.resolveEmbeddedSessionLane : defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
}
function resolveQueueCleanupLaneClearer() {
	return typeof queueCleanupDeps.clearCommandLane === "function" ? queueCleanupDeps.clearCommandLane : defaultQueueCleanupDeps.clearCommandLane;
}
const queueCleanupTestApi = {
	setDepsForTests(deps) {
		queueCleanupDeps.resolveEmbeddedSessionLane = typeof deps?.resolveEmbeddedSessionLane === "function" ? deps.resolveEmbeddedSessionLane : defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
		queueCleanupDeps.clearCommandLane = typeof deps?.clearCommandLane === "function" ? deps.clearCommandLane : defaultQueueCleanupDeps.clearCommandLane;
	},
	resetDepsForTests() {
		queueCleanupDeps.resolveEmbeddedSessionLane = defaultQueueCleanupDeps.resolveEmbeddedSessionLane;
		queueCleanupDeps.clearCommandLane = defaultQueueCleanupDeps.clearCommandLane;
	}
};
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.queueCleanupTestApi")] = queueCleanupTestApi;
function clearSessionQueues(keys) {
	const seen = /* @__PURE__ */ new Set();
	let followupCleared = 0;
	let laneCleared = 0;
	const clearedKeys = [];
	const resolveLane = resolveQueueCleanupLaneResolver();
	const clearLane = resolveQueueCleanupLaneClearer();
	for (const key of keys) {
		const cleaned = normalizeOptionalString(key);
		if (!cleaned || seen.has(cleaned)) continue;
		seen.add(cleaned);
		clearedKeys.push(cleaned);
		followupCleared += clearFollowupQueue(cleaned);
		clearFollowupDrainCallback(cleaned);
		laneCleared += clearLane(resolveLane(cleaned));
	}
	return {
		followupCleared,
		laneCleared,
		keys: clearedKeys
	};
}
//#endregion
export { rememberFollowupDrainCallback as a, scheduleFollowupDrain as c, kickFollowupDrainIfIdle as i, clearFollowupDrainCallback as n, resolveFollowupDeliveryContextKey as o, createOverflowSummaryRetrySource as r, resolveFollowupReplyAnchor as s, clearSessionQueues as t };
