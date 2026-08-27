import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as resolvePinnedHostnameWithPolicy } from "./ssrf-arYIaOWE.js";
import "./channel-outbound-0oFCMpw9.js";
import { t as createMessageReceiptFromOutboundResults } from "./receipt-BzekpwQi.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./channel-secret-basic-runtime-D79B15GP.js";
import "./text-utility-runtime-BNhX-3os.js";
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
export { attachFooterText as a, normalizeLineAction as c, truncateLineActionLabel as d, uriAction as f, validateLineMediaUrl as g, resolveLineOutboundMedia as h, createReceiptCard as i, normalizeLineMessageActions as l, hasLineSpecificMediaOptions as m, createAgendaCard as n, datetimePickerAction as o, buildLineMediaMessage as p, createEventCard as r, messageAction as s, createLineSendReceipt as t, postbackAction as u };
