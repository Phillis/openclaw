import { z as PluginRuntime } from "../../types-CCx6rk6K.js";
import { n as OpenClawConfig } from "../../types.openclaw-LvSHMCsQ.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../plugin-runtime-CXXAzr6k.js";
import { n as resolveNostrAccount, r as NostrProfile, t as ResolvedNostrAccount } from "../../types-CFBrM4Gd.js";
import { t as nostrPlugin } from "../../channel-jAumHYtL.js";
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