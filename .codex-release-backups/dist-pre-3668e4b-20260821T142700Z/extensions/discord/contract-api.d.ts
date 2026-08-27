import { n as DiscordInteractiveHandlerRegistration, t as DiscordInteractiveHandlerContext } from "../../interactive-dispatch-BxEqWp6G.js";

//#region extensions/discord/src/session-contract.d.ts
declare function deriveLegacySessionChatType(sessionKey: string): "channel" | undefined;
//#endregion
export { type DiscordInteractiveHandlerContext, type DiscordInteractiveHandlerRegistration, deriveLegacySessionChatType };