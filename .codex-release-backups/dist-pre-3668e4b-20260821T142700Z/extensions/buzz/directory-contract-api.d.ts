import { n as OpenClawConfig } from "../../types.openclaw-CTCn19OD.js";
import { z as ChannelDirectoryEntry } from "../../types.public-Ca4rxCP0.js";

//#region src/channels/plugins/directory-types.d.ts
/**
 * Shared input for channel directory lookups.
 *
 * Directory-capable plugins receive the active config plus optional account
 * scope, search text, and result limit from setup or command surfaces.
 */
type DirectoryConfigParams = {
  cfg: OpenClawConfig;
  accountId?: string | null;
  query?: string | null;
  limit?: number | null;
};
//#endregion
//#region extensions/buzz/src/directory-config.d.ts
declare function listBuzzDirectoryPeersFromConfig(_params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
declare function listBuzzDirectoryGroupsFromConfig(params: DirectoryConfigParams): Promise<ChannelDirectoryEntry[]>;
//#endregion
//#region extensions/buzz/directory-contract-api.d.ts
declare const buzzDirectoryContractPlugin: {
  id: string;
  directory: {
    listPeers: typeof listBuzzDirectoryPeersFromConfig;
    listGroups: typeof listBuzzDirectoryGroupsFromConfig;
  };
};
//#endregion
export { buzzDirectoryContractPlugin, listBuzzDirectoryGroupsFromConfig, listBuzzDirectoryPeersFromConfig };