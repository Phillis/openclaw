import { t as coerceErrorMessage } from "./error-coercion-CKFmnpjH.js";
import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.js";
import { t as resolveTranscriptsConfig } from "./config-UoehNruw.js";
import { t as sanitizeTranscriptSourceLocator } from "./source-locator-BSjIr0Fk.js";
import { r as summarizeTranscripts, t as TranscriptsStore } from "./store-D9_zQ2BB.js";
import { n as MeetingTranscriptDeliveryError } from "./session-transcript-store-D1UrWVu5.js";
import path from "node:path";
//#region src/meeting-bot/transcripts-bridge.runtime.ts
const CAPTURE_INTERVAL_MS = 5e3;
function descriptorForSession(session, options) {
	return {
		sessionId: session.id,
		title: `${options.providerName} meeting`,
		source: sanitizeTranscriptSourceLocator({
			providerId: options.providerId,
			kind: "live-caption",
			meetingUrl: session.url
		}),
		startedAt: session.createdAt,
		metadata: {
			agentId: session.agentId,
			meetingSessionId: session.id,
			mode: session.mode,
			participantIdentity: session.participantIdentity
		}
	};
}
function utteranceFromLine(params) {
	return {
		id: `${params.session.id}:${params.sequence}`,
		sessionId: params.session.id,
		startedAt: params.line.at,
		speaker: params.line.speaker ? { label: params.line.speaker } : void 0,
		text: params.line.text,
		final: true,
		metadata: {
			agentId: params.session.agentId,
			meetingSessionId: params.session.id
		}
	};
}
function createMeetingDurableTranscriptBridge(params) {
	const config = resolveTranscriptsConfig(params.options.config);
	const stateDir = params.options.stateDir ?? resolveStateDir();
	const store = new TranscriptsStore(path.join(stateDir, "transcripts"), { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} });
	const captures = /* @__PURE__ */ new Map();
	const pendingSubscribers = /* @__PURE__ */ new Map();
	const subscribers = /* @__PURE__ */ new Map();
	const lifecycleTasks = new KeyedAsyncQueue();
	const tasks = new KeyedAsyncQueue();
	const reportCaptureError = (sessionId, error) => {
		params.logger.debug?.(`[meeting-transcripts] capture ignored session=${sessionId}: ${coerceErrorMessage(error)}`);
	};
	const notifySubscriberStatus = (subscriber, status) => {
		if (!subscriber.onStatus) return;
		try {
			Promise.resolve(subscriber.onStatus(status)).catch((error) => {
				params.logger.warn(`[meeting-transcripts] subscriber status failed session=${status.sessionId ?? "unknown"}: ${coerceErrorMessage(error)}`);
			});
		} catch (error) {
			params.logger.warn(`[meeting-transcripts] subscriber status failed session=${status.sessionId ?? "unknown"}: ${coerceErrorMessage(error)}`);
		}
	};
	return {
		enabled: config.enabled,
		async start(session, capture) {
			await lifecycleTasks.enqueue(session.id, async () => {
				if (!config.enabled || captures.has(session.id)) return;
				const descriptor = descriptorForSession(session, params.options);
				let captureQueue = Promise.resolve();
				const runCapture = async (task) => {
					const result = captureQueue.catch(() => {}).then(task);
					captureQueue = result.then(() => void 0, () => void 0);
					return await result;
				};
				const active = {
					closing: false,
					descriptor,
					initialized: false,
					initializationWarned: false,
					polling: false,
					runCapture,
					session,
					utteranceCount: 0
				};
				captures.set(session.id, active);
				const initialize = async () => {
					if (active.initialized) return;
					try {
						await store.writeSession(descriptor);
						active.initialized = true;
						active.initializationWarned = false;
					} catch (error) {
						if (!active.initializationWarned) {
							params.logger.warn(`[meeting-transcripts] durable capture initialization pending session=${session.id}: ${coerceErrorMessage(error)}`);
							active.initializationWarned = true;
						}
					}
				};
				const timer = setInterval(() => {
					if (active.polling || active.closing) return;
					active.polling = true;
					initialize().then(async () => await active.runCapture(capture)).catch((error) => reportCaptureError(session.id, error)).finally(() => {
						active.polling = false;
					});
				}, CAPTURE_INTERVAL_MS);
				timer.unref?.();
				active.timer = timer;
				active.polling = true;
				try {
					await initialize();
					await active.runCapture(capture).catch((error) => reportCaptureError(session.id, error));
				} finally {
					active.polling = false;
				}
			});
		},
		async ingest(session, lines) {
			const active = captures.get(session.id);
			if (!active || lines.length === 0) return;
			await tasks.enqueue(session.id, async () => {
				for (const line of lines) {
					const sequence = active.utteranceCount;
					const utterance = utteranceFromLine({
						line,
						session,
						sequence
					});
					await store.appendUtteranceForSession(active.descriptor, utterance);
					for (const [subscriberSessionId, subscriber] of subscribers) {
						if (subscriber.meetingSessionId !== session.id || utterance.id && subscriber.deliveredUtteranceIds.has(utterance.id)) continue;
						const subscriberUtterance = {
							...utterance,
							id: `${subscriberSessionId}:${utterance.id ?? sequence}`,
							sessionId: subscriberSessionId
						};
						try {
							await subscriber.onUtterance(subscriberUtterance);
							if (utterance.id) subscriber.deliveredUtteranceIds.add(utterance.id);
						} catch (error) {
							subscribers.delete(subscriberSessionId);
							params.logger.warn(`[meeting-transcripts] detached failing subscriber session=${subscriberSessionId}: ${coerceErrorMessage(error)}`);
							notifySubscriberStatus(subscriber, {
								sessionId: subscriberSessionId,
								active: false,
								message: "Detached after transcript delivery failed.",
								source: active.descriptor.source
							});
						}
					}
					active.utteranceCount += 1;
				}
			});
		},
		async stop(session, finalCapture) {
			const active = await lifecycleTasks.enqueue(session.id, async () => {
				const current = captures.get(session.id);
				if (!current) return;
				current.closing = true;
				if (current.timer) {
					clearInterval(current.timer);
					delete current.timer;
				}
				return current;
			});
			if (!active) return false;
			let initializationError;
			if (!active.initialized) try {
				await store.writeSession(active.descriptor);
				active.initialized = true;
			} catch (error) {
				initializationError = error instanceof Error ? error : new Error("could not initialize durable transcript session", { cause: error });
			}
			let deliveryError;
			for (let attempt = 0; attempt < 3; attempt += 1) try {
				await active.runCapture(finalCapture);
				deliveryError = void 0;
				break;
			} catch (error) {
				if (!(error instanceof MeetingTranscriptDeliveryError)) {
					reportCaptureError(session.id, error);
					active.finalCaptureError = coerceErrorMessage(error);
					active.finalCaptureFailedAt ??= (/* @__PURE__ */ new Date()).toISOString();
					deliveryError = void 0;
					break;
				}
				if (error.finalCaptureError !== void 0) {
					active.finalCaptureError = error.finalCaptureError;
					active.finalCaptureFailedAt ??= (/* @__PURE__ */ new Date()).toISOString();
				}
				deliveryError = error;
			}
			if (deliveryError) throw deliveryError;
			if (initializationError !== void 0) throw initializationError;
			const finalCaptureError = active.finalCaptureError;
			const stoppedAt = (/* @__PURE__ */ new Date()).toISOString();
			const stopped = {
				...active.descriptor,
				stoppedAt,
				...finalCaptureError !== void 0 ? { metadata: {
					...active.descriptor.metadata,
					finalCaptureError,
					finalCaptureFailedAt: active.finalCaptureFailedAt
				} } : {}
			};
			try {
				await tasks.enqueue(session.id, async () => {
					await store.writeSession(stopped);
					const utterances = await store.readUtterancesForSession(stopped, { maxUtterances: config.maxUtterances });
					await store.writeSummary(summarizeTranscripts({
						session: stopped,
						utterances
					}), stopped);
					for (const [subscriberSessionId, subscriber] of subscribers) {
						if (subscriber.meetingSessionId !== session.id) continue;
						notifySubscriberStatus(subscriber, {
							sessionId: subscriberSessionId,
							active: false,
							message: `${params.options.providerName} meeting capture ended.`,
							source: stopped.source
						});
						subscribers.delete(subscriberSessionId);
					}
				});
			} catch (error) {
				params.logger.warn(`[meeting-transcripts] could not finalize durable capture session=${session.id}: ${coerceErrorMessage(error)}`);
				throw error;
			}
			captures.delete(session.id);
			return true;
		},
		async attach(session, request) {
			const active = captures.get(session.id);
			if (!config.enabled || !active || active.closing) return {
				ok: false,
				error: `${params.options.providerName} meeting capture is not active.`
			};
			if (subscribers.has(request.session.sessionId) || pendingSubscribers.has(request.session.sessionId)) return {
				ok: false,
				error: `transcripts session already attached: ${request.session.sessionId}`
			};
			let attached = false;
			pendingSubscribers.set(request.session.sessionId, {
				agentId: session.agentId,
				meetingSessionId: session.id
			});
			try {
				await tasks.enqueue(session.id, async () => {
					if (captures.get(session.id) !== active || active.closing) return;
					const utterances = await store.readUtterancesForSession(active.descriptor);
					const deliveredUtteranceIds = /* @__PURE__ */ new Set();
					for (const utterance of utterances) {
						await request.onUtterance({
							...utterance,
							id: `${request.session.sessionId}:${utterance.id ?? "replay"}`,
							sessionId: request.session.sessionId
						});
						if (utterance.id) deliveredUtteranceIds.add(utterance.id);
					}
					subscribers.set(request.session.sessionId, {
						agentId: session.agentId,
						deliveredUtteranceIds,
						meetingSessionId: session.id,
						onStatus: request.onStatus,
						onUtterance: request.onUtterance
					});
					try {
						await request.onStatus?.({
							sessionId: request.session.sessionId,
							active: true,
							message: `Attached to active ${params.options.providerName} meeting capture.`,
							source: active.descriptor.source
						});
						attached = true;
					} catch (error) {
						subscribers.delete(request.session.sessionId);
						throw error;
					}
				});
			} finally {
				pendingSubscribers.delete(request.session.sessionId);
			}
			return attached ? {
				ok: true,
				session: request.session
			} : {
				ok: false,
				error: `${params.options.providerName} meeting capture is ending.`
			};
		},
		async detach(request) {
			const subscriber = subscribers.get(request.sessionId);
			const pending = pendingSubscribers.get(request.sessionId);
			const owner = subscriber ?? pending;
			if (!owner) return {
				ok: true,
				sessionId: request.sessionId,
				stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			if (request.source.agentId !== owner.agentId) return {
				ok: false,
				error: "transcripts session belongs to another agent"
			};
			return await tasks.enqueue(owner.meetingSessionId, async () => {
				const current = subscribers.get(request.sessionId);
				if (!current) return {
					ok: true,
					sessionId: request.sessionId,
					stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				if (request.source.agentId !== current.agentId) return {
					ok: false,
					error: "transcripts session belongs to another agent"
				};
				notifySubscriberStatus(current, {
					sessionId: request.sessionId,
					active: false,
					message: `Detached from ${params.options.providerName} meeting capture.`,
					source: request.source
				});
				subscribers.delete(request.sessionId);
				return {
					ok: true,
					sessionId: request.sessionId,
					stoppedAt: (/* @__PURE__ */ new Date()).toISOString()
				};
			});
		}
	};
}
//#endregion
export { createMeetingDurableTranscriptBridge };
