import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import "./reply-payload-i0RzN2iF.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CJuHXrph.js";
import { a as resolveToolsBySender, t as resolveChannelGroupPolicy } from "./group-policy-1fHWm2yO.js";
import { a as sliceMarkdownIR, d as tokenizeHtmlTags, i as markdownToIRWithMeta } from "./construct-fallbacks-Dvy1yFH8.js";
import { n as firstDefined } from "./allow-from-D4kg2zcb.js";
import { c as resolveTextChunkLimit } from "./chunk-_fxsAvI_.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { n as renderMarkdownWithMarkers } from "./tables-DNKAswSM.js";
import "./reply-chunking-BXCYNOLj.js";
import "./ssrf-runtime-CpSMUPcn.js";
import { i as FormatCapabilityProfile, t as chunkTextForOutbound } from "./text-chunking-CJz4kAsi.js";
import { n as isAutoLinkedFileRef } from "./auto-linked-file-ref-H-D-BcV4.js";
import "./channel-policy-BG3-cCKG.js";
import "./access-groups-D9ipmCdc.js";
import { t as mergeTelegramAccountConfig } from "./account-config-Bw5EPvnW.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-3yDZGxKI.js";
import { a as normalizeTelegramLookupTarget, s as parseTelegramTarget } from "./topic-conversation-Cl4csGES.js";
import { Q as decodeTelegramHtmlEntities, V as countTelegramHtmlVisibleCharacters, Z as renderTelegramMonospaceGrid, q as resolveTelegramHtmlVisibleText } from "./helpers-BYdV1asc.js";
//#region extensions/telegram/src/group-config-helpers.ts
function resolveTelegramScopedGroupConfig(telegramCfg, chatId, messageThreadId) {
	const resolveTopicConfig = (scopedConfig) => {
		if (!scopedConfig || messageThreadId == null) return;
		const defaultConfig = scopedConfig.topics?.["*"];
		const exactConfig = scopedConfig.topics?.[String(messageThreadId)];
		if (defaultConfig && exactConfig) return {
			...defaultConfig,
			...exactConfig
		};
		return exactConfig ?? defaultConfig;
	};
	const chatIdStr = String(chatId);
	const scopedConfigs = chatIdStr.startsWith("-") ? telegramCfg.groups : telegramCfg.direct;
	const tree = { scopes: scopedConfigs ?? {} };
	const groupKey = Object.hasOwn(tree.scopes, chatIdStr) ? chatIdStr : Object.hasOwn(tree.scopes, "*") ? "*" : void 0;
	const matchKey = (groupKey ? [groupKey] : [])[0];
	const groupConfig = matchKey ? scopedConfigs?.[matchKey] : void 0;
	return {
		groupConfig,
		topicConfig: resolveTopicConfig(groupConfig)
	};
}
function resolveTelegramGroupIngestEnabled(params) {
	const { groupConfig, defaultConfig } = resolveChannelGroupPolicy({
		cfg: params.cfg,
		channel: "telegram",
		groupId: String(params.chatId),
		accountId: params.accountId
	});
	return (params.topicConfig?.ingest ?? groupConfig?.ingest ?? defaultConfig?.ingest) === true;
}
function resolveTelegramGroupPromptSettings(params) {
	const skillFilter = firstDefined(params.topicConfig?.skills, params.groupConfig?.skills);
	const systemPromptParts = [params.groupConfig?.systemPrompt?.trim() || null, params.topicConfig?.systemPrompt?.trim() || null].filter((entry) => Boolean(entry));
	return {
		skillFilter,
		groupSystemPrompt: systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : void 0
	};
}
function resolveTelegramDirectToolPolicy(params) {
	return resolveToolsBySender({
		toolsBySender: params.directConfig?.toolsBySender,
		messageProvider: "telegram",
		senderId: params.senderId,
		senderName: params.senderName,
		senderUsername: params.senderUsername
	}) ?? params.directConfig?.tools;
}
//#endregion
//#region extensions/telegram/src/normalize.ts
const TELEGRAM_PREFIX_RE = /^(telegram|tg):/i;
function normalizeTelegramTargetBody(raw) {
	const trimmed = raw.trim();
	if (!trimmed) return;
	const prefixStripped = trimmed.replace(TELEGRAM_PREFIX_RE, "").trim();
	if (!prefixStripped) return;
	const identity = resolveTelegramTargetIdentity(trimmed);
	if (!identity) return;
	const keepLegacyGroupPrefix = /^group:/i.test(prefixStripped);
	const hasTopicSuffix = /:topic:\d+$/i.test(prefixStripped);
	const chatSegment = keepLegacyGroupPrefix ? `group:${identity.chatId}` : identity.chatId;
	if (identity.directMessagesTopicId != null) return `${chatSegment}:direct-topic:${identity.directMessagesTopicId}`;
	if (identity.messageThreadId == null) return chatSegment;
	return `${chatSegment}${hasTopicSuffix ? `:topic:${identity.messageThreadId}` : `:${identity.messageThreadId}`}`;
}
function resolveTelegramTargetIdentity(raw) {
	const parsed = parseTelegramTarget(raw);
	const chatId = normalizeTelegramLookupTarget(parsed.chatId);
	if (!chatId) return;
	return {
		chatId: normalizeLowercaseStringOrEmpty(chatId),
		messageThreadId: parsed.messageThreadId,
		directMessagesTopicId: parsed.directMessagesTopicId
	};
}
function normalizeTelegramMessagingTarget(raw) {
	const normalizedBody = normalizeTelegramTargetBody(raw);
	if (!normalizedBody) return;
	return normalizeLowercaseStringOrEmpty(`telegram:${normalizedBody}`);
}
function looksLikeTelegramTargetId(raw) {
	return normalizeTelegramTargetBody(raw) !== void 0;
}
function telegramMessagingTargetsMatch(target, currentTarget) {
	const targetIdentity = resolveTelegramTargetIdentity(target);
	const currentIdentity = resolveTelegramTargetIdentity(currentTarget);
	return targetIdentity !== void 0 && currentIdentity !== void 0 && targetIdentity.chatId === currentIdentity.chatId && targetIdentity.messageThreadId === currentIdentity.messageThreadId && targetIdentity.directMessagesTopicId === currentIdentity.directMessagesTopicId;
}
//#endregion
//#region extensions/telegram/src/caption.ts
const TELEGRAM_MAX_CAPTION_LENGTH = 1024;
const telegramCaptionDeliveryMetadata = /* @__PURE__ */ new WeakSet();
function splitTelegramCaption(text, renderedHtml) {
	const trimmed = text?.trim() ?? "";
	if (!trimmed) return {
		caption: void 0,
		followUpText: void 0
	};
	if ((renderedHtml === void 0 ? trimmed.length : countTelegramHtmlVisibleCharacters(renderedHtml)) > 1024) return {
		caption: void 0,
		followUpText: trimmed
	};
	return {
		caption: trimmed,
		followUpText: void 0
	};
}
function resolveTelegramPlainCaption(caption, renderedHtml) {
	if (caption === void 0 || caption.length <= 1024 || renderedHtml === void 0) return caption;
	return resolveTelegramHtmlVisibleText(renderedHtml);
}
//#endregion
//#region extensions/telegram/src/inline-keyboard.ts
function toInlineKeyboardButton(button) {
	if (!button?.text) return;
	if (button.url) return button.style ? {
		text: button.text,
		url: button.url,
		style: button.style
	} : {
		text: button.text,
		url: button.url
	};
	if (button.callback_data) return button.style ? {
		text: button.text,
		callback_data: button.callback_data,
		style: button.style
	} : {
		text: button.text,
		callback_data: button.callback_data
	};
	if (button.web_app?.url) return button.style ? {
		text: button.text,
		web_app: { url: button.web_app.url },
		style: button.style
	} : {
		text: button.text,
		web_app: { url: button.web_app.url }
	};
}
function buildInlineKeyboard(buttons) {
	if (!buttons?.length) return;
	const rows = buttons.map((row) => row.map(toInlineKeyboardButton).filter((button) => Boolean(button))).filter((row) => row.length > 0);
	if (rows.length === 0) return;
	return { inline_keyboard: rows };
}
//#endregion
//#region extensions/telegram/src/prompt-context-projection.ts
function parseTranscriptMessageId(value) {
	const id = isRecord(value) ? value.transcriptMessageId : void 0;
	return typeof id === "string" && id.trim() ? id : void 0;
}
function resolveTelegramPromptContextDeliverySignature(payload) {
	const parts = resolveSendableOutboundReplyParts(payload);
	const spokenText = payload.spokenText ?? "";
	return JSON.stringify([
		parts.text,
		parts.mediaUrls,
		payload.audioAsVoice === true,
		spokenText
	]);
}
function parseTelegramPromptContextProjection(value) {
	const transcriptMessageId = parseTranscriptMessageId(value);
	if (!transcriptMessageId || !isRecord(value)) return;
	const { partIndex, finalPart } = value;
	return typeof partIndex === "number" && Number.isSafeInteger(partIndex) && partIndex >= 0 && typeof finalPart === "boolean" ? {
		kind: "valid",
		projection: {
			transcriptMessageId,
			partIndex,
			finalPart
		}
	} : {
		kind: "invalid",
		transcriptMessageId
	};
}
function resolveTelegramPromptContextSource(payload) {
	const telegram = payload.channelData?.telegram;
	const taggedSource = isRecord(telegram) ? telegram.promptContextSource : void 0;
	const transcriptMessageId = parseTranscriptMessageId(taggedSource);
	const deliverySignature = isRecord(taggedSource) ? taggedSource.deliverySignature : void 0;
	return transcriptMessageId && deliverySignature === resolveTelegramPromptContextDeliverySignature(payload) ? { transcriptMessageId } : void 0;
}
function withTelegramPromptContextSource(payload, source) {
	if (!source) return payload;
	const telegram = payload.channelData?.telegram;
	return {
		...payload,
		channelData: {
			...payload.channelData,
			telegram: {
				...isRecord(telegram) ? telegram : {},
				promptContextSource: {
					...source,
					deliverySignature: resolveTelegramPromptContextDeliverySignature(payload)
				}
			}
		}
	};
}
function createTelegramPromptContextProjectionCursor(source) {
	return {
		source,
		nextPartIndex: 0,
		complete: true,
		invalidate() {
			this.complete = false;
		},
		take(finalPart) {
			return {
				...this.source,
				partIndex: this.nextPartIndex++,
				finalPart: this.complete && finalPart
			};
		}
	};
}
function createTelegramPromptContextProjectionSequence(params) {
	let cursor = params.source ? createTelegramPromptContextProjectionCursor(params.source) : void 0;
	let pending;
	let started = false;
	const invalidate = () => cursor?.invalidate();
	const flush = async (finalPart) => {
		if (!pending) return;
		const record = pending;
		pending = void 0;
		const projection = cursor?.take(finalPart);
		if (!await params.record({
			...record,
			...projection ? { projection } : {}
		}).catch(() => false)) invalidate();
	};
	return {
		get source() {
			return cursor?.source;
		},
		isFresh: () => !started && (cursor?.complete ?? true),
		async accept(record) {
			started = true;
			await flush(false);
			pending = record;
		},
		finish: () => flush(true),
		invalidate,
		detach() {
			invalidate();
			cursor = void 0;
		},
		async fail() {
			invalidate();
			await flush(false);
		}
	};
}
function resolveCompleteTelegramPromptContextProjectionIds(markers) {
	const grouped = /* @__PURE__ */ new Map();
	for (const marker of markers) {
		if (!marker) continue;
		const id = marker.kind === "valid" ? marker.projection.transcriptMessageId : marker.transcriptMessageId;
		if (marker.kind === "invalid") grouped.set(id, void 0);
		else if (grouped.get(id) !== void 0 || !grouped.has(id)) grouped.set(id, [...grouped.get(id) ?? [], marker.projection]);
	}
	const complete = /* @__PURE__ */ new Set();
	for (const [id, parts] of grouped) {
		const ordered = parts?.toSorted((left, right) => left.partIndex - right.partIndex);
		if (ordered?.every((part, index) => part.partIndex === index && part.finalPart === (index === ordered.length - 1))) complete.add(id);
	}
	return complete;
}
//#endregion
//#region extensions/telegram/src/rich-block-model.ts
function normalizeRichText(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		const flattened = [];
		for (const item of value) {
			const normalized = normalizeRichText(item);
			if (normalized === "") continue;
			if (Array.isArray(normalized)) flattened.push(...normalized);
			else flattened.push(normalized);
		}
		if (flattened.length === 0) return "";
		if (flattened.length === 1) return flattened[0] ?? "";
		return flattened;
	}
	if (value.type === "mathematical_expression" || value.type === "custom_emoji") return value;
	return {
		...value,
		text: normalizeRichText(value.text)
	};
}
function countRichTextChars(text) {
	if (typeof text === "string") return text.length;
	if (Array.isArray(text)) return text.reduce((total, part) => total + countRichTextChars(part), 0);
	if (text.type === "mathematical_expression") return text.expression.length;
	if (text.type === "custom_emoji") return text.alternative_text.length;
	return countRichTextChars(text.text);
}
function countCaptionChars(caption) {
	if (!caption) return 0;
	return countRichTextChars(caption.text) + countRichTextChars(caption.credit ?? "");
}
function countInputRichBlockChars(block) {
	switch (block.type) {
		case "paragraph":
		case "heading":
		case "footer": return countRichTextChars(block.text);
		case "pre": return block.text.length;
		case "mathematical_expression": return block.expression.length;
		case "pullquote": return countRichTextChars(block.text) + countRichTextChars(block.credit ?? "");
		case "blockquote": return block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0) + countRichTextChars(block.credit ?? "");
		case "collage":
		case "slideshow": return block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0) + countCaptionChars(block.caption);
		case "details": return countRichTextChars(block.summary) + block.blocks.reduce((total, item) => total + countInputRichBlockChars(item), 0);
		case "list": return block.items.reduce((total, item) => total + item.blocks.reduce((inner, child) => inner + countInputRichBlockChars(child), 0), 0);
		case "table": return countRichTextChars(block.caption ?? "") + block.cells.reduce((rowTotal, row) => rowTotal + row.reduce((cellTotal, cell) => cellTotal + countRichTextChars(cell.text ?? ""), 0), 0);
		case "photo":
		case "video":
		case "audio":
		case "animation":
		case "voice_note":
		case "map": return countCaptionChars(block.caption);
		default: return 0;
	}
}
/** Bot API block budget, including nested blocks, list items, and table rows. */
function countInputRichBlocks(blocks) {
	return blocks.reduce((total, block) => {
		switch (block.type) {
			case "blockquote":
			case "details":
			case "collage":
			case "slideshow": return total + 1 + countInputRichBlocks(block.blocks);
			case "list": return total + 1 + block.items.reduce((items, item) => items + 1 + countInputRichBlocks(item.blocks), 0);
			case "table": return total + 1 + block.cells.length;
			default: return total + 1;
		}
	}, 0);
}
function maxRichTextNesting(text) {
	if (typeof text === "string") return 0;
	if (Array.isArray(text)) return Math.max(0, ...text.map(maxRichTextNesting));
	if (text.type === "mathematical_expression" || text.type === "custom_emoji") return 0;
	return 1 + maxRichTextNesting(text.text);
}
function maxCaptionNesting(caption) {
	return caption ? Math.max(maxRichTextNesting(caption.text), caption.credit ? maxRichTextNesting(caption.credit) : 0) : 0;
}
/** Maximum nested block/formatting edges in a rich-message tree. */
function maxInputRichBlockNesting(blocks) {
	const blockDepth = (block) => {
		switch (block.type) {
			case "paragraph":
			case "heading":
			case "footer": return maxRichTextNesting(block.text);
			case "pullquote": return Math.max(maxRichTextNesting(block.text), block.credit ? maxRichTextNesting(block.credit) : 0);
			case "blockquote": return Math.max(1 + maxInputRichBlockNesting(block.blocks), block.credit ? 1 + maxRichTextNesting(block.credit) : 0);
			case "details": return Math.max(1 + maxInputRichBlockNesting(block.blocks), 1 + maxRichTextNesting(block.summary));
			case "collage":
			case "slideshow": return Math.max(1 + maxInputRichBlockNesting(block.blocks), 1 + maxCaptionNesting(block.caption));
			case "list": return 1 + Math.max(0, ...block.items.map((item) => maxInputRichBlockNesting(item.blocks)));
			case "table": return 1 + Math.max(maxRichTextNesting(block.caption ?? ""), ...block.cells.flatMap((row) => row.map((cell) => maxRichTextNesting(cell.text ?? ""))));
			case "photo":
			case "video":
			case "audio":
			case "animation":
			case "voice_note":
			case "map": return block.caption ? 1 + maxCaptionNesting(block.caption) : 0;
			case "pre": return 0;
			default: return 0;
		}
	};
	return Math.max(0, ...blocks.map(blockDepth));
}
/** Media elements per block, for the wire's 50-media message cap. */
function countInputRichBlockMedia(block) {
	switch (block.type) {
		case "photo":
		case "video":
		case "audio":
		case "animation":
		case "voice_note": return 1;
		case "collage":
		case "slideshow":
		case "blockquote":
		case "details": return block.blocks.reduce((total, item) => total + countInputRichBlockMedia(item), 0);
		case "list": return block.items.reduce((total, item) => total + item.blocks.reduce((inner, child) => inner + countInputRichBlockMedia(child), 0), 0);
		default: return 0;
	}
}
function richTextToPlainString(text) {
	if (typeof text === "string") return text;
	if (Array.isArray(text)) return text.map(richTextToPlainString).join("");
	if (text.type === "mathematical_expression") return text.expression;
	if (text.type === "custom_emoji") return text.alternative_text;
	return richTextToPlainString(text.text);
}
function captionToPlainText(caption) {
	if (!caption) return "";
	const credit = caption.credit ? ` — ${richTextToPlainString(caption.credit)}` : "";
	return `${richTextToPlainString(caption.text)}${credit}`.trim();
}
function inputRichBlocksToPlainTextAtDepth(blocks, listDepth) {
	const parts = [];
	const push = (value) => {
		if (value) parts.push(value);
	};
	for (const block of blocks) switch (block.type) {
		case "paragraph":
		case "heading":
		case "footer":
			push(richTextToPlainString(block.text));
			break;
		case "pre":
			push(block.text);
			break;
		case "mathematical_expression":
			push(block.expression);
			break;
		case "pullquote":
			push(block.credit ? `${richTextToPlainString(block.text)} — ${richTextToPlainString(block.credit)}` : richTextToPlainString(block.text));
			break;
		case "blockquote":
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			if (block.credit) push(`— ${richTextToPlainString(block.credit)}`);
			break;
		case "collage":
		case "slideshow":
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			push(captionToPlainText(block.caption));
			break;
		case "details":
			push(richTextToPlainString(block.summary));
			push(inputRichBlocksToPlainTextAtDepth(block.blocks, listDepth));
			break;
		case "list":
			for (const item of block.items) {
				const markerText = item.has_checkbox ? item.is_checked ? "[x] " : "[ ] " : item.value !== void 0 ? `${item.value}. ` : "• ";
				push(`${`${"  ".repeat(listDepth)}${markerText}`}${inputRichBlocksToPlainTextAtDepth(item.blocks, listDepth + 1)}`);
			}
			break;
		case "table":
			if (block.caption !== void 0) push(richTextToPlainString(block.caption));
			for (const row of block.cells) push(row.map((cell) => richTextToPlainString(cell.text ?? "")).join(" | "));
			break;
		case "photo":
			push(`${captionToPlainText(block.caption)} ${block.photo.media}`.trim());
			break;
		case "video":
			push(`${captionToPlainText(block.caption)} ${block.video.media}`.trim());
			break;
		case "audio":
			push(`${captionToPlainText(block.caption)} ${block.audio.media}`.trim());
			break;
		case "animation":
			push(`${captionToPlainText(block.caption)} ${block.animation.media}`.trim());
			break;
		case "voice_note":
			push(`${captionToPlainText(block.caption)} ${block.voice_note.media}`.trim());
			break;
		case "map":
			push(`${captionToPlainText(block.caption)} ${block.location.latitude},${block.location.longitude}`.trim());
			break;
		case "divider":
		case "anchor": break;
	}
	return parts.join("\n");
}
function inputRichBlocksToPlainText(blocks) {
	return inputRichBlocksToPlainTextAtDepth(blocks, 0);
}
function boldRichText(text) {
	return {
		type: "bold",
		text
	};
}
function codeRichText(text) {
	return {
		type: "code",
		text
	};
}
function italicRichText(text) {
	return {
		type: "italic",
		text
	};
}
function paragraphBlock(text) {
	return {
		type: "paragraph",
		text
	};
}
//#endregion
//#region extensions/telegram/src/rich-plain-fallback.ts
const RICH_ENTITY_INVALID_RE = /RICH_MESSAGE_[A-Z_]+_INVALID/i;
const RICH_CONTENT_REQUIRED_RE = /RICH_MESSAGE_CONTENT_REQUIRED/i;
const EMPTY_TEXT_RE = /message text is empty|text must be non-empty/i;
const RICH_STRUCTURE_INVALID_RE = /RICH_MESSAGE_(?:BLOCKS_TOO_MANY|DEPTH_INVALID|TEXT_TOO_LONG|MEDIA_TOO_MANY|TABLE_COLS_TOO_MANY)/i;
const PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity|can't parse InputRichBlock/i;
function isTelegramRichEntityInvalidError(err) {
	return RICH_ENTITY_INVALID_RE.test(formatErrorMessage(err));
}
function isTelegramHtmlParseError(err) {
	return PARSE_ERR_RE.test(formatErrorMessage(err));
}
function isTelegramEmptyContentError(err) {
	const message = formatErrorMessage(err);
	return EMPTY_TEXT_RE.test(message) || RICH_CONTENT_REQUIRED_RE.test(message);
}
function getTelegramPlainFallbackTrigger(err) {
	if (isTelegramRichEntityInvalidError(err)) return "rich-entity-invalid";
	if (RICH_CONTENT_REQUIRED_RE.test(formatErrorMessage(err))) return "rich-content-required";
	if (RICH_STRUCTURE_INVALID_RE.test(formatErrorMessage(err))) return "rich-structure-invalid";
	if (isTelegramHtmlParseError(err)) return "html-parse";
}
function surrogateSafeChunkEnd(text, end, start) {
	const high = text.charCodeAt(end - 1);
	const low = text.charCodeAt(end);
	if (!(end > 0 && high >= 55296 && high <= 56319 && low >= 56320 && low <= 57343)) return end;
	const clamped = end - 1;
	return clamped > start ? clamped : start + 2;
}
function splitTelegramPlainTextChunks(text, limit) {
	if (!text) return [];
	return chunkTextForOutbound(text, Math.max(1, Math.floor(limit)), { preserveWhitespace: true });
}
function splitTelegramPlainTextFallback(text, chunkCount, limit) {
	if (!text) return [];
	const normalizedLimit = Math.max(1, Math.floor(limit));
	const fixedChunks = splitTelegramPlainTextChunks(text, normalizedLimit);
	if (chunkCount <= 1 || fixedChunks.length >= chunkCount) return fixedChunks;
	const chunks = [];
	let offset = 0;
	for (let index = 0; index < chunkCount; index += 1) {
		const remainingChars = text.length - offset;
		const remainingChunks = chunkCount - index;
		const nextChunkLength = remainingChunks === 1 ? remainingChars : Math.min(normalizedLimit, Math.ceil(remainingChars / remainingChunks));
		const end = surrogateSafeChunkEnd(text, offset + nextChunkLength, offset);
		chunks.push(text.slice(offset, end));
		offset = end;
	}
	return chunks;
}
async function withTelegramPlainFallback(params) {
	try {
		return await params.sendFormatted();
	} catch (err) {
		const trigger = params.kind === "rich" ? getTelegramPlainFallbackTrigger(err) : isTelegramHtmlParseError(err) ? "html-parse" : isTelegramEmptyContentError(err) ? "empty-content" : void 0;
		if (!trigger || !params.plainText.trim()) throw err;
		params.warn(`telegram ${params.context} degrade=plain-fallback:${trigger}: ${formatErrorMessage(err)}`);
		const limit = params.limit ?? 4e3;
		const chunks = params.chunkCount === void 0 ? splitTelegramPlainTextChunks(params.plainText, limit) : splitTelegramPlainTextFallback(params.plainText, params.chunkCount, limit);
		return await params.sendPlain({
			plainText: params.plainText,
			chunks
		}, `${params.context}-plain`);
	}
}
function warnTelegramRichBlocksDegradations(params) {
	for (const reason of new Set(params.reasons)) params.warn(`telegram ${params.context} rich-degrade=${reason}`);
}
//#endregion
//#region extensions/telegram/src/rich-block-split.ts
const TELEGRAM_RICH_MEDIA_LIMIT = 50;
function measureRichBlocks(blocks) {
	return {
		chars: blocks.reduce((total, block) => total + countInputRichBlockChars(block), 0),
		blocks: countInputRichBlocks(blocks),
		media: blocks.reduce((total, block) => total + countInputRichBlockMedia(block), 0)
	};
}
function addRichBlockBudget(left, right) {
	return {
		chars: left.chars + right.chars,
		blocks: left.blocks + right.blocks,
		media: left.media + right.media
	};
}
function exceedsRichBlockLimits(size, limits) {
	return size.chars > limits.textLimit || size.blocks > limits.blockLimit || size.media > TELEGRAM_RICH_MEDIA_LIMIT;
}
function wrapRichTextFragment(fragment, wrappers) {
	let node = fragment;
	for (let index = wrappers.length - 1; index >= 0; index -= 1) {
		const wrapper = wrappers[index];
		if (!wrapper) continue;
		node = wrapper.type === "url" ? {
			type: "url",
			text: node,
			url: wrapper.url
		} : wrapper.type === "anchor_link" ? {
			type: "anchor_link",
			text: node,
			anchor_name: wrapper.anchor_name
		} : {
			type: wrapper.type,
			text: node
		};
	}
	return node;
}
function splitRichTextByChars(text, limit) {
	const pieces = [];
	let current = [];
	let chars = 0;
	const flush = () => {
		if (current.length > 0) {
			pieces.push(normalizeRichText(current));
			current = [];
			chars = 0;
		}
	};
	const visit = (node, wrappers) => {
		if (typeof node === "string") {
			let offset = 0;
			while (offset < node.length) {
				if (chars >= limit) flush();
				const budget = limit - chars;
				const end = surrogateSafeChunkEnd(node, Math.min(node.length, offset + budget), offset);
				const fragment = node.slice(offset, end);
				current.push(wrapRichTextFragment(fragment, wrappers));
				chars += fragment.length;
				offset = end;
			}
			return;
		}
		if (Array.isArray(node)) {
			for (const child of node) visit(child, wrappers);
			return;
		}
		if (node.type === "mathematical_expression" || node.type === "custom_emoji") {
			const atomicChars = countRichTextChars(node);
			if (chars > 0 && chars + atomicChars > limit) flush();
			current.push(wrapRichTextFragment(node, wrappers));
			chars += atomicChars;
			return;
		}
		const wrapper = node.type === "url" ? {
			type: "url",
			url: node.url
		} : node.type === "anchor_link" ? {
			type: "anchor_link",
			anchor_name: node.anchor_name
		} : { type: node.type };
		visit(node.text, [...wrappers, wrapper]);
	};
	visit(text, []);
	flush();
	return pieces;
}
function splitOversizedRichBlock(block, limits) {
	const { textLimit, blockLimit } = limits;
	if (!exceedsRichBlockLimits(measureRichBlocks([block]), limits)) return [block];
	if (block.type === "pre") {
		const language = block.language;
		return splitTelegramPlainTextChunks(block.text, textLimit).map((piece) => language ? {
			type: "pre",
			text: piece,
			language
		} : {
			type: "pre",
			text: piece
		});
	}
	if (block.type === "paragraph" || block.type === "heading") return splitRichTextByChars(block.text, textLimit).map((piece) => block.type === "heading" ? {
		type: "heading",
		text: piece,
		size: block.size
	} : {
		type: "paragraph",
		text: piece
	});
	if (block.type === "blockquote" || block.type === "details" || block.type === "collage" || block.type === "slideshow") {
		const remainingText = textLimit - (block.type === "blockquote" ? countRichTextChars(block.credit ?? "") : block.type === "details" ? countRichTextChars(block.summary) : countRichTextChars(block.caption?.text ?? "") + countRichTextChars(block.caption?.credit ?? ""));
		if (block.blocks.length === 0 || remainingText < 0 || remainingText === 0 && block.blocks.some((child) => countInputRichBlockChars(child) > 0)) return [block];
		const pieces = splitTelegramRichBlocks(block.blocks, {
			textLimit: Math.max(1, remainingText),
			blockLimit: Math.max(1, blockLimit - 1)
		});
		if (block.type === "blockquote") return pieces.map((inner, index) => index === pieces.length - 1 && block.credit !== void 0 ? {
			type: "blockquote",
			blocks: inner,
			credit: block.credit
		} : {
			type: "blockquote",
			blocks: inner
		});
		if (block.type === "details") return pieces.map((inner) => ({
			...block,
			blocks: inner
		}));
		const { caption, ...album } = block;
		const albumPieces = [];
		for (const [index, inner] of pieces.entries()) albumPieces.push(index === 0 && caption !== void 0 ? {
			...album,
			blocks: inner,
			caption
		} : {
			...album,
			blocks: inner
		});
		return albumPieces;
	}
	if (block.type === "table") {
		if (block.cells.some((row) => row.some((cell) => (cell.rowspan ?? 1) > 1))) return [block];
		const { caption, ...tableRest } = block;
		const pieces = [];
		const pushPiece = (pieceRows) => {
			pieces.push(pieces.length === 0 && caption !== void 0 ? {
				...tableRest,
				cells: pieceRows,
				caption
			} : {
				...tableRest,
				cells: pieceRows
			});
		};
		let rows = [];
		let chars = countRichTextChars(caption ?? "");
		for (const row of block.cells) {
			const rowChars = row.reduce((total, cell) => total + countRichTextChars(cell.text ?? ""), 0);
			if (rows.length > 0 && (chars + rowChars > textLimit || rows.length + 2 > blockLimit)) {
				pushPiece(rows);
				rows = [];
				chars = 0;
			}
			rows.push(row);
			chars += rowChars;
		}
		if (rows.length > 0) pushPiece(rows);
		return pieces;
	}
	if (block.type === "list") {
		const pieces = [];
		let items = [];
		let size = {
			chars: 0,
			blocks: 1,
			media: 0
		};
		for (const item of block.items) {
			const measured = measureRichBlocks(item.blocks);
			const itemSize = {
				...measured,
				blocks: measured.blocks + 1
			};
			const nextSize = addRichBlockBudget(size, itemSize);
			if (items.length > 0 && exceedsRichBlockLimits(nextSize, limits)) {
				pieces.push({
					type: "list",
					items
				});
				items = [];
				size = {
					chars: 0,
					blocks: 1,
					media: 0
				};
			}
			items.push(item);
			size = addRichBlockBudget(size, itemSize);
		}
		if (items.length > 0) pieces.push({
			type: "list",
			items
		});
		return pieces;
	}
	return [block];
}
function splitTelegramRichBlocks(blocks, options = {}) {
	const blockLimit = Math.max(1, Math.floor(options.blockLimit ?? 500));
	const textLimit = Math.max(1, Math.floor(options.textLimit ?? 32768));
	if (blocks.length === 0) return [];
	const limits = {
		textLimit,
		blockLimit
	};
	const expanded = blocks.flatMap((block) => splitOversizedRichBlock(block, limits));
	const chunks = [];
	let current = [];
	let size = {
		chars: 0,
		blocks: 0,
		media: 0
	};
	const flush = () => {
		if (current.length > 0) {
			chunks.push(current);
			current = [];
			size = {
				chars: 0,
				blocks: 0,
				media: 0
			};
		}
	};
	for (const block of expanded) {
		const blockSize = measureRichBlocks([block]);
		if (current.length > 0 && exceedsRichBlockLimits(addRichBlockBudget(size, blockSize), limits)) flush();
		current.push(block);
		size = addRichBlockBudget(size, blockSize);
	}
	flush();
	return chunks;
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html.ts
const VOID_TAGS = /* @__PURE__ */ new Set([
	"br",
	"hr",
	"img",
	"input",
	"tg-map"
]);
const INLINE_STYLE_TAGS = {
	b: "bold",
	strong: "bold",
	i: "italic",
	em: "italic",
	u: "underline",
	ins: "underline",
	s: "strikethrough",
	del: "strikethrough",
	strike: "strikethrough",
	code: "code",
	"tg-spoiler": "spoiler",
	mark: "marked",
	sub: "subscript",
	sup: "superscript"
};
const HTML_ATTR_RE = /([a-zA-Z][a-zA-Z0-9-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
function parseHtmlAttrs(raw) {
	const attrs = /* @__PURE__ */ new Map();
	const inner = raw.replace(/^<\/?[a-zA-Z][a-zA-Z0-9-]*/, "").replace(/\/?>$/, "");
	for (const match of inner.matchAll(HTML_ATTR_RE)) {
		const name = match[1]?.toLowerCase();
		if (name) attrs.set(name, decodeTelegramHtmlEntities(match[2] ?? match[3] ?? match[4] ?? ""));
	}
	return attrs;
}
/** Parse an HTML fragment into a light node tree; unmatched tags stay text. */
function parseHtmlFragment(text) {
	const root = [];
	const stack = [];
	const childrenOf = () => stack.length > 0 ? stack[stack.length - 1].node.children : root;
	let cursor = 0;
	const pushText = (from, to) => {
		if (to > from) childrenOf().push({
			kind: "text",
			text: text.slice(from, to)
		});
	};
	for (const tag of tokenizeHtmlTags(text)) {
		pushText(cursor, tag.start);
		cursor = tag.end;
		if (tag.closing) {
			const openIndex = stack.findLastIndex((entry) => entry.name === tag.name);
			if (openIndex >= 0) {
				for (let depth = openIndex; depth < stack.length; depth += 1) stack[depth].node.closed = depth === openIndex;
				stack.length = openIndex;
			} else childrenOf().push({
				kind: "text",
				text: tag.raw
			});
			continue;
		}
		const selfContained = tag.selfClosing || VOID_TAGS.has(tag.name);
		const element = {
			kind: "element",
			name: tag.name,
			raw: tag.raw,
			children: [],
			closed: selfContained
		};
		childrenOf().push(element);
		if (!selfContained) stack.push({
			name: tag.name,
			node: element
		});
	}
	pushText(cursor, text.length);
	return unwrapUnclosed(root);
}
function unwrapUnclosed(nodes) {
	const result = [];
	for (const node of nodes) {
		if (node.kind === "text") {
			result.push(node);
			continue;
		}
		const children = unwrapUnclosed(node.children);
		if (node.closed) result.push({
			...node,
			children
		});
		else result.push({
			kind: "text",
			text: node.raw
		}, ...children);
	}
	return result;
}
function nodeText(nodes) {
	return nodes.map((node) => node.kind === "text" ? decodeTelegramHtmlEntities(node.text) : nodeText(node.children)).join("");
}
function normalizeIslandText(text) {
	return text.replace(/\s+/g, " ").trim();
}
function serializeHtmlNodes(nodes) {
	return nodes.map((node) => {
		if (node.kind === "text") return node.text;
		return VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>") ? node.raw : `${node.raw}${serializeHtmlNodes(node.children)}</${node.name}>`;
	}).join("");
}
/** Convert island children into RichText, honoring documented inline tags. */
function htmlNodesToRichText(nodes) {
	const parts = [];
	for (const node of nodes) {
		if (node.kind === "text") {
			const value = decodeTelegramHtmlEntities(node.text.replace(/\s+/g, " "));
			if (value) parts.push(value);
			continue;
		}
		const style = INLINE_STYLE_TAGS[node.name];
		if (style) {
			parts.push({
				type: style,
				text: htmlNodesToRichText(node.children)
			});
			continue;
		}
		if (node.name === "a") {
			const href = parseHtmlAttrs(node.raw).get("href");
			const inner = htmlNodesToRichText(node.children);
			if (href?.startsWith("#")) parts.push({
				type: "anchor_link",
				text: inner,
				anchor_name: href.slice(1)
			});
			else parts.push(href ? {
				type: "url",
				text: inner,
				url: href
			} : inner);
			continue;
		}
		if (node.name === "tg-math") {
			parts.push({
				type: "mathematical_expression",
				expression: nodeText(node.children)
			});
			continue;
		}
		if (node.name === "tg-emoji") {
			const emojiId = parseHtmlAttrs(node.raw).get("emoji-id");
			const alternative = normalizeIslandText(nodeText(node.children));
			if (emojiId && /^\d+$/.test(emojiId) && alternative) {
				parts.push({
					type: "custom_emoji",
					custom_emoji_id: emojiId,
					alternative_text: alternative
				});
				continue;
			}
			parts.push(alternative);
			continue;
		}
		if (node.name === "br") {
			parts.push("\n");
			continue;
		}
		if (node.name === "p" || node.name === "span" || node.name === "div") {
			parts.push(htmlNodesToRichText(node.children));
			continue;
		}
		const selfContained = VOID_TAGS.has(node.name) || node.raw.trimEnd().endsWith("/>");
		parts.push(node.raw, serializeHtmlNodes(node.children));
		if (!selfContained) parts.push(`</${node.name}>`);
	}
	if (parts.length === 0) return "";
	if (parts.length === 1) return parts[0] ?? "";
	return parts;
}
/** Parse inline islands (<sup>, <tg-math>, <tg-emoji>, …) out of a text leaf. */
function parseInlineHtmlIslands(leaf) {
	if (!leaf.includes("<")) return leaf;
	const nodes = parseHtmlFragment(leaf);
	if (!nodes.some((node) => node.kind === "element")) return leaf;
	return htmlNodesToRichText(nodes);
}
//#endregion
//#region extensions/telegram/src/rich-blocks-html-map.ts
const BLOCK_ISLAND_TAGS = /* @__PURE__ */ new Set([
	"details",
	"table",
	"ul",
	"ol",
	"figure",
	"img",
	"video",
	"audio",
	"blockquote",
	"aside",
	"footer",
	"hr",
	"tg-math-block",
	"tg-map",
	"tg-collage",
	"tg-slideshow",
	"a"
]);
const MEDIA_SRC_RE = /^https:\/\//i;
function hasStrayContent(nodes, allowed) {
	return nodes.some((node) => node.kind === "text" ? node.text.trim() !== "" : !allowed.has(node.name));
}
function mediaBlockFromElement(node, caption) {
	const src = parseHtmlAttrs(node.raw).get("src") ?? "";
	const hasBody = node.children.some((child) => child.kind === "text" ? child.text.trim() !== "" : true);
	if (!MEDIA_SRC_RE.test(src) || hasBody) return;
	const withCaption = caption ? { caption } : {};
	const isGif = /\.gif(?:[?#]|$)/i.test(src);
	if (node.name === "img" || node.name === "video") {
		if (isGif) return {
			type: "animation",
			animation: {
				type: "animation",
				media: src
			},
			...withCaption
		};
		return node.name === "img" ? {
			type: "photo",
			photo: {
				type: "photo",
				media: src
			},
			...withCaption
		} : {
			type: "video",
			video: {
				type: "video",
				media: src
			},
			...withCaption
		};
	}
	if (node.name === "audio") {
		if (/\.(?:ogg|opus|oga)(?:[?#]|$)/i.test(src)) return {
			type: "voice_note",
			voice_note: {
				type: "voice_note",
				media: src
			},
			...withCaption
		};
		return {
			type: "audio",
			audio: {
				type: "audio",
				media: src
			},
			...withCaption
		};
	}
}
function countChildren(nodes, name) {
	return nodes.filter((node) => node.kind === "element" && node.name === name).length;
}
function captionFromFigcaption(nodes) {
	const figcaption = nodes.find((node) => node.kind === "element" && node.name === "figcaption");
	if (!figcaption) return;
	const cite = figcaption.children.find((node) => node.kind === "element" && node.name === "cite");
	const text = htmlNodesToRichText(figcaption.children.filter((node) => node !== cite));
	if (text === "" && !cite) return;
	return {
		text,
		...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
	};
}
const FIGURE_CHILDREN = /* @__PURE__ */ new Set([
	"img",
	"video",
	"audio",
	"tg-map",
	"figcaption"
]);
function figureToBlock(node) {
	if (hasStrayContent(node.children, FIGURE_CHILDREN)) return;
	if (node.children.filter((child) => child.kind === "element" && child.name !== "figcaption").length > 1 || countChildren(node.children, "figcaption") > 1) return;
	const media = node.children.find((child) => child.kind === "element" && (child.name === "img" || child.name === "video" || child.name === "audio" || child.name === "tg-map"));
	if (!media) return;
	const caption = captionFromFigcaption(node.children);
	if (media.name === "tg-map") {
		const map = mapToBlock(media);
		if (map?.type === "map" && caption) return {
			...map,
			caption
		};
		return map;
	}
	return mediaBlockFromElement(media, caption);
}
const LIST_CHILDREN = /* @__PURE__ */ new Set(["li"]);
function listToBlock(node) {
	if (hasStrayContent(node.children, LIST_CHILDREN)) return;
	const items = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name !== "li") continue;
		const checkbox = child.children.find((grandchild) => grandchild.kind === "element" && grandchild.name === "input" && parseHtmlAttrs(grandchild.raw).get("type") === "checkbox");
		const blocks = htmlNodesToBlocks(child.children.filter((grandchild) => grandchild !== checkbox));
		const item = { blocks: blocks.length > 0 ? blocks : [{
			type: "paragraph",
			text: ""
		}] };
		if (checkbox) {
			item.has_checkbox = true;
			if (parseHtmlAttrs(checkbox.raw).has("checked")) item.is_checked = true;
		}
		items.push(item);
	}
	if (items.length === 0) return;
	return {
		type: "list",
		items: node.name === "ol" ? items.map((item, index) => ({
			...item,
			value: index + 1
		})) : items
	};
}
const CELL_ALIGN_VALUES = /* @__PURE__ */ new Set([
	"left",
	"center",
	"right"
]);
function tableCellFromElement(node, inHeader) {
	const attrs = parseHtmlAttrs(node.raw);
	const text = htmlNodesToRichText(node.children);
	const colspan = strictNumber(attrs.get("colspan"), /^\d+$/u) ?? NaN;
	const rowspan = strictNumber(attrs.get("rowspan"), /^\d+$/u) ?? NaN;
	const align = attrs.get("align")?.toLowerCase();
	return {
		...text !== "" ? { text } : {},
		...node.name === "th" || inHeader ? { is_header: true } : {},
		...Number.isSafeInteger(colspan) && colspan > 1 ? { colspan } : {},
		...Number.isSafeInteger(rowspan) && rowspan > 1 ? { rowspan } : {},
		...align && CELL_ALIGN_VALUES.has(align) ? { align } : {}
	};
}
const TABLE_COLUMN_LIMIT = 20;
function tableColumnCount(cells) {
	let carryover = [];
	let max = 0;
	for (const row of cells) {
		const carried = carryover.reduce((total, cell) => total + cell.span, 0);
		const own = row.reduce((total, cell) => total + (cell.colspan ?? 1), 0);
		max = Math.max(max, carried + own);
		carryover = [...carryover.map((cell) => ({
			span: cell.span,
			rows: cell.rows - 1
		})).filter((cell) => cell.rows > 0), ...row.filter((cell) => (cell.rowspan ?? 1) > 1).map((cell) => ({
			span: cell.colspan ?? 1,
			rows: (cell.rowspan ?? 1) - 1
		}))];
	}
	return max;
}
const TABLE_CHILDREN = /* @__PURE__ */ new Set([
	"caption",
	"thead",
	"tbody",
	"tfoot",
	"tr"
]);
const TABLE_ROW_CHILDREN = /* @__PURE__ */ new Set(["td", "th"]);
function tableToBlock(node) {
	if (hasStrayContent(node.children, TABLE_CHILDREN)) return;
	const cells = [];
	let caption;
	let stray = false;
	const visitRows = (parent, inHeader) => {
		for (const child of parent.children) {
			if (child.kind !== "element") {
				stray ||= child.text.trim() !== "";
				continue;
			}
			if (child.name === "caption") {
				const text = htmlNodesToRichText(child.children);
				if (text !== "") {
					stray ||= caption !== void 0;
					caption = text;
				}
				continue;
			}
			if (child.name === "thead" || child.name === "tbody" || child.name === "tfoot") {
				visitRows(child, child.name === "thead");
				continue;
			}
			if (child.name === "tr") {
				if (hasStrayContent(child.children, TABLE_ROW_CHILDREN)) {
					stray = true;
					continue;
				}
				const row = child.children.filter((cell) => cell.kind === "element" && (cell.name === "td" || cell.name === "th")).map((cell) => tableCellFromElement(cell, inHeader));
				if (row.length > 0) cells.push(row);
				continue;
			}
			stray = true;
		}
	};
	visitRows(node, false);
	if (stray || cells.length === 0) return;
	if (tableColumnCount(cells) > TABLE_COLUMN_LIMIT) {
		const grid = renderTelegramMonospaceGrid(cells.map((row) => row.flatMap((cell) => Array.from({ length: Math.min(cell.colspan ?? 1, 21) }, (_value, index) => index === 0 ? richTextToPlainString(cell.text ?? "") : ""))));
		return {
			type: "pre",
			text: caption !== void 0 ? `${richTextToPlainString(caption)}\n${grid}` : grid
		};
	}
	return {
		type: "table",
		cells,
		is_bordered: true,
		is_striped: true,
		...caption !== void 0 ? { caption } : {}
	};
}
function strictNumber(value, token = /^-?\d+(?:\.\d+)?$/) {
	if (value === void 0 || !token.test(value.trim())) return;
	return Number.parseFloat(value);
}
function mapToBlock(node) {
	const attrs = parseHtmlAttrs(node.raw);
	const latitude = strictNumber(attrs.get("lat"));
	const longitude = strictNumber(attrs.get("long"));
	if (!(latitude !== void 0 && longitude !== void 0 && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180)) return;
	const zoom = strictNumber(attrs.get("zoom")) ?? NaN;
	return {
		type: "map",
		location: {
			latitude,
			longitude
		},
		zoom: Number.isFinite(zoom) ? Math.min(24, Math.max(0, Math.round(zoom))) : 14,
		width: 800,
		height: 450
	};
}
const COLLAGE_CHILDREN = /* @__PURE__ */ new Set([
	"figure",
	"img",
	"video",
	"audio",
	"figcaption"
]);
function collageToBlock(node) {
	if (hasStrayContent(node.children, COLLAGE_CHILDREN) || countChildren(node.children, "figcaption") > 1) return;
	const blocks = [];
	for (const child of node.children) {
		if (child.kind !== "element" || child.name === "figcaption") continue;
		const media = child.name === "figure" ? figureToBlock(child) : mediaBlockFromElement(child);
		if (!media) return;
		blocks.push(media);
	}
	if (blocks.length === 0) return;
	const caption = captionFromFigcaption(node.children);
	return {
		type: node.name === "tg-slideshow" ? "slideshow" : "collage",
		blocks,
		...caption ? { caption } : {}
	};
}
function richTextIsBlank(text) {
	if (typeof text === "string") return text.trim() === "";
	if (Array.isArray(text)) return text.every(richTextIsBlank);
	if (text.type === "mathematical_expression") return text.expression.trim() === "";
	if (text.type === "custom_emoji") return false;
	return richTextIsBlank(text.text);
}
/** Map island element nodes plus loose text into typed blocks. */
function htmlNodesToBlocks(nodes) {
	const blocks = [];
	let pendingInline = [];
	const flushInline = () => {
		if (pendingInline.length === 0) return;
		const text = htmlNodesToRichText(pendingInline);
		pendingInline = [];
		if (!richTextIsBlank(text)) blocks.push({
			type: "paragraph",
			text
		});
	};
	for (const node of nodes) {
		const block = node.kind === "element" ? elementToBlock(node) : void 0;
		if (block) {
			flushInline();
			blocks.push(block);
			continue;
		}
		if (node.kind === "element" && node.name === "p") {
			flushInline();
			const text = htmlNodesToRichText(node.children);
			if (text !== "") blocks.push({
				type: "paragraph",
				text
			});
			continue;
		}
		pendingInline.push(node);
	}
	flushInline();
	return blocks;
}
function elementToBlock(node) {
	switch (node.name) {
		case "hr": return { type: "divider" };
		case "details": {
			const summary = node.children.find((child) => child.kind === "element" && child.name === "summary");
			const blocks = htmlNodesToBlocks(node.children.filter((child) => child !== summary));
			return {
				type: "details",
				summary: summary ? htmlNodesToRichText(summary.children) : "Details",
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...parseHtmlAttrs(node.raw).has("open") ? { is_open: true } : {}
			};
		}
		case "ul":
		case "ol": return listToBlock(node);
		case "table": return tableToBlock(node);
		case "figure": return figureToBlock(node);
		case "img":
		case "video":
		case "audio": return mediaBlockFromElement(node);
		case "blockquote": {
			const cite = node.children.find((child) => child.kind === "element" && child.name === "cite");
			const blocks = htmlNodesToBlocks(node.children.filter((child) => child !== cite));
			if (blocks.length === 0) return;
			const credit = cite ? htmlNodesToRichText(cite.children) : "";
			return credit !== "" ? {
				type: "blockquote",
				blocks,
				credit
			} : {
				type: "blockquote",
				blocks
			};
		}
		case "aside": {
			const cite = node.children.find((child) => child.kind === "element" && child.name === "cite");
			const text = htmlNodesToRichText(node.children.filter((child) => child !== cite));
			if (text === "") return;
			return {
				type: "pullquote",
				text,
				...cite ? { credit: htmlNodesToRichText(cite.children) } : {}
			};
		}
		case "footer": {
			const text = htmlNodesToRichText(node.children);
			return text === "" ? void 0 : {
				type: "footer",
				text
			};
		}
		case "tg-math-block": {
			const expression = nodeText(node.children).trim();
			return expression ? {
				type: "mathematical_expression",
				expression
			} : void 0;
		}
		case "tg-map": return mapToBlock(node);
		case "tg-collage":
		case "tg-slideshow": return collageToBlock(node);
		case "a": {
			const attrs = parseHtmlAttrs(node.raw);
			const name = attrs.get("name");
			if (name && !attrs.get("href") && nodeText(node.children).trim() === "") return {
				type: "anchor",
				name
			};
			return;
		}
		default: return;
	}
}
/**
* Find supported block islands inside a text range. Returns non-overlapping
* spans in order; text outside spans stays on the markdown paragraph path.
*/
function findTelegramHtmlIslands(text) {
	if (!text.includes("<")) return [];
	const islands = [];
	const tags = [...tokenizeHtmlTags(text)];
	const openContainers = [];
	let index = 0;
	while (index < tags.length) {
		const tag = tags[index];
		if (!tag) {
			index += 1;
			continue;
		}
		if (!(!tag.closing && BLOCK_ISLAND_TAGS.has(tag.name) && openContainers.length === 0)) {
			if (tag.closing) {
				const openIndex = openContainers.lastIndexOf(tag.name);
				if (openIndex >= 0) openContainers.length = openIndex;
			} else if (!tag.selfClosing && !VOID_TAGS.has(tag.name)) openContainers.push(tag.name);
			index += 1;
			continue;
		}
		let end = tag.end;
		const contentStart = tag.end;
		let contentEnd = tag.end;
		let matched = tag.selfClosing || VOID_TAGS.has(tag.name);
		if (!matched) {
			let depth = 1;
			let codeDepth = 0;
			let scan = index + 1;
			while (scan < tags.length) {
				const candidate = tags[scan];
				if (candidate && (candidate.name === "code" || candidate.name === "pre")) {
					if (candidate.closing) codeDepth = Math.max(0, codeDepth - 1);
					else if (!candidate.selfClosing) codeDepth += 1;
					scan += 1;
					continue;
				}
				if (candidate && candidate.name === tag.name && codeDepth === 0) {
					depth += candidate.closing ? -1 : candidate.selfClosing ? 0 : 1;
					if (depth === 0) {
						end = candidate.end;
						contentEnd = candidate.start;
						matched = true;
						index = scan;
						break;
					}
				}
				scan += 1;
			}
		}
		if (!matched) {
			openContainers.push(tag.name);
			index += 1;
			continue;
		}
		if (tag.name === "a") {
			const attrs = parseHtmlAttrs(tag.raw);
			if (!(attrs.get("name") !== void 0 && attrs.get("href") === void 0 && text.slice(contentStart, contentEnd).trim() === "")) {
				index += 1;
				continue;
			}
		}
		const blocks = htmlNodesToBlocks(parseHtmlFragment(text.slice(tag.start, end)));
		if (blocks.length > 0) islands.push({
			start: tag.start,
			end,
			blocks
		});
		index += 1;
	}
	return islands;
}
//#endregion
//#region extensions/telegram/src/rich-blocks-list.ts
/** Groups exact parser-owned item spans by list identity without reparsing Markdown. */
function collectMarkdownRichListSources(ir) {
	const byListId = /* @__PURE__ */ new Map();
	for (const item of ir.listItems ?? []) {
		if (!item.listMarker || item.listId === void 0 || item.start === void 0 || item.end === void 0) continue;
		const markerText = ir.text.slice(item.listMarker.start, item.listMarker.end);
		const taskText = item.taskMarker ? ir.text.slice(item.taskMarker.start, item.taskMarker.end) : "";
		const value = item.kind === "ordered" ? Number.parseInt(markerText, 10) : void 0;
		const source = {
			kind: item.kind,
			start: item.start,
			end: item.end,
			contentStart: item.taskMarker?.end ?? item.listMarker.end,
			task: item.task === true,
			checked: /^\[[xX]\]/u.test(taskText),
			...value !== void 0 && Number.isFinite(value) ? { value } : {}
		};
		const list = byListId.get(item.listId) ?? [];
		list.push(source);
		byListId.set(item.listId, list);
	}
	return [...byListId.values()].map((items) => {
		items.sort((left, right) => left.start - right.start);
		return {
			start: Math.min(...items.map((item) => item.start)),
			end: Math.max(...items.map((item) => item.end)),
			items
		};
	});
}
/** Renders one parser list; nested containers arrive through renderRange. */
function renderMarkdownRichListSource(source, renderRange) {
	const kind = source.items[0]?.kind;
	if (!kind || source.items.some((item) => item.kind !== kind)) return;
	return [{
		type: "list",
		items: source.items.map((item) => {
			const blocks = renderRange(item.contentStart, item.end);
			return {
				blocks: blocks.length > 0 ? blocks : [{
					type: "paragraph",
					text: ""
				}],
				...item.task ? { has_checkbox: true } : {},
				...item.checked ? { is_checked: true } : {},
				...kind === "ordered" && item.value !== void 0 ? { value: item.value } : {}
			};
		})
	}];
}
//#endregion
//#region extensions/telegram/src/rich-blocks.ts
const TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT = 20;
const TELEGRAM_RICH_FORMAT_PROFILE = FormatCapabilityProfile.define({
	mechanism: "blocks",
	chunk: {
		limit: 32768,
		unit: "chars"
	}
});
const INLINE_STYLE_RANK = {
	spoiler: 0,
	bold: 1,
	italic: 2,
	strikethrough: 3,
	code: 4
};
const TELEGRAM_RICH_LINK_HREF_RE = /^(?:https?:\/\/|tg:\/\/|mailto:|tel:)/i;
function isTelegramRichLinkHref(href) {
	return TELEGRAM_RICH_LINK_HREF_RE.test(href);
}
function resolveHeadingSize(style) {
	switch (style) {
		case "heading_1": return 1;
		case "heading_2": return 2;
		case "heading_3": return 3;
		case "heading_4": return 4;
		case "heading_5": return 5;
		case "heading_6": return 6;
		default: return;
	}
}
function isInlineStyle(style) {
	return style === "bold" || style === "italic" || style === "strikethrough" || style === "code" || style === "spoiler";
}
function resolveTelegramLinkAction(link, source, context) {
	const href = link.href.trim();
	if (!href || link.start === link.end) return null;
	const label = source.slice(link.start, link.end);
	if (context.origin === "linkify") return isAutoLinkedFileRef(href, label) ? { kind: "code" } : null;
	if (href.startsWith("#")) return {
		kind: "anchor",
		name: href.slice(1)
	};
	if (!isTelegramRichLinkHref(href)) return null;
	return {
		kind: "url",
		href
	};
}
function collectTelegramLinkActions(ir) {
	const links = [];
	renderMarkdownWithMarkers(ir, {
		styleMarkers: {},
		escapeText: (text) => text,
		buildLink: (link, source, context) => {
			const action = resolveTelegramLinkAction(link, source, context);
			if (action) links.push({
				start: link.start,
				end: link.end,
				action
			});
			return null;
		}
	}, TELEGRAM_RICH_FORMAT_PROFILE);
	return links;
}
/**
* Build nested RichText from IR spans over [rangeStart, rangeEnd).
* Spans that partially overlap are split at shared boundaries (IR contract).
*/
function irRangeToRichText(ir, rangeStart, rangeEnd) {
	if (rangeEnd <= rangeStart) return "";
	const slice = sliceMarkdownIR(ir, rangeStart, rangeEnd);
	const text = slice.text;
	if (!text) return "";
	const dominantAnnotationRanges = (slice.annotations ?? []).filter((span) => span.type === "assistant_transcript_role").map((span) => ({
		start: span.start,
		end: span.end
	}));
	const suppressed = (start, end) => dominantAnnotationRanges.some((range) => start < range.end && end > range.start);
	const styleSpans = slice.styles.filter((span) => isInlineStyle(span.style) && !suppressed(span.start, span.end));
	const annotationSpans = (slice.annotations ?? []).filter((span) => span.type === "assistant_transcript_role");
	const links = collectTelegramLinkActions({
		text,
		styles: [],
		links: slice.links.filter((link) => !suppressed(link.start, link.end))
	});
	const boundaries = /* @__PURE__ */ new Set([0, text.length]);
	for (const span of styleSpans) {
		boundaries.add(span.start);
		boundaries.add(span.end);
	}
	for (const span of annotationSpans) {
		boundaries.add(span.start);
		boundaries.add(span.end);
	}
	for (const link of links) {
		boundaries.add(link.start);
		boundaries.add(link.end);
	}
	const points = [...boundaries].toSorted((a, b) => a - b);
	const stack = [];
	const root = [];
	const frameStack = [root];
	const pushNode = (node) => {
		frameStack.at(-1)?.push(node);
	};
	const openStyleNode = (style, end) => {
		const container = [];
		pushNode({
			type: style,
			text: container
		});
		stack.push({
			kind: "style",
			style,
			end
		});
		frameStack.push(container);
	};
	const openAnnotationNode = (end) => {
		const container = [];
		pushNode({
			type: "code",
			text: container
		});
		stack.push({
			kind: "annotation",
			end
		});
		frameStack.push(container);
	};
	const openLinkNode = (target, end) => {
		const container = [];
		pushNode(target.kind === "url" ? {
			type: "url",
			text: container,
			url: target.href
		} : {
			type: "anchor_link",
			text: container,
			anchor_name: target.name
		});
		stack.push({
			kind: "link",
			target,
			end
		});
		frameStack.push(container);
	};
	for (let i = 0; i < points.length - 1; i += 1) {
		const start = points[i] ?? 0;
		const end = points[i + 1] ?? start;
		while (stack.length > 0 && (stack.at(-1)?.end ?? 0) <= start) {
			stack.pop();
			frameStack.pop();
		}
		const opening = [];
		for (const span of annotationSpans) if (span.start === start) opening.push({
			kind: "annotation",
			end: span.end
		});
		for (const link of links) {
			if (link.start !== start) continue;
			if (link.action.kind === "url" || link.action.kind === "anchor") opening.push({
				kind: "link",
				target: link.action,
				end: link.end
			});
			else opening.push({
				kind: "style",
				style: "code",
				end: link.end
			});
		}
		for (const span of styleSpans) if (span.start === start && isInlineStyle(span.style)) opening.push({
			kind: "style",
			style: span.style,
			end: span.end
		});
		opening.sort((left, right) => {
			if (left.end !== right.end) return right.end - left.end;
			return (left.kind === "style" ? INLINE_STYLE_RANK[left.style] ?? 99 : left.kind === "link" ? 50 : 0) - (right.kind === "style" ? INLINE_STYLE_RANK[right.style] ?? 99 : right.kind === "link" ? 50 : 0);
		});
		const inCode = stack.some((entry) => entry.kind === "style" && entry.style === "code") || stack.some((entry) => entry.kind === "annotation");
		for (const item of opening) if (item.kind === "annotation") openAnnotationNode(item.end);
		else if (item.kind === "link") {
			if (!inCode && !stack.some((entry) => entry.kind === "link")) openLinkNode(item.target, item.end);
		} else if (!inCode || item.style === "code") {
			if (!(item.style === "code" && inCode)) openStyleNode(item.style, item.end);
		}
		if (end > start) pushNode(text.slice(start, end));
	}
	while (stack.length > 0) {
		stack.pop();
		frameStack.pop();
	}
	return normalizeRichText(applyInlineHtmlIslands(root));
}
function applyInlineHtmlIslands(node) {
	if (typeof node === "string") return parseInlineHtmlIslands(node);
	if (Array.isArray(node)) return node.map(applyInlineHtmlIslands);
	if (node.type === "code" || node.type === "mathematical_expression" || node.type === "custom_emoji") return node;
	return {
		...node,
		text: applyInlineHtmlIslands(node.text)
	};
}
function pushParagraph(paragraphs, ir, rangeStart, rangeEnd) {
	const raw = ir.text.slice(rangeStart, rangeEnd);
	const leading = raw.length - raw.trimStart().length;
	const trailing = raw.length - raw.trimEnd().length;
	const absStart = rangeStart + leading;
	const absEnd = rangeEnd - trailing;
	if (absEnd <= absStart) return;
	const text = irRangeToRichText(ir, absStart, absEnd);
	if (text !== "") paragraphs.push({
		type: "paragraph",
		text
	});
}
function splitParagraphs(ir, start, end) {
	if (end <= start) return [];
	const text = ir.text.slice(start, end);
	const paragraphs = [];
	const blankLine = /\n[ \t]*\n+/g;
	let last = 0;
	let match;
	while ((match = blankLine.exec(text)) !== null) {
		pushParagraph(paragraphs, ir, start + last, start + match.index);
		last = match.index + match[0].length;
	}
	pushParagraph(paragraphs, ir, start + last, end);
	return paragraphs;
}
function emitGapBlocks(ir, start, end) {
	if (end <= start) return [];
	const codeRanges = ir.styles.filter((span) => (span.style === "code" || span.style === "code_block") && span.end > start && span.start < end);
	const islands = findTelegramHtmlIslands(ir.text.slice(start, end)).filter((island) => !codeRanges.some((range) => start + island.start >= range.start && start + island.start < range.end));
	if (islands.length === 0) return splitParagraphs(ir, start, end);
	const blocks = [];
	let cursor = start;
	for (const island of islands) {
		blocks.push(...splitParagraphs(ir, cursor, start + island.start));
		blocks.push(...island.blocks);
		cursor = start + island.end;
	}
	blocks.push(...splitParagraphs(ir, cursor, end));
	return blocks;
}
function renderAsciiTableGrid(table) {
	return renderTelegramMonospaceGrid([table.headers, ...table.rows], { headerSeparator: true });
}
function cellToRichText(cell) {
	if (!cell?.text) return;
	const rich = irRangeToRichText({
		text: cell.text,
		styles: cell.styles,
		links: cell.links,
		...cell.annotations ? { annotations: cell.annotations } : {}
	}, 0, cell.text.length);
	return rich === "" ? void 0 : rich;
}
function renderTableBlock(table) {
	const columnCount = Math.max(table.headers.length, ...table.rows.map((row) => row.length), 0);
	if (columnCount > TELEGRAM_RICH_TEXT_TABLE_COLUMN_LIMIT) return {
		block: {
			type: "pre",
			text: renderAsciiTableGrid(table)
		},
		degradation: "table-ascii"
	};
	const headerRow = table.headerCells.map((cell, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(cell);
		return {
			is_header: true,
			...text !== void 0 ? { text } : {},
			...align ? { align } : {}
		};
	});
	const bodyRows = table.rowCells.map((row) => Array.from({ length: columnCount }, (_value, index) => {
		const align = table.aligns?.[index];
		const text = cellToRichText(row[index]);
		return {
			...text !== void 0 ? { text } : {},
			...align ? { align } : {}
		};
	}));
	return { block: {
		type: "table",
		cells: headerRow.length > 0 ? [headerRow, ...bodyRows] : bodyRows,
		is_bordered: true,
		is_striped: true
	} };
}
function collectStructuralSegments(ir, tables) {
	const segments = [];
	for (const span of ir.styles) {
		if (span.end <= span.start) continue;
		const headingSize = resolveHeadingSize(span.style);
		if (headingSize) {
			segments.push({
				kind: "heading",
				start: span.start,
				end: span.end,
				size: headingSize
			});
			continue;
		}
		if (span.style === "code_block") {
			segments.push({
				kind: "code_block",
				start: span.start,
				end: span.end,
				...span.language ? { language: span.language } : {}
			});
			continue;
		}
		if (span.style === "blockquote") segments.push({
			kind: "blockquote",
			start: span.start,
			end: span.end
		});
	}
	for (const table of tables) {
		const offset = Math.max(0, Math.min(table.placeholderOffset, ir.text.length));
		segments.push({
			kind: "table",
			start: offset,
			end: offset,
			table
		});
	}
	for (const source of collectMarkdownRichListSources(ir)) segments.push({
		kind: "list",
		start: source.start,
		end: source.end,
		source
	});
	const containerRank = (segment) => segment.kind === "blockquote" ? 0 : segment.kind === "list" ? 1 : 2;
	return segments.toSorted((left, right) => left.start - right.start || right.end - left.end || containerRank(left) - containerRank(right));
}
function emitSegments(ir, segments, rangeStart, rangeEnd, degradationReasons) {
	const blocks = [];
	let cursor = rangeStart;
	let index = 0;
	while (index < segments.length) {
		const segment = segments[index];
		if (!segment) break;
		if (segment.start > cursor) blocks.push(...emitGapBlocks(ir, cursor, segment.start));
		let next = index + 1;
		while (next < segments.length && (segments[next]?.start ?? rangeEnd) < segment.end) next += 1;
		const children = segments.slice(index + 1, next);
		switch (segment.kind) {
			case "heading": {
				const text = irRangeToRichText(ir, segment.start, segment.end);
				if (text !== "") blocks.push({
					type: "heading",
					text,
					size: segment.size
				});
				break;
			}
			case "code_block": {
				const text = ir.text.slice(segment.start, segment.end).replace(/\n$/, "");
				blocks.push({
					type: "pre",
					text,
					...segment.language ? { language: segment.language } : {}
				});
				break;
			}
			case "blockquote": {
				const inner = emitSegments(ir, children, segment.start, segment.end, degradationReasons);
				if (inner.length > 0) blocks.push({
					type: "blockquote",
					blocks: inner
				});
				break;
			}
			case "list": {
				const rendered = renderMarkdownRichListSource(segment.source, (start, end) => emitSegments(ir, children.filter((child) => child.start >= start && child.end <= end), start, end, degradationReasons));
				if (rendered) blocks.push(...rendered);
				else {
					degradationReasons.add("list-limit");
					blocks.push(...emitSegments(ir, children.filter((child) => child.kind !== "list"), segment.start, segment.end, degradationReasons));
				}
				break;
			}
			case "table": {
				const rendered = renderTableBlock(segment.table);
				if (rendered.degradation) degradationReasons.add(rendered.degradation);
				blocks.push(rendered.block);
				break;
			}
		}
		cursor = Math.max(cursor, segment.end);
		index = next;
	}
	if (cursor < rangeEnd) blocks.push(...emitGapBlocks(ir, cursor, rangeEnd));
	return blocks;
}
function markdownToTelegramRichBlocks(markdown, options = {}) {
	const tableMode = options.tableMode ?? "block";
	const { ir, tables } = markdownToIRWithMeta(markdown ?? "", {
		assistantTranscriptRoleHeaders: true,
		linkify: options.skipEntityDetection !== true,
		enableSpoilers: true,
		enableTaskLists: true,
		headingStyle: "rich",
		blockquotePrefix: "",
		tableMode
	});
	let degradationReasons = /* @__PURE__ */ new Set();
	const segments = collectStructuralSegments(ir, tables);
	const hasMarkdownLists = segments.some((segment) => segment.kind === "list");
	const flattenedSegments = segments.filter((segment) => segment.kind !== "list");
	let blocks = emitSegments(ir, segments, 0, ir.text.length, degradationReasons);
	if (hasMarkdownLists && maxInputRichBlockNesting(blocks) > 16) {
		degradationReasons = /* @__PURE__ */ new Set();
		degradationReasons.add("list-limit");
		blocks = emitSegments(ir, flattenedSegments, 0, ir.text.length, degradationReasons);
	}
	if (blocks.length === 0 && ir.text.trim()) blocks.push({
		type: "paragraph",
		text: ir.text
	});
	const plainBlocks = hasMarkdownLists ? emitSegments(ir, flattenedSegments, 0, ir.text.length, /* @__PURE__ */ new Set()) : blocks;
	return {
		blocks,
		plainText: inputRichBlocksToPlainText(plainBlocks),
		degradationReasons: [...degradationReasons]
	};
}
//#endregion
//#region extensions/telegram/src/rich-message.ts
const TELEGRAM_RICH_TEXT_LIMIT = 32768;
const TELEGRAM_RICH_BLOCK_LIMIT = 500;
const TELEGRAM_RICH_EMAIL_TOKEN_RE = /[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?(?:\.[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?)+/iu;
function shouldSkipTelegramRichEntityDetection(text, options) {
	return options?.skipEntityDetection === true || TELEGRAM_RICH_EMAIL_TOKEN_RE.test(text);
}
function getTelegramRichRawApi(api) {
	const raw = api.raw;
	if (raw) return raw;
	throw new Error("Telegram rich messages require grammY api.raw");
}
function finiteInteger(value) {
	return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : void 0;
}
function isReplyParameters(value) {
	if (!value || typeof value !== "object") return false;
	return finiteInteger(value.message_id) !== void 0;
}
function toTelegramRichMessageContextParams(params) {
	const richParams = {};
	const directMessagesTopicId = finiteInteger(params?.direct_messages_topic_id);
	if (directMessagesTopicId !== void 0) richParams.direct_messages_topic_id = directMessagesTopicId;
	else {
		const messageThreadId = finiteInteger(params?.message_thread_id);
		if (messageThreadId !== void 0) richParams.message_thread_id = messageThreadId;
	}
	if (params?.disable_notification === true) richParams.disable_notification = true;
	if (isReplyParameters(params?.reply_parameters)) {
		richParams.reply_parameters = params.reply_parameters;
		return richParams;
	}
	const replyToMessageId = finiteInteger(params?.reply_to_message_id);
	if (replyToMessageId !== void 0) richParams.reply_parameters = {
		message_id: replyToMessageId,
		allow_sending_without_reply: true
	};
	return richParams;
}
function removeTelegramRichNativeQuoteParam(params) {
	const richParams = toTelegramRichMessageContextParams(params);
	if (!richParams.reply_parameters) return richParams;
	const { quote: _quote, quote_entities: _quoteEntities, quote_parse_mode: _quoteParseMode, quote_position: _quotePosition, ...replyParameters } = richParams.reply_parameters;
	return {
		...richParams,
		reply_parameters: replyParameters
	};
}
function toRichMessage(blocks, plainText, options) {
	return shouldSkipTelegramRichEntityDetection(plainText, options) ? {
		blocks,
		skip_entity_detection: true
	} : { blocks };
}
function buildTelegramRichMarkdownPlan(markdown, options) {
	const skipEntityDetection = shouldSkipTelegramRichEntityDetection(markdown, options);
	const rendered = markdownToTelegramRichBlocks(markdown, {
		tableMode: options?.tableMode,
		skipEntityDetection
	});
	return {
		richMessage: toRichMessage(rendered.blocks, rendered.plainText, {
			...options,
			skipEntityDetection
		}),
		plainText: rendered.plainText,
		degradationReasons: rendered.degradationReasons
	};
}
function buildTelegramRichMarkdown(markdown, options) {
	return buildTelegramRichMarkdownPlan(markdown, options).richMessage;
}
function buildTelegramRichBlocksPlan(blocks, options) {
	const plainText = options?.plainText ?? inputRichBlocksToPlainText(blocks);
	return {
		richMessage: toRichMessage(blocks, plainText, options),
		plainText,
		degradationReasons: []
	};
}
function splitTelegramRichMessageTextChunks(params) {
	const plan = "plan" in params ? params.plan : buildTelegramRichMarkdownPlan(params.text, {
		tableMode: params.tableMode,
		skipEntityDetection: params.skipEntityDetection
	});
	const chunkOptions = { skipEntityDetection: plan.richMessage.skip_entity_detection === true };
	const chunked = splitTelegramRichBlocks(plan.richMessage.blocks, {
		blockLimit: TELEGRAM_RICH_BLOCK_LIMIT,
		textLimit: params.textLimit
	}).map((blocks, index) => {
		const plainText = inputRichBlocksToPlainText(blocks);
		return {
			richMessage: toRichMessage(blocks, plainText, chunkOptions),
			plainText,
			degradationReasons: index === 0 ? plan.degradationReasons : []
		};
	});
	if (chunked.length === 0 && "text" in params && params.text.trim()) return [{
		richMessage: toRichMessage([{
			type: "paragraph",
			text: params.text
		}], params.text, chunkOptions),
		plainText: params.text,
		degradationReasons: plan.degradationReasons
	}];
	return chunked;
}
//#endregion
//#region extensions/telegram/src/text-chunk-limit.ts
const TELEGRAM_TEXT_CHUNK_LIMIT = 4e3;
function resolveTelegramTextChunkLimit(params) {
	const platformLimit = mergeTelegramAccountConfig(params.cfg, params.accountId ?? resolveDefaultTelegramAccountId(params.cfg)).richMessages === true && params.formatting?.parseMode !== "HTML" ? TELEGRAM_RICH_TEXT_LIMIT : TELEGRAM_TEXT_CHUNK_LIMIT;
	return Math.min(resolveTextChunkLimit(params.cfg, "telegram", params.accountId ?? void 0, { fallbackLimit: platformLimit }), platformLimit);
}
//#endregion
export { TELEGRAM_MAX_CAPTION_LENGTH as A, resolveTelegramScopedGroupConfig as B, createTelegramPromptContextProjectionSequence as C, resolveTelegramPromptContextSource as D, resolveTelegramPromptContextDeliverySignature as E, normalizeTelegramMessagingTarget as F, telegramMessagingTargetsMatch as I, resolveTelegramDirectToolPolicy as L, splitTelegramCaption as M, telegramCaptionDeliveryMetadata as N, withTelegramPromptContextSource as O, looksLikeTelegramTargetId as P, resolveTelegramGroupIngestEnabled as R, createTelegramPromptContextProjectionCursor as S, resolveCompleteTelegramPromptContextProjectionIds as T, withTelegramPlainFallback as _, buildTelegramRichMarkdown as a, italicRichText as b, removeTelegramRichNativeQuoteParam as c, markdownToTelegramRichBlocks as d, splitTelegramRichBlocks as f, warnTelegramRichBlocksDegradations as g, splitTelegramPlainTextChunks as h, buildTelegramRichBlocksPlan as i, resolveTelegramPlainCaption as j, buildInlineKeyboard as k, splitTelegramRichMessageTextChunks as l, isTelegramHtmlParseError as m, resolveTelegramTextChunkLimit as n, buildTelegramRichMarkdownPlan as o, isTelegramEmptyContentError as p, TELEGRAM_RICH_TEXT_LIMIT as r, getTelegramRichRawApi as s, TELEGRAM_TEXT_CHUNK_LIMIT as t, toTelegramRichMessageContextParams as u, boldRichText as v, parseTelegramPromptContextProjection as w, paragraphBlock as x, codeRichText as y, resolveTelegramGroupPromptSettings as z };
