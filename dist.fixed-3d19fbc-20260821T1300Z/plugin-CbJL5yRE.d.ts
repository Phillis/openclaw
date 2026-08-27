import { t as ChannelPlugin } from "./types.public-Ca4rxCP0.js";
import { t as ResolvedTwitchAccount } from "./config-Dn4i9rVZ.js";

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