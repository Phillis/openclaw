import { n as DiscordInteractiveHandlerRegistration, t as DiscordInteractiveHandlerContext } from "../../interactive-dispatch-Cygg1PkT.js";

//#region extensions/discord/src/session-contract.d.ts
declare function deriveLegacySessionChatType(sessionKey: string): "channel" | undefined;
//#endregion
export { type DiscordInteractiveHandlerContext, type DiscordInteractiveHandlerRegistration, deriveLegacySessionChatType };