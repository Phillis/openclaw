import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { c as asFiniteNumberInRange, d as asPositiveSafeInteger } from "./number-coercion-CLj0HTDM.js";
import { g as publishTranscriptUpdate } from "./session-accessor.sqlite-lifecycle-state-DAt_gV_K.js";
import { D as rewriteTranscriptMessageAtAnchor, b as persistSessionTranscriptTurn, pt as readActiveTranscriptEntryAnchor } from "./session-accessor-B-FKZX9M.js";
import { u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { f as readPersistedMediaFacts } from "./media-facts-Bd6apMSF.js";
import { a as waitForSessionTranscriptProjection } from "./session-transcript-reconcile-L6FHgw7r.js";
import { i as applyInputProvenanceToUserMessage, u as normalizeInputProvenance } from "./input-provenance-CCQsDhUy.js";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/sessions/user-turn-transcript-admission.ts
function resolveUserTurnTranscriptAdmission(params) {
	return "logicalTurnId" in params.receipt ? params.receipt : {
		...params.receipt,
		logicalTurnId: params.logicalTurnId,
		role: "user"
	};
}
//#endregion
//#region src/sessions/user-turn-transcript.media-normalize.ts
const URL_LIKE_MEDIA_PATH_PATTERN = /^[a-z][a-z0-9+.-]*:/i;
const STRUCTURED_MEDIA_KINDS = /* @__PURE__ */ new Set([
	"image",
	"audio",
	"video",
	"document",
	"sticker",
	"unknown"
]);
const MIME_TYPE_PATTERN = /^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/iu;
function normalizeStructuredMediaKind(value) {
	const kind = normalizeOptionalString(value);
	return kind && STRUCTURED_MEDIA_KINDS.has(kind) ? kind : void 0;
}
function resolveTranscriptMediaPath(pathValue, workspaceDir) {
	if (!workspaceDir || path.isAbsolute(pathValue) || URL_LIKE_MEDIA_PATH_PATTERN.test(pathValue)) return pathValue;
	return path.join(workspaceDir, pathValue);
}
function normalizeStructuredMediaEntryForTranscript(media) {
	const workspaceDir = normalizeOptionalString(media.workspaceDir);
	const mediaPath = normalizeOptionalString(media.path);
	const mediaUrl = normalizeOptionalString(media.url);
	const kind = normalizeStructuredMediaKind(media.kind);
	const legacyKind = normalizeOptionalString(media.kind);
	const messageId = normalizeOptionalString(media.messageId);
	const contentType = normalizeOptionalString(media.contentType) ?? (kind || !legacyKind || !MIME_TYPE_PATTERN.test(legacyKind) ? void 0 : legacyKind) ?? mimeTypeFromFilePath(mediaPath ?? mediaUrl);
	const durationMs = asPositiveSafeInteger(media.durationMs);
	const width = asPositiveSafeInteger(media.width);
	const height = asPositiveSafeInteger(media.height);
	const fileName = normalizeOptionalString(media.fileName);
	const sizeBytes = asFiniteNumberInRange(media.sizeBytes, { min: 0 });
	return {
		...mediaPath ? { path: resolveTranscriptMediaPath(mediaPath, workspaceDir) } : {},
		...mediaUrl ? { url: mediaUrl } : {},
		...contentType ? { contentType } : {},
		...kind ? { kind } : {},
		...fileName ? { fileName } : {},
		...sizeBytes !== void 0 ? { sizeBytes } : {},
		...durationMs ? { durationMs } : {},
		...width ? { width } : {},
		...height ? { height } : {},
		...media.transcribed === true ? { transcribed: true } : {},
		...messageId ? { messageId } : {},
		...workspaceDir ? { workspaceDir } : {},
		...media.hydrationSuppressed === true ? { hydrationSuppressed: true } : {}
	};
}
//#endregion
//#region src/sessions/user-turn-transcript.metadata.ts
const REPLY_PREVIEW_TEXT_MAX_CHARS = 2e3;
const REPLY_PREVIEW_SENDER_MAX_CHARS = 200;
const STEER_TARGET_RUN_ID_MAX_CHARS = 512;
function normalizePersistedSteerTargetRunId(value) {
	const normalized = normalizeOptionalString(value);
	return normalized && normalized.length <= STEER_TARGET_RUN_ID_MAX_CHARS ? normalized : void 0;
}
function buildUserTurnSenderMeta(sender) {
	const senderId = normalizeOptionalString(sender?.id);
	const senderName = normalizeOptionalString(sender?.name);
	const senderUsername = normalizeOptionalString(sender?.username);
	if (!senderId && !senderName && !senderUsername) return;
	return {
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {}
	};
}
function buildPersistedUserTurnMetadata(input, normalizedMedia) {
	const replyToId = normalizeOptionalString(input.replyToId);
	const replyPreviewText = normalizeOptionalString(input.replyToPreview?.text);
	const replyPreviewSender = normalizeOptionalString(input.replyToPreview?.senderLabel);
	return {
		...input.senderIsOwner === void 0 ? {} : { senderIsOwner: input.senderIsOwner && (!input.provenance || input.provenance.kind === "external_user") },
		...buildUserTurnSenderMeta(input.sender),
		...replyToId ? { replyToId } : {},
		...replyPreviewText ? { replyToPreview: {
			text: truncateUtf16Safe(replyPreviewText, REPLY_PREVIEW_TEXT_MAX_CHARS),
			...replyPreviewSender ? { senderLabel: truncateUtf16Safe(replyPreviewSender, REPLY_PREVIEW_SENDER_MAX_CHARS) } : {}
		} } : {},
		...input.transport ? { transport: input.transport } : {},
		...normalizedMedia.length > 0 ? { media: normalizedMedia } : {},
		...input.mediaImageLayout ? { mediaImageLayout: {
			slots: input.mediaImageLayout.slots.map((slot) => ({ ...slot })),
			...input.mediaImageLayout.suppressedFactIndexes?.length ? { suppressedFactIndexes: [...input.mediaImageLayout.suppressedFactIndexes] } : {}
		} } : {}
	};
}
function rewritePersistedSteerTargetRunId(message, targetRunId) {
	if (!message || targetRunId === void 0) return message;
	const metadata = { ...message["__openclaw"] };
	delete metadata.steerTargetRunId;
	if (targetRunId) metadata.steerTargetRunId = targetRunId;
	const nextMessage = { ...message };
	delete nextMessage["__openclaw"];
	if (Object.keys(metadata).length > 0) nextMessage["__openclaw"] = metadata;
	return nextMessage;
}
/** Restores producer metadata that write hooks must not be able to forge or erase. */
function restorePreparedUserTurnOperationalMetaForRuntime(params) {
	if (!params.preparedMessage || params.runtimeMessage.role !== "user") return params.runtimeMessage;
	const preparedMeta = params.preparedMessage["__openclaw"];
	const senderIsOwner = preparedMeta?.senderIsOwner;
	const steerTargetRunId = normalizePersistedSteerTargetRunId(preparedMeta?.steerTargetRunId);
	const nextMessage = { ...params.runtimeMessage };
	const runtimeMeta = { ...nextMessage["__openclaw"] };
	delete runtimeMeta.steerTargetRunId;
	if (steerTargetRunId) runtimeMeta.steerTargetRunId = steerTargetRunId;
	if (typeof senderIsOwner === "boolean") runtimeMeta.senderIsOwner = senderIsOwner;
	delete nextMessage["__openclaw"];
	if (Object.keys(runtimeMeta).length > 0) nextMessage["__openclaw"] = runtimeMeta;
	return nextMessage;
}
/** Applies before-message hooks while preserving user-turn transcript metadata. */
function preparePersistedUserTurnMessageForTranscriptWrite(message, params) {
	if (!params.beforeMessageWrite) return message;
	const originalIdempotencyKey = Reflect.get(message, "idempotencyKey");
	const idempotencyKey = typeof originalIdempotencyKey === "string" ? originalIdempotencyKey : void 0;
	const provenance = normalizeInputProvenance(Reflect.get(message, "provenance"));
	const originalMeta = message["__openclaw"];
	const senderIsOwner = originalMeta?.senderIsOwner;
	const replyToId = normalizeOptionalString(originalMeta?.replyToId);
	const originalReplyPreview = asOptionalRecord(originalMeta?.replyToPreview);
	const replyPreviewText = normalizeOptionalString(originalReplyPreview?.text);
	const replyPreviewSender = normalizeOptionalString(originalReplyPreview?.senderLabel);
	const replyToPreview = replyPreviewText ? {
		text: replyPreviewText,
		...replyPreviewSender ? { senderLabel: replyPreviewSender } : {}
	} : void 0;
	const originalTransport = originalMeta?.transport;
	const steerTargetRunId = normalizePersistedSteerTargetRunId(originalMeta?.steerTargetRunId);
	const lateMedia = originalMeta?.lateMedia === true;
	const originalMedia = originalMeta?.media;
	const media = Array.isArray(originalMedia) ? structuredClone(originalMedia) : void 0;
	const originalMediaImageLayout = originalMeta?.mediaImageLayout;
	const mediaImageLayout = originalMediaImageLayout === void 0 ? void 0 : structuredClone(originalMediaImageLayout);
	const originalTransportRecord = asOptionalRecord(originalTransport);
	const transport = originalTransportRecord ? { ...originalTransportRecord } : void 0;
	const nextMessage = params.beforeMessageWrite({
		message,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.sessionKey ? { sessionKey: params.sessionKey } : {}
	});
	if (nextMessage?.role !== "user") return;
	const preparedUserMessage = provenance ? applyInputProvenanceToUserMessage(nextMessage, provenance) : nextMessage;
	if (preparedUserMessage.role !== "user") return;
	const nextUserMessage = { ...preparedUserMessage };
	const protectedMeta = {
		...nextUserMessage["__openclaw"],
		...typeof senderIsOwner === "boolean" ? { senderIsOwner } : {},
		...replyToId ? { replyToId } : {},
		...replyToPreview ? { replyToPreview } : {},
		...transport ? { transport } : {},
		...lateMedia ? { lateMedia: true } : {},
		...media === void 0 ? {} : { media },
		...mediaImageLayout === void 0 ? {} : { mediaImageLayout }
	};
	delete protectedMeta.steerTargetRunId;
	if (steerTargetRunId) protectedMeta.steerTargetRunId = steerTargetRunId;
	const protectedMessage = {
		...nextUserMessage,
		...idempotencyKey ? { idempotencyKey } : {}
	};
	delete protectedMessage["__openclaw"];
	if (Object.keys(protectedMeta).length > 0) protectedMessage["__openclaw"] = protectedMeta;
	return protectedMessage;
}
//#endregion
//#region src/sessions/user-turn-transcript.ts
function buildRunUserTurnIdempotencyKey(runId) {
	return `${runId}:user`;
}
function resolvePersistedUserTurnText(value) {
	return normalizeOptionalString(value);
}
function resolveTranscriptMediaType(params) {
	return params.explicitType ?? mimeTypeFromFilePath(params.mediaPath ?? params.mediaUrl);
}
function buildPersistedUserTurnMediaInputsFromFields(fields) {
	const normalizedMedia = (fields ? readPersistedMediaFacts(fields) ?? [] : []).map((fact) => {
		const rawPath = normalizeOptionalString(fact.path);
		const mediaPath = rawPath ? resolveTranscriptMediaPath(rawPath, normalizeOptionalString(fact.workspaceDir)) : void 0;
		const url = normalizeOptionalString(fact.url);
		if (!mediaPath && !url) return {};
		const media = { contentType: resolveTranscriptMediaType({
			explicitType: normalizeOptionalString(fact.contentType),
			mediaPath,
			mediaUrl: url
		}) };
		if (mediaPath) media.path = mediaPath;
		if (url) media.url = url;
		if (fact.kind) media.kind = fact.kind;
		if (fact.fileName) media.fileName = fact.fileName;
		if (fact.sizeBytes !== void 0) media.sizeBytes = fact.sizeBytes;
		if (fact.durationMs !== void 0) media.durationMs = fact.durationMs;
		if (fact.width !== void 0) media.width = fact.width;
		if (fact.height !== void 0) media.height = fact.height;
		return media;
	});
	return normalizedMedia.some((entry) => entry.path || entry.url) ? normalizedMedia : [];
}
function buildLateMediaAttachedProjection(message) {
	const media = readOpenClawMessageMeta(message)?.lateMedia === true ? readPersistedMediaFacts(message) ?? [] : [];
	const text = media.flatMap((fact) => {
		const mediaRef = fact.path ?? fact.url;
		return mediaRef ? [`[media attached: ${mediaRef}]`] : [];
	}).join("\n");
	return {
		...text ? { text } : {},
		media
	};
}
function readOpenClawMessageMeta(message) {
	return asOptionalRecord(Reflect.get(message, "__openclaw"));
}
function buildPersistedUserTurnMessage(params) {
	const normalizedMedia = (params.media ?? []).map(normalizeStructuredMediaEntryForTranscript);
	const text = params.text ?? "";
	const openClawMeta = buildPersistedUserTurnMetadata(params, normalizedMedia);
	return applyInputProvenanceToUserMessage({
		role: "user",
		content: text,
		timestamp: params.timestamp ?? Date.now(),
		...params.idempotencyKey ? { idempotencyKey: params.idempotencyKey } : {},
		...Object.keys(openClawMeta).length > 0 ? { __openclaw: openClawMeta } : {}
	}, params.provenance);
}
function resolvePersistedUserTurnMessage(params) {
	return params.message ?? (params.input ? buildPersistedUserTurnMessage(params.input) : void 0);
}
function isUserMessage(message) {
	return asOptionalRecord(message)?.role === "user";
}
function buildLateResolvedMediaMessage(params) {
	const admittedMedia = buildPersistedUserTurnMediaInputsFromFields(params.admittedMessage);
	const resolvedMedia = buildPersistedUserTurnMediaInputsFromFields(params.resolvedMessage);
	if (resolvedMedia.length === 0 || JSON.stringify(resolvedMedia) === JSON.stringify(admittedMedia)) return;
	const resolvedIdempotencyKey = Reflect.get(params.resolvedMessage, "idempotencyKey");
	const resolvedTimestamp = Reflect.get(params.resolvedMessage, "timestamp");
	const admittedContent = params.admittedMessage?.content;
	const resolvedContent = params.resolvedMessage.content;
	let content = resolvedContent;
	if (resolvedContent === admittedContent) content = "";
	else if (Array.isArray(resolvedContent) && typeof admittedContent === "string") content = resolvedContent.filter((block) => {
		const textBlock = block;
		return textBlock?.type !== "text" || textBlock.text !== admittedContent;
	});
	const idempotencyKey = typeof resolvedIdempotencyKey === "string" && resolvedIdempotencyKey.length > 0 ? `${resolvedIdempotencyKey}:late-media` : `late-media:${typeof resolvedTimestamp === "number" ? resolvedTimestamp : Date.now()}`;
	return {
		...params.resolvedMessage,
		content,
		idempotencyKey,
		__openclaw: {
			...readOpenClawMessageMeta(params.resolvedMessage),
			lateMedia: true
		}
	};
}
function isBeforeAgentRunBlockedMessage(message) {
	return message["__openclaw"]?.beforeAgentRunBlocked !== void 0;
}
function userMessageHasImageContent(message) {
	return isUserMessage(message) && Array.isArray(message.content) && message.content.some((block) => typeof block === "object" && block !== null && block.type === "image");
}
function mergePreparedUserTurnMessageForRuntime(params) {
	if (!params.preparedMessage || !isUserMessage(params.runtimeMessage) || isBeforeAgentRunBlockedMessage(params.runtimeMessage)) return params.runtimeMessage;
	const runtimeMeta = readOpenClawMessageMeta(params.runtimeMessage);
	const preparedMeta = readOpenClawMessageMeta(params.preparedMessage);
	return {
		...params.runtimeMessage,
		...params.preparedMessage,
		...preparedMeta ? { __openclaw: {
			...runtimeMeta,
			...preparedMeta
		} } : {},
		...userMessageHasImageContent(params.runtimeMessage) ? { content: params.runtimeMessage.content } : {}
	};
}
async function persistUserTurnTranscript(params) {
	const message = resolvePersistedUserTurnMessage(params);
	if (!message) return;
	const turn = await persistSessionTranscriptTurn({
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		sessionEntry: params.sessionEntry,
		...params.sessionStore ? { sessionStore: params.sessionStore } : {},
		...params.storePath ? { storePath: params.storePath } : {},
		agentId: params.agentId,
		...params.threadId !== void 0 ? { threadId: params.threadId } : {}
	}, {
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		...params.expectedSessionId ? { expectedSessionId: params.expectedSessionId } : {},
		...params.expectedSessionState ? { expectedSessionState: params.expectedSessionState } : {},
		...params.sessionLifecyclePatch ? { sessionLifecyclePatch: params.sessionLifecyclePatch } : {},
		updateMode: params.updateMode ?? "inline",
		messages: [{
			message,
			idempotencyLookup: "scan",
			prepareMessageAfterIdempotencyCheck: (candidate) => preparePersistedUserTurnMessageForTranscriptWrite(candidate, params)
		}]
	});
	let appended = turn.messages[0];
	if (appended && !appended.anchor && appended.message.role === "user") {
		await waitForSessionTranscriptProjection(params);
		const anchor = readActiveTranscriptEntryAnchor({
			...params,
			entryId: appended.messageId
		});
		appended = anchor ? {
			...appended,
			anchor
		} : appended;
	}
	if (!appended?.anchor || appended.message.role !== "user") return;
	return {
		...appended,
		admission: {
			...appended.anchor,
			logicalTurnId: params.logicalTurnId ?? randomUUID(),
			role: "user"
		},
		sessionEntry: turn.sessionEntry,
		sessionFile: params.sessionKey
	};
}
async function resolveUserTurnTranscriptTarget(target) {
	return typeof target === "function" ? await target() : target;
}
async function confirmPersistedSteerTargetRunId(params) {
	const rewritten = await rewriteTranscriptMessageAtAnchor(params.admission, (message) => {
		if (!isUserMessage(message)) return;
		return normalizePersistedSteerTargetRunId(message["__openclaw"]?.steerTargetRunId) === params.targetRunId ? void 0 : rewritePersistedSteerTargetRunId(message, params.targetRunId);
	});
	if (!rewritten) return;
	const admission = {
		...params.admission,
		generation: rewritten.generation
	};
	await publishTranscriptUpdate(admission, {
		message: rewritten.message,
		messageId: admission.entryId,
		messageSeq: admission.activeMessagePosition + 1
	});
	return {
		admission,
		message: rewritten.message
	};
}
function createUserTurnTranscriptRecorder(params) {
	const logicalTurnId = randomUUID();
	let message = resolvePersistedUserTurnMessage(params);
	let blocked = false;
	let persisted = false;
	let runtimePersisted = false;
	let persistedResult;
	let admissionReceipt;
	let admittedMessage;
	let runtimePersistencePromise;
	let selfPersistencePromise;
	let resolvedMessagePromise;
	let persistedMessageNotified = false;
	let runtimePersistedMessage;
	let sentToProvider = false;
	let admissionHandler;
	let resolvedBeforeProvider = false;
	let replacementText;
	let confirmedSteerTargetRunId;
	const applyReplacementText = (candidate) => {
		if (!candidate || replacementText === void 0) return candidate;
		return {
			...candidate,
			content: replacementText
		};
	};
	const applyMessageOverrides = (candidate) => rewritePersistedSteerTargetRunId(applyReplacementText(candidate), confirmedSteerTargetRunId);
	const handlePersistenceError = (error) => {
		if (params.onPersistenceError) {
			params.onPersistenceError(error);
			return;
		}
		import("./globals-CSwMqfQT.js").then(({ logVerbose }) => {
			logVerbose(`failed to persist ${params.errorContext ?? "user turn transcript"}: ${String(error)}`);
		}).catch(() => void 0);
	};
	const resolveMessageForPersistence = async () => {
		if (params.message || !params.resolveInput) return applyMessageOverrides(message);
		if (!resolvedMessagePromise) resolvedMessagePromise = (async () => {
			try {
				const resolvedInput = await params.resolveInput?.();
				const resolvedMessage = resolvePersistedUserTurnMessage({
					message: params.message,
					input: resolvedInput ?? params.input
				}) ?? message;
				resolvedBeforeProvider = !sentToProvider;
				return applyMessageOverrides(resolvedMessage);
			} catch (error) {
				handlePersistenceError(error);
				return applyMessageOverrides(message);
			}
		})();
		return await resolvedMessagePromise;
	};
	const notifyMessagePersisted = (persistedMessage) => {
		const notificationMessage = persistedMessage ?? persistedResult?.message ?? message;
		if (!notificationMessage || persistedMessageNotified || !params.onMessagePersisted) return;
		persistedMessageNotified = true;
		try {
			Promise.resolve(params.onMessagePersisted(notificationMessage)).catch(handlePersistenceError);
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const recordAdmission = (receipt, persistedMessage) => {
		if (admissionReceipt) return;
		admissionReceipt = resolveUserTurnTranscriptAdmission({
			logicalTurnId,
			receipt
		});
		admittedMessage = persistedMessage;
		admissionHandler?.(admissionReceipt);
	};
	const waitForRuntimePersistence = async () => {
		if (!runtimePersistencePromise) return;
		try {
			await runtimePersistencePromise;
		} catch (error) {
			handlePersistenceError(error);
		}
	};
	const persistPrepared = async (options) => {
		if (options.skipWhenBlocked && blocked) return;
		if (!options.message && !message && !params.resolveInput) return;
		if (options.waitForRuntime) await waitForRuntimePersistence();
		if (selfPersistencePromise) {
			const existingPromise = selfPersistencePromise;
			const existingResult = await existingPromise;
			if (existingResult || !options.retryIfUnpersisted) return existingResult;
			if (selfPersistencePromise !== existingPromise) return await selfPersistencePromise;
			selfPersistencePromise = void 0;
		}
		const persistencePromise = (async () => {
			const resolvedMessage = options.message ?? await resolveMessageForPersistence();
			if (!resolvedMessage) return;
			const target = await resolveUserTurnTranscriptTarget(options.target ?? params.target);
			if (!target) return;
			const resolvedTarget = options.cwd ? {
				...target,
				cwd: options.cwd
			} : target;
			const updateMode = options.updateMode ?? params.updateMode ?? "inline";
			const persistMessage = async (candidate, candidateUpdateMode) => await persistUserTurnTranscript({
				...resolvedTarget,
				logicalTurnId,
				message: candidate,
				...options.expectedSessionId ? { expectedSessionId: options.expectedSessionId } : {},
				...options.sessionLifecyclePatch ?? params.sessionLifecyclePatch ? { sessionLifecyclePatch: options.sessionLifecyclePatch ?? params.sessionLifecyclePatch } : {},
				...options.expectedSessionState ?? params.expectedSessionState ? { expectedSessionState: options.expectedSessionState ?? params.expectedSessionState } : {},
				updateMode: candidateUpdateMode,
				...params.beforeMessageWrite ? { beforeMessageWrite: params.beforeMessageWrite } : {}
			});
			const lateMediaMessage = sentToProvider && !resolvedBeforeProvider ? buildLateResolvedMediaMessage({
				admittedMessage: runtimePersistedMessage ?? message,
				resolvedMessage
			}) : void 0;
			if (lateMediaMessage) {
				if (!runtimePersisted && !persisted && message) {
					const admittedResult = await persistMessage(message, updateMode);
					if (admittedResult) {
						persisted = true;
						persistedResult = admittedResult;
						recordAdmission(admittedResult.admission, admittedResult.message);
						notifyMessagePersisted(admittedResult.message);
					}
				}
				const appendedMedia = await persistMessage(lateMediaMessage, "none");
				if (appendedMedia) {
					persisted = true;
					persistedResult = appendedMedia;
				}
				return appendedMedia;
			}
			if (runtimePersisted) return;
			if (persisted) return persistedResult;
			const result = await persistMessage(resolvedMessage, updateMode);
			if (result) {
				persisted = true;
				persistedResult = result;
				recordAdmission(result.admission, result.message);
				notifyMessagePersisted(result.message);
			}
			return result;
		})();
		selfPersistencePromise = persistencePromise;
		try {
			const result = await persistencePromise;
			if (!result && options.retryIfUnpersisted && selfPersistencePromise === persistencePromise) selfPersistencePromise = void 0;
			return result;
		} catch (error) {
			handlePersistenceError(error);
			throw error;
		}
	};
	return {
		get message() {
			return message;
		},
		resolveMessage: resolveMessageForPersistence,
		replaceTextBeforePersistence: (text) => {
			if (persisted || runtimePersisted || sentToProvider) return;
			replacementText = text;
			message = applyMessageOverrides(message);
			resolvedMessagePromise = void 0;
		},
		confirmSteerTargetRunIdForPersistence: async (targetRunId) => {
			const normalizedTargetRunId = normalizePersistedSteerTargetRunId(targetRunId);
			if (!normalizedTargetRunId || confirmedSteerTargetRunId === normalizedTargetRunId) return;
			confirmedSteerTargetRunId = normalizedTargetRunId;
			message = applyMessageOverrides(message);
			resolvedMessagePromise = void 0;
			const pendingSelfPersistence = selfPersistencePromise;
			await waitForRuntimePersistence();
			await pendingSelfPersistence?.catch(() => void 0);
			if (!admissionReceipt) return;
			try {
				const confirmed = await confirmPersistedSteerTargetRunId({
					admission: admissionReceipt,
					targetRunId: normalizedTargetRunId
				});
				if (!confirmed) return;
				admissionReceipt = confirmed.admission;
				admittedMessage = confirmed.message;
				runtimePersistedMessage = confirmed.message;
				if (persistedResult) persistedResult = {
					...persistedResult,
					admission: confirmed.admission,
					message: confirmed.message
				};
			} catch (error) {
				handlePersistenceError(error);
			}
		},
		getPersistedMessage: () => admittedMessage ?? runtimePersistedMessage ?? persistedResult?.message,
		getAdmissionReceipt: () => admissionReceipt,
		setAdmissionHandler: (handler) => admissionHandler = handler,
		markSentToProvider: () => {
			sentToProvider = true;
		},
		markRuntimePersistencePending: (pending) => {
			runtimePersistencePromise = pending;
		},
		markRuntimePersisted: (persistedMessage, receipt) => {
			runtimePersistedMessage = persistedMessage;
			runtimePersisted = true;
			if (persistedMessage && receipt) recordAdmission(receipt, persistedMessage);
			if (persistedMessage && persistedResult) persistedResult = {
				...persistedResult,
				message: persistedMessage
			};
			notifyMessagePersisted(persistedMessage);
		},
		markBlocked: () => {
			blocked = true;
		},
		hasPersisted: () => persisted || runtimePersisted,
		isBlocked: () => blocked,
		hasRuntimePersistencePending: () => runtimePersistencePromise !== void 0,
		waitForRuntimePersistence,
		persistApproved: async (options) => await persistPrepared({
			waitForRuntime: false,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd,
			expectedSessionId: options?.expectedSessionId,
			expectedSessionState: options?.expectedSessionState,
			sessionLifecyclePatch: options?.sessionLifecyclePatch,
			retryIfUnpersisted: options?.retryIfUnpersisted
		}),
		persistBlocked: async (blockedMessage, options) => {
			blocked = true;
			return await persistPrepared({
				waitForRuntime: false,
				skipWhenBlocked: false,
				message: blockedMessage,
				target: options?.target,
				updateMode: options?.updateMode,
				cwd: options?.cwd
			});
		},
		persistFallback: async (options) => await persistPrepared({
			waitForRuntime: true,
			skipWhenBlocked: true,
			target: options?.target,
			updateMode: options?.updateMode,
			cwd: options?.cwd
		})
	};
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.userTurnTranscriptTestApi")] = { persistUserTurnTranscript };
//#endregion
export { createUserTurnTranscriptRecorder as a, preparePersistedUserTurnMessageForTranscriptWrite as c, buildRunUserTurnIdempotencyKey as i, restorePreparedUserTurnOperationalMetaForRuntime as l, buildPersistedUserTurnMediaInputsFromFields as n, mergePreparedUserTurnMessageForRuntime as o, buildPersistedUserTurnMessage as r, resolvePersistedUserTurnText as s, buildLateMediaAttachedProjection as t };
