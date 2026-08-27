import { E as User, T as Message, Wt as GatewayDispatchEvents, w as Guild } from "./discord-CSDU62IF.js";
//#region extensions/discord/src/internal/gateway-dispatch.ts
function dispatchVoiceGatewayEvent(client, type, data) {
	const guildId = readGuildId(data);
	if (!guildId) return;
	const adapter = (client.getPlugin("voice")?.adapters)?.get(guildId);
	const voiceServerUpdate = GatewayDispatchEvents.VoiceServerUpdate;
	const voiceStateUpdate = GatewayDispatchEvents.VoiceStateUpdate;
	if (type === voiceServerUpdate) adapter?.onVoiceServerUpdate?.(data);
	if (type === voiceStateUpdate) adapter?.onVoiceStateUpdate?.(data);
}
function mapGatewayDispatchData(client, type, data) {
	const messageCreate = GatewayDispatchEvents.MessageCreate;
	const reactionAdd = GatewayDispatchEvents.MessageReactionAdd;
	const reactionRemove = GatewayDispatchEvents.MessageReactionRemove;
	if (type === messageCreate) return createMessageDispatchData(client, data);
	if (type === reactionAdd || type === reactionRemove) return createReactionDispatchData(client, data);
	return data;
}
function createMessageDispatchData(client, data) {
	const message = new Message(client, data);
	return {
		...data,
		id: data.id,
		channel_id: data.channel_id,
		channelId: data.channel_id,
		message,
		author: message.author ?? (data.author ? new User(client, data.author) : null),
		member: data.member,
		rawMember: data.member,
		guild: data.guild_id ? new Guild(client, data.guild_id) : null
	};
}
function createReactionDispatchData(client, data) {
	const userRaw = data.member?.user && typeof data.member.user === "object" ? {
		id: data.user_id,
		username: "",
		...data.member.user
	} : {
		id: data.user_id,
		username: ""
	};
	return {
		...data,
		user: new User(client, userRaw),
		rawMember: data.member,
		guild: data.guild_id ? new Guild(client, data.guild_id) : null,
		message: new Message(client, {
			id: data.message_id,
			channelId: data.channel_id
		})
	};
}
function readGuildId(data) {
	return data && typeof data === "object" && typeof data.guild_id === "string" ? data.guild_id : void 0;
}
//#endregion
export { mapGatewayDispatchData as n, dispatchVoiceGatewayEvent as t };
