import { u as PluginRuntime } from "../../plugin-entry-CX5-Xb96.js";
import { n as OpenClawConfig } from "../../types.openclaw-BZZbt-SF.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../plugin-runtime-D6Il1-it.js";
import "../../runtime-api-JmEn20mJ.js";
import { n as resolveNostrAccount, r as NostrProfile, t as ResolvedNostrAccount } from "../../types-DTsbx6Lv.js";
import { t as nostrPlugin } from "../../channel-Ci7mWiFo.js";
import { IncomingMessage, ServerResponse } from "node:http";
//#region extensions/nostr/src/nostr-profile-http.d.ts
interface NostrProfileHttpContext {
  /** Get current profile from config */
  getConfigProfile: (accountId: string) => NostrProfile | undefined;
  /** Update profile in config (after successful publish) */
  updateConfigProfile: (accountId: string, profile: NostrProfile) => Promise<void>;
  /** Get account's public key and relays */
  getAccountInfo: (accountId: string) => {
    pubkey: string;
    relays: string[];
  } | null;
  /** Logger */
  log?: {
    info: (msg: string) => void;
    warn: (msg: string) => void;
    error: (msg: string) => void;
  };
}
declare function createNostrProfileHttpHandler(ctx: NostrProfileHttpContext): (req: IncomingMessage, res: ServerResponse) => Promise<boolean>;
//#endregion
//#region extensions/nostr/src/runtime.d.ts
declare const setNostrRuntime: (next: PluginRuntime) => void, getNostrRuntime: () => PluginRuntime;
//#endregion
export { type OpenClawConfig, type PluginRuntime, type ResolvedNostrAccount, createNostrProfileHttpHandler, getNostrRuntime, getPluginRuntimeGatewayRequestScope, nostrPlugin, resolveNostrAccount, setNostrRuntime };