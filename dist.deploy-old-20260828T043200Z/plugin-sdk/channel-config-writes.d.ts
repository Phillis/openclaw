import "../types.core-Cp9FLfUP.js";
import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { B as authorizeConfigWrite, G as ConfigWriteTargetLike, H as formatConfigWriteDeniedMessage, U as ConfigWriteAuthorizationResultLike, V as canBypassConfigWritePolicy, W as ConfigWriteScopeLike } from "../types.adapters-B0aAZi8q.js";
import "../types.plugin-c3ODlhUq.js";
//#region src/plugin-sdk/channel-config-helpers.d.ts
/** Origin scope used when authorizing channel config writes. */
type ConfigWriteScope = ConfigWriteScopeLike;
/** Target account/channel for a config write authorization check. */
type ConfigWriteTarget = ConfigWriteTargetLike;
/** Decision returned by channel config write policy helpers. */
type ConfigWriteAuthorizationResult = ConfigWriteAuthorizationResultLike;
/** Returns whether config writes are enabled for a channel/account target. */
declare function resolveChannelConfigWrites(params: {
  cfg: OpenClawConfig;
  channelId?: string | null;
  accountId?: string | null;
}): boolean;
//#endregion
export { type ConfigWriteAuthorizationResult, type ConfigWriteScope, type ConfigWriteTarget, authorizeConfigWrite, canBypassConfigWritePolicy, formatConfigWriteDeniedMessage, resolveChannelConfigWrites };