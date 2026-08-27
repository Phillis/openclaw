import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import { t as normalizeDiscordToken } from "./token-EtaQNTej.js";
import { c as resolveDiscordAccount } from "./accounts-Ce_-CVy_.js";
import { n as rememberDiscordDirectoryUser } from "./directory-cache-De14QDHu.js";
import { r as fetchDiscord, t as DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS } from "./api-BgHsrl1Z.js";
import { a as normalizeDiscordSlug } from "./allow-list-CtAHaFe6.js";
//#region extensions/discord/src/directory-live.ts
function normalizeQuery(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
function buildUserRank(user) {
	return user.bot ? 0 : 1;
}
function resolveDiscordDirectoryAccess(params) {
	const account = resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	});
	const token = normalizeDiscordToken(account.token, "channels.discord.token");
	if (!token) return null;
	return {
		token,
		query: normalizeQuery(params.query),
		accountId: account.accountId
	};
}
async function listDiscordGuilds(token) {
	return (await fetchDiscord("/users/@me/guilds", token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS })).filter((guild) => guild.id && guild.name);
}
async function listDiscordDirectoryGroupsLive(params) {
	const access = resolveDiscordDirectoryAccess(params);
	if (!access) return [];
	const { token, query } = access;
	const guilds = await listDiscordGuilds(token);
	const rows = [];
	for (const guild of guilds) {
		const channels = await fetchDiscord(`/guilds/${guild.id}/channels`, token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
		for (const channel of channels) {
			const name = channel.name?.trim();
			if (!name) continue;
			if (query && !normalizeDiscordSlug(name).includes(normalizeDiscordSlug(query))) continue;
			rows.push({
				kind: "group",
				id: `channel:${channel.id}`,
				name,
				handle: `#${name}`,
				raw: channel
			});
			if (typeof params.limit === "number" && params.limit > 0 && rows.length >= params.limit) return rows;
		}
	}
	return rows;
}
async function listDiscordDirectoryPeersLive(params) {
	const access = resolveDiscordDirectoryAccess(params);
	if (!access) return [];
	const { token, query, accountId } = access;
	if (!query) return [];
	const guilds = await listDiscordGuilds(token);
	const rows = [];
	const seenUserIds = /* @__PURE__ */ new Set();
	const limit = typeof params.limit === "number" && params.limit > 0 ? params.limit : 25;
	for (const guild of guilds) {
		const paramsObj = new URLSearchParams({
			query,
			limit: String(Math.min(limit, 100))
		});
		const members = await fetchDiscord(`/guilds/${guild.id}/members/search?${paramsObj.toString()}`, token, fetch, { timeoutMs: DISCORD_DIRECTORY_LOOKUP_TIMEOUT_MS });
		for (const member of members) {
			const user = member.user;
			if (!user?.id) continue;
			rememberDiscordDirectoryUser({
				accountId,
				userId: user.id,
				handles: [
					user.username,
					user.global_name,
					member.nick,
					user.username ? `@${user.username}` : null
				]
			});
			if (seenUserIds.has(user.id)) continue;
			seenUserIds.add(user.id);
			const name = member.nick?.trim() || user.global_name?.trim() || user.username?.trim();
			rows.push({
				kind: "user",
				id: `user:${user.id}`,
				name: name || void 0,
				handle: user.username ? `@${user.username}` : void 0,
				rank: buildUserRank(user),
				raw: member
			});
			if (rows.length >= limit) return rows;
		}
	}
	return rows;
}
//#endregion
export { listDiscordDirectoryPeersLive as n, listDiscordDirectoryGroupsLive as t };
