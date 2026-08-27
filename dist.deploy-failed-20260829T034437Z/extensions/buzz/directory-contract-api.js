import { n as listBuzzDirectoryPeersFromConfig, t as listBuzzDirectoryGroupsFromConfig } from "../../directory-config-CAduo21Q.js";
//#region extensions/buzz/directory-contract-api.ts
const buzzDirectoryContractPlugin = {
	id: "buzz",
	directory: {
		listPeers: listBuzzDirectoryPeersFromConfig,
		listGroups: listBuzzDirectoryGroupsFromConfig
	}
};
//#endregion
export { buzzDirectoryContractPlugin, listBuzzDirectoryGroupsFromConfig, listBuzzDirectoryPeersFromConfig };
