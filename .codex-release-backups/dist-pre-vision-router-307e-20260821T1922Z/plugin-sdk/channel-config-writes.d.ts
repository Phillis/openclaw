import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { A as formatConfigWriteDeniedMessage, M as ConfigWriteScopeLike, N as ConfigWriteTargetLike, O as authorizeConfigWrite, j as ConfigWriteAuthorizationResultLike, k as canBypassConfigWritePolicy } from "../types.adapters-BQbR8pan.js";
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