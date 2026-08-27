import "./channel-outbound-BbXJ4rch.js";
import { n as sanitizeAssistantVisibleText } from "./assistant-visible-text-DkdYrwAv.js";
import { m as sendPayloadMediaSequenceOrFallback } from "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import { n as isSingleUseReplyToMode } from "./reply-reference-cLEWJ7Kr.js";
import { i as chunkMarkdownTextWithMode } from "./chunk-D68NbSMe.js";
import "./text-chunking-BrrQ2GHk.js";
import { t as sanitizeForPlainText } from "./sanitize-text-Bi875rMK.js";
import { n as questionGatewayRuntime } from "./question-gateway-runtime-DpIEGi7Z.js";
import "./reply-reference-CQJ9vRXG.js";
import "./reply-chunking-CHD0FVKS.js";
import { n as resolveOutboundSendDep } from "./send-deps-DjbvQHZ4.js";
import { i as createAttachedChannelResultAdapter, t as attachChannelToResult } from "./channel-send-result-BFAnsv6z.js";
import { t as mergeTelegramAccountConfig } from "./account-config-BFn1GzoB.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-DdRrFets.js";
import { a as parseTelegramTarget, i as normalizeTelegramOutboundTarget } from "./targets-BwGEq2w-.js";
import { i as parseTelegramThreadId, r as parseTelegramReplyToMessageId } from "./outbound-params-B_YGyvIG.js";
import { J as splitTelegramHtmlChunks } from "./helpers-C45a6bkW.js";
import { n as resolveTelegramInlineButtons } from "./button-types-BrwbkdaT.js";
import { o as resolveTelegramPromptContextSource, t as createTelegramPromptContextProjectionCursor } from "./prompt-context-projection-B85u-zfc.js";
import { n as resolveTelegramInteractiveTextFallback, r as resolveTelegramPresentationCapabilities, t as canonicalizeTelegramPresentationPayload } from "./interactive-fallback-D8zHGNs2.js";
import { t as loadTelegramSendModule } from "./send-runtime-C2-lhbm3.js";
//#region extensions/telegram/src/outbound-adapter.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
const TELEGRAM_POLL_OPTION_LIMIT = 12;
async function resolveDefaultTelegramSend(deps) {
	return resolveOutboundSendDep(deps, "telegram") ?? (await loadTelegramSendModule()).sendMessageTelegram;
}
function chunkTelegramOutboundText(text, limit, ctx) {
	return ctx?.formatting?.parseMode === "HTML" ? splitTelegramHtmlChunks(text, limit) : chunkMarkdownTextWithMode(text, limit, ctx?.formatting?.chunkMode ?? "length");
}
async function resolveTelegramSendContext(params) {
	return {
		send: await params.resolveSend(params.deps),
		baseOpts: {
			verbose: false,
			cfg: params.cfg,
			messageThreadId: parseTelegramThreadId(params.threadId),
			replyToMessageId: parseTelegramReplyToMessageId(params.replyToId),
			...params.replyToIdSource !== void 0 ? { replyToIdSource: params.replyToIdSource } : {},
			...params.replyToMode !== void 0 ? { replyToMode: params.replyToMode } : {},
			accountId: params.accountId ?? void 0,
			silent: params.silent,
			gatewayClientScopes: params.gatewayClientScopes,
			onDeliveryResult: params.onDeliveryResult ? async (result) => {
				await params.onDeliveryResult?.(attachChannelToResult("telegram", result));
			} : void 0,
			onPlatformSendDispatch: params.onPlatformSendDispatch,
			...params.formatting?.parseMode === "HTML" ? { textMode: "html" } : {},
			tableMode: params.formatting?.tableMode
		}
	};
}
async function resolveTelegramOutboundSendContext(params) {
	const outboundTo = normalizeTelegramOutboundTarget(params.to);
	const { send, baseOpts } = await resolveTelegramSendContext(params);
	return {
		outboundTo,
		send,
		baseOpts
	};
}
function telegramRichTablesEnabled(params) {
	if (params.htmlTextMode) return false;
	return mergeTelegramAccountConfig(params.cfg, params.accountId ?? resolveDefaultTelegramAccountId(params.cfg)).richMessages === true;
}
function normalizeTelegramMetadataOnlyPayload(payload) {
	const telegramData = payload.channelData?.telegram;
	if (resolveTelegramInteractiveTextFallback({
		text: payload.text,
		interactive: payload.interactive,
		presentation: payload.presentation
	})?.trim() || resolveSendableOutboundReplyParts(payload).mediaUrls.length > 0 || payload.location || payload.audioAsVoice === true || payload.videoAsNote === true || payload.presentation || payload.interactive) return payload;
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: payload.presentation,
		interactive: payload.interactive
	});
	const hasQuoteText = typeof telegramData?.quoteText === "string" && Boolean(telegramData.quoteText.trim());
	if (typeof telegramData?.reaction?.emoji === "string" && Boolean(telegramData.reaction.emoji.trim()) && !buttons?.length && !hasQuoteText) return payload;
	const fallbackText = payload.fallbackText?.text.trim();
	if (!buttons?.length && !hasQuoteText) return null;
	return fallbackText ? {
		...payload,
		text: fallbackText
	} : null;
}
function mergeTelegramFallbackPayloads(source, adopter) {
	const sourceTelegram = source.channelData?.telegram;
	const adopterTelegram = adopter.channelData?.telegram;
	const buttons = [...sourceTelegram?.buttons ?? [], ...adopterTelegram?.buttons ?? []];
	const quoteText = sourceTelegram?.quoteText?.trim() ? sourceTelegram.quoteText : adopterTelegram?.quoteText;
	const telegram = sourceTelegram || adopterTelegram ? {
		...adopterTelegram,
		...sourceTelegram,
		...buttons.length > 0 ? { buttons } : {},
		...quoteText ? { quoteText } : {}
	} : void 0;
	return {
		...adopter,
		...source,
		fallbackText: adopter.fallbackText,
		channelData: {
			...adopter.channelData,
			...source.channelData,
			...telegram ? { telegram } : {}
		}
	};
}
function normalizeTelegramFallbackPayloadBatch(entries) {
	const normalized = entries.map((entry) => entry.payload);
	const positions = new Map(entries.map((entry, position) => [entry.index, position]));
	for (const [position, entry] of entries.entries()) {
		const fallback = entry.payload.fallbackText;
		if (fallback?.replacesPayloadIndex === void 0 || entry.payload.text?.trim() !== fallback.text.trim() || entry.payload.interactive || entry.payload.presentation || resolveSendableOutboundReplyParts(entry.payload).mediaUrls.length > 0 || entry.payload.location || entry.payload.audioAsVoice === true || entry.payload.videoAsNote === true) continue;
		const channelData = entry.payload.channelData;
		const channelDataKeys = channelData ? Object.keys(channelData) : [];
		const telegramData = channelData?.telegram;
		if (channelDataKeys.length !== 1 || channelDataKeys[0] !== "telegram" || !telegramData?.buttons?.length || telegramData.quoteText?.trim() || telegramData.reaction) continue;
		const sourcePosition = positions.get(fallback.replacesPayloadIndex);
		if (sourcePosition === void 0) continue;
		const source = normalized[sourcePosition];
		if (!source || source.text?.trim() !== fallback.text.trim()) continue;
		normalized[sourcePosition] = mergeTelegramFallbackPayloads(source, entry.payload);
		normalized[position] = null;
	}
	return normalized;
}
async function sendTelegramPayloadMessages(params) {
	const payload = canonicalizeTelegramPresentationPayload(params.payload, {
		allowWebAppButtons: parseTelegramTarget(params.to).chatType === "direct",
		richTables: telegramRichTablesEnabled({
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			htmlTextMode: params.baseOpts.textMode === "html"
		})
	});
	const telegramData = payload.channelData?.telegram;
	const quoteText = typeof telegramData?.quoteText === "string" ? telegramData.quoteText : void 0;
	const reactionEmoji = typeof telegramData?.reaction?.emoji === "string" ? telegramData.reaction.emoji : void 0;
	const text = resolveTelegramInteractiveTextFallback({
		text: payload.text,
		interactive: payload.interactive,
		presentation: payload.presentation
	}) ?? "";
	const mediaUrls = resolveSendableOutboundReplyParts(payload).mediaUrls;
	const buttons = resolveTelegramInlineButtons({
		buttons: telegramData?.buttons,
		presentation: payload.presentation,
		interactive: payload.interactive
	});
	const replyToMessageId = params.baseOpts.replyToMessageId;
	const promptContextSource = resolveTelegramPromptContextSource(params.payload);
	const projectionCursor = promptContextSource ? createTelegramPromptContextProjectionCursor(promptContextSource) : void 0;
	const projectionOptions = (finalPart) => projectionCursor ? { promptContextProjectionPlan: {
		cursor: projectionCursor,
		finalPart
	} } : {};
	const payloadOpts = {
		...params.baseOpts,
		quoteText,
		...payload.audioAsVoice === true ? { asVoice: true } : {},
		...payload.videoAsNote === true ? { asVideoNote: true } : {}
	};
	if (payload.location) {
		if (mediaUrls.length > 0 || reactionEmoji || payload.audioAsVoice === true || payload.videoAsNote === true) throw new Error("Telegram location sends cannot be combined with media or reactions.");
		if (text.trim()) await params.send(params.to, text, {
			...params.baseOpts,
			replyToMessageId: void 0,
			replyToIdSource: void 0,
			replyToMode: void 0
		});
		return await params.sendLocation(params.to, payload.location, {
			...params.baseOpts,
			...projectionOptions(true),
			buttons,
			quoteText
		});
	}
	if (payload.videoAsNote === true && mediaUrls.length !== 1) throw new Error("Telegram video notes require exactly one media attachment.");
	const shouldConsumeImplicitReplyTarget = payloadOpts.replyToIdSource === "implicit" && payloadOpts.replyToMode !== void 0 && isSingleUseReplyToMode(payloadOpts.replyToMode);
	const consumedImplicitReplyPayloadOpts = shouldConsumeImplicitReplyTarget ? {
		...payloadOpts,
		replyToMessageId: void 0,
		replyToIdSource: void 0,
		replyToMode: void 0
	} : payloadOpts;
	let implicitReplyTargetAvailable = true;
	if (reactionEmoji) {
		if (typeof replyToMessageId !== "number") throw new Error("Telegram reaction requires a reply target");
		await params.baseOpts.onPlatformSendDispatch?.();
		const reactionResult = await params.react(params.to, replyToMessageId, reactionEmoji, {
			cfg: params.baseOpts.cfg,
			accountId: params.baseOpts.accountId,
			gatewayClientScopes: params.baseOpts.gatewayClientScopes,
			verbose: false
		});
		if (!reactionResult.ok) throw new Error(reactionResult.warning);
	}
	if (reactionEmoji && !text && mediaUrls.length === 0 && !buttons?.length) return {
		messageId: String(replyToMessageId),
		chatId: params.to
	};
	return await sendPayloadMediaSequenceOrFallback({
		text,
		mediaUrls,
		fallbackResult: {
			messageId: "unknown",
			chatId: params.to
		},
		sendNoMedia: async () => await params.send(params.to, text, {
			...payloadOpts,
			...projectionOptions(true),
			buttons
		}),
		send: async ({ text: textLocal, mediaUrl, index, isFirst }) => {
			const mediaPayloadOpts = shouldConsumeImplicitReplyTarget && !implicitReplyTargetAvailable ? consumedImplicitReplyPayloadOpts : payloadOpts;
			implicitReplyTargetAvailable = false;
			return await params.send(params.to, textLocal, {
				...mediaPayloadOpts,
				...projectionOptions(index === mediaUrls.length - 1),
				mediaUrl,
				...isFirst ? { buttons } : {}
			});
		}
	});
}
function createTelegramOutboundAdapter(options = {}) {
	const resolveSend = options.resolveSend ?? resolveDefaultTelegramSend;
	const loadSendModule = options.loadSendModule ?? loadTelegramSendModule;
	return {
		deliveryMode: "direct",
		chunker: chunkTelegramOutboundText,
		chunkerMode: "markdown",
		extractMarkdownImages: true,
		textChunkLimit: TELEGRAM_TEXT_CHUNK_LIMIT,
		preserveMarkdownDetails: ({ cfg, accountId }) => mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).richMessages === true,
		sanitizeText: ({ text, cfg, accountId }) => cfg && mergeTelegramAccountConfig(cfg, accountId ?? resolveDefaultTelegramAccountId(cfg)).richMessages === true ? sanitizeAssistantVisibleText(text) : sanitizeForPlainText(sanitizeAssistantVisibleText(text), { style: "markdown" }),
		shouldSuppressLocalPayloadPrompt: options.shouldSuppressLocalPayloadPrompt,
		beforeDeliverPayload: options.beforeDeliverPayload,
		shouldTreatDeliveredTextAsVisible: options.shouldTreatDeliveredTextAsVisible,
		targetsMatchForReplySuppression: options.targetsMatchForReplySuppression,
		preferFinalAssistantVisibleText: options.preferFinalAssistantVisibleText,
		normalizePayload: ({ payload }) => normalizeTelegramMetadataOnlyPayload(payload),
		normalizePayloadBatch: ({ payloads }) => normalizeTelegramFallbackPayloadBatch(payloads),
		presentationCapabilities: resolveTelegramPresentationCapabilities({ richMessages: false }),
		resolvePresentationCapabilities: ({ cfg, accountId, formatting }) => resolveTelegramPresentationCapabilities({ richMessages: telegramRichTablesEnabled({
			cfg,
			accountId,
			htmlTextMode: formatting?.parseMode === "HTML"
		}) }),
		deliveryCapabilities: {
			pin: true,
			durableFinal: {
				text: true,
				media: true,
				payload: true,
				silent: true,
				replyTo: true,
				thread: true,
				nativeQuote: false,
				messageSendingHooks: true,
				batch: true
			}
		},
		renderPresentation: ({ payload, presentation, ctx }) => canonicalizeTelegramPresentationPayload({
			...payload,
			presentation
		}, {
			allowWebAppButtons: parseTelegramTarget(ctx.to ?? "").chatType === "direct",
			richTables: telegramRichTablesEnabled({
				cfg: ctx.cfg,
				accountId: ctx.accountId,
				htmlTextMode: ctx.formatting?.parseMode === "HTML"
			})
		}),
		afterDeliverPayload: ({ cfg, target, payload, results }) => {
			const questionId = questionGatewayRuntime.readAskUserQuestionId(payload);
			const telegramResults = results.filter((candidate) => candidate.channel === "telegram" && candidate.messageId);
			const result = telegramResults.find((candidate) => candidate.meta?.telegramHasInlineKeyboard === true) ?? telegramResults.at(-1);
			const text = (typeof result?.meta?.telegramDeliveredText === "string" ? result.meta.telegramDeliveredText : payload.text)?.trim();
			if (!questionId || !result || !text) return;
			const chatId = result.chatId ?? normalizeTelegramOutboundTarget(target.to);
			questionGatewayRuntime.registerChannelDelivery({
				questionId,
				deliveryId: `telegram:${target.accountId ?? "default"}:${chatId}:${result.messageId}`,
				finalize: async (statusLine) => {
					const { editMessageTelegram } = await loadSendModule();
					await editMessageTelegram(chatId, result.messageId, `${text}\n\n${statusLine}`, {
						cfg,
						accountId: target.accountId ?? void 0,
						buttons: [],
						verbose: false
					});
				}
			});
		},
		pinDeliveredMessage: async ({ cfg, target, messageId, pin, gatewayClientScopes }) => {
			const { pinMessageTelegram } = await loadSendModule();
			await pinMessageTelegram(parseTelegramTarget(normalizeTelegramOutboundTarget(target.to)).chatId, messageId, {
				cfg,
				accountId: target.accountId ?? void 0,
				notify: pin.notify,
				verbose: false,
				gatewayClientScopes
			});
		},
		resolveEffectiveTextChunkLimit: ({ fallbackLimit }) => typeof fallbackLimit === "number" ? Math.min(fallbackLimit, 4096) : 4096,
		pollMaxOptions: TELEGRAM_POLL_OPTION_LIMIT,
		supportsPollDurationSeconds: true,
		supportsAnonymousPolls: true,
		...createAttachedChannelResultAdapter({
			channel: "telegram",
			sendText: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return await send(outboundTo, params.text, { ...baseOpts });
			},
			sendMedia: async (params) => {
				const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
					...params,
					resolveSend
				});
				return await send(outboundTo, params.text, {
					...baseOpts,
					mediaUrl: params.mediaUrl,
					...params.mediaAccess !== void 0 ? { mediaAccess: params.mediaAccess } : {},
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				});
			}
		}),
		sendPayload: async (params) => {
			const { outboundTo, send, baseOpts } = await resolveTelegramOutboundSendContext({
				...params,
				resolveSend
			});
			const { reactMessageTelegram, sendLocationTelegram } = await loadSendModule();
			return attachChannelToResult("telegram", await sendTelegramPayloadMessages({
				send,
				sendLocation: sendLocationTelegram,
				react: reactMessageTelegram,
				to: outboundTo,
				payload: params.payload,
				baseOpts: {
					...baseOpts,
					...params.mediaAccess !== void 0 ? { mediaAccess: params.mediaAccess } : {},
					mediaLocalRoots: params.mediaLocalRoots,
					mediaReadFile: params.mediaReadFile,
					forceDocument: params.forceDocument ?? false
				}
			}));
		},
		sendPoll: async ({ cfg, to, poll, accountId, threadId, silent, isAnonymous, gatewayClientScopes, onPlatformSendDispatch }) => {
			const outboundTo = normalizeTelegramOutboundTarget(to);
			const { sendPollTelegram } = await loadSendModule();
			return await sendPollTelegram(outboundTo, poll, {
				cfg,
				accountId: accountId ?? void 0,
				messageThreadId: parseTelegramThreadId(threadId),
				silent: silent ?? void 0,
				isAnonymous: isAnonymous ?? void 0,
				gatewayClientScopes,
				onPlatformSendDispatch
			});
		}
	};
}
const telegramOutbound = createTelegramOutboundAdapter();
//#endregion
export { telegramOutbound as i, createTelegramOutboundAdapter as n, sendTelegramPayloadMessages as r, TELEGRAM_TEXT_CHUNK_LIMIT as t };
