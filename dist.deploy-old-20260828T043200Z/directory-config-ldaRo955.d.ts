import { M as ChannelDirectoryEntry } from "./channel-contract-Pji552cX.js";
import { t as DirectoryConfigParams } from "./directory-runtime-D8Mq3Oev.js";
//#region extensions/discord/src/directory-config.d.ts
declare const listDiscordDirectoryPeersFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
declare const listDiscordDirectoryGroupsFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
//#endregion
export { listDiscordDirectoryPeersFromConfig as n, listDiscordDirectoryGroupsFromConfig as t };