import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { n as createLazyPromise, r as createLazyPromiseLoader } from "./lazy-promise-DGqyc4Y4.js";
import { s as asFiniteNumber } from "./number-coercion-oCkfUEEq.js";
import { u as redactToolPayloadText } from "./redact-DP7p9QfH.js";
import { h as resolveSessionAgentId } from "./agent-scope-D9GLFAyB.js";
import { b as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CsnnOL14.js";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CLtsGq3M.js";
import { r as getRuntimeConfig } from "./io-BTBpQ7uO.js";
import { _ as onTrustedToolExecutionEvent } from "./diagnostic-events-Djn4AVRp.js";
import { t as createSubsystemLogger } from "./subsystem-DNgaGOch.js";
import "./legacy.default-agent-owner-0YGX8Nyg.js";
import { d as onAgentRuntimeEvent, l as onAgentAuditEvent } from "./agent-events-Cmj8toCy.js";
import { a as clearAgentRunContext, c as getAgentRunContext } from "./agent-run-registry-cxavoLf6.js";
import { i as resolveStoredSessionKeyForAgentStore } from "./session-store-key-Cc0gbvo8.js";
import { c as readSessionTranscriptBoundedMessageTailPage, x as isSessionTranscriptProjectionUnavailableError } from "./session-accessor-CIiPoGwM.js";
import { g as onSessionLifecycleEvent } from "./session-accessor.sqlite-lifecycle-BFaW8ajj.js";
import { n as onInternalSessionTranscriptUpdate } from "./transcript-events-D-a7D51Y.js";
import { a as configureChannelAdmissionEvidenceCollection, i as configureChannelAdmissionDecisionSink } from "./admission-evidence-UgNy_kxM.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import "./prepared-model-runtime-BK-D17bD.js";
import { t as configureExecutionIdentityAdmissionSink } from "./execution-identity-admission-0VwmKVHN.js";
import { n as isExecutionIdentityCollectionEnabled, r as resolveAuditMessageMode, t as isAuditLedgerEnabled } from "./audit-config-BKFiXlHH.js";
import { et as isTerminalTaskStatus } from "./task-registry-activity-CbVvLa99.js";
import { E as loadGatewaySessionEntryReadOnly } from "./session-utils-row-xwseApeF.js";
import { n as tryResolveSessionCompatibilityOwnerAgentId } from "./session-request-agent-D8DcCzQX.js";
import "./session-utils-DvNvk7rk.js";
import { r as onTrustedMessageAuditEvent } from "./message-audit-events-DGtoPYvb.js";
import { r as stripToolMessages, t as extractStoredAssistantText } from "./chat-history-text-DJ2UV7io.js";
import { t as stripMarkdown } from "./strip-markdown-BvWlMYk4.js";
import { n as resolveUtilityModelRefForAgent } from "./utility-model-CPi3mZzQ.js";
import { f as markChatAbortTerminalPersistenceError, s as removeChatAbortControllerEntry } from "./chat-abort-9K8jqLDL.js";
import { n as resolveSessionSubscriptionKeys, t as resolveSessionSubscriptionKey } from "./session-subscription-keys-KDeUeJtW.js";
import { n as onGatewaySessionReset } from "./session-reset-notifications-DgKdsPPS.js";
import { i as terminalHealthFor, n as flushSessionActivityAssistantNote, r as noteSessionActivityEvent, t as createSessionActivityNoteState } from "./session-activity-notes-BO5pUfun.js";
import { a as sanitizeProgressStatusText } from "./progress-draft-status-text-C0cP-IPx.js";
import { r as onHeartbeatEvent } from "./heartbeat-events-bg9alNGv.js";
import { i as resolveVisibleActiveSessionRunState } from "./session-active-runs-CaTtpnPN.js";
import { t as createAuditEventRecorder } from "./audit-recorder-CPRwMn6Q.js";
import { a as defaultPersistDigest, c as isTerminalLifecycleEvent, d as rememberSessionObserverDisabledRun, f as rememberSessionObserverDormantRun, h as synthesizeSessionObserverTerminalDigest, i as defaultCompleteModel, l as markSessionObserverRunSuperseded, m as sessionObserverScopeKey, n as buildSessionObserverPrompt, o as defaultPrepareModel, p as rememberSessionObserverRevisionFloor, r as createDormantSessionObserverRun, s as defaultReadSession, t as SESSION_OBSERVER_SYSTEM_PROMPT, u as normalizeSessionObserverModelOutput } from "./session-observer-model-34GnAwr_.js";
import { t as mapTaskSummary } from "./task-summary-iu0SO8TQ.js";
import { n as createSessionCompanionAskRuntime } from "./session-companion-ask-_msY3wFP.js";
//#region src/gateway/session-companion-context.ts
const CONTEXT_MAX_MESSAGES = 40;
const CONTEXT_MAX_BYTES = 24 * 1024;
const CONTEXT_MESSAGE_MAX_CHARS = 4e3;
const CONTEXT_READ_MAX_SCANNED_MESSAGES = 4096;
const CONTEXT_READ_MAX_BYTES = 1024 * 1024;
const CONTEXT_READ_PAGE_MESSAGES = 128;
function normalizeContextText(value) {
	return truncateUtf16Safe(redactToolPayloadText(value).replace(/\s+/gu, " ").trim(), CONTEXT_MESSAGE_MAX_CHARS);
}
function extractUserText(message) {
	if (!message || typeof message !== "object") return;
	const content = message.content;
	if (typeof content === "string") return normalizeContextText(content) || void 0;
	if (!Array.isArray(content)) return;
	return normalizeContextText(content.flatMap((block) => {
		if (!block || typeof block !== "object" || block.type !== "text") return [];
		const blockText = block.text;
		return typeof blockText === "string" ? [blockText] : [];
	}).join("\n")) || void 0;
}
function readMessageTimestamp(message) {
	if (!message || typeof message !== "object") return 0;
	const value = message.timestamp;
	return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}
function sanitizeContextMessages(messages) {
	return stripToolMessages(messages).flatMap((message) => {
		if (!message || typeof message !== "object") return [];
		const role = message.role;
		const text = role === "assistant" ? normalizeContextText(extractStoredAssistantText(message) ?? "") : role === "user" ? extractUserText(message) : void 0;
		return text && (role === "assistant" || role === "user") ? [{
			role,
			text,
			ts: readMessageTimestamp(message)
		}] : [];
	});
}
function selectContextMessages(messages) {
	const selected = [];
	let bytes = 2;
	for (const message of messages.toReversed()) {
		if (selected.length >= CONTEXT_MAX_MESSAGES) break;
		const messageBytes = Buffer.byteLength(JSON.stringify(message), "utf8") + 1;
		if (bytes + messageBytes > CONTEXT_MAX_BYTES) break;
		selected.unshift(message);
		bytes += messageBytes;
	}
	return selected;
}
function readPageMessages(events) {
	return events.flatMap(({ event }) => {
		if (!event || typeof event !== "object") return [];
		const message = event.message;
		return message && typeof message === "object" ? [message] : [];
	});
}
async function readSessionCompanionContext(params) {
	const loaded = loadGatewaySessionEntryReadOnly(params.sessionKey, { agentId: params.agentId });
	const sessionId = loaded.entry?.sessionId?.trim();
	if (!sessionId) return { kind: "missing" };
	try {
		const scope = {
			agentId: params.agentId,
			sessionId,
			sessionKey: params.sessionKey,
			storePath: loaded.storePath
		};
		if (params.signal?.aborted) return { kind: "unavailable" };
		let offset = 0;
		let rawBytes = 0;
		let scannedMessages = 0;
		let totalMessages = 0;
		let snapshot;
		let contextMessages = [];
		while (contextMessages.length < CONTEXT_MAX_MESSAGES && scannedMessages < CONTEXT_READ_MAX_SCANNED_MESSAGES) {
			const page = readSessionTranscriptBoundedMessageTailPage(scope, {
				maxBytes: CONTEXT_READ_MAX_BYTES - rawBytes,
				maxMessages: Math.min(CONTEXT_READ_PAGE_MESSAGES, CONTEXT_READ_MAX_SCANNED_MESSAGES - scannedMessages),
				offset
			});
			if (params.signal?.aborted || page.events.length !== page.scannedMessages) return { kind: "unavailable" };
			const pageSnapshot = {
				activeLeafEntryId: page.activeLeafEntryId,
				generation: page.snapshot.generation,
				indexedSeq: page.snapshot.indexedSeq,
				totalMessages: page.totalMessages
			};
			snapshot ??= pageSnapshot;
			if (pageSnapshot.activeLeafEntryId !== snapshot.activeLeafEntryId || pageSnapshot.generation !== snapshot.generation || pageSnapshot.indexedSeq !== snapshot.indexedSeq || pageSnapshot.totalMessages !== snapshot.totalMessages) return { kind: "unavailable" };
			totalMessages = page.totalMessages;
			rawBytes += page.serializedBytes;
			scannedMessages += page.scannedMessages;
			offset += page.scannedMessages;
			contextMessages = [...sanitizeContextMessages(readPageMessages(page.events)), ...contextMessages].slice(-40);
			if (page.scannedMessages === 0 || offset >= totalMessages) break;
		}
		if (contextMessages.length < CONTEXT_MAX_MESSAGES && offset < totalMessages) return { kind: "unavailable" };
		const fence = readSessionTranscriptBoundedMessageTailPage(scope, {
			maxBytes: 0,
			maxMessages: 0,
			offset: 0
		});
		if (params.signal?.aborted || !snapshot || fence.activeLeafEntryId !== snapshot.activeLeafEntryId || fence.snapshot.generation !== snapshot.generation || fence.snapshot.indexedSeq !== snapshot.indexedSeq || fence.totalMessages !== snapshot.totalMessages) return { kind: "unavailable" };
		return {
			kind: "ready",
			context: {
				empty: totalMessages === 0,
				messages: selectContextMessages(contextMessages),
				sessionId
			}
		};
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error)) return { kind: "unavailable" };
		return { kind: "unavailable" };
	}
}
const defaultSessionCompanionContextReader = {
	currentSessionId: ({ agentId, sessionKey }) => loadGatewaySessionEntryReadOnly(sessionKey, { agentId }).entry?.sessionId?.trim() || void 0,
	read: readSessionCompanionContext
};
//#endregion
//#region src/gateway/session-companion.ts
const SESSION_COMPANION_IDLE_TTL_MS = 120 * 6e4;
const SESSION_COMPANION_SWEEP_INTERVAL_MS = 10 * 6e4;
function createSessionCompanion(deps) {
	const now = deps.now ?? Date.now;
	const setIntervalFn = deps.setIntervalFn ?? setInterval;
	const clearIntervalFn = deps.clearIntervalFn ?? clearInterval;
	const threads = /* @__PURE__ */ new Map();
	let disposed = false;
	const askRuntime = createSessionCompanionAskRuntime({
		...deps,
		now,
		threads,
		isDisposed: () => disposed
	});
	const reset = (target, cancellation) => {
		const sessionKey = target.sessionKey.trim();
		const agentId = target.agentId.trim();
		if (!sessionKey || !agentId) return;
		const key = sessionObserverScopeKey(sessionKey, agentId);
		askRuntime.cancel(sessionKey, agentId, cancellation);
		threads.delete(key);
	};
	const sweep = () => {
		const cutoff = now() - SESSION_COMPANION_IDLE_TTL_MS;
		for (const [key, thread] of threads) if (!thread.busy && thread.lastUsedAt <= cutoff) threads.delete(key);
	};
	const sweepTimer = setIntervalFn(sweep, SESSION_COMPANION_SWEEP_INTERVAL_MS);
	sweepTimer.unref?.();
	const unsubscribeReset = onGatewaySessionReset((sessionKey, suppliedAgentId) => {
		let agentId = suppliedAgentId;
		try {
			agentId ??= resolveSessionAgentId({
				sessionKey,
				config: deps.getConfig()
			});
		} catch {
			return;
		}
		reset({
			sessionKey,
			agentId
		}, "backing-session-revoked");
	});
	return {
		ask: askRuntime.ask,
		state(target) {
			const key = sessionObserverScopeKey(target.sessionKey.trim(), target.agentId.trim());
			const thread = threads.get(key);
			if (!thread) return { exchanges: [] };
			thread.lastUsedAt = now();
			return { exchanges: thread.exchanges.map(({ question, answer, ts }) => ({
				question,
				answer,
				ts
			})) };
		},
		reset(target) {
			reset(target, "explicit-reset");
		},
		dispose() {
			if (disposed) return;
			disposed = true;
			clearIntervalFn(sweepTimer);
			unsubscribeReset();
			askRuntime.dispose();
			threads.clear();
		}
	};
}
//#endregion
//#region src/gateway/session-observer-audience.ts
function createSessionObserverAudience(params) {
	const messageSubscriberKeys = (sessionKey, agentId) => {
		const config = params.getConfig();
		const persistedOwner = resolvePersistedSessionStoreOwnerForKey(config, sessionKey);
		return resolveSessionSubscriptionKeys(sessionKey, agentId, persistedOwner.kind === "configured" ? persistedOwner.agentId : tryResolveLegacyCompatibilityAgentId(config));
	};
	const messageRecipients = (sessionKey, agentId) => {
		const recipients = /* @__PURE__ */ new Set();
		for (const key of messageSubscriberKeys(sessionKey, agentId)) for (const connId of params.subscribers.get(key)) recipients.add(connId);
		return recipients;
	};
	return {
		deliveryOptions(sessionKey, agentId) {
			return {
				agentId,
				dropIfSlow: true,
				sessionKeys: messageSubscriberKeys(sessionKey, agentId),
				sessionSubscriptionVerified: true
			};
		},
		has(sessionKey, agentId) {
			for (const connId of messageRecipients(sessionKey, agentId)) if (params.isVisible(connId)) return true;
			for (const connId of params.sessionEventSubscribers?.getAll() ?? []) if (params.isVisible(connId)) return true;
			return false;
		},
		recipients(sessionKey, agentId) {
			const recipients = messageRecipients(sessionKey, agentId);
			for (const connId of params.sessionEventSubscribers?.getAll() ?? []) if (params.isVisible(connId)) recipients.add(connId);
			return recipients;
		},
		criticalRecipients(sessionKey, agentId) {
			const recipients = messageRecipients(sessionKey, agentId);
			for (const connId of params.sessionEventSubscribers?.getAll() ?? []) recipients.add(connId);
			return recipients;
		}
	};
}
//#endregion
//#region src/gateway/session-observer-companion.ts
function createSessionObserverCompanionSnapshotReader(params) {
	return (sessionKey, selectedAgentId) => {
		const cfg = params.getConfig();
		const agentId = resolveSessionAgentId({
			sessionKey,
			config: cfg,
			...selectedAgentId ? { agentId: selectedAgentId } : {}
		});
		const canonicalSessionKey = resolveStoredSessionKeyForAgentStore({
			cfg,
			agentId,
			sessionKey
		});
		const state = params.states.get(resolveSessionSubscriptionKey(canonicalSessionKey, agentId));
		if (state) {
			flushSessionActivityAssistantNote(state);
			return {
				agentId: state.agentId,
				runId: state.runId,
				...state.previousDigest ? { digest: state.previousDigest } : {},
				notes: state.notes.map((note) => ({
					sequence: note.sequence,
					text: note.text
				}))
			};
		}
		const digest = params.readSession(canonicalSessionKey, agentId)?.observerDigest;
		return {
			agentId,
			...digest?.runId ? { runId: digest.runId } : {},
			...digest ? { digest } : {},
			notes: []
		};
	};
}
//#endregion
//#region src/gateway/session-observer-completion.ts
const MODEL_TIMEOUT_MS = 1e4;
/**
* Marks a transient prepareModel failure (PreparedModelRuntimeOwnerNotPublishedError
* — code `prepared_model_runtime_owner_not_published`, includes its
* PublicationSuperseded subclass). The run-digest catch treats this as
* non-fatal so a long-lived owner-not-published condition cannot disable
* the observer after two cycles; the next observer attempt must re-prepare.
*/
var SessionObserverPrepareTransientError = class extends Error {
	constructor(cause) {
		super("session observer prepare failed transiently", { cause });
		this.name = "SessionObserverPrepareTransientError";
	}
};
function createSessionObserverCompletion(params) {
	const ensurePrepared = async (state) => {
		const modelRef = state.utilityModelRef;
		if (!modelRef) throw new Error("session observer utility model is unavailable");
		if (!state.preparedPromise) state.preparedPromise = params.prepareModel({
			cfg: params.getConfig(),
			agentId: state.agentId,
			modelRef,
			useUtilityModel: true,
			allowMissingApiKeyModes: ["aws-sdk"]
		});
		const promise = state.preparedPromise;
		try {
			return await promise;
		} catch (error) {
			if (state.preparedPromise === promise) state.preparedPromise = void 0;
			if (error instanceof PreparedModelRuntimeOwnerNotPublishedError) throw new SessionObserverPrepareTransientError(error);
			throw error;
		}
	};
	return async (state, notes) => {
		const controller = new AbortController();
		state.activeController = controller;
		const timeout = params.setTimeoutFn(() => controller.abort(), MODEL_TIMEOUT_MS);
		const aborted = new Promise((_resolve, reject) => {
			controller.signal.addEventListener("abort", () => reject(/* @__PURE__ */ new Error("session observer model call timed out or was cancelled")), { once: true });
		});
		try {
			const execute = async () => {
				const prepared = await ensurePrepared(state);
				if (!params.isCurrent(state) || controller.signal.aborted) throw new Error("session observer state is no longer active");
				if ("error" in prepared) throw new Error(prepared.error);
				for (let attempt = 0; attempt < 2; attempt += 1) {
					if (!params.isCurrent(state) || controller.signal.aborted) throw new Error("session observer state is no longer active");
					const result = await params.completeModel({
						model: prepared.model,
						auth: prepared.auth,
						cfg: params.getConfig(),
						context: {
							systemPrompt: SESSION_OBSERVER_SYSTEM_PROMPT,
							messages: [{
								role: "user",
								content: buildSessionObserverPrompt(state, notes),
								timestamp: params.now()
							}]
						},
						options: {
							maxTokens: Math.min(300, Math.floor(prepared.model.maxTokens)),
							temperature: .2,
							signal: controller.signal
						}
					});
					if (result.stopReason === "error") throw new Error(result.errorMessage?.trim() || "session observer completion failed");
					const parsed = normalizeSessionObserverModelOutput(result.content.filter((block) => block.type === "text").map((block) => block.text).join("").trim());
					if (parsed) return parsed;
				}
				throw new Error("session observer returned invalid JSON twice");
			};
			return await Promise.race([execute(), aborted]);
		} finally {
			params.clearTimeoutFn(timeout);
			if (state.activeController === controller) state.activeController = void 0;
		}
	};
}
//#endregion
//#region src/gateway/session-observer-model-slots.ts
function createSessionObserverModelSlots(params) {
	const demoted = /* @__PURE__ */ new WeakSet();
	const requestGenerations = /* @__PURE__ */ new WeakMap();
	return {
		beginRequest(state) {
			const generation = (requestGenerations.get(state) ?? 0) + 1;
			requestGenerations.set(state, generation);
			return generation;
		},
		invalidateRequest(state) {
			requestGenerations.set(state, (requestGenerations.get(state) ?? 0) + 1);
			state.activeController?.abort();
		},
		requestIsCurrent(state, generation) {
			return requestGenerations.get(state) === generation;
		},
		claim(agentId, current) {
			const resolved = params.resolve(agentId);
			if (!resolved || current?.utilityModelRef === resolved) return resolved;
			const occupied = [...params.states.values()].filter((state) => state !== current && state.utilityModelRef);
			if (current && demoted.has(current)) {
				if (occupied.length >= params.maxSessions) return;
				demoted.delete(current);
				return resolved;
			}
			if (occupied.length >= params.maxSessions) {
				const evicted = occupied.filter((state) => !state.terminalHealth && !state.finalPending).toSorted((left, right) => left.lastActivityAt - right.lastActivityAt || left.sessionKey.localeCompare(right.sessionKey))[0];
				if (!evicted) return;
				demoted.add(evicted);
				params.demote(evicted);
			}
			return resolved;
		}
	};
}
//#endregion
//#region src/gateway/session-observer-persistence.ts
const PERSIST_INTERVAL_MS = 6e4;
function createSessionObserverDigestPersister(params) {
	const preamblePersistedAt = /* @__PURE__ */ new WeakMap();
	return async (state, digest, final, kind = "model") => {
		const lastPersistedAt = kind === "preamble" ? preamblePersistedAt.get(state) : state.lastPersistedAt;
		const due = lastPersistedAt === void 0 || params.now() - lastPersistedAt >= PERSIST_INTERVAL_MS;
		if (!final && !due) return;
		const attempts = final ? 2 : 1;
		for (let attempt = 0; attempt < attempts; attempt += 1) try {
			const accepted = await params.persistDigest({
				sessionKey: state.sessionKey,
				sessionId: state.sessionId,
				agentId: state.agentId,
				digest,
				stillCurrent: params.stillCurrent(state.runId, state.sessionKey, state.agentId)
			});
			if (accepted === null) {
				params.onMissingEntry(state);
				return;
			}
			if (accepted) if (kind === "preamble") preamblePersistedAt.set(state, params.now());
			else state.lastPersistedAt = params.now();
			return;
		} catch (error) {
			if (attempt + 1 === attempts) params.onError(state, error);
		}
	};
}
//#endregion
//#region src/agents/session-preamble.ts
function normalizeSessionPreambleText(value, maxChars) {
	if (typeof value !== "string") return "";
	const sanitized = sanitizeProgressStatusText(value);
	if (!sanitized) return "";
	return truncateUtf16Safe(stripMarkdown(sanitized, { linkStyle: "label" }).replace(/\s+/gu, " ").trim(), maxChars);
}
//#endregion
//#region src/gateway/session-observer-preamble.ts
const PREAMBLE_HEADLINE_MAX_CHARS = 120;
const PREAMBLE_PUBLISH_INTERVAL_MS = 2e3;
function createSessionObserverPreamblePublisher(params) {
	const entries = /* @__PURE__ */ new Map();
	const generations = /* @__PURE__ */ new WeakMap();
	const clear = (state) => {
		const entry = entries.get(state);
		if (entry?.timer) params.clearTimeoutFn(entry.timer);
		entries.delete(state);
	};
	const publish = (state, entry) => {
		entry.timer = void 0;
		if (!params.isCurrent(state)) {
			clear(state);
			return;
		}
		const previous = state.previousDigest;
		if (previous?.runId === state.runId && previous.headline === entry.headline) {
			clear(state);
			return;
		}
		state.revision += 1;
		const digest = {
			sessionKey: state.sessionKey,
			agentId: state.agentId,
			runId: state.runId,
			revision: state.revision,
			updatedAt: Math.max(entry.updatedAt, (previous?.updatedAt ?? -1) + 1),
			headline: entry.headline,
			health: previous?.runId === state.runId && previous.health !== "done" && previous.health !== "failed" ? previous.health : "on-track",
			...state.planProgress ? { planProgress: state.planProgress } : {}
		};
		state.previousDigest = digest;
		state.lastPublishedPreambleHeadline = entry.headline;
		entry.lastPublishedAt = params.now();
		entry.published = true;
		params.publish(state, digest);
	};
	return {
		handle(state, event) {
			if (event.stream !== "item" || event.data.kind !== "preamble") return false;
			const headline = normalizeSessionPreambleText(event.data.progressText, PREAMBLE_HEADLINE_MAX_CHARS);
			if (!headline) return true;
			const existing = entries.get(state);
			const previousHeadline = state.lastPreambleHeadline ?? (state.previousDigest?.runId === state.runId ? state.previousDigest.headline : "");
			if (!existing && previousHeadline === headline) {
				state.lastPreambleHeadline = headline;
				state.lastPublishedPreambleHeadline = headline;
				return true;
			}
			const entry = existing ?? {
				headline: "",
				lastPublishedAt: 0,
				published: false,
				updatedAt: event.ts
			};
			if (previousHeadline !== headline) generations.set(state, (generations.get(state) ?? 0) + 1);
			state.lastPreambleHeadline = headline;
			entry.headline = headline;
			entry.updatedAt = event.ts;
			entries.set(state, entry);
			const elapsed = params.now() - entry.lastPublishedAt;
			if (!entry.published || elapsed >= PREAMBLE_PUBLISH_INTERVAL_MS) {
				if (entry.timer) params.clearTimeoutFn(entry.timer);
				publish(state, entry);
			} else if (!entry.timer) {
				entry.timer = params.setTimeoutFn(() => publish(state, entry), PREAMBLE_PUBLISH_INTERVAL_MS - elapsed);
				entry.timer.unref?.();
			}
			return true;
		},
		generation(state) {
			return generations.get(state) ?? 0;
		},
		flush(state) {
			const entry = entries.get(state);
			if (entry) {
				if (entry.timer) params.clearTimeoutFn(entry.timer);
				publish(state, entry);
			}
		},
		clear,
		dispose() {
			for (const state of entries.keys()) clear(state);
		}
	};
}
//#endregion
//#region src/gateway/session-observer.ts
const observerLog = createSubsystemLogger("gateway/session-observer");
const MIN_NOTES_PER_DIGEST = 4;
const MIN_DIGEST_INTERVAL_MS = 12e3;
const MAX_DIGESTS_PER_RUN = 40;
const MAX_LIVE_DIGESTS_PER_RUN = MAX_DIGESTS_PER_RUN - 1;
const MAX_CONSECUTIVE_FAILURES = 2;
const FINAL_DIGEST_MIN_RUN_MS = 3e4;
const MAX_CONCURRENT_MODEL_SESSIONS = 6;
function createSessionObserver(deps) {
	const now = deps.now ?? Date.now;
	const setTimeoutFn = deps.setTimeoutFn ?? setTimeout;
	const clearTimeoutFn = deps.clearTimeoutFn ?? clearTimeout;
	const resolveUtilityModelRef = deps.resolveUtilityModelRef ?? resolveUtilityModelRefForAgent;
	const prepareModel = deps.prepareModel ?? defaultPrepareModel;
	const completeModel = deps.completeModel ?? defaultCompleteModel;
	const readSession = deps.readSession ?? defaultReadSession;
	const persistDigest = deps.persistDigest ?? defaultPersistDigest;
	const states = /* @__PURE__ */ new Map();
	const dormantRuns = /* @__PURE__ */ new Map();
	const revisionFloors = /* @__PURE__ */ new Map();
	const supersededRuns = /* @__PURE__ */ new Map();
	const contextlessTerminalRuns = /* @__PURE__ */ new Map();
	const terminalRuns = /* @__PURE__ */ new Map();
	const disabledRuns = /* @__PURE__ */ new Set();
	const visibleConnections = /* @__PURE__ */ new Set();
	let disposed = false;
	const getCompanionSnapshot = createSessionObserverCompanionSnapshotReader({
		getConfig: deps.getConfig,
		readSession,
		states
	});
	const audience = createSessionObserverAudience({
		subscribers: deps.subscribers,
		sessionEventSubscribers: deps.sessionEventSubscribers,
		isVisible: (connId) => visibleConnections.has(connId),
		getConfig: deps.getConfig
	});
	const runStillCurrent = (runId, sessionKey, agentId) => () => !disposed && !supersededRuns.has(runId) && (states.get(resolveSessionSubscriptionKey(sessionKey, agentId))?.runId ?? runId) === runId;
	const persistAcceptedDigest = createSessionObserverDigestPersister({
		now,
		persistDigest,
		stillCurrent: runStillCurrent,
		onMissingEntry: (state) => {
			disableModelForRun(state);
		},
		onError: (state, error) => {
			observerLog.warn("session observer digest persistence failed", {
				sessionKey: state.sessionKey,
				runId: state.runId,
				error
			});
		}
	});
	const preamblePublisher = createSessionObserverPreamblePublisher({
		now,
		setTimeoutFn,
		clearTimeoutFn,
		isCurrent: stateIsCurrent,
		publish: (state, digest) => {
			deps.broadcastToConnIds("session.observer", digest, audience.recipients(state.sessionKey, state.agentId), audience.deliveryOptions(state.sessionKey, state.agentId));
			persistAcceptedDigest(state, digest, false, "preamble");
		}
	});
	async function synthesizeTerminalDigest(source) {
		const runId = source.event?.runId ?? source.state?.runId;
		if (!runId) return;
		const dormant = dormantRuns.get(runId);
		const sessionKey = source.event?.sessionKey ?? source.state?.sessionKey ?? dormant?.sessionKey;
		const agentId = source.event?.agentId ?? source.state?.agentId ?? dormant?.agentId;
		if (!sessionKey || !agentId) return;
		const stillCurrent = runStillCurrent(runId, sessionKey, agentId);
		if (!stillCurrent()) return;
		try {
			const digest = await synthesizeSessionObserverTerminalDigest({
				source,
				dormant,
				readSession,
				persistDigest,
				now,
				stillCurrent
			});
			if (digest && stillCurrent()) deps.broadcastToConnIds("session.observer", digest, audience.recipients(digest.sessionKey, agentId), audience.deliveryOptions(digest.sessionKey, agentId));
		} catch (error) {
			observerLog.warn("session observer terminal digest synthesis failed", {
				runId,
				error
			});
		}
	}
	const stateIsTracked = (state) => states.get(resolveSessionSubscriptionKey(state.sessionKey, state.agentId)) === state;
	const dropState = (state) => {
		preamblePublisher.clear(state);
		if (state.timer) clearTimeoutFn(state.timer);
		modelSlots.invalidateRequest(state);
		if (stateIsTracked(state)) states.delete(resolveSessionSubscriptionKey(state.sessionKey, state.agentId));
	};
	const suspendState = (state) => {
		if (state.terminalHealth) {
			synthesizeTerminalDigest({ state });
			dormantRuns.delete(state.runId);
			dropState(state);
			return;
		}
		rememberSessionObserverDormantRun(dormantRuns, revisionFloors, createDormantSessionObserverRun(state));
		dropState(state);
	};
	const demoteUtilityModel = (state) => {
		if (state.timer) {
			clearTimeoutFn(state.timer);
			state.timer = void 0;
		}
		modelSlots.invalidateRequest(state);
		state.preparedPromise = void 0;
		state.utilityModelRef = void 0;
		state.consecutiveFailures = 0;
	};
	const modelSlots = createSessionObserverModelSlots({
		states,
		maxSessions: MAX_CONCURRENT_MODEL_SESSIONS,
		resolve: (agentId) => resolveUtilityModelRef({
			cfg: deps.getConfig(),
			agentId
		}),
		demote: demoteUtilityModel
	});
	const disableModelForRun = (state) => {
		rememberSessionObserverDisabledRun(disabledRuns, state.runId);
		demoteUtilityModel(state);
	};
	const suspendStatesWithoutAudience = () => {
		for (const state of states.values()) if (!audience.has(state.sessionKey, state.agentId)) suspendState(state);
	};
	const unsubscribeChanges = deps.subscribers.onChange(() => suspendStatesWithoutAudience());
	function stateIsCurrent(state) {
		return !disposed && stateIsTracked(state) && audience.has(state.sessionKey, state.agentId) && deps.getConfig().gateway?.controlUi?.sessionObserver !== false;
	}
	function modelStateIsCurrent(state) {
		if (!stateIsCurrent(state) || !state.utilityModelRef) return false;
		return resolveUtilityModelRef({
			cfg: deps.getConfig(),
			agentId: state.agentId
		}) === state.utilityModelRef;
	}
	const requestModelDigest = createSessionObserverCompletion({
		getConfig: deps.getConfig,
		prepareModel,
		completeModel,
		now,
		setTimeoutFn,
		clearTimeoutFn,
		isCurrent: modelStateIsCurrent
	});
	const pendingNotes = (state) => state.notes.filter((note) => note.sequence > state.lastDigestNoteSequence);
	const schedule = (state, run) => {
		if (!stateIsCurrent(state)) {
			if (disposed) dropState(state);
			else suspendState(state);
			return;
		}
		if (!modelStateIsCurrent(state)) return;
		if (state.inFlight || state.timer || state.terminalHealth) return;
		if (state.digestCount >= MAX_LIVE_DIGESTS_PER_RUN) return;
		if (pendingNotes(state).length < MIN_NOTES_PER_DIGEST) return;
		const delay = Math.max(0, MIN_DIGEST_INTERVAL_MS - (now() - state.lastRunAt));
		if (delay === 0) {
			run(state, false);
			return;
		}
		state.timer = setTimeoutFn(() => {
			state.timer = void 0;
			run(state, false);
		}, delay);
	};
	const runDigest = (state, final) => {
		if (!stateIsCurrent(state)) {
			if (disposed) dropState(state);
			else suspendState(state);
			return;
		}
		if (!modelStateIsCurrent(state)) {
			if (final) {
				synthesizeTerminalDigest({ state });
				dormantRuns.delete(state.runId);
				dropState(state);
			}
			return;
		}
		if (state.inFlight) {
			state.finalPending ||= final;
			return;
		}
		const digestLimit = final ? MAX_DIGESTS_PER_RUN : MAX_LIVE_DIGESTS_PER_RUN;
		if (state.digestCount >= digestLimit) return;
		flushSessionActivityAssistantNote(state);
		const selectedNotes = pendingNotes(state);
		if (!final && selectedNotes.length < MIN_NOTES_PER_DIGEST) return;
		if (!final && now() - state.lastRunAt < MIN_DIGEST_INTERVAL_MS) {
			schedule(state, runDigest);
			return;
		}
		if (state.timer) {
			clearTimeoutFn(state.timer);
			state.timer = void 0;
		}
		state.inFlight = true;
		state.lastRunAt = now();
		const lastSelectedSequence = selectedNotes.at(-1)?.sequence ?? state.lastDigestNoteSequence;
		const retireSelectedNotes = () => {
			state.lastDigestNoteSequence = Math.max(state.lastDigestNoteSequence, lastSelectedSequence);
		};
		const requestGeneration = modelSlots.beginRequest(state);
		state.digestCount += 1;
		(async () => {
			try {
				const modelDigest = await requestModelDigest(state, selectedNotes.map((note) => note.text));
				if (!modelStateIsCurrent(state) || !modelSlots.requestIsCurrent(state, requestGeneration) || !final && state.terminalHealth !== void 0) {
					retireSelectedNotes();
					if (final && stateIsTracked(state)) {
						synthesizeTerminalDigest({ state });
						dormantRuns.delete(state.runId);
						dropState(state);
					}
					return;
				}
				if (state.sessionId && readSession(state.sessionKey, state.agentId)?.sessionId !== state.sessionId) return;
				preamblePublisher.clear(state);
				state.consecutiveFailures = 0;
				state.revision += 1;
				retireSelectedNotes();
				const digest = {
					sessionKey: state.sessionKey,
					agentId: state.agentId,
					runId: state.runId,
					revision: state.revision,
					updatedAt: now(),
					headline: modelDigest.headline,
					...modelDigest.assessment ? { assessment: modelDigest.assessment } : {},
					health: final ? state.terminalHealth ?? modelDigest.health : modelDigest.health,
					...state.planProgress ?? modelDigest.planProgress ? { planProgress: state.planProgress ?? modelDigest.planProgress } : {}
				};
				const previous = state.previousDigest?.health;
				const next = digest.health;
				const criticalTransition = (next === "stuck" || next === "waiting-on-user") && previous !== next;
				state.previousDigest = digest;
				const recipients = criticalTransition ? audience.criticalRecipients(state.sessionKey, state.agentId) : audience.recipients(state.sessionKey, state.agentId);
				deps.broadcastToConnIds("session.observer", digest, recipients, audience.deliveryOptions(state.sessionKey, state.agentId));
				await persistAcceptedDigest(state, digest, final);
				if (final) dormantRuns.delete(state.runId);
			} catch (error) {
				if (!modelStateIsCurrent(state) || !modelSlots.requestIsCurrent(state, requestGeneration) || !final && state.terminalHealth !== void 0) {
					retireSelectedNotes();
					if (final && stateIsTracked(state)) {
						synthesizeTerminalDigest({ state });
						dormantRuns.delete(state.runId);
						dropState(state);
					}
					return;
				}
				state.consecutiveFailures += 1;
				if (state.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
					observerLog.warn("session observer disabled after consecutive failures", {
						sessionKey: state.sessionKey,
						runId: state.runId,
						error
					});
					if (final || state.finalPending || state.terminalHealth) {
						synthesizeTerminalDigest({ state });
						dormantRuns.delete(state.runId);
						dropState(state);
					} else disableModelForRun(state);
				} else if (final) state.finalPending = true;
			} finally {
				if (stateIsTracked(state)) {
					state.inFlight = false;
					const runFinal = state.finalPending;
					state.finalPending = false;
					if (runFinal) runDigest(state, true);
					else if (final) dropState(state);
					else schedule(state, runDigest);
				}
			}
		})();
	};
	const admitState = (event, allowPreambleOnly, sessionKey, agentId) => {
		if (!agentId || !audience.has(sessionKey, agentId)) return;
		const scopeKey = resolveSessionSubscriptionKey(sessionKey, agentId);
		if (deps.getConfig().gateway?.controlUi?.sessionObserver === false) return;
		const utilityModelRef = disabledRuns.has(event.runId) ? void 0 : modelSlots.claim(agentId);
		if (!utilityModelRef && !allowPreambleOnly) return;
		const dormant = dormantRuns.get(event.runId);
		if (dormant) {
			dormantRuns.delete(event.runId);
			const { utilityModelRef: _dormantModelRef, ...dormantState } = dormant;
			const state = {
				...createSessionActivityNoteState(),
				...dormantState,
				...dormantState.lastPreambleHeadline ? { lastPublishedPreambleHeadline: dormantState.lastPreambleHeadline } : {},
				...utilityModelRef ? { utilityModelRef } : {},
				lastActivityAt: event.ts,
				lastRunAt: now(),
				lastDigestNoteSequence: 0,
				inFlight: false,
				finalPending: false
			};
			states.set(scopeKey, state);
			return state;
		}
		const session = readSession(sessionKey, agentId);
		const startedAt = asFiniteNumber(event.data.startedAt) ?? session?.startedAt ?? event.ts ?? now();
		const state = {
			...createSessionActivityNoteState(),
			sessionKey,
			sessionId: event.sessionId ?? session?.sessionId,
			runId: event.runId,
			agentId,
			...utilityModelRef ? { utilityModelRef } : {},
			startedAt,
			lastActivityAt: event.ts,
			lastRunAt: startedAt,
			lastPersistedAt: session?.observerDigest?.updatedAt,
			revision: session?.observerDigest?.revision ?? 0,
			digestCount: 0,
			consecutiveFailures: 0,
			lastDigestNoteSequence: 0,
			previousDigest: session?.observerDigest,
			inFlight: false,
			finalPending: false
		};
		states.set(scopeKey, state);
		return state;
	};
	const handleEvent = (event) => {
		if (disposed || getAgentRunContext(event.runId)?.isHeartbeat) return;
		const terminal = isTerminalLifecycleEvent(event);
		if (terminalRuns.has(event.runId)) return;
		if (supersededRuns.has(event.runId)) {
			if (terminal) {
				markSessionObserverRunSuperseded(terminalRuns, event.runId, event.ts);
				contextlessTerminalRuns.delete(event.runId);
				supersededRuns.delete(event.runId);
				dormantRuns.delete(event.runId);
				disabledRuns.delete(event.runId);
			}
			return;
		}
		if (contextlessTerminalRuns.has(event.runId) && !terminal) return;
		const eventSessionKey = event.sessionKey?.trim();
		const eventAgentId = event.agentId?.trim();
		let knownRun;
		if (terminal && (!eventSessionKey || !eventAgentId)) {
			for (const candidate of states.values()) if (candidate.runId === event.runId) {
				knownRun = candidate;
				break;
			}
			knownRun ??= dormantRuns.get(event.runId);
		}
		const sessionKey = eventSessionKey || knownRun?.sessionKey;
		if (!sessionKey) {
			if (terminal) markSessionObserverRunSuperseded(contextlessTerminalRuns, event.runId, event.ts);
			return;
		}
		const agentId = eventAgentId || knownRun?.agentId;
		if (terminal) {
			contextlessTerminalRuns.delete(event.runId);
			markSessionObserverRunSuperseded(terminalRuns, event.runId, event.ts);
		}
		const isPreamble = event.stream === "item" && event.data.kind === "preamble";
		if (!agentId) {
			if (terminal) {
				synthesizeTerminalDigest({ event });
				dormantRuns.delete(event.runId);
				disabledRuns.delete(event.runId);
			}
			return;
		}
		const scopeKey = resolveSessionSubscriptionKey(sessionKey, agentId);
		if (terminal && audience.recipients(sessionKey, agentId).size === 0) {
			synthesizeTerminalDigest({
				event,
				state: states.get(scopeKey)
			});
			dormantRuns.delete(event.runId);
			disabledRuns.delete(event.runId);
			return;
		}
		const isRunStart = event.stream === "lifecycle" && event.data.phase === "start";
		let revisionFloor = revisionFloors.get(scopeKey);
		let state = states.get(scopeKey);
		if (state && state.runId !== event.runId) {
			const candidate = {
				revision: state.revision,
				previousDigest: state.previousDigest
			};
			if (!revisionFloor || candidate.revision > revisionFloor.revision) revisionFloor = candidate;
			const supersededRunId = state.runId;
			if (isRunStart) markSessionObserverRunSuperseded(supersededRuns, supersededRunId, event.ts);
			suspendState(state);
			if (isRunStart) dormantRuns.delete(supersededRunId);
			state = void 0;
		}
		if (!state) {
			const superseded = [...dormantRuns.values()].filter((run) => resolveSessionSubscriptionKey(run.sessionKey, run.agentId) === scopeKey && run.runId !== event.runId).toSorted((left, right) => right.revision - left.revision || left.runId.localeCompare(right.runId));
			const latest = superseded[0];
			if (latest && (!revisionFloor || latest.revision > revisionFloor.revision)) revisionFloor = {
				revision: latest.revision,
				previousDigest: latest.previousDigest
			};
			if (isRunStart) {
				if (revisionFloor) rememberSessionObserverRevisionFloor(revisionFloors, scopeKey, revisionFloor);
				for (const run of superseded) {
					markSessionObserverRunSuperseded(supersededRuns, run.runId, event.ts);
					dormantRuns.delete(run.runId);
				}
			}
		}
		if (state && (!audience.has(sessionKey, agentId) || deps.getConfig().gateway?.controlUi?.sessionObserver === false)) {
			suspendState(state);
			state = void 0;
		}
		if (!state) state = admitState(event, isPreamble, sessionKey, agentId);
		if (!state) {
			if (terminal) {
				synthesizeTerminalDigest({ event });
				dormantRuns.delete(event.runId);
				disabledRuns.delete(event.runId);
			}
			return;
		}
		if (state.terminalHealth) return;
		if (revisionFloor && revisionFloor.revision > state.revision) {
			state.revision = revisionFloor.revision;
			state.previousDigest = revisionFloor.previousDigest;
		}
		revisionFloors.delete(scopeKey);
		const utilityModelRef = disabledRuns.has(state.runId) ? void 0 : modelSlots.claim(state.agentId, state);
		if (state.utilityModelRef !== utilityModelRef) {
			modelSlots.invalidateRequest(state);
			state.preparedPromise = void 0;
			state.utilityModelRef = utilityModelRef;
			state.consecutiveFailures = 0;
		}
		state.lastActivityAt = event.ts;
		const eventStartedAt = asFiniteNumber(event.data.startedAt);
		if (eventStartedAt !== void 0) state.startedAt = Math.min(state.startedAt, eventStartedAt);
		noteSessionActivityEvent(state, event);
		preamblePublisher.handle(state, event);
		if (terminal) {
			if (!state.terminalHealth) modelSlots.invalidateRequest(state);
			preamblePublisher.flush(state);
			preamblePublisher.clear(state);
			state.terminalHealth = terminalHealthFor(event);
			disabledRuns.delete(event.runId);
			const endedAt = asFiniteNumber(event.data.endedAt) ?? now();
			if (!(state.previousDigest?.runId === state.runId) && endedAt - state.startedAt < FINAL_DIGEST_MIN_RUN_MS) {
				dormantRuns.delete(state.runId);
				dropState(state);
				return;
			}
			runDigest(state, true);
			return;
		}
		schedule(state, runDigest);
	};
	return {
		handleEvent,
		setConnectionVisibility(connId, visible) {
			if (visible) {
				visibleConnections.add(connId);
				return;
			}
			visibleConnections.delete(connId);
			suspendStatesWithoutAudience();
		},
		removeConnection(connId) {
			if (visibleConnections.delete(connId)) suspendStatesWithoutAudience();
		},
		getCompanionSnapshot,
		dispose() {
			disposed = true;
			preamblePublisher.dispose();
			unsubscribeChanges();
			for (const state of states.values()) dropState(state);
			dormantRuns.clear();
			revisionFloors.clear();
			supersededRuns.clear();
			terminalRuns.clear();
			disabledRuns.clear();
			visibleConnections.clear();
		}
	};
}
//#endregion
//#region src/gateway/server-runtime-subscriptions.ts
function dispatchEventHandler(params) {
	params.loadHandler().then((handler) => handler(params.event)).catch((error) => {
		params.log.warn(params.failureMessage, {
			...params.context,
			error
		});
	});
}
function terminalTaskId(event) {
	if (event.kind !== "upserted" || !isTerminalTaskStatus(event.task.status)) return;
	if (event.previous && isTerminalTaskStatus(event.previous.status)) return;
	return event.task.taskId;
}
/** Register gateway runtime event subscriptions and return unsubscribe handles. */
function startGatewayEventSubscriptions(params) {
	const runtimeConfig = getRuntimeConfig();
	const auditEnabled = isAuditLedgerEnabled(runtimeConfig);
	const auditMessageMode = resolveAuditMessageMode(runtimeConfig);
	const auditRecorder = createAuditEventRecorder({ messageMode: auditEnabled ? auditMessageMode : "off" });
	const clearExecutionIdentityAdmissionSink = configureExecutionIdentityAdmissionSink(auditRecorder.recordExecutionIdentity);
	const clearChannelAdmissionEvidenceCollection = configureChannelAdmissionEvidenceCollection(isExecutionIdentityCollectionEnabled(runtimeConfig));
	const clearChannelAdmissionDecisionSink = configureChannelAdmissionDecisionSink(auditRecorder.recordExecutionDecision);
	const sessionObserver = createSessionObserver({
		getConfig: getRuntimeConfig,
		subscribers: params.sessionMessageSubscribers,
		sessionEventSubscribers: params.sessionEventSubscribers,
		broadcastToConnIds: params.broadcastToConnIds
	});
	const sessionCompanion = createSessionCompanion({
		contextReader: defaultSessionCompanionContextReader,
		getConfig: getRuntimeConfig,
		sessionObserver
	});
	const unsubscribePrivateAuditEvents = auditEnabled ? onAgentAuditEvent(auditRecorder.record) : void 0;
	const unsubscribeToolAuditEvents = auditEnabled ? onTrustedToolExecutionEvent(auditRecorder.recordTool) : void 0;
	const unsubscribeMessageAuditEvents = auditEnabled && auditMessageMode !== "off" ? onTrustedMessageAuditEvent(auditRecorder.recordMessage) : void 0;
	const agentEventHandlerLoader = createLazyPromiseLoader(() => {
		return Promise.all([import("./server-chat-C67ySVGy.js"), import("./server-session-key-D2SasoO-.js")]).then(([{ createAgentEventHandler }, { resolveSessionKeyForRun }]) => createAgentEventHandler({
			broadcast: params.broadcast,
			broadcastToConnIds: params.broadcastToConnIds,
			nodeSendToSession: params.nodeSendToSession,
			agentRunSeq: params.agentRunSeq,
			chatRunState: params.chatRunState,
			resolveSessionKeyForRun,
			clearAgentRunContext,
			toolEventRecipients: params.toolEventRecipients,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			updateRunToolErrorSummary: ({ runId, clientRunId, summary }) => {
				for (const candidateRunId of /* @__PURE__ */ new Set([runId, clientRunId])) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) entry.toolErrorSummary = summary;
				}
			},
			clearTrackedActiveRun: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionActive = false;
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = false;
						markChatAbortTerminalPersistenceError(entry, void 0);
						queueMicrotask(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry && entry.registrationCleanupRequested === true && !entry.projectSessionTerminalPersistence) removeChatAbortControllerEntry(params.chatAbortControllers, candidateRunId, entry);
						});
					}
				}
			},
			markTrackedRunTerminalPersisted: ({ runId, clientRunId }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					params.restartRecoveryCandidates.delete(candidateRunId);
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersisted = true;
						entry.projectSessionTerminalPersistence = void 0;
						markChatAbortTerminalPersistenceError(entry, void 0);
					}
				}
			},
			trackTrackedRunTerminalPersistence: ({ runId, clientRunId, sessionId: terminalSessionId, observedAt, persistence }) => {
				const candidateRunIds = runId === clientRunId ? [runId] : [runId, clientRunId];
				for (const candidateRunId of candidateRunIds) {
					const entry = params.chatAbortControllers.get(candidateRunId);
					if (entry) {
						entry.projectSessionTerminalPending = false;
						entry.projectSessionTerminalPersistence = persistence;
						persistence.catch((error) => {
							markChatAbortTerminalPersistenceError(entry, error);
						});
						if (entry.registrationCleanupRequested === true) persistence.catch(() => void 0).then(() => {
							if (params.chatAbortControllers.get(candidateRunId) === entry) removeChatAbortControllerEntry(params.chatAbortControllers, candidateRunId, entry);
						});
						const lifecycleGeneration = entry.lifecycleGeneration?.trim();
						const sessionKey = entry.sessionKey.trim();
						const sessionId = terminalSessionId?.trim() || entry.sessionId.trim();
						if (entry.controlUiVisible !== false && lifecycleGeneration && sessionKey && sessionId) persistence.catch(() => {
							params.restartRecoveryCandidates.set(candidateRunId, {
								runId: candidateRunId,
								lifecycleGeneration,
								sessionKey,
								sessionId,
								observedAt
							});
						});
					}
				}
			},
			isChatSendRunActive: (runId) => {
				const entry = params.chatAbortControllers.get(runId);
				return entry !== void 0 && entry.kind !== "agent";
			},
			resolveActiveLifecycleGenerationForRun: (runId) => params.chatAbortControllers.get(runId)?.lifecycleGeneration,
			resolveSessionActiveRunState: (session) => resolveVisibleActiveSessionRunState({
				context: params,
				...session,
				defaultAgentId: tryResolveSessionCompatibilityOwnerAgentId(getRuntimeConfig(), session.requestedKey)
			})
		}));
	}, { cacheRejections: true });
	const getAgentEventHandler = agentEventHandlerLoader.load;
	const getSessionEventsModule = createLazyPromise(() => import("./server-session-events-CdnKoWns.js"), { cacheRejections: true });
	let transcriptUpdateHandlerPromise = null;
	const getTranscriptUpdateHandler = () => {
		transcriptUpdateHandlerPromise ??= getSessionEventsModule().then(({ createTranscriptUpdateBroadcastHandler }) => createTranscriptUpdateBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers,
			sessionMessageSubscribers: params.sessionMessageSubscribers,
			chatAbortControllers: params.chatAbortControllers
		}));
		return transcriptUpdateHandlerPromise;
	};
	let lifecycleEventHandlerPromise = null;
	const getLifecycleEventHandler = () => {
		lifecycleEventHandlerPromise ??= getSessionEventsModule().then(({ createLifecycleEventBroadcastHandler }) => createLifecycleEventBroadcastHandler({
			broadcastToConnIds: params.broadcastToConnIds,
			sessionEventSubscribers: params.sessionEventSubscribers,
			chatAbortControllers: params.chatAbortControllers
		}));
		return lifecycleEventHandlerPromise;
	};
	const unsubscribeAgentEvents = onAgentRuntimeEvent((evt) => {
		sessionObserver.handleEvent(evt);
		if (auditEnabled) auditRecorder.record(evt);
		const lifecyclePhase = evt.stream === "lifecycle" && typeof evt.data?.phase === "string" ? evt.data.phase : void 0;
		if (lifecyclePhase === "end" || lifecyclePhase === "error") {
			const clientRunId = (evt.contextClaimId ? void 0 : params.chatRunState.registry.peek(evt.runId))?.clientRunId ?? evt.runId;
			const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
			for (const candidateRunId of candidateRunIds) {
				const entry = params.chatAbortControllers.get(candidateRunId);
				const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
				if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
					entry.projectSessionTerminalPending = true;
					entry.projectSessionTerminalObservedAt = typeof evt.data.endedAt === "number" && Number.isFinite(evt.data.endedAt) ? evt.data.endedAt : evt.ts;
				}
			}
		} else if (lifecyclePhase === "start") {
			const clientRunId = (evt.contextClaimId ? void 0 : params.chatRunState.registry.peek(evt.runId))?.clientRunId ?? evt.runId;
			const candidateRunIds = evt.runId === clientRunId ? [evt.runId] : [evt.runId, clientRunId];
			const eventLifecycleGeneration = evt.lifecycleGeneration?.trim();
			for (const candidateRunId of candidateRunIds) {
				const entry = params.chatAbortControllers.get(candidateRunId);
				if (entry && (!eventLifecycleGeneration || !entry.lifecycleGeneration || entry.lifecycleGeneration === eventLifecycleGeneration)) {
					entry.projectSessionTerminalPending = false;
					entry.projectSessionTerminalObservedAt = void 0;
				}
			}
		}
		dispatchEventHandler({
			loadHandler: getAgentEventHandler,
			event: evt,
			log: params.log,
			failureMessage: "Agent event dispatch failed",
			context: {
				runId: evt.runId,
				stream: evt.stream
			}
		});
	});
	const agentUnsub = async () => {
		unsubscribeAgentEvents();
		sessionCompanion.dispose();
		sessionObserver.dispose();
		unsubscribePrivateAuditEvents?.();
		unsubscribeToolAuditEvents?.();
		unsubscribeMessageAuditEvents?.();
		clearExecutionIdentityAdmissionSink();
		clearChannelAdmissionEvidenceCollection();
		clearChannelAdmissionDecisionSink();
		await agentEventHandlerLoader.peek()?.then((handler) => handler.dispose()).catch(() => void 0);
		await auditRecorder.stop();
	};
	const heartbeatUnsub = onHeartbeatEvent((evt) => {
		params.broadcast("heartbeat", evt, { dropIfSlow: true });
	});
	const transcriptUnsub = onInternalSessionTranscriptUpdate((evt) => {
		dispatchEventHandler({
			loadHandler: getTranscriptUpdateHandler,
			event: evt,
			log: params.log,
			failureMessage: "Transcript update dispatch failed",
			context: { sessionKey: evt.sessionKey }
		});
	});
	const lifecycleUnsub = onSessionLifecycleEvent((evt) => {
		dispatchEventHandler({
			loadHandler: getLifecycleEventHandler,
			event: evt,
			log: params.log,
			failureMessage: "Lifecycle event dispatch failed",
			context: { sessionKey: evt.sessionKey }
		});
	});
	let taskObserverDisposed = false;
	const lastTaskSummaryById = /* @__PURE__ */ new Map();
	const taskObservers = { onEvent: (event) => {
		let payload;
		switch (event.kind) {
			case "upserted": {
				const task = mapTaskSummary(event.task);
				const summary = JSON.stringify(task);
				if (lastTaskSummaryById.get(task.id) === summary) return;
				lastTaskSummaryById.set(task.id, summary);
				payload = {
					action: "upserted",
					task
				};
				break;
			}
			case "deleted":
				lastTaskSummaryById.delete(event.taskId);
				payload = {
					action: "deleted",
					taskId: event.taskId
				};
				break;
			case "restored":
				lastTaskSummaryById.clear();
				payload = { action: "restored" };
				break;
		}
		params.broadcast("task", payload, { dropIfSlow: true });
		const taskId = terminalTaskId(event);
		if (taskId) params.terminalSessions.closeAgentSessions(taskId);
	} };
	const taskObserverRuntimePromise = import("./task-registry.store-CEb0pxfg.js").then((module) => {
		if (!taskObserverDisposed) module.configureTaskRegistryRuntime({ observers: taskObservers });
		return module;
	});
	taskObserverRuntimePromise.catch((error) => {
		params.log.warn("Task registry observer registration failed", { error });
	});
	const taskUnsub = () => {
		taskObserverDisposed = true;
		return taskObserverRuntimePromise.then((module) => {
			if (module.getTaskRegistryObservers() === taskObservers) module.configureTaskRegistryRuntime({ observers: null });
		}).catch(() => void 0);
	};
	return {
		sessionCompanion,
		sessionObserver,
		agentUnsub,
		heartbeatUnsub,
		transcriptUnsub,
		lifecycleUnsub,
		taskUnsub
	};
}
//#endregion
export { startGatewayEventSubscriptions };
