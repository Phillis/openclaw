import { z as PluginRuntime } from "./types-DYqBZyXL.js";
import { f as sendMessageDiscord } from "./send-BKbB_Mpy.js";
import { t as discordMessageActions } from "./channel-actions-BCrBzgXw.js";

//#region extensions/discord/src/runtime.d.ts
type DiscordChannelRuntime = {
  messageActions?: typeof discordMessageActions;
  sendMessageDiscord?: typeof sendMessageDiscord;
};
type DiscordRuntime = PluginRuntime & {
  channel: PluginRuntime["channel"] & {
    discord?: DiscordChannelRuntime;
  };
};
declare const setDiscordRuntime: (next: DiscordRuntime) => void, getOptionalDiscordRuntime: () => DiscordRuntime | null, getDiscordRuntime: () => DiscordRuntime;
//#endregion
export { setDiscordRuntime as t };