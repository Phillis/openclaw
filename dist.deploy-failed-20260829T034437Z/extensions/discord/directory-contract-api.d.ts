import "../../runtime-api-IAhSVA75.js";
import { M as ChannelDirectoryEntry } from "../../channel-contract-Pji552cX.js";
import { t as DirectoryConfigParams } from "../../directory-runtime-D8Mq3Oev.js";
import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-ldaRo955.js";
//#region extensions/discord/directory-contract-api.d.ts
declare const discordDirectoryContractPlugin: {
  id: string;
  directory: {
    listPeers: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
    listGroups: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
  };
};
//#endregion
export { discordDirectoryContractPlugin, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig };