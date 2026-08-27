import { r as OpenClawConfig } from "./types.openclaw-a_kGc1gJ.js";
import { a as SessionChatType, c as SessionEntry } from "./types-Byd4mWhx.js";
//#region src/sessions/send-policy.d.ts
/** Session send-policy decision after config and per-session overrides are evaluated. */
type SessionSendPolicyDecision = "allow" | "deny";
/** Resolves whether a session send is allowed by entry override and config rules. */
declare function resolveSendPolicy(params: {
  cfg: OpenClawConfig;
  entry?: SessionEntry;
  sessionKey?: string;
  channel?: string;
  chatType?: SessionChatType;
}): SessionSendPolicyDecision;
//#endregion
export { resolveSendPolicy as t };