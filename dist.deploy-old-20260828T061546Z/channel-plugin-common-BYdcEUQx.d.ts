import "./agent-harness-runtime-CESurA0d.js";
import { x as ChannelMeta } from "./types.core-CMY5bxhQ.js";
import { n as ChatChannelId } from "./channel-id.types-CjcGKHk0.js";
import "./types.plugin-B_jWpFWB.js";
import "./types.public-C6NHtWqx.js";
import "./config-schema-BccvCAt7.js";
import "./setup-helpers-BqTgpSq9.js";
import "./config-helpers-BuHGjaZg.js";
import "./helpers-DGOlajlw.js";
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