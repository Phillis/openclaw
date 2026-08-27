import { n as listDiscordDirectoryPeersFromConfig, t as listDiscordDirectoryGroupsFromConfig } from "../../directory-config-BXmR7fl5.js";
//#region extensions/discord/directory-contract-api.ts
const discordDirectoryContractPlugin = {
	id: "discord",
	directory: {
		listPeers: listDiscordDirectoryPeersFromConfig,
		listGroups: listDiscordDirectoryGroupsFromConfig
	}
};
//#endregion
export { discordDirectoryContractPlugin, listDiscordDirectoryGroupsFromConfig, listDiscordDirectoryPeersFromConfig };
