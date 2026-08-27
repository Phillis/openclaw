import { m as readNonBlankString } from "./string-coerce-CIXf7egm.js";
import "./src-BntaCZM-.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.js";
import { v as uniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.js";
import { at as normalizeAgentRunTerminalReplySnapshot, it as mergeAgentRunTerminalReplySnapshot } from "./openclaw-state-db-CeAO_dqo.js";
import { t as setSafeTimeout } from "./timer-delay-x5n129Nx.js";
import { u as onAgentEvent } from "./agent-events-CcZImb5w.js";
import { t as ADMIN_SCOPE } from "./operator-scopes-Dw7Gu2cA.js";
import "./method-scopes-BTnJZEGh.js";
import { m as patchSessionEntryCore } from "./session-accessor.sqlite-entry-CNdoUuFZ.js";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DAt_gV_K.js";
import { lt as rewriteTranscriptEventRowsExact, t as readSessionTranscriptWatermark, ut as withTranscriptWriteLock } from "./session-accessor-B-FKZX9M.js";
import { g as findTranscriptEvent, y as loadTranscriptEventRowsAfterSeqSync } from "./session-accessor.sqlite-transcript-store-Bx_F0DmJ.js";
import { t as applyAssistantDeliveryDirectives } from "./transcript-assistant-delivery-ElcBJoCH.js";
import { i as stripInlineDirectiveTagsForDelivery } from "./directive-tags-DqL78ij5.js";
import { t as resolveMirroredTranscriptText } from "./transcript-mirror-DxrLtJZQ.js";
import { g as readPairingQrReplyChannelData, n as appendReplyMediaFailureWarning } from "./reply-payload-BeeUJOmJ.js";
import { c as isStickyAgentRunTerminalOutcome, i as buildAgentRunTerminalOutcomeFromLifecycleEvent, n as buildAgentRunTerminalOutcome, t as AGENT_RUN_TERMINAL_RETRY_GRACE_MS } from "./agent-run-terminal-outcome-DafVNgmX.js";
import { t as mergeAgentRunTerminalOutcome } from "./agent-run-terminal-outcome-merge-DXNYLPhQ.js";
import { n as splitMediaFromOutput } from "./reply-directives-CBwQknKg.js";
import { t as normalizeMediaReferenceForComparison } from "./media-reference-comparison-CBuherY6.js";
import { t as createOutboundPayloadPlan } from "./payloads-BNOW0uoZ.js";
import { m as listSubagentRunsForController } from "./subagent-registry-read-kfj2Ed2f.js";
import { l as resolveSubagentController, t as killAllControlledSubagentRuns } from "./subagent-control-BX8c2zdO.js";
import { M as stripEnvelopeFromMessage } from "./session-transcript-readers-CgCxlOAj.js";
import { r as loadGatewaySessionEntry } from "./session-utils-store-DtQnSTMm.js";
import "./session-utils-BTR52tOf.js";
import { t as isNonTerminalAgentRunStatus } from "./agent-run-status-CdFMkKaA.js";
import { t as abortChatRunById } from "./chat-abort-BpfXA9KF.js";
import { r as resolveChatRunOwnerAgentId, t as chatRunBelongsToAgent } from "./chat-run-owner-Bu4zznGp.js";
import { n as createChatAbortMarker } from "./server-chat-state-BuGrMjm1.js";
import { i as listQueuedChatTurnsForSession, n as abortQueuedChatTurns } from "./chat-queued-turns-CEBu4Zkd.js";
import { n as renderQrPngDataUrl } from "./qr-image-Jg_GFKua.js";
import { t as renderQrTerminal } from "./qr-terminal-27AasTys.js";
import { t as normalizeAgentRunTerminalDeliverySnapshot } from "./agent-run-terminal-delivery-CA3z25Fw.js";
import { t as normalizeAgentRunTerminalReceipt } from "./agent-run-terminal-receipt-DLoyhERI.js";
import { t as formatForLog } from "./ws-log-CjO1AAG7.js";
import { n as pendingChatSendDedupeKey, t as PENDING_CHAT_SEND_DEDUPE_PREFIX } from "./server-shared-C-7Ahu3n.js";
import { t as asWorkerInferenceControl } from "./inference-control-CDvM08Nt.js";
import { o as createManagedOutgoingMediaBlocks } from "./managed-image-attachments-5NOsW2iy.js";
import { t as appendInjectedAssistantMessageToTranscript } from "./chat-transcript-inject-D82Y-BNF.js";
//#region src/gateway/agent-turn/agent-job.ts
const AGENT_RUN_CACHE_TTL_MS = 10 * 6e4;
const AGENT_RUN_CACHE_MAX_ENTRIES = 5e3;
const agentJobState = resolveGlobalSingleton(Symbol.for("openclaw.agentJobState"), () => ({
	jobs: /* @__PURE__ */ new Map(),
	runStarts: /* @__PURE__ */ new Map(),
	pendingErrors: /* @__PURE__ */ new Map(),
	pendingTimeouts: /* @__PURE__ */ new Map(),
	waiters: /* @__PURE__ */ new Map(),
	version: 0
}), (state) => {
	for (const pending of state.pendingErrors.values()) clearTimeout(pending.timer);
	for (const pending of state.pendingTimeouts.values()) clearTimeout(pending.timer);
	state.jobs.clear();
	state.runStarts.clear();
	state.pendingErrors.clear();
	state.pendingTimeouts.clear();
	const waiters = Array.from(state.waiters.values()).flatMap((entries) => Array.from(entries));
	state.waiters.clear();
	for (const waiter of waiters) waiter(true);
});
const agentJobs = agentJobState.jobs;
const agentRunStarts = agentJobState.runStarts;
const pendingAgentRunErrors = agentJobState.pendingErrors;
const pendingAgentRunTimeouts = agentJobState.pendingTimeouts;
const agentRunWaiters = agentJobState.waiters;
let agentRunListenerStarted = false;
function nextAgentRunVersion() {
	agentJobState.version += 1;
	return agentJobState.version;
}
function pruneAgentRunCache(now = Date.now()) {
	for (const [runId, job] of agentJobs) {
		if (now - job.cachedAt <= AGENT_RUN_CACHE_TTL_MS) continue;
		agentJobs.delete(runId);
	}
}
function enforceAgentRunCacheMaxEntries() {
	if (agentJobs.size <= AGENT_RUN_CACHE_MAX_ENTRIES) return;
	const toRemove = agentJobs.size - AGENT_RUN_CACHE_MAX_ENTRIES;
	let removed = 0;
	for (const runId of agentJobs.keys()) {
		if (removed >= toRemove) break;
		if ((agentRunWaiters.get(runId)?.size ?? 0) > 0) continue;
		agentJobs.delete(runId);
		removed += 1;
	}
}
function terminalOutcomeFromSnapshot(snapshot) {
	if (snapshot.pendingError) return;
	return buildAgentRunTerminalOutcome(snapshot);
}
function shouldPreserveTerminalSnapshot(existing, incoming) {
	const existingOutcome = terminalOutcomeFromSnapshot(existing);
	const incomingOutcome = terminalOutcomeFromSnapshot(incoming);
	if (!existingOutcome || !incomingOutcome) return false;
	return mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome;
}
function mergeSnapshot(existing, incoming) {
	if (!existing) return incoming;
	const terminalReply = mergeAgentRunTerminalReplySnapshot(existing.terminalReply, incoming.terminalReply);
	const terminalDelivery = incoming.terminalDelivery ?? existing.terminalDelivery;
	const terminalReceipt = incoming.terminalReceipt ?? existing.terminalReceipt;
	return {
		...shouldPreserveTerminalSnapshot(existing, incoming) ? existing : incoming,
		...terminalDelivery ? { terminalDelivery } : {},
		...terminalReceipt ? { terminalReceipt } : {},
		...terminalReply ? { terminalReply } : {},
		cachedAt: incoming.cachedAt,
		recordedAt: incoming.recordedAt,
		version: incoming.version
	};
}
function recordAgentRunSnapshot(snapshot, version = nextAgentRunVersion()) {
	const entry = {
		...snapshot,
		cachedAt: Date.now(),
		version
	};
	pruneAgentRunCache(entry.cachedAt);
	const snapshotsBySource = agentJobs.get(entry.runId)?.snapshotsBySource ?? /* @__PURE__ */ new Map();
	const sourceSnapshot = mergeSnapshot(snapshotsBySource.get(entry.source), entry);
	snapshotsBySource.set(entry.source, sourceSnapshot);
	agentJobs.set(entry.runId, {
		cachedAt: entry.cachedAt,
		snapshotsBySource
	});
	enforceAgentRunCacheMaxEntries();
	for (const waiter of agentRunWaiters.get(entry.runId) ?? []) waiter();
}
function clearPendingAgentRunTerminals(runId) {
	for (const pendingRuns of [pendingAgentRunErrors, pendingAgentRunTimeouts]) {
		const pending = pendingRuns.get(runId);
		if (pending) {
			clearTimeout(pending.timer);
			pendingRuns.delete(runId);
		}
	}
}
function beginAgentJob(runId, startedAt) {
	nextAgentRunVersion();
	clearPendingAgentRunTerminals(runId);
	agentJobs.delete(runId);
	if (startedAt !== void 0) agentRunStarts.set(runId, startedAt);
}
function mergePendingAgentRunTerminal(snapshot) {
	return [pendingAgentRunErrors, pendingAgentRunTimeouts].reduce((current, pendingRuns) => {
		const pending = pendingRuns.get(snapshot.runId)?.snapshot;
		return pending && shouldPreserveTerminalSnapshot(pending, current) ? pending : current;
	}, snapshot);
}
function schedulePendingAgentRunTerminal(pendingRuns, snapshot) {
	const terminalSnapshot = mergePendingAgentRunTerminal(snapshot);
	if (terminalSnapshot !== snapshot) {
		terminalSnapshot.version = snapshot.version;
		return;
	}
	const replacesPendingTimeout = pendingAgentRunTimeouts.has(snapshot.runId);
	clearPendingAgentRunTerminals(snapshot.runId);
	const timer = setSafeTimeout(() => {
		const pending = pendingRuns.get(snapshot.runId);
		if (!pending || pending.timer !== timer) return;
		if (pendingRuns === pendingAgentRunErrors && !replacesPendingTimeout && terminalOutcomeFromSnapshot(pending.snapshot)?.reason === "failed" && agentRunWaiters.has(snapshot.runId)) {
			pending.timer = void 0;
			return;
		}
		pendingRuns.delete(snapshot.runId);
		recordAgentRunSnapshot(pending.snapshot, pending.snapshot.version);
	}, AGENT_RUN_TERMINAL_RETRY_GRACE_MS);
	timer.unref?.();
	pendingRuns.set(snapshot.runId, {
		snapshot,
		timer
	});
}
function createPendingErrorTimeoutSnapshot(snapshot) {
	return {
		status: "timeout",
		startedAt: snapshot.startedAt,
		error: snapshot.error,
		pendingError: true,
		...snapshot.providerStarted !== void 0 ? { providerStarted: snapshot.providerStarted } : {},
		...snapshot.terminalDelivery ? { terminalDelivery: snapshot.terminalDelivery } : {}
	};
}
function createSnapshotFromLifecycleEvent(params) {
	const { runId, phase, data } = params;
	const startedAt = typeof data?.startedAt === "number" ? data.startedAt : agentRunStarts.get(runId);
	const endedAt = typeof data?.endedAt === "number" ? data.endedAt : void 0;
	const terminalOutcome = buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase,
		data,
		startedAt,
		endedAt
	});
	const legacyBareAbort = terminalOutcome.reason === "aborted" && data?.stopReason == null && data?.status == null;
	const terminalDelivery = normalizeAgentRunTerminalDeliverySnapshot(data?.terminalDelivery);
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(data?.terminalReply);
	const normalizedTerminalReceipt = normalizeAgentRunTerminalReceipt(data?.terminalReceipt);
	const terminalReceipt = normalizedTerminalReceipt?.runId === runId ? normalizedTerminalReceipt : void 0;
	return {
		runId,
		source: "lifecycle",
		recordedAt: Date.now(),
		status: legacyBareAbort ? "timeout" : terminalOutcome.status,
		startedAt,
		endedAt,
		error: legacyBareAbort ? void 0 : terminalOutcome.error,
		stopReason: legacyBareAbort ? void 0 : terminalOutcome.stopReason,
		livenessState: terminalOutcome.livenessState,
		...data?.yielded === true ? { yielded: true } : {},
		...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
		...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
		...terminalDelivery ? { terminalDelivery } : {},
		...terminalReply ? { terminalReply } : {},
		...terminalReceipt ? { terminalReceipt } : {},
		version: nextAgentRunVersion()
	};
}
function ensureAgentRunListener() {
	if (agentRunListenerStarted) return;
	agentRunListenerStarted = true;
	onAgentEvent((evt) => {
		if (!evt || evt.stream !== "lifecycle") return;
		const phase = evt.data?.phase;
		if (phase === "start") {
			const startedAt = typeof evt.data?.startedAt === "number" ? evt.data.startedAt : Date.now();
			beginAgentJob(evt.runId, startedAt);
			return;
		}
		if (phase !== "end" && phase !== "error") return;
		const snapshot = createSnapshotFromLifecycleEvent({
			runId: evt.runId,
			phase,
			data: evt.data
		});
		agentRunStarts.delete(evt.runId);
		if (phase === "error" && evt.data?.fallbackExhaustedFailure !== true) {
			schedulePendingAgentRunTerminal(pendingAgentRunErrors, snapshot);
			return;
		}
		if (phase === "end" && snapshot.status === "timeout") {
			schedulePendingAgentRunTerminal(pendingAgentRunTimeouts, snapshot);
			return;
		}
		const terminalSnapshot = mergePendingAgentRunTerminal(snapshot);
		clearPendingAgentRunTerminals(evt.runId);
		recordAgentRunSnapshot(terminalSnapshot, snapshot.version);
	});
}
function parseDedupeObservation(entry) {
	const payload = entry.payload;
	const status = typeof payload?.status === "string" ? payload.status : void 0;
	if (isNonTerminalAgentRunStatus(status)) return { state: "active" };
	const terminalStatus = status === "ok" || status === "timeout" || status === "error" ? status : entry.ok ? void 0 : "error";
	if (!terminalStatus) return { state: "untracked" };
	const resultMeta = asOptionalRecord(asOptionalRecord(payload?.result)?.meta);
	const terminalReply = normalizeAgentRunTerminalReplySnapshot(payload?.terminalReply ?? resultMeta?.terminalReply);
	const startedAt = asFiniteNumber(payload?.startedAt);
	const endedAt = asFiniteNumber(payload?.endedAt) ?? entry.ts;
	const stopReason = readNonBlankString(payload?.stopReason) ?? readNonBlankString(resultMeta?.stopReason);
	const livenessState = readNonBlankString(payload?.livenessState) ?? readNonBlankString(resultMeta?.livenessState);
	const terminalOutcome = buildAgentRunTerminalOutcome({
		status: terminalStatus,
		startedAt,
		endedAt,
		error: typeof payload?.error === "string" ? payload.error : typeof payload?.summary === "string" ? payload.summary : entry.error?.message,
		stopReason,
		livenessState,
		timeoutPhase: payload?.timeoutPhase ?? resultMeta?.timeoutPhase,
		providerStarted: payload?.providerStarted ?? resultMeta?.providerStarted
	});
	return {
		state: "terminal",
		snapshot: {
			status: terminalOutcome.status,
			startedAt,
			endedAt,
			error: terminalOutcome.status === "ok" ? void 0 : terminalOutcome.error,
			stopReason,
			livenessState,
			...payload?.yielded === true || resultMeta?.yielded === true ? { yielded: true } : {},
			...terminalOutcome.timeoutPhase ? { timeoutPhase: terminalOutcome.timeoutPhase } : {},
			...terminalOutcome.providerStarted !== void 0 ? { providerStarted: terminalOutcome.providerStarted } : {},
			...terminalReply ? { terminalReply } : {}
		}
	};
}
function parseDedupeKey(key) {
	const separator = key.indexOf(":");
	if (separator === -1) return;
	const source = key.slice(0, separator);
	const runId = key.slice(separator + 1);
	if (source !== "agent" && source !== "chat" || !runId) return;
	return {
		runId,
		source
	};
}
function setGatewayDedupeEntry(params) {
	const existing = params.dedupe.get(params.key);
	const existingObservation = existing ? parseDedupeObservation(existing) : void 0;
	const incomingObservation = parseDedupeObservation(params.entry);
	const existingOutcome = existingObservation?.state === "terminal" ? terminalOutcomeFromSnapshot(existingObservation.snapshot) : void 0;
	const incomingOutcome = incomingObservation.state === "terminal" ? terminalOutcomeFromSnapshot(incomingObservation.snapshot) : void 0;
	if (existingOutcome && isStickyAgentRunTerminalOutcome(existingOutcome) && (!incomingOutcome || mergeAgentRunTerminalOutcome(existingOutcome, incomingOutcome) === existingOutcome)) return;
	params.dedupe.set(params.key, params.entry);
	const key = parseDedupeKey(params.key);
	if (!key) return;
	if (incomingObservation.state === "active") {
		beginAgentJob(key.runId);
		return;
	}
	if (incomingObservation.state === "terminal") recordAgentRunSnapshot({
		...incomingObservation.snapshot,
		runId: key.runId,
		source: key.source,
		recordedAt: params.entry.ts
	});
}
function getFreshestDedupeSnapshot(snapshotsBySource) {
	const agent = snapshotsBySource.get("agent");
	const chat = snapshotsBySource.get("chat");
	if (agent && chat) return chat.recordedAt > agent.recordedAt ? mergeSnapshot(agent, chat) : mergeSnapshot(chat, agent);
	return agent ?? chat;
}
function getCanonicalAgentRunSnapshot(snapshotsBySource) {
	const dedupe = getFreshestDedupeSnapshot(snapshotsBySource);
	const lifecycle = snapshotsBySource.get("lifecycle");
	if (!dedupe || !lifecycle) return dedupe ?? lifecycle;
	return dedupe.version > lifecycle.version ? mergeSnapshot(lifecycle, dedupe) : mergeSnapshot(dedupe, lifecycle);
}
function getAgentRunSnapshot(params) {
	pruneAgentRunCache();
	const job = agentJobs.get(params.runId);
	const snapshot = params.source ? job?.snapshotsBySource.get(params.source) : job ? getCanonicalAgentRunSnapshot(job.snapshotsBySource) : void 0;
	return snapshot && snapshot.version > params.afterVersion ? snapshot : void 0;
}
function addAgentRunWaiter(runId, waiter) {
	const waiters = agentRunWaiters.get(runId) ?? /* @__PURE__ */ new Set();
	waiters.add(waiter);
	agentRunWaiters.set(runId, waiters);
	return () => {
		waiters.delete(waiter);
		if (waiters.size === 0) {
			agentRunWaiters.delete(runId);
			const pendingError = pendingAgentRunErrors.get(runId);
			if (pendingError && !pendingError.timer) {
				pendingAgentRunErrors.delete(runId);
				recordAgentRunSnapshot(pendingError.snapshot, pendingError.snapshot.version);
			}
		}
	};
}
function publicSnapshot(snapshot) {
	return {
		status: snapshot.status,
		startedAt: snapshot.startedAt,
		endedAt: snapshot.endedAt,
		error: snapshot.error,
		stopReason: snapshot.stopReason,
		livenessState: snapshot.livenessState,
		yielded: snapshot.yielded,
		pendingError: snapshot.pendingError,
		timeoutPhase: snapshot.timeoutPhase,
		providerStarted: snapshot.providerStarted,
		...snapshot.terminalDelivery ? { terminalDelivery: snapshot.terminalDelivery } : {},
		terminalReceipt: snapshot.terminalReceipt,
		terminalReply: snapshot.terminalReply
	};
}
async function waitForAgentJob(params) {
	ensureAgentRunListener();
	const afterVersion = params.ignoreCachedSnapshot ? agentJobState.version : -1;
	const cached = getAgentRunSnapshot({
		runId: params.runId,
		source: params.source,
		afterVersion
	});
	if (cached) return publicSnapshot(cached);
	if (params.timeoutMs <= 0) return null;
	return await new Promise((resolve) => {
		let settled = false;
		let removeWaiter = () => {};
		const finish = (snapshot) => {
			if (settled) return;
			settled = true;
			clearTimeout(timeoutHandle);
			removeWaiter();
			resolve(snapshot);
		};
		const onWake = (lifecycleReset = false) => {
			if (lifecycleReset) {
				finish(null);
				return;
			}
			const snapshot = getAgentRunSnapshot({
				runId: params.runId,
				source: params.source,
				afterVersion
			});
			if (snapshot) finish(publicSnapshot(snapshot));
		};
		removeWaiter = addAgentRunWaiter(params.runId, onWake);
		const timeoutHandle = setSafeTimeout(() => {
			if (!params.source) {
				const pending = pendingAgentRunErrors.get(params.runId);
				const pendingError = pending?.snapshot;
				if (pendingError && pendingError.version > afterVersion) {
					finish(!pending.timer || isStickyAgentRunTerminalOutcome(terminalOutcomeFromSnapshot(pendingError)) ? publicSnapshot(pendingError) : createPendingErrorTimeoutSnapshot(pendingError));
					return;
				}
				const pendingTimeout = pendingAgentRunTimeouts.get(params.runId)?.snapshot;
				if (pendingTimeout && pendingTimeout.version > afterVersion && terminalOutcomeFromSnapshot(pendingTimeout)?.reason === "hard_timeout") {
					finish(publicSnapshot(pendingTimeout));
					return;
				}
			}
			finish(null);
		}, params.timeoutMs);
		timeoutHandle.unref?.();
		onWake();
	});
}
ensureAgentRunListener();
//#endregion
//#region src/gateway/server-methods/chat-text-normalization.ts
function normalizeOptionalChatText(value) {
	return value?.trim() || void 0;
}
function normalizeUnknownChatText(value) {
	return typeof value === "string" ? normalizeOptionalChatText(value) : void 0;
}
//#endregion
//#region src/gateway/server-methods/chat-abort-authorization.ts
function buildAbortedChatSendPayload(params) {
	return {
		runId: params.runId,
		status: "timeout",
		summary: "aborted",
		...params.stopReason ? { stopReason: params.stopReason } : {},
		endedAt: params.endedAt
	};
}
function resolveChatAbortRequester(client) {
	const scopes = Array.isArray(client?.connect?.scopes) ? client.connect.scopes : [];
	return {
		connId: normalizeOptionalChatText(client?.connId),
		deviceId: normalizeOptionalChatText(client?.connect?.device?.id),
		isAdmin: scopes.includes(ADMIN_SCOPE)
	};
}
function canRequesterAbortChatRun(entry, requester, options = {}) {
	if (requester.isAdmin) return true;
	const ownerDeviceId = normalizeOptionalChatText(entry.ownerDeviceId);
	const ownerConnId = normalizeOptionalChatText(entry.ownerConnId);
	return Boolean(!options.requireOwnerMatch && !ownerDeviceId && !ownerConnId || ownerDeviceId && requester.deviceId && ownerDeviceId === requester.deviceId || ownerConnId && requester.connId && ownerConnId === requester.connId);
}
function readPreRegisteredAgentDedupePayloadForSession(params) {
	if (!params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const payloadRunId = normalizeUnknownChatText(payload.runId);
	if (payloadRunId && payloadRunId !== params.runId) return;
	const payloadSessionKeys = /* @__PURE__ */ new Set([normalizeUnknownChatText(payload.sessionKey), ...Array.isArray(payload.sessionKeyAliases) ? payload.sessionKeyAliases.map(normalizeUnknownChatText) : []]);
	const hasPayloadSessionKey = [...payloadSessionKeys].some(Boolean);
	if (hasPayloadSessionKey && !payloadSessionKeys.has(params.sessionKey) || !hasPayloadSessionKey && payloadRunId !== params.runId) return;
	const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
	if (agentId) {
		if (resolveChatRunOwnerAgentId({
			agentId: normalizeUnknownChatText(payload.agentId),
			sessionKey: params.sessionKey,
			defaultAgentId: params.defaultAgentId
		}) !== agentId) return;
	}
	return payload;
}
function readPreRegisteredRun(params) {
	if (!params.key.startsWith(params.keyPrefix) || !params.entry?.ok) return;
	const payload = params.entry.payload;
	if (payload?.status !== "accepted") return;
	if (!params.includeHidden && payload.controlUiVisible === false) return;
	const runId = normalizeUnknownChatText(payload.runId) ?? normalizeOptionalChatText(params.key.slice(params.keyPrefix.length));
	const sessionKey = normalizeUnknownChatText(payload.sessionKey);
	if (!runId || !sessionKey) return;
	return {
		runId,
		sessionKey,
		payload
	};
}
function canRequesterAbortPreRegisteredRun(payload, requester) {
	return canRequesterAbortChatRun({
		ownerConnId: normalizeUnknownChatText(payload.ownerConnId),
		ownerDeviceId: normalizeUnknownChatText(payload.ownerDeviceId)
	}, requester);
}
function resolvePreRegisteredAgentDedupeKeys(payload, runId) {
	const keys = [`agent:${runId}`];
	const payloadKeys = Array.isArray(payload.dedupeKeys) ? payload.dedupeKeys : [];
	for (const key of payloadKeys) {
		const normalized = normalizeUnknownChatText(key);
		if (normalized?.startsWith("agent:")) keys.push(normalized);
	}
	return uniqueStrings(keys);
}
function writePreRegisteredAgentAbort(params) {
	const endedAt = params.endedAt ?? Date.now();
	const payloadAgentId = normalizeUnknownChatText(params.payload.agentId);
	for (const key of resolvePreRegisteredAgentDedupeKeys(params.payload, params.runId)) setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key,
		entry: {
			ts: endedAt,
			ok: true,
			payload: {
				runId: params.runId,
				...params.sessionKey ? { sessionKey: params.sessionKey } : {},
				...payloadAgentId ? { agentId: payloadAgentId } : {},
				...params.payload.controlUiVisible === false ? { controlUiVisible: false } : {},
				status: "timeout",
				summary: "aborted",
				stopReason: params.stopReason,
				endedAt
			}
		}
	});
}
function writePreRegisteredChatAbort(params) {
	const endedAt = params.endedAt ?? Date.now();
	const payload = buildAbortedChatSendPayload({
		runId: params.runId,
		stopReason: params.stopReason,
		endedAt
	});
	params.context.chatRunState.getOrCreate(params.runId).abortMarker = createChatAbortMarker(endedAt);
	const pendingKey = pendingChatSendDedupeKey(params.runId);
	const pendingAttemptId = normalizeUnknownChatText((params.context.dedupe.get(pendingKey)?.payload)?.attemptId);
	if (!params.attemptId || pendingAttemptId === params.attemptId) params.context.dedupe.delete(pendingKey);
	setGatewayDedupeEntry({
		dedupe: params.context.dedupe,
		key: `chat:${params.runId}`,
		entry: {
			ts: endedAt,
			ok: true,
			payload
		}
	});
}
function resolveAuthorizedPreRegisteredRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalChatText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const authorizedByRunId = /* @__PURE__ */ new Map();
	let hasUnauthorizedRuns = false;
	let hasUnauthorizedProtectedRuns = false;
	let hasProtectedRuns = false;
	for (const [key, entry] of params.context.dedupe) {
		const run = readPreRegisteredRun({
			key,
			entry,
			keyPrefix: params.keyPrefix,
			includeHidden: true
		});
		if (!run) continue;
		if (params.excludeRunIds?.has(run.runId)) continue;
		if (![run.sessionKey, ...Array.isArray(run.payload.sessionKeyAliases) ? run.payload.sessionKeyAliases.map(normalizeUnknownChatText) : []].some((sessionKey) => Boolean(sessionKey && sessionKeys.has(sessionKey)))) continue;
		if (params.context.chatAbortControllers.has(run.runId)) continue;
		const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
		if (agentId && !chatRunBelongsToAgent({
			agentId: normalizeUnknownChatText(run.payload.agentId),
			sessionKey: run.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		const requesterCanAbort = canRequesterAbortPreRegisteredRun(run.payload, params.requester);
		if (params.includeProtectedRuns !== true && (run.payload.controlUiVisible === false || params.preserveSideRuns && normalizeUnknownChatText(run.payload.turnKind) === "btw")) {
			hasProtectedRuns = true;
			if (!requesterCanAbort) hasUnauthorizedProtectedRuns = true;
			continue;
		}
		if (requesterCanAbort) authorizedByRunId.set(run.runId, run);
		else hasUnauthorizedRuns = true;
	}
	return {
		authorizedRuns: [...authorizedByRunId.values()],
		hasUnauthorizedRuns,
		hasUnauthorizedProtectedRuns,
		hasProtectedRuns
	};
}
function resolveAuthorizedRunsForSessionKeys(params) {
	const sessionKeys = new Set(Array.from(params.sessionKeys, (sessionKey) => normalizeOptionalChatText(sessionKey)).filter((sessionKey) => Boolean(sessionKey)));
	const sessionIds = new Set(Array.from(params.sessionIds ?? [], (sessionId) => normalizeOptionalChatText(sessionId)).filter((sessionId) => Boolean(sessionId)));
	const agentId = normalizeOptionalChatText(params.agentId)?.toLowerCase();
	const authorizedRuns = [];
	const matchedRunIds = [];
	let hasUnauthorizedRuns = false;
	let hasUnauthorizedProtectedRuns = false;
	let hasProtectedRuns = false;
	for (const [runId, active] of params.chatAbortControllers) {
		if (params.excludeRunIds?.has(runId)) continue;
		if (!sessionKeys.has(active.sessionKey) && !sessionIds.has(active.sessionId)) continue;
		if (agentId && !chatRunBelongsToAgent({
			agentId: active.agentId,
			sessionKey: active.sessionKey,
			defaultAgentId: params.defaultAgentId
		}, agentId)) continue;
		matchedRunIds.push(runId);
		const requesterCanAbort = canRequesterAbortChatRun(active, params.requester);
		if (params.includeProtectedRuns !== true && (active.controlUiVisible === false || params.preserveSideRuns && active.turnKind === "btw")) {
			hasProtectedRuns = true;
			if (!requesterCanAbort) hasUnauthorizedProtectedRuns = true;
			continue;
		}
		if (requesterCanAbort) authorizedRuns.push({
			runId,
			sessionKey: active.sessionKey,
			entry: active
		});
		else hasUnauthorizedRuns = true;
	}
	return {
		authorizedRuns,
		matchedRunIds,
		hasUnauthorizedRuns,
		hasUnauthorizedProtectedRuns,
		hasProtectedRuns
	};
}
//#endregion
//#region src/gateway/server-methods/chat-assistant-content.ts
const MANAGED_OUTGOING_MEDIA_PATH_PREFIX = "/api/chat/media/outgoing/";
function collectReplyMediaEntries(payload) {
	const attachmentByReference = /* @__PURE__ */ new Map();
	for (const attachment of payload.attachments ?? []) {
		const reference = (attachment.path ?? attachment.url ?? attachment.mediaUrl ?? attachment.filePath)?.trim();
		if (reference && !attachmentByReference.has(reference)) attachmentByReference.set(reference, attachment);
	}
	const mediaUrlCount = payload.mediaUrls?.length ?? 0;
	return [...(payload.mediaUrls ?? []).map((url, index) => ({
		url,
		attachment: attachmentByReference.get(url.trim()) ?? payload.attachments?.[index]
	})), ...typeof payload.mediaUrl === "string" ? [{
		url: payload.mediaUrl,
		attachment: attachmentByReference.get(payload.mediaUrl.trim()) ?? payload.attachments?.[mediaUrlCount]
	}] : []];
}
function resolveAlignedReplyMedia(payload, metadataSource = payload) {
	const metadataByUrl = /* @__PURE__ */ new Map();
	for (const entry of collectReplyMediaEntries(metadataSource)) {
		const key = entry.url.trim();
		if (key && entry.attachment && !metadataByUrl.has(key)) metadataByUrl.set(key, entry.attachment);
	}
	const seen = /* @__PURE__ */ new Set();
	const mediaUrls = [];
	const attachments = [];
	let hasMetadata = false;
	for (const entry of collectReplyMediaEntries(payload)) {
		const key = entry.url.trim();
		if (!key || seen.has(key)) continue;
		seen.add(key);
		mediaUrls.push(entry.url);
		const attachment = metadataByUrl.get(key) ?? entry.attachment ?? {};
		attachments.push(attachment);
		hasMetadata ||= Object.keys(attachment).length > 0;
	}
	return {
		mediaUrls,
		...hasMetadata ? { attachments } : {}
	};
}
function splitReplyMediaByTrust(media, payloadTrusted) {
	const groups = /* @__PURE__ */ new Map();
	for (const [index, url] of media.mediaUrls.entries()) {
		const attachment = media.attachments?.[index] ?? {};
		const trusted = attachment.trustedLocalMedia ?? payloadTrusted;
		const group = groups.get(trusted) ?? {
			mediaUrls: [],
			attachments: [],
			sourceIndexes: []
		};
		group.mediaUrls.push(url);
		group.attachments.push(attachment);
		group.sourceIndexes.push(index);
		groups.set(trusted, group);
	}
	return [...groups].map(([trustedLocalMedia, group]) => Object.assign(group, { trustedLocalMedia }));
}
/** Recombine non-streamed text without destroying Markdown's meaningful indentation. */
function combineNonStreamingReplyParts(parts) {
	let combined = "";
	for (const part of parts) {
		if (!part.trim()) continue;
		if (!combined) {
			combined = part;
			continue;
		}
		const separator = /[\r\n]$/.test(combined) || /^[\r\n]/.test(part) ? "" : /^[\t ]+\S/.test(part) ? "\n" : "\n\n";
		combined += separator + part;
	}
	return combined.trim();
}
function isMediaBearingPayload(payload) {
	if (payload.isReasoning === true) return false;
	if (payload.mediaUrl?.trim()) return true;
	return Boolean(payload.mediaUrls?.some((url) => url.trim()));
}
function hasSensitiveMediaPayload(payloads) {
	return payloads.some((payload) => payload.sensitiveMedia === true && (isMediaBearingPayload(payload) || Boolean(readPairingQrReplyChannelData(payload))));
}
async function buildPairingQrAssistantContentBlock(payload) {
	const qr = readPairingQrReplyChannelData(payload);
	if (!qr) return;
	const [imageUrl, terminalText] = await Promise.all([renderQrPngDataUrl(qr.setupCode), renderQrTerminal(qr.setupCode, { small: true })]);
	return {
		type: "openclaw_pairing_qr",
		image_url: imageUrl,
		terminalText,
		alt: "OpenClaw pairing QR code",
		expiresAtMs: qr.expiresAtMs,
		sensitive: true
	};
}
function sanitizeAssistantDisplayText(value, options) {
	if (!value) return;
	const withoutEnvelope = stripEnvelopeFromMessage(value);
	const normalized = typeof withoutEnvelope === "string" ? withoutEnvelope : value;
	const stripped = stripInlineDirectiveTagsForDelivery(normalized);
	const visible = stripped.text.trim();
	return visible ? options?.preserveBoundaries && !stripped.changed ? normalized : visible : void 0;
}
function extractAssistantDisplayTextFromContent(content) {
	if (!Array.isArray(content) || content.length === 0) return;
	return combineNonStreamingReplyParts(content.map((block) => {
		if (block?.type !== "text" || typeof block.text !== "string") return "";
		return block.text;
	}).filter(Boolean)) || void 0;
}
async function buildAssistantDisplayContentFromReplyPayloads(params) {
	const rawTextPayloadCount = params.payloads.filter((payload) => payload.isReasoning !== true && typeof payload.text === "string" && payload.text.trim().length > 0).length;
	const plan = createOutboundPayloadPlan(params.payloads);
	if (plan.length === 0) return rawTextPayloadCount > 0 ? [{
		type: "text",
		text: ""
	}] : void 0;
	const preserveTextBoundaries = plan.filter(({ payload }) => typeof payload.text === "string" && payload.text.trim()).length > 1;
	const content = [];
	let strippedTextPayloadCount = 0;
	for (const entry of plan) {
		const payload = entry.payload;
		let managedMediaPrepareFailed = false;
		const text = sanitizeAssistantDisplayText(payload.text, { preserveBoundaries: preserveTextBoundaries });
		if (text) {
			const previousBlock = content.at(-1);
			if (previousBlock?.type === "text" && typeof previousBlock.text === "string") previousBlock.text = combineNonStreamingReplyParts([previousBlock.text, text]);
			else content.push({
				type: "text",
				text
			});
		} else if (typeof payload.text === "string" && payload.text.trim().length > 0) strippedTextPayloadCount += 1;
		if (params.includeSensitiveDisplay === true) try {
			const pairingQrBlock = await buildPairingQrAssistantContentBlock(payload);
			if (pairingQrBlock) content.push(pairingQrBlock);
		} catch (err) {
			params.onSensitiveDisplayPrepareError?.(formatForLog(err));
		}
		if (params.includeSensitiveMedia === false && payload.sensitiveMedia === true) continue;
		const media = resolveAlignedReplyMedia(payload, params.payloads[entry.sourceIndex] ?? payload);
		const preparedMedia = [];
		for (const mediaGroup of splitReplyMediaByTrust(media, payload.trustedLocalMedia === true)) for (const [groupIndex, mediaUrl] of mediaGroup.mediaUrls.entries()) {
			const mediaBlocks = await createManagedOutgoingMediaBlocks({
				sessionKey: params.sessionKey,
				...params.agentId ? { agentId: params.agentId } : {},
				mediaUrls: [mediaUrl],
				attachments: [mediaGroup.attachments[groupIndex] ?? {}],
				localRoots: params.managedMediaLocalRoots,
				allowLocalNonImage: mediaGroup.trustedLocalMedia,
				continueOnPrepareError: true,
				onPrepareError: (error) => {
					managedMediaPrepareFailed = true;
					params.onManagedMediaPrepareError?.(error.message);
				}
			});
			if (payload.audioAsVoice === true) {
				for (const block of mediaBlocks) if (block.type === "audio") block.isVoiceNote = true;
			}
			preparedMedia.push({
				sourceIndex: mediaGroup.sourceIndexes[groupIndex] ?? groupIndex,
				blocks: mediaBlocks
			});
		}
		preparedMedia.sort((left, right) => left.sourceIndex - right.sourceIndex);
		content.push(...preparedMedia.flatMap((preparedEntry) => preparedEntry.blocks));
		if (managedMediaPrepareFailed) content.push({
			type: "text",
			text: appendReplyMediaFailureWarning(void 0)
		});
	}
	if (content.length > 0) return content;
	return strippedTextPayloadCount > 0 ? [{
		type: "text",
		text: ""
	}] : void 0;
}
function replaceAssistantContentTextBlocks(content, transcriptMediaMessage) {
	const transcriptTextBlocks = (transcriptMediaMessage?.content ?? []).filter((block) => Boolean(block) && typeof block === "object" && block.type === "text" && typeof block.text === "string");
	if (transcriptTextBlocks.length === 0) return content ? [...content] : void 0;
	if (!content || content.length === 0) return [...transcriptTextBlocks];
	const merged = [];
	let transcriptTextIndex = 0;
	for (const block of content) {
		if (block?.type === "text" && typeof block.text === "string" && transcriptTextIndex < transcriptTextBlocks.length) {
			merged.push(expectDefined(transcriptTextBlocks[transcriptTextIndex++], "transcript text blocks entry at transcript text index++"));
			continue;
		}
		merged.push(block);
	}
	if (transcriptTextIndex < transcriptTextBlocks.length) merged.unshift(...transcriptTextBlocks.slice(transcriptTextIndex));
	return merged;
}
function isManagedOutgoingMediaUrl(value) {
	if (typeof value !== "string" || !value.trim()) return false;
	try {
		return new URL(value, "http://localhost").pathname.startsWith(MANAGED_OUTGOING_MEDIA_PATH_PREFIX);
	} catch {
		return false;
	}
}
function stripManagedOutgoingAssistantContentBlocks(content) {
	if (!content || content.length === 0) return;
	const filtered = content.filter((block) => {
		if (block?.type !== "image" && block?.type !== "audio" && block?.type !== "video") return true;
		return !(isManagedOutgoingMediaUrl(block.url) || isManagedOutgoingMediaUrl(block.openUrl));
	});
	return filtered.length > 0 ? filtered : void 0;
}
function extractAssistantDisplayText(content) {
	if (!content || content.length === 0) return;
	return combineNonStreamingReplyParts(content.map((block) => block?.type === "text" && typeof block.text === "string" ? block.text : "")) || void 0;
}
function hasAssistantDisplayMediaContent(content) {
	return Boolean(content?.some((block) => block?.type !== "text"));
}
function hasVisibleAssistantFinalMessage(message) {
	if (!message) return false;
	if (typeof message.text === "string" && message.text.trim()) return true;
	return (Array.isArray(message.content) ? message.content : []).some((block) => {
		if (!block || typeof block !== "object") return false;
		const record = block;
		if (record.type === "text") return typeof record.text === "string" && record.text.trim().length > 0;
		return true;
	});
}
function hasManagedOutgoingAssistantContent(content) {
	return Boolean(content?.some((block) => (block?.type === "image" || block?.type === "audio" || block?.type === "video") && (isManagedOutgoingMediaUrl(block.url) || isManagedOutgoingMediaUrl(block.openUrl))));
}
//#endregion
//#region src/gateway/server-methods/chat-transcript-persistence.ts
function assistantTranscriptScope(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey || !params.sessionId.trim()) return null;
	return {
		sessionKey,
		sessionId: params.sessionId,
		...params.storePath ? { storePath: params.storePath } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	};
}
function transcriptEventId(event) {
	const id = asOptionalRecord(event)?.id;
	return typeof id === "string" && id.trim().length > 0 ? id : void 0;
}
function transcriptEventMessage(event) {
	return asOptionalRecord(asOptionalRecord(event)?.message);
}
function findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey) {
	const trimmedIdempotencyKey = idempotencyKey.trim();
	if (!trimmedIdempotencyKey) return null;
	const target = events.toReversed().find((event) => {
		const message = transcriptEventMessage(event);
		return message?.role === "assistant" && message.idempotencyKey === trimmedIdempotencyKey;
	});
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	if (!messageId || !message) return null;
	return {
		messageId,
		message
	};
}
function findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(events, params) {
	const expectedMedia = new Set(params.mediaUrls.map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	if (expectedMedia.size === 0 || !Number.isSafeInteger(params.assistantMessageIndex) || params.assistantMessageIndex < 1) return null;
	const target = events.filter((event) => transcriptEventMessage(event)?.role === "assistant")[params.assistantMessageIndex - 1];
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	const text = message ? extractAssistantTranscriptText(message) : void 0;
	if (!messageId || !message || !text) return null;
	const actualMedia = new Set((splitMediaFromOutput(text).mediaUrls ?? []).map((value) => normalizeMediaReferenceForComparison(value)).filter((value) => value.length > 0));
	return actualMedia.size === expectedMedia.size && [...expectedMedia].every((value) => actualMedia.has(value)) ? {
		messageId,
		message
	} : null;
}
function mergeManagedMediaIntoAssistantContent(params) {
	const original = Array.isArray(params.message.content) ? params.message.content : [];
	const managedBlocks = params.replacement.filter((block) => block?.type !== "text");
	if (managedBlocks.length === 0) return null;
	let replaced = false;
	const merged = [];
	for (const block of original) {
		if (block?.type !== "text" || typeof block.text !== "string") {
			merged.push(block);
			continue;
		}
		const split = splitMediaFromOutput(block.text);
		const visibleText = sanitizeAssistantDisplayText(split.text, { preserveBoundaries: true });
		if (visibleText) {
			const { textSignature: _textSignature, ...rest } = block;
			merged.push({
				...rest,
				text: visibleText
			});
		}
		if (split.mediaUrls?.length && !replaced) {
			merged.push(...managedBlocks);
			replaced = true;
		}
	}
	return replaced ? merged : null;
}
function findSourceReplyTranscriptMirrorByIdempotencyKeyInEvents(events, idempotencyKey) {
	const found = findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey);
	if (found?.message.provider !== "openclaw" || found.message.model !== "delivery-mirror") return null;
	return found;
}
function extractAssistantTranscriptText(message) {
	const content = message.content;
	if (!Array.isArray(content)) return;
	return content.map((block) => block && typeof block === "object" && block.type === "text" && typeof block.text === "string" ? block.text.trim() ?? "" : "").filter(Boolean).join("\n").trim() || void 0;
}
function findSourceReplyTranscriptMirrorByMetadataInEvents(params) {
	const byIdempotencyKey = findSourceReplyTranscriptMirrorByIdempotencyKeyInEvents(params.events, params.idempotencyKey);
	if (byIdempotencyKey) return byIdempotencyKey;
	const expectedText = resolveMirroredTranscriptText({
		text: params.metadata?.text,
		mediaUrls: params.metadata?.mediaUrls
	});
	if (!expectedText) return null;
	const target = params.events.toReversed().find((event) => {
		const message = transcriptEventMessage(event);
		return typeof transcriptEventId(event) === "string" && message?.role === "assistant" && message.provider === "openclaw" && message.model === "delivery-mirror" && extractAssistantTranscriptText(message) === expectedText;
	});
	const message = target ? transcriptEventMessage(target) : void 0;
	const messageId = target ? transcriptEventId(target) : void 0;
	if (!messageId || !message) return null;
	return {
		messageId,
		message
	};
}
async function transcriptExists(scope) {
	const sessionId = scope.sessionId;
	if (!sessionId) return false;
	return await findTranscriptEvent({
		...scope,
		sessionId
	}, () => true).catch(() => void 0) !== void 0;
}
async function appendAssistantTranscriptMessage(params) {
	const scope = assistantTranscriptScope(params);
	if (!scope) return {
		ok: false,
		error: "transcript identity not resolved"
	};
	if (!params.createIfMissing && !await transcriptExists(scope)) return {
		ok: false,
		error: "transcript not found"
	};
	return await appendInjectedAssistantMessageToTranscript({
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		storePath: params.storePath,
		...params.agentId ? { agentId: params.agentId } : {},
		message: params.message,
		label: params.label,
		content: params.content,
		idempotencyKey: params.idempotencyKey,
		abortMeta: params.abortMeta,
		ttsSupplement: params.ttsSupplement,
		config: params.cfg
	});
}
async function touchAssistantTranscriptSessionEntry(scope) {
	if (!scope.storePath || !scope.sessionKey || !scope.sessionId) return;
	const transcriptMarkerUpdatedAt = Date.now();
	await patchSessionEntryCore({
		storePath: scope.storePath,
		sessionKey: scope.sessionKey,
		...scope.agentId ? { agentId: scope.agentId } : {}
	}, (current) => current.sessionId === scope.sessionId ? { updatedAt: transcriptMarkerUpdatedAt } : null, { skipMaintenance: true });
}
async function rewriteSourceReplyTranscriptMirrors(params) {
	if (params.requests.length === 0 || params.candidates.length === 0) return [];
	return await withTranscriptWriteLock(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const allowedSourceReplyMirrorIds = /* @__PURE__ */ new Set();
		for (const candidate of params.candidates) {
			const target = findSourceReplyTranscriptMirrorByMetadataInEvents({
				events,
				idempotencyKey: candidate.idempotencyKey,
				metadata: candidate.metadata
			});
			if (target) allowedSourceReplyMirrorIds.add(target.messageId);
		}
		const rewriteTargets = [];
		for (const request of params.requests) {
			const target = findSourceReplyTranscriptMirrorByMetadataInEvents({
				events,
				idempotencyKey: request.idempotencyKey,
				metadata: request.metadata
			});
			if (target) rewriteTargets.push({
				request,
				...target
			});
		}
		if (rewriteTargets.length === 0) return [];
		const rewriteTargetIds = new Set(rewriteTargets.map((target) => target.messageId));
		const firstRewriteEntryIndex = events.findIndex((event) => {
			const id = transcriptEventId(event);
			return id ? rewriteTargetIds.has(id) : false;
		});
		if (!(firstRewriteEntryIndex >= 0 && events.slice(firstRewriteEntryIndex).every((event) => {
			const id = transcriptEventId(event);
			return !id || allowedSourceReplyMirrorIds.has(id);
		}))) return [];
		const replacementsById = new Map(rewriteTargets.map((target) => [target.messageId, target]));
		const rewrittenEvents = events.map((event) => {
			const id = transcriptEventId(event);
			const replacement = id ? replacementsById.get(id) : void 0;
			if (!replacement) return event;
			return Object.assign({}, event, { message: {
				...replacement.message,
				idempotencyKey: replacement.request.idempotencyKey,
				content: replacement.request.state.persistedContent
			} });
		});
		await transcript.replaceEvents(rewrittenEvents);
		return rewriteTargets.map((target) => ({
			messageId: target.messageId,
			request: target.request
		}));
	});
}
async function rewriteAssistantTranscriptMessageByIdempotencyKey(params) {
	const idempotencyKey = params.idempotencyKey.trim();
	if (!idempotencyKey || params.content.length === 0) return null;
	return await withTranscriptWriteLock(params.scope, async (transcript) => {
		const events = await transcript.readEvents();
		const target = findAssistantTranscriptMessageByIdempotencyKeyInEvents(events, idempotencyKey);
		if (!target) return null;
		const rewrittenEvents = events.map((event) => transcriptEventId(event) === target.messageId ? Object.assign({}, event, { message: {
			...target.message,
			content: params.content
		} }) : event);
		await transcript.replaceEvents(rewrittenEvents);
		return { messageId: target.messageId };
	});
}
async function rewriteAssistantTranscriptMessageByTurnIndexAndMedia(params) {
	if (params.content.length === 0 || params.mediaUrls.length === 0) return null;
	const currentWatermark = readSessionTranscriptWatermark(params.scope);
	const initialGenerationMaterialized = params.expectedGeneration === null && params.afterSeq === 0;
	if (currentWatermark.generation !== params.expectedGeneration && !initialGenerationMaterialized) return null;
	const currentTurnRows = loadTranscriptEventRowsAfterSeqSync(params.scope, params.afterSeq);
	const target = findAssistantTranscriptMessageByTurnIndexAndMediaInEvents(currentTurnRows.map((row) => row.event), params);
	if (!target) return null;
	const targetRow = currentTurnRows.find((row) => transcriptEventId(row.event) === target.messageId);
	if (!targetRow) return null;
	const mergedContent = mergeManagedMediaIntoAssistantContent({
		message: target.message,
		replacement: params.content
	});
	if (!mergedContent) return null;
	const rewrittenMessage = applyAssistantDeliveryDirectives({
		...target.message,
		content: mergedContent
	});
	const rewrittenEvent = Object.assign({}, targetRow.event, { message: rewrittenMessage });
	const rewritten = await rewriteTranscriptEventRowsExact(params.scope, {
		allowInitialGenerationMaterialization: initialGenerationMaterialized,
		expectedGeneration: params.expectedGeneration,
		rows: [{
			event: rewrittenEvent,
			expectedEventJson: JSON.stringify(targetRow.event),
			seq: targetRow.seq
		}]
	});
	return rewritten ? {
		generation: rewritten.generation,
		messageId: target.messageId
	} : null;
}
async function publishAssistantTranscriptRewrite(params) {
	if (params.rewritten.length === 0) return;
	await touchAssistantTranscriptSessionEntry(params.scope);
	await publishTranscriptUpdate(params.scope, { messageId: params.rewritten.at(-1)?.messageId });
}
//#endregion
//#region src/gateway/server-methods/chat-abort-runtime.ts
function prepareControlledSubagentAbort(params) {
	const controller = resolveSubagentController({
		cfg: params.cfg,
		agentSessionKey: params.sessionKey,
		agentId: params.agentId
	});
	const runs = listSubagentRunsForController(controller.controllerSessionKey, controller.controllerAgentId).filter((entry) => params.requesterTurnRunId === void 0 || entry.requesterTurnRunId === params.requesterTurnRunId);
	return async () => runs.length === 0 ? void 0 : await killAllControlledSubagentRuns({
		cfg: params.cfg,
		controller,
		runs,
		suppressTaskDelivery: true
	});
}
const SESSION_LIFECYCLE_ABORT_REQUESTER = { isAdmin: true };
async function persistAbortedPartials(params) {
	for (const snapshot of params.snapshots) {
		const sessionLoadOptions = snapshot.agentId ? { agentId: snapshot.agentId } : void 0;
		const { cfg, storePath, entry } = loadGatewaySessionEntry(params.sessionKey, sessionLoadOptions);
		if (snapshot.abortOrigin === "placement-abandon" && entry?.sessionId !== snapshot.sessionId) throw new Error("Placement abandonment transcript session changed before persistence");
		const sessionId = entry?.sessionId ?? snapshot.sessionId;
		const appended = await appendAssistantTranscriptMessage({
			sessionKey: params.sessionKey,
			message: snapshot.text,
			sessionId,
			storePath,
			...snapshot.agentId ? { agentId: snapshot.agentId } : {},
			createIfMissing: true,
			idempotencyKey: `${snapshot.runId}:assistant`,
			cfg,
			abortMeta: {
				aborted: true,
				origin: snapshot.abortOrigin,
				runId: snapshot.runId
			}
		});
		if (!appended.ok) {
			const error = `chat.abort transcript append failed: ${appended.error ?? "unknown error"}`;
			params.context.logGateway.warn(error);
			if (snapshot.abortOrigin === "placement-abandon") throw new Error(error);
		}
	}
}
function createChatAbortOps(context) {
	return {
		chatAbortControllers: context.chatAbortControllers,
		chatRunState: context.chatRunState,
		removeChatRun: context.removeChatRun,
		agentRunSeq: context.agentRunSeq,
		getRuntimeConfig: context.getRuntimeConfig,
		broadcast: context.broadcast,
		nodeSendToSession: context.nodeSendToSession,
		onRunAborted: context.cancelRunBoundApprovals
	};
}
function resolveAuthorizedQueuedTurnsForSession(params) {
	const matches = listQueuedChatTurnsForSession({
		chatQueuedTurns: params.context.chatQueuedTurns,
		sessionKeys: params.sessionKeys,
		sessionIds: [params.sessionId],
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId
	});
	const authorized = matches.filter((match) => canRequesterAbortChatRun(match.entry, params.requester));
	return {
		authorized,
		hasUnauthorizedRuns: authorized.length < matches.length
	};
}
/** Authoritative active, pending, or queued Gateway owner for an exact session. */
function hasGatewaySessionAbortOwner(params) {
	const ownerScope = {
		sessionKeys: params.sessionKeys,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: SESSION_LIFECYCLE_ABORT_REQUESTER
	};
	return resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionIds: [params.sessionId],
		...ownerScope,
		includeProtectedRuns: true
	}).authorizedRuns.length > 0 || resolveAuthorizedQueuedTurnsForSession({
		context: params.context,
		sessionId: params.sessionId,
		...ownerScope
	}).authorized.length > 0 || ["agent:", "pending-chat:"].some((keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		context: params.context,
		...ownerScope,
		keyPrefix,
		includeProtectedRuns: true
	}).authorizedRuns.length > 0);
}
function cancelWorkerInferenceForSession(params) {
	const sessionId = normalizeOptionalChatText(params.sessionId);
	if (!sessionId) return [];
	return asWorkerInferenceControl(params.context.workerEnvironmentService)?.cancelInferenceForSession({
		sessionId,
		...params.runId ? { runId: params.runId } : {}
	}) ?? [];
}
async function abortChatRunsForSessionKeyWithPartials(params) {
	const sessionKeys = [params.sessionKey, ...params.sessionKeyAliases ?? []];
	const queuedPlan = resolveAuthorizedQueuedTurnsForSession({
		context: params.context,
		sessionKeys,
		sessionId: params.sessionId,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester
	});
	const { authorizedRuns, matchedRunIds: matchedActiveRunIds, hasUnauthorizedRuns: hasUnauthorizedActiveRuns, hasUnauthorizedProtectedRuns: hasUnauthorizedProtectedActiveRuns, hasProtectedRuns: hasProtectedActiveRuns } = resolveAuthorizedRunsForSessionKeys({
		chatAbortControllers: params.context.chatAbortControllers,
		sessionKeys,
		sessionIds: [params.sessionId],
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester,
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns,
		excludeRunIds: params.excludeRunIds
	});
	const resolvePendingRuns = (keyPrefix) => resolveAuthorizedPreRegisteredRunsForSessionKeys({
		context: params.context,
		sessionKeys,
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		requester: params.requester,
		keyPrefix,
		preserveSideRuns: params.preserveSideRuns,
		includeProtectedRuns: params.includeProtectedRuns,
		excludeRunIds: params.excludeRunIds
	});
	const pendingAgent = resolvePendingRuns("agent:");
	const pendingChat = resolvePendingRuns(PENDING_CHAT_SEND_DEDUPE_PREFIX);
	const pendingPlans = [pendingAgent, pendingChat];
	const hasAuthorizedGatewayRuns = authorizedRuns.length > 0 || queuedPlan.authorized.length > 0 || pendingPlans.some((plan) => plan.authorizedRuns.length > 0);
	const workerService = asWorkerInferenceControl(params.context.workerEnvironmentService);
	const workerSessionId = params.sessionId;
	const hasWorkerRun = Boolean(workerSessionId && (!hasAuthorizedGatewayRuns || params.onAuthorizedAfterQueuedAbort) && workerService?.hasInferenceForSession(workerSessionId));
	const hasControllerRepresentedWorkerRun = Boolean(hasWorkerRun && workerSessionId && workerService && matchedActiveRunIds.some((runId) => workerService.hasInferenceForSession(workerSessionId, runId)));
	const hasUnauthorizedOwner = hasUnauthorizedActiveRuns || queuedPlan.hasUnauthorizedRuns || pendingPlans.some((plan) => plan.hasUnauthorizedRuns) || hasWorkerRun && !hasControllerRepresentedWorkerRun && !params.requester.isAdmin;
	const hasProtectedLifecycleRuns = hasProtectedActiveRuns || pendingPlans.some((plan) => plan.hasProtectedRuns);
	const hasUnauthorizedProtectedOwner = hasUnauthorizedProtectedActiveRuns || pendingPlans.some((plan) => plan.hasUnauthorizedProtectedRuns);
	const hasUnauthorizedLifecycleOwner = Boolean(params.onAuthorizedAfterQueuedAbort) && hasUnauthorizedProtectedOwner;
	const canRunLifecycleCleanup = !hasUnauthorizedOwner && !hasProtectedLifecycleRuns;
	const canCancelWorkerSession = !params.onAuthorizedAfterQueuedAbort || !hasProtectedLifecycleRuns;
	params.onControllerTargets?.(authorizedRuns);
	if (!hasAuthorizedGatewayRuns) {
		if (hasUnauthorizedOwner || hasUnauthorizedLifecycleOwner) return {
			aborted: false,
			runIds: [],
			unauthorized: true
		};
		const additionalAborted = canRunLifecycleCleanup ? params.onAuthorizedAfterQueuedAbort?.() ?? false : false;
		if (!hasWorkerRun || !workerSessionId || !params.requester.isAdmin || !canCancelWorkerSession) return {
			aborted: additionalAborted,
			runIds: [],
			unauthorized: false
		};
		const workerRunIds = cancelWorkerInferenceForSession({
			context: params.context,
			sessionId: workerSessionId
		});
		return {
			aborted: additionalAborted || workerRunIds.length > 0,
			runIds: workerRunIds,
			unauthorized: false
		};
	}
	const snapshots = authorizedRuns.flatMap(({ runId, entry }) => {
		const text = params.context.chatRunState.resolveBuffer(runId).text;
		return text?.trim() ? [{
			runId,
			sessionId: entry.sessionId,
			agentId: entry.agentId,
			text,
			abortOrigin: params.abortOrigin
		}] : [];
	});
	const runIds = abortQueuedChatTurns(params.context.chatQueuedTurns, queuedPlan.authorized, params.stopReason);
	const additionalAborted = canRunLifecycleCleanup ? params.onAuthorizedAfterQueuedAbort?.() ?? false : false;
	for (const { runId, sessionKey } of authorizedRuns) if (abortChatRunById(params.ops, {
		runId,
		sessionKey,
		stopReason: params.stopReason
	}).aborted) runIds.push(runId);
	const endedAt = Date.now();
	const stopReason = params.stopReason ?? "rpc";
	for (const { runId, sessionKey, payload } of pendingAgent.authorizedRuns) {
		writePreRegisteredAgentAbort({
			context: params.context,
			runId,
			sessionKey,
			payload,
			stopReason,
			endedAt
		});
		runIds.push(runId);
	}
	for (const { runId, payload } of pendingChat.authorizedRuns) {
		writePreRegisteredChatAbort({
			context: params.context,
			runId,
			stopReason,
			endedAt,
			attemptId: normalizeUnknownChatText(payload.attemptId)
		});
		runIds.push(runId);
	}
	if (params.requester.isAdmin && canCancelWorkerSession) {
		for (const runId of cancelWorkerInferenceForSession({
			context: params.context,
			sessionId: params.sessionId
		})) if (!runIds.includes(runId)) runIds.push(runId);
	}
	const res = {
		aborted: additionalAborted || runIds.length > 0,
		runIds,
		unauthorized: false
	};
	if (res.aborted && snapshots.length > 0) {
		const abortedRunIds = new Set(runIds);
		await persistAbortedPartials({
			context: params.context,
			sessionKey: params.persistSessionKey ?? params.sessionKey,
			snapshots: snapshots.filter((snapshot) => abortedRunIds.has(snapshot.runId))
		});
	}
	return res;
}
//#endregion
export { resolveChatAbortRequester as A, sanitizeAssistantDisplayText as C, canRequesterAbortPreRegisteredRun as D, canRequesterAbortChatRun as E, setGatewayDedupeEntry as F, waitForAgentJob as I, writePreRegisteredChatAbort as M, normalizeOptionalChatText as N, readPreRegisteredAgentDedupePayloadForSession as O, normalizeUnknownChatText as P, replaceAssistantContentTextBlocks as S, buildAbortedChatSendPayload as T, hasAssistantDisplayMediaContent as _, persistAbortedPartials as a, hasVisibleAssistantFinalMessage as b, assistantTranscriptScope as c, rewriteAssistantTranscriptMessageByTurnIndexAndMedia as d, rewriteSourceReplyTranscriptMirrors as f, extractAssistantDisplayTextFromContent as g, extractAssistantDisplayText as h, hasGatewaySessionAbortOwner as i, writePreRegisteredAgentAbort as j, readPreRegisteredRun as k, publishAssistantTranscriptRewrite as l, combineNonStreamingReplyParts as m, cancelWorkerInferenceForSession as n, prepareControlledSubagentAbort as o, buildAssistantDisplayContentFromReplyPayloads as p, createChatAbortOps as r, appendAssistantTranscriptMessage as s, abortChatRunsForSessionKeyWithPartials as t, rewriteAssistantTranscriptMessageByIdempotencyKey as u, hasManagedOutgoingAssistantContent as v, stripManagedOutgoingAssistantContentBlocks as w, isMediaBearingPayload as x, hasSensitiveMediaPayload as y };
