import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./channel-outbound-DO-F9-0m.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import "./error-runtime-CmA1H4Zg.js";
import { d as stripTargetKindPrefix, u as stripChannelTargetPrefix } from "./core-CQsT-38z.js";
import "./text-utility-runtime-BNhX-3os.js";
import { a as resolveZaloToken, i as resolveZaloAccount } from "./accounts-GafVFMJs.js";
import { c as sendPhoto, s as sendMessage } from "./api-A1q4JRI9.js";
import { t as resolveZaloProxyFetch } from "./proxy-DKATBiE_.js";
//#region extensions/zalo/src/send.ts
function createZaloSendReceipt(params) {
	const messageId = params.messageId?.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageId ? [{
			channel: "zalo",
			messageId,
			chatId: params.chatId
		}] : [],
		kind: params.kind
	});
}
function toZaloSendResult(response, params) {
	if (response.ok && response.result) return {
		ok: true,
		messageId: response.result.message_id,
		receipt: createZaloSendReceipt({
			messageId: response.result.message_id,
			chatId: params.chatId,
			kind: params.kind
		})
	};
	return {
		ok: false,
		error: "Failed to send message",
		receipt: createZaloSendReceipt({
			chatId: params.chatId,
			kind: params.kind
		})
	};
}
async function runZaloSend(failureMessage, params, send) {
	try {
		const result = toZaloSendResult(await send(), params);
		return result.ok ? result : {
			ok: false,
			error: failureMessage,
			receipt: result.receipt
		};
	} catch (err) {
		return {
			ok: false,
			error: formatErrorMessage(err),
			receipt: createZaloSendReceipt({
				chatId: params.chatId,
				kind: params.kind
			})
		};
	}
}
function resolveSendContext(options) {
	if (options.cfg) {
		const account = resolveZaloAccount({
			cfg: options.cfg,
			accountId: options.accountId
		});
		return {
			token: options.token || account.token,
			fetcher: resolveZaloProxyFetch(options.proxy ?? account.config.proxy)
		};
	}
	const token = options.token ?? resolveZaloToken(void 0, options.accountId).token;
	const proxy = options.proxy;
	return {
		token,
		fetcher: resolveZaloProxyFetch(proxy)
	};
}
function resolveValidatedSendContext(chatId, options) {
	const { token, fetcher } = resolveSendContext(options);
	if (!token) return {
		ok: false,
		error: "No Zalo bot token configured"
	};
	const trimmedChatId = normalizeZaloSendChatId(chatId);
	if (!trimmedChatId) return {
		ok: false,
		error: "No chat_id provided"
	};
	return {
		ok: true,
		chatId: trimmedChatId,
		token,
		fetcher
	};
}
function normalizeZaloSendChatId(chatId) {
	return stripTargetKindPrefix(stripChannelTargetPrefix(chatId, "zalo", "zl"));
}
function resolveSendContextOrFailure(chatId, options) {
	const context = resolveValidatedSendContext(chatId, options);
	return context.ok ? { context } : { failure: {
		ok: false,
		error: context.error,
		receipt: createZaloSendReceipt({
			chatId,
			kind: "unknown"
		})
	} };
}
async function sendMessageZalo(chatId, text, options = {}) {
	const resolved = resolveSendContextOrFailure(chatId, options);
	if ("failure" in resolved) return resolved.failure;
	const { context } = resolved;
	if (options.mediaUrl && (options.mediaUrl.trim() || !text)) {
		const photoUrl = options.mediaUrl.trim();
		if (!photoUrl) return {
			ok: false,
			error: "No photo URL provided",
			receipt: createZaloSendReceipt({
				chatId: context.chatId,
				kind: "media"
			})
		};
		const caption = text || options.caption;
		return await runZaloSend("Failed to send photo", {
			chatId: context.chatId,
			kind: "media"
		}, () => sendPhoto(context.token, {
			chat_id: context.chatId,
			photo: photoUrl,
			caption: caption !== void 0 ? truncateUtf16Safe(caption, 2e3) : void 0
		}, context.fetcher));
	}
	return await runZaloSend("Failed to send message", {
		chatId: context.chatId,
		kind: "text"
	}, () => sendMessage(context.token, {
		chat_id: context.chatId,
		text: truncateUtf16Safe(text, 2e3)
	}, context.fetcher));
}
//#endregion
export { sendMessageZalo as t };
