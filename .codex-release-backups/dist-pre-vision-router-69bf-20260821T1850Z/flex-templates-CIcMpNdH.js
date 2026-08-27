import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as resolvePinnedHostnameWithPolicy } from "./ssrf-CQ4RdJXm.js";
import "./channel-outbound-CI0BSGM5.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-_WMqEo47.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./text-utility-runtime-BSdEoze8.js";
import "./channel-secret-basic-runtime-BUtqhYr9.js";
//#region extensions/line/src/outbound-media.ts
const LINE_OUTBOUND_MEDIA_SSRF_POLICY = { allowPrivateNetwork: false };
async function validateLineMediaUrl(url) {
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("LINE outbound media URL must be a valid URL");
	}
	if (parsed.protocol !== "https:") throw new Error("LINE outbound media URL must use HTTPS");
	if (url.length > 2e3) throw new Error(`LINE outbound media URL must be 2000 chars or less (got ${url.length})`);
	await resolvePinnedHostnameWithPolicy(parsed.hostname, { policy: LINE_OUTBOUND_MEDIA_SSRF_POLICY });
}
function isHttpsUrl(url) {
	try {
		return new URL(url).protocol === "https:";
	} catch {
		return false;
	}
}
function detectLineMediaKindFromUrl(url) {
	try {
		const pathname = normalizeLowercaseStringOrEmpty(new URL(url).pathname);
		if (/\.(png|jpe?g|gif|webp|bmp|heic|heif|avif)$/i.test(pathname)) return "image";
		if (/\.(mp4|mov|m4v|webm)$/i.test(pathname)) return "video";
		if (/\.(mp3|m4a|aac|wav|ogg|oga)$/i.test(pathname)) return "audio";
	} catch {
		return;
	}
}
async function resolveLineOutboundMedia(mediaUrl, opts = {}) {
	const trimmedUrl = mediaUrl.trim();
	if (isHttpsUrl(trimmedUrl)) {
		await validateLineMediaUrl(trimmedUrl);
		const previewImageUrl = opts.previewImageUrl?.trim();
		if (previewImageUrl) await validateLineMediaUrl(previewImageUrl);
		return {
			mediaUrl: trimmedUrl,
			mediaKind: opts.mediaKind ?? (typeof opts.durationMs === "number" ? "audio" : void 0) ?? (opts.trackingId?.trim() ? "video" : void 0) ?? detectLineMediaKindFromUrl(trimmedUrl) ?? "image",
			...previewImageUrl ? { previewImageUrl } : {},
			...typeof opts.durationMs === "number" ? { durationMs: opts.durationMs } : {},
			...opts.trackingId ? { trackingId: opts.trackingId } : {}
		};
	}
	let parsed;
	try {
		parsed = new URL(trimmedUrl);
	} catch {}
	if (parsed) throw new Error("LINE outbound media URL must use HTTPS");
	throw new Error("LINE outbound media currently requires a public HTTPS URL");
}
function isLineUserTarget(target) {
	const normalized = target.trim().replace(/^line:(group|room|user):/i, "").replace(/^line:/i, "");
	return /^U/i.test(normalized);
}
function hasLineSpecificMediaOptions(lineData) {
	return lineData.mediaKind !== void 0 || Boolean(lineData.previewImageUrl?.trim()) || typeof lineData.durationMs === "number" || Boolean(lineData.trackingId?.trim());
}
function buildLineMediaMessageObject(resolved, opts) {
	switch (resolved.mediaKind) {
		case "video": {
			const previewImageUrl = resolved.previewImageUrl?.trim();
			if (!previewImageUrl) throw new Error("LINE video messages require previewImageUrl to reference an image URL");
			return {
				type: "video",
				originalContentUrl: resolved.mediaUrl,
				previewImageUrl,
				...opts?.allowTrackingId && resolved.trackingId ? { trackingId: resolved.trackingId } : {}
			};
		}
		case "audio": return {
			type: "audio",
			originalContentUrl: resolved.mediaUrl,
			duration: resolved.durationMs ?? 6e4
		};
		default: return {
			type: "image",
			originalContentUrl: resolved.mediaUrl,
			previewImageUrl: resolved.previewImageUrl ?? resolved.mediaUrl
		};
	}
}
async function buildLineMediaMessage(mediaUrl, opts, target) {
	return buildLineMediaMessageObject(await resolveLineOutboundMedia(mediaUrl, opts), { allowTrackingId: isLineUserTarget(target) });
}
//#endregion
//#region extensions/line/src/send-receipt.ts
function createLineSendReceipt(params) {
	const messageIds = (params.messageIds ?? [params.messageId]).map((messageId) => messageId.trim()).filter(Boolean);
	const chatId = params.chatId.trim();
	return createMessageReceiptFromOutboundResults({
		results: messageIds.map((messageId) => ({
			channel: "line",
			messageId,
			chatId,
			conversationId: chatId,
			meta: { messageCount: params.messageCount ?? 1 }
		})),
		...chatId ? { threadId: chatId } : {},
		kind: params.kind ?? "unknown"
	});
}
//#endregion
//#region extensions/line/src/actions.ts
const LINE_ACTION_LABEL_LIMIT = 20;
const LINE_ACTION_DATA_LIMIT = 300;
const LINE_ACTION_URI_LIMIT = 1e3;
const LINE_CLIPBOARD_TEXT_LIMIT = 1e3;
const LINE_RICH_MENU_ALIAS_LIMIT = 32;
const LINE_IMAGEMAP_ACTION_LABEL_LIMIT = 100;
const LINE_IMAGEMAP_MESSAGE_TEXT_LIMIT = 400;
const LINE_IMAGEMAP_EXTERNAL_LINK_LABEL_LIMIT = 30;
const LINE_IMAGEMAP_ACTION_LIMIT = 50;
const graphemeSegmenter = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function truncateLineActionText(text, limit) {
	let result = "";
	let count = 0;
	for (const { segment } of graphemeSegmenter.segment(text)) {
		const codePointCount = Array.from(segment).length;
		if (count + codePointCount > limit) break;
		result += segment;
		count += codePointCount;
	}
	return result;
}
function truncateLineActionLabel(label, limit = LINE_ACTION_LABEL_LIMIT) {
	return truncateLineActionText(label, limit) || (label ? "…" : "");
}
function truncateLineActionData(data) {
	return truncateUtf16Safe(data, LINE_ACTION_DATA_LIMIT);
}
const unavailableActionMarker = Symbol("lineUnavailableAction");
function unavailableAction(kind, reason) {
	const action = {
		type: "message",
		label: "Unavailable",
		text: `${kind} unavailable: ${reason}`
	};
	Object.defineProperty(action, unavailableActionMarker, { value: true });
	return action;
}
const actionTypes = /* @__PURE__ */ new Set([
	"camera",
	"cameraRoll",
	"clipboard",
	"datetimepicker",
	"location",
	"message",
	"postback",
	"richmenuswitch",
	"uri"
]);
function isLineAction(value) {
	return isRecord(value) && typeof value.type === "string" && actionTypes.has(value.type);
}
function isUnavailableAction(action) {
	return action[unavailableActionMarker] === true;
}
function normalizeNestedActions(value, labelLimit, warnings) {
	if (Array.isArray(value)) {
		const normalized = [];
		for (const item of value) normalized.push(normalizeNestedActions(item, labelLimit, warnings));
		return normalized;
	}
	if (!isRecord(value)) return value;
	const normalized = { ...value };
	for (const [key, nested] of Object.entries(value)) if ((key === "action" || key === "defaultAction") && isLineAction(nested)) {
		const action = normalizeLineAction(nested, labelLimit);
		if (warnings && key === "action" && (value.type === "video" && action.type !== "uri" || value.type !== "button" && isUnavailableAction(action))) {
			delete normalized[key];
			warnings.push(isUnavailableAction(action) ? action.text ?? "Action unavailable." : "Action unavailable in this video.");
		} else normalized[key] = action;
	} else if (key === "actions" && Array.isArray(nested)) normalized[key] = nested.map((action) => isLineAction(action) ? normalizeLineAction(action, labelLimit) : action);
	else normalized[key] = normalizeNestedActions(nested, labelLimit, warnings);
	return normalized;
}
function normalizeFlexBubbleActions(value) {
	if (!isRecord(value) || value.type !== "bubble") return normalizeNestedActions(value, 40);
	const warnings = [];
	const normalized = normalizeNestedActions(value, 40, warnings);
	if (!isRecord(normalized) || warnings.length === 0) return normalized;
	const warning = {
		type: "text",
		text: [...new Set(warnings)].join("\n"),
		wrap: true,
		size: "sm",
		color: "#B45309",
		margin: "md"
	};
	const body = normalized.body;
	if (isRecord(body) && Array.isArray(body.contents)) normalized.body = {
		...body,
		contents: [...body.contents, warning]
	};
	else normalized.body = {
		type: "box",
		layout: "vertical",
		contents: [warning]
	};
	return normalized;
}
function normalizeFlexContainerActions(value) {
	if (!isRecord(value)) return value;
	if (value.type === "bubble") return normalizeFlexBubbleActions(value);
	if (value.type === "carousel" && Array.isArray(value.contents)) return {
		...value,
		contents: value.contents.map((bubble) => normalizeFlexBubbleActions(bubble))
	};
	return normalizeNestedActions(value, 40);
}
function unavailableImagemapAction(kind, reason, area) {
	return {
		type: "message",
		label: "Unavailable",
		text: `${kind} unavailable: ${reason}`,
		area
	};
}
function normalizeImagemapAction(action) {
	const label = action.label === void 0 ? void 0 : truncateLineActionText(action.label, LINE_IMAGEMAP_ACTION_LABEL_LIMIT);
	if (action.type === "uri") {
		if (truncateUtf16Safe(action.linkUri, LINE_ACTION_URI_LIMIT) !== action.linkUri) return unavailableImagemapAction("Link", "URL exceeds LINE's limit.", action.area);
		return {
			...action,
			label
		};
	}
	if (action.type === "message") {
		const text = truncateUtf16Safe(action.text, LINE_IMAGEMAP_MESSAGE_TEXT_LIMIT);
		if (text !== action.text) return unavailableImagemapAction("Action", "message text exceeds LINE's limit.", action.area);
		return {
			...action,
			label,
			text
		};
	}
	if (truncateUtf16Safe(action.clipboardText, LINE_CLIPBOARD_TEXT_LIMIT) !== action.clipboardText) return unavailableImagemapAction("Action", "clipboard text exceeds LINE's limit.", action.area);
	return {
		...action,
		label
	};
}
function normalizeImagemapVideo(video) {
	const externalLink = video.externalLink;
	if (!externalLink) return { video };
	const label = externalLink.label === void 0 ? void 0 : truncateUtf16Safe(externalLink.label, LINE_IMAGEMAP_EXTERNAL_LINK_LABEL_LIMIT) || (externalLink.label ? "…" : "");
	if (externalLink.linkUri !== void 0 && truncateUtf16Safe(externalLink.linkUri, LINE_ACTION_URI_LIMIT) !== externalLink.linkUri) {
		const normalizedVideo = { ...video };
		delete normalizedVideo.externalLink;
		return {
			video: normalizedVideo,
			fallbackAction: video.area === void 0 ? void 0 : unavailableImagemapAction("Link", "URL exceeds LINE's limit.", video.area)
		};
	}
	return { video: {
		...video,
		externalLink: {
			...externalLink,
			label
		}
	} };
}
function normalizeLineMessageActions(message) {
	let normalized;
	if (message.type === "flex") normalized = {
		...message,
		contents: normalizeFlexContainerActions(message.contents)
	};
	else if (message.type === "template") {
		const labelLimit = message.template.type === "image_carousel" ? 12 : 20;
		normalized = {
			...message,
			template: normalizeNestedActions(message.template, labelLimit)
		};
	} else if (message.type === "imagemap") {
		const actions = message.actions.map(normalizeImagemapAction);
		const videoResult = message.video ? normalizeImagemapVideo(message.video) : void 0;
		if (videoResult?.fallbackAction) {
			if (actions.length < LINE_IMAGEMAP_ACTION_LIMIT) actions.push(videoResult.fallbackAction);
		}
		normalized = {
			...message,
			actions,
			video: videoResult?.video
		};
	} else normalized = { ...message };
	if (message.quickReply) normalized = {
		...normalized,
		quickReply: normalizeNestedActions(message.quickReply, 20)
	};
	return normalized;
}
function normalizeLineAction(action, labelLimit = LINE_ACTION_LABEL_LIMIT) {
	if (isUnavailableAction(action)) return action;
	const label = action.label === void 0 ? void 0 : truncateLineActionLabel(action.label, labelLimit);
	if (action.type === "uri") {
		const uriTooLong = action.uri !== void 0 && truncateUtf16Safe(action.uri, LINE_ACTION_URI_LIMIT) !== action.uri;
		const desktopUri = action.altUri?.desktop;
		const desktopUriTooLong = desktopUri !== void 0 && truncateUtf16Safe(desktopUri, LINE_ACTION_URI_LIMIT) !== desktopUri;
		if (uriTooLong || desktopUriTooLong) return unavailableAction("Link", "URL exceeds LINE's limit.");
		return {
			...action,
			label
		};
	}
	if (action.type === "postback") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		if (data !== action.data) return unavailableAction("Action", "callback data exceeds LINE's limit.");
		const text = action.text === void 0 ? void 0 : truncateLineActionText(action.text, LINE_ACTION_DATA_LIMIT);
		const fillInText = action.fillInText === void 0 ? void 0 : truncateLineActionText(action.fillInText, LINE_ACTION_DATA_LIMIT);
		if (text !== action.text || fillInText !== action.fillInText) return unavailableAction("Action", "message text exceeds LINE's limit.");
		return {
			...action,
			label,
			data,
			displayText: action.displayText === void 0 ? void 0 : truncateLineActionText(action.displayText, LINE_ACTION_DATA_LIMIT),
			text,
			fillInText
		};
	}
	if (action.type === "datetimepicker") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		if (data !== action.data) return unavailableAction("Action", "callback data exceeds LINE's limit.");
		return {
			...action,
			label,
			data
		};
	}
	if (action.type === "message") {
		const text = action.text === void 0 ? void 0 : truncateLineActionText(action.text, LINE_ACTION_DATA_LIMIT);
		if (text !== action.text) return unavailableAction("Action", "message text exceeds LINE's limit.");
		return {
			...action,
			label,
			text
		};
	}
	if (action.type === "clipboard") {
		if (truncateUtf16Safe(action.clipboardText, LINE_CLIPBOARD_TEXT_LIMIT) !== action.clipboardText) return unavailableAction("Action", "clipboard text exceeds LINE's limit.");
		return {
			...action,
			label
		};
	}
	if (action.type === "richmenuswitch") {
		const data = action.data === void 0 ? void 0 : truncateLineActionData(action.data);
		const aliasTooLong = action.richMenuAliasId !== void 0 && truncateUtf16Safe(action.richMenuAliasId, LINE_RICH_MENU_ALIAS_LIMIT) !== action.richMenuAliasId;
		if (data !== action.data || aliasTooLong) return unavailableAction("Action", "rich menu data exceeds LINE's limit.");
		return {
			...action,
			label,
			data
		};
	}
	return action.label === label ? action : {
		...action,
		label
	};
}
/**
* Create a message action (sends text when tapped)
*/
function messageAction(label, text) {
	return normalizeLineAction({
		type: "message",
		label,
		text: text ?? label
	});
}
/**
* Create a URI action (opens a URL when tapped)
*/
function uriAction(label, uri) {
	return normalizeLineAction({
		type: "uri",
		label,
		uri
	});
}
/**
* Create a postback action (sends data to webhook when tapped)
*/
function postbackAction(label, data, displayText) {
	return normalizeLineAction({
		type: "postback",
		label,
		data,
		displayText
	});
}
/**
* Create a datetime picker action
*/
function datetimePickerAction(label, data, mode, options) {
	return normalizeLineAction({
		type: "datetimepicker",
		label,
		data,
		mode,
		initial: options?.initial,
		max: options?.max,
		min: options?.min
	});
}
//#endregion
//#region extensions/line/src/flex-templates/common.ts
function attachFooterText(bubble, footer) {
	bubble.footer = {
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: footer,
			size: "xs",
			color: "#AAAAAA",
			wrap: true,
			align: "center"
		}],
		paddingAll: "lg",
		backgroundColor: "#FAFAFA"
	};
}
//#endregion
//#region extensions/line/src/flex-templates/basic-cards.ts
/**
* Create an info card with title, body, and optional footer
*
* Editorial design: Clean hierarchy with accent bar, generous spacing,
* and subtle background zones for visual separation.
*/
function createInfoCard(title, body, footer) {
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "box",
				layout: "horizontal",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "4px",
					backgroundColor: "#06C755",
					cornerRadius: "2px"
				}, {
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true,
					flex: 1,
					margin: "lg"
				}]
			}, {
				type: "box",
				layout: "vertical",
				contents: [{
					type: "text",
					text: body,
					size: "md",
					color: "#444444",
					wrap: true,
					lineSpacing: "6px"
				}],
				margin: "xl",
				paddingAll: "lg",
				backgroundColor: "#F8F9FA",
				cornerRadius: "lg"
			}],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (footer) attachFooterText(bubble, footer);
	return bubble;
}
/**
* Create a list card with title and multiple items
*
* Editorial design: Numbered/bulleted list with clear visual hierarchy,
* accent dots for each item, and generous spacing.
*/
function createListCard(title, items) {
	const itemContents = items.slice(0, 8).map((item, index) => {
		const itemContentsLocal = [{
			type: "text",
			text: item.title,
			size: "md",
			weight: "bold",
			color: "#1a1a1a",
			wrap: true
		}];
		if (item.subtitle) itemContentsLocal.push({
			type: "text",
			text: item.subtitle,
			size: "sm",
			color: "#888888",
			wrap: true,
			margin: "xs"
		});
		const itemBox = {
			type: "box",
			layout: "horizontal",
			contents: [{
				type: "box",
				layout: "vertical",
				contents: [{
					type: "box",
					layout: "vertical",
					contents: [],
					width: "8px",
					height: "8px",
					backgroundColor: index === 0 ? "#06C755" : "#DDDDDD",
					cornerRadius: "4px"
				}],
				width: "20px",
				alignItems: "center",
				paddingTop: "sm"
			}, {
				type: "box",
				layout: "vertical",
				contents: itemContentsLocal,
				flex: 1
			}],
			margin: index > 0 ? "lg" : void 0
		};
		if (item.action) itemBox.action = normalizeLineAction(item.action, 40);
		return itemBox;
	});
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "text",
					text: title,
					weight: "bold",
					size: "xl",
					color: "#111111",
					wrap: true
				},
				{
					type: "separator",
					margin: "lg",
					color: "#EEEEEE"
				},
				{
					type: "box",
					layout: "vertical",
					contents: itemContents,
					margin: "lg"
				}
			],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
}
/**
* Create an image card with image, title, and optional body text
*/
function createImageCard(imageUrl, title, body, options) {
	const bubble = {
		type: "bubble",
		hero: {
			type: "image",
			url: imageUrl,
			size: "full",
			aspectRatio: options?.aspectRatio ?? "20:13",
			aspectMode: options?.aspectMode ?? "cover",
			action: options?.action === void 0 ? void 0 : normalizeLineAction(options.action, 40)
		},
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}],
			paddingAll: "lg"
		}
	};
	if (body && bubble.body) bubble.body.contents.push({
		type: "text",
		text: body,
		size: "md",
		wrap: true,
		margin: "md",
		color: "#666666"
	});
	return bubble;
}
/**
* Create an action card with title, body, and action buttons
*/
function createActionCard(title, body, actions, options) {
	const bubble = {
		type: "bubble",
		body: {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				weight: "bold",
				size: "xl",
				wrap: true
			}, {
				type: "text",
				text: body,
				size: "md",
				wrap: true,
				margin: "md",
				color: "#666666"
			}],
			paddingAll: "lg"
		},
		footer: {
			type: "box",
			layout: "vertical",
			contents: actions.slice(0, 4).map((action, index) => ({
				type: "button",
				action: normalizeLineAction(action.action, 40),
				style: index === 0 ? "primary" : "secondary",
				margin: index > 0 ? "sm" : void 0
			})),
			paddingAll: "md"
		}
	};
	if (options?.imageUrl) bubble.hero = {
		type: "image",
		url: options.imageUrl,
		size: "full",
		aspectRatio: options.aspectRatio ?? "20:13",
		aspectMode: "cover"
	};
	return bubble;
}
//#endregion
//#region extensions/line/src/flex-templates/schedule-cards.ts
function buildTitleSubtitleHeader(params) {
	const { title, subtitle } = params;
	const headerContents = [{
		type: "text",
		text: title,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (subtitle) headerContents.push({
		type: "text",
		text: subtitle,
		size: "sm",
		color: "#888888",
		margin: "sm",
		wrap: true
	});
	return headerContents;
}
function buildCardHeaderSections(headerContents) {
	return [{
		type: "box",
		layout: "vertical",
		contents: headerContents,
		paddingBottom: "lg"
	}, {
		type: "separator",
		color: "#EEEEEE"
	}];
}
function createMegaBubbleWithFooter(params) {
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: params.bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (params.footer) attachFooterText(bubble, params.footer);
	return bubble;
}
/**
* Create a receipt/summary card (for orders, transactions, data tables)
*
* Editorial design: Clean table layout with alternating row backgrounds,
* prominent total section, and clear visual hierarchy.
*/
function createReceiptCard(params) {
	const { title, subtitle, items, total, footer } = params;
	const itemRows = items.slice(0, 12).map((item, index) => ({
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "text",
			text: item.name,
			size: "sm",
			color: item.highlight ? "#111111" : "#666666",
			weight: item.highlight ? "bold" : "regular",
			flex: 3,
			wrap: true
		}, {
			type: "text",
			text: item.value,
			size: "sm",
			color: item.highlight ? "#06C755" : "#333333",
			weight: item.highlight ? "bold" : "regular",
			flex: 2,
			align: "end",
			wrap: true
		}],
		paddingAll: "md",
		backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA"
	}));
	const bodyContents = [...buildCardHeaderSections(buildTitleSubtitleHeader({
		title,
		subtitle
	})), {
		type: "box",
		layout: "vertical",
		contents: itemRows,
		margin: "md",
		cornerRadius: "md",
		borderWidth: "light",
		borderColor: "#EEEEEE"
	}];
	if (total) bodyContents.push({
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "text",
			text: total.label,
			size: "lg",
			weight: "bold",
			color: "#111111",
			flex: 2
		}, {
			type: "text",
			text: total.value,
			size: "xl",
			weight: "bold",
			color: "#06C755",
			flex: 2,
			align: "end"
		}],
		margin: "xl",
		paddingAll: "lg",
		backgroundColor: "#F0FDF4",
		cornerRadius: "lg"
	});
	return createMegaBubbleWithFooter({
		bodyContents,
		footer
	});
}
/**
* Create a calendar event card (for meetings, appointments, reminders)
*
* Editorial design: Date as hero, strong typographic hierarchy,
* color-blocked zones, full text wrapping for readability.
*/
function createEventCard(params) {
	const { title, date, time, location, description, calendar, isAllDay, action } = params;
	const dateBlock = {
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: date.toUpperCase(),
			size: "sm",
			weight: "bold",
			color: "#06C755",
			wrap: true
		}, {
			type: "text",
			text: isAllDay ? "ALL DAY" : time ?? "",
			size: "xxl",
			weight: "bold",
			color: "#111111",
			wrap: true,
			margin: "xs"
		}],
		paddingBottom: "lg",
		borderWidth: "none"
	};
	if (!time && !isAllDay) dateBlock.contents = [{
		type: "text",
		text: date,
		size: "xl",
		weight: "bold",
		color: "#111111",
		wrap: true
	}];
	const bodyContents = [dateBlock, {
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "box",
			layout: "vertical",
			contents: [],
			width: "4px",
			backgroundColor: "#06C755",
			cornerRadius: "2px"
		}, {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: title,
				size: "lg",
				weight: "bold",
				color: "#1a1a1a",
				wrap: true
			}, ...calendar ? [{
				type: "text",
				text: calendar,
				size: "xs",
				color: "#888888",
				margin: "sm",
				wrap: true
			}] : []],
			flex: 1,
			paddingStart: "lg"
		}],
		paddingTop: "lg",
		paddingBottom: "lg",
		borderWidth: "light",
		borderColor: "#EEEEEE"
	}];
	if (location || description) {
		const detailItems = [];
		if (location) detailItems.push({
			type: "box",
			layout: "horizontal",
			contents: [{
				type: "text",
				text: "📍",
				size: "sm",
				flex: 0
			}, {
				type: "text",
				text: location,
				size: "sm",
				color: "#444444",
				margin: "md",
				flex: 1,
				wrap: true
			}],
			alignItems: "flex-start"
		});
		if (description) detailItems.push({
			type: "text",
			text: description,
			size: "sm",
			color: "#666666",
			wrap: true,
			margin: location ? "lg" : "none"
		});
		bodyContents.push({
			type: "box",
			layout: "vertical",
			contents: detailItems,
			margin: "lg",
			paddingAll: "lg",
			backgroundColor: "#F8F9FA",
			cornerRadius: "lg"
		});
	}
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF",
			action: action === void 0 ? void 0 : normalizeLineAction(action, 40)
		}
	};
}
/**
* Create a calendar agenda card showing multiple events
*
* Editorial timeline design: Time-focused left column with event details
* on the right. Visual accent bars indicate event priority/recency.
*/
function createAgendaCard(params) {
	const { title, subtitle, events, footer } = params;
	const headerContents = buildTitleSubtitleHeader({
		title,
		subtitle
	});
	const eventItems = events.slice(0, 6).map((event, index) => {
		const isActive = event.isNow || index === 0;
		const accentColor = isActive ? "#06C755" : "#E5E5E5";
		const timeColumn = {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "text",
				text: event.time ?? "—",
				size: "sm",
				weight: isActive ? "bold" : "regular",
				color: isActive ? "#06C755" : "#666666",
				align: "end",
				wrap: true
			}],
			width: "65px",
			justifyContent: "flex-start"
		};
		const dotColumn = {
			type: "box",
			layout: "vertical",
			contents: [{
				type: "box",
				layout: "vertical",
				contents: [],
				width: "10px",
				height: "10px",
				backgroundColor: accentColor,
				cornerRadius: "5px"
			}],
			width: "24px",
			alignItems: "center",
			justifyContent: "flex-start",
			paddingTop: "xs"
		};
		const detailContents = [{
			type: "text",
			text: event.title,
			size: "md",
			weight: "bold",
			color: "#1a1a1a",
			wrap: true
		}];
		const secondaryParts = [];
		if (event.location) secondaryParts.push(event.location);
		if (event.calendar) secondaryParts.push(event.calendar);
		if (secondaryParts.length > 0) detailContents.push({
			type: "text",
			text: secondaryParts.join(" · "),
			size: "xs",
			color: "#888888",
			wrap: true,
			margin: "xs"
		});
		return {
			type: "box",
			layout: "horizontal",
			contents: [
				timeColumn,
				dotColumn,
				{
					type: "box",
					layout: "vertical",
					contents: detailContents,
					flex: 1
				}
			],
			margin: index > 0 ? "xl" : void 0,
			alignItems: "flex-start"
		};
	});
	return createMegaBubbleWithFooter({
		bodyContents: [...buildCardHeaderSections(headerContents), {
			type: "box",
			layout: "vertical",
			contents: eventItems,
			paddingTop: "xl"
		}],
		footer
	});
}
//#endregion
//#region extensions/line/src/flex-templates/media-control-cards.ts
/**
* Create a media player card for Sonos, Spotify, Apple Music, etc.
*
* Editorial design: Album art hero with gradient overlay for text,
* prominent now-playing indicator, refined playback controls.
*/
function createMediaPlayerCard(params) {
	const { title, subtitle, source, imageUrl, isPlaying, progress, controls, extraActions } = params;
	const trackInfo = [{
		type: "text",
		text: title,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (subtitle) trackInfo.push({
		type: "text",
		text: subtitle,
		size: "md",
		color: "#666666",
		wrap: true,
		margin: "sm"
	});
	const statusItems = [];
	if (isPlaying !== void 0) statusItems.push({
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "box",
			layout: "vertical",
			contents: [],
			width: "8px",
			height: "8px",
			backgroundColor: isPlaying ? "#06C755" : "#CCCCCC",
			cornerRadius: "4px"
		}, {
			type: "text",
			text: isPlaying ? "Now Playing" : "Paused",
			size: "xs",
			color: isPlaying ? "#06C755" : "#888888",
			weight: "bold",
			margin: "sm"
		}],
		alignItems: "center"
	});
	if (source) statusItems.push({
		type: "text",
		text: source,
		size: "xs",
		color: "#AAAAAA",
		margin: statusItems.length > 0 ? "lg" : void 0
	});
	if (progress) statusItems.push({
		type: "text",
		text: progress,
		size: "xs",
		color: "#888888",
		align: "end",
		flex: 1
	});
	const bodyContents = [{
		type: "box",
		layout: "vertical",
		contents: trackInfo
	}];
	if (statusItems.length > 0) bodyContents.push({
		type: "box",
		layout: "horizontal",
		contents: statusItems,
		margin: "lg",
		alignItems: "center"
	});
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: bodyContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (imageUrl) bubble.hero = {
		type: "image",
		url: imageUrl,
		size: "full",
		aspectRatio: "1:1",
		aspectMode: "cover"
	};
	if (controls || extraActions?.length) {
		const footerContents = [];
		if (controls) {
			const controlButtons = [];
			if (controls.previous) controlButtons.push({
				type: "button",
				action: postbackAction("⏮", controls.previous.data),
				style: "secondary",
				flex: 1,
				height: "sm"
			});
			if (controls.play) controlButtons.push({
				type: "button",
				action: postbackAction("▶", controls.play.data),
				style: isPlaying ? "secondary" : "primary",
				flex: 1,
				height: "sm",
				margin: controls.previous ? "md" : void 0
			});
			if (controls.pause) controlButtons.push({
				type: "button",
				action: postbackAction("⏸", controls.pause.data),
				style: isPlaying ? "primary" : "secondary",
				flex: 1,
				height: "sm",
				margin: controlButtons.length > 0 ? "md" : void 0
			});
			if (controls.next) controlButtons.push({
				type: "button",
				action: postbackAction("⏭", controls.next.data),
				style: "secondary",
				flex: 1,
				height: "sm",
				margin: controlButtons.length > 0 ? "md" : void 0
			});
			if (controlButtons.length > 0) footerContents.push({
				type: "box",
				layout: "horizontal",
				contents: controlButtons
			});
		}
		if (extraActions?.length) footerContents.push({
			type: "box",
			layout: "horizontal",
			contents: extraActions.slice(0, 2).map((action, index) => ({
				type: "button",
				action: postbackAction(truncateLineActionLabel(action.label, 15), action.data),
				style: "secondary",
				flex: 1,
				height: "sm",
				margin: index > 0 ? "md" : void 0
			})),
			margin: "md"
		});
		if (footerContents.length > 0) bubble.footer = {
			type: "box",
			layout: "vertical",
			contents: footerContents,
			paddingAll: "lg",
			backgroundColor: "#FAFAFA"
		};
	}
	return bubble;
}
/**
* Create an Apple TV remote card with a D-pad and control rows.
*/
function createAppleTvRemoteCard(params) {
	const { deviceName, status, actionData } = params;
	const headerContents = [{
		type: "text",
		text: deviceName,
		weight: "bold",
		size: "xl",
		color: "#111111",
		wrap: true
	}];
	if (status) headerContents.push({
		type: "text",
		text: status,
		size: "sm",
		color: "#666666",
		wrap: true,
		margin: "sm"
	});
	const makeButton = (label, data, style = "secondary") => ({
		type: "button",
		action: postbackAction(label, data),
		style,
		height: "sm",
		flex: 1
	});
	const dpadRows = [
		{
			type: "box",
			layout: "horizontal",
			contents: [
				{ type: "filler" },
				makeButton("↑", actionData.up),
				{ type: "filler" }
			]
		},
		{
			type: "box",
			layout: "horizontal",
			contents: [
				makeButton("←", actionData.left),
				makeButton("OK", actionData.select, "primary"),
				makeButton("→", actionData.right)
			],
			margin: "md"
		},
		{
			type: "box",
			layout: "horizontal",
			contents: [
				{ type: "filler" },
				makeButton("↓", actionData.down),
				{ type: "filler" }
			],
			margin: "md"
		}
	];
	const menuRow = {
		type: "box",
		layout: "horizontal",
		contents: [makeButton("Menu", actionData.menu), makeButton("Home", actionData.home)],
		margin: "lg"
	};
	const playbackRow = {
		type: "box",
		layout: "horizontal",
		contents: [makeButton("Play", actionData.play), makeButton("Pause", actionData.pause)],
		margin: "md"
	};
	const volumeRow = {
		type: "box",
		layout: "horizontal",
		contents: [
			makeButton("Vol +", actionData.volumeUp),
			makeButton("Mute", actionData.mute),
			makeButton("Vol -", actionData.volumeDown)
		],
		margin: "md"
	};
	return {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: [
				{
					type: "box",
					layout: "vertical",
					contents: headerContents
				},
				{
					type: "separator",
					margin: "lg",
					color: "#EEEEEE"
				},
				...dpadRows,
				menuRow,
				playbackRow,
				volumeRow
			],
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
}
/**
* Create a device control card for Apple TV, smart home devices, etc.
*
* Editorial design: Device-focused header with status indicator,
* clean control grid with clear visual hierarchy.
*/
function createDeviceControlCard(params) {
	const { deviceName, deviceType, status, isOnline, imageUrl, controls } = params;
	const headerContents = [{
		type: "box",
		layout: "horizontal",
		contents: [{
			type: "box",
			layout: "vertical",
			contents: [],
			width: "10px",
			height: "10px",
			backgroundColor: isOnline !== false ? "#06C755" : "#FF5555",
			cornerRadius: "5px"
		}, {
			type: "text",
			text: deviceName,
			weight: "bold",
			size: "xl",
			color: "#111111",
			wrap: true,
			flex: 1,
			margin: "md"
		}],
		alignItems: "center"
	}];
	if (deviceType) headerContents.push({
		type: "text",
		text: deviceType,
		size: "sm",
		color: "#888888",
		margin: "sm"
	});
	if (status) headerContents.push({
		type: "box",
		layout: "vertical",
		contents: [{
			type: "text",
			text: status,
			size: "sm",
			color: "#444444",
			wrap: true
		}],
		margin: "lg",
		paddingAll: "md",
		backgroundColor: "#F8F9FA",
		cornerRadius: "md"
	});
	const bubble = {
		type: "bubble",
		size: "mega",
		body: {
			type: "box",
			layout: "vertical",
			contents: headerContents,
			paddingAll: "xl",
			backgroundColor: "#FFFFFF"
		}
	};
	if (imageUrl) bubble.hero = {
		type: "image",
		url: imageUrl,
		size: "full",
		aspectRatio: "16:9",
		aspectMode: "cover"
	};
	if (controls.length > 0) {
		const rows = [];
		const limitedControls = controls.slice(0, 6);
		for (let i = 0; i < limitedControls.length; i += 2) {
			const rowButtons = [];
			for (const [offset, ctrl] of limitedControls.slice(i, i + 2).entries()) {
				const buttonLabel = ctrl.icon ? `${ctrl.icon} ${ctrl.label}` : ctrl.label;
				rowButtons.push({
					type: "button",
					action: postbackAction(truncateLineActionLabel(buttonLabel, 18), ctrl.data),
					style: ctrl.style ?? "secondary",
					flex: 1,
					height: "sm",
					margin: offset > 0 ? "md" : void 0
				});
			}
			if (rowButtons.length === 1) rowButtons.push({ type: "filler" });
			rows.push({
				type: "box",
				layout: "horizontal",
				contents: rowButtons,
				margin: i > 0 ? "md" : void 0
			});
		}
		bubble.footer = {
			type: "box",
			layout: "vertical",
			contents: rows,
			paddingAll: "lg",
			backgroundColor: "#FAFAFA"
		};
	}
	return bubble;
}
//#endregion
export { createLineSendReceipt as _, createEventCard as a, resolveLineOutboundMedia as b, createImageCard as c, datetimePickerAction as d, messageAction as f, uriAction as g, postbackAction as h, createAgendaCard as i, createInfoCard as l, normalizeLineMessageActions as m, createDeviceControlCard as n, createReceiptCard as o, normalizeLineAction as p, createMediaPlayerCard as r, createActionCard as s, createAppleTvRemoteCard as t, createListCard as u, buildLineMediaMessage as v, validateLineMediaUrl as x, hasLineSpecificMediaOptions as y };
