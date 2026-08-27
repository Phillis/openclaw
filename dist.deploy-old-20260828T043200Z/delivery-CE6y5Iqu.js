import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as logVerbose, t as danger } from "./globals-GZNLg1ns.js";
import { m as fireAndForgetHook, t as getGlobalHookRunner } from "./hook-runner-global-CWpWIBkz.js";
import "./channel-outbound-0oFCMpw9.js";
import { r as probeVideoDimensions } from "./media-services-B8MVUzbz.js";
import { f as normalizeMessagePresentation } from "./payload-C7E4iMOo.js";
import { d as toPluginMessageSentEvent, l as toPluginMessageContext, o as toInternalMessageSentContext, t as buildCanonicalSentMessageHookContext } from "./message-hook-mappers-B-Cf5qbE.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { n as loadWebMedia } from "./web-media-DSbBQ0o1.js";
import { a as projectOutboundPayloadPlanForDelivery, t as createOutboundPayloadPlan } from "./payloads-BNOW0uoZ.js";
import { n as createInternalHookEvent, u as triggerInternalHook } from "./internal-hooks--fsrYuTN.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./runtime-env-_YEv0JPQ.js";
import "./number-runtime-Cy4drVnh.js";
import { i as isChannelPartialDeliveryError } from "./delivery-result-BB-vQ7ul.js";
import "./reply-reference-CTh6ydO0.js";
import "./channel-inbound-BllqRtTK.js";
import "./web-media-Cxkh7M6r.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./media-runtime-qcekT37I.js";
import "./plugin-runtime-BgsiNjBF.js";
import "./hook-runtime-D2084Mq9.js";
import { c as resolveTelegramTargetChatType } from "./topic-conversation-Cl4csGES.js";
import { x as resolveTelegramReplyId } from "./helpers-nPengbaU.js";
import { k as buildInlineKeyboard, p as isTelegramEmptyContentError, r as TELEGRAM_RICH_TEXT_LIMIT } from "./text-chunk-limit-BGlmry9l.js";
import { r as resolveTelegramInlineButtons } from "./button-types-CUyypMIR.js";
import { n as resolveTelegramInteractiveTextFallback, t as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-B3sEsVpj.js";
import { L as reportTelegramProviderDelivery, O as reactMessageTelegram, R as recordSentMessage, _ as isTelegramVoiceMessagesForbiddenError, d as createTelegramPreparedSender, f as createTelegramReplyRequest, g as isTelegramCaptionTooLongError, h as resolveTelegramOutboundMediaSenders, m as prepareTelegramOutboundMedia, rt as buildTelegramSendParams, x as planTelegramTextDeliveryPages } from "./send-CWkHYtzo.js";
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
	const chunks = filterEmptyTelegramTextChunks(params.chunkText(params.text));
	const suppressReply = chunks.length > 1 && isSingleUseReplyToMode(params.replyToMode);
	return (await params.sender.sendText({
		pages: chunks,
		context: params.richMessages ? "sendRichMessage" : "sendMessage",
		tracking: {
			invalidate: () => params.progress.promptContext?.invalidate(),
			onRejected: (error) => params.runtime.error?.(danger(`telegram reply chunk rejected; continuing: ${formatErrorMessage(error)}`)),
			onSilentSkip: (error) => params.runtime.log?.(`telegram reply chunk rendered empty; skipping: ${formatErrorMessage(error)}`)
		},
		preparePage: (_index, acceptedPages) => {
			const first = acceptedPages === 0;
			const replyToMessageId = suppressReply ? void 0 : resolveReplyToForSend(params);
			const includeQuote = params.quoteOnlyOnFirstChunk !== true || first;
			const base = buildTelegramSendParams({
				replyToMessageId,
				replyQuoteMessageId: includeQuote ? params.replyQuoteMessageId : void 0,
				replyQuoteText: replyToMessageId && includeQuote ? params.replyQuoteText : void 0,
				replyQuotePosition: includeQuote ? params.replyQuotePosition : void 0,
				replyQuoteEntities: includeQuote ? params.replyQuoteEntities : void 0,
				thread: params.thread,
				silent: params.silent
			});
			return {
				requestParams: (fallback) => {
					const requestParams = { ...base };
					if (fallback?.index) {
						delete requestParams.reply_parameters;
						delete requestParams.reply_to_message_id;
					}
					return {
						...requestParams,
						...params.linkPreview === false ? { link_preview_options: { is_disabled: true } } : {},
						...first && params.replyMarkup && (!fallback || fallback.index === fallback.count - 1) ? { reply_markup: params.replyMarkup } : {}
					};
				},
				delivered: () => {
					markReplyApplied(params.progress, suppressReply && first ? params.replyToId : replyToMessageId);
					markDelivered(params.progress);
				}
			};
		},
		observe: async ({ result, messageId, plainText }) => {
			if (params.thread?.id !== void 0) await reportTelegramProviderDelivery({
				message: result,
				messageId,
				fallbackChatId: params.chatId,
				successfulSendThread: params.thread
			});
			params.runtime.log?.(`telegram text delivery ok chat=${params.chatId} message=${messageId}`);
			params.recordMessageId(messageId);
			await params.progress.promptContext?.accept({
				messageId,
				text: plainText
			});
		}
	}))[0]?.messageId;
}
function resolveVoiceFallbackText(reply) {
	if (reply.text?.trim()) return reply.text;
	if (reply.spokenText?.trim()) return reply.spokenText;
}
async function deliverMediaReply(params) {
	let firstDeliveredMessageId;
	let visibleFallbackText;
	let firstDeliveredCaption;
	const mediaUrls = [];
	const recordPromptContextMessage = async (message, text) => {
		const promptContextMessage = {
			messageId: message.message_id,
			message,
			...text ? { text } : {}
		};
		await params.progress.promptContext?.accept(promptContextMessage);
	};
	const deliverAcceptedMedia = async (options) => {
		const delivery = await params.sender.sendMedia(options);
		await params.sender.accept(delivery, async ({ result: message, messageId, plainText }) => {
			mediaUrls.push(options.mediaUrl);
			if (params.thread?.id !== void 0) await reportTelegramProviderDelivery({
				message,
				messageId,
				fallbackChatId: params.chatId,
				successfulSendThread: params.thread
			});
			firstDeliveredMessageId ??= messageId;
			firstDeliveredCaption ??= plainText || void 0;
			if (delivery.captionRemoved) visibleFallbackText = "";
			params.recordMessageId(messageId);
			await recordPromptContextMessage(message, plainText || void 0);
			markDelivered(params.progress);
		});
	};
	const createVoiceFallbackProgress = () => ({
		hasReplied: false,
		hasDelivered: false,
		deliveredCount: 0,
		...params.progress.promptContext ? { promptContext: params.progress.promptContext } : {}
	});
	for (const [index, mediaUrl] of params.mediaList.entries()) {
		const isFirstMedia = index === 0;
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
			const sendVoiceMedia = async (requestParams) => {
				const hasCaption = typeof requestParams.caption === "string";
				await deliverAcceptedMedia({
					sender: mediaSender,
					mediaUrl,
					requestParams,
					plainCaption: hasCaption ? plainCaption : void 0
				});
			};
			const sendVoiceFallbackText = async (text, options = {}) => await deliverTextReply({
				sender: params.sender,
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
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyMarkup: params.replyMarkup,
				replyToMode: options.replyToMode ?? params.replyToMode,
				progress: createVoiceFallbackProgress(),
				recordMessageId: params.recordMessageId,
				quoteOnlyOnFirstChunk: true
			});
			await params.onVoiceRecording?.();
			try {
				await sendVoiceMedia(mediaParams);
			} catch (voiceErr) {
				if (isChannelPartialDeliveryError(voiceErr)) throw voiceErr;
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
						if (isChannelPartialDeliveryError(fallbackError) || !isTelegramEmptyContentError(fallbackError)) throw fallbackError;
						visibleFallbackText = "";
					}
					markReplyApplied(params.progress, replyToMessageId);
					continue;
				}
				throw voiceErr;
			}
		} else await deliverAcceptedMedia({
			sender: mediaSender,
			documentSender,
			mediaUrl,
			requestParams: mediaParams,
			plainCaption
		});
		markReplyApplied(params.progress, replyToMessageId);
		if (followUpText) try {
			if (await deliverTextReply({
				sender: params.sender,
				chatId: params.chatId,
				runtime: params.runtime,
				thread: params.thread,
				chunkText: params.chunkText,
				text: followUpText,
				replyMarkup: params.replyMarkup,
				richMessages: params.richMessages,
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyToId: params.replyToId,
				replyToMode: params.replyToMode,
				progress: params.progress,
				recordMessageId: params.recordMessageId
			}) === void 0) visibleFallbackText = firstDeliveredCaption ?? "";
			else visibleFallbackText = void 0;
		} catch (error) {
			if (isChannelPartialDeliveryError(error) || !isTelegramEmptyContentError(error)) throw error;
			visibleFallbackText = firstDeliveredCaption ?? "";
			if (params.replyMarkup && firstDeliveredMessageId !== void 0) await params.bot.api.editMessageReplyMarkup(params.chatId, firstDeliveredMessageId, { reply_markup: params.replyMarkup });
		}
	}
	return {
		firstDeliveredMessageId,
		visibleFallbackText,
		mediaUrls
	};
}
async function maybePinFirstDeliveredMessage(params) {
	if (!(params.pin === true || typeof params.pin === "object" && params.pin.enabled) || typeof params.firstDeliveredMessageId !== "number") return;
	const notify = typeof params.pin === "object" && params.pin.notify === true;
	try {
		await params.bot.api.pinChatMessage(params.chatId, params.firstDeliveredMessageId, { disable_notification: !notify });
	} catch (err) {
		if (typeof params.pin === "object" && params.pin.required === true) throw err;
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
		const targetId = parseStrictPositiveInteger(telegramData?.reaction?.replyToId ?? replyToId);
		if (reactionEmoji && typeof targetId !== "number") {
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
		const sender = createTelegramPreparedSender({
			api: params.bot.api,
			chatId: params.chatId,
			request: createTelegramReplyRequest(params.runtime),
			warn: (message) => params.runtime.log?.(message),
			beforeTextPage: params.onPlatformSendDispatch,
			beforeMedia: params.onPlatformSendDispatch
		});
		try {
			const deliveredCountBeforeReply = progress.deliveredCount;
			const replyMarkup = buildInlineKeyboard(resolveTelegramInlineButtons({
				buttons: telegramData?.buttons,
				presentation,
				interactive
			}));
			let firstDeliveredMessageId;
			let deliveredMediaUrls = [];
			if (reactionEmoji && typeof targetId === "number") {
				await params.onPlatformSendDispatch?.();
				const reactionResult = await reactMessageTelegram(params.chatId, targetId, reactionEmoji, {
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
				sender,
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
				linkPreview: params.linkPreview,
				silent: params.silent,
				replyToId,
				replyToMode: params.replyToMode,
				progress,
				recordMessageId
			});
			else if (mediaList.length > 0) {
				const mediaDelivery = await deliverMediaReply({
					sender,
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
					...params.textMode ? { textMode: params.textMode } : {}
				});
				firstDeliveredMessageId = mediaDelivery.firstDeliveredMessageId;
				deliveredMediaUrls = mediaDelivery.mediaUrls;
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
				mediaUrls: deliveredMediaUrls
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
			sender.fail(error);
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
