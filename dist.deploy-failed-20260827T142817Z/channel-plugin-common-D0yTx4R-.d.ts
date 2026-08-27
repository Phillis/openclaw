import { x as ChannelMeta } from "./types.core-D43joVXt.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
//#region src/channels/chat-meta-shared.d.ts
/**
 * Metadata shown for built-in chat channels in setup, status, and selection UIs.
 */
type ChatChannelMeta = ChannelMeta;
//#endregion
//#region src/channels/chat-meta.d.ts
/**
 * Returns metadata for one built-in chat channel id.
 * Shipped plugin-SDK contract: callers pass bundled ids, so absence is an invariant
 * violation; drift-tolerant core paths use findChatChannelMeta instead.
 */
declare function getChatChannelMeta(id: ChatChannelId): ChatChannelMeta;
//#endregion
export { getChatChannelMeta as t };