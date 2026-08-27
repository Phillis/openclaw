import { n as OpenClawConfig } from "./types.openclaw-DRR8P0H2.js";
import "./types-cxNMThub.js";
import "./channel-contract-Pji552cX.js";
import "./runtime-forwarders-DsCA1rRO.js";
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
export { DirectoryConfigParams as t };