import { V as MarkdownTableMode, n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { bt as OutboundMediaAccess, j as ChunkMode } from "./setup-wizard-types-BJbOEFA2.js";
import { g as RequestClient } from "./discord-cCABK3Ro.js";
import { v as DiscordSendResult } from "./send.types-CMLzm4JP.js";
import { d as DiscordComponentBuildResult, h as DiscordComponentMessageSpec } from "./components-Dn-RRkXT.js";
import { i as DiscordReplyReference, t as DiscordAllowedMentions } from "./send.shared-CZbq5sJl.js";

//#region extensions/discord/src/send.components.d.ts
type DiscordComponentSendOpts = {
  cfg: OpenClawConfig;
  accountId?: string;
  token?: string;
  rest?: RequestClient;
  silent?: boolean;
  reply?: DiscordReplyReference;
  sessionKey?: string;
  agentId?: string;
  mediaUrl?: string;
  mediaAccess?: OutboundMediaAccess;
  mediaLocalRoots?: readonly string[];
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  filename?: string;
  textLimit?: number;
  maxLinesPerMessage?: number;
  tableMode?: MarkdownTableMode;
  chunkMode?: ChunkMode;
  suppressEmbeds?: boolean;
  allowedMentions?: DiscordAllowedMentions; /** Persist the concrete platform send before component bookkeeping can fail. */
  onDeliveryResult?: (result: DiscordSendResult) => Promise<void> | void;
  onPlatformSendDispatch?: () => Promise<void>;
};
declare function registerBuiltDiscordComponentMessage(params: {
  buildResult: DiscordComponentBuildResult;
  messageId: string;
  ttlMs?: number;
}): void;
declare function sendDiscordComponentMessage(to: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
declare function editDiscordComponentMessage(to: string, messageId: string, spec: DiscordComponentMessageSpec, opts: DiscordComponentSendOpts): Promise<DiscordSendResult>;
//#endregion
export { registerBuiltDiscordComponentMessage as n, sendDiscordComponentMessage as r, editDiscordComponentMessage as t };