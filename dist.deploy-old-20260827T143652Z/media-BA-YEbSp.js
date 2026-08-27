import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { C as parseStrictNonNegativeInteger } from "./number-coercion-oCkfUEEq.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { i as writeExternalFileWithinRoot } from "./fs-safe-C9N8pCh1.js";
import { r as readRegularFile } from "./regular-file-CXw3t-8J.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BBjU-hqW.js";
import { r as withTempWorkspace } from "./private-temp-workspace-B5dYiPlo.js";
import { i as withTempDownloadPath } from "./temp-download-DlDeGU0G.js";
import { _ as resolvePinnedHostnameWithPolicy, c as isBlockedHostnameOrIp } from "./ssrf-UFPP-fbI.js";
import { r as logVerbose } from "./globals-CAwGc4B6.js";
import { o as mediaKindFromMime } from "./constants-Mf57IYS0.js";
import { n as detectMime } from "./mime-Hm4eS2i0.js";
import { c as runFfmpeg, l as runFfprobe, u as MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS } from "./media-services-BMidrwE0.js";
import { d as saveMediaBuffer, p as saveMediaStream } from "./store-CNsqBmYb.js";
import { n as PlatformMessageNotDispatchedError } from "./deliver-types-BGUCRKo2.js";
import { t as buildOutboundMediaLoadOptions } from "./load-options-VzbF4ozo.js";
import "./temp-path-ChKDkme1.js";
import "./error-runtime-CmlvK1A3.js";
import "./runtime-env-COkbgBI4.js";
import "./number-runtime-CoAPZzJY.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-Co-K4Dxq.js";
import "./security-runtime-Bm9RUgAZ.js";
import "./text-chunking-DrVvfnLf.js";
import { t as convertMarkdownTables } from "./tables-Bu53rjrA.js";
import "./media-store-DwVYtNFY.js";
import "./media-runtime-vkQwnhW4.js";
import { t as resolveMarkdownTableMode } from "./markdown-tables-DAUsjtN3.js";
import "./media-mime-DQ4Ibr5o.js";
import "./markdown-table-runtime-yelWZff9.js";
import { l as resolveFeishuRuntimeAccount } from "./accounts-DSvhJ6ZC.js";
import { i as resolveReceiveIdType, r as normalizeFeishuTarget } from "./targets-Bo4YyHFo.js";
import { c as assertFeishuPostWithinEnvelope, f as materializeFeishuPostMarkdownSoftBreaks, i as toFeishuSendResult, l as buildFeishuPostMessageContent, o as resolveFeishuCardTemplate, r as resolveFeishuReceiptKind, t as assertFeishuMessageApiSuccess } from "./send-result-Dn-8KnNh.js";
import { n as createFeishuClient } from "./client-WjHY85b1.js";
import { t as getFeishuRuntime } from "./runtime-zwHao5bm.js";
import { m as requestFeishuApi } from "./drive-Vas8cTpe.js";
import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
//#region extensions/feishu/src/identity-header.ts
const emojiSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl ? new Intl.Segmenter(void 0, { granularity: "grapheme" }) : null;
const keycapEmojiPattern = /^[0-9#*]\uFE0F?\u20E3$/u;
const emojiLikeSegmentPattern = /[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Regional_Indicator}]/u;
function splitGraphemes(input) {
	if (!emojiSegmenter) return Array.from(input);
	return Array.from(emojiSegmenter.segment(input), (segment) => segment.segment);
}
function isEmojiSegment(segment) {
	return keycapEmojiPattern.test(segment) || emojiLikeSegmentPattern.test(segment);
}
function resolveFeishuIdentityEmoji(raw) {
	const trimmed = raw?.trim();
	if (!trimmed) return;
	return splitGraphemes(trimmed).filter(isEmojiSegment).join("") || void 0;
}
function resolveFeishuIdentityHeaderTitle(identity) {
	if (!identity) return "";
	const name = identity.name?.trim() ?? "";
	const emoji = resolveFeishuIdentityEmoji(identity.emoji);
	return (emoji ? `${emoji} ${name}` : name).trim();
}
//#endregion
//#region extensions/feishu/src/media-fallback.ts
const FEISHU_MEDIA_UPLOAD_FAILURE_FALLBACK_TEXT = "Media upload failed. Please try again.";
function hasAsciiControlCharacter(value) {
	return Array.from(value).some((character) => {
		const code = character.charCodeAt(0);
		return code <= 31 || code === 127;
	});
}
async function resolvePublicFeishuMediaReference(value) {
	const raw = value?.trim();
	if (!raw || hasAsciiControlCharacter(raw)) return;
	try {
		const parsed = new URL(raw);
		if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return;
		if (parsed.username || parsed.password || isBlockedHostnameOrIp(parsed.hostname)) return;
		await resolvePinnedHostnameWithPolicy(parsed.hostname);
		return parsed.href;
	} catch {
		return;
	}
}
async function buildFeishuMediaFallbackText(params) {
	const mediaUrl = await resolvePublicFeishuMediaReference(params.mediaUrl);
	const attachmentText = mediaUrl ? `${params.mediaLinkStyle === "plain" ? "" : "📎 "}${mediaUrl}` : FEISHU_MEDIA_UPLOAD_FAILURE_FALLBACK_TEXT;
	return [params.text?.trim(), attachmentText].filter(Boolean).join("\n\n");
}
//#endregion
//#region extensions/feishu/src/external-keys.ts
const CONTROL_CHARS_RE = /\p{Cc}/u;
const MAX_EXTERNAL_KEY_LENGTH = 512;
function normalizeFeishuExternalKey(value) {
	if (typeof value !== "string") return;
	const normalized = value.trim();
	if (!normalized || normalized.length > MAX_EXTERNAL_KEY_LENGTH) return;
	if (CONTROL_CHARS_RE.test(normalized)) return;
	if (normalized.includes("/") || normalized.includes("\\") || normalized.includes("..")) return;
	return normalized;
}
//#endregion
//#region extensions/feishu/src/media-chunk-idle.ts
var FeishuInboundMediaTimeoutError = class extends Error {
	constructor(chunkTimeoutMs) {
		super(`Feishu media download stalled: no data received for ${chunkTimeoutMs}ms`);
		this.name = "FeishuInboundMediaTimeoutError";
		this.chunkTimeoutMs = chunkTimeoutMs;
	}
};
function destroySource(source) {
	const s = source;
	if (typeof s.destroy === "function") s.destroy();
}
function withChunkIdleTimeout(source, chunkTimeoutMs) {
	return { async *[Symbol.asyncIterator]() {
		const iterator = source[Symbol.asyncIterator]();
		let exhausted = false;
		try {
			while (true) {
				const nextPromise = iterator.next();
				let timeoutHandle;
				const timeoutPromise = new Promise((_, reject) => {
					timeoutHandle = setTimeout(() => {
						reject(new FeishuInboundMediaTimeoutError(chunkTimeoutMs));
						try {
							destroySource(source);
						} catch {}
					}, chunkTimeoutMs);
				});
				let result;
				try {
					result = await Promise.race([nextPromise, timeoutPromise]);
				} finally {
					if (timeoutHandle !== void 0) clearTimeout(timeoutHandle);
				}
				if (result.done) {
					exhausted = true;
					return;
				}
				yield result.value;
			}
		} finally {
			if (!exhausted && typeof iterator.return === "function") iterator.return().catch(() => void 0);
		}
	} };
}
function saveMediaStreamWithIdleTimeout(stream, contentType, maxBytes, fileName, chunkTimeoutMs) {
	return saveMediaStream(withChunkIdleTimeout(stream, chunkTimeoutMs), contentType, "inbound", maxBytes, fileName);
}
//#endregion
//#region extensions/feishu/src/send-target.ts
function resolveFeishuSendTarget(params) {
	const target = params.to.trim();
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const client = createFeishuClient(account);
	const receiveId = normalizeFeishuTarget(target);
	if (!receiveId) throw new Error(`Invalid Feishu target: ${params.to}`);
	return {
		client,
		receiveId,
		receiveIdType: resolveReceiveIdType(target.replace(/^(feishu|lark):/i, ""))
	};
}
//#endregion
//#region extensions/feishu/src/post.ts
const FALLBACK_POST_TEXT = "[Rich text message]";
const MARKDOWN_SPECIAL_CHARS = /([\\`*_{}[\]()#+\-!|>~])/g;
function toStringOrEmpty(value) {
	return typeof value === "string" ? value : "";
}
function escapeMarkdownText(text) {
	return text.replace(MARKDOWN_SPECIAL_CHARS, "\\$1");
}
function toBoolean(value) {
	return value === true || value === 1 || value === "true";
}
function isStyleEnabled(style, key) {
	if (!style) return false;
	return toBoolean(style[key]);
}
function wrapInlineCode(text) {
	const maxRun = Math.max(0, ...(text.match(/`+/g) ?? []).map((run) => run.length));
	const fence = "`".repeat(maxRun + 1);
	return `${fence}${text.startsWith("`") || text.endsWith("`") ? ` ${text} ` : text}${fence}`;
}
function sanitizeFenceLanguage(language) {
	return language.trim().replace(/[^A-Za-z0-9_+#.-]/g, "");
}
function renderTextElement(element) {
	const text = toStringOrEmpty(element.text);
	const style = isRecord(element.style) ? element.style : void 0;
	if (isStyleEnabled(style, "code")) return wrapInlineCode(text);
	let rendered = escapeMarkdownText(text);
	if (!rendered) return "";
	if (isStyleEnabled(style, "bold")) rendered = `**${rendered}**`;
	if (isStyleEnabled(style, "italic")) rendered = `*${rendered}*`;
	if (isStyleEnabled(style, "underline")) rendered = `<u>${rendered}</u>`;
	if (isStyleEnabled(style, "strikethrough") || isStyleEnabled(style, "line_through") || isStyleEnabled(style, "lineThrough")) rendered = `~~${rendered}~~`;
	return rendered;
}
function renderLinkElement(element) {
	const href = toStringOrEmpty(element.href).trim();
	const text = toStringOrEmpty(element.text) || href;
	if (!text) return "";
	if (!href) return escapeMarkdownText(text);
	return `[${escapeMarkdownText(text)}](${href})`;
}
function renderMentionElement(element) {
	const mention = toStringOrEmpty(element.user_name) || toStringOrEmpty(element.user_id) || toStringOrEmpty(element.open_id);
	if (!mention) return "";
	return `@${escapeMarkdownText(mention)}`;
}
function renderEmotionElement(element) {
	return escapeMarkdownText(toStringOrEmpty(element.emoji) || toStringOrEmpty(element.text) || toStringOrEmpty(element.emoji_type));
}
function renderCodeBlockElement(element) {
	const language = sanitizeFenceLanguage(toStringOrEmpty(element.language) || toStringOrEmpty(element.lang));
	const code = (toStringOrEmpty(element.text) || toStringOrEmpty(element.content)).replace(/\r\n/g, "\n");
	return `\`\`\`${language}\n${code}${code.endsWith("\n") ? "" : "\n"}\`\`\``;
}
function renderElement(element, imageKeys, mediaKeys, mentionedOpenIds, renderMediaPlaceholders) {
	if (!isRecord(element)) return escapeMarkdownText(toStringOrEmpty(element));
	switch (normalizeLowercaseStringOrEmpty(toStringOrEmpty(element.tag))) {
		case "text": return renderTextElement(element);
		case "a": return renderLinkElement(element);
		case "at":
			{
				const normalizedMention = normalizeFeishuExternalKey(toStringOrEmpty(element.open_id) || toStringOrEmpty(element.user_id));
				if (normalizedMention) mentionedOpenIds.push(normalizedMention);
			}
			return renderMentionElement(element);
		case "img": {
			const imageKey = normalizeFeishuExternalKey(toStringOrEmpty(element.image_key));
			if (imageKey) imageKeys.push(imageKey);
			return renderMediaPlaceholders ? "![image]" : "";
		}
		case "media": {
			const fileKey = normalizeFeishuExternalKey(toStringOrEmpty(element.file_key));
			if (fileKey) {
				const fileName = toStringOrEmpty(element.file_name) || void 0;
				mediaKeys.push({
					fileKey,
					fileName
				});
			}
			return renderMediaPlaceholders ? "[media]" : "";
		}
		case "emotion": return renderEmotionElement(element);
		case "md":
		case "lark_md": return toStringOrEmpty(element.text) || toStringOrEmpty(element.content);
		case "br": return "\n";
		case "hr": return "\n\n---\n\n";
		case "code": {
			const code = toStringOrEmpty(element.text) || toStringOrEmpty(element.content);
			return code ? wrapInlineCode(code) : "";
		}
		case "code_block":
		case "pre": return renderCodeBlockElement(element);
		default: return escapeMarkdownText(toStringOrEmpty(element.text));
	}
}
function toPostPayload(candidate) {
	if (!isRecord(candidate) || !Array.isArray(candidate.content)) return null;
	return {
		title: toStringOrEmpty(candidate.title),
		content: candidate.content
	};
}
function resolveLocalePayload(candidate) {
	const direct = toPostPayload(candidate);
	if (direct) return direct;
	if (!isRecord(candidate)) return null;
	for (const value of Object.values(candidate)) {
		const localePayload = toPostPayload(value);
		if (localePayload) return localePayload;
	}
	return null;
}
function resolvePostPayload(parsed) {
	const direct = toPostPayload(parsed);
	if (direct) return direct;
	if (!isRecord(parsed)) return null;
	const wrappedPost = resolveLocalePayload(parsed.post);
	if (wrappedPost) return wrappedPost;
	return resolveLocalePayload(parsed);
}
function parsePostContent(content, options = {}) {
	try {
		const payload = resolvePostPayload(JSON.parse(content));
		if (!payload) return {
			textContent: FALLBACK_POST_TEXT,
			imageKeys: [],
			mediaKeys: [],
			mentionedOpenIds: []
		};
		const imageKeys = [];
		const mediaKeys = [];
		const mentionedOpenIds = [];
		const paragraphs = [];
		for (const paragraph of payload.content) {
			if (!Array.isArray(paragraph)) continue;
			let renderedParagraph = "";
			for (const element of paragraph) renderedParagraph += renderElement(element, imageKeys, mediaKeys, mentionedOpenIds, options.renderMediaPlaceholders !== false);
			paragraphs.push(renderedParagraph);
		}
		return {
			textContent: [escapeMarkdownText(payload.title.trim()), paragraphs.join("\n").trim()].filter(Boolean).join("\n\n").trim() || (options.emptyTextFallback ?? FALLBACK_POST_TEXT),
			imageKeys,
			mediaKeys,
			mentionedOpenIds
		};
	} catch {
		return {
			textContent: FALLBACK_POST_TEXT,
			imageKeys: [],
			mediaKeys: [],
			mentionedOpenIds: []
		};
	}
}
//#endregion
//#region extensions/feishu/src/interactive-message-content.ts
const INTERACTIVE_CARD_FALLBACK_TEXT = "[Interactive Card]";
const POST_FALLBACK_TEXT = "[Rich text message]";
function normalizeCardTemplateVariable(value) {
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
}
function readCardTemplateVariables(parsed) {
	const variables = /* @__PURE__ */ new Map();
	for (const source of [parsed.template_variable, parsed.template_variables]) {
		if (!isRecord(source)) continue;
		for (const [key, value] of Object.entries(source)) {
			const normalized = normalizeCardTemplateVariable(value);
			if (normalized !== void 0) variables.set(key, normalized);
		}
	}
	return variables;
}
function applyCardTemplateVariables(text, variables) {
	if (variables.size === 0) return text;
	return text.replace(/\$\{([A-Za-z0-9_.-]+)\}|\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (match, a, b) => {
		const variableName = typeof a === "string" ? a : b;
		return variables.get(variableName) ?? match;
	});
}
function normalizeInteractiveValue(value, variables) {
	const scalar = normalizeCardTemplateVariable(value);
	if (scalar !== void 0) return applyCardTemplateVariables(scalar, variables);
	if (Array.isArray(value)) return value.map((entry) => normalizeInteractiveValue(entry, variables)).filter(Boolean).join(", ");
	if (!isRecord(value)) return "";
	for (const key of [
		"content",
		"text",
		"label",
		"name",
		"display_name",
		"user_name",
		"user_id",
		"open_id",
		"id",
		"value"
	]) {
		const text = normalizeInteractiveValue(value[key], variables);
		if (text) return text;
	}
	return "";
}
function extractInteractiveTableText(element, variables) {
	if (!Array.isArray(element.columns) || !Array.isArray(element.rows)) return;
	const columns = element.columns.flatMap((column) => {
		if (!isRecord(column) || typeof column.name !== "string") return [];
		return [{
			name: column.name,
			title: typeof column.display_name === "string" ? column.display_name : column.name
		}];
	});
	if (columns.length === 0) return;
	const lines = [columns.map((column) => applyCardTemplateVariables(column.title, variables)).join(" | ")];
	for (const row of element.rows) {
		if (!isRecord(row)) continue;
		const cells = columns.map((column) => normalizeInteractiveValue(row[column.name], variables));
		if (cells.some(Boolean)) lines.push(cells.join(" | "));
	}
	return lines.join("\n");
}
function extractInteractiveElementText(element, variables) {
	if (!isRecord(element)) return;
	const tag = typeof element.tag === "string" ? element.tag : "";
	const text = isRecord(element.text) ? element.text : void 0;
	if (tag === "div") {
		const parts = [normalizeInteractiveValue(element.text, variables)];
		if (Array.isArray(element.fields)) parts.push(extractInteractiveElementsText(element.fields, variables));
		return parts.filter(Boolean).join("\n") || void 0;
	}
	if ((tag === "markdown" || tag === "lark_md") && typeof element.content === "string") return applyCardTemplateVariables(element.content, variables);
	if ((tag === "text" || tag === "a" || tag === "button") && element.text !== void 0) return normalizeInteractiveValue(element.text, variables) || void 0;
	if (tag === "at") {
		const mention = normalizeInteractiveValue(element.user_name ?? element.user_id, variables);
		return mention ? mention.startsWith("@") ? mention : `@${mention}` : void 0;
	}
	if (tag === "plain_text" && typeof element.content === "string") return applyCardTemplateVariables(element.content, variables);
	if (tag === "table") return extractInteractiveTableText(element, variables);
	return [
		element.elements,
		element.columns,
		element.children,
		element.fields,
		element.actions
	].filter(Array.isArray).map((children) => extractInteractiveElementsText(children, variables)).filter(Boolean).join("\n") || (typeof text?.content === "string" ? text.content : void 0);
}
function extractInteractiveElementsText(elements, variables) {
	const texts = [];
	for (const element of elements) {
		if (Array.isArray(element)) {
			const row = element.map((part) => extractInteractiveElementText(part, variables)).filter((part) => Boolean(part)).join(" ").trim();
			if (row) texts.push(row);
			continue;
		}
		const text = extractInteractiveElementText(element, variables);
		if (text !== void 0) texts.push(text);
	}
	return texts.join("\n").trim();
}
function readInteractiveElementArrays(parsed) {
	const body = isRecord(parsed.body) ? parsed.body : void 0;
	const elementArrays = [];
	for (const candidate of [parsed.elements, body?.elements]) if (Array.isArray(candidate)) elementArrays.push(candidate);
	for (const candidate of [parsed.i18n_elements, body?.i18n_elements]) {
		if (!isRecord(candidate)) continue;
		for (const localeElements of Object.values(candidate)) if (Array.isArray(localeElements)) elementArrays.push(localeElements);
	}
	return elementArrays;
}
function readInteractiveCardTitle(parsed, variables) {
	if (typeof parsed.title === "string") return applyCardTemplateVariables(parsed.title, variables).trim();
	const header = isRecord(parsed.header) ? parsed.header : void 0;
	const title = isRecord(header?.title) ? header.title : void 0;
	return typeof title?.content === "string" ? applyCardTemplateVariables(title.content, variables).trim() : "";
}
function parseInteractiveCardContent(parsed) {
	if (!isRecord(parsed)) return INTERACTIVE_CARD_FALLBACK_TEXT;
	const variables = readCardTemplateVariables(parsed);
	const title = readInteractiveCardTitle(parsed, variables);
	for (const elements of readInteractiveElementArrays(parsed)) {
		const text = extractInteractiveElementsText(elements, variables);
		if (text) return title ? `${title}\n${text}` : text;
	}
	const postText = parsePostContent(JSON.stringify(parsed)).textContent.trim();
	if (postText && postText !== POST_FALLBACK_TEXT) return postText;
	return title || INTERACTIVE_CARD_FALLBACK_TEXT;
}
//#endregion
//#region extensions/feishu/src/types.ts
function isFeishuGroupChatType(chatType) {
	return chatType === "group" || chatType === "topic_group";
}
//#endregion
//#region extensions/feishu/src/mention.ts
function isFeishuBroadcastMention(mention) {
	const normalizedKey = mention.key?.trim().toLowerCase();
	if (normalizedKey === "@all" || normalizedKey === "@_all") return true;
	return [
		mention.id?.open_id,
		mention.id?.user_id,
		mention.id?.union_id
	].some((id) => id?.trim().toLowerCase() === "all");
}
/**
* Extract mention targets from message event (excluding the bot itself)
*/
function extractMentionTargets(event, botOpenId) {
	return (event.message.mentions ?? []).filter((m) => {
		if (isFeishuBroadcastMention(m)) return false;
		if (m.id.open_id === botOpenId) return false;
		return Boolean(m.id.open_id);
	}).map((m) => ({
		openId: m.id.open_id,
		name: m.name,
		key: m.key
	}));
}
/**
* Check if message is a mention forward request
* Rules:
* - Group: message mentions bot + at least one other user
* - DM: message mentions any user (no need to mention bot)
*/
function isMentionForwardRequest(event, botOpenId) {
	const mentions = event.message.mentions ?? [];
	if (mentions.length === 0) return false;
	const normalizedBotOpenId = botOpenId?.trim();
	if (!normalizedBotOpenId) return false;
	const isDirectMessage = !isFeishuGroupChatType(event.message.chat_type);
	const userMentions = mentions.filter((m) => !isFeishuBroadcastMention(m));
	const hasOtherMention = userMentions.some((m) => m.id.open_id !== normalizedBotOpenId);
	if (isDirectMessage) return hasOtherMention;
	return userMentions.some((m) => m.id.open_id === normalizedBotOpenId) && hasOtherMention;
}
/**
* Format @mention for card message (lark_md)
*/
function formatMentionForCard(target) {
	return `<at id=${target.openId}></at>`;
}
/**
* Build card content with @mentions (Markdown format)
*/
function buildMentionedCardContent(targets, message) {
	if (targets.length === 0) return message;
	return `${targets.map((t) => formatMentionForCard(t)).join(" ")} ${message}`;
}
//#endregion
//#region extensions/feishu/src/send.ts
const WITHDRAWN_REPLY_ERROR_CODES = /* @__PURE__ */ new Set([230011, 231003]);
function shouldFallbackFromReplyTarget(response) {
	if (response.code !== void 0 && WITHDRAWN_REPLY_ERROR_CODES.has(response.code)) return true;
	const msg = normalizeLowercaseStringOrEmpty(response.msg);
	return msg.includes("withdrawn") || msg.includes("not found");
}
/** Check whether a thrown error indicates a withdrawn/not-found reply target. */
function isWithdrawnReplyError(err) {
	if (typeof err !== "object" || err === null) return false;
	const code = err.code;
	if (typeof code === "number" && WITHDRAWN_REPLY_ERROR_CODES.has(code)) return true;
	const response = err.response;
	if (typeof response?.data?.code === "number" && WITHDRAWN_REPLY_ERROR_CODES.has(response.data.code)) return true;
	const cause = err.cause;
	if (cause && cause !== err) return isWithdrawnReplyError(cause);
	return false;
}
/** Send a direct message as a fallback when a reply target is unavailable. */
async function sendFallbackDirect(client, params, errorPrefix) {
	const response = await requestFeishuApi(() => client.im.message.create({
		params: { receive_id_type: params.receiveIdType },
		data: {
			receive_id: params.receiveId,
			content: params.content,
			msg_type: params.msgType
		}
	}), errorPrefix, { includeNestedErrorLogId: true });
	assertFeishuMessageApiSuccess(response, errorPrefix);
	return toFeishuSendResult(response, params.receiveId, resolveFeishuReceiptKind(params.msgType), errorPrefix);
}
async function sendReplyOrFallbackDirect(client, params) {
	if (!params.replyToMessageId) return sendFallbackDirect(client, params.directParams, params.directErrorPrefix);
	const replyTargetFallbackError = params.replyInThread && params.allowTopLevelReplyFallback !== true ? /* @__PURE__ */ new Error("Feishu thread reply failed: reply target is unavailable and cannot safely fall back to a top-level send.") : null;
	let response;
	try {
		response = await requestFeishuApi(() => client.im.message.reply({
			path: { message_id: params.replyToMessageId },
			data: {
				content: params.content,
				msg_type: params.msgType,
				...params.replyInThread ? { reply_in_thread: true } : {}
			}
		}), params.replyErrorPrefix, { includeNestedErrorLogId: true });
	} catch (err) {
		if (!isWithdrawnReplyError(err)) throw err;
		if (replyTargetFallbackError) throw replyTargetFallbackError;
		return sendFallbackDirect(client, params.directParams, params.directErrorPrefix);
	}
	if (shouldFallbackFromReplyTarget(response)) {
		if (replyTargetFallbackError) throw replyTargetFallbackError;
		return sendFallbackDirect(client, params.directParams, params.directErrorPrefix);
	}
	assertFeishuMessageApiSuccess(response, params.replyErrorPrefix);
	return toFeishuSendResult(response, params.directParams.receiveId, resolveFeishuReceiptKind(params.msgType), params.replyErrorPrefix);
}
function parseFeishuMessageContent(rawContent, msgType, messageId) {
	if (!rawContent) return "";
	let parsed;
	try {
		parsed = JSON.parse(rawContent);
	} catch {
		logVerbose(`feishu message content parse failed for ${msgType} message${messageId ? ` (id: ${messageId})` : ""}`);
		return rawContent;
	}
	if (msgType === "text") {
		const text = parsed?.text;
		return typeof text === "string" ? text : "[Text message]";
	}
	if (msgType === "post") return parsePostContent(rawContent).textContent;
	if (msgType === "interactive") return parseInteractiveCardContent(parsed);
	if (typeof parsed === "string") return parsed;
	const genericText = parsed?.text;
	if (typeof genericText === "string" && genericText.trim()) return genericText;
	const genericTitle = parsed?.title;
	if (typeof genericTitle === "string" && genericTitle.trim()) return genericTitle;
	return `[${msgType || "unknown"} message]`;
}
function parseFeishuMessageItem(item, fallbackMessageId) {
	const msgType = item.msg_type ?? "text";
	const rawContent = item.body?.content ?? "";
	return {
		messageId: item.message_id ?? fallbackMessageId ?? "",
		chatId: item.chat_id ?? "",
		chatType: item.chat_type === "group" || item.chat_type === "topic_group" || item.chat_type === "private" || item.chat_type === "p2p" ? item.chat_type : void 0,
		senderId: item.sender?.id,
		senderOpenId: item.sender?.id_type === "open_id" ? item.sender?.id : void 0,
		senderType: item.sender?.sender_type,
		content: parseFeishuMessageContent(rawContent, msgType, item.message_id),
		contentType: msgType,
		createTime: parseStrictNonNegativeInteger(item.create_time),
		...item.root_id ? { rootId: item.root_id } : {},
		threadId: item.thread_id || void 0
	};
}
/**
* Get a message by its ID.
* Useful for fetching quoted/replied message content.
*/
async function getMessageFeishu(params) {
	const { cfg, messageId, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const client = createFeishuClient(account);
	try {
		const response = await client.im.message.get({
			params: { card_msg_content_type: "user_card_content" },
			path: { message_id: messageId }
		});
		if (response.code !== 0) return null;
		const rawItem = response.data?.items?.[0] ?? response.data;
		const item = rawItem && (rawItem.body !== void 0 || rawItem.message_id !== void 0) ? rawItem : null;
		if (!item) return null;
		return parseFeishuMessageItem(item, messageId);
	} catch {
		return null;
	}
}
/**
* List messages in a Feishu thread (topic).
* Uses container_id_type=thread to directly query thread messages,
* which includes both the root message and all replies (including bot replies).
*/
async function listFeishuThreadMessages(params) {
	const { cfg, threadId, currentMessageId, rootMessageId, limit = 20, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	const client = createFeishuClient(account);
	const results = [];
	const seenMessageIds = /* @__PURE__ */ new Set();
	const seenPageTokens = /* @__PURE__ */ new Set();
	let pageToken;
	while (results.length < limit) {
		const response = await client.im.message.list({ params: {
			container_id_type: "thread",
			container_id: threadId,
			sort_type: "ByCreateTimeDesc",
			page_size: Math.min(limit + 1, 50),
			...pageToken ? { page_token: pageToken } : {},
			card_msg_content_type: "user_card_content"
		} });
		if (response.code !== 0) throw new Error(`Feishu thread list failed: code=${response.code} msg=${response.msg ?? "unknown"}`);
		for (const item of response.data?.items ?? []) {
			if (currentMessageId && item.message_id === currentMessageId || rootMessageId && item.message_id === rootMessageId || item.message_id && seenMessageIds.has(item.message_id)) continue;
			const parsed = parseFeishuMessageItem(item);
			if (parsed.messageId) seenMessageIds.add(parsed.messageId);
			results.push({
				messageId: parsed.messageId,
				senderId: parsed.senderId,
				senderType: parsed.senderType,
				content: parsed.content,
				contentType: parsed.contentType,
				createTime: parsed.createTime
			});
			if (results.length >= limit) break;
		}
		if (results.length >= limit || response.data?.has_more !== true) break;
		const nextPageToken = response.data.page_token?.trim();
		if (!nextPageToken || seenPageTokens.has(nextPageToken)) throw new Error(`Feishu thread history pagination returned a ${nextPageToken ? "repeated" : "missing"} page token`);
		seenPageTokens.add(nextPageToken);
		pageToken = nextPageToken;
	}
	results.reverse();
	return results;
}
async function sendMessageFeishu(params) {
	const { cfg, to, text, replyToMessageId, replyInThread, allowTopLevelReplyFallback, mentions, accountId } = params;
	const { client, receiveId, receiveIdType } = resolveFeishuSendTarget({
		cfg,
		to,
		accountId
	});
	const tableMode = resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	});
	const content = buildFeishuPostMessageContent({
		messageText: materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text ?? "", tableMode)),
		mentions
	});
	const msgType = "post";
	assertFeishuPostWithinEnvelope(content, "Feishu post");
	return sendReplyOrFallbackDirect(client, {
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		content,
		msgType,
		directParams: {
			receiveId,
			receiveIdType,
			content,
			msgType
		},
		directErrorPrefix: "Feishu send failed",
		replyErrorPrefix: "Feishu reply failed"
	});
}
async function sendCardFeishu(params) {
	const { cfg, to, card, replyToMessageId, replyInThread, allowTopLevelReplyFallback, accountId } = params;
	const { client, receiveId, receiveIdType } = resolveFeishuSendTarget({
		cfg,
		to,
		accountId
	});
	const content = JSON.stringify(card);
	return sendReplyOrFallbackDirect(client, {
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		content,
		msgType: "interactive",
		directParams: {
			receiveId,
			receiveIdType,
			content,
			msgType: "interactive"
		},
		directErrorPrefix: "Feishu card send failed",
		replyErrorPrefix: "Feishu card reply failed"
	});
}
async function editMessageFeishu(params) {
	const { cfg, messageId, text, card, accountId } = params;
	const account = resolveFeishuRuntimeAccount({
		cfg,
		accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	if ((typeof text === "string" && text.trim().length > 0) === Boolean(card)) throw new Error("Feishu edit requires exactly one of text or card.");
	const client = createFeishuClient(account);
	if (card) {
		const content = JSON.stringify(card);
		const response = await client.im.message.patch({
			path: { message_id: messageId },
			data: { content }
		});
		if (response.code !== 0) throw new Error(`Feishu message edit failed: ${response.msg || `code ${response.code}`}`);
		return {
			messageId,
			contentType: "interactive"
		};
	}
	const content = buildFeishuPostMessageContent({ messageText: materializeFeishuPostMarkdownSoftBreaks(convertMarkdownTables(text, resolveMarkdownTableMode({
		cfg,
		channel: "feishu"
	}))) });
	assertFeishuPostWithinEnvelope(content, "Feishu message edit");
	const response = await client.im.message.patch({
		path: { message_id: messageId },
		data: { content }
	});
	if (response.code !== 0) throw new Error(`Feishu message edit failed: ${response.msg || `code ${response.code}`}`);
	return {
		messageId,
		contentType: "post"
	};
}
/**
* Build a Feishu interactive card with markdown content.
* Cards render markdown properly (code blocks, tables, links, etc.)
* Uses schema 2.0 format for proper markdown rendering.
*/
function buildMarkdownCard(text) {
	return {
		schema: "2.0",
		config: { width_mode: "fill" },
		body: { elements: [{
			tag: "markdown",
			content: text
		}] }
	};
}
/**
* Build a Feishu interactive card with optional header and note footer.
* When header/note are omitted, behaves identically to buildMarkdownCard.
*/
function buildStructuredCard(text, options) {
	const elements = [{
		tag: "markdown",
		content: text
	}];
	if (options?.note) {
		elements.push({ tag: "hr" });
		elements.push({
			tag: "markdown",
			content: `<font color='grey'>${options.note}</font>`
		});
	}
	const card = {
		schema: "2.0",
		config: { width_mode: "fill" },
		body: { elements }
	};
	if (options?.header) card.header = {
		title: {
			tag: "plain_text",
			content: options.header.title
		},
		template: resolveFeishuCardTemplate(options.header.template) ?? "blue"
	};
	return card;
}
/**
* Send a message as a structured card with optional header and note.
*/
async function sendStructuredCardFeishu(params) {
	const { cfg, to, text, replyToMessageId, replyInThread, allowTopLevelReplyFallback, mentions, accountId, header, note } = params;
	let cardText = text;
	if (mentions && mentions.length > 0) cardText = buildMentionedCardContent(mentions, text);
	return sendCardFeishu({
		cfg,
		to,
		card: buildStructuredCard(cardText, {
			header,
			note
		}),
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		accountId
	});
}
/**
* Send a message as a markdown card (interactive message).
* This renders markdown properly in Feishu (code blocks, tables, bold/italic, etc.)
*/
async function sendMarkdownCardFeishu(params) {
	const { cfg, to, text, replyToMessageId, replyInThread, allowTopLevelReplyFallback, mentions, accountId } = params;
	let cardText = text;
	if (mentions && mentions.length > 0) cardText = buildMentionedCardContent(mentions, text);
	return sendCardFeishu({
		cfg,
		to,
		card: buildMarkdownCard(cardText),
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		accountId
	});
}
//#endregion
//#region extensions/feishu/src/media.ts
const FEISHU_MEDIA_HTTP_TIMEOUT_MS = 12e4;
const FEISHU_MAX_FILE_UPLOAD_BYTES = 30 * 1024 * 1024;
const FEISHU_MAX_IMAGE_UPLOAD_BYTES = 10 * 1024 * 1024;
const FEISHU_VOICE_FILE_NAME = "voice.ogg";
const FEISHU_VOICE_SAMPLE_RATE_HZ = 48e3;
const FEISHU_VOICE_BITRATE = "64k";
const FEISHU_SUPPORTED_IMAGE_CONTENT_TYPES = /* @__PURE__ */ new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/bmp",
	"image/x-ms-bmp",
	"image/tiff",
	"image/tif",
	"image/heic",
	"image/x-icon",
	"image/ico",
	"image/vnd.microsoft.icon"
]);
const FEISHU_TRANSCODABLE_AUDIO_EXTS = /* @__PURE__ */ new Set([
	".aac",
	".aiff",
	".alac",
	".amr",
	".caf",
	".flac",
	".m4a",
	".mp3",
	".oga",
	".wav",
	".webm",
	".wma"
]);
async function runBeforeFeishuMessageDispatch(operation) {
	try {
		return await operation();
	} catch (error) {
		if (error instanceof PlatformMessageNotDispatchedError) throw error;
		throw new PlatformMessageNotDispatchedError(`Feishu media preparation failed before message dispatch: ${error instanceof Error ? error.message : String(error)}`, { cause: error });
	}
}
function createConfiguredFeishuMediaClient(params) {
	const account = resolveFeishuRuntimeAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	if (!account.configured) throw new Error(`Feishu account "${account.accountId}" not configured`);
	return {
		account,
		client: createFeishuClient({
			...account,
			httpTimeoutMs: FEISHU_MEDIA_HTTP_TIMEOUT_MS
		})
	};
}
function asHeaderMap(value) {
	if (!value) return;
	const entries = Object.entries(value);
	if (entries.every(([, entry]) => typeof entry === "string" || Array.isArray(entry))) return Object.fromEntries(entries);
}
function extractFeishuUploadKey(response, params) {
	if (!response) throw new Error(`${params.errorPrefix}: empty response`);
	const wrappedResponse = response;
	if (wrappedResponse.code !== void 0 && wrappedResponse.code !== 0) throw new Error(`${params.errorPrefix}: ${wrappedResponse.msg || `code ${wrappedResponse.code}`}`);
	const key = params.key === "image_key" ? wrappedResponse.image_key ?? wrappedResponse.data?.image_key : wrappedResponse.file_key ?? wrappedResponse.data?.file_key;
	if (!key) throw new Error(`${params.errorPrefix}: no ${params.key} returned`);
	return key;
}
function readHeaderValue(headers, name) {
	if (!headers) return;
	for (const [key, value] of Object.entries(headers)) {
		if (normalizeLowercaseStringOrEmpty(key) !== normalizeLowercaseStringOrEmpty(name)) continue;
		if (typeof value === "string" && value.trim()) return value.trim();
		if (Array.isArray(value)) {
			const first = value.find((entry) => typeof entry === "string" && entry.trim());
			if (typeof first === "string") return first.trim();
		}
	}
}
function readHttpStatusFromError(error) {
	if (!error || typeof error !== "object") return;
	const response = error.response;
	if (response && typeof response === "object") {
		const status = response.status;
		if (typeof status === "number") return status;
	}
	const status = error.status;
	return typeof status === "number" ? status : void 0;
}
function isHttpStatusError(error, status) {
	return readHttpStatusFromError(error) === status;
}
function containsEastAsianScript(value) {
	return /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(value);
}
function recoverUtf8FileNameFromLatin1Header(value) {
	const recovered = Buffer.from(value, "latin1").toString("utf8");
	if (recovered !== value && !recovered.includes("�") && containsEastAsianScript(recovered)) return recovered;
	return value;
}
function decodeDispositionFileName(value) {
	const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i);
	if (utf8Match?.[1]) try {
		return decodeURIComponent(utf8Match[1].trim().replace(/^"(.*)"$/, "$1"));
	} catch {
		return utf8Match[1].trim().replace(/^"(.*)"$/, "$1");
	}
	const plainFileName = value.match(/filename="?([^";]+)"?/i)?.[1]?.trim();
	return plainFileName ? recoverUtf8FileNameFromLatin1Header(plainFileName) : void 0;
}
function extractFeishuDownloadMetadata(response) {
	const responseWithOptionalFields = response;
	const headers = asHeaderMap(responseWithOptionalFields.headers) ?? asHeaderMap(responseWithOptionalFields.header);
	const contentType = readHeaderValue(headers, "content-type") ?? responseWithOptionalFields.contentType ?? responseWithOptionalFields.mime_type ?? responseWithOptionalFields.data?.contentType ?? responseWithOptionalFields.data?.mime_type;
	const disposition = readHeaderValue(headers, "content-disposition");
	return {
		contentType,
		fileName: (disposition ? decodeDispositionFileName(disposition) : void 0) ?? responseWithOptionalFields.file_name ?? responseWithOptionalFields.fileName ?? responseWithOptionalFields.data?.file_name ?? responseWithOptionalFields.data?.fileName
	};
}
function mediaLimitError(maxBytes) {
	return /* @__PURE__ */ new Error(`Media exceeds ${Math.round(maxBytes / (1024 * 1024))}MB limit`);
}
async function saveFeishuResponseMedia(params) {
	const { response, maxBytes, contentType, fileName } = params;
	if (Buffer.isBuffer(response)) return saveMediaBuffer(response, contentType, "inbound", maxBytes, fileName);
	if (response instanceof ArrayBuffer) return saveMediaBuffer(Buffer.from(response), contentType, "inbound", maxBytes, fileName);
	const responseWithOptionalFields = response;
	if (responseWithOptionalFields.code !== void 0 && responseWithOptionalFields.code !== 0) throw new Error(`${params.errorPrefix}: ${responseWithOptionalFields.msg || `code ${responseWithOptionalFields.code}`}`);
	if (responseWithOptionalFields.data && Buffer.isBuffer(responseWithOptionalFields.data)) return saveMediaBuffer(responseWithOptionalFields.data, contentType, "inbound", maxBytes, fileName);
	if (responseWithOptionalFields.data instanceof ArrayBuffer) return saveMediaBuffer(Buffer.from(responseWithOptionalFields.data), contentType, "inbound", maxBytes, fileName);
	const save = (stream, ct = contentType, mb = maxBytes, fn = fileName) => saveMediaStreamWithIdleTimeout(stream, ct, mb, fn, FEISHU_MEDIA_HTTP_TIMEOUT_MS);
	if (typeof response.getReadableStream === "function") return save(response.getReadableStream());
	if (typeof response.writeFile === "function") return await withTempDownloadPath({ prefix: params.tmpDirPrefix }, async (tmpPath) => {
		await response.writeFile(tmpPath);
		if ((await fs.promises.stat(tmpPath)).size > maxBytes) throw mediaLimitError(maxBytes);
		return await save(fs.createReadStream(tmpPath));
	});
	if (responseWithOptionalFields[Symbol.asyncIterator]) return save(responseWithOptionalFields);
	if (response instanceof Readable) return save(response);
	const keys = Object.keys(response);
	throw new Error(`${params.errorPrefix}: unexpected response format. Keys: [${keys.join(", ")}]`);
}
async function saveMessageResourceWithType(params) {
	const response = await params.client.im.messageResource.get({
		path: {
			message_id: params.messageId,
			file_key: params.fileKey
		},
		params: { type: params.type }
	});
	const meta = extractFeishuDownloadMetadata(response);
	return {
		saved: await saveFeishuResponseMedia({
			response,
			tmpDirPrefix: "openclaw-feishu-resource-",
			errorPrefix: "Feishu message resource download failed",
			maxBytes: params.maxBytes,
			contentType: meta.contentType,
			fileName: meta.fileName ?? (params.originalFilename ? recoverUtf8FileNameFromLatin1Header(params.originalFilename) : void 0)
		}),
		...meta
	};
}
async function saveMessageResourceFeishu(params) {
	const { cfg, messageId, fileKey, type, accountId, maxBytes, originalFilename } = params;
	const normalizedFileKey = normalizeFeishuExternalKey(fileKey);
	if (!normalizedFileKey) throw new Error("Feishu message resource download failed: invalid file_key");
	const { client } = createConfiguredFeishuMediaClient({
		cfg,
		accountId
	});
	try {
		return await saveMessageResourceWithType({
			client,
			messageId,
			fileKey: normalizedFileKey,
			type,
			maxBytes,
			originalFilename
		});
	} catch (err) {
		if (type !== "file" || !isHttpStatusError(err, 502)) throw err;
		try {
			return await saveMessageResourceWithType({
				client,
				messageId,
				fileKey: normalizedFileKey,
				type: "media",
				maxBytes,
				originalFilename
			});
		} catch {
			throw err;
		}
	}
}
/**
* Upload an image to Feishu and get an image_key for sending.
* Supports: JPEG, PNG, WEBP, GIF, TIFF, BMP, ICO
*/
async function uploadImageFeishu(params) {
	const { cfg, image, imageType = "message", accountId } = params;
	const { client } = createConfiguredFeishuMediaClient({
		cfg,
		accountId
	});
	const imageData = typeof image === "string" ? (await readRegularFile({ filePath: image })).buffer : image;
	return { imageKey: extractFeishuUploadKey(await requestFeishuApi(() => client.im.image.create({ data: {
		image_type: imageType,
		image: imageData
	} }), "Feishu image upload failed", { includeNestedErrorLogId: true }), {
		key: "image_key",
		errorPrefix: "Feishu image upload failed"
	}) };
}
/**
* Sanitize a filename for safe use in Feishu multipart/form-data uploads.
* Strips control characters and multipart-injection vectors (CWE-93) while
* preserving the original UTF-8 display name (Chinese, emoji, etc.).
*
* Previous versions percent-encoded non-ASCII characters, but the Feishu
* `im.file.create` API uses `file_name` as a literal display name — it does
* NOT decode percent-encoding — so encoded filenames appeared as garbled text
* in chat (regression in v2026.3.2).
*/
function sanitizeFileNameForUpload(fileName) {
	return fileName.replace(/[\p{Cc}"\\]/gu, "_");
}
/**
* Upload a file to Feishu and get a file_key for sending.
* Max file size: 30MB
*/
async function uploadFileFeishu(params) {
	const { cfg, file, fileName, fileType, duration, accountId } = params;
	const { client } = createConfiguredFeishuMediaClient({
		cfg,
		accountId
	});
	const fileData = typeof file === "string" ? (await readRegularFile({ filePath: file })).buffer : file;
	const safeFileName = sanitizeFileNameForUpload(fileName);
	return { fileKey: extractFeishuUploadKey(await requestFeishuApi(() => client.im.file.create({ data: {
		file_type: fileType,
		file_name: safeFileName,
		file: fileData,
		...duration !== void 0 ? { duration } : {}
	} }), "Feishu file upload failed", { includeNestedErrorLogId: true }), {
		key: "file_key",
		errorPrefix: "Feishu file upload failed"
	}) };
}
/**
* Send an image message using an image_key
*/
async function sendImageFeishu(params) {
	const { cfg, to, imageKey, replyToMessageId, replyInThread, allowTopLevelReplyFallback, accountId } = params;
	const { client, receiveId, receiveIdType } = resolveFeishuSendTarget({
		cfg,
		to,
		accountId
	});
	const content = JSON.stringify({ image_key: imageKey });
	if (replyToMessageId) return sendReplyOrFallbackDirect(client, {
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		content,
		msgType: "image",
		directParams: {
			receiveId,
			receiveIdType,
			content,
			msgType: "image"
		},
		directErrorPrefix: "Feishu image send failed",
		replyErrorPrefix: "Feishu image reply failed"
	});
	const response = await requestFeishuApi(() => client.im.message.create({
		params: { receive_id_type: receiveIdType },
		data: {
			receive_id: receiveId,
			content,
			msg_type: "image"
		}
	}), "Feishu image send failed", { includeNestedErrorLogId: true });
	assertFeishuMessageApiSuccess(response, "Feishu image send failed");
	return toFeishuSendResult(response, receiveId, "media", "Feishu image send failed");
}
/**
* Send a file message using a file_key
*/
async function sendFileFeishu(params) {
	const { cfg, to, fileKey, replyToMessageId, replyInThread, allowTopLevelReplyFallback, accountId } = params;
	const msgType = params.msgType ?? "file";
	const { client, receiveId, receiveIdType } = resolveFeishuSendTarget({
		cfg,
		to,
		accountId
	});
	const content = JSON.stringify({ file_key: fileKey });
	if (replyToMessageId) return sendReplyOrFallbackDirect(client, {
		replyToMessageId,
		replyInThread,
		allowTopLevelReplyFallback,
		content,
		msgType,
		directParams: {
			receiveId,
			receiveIdType,
			content,
			msgType
		},
		directErrorPrefix: "Feishu file send failed",
		replyErrorPrefix: "Feishu file reply failed"
	});
	const response = await requestFeishuApi(() => client.im.message.create({
		params: { receive_id_type: receiveIdType },
		data: {
			receive_id: receiveId,
			content,
			msg_type: msgType
		}
	}), "Feishu file send failed", { includeNestedErrorLogId: true });
	assertFeishuMessageApiSuccess(response, "Feishu file send failed");
	return toFeishuSendResult(response, receiveId, resolveFeishuReceiptKind(msgType), "Feishu file send failed");
}
/**
* Helper to detect file type from extension
*/
function detectFileType(fileName) {
	switch (normalizeLowercaseStringOrEmpty(path.extname(fileName))) {
		case ".opus":
		case ".ogg": return "opus";
		case ".mp4":
		case ".mov":
		case ".avi": return "mp4";
		case ".pdf": return "pdf";
		case ".doc":
		case ".docx": return "doc";
		case ".xls":
		case ".xlsx": return "xls";
		case ".ppt":
		case ".pptx": return "ppt";
		default: return "stream";
	}
}
async function resolveFeishuOutboundMediaKind(params) {
	const { buffer, fileName, contentType } = params;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(fileName));
	const detectedContentType = await detectMime({ buffer }) ?? "";
	if (FEISHU_SUPPORTED_IMAGE_CONTENT_TYPES.has(detectedContentType)) return { msgType: "image" };
	if (ext === ".opus" || ext === ".ogg" || contentType === "audio/ogg" || contentType === "audio/opus") return {
		fileType: "opus",
		msgType: "audio"
	};
	if ([
		".mp4",
		".mov",
		".avi"
	].includes(ext) || contentType === "video/mp4" || contentType === "video/quicktime" || contentType === "video/x-msvideo") return {
		fileType: "mp4",
		msgType: "media"
	};
	const fileType = detectFileType(fileName);
	return {
		fileType,
		msgType: fileType === "stream" ? "file" : fileType === "opus" ? "audio" : fileType === "mp4" ? "media" : "file"
	};
}
function assertFeishuUploadWithinEnvelope(params) {
	if (params.buffer.byteLength === 0) throw new Error("Feishu attachments cannot be empty");
	const maxBytes = params.msgType === "image" ? Math.min(params.mediaMaxBytes, FEISHU_MAX_IMAGE_UPLOAD_BYTES) : params.mediaMaxBytes;
	if (params.buffer.byteLength > maxBytes) {
		const label = params.msgType === "image" ? "image" : "file";
		throw new Error(`Feishu ${label} exceeds its ${String(maxBytes)}-byte upload limit`);
	}
}
function isFeishuNativeVoiceAudio(params) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
	const contentType = normalizeLowercaseStringOrEmpty(params.contentType);
	return ext === ".opus" || ext === ".ogg" || contentType === "audio/ogg" || contentType === "audio/opus";
}
function normalizeMediaNameForExtension(raw) {
	try {
		return new URL(raw).pathname;
	} catch {
		return raw.split(/[?#]/, 1)[0] ?? raw;
	}
}
function shouldSuppressFeishuTextForVoiceMedia(params) {
	if (params.ttsSupplement) return params.ttsSupplement.visibleTextAlreadyDelivered === true;
	if (params.audioAsVoice === true) return true;
	if (params.fileName && isFeishuNativeVoiceAudio({
		fileName: params.fileName,
		contentType: params.contentType
	})) return true;
	if (!params.mediaUrl) return false;
	return isFeishuNativeVoiceAudio({
		fileName: normalizeMediaNameForExtension(params.mediaUrl),
		contentType: params.contentType
	});
}
function isLikelyTranscodableAudio(params) {
	const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
	const contentType = normalizeLowercaseStringOrEmpty(params.contentType);
	return FEISHU_TRANSCODABLE_AUDIO_EXTS.has(ext) || mediaKindFromMime(contentType) === "audio";
}
async function transcodeToFeishuVoiceOpus(params) {
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "feishu-voice-"
	}, async (workspace) => {
		const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
		const inputExt = ext && ext.length <= 12 ? ext : ".audio";
		const inputPath = await workspace.write(`input${inputExt}`, params.buffer);
		await writeExternalFileWithinRoot({
			rootDir: workspace.dir,
			path: FEISHU_VOICE_FILE_NAME,
			write: async (outputPath) => {
				await runFfmpeg([
					"-hide_banner",
					"-loglevel",
					"error",
					"-y",
					"-i",
					inputPath,
					"-vn",
					"-sn",
					"-dn",
					"-t",
					String(MEDIA_FFMPEG_MAX_AUDIO_DURATION_SECS),
					"-ar",
					String(FEISHU_VOICE_SAMPLE_RATE_HZ),
					"-ac",
					"1",
					"-c:a",
					"libopus",
					"-b:a",
					FEISHU_VOICE_BITRATE,
					"-f",
					"ogg",
					outputPath
				]);
			}
		});
		return {
			buffer: await workspace.read(FEISHU_VOICE_FILE_NAME),
			fileName: FEISHU_VOICE_FILE_NAME,
			contentType: "audio/ogg"
		};
	});
}
async function prepareFeishuVoiceMedia(params) {
	if (isFeishuNativeVoiceAudio(params)) return params;
	if (params.audioAsVoice !== true || !isLikelyTranscodableAudio(params)) return params;
	try {
		return await transcodeToFeishuVoiceOpus(params);
	} catch (err) {
		console.warn(`[feishu] audioAsVoice transcode failed; sending ${params.fileName} as a file attachment:`, err);
		return params;
	}
}
async function probeMediaDurationMs(params) {
	try {
		return await withTempWorkspace({
			rootDir: resolvePreferredOpenClawTmpDir(),
			prefix: "feishu-media-probe-"
		}, async (workspace) => {
			const ext = normalizeLowercaseStringOrEmpty(path.extname(params.fileName));
			const inferredExt = ext && ext.length <= 12 ? ext : mediaKindFromMime(params.contentType) === "video" ? ".mp4" : ".ogg";
			const stdout = await runFfprobe([
				"-v",
				"error",
				"-show_entries",
				"format=duration",
				"-of",
				"csv=p=0",
				await workspace.write(`input${inferredExt}`, params.buffer)
			], { timeoutMs: 5e3 });
			const seconds = Number.parseFloat(stdout.trim());
			if (!Number.isFinite(seconds) || seconds <= 0) return;
			return Math.max(1, Math.round(seconds * 1e3));
		});
	} catch (err) {
		console.warn("[feishu] failed to probe media duration; upload will omit it:", err);
		return;
	}
}
async function maybeProbeUploadDurationMs(params) {
	if (params.msgType !== "audio" && params.msgType !== "media") return;
	return await probeMediaDurationMs(params);
}
/**
* Upload and send media (image or file) from URL, local path, or buffer.
* Local paths require host-owned mediaAccess or approved legacy roots/readers.
*/
async function sendMediaFeishu(params) {
	const { cfg, to, mediaUrl, mediaBuffer, fileName, replyToMessageId, replyInThread, allowTopLevelReplyFallback, accountId, mediaLocalRoots, audioAsVoice } = params;
	const account = await runBeforeFeishuMessageDispatch(() => {
		const resolved = resolveFeishuRuntimeAccount({
			cfg,
			accountId
		});
		if (!resolved.configured) throw new Error(`Feishu account "${resolved.accountId}" not configured`);
		return resolved;
	});
	const mediaMaxBytes = Math.min((account.config?.mediaMaxMb ?? 30) * 1024 * 1024, FEISHU_MAX_FILE_UPLOAD_BYTES);
	let buffer;
	let name;
	let contentType;
	const loaded = await runBeforeFeishuMessageDispatch(async () => {
		if (mediaBuffer) return {
			buffer: mediaBuffer,
			name: fileName ?? "file",
			contentType: void 0
		};
		if (mediaUrl) {
			const media = await getFeishuRuntime().media.loadWebMedia(mediaUrl, buildOutboundMediaLoadOptions({
				maxBytes: mediaMaxBytes,
				mediaAccess: params.mediaAccess,
				mediaLocalRoots,
				mediaReadFile: params.mediaReadFile,
				optimizeImages: false
			}));
			return {
				buffer: media.buffer,
				name: fileName ?? media.fileName ?? "file",
				contentType: media.contentType
			};
		}
		throw new Error("Either mediaUrl or mediaBuffer must be provided");
	});
	buffer = loaded.buffer;
	name = loaded.name;
	contentType = loaded.contentType;
	const loadedRouting = await runBeforeFeishuMessageDispatch(() => resolveFeishuOutboundMediaKind({
		buffer,
		fileName: name,
		contentType
	}));
	await runBeforeFeishuMessageDispatch(() => assertFeishuUploadWithinEnvelope({
		buffer,
		mediaMaxBytes,
		msgType: loadedRouting.msgType
	}));
	const prepared = await runBeforeFeishuMessageDispatch(() => prepareFeishuVoiceMedia({
		buffer,
		fileName: name,
		contentType,
		audioAsVoice
	}));
	buffer = prepared.buffer;
	name = prepared.fileName;
	contentType = prepared.contentType;
	const routing = prepared.buffer === loaded.buffer && prepared.fileName === loaded.name && prepared.contentType === loaded.contentType ? loadedRouting : await runBeforeFeishuMessageDispatch(() => resolveFeishuOutboundMediaKind({
		buffer,
		fileName: name,
		contentType
	}));
	const voiceIntentDegradedToFile = audioAsVoice === true && routing.msgType !== "audio";
	await runBeforeFeishuMessageDispatch(() => assertFeishuUploadWithinEnvelope({
		buffer,
		mediaMaxBytes,
		msgType: routing.msgType
	}));
	if (routing.msgType === "image") {
		const { imageKey } = await runBeforeFeishuMessageDispatch(() => uploadImageFeishu({
			cfg,
			image: buffer,
			accountId
		}));
		return {
			...await sendImageFeishu({
				cfg,
				to,
				imageKey,
				replyToMessageId,
				replyInThread,
				allowTopLevelReplyFallback,
				accountId
			}),
			...voiceIntentDegradedToFile ? { voiceIntentDegradedToFile: true } : {}
		};
	}
	const durationMs = await maybeProbeUploadDurationMs({
		buffer,
		fileName: name,
		contentType,
		msgType: routing.msgType
	});
	const { fileKey } = await runBeforeFeishuMessageDispatch(() => uploadFileFeishu({
		cfg,
		file: buffer,
		fileName: name,
		fileType: routing.fileType ?? "stream",
		...durationMs !== void 0 ? { duration: durationMs } : {},
		accountId
	}));
	return {
		...await sendFileFeishu({
			cfg,
			to,
			fileKey,
			msgType: routing.msgType,
			replyToMessageId,
			replyInThread,
			allowTopLevelReplyFallback,
			accountId
		}),
		...voiceIntentDegradedToFile ? { voiceIntentDegradedToFile: true } : {}
	};
}
//#endregion
export { normalizeFeishuExternalKey as _, getMessageFeishu as a, resolveFeishuIdentityHeaderTitle as b, sendMarkdownCardFeishu as c, extractMentionTargets as d, isFeishuBroadcastMention as f, parsePostContent as g, parseInteractiveCardContent as h, editMessageFeishu as i, sendMessageFeishu as l, isFeishuGroupChatType as m, sendMediaFeishu as n, listFeishuThreadMessages as o, isMentionForwardRequest as p, shouldSuppressFeishuTextForVoiceMedia as r, sendCardFeishu as s, saveMessageResourceFeishu as t, sendStructuredCardFeishu as u, buildFeishuMediaFallbackText as v, resolveFeishuIdentityEmoji as y };
