import { D as APIAllowedMentions, O as APIEmbed, m as Embed, p as TopLevelComponents } from "./discord-cCABK3Ro.js";
//#region extensions/discord/src/reply-reference.d.ts
type DiscordReplyReference = Readonly<{
  messageId: string;
  scope: "all" | "first";
}>;
//#endregion
//#region extensions/discord/src/send.message-request.d.ts
type DiscordSendComponentFactory = (text: string) => TopLevelComponents[];
type DiscordSendComponents = TopLevelComponents[] | DiscordSendComponentFactory;
type DiscordSendEmbeds = Array<APIEmbed | Embed>;
type DiscordAllowedMentions = APIAllowedMentions;
//#endregion
export { DiscordReplyReference as i, DiscordSendComponents as n, DiscordSendEmbeds as r, DiscordAllowedMentions as t };