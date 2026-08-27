import { n as asNullableObjectRecord, r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { f as buildPollResultsSummary, g as isPollStartType, h as isPollEventType, m as formatPollResultsAsText, p as formatPollAsText, v as parsePollStartContent, y as resolvePollReferenceEventId } from "./send-BEJQk6ia.js";
import path from "node:path";
//#region extensions/matrix/src/matrix/poll-summary.ts
function resolveMatrixPollRootEventId(event) {
	if (isPollStartType(event.type)) {
		const eventId = event.event_id?.trim();
		return eventId ? eventId : null;
	}
	return resolvePollReferenceEventId(event.content);
}
async function readAllPollRelations(client, roomId, pollEventId) {
	const relationEvents = [];
	const seenCursors = /* @__PURE__ */ new Set();
	let nextBatch;
	do {
		const page = await client.getRelations(roomId, pollEventId, "m.reference", void 0, { from: nextBatch });
		relationEvents.push(...page.events);
		nextBatch = page.nextBatch ?? void 0;
		if (nextBatch && seenCursors.has(nextBatch)) throw new Error("Matrix poll pagination returned a repeated cursor");
		if (nextBatch) seenCursors.add(nextBatch);
	} while (nextBatch);
	return relationEvents;
}
async function fetchMatrixPollSnapshot(client, roomId, event) {
	if (!isPollEventType(event.type)) return null;
	const pollEventId = resolveMatrixPollRootEventId(event);
	if (!pollEventId) return null;
	const rootEvent = isPollStartType(event.type) ? event : await client.getEvent(roomId, pollEventId);
	if (!isPollStartType(rootEvent.type)) return null;
	const pollStartContent = rootEvent.content;
	const pollSummary = parsePollStartContent(pollStartContent);
	if (!pollSummary) return null;
	const relationEvents = await readAllPollRelations(client, roomId, pollEventId);
	const pollResults = buildPollResultsSummary({
		pollEventId,
		roomId,
		sender: rootEvent.sender,
		senderName: rootEvent.sender,
		content: pollStartContent,
		relationEvents
	});
	return {
		pollEventId,
		triggerEvent: event,
		rootEvent,
		text: pollResults ? formatPollResultsAsText(pollResults) : formatPollAsText(pollSummary)
	};
}
async function fetchMatrixPollMessageSummary(client, roomId, event) {
	const snapshot = await fetchMatrixPollSnapshot(client, roomId, event);
	if (!snapshot) return null;
	return {
		eventId: snapshot.pollEventId,
		sender: snapshot.rootEvent.sender,
		body: snapshot.text,
		msgtype: "m.text",
		timestamp: snapshot.triggerEvent.origin_server_ts || snapshot.rootEvent.origin_server_ts
	};
}
//#endregion
//#region extensions/matrix/src/matrix/media-text.ts
const MATRIX_MEDIA_KINDS = {
	"m.audio": "audio",
	"m.file": "file",
	"m.image": "image",
	"m.sticker": "sticker",
	"m.video": "video"
};
function resolveMatrixMediaKind(msgtype) {
	return MATRIX_MEDIA_KINDS[msgtype ?? ""] ?? null;
}
function resolveMatrixMediaLabel(kind, fallback = "media") {
	return `${kind ?? fallback} attachment`;
}
function formatMatrixAttachmentMarker(params) {
	const label = resolveMatrixMediaLabel(params.kind);
	if (params.tooLarge) return `[matrix ${label} too large]`;
	return params.unavailable ? `[matrix ${label} unavailable]` : `[matrix ${label}]`;
}
function isLikelyBareFilename(text) {
	const trimmed = text.trim();
	if (!trimmed || trimmed.includes("\n") || /\s/.test(trimmed)) return false;
	if (path.basename(trimmed) !== trimmed) return false;
	return path.extname(trimmed).length > 1;
}
function resolveCaptionOrFilename(params) {
	const body = params.body?.trim() ?? "";
	const filename = params.filename?.trim() ?? "";
	if (filename) {
		if (!body || body === filename) return { filename };
		return {
			caption: body,
			filename
		};
	}
	if (!body) return {};
	if (isLikelyBareFilename(body)) return { filename: body };
	return { caption: body };
}
function resolveBundledMatrixReplacementContent(event) {
	const replacement = asNullableObjectRecord(event.unsigned?.["m.relations"]?.["m.replace"]);
	if (!replacement || event.state_key !== void 0) return;
	const content = asNullableObjectRecord(replacement.content);
	const relation = asNullableObjectRecord(content?.["m.relates_to"]);
	const newContent = content?.["m.new_content"];
	if (replacement.sender !== event.sender || replacement.type !== event.type || replacement.state_key !== void 0 || asNullableObjectRecord(replacement.unsigned)?.redacted_because || !relation || relation.rel_type !== "m.replace" || relation.event_id !== event.event_id) return;
	return asNullableRecord(newContent) ?? void 0;
}
function resolveMatrixMessageAttachment(params) {
	const kind = resolveMatrixMediaKind(params.msgtype);
	if (!kind) return;
	const resolved = resolveCaptionOrFilename(params);
	return {
		kind,
		caption: resolved.caption,
		filename: resolved.filename
	};
}
function formatMatrixAttachmentText(params) {
	if (!params.attachment) return;
	return formatMatrixAttachmentMarker({
		kind: params.attachment.kind,
		tooLarge: params.tooLarge,
		unavailable: params.unavailable
	});
}
function formatMatrixMessageText(params) {
	const attachment = resolveMatrixMessageAttachment(params);
	const body = attachment ? attachment.caption ?? "" : params.body?.trim() ?? "";
	const marker = formatMatrixAttachmentText({
		attachment,
		tooLarge: params.tooLarge,
		unavailable: params.unavailable
	});
	if (!marker) return body || void 0;
	if (!body) return marker;
	return `${body}\n\n${marker}`;
}
function formatMatrixMediaUnavailableText(params) {
	return formatMatrixMessageText({
		...params,
		unavailable: true
	}) ?? "";
}
function formatMatrixMediaTooLargeText(params) {
	return formatMatrixMessageText({
		...params,
		tooLarge: true
	}) ?? "";
}
//#endregion
export { resolveBundledMatrixReplacementContent as a, fetchMatrixPollSnapshot as c, isLikelyBareFilename as i, resolveMatrixPollRootEventId as l, formatMatrixMediaUnavailableText as n, resolveMatrixMessageAttachment as o, formatMatrixMessageText as r, fetchMatrixPollMessageSummary as s, formatMatrixMediaTooLargeText as t };
