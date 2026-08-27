import { t as ChannelPlugin } from "./types.public-BY_aSVd6.js";
import { t as ResolvedTwitchAccount } from "./config-Bpb9CKTH.js";
//#region extensions/twitch/src/plugin.d.ts
/**
 * Twitch channel plugin.
 *
 * Implements the ChannelPlugin interface to provide Twitch chat integration
 * for OpenClaw. Supports message sending, receiving, access control, and
 * status monitoring.
 */
declare const twitchPlugin: ChannelPlugin<ResolvedTwitchAccount>;
//#endregion
export { twitchPlugin as t };