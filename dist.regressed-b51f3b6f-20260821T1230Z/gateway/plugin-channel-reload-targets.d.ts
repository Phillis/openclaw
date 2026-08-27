import { r as ChannelId } from "../group-policy-Do4IaxCb.js";
//#region src/gateway/plugin-channel-reload-targets.d.ts
type ChannelPluginReloadTarget = {
  channelId: ChannelId;
  pluginId?: string | null;
  aliases?: readonly string[] | null;
};
/** Lists all config ids that should trigger reload for a channel plugin target. */
declare function listChannelPluginConfigTargetIds(target: ChannelPluginReloadTarget): ReadonlySet<string>;
/** Returns true when changed config paths affect any target plugin/channel id. */
declare function pluginConfigTargetsChanged(targetIds: Iterable<string>, changedPaths: readonly string[]): boolean;
//#endregion
export { listChannelPluginConfigTargetIds, pluginConfigTargetsChanged };