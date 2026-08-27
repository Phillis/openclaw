import { X as ChannelMessageActionContext } from "./setup-wizard-types-D4fC5oCf.js";
//#region extensions/discord/src/actions/runtime.messaging.shared.d.ts
type ConversationReadInvocationOrigin = NonNullable<ChannelMessageActionContext["conversationReadOrigin"]>;
type DiscordMessagingActionOptions = {
  mediaAccess?: ChannelMessageActionContext["mediaAccess"];
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  conversationReadOrigin?: ConversationReadInvocationOrigin;
  readContext?: {
    requesterAccountId?: string | null;
    currentChannelProvider?: string | null;
    currentChannelId?: string | null;
  };
};
//#endregion
export { DiscordMessagingActionOptions as t };