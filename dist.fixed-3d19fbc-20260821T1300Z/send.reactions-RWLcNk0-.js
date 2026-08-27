import { t as requireRuntimeConfig } from "./plugin-config-runtime-CeK7PFoj.js";
import { et as createOwnMessageReaction, nt as listMessageReactionUsers, tt as deleteOwnMessageReaction, ut as getChannelMessage } from "./discord-CSDU62IF.js";
import { i as formatReactionEmoji, r as buildReactionIdentifier, s as normalizeReactionEmoji } from "./send.shared-Derjkebj.js";
import { u as createDiscordClient } from "./send.permissions-Cx7SL08g.js";
//#region extensions/discord/src/send.reactions.ts
function createDiscordReactionRuntimeClient(opts) {
	return createDiscordClient(opts);
}
function resolveDiscordReactionClient(opts) {
	if (!opts.cfg) throw new Error("Discord reactions requires a resolved runtime config. Load and resolve config at the command or gateway boundary, then pass cfg through the runtime path.");
	const cfg = requireRuntimeConfig(opts.cfg, "Discord reactions");
	return createDiscordClient({
		...opts,
		cfg
	});
}
function isDiscordReactionRuntimeContext(opts) {
	return Boolean(opts.rest && opts.cfg && opts.accountId);
}
async function reactMessageDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => createOwnMessageReaction(rest, channelId, messageId, encoded), "react");
	return { ok: true };
}
async function removeReactionDiscord(channelId, messageId, emoji, opts) {
	const { rest, request } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const encoded = normalizeReactionEmoji(emoji);
	await request(() => deleteOwnMessageReaction(rest, channelId, messageId, encoded), "reaction-remove");
	return { ok: true };
}
async function removeOwnReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const message = await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list");
	const identifiers = /* @__PURE__ */ new Set();
	for (const reaction of message.reactions ?? []) {
		const identifier = reaction.me ? buildReactionIdentifier(reaction.emoji) : void 0;
		if (identifier) identifiers.add(identifier);
	}
	if (identifiers.size === 0) return {
		ok: true,
		removed: []
	};
	const removed = Array.from(identifiers);
	await Promise.all(removed.map((identifier) => request(() => deleteOwnMessageReaction(rest, channelId, messageId, normalizeReactionEmoji(identifier)), "reaction-remove")));
	return {
		ok: true,
		removed
	};
}
async function fetchReactionsDiscord(channelId, messageId, opts) {
	const { rest, request } = isDiscordReactionRuntimeContext(opts) ? createDiscordReactionRuntimeClient(opts) : resolveDiscordReactionClient(opts);
	const reactions = (await request(() => getChannelMessage(rest, channelId, messageId), "reaction-list")).reactions ?? [];
	if (reactions.length === 0) return [];
	const limit = typeof opts.limit === "number" && Number.isFinite(opts.limit) ? Math.min(Math.max(Math.floor(opts.limit), 1), 100) : 100;
	const summaries = [];
	for (const reaction of reactions) {
		const identifier = buildReactionIdentifier(reaction.emoji);
		if (!identifier) continue;
		const encoded = encodeURIComponent(identifier);
		const users = await request(() => listMessageReactionUsers(rest, channelId, messageId, encoded, { limit }), "reaction-users");
		summaries.push({
			emoji: {
				id: reaction.emoji.id ?? null,
				name: reaction.emoji.name ?? null,
				raw: formatReactionEmoji(reaction.emoji)
			},
			count: reaction.count,
			users: users.map((user) => ({
				id: user.id,
				username: user.username,
				tag: user.username && user.discriminator ? `${user.username}#${user.discriminator}` : user.username
			}))
		});
	}
	return summaries;
}
//#endregion
export { removeReactionDiscord as i, reactMessageDiscord as n, removeOwnReactionsDiscord as r, fetchReactionsDiscord as t };
