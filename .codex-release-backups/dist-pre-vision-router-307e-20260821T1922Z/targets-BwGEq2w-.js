import { C as parseStrictNonNegativeInteger, w as parseStrictPositiveInteger } from "./number-coercion-oCkfUEEq.js";
import "./number-runtime-CoAPZzJY.js";
//#region extensions/telegram/src/targets.ts
const TELEGRAM_NUMERIC_CHAT_ID_REGEX = /^-?\d+$/;
const TELEGRAM_USERNAME_REGEX = /^[A-Za-z0-9_]{5,}$/i;
function stripTelegramInternalPrefixes(to) {
	let trimmed = to.trim();
	let strippedTelegramPrefix = false;
	while (true) {
		const next = (() => {
			if (/^(telegram|tg):/i.test(trimmed)) {
				strippedTelegramPrefix = true;
				return trimmed.replace(/^(telegram|tg):/i, "").trim();
			}
			if (strippedTelegramPrefix && /^group:/i.test(trimmed)) return trimmed.replace(/^group:/i, "").trim();
			return trimmed;
		})();
		if (next === trimmed) return trimmed;
		trimmed = next;
	}
}
function normalizeTelegramChatId(raw) {
	const stripped = stripTelegramInternalPrefixes(raw);
	if (!stripped) return;
	if (TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(stripped)) return stripped;
}
function isNumericTelegramChatId(raw) {
	return TELEGRAM_NUMERIC_CHAT_ID_REGEX.test(raw.trim());
}
function normalizeTelegramOutboundTarget(raw) {
	const trimmed = raw.trim();
	const legacyGroupMatch = /^group:(-?\d+(?::(?:direct-topic|topic):\d+|:\d+)?)$/i.exec(trimmed);
	if (legacyGroupMatch?.[1]) return legacyGroupMatch[1];
	return raw;
}
function normalizeTelegramLookupTarget(raw) {
	const stripped = stripTelegramInternalPrefixes(raw);
	if (!stripped) return;
	if (isNumericTelegramChatId(stripped)) return stripped;
	const tmeMatch = /^(?:https?:\/\/)?t\.me\/([A-Za-z0-9_]+)$/i.exec(stripped);
	if (tmeMatch?.[1]) return `@${tmeMatch[1]}`;
	if (stripped.startsWith("@")) {
		const handle = stripped.slice(1);
		if (!handle || !TELEGRAM_USERNAME_REGEX.test(handle)) return;
		return `@${handle}`;
	}
	if (TELEGRAM_USERNAME_REGEX.test(stripped)) return `@${stripped}`;
}
/**
* Parse a Telegram delivery target into chatId and optional topic/thread ID.
*
* Supported formats:
* - `chatId` (plain chat ID, t.me link, @username, or internal prefixes like `telegram:...`)
* - `chatId:topicId` (numeric topic/thread ID)
* - `chatId:topic:topicId` (explicit topic marker; preferred)
* - `chatId:direct-topic:topicId` (channel Direct Messages topic)
*/
function resolveTelegramChatType(chatId) {
	const trimmed = chatId.trim();
	if (!trimmed) return "unknown";
	if (isNumericTelegramChatId(trimmed)) return trimmed.startsWith("-") ? "group" : "direct";
	return "unknown";
}
function parseTelegramTarget(to) {
	const normalized = stripTelegramInternalPrefixes(to);
	const match = /^(.+?):(?:(direct-topic|topic):)?(\d+)$/.exec(normalized);
	const chatId = match?.[1];
	const topicIdText = match?.[3];
	if (chatId && topicIdText) {
		const directTopic = match[2] === "direct-topic";
		const topicId = directTopic ? parseStrictPositiveInteger(topicIdText) : parseStrictNonNegativeInteger(topicIdText);
		if (topicId !== void 0) return directTopic ? {
			chatId,
			directMessagesTopicId: topicId,
			chatType: resolveTelegramChatType(chatId)
		} : {
			chatId,
			messageThreadId: topicId,
			chatType: resolveTelegramChatType(chatId)
		};
	}
	return {
		chatId: normalized,
		chatType: match ? "unknown" : resolveTelegramChatType(normalized)
	};
}
function resolveTelegramTargetChatType(target) {
	return parseTelegramTarget(target).chatType;
}
//#endregion
export { parseTelegramTarget as a, normalizeTelegramOutboundTarget as i, normalizeTelegramChatId as n, resolveTelegramTargetChatType as o, normalizeTelegramLookupTarget as r, stripTelegramInternalPrefixes as s, isNumericTelegramChatId as t };
