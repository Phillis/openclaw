import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { n as extractErrorCode, t as collectErrorGraphCandidates } from "./errors-Ccx0R-_Z.js";
import { g as readResponseTextLimited, m as readProviderJsonResponse } from "./provider-http-errors-BXG5plR9.js";
import { r as fetchWithRuntimeDispatcherOrMockedGlobal } from "./runtime-fetch-Blw1Z7ZX.js";
import { r as logVerbose } from "./globals-GZNLg1ns.js";
import "./error-runtime-CmA1H4Zg.js";
import "./runtime-env-_YEv0JPQ.js";
import { n as createChannelApiRetryRunner } from "./retry-policy-ClSo0q_q.js";
import { t as classifyTransientNetworkErrorCode } from "./retry-runtime-D94jIZiS.js";
import { n as createChannelPartialDeliveryError } from "./delivery-result-BB-vQ7ul.js";
import { n as recordChannelActivity } from "./channel-activity-KGHrbxIK.js";
import { t as requireRuntimeConfig } from "./plugin-config-runtime-C2UoeqsI.js";
import "./channel-inbound-BmDzyYQ4.js";
import "./runtime-fetch-Bz9WtC9B.js";
import "./provider-http-gpLoOs40.js";
import "./text-utility-runtime-BNhX-3os.js";
import { i as resolveLineAccount } from "./accounts-Cx1pXoZV.js";
import { g as validateLineMediaUrl, l as normalizeLineMessageActions, s as messageAction, t as createLineSendReceipt } from "./send-receipt-I33lTCFa.js";
import { o as HTTPFetchError, t as MessagingApiClient } from "./messagingApiClient-UpUACf5e.js";
import { randomUUID } from "node:crypto";
//#region node_modules/@line/bot-sdk/package.json
var version = "11.2.0";
//#endregion
//#region extensions/line/src/channel-access-token.ts
function resolveLineChannelAccessToken(explicit, params) {
	if (explicit?.trim()) return explicit.trim();
	if (!params.channelAccessToken) throw new Error(`LINE channel access token missing for account "${params.accountId}" (set channels.line.channelAccessToken or LINE_CHANNEL_ACCESS_TOKEN).`);
	return params.channelAccessToken.trim();
}
//#endregion
//#region extensions/line/src/send-retry.ts
function isRetryableLinePushError(error) {
	const candidates = collectErrorGraphCandidates(error, (candidate) => [candidate.cause, candidate.error]);
	const httpError = candidates.find((candidate) => candidate instanceof HTTPFetchError);
	if (httpError) return httpError.status >= 500;
	return candidates.some((candidate) => classifyTransientNetworkErrorCode(extractErrorCode(candidate)) !== void 0);
}
/**
* Pushes are non-idempotent without a retry key, so the generic message-matching
* fallback stays off and only the classification above may replay a request.
*/
const runLinePushWithRetries = createChannelApiRetryRunner({
	shouldRetry: isRetryableLinePushError,
	strictShouldRetry: true,
	verbose: true
});
//#endregion
//#region extensions/line/src/send.ts
const userProfileCache = /* @__PURE__ */ new Map();
const PROFILE_CACHE_TTL_MS = 300 * 1e3;
const PROFILE_CACHE_MAX_ENTRIES = 1e3;
const LINE_FLEX_ALT_TEXT_LIMIT = 1500;
const LINE_LOCATION_LABEL_LIMIT = 100;
const LINE_PROVIDER_RESPONSE_MAX_BYTES = 16 * 1024;
function cacheUserProfile(userId, profile) {
	userProfileCache.delete(userId);
	userProfileCache.set(userId, profile);
	if (userProfileCache.size <= PROFILE_CACHE_MAX_ENTRIES) return;
	for (const [key, cached] of userProfileCache) if (profile.fetchedAt - cached.fetchedAt >= PROFILE_CACHE_TTL_MS) userProfileCache.delete(key);
	pruneMapToMaxSize(userProfileCache, PROFILE_CACHE_MAX_ENTRIES);
}
function resolveLineProviderMessageIds(response, operation) {
	const sentMessages = Array.isArray(response?.sentMessages) ? response.sentMessages : [];
	const messageIds = sentMessages.flatMap((entry) => {
		const id = entry && typeof entry === "object" ? entry.id : void 0;
		const messageId = typeof id === "string" ? id.trim() : "";
		return messageId ? [messageId] : [];
	});
	const messageId = messageIds[0];
	if (!messageId || messageIds.length !== sentMessages.length) throw createChannelPartialDeliveryError(/* @__PURE__ */ new Error(`LINE ${operation} response did not include a sent message id`), {
		messageIds,
		visibleReplySent: true
	});
	return {
		messageId,
		messageIds
	};
}
function normalizeTarget(to) {
	const trimmed = to.trim();
	if (!trimmed) throw new Error("Recipient is required for LINE sends");
	const normalized = trimmed.replace(/^line:group:/i, "").replace(/^line:room:/i, "").replace(/^line:user:/i, "").replace(/^line:/i, "");
	if (!normalized) throw new Error("Recipient is required for LINE sends");
	if (normalized.length >= 33 && !/^[CUR]/.test(normalized)) throw new Error(`Recipient is not a valid LINE id (case-sensitive; expected leading capital C/U/R): ${truncateUtf16Safe(normalized, 4)}…`);
	return normalized;
}
function isLineUserChatId(chatId) {
	return /^U/i.test(chatId);
}
function resolveLineMessagingAccount(opts) {
	const account = resolveLineAccount({
		cfg: requireRuntimeConfig(opts.cfg, "LINE send"),
		accountId: opts.accountId
	});
	return {
		account,
		token: resolveLineChannelAccessToken(opts.channelAccessToken, account)
	};
}
function createLineMessagingClient(opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		account,
		client: new MessagingApiClient({ channelAccessToken: token })
	};
}
function createLinePushContext(to, opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		account,
		token,
		chatId: normalizeTarget(to)
	};
}
async function sendLineProviderMessages(operation, token, request, retryKey) {
	const response = await fetchWithRuntimeDispatcherOrMockedGlobal(`https://api.line.me/v2/bot/message/${operation}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
			"User-Agent": `@line/bot-sdk/${version}`,
			...retryKey ? { "X-Line-Retry-Key": retryKey } : {}
		},
		body: JSON.stringify(request)
	});
	const acceptedRetryConflict = retryKey !== void 0 && response.status === 409;
	if (!response.ok && !acceptedRetryConflict) {
		const body = await readResponseTextLimited(response, LINE_PROVIDER_RESPONSE_MAX_BYTES).catch(() => "");
		throw new HTTPFetchError(`${response.status} - ${response.statusText}`, {
			status: response.status,
			statusText: response.statusText,
			headers: response.headers,
			body
		});
	}
	try {
		return await readProviderJsonResponse(response, `LINE ${operation} response`, { maxBytes: LINE_PROVIDER_RESPONSE_MAX_BYTES });
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: [],
			visibleReplySent: true
		});
	}
}
function createTextMessage(text) {
	return {
		type: "text",
		text
	};
}
function createImageMessage(originalContentUrl, previewImageUrl) {
	return {
		type: "image",
		originalContentUrl,
		previewImageUrl: previewImageUrl ?? originalContentUrl
	};
}
function createVideoMessage(originalContentUrl, previewImageUrl, trackingId) {
	return {
		type: "video",
		originalContentUrl,
		previewImageUrl,
		...trackingId ? { trackingId } : {}
	};
}
function createAudioMessage(originalContentUrl, durationMs) {
	return {
		type: "audio",
		originalContentUrl,
		duration: durationMs
	};
}
function isValidLineLocation(location) {
	return location.title.trim().length > 0 && location.address.trim().length > 0;
}
function locationTextFallback(location) {
	return {
		type: "text",
		text: [...[location.title, location.address].map((label) => truncateUtf16Safe(label.trim(), LINE_LOCATION_LABEL_LIMIT)).filter(Boolean), `${location.latitude}, ${location.longitude}`].join("\n")
	};
}
function createLocationMessage(location) {
	if (!isValidLineLocation(location)) return locationTextFallback(location);
	return {
		type: "location",
		title: truncateUtf16Safe(location.title, LINE_LOCATION_LABEL_LIMIT),
		address: truncateUtf16Safe(location.address, LINE_LOCATION_LABEL_LIMIT),
		latitude: location.latitude,
		longitude: location.longitude
	};
}
function logLineHttpError(err, context) {
	if (!err || typeof err !== "object") return;
	const { status, statusText, body } = err;
	if (typeof body === "string") logVerbose(`line: ${context} failed (${status ? `${status} ${statusText ?? ""}`.trim() : "unknown status"}): ${body}`);
}
function recordLineOutboundActivity(accountId, delivery) {
	try {
		recordChannelActivity({
			channel: "line",
			accountId,
			direction: "outbound"
		});
	} catch (error) {
		throw createChannelPartialDeliveryError(error, {
			messageIds: delivery.messageIds,
			...delivery.receipt ? { receipt: delivery.receipt } : {},
			visibleReplySent: true
		});
	}
}
function resolveLineReceiptKind(messages) {
	const types = new Set(messages.map((message) => message.type));
	if (types.has("audio")) return "voice";
	if (types.has("image") || types.has("video")) return "media";
	if (types.has("flex") || types.has("template") || types.has("location")) return "card";
	if (types.has("text")) return "text";
	return "unknown";
}
async function pushLineMessages(to, messages, opts, behavior = {}) {
	if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
	const { account, token, chatId } = createLinePushContext(to, opts);
	const normalizedMessages = messages.map(normalizeLineMessageActions);
	const retryKey = randomUUID();
	const { messageId, messageIds } = resolveLineProviderMessageIds(await runLinePushWithRetries(async () => {
		try {
			return await sendLineProviderMessages("push", token, {
				to: chatId,
				messages: normalizedMessages
			}, retryKey);
		} catch (err) {
			if (behavior.errorContext) logLineHttpError(err, behavior.errorContext);
			throw err;
		}
	}, "line:push"), "push");
	const result = {
		messageId,
		chatId,
		receipt: createLineSendReceipt({
			messageId,
			messageIds,
			chatId,
			kind: resolveLineReceiptKind(messages),
			messageCount: messages.length
		})
	};
	recordLineOutboundActivity(account.accountId, {
		messageIds,
		receipt: result.receipt
	});
	if (opts.verbose) logVerbose(behavior.verboseMessage?.(chatId, messages.length) ?? `line: pushed ${messages.length} messages to ${chatId}`);
	return result;
}
async function replyLineMessages(replyToken, messages, opts) {
	const { account, token } = resolveLineMessagingAccount(opts);
	return {
		...resolveLineProviderMessageIds(await sendLineProviderMessages("reply", token, {
			replyToken,
			messages: messages.map(normalizeLineMessageActions)
		}), "reply"),
		accountId: account.accountId
	};
}
async function sendMessageLine(to, text, opts) {
	const chatId = normalizeTarget(to);
	const messages = [];
	const mediaUrl = opts.mediaUrl?.trim();
	if (mediaUrl) {
		await validateLineMediaUrl(mediaUrl);
		switch (opts.mediaKind) {
			case "video": {
				const previewImageUrl = opts.previewImageUrl?.trim();
				if (!previewImageUrl) throw new Error("LINE video messages require previewImageUrl to reference an image URL");
				await validateLineMediaUrl(previewImageUrl);
				const trackingId = isLineUserChatId(chatId) ? opts.trackingId : void 0;
				messages.push(createVideoMessage(mediaUrl, previewImageUrl, trackingId));
				break;
			}
			case "audio":
				messages.push(createAudioMessage(mediaUrl, opts.durationMs ?? 6e4));
				break;
			default:
				{
					const previewImageUrl = opts.previewImageUrl?.trim() || mediaUrl;
					await validateLineMediaUrl(previewImageUrl);
					messages.push(createImageMessage(mediaUrl, previewImageUrl));
				}
				break;
		}
	}
	if (text?.trim()) messages.push(createTextMessage(text.trim()));
	if (messages.length === 0) throw new Error("Message must be non-empty for LINE sends");
	if (opts.replyToken) {
		const { messageId, messageIds, accountId } = await replyLineMessages(opts.replyToken, messages, opts);
		const result = {
			messageId,
			chatId,
			receipt: createLineSendReceipt({
				messageId,
				messageIds,
				chatId,
				kind: resolveLineReceiptKind(messages),
				messageCount: messages.length
			})
		};
		recordLineOutboundActivity(accountId, {
			messageIds,
			receipt: result.receipt
		});
		if (opts.verbose) logVerbose(`line: replied to ${chatId}`);
		return result;
	}
	return pushLineMessages(chatId, messages, opts, { verboseMessage: (resolvedChatId) => `line: pushed message to ${resolvedChatId}` });
}
async function pushMessageLine(to, text, opts) {
	return sendMessageLine(to, text, {
		...opts,
		replyToken: void 0
	});
}
async function replyMessageLine(replyToken, messages, opts) {
	const { messageIds, accountId } = await replyLineMessages(replyToken, messages, opts);
	recordLineOutboundActivity(accountId, { messageIds });
	if (opts.verbose) logVerbose(`line: replied with ${messages.length} messages`);
}
async function pushMessagesLine(to, messages, opts) {
	return pushLineMessages(to, messages, opts, { errorContext: "push message" });
}
function createFlexMessage(altText, contents) {
	return {
		type: "flex",
		altText: truncateUtf16Safe(altText, LINE_FLEX_ALT_TEXT_LIMIT),
		contents
	};
}
async function pushImageMessage(to, originalContentUrl, previewImageUrl, opts) {
	await validateLineMediaUrl(originalContentUrl);
	if (previewImageUrl) await validateLineMediaUrl(previewImageUrl);
	return pushLineMessages(to, [createImageMessage(originalContentUrl, previewImageUrl)], opts, { verboseMessage: (chatId) => `line: pushed image to ${chatId}` });
}
async function pushLocationMessage(to, location, opts) {
	return pushLineMessages(to, [createLocationMessage(location)], opts, { verboseMessage: (chatId) => `line: pushed location to ${chatId}` });
}
async function pushFlexMessage(to, altText, contents, opts) {
	return pushLineMessages(to, [createFlexMessage(altText, contents)], opts, {
		errorContext: "push flex message",
		verboseMessage: (chatId) => `line: pushed flex message to ${chatId}`
	});
}
async function pushTemplateMessage(to, template, opts) {
	return pushLineMessages(to, [template], opts, { verboseMessage: (chatId) => `line: pushed template message to ${chatId}` });
}
async function pushTextMessageWithQuickReplies(to, text, quickReplyLabels, opts) {
	return pushLineMessages(to, [createTextMessageWithQuickReplies(text, quickReplyLabels)], opts, { verboseMessage: (chatId) => `line: pushed message with quick replies to ${chatId}` });
}
function createQuickReplyItems(labels) {
	return { items: labels.slice(0, 13).map((label) => ({
		type: "action",
		action: messageAction(label, label)
	})) };
}
function createTextMessageWithQuickReplies(text, quickReplyLabels) {
	return {
		type: "text",
		text,
		quickReply: createQuickReplyItems(quickReplyLabels)
	};
}
async function showLoadingAnimation(chatId, opts) {
	const { client } = createLineMessagingClient(opts);
	try {
		await client.showLoadingAnimation({
			chatId: normalizeTarget(chatId),
			loadingSeconds: opts.loadingSeconds ?? 20
		});
		logVerbose(`line: showing loading animation to ${chatId}`);
	} catch (err) {
		logVerbose(`line: loading animation failed (non-fatal): ${String(err)}`);
	}
}
async function getUserProfile(userId, opts) {
	if (opts.useCache ?? true) {
		const cached = userProfileCache.get(userId);
		if (cached && Date.now() - cached.fetchedAt < PROFILE_CACHE_TTL_MS) return {
			displayName: cached.displayName,
			pictureUrl: cached.pictureUrl
		};
	}
	const { client } = createLineMessagingClient(opts);
	try {
		const profile = await client.getProfile(userId);
		const result = {
			displayName: profile.displayName,
			pictureUrl: profile.pictureUrl
		};
		cacheUserProfile(userId, {
			...result,
			fetchedAt: Date.now()
		});
		return result;
	} catch (err) {
		logVerbose(`line: failed to fetch profile for ${userId}: ${String(err)}`);
		return null;
	}
}
async function getUserDisplayName(userId, opts) {
	return (await getUserProfile(userId, opts))?.displayName ?? userId;
}
//#endregion
export { replyMessageLine as _, createQuickReplyItems as a, resolveLineChannelAccessToken as b, getUserDisplayName as c, pushImageMessage as d, pushLocationMessage as f, pushTextMessageWithQuickReplies as g, pushTemplateMessage as h, createLocationMessage as i, getUserProfile as l, pushMessagesLine as m, createFlexMessage as n, createTextMessageWithQuickReplies as o, pushMessageLine as p, createImageMessage as r, createVideoMessage as s, createAudioMessage as t, pushFlexMessage as u, sendMessageLine as v, showLoadingAnimation as y };
