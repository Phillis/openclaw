import { i as ChannelType } from "./v10-BDbFcnZN.js";
//#region extensions/discord/src/channel-type.ts
function isDiscordThreadChannelType(channelType) {
	return channelType === ChannelType.AnnouncementThread || channelType === ChannelType.PublicThread || channelType === ChannelType.PrivateThread;
}
//#endregion
export { isDiscordThreadChannelType as t };
