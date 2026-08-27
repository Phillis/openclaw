import { c as resolveInboundSupplementalSenderAllowed } from "./run-channel-turn-CMWbyBYF.js";
import "./channel-inbound-Db8kr_sV.js";
import { g as resolveDiscordOwnerAllowFrom, m as resolveDiscordMemberAllowed } from "./allow-list-CtAHaFe6.js";
//#region extensions/discord/src/monitor/inbound-context.ts
function createDiscordSupplementalContextAccessChecker(params) {
	const userAllowList = params.channelConfig?.users ?? params.guildInfo?.users ?? [];
	const roleAllowList = params.channelConfig?.roles ?? params.guildInfo?.roles ?? [];
	const allowFrom = [...userAllowList, ...roleAllowList];
	return (sender) => {
		return resolveInboundSupplementalSenderAllowed({
			isGroup: params.isGuild,
			groupPolicy: allowFrom.length === 0 ? "open" : "allowlist",
			allowFrom,
			isSenderAllowed: () => resolveDiscordMemberAllowed({
				userAllowList,
				roleAllowList,
				memberRoleIds: [...sender.memberRoleIds ?? []],
				userId: sender.id ?? "",
				userName: sender.name,
				userTag: sender.tag,
				allowNameMatching: params.allowNameMatching
			})
		});
	};
}
function buildDiscordGroupSystemPrompt(channelConfig) {
	const systemPromptParts = [channelConfig?.systemPrompt?.trim() || null].filter((entry) => Boolean(entry));
	return systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : void 0;
}
function buildDiscordChannelStructuredContext(params) {
	if (!params.isGuild) return;
	const entries = [];
	if (typeof params.channelTopic === "string" && params.channelTopic.trim().length > 0) entries.push({
		label: "Discord channel metadata",
		source: "discord",
		type: "channel_metadata",
		payload: { topic: params.channelTopic.trim() }
	});
	return entries.length > 0 ? entries : void 0;
}
function buildDiscordInboundAccessContext(params) {
	return {
		groupSystemPrompt: params.isGuild ? buildDiscordGroupSystemPrompt(params.channelConfig) : void 0,
		channelStructuredContext: buildDiscordChannelStructuredContext({
			isGuild: params.isGuild,
			channelTopic: params.channelTopic
		}),
		ownerAllowFrom: resolveDiscordOwnerAllowFrom({
			channelConfig: params.channelConfig,
			guildInfo: params.guildInfo,
			sender: params.sender,
			allowNameMatching: params.allowNameMatching
		})
	};
}
//#endregion
export { buildDiscordInboundAccessContext as n, createDiscordSupplementalContextAccessChecker as r, buildDiscordGroupSystemPrompt as t };
