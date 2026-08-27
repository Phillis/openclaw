import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { r as logVerbose, t as danger } from "./globals-CAwGc4B6.js";
import { t as getGlobalHookRunner, v as fireAndForgetHook } from "./hook-runner-global-IYtayVps.js";
import "./channel-outbound-CEvoxZOx.js";
import { r as probeVideoDimensions } from "./media-services-BMidrwE0.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { f as normalizeMessagePresentation } from "./payload-ByplrRCQ.js";
import { a as projectOutboundPayloadPlanForDelivery, t as createOutboundPayloadPlan } from "./payloads-YIMlWZ2P.js";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-CWlKliqU.js";
import { n as loadWebMedia } from "./web-media-Dk8VJTPc.js";
import { m as triggerInternalHook, n as createInternalHookEvent } from "./internal-hooks-BpKpSmtD.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./runtime-env-COkbgBI4.js";
import { b as rethrowTelegramSendError, x as shouldRetryTelegramSendError } from "./fetch-C7ph-do8.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-C4xi4B3U.js";
import "./retry-runtime-ELyDVNAC.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./media-runtime-OD8vPDOE.js";
import "./plugin-runtime-y631yGCG.js";
import "./reply-reference-cJj4KEHq.js";
import "./web-media-C_Sfgi4B.js";
import "./hook-runtime-DTNKCMJk.js";
import { o as resolveTelegramTargetChatType } from "./targets-BwGEq2w-.js";
import { x as resolveTelegramReplyId } from "./helpers-BTKRhXg2.js";
import { n as resolveTelegramInlineButtons } from "./button-types-Cj36lNP0.js";
import { c as buildInlineKeyboard } from "./prompt-context-projection-B85u-zfc.js";
import { n as resolveTelegramInteractiveTextFallback, t as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-C6hMXn-W.js";
import { $ as recordSentMessage, C as isTelegramVoiceMessagesForbiddenError, D as deliverTelegramTextPage, I as isTelegramEmptyContentError, L as isTelegramHtmlParseError, M as getTelegramRichRawApi, N as removeTelegramRichNativeQuoteParam, O as planTelegramTextDeliveryPages, P as toTelegramRichMessageContextParams, Q as reportTelegramProviderDelivery, S as isTelegramPhotoLimitError, St as isTelegramQuoteParamError, Y as reactMessageTelegram, _ as prepareTelegramOutboundMedia, b as sendTelegramOutboundMediaWithPhotoFallback, bt as buildTelegramSendParams, g as mergeTelegramPartialDeliveryError, h as createTelegramChunkDeliveryTracker, k as TELEGRAM_RICH_TEXT_LIMIT, v as resolveTelegramOutboundMediaSenders, vt as withTelegramNativeQuoteFallback, x as isTelegramCaptionTooLongError, xt as getTelegramNativeQuoteReplyMessageId, y as sendTelegramCaptionedMediaWithFallback, yt as TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS } from "./send-6bnUJ0aR.js";
import { t as withTelegramApiErrorLogging } from "./api-logging-D0ier0vg.js";
//#region extensions/telegram/src/bot/delivery.send.ts
function createTelegramDeliverySendRetry() {
	return createChannelApiRetryRunner({
		shouldRetry: shouldRetryTelegramSendError,
		strictShouldRetry: true,
		retryAfterMaxDelayMs: TELEGRAM_OUTBOUND_RETRY_AFTER_CAP_MS
	});
}
async function sendTelegramWithThreadFallback(params) {
	const requestWithRetry = createTelegramDeliverySendRetry();
	const { result } = await withTelegramNativeQuoteFallback({
		label: params.operation,
		requestParams: params.requestParams,
		removeNativeQuoteParam: params.removeNativeQuoteParam,
		request: (requestParams, operation) => withTelegramApiErrorLogging({
			operation,
			runtime: params.runtime,
			shouldLog: (error) => (params.shouldLog?.(error) ?? true) && !(getTelegramNativeQuoteReplyMessageId(requestParams) && isTelegramQuoteParamError(error)),
			fn: () => requestWithRetry(() => params.send(requestParams), operation)
		}).catch(rethrowTelegramSendError)
	});
	return result;
}
async function sendTelegramText(bot, chatId, text, runtime, opts) {
	const baseParams = buildTelegramSendParams({
		replyToMessageId: opts?.replyToMessageId,
		replyQuoteMessageId: opts?.replyQuoteMessageId,
		replyQuoteText: opts?.replyQuoteText,
		replyQuotePosition: opts?.replyQuotePosition,
		replyQuoteEntities: opts?.replyQuoteEntities,
		thread: opts?.thread,
		silent: opts?.silent
	});
	const fallbackText = opts?.plainText ?? text;
	const acceptProviderMessage = async (message) => {
		if (opts?.thread?.id !== void 0) await reportTelegramProviderDelivery({
			message,
			messageId: message.message_id,
			fallbackChatId: chatId,
			successfulSendThread: opts.thread
		});
		return message.message_id;
	};
	const page = planTelegramTextDeliveryPages({
		text,
		maxChars: text.length || 1,
		tableMode: opts?.tableMode,
		richMessages: opts?.richMessages,
		richMessage: opts?.richMessage,
		degradationReasons: opts?.richDegradationReasons,
		skipEntityDetection: opts?.linkPreview === false,
		...opts?.textMode === "html" ? { textMode: "html" } : {}
	})[0];
	if (!page || !page.richMessage && !page.htmlText?.trim() && !fallbackText.trim()) throw new Error("telegram text delivery failed: empty formatted text and empty plain fallback");
	page.plainText = fallbackText;
	const linkPreviewOptions = opts?.linkPreview === false ? { is_disabled: true } : void 0;
	const withoutReply = (requestParams) => {
		const next = { ...requestParams };
		delete next.reply_parameters;
		delete next.reply_to_message_id;
		return next;
	};
	const sendPlainOrHtml = async (messageText, params) => {
		const requestParams = params.fallback && params.fallback.index > 0 ? withoutReply(baseParams) : baseParams;
		const isFinalFallback = !params.fallback || params.fallback.index === params.fallback.count - 1;
		return await sendTelegramWithThreadFallback({
			operation: params.operation ?? "sendMessage",
			runtime,
			requestParams,
			shouldLog: (error) => !isTelegramHtmlParseError(error) && !isTelegramEmptyContentError(error),
			send: (effectiveParams) => bot.api.sendMessage(chatId, messageText, {
				...params.html ? { parse_mode: "HTML" } : {},
				...linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
				...isFinalFallback && opts?.replyMarkup ? { reply_markup: opts.replyMarkup } : {},
				...effectiveParams
			})
		});
	};
	const delivered = await deliverTelegramTextPage({
		page,
		context: page.richMessage ? "sendRichMessage" : "sendMessage",
		warn: (message) => runtime.log?.(message),
		sender: {
			sendPlain: (plainText, fallback, label) => sendPlainOrHtml(plainText, {
				html: false,
				...fallback ? { fallback } : {},
				...label ? { operation: label } : {}
			}),
			sendHtml: (htmlText) => sendPlainOrHtml(htmlText, { html: true }),
			sendRich: (richMessage) => sendTelegramWithThreadFallback({
				operation: "sendRichMessage",
				runtime,
				requestParams: toTelegramRichMessageContextParams(baseParams),
				removeNativeQuoteParam: removeTelegramRichNativeQuoteParam,
				send: (effectiveParams) => getTelegramRichRawApi(bot.api).sendRichMessage({
					chat_id: chatId,
					rich_message: richMessage,
					...opts?.replyMarkup ? { reply_markup: opts.replyMarkup } : {},
					...effectiveParams
				})
			})
		}
	});
	let firstDeliveredMessageId;
	for (const accepted of delivered) {
		const messageId = await acceptProviderMessage(accepted.result);
		firstDeliveredMessageId ??= messageId;
		runtime.log?.(`telegram text delivery ok chat=${chatId} message=${messageId}`);
		await opts?.onAcceptedMessage?.(messageId, accepted.page.plainText);
	}
	return firstDeliveredMessageId;
}
//#endregion
//#region extensions/telegram/src/bot/delivery.replies.ts
function markDelivered(progress) {
	progress.hasDelivered = true;
	progress.deliveredCount += 1;
}
function resolveReplyToForSend(params) {
	return params.replyToId && (params.replyToMode === "all" || !params.progress.hasReplied) ? params.replyToId : void 0;
}
function markReplyApplied(progress, replyToId) {
	if (replyToId && !progress.hasReplied) progress.hasReplied = true;
}
function filterEmptyTelegramTextChunks(chunks) {
	return chunks.filter((chunk) => chunk.richMessage?.blocks.length || chunk.htmlText?.trim() || chunk.plainText.trim());
}
function resolveReplyQuoteForSend(params) {
	if (params.replyToId != null) {
		const mapped = params.replyQuoteByMessageId?.[String(params.replyToId)];
		if (mapped?.text) {
			const quote = {
				messageId: params.replyToId,
				text: mapped.text
			};
			if (typeof mapped.position === "number") quote.position = mapped.position;
			if (mapped.entities) quote.entities = mapped.entities;
			return quote;
		}
	}
	const quote = {};
	if (params.replyQuoteMessageId != null) quote.messageId = params.replyQuoteMessageId;
	if (params.replyQuoteText != null) quote.text = params.replyQuoteText;
	if (params.replyQuotePosition != null) quote.position = params.replyQuotePosition;
	if (params.replyQuoteEntities != null) quote.entities = params.replyQuoteEntities;
	return quote;
}
async function deliverTextReply(params) {
	let firstDeliveredMessageId;
	const chunks = filterEmptyTelegramTextChunks(params.chunkText(params.text));
	const messageIds = [];
	const tracker = createTelegramChunkDeliveryTracker({
		invalidate: () => params.progress.promptContext?.invalidate(),
		onRejected: (error) => params.runtime.error?.(danger(`telegram reply chunk rejected; continuing: ${formatErrorMessage(error)}`)),
		isSilentSkip: isTelegramEmptyContentError,
		onSilentSkip: (error) => params.runtime.log?.(`telegram reply chunk rendered empty; skipping: ${formatErrorMessage(error)}`),
		partialDeliveryResult: () => ({
			messageIds: [...messageIds],
			visibleReplySent: true
		})
	});
	const suppressReply = chunks.length > 1 && isSingleUseReplyToMode(params.replyToMode);
	let hasAcceptedChunk = false;
	for (const chunk of chunks) {
		const first = !hasAcceptedChunk;
		const replyToMessageId = suppressReply ? void 0 : resolveReplyToForSend(params);
		const includeQuote = params.quoteOnlyOnFirstChunk !== true || first;
		try {
			await params.onPlatformSendDispatch?.();
			await sendTelegramText(params.bot, params.chatId, chunk.htmlText ?? chunk.plainText, params.runtime, {
				replyToMessageId,
				replyQuoteMessageId: includeQuote ? params.replyQuoteMessageId : void 0,
				replyQuoteText: replyToMessageId && includeQuote ? params.replyQuoteText : void 0,
				replyQuotePosition: includeQuote ? params.replyQuotePosition : void 0,
				replyQuoteEntities: includeQuote ? params.replyQuoteEntities : void 0,
				thread: params.thread,
				textMode: chunk.htmlText ? "html" : "markdown",
				plainText: chunk.plainText,
				richMessages: params.richMessages,
				richMessage: chunk.richMessage,
				richDegradationReasons: chunk.degradationReasons,
				linkPreview: params.linkPreview,
				tableMode: params.tableMode,
				silent: params.silent,
				replyMarkup: first ? params.replyMarkup : void 0,
				onAcceptedMessage: async (messageId, plainText) => {
					messageIds.push(String(messageId));
					await tracker.recordAccepted(messageId, async () => {
						firstDeliveredMessageId ??= messageId;
						params.recordMessageId(messageId);
						await params.progress.promptContext?.accept({
							messageId,
							text: plainText
						});
					});
				}
			});
		} catch (error) {
			tracker.reject(error);
			continue;
		}
		hasAcceptedChunk = true;
		markReplyApplied(params.progress, suppressReply && first ? params.replyToId : replyToMessageId);
		markDelivered(params.progress);
	}
	tracker.finish();
	return firstDeliveredMessageId;
}
function resolveVoiceFallbackText(reply) {
	if (reply.text?.trim()) return reply.text;
	if (reply.spokenText?.trim()) return reply.spokenText;
}
async function deliverMediaReply(params) {
	let firstDeliveredMessageId;
	let visibleFallbackText;
	let firstDeliveredCaption;
	const deliveredMediaMessageIds = [];
	let first = true;
	let pendingFollowUpText;
	const recordPromptContextMessage = async (message, text) => {
		const promptContextMessage = {
			messageId: message.message_id,
			message,
			...text ? { text } : {}
		};
		await params.progress.promptContext?.accept(promptContextMessage);
	};
	const deliverAcceptedMedia = async (options) => {
		await params.onPlatformSendDispatch?.();
		const delivery = await sendTelegramCaptionedMediaWithFallback({
			operation: options.sender.operation,
			requestParams: options.requestParams,
			plainCaption: options.plainCaption,
			shouldLog: options.shouldLog,
			send: (requestParams, shouldLog) => sendTelegramWithThreadFallback({
				operation: options.sender.operation,
				runtime: params.runtime,
				requestParams,
				...shouldLog ? { shouldLog } : {},
				send: options.sender.send
			})
		});
		const message = delivery.result;
		if (params.thread?.id !== void 0) try {
			await reportTelegramProviderDelivery({
				message,
				messageId: message.message_id,
				fallbackChatId: params.chatId,
				successfulSendThread: params.thread
			});
		} catch (error) {
			throw mergeTelegramPartialDeliveryError(error, {
				messageIds: deliveredMediaMessageIds,
				visibleReplySent: true
			});
		}
		firstDeliveredMessageId ??= message.message_id;
		firstDeliveredCaption ??= delivery.deliveredCaption;
		if (delivery.captionRemoved) visibleFallbackText = "";
		deliveredMediaMessageIds.push(String(message.message_id));
		params.recordMessageId(message.message_id);
		await recordPromptContextMessage(message, delivery.deliveredCaption);
		markDelivered(params.progress);
	};
	const throwMediaPartial = (error) => {
		throw mergeTelegramPartialDeliveryError(error, {
			messageIds: deliveredMediaMessageIds,
			visibleReplySent: true
		});
	};
	const createVoiceFallbackProgress = () => ({
		hasReplied: false,
		hasDelivered: false,
		deliveredCount: 0,
		...params.progress.promptContext ? { promptContext: params.progress.promptContext } : {}
	});
	for (const mediaUrl of params.mediaList) {
		const isFirstMedia = first;
		const media = await params.mediaLoader(mediaUrl, buildOutboundMediaLoadOptions({
			mediaLocalRoots: params.mediaLocalRoots,
			maxBytes: params.mediaMaxBytes
		}));
		const mediaPlan = prepareTelegramOutboundMedia({
			media,
			text: isFirstMedia ? params.reply.text ?? void 0 : void 0,
			textMode: params.textMode,
			tableMode: params.tableMode,
			preparedHtml: true
		});
		const { sender: mediaSender, documentSender } = resolveTelegramOutboundMediaSenders({
			api: params.bot.api,
			chatId: params.chatId,
			media,
			plan: mediaPlan,
			asVoice: params.reply.audioAsVoice
		});
		const { htmlCaption, plainCaption, followUpText } = mediaPlan;
		if (followUpText) pendingFollowUpText = followUpText;
		first = false;
		const replyToMessageId = resolveReplyToForSend({
			replyToId: params.replyToId,
			replyToMode: params.replyToMode,
			progress: params.progress
		});
		const shouldAttachButtonsToMedia = isFirstMedia && params.replyMarkup && !followUpText;
		const videoDimensions = mediaPlan.kind === "video" ? await probeVideoDimensions(media.buffer) : void 0;
		const mediaParams = {
			caption: htmlCaption,
			...htmlCaption ? { parse_mode: "HTML" } : {},
			...shouldAttachButtonsToMedia ? { reply_markup: params.replyMarkup } : {},
			...videoDimensions ? {
				width: videoDimensions.width,
				height: videoDimensions.height
			} : {},
			...buildTelegramSendParams({
				replyToMessageId,
				replyQuoteMessageId: params.replyQuoteMessageId,
				replyQuoteText: params.replyQuoteText,
				replyQuotePosition: params.replyQuotePosition,
				replyQuoteEntities: params.replyQuoteEntities,
				thread: params.thread,
				silent: params.silent
			})
		};
		if (mediaSender.label === "voice") {
			const sendVoiceMedia = async (requestParams, shouldLog) => {
				const hasCaption = typeof requestParams.caption === "string";
				await deliverAcceptedMedia({
					sender: mediaSender,
					requestParams,
					plainCaption: hasCaption ? plainCaption : void 0,
					shouldLog
				});
			};
			const sendVoiceFallbackText = async (text, options = {}) => await deliverTextReply({
				bot: params.bot,
				chatId: params.chatId,
				runtime: params.runtime,
				text,
				chunkText: params.chunkText,
				replyToId: options.replyToId,
				...options.includeQuote ? {
					replyQuoteMessageId: params.replyQuoteMessageId,
					replyQuotePosition: params.replyQuotePosition,
					replyQuoteEntities: params.replyQuoteEntities,
					replyQuoteText: params.replyQuoteText
				} : {},
				thread: params.thread,
				richMessages: params.richMessages,
				tableMode: params.tableMode,
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyMarkup: params.replyMarkup,
				replyToMode: options.replyToMode ?? params.replyToMode,
				progress: createVoiceFallbackProgress(),
				recordMessageId: params.recordMessageId,
				quoteOnlyOnFirstChunk: true,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			await params.onVoiceRecording?.();
			try {
				await sendVoiceMedia(mediaParams, (err) => !isTelegramVoiceMessagesForbiddenError(err));
			} catch (voiceErr) {
				if (isTelegramVoiceMessagesForbiddenError(voiceErr)) {
					const fallbackText = resolveVoiceFallbackText(params.reply);
					if (!fallbackText || !fallbackText.trim()) throw voiceErr;
					logVerbose("telegram sendVoice forbidden (recipient has voice messages blocked in privacy settings); falling back to text");
					const voiceFallbackReplyTo = resolveReplyToForSend({
						replyToId: params.replyToId,
						replyToMode: params.replyToMode,
						progress: params.progress
					});
					const fallbackMessageId = await sendVoiceFallbackText(fallbackText, {
						replyToId: voiceFallbackReplyTo,
						includeQuote: true
					});
					if (fallbackMessageId === void 0) throw voiceErr;
					firstDeliveredMessageId ??= fallbackMessageId;
					visibleFallbackText = fallbackText;
					markReplyApplied(params.progress, voiceFallbackReplyTo);
					markDelivered(params.progress);
					continue;
				}
				if (isTelegramCaptionTooLongError(voiceErr)) {
					logVerbose("telegram sendVoice caption too long; resending voice without caption + text separately");
					const noCaptionParams = { ...mediaParams };
					delete noCaptionParams.caption;
					delete noCaptionParams.parse_mode;
					await sendVoiceMedia(noCaptionParams);
					const fallbackText = resolveVoiceFallbackText(params.reply);
					if (fallbackText?.trim()) try {
						if (await sendVoiceFallbackText(fallbackText, { replyToMode: "first" }) !== void 0) visibleFallbackText = fallbackText;
					} catch (fallbackError) {
						if (!isTelegramEmptyContentError(fallbackError)) throw fallbackError;
						visibleFallbackText = "";
					}
					markReplyApplied(params.progress, replyToMessageId);
					continue;
				}
				throw voiceErr;
			}
		} else await sendTelegramOutboundMediaWithPhotoFallback({
			sender: mediaSender,
			documentSender,
			send: (sender) => deliverAcceptedMedia({
				sender,
				requestParams: mediaParams,
				plainCaption,
				...sender.label === "photo" ? { shouldLog: (error) => !isTelegramPhotoLimitError(error) } : {}
			})
		});
		markReplyApplied(params.progress, replyToMessageId);
		if (pendingFollowUpText && isFirstMedia) {
			try {
				if (await deliverTextReply({
					bot: params.bot,
					chatId: params.chatId,
					runtime: params.runtime,
					thread: params.thread,
					chunkText: params.chunkText,
					text: pendingFollowUpText,
					replyMarkup: params.replyMarkup,
					richMessages: params.richMessages,
					tableMode: params.tableMode,
					linkPreview: params.linkPreview,
					silent: params.silent,
					replyToId: params.replyToId,
					replyToMode: params.replyToMode,
					progress: params.progress,
					recordMessageId: params.recordMessageId,
					onPlatformSendDispatch: params.onPlatformSendDispatch
				}) === void 0) visibleFallbackText = firstDeliveredCaption ?? "";
				else visibleFallbackText = void 0;
			} catch (error) {
				if (!isTelegramEmptyContentError(error)) throwMediaPartial(error);
				visibleFallbackText = firstDeliveredCaption ?? "";
				if (params.replyMarkup && firstDeliveredMessageId !== void 0) try {
					await params.bot.api.editMessageReplyMarkup(params.chatId, firstDeliveredMessageId, { reply_markup: params.replyMarkup });
				} catch (keyboardError) {
					throwMediaPartial(keyboardError);
				}
			}
			pendingFollowUpText = void 0;
		}
	}
	return {
		firstDeliveredMessageId,
		visibleFallbackText
	};
}
async function maybePinFirstDeliveredMessage(params) {
	if (!(params.pin === true || typeof params.pin === "object" && params.pin.enabled) || typeof params.firstDeliveredMessageId !== "number") return;
	const notify = typeof params.pin === "object" && params.pin.notify === true;
	try {
		await params.bot.api.pinChatMessage(params.chatId, params.firstDeliveredMessageId, { disable_notification: !notify });
	} catch (err) {
		logVerbose(`telegram pinChatMessage failed chat=${params.chatId} message=${params.firstDeliveredMessageId}: ${formatErrorMessage(err)}`);
	}
}
function buildTelegramSentHookContext(params) {
	return buildCanonicalSentMessageHookContext({
		to: params.chatId,
		content: params.content,
		success: params.success,
		error: params.error,
		channelId: "telegram",
		accountId: params.accountId,
		conversationId: params.chatId,
		messageId: typeof params.messageId === "number" ? String(params.messageId) : void 0,
		isGroup: params.isGroup,
		groupId: params.groupId
	});
}
function emitInternalMessageSentHook(params) {
	if (!params.sessionKeyForInternalHooks) return;
	const canonical = buildTelegramSentHookContext(params);
	fireAndForgetHook(triggerInternalHook(createInternalHookEvent("message", "sent", params.sessionKeyForInternalHooks, toInternalMessageSentContext(canonical))), "telegram: message:sent internal hook failed");
}
function emitMessageSentHooks(params) {
	if (!params.enabled && !params.sessionKeyForInternalHooks) return;
	const canonical = buildTelegramSentHookContext(params);
	if (params.enabled) fireAndForgetHook(Promise.resolve(params.hookRunner.runMessageSent(toPluginMessageSentEvent(canonical), toPluginMessageContext(canonical))), "telegram: message_sent plugin hook failed");
	emitInternalMessageSentHook(params);
}
function emitTelegramMessageSentHooks(params) {
	const hookRunner = getGlobalHookRunner();
	emitMessageSentHooks({
		...params,
		hookRunner,
		enabled: hookRunner?.hasHooks("message_sent") ?? false
	});
}
async function deliverReplies(params) {
	const progress = {
		hasReplied: false,
		hasDelivered: false,
		deliveredCount: 0,
		...params.promptContextSequence ? { promptContext: params.promptContextSequence } : {}
	};
	const recordMessageId = (messageId) => {
		if (params.accountId || params.ownerAgentId) {
			recordSentMessage(params.chatId, messageId, params.cfg, {
				accountId: params.accountId,
				agentId: params.ownerAgentId
			});
			return;
		}
		recordSentMessage(params.chatId, messageId, params.cfg);
	};
	const mediaLoader = params.mediaLoader ?? loadWebMedia;
	const transcriptMirror = params.transcriptMirror;
	const deliveredContents = [];
	const hookRunner = getGlobalHookRunner();
	const hasMessageSendingHooks = hookRunner?.hasHooks("message_sending") ?? false;
	const hasMessageSentHooks = hookRunner?.hasHooks("message_sent") ?? false;
	const chunkText = (text) => planTelegramTextDeliveryPages({
		text,
		maxChars: params.richMessages === true ? Math.min(params.textLimit, TELEGRAM_RICH_TEXT_LIMIT) : Math.min(params.textLimit, 4e3),
		chunkMode: params.chunkMode ?? "length",
		tableMode: params.tableMode,
		richMessages: params.richMessages,
		skipEntityDetection: params.linkPreview === false,
		...params.textMode ? { textMode: params.textMode } : {}
	});
	const candidateReplies = [];
	for (const reply of params.replies) {
		if (!reply || typeof reply !== "object") {
			params.runtime.error?.(danger("reply missing text/media"));
			continue;
		}
		candidateReplies.push(reply);
	}
	const normalizedReplies = projectOutboundPayloadPlanForDelivery(createOutboundPayloadPlan(candidateReplies, {
		cfg: params.cfg,
		sessionKey: params.policySessionKey ?? params.sessionKeyForInternalHooks,
		surface: "telegram"
	}));
	for (const originalReply of normalizedReplies) {
		let reply = canonicalizeTelegramPresentationPayload(originalReply, {
			allowWebAppButtons: resolveTelegramTargetChatType(params.chatId) === "direct",
			richTables: params.richMessages === true && params.textMode !== "html"
		});
		const mediaList = reply?.mediaUrls?.length ? reply.mediaUrls : reply?.mediaUrl ? [reply.mediaUrl] : [];
		const hasMedia = mediaList.length > 0;
		const presentation = normalizeMessagePresentation(reply?.presentation);
		const interactive = reply?.interactive;
		const resolvedReplyText = resolveTelegramInteractiveTextFallback({
			text: reply?.text,
			interactive,
			presentation
		}) ?? reply?.text ?? "";
		if (reply && resolvedReplyText !== (reply.text ?? "")) reply = {
			...reply,
			text: resolvedReplyText
		};
		const telegramData = reply.channelData?.telegram;
		const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
		const replyToId = params.replyToMode === "off" ? void 0 : resolveTelegramReplyId(reply.replyToId);
		if (reactionEmoji && typeof replyToId !== "number") {
			params.runtime.error?.(danger("Telegram reaction requires a reply target"));
			continue;
		}
		if (!resolvedReplyText && !hasMedia && !reactionEmoji) {
			if (reply?.audioAsVoice) {
				logVerbose("telegram reply has audioAsVoice without media/text; skipping");
				continue;
			}
			params.runtime.error?.(danger("reply missing text/media"));
			continue;
		}
		const rawContent = resolvedReplyText;
		const spokenHookContent = !rawContent && reply.audioAsVoice === true && reply.spokenText?.trim() ? reply.spokenText : void 0;
		const hookContent = spokenHookContent ?? rawContent;
		const replyQuote = resolveReplyQuoteForSend({
			replyToId,
			replyQuoteByMessageId: params.replyQuoteByMessageId,
			replyQuoteMessageId: params.replyQuoteMessageId,
			replyQuoteText: params.replyQuoteText,
			replyQuotePosition: params.replyQuotePosition,
			replyQuoteEntities: params.replyQuoteEntities
		});
		if (hasMessageSendingHooks) {
			const hookResult = await hookRunner?.runMessageSending({
				to: params.chatId,
				content: hookContent,
				replyToId,
				threadId: params.thread?.id,
				metadata: {
					channel: "telegram",
					mediaUrls: mediaList,
					threadId: params.thread?.id
				}
			}, {
				channelId: "telegram",
				accountId: params.accountId,
				conversationId: params.chatId
			});
			if (hookResult?.cancel) continue;
			if (typeof hookResult?.content === "string" && hookResult.content !== hookContent) {
				progress.promptContext?.detach();
				reply = spokenHookContent ? {
					...reply,
					spokenText: hookResult.content
				} : {
					...reply,
					text: hookResult.content
				};
			}
		}
		let contentForSentHook = reply.text || (reply.audioAsVoice === true ? resolveVoiceFallbackText(reply) : "") || "";
		try {
			const deliveredCountBeforeReply = progress.deliveredCount;
			const replyMarkup = buildInlineKeyboard(resolveTelegramInlineButtons({
				buttons: telegramData?.buttons,
				presentation,
				interactive
			}));
			let firstDeliveredMessageId;
			if (reactionEmoji && typeof replyToId === "number") {
				await params.onPlatformSendDispatch?.();
				const reactionResult = await reactMessageTelegram(params.chatId, replyToId, reactionEmoji, {
					cfg: params.cfg ?? { channels: { telegram: { botToken: params.token } } },
					token: params.token,
					accountId: params.accountId,
					api: params.bot.api,
					verbose: false
				});
				if (reactionResult.ok) {
					progress.hasDelivered = true;
					progress.deliveredCount += 1;
				} else {
					params.runtime.error?.(danger(reactionResult.warning));
					continue;
				}
			}
			if (mediaList.length === 0 && resolvedReplyText) firstDeliveredMessageId = await deliverTextReply({
				bot: params.bot,
				chatId: params.chatId,
				runtime: params.runtime,
				thread: params.thread,
				chunkText,
				text: reply.text || "",
				replyMarkup,
				replyQuoteMessageId: replyQuote.messageId,
				replyQuoteText: replyQuote.text,
				replyQuotePosition: replyQuote.position,
				replyQuoteEntities: replyQuote.entities,
				richMessages: params.richMessages,
				tableMode: params.tableMode,
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyToId,
				replyToMode: params.replyToMode,
				progress,
				recordMessageId,
				onPlatformSendDispatch: params.onPlatformSendDispatch
			});
			else if (mediaList.length > 0) {
				const mediaDelivery = await deliverMediaReply({
					reply,
					mediaList,
					bot: params.bot,
					chatId: params.chatId,
					runtime: params.runtime,
					thread: params.thread,
					tableMode: params.tableMode,
					richMessages: params.richMessages,
					mediaLocalRoots: params.mediaLocalRoots,
					mediaMaxBytes: params.mediaMaxBytes,
					chunkText,
					mediaLoader,
					onVoiceRecording: params.onVoiceRecording,
					linkPreview: params.linkPreview,
					silent: params.silent,
					replyQuoteMessageId: replyQuote.messageId,
					replyQuoteText: replyQuote.text,
					replyQuotePosition: replyQuote.position,
					replyQuoteEntities: replyQuote.entities,
					replyMarkup,
					replyToId,
					replyToMode: params.replyToMode,
					progress,
					recordMessageId,
					onPlatformSendDispatch: params.onPlatformSendDispatch,
					...params.textMode ? { textMode: params.textMode } : {}
				});
				firstDeliveredMessageId = mediaDelivery.firstDeliveredMessageId;
				if (mediaDelivery.visibleFallbackText !== void 0) contentForSentHook = mediaDelivery.visibleFallbackText;
			}
			await maybePinFirstDeliveredMessage({
				pin: reply.delivery?.pin,
				bot: params.bot,
				chatId: params.chatId,
				runtime: params.runtime,
				firstDeliveredMessageId
			});
			if (progress.deliveredCount > deliveredCountBeforeReply && transcriptMirror) deliveredContents.push({
				text: contentForSentHook,
				mediaUrls: mediaList
			});
			emitMessageSentHooks({
				hookRunner,
				enabled: hasMessageSentHooks,
				sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
				chatId: params.chatId,
				accountId: params.accountId,
				content: contentForSentHook,
				success: progress.deliveredCount > deliveredCountBeforeReply,
				messageId: firstDeliveredMessageId,
				isGroup: params.mirrorIsGroup,
				groupId: params.mirrorGroupId
			});
		} catch (error) {
			emitMessageSentHooks({
				hookRunner,
				enabled: hasMessageSentHooks,
				sessionKeyForInternalHooks: params.sessionKeyForInternalHooks,
				chatId: params.chatId,
				accountId: params.accountId,
				content: contentForSentHook,
				success: false,
				error: formatErrorMessage(error),
				isGroup: params.mirrorIsGroup,
				groupId: params.mirrorGroupId
			});
			throw error;
		}
	}
	if (progress.hasDelivered && transcriptMirror) {
		const text = deliveredContents.map((content) => content.text).filter(Boolean).join("\n\n");
		const mediaUrls = deliveredContents.flatMap((content) => content.mediaUrls);
		if (text || mediaUrls.length > 0) try {
			await transcriptMirror({
				text: text || void 0,
				mediaUrls: mediaUrls.length > 0 ? mediaUrls : void 0
			});
		} catch (mirrorErr) {
			logVerbose(`telegram transcriptMirror failed: ${formatErrorMessage(mirrorErr)}`);
		}
	}
	return { delivered: progress.hasDelivered };
}
//#endregion
export { emitTelegramMessageSentHooks as n, deliverReplies as t };
