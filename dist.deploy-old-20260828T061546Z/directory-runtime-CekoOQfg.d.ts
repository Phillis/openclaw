import { n as OpenClawConfig } from "./types.openclaw-R2xZRh0U.js";
import "./types-BRhHKLsn.js";
import "./channel-contract-C7AAps4m.js";
import "./runtime-forwarders-BlPEJA5r.js";
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