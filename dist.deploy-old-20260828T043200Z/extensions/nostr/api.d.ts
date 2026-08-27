import { u as PluginRuntime } from "../../plugin-entry-BZAeuuKK.js";
import { n as OpenClawConfig } from "../../types.openclaw-CZEJqSSW.js";
import { t as getPluginRuntimeGatewayRequestScope } from "../../plugin-runtime-DYJVcb_O.js";
import "../../runtime-api-X--aVKCV.js";
import { n as resolveNostrAccount, r as NostrProfile, t as ResolvedNostrAccount } from "../../types-BDPLhhx2.js";
import { t as nostrPlugin } from "../../channel-BeDOcCeb.js";
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