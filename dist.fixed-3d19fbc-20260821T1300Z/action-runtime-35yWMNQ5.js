import { w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { n as sendDurableMessageBatch } from "./channel-outbound-CP6yKwU3.js";
import { _ as readToolStringParam, g as readStringOrNumberParam, h as readStringArrayParam, m as readReactionParams, p as readPositiveIntegerParam } from "./common-ciEJghJz.js";
import { t as jsonResult } from "./tool-results-BCM3fdVS.js";
import { C as normalizeOutboundLocation } from "./reply-payload-DBNGwex4.js";
import { f as normalizeMessagePresentation, v as renderMessagePresentationFallbackText } from "./payload-ByplrRCQ.js";
import { t as buildOutboundSessionContext } from "./session-context-CG6rue8D.js";
import { t as readBooleanParam } from "./boolean-param-AuSHeYDH.js";
import { m as resolveStorePath } from "./session-store-runtime-De3jWY_Z.js";
import { r as resolvePollMaxSelections } from "./polls-C-v11_tu.js";
import "./number-runtime-CoAPZzJY.js";
import "./account-core-C0xCbFEJ.js";
import { t as resolveTelegramToken } from "./token-C1f3v7zW.js";
import "./channel-inbound-tRRtLmIr.js";
import { t as resolveReactionMessageId } from "./channel-actions-Ht8PCq9o.js";
import { a as resolveDefaultTelegramAccountId, c as resolveTelegramPollActionGateState, t as createTelegramActionGate } from "./accounts-DdRrFets.js";
import { a as parseTelegramTarget, i as normalizeTelegramOutboundTarget, o as resolveTelegramTargetChatType } from "./targets-BwGEq2w-.js";
import { r as resolveTelegramInlineButtonsScope } from "./inline-buttons-BklVR8t0.js";
import { t as rejectTelegramNativeButtonParams } from "./native-button-params-CIR-Zlcc.js";
import { t as resolveTelegramAccountOwnerAgentId } from "./account-owner-BHF6S4C7.js";
import { n as resolveTelegramInlineButtons } from "./button-types-BrwbkdaT.js";
import { n as resolveTelegramInteractiveTextFallback } from "./interactive-fallback-D8zHGNs2.js";
import { t as resolveTelegramReactionLevel } from "./reaction-level-DllBHWlf.js";
import { i as getCacheStats, o as searchStickers } from "./sticker-cache-BDibjAqa.js";
import { p as resolveTelegramMessageCacheScope } from "./sent-message-cache.legacy-state-BWxg3C_2.js";
import { o as resolveTopicNameCacheScope, s as updateTopicName } from "./topic-name-cache-D9THzLk5.js";
import { E as editMessageTelegram, G as editForumTopicTelegram, J as pinMessageTelegram, T as editMessageReplyMarkupTelegram, W as createForumTopicTelegram, Y as reactMessageTelegram, at as createTelegramMessageCache, m as sendMessageTelegram, n as sendStickerTelegram, ot as hasProviderObservedTelegramThreadBinding, q as deleteMessageTelegram, t as sendPollTelegram } from "./send-BOEoBdMU.js";
import { t as resolveTelegramPollVisibility } from "./poll-visibility-Ds4ydsWS.js";
import { t as telegramInboundEventDelivery } from "./inbound-event-delivery-B8p7bLPM.js";
//#region extensions/telegram/src/message-topic-binding.ts
const TOPIC_BINDING_ERROR = "Delegated Telegram message mutation requires a provider-observed binding to the exact current topic and account.";
function rejectUnboundTopicMutation() {
	throw new Error(TOPIC_BINDING_ERROR);
}
function resolveCurrentTelegramConversation(toolContext, chatId) {
	if (toolContext?.currentChannelProvider?.trim().toLowerCase() !== "telegram") return {
		hasThreadContext: false,
		matchesChat: false
	};
	const targets = [toolContext.currentChannelId, toolContext.currentMessagingTarget].filter((value) => typeof value === "string" && Boolean(value.trim()));
	const parsedTargets = targets.map((value) => parseTelegramTarget(value));
	const threadIds = [...parsedTargets.map((target) => target.messageThreadId), parseStrictPositiveInteger(toolContext.currentThreadTs)].filter((value) => value !== void 0);
	const threadId = threadIds[0];
	const matchesChat = targets.length > 0 && parsedTargets.every((target) => target.chatId === chatId) && (threadId === void 0 || threadIds.every((value) => value === threadId));
	return {
		hasThreadContext: threadIds.length > 0,
		matchesChat,
		...threadId !== void 0 ? { threadId } : {}
	};
}
async function resolveTelegramMessageMutationChatId(params) {
	const target = parseTelegramTarget(String(params.chatId));
	if (params.context?.conversationReadOrigin === "direct-operator") return target.messageThreadId === void 0 ? params.chatId : target.chatId;
	const currentConversation = resolveCurrentTelegramConversation(params.context?.toolContext, target.chatId);
	const selectedAccountId = normalizeOptionalAccountId(params.accountId ?? resolveDefaultTelegramAccountId(params.cfg));
	const requesterAccountId = normalizeOptionalAccountId(params.context?.requesterAccountId);
	if (!selectedAccountId || !requesterAccountId || normalizeAccountId(selectedAccountId) !== normalizeAccountId(requesterAccountId) || !currentConversation.matchesChat) return rejectUnboundTopicMutation();
	const threadId = target.messageThreadId ?? currentConversation.threadId;
	if (threadId === void 0 && !currentConversation.hasThreadContext) return target.chatId;
	if (threadId === void 0 || currentConversation.threadId !== threadId) return rejectUnboundTopicMutation();
	if (parseStrictPositiveInteger(params.context?.toolContext?.currentMessageId) === params.messageId) return target.chatId;
	if (!hasProviderObservedTelegramThreadBinding(await createTelegramMessageCache({ scope: resolveTelegramMessageCacheScope(resolveStorePath(params.cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg: params.cfg,
		accountId: selectedAccountId
	}) })) }).get({
		accountId: selectedAccountId,
		chatId: target.chatId,
		messageId: String(params.messageId)
	}), threadId)) return rejectUnboundTopicMutation();
	return target.chatId;
}
//#endregion
//#region extensions/telegram/src/action-runtime.ts
const telegramActionRuntime = {
	createForumTopicTelegram,
	deleteMessageTelegram,
	editForumTopicTelegram,
	editMessageReplyMarkupTelegram,
	editMessageTelegram,
	getCacheStats,
	pinMessageTelegram,
	reactMessageTelegram,
	searchStickers,
	sendDurableMessageBatch,
	sendMessageTelegram,
	sendPollTelegram,
	sendStickerTelegram
};
const TELEGRAM_FORUM_TOPIC_ICON_COLORS = [
	7322096,
	16766590,
	13338331,
	9367192,
	16749490,
	16478047
];
const TELEGRAM_ACTION_ALIASES = {
	createForumTopic: "createForumTopic",
	delete: "deleteMessage",
	deleteMessage: "deleteMessage",
	edit: "editMessage",
	editForumTopic: "editForumTopic",
	editMessage: "editMessage",
	poll: "poll",
	react: "react",
	searchSticker: "searchSticker",
	send: "sendMessage",
	sendMessage: "sendMessage",
	sendSticker: "sendSticker",
	sticker: "sendSticker",
	stickerCacheStats: "stickerCacheStats",
	"sticker-search": "searchSticker",
	"topic-create": "createForumTopic",
	"topic-edit": "editForumTopic"
};
function readTelegramForumTopicIconColor(params) {
	const iconColor = readPositiveIntegerParam(params, "iconColor", { message: "iconColor must be one of Telegram's supported forum topic colors." });
	if (iconColor == null) return;
	if (!TELEGRAM_FORUM_TOPIC_ICON_COLORS.includes(iconColor)) throw new Error("iconColor must be one of Telegram's supported forum topic colors.");
	return iconColor;
}
function normalizeTelegramActionName(action) {
	const normalized = TELEGRAM_ACTION_ALIASES[action];
	if (!normalized) throw new Error(`Unsupported Telegram action: ${action}`);
	return normalized;
}
function readTelegramChatId(params) {
	return readStringOrNumberParam(params, "chatId") ?? readStringOrNumberParam(params, "channelId") ?? readStringOrNumberParam(params, "to", { required: true });
}
function readTelegramThreadId(params) {
	return readPositiveIntegerParam(params, "messageThreadId", { message: "messageThreadId must be a positive integer." }) ?? readPositiveIntegerParam(params, "threadId", { message: "threadId must be a positive integer." });
}
function resolveActionTopicNameCacheScope(cfg, accountId) {
	const resolvedAccountId = accountId ?? resolveDefaultTelegramAccountId(cfg);
	return resolveTopicNameCacheScope(resolveStorePath(cfg.session?.store, { agentId: resolveTelegramAccountOwnerAgentId({
		cfg,
		accountId: resolvedAccountId
	}) }));
}
function formatTelegramDeliveryTarget(to, messageThreadId) {
	const parsed = parseTelegramTarget(to);
	const directTopicId = parsed.directMessagesTopicId;
	if (directTopicId != null) return `${parsed.chatId}:direct-topic:${directTopicId}`;
	const topicId = messageThreadId ?? parsed.messageThreadId;
	if (topicId == null) return to;
	return `${parsed.chatId}:topic:${topicId}`;
}
function readTelegramReplyToMessageId(params) {
	return readPositiveIntegerParam(params, "replyToMessageId", { message: "replyToMessageId must be a positive integer." }) ?? readPositiveIntegerParam(params, "replyTo", { message: "replyTo must be a positive integer." });
}
function pushTelegramMediaUrl(mediaUrls, seen, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || seen.has(normalized)) return;
	seen.add(normalized);
	mediaUrls.push(normalized);
}
function readTelegramSendMediaUrls(params) {
	const mediaUrls = [];
	const seen = /* @__PURE__ */ new Set();
	pushTelegramMediaUrl(mediaUrls, seen, params.mediaUrl);
	pushTelegramMediaUrl(mediaUrls, seen, params.media);
	pushTelegramMediaUrl(mediaUrls, seen, params.path);
	pushTelegramMediaUrl(mediaUrls, seen, params.filePath);
	pushTelegramMediaUrl(mediaUrls, seen, params.fileUrl);
	if (Array.isArray(params.mediaUrls)) for (const mediaUrl of params.mediaUrls) pushTelegramMediaUrl(mediaUrls, seen, mediaUrl);
	if (Array.isArray(params.attachments)) for (const attachment of params.attachments) {
		if (!attachment || typeof attachment !== "object" || Array.isArray(attachment)) continue;
		const record = attachment;
		pushTelegramMediaUrl(mediaUrls, seen, record.media);
		pushTelegramMediaUrl(mediaUrls, seen, record.mediaUrl);
		pushTelegramMediaUrl(mediaUrls, seen, record.path);
		pushTelegramMediaUrl(mediaUrls, seen, record.filePath);
		pushTelegramMediaUrl(mediaUrls, seen, record.fileUrl);
		pushTelegramMediaUrl(mediaUrls, seen, record.url);
	}
	return mediaUrls;
}
function resolveTelegramButtonsFromParams(params, presentation = normalizeMessagePresentation(params.presentation), options) {
	return resolveTelegramInlineButtons({
		presentation,
		interactive: params.interactive
	}, options);
}
function readTelegramSendContent(params) {
	const explicitContent = readToolStringParam(params.args, "content", { allowEmpty: true }) ?? readToolStringParam(params.args, "message", { allowEmpty: true }) ?? readToolStringParam(params.args, "caption", { allowEmpty: true });
	const unsupportedBlocks = params.presentation?.blocks.filter((block) => block.type === "chart" || block.type === "table") ?? [];
	const presentationText = explicitContent == null && params.presentation ? renderMessagePresentationFallbackText({ presentation: params.presentation }) : explicitContent != null && unsupportedBlocks.length > 0 ? renderMessagePresentationFallbackText({
		text: explicitContent,
		presentation: {
			...params.presentation,
			blocks: unsupportedBlocks
		}
	}) : void 0;
	const interactiveText = explicitContent == null && !params.presentation ? resolveTelegramInteractiveTextFallback({ interactive: params.interactive }) : void 0;
	let content = (presentationText?.trim() ? presentationText : void 0) ?? explicitContent ?? (interactiveText?.trim() ? interactiveText : void 0);
	if ((content == null || content.trim().length === 0) && !params.mediaUrl && params.hasButtons) {
		const fallback = presentationText?.trim() ? presentationText : interactiveText;
		if (fallback?.trim()) content = fallback;
	}
	if (content == null && !params.mediaUrl && !params.hasButtons && !params.hasLocation) throw new Error("content required.");
	return {
		content: content ?? "",
		hasExplicitContent: explicitContent != null
	};
}
function renderTelegramDroppedControlFallback(controls) {
	return renderMessagePresentationFallbackText({ presentation: { blocks: [{
		type: "buttons",
		buttons: controls.map((control) => ({
			label: control.label,
			value: "unavailable"
		}))
	}] } });
}
function appendTelegramDroppedControlFallback(text, controls) {
	const fallback = renderTelegramDroppedControlFallback(controls);
	if (!fallback || text === fallback || text.endsWith(`\n\n${fallback}`)) return text;
	return [text, fallback].filter(Boolean).join("\n\n");
}
function buildTelegramControlDegradation(controls, fallbackDelivered) {
	if (controls.length === 0) return;
	const reasons = [...new Set(controls.map((control) => control.reason))];
	const hasOverflow = reasons.includes("callback_data_too_long");
	return {
		warning: fallbackDelivered ? `Telegram delivered ${controls.length} unencodable control${controls.length === 1 ? "" : "s"} as readable text.` : `Telegram could not deliver ${controls.length} control${controls.length === 1 ? "" : "s"}.`,
		degradedDelivery: {
			droppedControls: controls.length,
			fallback: fallbackDelivered ? "text" : "not_delivered",
			reasons,
			...hasOverflow ? { callbackDataLimitBytes: 64 } : {},
			guidance: hasOverflow ? `Shorten callback data to at most 64 UTF-8 bytes and retry if clickable controls are required.` : "Retry with a supported control action if clickable controls are required."
		}
	};
}
function normalizeTelegramDeliveryPin(params) {
	const delivery = params.delivery;
	const pin = delivery && typeof delivery === "object" && !Array.isArray(delivery) ? delivery.pin : params.pin === true ? true : void 0;
	if (pin === true) return { enabled: true };
	if (!pin || typeof pin !== "object" || Array.isArray(pin)) return;
	const raw = pin;
	if (raw.enabled !== true) return;
	return {
		enabled: true,
		...raw.notify === true ? { notify: true } : {},
		...raw.required === true ? { required: true } : {}
	};
}
function buildTelegramActionSendPayload(params) {
	const telegramData = params.buttons || params.quoteText ? {
		...params.buttons ? { buttons: params.buttons } : {},
		...params.quoteText ? { quoteText: params.quoteText } : {}
	} : void 0;
	return {
		text: params.content,
		...params.mediaUrls.length > 0 ? { mediaUrls: params.mediaUrls } : {},
		...params.asVoice === true ? { audioAsVoice: true } : {},
		...params.asVideoNote === true ? { videoAsNote: true } : {},
		...params.location ? { location: params.location } : {},
		...params.pin ? { delivery: { pin: params.pin } } : {},
		...telegramData ? { channelData: { telegram: telegramData } } : {}
	};
}
function getLastDurableTelegramActionResult(result) {
	const lastResult = result.results.at(-1);
	const receipt = result.receipt;
	return {
		messageId: lastResult?.messageId ?? receipt.primaryPlatformMessageId ?? receipt.platformMessageIds.at(-1),
		chatId: lastResult?.chatId
	};
}
async function handleTelegramAction(params, cfg, options) {
	rejectTelegramNativeButtonParams(params);
	const { action, accountId } = {
		action: normalizeTelegramActionName(readToolStringParam(params, "action", { required: true })),
		accountId: readToolStringParam(params, "accountId")
	};
	const isActionEnabled = createTelegramActionGate({
		cfg,
		accountId
	});
	const notifyVisibleOutboundSuccess = (to, messageThreadId) => {
		telegramInboundEventDelivery.notify({
			sessionKey: options?.sessionKey ?? void 0,
			to: formatTelegramDeliveryTarget(to, messageThreadId),
			accountId,
			inboundEventKind: options?.inboundEventKind
		});
	};
	if (action === "react") {
		const reactionLevelInfo = resolveTelegramReactionLevel({
			cfg,
			accountId: accountId ?? void 0
		});
		if (!reactionLevelInfo.agentReactionsEnabled) return jsonResult({
			ok: false,
			reason: "disabled",
			hint: `Telegram agent reactions disabled (reactionLevel="${reactionLevelInfo.level}"). Do not retry.`
		});
		if (!isActionEnabled("reactions")) return jsonResult({
			ok: false,
			reason: "disabled",
			hint: "Telegram reactions are disabled via actions.reactions. Do not retry."
		});
		const chatId = readTelegramChatId(params);
		let explicitMessageId;
		try {
			explicitMessageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		} catch {
			return jsonResult({
				ok: false,
				reason: "missing_message_id",
				hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry."
			});
		}
		const messageId = explicitMessageId ?? resolveReactionMessageId({ args: params });
		if (typeof messageId !== "number" || !Number.isFinite(messageId) || messageId <= 0) return jsonResult({
			ok: false,
			reason: "missing_message_id",
			hint: "Telegram reaction requires a valid messageId (or inbound context fallback). Do not retry."
		});
		const { emoji, remove, isEmpty } = readReactionParams(params, { removeErrorMessage: "Emoji is required to remove a Telegram reaction." });
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) return jsonResult({
			ok: false,
			reason: "missing_token",
			hint: "Telegram bot token missing. Do not retry."
		});
		let reactionResult;
		try {
			const authorizedChatId = await resolveTelegramMessageMutationChatId({
				chatId: chatId ?? "",
				messageId,
				cfg,
				accountId,
				context: options
			});
			reactionResult = await telegramActionRuntime.reactMessageTelegram(authorizedChatId, messageId ?? 0, emoji ?? "", {
				cfg,
				token,
				remove,
				accountId: accountId ?? void 0,
				gatewayClientScopes: options?.gatewayClientScopes
			});
		} catch (err) {
			const isInvalid = String(err).includes("REACTION_INVALID");
			return jsonResult({
				ok: false,
				reason: isInvalid ? "REACTION_INVALID" : "error",
				emoji,
				hint: isInvalid ? "This emoji is not supported for Telegram reactions. Add it to your reaction disallow list so you do not try it again." : "Reaction failed. Do not retry."
			});
		}
		if (!reactionResult.ok) return jsonResult({
			ok: false,
			warning: reactionResult.warning,
			...remove || isEmpty ? { removed: true } : { added: emoji }
		});
		if (!remove && !isEmpty) return jsonResult({
			ok: true,
			added: emoji
		});
		return jsonResult({
			ok: true,
			removed: true
		});
	}
	if (action === "sendMessage") {
		if (!isActionEnabled("sendMessage")) throw new Error("Telegram sendMessage is disabled.");
		const to = normalizeTelegramOutboundTarget(readToolStringParam(params, "to", { required: true }));
		const mediaUrls = readTelegramSendMediaUrls(params);
		const firstMediaUrl = mediaUrls[0];
		const location = normalizeOutboundLocation(params.location);
		const presentation = normalizeMessagePresentation(params.presentation);
		const droppedControls = [];
		const buttons = resolveTelegramButtonsFromParams(params, presentation, {
			allowWebAppButtons: resolveTelegramTargetChatType(to) === "direct",
			onDroppedControl: (control) => droppedControls.push(control)
		});
		const resolvedContent = readTelegramSendContent({
			args: params,
			mediaUrl: firstMediaUrl,
			hasButtons: Array.isArray(buttons) && buttons.length > 0,
			hasLocation: Boolean(location),
			interactive: params.interactive,
			presentation
		});
		const content = droppedControls.length > 0 && resolvedContent.hasExplicitContent ? appendTelegramDroppedControlFallback(resolvedContent.content, droppedControls) : resolvedContent.content;
		const droppedControlFallback = droppedControls.length > 0 ? renderTelegramDroppedControlFallback(droppedControls) : "";
		const hasOnlyDroppedControlFallback = !resolvedContent.hasExplicitContent && droppedControlFallback.length > 0 && content.trim() === droppedControlFallback.trim();
		const asVideoNote = readBooleanParam(params, "asVideoNote") ?? false;
		if (location && (content.trim() && !hasOnlyDroppedControlFallback || mediaUrls.length > 0 || asVideoNote)) throw new Error("Telegram location sends cannot be combined with message text or media.");
		if (asVideoNote && mediaUrls.length !== 1) throw new Error("Telegram video notes require exactly one media attachment.");
		if (buttons) {
			const inlineButtonsScope = resolveTelegramInlineButtonsScope({
				cfg,
				accountId: accountId ?? void 0
			});
			if (inlineButtonsScope === "off") throw new Error("Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to \"dm\", \"group\", \"all\", or \"allowlist\".");
			if (inlineButtonsScope === "dm" || inlineButtonsScope === "group") {
				const targetType = resolveTelegramTargetChatType(to);
				if (targetType === "unknown") throw new Error(`Telegram inline buttons require a numeric chat id when inlineButtons="${inlineButtonsScope}".`);
				if (inlineButtonsScope === "dm" && targetType !== "direct") throw new Error("Telegram inline buttons are limited to DMs when inlineButtons=\"dm\".");
				if (inlineButtonsScope === "group" && targetType !== "group") throw new Error("Telegram inline buttons are limited to groups when inlineButtons=\"group\".");
			}
		}
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const quoteText = readToolStringParam(params, "quoteText");
		if (!resolveTelegramToken(cfg, { accountId }).token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const sendOptions = {
			cfg,
			accountId: accountId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			quoteText: quoteText ?? void 0,
			asVoice: readBooleanParam(params, "asVoice"),
			asVideoNote,
			silent: readBooleanParam(params, "silent"),
			forceDocument: readBooleanParam(params, "forceDocument") ?? readBooleanParam(params, "asDocument") ?? false
		};
		const payload = buildTelegramActionSendPayload({
			content,
			mediaUrls,
			asVoice: sendOptions.asVoice,
			asVideoNote: sendOptions.asVideoNote,
			location,
			pin: normalizeTelegramDeliveryPin(params),
			buttons,
			quoteText
		});
		const mediaAccess = options?.mediaAccess ?? (options?.mediaLocalRoots || options?.mediaReadFile ? {
			...options.mediaLocalRoots ? { localRoots: options.mediaLocalRoots } : {},
			...options.mediaReadFile ? { readFile: options.mediaReadFile } : {}
		} : void 0);
		const outboundSession = buildOutboundSessionContext({
			cfg,
			sessionKey: options?.sessionKey,
			requesterAccountId: accountId
		});
		const durableResult = await telegramActionRuntime.sendDurableMessageBatch({
			cfg,
			channel: "telegram",
			to,
			accountId: accountId ?? void 0,
			payloads: [payload],
			replyToId: replyToMessageId == null ? void 0 : String(replyToMessageId),
			threadId: messageThreadId,
			forceDocument: sendOptions.forceDocument,
			silent: sendOptions.silent,
			durability: "required",
			gatewayClientScopes: options?.gatewayClientScopes,
			...mediaAccess ? { mediaAccess } : {},
			...outboundSession ? { session: outboundSession } : {}
		});
		if (durableResult.status === "failed" || durableResult.status === "partial_failed") throw durableResult.error;
		if (durableResult.status === "suppressed") throw new Error("Telegram sendMessage was suppressed before delivery.");
		const result = getLastDurableTelegramActionResult(durableResult);
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			...buildTelegramControlDegradation(droppedControls, Boolean(content.trim()))
		});
	}
	if (action === "poll") {
		const pollActionState = resolveTelegramPollActionGateState(isActionEnabled);
		if (!pollActionState.sendMessageEnabled) throw new Error("Telegram sendMessage is disabled.");
		if (!pollActionState.pollEnabled) throw new Error("Telegram polls are disabled.");
		const to = readToolStringParam(params, "to", { required: true });
		const question = readToolStringParam(params, "question") ?? readToolStringParam(params, "pollQuestion", { required: true });
		const answers = readStringArrayParam(params, "answers") ?? readStringArrayParam(params, "pollOption", { required: true });
		const allowMultiselect = readBooleanParam(params, "allowMultiselect") ?? readBooleanParam(params, "pollMulti");
		const durationSeconds = readPositiveIntegerParam(params, "durationSeconds", { message: "durationSeconds must be a positive integer." }) ?? readPositiveIntegerParam(params, "pollDurationSeconds", { message: "pollDurationSeconds must be a positive integer." });
		const durationHours = readPositiveIntegerParam(params, "durationHours", { message: "durationHours must be a positive integer." }) ?? readPositiveIntegerParam(params, "pollDurationHours", { message: "pollDurationHours must be a positive integer." });
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const isAnonymous = readBooleanParam(params, "isAnonymous") ?? resolveTelegramPollVisibility({
			pollAnonymous: readBooleanParam(params, "pollAnonymous"),
			pollPublic: readBooleanParam(params, "pollPublic")
		});
		const silent = readBooleanParam(params, "silent");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.sendPollTelegram(to, {
			question,
			options: answers,
			maxSelections: resolvePollMaxSelections(answers.length, allowMultiselect ?? false),
			durationSeconds: durationSeconds ?? void 0,
			durationHours: durationHours ?? void 0
		}, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			isAnonymous: isAnonymous ?? void 0,
			silent: silent ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			pollId: result.pollId,
			...result.pollAnswerRouting ? { pollAnswerRouting: result.pollAnswerRouting } : {},
			...result.warning ? { warning: result.warning } : {}
		});
	}
	if (action === "deleteMessage") {
		if (!isActionEnabled("deleteMessage")) throw new Error("Telegram deleteMessage is disabled.");
		const chatId = readTelegramChatId(params);
		const messageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		if (messageId === void 0) throw new Error("messageId required");
		const authorizedChatId = await resolveTelegramMessageMutationChatId({
			chatId: chatId ?? "",
			messageId,
			cfg,
			accountId,
			context: options
		});
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.deleteMessageTelegram(authorizedChatId, messageId ?? 0, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		if (!result.ok) return jsonResult({
			ok: false,
			deleted: false,
			warning: result.warning
		});
		return jsonResult({
			ok: true,
			deleted: true
		});
	}
	if (action === "editMessage") {
		if (!isActionEnabled("editMessage")) throw new Error("Telegram editMessage is disabled.");
		const chatId = readTelegramChatId(params);
		const messageId = readPositiveIntegerParam(params, "messageId", { message: "messageId must be a positive integer." });
		if (messageId === void 0) throw new Error("messageId required");
		const authorizedChatId = await resolveTelegramMessageMutationChatId({
			chatId: chatId ?? "",
			messageId,
			cfg,
			accountId,
			context: options
		});
		let content = readToolStringParam(params, "content", { allowEmpty: false }) ?? readToolStringParam(params, "message", { allowEmpty: false });
		let caption = readToolStringParam(params, "caption", { allowEmpty: true });
		const droppedControls = [];
		const buttons = resolveTelegramButtonsFromParams(params, void 0, {
			allowWebAppButtons: resolveTelegramTargetChatType(chatId ?? "") === "direct",
			onDroppedControl: (control) => droppedControls.push(control)
		});
		if (droppedControls.length > 0) {
			if (caption != null) caption = appendTelegramDroppedControlFallback(caption, droppedControls);
			else if (content != null) content = appendTelegramDroppedControlFallback(content, droppedControls);
		}
		if (content == null && caption == null && buttons === void 0) {
			const degradation = buildTelegramControlDegradation(droppedControls, false);
			if (degradation) return jsonResult({
				ok: false,
				...degradation
			});
			throw new Error("content required.");
		}
		if (buttons !== void 0) {
			if (resolveTelegramInlineButtonsScope({
				cfg,
				accountId: accountId ?? void 0
			}) === "off") throw new Error("Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to \"dm\", \"group\", \"all\", or \"allowlist\".");
		}
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		if (content == null && caption == null && buttons !== void 0) {
			const result = await telegramActionRuntime.editMessageReplyMarkupTelegram(authorizedChatId, messageId ?? 0, buttons, {
				cfg,
				token,
				accountId: accountId ?? void 0,
				gatewayClientScopes: options?.gatewayClientScopes
			});
			return jsonResult({
				ok: true,
				messageId: result.messageId,
				chatId: result.chatId,
				...buildTelegramControlDegradation(droppedControls, false)
			});
		}
		const result = await telegramActionRuntime.editMessageTelegram(authorizedChatId, messageId ?? 0, caption ?? content ?? "", {
			cfg,
			token,
			accountId: accountId ?? void 0,
			buttons,
			editMode: caption != null ? "caption" : "auto",
			gatewayClientScopes: options?.gatewayClientScopes
		});
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId,
			...buildTelegramControlDegradation(droppedControls, true)
		});
	}
	if (action === "sendSticker") {
		if (!isActionEnabled("sticker", false)) throw new Error("Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.");
		const to = readToolStringParam(params, "to") ?? readToolStringParam(params, "target", { required: true });
		const fileId = readToolStringParam(params, "fileId") ?? readStringArrayParam(params, "stickerId")?.[0];
		if (!fileId) throw new Error("fileId is required.");
		const replyToMessageId = readTelegramReplyToMessageId(params);
		const messageThreadId = readTelegramThreadId(params);
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.sendStickerTelegram(to, fileId, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			replyToMessageId: replyToMessageId ?? void 0,
			messageThreadId: messageThreadId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		notifyVisibleOutboundSuccess(to, messageThreadId);
		return jsonResult({
			ok: true,
			messageId: result.messageId,
			chatId: result.chatId
		});
	}
	if (action === "searchSticker") {
		if (!isActionEnabled("sticker", false)) throw new Error("Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.");
		const query = readToolStringParam(params, "query", { required: true });
		const limit = readPositiveIntegerParam(params, "limit", { message: "limit must be a positive integer." }) ?? 5;
		const results = telegramActionRuntime.searchStickers(query, limit);
		return jsonResult({
			ok: true,
			count: results.length,
			stickers: results.map((s) => ({
				fileId: s.fileId,
				emoji: s.emoji,
				description: s.description,
				setName: s.setName
			}))
		});
	}
	if (action === "stickerCacheStats") return jsonResult({
		ok: true,
		...telegramActionRuntime.getCacheStats()
	});
	if (action === "createForumTopic") {
		if (!isActionEnabled("createForumTopic")) throw new Error("Telegram createForumTopic is disabled.");
		const chatId = readTelegramChatId(params);
		const name = readToolStringParam(params, "name", { required: true });
		const iconColor = readTelegramForumTopicIconColor(params);
		const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.createForumTopicTelegram(chatId ?? "", name, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			iconColor,
			iconCustomEmojiId: iconCustomEmojiId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		if (result.topicId != null && result.chatId) await updateTopicName(result.chatId, result.topicId, {
			name,
			...iconColor != null ? { iconColor } : {},
			...iconCustomEmojiId ? { iconCustomEmojiId } : {}
		}, resolveActionTopicNameCacheScope(cfg, accountId)).catch(() => {});
		return jsonResult({
			ok: true,
			topicId: result.topicId,
			name: result.name,
			chatId: result.chatId
		});
	}
	if (action === "editForumTopic") {
		if (!isActionEnabled("editForumTopic")) throw new Error("Telegram editForumTopic is disabled.");
		const chatId = readTelegramChatId(params);
		const messageThreadId = readTelegramThreadId(params);
		if (typeof messageThreadId !== "number") throw new Error("messageThreadId or threadId is required.");
		const name = readToolStringParam(params, "name");
		const iconCustomEmojiId = readToolStringParam(params, "iconCustomEmojiId");
		const token = resolveTelegramToken(cfg, { accountId }).token;
		if (!token) throw new Error("Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.");
		const result = await telegramActionRuntime.editForumTopicTelegram(chatId ?? "", messageThreadId, {
			cfg,
			token,
			accountId: accountId ?? void 0,
			name: name ?? void 0,
			iconCustomEmojiId: iconCustomEmojiId ?? void 0,
			gatewayClientScopes: options?.gatewayClientScopes
		});
		if (result.chatId) {
			const patch = {};
			if (name) patch.name = name;
			if (iconCustomEmojiId) patch.iconCustomEmojiId = iconCustomEmojiId;
			if (Object.keys(patch).length > 0) await updateTopicName(result.chatId, result.messageThreadId, patch, resolveActionTopicNameCacheScope(cfg, accountId)).catch(() => {});
		}
		return jsonResult(result);
	}
	throw new Error(`Unsupported Telegram action: ${String(action)}`);
}
//#endregion
export { handleTelegramAction, telegramActionRuntime };
