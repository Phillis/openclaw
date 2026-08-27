import { K as ChannelDirectoryEntry } from "./setup-wizard-types-D4fC5oCf.js";
import { t as DirectoryConfigParams } from "./directory-config-helpers-vi68bX8a.js";

//#region extensions/discord/src/directory-config.d.ts
declare const listDiscordDirectoryPeersFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
declare const listDiscordDirectoryGroupsFromConfig: (configParams: DirectoryConfigParams) => Promise<ChannelDirectoryEntry[]>;
//#endregion
export { listDiscordDirectoryPeersFromConfig as n, listDiscordDirectoryGroupsFromConfig as t };