import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import "./reply-payload-DBNGwex4.js";
import { a as resolveSendableOutboundReplyParts } from "./reply-payload-parts-CRXUQ13n.js";
import "./string-coerce-runtime-D9ocX9lc.js";
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
export { resolveTelegramPromptContextDeliverySignature as a, buildInlineKeyboard as c, resolveCompleteTelegramPromptContextProjectionIds as i, createTelegramPromptContextProjectionSequence as n, resolveTelegramPromptContextSource as o, parseTelegramPromptContextProjection as r, withTelegramPromptContextSource as s, createTelegramPromptContextProjectionCursor as t };
