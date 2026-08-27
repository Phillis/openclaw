import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-yf-1HkL_.js";
import { t as log } from "./logger-BQ2aebRn.js";
import { t as projectAgentHarnessTranscriptMessageForDisplay } from "./transcript-visibility-DxlroY1R.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./agent-harness-runtime-DrXbITHA.js";
import { a as publishSessionTranscriptUpdateByIdentity } from "./session-transcript-runtime-CcyNX9RF.js";
import { n as withCodexSessionTranscriptMirrorWriteLock } from "./codex-session-transcript-runtime-CSEw5E2l.js";
import { i as readUpstreamUserText, n as attachUpstreamUserText, r as readMirrorIdentity, t as attachCodexMirrorIdentity } from "./upstream-prompt-provenance-ClRBije0.js";
import { createHash } from "node:crypto";
import { Buffer } from "node:buffer";
//#region extensions/codex/src/app-server/user-prompt-message.ts
function buildSenderLabel(params) {
	const label = params.senderName ?? params.senderUsername ?? params.senderE164 ?? params.senderId;
	if (!label) return;
	return !params.senderId || label.includes(params.senderId) ? label : `${label} (${params.senderId})`;
}
function buildFromPrepared(params, preparedUserMessage) {
	const senderId = normalizeOptionalString(params.senderId);
	const senderName = normalizeOptionalString(params.senderName);
	const senderUsername = normalizeOptionalString(params.senderUsername);
	const senderE164 = normalizeOptionalString(params.senderE164);
	const senderLabel = buildSenderLabel({
		senderId,
		senderName,
		senderUsername,
		senderE164
	});
	const sourceChannel = normalizeOptionalString(params.inputProvenance?.sourceChannel ?? params.messageChannel ?? params.messageProvider);
	return {
		role: "user",
		timestamp: Date.now(),
		...params.inputProvenance ? { provenance: params.inputProvenance } : {},
		...sourceChannel ? { sourceChannel } : {},
		...senderId ? { senderId } : {},
		...senderName ? { senderName } : {},
		...senderUsername ? { senderUsername } : {},
		...senderE164 ? { senderE164 } : {},
		...senderLabel ? { senderLabel } : {},
		...preparedUserMessage ? preparedUserMessage : { content: params.prompt }
	};
}
function buildCodexUserPromptMessage(params) {
	return buildFromPrepared(params, params.userTurnTranscriptRecorder?.message);
}
function buildCodexUpstreamPromptMessage(params, identity, upstreamUserText) {
	const message = attachCodexMirrorIdentity(buildCodexUserPromptMessage(params), identity);
	return upstreamUserText ? attachUpstreamUserText(message, upstreamUserText) : message;
}
function promptSnapshot(params, turnId, upstreamUserText) {
	return params.suppressNextUserMessagePersistence ? [] : [buildCodexUpstreamPromptMessage(params, `${turnId}:prompt`, upstreamUserText)];
}
async function buildResolvedCodexUserPromptMessage(params) {
	return buildFromPrepared(params, await params.userTurnTranscriptRecorder?.resolveMessage() ?? params.userTurnTranscriptRecorder?.message);
}
//#endregion
//#region extensions/codex/src/app-server/transcript-history-projection.ts
const CODEX_HISTORY_IMPORT_MAX_MESSAGES = 200;
const CODEX_HISTORY_IMPORT_MAX_BYTES = 512 * 1024;
const CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES = 64 * 1024;
const CODEX_HISTORY_TRUNCATION_SUFFIX = "\n\n[Message truncated during Codex history import.]";
const CODEX_HISTORY_ASSISTANT_API = "openai-chatgpt-responses";
const CODEX_HISTORY_ASSISTANT_PROVIDER = "openai";
const CODEX_HISTORY_ASSISTANT_MODEL = "native-history";
const CODEX_HISTORY_ZERO_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
function isUtf8ContinuationByte(byte) {
	return byte !== void 0 && (byte & 192) === 128;
}
function truncateUtf8Prefix(value, maxBytes) {
	const bytes = Buffer.from(value);
	if (bytes.byteLength <= maxBytes) return value;
	let end = Math.max(0, maxBytes);
	while (end > 0 && isUtf8ContinuationByte(bytes[end])) end -= 1;
	return bytes.subarray(0, end).toString("utf8");
}
function normalizeImportedHistoryText(value) {
	if (typeof value !== "string") return;
	const text = value.trim();
	if (!text) return;
	if (Buffer.byteLength(text, "utf8") <= CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES) return text;
	const suffixBytes = Buffer.byteLength(CODEX_HISTORY_TRUNCATION_SUFFIX, "utf8");
	return `${truncateUtf8Prefix(text, Math.max(0, CODEX_HISTORY_IMPORT_MAX_MESSAGE_BYTES - suffixBytes))}${CODEX_HISTORY_TRUNCATION_SUFFIX}`;
}
function projectCodexUserItemText(item) {
	if (!Array.isArray(item.content)) return;
	const parts = [];
	for (const value of item.content) {
		if (!value || typeof value !== "object" || Array.isArray(value)) continue;
		const input = value;
		if (input.type === "text") {
			const text = normalizeImportedHistoryText(input.text);
			if (text) parts.push(text);
			continue;
		}
		if (input.type === "image" || input.type === "localImage") {
			parts.push("[Image attachment]");
			continue;
		}
		if (input.type === "audio" || input.type === "localAudio" || input.type === "local_audio") parts.push("[Audio attachment]");
		if (input.type === "skill" || input.type === "mention") {
			const name = normalizeOptionalString(input.name);
			if (name) parts.push(`${input.type === "skill" ? "$" : "@"}${name}`);
		}
	}
	return normalizeImportedHistoryText(parts.join("\n"));
}
function selectTurnsThroughBoundary(thread, throughTurnId) {
	if (throughTurnId === null) return [];
	const turns = thread.turns ?? [];
	const boundaryIndex = turns.findIndex((turn) => turn.id === throughTurnId);
	if (boundaryIndex < 0) throw new Error(`Codex history boundary turn not found: ${throughTurnId}`);
	const boundary = turns[boundaryIndex];
	if (boundary?.status !== "completed" && boundary?.status !== "interrupted" && boundary?.status !== "failed") throw new Error(`Codex history boundary turn is not terminal: ${throughTurnId}`);
	return turns.slice(0, boundaryIndex + 1);
}
function projectCodexThreadHistory(params) {
	const projected = [];
	const threadTimestamp = typeof params.thread.createdAt === "number" && Number.isFinite(params.thread.createdAt) ? params.thread.createdAt * 1e3 : params.importedAt;
	let itemOffset = 0;
	for (const turn of selectTurnsThroughBoundary(params.thread, params.throughTurnId)) for (const value of turn.items) {
		const item = value;
		const itemId = normalizeOptionalString(item.id);
		const identity = `${turn.id}:${itemId ?? itemOffset}`;
		const timestampSeconds = item.type === "agentMessage" ? turn.completedAt ?? turn.startedAt : turn.startedAt ?? turn.completedAt;
		const timestamp = typeof timestampSeconds === "number" && Number.isFinite(timestampSeconds) ? timestampSeconds * 1e3 + itemOffset : threadTimestamp + itemOffset;
		const text = item.type === "userMessage" ? projectCodexUserItemText(item) : item.type === "agentMessage" ? normalizeImportedHistoryText(item.text) : void 0;
		const role = item.type === "userMessage" ? "user" : item.type === "agentMessage" ? "assistant" : void 0;
		itemOffset += 1;
		if (!text || !role) continue;
		const message = role === "assistant" ? attachCodexMirrorIdentity({
			role,
			content: [{
				type: "text",
				text
			}],
			api: CODEX_HISTORY_ASSISTANT_API,
			provider: normalizeOptionalString(params.modelProvider) ?? normalizeOptionalString(params.thread.modelProvider) ?? CODEX_HISTORY_ASSISTANT_PROVIDER,
			model: CODEX_HISTORY_ASSISTANT_MODEL,
			usage: CODEX_HISTORY_ZERO_USAGE,
			stopReason: turn.status === "interrupted" ? "aborted" : turn.status === "failed" ? "error" : "stop",
			...turn.status === "failed" && turn.error?.message ? { errorMessage: turn.error.message } : {},
			timestamp
		}, identity) : attachCodexMirrorIdentity({
			role,
			content: text,
			timestamp
		}, identity);
		const phase = item.phase === "commentary" || item.phase === "final_answer" ? item.phase : void 0;
		projected.push({
			message,
			responseItem: {
				type: "message",
				role,
				content: [{
					type: role === "assistant" ? "output_text" : "input_text",
					text
				}],
				...role === "assistant" && phase ? { phase } : {}
			},
			textBytes: Buffer.byteLength(text, "utf8")
		});
	}
	return projected;
}
function selectBoundedCodexHistoryTail(projected) {
	const selected = [];
	let selectedBytes = 0;
	for (let index = projected.length - 1; index >= 0; index -= 1) {
		const candidate = projected[index];
		if (!candidate) continue;
		if (selected.length >= CODEX_HISTORY_IMPORT_MAX_MESSAGES || selectedBytes + candidate.textBytes > CODEX_HISTORY_IMPORT_MAX_BYTES) break;
		selected.push(candidate);
		selectedBytes += candidate.textBytes;
	}
	return selected.toReversed();
}
/** Projects one terminal Codex history prefix into transcript and Responses API items. */
function projectBoundedCodexThreadHistory(params) {
	const projected = projectCodexThreadHistory({
		thread: params.thread,
		throughTurnId: params.throughTurnId,
		importedAt: params.importedAt,
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	const selected = selectBoundedCodexHistoryTail(projected);
	return {
		importedMessages: selected.length,
		omittedMessages: projected.length - selected.length,
		responseItems: selected.filter(({ message }) => message.role !== "assistant" || message.stopReason !== "aborted" && message.stopReason !== "error").map(({ responseItem }) => responseItem),
		transcriptMessages: selected.map(({ message }) => message)
	};
}
/** Projects only visible local user/assistant messages through the same bounded history policy. */
function projectBoundedCodexVisibleSessionHistory(entries) {
	const projected = [];
	for (const entry of entries) {
		if (entry.role !== "user" && entry.role !== "assistant" || !("content" in entry.message)) continue;
		if (entry.role === "assistant" && "stopReason" in entry.message && (entry.message.stopReason === "aborted" || entry.message.stopReason === "error")) continue;
		const content = entry.message.content;
		const text = normalizeImportedHistoryText(typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((part) => part && typeof part === "object" && "text" in part && typeof part.text === "string" ? [part.text] : []).join("\n") : void 0);
		if (!text) continue;
		projected.push({
			message: entry.message,
			responseItem: {
				type: "message",
				role: entry.role,
				content: [{
					type: entry.role === "assistant" ? "output_text" : "input_text",
					text
				}]
			},
			textBytes: Buffer.byteLength(text, "utf8")
		});
	}
	return selectBoundedCodexHistoryTail(projected).map(({ responseItem }) => responseItem);
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror-attestation.ts
const MIRROR_ORIGIN_META_KEY = "mirrorOrigin";
const MIRROR_SOURCE_FINGERPRINT_META_KEY = "mirrorSourceFingerprint";
const CODEX_APP_SERVER_MIRROR_ORIGIN = "codex-app-server";
function attachCodexMirrorAttestation(message, sourceFingerprint) {
	const record = message;
	const existing = record["__openclaw"];
	const baseMeta = existing && typeof existing === "object" && !Array.isArray(existing) ? existing : {};
	return {
		...record,
		__openclaw: {
			...baseMeta,
			[MIRROR_ORIGIN_META_KEY]: CODEX_APP_SERVER_MIRROR_ORIGIN,
			...sourceFingerprint ? { [MIRROR_SOURCE_FINGERPRINT_META_KEY]: sourceFingerprint } : {}
		}
	};
}
function readCodexMirrorSourceFingerprint(message) {
	const meta = message["__openclaw"];
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return;
	const value = meta[MIRROR_SOURCE_FINGERPRINT_META_KEY];
	return typeof value === "string" && value ? value : void 0;
}
function serializeCodexMirrorSourceEvidence(message) {
	const record = message;
	return JSON.stringify({
		role: message.role,
		content: record.content,
		...message.role === "user" ? { upstreamUserText: readUpstreamUserText(message) } : {},
		...message.role === "toolResult" ? {
			toolCallId: record.toolCallId,
			toolName: record.toolName,
			isError: record.isError === true
		} : {}
	});
}
function fingerprintCodexMirrorSourceMessage(message) {
	return createHash("sha256").update(serializeCodexMirrorSourceEvidence(message)).digest("hex").slice(0, 32);
}
//#endregion
//#region extensions/codex/src/app-server/transcript-mirror.ts
function isMirroredAgentMessage(message) {
	return message.role === "user" || message.role === "assistant" || message.role === "toolResult";
}
/** Imports a bounded, user-visible Codex history tail into a new OpenClaw transcript. */
async function importCodexThreadHistoryToTranscript(params) {
	const projection = projectBoundedCodexThreadHistory({
		thread: params.thread,
		throughTurnId: params.throughTurnId,
		importedAt: Date.now(),
		...params.modelProvider ? { modelProvider: params.modelProvider } : {}
	});
	if (projection.transcriptMessages.length > 0) await mirror({
		storePath: params.storePath,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		...params.agentId ? { agentId: params.agentId } : {},
		...params.cwd ? { cwd: params.cwd } : {},
		...params.config ? { config: params.config } : {},
		messages: projection.transcriptMessages,
		idempotencyScope: `codex-app-server:${params.thread.id}:history`
	});
	return {
		importedMessages: projection.importedMessages,
		omittedMessages: projection.omittedMessages
	};
}
async function mirrorBestEffort(params) {
	if (!params.params.sessionTarget) return {
		assistantTranscriptOwned: false,
		mirroredMessages: []
	};
	try {
		const messages = await resolveFinalCodexMirrorMessages({
			params: params.params,
			messagesSnapshot: params.result.messagesSnapshot,
			turnId: params.turnId
		});
		const mirrorResult = await mirror({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.params.sessionId,
			storePath: params.params.sessionTarget?.storePath,
			cwd: params.cwd,
			messages,
			idempotencyScope: `codex-app-server:${params.threadId}`,
			config: params.params.config
		});
		for (const receipt of mirrorResult.userMessageReceipts) try {
			params.notifyUserMessagePersisted(receipt.message, receipt.anchor);
		} catch (error) {
			log.warn("failed to notify codex app-server user-message persistence", { error: formatErrorMessage(error) });
		}
		const expectedFingerprints = new Map(messages.flatMap((message) => {
			if (!isMirroredAgentMessage(message)) return [];
			const identity = readMirrorIdentity(message);
			return identity ? [[identity, fingerprintCodexMirrorSourceMessage(message)]] : [];
		}));
		const mirroredMessages = mirrorResult.messagesPresent.filter((message) => {
			const identity = readMirrorIdentity(message);
			return identity !== void 0 && readCodexMirrorSourceFingerprint(message) === expectedFingerprints.get(identity);
		});
		const assistantMirrorIdentity = `${params.turnId}:assistant`;
		const assistantTranscriptOwned = mirrorResult.assistantMirrorIdentitiesOwned.includes(assistantMirrorIdentity);
		const assistantTranscriptIdempotencyKey = normalizeOptionalString((assistantTranscriptOwned ? mirroredMessages.find((message) => readMirrorIdentity(message) === assistantMirrorIdentity) : void 0)?.idempotencyKey);
		const terminalMessage = mirroredMessages.at(-1);
		const terminalMirrorIdentity = terminalMessage ? readMirrorIdentity(terminalMessage) : void 0;
		const terminalAnchor = (terminalMirrorIdentity ? mirrorResult.anchorsByMirrorIdentity.get(terminalMirrorIdentity) : void 0) ?? params.params.userTurnTranscriptRecorder?.getAdmissionReceipt();
		return {
			assistantTranscriptOwned,
			...assistantTranscriptIdempotencyKey ? { assistantTranscriptIdempotencyKey } : {},
			...terminalAnchor ? { terminalAnchor } : {},
			mirroredMessages
		};
	} catch (error) {
		log.warn("failed to mirror codex app-server transcript", {
			error: formatErrorMessage(error),
			runId: params.params.runId,
			sessionId: params.params.sessionId
		});
		return {
			assistantTranscriptOwned: false,
			mirroredMessages: []
		};
	}
}
async function resolveFinalCodexMirrorMessages(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.userTurnTranscriptRecorder) return params.messagesSnapshot;
	const promptSnapshot = params.messagesSnapshot.find((message) => message.role === "user");
	const resolvedBase = attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`);
	const upstreamUserText = readUpstreamUserText(promptSnapshot);
	const resolvedPrompt = upstreamUserText ? attachUpstreamUserText(resolvedBase, upstreamUserText) : resolvedBase;
	const firstUserIndex = params.messagesSnapshot.findIndex((message) => message.role === "user");
	if (firstUserIndex === -1) return [resolvedPrompt, ...params.messagesSnapshot];
	const messages = params.messagesSnapshot.slice();
	messages[firstUserIndex] = resolvedPrompt;
	return messages;
}
function createCodexAppServerUserMessagePersistenceNotifier(runParams) {
	let notified = false;
	return (message, anchor) => {
		if (notified) return;
		notified = true;
		runParams.userTurnTranscriptRecorder?.markRuntimePersisted(message, anchor);
		try {
			runParams.onUserMessagePersisted?.(message);
		} catch (error) {
			log.warn("codex app-server user persistence notification failed", { error: formatErrorMessage(error) });
		}
	};
}
async function mirrorPromptAtTurnStartBestEffort(params) {
	if (params.params.suppressNextUserMessagePersistence || !params.params.sessionTarget) return;
	try {
		const mirrorPromise = (async () => {
			const userPromptMessage = projectAgentHarnessTranscriptMessageForDisplay({
				hidden: params.params.trigger === "memory",
				message: attachUpstreamUserText(attachCodexMirrorIdentity(await buildResolvedCodexUserPromptMessage(params.params), `${params.turnId}:prompt`), params.upstreamUserText)
			});
			const mirrorResult = await mirror({
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.params.sessionId,
				storePath: params.params.sessionTarget?.storePath,
				cwd: params.cwd,
				messages: [userPromptMessage],
				idempotencyScope: `codex-app-server:${params.threadId}`,
				config: params.params.config
			});
			for (const receipt of mirrorResult.userMessageReceipts) params.notifyUserMessagePersisted(receipt.message, receipt.anchor);
		})();
		params.params.userTurnTranscriptRecorder?.markRuntimePersistencePending(mirrorPromise);
		await mirrorPromise;
	} catch (error) {
		log.warn("failed to mirror codex app-server prompt at turn start", {
			error: formatErrorMessage(error),
			runId: params.params.runId,
			sessionId: params.params.sessionId
		});
	}
}
function fingerprintMirrorMessageContent(message) {
	const payload = JSON.stringify({
		role: message.role,
		content: message.content
	});
	return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function buildMirrorDedupeIdentity(message) {
	const explicit = readMirrorIdentity(message);
	if (explicit) return explicit;
	return `${message.role}:${fingerprintMirrorMessageContent(message)}`;
}
async function mirror(params) {
	const messages = params.messages.filter(isMirroredAgentMessage);
	if (messages.length === 0) return {
		assistantMirrorIdentitiesOwned: [],
		anchorsByMirrorIdentity: /* @__PURE__ */ new Map(),
		messagesPresent: [],
		userMessageReceipts: [],
		userMessagesPresent: []
	};
	const candidates = messages.map((message) => {
		const dedupeIdentity = buildMirrorDedupeIdentity(message);
		const sourceFingerprint = fingerprintCodexMirrorSourceMessage(message);
		return {
			dedupeIdentity,
			idempotencyKey: (message.role === "user" ? normalizeOptionalString(message.idempotencyKey) : void 0) ?? (params.idempotencyScope ? `${params.idempotencyScope}:${dedupeIdentity}` : void 0),
			message,
			sourceFingerprint
		};
	});
	const candidateIdempotencyKeys = candidates.flatMap(({ idempotencyKey }) => idempotencyKey ? [idempotencyKey] : []);
	const transcriptTarget = resolveCodexMirrorTranscriptTarget(params);
	const { appendedUpdates, assistantMirrorIdentitiesOwned, anchorsByMirrorIdentity, messagesPresent, userMessageReceipts, userMessagesPresent } = await withCodexSessionTranscriptMirrorWriteLock({
		...transcriptTarget,
		config: params.config
	}, async (transcript) => {
		const nextAppendedUpdates = [];
		const nextAssistantMirrorIdentitiesOwned = /* @__PURE__ */ new Set();
		const nextAnchorsByMirrorIdentity = /* @__PURE__ */ new Map();
		const nextMessagesPresent = [];
		const nextUserMessageReceipts = [];
		const nextUserMessagesPresent = [];
		const mirrorFacts = await transcript.readMessageFacts({ idempotencyKeys: candidateIdempotencyKeys });
		for (const { dedupeIdentity, idempotencyKey, message, sourceFingerprint } of candidates) {
			const transcriptMessage = {
				...attachCodexMirrorAttestation(message, sourceFingerprint),
				...idempotencyKey ? { idempotencyKey } : {}
			};
			if (idempotencyKey && mirrorFacts.existingIdempotencyKeys.has(idempotencyKey)) {
				const persistedMessage = mirrorFacts.messagesByIdempotencyKey.get(idempotencyKey);
				const persistedAnchor = mirrorFacts.anchorsByIdempotencyKey.get(idempotencyKey);
				if (persistedMessage && isMirroredAgentMessage(persistedMessage)) {
					nextMessagesPresent.push(persistedMessage);
					if (persistedMessage.role === "user") {
						nextUserMessagesPresent.push(persistedMessage);
						if (persistedAnchor) nextUserMessageReceipts.push({
							anchor: persistedAnchor,
							message: persistedMessage
						});
					}
				}
				if (persistedAnchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, persistedAnchor);
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			const nextMessage = params.skipBeforeMessageWriteHooks ? transcriptMessage : runAgentHarnessBeforeMessageWriteHook({
				message: transcriptMessage,
				agentId: params.agentId,
				sessionKey: params.sessionKey
			});
			if (!nextMessage) {
				if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
				continue;
			}
			let messageToAppend = idempotencyKey ? {
				...attachCodexMirrorAttestation(nextMessage, sourceFingerprint),
				idempotencyKey
			} : attachCodexMirrorAttestation(nextMessage, sourceFingerprint);
			const mirrorIdentity = readMirrorIdentity(message);
			if (mirrorIdentity) messageToAppend = attachCodexMirrorIdentity(messageToAppend, mirrorIdentity);
			messageToAppend = projectAgentHarnessTranscriptMessageForDisplay({
				hidden: message.display === false,
				message: messageToAppend
			});
			const { messageSeq, result: appended } = await transcript.appendMessageWithMessageSequence({
				message: messageToAppend,
				idempotencyLookup: "scan",
				cwd: params.cwd
			});
			if (!appended) continue;
			const { messageId, message: appendedMessage } = appended;
			if (isMirroredAgentMessage(appendedMessage)) {
				nextMessagesPresent.push(appendedMessage);
				if (idempotencyKey) mirrorFacts.messagesByIdempotencyKey.set(idempotencyKey, appendedMessage);
			}
			if (message.role === "assistant") nextAssistantMirrorIdentitiesOwned.add(dedupeIdentity);
			if (appended.anchor) nextAnchorsByMirrorIdentity.set(dedupeIdentity, appended.anchor);
			if (appendedMessage.role === "user" && appended.anchor) {
				nextUserMessagesPresent.push(appendedMessage);
				nextUserMessageReceipts.push({
					anchor: appended.anchor,
					message: appendedMessage
				});
			}
			if (appended.appended) nextAppendedUpdates.push({
				messageId,
				message: appendedMessage,
				...messageSeq !== void 0 ? { messageSeq } : {}
			});
			if (idempotencyKey) {
				mirrorFacts.existingIdempotencyKeys.add(idempotencyKey);
				if (appended.anchor) mirrorFacts.anchorsByIdempotencyKey.set(idempotencyKey, appended.anchor);
			}
		}
		return {
			appendedUpdates: nextAppendedUpdates,
			assistantMirrorIdentitiesOwned: [...nextAssistantMirrorIdentitiesOwned],
			anchorsByMirrorIdentity: nextAnchorsByMirrorIdentity,
			messagesPresent: nextMessagesPresent,
			userMessageReceipts: nextUserMessageReceipts,
			userMessagesPresent: nextUserMessagesPresent
		};
	});
	for (const update of appendedUpdates) try {
		await publishSessionTranscriptUpdateByIdentity({
			...transcriptTarget,
			update: {
				...params.agentId ? { agentId: params.agentId } : {},
				message: update.message,
				messageId: update.messageId,
				...update.messageSeq !== void 0 ? { messageSeq: update.messageSeq } : {},
				sessionKey: transcriptTarget.sessionKey
			}
		});
	} catch (error) {
		log.warn("failed to publish codex app-server transcript update", { error: formatErrorMessage(error) });
	}
	return {
		assistantMirrorIdentitiesOwned,
		anchorsByMirrorIdentity,
		messagesPresent,
		userMessageReceipts,
		userMessagesPresent
	};
}
const codexTranscriptMirrorRuntime = {
	mirror,
	mirrorBestEffort
};
function resolveCodexMirrorTranscriptTarget(params) {
	const sessionKey = params.sessionKey?.trim();
	const storePath = params.storePath?.trim();
	if (!sessionKey || !storePath) throw new Error("Codex transcript mirror requires a runtime session identity");
	return {
		...params.agentId ? { agentId: params.agentId } : {},
		sessionId: params.sessionId,
		sessionKey,
		storePath
	};
}
//#endregion
export { fingerprintCodexMirrorSourceMessage as a, projectBoundedCodexThreadHistory as c, promptSnapshot as d, mirrorPromptAtTurnStartBestEffort as i, projectBoundedCodexVisibleSessionHistory as l, createCodexAppServerUserMessagePersistenceNotifier as n, readCodexMirrorSourceFingerprint as o, importCodexThreadHistoryToTranscript as r, serializeCodexMirrorSourceEvidence as s, codexTranscriptMirrorRuntime as t, buildCodexUserPromptMessage as u };
