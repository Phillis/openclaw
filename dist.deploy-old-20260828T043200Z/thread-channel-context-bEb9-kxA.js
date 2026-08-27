import { a as normalizeDiscordSlug } from "./allow-list-CtAHaFe6.js";
import { t as isDiscordThreadChannelType } from "./channel-type-CADjTAMq.js";
import { i as resolveDiscordChannelParentIdSafe, n as resolveDiscordChannelInfoSafe, t as resolveDiscordChannelIdSafe } from "./channel-access-C12aDZ0p.js";
import { f as resolveDiscordChannelInfo } from "./message-text-C59I9a20.js";
import { s as resolveDiscordThreadParentInfo } from "./threading-DAlSakHF.js";
//#region extensions/discord/src/monitor/thread-channel-context.ts
function buildFetchedChannelInfo(channel) {
	const channelInfo = resolveDiscordChannelInfoSafe(channel);
	if (channelInfo.type === void 0) return null;
	return {
		type: channelInfo.type,
		name: channelInfo.name,
		topic: channelInfo.topic,
		parentId: channelInfo.parentId,
		ownerId: channelInfo.ownerId
	};
}
async function resolveDiscordThreadLikeChannelContext(params) {
	const safeChannelInfo = resolveDiscordChannelInfoSafe(params.channel);
	const channelId = resolveDiscordChannelIdSafe(params.channel) ?? params.channelIdFallback ?? "";
	const channelInfo = params.channelInfo !== void 0 ? params.channelInfo : channelId ? await resolveDiscordChannelInfo(params.client, channelId) : null;
	const channelType = safeChannelInfo.type ?? channelInfo?.type;
	const channelName = safeChannelInfo.name ?? channelInfo?.name;
	const channelSlug = channelName ? normalizeDiscordSlug(channelName) : "";
	const parentId = resolveDiscordChannelParentIdSafe(params.channel) ?? channelInfo?.parentId;
	const isThreadChannel = isDiscordThreadChannelType(channelType);
	let threadParentId;
	let threadParentName;
	let threadParentSlug = "";
	if (channelId && isThreadChannel) {
		const parentInfo = await resolveDiscordThreadParentInfo({
			client: params.client,
			threadChannel: {
				id: channelId,
				name: channelName,
				parentId,
				parent: void 0
			},
			channelInfo
		});
		threadParentId = parentInfo.id;
		threadParentName = parentInfo.name;
		threadParentSlug = threadParentName ? normalizeDiscordSlug(threadParentName) : "";
	}
	return {
		channelType,
		isThreadChannel,
		channelId,
		channelName,
		channelSlug,
		parentId,
		threadParentId,
		threadParentName,
		threadParentSlug,
		channelInfo
	};
}
async function resolveFetchedDiscordThreadLikeChannelContext(params) {
	return await resolveDiscordThreadLikeChannelContext({
		...params,
		channelInfo: buildFetchedChannelInfo(params.channel)
	});
}
//#endregion
export { resolveFetchedDiscordThreadLikeChannelContext as n, resolveDiscordThreadLikeChannelContext as t };
