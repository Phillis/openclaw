import { t as decodeHtmlEntities } from "./html-entities-CvDVeY8C.js";
import "./html-entity-runtime-DaPF1Tq9.js";
import { f as fetchGraphJson } from "./inbound-CrUCZmPL.js";
//#region extensions/msteams/src/graph-thread.ts
/**
* Strip HTML tags from Teams message content, preserving @mention display names.
* Teams wraps mentions in <at>Name</at> tags.
*/
function stripHtmlFromTeamsMessage(html) {
	let text = html.replace(/<at[^>]*>(.*?)<\/at>/gi, "@$1");
	text = text.replace(/<[^>]*>/g, " ");
	text = decodeHtmlEntities(text).replaceAll("\xA0", " ");
	return text.replace(/\s+/g, " ").trim();
}
/**
* Fetch a single channel message (the parent/root of a thread).
* Returns undefined on error so callers can degrade gracefully.
*/
async function fetchChannelMessage(token, groupId, channelId, messageId, deadline) {
	const path = `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}`;
	try {
		return await fetchGraphJson({
			token,
			path,
			...deadline ? { deadline } : {}
		});
	} catch {
		return;
	}
}
/**
* Fetch a single chat message's full text via Graph and return plain text.
*
* Used to recover the complete quoted message for Teams quote replies: the
* inbound blockquote only carries a Teams-truncated `preview` snippet. The
* app-only `GET /chats/{chatId}/messages/{messageId}` endpoint IS permitted
* with the `Chat.Read.All` application permission.
*
* Returns undefined on any failure so callers degrade to the truncated preview.
*/
async function fetchChatMessageText(token, chatId, messageId, deadline) {
	const path = `/chats/${encodeURIComponent(chatId)}/messages/${encodeURIComponent(messageId)}`;
	try {
		const msg = await fetchGraphJson({
			token,
			path,
			...deadline ? { deadline } : {}
		});
		const raw = msg.body?.content ?? "";
		return (msg.body?.contentType === "html" ? stripHtmlFromTeamsMessage(raw) : raw.trim()) || void 0;
	} catch {
		return;
	}
}
/**
* Fetch thread replies for a channel message, ordered chronologically.
*
* **Limitation:** The Graph API replies endpoint (`/messages/{id}/replies`) does not
* support `$orderby`, so results are always returned in ascending (oldest-first) order.
* Combined with the `$top` cap of 50, this means only the **oldest 50 replies** are
* returned for long threads — newer replies are silently omitted. There is currently no
* Graph API workaround for this; pagination via `@odata.nextLink` can retrieve more
* replies but still in ascending order only.
*/
async function fetchThreadReplies(token, groupId, channelId, messageId, limit = 50, deadline) {
	return (await fetchGraphJson({
		token,
		path: `/teams/${encodeURIComponent(groupId)}/channels/${encodeURIComponent(channelId)}/messages/${encodeURIComponent(messageId)}/replies?$top=${Math.min(Math.max(limit, 1), 50)}`,
		...deadline ? { deadline } : {}
	})).value ?? [];
}
/**
* Format thread messages into a context string for the agent.
* Skips the current message (by id) and blank messages.
*/
function formatThreadContext(messages, currentMessageId) {
	const lines = [];
	for (const msg of messages) {
		if (msg.id && msg.id === currentMessageId) continue;
		const sender = msg.from?.user?.displayName ?? msg.from?.application?.displayName ?? "unknown";
		const contentType = msg.body?.contentType ?? "text";
		const rawContent = msg.body?.content ?? "";
		const content = contentType === "html" ? stripHtmlFromTeamsMessage(rawContent) : rawContent.trim();
		if (!content) continue;
		lines.push(`${sender}: ${content}`);
	}
	return lines.join("\n");
}
//#endregion
//#region extensions/msteams/src/reaction-types.ts
const TEAMS_REACTION_EMOJI = {
	like: "👍",
	heart: "❤️",
	laugh: "😆",
	surprised: "😮",
	sad: "😢",
	angry: "😡"
};
const TEAMS_REACTION_TYPES = Object.keys(TEAMS_REACTION_EMOJI);
function getMSTeamsReactionEmoji(raw) {
	return TEAMS_REACTION_EMOJI[raw.trim().toLowerCase()];
}
function resolveMSTeamsReactionEmoji(raw) {
	const normalized = raw.trim();
	if (!normalized) throw new Error(`Reaction type is required. Common types: ${TEAMS_REACTION_TYPES.join(", ")}`);
	return getMSTeamsReactionEmoji(normalized) ?? normalized;
}
//#endregion
export { fetchThreadReplies as a, fetchChatMessageText as i, resolveMSTeamsReactionEmoji as n, formatThreadContext as o, fetchChannelMessage as r, stripHtmlFromTeamsMessage as s, getMSTeamsReactionEmoji as t };
